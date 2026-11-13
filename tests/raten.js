// Test „Gegen das Durchraten“ (13.11.2026, shared/raten.js) – Beobachtung des Auftraggebers: ein Kind liest nicht, sondern tippt die Antworten
// der Reihe nach durch. Geprüft wird mit echten Zeiten (window.__ratenEcht, verkürzt über __ratenZeit):
//   Sachunterricht: Anlauf (Antworten erst kurz nach der Frage antippbar, ein Tippen davor zählt nicht), Denkpause nach einem Fehler (die
//     richtige Antwort lässt sich währenddessen nicht antippen), zwei schnelle Fehler → „Langsam, Mira!“, falsch beantwortete Fragen kommen
//     am Ende noch einmal, durchgeraten → „Das üben wir noch einmal“ ohne Sterne, Karte im Elternbereich, zweiter Durchgang in Ruhe →
//     „Thema geschafft!“ mit Sternen, Karte wieder weg; ein einzelner Fehler → die Frage kommt noch einmal, das Thema ist geschafft.
//   Tablet-Führerschein und Deutsch-Werkstatt: durchgeraten → „Das üben wir noch einmal“, nichts gilt als geschafft; in Ruhe → geschafft.
//   Ohne __ratenEcht (automatischer Browser) gibt es keine Wartezeiten – die anderen Tests laufen so schnell wie bisher.
//   Handy 390 × 760 mit Hilfesprache Russisch: Pausen-Balken passt, russische Zeile steht dabei.
// Aufruf: sh tests/laufen.sh raten   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const ZEIT = { anlauf: 500, pause: 1100, lang: 1900, schnell: 700 };

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) { fehler.push(text); console.log("  ✗ " + text); } else console.log("  ✓ " + text); };
  async function kind(stufe, { breite = 1180, hoehe = 820, echt = true, sprache = "" } = {}) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(([echt, zeit]) => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__elternAlle = true; window.__testSchnell = true;
      if (echt) { window.__ratenEcht = true; window.__ratenZeit = zeit; } }, [echt, ZEIT]);
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    if (sprache) { await p.selectOption("#e-sprache", sprache); await p.selectOption("#e-dosis", "immer"); }
    await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  const frei = (p) => p.waitForFunction(() => !document.querySelector(".raten-warte"), null, { timeout: 8000 });
  // Antippen wie ein Finger an der Stelle des Knopfs – ruht der Knopf (pointer-events: none), geht das Tippen ins Leere
  const tippe = async (p, loc) => { const b = await loc.boundingBox(); await p.mouse.click(b.x + b.width / 2, b.y + b.height / 2); };

  // ---------- Sachunterricht ----------
  const suLage = (p) => p.evaluate(() => { const l = __sachkunde.lauf; const s = l && l.t.schritte[l.pos];
    return { ende: !document.getElementById("ende-ansicht").hidden, pos: l && l.pos, n: l && l.t.schritte.length, typ: s && s.typ, schritt: s, nochmal: !!(s && s.__nochmal),
      weiter: !!document.getElementById("weiter"), karte: (document.querySelector(".sortier-karte") || {}).innerText || "" }; });
  const suRichtig = (p, lage) => lage.typ === "wahl" ? p.locator(".optionen .option", { hasText: lage.schritt.optionen.find(o => o.ok).t }).first()
    : p.locator(".daumen .option").nth(lage.schritt.ok ? 0 : 1);
  const suFalsch = (p, lage) => lage.typ === "wahl" ? p.locator(".optionen .option:not([disabled])", { hasText: lage.schritt.optionen.find(o => !o.ok).t }).first()
    : p.locator(".daumen .option").nth(lage.schritt.ok ? 1 : 0);
  // Thema durchspielen. raten = jede Frage zuerst falsch (sofort nach der Pause), sonst in Ruhe richtig; einFehler = nur die erste Wahl-Frage einmal falsch
  async function suSpiele(p, { raten = false, einFehler = false } = {}) {
    const info = { nochmal: 0, intro: false, lang: false, fragen: 0, haengt: false };
    let fehlerGemacht = false;
    for (let k = 0; k < 120; k++) {
      const lage = await suLage(p);
      if (lage.ende) break;
      if (lage.weiter) { if (lage.typ === "info" && lage.nochmal) info.intro = true; await p.click("#weiter"); await p.waitForTimeout(80); continue; }
      if (lage.typ === "wahl" || lage.typ === "daumen") {
        info.fragen++; if (lage.nochmal) info.nochmal++;
        await frei(p);
        if (raten || (einFehler && !fehlerGemacht && lage.typ === "wahl")) {
          fehlerGemacht = true;
          await tippe(p, suFalsch(p, lage)); await p.waitForTimeout(60);
          if (await p.$(".raten-pause.lang")) info.lang = true;
          await frei(p);
          if (!raten) await p.waitForTimeout(ZEIT.schnell + 100);
        } else await p.waitForTimeout(ZEIT.schnell + 100);   // in Ruhe: erst „lesen“
        await tippe(p, suRichtig(p, lage)); await p.waitForTimeout(80);
      } else if (lage.typ === "zuordnen") {
        const ding = lage.schritt.dinge.find(d => lage.karte.includes(d.t));
        if (!ding) { info.haengt = true; break; }
        await frei(p); await tippe(p, p.locator(`.gruppen .option[data-g="${ding.gruppe}"]`)); await p.waitForTimeout(900);
      } else if (lage.typ === "bewegung") { await p.click("#bew-ueberspringen"); await p.waitForTimeout(80); }
      else { info.haengt = true; break; }
    }
    return Object.assign(info, await p.evaluate(() => ({ titel: document.getElementById("ende-titel").textContent, text: document.getElementById("ende-text").textContent,
      gewinn: document.getElementById("ende-gewinn").textContent, bilanz: JSON.stringify(Raten.bilanz()), sterne: Spielwelt.sterne(), offen: ((Spielwelt.lade("raten") || {}).offen || []).slice() })));
  }

  console.log("Sachunterricht (Kl. 2, echte Zeiten)");
  {
    const { ctx, p } = await kind("2");
    await p.goto(BASIS + "spiele/sachkunde/"); await p.waitForSelector("#themen .su-gruppe");
    // ein Thema mit mindestens 4 Wahl-/Daumen-Fragen, davon die erste eine Wahl-Frage mit 3 Antworten, ohne Stammbaum
    const thema = await p.evaluate(() => { const kl = 2; const t = __sachkunde.themen.find(t => !t.stammbaum && (t.stufe || t.kl || 2) <= kl && !t.land &&
      t.schritte.filter(x => x.typ === "wahl" || x.typ === "daumen").length >= 4 && t.schritte.every(x => ["info", "wahl", "daumen", "zuordnen"].includes(x.typ)) &&
      (t.schritte.find(x => x.typ === "wahl") || { optionen: [] }).optionen.length >= 3);
      return t && { id: t.id, name: t.name, i: __sachkunde.themen.indexOf(t), fragen: t.schritte.filter(x => x.typ === "wahl" || x.typ === "daumen").length, n: t.schritte.length }; });
    erwarte(!!thema, `Thema zum Durchspielen gefunden (${thema && thema.name}, ${thema && thema.fragen} Fragen)`);
    const sterne0 = await p.evaluate(() => Spielwelt.sterne());

    // A: Anlauf und Denkpause an der ersten Wahl-Frage
    await p.evaluate((i) => __sachkunde.starte(i), thema.i); await p.waitForTimeout(100);
    for (let k = 0; k < 20; k++) { const l = await suLage(p); if (l.typ === "wahl") break; if (l.weiter) await p.click("#weiter");
      else if (l.typ === "zuordnen") { const d = l.schritt.dinge.find(d => l.karte.includes(d.t)); await frei(p); await tippe(p, p.locator(`.gruppen .option[data-g="${d.gruppe}"]`)); await p.waitForTimeout(900); }
      else { await frei(p); await p.waitForTimeout(ZEIT.schnell + 100); await tippe(p, suRichtig(p, l)); } await p.waitForTimeout(80); }
    let lage = await suLage(p);
    const anlauf = await p.evaluate(() => ({ warten: document.querySelectorAll(".optionen .option.raten-warte").length, alle: document.querySelectorAll(".optionen .option").length }));
    erwarte(lage.typ === "wahl" && anlauf.warten === anlauf.alle && anlauf.alle >= 3, `Anlauf: Alle ${anlauf.alle} Antworten ruhen kurz, wenn die Frage erscheint`);
    await tippe(p, suFalsch(p, lage)); await p.waitForTimeout(60);
    erwarte(await p.evaluate(() => !document.querySelector(".option.falsch") && document.querySelector(".warum").hidden), "Anlauf: Tippen vor Ablauf zählt nicht (kein Fehler, keine Erklärung)");
    await frei(p); await p.waitForTimeout(ZEIT.schnell + 100);
    await tippe(p, suFalsch(p, lage)); await p.waitForTimeout(60);
    const pause = await p.evaluate(() => ({ balken: !!document.querySelector(".raten-pause .raten-balken"), text: (document.querySelector(".raten-pause") || {}).textContent || "",
      lang: !!document.querySelector(".raten-pause.lang"), warum: !document.querySelector(".warum").hidden, falsch: document.querySelectorAll(".option.falsch").length,
      warten: document.querySelectorAll(".optionen .option.raten-warte").length, nachWarum: (document.querySelector(".warum").nextElementSibling || {}).className || "" }));
    erwarte(pause.balken && /Erst lesen/.test(pause.text) && !pause.lang && pause.warum && pause.falsch === 1 && pause.warten === anlauf.alle - 1 && /raten-pause/.test(pause.nachWarum),
      `Denkpause: Nach dem Fehler steht die Erklärung da, darunter der Balken „${pause.text.trim()}“, die übrigen ${pause.warten} Antworten ruhen`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/raten-denkpause-quer.png` });
    await tippe(p, suRichtig(p, lage)); await p.waitForTimeout(60);
    erwarte(await p.evaluate(() => !document.getElementById("weiter") && !document.querySelector(".option.richtig")), "Denkpause: Die richtige Antwort lässt sich währenddessen nicht antippen");
    await frei(p);
    erwarte(await p.evaluate(() => !document.querySelector(".raten-pause")), "Denkpause: Nach Ablauf ist der Balken weg, die Antworten sind wieder frei");
    // zwei schnelle Fehler hintereinander → längere Pause mit „Langsam, Mira!“ (sofort nach der Pause wieder falsch)
    // sicher auslösen: nächste Fragen sofort falsch tippen, bis die lange Pause erscheint
    let lang = await p.evaluate(() => (document.querySelector(".raten-pause.lang") || {}).textContent || "");
    for (let k = 0; k < 40 && !lang; k++) {
      const l = await suLage(p); if (l.ende) break;
      if (l.weiter) { await p.click("#weiter"); await p.waitForTimeout(60); continue; }
      await frei(p);
      if (l.typ === "wahl" || l.typ === "daumen") {
        const offenFalsch = await p.evaluate(() => document.querySelectorAll(".option.falsch").length);
        if (l.typ === "wahl" && offenFalsch >= l.schritt.optionen.filter(o => !o.ok).length || l.typ === "daumen" && offenFalsch) { await tippe(p, suRichtig(p, l)); await p.waitForTimeout(60); continue; }
        const f = l.typ === "wahl" ? p.locator(".optionen .option:not([disabled])", { hasText: l.schritt.optionen.filter(o => !o.ok)[offenFalsch].t }).first() : suFalsch(p, l);
        await tippe(p, f); await p.waitForTimeout(60);
        lang = await p.evaluate(() => (document.querySelector(".raten-pause.lang") || {}).textContent || "");
      } else if (l.typ === "zuordnen") { const d = l.schritt.dinge.find(d => l.karte.includes(d.t)); await tippe(p, p.locator(`.gruppen .option[data-g="${d.gruppe}"]`)); await p.waitForTimeout(900); }
    }
    erwarte(/Langsam, Mira! Erst lesen oder anhören, dann tippen\./.test(lang), `Rate-Bremse: Zwei schnelle Fehler hintereinander → „${lang.trim()}“ mit längerer Pause`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/raten-langsam-quer.png` });
    await frei(p);

    // B: durchgeraten bis zum Ende → „Das üben wir noch einmal“
    await p.click("#zur-liste"); await p.waitForTimeout(100);
    await p.evaluate((id) => { const b = document.querySelector(`#themen .lek[data-id="${id}"]`), d = b.closest("details"); if (d) d.open = true; b.scrollIntoView({ block: "center" }); }, thema.id);
    await p.click(`#themen .lek[data-id="${thema.id}"]`); await p.waitForTimeout(150);
    erwarte((await suLage(p)).pos === 0 && await p.evaluate((id) => __sachkunde.lauf.t.id === id, thema.id), "Thema über die Kachel geöffnet");
    const r1 = await suSpiele(p, { raten: true });
    const stand1 = await p.evaluate((id) => ({ thema: ((Spielwelt.lade("sachkunde") || {}).themen || {})[id], nachfrage: (((Spielwelt.lade("sachkunde") || {}).nachfrage || {})[id]) || null }), thema.id);
    erwarte(!r1.haengt && r1.intro && r1.nochmal >= 3 && r1.nochmal <= 4, `Durchgeraten: Falsch beantwortete Fragen kommen am Ende noch einmal (${r1.nochmal}, nach „Noch einmal hinschauen“)`);
    console.log("    Bilanz: " + r1.bilanz);
    erwarte(r1.lang, "Durchgeraten: Die lange Pause „Langsam“ erscheint unterwegs");
    erwarte(r1.titel === "Das üben wir noch einmal" && /in Ruhe/.test(r1.text) && /Nichts ist verloren/.test(r1.gewinn), `Ehrliches Ende: „${r1.titel}“ – ${r1.text}`);
    erwarte(!/\+\d/.test(r1.gewinn) && !stand1.thema && !stand1.nachfrage, "Ehrliches Ende: keine Sterne für das Thema, es gilt nicht als geschafft, keine Nachfrage geplant");
    erwarte(r1.offen.length === 1 && r1.offen[0].id === thema.id && r1.offen[0].b === "sachkunde" && r1.offen[0].fehler >= 3 && r1.offen[0].schnell >= 2,
      `Gemerkt für die Eltern: ${JSON.stringify(r1.offen[0])}`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/raten-ende-quer.png` });

    // Elternbereich: Karte „Noch einmal üben“
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
    await p.waitForSelector("#raten-karte");
    const karte = await p.evaluate(() => document.getElementById("raten-liste").innerText);
    erwarte(karte.includes(thema.name) && /Sachunterricht/.test(karte) && /beim ersten Mal falsch/.test(karte) && /sehr schnell getippt/.test(karte), `Elternbereich: Karte „Noch einmal üben“ – ${karte.trim()}`);
    if (BILDER) { await p.locator("#raten-karte").scrollIntoViewIfNeeded(); await p.screenshot({ path: `${BILDER}/raten-eltern.png` }); }

    // C: zweiter Durchgang in Ruhe über „Noch einmal“ → geschafft, Sterne, Karte weg
    await p.goto(BASIS + "spiele/sachkunde/"); await p.waitForSelector("#themen .su-gruppe");
    await p.evaluate((i) => __sachkunde.starte(i), thema.i); await p.waitForTimeout(100);
    const r2 = await suSpiele(p, { einFehler: true });
    erwarte(!r2.haengt && r2.nochmal === 1 && r2.intro, "Ein einzelner Fehler: genau diese Frage kommt am Ende noch einmal");
    erwarte(r2.titel === "Thema geschafft!" && /\+3 Sterne/.test(r2.gewinn) && r2.sterne >= sterne0 + 3 && r2.offen.length === 0, `In Ruhe mit einem Fehler: „${r2.titel}“, +3 Sterne, Eltern-Hinweis ist weg`);
    await ctx.close();
  }

  // ---------- Tablet-Führerschein ----------
  console.log("Tablet-Führerschein (Kl. 2, echte Zeiten)");
  {
    const { ctx, p } = await kind("2");
    await p.goto(BASIS + "spiele/medien/"); await p.waitForTimeout(300);
    // eine Lektion, die nur aus Sag-, Wahl-, Chat-, Daumen- und Sortier-Schritten besteht
    const lek = await p.evaluate(() => { const L = window.LEKTIONEN || []; const ok = ["sag", "wahl", "chat", "daumen", "sortieren"];
      const i = L.findIndex(l => l.schritte.every(s => ok.includes(s.typ)) && l.schritte.filter(s => ["wahl", "chat", "daumen"].includes(s.typ)).length >= 3); return i < 0 ? null : { i, id: L[i].id, name: L[i].name }; });
    erwarte(!!lek, `Lektion zum Durchspielen gefunden (${lek && lek.name})`);
    const mLage = () => p.evaluate(() => { const l = __medien.lauf; const s = l && l.l.schritte[l.pos];
      return { ende: !document.getElementById("ende-ansicht").hidden, typ: s && s.typ, schritt: s, nochmal: !!(s && s.__nochmal), weiter: !!document.getElementById("weiter"),
        karte: (document.querySelector(".sortier-karte") || {}).innerText || "" }; });
    async function mSpiele(raten) {
      const info = { nochmal: 0, pause: false, haengt: false };
      for (let k = 0; k < 120; k++) {
        const l = await mLage(); if (l.ende) break;
        if (l.weiter) { await p.click("#weiter"); await p.waitForTimeout(80); continue; }
        await frei(p);
        if (["wahl", "chat", "daumen"].includes(l.typ)) {
          if (l.nochmal) info.nochmal++;
          const zeilen = l.typ === "daumen" ? null : await p.evaluate(() => [...document.querySelectorAll(".optionen .option, .chat .option, #aufgabe .option")].map(b => b.textContent));
          const richtig = l.typ === "daumen" ? p.locator(".daumen .option").nth(l.schritt.ok ? 0 : 1) : p.locator("#aufgabe .option", { hasText: l.schritt.optionen.find(o => o.ok).t.replace(/<[^>]+>/g, "") }).first();
          const falsch = l.typ === "daumen" ? p.locator(".daumen .option").nth(l.schritt.ok ? 1 : 0) : p.locator("#aufgabe .option", { hasText: l.schritt.optionen.find(o => !o.ok).t.replace(/<[^>]+>/g, "") }).first();
          if (raten) { await tippe(p, falsch); await p.waitForTimeout(60); if (await p.$(".raten-pause")) info.pause = true; await frei(p); }
          else await p.waitForTimeout(ZEIT.schnell + 100);
          await tippe(p, richtig); await p.waitForTimeout(80); void zeilen;
        } else if (l.typ === "sortieren") {
          const d = l.schritt.dinge.find(d => l.karte.includes(d.t)); if (!d) { info.haengt = true; break; }
          await tippe(p, p.locator(`#aufgabe .option[data-seite="${d.seite}"]`)); await p.waitForTimeout(900);
        } else { info.haengt = true; break; }
      }
      return Object.assign(info, await p.evaluate((id) => ({ titel: document.getElementById("ende-titel").textContent, stand: ((Spielwelt.lade("medien") || {}).lektionen || {})[id] || 0,
        offen: ((Spielwelt.lade("raten") || {}).offen || []).map(e => e.b + ":" + e.id) }), lek.id));
    }
    await p.evaluate((i) => __medien.starte(i), lek.i); await p.waitForTimeout(100);
    const m1 = await mSpiele(true);
    erwarte(!m1.haengt && m1.pause && m1.nochmal >= 3, `Durchgeraten: Denkpause nach jedem Fehler, ${m1.nochmal} Fragen kommen noch einmal`);
    erwarte(m1.titel === "Das üben wir noch einmal" && m1.stand === 0 && m1.offen.includes("tablet:" + lek.id), `Ehrliches Ende: „${m1.titel}“, Lektion gilt nicht als geschafft, für die Eltern gemerkt`);
    await p.click("#nochmal-thema"); await p.waitForTimeout(100);
    const m2 = await mSpiele(false);
    erwarte(!m2.haengt && m2.nochmal === 0 && /geschafft|bestanden/.test(m2.titel) && m2.stand === 3 && !m2.offen.length, `„Noch einmal“ in Ruhe: „${m2.titel}“ mit 3 Sternen, Eltern-Hinweis ist weg`);
    await ctx.close();
  }

  // ---------- Deutsch-Werkstatt ----------
  console.log("Deutsch-Werkstatt (Kl. 2, echte Zeiten)");
  {
    const { ctx, p } = await kind("2");
    await p.goto(BASIS + "spiele/deutsch/"); await p.waitForTimeout(300);
    const TYPEN = ["sag", "luecke", "wort", "wortart", "verlaengern", "artikel", "silben"];
    const kap = await p.evaluate((TYPEN) => { const W = window.WERKSTATT || []; const i = W.findIndex(k => (k.stufe || 2) <= 2 && k.schritte.every(s => TYPEN.includes(s.typ) && !s.gedicht) && k.schritte.filter(s => s.typ !== "sag").length >= 4);
      return i < 0 ? null : { i, id: W[i].id, name: W[i].name }; }, TYPEN);
    erwarte(!!kap, `Kapitel zum Durchspielen gefunden (${kap && kap.name})`);
    const dLage = () => p.evaluate(() => { const l = __deutsch.lauf; const s = l && l.k.schritte[l.pos];
      return { ende: !document.getElementById("ende-ansicht").hidden, pos: l && l.pos, typ: s && s.typ, s, nochmal: !!(s && s.__nochmal), weiter: !!document.getElementById("weiter"), gesperrt: !!(l && l.gesperrt) }; });
    const dKnopf = async (l, richtig) => {
      // richtige bzw. eine falsche, noch freie Antwort als Locator
      const n = await p.evaluate(([l, richtig]) => { const s = l.s, bs = [...document.querySelectorAll("#aufgabe .option")];
        const ok = (b) => s.typ === "silben" ? +b.dataset.wert === s.teile.length : ["wortart", "verlaengern", "artikel"].includes(s.typ) ? b.dataset.wert === s.richtig : b.textContent === s.optionen[0];
        return bs.findIndex(b => !b.disabled && ok(b) === richtig); }, [l, richtig]);
      return n < 0 ? null : p.locator("#aufgabe .option").nth(n);
    };
    async function dSpiele(raten) {
      const info = { nochmal: 0, pause: false, haengt: false, anlauf: false };
      let letzte = -1;
      for (let k = 0; k < 200; k++) {
        const l = await dLage(); if (l.ende) break;
        if (l.gesperrt || l.pos === letzte && !l.weiter) { await p.waitForTimeout(120); if (l.gesperrt) continue; }
        if (l.typ === "sag") { await p.click("#weiter"); await p.waitForTimeout(80); continue; }
        if (!TYPEN.includes(l.typ)) { info.haengt = true; break; }
        if (await p.$("#aufgabe .option.raten-warte")) info.anlauf = true;
        await frei(p);
        if (l.nochmal && letzte !== l.pos) info.nochmal++;
        letzte = l.pos;
        if (raten) {
          const f = await dKnopf(l, false);
          if (f) { await tippe(p, f); await p.waitForTimeout(60); if (await p.evaluate(() => { const h = document.getElementById("hinweis"); return !!h && !!h.nextElementSibling && h.nextElementSibling.classList.contains("raten-pause"); })) info.pause = true; await frei(p); }
        } else await p.waitForTimeout(ZEIT.schnell + 100);
        const r = await dKnopf(l, true); if (!r) { info.haengt = true; break; }
        await tippe(p, r); await p.waitForTimeout(350);
      }
      return Object.assign(info, await p.evaluate((id) => ({ titel: document.getElementById("ende-titel").textContent, stand: ((Spielwelt.lade("deutsch") || {}).kapitel || {})[id] || 0,
        offen: ((Spielwelt.lade("raten") || {}).offen || []).map(e => e.b + ":" + e.id) }), kap.id));
    }
    await p.evaluate((i) => __deutsch.starte(i, window.WERKSTATT), kap.i).catch(() => null);
    await p.waitForTimeout(150);
    const d1 = await dSpiele(true);
    erwarte(!d1.haengt && d1.anlauf && d1.pause && d1.nochmal >= 3, `Durchgeraten: Anlauf, Denkpause unter dem Tipp, ${d1.nochmal} Aufgaben kommen noch einmal`);
    erwarte(d1.titel === "Das üben wir noch einmal" && d1.stand === 0 && d1.offen.includes("deutsch:" + kap.id), `Ehrliches Ende: „${d1.titel}“, Kapitel gilt nicht als geschafft, für die Eltern gemerkt`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/raten-deutsch-ende.png` });
    await p.click("#nochmal-thema"); await p.waitForTimeout(150);
    const d2 = await dSpiele(false);
    erwarte(!d2.haengt && d2.nochmal === 0 && /geschafft/.test(d2.titel) && d2.stand === 3 && !d2.offen.length, `„Noch einmal“ in Ruhe: „${d2.titel}“ mit 3 Sternen, Eltern-Hinweis ist weg`);
    await ctx.close();
  }

  // ---------- Ohne __ratenEcht: keine Wartezeiten ----------
  console.log("Automatischer Browser ohne __ratenEcht");
  {
    const { ctx, p } = await kind("2", { echt: false });
    await p.goto(BASIS + "spiele/sachkunde/"); await p.waitForSelector("#themen .su-gruppe");
    const i = await p.evaluate(() => __sachkunde.themen.findIndex(t => !t.stammbaum && t.schritte.some(x => x.typ === "wahl")));
    await p.evaluate((i) => { __sachkunde.starte(i); __sachkunde.schritt(__sachkunde.lauf.t.schritte.findIndex(x => x.typ === "wahl")); }, i);
    const l = await suLage(p);
    const vorher = await p.evaluate(() => document.querySelectorAll(".raten-warte").length);
    await suFalsch(p, l).click(); await p.waitForTimeout(40);
    const danach = await p.evaluate(() => ({ warten: document.querySelectorAll(".raten-warte").length, pause: !!document.querySelector(".raten-pause"), warum: !document.querySelector(".warum").hidden }));
    await suRichtig(p, l).click(); await p.waitForTimeout(40);
    erwarte(vorher === 0 && danach.warten === 0 && !danach.pause && danach.warum && await p.evaluate(() => !!document.getElementById("weiter")), "Kein Anlauf, keine Denkpause – Tests bleiben schnell; die Erklärung erscheint wie bisher");
    await ctx.close();
  }

  // ---------- Handy mit Hilfesprache Russisch ----------
  console.log("Handy 390 × 760, Hilfesprache Russisch");
  {
    const { ctx, p } = await kind("2", { breite: 390, hoehe: 760, sprache: "ru" });
    await p.goto(BASIS + "spiele/sachkunde/"); await p.waitForSelector("#themen .su-gruppe");
    const i = await p.evaluate(() => __sachkunde.themen.findIndex(t => !t.stammbaum && t.schritte.some(x => x.typ === "wahl")));
    await p.evaluate((i) => { __sachkunde.starte(i); __sachkunde.schritt(__sachkunde.lauf.t.schritte.findIndex(x => x.typ === "wahl")); }, i);
    const l = await suLage(p);
    await frei(p); await p.waitForTimeout(ZEIT.schnell + 100);
    await p.evaluate((t) => [...document.querySelectorAll(".optionen .option")].find(b => b.textContent.includes(t)).click(), l.schritt.optionen.find(o => !o.ok).t); await p.waitForTimeout(80);
    const h = await p.evaluate(() => { const el = document.querySelector(".raten-pause"), r = el && el.getBoundingClientRect();
      return { da: !!el, ru: el ? (el.querySelector("[lang=ru]") || {}).textContent || "" : "", passt: document.documentElement.scrollWidth <= innerWidth + 1, innen: !!r && r.left >= 0 && r.right <= innerWidth + 1 }; });
    erwarte(h.da && /Сначала прочитай/.test(h.ru) && h.passt && h.innen, `Pausen-Balken passt auf das Handy, russische Zeile steht dabei („${h.ru}“)`);
    if (BILDER) { await p.locator(".raten-pause").scrollIntoViewIfNeeded().catch(() => {}); await p.screenshot({ path: `${BILDER}/raten-handy-ru.png` }); }
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log(`\n❌ ${fehler.length} Fehler:`); fehler.forEach(f => console.log("  - " + f)); process.exit(1); }
  console.log("\n✅ Test „Gegen das Durchraten“ bestanden.");
})();
