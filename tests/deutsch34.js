// Test NA-36: Wörter-Werkstatt Klasse 3–4 (Präteritum, Perfekt/Futur, Satzglieder, Satzzeichen, ck/tz/ss/ß)
// Sichtbarkeit je Klasse, jeder Schritt lässt sich anzeigen, richtige Lücke wird angenommen, keine Scrollleiste, keine Konsolenfehler.
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const NEU = ["w-praeteritum", "w-perfekt", "w-satzglieder", "w-satzzeichen", "w-kurz-lang"];

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  async function kind(stufe, breite, hoehe) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    await p.goto(BASIS + "spiele/deutsch/"); await p.waitForTimeout(500);
    return { ctx, p };
  }
  const kacheln = (p) => p.evaluate(() => [...document.querySelectorAll("#werkstatt button.ort")].map(b => b.getAttribute("aria-label")));
  // Sichtbarkeit je Klasse
  for (const [stufe, anzahl] of [["1", 5], ["2", 8], ["3", 10]]) {
    const { ctx, p } = await kind(stufe, 1180, 820);
    const k = await kacheln(p);
    erwarte(k.length === anzahl, `Klasse ${stufe}: ${anzahl} Werkstatt-Kapitel sichtbar (${k.length})`);
    await ctx.close();
  }
  for (const [breite, hoehe, art] of [[1180, 820, "quer"], [390, 760, "hoch"]]) {
    const { ctx, p } = await kind("3", breite, hoehe);
    const idx = await p.evaluate((neu) => neu.map(id => WERKSTATT.findIndex(k => k.id === id)), NEU);
    if (art === "quer") {
      const lz = await p.evaluate((neu) => WERKSTATT.filter(k => neu.includes(k.id)).every(k => k.lz.length && k.stufe && k.schritte.every(s => s.ru)), NEU);
      erwarte(idx.every(i => i >= 0) && lz, "fünf neue Kapitel mit Lernziel, Klasse und russischem Entwurf");
    }
    for (let n = 0; n < NEU.length; n++) {
      await p.evaluate((i) => __deutsch.starte(i, WERKSTATT), idx[n]); await p.waitForTimeout(200);
      const anz = await p.evaluate(() => __deutsch.lauf.k.schritte.length);
      let ok = true, angenommen = true;
      for (let s = 0; s < anz; s++) {
        const r = await p.evaluate((s) => { __deutsch.schritt(s); return { passt: document.documentElement.scrollWidth <= innerWidth + 1, typ: __deutsch.lauf.k.schritte[s].typ, richtig: (__deutsch.lauf.k.schritte[s].optionen || [])[0] }; }, s);
        if (!r.passt) { ok = false; console.log(`    Scrollleiste: ${NEU[n]} Schritt ${s}`); }
        if (r.typ === "luecke") {
          await p.evaluate((t) => [...document.querySelectorAll(".optionen .option")].find(b => b.textContent === t).click(), r.richtig); await p.waitForTimeout(80);
          const gut = await p.evaluate(() => !!document.querySelector(".option.richtig"));
          if (!gut) angenommen = false;
        }
      }
      erwarte(ok && angenommen, `${art}: „${NEU[n]}“ – ${anz} Schritte, richtige Lücken angenommen, keine Scrollleiste`);
      if (BILDER) { await p.evaluate(() => __deutsch.schritt(1)); await p.screenshot({ path: `${BILDER}/deutsch34-${NEU[n]}-${art}.png` }); }
    }
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Deutsch-Kl.-3/4-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
