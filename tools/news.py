"""Recoge cada mañana los titulares principales de varios periódicos (RSS) y los guarda en news.json."""
import json, sys, re, html, urllib.request, datetime
import xml.etree.ElementTree as ET

FEEDS = [
    ('España', 'El País', 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada'),
    ('España', 'El Mundo', 'https://e00-elmundo.uecdn.es/elmundo/rss/portada.xml'),
    ('España', 'elDiario.es', 'https://www.eldiario.es/rss/'),
    ('España', 'La Vanguardia', 'https://www.lavanguardia.com/rss/home.xml'),
    ('Mundo', 'BBC Mundo', 'https://feeds.bbci.co.uk/mundo/rss.xml'),
    ('Mundo', 'El País Internacional', 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/internacional/portada'),
    ('Euskadi', 'EITB', 'https://www.eitb.eus/es/rss/noticias/'),
    ('Euskadi', 'El Correo', 'https://www.elcorreo.com/rss/2.0/portada'),
]
PER_FEED = 3

def clean(t):
    t = html.unescape(re.sub(r'<[^>]+>', '', t or '')).strip()
    return re.sub(r'\s+', ' ', t)

def read(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (compatible; MiCuadernoNews/1.0)'})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read()

items, ok = [], []
for sec, src, url in FEEDS:
    try:
        root = ET.fromstring(read(url))
        entries = root.findall('.//item') or root.findall('.//{http://www.w3.org/2005/Atom}entry')
        n = 0
        for e in entries:
            title = clean(e.findtext('title') or e.findtext('{http://www.w3.org/2005/Atom}title'))
            link = (e.findtext('link') or '').strip()
            if not link:
                l = e.find('{http://www.w3.org/2005/Atom}link')
                link = l.get('href') if l is not None else ''
            if not title or not link.startswith('http'):
                continue
            items.append({'s': sec, 'src': src, 't': title, 'u': link, 'rank': n})
            n += 1
            if n >= PER_FEED:
                break
        ok.append(f'{src}: {n}')
    except Exception as ex:
        ok.append(f'{src}: ERROR {type(ex).__name__}')

# Primero el titular principal de cada periódico, luego el segundo, etc.
items.sort(key=lambda x: x['rank'])
for x in items:
    x.pop('rank')
out = {'updated': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='minutes'), 'items': items}
path = sys.argv[1] if len(sys.argv) > 1 else 'news.json'
with open(path, 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False)
print('\n'.join(ok))
print(f'{len(items)} titulares')
