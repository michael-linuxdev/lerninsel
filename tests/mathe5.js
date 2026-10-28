// Test Mathe Klasse 5 nach den Lehrplänen Oberschule (2019) und Gymnasium (2021) Sachsen (29.10.2026): die 10 neuen Stationen am Ende des
// Wegs „Übergang 5“ echt über die Tasten durchgespielt (quer und Handy), Urkunde zählt weiter nur die ursprünglichen 10 Stationen,
// Elternbereich: Schulart Oberschule/Gymnasium umschalten, Lernbereiche und Inhaltspunkte Klasse 5. Aufruf: sh tests/laufen.sh mathe5
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const NEU = ["k5quadrat", "k5gleichung", "k5dezimal", "k5dezrechnen", "k5prozent", "k5kuerzen", "k5lage", "k5winkelpaare", "k5bewegung", "k5moeglich"];

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
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
  async function tippe(p) {
    const a = await p.evaluate(() => { const x = __mathe.lauf.liste[__mathe.lauf.pos]; return { art: x.art, antwort: x.antwort }; });
    if (a.art === "wahl") await p.evaluate((w) => [...document.querySelectorAll(".wahl-tasten .taste")].find(b => b.dataset.wert === w).click(), a.antwort);
    else { for (const z of a.antwort) await p.click(`.taste[data-ziffer="${z}"]`); await p.click(".taste.ok"); }
  }
  async function spiele(p, id, art) {
    const nr = await p.evaluate((id) => Mathe.STATIONEN_K5.findIndex(s => s.id === id), id);
    await p.evaluate((n) => __mathe.starte(n), nr); await p.waitForTimeout(150);
    let passt = true;
    for (let i = 0; i < 10; i++) {
      if (!(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))) passt = false;
      if (i === 0 && BILDER) await p.screenshot({ path: `${BILDER}/mathe5-${id}-${art}.png` });
      await tippe(p); await p.waitForTimeout(1050);
    }
    await p.waitForSelector("#ende-ansicht:not([hidden])", { timeout: 4000 });
    const sterne = await p.evaluate((id) => (Spielwelt.lade("mathe").k5 || {})[id], id);
    await p.click("text=Zum Matheweg"); await p.waitForTimeout(200);
    return { sterne, passt };
  }

  {
    const { ctx, p } = await kind("5");
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForSelector("#karte .station");
    const n = await p.evaluate(() => document.querySelectorAll("#karte .station:not(.ziel)").length);
    erwarte(n === 26, `Übergang 5: 26 Stationen (${n})`);
    for (const id of NEU) {
      const r = await spiele(p, id, "quer");
      erwarte(r.sterne === 3 && r.passt, `quer: „${id}“ – 10 Aufgaben über die Tasten gelöst, 3 Sterne, keine Scrollleiste (${r.sterne}, ${r.passt})`);
    }
    // Urkunde: weiterhin mit den ursprünglichen 10 Stationen erreichbar
    await p.evaluate(() => { const d = Spielwelt.lade("mathe") || {}; d.k5 = {}; Mathe.STATIONEN_K5.filter(s => !s.zusatz).forEach(s => { d.k5[s.id] = 2; }); Spielwelt.speichere("mathe", d); });
    await p.reload(); await p.waitForSelector("#urkunde-ziel");
    erwarte(!(await p.evaluate(() => document.getElementById("urkunde-ziel").classList.contains("zu"))), "Urkunde „Fit für Klasse 5“ bleibt mit den ursprünglichen 10 Stationen erreichbar");
    // Elternbereich: Oberschule (Standard) und Gymnasium
    const eltern = async () => { await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300); if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); } await p.waitForSelector("#lp-uebergang"); };
    await eltern();
    const os = await p.evaluate(() => ({ sa: document.getElementById("lp-uebergang").dataset.schulart, n: document.querySelectorAll("li[data-punkt^='sn.os5']").length, lb: document.getElementById("lp-uebergang").nextElementSibling.nextElementSibling.children.length }));
    erwarte(os.sa === "os" && os.n === 25 && os.lb === 5, `Elternbereich: Oberschule als Standard – 4 Lernbereiche + Wahlbereiche, 25 Punkte (${JSON.stringify(os)})`);
    await p.selectOption("#m-schulart", "gy"); await p.click("#m-speichern"); await p.waitForTimeout(200);
    await eltern();
    const gy = await p.evaluate(() => ({ sa: document.getElementById("lp-uebergang").dataset.schulart, n: document.querySelectorAll("li[data-punkt^='sn.gy5']").length, winkel: [...document.querySelectorAll("li[data-punkt^='sn.gy5']")].some(l => /Scheitel/.test(l.textContent)) }));
    erwarte(gy.sa === "gy" && gy.n === 26 && gy.winkel, `Elternbereich: Gymnasium gewählt – 26 Punkte, u. a. Scheitel- und Nebenwinkel (${JSON.stringify(gy)})`);
    if (BILDER) { await p.evaluate(() => { document.querySelectorAll("#lp-uebergang ~ ul .lp-punkte").forEach(d => d.open = true); document.getElementById("lp-uebergang").scrollIntoView(); }); await p.screenshot({ path: `${BILDER}/mathe5-eltern-gy.png` }); }
    await ctx.close();
  }
  {
    const { ctx, p } = await kind("5", 390, 760);
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForSelector("#karte .station");
    for (const id of ["k5dezrechnen", "k5winkelpaare", "k5bewegung", "k5kuerzen"]) { const r = await spiele(p, id, "hoch"); erwarte(r.sterne === 3 && r.passt, `Handy: „${id}“ – 3 Sterne, keine Scrollleiste (${r.sterne}, ${r.passt})`); }
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Mathe-Klasse-5-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
