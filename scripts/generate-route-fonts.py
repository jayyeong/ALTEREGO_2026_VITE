"""Generate first-visit Hangul subsets; the complete fallback font stays available."""
from pathlib import Path
import hashlib
import json
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'src/fonts/PretendardVariable.ttf'
OUT = ROOT / 'public/optimized/fonts'
OUT.mkdir(parents=True, exist_ok=True)
supported = set(TTFont(ROOT / 'src/fonts/optimized/pretendard-content.woff2').getBestCmap())
read = lambda name: (ROOT / 'src' / name).read_text()
header = read('components/Header.jsx')
teams = json.loads(read('data/teams.json'))
groups = json.loads(read('data/members.json'))
routes = {}

def add(route, page, data=''):
    text = header + read('pages/' + page + '.jsx') + json.dumps(data, ensure_ascii=False)
    chars = supported & {ord(c) for c in text}
    options = subset.Options()
    options.flavor = 'woff2'
    options.layout_features = ['*']
    font = subset.load_font(str(SOURCE), options)
    tool = subset.Subsetter(options=options)
    tool.populate(unicodes=chars)
    tool.subset(font)
    import io
    stream = io.BytesIO()
    subset.save_font(font, stream, options)
    content = stream.getvalue()
    name = hashlib.sha256(content).hexdigest()[:16] + '.woff2'
    (OUT / name).write_bytes(content)
    routes[route] = {'src': 'optimized/fonts/' + name, 'chars': ''.join(chr(c) for c in sorted(chars))}
    print(route, len(chars), len(content), flush=True)

# Home's later slides use the complete existing fallback when first requested.
for route, page in [('/', 'Home'), ('/show-info', 'ShowInfo'), ('/project', 'ProjectPage'),
                    ('/project/look-book', 'LookBook'), ('/project/runway', 'Runway'),
                    ('/behind', 'BehindShow'), ('/archive', 'ArchivePage')]:
    add(route, page, [m["name"] for g in groups for m in g["members"]] if page == "Runway" else "")
for team in teams:
    group = next(g for g in groups if g['teamPageUrl'] == team['id'])
    add('/team/' + team['id'], 'TeamPage', [team, [m['name'] for m in group['members']]])
for group in groups:
    for member in group['members']:
        add('/portfolio/' + member['portfolioUrl'], 'PortfolioPage', member)
(ROOT / 'src/data/route-fonts.json').write_text(json.dumps(routes, ensure_ascii=False, separators=(',', ':')) + '\n')
