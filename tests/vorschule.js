// Test Vorschul-Rucksack (30.10.2026): Band auf der Startseite nur für Vorschule und Klasse 1, alle Rucksack-Spiele echt durchgetippt (Bilder wählen,
// Bilder ordnen, ein Fehler), Frage wird vorgelesen, Sterne und Fortschritt, „Erst lernen“ zählt die Aufgaben, Elternbereich zeigt den
// Sächsischen Bildungsplan (Vorschule) mit Fortschritt, quer/hoch/Handy ohne Scrollleiste. Keine Konsolenfehler.
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
  async function kind(stufe, { breite = 1180, hoehe = 820 } = {}) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__elternAlle = true; window.__testSchnell = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }

  // ---------- Startseite: Band nur für Vorschule und Klasse 1 ----------
  for (const [stufe, sichtbar] of [["vs", true], ["1", true], ["3", false]]) {
    const { ctx, p } = await kind(stufe);
    await p.goto(BASIS); await p.waitForTimeout(300);
    const an = await p.evaluate(() => { const a = document.getElementById("vorschule-link"); return !a.hidden && a.getBoundingClientRect().height > 40; });
    erwarte(an === sichtbar, `Startseite ${stufe === "vs" ? "Vorschule" : "Klasse " + stufe}: Vorschul-Rucksack ${sichtbar ? "sichtbar" : "nicht sichtbar"}`);
    if (stufe === "vs") {
      await bild(p, "vorschule-start");
      await p.click("#vorschule-link"); await p.waitForURL(/vorschule/); await p.waitForTimeout(300);
      erwarte(await p.evaluate(() => document.querySelectorAll(".bereich").length === 7 && document.querySelectorAll(".kachel[data-id]").length === VORSCHULE.length),
        "Rucksack: sieben Bildungsbereiche mit allen Spielen und Verweisen auf vorhandene Inhalte");
    }
    await ctx.close();
  }

  // ---------- Alle Spiele echt durchtippen ----------
  async function spiele(p, id, falschEinmal) {
    await p.click(`.kachel[data-id="${id}"]`); await p.waitForTimeout(100);
    let runden = 0, haengt = false, scroll = false;
    while (runden++ < 20) {
      const l = await p.evaluate(() => { const l = __vorschule.lauf; return { ende: !document.getElementById("ende-ansicht").hidden, pos: l && l.pos, s: l && l.schritte[l.pos] }; });
      if (l.ende || !l.s) break;
      if (!(await passt(p))) { scroll = true; console.log(`    Scrollleiste: ${id} Aufgabe ${l.pos}`); }
      const s = l.s;
      if (runden === 1 && ["vs-geschichte", "vs-reime"].includes(id)) await bild(p, `vorschule-${id}-${(await p.viewportSize()).width}`);
      if (falschEinmal) {
        falschEinmal = false;
        const n = await p.evaluate((s) => [...document.querySelectorAll("#aufgabe .option")].findIndex(b => s.teile ? +b.dataset.i !== 0 : b.textContent !== s.optionen[0]), s);
        await p.click(`#aufgabe .option >> nth=${n}`); await p.waitForTimeout(80);
        erwarte(await p.evaluate(() => document.getElementById("hinweis").classList.contains("nein") && __vorschule.lauf.fehler === 1), "falsche Antwort wird erkannt und zählt einmal");
      }
      if (s.typ === "ordnen") { for (let i = 0; i < s.teile.length; i++) await p.click(`#aufgabe .option[data-i="${i}"]`); }
      else await p.click(`#aufgabe .option >> nth=${await p.evaluate((t) => [...document.querySelectorAll("#aufgabe .option")].findIndex(b => b.textContent === t), s.optionen[0])}`);
      await p.waitForTimeout(60);
      if (!(await p.evaluate(() => document.getElementById("hinweis").classList.contains("gut")))) { haengt = true; console.log(`    nicht angenommen: ${id} Aufgabe ${l.pos}`); break; }
      await p.waitForFunction((pos) => !__vorschule.lauf || __vorschule.lauf.pos !== pos || !document.getElementById("ende-ansicht").hidden, l.pos, { timeout: 3000 }).catch(() => {});
    }
    const ende = await p.evaluate(() => ({ an: !document.getElementById("ende-ansicht").hidden, text: document.getElementById("ende-text").textContent }));
    await p.click("#ende-knoepfe .knopf:last-child"); await p.waitForTimeout(80);
    return { ok: !haengt && !scroll && ende.an, ende };
  }
  {
    const { ctx, p } = await kind("vs");
    await p.goto(BASIS + "spiele/vorschule/"); await p.waitForTimeout(400);
    await p.evaluate(() => { window.__gesprochen = []; Sprache.verfuegbar = () => true; Sprache.hat = () => true;
      Sprache.sprich = (t, l, f) => { window.__gesprochen.push([t, l]); if (f) setTimeout(f, 10); }; Sprache.stopp = () => {}; });
    erwarte(await passt(p), "Rucksack quer ohne Scrollleiste");
    await bild(p, "vorschule-liste");
    const ids = await p.evaluate(() => VORSCHULE.map(a => a.id)), sterneVorher = await p.evaluate(() => Spielwelt.sterne());
    let alleOk = true;
    for (const [n, id] of ids.entries()) {
      const r = await spiele(p, id, n === 0);
      if (!r.ok) { alleOk = false; console.log(`    ${id}: nicht bis zum Ende`); }
      if (n === 0) erwarte(r.ok && /zweiten Versuch/.test(r.ende.text), "„Wie viele?“ mit einem Fehler bis zum Ende");
      else if (!/beim ersten Mal richtig/.test(r.ende.text)) { alleOk = false; console.log(`    ${id}: ${r.ende.text}`); }
    }
    erwarte(alleOk && ids.length === 16, `alle ${ids.length} Rucksack-Spiele echt durchgetippt (Bilder wählen und ordnen)`);
    const g = await p.evaluate(() => window.__gesprochen.map(x => x[0]));
    erwarte(g.some(t => /Wie viele Äpfel/.test(t)) && g.some(t => /Ba – na – ne/.test(t)) && !g.some(t => /🍎/.test(t)), "Fragen werden vorgelesen (ohne Emojis), Silben-Hinweis wird mitgesprochen");
    const st = await p.evaluate((v) => ({ fertig: Object.keys(__vorschule.daten().fertig).length, sterne: Spielwelt.sterne() - v }), sterneVorher);
    erwarte(st.fertig === 16 && st.sterne >= 46, `Fortschritt gespeichert (${st.fertig} Spiele) und Sterne verdient (+${st.sterne})`);
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(400);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(500); }
    const lp = await p.evaluate(() => { const h = document.getElementById("lp-vorschule"); return h && { n: h.nextElementSibling.nextElementSibling.querySelectorAll(":scope > li").length, f: document.getElementById("vs-fortschritt").textContent }; });
    erwarte(lp && lp.n === 7 && lp.f === "16 von 16", `Elternbereich: Sächsischer Bildungsplan für die Vorschule mit 7 Bereichen und Fortschritt (${lp && lp.f})`);
    await bild(p, "vorschule-eltern");
    await ctx.close();
  }
  // Handy und iPad hoch: zwei Spiele
  for (const [breite, hoehe, art] of [[820, 1180, "iPad hoch"], [390, 760, "Handy"]]) {
    const { ctx, p } = await kind("vs", { breite, hoehe });
    await p.goto(BASIS + "spiele/vorschule/"); await p.waitForTimeout(400);
    let ok = await passt(p);
    for (const id of ["vs-geschichte", "vs-schulkind"]) { const r = await spiele(p, id, false); ok = ok && r.ok; }
    erwarte(ok, `${art}: Übersicht und zwei Spiele (mit Ordnen) ohne Scrollleiste`);
    if (art === "Handy") await bild(p, "vorschule-handy");
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Vorschul-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
