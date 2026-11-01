#!/usr/bin/env python3
# Holt die Noto-Original-SVGs (Google, Apache 2.0) der Emojis aus quellen/icons/liste.json nach quellen/noto/<hex>.svg.
# Nur nötig, wenn neue Emojis in die Liste kommen – das Bauen (quellen/noto-stil-a.py) liest nur quellen/noto/.
# Quellen (beide über npm erreichbar, nicht ins Repo legen):
#   npm pack @iconify-json/noto   → package/icons.json + package/chars.json (aktuelle Noto-Fassung, bevorzugt)
#   npm pack @svgmoji/noto        → package/sprites/all.svg (ältere Fassung; Tasten-Ziffern, ©, Flaggen)
# Aufruf: python3 -I quellen/noto-holen.py <iconify-ordner/package> <svgmoji-all.svg> quellen/icons/liste.json quellen/noto
# Emojis, die in keiner Quelle stehen (z. B. Würfel ⚀–⚅), bleiben System-Zeichen.
import json, os, re, sys

def main():
    iconify, sprite, liste, ziel = sys.argv[1:5]
    icons = json.load(open(os.path.join(iconify, 'icons.json'), encoding='utf8'))
    chars = json.load(open(os.path.join(iconify, 'chars.json'), encoding='utf8'))
    noto = open(sprite, encoding='utf8').read()
    emojis = [e for teil in json.load(open(liste, encoding='utf8')).values() for e, *_ in teil]
    os.makedirs(ziel, exist_ok=True)
    def body(name):
        while name not in icons['icons']: name = icons['aliases'][name]['parent']
        i = icons['icons'][name]
        return i['body'], i.get('width', icons.get('width', 16)), i.get('height', icons.get('height', 16))
    n, fehlt = 0, []
    for e in emojis:
        h = '-'.join('%x' % ord(c) for c in e if c != '️')
        mit = '-'.join('%x' % ord(c) for c in e)
        svg = None
        name = chars.get(h) or chars.get(mit)
        if not name and re.fullmatch(r'3[0-9]-20e3', h): name = 'keycap-' + h[1]  # Tasten-Ziffern: im Sprite fehlt bei 1 und 9 der Kasten
        if name:
            b, w, hh = body(name)
            svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %s %s">%s</svg>' % (w, hh, b)
        else:
            for k in (h, mit, '-'.join('%04x' % ord(c) for c in e)):
                m = re.search(r'<svg([^>]*?) id="%s"([^>]*)>(.*?)</svg>' % re.escape(k.upper()), noto, re.S)
                if m:
                    vb = re.search(r'viewBox="([^"]+)"', m.group(1) + m.group(2)).group(1)
                    svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s">%s</svg>' % (vb, re.sub(r'\s+', ' ', m.group(3)).strip())
                    break
        if not svg: fehlt.append(e); continue
        open(os.path.join(ziel, h + '.svg'), 'w', encoding='utf8').write(svg + '\n'); n += 1
    print('%d Quellen geschrieben, %d ohne Noto-Bild: %s' % (n, len(fehlt), ' '.join(fehlt)))

if __name__ == '__main__': main()
