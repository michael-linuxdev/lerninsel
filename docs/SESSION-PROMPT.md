# Prompt für die nächste Arbeitssitzung (Umsetzung der Neuausrichtung)

Diesen Text komplett als erste Nachricht in eine neue Sitzung kopieren – **auch in einem anderen Claude-Konto**.
Er ist in sich vollständig: Die neue Sitzung braucht kein Vorwissen, keine Erinnerung und keinen alten Chat.
Voraussetzung: Das Konto hat Lese- und Schreibzugriff auf das GitHub-Repo `michael-linuxdev/lerninsel`
(GitHub in den Claude-Einstellungen unter „Connectors“ verbinden; ohne Schreibzugriff kann die Sitzung nicht pushen).

---

Du arbeitest an der **Lerninsel**: einer Offline-Lern-App für Grundschulkinder auf dem Tablet (reines HTML/CSS/JS, three.js für den Look „Rund“,
PixiJS für den Look „Pixel“, kein Server). Repo `michael-linuxdev/lerninsel`, Branch `main`; was auf `main` liegt, ist sofort online unter lerninsel.micana.de
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
   - **PixiJS-Quellcode** (für den Look „Pixel“; npm und CDNs sind in der Arbeitsumgebung meist gesperrt, GitHub geht):
     ```
     mkdir -p ~/eng/dep && cd ~/eng
     git clone -q --depth 1 --branch v8.22.0 --filter=blob:none --sparse https://github.com/pixijs/pixijs pixi && git -C pixi sparse-checkout set src
     cd dep && for r in primus/eventemitter3 mapbox/earcut kaimallea/isMobile xmldom/xmldom pixijs/colord avoidwork/tiny-lru jkroso/parse-svg-path; do git clone -q --depth 1 https://github.com/$r; done
     ```
     Bauen dann mit `ENGINES=~/eng node quellen/probe/bauen.js` (Ausgabe `spiele/probe/pixel.js`). Geht `npm i pixi.js`, reicht das statt der Klone.
3. Einmal `sh tests/laufen.sh` ausführen (Node-Tests story-migration + inselkern, dann Rauchtest). Muss grün sein, bevor du etwas änderst. Dauert ca. 2 Minuten.

## 1. Zuerst lesen
1. `docs/PLAN.md`, nur den Abschnitt **„Neuausrichtung 26.10.2026“** am Ende – er ist verbindlich (Entscheidungen, Phasen,
   Arbeitspaket-Backlog NA-xx mit Ziel/Dateien/Abnahme/Test/Größe, „Reihenfolge“, offene Fragen) – und darin besonders den letzten Eintrag
   **„Zwei Looks (Entscheidung 27.10.2026)“** und den neuesten Eintrag **„Stand 27.10.2026, Vormittag“** (was fertig ist, Abweichungen, NA-14). Ältere Abschnitte sind Historie.
2. `docs/KONZEPT.md` (Story „Die Insel erwacht“, Begriffe, Figuren, Kapitelbogen, Tutorial-Etappen E0–E10, Verzahnung, Individualisierung).
3. Je nach Paket: `docs/LEHRPLAN.md`, `docs/SPRACHEN.md` (Prüfstatus von Übersetzungen!), `docs/GRAFIK.md` (Leistungsbudget iPad 10, **Abschnitt 2: Regeln des DS-Pixel-Looks**),
   `docs/MINISPIELE.md`.
4. `README.md` (Aufbau des Repos, Liste der Dateien in `shared/`).

## 2. Stand (27.10.2026, Sitzungsende 09 Uhr)
**Früher fertig** (Einzelheiten in PLAN.md unter „Neuausrichtung 26.10.2026“): NA-01 Ereignisse/Story, NA-02 Profil, NA-10 Szenen + Zeigehand,
NA-11 Prolog „Ankunft“ (E1), NA-12 Insel-Zugang, NA-13 Sonnenuhr/„Erst lernen“/Erste Frucht mit Nebel, NA-15 Weihnachts-Sonderstart,
NA-24 Welt-Kern `shared/insel-kern.js`. Alle russischen Szenentexte sind Entwürfe (nur in `/dev`).

**Grafik – Entscheidungen des Auftraggebers (27.10.2026):** zwei gleichwertige Looks, jederzeit umschaltbar: **„Rund“** (three.js, wie Animal
Crossing, `quellen/welt3d/heimat.js`) und **„Pixel“** im **DS-Stil** (Draufsicht wie Handheld-Abenteuer um 2010, eigener Stil, PixiJS 8.22).
Umschalter: Knopf auf der Insel **und** Elternkarte; Kinder dürfen selbst umschalten, Eltern können sperren.

**In der letzten Sitzung fertig und gepusht** (PLAN.md → „Stand 27.10.2026, Vormittag“):
- **NA-26 Pixel-Insel** `spiele/pixel/insel.html` (Quelle `quellen/pixel/insel.js`, Grafiken `quellen/pixel/dinge.js`, Zeichenweg `quellen/pixel/zeichnen.js`):
  Boden und alle Orte aus dem Kern, Nachbarn, Stationen, Aktionsknopf, Prolog, Story-Szenen, Nebelring, Nacht/Wetter, Lichterkette, Weihnachtspaket.
  **1 Zeichenaufruf**, 0,9 MB. Test-Haken `__pixel`, Test `tests/pixelinsel.js`.
- **NA-25 Umschalter eingeschaltet – nur in /dev und /dev/test** (`Spielwelt.lookWaehlbar()` = `UMG !== "prod"`), Test `tests/look.js` (braucht /dev).
- **NA-28 Pixel-Zimmer:** alle Möbel, Wandfarbe, Pinnwand (Lernfund-Zettel), Staffelei und Wandbild mit eigenen gemalten Bildern (auf die Palette
  gebracht), „Einrichten“ als gemeinsamer Baustein `shared/einrichten.js` (auch „Rund“ benutzt ihn).
- **NA-27 Pixel-Figuren:** Kind mit allen Frisuren und Extras aus dem Kleiderschrank (Bild 22×34), Haustier in vier Richtungen.
- **NA-14 Tutorial E4–E8** in beiden Looks: Auslöser/Reihenfolge/„schon genutzt“ in `ETAPPEN` im Kern, Texte in `shared/szenen.js`,
  stilles Erledigen (`Story.etappeFertig(id, true)`), Elternknopf „Einführung überspringen“. Test `tests/etappen.js`.
- Kern-Stationen neu: `nest`, `pinnwand`, `staffelei`, `bild`, `moebel`; Orte für die Zeigehand neu: `nest`, `ballons`, `fipsi`, `baer`.

- **NA-21 Leistungs-Test** `tests/leistung.js`: Tabelle je Szene/Landschaft, Warnung über Budget (Pixel überall 1 Aufruf).
- **NA-29 Budget „Rund“, Teil 1:** lokales Verschmelzen mit Vertex-Farben (`verschmelzeLokal`, `starr`, `gruppeVon` in `heimat.js`), gröbere Kugeln,
  Deko-Felder für große Welten. Insel jetzt ≈ 100 Aufrufe (vorher 521), Welten und Zimmer im Budget. **Teil 2 (Minispiele) offen.**

**Bekannte Baustellen:** Minispiele Schatz-Strand, Sternenlauf, Kart über dem Budget (→ NA-29 Teil 2); neue 3D-Objekte auf der Insel mit
`starr.push([objekt, bewegliche Teile])` anmelden, sonst kosten sie wieder viele Aufrufe; Deutsch-Bereiche in `shared/lehrplan.js` nach KMK 2004 (NA-03);
`SPIELE` steht in `shared/insel-kern.js` und `quellen/welt3d/gemeinsam.js` (gleich halten); „Meine Welt“ (Welten erschaffen) gibt es nur in „Rund“;
der Prolog-Test der runden Insel wackelt, wenn der Rechner nebenbei ausgelastet ist (Software-Rendering) – dann einfach nochmal laufen lassen.

**Offene Fragen an den Auftraggeber:** iPad-/Handy-Test von Pixel-Look, Ankunft, Sonnenuhr, Erste Frucht, Paket, Einführung E4–E8 (in `/dev`);
soll „Pixel“ danach auch auf der Hauptseite wählbar sein? Geschenke zu Weihnachten 2026 (NA-16); Muttersprachler/Lehrkräfte; Tonaufnahmen.

## 3. Ablauf dieser Sitzung
1. **Fragerunde zuerst** (höchstens 4 Fragen mit dem Frage-Werkzeug, sonst als kurze Liste), bevor du baust. Kläre mindestens:
   - Rückmeldung vom iPad 10 und Handy (in `/dev`, mit neuem Kind): Ankunft, Sonnenuhr, Erste Frucht, Einführung E4–E8, und vor allem die
     **Pixel-Insel** (Knopf „👾 Pixel“ auf der Insel): Laufen, Antippen, Zimmer einrichten, Figur/Kleiderschrank. Fehler zuerst beheben.
   - Soll „Pixel“ jetzt auch auf der Hauptseite wählbar werden? Wünsche zum DS-Look (Farben, Größe der Figuren, Details)?
   - Welche Geschenke soll es per QR-Code zu Weihnachten 2026 geben (für NA-16)? Neue Antworten auf die übrigen offenen Fragen im Plan?
   - Gilt die Reihenfolge noch (nächstes: **NA-29 Teil 2** Minispiele, dann NA-16/17/18); läuft die runde Insel auf dem iPad jetzt flüssiger?, oder soll etwas vorgezogen werden?
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
Grundsatz: **Eine Welt, zwei Darstellungen.** Alles außer Zeichnen kommt aus `shared/insel-kern.js` (und gemeinsamen Bausteinen wie
`shared/einrichten.js`); „Rund“ und „Pixel“ zeichnen dieselbe Welt. Nichts, was das Kind besitzt oder erlebt hat, hängt am Look.
**Jede neue Figur, jedes Möbel, jedes Bauwerk, jede Szene in beiden Looks** (oder im Plan als offen vermerken).
1. **Freigabe Pixel auf der Hauptseite** – nur nach Rückmeldung des Auftraggebers: `lookWaehlbar()` in `shared/core.js` auf `true`, Text in der
   Elternkarte („nur in der Testumgebung“) anpassen, `tests/look.js` umstellen.
2. **NA-29 Teil 2: Minispiele ins Budget** (Plan in PLAN.md, letzter Eintrag): Helfer nach `quellen/welt3d/gemeinsam.js` verschieben, Strecken-Deko
   als `InstancedMesh`, Figur verschmelzen. Messen mit `sh tests/laufen.sh leistung`, Abnahme `STRENG=1 sh tests/laufen.sh leistung`.
3. **NA-16** QR-Geschenk (wartet auf die Geschenk-Auswahl) → **NA-17** Kapitel 1–2 (inkl. E9 Atelier, E10 Mein Ich) → **NA-18** Chronik im Album
   (Szenen nochmal ansehen, auch Tutorial-Etappen).
4. **NA-03** Lehrplan-Kern → NA-40 → NA-30 → NA-32 → NA-31. Minispiele bleiben vorerst 3D (aus beiden Looks gestartet); „Meine Welt“ für Pixel offen.

## 5. Wie die Story-Bausteine benutzt werden (Kurzreferenz)
- Szene registrieren (nur Daten) in `shared/szenen.js`:
  `Szene.registriere("id", { titel, etappe: "E4", blasen: [ { wer: "biber", text: { de: "… {name} …", ru: "…", status: { ru: "entwurf" } } } ] })`.
  `wer`: robo, eule, fipsi, biber, baer, papagei, tilda. Höchstens 4 Blasen, kurze Sätze, jede Zeile vorlesbar.
- Auf der Insel abspielen: die Bedingung in `naechsteStory(lage)` in `shared/insel-kern.js` einreihen (gilt für beide Looks) und je Look in
  `spieleStory(id)` die Hooks `zeige`/`bis`/`beim` setzen. Am Ende `K.storyFertig(def)`; Szenen landen automatisch in der Chronik.
- Ziele für die Zeigehand: `window.Insel.ort("haus" | "sonnenuhr" | "wissensbaum" | "eule" | "steg" | "paket" | "ich")`; neue Orte in `ORTE`
  in `K.erstelle()` (x, z, Höhe h); jeder Ort muss in beiden Looks einen Bildschirmpunkt liefern.
- Neue Station (antippbarer Ort): Text/Ziel/Regel in `K.antwort(id)`, Knopf-Aufschrift in `AKTION`/`K.aktionFuer(id)`; die Looks rufen nur
  `zeigeAntwort(K.antwort(id))` auf.
- Ereignisse: `Ereignisse.melde("bauwerk", { id })`; auf einer anderen Seite `Ereignisse.abholen("bauwerk")`.
- Neue Tutorial-Etappe: Eintrag in `ETAPPEN` im Kern (`id`, `szene`, `faellig(st)`, `genutzt()`), Szene in `shared/szenen.js` mit `etappe: "E9"`,
  Zeigehand/Warten in `spieleStory(id)` beider Looks. Kinder, die die Funktion kennen, bekommen die Etappe still.
- Pixel-Grafik: Zeichnung in `quellen/pixel/dinge.js` (Pixelpuffer mit `kugel/zylinder/vieleck/fuelle/rect`, nur Farben aus `PAL`), in
  `quellen/pixel/insel.js` vor `packe()` mit `merke()` in den Atlas, dann `new Sprite(e.tex)`; Dinge auf den Boden mit `stelle(e, x, z)`,
  antippbar mit `antippbar(sprite, x, z, tipp, aktion, nah, id)`.

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
- Grafik: **zwei Looks, „Rund“ (three.js) und „Pixel“ (PixiJS), jederzeit umschaltbar** (Entscheidung 27.10.2026). Neues Sichtbares
  immer für beide Looks bauen oder im Plan als offen vermerken. Pixel: Kacheln 16×16, nur Farben aus der Palette `PAL`, automatischer Umriss,
  ganzzahlige Vergrößerung (scharfe Pixel), Wasser/Animationen in wenigen festen Bildern. Rund: Neue 3D-Teile sparsam (feste Deko in die Gruppe `deko` vor
  `verschmelze(deko)`, dann kosten sie kaum Zeichenaufrufe) und immer auch in Stufe „einfach“ prüfen.
  Keine fremden urheberrechtlich geschützten Figuren; fremde Dateien nur CC0/OFL und dann in `docs/LIZENZEN.md`.
- Lerninhalte nur zusammenfassen und Lernziel-IDs zuordnen, nie Lehrpläne wörtlich abschreiben.
- Commits als `michael-linuxdev <336864235+michael-linuxdev@users.noreply.github.com>`, Nachricht auf Deutsch
  (`git -c user.name=michael-linuxdev -c user.email=336864235+michael-linuxdev@users.noreply.github.com commit …`).

## 7. Bauen
- Wenn Dateien in `quellen/welt3d/` geändert wurden: `ESBUILD=<pfad> sh quellen/bauen.sh` (baut `spiele/welt3d/*.js`, aktualisiert die
  `gemeinsam-*.js`-Einträge in `sw.js`). **Nie** die gebauten Dateien in `spiele/welt3d/` von Hand ändern.
- Pixel-Probe/-Insel bauen: `ENGINES=~/eng node quellen/probe/bauen.js [pixel|insel]` (siehe Abschnitt 0); gebaute Dateien in `spiele/probe/`
  und `spiele/pixel/` nie von Hand ändern. Seiten mit 3D-Bündel, das `welt.js` nutzt, müssen `shared/insel-kern.js` vorher laden.
- **Vor jedem Push** `sh quellen/dev-bauen.sh` (setzt die Cache-Version in `sw.js`, baut `/dev` und `/dev/test`; `dev/` nie von Hand ändern).
- Neue Dateien unter `shared/`, `spiele/` oder `inhalte/` in die Offline-Liste in `sw.js` eintragen und in den HTML-Seiten einbinden
  (`shared/ereignisse.js` steht überall direkt nach `shared/core.js`).

## 8. Testen (Pflicht vor jedem Push)
- `sh tests/laufen.sh` = Node-Test `tests/story-migration.js` + Rauchtest über alle Seiten (quer/hoch). Für /dev: `PFAD=dev/ sh tests/laufen.sh`.
  Neue Seiten in `tests/rauchtest.js` aufnehmen (3D-Seiten in `SEITEN_3D`).
- Einzelne Tests: `sh tests/laufen.sh <name>` mit `ereignisse`, `profil`, `szene`, `prolog`, `zugang`, `tutorial`, `etappen`, `weihnachten`, `pixelinsel`,
  `look` (braucht frisch gebautes /dev), `leistung` (Messtabelle, `STRENG=1` = Budget erzwingen), `probe` (Grafik-Proben, NUR=pixel|rund); mehrere Läufe gleichzeitig mit `PORT=<nummer>`;
  Node: `node tests/inselkern.js`
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
  (spiele, aktuell, weiter, abbrechen, szenen), `__pixel` (ich, teleport, laufeZu, tippe(id), orte, nachbarn, aktion, druecke, reingehen,
  rausgehen, drinnen, besuche, paket, oeffnePaket, lichter, nebel, zimmerDaten, moebel, einrichten, ringe, figur, tierRichtung, zeichnungen, zoom), `__ereignisse`, `__atelier`, `__musik`, `__schach`, `__gefuehle`, `__lauf`, `__kart`,
  `__bau`, `__duell`, `__ich`, `__mathe`; geplant: `__tutorial`. Jeder neue Baustein bekommt einen Test-Haken.
- Jede geänderte Seite einmal öffnen, Konsole auf Fehler prüfen, Screenshots ansehen (Quer- und Hochformat; mit Hilfesprache Russisch, in /dev).
- Externe Seiten (Open-Meteo, Google Fonts) sind aus der Sandbox meist nicht erreichbar – Fehlermeldungen dazu ignorieren, mit Cache-Daten testen.

## 9. Berichten
Kurz und auf Deutsch: welche Pakete fertig sind (mit Screenshots, wenn es etwas zu sehen gibt), was der Auftraggeber auf dem iPad 10
testen soll (Schritt für Schritt, in `/dev`), welche Entscheidungen du getroffen hast, was als Nächstes kommt.
