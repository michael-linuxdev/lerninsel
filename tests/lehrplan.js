// Node-Test (NA-03): Lehrplan-Kern, Länderprofil Sachsen, Inhalte-Verzeichnis, errechnete Abdeckung.
// Aufruf: node tests/lehrplan.js   (LUECKEN=1 listet alle Kern-Lernziele ohne Inhalt)
// Lädt dieselben Dateien wie der Elternbereich in einer kleinen window-Attrappe.
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

let n = 0;
const pruefe = (name, fn) => { fn(); n++; console.log("  ✓ " + name); };
const WURZEL = path.join(__dirname, "..");

function lade(dateien) {
  const ctx = vm.createContext({ console });
  ctx.window = ctx;   // wie im Browser: window ist das globale Objekt
  dateien.forEach(d => vm.runInContext(fs.readFileSync(path.join(WURZEL, d), "utf8"), ctx, { filename: d }));
  return ctx;
}
const DATEN = ["spiele/mathe/aufgaben.js", "spiele/deutsch/geschichte.js", "spiele/medien/lektionen.js", "spiele/sachkunde/themen.js", "spiele/deutsch/werkstatt.js"];
const LEHRPLAN = ["shared/lehrplan/kern.js", "shared/inhalte.js", "inhalte/deutsch/anlaute.js", "inhalte/deutsch/lesetexte.js", "inhalte/deutsch/schreiben.js", "shared/lehrplan/laender/sachsen.js", "shared/lehrplan.js"];
const w = lade(DATEN.concat(LEHRPLAN));
const K = w.LernzielKern, I = w.Inhalte, L = w.LEHRPLAN;

pruefe("Kern: IDs eindeutig, Form <fach>.<bereich>.<nr>, Fach und Bereich bekannt, Stufe gültig", () => {
  const ids = K.alle().map(z => z.id);
  assert.strictEqual(new Set(ids).size, ids.length, "doppelte ID");
  K.alle().forEach(z => {
    assert.match(z.id, /^[a-z]{2,3}\.[a-z0-9]{2}\.\d{2}$/, z.id);
    assert.ok(K.FAECHER[z.fach] && K.FAECHER[z.fach].bereiche[z.bereich], "unbekannter Bereich " + z.id);
    assert.ok(K.STUFEN.includes(z.stufe), "Stufe " + z.id);
    assert.ok(z.titel.de && z.titel.de.length < 110, "Titel " + z.id);
  });
});

pruefe("Kern: Deutsch hat die fünf Bereiche der KMK-Fassung 2022, Mathe fünf Leitideen plus prozessbezogene Kompetenzen", () => {
  assert.strictEqual(Object.keys(K.FAECHER.de.bereiche).length, 5);
  assert.strictEqual(L.kmk.deutsch.length, 5);
  ["sz", "sc", "le", "tm", "su"].forEach(b => assert.ok(K.fach("de", b).length >= 4, "Deutsch " + b));
  ["zo", "rf", "ms", "gm", "dz", "pk"].forEach(b => assert.ok(K.fach("ma", b).length >= 4, "Mathe " + b));
  // Klasse 1–4 in Mathe und Deutsch jeweils mit Zielen
  ["1", "2", "3", "4"].forEach(s => ["ma", "de"].forEach(f => assert.ok(K.alle().some(z => z.fach === f && z.stufe === s), f + " Stufe " + s)));
});

pruefe("Sachsen: alle 49 Lernbereiche haben lz-Verweise auf existierende Ziele (Ausnahme: Experimentieren Kl. 3)", () => {
  let lb = 0, leer = [];
  ["mathe", "deutsch", "sachkunde"].forEach(f => Object.entries(L.laender.sachsen.faecher[f].stufen).forEach(([st, liste]) => liste.forEach(x => {
    lb++;
    assert.ok(Array.isArray(x.lz), `${f} ${st} ${x.nr} ohne lz`);
    if (!x.lz.length) leer.push(`${f} ${st} ${x.titel}`);
    x.lz.forEach(id => assert.ok(K.ziel(id), `${f} ${st} ${x.nr}: unbekanntes Ziel ${id}`));
  })));
  assert.strictEqual(lb, 49);
  assert.deepStrictEqual(leer, ["sachkunde 3 Experimentieren"]);
});

pruefe("Kompatibilität: LEHRPLAN.fuer liefert dasselbe wie vorher (Abdeckung von Hand 9 / 15 / 25, Stand NA-33a)", () => {
  const n = { ja: 0, teil: 0, nein: 0 };
  [2, 3, 4].forEach(k => ["mathe", "deutsch", "sachkunde"].forEach(f => L.fuer("sachsen", f, k).forEach(x => n[x.abdeckung]++)));
  assert.deepStrictEqual({ ...n }, { ja: 16, teil: 29, nein: 4 });
  assert.strictEqual(L.fuer("sachsen", "mathe", 1), L.fuer("sachsen", "mathe", 2), "Kl. 1 und 2 teilen sich „1/2“");
  assert.strictEqual(L.fuer("bayern", "mathe", 2).length, 0);
  assert.strictEqual(L.laender.sachsen.name, "Sachsen");
});

pruefe("Bestehende Inhalte tragen lz-Verweise, alle zeigen auf existierende Ziele", () => {
  const leer = [];
  w.Mathe.STATIONEN.forEach(s => (s.lz && s.lz.length) || leer.push("mathe:" + s.id));
  [w.WERKSTATT, w.THEMEN, w.LEKTIONEN, w.GESCHICHTE].forEach(arr => arr.forEach(k => (k.lz && k.lz.length) || leer.push(k.id)));
  assert.deepStrictEqual(leer, []);
  I.alle().forEach(d => d.lz.forEach(id => assert.ok(K.ziel(id), `${d.id}: unbekanntes Ziel ${id}`)));
  assert.ok(I.alle().length >= 23 + 5 + 5 + 4 + 6 + 5, "Inhalte: " + I.alle().length);
});

pruefe("Errechnete Abdeckung: Plus/Minus bis 100 gut, Wortarten gut, Anlaute gut, Lesetexte und Nachspuren teilweise, Texte planen teilweise", () => {
  assert.strictEqual(I.abdeckung("ma.zo.07"), "ja");    // vier Stationen
  assert.strictEqual(I.abdeckung("de.su.04"), "ja");    // NA-36: mit Steigerung und Pronomen genug Aufgaben
  assert.strictEqual(I.abdeckung("ma.zo.03"), "ja");    // Plus/Minus bis 20 und bis 10 (Klasse-1-Weg)
  assert.strictEqual(I.abdeckung("ma.zo.05"), "teil");  // nur eine Station
  assert.strictEqual(I.abdeckung("me.ph.01"), "teil");  // ohne Lernkartei
  assert.strictEqual(I.abdeckung("de.le.02"), "ja");    // NA-30: Tafel, Finde das Bild, Welcher Buchstabe (mit Lernkartei)
  assert.strictEqual(I.abdeckung("de.le.05"), "teil");   // NA-31: Lesetexte Kl. 2 (ohne Lernkartei)
  assert.strictEqual(I.abdeckung("de.sc.02"), "teil");   // NA-35: Nachspuren (ohne Lernkartei)
  assert.strictEqual(I.abdeckung("de.sc.07"), "teil");   // Paket A: Geschichte ordnen, Satzanfänge (ohne Lernkartei)
  assert.strictEqual(I.abdeckung("de.sz.07"), "teil");   // Paket A: Vortrag vorbereiten
  const z = L.zaehle("sachsen", 2).errechnet;
  assert.strictEqual(z.ja + z.teil + z.nein, 17, "Kl. 1/2: 17 Lernbereiche");
  assert.ok(z.teil >= 8, "Kl. 1/2: mindestens 8 teilweise errechnet");
});

pruefe("Länder-Abweichung: Sachsen verschiebt einfache Kombinationen nach Kl. 2 und kennt ein Zusatz-Ziel", () => {
  assert.strictEqual(I.zielStufe("ma.dz.05", "nw"), "3");
  assert.strictEqual(I.zielStufe("ma.dz.05", "sn"), "2");
  assert.ok(K.ziel("su.hi.sn01") && K.ziel("su.hi.sn01").land === "sn");
});

pruefe("Inhalte.fuer(kind): passende Stufe oder eine darunter, Vorschule nur Vorschul-Inhalte, Länder-Filter", () => {
  const ids = (k) => w.Inhalte.fuer(k).map(d => d.id);
  const kl2 = ids({ stufe: "2", land: "sn" });
  assert.ok(kl2.includes("mathe:plus100") && kl2.includes("mathe:plus20"), "Kl. 2 bekommt Kl.-2- und Kl.-1-Stationen");
  assert.ok(!kl2.includes("mathe:mal3"), "Einmaleins 6–9 erst ab Kl. 3");
  assert.ok(ids({ stufe: "3", land: "sn" }).includes("mathe:mal3"));
  const vs = ids({ stufe: "vs", land: "sn" });
  assert.ok(vs.includes("daz:d0") && vs.includes("de.anlaute.gleich") && vs.includes("mathe:k1wuerfel"), "Vorschule: Ankommen, Anlaute, Mengen");
  assert.ok(!vs.includes("mathe:plus20") && !vs.includes("mathe:k1zwanzig"), "Vorschule: keine Klasse-1/2-Rechenaufgaben");
  I.registriere({ id: "test:nurby", lz: ["de.sc.07"], stufe: ["1"], laender: ["by"] });
  assert.ok(ids({ stufe: "1", land: "by" }).includes("test:nurby"));
  assert.ok(!ids({ stufe: "1", land: "sn" }).includes("test:nurby"));
  assert.strictEqual(I.abdeckung("de.sc.07"), "teil");
});

// Übersicht: Lernziele ohne Inhalt (Abnahme NA-03: „tests/lehrplan.js listet Lernziele ohne Inhalt“)
const frisch = lade(DATEN.concat(LEHRPLAN));
const ohne = frisch.Inhalte.ohneInhalt();
const jeFach = {};
ohne.forEach(z => { (jeFach[z.fach] = jeFach[z.fach] || []).push(z.id); });
console.log(`\nLernziele ohne Inhalt: ${ohne.length} von ${frisch.LernzielKern.alle().length}`);
Object.entries(jeFach).forEach(([f, l]) => console.log(`  ${f}: ${l.length}` + (process.env.LUECKEN ? "  " + l.join(", ") : "")));
console.log(`✅ Lehrplan: ${n} Prüfungen bestanden.`);
