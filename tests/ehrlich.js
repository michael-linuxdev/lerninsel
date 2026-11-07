// Test „Ehrlich lernen“ (07.11.2026): „Zeig, was du kannst“ im Sachunterricht mischt Transfer-Fragen (neue Situation, gleiche Idee) mit –
// echt durchgeklickt mit einem Fehler bei einer Transfer-Frage, Ergebnis „neue Situationen“ im Lernstand und im Elternbereich;
// Elternbereich zeigt den Hinweis „was fehlt“ unter Inhaltspunkten; „Ella fragt nach“: Thema geschafft → nach 1, 7 und 30 Tagen zwei Fragen,
// ein Fehler → morgen noch einmal, ohne Sterne, über Tage per __testJetzt. Quer, hoch und Handy, mit Russisch.
// Aufruf: sh tests/laufen.sh ehrlich   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const TAG = (n) => new Date(2026, 9, 25 + n, 15, 0).getTime();

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  async function kind(stufe, breite, hoehe, mutter) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript((t) => { let x = null; try { x = localStorage.getItem("__testJetzt"); } catch (e) { /* egal */ } window.__jetzt = x ? +x : t; window.__elternAlle = true; window.__testSchnell = true; }, TAG(0));
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    if (mutter) { await p.selectOption("#e-mutter", mutter); if (await p.$("#e-dosis")) await p.selectOption("#e-dosis", "immer").catch(() => {}); }
    await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  const passt = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  const tag = async (p, n) => { await p.evaluate((t) => localStorage.setItem("__testJetzt", String(t)), TAG(n)); await p.goto(BASIS + "spiele/sachkunde/"); await p.waitForSelector("#themen .su-gruppe"); };
  // eine Runde (Thema, Lernstand oder Nachfrage) echt durchklicken; falsch(schritt) = true → dort zuerst absichtlich falsch tippen
  async function runde(p, falsch) {
    let breit = false, haengt = false;
    for (let r = 0; r < 90; r++) {
      const lage = await p.evaluate(() => { const l = __sachkunde.lauf; const s = l && l.t.schritte[l.pos];
        return { ende: !document.getElementById("ende-ansicht").hidden, pos: l && l.pos, typ: s && s.typ, schritt: s, weiter: !!document.getElementById("weiter"),
          karte: (document.querySelector(".sortier-karte") || {}).innerText || "" }; });
      if (lage.ende) break;
      if (!(await passt(p))) breit = true;
      if (lage.weiter) { await p.click("#weiter"); await p.waitForTimeout(80); continue; }
      const fx = falsch && falsch(lage.schritt, lage.pos);
      if (lage.typ === "wahl") {
        if (fx) { await p.locator(".optionen .option", { hasText: lage.schritt.optionen.find(o => !o.ok).t }).first().click(); await p.waitForTimeout(80); }
        await p.locator(".optionen .option", { hasText: lage.schritt.optionen.find(o => o.ok).t }).first().click();
      } else if (lage.typ === "daumen") {
        if (fx) { await p.locator(".daumen .option").nth(lage.schritt.ok ? 1 : 0).click(); await p.waitForTimeout(80); }
        await p.locator(".daumen .option").nth(lage.schritt.ok ? 0 : 1).click();
      } else if (lage.typ === "zuordnen") {
        const ding = lage.schritt.dinge.filter(d => lage.karte.includes(d.t)).sort((a, b) => b.t.length - a.t.length)[0];
        if (!ding) { haengt = true; break; }
        await p.click(`.gruppen .option[data-g="${ding.gruppe}"]`); await p.waitForTimeout(900);
      } else { haengt = true; break; }
      await p.waitForTimeout(90);
    }
    const e = await p.evaluate(() => ({ titel: document.getElementById("ende-titel").textContent, text: document.getElementById("ende-text").textContent,
      gewinn: document.getElementById("ende-gewinn").textContent, knoepfe: [...document.querySelectorAll("#ende-knoepfe .knopf")].map(b => b.textContent) }));
    return Object.assign(e, { breit, haengt });
  }

  for (const [art, breite, hoehe] of [["quer", 1180, 820], ["hoch", 820, 1180], ["handy", 390, 760]]) {
    const { ctx, p } = await kind("3", breite, hoehe, art === "hoch" ? "ru" : "");
    // --- Transfer-Fragen im Lernstand ---
    await p.goto(BASIS + "spiele/sachkunde/"); await p.waitForSelector("#themen .su-gruppe");
    const pool = await p.evaluate(() => __sachkunde.transferFragen("pt").length);
    await p.click('.su-gruppe[data-lb="pt"] .lernstand-knopf'); await p.waitForSelector("#lektion-ansicht:not([hidden])");
    const plan = await p.evaluate(() => { const s = __sachkunde.lauf.t.schritte; return { n: s.length - 1, tr: s.filter(x => x.__transfer).length, themen: [...new Set(s.filter(x => x.__kap).map(x => x.__kap))] }; });
    erwarte(pool >= 4 && plan.tr === 3 && plan.n <= 10 && plan.n >= 8, `${art}: „Zeig, was du kannst“ Pflanzen und Tiere, Kl. 3 – ${plan.n} Fragen, davon ${plan.tr} Transfer-Fragen aus einem Vorrat von ${pool}`);
    let erstesTransfer = true;
    const r = await runde(p, (s) => { if (s.__transfer && erstesTransfer) { erstesTransfer = false; return true; } return false; });
    const ls = await p.evaluate(() => ((Spielwelt.lade("sachkunde") || {}).lernstand || {})["k3:pt"]);
    erwarte(!r.haengt && !r.breit && /Danke fürs Zeigen/.test(r.titel) && ls && ls.transfer && ls.transfer.n === 3 && ls.transfer.richtig === 2 && /Neue Situationen: 2 von 3/.test(r.gewinn),
      `${art}: echt durchgeklickt, ein Fehler bei einer Transfer-Frage → „Neue Situationen: 2 von 3“ gespeichert (${JSON.stringify(ls && ls.transfer)})`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/ehrlich-lernstand-${art}.png` });

    // --- Elternbereich: Transfer-Ergebnis und Hinweis „was fehlt“ an Inhaltspunkten ---
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300); if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
    await p.waitForFunction(() => window.__eltern && __eltern.fachBereit && __eltern.fachBereit(), null, { timeout: 15000 }).catch(() => {});
    await p.waitForTimeout(400);
    const el = await p.evaluate(() => ({ transfer: [...document.querySelectorAll(".lp-transfer")].map(x => x.textContent),
      hinweise: [...document.querySelectorAll(".lp-hinweis")].map(x => x.textContent), teil: document.querySelectorAll('li[data-punkt] .zeichen').length }));
    erwarte(el.transfer.some(t => /neue Situationen: 2 von 3/.test(t)), `${art}: Elternbereich zeigt „neue Situationen: 2 von 3“`);
    erwarte(el.hinweise.some(t => /Zu wenig Übung|Sprechen fehlt/.test(t)) && el.hinweise.length >= 5, `${art}: Elternbereich – ${el.hinweise.length} Inhaltspunkte sagen, was fehlt`);
    if (BILDER) { await p.evaluate(() => { const d = [...document.querySelectorAll("details.lp-punkte")].find(x => x.querySelector(".lp-hinweis")); if (d) { d.open = true; d.scrollIntoView(); } }); await p.screenshot({ path: `${BILDER}/ehrlich-eltern-${art}.png` }); }

    // --- Ella fragt nach ---
    await p.goto(BASIS + "spiele/sachkunde/"); await p.waitForSelector("#themen .su-gruppe");
    const vorher = await p.evaluate(() => ({ karte: !!document.getElementById("nachfrage"), sterne: Spielwelt.sterne() }));
    await p.evaluate(() => { const b = document.querySelector('#themen button.lek[data-id="wiese"]'); const d = b && b.closest("details"); if (d) d.open = true; });
    await p.click('#themen button.lek[data-id="wiese"]'); await p.waitForSelector("#lektion-ansicht:not([hidden])");
    const t1 = await runde(p);
    const nf = await p.evaluate(() => (Spielwelt.lade("sachkunde") || {}).nachfrage || {});
    erwarte(!vorher.karte && /geschafft/.test(t1.titel) && nf.wiese && nf.wiese.stufe === 0 && nf.wiese.faellig === "2026-10-26", `${art}: Thema „Wiese“ geschafft → Ella fragt morgen nach (${JSON.stringify(nf.wiese)})`);
    await p.goto(BASIS + "spiele/sachkunde/"); await p.waitForSelector("#themen .su-gruppe");
    erwarte(!(await p.$("#nachfrage")), `${art}: heute noch keine Nachfrage`);
    // Tag 1: zwei Fragen, absichtlich ein Fehler → morgen noch einmal (gleiche Stufe), keine Sterne, nichts geht verloren
    await tag(p, 1);
    const k1 = await p.evaluate(() => ({ da: !!document.getElementById("nachfrage"), knoepfe: [...document.querySelectorAll(".nachfrage-knopf")].map(b => b.dataset.id), oben: document.querySelector("#themen").firstElementChild.id }));
    erwarte(k1.da && k1.knoepfe.includes("wiese"), `${art}: Tag 1 – Karte „Ella fragt nach“ in der Themenliste (${k1.knoepfe.join(", ")}, oben: ${k1.oben})`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/ehrlich-nachfrage-karte-${art}.png` });
    const sterne1 = await p.evaluate(() => Spielwelt.sterne());
    await p.click('.nachfrage-knopf[data-id="wiese"]'); await p.waitForSelector("#lektion-ansicht:not([hidden])");
    const fragen = await p.evaluate(() => __sachkunde.lauf.t.schritte.filter(x => x.typ !== "info").length);
    let einmal = true;
    const n1 = await runde(p, () => { if (einmal) { einmal = false; return true; } return false; });
    const nf1 = await p.evaluate(() => ({ x: ((Spielwelt.lade("sachkunde") || {}).nachfrage || {}).wiese, sterne: Spielwelt.sterne(), themen: (Spielwelt.lade("sachkunde") || {}).themen.wiese }));
    erwarte(fragen === 2 && /Morgen fragt Ella noch einmal/.test(n1.text) && nf1.x.stufe === 0 && nf1.x.faellig === "2026-10-27" && nf1.sterne === sterne1 && nf1.themen === 3 && n1.knoepfe.some(t => /Thema anschauen/.test(t)) && !n1.breit,
      `${art}: zwei Fragen, ein Fehler → morgen noch einmal, keine Sterne verloren oder dazu, Thema bleibt bei 3 Sternen`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/ehrlich-nachfrage-ende-${art}.png` });
    // Tag 2: richtig → nach 7 Tagen; Tag 9: richtig → nach 30 Tagen; Tag 39: richtig → fertig
    const stufen = [[2, 1, "2026-11-03"], [9, 2, "2026-12-03"], [39, 3, undefined]];
    let ok = true;
    for (const [n, st, faellig] of stufen) {
      await tag(p, n);
      if (!(await p.$('.nachfrage-knopf[data-id="wiese"]'))) { ok = false; break; }
      await p.click('.nachfrage-knopf[data-id="wiese"]'); await p.waitForSelector("#lektion-ansicht:not([hidden])");
      const rr = await runde(p);
      const x = await p.evaluate(() => ((Spielwelt.lade("sachkunde") || {}).nachfrage || {}).wiese);
      if (!(x.stufe === st && x.faellig === faellig && /du weißt es noch/.test(rr.text))) { ok = false; console.log("   ", n, JSON.stringify(x), rr.text); break; }
    }
    await tag(p, 80);
    const zuletzt = await p.evaluate(() => ({ karte: !!document.querySelector('.nachfrage-knopf[data-id="wiese"]'), x: ((Spielwelt.lade("sachkunde") || {}).nachfrage || {}).wiese }));
    erwarte(ok && !zuletzt.karte && zuletzt.x.fertig, `${art}: nach 1, 7 und 30 Tagen richtig → fertig, keine Nachfrage mehr (${JSON.stringify(zuletzt.x)})`);
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("\n❌ Fehler:\n  " + fehler.join("\n  ")); process.exit(1); }
  console.log("✅ Ehrlich lernen (Transfer-Fragen, Hinweise im Elternbereich, Ella fragt nach): Test bestanden.");
})();
