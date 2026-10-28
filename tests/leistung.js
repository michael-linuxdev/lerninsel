// Leistungs-Test (NA-21): Zählwerte je Szene und Landschaft – Zeichenaufrufe, Dreiecke, Texturspeicher, Schatten, Pixeldichte.
// Bilder pro Sekunde sind unter Swiftshader nicht aussagekräftig; gezählt wird, was die Grafikkarte pro Bild bekommt.
// Vergleicht mit dem Budget aus docs/GRAFIK.md Abschnitt 6 und warnt bei Überschreitung (der Test scheitert nur mit STRENG=1).
// Aufruf: sh tests/laufen.sh leistung   (Tabelle als Markdown zusätzlich in eine Datei: AUSGABE=<datei>)
const fs = require("fs");
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
// Budget iPad 10 (GRAFIK.md Abschnitt 6)
const BUDGET = { schoen: { zeichnungen: 150, dreiecke: 150000, texturMB: 24 }, einfach: { zeichnungen: 80, dreiecke: 60000, texturMB: 12 } };

// Szenen: [Name, Adresse, Grafik, Vorbereitung im Browser (optional), Messhaken]
const INSEL = "spiele/welt3d/heimat.html?stunde=14";
const SZENEN = [
  ["Insel (erste Insel)", INSEL, "schoen"],
  ["Insel (erste Insel)", INSEL, "einfach"],
  ["Insel Nacht, Winter", "spiele/welt3d/heimat.html?stunde=21&monat=12", "schoen"],
  ["Insel Regen", INSEL + "&wetter=regen", "schoen"],
  ["Welt Wald, groß, Hügel", INSEL + "&biom=wald&groesse=gross&huegel=viel&seed=5", "schoen"],
  ["Welt Wald, groß, Hügel", INSEL + "&biom=wald&groesse=gross&huegel=viel&seed=5", "einfach"],
  ["Welt Berge mit Teich", INSEL + "&biom=berge&groesse=mittel&huegel=viel&see=1&seed=3", "schoen"],
  ["Welt Strand", INSEL + "&biom=strand&groesse=klein&seed=2", "schoen"],
  ["Zimmer", INSEL + "&drinnen=1", "schoen"],
  ["Zimmer", INSEL + "&drinnen=1", "einfach"],
  ["Ballon-Party", "spiele/welt3d/ballons.html", "schoen"],
  ["Schatz-Strand", "spiele/welt3d/insel.html", "schoen"],
  ["Sternenlauf", "spiele/welt3d/lauf.html", "schoen"],
  ["Kart-Rennen", "spiele/welt3d/kart.html", "schoen"],
  ["Bauplatz", "spiele/welt3d/bau.html", "schoen"]
];

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const fehler = [], zeilen = [], warnungen = [];
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, deviceScaleFactor: 2, hasTouch: true });
  await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__keinSparen = true; });
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
  // Kind mit Ankunft, Spielzeit und Führerschein, damit Insel, Zimmer und Minispiele offen sind
  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
  await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
  await p.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.lektionen = { bedienung: 3 }; m.fuehrerschein = "2026-10-01"; Spielwelt.speichere("medien", m);
    ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8"].forEach(e => Story.etappeFertig(e, true)); Story.merkeSzene("sonne"); for (let i = 0; i < 12; i++) Zeit.aufgabe();
    // Wissensbaum Stufe 3 (15 Funde, höchstens 5 am Tag): an vier Tagen je 5 Funde – dann sind alle Spielorte offen
    for (let t = 0; t < 4; t++) { window.__heute = `2026-10-${21 + t}`; for (let i = 0; i < 5; i++) Lernfunde.merke({ fach: "mathe", art: "gemeistert", text: `${t}${i} + 1`, schluessel: "t:" + t + i }); }
    delete window.__heute; });

  for (const [name, adresse, grafik] of SZENEN) {
    if (grafik !== "-") await p.evaluate((g) => { const e = Spielwelt.lade("eltern") || {}; e.insel = Object.assign({}, e.insel || {}, { grafik: g }); Spielwelt.speichere("eltern", e); try { localStorage.removeItem("lerninsel.sparen"); } catch (x) { /* egal */ } }, grafik);
    await p.goto(BASIS + adresse); await p.waitForTimeout(3500);
    if (!p.url().includes(adresse.split("?")[0])) { fehler.push(`${name}: umgeleitet nach ${p.url()} (gesperrt?)`); continue; }
    const w = await p.evaluate(() => {
      if (window.__szene && __szene.aktuell()) Szene.abbrechen();
      if (window.__pixel) return { zeichnungen: __pixel.zeichnungen(), dreiecke: null, texturMB: null, schatten: false, pixel: window.devicePixelRatio, pixelLook: true };
      const i = window.__heimat ? __heimat.info() : window.__welt3d ? __welt3d.info() : null;
      return i;
    });
    if (!w) { fehler.push(`${name}: keine Messwerte (${adresse})`); continue; }
    zeilen.push({ name, grafik, ...w });
    const b = BUDGET[grafik];
    if (b) for (const k of ["zeichnungen", "dreiecke", "texturMB"]) if (w[k] != null && w[k] > b[k]) warnungen.push(`${name} („${grafik}“): ${k} ${w[k]} > Budget ${b[k]}`);
  }
  await browser.close();

  const zahl = (v) => (v == null ? "–" : typeof v === "number" ? v.toLocaleString("de-DE") : String(v));
  const kopf = "| Szene | Grafik | Zeichenaufrufe | Dreiecke | Texturen MB | Schatten | Pixeldichte |\n|---|---|---|---|---|---|---|";
  const tabelle = kopf + "\n" + zeilen.map(z => `| ${z.name} | ${z.grafik === "-" ? "Pixel" : z.grafik} | ${zahl(z.zeichnungen)} | ${zahl(z.dreiecke)} | ${zahl(z.texturMB)} | ${z.schatten ? "an" : "aus"} | ${zahl(z.pixel)} |`).join("\n");
  console.log(tabelle);
  if (process.env.AUSGABE) fs.writeFileSync(process.env.AUSGABE, `Messung ${new Date().toISOString().slice(0, 10)} (Swiftshader, 1180×820, Pixeldichte 2)\n\n${tabelle}\n`);
  if (warnungen.length) console.log("⚠️ Über dem Budget (GRAFIK.md Abschnitt 6):\n" + warnungen.map(w => "  - " + w).join("\n"));
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  if (warnungen.length && process.env.STRENG) { console.log("❌ Budget überschritten (STRENG)."); process.exit(1); }
  console.log(`✅ Leistungs-Test: ${zeilen.length} Messungen${warnungen.length ? `, ${warnungen.length} Warnungen` : ", alles im Budget"}.`);
})().catch(err => { console.error(err); process.exit(1); });
