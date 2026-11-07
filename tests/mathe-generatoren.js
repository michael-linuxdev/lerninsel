// Node-Test (Schritt B, NA-39): alle Mathe-Generatoren (Kl. 1–4 und Übergang 5) liefern 400-mal gültige Aufgaben – kein NaN/undefined,
// Zahl-Antworten nur aus Ziffern und mit der erlaubten Länge (`max`, Standard 3), Wahl-Antworten unter den Optionen, keine doppelten Optionen.
// Dazu römische Zahlen und Primzahlen. Aufruf: node tests/mathe-generatoren.js
const assert = require("assert");
global.window = {};
require("../spiele/mathe/aufgaben.js");
const M = window.Mathe;
let n = 0;
const pruefe = (name, fn) => { fn(); n++; console.log("  ✓ " + name); };

for (const [weg, liste, anzahl] of [["Kl. 1", M.STATIONEN_K1, 22], ["Kl. 2", M.STATIONEN, 45], ["Kl. 3", M.STATIONEN_K3, 35], ["Kl. 4", M.STATIONEN_K4, 26], ["Übergang 5", M.STATIONEN_K5, 28]]) {
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
pruefe("Startzahl: dieselbe Startzahl gibt dieselbe Aufgabe (alle Stationen, je 30 Startzahlen), verschiedene Startzahlen geben Vielfalt", () => {
  const ohneIds = (a) => JSON.stringify(a).replace(/(id=\\"|url\(#|href=\\"#)[^"\\)]*/g, "$1");
  for (const s of [].concat(M.STATIONEN_K1, M.STATIONEN, M.STATIONEN_K3, M.STATIONEN_K4, M.STATIONEN_K5)) {
    const texte = new Set();
    for (let saat = 1; saat <= 30; saat++) {
      const a = M.aufgabe(s.id, saat * 7919), b = M.aufgabe(s.id, saat * 7919);
      assert.strictEqual(ohneIds(a), ohneIds(b), `${s.id}: Startzahl ${saat * 7919} nicht eindeutig`);
      assert.strictEqual(a.saat, saat * 7919);
      texte.add(a.text + "|" + (a.frage || "") + "|" + a.antwort + "|" + ohneIds(a.bild || ""));
    }
    assert.ok(texte.size >= 4, `${s.id}: zu wenig Vielfalt über Startzahlen (${texte.size})`);
  }
  assert.ok(M.runde("plus20", 10).every(a => Number.isInteger(a.saat)), "Runden-Aufgaben tragen ihre Startzahl");
});
pruefe("Plus und Minus: 1000 Startzahlen je Station, Ergebnis auf zweitem Weg nachgerechnet", () => {
  const RECHNUNG = /^(\d+) ([+−·:]) (\d+)$/;
  let geprueft = 0;
  for (const s of [].concat(M.STATIONEN_K1, M.STATIONEN, M.STATIONEN_K3)) {
    for (let saat = 0; saat < 1000; saat++) {
      const a = M.aufgabe(s.id, saat), m = RECHNUNG.exec(a.text || "");
      const o = a.ops || (m && { a: +m[1], op: m[2], b: +m[3] });
      if (!o || a.text.includes("?")) continue;
      const c = o.op === "+" ? o.a + o.b : o.op === "−" ? o.a - o.b : o.op === "·" ? o.a * o.b : o.a / o.b;
      assert.strictEqual(+a.antwort, c, `${s.id} (Startzahl ${saat}): ${a.text || o.a + o.op + o.b} = ${a.antwort}`);
      assert.ok(c >= 0 && Number.isInteger(c), `${s.id}: ${a.text}`);
      geprueft++;
    }
  }
  assert.ok(geprueft > 10000, "zu wenige Rechnungen geprüft: " + geprueft);
});
pruefe("Vierecke Kl. 3/4: Antwort passt zur gezeichneten Figur, kein falscher Name trifft geometrisch auch zu", () => {
  // Eigenschaften direkt aus dem gezeichneten Pfad berechnen (unabhängig von den Tabellen in aufgaben.js)
  const namenVon = (p) => {
    const v = p.map((q, i) => { const w = p[(i + 1) % 4]; return [w[0] - q[0], w[1] - q[1]]; });
    const laenge = v.map(x => Math.hypot(x[0], x[1])), gl = (a, b) => Math.abs(a - b) < 0.5;
    const par = (a, b) => Math.abs(a[0] * b[1] - a[1] * b[0]) < 1e-6, recht = (a, b) => Math.abs(a[0] * b[0] + a[1] * b[1]) < 1e-6;
    const paare = (par(v[0], v[2]) ? 1 : 0) + (par(v[1], v[3]) ? 1 : 0);
    const r = new Set();
    if (paare >= 1) r.add("Trapez");
    if (paare === 2) r.add("Parallelogramm");
    if ([0, 1, 2, 3].every(i => recht(v[i], v[(i + 1) % 4]))) r.add("Rechteck");
    if (laenge.every(l => gl(l, laenge[0]))) r.add("Raute");
    if (r.has("Rechteck") && r.has("Raute")) r.add("Quadrat");
    if ((gl(laenge[0], laenge[1]) && gl(laenge[2], laenge[3])) || (gl(laenge[1], laenge[2]) && gl(laenge[3], laenge[0]))) r.add("Drachen");
    if (!r.size) r.add("allgemeines Viereck");
    return r;
  };
  let geprueft = 0;
  for (const s of [...M.STATIONEN_K3, ...M.STATIONEN_K4].filter(s => s.id === "k3vierecke" || s.id === "k4vierecke")) {
    for (let saat = 0; saat < 1500; saat++) {
      const a = M.aufgabe(s.id, saat);
      if (a.frage !== "Wie heißt das Viereck?") continue;
      const zahlen = /d="M([^"]+)Z"/.exec(a.bild)[1].replace(/L/g, " ").trim().split(/\s+/).map(Number);
      const punkte = [0, 2, 4, 6].map(i => [zahlen[i], zahlen[i + 1]]);
      const passt = namenVon(punkte);
      assert.ok(passt.has(a.antwort), `${s.id} (${saat}): Antwort ${a.antwort} passt nicht zur Figur (${[...passt]})`);
      for (const o of a.optionen) if (o !== a.antwort) assert.ok(!passt.has(o), `${s.id} (${saat}): ${o} trifft auf ${a.antwort} auch zu`);
      assert.ok(a.optionen.length >= 3, `${s.id}: zu wenige Optionen`);
      assert.ok(!/nicht rechtwinklig/.test(a.hilfe) || !passt.has("Rechteck"), s.id + ": falscher Hinweis");
      geprueft++;
    }
  }
  assert.ok(geprueft > 300, "zu wenige Vierecke geprüft: " + geprueft);
});
pruefe("Nachbarhunderter Kl. 3: nie eine Zahl, die selbst ein Hunderter ist", () => {
  let geprueft = 0;
  for (let saat = 0; saat < 3000; saat++) {
    const a = M.aufgabe("k3zahlen1000", saat), m = /liegt (\d+)\?/.exec(a.frage || "");
    if (!m) continue;
    assert.ok(+m[1] % 100 !== 0, `Startzahl ${saat}: ${a.frage}`);
    const [u, o] = a.antwort.split(" und ").map(Number);
    assert.ok(u < +m[1] && +m[1] < o && o - u === 100, a.frage + " → " + a.antwort);
    geprueft++;
  }
  assert.ok(geprueft > 100, "zu wenige geprüft: " + geprueft);
});
console.log(`✅ Mathe-Generatoren: ${n} Prüfungen bestanden.`);
