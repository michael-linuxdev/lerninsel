// Test Kleiderschrank (30.10.2026, „Jungen mit Mädchen gleichziehen“): Junge startet mit Scheitel-Frisur, Reiter „Kleider & Anzüge“ mit 🦸,
// neue Teile (Frisuren, Trikot, Cargo, Ritter, Basecap, Fußball …) sind da; jede Kachel aller Reiter zeigt eine sichtbare Vorschau;
// Teile echt antippen (Basecap, Trikot, Fußballschuhe) und gespeichert; Mädchen-Standard unverändert. Keine Konsolenfehler.
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
    erwarte(await p.evaluate(() => [...document.querySelectorAll(".reiter")].some(r => /Kleider & Anzüge/.test(r.textContent) && /🦸/.test(r.textContent))), "Reiter „Kleider & Anzüge“ mit 🦸");
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
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Kleiderschrank-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
