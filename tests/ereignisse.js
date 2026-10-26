// Playwright-Test (NA-01): Story-Zustand und Insel-Ereignisse.
// Aufruf: sh tests/laufen.sh ereignisse   (oder BASIS=… node tests/ereignisse.js bei laufendem Server)
// Prüft: Migration alter Spielstand → story mit Kapitel 0; Lernfund → Ereignis auf derselben Seite und
// vorgemerkt im Spielstand; andere Seite holt es ab; QR-Transfer wird höchstens 200 Byte größer.
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true });
  await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
  const fehler = [];
  const seite = async (name) => {
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${name}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${name}: ${m.text()}`); });
    return p;
  };
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };

  // Ersteinrichtung
  const e = await seite("einrichtung");
  await e.goto(BASIS); await e.waitForURL(/eltern/); await e.waitForLoadState("load"); await e.waitForTimeout(300);
  await e.fill("#pin1", "1234"); await e.fill("#pin2", "1234"); await e.click("#pin-ok");
  await e.waitForSelector("#e-name"); await e.fill("#e-name", "Testkind"); await e.click("#e-ok");
  await e.waitForURL(u => !/eltern/.test(u.toString())); await e.close();

  // 1) Alter Spielstand ohne story → nach dem Laden Kapitel 0
  const a = await seite("migration");
  await a.goto(BASIS); await a.waitForTimeout(400);
  await a.evaluate(() => { const k = Spielwelt.vorsilbe + "profil.v1"; const p = JSON.parse(localStorage.getItem(k)); delete p.daten.story; p.stand = Date.now() + 60000; localStorage.setItem(k, JSON.stringify(p)); });
  await a.reload(); await a.waitForTimeout(500);
  const st = await a.evaluate(() => Spielwelt.profil.daten.story);
  erwarte(st && st.kapitel === 0 && Array.isArray(st.chronik) && Array.isArray(st.offen), "alter Spielstand bekommt story mit Kapitel 0");

  // 2) QR-Transfer: mit leerem Story-Zustand höchstens 200 Zeichen mehr als ohne
  const groessen = await a.evaluate(async () => {
    const t = Spielstand._test, mit = Spielwelt.exportiere(), ohne = JSON.parse(JSON.stringify(mit));
    delete ohne.profil.daten.story;
    const laenge = async (o) => (await t.zuTeilen(o)).map(x => x.split(":").slice(4).join(":")).join("").length;
    return { mit: await laenge(mit), ohne: await laenge(ohne) };
  });
  erwarte(groessen.mit - groessen.ohne <= 200, `QR-Daten wachsen um ${groessen.mit - groessen.ohne} Zeichen (≤ 200)`);
  await a.close();

  // 3) Lernfund auf einer Lernseite → Ereignis kommt sofort an und wird für andere Seiten vorgemerkt
  const m = await seite("mathe");
  await m.goto(BASIS + "spiele/mathe/"); await m.waitForTimeout(500);
  const ergebnis = await m.evaluate(() => {
    const da = []; Ereignisse.hoere("fund", (d) => { da.push(d); });
    Lernfunde.merke({ fach: "mathe", art: "gemeistert", text: "7 + 8 = 15", schluessel: "test:7+8" });
    return { da, offen: Ereignisse.offene("fund"), story: Spielwelt.profil.daten.story };
  });
  erwarte(ergebnis.da.length === 1 && ergebnis.da[0].s === "test:7+8", "Zuhörer auf derselben Seite bekommt den Fund");
  erwarte(ergebnis.offen.some(x => x.d.s === "test:7+8"), "Fund ist in story.offen vorgemerkt");
  // Zuhörer, der true zurückgibt, erledigt das Ereignis (wird nicht vorgemerkt)
  const erledigt = await m.evaluate(() => {
    const vorher = Ereignisse.offene("bauwerk").length; Ereignisse.hoere("bauwerk", () => true);
    Ereignisse.melde("bauwerk", { id: "bruecke" }); return Ereignisse.offene("bauwerk").length - vorher;
  });
  erwarte(erledigt === 0, "erledigtes Ereignis wird nicht vorgemerkt");
  await m.close();

  // 4) Andere Seite (Startseite) holt das Ereignis ab
  const s = await seite("start");
  await s.goto(BASIS); await s.waitForTimeout(500);
  const abgeholt = await s.evaluate(() => { const l = Ereignisse.abholen("fund"); return { l, rest: Ereignisse.offene("fund").length }; });
  erwarte(abgeholt.l.some(x => x.d.s === "test:7+8") && abgeholt.rest === 0, "Startseite holt den Fund ab, danach ist die Liste leer");

  // 5) Story: Kapitel nie rückwärts, Etappen und Szenen
  const story = await s.evaluate(() => {
    const r = {};
    r.vor = Story.setzeKapitel(1); r.zurueck = Story.setzeKapitel(0); r.kapitel = Story.kapitel();
    r.e1 = Story.etappeFertig("E1"); r.e1nochmal = Story.etappeFertig("E1");
    Story.merkeSzene("prolog"); Story.merkeSzene("prolog");
    r.chronik = Story.chronik(); r.offen = Ereignisse.offene().map(x => x.a);
    return r;
  });
  erwarte(story.vor && !story.zurueck && story.kapitel === 1, "Kapitel öffnet sich vorwärts, nie rückwärts");
  erwarte(story.e1 && !story.e1nochmal, "Etappe E1 wird genau einmal fertig");
  erwarte(story.chronik.length === 1 && story.chronik[0].s === "prolog" && story.chronik[0].d === "2026-10-25", "Szene steht einmal in der Chronik");
  erwarte(story.offen.includes("kapitel") && story.offen.includes("etappe"), "Kapitel und Etappe werden als Ereignis gemeldet");

  // 6) Höchstens 20 vorgemerkte Ereignisse
  const anzahl = await s.evaluate(() => { for (let i = 0; i < 30; i++) Ereignisse.melde("bild", { id: "b" + i }); return { n: Ereignisse.offene().length, letztes: Ereignisse.offene("bild").pop().d.id }; });
  erwarte(anzahl.n === 20 && anzahl.letztes === "b29", "höchstens 20 vorgemerkte Ereignisse, die neuesten bleiben");
  await s.close();

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Ereignisse-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
