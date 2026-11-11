// Nachlese (zweite Durchsicht, 14.11.2026): Stellen, die nach der ersten Inhaltsprüfung noch offen waren
const assert = require("assert"), fs = require("fs"), path = require("path"), vm = require("vm");
module.exports = function (wurzel) {
  let n = 0;
  const lies = (d) => fs.readFileSync(path.join(wurzel, d), "utf8");
  const pruefe = (name, f) => { f(); n++; };
  const window = {}; const ctx = vm.createContext({ window, console });
  ["spiele/mathe/aufgaben.js", "spiele/mathe/fehler.js", "spiele/mathe/erklaeren.js", "spiele/deutsch/werkstatt.js"]
    .forEach(d => vm.runInContext(lies(d), ctx, { filename: d }));
  const M = window.Mathe, F = window.MatheFehler;
  const viele = (id, k = 400) => Array.from({ length: k }, (_, i) => M.aufgabe(id, i + 1));
  pruefe("Hilfetexte: keine „Hälfte von 0“, „fehlt noch 1“ in der Einzahl", () => {
    for (const st of [].concat(M.STATIONEN, M.STATIONEN_K1, M.STATIONEN_K3, M.STATIONEN_K4, M.STATIONEN_K5))
      for (const a of viele(st.id, 150)) {
        const h = String(a.hilfe || "");
        assert.ok(!/Hälfte von 0 /.test(h), st.id + ": " + h);
        assert.ok(!/fehlen noch 1\./.test(h), st.id + ": " + h);
      }
  });
  pruefe("Denkfehler „nicht eingerückt“ greift nicht bei 10 · 10", () => {
    const fv = F.erkenne({ text: "10 · 10", antwort: 100, ops: { a: 10, b: 10, op: "·" } }, 10);
    assert.ok(!fv || fv.id !== "verrueckt", JSON.stringify(fv && fv.id));
  });
  pruefe("Erklär-Einheit Ergänzen: nach dem Auffüllen fehlt nichts mehr", () => {
    const t = lies("spiele/mathe/erklaeren.js");
    assert.ok(t.includes("Es haben also 6 gefehlt.") && !t.includes("Es fehlen also 6."));
    assert.ok(lies("spiele/mathe/hilfe-ru.js").includes("Es haben also {1} gefehlt."));
  });
  pruefe("Werkstatt: keine verstümmelten Ablenker", () => {
    for (const k of window.WERKSTATT) for (const s of k.schritte) for (const o of (s.optionen || []))
      assert.ok(!/^(Kälte am|Tschüss Anfang)$/.test(o), k.id + ": " + o);
  });
  pruefe("Kunst und Religion: Zuordnen verrät die Antwort nicht, Jona-Frage eindeutig", () => {
    assert.ok(!lies("spiele/sachkunde/faecher.js").includes("mit dem Flachpinsel\""));
    assert.ok(!lies("spiele/sachkunde/religion.js").includes("mit Jona nach der Geschichte?"));
  });
  return n;
};
if (require.main === module) console.log("✅ Nachlese: " + module.exports(process.argv[2] || path.join(__dirname, "..", "..")) + " Prüfungen bestanden.");
