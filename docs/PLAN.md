# Gesamtplan Spielwelt (Stand 25.10.2026, nur Planung)

## 1. Umgebungen (erledigt 25.10.2026)
| Adresse | Zweck | Speicher (getrennt!) |
|---|---|---|
| `<domain>` | **Prod** – das, was das Kind benutzt | spielwelt.profil.v1 |
| `<domain>/dev/` | **Dev** – neue Funktionen zuerst, normale Regeln | spielwelt.dev.profil.v1 |
| `<domain>/dev/test/` | **Testmodus** (das alte /dev): alles frei, +50 ⭐, Zurücksetzen, Datum verstellbar | spielwelt.test.profil.v1 |

Ablauf: Entwicklung → /dev → Freigabe durch die Eltern/Entwickler → Prod. Build-Skript erzeugt alle drei Stände.
Gleiche Herkunft (Origin), daher eigene Speicher-Schlüssel, eigene IndexedDB und eigene Cache-Vorsilben pro Stand.

## 2. Aufbau der App: Lernen und Spielen getrennt
- **Lernen** orientiert sich an den echten Schulfächern und am **Lehrplan Sachsen (Grundschule)**:
  - **Deutsch** (das bisherige „Abenteuer“ heißt künftig Deutsch; Fipsi bleibt als Figur).
    **Fipsis Schatzkarte bleibt erhalten**, wo sie passt: als roter Faden durch die Deutsch-Kapitel
    (jedes geschaffte Kapitel deckt ein Stück der Karte auf) und auf der Insel (Fipsis Haus, Schatzsuche-Ort)
  - **Mathematik** (Matheweg Kl. 2, später 1, 3, 4)
  - **Sachunterricht** (heißt in Sachsen so; die bisherige „Sachkunde“ wird umbenannt)
  - **Englisch** ab Klasse 3
  - **Medienbildung** (Tablet-Führerschein; in Sachsen fächerübergreifend)
  - Klassenstufe im Profil; Inhalte den Lernbereichen des sächsischen Lehrplans zuordnen.
    Nächste Sitzung: die Lehrpläne auf schule.sachsen.de recherchieren und die Lernbereiche je Klasse als Datenstruktur anlegen.
- **Spielen**: die 3D-Heimatinsel (siehe 4); Tier und Kleiderschrank gehören dazu.

## 3. Zeitsystem „Erst lernen, dann spielen“
Einstellbar im Elternbereich (PIN), mehrere Regeln kombinierbar:
- Spielen erst nach **X Minuten aktivem Lernen** (z. B. 20) **oder** nach **X gelösten Aufgaben**, je nachdem, was zuerst erreicht ist
- Spielzeit pro Lerneinheit (z. B. 20 min lernen → 15 min spielen) und Höchstspielzeit pro Tag
- Ruhezeiten (z. B. ab 19 Uhr nur Lernen oder gar nichts), Wochenend-Regeln
- Lernzeit zählt nur **aktiv** (keine Eingabe > 60 s = Pause), damit man sie nicht „absitzen“ kann
- Eltern-Freigabe per PIN für Ausnahmen („heute 10 Minuten extra“)
- **Erwachsene dürfen immer spielen:** Erwachsenen-Modus nach PIN (erledigt: 1 Stunde, alles offen, keine Zeitgrenzen, Leiste oben mit „Beenden“); Erwachsene spielen ohne Sterne, Fortschritt wird nicht gespeichert, Einstellungen schon

**Rücksicht auf ADHS und Konzentrationsprobleme** (eigener Schalter „Fokus-Hilfen“):
- Kurze Lernhäppchen (5 Minuten oder 5 Aufgaben), dann eine kleine Bewegungs- oder Atempause mit Ella
- Fortschritt als sich füllendes Bild („Erst – dann“-Leiste), kein tickender Countdown
- Sofortige, kurze Rückmeldung; keine Strafen, Fehler ohne Abzug
- Animationen, Geräusche und Konfetti reduzierbar; ruhiges Farbschema möglich
- Immer nur eine Aufgabe sichtbar, große Knöpfe, vorhersehbare Abläufe
- 2-Minuten-Ankündigung vor Spielende, sanfter Übergang (das Tier wird müde und geht schlafen)
- Feste Tagesroutine optional (gleiche Reihenfolge jeden Tag)

## 4. 3D-Heimatinsel (ein Zuhause statt vieler Kacheln)
1. Grundgerüst: Figur, Joystick, Kamera, Tag/Nacht (Basis: die bestehende insel.js)
2. **Die Figur trägt die Kleidung aus dem Kleiderschrank** (siehe 6)
3. Das Tier läuft mit und reagiert aufs Antippen
4. Baumhaus mit Möbeln (mit Sternen kaufen, frei platzieren)
5. Nachbarn: Eule Ella (Sachunterricht), Fipsi (Deutsch), Robo Pixel (Medienbildung); sie führen zum Lernen
6. Minispiel-Orte, nach und nach frei: Ballon-Wiese, Schatzsuche, Rechen-Rennbahn, Hüpf-Parcours,
   Murmel-Labyrinth, Minigolf, Tauchbucht, Raketenstartplatz
7. Stickeralbum im Baumhaus
8. Weihnachts-Erststart: Geschenk auspacken, verschneite Insel im Dezember

Die Insel ist nur zugänglich, wenn das Zeitsystem Spielzeit erlaubt.

**Neue Entscheidungen (25.10.2026):**
- **Joystick statt Hintippen** (erledigt): Finger links aufsetzen und schieben; Antippen von Nachbarn, Tier und Orten bleibt.
- **Springen inkl. Doppelsprung** kommt später (Doppelsprung als Belohnung wie im Insel-Abenteuer).
- **Die Insel wird zur Startseite der Spielwelt:** Auf dem Dashboard ersetzt „Meine Insel“ die Kachel „3D-Welt“.
  Die anderen Kacheln werden **Orte/Minispiele auf der Insel**: Anziehen im Haus (Kleiderschrank im Zimmer),
  Fächer bei den Nachbarn, Tier im Nest/Garten, Mein Ich z. B. als Spiegel im Haus.
  Offene Frage für die Umsetzung: Lernen muss auch dann erreichbar sein, wenn das Zeitsystem gerade keine Spielzeit erlaubt
  (Vorschlag: die Insel ist dann im „Lernmodus“ – Laufen zu den Lern-Nachbarn geht, Spielorte schlafen).
- **Eine ganze Welt statt einer Insel:** mehrere Inseln/Gebiete, später größer, mit Boot oder Brücken verbunden.
- **Mehrere Start-Inseln zur Auswahl:** zufällig erzeugt (Form, Bäume, Lage von Haus und Strand), das Kind sucht sich bei der
  ersten Einrichtung eine aus. Technisch: Insel aus einem Zufalls-Startwert (Seed) erzeugen und nur den Seed speichern.

**Entscheidungen 3D-Welt:**
- **Entschieden (25.10.2026): Stil B – rund im Animal-Crossing-Stil** (glatte Formen, Konturen, Toon-Licht, wehendes Gras, Wellen),
  mit Stufe „einfache Grafik“ für schwächere Tablets (weniger Gras, ruhiges Wasser). Probeszene: spiele/welt3d/probe.html?stil=b
- Verworfen: weiche Low-Poly-Optik, Figuren mit großem Kopf (passend zu den 2D-Figuren).
  **Alternative: echter Animal-Crossing-Aufwand** – runde, glatte Modelle statt Kanten, Toon-Shading,
  weiche Schatten, viele Animationen (Laufen, Winken, Gesichtsausdrücke), Gras/Wasser mit Bewegung.
  Folgen: Modelle in Blender (per Skript) oder gekaufte/CC-Pakete, deutlich mehr Bauzeit, größerer Download (~40–80 MB),
  höhere Anforderungen ans Tablet; bei älteren Tablets eine „einfache Grafik“-Stufe nötig.
  Entscheidung nach der Probeszene: zuerst Low-Poly mit Toon-Shading und weichem Licht zeigen,
  daneben eine Szene mit runden Modellen, dann wählen.
- Kamera: feste schräge Sicht von oben (wie Animal Crossing); **freie Kamera optional** (Einstellung)
- Steuerung: Hintippen zum Laufen, Joystick als Alternative
- Leistung: 30 fps auf einem drei Jahre alten Mittelklasse-Tablet, < 15 MB Download, komplett offline
- Modelle: CC0-Pakete (Kenney, Quaternius) plus selbst programmierte Teile; Figur und Kleidung selbst gebaut
- Eine Insel, Innenräume als eigene Szenen, die erst beim Betreten laden
- Echte Zeit: Tag/Nacht nach der Uhr, Jahreszeiten nach dem Datum; außerhalb der Spielzeit „schläft“ die Insel
- Kein Zeitdruck auf der Insel, nur in freiwilligen Minispielen
- Alle Texte der Nachbarn von Anfang an mit Sprachschlüsseln, 🔊 und RU

**Wetter:** echtes Wetter über Open-Meteo (kostenlos, ohne Anmeldung, direkt vom Tablet).
Kein GPS: den Ort einmal im Elternbereich einstellen (z. B. Dresden). Ohne Internet: Wetter passend zur Jahreszeit.
Wetterstation im Baumhaus: eine Woche lang das echte Wetter eintragen (Sachunterricht).

## 5. Haustiere
- **Keine Einhörner.**
- Zum Start **drei** Tiere zur Wahl: Drache, Fuchs, Katze (Einhorn aus Tiere.ARTEN und EIER entfernen)
- Später **mehr Tiere** und ein zweites oder drittes Tier, z. B. über Stufen oder Sticker: Hund, Hase, Pinguin, Panda, Eule …
- Bei mehreren Tieren läuft eins auf der Insel mit, die anderen wohnen im Baumhaus oder im Garten

## 6. Kleiderschrank (deutlich größer, in 2D und 3D)
- Ziel: **mindestens 150 Teile** zum Start (heute rund 60), in Kategorien und Stilen:
  Alltag, Schule, Sport, Party, Winter, Sommer, Schlafanzug, Kostüme, Berufe, Feste
- Jedes Teil wird **einmal als Daten** beschrieben (Kategorie, Schnitt, Farben, Muster, Ebene) und daraus
  **in 2D (SVG) und in 3D (Modell auf der Insel)** gezeichnet. Farben und Muster sind frei wählbar → viele Varianten mit wenig Aufwand.
- 3D-Figur aus Bausteinen: Körper, Kopf und Frisuren als Modelle; Oberteile, Hosen, Röcke und Kleider als Formen; Muster als Texturen
- **Später auch für Jungen**: Teile als „für alle“, „eher Mädchen“ oder „eher Jungen“ markiert, Filter statt Sperre;
  Körper und Frisuren für beide; das Geschlecht kommt aus der Konfiguration (heute schon geschlecht: "w")
- Mehr Freischaltungen über Fähigkeiten, Sticker und Feste (saisonale Teile)

## 7. Integration und Mehrsprachigkeit (großes Thema)
- Ziel: Die App ist für Kinder **jeder Muttersprache** gut nutzbar. Start: **Deutsch + Russisch**,
  danach z. B. Ukrainisch, Arabisch, Türkisch, Polnisch, Farsi
- **Grundlage erledigt (25.10.2026):** Sprachliste, Hilfetext-Helfer, alle Spiele und die Insel nutzen die gewählte Hilfesprache; siehe docs/SPRACHEN.md
- Technik: alle Texte (Oberfläche und Inhalte) als Sprachschlüssel { de, ru, … } statt fest eingebautem `ru`;
  Hilfesprache im Profil; Rechts-nach-links-Darstellung für Arabisch und Farsi; Vorlesen je Sprache, soweit eine Stimme vorhanden ist
- **Elternbereich in der Sprache der Eltern** (wichtig, wenn die Eltern selbst wenig Deutsch sprechen)
- Eigener Bereich **„Deutsch als Zweitsprache“** neben dem Deutsch-Lehrplan: Bildwörterbuch, Alltagssätze,
  Schulwörter (Hausaufgaben, Pause, Turnbeutel …), Aussprache
- Sachunterricht-Themen zum Leben in Deutschland (Feste, Schule, Vereine) mit Vergleich zum Herkunftsland,
  wie bei Nikolaus, Weihnachtsmann und Ded Moros

## 8. Weitere Ideen (alle ohne Server)
- Profilauswahl beim Start (mehrere Kinder pro Tablet, getrennte Spielstände)
- Thema der Woche aus der Schule im Elternbereich; die Tagesaufgaben folgen ihm
- Einstufungstest am Anfang
- Lesen/Schreiben: Lesetexte mit Fragen, Buchstaben nachspuren, Diktat mit Vorlesen, farbige Silben
- Wiederholung nach 1/3/7 Tagen in allen Fächern
- Russisch als Stärke: Kyrillisch lesen, russische Wörter
- Aufgaben weg vom Bildschirm (Wohnung erkunden, Bewegung, Wetter beobachten)
- **QR-Code-Geschenke** (ähnlich wie Mew bei Pokémon): besondere Tiere, Kleidung, Möbel oder Sticker
  über einen geheimen QR-Code, z. B. zu Weihnachten, zum Geburtstag oder als Belohnung von den Eltern.
  Code ist signiert (gegen selbst ausgedachte Codes), jeder Code nur einmal pro Profil einlösbar. Scanner ist schon da.
- Sticker tauschen und Insel-Besuchskarte per QR zwischen Tablets (sozial ohne Server)
- Fotosafari mit der Kamera („Finde etwas Rundes“), Fotos bleiben auf dem Gerät
- Sich selbst beim Sprechen aufnehmen und anhören (Aussprache, lokal)
- Gemeinsam spielen: Kind gegen Eltern auf einem Tablet (Kopfrechnen, Quiz)
- Eigenen Stammbaum bauen (Fotos/Zeichnungen, bleibt lokal)
- Festkalender Deutschland + Russland (z. B. Maslenitsa, 8. März, 1. September)
- Arbeitsblätter aus den eigenen Fehlern als PDF zum Ausdrucken
- Wochenbericht für Eltern, Erinnerung ans Sichern, druckbare Urkunden
- Vorlesestimmen für fehlende Sprachen als vorab erzeugte Tondateien

## 9. Server (vorerst nicht)
Sinnvoll erst für: automatischen Abgleich/Sicherung, Eltern-Ansicht auf dem Handy, Schulen/Klassen,
Klassen-Inselbesuche, KI-Funktionen, anonyme Auswertung. Erster Schritt dann: auf dem Gerät
verschlüsselter Familien-Abgleich (Server sieht nichts). Kinderdaten → DSGVO, EU-Hosting, Einwilligung.

## 10. Weitere offene Punkte
- Mathe Klasse 3 und 4 (nach Lehrplan Sachsen), Klasse 1 als Einstieg
- Kleinkind-Version gehört nicht zu diesem Projekt (wird ein eigenes Projekt)
- Vision: Gegenentwurf zu Roblox – Zugang über Schulen, Eltern einbezogen, kein freier Chat,
  Klassen-Inselbesuche nur mit festen Grüßen. Schrittweise einführen (siehe 11).

## Vorschlag Reihenfolge
1. Umgebungen prod / dev / dev/test
2. Lernen nach Fächern umbauen und umbenennen, Einhorn raus, Zeitsystem mit Elternkonfiguration
3. Umbau auf Sprachschlüssel (Grundlage für alle weiteren Sprachen)
4. Heimatinsel mit 3D-Figur und Datenmodell für den Kleiderschrank
5. Lehrplan Sachsen: Inhalte je Klasse ausbauen

## 11. Ausrichtung (Stand 25.10.2026)
**Lern-Gewohnheit statt Spielesammlung:** Der Kern ist ein täglicher, kurzer, verbindlicher Lernblock (10–15 Minuten),
der danach freies Spielen freischaltet. Die Spiele sind die Belohnung, nicht das Hauptprodukt.

**Bildschirmzeit nach DGKJ** (AWMF-S2k-Leitlinie zur Prävention dysregulierten Bildschirmmediengebrauchs):
6–9 Jahre höchstens 30–45 Minuten freizeitliche Nutzung an einzelnen Tagen, 9–12 Jahre 45–60 Minuten.
- Standardwerte des Zeitsystems richten sich nach dem Alter aus der Ersteinrichtung (6–9 J.: 10–15 min Lernen + höchstens 20–30 min Spielen,
  zusammen höchstens 45 min; nicht jeden Tag nötig). Eltern dürfen abweichen; dann zeigt der Elternbereich die Empfehlung daneben.
- Bildschirmfreie Zeiten (Essen, vor dem Schlafen) als Voreinstellung; abends „schläft“ die App.
- Wichtiger als die Minuten: Bewegung, freies Spiel, echte Freunde, Schlaf. Die App schickt am Ende ins echte Leben
  („Bau draußen eine Höhle“, „Erzähl Mama, was Ella dir gezeigt hat“).
- **Erinnerungen durch die Figuren**: Fipsi (Bewegungspause: 10-mal hüpfen), Ella (Wasser trinken, Pause),
  Robo Pixel (Augenpause: aus dem Fenster schauen). Sanft, nie drängelnd.

**Mehr Figuren, mehr Klassen:** jedes Fach eine Figur (Fipsi Deutsch, Ella Sachunterricht, Pixel Medienbildung,
neu z. B. eine Rechen-Krake mit acht Armen für Mathe, ein Pinguin für Englisch). Klassen 1–4.

**Familien-Ritual, aber nie Pflicht:** Kopfrechen-Duell, gemeinsames Vorlesen, „Heute erkläre ich dir …“
(das Kind bringt einem Erwachsenen etwas bei). Wenn Eltern keine Zeit haben oder kein Interesse:
alles funktioniert auch allein, Familienteile sind Bonus und bremsen nie den Fortschritt; kleinste Formen ohne Bildschirm
(„Frag beim Abendessen …“); auch Großeltern, Geschwister, Hort können Lernpartner sein; der Wochenbericht wirkt auch ohne Mitmachen.

**Offline und auf Papier:** Tagesplan als Ausdruck für den Kühlschrank („Heute: 3 Mathe-Aufgaben + 1 Kapitel“),
Arbeitsblätter aus den echten Fehlern. Viele Eltern wollen weniger Bildschirm, nicht mehr.

**Lehrplan:** bundesweit die KMK-Bildungsstandards Primarstufe als Grundgerüst, darauf die Länder-Lehrpläne; Sachsen zuerst.

**Technik, bald umzusetzen:**
- Cache-Version automatisch (erledigt: Prüfsumme in quellen/dev-bauen.sh) und „App neu laden“ im Elternbereich (erledigt)
- Mathe-Fehler wirklich nach 1 / 3 / 7 Tagen wieder einstreuen (Spaced Repetition), danach für alle Fächer

**Datenschutz:** kein Bezug zu einem echten Kind im öffentlichen Code. Name, Alter, Klasse legen die Eltern
bei der Ersteinrichtung fest (erledigt). Umzug in ein neues Repo mit neutralem Namen und neuer Subdomain.

**Später „Sicherheits-Insel“ als Markenkern:** der Ort, an dem Kinder online sein dürfen, ohne dass Eltern Angst haben müssen.

| Roblox | Gegenentwurf |
|---|---|
| Jeder kann alles bauen und mit Fremden spielen | Nur geprüfte Inhalte, geschlossene Gruppen |
| Chat mit Fremden | Nur vorgefertigte Grüße/Emotes oder von Eltern moderierter Chat |
| Geld ausgeben für Skins | Sterne und Freischaltungen nur durch Lernen und Spielen |
| Algorithmus maximiert Spielzeit | Feste Lern- und Spielzeiten, Eltern haben das letzte Wort |
| Anonymität, Toxizität | Klare Identitäten (Klasse/Familie), starke Moderation |
| „Spiel, solange du willst“ | „Erst lernen, dann spielen“ |

Später geschlossene Klassen- oder Freundes-Inseln (nur mit Einladung + Elternfreigabe, braucht Server):
EU-Hosting, Ende-zu-Ende-Verschlüsselung wo möglich, minimale Metadaten, klare Löschfunktion. Der erste Server-Schritt
fast unsichtbar und extrem datensparsam.

**Geld:** Bekannte weiter kostenlos. Bei Öffnung einmalig 12–15 € pro Kind und Schuljahr oder faires Jahresabo (30–40 €).
**Nie Werbung, nie In-App-Käufe.**

**Einführung:** 1. mit 1–2 Kindern sehr gut machen → 2. 5–10 befreundete Familien → 3. vorsichtig Schulen ansprechen
(Medienkompetenz + Lehrplanbezug) → 4. Server erst, wenn Sync und geschlossene Gruppen wirklich gebraucht werden.

## Stand 25.10.2026 (Fundament, Phase 0)
**Fertig:**
- Automatischer Rauchtest `tests/laufen.sh`: Einrichtung, alle Seiten quer/hoch, 3D-Seiten, zweites Kind und „Wer spielt?“
- Umgebungen `/`, `/dev` (normale Regeln, „🛠 DEV“), `/dev/test` (Testmodus), getrennte Speicher und Caches
- Hilfesprachen allgemein (`S.hilfe`, `S.ht`, `S.paar`), alle Spiele und die Insel; weitere Sprachen vorbereitet (`docs/SPRACHEN.md`)
- Mehrere Kinder pro Tablet: Haushalt mit PIN und Kinderliste, eigener Spielstand je Kind, „Wer spielt?“, Kinder im Elternbereich verwalten,
  alte Einzelspielstände werden automatisch übernommen; Startfigur für Jungen
- Meine Insel mit Joystick; Erwachsenen-Modus ohne Sterne

**Offen in Phase 0:** Elternbereich-Texte als Sprachschlüssel (für Eltern in ihrer Sprache), Spielstand-Export für den ganzen Haushalt (heute je Kind).

**Nächster Schritt:** Phase 1 – Zeitsystem „Erst lernen, dann spielen“ (DGKJ-Standardwerte, Fokus-Hilfen, Erinnerungen der Figuren),
zusammen mit „Meine Insel“ als Startseite (Lernmodus: Lern-Nachbarn immer erreichbar, Spielorte schlafen bis die Lernzeit geschafft ist)
und dem betretbaren Haus mit Kleiderschrank.

## Stand 25.10.2026 (Phase 1 – Kern-Schleife)
**Fertig:**
- Zeitsystem `shared/zeit.js`: Lernzeit (nur aktiv) oder richtige Aufgaben → Spielzeit-Guthaben, Tagesgrenze, Ruhezeit, DGKJ-Standardwerte je Alter,
  Sperre auf Spielseiten, Erst-dann-Leiste, 2-Minuten-Ankündigung, Eltern-Einstellungen inkl. „+10 Minuten heute“
- Fokus-Hilfen (Bewegungspause nach 5 min), Erinnerungen (Ella: Trinken nach 20 min Lernen, Pixel: Augenpause nach 15 min Spielen), ruhige Darstellung
- Startseite: „Meine Insel“ als Haupttür, Lernfächer darunter (Deutsch, Mathe, Sachunterricht, Tablet-Profi), Anziehen im Haus
- Insel: Lernmodus ohne Spielzeit, betretbares Zimmer mit Kleiderschrank, Spiegel, Bett

**Nachtrag (erledigt):** Lernkartei in Mathe (falsch → nach 1, 3, 7 Tagen wieder, dreimal richtig = gelernt), Wochenbericht mit Balken und Tipps für den Alltag, Ideen fürs echte Leben, wenn die Spielzeit vorbei ist.

**Offen:** Lernkartei auch für Deutsch und Sachunterricht.

**Nächster Schritt:** Phase 2 – Lehrplan-Gerüst (KMK-Bildungsstandards + Lehrplan Sachsen als Datenstruktur), Einstufungstest.

## Stand 25.10.2026 (Phase 2 begonnen – Lehrplan-Gerüst)
- `shared/lehrplan.js`: KMK-Bildungsstandards + Lehrplan Sachsen (Mathe 2025, Deutsch und Sachunterricht 2019), Klassen 1–4, mit Zuordnung der App-Inhalte
- Elternbereich: „📘 Was übt die App?“ je Klasse; Bundesland in der Ersteinrichtung (zuerst Sachsen)
- `docs/LEHRPLAN.md`: Bauplan für fehlende Inhalte, nach Nutzen für Klasse 2 geordnet

**Nächster Schritt:** Inhalte aus dem Bauplan, beginnend mit Mathe „Daten und Zufall“ und „Raum und Form“, Deutsch „Verben und Adjektive“,
Sachunterricht „Körper und Gesundheit“; Einstufungstest.
