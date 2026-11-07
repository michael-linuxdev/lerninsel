// Playwright-Test (04.11.2026): Wörter-Angeln an Fipsis Angelsteg (NA-61) – zu bis Kapitel 2, eine ganze Runde echt geangelt (Fisch antippen,
// Artikel-Eimer wählen; ein Fehler mit Tipp „Sprich es laut“, zweimal falsch = Lösung und der Fisch kommt am Ende wieder), Sterne nur für neue
// Wörter beim ersten Versuch und höchstens 3 am Tag, am nächsten Tag wieder, Wörter passend zur Klasse, Handy ohne Querscrollen, Ort auf der Insel.
// Aufruf: sh tests/laufen.sh angeln   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo/;
const TAG = (d) => new Date(2026, 9, d, 15, 0).getTime();
process.on("unhandledRejection", (e) => { console.log("❌ Abbruch: " + e.message + "\n  " + (global.__fehler || []).join("\n  ")); process.exit(1); });

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const fehler = global.__fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true });
  await ctx.addInitScript((t) => { let x = null; try { x = localStorage.getItem("__testJetzt"); } catch (e) { /* egal */ } window.__jetzt = x ? +x : t; window.__testSchnell = true; }, TAG(1));
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`Seitenfehler: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`Konsole: ${m.text()}`); });
  const angeln = async () => { await p.goto(BASIS + "spiele/angeln/"); await p.waitForLoadState("load"); await p.waitForTimeout(300); };
  const sterne = () => p.evaluate(() => Spielwelt.sterne());
  const fertig = () => p.waitForFunction(() => !document.getElementById("teich").hidden || !document.getElementById("ende").hidden, null, { timeout: 10000 });

  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
  await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "1"); await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(500);
  // Lernen zählt: damit „Erst lernen“ die Seite nicht sperrt
  await p.evaluate(() => { for (let i = 0; i < 12; i++) Zeit.aufgabe(); });

  // 1) vor Kapitel 2 zu
  await angeln();
  erwarte(await p.isVisible("#zu") && !(await p.isVisible("#teich")), "vor Kapitel 2 ist der Angelsteg zu");

  // 2) Kapitel 2: eine Runde echt angeln
  await p.evaluate(() => Story.setzeKapitel(2));
  await angeln();
  const start = await p.evaluate(() => ({ n: document.querySelectorAll("#teich .fisch").length, liste: __angeln.lauf.liste.map(w => ({ id: w.id, a: w.artikel, st: w.stufe })) }));
  erwarte(start.n === 3 && start.liste.length === 8 && start.liste.every(w => ["der", "die", "das"].includes(w.a)), "Kapitel 2: drei Fische im Teich, Runde mit 8 Wörtern und Artikel");
  erwarte(start.liste.every(w => !w.st || w.st.includes("1")), "Wörter passen zur Klasse 1");
  await (BILDER && p.screenshot({ path: `${BILDER}/angeln-teich.png` }));
  const s0 = await sterne();
  const falsch = (a) => ["der", "die", "das"].find(x => x !== a);
  let runde = 0;
  while (await p.isVisible("#teich") && runde < 20) {
    runde++;
    await p.click("#teich .fisch >> nth=0", { force: true }); await p.waitForSelector("#karte:not([hidden])");
    const a = await p.evaluate(() => __angeln.lauf.liste[__angeln.lauf.pos].artikel);
    if (runde === 1) {
      await p.click(`#eimer [data-a="${falsch(a)}"]`); await p.waitForTimeout(80);
      erwarte(await p.evaluate(() => /Sprich es laut/.test(document.getElementById("hinweis").textContent)), "erster Fehler: Tipp „Sprich es laut: der …? die …? das …?“");
      await (BILDER && p.screenshot({ path: `${BILDER}/angeln-eimer.png` }));
    }
    if (runde === 2) {
      const [f1, f2] = ["der", "die", "das"].filter(x => x !== a);
      await p.click(`#eimer [data-a="${f1}"]`); await p.waitForTimeout(80); await p.click(`#eimer [data-a="${f2}"]`); await p.waitForTimeout(80);
      erwarte(await p.evaluate(() => /Es heißt:/.test(document.getElementById("hinweis").textContent) && __angeln.lauf.wieder.length === 1), "zweimal falsch: Lösung gezeigt, der Fisch kommt am Ende der Runde wieder");
      await p.waitForSelector("#karte[hidden]", { state: "attached" }); await fertig(); continue;
    }
    await p.click(`#eimer [data-a="${a}"]`); await p.waitForSelector("#karte[hidden]", { state: "attached" }); await fertig();
  }
  const e = await p.evaluate(() => ({ ende: !document.getElementById("ende").hidden, fang: document.querySelectorAll("#ende .eimer-liste > span").length, d: __angeln.daten() }));
  const s1 = await sterne();
  erwarte(e.ende && e.fang === 8, `Runde zu Ende: 8 Fische im Eimer (${e.fang}), ${runde} Fische angetippt`);
  erwarte(s1 - s0 === 3 && Object.values(e.d.neu)[0] === 3, `Sterne nur für neue Wörter beim ersten Versuch, höchstens 3 am Tag (+${s1 - s0})`);
  await (BILDER && p.screenshot({ path: `${BILDER}/angeln-ende.png` }));

  // 3) zweite Runde am selben Tag: keine weiteren Sterne; am nächsten Tag wieder
  await p.click("#nochmal"); await p.waitForTimeout(200);
  const spiele = async () => { let n = 0; while (await p.isVisible("#teich") && n < 20) { n++; await p.click("#teich .fisch >> nth=0", { force: true }); await p.waitForSelector("#karte:not([hidden])");
    const a = await p.evaluate(() => __angeln.lauf.liste[__angeln.lauf.pos].artikel); await p.click(`#eimer [data-a="${a}"]`); await p.waitForSelector("#karte[hidden]", { state: "attached" }); await fertig(); } };
  await spiele();
  erwarte(await sterne() === s1, "zweite Runde am selben Tag: keine weiteren Sterne");
  await p.evaluate((t) => localStorage.setItem("__testJetzt", String(t)), TAG(2));
  await angeln(); await spiele();
  erwarte(await sterne() === s1 + 3, "nächster Tag: wieder bis zu 3 Sterne für neue Wörter");

  // 4) Handy: kein Querscrollen
  await p.setViewportSize({ width: 390, height: 760 }); await angeln();
  erwarte(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Handy 390 × 760: kein Querscrollen");
  await p.click("#teich .fisch >> nth=0", { force: true }); await p.waitForTimeout(120);
  erwarte(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1 && document.querySelectorAll("#eimer button").length === 3), "Handy: drei Eimer passen nebeneinander");
  await (BILDER && p.screenshot({ path: `${BILDER}/angeln-handy.png` }));
  await p.setViewportSize({ width: 1180, height: 820 });

  // 5) Insel: Schatz-Strand führt zum Angelsteg
  await p.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.lektionen = Object.assign({}, m.lektionen, { bedienung: 3 }); Spielwelt.speichere("medien", m); });
  await p.goto(BASIS + "spiele/welt3d/heimat.html?stunde=14"); await p.waitForFunction(() => window.InselKern, null, { timeout: 60000 });
  const insel = await p.evaluate(() => { const a = InselKern.antwort("truhe"); return { ziel: a.blase[4], text: a.blase[2], knopf: InselKern.aktionFuer("truhe")[0][1] }; });
  erwarte(insel.ziel === "../angeln/" && insel.knopf === "Angeln", `Insel: Schatz-Strand führt zu Fipsis Angelsteg („${insel.text}“)`);

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Angeln-Test bestanden.");
})();
