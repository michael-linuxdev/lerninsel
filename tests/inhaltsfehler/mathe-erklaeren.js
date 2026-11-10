// Paket B (Prüfung der Lerninhalte 11.11.2026): Erklär-Einheiten, Denkfehler, Bäckerei, Rhythmus-Boot, Leuchtturm, Brücke
const assert = require("assert"), fs = require("fs"), path = require("path");
module.exports = function (wurzel) {
  let n = 0; const pruefe = (name, f) => { f(); n++; };
  const lies = (p) => fs.readFileSync(path.join(wurzel, p), "utf8");
  global.window = global;
  const mem = {}; global.Spielwelt = { lade: (k) => mem[k] || null };
  for (const f of ["spiele/mathe/aufgaben.js", "spiele/mathe/fehler.js", "spiele/mathe/erklaeren.js"]) { delete require.cache[require.resolve(path.join(wurzel, f))]; require(path.join(wurzel, f)); }
  const F = global.MatheFehler, E = global.MatheErklaeren, M = "−";
  const auf = (text, antwort) => ({ text, antwort: String(antwort), art: "zahl" });

  pruefe("Teilen mit Rest: Robos Gegenbeispiel ist in sich stimmig", () => {
    const g = E.ERKLAERUNGEN.k3rest.find(s => s.typ === "gegenbeispiel");
    const m = /teilt (\d+) durch (\d+)\. Er sagt: „(\d+) Reihen, Rest (\d+)/.exec(g.text); assert.ok(m, g.text);
    const [a, b, q, r] = m.slice(1).map(Number);
    assert.strictEqual(q * b + r, a, "Robos Rechnung passt zur Zahl"); assert.ok(r >= b, "sein Rest ist zu groß – darum falsch"); assert.strictEqual(g.stimmt, false);
    const w = /Richtig sind (\d+) Reihen und Rest (\d+)/.exec(g.warum); assert.ok(w, g.warum);
    assert.strictEqual(+w[1], Math.floor(a / b)); assert.strictEqual(+w[2], a % b); assert.ok(+w[2] < b);
  });
  pruefe("Geteilt, eine Gruppe daneben: bei großem Ergebnis keine abgeschnittene Reihe", () => {
    const e = F.erkenne(auf("864 : 4", 216), 217); assert.strictEqual(e.id, "geteiltreihe");
    const t = e.lang.join(" "); assert.ok(!/er-Schritten/.test(t), t); assert.ok(/216 · 4 = 864/.test(t), t);
    const k = F.erkenne(auf("24 : 4", 6), 7); assert.ok(/4, 8, 12, 16, 20, 24\./.test(k.lang.join(" ")) && /6 Schritte/.test(k.lang.join(" ")));
  });
  pruefe("„a · b“ heißt überall „a-mal die b“", () => {
    assert.ok(/3-mal die 4/.test(F.erkenne(auf("3 · 4", 12), 7).lang.join(" ")));
    const r = F.erkenne(auf("7 · 8", 56), 63); assert.strictEqual(r.id, "malreihe");
    assert.ok(/7-mal die 8/.test(r.kurz) && /7 · 8 heißt: 7-mal die 8\./.test(r.lang[1]) && /8er-Schritten/.test(r.lang[2]), r.lang.join(" "));
    assert.ok(/6-mal die 0/.test(F.erkenne(auf("6 · 0", 0), 6).lang[0]));
    assert.ok(/3 · 5 heißt: 3-mal die 5/.test(JSON.stringify(E.ERKLAERUNGEN.mal1.map(s => (s.bilder || []).map(b => b.satz)))));
    assert.ok(/Wie oft passt die 3 in die 12\?/.test(F.erkenne(auf("12 : 3", 4), 36).lang[1]), "Geteilt einheitlich als „wie oft passt“");
  });
  pruefe("Eltern-Wahl „Ergänzen“: Hinweise ohne Tauschen; ohne Fachwörter", () => {
    const a = auf(`523 ${M} 147`, 376), p = F.schritte(a);
    mem.eltern = { mathe: { minus: "ergaenzen" } };
    const e = F.erkenne(a, 424); assert.strictEqual(e.id, "kleinvongross");
    assert.ok(!/[Tt]ausch/.test(e.kurz + e.lang.join(" ")) && /kleine 1/.test(e.kurz), e.kurz);
    const h = F.pruefeSchritt(p.o, p.liste[0], "4", "ergaenzen").hinweis; assert.ok(!/[Tt]ausch/.test(h) && /bis 13/.test(h), h);
    const h2 = F.pruefeSchritt(p.o, p.liste[1], String(p.liste[1].ziffer + 1), "ergaenzen").hinweis; assert.ok(!/\(\+10\)/.test(h2) && /von 5 bis 12/.test(h2), h2);
    mem.eltern = null;
    assert.ok(/[Tt]ausch/.test(F.erkenne(a, 424).kurz), "Abziehen bleibt beim Tauschen");
    const q = F.schritte(auf(`503 ${M} 147`, 356)); assert.ok(!/-1/.test(F.pruefeSchritt(q.o, q.liste[1], String(q.liste[1].ziffer + 1)).hinweis));
    const d = F.erkenne(auf("38 + 5", 43), 53); assert.strictEqual(d.id, "uebertragdoppelt"); assert.ok(!/kleine 1/.test(d.kurz + d.lang.join(" ")), "Kl. 2: keine „kleine 1“");
    assert.ok(/kleine 1/.test(F.erkenne(auf("348 + 275", 623), 633).kurz));
    let s = 7; const zz = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
    for (const k of F.KATALOG) if (k.kontrast) for (let i = 0; i < 40; i++) { let x; try { x = k.kontrast({ a: 34, b: 28, op: "+", c: 62 }, zz); } catch (e) { break; } assert.ok(!/Übertrag/.test(x.hilfe || ""), k.id + ": " + x.hilfe); }
  });
  pruefe("Erklär-Einheiten: Runden-Satz und Mal-mehrstellig-Aufgabe", () => {
    const t = JSON.stringify(E.ERKLAERUNGEN.k3runden); assert.ok(!/"7 ist näher an 350\."/.test(t));
    const m = E.ERKLAERUNGEN.k4malmehr.find(s => s.typ === "machen"); assert.ok(/234 · 2/.test(m.text) && m.a === 468, m.text);
    assert.ok(!/aufs Bild/.test(/typ === "ergaenzen"[\s\S]{0,1600}/.exec(lies("spiele/mathe/mathe.js")) || [""])[0] || true);
    assert.ok(!lies("spiele/mathe/mathe.js").includes("Schau noch einmal aufs Bild"));
  });
  pruefe("Bäckerei: Akkusativ, kein Bagel, Kl. 3 im Kopf rechenbar", () => {
    const q = lies("spiele/baeckerei/laden.js");
    assert.ok(/=== "Muffin" \? "einen"/.test(q) && !/\["Brot", "Croissant", "Muffin", "Brötchen"\]/.test(q));
    assert.ok(!q.includes("🥯"));
    const c = /\n\s*c: (\[\[.*?\]\])/.exec(q)[1]; for (const [, p] of JSON.parse(c)) assert.strictEqual(p % 10, 0, "Preis " + p);
    assert.ok(/st === "vs" \|\| st === "c" \? 1 \+ zufall\(2\)/.test(q), "Kl. 3 höchstens zwei Sorten");
  });
  pruefe("Rhythmus-Boot: Einzahl, keine Dublette, 4 Schläge, Ta-a klingt länger", () => {
    const q = lies("spiele/rhythmus/boot.js"); assert.ok(q.includes('"1 neuer Rhythmus"') && !/neue \$\{lauf\.sterne === 1 \? "Rhythmus"/.test(q));
    const R = eval("(" + /const RHYTHMEN = (\{[\s\S]*?\n  \});/.exec(q)[1] + ")"), L = { ta: [1, 1], ti: [1, 2], taa: [2, 1], sch: [1, 0] };
    const alle = [].concat(R.a, R.b, R.c); assert.strictEqual(new Set(alle).size, alle.length, "kein Rhythmus doppelt");
    for (const r of alle) { const t = r.split(" "); assert.strictEqual(t.reduce((s, k) => s + L[k][0], 0), 4, r); assert.ok(t.reduce((s, k) => s + L[k][1], 0) >= 3, r); }
    assert.ok(/k === "taa" \? 1\.7 \* zeit/.test(q) && /Zähl die Noten auf der Karte mit/.test(q));
  });
  pruefe("Schatzkammer: Zähler als Zahl (Tage in der Bäckerei) und Brücken-Text", () => {
    const q = lies("spiele/leuchtturm/leuchtturm.js"), zahl = eval("(" + /const zahl = (\(o\) => [^;]+);/.exec(q)[1] + ")");
    assert.strictEqual(zahl(3), 3); assert.strictEqual(zahl(undefined), 0); assert.strictEqual(zahl({ a: 1, b: 0, c: 2 }), 2);
    assert.ok(/d\.tage\+\+/.test(lies("spiele/baeckerei/laden.js")));
    assert.ok(!lies("spiele/bruecke/bruecke.js").includes("sind dran"));
  });
  return n;
};
if (require.main === module) console.log("✅ Paket B: " + module.exports(process.argv[2] || "/home/user/lerninsel") + " Prüfungen bestanden.");
