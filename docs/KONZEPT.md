# Lerninsel – Gesamtkonzept

## In einem Satz
Eine Lern-Gewohnheits-App für Grundschulkinder: jeden Tag ein kurzer, verbindlicher Lernblock nach Lehrplan,
danach freies Spielen auf der eigenen 3D-Insel – offline, ohne Werbung, ohne Käufe, mit Eltern als letzter Instanz.
Gemacht auch für Kinder mit anderer Muttersprache.

## Grundprinzipien
1. **Erst lernen, dann spielen.** Der Lernblock (10–15 min) ist der Kern, Spiele sind Belohnung.
2. **Gesunde Bildschirmzeit** nach DGKJ-Leitlinie: Standardwerte nach Alter, bildschirmfreie Zeiten, die App schickt ins echte Leben.
3. **Eltern entscheiden:** Ersteinrichtung und alle Regeln im Elternbereich (PIN). Erwachsene dürfen immer spielen (ohne Sterne).
4. **Datenschutz zuerst:** alles bleibt auf dem Tablet, kein Bezug zu einem echten Kind im Code, kein Server bis echter Bedarf.
5. **Integration:** Hilfesprache (zuerst Russisch), später jede Muttersprache; Elternbereich in der Sprache der Eltern.
6. **Rücksicht auf Unterschiede:** Fokus-Hilfen (z. B. ADHS), kurze Häppchen, keine Strafen, ruhige Darstellung möglich.
7. **Nie Werbung, nie In-App-Käufe.** Sterne gibt es nur durchs Lernen und Spielen.

## Bausteine
| Bereich | Inhalt |
|---|---|
| Lernen | Deutsch (Fipsi, Schatzkarte), Mathematik (Matheweg Kl. 1–4), Sachunterricht (Eule Ella), Englisch ab Kl. 3, Medienbildung (Robo Pixel). Lehrplan: KMK-Bildungsstandards + Länder (Sachsen zuerst). Wiederholung nach 1/3/7 Tagen. |
| Gewohnheit | Tagesaufgaben, Zeitsystem, Erinnerungen der Figuren, Wochenkalender, Stempel und Truhe, **Lernfunde „Heute neu“** (was das Kind heute konkret neu kann) |
| Charakter | Fähigkeiten mit Stufen und Belohnungen, Titel, Stickeralbum |
| Spielen | 3D-Heimatinsel (Stil B, rund): Figur mit Kleiderschrank-Look, Tier läuft mit, Baumhaus, Nachbarn, Minispiel-Orte, echtes Wetter/Tageszeit/Jahreszeit |
| Ganzheitlich | Schach, eigene Stärken entdecken, soziale Fähigkeiten und Werte, Gefühle, Malen und Musik, Bewegung weg vom Bildschirm – ohne Bewertung, Sterne nur fürs Mitmachen (PLAN 8b) |
| Kleiderschrank | 150+ Teile, einmal beschrieben, in 2D und 3D; später auch für Jungen |
| Haustiere | Drache, Fuchs, Katze zum Start; später mehr; pflegen ohne Strafe |
| Familie | Kopfrechen-Duell, gemeinsames Vorlesen, „Heute erkläre ich dir …“, Wochenbericht – immer freiwillig |
| Papier | Tagesplan und Arbeitsblätter aus den eigenen Fehlern zum Ausdrucken |
| Sozial ohne Server | QR-Code-Geschenke, Sticker tauschen und Insel-Besuchskarte per QR |
| Später | Sicherheits-Insel: geschlossene Klassen-/Freundes-Inseln nur mit Einladung + Elternfreigabe (Server, EU, verschlüsselt) |

## Schärfung (Oktober 2026): Fortschritt statt Eintrittskarte
Der tägliche Lernblock soll sich nicht wie ein Ticket für die Spielzeit anfühlen, sondern wie Wachsen, das man sieht.
1. **Spürbarer täglicher Fortschritt** – jeden Tag eine konkrete Fähigkeit oder Erkenntnis, sichtbar im Charakter und auf der Insel.
   *Umgesetzt (Schritt 1):* Lernfunde (`shared/lernfunde.js`). Die Spiele melden, was heute neu ist: gemeisterte Lernkartei-Aufgaben
   („7 + 8 = 15 – war schwer, jetzt kannst du es!“), das Wort des Tages mit Artikel und Mehrzahl, Wörter aus Fipsis Kapitel, Werkstatt-Regel,
   Sachthema, Tablet-Lektion, neue/bessere Matheweg-Station. Sichtbar in „Mein Ich“ (Karte „Heute neu“), auf der Startseite,
   bei den Nachbarn auf der Insel (sie hüpfen und sprechen über den Fund) und im Wochenbericht der Eltern.
2. **Brücke ins echte Leben** – kurze freiwillige „echte Welt“-Aufgaben, im Wochenbericht sichtbar. Ansatz bisher: „Erzähl heute jemandem …“ unter den Lernfunden, Ella fragt nach der Familie.
3. **Eltern als Mitspieler** – 1–3-Minuten-Momente (Erklären, Duell), immer freiwillig. Die Lernfunde liefern den Gesprächsanlass („Erklär mir das mal!“).
4. **Langzeit-Motivation** – Jahreszeiten, wachsendes persönliches Museum/Schatzkammer, wiederholbare Herausforderungen. Lernfunde sind die Rohdaten fürs Museum.
5. **Muttersprache als Stärke** – Übersetzungen nicht nur als Hilfe zeigen: „Auf Russisch: дуб – du kennst es in zwei Sprachen!“ (in „Heute neu“ begonnen).

**Entscheidungen:** Lernfunde sind sparsam (höchstens 5 am Tag, 60 Tage gespeichert, kompakt für den QR-Transfer); gemeisterte Aufgaben haben Vorrang.
Keine Sterne für Funde – der Fund selbst ist die Belohnung, damit es kein zweites Punktesystem gibt. Kein Druck: ohne Lernen gibt es einfach keine Funde, keine Mahnung.

**Offene Fragen:** Sollen Lernfunde dauerhaft ins Museum wandern (eigene, kleinere Liste, z. B. nur „gemeistert“ und Wörter)?
Wie viel Muttersprache zeigen, wenn die Hilfesprache ausgeschaltet ist (heute: gar nicht)? Sollen Eltern einen Fund „bestätigen“ können („hat es mir erklärt“) – als erster gemeinsamer Moment?

## Entwicklungsreihenfolge ohne Zeitdruck
Grundsatz: **erst das Fundament, dann die Kern-Schleife prüfen, dann Inhalte und Belohnung ausbauen, erst zuletzt öffnen.**
Was später teuer nachzurüsten ist (Sprachen, Datenmodell, Tests), kommt zuerst.

| Phase | Was | Warum an dieser Stelle |
|---|---|---|
| 0 Fundament | Umgebungen prod/dev/dev-test; automatische Tests (Playwright) im Repo; **Sprachschlüssel-Architektur**; Profil-Datenmodell v2 (mehrere Kinder pro Tablet, Migration) | Jeder spätere Inhalt baut darauf auf. Sprachen nachträglich einzubauen wird mit jedem Text teurer. |
| 1 Kern-Schleife | Zeitsystem mit DGKJ-Standardwerten, täglicher Lernblock, Fokus-Hilfen, Erinnerungen der Figuren, Wiederholung nach 1/3/7 Tagen, Wochenbericht | Das ist das eigentliche Produkt. Wenn die Gewohnheit nicht trägt, hilft keine Insel. |
| 2 Lehrplan-Gerüst | KMK + Sachsen als Datenstruktur, Fächer umbauen, Einstufungstest, Mathe Kl. 1–4 und Deutsch Kl. 1–2 schrittweise | Inhalte richten sich nach dem Gerüst, nicht umgekehrt. |
| 3 Belohnungswelt | Heimatinsel ausbauen: Baumhaus, Kleiderschrank-Datenmodell 2D/3D, mehr Teile, Tiere, Minispiele, Sticker | Erst wenn die Kern-Schleife funktioniert, lohnt sich die teure Belohnung. |
| 4 Familie & Papier | Duell, Erklär-Modus, Ausdrucke, QR-Geschenke, Sticker tauschen | Baut auf stabilen Inhalten und dem Charakter-System auf. |
| 5 Mehr Sprachen | Ukrainisch, Arabisch (RTL), Türkisch …, Elternbereich übersetzt, „Deutsch als Zweitsprache“ | Architektur steht seit Phase 0, jetzt nur noch Inhalte – mit Muttersprachlern. |
| 6 Qualität & Recht | Barrierefreiheit, Datenschutz-Prüfung, Impressum, Lizenzen, Leistung auf alten Tablets | Pflicht, bevor Fremde die App nutzen. |
| 7 Öffnung | 5–10 Familien → Pilotklasse → Schulen; erst dann minimaler Server (Familien-Abgleich, geschlossene Inseln); faires Preismodell | Wachstum nur auf geprüfter Grundlage. |

## Wo Feedback einholen – von wem und warum
| Wann | Von wem | Warum | Wie |
|---|---|---|---|
| Laufend, ab sofort | **das erste Testkind** | Sie zeigt, was Spaß macht, was verwirrt, was frustriert | Beobachten statt fragen: zuschauen, wo sie hängt; 2–3 kurze Fragen danach |
| Nach Phase 1 (2–3 Wochen Nutzung) | **Eltern** (ihr) | Hält die Gewohnheit? Passen Zeiten und Regeln in den Familienalltag? | Wochenbericht + kurzes Gespräch: Was nervt, was hilft? |
| Während Phase 2 | **eine Grundschullehrkraft** (Sachsen) und eine **DaZ-Lehrkraft** | Fachliche Richtigkeit, Lehrplanpassung, kindgerechte Sprache, Hilfe für Zweitsprache | Inhalte je Lernbereich durchsehen lassen, Liste mit Fehlern |
| Nach Phase 3 | **2–3 Freundinnen/Freunde** des ersten Testkinds (auch ein Junge) | Funktioniert es ohne Erklärung? Motiviert die Insel? Jungen-Perspektive für den Kleiderschrank | Gemeinsame Spielstunde beobachten |
| Phase 1 und 6 | **Kinderärztin, Kinderpsychologe oder Ergotherapeutin** | Zeitsystem und Fokus-Hilfen (ADHS) sollen helfen, nicht schaden | Konzept + Einstellungen zeigen, 30 min Gespräch |
| Nach Phase 4 | **5–10 befreundete Familien**, bewusst gemischt: eine mit wenig Zeit, eine mit nicht-deutschsprachigen Eltern, eine mit ADHS-Kind | Prüft die schwierigen Fälle: Eltern ohne Zeit, Eltern ohne Deutsch, besondere Bedürfnisse | 4 Wochen Nutzung, kurzer Fragebogen + Gespräch |
| Phase 5 | **Muttersprachler je Sprache** (am besten Eltern/Lehrkräfte) | Kindgerechte, richtige Übersetzungen; kulturelle Passung | Übersetzungen gegenlesen lassen |
| Vor Phase 7 | **Datenschutzberatung**, ggf. Medienpädagogik | Rechtssicherheit bei Kinderdaten, glaubwürdiger Gegenentwurf zu Roblox | Prüfung vor jeder Öffnung |
| Phase 7 | **Schulleitung, Lehrkraft der Pilotklasse, Elternvertretung** | Passt es in Unterricht und Schulalltag? Akzeptanz | Pilot über ein Halbjahr |
