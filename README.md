# Spielwelt – erst lernen, dann spielen

Lern- und Spiele-App für Tablets (iPad / Android) für Grundschulkinder (1.–4. Klasse), auch für Kinder mit
anderer Muttersprache (zuerst Russisch). Reines HTML/CSS/JavaScript, läuft offline,
keine Werbung, keine Käufe, kein Server, keine Daten ins Internet.
**Ersteinrichtung immer durch einen Erwachsenen**: PIN, Vorname, Alter, Klasse, Ansprache und Hilfesprache
werden im Elternbereich festgelegt und bleiben nur auf dem Tablet.

**Konzept: [`docs/KONZEPT.md`](docs/KONZEPT.md) · Gesamtplan: [`docs/PLAN.md`](docs/PLAN.md) · Prompt für Arbeitssitzungen: [`docs/SESSION-PROMPT.md`](docs/SESSION-PROMPT.md)** (Umgebungen, Lehrplan Sachsen, Zeitsystem,
3D-Heimatinsel, Kleiderschrank, Integration/Mehrsprachigkeit, Ideen ohne Server).

## Was schon da ist

- **Startseite (Spielwelt):** begrüßt das Kind mit dem Namen aus der Ersteinrichtung; Sterne-Zähler; Ton an/aus
- **Anziehen:** Figur mit Gesichtern, Hautfarben, 11 Frisuren, Oberteilen, Hosen und Röcken, Kleidern, Schuhen, Extras und Orten; Farben für jedes Teil; Zufall; Fotos im Kleiderschrank speichern und als Bild teilen
- **Mathe 2. Klasse:** Matheweg mit 16 Stationen (Plus/Minus bis 20 und 100, Zehnerübergang, Zehner und Einer,
  Vergleichen, Verdoppeln/Halbieren, Ergänzen, Einmaleins, Geteilt, Geld, Uhr). Runden à 10 Aufgaben, zweite Chance,
  danach Rechenweg; falsche Aufgaben kommen am Ende nochmal. 1–3 Sterne pro Station, die nächste Station öffnet sich
  ab 1 Stern. Sterne gibt es für jede Verbesserung, plus 1 Bonusstern für fehlerfreies Wiederholen
- **Deutsch-Abenteuer:** Fipsi der Fuchs sucht seine Schatzkarte – 5 Kapitel (Wald, Bauernhof, Bäckerei, Strand,
  Schloss) mit Wort-Bild, der/die/das, Lückensätzen, Satzbau, Hören, Mehrzahl und auf/unter/neben/in. Vorlesen über die
  Gerätestimmen (Web Speech API), Russisch-Hilfe auf Knopfdruck, beides in den Einstellungen abschaltbar
- **Tablet-Führerschein (Medienkompetenz):** 6 Lektionen mit Robo Pixel – Bedienung (Tippen, Wischen, Ziehen, lange
  Drücken, Zoomen), Pflege und Pausen, Daten und Passwörter, Fremde im Internet, Werbung und Käufe, Fakes und
  freundlicher Umgang. Jede Frage, Antwort und Erklärung kann vorgelesen (🔊) und auf Russisch gezeigt und
  vorgelesen werden (RU, abschaltbar). Am Ende Urkunde (als Bild speicherbar), Abzeichen auf der Startseite und 3 Extra-Sterne
- **Sachkunde mit Eule Ella:** Themen mit Bildern, Quiz, „Stimmt das?“ und Zuordnen, alles mit 🔊 und RU. Themen: „Wer bringt die Geschenke?“ (Nikolaus vs. Weihnachtsmann, Christkind, Santa Claus, Ded Moros mit Snegurotschka und Troika) und „Meine Familie“ (Stammbaum über vier Generationen zum Antippen: Geschwister, Großeltern, Urgroßeltern, Enkel, Tante/Onkel, Nichte/Neffe, Cousine, Schwager, Großtante, Großcousine). Neue Themen kommen in `spiele/sachkunde/themen.js` dazu. Fähigkeit „Welt-Wissen“ 🌍, Stufe 2 schaltet die Weihnachtsmütze frei.
- **Meine Insel (3D, Stil B) – die Haupttür der Startseite:** ohne Spielzeit im Lernmodus (Lern-Nachbarn gehen, Spielorte schlafen); betretbares Zimmer mit Kleiderschrank (Anziehen), Spiegel (Mein Ich) und Bett, selbst einrichten mit Sternen (10 Möbel auf 6 Plätzen, 5 Wandfarben); Stickeralbum auf dem Bett (48 Sticker auf 6 Seiten: fürs Lernen, fürs Entdecken des echten Wetters auf der Insel und an Festtagen in Deutschland und Russland; Doppelte werden fürs spätere Tauschen gezählt); Wetterstation mit echtem Wetter (Open-Meteo, Ort im Elternbereich, kein GPS; Regen, Schnee, Nebel, Gewitter auf der Insel, offline Jahreszeiten-Wetter); Joystick oder Tippen, Rennen, Springen mit Doppelsprung, Aktionsknopf (vor Figuren und Dingen wird „Springen“ zu „Reden“, „Öffnen“ …); Figur trägt den Look aus dem Kleiderschrank, das eigene Tier läuft mit (Ei im Nest, solange es nicht geschlüpft ist), Eule Ella, Fipsi, Robo Pixel und das Matheweg-Schild führen zu den Fächern, Ballon-Wiese und Schatz-Strand, Tag/Nacht nach Uhr, Jahreszeiten nach Datum, Grafikstufe einfach/schön
- **3D-Welt** (öffnet sich mit dem Tablet-Führerschein): Ballon-Party (60 Sekunden Ballons antippen, Sterne bei
  15/30/45 Punkten) und Insel-Abenteuer (mit Joystick laufen und springen, 10 Sterne sammeln, Schatztruhe öffnen)
- **Mein Ich (Charakter):** 5 Fähigkeiten mit je 10 Stufen – Rechen-Kraft (Mathe), Wort-Zauber (Abenteuer, Wort des
  Tages), Tablet-Klugheit (Führerschein), Entdecker-Mut (3D-Welt), Welt-Wissen (Sachkunde). Jede Stufe bringt Sterne, ein exklusives Anziehteil
  oder einen Vorteil im Spiel (z. B. schneller laufen, Doppelsprung, Sternen-Magnet, mehr Zeit bei der Ballon-Party).
  Titel je nach Gesamtstufe
- **Tagesaufgaben:** täglich 3 neue – Mathe-Training (wiederholt gemerkte Fehler und übt die schwächsten Stationen),
  Wort des Tages (5 Rätsel) und eine wechselnde Aufgabe aus den anderen Spielen. Je +1 ⭐, alle drei: Stempel und +2 ⭐.
  5 Stempel pro Woche öffnen die Wochentruhe (+5 ⭐)
- **Haustier:** Ei aussuchen (Feuer-, Regenbogen-, Wald-, Kuschel-Ei → Drache, Einhorn, Fuchs, Kätzchen in je
  3 Farben), mit Tagesaufgaben und einmal täglich Antippen wärmen, schlüpfen lassen und benennen. Füttern mit Leckerli
  (gibt es für Tagesaufgaben und Spielrunden), spielen, streicheln. Freundschaft lässt es wachsen (Baby → Kind → Groß).
  Zubehör für Sterne. Keine Strafe: vergessen heißt nur hungrig oder traurig
- **Erst lernen, dann spielen (Zeitsystem):** aktive Lernzeit oder richtig gelöste Aufgaben schalten Spielzeit frei (Standardwerte nach Alter und DGKJ-Empfehlung, z. B. 8 Jahre: 10 min oder 8 Aufgaben → 20 min spielen, höchstens 40 min am Tag). Ohne Spielzeit: „Erst lernen, dann spielen“ mit Fortschritt; Ruhezeit (Standard 19:30–7:00): „Die Insel schläft“. Fokus-Hilfen mit Bewegungspausen, Erinnerungen von Ella (Trinken) und Pixel (Augenpause), ruhige Darstellung. Alles im Elternbereich einstellbar; Erwachsene ausgenommen
- **Mehrere Kinder pro Tablet:** jedes Kind mit eigenem Spielstand; bei mehreren Kindern fragt die Startseite „Wer spielt?“ (Knopf „👥 Wechseln“). Kinder werden im Elternbereich hinzugefügt oder entfernt; die PIN gilt für alle
- **Hilfesprachen:** Russisch fertig, Ukrainisch, Arabisch, Türkisch, Polnisch und Farsi vorbereitet (siehe `docs/SPRACHEN.md`)
- **Einstufungstest** auf dem Matheweg: je 2 Aufgaben wichtiger Stationen, setzt den Startpunkt
- **Fipsis Wörter-Werkstatt** (Deutsch): Tunwörter, Wiewörter, Wortarten, Verlängern, Silben
- **Lernkartei:** falsch gelöste Mathe-Aufgaben kommen nach 1, 3 und 7 Tagen im Mathe-Training wieder, dreimal richtig = gelernt
- **Lehrplan-Gerüst:** KMK-Bildungsstandards und Lehrplan Sachsen (Klasse 1–4) in `shared/lehrplan.js`; der Elternbereich zeigt, welche Lernbereiche die App schon übt (`docs/LEHRPLAN.md`)
- **Für Eltern (PIN):** Wochenbericht (Lern- und Spielminuten je Tag, Aufgaben, Tipps für den Alltag), Ersteinrichtung und Kind-Einstellungen (mit der Bildschirmzeit-Empfehlung der DGKJ fürs Alter),
  „App neu laden“ (holt die neueste Version, Spielstand bleibt), Übersicht über Fähigkeiten, Tagesaufgaben-Kalender, Trefferquote pro Matheweg-Station,
  zuletzt falsch gelöste Aufgaben und den Stand in Abenteuer, Sachkunde, Führerschein, Haustier und 3D-Welt
- **Freischaltungen:** 13 Teile im Anziehspiel kosten Sterne; Sterne gibt es in Mathe, im Abenteuer und im Führerschein
- **Offline:** funktioniert nach dem ersten Besuch auch ohne Internet; lässt sich als App aufs Tablet legen
- **Spielstand:** liegt doppelt im Browser (localStorage + IndexedDB) und wird bei Verlust aus der zweiten Kopie
  wiederhergestellt; die Seite bittet den Browser um dauerhaften Speicher. Über „💾 Spielstand“ auf der Startseite:
  als Datei sichern und laden, oder per QR-Code (bei vielen Looks mehrere Codes nacheinander) aufs andere Tablet übertragen

## Geplant (Kurzfassung, Details in docs/PLAN.md)

**Neuausrichtung 26.10.2026** (gültige Reihenfolge in `docs/PLAN.md`, Abschnitt „Neuausrichtung“): durchgehende Geschichte
„Die Insel erwacht“ mit Kapiteln und Tutorial (Weihnachten als Sonder-Start), verzahnte und an das Kind angepasste Features,
Lehrplan Vorschule bis Übergang Klasse 5 (KMK-Kern + Länder, `docs/LEHRPLAN.md`), Muttersprachen und Deutsch als Zweitsprache
(`docs/SPRACHEN.md`), neues Grafik-Konzept mit Leistungsbudget fürs iPad 10 (`docs/GRAFIK.md`), mehr Minispiele (`docs/MINISPIELE.md`).

Frühere Planung (Historie):

1. Umgebungen: Prod (`/`), Dev (`/dev/`), Testmodus (`/dev/test/`, das bisherige /dev)
2. Lernen nach echten Fächern und dem **Lehrplan Sachsen**: Deutsch (bisher „Abenteuer“, Fipsis Schatzkarte bleibt),
   Mathematik (Klasse 1–4), Sachunterricht (bisher „Sachkunde“), Englisch ab Klasse 3, Medienbildung
3. **Zeitsystem „Erst lernen, dann spielen“**, einstellbar im Elternbereich, mit Fokus-Hilfen (z. B. bei ADHS)
4. **Mehrsprachigkeit** über Sprachschlüssel: erst Deutsch + Russisch, später weitere Muttersprachen;
   Elternbereich in der Sprache der Eltern; Bereich „Deutsch als Zweitsprache“
5. **3D-Heimatinsel** statt einzelner 3D-Spiele: Figur trägt die Kleidung aus dem Kleiderschrank, Tier läuft mit,
   Baumhaus, Nachbarn, Minispiel-Orte, echtes Wetter und echte Tageszeit; Grafikstil wird anhand von zwei Probeszenen gewählt
6. Kleiderschrank mit 150+ Teilen in 2D und 3D, später auch für Jungen
7. Haustiere: keine Einhörner, zum Start Drache, Fuchs, Katze; später mehr
8. QR-Code-Geschenke, Sticker tauschen per QR, Kopfrechen-Duell mit Eltern, eigener Stammbaum,
   Festkalender Deutschland/Russland, Arbeitsblätter aus eigenen Fehlern

## Aufbau

```
index.html              Startseite
shared/config.js        Name-Vorschlag und Modus dieser Spielwelt
shared/core.js          Profil, Sterne, Freischaltungen, Töne (für alle Spiele)
shared/ereignisse.js    Insel-Ereignisse (fund, bild, melodie …) und Story-Zustand (Kapitel, Etappen, Chronik, Geschenke)
shared/szene.js         Szenen-Baustein: Sprechblasen-Folgen für Story und Tutorial (vorgelesen, Hilfesprache, Zeigehand)
shared/szenen.js        Texte der Story- und Tutorial-Szenen (Prolog, Erst lernen, Erste Frucht, Weihnachtspaket)
shared/zeige.js         Zeigehand und Leuchten auf Knöpfe oder 3D-Punkte
shared/insel-kern.js    Insel-Kern (NA-24): Welt, Orte, Nachbarn, Stationen, Story-Auswahl, Paket, Nebel, Zimmer-Daten, Wetter – für beide Looks
spiele/insel/           Einstieg zur Insel: leitet je nach Look zu „Rund“ (welt3d/heimat.html) oder „Pixel“ (pixel/insel.html)
quellen/pixel/          Pixel-Look (DS-Stil): zeichnen.js = gemeinsamer Zeichenweg, insel.js = Pixel-Insel (im Aufbau)
shared/style.css        Farben, Schrift, Knöpfe
spiele/anziehen/        Anziehspiel (teile.js = Zeichnungen, spiel.js = Logik)
spiele/mathe/           Mathe (aufgaben.js = Aufgaben und Rechenwege, mathe.js = Matheweg und Runden)
spiele/deutsch/         Deutsch-Abenteuer (geschichte.js = Texte und Aufgaben, abenteuer.js = Ablauf)
spiele/medien/          Tablet-Führerschein (lektionen.js = Inhalte, medien.js = Ablauf und Übungen)
spiele/sachkunde/       Sachkunde (themen.js = Inhalte, bilder.js = Zeichnungen, sachkunde.js = Ablauf)
shared/sprache.js       Vorlesen mit den Stimmen des Geräts
spiele/ich/             Mein Ich: Figur, Fähigkeiten, Tagesaufgaben, Wort des Tages, Wochentruhe
spiele/eltern/          Elternbereich mit PIN
shared/charakter.js     Fähigkeiten, Stufen, Belohnungen, Tagesaufgaben, Kalender
shared/woerter.js       Wortschatz für das Wort des Tages
shared/tiere.js         Haustier-Zeichnungen (Arten, Farben, Stufen, Zubehör, Eier)
shared/tierpflege.js    Haustier-Pflege (Ei, Wärme, Werte, Leckerli, Wachstum)
spiele/tier/            Haustier-Seite
spiele/anziehen/figur.js Zeichnet die Figur (auch für Startseite und Mein Ich)
spiele/welt3d/          3D-Spiele (gebaut, nicht von Hand ändern)
quellen/welt3d/         Quellcode der 3D-Spiele, quellen/three/ = three.js (MIT); bauen mit quellen/bauen.sh (esbuild)
sw.js                   Offline-Speicher
docs/PLAN.md            Gesamtplan, Backlog der Neuausrichtung (NA-xx)
docs/KONZEPT.md         Leitidee, Story, Tutorial, Verzahnung, Individualisierung
docs/LEHRPLAN.md        Lehrplan-Matrix, Abdeckung, Inhalte als Daten
docs/SPRACHEN.md        Muttersprachen, DaZ, Schriften, Vorlesen, Übersetzungsprüfung
docs/GRAFIK.md          Stil-Leitfaden, Figuren-Steckbriefe, Leistungsbudget
docs/MINISPIELE.md      Minispiel-Katalog und Qualitätskriterien
docs/SESSION-PROMPT.md  Prompt für die nächste Arbeitssitzung
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
und baut `/dev` und `/dev/test` neu (die 3D-Spiele vorher mit `quellen/bauen.sh` bauen).

**Rauchtest:** `sh tests/laufen.sh` (für /dev: `PFAD=dev/ sh tests/laufen.sh`). Richtet die App ein, öffnet jede Seite
quer und hoch und alle 3D-Seiten und meldet JavaScript-Fehler.

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
