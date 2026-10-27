# Grafik-Konzept

> Neu am 26.10.2026. Entscheidung des Auftraggebers: **Der Stil darf sich grundlegend ändern.** Stil B (rund, Toon, Konturen)
> ist nicht mehr gesetzt, sondern einer von drei Kandidaten. Gewählt wird anhand von Probeszenen auf dem iPad 10.

## 1. Ausgangslage
- 2D-Figuren: handgeschriebene SVGs in `shared/figuren.js` (Fipsi, Robo, Eule, Biber, Bär, Papagei), Kind-Figur in
  `spiele/anziehen/figur.js` + `teile.js`, Tiere in `shared/tiere.js`, Sachunterricht-Bilder in `spiele/sachkunde/bilder.js`.
- 3D: alles im Code aus Grundkörpern (Kugel, Kapsel) mit `MeshToonMaterial` und Umriss über die Rückseite („inverted hull“,
  `teil()` in `quellen/welt3d/heimat.js`); Figuren `figur()`, `eule()`, `fipsi()`, `robo()`, `biber()`, `baer()`, Tilda und Paula
  direkt in `heimat.js`; eine zweite Kind-Figur in `quellen/welt3d/figur3d.js` (doppelt – zusammenführen).
- Stil wirkt wie ein Prototyp: Proportionen und Augen je Figur verschieden, 2D und 3D sehen sich wenig ähnlich, kaum Animationen
  außer Hüpfen, UI aus Standard-Knöpfen mit Emoji.
- Leistung: feste Deko wird verschmolzen (Zeichenaufrufe gemessen: Wald riesig 906 → 230, erste Insel 499 → 339),
  automatischer Sparmodus unter 30 Bildern/s, Pixeldichte höchstens 1,5, Schatten 1024² nur in „schön“.

## 2. Weg zum neuen Stil
> **Stand 27.10.2026 (nachts):** Der Auftraggeber hat die Auswahl auf zwei Looks eingegrenzt – **„Rund“ wie Animal Crossing**
> (heutiger Stil B mit three.js) oder **„Pixel“** (Draufsicht aus 16×16-Kacheln, PixiJS, Probe `spiele/probe/`). Andere Engines sind erlaubt,
> Smartphones zählen mit. Die Varianten B+, C und D unten sind damit Historie. Kinder wählen den Stil nicht selbst (doppelter Zeichenaufwand);
> sie stimmen beim Vergleich mit ab.

1. **Drei Probeszenen** (Erweiterung von `spiele/welt3d/probe.html`, gleiche Szene: Kind, Fipsi, Baum, Haus, Wasser, Wiese):
   - **B+ „Toon verbessert“:** wie heute, aber einheitliche Proportionen, weichere Konturen, Farbverlauf-Licht (Gradient-Map), Randlicht.
   - **C „Bilderbuch“:** keine Konturen, flache Flächen mit gemalten Verläufen in Scheitelfarben, warmes Streulicht, Papier-Körnung im Himmel.
   - **D „Knete“:** runde, leicht unregelmäßige Formen, weiches Licht, matte Oberflächen, kurze Stop-Motion-artige Animationen.
2. Jede Probe misst und zeigt: Bilder/s, Zeichenaufrufe, Dreiecke, Texturspeicher (`renderer.info`).
3. **Entscheidung** durch Auftraggeber und 2–3 Kinder (auch Jungen) auf dem iPad 10. Bis dahin werden keine Figuren neu gebaut.
4. Danach gilt dieser Leitfaden mit den Werten des gewählten Stils; Abschnitt 3 ist so geschrieben, dass er für alle drei passt.

## 3. Stil-Leitfaden (verbindlich nach der Wahl)
### Formen
- **Grundform je Figur** (Silhouette erkennbar als schwarzer Schatten): Fipsi = Dreieck (Ohren, Schwanz), Ella = Ei/Kreis,
  Benno = Birne/Rechteck (Zähne, Kelle), Bruni = großer Kreis, Paula = Tropfen, Tilda = Halbkugel, Pixel = abgerundetes Quadrat,
  Kind = Kreis (Kopf) + Kapsel.
- Keine spitzen Ecken in der Welt (Radius ≥ 10 % der Kantenlänge), nur Felsen und Kristalle dürfen kantig sein.
- Freundliche Übertreibung: große Köpfe sind **nicht** gewünscht (frühere Entscheidung), Kopf : Körper etwa 1 : 1,6 bei Tieren,
  1 : 2 beim Kind.

### Farben
- **Fachfarben** bleiben die gemeinsame Sprache (Lernfund-Früchte, Kacheln, Figuren-Akzente); Werte aus `shared/lernfunde.js`
  übernehmen und in `shared/style.css` als Variablen festlegen (`--fach-mathe` …).
- Welt: gesättigte, aber nicht grelle Grundtöne (Wiese, Wasser, Sand) mit warmem Licht; Figuren heben sich durch höhere Sättigung ab.
- Kontrast: Text/Hintergrund mindestens 4,5 : 1; nie Bedeutung nur über Farbe (Artikel-Farben bekommen auch Formen).
- Ruhige Darstellung (Fokus-Hilfen): Sättigung −30 %, keine Partikel, keine Kamera-Wackler.

### Licht und Konturen
- Eine Sonne + Himmelslicht, Tag/Nacht wie heute; nachts warmes Licht aus Fenstern und Wissensbaum.
- Konturen (nur Stil B+): dunkle Farbe der Figur statt Schwarz, Dicke abhängig vom Abstand, in „einfach“ ohne Konturen.

### Animationen (Mindestumfang pro Figur)
Stehen (Atmen), Laufen, Freuen (Hüpfen), Nachdenken, Winken, Sprechen (Mund/Schnabel), Schlafen.
Prozedural im Code (Sinus, Stauchen/Strecken) für die Welt; Figuren mit Gelenken (Kopf, Arme, Schwanz) als Hierarchie, kein
Skelett nötig. Gesichtsausdrücke über austauschbare Augen-/Mund-Texturen (eine kleine Textur pro Figur).

### UI
- Knöpfe als eigene Formen in Fachfarbe statt Emoji-Knöpfe; Emoji nur ergänzend.
- Sprechblasen mit Figurenkopf links, Ton-Knopf 🔊 und Hilfe-Knopf (Sprachkürzel) immer an derselben Stelle.
- Zeigehand und Leuchten fürs Tutorial als eigene Bausteine (`shared/zeige.js`).
- Mindestgröße Tippziel 48 × 48 px, Abstand 8 px.

## 4. Figuren-Steckbriefe
| Figur | Rolle | Persönlichkeit | Silhouette / Merkmal | Farbe | Heute | Redesign-Ziel |
|---|---|---|---|---|---|---|
| Robo Pixel | Medienbildung, Fährmann | hilfsbereit, ein bisschen tollpatschig, piept | abgerundetes Quadrat, Antenne mit Lämpchen, Bildschirm-Gesicht | Blau/Silber | 2D gut, 3D einfach (`robo()`), wohnt vorerst nicht auf der Insel | Boot als Fortbewegung, Bildschirm zeigt Gefühle |
| Eule Ella | Sachunterricht, Hüterin des Baums | ruhig, neugierig, weise | Ei-Form, große runde Augen, Brille | Grün/Braun | 2D und 3D | Flügelgesten beim Erklären |
| Fuchs Fipsi | Deutsch, DaZ | quirlig, lustig, vergesslich | spitze Ohren, buschiger Schwanz | Orange/Creme | 2D gut (`figuren.js`), 3D | Schatzkarte als Requisit, Merkkiste |
| Biber Benno | Mathematik | gründlich, zählt alles, Baumeister | breiter Körper, Zähne, gelber Helm, Kelle | Braun/Gelb | 2D und 3D | Werkzeuggürtel, Bauanimation |
| Bärin Bruni | Gefühle, Miteinander, Bewegung | warm, beschützend, macht Sport | großer runder Körper, Herz-Laterne | Honig/Rosa | 2D und 3D | Atem-Animation (Bauch hebt sich) |
| Papagei Paula | Kunst, Musik | fröhlich, laut, kreativ | Tropfenform, Federkrone, Farbklecks-Flügel | Rot/Gelb/Blau | 2D, 3D auf der Bühne | Tanz, Pinsel im Schnabel |
| Schildkröte Tilda | Denken, Schach | langsam, klug, geduldig | Halbkugel-Panzer mit Schachmuster | Türkis | 3D am Schachtisch, 2D fehlt | 2D-Fassung, Laterne für den Leuchtturm |
| Kind-Figur | Hauptfigur | – | wie im Kleiderschrank | frei | 2D (`figur.js`) und zweimal 3D (`heimat.js`, `figur3d.js`) | **eine** Figur aus Kleiderschrank-Daten für 2D und 3D, Jungen- und Mädchen-Körper, Hautfarben |
| Tiere (Drache, Fuchs, Kätzchen; je 3 Farben, 3 Stufen) | Begleiter | je eigene Art zu laufen | Baby rund, Groß gestreckt | 3 Farben | 2D (`tiere.js`), 3D `tierModell()` | Freude, Schlafen, Fressen als Animation; später Hund, Hase, Pinguin |
| Englisch-Figur (Pinguin), Vorschul-Figur | später | | | | – | erst mit Inhalten |

**Urheberrecht:** keine fremden Figuren, keine Ähnlichkeit zu bekannten Marken-Figuren (Prüfung bei jedem Entwurf). Nur eigene
Modelle oder CC0-Pakete (z. B. Kenney, Quaternius) für Umgebung; jede fremde Datei in `docs/LIZENZEN.md` (neu) mit Lizenz.

## 5. Insel und Welten
- Gelände aus `welt.js` bleibt (Seed + Wünsche); neu: Nebelrand für die Story (Kapitel öffnen Bereiche), Brücke/Nachbar-Eiland (Kapitel 3/7).
- Je Landschaft (Wiese, Wald, Berge, Strand, Schnee, Wüste) ein abgestimmtes Farbset und 3–5 eigene Deko-Teile.
- Innenräume: Zimmer, Atelier, Schatzkammer-Höhle, Leuchtturm – jeweils eigene Szene, lädt erst beim Betreten.

## 6. Leistungsbudget iPad 10 (Ziel: flüssig in „schön“, sicher in „einfach“)
| Größe | „schön“ | „einfach“ | Messung |
|---|---|---|---|
| Bilder pro Sekunde | ≥ 30 stabil (Ziel 60 in Innenräumen) | ≥ 30 | Sparmodus-Messung (bestehend) |
| Zeichenaufrufe je Bild | ≤ 150 | ≤ 80 | `renderer.info.render.calls` |
| Dreiecke sichtbar | ≤ 150.000 | ≤ 60.000 | `renderer.info.render.triangles` |
| Dreiecke je Figur (inkl. Kontur) | ≤ 4.000 | ≤ 1.500 | Test-Skript |
| Texturspeicher | ≤ 24 MB | ≤ 12 MB | Summe der Texturen |
| Texturgröße | ≤ 1024² (Atlas) | ≤ 512² | – |
| Schatten | 1 Sonne, 1024², nur nah | aus | – |
| Pixeldichte | ≤ 1,5 | 1 | bestehend |
| Download 3D gesamt | ≤ 15 MB | gleich | Build-Ausgabe |

Regeln: feste Deko verschmelzen (bestehend), gleiche Objekte als `InstancedMesh`, Materialien teilen, unsichtbare Szenen
nicht rendern, Animationen außerhalb der Kamera pausieren.

## 7. Vorgehen beim Neubau
1. Probeszenen B+/C/D (Paket NA-20), Messwerte in die Probe einblenden.
2. Entscheidung (Auftraggeber + Kinder).
3. **Reihenfolge:** Kind-Figur (eine gemeinsame für 2D/3D, Kleiderschrank-Datenmodell) → Fipsi → Ella → Benno → Pixel (Story-Start!) →
   Bruni → Paula → Tilda → Tiere → Welt-Deko → UI.
4. Jede Figur: 2D-SVG und 3D aus **einer** Beschreibung (Farben, Proportionen in `shared/figuren-daten.js`, neu).
5. Werkzeuge im Repo: `probe.html` (Vergleich), `?stunde=`, `?monat=`, `?wetter=` (Licht), `tests/leistung.js` (neu: lädt jede 3D-Szene
   und schreibt Zeichenaufrufe/Dreiecke in eine Tabelle; Bilder/s unter Swiftshader sind nicht aussagekräftig, Zählwerte schon).
6. Später möglich: Modelle in Blender (per Skript, Ausgabe glTF + meshopt) – nur wenn prozedurale Figuren nicht reichen;
   dann `GLTFLoader` und Budget oben prüfen.
