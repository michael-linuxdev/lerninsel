// Playwright-Test (01.11.2026): Tierpflege-Station – zu bis Kapitel 2, alle Tiere je Klasse echt versorgt (Futter, Pflege, Zuhause, mit einem Fehler),
// Ruhen über Nacht, Auswildern am nächsten Tag, Sonderfall Rehkitz (liegen lassen), Stern nur fürs erste Mal je Tier, das eigene Tier hilft mit,
// nichts verfällt nach Tagen ohne Besuch, Ort auf der Insel.
// Aufruf: sh tests/laufen.sh tierstation   (Screenshots mit BILDER=<ordner>)
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
  await ctx.addInitScript((t) => { let x = null; try { x = localStorage.getItem("__testJetzt"); } catch (e) { /* egal */ } window.__jetzt = x ? +x : t; }, TAG(1));
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`Seitenfehler: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`Konsole: ${m.text()}`); });
  let tagNr = 1;
  const naechsterTag = async () => { tagNr++; await p.evaluate((t) => localStorage.setItem("__testJetzt", String(t)), TAG(tagNr)); };
  const station = async () => { await p.goto(BASIS + "spiele/tierstation/"); await p.waitForLoadState("load"); await p.waitForTimeout(250); };
  const stufe = (st) => p.evaluate((st) => { const e = Spielwelt.lade("eltern"); e.kind.stufe = st; e.kind.klasse = { vs: 1 }[st] || +st; Spielwelt.speichere("eltern", e); }, st);
  // eine Frage beantworten (falsch = erst eine falsche Antwort)
  const antworte = async (falsch) => {
    if (falsch) { await p.click('[data-antwort]:not([data-antwort="0"])'); await p.waitForTimeout(100); }
    await p.click('[data-antwort="0"]'); await p.waitForSelector("#weiter"); await p.click("#weiter"); await p.waitForTimeout(150);
  };
  // ein Tier vollständig versorgen und (am nächsten Tag) auswildern; liefert die id
  async function versorge(falschErste = false) {
    await station(); await p.click("#neu"); await p.waitForTimeout(200);
    const gast = await p.evaluate(() => (__tierstation.daten().gast || {}).id || null);
    if (!gast) {   // Sonderfall Rehkitz: sofort beantworten
      const t = await p.textContent("#frage .frage-titel");
      erwarte(/Rehkitz/.test(t), "Sonderfall: Rehkitz-Frage erscheint");
      await p.click('[data-antwort="0"]'); await p.click("#weiter"); await p.waitForTimeout(150);
      return "kitz";
    }
    for (let i = 0; i < 3; i++) await antworte(falschErste && i === 0);
    const ruht = await p.evaluate(() => ({ g: __tierstation.daten().gast, frei: !!document.getElementById("frei") }));
    if (!(ruht.g && ruht.g.ruht && !ruht.frei)) fehler.push(`${gast}: nach drei Antworten ruht das Tier noch nicht`);
    await naechsterTag(); await station();
    await p.click("#frei"); await p.waitForTimeout(150);
    return gast;
  }

  // Ersteinrichtung (Vorschule zuerst: Igel und Amsel)
  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
  await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "vs"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(600);

  await station();
  erwarte(await p.isVisible("#zu"), "vor Kapitel 2 ist die Station zu");
  await p.evaluate(() => { Story.setzeKapitel(2); Spielwelt.speichere("tier", { phase: "tier", art: "fuchs", farbe: 0, name: "Ronja", besitz: {}, traegt: {} }); });

  // 1) erster Gast mit einem Fehler; das eigene Tier hilft mit; Stern fürs erste Mal
  await station(); await p.click("#neu"); await p.waitForTimeout(200);
  const g1 = await p.evaluate(() => __tierstation.daten().gast.id);
  erwarte(["igel", "amsel"].includes(g1), `Vorschule: erster Gast ist Igel oder Amsel (${g1})`);
  erwarte(/Ronja/.test(await p.textContent("#bruni-text")), "das eigene Tier (Ronja) passt mit auf");
  if (BILDER) await p.screenshot({ path: `${BILDER}/tierstation-frage.png` });
  await p.click('[data-antwort]:not([data-antwort="0"])');
  erwarte(/überleg nochmal/.test(await p.textContent("#hinweis")), "falsche Antwort: freundlicher Hinweis");
  await p.click('[data-antwort="0"]'); await p.click("#weiter"); await antworte(); await antworte();
  erwarte(await p.evaluate(() => !!__tierstation.daten().gast.ruht) && !(await p.$("#frei")), "nach drei Antworten schläft das Tier – Auswildern erst morgen");
  // eine Woche nicht da: das Tier wartet (nichts verfällt)
  tagNr = 8; await p.evaluate((t) => localStorage.setItem("__testJetzt", String(t)), TAG(tagNr)); await station();
  const s0 = await p.evaluate(() => Spielwelt.sterne());
  erwarte(!!(await p.$("#frei")), "Tage später: das Tier wartet fit auf das Auswildern");
  await p.click("#frei"); await p.waitForTimeout(150);
  const n1 = await p.evaluate(() => ({ d: __tierstation.daten(), sterne: Spielwelt.sterne(), fund: JSON.stringify(Spielwelt.lade("lernfunde") || {}) }));
  erwarte(n1.d.frei[g1] === 1 && !n1.d.gast && n1.sterne >= s0 + 1, `ausgewildert: ${g1} frei, Stern (${s0} → ${n1.sterne})`);
  erwarte(/tierstation:/.test(n1.fund), "Lernfund für das erste Tier");
  if (BILDER) await p.screenshot({ path: `${BILDER}/tierstation-frei.png` });
  // zweites Vorschul-Tier
  const g2 = await versorge(); erwarte(g2 !== g1 && ["igel", "amsel"].includes(g2), `zweites Tier in der Vorschule: ${g2}`);

  // 2) Klasse 3: alle Tiere einmal (neue zuerst), Rehkitz als Sonderfall
  await stufe("3"); await naechsterTag();
  const gesehen = new Set([g1, g2]);
  for (let i = 0; i < 6; i++) { const id = await versorge(i === 0); gesehen.add(id); await naechsterTag(); }
  const alle = await p.evaluate(() => __tierstation.TIERE.map(t => t.id));
  erwarte(alle.every(id => gesehen.has(id)), `Klasse 3: alle ${alle.length} Tiere versorgt (${[...gesehen].join(", ")})`);
  const frei = await p.evaluate(() => __tierstation.daten().frei);
  erwarte(Object.keys(frei).length === alle.length, "jedes Tier steht in „Schon wieder in Freiheit“");
  // ein Tier zum zweiten Mal: kein neuer Stern
  const s2 = await p.evaluate(() => Spielwelt.sterne()); await versorge();
  erwarte(!/Stern/.test(await p.textContent("#bruni-text")), `zweites Mal: kein neuer Stern (${s2})`);

  // Hochformat
  await p.setViewportSize({ width: 820, height: 1180 }); await station(); await p.click("#neu"); await p.waitForTimeout(200);
  erwarte(!(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)), "Hochformat: kein waagerechter Überlauf");
  if (BILDER) await p.screenshot({ path: `${BILDER}/tierstation-hoch.png`, fullPage: true });
  await p.setViewportSize({ width: 1180, height: 820 });

  // 3) Insel: Station-Blase, Ort und Knopf
  await p.evaluate(() => Spielwelt.speichere("medien", { lektionen: { bedienung: 3 } }));
  await p.goto(BASIS + "spiele/welt3d/heimat.html?stunde=14"); await p.waitForFunction(() => window.InselKern && window.Insel, null, { timeout: 30000 });
  const insel = await p.evaluate(() => { const a = InselKern.antwort("tierstation"); return { ziel: a.blase[4], text: a.blase[2], ort: Insel.ORTE.includes("tierstation"), knopf: InselKern.aktionFuer("tierstation")[0][1] }; });
  erwarte(insel.ziel === "../tierstation/" && insel.ort && insel.knopf === "Station", `Insel: Station-Blase („${insel.text}“), Ort und Knopf`);

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n  " + fehler.join("\n  ")); process.exit(1); }
  console.log("✅ Tierstation-Test bestanden.");
})();
