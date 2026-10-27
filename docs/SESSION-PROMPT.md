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
   **„Zwei Looks (Entscheidung 27.10.2026)“** und den neuesten „Stand …“-Eintrag (zuletzt **„Stand 27.10.2026, Abend (Sitzung 27.10., 19:30: größte Sachsen-Lücken geschlossen)“**; davor „19:10: Sachsen-Profil geprüft und korrigiert“; davor „18:30: Englisch-Einstieg“; davor „18:15: NA-39 Übergang Klasse 5“; „17:50: Schritt B … und
   Schritt C …“: Mathe-Rest, Urkunde, Sachunterricht-Rest; „17:30: … Schritt A“: Schritt-Typen `ordnen`/`verbessern`, 6 Schreib-Kapitel). Ältere Abschnitte sind Historie.
2. `docs/KONZEPT.md` (Story „Die Insel erwacht“, Begriffe, Figuren, Kapitelbogen, Tutorial-Etappen E0–E10, Verzahnung, Individualisierung).
3. Je nach Paket: `docs/LEHRPLAN.md`, `docs/SPRACHEN.md` (Prüfstatus von Übersetzungen!), `docs/GRAFIK.md` (Leistungsbudget iPad 10, **Abschnitt 2: Regeln des DS-Pixel-Looks**),
   `docs/MINISPIELE.md`.
4. `README.md` (Aufbau des Repos, Liste der Dateien in `shared/`).
5. Für Inhalts-Pakete die Datendateien selbst überfliegen, bevor du Neues schreibst (Stil, Länge, Schritt-Typen): `spiele/mathe/aufgaben.js`
   (Abschnitte Klasse 3 und 4), `spiele/deutsch/werkstatt.js` (Kapitel ab `w-praeteritum`), `spiele/sachkunde/themen.js` (ab `sinne`),
   `shared/lehrplan/kern.js` (Lernziel-IDs) und `shared/lehrplan/laender/sachsen.js` (Zuordnung `app`, `abdeckung`, `hinweis`).

## 2. Stand (27.10.2026, nach Schritt A, B, C, NA-39 Übergang 5 und Englisch)
**Früher fertig** (Einzelheiten in PLAN.md unter „Neuausrichtung 26.10.2026“): NA-01 Ereignisse/Story, NA-02 Profil, NA-10 Szenen + Zeigehand,
NA-11 Prolog „Ankunft“ (E1), NA-12 Insel-Zugang, NA-13 Sonnenuhr/„Erst lernen“/Erste Frucht mit Nebel, NA-14 Tutorial E4–E8, NA-15
Weihnachts-Sonderstart, NA-21 Leistungs-Test, NA-24 Welt-Kern `shared/insel-kern.js`, NA-25–28 Pixel-Look (Insel, Umschalter, Figuren, Zimmer),
NA-29 Teil 1 Budget „Rund“ (Insel ≈ 100 Aufrufe), NA-03 Lehrplan-Kern, NA-40 Wortschatz-Kern und DaZ D0 („Ankommen“), NA-30/31/35 „Lesen und
Schreiben“ (Laute, Silben, 20 Lesetexte, Nachspuren, Wörter legen), NA-50 Können je Lernziel, NA-32 Matheweg Klasse 1/Vorschule.

### Entscheidungen des Auftraggebers (gelten weiter)
- **Grafik: „Rund“ (three.js) + „Pixel flach“ (PixiJS, DS-Stil)**, jederzeit umschaltbar, auch auf der Hauptseite. Pixel 2,5D wird nicht
  weiterverfolgt. **Grafik ist eingefroren** – und wurde in der letzten Sitzung ausdrücklich **nicht** angefasst („Grafik/3D tabu“). Vor jeder
  Grafik-Arbeit nachfragen.
- **„Bis Weihnachten pushen wir alles auf Main. Kein Kind spielt hier bisher.“** `/dev` bleibt zweiter Spielstand. Russische Entwürfe auch auf
  der Hauptseite (`Spielwelt.ENTWURF_FREI`), andere Sprachen erst später bzw. nur in /dev.
- **„Lieber Inhalte zuerst“** – Inhalte (Phase D/G) vor Grafik und Story.
- **„Die App soll für alle Grundschulkinder in Deutschland gleichermaßen funktionieren“** (27.10., zur Subtraktion). Folge: Wo Schulen oder
  Länder unterschiedlich vorgehen (Rechenverfahren, Schrift, Silbenfarben, Lehrplan-Reihenfolge), **nicht raten, sondern eine Eltern-Einstellung
  mit sinnvollem Standard anbieten** (Muster: Karte „🧮 Mathe wie in der Schule“, `eltern.mathe.minus`). Inhalte nach KMK-Bildungsstandards
  formulieren; Sachsen ist nur das erste ausgearbeitete Länderprofil.
- **„Weiter in größeren Schritten“** (27.10., 17:15): mehrere Pakete pro Schritt bündeln, dann einmal gesamt testen und pushen.

### Was in der letzten Sitzung (27.10., ab 17:30) fertig und gepusht wurde – Schritte A, B, C, NA-39, Englisch, Sachsen-Prüfung
**Sachsen-Profil geprüft (19:10):** Deutsch auf **Lehrplan 2025** umgestellt (5 Lernbereiche je Stufe), Mathe Kl. 4 „Zahl und Operation“ auf „teil“
(mehrstellige Multiplikation, Teilbarkeit 4/6, Adam Ries fehlen), Englisch (Lehrplan 2019, ab Kl. 3) neu im Profil, Sachunterricht korrigiert.
Danach (19:30) Lücken geschlossen: Mathe Kl. 4 „Schriftlich mal mehrstellig“ (15. Station, am Ende angehängt) und Teilbarkeit 4/6/9/100; Englisch
„At home“, „Around the year“ (13 Lektionen); Sachthemen „Herz und Lunge“, „Ich werde größer“, „Stark sein – Nein sagen“, „Unser Bundesland Sachsen“
(nur mit Bundesland Sachsen, neues Themen-Feld `land`; 32 Themen). **Sachsen jetzt 20 × ja, 25 × teil, 0 × nein** plus Englisch 2/14/4.
**Englisch-Einstieg:** neue Seite `spiele/englisch/` „Englisch mit Papagei Paula“ mit 11 Lektionen (`spiele/englisch/lektionen.js`, Kl. 3: 6, Kl. 4: 4, Übergang 5: 1);
Wortkarten, Hören (englische Gerätestimme; ohne Stimme Lesen), Lesen, Übersetzen, Satzbau, Wahl. Tür auf der Startseite (Raster 12 Spalten), Lernfach im
Zeitsystem, Fähigkeit „Englisch-Ohr“, Kern-Fach `en` (7 Ziele), Eltern-Karte „Englisch wie in der Schule“ (Beginn ab Kl. 1 oder 3). Test `tests/englisch.js`.
**NA-39 Übergang Klasse 5:** fünfter Matheweg „🎒 Übergang 5“ (`Mathe.STATIONEN_K5`, `mathe.k5`, 10 Stationen: Fit aus Kl. 4, Brüche ×3, Kommazahlen bei
Größen, Klammer/Punkt vor Strich, Koordinaten, Winkel, Durchschnitt, Sachaufgaben in Schritten; Urkunde „Fit für Klasse 5!“, Kl.-4-Urkunde führt dorthin);
Werkstatt „Fachbegriffe für Klasse 5“ und „Lesestrategien“ (`stufe: 5`, jetzt 30 Kapitel); Eule Ella „Lernen lernen“ und „Neue Schule“ (Themen
können jetzt `stufe` haben, jetzt 28 Themen); 7 neue Kern-Lernziele der Stufe 5 (Kern: 155); Elternhinweis ehrlich angepasst; neuer Test `tests/uebergang5.js`.
Grundsatz: keine Bewertung der Schulform, keine Noten.
**Schritt B – Mathe-Rest:**
- Weg „3. Klasse“ jetzt **20 Stationen** (neu: Würfelgebäude mit isometrischem Bild/Bauplan, „Sicher, möglich, unmöglich“ am Glücksrad).
- Weg „4. Klasse“ jetzt **14 Stationen** (später 15 mit „Schriftlich mal mehrstellig“) (neu: römische Zahlen, Primzahlen, Maßstab, Zeit und Datum, mehrere Zahlen addieren) und am Ende eine
  **Urkunde** statt „Mehr kommt bald“.
- Fehler behoben: g/kg und m/km ließen nur 3 Ziffern zu; Mathe-Tafel schnitt im Hochformat die Frage ab; Titel/Punkte überlappten auf Handys.
- Neuer Node-Test `tests/mathe-generatoren.js` (läuft in `sh tests/laufen.sh`). Keine Eltern-Einstellung Malkreuz (siehe PLAN).
**Schritt C – Sachunterricht-Rest:** 5 neue Themen (jetzt **26**): Wärme und Dämmung, Tiere am und im Wasser, Ein Experiment planen, Erste Hilfe,
Informationen finden. `tests/sachkunde.js` klickt sie echt durch. Sachsen damals 18 × ja, 30 × teil, 1 × nein (nach der Prüfung um 19:10: 15/29/1 bei 45 Bereichen).
**Schritt A – Deutsch schreiben:**
- Fragerunde: noch kein iPad-Test; nur Schritt A; Grafik/3D/Story weiter tabu; Kl.-3/4-Inhalte bleiben **ab der Klasse davor sichtbar** (entschieden).
- **Neue Werkstatt-Schritt-Typen** in `spiele/deutsch/abenteuer.js`: **`ordnen`** (Karten der Reihe nach antippen, nummerierte Plätze, falsche Karten
  gehen zurück) und **`verbessern`** (störendes Wort im Satz antippen, dann bessere Variante wählen). Lange Aufgaben beginnen oben (Klasse `.aufgabe.lang`).
- **6 neue Kapitel** (Werkstatt jetzt **28**; Kl. 1: 5, Kl. 2: 22, ab Kl. 3: 28): Geschichte ordnen, Abwechslungsreiche Satzanfänge, Brief schreiben
  (mit Einladung), Wörterbuch (alle Kl. 3); Bericht mit W-Fragen, Vortrag vorbereiten (Kl. 4). Lernziele `de.sc.07`, `de.sc.09`, `de.sz.07`, `de.sz.05`.
- **Sachsen:** 5 Lernbereiche nein → teil; jetzt **14 × ja, 31 × teil, 4 × nein**. Tests `deutsch34` (echtes Antippen) und `lehrplan` nachgezogen.

### Was davor (27.10., Nachmittag/Abend) fertig und gepusht wurde
Einzelheiten in PLAN.md, Einträge „Stand 27.10.2026, Abend (NA-33 … Schritt b)“, „… Spätnachmittag“, „… Abend (NA-34 Teil 4)“,
„… später Abend (NA-36 …)“, „… Nacht (NA-36 Teil 2)“, „… Nacht – großer Schritt“.
- **Mathe** (`spiele/mathe/aufgaben.js`, `spiele/mathe/mathe.js`):
  - Weg **„3. Klasse“ jetzt 18 Stationen** (`Mathe.STATIONEN_K3`): neu schriftlich plus und minus mit Stellenwerttafel-Bild, Würfelnetze (eingebaute
    Faltprüfung `Mathe._k3.istWuerfelnetz` erkennt genau die 11 Netze), Spiegeln, Diagramme (Säule aus Strichliste, ablesen, vergleichen), Flächen vergleichen.
  - **Neuer Weg „4. Klasse“ (NA-37, 9 Stationen, `Mathe.STATIONEN_K4`, Fortschritt `mathe.k4`)**: Zahlen bis 1 Million, Runden/Überschlagen,
    schriftlich mal (einstellig), schriftlich geteilt (einstellig, mit Probe), Teilbarkeit (2/3/5/10), geschickt rechnen, Liter/Milliliter,
    Flächeninhalt/Umfang, Gewinnchancen. Kinder in Kl. 4/5 starten dort; Zielknoten Kl. 1 → 2 → 3 → 4; Kl. 4 endet mit „Mehr kommt bald“.
  - Aufgabenfeld **`max`** = erlaubte Ziffern (Standard 3, große Zahlen bis 7), wird auch in der Lernkartei gespeichert.
  - **Eltern-Einstellung Subtraktionsverfahren**: „Abziehen mit Entbündeln“ (Standard) oder „Ergänzen“ – die Hilfe in „Schriftlich minus“ erklärt
    im gewählten Verfahren.
  - Elternbericht listet Kl.-3/4-Stationen, wenn das Kind dort übt oder in der Klasse ist.
  - Fehlerbehebung: Nach richtiger Antwort blättert der Zeitgeber nur weiter, wenn noch dieselbe Runde läuft.
- **Deutsch – Fipsis Wörter-Werkstatt** (`spiele/deutsch/werkstatt.js`): **22 Kapitel** (5 alte + 17 neue für Kl. 3–4). Neues Kapitelfeld **`stufe`**
  (Klasse); sichtbar ab der Klasse davor (Kl. 1: 5, Kl. 2: 18, ab Kl. 3: 22). Neu: Präteritum, Perfekt/Futur, Subjekt/Prädikat, Satzzeichen/Satzarten,
  ck/tz/ss/ß, Ableiten ä/äu, Dehnungs-h, wörtliche Rede, Märchen/Fabel/Gedicht/Sachtext, zwei Lesetexte mit Fragen (Igel; Biber und Otter
  vergleichen), Steigerung, Personalpronomen, Komma bei Aufzählungen, Vor-/Nachsilben, Wer/Wen/Wem, Meinung mit „weil“. Nur vorhandene
  Schritt-Typen (`sag`, `luecke`, `satz`). Zeitgeber im Abenteuer ebenfalls abgesichert. Seite bricht lange Wörter im Hochformat um.
- **Sachunterricht – Eule Ella** (`spiele/sachkunde/themen.js`): **21 Themen** (10 alte + 11 neue für Kl. 3–4): Meine fünf Sinne, Wald und Wiese,
  Himmelsrichtungen, Schwimmen und Sinken, Feuer und Brandschutz (112), Mein Fahrrad, Kinderrechte und Geld (Nummer gegen Kummer 116 111),
  Unsere Gemeinde, Vom Korn zum Brot, Die Wetterkarte, Strom. Seite bricht lange Wörter um.
- **Lehrplan Sachsen** (`shared/lehrplan/laender/sachsen.js`, Einschätzung von Hand mit `app`/`hinweis`): damals 14 × ja, 26 × teil, 9 × nein
  (Kl. 2–4, Mathe/Deutsch/SU; nach Schritt A 14/31/4; aktuell siehe oben).
- **Tests neu/erweitert:** `tests/sachkunde.js` (11 neue Themen, quer + hoch), `tests/deutsch34.js` (Sichtbarkeit je Klasse, 17 Kapitel, richtige
  Lücken, quer + hoch), `tests/mathe1.js` (Kl. 3 mit 18, Kl. 4 mit 9 Stationen, Eintippen großer Zahlen, Ergänzen-Hilfe), `tests/lehrplan.js` (Zählung 14/26/9).
  Test-Haken neu: `__sachkunde.schritt(n)`, `__deutsch.schritt(n)`.

### Bekannte Baustellen
- Grafik eingefroren mit offenen Paketen NA-29b (Handy-Leistung) und NA-29 Teil 2 (Minispiele über dem Budget); „Meine Welt“ nur in „Rund“;
  `SPIELE` steht in `shared/insel-kern.js` und `quellen/welt3d/gemeinsam.js` (gleich halten); Prolog-Test der runden Insel wackelt bei Last.
- Die neuen Inhalte haben **nur russische Entwürfe**; Ukrainisch u. a. fehlen. Bilder sind meist Emojis; Ton über die Gerätestimme (NA-43 Aufnahmen offen).
- Die Werkstatt kann jetzt ordnen und überarbeiten, aber **kein freies Schreiben** (eigene Eingabe per Tastatur/Hand) – `de.sc.07`, `de.sc.09`,
  `de.sz.07` sind deshalb nur „teil“; E-Mail, Streit schlichten, Medienabsichten fehlen.
- Länderprofile außer Sachsen fehlen (NA-47); `su.ge.04`/`su.hi.04` (Bundesland, Heimatort) brauchen Länderdaten – das ist das letzte „nein“ in Sachsen.
- `tests/sachkunde.js` klickt nur die fünf neuesten Themen echt durch, die 11 von NA-34 nur per Test-Haken; `tests/deutsch34.js` klickt `ordnen`/`verbessern`
  echt, Lücken per DOM-Klick.
- Mathe offen: Schrägbilder, Vierecke, Volumen, Klammerregel (Kl. 4); Schiebe-/Drehsymmetrie, Zeichnen (Kl. 3).

### Offene Fragen an den Auftraggeber
- **iPad-/Handy-Test** (Hauptseite und /dev, mit neuem Kind je Klasse): „Ankommen“, „Lesen und Schreiben“ (Nachspuren), Lesetexte, Matheweg Kl. 1,
  Pixel-Look, Einführung E4–E8 – **und neu**: Matheweg Kl. 3 (Stationen 13–18) und Kl. 4 (große Zahlen tippen, Kästchen- und Kugelbilder),
  die 23 neuen Werkstatt-Kapitel (Kl. 3), **bes. „Ordnen“ und „Verbessern“ im Hochformat (Brief, Satzanfänge, Wörterbuch)**, die 16 neuen Sachthemen
  (bes. Zuordnen mit drei Gruppen im Hochformat), Eltern-Karte „Mathe wie in der Schule“, **Mathe Kl. 3 Stationen 19–20 (Würfelgebäude, Glücksrad),
  Kl. 4 Stationen 10–14 und die Urkunde, Bildaufgaben im Hochformat (Frage jetzt sichtbar?), „9 kg = 9000 g“ eintippen, Kind mit Stufe „Übergang 5“:
  Matheweg „Übergang 5“ (Brüche, Koordinaten, Winkel), „Fachbegriffe“, „Lesestrategien“, „Lernen lernen“, „Neue Schule“; Englisch: spricht das iPad die
  englischen Wörter (britische Stimme)? Startseite quer und hoch mit der neuen Tür**.
- Geschenke zu Weihnachten 2026 (NA-16); Muttersprachlerinnen für ru/uk; Lehrkräfte; Tonaufnahmen; Silbenfarben der Schule.
- Soll **Ergänzen** zusätzlich als „Ergänzen mit Erweitern“ vs. „mit Entbündeln“ unterschieden werden, oder ein drittes Verfahren (Abziehen mit Erweitern)?

## 3. Ablauf dieser Sitzung
1. **Fragerunde zuerst** (höchstens 4 Fragen mit dem Frage-Werkzeug, sonst als kurze Liste), bevor du baust. Kläre mindestens:
   - Rückmeldung vom iPad 10 und Handy (siehe „Offene Fragen“). **Gemeldete Fehler zuerst beheben**, jeweils mit Test.
   - Welche Pakete aus Abschnitt 4 (Reihenfolge-Vorschlag oder andere)? Gilt „Inhalte zuerst“ weiter, oder Grafik/Story vorziehen?
   - Weihnachtsgeschenke (NA-16), Muttersprachlerinnen.
   - Was darf in dieser Sitzung keinesfalls angefasst werden? (Letzte Sitzung: Grafik/3D.)
2. **Dann selbstständig in größeren Schritten arbeiten**, bis die Sitzung aufgebraucht ist (Wunsch des Auftraggebers). Ein Schritt = 2–4 zusammenpassende
   Pakete oder ein M-Paket mit Inhalten. Aufgabenliste anlegen (ein Eintrag je Paket), abhaken. Nur nachfragen, wenn eine Entscheidung nicht
   rückgängig zu machen ist; sonst die vernünftigste Wahl treffen und im Plan notieren. Unterschiede zwischen Schulen/Ländern → Eltern-Einstellung.
3. **Nach jedem Schritt:** `sh quellen/dev-bauen.sh`, `sh tests/laufen.sh` (gesamt) plus die betroffenen Einzeltests (parallel mit `PORT=…`),
   dann committen und pushen. Kein Push mit rotem Test. Höchstens ein großes Paket gleichzeitig offen.
4. **Am Ende:** in `docs/PLAN.md` einen Eintrag „Stand <Datum>“ ergänzen (erledigt, Abweichungen, offen, nächstes Paket), in der Reihenfolge
   erledigte Pakete durchstreichen, **diese Datei auf den neuen Stand bringen** (Abschnitte 1.1-Verweis, 2, 4, Kurzreferenz in 5), pushen,
   kurz berichten (Abschnitt 9).

## 4. Nächste Pakete (Vorschlag, Reihenfolge nach Rückmeldung anpassen)
Grundsatz Inhalte: **Inhalte als Daten** (LEHRPLAN.md „Inhalte als Daten“). Jeder neue Inhalt trägt `lz: [...]` mit Lernzielen aus
`shared/lehrplan/kern.js` (Bestandsdaten Mathe/Werkstatt/Themen werden in `shared/inhalte.js` automatisch registriert) und – wo sinnvoll – `stufe`.
Wörter über den Wortschatz-Kern (`w.<wort>`). Neue Übersetzungen als Entwurf. Neue Dateien in `sw.js`, `spiele/eltern/index.html` (Abdeckung) und
`tests/lehrplan.js` (`DATEN`) eintragen. Lerninhalte nur zusammenfassen und eigene Texte schreiben (keine Lehrbuch-/Lehrplantexte abschreiben;
alte Fabeln/Märchen nur nacherzählen). Nach jeder Änderung an `sachsen.js` die Zählung in `tests/lehrplan.js` anpassen.
Grundsatz Grafik (eingefroren): **Eine Welt, zwei Darstellungen.**

~~**Schritt A – Deutsch schreiben**~~ (erledigt 27.10. abends, siehe Abschnitt 2). Möglicher Nachfolger (A2, nur nach Rückfrage): freies Schreiben
mit eigener Eingabe (Bildergeschichte schreiben, Elternansicht zum Vorlesen/Ansehen – nichts verlässt das Gerät), weitere `verbessern`-Kapitel
(Rechtschreibfehler im eigenen Text finden), E-Mail.

~~**Schritt B – Mathe-Rest**~~ und ~~**Schritt C – Sachunterricht-Rest**~~ (erledigt 27.10. abends, siehe Abschnitt 2). Mögliche Nachfolger (nur nach
Rückfrage): Mathe Kl. 4 Schrägbilder/Vierecke/Volumen/Klammerregel, Kl. 3 Schiebe-/Drehsymmetrie; SU Ernährung/Pubertät; Ukrainisch-Entwürfe.

**Schritt D – Länder und Übergreifendes (M):** NA-47 Länderprofile (zuerst die Struktur für ein zweites Land, z. B. NRW oder Berlin/Brandenburg –
nur Lernbereiche und Zuordnung zu `lz`, keine Lehrplantexte), Elternbereich „Was übt die App?“ je Land. (~~NA-39 Übergang Kl. 5~~ erledigt 27.10.)

~~**Schritt E – Englisch-Einstieg**~~ (erledigt 27.10.). **Englisch Teil 2 (M, nach Rückfrage):** Lernkartei für Englisch, Wochentage/Monate/Uhrzeit,
kurze Dialoge, Englisch im Länderprofil Sachsen, Tonaufnahmen statt Gerätestimme (NA-43).

**Grafik/Story (nur nach ausdrücklicher Freigabe):** NA-29b Handy-Leistung (S), NA-29 Teil 2 Minispiele ins Budget, NA-16 QR-Geschenk
(wartet auf Geschenk-Auswahl) → NA-17 Kapitel 1–2 → NA-18 Chronik im Album.

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
- Sachsen-Profil: Mathe und Deutsch **Fassung 2025**, Sachunterricht und Englisch Fassung 2019; Fächer `mathe`, `deutsch`, `sachkunde`, `englisch`;
  nach jeder Änderung die Zählung in `tests/lehrplan.js` anpassen (Mathe/Deutsch/SU und Englisch getrennt).
- Lernziele: `LernzielKern.ziel("de.le.02")`, `LernzielKern.fach("de", "le")`; Länder-Abweichungen in `shared/lehrplan/laender/<land>.js`
  (`stufe`, `extra`, `quelle`). Inhalte: `Inhalte.registriere({...})`, `Inhalte.abdeckung(lz)`, `Inhalte.fuer({ stufe, land })`, `Inhalte.ohneInhalt()`.
  Seiten, die das brauchen, laden `kern.js` → `shared/inhalte.js` → `laender/*.js` → `shared/lehrplan.js` (siehe `spiele/eltern/index.html`).
- Wortschatz: `Wortschatz.wort("w.apfel")` (de, artikel, mehrzahl, silben[], bild, themen, wortart, daz, ru/uk + status), `Wortschatz.feld("essen")`,
  `Wortschatz.daz("d0")`, `Wortschatz.saetze("d0")`, `Wortschatz.hilfe(eintrag)` (Hilfetext nur wenn erlaubt), `Wortschatz.ARTIKEL` (Farbe + Form).
  Einbinden: `inhalte/woerter/*.js` vor `shared/woerter.js`. DaZ-Fortschritt: `DaZ.merke("wort"|"satz", id)`, `DaZ.stand()`, `DaZ.d0Fertig()`.
- Eltern-Einstellung Mathe: `eltern.mathe.minus` = `abziehen` | `ergaenzen` (Hilfe „Schriftlich minus“).
- Können: `Koennen.melde(lz, richtig)` (nur erster Versuch), `Koennen.standVon(lz)`, `Koennen.standListe(lz[])`, `Koennen.naechste(stationen, n)`,
  `Koennen.brauchtLeichter(lz)`; Seiten laden `shared/koennen.js`.
- Lesen/Schreiben: `window.ANLAUTE` (Anlaut-Tabelle), `window.LESETEXTE` (Texte in Sprechsilben „Ba-na-ne“), `window.SCHRIFT` (Strich-Daten),
  Lernkartei-Fach `lesen` (Schritte `anlaut`, `silbenwort`, `schreibwort`);
  Matheweg: `Mathe.STATIONEN` (Kl. 2, `mathe.k2`), `Mathe.STATIONEN_K1` (Kl. 1/Vorschule, `mathe.k1`), `Mathe.STATIONEN_K3` (Kl. 3, 20 Stationen, `mathe.k3`), `Mathe.STATIONEN_K4` (Kl. 4, 15 Stationen – **neue Stationen immer ans Ende hängen**, sonst sperrt das Freischalten vorhandene, `mathe.k4`, Ende mit Urkunde), `Mathe.STATIONEN_K5` (Übergang 5, 10 Stationen, `mathe.k5`, Urkunde über `zeigeUrkunde(weg)`; Aufgabenfeld `max` = erlaubte Ziffern – **jede Antwort mit mehr als 3 Ziffern braucht `max`**, das prüft `tests/mathe-generatoren.js`; `Mathe._k3.istWuerfelnetz(zellen)`, `roemisch(n)`, `istPrim(n)`, `wuerfelGebaeude()`), Weg-Wahl in `mathe.weg`.
- Mathe-Generatoren (`spiele/mathe/aufgaben.js`): Station `{ id, stufe, lz, name, icon, neu: () => Aufgabe }`; Aufgabe über `zahl(text, antwort, hilfe,
  { frage, bild, einheit, nurLuecke, max })` oder `{ art: "wahl", optionen, antwort, frage, bild, hilfe }`. Bilder sind SVG-Strings
  (`stellenBild`, `schriftBild`, `schriftBildViele`, `netzBild`, `spiegelBild`, `saeulenBild`, `kaestchenBild`, `kugelBild`, `gebaeudeBild`, `radBild`, `karteBild`). Neuer Weg: `WEGE` in `mathe.js`,
  `daten()`, Umschalter, Zielknoten, `shared/inhalte.js` (concat), Elternbericht.
- Werkstatt-Kapitel (`spiele/deutsch/werkstatt.js`): `{ id: "w-…", stufe, lz, name, ort, farbe, grund, schritte: [...] }`; Schritt-Typen `sag`,
  `luecke` (`satz` mit `___`, erste Option richtig), `satz` (Wörter in Reihenfolge), `wortart`, `verlaengern`, `silben`, `artikel`, `bild`, `wort`, `wo`,
  `ordnen` (`{ frage?, teile: [richtige Reihenfolge], e?, ru }`, Teile ≤ 16 Zeichen liegen nebeneinander) und `verbessern`
  (`{ frage?, satz, falsch, stelle?, optionen: [besser, …], tipp?, e?, ru }`, `stelle` = Wortnummer bei Mehrfachvorkommen).
  Renderer in `spiele/deutsch/abenteuer.js` (`schritt()`/`switch`), Antwort über `antwort(knopf, richtig, beiRichtig)`.
- Englisch (`spiele/englisch/lektionen.js`): `{ id, stufe, lz, name, e, farbe, grund, intro: { de, ru }, woerter: [{ en, de, ru, e }], extra: [satz|wahl], ende }`;
  Schritte entstehen in `englisch.js` (`baue(k)`) aus den Wörtern; jedes Wort braucht ein eigenes Emoji. Test-Haken `__englisch` (starte, schritt, lauf, sichtbar).
  Eltern-Einstellung `eltern.englisch.ab` = `"3"` | `"1"`.
- Sachthemen (`spiele/sachkunde/themen.js`): `{ id, stufe?, land?, lz, name, e, farbe, grund, kurz, schritte }` (`stufe` wie in der Werkstatt: sichtbar ab der Klasse davor; `land: "sn"` = nur für Kinder aus Sachsen; benannte SVG-Bilder wie `sachsen` in `bilder.js`); Typen `info` (mit `fakten`), `wahl` (`ok`, `warum`),
  `daumen` (`ok`), `zuordnen` (2–3 Gruppen, je 2–3 Dinge), `baum`. Jede Zeile mit russischem Entwurf (`ru`, `satzRu`, `warumRu`).
- Eltern-Einstellungen für Schulunterschiede: `Spielwelt.lade("eltern").mathe` (z. B. `minus: "abziehen" | "ergaenzen"`), Karte in
  `spiele/eltern/eltern.js` (`matheKarte`, `matheKnoepfe`); neue Unterschiede nach diesem Muster.
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
- `sh tests/laufen.sh` = Node-Tests `story-migration`, `inselkern`, `lehrplan`, `wortschatz`, `koennen`, `mathe-generatoren` + Rauchtest über alle Seiten (quer/hoch). Für /dev: `PFAD=dev/ sh tests/laufen.sh`.
  Neue Seiten in `tests/rauchtest.js` aufnehmen (3D-Seiten in `SEITEN_3D`).
- Einzelne Tests: `sh tests/laufen.sh <name>` mit `ereignisse`, `profil`, `szene`, `prolog`, `zugang`, `tutorial`, `etappen`, `weihnachten`, `pixelinsel`,
  `look` (braucht frisch gebautes /dev), `leistung` (Messtabelle, `STRENG=1` = Budget erzwingen), `probe` (Grafik-Proben, NUR=pixel|rund|pixel25d), `daz` (Ankommen/DaZ D0), `lesen` (Laute, Silben, Lesetexte, Nachspuren, Wörter legen), `mathe1` (Matheweg Kl. 1, 3 und 4, Urkunde, Eltern-Wahl Subtraktion), `sachkunde` (Themen Kl. 3–4, die fünf neuesten echt durchgeklickt), `deutsch34` (Werkstatt Kl. 3–4 inkl. echtem Antippen von `ordnen`/`verbessern`), `uebergang5` (Übergang Kl. 5: Matheweg, Urkunden, Deutsch und Sachthemen echt durchgeklickt), `englisch` (Englisch: Tür, Sichtbarkeit, alle Lektionen echt durchgeklickt), `koennen-anzeige` (Mein Können, Empfehlung), `handy` (Rechenaufwand auf kleinen Smartphones, `DROSSEL=4`); mehrere Läufe gleichzeitig mit `PORT=<nummer>`;
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
  `__bau`, `__duell`, `__ich`, `__mathe` (… zeigeUrkunde), `__sachkunde` (starte, schritt), `__englisch` (starte, schritt, sichtbar), `__deutsch` (starte, schritt); geplant: `__tutorial`. Jeder neue Baustein bekommt einen Test-Haken.
- Jede geänderte Seite einmal öffnen, Konsole auf Fehler prüfen, Screenshots ansehen (Quer- und Hochformat; mit Hilfesprache Russisch, in /dev).
- Externe Seiten (Open-Meteo, Google Fonts) sind aus der Sandbox meist nicht erreichbar – Fehlermeldungen dazu ignorieren, mit Cache-Daten testen.

## 9. Berichten
Kurz und auf Deutsch: welche Pakete fertig sind (mit Screenshots, wenn es etwas zu sehen gibt), was der Auftraggeber auf dem iPad 10
testen soll (Schritt für Schritt, in `/dev`), welche Entscheidungen du getroffen hast, was als Nächstes kommt.
