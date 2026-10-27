# Lehrplan: gemeinsamer Kern, Länder, Abdeckung, Datenformat

> Neu gefasst am 26.10.2026 (Neuausrichtung). Der bisherige Bauplan Klasse 2 steht am Ende als Historie.
> Inhalte der Lehrpläne sind **zusammengefasst und zugeordnet, nicht abgeschrieben**. Jede Zuordnung muss vor dem Bau eines
> Inhalts noch einmal am Originaldokument geprüft werden (Spalte „Quelle“). Die Fachprüfung durch eine Lehrkraft bleibt Pflicht.

## Entscheidungen
1. **Kern zuerst:** Inhalte werden am bundesweiten Kern ausgerichtet (KMK-Bildungsstandards für Deutsch und Mathematik,
   KMK-Strategie „Bildung in der digitalen Welt“, für Sachunterricht der Perspektivrahmen der Fachgesellschaft GDSU als
   länderübergreifende Orientierung). Für Kunst, Musik, Sport und Ethik gibt es keine KMK-Standards; dort gilt der kleinste
   gemeinsame Nenner der Länderpläne.
2. **Länderprofile:** Sachsen (bestehend) plus die großen Länder **NRW, Bayern, Baden-Württemberg, Niedersachsen und
   Berlin/Brandenburg**. Ein Land unterscheidet sich vom Kern durch (a) eine andere Stufe für dasselbe Lernziel,
   (b) Zusatz-Lernziele, (c) Fachnamen, (d) Schulstruktur (Grundschule bis Klasse 4 oder 6).
3. **Stufen:** Vorschule (letztes Kita-Jahr), Klasse 1, 2, 3, 4 und „Übergang 5“. Klasse 1/2 bleiben in den Daten getrennt,
   auch wo ein Land sie als Doppeljahrgang führt (Sachsen: „1/2“) – das Land fasst sie im Filter zusammen.
4. **Ehrliche Abdeckung:** `ja` (übt das Lernziel mit Aufgaben und Wiederholung), `teil` (einzelne Aufgaben oder nur ein Ausschnitt),
   `nein`. Die Werte von Hand für Sachsen (`shared/lehrplan/laender/sachsen.js`, 49 Lernbereiche): **6 × ja, 14 × teil, 29 × nein** (Klasse 1/2, 3, 4 zusammen; nachgezählt am 27.10.2026). Daneben errechnet `shared/lehrplan.js` die Abdeckung aus den Lernziel-Verweisen (NA-03).

## Quellen
| Kürzel | Dokument | Link |
|---|---|---|
| KMK-D | Bildungsstandards Deutsch Primarbereich (Fassung 23.06.2022): 5 Kompetenzbereiche | [kmk.org PDF](https://www.kmk.org/fileadmin/Dateien/veroeffentlichungen_beschluesse/2022/2022_06_23-Bista-Primarbereich-Deutsch.pdf) |
| KMK-M | Bildungsstandards Mathematik Primarbereich (Fassung 23.06.2022): 5 Leitideen, 6 prozessbezogene Kompetenzen, Regelstandards | [kmk.org PDF](https://www.kmk.org/fileadmin/Dateien/veroeffentlichungen_beschluesse/2022/2022_06_23-Bista-Primarbereich-Mathe.pdf) |
| KMK-DW | Strategie „Bildung in der digitalen Welt“ (2016): 6 Kompetenzbereiche | [kmk.org PDF](https://www.kmk.org/fileadmin/Dateien/pdf/PresseUndAktuelles/2016/2016_12_08-KMK-Kompetenzen-in-der-digitalen-Welt.pdf), [Bildungsserver](https://www.bildungsserver.de/schule/digitale-kompetenz-6236-de.html) |
| GDSU | Perspektivrahmen Sachunterricht (Gesellschaft für Didaktik des Sachunterrichts, vollst. überarb. Ausgabe 2013): 5 Perspektiven + perspektivenvernetzende Themen | [Klinkhardt (Leseprobe PDF)](https://www.klinkhardt.de/newsite/media/20160309_9783781520837Edit.pdf), [GDSU an der Uni Bremen](https://www.uni-bremen.de/fb12/arbeitsbereiche/abteilung-d-fachdidaktiken-des-primar-und-elementarbereichs/sachunterricht-gesellschaftswissenschaften/gesellschaft-fuer-didaktik-des-sachunterrichts-ev) |
| SN | Lehrpläne Grundschule Sachsen (Mathematik 2025, Deutsch und Sachunterricht 2019, weitere Fächer) | [Lehrplandatenbank Sachsen](https://www.schulportal.sachsen.de/lplandb/) |
| NRW | Lehrpläne Primarstufe, gültig ab 01.08.2021, nur digital im Lehrplannavigator; neu: Praktische Philosophie; Englisch ab Kl. 3 | [Schulministerium NRW](https://www.schulministerium.nrw/04082021-neue-lehrplaene-fuer-die-primarstufe), [Sammelband PDF](https://lehrplannavigator.nrw.de/system/files/media/document/file/ps_lp_sammelband_2021_08_02.pdf) |
| BY | LehrplanPLUS Grundschule (u. a. Heimat- und Sachunterricht, Werken und Gestalten, Musik, DaZ) | [LehrplanPLUS HSU Kl. 1](https://www.lehrplanplus.bayern.de/schulart/grundschule/jgs/1/fach/hsu), [Musik](https://www.lehrplanplus.bayern.de/schulart/grundschule/fach/musik), [DaZ](https://www.lehrplanplus.bayern.de/schulart/grundschule/jgs/1/fach/daz) |
| BW | Bildungsplan 2016; überarbeitete Pläne Deutsch und Mathematik ab Schuljahr 2024/25, beginnend mit Kl. 1 und 2, auf Grundlage der KMK-Standards 2022 | [Kultusministerium BW (PDF)](https://km.baden-wuerttemberg.de/fileadmin/redaktion/m-km/intern/PDF/Dateien/Allgemeine_Infos/Bildungsplanarbeiten-Deutsch-und-Mathematik-Inkraftsetzung_bf.pdf), [bildungsplaene-bw.de](https://bildungsplaene-bw.de/) |
| NI | Kerncurricula Grundschule | [KC Mathematik (PDF)](https://www.mk.niedersachsen.de/download/211766/KC_Mathematik_fuer_die_Grundschule.pdf), [KC Deutsch (PDF)](https://www.mk.niedersachsen.de/download/120953/Kerncurriculum_Deutsch.pdf) |
| BB | Rahmenlehrplan 1–10 Berlin/Brandenburg (Grundschule umfasst Jahrgangsstufen 1–6; Teil C Deutsch neu gefasst 2024) | [RLP Teil C Deutsch (PDF)](https://bildungsserver.berlin-brandenburg.de/fileadmin/bbb/unterricht/rahmenlehrplaene/Rahmenlehrplanprojekt/amtliche_Fassung/Teil_C_Deutsch_2024_02_28.pdf), [Bildungsserver Berlin-Brandenburg, Planungshilfen Mathematik 1–6](https://bildungsserver.berlin-brandenburg.de/fileadmin/bbb/unterricht/faecher/naturwissenschaften/mathematik/Planungshilfen_kompetenzorientierter_Unterricht/Grundschule/Vorwort_Planungshilfen_fuer_den_Mathematikunterricht_der_Jahrgangsstufen_1_bis_6.pdf) |
| KITA | Bildungspläne der Länder für Kindertageseinrichtungen (Übersicht) | [Deutscher Bildungsserver](https://www.bildungsserver.de/bildungsplaene-fuer-kitas-2027-de.html) |
| UE | Übergang zur weiterführenden Schule, Regelungen der Länder | [Deutscher Bildungsserver](https://www.bildungsserver.de/schule/uebergang-zur-weiterfuehrenden-schule-12373-de.html) |

Erledigt (NA-03, 27.10.2026): Der Lehrplan-Kern `shared/lehrplan/kern.js` und `LEHRPLAN.kmk.deutsch` nutzen die fünf Bereiche der Fassung 2022
(„Lesen“ und „Sich mit Texten und anderen Medien auseinandersetzen“ sind getrennt).

---

## Matrix: Fach × Stufe × Kompetenzbereich
Kurzform: Was ein Kind am Ende der Stufe ungefähr können soll (zusammengefasst aus dem Kern; Länder-Abweichungen danach).
„Vorschule“ stützt sich auf die Kita-Bildungspläne (Bildungsbereiche statt Fächer, keine Leistungserwartung).

### Mathematik (KMK-M; Vorschule: KITA)
| Bereich | Vorschule | Kl. 1 | Kl. 2 | Kl. 3 | Kl. 4 | Übergang 5 |
|---|---|---|---|---|---|---|
| Zahl und Operation | Mengen bis 10 erfassen, zählen, Würfelbilder | ZR 20, Plus/Minus, Zerlegen, Verdoppeln | ZR 100, Zehnerübergang, Einmaleins-Einstieg (Kernaufgaben), Teilen als Umkehrung | ZR 1000, Einmaleins sicher, halbschriftlich, schriftliche Addition/Subtraktion | ZR 1 Mio., schriftliche Multiplikation/Division, Überschlag | Brüche im Alltag, Teilbarkeit, große Zahlen |
| Raum und Form | oben/unten/neben, Formen erkennen | Lagebeziehungen, ebene Figuren | Körper, Symmetrie, Würfelgebäude | Netze, Pläne, Spiegeln | Maßstab einfach, Flächen vergleichen | Koordinaten, Winkel-Vorstufe |
| Muster, Strukturen, funkt. Zusammenhang | Muster fortsetzen | Zahlenfolgen | Rechenmuster, Tauschaufgaben | Zahlenmuster beschreiben | Proportionale Zusammenhänge einfach | Terme lesen |
| Größen und Messen | länger/kürzer, schwerer | Geld (Euro), Zeitpunkte | Länge (cm, m), Uhr (volle/halbe), Kalender | Gewicht, Zeitspannen | Volumen (l, ml), Umrechnen, Sachrechnen | Dezimalschreibweise bei Größen |
| Daten und Zufall | sortieren, vergleichen | Strichliste | Diagramm lesen, sicher/möglich/unmöglich | Diagramme erstellen, Kombinationen | Wahrscheinlichkeit vergleichen | Mittelwert-Idee |
| Prozessbezogen | erklären, zeigen | Rechenweg zeigen | argumentieren, darstellen | modellieren (Sachaufgaben) | Probleme lösen, Strategien | begründen |

### Deutsch (KMK-D; Vorschule: KITA Sprache und Literacy)
| Bereich | Vorschule | Kl. 1 | Kl. 2 | Kl. 3 | Kl. 4 | Übergang 5 |
|---|---|---|---|---|---|---|
| Sprechen und Zuhören | zuhören, nacherzählen, Reime | erzählen, Gesprächsregeln | genau zuhören, vortragen | Meinung begründen | präsentieren | diskutieren |
| Schreiben | Kritzeln, eigener Name | Buchstaben, lautgetreu schreiben | Rechtschreibstrategien, kurze Texte | Texte planen und überarbeiten | Textsorten (Bericht, Brief) | längere Texte |
| Lesen | Bilderbuch, Anlaute hören | Synthese, Silben, kurze Sätze | flüssig lesen, einfache Fragen | Strategien, Sachtexte | Informationen entnehmen, vergleichen | Lesestrategien sicher |
| Mit Texten und Medien umgehen | Geschichten erleben | Bilderbuch, Hörspiel | Kinderbuch, Lieblingstexte | Medien vergleichen | Texte und Medien bewerten | Medien kritisch |
| Sprache untersuchen | Silben klatschen | Laute, Buchstaben, Satzanfang groß | Wortarten (Nomen, Verb, Adjektiv), Artikel, Mehrzahl | Zeitformen, Satzglieder | Satzarten, Wortfamilien, Fälle einfach | Grammatik-Begriffe |

### Sachunterricht (GDSU-Perspektiven; Vorschule: KITA Natur, Welt)
| Perspektive | Vorschule | Kl. 1–2 | Kl. 3–4 | Übergang 5 |
|---|---|---|---|---|
| Sozialwissenschaftlich (Zusammenleben, Regeln, Kinderrechte) | Freunde, Familie | Klasse, Regeln, Familie | Gemeinde, Demokratie im Kleinen, Geld | Gesellschaft, Politik einfach |
| Naturwissenschaftlich (Natur, Körper, Stoffe) | Tiere, Pflanzen, Wasser | Körper und Gesundheit, Bäume, Vögel, Wetter | Wasser, Luft, Strom einfach, Lebensräume | Biologie, Physik-Vorbereitung |
| Geographisch (Raum, Orientierung) | Wege, Spielplatz | Schulweg, Verkehr | Karten, Himmelsrichtungen, Heimatregion, Bundesland | Deutschland, Europa |
| Historisch (Zeit, Wandel) | gestern/heute | Kalender, eigene Geschichte, Feste | früher und heute, Heimatgeschichte | Geschichte-Einstieg |
| Technisch (Bauen, Werkzeuge, Erfinden) | bauen, Werkzeuge | Brücken, Türme, Hebel | Fahrrad, einfache Maschinen | Technik |

### Kunst, Musik, Sport/Bewegung, Ethik/soziales Lernen, Medienbildung (Länderpläne, gemeinsamer Nenner)
| Fach | Vorschule | Kl. 1–2 | Kl. 3–4 | Übergang 5 |
|---|---|---|---|---|
| Kunst | malen, kneten, Farben | Farben mischen, Formen, Muster, Collage | Perspektive einfach, Kunstwerke betrachten, Gestalten mit Material | Bildanalyse |
| Musik | singen, klatschen, Klänge | hoch/tief, laut/leise, Rhythmus, Lieder, Instrumente | Notenwerte, einfache Notation, eigene Melodien, Komponisten | Musiktheorie |
| Sport/Bewegung | rennen, balancieren | Grundbewegungen, Ballspiele, Spiele mit Regeln | Ausdauer, Turnen, Fairness | Sportarten |
| Ethik/soziales Lernen | Gefühle benennen, teilen | Gefühle, Freundschaft, Regeln, Streit lösen | Gerechtigkeit, Vielfalt, Kinderrechte, Natur schützen | Werte begründen |
| Medienbildung (KMK-DW) | Bedienung | Suchen, Schützen (Passwörter), Kommunizieren | Produzieren (Bild, Ton), Analysieren (Werbung, Fakes), Problemlösen (einfaches Programmieren) | alle sechs Bereiche |

---

## Länder-Abweichungen (erste Fassung, vor dem Bau eines Inhalts jeweils prüfen)
| Thema | Sachsen | NRW | Bayern | Baden-Württ. | Niedersachsen | Berlin/Brandenburg |
|---|---|---|---|---|---|---|
| Grundschule bis | Kl. 4 | Kl. 4 | Kl. 4 | Kl. 4 | Kl. 4 | **Kl. 6** – „Übergang 5“ ist dort noch Grundschule |
| Sachunterricht heißt | Sachunterricht | Sachunterricht | **Heimat- und Sachunterricht (HSU)** | Sachunterricht | Sachunterricht | Sachunterricht |
| Ethik | Ethik (alternativ Religion) | **Praktische Philosophie** (neu seit 2021) | Ethik | Ethik (prüfen) | Werte und Normen (prüfen) | Lebenskunde/Ethik (prüfen) |
| Werken/Technik | im Sachunterricht/Werken | im Sachunterricht | **Werken und Gestalten** | prüfen | prüfen | prüfen |
| Englisch | ab Kl. 3 | ab Kl. 3 | ab Kl. 3 (prüfen) | prüfen | ab Kl. 3 (prüfen) | prüfen |
| Lehrplan-Stand Mathe | 2025 (Deutsch ebenfalls 2025; Sachunterricht und Englisch 2019) | 2021 | LehrplanPLUS | **neu ab 2024/25** (Kl. 1/2 zuerst) | KC | RLP 1–10 |
| Einmaleins vollständig | eher Kl. 3 (Lehrplan 2025) | prüfen | prüfen | prüfen | prüfen | prüfen |
| Heimatbezug | Sachsen, Dresden/Leipzig, Erzgebirge | NRW-Regionen | Bayern, Bezirke | BW | NI | Berlin/Brandenburg |

„prüfen“ heißt: Die Quelle ist verlinkt, der Punkt wurde in dieser Sitzung nicht gegengelesen. Jede Zelle bekommt beim Bau
eines Inhalts eine Fundstelle (Datei, Seite oder Lehrplan-Abschnitt).

**Übergang 5:** In den Ländern mit Grundschule bis Klasse 4 geht es um Wiederholung der Kl.-4-Ziele, Lernstrategien und
Selbstständigkeit; die Schulform-Empfehlung regeln die Länder unterschiedlich (Quelle UE). Die App bewertet nicht, welche
Schulform passt, und zeigt keine Noten.

---

## Was die App heute abdeckt (ehrlich)
| Fach | Was es gibt | Dateien | Einschätzung |
|---|---|---|---|
| Mathematik | Matheweg Klasse 1/Vorschule mit 10 Stationen (Würfelbilder, Mengen, Zwanzigerfeld, Muster, Zerlegen, Plus/Minus bis 10; NA-32) und Matheweg Klasse 2 mit 23 Stationen (ZR 20/100, Zehner, Vergleich, gerade, Formen, Verdoppeln, Ergänzen, Sachaufgaben, Daten, Einmaleins 1–3, Geteilt, Geld, Länge, Zufall, Uhr, Kalender), Einstufung, Lernkartei, Duell, Bauplatz-Zählaufgaben | `spiele/mathe/aufgaben.js`, `mathe.js`, `spiele/familie/`, `quellen/welt3d/bau.js` | Kl. 2 gut, Kl. 1 und Vorschule mit eigenem Weg (Mengen), Kl. 3 kaum, Kl. 4 nicht |
| Deutsch | Fipsis Abenteuer (5 Kapitel: Wortschatz, Artikel, Lücken, Satzbau, Hören, Mehrzahl, Präpositionen), Wörter-Werkstatt (Verben, Adjektive, Wortarten, Verlängern, Silben), Wort des Tages (64 Wörter, jetzt aus dem Wortschatz-Kern), „Ankommen“ (DaZ D0: 100 Wörter, 20 Sätze) | `spiele/deutsch/`, `spiele/daz/`, `inhalte/woerter/`, `shared/woerter.js` | Sprache untersuchen Kl. 2 teilweise; Laute und Buchstaben, Silben lesen, 20 Lesetexte, Buchstaben nachspuren und Wörter legen (NA-30/31/35, `spiele/lesen/`); freies Schreiben und Texte fehlen noch |
| Sachunterricht | 4 Themen: Geschenkebringer, Familie, Gesund und munter, Bäume und Vögel; echtes Wetter auf der Insel | `spiele/sachkunde/themen.js`, `quellen/welt3d/heimat.js` | dünn: nur Ausschnitte aus 2 Perspektiven |
| Kunst | Malen, Ausmalbilder, 14 Malaufträge | `spiele/atelier/atelier.js`, `vorlagen.js` | Kl. 1–2 teilweise |
| Musik | Xylofon, 4 Lieder, Rhythmus, hoch/tief, laut/leise, eigene Melodie, Bühne | `spiele/atelier/musik.js` | Kl. 1–2 gut für den Anfang |
| Sport/Bewegung | 12 Bewegungsübungen, Bewegungspausen | `spiele/gefuehle/gefuehle.js`, `shared/zeit.js` | Ergänzung, kein Sportunterricht (soll es auch nicht sein) |
| Ethik/soziales Lernen | Gefühle erkennen, Barometer, Ruhe-Übungen, 8 Miteinander-Geschichten, Stärken | `spiele/gefuehle/`, `shared/staerken.js` | Kl. 1–2 teilweise |
| Medienbildung | Tablet-Führerschein (6 Lektionen) | `spiele/medien/` | Bereiche Schützen und Analysieren gut, Produzieren/Problemlösen fehlen |
| Denken | Schach (Lektionen, Matt in 1, KI) | `spiele/schach/` | Zusatz, kein Lehrplanfach |
| Vorschule | „Gleicher Anfang“, Buchstaben-Tafel, Matheweg Klasse 1/Vorschule (Mengen, Würfel, Muster), „Ankommen“ | `spiele/lesen/`, `spiele/mathe/`, `spiele/daz/` | Anfang gemacht, kein eigener Pfad |
| Englisch | „Englisch mit Papagei Paula“: 11 Lektionen (Kl. 3: Begrüßen, Farben, Zahlen, Tiere, Körper, Essen; Kl. 4: Familie, Schulsachen, Kleidung, Wetter; Übergang 5: Hobbys/über mich) mit Wortkarten, Hören (englische Gerätestimme), Lesen, Übersetzen, Satzbau; Eltern-Einstellung Beginn ab Kl. 1 oder 3 | `spiele/englisch/` | Einstieg gemacht: Wortschatz und Hören gut, Sprechen nur als Nachsprechen (keine Spracherkennung), Lesen/Schreiben wenig |
| Übergang 5 | Matheweg „Übergang 5“ (10 Stationen: Fit aus Kl. 4, Brüche erkennen/von Mengen/vergleichen, Kommazahlen bei Größen, Klammer und Punkt vor Strich, Koordinaten, Winkel, Durchschnitt, Sachaufgaben in Schritten, Urkunde), Werkstatt „Fachbegriffe für Klasse 5“ und „Lesestrategien“, Eule Ella „Lernen lernen“ und „Neue Schule“ (NA-39) | `spiele/mathe/aufgaben.js` (`STATIONEN_K5`), `spiele/deutsch/werkstatt.js`, `spiele/sachkunde/themen.js` | Anfang gemacht: Mathe gut, Deutsch und Lernstrategien teilweise; Englisch, Erdkunde/Europa fehlen |

## Lücken nach Priorität
Gewichtung: (1) Grundlage für alles Weitere, (2) betrifft viele Kinder/Stufen, (3) passt in Story und Insel.

| Prio | Lücke | Warum zuerst | Paket |
|---|---|---|---|
| 1 | **Lesen und Schriftspracherwerb Kl. 1** (Anlaute, Buchstaben-Laut, Silben lesen, erste Sätze, Lesetexte mit Fragen) | Grundlage für alle Fächer; auch DaZ braucht es | NA-30, NA-31 |
| 1 | **DaZ-Basiswortschatz** (Schule, Alltag) mit Bild und Ton | Kinder ohne Deutsch können sonst nichts nutzen | NA-40 |
| 1 | **Mathe Kl. 1 eigenständig** (Mengen, ZR 10/20 mit Material) und **Vorschule Mengen** | breiter Einstieg, passt zu Vorschule | NA-32 |
| 2 | **Mathe Kl. 3** (ZR 1000, Einmaleins sicher, schriftliche Verfahren, Gewicht, Zeitspannen) | nächste Stufe für viele Nutzer | NA-33 |
| 2 | **Sachunterricht** je Perspektive mindestens 2 Themen Kl. 1–2 (Wasser, Verkehr/Schulweg, früher/heute, Bauen/Brücken, Regeln) | heute am dünnsten | NA-34 |
| 2 | **Schreiben** (Wörter tippen/nachspuren, kurze Sätze, Karten gestalten) | KMK-Kernbereich, fehlt ganz | NA-35 |
| 3 | Deutsch Kl. 3–4 (Zeitformen, Satzglieder, Texte überarbeiten) | spätere Stufen | NA-36 |
| 3 | Mathe Kl. 4 | spätere Stufe | NA-37 |
| 3 | Medienbildung „Produzieren“ und „Problemlösen“ (Bildergeschichte erstellen, Robo programmieren) | passt zu Pixel und Atelier | NA-38 |
| 3 | ~~Übergang 5 (Wiederholungspfad, Lernstrategien)~~ (27.10.: erster Stand) | wenige Kinder gleichzeitig | NA-39 |
| 3 | Vorschule als eigener Pfad (ohne Lesen, Spielzeug-Ecke) | eigener Aufwand | NA-41 |

---

## Inhalte als Daten (Festlegung)
Ziel: Jeder Inhalt ist einmal beschrieben und kann von allen Features genutzt, nach Land und Stufe gefiltert und in jede
Sprache übersetzt werden.

### Lernziel-IDs
- Form: `<fach>.<bereich>.<nr>` – z. B. `ma.zo.12` (Mathe, Zahl und Operation, Ziel 12), `de.le.03` (Deutsch, Lesen),
  `su.na.07` (Sachunterricht, naturwissenschaftlich), `ku.`, `mu.`, `sp.`, `et.`, `me.`, `daz.`.
- Datei `shared/lehrplan/kern.js`: alle Kern-Lernziele mit Titel (Sprachschlüssel), Bereich, **Kern-Stufe** und KMK-/GDSU-Bezug.
- Dateien `shared/lehrplan/laender/<land>.js`: je Land nur die Abweichungen: `stufe` (abweichende Stufe), `extra` (Zusatz-Ziele),
  `name` (Fachnamen), `quelle` (Fundstelle). Das bestehende `shared/lehrplan.js` wird zu `laender/sachsen.js` überführt;
  `window.LEHRPLAN` bleibt als Kompatibilitäts-Schicht, bis der Elternbereich umgestellt ist.

### Inhaltsdateien
```js
// inhalte/deutsch/lesen-anlaute.js (Beispiel, Format verbindlich)
Inhalte.registriere({
  id: "de.anlaute.1",
  fach: "deutsch", lz: ["de.le.01", "de.sp.02"],      // Lernziel-IDs
  stufe: ["vs", "1"],                                   // vs = Vorschule, 1–4, "5" = Übergang
  laender: null,                                        // null = alle; sonst ["sn", "by"]
  interessen: ["tiere"],                                // optional: Kulisse
  aufgaben: [
    { typ: "anlaut", wort: "w.affe", ziel: "A" }        // Wörter nur als Verweis auf den Wortschatz-Kern
  ],
  texte: { intro: { de: "Womit fängt das Wort an?", ru: "…", uk: "…" } },
  status: { ru: "geprueft", uk: "entwurf" }             // siehe SPRACHEN.md
});
```
- **Wortschatz-Kern** `inhalte/woerter/*.js`: jedes Wort einmal mit `id`, `de`, `artikel`, `mehrzahl`, `silben`, `bild`,
  `themen`, `stufe`, Übersetzungen und Ton-Schlüsseln. Deutsch, DaZ, Sachunterricht, Wort des Tages, Insel-Schilder und
  Minispiele lesen daraus (`shared/woerter.js` wird dorthin überführt).
- **Sprachschlüssel:** wie bisher `{ de, ru, uk, … }`; Felder wie `warumRu` bleiben lesbar, neue Inhalte nutzen nur Objekte.
- **Bundesland-Filter:** `Inhalte.fuer(kind)` liefert alle Inhalte, deren `stufe` (nach Länder-Abweichung) zur Stufe des Kindes
  passt und deren `laender` leer ist oder das Land enthält.
- **Abdeckung** wird nicht mehr von Hand gepflegt, sondern aus den registrierten Inhalten je Lernziel errechnet
  (`ja` ab 3 Inhalten mit zusammen ≥ 30 Aufgaben und Lernkartei, `teil` ab 1 Inhalt). Test: `tests/lehrplan.js` meldet Lernziele ohne Inhalt.
- Bestehende Inhalte (`aufgaben.js`, `geschichte.js`, `themen.js`, `lektionen.js`) bekommen zuerst nur `lz`-Verweise; umgebaut
  wird erst, wenn ein Inhalt ohnehin erweitert wird (nichts entfernen).

---

## Historie: Bauplan Klasse 2 (Stand 25.10.2026)
Erledigt: Daten und Zufall, Formen und Körper, Länge und Kalender, gerade/ungerade, Sachaufgaben, Verben/Adjektive,
Verlängern, Silben, Gesundheit, Bäume und Vögel. Offen aus diesem Bauplan (jetzt in der Lücken-Liste oben): Spiegelbilder,
Würfelgebäude, Quadratzahlen, Wortfamilien, zusammengesetzte Nomen, Umlaute, Großschreibung, Satzzeichen, Laute hören,
Buchstaben nachspuren, Lesetexte, Schreiben, Sprechen/Aufnehmen, Frühblüher, Keimen, Haustiere, unbelebte Natur, Raum und Zeit,
Regeln und Konflikte. Mathe Kl. 4 „Größen und Messen“ und „Daten und Zufall“ fehlen in `shared/lehrplan.js` noch.
