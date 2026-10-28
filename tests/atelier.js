// Test Atelier (30.10.2026): Ohren-Rätsel (Lied, Grundton, Melodierichtung, Rhythmus – 8 Rätsel echt beantwortet, ein Fehler) und
// Bilder digital verfremden (Bild aus der Galerie öffnen, Effekte ausprobieren, als neues Bild speichern – Original bleibt).
// Keine Konsolenfehler, keine waagerechte Scrollleiste. Aufruf: sh tests/laufen.sh atelier
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const passt = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  async function kind(stufe, breite = 1180, hoehe = 820) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  for (const [breite, hoehe, art] of [[1180, 820, "quer"], [390, 760, "Handy"]]) {
    const { ctx, p } = await kind("3", breite, hoehe);
    await p.goto(BASIS + "spiele/atelier/"); await p.waitForTimeout(500);
    await p.click('[data-zu="musik"]'); await p.waitForTimeout(200);
    await p.click('[data-m="erkennen"]'); await p.waitForTimeout(300);
    const arten = new Set(); let falschGetestet = false;
    for (let i = 0; i < 8; i++) {
      const e = await p.evaluate(() => { const e = __musik.ek(); return { art: e.art, loesung: e.loesung, optionen: e.optionen }; });
      arten.add(e.art);
      if (!falschGetestet) { const f = e.optionen.findIndex(o => o !== e.loesung); await p.click(`[data-ek="${f}"]`); falschGetestet = true;
        erwarte(await p.evaluate(() => /noch einmal/.test(document.getElementById("ek-text").textContent) && !__musik.ek().beantwortet), `${art}: falsche Antwort → „Hör noch einmal“`); }
      await p.click(`[data-ek="${e.optionen.indexOf(e.loesung)}"]`); await p.waitForTimeout(80);
      if (i === 1 && BILDER) await p.screenshot({ path: `${BILDER}/atelier-raetsel-${art}.png` });
      await p.click("#ek-weiter"); await p.waitForTimeout(80);
    }
    const ende = await p.evaluate(() => ({ t: document.getElementById("ek-frage").textContent, n: (Spielwelt.lade("atelier").musik || {}).erkennen }));
    erwarte(arten.size === 4 && /Super Ohren/.test(ende.t) && ende.n === 1 && await passt(p), `${art}: 8 Ohren-Rätsel (Lied, Grundton, Richtung, Rhythmus) gelöst, gemerkt, keine Scrollleiste`);
    // Bild verfremden
    await p.evaluate(async () => { const c = document.createElement("canvas"); c.width = 512; c.height = 384; const k = c.getContext("2d");
      k.fillStyle = "#fff"; k.fillRect(0, 0, 512, 384); k.fillStyle = "#E5484D"; k.fillRect(40, 40, 200, 200); k.fillStyle = "#2F86C8"; k.beginPath(); k.arc(360, 220, 90, 0, 7); k.fill();
      await Bilder.speichere({ url: c.toDataURL("image/jpeg", 0.9) }); });
    await p.reload(); await p.waitForTimeout(400);
    await p.click('[data-zu="galerie"]'); await p.waitForTimeout(400);
    await p.click("#galerie button"); await p.waitForTimeout(200);
    await p.click("#bild-verfremden"); await p.waitForSelector("#vf-dlg:not([hidden])");
    const farbe = () => p.evaluate(() => Array.from(document.getElementById("vf-bild").getContext("2d").getImageData(100, 100, 1, 1).data.slice(0, 3)));
    const vorher = await farbe();
    await p.click('[data-vf="grau"]'); const grau = await farbe();
    await p.click('[data-vf="popart"]'); await p.click('[data-vf="spiegeln"]'); await p.click('[data-vf="negativ"]'); const neg = await farbe();
    erwarte(vorher[0] > 180 && vorher[1] < 120 && Math.abs(grau[0] - grau[1]) < 6 && Math.abs(grau[1] - grau[2]) < 6 && neg[0] < 80, `${art}: Effekte verändern das Bild (rot ${vorher} → grau ${grau} → negativ ${neg})`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/atelier-verfremden-${art}.png` });
    await p.click("#vf-speichern"); await p.waitForTimeout(500);
    const n = await p.evaluate(async () => (await Bilder.alle()).length);
    erwarte(n === 2 && await p.evaluate(() => document.getElementById("vf-dlg").hidden), `${art}: verfremdetes Bild als neues Bild gespeichert, Original bleibt (${n} Bilder)`);
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Atelier-Test (Ohren-Rätsel, Bilder verfremden) bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
