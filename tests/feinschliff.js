// Playwright-Test (UX-Paket 5, 07.11.2026): Feinschliff – Album-Reiter brechen um (keine Leiste läuft aus dem Bild), Elternbereich zeigt statt
// eines leeren Wochendiagramms einen Satz (mit Minuten wieder das Diagramm), Mein Tier zeigt unter den Eiern ein Nest; überall ohne Querscrollen.
// Aufruf: sh tests/laufen.sh feinschliff   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo/;
process.on("unhandledRejection", (e) => { console.log("❌ Abbruch: " + e.message + "\n  " + (global.__fehler || []).join("\n  ")); process.exit(1); });

(async () => {
  const browser = await chromium.launch();
  const fehler = global.__fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  async function kind(breite, hoehe) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__elternAlle = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`Seitenfehler ${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`Konsole ${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
    await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(400);
    return { ctx, p };
  }
  const quer = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  for (const [breite, hoehe, art] of [[1180, 820, "iPad quer"], [390, 760, "Handy"]]) {
    const { ctx, p } = await kind(breite, hoehe);
    // Album: alle Reiter im Bild
    await p.goto(BASIS + "spiele/album/"); await p.waitForTimeout(600);
    const a = await p.evaluate(() => { const r = document.getElementById("reiter"), k = [...r.querySelectorAll("button")].map(b => b.getBoundingClientRect()); return { n: k.length, imBild: k.every(b => b.right <= innerWidth + 1 && b.left >= -1), zeilen: new Set(k.map(b => Math.round(b.top))).size, scroll: r.scrollWidth <= r.clientWidth + 1 }; });
    erwarte(a.n >= 6 && a.imBild && a.scroll && (await quer(p)), `Album ${art}: alle ${a.n} Reiter im Bild (${a.zeilen} Zeilen), nichts läuft nach rechts hinaus`);
    await bild(p, `feinschliff-album-${art.replace(" ", "-")}`);
    // Elternbereich: ohne Minuten ein Satz statt eines leeren Diagramms, mit Minuten das Diagramm
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(800);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(500); }
    erwarte(await p.evaluate(() => !!document.getElementById("woche-leer") && !document.querySelector(".woche-balken")), `Elternbereich ${art}: ohne Lernminuten steht ein Satz statt des leeren Wochendiagramms`);
    await p.evaluate(() => { for (let i = 0; i < 6; i++) Zeit.aufgabe(); const z = Spielwelt.lade("zeit") || {}; z.lernSek = (z.lernSek || 0) + 600; Spielwelt.speichere("zeit", z); });
    await p.reload(); await p.waitForTimeout(800);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(500); }
    const w = await p.evaluate(() => ({ balken: !!document.querySelector(".woche-balken"), leer: !!document.getElementById("woche-leer"), min: (document.querySelector(".zahl b") || {}).textContent }));
    erwarte(w.balken && !w.leer, `Elternbereich ${art}: mit Lernminuten wieder das Diagramm (${w.min})`);
    // Mein Tier: Nest unter den Eiern
    await p.goto(BASIS + "spiele/tier/"); await p.waitForTimeout(600);
    const n = await p.evaluate(() => { const w = document.getElementById("wahl-ansicht"), s = document.querySelector("#wahl-ansicht .nest svg"); return { wahl: w && !w.hidden, nest: !!s && s.getBoundingClientRect().width > 200, text: (document.querySelector("#wahl-ansicht .nest p") || {}).textContent || "" }; });
    if (n.wahl) erwarte(n.nest && /Nest/.test(n.text) && (await quer(p)), `Mein Tier ${art}: Nest unter den Eiern (${n.text})`);
    else erwarte(true, `Mein Tier ${art}: Ei-Auswahl noch gesperrt (Erst lernen) – Nest nicht geprüft`);
    await bild(p, `feinschliff-tier-${art.replace(" ", "-")}`);
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Feinschliff-Test bestanden.");
})();
