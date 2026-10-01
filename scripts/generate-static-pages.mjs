import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
process.env.NODE_ENV = 'production';
const { createServer, loadEnv } = await import('vite');
const env = loadEnv('production', root, 'VITE_');
const routeMap = {};
const locked = env.VITE_STORE_ONLY_MODE === 'true' || process.env.VITE_STORE_ONLY_MODE === 'true';
const server = await createServer({
  root, mode: 'production', appType: 'custom', server: { middlewareMode: true },
  ssr: { noExternal: ['react-router', 'react-router-dom'], resolve: { conditions: ['module', 'import', 'production'] } },
});
try {
  if (!locked) {
    const { render } = await server.ssrLoadModule('/src/prerender.jsx');
    const fonts = JSON.parse(await fs.readFile(path.join(root, 'src/data/route-fonts.json')));
    const teams = JSON.parse(await fs.readFile(path.join(root, 'src/data/teams.json')));
    const groups = JSON.parse(await fs.readFile(path.join(root, 'src/data/members.json')));
    const videos = JSON.parse(await fs.readFile(path.join(root, 'src/data/video-previews.json')));
    const assets = JSON.parse(await fs.readFile(path.join(root, 'dist/.vite/manifest.json')));
    const template = (await fs.readFile(path.join(root, 'dist/index.html'), 'utf8'))
      .replace(/<script id="kuad-(?:image-preloads|route-modules|route-font)">[\s\S]*?<\/script>/g, '');
    const pages = { '/show-info': 'ShowInfo', '/project': 'ProjectPage', '/project/look-book': 'LookBook', '/project/runway': 'Runway', '/behind': 'BehindShow', '/archive': 'ArchivePage' };
    await fs.mkdir(path.join(root, 'dist/pages'), { recursive: true });
    const routes = ['/', ...Object.keys(pages), ...teams.map(t => '/team/' + t.id), ...groups.flatMap(g => g.members.map(m => '/portfolio/' + m.portfolioUrl)), '/store-closed'];
    for (const route of new Set(routes)) {
      let content = await render('/2026' + (route === '/' ? '/' : route));
      if (!content || content.includes('/src/assets/') || content.includes('<script') || /<!--\$[?!]-->/.test(content)) {
        throw new Error(`Incomplete static page: ${route}`);
      }
      const hints = [];
      if (route === '/') hints.push(`<link rel="preload" as="image" fetchpriority="high" href="/2026/${videos['videos/MainTeaser.mp4'].poster}">`);
      content = content.replace(/<link\b[^>]*\brel="preload"[^>]*\/?>(?:<\/link>)?/g, tag => { hints.push(tag); return ''; });
      const page = pages[route] || (route.startsWith('/team/') ? 'TeamPage' : route.startsWith('/portfolio/') ? 'PortfolioPage' : null);
      const dependencies = new Set();
      const visit = key => {
        const entry = assets[key];
        if (!entry || dependencies.has(entry.file)) return;
        dependencies.add(entry.file);
        for (const dependency of entry.imports || []) visit(dependency);
      };
      if (page) visit(`src/pages/${page}.jsx`);
      for (const file of dependencies) hints.push(`<link rel="modulepreload" crossorigin href="/2026/${file}">`);
      const font = fonts[route];
      let face = '';
      if (font) {
        hints.push(`<link rel="preload" as="font" type="font/woff2" crossorigin href="/2026/${font.src}">`);
        const range = Array.from(font.chars, c => 'U+' + c.codePointAt(0).toString(16)).join(',');
        face = `<style>@font-face{font-family:AppFont;src:url("/2026/${font.src}") format("woff2");font-weight:100 900;font-style:normal;font-display:swap;unicode-range:${range}}</style>`;
      }
      const html = template
        .replace(/<meta\s+name="viewport"[^>]*>/, match => match + hints.join(''))
        .replace('</head>', face + '</head>')
        .replace('<div id="root"></div>', `<div id="root">${content}</div>`);
      const slug = route === '/' ? 'home' : route.slice(1).replaceAll('/', '__');
      const file = `pages/${slug}.html`;
      await fs.writeFile(path.join(root, 'dist', file), html);
      routeMap[route] = '/2026/' + file;
    }
  }
  await fs.writeFile(path.join(root, 'dist/route-map.json'), JSON.stringify(routeMap, null, 2) + '\n');
  console.log(`Generated ${Object.keys(routeMap).length} static public pages; index.html remains the SPA fallback.`);
} finally {
  await server.close();
}
