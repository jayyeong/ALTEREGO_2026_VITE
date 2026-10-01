import vm from 'node:vm';

const start = '  // KUAD_2026_STATIC_START';
const end = '  // KUAD_2026_STATIC_END';
const section = /  \/\/ KUAD_2026_STATIC_START[\s\S]*?  \/\/ KUAD_2026_STATIC_END\n?/g;

export function staticRoutingCode(currentCode, routeMap) {
  const matches = currentCode.match(section) || [];
  if (matches.length > 1) throw new Error('Multiple static routing sections');
  const base = currentCode.replace(section, '');
  const anchor = '  var uri = request.uri;\n';
  if (base.split(anchor).length !== 2) throw new Error('Unexpected CloudFront function structure');
  const routes = Object.keys(routeMap);
  for (const route of routes) {
    if (!/^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/.test(route)) throw new Error(`Unsafe static route: ${route}`);
    const slug = route === '/' ? 'home' : route.slice(1).replaceAll('/', '__');
    if (routeMap[route] !== `/2026/pages/${slug}.html`) throw new Error(`Unexpected static target: ${route}`);
  }
  const block = `${start}\n  var static2026Paths = ${JSON.stringify(routes)};\n  if (uri.indexOf('/2026/') === 0) {\n    var staticPath = uri.slice(5).replace(/\\/$/, '') || '/';\n    if (static2026Paths.indexOf(staticPath) !== -1) {\n      var staticSlug = staticPath === '/' ? 'home' : staticPath.slice(1).replace(/\\//g, '__');\n      request.uri = '/2026/pages/' + staticSlug + '.html';\n      return request;\n    }\n  }\n${end}\n`;
  const code = base.replace(anchor, anchor + block);
  if (Buffer.byteLength(code) > 10000) throw new Error('CloudFront function exceeds 10 KB');
  validateRouting(base, code, routeMap);
  return code;
}

export function validateRouting(base, candidate, routeMap) {
  const compile = code => vm.runInNewContext(code + '\nhandler', {}, { timeout: 1000 });
  const before = compile(base);
  const after = compile(candidate);
  const event = uri => ({ request: { method: 'GET', uri, querystring: {}, headers: {}, cookies: {} } });
  for (const [route, expected] of Object.entries(routeMap)) {
    for (const suffix of route === '/' ? [''] : ['', '/']) {
      const uri = '/2026' + route + suffix;
      if (after(event(uri)).uri !== expected) throw new Error(`Static routing failed: ${uri}`);
    }
  }
  const unchanged = ['/', '/2024', '/2025', '/2026', '/2024/', '/2025/', '/2024/project/test', '/2025/portfolio/test', '/2026/admin', '/2026/admin/dashboard', '/2026/admin/receipt/test', '/2026/store', '/2026/store/all', '/2026/checkout', '/2026/opening-soon', '/2026/behind/show', '/2026/does-not-exist', '/2026/portfolio/not-a-member', '/2026/assets/test.js', '/2026/optimized/fonts/test.woff2', '/favicon.ico'];
  for (const uri of unchanged) {
    if (JSON.stringify(before(event(uri))) !== JSON.stringify(after(event(uri)))) throw new Error(`Existing routing changed: ${uri}`);
  }
  return { staticRoutes: Object.keys(routeMap).length, unchangedRoutes: unchanged.length };
}
