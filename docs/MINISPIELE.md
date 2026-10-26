# Minispiele: Katalog und Qualitätskriterien

> Neu am 26.10.2026. Regel bleibt: **Erst lernen, dann spielen.** Minispiele brauchen Spielzeit (Ausnahme: Spiele, die selbst
> Lernen sind, z. B. Schach-Lektionen, Musik-Ecke). Jedes Minispiel hat einen Lern- **oder** Story-Bezug.

## 1. Qualitätskriterien: motivierend, ohne süchtig zu machen
**Ja:**
- Kurze Runden (60–180 s) mit klarem Ende; danach ein natürlicher Schluss („Das Tier ist müde“), kein „Noch eine Runde?“-Druck.
- Ziele gegen sich selbst (eigene Bestzeit, eigenes Bauwerk), nie gegen andere Kinder.
- Können statt Glück: Fortschritt kommt durch Üben, nicht durch Zufall.
- Vielfalt: jede Vorliebe hat mindestens zwei Spiele.
- Kreative Spiele ohne Gewinnen/Verlieren (Bauen, Musik, Malen, Garten).
- Sterne nur für **neu erreichte** Ziele (bestehende Regel `sterneFuer` in `quellen/welt3d/gemeinsam.js`).
- Gleiche Steuerung überall (Joystick links, Aktionsknopf rechts), große Ziele, auch mit einer Hand spielbar.

**Nein:**
- Keine Lootboxen, keine Zufallsbelohnung gegen Sterne, keine Glücksräder mit Preisen.
- Keine Serien-Belohnungen („5 Tage in Folge“), keine verfallenden Belohnungen, keine Countdown-Angebote.
- Keine Ranglisten zwischen Kindern; Duelle nur zu zweit am selben Tablet und freiwillig.
- Keine endlosen Modi ohne Rundenende; kein automatischer Start der nächsten Runde.
- Keine Strafe fürs Aufhören; Spielzeit-Ende speichert immer.

**Prüffragen vor dem Bau:** Was lernt oder erlebt das Kind? Wann hört es von selbst auf? Funktioniert es ohne Lesen?
Läuft es im Leistungsbudget (`GRAFIK.md`)? Gibt es eine Fassung für Fokus-Hilfen (langsamer, weniger Effekte)?

## 2. Freischaltung
- Über den Wissensbaum (bestehend: `SPIELE` in `gemeinsam.js` – Sternenlauf ab Stufe 1, Kart ab 2, Bauplatz ab 3) und über Story-Kapitel
  (`KONZEPT.md`). Gesperrte Orte stehen mit Schloss in der Welt und sagen, wie viele Lernfunde fehlen (bestehend).
- Ein Spiel öffnet sich nie durch Sterne-Ausgeben.

## 3. Katalog
Aufwand: S ≈ 1 Sitzung, M ≈ 2–3, L ≈ 4+ (eine Sitzung ≈ ein Arbeitstag mit Tests).

### Vorhanden
| Spiel | Vorliebe | Lernbezug | Story-Bezug | Freischaltung | Datei | Verbessern |
|---|---|---|---|---|---|---|
| Ballon-Party | Geschick | Reaktion; Variante: Ballons mit Zahlen/Wörtern antippen | Paulas Fest | Ballon-Wiese | `quellen/welt3d/ballons.js` | Lern-Variante (S) |
| Insel-Abenteuer (Schatz-Strand) | Entdecken | – | Fipsis Karte | Schatz-Strand | `insel.js` | Schatzrätsel mit Lesehinweisen (M) |
| Sternenlauf | Bewegung/Rennen | nach dem Lauf ein Wort aus der Lernkartei (freiwillig) | Kapitel 1 | Baum Stufe 1 | `lauf.js` | Wort-Tore (S) |
| Kart-Rennen | Fahrzeuge | Streckenlänge schätzen (Größen) | Benno, Fipsi fahren mit | Baum Stufe 2 | `kart.js` | Strecke passend zur Landschaft (M, offen) |
| Bauplatz | Bauen | Zählen, Mengen, Formen (Benno) | **Bennos Brücke** (Kapitel 3) | Baum Stufe 3 | `bau.js` | Bauwerk in der Welt aufstellen (M, offen) |
| Insel-Bühne | Musik | eigene Melodie | Paulas Fest | Bühne | `heimat.js` | Tanzschritte nachmachen (S) |
| Schach mit Tilda | Rätsel/Denken | Vorausdenken | Leuchtturm (Kap. 6) | immer (Lernen) | `spiele/schach/` | Bauern-Rennen für Jüngere (S) |
| Atelier Malen/Musik | Kreativ | Kunst, Musik | Paulas Fest | immer (Lernen) | `spiele/atelier/` | – |

### Neu (priorisiert)
| Prio | Spiel | Vorliebe | Kurzbeschreibung | Lernbezug | Story-Bezug | Freischaltung | Aufwand |
|---|---|---|---|---|---|---|---|
| 1 | **Insel-Garten** | Tiere/Natur, ruhig | Samen pflanzen, gießen, ernten; wächst über echte Tage | Keimen und Wachsen, Jahreszeiten (Sachunterricht) | Ella | Kapitel 1 | M |
| 1 | **Tierpflege-Station** | Tiere | verletzte Tiere der Insel (Igel, Vogel) versorgen und auswildern | Tiere und Lebensräume | Bruni | Kapitel 2 | M |
| 1 | **Bäckerei Benno** | Rätsel/Alltag | Bestellungen backen, mit Münzen bezahlen und Wechselgeld geben | Geld, Plus/Minus, Lesen von Bestellungen | Fest-Vorbereitung | Kapitel 3 | M |
| 2 | **Murmelbahn** | Bauen/Physik | Teile setzen, Murmel ins Ziel bringen | Raum und Form, Technik | Benno | Baum Stufe 4 | M |
| 2 | **Rhythmus-Boot** | Musik/Bewegung | im Takt paddeln (tippen), Fluss hinunter | Rhythmus (Musik) | Paula | Kapitel 4 | M |
| 2 | **Höhlen-Entdecker** | Entdecken | mit Lampe durch die Höhle, Fossilien und Kristalle finden | früher/heute, Steine (Sachunterricht) | Schatzkammer | Kapitel 6 | L |
| 2 | **Wörter-Angeln** | Ruhig/Geschick | Fische mit Bildern angeln und dem richtigen Artikel-Eimer geben | Artikel, DaZ-Wortschatz | Fipsi | Kapitel 2 | S |
| 2 | **Wetter-Drache** | Geschick | Drachen steigen lassen, Wind echt (aus Wetterdaten) | Luft und Wind | Sturm (Kap. 5) | Kapitel 5 | S |
| 3 | **Roboter-Weg** | Rätsel/Logik | Pixel mit Pfeilen programmieren (Befehlsfolge) | Medienbildung „Problemlösen“, Raum | Pixel | Kapitel 2 | M |
| 3 | **Tauch-Bucht** | Entdecken/Tiere | schnorcheln, Meerestiere ins Bestimmungsbuch | Tiere, Lesen | Leuchtturm | Kapitel 6 | L |
| 3 | **Fahrrad-Parcours** | Rennen/Bewegung | Verkehrsschilder beachten, Helm zuerst | Verkehrserziehung | Pixel | Kapitel 3 | M |
| 3 | **Muster-Mosaik** | Kreativ/Rätsel | Muster fortsetzen und eigene legen, wird Fußboden im Zimmer | Muster und Strukturen | Paula | Baum Stufe 4 | S |
| 3 | **Tier-Versteck** (Vorschule) | Entdecken | Tiere hinter Dingen finden, zählen | Mengen bis 10, Lage (oben/unter) | – | Vorschul-Pfad | S |
| 3 | **Insel-Zoo** | Tiere/Bauen | Gehege für gerettete Tiere einrichten | Tierbedürfnisse | Tierpflege | nach Tierpflege | L |

Abdeckung der Vorlieben: Bewegung/Geschick (Ballons, Sternenlauf, Wetter-Drache, Rhythmus-Boot), Bauen (Bauplatz, Murmelbahn,
Insel-Zoo, Mosaik), Rätsel (Schach, Bäckerei, Roboter-Weg), Musik (Bühne, Rhythmus-Boot), Tiere (Garten, Tierpflege, Wörter-Angeln,
Tauch-Bucht, Zoo), Rennen (Kart, Fahrrad, Sternenlauf), Entdecken (Schatz-Strand, Höhle, Tauch-Bucht, Tier-Versteck).

## 4. Technik
- Alle 3D-Minispiele nutzen `figur3d.js` (eine Kind-Figur) und `gemeinsam.js` (Steuerung, `SPIELE`, `sterneFuer`, Spielzeit).
- Neue Spiele bekommen einen Test-Haken `window.__<name>` und kommen in `tests/rauchtest.js` (`SEITEN_3D`).
- Lerninhalte holen sie aus dem Wortschatz-Kern und den Lernzielen (`LEHRPLAN.md`), nie aus eigenen Listen.
