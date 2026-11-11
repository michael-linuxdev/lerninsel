// Inhaltsprüfung 10.11.2026: sichert die behobenen Fehler aus der vollständigen Durchsicht der Lerninhalte ab
// (falsche/mehrdeutige Lösungen, kaputte Satzbausteine, verlorene Daten). Je Bereich ein Modul in tests/inhaltsfehler/.
//   node tests/inhaltsfehler.js
const path = require("path");
const wurzel = path.join(__dirname, "..");
const TEILE = ["mathe-stationen", "mathe-erklaeren", "deutsch", "sachunterricht", "faecher", "sprachen-orte", "nachlese"];
let n = 0;
for (const t of TEILE) {
  try {
    const k = require("./inhaltsfehler/" + t + ".js")(wurzel) || 0;
    console.log(`  ✓ ${t}: ${k} Prüfungen`);
    n += k;
  } catch (e) {
    console.error(`  ✗ ${t}: ${e.message}`);
    process.exit(1);
  }
}
console.log(`✅ Inhaltsfehler: ${n} Prüfungen bestanden.`);
