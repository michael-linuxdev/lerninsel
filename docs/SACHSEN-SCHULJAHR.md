# Lehrplan Sachsen in voller Tiefe – „wie ein Schuljahr“

Auftrag (27.10.2026): Den sächsischen Lehrplan **Schritt für Schritt in voller Tiefe** abbilden, **zuerst Klasse 2, dann Klasse 3**,
in **allen Fächern**. „Volle Tiefe“ heißt laut Auftraggeber **„wie ein Schuljahr“**: jeder Inhaltspunkt geübt, in sinnvoller
Reihenfolge, mit Wiederholung und einer Lernstands-Prüfung je Lernbereich.

Dieses Dokument ist die Arbeitsliste dafür. Stand 27.10.2026 (spätabends): **Mathe Kl. 1/2 gegen das PDF geprüft und ausgebaut.** Deutsch, Sachunterricht und die übrigen Fächer sind noch **vorläufig**
(aus dem Länderprofil) – dafür fehlen die PDFs.

## 1. Quellen (vom Auftraggeber hochzuladen)
Die Seiten des Schulportals (`schulportal.sachsen.de/lplandb`) sind aus der Arbeitsumgebung gesperrt. Benötigt als PDF:

| Fach | Fassung | Für Kl. 2 | Für Kl. 3 |
|---|---|---|---|
| Mathematik | 2025 (seit 1.8.2025) | ✅ liegt vor | ✅ liegt vor |
| Deutsch | 2025 | Klassenstufen 1/2 | Klassenstufe 3 |
| Sachunterricht | 2019 | Klassenstufen 1/2 | Klassenstufe 3 |
| Kunst | aktuell gültige | 1/2 | 3 |
| Musik | aktuell gültige | 1/2 | 3 |
| Werken | aktuell gültige | 1/2 | 3 |
| Sport | aktuell gültige | 1/2 | 3 |
| Ethik (oder ev./kath. Religion) | aktuell gültige | 1/2 | 3 |
| Englisch | 2019 | – (Pflicht erst ab Kl. 3) | 3 |

Regel bleibt: Lehrplantexte **nur zusammenfassen**, nie wörtlich übernehmen; jeder Punkt bekommt eine Lernziel-ID.

**Wichtig:** Mathe, Deutsch und Sachunterricht sind in Sachsen **Doppeljahrgang 1/2**. „Klasse 2“ heißt hier: alles aus 1/2, was am Ende
von Klasse 2 sicher sitzen soll; wo der Lehrplan Kl. 1 und Kl. 2 nicht trennt, ordnen wir nach der üblichen Schulbuch-Reihenfolge
(Zahlenraum 20 in Kl. 1, 100 in Kl. 2) und notieren das.

## 2. Was „wie ein Schuljahr“ in der App heißen soll (Vorschlag, mit den Grundregeln vereinbar)
- **Schuljahres-Pfad je Fach:** Lernbereiche und Inhaltspunkte in Schuljahres-Reihenfolge (1. und 2. Halbjahr). Es ist eine **Empfehlung,
  keine Frist** (Regel: keine Fristen, nichts geht verloren) – das Kind darf schneller, langsamer und springen.
- **„Gerade in der Schule“ (Eltern-Einstellung):** Eltern wählen je Fach, welcher Lernbereich in der Klasse gerade dran ist; die App
  schlägt diesen zuerst vor (Startseite, „Erst lernen“). Ohne Wahl gilt die Reihenfolge des Pfads.
- **Wiederholung:** vorhandene Lernkartei (Mathe, Deutsch) und `Koennen.naechste()`; neu für Sachunterricht und Englisch.
- **Lernstands-Prüfung je Lernbereich („Zeig, was du kannst“):** 8–12 gemischte Aufgaben aus allen Punkten des Lernbereichs, ohne Noten,
  ohne Zeitdruck, jederzeit wiederholbar; Ergebnis nur im Elternbereich je Inhaltspunkt („sitzt“, „üben“, „noch nicht begonnen“),
  für das Kind nur Lob und „das üben wir noch“. Muster: Einstufungstest Kl. 2 im Matheweg.
- **Fächer ohne App-Übung** (Sport, Werken, Teile von Kunst/Musik): Echte-Welt-Aufgaben (`shared/echtewelt.js`) und Eltern-Ideen je
  Lernbereich, ehrlich markiert als „außerhalb der App“.
- **Datenformat (geplant):** je Lernbereich im Länderprofil zusätzlich `punkte: [{ id, text, halbjahr, app: [...], abdeckung }]`;
  `tests/lehrplan.js` zählt dann je Punkt. Elternbereich „Was übt die App?“ zeigt die Punkte aufklappbar.

## 3. Bestandsaufnahme Klasse 2 (vorläufig, gegen PDF prüfen)
Legende: ✅ geübt · 🟡 teilweise · ❌ fehlt · 🌍 außerhalb der App (Echte Welt / Eltern-Idee)

### Mathematik (Lehrplan 2025, Kl. 1/2) – ✅ gegen das PDF geprüft (27.10.2026, spätabends)
Quelle: Lehrplan Mathematik 2025, vom Auftraggeber hochgeladen. **Alle 52 Inhaltspunkte** der vier Lernbereiche stehen zusammengefasst in
`shared/lehrplan/laender/sachsen-punkte.js` (Zuordnung zu Stationen/Echte-Welt-Aufgaben, Klasse 1 / 2 / 1/2) und erscheinen im Elternbereich
unter „Was übt die App?“ zum Aufklappen. Stand: **38 geübt, 11 teilweise, 1 fehlt (Tangram), 2 auf Papier** (Zeichnen mit Lineal/Zirkel).

| Lernbereich | Punkte | Stand | Was noch fehlt |
|---|---|---|---|
| Raum und Form | 15 | 9 ✅ 3 🟡 1 ⭕ 2 🌍 | Rechts/links am Körper, vorn/hinten räumlich, eigene Baupläne, Tangram; Zeichnen nur auf Papier |
| Zahl und Operation | 21 | 16 ✅ 5 🟡 | Darstellungen selbst wechseln (Material), eigene Rechenwege begründen, Entdeckerpäckchen, Rechengeschichten frei erfinden, Spielstrategien vertiefen |
| Größen und Messen | 10 | 9 ✅ 1 🟡 | echtes Messen mit Lineal/Maßband (Echte Welt) |
| Daten und Zufall | 6 | 4 ✅ 2 🟡 | eigene Umfrage (Echte Welt), Tabelle selbst anlegen |

Neu im Matheweg Kl. 2 (jetzt 40 Stationen, die neuen am Ende): Zahlen bis 100, Wo ist was?, Rechentricks, Euro und Cent, Linien und Strecken,
Zahlenmauern und Rätsel, mm/cm/dm/m, Wege gehen, Quadratzahlen, Tabellen und Balken, Figuren und Körper genau, Zeitspannen, Mathe-Wörter,
Kombinieren, Spiegeln und Muster, Sachaufgaben-Detektiv, Würfelgebäude. **Freischalten je Lernbereich:** Jede Station gehört zu einem
Lernbereich (`lb`); sie ist auch offen, wenn die vorige Station desselben Lernbereichs geschafft ist – die vier Lernbereiche laufen wie im
Schuljahr nebeneinander. Die alte Regel gilt zusätzlich, nichts wird gesperrt.

### Mathematik Kl. 3 und Kl. 4 – ✅ gegen das PDF geprüft (27.10.2026, nachts)
| Klasse | Punkte | Stand | Neue Stationen (am Ende des Wegs, `zusatz: true`) |
|---|---|---|---|
| 3 | 34 | 27 ✅ 5 🟡 2 🌍 | Zahlen bis 1000 genau, Mal und geteilt bis 1000, Rechenvorteile und Fehler, Zahlenfolgen/Mauern/Quersumme, Pyramide/Kegel/Zylinder, Parallelogramm und Dreiecke, Bandornamente, Würfelgebäude: Ansichten, Größen genauer, Fahrplan/Möglichkeiten/Zufall (Weg jetzt 30 Stationen) |
| 4 | 31 | 24 ✅ 4 🟡 3 🌍 | Haus der Vierecke, Vergrößern und Verkleinern, Volumen und Flächen, Parkette und Drehungen, Tonne/kg/g, Reiseplanung, Diagramme/Baum/Würfel, Rechenmeister (figurierte Zahlen, Fehler finden, zwei Subtrahenden, Adam Ries) (Weg jetzt 23 Stationen) |

Noch teilweise: Kl. 3 Perspektiven/Pläne, Umfang mit dem Faden, Quadernetze, Sachaufgaben mit eigenen Skizzen, Denk- und Legespiele;
Kl. 4 Wegeskizzen, Schrägbilder lesen, Körpernetze vergleichen, römischer Abakus. Auf Papier/draußen: genaues Zeichnen, Schrägbilder skizzieren,
Messen mit Waage und Messrad, eigene Umfragen. **Kl. 4-Urkunde** zählt nur die ursprünglichen 15 Stationen (keine verdiente Urkunde geht verloren).
Lernbereiche Kl. 4 „Größen und Messen“ und „Daten und Zufall“ jetzt „gut“ – Sachsen gesamt (Mathe, Deutsch, SU) **22 gut, 23 teilweise, 0 fehlt**.

### Deutsch (Lehrplan 2025, Kl. 1/2) – Abenteuer (5), Lesen und Schreiben, DaZ, Werkstatt (Kl. 1–2: 7 Kapitel)
| Lernbereich | Inhaltspunkt (vorläufig) | Vorhanden | Stand |
|---|---|---|---|
| Sprechen und Zuhören | Erzählen, informieren, erklären | Bildergeschichte nacherzählen (Aufnahme, Kl. 3) | 🟡 |
| | Gesprächsregeln, Konflikte mit Worten lösen | Gefühle (Streit), SU „Regeln“ | 🟡 |
| | Vortragen, eigene Stimme aufnehmen | `w-reime` (Aufnahme mit Eltern-Schalter) | ✅ |
| | Verstehend zuhören | Hör-Aufgaben, Vorlesen | ✅ |
| Schreiben | Druckschrift, Buchstaben formen | Lesen: Nachspuren | ✅ |
| | Schulausgangsschrift (verbundene Schrift) | – | ❌ |
| | Lautgetreu schreiben, Rechtschreibstrategien | Wörter legen, `w-verlaengern` | ✅ |
| | Großschreibung, Satzschlusszeichen | `w-einladung` (Prüfung) | 🟡 |
| | Kurze Texte schreiben (Einladung, Glückwunsch), überarbeiten | `w-einladung` | 🟡 (Glückwunsch, Überarbeiten fehlen) |
| | Wörterbuch/Wörterliste nutzen | `w-woerterbuch` (Kl. 3) | 🟡 |
| Lesen | Laute, Buchstaben, Silben, Wörter, Sätze | Anlaute, Silben, Lesetexte | ✅ |
| | Flüssig lesen, Fragen zum Text | 20 Lesetexte | ✅ |
| | Lautlesen mit Rückmeldung | – | ❌ (Aufnahme könnte helfen) |
| Texte und Medien | Bilderbücher, Märchen, Gedichte | Abenteuer, `w-reime` | 🟡 (Bilderbücher, Märchen fehlen) |
| | Bibliothek, Hörtexte | – | ❌ |
| | Digitale Geräte, Chancen und Risiken | Tablet-Führerschein | ✅ |
| Sprache untersuchen | Wortarten, Artikel, Mehrzahl, Lagewörter | Werkstatt, Abenteuer | ✅ |
| | Silben, Reime, Wortfamilien, zusammengesetzte Nomen | `w-silben`, `w-reime`; `w-vornach` (Kl. 3) | 🟡 |
| | Satzarten, Sätze umstellen | `satz`-Schritte | 🟡 |
| | Mehrsprachigkeit, Dialekt | DaZ, Hilfesprache | 🟡 |

### Sachunterricht (Lehrplan 2019, Kl. 1/2) – 26 Themen ohne Stufe
| Lernbereich | Inhaltspunkt (vorläufig) | Vorhanden | Stand |
|---|---|---|---|
| Zusammen leben und lernen | Rituale, Tagesrhythmus | – | ❌ |
| | Regeln, Konflikte lösen | `familie`, `regeln` | ✅ |
| | Informieren in Medien | `medien-info` | 🟡 |
| Körper und Gesundheit | Hygiene, Zähne, Bewegung, Ernährung, Erste Hilfe | `gesundheit`, `erstehilfe` | ✅ |
| Pflanzen und Tiere | Jahreszeiten, Vogelzug, Laub-/Nadelbäume | `baeume-voegel` | ✅ |
| | Frühblüher, Keimen | `pflanzen` | ✅ |
| | Haustiere und Pflege | eigenes Tier (spielerisch) | 🟡 (kein Sachthema) |
| Unbelebte Natur | Licht und Schatten | – | ❌ |
| | Luft, Wind, Schall | – | ❌ |
| | Wetter beobachten, Thermometer | `wetterkarte` (eher Kl. 3), Insel-Wetter | 🟡 |
| | Wasser: lösen, trennen, schützen | `wasser` | 🟡 |
| Raum und Zeit | Schule, Heimatort, Ortsplan | – | ❌ |
| | Uhr, Kalender | Mathe `uhr`, `kalender` | ✅ |
| | Schulweg, Verkehr | `schulweg` | ✅ |
| Erste Schuljahre | Zeitleiste, Portfolio, Steckbrief | `frueher` | 🟡 |
| Technik (falls im LP 1/2) | Bauen, stabile Türme | `bauen` | ✅ (zu prüfen) |

### Weitere Fächer Kl. 2
| Fach | Vorhanden | Stand |
|---|---|---|
| Kunst | Atelier: Malen mit Vorlagen und freiem Malen, Bilder an die Wand | 🟡 (Farbenlehre, Kunstwerke betrachten, Collage, Plastisches fehlen; Plastisches 🌍) |
| Musik | Atelier: Musik (Klänge, Instrument), Silben klatschen | 🟡 (Lieder singen, Rhythmus-Notation, Instrumente kennen fehlen) |
| Werken | – | 🌍 (Papier falten, schneiden, kleben – Echte-Welt-Ideen; evtl. Faltanleitungen in der App) |
| Sport | Bewegungspausen (Zeitsystem) | 🌍 (Bewegungsaufgaben, keine Bewertung) |
| Ethik / Religion | Gefühle (erkennen, Streit, Ruhe), SU „Regeln“, „Kinderrechte“ (Kl. 4) | 🟡 (Ethik-Lehrplan prüfen; Religion nur als Eltern-Wahl, neutral) |
| Englisch (freiwillig Kl. 1/2) | Eltern-Einstellung „ab Kl. 1“, Kl.-3-Lektionen | 🟡 (keine eigenen Kl.-1/2-Lektionen: Lieder, Reime, Begrüßung) |
| Medienbildung (fachübergreifend) | Tablet-Führerschein | ✅ |

## 4. Reihenfolge der Arbeit
1. **PDFs Kl. 1/2 da → Prüfliste oben je Fach genau ausfüllen** (jeden Inhaltspunkt zusammenfassen, Lernziel-ID, Halbjahr), Datenformat
   `punkte` ins Länderprofil, Test zählt je Punkt.
2. **Schuljahres-Gerüst** (einmal für alle Fächer): Pfad je Fach, Eltern-Einstellung „gerade in der Schule“, Lernstands-Prüfung je
   Lernbereich, Elternbericht je Punkt.
3. **Lücken Kl. 2 schließen**, je Fach in Paketen: Mathe (Raum und Form, Quadratzahlen, Hundertertafel/Rechenstrich, Strategien) →
   Deutsch (Glückwunsch/Überarbeiten, Schulausgangsschrift, Märchen/Bilderbuch, Lautlesen) → Sachunterricht (Licht/Schatten, Luft/Schall,
   Ortsplan, Rituale, Haustiere) → Kunst/Musik → Werken/Sport/Ethik (Echte Welt) → Englisch Kl. 1/2 (freiwillig).
4. Danach dasselbe für **Klasse 3**.

### Mathematik Klasse 1 und Übergang 5 (27.10.2026, nachts)
- **Klasse 1** (Teil der Doppelklasse 1/2): Weg „Klasse 1 und Vorschule“ jetzt 19 Stationen (+9: Zahlen bis 20, Größer/kleiner/gleich,
  Plus und minus bis 20 mit Zehnerübergang, Tausch- und Umkehraufgaben, Rechengeschichten, Oben/unten/links/rechts, Formen entdecken,
  Geld bis 20 €, Uhr und Tag, Länger/kürzer/schwerer, Zählen und Strichliste). Die Kl.-1/2-Punkte verweisen jetzt auch auf diese Stationen,
  ein Kind in Kl. 1 übt damit die Kl.-1-Anteile im eigenen Weg statt erst im Kl.-2-Weg.
- **Übergang 5:** Weg jetzt 16 Stationen (+6: Große Zahlen und Potenzen, Teiler und Primfaktoren, Terme und Gleichungen, Grad und
  Symmetrieachsen, Flächen- und Rauminhalt, Größen umrechnen und Maßstab). 15 Übergangs-Punkte (13 geübt, 1 teilweise, 1 Papier) – **vorläufig**:
  Der Lehrplantext Kl. 5 (Oberschule/Gymnasium) liegt nicht vor; Grundlage sind der Grundschul-Lehrplan Kl. 4 und die üblichen Startthemen
  der 5. Klasse. Mit dem PDF Kl. 5 lässt sich das genau nachziehen. Urkunde „Fit für Klasse 5“ zählt weiter die ursprünglichen 10 Stationen.
- **Mathe gesamt:** Inhaltspunkte Kl. 1/2: 52, Kl. 3: 34, Kl. 4: 31, Übergang 5: 15. Matheweg: Kl. 1 19, Kl. 2 40, Kl. 3 30, Kl. 4 23, Übergang 16 = 128 Stationen.

### ✅ Mathematik Grundschule vollständig (27./28.10.2026, Nacht)
Jeder Inhaltspunkt des Lehrplans Mathematik 2025 (Kl. 1/2, 3, 4) wird in der App geübt – oder ist ehrlich als 🌍 „draußen/auf Papier“
markiert (dafür gibt es Echte-Welt-Aufgaben). Keine Punkte mehr „teilweise“ oder „fehlt“.

| Klasse | Punkte | ✅ in der App | 🌍 draußen/Papier |
|---|---|---|---|
| 1/2 | 54 | 50 | 4 (Zeichnen mit Lineal/Geodreieck, Kreise mit Zirkel, selbst messen, eigene Umfrage) |
| 3 | 34 | 32 | 2 (millimetergenau zeichnen, Messen mit Waage und Messrad) |
| 4 | 32 | 28 | 4 (Muster zeichnen, Schrägbilder skizzieren, eigene Wegeskizze, eigene Umfrage) |

Letzte Stationen dazu: Kl. 1 Rechts und links (Kind von hinten/vorn), Vorn und hinten, Figuren legen; Kl. 2 Baupläne finden, Rechenwege
und Entdeckerpäckchen, Bild/Zahl/Rechnung, Knobeln und Strategiespiele, Tabellen ausfüllen; Kl. 3 Pläne und Blickrichtungen, Fläche und
Umfang vergleichen, Würfel-/Quader-/Körpernetze, Sachaufgaben mit Skizze und Tabelle, Knobeln und Legespiele; Kl. 4 Wegeskizzen und
Entfernungen, Schrägbilder lesen, Adam Ries: Rechnen auf den Linien. Rechengeschichten erfinden die Kinder schreibend in der Wörter-Werkstatt
(Kapitel „Rechengeschichten erfinden“, die App prüft, ob die Zahlen vorkommen und am Ende eine Frage steht).
Alle 12 Mathe-Lernbereiche Kl. 1–4 stehen auf „gut“ – von Hand und nach den Lernzielen errechnet. Matheweg: Kl. 1 22, Kl. 2 45, Kl. 3 35,
Kl. 4 26 Stationen (dazu Übergang 5: 16).

### Schuljahres-Gerüst Mathe (28.10.2026, früh) – erster Teil gebaut
- **Lernbereichs-Kacheln** über jedem Matheweg: je Lernbereich Fortschritt („x von y Stationen“) und **„🔍 Zeig, was du kannst“** – eine Aufgabe
  je Station des Lernbereichs (höchstens 10), ohne Noten, ohne Stations-Sterne, ohne Wiederholung am Ende. Das Kind hört „Das kannst du schon …
  Das üben wir noch zusammen …“ und bekommt einen Knopf zur ersten offenen Übungsstation. Gespeichert in `mathe.lernstand["<weg>:<lb>"]`.
- **Eltern-Einstellung „Gerade in der Schule“** (Karte „Mathe wie in der Schule“, `eltern.mathe.schule` = `zo`|`rf`|`gm`|`dz`): Die Kachel wird
  markiert, der „Jetzt“-Marker springt auf die nächste offene Station dieses Lernbereichs. Nichts wird gesperrt.
- **Elternbereich:** „Zeig, was du kannst – zuletzt“ je Weg und Lernbereich mit Datum, Anzahl auf Anhieb richtig und „noch üben: …“.
- **Entschieden:** kein fester Halbjahres-Plan (der Lehrplan überlässt die Reihenfolge der Lehrkraft) – „Gerade in der Schule“ ersetzt ihn.
- **Offen:** dasselbe Gerüst für Deutsch, Sachunterricht, Englisch, sobald deren Inhaltspunkte stehen.
