// Node-Test (Schritt B, NA-39): alle Mathe-Generatoren (Kl. 1–4 und Übergang 5) liefern 400-mal gültige Aufgaben – kein NaN/undefined,
// Zahl-Antworten nur aus Ziffern und mit der erlaubten Länge (`max`, Standard 3), Wahl-Antworten unter den Optionen, keine doppelten Optionen.
// Dazu römische Zahlen und Primzahlen. Aufruf: node tests/mathe-generatoren.js
const assert = require("assert");
global.window = {};
require("../spiele/mathe/aufgaben.js");
const M = window.Mathe;
let n = 0;
const pruefe = (name, fn) => { fn(); n++; console.log("  ✓ " + name); };

for (const [weg, liste, anzahl] of [["Kl. 1", M.STATIONEN_K1, 22], ["Kl. 2", M.STATIONEN, 45], ["Kl. 3", M.STATIONEN_K3, 35], ["Kl. 4", M.STATIONEN_K4, 26], ["Übergang 5", M.STATIONEN_K5, 16]]) {
  pruefe(`${weg}: ${anzahl} Stationen, je 400 gültige Aufgaben`, () => {
    assert.strictEqual(liste.length, anzahl);
    for (const s of liste) {
      assert.ok(s.lz && s.lz.length && s.name && s.icon, s.id + ": lz/name/icon");
      for (let i = 0; i < 400; i++) {
        const a = s.neu(), ohneBild = JSON.stringify(Object.assign({}, a, { bild: "" }));
        assert.ok(!/NaN|undefined|Infinity/.test(ohneBild) && !/NaN/.test(a.bild || ""), `${s.id}: ${ohneBild.slice(0, 160)}`);
        if (a.art === "zahl") assert.ok(/^\d+$/.test(a.antwort) && a.antwort.length <= (a.max || 3), `${s.id}: Antwort ${a.antwort} passt nicht in ${a.max || 3} Ziffern`);
        else { assert.ok(a.optionen.includes(a.antwort), `${s.id}: ${a.antwort} nicht in ${a.optionen}`); assert.strictEqual(new Set(a.optionen).size, a.optionen.length, s.id + ": doppelte Option"); }
      }
    }
  });
}
pruefe("Römische Zahlen bis 100", () => {
  const t = { 1: "I", 4: "IV", 9: "IX", 14: "XIV", 40: "XL", 49: "XLIX", 58: "LVIII", 90: "XC", 99: "XCIX", 100: "C" };
  for (const k in t) assert.strictEqual(M._k3.roemisch(+k), t[k]);
});
pruefe("Primzahlen bis 50", () => {
  assert.deepStrictEqual(Array.from({ length: 50 }, (_, i) => i + 1).filter(M._k3.istPrim), [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]);
});
pruefe("Würfelgebäude: Türme werden nach vorn und rechts nie höher (alle sichtbar)", () => {
  for (let i = 0; i < 300; i++) { const h = M._k3.wuerfelGebaeude();
    h.forEach((z, y) => z.forEach((v, x) => { assert.ok(v >= 1 && v <= 3); if (y) assert.ok(v <= h[y - 1][x]); if (x) assert.ok(v <= z[x - 1]); })); }
});
pruefe("Kl. 2: jede Station hat einen Lernbereich (lb), die 17 neuen hängen am Ende", () => {
  assert.ok(M.STATIONEN.every(s => ["zo", "rf", "gm", "dz"].includes(s.lb)), "lb fehlt");
  assert.deepStrictEqual(M.STATIONEN.slice(0, 3).map(s => s.id), ["plus20", "minus20", "zehner"]);
  assert.strictEqual(M.STATIONEN[23].id, "zahlen100");
});
pruefe("Kl. 1, 3, 4 und Übergang 5: jede Station hat einen Lernbereich, neue hängen am Ende und sind als Zusatz markiert (Urkunde zählt nur die alten)", () => {
  [[M.STATIONEN_K1, 10], [M.STATIONEN_K3, 20], [M.STATIONEN_K4, 15], [M.STATIONEN_K5, 10]].forEach(([l, alt]) => { assert.ok(l.every(s => ["zo", "rf", "gm", "dz"].includes(s.lb)));
    assert.ok(l.slice(0, alt).every(s => !s.zusatz) && l.slice(alt).every(s => s.zusatz)); });
});
pruefe("Jede Runde hat 10 verschiedene Aufgaben; keine Funktion in aufgaben.js ist doppelt benannt (eine zweite überschreibt die erste still)", () => {
  [].concat(M.STATIONEN, M.STATIONEN_K1, M.STATIONEN_K3, M.STATIONEN_K4, M.STATIONEN_K5).forEach(s => assert.strictEqual(M.runde(s.id, 10).length, 10, s.id + ": zu wenig Vielfalt"));
  const namen = (require("fs").readFileSync(require("path").join(__dirname, "..", "spiele/mathe/aufgaben.js"), "utf8").match(/^  function (\w+)/gm) || []);
  assert.deepStrictEqual(namen.filter((n, i) => namen.indexOf(n) !== i), []);
});
console.log(`✅ Mathe-Generatoren: ${n} Prüfungen bestanden.`);
