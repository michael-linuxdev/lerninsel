# Lerninsel – Arbeitsanweisungen für Claude

Diese Datei liest Claude Code beim Start automatisch. Sie enthält alles, was **dauerhaft** gilt (Einrichtung, Regeln, Bauen, Testen,
Datenformate). Was sich von Sitzung zu Sitzung ändert – aktueller Stand, offene Fragen, nächste Pakete – steht in **`docs/SESSION-PROMPT.md`**;
lies diese Datei zu Sitzungsbeginn ebenfalls.

Du arbeitest an der **Lerninsel**: einer Offline-Lern-App für Grundschulkinder auf dem Tablet (reines HTML/CSS/JS, three.js für den Look „Rund“,
PixiJS für den Look „Pixel“, kein Server). Repo `michael-linuxdev/lerninsel`, Branch `main`; was auf `main` liegt, ist sofort online unter
lerninsel.micana.de (Hauptseite für die Kinder), `/dev` (neue Funktionen, eigener Spielstand) und `/dev/test` (Testmodus, alles frei).
Der Auftraggeber testet auf einem **iPad 10**. Antworte und schreibe alles auf **Deutsch**.

## 1. Einrichten (zu Sitzungsbeginn, ohne nachzufragen)
1. Repo holen (entfällt, wenn Claude Code schon im geklonten Repo läuft): `git clone https://github.com/michael-linuxdev/lerninsel` (bzw. das Repo der Sitzung hinzufügen, falls das Werkzeug dafür da ist).
   Arbeite direkt auf `main`; vor jedem Push `git fetch origin main && git rebase origin/main`.
2. Werkzeuge prüfen, nur fehlende nachinstallieren (die Pfade unter `/opt` gelten für die Cloud-Umgebung; lokal reicht `npm i -g playwright esbuild && npx playwright install chromium`):
   - **esbuild** (für 3D): `/opt/npm-tools/node_modules/esbuild/bin/esbuild`, sonst `npx --yes esbuild` oder `npm i -g esbuild` → `ESBUILD=esbuild`.
   - **Playwright + Chromium**: `node -e "require('playwright')"` (ggf. vorher `export NODE_PATH=$(npm root -g)`); Browser unter `/opt/pw-browsers`
     (`PLAYWRIGHT_BROWSERS_PATH`). Fehlt beides: `npm i -g playwright && npx playwright install chromium` und `PLAYWRIGHT_BROWSERS_PATH` weglassen.
   - `python3` für den lokalen Server.
   - **PixiJS-Quellcode** (nur für Grafik-Arbeit am Look „Pixel“ nötig; npm und CDNs sind in der Arbeitsumgebung meist gesperrt, GitHub geht):
     ```
     mkdir -p ~/eng/dep && cd ~/eng
     git clone -q --depth 1 --branch v8.22.0 --filter=blob:none --sparse https://github.com/pixijs/pixijs pixi && git -C pixi sparse-checkout set src
     cd dep && for r in primus/eventemitter3 mapbox/earcut kaimallea/isMobile xmldom/xmldom pixijs/colord avoidwork/tiny-lru jkroso/parse-svg-path; do git clone -q --depth 1 https://github.com/$r; done
     ```
     Bauen dann mit `ENGINES=~/eng node quellen/probe/bauen.js` (Ausgabe `spiele/probe/pixel.js`). Geht `npm i pixi.js`, reicht das statt der Klone.
3. Einmal `sh tests/laufen.sh` ausführen (Node-Tests, dann Rauchtest über 66 Seitenaufrufe). Muss grün sein, bevor du etwas änderst. Dauert ca. 2–3 Minuten.

## 2. Zuerst lesen (je nach Aufgabe)
1. `docs/PLAN.md`, Abschnitt **„Neuausrichtung 26.10.2026“** am Ende – verbindlich (Entscheidungen, Arbeitspakete NA-xx, offene Fragen),
   darin **„Zwei Looks (Entscheidung 27.10.2026)“** und die **neuesten „Stand …“-Einträge**. Ältere Abschnitte sind Historie.
   Den aktuellen Stand und die nächsten Pakete nennt `docs/SESSION-PROMPT.md`.
   **Seit 27.10.2026 gilt die Ausrichtung „Lehrplan Sachsen in voller Tiefe, wie ein Schuljahr“: Arbeitsliste `docs/SACHSEN-SCHULJAHR.md`.**
2. `docs/KONZEPT.md` (Story „Die Insel erwacht“, Figuren, Tutorial-Etappen E0–E10).
3. Je nach Paket: `docs/LEHRPLAN.md` (Matrix, „Was die App heute abdeckt“), `docs/SPRACHEN.md` (Prüfstatus von Übersetzungen!),
   `docs/GRAFIK.md` (Leistungsbudget iPad 10, Pixel-Regeln), `docs/MINISPIELE.md`.
4. `README.md` (Aufbau des Repos).
5. Vor neuen Inhalten die passende Datendatei überfliegen (Stil, Länge, Schritt-Typen): `spiele/mathe/aufgaben.js`, `spiele/deutsch/werkstatt.js`,
   `spiele/sachkunde/themen.js`, `spiele/englisch/lektionen.js`, `shared/lehrplan/kern.js` (Lernziel-IDs), `shared/lehrplan/laender/sachsen.js`.

## 3. Arbeitsweise (gilt in jeder Sitzung)
1. **Fragerunde zuerst** (höchstens 4 Fragen mit dem Frage-Werkzeug): iPad-Rückmeldung (**gemeldete Fehler zuerst beheben, je mit Test**), welche
   Pakete, was keinesfalls angefasst werden darf, offene Fragen aus `docs/SESSION-PROMPT.md`.
2. **Dann selbstständig in größeren Schritten** (2–4 Pakete oder ein großes), Aufgabenliste anlegen und abhaken. Nur bei nicht umkehrbaren
   Entscheidungen nachfragen, sonst die vernünftigste Wahl treffen und im Plan notieren.
3. **Nach jedem Schritt:** `sh quellen/dev-bauen.sh`, `sh tests/laufen.sh`, betroffene Einzeltests (parallel mit `PORT=…`, Insel-Tests allein),
   Screenshots quer und hoch ansehen, dann committen und pushen (`git fetch origin main && git rebase origin/main` vorher). Kein Push mit rotem Test.
4. **Bei Lehrplan-Änderungen:** `shared/lehrplan/laender/sachsen.js` und die Zählung in `tests/lehrplan.js` nachziehen; ehrlich bleiben
   („teilweise“, wenn etwas fehlt, und im `hinweis` sagen, was fehlt). Lehrplantexte nur zusammenfassen.
5. **Am Ende:** in `docs/PLAN.md` einen Eintrag „Stand <Datum>“ (erledigt, Entscheidungen, offen, nächstes Paket), `docs/SESSION-PROMPT.md`
   auf den neuen Stand bringen (Stand, offene Fragen, nächste Pakete) und – wenn sich Formate oder Regeln geändert haben – diese Datei; pushen; berichten.

## 4. Regeln
- **Offline-first:** kein Server, keine Konten, keine Daten verlassen das Gerät (einzige Ausnahme: Wetter von Open-Meteo ohne GPS).
- **„Erst lernen, dann spielen“** ist eine harte Regel. Elternbereich mit PIN. Bildschirmzeit nach DGKJ; Erwachsene (PIN) dürfen immer spielen, ohne Sterne.
- **Nie Werbung, nie Käufe, keine süchtig machenden Mechaniken** (keine Lootboxen, kein Druck durch Serien, keine Ranglisten zwischen Kindern,
  keine Fristen in der Story, nichts geht verloren).
- Mehrere Kinder pro Tablet; lokale Speicherung und QR-Übertragung bleiben (Spielstand klein halten; Bilder bleiben in der eigenen IndexedDB).
- **Kein Bezug zu einem echten Kind** im Repo (keine Namen, kein Alter, keine Klasse). Beispielnamen sind ausgedacht (in Tests z. B. „Mira“).
- **Bestehende Funktionen nicht entfernen.** Wenn etwas ersetzt werden soll, im Plan begründen und per Eltern-Schalter die alte Variante anbieten.
- Sensible Themen (Körper, Pubertät, Sucht, Gefühle): altersgerecht, sachlich, ohne Details über die Lehrplan-Inhalte hinaus; immer auf
  Vertrauenspersonen und die Nummer gegen Kummer (116 111) verweisen; „Mein Körper gehört mir“.
- Sprache: Deutsch, kindgerecht; alle neuen Texte als Sprachschlüssel `{ de, ru, … }`; Hilfesprache nur, wenn gewählt. Neue Übersetzungen
  bekommen einen Prüfstatus (`entwurf`/`geprueft`/`kindgerecht`); **keine ungeprüfte Maschinenübersetzung im Kinder-UI** (Entwürfe nur in /dev; Ausnahmen nach Entscheidung des Auftraggebers in `Spielwelt.ENTWURF_FREI`: `ru`, `hsb`).
- Story- und Tutorial-Texte: höchstens 4 Sprechblasen je Szene, jede Zeile vorlesbar, ohne Lesen bedienbar (Zeigehand, Leuchten, Ton).
- Grafik: **zwei Looks, „Rund“ (three.js) und „Pixel“ (PixiJS), jederzeit umschaltbar** (Entscheidung 27.10.2026). Neues Sichtbares
  immer für beide Looks bauen oder im Plan als offen vermerken. Pixel: Kacheln 16×16, nur Farben aus der Palette `PAL`, automatischer Umriss,
  ganzzahlige Vergrößerung (scharfe Pixel), Wasser/Animationen in wenigen festen Bildern. Rund: Neue 3D-Teile sparsam (feste Deko in die Gruppe `deko` vor
  `verschmelze(deko)`, dann kosten sie kaum Zeichenaufrufe) und immer auch in Stufe „einfach“ prüfen.
  Keine fremden urheberrechtlich geschützten Figuren; fremde Dateien nur CC0/OFL und dann in `docs/LIZENZEN.md`.
- Lerninhalte nur zusammenfassen und Lernziel-IDs zuordnen, nie Lehrpläne wörtlich abschreiben.
- Commits als `michael-linuxdev <336864235+michael-linuxdev@users.noreply.github.com>`, Nachricht auf Deutsch
  (`git -c user.name=michael-linuxdev -c user.email=336864235+michael-linuxdev@users.noreply.github.com commit …`).

## 5. Bauen
- Wenn Dateien in `quellen/welt3d/` geändert wurden: `ESBUILD=<pfad> sh quellen/bauen.sh` (baut `spiele/welt3d/*.js`, aktualisiert die
  `gemeinsam-*.js`-Einträge in `sw.js`). **Nie** die gebauten Dateien in `spiele/welt3d/` von Hand ändern.
- Pixel-Probe/-Insel bauen: `ENGINES=~/eng node quellen/probe/bauen.js [pixel|insel]` (siehe Abschnitt 1); gebaute Dateien in `spiele/probe/`
  und `spiele/pixel/` nie von Hand ändern. Seiten mit 3D-Bündel, das `welt.js` nutzt, müssen `shared/insel-kern.js` vorher laden.
- **Vor jedem Push** `sh quellen/dev-bauen.sh` (setzt die Cache-Version in `sw.js`, baut `/dev` und `/dev/test`; `dev/` nie von Hand ändern).
- Neue Dateien unter `shared/`, `spiele/` oder `inhalte/` in die Offline-Liste in `sw.js` eintragen und in den HTML-Seiten einbinden
  (`shared/ereignisse.js` steht überall direkt nach `shared/core.js`).

## 6. Testen (Pflicht vor jedem Push)
- `sh tests/laufen.sh` = Node-Tests `story-migration`, `inselkern`, `lehrplan`, `wortschatz`, `koennen`, `mathe-generatoren` + Rauchtest über alle Seiten (quer/hoch). Für /dev: `PFAD=dev/ sh tests/laufen.sh`.
  Neue Seiten in `tests/rauchtest.js` aufnehmen (3D-Seiten in `SEITEN_3D`).
- Einzelne Tests: `sh tests/laufen.sh <name>` mit `ereignisse`, `profil`, `szene`, `prolog`, `zugang`, `tutorial`, `etappen`, `weihnachten`, `pixelinsel`,
  `look` (braucht frisch gebautes /dev), `leistung` (Messtabelle, `STRENG=1` = Budget erzwingen), `probe` (Grafik-Proben, NUR=pixel|rund|pixel25d), `daz` (Ankommen/DaZ D0), `lesen` (Laute, Silben, Lesetexte, Nachspuren, Wörter legen), `mathe1` (Matheweg Kl. 1, 3 und 4, Urkunde, Eltern-Wahl Subtraktion), `sachkunde` (61 Themen, die neun von NA-34 echt durchgeklickt, Landesfilter), `sachkundevoll` (29 Schuljahr-Themen Kl. 1–4 über die Kacheln echt durchgeklickt, Gruppen nach Lernbereichen, Landesfilter, Elternbereich), `deutsch34` (Werkstatt Kl. 3–4 inkl. echtem Antippen von `ordnen`/`verbessern`), `sorbisch` (Sorbisch: Tür nur mit Wahl, Hauptseite alle Entwürfe bzw. ohne Freigabe nur geprüfte, /dev alle 47 echt durchgeklickt, Prüfseite; braucht frisch gebautes /dev), `luecken` (Mein Heft mit echt getipptem Text, Schreibschrift nachspuren, Englisch-Lernkartei über zwei Tage, Lieder bis zum Ende), `mathe5` (10 Kl.-5-Stationen über die Tasten, Schulart im Elternbereich), `deutschvoll` (52 Schuljahr-Kapitel Kl. 1–4 über die Kacheln echt durchgespielt, Gruppen nach Lernbereichen, Elternbereich), `uebergang5` (Übergang Kl. 5: Matheweg, Urkunden, Deutsch und Sachthemen echt durchgeklickt), `englisch` (Englisch: Tür, Sichtbarkeit, alle 31 Lektionen echt durchgeklickt, auch Bilderbuch, Sachtext, Rollenspiel), `schreiben` (Werkstatt frei schreiben mit echtem Tippen, sich aufnehmen mit Fake-Mikrofon, Eltern-Schalter, Elternbereich), `mathe2` (Matheweg Kl. 2: Freischalten je Lernbereich, 17 neue Stationen über die Tasten durchgespielt, Inhaltspunkte im Elternbereich), `mathe34` (Kl. 3 und 4: 18 neue Stationen über die Tasten, Urkunde nur mit den alten 15), `mathe15` (Kl. 1 und Übergang 5: 15 neue Stationen, Urkunde Übergang, Übergangs-Punkte im Elternbereich), `mathevoll` (letzte 16 Mathe-Stationen und Werkstatt „Rechengeschichten“ echt durchgespielt, alle Mathe-Lernbereiche ✅), `schuljahr` (Lernbereichs-Kacheln, „gerade in der Schule“, „Zeig, was du kannst“ mit Ergebnis im Elternbereich), `faechervoll` (Kunst, Musik, Werken, Sport, Ethik, Religion: alle 70 + 37 Themen über die Fach-Reiter echt durchgeklickt, Kl. 2/3/4, Landesfilter, Elternbereich), `schuljahr2` (Deutsch, SU und Englisch: „gerade in der Schule“ je Fach, „Zeig, was du kannst“ je Lernbereich echt durchgespielt mit einem Fehler, Elternbereich), `tafel` (jede Mathe-Aufgabe aller Wege passt ohne Scrollen auf die Tafel: iPad hoch/quer, Handy 390 × 760 – neue Stationen mit langen Fragen oder großen Bildern hier prüfen), `koennen-anzeige` (Mein Können, Empfehlung), `handy` (Rechenaufwand auf kleinen Smartphones, `DROSSEL=4`); mehrere Läufe gleichzeitig mit `PORT=<nummer>`;
  Node: `node tests/inselkern.js`
  (Screenshots mit `BILDER=<ordner>`). In einer `&&`-Kette mit `tail -1 | grep -q bestanden` prüfen, sonst wird trotz Fehler gepusht.
- Jedes neue Paket bekommt einen eigenen Test `tests/<name>.js` nach dem Muster der vorhandenen – **mit echtem Durchklicken bis zum Ende**
  (Muster: `tests/englisch.js`, `tests/uebergang5.js`), nicht nur Schritte per Test-Haken setzen.
- `tests/tutorial.js` und `tests/prolog.js` (3D-Insel) allein laufen lassen; unter Last wackeln sie.
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
  `__bau`, `__duell`, `__ich`, `__mathe` (… zeigeUrkunde, starteLernstand(lb), zeige(n) = Aufgabe n der Runde anzeigen), `__sachkunde` (starte, schritt), `__englisch` (starte, schritt, sichtbar), `__deutsch` (starte, schritt), `window.__testSchnell = true` (Werkstatt blättert nach richtiger Antwort nach 150 ms statt 2,3 s weiter); geplant: `__tutorial`. Jeder neue Baustein bekommt einen Test-Haken.
- Jede geänderte Seite einmal öffnen, Konsole auf Fehler prüfen, Screenshots ansehen (Quer- und Hochformat; mit Hilfesprache Russisch, in /dev).
- Externe Seiten (Open-Meteo, Google Fonts) sind aus der Sandbox meist nicht erreichbar – Fehlermeldungen dazu ignorieren, mit Cache-Daten testen.

## 7. Kurzreferenz (Story-Bausteine, Datenformate, Schnittstellen)
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
- Sachsen-Profil: Mathe und Deutsch **Fassung 2025**, Sachunterricht und Englisch Fassung 2019; Fächer `mathe`, `deutsch`, `sachkunde`, `englisch`;
  **Inhaltspunkte** je Lernbereich in `shared/lehrplan/laender/sachsen-punkte.js` (`[id, Text, Klasse, app[], abdeckung]`, abdeckung `ja`|`teil`|`nein`|`aussen`,
  app `mathe:<station>`, `werkstatt:<kapitel>` oder `echtewelt:<id>`; Mathe Kl. 1–4 ist vollständig – neue Punkte nur mit Zuordnung, nie „teil“ ohne Grund; laden nach `sachsen.js`, vor `shared/lehrplan.js`; `tests/lehrplan.js` prüft Zuordnung und Zählung);
  **seit 28.10.2026 auch Deutsch (Kl. 1/2, 3, 4), Sachunterricht (Pflicht-LB) und Englisch (Kl. 3, 4 inkl. LB 11 „My Portfolio“)**; weitere app-Präfixe
  `deutsch:<abenteuer>`, `lesen:<anlaute|silben|texte|spuren|legen|tafel>`, `medien:<lektion>`, `sachkunde:<thema>`, `englisch:<lektion>`; LB-Abdeckung
  ist „ja“ genau dann, wenn kein Punkt „teil“/„nein“ ist (prüft `tests/lehrplan.js`); jedes Werkstatt-Kapitel, Sachthema und jede Englisch-Lektion
  muss in einem Punkt vorkommen (Ausnahmen im Test);
  nach jeder Änderung die Zählung in `tests/lehrplan.js` anpassen (Mathe/Deutsch/SU und Englisch getrennt).
- Lernziele: `LernzielKern.ziel("de.le.02")`, `LernzielKern.fach("de", "le")`; Länder-Abweichungen in `shared/lehrplan/laender/<land>.js`
  (`stufe`, `extra`, `quelle`). Inhalte: `Inhalte.registriere({...})`, `Inhalte.abdeckung(lz)`, `Inhalte.fuer({ stufe, land })`, `Inhalte.ohneInhalt()`.
  Seiten, die das brauchen, laden `kern.js` → `shared/inhalte.js` → `laender/*.js` → `shared/lehrplan.js` (siehe `spiele/eltern/index.html`).
- Wortschatz: `Wortschatz.wort("w.apfel")` (de, artikel, mehrzahl, silben[], bild, themen, wortart, daz, ru/uk + status), `Wortschatz.feld("essen")`,
  `Wortschatz.daz("d0")`, `Wortschatz.saetze("d0")`, `Wortschatz.hilfe(eintrag)` (Hilfetext nur wenn erlaubt), `Wortschatz.ARTIKEL` (Farbe + Form).
  Einbinden: `inhalte/woerter/*.js` vor `shared/woerter.js`. DaZ-Fortschritt: `DaZ.merke("wort"|"satz", id)`, `DaZ.stand()`, `DaZ.d0Fertig()`.
- Eltern-Einstellungen: `eltern.mathe.minus` = `abziehen` | `ergaenzen` (Hilfe „Schriftlich minus“), `eltern.mathe.schule` = `zo`|`rf`|`gm`|`dz`|`""` (Lernbereich „gerade in der Schule“; Ergebnisse von „Zeig, was du kannst“ in `mathe.lernstand["<weg>:<lb>"]` = `{ am, n, richtig, je: {station: bool} }`), `eltern.englisch.ab` = `"3"` | `"1"`,
  `eltern.deutsch.aufnehmen` = `true` | `false` (Standard aus; sich selbst aufnehmen in der Werkstatt), `eltern.deutsch.schule` = `sz`|`sc`|`le`|`tm`|`su`|`""` und
  `eltern.sachkunde.schule` = `zl`|`kg`|`pt`|`un`|`rz`|`ex`|`""` (Lernbereich „gerade in der Schule“: Gruppe steht oben, markiert); ebenso `eltern.kunst|musik|werken|sport|ethik.schule` = Lernbereich-ID aus `FACH_SEITEN`; `eltern.ethik.unterricht` = `ethik`|`ev`|`ka` (Religion statt Ethik: Reiter „Religion“ mit Themen aus `spiele/sachkunde/religion.js` – Fach `religion`, `konf: ["ev"|"ka"]`, `lb` `re1`…`re4`, nur mit Wahl sichtbar; im Elternbereich `evreligion`/`kareligion` statt `ethik`); Ergebnisse von „Zeig, was du kannst“
  in `deutsch.lernstand` bzw. `sachkunde.lernstand` je `"k<klasse>:<lb>"` = `{ am, n, richtig, je: { kapitel|thema: bool } }` (Test-Haken
  `__deutsch.starteLernstand(lb)`, `__sachkunde.starteLernstand(lb)`; Aufgaben nur aus Kapiteln/Themen der eigenen Klasse, bis zu 3 je Kapitel, höchstens 10).
- Neue Fachseite anbinden (Muster Englisch): Tür in `index.html` (Raster 12 Spalten), `LERN_FAECHER` und „Erst lernen“-Knöpfe in `shared/zeit.js`,
  Fähigkeit in `shared/charakter.js` (`FAEHIGKEITEN`, `BELOHNUNGEN`, `LECKERLI`), Fach in `shared/lernfunde.js`, Register in `shared/inhalte.js`,
  Kern-Fach in `shared/lehrplan/kern.js`, `sw.js`, `tests/rauchtest.js`, Elternbereich (Karte, „Was übt die App?“ zeigt alle Fächer des Profils).
- Können: `Koennen.melde(lz, richtig)` (nur erster Versuch), `Koennen.standVon(lz)`, `Koennen.standListe(lz[])`, `Koennen.naechste(stationen, n)`,
  `Koennen.brauchtLeichter(lz)`; Seiten laden `shared/koennen.js`.
- Lesen/Schreiben: `window.ANLAUTE` (Anlaut-Tabelle), `window.LESETEXTE` (Texte in Sprechsilben „Ba-na-ne“), `window.SCHRIFT` (Strich-Daten),
  Lernkartei-Fach `lesen` (Schritte `anlaut`, `silbenwort`, `schreibwort`);
  Matheweg: `Mathe.STATIONEN` (Kl. 2, 45 Stationen, `mathe.k2`; jede Station mit Lernbereich `lb`: `zo`|`rf`|`gm`|`dz` – offen auch, wenn die vorige Station desselben `lb` geschafft ist; gilt auch für Kl. 3/4; neue Stationen ans Ende; eine Runde braucht 10 verschiedene Aufgaben – jeder Generator muss genug Vielfalt haben), `Mathe.STATIONEN_K1` (Kl. 1/Vorschule, 22 Stationen, `mathe.k1`), `Mathe.STATIONEN_K3` (Kl. 3, 35 Stationen, `mathe.k3`), `Mathe.STATIONEN_K4` (Kl. 4, 26 Stationen; neue mit `zusatz: true`, die Urkunde zählt nur Stationen ohne `zusatz` – **neue Stationen immer ans Ende hängen**, sonst sperrt das Freischalten vorhandene, `mathe.k4`, Ende mit Urkunde), `Mathe.STATIONEN_K5` (Übergang 5, 26 Stationen, `mathe.k5`; Inhaltspunkte Klasse 5 in `sachsen-punkte.js` als `uebergang.schularten.os|gy` (Lehrpläne Oberschule 2019, Gymnasium 2021), Eltern-Wahl `eltern.mathe.schulart` = `os`|`gy`, Urkunde über `zeigeUrkunde(weg)`; Aufgabenfeld `max` = erlaubte Ziffern – **jede Antwort mit mehr als 3 Ziffern braucht `max`**, das prüft `tests/mathe-generatoren.js`; `Mathe._k3.istWuerfelnetz(zellen)`, `roemisch(n)`, `istPrim(n)`, `wuerfelGebaeude()`), Weg-Wahl in `mathe.weg`.
- Mathe-Generatoren (`spiele/mathe/aufgaben.js`): Station `{ id, stufe, lz, name, icon, neu: () => Aufgabe }`; Aufgabe über `zahl(text, antwort, hilfe,
  { frage, bild, einheit, nurLuecke, max })` oder `{ art: "wahl", optionen, antwort, frage, bild, hilfe }` (kurz: `wahlAufgabe(frage, antwort, falsche[], hilfe, extra)`;
  lange Antworten bekommen automatisch kleinere Tasten). Bildfunktionen nie doppelt benennen – eine gleichnamige `function` überschreibt still die alte (`tests/mathe-generatoren.js` prüft das und dass jede Runde 10 verschiedene Aufgaben hat). Bilder sind SVG-Strings
  (`stellenBild`, `schriftBild`, `schriftBildViele`, `netzBild`, `spiegelBild`, `saeulenBild`, `kaestchenBild`, `kugelBild`, `gebaeudeBild`, `radBild`, `karteBild`). Neuer Weg: `WEGE` in `mathe.js`,
  `daten()`, Umschalter, Zielknoten, `shared/inhalte.js` (concat), Elternbericht.
- Werkstatt-Kapitel (`spiele/deutsch/werkstatt.js`): `{ id: "w-…", stufe, lz, name, ort, farbe, grund, schritte: [...] }`; Schritt-Typen `sag`,
  `luecke` (`satz` mit `___`, erste Option richtig), `satz` (Wörter in Reihenfolge), `wortart`, `verlaengern`, `silben`, `artikel`, `bild`, `wort`, `wo`,
  `ordnen` (`{ frage?, teile: [richtige Reihenfolge], e?, ru }`, Teile ≤ 16 Zeichen liegen nebeneinander), `verbessern`
  (`{ frage?, satz, falsch, stelle?, optionen: [besser, …], tipp?, e?, ru }`, `stelle` = Wortnummer bei Mehrfachvorkommen),
  `schreiben` (`{ frage, e? | bilder?: ["🐶⚽", …], woerter?, saetze?, pflicht?: [Wörter], karten?: [Wörter zum Einfügen], anfang?, ru }` – freies
  Schreiben, Prüfung ohne KI: Länge, Satzanfang groß, Satzzeichen am Ende, Pflichtwörter; erster Versuch mit Lücken = freundlicher Hinweis,
  zählt nicht als Fehler) und `aufnehmen` (`{ frage, gedicht? | bilder? | e?, titel?, ru }` – fällt still weg ohne Eltern-Erlaubnis/Mikrofon);
  `sag` mit `gedicht: [Zeilen]` (+ `titel`) zeigt ein Gedicht zeilenweise; `hoertext` (`{ e?, text, frage, optionen: [richtig, …], ru }` – Text wird
  vorgelesen, dann die Frage; ohne Stimme steht er zum Lesen da), `blitz` (`{ wort, optionen, ms?, ru }` – Blitzlesen), `schreiben` mit `liste: true`
  (Zettel, Elfchen: nur Länge/Pflichtwörter). Jedes Kapitel hat `lb` (`sz`|`sc`|`le`|`tm`|`su` = Lernbereich Deutsch 2025); die Werkstatt zeigt die
  Kapitel danach gruppiert, Kapitel früherer Klassen (Kl. 1/2 = eine Stufe) eingeklappt. Eigene Texte/Aufnahmen: `Eigenes.speichere/alle/loesche/url`
  (`shared/eigenes.js`, eigene IndexedDB, nie im Spielstand), `Eigenes.darfAufnehmen()`, `__deutsch.pruefeText(text, schritt)`.
  Renderer in `spiele/deutsch/abenteuer.js` (`schritt()`/`switch`), Antwort über `antwort(knopf, richtig, beiRichtig)`.
- Englisch (`spiele/englisch/lektionen.js`): `{ id, lb (1–11 = Lernbereich Lehrplan 2019, Übersicht danach gruppiert), stufe, lz, name, e, farbe, grund, intro: { de, ru }, woerter: [{ en, de, ru, e }], extra: [satz|wahl], ende }`;
  Schritte entstehen in `englisch.js` (`baue(k)`) aus den Wörtern; jedes Wort braucht ein eigenes Emoji. Test-Haken `__englisch` (starte, schritt, lauf, sichtbar).
  Eltern-Einstellung `eltern.englisch.ab` = `"3"` | `"1"`, `eltern.englisch.schule` = `"1"`…`"11"` | `""`; „Zeig, was du kannst“: `__englisch.starteLernstand(nr)`,
  Ergebnis in `englisch.lernstand["k<3|4>:<nr>"]`.
- Sorbisch (`spiele/sorbisch/`, 28.10.2026, nur nach Eltern-Wahl `eltern.sorbisch.an`, `eltern.sorbisch.schule` = `"1"`…`"11"`): Lektionen in `lektionen.js`
  wie Englisch, aber Wörter `{ so, de, ru, e }`, `stufe` 1 (Kl. 1/2) oder 3 (Kl. 3/4), `lb` 1–11 (`SORBISCH_LB`); **alle sorbischen Texte sind Entwürfe** –
  seit 29.10.2026 auf Hauptseite und /dev alle (`S.entwurfErlaubt("hsb")`, `hsb` in `ENTWURF_FREI`); ohne diese Freigabe nur IDs aus `geprueft.js` (`SORBISCH_FREI`); Prüfliste `pruefen.html` (`__pruefen`). Keine sorbische
  Stimme (nichts Sorbisches vorlesen, keine Hör-Aufgaben). Test-Haken `__sorbisch` (alle, frei, starte, starteLernstand, schritt, lauf, sichtbar); Punkte `sorbisch:<id>`.
- Mein Heft (`spiele/heft/`, Test-Haken `__heft`): zeigt `Eigenes.alle()` (Texte/Aufnahmen der Werkstatt) für das Kind; Löschen nur im Elternbereich.
- Schreibschrift (`inhalte/deutsch/schreibschrift.js`, 29.10.2026): `window.SCHREIBSCHRIFT` = { buchstaben: { z: { e, ein?, k: Pfad (M/L/C), x, extra? } }, reihe, woerter,
  baue(wort) → { striche, links, breite } }; Feld wie `SCHRIFT` (Mittellinie 45, Grundlinie 90); neue Buchstaben mit `x` (Ausgang) und `e` (Ende Aufstrich), dann
  Vorschau ansehen. Modus `sas` in `spiele/lesen/lesen.js` (`__lesen.spurenRunde("sas")`), Fortschritt `lesen.sas`, Eltern `eltern.deutsch.schrift` = `sas`|`aus`.
- Lieder (`shared/lieder.js`): `Lieder.LIEDER` [{ id, titel, sprache, de?, ru?, zeilen: [[Text mit Silben-Bindestrichen, Noten]] }] – je Silbe eine Note
  (`C D E F G A H`, `c d e` höher, `,G` tiefer, Zahl = Schläge); ohne Noten = Reim (Gerätestimme). `Lieder.zeige(el, id, { fertig })`; nur gemeinfreie
  Lieder; `window.__liederSchnell = true` im Test. Englisch-Schritt `{ typ: "lied", id, ru }`; Atelier `__musik.singen(id)`.
- Lernkartei: Fächer `deutsch`, `sachkunde` (+ weitere Fächer), `lesen`, **`englisch`, `sorbisch`** (Schritte `lesen`/`deutsch`/`hoeren`/`wahl`, Schlüssel über `wort.en|so`).
- Sachthemen (`spiele/sachkunde/themen.js`): `{ id, lb, stufe? | kl?, land?, lz, name, e, farbe, grund, kurz, schritte }` (`lb`: `zl`|`kg`|`pt`|`un`|`rz`|`ex` = Lernbereich SU,
  Liste danach gruppiert; `kl` nur fürs Einklappen „früherer Klassen“ bei Themen ohne `stufe`) (`stufe` wie in der Werkstatt: sichtbar ab der Klasse davor; `land: "sn"` = nur für Kinder aus Sachsen; benannte SVG-Bilder wie `sachsen` in `bilder.js`); Typen `info` (mit `fakten`), `wahl` (`ok`, `warum`),
  `daumen` (`ok`), `zuordnen` (2–3 Gruppen, je 2–3 Dinge), `baum`. Jede Zeile mit russischem Entwurf (`ru`, `satzRu`, `warumRu`).
- Weitere Fächer (`spiele/sachkunde/faecher.js`, 28.10.2026): `window.FACH_SEITEN` (kunst, musik, werken, sport, ethik: Name, Emoji, Intro, Lernbereiche `lb`
  wie `ku1`…`ku3`, `mu1`…`mu4`, `we1`…`we6`, `sp1`…`sp6`, `et1`…`et4`) und `window.FACH_THEMEN` (Themen wie in `themen.js`, zusätzlich `fach`; ids mit
  Präfix `ku-`, `mu-`, `we-`, `sp-`, `et-`); Seite `spiele/sachkunde/?fach=<fach>` (Reiter oben, Test-Haken `__sachkunde.fach`, `.themen`); Sterne
  in `sachkunde.themen`, Lernstand `sachkunde.lernstand["k<kl>:<lb>"]`, Lernkartei/Lernfunde je Fach. Inhaltspunkte mit `sachkunde:<id>`; neue Lernbereichs-
  Abdeckung `aussen` (🌍, mindestens die Hälfte der Punkte draußen) nur für diese Fächer; Profil und Punkte werden aus einer Liste erzeugt – bei
  Änderungen `sachsen.js`/`sachsen-punkte.js` von Hand nachziehen und die Zählung in `tests/lehrplan.js` anpassen.
- Eltern-Einstellungen für Schulunterschiede: `Spielwelt.lade("eltern").mathe` (z. B. `minus: "abziehen" | "ergaenzen"`), Karte in
  `spiele/eltern/eltern.js` (`matheKarte`, `matheKnoepfe`); neue Unterschiede nach diesem Muster.
- Pixel-Grafik: Zeichnung in `quellen/pixel/dinge.js` (Pixelpuffer mit `kugel/zylinder/vieleck/fuelle/rect`, nur Farben aus `PAL`), in
  `quellen/pixel/insel.js` vor `packe()` mit `merke()` in den Atlas, dann `new Sprite(e.tex)`; Dinge auf den Boden mit `stelle(e, x, z)`,
  antippbar mit `antippbar(sprite, x, z, tipp, aktion, nah, id)`.

## 8. Berichten
Kurz und auf Deutsch: welche Pakete fertig sind (mit Screenshots, wenn es etwas zu sehen gibt), was der Auftraggeber auf dem iPad 10
testen soll (Schritt für Schritt, in `/dev`), welche Entscheidungen du getroffen hast, was als Nächstes kommt.
