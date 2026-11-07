#!/bin/sh
# Startet einen lokalen Server, führt einen Browser-Test aus und beendet den Server wieder.
#   sh tests/laufen.sh              → Node-Tests (story-migration, inselkern, lehrplan, inhalte, wortschatz, koennen, mathe-generatoren, mathe-fehler, pruefstand, offline) und Rauchtest über alle Seiten
#   sh tests/laufen.sh ereignisse   → nur tests/ereignisse.js (ebenso profil, szene, prolog, zugang, tutorial, etappen, weihnachten, probe, leistung, daz, lesen, mathe1, sachkunde, deutsch34, koennen-anzeige, uebergang5, englisch, schreiben, mathe2, mathe34, mathe15, mathevoll, schuljahr, tafel, deutschvoll, sachkundevoll, schuljahr2, faechervoll, sorbisch, luecken, mathe5, robo, atelier, vorlesen, praesentieren, landkreise, sorbischmutter, vorschule, dashboard, anziehen, kapitel, chronik, geschenk, geburtstag, schuljahrwechsel, altersgerecht, garten, baeckerei, tierstation, verbessert, na60b, tier, schach, gefuehle, duell, sticker, fehlerursachen, sicherung, ipad, elternschnell, matheru, rhythmus, technik, wetterdrache, malmehr, barriere, leuchtturm, extras3d, stil, falz, hud, feinschliff, langdruck, expedition, ehrlich)
cd "$(dirname "$0")/.."
PORT=${PORT:-8799}
TEST=${1:-rauchtest}
if [ "$TEST" = "rauchtest" ]; then
  node tests/story-migration.js || exit 1
  node tests/inselkern.js || exit 1
  node tests/lehrplan.js || exit 1
  node tests/inhalte.js || exit 1
  node tests/wortschatz.js || exit 1
  node tests/koennen.js || exit 1
  node tests/mathe-generatoren.js || exit 1
  node tests/mathe-fehler.js || exit 1
  node tests/pruefstand.js || exit 1
  node tests/offline.js || exit 1
fi
# Port muss frei sein – sonst würde still ein fremder oder alter Server getestet
if python3 -c "import socket,sys; s=socket.socket(); sys.exit(0 if s.connect_ex(('127.0.0.1', $PORT)) == 0 else 1)"; then
  echo "❌ Port $PORT ist belegt – anderen Port mit PORT=<nummer> wählen."; exit 1
fi
python3 -m http.server "$PORT" >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
# warten, bis der Server antwortet (höchstens 10 s)
python3 -c "
import socket,time,sys
for i in range(100):
    s=socket.socket()
    if s.connect_ex(('127.0.0.1', $PORT)) == 0: sys.exit(0)
    time.sleep(0.1)
sys.exit(1)" || { echo "❌ Server auf Port $PORT startet nicht."; exit 1; }
PLAYWRIGHT_BROWSERS_PATH=${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers} BASIS="http://localhost:$PORT/${PFAD:-}" node "tests/$TEST.js"
