// Rauchtest: richtet die App ein und öffnet jede Seite (quer und hoch). Meldet JavaScript-Fehler.
// Aufruf: sh tests/laufen.sh   (startet einen lokalen Server und führt diesen Test aus)
// Umgebung: BASIS=http://localhost:8799/  PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const SEITEN = [
  "", "spiele/anziehen/", "spiele/mathe/", "spiele/deutsch/", "spiele/medien/", "spiele/sachkunde/",
  "spiele/ich/", "spiele/tier/", "spiele/eltern/", "spiele/welt3d/"
];
const SEITEN_3D = ["spiele/welt3d/heimat.html", "spiele/welt3d/ballons.html", "spiele/welt3d/insel.html", "spiele/welt3d/probe.html?stil=b"];
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const fehler = [];
  const neueSeite = async (ctx, name) => {
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${name}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${name}: ${m.text()}`); });
    return p;
  };
  for (const [breite, hoehe, lage] of [[1180, 820, "quer"], [820, 1180, "hoch"]]) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    const p = await neueSeite(ctx, `einrichtung (${lage})`);
    await p.goto(BASIS);
    await p.waitForURL(/eltern/, { timeout: 5000 });
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.fill("#e-name", "Testkind"); await p.selectOption("#e-sprache", { index: 1 }); await p.click("#e-ok");
    await p.waitForURL(u => !/eltern/.test(u.toString()), { timeout: 5000 });
    for (const s of SEITEN) {
      const q = await neueSeite(ctx, `${s || "start"} (${lage})`);
      await q.goto(BASIS + s); await q.waitForTimeout(500);
      // ein Thema/eine Lektion antippen, wo es Kacheln gibt
      const kachel = await q.$(".lek:not(.zu)");
      if (kachel) { await kachel.click(); await q.waitForTimeout(400); const w = await q.$("#weiter"); if (w) { await w.click(); await q.waitForTimeout(300); } }
      await q.close();
    }
    if (lage === "quer") for (const s of SEITEN_3D) {
      const q = await neueSeite(ctx, `${s} (3D)`);
      await q.goto(BASIS + s); await q.waitForTimeout(2500); await q.close();
    }
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler gefunden:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log(`✅ Rauchtest bestanden (${SEITEN.length * 2 + SEITEN_3D.length} Seitenaufrufe).`);
})().catch(e => { console.error(e); process.exit(1); });
