#!/usr/bin/env python3
# Noto-Emojis in Stil A umsetzen (vom Auftraggeber freigegeben am 01.11.2026: „Gut so, für alle“).
# Regeln (nicht ändern ohne Rückfrage):
#  - Verläufe → zwei harte Farbstufen (Lichtton = Farbe bei 25 %, Grundton = Farbe bei 70 %, Grenze bei 48 %), wie die Toon-Grafik der Insel
#  - dünne Lerninsel-Kontur außen herum, Farbe #3B1F63, 5,2 Einheiten breit im 128er-Raster (= Radius 2,6 wie im ersten Entwurf mit Filter)
#  - viewBox "-4 -4 136 136" (Platz für die Kontur), alle ids je Bild eindeutig (Präfix n<hex>-; emoji.js hängt je Anzeige noch eine Nummer an)
# Kontur ohne SVG-Filter (schneller auf dem iPad): Die Formen stehen einmal in <defs> als <g id="…b"> und werden zweimal mit <use> gezeichnet.
# Jede Farbe steht als style="fill:var(--k,<farbe>)"; die hintere Kopie setzt --k auf die Konturfarbe und --w auf die Konturbreite
# (stroke-width:calc(<breite>px + var(--w,0px))), so wird sie zur dunklen, etwas dickeren Silhouette hinter dem Bild.
# Zahlen in Pfaden werden auf eine Nachkommastelle gerundet (über absolute Koordinaten, damit sich nichts aufsummiert). Ganze Zahlen (GENAU = 0)
# sparen weitere 25 %, verschieben aber Kanten um bis zu einen Gerätepixel (gemessen 07.11.2026: im Mittel 4 % der Bildpunkte deutlich anders) – nein.
# Aufruf:  python3 -I quellen/noto-stil-a.py [quellen/noto] [quellen/icons/liste.json] [shared] [--voll <datei.json>]
#   schreibt shared/icons/<teil>-<n>.js (Häppchen) und shared/icons-liste.js; --voll legt zusätzlich alle SVGs vollständig als JSON ab (Vergleiche)
#   quellen/noto: Original-SVGs <hex>.svg (geholt mit quellen/noto-holen.py, Noto Emoji von Google, Apache 2.0)
#   Ausnahmen: AUSNAHMEN unten (hex → Sonderbehandlung) für Bilder, die mit den Regeln nicht gut aussehen.
import json, math, os, re, sys, zlib

KONTUR, BREITE = '#3B1F63', 5.2
# Wangen (rosa/rote Verläufe, die ins Durchsichtige auslaufen) – im Spiel verboten, sie werden entfernt
WANGEN = {'ff4747', 'ed7770'}
# hex → {"breite": Faktor für die Kontur}  (z. B. sehr feine Bilder etwas dünner)
AUSNAHMEN = {}

def rgb(c):
    c = c.strip().strip('#')
    if len(c) == 3: c = ''.join(x * 2 for x in c)
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4)) if re.fullmatch(r'[0-9a-fA-F]{6}', c) else None

def stufen(body):
    stops = []
    for s in re.findall(r'<stop\b[^>]*>', body):
        o = re.search(r'offset="([^"]+)"', s); c = re.search(r'stop-color="([^"]+)"', s)
        if not c: c = re.search(r'stop-color:\s*([#\w]+)', s)
        if o and c: stops.append((o.group(1), c.group(1)))
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
    # zwei Stopps genügen: vor dem ersten und nach dem letzten Stopp gilt dessen Farbe (SVG-Regel) – gleiches Bild wie vorher mit vier Stopps
    return '<stop offset=".48" stop-color="%s"/><stop offset=".48" stop-color="%s"/>' % (h, g)

# ---------- Zahlen kürzen ----------
def zahl(x, st):
    s = ('%.' + str(st) + 'f') % x
    if '.' in s: s = s.rstrip('0').rstrip('.')
    if s in ('-0', ''): s = '0'
    if s.startswith('0.'): s = s[1:]
    elif s.startswith('-0.'): s = '-' + s[2:]
    return s

def zahlen(liste):
    out = ''
    for s in liste:
        if out and not (s.startswith('-') or (s.startswith('.') and ('.' in out.split(' ')[-1].split('-')[-1]))):
            out += ' '
        out += s
    return out

NUM = re.compile(r'[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?')
ARGS = {'M': 2, 'L': 2, 'H': 1, 'V': 1, 'C': 6, 'S': 4, 'Q': 4, 'T': 2, 'A': 7, 'Z': 0}

def pfad(d, st):
    # zerlegen (Bogen-Flags sind einzelne Ziffern und dürfen zusammengeschrieben sein)
    i, n, teile = 0, len(d), []
    cmd = None
    while i < n:
        c = d[i]
        if c.isalpha():
            cmd = c; teile.append([c, []]); i += 1
            if c in 'zZ': cmd = None
            continue
        if c in ' ,\t\n\r': i += 1; continue
        if cmd is None: return d  # unbekannt → nicht anfassen
        akt = teile[-1]
        k = ARGS[cmd.upper()]
        if len(akt[1]) >= k:
            if cmd in 'Mm': cmd = 'l' if cmd == 'm' else 'L'
            teile.append([cmd, []]); akt = teile[-1]
        if cmd.upper() == 'A' and len(akt[1]) % 7 in (3, 4):
            akt[1].append(float(c)); i += 1; continue
        m = NUM.match(d, i)
        if not m: return d
        akt[1].append(float(m.group(0))); i = m.end()
    # absolut rechnen, runden, relativ aus gerundeten Punkten schreiben
    r = lambda v: round(v, st)
    cx = cy = sx = sy = 0.0       # echte Position
    rx_ = ry_ = 0.0               # gerundete Position
    rsx = rsy = 0.0
    out = []
    for cmd, a in teile:
        U = cmd.upper(); rel = cmd != U
        if U == 'Z':
            out.append('z'); cx, cy, rx_, ry_ = sx, sy, rsx, rsy; continue
        k = ARGS[U]
        if k == 0 or len(a) % k: return d
        for j in range(0, len(a), k):
            g = a[j:j + k]
            if U == 'H':
                x = g[0] + (cx if rel else 0); X = r(x)
                out.append(('h', [zahl(X - rx_, st)])); cx, rx_ = x, X; continue
            if U == 'V':
                y = g[0] + (cy if rel else 0); Y = r(y)
                out.append(('v', [zahl(Y - ry_, st)])); cy, ry_ = y, Y; continue
            if U == 'A':
                x = g[5] + (cx if rel else 0); y = g[6] + (cy if rel else 0); X, Y = r(x), r(y)
                out.append(('a', [zahl(r(g[0]), st), zahl(r(g[1]), st), zahl(g[2], 1), '%d' % g[3], '%d' % g[4], zahl(X - rx_, st), zahl(Y - ry_, st)]))
                cx, cy, rx_, ry_ = x, y, X, Y; continue
            pts = []
            for p in range(0, k, 2):
                x = g[p] + (cx if rel else 0); y = g[p + 1] + (cy if rel else 0)
                pts.append((x, y))
            werte = []
            for (x, y) in pts:
                werte += [zahl(r(x) - rx_, st), zahl(r(y) - ry_, st)]
            ex, ey = pts[-1]
            out.append((U.lower(), werte))
            cx, cy, rx_, ry_ = ex, ey, r(ex), r(ey)
            if U == 'M': sx, sy, rsx, rsy = cx, cy, rx_, ry_
    # erster Befehl muss absolut sein (relativ zu 0,0 ist gleichwertig), Folge-Befehle gleicher Art zusammenfassen
    s, letzt = '', None
    for e in out:
        if e == 'z': s += 'z'; letzt = None; continue
        c, w = e
        flach = []
        for v in w: flach.append(v)
        if c == letzt and c != 'm': s += (' ' if not (flach[0].startswith('-')) else '') + zahlen(flach)
        else: s += c + zahlen(flach)
        letzt = c
    return s

ATTR_ZAHL = re.compile(r'\b(cx|cy|r|rx|ry|x|y|width|height|x1|x2|y1|y2|fx|fy|stroke-width)="(-?[\d.]+)"')

def kuerze(inner, st, st_verlauf):
    # Formen mit st Nachkommastellen; Verläufe (Lage der harten Farbgrenze, Bruchteile bei objectBoundingBox) behalten st_verlauf
    def tag(m):
        t = m.group(0); s = st_verlauf if re.match(r'<(linearGradient|radialGradient|stop)\b', t) else st
        t = re.sub(r'\bd="([^"]*)"', lambda m: 'd="%s"' % pfad(m.group(1), s), t)
        return ATTR_ZAHL.sub(lambda m: '%s="%s"' % (m.group(1), zahl(float(m.group(2)), s + (1 if m.group(1) == 'stroke-width' else 0))), t)
    return re.sub(r'<[a-zA-Z][^>]*>', tag, inner)

# ---------- Farben über Variablen, damit eine zweite Kopie die Kontur sein kann ----------
GRAFIK = ('path', 'circle', 'ellipse', 'rect', 'polygon', 'polyline', 'line', 'g', 'use', 'symbol')

def variablen(inner, weich):
    def tag(m):
        name, attrs = m.group(1), m.group(2)
        if name not in GRAFIK: return m.group(0)
        st = []
        alt = re.search(r'\sstyle="([^"]*)"', attrs)
        if alt:
            attrs = attrs.replace(alt.group(0), '')
            for teil in alt.group(1).split(';'):
                if ':' in teil:
                    k, v = [x.strip() for x in teil.split(':', 1)]
                    if k.startswith('enable-background'): continue
                    attrs += ' %s="%s"' % (k, v)
        def nimm(a):
            nonlocal attrs
            mm = re.search(r'\s%s="([^"]*)"' % a, attrs)
            if not mm: return None
            attrs = attrs.replace(mm.group(0), '', 1); return mm.group(1)
        f = nimm('fill')
        if f is not None:
            if f == 'none': attrs += ' fill="none"'
            else: st.append('fill:var(--k,%s)' % f)
        s = nimm('stroke')
        if s is not None: st.append('stroke:var(--k,%s)' % s)
        w = nimm('stroke-width')
        if w is not None: st.append('stroke-width:calc(%spx + var(--w,0px))' % w)
        durch = f is not None and re.fullmatch(r'url\(#(.+)\)', f) and re.fullmatch(r'url\(#(.+)\)', f).group(1) in weich
        for o in ('opacity', 'fill-opacity', 'stroke-opacity'):
            v = nimm(o)
            if v is not None:
                st.append('%s:var(--o,%s)' % (o, v))
                if o != 'stroke-opacity' and float(v) < .6: durch = True
        # Glanz/Schatten (weiche oder halbdurchsichtige Formen) gehören nicht zur Kontur-Silhouette
        if durch: st.append('visibility:var(--v,visible)')
        if st: attrs += ' style="%s"' % ';'.join(st)
        return '<%s%s%s>' % (name, attrs, m.group(3))
    return re.sub(r'<([a-zA-Z]+)((?:\s[^>]*?)?)(/?)>', tag, inner)

def stil_a(svg, hexk):
    praefix = 'n' + hexk.replace('-', '') + '-'
    vb = [float(x) for x in re.search(r'viewBox="([^"]+)"', svg).group(1).replace(',', ' ').split()]
    inner = re.sub(r'^<svg[^>]*>|</svg>\s*$', '', svg.strip(), flags=re.S)
    inner = re.sub(r'<\?xml[^>]*>|<!--.*?-->', '', inner, flags=re.S)
    # Nachkommastellen: Formen nach GENAU (bezogen aufs 128er-Raster, Flaggen mit großer viewBox brauchen weniger), Verläufe wie bisher
    groesse = max(vb[2], vb[3])
    st_verlauf = 1 if vb[2] >= 64 else 3
    # GENAU = 1: wie bisher (eine Stelle, kleine viewBox drei) – so bleibt jedes Bild gleich (auch Flaggen mit 750er-viewBox)
    st = st_verlauf if GENAU >= 1 else max(0, round(GENAU - math.log10(groesse / 128)))
    # (?<!/): ein selbst schließender Verlauf <radialGradient … href="…"/> hat keine Stopps (vorher fraß das Muster die Stopps des nächsten –
    # im eigenständigen SVG als <img> war das kein gültiges XML, Paket 5)
    # Verläufe mit Durchsichtigkeit bleiben weich (Glanz, Schatten); rosa/rote davon sind Wangen und fliegen raus
    weich, wangen = set(), set()
    for m in re.finditer(r'<(linearGradient|radialGradient)([^>]*?)(?<!/)>(.*?)</\1>', inner, re.S):
        i = re.search(r'\bid="([^"]+)"', m.group(2))
        if i and re.search(r'stop-opacity[=:]"?\s*\.?\d', m.group(3)) and not re.search(r'stop-opacity[=:]"?\s*1"', m.group(3)) or (i and 'stop-opacity' in m.group(3)):
            weich.add(i.group(1))
            if set(c.lower() for c in re.findall(r'stop-color[=:]"?\s*#?(\w+)', m.group(3))) & WANGEN: wangen.add(i.group(1))
    for m in re.finditer(r'<(linearGradient|radialGradient)\b([^>]*?)/?>', inner):
        i = re.search(r'\bid="([^"]+)"', m.group(2)); r = re.search(r'href="#([^"]+)"', m.group(2))
        if i and r and r.group(1) in weich:
            weich.add(i.group(1))
            if r.group(1) in wangen: wangen.add(i.group(1))
    for w in wangen:
        inner = re.sub(r'<(path|circle|ellipse|rect|polygon)\b[^>]*fill="url\(#%s\)"[^>]*/>' % re.escape(w), '', inner)
    def gr(m):
        i = re.search(r'\bid="([^"]+)"', m.group(2))
        if i and i.group(1) in weich: return m.group(0)
        neu = stufen(m.group(3))
        return m.group(0) if not neu else '<%s%s>%s</%s>' % (m.group(1), m.group(2), neu, m.group(1))
    inner = re.sub(r'<(linearGradient|radialGradient)([^>]*?)(?<!/)>(.*?)</\1>', gr, inner, flags=re.S)
    inner = kuerze(inner, st, st_verlauf)
    # ids kurz umbenennen (0, 1, …, a, c, …; „b“ ist die Form-Gruppe) – nur Namen, das Bild bleibt gleich
    kurz, nr = {}, 0
    def naechster():
        nonlocal nr
        while True:
            n, k = nr, ''
            while True:
                k = '0123456789acdefghijklmnopqrstuvwxyz'[n % 35] + k; n //= 35
                if not n: break
            nr += 1
            if k != 'b': return k
    for i in sorted(set(re.findall(r'\bid="([^"]+)"', inner)), key=lambda x: (-len(x), x)):   # feste Reihenfolge (Mengen sind je Lauf anders geordnet)
        kurz[i] = naechster()
        inner = (inner.replace('id="%s"' % i, 'id="%s%s"' % (praefix, kurz[i])).replace('#%s)' % i, '#%s%s)' % (praefix, kurz[i]))
                 .replace('"#%s"' % i, '"#%s%s"' % (praefix, kurz[i])))
    weich = set(praefix + kurz.get(w, w) for w in weich)
    inner = variablen(re.sub(r'\s+', ' ', inner), weich)
    inner = re.sub(r'\s*xml:space="[^"]*"', '', inner)
    inner = inner.replace('xlink:href=', 'href=')
    # andere Seitenverhältnisse (Flaggen) mittig ins 128er-Feld setzen
    s = 128 / max(vb[2], vb[3])
    b = BREITE * AUSNAHMEN.get(hexk, {}).get('breite', 1)
    if abs(s - 1) > 1e-6 or vb[0] or vb[1]:
        b = b / s  # Konturbreite in den Einheiten des Bildes (sie wird mit dem Bild skaliert)
        tx = (128 - vb[2] * s) / 2 - vb[0] * s; ty = (128 - vb[3] * s) / 2 - vb[1] * s
        inner = '<g transform="translate(%s %s) scale(%s)">%s</g>' % (zahl(tx, 2), zahl(ty, 2), zahl(s, 4), inner)
    # Inhalt der Form-Gruppe und Konturbreite; voll() setzt daraus das ganze SVG zusammen (zweimal <use>, siehe oben)
    return inner.strip(), zahl(b, 3)

# ---------- Ausgabe in Häppchen und Kurzform (Paket „icons.js verkleinern“, 07.11.2026) ----------
# Statt einer großen shared/icons.js (2,7 MB, in einem Stück geparst) gibt es kleine Häppchen shared/icons/<teil>-<n>.js, die shared/emoji.js
# erst lädt, wenn ein Emoji daraus auf der Seite steht. Welches Emoji in welchem Häppchen liegt, bestimmt eine Prüfsumme des Hex-Schlüssels
# (zlib.crc32) innerhalb seines Teils der Liste – stabil: ein geändertes oder neues Emoji ändert genau ein Häppchen (wichtig für Updates).
# Jedes Bild steht in Kurzform: nur der Inhalt der Form-Gruppe, Präfix der ids als „~“, häufige Bausteine als ein Zeichen (KURZ).
# shared/icons-liste.js (klein, vor dem ersten Bild geladen) enthält die Liste, die Zuordnung und LernIconAuf(hex, kurz) → vollständiges SVG.
# Das ausgepackte SVG ist Zeichen für Zeichen das, was stil_a() baut (prüft tests/icons.js).
GENAU = 1                                         # Nachkommastellen der Formen im 128er-Raster (Verläufe behalten eine)
TEILE = 4                                         # Häppchen je Teil der Liste (6 Teile → 24 Dateien)
# Bausteine für die Kurzform – FESTE Liste (nicht nach Häufigkeit neu berechnen: sonst ändert jedes neue Emoji alle Häppchen).
# Reihenfolge = Ersetzungsreihenfolge (lange zuerst); die Zeichen kommen nirgends im SVG vor (prüft main()).
KURZ = ["gradientUnits='userSpaceOnUse'>", "gradientTransform='matrix(", "style='fill:var(--k,url(#~", "style='fill:var(--k,#", ";visibility:var(--v,visible)",
        "<stop offset='.48' stop-color='#", "' stop-color='#", "<stop offset='", "stop-opacity='", "</radialGradient>", "</linearGradient>",
        "<radialGradient id='~", "<linearGradient id='~", "<clipPath id='~", "clip-path='url(#~", "<use href='#~", "' id='~", ")'/><path d='m",
        "'/><path d='m", "<path d='m", "<ellipse cx='", "<circle cx='", "' cx='", "' cy='", "' rx='", "' ry='", "' fx='", "' fy='", "' r='", "' d='",
        "stroke:var(--k,#", ";stroke-width:calc(", "px + var(--w,0px))", "opacity:var(--o,", "stroke-linecap='round'", "stroke-linejoin='round'",
        "stroke-miterlimit='", "fill='none'", "transform='rotate(", "transform='translate(", "<g style='", "</g>", "<defs>", "</defs>", ")'/>", "'/>"]
ZEICHEN = '!$%&*?[]^_`{|}' + ''.join(chr(c) for c in range(0xC0, 0x100) if c not in (0xD7, 0xF7))

def voll(h, inner, b):
    p = 'n' + h.replace('-', '') + '-'
    return ("<svg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 136 136'><defs><g id='%sb'>%s</g></defs>"
            "<use href='#%sb' fill='%s' stroke='%s' stroke-width='%s' stroke-linejoin='round' stroke-linecap='round' style='--k:%s;--w:%spx;--o:1;--v:hidden'/>"
            "<use href='#%sb'/></svg>") % (p, inner, p, KONTUR, KONTUR, b, KONTUR, b, p)

def kurzform(h, inner, b):
    p = 'n' + h.replace('-', '') + '-'
    verboten = set(ZEICHEN[:len(KURZ)]) | {'~', '@', '"', '\\'}
    falsch = verboten & set(inner)
    assert not falsch, 'Zeichen %s im Bild %s – KURZ/ZEICHEN anpassen' % (falsch, h)
    k = inner.replace(p, '~')
    for tok, z in zip(KURZ, ZEICHEN): k = k.replace(tok, z)
    return k if b == '5.2' else '@%s@%s' % (b, k)

def main():
    a = sys.argv[1:]
    vollaus = None
    if '--voll' in a: i = a.index('--voll'); vollaus = a[i + 1]; del a[i:i + 2]   # alle SVGs vollständig als JSON (Prüfbogen, Vergleich)
    if '--genau' in a: i = a.index('--genau'); global GENAU; GENAU = int(a[i + 1]); del a[i:i + 2]   # nur zum Vergleichen
    a += [None] * 3
    quellen = a[0] or 'quellen/noto'; liste = a[1] or 'quellen/icons/liste.json'; aus = a[2] or 'shared'
    teile = json.load(open(liste, encoding='utf8'))
    hexk = lambda e: '-'.join('%x' % ord(c) for c in e if c != '️')
    alle, kurz, wo, namen, fehlt = {}, {}, {}, [], []
    for teil, eintraege in teile.items():
        for n in range(TEILE): namen.append('%s-%d' % (teil, n + 1))
        for e, *_ in eintraege:
            h = hexk(e); f = os.path.join(quellen, h + '.svg')
            if not os.path.exists(f): fehlt.append(e); continue
            if h in alle: continue
            inner, b = stil_a(open(f, encoding='utf8').read(), h)
            inner = inner.replace('"', "'")   # einfache Anführungszeichen: im JSON kein Backslash vor jedem Anführungszeichen
            alle[h] = voll(h, inner, b); kurz[h] = kurzform(h, inner, b)
            wo[h] = '%s-%d' % (teil, zlib.crc32(h.encode()) % TEILE + 1)
    ordner = os.path.join(aus, 'icons'); os.makedirs(ordner, exist_ok=True)
    for f in os.listdir(ordner):
        if f.endswith('.js') and f[:-3] not in namen: os.remove(os.path.join(ordner, f))
    kopf = '// GEBAUT von quellen/noto-stil-a.py aus quellen/noto/ – nicht von Hand ändern. Noto Emoji (Google, Apache 2.0, verändert: Stil A der Lerninsel; Lizenz quellen/noto/LICENSE).\n'
    groessen = {}
    for name in namen:
        d = {h: kurz[h] for h in kurz if wo[h] == name}
        js = kopf + 'LERN_ICONS_DAZU("%s",%s);\n' % (name, json.dumps(d, ensure_ascii=False, separators=(',', ':')))
        open(os.path.join(ordner, name + '.js'), 'w', encoding='utf8').write(js); groessen[name] = len(js.encode())
    # Liste, Zuordnung und Auspacker (klein, kommt vor dem ersten Bild: emoji.js hält damit den Platz frei und weiß, welches Häppchen es braucht)
    zz = ''.join('0123456789abcdefghijklmnopqrstuvwxyz'[namen.index(wo[h])] for h in kurz)
    js = (kopf + '// Emojis mit Bild (Hex-Schlüssel), je Emoji das Häppchen (ein Zeichen = Nummer in LERN_ICON_TEILE), Auspacker der Kurzform.\n'
          'window.LERN_ICON_LISTE = "%s";\nwindow.LERN_ICON_TEILE = %s;\nwindow.LERN_ICON_WO = "%s";\n'
          '(function () {\n'
          '  const Z = %s, T = %s, M = {};\n'
          '  for (let i = 0; i < T.length; i++) M[Z[i]] = T[i];\n'
          '  const RE = T.length ? new RegExp("[" + Z.slice(0, T.length).replace(/[\\]\\\\^-]/g, "\\\\$&") + "]", "g") : null;\n'
          '  // Kurzform → vollständiges SVG (wie quellen/noto-stil-a.py voll())\n'
          '  window.LernIconAuf = function (h, k) {\n'
          '    let w = "5.2"; if (k[0] === "@") { const i = k.indexOf("@", 1); w = k.slice(1, i); k = k.slice(i + 1); }\n'
          '    const p = "n" + h.replace(/-/g, "") + "-", innen = (RE ? k.replace(RE, (c) => M[c]) : k).split("~").join(p);\n'
          '    return "<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'-4 -4 136 136\'><defs><g id=\'" + p + "b\'>" + innen + "</g></defs><use href=\'#" + p + "b\' fill=\'%s\' stroke=\'%s\' stroke-width=\'" + w +\n'
          '      "\' stroke-linejoin=\'round\' stroke-linecap=\'round\' style=\'--k:%s;--w:" + w + "px;--o:1;--v:hidden\'/><use href=\'#" + p + "b\'/></svg>";\n'
          '  };\n'
          '  // Häppchen melden sich hier an (shared/icons/<teil>.js); emoji.js hört über LERN_ICONS_DA mit\n'
          '  window.LERN_ICONS_KURZ = window.LERN_ICONS_KURZ || {}; window.LERN_ICONS_GELADEN = window.LERN_ICONS_GELADEN || {};\n'
          '  window.LERN_ICONS_DAZU = function (teil, d) { Object.assign(window.LERN_ICONS_KURZ, d); window.LERN_ICONS_GELADEN[teil] = true; if (window.LERN_ICONS_DA) window.LERN_ICONS_DA(teil); };\n'
          '  // alle Häppchen laden (Prüfseiten wie spiele/stil/): Promise → { hex: SVG }\n'
          '  window.LernIconsAlle = function (ordner) {\n'
          '    return Promise.all(window.LERN_ICON_TEILE.map((t) => window.LERN_ICONS_GELADEN[t] ? null : new Promise((ok) => {\n'
          '      const s = document.createElement("script"); s.src = ordner + t + ".js"; s.onload = s.onerror = ok; document.head.appendChild(s); })))\n'
          '      .then(() => { const o = {}; for (const h in window.LERN_ICONS_KURZ) o[h] = window.LernIconAuf(h, window.LERN_ICONS_KURZ[h]); return o; });\n'
          '  };\n'
          '})();\n') % (','.join(kurz.keys()), json.dumps(namen), zz, json.dumps(ZEICHEN[:len(KURZ)], ensure_ascii=False),
                        json.dumps(KURZ, ensure_ascii=False), KONTUR, KONTUR, KONTUR)
    open(os.path.join(aus, 'icons-liste.js'), 'w', encoding='utf8').write(js)
    alt = os.path.join(aus, 'icons.js')
    if os.path.exists(alt): os.remove(alt)   # früher eine große Datei, seit 07.11.2026 Häppchen
    if vollaus: json.dump(alle, open(vollaus, 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
    gesamt = sum(groessen.values())
    print('%d Bilder in %d Häppchen (%d KB, größtes %d KB), Liste %d KB, %d ohne Bild (bleiben System-Zeichen): %s' % (
        len(alle), len(namen), gesamt // 1024, max(groessen.values()) // 1024, len(js.encode()) // 1024, len(fehlt), ' '.join(fehlt)))

if __name__ == '__main__': main()
