// Test Sorbisch als Muttersprache (Lehrplan Grundschule Sorbisch 2004, nur nach Eltern-Wahl eltern.sorbisch.art = "mutter"):
// Wahl im Elternbereich (Fremdsprache/Muttersprache), Sichtbarkeit je Klasse, alle 25 Lektionen in /dev echt durchgeklickt (Wahl, Lesetext,
// Satzbau, sorbische Aufgabe mit deutscher Hilfe), „Zeig, was du kannst“ mit einem Fehler (eigener Schlüssel m<kl>:<lb>), Elternbereich
// (Lehrplan „Sorbisch (Muttersprache)“ statt Fremdsprache), Prüfseite mit den Muttersprache-Texten. Braucht ein frisch gebautes /dev.
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const DEV = BASIS + "dev/";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  const passt = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  async function kind(stufe, { basis = DEV, breite = 1180, hoehe = 820 } = {}) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__elternAlle = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(basis); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  const waehle = (p, art) => p.evaluate((art) => { const e = Spielwelt.lade("eltern") || {}; e.sorbisch = Object.assign({}, e.sorbisch, { an: true, art }); Spielwelt.speichere("eltern", e); }, art);
  const sichtbar = (p) => p.evaluate(() => document.querySelectorAll("#lektionen .lek").length);
  async function eltern(p, basis = DEV) {
    await p.goto(basis + "spiele/eltern/"); await p.waitForTimeout(400);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(500); }
  }

  // ---------- Elternbereich: Wahl Muttersprache, Lehrplan wechselt ----------
  {
    const { ctx, p } = await kind("3");
    await eltern(p);
    await p.selectOption("#so-an", "1"); await p.selectOption("#so-art", "mutter"); await p.click("#so-speichern"); await p.waitForTimeout(200);
    erwarte(await p.evaluate(() => { const s = Spielwelt.lade("eltern").sorbisch || {}; return s.an === true && s.art === "mutter"; }), "Elternbereich: Wahl „als Muttersprache“ wird gespeichert");
    await p.reload(); await p.waitForTimeout(400); if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(500); }
    const lp = await p.evaluate(() => [...document.querySelectorAll(".lp-fach")].map(h => h.textContent));
    erwarte(lp.some(t => /^Sorbisch \(Muttersprache\)/.test(t)) && !lp.some(t => /^Sorbisch \(Lehrplan Sorbisch als Fremd/.test(t) || /^Sorbisch \(/.test(t) && /Fremdsprache/.test(t)),
      "Elternbereich: „Was übt die App?“ zeigt Sorbisch (Muttersprache), nicht die Fremdsprache");
    erwarte(await p.evaluate(() => /von 25/.test(document.getElementById("so-pruefstand").textContent) && [...document.querySelectorAll("#so-schule option")].some(o => /Prawje pisać/.test(o.textContent))),
      "Sorbisch-Karte: Prüfstand der 25 Muttersprache-Lektionen, Lernbereiche des Lehrplans 2004 bei „gerade in der Schule“");
    await bild(p, "sorbischmutter-eltern");
    await ctx.close();
  }

  // ---------- Sichtbarkeit je Klasse ----------
  for (const [stufe, anzahl] of [["1", 8], ["2", 17], ["4", 25]]) {
    const { ctx, p } = await kind(stufe);
    await waehle(p, "mutter");
    await p.goto(DEV + "spiele/sorbisch/"); await p.waitForTimeout(400);
    const n = await sichtbar(p), titel = await p.evaluate(() => document.querySelector("#liste-ansicht h1").textContent);
    erwarte(n === anzahl && titel === "Serbšćina", `/dev Klasse ${stufe}: ${anzahl} Muttersprache-Lektionen sichtbar (${n}), Überschrift „Serbšćina“`);
    await ctx.close();
  }
  {
    const { ctx, p } = await kind("4");
    await waehle(p, "fremd");
    await p.goto(DEV + "spiele/sorbisch/"); await p.waitForTimeout(400);
    erwarte(await sichtbar(p) === 47 && await p.evaluate(() => !__sorbisch.mutter), "Fremdsprache gewählt: weiter die 47 Lektionen der Fremdsprache");
    await ctx.close();
  }

  // ---------- Alle Lektionen echt durchklicken ----------
  const genau = (t) => new RegExp(`^${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);
  async function spiele(p, id, falschEinmal, lernstand) {
    if (lernstand) await p.evaluate((nr) => __sorbisch.starteLernstand(nr), lernstand);
    else await p.evaluate((id) => __sorbisch.starte(SORBISCH_MUTTER.findIndex(k => k.id === id)), id);
    await p.waitForTimeout(150);
    let runden = 0, haengt = false, scroll = false;
    while (runden++ < 40) {
      const l = await p.evaluate(() => { const l = __sorbisch.lauf; return { ende: !document.getElementById("ende-ansicht").hidden, pos: l && l.pos, s: l && l.schritte[l.pos] }; });
      if (l.ende || !l.s) break;
      if (!(await passt(p))) { scroll = true; console.log(`    Scrollleiste: ${id} Schritt ${l.pos} (${l.s.typ})`); }
      const s = l.s;
      if (s.typ === "sag") {
        if (s.so && !(await p.evaluate((so) => document.querySelector("#blase .so-text").textContent === so, s.so))) { haengt = true; console.log(`    sorbischer Text fehlt: ${id}`); break; }
        await p.click("#weiter"); await p.waitForTimeout(60); continue;
      }
      if (falschEinmal && (s.typ === "wahl" || s.typ === "textfrage")) {
        falschEinmal = false;
        const n = await p.evaluate((ziel) => [...document.querySelectorAll("#aufgabe .option")].findIndex(b => b.textContent.trim() !== ziel), s.optionen[0]);
        await p.click(`#aufgabe .option >> nth=${n}`);
        erwarte(await p.evaluate(() => document.getElementById("hinweis").classList.contains("nein") && __sorbisch.lauf.fehler === 1), "falsche Antwort wird erkannt und zählt einmal");
      }
      if (s.typ === "textfrage" && !(await p.evaluate(() => !!document.querySelector("#aufgabe .lesetext")))) { haengt = true; console.log(`    Lesetext fehlt: ${id}`); break; }
      if (s.typ === "wahl" || s.typ === "textfrage") await p.locator("#aufgabe .option").filter({ hasText: genau(s.optionen[0]) }).first().click();
      else if (s.typ === "satz") { for (const w of s.woerter) await p.click(`#chips .chip:not(.weg) >> text="${w}"`); await p.click("#pruefen"); }
      else { haengt = true; console.log(`    unbekannter Schritt ${s.typ}`); break; }
      await p.waitForTimeout(60);
      if (!(await p.evaluate(() => document.getElementById("hinweis").classList.contains("gut")))) { haengt = true; console.log(`    nicht angenommen: ${id} Schritt ${l.pos} (${s.typ})`); break; }
      if (["sm-mica", "sm-krabat"].includes(id) && runden < 4) await bild(p, `sorbischmutter-${id}-${runden}`);
      await p.evaluate((pos) => __sorbisch.schritt(pos + 1), l.pos);
    }
    const ende = await p.evaluate(() => ({ an: !document.getElementById("ende-ansicht").hidden, text: document.getElementById("ende-text").textContent }));
    return { ok: !haengt && !scroll && ende.an, ende };
  }
  {
    const { ctx, p } = await kind("4");
    await p.evaluate(() => { const e = Spielwelt.lade("eltern") || {}; e.sorbisch = { an: true, art: "mutter", schule: "4" }; Spielwelt.speichere("eltern", e); });
    await p.goto(DEV + "spiele/sorbisch/"); await p.waitForTimeout(400);
    await p.evaluate(() => { window.__gesprochen = []; Sprache.verfuegbar = () => true; Sprache.hat = () => true;
      Sprache.sprich = (t, l, f) => { window.__gesprochen.push([t, l]); if (f) setTimeout(f, 10); }; Sprache.stopp = () => {}; });
    erwarte(await p.evaluate(() => { const g = document.querySelector("#lektionen .en-gruppe"); return g && g.dataset.lb === "4" && g.classList.contains("schule"); }),
      "„Gerade in der Schule“ (Richtig schreiben) steht oben und ist markiert");
    erwarte(await passt(p), "Übersicht quer ohne Scrollleiste");
    await bild(p, "sorbischmutter-liste");
    const ids = await p.evaluate(() => SORBISCH_MUTTER.map(k => k.id));
    let alleOk = true;
    for (const [n, id] of ids.entries()) {
      const r = await spiele(p, id, n === 0);
      if (!r.ok) { alleOk = false; console.log(`    ${id}: nicht bis zum Ende`); }
      if (n === 0) erwarte(r.ok && /zweiten Versuch/.test(r.ende.text), "„Pismiki“ mit einem Fehler bis zum Ende, Fehler wird angezeigt");
      else if (!/beim ersten Mal richtig/.test(r.ende.text)) { alleOk = false; console.log(`    ${id}: ${r.ende.text}`); }
    }
    erwarte(alleOk && ids.length === 25, "/dev quer: alle 25 Muttersprache-Lektionen echt durchgeklickt bis zum Ende");
    const sorbischGesprochen = await p.evaluate(() => window.__gesprochen.filter(([t, l]) => l !== "de-DE" && !/^ru/.test(l) ||
      SORBISCH_MUTTER.some(k => k.schritte.some(s => s.so && t.trim() === s.so || s.typ === "textfrage" && t.includes(s.text)))));
    if (sorbischGesprochen.length) console.log("    vorgelesen:", sorbischGesprochen.slice(0, 3));
    erwarte(sorbischGesprochen.length === 0, "Sorbische Aufgaben und Lesetexte werden nie vorgelesen (nur die deutsche Hilfe)");
    const stand = await p.evaluate(() => Object.keys((Spielwelt.lade("sorbisch") || {}).lektionen || {}).filter(id => id.startsWith("sm-")).length);
    erwarte(stand === 25, `Fortschritt gespeichert (${stand} Lektionen)`);
    // „Zeig, was du kannst“ (Lernbereich 4: Richtig schreiben) mit einem Fehler
    const r = await spiele(p, "lernstand", true, 4);
    const ls = await p.evaluate(() => (Spielwelt.lade("sorbisch").lernstand || {}));
    erwarte(r.ende.an && ls["m4:4"] && ls["m4:4"].n === 4 && ls["m4:4"].richtig === 3 && !ls["k4:4"],
      `„Zeig, was du kannst“ Richtig schreiben: Aufgaben aus 4 Lektionen, eine mit Fehler, eigener Schlüssel m4:4 (${JSON.stringify(ls["m4:4"] && [ls["m4:4"].richtig, ls["m4:4"].n])})`);
    await eltern(p);
    erwarte(await p.evaluate(() => /Kl\. 4 · Prawje pisać/.test(document.getElementById("lernstand-sorbisch").textContent)), "Elternbereich: Ergebnis in der Sorbisch-Karte (Muttersprache)");
    await ctx.close();
  }
  {
    const { ctx, p } = await kind("3", { breite: 390, hoehe: 760 });
    await waehle(p, "mutter");
    await p.goto(DEV + "spiele/sorbisch/"); await p.waitForTimeout(400);
    erwarte(await passt(p), "Handy: Übersicht ohne Scrollleiste");
    let ok = true;
    for (const id of ["sm-ptaci", "sm-krabat", "sm-list", "sm-slownik"]) { const r = await spiele(p, id, false); if (!r.ok) { ok = false; console.log("    hoch: " + id); } }
    erwarte(ok, "Handy hoch: vier Lektionen mit langen Lesetexten echt durchgeklickt, ohne Scrollleiste");
    await bild(p, "sorbischmutter-handy");
    await ctx.close();
  }

  // ---------- Prüfseite ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, serviceWorkers: "block" });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    await p.goto(BASIS + "spiele/sorbisch/pruefen.html"); await p.waitForTimeout(300);
    const g = await p.evaluate(() => __pruefen.gruppen().filter(x => x.id.startsWith("sm-") || x.id === "mutter-seite"));
    erwarte(g.length === 26 && g.every(x => x.n >= 3), `Prüfseite: Muttersprache-Überschriften und 25 Lektionen mit sorbischen Texten (${g.reduce((n, x) => n + x.n, 0)} Einträge)`);
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Sorbisch-Muttersprache-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
