// Test „Lücken in den Hauptfächern“ (29.10.2026): Mein Heft (Text in der Werkstatt echt getippt, im Heft wiedergefunden und vorgelesen),
// Schreibschrift (Schulausgangsschrift: Buchstaben und ein verbundenes Wort mit dem Finger nachgespurt, Eltern-Schalter), Englisch-Lernkartei
// (Fehler heute → morgen als Wiederholung, zählt nicht gegen die Sterne), Lieder und Reime (Englisch „Songs and rhymes“, Lied-Schritt in einer
// Lektion, Atelier „Mitsingen“ bis zum Ende). Keine Konsolenfehler, keine waagerechte Scrollleiste.
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  const passt = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  async function kind(stufe, breite = 1180, hoehe = 820) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__testSchnell = true; window.__liederSchnell = true;
      window.__heute = localStorage.getItem("__heuteTest") || "2026-10-25"; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  const sprachSpion = (p) => p.evaluate(() => { window.__gesprochen = []; Sprache.verfuegbar = () => true; Sprache.hat = () => true;
    Sprache.sprich = (t, l, f) => { window.__gesprochen.push([t, l]); if (f) setTimeout(f, 10); }; Sprache.stopp = () => {}; });

  // ---------- Mein Heft ----------
  for (const [breite, hoehe, art] of [[1180, 820, "quer"], [390, 760, "Handy"]]) {
    const { ctx, p } = await kind("3", breite, hoehe);
    await p.goto(BASIS + "spiele/heft/"); await p.waitForTimeout(400);
    erwarte(await p.evaluate(() => /noch leer/.test(document.getElementById("blatt").textContent)) && await passt(p), `Heft ${art}: leer mit freundlichem Hinweis`);
    // In der Werkstatt einen Text echt tippen (Kapitel „Eine Einladung schreiben“)
    await p.goto(BASIS + "spiele/deutsch/"); await p.waitForTimeout(500);
    erwarte(!!(await p.$("#heft-link")), `Werkstatt ${art}: Knopf „Mein Heft“ oben`);
    await p.evaluate(() => __deutsch.starte(WERKSTATT.findIndex(k => k.id === "w-einladung"), WERKSTATT)); await p.waitForTimeout(150);
    const text = "Liebe Lena, ich lade dich zu meinem Fest ein. Es ist am Samstag um drei Uhr bei mir im Garten. Kommst du?";
    let geschrieben = false;
    for (let n = 0; n < 30 && !geschrieben; n++) {
      const s = await p.evaluate(() => { const l = __deutsch.lauf, x = l.k.schritte[l.pos]; return { pos: l.pos, typ: x.typ, pflicht: x.pflicht || [] }; });
      if (s.typ !== "schreiben") { await p.evaluate((pos) => __deutsch.schritt(pos + 1), s.pos); await p.waitForTimeout(60); continue; }
      const t = text + (s.pflicht.length ? " " + s.pflicht.join(" und ") + " sind dabei." : "");
      await p.fill("#schreibfeld", t); await p.click("#pruefen");
      await p.waitForSelector("#gespeichert", { timeout: 4000 }).catch(() => {});
      erwarte(/in deinem Heft/.test(await p.evaluate(() => (document.getElementById("gespeichert") || {}).textContent || "")), `Werkstatt ${art}: „Gespeichert in deinem Heft“`);
      geschrieben = true;
    }
    // Über „Mein Ich“ ins Heft
    await p.goto(BASIS + "spiele/ich/"); await p.waitForTimeout(400);
    await p.click("#heft-link"); await p.waitForURL(/heft/); await p.waitForTimeout(500);
    await sprachSpion(p);
    const im = await p.evaluate(() => ({ n: __heft.anzahl().text, t: document.querySelector(".seite .text") && document.querySelector(".seite .text").textContent, kap: document.querySelector(".seite .kopf").textContent }));
    erwarte(im.n === 1 && /Liebe Lena/.test(im.t || "") && /Einladung/.test(im.kap), `Heft ${art}: der getippte Text steht mit Kapitel und Datum im Heft`);
    await p.click(".vorlesen");
    erwarte(await p.evaluate(() => window.__gesprochen.some(([t, l]) => /Liebe Lena/.test(t) && l === "de-DE")), `Heft ${art}: „Vorlesen“ liest den eigenen Text vor`);
    await p.click("#r-ton"); await p.waitForTimeout(150);
    erwarte(await p.evaluate(() => /Eltern im Elternbereich erlauben/.test(document.getElementById("blatt").textContent)) && await passt(p), `Heft ${art}: Aufnahmen-Reiter mit ehrlichem Hinweis, keine Scrollleiste`);
    await p.click("#r-text"); await bild(p, "heft-" + art);
    await ctx.close();
  }

  // ---------- Schreibschrift (Schulausgangsschrift) ----------
  async function nachspuren(p, anzahl) {
    for (let z = 0; z < anzahl; z++) {
      const zeichen = await p.evaluate(() => __lesen.spurZeichen());
      for (let s = 0; s < 6 && await p.evaluate((zz) => __lesen.spurZeichen() === zz && __lesen.spurNr() >= 0, zeichen); s++) {
        const punkte = await p.evaluate(() => __lesen.spurPunkte());
        if (!punkte.length) break;
        await p.mouse.move(punkte[0][0], punkte[0][1]); await p.mouse.down();
        for (const [x, y] of punkte.slice(1)) await p.mouse.move(x + 1, y - 1, { steps: 2 });
        await p.mouse.up(); await p.waitForTimeout(60);
      }
      if (BILDER && zeichen.length > 1) await bild(p, "sas-wort");
      await p.waitForTimeout(1150);
    }
  }
  for (const [breite, hoehe, art] of [[1180, 820, "quer"], [820, 1180, "hoch"], [390, 760, "Handy"]]) {
    const { ctx, p } = await kind("2", breite, hoehe);
    await p.goto(BASIS + "spiele/lesen/"); await p.waitForTimeout(500);
    erwarte(await p.evaluate(() => !document.getElementById("weg-sas").hidden), `Lesen ${art}: Knopf „Schreibschrift“ sichtbar`);
    await p.click("#weg-sas"); await p.waitForTimeout(300);
    const runde = await p.evaluate(() => ({ titel: document.getElementById("spuren-titel").textContent, z: __lesen.spurZeichen() }));
    erwarte(/Schreibschrift/.test(runde.titel) && runde.z === "i", `Schreibschrift ${art}: beginnt mit dem i (${runde.z})`);
    await bild(p, "sas-i-" + art);
    await nachspuren(p, 4);
    await p.waitForSelector("#spuren-ende:not([hidden])", { timeout: 5000 }).catch(() => fehler.push(`Schreibschrift ${art}: Runde nicht beendet`));
    const sas = await p.evaluate(() => __lesen.stand().sas || {});
    erwarte(sas.i >= 1 && sas.l >= 1 && sas.u >= 1 && Object.keys(sas).length >= 3 && await passt(p), `Schreibschrift ${art}: i, l, u und ein verbundenes Wort nachgespurt (${JSON.stringify(sas)})`);
    if (art === "quer") {
      await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300); if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
      await p.waitForSelector("#d-schrift"); await p.selectOption("#d-schrift", "aus"); await p.click("#d-speichern"); await p.waitForTimeout(200);
      await p.goto(BASIS + "spiele/lesen/"); await p.waitForTimeout(400);
      erwarte(await p.evaluate(() => document.getElementById("weg-sas").hidden), "Eltern „Schreibschrift aus“: Knopf verschwindet");
    }
    await ctx.close();
  }
  // Alle Buchstaben und Übungswörter lassen sich bauen (keine leeren Striche)
  {
    const { ctx, p } = await kind("2");
    await p.goto(BASIS + "spiele/lesen/"); await p.waitForTimeout(400);
    const ok = await p.evaluate(() => { const S = window.SCHREIBSCHRIFT; return S.reihe.concat(S.woerter).every(w => { const r = S.baue(w); return r.striche[0].length > 10 && r.breite > 20 && r.striche.every(s => s.every(q => isFinite(q[0]) && isFinite(q[1]))); }); });
    erwarte(ok, "Schreibschrift: alle 30 Kleinbuchstaben und 34 Wörter haben gültige Striche");
    await ctx.close();
  }

  // ---------- Englisch: Lernkartei und Lieder ----------
  {
    const { ctx, p } = await kind("3");
    await p.goto(BASIS + "spiele/englisch/"); await p.waitForTimeout(400);
    await p.evaluate(() => __englisch.starte(ENGLISCH.findIndex(k => k.id === "en-colours"))); await p.waitForTimeout(150);
    // bis zur ersten Wort-Aufgabe, dort einmal falsch
    let gemerkt = null;
    for (let n = 0; n < 12 && !gemerkt; n++) {
      const s = await p.evaluate(() => { const l = __englisch.lauf, x = l.schritte[l.pos]; return { pos: l.pos, typ: x.typ, en: x.wort && x.wort.en, e: x.wort && x.wort.e }; });
      if (s.typ === "lesen" || s.typ === "deutsch") {
        const i = await p.evaluate((z) => [...document.querySelectorAll("#aufgabe .option")].findIndex(b => b.textContent.trim() !== z), s.typ === "lesen" ? s.e : s.en);
        await p.click(`#aufgabe .option >> nth=${i}`); gemerkt = s.en;
      } else { await p.click("#weiter"); await p.waitForTimeout(60); }
    }
    const karte = await p.evaluate(() => (Spielwelt.lade("lernkartei").englisch || []).map(c => c.s.wort.en));
    erwarte(gemerkt && karte.includes(gemerkt), `Englisch: falsches Wort „${gemerkt}“ kommt in die Lernkartei`);
    // Am nächsten Tag kommt es als Wiederholung, und richtig beantwortet steigt es eine Stufe
    await p.evaluate(() => localStorage.setItem("__heuteTest", "2026-10-27"));
    await p.reload(); await p.waitForTimeout(400);
    await p.evaluate(() => __englisch.starte(ENGLISCH.findIndex(k => k.id === "en-animals"))); await p.waitForTimeout(150);
    const wh = await p.evaluate(() => { const l = __englisch.lauf; return { text: l.schritte[1].text, karte: l.schritte.filter(s => s.__karte).map(s => s.wort.en) }; });
    erwarte(/Kurz wiederholen/.test(wh.text) && wh.karte.includes(gemerkt), `Englisch am nächsten Tag: „Kurz wiederholen“ mit „${gemerkt}“`);
    await p.click("#weiter"); await p.waitForTimeout(60); await p.click("#weiter"); await p.waitForTimeout(60);
    const s = await p.evaluate(() => { const x = __englisch.lauf.schritte[__englisch.lauf.pos]; return { typ: x.typ, en: x.wort.en, e: x.wort.e, karte: !!x.__karte }; });
    if (s.typ === "lesen") await p.locator("#aufgabe .option", { hasText: s.e }).first().click();
    else await p.locator("#aufgabe .option").filter({ hasText: new RegExp(`^${s.en}$`) }).first().click();
    await p.waitForTimeout(100);
    const st = await p.evaluate((w) => ((Spielwelt.lade("lernkartei").englisch || []).find(c => c.s.wort.en === w) || {}).stufe, gemerkt);
    erwarte(s.karte && st === 2, `Wiederholung richtig: Karte steigt auf Stufe 2 (${st})`);
    await p.evaluate(() => localStorage.removeItem("__heuteTest"));
    // Songs and rhymes
    await p.goto(BASIS + "spiele/englisch/"); await p.waitForTimeout(400);
    const lieder = await p.evaluate(() => [...document.querySelectorAll(".lieder-gruppe [data-lied]")].map(b => b.dataset.lied));
    erwarte(lieder.length === 6 && lieder.includes("twinkle") && lieder.includes("buckle"), `Englisch: „Songs and rhymes“ mit ${lieder.length} Liedern und Reimen`);
    await sprachSpion(p);
    await p.evaluate(() => __englisch.lied("twinkle")); await p.waitForTimeout(200);
    await p.click(".lied-spielen"); await p.waitForSelector(".silbe.an", { timeout: 3000 }).catch(() => fehler.push("Twinkle: keine leuchtende Silbe"));
    await bild(p, "englisch-lied");
    await p.waitForFunction(() => !document.querySelector(".silbe.an"), null, { timeout: 8000 }).catch(() => {});
    await p.click("#weiter"); await p.waitForTimeout(200);
    erwarte(await p.evaluate(() => !document.getElementById("ende-ansicht").hidden && (Spielwelt.lade("englisch").lieder || {}).twinkle === 1), "„Twinkle, Twinkle“ mitgesungen, Ende und Haken");
    await p.goto(BASIS + "spiele/englisch/"); await p.waitForTimeout(300); await sprachSpion(p);
    await p.evaluate(() => __englisch.lied("buckle")); await p.waitForTimeout(200);
    await p.click(".lied-spielen"); await p.waitForTimeout(600);
    erwarte(await p.evaluate(() => window.__gesprochen.some(([t, l]) => /buckle my shoe/.test(t) && /^en/.test(l))), "Reim „One, Two, Buckle My Shoe“ wird auf Englisch vorgesprochen");
    await ctx.close();
  }

  // ---------- Atelier: Mitsingen ----------
  for (const [breite, hoehe, art] of [[1180, 820, "quer"], [390, 760, "Handy"]]) {
    const { ctx, p } = await kind("1", breite, hoehe);
    await p.goto(BASIS + "spiele/atelier/"); await p.waitForTimeout(500);
    await p.click('[data-zu="musik"]'); await p.waitForTimeout(200);
    await p.click('[data-m="singen"]'); await p.waitForTimeout(200);
    const n = await p.evaluate(() => document.querySelectorAll("#sing-liste [data-sing]").length);
    erwarte(n === 3 && await p.evaluate(() => /Al-le|Al-/.test(document.querySelector("#sing-lied .lied-text").textContent)), `Atelier ${art}: „Mitsingen“ mit 3 Liedern, „Alle meine Entchen“ in Silben`);
    await p.click("#sing-lied .lied-spielen");
    await p.waitForFunction(() => ((Spielwelt.lade("atelier") || {}).musik || {}).gesungen && Spielwelt.lade("atelier").musik.gesungen.entchen === 1, null, { timeout: 8000 }).catch(() => {});
    erwarte(await p.evaluate(() => ((Spielwelt.lade("atelier").musik || {}).gesungen || {}).entchen === 1) && await passt(p), `Atelier ${art}: Lied bis zum Ende gespielt, gemerkt, keine Scrollleiste`);
    await bild(p, "atelier-singen-" + art);
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Lücken-Test (Heft, Schreibschrift, Englisch-Lernkartei, Lieder) bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
