// Playwright-Test (UX-Paket 4, 07.11.2026): Insel-HUD – oben nur ⬅️, ⭐ und ⚙️; die Einstellungen (Welt, Grafik, Laufen, Kamera) liegen auf einem
// Blatt hinter dem Zahnrad (gleiche ids wie vorher), das mit Escape oder beim Antippen der Insel zugeht; der Steuerungs-Hinweis zeigt ein bewegtes
// Zeichen und verschwindet nach dem ersten Laufen dauerhaft; auf dem Handy passt alles in eine Zeile und das Blatt bleibt im Bild.
// Aufruf: sh tests/laufen.sh hud   (3D, allein laufen lassen; Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo/;
process.on("unhandledRejection", (e) => { console.log("❌ Abbruch: " + e.message + "\n  " + (global.__fehler || []).join("\n  ")); process.exit(1); });

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const fehler = global.__fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  const INSEL = BASIS + "spiele/welt3d/heimat.html?stunde=14";
  async function kind(breite, hoehe) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__keinSparen = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`Seitenfehler: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`Konsole: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
    await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(300);
    await p.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.lektionen = { bedienung: 3 }; Spielwelt.speichere("medien", m); Story.etappeFertig("E1");
      ["E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9"].forEach(e => Story.etappeFertig(e, true)); Story.merkeSzene("sonne"); Story.setzeKapitel(1); for (let i = 0; i < 12; i++) Zeit.aufgabe(); });
    return { ctx, p };
  }
  const insel = async (p) => { await p.goto(INSEL, { waitUntil: "domcontentloaded", timeout: 60000 }); await p.waitForFunction(() => window.__heimat && __heimat.ich, null, { timeout: 60000 }); await p.waitForTimeout(1200);
    await p.evaluate(() => { if (window.__szene && __szene.aktuell()) __szene.abbrechen(); }); await p.waitForTimeout(300); };

  for (const [breite, hoehe, art] of [[1180, 820, "iPad quer"], [390, 760, "Handy"]]) {
    const { ctx, p } = await kind(breite, hoehe);
    await insel(p);
    let h = await p.evaluate(() => __heimat.hud());
    erwarte(h.leiste.length === 3 && h.leiste[2] === "einstellungen" && !h.blatt, `${art}: oben nur Zurück, Sterne und ⚙️ (${h.leiste.join(", ")}), Blatt zu`);
    erwarte(h.hinweis && await p.evaluate(() => !!document.querySelector("#joy-hinweis .hand") && getComputedStyle(document.querySelector("#joy-hinweis .hand")).animationName === "schieben"), `${art}: Steuerungs-Hinweis mit bewegtem Zeichen`);
    const zeile = await p.evaluate(() => { const k = [...document.querySelectorAll(".leiste > *:not(.platz)")].map(e => e.getBoundingClientRect()); return { eine: new Set(k.map(r => Math.round(r.top))).size === 1, imBild: k.every(r => r.right <= innerWidth && r.left >= 0) }; });
    erwarte(zeile.eine && zeile.imBild, `${art}: Leiste in einer Zeile im Bild`);
    await bild(p, `hud-${art.replace(" ", "-")}-zu`);
    // Blatt öffnen
    await p.click("#einstellungen"); await p.waitForTimeout(200);
    h = await p.evaluate(() => __heimat.hud());
    const lage = await p.evaluate(() => { const r = document.getElementById("einstellungen-blatt").getBoundingClientRect(); return r.right <= innerWidth && r.bottom <= innerHeight && r.left >= 0; });
    erwarte(h.blatt && h.wahlen.includes("welt-knopf") && h.wahlen.includes("kamera") && lage && (await p.getAttribute("#einstellungen", "aria-expanded")) === "true", `${art}: ⚙️ öffnet das Blatt mit ${h.wahlen.length} Wahlen (${h.wahlen.join(", ")}), im Bild`);
    await bild(p, `hud-${art.replace(" ", "-")}-auf`);
    await p.click("#kamera"); await p.waitForTimeout(150);
    erwarte(/frei/.test(await p.textContent("#kamera")), `${art}: Kamera auf „frei“ umgeschaltet`);
    await p.click("#kamera"); await p.waitForTimeout(150);
    await p.keyboard.press("Escape"); await p.waitForTimeout(150);
    erwarte(!(await p.evaluate(() => __heimat.hud().blatt)), `${art}: Escape schließt das Blatt`);
    await p.click("#einstellungen"); await p.waitForTimeout(150);
    await p.mouse.click(breite * 0.5, hoehe * 0.5); await p.waitForTimeout(200);
    erwarte(!(await p.evaluate(() => __heimat.hud().blatt)), `${art}: Antippen der Insel schließt das Blatt`);
    // Joystick: nach dem ersten Schieben ist der Hinweis weg – und bleibt es nach dem Neuladen
    await p.mouse.move(breite * 0.25, hoehe * 0.55); await p.mouse.down(); for (let i = 1; i <= 8; i++) { await p.mouse.move(breite * 0.25 + i * 8, hoehe * 0.55); await p.waitForTimeout(30); } await p.mouse.up(); await p.waitForTimeout(200);
    erwarte(!(await p.evaluate(() => __heimat.hud().hinweis)), `${art}: nach dem ersten Schieben ist der Steuerungs-Hinweis weg`);
    await insel(p);
    erwarte(!(await p.evaluate(() => __heimat.hud().hinweis)), `${art}: nach dem Neuladen bleibt er weg`);
    // Zimmer (UX-Paket 5): sichtbare Tür nach draußen, antippbar
    await p.evaluate(() => __heimat.reingehen()); await p.waitForTimeout(600);
    const t = await p.evaluate(() => Object.assign({ drinnen: __heimat.drinnen }, __heimat.zimmerTuer()));
    erwarte(t.drinnen && t.tipp && t.x > 3.5, `${art}: im Zimmer gibt es eine antippbare Tür an der rechten Wand`);
    await bild(p, `hud-${art.replace(" ", "-")}-zimmer`);
    await p.evaluate(() => __heimat.tuerTippen()); await p.waitForTimeout(600);
    erwarte(!(await p.evaluate(() => __heimat.drinnen)), `${art}: Tür antippen führt nach draußen`);
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ HUD-Test bestanden.");
})();
