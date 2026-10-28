// Test Schuljahr Deutsch (Lehrplan Sachsen 2025 in voller Tiefe, 28.10.2026): 52 neue Werkstatt-Kapitel für Kl. 1/2, 3 und 4.
// Werkstatt nach Lernbereichen gruppiert (frühere Klassen eingeklappt), jedes neue Kapitel echt bis zum Ende durchgespielt
// (Antworten antippen, Karten ordnen, Wörter verbessern, Sätze legen, Silben zählen, Hörtexte und Blitzwörter, Texte tippen) bis zur
// Sternewertung, Kapitel per Kachel geöffnet, Inhaltspunkte Deutsch im Elternbereich.
// Aufruf: sh tests/laufen.sh deutschvoll   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const NEU12 = ["w-erzaehlen", "w-sprechen", "w-sprachen", "w-gespraech", "w-auswendig", "w-zuhoeren", "w-laute", "w-silbe-lang-kurz", "w-wortbau", "w-satzarten",
  "w-detektiv", "w-merkwoerter", "w-glueckwunsch", "w-beschreiben", "w-elfchen", "w-ueberarbeiten", "w-lautlesen", "w-lesedetektiv", "w-maerchen", "w-sachtexte",
  "w-medien", "w-teekessel", "w-verbformen", "w-begleiter"];
const NEU34 = ["w-sprachvielfalt", "w-rueckmeldung", "w-pro-kontra", "w-theater", "w-zuhoeren-profi", "w-nomen-erkennen", "w-trennen", "w-merkwoerter3", "w-email",
  "w-tagebuch", "w-anleitung", "w-weiterschreiben", "w-textlupe", "w-digital-schreiben", "w-lesen-fledermaus", "w-fabel", "w-hoerspiel", "w-buch-finden", "w-gemeint",
  "w-proben", "w-ueberzeugen", "w-interview", "w-fair", "w-rechtschreib4", "w-lesen4", "w-sage-comic", "w-medien4", "w-ergaenzungen"];

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  async function kind(stufe, breite = 1180, hoehe = 820) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__elternAlle = true; window.__testSchnell = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    await p.goto(BASIS + "spiele/deutsch/"); await p.waitForSelector("#werkstatt .werk-gruppe");
    return { ctx, p };
  }
  const passt = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  const guterText = (s) => {
    if (s.liste) return (s.karten || ["Apfel", "Birne", "Brot", "Milch"]).concat(s.pflicht || []).concat(["Sonne", "Mond", "Stern", "Wolke", "Regen", "Wind", "Baum"]).slice(0, Math.max(s.woerter || 5, 4)).join(", ");
    const n = Math.max(s.saetze || 1, Math.ceil((s.woerter || 5) / 8));
    return (s.anfang || "") + Array.from({ length: n }, (_, i) => `${["Heute", "Dann", "Danach", "Am Ende", "Zum Schluss"][i % 5]} schreibe ich etwas über ${(s.pflicht || ["meine Freunde"]).join(" und ")} für dich.`).join(" ");
  };

  // Ein Kapitel echt bis zum Ende durchspielen: über die Kachel öffnen, jeden Schritt wie ein Kind beantworten
  async function durchspielen(p, id, art) {
    const kachel = `#werkstatt button.ort[data-id="${id}"]`;
    await p.evaluate((sel) => { const b = document.querySelector(sel); const d = b && b.closest("details"); if (d) d.open = true; }, kachel);
    await p.click(kachel); await p.waitForSelector("#kapitel-ansicht:not([hidden])");
    let ok = true; const typen = new Set();
    for (let schutz = 0; schutz < 40; schutz++) {
      const r = await p.evaluate(() => {
        if (!document.querySelector("#ende-ansicht").hidden) return { ende: true };
        const l = __deutsch.lauf, x = l.k.schritte[l.pos];
        return { pos: l.pos, typ: x.typ, richtig: (x.optionen || [])[0], teile: x.teile, satz: x.satz, falsch: x.falsch, stelle: x.stelle, woerter: x.woerter,
          saetze: x.saetze, pflicht: x.pflicht, karten: x.karten, liste: x.liste, anfang: x.anfang, wort: x.wort };
      });
      if (r.ende) break;
      typen.add(r.typ);
      if (!(await passt(p))) { ok = false; console.log(`    Scrollleiste: ${id} Schritt ${r.pos} (${art})`); }
      if (BILDER && (r.typ === "hoertext" || r.typ === "blitz") && !typen.has("bild-" + r.typ)) { typen.add("bild-" + r.typ); await p.screenshot({ path: `${BILDER}/deutschvoll-${r.typ}-${id}-${art}.png` }); }
      const vorher = r.pos;
      if (r.typ === "sag") await p.click("#weiter", { force: true });
      else if (["luecke", "wort", "hoertext", "blitz"].includes(r.typ)) {
        if (r.typ === "blitz") await p.waitForFunction(() => document.querySelector("#blitz-wort").style.visibility === "visible", null, { timeout: 3000 });
        await p.evaluate((t) => [...document.querySelectorAll(".optionen .option")].find(b => b.textContent === t).click(), r.richtig);
      } else if (r.typ === "ordnen") { for (const t of r.teile) await p.click(`#ordnen-karten .okarte:not(.weg) >> text="${t}"`); await p.click("#pruefen"); }
      else if (r.typ === "satz") { for (const t of r.woerter) await p.click(`#chips .chip:not(.weg) >> text="${t}"`); await p.click("#pruefen"); }
      else if (r.typ === "silben") await p.click(`.optionen .option[data-wert="${r.teile.length}"]`);
      else if (r.typ === "verbessern") {
        const w = r.satz.split(" "), kern = (x) => x.replace(/[.,!?:;„“"]/g, "");
        const ziel = r.stelle != null ? r.stelle : w.findIndex(x => kern(x) === r.falsch);
        await p.click(`.vb-wort[data-n="${ziel}"]`); await p.click(`#vb-optionen .option >> text="${r.richtig}"`);
      } else if (r.typ === "schreiben") {
        await p.fill("#schreibfeld", guterText(r));
        await p.click("#pruefen");
        const gut = await p.evaluate(() => document.querySelector("#hinweis").classList.contains("gut") && !!document.querySelector("#weiter"));
        if (!gut) { ok = false; console.log(`    Text nicht angenommen: ${id} Schritt ${r.pos}: ${await p.textContent("#hinweis")}`); }
        await p.click("#weiter");
      } else { ok = false; console.log(`    unerwarteter Schritt ${r.typ} in ${id}`); break; }
      await p.waitForFunction((v) => !document.querySelector("#ende-ansicht").hidden || __deutsch.lauf.pos !== v, vorher, { timeout: 6000 });
    }
    const sterne = await p.evaluate((id) => ((Spielwelt.lade("deutsch") || {}).kapitel || {})[id] || 0, id);
    const fehlerZahl = await p.evaluate(() => __deutsch.lauf.fehler);
    await p.goto(BASIS + "spiele/deutsch/"); await p.waitForSelector("#werkstatt .werk-gruppe");
    return { ok: ok && fehlerZahl === 0, sterne, typen };
  }

  // --- Werkstatt nach Lernbereichen, frühere Klassen eingeklappt ---
  {
    const { ctx, p } = await kind("2");
    const g = await p.evaluate(() => [...document.querySelectorAll(".werk-gruppe")].map(x => ({ lb: x.dataset.lb, titel: x.querySelector("h3").textContent, n: x.querySelectorAll("button.ort").length, eingeklappt: x.querySelectorAll("details.frueher").length })));
    erwarte(g.map(x => x.lb).join() === "sz,sc,le,tm,su" && g.every(x => x.n >= 5) && g.every(x => !x.eingeklappt),
      `Kl. 2: fünf Lernbereiche mit Überschrift (${g.map(x => `${x.titel} ${x.n}`).join(", ")}), nichts eingeklappt`);
    const lesen = await p.evaluate(() => !!document.querySelector('.werk-gruppe[data-lb="le"] #zu-lesen'));
    erwarte(lesen, "„Lesen und Schreiben“ steht im Lernbereich Lesen");
    const k4 = await p.evaluate(() => !!document.querySelector('#werkstatt [data-id="w-ergaenzungen"]'));
    erwarte(!k4, "Kl. 2 sieht noch keine Kl.-4-Kapitel");
    if (BILDER) { await p.evaluate(() => document.querySelector("#werkstatt").scrollIntoView()); await p.screenshot({ path: `${BILDER}/deutschvoll-werkstatt-kl2.png` }); }
    await ctx.close();
  }
  {
    const { ctx, p } = await kind("4");
    const g = await p.evaluate(() => [...document.querySelectorAll(".werk-gruppe")].map(x => ({ lb: x.dataset.lb, sichtbar: x.querySelectorAll(":scope > .orte button.ort").length, frueher: x.querySelectorAll("details.frueher button.ort").length, offen: x.querySelector("details.frueher") ? x.querySelector("details.frueher").open : false })));
    const kl2 = await p.evaluate(() => !!document.querySelector('details.frueher [data-id="w-laute"]') && !!document.querySelector('.werk-gruppe > .orte [data-id="w-ergaenzungen"]'));
    erwarte(g.every(x => x.frueher > 0 && !x.offen) && kl2, `Kl. 4: Kapitel aus Kl. 1–3 eingeklappt unter „Wiederholen“ (${g.map(x => `${x.lb} ${x.sichtbar}+${x.frueher}`).join(", ")})`);
    if (BILDER) { await p.evaluate(() => document.querySelector("#werkstatt").scrollIntoView()); await p.screenshot({ path: `${BILDER}/deutschvoll-werkstatt-kl4.png` }); }
    await ctx.close();
  }

  // --- Alle neuen Kapitel echt durchspielen (quer), ein Teil auch hoch (Handy) ---
  const alleTypen = new Set();
  for (const [stufe, liste, breite, hoehe, art] of [["2", NEU12, 1180, 820, "quer"], ["4", NEU34, 1180, 820, "quer"],
    ["2", ["w-zuhoeren", "w-merkwoerter", "w-begleiter", "w-elfchen"], 390, 760, "hoch"], ["4", ["w-pro-kontra", "w-lesen4", "w-theater", "w-proben"], 390, 760, "hoch"]]) {
    const { ctx, p } = await kind(stufe, breite, hoehe);
    for (const id of liste) {
      const r = await durchspielen(p, id, art);
      r.typen.forEach(t => alleTypen.add(t));
      erwarte(r.ok && r.sterne === 3, `${art}, Kl. ${stufe}: „${id}“ bis zum Ende durchgespielt, 3 Sterne, keine Scrollleiste (${r.sterne} Sterne)`);
    }
    if (art === "quer" && stufe === "4") {
      // Elternbereich: Inhaltspunkte Deutsch Kl. 4 mit Werkstatt-Fortschritt
      await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300);
      if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
      await p.waitForSelector(".lp-punkte");
      const lp = await p.evaluate(() => {
        const de = [...document.querySelectorAll("h3.lp-fach")].find(h => /^Deutsch/.test(h.textContent));
        const ul = de && de.nextElementSibling;
        return { punkte: ul ? ul.querySelectorAll(".lp-punkte li").length : 0, werkstatt: ul ? [...ul.querySelectorAll(".lp-werkstatt")].map(x => x.textContent) : [] };
      });
      erwarte(lp.punkte === 47 && lp.werkstatt.length === 5 && lp.werkstatt.some(t => !t.startsWith("0 ")),
        `Elternbereich Kl. 4: 47 Inhaltspunkte Deutsch, je Lernbereich „Werkstatt: x von y Kapiteln“ (${lp.punkte}; ${lp.werkstatt.join(" | ")})`);
      if (BILDER) { await p.evaluate(() => { document.querySelectorAll(".lp-punkte").forEach(d => d.open = true); [...document.querySelectorAll("h3.lp-fach")].find(h => /^Deutsch/.test(h.textContent)).scrollIntoView(); }); await p.screenshot({ path: `${BILDER}/deutschvoll-eltern.png` }); }
    }
    await ctx.close();
  }
  erwarte(["hoertext", "blitz", "schreiben", "ordnen", "verbessern", "satz", "silben", "luecke"].every(t => alleTypen.has(t)), `alle Schritt-Typen kamen dran (${[...alleTypen].join(", ")})`);

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Deutsch-Schuljahr-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
