#!/bin/sh
# Erzeugt die Testversion unter /dev:
# gleiche Dateien wie die echte Seite, aber Testmodus mit eigenem Spielstand und allem freigeschaltet.
# Vor jedem Push ausführen, damit /dev aktuell bleibt.
set -e
cd "$(dirname "$0")/.."
# Cache-Version automatisch aus dem Inhalt aller Dateien der Seite (ändert sich nur, wenn sich etwas ändert)
HASH=$(find . -type f ! -path './dev/*' ! -path './quellen/*' ! -path './docs/*' ! -path './.git/*' ! -name 'sw.js' ! -name 'README.md' ! -name 'CNAME' -print0 | sort -z | xargs -0 sha1sum | sha1sum | cut -c1-10)
sed -i "s/^const CACHE = VORSILBE + \"spielwelt-[^\"]*\";/const CACHE = VORSILBE + \"spielwelt-$HASH\";/" sw.js
grep -q "spielwelt-$HASH" sw.js || { echo "Cache-Version konnte nicht gesetzt werden"; exit 1; }
echo "Cache-Version: $HASH"
rm -rf dev
mkdir dev
for f in *; do
  case "$f" in dev|quellen|CNAME|README.md) ;; *) cp -R "$f" dev/ ;; esac
done
cat > dev/shared/config.js <<'CFG'
// TESTVERSION (/dev) – wird von quellen/dev-bauen.sh erzeugt, nicht von Hand ändern.
window.SPIELWELT_CONFIG = {
  modus: "schule",
  version: "dev",
  test: true            // eigener Spielstand, alles freigeschaltet, Testleiste oben
};
CFG
sed -i 's/"name": "Spielwelt"/"name": "Spielwelt TEST"/; s/"short_name": "Spielwelt"/"short_name": "Test"/' dev/manifest.webmanifest
echo "dev/ aktualisiert"
