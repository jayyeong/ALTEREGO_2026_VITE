import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const out=path.join(root,'public/optimized/videos');fs.mkdirSync(out,{recursive:true});
const manifest={};
for(const file of fs.readdirSync(path.join(root,'public/videos')).filter(x=>x.endsWith('.mp4')).sort()){
 const source=path.join(root,'public/videos',file);
 const hash=crypto.createHash('sha256').update(fs.readFileSync(source)).update('720p-crf22-poster-v1').digest('hex').slice(0,16);
 const video=path.join(out,hash+'.mp4'),poster=path.join(out,hash+'.webp');
 const run=args=>{const r=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y',...args],{encoding:'utf8'});if(r.status!==0)throw new Error(r.stderr);};
 if(!fs.existsSync(video))run(['-i',source,'-map','0:v:0','-map','0:a?','-vf',"scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2",'-c:v','libx264','-crf','22','-preset','medium','-threads','2','-c:a','aac','-b:a','128k','-movflags','+faststart',video]);
 if(!fs.existsSync(poster))run(['-ss','0.1','-i',source,'-frames:v','1','-vf','scale=960:-1','-c:v','libwebp','-quality','90',poster]);
 manifest['videos/'+file]={mobile:'optimized/videos/'+hash+'.mp4',poster:'optimized/videos/'+hash+'.webp',originalBytes:fs.statSync(source).size,mobileBytes:fs.statSync(video).size};
 console.log(file,manifest['videos/'+file].originalBytes,'->',manifest['videos/'+file].mobileBytes);
}
fs.writeFileSync(path.join(root,'src/data/video-previews.json'),JSON.stringify(manifest,null,2)+'\n');
