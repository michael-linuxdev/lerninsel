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

## 0. Auftrag für diese Sitzung: Emojis aus Noto in Stil A, dann Gestaltung Stil A überall
Der Auftraggeber hat am 01.11.2026 entschieden (Fragerunde ist damit erledigt, nur bei Unklarem nachfragen):
- **Gestaltung: Stil A „Insel bunt“**: kräftige Farben, dunkle Kontur `#3B1F63`, Knöpfe mit festem Schatten. Vorschau unter `spiele/stil/` (Variante A).
- **Figuren** (`shared/figuren.js`, schon in der App, auch Ella in 3D):
  - Ella ist braun und so niedlich wie die anderen, hat keine Federohren (nur eine Feder-Locke) und keine Brille.
  - **Keine rosa Wangen** – nirgends im Spiel, auch nicht bei neuen Bildern.
- **Emojis: alle 784 Emojis der App aus Noto (Google, Apache 2.0) in Stil A umsetzen.**
  - Der Weg ist freigegeben („Gut so, für alle“): dünne Lerninsel-Kontur außen herum, Verläufe als zwei harte Farbstufen wie die Toon-Grafik der Insel.
  - Das Werkzeug ist fertig: `quellen/noto-stil-a.py` (Regeln im Kopf der Datei).
  - Die 114 selbst gezeichneten Bilder (`quellen/icons/paket1.js` u. a.) werden dadurch ersetzt. Selbst zeichnen ist verworfen: zu einfach bzw. zu aufwendig.

**Schritte:**
1. **Quellen holen** (in einen eigenen Ordner im Scratchpad, nicht ins Repo):
   - `npm pack @svgmoji/noto`, daraus `package/sprites/all.svg`.
   - Die rund 41 Emojis, die im Sprite fehlen (vor allem neuere wie 🪺 🪪 🐦‍⬛ 🛝 🫘 🪈 🛟 🫏 🪼 🪸 🩵 🪇 🛞 🫙 🫲 🫴), als `svg/emoji_u<hex>.svg` aus `https://raw.githubusercontent.com/googlefonts/noto-emoji/main/svg/` laden.
   - Reine Textzeichen bleiben System-Zeichen und kommen nicht in die Liste: → ✓ ✗ ← ↑ ↓ ⌫ ⇧ ✕ ↰ ↱ ➜ ✦ ♚ ♛ ♜ ♝ ♞.
2. **Bauen:** `python3 -I quellen/noto-stil-a.py <all.svg> quellen/icons/liste.json shared/icons.js <ordner-einzeln>`.
   - Danach in `quellen/dev-bauen.sh` den Aufruf `node quellen/icons-bauen.js` durch diesen Schritt ersetzen oder das Bauskript so umstellen, dass es nicht mehr überschreibt.
   - Die Noto-Quelldateien müssen dafür reproduzierbar im Repo liegen. Vorschlag: die gekürzten Original-SVGs der 784 Emojis in `quellen/noto/`; das Bauskript liest dann daraus.
3. **Prüfen:**
   - Prüfbogen aller Bilder in 64 und 24 px als PNG (Playwright) ansehen. Missratene Umsetzungen einzeln nachbessern (Ausnahme-Liste im Skript), z. B. bei sehr hellen Emojis mit fast nur Weiß.
   - Größe von `shared/icons.js` messen (Ziel: unter ~2 MB). Sonst Noto-SVGs verkleinern (Zahlen runden, Leerzeichen raus) oder pro Seite nur die benutzten laden.
   - **Leistung auf dem iPad:** Jedes Bild hat einen SVG-Filter (Kontur). Seiten mit sehr vielen Emojis (Sachunterricht-Listen, Werkstatt) gegen das Leistungsbudget testen.
     Wenn es zu langsam ist: die Kontur beim Bauen als zweite, mit `stroke` versehene Kopie der Formen vorberechnen statt als Filter.
4. **Einbauen** – das ist schon vorhanden: `shared/emoji.js` ersetzt jedes bekannte Emoji beim Anzeigen, `textContent` bleibt gleich; Eltern-Schalter „Emojis des Geräts“ (`eltern.bilder = "geraet"`).
   Danach testen: `bilder`, Rauchtest, große Lerntests (`sachkundevoll`, `deutschvoll`, `englisch`, `tafel`, `vorschule`, `faechervoll`).
5. **Lizenz:**
   - `quellen/noto/LICENSE` (Apache 2.0) ins Repo legen, mit dem Hinweis „verändert: Stil A der Lerninsel (Farbstufen, Kontur)“.
   - In `docs/LIZENZEN.md` eintragen und in `CLAUDE.md` die Regel „fremde Dateien nur CC0/OFL“ um „Noto-Emoji-Bilder (Apache 2.0)“ ergänzen.
   - Die Emoji-Proben in `spiele/stil/emoji/` (Noto, Fluent) dürfen danach gelöscht werden.
6. **Gestaltung Stil A auf allen Seiten:**
   - `shared/style.css` und die Seiten mit eigenen Stilen angleichen: Kontur und Knopf-Schatten wie auf der Startseite, gleiche Kopfzeile mit rundem Heim-Knopf, Karten-Radius 26 px.
   - Screenshots aller Seiten quer und hoch ansehen.
   - Canvas- und 3D-Stellen mit Emojis prüfen: Schilder auf der Insel (`schildSprite`), Stempel im Atelier. Dort die Noto-Bilder über `Image()` aus `LERN_ICONS` zeichnen.

**Hinweis zum Repo-Stand:**
- Uncommittet sind evtl. noch die Bild-Vorgaben „einfach, aber sauber“ (Kontur 2,5 px in `quellen/icons-bauen.js`, `quellen/icons/STIL.md`). Sie sind durch die Noto-Entscheidung hinfällig: zurücksetzen oder mitcommitten.
- `quellen/noto-stil-a.py` ist neu.

## 1. Stand (01.11.2026, abends)
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
- **Ballon-Wiese und Schatz-Strand** zeigen weiter „🚧“. Vorschlag: Wörter-Angeln und Rhythmus-Boot (siehe unten).
- **Schreibschrift:** Vereinfachte und Lateinische Ausgangsschrift fehlen.
- **Übersetzungen:** nur russische Entwürfe, Ukrainisch u. a. fehlen.
- **Länderprofile:** Nur Sachsen ist da (NA-47).
- **Insel-Tests:** `tutorial`, `prolog`, `kapitel`, `geschenk` und `geburtstag` allein laufen lassen; unter Last wackeln sie.
- **Aus dem Review offen (Wartbarkeit):**
  - Fachdaten im Elternbereich nach Bedarf laden (~2 MB Skripte; braucht asynchrones Zeichnen der Lernstand-Teile).
  - Feste Wartezeiten in älteren Tests ersetzen.
  - Weitere gemeinsame Teile der Sprachkurse zusammenführen (Schritt-Darstellung).
  - `dev/` per Action bauen statt einchecken: Entscheidung des Auftraggebers, braucht eine Umstellung von GitHub Pages.

### Offene Fragen an den Auftraggeber
- **iPad-10-Test (in /dev), bisher nicht erfolgt.** Bitte ansehen:
  0. Neu 01.11.:
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
1. **Emojis aus Noto in Stil A** (Abschnitt 0, Schritte 1–5).
2. **Gestaltung Stil A auf allen Seiten** (Abschnitt 0, Schritt 6).
3. **iPad-Rückmeldung** zu Garten, Bäckerei, Tierstation, neuen Figuren, Leistung der Insel (adaptive Auflösung) einarbeiten – Fehler zuerst, je mit Test.
4. **Wörter-Angeln** (Schatz-Strand, Kapitel 2) und **Rhythmus-Boot** (Ballon-Wiese, Kapitel 4).
5. Elternbereich schneller (Fachdaten erst beim Reiter „Lernstand“ laden).

Jederzeit dazwischen: iPad-Rückmeldung einarbeiten (Fehler zuerst), Sorbisch-Korrekturen in `spiele/sorbisch/lektionen.js` und `geprueft.js`,
den öffentlichen QR-Schlüssel in `OEFFENTLICH` eintragen, sobald er da ist. Arbeitsliste für den Lehrplan bleibt `docs/SACHSEN-SCHULJAHR.md`.

Zurückgestellt (nur wenn der Auftraggeber es will): Länderprofile außer Sachsen, weitere Hilfesprachen, Vereinfachte/Lateinische Ausgangsschrift,
Murmelbahn, Rhythmus-Boot und Wetter-Drache aus `docs/MINISPIELE.md`.
