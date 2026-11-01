// Node-Test (Review 01.11.2026): Offline-Liste in sw.js.
// Jede Datei, die eine HTML-Seite per <script src>/<link href> lädt, muss in START stehen (sonst fehlt sie offline), und jeder Eintrag
// in START muss existieren (ein toter Eintrag lässt cache.addAll scheitern – dann installiert sich der Service Worker auf keinem Gerät).
// Aufruf: node tests/offline.js
const fs = require("fs"), path = require("path"), assert = require("assert");
const root = path.resolve(__dirname, "..");
const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");
const liste = [...sw.match(/const START = \[([\s\S]*?)\];/)[1].matchAll(/"([^"]+)"/g)].map(m => m[1]);
const AUSSER = new Set(["dev", "quellen", "docs", "tests", ".git", ".github", ".claude", "node_modules"]);
// Absichtlich nicht offline: Probeszene (nur zum Vergleichen der Grafikstile), Prüfseiten für Übersetzungen
const NICHT_OFFLINE = new Set(["spiele/welt3d/probe.html", "spiele/welt3d/probe.js"]);
function alle(d, aus = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (d === root && AUSSER.has(e.name)) continue;
    const p = path.join(d, e.name); if (e.isDirectory()) alle(p, aus); else aus.push(p);
  }
  return aus;
}
const norm = (e) => e === "./" ? "index.html" : e.endsWith("/") ? e + "index.html" : e;
const inListe = new Set(liste.map(norm));
let n = 0; const pruefe = (name, fn) => { fn(); n++; console.log("  ✓ " + name); };

pruefe("Kein toter Eintrag in START (cache.addAll würde scheitern)", () => {
  const tot = liste.filter(e => !fs.existsSync(path.join(root, norm(e))));
  assert.deepStrictEqual(tot, [], "Einträge ohne Datei: " + tot.join(", "));
});
pruefe("Jede von einer HTML-Seite geladene lokale Datei steht in START", () => {
  const fehlt = new Set();
  for (const f of alle(root).filter(f => f.endsWith(".html"))) {
    const t = fs.readFileSync(f, "utf8");
    for (const m of t.matchAll(/<(?:script[^>]*\ssrc|link[^>]*\shref)=["']([^"']+)["']/g)) {
      let u = m[1]; if (/^(https?:|data:|\/\/|#)/.test(u)) continue; u = u.split(/[?#]/)[0];
      const rel = path.relative(root, path.resolve(path.dirname(f), u)).split(path.sep).join("/");
      if (!inListe.has(norm(rel)) && !NICHT_OFFLINE.has(rel) && !NICHT_OFFLINE.has(path.relative(root, f))) fehlt.add(rel + " ← " + path.relative(root, f));
    }
  }
  assert.deepStrictEqual([...fehlt], [], "fehlt in sw.js:\n  " + [...fehlt].join("\n  "));
});
pruefe("Keine Anfragen an fremde Schrift-Server (Fredoka liegt lokal)", () => {
  const css = fs.readFileSync(path.join(root, "shared/style.css"), "utf8");
  assert.ok(!/fonts\.(googleapis|gstatic)\.com/.test(css + sw), "Google Fonts noch eingebunden");
  for (const e of liste.filter(e => e.startsWith("shared/schrift/"))) assert.ok(fs.existsSync(path.join(root, e)));
});
console.log(`✅ Offline-Liste: ${n} Prüfungen bestanden (${liste.length} Einträge).`);
