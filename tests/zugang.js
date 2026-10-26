// Playwright-Test (NA-12): Insel-Zugang – erste Lektion „Das Tablet bedienen“ öffnet die Insel,
// Elternschalter für die alte Regel (kompletter Führerschein), Minispiele weiter erst mit komplettem Führerschein.
// Aufruf: sh tests/laufen.sh zugang
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true });
  await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
  const insel = async () => { await p.goto(BASIS + "spiele/welt3d/heimat.html?stunde=14"); await p.waitForTimeout(1500); return /heimat\.html/.test(p.url()); };
  const medien = (f) => p.evaluate(f);

  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
  await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));

  // 1) Ohne Lektion: Insel zu, Robo Pixel erklärt die erste Lektion
  await p.goto(BASIS); await p.waitForTimeout(400);
  const start = await p.evaluate(() => ({ zu: document.getElementById("tuer-insel").classList.contains("zu"), text: document.getElementById("tuer-insel").querySelector("p").textContent }));
  erwarte(start.zu && /erste Lektion/.test(start.text), "ohne Lektion ist die Insel zu (Hinweis auf die erste Lektion)");
  erwarte(!(await insel()), "Insel-Seite leitet ohne Lektion zu Robo Pixel um");

  // 2) Erste Lektion geschafft: Insel offen (mit Prolog), Minispiele noch zu
  await p.goto(BASIS); await medien(() => { const m = Spielwelt.lade("medien") || {}; m.lektionen = { bedienung: 2 }; Spielwelt.speichere("medien", m); });
  erwarte(await insel(), "nach „Das Tablet bedienen“ öffnet sich die Insel");
  erwarte(await p.evaluate(() => !!(window.__szene && __szene.aktuell() && __szene.aktuell().id === "prolog")), "erster Besuch beginnt mit der Ankunft");
  await p.goto(BASIS + "spiele/welt3d/ballons.html"); await p.waitForTimeout(1200);
  erwarte(/heimat\.html/.test(p.url()), "Minispiel ohne kompletten Führerschein führt zurück auf die Insel");
  await p.goto(BASIS); await p.waitForTimeout(300);
  erwarte(await p.evaluate(() => !document.getElementById("tuer-insel").classList.contains("zu")), "Startseite: Inseltür offen");

  // 3) Eltern wählen die alte Regel → Insel wieder zu
  await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300);
  if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
  await p.check("#i-zugang"); await p.click("#i-speichern"); await p.waitForTimeout(200);
  erwarte(await p.evaluate(() => Spielwelt.inselRegel() === "fuehrerschein"), "Elternschalter speichert die alte Regel");
  erwarte(!(await insel()), "alte Regel: nur „Bedienung“ reicht nicht");

  // 4) Kompletter Führerschein: Insel und Minispiele offen, bei beiden Regeln
  await p.goto(BASIS); await medien(() => { const m = Spielwelt.lade("medien"); m.fuehrerschein = "2026-10-20"; Spielwelt.speichere("medien", m); });
  erwarte(await insel(), "alte Regel + kompletter Führerschein: Insel offen");
  await p.goto(BASIS + "spiele/welt3d/ballons.html"); await p.waitForTimeout(1500);
  erwarte(/ballons\.html/.test(p.url()), "kompletter Führerschein: Minispiel offen");
  await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300);
  if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
  await p.uncheck("#i-zugang"); await p.click("#i-speichern"); await p.waitForTimeout(200);
  erwarte(await insel(), "neue Regel + kompletter Führerschein: Insel offen (bestehende Kinder merken nichts)");

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Zugangs-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
