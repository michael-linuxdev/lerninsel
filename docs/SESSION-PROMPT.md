# Prompt für die nächste Arbeitssitzung (Lerninsel)

Diesen Text als erste Nachricht in eine neue Sitzung kopieren – **in Claude Code oder in einer Claude-Sitzung mit Shell und Git, auch in einem
anderen Konto**. Voraussetzung: Lese- und Schreibzugriff auf das GitHub-Repo `michael-linuxdev/lerninsel` (GitHub in den Claude-Einstellungen
unter „Connectors“ verbinden; ohne Schreibzugriff kann die Sitzung nicht pushen).

---

Du arbeitest an der **Lerninsel** (Offline-Lern-App für Grundschulkinder, Repo `michael-linuxdev/lerninsel`, Branch `main`). Antworte auf **Deutsch**.

**Zuerst:** Falls das Repo noch nicht da ist, `git clone https://github.com/michael-linuxdev/lerninsel` (bzw. das Repo der Sitzung hinzufügen).
Dann **`CLAUDE.md` im Repo-Stamm vollständig lesen und befolgen**. Dort stehen Einrichtung, Arbeitsweise, Regeln, Bauen, Testen und die
Kurzreferenz der Datenformate (in Claude Code ist sie schon geladen). Danach in `docs/PLAN.md` die letzten „Stand 30.10.2026“-Einträge und die
beiden „Fragerunde 30.10.2026“-Abschnitte lesen. Diese Nachricht enthält nur, was sich seit der letzten Sitzung geändert hat.

**Ablauf:** Einrichten und `sh tests/laufen.sh` (muss grün sein) → **Fragerunde** (höchstens 4 Fragen; iPad-Rückmeldung zuerst, gemeldete Fehler
zuerst beheben, je mit Test) → selbstständig in größeren Schritten bauen, testen, pushen → am Ende `docs/PLAN.md` („Stand …“) und diese Datei aktualisieren.

## 0. Auftrag für die nächste Sitzung
**Seit 10.11.2026 außerdem:** Eilande in der Inselchronik, Koordinaten-Karte (Stufe d) für den Übergang 5, Teich in kleinen Welten (Abschnitt 1). **Weg 3 ist gebaut (09.11.2026):** Heimatinsel mit Radius 19 (W1) und Kapitel 7 „Neue Ufer“ mit Robos Boot, Ellas Forscherlager und der Seite `spiele/expedition/` (W2); Details in `docs/PLAN.md`,
„Stand 09.11.2026“. Zuerst die **iPad-Rückmeldung** holen (Fragerunde: größere Insel – Laufwege, Tempo, Trittsteine, Steg bis zum Boot; Kapitel 7 – Szene, „Losfahren“, Forscherlager, Karte lesen, Tagebuch;
dazu alles vom 07./08.11.), dann:
1. Rückmeldung einarbeiten (Fehler zuerst, je mit Test).
2. Russisch der neuen Texte (Szene `neue-ufer`, Expedition) prüfen lassen; Eilande in der Inselchronik; Übergang Klasse 5 im Forscherlager vertiefen (KONZEPT: „neue Themen“) – nur wenn der Auftraggeber es will.
3. Sonst nach `docs/PLAN.md` „Neuausrichtung“ / Abschnitt 2 unten.

## 1. Stand (10.11.2026)
**Neu (PLAN „Stand 10.11.2026“):** Erforschte Eilande stehen in der **Inselchronik** (Album); Forscherlager mit **Koordinatensystem für den Übergang Klasse 5**; Teich-Wunsch klappt auch in kleinen Welten;
behoben: Tagebuch-Liste zeigte falsche Baumzahlen anderer Eilande, Robo stand in manchen großen Welten im Teich.
**Im iPad testen (in /dev/test):**
1. Kind mit Stufe „Übergang Klasse 5“: Insel → Forscherlager → „Karte lesen“ – Achsen 0–6 lesbar (quer und hoch)? Roter Ring gut zu sehen? Eine Frage absichtlich falsch (Hinweis x vor y).
2. Forscher-Tagebuch auf zwei Eilanden eintragen, dann Album → „📜 Inselchronik“: stehen die Eilande mit Wetter und Funden zwischen den Geschichten?
3. Neue kleine Welt mit Wunsch „Teich“ erschaffen – ist der Teich da?

## 1. Stand (09.11.2026)
**Weg 3 (09.11., PLAN „Stand 09.11.2026“):** Heimatinsel Radius 15,2 → 19 (Orte 1,25-mal weiter auseinander, 14 Bäume, zwei Blumenwiesen, Trittstein-Wege zu Garten, Bäckerei, Tierstation, Leuchtturm und Lager,
Lauftempo +10 %, Leistung im Budget). Kapitel 7 „Neue Ufer“ (50 Lernfunde + Tablet-Führerschein): Robos Boot am Steg ist antippbar, der Steg begehbar; ab Kapitel 7 „⛵ Losfahren“ → Welt-Liste; Forscherlager
(Ella) auf der Heimatinsel ab Kapitel 1 und auf jedem Eiland ab Kapitel 7; Seite `spiele/expedition/`: Inselkarte lesen (Stufen a/b/c: Lage, Felder A–F/1–6, Himmelsrichtungen, Maßstab) und Forscher-Tagebuch.
Entscheidungen (Fragerunde 09.11.): Reisen über ⚙️ bleibt vor Kapitel 7 erlaubt; das Lager steht auch daheim. Tests `expedition`, `kapitel` (Kapitel 7), `inselkern`; CI um `expedition` ergänzt.
**Im iPad testen (in /dev/test):**
1. Insel öffnen: Ist sie spürbar größer, findet das Kind Garten, Bäckerei, Tierstation und Leuchtturm über die Trittsteine? Ist das Laufen (Joystick und Antippen) noch angenehm?
2. Zum Steg laufen – bis ans Ende, zum Boot: Knopf „Boot“ → Robo → „⛵ Losfahren“ → Welt-Liste; eine Welt erschaffen; auf dem Eiland das Zelt (Forscherlager) suchen → „Forschen“.
3. Forscherlager: „Karte lesen“ (sind die Zeichen auf der Karte groß genug, quer und hoch?), eine Runde spielen; „Forscher-Tagebuch“ eintragen. Danach mit dem Boot „Nach Hause“ (Heimatinsel besuchen).
4. Kapitel-7-Szene (in /dev: 50 Lernfunde und Führerschein): Spricht Robo am Steg, zeigt die Hand aufs Boot?

### Stand 08.11.2026
## 1. Stand (08.11.2026)
**UX-Ideen (08.11., PLAN „Stand 08.11.2026 (UX-Ideen)“):** Startkamera höher und weiter (`KAM`, Hochformat bis ×1,25 weiter), Haus mit Türrahmen, Rundfenster, Klinke, Schwelle, Fensterkreuzen
und -bänken, Baumkronen mit kräftiger Kontur (in großen Wäldern „einfach“ eine Kugel weniger – Budget), Vorschul-Startseite mit 108-px-Symbolen und größeren Begleitern.
**Im iPad testen (in /dev/test):**
1. Insel öffnen (quer und hoch): Sind Bruni, Tilda, Fipsi und der Wegweiser ganz im Bild? Wirkt die Figur noch groß genug?
2. Zum Haus laufen: Fensterkreuze, Fensterbänke, Türrahmen, rundes Türfenster, Klinke, Schwelle. Bäume aus der Nähe: dunkle Linien an den Kronen.
3. Ein Kind mit Stufe „Vorschule“ anlegen: Sind die Symbole auf Zahlen / Laute und Reime / Rucksack / Atelier groß genug? Passt alles ohne Scrollen?
4. **Langdruck (iPad-Meldung 08.11., behoben):** Eine Kachel oder einen Knopf lange gedrückt halten (Startseite, „Schreiben und Präsentieren“, Matheweg) – erscheint noch das Safari-Menü
   „Öffnen / Leseliste / Link kopieren / Teilen“? Im Texteditor von „Text gestalten“ muss lange Drücken weiter Auswahl und „Einfügen“ zeigen.

### Stand 07.11.2026
**UX-Pakete 1–5 (07.11., Details in `docs/PLAN.md`, „Stand 07.11.2026 (UX-Pakete 1–5)“):** Insel auf dem Handy ohne Überdeckung; 🔊 liest die Startseite vor; 3D-Figur mit
Schultern, abgespreizten Armen, Daumen und Pony, nachts Laternen und Türlicht; Startseite hoch/Handy kompakter, Matheweg und Deutsch beginnen ohne Scrollen; Insel-Einstellungen
hinter ⚙️, Steuerungs-Hinweis mit bewegtem Zeichen; Album-Reiter, Wochenbericht, Nest bei der Ei-Auswahl, Zimmertür. Neue Tests `falz`, `hud`, `feinschliff`.
**Figuren 1–4 (07.11., PLAN „Stand 07.11.2026 (Figuren 1–4)“):** 3D-Kinderfigur mit Hals, Ohren, Nase, Fransen, Seitensträhnen und Schuhen; Tilda in 2D und 3D aufrecht mit
Panzer auf dem Rücken; Paula mit Federkamm, Papageienschnabel, Flügeln und Schwanzfedern; 2D-Kinderfigur ohne Knicklinien.
**Im iPad testen (in /dev/test):**
1. Startseite: 🔊 oben antippen – liest sie Name, „Heute für dich“ und Spielzeit vor? Hochformat: stehen Meine Ecke, Mein Tier und Spielzeit in einer Zeile?
2. Insel: Stehen die Arme der Figur ab, gibt es Schultern und Pony? Oben rechts ⚙️ antippen – Blatt mit Welt/Grafik/Laufen/Kamera. Abends: Laternen und Licht an der Haustür.
3. Im Haus: die Tür rechts antippen – geht es nach draußen? Matheweg: ist die erste Station ohne Scrollen da? Deutsch: beginnt die Werkstatt ohne Scrollen?
4. Figuren: Gesicht und Haare der 3D-Figur aus der Nähe (Pony, Strähnen, Ohren, Hals, Schuhe); Tilda am Schachtisch und auf der Schach-Seite; Paula auf der Bühne und im Atelier; Kleiderschrank-Figur ohne Linien an Ellbogen und Knien.
**Review nach der Sitzung (07.11., Details in `docs/PLAN.md`, „Stand 07.11.2026 (Review)“):** behoben sind ein Safari-Fehler (Regex-Lookbehind in `hilfe-ru.js`
ließ auf iPadOS 16.0–16.3 alle russischen Mathe-Zeilen verschwinden; neue Prüfung in `tests/offline.js`), die Leuchtturm-Wartezeit nach dem Lösen (Reiterwechsel,
neue Runde), Können/Erfahrung nur beim ersten Lösen eines Licht-Rätsels, die Sprechblasen-Zipfel mit Kontur in Englisch/Sorbisch/Medien/Sachkunde (Test `stil`),
die Lampe in der Kapitel-6-Szene bei der dritten Blase, der Leuchtturm-Platz mit Rückfall (220 Welten im Test) und „Kapitel x von y“ über `Story.KAPITEL_ZAHL`;
CLAUDE.md kennt jetzt Leuchtturm, `extras3d` und die Tests `leuchtturm`/`extras3d`/`stil`. Aus dem Review ist nichts mehr offen.
**Im iPad zusätzlich testen:** Englisch oder Sachunterricht öffnen, eine Lektion starten – hat die Sprechblase jetzt einen Zipfel mit dunkler Kontur (quer und hoch)?
**Neu am 07.11.2026** (Details in `docs/PLAN.md`, „Stand 07.11.2026“):
- **Kapitel 6 „Der Leuchtturm“** (35 Lernfunde + 3 Schach-Rätsel oder -Lektionen): Leuchtturm am Ufer, nachts mit Lichtstrahl; Seite `spiele/leuchtturm/` mit
  24 Licht-Rätseln (Spiegel drehen, drei Stufen) und **Tildas Schatzkammer** (Test `leuchtturm`, `kapitel`).
- **Russisch für die Mathe-Lösungshilfen** (Entwurf, Satz für Satz): Kl. 1 92 %, Kl. 2 75 %, Kl. 3/4 70 %, Übergang 5 30 %.
- **3D-Figur:** alle 34 Kleiderschrank-Extras in 3D, Bommelmütze wie in 2D, Dinge in der Hand werden gehalten (Test `extras3d`).
- **Stil A auf allen Seiten:** Sprechblasen mit dunkler Kontur, Zipfel mit Kontur.
**Im iPad testen (in /dev/test, dort ist alles offen):**
1. Insel → Leuchtturm am Ufer → „Leuchtturm“: Licht-Rätsel lösen (Spiegel antippen), einmal 💡 Tipp; Reiter „Schatzkammer“. Abends (nach 20 Uhr) auf der Insel: kreist der Lichtstrahl?
2. Hilfesprache Russisch, Matheweg: eine Aufgabe zweimal falsch – steht unter „Die Lösung ist …“ und dem Hinweis die russische Zeile?
3. Kleiderschrank: Teddy, Ballon, Kopfhörer, Bommelmütze anziehen, dann auf die Insel – passt es?
4. Sprechblasen in Deutsch, Sachunterricht, Mein Tier: gefällt die dunkle Kontur?

### Stand 06.11.2026
**Neu am 06.11.2026** (Details in `docs/PLAN.md`, „Stand 06.11.2026“):
- **Kapitel 5 „Der Sturm“** (25 Lernfunde + ein Wetter-Thema) und **Ellas Wetter-Drache** an der Wetterstation: Wettertagebuch, Wetter-Fragen je Klasse, Drachenflug (Test `wetterdrache`, `kapitel`).
- **Schriftlich mal mehrstellig** (Kl. 4): Erklär-Einheit, „Zeig mir deinen Weg“ in Zeilen, Denkfehler „Zeilen nicht eingerückt“ (Test `malmehr`).
- **Russisch:** die häufigsten Mathe-Aufgabenfragen (Kl. 1 92 %, Kl. 2 84 %, Kl. 3/4 71 %), Rückmeldungen in Angeln/Boot/Drache.
- **Barrierefreiheit:** Rundgang über 30 Seiten ohne Funde (Test `barriere`).
**Im iPad testen (am einfachsten in /dev/test):**
1. Insel → Wetterstation → „Drachen“: Tagebuch eintragen (mit Ort im Elternbereich steht das gemessene Wetter da), 5 Fragen, dann den Drachen mit „Leine ziehen“ 8 Sekunden im grünen Band halten – ist das zu schwer?
2. Matheweg Kl. 4 → „Schriftlich mal mehrstellig“ → „Erklär es mir“; danach eine Aufgabe absichtlich falsch: Kommt der Zeilen-Weg?
3. Hilfesprache Russisch: Matheweg Kl. 1 oder 2 – steht unter den Fragen die russische Zeile?

### Stand 05.11.2026
**Neu am 05.11.2026** (Details in `docs/PLAN.md`, „Stand 05.11.2026“):
- **Elternbereich schneller:** Die Lerninhalte (~1,5 MB) laden erst nach dem ersten Bild; „Lernstand“ und „Wie in der Schule“ füllen sich kurz danach (Test `elternschnell`).
- **Russische Hilfe in Mathe:** alle Erklär-Einheiten und Denkfehler-Hinweise mit russischer Zeile (Entwurf, nur mit Hilfesprache Russisch; Test `matheru`).
- **Rhythmus-Boot** an der Ballon-Wiese, öffnet mit **Kapitel 4 „Paulas Fest“** (15 Lernfunde + Atelier, Englisch oder Musik): Rhythmus anhören, nachpaddeln oder Karte finden (Test `rhythmus`).
- **Technik & Speicher** im Elternbereich (Kinder & Gerät): Speicherplatz, „Dauerhaft speichern“, App-Version, technisches Protokoll (Test `technik`).
**Im iPad testen (in /dev, am besten /dev/test – dort ist alles offen):**
1. Elternbereich öffnen: erscheint der Überblick schneller? „Lernstand“ antippen – kurz „wird geladen“, dann der Inhalt.
2. Insel → Ballon-Wiese → „Boot“: „▶ Anhören“ (Ton an!), dann im gleichen Rhythmus aufs Paddel tippen; bei „Finden“ die Karte wählen. Klappt das Tippen im Takt? Ist es zu schwer/zu leicht?
3. Elternbereich → Kind ändern → Hilfesprache Russisch, dann Matheweg Kl. 2 → „Plus über den Zehner“ → „Erklär es mir“: steht unter jeder Blase die russische Zeile?
4. Elternbereich → Kinder & Gerät → „Technik & Speicher“: Was steht bei Speicher und Protokoll? (Bei Problemen Bildschirmfoto schicken.)

### Stand 04.11.2026
**Zuletzt (04.11.2026, abends):** Wörter-Angeln an Fipsis Angelsteg (Schatz-Strand, ab Kapitel 2, Test `angeln`); Geld-Erklärung wieder mit echten Münzen.
**Im iPad testen (in /dev):** Insel → Schatz-Strand → „Angeln“ (in /dev/test sofort offen): Fisch antippen, Eimer wählen, einmal absichtlich falsch.
**Neu am 04.11.2026:** Kleiderschrank-Extras neu gezeichnet (Dinge in der Hand werden gehalten, Hüte/Mützen mit Schatten), Matheweg mit neuen Denkfehlern
(„Zahl verdreht“, mal 0, zwei Geteilt-Fehler) und neuen Erklär-Einheiten (Geteilt, Minus bis 10, Zehner und Einer, Plus/Minus bis 20, Ergänzen, Uhrzeit, Geld) samt Denkfehlern für Uhr und Geld; später auch Länge, Kl. 3 (Zahlen bis 1000, Runden, Teilen mit Rest), Kl. 1 (Zerlegen, Verdoppeln) – zusammen 23 Einheiten und 20 Denkfehler. „Zeig mir deinen Weg“ ist kindgerecht und kann schriftlich mal. Elternbereich: Denkfehler mit Tipp für zu Hause. Details in `docs/PLAN.md`, „Stand 04.11.2026“.
**Im iPad testen (in /dev):** Kleiderschrank → Extras (Ball, Teddy, Tasche, Mützen); Matheweg Kl. 2 → „Geteilt“ und „Zehner und Einer“ neu öffnen („Erklär es mir“),
bei „Welche Zahl ist das?“ absichtlich verdreht eintippen (z. B. 25 statt 52); „Uhrzeit“ und „Geld“ neu öffnen (Uhr selbst stellen, Münzen antippen).

### Stand 02.11.2026
**Neu am 02.11.2026:** siehe Abschnitt 0. Neue Tests: `sticker`, `fehlerursachen`, `sicherung` (Browser), `mathe-fehler`, `pruefstand` (Node, laufen in `sh tests/laufen.sh` mit).

**Neu am 01.11.2026, letzte Sitzung:** Noto-Emojis in Stil A für alle 773 Emojis. Begleiter erscheinen nie mehr als Emoji. Begleiter, Spielfigur und Tier sind niedlicher, in 2D und 3D.
Wangen sind erlaubt, aber dezent. Mehrere Tests zählten `span`s und wurden angepasst; Medien und Chronik passen wieder aufs Handy.

**Neu am 01.11.2026 (Performance Insel):** Blumen auf der Insel und in großen Welten sind jetzt `InstancedMesh` (Stiel + Blüte je Farbe) statt vieler einzelner Meshes, die danach verschmolzen wurden. Weniger Objekte, etwas weniger Speicher und Zeichenaufrufe, besonders bei vielen Blumen. Kein visueller Unterschied (Kontur an den kleinen Blüten bewusst weggelassen).

**Neu am 01.11.2026, zweiter Teil: alle geplanten Pakete umgesetzt** (Details in `docs/PLAN.md`, „Stand 01.11.2026, abends“):
- **Insel-Garten** (Ella, Kapitel 1, Etappe E6): säen, gießen über echte Tage, ernten mit Sachunterricht-Fragen; die Beete wachsen auf der Insel sichtbar mit.
- **Tierpflege-Station** (Bruni, Kapitel 2): acht Wildtiere versorgen und am nächsten Tag auswildern, Sonderfall Rehkitz.
- **Bäckerei Benno** (Kapitel 3): Bestellungen packen, Preise, passend bezahlen, Wechselgeld – Geld je Klasse.
- **Verbessert:**
  - Schach: Bauern-Rennen und Tipp.
  - Duell: Rückblick auf die falsch beantworteten Aufgaben.
  - Gefühle: Hilfe-Karte mit 116 111.
  - Atelier: Spiegel-Malen.
- **NA-60 Teil 2:**
  - Kürzere Szenen und größere Schrift für Vorschule und Kl. 1.
  - „Heute für dich“ schlägt Kindern, die die Klasse wiederholen, das wackeligste Fach vor.
- **Aufräumen:** `shared/sprachkurs.js` für Englisch/Sorbisch; neue Tests `tier`, `schach`, `gefuehle`, `duell`, `garten`, `baeckerei`, `tierstation`, `verbessert`, `na60b`.

**Neu am 01.11.2026: Code-Review mit Korrekturen** (Details in `docs/PLAN.md`, „Stand 01.11.2026“; Tests `robust` und `offline`):
- Datenverlust behoben: Die Sicherung in IndexedDB wurde bei leerem localStorage überschrieben. Ein gelöschtes Kind kam zurück. Zwei Tabs überschrieben sich.
- „Erst lernen“ dichter: „PIN vergessen?“ nur noch mit Zufallsaufgabe nach 60 s und Hinweis an die Eltern. Die Eltern-Anmeldung gilt 15 Minuten.
  Spielstand laden setzt das Zeitkonto nicht mehr zurück. „Noch 0 Minuten“ lässt sich nicht weglernen.
- Namen ohne HTML-Zeichen; Schrift Fredoka lokal (kein Google Fonts mehr); Service Worker holt Seiten zuerst aus dem Netz.
- GitHub Action `.github/workflows/tests.yml` prüft jeden Push (Node-Tests, Rauchtest, `robust`, /dev frisch gebaut).

### Stand 30.10.2026, spät
Die Inhalte sind fertig. Optik, Story und Familienfunktionen sind ausgebaut. Zuletzt erledigt (alle Tests grün, alles auf `main`):
- **Optik Teil 1 und 2:** Jungen-Kleidung (Test `anziehen`), 3D-Figur mit Rumpf, Wasser-Wand in „einfach“ behoben, Fachseiten im gemeinsamen
  Gruppen-Stil, Lernbegleiter auf den Türen, Gras ruhiger, Tiere größer, Meine Ecke und Mathe-Lernbereiche mit Balken.
- **Dashboard:** Startseite ohne Scrollen auf dem iPad; Meine Ecke und Elternbereich mit Reitern (Test `dashboard`).
- **Story:**
  - NA-17: Kapitel 2 „Fipsis Karte“ mit Wegweiser und Wörtern des Kindes, Etappe E9 „Atelier“ (Test `kapitel`).
  - NA-18: Inselchronik im Album (Test `chronik`).
  - NA-16: QR-Geschenke. Die Technik ist fertig (Test `geschenk`); **der öffentliche Schlüssel des Auftraggebers fehlt noch**, darum wird jeder Code
    abgelehnt.
- **Geburtsdatum und Geburtstagsgeschenk:** Alter wird aus dem Geburtsdatum berechnet. Am Geburtstag gibt es 🎂, eine Szene und ein Paket am Steg;
  das Paket ist bis 60 Tage danach einlösbar (Test `geburtstag`).
- **NA-61 Schuljahreswechsel:**
  - Wechsel zum 1. August, die Eltern bestätigen.
  - Wiederholen wird still gemerkt; nach dem Überspringen gibt es einen Lücken-Check.
  - **Ferien Sachsen bis Sommer 2030** mit Ferien-Modus; weniger Lernzeit nur mit Eltern-Erlaubnis (Test `schuljahrwechsel`).
- **NA-60 Altersgerechte Erfahrung, Teil 1:**
  - **Vorlesen nur auf Knopfdruck** (Eltern-Schalter „Automatisch vorlesen“).
  - Eigene Vorschul-Startseite.
  - Tagesaufgaben und Türen je Klasse; Englisch ab Klasse 3 oder nach Eltern-Wahl ab Klasse 1, Robo ab Klasse 3.
  - Feld „Heute für dich“ auf der Startseite.
  - Vorschlag für den nächsten Matheweg (Test `altersgerecht`).

### Was es gibt (Inhalte, kurz)
- **Mathe (Biber Benno):** Wege Kl. 1/Vorschule 22, Kl. 2 45, Kl. 3 35, Kl. 4 26 und Übergang 5 26 Stationen. Freischalten je Lernbereich,
  „Zeig, was du kannst“, „gerade in der Schule“, Urkunden.
- **Deutsch:**
  - Fipsis Abenteuer.
  - Lesen und Schreiben, mit Schulausgangsschrift.
  - DaZ „Ankommen“.
  - Wörter-Werkstatt (88 Kapitel nach Lernbereichen).
  - Mein Heft, Vorlesen/Lesetheater, Präsentieren.
- **Sachunterricht (Eule Ella):** 61 Themen und die Landkreise Sachsens.
- **Weitere Fächer:** Kunst, Musik, Werken, Sport, Ethik mit 70 Themen; Religion (ev./kath.) mit 37 Themen nach Eltern-Wahl.
- **Englisch (Papagei Paula):** 31 Lektionen, Lieder.
- **Sorbisch** (nach Eltern-Wahl): 47 Lektionen als Fremdsprache und 25 als Muttersprache. Alles sind Entwürfe; die Prüfliste ist `spiele/sorbisch/pruefen.html`.
- **Vorschul-Rucksack:** 16 Spiele.
- **Sonst:** Robo programmieren (13 Level), Medien, Gefühle, Atelier, Schach, Kopfrechen-Duell, Echte Welt, Lernkartei, Können je Lernziel, Elternbericht.
- **Lehrplan Sachsen:** alle Fächer gegen die PDFs geprüft. Lernbereiche Mathe/Deutsch/SU: 37 „gut“, 8 „teilweise“, 0 „fehlt“. Englisch: 18 „gut“,
  4 „teilweise“, 0 „fehlt“. „Teilweise“ heißt ehrlich: braucht Stimme, Papier oder einen Menschen. Zahlen in `tests/lehrplan.js`.

### Entscheidungen des Auftraggebers (gelten)
- **Grafik und Story sind freigegeben.** Es gibt nur noch den Look **„Rund“** (three.js); „Pixel“ ist entfernt.
- **Minispiele:** Die fünf alten (Ballon-Party, Schatz-Strand, Sternenlauf, Kart, Bauplatz) sind ausgeblendet (`Spielwelt.MINISPIELE_AUS`) und
  **werden durch neue 3D-Spiele ersetzt**. Reihenfolge: Insel-Garten → Bäckerei Benno → Tierpflege-Station (Katalog in `docs/MINISPIELE.md`).
  Der alte Code bleibt im Repo. **Kapitel 3 öffnet künftig über die Bäckerei Benno**, Etappe E6 „Spielorte“ zeigt dann das erste neue Spiel.
- **Vorlesen in jedem Alter nur auf Knopfdruck.** Jede neue Seite bietet vorzulesenden Text über einen sichtbaren 🔊-Knopf an.
- **Alter und Klasse:**
  - Die Klasse steuert Tagesaufgaben, Türen und Inhalte.
  - Das Alter steuert zusätzlich Ton und Story sowie die **Schwierigkeit der neuen Insel-Spiele** (z. B. Bäckerei: Kl. 1 bis 10 €, ab Kl. 3 mit Komma).
  - Über die Klasse hinaus gibt es Vorschläge nach Können.
- **Alles geht direkt auf `main`**; `/dev` hat einen eigenen Spielstand. Russische und sorbische Entwürfe stehen auch auf der Hauptseite (`ENTWURF_FREI`).
- **Für alle Grundschulkinder in Deutschland gleich:** Wo Schulen oder Länder verschieden vorgehen, gibt es eine Eltern-Einstellung mit Standard.
- **Arbeitsweise:** in größeren Schritten arbeiten; die Dashboard-Ansichten bekommen keinen Schalter für die alte Variante.

### Bekannte Baustellen
- **QR-Geschenke:** Ohne `OEFFENTLICH` in `shared/geschenk.js` ist alles abgeschaltet. Der private Schlüssel kommt **nie** ins Repo; Codes erzeugt
  nur der Auftraggeber mit `quellen/geschenk-erzeugen.js`.
- **Ferien:** `FERIEN_SN` in `shared/core.js` reicht bis Sommer 2030 und muss danach nachgetragen werden. Die Termine stammen aus der Websuche
  (sachsen.de war nicht erreichbar) und sollten einmal gegengeprüft werden.
- **NA-60:** Kürzere Szenen gibt es nur über `fuerAeltere` (4 Blasen markiert). Mehr Text ab Kl. 3 in den Inhalten selbst ist nicht umgesetzt.
- **Ballon-Wiese und Schatz-Strand** führen seit 04./05.11. zu Rhythmus-Boot (Kapitel 4) und Wörter-Angeln (Kapitel 2).
- **Schreibschrift:** Vereinfachte und Lateinische Ausgangsschrift fehlen.
- **Übersetzungen:** nur russische Entwürfe, Ukrainisch u. a. fehlen.
- **Länderprofile:** Nur Sachsen ist da (NA-47).
- **Insel-Tests:** `tutorial`, `prolog`, `kapitel`, `geschenk`, `geburtstag` und `expedition` allein laufen lassen; unter Last wackeln sie. `leistung` nur allein messen (unter Last liegen die Zahlen zu hoch).
- **Aus dem Review offen (Wartbarkeit):**
  - Feste Wartezeiten in älteren Tests ersetzen.
  - Weitere gemeinsame Teile der Sprachkurse zusammenführen (Schritt-Darstellung).
  - `dev/` per Action bauen statt einchecken: Entscheidung des Auftraggebers, braucht eine Umstellung von GitHub Pages.

### Offene Fragen an den Auftraggeber
- **iPad-10-Test (in /dev), bisher nicht erfolgt.** Bitte ansehen:
  0. Neu 01.11., letzte Sitzung: Emoji-Bilder (Noto) auf allen Seiten, Begleiter überall als Zeichnung (z. B. Vorschul-Rucksack), niedlichere Figuren auf der Startseite,
     im Kleiderschrank, beim Tier und auf der Insel (Nachbarn, Paula auf der Bühne, Tilda am Schachtisch). Gefallen die Wangen so (dezent)? Sollen die Noto-Smileys ihre Wangen zurückbekommen?
     Läuft die Sachunterricht-Liste mit vielen Bildern flüssig?
  0b. Neu 01.11.:
     - Elternbereich nach 15 Minuten wieder mit PIN; „PIN vergessen?“ (Zufallsaufgabe nach einer Minute); Schrift sieht aus wie vorher.
     - Insel: Garten, Tierpflege-Station und Bäckerei an den alten Spielorten.
       In /dev/test sind alle offen; in /dev öffnen sie mit Kapitel 1, 2 und 3.
     - Garten über zwei Tage gießen; Bäckerei in Kl. 1 und Kl. 3; Tierstation mit eigenem Tier.
     - Schach: Bauern-Rennen; Gefühle: Hilfe-Karte; Atelier: „Spiegeln“.
  1. Vorschul-Startseite: ein Kind mit Stufe „Vorschule“ anlegen.
  2. Vorlesen nur über 🔊: reicht das, ist der Knopf gut zu finden?
  3. „Heute für dich“ und Tagesaufgaben je Klasse.
  4. Geburtsdatum eintragen.
  5. Ferien-Karte unter „Zeit & Regeln“.
  6. Kapitel 2 mit Wegweiser.
  7. Inselchronik im Album.
  8. Startseite und Reiter quer und hoch.
  9. Leistung der Insel.
- **QR-Geschenke:** Schlüsselpaar mit `node quellen/geschenk-erzeugen.js schluessel <Ordner außerhalb des Repos>` erzeugen und den öffentlichen
  Teil (x, y) schicken. Welche Geschenke soll es zu Weihnachten 2026 geben?
- **Ferientermine Sachsen** einmal gegenprüfen.
- **Sorbisch prüfen lassen:** 72 Lektionen, Prüfliste im Elternbereich oder unter `spiele/sorbisch/pruefen.html`.
- Muttersprachlerinnen und Muttersprachler für ru/uk; Silbenfarben der Schule.

## 2. Nächste Pakete (in dieser Reihenfolge)
0. **Abschnitt 0** (Tiere 2D, Kleiderschrank, Mathe-Erklärungen – erst Vorschau).
1. **iPad-Rückmeldung** zu Figuren (2D und Insel), Tieren, Zimmern, Erklär-Einheiten, Schrittweg, Noto-Bildern und Leistung – Fehler zuerst, je mit Test.
2. **Prüfen statt Bauen** (Abschnitt 0, Schritt 2).
3. **Gestaltung Stil A auf allen Seiten.**
4. ~~Wörter-Angeln und Rhythmus-Boot~~ (erledigt 04./05.11.); ~~Elternbereich schneller~~ (erledigt 05.11.).
5. ~~Kapitel 5 und das nächste Insel-Spiel~~ (erledigt 06.11.); ~~Kapitel 6~~ (erledigt 07.11.); ~~Arme der 3D-Figur~~ (07.11.); ~~größere Heimatinsel und Kapitel 7~~ (erledigt 09.11.); Russisch (Mathe, Szenen, Expedition) von Muttersprachlern prüfen lassen.

Jederzeit dazwischen: iPad-Rückmeldung einarbeiten (Fehler zuerst), Sorbisch-Korrekturen in `spiele/sorbisch/lektionen.js` und `geprueft.js`,
den öffentlichen QR-Schlüssel in `OEFFENTLICH` eintragen, sobald er da ist. Arbeitsliste für den Lehrplan bleibt `docs/SACHSEN-SCHULJAHR.md`.

Zurückgestellt (nur wenn der Auftraggeber es will): Länderprofile außer Sachsen, weitere Hilfesprachen, Vereinfachte/Lateinische Ausgangsschrift,
Murmelbahn, Rhythmus-Boot und Wetter-Drache aus `docs/MINISPIELE.md`.
