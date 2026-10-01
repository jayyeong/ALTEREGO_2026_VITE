import fs from 'node:fs';

// The SPA fallback starts only the current route's critical resources.
// Static generation replaces these scripts with direct per-page preload links.
export function criticalPreloads() {
  return {
    name: 'critical-preloads',
    transformIndexHtml: {
      order: 'post',
      handler(html, context) {
        if (!context.bundle) return html;
        const read = name => JSON.parse(fs.readFileSync(new URL(`../src/data/${name}.json`, import.meta.url)));
        const images = read('responsive-images');
        const routes = {};
        const image = (src, sizes) => {
          const entry = images[src.replace(/^\/2026\//, '').replace(/^\.?\//, '')];
          if (!entry) throw new Error(`Missing critical image: ${src}`);
          return [entry.variants.map(v => `/2026/${v.src} ${v.width}w`).join(', '), sizes];
        };
        routes['/show-info'] = [image('image/info-main-poster.webp', '(min-width: 1536px) 490px, (min-width: 1024px) 430px, 350px')];
        routes['/project'] = [image('poster/Limbo_poster.webp', '(min-width: 768px) 220px, 75vw')];
        for (const team of read('teams')) routes[`/team/${team.id}`] = [image(team.poster, '(min-width: 1024px) 32vw, (min-width: 768px) 340px, 290px')];
        for (const group of read('members')) for (const member of group.members) {
          const first = member.slides?.length ? member.slides[0] : {type: 'image', src: member.brochureImages?.[0]};
          routes[`/portfolio/${member.portfolioUrl}`] = [image(member.profileImageUrl, '171px')];
          if (first?.type === 'image' && first.src) routes[`/portfolio/${member.portfolioUrl}`].push(image(first.src, '(min-width: 1280px) 680px, (min-width: 1024px) 560px, (min-width: 768px) 280px, calc(100vw - 32px)'));
        }
        routes['/project/look-book'] = [1, 2, 3, 4].map(n => image(`lookbook/p${String(n).padStart(3, '0')}.webp`, '(min-width: 1024px) calc((100vw - 280px) / 2), 50vw'));
        const poster = `/2026/${read('video-previews')['videos/MainTeaser.mp4'].poster}`;
        const pageFiles = {};
        for (const chunk of Object.values(context.bundle)) {
          if (chunk.type !== 'chunk' || !chunk.facadeModuleId?.includes('/src/pages/')) continue;
          const dependencies = new Set();
          const visit = name => {
            if (dependencies.has(name)) return;
            dependencies.add(name);
            for (const dependency of context.bundle[name]?.imports || []) visit(dependency);
          };
          visit(chunk.fileName);
          pageFiles[chunk.facadeModuleId.split('/').at(-1).replace('.jsx', '')] = [...dependencies];
        }
        const fonts = Object.keys(context.bundle).filter(name => /\/(open-sans-latin|pretendard-content)-.*\.woff2$/.test(name));
        if (fonts.length !== 2) throw new Error('Critical font assets not found');
        const fontLinks = fonts.filter(name => name.includes('open-sans-latin')).map(name => `<link rel="preload" as="font" type="font/woff2" crossorigin href="/2026/${name}">`).join('');
        const routeFonts = read('route-fonts');
        const fontScript = `<script id="kuad-route-font">(()=>{const p=location.pathname.replace(/^\\/2026/, '').replace(/\\/$/, '')||'/';const fonts=${JSON.stringify(routeFonts)};const f=fonts[p];if(!f)return;const url='/2026/'+f.src;const l=document.createElement('link');l.rel='preload';l.as='font';l.type='font/woff2';l.crossOrigin='';l.href=url;document.head.append(l);const s=document.createElement('style');s.textContent='@font-face{font-family:AppFont;src:url("'+url+'") format("woff2");font-weight:100 900;font-style:normal;font-display:swap;unicode-range:'+Array.from(f.chars,c=>'U+'+c.codePointAt(0).toString(16)).join(',')+'}';document.head.append(s)})();</script>`;
        const script = `<script id="kuad-image-preloads">(()=>{const p=location.pathname.replace(/^\\/2026/, '').replace(/\\/$/, '')||'/';const r=${JSON.stringify(routes)};const add=(a)=>{const l=document.createElement('link');l.rel='preload';l.as='image';l.fetchPriority='high';Object.assign(l,a);document.head.append(l)};if(p==='/')add({href:${JSON.stringify(poster)}});for(const [imageSrcset,imageSizes] of r[p]||[])add({imageSrcset,imageSizes})})();</script>`;
        const moduleScript = `<script id="kuad-route-modules">(()=>{const p=location.pathname.replace(/^\\/2026/, '').replace(/\\/$/, '')||'/';const names={'/show-info':'ShowInfo','/project':'ProjectPage','/project/look-book':'LookBook','/project/runway':'Runway','/behind':'BehindShow','/archive':'ArchivePage','/admin':'AdminLogin','/admin/dashboard':'AdminDashboard'};const name=names[p]||(p.startsWith('/team/')?'TeamPage':p.startsWith('/portfolio/')?'PortfolioPage':p.startsWith('/admin/receipt/')?'AdminReceiptDetail':'');const files=${JSON.stringify(pageFiles)};for(const file of files[name]||[]){const l=document.createElement('link');l.rel='modulepreload';l.href='/2026/'+file;l.crossOrigin='';document.head.append(l)}})();</script>`;
        // Responsive preloads must follow the viewport declaration: before it,
        // mobile browsers select desktop-sized candidates and download twice.
        const inlineStyles = html.replace(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g, (tag, href) => {
          const asset = context.bundle[href.replace('/2026/', '')];
          if (!asset || asset.type !== 'asset') throw new Error(`Missing stylesheet: ${href}`);
          return `<style>${asset.source}</style>`;
        });
        return inlineStyles
          .replace(/<meta\s+name="viewport"[^>]*>/, match => `${match}${script}${fontLinks}${moduleScript}`)
          // The route face must follow the stylesheet's complete fallback faces.
          .replace('</head>', `${fontScript}</head>`);
      },
    },
  };
}
