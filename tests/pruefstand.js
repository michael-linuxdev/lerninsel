// Node-Test Prüfstand (02.11.2026): quellen/pruefstand.json ist gültig (Stufe 0–3, Prüfer-Kürzel, Datum, Prüfsumme),
// jeder Vermerk gehört zu einem vorhandenen Inhalt, ein geänderter Inhalt macht den Vermerk unwirksam. Aufruf: node tests/pruefstand.js
const assert = require("assert");
const P = require("../quellen/pruefstand.js");
let n = 0;
const pruefe = (name, fn) => { fn(); n++; console.log("  ✓ " + name); };
const B = P.bereiche(), v = P.vermerke();
pruefe("alle Bereiche werden gefunden, IDs je Bereich eindeutig", () => {
  for (const [k, b] of Object.entries(B)) { assert.ok(b.liste.length > 0, k); const ids = b.liste.map(x => x.id); assert.strictEqual(new Set(ids).size, ids.length, "doppelte ID in " + k); }
});
pruefe("Vermerke gültig und keiner verwaist", () => {
  for (const [k, e] of Object.entries(v)) {
    const [bereich, ...rest] = k.split(":"); assert.ok(B[bereich] && B[bereich].liste.some(x => x.id === rest.join(":")), "verwaist: " + k);
    assert.ok([1, 2, 3].includes(e.stufe) && e.pruefer && /^\d{4}-\d{2}-\d{2}$/.test(e.am) && /^[0-9a-f]{12}$/.test(e.hash), "ungültig: " + k);
  }
});
pruefe("geänderter Inhalt: Vermerk wird unwirksam", () => {
  const x = { id: "probe", text: "A" }, vv = { "x:probe": { stufe: 2, pruefer: "T", am: "2026-11-02", hash: P.hash(x) } };
  assert.strictEqual(P.stufe(vv, "x:probe", x).s, 2);
  assert.strictEqual(P.stufe(vv, "x:probe", Object.assign({}, x, { text: "B" })).s, 0);
});
console.log(`✅ Prüfstand: ${n} Prüfungen bestanden.`);
