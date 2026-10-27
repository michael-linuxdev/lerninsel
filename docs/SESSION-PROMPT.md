# Prompt für die nächste Arbeitssitzung (Lerninsel)

Diesen Text als erste Nachricht in eine neue Sitzung kopieren – **in Claude Code oder in einer Claude-Sitzung mit Shell und Git, auch in einem
anderen Konto**. Voraussetzung: Lese- und Schreibzugriff auf das GitHub-Repo `michael-linuxdev/lerninsel` (GitHub in den Claude-Einstellungen
unter „Connectors“ verbinden; ohne Schreibzugriff kann die Sitzung nicht pushen).

---

Du arbeitest an der **Lerninsel** (Offline-Lern-App für Grundschulkinder, Repo `michael-linuxdev/lerninsel`, Branch `main`). Antworte auf **Deutsch**.

**Zuerst:** Falls das Repo noch nicht da ist, `git clone https://github.com/michael-linuxdev/lerninsel` (bzw. das Repo der Sitzung hinzufügen).
Dann **`CLAUDE.md` im Repo-Stamm vollständig lesen und befolgen** – dort stehen Einrichtung, Arbeitsweise, Regeln, Bauen, Testen und die
Kurzreferenz der Datenformate (in Claude Code ist sie schon geladen). Diese Nachricht enthält nur, was sich seit der letzten Sitzung geändert hat.

## 1. Stand (28.10.2026, früh)
### Was es gibt (Inhalte)
- **Mathe (Biber Benno):** fünf Wege, je Station 10 Aufgaben, Lernkartei, Einstufung (Kl. 2), Eltern-Wahl der Subtraktion (Abziehen/Ergänzen).
  **Kl. 1/Vorschule 22** · **Kl. 2 45** (Freischalten je Lernbereich) · **Kl. 3 35** (u. a. schriftlich plus/minus, Würfelnetze, Würfelgebäude, Spiegeln, Diagramme, Glücksrad) ·
  **Kl. 4 26** (Zahlen bis 1 Mio., schriftlich mal/geteilt, auch mehrstellig, Teilbarkeit 2/3/4/5/6/9/10/100, Primzahlen, römische Zahlen, Maßstab,
  Zeit/Datum, Liter, Flächen, Chancen) · **Übergang 5** 16 (vorläufig ohne Kl.-5-Lehrplantext; Brüche, große Zahlen, Teiler, Terme, Flächen/Volumen, Kommazahlen, Klammern, Koordinaten, Winkel, Durchschnitt). Urkunden am Ende von Kl. 4 und Übergang 5.
- **Deutsch:** Fipsis Abenteuer (5 Kapitel), Lesen und Schreiben (Anlaute, Silben, 20 Lesetexte, Nachspuren, Wörter legen), DaZ „Ankommen“,
  **Wörter-Werkstatt 35 Kapitel** (Kl. 1–2: 7, Kl. 3–4: 26 inkl. Geschichte ordnen, Satzanfänge, Brief, Bericht, Wörterbuch, Vortrag; Übergang 5:
  Fachbegriffe, Lesestrategien). Schritt-Typen u. a. `ordnen`, `verbessern`, **`schreiben`** (frei schreiben, einfache Prüfung ohne KI) und
  **`aufnehmen`** (sich selbst aufnehmen, nur mit Eltern-Schalter). Neu: Reime und Gedichte, Einladung, Bildergeschichte, Gedicht vortragen, Buchtipp.
  Eigene Texte und Aufnahmen liegen in einer eigenen IndexedDB (`shared/eigenes.js`), Eltern lesen/hören sie im Elternbereich.
- **Sachunterricht (Eule Ella): 32 Themen**, u. a. Wasser, Wetterkarte, Strom, Wärme, Gewässer, Experiment, Erste Hilfe, Medien, Herz und Lunge,
  Pubertät („Ich werde größer“), Nein sagen, Lernen lernen, Neue Schule, **„Unser Bundesland Sachsen“ (nur für Kinder aus Sachsen, Feld `land`)**.
- **Englisch (Papagei Paula): 13 Lektionen** (Kl. 3: Hello, Colours, Numbers, Animals, Body, Food, At home, Around the year; Kl. 4: Family, School,
  Clothes, Weather; Übergang 5: Hobbies). Englische Gerätestimme, ohne Stimme Lesen statt Hören. Eltern-Einstellung Beginn ab Kl. 1 oder 3.
- Weiter: Medien (Tablet-Führerschein), Gefühle, Atelier (Malen, Musik), Schach, Insel in zwei Looks, Story/Tutorial E1–E8, Können je Lernziel, Elternbericht.

### Lehrplan Sachsen (Einschätzung von Hand, `shared/lehrplan/laender/sachsen.js`)
- **Mathe und Deutsch nach Fassung 2025** (in Kraft seit 1.8.2025), Sachunterricht und Englisch nach Fassung 2019.
- **✅ MATHE GRUNDSCHULE VOLLSTÄNDIG:** jeder Inhaltspunkt Kl. 1–4 (120) in der App geübt (110) oder als draußen/Papier markiert (10); alle 12 Lernbereiche „gut“.
- **Mathe, Deutsch, Sachunterricht (Kl. 1–4, 45 Lernbereiche): 25 × gut, 20 × teilweise, 0 × fehlt.** Mathe 12/0/0, Deutsch 3/12/0, SU 10/8/0.
- Inhaltspunkte in `sachsen-punkte.js`: Kl. 1/2 54, Kl. 3 34, Kl. 4 32 (alle geübt oder draußen/Papier), dazu 15 Übergangs-Punkte (vorläufig, ohne Lehrplantext Kl. 5).
- **Englisch (Kl. 3–4, 20 Lernbereiche): 2 × gut, 14 × teilweise, 4 × fehlt** (Let's go shopping, Let's go on a trip, je Kl. 3 und 4).

### Entscheidungen des Auftraggebers (gelten weiter)
- **Grafik/3D und Story sind eingefroren** – nur nach ausdrücklicher Freigabe anfassen. (2D-Seiten wie Startseite und Fachseiten sind keine Grafik in diesem Sinn.)
- **Inhalte zuerst.** **Bis Weihnachten geht alles direkt auf `main`**; `/dev` ist zweiter Spielstand. Russische Entwürfe auch auf der Hauptseite.
- **Für alle Grundschulkinder in Deutschland gleich:** Wo Schulen oder Länder verschieden vorgehen, **Eltern-Einstellung mit sinnvollem Standard**
  (bisher: Subtraktionsverfahren, Englisch-Beginn). Länderspezifisches (Heimatkunde) über das Feld `land`.
- **In größeren Schritten arbeiten:** mehrere Pakete bündeln, dann einmal gesamt testen und pushen.
- Kl.-3/4-Inhalte bleiben **ab der Klasse davor** sichtbar (Werkstatt, Sachthemen, Englisch).

### Bekannte Baustellen
- **Deutsch ist am schwächsten** (3 von 15 gut): freies Schreiben und Aufnehmen gibt es jetzt (D1), es fehlen Handschrift-Übung (Schulausgangsschrift),
  Rechtschreibhilfe für eigene Texte, Gespräche, Bilderbücher; Kinder sehen ihre eigenen Texte noch nicht selbst.
- Englisch: Shopping, Trip, Wochentage, Uhrzeit, Zahlen bis 100, keine Lernkartei.
- Nur russische Übersetzungs-Entwürfe; Ukrainisch u. a. fehlen. Ton über die Gerätestimme (echte Aufnahmen NA-43 offen).
- Länderprofile außer Sachsen fehlen (NA-47); Heimat-Themen für andere Länder fehlen.
- Grafik eingefroren mit offenen Paketen NA-29b (Handy-Leistung) und NA-29 Teil 2.
- **Insel-Tests (`tutorial`, `prolog`) wackeln, wenn parallel andere Browser-Tests laufen** – allein laufen lassen; einmal gescheitert heißt nicht kaputt.

### Offene Fragen an den Auftraggeber
- **iPad-10-Test** (in /dev) der Pakete vom 27.10.: **Matheweg Kl. 2 (neue Stationen 24–40), Kl. 3 (21–30), Kl. 4 (16–23), Freischalten je Lernbereich, Elternbereich „Was übt die App?“ aufklappen**, **Werkstatt „Bildergeschichte schreiben“ (Tastatur, Hinweise), Aufnehmen (erst im Elternbereich
  einschalten, dann „Reime und Gedichte“; fragt Safari nach dem Mikrofon? Klingt die Aufnahme?)**, Werkstatt „Ordnen“/„Verbessern“, Mathe Kl. 3/4 inkl. Urkunde und „9 kg = 9000 g“, Bildaufgaben im
  Hochformat, Übergang 5, Englisch (spricht das iPad englisch?), Startseite mit Englisch-Tür, Sachthemen „Ich werde größer“ und „Unser Bundesland Sachsen“.
- **Lehrplan-PDFs Mathematik Klasse 5 (Oberschule und Gymnasium)** für einen genauen Übergang 5.
- **Lehrplan-PDFs Kl. 1/2 für Deutsch (2025), Sachunterricht (2019), Kunst, Musik, Werken, Sport, Ethik hochladen** (Mathe 2025 liegt vor und ist für Kl. 1/2 und Kl. 4 eingearbeitet).
- Deutsch: Sollen Kinder ihre eigenen Texte selbst wiederfinden („Mein Heft“)? Handschrift-Übung mit Finger/Stift (Schulausgangsschrift oder
  Vereinfachte Ausgangsschrift – je nach Schule als Eltern-Einstellung)?
- Weihnachtsgeschenke (NA-16), Muttersprachlerinnen für ru/uk, Silbenfarben der Schule.

## 2. Nächste Pakete – NEUE AUSRICHTUNG: Lehrplan Sachsen in voller Tiefe (Entscheidung 27.10.2026)
**Arbeitsliste: `docs/SACHSEN-SCHULJAHR.md` – zuerst lesen.** Zuerst **Klasse 2**, dann **Klasse 3**, alle Fächer, Maßstab „wie ein Schuljahr“
(jeder Inhaltspunkt geübt, Reihenfolge wie im Schuljahr, Wiederholung, Lernstands-Prüfung je Lernbereich – ohne Fristen und Noten).
Ablauf: Fragerunde, dann in größeren Schritten bauen, testen, pushen – siehe `CLAUDE.md`, Abschnitt 3.

1. **Mathe Grundschule ist vollständig** (Kl. 1–4, 66 neue Stationen in dieser Ausrichtung). Übergang 5 bleibt vorläufig (Auftraggeber:
   „überspringen“). Nächstes Fach nach Wahl des Auftraggebers – für Deutsch/Sachunterricht/Musisches fehlen noch die PDFs.
   **Für Deutsch, Sachunterricht, Kunst, Musik, Werken, Sport, Ethik Kl. 1/2 fehlen die PDFs** – zuerst danach fragen; dann je Fach Punkte
   in `sachsen-punkte.js` und Lücken schließen.
2. **Schuljahres-Gerüst** (für alle Fächer): Pfad je Fach, Eltern-Einstellung „gerade in der Schule“, „Zeig, was du kannst“ je
   Lernbereich, Elternbericht je Punkt.
3. **Lücken Kl. 2 schließen** je Fach (Mathe → Deutsch → Sachunterricht → Kunst/Musik → Werken/Sport/Ethik → Englisch Kl. 1/2).
4. Danach **Klasse 3** nach demselben Muster.

Zurückgestellt (nur wenn der Auftraggeber es will): D2 „Mein Heft“, E2 Englisch Teil 2, M3 Mathe Kl. 4, Länderprofil 2,
Grafik/Story (eingefroren).
