# Prompt für die nächste Arbeitssitzung (Lerninsel)

Diesen Text als erste Nachricht in eine neue Sitzung kopieren – **in Claude Code oder in einer Claude-Sitzung mit Shell und Git, auch in einem
anderen Konto**. Voraussetzung: Lese- und Schreibzugriff auf das GitHub-Repo `michael-linuxdev/lerninsel` (GitHub in den Claude-Einstellungen
unter „Connectors“ verbinden; ohne Schreibzugriff kann die Sitzung nicht pushen).

---

Du arbeitest an der **Lerninsel** (Offline-Lern-App für Grundschulkinder, Repo `michael-linuxdev/lerninsel`, Branch `main`). Antworte auf **Deutsch**.

**Zuerst:** Falls das Repo noch nicht da ist, `git clone https://github.com/michael-linuxdev/lerninsel` (bzw. das Repo der Sitzung hinzufügen).
Dann **`CLAUDE.md` im Repo-Stamm vollständig lesen und befolgen** – dort stehen Einrichtung, Arbeitsweise, Regeln, Bauen, Testen und die
Kurzreferenz der Datenformate (in Claude Code ist sie schon geladen). Diese Nachricht enthält nur, was sich seit der letzten Sitzung geändert hat.

## 1. Stand (27.10.2026, 19:45)
### Was es gibt (Inhalte)
- **Mathe (Biber Benno):** fünf Wege, je Station 10 Aufgaben, Lernkartei, Einstufung (Kl. 2), Eltern-Wahl der Subtraktion (Abziehen/Ergänzen).
  Kl. 1/Vorschule 10 Stationen · Kl. 2 23 · Kl. 3 20 (u. a. schriftlich plus/minus, Würfelnetze, Würfelgebäude, Spiegeln, Diagramme, Glücksrad) ·
  Kl. 4 15 (Zahlen bis 1 Mio., schriftlich mal/geteilt, auch mehrstellig, Teilbarkeit 2/3/4/5/6/9/10/100, Primzahlen, römische Zahlen, Maßstab,
  Zeit/Datum, Liter, Flächen, Chancen) · **Übergang 5** 10 (Brüche, Kommazahlen, Klammern, Koordinaten, Winkel, Durchschnitt). Urkunden am Ende von Kl. 4 und Übergang 5.
- **Deutsch:** Fipsis Abenteuer (5 Kapitel), Lesen und Schreiben (Anlaute, Silben, 20 Lesetexte, Nachspuren, Wörter legen), DaZ „Ankommen“,
  **Wörter-Werkstatt 30 Kapitel** (Kl. 1–2: 5, Kl. 3–4: 23 inkl. Geschichte ordnen, Satzanfänge, Brief, Bericht, Wörterbuch, Vortrag; Übergang 5:
  Fachbegriffe, Lesestrategien). Schritt-Typen u. a. `ordnen` und `verbessern`.
- **Sachunterricht (Eule Ella): 32 Themen**, u. a. Wasser, Wetterkarte, Strom, Wärme, Gewässer, Experiment, Erste Hilfe, Medien, Herz und Lunge,
  Pubertät („Ich werde größer“), Nein sagen, Lernen lernen, Neue Schule, **„Unser Bundesland Sachsen“ (nur für Kinder aus Sachsen, Feld `land`)**.
- **Englisch (Papagei Paula): 13 Lektionen** (Kl. 3: Hello, Colours, Numbers, Animals, Body, Food, At home, Around the year; Kl. 4: Family, School,
  Clothes, Weather; Übergang 5: Hobbies). Englische Gerätestimme, ohne Stimme Lesen statt Hören. Eltern-Einstellung Beginn ab Kl. 1 oder 3.
- Weiter: Medien (Tablet-Führerschein), Gefühle, Atelier (Malen, Musik), Schach, Insel in zwei Looks, Story/Tutorial E1–E8, Können je Lernziel, Elternbericht.

### Lehrplan Sachsen (Einschätzung von Hand, `shared/lehrplan/laender/sachsen.js`)
- **Mathe und Deutsch nach Fassung 2025** (in Kraft seit 1.8.2025), Sachunterricht und Englisch nach Fassung 2019.
- **Mathe, Deutsch, Sachunterricht (Kl. 1–4, 45 Lernbereiche): 20 × gut, 25 × teilweise, 0 × fehlt.** Mathe 7/5/0, Deutsch 3/12/0, SU 10/8/0.
- **Englisch (Kl. 3–4, 20 Lernbereiche): 2 × gut, 14 × teilweise, 4 × fehlt** (Let's go shopping, Let's go on a trip, je Kl. 3 und 4).
- Mathe Kl. 4 „Größen und Messen“ und „Daten und Zufall“: Lehrplantext 2025 online nicht vollständig lesbar – Inhalte noch nachzutragen.

### Entscheidungen des Auftraggebers (gelten weiter)
- **Grafik/3D und Story sind eingefroren** – nur nach ausdrücklicher Freigabe anfassen. (2D-Seiten wie Startseite und Fachseiten sind keine Grafik in diesem Sinn.)
- **Inhalte zuerst.** **Bis Weihnachten geht alles direkt auf `main`**; `/dev` ist zweiter Spielstand. Russische Entwürfe auch auf der Hauptseite.
- **Für alle Grundschulkinder in Deutschland gleich:** Wo Schulen oder Länder verschieden vorgehen, **Eltern-Einstellung mit sinnvollem Standard**
  (bisher: Subtraktionsverfahren, Englisch-Beginn). Länderspezifisches (Heimatkunde) über das Feld `land`.
- **In größeren Schritten arbeiten:** mehrere Pakete bündeln, dann einmal gesamt testen und pushen.
- Kl.-3/4-Inhalte bleiben **ab der Klasse davor** sichtbar (Werkstatt, Sachthemen, Englisch).

### Bekannte Baustellen
- **Deutsch ist am schwächsten** (3 von 15 gut): kein freies Schreiben, kein eigenes Sprechen/Aufnehmen, keine Handschrift-Übung, kaum Gedichte/Bilderbücher.
- Englisch: Shopping, Trip, Wochentage, Uhrzeit, Zahlen bis 100, keine Lernkartei.
- Nur russische Übersetzungs-Entwürfe; Ukrainisch u. a. fehlen. Ton über die Gerätestimme (echte Aufnahmen NA-43 offen).
- Länderprofile außer Sachsen fehlen (NA-47); Heimat-Themen für andere Länder fehlen.
- Grafik eingefroren mit offenen Paketen NA-29b (Handy-Leistung) und NA-29 Teil 2.
- **Insel-Tests (`tutorial`, `prolog`) wackeln, wenn parallel andere Browser-Tests laufen** – allein laufen lassen; einmal gescheitert heißt nicht kaputt.

### Offene Fragen an den Auftraggeber
- **iPad-10-Test** (in /dev) der Pakete vom 27.10.: Werkstatt „Ordnen“/„Verbessern“, Mathe Kl. 3/4 inkl. Urkunde und „9 kg = 9000 g“, Bildaufgaben im
  Hochformat, Übergang 5, Englisch (spricht das iPad englisch?), Startseite mit Englisch-Tür, Sachthemen „Ich werde größer“ und „Unser Bundesland Sachsen“.
- **Lehrplan Mathe Sachsen 2025 als PDF hochladen?** Dann lassen sich Kl. 4 „Größen und Messen“ und „Daten und Zufall“ genau nachtragen.
- Für Deutsch: Darf das Kind **die eigene Stimme aufnehmen** (bleibt nur auf dem Gerät, Eltern können anhören)? Soll **freies Schreiben** über die
  Bildschirmtastatur laufen (die App prüft nur einfache Regeln, keine KI)?
- Weihnachtsgeschenke (NA-16), Muttersprachlerinnen für ru/uk, Silbenfarben der Schule.

## 2. Nächste Pakete (Vorschlag, nach Rückmeldung anpassen)
Ablauf: Fragerunde, dann in größeren Schritten bauen, testen, pushen – siehe `CLAUDE.md`, Abschnitt 3.

**Schritt D1 – Deutsch schreiben und sprechen (L, größte Lücke):**
1. Neuer Werkstatt-Schritt-Typ **`schreiben`**: Kind schreibt 1–3 Sätze zu einem Bild oder einer Bildergeschichte (Bildschirmtastatur). Die App
   prüft nur Einfaches ohne KI: Satzanfang groß, Satzzeichen am Ende, Pflichtwörter aus einer Liste, Mindestlänge; freundliche Hinweise statt „falsch“.
   Texte bleiben auf dem Gerät; Eltern sehen sie im Elternbereich. Kapitel: Bildergeschichte (Kl. 2/3), Einladung schreiben (Kl. 2), Buchtipp/Meinung (Kl. 4).
2. Neuer Schritt-Typ **`aufnehmen`** (nur nach Zustimmung des Auftraggebers): Gedicht vortragen, nacherzählen, Vortrag üben – Aufnahme mit
   `MediaRecorder`, nur in der eigenen IndexedDB, nie hochgeladen, Kind kann sich anhören, Eltern auch. Ohne Mikrofon-Erlaubnis still überspringen.
3. Gedichte und Reime (eigene Texte oder gemeinfreie nacherzählt), Kl. 1/2 „Sich mit Texten auseinandersetzen“.
4. Tests mit echtem Tippen (Playwright `fill`) und mit einem Fake-Mikrofon (`--use-fake-device-for-media-stream`); Sachsen Deutsch nachziehen.

**Schritt E2 – Englisch Teil 2 (M):** Lektionen „Let's go shopping“ (Zahlen bis 100, Preise in Pfund) und „Let's go on a trip“ (Verkehrsmittel,
London), Wochentage/Uhrzeit in „At school“ ergänzen, Englisch-Wörter in die Lernkartei (fällige Wörter am Lektionsanfang wiederholen).

**Schritt M3 – Mathe Kl. 4 Raum und Form (M):** Vierecke ordnen (Quadrat, Rechteck, Raute, Trapez, Drachen), Schrägbilder lesen, Volumen mit
Einheitswürfeln, Figuren vergrößern. Danach – wenn der Lehrplan als PDF vorliegt – Kl. 4 „Größen und Messen“ und „Daten und Zufall“ nachtragen.
**Neue Stationen immer ans Ende eines Wegs hängen.**

**Schritt D – Länder (M):** NA-47 zweites Länderprofil (z. B. NRW oder Berlin/Brandenburg – nur Lernbereiche und Zuordnung zu `lz`, keine
Lehrplantexte), Heimat-Thema für dieses Land über `land`.

**Grafik/Story (nur nach Freigabe):** NA-29b Handy-Leistung, NA-29 Teil 2, NA-16 QR-Geschenk → NA-17 Kapitel 1–2 → NA-18 Chronik im Album.
