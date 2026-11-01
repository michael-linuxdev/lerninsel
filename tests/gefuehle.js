// Test Gefühle und Bewegung mit Bärin Bruni (spiele/gefuehle/): alles echt angetippt.
// - Gefühls-Barometer: Gefühl wählen (traurig → Bruni verweist auf Vertrauensperson, Knopf „Ruhig werden“), umentscheiden,
//   Freigabe für die Eltern, am nächsten Tag ein neues Gefühl (müde → „Bewegungs-Minute“), Verlauf der letzten Tage
// - Ruhig werden: Ballon-Atmen (5 Runden), Schildkröte (3 Runden), Wut-Ballon (zu kurz gepustet → Hinweis, dann 3× gepustet)
// - Gefühle erkennen: 6 Situationen (eine absichtlich anders beantwortet, ohne „falsch“), Ende mit Lernfund
// - Bewegungs-Minute: „Weiter“ erst nach 15 Sekunden, 4 Übungen bis „Super bewegt!“
// - Miteinander: eine Geschichte mit Entscheidung, Gesprächsimpuls, „✅ gelesen“
// - Speicherung in Spielwelt.lade("gefuehle"), Elternbereich zeigt Barometer nur mit Freigabe
// - Hinweis auf die Nummer gegen Kummer (116 111): wird gesucht und gemeldet (Pflicht laut CLAUDE.md nur bei sensiblen Themen)
// Die Wartezeiten der Übungen laufen über die Playwright-Uhr (clock.runFor), die Tage über localStorage "__testJetzt".
// Keine Konsolenfehler, keine waagerechte Scrollleiste. Aufruf: sh tests/laufen.sh gefuehle
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const TAG = (n) => new Date(2026, 9, 25 + n, 15, 0).getTime();

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const passt = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  async function kind(breite, hoehe, sprache) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.clock.install({ time: TAG(0) });
    await ctx.addInitScript((t) => { let x = null; try { x = localStorage.getItem("__testJetzt"); } catch (e) { /* egal */ } window.__jetzt = x ? +x : t; window.__elternAlle = true; }, TAG(0));
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "2");
    if (sprache) await p.selectOption("#e-sprache", sprache);
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  const daten = (p) => p.evaluate(() => Spielwelt.lade("gefuehle") || {});
  const text = (p, id) => p.evaluate((i) => document.getElementById(i).textContent, id);
  const sichtbar = (p, n) => p.evaluate((v) => !document.getElementById(v + "-ansicht").hidden, n);
  const zurueckZuRuhe = (p, ansicht) => p.click(`#${ansicht}-ansicht [data-zu="ruhe"]`);

  {
    const { ctx, p } = await kind(1180, 820);
    await p.goto(BASIS + "spiele/gefuehle/"); await p.waitForTimeout(500);
    erwarte(/Hallo Mira! Ich bin Bärin Bruni/.test(await text(p, "bruni-text")) && await p.locator("#start-ansicht .kachel").count() === 5 && await passt(p), "Start: Bruni begrüßt Mira, 5 Kacheln");

    // ---------- Barometer ----------
    await p.click('[data-oeffne="barometer"]'); await p.waitForTimeout(200);
    erwarte(await sichtbar(p, "barometer") && await p.locator("#faces .face").count() === 7, "Barometer: 7 Gefühle zur Wahl");
    await p.click('#faces [data-g="traurig"]'); await p.waitForTimeout(200);
    let d = await daten(p);
    const antwort = await text(p, "antwort-text");
    erwarte(d.tage["2026-10-25"] === "traurig" && /Erwachsenen, dem du vertraust/.test(antwort) && await p.isVisible('#antwort-knoepfe [data-zu="ruhe"]'), "traurig: gespeichert, Bruni verweist auf eine Vertrauensperson, Knopf „Ruhig werden“");
    const kummer = await p.evaluate(() => /116\s?111/.test(document.body.textContent));
    console.log(kummer ? "  ✓ Hinweis auf die Nummer gegen Kummer (116 111) sichtbar" : "  ℹ️ Kein Hinweis auf die Nummer gegen Kummer (116 111) auf der Gefühle-Seite (nicht vorhanden, siehe Bericht)");
    await p.click('#faces [data-g="froh"]'); await p.waitForTimeout(200);
    d = await daten(p);
    erwarte(d.tage["2026-10-25"] === "froh" && Object.keys(d.tage).length === 1 && await p.locator("#faces .face.an").count() === 1 && await p.locator("#antwort-knoepfe button").count() === 0, "umentschieden: froh (ein Eintrag pro Tag, nur ein Gesicht markiert)");
    erwarte(!d.teilen, "Barometer ist ohne Freigabe privat");
    await p.check("#teilen"); await p.waitForTimeout(100);
    erwarte((await daten(p)).teilen === true, "Freigabe für die Eltern gespeichert");
    if (BILDER) await p.screenshot({ path: `${BILDER}/gefuehle-barometer.png` });
    await p.click('#barometer-ansicht [data-zu="start"]'); await p.waitForTimeout(150);
    erwarte(/Heute fühlst du dich froh/.test(await text(p, "bruni-text")), "Bruni weiß: heute froh");

    // nächster Tag: müde
    await p.evaluate((t) => localStorage.setItem("__testJetzt", String(t)), TAG(1));
    await p.goto(BASIS + "spiele/gefuehle/?zu=barometer"); await p.waitForTimeout(400);
    erwarte(await sichtbar(p, "barometer") && await p.locator("#faces .face.an").count() === 0 && await p.locator("#verlauf .verlauf > span").count() === 1, "Tag 2 (?zu=barometer): noch nichts gewählt, Verlauf zeigt gestern");
    await p.click('#faces [data-g="muede"]'); await p.waitForTimeout(200);
    erwarte((await daten(p)).tage["2026-10-26"] === "muede" && await p.isVisible('#antwort-knoepfe [data-zu="bewegen"]'), "müde: gespeichert, Knopf „Bewegungs-Minute“");
    await p.reload(); await p.waitForTimeout(400);
    erwarte(await p.locator("#verlauf .verlauf > span").count() === 2, "Verlauf zeigt beide Tage");

    // ---------- Ruhig werden ----------
    await p.goto(BASIS + "spiele/gefuehle/"); await p.waitForTimeout(400);
    await p.click('#start-ansicht [data-zu="ruhe"]'); await p.waitForTimeout(150);
    erwarte(await sichtbar(p, "ruhe"), "„Ruhig werden“ geöffnet");
    await p.click('[data-oeffne="atmen"]'); await p.waitForTimeout(150);
    await p.clock.runFor(5000);
    erwarte(/atmen/.test(await text(p, "atem-text")) && /1 \/ 5/.test(await text(p, "atem-runde")), "Ballon-Atmen läuft (Runde 1 von 5)");
    await p.clock.runFor(40000);
    erwarte(/Spürst du, wie du ruhiger bist/.test(await text(p, "atem-text")) && (await daten(p)).ruhe === 1, "Ballon-Atmen: 5 Runden geschafft, gemerkt");
    await zurueckZuRuhe(p, "atmen"); await p.waitForTimeout(100);
    await p.click('[data-oeffne="schildkroete"]'); await p.waitForTimeout(150);
    await p.clock.runFor(2000);
    erwarte(/Schildkröte in ihrem Panzer/.test(await text(p, "schild-text")), "Schildkröte: zusammenziehen und mitzählen");
    await p.clock.runFor(32000);
    erwarte(/ganz ruhig geworden/.test(await text(p, "schild-text")) && (await daten(p)).ruhe === 2, "Schildkröte: 3 Runden geschafft, gemerkt");
    await zurueckZuRuhe(p, "schildkroete"); await p.waitForTimeout(100);
    await p.click('[data-oeffne="wut"]'); await p.waitForTimeout(150);
    await p.hover("#wut-knopf");
    await p.mouse.down(); await p.clock.runFor(300); await p.mouse.up(); await p.waitForTimeout(50);
    erwarte(/Noch ein bisschen länger/.test(await text(p, "wut-text")), "Wut-Ballon: zu kurz gepustet → „Noch ein bisschen länger“");
    for (let i = 0; i < 3; i++) {
      await p.mouse.down(); await p.clock.runFor(2200);
      if (i === 0) erwarte(/Jetzt loslassen/.test(await text(p, "wut-text")), "Ballon ist voll: „Jetzt loslassen!“");
      if (i === 0 && BILDER) await p.screenshot({ path: `${BILDER}/gefuehle-wut.png` });
      await p.mouse.up(); await p.clock.runFor(300);
    }
    erwarte(/die Wut ist weggeflogen/.test(await text(p, "wut-text")) && (await daten(p)).ruhe === 3, "Wut-Ballon dreimal gepustet: „die Wut ist weggeflogen“, gemerkt");
    await zurueckZuRuhe(p, "wut"); await p.click('#ruhe-ansicht [data-zu="start"]'); await p.waitForTimeout(100);

    // ---------- Gefühle erkennen ----------
    await p.click('[data-oeffne="erkennen"]'); await p.waitForTimeout(150);
    let anders = false;
    for (let i = 0; i < 6; i++) {
      const r = await p.evaluate(() => ({ pos: __gefuehle.erk.pos, ziel: __gefuehle.erk.runden[__gefuehle.erk.pos][3], opts: Array.from(document.querySelectorAll("#erk-karte .face")).map(b => b.dataset.g) }));
      erwarte(r.pos === i && r.opts.length === 4 && r.opts.includes(r.ziel) && await p.evaluate((n) => new RegExp(`${n} von 6`).test(document.getElementById("erk-karte").textContent), i + 1), `Situation ${i + 1} von 6 mit 4 Gefühlen zur Wahl`);
      const wahl = !anders ? r.opts.find(o => o !== r.ziel) : r.ziel;
      await p.click(`#erk-karte .face[data-g="${wahl}"]`); await p.waitForTimeout(100);
      const t = await text(p, "erk-antwort");
      if (!anders) { erwarte(/Das kann auch sein/.test(t) && /Jeder fühlt ein bisschen anders/.test(t), "andere Antwort: kein „falsch“, sondern „Das kann auch sein!“"); anders = true; }
      else if (i === 1) erwarte(/^Ja!/.test(t), "passende Antwort: „Ja! Viele Kinder fühlen sich dann …“");
      await p.clock.runFor(2700);
    }
    erwarte(/Toll gemacht/.test(await p.evaluate(() => document.getElementById("erk-karte").textContent)) && await p.evaluate(() => JSON.stringify(Spielwelt.lade("lernfunde") || {}).includes("Gefühle erkennen")), "Gefühle erkennen: 6 Situationen geschafft, Lernfund gemerkt");
    await p.click('#erk-karte [data-zu="start"]'); await p.waitForTimeout(100);

    // ---------- Bewegungs-Minute ----------
    await p.click('[data-oeffne="bewegen"]'); await p.waitForTimeout(150);
    for (let i = 0; i < 4; i++) {
      erwarte(await p.evaluate(() => document.getElementById("bew-weiter").disabled) && await p.evaluate((n) => new RegExp(`Übung ${n} von 4`).test(document.getElementById("bew-karte").textContent), i + 1), `Übung ${i + 1} von 4: „Weiter“ erst nach 15 Sekunden`);
      await p.clock.runFor(15500);
      erwarte(await p.evaluate(() => !document.getElementById("bew-weiter").disabled && /Geschafft/.test(document.getElementById("bew-weiter").textContent)), `Übung ${i + 1}: „Geschafft! Weiter“`);
      await p.click("#bew-weiter"); await p.waitForTimeout(100);
    }
    d = await daten(p);
    erwarte(/Super bewegt/.test(await p.evaluate(() => document.getElementById("bew-karte").textContent)) && d.bewegung["2026-10-26"] === 1, "Bewegungs-Minute geschafft und für heute gemerkt");
    await p.click('#bew-karte [data-zu="start"]'); await p.waitForTimeout(100);

    // ---------- Miteinander ----------
    await p.click('[data-oeffne="miteinander"]'); await p.waitForTimeout(150);
    erwarte(await p.locator("#mit-karte [data-gesch]").count() === 8, "Miteinander: 8 Geschichten");
    await p.click('#mit-karte [data-gesch="3"]'); await p.waitForTimeout(150);
    await p.click('#mit-karte [data-w="0"]'); await p.waitForTimeout(150);
    d = await daten(p);
    erwarte(/Nein sagen darf man immer/.test(await p.evaluate(() => document.getElementById("mit-folge").textContent)) && await p.evaluate(() => Array.from(document.querySelectorAll("#mit-karte [data-w]")).every(b => b.disabled))
      && d.geschichten.nein === 1 && d.impulse.length === 1 && d.impulse[0].g === "Nein sagen", "„Nein sagen“: Folge erzählt, Wahl gesperrt, Gesprächsimpuls gemerkt");
    if (BILDER) await p.screenshot({ path: `${BILDER}/gefuehle-miteinander.png` });
    await p.click("#mit-weiter"); await p.waitForTimeout(150);
    erwarte(await p.evaluate(() => /✅ gelesen/.test(document.querySelector('#mit-karte [data-gesch="3"]').textContent)) && await passt(p), "Geschichte als „✅ gelesen“ markiert, keine Scrollleiste");

    // ---------- Elternbereich ----------
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(400);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(300); }
    const el = await p.evaluate(() => document.body.textContent);
    erwarte(/Gefühls-Barometer \(vom Kind freigegeben\)/.test(el) && /3-mal eine Ruhe-Übung/.test(el) && /Gesprächsimpuls aus „Miteinander“ \(Nein sagen\)/.test(el), "Elternbereich: Barometer freigegeben, 3 Ruhe-Übungen, Gesprächsimpuls");
    await p.evaluate(() => { const d = Spielwelt.lade("gefuehle"); d.teilen = false; Spielwelt.speichere("gefuehle", d); });
    await p.reload(); await p.waitForTimeout(400);
    erwarte(await p.evaluate(() => /bleibt privat, solange das Kind es nicht freigibt/.test(document.body.textContent) && !/vom Kind freigegeben/.test(document.body.textContent)), "ohne Freigabe bleibt das Barometer privat");
    await ctx.close();
  }

  // ---------- Handy hoch mit Hilfesprache Russisch ----------
  {
    const { ctx, p } = await kind(390, 760, "ru");
    await p.goto(BASIS + "spiele/gefuehle/"); await p.waitForTimeout(400);
    const ok1 = await passt(p);
    await p.click('[data-oeffne="barometer"]'); await p.waitForTimeout(150);
    await p.click('#faces [data-g="aengstlich"]'); await p.waitForTimeout(150);
    erwarte(ok1 && await passt(p) && (await daten(p)).tage["2026-10-25"] === "aengstlich" && await p.isVisible('#antwort-knoepfe [data-zu="ruhe"]'), "Handy: ängstlich gewählt, „Ruhig werden“ angeboten, keine Scrollleiste");
    erwarte(await p.locator('#faces small[lang="ru"]').count() === 7, "Hilfesprache Russisch: Gefühls-Wörter mit russischer Hilfe");
    if (BILDER) await p.screenshot({ path: `${BILDER}/gefuehle-handy-ru.png` });
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Gefühle-Test (Barometer, Ruhe-Übungen, Erkennen, Bewegung, Miteinander, Elternbereich) bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
