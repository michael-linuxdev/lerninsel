#!/bin/sh
# Baut die 3D-Spiele aus quellen/welt3d nach spiele/welt3d (three.js wird mit eingebündelt).
# Braucht esbuild: npx esbuild ... oder ein installiertes esbuild.
cd "$(dirname "$0")/.."
ESBUILD=${ESBUILD:-esbuild}
$ESBUILD quellen/welt3d/ballons.js quellen/welt3d/insel.js quellen/welt3d/heimat.js --bundle --format=esm --splitting --minify \
  --target=es2020 --outdir=spiele/welt3d --chunk-names=gemeinsam --legal-comments=none
# Probeszene einzeln (nicht im Offline-Speicher, nur zum Vergleichen der Grafikstile)
$ESBUILD quellen/welt3d/probe.js --bundle --format=esm --minify --target=es2020 --outfile=spiele/welt3d/probe.js --legal-comments=none
cp quellen/three/LICENSE.txt spiele/welt3d/three-LICENSE.txt
