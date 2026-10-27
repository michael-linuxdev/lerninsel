// Test: Jede Aufgabe aller Mathewege passt ohne Scrollen auf die Tafel – iPad 10 hoch und quer, übliches Handy hoch.
// Je Station werden drei Aufgaben angezeigt (__mathe.zeige) und Tafel-Inhalt gegen Tafel-Höhe gemessen.
// Sehr kleine Handys (360 × 640) scrollen bei langen Sachtexten noch etwas – das ist bewusst nicht Teil des Tests.
// Aufruf: sh tests/laufen.sh tafel
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  for (const [w, h, name] of [[820, 1180, "iPad hoch"], [1180, 820, "iPad quer"], [390, 760, "Handy hoch"]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "2");
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    const zu = []; let gezeigt = 0;
    for (const weg of ["k1", "k2", "k3", "k4", "k5"]) {
      await p.evaluate((wg) => { const m = Spielwelt.lade("mathe") || {}; m.weg = wg; Spielwelt.speichere("mathe", m); }, weg);
      await p.goto(BASIS + "spiele/mathe/"); await p.waitForSelector("#karte .station");
      const n = await p.evaluate(() => document.querySelectorAll("#karte .station:not(.ziel)").length);
      for (let i = 0; i < n; i++) {
        await p.evaluate((i) => __mathe.starte(i), i);
        for (let k = 0; k < 3; k++) {
          const r = await p.evaluate((k) => { __mathe.zeige(k); const t = document.getElementById("tafel"); return { ueber: t.scrollHeight - t.clientHeight, id: __mathe.lauf.station.id, breit: document.documentElement.scrollWidth > innerWidth + 1 }; }, k);
          gezeigt++;
          if (r.ueber > 4 || r.breit) zu.push(`${r.id}${r.breit ? " (zu breit)" : ` (+${r.ueber}px)`}`);
        }
      }
    }
    erwarte(!zu.length, `${name} (${w} × ${h}): ${gezeigt} Aufgaben, keine Tafel läuft über${zu.length ? " – " + [...new Set(zu)].join(", ") : ""}`);
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Tafel-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
