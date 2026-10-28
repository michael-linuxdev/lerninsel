// Test „Vorlesen und Lesetheater“ (30.10.2026): Text laut vorlesen mit Zeitmessung, Aufnahme (Fake-Mikrofon, mit Eltern-Erlaubnis),
// Selbsteinschätzung, wiederholtes Lesen; Lesetheater mit Rolle bis zum Applaus (Tablet liest die anderen Rollen); Lesepass. Kl. 2 und 4.
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--autoplay-policy=no-user-gesture-required"] });
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const passt = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  async function kind(stufe, breite = 1180, hoehe = 820) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__testSchnell = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  const spion = (p) => p.evaluate(() => { window.__gesprochen = []; Sprache.verfuegbar = () => true; Sprache.hat = () => true; Sprache.stopp = () => {};
    Sprache.sprich = (t, l, f) => { window.__gesprochen.push(t); if (f) setTimeout(f, 5); }; });
  for (const [stufe, breite, hoehe, art] of [["4", 1180, 820, "quer"], ["2", 390, 760, "Handy"]]) {
    const { ctx, p } = await kind(stufe, breite, hoehe);
    await p.evaluate(() => { const e = Spielwelt.lade("eltern") || {}; e.deutsch = Object.assign({}, e.deutsch, { aufnehmen: true }); Spielwelt.speichere("eltern", e); });
    await p.goto(BASIS + "spiele/deutsch/"); await p.waitForTimeout(400);
    await p.click("#vorlesen-link"); await p.waitForURL(/vorlesen/); await p.waitForTimeout(400); await spion(p);
    const ids = await p.evaluate(() => __vorlesen.texte());
    erwarte(stufe === "4" ? ids.every(i => i.startsWith("vt.")) && ids.length === 8 : ids.some(i => i.startsWith("lt.")), `Kl. ${stufe}: passende Texte (${ids.length})`);
    for (let mal = 0; mal < 2; mal++) {
      await p.click(`[data-t="${ids[0]}"]`); await p.waitForTimeout(150);
      if (mal === 0) { await p.click("#lt-vorbild"); erwarte(await p.evaluate(() => window.__gesprochen.length === 1), `${art}: „Erst anhören“ liest den Text vor`); }
      await p.click("#lt-los"); await p.waitForTimeout(mal === 0 ? 2200 : 1500); await p.click("#lt-stopp"); await p.waitForTimeout(800);
      const w = await p.evaluate(() => ({ t: document.getElementById("lt-werte").textContent, auf: !document.getElementById("lt-anhoeren").hidden }));
      erwarte(/Wörter pro Minute/.test(w.t) && (mal === 0 || /Flüssiger als letztes Mal/.test(w.t)) && w.auf, `${art}: ${mal + 1}. Lesen – Zeit, Wörter pro Minute${mal ? ", „flüssiger als letztes Mal“" : ""}, Aufnahme zum Anhören`);
      for (let f = 0; f < 3; f++) await p.click(`#lt-selbst [data-f="${f}"] [data-w="${3 - (f % 2)}"]`);
      if (BILDER && mal === 1) await p.screenshot({ path: `${BILDER}/vorlesen-${art}.png` });
      await p.click("#lt-speichern"); await p.waitForTimeout(400);
    }
    const d = await p.evaluate((id) => __vorlesen.daten().mal[id], ids[0]);
    erwarte(d.length === 2 && d[1].selbst.every(x => x > 0), `${art}: zweimal gelesen mit Selbsteinschätzung gespeichert`);
    const heft = await p.evaluate(async () => (await Eigenes.alle(undefined, "ton")).filter(e => e.kapitel === "vorlesen").length);
    erwarte(heft === 2, `${art}: beide Aufnahmen liegen in „Mein Heft“ (${heft})`);
    // Lesetheater
    await p.click('[data-teil="theater"]'); await p.waitForTimeout(200);
    const st = await p.evaluate(() => __vorlesen.stuecke()); await p.click(`[data-s="${st[0]}"]`); await p.waitForTimeout(150);
    await p.click("#th-rollen [data-r]"); await p.waitForTimeout(100);
    for (let n = 0; n < 30; n++) {
      const z = await p.evaluate(() => ({ ende: /Applaus/.test(document.getElementById("th-info").textContent), ich: !document.getElementById("th-gelesen").hidden }));
      if (z.ende) break; if (z.ich) await p.click("#th-gelesen"); await p.waitForTimeout(60);
    }
    const th = await p.evaluate((s) => ({ info: document.getElementById("th-info").textContent, gespielt: (__vorlesen.daten().theater[s] || []).length, sprach: window.__gesprochen.length }), st[0]);
    erwarte(/Applaus/.test(th.info) && th.gespielt === 1 && th.sprach > 3 && await passt(p), `${art}: Lesetheater „${st[0]}“ mit einer Rolle bis zum Applaus, andere Rollen vom Tablet gelesen`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/theater-${art}.png` });
    // Lesepass
    await p.click('[data-teil="pass"]'); await p.fill("#pass-titel", "Die kleine Hexe"); await p.click('#pass-gefallen [data-g="3"]'); await p.click("#pass-dazu"); await p.waitForTimeout(150);
    erwarte(await p.evaluate(() => /Die kleine Hexe/.test(document.getElementById("pass-liste").textContent) && /1 Buch/.test(document.getElementById("pass-zahl").textContent)), `${art}: Lesepass mit einem Buch`);
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Vorlesen-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
