// Node-Test (NA-50): Können je Lernziel – Stand 0–4, Auswahl in der Zielzone 70–85 %, „leichter nach zwei Fehlern“.
// Simulation: ein Kind mit festen Trefferwahrscheinlichkeiten je Station übt 400 Aufgaben; die Auswahl soll vor allem Stationen
// treffen, die fordern, aber machbar sind, und die Gesamt-Trefferquote soll ungefähr in der Zielzone liegen.
// Aufruf: node tests/koennen.js
const assert = require("assert");
const K = require("../shared/koennen.js");

let n = 0;
const pruefe = (name, fn) => { fn(); n++; console.log("  ✓ " + name); };
let saat = 7; const zufall = () => { saat = (saat * 1103515245 + 12345) % 2147483648; return saat / 2147483648; };

pruefe("Stand wächst von neu bis gemeistert, Fehler senken ihn", () => {
  let e;
  assert.strictEqual(K.stand(e), 0);
  e = K.aktualisiere(e, false); assert.strictEqual(K.stand(e), 1);
  for (let i = 0; i < 5; i++) e = K.aktualisiere(e, true);
  assert.ok(K.stand(e) >= 2 && K.stand(e) <= 3, "nach 5 Treffern übt/sicher: " + e);
  for (let i = 0; i < 10; i++) e = K.aktualisiere(e, true);
  assert.strictEqual(K.stand(e), 4, "nach vielen Treffern gemeistert: " + e);
  e = K.aktualisiere(K.aktualisiere(e, false), false);
  assert.ok(K.stand(e) < 4, "zwei Fehler: nicht mehr gemeistert");
  assert.strictEqual(e[2], 2, "Fehler in Folge gezählt");
});

pruefe("„leichter“ nach zwei Fehlern in Folge, ein Treffer setzt zurück", () => {
  let d = { "ma.zo.07": K.aktualisiere(K.aktualisiere(undefined, true), false) };
  assert.ok(!K.leichter(d, ["ma.zo.07"]));
  d["ma.zo.07"] = K.aktualisiere(d["ma.zo.07"], false);
  assert.ok(K.leichter(d, ["ma.zo.07"]));
  d["ma.zo.07"] = K.aktualisiere(d["ma.zo.07"], true);
  assert.ok(!K.leichter(d, ["ma.zo.07"]));
});

pruefe("Auswahl: gleiche Lage → frühere Station; gemeisterte Stationen nach hinten", () => {
  const st = [{ id: "a", lz: ["x.a.01"] }, { id: "b", lz: ["x.b.01"] }];
  assert.strictEqual(K.waehle(st, {})[0].id, "a");
  const d = { "x.a.01": [98, 30, 0] };
  assert.strictEqual(K.waehle(st, d)[0].id, "b", "a ist gemeistert");
  d["x.b.01"] = [78, 10, 0];
  assert.strictEqual(K.waehle(st, d)[0].id, "b", "b liegt in der Zielzone");
});

pruefe("Simulation: Übung landet vor allem in der Zielzone, Gesamt-Trefferquote ≈ 70–85 %", () => {
  const p = { leicht: 0.99, fast: 0.93, gut: 0.82, mittel: 0.74, schwer: 0.45, zuSchwer: 0.15 };
  const stationen = Object.keys(p).map(id => ({ id, lz: ["sim." + id.slice(0, 2) + ".01"] }));
  const d = {}, gewaehlt = {};
  let treffer = 0, zaehler = 0;
  for (let i = 0; i < 400; i++) {
    const s = K.waehle(stationen, d)[0];
    const r = zufall() < p[s.id];
    s.lz.forEach(z => { d[z] = K.aktualisiere(d[z], r); });
    if (i >= 60) { gewaehlt[s.id] = (gewaehlt[s.id] || 0) + 1; zaehler++; if (r) treffer++; }   // nach der Eingewöhnung
  }
  const anteil = (id) => (gewaehlt[id] || 0) / zaehler, quote = treffer / zaehler;
  console.log("     Anteile:", Object.keys(p).map(id => `${id} ${Math.round(anteil(id) * 100)} %`).join(", "), `· Treffer ${Math.round(quote * 100)} %`);
  assert.ok(anteil("gut") + anteil("mittel") >= 0.55, "Zielzone wird am meisten geübt");
  assert.ok(anteil("leicht") < 0.08, "Leichtes kaum noch");
  assert.ok(anteil("zuSchwer") < 0.15, "zu Schweres nicht dauernd");
  assert.ok(quote >= 0.65 && quote <= 0.9, "Trefferquote in der Nähe der Zielzone: " + quote);
});

console.log(`✅ Können: ${n} Prüfungen bestanden.`);
