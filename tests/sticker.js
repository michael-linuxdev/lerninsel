// Test Sticker aussuchen (02.11.2026, statt Zufalls-Sticker): Nach 6 gelösten Aufgaben darf das Kind einen Sticker wählen –
// es kommt kein zufälliger Sticker; im Album erscheint die Auswahl nur mit fehlenden Lern-Stickern, echt angetippt klebt genau der
// gewählte Sticker; höchstens 3 Wahlen am Tag; ohne fehlende Sticker gibt es keine Wahl. Keine Konsolenfehler.
// Aufruf: sh tests/laufen.sh sticker
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, serviceWorkers: "block" });
  await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
  await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));

  await p.goto(BASIS + "spiele/mathe/"); await p.waitForTimeout(500);   // Seite mit Charakter und Sticker
  const loese = (n) => p.evaluate((n) => { for (let i = 0; i < n; i++) Charakter.gib("mathe", 1); }, n);
  await loese(5);
  let d = await p.evaluate(() => ({ wahl: Sticker.wahl(), hat: Object.keys(Sticker.daten().hat).length }));
  erwarte(d.wahl === 0 && d.hat === 0, "nach 5 Aufgaben noch keine Wahl");
  await loese(1);
  d = await p.evaluate(() => ({ wahl: Sticker.wahl(), hat: Object.keys(Sticker.daten().hat).length }));
  erwarte(d.wahl === 1 && d.hat === 0, "nach 6 Aufgaben: eine Wahl, aber kein zufälliger Sticker");

  await p.goto(BASIS + "spiele/album/"); await p.waitForTimeout(500);
  const karte = await p.evaluate(() => ({ sichtbar: !document.getElementById("auswahl").hidden, n: document.querySelectorAll("[data-wahl]").length, fehlend: Sticker.fehlend().length }));
  erwarte(karte.sichtbar && karte.n === karte.fehlend && karte.n === 32, `Album zeigt die Auswahl mit allen ${karte.n} fehlenden Lern-Stickern`);
  if (BILDER) await p.screenshot({ path: `${BILDER}/sticker-auswahl.png` });
  await p.click('[data-wahl="rakete"]'); await p.waitForTimeout(300);
  d = await p.evaluate(() => ({ wahl: Sticker.wahl(), hat: Sticker.daten().hat, zu: document.getElementById("auswahl").hidden, an: document.querySelector('.st.hat[data-id="rakete"]') !== null }));
  erwarte(d.wahl === 0 && d.hat.rakete === 1 && Object.keys(d.hat).length === 1 && d.zu && d.an, "Rakete echt angetippt: klebt im Album (Seite Weltall), Auswahl wieder zu");
  if (BILDER) await p.screenshot({ path: `${BILDER}/sticker-gewaehlt.png` });
  erwarte(await p.evaluate(() => Sticker.waehle("wal") === false), "ohne offene Wahl lässt sich kein Sticker nehmen");

  // höchstens 3 am Tag
  await p.goto(BASIS + "spiele/mathe/"); await p.waitForTimeout(400);
  await loese(30);
  erwarte(await p.evaluate(() => Sticker.wahl()) === 2, "am selben Tag höchstens 3 Wahlen (1 genommen + 2 offen)");
  // alle Lern-Sticker da: keine Wahl mehr, keine Doppelten
  await p.evaluate(() => { const x = Sticker.daten(); x.wahl = 0; x.tag = ""; Sticker.fehlend().forEach(id => { x.hat[id] = 1; }); Spielwelt.speichere("sticker", x); });
  await loese(12);
  d = await p.evaluate(() => ({ wahl: Sticker.wahl(), doppelt: Object.values(Sticker.daten().hat).some(n => n > 1) }));
  erwarte(d.wahl === 0 && !d.doppelt, "alle Lern-Sticker gesammelt: keine Wahl, keine Doppelten");

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Sticker-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
