// Playwright-Test (NA-13): Tutorial E2 „Erst lernen“ (Sonnenuhr), Szene „Sonne geht auf“, E3 „Erste Frucht“ mit Nebelrand.
// Aufruf: sh tests/laufen.sh tutorial   (Screenshots mit BILDER=<ordner>)
// Die Uhr wird über localStorage "__testJetzt" gesetzt, damit der Test Tage vorstellen kann.
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const TAG1 = new Date(2026, 9, 25, 15, 0).getTime(), TAG2 = new Date(2026, 9, 26, 15, 0).getTime();

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true });
  await ctx.addInitScript((t) => { let x = null; try { x = localStorage.getItem("__testJetzt"); } catch (e) { /* egal */ } window.__jetzt = x ? +x : t; }, TAG1);
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
  const INSEL = BASIS + "spiele/welt3d/heimat.html?stunde=14";
  const szene = () => p.evaluate(() => window.__szene && __szene.aktuell());
  const warteSzene = (id) => p.waitForFunction((id) => window.__szene && __szene.aktuell() && __szene.aktuell().id === id, id, { timeout: 15000 });
  const durch = async () => { for (let i = 0; i < 6 && await szene(); i++) { await p.click("#szene-weiter", { force: true }); await p.waitForTimeout(300); } };

  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
  await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
  await p.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.lektionen = { bedienung: 3 }; Spielwelt.speichere("medien", m); Story.etappeFertig("E1"); });

  // 1) Tag 1, noch nichts gelernt: „Erst lernen“ – Sonnenuhr dunkel, Nebel dicht
  await p.goto(INSEL); await warteSzene("erst-lernen");
  let a = await szene();
  const zu = await p.evaluate(() => ({ uhr: __heimat.sonnenuhr(), nebel: __heimat.nebel() }));
  erwarte(a.zeigt && !zu.uhr.spielen && zu.uhr.hell < 0.2, `E2: Pixel zeigt auf die dunkle Sonnenuhr (hell ${zu.uhr.hell})`);
  erwarte(zu.nebel.stufe === 0 && zu.nebel.band > 0 && zu.nebel.far <= 44, `Nebel am Anfang dicht (Stufe ${zu.nebel.stufe}, Sicht bis ${zu.nebel.far})`);
  await bild(p, "tutorial-e2");
  await durch();
  erwarte(await p.evaluate(() => Story.etappe("E2")), "E2 ist danach erledigt");
  // Sonnenuhr antippen
  await p.evaluate(() => { const s = __heimat.su; __heimat.ich.position.set(s.x - 0.2, 0.25, s.z - 1.1); });
  await p.waitForTimeout(800);
  erwarte(await p.evaluate(() => __heimat.aktion === "Ansehen"), "an der Sonnenuhr zeigt der Aktionsknopf „Ansehen“");
  await p.evaluate(() => __heimat.druecke()); await p.waitForTimeout(300);
  erwarte(await p.evaluate(() => /Sonnenuhr/.test(document.getElementById("blase-titel").textContent) && /Prozent/.test(document.getElementById("blase-text").textContent)), "Sonnenuhr erklärt, wie viel schon geschafft ist");

  // 2) Gelernt (8 Aufgaben) und ein Lernfund: Sonne geht auf; E3 wartet bis morgen (höchstens 2 neue Etappen am Tag)
  await p.evaluate(() => { for (let i = 0; i < 12; i++) Zeit.aufgabe(); Lernfunde.merke({ fach: "mathe", art: "gemeistert", text: "7 + 8 = 15", schluessel: "t:7+8" }); });
  await p.goto(INSEL); await warteSzene("sonne");
  const auf = await p.evaluate(() => __heimat.sonnenuhr());
  erwarte(auf.spielen && auf.hell === 1, "mit Spielzeit ist die Sonne aufgegangen");
  await bild(p, "tutorial-sonne");
  await durch(); await p.waitForTimeout(2500);
  const nachSonne = await p.evaluate(() => ({ e3: Story.etappe("E3"), szene: __szene.aktuell(), neu: Story.neuHeute(), nebel: __heimat.nebel().stufe }));
  erwarte(!nachSonne.e3 && !nachSonne.szene && nachSonne.neu === 2, "E3 kommt nicht mehr am selben Tag (schon 2 neue Etappen)");
  erwarte(nachSonne.nebel === 0, "Nebel bleibt, bis Ella den Wissensbaum erklärt hat");

  // 3) Tag 2: Ella zeigt die erste Frucht, Kapitel 1 beginnt, der Nebel weicht
  await p.evaluate((t) => localStorage.setItem("__testJetzt", String(t)), TAG2);
  await p.goto(INSEL); await warteSzene("erste-frucht");
  a = await szene();
  erwarte(a.wer === "eule" && a.zeigt, "E3: Ella zeigt auf den Wissensbaum");
  await bild(p, "tutorial-e3-vorher");
  await p.click("#szene-weiter", { force: true }); await p.waitForTimeout(300);
  await p.click("#szene-weiter", { force: true }); await p.waitForTimeout(3600);
  const weicht = await p.evaluate(() => ({ kapitel: Story.kapitel(), nebel: __heimat.nebel() }));
  erwarte(weicht.kapitel === 1 && weicht.nebel.stufe === 1 && weicht.nebel.far > 44, `Kapitel 1, Nebel weicht (Stufe ${weicht.nebel.stufe}, Sicht bis ${weicht.nebel.far})`);
  await bild(p, "tutorial-e3-nachher");
  await durch();
  const ende = await p.evaluate(() => ({ e3: Story.etappe("E3"), chronik: Story.chronik().map(x => x.s) }));
  erwarte(ende.e3 && ["prolog", "erst-lernen", "sonne", "erste-frucht"].every(x => x === "prolog" || ende.chronik.includes(x)), `E3 erledigt, Chronik: ${ende.chronik.join(", ")}`);
  await p.goto(INSEL); await p.waitForTimeout(2500);
  erwarte(!(await szene()), "danach keine Szene mehr bei jedem Besuch");
  const zeichen = await p.evaluate(() => __heimat.zeichnungen());
  console.log(`    Zeichenaufrufe Insel („schön“, Nebel Stufe 1): ${zeichen}`);

  // 4) Kind von früher (kompletter Führerschein, schon Lernfunde): keine Tutorial-Szenen, kein Nebel aus Versehen
  await p.evaluate(() => { const k = Spielwelt.vorsilbe + "profil.v1", pr = JSON.parse(localStorage.getItem(k)); delete pr.daten.story; pr.daten.medien.fuehrerschein = "2026-10-01"; pr.stand = Date.now() + 60000; localStorage.setItem(k, JSON.stringify(pr)); });
  await p.goto(INSEL); await p.waitForTimeout(3000);
  const alt = await p.evaluate(() => ({ e: ["E1", "E2", "E3"].map(x => Story.etappe(x)), k: Story.kapitel(), szene: __szene.aktuell(), nebel: __heimat.nebel().stufe }));
  erwarte(alt.e.every(Boolean) && alt.k === 1 && !alt.szene && alt.nebel >= 1, `Kind von früher: E1–E3 erledigt, keine Szene, Nebel-Stufe ${alt.nebel} (${JSON.stringify(alt)})`);

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Tutorial-Test (E2/E3) bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
