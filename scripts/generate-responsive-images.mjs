import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
const root = fileURLToPath(new URL('../', import.meta.url));
const outputRoot = path.join(root, 'public/optimized/images');
const manifest = {};
const report = [];
const settings = { version: 1, quality: 88, effort: 4, sharp: sharp.versions.sharp };
async function walk(relative) {
  const files = [];
  for (const entry of await fs.readdir(path.join(root, relative), { withFileTypes: true })) {
    const name = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await walk(name));
    else if (/\.(webp|png|jpe?g)$/i.test(name)) files.push(name);
  }
  return files;
}
const sources = (await Promise.all(['src/assets', 'public/poster', 'public/image', 'public/lookbook', 'public/runway', 'public/runway-thumbnails', 'public/behind/thumbnails'].map(async p => {
  try { return await walk(p); } catch (e) { if (e.code === 'ENOENT') throw new Error(`Missing ${p}. Restore the complete media checkout before generating assets.`); throw e; }
}))).flat().sort();
await fs.mkdir(outputRoot, { recursive: true });
sharp.concurrency(2);
let cursor = 0;
async function worker() {
  while (cursor < sources.length) {
    const source = sources[cursor++];
    const input = await fs.readFile(path.join(root, source));
    const meta = await sharp(input).metadata();
    const width = meta.autoOrient?.width || meta.width;
    const height = meta.autoOrient?.height || meta.height;
    const profile = source.includes('/profile/');
    const poster = source.startsWith('public/poster/') || source === 'public/image/info-main-poster.webp';
    const candidates = profile ? [192,320,384,768] : poster ? [384,640,768,1440,2200] : [384,768,1440,2200];
    const widths = [...new Set(candidates.map(w => Math.min(w,width)))];
    const hash = crypto.createHash('sha256').update(input).update(JSON.stringify(settings)).digest('hex').slice(0,16);
    const variants = [];
    for (const w of widths) {
      const file = `${hash}-${w}.webp`;
      const output = path.join(outputRoot,file);
      try { await fs.access(output); } catch {
        await sharp(input).rotate().resize({ width:w, withoutEnlargement:true }).withIccProfile('srgb').webp({quality:settings.quality,effort:settings.effort}).toFile(output+'.tmp');
        await fs.rename(output+'.tmp',output);
      }
      variants.push({width:w,src:`optimized/images/${file}`,bytes:(await fs.stat(output)).size});
    }
    const key = source.replace(/^(src|public)\//,'');
    manifest[key] = {width,height,variants:variants.map(({width,src})=>({width,src}))};
    report.push({source,originalBytes:input.length,width,height,variants});
    if(report.length % 50===0)console.log(`Generated ${report.length}/${sources.length}`);
  }
}
await Promise.all([worker(),worker()]);
await fs.writeFile(path.join(root,'src/data/responsive-images.json'),JSON.stringify(Object.fromEntries(Object.entries(manifest).sort()))+'\n');
await fs.mkdir(path.join(root,'docs/performance-20260930'),{recursive:true});
await fs.writeFile(path.join(root,'docs/performance-20260930/image-generation.json'),JSON.stringify({settings,files:report.sort((a,b)=>a.source.localeCompare(b.source))},null,2)+'\n');
console.log(`Done: ${sources.length} source images; originals preserved.`);
