// Test „icons.js verkleinern“ (07.11.2026): Emoji-Bilder in Häppchen (shared/icons/<teil>.js) in Kurzform statt einer großen shared/icons.js.
// Node-Teil: Häppchen sind aktuell (Generator neu gelaufen = gleiche Dateien), jede Kurzform packt Zeichen für Zeichen zum SVG des Generators aus,
// jedes Emoji liegt im angesagten Häppchen, Größen-Obergrenzen. Browser-Teil (echt): Startseite lädt nur die Häppchen ihrer Emojis, alle Plätze
// werden Bilder, ein neues Emoji aus einem fremden Häppchen lädt genau dieses nach, 120 neue Emojis auf einmal entstehen in kurzen Portionen,
// Leinwand-Bild (EmojiBild) aus einem noch nicht geladenen Häppchen, Prüfseite spiele/stil/ zeigt alle Bilder.
// Aufruf: sh tests/laufen.sh icons
const fs = require("fs"), path = require("path"), os = require("os"), zlib = require("zlib"), { spawnSync } = require("child_process");
const R = path.resolve(__dirname, "..");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const fehler = [];
const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };

// ---------- 1. Node: Generator, Kurzform, Zuordnung, Größen ----------
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "icons-"));
const g = spawnSync("python3", ["-I", path.join(R, "quellen/noto-stil-a.py"), path.join(R, "quellen/noto"), path.join(R, "quellen/icons/liste.json"), tmp, "--voll", path.join(tmp, "voll.json")], { encoding: "utf8" });
erwarte(g.status === 0, "Generator läuft (" + (g.stdout || g.stderr).trim().slice(0, 140) + ")");
const lies = require(path.join(R, "quellen/icons-lesen.js"));
const I = lies(R), voll = JSON.parse(fs.readFileSync(path.join(tmp, "voll.json"), "utf8"));
const veraltet = ["icons-liste.js", ...I.teile.map(t => "icons/" + t + ".js")].filter(f => fs.readFileSync(path.join(tmp, f), "utf8") !== fs.readFileSync(path.join(R, "shared", f), "utf8"));
erwarte(!veraltet.length, `Häppchen und Liste sind aktuell (python3 -I quellen/noto-stil-a.py)` + (veraltet.length ? ": veraltet " + veraltet.join(", ") : ""));
const anders = Object.keys(voll).filter(h => I.svg[h] !== voll[h]);
erwarte(Object.keys(voll).length >= 770 && !anders.length, `${Object.keys(voll).length} Bilder: Kurzform packt Zeichen für Zeichen zum SVG des Generators aus` + (anders.length ? " – anders: " + anders.slice(0, 5).join(", ") : ""));
const falsch = I.liste.filter(h => I.inTeil[h] !== I.wo[h]);
erwarte(I.liste.length === Object.keys(voll).length && !falsch.length, `jedes Emoji der Liste liegt in genau dem Häppchen, das icons-liste.js nennt (${I.teile.length} Häppchen)`);
// Zuordnung stabil: Prüfsumme des Hex-Schlüssels innerhalb seines Teils (ein neues Emoji ändert nur ein Häppchen)
const teilVon = {}; for (const [teil, l] of Object.entries(JSON.parse(fs.readFileSync(path.join(R, "quellen/icons/liste.json"), "utf8"))))
  for (const [e] of l) { const h = [...e].filter(c => c !== "️").map(c => c.codePointAt(0).toString(16)).join("-"); if (!(h in teilVon)) teilVon[h] = teil; }
const instabil = I.liste.filter(h => I.wo[h] !== `${teilVon[h]}-${zlib.crc32(Buffer.from(h)) % 4 + 1}`);
erwarte(!instabil.length, "Häppchen je Emoji = Teil der Liste + crc32(hex) % 4 (stabil bei neuen Emojis)" + (instabil.length ? ": " + instabil.slice(0, 5).join(", ") : ""));
const groessen = I.teile.map(t => fs.statSync(path.join(R, "shared/icons", t + ".js")).size);
const roh = groessen.reduce((a, b) => a + b, 0), gz = I.teile.reduce((a, t) => a + zlib.gzipSync(fs.readFileSync(path.join(R, "shared/icons", t + ".js")), { level: 9 }).length, 0);
erwarte(roh <= 2.0 * 1048576 && gz <= 740 * 1024 && Math.max(...groessen) <= 160 * 1024,
  `Größe: roh ${(roh / 1048576).toFixed(2)} MB (≤ 2,0; vorher 2,62), gzip ${(gz / 1024) | 0} KB (≤ 740; vorher 746), größtes Häppchen ${(Math.max(...groessen) / 1024) | 0} KB (≤ 160)`);
erwarte(!fs.existsSync(path.join(R, "shared/icons.js")), "keine alte shared/icons.js mehr");
fs.rmSync(tmp, { recursive: true, force: true });

// ---------- 2. Browser ----------
(async () => {
  const { chromium } = require("playwright");
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, serviceWorkers: "block" });
  await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !/fonts\.g|ERR_|Failed to load resource|open-meteo/.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
  await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString()));

  // a) Startseite: nur die Häppchen der eigenen Emojis, alle Plätze werden Bilder
  await p.goto(BASIS, { waitUntil: "load" });
  await p.waitForFunction(() => window.__emoji && __emoji.teile().length > 0 && !document.querySelector(".emo.warte"), null, { timeout: 15000 });
  await p.waitForTimeout(300);
  const st = await p.evaluate(() => {
    const auf = new Set([...document.querySelectorAll(".emo:not(.fig)")].map(e => __emoji.teilVon(e.querySelector(".emo-t").textContent)).filter(Boolean));
    const imgs = [...document.querySelectorAll(".emo > img")];
    return { geladen: __emoji.teile(), auf: [...auf], alle: LERN_ICON_TEILE.length, n: imgs.length, ok: imgs.every(i => i.complete && i.naturalWidth > 0 && i.src.startsWith("data:image/svg+xml")),
      dateien: performance.getEntriesByType("resource").filter(x => /shared\/icons\/[\w-]+\.js/.test(x.name)).length };
  });
  erwarte(st.geladen.length < st.alle && st.geladen.every(t => st.auf.includes(t)) && st.auf.every(t => st.geladen.includes(t)) && st.dateien === st.geladen.length,
    `Startseite lädt nur die Häppchen ihrer Emojis: ${st.geladen.length} von ${st.alle} (${st.dateien} Dateien)`);
  erwarte(st.n > 5 && st.ok, `Startseite: ${st.n} Emojis als Bild (data:-Adresse, geladen), keins wartet mehr`);

  // b) neues Emoji aus einem noch nicht geladenen Häppchen → genau dieses wird nachgeladen
  const nach = await p.evaluate(async () => {
    const offen = LERN_ICON_LISTE.split(",").find(h => !__emoji.teile().includes(__emoji.teilVon(h.split("-").map(x => String.fromCodePoint(parseInt(x, 16))).join(""))));
    const e = offen.split("-").map(x => String.fromCodePoint(parseInt(x, 16))).join(""), teil = __emoji.teilVon(e), vorher = __emoji.teile().length;
    const d = document.createElement("p"); d.id = "neu-emoji"; d.textContent = "Neu: " + e; document.body.appendChild(d);
    for (let i = 0; i < 100 && !(d.querySelector(".emo > img") && d.querySelector(".emo > img").complete); i++) await new Promise(r => setTimeout(r, 50));
    const img = d.querySelector(".emo > img");
    return { teil, neu: __emoji.teile().length - vorher, da: __emoji.teile().includes(teil), bild: !!img && img.naturalWidth > 0, text: d.textContent === "Neu: " + e };
  });
  erwarte(nach.da && nach.neu === 1 && nach.bild && nach.text, `neues Emoji aus fremdem Häppchen: genau „${nach.teil}“ nachgeladen, Bild da, Text unverändert`);

  // c) 120 verschiedene neue Emojis auf einmal (vierfach gedrosselt): Bilder entstehen in kurzen Portionen, keine lange Aufgabe aus emoji.js
  const cdp = await ctx.newCDPSession(p);
  await p.goto(BASIS + "spiele/heft/", { waitUntil: "load" }); await p.waitForFunction(() => window.__emoji && __emoji.bereit, null, { timeout: 10000 });
  await p.evaluate(() => __emoji.alle());   // Häppchen schon da: gemessen wird nur das Anlegen der Bilder
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  const viele = await p.evaluate(async () => {
    const vor = __emoji.stat(), hex = LERN_ICON_LISTE.split(",").slice(100, 220), d = document.createElement("div");
    d.textContent = hex.map(h => h.split("-").map(x => String.fromCodePoint(parseInt(x, 16))).join("")).join(" "); document.body.appendChild(d);
    for (let i = 0; i < 200 && (d.querySelectorAll(".emo > img").length < hex.length || d.querySelector(".emo.warte")); i++) await new Promise(r => setTimeout(r, 50));
    const n = __emoji.stat();
    return { bilder: d.querySelectorAll(".emo > img").length, soll: hex.length, portionen: n.portionen - vor.portionen, max: Math.round(n.portionMax) };
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  erwarte(viele.bilder === viele.soll && viele.max <= 60, `${viele.soll} neue Emojis auf einmal (Drossel 4): alle Bilder da, ${viele.portionen} Portionen, längste ${viele.max} ms (≤ 60)`);

  // d) Leinwand (Atelier-Stempel, Insel-Schilder): EmojiBild lädt ein Häppchen, das die Seite noch nicht hat
  await p.goto(BASIS + "spiele/heft/", { waitUntil: "load" });
  const lw = await p.evaluate(async () => {
    const E = await window.EmojiBereit; const offen = LERN_ICON_LISTE.split(",").map(h => h.split("-").map(x => String.fromCodePoint(parseInt(x, 16))).join(""))
      .find(e => !__emoji.teile().includes(__emoji.teilVon(e)));
    const img = await E.lade(offen); return { ok: !!img && img.naturalWidth > 0, teil: __emoji.teilVon(offen), da: __emoji.teile().includes(__emoji.teilVon(offen)) };
  });
  erwarte(lw.ok && lw.da, `EmojiBild.lade: Bild aus noch nicht geladenem Häppchen „${lw.teil}“ für die Leinwand`);

  // e) __emoji.alle() und die Prüfseite spiele/stil/ (lädt alle Häppchen selbst)
  const alle = await p.evaluate(async () => { const a = await __emoji.alle(); return { n: Object.keys(a).length, teile: __emoji.teile().length, alle: LERN_ICON_TEILE.length }; });
  erwarte(alle.n >= 770 && alle.teile === alle.alle, `__emoji.alle(): ${alle.n} Bilder aus allen ${alle.alle} Häppchen`);
  await p.goto(BASIS + "spiele/stil/", { waitUntil: "load" });
  await p.waitForFunction(() => window.LERN_ICONS && Object.keys(window.LERN_ICONS).length > 700 && document.querySelector("#aepfel svg"), null, { timeout: 15000 });
  erwarte(true, "Prüfseite spiele/stil/ zeigt die Noto-Bilder (alle Häppchen geladen)");
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n  " + fehler.join("\n  ")); process.exit(1); }
  console.log("✅ Icons-Test bestanden.");
})().catch(e => { console.log("❌ " + e.stack); process.exit(1); });
