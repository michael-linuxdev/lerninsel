// Test Landkreise Sachsen (30.10.2026): Quiz „Sachsens Landkreise und Städte“ für alle Kinder aus Sachsen, eigenes Thema für den Kreis, den die
// Eltern einstellen (Elternbereich → „Unser Landkreis“), alle 13 Kreis-Themen echt durchgeklickt, Landesfilter. Aufruf: sh tests/laufen.sh landkreise
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  async function kind(stufe, breite = 1180, hoehe = 820) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    await p.goto(BASIS + "spiele/sachkunde/"); await p.waitForSelector("#themen .su-gruppe");
    return { ctx, p };
  }
  const passt = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);

  async function durchklicken(p, id, art) {
    const kachel = `#themen button.lek[data-id="${id}"]`;
    await p.evaluate((sel) => { const b = document.querySelector(sel); const d = b && b.closest("details"); if (d) d.open = true; }, kachel);
    await p.click(kachel); await p.waitForSelector("#lektion-ansicht:not([hidden])");
    let runden = 0, haengt = false, breit = false;
    while (runden++ < 80) {
      const lage = await p.evaluate(() => { const l = __sachkunde.lauf; const s = l && l.t.schritte[l.pos];
        return { ende: !document.getElementById("ende-ansicht").hidden, typ: s && s.typ, schritt: s, weiter: !!document.getElementById("weiter"),
          karte: (document.querySelector(".sortier-karte") || {}).innerText || "" }; });
      if (lage.ende) break;
      if (!(await passt(p))) breit = true;
      if (lage.weiter) { await p.click("#weiter"); await p.waitForTimeout(80); continue; }
      if (lage.typ === "wahl") { const t = lage.schritt.optionen.find(o => o.ok).t; await p.evaluate((t) => [...document.querySelectorAll(".optionen .option")].find(b => b.textContent.trim() === t || b.querySelector("span") && [...b.childNodes].some(n => n.textContent.trim() === t)).click(), t); }
      else if (lage.typ === "daumen") await p.locator(".daumen .option").nth(lage.schritt.ok ? 0 : 1).click();
      else if (lage.typ === "zuordnen") {
        const ding = lage.schritt.dinge.filter(d => lage.karte.includes(d.t)).sort((a, b) => b.t.length - a.t.length)[0];
        if (!ding) { haengt = true; break; }
        await p.click(`.gruppen .option[data-g="${ding.gruppe}"]`); await p.waitForTimeout(900);
      } else { haengt = true; break; }
      await p.waitForTimeout(100);
    }
    const ende = await p.evaluate(() => ({ titel: document.getElementById("ende-titel").textContent, text: document.getElementById("ende-text").textContent }));
    const sterne = await p.evaluate((id) => ((Spielwelt.lade("sachkunde") || {}).themen || {})[id] || 0, id);
    if (BILDER && ["mein-koerper", "licht-schatten", "sachsen-entdecken"].includes(id)) await p.screenshot({ path: `${BILDER}/sachkundevoll-ende-${id}-${art}.png` });
    await p.goto(BASIS + "spiele/sachkunde/"); await p.waitForSelector("#themen .su-gruppe");
    return { ok: !haengt && !breit && /geschafft/.test(ende.titel) && /beim ersten Mal richtig/.test(ende.text), sterne, breit };
  }


  {
    const { ctx, p } = await kind("3");
    const s0 = await p.evaluate(() => ({ quiz: !!document.querySelector('[data-id="lk-sachsen"]'), bz: !!document.querySelector('[data-id="lk-bautzen"]') }));
    erwarte(s0.quiz && !s0.bz, "Kl. 3 Sachsen: Quiz sichtbar, ohne Eltern-Wahl kein Kreis-Thema");
    const r = await durchklicken(p, "lk-sachsen", "quer"); erwarte(r.ok, "Quiz „Sachsens Landkreise und Städte“ bis zum Ende");
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300); if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
    await p.waitForSelector("#su-landkreis"); await p.selectOption("#su-landkreis", "bautzen"); await p.click("#sj-speichern"); await p.waitForTimeout(200);
    erwarte(await p.evaluate(() => Spielwelt.lade("eltern").sachkunde.landkreis === "bautzen"), "Elternbereich: Landkreis Bautzen gespeichert");
    await p.goto(BASIS + "spiele/sachkunde/"); await p.waitForSelector("#themen .su-gruppe");
    erwarte(await p.evaluate(() => !!document.querySelector('[data-id="lk-bautzen"]') && !document.querySelector('[data-id="lk-goerlitz"]')), "Nur das Thema „Unser Kreis: Landkreis Bautzen“ ist sichtbar");
    if (BILDER) await p.screenshot({ path: `${BILDER}/landkreis-liste.png` });
    const ids = await p.evaluate(() => LANDKREISE.map(k => k.id)); let alle = true;
    for (const id of ids) {
      await p.evaluate((id) => { const e = Spielwelt.lade("eltern"); e.sachkunde = Object.assign({}, e.sachkunde, { landkreis: id }); Spielwelt.speichere("eltern", e); }, id);
      await p.reload(); await p.waitForSelector("#themen .su-gruppe");
      const x = await durchklicken(p, "lk-" + id, "quer"); if (!x.ok) { alle = false; console.log("    nicht bis zum Ende: " + id); }
    }
    erwarte(alle, "alle 13 Kreis-Themen (10 Landkreise, 3 kreisfreie Städte) echt durchgeklickt");
    await p.evaluate(() => { const e = Spielwelt.lade("eltern"); e.kind.land = "by"; Spielwelt.speichere("eltern", e); }); await p.reload(); await p.waitForSelector("#themen .su-gruppe");
    erwarte(await p.evaluate(() => !document.querySelector('[data-id^="lk-"]')), "Landesfilter: Kinder aus Bayern sehen keine Sachsen-Kreise");
    await ctx.close();
  }
  {
    const { ctx, p } = await kind("3", 390, 760);
    const r = await durchklicken(p, "lk-sachsen", "hoch"); erwarte(r.ok, "Handy: Quiz bis zum Ende, keine Scrollleiste");
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Landkreis-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
