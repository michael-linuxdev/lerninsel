// Test Dashboard (30.10.2026): Startseite „alles auf einen Blick“ (iPad quer und hoch ohne Scrollen, bunter Name, alle Türen sichtbar,
// mit Sorbisch und Vorschul-Rucksack sechs Lern-Türen), „Meine Ecke“ mit Reitern (Heute / Meine Woche / Ich kann / Meine Sachen, echt angetippt,
// Wahl bleibt beim Neuladen) und Elternbereich mit Reitern (fünf Teile, Lehrplan je Fach aufklappbar, Felder in allen Teilen bedienbar).
// Seit 30.10.2026 stehen die Lernbegleiter (Benno, Fipsi, Ella, Paula, Bruni, Tilda) auf den Türen. Keine waagerechte Scrollleiste, keine Konsolenfehler.
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  const masse = (p) => p.evaluate(() => ({ h: document.documentElement.scrollHeight, w: document.documentElement.scrollWidth, ih: innerHeight, iw: innerWidth }));
  async function kind(stufe, { breite = 1180, hoehe = 820, name = "Mira" } = {}) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", name); await p.selectOption("#e-stufe", stufe);
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }

  // ---------- Startseite ----------
  for (const [stufe, sorbisch, n] of [["2", false, 4], ["vs", true, 6]]) {
    for (const [breite, hoehe, art] of [[1180, 820, "iPad quer"], [820, 1180, "iPad hoch"], [390, 760, "Handy"]]) {
      const { ctx, p } = await kind(stufe, { breite, hoehe, name: stufe === "vs" ? "Maximilian" : "Mira" });
      if (sorbisch) { await p.evaluate(() => { const e = Spielwelt.lade("eltern") || {}; e.sorbisch = { an: true }; Spielwelt.speichere("eltern", e); }); await p.reload(); }
      await p.waitForTimeout(500);
      const m = await masse(p);
      const t = await p.evaluate(() => {
        const tueren = [...document.querySelectorAll(".tuer:not([hidden])")], r = (e) => e.getBoundingClientRect();
        return { lern: document.querySelectorAll("#lernen .tuer:not([hidden])").length, alle: tueren.length, sichtbar: tueren.every(x => r(x).bottom <= innerHeight + 1 && r(x).height >= 100),
          begleiter: [...document.querySelectorAll(".tuer:not([hidden]) .begleiter")].filter(b => b.querySelector("svg") && b.getBoundingClientRect().width > 40).length,
          name: document.querySelectorAll("#name span").length, farbig: new Set([...document.querySelectorAll("#name span")].map(s => s.style.color)).size };
      });
      erwarte(t.begleiter === n + 3 - (stufe === "vs" ? 1 : 0), `Startseite ${art}: Lernbegleiter auf den Türen (${t.begleiter})`);
      erwarte(m.w <= m.iw + 1 && t.lern === n && t.name > 3 && t.farbig > 1, `Startseite ${art} (${stufe === "vs" ? "Vorschule + Sorbisch" : "Kl. 2"}): ${n} Lern-Türen, bunter Name, keine Scrollleiste`);
      if (art !== "Handy") erwarte(m.h <= m.ih + 1 && t.sichtbar, `Startseite ${art}: alles auf einen Blick, alle ${t.alle} Türen ohne Scrollen sichtbar (Höhe ${m.h})`);
      await bild(p, `dashboard-start-${stufe}-${art.replace(" ", "-")}`);
      if (art === "iPad quer" && stufe === "2") {
        await p.click(".tuer.mathe"); await p.waitForURL(/mathe/);
        erwarte(true, "Tür „Mathe“ führt in den Matheweg");
      }
      await ctx.close();
    }
  }

  // ---------- Meine Ecke ----------
  for (const [breite, hoehe, art] of [[1180, 820, "quer"], [390, 760, "Handy"]]) {
    const { ctx, p } = await kind("2", { breite, hoehe });
    await p.click("#ich-knopf"); await p.waitForURL(/spiele\/ich/); await p.waitForTimeout(500);
    const sicht = () => p.evaluate(() => ["heute", "woche", "kann", "sachen"].filter(r => !document.getElementById("teil-" + r).hidden));
    erwarte((await sicht()).join() === "heute" && await p.evaluate(() => !!document.querySelector("#teil-heute #aufgaben .aufgabe")), `Meine Ecke ${art}: startet mit „Heute“ (Tagesaufgaben sichtbar)`);
    for (const [r, sel] of [["woche", "#woche .tag"], ["kann", "#faehigkeiten > *"], ["sachen", "#heft-link"]]) {
      await p.click(`.ich-reiter [data-reiter="${r}"]`); await p.waitForTimeout(150);
      const ok = await p.evaluate(([r, sel]) => { const e = document.querySelector(sel); return !document.getElementById("teil-" + r).hidden && e && e.getClientRects().length > 0; }, [r, sel]);
      erwarte(ok && (await sicht()).length === 1 && (await masse(p)).w <= (await masse(p)).iw + 1, `Meine Ecke ${art}: Reiter „${r}“ zeigt nur seinen Teil, keine Scrollleiste`);
      await bild(p, `dashboard-ich-${art}-${r}`);
    }
    await p.reload(); await p.waitForTimeout(400);
    erwarte((await sicht()).join() === "sachen", `Meine Ecke ${art}: gewählter Reiter bleibt nach dem Neuladen`);
    await p.click("#heft-link"); await p.waitForURL(/heft/);
    erwarte(true, "„Meine Sachen“ → „Mein Heft“ öffnet das Heft");
    await ctx.close();
  }

  // ---------- Elternbereich ----------
  for (const [breite, hoehe, art] of [[1180, 820, "quer"], [390, 760, "Handy"]]) {
    const { ctx, p } = await kind("3", { breite, hoehe });
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(400);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(600); }
    const teile = await p.evaluate(() => [...document.querySelectorAll(".eltern-teil")].map(t => ({ id: t.dataset.teil, an: !t.hidden, karten: t.querySelectorAll(":scope > .karte").length })));
    erwarte(teile.length === 5 && teile.filter(t => t.an).map(t => t.id).join() === "ueberblick" && teile.reduce((n, t) => n + t.karten, 0) >= 20,
      `Elternbereich ${art}: fünf Reiter, startet mit „Überblick“, alle ${teile.reduce((n, t) => n + t.karten, 0)} Karten verteilt`);
    let hoechstens = 0;
    for (const t of ["lernstand", "schule", "zeit", "kinder", "ueberblick"]) {
      await p.click(`.eltern-reiter [data-teil="${t}"]`); await p.waitForTimeout(150);
      const m = await masse(p); hoechstens = Math.max(hoechstens, m.h);
      erwarte(m.w <= m.iw + 1 && await p.evaluate((t) => [...document.querySelectorAll(".eltern-teil")].filter(x => !x.hidden).map(x => x.dataset.teil).join() === t, t), `Elternbereich ${art}: Reiter „${t}“, keine Scrollleiste`);
      await bild(p, `dashboard-eltern-${art}-${t}`);
    }
    if (art === "quer") erwarte(hoechstens < 4000, `Elternbereich quer: kein Teil länger als 4000 px (längster ${hoechstens} px, vorher eine Seite mit über 16 000 px)`);
    // Lehrplan je Fach: zugeklappt, Antippen öffnet
    await p.click('.eltern-reiter [data-teil="lernstand"]');
    const h = p.locator("h3.lp-fach.lp-zu").first();
    const vorher = await p.evaluate(() => document.querySelector("h3.lp-fach.lp-zu").nextElementSibling.hidden);
    await h.click(); await p.waitForTimeout(100);
    const nachher = await p.evaluate(() => document.querySelector("h3.lp-fach.lp-zu").nextElementSibling.hidden);
    erwarte(vorher && !nachher, `Elternbereich ${art}: Lehrplan je Fach zugeklappt, Antippen klappt auf`);
    // Ein Feld im Teil „Wie in der Schule“ echt bedienen
    await p.click('.eltern-reiter [data-teil="schule"]');
    await p.selectOption("#en-ab", "1"); await p.click("#en-speichern"); await p.waitForTimeout(150);
    erwarte(await p.evaluate(() => (Spielwelt.lade("eltern").englisch || {}).ab === "1"), `Elternbereich ${art}: „Englisch ab Klasse 1“ im Teil „Wie in der Schule“ gespeichert`);
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Dashboard-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
