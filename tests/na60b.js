// Playwright-Test (01.11.2026): NA-60 Teil 2 – kürzere Szenen und größere Schrift für Vorschule/Kl. 1 (Blasen mit fuerAeltere fallen weg,
// Blasen mit Hooks bleiben), volle Szenen ab Kl. 2 und für Erwachsene; „Heute für dich“ schlägt nach dem Wiederholen das wackeligste Fach vor.
// Aufruf: sh tests/laufen.sh na60b
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
  await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "1"); await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(500);
  const stufe = (st) => p.evaluate((st) => { const e = Spielwelt.lade("eltern"); e.kind.stufe = st; e.kind.klasse = { vs: 1, "5": 4 }[st] || +st; Spielwelt.speichere("eltern", e); }, st);
  // Szene im Album (lädt alle Szenen) abspielen, Blasen zählen, bis zum Ende klicken
  async function spiele(id) {
    await p.goto(BASIS + "spiele/album/"); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.evaluate((id) => { window.__ende = null; Szene.spiele(id, { chronik: false }).then(r => { window.__ende = r || {}; }); }, id);
    await p.waitForTimeout(200);
    const info = await p.evaluate(() => ({ n: Szene.aktuell().anzahl, jung: document.getElementById("szene").classList.contains("jung"), gr: parseFloat(getComputedStyle(document.querySelector(".szene-text")).fontSize) }));
    for (let i = 0; i < info.n; i++) { await p.click("#szene-weiter", { force: true }); await p.waitForTimeout(250); }
    info.fertig = await p.evaluate(() => !!window.__ende);
    return info;
  }

  const k1 = await spiele("ei");
  erwarte(k1.n === 2 && k1.jung && k1.fertig, `Kl. 1: Ei-Szene mit 2 statt 3 Blasen, größere Schrift (${k1.gr}px), bis zum Ende gespielt`);
  const k1b = await spiele("fipsis-karte");
  erwarte(k1b.n === 3, `Kl. 1: Fipsis Karte mit 3 statt 4 Blasen (${k1b.n})`);
  const k1c = await spiele("erste-frucht");
  erwarte(k1c.n === 3, "Szenen ohne fuerAeltere bleiben vollständig");
  await stufe("vs");
  const vs = await spiele("atelier");
  erwarte(vs.n === 2 && vs.jung, `Vorschule: Atelier-Szene kürzer (${vs.n})`);
  await stufe("3");
  const k3 = await spiele("ei");
  erwarte(k3.n === 3 && !k3.jung && k3.gr < k1.gr, `Kl. 3: volle Szene (3 Blasen), normale Schrift (${k3.gr}px)`);
  await stufe("1"); await p.evaluate(() => Spielwelt.setzeErwachsen(30));
  const erw = await spiele("ei");
  erwarte(erw.n === 3, "Erwachsene sehen immer die ganze Szene");
  await p.evaluate(() => Spielwelt.setzeErwachsen(0));

  // „Heute für dich“ nach dem Wiederholen
  await stufe("2"); await p.goto(BASIS); await p.waitForLoadState("load");
  await p.evaluate(() => {
    const e = Spielwelt.lade("eltern"); e.kind.wiederholt = Spielwelt.schuljahrAm(); Spielwelt.speichere("eltern", e);
    Spielwelt.speichere("koennen", {}); for (let i = 0; i < 3; i++) Koennen.melde(["de.le.02"], false);
    for (let i = 0; i < 12; i++) Koennen.melde(["ma.zo.03"], true);
  });
  await p.goto(BASIS); await p.waitForLoadState("load"); await p.waitForTimeout(500);
  const h = await p.evaluate(() => { const el = document.getElementById("heute-fuer-dich"); return { t: el.textContent, href: el.getAttribute("href"), sichtbar: !el.hidden }; });
  erwarte(h.sichtbar && /Deutsch: üben, was noch wackelt/.test(h.t) && h.href === "spiele/deutsch/", `Wiederholer: „Heute für dich“ schlägt Deutsch vor (${h.t})`);
  await p.evaluate(() => { const e = Spielwelt.lade("eltern"); delete e.kind.wiederholt; Spielwelt.speichere("eltern", e); });
  await p.goto(BASIS); await p.waitForLoadState("load"); await p.waitForTimeout(500);
  erwarte(!/wackelt/.test(await p.textContent("#heute-fuer-dich")), "ohne Wiederholen: kein Wackel-Vorschlag");

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n  " + fehler.join("\n  ")); process.exit(1); }
  console.log("✅ NA-60-Teil-2-Test bestanden.");
})();
