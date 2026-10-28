# Prompt für die nächste Arbeitssitzung (Lerninsel)

Diesen Text als erste Nachricht in eine neue Sitzung kopieren – **in Claude Code oder in einer Claude-Sitzung mit Shell und Git, auch in einem
anderen Konto**. Voraussetzung: Lese- und Schreibzugriff auf das GitHub-Repo `michael-linuxdev/lerninsel` (GitHub in den Claude-Einstellungen
unter „Connectors“ verbinden; ohne Schreibzugriff kann die Sitzung nicht pushen).

---

Du arbeitest an der **Lerninsel** (Offline-Lern-App für Grundschulkinder, Repo `michael-linuxdev/lerninsel`, Branch `main`). Antworte auf **Deutsch**.

**Zuerst:** Falls das Repo noch nicht da ist, `git clone https://github.com/michael-linuxdev/lerninsel` (bzw. das Repo der Sitzung hinzufügen).
Dann **`CLAUDE.md` im Repo-Stamm vollständig lesen und befolgen** – dort stehen Einrichtung, Arbeitsweise, Regeln, Bauen, Testen und die
Kurzreferenz der Datenformate (in Claude Code ist sie schon geladen). Diese Nachricht enthält nur, was sich seit der letzten Sitzung geändert hat.

## 1. Stand (29.10.2026)
### Was es gibt (Inhalte)
- **Mathe (Biber Benno):** fünf Wege, je Station 10 Aufgaben, Lernkartei, Einstufung (Kl. 2), Eltern-Wahl der Subtraktion (Abziehen/Ergänzen).
  **Kl. 1/Vorschule 22** · **Kl. 2 45** · **Kl. 3 35** · **Kl. 4 26** · **Übergang 5** 16 (vorläufig). Freischalten je Lernbereich, Lernbereichs-Kacheln
  mit „Zeig, was du kannst“, Eltern-Einstellung „gerade in der Schule“. Urkunden am Ende von Kl. 4 und Übergang 5.
- **Deutsch:** Fipsis Abenteuer (5 Kapitel), Lesen und Schreiben (Anlaute, Silben, 20 Lesetexte, Nachspuren, Wörter legen), DaZ „Ankommen“,
  **Wörter-Werkstatt 88 Kapitel, nach den fünf Lernbereichen gruppiert** (Sprechen und Zuhören, Schreiben, Lesen, Texte und Medien, Sprache
  untersuchen; Kapitel früherer Klassen eingeklappt). Schritt-Typen u. a. `ordnen`, `verbessern`, `schreiben` (frei, einfache Prüfung ohne KI,
  `liste: true` für Zettel/Elfchen), `aufnehmen` (nur mit Eltern-Schalter), **`hoertext`** (Zuhören) und **`blitz`** (Blitzlesen).
- **Sachunterricht (Eule Ella): 61 Themen, nach sechs Lernbereichen gruppiert**, u. a. Mein Körper gehört mir, Licht und Schatten, Luft und Schall,
  Wetter, Wasserkreislauf, Karten lesen, Waldtiere, Boden, Radfahrprüfung; Heimatkunde nur für Sachsen (`land: "sn"`): Unser Bundesland
  Sachsen, Mein Landkreis, Sachsen entdecken.
- **Englisch (Papagei Paula): 27 Lektionen, nach den 11 Lernbereichen gruppiert** (u. a. neu: Gefühle, Zahlen bis 100, Einkaufen, Fächer/Tage/Uhrzeit, Ausflug, London, Café, Zootiere,
  Feste und Datum, Sportarten, Sprachenpass). Englische Gerätestimme, ohne Stimme Lesen statt Hören. Eltern-Einstellung Beginn ab Kl. 1 oder 3.
- **Kunst, Musik, Werken, Sport, Ethik (Eule Ella): 70 Wissens-Themen** auf der Sachunterricht-Seite mit Reitern (`?fach=kunst|musik|werken|sport|ethik`),
  je Fach nach Lernbereichen gruppiert, „Zeig, was du kannst“; Praktisches (Malen, Singen, Bauen, Turnen, Schwimmen) als Echte-Welt-Aufgaben.
- **Religion (ev./kath.): 37 Themen** nach den sächsischen Lehrplänen, Reiter „Religion“ nur nach Eltern-Wahl (`eltern.ethik.unterricht`).
- **Sorbisch (Obersorbisch, Papagei Paula): 23 Lektionen** nur nach Eltern-Wahl (`eltern.sorbisch.an`); alle Wörter sind Entwürfe, stehen aber seit 29.10. auch auf der
  Hauptseite (Entscheidung „vollständig nach main“, `ENTWURF_FREI` mit `hsb`); Prüfstand in `spiele/sorbisch/geprueft.js`. Prüfliste `spiele/sorbisch/pruefen.html`. Keine sorbische Stimme: nur Lesen.
- Weiter: Medien (Tablet-Führerschein), Gefühle, Atelier (Malen, Musik), Schach, Insel in zwei Looks, Story/Tutorial E1–E8, Können je Lernziel, Elternbericht.

### Lehrplan Sachsen (`shared/lehrplan/laender/sachsen.js` + Inhaltspunkte in `sachsen-punkte.js`)
- **Mathe und Deutsch nach Fassung 2025**, Sachunterricht, Englisch, Kunst, Musik, Werken, Sport nach Fassung 2019, Ethik 2004/2019 – **alle gegen die PDFs geprüft.**
- **Mathe Grundschule vollständig** (120 Punkte). **Deutsch** 179 Punkte (166 geübt, 7 teilweise, 6 Papier). **Sachunterricht** 99 Pflicht-Punkte
  (94/2/3). **Englisch** 73 Punkte (65/5/3).
- **Lernbereiche Mathe, Deutsch, SU (45): 37 gut, 8 teilweise, 0 fehlt** (Mathe 12/0, Deutsch 9/6, SU 16/2). **Englisch (22, mit „My Portfolio“): 17/5/0.**
- **Kunst 45 Punkte (32/1/12 draußen), Musik 48 (34/3/11), Werken 34 (24/1/9), Sport 42 (14/0/28), Ethik 43 (43/0/0). Sorbisch 47 (26/14/7, nur mit Wahl).** Lernbereiche, die vor allem
  nach draußen gehören, zeigen 🌍 (`abdeckung: "aussen"`, nur in den neuen Fächern).
- „Teilweise“ heißt ehrlich: braucht einen Menschen oder ein Werkzeug, das die App nicht hat (Lautlesen mit Rückmeldung, Formatieren am Gerät,
  Präsentationen/Podcasts, Lieder zum Mitsingen, eigener Landkreis, englische Kinderbücher).

### Entscheidungen des Auftraggebers (gelten weiter)
- **Grafik/3D und Story sind eingefroren** – nur nach ausdrücklicher Freigabe anfassen. (2D-Seiten wie Startseite und Fachseiten sind keine Grafik in diesem Sinn.)
- **Inhalte zuerst.** **Bis Weihnachten geht alles direkt auf `main`**; `/dev` ist zweiter Spielstand. Russische Entwürfe auch auf der Hauptseite, seit 29.10. auch die sorbischen (der Entwicklungsstand kommt vollständig nach main).
- **Für alle Grundschulkinder in Deutschland gleich:** Wo Schulen oder Länder verschieden vorgehen, **Eltern-Einstellung mit sinnvollem Standard**
  (bisher: Subtraktionsverfahren, Englisch-Beginn). Länderspezifisches (Heimatkunde) über das Feld `land`.
- **In größeren Schritten arbeiten:** mehrere Pakete bündeln, dann einmal gesamt testen und pushen.
- Kl.-3/4-Inhalte bleiben **ab der Klasse davor** sichtbar (Werkstatt, Sachthemen, Englisch).

### Bekannte Baustellen
- **Schuljahres-Gerüst** („Zeig, was du kannst“, „gerade in der Schule“) gibt es jetzt für alle vier Fächer (Mathe, Deutsch, SU, Englisch).
- Kinder sehen ihre eigenen Texte noch nicht selbst („Mein Heft“); Handschrift-Übung fehlt (nur Echte Welt).
- Englisch ohne Lernkartei; Lieder/Reime zum Mitsingen fehlen.
- Satz-Bauen/Ordnen werten jetzt den Wortlaut (doppelte Wörter austauschbar) – war vorher ein stiller Fehler in Englisch.
- Nur russische Übersetzungs-Entwürfe (alle neuen Kapitel/Themen/Lektionen haben ru-Entwürfe); Ukrainisch u. a. fehlen. Ton über die Gerätestimme.
- Länderprofile außer Sachsen fehlen (NA-47); Heimat-Themen für andere Länder fehlen.
- Grafik eingefroren mit offenen Paketen NA-29b (Handy-Leistung) und NA-29 Teil 2.
- **Insel-Tests (`tutorial`, `prolog`) wackeln, wenn parallel andere Browser-Tests laufen** – allein laufen lassen; einmal gescheitert heißt nicht kaputt.

### Offene Fragen an den Auftraggeber
- **iPad-10-Test** (in /dev): **Elternbereich → „Deutsch und Sachunterricht wie im Schuljahr“ einstellen, dann in Werkstatt und bei Eule Ella
  „Zeig, was du kannst“ ausprobieren**; **Deutsch-Werkstatt** (Gruppen nach Lernbereichen, „Wiederholen aus früheren Klassen“ aufklappen, „Gut zuhören“ –
  liest das iPad den Text vor?, „Blitzwörter“ – ist das Aufblitzen gut lesbar?, „Ein Elfchen dichten“), **Sachunterricht** (Gruppen, „Mein Körper
  gehört mir“ – ist der Ton so recht?, „Licht und Schatten“, „Sachsen entdecken“), **Englisch** (neue Lektionen, z. B. „London“, „Café“),
  dazu weiter offen: Matheweg-Kacheln und „Zeig, was du kannst“, Aufnehmen mit Eltern-Schalter.
- **Neue Fächer ansehen** (in /dev): Eule Ella → Reiter Kunst/Musik/Werken/Sport/Ethik; passt der Ton bei Ethik (Religionen, Geheimnisse, Abschied)?
  Elternbereich → „Wie im Schuljahr: gerade in der Schule“ (alle Fächer, dazu „Mein Kind hat in der Schule: Ethik/Ev./Kath. Religion“).
- **Sorbisch prüfen lassen:** Prüferin/Prüfer öffnet `…/spiele/sorbisch/pruefen.html` (oder Elternbereich → Sorbisch → Prüfliste), hakt ab,
  korrigiert und schickt den Text zurück → Korrekturen in `spiele/sorbisch/lektionen.js`, geprüfte IDs in `geprueft.js` eintragen. Optional **Mathematik Klasse 5 (Oberschule/Gymnasium)** als PDF.
- Deutsch: Sollen Kinder ihre eigenen Texte selbst wiederfinden („Mein Heft“)? Handschrift-Übung mit Finger/Stift (Schulausgangsschrift oder
  Vereinfachte Ausgangsschrift – je nach Schule als Eltern-Einstellung)?
- Weihnachtsgeschenke (NA-16), Muttersprachlerinnen für ru/uk, Silbenfarben der Schule.

## 2. Nächste Pakete – Lehrplan Sachsen in voller Tiefe (Entscheidung 27.10.2026)
**Arbeitsliste: `docs/SACHSEN-SCHULJAHR.md` – zuerst lesen.** Maßstab „wie ein Schuljahr“ (jeder Inhaltspunkt geübt, Reihenfolge wie im Schuljahr,
Wiederholung, Lernstands-Prüfung je Lernbereich – ohne Fristen und Noten). Ablauf: Fragerunde, dann in größeren Schritten bauen, testen, pushen.

1. **Mathe, Deutsch, Sachunterricht und Englisch sind gegen die Lehrpläne geprüft und ausgebaut** (Stand 28.10.). Rest ehrlich „teilweise“
   (siehe oben).
2. **Schuljahres-Gerüst für Deutsch, SU und Englisch ist fertig** (28.10. mittags, Test `schuljahr2`). Werkstatt, Sachthemen und Englisch-Lektionen
   sind nach Lernbereichen gruppiert.
3. **Kunst, Musik, Werken, Sport, Ethik sind gegen die Lehrpläne geprüft** (28.10. nachmittags, Test `faechervoll`), „gerade in der Schule“ und die
   Eltern-Wahl Ethik/Religion gibt es seit 28.10. abends. Religion (ev./kath.) ist seit 28.10. spätabends eingearbeitet. Sorbisch (Fremdsprache) ist seit 28.10. nachts als Eltern-Wahl da (wartet auf Prüfung). Offen: Melodien wiedererkennen und Lieder zum Mitsingen im Atelier, Bilder bearbeiten, Programmieren (Werken Kl. 4).
4. Vorschläge an den Auftraggeber: „Mein Heft“ (eigene Texte), Handschrift-Übung, Englisch-Lernkartei, Lieder/Reime.

Zurückgestellt (nur wenn der Auftraggeber es will): D2 „Mein Heft“, E2 Englisch Teil 2, M3 Mathe Kl. 4, Länderprofil 2,
Grafik/Story (eingefroren).
