#!/bin/sh
# Baut die 3D-Spiele aus quellen/welt3d nach spiele/welt3d (three.js wird mit eingebündelt).
# Braucht esbuild: npx esbuild ... oder ein installiertes esbuild.
# Gemeinsam genutzter Code landet in Teilen spiele/welt3d/gemeinsam-<hash>.js; die Liste im Offline-Speicher (sw.js) wird hier aktualisiert.
set -e
cd "$(dirname "$0")/.."
ESBUILD=${ESBUILD:-esbuild}
# Erst in einen Zwischenordner bauen; nur wenn esbuild durchläuft, werden die alten Teile ersetzt (sonst bliebe ein halber Stand liegen)
ZW=$(mktemp -d "${TMPDIR:-/tmp}/welt3d.XXXXXX")
trap 'rm -rf "$ZW"' EXIT
$ESBUILD quellen/welt3d/ballons.js quellen/welt3d/insel.js quellen/welt3d/heimat.js quellen/welt3d/lauf.js quellen/welt3d/kart.js quellen/welt3d/bau.js --bundle --format=esm --splitting --minify \
  --target=es2020 --outdir="$ZW" --chunk-names=gemeinsam-[hash] --legal-comments=none
rm -f spiele/welt3d/gemeinsam*.js
cp "$ZW"/*.js spiele/welt3d/
# Probeszene einzeln (nicht im Offline-Speicher, nur zum Vergleichen der Grafikstile)
$ESBUILD quellen/welt3d/probe.js --bundle --format=esm --minify --target=es2020 --outfile=spiele/welt3d/probe.js --legal-comments=none
cp quellen/three/LICENSE.txt spiele/welt3d/three-LICENSE.txt
# sw.js: alte gemeinsam*-Einträge raus, aktuelle rein (vor der Zeile mit heimat.html)
grep -v '^  "spiele/welt3d/gemeinsam' sw.js > sw.js.neu
TEILE=$(cd spiele/welt3d && ls gemeinsam*.js | sed 's#^#  "spiele/welt3d/#; s#$#",#')
awk -v teile="$TEILE" '/^  "spiele\/welt3d\/heimat.html"/ { print teile } { print }' sw.js.neu > sw.js && rm sw.js.neu
# Prüfsummen der Offline-Liste nachziehen (Updates laden nur Geändertes, siehe quellen/sw-pruefsummen.js)
node quellen/sw-pruefsummen.js >/dev/null
