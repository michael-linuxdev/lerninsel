// Node-Test (NA-01): Migration alter Spielstände auf den Story-Zustand.
// Aufruf: node tests/story-migration.js
const assert = require("assert");
const { bereinige, migriere, MAX_OFFEN } = require("../shared/ereignisse.js");

let n = 0;
const pruefe = (name, fn) => { fn(); n++; console.log("  ✓ " + name); };

pruefe("alter Spielstand ohne story bekommt Kapitel 0", () => {
  const daten = { lernfunde: { tage: {} }, eltern: { eingerichtet: true } };
  migriere(daten);
  assert.deepStrictEqual(daten.story, { kapitel: 0, etappen: {}, gesehen: [], chronik: [], offen: [], geschenke: [] });
  assert.ok(daten.lernfunde && daten.eltern, "andere Daten bleiben erhalten");
});

pruefe("gültiger Zustand bleibt unverändert", () => {
  const st = { kapitel: 2, etappen: { E1: "2026-10-26", E2: 1 }, gesehen: ["prolog"], chronik: [{ s: "prolog", d: "2026-10-26" }], offen: [{ a: "bild", d: { id: "b1" }, z: 5 }], geschenke: ["weihnachten-2026"] };
  assert.deepStrictEqual(bereinige(JSON.parse(JSON.stringify(st))), st);
});

pruefe("kaputte Werte werden bereinigt", () => {
  const st = bereinige({ kapitel: -3, etappen: { E1: true, X9: true, E2: "gestern" }, gesehen: ["a", "a", 5, ""], chronik: [{ s: "a", d: "kaputt" }, "x"], offen: [{ a: "unbekannt" }, { a: "fund" }] });
  assert.strictEqual(st.kapitel, 0);
  assert.deepStrictEqual(st.etappen, { E1: 1, E2: 1 });
  assert.deepStrictEqual(st.gesehen, ["a"]);
  assert.deepStrictEqual(st.chronik, [{ s: "a", d: "" }]);
  assert.deepStrictEqual(st.offen, [{ a: "fund", d: {}, z: 0 }]);
});

pruefe("Unsinn statt Objekt ergibt leeren Zustand", () => {
  for (const x of [null, 3, "story", [1, 2]]) assert.strictEqual(bereinige(x).kapitel, 0);
  assert.strictEqual(bereinige({ kapitel: 999 }).kapitel, 20);
});

pruefe("höchstens 20 vorgemerkte Ereignisse, die neuesten bleiben", () => {
  const offen = Array.from({ length: 30 }, (_, i) => ({ a: "fund", d: { i }, z: i }));
  const st = bereinige({ offen });
  assert.strictEqual(st.offen.length, MAX_OFFEN);
  assert.strictEqual(st.offen[0].d.i, 10);
});

pruefe("leerer Story-Zustand ist klein (QR-Transfer)", () => {
  const groesse = JSON.stringify(bereinige({})).length;
  assert.ok(groesse <= 96, `story leer: ${groesse} Zeichen`);
});

console.log(`✅ Story-Migration: ${n} Prüfungen bestanden.`);
