// Node-Test Fehler-Ursachen im Matheweg (02.11.2026, Vorbild Bastion): Denkfehler werden an typischen falschen Antworten erkannt,
// Kontrastaufgaben treffen genau den Denkfehler (1000 Startzahlen), die Diagnose läuft aufgefallen → vermutet → arbeit → aufgelöst → wieder,
// der Schrittweg prüft schriftliches Plus/Minus Stelle für Stelle, und jede Erklär-Einheit ist vollständig und stimmig.
// Aufruf: node tests/mathe-fehler.js
const assert = require("assert");
global.window = global;
require("../spiele/mathe/fehler.js");
require("../spiele/mathe/erklaeren.js");
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
    [auf("34 + 28", 62), 26, "dreher"], [{ text: "", frage: "Welche Zahl ist das?", antwort: "47", art: "zahl" }, 74, "dreher"], [auf("45 + 2", 47), 74, "dreher"]];
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
    malnull: auf("6 · 0", 0), geteiltminus: auf("15 : 3", 5), geteiltreihe: auf("24 : 4", 6), dreher: auf("34 + 28", 62) };
  for (const f of F.KATALOG) {
    for (let i = 0; i < 1000; i++) {
      const [k] = F.kontraste(basis[f.id], f.id, zz), o = F.lies(k);
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
      if (s.typ === "machen") assert.ok(["dazu", "weg", "gruppen"].includes(s.art) && s.a > 0 && s.b > 0 && (s.art !== "weg" || s.a > s.b), id);
      if (s.typ === "ergaenzen") assert.ok(s.optionen.includes(s.antwort) && new Set(s.optionen).size === s.optionen.length, id);
      if (s.typ === "gegenbeispiel") { assert.ok(F.KATALOG.some(f => f.id === s.fv), `${id}: Denkfehler ${s.fv}`); assert.strictEqual(s.stimmt, false); }
    }
  }
  // Fehler-Hinweise für Kinder: drei kurze Sätze ohne Fachwörter
  const o = { a: 34, b: 28, op: "+", c: 62 };
  for (const f of F.KATALOG) { const l = f.lang(Object.assign({}, o, f.id === "op" ? { op: "·", a: 4, b: 2, c: 8 } : f.id.includes("borgen") || f.id === "kleinvongross" ? { op: "−", a: 52, b: 27, c: 25 } : f.id === "malnull" ? { op: "·", a: 6, b: 0, c: 0 } : f.id.startsWith("geteilt") ? { op: ":", a: 54, b: 6, c: 9 } : {}));
    assert.strictEqual(l.length, 3, f.id); l.forEach(t => { assert.ok(t.length <= 100, `${f.id}: ${t}`); assert.ok(!FACHWORT.test(t), `${f.id}: Fachwort: ${t}`); }); }
  assert.ok(/<svg/.test(E.bildFuer("uebertrag", o)) && /<svg/.test(E.bildFuer("zaehlen", { a: 5, b: 3, op: "+", c: 8 })), "Bilder zu den Fehlern");
  // Gegenbeispiele: Robos falsche Antwort ergibt wirklich den genannten Denkfehler
  const rechnung = /(\d+) ([+−·:]) (\d+) = (\d+)/;
  for (const [id, schritte] of alle) { const g = schritte.find(s => s.typ === "gegenbeispiel"), m = rechnung.exec(g.text);
    if (!m) continue; const a = +m[1], b = +m[3], op = m[2], c = op === "+" ? a + b : op === M ? a - b : op === ":" ? a / b : a * b;
    assert.strictEqual(F.erkenne({ text: "", antwort: String(c), ops: { a, b, op } }, +m[4]).id, g.fv, `${id}: ${m[0]}`); }
});

console.log(`✅ Mathe-Fehler-Ursachen: ${n} Prüfungen bestanden.`);
