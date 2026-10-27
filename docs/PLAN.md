# Gesamtplan Spielwelt (Stand 25.10.2026, nur Planung)

> **Neu: Abschnitt „Neuausrichtung 26.10.2026“ am Ende dieses Dokuments.** Er enthält die gültige Reihenfolge und den
> Arbeitspaket-Backlog. Alle Abschnitte davor bleiben als Historie stehen.

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

### Abwechslungsreichere Insel und Fortbewegung (geplant)
- **Gelände**: Hügel und kleine Täler statt flacher Scheibe (Höhenkarte, Figur, Tier und Nachbarn laufen auf der Höhe),
  ein Aussichtshügel mit Fernrohr, Bach mit Brücke, Teich, Strand-Bucht, Wäldchen, Blumenwiese, Felsen zum Klettern.
  Gute Gelegenheit zusammen mit der größeren Welt und den generierten Start-Inseln (gleicher Höhenkarten-Baustein).
- **Rennen** (gebaut): Joystick ganz nach außen schieben oder Umschalt-Taste → nach einer halben Sekunde schneller, das Tier rennt mit.
- **Fahrzeuge zum Freischalten** (mit Sternen oder als Fähigkeits-Belohnung, im Schuppen neben dem Haus):
  Rollschuhe → Skateboard → Fahrrad (später Roller, Boot zum Nachbar-Eiland). Eigene Physik je Fahrzeug
  (Rollschuhe: gleiten und schwingen, Skateboard: Sprung „Ollie“ mit dem Aktionsknopf und eine kleine Halfpipe,
  Fahrrad: schneller, Klingel, Wege und Rampen). Helm im Kleiderschrank – das Spiel erinnert freundlich daran („Erst den Helm!“), Verkehrsregeln-Bezug zum Sachunterricht.
- **Wege und Ziele dafür**: Rundweg um die Insel mit Zeitmessung gegen sich selbst (kein Ranking), Sammel-Sterne an Hügeln, Rampen.

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

## 8b. Ganzheitlich: mehr als Schulfächer (geplant, noch nicht gebaut)
Nicht nur Mathe und Deutsch: Die Insel soll auch das stärken, was im Zeugnis kaum steht. Alles ohne Server und ohne Bewertung des Kindes.
In Sachsen passen dazu die Fächer Ethik/Religion, Musik, Kunst, Sport und der Sachunterricht-Lernbereich „Zusammenleben“.
- **Schach (Minispiel)**: eigener Ort auf der Insel (Schachtisch unter einem Baum). Erst Mini-Schach mit wenigen Figuren
  („Bauernkrieg“, nur Turm, nur Springer), dann ganzes Brett gegen eine freundliche, einstellbare KI; Rätsel „Matt in 1“.
  Später Duell Kind gegen Eltern auf einem Tablet. Schult Konzentration, Vorausdenken, mit Verlieren umgehen.
- **Eigene Stärken entdecken**: kein Test, sondern beobachten und selbst einschätzen. Der Spiegel zeigt neben den Lern-Fähigkeiten
  „Was ich gut kann“ (z. B. Ausdauer, Fantasie, Hilfsbereitschaft, Rhythmus, genau hinschauen) aus dem, was das Kind tut und was es selbst ankreuzt.
  Eltern können Stärken ergänzen („Heute habe ich gesehen, dass du …“). Nie Rangliste, nie Schwächen-Liste für das Kind.
- **Soziale Fähigkeiten und Werte**: kleine Bildergeschichten mit Entscheidungen („Ein Kind steht allein auf dem Hof – was machst du?“),
  ohne „falsch“, mit Gespräch über Folgen. Themen: teilen, helfen, streiten und vertragen, Nein sagen, Regeln, Fairness,
  Vielfalt (andere Sprachen, Familien, Feste – passt zur Integration), Kinderrechte, Natur schützen. Mit Eltern-Gesprächsimpuls fürs Abendessen.
- **Gefühle (emotionale Fähigkeiten)**: Gefühle erkennen (Gesichter, Situationen), benennen auf Deutsch und Russisch,
  Gefühls-Barometer am Tagesanfang (freiwillig, bleibt lokal, nur das Kind und auf Wunsch Eltern sehen es),
  Beruhigungs-Ecke im Zimmer (Atem-Übung mit dem Tier, „Schildkröte“, Wut-Ballon). Keine Diagnosen, keine Auswertung.
- **Kreativ und musikalisch**: Malen (freie Leinwand an der Staffelei im Zimmer, Bilder als Poster an die Wand),
  Musik-Ecke: Xylofon/Klavier, Rhythmus nachklatschen, eigene kleine Melodie bauen, Kinderlieder-Melodien (gemeinfrei, z. B. deutsche und russische Volkslieder),
  Töne hoch/tief, laut/leise (Lehrplan Musik). Insel-Bühne, auf der Tiere zur eigenen Melodie tanzen.
- **Bewegung und Sport**: Bewegungs-Aufgaben weg vom Bildschirm statt Spielzeit-Verlängerung am Tablet
  („10 Hampelmänner wie Fipsi“, Balancieren, Tier-Yoga, Tanzen zur Insel-Musik), Ella/Fipsi machen vor; Haken setzt das Kind selbst (kein Kamera-Tracking).
  Bewegungspausen aus dem Zeitsystem nutzen diese Übungen; Wochenziel „draußen gespielt“ im Elternbericht. Passt zur DGKJ-Empfehlung.
- **Figuren**: eine neue Nachbarin für Gefühle/Miteinander (z. B. ein Bär „Bruno“ mit Herz-Laterne) und ein Musik-Vogel; Schach beim Fuchs Fipsi oder einer Schildkröte.
- **Belohnung**: Diese Bereiche geben keine Sterne für „richtige“ Gefühle oder Meinungen – nur fürs Mitmachen; Sticker und Möbel dazu (Notenständer, Schachtisch, Sitzkissen).

## 9. Server (vorerst nicht)
Sinnvoll erst für: automatischen Abgleich/Sicherung, Eltern-Ansicht auf dem Handy, Schulen/Klassen,
Klassen-Inselbesuche, KI-Funktionen, anonyme Auswertung. Erster Schritt dann: auf dem Gerät
verschlüsselter Familien-Abgleich (Server sieht nichts). Kinderdaten → DSGVO, EU-Hosting, Einwilligung.

## 10. Weitere offene Punkte
- Mathe Klasse 3 und 4 (nach Lehrplan Sachsen), Klasse 1 als Einstieg
- Kleinkind-Version gehört nicht zu diesem Projekt (wird ein eigenes Projekt)
- Vision: Gegenentwurf zu Roblox – Zugang über Schulen, Eltern einbezogen, kein freier Chat,
  Klassen-Inselbesuche nur mit festen Grüßen. Schrittweise einführen (siehe 11).

## Vorschlag Reihenfolge (Historie – ersetzt durch „Neuausrichtung 26.10.2026“)
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

## Stand 25.10.2026 (Inhalte Klasse 2)
- Deutsch: Fipsis Wörter-Werkstatt (Tunwörter, Wiewörter, Wortarten, Verlängern d/t g/k b/p, Silben klatschen)
- Sachunterricht: „Gesund und munter“, „Bäume und Vögel“
- Mathe: neue Stationen Formen und Körper, Strichlisten und Diagramme, Sicher/möglich/unmöglich, Gerade/ungerade, Sachaufgaben, Länge, Woche/Monat/Jahr
- Einstufungstest auf dem Matheweg (Startpunkt statt geschenkter Sterne; im Elternbereich wiederholbar)
- Lehrplan Sachsen Kl. 1/2 jetzt: Mathe alle 4 Lernbereiche abgedeckt (2 teilweise), Deutsch und Sachunterricht deutlich besser

**Nächster Schritt:** Insel lebendiger (Springen/Doppelsprung, Zimmer einrichten, Wetterstation, Stickeralbum), dann Weihnachts-Erststart und QR-Geschenk.

## Stand 25.10.2026 (Insel lebendiger)
- Joystick und Tippen jederzeit umschaltbar, Springen mit Doppelsprung
- Aktionsknopf: Vor Ella, Fipsi, Pixel, Haus, Schrank, Spiegel, Wetterstation usw. wird aus „Springen“ „Reden“, „Öffnen“, „Reingehen“ …
- Wetterstation mit echtem Wetter (Open-Meteo, Ort im Elternbereich, kein GPS)
- Zimmer einrichten: 10 Möbel, 6 Plätze, 5 Wandfarben, mit Sternen
- Rennen (Joystick ganz außen oder Umschalt-Taste), Tier rennt mit
- Geplant: Hügel und abwechslungsreiches Gelände, Rollschuhe/Skateboard/Fahrrad (Abschnitt 4)
- Geplant (8b): Schach, eigene Stärken, soziale Fähigkeiten und Werte, Gefühle, Kreativität/Musik, Bewegung

- Stickeralbum: 6 Seiten × 8 Sticker (Lernen: alle 6 Aufgaben einer, max. 3/Tag; Wetter entdecken; Feste DE/RU), Album auf dem Bett und unter „Mein Ich“

**Nächster Schritt:** Weihnachts-Erststart und QR-Geschenk; danach 8b schrittweise (Bewegungs-Aufgaben und Gefühle zuerst, weil sie ins Zeitsystem passen).

## Stand 26.10.2026 (Lernfunde – „Heute neu“)
**Fertig:**
- `shared/lernfunde.js`: konkrete Lernfunde pro Tag (höchstens 5, 60 Tage), gemeisterte Aufgaben verdrängen einfache Funde
- Quellen: Mathe-Lernkartei gemeistert (mit Hinweis „🌱 Das kannst du jetzt!“), Matheweg-Station neu/besser, Wort des Tages (mit Übersetzung),
  Fipsi-Kapitel (Wörter mit Artikel), Wörter-Werkstatt, Sachthema, Tablet-Lektion
- Sichtbar: Karte „🌱 Heute neu“ in „Mein Ich“ (mit „Auf Russisch … – du kennst es in zwei Sprachen!“ und „Erzähl heute jemandem …“),
  Zähler auf der Startseite, Nachbarn auf der Insel hüpfen und sprechen über den Fund ihres Fachs (Aktionsknopf 🌱), Wochenbericht „Neu gelernt“
- Rauchtest grün, eigener Test für Lernkartei → Fund → Mein Ich/Insel/Eltern

**Offen / nächster Schritt:**
- Lernkartei auch für Deutsch und Sachunterricht → dann gibt es dort ebenfalls „war schwer, jetzt kannst du es“
- Ein Fund pro Tag als kleine Veränderung im Zimmer oder am Tier (z. B. Tier lernt das Wort des Tages mit, Pinnwand im Zimmer)
- Freiwillige „echte Welt“-Aufgabe als Tagesaufgaben-Variante (Punkt 2) und Eltern-Bestätigung „hat es mir erklärt“ (Punkt 3)
- Museum/Schatzkammer aus den Lernfunden (Punkt 4)

**Nachtrag 26.10.2026 – Wissensbaum auf der Insel**
- Neben dem Pfad (Platz vor dem Haus) wächst ein Wissensbaum: Größe nach allen Lernfunden seit Beginn
  (Stufen ab 1, 5, 15, 35, 70, 120 Funden; vorher ein Spross), jeder Fund von heute hängt als leuchtende Frucht in der Fachfarbe daran
  (gemeistert = golden), Früchte ploppen beim Betreten auf und leuchten nachts. Wächst er, sagt die Insel einmal „Dein Wissensbaum ist gewachsen!“.
- Antippen: „Schon N Dinge gelernt … Heute hängen 3 neue Früchte dran …“, Knopf führt zu „Mein Ich“. Kein Welken, keine Strafe.
- `Lernfunde.summe` zählt dauerhaft (wird nicht mit den 60 Tagen gekürzt); Hinweis auf den Baum unter „Heute neu“.

**Nächster Schritt:** Lernkartei für Deutsch und Sachunterricht (mehr „gemeistert“-Funde), dann Jahreszeiten am Wissensbaum (Blüten im Frühling,
Lichterkette im Advent) und Schatzkammer aus den Funden (Punkt 4).

**Nachtrag 26.10.2026 – Lernkartei für Deutsch und Sachunterricht**
- `shared/lernkartei.js`: beim ersten Fehler wird der Schritt gemerkt (Deutsch: Artikel, Bild, Hören, Wort, Lücke, Wo, Wortart, Verlängern, Silben, Satz;
  Sachunterricht: Wahl- und Daumen-Fragen), Abstände wie in Mathe (1, 3, 7 Tage).
- Fällige Karten (höchstens 3) kommen mit kurzer Ansage von Fipsi bzw. Ella an den Anfang des nächsten Kapitels/Themas; sie zählen nicht gegen die Sterne.
- Dreimal richtig = gemeistert → goldener Lernfund mit Hinweis („die Eule – war knifflig, jetzt kannst du es!“), goldene Frucht am Wissensbaum.
- Wochenbericht: „Wiederholungen heute dran“ zählt jetzt alle drei Fächer.

**Nachtrag 26.10.2026 – „Du darfst noch x Minuten spielen“ (Elternbereich)**
- Unter „Erst lernen, dann spielen“: Feld „Heute noch spielen dürfen (min)“ + „Festlegen“ (`Zeit.noch(min)`).
- Entscheidungen: gilt sofort auch ohne Lernen (bewusste Ausnahme der Eltern), kann auch verkürzen (0 = für heute Schluss),
  Lernen bringt danach weiter Spielzeit dazu, Ruhezeit gilt weiter. Das Kind sieht einmal eine Ansage („🎁 Du darfst heute noch 15 Minuten spielen!“).

**Nachtrag 26.10.2026 – Pinnwand im Zimmer**
- Rechte Zimmerwand: Korkwand „Das habe ich gelernt“ mit bis zu 8 Zetteln (Lernfunde der letzten 7 Tage, Fachfarbe, gemeistert golden,
  heutige golden umrandet). Antippen: Liste der Woche, Knopf zu „Mein Ich“. Wird beim Betreten der Insel neu gezeichnet.

**Nachtrag 26.10.2026 – Insel-Zugang und Aufräumen (Feedback)**
- Die Insel ist ohne Tablet-Führerschein gesperrt: Die Tür auf der Startseite zeigt 🔒, Antippen öffnet die Begrüßung von Robo Pixel
  („Den Schlüssel bekommst du bei mir …“) mit Knopf zum Führerschein; ein direkter Aufruf von heimat.html leitet ebenfalls dorthin.
- Die alte Übersicht „3D-Welt“ (spiele/welt3d/index.html) leitet zur Startseite; Zurück von der Insel → Startseite, aus Ballon-Party/Insel-Abenteuer → Insel.
- Kachel „Tablet-Profi“ entfernt; der Führerschein steht in „Mein Ich“ („Tablet-Führerschein: 3 von 6“ bzw. „Mein Tablet-Führerschein“).
- „Meinen Führerschein ansehen“ nur noch mit Führerschein: Ursache war, dass `.knopf` das `hidden`-Attribut überschrieb → global `[hidden] { display: none !important }`.
- Robo Pixel wohnt vorerst nicht auf der Insel (kommt im späteren Spielverlauf zurück).
- Insel-Einstellungen Grafik/Laufen/Kamera werden pro Kind gemerkt; im Elternbereich „🏝️ Insel-Einstellungen“ mit Schalter, ob das Kind die Knöpfe sieht.

**Wünsche aus dem Feedback (26.10.2026), noch zu planen:**
- ~~**Charakter für Mathe**~~ erledigt: **Biber Benno** (baut Dämme, zählt Stämme, gelber Helm) – 2D in `shared/figuren.js`, auf dem Matheweg mit Sprechblase und am Ende,
  3D auf der Insel neben dem Matheweg-Schild (reagiert auf Mathe-Lernfunde), Startseite „Mit Biber Benno rechnen“.
- **Coolere Minispiele** – begonnen (siehe Nachtrag Minispiele). Weitere Ideen: Musik/Rhythmus, Tiere pflegen/Zoo, Malen, Höhle erkunden, Boot/Flugzeug, Schach.
- ~~**Eigene Welt statt fester Insel**~~ Schritt 1–3 erledigt (siehe unten). Ursprünglicher Wunsch: zufällig erzeugtes, größeres Stück Land nach Wünschen und Vorlieben des Kindes
  (z. B. Wald, Berge, Strand, Schnee, Wiese, Farben), als Skin austauschbar, neu erzeugbar und speicherbar (Seed + Vorlieben, klein für den QR-Transfer).

**Nachtrag 26.10.2026 – Eigene Welt (Wünsche-Assistent)**
- `quellen/welt3d/welt.js`: Welt aus Wünschen + seed – Landschaft (Blumenwiese, Wald, Berge, Strand, Schneeland, Wüste), Lieblingsfarbe,
  Größe (klein 15 / mittel 20 / riesig 25), Hügel (wenig/mittel/viel), Teich, viele Blumen. Hügel aus Rauschen, flache Plätze für Haus,
  Nachbarn, Wissensbaum, Wetterstation, Nest und Spielorte, Pfad zum Haus, Bäume je Landschaft (Laub, Nadel, Palme, Kaktus), Steine, Blumen.
- Ohne gespeicherte Welt gilt die bisherige Insel unverändert (`STANDARD`, flach).
- Insel: Knopf „🌍 Welt“ (nur in der Spielzeit) → Liste „Meine Welten“ (erste Insel + bis zu 5 eigene, besuchen, löschen) → Assistent in 3 Schritten
  → „Gefällt dir deine neue Welt? 🎲 Neu würfeln / ✅ Behalten / ↩️ Zurück“.
- Gespeichert wird nur `{ welten: [Wünsche + seed + Name], aktiv }` (klein für QR). Test-Parameter: `heimat.html?biom=berge&groesse=gross&huegel=viel&see=1&seed=5`.
- Offen: auf echten (schwachen) Tablets prüfen, ob „riesig“ + „schön“ flüssig läuft (Stufe „einfach“ hat weniger Geländepunkte);
  Fluss, Höhle, eigene Tiere in der Welt; Jahreszeiten-Deko je Landschaft; Minispiel-Orte je Welt.

**Nachtrag 26.10.2026 – Minispiele (je eins pro Vorliebe)**
- Lern-Anreiz: neue Spielorte öffnen sich, wenn der Wissensbaum wächst (`SPIELE` in gemeinsam.js): Sternenlauf ab Stufe 1 (1 Lernfund),
  Kart ab Stufe 2 (5), Bauplatz ab Stufe 3 (15). Gesperrte Orte stehen mit 🔒 in der Welt und sagen, wie viele Lernfunde fehlen.
- Sterne nur für neu erreichte Ziele je Spiel (`sterneFuer`), damit Spielen keine Sterne-Flut bringt; Erfahrung für Entdecker-Mut.
- 🏃 **Sternenlauf** (Geschick & Tempo): eigene Figur, 3 Bahnen, wischen/Knöpfe, 60 s, Stämme/Steine, Sternen-Magnet aus Wort-Zauber 4.
- 🏎️ **Kart-Rennen** (Fahrzeuge): 3 Runden gegen Fipsi und Benno, Münzen, Turbo-Felder, Gas automatisch, Lenkhilfe, Bestzeit.
- 🧱 **Bauplatz** (Bauen & Gestalten): Steine in 11 Farben setzen/abreißen, drehen/zoomen, Rückgängig, gespeichert; Benno stellt Zähl-Aufgaben
  (Turm aus n Steinen, Reihe aus n, genau n Farben, genau n Steine) → Mathe-Erfahrung und Sterne.
- Sammeln & Entdecken: bisher Schatz-Strand (Insel-Abenteuer) und Ballon-Party.
- `figur3d.js`: die eigene Figur für alle Minispiele (heimat.js hat noch eine eigene Kopie – zusammenführen).
- Offen: Bauwerk vom Bauplatz auf der eigenen Welt aufstellen; Kart-Strecke passend zur Landschaft; weitere Spiele (siehe oben).

**Nachtrag 26.10.2026 – Flüssiger auf älteren Tablets (Feedback: „riesig“ + „schön“ ruckelt auf dem iPad 10)**
- Feste Deko (Bäume, Steine, Blumen, Wegsteine) wird beim Laden je Material zu einem Mesh verschmolzen (`verschmelze()` in heimat.js):
  Zeichenaufrufe gemessen – Wald riesig 906 → 230, Berge riesig 512 → 81, erste Insel 499 → 339; sieht gleich aus.
- Gras höchstens 900 Halme, bewegt sich nur jedes zweite Bild.
- Automatischer Sparmodus: in den ersten Sekunden wird gemessen; unter 30 Bildern/s → keine Schatten, Auflösung 1, Wasser und Gras ruhig,
  kurzer Hinweis; das Tablet merkt es sich (`lerninsel.sparen`), bis „Grafik“ oder die Eltern-Einstellung neu gewählt wird.
- Bitte erneut auf dem iPad 10 testen; falls nötig als Nächstes: weniger Bäume bei „riesig“, Schatten nur nahe der Figur, Kamera-Sichtweite kürzer.

**Nachtrag 26.10.2026 – Eltern als Mitspieler (Punkt 3)**
- `shared/familie.js`: gemeinsame Momente (Erklären, Duell) pro Kind, Wochenbericht „🤝 Gemeinsam“ mit Tipp.
- **Erklär-Moment:** unter „Mein Ich → Heute neu“ hat jeder Fund „🗣️ Erklären“ (oder „Etwas erklären“ in der Karte „🤝 Gemeinsam“):
  Das Kind erklärt einem Erwachsenen (Leitfragen: Was ist das? Beispiel? Wo im echten Leben?), der Erwachsene bestätigt mit der PIN.
  Lohn: „❤️ Einem Erwachsenen erklärt“ am Fund, rosa Herzfrucht am Wissensbaum, Erfahrung für Wort-Zauber. `S.pinStimmt()` in core.js.
- **Kopfrechen-Duell** (`spiele/familie/duell.html`): Kind gegen Erwachsenen auf einem Tablet, Hochformat gegenüber (obere Hälfte gedreht),
  Querformat nebeneinander; Kind bekommt Aufgaben seiner Klasse, Erwachsene leichter/mittel/knifflig; erst 10 richtig oder 90 s;
  falsch = 1 s Pause; zählt fürs Kind als Lernzeit und Matheweg-Tagesaufgabe.
- Alles freiwillig: keine Mahnung, keine Strafe, wenn niemand Zeit hat.
- Ideen für später: gemeinsam Vorlesen (Kind liest, Erwachsener hört zu), Wort-Duell (Artikel), Eltern stellen eine eigene „Echte-Welt-Aufgabe“.

**Nachtrag 26.10.2026 – Echte-Welt-Aufgaben (Punkt 2)**
- `shared/echtewelt.js`: 32 kurze Ideen in 7 Bereichen (Rechnen im Alltag, Natur, Lesen/Schreiben, Familiensprache – nur mit Hilfesprache,
  Helfen/Fragen, Bewegung, Gefühle), nach Klasse gefiltert, mit russischem Text; jeden Tag eine (pro Kind gleich), „Andere Idee“ höchstens 2-mal.
- „Mein Ich“: Karte „🌍 Echte Welt (freiwillig)“ → „✅ Geschafft!“ → Erwachsene bestätigen mit der PIN (oder Kind hakt selbst ab, wenn Eltern es erlauben).
- Lohn: 1 Stern, Lernfund „🌍 Echte Welt: …“ (grüne Frucht am Wissensbaum), Eintrag im Wochenbericht unter „🤝 Gemeinsam“.
- Zeitsystem: Ist die Spielzeit vorbei oder für heute genug gespielt, wird die heutige Echte-Welt-Aufgabe statt einer Zufallsidee vorgeschlagen.
- Elternbereich: Karte „🌍 Echte-Welt-Aufgaben“ (heutige Aufgabe, Schalter „Kind darf selbst abhaken“).
- Bewusst keine zusätzliche Spielzeit als Lohn (Bildschirmzeit soll nicht durch Offline-Aktivität „verdient“ werden).

**Nachtrag 26.10.2026 – Langzeit-Motivation (Punkt 4)**
- Lernfunde haben jetzt dauerhafte Zähler (je Art, je Fach, erklärt) und eine **Schatzkammer-Liste** (gemeistert, erklärt, Echte Welt; 200 Einträge),
  die nicht mit den 60 Tagen gekürzt werden; alte Spielstände werden beim ersten Laden aus den Tagen gefüllt.
- `shared/schatz.js`: **17 Pokale** (z. B. 25/100/250 Lernfunde, 10/50 gemeistert, 20 Funde je Fach, 10× erklärt, 25 Echte-Welt-Aufgaben,
  10 Wochen-Herausforderungen, 20 Stempel-Tage) – manche schnell, manche erst nach Monaten; Meldung bei neuem Pokal.
- **Wochen-Herausforderung**, jede Woche eine andere (8 Lernfunde, 2 gemeistert, 3 Fächer, 2× erklären, 3 Echte-Welt, 4 Stempel-Tage):
  in „Mein Ich → Meine Woche“, Medaille abholen = +3 ⭐, Medaillen in der Schatzkammer.
- **Schatzkammer** (`spiele/schatz/`, über „Mein Ich“): Zahlen, Wochen-Herausforderung, Pokale mit Fortschritt, Wochen-Medaillen,
  Funde je Fach, Schätze nach Monaten.
- **Jahreszeiten am Wissensbaum:** Blüten im Frühling, bunte Blätter im Herbst, Schnee im Winter, blinkende Lichterkette im Dezember.

**Nachtrag 26.10.2026 – 8b begonnen: Gefühle und Bewegung mit Bärin Bruni**
- Neue Nachbarin **Bärin Bruni** (2D in figuren.js, 3D auf der Insel/in jeder Welt, Startseiten-Kachel „Gefühle“) → `spiele/gefuehle/`.
- **Wie geht's dir?** Gefühls-Barometer (7 Gefühle, de/ru), freiwillig, einmal am Tag, Bruni antwortet freundlich und schlägt passend
  „Ruhig werden“ oder „Bewegungs-Minute“ vor; eigener Verlauf der letzten Tage; Eltern sehen es nur, wenn das Kind es freigibt.
- **Ruhig werden:** Ballon-Atmen (5 Runden, 4 s ein/aus), Schildkröte (3 Runden), Wut-Ballon (gedrückt halten, langsam Luft ablassen).
- **Gefühle erkennen:** 6 von 12 Situationen, Gefühl wählen – nie „falsch“ („Das kann auch sein! Viele fühlen sich eher …“); Lernfund.
- **Bewegungs-Minute:** 4 von 12 Übungen à 15 s, Kind hakt selbst ab (keine Kamera); Wochenbericht: Bewegungs-Minuten, Ruhe-Übungen,
  Barometer nur mit Freigabe. Keine Sterne für Gefühle, nur Erfahrung fürs Mitmachen.
- Weiter in 8b: Schach, eigene Stärken (Spiegel), soziale Bildergeschichten, Malen/Musik.

**Nachtrag 26.10.2026 – 8b: Schach mit Schildkröte Tilda**
- `spiele/schach/`: `regeln.js` (Zuggenerator, Schach/Matt/Patt, freundliche KI in 3 Stufen; vereinfacht ohne Rochade und en passant,
  Bauer wird Dame; im Node-Test geprüft) und `schach.js` (Brett mit Antippen, grüne Zielpunkte, letzter Zug, Schach rot).
- **Figuren kennenlernen:** 6 Lektionen (Turm, Läufer, Dame, König, Springer, Bauer) – mit der Figur alle Sterne einsammeln; je Lektion 1 ⭐ beim ersten Mal und ein Lernfund.
- **Matt in 1:** 9 Rätsel (per Skript geprüft), falscher Zug wird zurückgestellt; alle gelöst = Lernfund.
- **Spielen:** gegen Tilda leicht/mittel/schwer (erster Sieg je Stufe: Sterne + Lernfund), **zu zweit** mit Eltern (Brett drehbar), zählt als gemeinsamer Moment.
- Zählt als Lernzeit; Startseiten-Kachel „Schach“ und Schachtisch mit Tilda auf der Insel/in jeder Welt (auch ohne Spielzeit erreichbar).
- Weiter in 8b: eigene Stärken (Spiegel), soziale Bildergeschichten, Malen/Musik.

**Nachtrag 26.10.2026 – 8b: Stärken und Miteinander**
- `shared/staerken.js`: 16 Stärken (de/ru), **nie** eine Schwächen-Liste, kein Test, keine Rangliste. Drei Quellen:
  Kind kreuzt selbst an (🙋) · App bemerkt etwas aus dem, was das Kind tut (Schach-Rätsel, Bauplatz, Bewegung, Erklären …) und
  fragt nach („Bruni hat bemerkt … Kannst du gut …?“ – Ja/Eher nicht, Ablehnung wird respektiert) (🔍) · Eltern ergänzen im
  Elternbereich „Heute habe ich gesehen, dass du …“ (❤️). Anzeige als Karte „⭐ Was ich gut kann“ in Mein Ich (Spiegel).
- **Miteinander** bei Bruni (`spiele/gefuehle/`): 8 kleine Bildergeschichten (neues Kind, Streit ums Spielzeug, Auslachen, …),
  Kind wählt, Bruni zeigt freundlich die Folge (keine „falsch“-Antwort), danach eine Nachdenk-Frage und ein
  **Gesprächsimpuls fürs Abendessen**; der letzte Impuls erscheint im Wochenbericht der Eltern. Lernfund + Erfahrung Sachkunde.
- Weiter in 8b: Malen/Kreativität und Musik.

**Nachtrag 26.10.2026 – 8b: Atelier mit Papagei Paula (Malen)**
- Neue Figur **Papagei Paula** (figuren.js), Startseiten-Kachel „Atelier“ → `spiele/atelier/`. Startseite jetzt 3 × 2 Kacheln unter der Insel.
- **Malen:** Leinwand 1024 × 768 (4:3, passt sich dem Bildschirm an), 15 Farben, Pinsel in 3 Größen, Regenbogen-Pinsel,
  Farbeimer (Zeilen-Füllung mit Toleranz, Ränder werden mitgefärbt), 12 Stempel, Radierer, 8 Schritte Rückgängig.
- **Ausmalbilder** (`vorlagen.js`, selbst gezeichnete Umrisse): Haus, Blume, Fisch, Schmetterling, Mandala, Rakete.
- **Malaufträge** (Lehrplan Kunst): 14 Ideen, eine pro Tag (+ „Andere Idee“), z. B. warme/kalte Farben, Muster, Formen,
  Punkte, hell/dunkel, „Male, wie du dich fühlst“. Erster Auftrag je Art: Lernfund (Fach „kunst“, eigene Frucht am Wissensbaum) + 1 ⭐.
- **Belohnung nur fürs Mitmachen:** neue Fähigkeit „Kreativ-Funke“ 🎨 (+3 Erfahrung für bis zu 3 Bilder am Tag), 1 ⭐ fürs erste Bild des Tages.
  Bilder werden nie bewertet. Stärke „malen und gestalten“ wird ab 3 Bildern von Bruni bemerkt.
- **Bilder speichern:** eigene IndexedDB je Kind (`shared/bilder.js`), JPEG 800 × 600, höchstens 30 Bilder; **nicht** im Spielstand,
  damit QR-Transfer und Sicherung klein bleiben (Bilder bleiben auf dem Tablet). Löschen eines Kindes im Elternbereich löscht auch seine Bilder.
- **Insel:** Staffelei im Zimmer zeigt das neueste Bild (→ Atelier), bis zu 3 Bilder hängen als Poster (zwei über dem Bett, eins rechts).
  Neue Bilder hängen automatisch, solange Platz ist; in der Galerie „An die Wand“ / „Von der Wand nehmen“.
- Zählt als Lernzeit (Kunst ist Schulfach). Weiter in 8b: Musik (Musik-Ecke im Atelier).

**Nachtrag 26.10.2026 – 8b: Musik-Ecke im Atelier (`spiele/atelier/musik.js`)**
- Alle Klänge per Web Audio im Browser (Klangstab = Sinus + 2 abklingende Obertöne, Klatschen = gefiltertes Rauschen), keine Audiodateien.
- **Xylofon** C–C' (8 farbige Klangstäbe, lang = tief). **Lieder zum Mitspielen** (nur gemeinfreie Melodien, keine Texte):
  Alle meine Entchen, Hänschen klein, Morgen kommt der Weihnachtsmann, Ode an die Freude. Paula spielt vor, dann leuchtet
  der Stab, der dran ist; falsche Töne klingen einfach, kein Fehlerzähler. Erstes Mal je Lied: 1 ⭐ + Lernfund (Fach „musik“).
- **Rhythmus nachklatschen:** 5 Rhythmen je Runde (8 Achtel, 10 Muster vom Leichten zum Schweren), Kind tippt auf der Trommel;
  Prüfung von Anzahl und Abständen mit großzügiger Toleranz (±45 % eines Achtels). Freundliche Hinweise („Es waren 4 Klatscher“),
  nach zwei Versuchen darf man weiter. Ab 5 geschafften Rhythmen: Lernfund und Stärke „Rhythmus“ wird bemerkt.
- **Hoch oder tief? / Laut oder leise?** (Lehrplan Musik): 6 Fragen, Abstände werden kleiner (Oktave → Sekunde), immer „Nochmal hören“.
- **Meine Melodie:** Raster 8 Spalten × 8 Töne, Abspielen, „Überrasch mich“ (Zufallsmelodie aus kleinen Schritten, endet auf C),
  bis zu 5 Melodien gespeichert (im Spielstand, sehr klein) – Grundlage für die Insel-Bühne, auf der die Tiere tanzen (später).
- Erfahrung „Kreativ-Funke“ nur fürs Mitmachen, Musik höchstens 12 Punkte am Tag. Russische Volkslied-Melodien folgen, wenn die Noten geprüft sind.

**Nachtrag 26.10.2026 – Insel-Bühne mit Papagei Paula**
- Neuer Platz `buehne` in `welt.js` (Standard-Insel und generierte Welten, flache Fläche). Runde Bühne mit Lautsprechern, Paula in 3D.
- Antippen: Paula spielt die zuletzt gespeicherte eigene Melodie zweimal (Web Audio), alle Nachbarn und Paula hüpfen im Takt,
  das eigene Tier tanzt. Ohne Melodie lädt Paula ins Atelier ein (`../atelier/?musik` öffnet direkt die Musik-Ecke).

**Stand 26.10.2026 (Ende der Sitzung)**
- Fertig: Punkte 1–4 der Sitzungsziele (Tagesfortschritt, echte Welt, Eltern als Mitspieler, Langzeit-Motivation) und 8b komplett.
- Offen: iPad-10-Test, Bauwerk in der Welt, Kart-Strecke zur Landschaft, Lehrplan-Inhalte, russische Lieder, Punkt 5 Muttersprache,
  zuletzt Weihnachts-Erststart mit Tutorial. Nächster Schritt: iPad-Rückmeldung abwarten, dann Bauwerk in der Welt.

**Reihenfolge (abgestimmt 26.10.2026, Historie – ersetzt durch „Neuausrichtung 26.10.2026“ unten):** ~~Pinnwand im Zimmer~~ (erledigt) → ~~Eltern als Mitspieler~~ (erledigt) → ~~„echte Welt“-Aufgaben~~ (erledigt) →
Jahreszeiten am Wissensbaum und Schatzkammer → Muttersprache als Stärke → Minispiel-Orte, 8b, Gelände, Lehrplan-Inhalte, Tablet-Tests →
**zuletzt Weihnachts-Erststart mit QR-Geschenk und Tutorial.**

---

## Neuausrichtung 26.10.2026
Grundlage: Rückmeldung des Auftraggebers vom 26.10.2026 (Story und Tutorial, Verzahnung und Individualisierung,
inhaltliche Tiefe nach Lehrplänen, Sprachen und DaZ, Grafik, mehr Minispiele). Die Konzepte stehen in
[`KONZEPT.md`](KONZEPT.md), [`LEHRPLAN.md`](LEHRPLAN.md), [`SPRACHEN.md`](SPRACHEN.md), [`GRAFIK.md`](GRAFIK.md) und
[`MINISPIELE.md`](MINISPIELE.md). Dieser Abschnitt legt fest, **in welcher Reihenfolge** gebaut wird.

### Entscheidungen (26.10.2026)
1. **Story und Tutorial kommen nach vorn.** Weihnachten ist kein Endpunkt mehr, sondern Anlass für einen Sonder-Start
   (Erststart im Dezember oder Weihnachts-QR). Prolog, Tutorial E1–E5 und Weihnachts-Sonderstart müssen **bis 15.12.2026** fertig sein.
2. **Lehrplan:** gemeinsamer Kern aus den KMK-Bildungsstandards (Deutsch, Mathe), KMK „Bildung in der digitalen Welt“ und
   GDSU-Perspektivrahmen; Länder als Abweichungen. Sachsen bleibt das erste vollständig gepflegte Land, danach NRW, Bayern,
   Baden-Württemberg, Niedersachsen, Berlin/Brandenburg.
3. **Sprachen:** nach Russisch zuerst **Ukrainisch**, dann **Arabisch** (baut die RTL-Technik), dann **Türkisch**; danach Polnisch,
   Rumänisch, Farsi/Dari, Kurdisch, Englisch, Bulgarisch. Keine ungeprüfte Maschinenübersetzung im Kinder-UI.
4. **Grafik:** Der Stil darf sich grundlegend ändern. Erst drei Probeszenen auf dem iPad 10 vergleichen, dann entscheiden.
   **Bis zur Entscheidung werden keine Figuren neu gebaut**; Story und Tutorial nutzen die heutigen Figuren.
5. **Inhalte als Daten:** Lernziel-IDs, Wortschatz-Kern und Inhaltsdateien nach `LEHRPLAN.md`. Bestehende Inhalte werden nicht
   umgebaut, sondern bekommen zuerst nur Verweise; nichts wird entfernt.

### Phasen
| Phase | Inhalt | Zeitraum (Ziel) | Ergebnis für das Kind |
|---|---|---|---|
| A | Fundament: Story-Zustand, Ereignisse, Profil-Erweiterung, Lernziel-Kern | Ende Oktober / Anfang November | (unsichtbar) |
| B | Story-Prolog, Tutorial, Weihnachts-Sonderstart, Kapitel 1–2 | November bis 15.12. | Die Insel erklärt sich selbst, es gibt eine Geschichte |
| C | Grafik-Probeszenen und Entscheidung (läuft neben B) | November | Auftraggeber + Kinder wählen den Stil |
| D | Inhalte Prio 1: Lesen Kl. 1, DaZ D0/D1, Wortschatz-Kern, Mathe Kl. 1/Vorschule, Ukrainisch | Dezember bis Februar | Kinder ohne Deutsch und Erstklässler können loslegen |
| E | Verzahnung und Individualisierung: Können je Lernziel, Kapitel 3–4, Interessen-Kulissen | ab Januar | Aufgaben passen sich an, Lernen baut sichtbar die Insel |
| F | Grafik-Neubau nach Wahl, Minispiele Prio 1–2 | ab Januar, abwechselnd mit D/E | schönere Insel, mehr Abwechslung |
| G | Inhalte Prio 2/3, weitere Länder und Sprachen, Kapitel 5–7, Übergang 5, Vorschul-Pfad | 2027 | breite Abdeckung |

Regel für jede Sitzung: höchstens **ein** großes Paket gleichzeitig offen; jedes Paket endet mit grünem Rauchtest, Push und
einem Eintrag „Stand <Datum>“ in diesem Dokument.

### Arbeitspaket-Backlog (priorisiert)
Größe: **S** ≈ 1 Sitzung, **M** ≈ 2–3 Sitzungen (in einzeln auslieferbaren Schritten a/b/c), **L** ≈ 4+ Sitzungen.
Alle Pakete: kein Bezug zu einem echten Kind, Texte mit Sprachschlüsseln, Rauchtest grün, neue Test-Haken in `tests/rauchtest.js`.

#### Phase A – Fundament
**NA-01 Story-Zustand und Insel-Ereignisse** (S)
- Ziel: ein Ort für den Story-Fortschritt und ein einfacher Nachrichtenweg zwischen Features.
- Dateien: neu `shared/ereignisse.js` (`Ereignisse.melde(art, daten)`, `Ereignisse.hoere(art, fn)`, Arten `fund`, `bild`, `melodie`,
  `bauwerk`, `kapitel`, `etappe`), `shared/spielstand.js` (neues Feld `story: { kapitel, etappen: {}, gesehen: [], chronik: [] }`,
  Migration alter Spielstände), `shared/lernfunde.js` meldet `fund`, `spiele/atelier/atelier.js` meldet `bild`, `musik.js` meldet `melodie`.
- Abnahme: alter Spielstand lädt ohne Fehler und bekommt `story` mit Kapitel 0; Ereignisse kommen auf derselben Seite und
  (über den Spielstand) seitenübergreifend an; QR-Transfer bleibt unter der bisherigen Größe + 200 Byte.
- Test: Node-Test für Migration; Playwright: Lernfund erzeugen → `story`/Ereignis im Spielstand sichtbar.

**NA-02 Profil erweitern: Stufe, Deutschstand, Länder** (S)
- Ziel: Grundlage für Individualisierung und Länder-Filter (KONZEPT Abschnitt 4).
- Dateien: `spiele/eltern/eltern.js`, `index.html` (Ersteinrichtung), `shared/core.js` (Profilfelder `stufe`: `vs|1|2|3|4|5`,
  `deutschstand`: `keine|wenig|alltag|gut`, `land`: `sn|nw|by|bw|ni|bb`); bestehendes Feld Klasse wird zu `stufe` übernommen.
- Abnahme: Ersteinrichtung fragt Stufe, Bundesland, Muttersprache und Deutschstand (kurze Erklärung je Wert, später in der Elternsprache);
  alle bisherigen Klassenabfragen funktionieren weiter; „Übergang 5“ und „Vorschule“ wählbar, auch wenn es noch wenig Inhalt gibt (ehrlicher Hinweis).
- Test: Rauchtest mit Ersteinrichtung je Stufe; alter Spielstand mit Klasse 2 → `stufe: "2"`.

**NA-03 Lehrplan-Kern und Lernziel-IDs** (M)
- Ziel: Datenformat aus `LEHRPLAN.md` („Inhalte als Daten“) einführen, ohne bestehende Inhalte umzubauen.
- Schritte: (a) `shared/lehrplan/kern.js` mit Lernziel-IDs für Mathe und Deutsch Kl. 1–4 (KMK 2022, **fünf** Deutsch-Bereiche statt vier);
  (b) `shared/lehrplan/laender/sachsen.js` aus `shared/lehrplan.js` überführen, `window.LEHRPLAN` als Kompatibilitäts-Schicht;
  (c) `lz`-Verweise an Matheweg-Stationen, Fipsi-Kapiteln, Sachthemen; Abdeckung wird errechnet; `tests/lehrplan.js`.
- Abnahme: „📘 Was übt die App?“ im Elternbereich zeigt dasselbe wie vorher (plus Hinweis auf errechnete Abdeckung);
  `tests/lehrplan.js` listet Lernziele ohne Inhalt.
- Test: Node-Test `tests/lehrplan.js`; Rauchtest Elternbereich.

#### Phase B – Story und Tutorial (Ziel: 15.12.2026)
**NA-10 Szenen-Baustein und Zeigehand** (M)
- Ziel: ein Baustein für alle Story- und Tutorial-Momente (KONZEPT Abschnitt 1 „Regeln für die Geschichte“, Abschnitt 2).
- Dateien: neu `shared/szene.js` (Sprechblasen-Folge mit Figurenkopf, höchstens 4 Blasen, jede automatisch vorgelesen – abschaltbar –,
  Hilfesprache-Knopf, „Weiter“ groß), neu `shared/zeige.js` (Zeigehand und Leuchten auf ein DOM-Element oder einen 3D-Punkt),
  `shared/style.css`; Einbindung in `quellen/welt3d/heimat.js`.
- Abnahme: Szene auf Startseite und Insel abspielbar; ohne Lesen bedienbar (Ton + Zeigehand); in Quer- und Hochformat ohne Überlauf;
  gesehene Szenen landen in `story.chronik`.
- Test: Test-Haken `window.__szene` (spiele, aktuell, weiter); Screenshots quer/hoch mit Russisch als Hilfesprache.

**NA-11 Prolog „Ankunft“ (Tutorial E1)** (M)
- Ziel: Robo Pixel bringt das Kind mit dem Boot, Joystick-Zeigehand, Weg zum Haus, Aktionsknopf „Reingehen“.
- Dateien: `quellen/welt3d/heimat.js` (Boot am Steg, Ankunfts-Kamerafahrt, Pixel kurz auf der Insel), `shared/szene.js`.
- Abnahme: Neues Kind erlebt den Prolog genau einmal; Eltern können ihn im Elternbereich überspringen/neu starten;
  Kind kann ihn bei Pixel („Wie ging das nochmal?“) wiederholen; läuft auf „einfach“.
- Test: Playwright neues Kind → Prolog → Haus betreten (`__heimat.reingehen`), `story.etappen.E1 = true`.

**NA-12 Insel-Zugang neu regeln** (S, Antwort 26.10.2026: ja – erledigt)
- Ziel: Statt des kompletten Tablet-Führerscheins öffnet die Lektion „Bedienung“ (im Prolog) die Insel; übrige Lektionen werden
  Aufgaben in Kapitel 1–2. Elternschalter „Insel erst nach komplettem Führerschein“ behält die alte Regel.
- Dateien: `index.html` (`inselOffen`), `spiele/medien/medien.js`, `spiele/eltern/eltern.js`.
- Abnahme: beide Einstellungen funktionieren; bestehende Kinder mit Führerschein merken nichts.
- Test: Rauchtest beide Schalterstellungen.

**NA-13 „Erst lernen“ und erste Frucht (Tutorial E2, E3) mit Nebelrand** (M)
- Ziel: Sonnenuhr am Steg (dunkel → hell mit Spielzeit), erster Lernblock mit Führung, erste Frucht mit Ella, Nebel weicht ein Stück.
- Dateien: `quellen/welt3d/heimat.js` (Sonnenuhr, Nebelrand abhängig von `Lernfunde.summe`/Kapitel), `quellen/welt3d/welt.js`
  (Nebelbereiche je Kapitel), `shared/zeit.js` (Zustand für die Sonnenuhr), `shared/szene.js`.
- Abnahme: Nebel kostet ≤ 2 Zeichenaufrufe; Kapitel 1 öffnet bei 1 Lernfund; nichts geht verloren, wenn das Kind abbricht.
- Test: `__heimat` um `nebel()` und `sonnenuhr()` erweitern; Playwright mit `?stunde=14`.

**NA-14 Tutorial E4–E8 und Etappen-Steuerung** (M)
- Ziel: Sterne/Zimmer (Benno), Ei (Pixel), erste Spielzeit, Lernkartei (Fipsi), „Wie geht's dir?“ (Bruni); höchstens zwei neue
  Etappen pro Tag; Wiederholen bei Pixel.
- Dateien: neu `shared/tutorial.js` (Etappen-Liste, Auslöser, Tageslimit), `heimat.js`, `spiele/tier/tier.js`, `shared/lernkartei.js`.
- Abnahme: Etappen erscheinen nur beim Auslöser; Tutorial im Elternbereich überspringbar; bestehende Kinder bekommen nur Etappen,
  deren Feature sie noch nie genutzt haben.
- Test: Uhr per `window.__jetzt` über drei Tage vorstellen, Etappen-Reihenfolge prüfen.

**NA-15 Weihnachts-Sonderstart** (S)
- Ziel: Erststart 1.–26.12. → Ankunft im Schnee, Paket am Steg (Ei mit Schleife, Tannenbaum fürs Zimmer), Pixel mit Lichterkette.
- Dateien: `heimat.js` (`?monat=12` vorhanden), `shared/szene.js`, Zimmer-Möbel Tannenbaum.
- Abnahme: außerhalb Dezember gleicher Prolog ohne Schnee/Paket; Tannenbaum bleibt im Zimmer, kann weggeräumt werden.
- Test: `window.__jetzt` auf 10.12. und 10.11.

**NA-16 Weihnachts-QR-Geschenk (signiert)** (M, Antwort 26.10.2026: privater Schlüssel nur beim Auftraggeber, Node-Skript – einverstanden; Geschenk-Auswahl noch offen)
- Ziel: QR-Code mit Geschenk (z. B. Ei mit Schleife, Möbel), signiert; jeder Code einmal pro Kind; funktioniert offline.
- Dateien: neu `shared/geschenk.js` (Prüfung mit öffentlichem Schlüssel über WebCrypto ECDSA P-256), Scanner aus dem QR-Transfer
  wiederverwenden, `quellen/geschenk-erzeugen.js` (Node, läuft nur beim Auftraggeber, privater Schlüssel **nie** im Repo).
- Abnahme: gefälschter oder doppelter Code wird freundlich abgelehnt; Geschenk erscheint am Steg.
- Test: Node-Test mit Test-Schlüsselpaar (nur für Tests, als solches markiert).

**NA-17 Kapitel 1 „Der Spross“ und 2 „Fipsis Karte“** (M)
- Ziel: Kapitel-Bedingungen (Lernfunde + Fach-Bedingung), Szenen, ein neuer Weg; Wörter aus Fipsis Kapiteln stehen auf Insel-Schildern.
- Dateien: neu `shared/kapitel.js` (Bedingungen aus KONZEPT „Kapitelbogen“), `heimat.js` (Schilder, Weg), `spiele/deutsch/abenteuer.js` (Kartenstück).
- Abnahme: Kapitel öffnen sich nie rückwärts, keine Fristen; Schilder zeigen nur Wörter, die das Kind schon hatte.
- Test: Spielstand mit 5 Funden + Deutsch-Kapitel → Kapitel 2 aktiv, Schild-Text prüfen.

**NA-18 Inselchronik im Stickeralbum** (S)
- Ziel: jede gesehene Szene noch einmal ansehen (KONZEPT „Regeln für die Geschichte“).
- Dateien: `spiele/album/album.js`, `shared/szene.js`.
- Abnahme: Chronik-Seite listet Szenen in Reihenfolge, Abspielen mit Ton.

#### Phase C – Grafik-Entscheidung (neben Phase B)
**NA-20 Probeszenen B+, C, D mit Messwerten** (M)
- Ziel: Entscheidungsgrundlage (GRAFIK Abschnitt 2). Gleiche Szene (Kind, Fipsi, Baum, Haus, Wasser, Wiese) in drei Stilen.
- Dateien: `quellen/welt3d/probe.js` (`?stil=b2|c|d`, bestehende `a`/`b` bleiben), `spiele/welt3d/probe.html`, Einblendung von
  `renderer.info` (Zeichenaufrufe, Dreiecke, Texturen) und Bildern/s.
- Abnahme: alle drei Stile im Leistungsbudget „schön“; Vergleich nebeneinander per Knopf; Screenshots in den Plan.
- Test: `tests/leistung.js` (NA-21) über alle Stile.

**NA-21 Leistungs-Test** (S)
- Ziel: Zählwerte je 3D-Szene automatisch erfassen (Bilder/s unter Swiftshader sind nicht aussagekräftig).
- Dateien: neu `tests/leistung.js`; Test-Haken `__heimat.info()` u. a.
- Abnahme: Tabelle Zeichenaufrufe/Dreiecke je Szene und Landschaft; Warnung über Budget aus GRAFIK Abschnitt 6.

**NA-22 Eine Kind-Figur für alle 3D-Szenen** (M)
- Ziel: doppelte Kind-Figur (`heimat.js` und `figur3d.js`) zusammenführen; Kleiderschrank-Daten als einzige Quelle. Unabhängig vom Stil.
- Dateien: `quellen/welt3d/figur3d.js`, `heimat.js`, `lauf.js`, `kart.js`, `bau.js`.
- Abnahme: Insel und alle Minispiele zeigen dieselbe Figur mit derselben Kleidung; keine Funktion fällt weg.
- Test: Screenshots aller 3D-Seiten mit gleichem Spielstand.

**NA-23 Neubau nach Stilwahl** (L, startet erst nach der Entscheidung)
- Reihenfolge laut GRAFIK Abschnitt 7: Kind → Fipsi → Ella → Benno → Pixel → Bruni → Paula → Tilda → Tiere → Deko → UI.
  Je Figur ein eigenes S-Paket: `shared/figuren-daten.js` (Farben, Proportionen) → 2D-SVG + 3D, sieben Grund-Animationen.

#### Phase D – Inhalte Priorität 1 und Sprachen
**NA-30 Anlaute und Buchstabe–Laut (Deutsch Kl. 1, Vorschule)** (M) – `inhalte/deutsch/`, Wortschatz-Kern; Abnahme: 26 Buchstaben +
  Umlaute mit Bild und Ton, ohne Lesepflicht; Lernkartei; Lernziel-IDs `de.le.*`, `de.su.*`.
**NA-31 Silben lesen und erste Lesetexte** (M) – Silbenbögen, 20 kurze Bildtexte mit Fragen (Kl. 1–2); Verknüpfung mit Sachthemen.
**NA-32 Mathe Kl. 1 und Vorschule: Mengen** (M) – Mengen bis 10/20 mit Material (Würfelbilder, Zwanzigerfeld), eigene Stufe statt Kl.-2-Stationen.
**NA-35 Schreiben: Wörter nachspuren und tippen** (M) – Druckschrift nachspuren (Finger), Wörter aus dem Wortschatz-Kern tippen.
**NA-40 Wortschatz-Kern und DaZ D0 „Ankommen“** (M)
- Ziel: `inhalte/woerter/*.js` nach LEHRPLAN-Format; `shared/woerter.js` liest daraus (Wort des Tages bleibt); DaZ D0: 100 Wörter, 20 Sätze.
- Abnahme: Wort hat Bild, Artikel mit Farbe **und** Form, Mehrzahl, Silben, deutschen Ton; Kind mit Deutschstand „keine“ landet in D0.
- Test: Node-Test Wortschatz-Kern (jede ID eindeutig, jedes Wort mit Bild); Playwright DaZ-Pfad.
**NA-42 Ukrainisch als zweite Hilfesprache** (M, **braucht zwei Muttersprachler**) – Glossar `docs/glossar/uk.md`, Status je Text,
  `tests/sprachen.js`; `fertig: true` erst, wenn Tutorial, Prolog, D0 und Oberfläche geprüft sind (SPRACHEN Abschnitt 6).
**NA-43 Ton-Aufnahmen offline** (M) – `audio/<sprache>/<id>.m4a`, eigener Cache je Sprache im Service Worker, Reihenfolge Aufnahme > Gerätestimme > kein Ton,
  „Stimmen testen“ im Elternbereich.
**NA-44 RTL-Technik und Arabisch vorbereiten** (S) – `dir="rtl"` nur für Hilfe-Elemente, getrennte Elemente in gemischten Zeilen, Screenshots im Rauchtest.
**NA-45 Elternbereich in der Elternsprache** (M, alt aus Phase 0) – Elternbereich-Texte als Sprachschlüssel, Elternsprache getrennt von der Hilfesprache.

#### Phase E – Verzahnung und Individualisierung
**NA-50 Können je Lernziel und nächste Aufgabe** (M) – Stand 0–4 je Lernziel-ID im Profil (kompakt), Auswahl der nächsten Aufgabe
  (Ziel 70–85 % Treffer), leichter nach zwei Fehlern; zuerst im Matheweg. Test: Simulations-Test in Node.
**NA-51 Kapitel 3 „Bennos Brücke“ + Bauwerk in der Welt** (M) – Mathe-Stationen liefern Baupläne, Bauwerk vom Bauplatz steht in der eigenen Welt (alt offen).
**NA-52 Kapitel 4 „Paulas Fest“** (M) – eigene Bilder als Festplakate, eigene Melodie auf der Bühne, Ballon-Party als Festspiel.
**NA-53 Interessen-Kulissen** (S) – gleiche Aufgabe, andere Bilder (Tiere, Fahrzeuge, Weltraum, Natur) aus Wünsche-Assistent und Minispiel-Wahl.
**NA-54 Muttersprache dosiert („Ausschleichen“)** (S) – Hilfe sichtbar → auf Knopfdruck → nur bei neuen Wörtern, nach Deutschstand.
**NA-55 Stärken und Lernkartei verzahnen** (S) – Stärken schlagen Minispiele/Szenen vor; Lernkartei-Wort nach Minispielen (freiwillig).

#### Phase F – Minispiele (Katalog in `MINISPIELE.md`)
**NA-60 Lern-Varianten bestehender Spiele** (S) – Ballons mit Zahlen/Wörtern, Wort-Tore im Sternenlauf, Tanzschritte auf der Bühne.
**NA-61 Wörter-Angeln** (S) · **NA-62 Insel-Garten** (M) · **NA-63 Tierpflege-Station** (M) · **NA-64 Bäckerei Benno** (M) ·
**NA-65 Murmelbahn** (M) · **NA-66 Rhythmus-Boot** (M) · **NA-67 Wetter-Drache** (S) · **NA-68 Kart-Strecke passend zur Landschaft** (M, alt offen).
Jedes Spiel: Prüffragen aus `MINISPIELE.md` Abschnitt 1, Test-Haken, Eintrag in `SEITEN_3D`, Leistungs-Test.

#### Phase G – Breite (2027)
NA-33 Mathe Kl. 3 · NA-34 Sachunterricht je Perspektive · NA-36 Deutsch Kl. 3–4 · NA-37 Mathe Kl. 4 · NA-38 Medienbildung
„Produzieren/Problemlösen“ (Roboter-Weg) · NA-39 Übergang 5 · NA-41 Vorschul-Pfad · NA-46 Arabisch, Türkisch und weitere Sprachen ·
NA-47 Länderprofile NRW, BY, BW, NI, BB · NA-56 Kapitel 5–7 · russische Volkslied-Melodien (Noten prüfen).

#### Laufend (in jeder passenden Sitzung)
- iPad-10-Test nach jedem 3D-Paket (Leistung, Atelier, Musik-Ton); Rückmeldung des Auftraggebers einarbeiten.
- Spielstand-Export für den ganzen Haushalt (alt offen aus Phase 0).
- `docs/LIZENZEN.md` anlegen, sobald die erste fremde Datei (CC0-Modell, Noto-Schrift, Stimme) ins Repo kommt.

### Reihenfolge (gültig ab 26.10.2026, ersetzt die bisherigen Reihenfolgen)
1. ~~**NA-01** Story-Zustand und Ereignisse~~ → ~~**NA-02** Profil erweitern~~
2. ~~**NA-10** Szenen-Baustein~~ → ~~**NA-11** Prolog~~ → ~~**NA-13** Erst lernen/erste Frucht~~ → ~~**NA-15** Weihnachts-Sonderstart~~
   (**Meilenstein 15.12.2026:** Prolog, E1–E3, Weihnachten – technisch erreicht am 27.10.2026, iPad-Test steht aus)
3. **Vorgezogen (27.10.):** **NA-20** Probeszenen – Auswahl auf „Rund“ oder „Pixel“ eingegrenzt, Proben stehen, Entscheidung offen → **NA-21** Leistungs-Test (nur bei „Rund“ dringend)
4. **NA-14** Tutorial E4–E8 → ~~**NA-12** Insel-Zugang~~ → **NA-16** QR-Geschenk → **NA-17** Kapitel 1–2 → **NA-18** Chronik
5. ~~**NA-03** Lehrplan-Kern~~ → ~~**NA-40** Wortschatz-Kern/DaZ D0~~ → ~~**NA-30** Anlaute~~ → ~~**NA-32** Mathe Kl. 1/Vorschule~~ → ~~**NA-31** Lesen~~ → ~~**NA-35** Schreiben~~ → ~~**NA-50** Können je Lernziel~~
6. **NA-22** eine Kind-Figur → **NA-23** Neubau nach Stilwahl (abwechselnd mit 7)
7. ~~**NA-50** Können je Lernziel~~ → **NA-51** Bennos Brücke → **NA-52** Paulas Fest → NA-53/54/55
8. **NA-44** RTL → **NA-43** Ton-Aufnahmen → **NA-42** Ukrainisch (sobald Muttersprachler bereitstehen, darf es vorgezogen werden)
9. Minispiele **NA-60**, **NA-61**, **NA-62**, **NA-64**, dann der Rest; Phase G

### Offene Fragen an den Auftraggeber
Antworten vom 26.10.2026: Frage 1 **ja** (umgesetzt in NA-12), Frage 2 **ja** zum Schlüssel-Verfahren (welche Geschenke, ist noch offen).
Keine neuen Rückmeldungen vom iPad 10; Reihenfolge gilt unverändert; nichts ist für die Sitzung gesperrt.

1. **Insel-Zugang (NA-12):** Reicht künftig die Lektion „Bedienung“ im Prolog, und die übrigen Führerschein-Lektionen werden Aufgaben in
   Kapitel 1–2? (Vorschlag: ja, mit Elternschalter für die alte Regel.)
2. **QR-Geschenke (NA-16):** Einverstanden, dass ein privater Schlüssel nur beim Auftraggeber liegt und Geschenke per Node-Skript erzeugt werden?
   Welche Geschenke zu Weihnachten 2026?
3. **Grafik (NA-20):** Wann kann der Vergleich der Probeszenen auf dem iPad 10 mit 2–3 Kindern stattfinden?
4. **Menschen fürs Gegenlesen:** Gibt es Muttersprachler für Ukrainisch (und Arabisch, Türkisch) sowie eine Grundschul- und eine DaZ-Lehrkraft
   für die Fachprüfung? Ohne sie bleibt eine Sprache im Status `entwurf` und erscheint nicht im Kinder-UI.
5. **Tonaufnahmen:** Wer spricht die deutschen Aufnahmen für Wortschatz, Tutorial und Prolog ein (ruhige Erwachsenenstimme), und ist eine
   vorab erzeugte Sprachausgabe (z. B. Piper) für Sprachen ohne Gerätestimme in Ordnung, wenn ein Muttersprachler sie anhört?


### Stand 27.10.2026 (Sitzung 26./27.10.: NA-01, NA-02, NA-10, NA-11, NA-12, NA-13, NA-15)
**Fertig und gepusht** (jeweils mit eigenem Test, Rauchtest grün, `/dev` gebaut):
- **NA-01** `shared/ereignisse.js`: `Ereignisse.melde/hoere/offene/abholen` (Arten `fund`, `bild`, `melodie`, `bauwerk`, `kapitel`, `etappe`);
  Ereignisse ohne Zuhörer, der sie erledigt (`return true`), werden in `story.offen` vorgemerkt (höchstens 20). `window.Story` mit Kapitel
  (nie rückwärts), Etappen, gesehenen Szenen, Chronik, Geschenken. Migration in `bereinige()` (Node-Test `tests/story-migration.js`) und beim Laden;
  QR-Daten wachsen um ~44 Zeichen. Gemeldet wird aus `lernfunde.js`, Atelier (`bild`) und Musik (`melodie`). Test `tests/ereignisse.js`.
- **NA-02** Profil: `stufe` (vs, 1–4, 5), `land` (sn, nw, by, bw, ni, bb), `muttersprache` (auch ohne fertige Hilfe), `deutschstand`
  (keine/wenig/alltag/gut) mit kurzer Erklärung; `klasse` bleibt für alte Abfragen (vs → 1, 5 → 4). Ehrliche Hinweise für Vorschule,
  Übergang 5 und Länder ohne eigenen Lehrplan („Was übt die App?“ zeigt dann Sachsen als Beispiel). Alte Spielstände: Klasse 2 → `stufe: "2"`,
  `"sachsen"` → `"sn"`. Test `tests/profil.js`.
- **NA-10** `shared/szene.js` (höchstens 4 Blasen, Vorlesen an/aus, Hilfesprache-Knopf, bei Deutschstand keine/wenig gleich sichtbar,
  „Weiter“ leuchtet nach dem Vorlesen, `bis` = warten auf eine Handlung, `beim` = etwas passiert in der Welt, Blase rutscht nach oben,
  wenn sie das Ziel verdeckt) und `shared/zeige.js` (Zeigehand, Leuchten, Schiebe-Geste, Pfeil am Rand für Ziele außerhalb des Bildes).
  Übersetzungen mit `status: { ru: "entwurf" }` erscheinen **nur in /dev** (gestrichelt markiert), nie auf der Hauptseite.
  Probeszene `?szene=probe` auf Startseite und Insel. `window.Insel.ort("haus")` usw. für 3D-Ziele. Test `tests/szene.js`.
- **NA-11** Prolog „Ankunft“ (E1): Steg mit Pixels Boot am Südufer (mit der Deko verschmolzen), Kamerafahrt, Laufen mit Zeigehand
  (oder Tippen), Haus, Aktionsknopf. Im Prolog darf das Kind auch ohne Spielzeit ins Haus. **Robo Pixel wohnt wieder auf der Insel** (am Steg)
  und bietet „🔁 Wie ging das nochmal?“ an. Elternbereich: Karte „🧭 Geschichte und Einführung“ (Ankunft überspringen/neu starten).
  Kinder mit komplettem Führerschein von früher bekommen E1–E3 automatisch (Wert `1` = übernommen). Texte in `shared/szenen.js`. Test `tests/prolog.js`.
- **NA-12** Insel-Zugang: `Spielwelt.inselOffen()` – Standard: erste Lektion „Das Tablet bedienen“ öffnet die Insel; Elternschalter
  „Insel erst nach dem kompletten Tablet-Führerschein (alte Regel)“. **Minispiele brauchen weiter den kompletten Führerschein**
  (sonst zurück auf die Insel bzw. Pixels Hinweis). Lektionsende zeigt „🏝️ Zur Insel“. Test `tests/zugang.js`.
- **NA-13** Sonnenuhr am Steg (dunkel → gelb mit Lernfortschritt, hell mit Spielzeit, antippbar), Szene „Erst lernen“ (E2), Szene
  „Die Sonne geht auf“, Szene „Erste Frucht“ (E3 = Kapitel 1 „Der Spross“) mit **weichendem Nebel** (Fog-Werte + ein Nebelband = 1 Zeichenaufruf).
  Höchstens zwei neue Etappen am Tag (`Story.darfNeueEtappe()`). Test `tests/tutorial.js` (stellt die Uhr um einen Tag vor).
- **NA-15** Weihnachts-Sonderstart: E1 zwischen 1. und 26.12. → Paket am Steg (wartet, bis es geöffnet ist), darin Tannenbaum (neues
  Geschenk-Möbel, steht gleich im Zimmer, wegräumbar) und Schleife fürs Tier; im Dezember Lichterkette an Steg und Boot (1 Zeichenaufruf).
  Geschenke landen in `story.geschenke` (Grundlage für NA-16). Test `tests/weihnachten.js`.

**Abweichungen vom Plan / Entscheidungen**
- Story-Daten liegen in `profil.daten.story` (Migration in `ereignisse.js`, beim Import in `spielstand.js`), nicht in einer eigenen Datei.
- E2 gilt mit der Szene „Erst lernen“ als erledigt (nicht erst, wenn die Sonne aufgeht); das Aufgehen ist eine eigene Szene ohne Etappe.
  Wer schon Spielzeit hat, sieht statt „Erst lernen“ gleich „Die Sonne geht auf“; ohne Zeit-Regeln wird E2 still erledigt.
- Der Nebel richtet sich nach dem höheren Wert aus Kapitel und Lernfunden (1/5/15), Lernfunde zählen aber erst nach E3 –
  so sieht ein neues Kind den Nebel weichen, und Kinder mit vielen Funden sehen keinen.
- „Ei mit Schleife“ ist als **Schleife fürs Tier** umgesetzt (das Kind sucht sein Ei weiter selbst aus).
- Die Insel lag schon vorher über dem Leistungsbudget (erste Insel „schön“ ≈ 495, „einfach“ ≈ 335 Zeichenaufrufe je nach Blick);
  NA-11/13/15 kommen zusammen auf etwa +12 (Robo Pixel zurück, Sonnenuhr-Sonne, Nebelband, Lichter). Das Budget löst NA-21/NA-20.
- Russische Texte der Szenen sind Entwürfe (`entwurf`) und brauchen eine Prüfung durch eine Muttersprachlerin.
- `tests/laufen.sh <name>` startet einzelne Tests (`ereignisse`, `profil`, `szene`, `prolog`, `zugang`, `tutorial`, `weihnachten`).

**Offen / als Nächstes**
- **iPad 10 testen** (in `/dev`): neues Kind anlegen → erste Lektion bei Pixel → Insel (Ankunft, Joystick-Hand, Haus) → Insel nochmal öffnen
  („Erst lernen“) → lernen → Insel („Sonne geht auf“) → am nächsten Tag „Erste Frucht“ und Nebel. Hochformat, Ton, Grafik „einfach“.
  Weihnachten: im Testmodus `/dev/test` mit Uhr im Dezember nicht direkt einstellbar → am besten am 1.12. mit einem neuen Kind ansehen.
- Nächstes Paket: **NA-14** Tutorial E4–E8 (`shared/tutorial.js`), daneben **NA-21** Leistungs-Test → **NA-20** Probeszenen.
- NA-16 braucht die Geschenk-Auswahl für Weihnachten 2026; NA-18 (Chronik im Album) kann die Szenen aus `shared/szenen.js` direkt abspielen.

### Stand 27.10.2026, Nacht (Sitzung 27.10.: Grafik-Entscheidung vorbereitet, NA-20 neu gefasst)
**Antworten des Auftraggebers (27.10.2026):** iPad-Test von Ankunft/Sonnenuhr/Erste Frucht/Weihnachts-Paket steht noch aus;
Geschenke für NA-16 noch offen; **Grafik zuerst** (vor NA-14); nichts gesperrt. Neu: **eine ganz andere Engine ist erlaubt**,
**Smartphones zählen** (Gewicht entscheidet er nach dem Vergleich), und zur Wahl stehen am Ende nur noch zwei Looks:
**„Rund“ wie Animal Crossing** (heutiger Stil B, three.js) oder **„Pixel“** (Draufsicht mit 16×16-Kacheln wie Handheld-Abenteuer
der 2000er – eigener Stil, keine fremden Figuren/Kacheln).

**Gemacht (gepusht, Test `tests/probe.js` grün, Rauchtest grün)**
- Vergleich mehrerer Engines mit derselben Insel (PixiJS 2D-Bilderbuch und isometrisch, Babylon.js 9.32, PlayCanvas 2.23, three.js) –
  nach der Eingrenzung wieder entfernt; Messwerte zum Nachlesen: Pixi 2D 25 Aufrufe/0,84 MB, Pixi isometrisch 15/0,84 MB,
  Babylon 82 Aufrufe (feste Deko je Material verschmolzen)/1,7 MB, PlayCanvas 82 (Batching)/2,3 MB.
- **Pixel-Probe** `spiele/probe/` (Quelle `quellen/probe/pixel.js`, gebaut mit `quellen/probe/bauen.js`): PixiJS 8.22, Karte 40×30
  Kacheln, Wasser in zwei Bildern, Kind mit vier Blickrichtungen und Schrittbildern, Fipsi folgt, Textfeld im Retro-Stil; alles im Code
  gezeichnet (Formen → feste Palette → automatischer Umriss). Ganzzahlige Vergrößerung (iPad ×4, Handy ×2) hält die Pixel scharf.
  Messwerte: **1 Zeichenaufruf, ≈ 5.000 Dreiecke, 0,84 MB** – mit Abstand am sparsamsten, ideal fürs Handy.
- „Rund“-Probe `spiele/welt3d/probe.html?stil=b` (unverändert) hat jetzt einen Knopf „👾 Pixel“ und umgekehrt – zum direkten Vergleich.
  Messwerte rund: 230–400 Aufrufe, 150–260 Tsd. Dreiecke (ohne Verschmelzen; heimat.js verschmilzt Deko bereits).
- Vorbereitung NA-21: `messe()` in `quellen/welt3d/gemeinsam.js`, `__heimat.info()`, `__welt3d.info()`, `__probe.info()`;
  `window.__keinSparen` schaltet im Test den automatischen Sparmodus der Insel ab. `tests/leistung.js` selbst ist noch nicht gebaut.
- `docs/LIZENZEN.md` angelegt (three.js, PixiJS und dessen Bausteine; Lizenztexte in `spiele/probe/LIZENZEN.txt`).

**Entscheidungen / Abweichungen**
- In der Arbeitsumgebung sind npm und CDNs gesperrt; PixiJS wird aus dem GitHub-Quellcode gebündelt (Anleitung im Kopf von `bauen.js`).
- Kinder sollen den Stil **nicht** frei wählen können (jede Figur/jedes Möbel müsste doppelt gezeichnet werden). Vorschlag an den Auftraggeber:
  Kinder stimmen beim Vergleich ab; später höchstens zwei Looks mit gemeinsamer Spiel-Logik.
- Pixel heißt praktisch: Insel und Minispiele würden in 2D neu gebaut (Spiel-Logik, Story, Spielstand bleiben). Rund heißt: three.js bleibt,
  Budget-Arbeit (NA-21, Verschmelzen) und Figuren-Feinschliff.

**Offen / als Nächstes**
- **Auftraggeber + Kinder vergleichen auf iPad 10 und Handy:** `/dev/spiele/probe/` (Pixel) und `/dev/spiele/welt3d/probe.html?stil=b` (Rund).
- Danach: Stil festlegen und GRAFIK.md anpassen; bei „Pixel“ neues Paket „Insel in 2D“ planen, bei „Rund“ **NA-21** → Budget.
- Dann **NA-14** Tutorial E4–E8; NA-16 wartet weiter auf die Geschenk-Auswahl.

### Zwei Looks (Entscheidung 27.10.2026)
Antwort des Auftraggebers nach dem Vergleich: **„Immer beides, kann jederzeit umgeschaltet werden.“** Die App bekommt zwei gleichwertige
Darstellungen derselben Welt: **„Rund“** (three.js, wie Animal Crossing, heutige Insel) und **„Pixel“** (PixiJS, Draufsicht aus 16×16-Kacheln).
Spielstand, Story, Etappen, Lernfunde, Zimmer, Tier und Orte gibt es nur einmal; Umschalten verliert nichts. GRAFIK.md Abschnitt 2 ist damit entschieden.

Neue Pakete (vor NA-14):
- **NA-24 Welt-Kern trennen** (M): Orte, Stationen, Aktionen, Story-Auslöser (`naechsteStory`/`spieleStory`), Paket, Nebelstufe und Zimmer-Daten
  aus `quellen/welt3d/heimat.js` nach `shared/insel-kern.js` (`window.InselKern`). Abnahme: Rund-Insel unverändert, alle Tests grün; Node-Test `tests/inselkern.js`.
- **NA-25 Umschalter** (S): Profilfeld `look` (`rund`|`pixel`, Standard `rund`, Migration), `Spielwelt.look()`, Knopf auf der Insel, Karte im
  Elternbereich (Umschalten fürs Kind sperrbar), Einstieg leitet je nach Look weiter. Test `tests/look.js`.
- **NA-26 Pixel-Insel** (L, a/b/c): PixiJS-Insel aus `InselKern` (Kacheln je Biom, Stationen, Aktionsknopf, Szenen, Zeigehand über
  `window.Insel.ort()`), Prolog E1–E3 und Weihnachts-Paket spielbar; Pixi-Bündel offline in `sw.js`, Lizenzen in `LIZENZEN.md`.
- **NA-27 Pixel-Figuren** (M): Kind aus Kleiderschrank-Daten als Sprite (vier Richtungen), Tiere und Insel-Figuren. Ab jetzt wird jede neue
  Figur, jedes Möbel, jedes Bauwerk in beiden Looks gebaut (oder als offen vermerkt).
- **NA-28 Pixel-Zimmer** (M): Zimmer und Möbel in Pixel, gleiche Möbel-Daten.
- Minispiele bleiben vorerst 3D und werden aus beiden Looks gestartet; Pixel-Fassungen später je Spiel. NA-21 (Leistung „Rund“) bleibt wichtig.

**Reihenfolge ab 27.10.2026 (ersetzt Punkt 3–4 oben):** ~~**NA-24**~~ → ~~**NA-25**~~ (in /dev eingeschaltet) → ~~**NA-26**~~ → ~~**NA-27**~~ → ~~**NA-28**~~ → ~~**NA-14**~~ (in beiden Looks)
→ ~~**NA-21**~~ → **NA-29** Budget „Rund“ (Teil 1 ✔, Teil 2 Minispiele offen) → NA-16 (wartet auf Geschenk-Auswahl) → NA-17 → NA-18 → Punkt 5 ff. wie oben.

### Stand 27.10.2026, morgens (Sitzung 27.10. früh: DS-Look, NA-24 fertig, NA-25 vorbereitet, NA-26 begonnen)
**Antworten des Auftraggebers (27.10.2026, 04:40):** „Pixel“ soll moderner sein – **Nintendo-DS-Zeit**, gewählt: **Draufsicht wie bei den
Handheld-Abenteuern um 2010** (nicht 2,5D, nicht Low-Poly). Umschalter: Knopf auf der Insel **und** Karte im Elternbereich, **Kinder dürfen
selbst umschalten** (Eltern können es sperren). Reihenfolge: erst DS-Probe, dann NA-24 ff. iPad-Test von Ankunft/Sonnenuhr/Frucht/Paket: noch nicht.
Geschenke für NA-16: weiter offen.

**Fertig und gepusht**
- **DS-Look der Pixel-Probe** (`quellen/probe/pixel.js`, `/dev/spiele/probe/`): Farbreihen mit 5 Stufen, Licht von oben links, schmale Rasterung,
  farbige Umrisse, weiche Bodenübergänge (Graskante, Schatten, Schaum, Wassertiefe), Schatten unter allem, Wolkenschatten, ein Bildatlas,
  DS-Textfeld. Weiter **1 Zeichenaufruf**, 0,85 MB. Stilregeln in `docs/GRAFIK.md` Abschnitt 2.
- **NA-24 Welt-Kern** `shared/insel-kern.js` (`window.InselKern`, klassisches Skript, auch in Node lauffähig): Welterzeugung (aus `welt.js`,
  das jetzt nur weiterleitet – bitgenau gleich, geprüft mit 72 Kombinationen), Zeit/Saison, Bodenhöhe, Steg/Sonnenuhr/Paketplatz, Nachbarn mit
  Texten, Orte für die Zeigehand (`ORTE` mit x/z/h, neu auch `steg`, `paket`), Sonnenuhr, Nebelstufen, Weihnachtspaket (Regeln + Öffnen),
  Story-Auswahl `naechsteStory(lage)` + `storyFertig`, `prologFaellig`, Zimmer-Daten (Plätze, Möbel ohne 3D-Bau, Wandfarben), Wetter (Abruf,
  Cache, Texte), **Stationen** `antwort(id)` / `nachbarAntwort(n)` / `aktionFuer(id)` (Spielorte, Tilda, Paula inkl. `spieleMelodie`,
  Wetterstation, Wissensbaum, Sonnenuhr, Album, Bett, Schrank, Spiegel). `heimat.js` zeichnet nur noch und liest alles aus dem Kern.
  Test `tests/inselkern.js` (23 Prüfungen, läuft im Standardlauf); alle Browser-Tests grün.
- **NA-25 vorbereitet, noch ausgeschaltet:** `Spielwelt.look()`, `lookWaehlbar()` (zurzeit **false**), `lookKindDarf()`, `setzeLook()`,
  `inselUrl()`; Einstieg `spiele/insel/` leitet je nach Look weiter (alle Insel-Links – Startseite, Medien, Album, Kleiderschrank, Minispiele –
  gehen jetzt über `spiele/insel/`); Knopf `#look` auf der Rund-Insel und Elternkarte (Look + „Kind darf umschalten“) erscheinen erst,
  wenn `lookWaehlbar()` wahr ist. Die Elternkarte überschreibt beim Speichern keine weiteren Insel-Werte mehr.
- **NA-26 begonnen:** `quellen/pixel/zeichnen.js` (gemeinsamer DS-Zeichenweg, von der Probe schon benutzt; neue Farbreihen `herbst`, `schnee`,
  `gruen`; `grau()`, `naechsteReihe()`, `leinwand()`); `quellen/probe/bauen.js` baut zusätzlich `quellen/pixel/insel.js` → `spiele/pixel/insel.js`
  (Aufruf `… bauen.js insel`). `quellen/pixel/insel.js` und `spiele/pixel/insel.html` gibt es **noch nicht**.

**Entscheidungen / Abweichungen**
- Ziele in den Stationen sind relativ zu einer Seite in `spiele/<ordner>/` (z. B. `../welt3d/ballons.html`) – gilt für beide Looks.
- `SPIELE` (Freischaltstufen der Minispiele) steht im Kern und in `quellen/welt3d/gemeinsam.js` – beide gleich halten.
- „Pixel“ wird zunächst nur in /dev wählbar (Schalter `lookWaehlbar`), bis Pixel-Insel, Figuren und Zimmer (NA-26–28) fertig sind.

**Offen / als Nächstes – Plan für NA-26 (Pixel-Insel)**
- a) `spiele/pixel/insel.html` (Leiste mit 🏠, ⭐, `#look` „🐾 Rund“; `#info`, `#lern-hinweis`, `#springen` Aktionsknopf, `#blase`-Sprechblase
  wie in `heimat.html`, im DS-Stil; Skripte wie `heimat.html` inkl. `shared/insel-kern.js`, Insel-Zugang prüfen) und `quellen/pixel/insel.js`:
  Boden aus `KI.WELT` (1 Welteinheit = 1 Kachel = 16 px; Gras/Sand/Wasser/Teich/Pfad Haus→Mitte→Steg; Biom- und Jahreszeit-Farbreihen;
  Hügel heller, Berge mit Fels), Dinge aus Kern (Bäume je `typ`, Steine, Haus, Station, Nest, Mathe-Schild, Nachbarn, Wissensbaum je Stufe mit
  Früchten `fruchtFarbe`, Ballons, Truhe, Lauf/Kart/Bau – gesperrt mit `grau()` + Schloss, Schach mit Tilda, Bühne mit Paula, Steg + Boot,
  Sonnenuhr mit Sonne (Farbe dunkel→gelb), Paket), Hindernisse als Kreise, Laufen per Tippen und Pfeiltasten, Aktionsknopf mit
  `K.aktionFuer`, Antippen → `K.antwort`/`K.nachbarAntwort`. Kind-Figur zunächst aus Kleiderschrank-Farben (`look.figur.farbe`,
  `haare.farbe/id`, `oberteil/unterteil/kleid/schuhe.farbe` → `naechsteReihe`).
- b) Story in Pixel: Prolog (Tippen-Variante), `naechsteStory`, Szenen mit Zeigehand über `window.Insel.bildschirm/ort` (Weltpunkt → Bildschirm),
  Nebelring je Stufe (weicht in 3 s), Nacht/Dämmerung als Tönung, Lichterkette im Dezember. Test-Haken `__pixel` wie `__heimat`.
- c) Minimales Pixel-Zimmer (Bett, Schrank, Spiegel, Album, Raus), `sw.js`-Einträge (`spiele/pixel/…`, Lizenzen), Tests `tests/pixelinsel.js`
  (Prolog/Story/Paket in Pixel) und `tests/look.js` (Umschalten in /dev, gleicher Spielstand); dann `lookWaehlbar()` auf `UMG !== "prod"`.
- Danach NA-27 (Figuren), NA-28 (Zimmer mit Möbeln), NA-14 (Tutorial in beiden Looks), NA-21.

### Stand 27.10.2026, Vormittag (Sitzung 27.10.: NA-25, NA-26, NA-27, NA-28 fertig – Pixel-Look in /dev komplett)
**Antworten des Auftraggebers (27.10.2026, 05:40):** iPad-Test von Ankunft/Sonnenuhr/Frucht/Paket: noch nicht; DS-Probe noch nicht angesehen;
Reihenfolge gilt (NA-26 zuerst); nichts ist gesperrt; Geschenke für NA-16 weiter offen.

**Fertig und gepusht**
- **NA-26 Pixel-Insel** `spiele/pixel/insel.html` (gebaut aus `quellen/pixel/insel.js`, Grafiken in `quellen/pixel/dinge.js`):
  - a) Boden als ein großes Bild aus der Welt des Kerns (Meer mit Tiefe/Schaum/Glitzern, Strand, Gras/Schnee/Wüstensand je Biom und Jahreszeit,
    Weg Haustür → Startplatz → Steg, Teich, Hügelstufen mit Felskante, Fels in den Bergen, Blumen in der Lieblingsfarbe), zwei Bilder für Wasser/Blumen.
    Alle Orte aus `K.erstelle(q)`: Bäume je Typ (Laub/Herbst/Tanne/Palme/Kaktus, Schneehauben), Steine, Haus (Tür nach Süden, Fenster nachts gelb),
    Wetterstation mit Windrad, Nest (Ei/leer), Mathe-Schild, alle Nachbarn (Ella, Fipsi, Robo Pixel, Bruni, Benno), Wissensbaum je Stufe mit den
    Früchten von heute, Ballons, Truhe, Sternenlauf/Kart/Bauplatz (gesperrt grau mit Schloss), Schachtisch mit Tilda, Bühne mit Paula (Melodie, alle hüpfen),
    Steg mit Pixels Boot, Sonnenuhr mit Sonne (dunkel/halb/hell), Weihnachtspaket. Kind aus den Kleiderschrank-Farben (Haut, Haare lang/kurz,
    Oberteil, Rock/Hose/Kleid, Schuhe), drei Ansichten × drei Schrittbilder; Haustier folgt (Fuchs/Kätzchen/Drache, Schleife), Streicheln mit Herzen.
    Laufen per Tippen (auf ein Ding: hinlaufen und ansprechen) und Pfeiltasten/WASD; Aktionsknopf `#springen` mit `K.aktionFuer`; Antworten
    nur über `K.antwort`/`K.nachbarAntwort`; Sprechblase `#blase` im DS-Stil. **1 Zeichenaufruf**, 0,88 MB.
  - b) Story: Prolog E1 (Kamera schwebt vom Meer heran, Tippen-Variante, Haus, Aktionsknopf), `K.naechsteStory` (Erst lernen, Sonne geht auf,
    Erste Frucht, Weihnachtspaket), Zeigehand über `window.Insel.ort()/bildschirm()`, Nebelring je Stufe (blendet in 3 s über), Tönung für Nacht/
    Dämmerung/Wetter (Container-Tint, kein Zusatzaufruf), Regen/Schnee/Blitz, Lichterkette an Steg, Boot und Wissensbaum im Dezember.
  - c) Minimales Zimmer (Rückwand mit Fenster in der Wandfarbe, Holzboden, Bett mit Album, Schrank, Spiegel, Teppich, Tür unten = raus;
    Tannenbaum auf seinem Platz), `sw.js`, Lizenzen (`spiele/pixel/LIZENZEN.txt`, `docs/LIZENZEN.md`), Rauchtest um drei Pixel-Seiten erweitert.
  - Test `tests/pixelinsel.js` (Prolog quer/hoch mit echtem Tippen, Zimmer, Stationen, Nachbar antippen → hinlaufen → Ella spricht, Pfeiltasten,
    E2/E3 mit Nebel, Minispiel-Ort, Weihnachtspaket + Tannenbaum im Zimmer, Zeichenaufrufe ≤ 4). Test-Haken `__pixel`.
- **NA-25 Umschalter eingeschaltet (nur /dev und /dev/test):** `Spielwelt.lookWaehlbar()` = `UMG !== "prod"`. Knopf „👾 Pixel“ auf der runden
  Insel, „🐾 Rund“ auf der Pixel-Insel, Elternkarte (Look + „Kind darf umschalten“). Hauptseite bleibt „Rund“. Test `tests/look.js` (braucht /dev).
- Kern: neue Station `K.antwort("nest")` (Ei/leeres Nest), die runde Insel nutzt sie jetzt auch.
- Zeichenweg: Farbreihen `haut2`, `haut3` für dunklere Hauttöne (Kind-Figur aus dem Kleiderschrank).

**Entscheidungen / Abweichungen**
- In Pixel zeigt die Haustür immer nach Süden (Draufsicht); Tür und Reingehen-Punkt liegen 2 Einheiten südlich vom Hausplatz (`__pixel.tuer`).
- Laufen in Pixel nur per Tippen und Tasten (kein Joystick); im Prolog gilt deshalb immer der Tippen-Text.
- „Meine Welt“ (Welten wechseln/erschaffen) gibt es vorerst nur in „Rund“ (Pixel zeigt die gewählte Welt).
- Wie bei „Rund“ schickt die Insel ein Kind ohne Spielzeit nach dem Prolog nach spätestens 10 Sekunden wieder aus dem Haus (Zeit-Regel).

**Danach in derselben Sitzung fertig und gepusht (NA-28, NA-27)**
- **NA-28 Pixel-Zimmer:** alle Möbel aus `K.MOEBEL` in Pixel (Lampe, Kuschelbär, Sitzsack, Spielzeugkiste, Tierkörbchen, Globus, Regal, Staffelei,
  Schreibtisch, Aquarium mit schwimmenden Fischen, Tannenbaum blinkend), Wandfarbe aus den Zimmer-Daten, Pinnwand mit Zetteln der Lernfunde
  (Farbe je Fach, heute golden umrandet, gemeistert gelb), feste Staffelei mit dem **neuesten gemalten Bild** und ein gemaltes Bild an der Wand –
  beide werden verkleinert und auf die Farben der Palette gebracht (bleiben DS-Look). Platz-Ringe beim Aussuchen, Möbel bleiben innerhalb der Wände.
  **„Einrichten“** ist jetzt ein gemeinsamer Baustein `shared/einrichten.js` (Kaufen, Hinstellen, Wegräumen, Wandfarbe) – „Rund“ benutzt ihn auch.
  Neue Kern-Stationen `pinnwand`, `staffelei`, `bild`, `moebel` und `K.pinnwandZettel()`; die runde Insel liest diese Texte jetzt ebenfalls aus dem Kern.
- **NA-27 Pixel-Figuren:** Kind mit allen Frisuren des Kleiderschranks (lang, Wellen, Zöpfe, Seitenzopf, Dutt, Space-Buns, Bob, kurz, Locken, Puffs,
  Pferdeschwanz) und Extras (Kronen, Schleife, Blüte, Haarreif, Katzen-/Fuchsohren, Einhorn, Mützen, Hüte, Kopfhörer, Brillen, Schal, Kette, Umhang,
  Flügel, Luftballon, Teddy, Zauberstab, Tasche); Bild jetzt 22×34 (Platz über dem Kopf). Haustier mit Vorder- und Rückansicht (vier Richtungen),
  Schleife wandert mit. Nachbarn hatten schon eigene Sprites mit Zwei-Bild-Animation; sie bleiben so.
- Tests: `tests/pixelinsel.js` um Zimmer/Einrichten (Abschnitt 7) und Figuren (Abschnitt 8) erweitert; Test-Haken `__pixel.einrichten()`, `ringe`,
  `moebel()`, `figur()`, `tierRichtung`.
- Abweichung von der Reihenfolge: NA-28 vor NA-27 erledigt (der Laden-Baustein war schon vorbereitet). Nicht in Pixel: Ohrringe und Armband
  (zu klein für 16-px-Figuren), Kleidungsmuster (nur Farben). Hinweis: Der Prolog-Test der runden Insel wackelt, wenn der Rechner nebenbei
  ausgelastet ist (Software-Rendering); er hat jetzt längere Wartezeiten und zählt Hausbesuche.

**Offen / als Nächstes**
- **iPad 10 und Handy testen** (in `/dev`): Insel öffnen → Knopf „👾 Pixel“ → laufen (Tippen), Ella antippen, Haus, Zimmer einrichten,
  Kleiderschrank ändern und wieder ansehen, zurück „🐾 Rund“. Neues Kind in `/dev`: Prolog in Pixel (Eltern → „Look der Insel: Pixel“ vor dem
  ersten Inselbesuch). Wenn alles passt: Pixel auch auf der Hauptseite wählbar machen (`lookWaehlbar()` → immer wahr) – Entscheidung des Auftraggebers.
- Nächstes Paket: ~~NA-14~~, ~~NA-21~~ (beide siehe unten) → **Budget „Rund“** (neues Paket NA-29, siehe unten) → NA-16 (wartet auf Geschenk-Auswahl) → NA-17 → NA-18.

**NA-14 Tutorial E4–E8 (fertig, beide Looks)**
- Auslöser, Reihenfolge und „schon genutzt“ im Insel-Kern (`ETAPPEN` in `shared/insel-kern.js`, statt einer eigenen `shared/tutorial.js` –
  so gilt es für beide Looks ohne doppelte Logik): erst nach E3; **E4 Sterne** (Spielzeit und mind. 4 Sterne: Benno zeigt die Sterne, Haus,
  „Einrichten“), **E5 Ei** (Nest, Ei wärmen, „Dein Tier ist nie böse“; danach Nest-Blase mit Weg zur Tier-Seite), **E6 Spielorte** (Spielzeit
  und kompletter Führerschein: Ballon-Wiese, Spielzeit läuft ab), **E7 Merkkiste** (erste fällige Karte der Lernkartei: Fipsi, bei nur
  Sachunterricht Ella), **E8 Gefühle** (ab dem Tag nach der Ankunft: Bruni). Höchstens zwei neue Etappen am Tag.
- Kinder, die eine Funktion schon kennen (Möbel/Wandfarbe gekauft, Ei/Tier, Kinder von vor der Neuausrichtung, Karte schon einmal richtig
  wiederholt, Gefühle-Tagebuch benutzt), bekommen die Etappe **still** (`Story.etappeFertig(id, true)` = Wert 1, zählt nicht zum Tageslimit).
- Elternbereich, Karte „Geschichte und Einführung“: Fortschritt der Einführung und Knopf **„Einführung überspringen“** (E2–E8 still, Kapitel 1).
- Texte in `shared/szenen.js` (russisch als Entwurf, nur in /dev); neue Orte für die Zeigehand: `nest`, `ballons`, `fipsi`, `baer`.
- Tests: Node `tests/inselkern.js` (24 Prüfungen, neu: E4–E8), Browser `tests/etappen.js` (drei Tage in Pixel, Sterne-Szene und Elternknopf in Rund).
- Offen: „Wie ging das nochmal?“ bei Robo spielt weiter nur die Ankunft; einzelne Etappen lassen sich ab NA-18 über die Inselchronik im Album
  noch einmal ansehen. E9 (Atelier) und E10 (Mein Ich) gehören zu späteren Paketen (Kapitel 1–2, NA-17).

**NA-21 Leistungs-Test (fertig)**
- `tests/leistung.js` (`sh tests/laufen.sh leistung`, Tabelle mit `AUSGABE=<datei>`, mit `STRENG=1` scheitert er bei Budget-Überschreitung):
  zählt Zeichenaufrufe, Dreiecke, Texturspeicher, Schatten und Pixeldichte je Szene, Landschaft und Grafik-Stufe und warnt nach GRAFIK.md Abschnitt 6.
  Bilder/s werden bewusst nicht gemessen (Swiftshader). Das Test-Kind hat alle Spielorte offen (Wissensbaum Stufe 3).
- Messung 27.10.2026 (Swiftshader, 1180×820, Pixeldichte 2; Bauplatz misst den Startbildschirm vor dem Bauen):

| Szene | Grafik | Zeichenaufrufe | Dreiecke | Texturen MB | Schatten | Pixeldichte |
|---|---|---|---|---|---|---|
| Insel (erste Insel) | schoen | 521 | 390.524 | 0,7 | an | 1,5 |
| Insel (erste Insel) | einfach | 347 | 73.902 | 0,7 | aus | 1 |
| Insel Nacht, Winter | schoen | 521 | 406.226 | 0,7 | an | 1,5 |
| Insel Regen | schoen | 522 | 390.524 | 0,7 | an | 1,5 |
| Welt Wald, groß, Hügel | schoen | 387 | 898.644 | 0,7 | an | 1,5 |
| Welt Wald, groß, Hügel | einfach | 211 | 157.796 | 0,7 | aus | 1 |
| Welt Berge mit Teich | schoen | 455 | 261.272 | 0,7 | an | 1,5 |
| Welt Strand | schoen | 545 | 321.680 | 0,7 | an | 1,5 |
| Zimmer | schoen | 136 | 50.878 | 0,7 | an | 1,5 |
| Zimmer | einfach | 100 | 13.332 | 0,7 | aus | 1 |
| Ballon-Party | schoen | 43 | 5.858 | 0 | aus | 1,5 |
| Schatz-Strand | schoen | 264 | 17.862 | 0 | an | 1,5 |
| Sternenlauf | schoen | 247 | 72.700 | 0 | an | 1,5 |
| Kart-Rennen | schoen | 293 | 46.776 | 0,1 | an | 1,5 |
| Bauplatz | schoen | 3 | 4 | 0 | an | 1,5 |
| Pixel-Insel | Pixel | 1 | – | – | aus | 2 |
| Pixel-Insel Wald, groß | Pixel | 1 | – | – | aus | 2 |
| Pixel-Zimmer | Pixel | 1 | – | – | aus | 2 |

- **Ergebnis:** „Pixel“ liegt überall bei 1 Zeichenaufruf. „Rund“ liegt auf der Insel 3–4× über dem Budget (≈ 520 statt 150 Aufrufe, ≈ 390.000 statt
  150.000 Dreiecke; Wald groß ≈ 900.000 Dreiecke), auch „einfach“ (≈ 350 statt 80). Zimmer und Minispiele sind näher dran (Schatz-Strand,
  Sternenlauf, Kart ≈ 250–290 Aufrufe).
- **Neues Paket NA-29 Budget „Rund“** (M–L, vor NA-16): Nachbarn, Spielorte, Wissensbaum und Figuren je Material verschmelzen (wie die Deko),
  Bäume/Steine als `InstancedMesh`, Konturen nur für Figuren und große Dinge, Gras-Halme und Kugeln mit weniger Segmenten in „einfach“,
  Schattenkamera enger. Ziel zuerst „einfach“ ≤ 80 / 60.000, dann „schön“ ≤ 150 / 150.000. Abnahme: `STRENG=1 sh tests/laufen.sh leistung` grün.

**NA-29 Budget „Rund“ – Teil 1 fertig (Insel, Welten, Zimmer); Teil 2 (Minispiele) offen**
- `verschmelzeLokal(wurzel, ausnahmen)` in `quellen/welt3d/heimat.js`: starre Teile je Objekt zu wenigen Meshes; feste Toon-/Basisfarben werden
  zu Vertex-Farben eines gemeinsamen Materials (`gruppeVon`), Kontur bleibt ein Mesh. Bewegliche Teile (Arme, Beine, Schwanz, Früchte, Lichter,
  Ballons, Paula, Windrad, Globus, Fische) bleiben getrennt; Antippen (Raycast), Hüpfen und Laufen funktionieren unverändert. Objekte melden sich
  beim Erzeugen in `starr` an; verschmolzen wird vor dem ersten Bild. Materialien mit späterem Farbwechsel tragen `userData.lebt` (Wandfarben).
- Gesperrte Spielorte teilen graue Materialien (`grauMat`), Möbel werden beim Hinstellen verschmolzen, das Zimmer ebenfalls.
- Kugeln mit weniger Segmenten (schön 55 %, einfach 40 %), Baumkronen/-stämme gröber, Bäume ohne Kontur in „einfach“, Wasser- und Geländegitter
  gröber; große Welten: Deko in 12er-Feldern verschmolzen (Bild- und Schatten-Culling). Test-Haken `__heimat.teile()` (Meshes je Objekt).
- **Messung danach** (vorher in Klammern): Insel „schön“ 100 Aufrufe / 126.000 Dreiecke (521 / 390.000), „einfach“ 65 / 51.000 (347 / 74.000);
  Wald groß „schön“ 112 / 150.000–154.000 (387 / 899.000; liegt knapp an der Grenze), „einfach“ 58 / 48.000; Zimmer „schön“ 46 / 23.000 (136 / 51.000), „einfach“ 33 / 12.000.
  Alle Insel-, Welt- und Zimmer-Szenen liegen im Budget (Wald groß „schön“ schwankt knapp darüber).
- **Offen (NA-29 Teil 2):** Schatz-Strand (≈ 264), Sternenlauf (≈ 250) und Kart (≈ 290 Aufrufe) liegen noch über 150. Vorschlag: `verschmelzeLokal`
  und `gruppeVon` nach `quellen/welt3d/gemeinsam.js` verschieben (gemeinsam mit `figur3d.js`), Randbäume/Streifen der Strecken als `InstancedMesh`,
  Figur (`meineFigur`) lokal verschmelzen. Bauplatz misst im Test nur den Startbildschirm. Danach `STRENG=1 sh tests/laufen.sh leistung` als Abnahme.
- iPad 10 bitte in `/dev` prüfen: Sieht die runde Insel noch genauso aus (Kugeln etwas kantiger)? Läuft sie flüssiger?

**Nachtrag 27.10.2026 (Vormittag, parallele Sitzung): Vorschau „Pixel 2,5D“** – Wunsch des Auftraggebers: den Pixel-Look als einfache
2,5D-Ansicht im Stil der Handheld-Abenteuer um 2008–2010 sehen. Nur Vorschau: `spiele/welt3d/probe25d.html` (Quelle
`quellen/welt3d/probe25d.js`, three.js): niedrige Auflösung (≈ 200 Zeilen, ganzzahlig vergrößert), Toon-Licht in drei Stufen,
1-Pixel-Umrisse über die Tiefe (Nachbearbeitung), Kachelboden mit Klippen/Plateau, flaches Ufer mit wogendem Schaum, Haus mit Giebel nach vorn,
Figuren als kleine 3D-Modelle mit großem Kopf und Pixel-Gesicht; ≈ 60 Zeichenaufrufe, ≈ 9.000 Dreiecke. Ohne Story, Stationen, Kern-Anbindung.
**Offen (Frage an den Auftraggeber):** Bleibt „Pixel“ die flache Draufsicht (PixiJS, NA-26–28, fertig in /dev), oder soll der Pixel-Look auf diese
2,5D-Ansicht umgestellt werden (oder als dritter Look dazukommen)? 2,5D würde three.js nutzen und könnte den Insel-Kern genauso lesen wie heimat.js.

**Nachtrag 27.10.2026 (Mittag): Rechenaufwand auf kleinen Smartphones** (`tests/handy.js`, Software-Grafik, CPU zusätzlich 4× gedrosselt;
Werte iPhone SE hoch, 375×667 ×2):

| Look | Zeichenaufrufe | Dreiecke | Pixel pro Bild | Hauptthread ms/Bild (4× gedrosselt) | JS-Download |
|---|---:|---:|---:|---:|---:|
| Rund „schön“ | 82 (quer 105) | 100 Tsd. (quer 123 Tsd.) | 0,56 Mio. | 13,7 (quer 17,5) | 0,9 MB |
| Rund „einfach“ | 47 (quer 70) | 35 Tsd. | 0,25 Mio. | 9,7 | 0,9 MB |
| Pixel flach | 1 | 150 | 1,0 Mio. | 3,4 | 1,2 MB |
| Pixel 2,5D (Vorschau, ohne Stationen) | 65 | 8,8 Tsd. | 0,06 Mio. | 8,7 | 0,6 MB |

Bewertung: Alle Looks sind auf kleinen Handys machbar. Grenzfall ist nur Rund „schön“ auf schwachen Geräten (quer über 16,7 ms → Ruckeln, Wärme).
Pixel flach rechnet unnötig viele Pixel (volle Auflösung ×2). Empfehlung an den Auftraggeber: **keinen dritten Look**; Kinder testen etwa eine Woche
Rund, Pixel flach und Pixel 2,5D. Bevorzugen sie 2,5D klar, **ersetzt** es den flachen Pixel-Look (eigenes Paket), sonst bleibt Rund + Pixel flach.
Danach Grafik einfrieren und Inhalte bauen.

Neues kleines Paket **NA-29b Handy-Leistung** (S, unabhängig von der Look-Wahl):
- Pixel flach mit Auflösung ×1 rendern (Pixelkunst sieht gleich aus, ¼ der Pixel) – `quellen/pixel/insel.js`, Pixi `resolution`.
- Rund auf kleinen Bildschirmen (kürzere Seite < 500 CSS-Pixel) beim ersten Start automatisch „einfach“; Eltern-Einstellung hat Vorrang.
- Abnahme: `sh tests/laufen.sh handy` – Pixel flach ≤ 0,3 Mio. Pixel pro Bild, Rund auf Handy-Größe „einfach“ ohne Eingriff.
- Wenn möglich einmal auf einem echten älteren Gerät gegenprüfen.

### Stand 27.10.2026, Mittag (Sitzung 27.10.: Pixel freigegeben, Grafik eingefroren, NA-03 und NA-40 fertig)
**Antworten des Auftraggebers (27.10.2026, 12:00):** iPad-Test noch nicht gemacht. **Pixel-Look: „Rund + Pixel flach“** – die Vorschau
Pixel 2,5D wird nicht weiterverfolgt (Dateien bleiben als Nachschlag, kein Paket, kein dritter Look). **„Bis Weihnachten pushen wir alles auf
Main. Kein Kind spielt hier bisher.“** → neue Funktionen sind ab jetzt auch auf der Hauptseite sichtbar. **„Lieber Inhalte zuerst“** → Grafik
eingefroren (NA-29b, NA-29 Teil 2 warten), Reihenfolge jetzt Punkt 5: NA-03 → NA-40 → NA-30 → NA-32 → NA-31.

**Fertig und gepusht**
- **Pixel auf der Hauptseite wählbar:** `Spielwelt.lookWaehlbar()` = immer wahr; Elternkarte ohne „nur in der Testumgebung“; `tests/look.js` prüft
  jetzt Knopf und Umschalten auch auf der Hauptseite. Standard bleibt „Rund“.
- **NA-03 Lehrplan-Kern**
  - a) `shared/lehrplan/kern.js` (`window.LernzielKern`): 148 Lernziele mit festen IDs `<fach>.<bereich>.<nr>` – Mathe (5 Leitideen + prozessbezogene
    Kompetenzen `ma.pk`), Deutsch mit den **fünf** Bereichen der KMK-Fassung 2022 (`de.sz` Sprechen und Zuhören, `de.sc` Schreiben, `de.le` Lesen,
    `de.tm` Texte und Medien, `de.su` Sprache untersuchen), Sachunterricht nach GDSU-Perspektiven, Medienbildung (KMK-DW), Kunst, Musik, Bewegung,
    Ethik, DaZ (`daz.d0`, `daz.d1`); je Ziel Kern-Stufe vs/1–4/5. Titel sind eigene Zusammenfassungen.
  - b) `shared/lehrplan/laender/sachsen.js`: alle 49 sächsischen Lernbereiche (unverändert übernommen) mit `lz`-Verweisen; Abweichungen
    (`ma.dz.05` schon Kl. 2, Zusatz-Ziel `su.hi.sn01` Sorbische Kultur, Fundstellen). `shared/lehrplan.js` ist jetzt die Kompatibilitäts-Schicht:
    `window.LEHRPLAN` wie vorher, `kmk.deutsch` mit fünf Bereichen, neu `errechnet(lernbereich)` und `zaehle(land, klasse)`.
  - c) `shared/inhalte.js` (`window.Inhalte`): `registriere`, `ausBestand()` (liest Matheweg-Stationen, Fipsi-Kapitel, Werkstatt, Sachthemen,
    Führerschein und feste Angebote wie Atelier/Musik/Gefühle), `abdeckung(lz)` nach der Regel aus LEHRPLAN.md, `fuer(kind)` (Stufe des Kindes oder
    eine darunter, Länder-Filter), `ohneInhalt()`. Bestehende Inhalte tragen nur ein Feld `lz` (nichts umgebaut). Bei Fipsis Geschichte ergibt
    sich das Lernziel aus dem Schritt-Typ (Artikel → `de.su.05` usw.).
  - Elternkarte „Was übt die App?“ zeigt wie vorher die Einschätzung von Hand und darunter je Lernbereich „Nach Lernzielen errechnet“ plus eine
    Vergleichszeile. Test `tests/lehrplan.js` (Node, 8 Prüfungen, listet Lernziele ohne Inhalt: 88 von 148; `LUECKEN=1` zeigt die IDs).
- **NA-40 Wortschatz-Kern und DaZ D0**
  - a) `inhalte/woerter/bestand.js` (die 64 Wörter von „Wort des Tages“, jetzt mit Silben und Wortfeldern) und `inhalte/woerter/d0.js`
    (72 neue Wörter + 20 Sätze, Ukrainisch für die D0-Bestandswörter). `shared/woerter.js` baut daraus `window.Wortschatz` (wort, feld, daz,
    saetze, hilfe, ARTIKEL) und weiter `window.WOERTER` in alter Form und Reihenfolge – das Wort des Tages bleibt gleich. Artikel mit Farbe **und**
    Form: der ■ blau, die ● rot, das ▲ grün. Test `tests/wortschatz.js` (Node).
  - b) Neue Seite **„Ankommen“** `spiele/daz/` (`ankommen.js`, `shared/daz.js`): Wörter ansehen nach 11 Wortfeldern (Bild, Artikel-Zeichen,
    Silbenbögen, Mehrzahl, Vorlesen), „Hören und zeigen“ (10 Aufgaben, drei Bilder), „Sätze für jeden Tag“ (8 Aufgaben). Richtige Antworten
    beim ersten Versuch zählen als Lernaufgabe (Zeit-Regel) und für den Fortschritt (`profil.daten.daz`); neue Wörter werden Lernfunde.
    D0 gilt als geschafft ab 80 Wörtern und 15 Sätzen. **Deutschstand „keine“:** Die Deutsch-Seite leitet nach „Ankommen“ weiter, bis D0 geschafft
    ist (`?karte=1` bleibt bei Fipsi); bei „keine“ und „wenig“ steht oben auf Fipsis Karte ein Knopf „Ankommen“. Ohne Gerätestimme steht das
    gesuchte Wort in der Frage. Test `tests/daz.js`.

**Entscheidungen / Abweichungen**
- Die Zahlen in LEHRPLAN.md waren leicht falsch: Sachsen hat **49** Lernbereiche (von Hand 6 × ja, 14 × teil, 29 × nein), „Wort des Tages“ hatte
  **64** Wörter (nicht 67).
- Die errechnete Abdeckung ist streng (ein Lernbereich ist nur „gut“, wenn alle seine Lernziele „gut“ sind) und steht deshalb nur zum Vergleich
  neben der Einschätzung von Hand; nach NA-30/31/32 kann sie die Hand-Werte ersetzen.
- Russisch der Bestandswörter gilt als geprüft (war schon im Kinder-UI); alle neuen russischen und ukrainischen Texte sind **Entwürfe** und
  erscheinen weiter nur in /dev – die Regel „keine ungeprüfte Übersetzung im Kinder-UI“ gilt trotz „alles auf Main“.
- Bilder sind vorerst Emojis (wie bisher bei Wort des Tages); Ton über die Gerätestimme, `ton`-Schlüssel je Wort für spätere Aufnahmen (NA-43).

**Offen / als Nächstes**
- iPad 10: Hauptseite → Eltern → neues Kind mit Deutsch-Kenntnissen „keine“ → Deutsch öffnen → „Ankommen“; Wörter ansehen, Hören und zeigen,
  Sätze. Elternbereich → „Was übt die App?“. Pixel-Look jetzt auch auf der Hauptseite (Knopf „👾 Pixel“ auf der Insel).
- Nächstes Paket: **NA-30 Anlaute** → NA-32 → NA-31; Russisch/Ukrainisch der D0-Texte von Muttersprachlerinnen prüfen lassen.

### Stand 27.10.2026, Nachmittag (Sitzung 27.10.: NA-30, NA-32, NA-31 fertig – Inhalte Priorität 1 für Kl. 1/Vorschule)
**Fertig und gepusht** (alle auf der Hauptseite, Tests grün)
- **NA-30 Laute und Buchstaben** – neue Seite `spiele/lesen/` (Kachel „🔤 Laute und Buchstaben“ auf Fipsis Karte neben der Werkstatt):
  Buchstaben-Tafel (26 Buchstaben + Ä, Ö, Ü + Sch, Ei, Au; seltene C, V, X, Y mit Hinweis), „Gleicher Anfang“ (Vorschule, ohne Buchstaben),
  „Finde das Bild“ und „Welcher Buchstabe?“ (Kl. 1). Anlaut-Tabelle als Inhalt `inhalte/deutsch/anlaute.js` (Format LEHRPLAN.md, registriert
  im Inhalte-Verzeichnis), 31 neue Bildwörter `inhalte/woerter/anlaute.js`. Wörter werden **ohne Artikel** vorgelesen (sonst hört man „d…“);
  Laute, die gleich klingen oder gleich aussehen (S/Sch, E/Ä/Ei, A/Au, K/Qu), stehen nie zusammen zur Wahl. Erster Fehler → Lernkartei (neues
  Fach `lesen`), fällige Karten kommen in der nächsten Runde zuerst; neuer Buchstabe = Lernfund; richtige Antworten zählen als Lernaufgaben.
- **NA-32 Matheweg Klasse 1 und Vorschule** – zweiter Weg im Matheweg mit Umschalter „🐣 Klasse 1 und Vorschule / 2. Klasse“ (Wahl wird
  gespeichert, Kinder in Vorschule/Kl. 1 starten dort): Würfelbilder, Zählen bis 10, Wo sind mehr? (mit Pfeilen, ohne Lesen), Muster fortsetzen,
  Zwanzigerfeld, Nachbarzahlen, Zahlen zerlegen, Plus/Minus bis 10 mit Bildern, Verdoppeln. Generatoren in `spiele/mathe/aufgaben.js`
  (`STATIONEN_K1`, mit `lz` und `stufe`), Fortschritt in `mathe.k1` (Klasse 2 bleibt `mathe.k2`), Einstufungstest nur auf dem Klasse-2-Weg,
  Zielknoten „2. Klasse“ wechselt den Weg. Elternbericht listet „Kl. 1: …“-Stationen. Stationen auf kleinen Handys schmaler (vorher Überlauf).
- **NA-31 Silben lesen und erste Lesetexte** (in `spiele/lesen/`): „Silben lesen“ (Bildwort in Silbenbögen, blau/rot, Bild wählen; Vorlesen erst
  nach einem Fehlversuch; Lernkarte `silbenwort`) und **20 Lesetexte** (`inhalte/deutsch/lesetexte.js`, 10 kurze für Kl. 1, 10 längere für Kl. 2,
  je 1–2 Fragen mit Bildantworten, verknüpft mit Sachthemen: Igel, Zugvögel, Tanne, Trinken, Biene, Ampel, Streit, Pausen …). Texte in
  Sprechsilben gespeichert, Silbenfarben abschaltbar (Bögen bleiben), Vorlesen per Knopf.
- Tests: `tests/lesen.js` (Anlaute, Silben, Texte, Lernkartei, Hochformat), `tests/mathe1.js`; `tests/lehrplan.js` angepasst
  (Lernziele ohne Inhalt jetzt 75 von 148; `de.le.02` und `ma.zo.03` errechnet „gut“).

**Entscheidungen / Abweichungen**
- „Laute und Buchstaben“ ist eine eigene Seite statt eines Fipsi-Kapitels (andere Bedienung: Bilder und Buchstaben statt Sätze); sie hängt als
  Kachel an Fipsis Werkstatt. Die Lernkartei bekommt dafür ein eigenes Fach `lesen` (Fipsis Kapitel kennen die neuen Schritt-Typen nicht).
- Lernfund bei „Laute“ schon beim ersten Treffer eines Buchstabens (bei zwei Treffern kamen in einer Runde fast keine zustande).
- Lesetexte haben keine Lernkartei (eine Frage ohne Text lässt sich nicht wiederholen); sie zählen daher höchstens als „teilweise“.
- Bilder weiter als Emojis; einige sind schwach (Ö = Ölfass, X = Noten für Xylofon). Beim Grafik-Neubau eigene Zeichnungen (GRAFIK.md).

**Offen / als Nächstes**
- iPad 10 (Hauptseite): Deutsch → Kachel „Laute und Buchstaben“ (alle sechs Wege), Matheweg mit einem Kind in Klasse 1 und in Vorschule,
  Lesetexte vorlesen lassen. Rückmeldung: Sind die Texte für Kl. 1 kurz genug, passen Silbenfarben blau/rot zur Schule der Kinder?
- Nächstes Inhalts-Paket: **NA-35 Schreiben** (Buchstaben nachspuren mit dem Finger, Wörter aus dem Wortschatz-Kern tippen); danach
  Phase E **NA-50 Können je Lernziel**. Grafik (NA-29b, NA-29 Teil 2) und Story (NA-16/17/18) warten weiter.

### Stand 27.10.2026, Abend (Sitzung 27.10.: NA-35 fertig)
**Fertig und gepusht**
- **NA-35 Schreiben** in der Seite `spiele/lesen/`, die jetzt **„Lesen und Schreiben“** heißt (Kachel auf Fipsis Karte):
  - „Buchstaben nachspuren“: Druckschrift A–Z, a–z und Ä, Ö, Ü als Strich-Daten (`inhalte/deutsch/schreiben.js`, `window.SCHRIFT`;
    Linien, Bögen, Punkte in einem Feld mit Mittel- und Grundlinie). Je Strich ein roter Startpunkt mit Nummer und Richtungspfeil; der Finger
    muss die Prüfpunkte der Reihe nach berühren (Toleranz großzügig, keine Bewertung der Schönheit), fertige Striche werden grün.
    Je Runde drei Buchstaben groß und klein in Fibel-Reihenfolge (M, A, O, I, L, E, S …), „Nochmal“ und „Weiter“ jederzeit.
  - „Wörter legen“: Bild + Vorlesen, das Wort aus Buchstaben-Steinen legen (Wortbuchstaben + 3 Ablenker; der erste Stein ist groß →
    Nomen groß schreiben). 72 lautgetreue Bildwörter aus dem Wortschatz-Kern (ohne ie, ch, ck, tz, Doppelkonsonanten, Dehnungs-h);
    erster Fehler → Lernkarte `schreibwort`.
  - Lernziele `de.sc.02` (Nachspuren), `de.sc.03`, `de.sc.05` (Wörter legen) im Inhalte-Verzeichnis; Test `tests/lesen.js` spurt mit der Maus
    entlang der Striche (auch: Malen ohne Startpunkt zählt nicht) und legt Wörter.

**Offen / als Nächstes**
- iPad 10: Nachspuren mit dem Finger ausprobieren (Toleranz, Größe, Reihenfolge), Wörter legen.
- Später: Schreibschrift/Grundschrift je Bundesland als weitere Schrift-Daten; eigene Bilder statt Emojis.
- Nächstes Paket laut Plan: **NA-50 Können je Lernziel** (Phase E) – oder nach Rückmeldung NA-34 Sachunterricht / Grafik / Story.

### Stand 27.10.2026, später Abend (Sitzung 27.10.: Russisch frei, NA-50 fertig)
**Antwort des Auftraggebers (13:18):** „Nein, alles auf Main. Vorerst nur russisch. Andere Sprachen folgen später.“
→ **Russische Entwürfe erscheinen jetzt auch auf der Hauptseite** (`Spielwelt.ENTWURF_FREI = ["ru"]`, `Spielwelt.entwurfErlaubt(code)` in
`shared/core.js`, genutzt von `shared/szene.js` und `shared/woerter.js`); Ukrainisch und alle anderen Entwürfe weiter nur in /dev.
SPRACHEN.md Abschnitt 6 entsprechend ergänzt; Tests `szene`, `daz`, `wortschatz` umgestellt.

**NA-50 Können je Lernziel (fertig)**
- `shared/koennen.js` (`window.Koennen`, reine Logik auch in Node): je Lernziel `[q, n, f]` in `profil.daten.koennen` (q = Trefferquote beim
  ersten Versuch, anfangs Mittelwert ab Startwert 70, dann gleitend über ≈ 12 Antworten; n = Anzahl; f = Fehler in Folge). Stand 0–4
  (neu, angefangen, übt, sicher, gemeistert). `waehle()` nimmt die Stationen, deren Lernziele am nächsten an der Zielzone 70–85 % liegen;
  gemeisterte nach hinten. `leichter()` nach zwei Fehlern in Folge.
- Matheweg: jede Antwort beim ersten Versuch wird gemeldet; nach zwei Fehlern in Folge kommt einmal je Runde eine leichtere Aufgabe der Station
  davor („Eine leichtere Aufgabe zwischendurch 🙂“, zählt nicht in die Wertung); das Mathe-Training wählt seine zwei Themen nach der Zielzone;
  Benno empfiehlt „Heute passt gut: …“. „Lesen und Schreiben“ und „Ankommen“ melden ihre Lernziele ebenfalls.
- Elternkarte „Was übt die App?“: je Lernbereich „Können: ●●○○ übt“ (Durchschnitt der geübten Lernziele). Sachsen Kl. 1/2 „Zahl und Operation“
  umfasst jetzt auch `ma.zo.01` (Mengen erfassen).
- Tests: `tests/koennen.js` (Node, Simulation mit 400 Aufgaben: 83 % der Übung in der Zielzone, Treffer ≈ 70 %), `tests/mathe1.js` und
  `tests/lesen.js` erweitert.

**Offen / als Nächstes**
- Nachtrag: Fipsis Kapitel (Lernziel je Schritt-Typ, `window.GESCHICHTE_LZ_TYP` in `geschichte.js`), die Werkstatt und Ellas Sachthemen melden jetzt
  ebenfalls an `Koennen`. Offen: Können steuert noch nicht die Reihenfolge auf den Wegen selbst (nur Training/Empfehlung); Mein Ich zeigt es noch nicht.
- Nächste Pakete nach Rückmeldung: NA-34 Sachunterricht, NA-33 Mathe Kl. 3, oder Grafik/Story (NA-29b, NA-29 Teil 2, NA-16/17/18).

### Stand 27.10.2026, Sitzungsende (Können sichtbar)
- **„Mein Können“ in Mein Ich:** je Fach (Mathe, Deutsch inkl. DaZ, Sachunterricht) eine Pflanze 🌰 🌱 🌿 🪴 🌳 nach dem mittleren Stand der geübten
  Lernziele und „N Sachen kannst du schon sicher“ – keine Prozente, keine Noten; erst sichtbar, wenn geübt wurde.
- **„Lesen und Schreiben“:** Fipsi empfiehlt den Weg, dessen Lernziele gerade in der Zielzone liegen („Heute passt gut: …“, Kachel umrandet);
  Vorschule nur „Gleicher Anfang“ und „Finde das Bild“.
- Test `tests/koennen-anzeige.js`.
- **Nächstes:** nach iPad-Rückmeldung NA-34 Sachunterricht oder NA-33 Mathe Kl. 3; Grafik (NA-29b, NA-29 Teil 2) und Story (NA-16/17/18) warten.

### Stand 27.10.2026, Nachtrag (NA-34 Sachunterricht, Teil 1)
- Vier neue Themen bei Eule Ella (`spiele/sachkunde/themen.js`, mit `lz`, Russisch als Entwurf): **„Mein Schulweg“** (Ampel, Zebrastreifen,
  sicher/gefährlich – geographisch, `su.ge.02`), **„Wasser“** (Eis/Wasser/Dampf, Wasserkreislauf, Wasser sparen – naturwissenschaftlich,
  `su.na.01`, `su.na.07`), **„Früher und heute“** (Telefon, Schule, Waschen, eigene Lebensgeschichte – historisch, `su.hi.03`, `su.hi.02`),
  **„Regeln und Streit“** (Melden, Streit lösen in 4 Schritten, nie schlagen – sozialwissenschaftlich, `su.so.03`, `et.mi.01`).
  Jetzt 8 Themen; jede GDSU-Perspektive außer „technisch“ hat mindestens zwei Kl.-1/2-Themen.
- Sachsen Kl. 1/2 von Hand angepasst (jetzt 7 × ja, 15 × teil, 27 × nein): Zusammen leben → ja, Unbelebte Natur, Erste Schuljahre → teil.
- **Offen (NA-34 Teil 2):** technische Perspektive (Bauen, Brücken, Hebel – passt zu Bennos Bauplatz), Frühblüher/Keimen, Haustiere.

