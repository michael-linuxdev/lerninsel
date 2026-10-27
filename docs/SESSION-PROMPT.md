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
   **„Zwei Looks (Entscheidung 27.10.2026)“** und den neuesten „Stand …“-Eintrag (zuletzt **„Stand 27.10.2026, Mittag“**: Inhalte zuerst,
   NA-03, NA-40). Ältere Abschnitte sind Historie.
2. `docs/KONZEPT.md` (Story „Die Insel erwacht“, Begriffe, Figuren, Kapitelbogen, Tutorial-Etappen E0–E10, Verzahnung, Individualisierung).
3. Je nach Paket: `docs/LEHRPLAN.md`, `docs/SPRACHEN.md` (Prüfstatus von Übersetzungen!), `docs/GRAFIK.md` (Leistungsbudget iPad 10, **Abschnitt 2: Regeln des DS-Pixel-Looks**),
   `docs/MINISPIELE.md`.
4. `README.md` (Aufbau des Repos, Liste der Dateien in `shared/`).

## 2. Stand (27.10.2026, Mittag)
**Früher fertig** (Einzelheiten in PLAN.md unter „Neuausrichtung 26.10.2026“): NA-01 Ereignisse/Story, NA-02 Profil, NA-10 Szenen + Zeigehand,
NA-11 Prolog „Ankunft“ (E1), NA-12 Insel-Zugang, NA-13 Sonnenuhr/„Erst lernen“/Erste Frucht mit Nebel, NA-14 Tutorial E4–E8, NA-15
Weihnachts-Sonderstart, NA-21 Leistungs-Test, NA-24 Welt-Kern `shared/insel-kern.js`, NA-25–28 Pixel-Look (Insel, Umschalter, Figuren, Zimmer),
NA-29 Teil 1 Budget „Rund“ (Insel ≈ 100 Aufrufe).

**Entscheidungen des Auftraggebers (27.10.2026, Mittag):**
- **Grafik: „Rund“ (three.js) + „Pixel flach“ (PixiJS, DS-Stil)**, jederzeit umschaltbar. Die Vorschau Pixel 2,5D (`spiele/welt3d/probe25d.html`)
  wird **nicht** weiterverfolgt (bleibt als Nachschlag liegen, kein dritter Look). **Grafik ist eingefroren** – erst Inhalte.
- **„Bis Weihnachten pushen wir alles auf Main. Kein Kind spielt hier bisher.“** Neue Funktionen sind sofort auf der Hauptseite sichtbar;
  `/dev` bleibt als zweiter Spielstand. Ausnahme bleibt: ungeprüfte Übersetzungen (`entwurf`) erscheinen nur in /dev.
- **„Lieber Inhalte zuerst“** – Reihenfolge jetzt NA-03 → NA-40 → NA-30 → NA-32 → NA-31 (Abschnitt 4).

**In der letzten Sitzung fertig und gepusht** (PLAN.md → „Stand 27.10.2026, Mittag“):
- **Pixel auf der Hauptseite wählbar** (`Spielwelt.lookWaehlbar()` = immer wahr, `tests/look.js` umgestellt).
- **NA-03 Lehrplan-Kern:** `shared/lehrplan/kern.js` (148 Lernziel-IDs `<fach>.<bereich>.<nr>`, Deutsch mit fünf KMK-2022-Bereichen
  `de.sz/sc/le/tm/su`), `shared/lehrplan/laender/sachsen.js` (49 Lernbereiche mit `lz`), `shared/inhalte.js` (Inhalte-Verzeichnis,
  errechnete Abdeckung, `Inhalte.fuer(kind)`), `shared/lehrplan.js` als Kompatibilitäts-Schicht (`window.LEHRPLAN` wie vorher, plus
  `errechnet`/`zaehle`). Bestehende Inhalte haben nur ein Feld `lz` bekommen. Elternkarte zeigt die errechnete Abdeckung zum Vergleich.
  Test `tests/lehrplan.js` (Node; `LUECKEN=1` listet Lernziele ohne Inhalt).
- **NA-40 Wortschatz-Kern und DaZ D0:** `inhalte/woerter/bestand.js` (64 Wörter von „Wort des Tages“ + Silben/Wortfelder) und `d0.js`
  (72 neue Wörter, 20 Sätze, ru/uk als Entwurf), `shared/woerter.js` → `window.Wortschatz` und weiter `window.WOERTER`. Neue Seite
  **„Ankommen“** `spiele/daz/` (Wörter ansehen mit Artikel-Farbe und -Form, „Hören und zeigen“, „Sätze für jeden Tag“), Fortschritt in
  `profil.daten.daz` (`shared/daz.js`), Deutschstand „keine“ leitet von der Deutsch-Seite dorthin um, „wenig“ bekommt einen Knopf.
  Tests `tests/wortschatz.js` (Node) und `tests/daz.js`.

**Bekannte Baustellen:** Grafik eingefroren mit offenen Paketen NA-29b (Handy-Leistung) und NA-29 Teil 2 (Minispiele über dem Budget);
neue 3D-Objekte auf der Insel mit `starr.push([objekt, bewegliche Teile])` anmelden; `SPIELE` steht in `shared/insel-kern.js` und
`quellen/welt3d/gemeinsam.js` (gleich halten); „Meine Welt“ (Welten erschaffen) gibt es nur in „Rund“; der Prolog-Test der runden Insel wackelt,
wenn der Rechner ausgelastet ist – dann nochmal laufen lassen. Bilder im Wortschatz sind Emojis; Ton über die Gerätestimme (Aufnahmen: NA-43).

**Offene Fragen an den Auftraggeber:** iPad-/Handy-Test (Hauptseite): „Ankommen“ mit einem Kind ohne Deutsch, Pixel-Look, Ankunft, Sonnenuhr,
Einführung E4–E8, Elternkarte „Was übt die App?“; Geschenke zu Weihnachten 2026 (NA-16); Muttersprachlerinnen für Russisch/Ukrainisch
(D0-Texte sind Entwürfe), Lehrkräfte; Tonaufnahmen.

## 3. Ablauf dieser Sitzung
1. **Fragerunde zuerst** (höchstens 4 Fragen mit dem Frage-Werkzeug, sonst als kurze Liste), bevor du baust. Kläre mindestens:
   - Rückmeldung vom iPad 10 und Handy (Hauptseite, mit neuem Kind): „Ankommen“ (Deutsch-Kenntnisse „keine“), Pixel-Look (Knopf „👾 Pixel“
     auf der Insel), Ankunft, Sonnenuhr, Einführung E4–E8. Fehler zuerst beheben.
   - Gilt „Inhalte zuerst“ weiter (nächstes Paket laut Abschnitt 4), oder soll Grafik/Story (NA-29b, NA-16/17/18) vorgezogen werden?
   - Welche Geschenke soll es per QR-Code zu Weihnachten 2026 geben (für NA-16)? Gibt es Muttersprachlerinnen zum Gegenlesen (ru, uk)?
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
Grundsatz Inhalte: **Inhalte als Daten** (LEHRPLAN.md „Inhalte als Daten“). Jeder neue Inhalt registriert sich mit `Inhalte.registriere({ id, fach,
lz: [...], stufe, aufgaben, lernkartei })` (oder trägt bei Bestandsdaten ein Feld `lz`) und verweist auf Lernziele aus `shared/lehrplan/kern.js`;
Wörter nur als Verweis auf den Wortschatz-Kern (`w.<wort>`, neue Wörter in `inhalte/woerter/*.js`). Neue Übersetzungen mit Status `entwurf`.
Grundsatz Grafik (eingefroren): **Eine Welt, zwei Darstellungen.** Alles außer Zeichnen kommt aus `shared/insel-kern.js`; neue sichtbare Dinge in
beiden Looks oder im Plan als offen vermerken.
1. **NA-30 Anlaute und Buchstabe–Laut** (M, Deutsch Kl. 1 und Vorschule): `inhalte/deutsch/`, 26 Buchstaben + Umlaute mit Bild (aus dem
   Wortschatz-Kern) und Ton, ohne Lesepflicht (Anlaut hören → Bild/Buchstabe wählen), Lernkartei, Lernziele `de.le.01`, `de.le.02`, `de.su.02`.
2. **NA-32 Mathe Kl. 1 und Vorschule: Mengen** (M): Mengen bis 10/20 mit Material (Würfelbilder, Zwanzigerfeld), eigene Stufe statt der
   Kl.-2-Stationen; Lernziele `ma.zo.01`–`ma.zo.04`, `ma.ms.01/02`.
3. **NA-31 Silben lesen und erste Lesetexte** (M): Silbenbögen, 20 kurze Bildtexte mit Fragen (Kl. 1–2), `de.le.03`–`de.le.05`.
4. Danach laut Plan Punkt 5 ff. (NA-35 Schreiben, Phase E NA-50 „Können je Lernziel“) oder – nach Rückmeldung – Grafik/Story:
   **NA-29b Handy-Leistung** (S), **NA-29 Teil 2** Minispiele ins Budget, **NA-16** QR-Geschenk (wartet auf Geschenk-Auswahl) → **NA-17** Kapitel 1–2
   → **NA-18** Chronik im Album.

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
- Lernziele: `LernzielKern.ziel("de.le.02")`, `LernzielKern.fach("de", "le")`; Länder-Abweichungen in `shared/lehrplan/laender/<land>.js`
  (`stufe`, `extra`, `quelle`). Inhalte: `Inhalte.registriere({...})`, `Inhalte.abdeckung(lz)`, `Inhalte.fuer({ stufe, land })`, `Inhalte.ohneInhalt()`.
  Seiten, die das brauchen, laden `kern.js` → `shared/inhalte.js` → `laender/*.js` → `shared/lehrplan.js` (siehe `spiele/eltern/index.html`).
- Wortschatz: `Wortschatz.wort("w.apfel")` (de, artikel, mehrzahl, silben[], bild, themen, wortart, daz, ru/uk + status), `Wortschatz.feld("essen")`,
  `Wortschatz.daz("d0")`, `Wortschatz.saetze("d0")`, `Wortschatz.hilfe(eintrag)` (Hilfetext nur wenn erlaubt), `Wortschatz.ARTIKEL` (Farbe + Form).
  Einbinden: `inhalte/woerter/*.js` vor `shared/woerter.js`. DaZ-Fortschritt: `DaZ.merke("wort"|"satz", id)`, `DaZ.stand()`, `DaZ.d0Fertig()`.
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
- `sh tests/laufen.sh` = Node-Tests `story-migration`, `inselkern`, `lehrplan`, `wortschatz` + Rauchtest über alle Seiten (quer/hoch). Für /dev: `PFAD=dev/ sh tests/laufen.sh`.
  Neue Seiten in `tests/rauchtest.js` aufnehmen (3D-Seiten in `SEITEN_3D`).
- Einzelne Tests: `sh tests/laufen.sh <name>` mit `ereignisse`, `profil`, `szene`, `prolog`, `zugang`, `tutorial`, `etappen`, `weihnachten`, `pixelinsel`,
  `look` (braucht frisch gebautes /dev), `leistung` (Messtabelle, `STRENG=1` = Budget erzwingen), `probe` (Grafik-Proben, NUR=pixel|rund|pixel25d), `daz` (Ankommen/DaZ D0), `handy` (Rechenaufwand auf kleinen Smartphones, `DROSSEL=4`); mehrere Läufe gleichzeitig mit `PORT=<nummer>`;
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
