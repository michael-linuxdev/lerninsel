#!/bin/sh
# Startet einen lokalen Server, führt einen Browser-Test aus und beendet den Server wieder.
#   sh tests/laufen.sh              → Node-Tests (story-migration, inselkern, lehrplan, wortschatz, koennen, mathe-generatoren) und Rauchtest über alle Seiten
#   sh tests/laufen.sh ereignisse   → nur tests/ereignisse.js (ebenso profil, szene, prolog, zugang, tutorial, etappen, weihnachten, probe, pixelinsel, look, leistung, daz, lesen, mathe1, sachkunde, deutsch34, koennen-anzeige, uebergang5, englisch, schreiben, mathe2, mathe34, mathe15, mathevoll, schuljahr, tafel, deutschvoll, sachkundevoll, schuljahr2, faechervoll, sorbisch, luecken, mathe5, robo, atelier, vorlesen, praesentieren, landkreise)
cd "$(dirname "$0")/.."
PORT=${PORT:-8799}
TEST=${1:-rauchtest}
if [ "$TEST" = "rauchtest" ]; then
  node tests/story-migration.js || exit 1
  node tests/inselkern.js || exit 1
  node tests/lehrplan.js || exit 1
  node tests/wortschatz.js || exit 1
  node tests/koennen.js || exit 1
  node tests/mathe-generatoren.js || exit 1
fi
python3 -m http.server "$PORT" >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
sleep 1
PLAYWRIGHT_BROWSERS_PATH=${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers} BASIS="http://localhost:$PORT/${PFAD:-}" node "tests/$TEST.js"
