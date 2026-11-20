"""Lee el calendario de entrenos (iCal de Google Calendar) y guarda los próximos en entrenos.json.
El enlace llega por el secreto ENTRENOS_ICS, para que no quede escrito en el código público."""
import json, os, sys, re, datetime, urllib.request
from zoneinfo import ZoneInfo
import icalendar, recurring_ical_events

TZ = ZoneInfo('Europe/Madrid')
out_path = sys.argv[1] if len(sys.argv) > 1 else 'entrenos.json'
url = os.environ.get('ICS_URL', '').strip()
if url.lower().startswith('webcal://'):
    url = 'https://' + url[9:]
items = []
if url:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (compatible; MiCuaderno/1.0)'})
    cal = icalendar.Calendar.from_ical(urllib.request.urlopen(req, timeout=30).read())
    today = datetime.datetime.now(TZ).date()
    start, end = today - datetime.timedelta(days=21), today + datetime.timedelta(days=90)
    GYM = re.compile(r'fuerza|gym|gimnasio|crossfit|pilates|pesas|core|strength', re.I)
    for ev in recurring_ical_events.of(cal).between(start, end):
        ds = ev.get('DTSTART').dt
        if isinstance(ds, datetime.datetime):
            ds = ds.astimezone(TZ) if ds.tzinfo else ds.replace(tzinfo=TZ)
            date, h = ds.date().isoformat(), ds.strftime('%H:%M')
        else:
            date, h = ds.isoformat(), ''
        title = str(ev.get('SUMMARY', '')).strip() or 'Entreno'
        desc = str(ev.get('DESCRIPTION', '')).strip()
        desc = re.sub(r'<br\s*/?>', '\n', desc, flags=re.I)
        desc = re.sub(r'<[^>]+>', '', desc).replace('&nbsp;', ' ').strip()
        items.append({
            'id': f"{ev.get('UID', title)}|{date}",
            'date': date, 'h': h, 't': title, 'desc': desc,
            'loc': str(ev.get('LOCATION', '')).strip(),
            'k': 'gym' if GYM.search(title + ' ' + desc[:120]) else 'run',
        })
    items.sort(key=lambda x: (x['date'], x['h'] or '99'))
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump({'updated': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='minutes'), 'items': items}, f, ensure_ascii=False)
print(f'{len(items)} entrenos' if url else 'Sin enlace de calendario (secreto ENTRENOS_ICS vacío)')
if items:
    print(f"correr: {sum(x['k']=='run' for x in items)} · fuerza: {sum(x['k']=='gym' for x in items)} · con descripción: {sum(bool(x['desc']) for x in items)} · con hora: {sum(bool(x['h']) for x in items)}")
