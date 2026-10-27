// Test NA-36 + Paket A: Wörter-Werkstatt Klasse 3–4 (Präteritum, Perfekt/Futur, Satzglieder, … Geschichte, Brief, Bericht, Wörterbuch, Vortrag)
// Sichtbarkeit je Klasse, jeder Schritt lässt sich anzeigen, richtige Lücke wird angenommen, keine Scrollleiste, keine Konsolenfehler.
// Paket A: Schritt-Typen „ordnen“ und „verbessern“ werden echt angetippt (Karten der Reihe nach, störendes Wort, bessere Variante).
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const NEU = ["w-praeteritum", "w-perfekt", "w-satzglieder", "w-satzzeichen", "w-kurz-lang", "w-ableiten", "w-dehnung", "w-rede", "w-textsorten", "w-lesen-igel", "w-lesen-vergleich", "w-steigerung", "w-pronomen", "w-komma", "w-vornach", "w-faelle", "w-meinung",
  "w-geschichte-ordnen", "w-satzanfaenge", "w-brief", "w-bericht", "w-woerterbuch", "w-vortrag"];

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  async function kind(stufe, breite, hoehe) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    await p.goto(BASIS + "spiele/deutsch/"); await p.waitForTimeout(500);
    return { ctx, p };
  }
  const kacheln = (p) => p.evaluate(() => [...document.querySelectorAll("#werkstatt button.ort")].map(b => b.getAttribute("aria-label")));
  // Sichtbarkeit je Klasse
  for (const [stufe, anzahl] of [["1", 7], ["2", 26], ["3", 33]]) {
    const { ctx, p } = await kind(stufe, 1180, 820);
    const k = await kacheln(p);
    erwarte(k.length === anzahl, `Klasse ${stufe}: ${anzahl} Werkstatt-Kapitel sichtbar (${k.length})`);
    await ctx.close();
  }
  for (const [breite, hoehe, art] of [[1180, 820, "quer"], [390, 760, "hoch"]]) {
    const { ctx, p } = await kind("3", breite, hoehe);
    const idx = await p.evaluate((neu) => neu.map(id => WERKSTATT.findIndex(k => k.id === id)), NEU);
    if (art === "quer") {
      const lz = await p.evaluate((neu) => WERKSTATT.filter(k => neu.includes(k.id)).every(k => k.lz.length && k.stufe && k.schritte.every(s => s.ru)), NEU);
      erwarte(idx.every(i => i >= 0) && lz, "neue Kapitel mit Lernziel, Klasse und russischem Entwurf");
    }
    let falschGeprueft = false;
    for (let n = 0; n < NEU.length; n++) {
      await p.evaluate((i) => __deutsch.starte(i, WERKSTATT), idx[n]); await p.waitForTimeout(200);
      const anz = await p.evaluate(() => __deutsch.lauf.k.schritte.length);
      let ok = true, angenommen = true;
      for (let s = 0; s < anz; s++) {
        const r = await p.evaluate((s) => { __deutsch.schritt(s); const x = __deutsch.lauf.k.schritte[s]; return { passt: document.documentElement.scrollWidth <= innerWidth + 1, typ: x.typ, richtig: (x.optionen || [])[0], teile: x.teile, satz: x.satz, falsch: x.falsch, stelle: x.stelle }; }, s);
        if (!r.passt) { ok = false; console.log(`    Scrollleiste: ${NEU[n]} Schritt ${s}`); }
        if (r.typ === "ordnen") {
          // Erste Ordnen-Aufgabe im Querformat: einmal falsch herum legen – richtige Karten vorn bleiben, Rest geht zurück
          if (art === "quer" && !falschGeprueft) {
            falschGeprueft = true;
            for (const t of r.teile.slice().reverse()) await p.click(`#ordnen-karten .okarte:not(.weg) >> text="${t}"`);
            await p.click("#pruefen");
            const nachFehler = await p.evaluate(() => ({ nein: document.querySelector("#hinweis").classList.contains("nein"), liegen: __deutsch.lauf.gewaehlt.length }));
            erwarte(nachFehler.nein && nachFehler.liegen === 0, "ordnen: falsche Reihenfolge wird erkannt, Karten gehen zurück");
          }
          for (const t of r.teile) await p.click(`#ordnen-karten .okarte:not(.weg) >> text="${t}"`);
          await p.click("#pruefen"); await p.waitForTimeout(80);
          const gut = await p.evaluate(() => document.querySelector("#ordnen-liste").classList.contains("richtig") && document.querySelector("#hinweis").classList.contains("gut"));
          if (!gut) { angenommen = false; console.log(`    ordnen nicht angenommen: ${NEU[n]} Schritt ${s}`); }
          const passtNoch = await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
          if (!passtNoch) { ok = false; console.log(`    Scrollleiste nach dem Ordnen: ${NEU[n]} Schritt ${s}`); }
        }
        if (r.typ === "verbessern") {
          const woerter = r.satz.split(" "), kern = (w) => w.replace(/[.,!?:;„“"]/g, "");
          const ziel = r.stelle != null ? r.stelle : woerter.findIndex(w => kern(w) === r.falsch);
          const anderes = woerter.findIndex((w, i) => i !== ziel && kern(w) !== r.falsch);
          await p.click(`.vb-wort[data-n="${anderes}"]`);
          const erstFalsch = await p.evaluate(() => document.querySelector("#vb-optionen").hidden && document.querySelector("#hinweis").classList.contains("nein"));
          await p.click(`.vb-wort[data-n="${ziel}"]`);
          await p.click(`#vb-optionen .option >> text="${r.richtig}"`); await p.waitForTimeout(80);
          const gut = await p.evaluate((w) => !!document.querySelector("#vb-optionen .option.richtig") && document.querySelector(".vb-wort.gefunden").textContent.includes(w), r.richtig);
          if (!(erstFalsch && gut)) { angenommen = false; console.log(`    verbessern nicht angenommen: ${NEU[n]} Schritt ${s}`); }
        }
        if (r.typ === "luecke") {
          await p.evaluate((t) => [...document.querySelectorAll(".optionen .option")].find(b => b.textContent === t).click(), r.richtig); await p.waitForTimeout(80);
          const gut = await p.evaluate(() => !!document.querySelector(".option.richtig"));
          if (!gut) angenommen = false;
        }
      }
      erwarte(ok && angenommen, `${art}: „${NEU[n]}“ – ${anz} Schritte, richtige Antworten angenommen, keine Scrollleiste`);
      if (BILDER) { await p.evaluate(() => __deutsch.schritt(1)); await p.screenshot({ path: `${BILDER}/deutsch34-${NEU[n]}-${art}.png` }); }
    }
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Deutsch-Kl.-3/4-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
