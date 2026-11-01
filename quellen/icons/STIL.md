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
- `quellen/noto-stil-a.py` – baut `shared/icons.js` (läuft in `quellen/dev-bauen.sh`); Sonderfälle in `AUSNAHMEN`.
- `quellen/noto-pruefbogen.js` – Prüfbogen aller Bilder als PNG (64 px mit Original daneben, 24 px).

## Neues Emoji aufnehmen
1. In `liste.json` eintragen.
2. `npm pack @iconify-json/noto` und `npm pack @svgmoji/noto` in einen Ordner außerhalb des Repos, dann `python3 -I quellen/noto-holen.py …`.
3. `sh quellen/dev-bauen.sh`, Prüfbogen ansehen.

Emojis ohne Noto-Bild (Würfel ⚀–⚅, ©) und reine Textzeichen (→ ✓ ✗ ← ↑ ↓ ⌫ ⇧ ✕ ↰ ↱ ➜ ✦ ♚ ♛ ♜ ♝ ♞) bleiben System-Zeichen.
