// Test „Elternbereich schneller“ (05.11.2026): Die Fachdaten (Themen, Werkstatt, Lektionen, Lehrplan – rund 1,5 MB) laden erst nach dem
// ersten Bild. Der Überblick steht sofort da; die Reiter „Lernstand“ und „Wie in der Schule“ zeigen kurz „wird geladen“ und füllen sich dann.
// Echt angetippt: Reiter, Lehrplan aufklappen, ein Feld in „Wie in der Schule“ speichern; Direktaufruf mit #schule; keine Konsolenfehler.
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png`, fullPage: false }); };
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, serviceWorkers: "block" });
  await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load");
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
  await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "3");
  await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));

  // Die größte Fachdatei künstlich bremsen, damit man den Zwischenzustand sieht
  let freigeben; const bremse = new Promise(r => { freigeben = r; });
  await p.route("**/sachkunde/themen.js", async (route) => { await bremse; await route.continue(); });
  await p.goto(BASIS + "spiele/eltern/", { waitUntil: "domcontentloaded" });   // „load“ kann auf die gebremste Datei warten
  await p.waitForSelector(".eltern-teil[data-teil=ueberblick] .karte");
  const erst = await p.evaluate(() => ({ themen: !!window.THEMEN, lehrplan: !!window.LEHRPLAN, karten: document.querySelectorAll('.eltern-teil[data-teil="ueberblick"] .karte').length,
    wochenbericht: /Wochenbericht/.test(document.body.textContent) }));
  erwarte(!erst.themen && !erst.lehrplan && erst.karten >= 3 && erst.wochenbericht, `Überblick steht, bevor die Fachdaten da sind (${erst.karten} Karten, Wochenbericht)`);
  const html = await (await p.request.get(BASIS + "spiele/eltern/index.html")).text();
  erwarte(!/<script src="[^"]*(themen|werkstatt|sachsen-punkte|faecher)\.js/.test(html), "index.html lädt Themen, Werkstatt, Fächer und Lehrplan-Punkte nicht mehr direkt");

  await p.click('.eltern-reiter [data-teil="lernstand"]');
  await p.waitForTimeout(200);
  erwarte(await p.evaluate(() => !!document.querySelector('.eltern-teil[data-teil="lernstand"] .lade-karte')), "Reiter „Lernstand“ zeigt „wird geladen“, solange die Daten fehlen");
  await bild(p, "elternschnell-laedt");
  freigeben();
  await p.waitForSelector('.eltern-teil[data-teil="lernstand"] h3.lp-fach', { timeout: 15000 });
  const ls = await p.evaluate(() => ({ teil: [...document.querySelectorAll(".eltern-teil")].filter(x => !x.hidden).map(x => x.dataset.teil).join(), lade: !!document.querySelector(".lade-karte"),
    karten: document.querySelectorAll('.eltern-teil[data-teil="lernstand"] > .karte').length }));
  erwarte(ls.teil === "lernstand" && !ls.lade && ls.karten >= 4, `Danach füllt sich „Lernstand“ von selbst (${ls.karten} Karten), der Reiter bleibt gewählt`);
  await bild(p, "elternschnell-lernstand");
  const h = p.locator("h3.lp-fach.lp-zu").first(); await h.click(); await p.waitForTimeout(100);
  erwarte(await p.evaluate(() => !document.querySelector("h3.lp-fach.lp-zu").nextElementSibling.hidden), "Lehrplan je Fach lässt sich aufklappen");
  await p.click('.eltern-reiter [data-teil="schule"]');
  await p.selectOption("#en-ab", "1"); await p.click("#en-speichern"); await p.waitForTimeout(150);
  erwarte(await p.evaluate(() => (Spielwelt.lade("eltern").englisch || {}).ab === "1"), "„Wie in der Schule“: Englisch ab Klasse 1 echt gespeichert");

  // Direktaufruf mit #schule (z. B. aus Meine Ecke): Teil füllt sich nach dem Laden
  await p.unroute("**/sachkunde/themen.js");
  await p.goto(BASIS + "spiele/eltern/#schule"); await p.waitForSelector("#en-ab", { timeout: 15000 });
  erwarte(await p.evaluate(() => [...document.querySelectorAll(".eltern-teil")].filter(x => !x.hidden).map(x => x.dataset.teil).join() === "schule"), "Direktaufruf mit #schule zeigt den gefüllten Teil");
  // Überblick: Daten laden still im Hintergrund vor
  await p.goto(BASIS + "spiele/eltern/#ueberblick"); await p.waitForFunction(() => window.__eltern && __eltern.fachBereit(), null, { timeout: 15000 });
  erwarte(true, "Auf dem Überblick laden die Fachdaten still im Hintergrund vor");
  // Zeitmessung (nur Info)
  const t = await p.evaluate(() => { const n = performance.getEntriesByType("navigation")[0]; return Math.round(n.domContentLoadedEventEnd); });
  console.log(`  ℹ DOMContentLoaded nach ${t} ms (lokal)`);
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Elternbereich-schnell-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
