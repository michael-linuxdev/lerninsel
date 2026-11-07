// Node-Test „Ehrlich lernen“ (07.11.2026): Raten darf sich nicht lohnen, Ablenker sollen zum Nachdenken bringen, Transfer-Fragen sind vollständig.
// Aufruf: node tests/inhalte.js
const assert = require("assert"), fs = require("fs"), path = require("path"), vm = require("vm");
let n = 0;
const pruefe = (name, fn) => { fn(); n++; console.log("  ✓ " + name); };
const ctx = vm.createContext({ console }); ctx.window = ctx;
["spiele/sachkunde/themen.js", "spiele/sachkunde/faecher.js", "spiele/sachkunde/religion.js", "spiele/sachkunde/transfer.js", "spiele/deutsch/werkstatt.js"]
  .forEach(d => vm.runInContext(fs.readFileSync(path.join(__dirname, "..", d), "utf8"), ctx, { filename: d }));
const w = ctx, ALLE = w.THEMEN.concat(w.FACH_THEMEN);
// Wird parallel fachlich überarbeitet (Wetterkarte) – darum hier ausgenommen
const AUSNAHME = ["wetterkarte"];

pruefe("Daumen-Sätze: insgesamt 40–60 % wahr, je Fach 35–65 %, jedes Thema mit zwei oder mehr Sätzen hat wahre und falsche", () => {
  let d = 0, j = 0; const fach = {}, gemischt = [];
  ALLE.forEach(t => { const ds = t.schritte.filter(s => s.typ === "daumen"); if (!ds.length) return;
    const wahr = ds.filter(s => s.ok).length; d += ds.length; j += wahr;
    const f = fach[t.fach || "sachkunde"] = fach[t.fach || "sachkunde"] || [0, 0]; f[0] += ds.length; f[1] += wahr;
    if (ds.length >= 2 && (wahr === 0 || wahr === ds.length) && !AUSNAHME.includes(t.id)) gemischt.push(t.id);
    ds.forEach(s => { assert.ok(s.satz && s.satzRu && s.warum && s.warumRu && typeof s.ok === "boolean", t.id + ": Daumen unvollständig"); }); });
  const anteil = j / d; console.log(`    ${j} von ${d} Daumen-Sätzen wahr (${Math.round(anteil * 100)} %)`);
  assert.ok(anteil >= 0.4 && anteil <= 0.6, "Anteil wahr " + anteil);
  Object.entries(fach).forEach(([f, [a, b]]) => assert.ok(b / a >= 0.35 && b / a <= 0.65, `${f}: ${b} von ${a} wahr`));
  assert.deepStrictEqual(gemischt, [], "Themen mit nur wahren oder nur falschen Daumen-Sätzen");
});

pruefe("Wahl-Fragen: genau eine richtige Antwort, die richtige Antwort steckt in keiner falschen (und umgekehrt) (sonst trifft „hasText“ im Test die falsche), Sachunterricht ohne Lach-Ablenker", () => {
  const LACHEN = /verzaubert|zauber|ist müde|weil sie bunt|schön bunt|rückenschmerzen|piratenschatz|karneval in rio|zu stein\b/i;
  const lachen = [];
  ALLE.concat([{ id: "transfer", schritte: w.SU_TRANSFER }]).forEach(t => t.schritte.filter(s => s.typ === "wahl").forEach(s => {
    assert.strictEqual(s.optionen.filter(o => o.ok).length, 1, `${t.id}: ${s.frage}`);
    const ts = s.optionen.map(o => o.t.toLowerCase());
    const r = s.optionen.findIndex(o => o.ok);   // die richtige darf nicht in einer falschen stecken und umgekehrt
    ts.forEach((b, k) => assert.ok(k === r || (!b.includes(ts[r]) && !ts[r].includes(b)), `${t.id}: „${ts[r]}“ / „${b}“`));
    s.optionen.forEach(o => assert.ok(o.ru && o.warum && o.warumRu, `${t.id}: ${o.t} ohne ru/warum`));
    if (!t.fach) s.optionen.filter(o => !o.ok && LACHEN.test(o.t)).forEach(o => lachen.push(`${t.id}: ${o.t}`)); }));
  assert.deepStrictEqual(lachen, [], "Ablenker zum Lachen statt zum Nachdenken");
});

pruefe("Werkstatt Tunwörter/Wiewörter: Ablenker sind andere Wortarten oder Formen derselben Wortfamilie (nicht beliebige Wörter)", () => {
  const FORMEN = { "w-verben": [["Lauf", "laufen"], ["Schlaf", "schlafen"], ["Essen", "isst"], ["Flug", "fliegen"], ["Maler", "malen"]],
    "w-adjektive": [["Größe", "wächst"], ["piepsen", "Mäuschen"], ["Säure", "schmeckt"], ["Hitze", "brennen"], ["kriechen", "Panzer"]] };
  Object.entries(FORMEN).forEach(([id, soll]) => { const k = w.WERKSTATT.find(x => x.id === id);
    assert.strictEqual(JSON.stringify(k.schritte.filter(s => s.typ === "luecke").map(s => s.optionen.slice(1))), JSON.stringify(soll), id); });
});

pruefe("Transfer-Fragen: je Lernbereich und Klassenstufe mit Themen mindestens 4 (ohne Sachsen-Fragen), Thema passt zum Lernbereich, alle Felder mit Russisch", () => {
  const T = w.SU_TRANSFER, kombis = {};
  w.THEMEN.forEach(t => { if (!t.land) kombis[t.lb + ":" + Math.max(2, t.stufe || t.kl || 2)] = 0; });
  T.forEach(x => { const t = w.THEMEN.find(y => y.id === x.thema);
    assert.ok(t && t.lb === x.lb, `${x.frage || x.satz}: Thema ${x.thema}`);
    assert.ok([2, 3, 4, 5].includes(x.kl) && x.transfer, x.thema);
    if (x.typ === "daumen") assert.ok(x.satz && x.satzRu && x.warum && x.warumRu && typeof x.ok === "boolean", x.satz);
    else assert.ok(x.typ === "wahl" && x.frage && x.ru && x.optionen.length === 3 && x.optionen[0].ok, x.frage);
    const k = x.lb + ":" + x.kl; if (!x.land && k in kombis) kombis[k]++; });
  const zuWenig = Object.entries(kombis).filter(([, z]) => z < 4).map(([k, z]) => k + " " + z).join(", ");
  assert.strictEqual(zuWenig, "", "zu wenige Transfer-Fragen");
  const wahr = T.filter(x => x.typ === "daumen" && x.ok).length, falsch = T.filter(x => x.typ === "daumen" && !x.ok).length;
  assert.ok(Math.abs(wahr - falsch) <= 4, `Transfer-Daumen ${wahr} wahr / ${falsch} falsch`);
  console.log(`    ${T.length} Transfer-Fragen für ${Object.keys(kombis).length} Lernbereich-Klassen-Paare`);
});

console.log(`✅ Inhalte: ${n} Prüfungen bestanden.`);
