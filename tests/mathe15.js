// Test Mathe Kl. 1 und Übergang 5 in voller Tiefe: neue Stationen am Ende der Wege Kl. 1 (9) und Übergang 5 (6), Freischalten je Lernbereich,
// alle neuen Stationen echt über die Tasten durchgespielt, Urkunde „Fit für Klasse 5“ zählt nur die ursprünglichen 10 Stationen,
// Übergangs-Punkte im Elternbereich. Aufruf: sh tests/laufen.sh mathe15   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const NEU1 = ["k1zahlen20", "k1vergleich", "k1plus20", "k1lage", "k1formen", "k1geld", "k1zeit", "k1messen", "k1daten"];
const NEU5 = ["k5grosszahl", "k5teiler", "k5terme", "k5geometrie", "k5raum", "k5groessen"];

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
  const offen = (p) => p.evaluate(() => [...document.querySelectorAll("#karte .station:not(.ziel)")].map(b => !b.classList.contains("zu")));
  // Eine Aufgabe über die Tasten lösen (wie ein Kind): Ziffern + ✓ oder die passende Wahltaste
  async function tippe(p) {
    const a = await p.evaluate(() => { const x = __mathe.lauf.liste[__mathe.lauf.pos]; return { art: x.art, antwort: x.antwort }; });
    if (a.art === "wahl") await p.evaluate((w) => [...document.querySelectorAll(".wahl-tasten .taste")].find(b => b.dataset.wert === w).click(), a.antwort);
    else { for (const z of a.antwort) await p.click(`.taste[data-ziffer="${z}"]`); await p.click(".taste.ok"); }
  }
  async function spiele(p, id, art, weg) {
    const nr = await p.evaluate(([id, liste]) => Mathe[liste].findIndex(s => s.id === id), [id, weg === "k1" ? "STATIONEN_K1" : "STATIONEN_K5"]);
    await p.evaluate((n) => __mathe.starte(n), nr); await p.waitForTimeout(150);
    let passt = true;
    for (let i = 0; i < 10; i++) {
      if (!(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))) passt = false;
      if (i === 0 && BILDER) await p.screenshot({ path: `${BILDER}/mathe15-${id}-${art}.png` });
      await tippe(p); await p.waitForTimeout(1050);
    }
    await p.waitForSelector("#ende-ansicht:not([hidden])", { timeout: 4000 });
    const sterne = await p.evaluate(([id, weg]) => (Spielwelt.lade("mathe")[weg] || {})[id], [id, weg]);
    await p.click("text=Zum Matheweg"); await p.waitForTimeout(200);
    return { sterne, passt };
  }

  for (const [stufe, weg, neu, anzahl, ersteJeLb] of [["1", "k1", NEU1, 19, ["k1wuerfel", "k1muster", "k1geld", "k1daten"]], ["5", "k5", NEU5, 16, ["k5fit", "k5komma", "k5koordinaten", "k5mittel"]]]) {
    const { ctx, p } = await kind(stufe);
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForSelector("#karte .station");
    const ids = await p.evaluate((w) => Mathe[w].map(s => s.id), weg === "k1" ? "STATIONEN_K1" : "STATIONEN_K5");
    let o = await offen(p);
    erwarte(o.length === anzahl && ersteJeLb.every(id => o[ids.indexOf(id)]) && !o[ids.indexOf(neu[0])],
      `Kl. ${stufe}: ${anzahl} Stationen, die erste Station jedes Lernbereichs ist offen (${ersteJeLb.join(", ")}), neue Stationen noch zu`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/mathe15-weg-${weg}.png` });
    for (const id of neu) {
      const r = await spiele(p, id, "quer", weg);
      erwarte(r.sterne === 3 && r.passt, `Kl. ${stufe} quer: „${id}“ – 10 Aufgaben über die Tasten gelöst, 3 Sterne, keine Scrollleiste (${r.sterne} Sterne, passt ${r.passt})`);
    }
    if (weg === "k5") {
      // Urkunde: nur die ursprünglichen 10 Stationen geschafft → Urkunde trotzdem erreichbar
      await p.evaluate(() => { const d = Spielwelt.lade("mathe") || {}; d.k5 = {}; Mathe.STATIONEN_K5.filter(s => !s.zusatz).forEach(s => { d.k5[s.id] = 2; }); Spielwelt.speichere("mathe", d); });
      await p.reload(); await p.waitForSelector("#urkunde-ziel");
      const zu = await p.evaluate(() => document.getElementById("urkunde-ziel").classList.contains("zu"));
      await p.click("#urkunde-ziel"); await p.waitForTimeout(300);
      const u = await p.evaluate(() => { const x = document.getElementById("urkunde"); return x ? x.textContent : ""; });
      erwarte(!zu && /Übergang 5: 10 von 16/.test(u), `Urkunde „Fit für Klasse 5“ bleibt mit den ursprünglichen 10 Stationen erreichbar (${(u.match(/Übergang 5: [^,]*/) || [""])[0]})`);
      await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300);
      if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
      await p.waitForSelector(".lp-punkte");
      const ue = await p.evaluate(() => document.querySelectorAll("li[data-punkt^='sn.ue5']").length);
      erwarte(ue === 15, `Elternbereich Stufe 5: 15 Übergangs-Punkte Mathe (${ue})`);
      if (BILDER) { await p.evaluate(() => { const li = document.querySelector("li[data-punkt^='sn.ue5']"); li.closest("details").open = true; li.scrollIntoView(); }); await p.screenshot({ path: `${BILDER}/mathe15-eltern-ue5.png` }); }
    } else {
      await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300);
      if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
      await p.waitForSelector(".lp-punkte");
      const lp = await p.evaluate(() => document.querySelectorAll("li[data-punkt^='sn.ma12']").length);
      erwarte(lp === 52, `Elternbereich Kl. 1: 52 Mathe-Inhaltspunkte Kl. 1/2 zum Aufklappen (${lp})`);
      if (BILDER) { await p.evaluate(() => { document.querySelectorAll(".lp-punkte").forEach(d => d.open = true); document.querySelector(".lp-punkte").scrollIntoView(); }); await p.screenshot({ path: `${BILDER}/mathe15-eltern.png` }); }
    }
    await ctx.close();
  }
  // Hochformat: einige neue Stationen auf dem Handy
  for (const [stufe, weg, liste] of [["1", "k1", ["k1zahlen20", "k1plus20", "k1messen", "k1daten"]], ["5", "k5", ["k5grosszahl", "k5geometrie", "k5raum"]]]) {
    const { ctx, p } = await kind(stufe, 390, 760);
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForSelector("#karte .station");
    for (const id of liste) { const r = await spiele(p, id, "hoch", weg); erwarte(r.sterne === 3 && r.passt, `hoch: „${id}“ – 3 Sterne, keine Scrollleiste (${r.sterne}, ${r.passt})`); }
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Mathe-Kl.-1/Übergang-5-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
