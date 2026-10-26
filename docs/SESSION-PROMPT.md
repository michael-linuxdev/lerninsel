# Prompt für die nächste Arbeitssitzung (Umsetzung der Neuausrichtung)

Diesen Text als erste Nachricht in eine neue Sitzung mit dem Repo `michael-linuxdev/lerninsel` kopieren.

---

Du arbeitest an der **Lerninsel** (Repo `michael-linuxdev/lerninsel`, Branch `main`, online unter lerninsel.micana.de):
eine Offline-Lern-App (reines HTML/CSS/JS, three.js für 3D) für Grundschulkinder auf dem Tablet.

## Auftrag: die Neuausrichtung vom 26.10.2026 umsetzen
Die Planung ist fertig. Diese Sitzung **baut**, in der Reihenfolge aus `docs/PLAN.md`, Abschnitt
„Neuausrichtung 26.10.2026“ → „Reihenfolge“ und „Arbeitspaket-Backlog“ (Pakete NA-xx mit Ziel, Dateien, Abnahme, Test, Größe).

## Zuerst lesen
1. `docs/PLAN.md`, nur den Abschnitt **„Neuausrichtung 26.10.2026“** (am Ende) – er ist verbindlich. Ältere Abschnitte sind Historie;
   die „Nachträge 26.10.2026“ davor beschreiben, was heute schon im Code steckt.
2. `docs/KONZEPT.md` (Story-Rahmen, Begriffe, Kapitel, Tutorial-Etappen E0–E10, Verzahnung, Individualisierung).
3. Je nach Paket: `docs/LEHRPLAN.md` (Lernziel-IDs, Datenformat), `docs/SPRACHEN.md` (Sprachen, DaZ, RTL, Vorlesen, Prüfstatus),
   `docs/GRAFIK.md` (Stil, Leistungsbudget iPad 10), `docs/MINISPIELE.md` (Katalog, Qualitätskriterien).
4. `README.md` für den Aufbau des Repos.

## Ablauf
1. **Fragerunde zuerst** (höchstens 4 Fragen mit dem Frage-Werkzeug), bevor du baust. Kläre mindestens:
   - Gibt es Antworten auf die „Offenen Fragen an den Auftraggeber“ in `docs/PLAN.md` (Insel-Zugang, QR-Schlüssel, Grafik-Termin,
     Muttersprachler/Lehrkräfte, Tonaufnahmen)?
   - Gibt es neue Rückmeldungen vom iPad 10 oder von Kindern?
   - Gilt die Reihenfolge noch, oder soll ein Paket vorgezogen werden?
   - Was darf in dieser Sitzung keinesfalls angefasst werden?
2. **Dann selbstständig arbeiten**, bis die Sitzung aufgebraucht ist. Lege eine Aufgabenliste an (ein Eintrag je Paket bzw. Schritt a/b/c)
   und hake ab. Frag nur nach, wenn eine Entscheidung nicht rückgängig zu machen ist; sonst triff die vernünftigste Wahl und notiere sie im Plan.
   Pakete mit Vermerk „wartet auf Antwort“ ohne Antwort überspringen.
3. **Zwischendurch pushen:** nach jedem fertigen, getesteten Schritt (spätestens alle ~45 Minuten Arbeit). Lieber kleine fertige Schritte
   als ein großer halbfertiger. Höchstens ein großes Paket gleichzeitig offen.
4. **Am Ende** (oder wenn das Kontingent knapp wird): in `docs/PLAN.md` unter dem Abschnitt „Neuausrichtung 26.10.2026“ einen Eintrag
   „Stand <Datum>“ ergänzen (erledigte Pakete, Abweichungen vom Plan, offene Punkte, nächstes Paket), in der Reihenfolge erledigte Pakete
   durchstreichen, pushen und kurz berichten.

## Erster Schritt: NA-01 „Story-Zustand und Insel-Ereignisse“ (S), danach NA-02 und NA-10
Konkret für NA-01 (Einzelheiten im Backlog):
1. Neue Datei `shared/ereignisse.js`: `Ereignisse.melde(art, daten)` und `Ereignisse.hoere(art, fn)`; Arten `fund`, `bild`, `melodie`,
   `bauwerk`, `kapitel`, `etappe`. Ereignisse, die eine andere Seite betreffen, werden im Spielstand als kurze Liste vorgemerkt
   (höchstens 20 Einträge, ältere fallen weg).
2. `shared/spielstand.js`: neues Feld `story: { kapitel: 0, etappen: {}, gesehen: [], chronik: [] }` mit Migration für alte Spielstände;
   QR-Transfer darf höchstens ~200 Byte größer werden.
3. Melden: `shared/lernfunde.js` (`fund`), `spiele/atelier/atelier.js` (`bild`), `spiele/atelier/musik.js` (`melodie`).
4. Einbinden überall, wo `shared/core.js` geladen wird (Startseite, Spiele, Insel); `sw.js`-Liste ergänzen.
5. Tests: Node-Test für die Migration, Playwright: Lernfund erzeugen → Ereignis und `story` im Spielstand; Rauchtest grün.
Danach **NA-02** (Profil: Stufe, Deutschstand, Bundesland) und **NA-10** (Szenen-Baustein `shared/szene.js` + Zeigehand `shared/zeige.js`).
**Meilenstein 15.12.2026:** Prolog, Tutorial E1–E3 und Weihnachts-Sonderstart (NA-11, NA-13, NA-15) laufen.

## Regeln (unverändert gültig)
- **Offline-first:** kein Server, keine Konten, keine Daten verlassen das Gerät (einzige Ausnahme: Wetter von Open-Meteo ohne GPS).
- **„Erst lernen, dann spielen“** ist eine harte Regel. Elternbereich mit PIN. Bildschirmzeit nach DGKJ; Erwachsene (PIN) dürfen immer spielen, ohne Sterne.
- **Nie Werbung, nie Käufe, keine süchtig machenden Mechaniken** (keine Lootboxen, kein Druck durch Serien, keine Ranglisten zwischen Kindern,
  keine Fristen in der Story, nichts geht verloren).
- Mehrere Kinder pro Tablet; lokale Speicherung und QR-Übertragung bleiben (Spielstand klein halten; Bilder bleiben in der eigenen IndexedDB).
- **Kein Bezug zu einem echten Kind** im Repo (keine Namen, kein Alter, keine Klasse). Beispielnamen sind ausgedacht.
- **Bestehende Funktionen nicht entfernen.** Wenn etwas ersetzt werden soll, im Plan begründen und per Eltern-Schalter die alte Variante anbieten.
- Sprache: Deutsch, kindgerecht; alle neuen Texte als Sprachschlüssel `{ de, ru, … }`; Hilfesprache nur, wenn gewählt. Neue Übersetzungen
  bekommen einen Prüfstatus (`entwurf`/`geprueft`/`kindgerecht`); **keine ungeprüfte Maschinenübersetzung im Kinder-UI**.
- Story- und Tutorial-Texte: höchstens 4 Sprechblasen je Szene, jede Zeile vorlesbar, ohne Lesen bedienbar (Zeigehand, Leuchten, Ton).
- Grafik: **Bis zur Stilentscheidung (NA-20) keine Figuren neu bauen.** Neue 3D-Teile im Leistungsbudget aus `docs/GRAFIK.md`
  (iPad 10: ≤ 150 Zeichenaufrufe in „schön“, ≤ 80 in „einfach“) und immer auch in Stufe „einfach“ prüfen.
  Keine fremden urheberrechtlich geschützten Figuren; fremde Dateien nur CC0/OFL und dann in `docs/LIZENZEN.md`.
- Lerninhalte nur zusammenfassen und Lernziel-IDs zuordnen, nie Lehrpläne wörtlich abschreiben.
- Commits als `michael-linuxdev <336864235+michael-linuxdev@users.noreply.github.com>`, Nachricht auf Deutsch
  (`git -c user.name=michael-linuxdev -c user.email=336864235+michael-linuxdev@users.noreply.github.com commit …`).

## Bauen
- Wenn Dateien in `quellen/welt3d/` geändert wurden: 3D bauen mit
  `ESBUILD=/opt/npm-tools/node_modules/esbuild/bin/esbuild sh quellen/bauen.sh` (falls der Pfad fehlt: `npx esbuild` bzw. `npm i -g esbuild`
  und `ESBUILD=esbuild`). Das Skript aktualisiert auch die `gemeinsam-*.js`-Einträge in `sw.js`.
- **Vor jedem Push** `sh quellen/dev-bauen.sh` (setzt die Cache-Version in `sw.js` automatisch, baut `/dev` und `/dev/test`).
- Neue Dateien unter `shared/`, `spiele/` oder `inhalte/` in die Offline-Liste in `sw.js` eintragen.

## Testen (Pflicht vor jedem Push)
- Rauchtest über alle Seiten: `sh tests/laufen.sh` (für /dev: `PFAD=dev/ sh tests/laufen.sh`). Neue Seiten in `tests/rauchtest.js`
  aufnehmen (3D-Seiten in `SEITEN_3D`).
- Eigene Tests: Server `python3 -m http.server 8766` im Repo-Ordner, im selben Befehl starten:
  `(python3 -m http.server 8766 >/dev/null 2>&1 &) ; sleep 1; …` (Hintergrund-Server enden zwischen Befehlen).
- Playwright: `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers` (falls nicht vorhanden: vorinstalliertes Chromium/Playwright nutzen, nicht neu
  installieren), für 3D Startoptionen `--enable-unsafe-swiftshader --use-angle=swiftshader`.
- Ersteinrichtung ist Pflicht: im Test zuerst PIN `1234` zweimal, dann Vorname eingeben (nach NA-02 auch Stufe/Land/Deutschstand).
- Uhr setzen: `addInitScript(() => { window.__jetzt = new Date(2026,9,25,15,0).getTime(); })`, sonst greift nachts die Ruhezeit.
  Für Weihnachten `new Date(2026,11,10,15,0)`. Insel: Tag `heimat.html?stunde=14`, Jahreszeit `?monat=12`,
  Wetter `?wetter=regen|schnee|nebel|gewitter|klar`, Welt `?biom=berge&groesse=gross&huegel=viel&see=1&seed=5`.
- Jede geänderte Seite einmal öffnen, Konsole auf Fehler prüfen, Screenshots ansehen (Quer- und Hochformat; mit Hilfesprache Russisch;
  RTL-Sprachen ab NA-44 zusätzlich).
- Swiftshader läuft mit wenigen Bildern pro Sekunde: Bewegungen im Test langsam, zeitabhängige Logik mit Uhrzeit statt `dt` prüfen;
  Leistung über Zählwerte (`renderer.info`, ab NA-21 `tests/leistung.js`), nicht über Bilder/s beurteilen.
- Pulsierende Knöpfe (Aktionsknopf) mit `click(…, { force: true })`.
- Test-Haken: `__heimat` (blick, ich, reingehen, rausgehen, laufeZu, tippe, station, laden, zimmerDaten, aktion, druecke, rennt, wetter),
  `__atelier`, `__musik`, `__schach`, `__gefuehle`, `__lauf`, `__kart`, `__bau`, `__duell`, `__ich`, `__mathe`;
  neu geplant: `__szene`, `__tutorial`, `__ereignisse`. Jeder neue Baustein bekommt einen Test-Haken.
- Externe Seiten (Open-Meteo, Google Fonts) sind aus der Sandbox meist nicht erreichbar – mit Cache-Daten in localStorage testen.

## Stand zu Beginn (26.10.2026)
- Fertig (siehe „Nachträge 26.10.2026“ im Plan): Zeitsystem, mehrere Kinder, Insel bzw. eigene Welten (Wünsche-Assistent), Zimmer,
  Lernfunde/Wissensbaum/Pinnwand, Lernkartei in Mathe/Deutsch/Sachunterricht, Schatzkammer und Wochen-Challenge, Eltern als Mitspieler,
  Echte-Welt-Aufgaben, Minispiele (Ballons, Schatz-Strand, Sternenlauf, Kart, Bauplatz), Bruni (Gefühle, Bewegung, Miteinander, Stärken),
  Schach mit Tilda, Atelier mit Paula (Malen, Musik-Ecke, Insel-Bühne), Leistungsmodus fürs iPad.
- Planung der Neuausrichtung: `KONZEPT.md`, `LEHRPLAN.md`, `SPRACHEN.md`, `GRAFIK.md`, `MINISPIELE.md`, `PLAN.md` (Neuausrichtung).
- Bekannte Baustellen: zwei Kind-Figuren in 3D (`heimat.js` und `figur3d.js`, Paket NA-22), Deutsch-Bereiche in `shared/lehrplan.js`
  noch nach KMK 2004 (NA-03), Insel nur mit komplettem Tablet-Führerschein (NA-12, wartet auf Antwort).

## Berichten
Kurz und auf Deutsch: welche Pakete fertig sind (mit Screenshots, wenn es etwas zu sehen gibt), was der Auftraggeber auf dem iPad 10
testen soll, welche Entscheidungen du getroffen hast, was als Nächstes kommt.
