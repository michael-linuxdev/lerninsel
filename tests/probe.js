// Grafik-Probe (NA-20): öffnet die runde three.js-Probe (der Pixel-Look ist seit 30.10.2026 entfernt) auf Handy- und iPad-Größe (quer und hoch), prüft auf Fehler,
// liest die Messwerte und macht Bildschirmfotos (BILDER=<ordner>). Aufruf: sh tests/laufen.sh probe
// NUR=rund misst nur diese Probe.
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const PROBEN = [["rund", "spiele/welt3d/probe.html?stil=b"]].filter(([n]) => !process.env.NUR || process.env.NUR.split(",").includes(n));
// iPad 10 (logisch 1180 × 820) und ein typisches Handy (390 × 844)
const GERAETE = [["ipad-quer", 1180, 820, 2], ["handy-hoch", 390, 844, 3], ["ipad-hoch", 820, 1180, 2], ["handy-quer", 844, 390, 3]];

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const fehler = [], werte = [];
  for (const [geraet, b, h, dpr] of GERAETE) {
    const ctx = await browser.newContext({ viewport: { width: b, height: h }, deviceScaleFactor: dpr, hasTouch: true, isMobile: geraet.startsWith("handy") });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); try { sessionStorage.setItem("spielwelt.erwachsen", String(Date.now() + 36e5)); } catch (e) { /* egal */ } });
    for (const [name, url] of PROBEN) {
      const p = await ctx.newPage();
      p.on("pageerror", e => fehler.push(`${name} (${geraet}): ${e.message}`));
      p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${name} (${geraet}): ${m.text()}`); });
      await p.goto(BASIS + url);
      const ok = await p.waitForFunction(() => window.__probe && __probe.info && (__probe.info().zeichnungen > 0 || __probe.info().fps > 0), null, { timeout: 40000 }).then(() => true, () => false);
      if (!ok) { fehler.push(`${name} (${geraet}): keine Messwerte`); await p.close(); continue; }
      await p.waitForTimeout(2500);
      const w = await p.evaluate(() => __probe.info());
      werte.push(Object.assign({ probe: name, geraet }, w));
      if (BILDER) await p.screenshot({ path: `${BILDER}/${name}-${geraet}.png`, scale: "css", timeout: 90000 });
      await p.close();
    }
    await ctx.close();
  }
  await browser.close();
  console.log("| Probe | Gerät | Zeichenaufrufe | Dreiecke | Engine-Download |\n|---|---|---:|---:|---:|");
  werte.forEach(w => console.log(`| ${w.probe} | ${w.geraet} | ${w.zeichnungen ?? "–"} | ${w.dreiecke != null ? Math.round(w.dreiecke).toLocaleString("de-DE") : "–"} | ${w.kb ? (w.kb / 1024).toFixed(2) + " MB" : "–"} |`));
  if (fehler.length) { console.log("❌ Fehler gefunden:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log(`✅ Grafik-Probe bestanden (${werte.length} Aufrufe).`);
})().catch(e => { console.error(e); process.exit(1); });
