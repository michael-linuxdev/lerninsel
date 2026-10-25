#!/bin/sh
# Startet einen lokalen Server, führt den Rauchtest aus und beendet den Server wieder.
cd "$(dirname "$0")/.."
PORT=${PORT:-8799}
python3 -m http.server "$PORT" >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
sleep 1
PLAYWRIGHT_BROWSERS_PATH=${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers} BASIS="http://localhost:$PORT/${PFAD:-}" node tests/rauchtest.js
