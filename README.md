# Lerninsel – erst lernen, dann spielen

> Arbeitsanweisungen für Claude: `CLAUDE.md` (dauerhaft) und `docs/SESSION-PROMPT.md` (aktueller Stand und nächste Pakete).

Offline-Lern-App für Tablets (iPad / Android) für Kinder von der Vorschule bis zum Übergang in Klasse 5, auch für Kinder mit
anderer Muttersprache (zuerst Russisch). Reines HTML/CSS/JavaScript, three.js für die 3D-Insel, läuft offline,
keine Werbung, keine Käufe, kein Server, keine Daten ins Internet (einzige Ausnahme: Wetter von Open-Meteo ohne GPS).
**Ersteinrichtung immer durch einen Erwachsenen**: PIN, Vorname, Geburtsdatum bzw. Alter, Klasse, Bundesland, Ansprache und Hilfesprache
werden im Elternbereich festgelegt und bleiben nur auf dem Tablet. Online unter lerninsel.micana.de (`/dev` = neue Funktionen, `/dev/test` = Testmodus).

**Konzept: [`docs/KONZEPT.md`](docs/KONZEPT.md) · Gesamtplan: [`docs/PLAN.md`](docs/PLAN.md) · Lehrplan Sachsen als Schuljahr:
[`docs/SACHSEN-SCHULJAHR.md`](docs/SACHSEN-SCHULJAHR.md) · Prompt für Arbeitssitzungen: [`docs/SESSION-PROMPT.md`](docs/SESSION-PROMPT.md)**

## Was schon da ist (Stand 30.10.2026)

**Lernen – nach dem Lehrplan Sachsen** (Mathe und Deutsch Fassung 2025, die anderen Fächer 2019; alle Inhaltspunkte zugeordnet, ehrlich „teilweise“, wo Stimme,
Papier oder ein Mensch fehlt; Übersicht im Elternbereich „Was übt die App?“):
- **Mathe mit Biber Benno:** fünf Matheweg-Wege – Kl. 1/Vorschule (22 Stationen), Kl. 2 (45), Kl. 3 (35), Kl. 4 (26, Urkunde), Übergang 5 nach den
  Lehrplänen Oberschule/Gymnasium (26, Urkunde). Runden à 10 Aufgaben, Rechenwege, Lernkartei, Einstufung, Freischalten je Lernbereich, Eltern-Wahl der Subtraktion.
- **Deutsch:** Fipsis Abenteuer, Lesen und Schreiben (Anlaute, Silben, Lesetexte, Nachspuren, Wörter legen, Schulausgangsschrift), DaZ „Ankommen“,
  **Wörter-Werkstatt** (88 Kapitel nach den fünf Lernbereichen, mit freiem Schreiben und Aufnehmen nach Eltern-Erlaubnis), Mein Heft, Vorlesen und Lesetheater,
  Schreiben und Präsentieren (Gestalten, Rechtschreibprüfung, Folien, Podcast, Wiki).
- **Sachunterricht mit Eule Ella:** 61 Themen nach sechs Lernbereichen, Heimatkunde und Landkreise Sachsens.
- **Kunst, Musik, Werken, Sport, Ethik** (70 Themen) und **Religion** ev./kath. (37 Themen, nach Eltern-Wahl); Praktisches als Echte-Welt-Aufgaben.
- **Englisch mit Papagei Paula:** 31 Lektionen (Bilderbuch, Sachtext, Rollenspiel, Lieder), ab Kl. 3 oder nach Eltern-Wahl ab Kl. 1.
- **Sorbisch** (nach Eltern-Wahl): 47 Lektionen als Fremdsprache, 25 als Muttersprache; Entwürfe mit Prüfliste.
- **Vorschul-Rucksack** (16 Bilder-Spiele nach dem Sächsischen Bildungsplan) mit eigener Vorschul-Startseite.
- **Tablet-Führerschein**, **Robo programmieren** (ab Kl. 3), Gefühle, Atelier (Malen, Musik, Ohren-Rätsel, Mitsingen), Schach, Kopfrechen-Duell.
- **Wie im Schuljahr:** „gerade in der Schule“ je Fach (Eltern), „Zeig, was du kannst“ je Lernbereich, Können je Lernziel mit Empfehlungen,
  „Heute für dich“ auf der Startseite, Tagesaufgaben je Klasse.

**Insel und Story:**
- **Meine Insel (3D, Look „Rund“):** Zimmer zum Einrichten, Kleiderschrank (Mädchen- und Jungen-Teile), eigenes Tier, Nachbarn führen zu den Fächern,
  echtes Wetter, Tag/Nacht, Jahreszeiten, Grafikstufe „einfach“/„schön“ (kleine Geräte automatisch „einfach“).
- **Story „Die Insel erwacht“:** Prolog, Tutorial-Etappen E1–E9, Kapitel 1 „Der Spross“ und Kapitel 2 „Fipsis Karte“, Weihnachts-Sonderstart,
  Inselchronik im Stickeralbum, Geburtstagspaket am Steg, QR-Geschenke (signiert, Technik fertig – Schlüssel des Auftraggebers fehlt noch).
- Die fünf alten Minispiele sind ausgeblendet und werden durch neue 3D-Spiele ersetzt (Insel-Garten, Bäckerei Benno, Tierpflege-Station).

**Für die Familie:**
- **Erst lernen, dann spielen:** Spielzeit nach Lernzeit oder Aufgaben (Standard nach Alter und DGKJ), Ruhezeit, Fokus-Hilfen; Ferien Sachsen
  mit Ferien-Modus (halbe Lernzeit nur mit Eltern-Erlaubnis).
- **Elternbereich (PIN)** mit Reitern: Überblick, Lernstand, Wie in der Schule, Zeit & Regeln, Kinder & Gerät; Schuljahreswechsel zum 1. August mit
  Bestätigung (Wiederholen still, Überspringen mit Lücken-Check), Geburtsdatum, Vorlesen nur auf Knopfdruck (Schalter für automatisch).
- **Mehrere Kinder pro Tablet**, Spielstand doppelt gesichert (localStorage + IndexedDB), Übertragen per Datei oder QR-Code.
- **Hilfesprachen:** Russisch (Entwürfe, siehe `docs/SPRACHEN.md`), weitere vorbereitet. Vorlesen über die Gerätestimme, nur nach Antippen von 🔊.

## Geplant (Kurzfassung, Details in docs/PLAN.md und docs/SESSION-PROMPT.md)

1. Neue Insel-Spiele in 3D: **Insel-Garten** → **Bäckerei Benno** (öffnet Kapitel 3) → **Tierpflege-Station**, Schwierigkeit nach Alter.
2. Schach, Kopfrechen-Duell, Gefühle und Atelier verbessern.
3. Altersgerechte Erfahrung Teil 2: Ton und Story nach Alter, Lesestärke je Klasse.
4. Offen beim Auftraggeber: iPad-10-Test, Schlüssel und Auswahl für QR-Geschenke, Ferientermine prüfen (hinterlegt bis Sommer 2030), Sorbisch-Prüfung.
5. Später: Länderprofile außer Sachsen, weitere Hilfesprachen, weitere Kapitel.

## Aufbau

```
index.html              Startseite (eigene Vorschul-Ansicht)
shared/config.js        Name-Vorschlag und Modus dieser Spielwelt
shared/core.js          Profil, Sterne, Freischaltungen, Töne, Geburtsdatum, Schuljahr und Ferien Sachsen (für alle Seiten)
shared/ereignisse.js    Insel-Ereignisse und Story-Zustand (Kapitel, Etappen, Chronik, Geschenke)
shared/szene.js         Szenen-Baustein: Sprechblasen-Folgen für Story und Tutorial (🔊 Vorlesen, Hilfesprache, Zeigehand)
shared/szenen.js        Texte der Story- und Tutorial-Szenen
shared/zeige.js         Zeigehand und Leuchten auf Knöpfe oder 3D-Punkte
shared/einrichten.js    Zimmer einrichten (Laden für Möbel und Wandfarben)
shared/insel-kern.js    Insel-Kern: Welt, Orte, Nachbarn, Stationen, Story-Auswahl (Etappen, Kapitel), Pakete, Zimmer-Daten, Wetter
shared/geschenk.js      QR-Geschenke: signierte Codes prüfen und einlösen (Generator: quellen/geschenk-erzeugen.js, Schlüssel nie im Repo)
shared/sprache.js       Vorlesen mit den Stimmen des Geräts (nur auf Knopfdruck)
shared/charakter.js     Fähigkeiten, Stufen, Belohnungen, Tagesaufgaben je Klasse, Kalender
shared/zeit.js          Erst lernen, dann spielen (Lern- und Spielzeit, Ruhezeit, Ferien)
shared/koennen.js       Können je Lernziel und Empfehlungen
shared/lernkartei.js    Lernkartei (Mathe, Deutsch, Lesen, Englisch, Sorbisch, Sachfächer)
shared/eigenes.js       eigene Texte und Aufnahmen (eigene IndexedDB, nie im Spielstand)
shared/lieder.js        Lieder und Reime zum Mitsingen
shared/woerter.js       Wortschatz (aus inhalte/woerter/*.js)
shared/tiere.js, tierpflege.js  Haustier (Zeichnungen, Pflege)
shared/lehrplan/        Lehrplan-Kern (kern.js) und Länderprofile (laender/sachsen.js, sachsen-punkte.js = Inhaltspunkte)
shared/lehrplan.js, inhalte.js  errechnete Abdeckung, Inhalte-Verzeichnis
shared/style.css        Farben, Schrift, Knöpfe, gemeinsamer Gruppen-Stil der Fachseiten
spiele/mathe/           Matheweg (aufgaben.js = Stationen und Aufgaben, mathe.js = Wege und Runden)
spiele/deutsch/         Fipsis Abenteuer und Wörter-Werkstatt (werkstatt.js)
spiele/lesen/           Laute, Silben, Lesetexte, Nachspuren, Schreibschrift
spiele/daz/             „Ankommen“ (Deutsch als Zweitsprache)
spiele/sachkunde/       Sachunterricht (themen.js), weitere Fächer (faecher.js), Religion (religion.js), Landkreise
spiele/englisch/        Englisch (lektionen.js)
spiele/sorbisch/        Sorbisch als Fremdsprache und Muttersprache, Prüfliste
spiele/vorschule/       Vorschul-Rucksack
spiele/heft/, vorlesen/, praesentieren/, robo/  Mein Heft, Vorlesen, Präsentieren, Robo programmieren
spiele/medien/          Tablet-Führerschein
spiele/atelier/, gefuehle/, schach/  Atelier, Gefühle, Schach
spiele/album/           Stickeralbum und Inselchronik
spiele/anziehen/        Kleiderschrank (teile.js, figur.js)
spiele/tier/            Haustier
spiele/ich/             Meine Ecke (Reiter Heute, Meine Woche, Ich kann, Meine Sachen)
spiele/eltern/          Elternbereich mit PIN und Reitern
spiele/welt3d/          3D-Insel (gebaut, nicht von Hand ändern)
quellen/welt3d/         Quellcode der 3D-Insel, quellen/three/ = three.js (MIT); bauen mit quellen/bauen.sh (esbuild)
inhalte/                Wortschatz und Deutsch-Inhalte als Daten
sw.js                   Offline-Speicher
tests/                  Node- und Playwright-Tests (tests/laufen.sh)
docs/                   PLAN, KONZEPT, LEHRPLAN, SACHSEN-SCHULJAHR, SPRACHEN, GRAFIK, MINISPIELE, SESSION-PROMPT
CNAME                   Domain für GitHub Pages
```

Spielstand liegt im Browser des jeweiligen Tablets. Beide Tablets haben getrennte Spielstände;
zum Abgleich den QR-Code nutzen. Damit Android den Speicher nicht aufräumt, die Seite in Chrome über
„Zum Startbildschirm hinzufügen“ bzw. „App installieren“ installieren.

Fremd-Bibliotheken in `shared/vendor/`: QR-Code generator (Project Nayuki, MIT) und jsQR (Apache 2.0).

## Umgebungen und Tests

| Adresse | Zweck |
|---|---|
| `/` | Hauptseite (Prod) |
| `/dev/` | Neue Funktionen zuerst, normale Regeln, eigener Spielstand, kleine Marke „🛠 DEV“ |
| `/dev/test/` | Testmodus: alles freigeschaltet, gelbe Leiste mit „+50 ⭐“ und „Zurücksetzen“, eigener Spielstand |

Vor jedem Push `sh quellen/dev-bauen.sh` ausführen: setzt die Cache-Version automatisch (Prüfsumme aller Dateien)
und baut `/dev` und `/dev/test` neu (die 3D-Insel vorher mit `quellen/bauen.sh` bauen).

**Tests:** `sh tests/laufen.sh` (Node-Tests und Rauchtest über alle Seiten quer und hoch; für /dev: `PFAD=dev/ sh tests/laufen.sh`).
Einzelne Tests: `sh tests/laufen.sh <name>` – die vollständige Liste steht in `CLAUDE.md`, Abschnitt 6.

## Veröffentlichen mit GitHub Pages

1. Dateien ins Repo pushen (Branch `main`)
2. Im Repo: **Settings → Pages → Source: Deploy from a branch → main / root**
3. In der Datei `CNAME` die eigene Domain eintragen und beim DNS-Anbieter einen **CNAME**-Eintrag
   auf `<github-benutzer>.github.io` anlegen
4. In **Settings → Pages** „Enforce HTTPS“ anhaken (sobald das Zertifikat da ist)

Lokal testen: `python3 -m http.server` im Ordner starten und `http://localhost:8000` öffnen.

## Neue Version ausliefern

`quellen/dev-bauen.sh` ausführen und pushen. Die Cache-Version in `sw.js` wird dabei automatisch gesetzt;
die Tablets holen die neuen Dateien beim nächsten Öffnen. Notfalls im Elternbereich „App neu laden“.
