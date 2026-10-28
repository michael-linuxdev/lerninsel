// Test „Robo programmieren“ (Werken Kl. 4, 30.10.2026): alle 13 Aufgaben echt über die Befehlstasten gelöst (auch Schleifen), ein falsches
// Programm zeigt den Fehler an der richtigen Stelle, „zu viele Bausteine“ wird erkannt, Fortschritt gespeichert, Zugang über Werken und
// Tablet-Führerschein. Keine Konsolenfehler, keine waagerechte Scrollleiste. Aufruf: sh tests/laufen.sh robo
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const passt = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  async function kind(stufe, breite = 1180, hoehe = 820) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__testSchnell = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  // Programm wie ein Kind über die Tasten eingeben: "vlr" und Schleifen "4[vr]"
  async function eingeben(p, t) {
    for (let i = 0; i < t.length;) {
      const m = t.slice(i).match(/^(\d)\[([vlr]*)\]/);
      if (m) { await p.click(`#tasten [data-n="${m[1]}"]`); for (const c of m[2]) await p.click(`#tasten [data-c="${c}"]`); await p.click('#tasten [data-zu="1"]'); i += m[0].length; }
      else { await p.click(`#tasten [data-c="${t[i]}"]`); i++; }
    }
  }
  for (const [breite, hoehe, art] of [[1180, 820, "quer"], [390, 760, "Handy"]]) {
    const { ctx, p } = await kind("4", breite, hoehe);
    await p.goto(BASIS + "spiele/sachkunde/?fach=werken"); await p.waitForTimeout(500);
    erwarte(!!(await p.$("#robo-link")), `${art}: Werken-Reiter zeigt „Robo programmieren“`);
    await p.click("#robo-link"); await p.waitForURL(/robo/); await p.waitForTimeout(300);
    const L = await p.evaluate(() => __robo.LEVELS.map(l => l.loesung));
    erwarte(L.length === 13 && await p.evaluate(() => document.querySelectorAll("#levels button:disabled").length === 12), `${art}: 13 Aufgaben, nur die erste offen`);
    if (art === "quer") {
      // Fehler finden: in Aufgabe 5 geradeaus gegen den Stein
      await p.evaluate(() => __robo.starte(4)); await eingeben(p, "vv"); await p.click("#start"); await p.waitForTimeout(300);
      const f = await p.evaluate(() => ({ t: document.getElementById("meldung").textContent, rot: [...document.querySelectorAll("#zeile .befehl")].findIndex(b => b.classList.contains("fehler")) }));
      erwarte(/Stein/.test(f.t) && f.rot === 1, `Fehler finden: Robo stößt an den Stein, der 2. Befehl ist rot markiert (${f.rot})`);
      // Zu viele Bausteine in Aufgabe 9
      await p.evaluate(() => __robo.starte(8)); await eingeben(p, "vvvv"); await p.click("#start"); await p.waitForTimeout(200);
      erwarte(/Zu viele Bausteine/.test(await p.evaluate(() => document.getElementById("meldung").textContent)), "Schleifen-Aufgabe: ohne Schleife „Zu viele Bausteine“");
      await p.evaluate(() => { const d = Spielwelt.lade("robo") || {}; d.fertig = {}; Spielwelt.speichere("robo", d); });
    }
    await p.reload(); await p.waitForTimeout(300);
    let alle = true, scroll = false;
    for (let i = 0; i < (art === "quer" ? L.length : 5); i++) {
      await p.click(`#levels [data-l="${i}"]`); await p.waitForTimeout(100);
      await eingeben(p, L[i]); await p.click("#start");
      await p.waitForSelector("#weiter", { timeout: 4000 }).catch(() => {});
      const ok = await p.evaluate(() => /Geschafft|Alle Aufgaben/.test(document.getElementById("meldung").textContent));
      if (!ok) { alle = false; console.log(`    Aufgabe ${i + 1} nicht geschafft: ${await p.evaluate(() => document.getElementById("meldung").textContent)}`); }
      if (!(await passt(p))) scroll = true;
      if (BILDER && (i === 4 || i === 11)) await p.screenshot({ path: `${BILDER}/robo-${i + 1}-${art}.png` });
      await p.click("#zur-liste"); await p.waitForTimeout(100);
    }
    const n = await p.evaluate(() => Object.keys(Spielwelt.lade("robo").fertig).length);
    erwarte(alle && !scroll && n === (art === "quer" ? 13 : 5), `${art}: ${art === "quer" ? "alle 13" : "5"} Aufgaben über die Tasten gelöst (${n}), keine Scrollleiste`);
    await ctx.close();
  }
  {
    const { ctx, p } = await kind("2");
    await p.goto(BASIS + "spiele/medien/"); await p.waitForTimeout(400);
    erwarte(!!(await p.$("#robo-link")), "Tablet-Führerschein: Knopf „Robo programmieren“");
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Robo-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
