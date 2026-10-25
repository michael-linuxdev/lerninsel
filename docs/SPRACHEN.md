# Hilfesprachen (Muttersprache)

Die App ist auf Deutsch – das Kind lernt Deutsch. Zu jedem Text kann es Hilfe in seiner Muttersprache bekommen
(Knopf mit Sprachkürzel, z. B. „RU“: zeigt den Text und liest ihn vor). Die Eltern wählen die Hilfesprache bei der Ersteinrichtung.

## Konvention in den Inhaltsdateien
Hilfetexte stehen als eigene Felder neben dem deutschen Text, benannt nach dem Sprachcode:

| Deutsches Feld | Russisch | Ukrainisch | Arabisch |
|---|---|---|---|
| `text` / `frage` / `t` | `ru` | `uk` | `ar` |
| `warum` | `warumRu` | `warumUk` | `warumAr` |
| `satz` | `satzRu` | `satzUk` | `satzAr` |
| `nachricht`, `links`, `rechts`, `wer` | `…Ru` | `…Uk` | `…Ar` |

Feste Textpaare in den Spielabläufen: `{ de: "…", ru: "…", uk: "…" }` (ältere Form `["deutsch", "russisch"]` geht weiter).

## Im Code
- `S.hilfe()` → gewählte Sprache `{ code, name, eigen, kurz, tts, rtl }` oder `null`
- `S.ht(obj)` → Hilfetext zum Hauptfeld, `S.ht(obj, "warum")` → Hilfetext zu `warum`
- `S.paar(x)` → `[deutsch, hilfe]` für feste Textpaare

## Eine neue Sprache hinzufügen
1. In allen Inhaltsdateien die Felder ergänzen (`spiele/*/geschichte.js`, `lektionen.js`, `themen.js`, `shared/woerter.js`, Texte in `quellen/welt3d/heimat.js`).
2. Übersetzungen von Muttersprachlern prüfen lassen (kindgerecht!).
3. In `shared/core.js` bei der Sprache `fertig: true` setzen. Erst dann ist sie im Elternbereich wählbar.
4. Rauchtest laufen lassen; bei Arabisch/Farsi die Darstellung von rechts nach links prüfen.

Noch offen: Elternbereich selbst in der Sprache der Eltern (Phase 5).
