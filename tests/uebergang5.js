// Test NA-39: Übergang Klasse 5 – eigener Matheweg (10 Stationen, Urkunde), Deutsch-Kapitel „Fachbegriffe“ und „Lesestrategien“,
// Sachthemen „Lernen lernen“ und „Neue Schule“ (sichtbar ab Kl. 4, nicht in Kl. 3), Elternbereich-Hinweis und Elternbericht.
// Deutsch und Sachunterricht werden echt durchgeklickt bis zum Ende, ohne Fehler. Keine Konsolenfehler, keine waagerechte Scrollleiste.
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const DEUTSCH = ["w-fachbegriffe", "w-lesestrategien"], THEMEN_NEU = ["lernen-lernen", "neue-schule"];

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  const passt = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  async function kind(stufe, breite = 1180, hoehe = 820, pruefeHinweis = false) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    if (pruefeHinweis) { const h = await p.evaluate(() => { const e = document.getElementById("e-stufe-hinweis"); return !e.hidden && e.textContent; });
      erwarte(h && /Übergang 5/.test(h) && /bewertet nicht/.test(h), "Elternbereich: ehrlicher Hinweis zur Stufe „Übergang Klasse 5“ (eigener Matheweg, keine Schulform-Bewertung)"); }
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  const wegInfo = (p) => p.evaluate(() => ({ an: (document.querySelector(".weg-wahl.an") || {}).dataset?.weg, stationen: document.querySelectorAll("#karte .station:not(.ziel)").length,
    erste: (document.querySelector("#karte .station .name") || {}).textContent, knoepfe: document.querySelectorAll(".weg-wahl").length }));

  // ---------- Mathe ----------
  for (const [breite, hoehe, art] of [[1180, 820, "quer"], [390, 760, "hoch"]]) {
    const { ctx, p } = await kind("5", breite, hoehe, art === "quer");
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForSelector("#karte .station");
    const w = await wegInfo(p);
    erwarte(w.an === "k5" && w.stationen === 26 && w.erste === "Fit aus Klasse 4" && w.knoepfe === 5, `${art}: Stufe 5 startet auf „Übergang 5“ mit 26 Stationen (${w.an}, ${w.stationen})`);
    erwarte(await passt(p), `${art}: Matheweg ohne waagerechte Scrollleiste (5 Weg-Knöpfe)`);
    await bild(p, "ue5-weg-" + art);
    if (art === "quer") {
      for (let s = 0; s < 10; s++) {
        await p.evaluate((n) => __mathe.starte(n), s); await p.waitForTimeout(150);
        const info = await p.evaluate(() => { const a = __mathe.lauf.liste[0], svg = document.querySelector(".bild svg"), r = svg && svg.getBoundingClientRect();
          return { antwort: a.antwort, zahl: a.art === "zahl", n: __mathe.lauf.liste.length, bild: !!a.bild, sichtbar: !a.bild || (!!svg && r.width > 60 && r.height > 40), id: __mathe.lauf.station || "" }; });
        if (info.zahl) { for (const z of info.antwort) await p.click(`.taste[data-ziffer="${z}"]`); await p.click('.taste[data-tun="ok"]'); }
        else await p.evaluate((x) => __mathe.antworte(x), info.antwort);
        await p.waitForTimeout(200);
        const gut = await p.evaluate(() => /\bgut\b/.test(document.getElementById("rueck").className));
        if (!(gut && info.n === 10 && info.sichtbar && await passt(p))) fehler.push(`Übergang 5 Station ${s}: ${info.antwort} nicht angenommen, Bild fehlt oder Scrollleiste`);
        if ([1, 3, 6, 7, 8].includes(s)) await bild(p, "ue5-station-" + s);
        await p.waitForTimeout(1000);
      }
      erwarte(!fehler.some(f => f.startsWith("Übergang 5 Station")), "alle 10 Stationen: 10 Aufgaben, richtige Antwort angenommen, Bilder sichtbar");
      // Urkunde „Fit für Klasse 5“ – gesperrt, dann frei
      await p.waitForTimeout(1100);
      await p.evaluate(() => document.getElementById("zum-weg") && document.getElementById("zum-weg").click()); await p.waitForTimeout(300);
      erwarte(await p.evaluate(() => { const z = document.getElementById("urkunde-ziel"); return !!z && z.classList.contains("zu"); }), "Ziel „Urkunde“ am Ende von Übergang 5, noch gesperrt");
      await p.evaluate(() => { const d = Spielwelt.lade("mathe") || {}; d.k5 = d.k5 || {}; d.k4 = d.k4 || {}; Mathe.STATIONEN_K5.forEach(s => { d.k5[s.id] = 3; }); Mathe.STATIONEN_K4.forEach(s => { d.k4[s.id] = 2; }); Spielwelt.speichere("mathe", d); });
      await p.reload(); await p.waitForSelector("#urkunde-ziel"); await p.click("#urkunde-ziel"); await p.waitForTimeout(300);
      erwarte(await p.evaluate(() => { const u = document.getElementById("urkunde"); return !!u && /Fit für Klasse 5/.test(u.textContent) && /Übergang 5: 26 von 26/.test(u.textContent) && !document.getElementById("urkunde-weiter"); }),
        "Urkunde „Fit für Klasse 5“ mit 26 von 26 Stationen");
      await bild(p, "ue5-urkunde"); await p.click("#urkunde-zu");
      // Von der Kl.-4-Urkunde geht es zum Übergang 5
      await p.click('.weg-wahl[data-weg="k4"]'); await p.waitForTimeout(300); await p.click("#urkunde-ziel"); await p.waitForTimeout(300);
      await p.click("#urkunde-weiter"); await p.waitForTimeout(300);
      erwarte((await wegInfo(p)).an === "k5", "Kl.-4-Urkunde: Knopf „Zum Übergang 5“ wechselt auf den Übergangsweg");
      // Elternbericht
      await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(400);
      if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(500); }
      const bericht = await p.evaluate(() => document.body.textContent);
      erwarte(/Übergang 5: Brüche erkennen/.test(bericht), "Elternbericht listet „Übergang 5: Brüche erkennen“");
    }
    await ctx.close();
  }

  // ---------- Sichtbarkeit: Kl. 3 sieht die Übergangs-Inhalte nicht, Kl. 4 schon ----------
  for (const [stufe, soll] of [["3", false], ["4", true]]) {
    const { ctx, p } = await kind(stufe);
    await p.goto(BASIS + "spiele/deutsch/"); await p.waitForTimeout(400);
    const de = await p.evaluate(() => [...document.querySelectorAll("#werkstatt button.ort")].map(b => b.getAttribute("aria-label")));
    await p.goto(BASIS + "spiele/sachkunde/"); await p.waitForTimeout(400);
    const su = await p.evaluate(() => [...document.querySelectorAll("#themen button")].map(b => b.textContent));
    const hat = de.includes("Fachbegriffe für Klasse 5") && de.includes("Lesestrategien") && su.some(t => t.includes("Lernen lernen")) && su.some(t => t.includes("Neue Schule"));
    const keins = !de.includes("Fachbegriffe für Klasse 5") && !su.some(t => t.includes("Neue Schule"));
    erwarte(soll ? hat : keins, `Klasse ${stufe}: Übergangs-Kapitel und -Themen ${soll ? "sichtbar" : "verborgen"} (${de.length} Kapitel, ${su.length} Themen)`);
    await ctx.close();
  }

  // ---------- Deutsch und Sachunterricht echt durchklicken (quer und hoch) ----------
  for (const [breite, hoehe, art] of [[1180, 820, "quer"], [390, 760, "hoch"]]) {
    const { ctx, p } = await kind("5", breite, hoehe);
    await p.goto(BASIS + "spiele/deutsch/"); await p.waitForTimeout(400);
    for (const id of DEUTSCH) {
      await p.evaluate((id) => __deutsch.starte(WERKSTATT.findIndex(k => k.id === id), WERKSTATT), id); await p.waitForTimeout(200);
      let runden = 0, haengt = false, scroll = false;
      while (runden++ < 40) {
        const lage = await p.evaluate(() => ({ ende: !document.getElementById("ende-ansicht").hidden, l: __deutsch.lauf && { pos: __deutsch.lauf.pos, s: __deutsch.lauf.k.schritte[__deutsch.lauf.pos] } }));
        if (lage.ende || !lage.l || !lage.l.s) break;
        const s = lage.l.s;
        if (!(await passt(p))) scroll = true;
        if (s.typ === "sag") await p.click("#weiter");
        else if (s.typ === "luecke") await p.locator(".optionen .option", { hasText: s.optionen[0] }).first().click();
        else if (s.typ === "ordnen") { for (const t of s.teile) await p.click(`#ordnen-karten .okarte:not(.weg) >> text="${t}"`); await p.click("#pruefen"); }
        else if (s.typ === "verbessern") { const w = s.satz.split(" "), z = s.stelle != null ? s.stelle : w.findIndex(x => x.replace(/[.,!?:;„“"]/g, "") === s.falsch);
          await p.click(`.vb-wort[data-n="${z}"]`); await p.click(`#vb-optionen .option >> text="${s.optionen[0]}"`); }
        else { haengt = true; break; }
        if (s.typ !== "sag") { if (BILDER && runden < 4) await bild(p, `ue5-${id}-${art}-${runden}`); await p.waitForFunction((pos) => !__deutsch.lauf || __deutsch.lauf.pos !== pos || !document.getElementById("ende-ansicht").hidden, lage.l.pos, { timeout: 5000 }).catch(() => { haengt = true; }); }
        else await p.waitForTimeout(150);
        if (haengt) break;
      }
      const ende = await p.evaluate(() => ({ an: !document.getElementById("ende-ansicht").hidden, text: document.getElementById("ende-text").textContent }));
      erwarte(!haengt && !scroll && ende.an && /beim ersten Mal richtig/.test(ende.text), `${art}: Deutsch „${id}“ echt durchgeklickt, ohne Fehler und ohne Scrollleiste`);
    }
    await p.goto(BASIS + "spiele/sachkunde/"); await p.waitForTimeout(400);
    for (const id of THEMEN_NEU) {
      await p.evaluate((id) => __sachkunde.starte(THEMEN.findIndex(t => t.id === id)), id); await p.waitForTimeout(200);
      let runden = 0, haengt = false, scroll = false;
      while (runden++ < 60) {
        const lage = await p.evaluate(() => { const l = __sachkunde.lauf; const s = l && l.t.schritte[l.pos];
          return { ende: !document.getElementById("ende-ansicht").hidden, typ: s && s.typ, schritt: s, weiter: !!document.getElementById("weiter"), karte: (document.querySelector(".sortier-karte") || {}).innerText || "" }; });
        if (lage.ende) break;
        if (!(await passt(p))) scroll = true;
        if (lage.weiter) { await p.click("#weiter"); await p.waitForTimeout(120); continue; }
        if (lage.typ === "wahl") await p.locator(".optionen .option", { hasText: lage.schritt.optionen.find(o => o.ok).t }).first().click();
        else if (lage.typ === "daumen") await p.locator(".daumen .option").nth(lage.schritt.ok ? 0 : 1).click();
        else if (lage.typ === "zuordnen") { const d = lage.schritt.dinge.find(x => lage.karte.includes(x.t)); if (!d) { haengt = true; break; }
          await p.click(`.gruppen .option[data-g="${d.gruppe}"]`); await p.waitForTimeout(900); }
        else { haengt = true; break; }
        await p.waitForTimeout(150);
      }
      const ende = await p.evaluate(() => ({ titel: document.getElementById("ende-titel").textContent, text: document.getElementById("ende-text").textContent }));
      erwarte(!haengt && !scroll && /geschafft/.test(ende.titel) && /beim ersten Mal richtig/.test(ende.text), `${art}: Sachthema „${id}“ echt durchgeklickt, ohne Fehler und ohne Scrollleiste`);
    }
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Übergang-5-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
