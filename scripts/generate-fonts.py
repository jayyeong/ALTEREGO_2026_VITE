"""Run with fonttools[woff]. Preserves all previously supported Hangul/Latin glyphs."""
from pathlib import Path
import json
from fontTools import subset
from fontTools.ttLib import TTFont
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'src/fonts/optimized'
OUT.mkdir(exist_ok=True)
def supported(c):
    return any(a<=c<=b for a,b in [(0xAC00,0xD7A3),(0x1100,0x11FF),(0x3130,0x318F),(0xA960,0xA97F),(0xD7B0,0xD7FF)])
text=''.join(p.read_text() for p in (ROOT/'src').rglob('*') if p.is_file() and p.suffix in ['.jsx','.js','.json'] and p.name!='responsive-images.json')
source=ROOT/'src/fonts/PretendardVariable.ttf'
allchars={c for c in TTFont(source).getBestCmap() if supported(c)}
common=allchars & {ord(c) for c in text}
def ranges(chars):
    groups=[]
    for c in sorted(chars):
        if groups and c==groups[-1][1]+1: groups[-1][1]=c
        else: groups.append([c,c])
    return ','.join(f'U+{a:X}'+(f'-{b:X}' if a!=b else '') for a,b in groups)
css=[]
report=[]
def write(src,chars,name):
    options=subset.Options(); options.flavor='woff2'; options.layout_features=['*']
    font=subset.load_font(str(src),options)
    tool=subset.Subsetter(options=options);tool.populate(unicodes=chars);tool.subset(font)
    subset.save_font(font,str(OUT/name),options)
    css.append('@font-face {\n  font-family: "AppFont";\n  src: url("./'+name+'") format("woff2");\n  font-weight: 100 900;\n  font-style: normal;\n  font-display: swap;\n  unicode-range: '+ranges(chars)+';\n}\n')
    report.append({'file':name,'bytes':(OUT/name).stat().st_size,'glyphCoverage':len(chars)})
write(source,common,'pretendard-content.woff2')
# Disjoint ranges ensure new text still renders in Pretendard instead of silently falling back.
remaining=allchars-common
for block in sorted({c//512 for c in remaining}):
    chars={c for c in remaining if c//512==block}
    write(source,chars,f'pretendard-fallback-{block:x}.woff2')
latin=ROOT/'src/fonts/OpenSans-VariableFont_wght.ttf'
chars={c for c in TTFont(latin).getBestCmap() if c<=0x024F or 0x1E00<=c<=0x1EFF}
write(latin,chars,'open-sans-latin.woff2')
(OUT/'fonts.css').write_text('\n'.join(css))
(ROOT/'docs/performance-20260930').mkdir(parents=True,exist_ok=True)
(ROOT/'docs/performance-20260930/font-generation.json').write_text(json.dumps({'commonKoreanCharacters':len(common),'files':report},indent=2)+'\n')
print(json.dumps({'commonKoreanCharacters':len(common),'commonFontBytes':report[0]['bytes'],'latinFontBytes':report[-1]['bytes'],'preservedKoreanCharacters':len(allchars)}))
