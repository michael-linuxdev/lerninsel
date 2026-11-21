// Test „Sensible Themen“ (21.11.2026, Entscheidung des Auftraggebers): „Mein Körper gehört mir“ (Kl. 1/2) und „Ich werde größer“ (Pubertät, Kl. 4)
// sind für Kinder standardmäßig ausgeblendet – keine Kachel, kein ?thema=, kein „Zeig, was du kannst“, keine Transfer-Frage, keine Nachfrage.
// Erst der Eltern-Schalter #su-sensibel (Elternbereich → „Wie in der Schule“, echt angetippt und gespeichert) zeigt sie; dann echt bis zum Ende durchgeklickt.
// Lehrplan im Elternbereich: die Punkte stehen ehrlich auf „teilweise“ mit Hinweis. Quer und Handy.
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
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  const zurListe = async (p) => { await p.goto(BASIS + "spiele/sachkunde/"); await p.waitForSelector("#themen .su-gruppe"); };
  const lage = (p, id, lb) => p.evaluate(([id, lb]) => ({
    kachel: !!document.querySelector(`#themen button.lek[data-id="${id}"]`),
    versteckt: __sachkunde.versteckt.slice().sort(),
    lernstand: __sachkunde.lernstandThemen(lb).map(t => t.id).includes(id),
    transfer: __sachkunde.transferFragen(lb).filter(x => x.thema === id).length,
    kachelnSonst: document.querySelectorAll("#themen button.lek").length }), [id, lb]);

  async function durchklicken(p, id) {
    const kachel = `#themen button.lek[data-id="${id}"]`;
    await p.evaluate((sel) => { const b = document.querySelector(sel); const d = b && b.closest("details"); if (d) d.open = true; }, kachel);
    await p.click(kachel); await p.waitForSelector("#lektion-ansicht:not([hidden])");
    let runden = 0, haengt = false;
    while (runden++ < 80) {
      const l = await p.evaluate(() => { const l = __sachkunde.lauf; const s = l && l.t.schritte[l.pos];
        return { ende: !document.getElementById("ende-ansicht").hidden, typ: s && s.typ, schritt: s, weiter: !!document.getElementById("weiter"),
          karte: (document.querySelector(".sortier-karte") || {}).innerText || "" }; });
      if (l.ende) break;
      if (l.weiter) { await p.click("#weiter"); await p.waitForTimeout(80); continue; }
      if (l.typ === "wahl") await p.locator(".optionen .option", { hasText: l.schritt.optionen.find(o => o.ok).t }).first().click();
      else if (l.typ === "daumen") await p.locator(".daumen .option").nth(l.schritt.ok ? 0 : 1).click();
      else if (l.typ === "zuordnen") {
        const ding = l.schritt.dinge.filter(d => l.karte.includes(d.t)).sort((a, b) => b.t.length - a.t.length)[0];
        if (!ding) { haengt = true; break; }
        await p.click(`.gruppen .option[data-g="${ding.gruppe}"]`); await p.waitForTimeout(900);
      } else { haengt = true; break; }
      await p.waitForTimeout(100);
    }
    const sterne = await p.evaluate((id) => ((Spielwelt.lade("sachkunde") || {}).themen || {})[id] || 0, id);
    return !haengt && sterne > 0;
  }

  for (const [stufe, id, breite, hoehe, art] of [["2", "mein-koerper", 1180, 820, "quer"], ["4", "gross-werden", 390, 760, "handy"]]) {
    const { ctx, p } = await kind(stufe, breite, hoehe);
    await zurListe(p);
    let l = await lage(p, id, "kg");
    erwarte(!l.kachel && l.kachelnSonst > 5, `${art} Kl. ${stufe}: keine Kachel „${id}“, andere Themen da (${l.kachelnSonst})`);
    erwarte(JSON.stringify(l.versteckt) === JSON.stringify(["gross-werden", "mein-koerper"]), `${art}: beide Themen ohne Freigabe versteckt (${l.versteckt})`);
    erwarte(!l.lernstand && !l.transfer, `${art}: nicht in „Zeig, was du kannst“ und keine Transfer-Frage dazu`);
    await p.goto(BASIS + "spiele/sachkunde/?thema=" + id); await p.waitForSelector("#themen .su-gruppe"); await p.waitForTimeout(300);
    erwarte(await p.evaluate(() => document.getElementById("lektion-ansicht").hidden), `${art}: ?thema=${id} öffnet nichts`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/sensibel-aus-${art}.png` });

    // Elternbereich: Schalter echt antippen und speichern
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
    await p.click('.eltern-reiter [data-teil="schule"]'); await p.waitForSelector("#su-sensibel");
    erwarte(!(await p.isChecked("#su-sensibel")), `${art}: Schalter steht anfangs auf aus`);
    await p.locator("#su-sensibel").scrollIntoViewIfNeeded(); if (BILDER) await p.screenshot({ path: `${BILDER}/sensibel-eltern-${art}.png` });
    await p.check("#su-sensibel"); await p.click("#sj-speichern"); await p.waitForTimeout(200);
    erwarte(await p.evaluate(() => (Spielwelt.lade("eltern").sachkunde || {}).sensibel === true), `${art}: Freigabe gespeichert`);

    await zurListe(p);
    l = await lage(p, id, "kg");
    erwarte(l.kachel && !l.versteckt.length && l.lernstand && l.transfer > 0, `${art}: mit Freigabe Kachel, Lernstand und Transfer da`);
    erwarte(await durchklicken(p, id), `${art}: „${id}“ echt bis zum Ende durchgeklickt, Sterne vergeben`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/sensibel-an-${art}.png` });

    // wieder aus: das Thema verschwindet, auch wenn es schon geschafft ist
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
    await p.click('.eltern-reiter [data-teil="schule"]'); await p.waitForSelector("#su-sensibel");
    await p.uncheck("#su-sensibel"); await p.click("#sj-speichern"); await p.waitForTimeout(200);
    await zurListe(p);
    erwarte(!(await lage(p, id, "kg")).kachel, `${art}: wieder ausgeschaltet → Kachel weg`);
    await ctx.close();
  }

  // Lehrplan ehrlich: die vier Punkte stehen auf „teilweise“ mit Hinweis auf den Schalter
  {
    const txt = require("fs").readFileSync(require("path").join(__dirname, "..", "shared/lehrplan/laender/sachsen-punkte.js"), "utf8");
    const pk = ["sn.su12.kg.06", "sn.su12.kg.07", "sn.su4.kg.01", "sn.vs.1.03"].map(id => { const z = txt.split("\n").find(x => x.includes(`["${id}"`)) || "";
      return z.includes('"teil", "') && z.includes("ausgeblendet") && z.includes("Elternbereich"); });
    erwarte(pk.every(Boolean), `Lehrplan: 4 Punkte „teilweise“ mit Hinweis auf den Eltern-Schalter (${pk})`);
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Sensible-Themen-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
