#!/usr/bin/env python3
# Noto-Emojis in Stil A umsetzen (Prototyp vom 01.11.2026, vom Auftraggeber freigegeben: „Gut so, für alle“).
# Regeln (nicht ändern ohne Rückfrage):
#  - Verläufe → zwei harte Farbstufen (Lichtton = Farbe bei 25 %, Grundton = Farbe bei 70 %, Grenze bei 48 %), wie die Toon-Grafik der Insel
#  - dünne Lerninsel-Kontur außen herum: SVG-Filter feMorphology (dilate, radius 2.6 im 128er-Raster), Farbe #3B1F63
#  - viewBox "-4 -4 136 136" (Platz für die Kontur), alle ids je Bild eindeutig (Präfix)
# Aufruf:  python3 -I quellen/noto-stil-a.py <noto-sprite.svg> <liste.json> <ausgabe.js> [<ordner mit fehlenden SVGs>]
#   noto-sprite.svg: sprites/all.svg aus dem npm-Paket @svgmoji/noto (Noto-Bilder, Apache 2.0)
#   liste.json:      quellen/icons/liste.json (die 784 Emojis der App)
#   ausgabe.js:      z. B. shared/icons.js (window.LERN_ICONS = { "<hex ohne fe0f>": "<svg…>" })
#   ordner:          optional einzelne Noto-SVGs (emoji_u<hex>.svg aus github.com/googlefonts/noto-emoji/svg) für Emojis, die im Sprite fehlen
import json, os, re, sys

def rgb(c):
    c = c.strip().strip('#')
    if len(c) == 3: c = ''.join(x * 2 for x in c)
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4)) if re.fullmatch(r'[0-9a-fA-F]{6}', c) else None

def stufen(body):
    stops = re.findall(r'<stop[^>]*?offset="([^"]+)"[^>]*?stop-color="([^"]+)"[^>]*/?>', body)
    if not stops:
        stops = [(m.group(2), m.group(1)) for m in re.finditer(r'<stop[^>]*?stop-color="([^"]+)"[^>]*?offset="([^"]+)"', body)]
    pts = []
    for o, c in stops:
        o = float(o.rstrip('%')) / (100 if o.endswith('%') else 1); col = rgb(c)
        if col: pts.append((o, col))
    if not pts: return None
    pts.sort()
    def bei(t):
        if t <= pts[0][0]: return pts[0][1]
        for (a, ca), (b, cb) in zip(pts, pts[1:]):
            if a <= t <= b:
                k = (t - a) / (b - a) if b > a else 0
                return tuple(round(ca[i] + (cb[i] - ca[i]) * k) for i in range(3))
        return pts[-1][1]
    h = '#%02X%02X%02X' % bei(.25); g = '#%02X%02X%02X' % bei(.7)
    return '<stop offset="0" stop-color="%s"/><stop offset=".48" stop-color="%s"/><stop offset=".48" stop-color="%s"/><stop offset="1" stop-color="%s"/>' % (h, h, g, g)

def stil_a(svg, praefix):
    inner = re.sub(r'^<svg[^>]*>|</svg>$', '', svg.strip(), flags=re.S)
    def gr(m):
        neu = stufen(m.group(3))
        return m.group(0) if not neu else '<%s%s>%s</%s>' % (m.group(1), m.group(2), neu, m.group(1))
    inner = re.sub(r'<(linearGradient|radialGradient)([^>]*)>(.*?)</\1>', gr, inner, flags=re.S)
    for i in sorted(set(re.findall(r'id="([^"]+)"', inner)), key=len, reverse=True):
        inner = inner.replace('id="%s"' % i, 'id="%s%s"' % (praefix, i)).replace('#%s)' % i, '#%s%s)' % (praefix, i)).replace('"#%s"' % i, '"#%s%s"' % (praefix, i))
    flt = ('<filter id="%sk" x="-10%%" y="-10%%" width="120%%" height="120%%"><feMorphology in="SourceAlpha" operator="dilate" radius="2.6" result="d"/>'
           '<feFlood flood-color="#3B1F63"/><feComposite in2="d" operator="in" result="r"/><feMerge><feMergeNode in="r"/><feMergeNode in="SourceGraphic"/></feMerge></filter>') % praefix
    return ('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-4 -4 136 136"><defs>%s</defs>'
            '<g filter="url(#%sk)">%s</g></svg>') % (flt, praefix, re.sub(r'\s+', ' ', inner))

def main():
    sprite, liste, aus = sys.argv[1:4]; extra = sys.argv[4] if len(sys.argv) > 4 else None
    noto = open(sprite, encoding='utf8').read()
    emojis = [e for teil in json.load(open(liste, encoding='utf8')).values() for e, *_ in teil]
    hexk = lambda e: '-'.join('%x' % ord(c) for c in e if c != '️')
    alle, fehlt = {}, []
    for e in emojis:
        h = hexk(e)
        m = re.search(r'(<svg[^>]*? id="%s"[^>]*>.*?</svg>)' % re.escape(h.upper()), noto, re.S)
        svg = m.group(1) if m else None
        if not svg and extra:
            f = os.path.join(extra, 'emoji_u%s.svg' % h.replace('-', '_'))
            if os.path.exists(f): svg = open(f, encoding='utf8').read()
        if not svg: fehlt.append(e); continue
        alle[h] = stil_a(svg, 'n' + h.replace('-', '') + '-')
    js = ('// GEBAUT von quellen/noto-stil-a.py – nicht von Hand ändern. Noto-Emojis (Google, Apache 2.0, verändert: Stil A der Lerninsel).\n'
          'window.LERN_ICONS = %s;\n') % json.dumps(alle, ensure_ascii=False)
    open(aus, 'w', encoding='utf8').write(js)
    print('%d Bilder, %d fehlen: %s' % (len(alle), len(fehlt), ''.join(fehlt)))

if __name__ == '__main__': main()
