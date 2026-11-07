// Prüfsummen der Offline-Liste (Paket 5, 07.11.2026): schreibt für jede Datei aus START in <wurzel>/sw.js die ersten 12 Zeichen ihrer
// SHA-1-Summe in die Zeile „const PRUEFSUMMEN = {…};“. Der Service Worker holt bei einem Update nur Dateien, deren Summe sich geändert hat,
// und prüft jede geholte Datei nach (so mischt sich nie eine halb verteilte Version hinein).
// Aufruf: node quellen/sw-pruefsummen.js [wurzel] [--pruefen]   (wurzel Standard: Repo; dev-bauen.sh ruft es auch für dev/ und dev/test/ auf)
//   --pruefen: nichts schreiben, Exit 1 wenn die Zeile nicht aktuell ist (tests/offline.js)
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const args = process.argv.slice(2), pruefen = args.includes("--pruefen");
const wurzel = path.resolve(args.find(a => !a.startsWith("--")) || path.join(__dirname, ".."));
const swDatei = path.join(wurzel, "sw.js");
const sw = fs.readFileSync(swDatei, "utf8");
const liste = [...sw.match(/const START = \[([\s\S]*?)\];/)[1].matchAll(/"([^"]+)"/g)].map(m => m[1]);
const norm = (e) => e === "./" ? "index.html" : e.endsWith("/") ? e + "index.html" : e;
const summen = {};
let bytes = 0;
for (const e of liste) {
  const buf = fs.readFileSync(path.join(wurzel, norm(e)));
  bytes += buf.length;
  summen[e] = crypto.createHash("sha1").update(buf).digest("hex").slice(0, 12);
}
const zeile = "const PRUEFSUMMEN = " + JSON.stringify(summen) + ";";
const MUSTER = /^const PRUEFSUMMEN = \{.*\};$/m;
if (!MUSTER.test(sw)) { console.error("sw.js: Zeile „const PRUEFSUMMEN = {…};“ fehlt"); process.exit(1); }
const neu = sw.replace(MUSTER, () => zeile);
if (pruefen) {
  if (neu !== sw) {
    const alt = JSON.parse(sw.match(MUSTER)[0].slice(20, -1));
    const anders = liste.filter(e => alt[e] !== summen[e]);
    console.error(`Prüfsummen in ${path.relative(process.cwd(), swDatei) || "sw.js"} veraltet (${anders.length}: ${anders.slice(0, 6).join(", ")}${anders.length > 6 ? " …" : ""}) – sh quellen/dev-bauen.sh ausführen`);
    process.exit(1);
  }
} else if (neu !== sw) fs.writeFileSync(swDatei, neu);
console.log(`Prüfsummen: ${liste.length} Dateien, ${(bytes / 1048576).toFixed(2)} MB`);
