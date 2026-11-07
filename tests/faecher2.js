// Test „Fächer ausbauen II“ (07.11.2026): Sport, Ethik und Religion (evangelisch, katholisch) mit eigenen Übungen je Inhaltspunkt.
// Jedes erweiterte oder neue Thema wird über seine Kachel geöffnet und echt bis „geschafft“ durchgeklickt – mit genau einem Fehler
// (Erklärung erscheint, ein Fehler kostet keinen Stern). Religion wird über die Eltern-Wahl im Elternbereich eingestellt (erst ev, dann ka).
// Die Bewegungspause (Schritt-Typ „bewegung“, spiele/sachkunde/bewegung.js) wird echt mitgemacht: Zeigebild wechselt, „Geschafft!“
// erst nach Ablauf der Zeit, „Überspringen“ geht immer. Der Elternbereich zeigt die neuen „ja“ (✅), Aerobic bleibt 🌍.
// Dazu Handy (390 × 760) mit Hilfesprache Russisch und echter Uhr in der Bewegungspause.
// Aufruf: sh tests/laufen.sh faecher2   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

const SPORT = ["sp-fair", "sp-helfen", "sp-regeln", "sp-ruecken", "sp-bewegungspause"];
const ETHIK = ["et-einmalig", "et-natur", "et-staerken", "et-freundschaft", "et-kirchenjahr", "et-symbole", "et-wuensche", "et-miteinander4", "et-religionen", "et-gerechtigkeit"];
const RELIGION = ["re-gefuehle", "re-jona", "re-schoepfung", "re-gottesbilder", "re-licht-wasser", "re-jesus-hilft", "re-abraham", "re-feste12", "re-ostern12", "re-kirche-taufe",
  "re-bruecken", "re-judentum", "re-bildworte", "re-gleichnisse", "re-ausgegrenzte", "re-pfingsten", "re-emmaus", "re-verantwortung", "re-symbole", "re-heilungen",
  "re-bibel", "re-passion", "re-kirchenjahr", "re-vaterunser", "re-mose", "re-brot", "re-beten"];

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) { fehler.push(text); console.log("  ✗ " + text); } else console.log("  ✓ " + text); };
  async function kind(stufe, { breite = 1180, hoehe = 820, schnell = true, sprache = "" } = {}) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript((schnell) => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__elternAlle = true; if (schnell) window.__testSchnell = true; }, schnell);
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
  const oeffne = async (p, fach) => { await p.goto(BASIS + "spiele/sachkunde/?fach=" + fach); await p.waitForSelector("#themen .su-gruppe"); };
  const passt = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  async function eltern(p) {
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
    await p.waitForSelector(".lp-punkte");
  }
  // Religion über die Karte „Wie in der Schule“ im Elternbereich wählen
  async function waehleReligion(p, wert) {
    await eltern(p);
    await p.selectOption("#et-unterricht", wert === "ethik" ? "" : wert);   // „Ethik“ ist die leere Auswahl
    await p.click("#sj-speichern"); await p.waitForTimeout(200);
    return p.evaluate(() => (Spielwelt.lade("eltern").ethik || {}).unterricht);
  }

  // Bewegungspause: echt mitmachen (mit __testSchnell vergeht eine Sekunde in 40 ms); Übung 3 wird übersprungen
  async function bewegen(p, { schnell = true } = {}) {
    const info = { anzahl: 0, wechselt: false, gesperrt: true, uebersprungen: false, ru: false, wartet: true };
    for (let k = 0; k < 20; k++) {
      const z = await p.evaluate(() => ({ zaehler: (document.querySelector("#aufgabe .zaehler") || {}).textContent || "", fertig: !!document.getElementById("weiter"),
        svg: (document.querySelector(".bew-bild") || {}).innerHTML || "", aus: (document.getElementById("bew-weiter") || {}).disabled, ru: !!document.querySelector(".bew-text .mk.ru") }));
      if (z.fertig) break;
      const m = z.zaehler.match(/Übung (\d+) von (\d+)/); if (!m) break;
      info.anzahl = +m[2]; if (z.ru) info.ru = true;
      if (z.aus !== true) info.gesperrt = false;
      const bilder = new Set([z.svg]);   // Zeigebild wechselt zwischen zwei Haltungen
      for (let i = 0; i < (schnell ? 4 : 3); i++) { await p.waitForTimeout(schnell ? 35 : 560); bilder.add(await p.evaluate(() => (document.querySelector(".bew-bild") || {}).innerHTML || "")); }
      if (bilder.size >= 2) info.wechselt = true;
      if (!schnell) {   // echte Uhr: nach gut einer Sekunde noch gesperrt, Zähler läuft – dann überspringen
        const w = await p.evaluate(() => ({ aus: document.getElementById("bew-weiter").disabled, n: +document.getElementById("bew-n").textContent }));
        if (!(w.aus && w.n < 15 && w.n >= 12)) info.wartet = false;
        await p.click("#bew-ueberspringen"); info.uebersprungen = true; continue;
      }
      if (+m[1] === 3) { await p.click("#bew-ueberspringen"); info.uebersprungen = true; continue; }
      await p.click("#bew-weiter:not([disabled])", { timeout: 10000 });
    }
    return info;
  }

  // Thema echt durchklicken, beim ersten Wahl-/Daumen-Schritt einmal falsch
  async function durchklicken(p, id, { bew = {} } = {}) {
    const kachel = `#themen button.lek[data-id="${id}"]`;
    if (!(await p.$(kachel))) return { ok: false, fehlt: true };
    await p.evaluate((sel) => { const b = document.querySelector(sel); const d = b && b.closest("details"); if (d) d.open = true; }, kachel);
    await p.click(kachel); await p.waitForSelector("#lektion-ansicht:not([hidden])");
    let runden = 0, haengt = false, breit = false, falschGemacht = false, erklaert = false, uebungen = 0, bewegung = null;
    const typen = new Set();
    while (runden++ < 120) {
      const lage = await p.evaluate(() => { const l = __sachkunde.lauf; const s = l && l.t.schritte[l.pos];
        return { ende: !document.getElementById("ende-ansicht").hidden, typ: s && s.typ, schritt: s, karte: s && s.__karte, weiter: !!document.getElementById("weiter"),
          sortier: (document.querySelector(".sortier-karte") || {}).innerText || "", nein: !!document.querySelector(".warum.nein:not([hidden])") }; });
      if (lage.ende) break;
      if (!(await passt(p))) breit = true;
      if (lage.weiter) { await p.click("#weiter"); await p.waitForTimeout(50); continue; }
      if (!lage.nein && !lage.karte) { uebungen++; typen.add(lage.typ); }
      if (lage.typ === "wahl") {
        if (!falschGemacht && !lage.karte) {
          await p.locator(".optionen .option", { hasText: lage.schritt.optionen.find(o => !o.ok).t }).first().click(); falschGemacht = true;
          await p.waitForTimeout(80); erklaert = await p.evaluate(() => !!document.querySelector(".warum.nein:not([hidden])")); continue;
        }
        await p.locator(".optionen .option", { hasText: lage.schritt.optionen.find(o => o.ok).t }).first().click();
      } else if (lage.typ === "daumen") {
        if (!falschGemacht && !lage.karte) {
          await p.locator(".daumen .option").nth(lage.schritt.ok ? 1 : 0).click(); falschGemacht = true;
          await p.waitForTimeout(80); erklaert = await p.evaluate(() => !!document.querySelector(".warum.nein:not([hidden])")); continue;
        }
        await p.locator(".daumen .option").nth(lage.schritt.ok ? 0 : 1).click();
      } else if (lage.typ === "zuordnen") {
        const ding = lage.schritt.dinge.filter(d => lage.sortier.includes(d.t)).sort((a, b) => b.t.length - a.t.length)[0];
        if (!ding) { haengt = true; break; }
        await p.click(`.gruppen .option[data-g="${ding.gruppe}"]`); await p.waitForTimeout(900);
      } else if (lage.typ === "bewegung") { bewegung = await bewegen(p, bew); }
      else { haengt = true; break; }
      await p.waitForTimeout(60);
    }
    const ende = await p.evaluate(() => ({ titel: document.getElementById("ende-titel").textContent, text: document.getElementById("ende-text").textContent, fehler: __sachkunde.lauf.fehler }));
    const sterne = await p.evaluate((id) => ((Spielwelt.lade("sachkunde") || {}).themen || {})[id] || 0, id);
    const soll = await p.evaluate((id) => (window.FACH_THEMEN.find(t => t.id === id).schritte || []).filter(s => !["info", "bewegung"].includes(s.typ)).length, id);
    return { ok: !haengt && !breit && /geschafft/.test(ende.titel) && ende.fehler === 1 && erklaert && sterne === 3 && uebungen >= soll, sterne, breit, haengt, erklaert, uebungen, soll, fehler: ende.fehler, bewegung, typen: [...typen] };
  }
  async function alle(p, fach, ids, kl, titel) {
    await oeffne(p, fach);
    const schlecht = []; let n = 0, bew = null;
    for (const id of ids) {
      const r = await durchklicken(p, id);
      if (r.bewegung) bew = r.bewegung;
      if (r.ok) n++; else schlecht.push(`${id}${r.fehlt ? " fehlt" : ""}${r.breit ? " zu breit" : ""}${r.haengt ? " hängt" : ""}${r.erklaert === false ? " ohne Erklärung" : ""} ${r.uebungen}/${r.soll} ⭐${r.sterne} F${r.fehler}`);
      await oeffne(p, fach);
    }
    erwarte(n === ids.length, `Kl. ${kl} ${titel}: ${n} von ${ids.length} Themen echt bis zum Ende, je ein Fehler mit Erklärung, trotzdem 3 Sterne, alle Übungen gesehen${schlecht.length ? " – " + schlecht.join("; ") : ""}`);
    return bew;
  }
  const klasse = (t) => Math.max(2, t.stufe || t.kl || 2);

  const probe = await kind("2");
  await oeffne(probe.p, "sport");
  const themen = await probe.p.evaluate(() => window.FACH_THEMEN.map(t => ({ id: t.id, fach: t.fach, kl: Math.max(2, t.stufe || t.kl || 2), konf: t.konf || [] })));
  await probe.ctx.close();
  const von = (ids, kl, f = () => true) => ids.filter(id => { const t = themen.find(x => x.id === id); return t && t.kl === kl && f(t); });
  erwarte([...SPORT, ...ETHIK, ...RELIGION].every(id => themen.some(t => t.id === id)), "Alle erweiterten und neuen Themen sind da (sp-helfen, sp-bewegungspause, re-jona neu)");

  for (const kl of [2, 4]) {
    const { ctx, p } = await kind(String(kl));
    // Klasse 4 sieht auch die Themen der Klasse 3 (eingeklappt) – darum dort beide
    const passend = (ids, f) => kl === 2 ? von(ids, 2, f) : von(ids, 3, f).concat(von(ids, 4, f));
    const bew = await alle(p, "sport", passend(SPORT), kl, "Sport");
    if (kl === 4) {
      erwarte(bew && bew.anzahl === 7 && bew.wechselt && bew.gesperrt && bew.uebersprungen,
        `Bewegungspause echt mitgemacht: 7 Übungen mit wechselndem Zeigebild, „Geschafft!“ erst nach der Zeit, „Überspringen“ geht (${JSON.stringify(bew)})`);
      if (BILDER) {
        await oeffne(p, "sport"); await p.evaluate(() => { const d = document.querySelector('[data-id="sp-bewegungspause"]').closest("details"); if (d) d.open = true; });
        await p.click('#themen button.lek[data-id="sp-bewegungspause"]'); await p.click("#weiter"); await p.waitForSelector(".bew-bild");
        await p.screenshot({ path: `${BILDER}/faecher2-bewegungspause-quer.png` });
        await p.setViewportSize({ width: 820, height: 1180 }); await p.waitForTimeout(200);
        await p.screenshot({ path: `${BILDER}/faecher2-bewegungspause-hoch.png` });
        await p.setViewportSize({ width: 1180, height: 820 });
      }
    }
    await alle(p, "ethik", passend(ETHIK), kl, "Ethik");
    // Religion evangelisch – über die Eltern-Wahl
    erwarte(await waehleReligion(p, "ev") === "ev", `Kl. ${kl}: Elternbereich „Religion (evangelisch)“ gewählt`);
    await alle(p, "religion", passend(RELIGION, t => t.konf.includes("ev")), kl, "Religion (evangelisch)");
    if (kl === 2) {
      await oeffne(p, "religion");
      erwarte(!!(await p.$('[data-id="re-jona"]')) && !(await p.$('[data-id="re-vaterunser"]')), "Evangelisch: „Jona“ da, das katholische „Vaterunser“-Thema nicht");
    }
    await eltern(p);
    const ev = await p.evaluate(() => { const h = [...document.querySelectorAll("h3.lp-fach")].find(x => x.textContent.startsWith("Evangelische Religion")); const ul = h && h.nextElementSibling;
      const z = (id) => ((ul && ul.querySelector(`li[data-punkt="${id}"] .zeichen`)) || {}).textContent;
      return ul ? { n: ul.querySelectorAll(".lp-punkte li").length, gelb: [...ul.querySelectorAll(".lp-punkte li .zeichen")].filter(x => x.textContent === "🟡").length, jona: z("sn.rev12.1.04"), beten: z("sn.rev4.2.01") } : null; });
    erwarte(ev && ev.n > 10 && ev.gelb === 0 && (kl === 2 ? ev.jona === "✅" : ev.beten === "✅"), `Elternbereich Kl. ${kl}: Evangelische Religion ohne 🟡, neue Punkte ✅ (${JSON.stringify(ev)})`);
    // Religion katholisch – über die Eltern-Wahl; die gemeinsamen Themen sind schon durchgeklickt, hier die nur-katholischen
    erwarte(await waehleReligion(p, "ka") === "ka", `Kl. ${kl}: Elternbereich „Religion (katholisch)“ gewählt`);
    await alle(p, "religion", passend(RELIGION, t => t.konf.length === 1 && t.konf[0] === "ka"), kl, "Religion (katholisch)");
    await oeffne(p, "religion");
    erwarte(!(await p.$('[data-id="re-jona"]')) && !(await p.$('[data-id="re-reformation"]')), "Katholisch: keine nur-evangelischen Themen (Jona, Reformation)");
    await eltern(p);
    const ka = await p.evaluate(() => { const h = [...document.querySelectorAll("h3.lp-fach")].find(x => x.textContent.startsWith("Katholische Religion")); const ul = h && h.nextElementSibling;
      const z = (id) => ((ul && ul.querySelector(`li[data-punkt="${id}"] .zeichen`)) || {}).textContent;
      return ul ? { gelb: [...ul.querySelectorAll(".lp-punkte li .zeichen")].filter(x => x.textContent === "🟡").length, trost: z("sn.rka12.1.03"), taufe: z("sn.rka12.4.06"), talente: z("sn.rka4.1.01"), tomas: z("sn.rka4.4.02"),
        text: [...ul.querySelectorAll(".lp-punkte summary")].map(s => s.textContent).join(" | ").slice(0, 160) } : null; });
    erwarte(ka && ka.gelb === 0 && (kl === 2 ? ka.trost === "✅" && ka.taufe === "✅" : ka.talente === "✅" && ka.tomas === "✅"), `Elternbereich Kl. ${kl}: Katholische Religion ohne 🟡, neue Punkte ✅ (${JSON.stringify(ka)})`);
    if (BILDER && kl === 4) { await p.evaluate(() => { const h = [...document.querySelectorAll("h3.lp-fach")].find(x => x.textContent.startsWith("Katholische Religion")); h.scrollIntoView(); h.nextElementSibling.querySelectorAll("details").forEach(d => d.open = true); }); await p.screenshot({ path: `${BILDER}/faecher2-eltern-ka.png` }); }
    // zurück auf Ethik: Ethik und Sport im Elternbereich
    erwarte(await waehleReligion(p, "ethik") === "ethik", `Kl. ${kl}: Elternbereich zurück auf „Ethik“`);
    await p.reload(); await p.waitForTimeout(300); if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); } await p.waitForSelector(".lp-punkte");
    const es = await p.evaluate(() => { const ul = (n) => { const h = [...document.querySelectorAll("h3.lp-fach")].find(x => x.textContent.startsWith(n)); return h && h.nextElementSibling; };
      const z = (u, id) => ((u && u.querySelector(`li[data-punkt="${id}"] .zeichen`)) || {}).textContent;
      const eth = ul("Ethik"), sp = ul("Sport");
      return { ethikGelb: eth ? [...eth.querySelectorAll(".lp-punkte li .zeichen")].filter(x => x.textContent === "🟡").length : -1, sportGelb: sp ? [...sp.querySelectorAll(".lp-punkte li .zeichen")].filter(x => x.textContent === "🟡").length : -1,
        helfen: z(sp, "sn.sp12.3.03"), fair: z(sp, "sn.sp12.2.03"), haltung: z(sp, "sn.sp34.3.04"), aerobic: z(sp, "sn.sp34.4.02"), schiri: z(sp, "sn.sp34.2.02"), vorbild: z(eth, "sn.et4.1.01"), einmalig: z(eth, "sn.et12.1.01") }; });
    erwarte(es.ethikGelb === 0 && es.sportGelb === 0 && (kl === 2 ? es.helfen === "✅" && es.fair === "✅" && es.einmalig === "✅" : es.haltung === "✅" && es.aerobic === "🌍" && es.schiri === "✅" && es.vorbild === "✅"),
      `Elternbereich Kl. ${kl}: Ethik und Sport ohne 🟡, neue Punkte ✅, Aerobic ehrlich 🌍 (${JSON.stringify(es)})`);
    if (BILDER && kl === 4) { await p.evaluate(() => { const h = [...document.querySelectorAll("h3.lp-fach")].find(x => x.textContent.startsWith("Sport")); h.scrollIntoView(); h.nextElementSibling.querySelectorAll("details").forEach(d => d.open = true); }); await p.screenshot({ path: `${BILDER}/faecher2-eltern-sport.png` }); }
    await ctx.close();
  }

  // Handy mit Hilfesprache Russisch und echter Uhr: Bewegungspause wartet wirklich, Überspringen, Religion-Thema passt ohne Scrollleiste
  {
    const { ctx, p } = await kind("4", { breite: 390, hoehe: 760, schnell: false, sprache: "ru" });
    await oeffne(p, "sport");
    const r = await durchklicken(p, "sp-bewegungspause", { bew: { schnell: false } });
    erwarte(r.ok && r.bewegung && r.bewegung.wartet && r.bewegung.uebersprungen && r.bewegung.ru, `Handy, Russisch, echte Uhr: Bewegungspause wartet (Zähler läuft, „Geschafft!“ gesperrt), alles überspringbar, russische Zeile da, Thema bis zum Ende (${JSON.stringify(r)})`);
    if (BILDER) { await oeffne(p, "sport"); await p.evaluate(() => { const d = document.querySelector('[data-id="sp-bewegungspause"]').closest("details"); if (d) d.open = true; });
      await p.click('#themen button.lek[data-id="sp-bewegungspause"]'); await p.click("#weiter"); await p.waitForSelector(".bew-bild"); await p.screenshot({ path: `${BILDER}/faecher2-bewegungspause-handy.png` }); }
    erwarte(await waehleReligion(p, "ka") === "ka", "Handy: Religion (katholisch) gewählt");
    await oeffne(p, "religion");
    const r2 = await durchklicken(p, "re-emmaus");
    erwarte(r2.ok, `Handy: „Verkündigung, Weizenkorn und Emmaus“ bis zum Ende, keine waagerechte Scrollleiste${r2.breit ? " – zu breit" : ""}`);
    await oeffne(p, "ethik");
    const r3 = await durchklicken(p, "et-symbole");
    erwarte(r3.ok, `Handy: „Symbole, Elemente und unsere Welt“ bis zum Ende (${r3.uebungen}/${r3.soll})`);
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Fächer II (Sport, Ethik, Religion ev/ka, Bewegungspause) bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
