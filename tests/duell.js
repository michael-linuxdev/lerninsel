// Test Kopfrechen-Duell (spiele/familie/duell.html): Kind gegen Erwachsene auf einem Tablet, alles echt angetippt.
// - Start: Name des Kindes, Schwierigkeit für Erwachsene wählen, „Los geht's!“
// - Runde 1 (quer): falsche Antwort → 1 Sekunde Pause (Antippen zählt nicht), dann löst das Kind 10 Aufgaben, die Erwachsenen 3
//   → „🏆 Mira gewinnt 10 : 3!“, Moment in Familie gemerkt, Matheweg-Ereignis und Mathe-Erfahrung fürs Kind
// - Revanche: nach 90 Sekunden (Playwright-Uhr) gewinnt, wer vorne liegt → „Die Erwachsenen gewinnen 2 : 1“
// - Hochformat (gegenüber sitzen, obere Hälfte gedreht): die Erwachsenen gewinnen 10 : 0 per Antippen; Unentschieden bei 0 : 0
// Keine Konsolenfehler, keine waagerechte Scrollleiste. Aufruf: sh tests/laufen.sh duell
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const passt = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1 && document.documentElement.scrollHeight <= innerHeight + 1);
  async function kind(breite, hoehe, stufe) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.clock.install({ time: new Date(2026, 9, 25, 15, 0) });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  const loesung = (p, sp) => p.evaluate((s) => __duell.spieler[s].a.l, sp);
  const punkte = (p, sp) => p.evaluate((s) => __duell.spieler[s].punkte, sp);
  // richtig oder falsch antippen (falsch = eine der beiden anderen Antworten)
  async function tippe(p, sp, richtig) {
    const l = await loesung(p, sp);
    const knopf = richtig ? `#${sp} .antwort[data-w="${l}"]` : `#${sp} .antwort:not([data-w="${l}"])`;
    await p.locator(knopf).first().click(); await p.waitForTimeout(30);
  }

  // ---------- iPad quer ----------
  {
    const { ctx, p } = await kind(1180, 820, "2");
    await p.goto(BASIS + "spiele/familie/duell.html"); await p.waitForTimeout(400);
    erwarte(await p.isVisible("#start") && await p.evaluate(() => document.getElementById("kind-name").textContent === "Mira") && await passt(p), "Start: Erklärung, Name des Kindes „Mira“, kein Scrollen");
    await p.click('[data-erw="3"]');
    erwarte(await p.evaluate(() => document.querySelector('[data-erw="3"]').classList.contains("an") && !document.querySelector('[data-erw="5"]').classList.contains("an")), "Erwachsene: „Leichter“ gewählt");
    await p.click("#los"); await p.waitForTimeout(150);
    const st = await p.evaluate(() => ({ start: document.getElementById("start").hidden, uhr: document.getElementById("uhr").textContent, k: __duell.spieler.kind.stufe, e: __duell.spieler.erw.stufe,
      ak: document.querySelector("#kind .aufgabe").textContent, n: document.querySelectorAll("#kind .antwort").length, ne: document.querySelectorAll("#erw .antwort").length }));
    erwarte(st.start && st.uhr === "90" && st.k === 2 && st.e === 3 && /= \?$/.test(st.ak) && st.n === 3 && st.ne === 3, `Runde läuft: Uhr 90, Kind Stufe 2 („${st.ak}“), Erwachsene Stufe 3, je 3 Antworten`);
    const xp0 = await p.evaluate(() => (Spielwelt.lade("charakter") || { xp: {} }).xp.mathe || 0);

    // falsche Antwort → kurze Pause
    await tippe(p, "kind", false);
    erwarte(await p.evaluate(() => document.getElementById("kind").classList.contains("pause") && !!document.querySelector("#kind .antwort.falsch")), "falsche Antwort: Knopf rot, Kind-Seite pausiert");
    await tippe(p, "kind", true);
    erwarte(await punkte(p, "kind") === 0, "während der Pause zählt auch die richtige Antwort nicht");
    await p.clock.runFor(1100);
    erwarte(await p.evaluate(() => !document.getElementById("kind").classList.contains("pause")), "nach 1 Sekunde geht es weiter");

    for (let i = 0; i < 3; i++) await tippe(p, "erw", true);
    for (let i = 0; i < 9; i++) await tippe(p, "kind", true);
    erwarte(await punkte(p, "kind") === 9 && await punkte(p, "erw") === 3 && await p.evaluate(() => document.querySelector("#kind .punkte").textContent === "9 / 10" && document.querySelector("#erw .punkte").textContent === "3 / 10"), "Punktestand 9 / 10 gegen 3 / 10 wird angezeigt");
    if (BILDER) await p.screenshot({ path: `${BILDER}/duell-quer.png` });
    await tippe(p, "kind", true); await p.waitForTimeout(100);
    const ende = await p.evaluate(() => ({ sichtbar: !document.getElementById("ende").hidden, t: document.getElementById("ende-text").textContent }));
    erwarte(ende.sichtbar && ende.t === "🏆 Mira gewinnt 10 : 3!", `Ende: „${ende.t}“`);
    erwarte(await p.evaluate(() => { const b = document.querySelector("#erw .antwort").getBoundingClientRect(); const oben = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); return !!oben.closest("#ende"); }) && await punkte(p, "erw") === 3, "nach dem Ende liegt die Ergebnis-Karte über dem Spiel, nichts zählt mehr");
    const g = await p.evaluate(() => ({ f: (Spielwelt.lade("familie") || { momente: [] }).momente, c: Spielwelt.lade("charakter") || { xp: {}, tag: {} } }));
    erwarte(g.f.some(m => m.a === "duell" && m.t === "Mira 10 : 3 Erwachsene"), "gemeinsamer Moment „Kopfrechen-Duell“ gemerkt");
    erwarte((g.c.tag.ereignisse || {})["mathe-runde"] === 1 && (g.c.xp.mathe || 0) >= xp0 + 10, `zählt wie Lernen: Ereignis „mathe-runde“, Mathe-Erfahrung ${xp0} → ${g.c.xp.mathe}`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/duell-ende.png` });

    // Revanche: Zeit läuft ab
    await p.click("#nochmal"); await p.waitForTimeout(100);
    erwarte(await p.evaluate(() => document.getElementById("ende").hidden && document.getElementById("uhr").textContent === "90") && await punkte(p, "kind") === 0 && await punkte(p, "erw") === 0, "Revanche: neue Runde bei 0 : 0");
    await tippe(p, "erw", true); await tippe(p, "erw", true); await tippe(p, "kind", true);
    await p.clock.runFor(45000);
    erwarte(await p.evaluate(() => document.getElementById("uhr").textContent === "45" && document.getElementById("ende").hidden), "Uhr zählt herunter (45 s übrig)");
    await p.clock.runFor(46000); await p.waitForTimeout(100);
    erwarte(await p.evaluate(() => !document.getElementById("ende").hidden && document.getElementById("ende-text").textContent === "Die Erwachsenen gewinnen 2 : 1 – Revanche?" && document.getElementById("uhr").textContent === "0"), "nach 90 Sekunden: „Die Erwachsenen gewinnen 2 : 1 – Revanche?“");
    erwarte(await p.evaluate(() => (Spielwelt.lade("familie") || { momente: [] }).momente.filter(m => m.a === "duell").length === 2), "zweites Duell ebenfalls gemerkt");
    await ctx.close();
  }

  // ---------- iPad hoch: gegenüber sitzen ----------
  {
    const { ctx, p } = await kind(820, 1180, "4");
    await p.goto(BASIS + "spiele/familie/duell.html"); await p.waitForTimeout(400);
    await p.click("#los"); await p.waitForTimeout(150);
    const lage = await p.evaluate(() => { const e = document.getElementById("erw").getBoundingClientRect(), k = document.getElementById("kind").getBoundingClientRect(); return { oben: e.bottom <= k.top + 1, dreh: getComputedStyle(document.getElementById("erw")).transform }; });
    erwarte(lage.oben && lage.dreh !== "none" && await p.evaluate(() => __duell.spieler.kind.stufe === 4 && __duell.spieler.erw.stufe === 5), "Hochformat: Erwachsene oben und gedreht, Kind unten (Stufe 4), Erwachsene „Knifflig“");
    for (let i = 0; i < 10; i++) await tippe(p, "erw", true);
    await p.waitForTimeout(100);
    erwarte(await p.evaluate(() => document.getElementById("ende-text").textContent === "Die Erwachsenen gewinnen 10 : 0 – Revanche?") && await passt(p), "Erwachsene tippen 10 richtige auf der gedrehten Seite: „Die Erwachsenen gewinnen 10 : 0“, kein Scrollen");
    if (BILDER) await p.screenshot({ path: `${BILDER}/duell-hoch.png` });
    await p.click("#nochmal"); await p.waitForTimeout(100);
    await p.clock.runFor(91000); await p.waitForTimeout(100);
    erwarte(await p.evaluate(() => document.getElementById("ende-text").textContent === "Unentschieden 0 : 0!"), "Revanche ohne Antworten: „Unentschieden 0 : 0!“ nach Ablauf der Zeit");
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Duell-Test (Kopfrechen-Duell: Sieg, Pause bei Fehler, Zeitablauf, Hochformat, Unentschieden) bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
