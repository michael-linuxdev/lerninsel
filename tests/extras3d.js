// Playwright-Test (07.11.2026): Extras der 3D-Figur angeglichen – jedes Extra aus dem Kleiderschrank (Puppe.extras) hat ein 3D-Teil
// (EXTRAS_3D in quellen/welt3d/extras3d.js); auf der Insel bringt jedes Extra eigene Teile an die Figur, Dinge in der Hand hängen am Arm
// (bewegen sich beim Gehen mit), zwei Dinge = zwei Hände; ohne Seitenfehler, auch in Stufe „einfach“. 3D, allein laufen lassen.
// Aufruf: sh tests/laufen.sh extras3d   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo|GPU stall|WebGL/;
process.on("unhandledRejection", (e) => { console.log("❌ Abbruch: " + e.message + "\n  " + (global.__fehler || []).join("\n  ")); process.exit(1); });

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const fehler = global.__fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, serviceWorkers: "block" });
  await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`Seitenfehler: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`Konsole: ${m.text()}`); });
  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
  await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(300);
  await p.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.lektionen = { bedienung: 3 }; Spielwelt.speichere("medien", m); });
  // Liste der 2D-Extras aus dem Kleiderschrank
  await p.goto(BASIS + "spiele/anziehen/"); await p.waitForLoadState("load"); await p.waitForTimeout(500);
  const extras2d = await p.evaluate(() => Puppe.extras.map(e => ({ id: e.id, farbe: e.farbe })));
  const look = await p.evaluate(() => JSON.parse(JSON.stringify(Figur.STANDARD("w"))));
  const insel = async (extras, grafik = "") => {
    await p.evaluate(([l, ex, g]) => { l.extras = ex; Spielwelt.speichere("anziehen", { aktuell: l }); if (g) localStorage.setItem("lerninsel.grafik", g); else localStorage.removeItem("lerninsel.grafik"); }, [look, extras, grafik]);
    await p.goto(BASIS + "spiele/welt3d/heimat.html?stunde=14", { waitUntil: "domcontentloaded", timeout: 60000 }); await p.waitForFunction(() => window.__heimat && __heimat.ich, null, { timeout: 60000 }); await p.waitForTimeout(800);
  };
  await insel({});
  const liste3d = await p.evaluate(() => __heimat.extras3d), ohne = await p.evaluate(() => __heimat.ecken()), armeOhne = await p.evaluate(() => __heimat.armEcken());
  const fehlt = extras2d.filter(e => !liste3d.includes(e.id)).map(e => e.id);
  erwarte(!fehlt.length && extras2d.length >= 30, `alle ${extras2d.length} Extras aus dem Kleiderschrank haben ein 3D-Teil ${fehlt.join(", ")}`);
  // jedes Extra einzeln: mehr Teile an der Figur
  const ohneTeil = [];
  for (const e of extras2d) {
    await insel({ [e.id]: { farbe: e.farbe } });
    const n = await p.evaluate(() => __heimat.ecken());
    if (n <= ohne) ohneTeil.push(e.id);
  }
  erwarte(!ohneTeil.length, `jedes Extra bringt eigene Teile an die Figur (${extras2d.length} einzeln geladen) ${ohneTeil.join(", ")}`);
  // zwei Dinge in der Hand: an beiden Armen, bewegen sich mit dem Arm
  await insel({ ballon: { farbe: "#FF6F61" }, teddy: { farbe: "#B8804A" }, muetze: { farbe: "#3AA0E0" }, kette: { farbe: "#FFC83D" } });
  const arme = await p.evaluate(() => __heimat.armEcken());
  erwarte(arme[0] > armeOhne[0] && arme[1] > armeOhne[1], `Ballon und Teddy hängen an den Armen (Eckpunkte links ${armeOhne[0]} → ${arme[0]}, rechts ${armeOhne[1]} → ${arme[1]})`);
  await p.evaluate(() => { if (window.__szene && __szene.aktuell()) __szene.abbrechen(); }); await p.waitForTimeout(300);
  await p.evaluate(() => { __heimat.ich.rotation.y = 0; __heimat.blick(0.15, 0.12, 4.6); }); await p.waitForTimeout(900);
  if (BILDER) await p.screenshot({ path: `${BILDER}/extras3d-hand.png` });
  await insel({ einhorn: { farbe: "#FF9BC8" }, kopfhoerer: { farbe: "#C2337A" }, fliege: { farbe: "#D7263D" }, schwert: { farbe: "#8A5A34" } });
  await p.evaluate(() => { if (window.__szene && __szene.aktuell()) __szene.abbrechen(); }); await p.waitForTimeout(300);
  await p.evaluate(() => { __heimat.ich.rotation.y = 0; __heimat.blick(-0.3, 0.12, 4.6); }); await p.waitForTimeout(900);
  if (BILDER) await p.screenshot({ path: `${BILDER}/extras3d-kopf.png` });
  // UX-Paket 2 (07.11.2026): Schultern, abgespreizte Arme (Hände außen, nicht vor der Brust), Daumen, Pony bei „lang“; nachts Laternen, Türlicht, kein leuchtendes Augenweiß
  await insel({});
  await p.evaluate(() => { if (window.__szene && __szene.aktuell()) __szene.abbrechen(); }); await p.waitForTimeout(400);
  { const f = await p.evaluate(() => __heimat.figurInfo());
    erwarte(f.schulter === 2 && f.daumen === 2 && f.pony === 1, `Figur: 2 Schultern, 2 Daumen, Pony bei „Lange Haare“ (${JSON.stringify(f)})`);
    erwarte(f.haende[0] < -0.1 && f.haende[1] > 0.1, `Arme abgespreizt: linke Hand ${f.haende[0]} nach außen, rechte ${f.haende[1]} (vorher trafen sich die Hände vor der Brust)`);
    const l = await p.evaluate(() => __heimat.lampen());
    erwarte(l.n === 3 && !l.an && l.licht === 0 && l.augenweiss === "MeshToonMaterial", `tags: 3 Laternen aus, kein Türlicht, Augenweiß mit Licht (${JSON.stringify(l)})`); }
  await p.evaluate(() => { __heimat.ich.rotation.y = 0; __heimat.blick(0.15, 0.12, 4.6); }); await p.waitForTimeout(900);
  if (BILDER) await p.screenshot({ path: `${BILDER}/extras3d-figur-neu.png` });
  await p.goto(BASIS + "spiele/welt3d/heimat.html?stunde=21", { waitUntil: "domcontentloaded", timeout: 60000 }); await p.waitForFunction(() => window.__heimat && __heimat.ich, null, { timeout: 60000 }); await p.waitForTimeout(800);
  await p.evaluate(() => { if (window.__szene && __szene.aktuell()) __szene.abbrechen(); }); await p.waitForTimeout(400);
  { const l = await p.evaluate(() => __heimat.lampen());
    erwarte(l.an && l.licht > 0 && l.n === 3, `nachts: Laternen an, warmes Licht vor der Haustür (${l.licht})`); }
  if (BILDER) await p.screenshot({ path: `${BILDER}/extras3d-nacht.png` });
  // Stufe „einfach“
  await insel({ haarreif: { farbe: "#C2337A" }, tasche: { farbe: "#C2337A" }, fussball: { farbe: "#fff" } }, "einfach");
  erwarte(await p.evaluate(() => __heimat.info().einfach && __heimat.ecken() > 0), "Stufe „einfach“: Figur mit Haarreif, Tasche und Ball ohne Fehler");
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Extras-3D-Test bestanden.");
})();
