// Test Schuljahr Sachunterricht (Lehrplan Sachsen 2019 in voller Tiefe, 28.10.2026): 29 neue Sachthemen für Kl. 1/2, 3 und 4.
// Themenliste nach Lernbereichen gruppiert (frühere Klassen eingeklappt), jedes neue Thema über seine Kachel geöffnet und echt bis
// „geschafft“ durchgeklickt (Weiter, richtige Wahl, Daumen, Zuordnen per Antippen), Landesfilter, Inhaltspunkte SU im Elternbereich.
// Aufruf: sh tests/laufen.sh sachkundevoll   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const NEU12 = ["zusammen-lernen", "gesund-essen", "mein-koerper", "jahreszeiten", "baeume", "obst-garten", "kleintiere", "haustiere", "licht-schatten",
  "luft-schall", "wetter", "loesen-trennen", "schule-ort", "meine-schulzeit"];
const NEU34 = ["kulturen", "land-frueher", "sinne-genau", "getreide", "wiese", "wasserkreislauf", "karten-lesen", "landkreis",
  "schule-frueher", "medien-welt", "stadt-frueher", "waldtiere", "boden", "sachsen-entdecken", "radfahrpruefung"];

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
      if (lage.typ === "wahl") await p.locator(".optionen .option", { hasText: lage.schritt.optionen.find(o => o.ok).t }).first().click();
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

  // --- Gruppen und Einklappen ---
  {
    const { ctx, p } = await kind("2");
    const g = await p.evaluate(() => [...document.querySelectorAll(".su-gruppe")].map(x => ({ lb: x.dataset.lb, n: x.querySelectorAll("button.lek").length, ein: x.querySelectorAll("details.frueher").length })));
    erwarte(g.map(x => x.lb).join() === "zl,kg,pt,un,rz,ex" && g.every(x => x.n >= 3 && !x.ein), `Kl. 2: sechs Lernbereiche, nichts eingeklappt (${g.map(x => x.lb + " " + x.n).join(", ")})`);
    const sicht = await p.evaluate(() => ({ kl3: !!document.querySelector('[data-id="wiese"]'), kl4: !!document.querySelector('[data-id="boden"]'), sn: !!document.querySelector('[data-id="landkreis"]') }));
    erwarte(sicht.kl3 && !sicht.kl4 && sicht.sn, "Kl. 2 sieht Kl.-3-Themen (auch „Mein Landkreis“ in Sachsen), noch keine Kl.-4-Themen");
    if (BILDER) { await p.screenshot({ path: `${BILDER}/sachkundevoll-liste-kl2.png`, fullPage: false }); }
    await ctx.close();
  }
  {
    const { ctx, p } = await kind("4");
    const g = await p.evaluate(() => [...document.querySelectorAll(".su-gruppe")].map(x => ({ lb: x.dataset.lb, sicht: x.querySelectorAll(":scope > .lektionen button.lek").length, frueher: x.querySelectorAll("details.frueher button.lek").length })));
    const ok = await p.evaluate(() => !!document.querySelector('details.frueher [data-id="baeume"]') && !!document.querySelector('.su-gruppe > .lektionen [data-id="waldtiere"]'));
    erwarte(ok && g.filter(x => x.frueher > 0).length >= 5, `Kl. 4: Themen aus Kl. 1–3 eingeklappt (${g.map(x => `${x.lb} ${x.sicht}+${x.frueher}`).join(", ")})`);
    await p.evaluate(() => { const e = Spielwelt.lade("eltern"); e.kind.land = "nw"; Spielwelt.speichere("eltern", e); }); await p.reload(); await p.waitForSelector("#themen .su-gruppe");
    const nw = await p.evaluate(() => ({ landkreis: !!document.querySelector('[data-id="landkreis"]'), sachsen: !!document.querySelector('[data-id="sachsen-entdecken"]'), boden: !!document.querySelector('[data-id="boden"]') }));
    erwarte(!nw.landkreis && !nw.sachsen && nw.boden, "Landesfilter: „Mein Landkreis“ und „Sachsen entdecken“ nur für Kinder aus Sachsen");
    if (BILDER) { await p.evaluate(() => { const e = Spielwelt.lade("eltern"); e.kind.land = "sn"; Spielwelt.speichere("eltern", e); }); await p.reload(); await p.waitForSelector("#themen .su-gruppe"); await p.screenshot({ path: `${BILDER}/sachkundevoll-liste-kl4.png` }); }
    await ctx.close();
  }

  // --- Alle neuen Themen echt durchklicken (quer), ein Teil auch hoch ---
  for (const [stufe, liste, breite, hoehe, art] of [["2", NEU12, 1180, 820, "quer"], ["4", NEU34, 1180, 820, "quer"],
    ["2", ["mein-koerper", "baeume", "wetter"], 390, 760, "hoch"], ["4", ["wasserkreislauf", "radfahrpruefung", "medien-welt"], 390, 760, "hoch"]]) {
    const { ctx, p } = await kind(stufe, breite, hoehe);
    for (const id of liste) {
      const r = await durchklicken(p, id, art);
      erwarte(r.ok && r.sterne === 3, `${art}, Kl. ${stufe}: „${id}“ bis zum Ende ohne Fehler, 3 Sterne, keine Scrollleiste (${r.sterne}${r.breit ? ", zu breit" : ""})`);
    }
    if (art === "quer" && stufe === "2") {
      await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300);
      if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
      await p.waitForSelector(".lp-punkte");
      const lp = await p.evaluate(() => {
        const h = [...document.querySelectorAll("h3.lp-fach")].find(x => /^Sachunterricht/.test(x.textContent)); const ul = h && h.nextElementSibling;
        return { punkte: ul ? ul.querySelectorAll(".lp-punkte li").length : 0, su: ul ? [...ul.querySelectorAll(".lp-sachthemen")].map(x => x.textContent) : [] };
      });
      erwarte(lp.punkte === 47 && lp.su.length === 6 && lp.su.every(t => !t.startsWith("0 ")), `Elternbereich Kl. 2: 47 Inhaltspunkte SU, je Lernbereich „Sachthemen: x von y entdeckt“ (${lp.punkte}; ${lp.su.join(" | ")})`);
      if (BILDER) { await p.evaluate(() => [...document.querySelectorAll("h3.lp-fach")].find(x => /^Sachunterricht/.test(x.textContent)).scrollIntoView()); await p.screenshot({ path: `${BILDER}/sachkundevoll-eltern.png` }); }
    }
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Sachunterricht-Schuljahr-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
