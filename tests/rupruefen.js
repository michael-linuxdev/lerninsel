// Test Prüfliste Russisch (10.11.2026): spiele/eltern/russisch-pruefen.html zeigt alle gesammelten russischen Entwürfe (quellen/ru-sammeln.js)
// nach Bereichen, „Hilfe und Gefühle“ zuerst; echt ✓ und ✗ mit Korrektur getippt, Suche, Ergebnistext mit Korrektur und bestätigtem Schlüssel,
// Haken bleiben nach Neuladen; Link im Elternbereich nur mit Hilfesprache Russisch; Handy ohne Scrollleiste. Aufruf: sh tests/laufen.sh rupruefen
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  async function kind(sprache, breite = 1180, hoehe = 820) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__elternAlle = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); if (sprache) await p.selectOption("#e-sprache", sprache);
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  // Elternbereich: Link nur mit Hilfesprache Russisch
  for (const [spr, soll] of [["ru", true], ["", false]]) {
    const { ctx, p } = await kind(spr);
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(400); if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(400); }
    erwarte((await p.$("#ru-pruefen")) ? soll : !soll, `Elternbereich ${spr ? "mit" : "ohne"} Hilfesprache Russisch: Link „Russisch prüfen lassen“ ${soll ? "da" : "nicht da"}`);
    if (soll) { await p.click("#ru-pruefen"); await p.waitForURL(/russisch-pruefen/); erwarte(true, "Link öffnet die Prüfliste"); }
    await ctx.close();
  }
  {
    const { ctx, p } = await kind("ru");
    await p.goto(BASIS + "spiele/eltern/russisch-pruefen.html"); await p.waitForTimeout(500);
    const g = await p.evaluate(() => ({ g: __ruPruefen.gruppen(), n: __ruPruefen.anzahl() }));
    erwarte(g.n > 5000 && g.g[0].id === "hilfe" && g.g.length >= 8 && g.g.reduce((a, x) => a + x.n, 0) === g.n, `Prüfliste: ${g.n} russische Texte in ${g.g.length} Bereichen, „Hilfe und Gefühle“ zuerst`);
    // Hilfe-Bereich öffnen, Eintrag mit 116 111 suchen
    await p.fill("#suche", "116 111"); await p.waitForTimeout(500);
    const k116 = await p.evaluate(() => { const e = [...document.querySelectorAll('details[data-gruppe="hilfe"] .eintrag')].find(x => /116 111/.test(x.textContent)); return e && e.dataset.k; });
    erwarte(!!k116, "Hilfe-Bereich enthält den Hinweis auf 116 111");
    if (k116) await p.click(`.eintrag[data-k="${k116}"] .ok`);
    // zweiten Eintrag als falsch markieren und korrigieren
    await p.fill("#suche", ""); await p.waitForTimeout(500);
    if (!(await p.evaluate(() => document.querySelector('details[data-gruppe="hilfe"]').open))) await p.click('details[data-gruppe="hilfe"] > summary');
    await p.waitForTimeout(200);
    const k2 = await p.evaluate((k) => [...document.querySelectorAll('details[data-gruppe="hilfe"] .eintrag')].find(x => x.dataset.k !== k).dataset.k, k116);
    await p.click(`.eintrag[data-k="${k2}"] .nein`); await p.fill(`.eintrag[data-k="${k2}"] input`, "Лучше так"); await p.fill("#pruefer", "AB");
    const t = await p.evaluate(() => __ruPruefen.text());
    erwarte(/Geprüft von: AB/.test(t) && /„Лучше так“/.test(t) && t.includes(k116) && /Geprüft: 2 von/.test(t), "Ergebnistext: Prüfer, Korrektur, bestätigter Schlüssel, Zählung");
    if (BILDER) await p.screenshot({ path: `${BILDER}/rupruefen.png` });
    // Suche
    await p.fill("#suche", "Тильда"); await p.waitForTimeout(500);
    const s = await p.evaluate(() => [...document.querySelectorAll(".eintrag .ru")].map(x => x.textContent));
    erwarte(s.length > 0 && s.every(x => /Тильда/i.test(x)), `Suche „Тильда“ findet nur passende Einträge (${s.length})`);
    // Neu laden: Haken bleiben
    await p.reload(); await p.waitForTimeout(400);
    erwarte(/2 von/.test(await p.textContent("#zahl")), "nach dem Neuladen bleiben die Haken (2 geprüft)");
    await ctx.close();
  }
  {
    const { ctx, p } = await kind("ru", 390, 760);
    await p.goto(BASIS + "spiele/eltern/russisch-pruefen.html"); await p.waitForTimeout(500);
    await p.click('details[data-gruppe="insel"] > summary'); await p.waitForTimeout(200);
    erwarte(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1 && document.querySelectorAll('details[data-gruppe="insel"] .eintrag').length === 40), "Handy: keine Scrollleiste, 40 Einträge je Seite");
    await p.click('details[data-gruppe="insel"] [data-mehr]'); await p.waitForTimeout(150);
    erwarte(await p.evaluate(() => document.querySelectorAll('details[data-gruppe="insel"] .eintrag').length === 80), "„Weitere zeigen“ lädt die nächsten 40");
    if (BILDER) await p.screenshot({ path: `${BILDER}/rupruefen-handy.png` });
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Prüfliste-Russisch-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
