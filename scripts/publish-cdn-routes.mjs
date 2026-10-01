import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { staticRoutingCode } from './cdn-routing.mjs';

const name = 'kuadarchive-year-rewrite';
const distribution = process.env.CLOUDFRONT_DISTRIBUTION_ID;
if (!distribution) throw new Error('CLOUDFRONT_DISTRIBUTION_ID is required');
const aws = args => JSON.parse(execFileSync('aws', [...args, '--output', 'json'], { encoding: 'utf8' }));
const config = aws(['cloudfront', 'get-distribution-config', '--id', distribution]).DistributionConfig;
if (!config.Aliases?.Items?.includes('kuadarchive.com') || !config.DefaultCacheBehavior.FunctionAssociations?.Items?.some(f => f.FunctionARN.endsWith('/' + name))) {
  throw new Error('The configured distribution is not the expected KUAD site');
}
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'kuad-cdn-'));
try {
  const liveFile = path.join(directory, 'live.js');
  const devFile = path.join(directory, 'development.js');
  const live = aws(['cloudfront', 'get-function', '--name', name, '--stage', 'LIVE', liveFile]);
  const dev = aws(['cloudfront', 'get-function', '--name', name, '--stage', 'DEVELOPMENT', devFile]);
  const description = aws(['cloudfront', 'describe-function', '--name', name, '--stage', 'DEVELOPMENT']);
  const current = fs.readFileSync(liveFile, 'utf8');
  const development = fs.readFileSync(devFile, 'utf8');
  const routes = JSON.parse(fs.readFileSync('dist/route-map.json', 'utf8'));
  const code = staticRoutingCode(current, routes);
  if (development !== current && development !== code) throw new Error('An unrelated unpublished CloudFront change exists');
  fs.mkdirSync('.deployment', { recursive: true });
  fs.writeFileSync('.deployment/cloudfront-before.json', JSON.stringify({ ...live, FunctionCode: current, FunctionConfig: description.FunctionSummary.FunctionConfig }, null, 2));
  fs.writeFileSync('.deployment/cloudfront-after.js', code);
  if (code === current) {
    console.log('CloudFront static routes already match the build.');
  } else {
    const candidate = path.join(directory, 'candidate.js');
    fs.writeFileSync(candidate, code);
    const updated = aws(['cloudfront', 'update-function', '--name', name, '--if-match', dev.ETag, '--function-config', JSON.stringify(description.FunctionSummary.FunctionConfig), '--function-code', 'fileb://' + candidate]);
    for (const uri of ['/2026/', '/2026/portfolio/eunsoo-choi', '/2024/project/test']) {
      const testFile = path.join(directory, 'event.json');
      fs.writeFileSync(testFile, JSON.stringify({ version: '1.0', context: { eventType: 'viewer-request' }, viewer: { ip: '192.0.2.1' }, request: { method: 'GET', uri, querystring: {}, headers: { host: { value: 'kuadarchive.com' } }, cookies: {} } }));
      const result = aws(['cloudfront', 'test-function', '--name', name, '--if-match', updated.ETag, '--stage', 'DEVELOPMENT', '--event-object', 'fileb://' + testFile]).TestResult;
      if (result.FunctionErrorMessage) throw new Error(result.FunctionErrorMessage);
      const output = JSON.parse(result.FunctionOutput);
      const expected = uri.startsWith('/2024/') ? '/2024/index.html' : (routes[uri.slice(5)] || '/2026/index.html');
      if ((output.uri || output.request?.uri) !== expected) throw new Error(`CloudFront test failed: ${uri}`);
    }
    aws(['cloudfront', 'publish-function', '--name', name, '--if-match', updated.ETag]);
    console.log(`Published ${Object.keys(routes).length} static routes; other year and SPA routing preserved.`);
  }
} finally {
  fs.rmSync(directory, { recursive: true, force: true });
}
