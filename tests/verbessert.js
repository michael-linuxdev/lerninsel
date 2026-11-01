// Playwright-Test (01.11.2026): Verbesserungen an Schach (Bauern-Rennen, Tipp), Gefühle (Hilfe-Karte mit 116 111), Duell (Rückblick), Atelier (Spiegel-Malen).
// Aufruf: sh tests/laufen.sh verbessert
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo/;
process.on("unhandledRejection", (e) => { console.log("❌ Abbruch: " + e.message + "\n  " + (global.__fehler || []).join("\n  ")); process.exit(1); });

(async () => {
  const browser = await chromium.launch();
  const fehler = global.__fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true });
  await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`Seitenfehler: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`Konsole: ${m.text()}`); });
  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
  await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(500);
  await p.evaluate(() => { for (let i = 0; i < 30; i++) Zeit.aufgabe(); });   // Spielzeit für Spiel-Seiten
  const feld = (n) => (8 - +n[1]) * 8 + (n.charCodeAt(0) - 97);

  // ---------- Schach: Bauern-Rennen ----------
  await p.goto(BASIS + "spiele/schach/"); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.click("#rennen"); await p.waitForTimeout(200);
  const start = await p.evaluate(() => __schach.brett.join(""));
  erwarte(/^[.p]+$/i.test(start) && (start.match(/P/g) || []).length === 8 && (start.match(/p/g) || []).length === 8, "Bauern-Rennen: nur je 8 Bauern auf dem Brett");
  erwarte(await p.isVisible("#tipp"), "Tipp-Knopf sichtbar");
  // echter Zug per Antippen: e2 → e4, Tilda antwortet
  await p.click(`.f[data-i="${feld("e2")}"]`); await p.click(`.f[data-i="${feld("e4")}"]`); await p.waitForTimeout(700);
  const nach = await p.evaluate(() => __schach.brett.join(""));
  erwarte(nach !== start && (nach.match(/p/g) || []).length >= 7, "Zug e2–e4 gespielt, Tilda hat geantwortet");
  // Tipp zeigt einen Zug (grünes Feld)
  await p.click("#tipp"); await p.waitForTimeout(150);
  erwarte(await p.$(".f.ziel, .f.schlag") !== null && /nach/.test(await p.textContent("#tilda-text")), "Tipp: Tilda zeigt einen Zug auf dem Brett");
  // Sieg: Bauer kurz vor dem Ziel, echt antippen
  await p.evaluate(() => __schach.stellung("wPa7 bPh7 bPg7"));
  const s0 = await p.evaluate(() => Spielwelt.sterne());
  await p.click(`.f[data-i="${feld("a7")}"]`); await p.click(`.f[data-i="${feld("a8")}"]`); await p.waitForTimeout(300);
  const sieg = await p.evaluate(() => ({ d: Spielwelt.lade("schach"), sterne: Spielwelt.sterne(), text: document.getElementById("tilda-text").textContent, weiter: !document.getElementById("nochmal").hidden }));
  erwarte(sieg.d.rennen === 1 && sieg.sterne >= s0 + 1 && /Stern/.test(sieg.text) && sieg.weiter, `Bauern-Rennen gewonnen: Stern und „Nochmal“ (${sieg.text})`);
  await p.click("#nochmal"); await p.waitForTimeout(150); await p.evaluate(() => __schach.stellung("wPb7 bPh7")); await p.click(`.f[data-i="${feld("b7")}"]`); await p.click(`.f[data-i="${feld("b8")}"]`); await p.waitForTimeout(300);
  erwarte(!/Stern/.test(await p.textContent("#tilda-text")) && (await p.evaluate(() => Spielwelt.lade("schach").rennen)) === 2, "zweiter Sieg: kein neuer Stern");
  // Tipp auch gegen Tilda
  await p.click("#zurueck"); await p.click('[data-ki="1"]'); await p.waitForTimeout(150); await p.click("#tipp"); await p.waitForTimeout(400);
  erwarte(await p.$(".f.ziel, .f.schlag") !== null, "Tipp im Spiel gegen Tilda");

  // ---------- Gefühle: Hilfe-Karte ----------
  await p.goto(BASIS + "spiele/gefuehle/"); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  const karte = await p.textContent("#hilfe-karte");
  erwarte(/116 111/.test(karte) && /vertraust/.test(karte) && /Körper gehört dir/.test(karte), "Hilfe-Karte: Vertrauensperson, Nummer gegen Kummer 116 111, „Dein Körper gehört dir“");
  await p.click('[data-oeffne="barometer"]'); await p.waitForTimeout(200);
  await p.click('.face[data-g="traurig"]'); await p.waitForTimeout(150);
  erwarte(await p.isVisible("#hilfe-kurz"), "traurig: Hinweis auf 116 111 bei Brunis Antwort");
  await p.click('.face[data-g="froh"]'); await p.waitForTimeout(150);
  erwarte(!(await p.isVisible("#hilfe-kurz")), "froh: kein Hinweis");

  // ---------- Duell: Rückblick ----------
  await p.goto(BASIS + "spiele/familie/duell.html"); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.click("#los"); await p.waitForTimeout(100);
  const falsch = await p.evaluate(() => __duell.spieler.kind.a.t);
  await p.evaluate(() => __duell.antworte("kind", false)); await p.waitForTimeout(1100);
  for (let i = 0; i < 10; i++) { await p.evaluate(() => __duell.antworte("kind", true)); await p.waitForTimeout(30); }
  await p.waitForSelector("#ende:not([hidden])");
  const rb = await p.textContent("#rueckblick");
  erwarte(await p.isVisible("#rueckblick") && rb.includes(falsch) && /=/.test(rb), `Rückblick zeigt die falsch beantwortete Aufgabe (${falsch})`);
  await p.click("#nochmal"); await p.waitForTimeout(100); for (let i = 0; i < 10; i++) { await p.evaluate(() => __duell.antworte("kind", true)); await p.waitForTimeout(30); }
  await p.waitForSelector("#ende:not([hidden])");
  erwarte(!(await p.isVisible("#rueckblick")), "ohne Fehler: kein Rückblick");

  // ---------- Atelier: Spiegel-Malen ----------
  await p.goto(BASIS + "spiele/atelier/"); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.click("#frei-malen"); await p.waitForTimeout(400);
  await p.click("#spiegeln"); await p.waitForTimeout(100);
  erwarte(await p.evaluate(() => __atelier.spiegel()) && await p.$("#rahmen.spiegel") !== null, "Spiegeln an: Mittellinie sichtbar");
  const r = await p.$eval("#leinwand", el => { const b = el.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; });
  await p.mouse.move(r.x + r.w * 0.15, r.y + r.h * 0.4); await p.mouse.down(); await p.mouse.move(r.x + r.w * 0.2, r.y + r.h * 0.5, { steps: 6 }); await p.mouse.up();
  const px = await p.evaluate(() => { const g = __atelier.g, W = g.canvas.width, H = g.canvas.height; const a = g.getImageData(Math.round(W * 0.15), Math.round(H * 0.4), 1, 1).data, b = g.getImageData(Math.round(W * 0.85), Math.round(H * 0.4), 1, 1).data; return [a[0] + a[1] + a[2], b[0] + b[1] + b[2]]; });
  erwarte(px[0] < 700 && px[1] < 700, `Strich links erscheint gespiegelt rechts (Helligkeit ${px.join(" / ")})`);

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n  " + fehler.join("\n  ")); process.exit(1); }
  console.log("✅ Verbesserungs-Test bestanden.");
})();
