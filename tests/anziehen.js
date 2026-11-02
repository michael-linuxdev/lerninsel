// Test Kleiderschrank (30.10.2026, „Jungen mit Mädchen gleichziehen“): Junge startet mit Scheitel-Frisur, Reiter „Kleider & Anzüge“ mit 🦸,
// neue Teile (Frisuren, Trikot, Cargo, Ritter, Basecap, Fußball …) sind da; jede Kachel aller Reiter zeigt eine sichtbare Vorschau;
// Teile echt antippen (Basecap, Trikot, Fußballschuhe) und gespeichert; Mädchen-Standard unverändert. Keine Konsolenfehler.
// 03.11.2026: neue Kinderfigur ist Standard (alle Teile mit gleichen IDs zeichnen), ↩ Zurück echt angetippt, 🔊, Eltern-Schalter alte Figur.
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  async function kind(geschlecht, name) {
    const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", name); await p.selectOption("#e-geschlecht", geschlecht);
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    await p.evaluate(() => { for (let i = 0; i < 12; i++) Zeit.aufgabe(); });
    await p.goto(BASIS + "spiele/anziehen/"); await p.waitForTimeout(600);
    return { ctx, p };
  }
  const reiter = async (p, name) => { await p.click(`.reiter:has-text("${name}")`); await p.waitForTimeout(200); };
  const tippe = async (p, name) => { await p.click(`.teil[aria-label="${name}"]`); await p.waitForTimeout(150); };

  // ---------- Junge ----------
  {
    const { ctx, p } = await kind("m", "Leon");
    const a = await p.evaluate(() => ({ haare: __anziehen.STANDARD().haare.id, n: ["haare", "oberteile", "unterteile", "kleider", "schuhe", "extras"].map(k => Puppe[k].length),
      ids: ["haare", "oberteile", "unterteile", "kleider", "schuhe", "extras"].flatMap(k => Puppe[k].map(t => t.id)) }));
    erwarte(a.haare === "scheitel", "Junge startet mit der Frisur „Scheitel“");
    const neu = ["scheitel", "igel", "wuschel", "kurzlocken", "afro", "undercut", "schulterlang", "trikot", "hemd", "polo", "dinoshirt", "raketenshirt", "heldenshirt",
      "cargo", "bermuda", "ritter", "astronaut", "pirat", "feuerwehr", "dinokostuem", "fussballschuhe", "sneaker", "cap", "piratenhut", "augenklappe", "maske", "fliege", "fussball", "kuscheldino", "schwert"];
    erwarte(neu.every(id => a.ids.includes(id)) && new Set(a.ids).size === a.ids.length, `alle ${neu.length} neuen Teile da, keine doppelten IDs (Anzahl je Reiter: ${a.n.join("/")})`);
    erwarte(await p.evaluate(() => [...document.querySelectorAll(".reiter")].some(r => /Kostüme/.test(r.textContent) && /🦸/.test(r.textContent))), "Reiter „Kostüme“ mit 🦸");
    // Jede Kachel in jedem Reiter hat eine sichtbare Vorschau
    const leer = [];
    const nReiter = await p.evaluate(() => document.querySelectorAll(".reiter").length);
    for (let i = 0; i < nReiter; i++) {
      await p.click(`.reiter >> nth=${i}`); await p.waitForTimeout(200);
      leer.push(...await p.evaluate(() => [...document.querySelectorAll(".teil:not(.nichts)")].filter(b => {
        const svg = b.querySelector("svg"); if (!svg) return true;
        const vb = svg.viewBox.baseVal, bb = svg.getBBox();
        // sichtbar: Inhalt überschneidet den Ausschnitt deutlich
        const w = Math.min(bb.x + bb.width, vb.x + vb.width) - Math.max(bb.x, vb.x), h = Math.min(bb.y + bb.height, vb.y + vb.height) - Math.max(bb.y, vb.y);
        return !(w > vb.width * 0.15 && h > vb.height * 0.15);
      }).map(b => b.getAttribute("aria-label"))));
    }
    erwarte(leer.length === 0, `jede Kachel zeigt eine Vorschau${leer.length ? " – leer: " + leer.join(", ") : ""}`);
    // Junge/Mädchen (02.11.2026): Kleider liegen beim Jungen hinter „Mehr Sachen“, gehen aber nicht verloren
    await reiter(p, "Kostüme");
    const vorher = await p.evaluate(() => ({ ball: !!document.querySelector('.teil[aria-label^="Ballkleid"]'), ritter: !!document.querySelector('.teil[aria-label^="Ritter-Rüstung"]'), mehr: !!document.getElementById("mehr-sachen") }));
    await p.click("#mehr-sachen"); await p.waitForTimeout(150);
    const nachher = await p.evaluate(() => !!document.querySelector('.teil[aria-label^="Ballkleid"]'));
    erwarte(!vorher.ball && vorher.ritter && vorher.mehr && nachher, "Junge: Kostüme vorn, Kleider erst nach „Mehr Sachen“");
    const gesicht = await p.evaluate(() => { const o = __anziehen.STANDARD(); return { m: Figur.zeichnePortraet(o), oben: o.oberteil.id, unten: o.unterteil.id }; });
    erwarte(gesicht.oben === "raketenshirt" && gesicht.unten === "cargo" && /200 146 188 160/.test(gesicht.m), "Junge: eigene Startkleidung (Raketen-Shirt, Cargohose) und kantigeres Kinn (neue Figur)");
    // Echt antippen
    await reiter(p, "Extras"); await tippe(p, "Basecap");
    if (BILDER) await p.screenshot({ path: `${BILDER}/anziehen-junge-extras.png` });
    await reiter(p, "Oben"); await tippe(p, "Fußball-Trikot");
    await reiter(p, "Schuhe"); await tippe(p, "Fußballschuhe");
    const z = await p.evaluate(() => Spielwelt.lade("anziehen").aktuell);
    erwarte(z.extras.cap && z.oberteil.id === "trikot" && z.schuhe.id === "fussballschuhe", "Basecap, Trikot und Fußballschuhe angetippt und gespeichert");
    if (BILDER) await p.screenshot({ path: `${BILDER}/anziehen-junge.png` });
    await ctx.close();
  }
  // ---------- Mädchen ----------
  {
    const { ctx, p } = await kind("w", "Mira");
    const m = await p.evaluate(() => ({ haare: __anziehen.STANDARD().haare.id, kleider: [...document.querySelectorAll(".reiter")].some(r => /👗/.test(r.textContent)) }));
    erwarte(m.haare !== "scheitel" && m.kleider, `Mädchen: eigener Standard (${m.haare}), Reiter mit 👗`);
    await reiter(p, "Kleider");
    const w = await p.evaluate(() => ({ ritter: !!document.querySelector('.teil[aria-label^="Ritter-Rüstung"]'), ball: !!document.querySelector('.teil[aria-label^="Ballkleid"]'), mehr: !!document.getElementById("mehr-sachen"),
      schleife: !!__anziehen.STANDARD().extras.schleife }));
    erwarte(!w.ritter && w.ball && w.mehr && w.schleife, "Mädchen: Kleider vorn, Kostüme hinter „Mehr Sachen“, Start mit Schleife");
    if (BILDER) await p.screenshot({ path: `${BILDER}/anziehen-maedchen.png` });
    // Neue Figur (03.11.2026): ein Umriss, alle 120 Teile mit denselben IDs wie bisher, jedes Teil zeichnet auf der neuen Figur
    const neu = await p.evaluate(() => {
      const P2 = window.Puppe2, P1 = window.Puppe, listen = ["gesichter", "haare", "oberteile", "unterteile", "kleider", "schuhe", "extras", "orte"];
      const gleich = listen.every(l => P2[l].map(t => t.id).join() === P1[l].map(t => t.id).join());
      const o = __anziehen.STANDARD(); let fehlt = [];
      for (const [platz, l] of [["haare", "haare"], ["oberteil", "oberteile"], ["unterteil", "unterteile"], ["kleid", "kleider"], ["schuhe", "schuhe"]]) for (const t of P2[l]) {
        const x = JSON.parse(JSON.stringify(o)); x[platz] = { id: t.id, farbe: "#3AA0E0" }; if (platz === "kleid") { x.oberteil = null; x.unterteil = null; }
        const svg = Figur.zeichneFigur(x); if (!svg || svg.length < 2000 || /undefined|NaN/.test(svg)) fehlt.push(t.id);
      }
      return { gleich, fehlt, neu: Figur.neu, buehne: /zimmer|Fenster/.test(document.getElementById("buehne").innerHTML) || document.getElementById("buehne").innerHTML.length > 5000 };
    });
    erwarte(neu.neu && neu.gleich && !neu.fehlt.length, `neue Figur ist Standard, gleiche Teile-IDs, jedes Teil zeichnet${neu.fehlt.length ? " – fehlt: " + neu.fehlt.join(", ") : ""}`);
    // ↩ Zurück echt angetippt: Kleid anziehen, Zurück → wieder wie vorher
    const bildJetzt = () => p.evaluate(() => document.getElementById("buehne").innerHTML.replace(/(t2-|k2|kd|m-|ei)[\w-]*\d+/g, "").replace(/ hops/g, ""));
    const vorZ = await bildJetzt();
    await tippe(p, "Sommerkleid");
    const mitKleid = await p.evaluate(() => (Spielwelt.lade("anziehen").aktuell.kleid || {}).id);
    await p.click("#zurueck"); await p.waitForTimeout(200);
    const nachZ = await bildJetzt();
    erwarte(mitKleid === "sommer" && nachZ === vorZ && await p.evaluate(() => document.getElementById("zurueck").disabled), "↩ Zurück: Sommerkleid angezogen, Zurück getippt – alles wie vorher");
    erwarte(await p.isVisible("#hoeren"), "🔊 im Kleiderschrank sichtbar");
    // Neu gezeichnete Extras (04.11.2026): Hand-Teile im gedrehten Arm mit Fingern darüber (nur an der Figur), eigene Kachel-Ausschnitte
    const ex = await p.evaluate(() => {
      const P = Figur.P, o = __anziehen.STANDARD(), hand = ["fussball", "teddy", "kuscheldino", "tasche", "schwert", "zauberstab", "ballon"];
      return hand.map(id => { const t = P.extras.find(e => e.id === id); o.extras = { [id]: { farbe: t.farbe } };
        const fig = Figur.zeichneFigur(o), allein = t.teil(t.farbe), vb = P.extraSicht(t, "0 0 1 1").split(" ").map(Number);
        return t.neuGezeichnet && /rotate\(/.test(allein) && fig.length > Figur.zeichneFigur(Object.assign({}, o, { extras: {} })).length + allein.length && vb[2] > 30 && vb[3] > 30; });
    });
    erwarte(ex.every(Boolean), "Extras in der Hand: neu gezeichnet, im Arm gedreht, Finger nur an der Figur, eigener Kachel-Ausschnitt");
    erwarte(await p.evaluate(() => { const t = Figur.P.extras.find(e => e.id === "pixelbrille"); return t.neuGezeichnet && /y="10[69]"/.test(t.teil("#2E2B47")); }), "Pixelbrille auf Augenhöhe");
    // Eltern-Schalter „Zeichnungen wie bis 02.11.2026“: alte Figur
    await p.evaluate(() => { const e = Spielwelt.lade("eltern"); e.zeichnung = "alt"; Spielwelt.speichere("eltern", e); });
    await p.goto(BASIS + "spiele/anziehen/"); await p.waitForTimeout(500);
    erwarte(await p.evaluate(() => !Figur.neu && /M96 114|Q96 62|r="54"/.test(Figur.zeichneFigur(__anziehen.STANDARD()))), "Eltern-Schalter: alte Figur aus teile.js");
    if (BILDER) await p.screenshot({ path: `${BILDER}/anziehen-alt.png` });
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Kleiderschrank-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
