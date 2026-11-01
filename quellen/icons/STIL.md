# Eigene Bilder statt Emojis – Stil A „Insel bunt“ (01.11.2026, Wahl des Auftraggebers)

Jedes Emoji der App bekommt ein eigenes, kleines SVG-Bild. Gemeinsamer Stil, damit alles aus einem Guss wirkt:

## Form
- `viewBox="0 0 64 64"` (das Bauskript setzt das `<svg>` drumherum – in den Teil-Dateien steht **nur der Inhalt**).
- Das Motiv füllt etwa 52–58 px der 64 px, mittig, mit etwas Luft am Rand.
- **Dunkle Kontur wie bei den Figuren:** jede Hauptform mit `stroke="#3B1F63" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`
  (kleine Details wie Augen, Glanz, Wangen ohne Kontur). Formen rund und freundlich.
- Feine Linien (Stiele, Schnurrhaare, Zeiger) ebenfalls in `#3B1F63`, 2,5–3 px.
- Wenige Formen (meist 3–10), gut erkennbar auch bei 24 px Größe. Keine Schrift im Bild (Ausnahme: Ziffern bei den Zahlen-Tasten, Buchstaben bei 🔤🔠 und Flaggen-Kennung).
- Höchstens etwa **1.500 Zeichen je Bild** (das Bauskript warnt darüber).

## Farbe und Licht
- **Flache, kräftige Farben** `#RRGGBB` (wie die Figuren in Variante A). Verläufe `G()`/`V()` nur ausnahmsweise (z. B. Himmel, Wasser).
- Ein kleiner Glanz auf runden Dingen: `<ellipse … fill="#fff" opacity=".35"/>` oben links.
- Farben freundlich und klar, nicht grell. Palette (Richtwerte): Rot `#E8574F`, Orange `#F59A3C`, Gelb `#FFC94A`, Grün `#5DBB63`, Türkis `#3FB6B2`,
  Blau `#4C8FE0`, Lila `#8B6FD6`, Rosa `#F28DB2`, Braun `#B07A4F`, Haut `#F6C9A0` (Hauttöne bei 🏻–🏿 nur, wenn das Emoji sie hat), Grau `#9AA3B5`,
  dunkle Details `#3D3A5C` (Augen, Pupillen).
- Gesichter (Smileys, Menschen): runde Köpfe, Augen als dunkle Ovale mit kleinem weißen Glanzpunkt. **Keine rosa Wangen** (Wunsch des Auftraggebers).
- Menschen: freundlich, neutral, kindgerecht; Kleidung einfach.

## Teil-Dateien
`quellen/icons/<teil>.js`:
```js
module.exports = {
  "🍎": `<path d="M32 18c…" fill="G(#E8574F)"/><path d="M33 17q4-8 10-8" stroke="#6B4A33" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="24" cy="28" rx="5" ry="7" fill="#fff" opacity=".35"/>`,
  …
};
```
- Schlüssel = das Emoji genau wie in `liste.json` (mit oder ohne `️`, das Skript gleicht ab).
- **Keine eigenen `id`-Attribute** und keine `<defs>` (nur `G()`/`V()` benutzen), kein `<text>` außer bei Ziffern/Buchstaben (dann `font-family="Fredoka, sans-serif"`, `font-weight="700"`).

## Bauen und prüfen
- `node quellen/icons-bauen.js` → `shared/icons.js` (alle Bilder) und `quellen/icons/bogen.html` (Prüfbogen mit allen Bildern in 64 und 24 px).
- `node quellen/icons-bauen.js --teil <teil>` baut nur den Prüfbogen eines Teils (`quellen/icons/bogen-<teil>.html`).
- Prüfbogen als Bild: `node quellen/icons-bogen-bild.js <teil> <ausgabe.png>` (Playwright).
