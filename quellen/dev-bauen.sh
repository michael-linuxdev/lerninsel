#!/bin/sh
# Erzeugt /dev (neue Funktionen, normale Regeln) und /dev/test (Testmodus, alles frei),
# jeweils mit eigenem Spielstand.
# Vor jedem Push ausführen, damit /dev aktuell bleibt.
set -e
cd "$(dirname "$0")/.."
# Cache-Version automatisch aus dem Inhalt aller Dateien der Seite (ändert sich nur, wenn sich etwas ändert)
HASH=$(find . -type f ! -path './dev/*' ! -path './quellen/*' ! -path './docs/*' ! -path './tests/*' ! -path './.git/*' ! -name 'sw.js' ! -name 'README.md' ! -name 'CLAUDE.md' ! -name 'CNAME' -print0 | sort -z | xargs -0 sha1sum | sha1sum | cut -c1-10)
sed -i "s/^const CACHE = VORSILBE + \"spielwelt-[^\"]*\";/const CACHE = VORSILBE + \"spielwelt-$HASH\";/" sw.js
grep -q "spielwelt-$HASH" sw.js || { echo "Cache-Version konnte nicht gesetzt werden"; exit 1; }
echo "Cache-Version: $HASH"
rm -rf dev
mkdir dev
for f in *; do
  case "$f" in dev|quellen|docs|tests|CNAME|README.md|CLAUDE.md) ;; *) cp -R "$f" dev/ ;; esac
done
cat > dev/shared/config.js <<'CFG'
// DEV-VERSION (/dev) – wird von quellen/dev-bauen.sh erzeugt, nicht von Hand ändern.
// Neue Funktionen zuerst hier, mit normalen Regeln und eigenem Spielstand.
window.SPIELWELT_CONFIG = { modus: "schule", version: "dev", umgebung: "dev" };
CFG
sed -i 's/"name": "Lerninsel"/"name": "Lerninsel DEV"/; s/"short_name": "Lerninsel"/"short_name": "DEV"/' dev/manifest.webmanifest
# Testmodus (/dev/test): Kopie von /dev mit allem freigeschaltet, +50 Sterne, Zurücksetzen
mkdir dev/test
for f in dev/*; do
  case "$f" in dev/test) ;; *) cp -R "$f" dev/test/ ;; esac
done
cat > dev/test/shared/config.js <<'CFG'
// TESTMODUS (/dev/test) – wird von quellen/dev-bauen.sh erzeugt, nicht von Hand ändern.
window.SPIELWELT_CONFIG = { modus: "schule", version: "test", umgebung: "test" };
CFG
sed -i 's/"name": "Lerninsel DEV"/"name": "Lerninsel TEST"/; s/"short_name": "DEV"/"short_name": "TEST"/' dev/test/manifest.webmanifest
echo "dev/ und dev/test/ aktualisiert"

