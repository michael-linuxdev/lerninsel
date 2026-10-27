// Test NA-34 Teil 3+4: Sachkunde-Themen für Klasse 3–4 (Sinne, Wald und Wiese, Himmelsrichtungen, Schwimmen und Sinken, Feuer, Fahrrad, Kinderrechte, Gemeinde)
// Schritt C: Wärme, Gewässer, Experiment, Erste Hilfe, Informationen finden – diese werden echt durchgeklickt.
// Jedes neue Thema startet, jeder Schritt lässt sich anzeigen, alle Themen haben Lernziele, keine Konsolenfehler, keine Scrollleiste.
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const NEU = ["sinne", "wald", "kompass", "schwimmen", "feuer", "fahrrad", "kinderrechte", "gemeinde", "brot", "wetterkarte", "strom",
  "waerme", "gewaesser", "experiment", "erstehilfe", "medien-info"];
const DURCH = ["waerme", "gewaesser", "experiment", "erstehilfe", "medien-info"];

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  for (const [breite, hoehe, art] of [[1180, 820, "quer"], [390, 760, "hoch"]]) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "3");
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    await p.goto(BASIS + "spiele/sachkunde/"); await p.waitForTimeout(500);
    const daten = await p.evaluate((neu) => ({ alle: THEMEN.length, ohneLz: THEMEN.filter(t => !(t.lz && t.lz.length)).map(t => t.id),
      idx: neu.map(id => THEMEN.findIndex(t => t.id === id)),
      ohneRu: THEMEN.filter(t => neu.includes(t.id)).flatMap(t => t.schritte.filter(s => !(s.ru || s.satzRu)).map(() => t.id)) }), NEU);
    if (art === "quer") {
      erwarte(daten.alle === 28, `28 Themen bei Eule Ella (${daten.alle})`);
      erwarte(!daten.ohneLz.length && daten.idx.every(i => i >= 0), "alle Themen haben Lernziele, die neuen sind da");
      erwarte(!daten.ohneRu.length, "jeder neue Schritt hat einen russischen Entwurf");
    }
    for (let k = 0; k < NEU.length; k++) {
      await p.evaluate((i) => __sachkunde.starte(i), daten.idx[k]); await p.waitForTimeout(250);
      const schritte = await p.evaluate(() => __sachkunde.lauf.t.schritte.length);
      let ok = true;
      for (let s = 0; s < schritte; s++) {
        const info = await p.evaluate((s) => { __sachkunde.schritt(s); return { pos: __sachkunde.lauf.pos, text: document.body.innerText.length, passt: document.documentElement.scrollWidth <= innerWidth + 1 }; }, s);
        if (!info.passt) { ok = false; console.log("    Scrollleiste bei Schritt " + s); }
      }
      erwarte(ok, `${art}: „${NEU[k]}“ startet ohne waagerechte Scrollleiste (${schritte} Schritte)`);
      if (BILDER) await p.screenshot({ path: `${BILDER}/sachkunde-${NEU[k]}-${art}.png` });
    }
    // Schritt C: die fünf neuesten Themen einmal echt durchklicken (Weiter, richtige Wahl, Daumen, Zuordnen per Antippen) – ohne Fehler bis „Thema geschafft“
    for (const id of DURCH) {
      const i = daten.idx[NEU.indexOf(id)];
      await p.evaluate((i) => __sachkunde.starte(i), i); await p.waitForTimeout(200);
      let runden = 0, haengt = false;
      while (runden++ < 60) {
        const lage = await p.evaluate(() => { const l = __sachkunde.lauf; const s = l && l.t.schritte[l.pos];
          return { ende: !document.getElementById("ende-ansicht").hidden, typ: s && s.typ, schritt: s, weiter: !!document.getElementById("weiter"),
            karte: (document.querySelector(".sortier-karte") || {}).innerText || "" }; });
        if (lage.ende) break;
        if (lage.weiter) { await p.click("#weiter"); await p.waitForTimeout(120); continue; }
        if (lage.typ === "wahl") await p.locator(".optionen .option", { hasText: lage.schritt.optionen.find(o => o.ok).t }).first().click();
        else if (lage.typ === "daumen") await p.locator(".daumen .option").nth(lage.schritt.ok ? 0 : 1).click();
        else if (lage.typ === "zuordnen") {
          const ding = lage.schritt.dinge.find(d => lage.karte.includes(d.t));
          if (!ding) { haengt = true; break; }
          await p.click(`.gruppen .option[data-g="${ding.gruppe}"]`); await p.waitForTimeout(900);
        } else { haengt = true; break; }
        await p.waitForTimeout(150);
      }
      const ende = await p.evaluate(() => ({ titel: document.getElementById("ende-titel").textContent, text: document.getElementById("ende-text").textContent }));
      erwarte(!haengt && /geschafft/.test(ende.titel) && /beim ersten Mal richtig/.test(ende.text), `${art}: „${id}“ echt durchgeklickt, ohne Fehler bis zum Ende`);
      if (BILDER && id === "erstehilfe") await p.screenshot({ path: `${BILDER}/sachkunde-ende-${art}.png` });
    }
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Sachkunde-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
