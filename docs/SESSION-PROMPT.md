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

## 1. Stand (30.10.2026, spät)
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
- **NA-60 Teil 2 fehlt:**
  - Ton und Story nach Alter: kürzere Szenen für Jüngere brauchen eigene Kurzfassungen.
  - Kl. 1 mehr Bilder und kürzere Texte, ab Kl. 3 mehr Text.
  - Gezielte Lücken nach dem Wiederholen in „Heute für dich“.
- **Schreibschrift:** Vereinfachte und Lateinische Ausgangsschrift fehlen.
- **Übersetzungen:** nur russische Entwürfe, Ukrainisch u. a. fehlen.
- **Länderprofile:** Nur Sachsen ist da (NA-47).
- **Insel-Tests:** `tutorial`, `prolog`, `kapitel`, `geschenk` und `geburtstag` allein laufen lassen; unter Last wackeln sie.

### Offene Fragen an den Auftraggeber
- **iPad-10-Test (in /dev), bisher nicht erfolgt.** Bitte ansehen:
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
1. **Insel-Garten** (3D „Rund“, neuer Ort auf der Insel):
   - Säen, gießen und ernten über echte Tage, mit Sachunterricht-Bezug (Pflanzen, Wetter, Jahreszeiten; Eule Ella).
   - Schwierigkeit nach Alter/Klasse.
   - Nichts geht verloren und es gibt keine Fristen: Pflanzen welken nicht, sie warten nur.
   - Belegt einen der „🚧 Hier entsteht etwas Neues“-Orte, Test-Haken, Eintrag in `SEITEN_3D`, Leistung auch in Stufe „einfach“ prüfen.
   - Eigener Test mit echtem Durchklicken über mehrere Tage (`__testJetzt`).
   - Etappe E6 auf das neue Spiel umstellen.
2. **Bäckerei Benno:**
   - Geld und Rechnen mit Bezug zum Matheweg (Kl. 1 bis 10 €, Kl. 2 bis 100 €, ab Kl. 3 mit Komma).
   - Öffnet **Kapitel 3** im Kapitelbogen `KAPITEL` (ersetzt „Bennos Brücke“ am Bauplatz).
3. **Tierpflege-Station:** füttern, pflegen, Tierwissen (SU-Lernziele), verbunden mit dem eigenen Tier.
4. **Schach, Kopfrechen-Duell, Gefühle und Atelier deutlich verbessern.** Vorher den Auftraggeber fragen, was dort am meisten stört.
5. **NA-60 Teil 2:** Ton und Story nach Alter, Lesestärke je Klasse, Lücken nach dem Wiederholen.

Jederzeit dazwischen: iPad-Rückmeldung einarbeiten (Fehler zuerst), Sorbisch-Korrekturen in `spiele/sorbisch/lektionen.js` und `geprueft.js`,
den öffentlichen QR-Schlüssel in `OEFFENTLICH` eintragen, sobald er da ist. Arbeitsliste für den Lehrplan bleibt `docs/SACHSEN-SCHULJAHR.md`.

Zurückgestellt (nur wenn der Auftraggeber es will): Länderprofile außer Sachsen, weitere Hilfesprachen, Vereinfachte/Lateinische Ausgangsschrift,
Murmelbahn, Rhythmus-Boot und Wetter-Drache aus `docs/MINISPIELE.md`.
