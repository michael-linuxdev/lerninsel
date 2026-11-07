# Emoji-Bilder der Lerninsel – Noto in Stil A (01.11.2026, Wahl des Auftraggebers)

Jedes Emoji der App wird beim Anzeigen durch ein Bild ersetzt (`shared/emoji.js`), damit es auf jedem Gerät gleich aussieht.
Die Bilder sind die **Noto-Emojis von Google (Apache 2.0)**, umgesetzt in **Stil A „Insel bunt“**. Selbst zeichnen ist verworfen (zu einfach bzw. zu aufwendig).

## Regeln (freigegeben: „Gut so, für alle“)
- Verläufe werden zu **zwei harten Farbstufen** (Lichtton = Farbe bei 25 %, Grundton = Farbe bei 70 %, Grenze bei 48 %), wie die Toon-Grafik der Insel.
  Durchsichtige Verläufe (Glanz, Schein, Schatten) bleiben weich.
- **Dünne Lerninsel-Kontur** `#3B1F63` außen herum (5,2 Einheiten im 128er-Raster). Sie entsteht ohne SVG-Filter: Die Formen werden zweimal mit `<use>`
  gezeichnet; die hintere Kopie wird über CSS-Variablen (`--k` Farbe, `--w` Breite, `--v` blendet Glanz und Schatten aus) zur dunklen Silhouette.
- **Keine rosa Wangen**: Noto-Wangen (Verläufe in `#ff4747`/`#ed7770`, die ins Durchsichtige auslaufen) werden entfernt.
- Zahlen in Pfaden auf eine Nachkommastelle gerundet (über absolute Koordinaten, damit sich nichts aufsummiert).

## Dateien
- `liste.json` – alle Emojis der App (nach Teilen). Neue Emojis hier eintragen.
- `quellen/noto/<hex>.svg` – Noto-Originale (eine Datei je Emoji), Lizenz `quellen/noto/LICENSE`.
- `quellen/noto-holen.py` – holt neue Originale aus den npm-Paketen `@iconify-json/noto` und `@svgmoji/noto` (Aufruf im Kopf der Datei).
- `quellen/noto-stil-a.py` – baut die Häppchen `shared/icons/<teil>-<n>.js` und `shared/icons-liste.js` (läuft in `quellen/dev-bauen.sh`); Sonderfälle in `AUSNAHMEN`.
- `quellen/icons-lesen.js` – liest die Häppchen in Node und packt sie aus (Prüfbogen, `tests/icons.js`).

## Häppchen und Kurzform (07.11.2026, Paket „icons.js verkleinern“)
- Statt einer großen `shared/icons.js` (2,7 MB) gibt es 24 Häppchen (6 Teile der Liste × 4). In welches Häppchen ein Emoji kommt, bestimmt eine Prüfsumme
  seines Hex-Schlüssels (`zlib.crc32`) – ein geändertes oder neues Emoji ändert genau ein Häppchen (Updates holen nur das).
- `shared/emoji.js` lädt nach dem ersten Bild nur die Häppchen, deren Emojis auf der Seite stehen, später nach Bedarf (`__emoji.brauche(e)`, alle: `__emoji.alle()`).
- Kurzform je Bild: nur der Inhalt der Form-Gruppe, id-Präfix als `~`, häufige Bausteine (`KURZ`, **feste Liste – nicht nach Häufigkeit neu berechnen**) als ein Zeichen;
  kurze ids (`0`, `1`, …), Verläufe mit zwei statt vier Stopps (gleiches Bild). `LernIconAuf(hex, kurz)` in `shared/icons-liste.js` packt aus; `tests/icons.js` prüft,
  dass das Ergebnis Zeichen für Zeichen dem SVG des Generators entspricht.
- Gemessen: roh 2,62 → 1,86 MB, gzip 746 → 690 KB (am Stück), Pixel-Vergleich aller 773 Bilder: höchstens 0,07 % der Bildpunkte deutlich anders (eine Flagge).
- `quellen/noto-pruefbogen.js` – Prüfbogen aller Bilder als PNG (64 px mit Original daneben, 24 px).

## Neues Emoji aufnehmen
1. In `liste.json` eintragen.
2. `npm pack @iconify-json/noto` und `npm pack @svgmoji/noto` in einen Ordner außerhalb des Repos, dann `python3 -I quellen/noto-holen.py …`.
3. `sh quellen/dev-bauen.sh`, Prüfbogen ansehen.

Würfel ⚀–⚅ und 🎲 zeichnet `shared/emoji.js` selbst (ein Stil-A-Würfel wie in Mathe). Emojis ohne Noto-Bild (©) und reine Textzeichen (→ ✓ ✗ ← ↑ ↓ ⌫ ⇧ ✕ ↰ ↱ ➜ ✦ ♚ ♛ ♜ ♝ ♞) bleiben System-Zeichen.
