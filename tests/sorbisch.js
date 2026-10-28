// Test Sorbisch (Obersorbisch, nur nach Eltern-Wahl): Tür nur mit Wahl, seit 29.10. auch auf der Hauptseite alle Entwurfs-Lektionen (ohne Freigabe nur geprüfte),
// alle 47 Lektionen in /dev echt durchgeklickt (Wortkarten, Lesen, Übersetzen, Satzbau, Wahl) – ohne sorbische Stimme, ohne Hör-Aufgaben,
// „Zeig, was du kannst“, „gerade in der Schule“, Fähigkeit „Sorbisch-Ohr“ nur mit Wahl, Elternbereich (Karte, Lehrplan), Prüfseite für die Prüferin.
// Braucht ein frisch gebautes /dev (sh quellen/dev-bauen.sh). Keine Konsolenfehler, keine waagerechte Scrollleiste.
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
  async function kind(stufe, { basis = BASIS, breite = 1180, hoehe = 820, frei = null } = {}) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__elternAlle = true; });
    if (frei) await ctx.route("**/sorbisch/geprueft.js", r => r.fulfill({ contentType: "application/javascript", body: `window.SORBISCH_FREI = ${JSON.stringify(frei)};` }));
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(basis); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  const waehle = (p, an) => p.evaluate((an) => { const e = Spielwelt.lade("eltern") || {}; e.sorbisch = Object.assign({}, e.sorbisch, { an }); Spielwelt.speichere("eltern", e); }, an);
  const sichtbar = (p) => p.evaluate(() => document.querySelectorAll("#lektionen .lek").length);
  async function eltern(p, basis = BASIS) {
    await p.goto(basis + "spiele/eltern/"); await p.waitForTimeout(400);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(500); }
  }
  const lpSorbisch = (p) => p.evaluate(() => [...document.querySelectorAll(".lp-fach")].some(h => /^Sorbisch/.test(h.textContent)));

  // ---------- Hauptseite: Wahl im Elternbereich, Tür, nur geprüfte Lektionen ----------
  {
    const { ctx, p } = await kind("3");
    erwarte(await p.evaluate(() => document.querySelector(".tuer.sorbisch").hidden), "ohne Wahl: keine Tür „Sorbisch“ auf der Startseite");
    await eltern(p);
    erwarte(!(await lpSorbisch(p)) && await p.evaluate(() => /0 von 47/.test(document.getElementById("so-pruefstand").textContent)),
      "Elternbereich ohne Wahl: kein Sorbisch unter „Was übt die App?“, Prüfstand „0 von 47“");
    await p.selectOption("#so-an", "1"); await p.selectOption("#so-schule", "8"); await p.click("#so-speichern"); await p.waitForTimeout(200);
    erwarte(await p.evaluate(() => { const s = Spielwelt.lade("eltern").sorbisch || {}; return s.an === true && s.schule === "8"; }), "Elternbereich: Karte „Sorbisch“ speichert Wahl und „gerade in der Schule“");
    await p.reload(); await p.waitForTimeout(400); if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(500); }
    erwarte(await lpSorbisch(p), "Elternbereich mit Wahl: Sorbisch unter „Was übt die App?“");
    for (const [breite, hoehe, art] of [[1180, 820, "quer"], [820, 1180, "iPad-hoch"], [390, 760, "Handy"]]) {
      await p.setViewportSize({ width: breite, height: hoehe });
      await p.goto(BASIS); await p.waitForTimeout(400);
      const tuer = await p.evaluate(() => { const t = document.querySelector(".tuer.sorbisch"), r = t.getBoundingClientRect(); return !t.hidden && r.width > 120 && r.height > 100; });
      erwarte(tuer && await passt(p), `Startseite ${art}: Tür „Sorbisch“ sichtbar, keine Scrollleiste`);
      await bild(p, "sorbisch-start-" + art);
    }
    await p.setViewportSize({ width: 1180, height: 820 });
    await p.goto(BASIS + "spiele/sorbisch/"); await p.waitForTimeout(400);
    erwarte(await sichtbar(p) === 47, "Hauptseite: alle 47 Lektionen sichtbar (Entwürfe freigegeben, Entscheidung 29.10.2026)");
    await bild(p, "sorbisch-hauptseite");
    // Ohne Freigabe der Entwürfe: nur Lektionen aus geprueft.js, sonst ehrlicher Hinweis
    await p.addInitScript(() => { let sw; Object.defineProperty(window, "Spielwelt", { configurable: true, get: () => sw, set: (v) => { v.ENTWURF_FREI = ["ru"]; sw = v; } }); });
    await p.reload(); await p.waitForTimeout(400);
    erwarte(await sichtbar(p) === 0 && /geprüft/.test(await p.evaluate(() => document.getElementById("intro-text").textContent)),
      "ohne Freigabe der Entwürfe: keine ungeprüfte Lektion, ehrlicher Hinweis „wird geprüft“");
    await ctx.close();
  }
  {
    const { ctx, p } = await kind("3", { frei: ["so-witaj", "so-preceljo"] });
    await waehle(p, true);
    await p.addInitScript(() => { let sw; Object.defineProperty(window, "Spielwelt", { configurable: true, get: () => sw, set: (v) => { v.ENTWURF_FREI = ["ru"]; sw = v; } }); });
    await p.goto(BASIS + "spiele/sorbisch/"); await p.waitForTimeout(400);
    const ids = await p.evaluate(() => [...document.querySelectorAll("#lektionen .lek")].map(b => b.dataset.id).sort().join());
    erwarte(ids === "so-preceljo,so-witaj", `ohne Freigabe der Entwürfe: genau die geprüften Lektionen sichtbar (${ids})`);
    await ctx.close();
  }

  // ---------- /dev: Sichtbarkeit je Klasse ----------
  const DEV = BASIS + "dev/";
  for (const [stufe, anzahl] of [["1", 13], ["2", 47], ["4", 47]]) {
    const { ctx, p } = await kind(stufe, { basis: DEV });
    await waehle(p, true);
    await p.goto(DEV + "spiele/sorbisch/"); await p.waitForTimeout(400);
    const n = await sichtbar(p);
    erwarte(n === anzahl, `/dev Klasse ${stufe}: ${anzahl} Lektionen sichtbar (${n})`);
    if (stufe === "4") erwarte(await p.evaluate(() => document.querySelectorAll("details.frueher").length >= 5), "/dev Klasse 4: Lektionen aus Kl. 1/2 eingeklappt („Wiederholen“)");
    await ctx.close();
  }

  // ---------- /dev: alle Lektionen echt durchklicken ----------
  async function spiele(p, id, art, falschEinmal, lernstand) {
    if (lernstand) await p.evaluate((nr) => __sorbisch.starteLernstand(nr), lernstand);
    else await p.evaluate((id) => __sorbisch.starte(SORBISCH.findIndex(k => k.id === id)), id);
    await p.waitForTimeout(150);
    let runden = 0, haengt = false, scroll = false, hoeren = false;
    while (runden++ < 40) {
      const l = await p.evaluate(() => { const l = __sorbisch.lauf; return { ende: !document.getElementById("ende-ansicht").hidden, pos: l && l.pos, s: l && l.schritte[l.pos] }; });
      if (l.ende || !l.s) break;
      if (!(await passt(p))) { scroll = true; console.log(`    Scrollleiste: ${id} Schritt ${l.pos} (${l.s.typ})`); }
      const s = l.s;
      if (s.typ === "sag" || s.typ === "karten") {
        if (s.typ === "karten") { await p.click(".wortkarte >> nth=0"); if (id === "so-barby") await bild(p, `sorbisch-karten-${art}`); }
        await p.click("#weiter"); await p.waitForTimeout(80); continue;
      }
      if (falschEinmal && (s.typ === "lesen" || s.typ === "deutsch")) {
        falschEinmal = false;
        const n = await p.evaluate((ziel) => [...document.querySelectorAll("#aufgabe .option")].findIndex(b => b.textContent.trim() !== ziel), s.typ === "lesen" ? s.wort.e : s.wort.so);
        await p.click(`#aufgabe .option >> nth=${n}`);
        erwarte(await p.evaluate(() => document.getElementById("hinweis").classList.contains("nein") && __sorbisch.lauf.fehler === 1), "falsche Antwort wird erkannt und zählt einmal");
      }
      const genau = (t) => new RegExp(`^${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);
      if (s.typ === "hoeren") { hoeren = true; haengt = true; break; }
      if (s.typ === "lesen") await p.locator("#aufgabe .option", { hasText: s.wort.e }).first().click();
      else if (s.typ === "deutsch") await p.locator("#aufgabe .option").filter({ hasText: genau(s.wort.so) }).first().click();
      else if (s.typ === "wahl") await p.locator("#aufgabe .option").filter({ hasText: genau(s.optionen[0]) }).first().click();
      else if (s.typ === "satz") { for (const w of s.woerter) await p.click(`#chips .chip:not(.weg) >> text="${w}"`); await p.click("#pruefen"); }
      else { haengt = true; break; }
      await p.waitForTimeout(60);
      if (!(await p.evaluate(() => document.getElementById("hinweis").classList.contains("gut")))) { haengt = true; console.log(`    nicht angenommen: ${id} Schritt ${l.pos} (${s.typ})`); break; }
      if (runden < 5 && ["so-witaj", "so-mesacy"].includes(id)) await bild(p, `sorbisch-${id}-${art}-${runden}`);
      await p.evaluate((pos) => __sorbisch.schritt(pos + 1), l.pos);
    }
    const ende = await p.evaluate(() => ({ an: !document.getElementById("ende-ansicht").hidden, text: document.getElementById("ende-text").textContent }));
    return { ok: !haengt && !scroll && ende.an, ende, hoeren };
  }
  {
    const { ctx, p } = await kind("4", { basis: DEV });
    await p.evaluate(() => { const e = Spielwelt.lade("eltern") || {}; e.sorbisch = { an: true, schule: "8" }; Spielwelt.speichere("eltern", e); });
    await p.goto(DEV + "spiele/ich/"); await p.waitForTimeout(400);
    // Stimme simulieren: Sorbisch darf trotzdem nie vorgelesen werden (keine sorbische Gerätestimme, keine falsche Aussprache)
    await p.addInitScript(() => { window.__gesprochen = []; });
    await p.goto(DEV + "spiele/sorbisch/"); await p.waitForTimeout(400);
    await p.evaluate(() => { window.__gesprochen = []; Sprache.verfuegbar = () => true; Sprache.hat = () => true;
      Sprache.sprich = (t, l, f) => { window.__gesprochen.push([t, l]); if (f) setTimeout(f, 10); }; Sprache.stopp = () => {}; });
    const oben = await p.evaluate(() => { const g = document.querySelector("#lektionen .en-gruppe"); return g && g.dataset.lb === "8" && g.classList.contains("schule"); });
    erwarte(oben, "„Gerade in der Schule“ (Feste und Bräuche) steht oben und ist markiert");
    await bild(p, "sorbisch-liste");
    const ids = await p.evaluate(() => SORBISCH.map(k => k.id));
    const daten = await p.evaluate(() => SORBISCH.every(k => k.lz.length && k.stufe && k.intro.ru && k.ende.ru && k.woerter.length >= 6 && k.woerter.every(w => w.so && w.de && w.ru && w.e) &&
      new Set(k.woerter.map(w => w.e)).size === k.woerter.length && (k.extra || []).every(s => s.ru)));
    erwarte(ids.length === 47 && daten, "47 Lektionen: Lernziel, Stufe, russische Entwürfe, je Wort ein eigenes Bild");
    let alleOk = true, hoeren = false;
    for (const [n, id] of ids.entries()) {
      const r = await spiele(p, id, "quer", n === 0);
      hoeren = hoeren || r.hoeren;
      if (!r.ok) { alleOk = false; console.log(`    ${id}: nicht bis zum Ende`); }
      if (n === 0) erwarte(r.ok && /zweiten Versuch/.test(r.ende.text), "„Witaj!“ mit einem Fehler bis zum Ende, Fehler wird angezeigt");
      else if (!/beim ersten Mal richtig/.test(r.ende.text)) { alleOk = false; console.log(`    ${id}: ${r.ende.text}`); }
    }
    erwarte(alleOk && !hoeren, "/dev quer: alle 47 Lektionen echt durchgeklickt bis zum Ende, keine Hör-Aufgabe");
    const sorbischGesprochen = await p.evaluate(() => window.__gesprochen.filter(([t, l]) => l !== "de-DE" && !/^ru/.test(l) || SORBISCH.some(k => k.woerter.some(w => w.so === t))).length);
    erwarte(sorbischGesprochen === 0, "Sorbische Wörter werden nie vorgelesen (nur deutsche Erklärungen)");
    await bild(p, "sorbisch-ende");
    const stand = await p.evaluate(() => ({ lek: Object.keys((Spielwelt.lade("sorbisch") || {}).lektionen || {}).length, xp: Charakter.stufe ? Charakter.stufe("sorbisch") : 0 }));
    erwarte(stand.lek === 47 && stand.xp >= 1, `Fortschritt gespeichert (47 Lektionen) und Fähigkeit „Sorbisch-Ohr“ gewachsen (Stufe ${stand.xp})`);
    // Sorbische Bräuche als Echte-Welt-Aufgaben (Vogelhochzeit, Ostereier, Osterreiten, Ortsschild, Sage, Namenstag, Mappe) nur mit Wahl
    const ew = await p.evaluate(() => EchteWelt.passend().filter(id => EchteWelt.IDEEN.find(i => i[0] === id)[1] === "sorbisch"));
    erwarte(ew.length === 7 && ew.includes("vogelhochzeit") && ew.includes("osterreiten"), `Echte Welt mit Wahl: 7 sorbische Brauch-Aufgaben (${ew.join(", ")})`);
    await waehle(p, false);
    erwarte(await p.evaluate(() => !EchteWelt.passend().some(id => EchteWelt.IDEEN.find(i => i[0] === id)[1] === "sorbisch")), "Echte Welt ohne Wahl: keine sorbischen Aufgaben");
    await waehle(p, true);
    // „Zeig, was du kannst“ (Lernbereich 1: Familie und Freunde) mit einem Fehler
    const r = await spiele(p, "lernstand", "quer", true, 1);
    const ls = await p.evaluate(() => (Spielwelt.lade("sorbisch").lernstand || {})["k4:1"]);
    erwarte(r.ende.an && ls && ls.n === 5 && ls.richtig === 4, `„Zeig, was du kannst“ Lernbereich 1 durchgespielt (Aufgaben aus 5 Lektionen, eine mit Fehler), Ergebnis gespeichert (${ls && ls.richtig} von ${ls && ls.n} Lektionen sicher)`);
    await p.goto(DEV + "spiele/ich/"); await p.waitForTimeout(400);
    erwarte(await p.evaluate(() => /Sorbisch-Ohr/.test(document.body.textContent)), "„Meine Ecke“ zeigt die Fähigkeit „Sorbisch-Ohr“ (mit Wahl)");
    await waehle(p, false); await p.reload(); await p.waitForTimeout(400);
    erwarte(await p.evaluate(() => !/Sorbisch-Ohr/.test(document.body.textContent)), "ohne Wahl: keine Fähigkeit „Sorbisch-Ohr“ in „Meine Ecke“");
    await waehle(p, true);
    await eltern(p, DEV);
    erwarte(await p.evaluate(() => /Kl\. 4 · Meine Familie|Kl\. 4 · Ja, moja/.test(document.getElementById("lernstand-sorbisch").textContent)),
      "Elternbereich: Ergebnis von „Zeig, was du kannst“ in der Sorbisch-Karte");
    await ctx.close();
  }
  {
    const { ctx, p } = await kind("3", { basis: DEV, breite: 390, hoehe: 760 });
    await waehle(p, true);
    await p.goto(DEV + "spiele/sorbisch/"); await p.waitForTimeout(400);
    erwarte(await passt(p), "Handy: Übersicht ohne Scrollleiste");
    await bild(p, "sorbisch-liste-hoch");
    let ok = true;
    for (const id of ["so-witaj", "so-jutry", "so-mesacy", "so-preceljo"]) { const r = await spiele(p, id, "hoch", false); if (!r.ok || !/beim ersten Mal/.test(r.ende.text)) { ok = false; console.log("    hoch: " + id); } }
    erwarte(ok, "Handy hoch: vier Lektionen (mit langen Wünschen und Monatsnamen) echt durchgeklickt, ohne Scrollleiste");
    await ctx.close();
  }

  // ---------- Prüfseite ----------
  for (const [breite, hoehe, art] of [[1180, 820, "quer"], [390, 760, "Handy"]]) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, serviceWorkers: "block" });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    await p.goto(BASIS + "spiele/sorbisch/pruefen.html"); await p.waitForTimeout(300);
    const gruppen = await p.evaluate(() => __pruefen.gruppen());
    erwarte(gruppen.length === 74 && gruppen.every(g => g.n >= 3), `Prüfseite ${art}: Seitentexte, 47 Lektionen und 25 der Muttersprache mit allen Einträgen (${gruppen.reduce((n, g) => n + g.n, 0)})`);
    erwarte(await passt(p), `Prüfseite ${art}: keine Scrollleiste`);
    if (art === "quer") {
      const n = gruppen.find(g => g.id === "so-witaj").n;
      for (let i = 0; i < n; i++) await p.click(`section[data-gruppe="so-witaj"] .eintrag >> nth=${i} >> .ok`);
      await p.click(`section[data-gruppe="so-swojba"] .eintrag >> nth=2 >> .nein`);
      await p.fill(`section[data-gruppe="so-swojba"] .eintrag >> nth=2 >> input`, "nan (tata)");
      await p.fill("#pruefer", "R. K.");
      const t = await p.evaluate(() => __pruefen.text());
      erwarte(/Freigeben \(alles ✓\): so-witaj\n/.test(t) && /\[so-swojba\] Wort: „nan“ → „nan \(tata\)“/.test(t) && /Geprüft von: R\. K\./.test(t),
        "Prüfseite: abhaken, korrigieren, Text mit Freigabe und Korrektur");
      await p.reload(); await p.waitForTimeout(300);
      erwarte(/so-witaj/.test(await p.evaluate(() => __pruefen.text())), "Prüfseite: Haken bleiben nach dem Neuladen erhalten (nur in diesem Browser)");
      await bild(p, "sorbisch-pruefen");
    } else await bild(p, "sorbisch-pruefen-handy");
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Sorbisch-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
