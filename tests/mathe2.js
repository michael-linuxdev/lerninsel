// Test Mathe Kl. 2 in voller Tiefe (Lehrplan Sachsen 2025, Kl. 1/2): 17 neue Stationen am Ende des Kl.-2-Wegs, Freischalten je Lernbereich,
// alle neuen Stationen echt durchgespielt (Ziffern- und Wahltasten antippen) bis zur Sternewertung, Inhaltspunkte im Elternbereich.
// Aufruf: sh tests/laufen.sh mathe2   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const NEU = ["zahlen100", "lage", "rechentricks", "euro", "linien", "zahlenmauer", "massband", "wege", "quadratzahlen", "tabelle", "figuren", "zeitspanne",
  "matheworte", "kombinieren2", "spiegeln2", "detektiv", "wuerfelbau2"];

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  async function kind(stufe, breite = 1180, hoehe = 820) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__elternAlle = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  const offen = (p) => p.evaluate(() => [...document.querySelectorAll("#karte .station:not(.ziel)")].map(b => !b.classList.contains("zu")));
  // Eine Aufgabe über die Tasten lösen (wie ein Kind): Ziffern + ✓ oder die passende Wahltaste
  async function tippe(p) {
    const a = await p.evaluate(() => { const x = __mathe.lauf.liste[__mathe.lauf.pos]; return { art: x.art, antwort: x.antwort }; });
    if (a.art === "wahl") await p.evaluate((w) => [...document.querySelectorAll(".wahl-tasten .taste")].find(b => b.dataset.wert === w).click(), a.antwort);
    else { for (const z of a.antwort) await p.click(`.taste[data-ziffer="${z}"]`); await p.click(".taste.ok"); }
  }
  async function spiele(p, id, art) {
    const nr = await p.evaluate((id) => Mathe.STATIONEN.findIndex(s => s.id === id), id);
    await p.evaluate((n) => __mathe.starte(n), nr); await p.waitForTimeout(150);
    let passt = true;
    for (let i = 0; i < 10; i++) {
      if (!(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))) passt = false;
      if (i === 0 && BILDER) await p.screenshot({ path: `${BILDER}/mathe2-${id}-${art}.png` });
      await tippe(p); await p.waitForTimeout(1050);
    }
    await p.waitForSelector("#ende-ansicht:not([hidden])", { timeout: 4000 });
    const sterne = await p.evaluate((id) => (Spielwelt.lade("mathe").k2 || {})[id], id);
    await p.click("text=Zum Matheweg"); await p.waitForTimeout(200);
    return { sterne, passt };
  }

  // --- Freischalten je Lernbereich ---
  {
    const { ctx, p } = await kind("2");
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForSelector("#karte .station");
    const st = await p.evaluate(() => ({ n: document.querySelectorAll("#karte .station:not(.ziel)").length, ids: Mathe.STATIONEN.map(s => s.id) }));
    erwarte(st.n === 45, `Matheweg Kl. 2 hat 45 Stationen (${st.n})`);
    let o = await offen(p);
    const idx = (id) => st.ids.indexOf(id);
    erwarte(o[idx("plus20")] && o[idx("formen")] && o[idx("daten")] && o[idx("geld")] && !o[idx("minus20")] && !o[idx("lage")] && !o[idx("zahlen100")],
      "am Anfang ist die erste Station jedes Lernbereichs offen (Plus bis 20, Formen, Strichlisten, Geld), der Rest zu");
    if (BILDER) await p.screenshot({ path: `${BILDER}/mathe2-weg.png` });
    const r = await spiele(p, "formen", "quer");
    erwarte(r.sterne === 3, "Formen und Körper fehlerfrei: 3 Sterne");
    o = await offen(p);
    erwarte(o[idx("lage")] && o[idx("minus20")] === false && !o[idx("linien")], "danach ist „Wo ist was?“ (nächste Raum-und-Form-Station) offen, „Linien“ noch nicht");
    // Alte Regel gilt weiter: wer bisher alle 23 Stationen geschafft hat, sieht alle neuen Zahl-Stationen nach und nach, nichts wird gesperrt
    await p.evaluate(() => { const m = Spielwelt.lade("mathe") || {}; m.k2 = {}; Mathe.STATIONEN.slice(0, 23).forEach(s => { m.k2[s.id] = 2; }); Spielwelt.speichere("mathe", m); });
    await p.reload(); await p.waitForSelector("#karte .station");
    o = await offen(p);
    erwarte(o.slice(0, 24).every(Boolean) && o[idx("lage")] && o[idx("euro")] && o[idx("tabelle")] && !o[idx("rechentricks")],
      "Kind mit allen 23 alten Stationen: alles davon bleibt offen, je Lernbereich ist die erste neue Station frei");
    await ctx.close();
  }

  // --- Alle 17 neuen Stationen echt durchspielen (quer), ein Teil auch hoch ---
  for (const [breite, hoehe, art, liste] of [[1180, 820, "quer", NEU], [390, 760, "hoch", ["lage", "wege", "tabelle", "zeitspanne", "zahlenmauer", "detektiv"]]]) {
    const { ctx, p } = await kind("2", breite, hoehe);
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForSelector("#karte .station");
    for (const id of liste) {
      const r = await spiele(p, id, art);
      erwarte(r.sterne === 3 && r.passt, `${art}: „${id}“ – 10 Aufgaben über die Tasten gelöst, 3 Sterne, keine Scrollleiste (${r.sterne} Sterne, passt ${r.passt})`);
    }
    if (art === "quer") {
      // Lange Antworten bekommen kleinere Tasten
      await p.evaluate(() => __mathe.starte(Mathe.STATIONEN.findIndex(s => s.id === "detektiv")));
      let lang = false;
      for (let i = 0; i < 30 && !lang; i++) { lang = await p.evaluate(() => !!document.querySelector(".wahl-tasten.lang")); if (!lang) await p.evaluate(() => __mathe.starte(Mathe.STATIONEN.findIndex(s => s.id === "detektiv"))); }
      erwarte(lang, "lange Wahl-Antworten bekommen kleinere Schrift (.wahl-tasten.lang)");
      // Elternbereich: Inhaltspunkte Mathe Kl. 1/2
      await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300);
      if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
      await p.waitForSelector(".lp-punkte");
      const lp = await p.evaluate(() => { const m = [...document.querySelectorAll(".lp-punkte")].filter(d => d.querySelector("li[data-punkt^='sn.ma12']")); return { n: m.length, punkte: m.reduce((z, d) => z + d.querySelectorAll("li").length, 0), text: m[0].querySelector("summary").textContent }; });
      erwarte(lp.n === 4 && lp.punkte === 54, `Elternbereich: 4 Lernbereiche Mathe mit 54 Inhaltspunkten zum Aufklappen (${lp.n}, ${lp.punkte}; „${lp.text}“)`);
      if (BILDER) { await p.evaluate(() => { document.querySelectorAll(".lp-punkte").forEach(d => d.open = true); document.querySelector(".lp-punkte").scrollIntoView(); }); await p.screenshot({ path: `${BILDER}/mathe2-eltern.png` }); }
    }
    await ctx.close();
  }

  // --- Kl. 3 bleibt unverändert ---
  {
    const { ctx, p } = await kind("3");
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForSelector("#karte .station");
    const n = await p.evaluate(() => document.querySelectorAll("#karte .station:not(.ziel)").length);
    erwarte(n === 35, `Klasse 3 startet auf dem Kl.-3-Weg (35 Stationen, ${n})`);
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Mathe-Kl.-2-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
