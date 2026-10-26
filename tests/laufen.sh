#!/bin/sh
# Startet einen lokalen Server, führt einen Browser-Test aus und beendet den Server wieder.
#   sh tests/laufen.sh              → Node-Tests (story-migration) und Rauchtest über alle Seiten
#   sh tests/laufen.sh ereignisse   → nur tests/ereignisse.js
cd "$(dirname "$0")/.."
PORT=${PORT:-8799}
TEST=${1:-rauchtest}
if [ "$TEST" = "rauchtest" ]; then
  node tests/story-migration.js || exit 1
fi
python3 -m http.server "$PORT" >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
sleep 1
PLAYWRIGHT_BROWSERS_PATH=${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers} BASIS="http://localhost:$PORT/${PFAD:-}" node "tests/$TEST.js"
