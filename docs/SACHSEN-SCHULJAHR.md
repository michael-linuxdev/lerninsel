# Lehrplan Sachsen in voller Tiefe – „wie ein Schuljahr“

Auftrag (27.10.2026): Den sächsischen Lehrplan **Schritt für Schritt in voller Tiefe** abbilden, **zuerst Klasse 2, dann Klasse 3**,
in **allen Fächern**. „Volle Tiefe“ heißt laut Auftraggeber **„wie ein Schuljahr“**: jeder Inhaltspunkt geübt, in sinnvoller
Reihenfolge, mit Wiederholung und einer Lernstands-Prüfung je Lernbereich.

Dieses Dokument ist die Arbeitsliste dafür. Stand: **Bestandsaufnahme Klasse 2** – die Lehrplantexte (PDF) fehlen noch, darum sind die
Inhaltspunkte unten **vorläufig** (aus dem Länderprofil `shared/lehrplan/laender/sachsen.js`) und müssen gegen das PDF geprüft werden.

## 1. Quellen (vom Auftraggeber hochzuladen)
Die Seiten des Schulportals (`schulportal.sachsen.de/lplandb`) sind aus der Arbeitsumgebung gesperrt. Benötigt als PDF:

| Fach | Fassung | Für Kl. 2 | Für Kl. 3 |
|---|---|---|---|
| Mathematik | 2025 (seit 1.8.2025) | Klassenstufen 1/2 | Klassenstufe 3 |
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

### Mathematik (Lehrplan 2025, Kl. 1/2) – Matheweg Kl. 1 (10 Stationen) und Kl. 2 (23 Stationen)
| Lernbereich | Inhaltspunkt (vorläufig) | Vorhanden | Stand |
|---|---|---|---|
| Zahl und Operation | Zahlen bis 100, Stellenwerte Z/E | `zehner`, `vergleich` | ✅ |
| | Vergleichen, ordnen, Nachbarzahlen, gerade/ungerade | `vergleich`, `gerade`, `k1nachbar` | ✅ |
| | Plus/Minus bis 20, bis 100, über den Zehner, Ergänzen | `plus20` … `ergaenzen` | ✅ |
| | Rechenstrategien benennen und vergleichen, Rechengeschichten erfinden | – | ❌ |
| | Verdoppeln/Halbieren | `doppelt` | ✅ |
| | Einmaleins (Kernaufgaben), Geteilt, Umkehraufgaben | `mal1`, `mal2`, `mal3`, `geteilt` | ✅ |
| | Quadratzahlen | – | ❌ |
| | Hundertertafel, Zahlenstrahl, Rechenstrich | – | 🟡 |
| | Sachaufgaben | `sachaufgaben` | ✅ |
| Größen und Messen | Geld (Euro, Cent) | `geld` | ✅ |
| | Längen (cm, m), messen und schätzen | `laenge` | 🟡 (Schätzen, mm/dm prüfen) |
| | Uhrzeit, Zeitpunkt/Zeitspanne, Kalender | `uhr`, `kalender` | ✅ |
| Raum und Form | Formen (Dreieck, Viereck, Kreis), Körper (Würfel, Quader, Kugel) | `formen` | 🟡 |
| | Lagebeziehungen, Wege beschreiben | – | ❌ |
| | Würfelgebäude, Baupläne | `k3wuerfelbau` (Kl. 3) | ❌ für Kl. 2 |
| | Achsensymmetrie, Spiegeln, Muster | `k1muster`; `k3spiegel` (Kl. 3) | 🟡 |
| | Strecke, gerade Linie, Zeichnen mit Lineal | – | ❌ |
| Daten und Zufall | Strichlisten, Tabellen, Diagramme | `daten` | ✅ |
| | sicher/möglich/unmöglich | `zufall` | ✅ |
| | Einfache Kombinationen | `k3kombi` (Kl. 3) | 🟡 |
| Prozessbezogen | Argumentieren, Darstellen, Problemlösen | Hilfe-Texte | 🟡 |
| Lernstand | Prüfung je Lernbereich | Einstufungstest Kl. 2 (nur Zahl/Operation) | 🟡 |

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
