"""Genera los iconos de la app (vichy rojo y mantequilla con una estrella)."""
import math, os
from PIL import Image, ImageDraw
OUT = os.path.join(os.path.dirname(__file__), '..', 'icons')
os.makedirs(OUT, exist_ok=True)
def icon(size):
    S = 1024
    im = Image.new('RGB', (S, S), '#FFF8CA')
    ov = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    step = 128
    for i in range(0, S, step * 2):
        d.rectangle([i, 0, i + step - 1, S], fill=(107, 11, 12, 70))
        d.rectangle([0, i, S, i + step - 1], fill=(107, 11, 12, 70))
    im.paste(ov, (0, 0), ov)
    d = ImageDraw.Draw(im)
    c, r = S / 2, 330
    d.ellipse([c - r, c - r, c + r, c + r], fill='#6B0B0C')
    pts = []
    for k in range(16):
        a = math.radians(k * 22.5); rr = 230 if k % 2 == 0 else 95
        pts.append((c + rr * math.sin(a), c - rr * math.cos(a)))
    d.polygon(pts, fill='#FFF8CA')
    return im.resize((size, size), Image.LANCZOS)
for name, size in [('apple-touch-icon.png', 180), ('icon-192.png', 192), ('icon-512.png', 512)]:
    icon(size).save(os.path.join(OUT, name))
print('ok')
