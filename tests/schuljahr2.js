// Test Schuljahr Deutsch und Sachunterricht (28.10.2026): Eltern-Einstellung „gerade in der Schule“ je Fach (Lernbereich steht oben und ist
// markiert), „Zeig, was du kannst“ je Lernbereich echt durchgespielt (ein absichtlicher Fehler), Ergebnis ohne Sterne/Kapitelwertung,
// „Üben:“-Knopf zum ersten unsicheren Kapitel/Thema, Ergebnisse im Elternbereich. Quer und hoch.
// Aufruf: sh tests/laufen.sh schuljahr2   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  async function kind(stufe, breite, hoehe) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__testSchnell = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  const passt = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  const zuEltern = async (p) => { await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300); if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); } await p.waitForSelector("#schuljahr-karte"); };

  // Deutsch: einen Schritt beantworten (richtig oder absichtlich falsch)
  async function deutschSchritt(p, falsch) {
    const r = await p.evaluate(() => { const l = __deutsch.lauf, x = l.k.schritte[l.pos];
      return { pos: l.pos, typ: x.typ, richtig: (x.optionen || [])[0], satz: x.satz, falsch: x.falsch, stelle: x.stelle, teile: x.teile, ziel: x.richtig, falschWert: x.falsch }; });
    if (r.typ === "sag") { await p.click("#weiter", { force: true }); return r; }
    if (["luecke", "wort", "hoertext", "blitz"].includes(r.typ)) {
      if (r.typ === "blitz") await p.waitForFunction(() => document.querySelector("#blitz-wort").style.visibility === "visible", null, { timeout: 3000 });
      await p.evaluate(([t, falsch]) => { const o = [...document.querySelectorAll(".optionen .option")]; (falsch ? o.find(b => b.textContent !== t) : o.find(b => b.textContent === t)).click(); }, [r.richtig, falsch]);
    } else if (r.typ === "silben") {
      const n = falsch ? (r.teile.length === 1 ? 2 : 1) : r.teile.length; await p.click(`.optionen .option[data-wert="${n}"]`);
    } else if (["wortart", "artikel", "verlaengern"].includes(r.typ)) {
      if (falsch) await p.evaluate((z) => [...document.querySelectorAll(".optionen .option")].find(b => b.dataset.wert !== z).click(), r.ziel);
      else await p.click(`.optionen .option[data-wert="${r.ziel}"]`);
    } else if (r.typ === "verbessern") {
      const w = r.satz.split(" "), kern = (x) => x.replace(/[.,!?:;„“"]/g, ""), ziel = r.stelle != null ? r.stelle : w.findIndex(x => kern(x) === r.falsch);
      if (falsch) { await p.click(`.vb-wort[data-n="${w.findIndex((x, i) => i !== ziel && kern(x) !== r.falsch)}"]`); }
      else { await p.click(`.vb-wort[data-n="${ziel}"]`); await p.click(`#vb-optionen .option >> text="${r.richtig}"`); }
    } else throw new Error("unerwarteter Schritt " + r.typ);
    return r;
  }

  for (const [breite, hoehe, art] of [[1180, 820, "quer"], [390, 760, "hoch"]]) {
    const { ctx, p } = await kind("3", breite, hoehe);
    // --- Eltern: gerade in der Schule ---
    await zuEltern(p);
    erwarte(await p.evaluate(() => /noch nicht gemacht/.test(document.querySelector("#lernstand-deutsch").textContent)), `${art}: Elternbereich zeigt „noch nicht gemacht“`);
    await p.selectOption("#d-schule", "le"); await p.selectOption("#su-schule", "un"); await p.click("#sj-speichern"); await p.waitForTimeout(150);
    const e = await p.evaluate(() => Spielwelt.lade("eltern"));
    erwarte(e.deutsch.schule === "le" && e.sachkunde.schule === "un", `${art}: Einstellung gespeichert (Deutsch: Lesen, SU: Unbelebte Natur)`);

    // --- Deutsch-Werkstatt ---
    await p.goto(BASIS + "spiele/deutsch/"); await p.waitForSelector("#werkstatt .werk-gruppe");
    const g = await p.evaluate(() => { const gr = [...document.querySelectorAll(".werk-gruppe")]; return { erste: gr[0].dataset.lb, markiert: gr[0].classList.contains("schule") && /Gerade in der Schule/.test(gr[0].querySelector("h3").textContent), knoepfe: gr.filter(x => x.querySelector(".lernstand-knopf")).length }; });
    erwarte(g.erste === "le" && g.markiert && g.knoepfe === 5, `${art}: Werkstatt – „Lesen“ steht oben und ist markiert, alle 5 Lernbereiche haben „Zeig, was du kannst“ (${g.erste}, ${g.knoepfe})`);
    if (BILDER) { await p.evaluate(() => document.querySelector("#werkstatt").scrollIntoView()); await p.screenshot({ path: `${BILDER}/schuljahr2-werkstatt-${art}.png` }); }
    const sterneVor = await p.evaluate(() => Object.keys((Spielwelt.lade("deutsch") || {}).kapitel || {}).length);
    await p.click('.werk-gruppe[data-lb="sc"] .lernstand-knopf'); await p.waitForSelector("#kapitel-ansicht:not([hidden])");
    const anz = await p.evaluate(() => __deutsch.lauf.k.schritte.length - 1);
    let einmalFalsch = true, ok = true, breit = false;
    for (let schutz = 0; schutz < 40; schutz++) {
      if (await p.evaluate(() => !document.querySelector("#ende-ansicht").hidden)) break;
      if (!(await passt(p))) breit = true;
      const typ = await p.evaluate(() => __deutsch.lauf.k.schritte[__deutsch.lauf.pos].typ);
      const vorher = await p.evaluate(() => __deutsch.lauf.pos);
      if (typ !== "sag" && einmalFalsch) { einmalFalsch = false; await deutschSchritt(p, true); await p.waitForTimeout(100); }
      await deutschSchritt(p, false);
      await p.waitForFunction((v) => !document.querySelector("#ende-ansicht").hidden || __deutsch.lauf.pos !== v, vorher, { timeout: 6000 }).catch(() => { ok = false; });
      if (!ok) break;
    }
    const ende = await p.evaluate(() => ({ titel: document.getElementById("ende-titel").textContent, text: document.getElementById("ende-text").textContent, knopf: [...document.querySelectorAll("#ende-knoepfe .knopf")].map(b => b.textContent),
      ls: (Spielwelt.lade("deutsch") || {}).lernstand, kap: Object.keys((Spielwelt.lade("deutsch") || {}).kapitel || {}) }));
    const e3 = (ende.ls || {})["k3:sc"] || {};
    erwarte(ok && !breit && /Danke fürs Zeigen/.test(ende.titel) && anz >= 8 && e3.n >= 3 && e3.richtig === e3.n - 1 && /üben wir noch/.test(ende.text),
      `${art}: Deutsch „Schreiben“ – ${anz} Aufgaben aus ${e3.n} Kapiteln, ein Fehler, Ergebnis gespeichert (${e3.richtig} von ${e3.n} Kapiteln sicher), keine Scrollleiste`);
    erwarte(ende.kap.length === sterneVor && !ende.kap.some(k => /lernstand/.test(k)), `${art}: keine Kapitelwertung und keine Sterne für „Zeig, was du kannst“`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/schuljahr2-deutsch-ende-${art}.png` });
    const ueben = ende.knopf.find(t => /^Üben:/.test(t));
    await p.click("#ende-knoepfe .knopf.haupt"); await p.waitForTimeout(300);
    const kapitel = await p.evaluate(() => __deutsch.lauf.k.name);
    erwarte(ueben && ueben === "Üben: " + kapitel, `${art}: „${ueben}“ öffnet das Kapitel zum Üben`);

    // --- Sachunterricht ---
    await p.goto(BASIS + "spiele/sachkunde/"); await p.waitForSelector("#themen .su-gruppe");
    const s = await p.evaluate(() => { const gr = [...document.querySelectorAll(".su-gruppe")]; return { erste: gr[0].dataset.lb, markiert: gr[0].classList.contains("schule"), knoepfe: gr.filter(x => x.querySelector(".lernstand-knopf")).length }; });
    erwarte(s.erste === "un" && s.markiert && s.knoepfe >= 4, `${art}: Sachthemen – „Unbelebte Natur“ steht oben und ist markiert, ${s.knoepfe} Lernbereiche mit „Zeig, was du kannst“`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/schuljahr2-sachkunde-${art}.png` });
    await p.click('.su-gruppe[data-lb="pt"] .lernstand-knopf'); await p.waitForSelector("#lektion-ansicht:not([hidden])");
    const sAnz = await p.evaluate(() => __sachkunde.lauf.t.schritte.length - 1);
    let sFalsch = true, sBreit = false;
    for (let runden = 0; runden < 60; runden++) {
      const lage = await p.evaluate(() => { const l = __sachkunde.lauf; const st = l && l.t.schritte[l.pos]; return { ende: !document.getElementById("ende-ansicht").hidden, typ: st && st.typ, schritt: st, weiter: !!document.getElementById("weiter") }; });
      if (lage.ende) break;
      if (!(await passt(p))) sBreit = true;
      if (lage.weiter) { await p.click("#weiter"); await p.waitForTimeout(80); continue; }
      if (lage.typ === "wahl") {
        if (sFalsch) { sFalsch = false; await p.locator(".optionen .option", { hasText: lage.schritt.optionen.find(o => !o.ok).t }).first().click(); await p.waitForTimeout(80); }
        await p.locator(".optionen .option", { hasText: lage.schritt.optionen.find(o => o.ok).t }).first().click();
      } else if (lage.typ === "daumen") {
        if (sFalsch) { sFalsch = false; await p.locator(".daumen .option").nth(lage.schritt.ok ? 1 : 0).click(); await p.waitForTimeout(80); }
        await p.locator(".daumen .option").nth(lage.schritt.ok ? 0 : 1).click();
      } else break;
      await p.waitForTimeout(80);
    }
    const sEnde = await p.evaluate(() => ({ titel: document.getElementById("ende-titel").textContent, text: document.getElementById("ende-text").textContent,
      ls: (Spielwelt.lade("sachkunde") || {}).lernstand, themen: Object.keys((Spielwelt.lade("sachkunde") || {}).themen || {}), anzahl: THEMEN.length }));
    const s3 = (sEnde.ls || {})["k3:pt"] || {};
    erwarte(/Danke fürs Zeigen/.test(sEnde.titel) && sAnz >= 8 && s3.n === 4 && s3.richtig === 3 && /noch einmal an/.test(sEnde.text) && !sBreit,
      `${art}: SU „Pflanzen und Tiere“ – ${sAnz} Fragen aus ${s3.n} Themen, ein Fehler, Ergebnis gespeichert (${s3.richtig} von ${s3.n} Themen sicher)`);
    erwarte(!sEnde.themen.some(t => /lernstand/.test(t)) && sEnde.anzahl === 61, `${art}: keine Themenwertung, die Themenliste bleibt bei 61`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/schuljahr2-sachkunde-ende-${art}.png` });

    // --- Elternbereich: Ergebnisse ---
    await zuEltern(p);
    const el = await p.evaluate(() => ({ de: document.querySelector("#lernstand-deutsch").textContent, su: document.querySelector("#lernstand-sachkunde").textContent }));
    erwarte(/Kl\. 3 · Schreiben/.test(el.de) && /noch üben/.test(el.de) && /Kl\. 3 · Pflanzen und Tiere/.test(el.su) && /noch üben/.test(el.su),
      `${art}: Elternbereich zeigt beide Ergebnisse mit „noch üben“`);
    if (BILDER) { await p.evaluate(() => document.querySelector("#schuljahr-karte").scrollIntoView()); await p.screenshot({ path: `${BILDER}/schuljahr2-eltern-${art}.png` }); }
    // Einstellung zurücksetzen: keine Markierung mehr
    await p.selectOption("#d-schule", ""); await p.click("#sj-speichern"); await p.waitForTimeout(100);
    await p.goto(BASIS + "spiele/deutsch/"); await p.waitForSelector("#werkstatt .werk-gruppe");
    const ohne = await p.evaluate(() => ({ erste: document.querySelector(".werk-gruppe").dataset.lb, mark: document.querySelectorAll(".werk-gruppe.schule").length }));
    erwarte(ohne.erste === "sz" && ohne.mark === 0, `${art}: ohne Einstellung wieder die Lehrplan-Reihenfolge, nichts markiert`);
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Schuljahr-Deutsch-und-SU-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
