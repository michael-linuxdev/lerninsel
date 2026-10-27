# Fremde Bestandteile und Lizenzen

Regel (PLAN.md, GRAFIK.md): fremde Dateien nur unter freien Lizenzen; jede fremde Datei steht hier.
Bilder, Figuren, Kacheln und Töne der App sind selbst gemacht (im Code gezeichnet) – es gibt keine fremden Grafiken.

| Bestandteil | Wo im Repo | Lizenz | Lizenztext |
|---|---|---|---|
| three.js | eingebündelt in `spiele/welt3d/*.js` (Quelle `quellen/three/`) | MIT | `spiele/welt3d/three-LICENSE.txt` |
| PixiJS 8.22.0 | eingebündelt in `spiele/pixel/insel.js` (Look „Pixel“) und `spiele/probe/pixel.js` (Grafik-Probe) | MIT | `spiele/pixel/LIZENZEN.txt`, `spiele/probe/LIZENZEN.txt` |
| eventemitter3, ismobilejs, @xmldom/xmldom, colord, parse-svg-path | mit PixiJS eingebündelt | MIT | `spiele/pixel/LIZENZEN.txt` |
| earcut | mit PixiJS eingebündelt | ISC | `spiele/pixel/LIZENZEN.txt` |
| tiny-lru | mit PixiJS eingebündelt | BSD-3-Clause | `spiele/pixel/LIZENZEN.txt` |

PixiJS und seine Bausteine liegen nicht als Quellcode im Repo; `quellen/probe/bauen.js` beschreibt, wie das Bündel entsteht.
