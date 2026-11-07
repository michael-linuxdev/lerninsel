// Test NA-53 Interessen-Kulissen (10.11.2026): In Meine Ecke → „Meine Sachen“ wählt das Kind echt „Weltraum“; danach zeigt der Matheweg (Kl. 1) bei
// „Zählen“ nur Weltraum-Bilder – eine Runde echt über die Tasten gelöst; „Tiere“ → nur Tiere; „Bunt gemischt“ → wieder der Standard; Russisch-Zeile mit
// Hilfesprache; Handy ohne Scrollleiste. Aufruf: sh tests/laufen.sh kulissen
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  async function kind({ breite = 1180, hoehe = 820, sprache = "" } = {}) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "1");
    if (sprache) { await p.selectOption("#e-sprache", sprache); await p.selectOption("#e-dosis", "immer"); }
    await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  const waehle = async (p, id) => { await p.goto(BASIS + "spiele/ich/#sachen"); await p.waitForSelector("#kulissen button"); await p.click(`[data-kulisse="${id}"]`); await p.waitForTimeout(200); };
  // eine Runde „Zählen“ echt lösen und die Bilder einsammeln
  async function zaehlRunde(p) {
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForSelector("#karte .station");
    const nr = await p.evaluate(() => Mathe.STATIONEN_K1.findIndex(s => /Zählen|zaehlen/i.test(s.name + s.id)));
    await p.evaluate((n) => __mathe.starte(n), nr); await p.waitForTimeout(300);
    const bilder = new Set();
    for (let i = 0; i < 10; i++) {
      const a = await p.evaluate(() => { const x = __mathe.lauf.liste[__mathe.lauf.pos]; return { art: x.art, antwort: x.antwort, bild: x.bild || "" }; });
      [...a.bild.matchAll(/>([^<>\s]+)<\/text>/g)].forEach(m => bilder.add(m[1]));
      if (a.art === "wahl") await p.evaluate((w) => [...document.querySelectorAll(".wahl-tasten .taste")].find(b => b.dataset.wert === w).click(), a.antwort);
      else { for (const z of a.antwort) await p.click(`.taste[data-ziffer="${z}"]`); await p.click(".taste.ok"); }
      await p.waitForTimeout(1050);
    }
    await p.waitForSelector("#ende-ansicht:not([hidden])", { timeout: 5000 });
    return [...bilder];
  }
  {
    const { ctx, p } = await kind();
    await p.goto(BASIS + "spiele/ich/#sachen"); await p.waitForSelector("#kulissen button");
    erwarte(await p.evaluate(() => document.querySelectorAll("#kulissen button").length === 5 && document.querySelector('[data-kulisse=""]').classList.contains("an")), "Meine Sachen: 5 Lieblingsbilder zur Wahl, „Bunt gemischt“ ist gewählt");
    if (BILDER) await p.screenshot({ path: `${BILDER}/kulissen-wahl.png` });
    await waehle(p, "weltraum");
    erwarte(await p.evaluate(() => Spielwelt.lade("interessen").thema === "weltraum" && document.querySelector('[data-kulisse="weltraum"]').classList.contains("an")), "„Weltraum“ angetippt und gespeichert");
    const w = await zaehlRunde(p), welt = await p.evaluate(() => Mathe.KULISSEN.weltraum);
    erwarte(w.length > 0 && w.every(e => welt.includes(e)), `Matheweg „Zählen“: nur Weltraum-Bilder (${w.join(" ")}), Runde gelöst`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/kulissen-mathe.png` });
    await waehle(p, "tiere");
    const t = await zaehlRunde(p), tiere = await p.evaluate(() => Mathe.KULISSEN.tiere);
    erwarte(t.length > 0 && t.every(e => tiere.includes(e)), `„Tiere“: nur Tier-Bilder (${t.join(" ")})`);
    await waehle(p, "");
    const s = await zaehlRunde(p), std = await p.evaluate(() => Mathe.DINGE);
    erwarte(s.every(e => std.includes(e)) && std.includes("🍎"), "„Bunt gemischt“: wieder die Standard-Bilder");
    await ctx.close();
  }
  {
    const { ctx, p } = await kind({ breite: 390, hoehe: 760, sprache: "ru" });
    await p.goto(BASIS + "spiele/ich/#sachen"); await p.waitForSelector("#kulissen button");
    erwarte(await p.evaluate(() => /картинки/.test((document.getElementById("kulisse-ru") || {}).textContent || "") && document.documentElement.scrollWidth <= innerWidth + 1), "Handy mit Russisch: russische Frage, keine Scrollleiste");
    if (BILDER) await p.screenshot({ path: `${BILDER}/kulissen-handy.png` });
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Kulissen-Test (NA-53) bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
