// Test Service Worker und Updates (Paket 5, 07.11.2026): Die Seite wird in einen eigenen Ordner kopiert und von einem eigenen kleinen
// Server ausgeliefert, der jede Anfrage mitschreibt. Echt in Chromium mit Service Worker (localhost + window.__mitSW):
//  1. Version 1 richtet sich ein (alle Dateien der Offline-Liste).
//  2. Version 2 ändert eine Datei: beim Update wird NUR diese Datei geholt (der Rest aus dem alten Cache kopiert).
//  3. Kein Mischen: Solange eine Unterseite der alten Version offen ist, liefert der Service Worker ihr weiter die alte Datei, und die
//     Startseite in einem zweiten Fenster stellt nicht um. Allein auf der Startseite wird die neue Version still aktiv (Neuladen).
//  4. Offline: Startseite, Matheweg, Garten und Elternbereich laden ohne Netz.
//  5. Eine Version, deren Datei nicht zu ihrer Prüfsumme passt (halb verteilt), wird nicht aktiv.
// Für / und /dev/ (dev-bauen.sh baut /dev aus denselben Quellen, mit eigener config.js). Braucht ein frisch gebautes dev/.
// Aufruf: sh tests/laufen.sh swupdate
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path"), http = require("http"), os = require("os"), { execFileSync } = require("child_process");
const ROOT = path.resolve(__dirname, "..");
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|ERR_INTERNET_DISCONNECTED|open-meteo/;
const TYP = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css", ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain" };

(async () => {
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  // Seite kopieren
  const T = fs.mkdtempSync(path.join(os.tmpdir(), "lerninsel-sw-"));
  for (const f of ["index.html", "manifest.webmanifest", "sw.js", "shared", "spiele", "inhalte", "icons", "dev"]) fs.cpSync(path.join(ROOT, f), path.join(T, f), { recursive: true });
  // Server mit Protokoll
  let log = [];
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname); log.push(p);
    let f = path.join(T, p); if (p.endsWith("/")) f = path.join(f, "index.html");
    fs.readFile(f, (err, buf) => {
      if (err) { res.writeHead(404); res.end("nicht da"); return; }
      res.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream", "Cache-Control": "max-age=600" }); res.end(buf);
    });
  });
  await new Promise(ok => server.listen(0, "127.0.0.1", ok));
  const HOST = `http://localhost:${server.address().port}/`;
  const browser = await chromium.launch();

  const ps = (wurzel) => execFileSync(process.execPath, [path.join(ROOT, "quellen/sw-pruefsummen.js"), path.join(T, wurzel)], { encoding: "utf8" });
  const neueVersion = (wurzel, nr) => {   // wie dev-bauen.sh: andere Cache-Version, Prüfsummen neu
    const sw = path.join(T, wurzel, "sw.js");
    fs.writeFileSync(sw, fs.readFileSync(sw, "utf8").replace(/spielwelt-[0-9a-z]+"/, `spielwelt-test${nr}"`)); ps(wurzel);
  };
  const liste = (wurzel) => [...fs.readFileSync(path.join(T, wurzel, "sw.js"), "utf8").match(/const START = \[([\s\S]*?)\];/)[1].matchAll(/"([^"]+)"/g)].map(m => m[1]);
  const geholt = (praefix) => [...new Set(log.filter(p => p.startsWith(praefix)).map(p => p.slice(praefix.length)))];

  for (const wurzel of ["", "dev/"]) {
    console.log(`— ${wurzel ? "/dev" : "Hauptseite"} —`);
    const B = HOST + wurzel, PR = "/" + wurzel;
    const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 } });
    await ctx.addInitScript(() => { window.__mitSW = true; window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    const bereit = (pg = p) => pg.evaluate(async () => { const r = await navigator.serviceWorker.ready; return !!r.active; });
    const warteAuf = async (fn, ms = 30000, pg = p) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await pg.evaluate(fn).catch(() => false)) return true; await pg.waitForTimeout(200); } return false; };

    // 1. Version 1 einrichten (Ersteinrichtung der App gleich mit)
    log = [];
    await p.goto(B); await p.waitForURL(/eltern/); await p.waitForLoadState("load");
    erwarte(await bereit(), "Version 1: Service Worker aktiv");
    const v1 = geholt(PR), start = liste(wurzel);
    erwarte(start.every(e => v1.includes(e === "./" ? "" : e)), `Version 1: alle ${start.length} Dateien der Offline-Liste geholt`);
    await p.reload(); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    erwarte(await p.evaluate(() => !!navigator.serviceWorker.controller), "Startseite läuft über den Service Worker");

    // 2. Version 2: eine Datei geändert → nur sie wird geholt
    const datei = path.join(T, wurzel, "shared/garten.js");
    fs.appendFileSync(datei, "\nwindow.__version2 = true;\n"); neueVersion(wurzel, 2);
    await p.goto(B + "spiele/mathe/"); await p.waitForLoadState("load");
    log = [];
    await p.evaluate(() => navigator.serviceWorker.getRegistration().then(r => r.update()));
    erwarte(await warteAuf(() => navigator.serviceWorker.getRegistration().then(r => !!r.waiting)), "Version 2 ist eingerichtet und wartet");
    const v2 = geholt(PR).filter(e => e !== "sw.js");
    erwarte(v2.length === 1 && v2[0] === "shared/garten.js", `Update holt nur die geänderte Datei (geholt: ${v2.join(", ") || "nichts"})`);

    // 3. Kein Mischen: die offene Matheweg-Seite (Version 1) bekommt weiter die alte Datei
    const alt = await p.evaluate(() => fetch("../../shared/garten.js").then(r => r.text()));
    erwarte(!alt.includes("__version2"), "offene Seite der alten Version lädt weiter die alte Datei");
    const p2 = await ctx.newPage();
    await p2.goto(B); await p2.waitForLoadState("load"); await p2.waitForTimeout(1500);
    erwarte(await p2.evaluate(() => navigator.serviceWorker.getRegistration().then(r => !!r.waiting)), "zweites Fenster mit der Startseite stellt nicht um, solange der Matheweg offen ist");
    await p2.close();
    // allein auf der Startseite: still aktiv, Seite lädt neu
    await p.goto(B); await p.waitForLoadState("load");
    erwarte(await warteAuf(() => navigator.serviceWorker.getRegistration().then(r => !r.waiting && !!navigator.serviceWorker.controller)), "allein auf der Startseite: Version 2 wird aktiv");
    await p.waitForLoadState("load"); await p.waitForTimeout(500);
    const neu = await p.evaluate(() => fetch("shared/garten.js").then(r => r.text()));
    erwarte(neu.includes("__version2"), "danach kommt die neue Datei");
    const caches_ = await p.evaluate(() => caches.keys());
    erwarte(caches_.filter(k => /spielwelt-/.test(k)).length === 1 && caches_.some(k => /spielwelt-test2/.test(k)), `nur der Cache der neuen Version bleibt (${caches_.join(", ")})`);

    // 4. Offline weiter benutzbar
    await ctx.setOffline(true);
    for (const s of ["", "spiele/mathe/", "spiele/garten/", "spiele/eltern/"]) {
      const a = await p.goto(B + s).catch(e => null); await p.waitForTimeout(400);
      erwarte(a && a.ok() && await p.evaluate(() => !!window.Spielwelt && document.body.children.length > 2), `offline: ${s || "Startseite"} lädt`);
    }
    await ctx.setOffline(false);

    // 5. Halb verteilt: Datei passt nicht zur Prüfsumme → Version wird nicht aktiv
    if (!wurzel) {
      fs.appendFileSync(datei, "\nwindow.__version3 = true;\n"); neueVersion(wurzel, 3);
      fs.appendFileSync(datei, "\n// nachträglich geändert\n");
      log = [];
      await p.evaluate(() => navigator.serviceWorker.getRegistration().then(r => r.update().catch(() => {})));
      await p.waitForTimeout(6000);
      const r = await p.evaluate(() => navigator.serviceWorker.getRegistration().then(r => ({ wartet: !!r.waiting, installiert: !!r.installing })));
      erwarte(!r.wartet, "Datei passt nicht zur Prüfsumme: Version 3 wird nicht eingerichtet");
      erwarte(geholt(PR).filter(e => e === "shared/garten.js").length >= 1, "die Datei wurde nachgeholt (mit Wiederholung)");
      const n = await p.evaluate((u) => fetch(u).then(r => r.text()), PR + "shared/garten.js");
      erwarte(n.includes("__version2") && !n.includes("__version3"), "die Seite bleibt bei Version 2 (" + n.slice(-60).replace(/\n/g, " ") + ")");
      ps(wurzel);   // Prüfsumme jetzt richtig → Version 3 kommt
      await p.evaluate(() => navigator.serviceWorker.getRegistration().then(r => r.update()));
      erwarte(await warteAuf(() => navigator.serviceWorker.getRegistration().then(r => !!r.waiting)), "mit richtiger Prüfsumme wird Version 3 eingerichtet");
    }
    await ctx.close();
  }
  await browser.close(); server.close();
  fs.rmSync(T, { recursive: true, force: true });
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Service-Worker-Update-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
