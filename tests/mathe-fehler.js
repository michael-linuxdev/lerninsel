// Node-Test Fehler-Ursachen im Matheweg (02.11.2026, Vorbild Bastion): Denkfehler werden an typischen falschen Antworten erkannt,
// Kontrastaufgaben treffen genau den Denkfehler (1000 Startzahlen), die Diagnose läuft aufgefallen → vermutet → arbeit → aufgelöst → wieder,
// der Schrittweg prüft schriftliches Plus/Minus Stelle für Stelle, und jede Erklär-Einheit ist vollständig und stimmig.
// Aufruf: node tests/mathe-fehler.js
const assert = require("assert");
global.window = global;
global.localStorage = { getItem: () => null, setItem: () => {} };
require("../spiele/mathe/aufgaben.js");
require("../spiele/mathe/fehler.js");
require("../spiele/mathe/erklaeren.js");
require("../spiele/mathe/hilfe-ru.js");
const F = global.MatheFehler, E = global.MatheErklaeren, M = "−";
let n = 0;
const pruefe = (name, fn) => { fn(); n++; console.log("  ✓ " + name); };
const auf = (text, antwort) => ({ text, antwort: String(antwort), art: "zahl" });
let saat = 11; const zz = () => { saat = (saat * 1103515245 + 12345) % 2147483648; return saat / 2147483648; };

pruefe("typische falsche Antworten werden dem richtigen Denkfehler zugeordnet", () => {
  const fall = [[auf("34 + 28", 62), 52, "uebertrag"], [auf("34 + 28", 62), 72, "uebertragdoppelt"], [auf(`52 ${M} 27`, 25), 35, "kleinvongross"],
    [auf(`61 ${M} 28`, 33), 43, "borgen"], [auf("3 · 4", 12), 7, "op"], [auf(`9 ${M} 3`, 6), 12, "op"], [auf("5 + 3", 8), 7, "zaehlen"],
    [auf(`9 ${M} 3`, 6), 7, "zaehlen"], [auf("34 + 5", 39), 84, "stellenwert"], [auf("7 · 8", 56), 63, "malreihe"], [auf("7 · 8", 56), 48, "malreihe"],
    [{ text: "", antwort: "632", ops: { a: 347, b: 285, op: "+" } }, 522, "uebertrag"],
    [auf("6 · 0", 0), 6, "malnull"], [auf("0 · 7", 0), 7, "malnull"], [auf("15 : 3", 5), 12, "geteiltminus"], [auf("24 : 4", 6), 7, "geteiltreihe"], [auf("24 : 4", 6), 5, "geteiltreihe"], [auf("12 : 3", 4), 36, "op"],
    [auf("34 + 28", 62), 26, "dreher"], [{ text: "", frage: "Welche Zahl ist das?", antwort: "47", art: "zahl" }, 74, "dreher"], [auf("45 + 2", 47), 74, "dreher"],
    [F.uhrAufgabe(2, 0, zz), "12:10", "zeigervertauscht"], [F.uhrAufgabe(4, 30, zz), "6:20", "zeigervertauscht"], [F.uhrAufgabe(4, 30, zz), "5:30", "stundedaneben"], [F.uhrAufgabe(9, 0, zz), "8:00", "stundedaneben"],
    [{ text: "", frage: "Wie viel Geld ist das?", antwort: "25", art: "zahl", geld: [10, 10, 5] }, 3, "muenzenzaehlen"], [{ text: "", frage: "Wie viel Geld ist das?", antwort: "52", art: "zahl", geld: [50, 2] }, 25, "dreher"],
    [{ text: "", antwort: "5", art: "zahl", lineal: { start: 2, l: 5 } }, 7, "linealende"], [{ text: "3 m = ? cm", antwort: "300", art: "zahl", meter: 3 }, 30, "meter"], [{ text: "3 m = ? cm", antwort: "300", art: "zahl", meter: 3 }, 3, "meter"]];
  assert.strictEqual(F.erkenne({ text: "", antwort: "5", art: "zahl", lineal: { start: 0, l: 5 } }, 5), null);
  for (const [w, ok] of [[300, true], [30000, true], [3, true], [3000, false], [2000, false]]) assert.strictEqual((F.erkenne({ text: "", antwort: "3000", art: "zahl", umrechnen: { n: 3, f: 1000, von: "kg", nach: "g" } }, w) || {}).id === "umrechnen", ok, `3 kg → ${w}`);
  for (const [n, w, id] of [[305, 35, "nullvergessen"], [350, 35, "nullvergessen"], [700, 7, "nullvergessen"]]) assert.strictEqual((F.erkenne({ text: "", antwort: String(n), art: "zahl", stellen: n }, w) || {}).id, id, `${n} → ${w}`);
  for (const [n, w] of [[386, 380], [342, 350], [265, 260]]) assert.strictEqual((F.erkenne({ text: "", antwort: String(Math.round(n / 10) * 10), art: "zahl", runden: n }, w) || {}).id, "falschgerundet", `${n} → ${w}`);
  assert.strictEqual(F.erkenne({ text: "", antwort: "40", art: "zahl" }, 4), null, "40 → 4 ist kein Dreher");
  assert.strictEqual(F.erkenne({ text: "", antwort: "44", art: "zahl" }, 44), null);
  assert.deepStrictEqual([13, 16, 17, 21, 47, 52, 99].map(F.zahlwort), ["dreizehn", "sechzehn", "siebzehn", "einundzwanzig", "siebenundvierzig", "zweiundfünfzig", "neunundneunzig"]);
  for (const [a, w, id] of fall) { const e = F.erkenne(a, w); assert.ok(e && e.id === id, `${a.text || (a.ops ? a.ops.a + "+" + a.ops.b : a.frage)} → ${w}: erwartet ${id}, bekam ${e && e.id}`); assert.strictEqual(e.lang.length, 3); assert.ok(e.kurz.length > 10); }
  assert.strictEqual(F.erkenne(auf("34 + 28", 62), 62), null, "richtige Antwort ist kein Fehler");
  assert.strictEqual(F.erkenne(auf("34 + 28", 62), 17), null, "unbekannter Fehler bleibt unbekannt");
  assert.strictEqual(F.erkenne(auf("Wie viele?", 5), 4), null, "Textaufgaben ohne Rechnung werden nicht gedeutet");
});

pruefe("jede Kontrastaufgabe passt zum Denkfehler (1000 Startzahlen je Denkfehler) und ist richtig gerechnet", () => {
  const basis = { op: auf("5 + 3", 8), kleinvongross: auf(`52 ${M} 27`, 25), borgen: auf(`61 ${M} 28`, 33), uebertrag: auf("34 + 28", 62), uebertragdoppelt: auf("34 + 28", 62),
    stellenwert: auf("34 + 5", 39), zaehlen: auf("5 + 3", 8), malreihe: auf("7 · 8", 56),
    malnull: auf("6 · 0", 0), geteiltminus: auf("15 : 3", 5), geteiltreihe: auf("24 : 4", 6), dreher: auf("34 + 28", 62), zeigervertauscht: F.uhrAufgabe(4, 30, zz), stundedaneben: F.uhrAufgabe(4, 0, zz), muenzenzaehlen: F.geldAufgabe(zz), linealende: { text: "", antwort: "5", art: "zahl", lineal: { start: 2, l: 5 } }, meter: { text: "3 m = ? cm", antwort: "300", art: "zahl", meter: 3 }, nullvergessen: { text: "", antwort: "305", art: "zahl", stellen: 305 }, falschgerundet: { text: "", antwort: "390", art: "zahl", runden: 386 }, umrechnen: { text: "", antwort: "3000", art: "zahl", umrechnen: { n: 3, f: 1000, von: "kg", nach: "g" } }, restvergessen: auf("864 : 4", 216) };
  for (const f of F.KATALOG) {
    for (let i = 0; i < 1000; i++) {
      const [k] = F.kontraste(basis[f.id], f.id, zz), o = F.lies(k);
      if (o.umrechnen) { assert.ok(+k.antwort === o.umrechnen.n * 1000 && o.umrechnen.n !== 3 && o.umrechnen.von === "kg", k.frage); continue; }
      if (o.stellen) { assert.ok(/0/.test(k.antwort.slice(1)) && +k.antwort === o.stellen && /^<svg/.test(k.bild || ""), k.antwort); continue; }
      if (o.runden) { assert.ok(+k.antwort === Math.round(o.runden / 10) * 10 && o.runden % 10 >= 5, k.frage); continue; }
      if (o.lineal) { assert.ok(o.lineal.start > 0 && +k.antwort === o.lineal.l && /^<svg/.test(k.bild), k.frage); continue; }
      if (o.meter) { assert.ok(+k.antwort === o.meter * 100 && o.meter !== 3, k.text); continue; }
      if (o.geld) { assert.strictEqual(+k.antwort, o.geld.reduce((x, y) => x + y, 0)); assert.ok(o.geld.length !== +k.antwort && +k.antwort < 100, k.hilfe); continue; }
      if (o.uhr) { assert.ok(k.optionen.includes(k.antwort) && new Set(k.optionen).size === k.optionen.length && k.optionen.length >= 3 && o.uhr.h !== basis[f.id].uhr.h, f.id); assert.strictEqual(k.kontrast, f.id); continue; }
      const c = o.op === "+" ? o.a + o.b : o.op === M ? o.a - o.b : o.op === "·" ? o.a * o.b : o.a / o.b;
      assert.strictEqual(+k.antwort, c, `${f.id}: ${k.text}`); assert.ok(c >= 0 && Number.isInteger(c), `${f.id}: ${k.text}`); assert.strictEqual(k.kontrast, f.id);
      if (f.id === "uebertrag" || f.id === "uebertragdoppelt") assert.ok(F._h.hatUebertrag(o.a, o.b), k.text);
      if (f.id === "kleinvongross" || f.id === "borgen") assert.ok(F._h.hatBorgen(o.a, o.b) && F._h.kleinVonGross(o.a, o.b) !== c, k.text);
      if (f.id === "malreihe") assert.strictEqual(o.a, 7, "gleiche Reihe wie die falsche Aufgabe");
      if (f.id === "malnull") assert.ok(o.op === "·" && (o.a === 0 || o.b === 0), k.text);
      if (f.id.startsWith("geteilt")) assert.ok(o.op === ":" && o.b === (f.id === "geteiltminus" ? 3 : 4) && o.a % o.b === 0, k.text);
    }
  }
});

pruefe("Diagnose: aufgefallen → vermutet (2× in 10 Aufgaben) → arbeit → aufgelöst (2 Kontraste richtig) → wieder da", () => {
  const d = {};
  F.zaehle(d); assert.strictEqual(F.melde(d, "uebertrag"), "aufgefallen");
  for (let i = 0; i < 12; i++) F.zaehle(d);
  assert.strictEqual(F.melde(d, "uebertrag"), "aufgefallen", "zweimal, aber weit auseinander: nur aufgefallen");
  F.zaehle(d); F.zaehle(d); assert.strictEqual(F.melde(d, "uebertrag"), "vermutet");
  F.inArbeit(d, "uebertrag"); assert.strictEqual(d.fv.uebertrag.s, "arbeit");
  assert.strictEqual(F.kontrastErgebnis(d, "uebertrag", true), "arbeit");
  assert.strictEqual(F.kontrastErgebnis(d, "uebertrag", true), "aufgeloest");
  F.zaehle(d); assert.strictEqual(F.melde(d, "uebertrag"), "wieder");
  F.inArbeit(d, "uebertrag"); F.kontrastErgebnis(d, "uebertrag", true);
  F.zaehle(d); assert.strictEqual(F.melde(d, "uebertrag"), "vermutet", "neuer Treffer in Arbeit setzt zurück");
  assert.strictEqual(d.fv.uebertrag.k, 0);
  assert.ok(JSON.stringify(d).length < 200, "Spielstand bleibt klein");
  for (const f of F.KATALOG) assert.ok(F.TIPP[f.id] && F.TIPP[f.id].length < 140, `Eltern-Tipp für ${f.id}`);
  assert.ok(F.liste(d)[0].tipp.length > 10);
  assert.deepStrictEqual(F.liste(d).map(x => x.id), ["uebertrag"]);
});

pruefe("Schrittweg: Ziffern je Stelle, Übertrag vergessen und kleinere von größerer werden an der Stelle erkannt", () => {
  const p = F.schritte({ text: "", antwort: "632", ops: { a: 347, b: 285, op: "+" } });
  assert.deepStrictEqual(p.liste.map(s => s.ziffer), [2, 3, 6]);
  assert.ok(F.pruefeSchritt(p.o, p.liste[0], 2).ok);
  assert.strictEqual(F.pruefeSchritt(p.o, p.liste[1], 2).fv, "uebertrag", "4 + 8 ohne die gemerkte 1");
  assert.strictEqual(F.pruefeSchritt(p.o, p.liste[0], 12).fv, "uebertrag", "12 statt 2 geschrieben");
  const m = F.schritte({ text: "", antwort: "376", ops: { a: 523, b: 147, op: M } });
  assert.deepStrictEqual(m.liste.map(s => s.ziffer), [6, 7, 3]);
  assert.strictEqual(F.pruefeSchritt(m.o, m.liste[0], 4).fv, "kleinvongross", "7 − 3 statt 13 − 7");
  assert.strictEqual(F.pruefeSchritt(m.o, m.liste[2], 4).fv, "borgen", "Hunderter: 5 − 1 statt 4 − 1");
  assert.ok(F.pruefeSchritt(m.o, m.liste[2], 9, "ergaenzen").hinweis.length > 10);
  for (const [pp, i, w, art] of [[p, 1, 2], [p, 0, 12], [p, 1, 5], [m, 0, 4], [m, 2, 4], [m, 1, 9], [m, 2, 9, "ergaenzen"]]) {
    const h = F.pruefeSchritt(pp.o, pp.liste[i], w, art).hinweis; assert.ok(!/Übertrag|Ziffer|Stelle|Denkfehler/.test(h) && h.length <= 100, `Hinweis kindgerecht: ${h}`); }
  // schriftlich mal (04.11.2026): 347 · 5 = 1735 – gemerkte Zahl vergessen wird erkannt, die vordere gemerkte Zahl ist ein eigener Schritt
  const mal = F.schritte({ text: "347 · 5", antwort: "1735", art: "zahl" });
  assert.deepStrictEqual(mal.liste.map(s => s.ziffer), [5, 3, 7, 1]);
  assert.strictEqual(F.pruefeSchritt(mal.o, mal.liste[1], 0).fv, "uebertrag", "4 · 5 = 20 ohne die gemerkte 3");
  assert.strictEqual(F.pruefeSchritt(mal.o, mal.liste[0], 35).fv, "uebertrag", "35 statt 5 geschrieben");
  assert.ok(F.pruefeSchritt(mal.o, mal.liste[3], 0).hinweis.includes("nach vorn"));
  assert.strictEqual(F.schritte({ text: "34 · 56", antwort: "1904", art: "zahl" }), null, "mehrstellig mal: kein Schrittweg");
  assert.ok(/^<svg/.test(E.BILD.schrift(347, 5, "·", 2, "", 2)) && /<text[^>]*>3<\/text>/.test(E.BILD.schrift(347, 5, "·", 2, "", 2)));
  for (let i = 0; i < 500; i++) { const a = 112 + Math.floor(zz() * 887), b = 3 + Math.floor(zz() * 7), sm = F.schritte({ text: `${a} · ${b}`, antwort: String(a * b), art: "zahl" });
    assert.strictEqual(+sm.liste.map(x => x.ziffer).reverse().join(""), a * b, `${a} · ${b}`); }
  // schriftlich geteilt (04.11.2026): 864 : 4 = 216 von links, Rest vor die nächste Zahl
  const gt = F.schritte({ text: "864 : 4", antwort: "216", art: "zahl" });
  assert.deepStrictEqual(gt.liste.map(s => [s.z, s.ziffer]), [[8, 2], [6, 1], [24, 6]]);
  assert.strictEqual(F.pruefeSchritt(gt.o, gt.liste[2], 1).fv, "restvergessen", "4 : 4 statt 24 : 4");
  assert.ok(/Zu viel/.test(F.pruefeSchritt(gt.o, gt.liste[2], 7).hinweis) && /noch mehr/.test(F.pruefeSchritt(gt.o, gt.liste[2], 5).hinweis));
  assert.deepStrictEqual(F.schritte({ text: "156 : 3", antwort: "52", art: "zahl" }).liste.map(s => [s.z, s.ziffer]), [[15, 5], [6, 2]], "erste Zahl zu klein: zwei Ziffern zusammen");
  assert.ok(/^<svg/.test(E.BILD.schrift(864, 4, ":", 1)));
  for (let i = 0; i < 500; i++) { const b = 2 + Math.floor(zz() * 8), q = Math.ceil(100 / b) + 1 + Math.floor(zz() * (Math.floor(999 / b) - Math.ceil(100 / b) - 1)), sg = F.schritte({ text: `${q * b} : ${b}`, antwort: String(q), art: "zahl" });
    assert.strictEqual(+sg.liste.map(x => x.ziffer).join(""), q, `${q * b} : ${b}`); assert.ok(sg.liste.every(x => x.rest < b && x.ziffer < 10)); }
  // zufällige Aufgaben: die Ziffern ergeben immer das Ergebnis
  for (let i = 0; i < 1000; i++) {
    const a = 100 + Math.floor(zz() * 899), b = 100 + Math.floor(zz() * (a - 100)), plus = zz() < 0.5 && a + b < 1000;
    const s = F.schritte({ text: "", antwort: String(plus ? a + b : a - b), ops: { a, b, op: plus ? "+" : M } });
    assert.strictEqual(+s.liste.map(x => x.ziffer).reverse().join(""), plus ? a + b : a - b, `${a} ${plus ? "+" : M} ${b}`);
  }
});

pruefe("Erklär-Einheiten (kindgerecht, 03.11.2026): feste Reihenfolge zeigen → machen → ergänzen → Robos Fehler → Bildergeschichte, kurze Sätze, jedes Bild zeichnet", () => {
  const REIHE = ["zeigen", "machen", "ergaenzen", "gegenbeispiel", "geschichte"];
  const alle = Object.entries(E.ERKLAERUNGEN).flatMap(([id, e]) => Array.isArray(e) ? [[id, e]] : Object.entries(e).map(([v, x]) => [id + "/" + v, x]));
  assert.ok(alle.length >= 7);
  const FACHWORT = /Übertrag|Stelle|Ziffer|addier|subtrahier|Summand|Minuend|Subtrahend|Denkfehler/i;
  for (const [id, schritte] of alle) {
    assert.deepStrictEqual(schritte.map(s => s.typ), REIHE, id);
    for (const s of schritte) {
      assert.ok(s.text && s.text.length < 120, `${id}: Text zu lang (${s.typ})`);
      assert.ok(!FACHWORT.test(s.text + " " + (s.warum || "") + " " + (s.bilder || []).map(b => b.satz).join(" ")), `${id}: Fachwort im Kindertext (${s.typ})`);
      if (s.bilder) for (const b of s.bilder) { assert.ok(b.satz.length <= 90, `${id}: Satz zu lang: ${b.satz}`); assert.ok(/^<svg/.test(b.bild()), `${id}: Bild fehlt`); }
      if (s.typ === "geschichte") assert.strictEqual(s.bilder.length, 3, id);
      if (s.typ === "machen") assert.ok(s.art === "uhr" ? s.a >= 1 && s.a <= 12 : s.art === "bauen" ? s.a >= 100 && s.a < 1000 : s.art === "runden" ? s.a % 10 !== 0 : s.art === "lineal" ? s.a >= 0 && s.b > 0 && s.a + s.b <= 12 : s.art === "geld" ? s.muenzen.length >= 2 && s.muenzen.every((w, i) => i === 0 || w <= s.muenzen[i - 1]) : ["dazu", "weg", "gruppen"].includes(s.art) && s.a > 0 && s.b > 0 && (s.art !== "weg" || s.a > s.b), id);
      if (s.typ === "ergaenzen") assert.ok(s.optionen.includes(s.antwort) && new Set(s.optionen).size === s.optionen.length, id);
      if (s.typ === "gegenbeispiel") { assert.ok(F.KATALOG.some(f => f.id === s.fv), `${id}: Denkfehler ${s.fv}`); assert.strictEqual(s.stimmt, false); }
    }
  }
  // Fehler-Hinweise für Kinder: drei kurze Sätze ohne Fachwörter
  const o = { a: 34, b: 28, op: "+", c: 62 };
  for (const f of F.KATALOG) { const l = f.lang(Object.assign({}, o, f.id === "op" ? { op: "·", a: 4, b: 2, c: 8 } : f.id.includes("borgen") || f.id === "kleinvongross" ? { op: "−", a: 52, b: 27, c: 25 } : f.id === "malnull" ? { op: "·", a: 6, b: 0, c: 0 } : f.id.startsWith("geteilt") ? { op: ":", a: 54, b: 6, c: 9 } : f.id === "zeigervertauscht" || f.id === "stundedaneben" ? { op: "uhr", uhr: { h: 4, m: 30 }, c: "4:30" } : f.id === "muenzenzaehlen" ? { op: "geld", geld: [50, 20, 10, 5, 2], c: 87 } : f.id === "linealende" ? { op: "lineal", lineal: { start: 4, l: 11 }, c: 11 } : f.id === "meter" ? { op: "meter", meter: 5, c: 500 } : f.id === "nullvergessen" ? { op: "stellen", stellen: 305, c: 305 } : f.id === "falschgerundet" ? { op: "runden", runden: 386, c: 390 } : f.id === "umrechnen" ? { op: "umrechnen", umrechnen: { n: 4, f: 1000, von: "km", nach: "m" }, c: 4000 } : {}));
    assert.strictEqual(l.length, 3, f.id); l.forEach(t => { assert.ok(t.length <= 100, `${f.id}: ${t}`); assert.ok(!FACHWORT.test(t), `${f.id}: Fachwort: ${t}`); }); }
  assert.ok(/<svg/.test(E.bildFuer("uebertrag", o)) && /<svg/.test(E.bildFuer("zaehlen", { a: 5, b: 3, op: "+", c: 8 })), "Bilder zu den Fehlern");
  // Gegenbeispiele: Robos falsche Antwort ergibt wirklich den genannten Denkfehler
  const rechnung = /(\d+) ([+−·:]) (\d+) = (\d+)/;
  for (const [id, schritte] of alle) { const g = schritte.find(s => s.typ === "gegenbeispiel"), m = rechnung.exec(g.text);
    if (!m) continue; const a = +m[1], b = +m[3], op = m[2], c = op === "+" ? a + b : op === M ? a - b : op === ":" ? a / b : a * b;
    assert.strictEqual(F.erkenne({ text: "", antwort: String(c), ops: { a, b, op } }, +m[4]).id, g.fv, `${id}: ${m[0]}`); }
});

pruefe("Russische Hilfe (05.11.2026): jeder Satz der Erklär-Einheiten und der Denkfehler hat eine russische Zeile (Entwurf)", () => {
  const R = global.MatheRu, fehlt = [], pr = (t) => { if (t && /[a-zäöüß]{3}/i.test(t) && !R.uebersetze(t)) fehlt.push(t); };
  for (const e of Object.values(E.ERKLAERUNGEN)) for (const sch of (Array.isArray(e) ? [e] : Object.values(e))) for (const st of sch) { pr(st.text); pr(st.frage); pr(st.warum); (st.bilder || []).forEach(b => pr(b.satz)); }
  let saat2 = 5; const zz2 = () => { saat2 = (saat2 * 1103515245 + 12345) % 2147483648; return saat2 / 2147483648; };
  const fall = [[auf("34 + 28", 62), 52], [auf("34 + 28", 62), 72], [auf(`52 ${M} 27`, 25), 35], [auf(`61 ${M} 28`, 33), 43], [auf("3 · 4", 12), 7], [auf(`9 ${M} 3`, 6), 12], [auf("5 + 3", 8), 7],
    [auf(`9 ${M} 3`, 6), 7], [auf("34 + 5", 39), 84], [auf("7 · 8", 56), 63], [auf("6 · 0", 0), 6], [auf("15 : 3", 5), 12], [auf("24 : 4", 6), 7], [auf("12 : 3", 4), 36], [auf("8 : 2", 4), 16],
    [auf("34 + 28", 62), 26], [auf("45 + 2", 47), 74], [F.uhrAufgabe(2, 0, zz2), "12:10"], [F.uhrAufgabe(4, 30, zz2), "5:30"], [F.uhrAufgabe(4, 15, zz2), "5:15"], [F.uhrAufgabe(4, 45, zz2), "9:20"],
    [{ text: "", frage: "Wie viel Geld ist das?", antwort: "25", art: "zahl", geld: [10, 10, 5] }, 3], [{ text: "", antwort: "5", art: "zahl", lineal: { start: 2, l: 5 } }, 7],
    [{ text: "3 m = ? cm", antwort: "300", art: "zahl", meter: 3 }, 30], [{ text: "", antwort: "3000", art: "zahl", umrechnen: { n: 3, f: 1000, von: "kg", nach: "g" } }, 300],
    [{ text: "", antwort: "305", art: "zahl", stellen: 305 }, 35], [{ text: "", antwort: "390", art: "zahl", runden: 386 }, 380], [{ text: "", antwort: "340", art: "zahl", runden: 342 }, 350]];
  for (const [a, w] of fall) { const e = F.erkenne(a, w); assert.ok(e, `${a.text} → ${w}`); pr(e.kurz); e.lang.forEach(pr); for (let w = 0; w < 25; w++) F.kontraste(a, e.id).forEach(k => { pr(k.text); pr(k.hilfe); }); }   // Kontraste sind zufällig: mehrmals
  assert.deepStrictEqual(fehlt, [], "ohne russische Zeile – in spiele/mathe/hilfe-ru.js ergänzen");
  assert.strictEqual(R.uebersetze("Robo rechnet: 71 + 19 = 80. Stimmt das?"), "Робо считает: 71 + 19 = 80. Это правильно?", "Zahlen werden eingesetzt");
  assert.strictEqual(R.uebersetze("Das gibt es nicht."), "", "Unbekanntes bleibt leer");
  assert.strictEqual(R.STATUS.ru, "entwurf");
});

console.log(`✅ Mathe-Fehler-Ursachen: ${n} Prüfungen bestanden.`);
