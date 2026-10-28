// Test Kunst, Musik, Werken, Sport, Ethik (Lehrpläne Sachsen 2019, 28.10.2026): Sachunterricht-Seite mit Fach-Reitern (?fach=…),
// Themen nach Lernbereichen gruppiert, jedes der 70 Themen über seine Kachel geöffnet und echt bis „geschafft“ durchgeklickt
// (Weiter, richtige Wahl, Daumen, Zuordnen per Antippen) – jeweils von einem Kind der passenden Klasse; ein Teil auch im Hochformat.
// Dazu: Landesfilter („Musik in Sachsen“), „Zeig, was du kannst“ mit Ergebnis im Elternbereich, Inhaltspunkte der neuen Fächer im Elternbereich.
// Aufruf: sh tests/laufen.sh faechervoll   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const FAECHER = ["kunst", "musik", "werken", "sport", "ethik"];

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) { fehler.push(text); console.log("  ✗ " + text); } else console.log("  ✓ " + text); };
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
    return { ctx, p };
  }
  const oeffne = async (p, fach) => { await p.goto(BASIS + "spiele/sachkunde/?fach=" + fach); await p.waitForSelector("#themen .su-gruppe"); };
  const passt = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);

  async function durchklicken(p, fach, id, art) {
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
      if (lage.weiter) { await p.click("#weiter"); await p.waitForTimeout(60); continue; }
      if (lage.typ === "wahl") await p.locator(".optionen .option", { hasText: lage.schritt.optionen.find(o => o.ok).t }).first().click();
      else if (lage.typ === "daumen") await p.locator(".daumen .option").nth(lage.schritt.ok ? 0 : 1).click();
      else if (lage.typ === "zuordnen") {
        const ding = lage.schritt.dinge.filter(d => lage.karte.includes(d.t)).sort((a, b) => b.t.length - a.t.length)[0];
        if (!ding) { haengt = true; break; }
        await p.click(`.gruppen .option[data-g="${ding.gruppe}"]`); await p.waitForTimeout(900);
      } else { haengt = true; break; }
      await p.waitForTimeout(80);
    }
    const ende = await p.evaluate(() => ({ titel: document.getElementById("ende-titel").textContent, text: document.getElementById("ende-text").textContent }));
    const sterne = await p.evaluate((id) => ((Spielwelt.lade("sachkunde") || {}).themen || {})[id] || 0, id);
    if (BILDER && ["ku-farben", "mu-noten", "et-religionen", "sp-baderegeln"].includes(id)) await p.screenshot({ path: `${BILDER}/faechervoll-ende-${id}-${art}.png` });
    await oeffne(p, fach);
    return { ok: !haengt && !breit && /geschafft/.test(ende.titel) && /beim ersten Mal richtig/.test(ende.text), sterne, breit, haengt };
  }

  // Welche Themen gehören zu welcher Klasse (wie lernstandThemen: max(2, stufe | kl))
  const probe = await kind("2");
  await oeffne(probe.p, "kunst");
  const themen = await probe.p.evaluate(() => (window.FACH_THEMEN || []).map(t => ({ id: t.id, fach: t.fach, kl: Math.max(2, t.stufe || t.kl || 2), land: t.land || "" })));
  erwarte(themen.length === 70, `70 Themen in faecher.js (${themen.length})`);

  // --- Reiter, Gruppen, Landesfilter ---
  {
    const { p } = probe;
    await oeffne(p, "kunst");
    const r = await p.evaluate(() => ({ reiter: [...document.querySelectorAll("#fach-reiter .reiter")].map(a => a.dataset.fach), an: (document.querySelector("#fach-reiter .reiter.an") || {}).dataset,
      titel: document.querySelector("#liste-ansicht h1").textContent, gruppen: [...document.querySelectorAll(".su-gruppe")].map(g => g.dataset.lb) }));
    erwarte(r.reiter.join() === ",kunst,musik,werken,sport,ethik" && r.an && r.an.fach === "kunst" && r.titel === "Kunst" && r.gruppen.join() === "ku1,ku2,ku3",
      `Reiter Sachunterricht + fünf Fächer, Kunst aktiv, Gruppen nach Lernbereichen (${r.reiter.join("|")}; ${r.gruppen.join(",")})`);
    await p.click('#fach-reiter .reiter[data-fach="sport"]'); await p.waitForSelector("#themen .su-gruppe");
    const sport = await p.evaluate(() => [...document.querySelectorAll(".su-gruppe")].map(g => g.dataset.lb).join());
    erwarte(/fach=sport/.test(p.url()) && sport === "sp1,sp2,sp3,sp4,sp5,sp6", `Reiter „Sport“ öffnet Sport mit sechs Lernbereichen (${sport})`);
    await p.click('#fach-reiter .reiter[data-fach=""]'); await p.waitForSelector("#themen .su-gruppe");
    const su = await p.evaluate(() => ({ titel: document.querySelector("#liste-ansicht h1").textContent, lb: [...document.querySelectorAll(".su-gruppe")].map(g => g.dataset.lb).join(), kunst: !!document.querySelector('[data-id="ku-farben"]') }));
    erwarte(su.titel === "Sachunterricht" && su.lb === "zl,kg,pt,un,rz,ex" && !su.kunst, "Reiter „Sachunterricht“ zeigt wieder nur die Sachthemen");
    if (BILDER) { await oeffne(p, "musik"); await p.screenshot({ path: `${BILDER}/faechervoll-liste-musik-kl2.png` }); }
    await probe.ctx.close();
  }

  // --- Alle Themen echt durchklicken: Kl. 2, 3, 4 quer; je Fach eins hoch ---
  for (const kl of [2, 3, 4]) {
    const { ctx, p } = await kind(String(kl));
    for (const fach of FAECHER) {
      const liste = themen.filter(t => t.fach === fach && t.kl === kl);
      if (!liste.length) continue;
      await oeffne(p, fach);
      let gut = 0; const schlecht = [];
      for (const t of liste) { const r = await durchklicken(p, fach, t.id, "quer"); if (r.ok && r.sterne === 3) gut++; else schlecht.push(`${t.id}${r.breit ? " zu breit" : ""}${r.haengt ? " hängt" : ""} ${r.sterne}`); }
      erwarte(gut === liste.length, `Kl. ${kl} ${fach}: ${gut} von ${liste.length} Themen bis zum Ende ohne Fehler, 3 Sterne${schlecht.length ? " – " + schlecht.join(", ") : ""}`);
    }
    if (kl === 4) {
      // Landesfilter und Einklappen früherer Klassen
      await oeffne(p, "musik");
      const m = await p.evaluate(() => ({ sachsen: !!document.querySelector('[data-id="mu-sachsen"]'), frueher: !!document.querySelector('details.frueher [data-id="mu-noten"]'), jetzt: !!document.querySelector('.su-gruppe > .lektionen [data-id="mu-orchester"]') }));
      erwarte(m.sachsen && m.frueher && m.jetzt, "Kl. 4: „Musik in Sachsen“ sichtbar, Kl.-3-Themen eingeklappt, Kl.-4-Themen offen");
      await p.evaluate(() => { const e = Spielwelt.lade("eltern"); e.kind.land = "nw"; Spielwelt.speichere("eltern", e); }); await oeffne(p, "musik");
      erwarte(!(await p.$('[data-id="mu-sachsen"]')), "Landesfilter: „Musik in Sachsen“ nur für Kinder aus Sachsen");
      await p.evaluate(() => { const e = Spielwelt.lade("eltern"); e.kind.land = "sn"; Spielwelt.speichere("eltern", e); });
      // „Zeig, was du kannst“ in Ethik: echt durchspielen
      await oeffne(p, "ethik");
      await p.click('.su-gruppe[data-lb="et4"] .lernstand-knopf');
      await p.waitForSelector("#lektion-ansicht:not([hidden])");
      let runden = 0;
      while (runden++ < 40) {
        const lage = await p.evaluate(() => { const l = __sachkunde.lauf; const s = l && l.t.schritte[l.pos]; return { ende: !document.getElementById("ende-ansicht").hidden, s, weiter: !!document.getElementById("weiter") }; });
        if (lage.ende) break;
        if (lage.weiter) { await p.click("#weiter"); continue; }
        if (lage.s.typ === "wahl") await p.locator(".optionen .option", { hasText: lage.s.optionen.find(o => o.ok).t }).first().click();
        else await p.locator(".daumen .option").nth(lage.s.ok ? 0 : 1).click();
        await p.waitForTimeout(60);
      }
      const ls = await p.evaluate(() => ((Spielwelt.lade("sachkunde") || {}).lernstand || {})["k4:et4"]);
      erwarte(ls && ls.n >= 1 && ls.richtig === ls.n, `Ethik Kl. 4 „Zeig, was du kannst“ (Wir in der Welt) gespeichert: ${ls ? ls.richtig + " von " + ls.n : "fehlt"}`);
      // Elternbereich: neue Fächer im Lehrplan und das Lernstand-Ergebnis
      await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300);
      if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
      await p.waitForSelector(".lp-punkte");
      const e = await p.evaluate(() => {
        const fach = (n) => { const h = [...document.querySelectorAll("h3.lp-fach")].find(x => x.textContent.startsWith(n)); const ul = h && h.nextElementSibling;
          return ul ? { lb: ul.querySelectorAll(":scope > li").length, punkte: ul.querySelectorAll(".lp-punkte li").length, welt: ul.textContent.includes("🌍") } : null; };
        return { kunst: fach("Kunst"), musik: fach("Musik"), werken: fach("Werken"), sport: fach("Sport"), ethik: fach("Ethik"), ls: (document.getElementById("lernstand-sachkunde") || {}).textContent || "" };
      });
      erwarte(e.kunst && e.kunst.lb === 3 && e.musik && e.musik.lb === 4 && e.werken && e.werken.lb === 3 && e.sport && e.sport.lb === 5 && e.sport.welt && e.ethik && e.ethik.lb === 4,
        `Elternbereich Kl. 4: Kunst 3, Musik 4, Werken 3, Sport 5 (mit 🌍), Ethik 4 Lernbereiche (${JSON.stringify(e).slice(0, 200)})`);
      erwarte(/Ethik: Wir in der Welt/.test(e.ls), `Elternbereich zeigt „Zeig, was du kannst“ Ethik (${e.ls.slice(0, 90)})`);
      if (BILDER) { await p.evaluate(() => [...document.querySelectorAll("h3.lp-fach")].find(x => x.textContent.startsWith("Sport")).scrollIntoView()); await p.screenshot({ path: `${BILDER}/faechervoll-eltern-sport.png` }); }
    }
    await ctx.close();
  }
  {
    const { ctx, p } = await kind("2", 390, 760);
    for (const [fach, id] of [["kunst", "ku-farben"], ["musik", "mu-rhythmus"], ["werken", "we-bauen"], ["sport", "sp-baderegeln"], ["ethik", "et-klasse"]]) {
      await oeffne(p, fach);
      const r = await durchklicken(p, fach, id, "hoch");
      erwarte(r.ok && r.sterne === 3, `hoch (390 × 760): „${id}“ bis zum Ende, keine Scrollleiste${r.breit ? " – zu breit" : ""}`);
    }
    await oeffne(p, "kunst");
    erwarte(await passt(p), "hoch: Themenliste mit Reitern ohne waagerechte Scrollleiste");
    if (BILDER) await p.screenshot({ path: `${BILDER}/faechervoll-liste-hoch.png` });
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Fächer-Test (Kunst, Musik, Werken, Sport, Ethik) bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
