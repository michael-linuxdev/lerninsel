# Prompt für die nächste Arbeitssitzung (Umsetzung der Neuausrichtung)

Diesen Text komplett als erste Nachricht in eine neue Sitzung kopieren – **auch in einem anderen Claude-Konto**.
Er ist in sich vollständig: Die neue Sitzung braucht kein Vorwissen, keine Erinnerung und keinen alten Chat.
Voraussetzung: Das Konto hat Lese- und Schreibzugriff auf das GitHub-Repo `michael-linuxdev/lerninsel`
(GitHub in den Claude-Einstellungen unter „Connectors“ verbinden; ohne Schreibzugriff kann die Sitzung nicht pushen).

---

Du arbeitest an der **Lerninsel**: einer Offline-Lern-App für Grundschulkinder auf dem Tablet (reines HTML/CSS/JS, three.js für 3D,
kein Server). Repo `michael-linuxdev/lerninsel`, Branch `main`; was auf `main` liegt, ist sofort online unter lerninsel.micana.de
(Hauptseite für die Kinder), `/dev` (neue Funktionen, eigener Spielstand) und `/dev/test` (Testmodus, alles frei).
Der Auftraggeber testet auf einem **iPad 10**. Antworte und schreibe alles auf **Deutsch**.

## 0. Einrichten (zuerst, ohne nachzufragen)
1. Repo holen: `git clone https://github.com/michael-linuxdev/lerninsel` (bzw. das Repo der Sitzung hinzufügen, falls das Werkzeug dafür da ist).
   Arbeite direkt auf `main`; vor jedem Push `git fetch origin main && git rebase origin/main`.
2. Werkzeuge prüfen, nur fehlende nachinstallieren:
   - **esbuild** (für 3D): `/opt/npm-tools/node_modules/esbuild/bin/esbuild`, sonst `npx --yes esbuild` oder `npm i -g esbuild` → `ESBUILD=esbuild`.
   - **Playwright + Chromium**: `node -e "require('playwright')"` (ggf. vorher `export NODE_PATH=$(npm root -g)`); Browser unter `/opt/pw-browsers`
     (`PLAYWRIGHT_BROWSERS_PATH`). Fehlt beides: `npm i -g playwright && npx playwright install chromium` und `PLAYWRIGHT_BROWSERS_PATH` weglassen.
   - `python3` für den lokalen Server.
3. Einmal `sh tests/laufen.sh` ausführen (Node-Test + Rauchtest). Muss grün sein, bevor du etwas änderst. Dauert ca. 2 Minuten.

## 1. Zuerst lesen
1. `docs/PLAN.md`, nur den Abschnitt **„Neuausrichtung 26.10.2026“** am Ende – er ist verbindlich (Entscheidungen, Phasen,
   Arbeitspaket-Backlog NA-xx mit Ziel/Dateien/Abnahme/Test/Größe, „Reihenfolge“, offene Fragen) – und darin besonders den letzten Eintrag
   **„Stand 27.10.2026“** (was fertig ist, Abweichungen, nächste Schritte). Ältere Abschnitte sind Historie.
2. `docs/KONZEPT.md` (Story „Die Insel erwacht“, Begriffe, Figuren, Kapitelbogen, Tutorial-Etappen E0–E10, Verzahnung, Individualisierung).
3. Je nach Paket: `docs/LEHRPLAN.md`, `docs/SPRACHEN.md` (Prüfstatus von Übersetzungen!), `docs/GRAFIK.md` (Leistungsbudget iPad 10),
   `docs/MINISPIELE.md`.
4. `README.md` (Aufbau des Repos, Liste der Dateien in `shared/`).

## 2. Stand (27.10.2026)
**Fertig** (Einzelheiten in PLAN.md → „Stand 27.10.2026“):
- **NA-01** `shared/ereignisse.js`: `Ereignisse.melde/hoere/offene/abholen` und `window.Story` (Kapitel, Etappen E1…, gesehene Szenen,
  Chronik, Geschenke) in `profil.daten.story`, mit Migration alter Spielstände.
- **NA-02** Profil: `stufe` (vs, 1–4, 5), `land` (sn, nw, by, bw, ni, bb), `muttersprache`, `deutschstand` (keine/wenig/alltag/gut);
  Helfer `Spielwelt.stufe()`, `Spielwelt.land()`; `klasse` bleibt für alte Abfragen.
- **NA-10** `shared/szene.js` (Sprechblasen-Folgen, höchstens 4, Vorlesen, Hilfesprache, Optionen `zeige`, `bis`, `beim`) und
  `shared/zeige.js` (Zeigehand/Leuchten, auch für 3D-Punkte über `window.Insel.ort(name)`); Szenentexte in `shared/szenen.js`.
- **NA-11** Prolog „Ankunft“ (E1) mit Steg und Pixels Boot; Robo Pixel wohnt am Steg („Wie ging das nochmal?“); Elternkarte „Geschichte und Einführung“.
- **NA-12** Insel-Zugang: erste Lektion „Das Tablet bedienen“ öffnet die Insel (`Spielwelt.inselOffen()`), Elternschalter für die alte Regel;
  Minispiele weiter nur mit komplettem Führerschein (`Spielwelt.minispieleOffen()`).
- **NA-13** Sonnenuhr am Steg, E2 „Erst lernen“, Szene „Sonne geht auf“, E3 „Erste Frucht“ = Kapitel 1 mit weichendem Nebel;
  höchstens 2 neue Etappen pro Tag (`Story.darfNeueEtappe()`).
- **NA-15** Weihnachts-Sonderstart (Erststart 1.–26.12.): Paket am Steg (Tannenbaum fürs Zimmer, Schleife fürs Tier), Lichterkette im Dezember.

**Grafik (Sitzung 27.10.2026, nachts):** Eine andere Engine ist erlaubt, Smartphones zählen mit. Zur Wahl stehen nur noch zwei Looks:
**„Rund“ wie Animal Crossing** (heutiger Stil B, three.js, `spiele/welt3d/probe.html?stil=b`) und **„Pixel“** (Draufsicht, 16×16-Kacheln,
PixiJS, `spiele/probe/`, Quelle `quellen/probe/pixel.js`, Bau `ENGINES=<ordner> node quellen/probe/bauen.js` – npm/CDN sind gesperrt,
PixiJS kommt als Quellcode von GitHub, Anleitung im Kopf von `bauen.js`). Test `sh tests/laufen.sh probe` (Handy + iPad, quer + hoch).
Messhaken für NA-21: `messe()` in `gemeinsam.js`, `__heimat.info()`, `__welt3d.info()`, `__probe.info()`, `window.__keinSparen`.
Fremde Bestandteile stehen in `docs/LIZENZEN.md`. **Die Stil-Entscheidung des Auftraggebers steht noch aus.**

**Antworten des Auftraggebers (26.10.2026):** Insel-Zugang über die erste Lektion – ja (umgesetzt). QR-Geschenke mit privatem Schlüssel nur
beim Auftraggeber und Node-Skript – einverstanden; **welche Geschenke** es zu Weihnachten 2026 gibt, ist noch offen.
Reihenfolge gilt unverändert. Grafik-Termin, Muttersprachler/Lehrkräfte, Tonaufnahmen: noch offen.

**Bekannte Baustellen:** Insel liegt über dem Leistungsbudget (≈ 495 Zeichenaufrufe „schön“, ≈ 335 „einfach“; Budget 150/80 → NA-21/NA-20);
zwei Kind-Figuren in 3D (NA-22); Deutsch-Bereiche in `shared/lehrplan.js` noch nach KMK 2004 (NA-03); alle russischen Szenentexte sind
Entwürfe (`status: { ru: "entwurf" }`) und erscheinen nur in `/dev`.

## 3. Ablauf dieser Sitzung
1. **Fragerunde zuerst** (höchstens 4 Fragen mit dem Frage-Werkzeug, sonst als kurze Liste), bevor du baust. Kläre mindestens:
   - Rückmeldung vom iPad 10 zu Ankunft, Sonnenuhr, Erste Frucht, Weihnachts-Paket (in `/dev` mit neuem Kind getestet?) – Fehler zuerst beheben.
   - Welche Geschenke soll es per QR-Code zu Weihnachten 2026 geben (für NA-16)? Neue Antworten auf die übrigen offenen Fragen im Plan?
   - Gilt die Reihenfolge noch (nächstes: **NA-14**), oder soll etwas vorgezogen werden (z. B. NA-21/NA-20 Grafik, NA-16 QR-Geschenk)?
   - Was darf in dieser Sitzung keinesfalls angefasst werden?
2. **Dann selbstständig arbeiten**, bis die Sitzung aufgebraucht ist. Aufgabenliste anlegen (ein Eintrag je Paket bzw. Schritt a/b/c) und abhaken.
   Nur nachfragen, wenn eine Entscheidung nicht rückgängig zu machen ist; sonst die vernünftigste Wahl treffen und im Plan notieren.
   Pakete mit „wartet auf Antwort“ ohne Antwort überspringen.
3. **Zwischendurch pushen:** nach jedem fertigen, getesteten Schritt. Lieber kleine fertige Schritte als ein großer halbfertiger.
   Höchstens ein großes Paket gleichzeitig offen.
4. **Am Ende:** in `docs/PLAN.md` unter „Neuausrichtung 26.10.2026“ einen Eintrag „Stand <Datum>“ ergänzen (erledigte Pakete, Abweichungen,
   offene Punkte, nächstes Paket), in der „Reihenfolge“ erledigte Pakete durchstreichen, **diese Datei (`docs/SESSION-PROMPT.md`) auf den neuen
   Stand bringen** (Abschnitte 2 und 4), pushen und kurz berichten.

## 4. Nächste Pakete (Reihenfolge laut Plan)
0. **Zuerst fragen: Rund oder Pixel?** (Vergleich auf iPad 10 und Handy in `/dev`). Bei „Pixel“: neues Paket „Insel in 2D“ planen
   (Spiel-Logik, Story, Spielstand bleiben; Figuren als Pixel-Sprites) und GRAFIK.md neu fassen. Bei „Rund“: **NA-21** `tests/leistung.js`
   bauen (Haken sind vorbereitet) und das Budget angehen.
1. **NA-14** Tutorial E4–E8 (M): neu `shared/tutorial.js` (Etappen-Liste, Auslöser, Tageslimit – das Limit steckt heute in
   `Story.darfNeueEtappe()`), Szenen in `shared/szenen.js`, Auslöser in `quellen/welt3d/heimat.js` (Funktion `naechsteStory()`),
   `spiele/tier/tier.js`, `shared/lernkartei.js`; Elternschalter „Tutorial überspringen“; bestehende Kinder bekommen nur Etappen,
   deren Feature sie noch nie genutzt haben. Test-Haken `window.__tutorial`. Test: Uhr über drei Tage vorstellen (Muster: `tests/tutorial.js`).
2. Daneben (nur bei „Rund“): **NA-21** Leistungs-Test (`tests/leistung.js`).
3. **NA-16** QR-Geschenk (sobald die Geschenk-Auswahl da ist; Liste eingelöster Geschenke: `Story.hatGeschenk/merkeGeschenk`),
   **NA-17** Kapitel 1–2, **NA-18** Inselchronik im Album (Szenen aus `shared/szenen.js` per `Szene.spiele(id)` abspielen).
4. Danach laut Plan: NA-03 Lehrplan-Kern → NA-40 Wortschatz/DaZ D0 → NA-30 Anlaute → NA-32 → NA-31.

## 5. Wie die Story-Bausteine benutzt werden (Kurzreferenz)
- Szene registrieren (nur Daten) in `shared/szenen.js`:
  `Szene.registriere("id", { titel, etappe: "E4", blasen: [ { wer: "biber", text: { de: "… {name} …", ru: "…", status: { ru: "entwurf" } } } ] })`.
  `wer`: robo, eule, fipsi, biber, baer, papagei, tilda. Höchstens 4 Blasen, kurze Sätze, jede Zeile vorlesbar.
- Auf der Insel abspielen: in `heimat.js` `spieleStory(id)` ergänzen (dort `zeige`/`bis`/`beim` je Blase setzen) und die Bedingung in
  `naechsteStory()` einreihen. Am Ende `Story.etappeFertig(def.etappe)`; Szenen landen automatisch in der Chronik.
- 3D-Ziele für die Zeigehand: `window.Insel.ort("haus" | "sonnenuhr" | "wissensbaum" | "eule" | "ich")`; neue Orte in `ORTE` in `heimat.js`.
- Ereignisse: `Ereignisse.melde("bauwerk", { id })`; auf einer anderen Seite `Ereignisse.abholen("bauwerk")`.

## 6. Regeln (unverändert gültig)
- **Offline-first:** kein Server, keine Konten, keine Daten verlassen das Gerät (einzige Ausnahme: Wetter von Open-Meteo ohne GPS).
- **„Erst lernen, dann spielen“** ist eine harte Regel. Elternbereich mit PIN. Bildschirmzeit nach DGKJ; Erwachsene (PIN) dürfen immer spielen, ohne Sterne.
- **Nie Werbung, nie Käufe, keine süchtig machenden Mechaniken** (keine Lootboxen, kein Druck durch Serien, keine Ranglisten zwischen Kindern,
  keine Fristen in der Story, nichts geht verloren).
- Mehrere Kinder pro Tablet; lokale Speicherung und QR-Übertragung bleiben (Spielstand klein halten; Bilder bleiben in der eigenen IndexedDB).
- **Kein Bezug zu einem echten Kind** im Repo (keine Namen, kein Alter, keine Klasse). Beispielnamen sind ausgedacht (in Tests z. B. „Mira“).
- **Bestehende Funktionen nicht entfernen.** Wenn etwas ersetzt werden soll, im Plan begründen und per Eltern-Schalter die alte Variante anbieten.
- Sprache: Deutsch, kindgerecht; alle neuen Texte als Sprachschlüssel `{ de, ru, … }`; Hilfesprache nur, wenn gewählt. Neue Übersetzungen
  bekommen einen Prüfstatus (`entwurf`/`geprueft`/`kindgerecht`); **keine ungeprüfte Maschinenübersetzung im Kinder-UI** (Entwürfe nur in /dev).
- Story- und Tutorial-Texte: höchstens 4 Sprechblasen je Szene, jede Zeile vorlesbar, ohne Lesen bedienbar (Zeigehand, Leuchten, Ton).
- Grafik: **Bis zur Stilentscheidung (NA-20) keine Figuren neu bauen.** Neue 3D-Teile sparsam (feste Deko in die Gruppe `deko` vor
  `verschmelze(deko)`, dann kosten sie kaum Zeichenaufrufe) und immer auch in Stufe „einfach“ prüfen.
  Keine fremden urheberrechtlich geschützten Figuren; fremde Dateien nur CC0/OFL und dann in `docs/LIZENZEN.md`.
- Lerninhalte nur zusammenfassen und Lernziel-IDs zuordnen, nie Lehrpläne wörtlich abschreiben.
- Commits als `michael-linuxdev <336864235+michael-linuxdev@users.noreply.github.com>`, Nachricht auf Deutsch
  (`git -c user.name=michael-linuxdev -c user.email=336864235+michael-linuxdev@users.noreply.github.com commit …`).

## 7. Bauen
- Wenn Dateien in `quellen/welt3d/` geändert wurden: `ESBUILD=<pfad> sh quellen/bauen.sh` (baut `spiele/welt3d/*.js`, aktualisiert die
  `gemeinsam-*.js`-Einträge in `sw.js`). **Nie** die gebauten Dateien in `spiele/welt3d/` von Hand ändern.
- **Vor jedem Push** `sh quellen/dev-bauen.sh` (setzt die Cache-Version in `sw.js`, baut `/dev` und `/dev/test`; `dev/` nie von Hand ändern).
- Neue Dateien unter `shared/`, `spiele/` oder `inhalte/` in die Offline-Liste in `sw.js` eintragen und in den HTML-Seiten einbinden
  (`shared/ereignisse.js` steht überall direkt nach `shared/core.js`).

## 8. Testen (Pflicht vor jedem Push)
- `sh tests/laufen.sh` = Node-Test `tests/story-migration.js` + Rauchtest über alle Seiten (quer/hoch). Für /dev: `PFAD=dev/ sh tests/laufen.sh`.
  Neue Seiten in `tests/rauchtest.js` aufnehmen (3D-Seiten in `SEITEN_3D`).
- Einzelne Tests: `sh tests/laufen.sh <name>` mit `ereignisse`, `profil`, `szene`, `prolog`, `zugang`, `tutorial`, `weihnachten`, `probe` (Grafik-Proben, NUR=pixel|rund)
  (Screenshots mit `BILDER=<ordner>`). In einer `&&`-Kette mit `tail -1 | grep -q bestanden` prüfen, sonst wird trotz Fehler gepusht.
- Jedes neue Paket bekommt einen eigenen Test `tests/<name>.js` nach dem Muster der vorhandenen.
- Ersteinrichtung im Test: PIN `1234` zweimal (`#pin1`, `#pin2`, `#pin-ok`), dann `#e-name` und `#e-ok` (Stufe, Land, Muttersprache,
  Deutschstand haben Standardwerte; Felder `#e-stufe`, `#e-land`, `#e-mutter`, `#e-deutsch`, `#e-sprache`).
  Insel öffnen: `medien.lektionen = { bedienung: 3 }` setzen; für Minispiele zusätzlich `medien.fuehrerschein`.
- Uhr: `addInitScript(() => { window.__jetzt = new Date(2026,9,25,15,0).getTime(); })`, sonst greift nachts die Ruhezeit.
  Tage vorstellen über localStorage `__testJetzt` (siehe `tests/tutorial.js`). Weihnachten: `new Date(2026,11,10,15,0)` und `?monat=12`.
  Achtung: Ein Testlauf über Mitternacht kann wackeln (Teile der App nehmen das echte Datum) – dann einfach nochmal laufen lassen.
- Insel-Parameter: `heimat.html?stunde=14`, `?monat=12`, `?wetter=regen|schnee|nebel|gewitter|klar`,
  `?biom=berge&groesse=gross&huegel=viel&see=1&seed=5`, `?szene=probe` (Probeszene, auch auf der Startseite).
- Playwright für 3D mit `--enable-unsafe-swiftshader --use-angle=swiftshader`. Swiftshader ist langsam: Bewegungen im Test per Teleport
  (`__heimat.ich.position.set(…)`), zeitabhängige Logik mit Uhrzeit statt `dt`; Leistung über `__heimat.zeichnungen()`, nicht über Bilder/s.
- Pulsierende Knöpfe (Aktionsknopf `#springen`, `#szene-weiter`) mit `click(…, { force: true })`.
- Test-Haken: `__heimat` (blick, ich, reingehen, rausgehen, laufeZu, tippe, station, laden, zimmerDaten, aktion, druecke, rennt, wetter,
  bildschirm, prolog, imProlog, steg, sonnenuhr, su, nebel, naechsteStory, paket, oeffnePaket, lichter, zeichnungen), `__szene`
  (spiele, aktuell, weiter, abbrechen, szenen), `__ereignisse`, `__atelier`, `__musik`, `__schach`, `__gefuehle`, `__lauf`, `__kart`,
  `__bau`, `__duell`, `__ich`, `__mathe`; geplant: `__tutorial`. Jeder neue Baustein bekommt einen Test-Haken.
- Jede geänderte Seite einmal öffnen, Konsole auf Fehler prüfen, Screenshots ansehen (Quer- und Hochformat; mit Hilfesprache Russisch, in /dev).
- Externe Seiten (Open-Meteo, Google Fonts) sind aus der Sandbox meist nicht erreichbar – Fehlermeldungen dazu ignorieren, mit Cache-Daten testen.

## 9. Berichten
Kurz und auf Deutsch: welche Pakete fertig sind (mit Screenshots, wenn es etwas zu sehen gibt), was der Auftraggeber auf dem iPad 10
testen soll (Schritt für Schritt, in `/dev`), welche Entscheidungen du getroffen hast, was als Nächstes kommt.
