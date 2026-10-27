// Test Englisch-Einstieg: Tür auf der Startseite, Sichtbarkeit je Klasse und Eltern-Einstellung „ab Klasse 1“,
// alle Lektionen echt durchgeklickt (Wortkarten, Lesen, Übersetzen, Satzbau, Wahl), Hören mit (simulierter) englischer Stimme,
// falsche Antwort zählt, Sterne und Fähigkeit „Englisch-Ohr“, Eltern-Karte. Keine Konsolenfehler, keine waagerechte Scrollleiste.
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  const passt = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
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
  const sichtbar = (p) => p.evaluate(() => [...document.querySelectorAll("#lektionen .lek")].length);

  // ---------- Startseite: Tür „Englisch“ ----------
  for (const [breite, hoehe, art] of [[1180, 820, "quer"], [820, 1180, "iPad hoch"], [390, 760, "Handy"]]) {
    const { ctx, p } = await kind("3", breite, hoehe);
    await p.goto(BASIS); await p.waitForTimeout(400);
    const tuer = await p.evaluate(() => { const t = document.querySelector(".tuer.englisch"), r = t && t.getBoundingClientRect(); return !!t && r.width > 120 && r.height > 120 && t.getAttribute("href") === "spiele/englisch/"; });
    erwarte(tuer && await passt(p), `Startseite ${art}: Tür „Englisch“ sichtbar, keine Scrollleiste`);
    await bild(p, "englisch-start-" + art.replace(" ", "-"));
    await ctx.close();
  }

  // ---------- Sichtbarkeit je Klasse ----------
  for (const [stufe, anzahl] of [["1", 0], ["2", 15], ["3", 26], ["4", 27], ["5", 27]]) {
    const { ctx, p } = await kind(stufe);
    await p.goto(BASIS + "spiele/englisch/"); await p.waitForTimeout(400);
    const n = await sichtbar(p), hinweis = await p.evaluate(() => document.getElementById("intro-text").textContent);
    erwarte(n === anzahl && (anzahl || /Klasse 3/.test(hinweis)), `Klasse ${stufe}: ${anzahl} Lektionen sichtbar (${n})${anzahl ? "" : ", mit ehrlichem Hinweis"}`);
    if (stufe === "1") {
      await p.evaluate(() => { const e = Spielwelt.lade("eltern") || {}; e.englisch = { ab: "1" }; Spielwelt.speichere("eltern", e); });
      await p.reload(); await p.waitForTimeout(400);
      erwarte(await sichtbar(p) === 15, "Klasse 1 mit Eltern-Einstellung „ab Klasse 1“: die 15 Lektionen der Stufe 3 sichtbar");
    }
    await ctx.close();
  }

  // ---------- Alle Lektionen echt durchklicken ----------
  async function spiele(p, id, art, falschEinmal) {
    await p.evaluate((id) => __englisch.starte(ENGLISCH.findIndex(k => k.id === id)), id); await p.waitForTimeout(150);
    let runden = 0, haengt = false, scroll = false, hoerenGesehen = false;
    while (runden++ < 40) {
      const l = await p.evaluate(() => { const l = __englisch.lauf; return { ende: !document.getElementById("ende-ansicht").hidden, pos: l && l.pos, s: l && l.schritte[l.pos] }; });
      if (l.ende || !l.s) break;
      if (!(await passt(p))) { scroll = true; console.log(`    Scrollleiste: ${id} Schritt ${l.pos} (${l.s.typ})`); }
      const s = l.s;
      if (s.typ === "sag" || s.typ === "karten") {
        if (s.typ === "karten") { await p.click(".wortkarte >> nth=0"); if (BILDER && id === "en-colours") await bild(p, `englisch-karten-${art}`); }
        await p.click("#weiter"); await p.waitForTimeout(80); continue;
      }
      if (falschEinmal && (s.typ === "lesen" || s.typ === "deutsch")) { // einmal absichtlich falsch: zählt als Fehler
        falschEinmal = false;
        const n = await p.evaluate((ziel) => [...document.querySelectorAll("#aufgabe .option")].findIndex(b => !b.textContent.includes(ziel)), s.typ === "lesen" ? s.wort.e : s.wort.en);
        await p.click(`#aufgabe .option >> nth=${n}`);
        erwarte(await p.evaluate(() => document.getElementById("hinweis").classList.contains("nein") && __englisch.lauf.fehler === 1), "falsche Antwort wird erkannt und zählt einmal");
      }
      if (s.typ === "hoeren") { hoerenGesehen = true; await p.click("#hoeren"); }
      if (s.typ === "lesen" || s.typ === "hoeren") await p.locator("#aufgabe .option", { hasText: s.wort.e }).first().click();
      else if (s.typ === "deutsch") await p.locator(`#aufgabe .option`, { hasText: s.wort.en }).filter({ hasText: new RegExp(`^${s.wort.en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`) }).first().click();
      else if (s.typ === "wahl") await p.locator(`#aufgabe .option`).filter({ hasText: new RegExp(`^${s.optionen[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`) }).first().click();
      else if (s.typ === "satz") { for (const w of s.woerter) await p.click(`#chips .chip:not(.weg) >> text="${w}"`); await p.click("#pruefen"); }
      else { haengt = true; break; }
      await p.waitForTimeout(60);
      const gut = await p.evaluate(() => document.getElementById("hinweis").classList.contains("gut"));
      if (!gut) { haengt = true; console.log(`    nicht angenommen: ${id} Schritt ${l.pos} (${s.typ})`); break; }
      if (BILDER && runden < 6 && ["en-hello", "en-weather"].includes(id)) await bild(p, `englisch-${id}-${art}-${runden}`);
      await p.evaluate((pos) => __englisch.schritt(pos + 1), l.pos); // nicht 2,3 s auf das automatische Weiterblättern warten
    }
    const ende = await p.evaluate(() => ({ an: !document.getElementById("ende-ansicht").hidden, text: document.getElementById("ende-text").textContent }));
    return { ok: !haengt && !scroll && ende.an, ende, hoerenGesehen };
  }

  {
    const { ctx, p } = await kind("5");
    await p.goto(BASIS + "spiele/englisch/"); await p.waitForTimeout(400);
    const ids = await p.evaluate(() => ENGLISCH.map(k => k.id));
    const daten = await p.evaluate(() => ENGLISCH.every(k => k.lz.length && k.stufe && k.intro.ru && k.ende.ru && k.woerter.length >= 6 && k.woerter.every(w => w.en && w.de && w.ru && w.e) &&
      new Set(k.woerter.map(w => w.e)).size === k.woerter.length && (k.extra || []).every(s => s.ru)));
    erwarte(ids.length === 27 && daten, "27 Lektionen: Lernziel, Stufe, russische Entwürfe, je Wort ein eigenes Bild");
    let alleOk = true;
    for (const [n, id] of ids.entries()) {
      const r = await spiele(p, id, "quer", n === 0);
      if (!r.ok) { alleOk = false; console.log(`    ${id}: nicht bis zum Ende`); }
      if (n === 0) erwarte(r.ok && /zweiten Versuch/.test(r.ende.text), "„Hello!“ mit einem Fehler bis zum Ende, Fehler wird angezeigt");
      else if (!/beim ersten Mal richtig/.test(r.ende.text)) { alleOk = false; console.log(`    ${id}: ${r.ende.text}`); }
    }
    erwarte(alleOk, "quer: alle 27 Lektionen echt durchgeklickt bis zum Ende");
    const stand = await p.evaluate(() => ({ lek: Object.keys((Spielwelt.lade("englisch") || {}).lektionen || {}).length, xp: Charakter.stufe ? Charakter.stufe("englisch") : 0 }));
    erwarte(stand.lek === 27 && stand.xp >= 1, `Fortschritt gespeichert (27 Lektionen) und Fähigkeit „Englisch-Ohr“ gewachsen (Stufe ${stand.xp})`);
    await bild(p, "englisch-ende");
    // Hören: mit simulierter englischer Stimme gibt es Hör-Aufgaben, und die Wörter werden auf Englisch gesprochen
    await p.evaluate(() => { window.__gesprochen = []; Sprache.verfuegbar = () => true; Sprache.hat = () => true;
      Sprache.sprich = (t, l, f) => { window.__gesprochen.push([t, l]); if (f) setTimeout(f, 10); }; Sprache.stopp = () => {}; });
    const r = await spiele(p, "en-animals", "quer", false);
    const gesprochen = await p.evaluate(() => window.__gesprochen.filter(([t, l]) => /^en/.test(l)).map(([t]) => t));
    erwarte(r.ok && r.hoerenGesehen && gesprochen.length > 3, `mit englischer Stimme: Hör-Aufgaben, Wörter auf Englisch gesprochen (${gesprochen.slice(0, 4).join(", ")} …)`);
    // Ich-Seite und Elternbereich
    await p.goto(BASIS + "spiele/ich/"); await p.waitForTimeout(400);
    erwarte(await p.evaluate(() => /Englisch-Ohr/.test(document.body.textContent)), "„Mein Ich“ zeigt die Fähigkeit „Englisch-Ohr“");
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(400);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(500); }
    await p.selectOption("#en-ab", "1"); await p.click("#en-speichern"); await p.waitForTimeout(200);
    erwarte(await p.evaluate(() => (Spielwelt.lade("eltern").englisch || {}).ab === "1"), "Elternbereich: Karte „Englisch wie in der Schule“ speichert den Beginn");
    await ctx.close();
  }
  {
    const { ctx, p } = await kind("4", 390, 760);
    await p.goto(BASIS + "spiele/englisch/"); await p.waitForTimeout(400);
    erwarte(await passt(p), "Handy: Übersicht ohne Scrollleiste");
    await bild(p, "englisch-liste-hoch");
    let ok = true;
    for (const id of ["en-hello", "en-home", "en-year", "en-weather"]) { const r = await spiele(p, id, "hoch", false); if (!r.ok || !/beim ersten Mal/.test(r.ende.text)) { ok = false; console.log("    hoch: " + id); } }
    erwarte(ok, "Handy hoch: vier Lektionen (mit „At home“ und „Around the year“) echt durchgeklickt, ohne Scrollleiste");
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Englisch-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
