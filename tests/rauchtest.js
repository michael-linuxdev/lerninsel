// Rauchtest: richtet die App ein und öffnet jede Seite (quer und hoch). Meldet JavaScript-Fehler.
// Aufruf: sh tests/laufen.sh   (startet einen lokalen Server und führt diesen Test aus)
// Umgebung: BASIS=http://localhost:8799/  PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const SEITEN = [
  "", "spiele/anziehen/", "spiele/mathe/", "spiele/deutsch/", "spiele/medien/", "spiele/sachkunde/",
  "spiele/ich/", "spiele/schatz/", "spiele/familie/duell.html", "spiele/tier/", "spiele/eltern/", "spiele/welt3d/", "spiele/album/"
];
const SEITEN_3D = ["spiele/welt3d/heimat.html", "spiele/welt3d/lauf.html", "spiele/welt3d/kart.html", "spiele/welt3d/bau.html", "spiele/welt3d/ballons.html", "spiele/welt3d/insel.html", "spiele/welt3d/probe.html?stil=b"];
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
    // feste Uhrzeit am Nachmittag, damit die Ruhezeit nicht greift
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await neueSeite(ctx, `einrichtung (${lage})`);
    await p.goto(BASIS);
    await p.waitForURL(/eltern/, { timeout: 5000 });
    await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name", { timeout: 10000 });
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
    if (lage === "quer") {
      // zweites Kind anlegen, neue Sitzung muss „Wer spielt?“ zeigen
      const e = await neueSeite(ctx, "zweites Kind");
      await e.goto(BASIS + "spiele/eltern/"); await e.fill("#pin1", "1234"); await e.click("#pin-ok"); await e.click("#kind-neu"); await e.waitForSelector("#e-name");
      await e.fill("#e-name", "Zweitkind"); await e.click("#e-ok"); await e.waitForTimeout(600); await e.close();
      const w = await neueSeite(ctx, "wer spielt");
      await w.goto(BASIS); await w.waitForTimeout(600);
      const anzahl = await w.$$eval(".wer-kind", x => x.length);
      if (anzahl !== 2) fehler.push(`wer spielt: ${anzahl} statt 2 Kinder`);
      await w.click(".wer-kind >> nth=0"); await w.waitForTimeout(500);
      const name = await w.evaluate(() => Spielwelt.profil.name);
      if (name !== "Testkind") fehler.push(`wer spielt: falsches Kind aktiv (${name})`);
      await w.close();
    }
    // Die Insel und die Minispiele öffnen sich erst mit dem Tablet-Führerschein
    if (lage === "quer") { const f = await neueSeite(ctx, "führerschein"); await f.goto(BASIS); await f.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.fuehrerschein = "2026-10-01"; Spielwelt.speichere("medien", m); }); await f.waitForTimeout(300); await f.close(); }
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
