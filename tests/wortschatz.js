// Node-Test (NA-40): Wortschatz-Kern (inhalte/woerter/*.js) und shared/woerter.js.
// Aufruf: node tests/wortschatz.js
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

let n = 0;
const pruefe = (name, fn) => { fn(); n++; console.log("  ✓ " + name); };
const WURZEL = path.join(__dirname, "..");
function lade(umgebung = "prod", hilfe = null) {
  const ctx = vm.createContext({ console });
  ctx.window = ctx;
  ctx.Spielwelt = { umgebung, hilfe: () => hilfe, profil: { name: "Mira" } };
  ["inhalte/woerter/bestand.js", "inhalte/woerter/d0.js", "shared/woerter.js"].forEach(d =>
    vm.runInContext(fs.readFileSync(path.join(WURZEL, d), "utf8"), ctx, { filename: d }));
  return ctx;
}
const w = lade(), W = w.Wortschatz;

pruefe("jede ID eindeutig und in der Form w.<wort> bzw. s.<stufe>.<nr>", () => {
  const ids = W.alle().map(x => x.id).concat(W.saetze().map(x => x.id));
  assert.strictEqual(new Set(ids).size, ids.length);
  W.alle().forEach(x => assert.match(x.id, /^w\.[a-z0-9]+$/, x.id));
  W.saetze().forEach(x => assert.match(x.id, /^s\.d0\.\d{2}$/, x.id));
});

pruefe("jedes Wort hat Bild, Silben (ergeben das Wort), Ton-Schlüssel und Wortfeld; Nomen haben Artikel", () => {
  W.alle().forEach(x => {
    assert.ok(x.bild, "Bild " + x.id);
    assert.strictEqual(x.silben.join(""), x.de, "Silben " + x.id);
    assert.ok(x.ton && x.themen.length, "Ton/Thema " + x.id);
    if (x.wortart === "nomen") { assert.ok(["der", "die", "das"].includes(x.artikel), "Artikel " + x.id); assert.ok(/^[A-ZÄÖÜ]/.test(x.de), "groß " + x.id); }
    else { assert.strictEqual(x.artikel, null, "kein Artikel " + x.id); assert.ok(/^[a-zäöüß]/.test(x.de), "klein " + x.id); }
    assert.ok(x.mehrzahl === null || typeof x.mehrzahl === "string", "Mehrzahl " + x.id);
  });
});

pruefe("Artikel mit Farbe und Form (der ■, die ●, das ▲)", () => {
  const A = W.ARTIKEL;
  assert.deepStrictEqual([A.der.form, A.die.form, A.das.form], ["■", "●", "▲"]);
  assert.strictEqual(new Set([A.der.farbe, A.die.farbe, A.das.farbe]).size, 3);
});

pruefe("DaZ D0 „Ankommen“: genau 100 Wörter und 20 Sätze, alle mit Russisch und Ukrainisch; Sätze verweisen auf echte Wörter", () => {
  const d0 = W.daz("d0");
  assert.strictEqual(d0.length, 100, "D0-Wörter: " + d0.length);
  assert.strictEqual(W.saetze("d0").length, 20);
  d0.concat(W.saetze("d0")).forEach(x => { assert.ok(x.ru && x.uk, "Übersetzung " + x.id); assert.ok(x.status.ru && x.status.uk, "Status " + x.id); });
  W.saetze("d0").forEach(s => s.woerter.forEach(id => assert.ok(W.wort(id), `${s.id}: ${id}`)));
  // Pflichtfelder laut SPRACHEN.md: Schule, Toilette, Hunger, Hilfe, Name, Zahlen 1–10
  ["w.schule", "w.toilette", "w.hunger", "w.hilfe", "w.name", "w.eins", "w.zehn"].forEach(id => assert.strictEqual(W.wort(id).daz, "d0", id));
});

pruefe("Übersetzungs-Status: Bestand-Russisch geprüft, neue Texte Entwurf; Entwürfe nur außerhalb der Hauptseite", () => {
  assert.strictEqual(W.wort("w.apfel").status.ru, "geprueft");
  assert.strictEqual(W.wort("w.apfel").status.uk, "entwurf");
  assert.strictEqual(W.wort("w.schule").status.ru, "entwurf");
  const RU = { code: "ru" };
  assert.strictEqual(lade("prod", RU).Wortschatz.hilfe(W.wort("w.schule")), null, "Entwurf nicht auf der Hauptseite");
  assert.strictEqual(lade("prod", RU).Wortschatz.hilfe(W.wort("w.apfel")).text, "яблоко");
  assert.strictEqual(lade("dev", RU).Wortschatz.hilfe(W.wort("w.schule")).entwurf, true);
  assert.strictEqual(lade("dev", { code: "uk" }).Wortschatz.hilfe(W.saetze("d0")[0]).text, "Привіт, мене звати Mira.");
});

pruefe("„Wort des Tages“ bleibt: WOERTER hat dieselben 64 Wörter in derselben Reihenfolge wie vorher", () => {
  assert.strictEqual(w.WOERTER.length, 64);
  // Vergleich mit der alten Liste (Stand vor NA-40, in tests/daten/woerter-alt.json festgehalten)
  const alt = JSON.parse(fs.readFileSync(path.join(__dirname, "daten", "woerter-alt.json"), "utf8"));
  assert.strictEqual(JSON.stringify(w.WOERTER.map(x => [x.w, x.a, x.p, x.e, x.ru])), JSON.stringify(alt));
  assert.strictEqual(w.WOERTER.find(x => x.w === "Milch").p, null);
});

console.log(`✅ Wortschatz: ${n} Prüfungen bestanden (${W.alle().length} Wörter, ${W.saetze().length} Sätze).`);
