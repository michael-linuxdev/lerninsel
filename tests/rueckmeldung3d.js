// Playwright-Test (Erprobung 10.11.2026, Rückmeldung des Testers, 3D-Teil): Szene „Die Sonne geht auf“ kommt nur einmal (E2 wird erledigt),
// während einer Szene bleibt die Haustür zu und keine zweite Figur spricht, Kamera-Standard „frei“ (im Zimmer wie „fest“, draußen wie vorher),
// Wissensbaum und Pinnwand öffnen nach kurzer Kamerafahrt ein eigenes Fenster mit antippbaren Lernfunden, keine Tür vor der Pinnwand,
// Afro verdeckt das Gesicht nicht.
// Aufruf: sh tests/laufen.sh rueckmeldung3d   (3D, allein laufen lassen; Screenshots mit BILDER=<ordner>)
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
  async function kind(breite, hoehe, vorher) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__keinSparen = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`Seitenfehler: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`Konsole: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
    await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(300);
    await p.evaluate(vorher);
    return { ctx, p };
  }
  const offen = async (p) => { await p.goto(INSEL, { waitUntil: "domcontentloaded", timeout: 60000 }); await p.waitForFunction(() => window.__heimat && __heimat.ich, null, { timeout: 60000 }); };

  // ---------- 1. „Die Sonne geht auf“ nur einmal; Tür zu und nur eine Stimme, solange die Szene läuft ----------
  {
    // Kind hat die Ankunft hinter sich und schon gelernt, E2 („Erst lernen“) aber noch nicht gesehen – genau die Lage des Testers
    const { ctx, p } = await kind(1180, 820, () => { const m = Spielwelt.lade("medien") || {}; m.lektionen = { bedienung: 3 }; Spielwelt.speichere("medien", m); Story.etappeFertig("E1");
      ["E3", "E4", "E5", "E6", "E7", "E8", "E9"].forEach(e => Story.etappeFertig(e, true)); Story.setzeKapitel(1); for (let i = 0; i < 12; i++) Zeit.aufgabe(); });
    await offen(p);
    await p.waitForFunction(() => { const a = __szene.aktuell(); return a && a.id === "sonne"; }, null, { timeout: 30000 });
    erwarte(true, "Szene „Die Sonne geht auf“ startet");
    // Während Robo spricht: Haus bleibt zu, eine Station antwortet nicht
    const waehrend = await p.evaluate(() => { __heimat.reingehen(); __heimat.station(); return { drinnen: __heimat.drinnen, blase: !document.getElementById("blase").hidden, spricht: __heimat.szeneSpricht() }; });
    erwarte(waehrend.spricht && !waehrend.drinnen && !waehrend.blase, `solange die Szene läuft: Tür zu, keine zweite Sprechblase (${JSON.stringify(waehrend)})`);
    await bild(p, "rm3d-sonne");
    for (let i = 0; i < 4 && await p.evaluate(() => !!__szene.aktuell()); i++) { await p.click("#szene-weiter", { force: true }); await p.waitForTimeout(500); }
    const nach = await p.evaluate(() => ({ e2: !!Story.etappe("E2"), gesehen: Story.gesehen("sonne"), laeuft: !!__szene.aktuell() }));
    erwarte(nach.e2 && nach.gesehen && !nach.laeuft, `nach der Szene ist E2 erledigt (${JSON.stringify(nach)})`);
    await p.waitForTimeout(7500);   // die Insel fragt alle 5 s nach der nächsten Story
    const wieder = await p.evaluate(() => { const a = __szene.aktuell(); return a ? a.id : null; });
    erwarte(wieder !== "sonne", `Robo sagt es nicht noch einmal (danach: ${wieder || "keine Szene"})`);
    await p.evaluate(() => { if (__szene.aktuell()) __szene.abbrechen(); });
    await offen(p); await p.waitForTimeout(3000);
    const besuch2 = await p.evaluate(() => { const a = __szene.aktuell(); return a ? a.id : null; });
    erwarte(besuch2 !== "sonne", `auch beim nächsten Besuch nicht (${besuch2 || "keine Szene"})`);
    // alter Spielstand, bei dem es schon passiert ist: „sonne“ gesehen, E2 offen → heilt still
    await p.evaluate(() => { if (__szene.aktuell()) __szene.abbrechen(); Story.etappeZuruecksetzen("E2"); });
    await offen(p); await p.waitForFunction(() => !!Story.etappe("E2"), null, { timeout: 15000 }).catch(() => {}); await p.waitForTimeout(500);
    const heil = await p.evaluate(() => ({ e2: !!Story.etappe("E2"), id: (__szene.aktuell() || {}).id || null }));
    erwarte(heil.e2 && heil.id !== "sonne" && heil.id !== "erst-lernen", `alter Stand (Szene gesehen, E2 offen) wird still erledigt (${JSON.stringify(heil)})`);
    await ctx.close();
  }

  // ---------- 2. Kamera frei, Fenster für Wissensbaum und Pinnwand, Afro ----------
  const fertig = () => { const m = Spielwelt.lade("medien") || {}; m.lektionen = { bedienung: 3 }; Spielwelt.speichere("medien", m); Story.etappeFertig("E1");
    ["E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9"].forEach(e => Story.etappeFertig(e, true)); Story.merkeSzene("sonne"); Story.setzeKapitel(1); for (let i = 0; i < 12; i++) Zeit.aufgabe();
    Lernfunde.merke({ fach: "mathe", art: "gemeistert", e: "💪", text: "7 + 8 = 15", schluessel: "t:1" });
    Lernfunde.merke({ fach: "deutsch", art: "wort", e: "🍎", text: "Neues Wort: der Apfel", schluessel: "t:2" });
    Lernfunde.merke({ fach: "sachkunde", art: "wissen", e: "🦔", text: "Der Igel hält Winterschlaf", schluessel: "t:3" });
    const a = Spielwelt.lade("anziehen") || {}; a.aktuell = Object.assign(Figur.STANDARD(), a.aktuell || {}); a.aktuell.haare = { id: "afro", farbe: "#3B2A20" }; Spielwelt.speichere("anziehen", a); };
  for (const [breite, hoehe, art] of [[1180, 820, "iPad quer"], [820, 1148, "iPad hoch"], [390, 760, "Handy"]]) {
    const { ctx, p } = await kind(breite, hoehe, fertig);
    await offen(p); await p.waitForTimeout(1500);
    await p.evaluate(() => { if (__szene.aktuell()) __szene.abbrechen(); }); await p.waitForTimeout(300);
    // Kamera: ohne gespeicherte Wahl „frei“; draußen steht sie wie die feste Startkamera
    const k0 = await p.evaluate(() => __heimat.kamera());
    erwarte(k0.frei && Math.abs(k0.gieren) < 0.01, `${art}: Kamera ist ohne Wahl „frei“ und schaut wie die Startkamera (Abstand ${k0.abstand})`);
    await p.click("#einstellungen"); await p.waitForTimeout(200);
    erwarte(/frei/.test(await p.textContent("#kamera")), `${art}: Einstellungs-Blatt zeigt „frei“`);
    await p.keyboard.press("Escape"); await p.waitForTimeout(150);
    // Afro verdeckt das Gesicht nicht
    const f = await p.evaluate(() => __heimat.figurInfo());
    erwarte(f.afroVorn !== null && f.afroVorn < 0.48, `${art}: Afro endet vor dem Gesicht (reicht bis z ${f.afroVorn}, Augen bei 0,52)`);
    await p.evaluate(() => { const v = __heimat.steg; }); await bild(p, `rm3d-${art.replace(" ", "-")}-insel`);
    // Wissensbaum: Kamera fährt heran, dann das Fenster
    await p.evaluate(() => __heimat.fensterTippen("wissensbaum"));
    erwarte(!(await p.evaluate(() => __heimat.fenster().offen)), `${art}: Wissensbaum – erst die Kamerafahrt, das Fenster ist noch zu`);
    await p.waitForFunction(() => __heimat.fenster().offen, null, { timeout: 20000 });
    await p.waitForFunction(() => { const n = __heimat.fenster().nah; return n && n.anteil > 0.98; }, null, { timeout: 30000 });
    let fe = await p.evaluate(() => __heimat.fenster());
    const lage = await p.evaluate(() => { const r = document.querySelector(".fenster-karte").getBoundingClientRect(); return { imBild: r.left >= 0 && r.right <= innerWidth && r.bottom <= innerHeight && r.top >= 0, oben: Math.round(r.top / innerHeight * 100) }; });
    erwarte(fe.offen && fe.id === "wissensbaum" && fe.eintraege === 3 && lage.imBild, `${art}: Fenster „Dein Wissensbaum“ mit 3 Früchten im Bild (Oberkante bei ${lage.oben} %)`);
    erwarte(/3 Dinge gelernt/.test(await p.textContent("#fenster-text")) && !(await p.evaluate(() => document.getElementById("fenster-stand").hidden)), `${art}: Text und Balken bis zum nächsten Wachsen`);
    await p.click('.fenster-eintrag[data-i="1"]'); await p.waitForTimeout(150);
    fe = await p.evaluate(() => __heimat.fenster());
    erwarte(fe.wahl === 1 && /Apfel|Igel|15/.test(fe.detail || ""), `${art}: Frucht antippen zeigt den Lernfund groß („${fe.detail}“)`);
    await p.click("#fenster-hoeren"); await p.waitForTimeout(100);
    await bild(p, `rm3d-${art.replace(" ", "-")}-baum`);
    await p.click("#fenster-zu");
    await p.waitForFunction(() => !__heimat.fenster().nah, null, { timeout: 30000 });
    erwarte(!(await p.evaluate(() => __heimat.fenster().offen)), `${art}: ✖ schließt, die Kamera fährt zurück`);
    // Zimmer: freie Kamera beginnt wie „fest“, keine Tür vor der Pinnwand, Pinnwand-Fenster
    await p.evaluate(() => __heimat.reingehen()); await p.waitForTimeout(600);
    const drin = await p.evaluate(() => ({ drinnen: __heimat.drinnen, k: __heimat.kamera(), tuer: __heimat.zimmerTuer() }));
    erwarte(drin.drinnen && drin.k.abstand === 10 && drin.tuer === null, `${art}: im Zimmer Kamera-Abstand 10, keine Tür mehr vor der Pinnwand`);
    await bild(p, `rm3d-${art.replace(" ", "-")}-zimmer`);
    await p.evaluate(() => __heimat.fensterTippen("pinnwand"));
    await p.waitForFunction(() => __heimat.fenster().offen, null, { timeout: 20000 });
    await p.waitForFunction(() => { const n = __heimat.fenster().nah; return n && n.anteil > 0.98; }, null, { timeout: 30000 });
    fe = await p.evaluate(() => __heimat.fenster());
    erwarte(fe.id === "pinnwand" && fe.eintraege === 3 && /3 Zettel/.test(await p.textContent("#fenster-text")), `${art}: Fenster „Deine Pinnwand“ mit 3 Zetteln`);
    await p.click('.fenster-eintrag[data-i="0"]'); await p.waitForTimeout(150);
    erwarte(/von heute/.test((await p.evaluate(() => __heimat.fenster())).detail || ""), `${art}: Zettel antippen zeigt ihn groß („von heute“)`);
    await bild(p, `rm3d-${art.replace(" ", "-")}-pinnwand`);
    await p.keyboard.press("Escape"); await p.waitForTimeout(200);
    erwarte(!(await p.evaluate(() => __heimat.fenster().offen)), `${art}: Escape schließt das Fenster`);
    await p.click("#raus"); await p.waitForTimeout(500);
    const raus = await p.evaluate(() => ({ drinnen: __heimat.drinnen, k: __heimat.kamera() }));
    erwarte(!raus.drinnen && raus.k.abstand === k0.abstand, `${art}: „Nach draußen“ führt hinaus, Kamera wie vorher (Abstand ${raus.k.abstand})`);
    // Wahl „fest“ bleibt gemerkt
    await p.click("#einstellungen"); await p.waitForTimeout(200); await p.click("#kamera"); await p.waitForTimeout(150);
    await offen(p); await p.waitForTimeout(800);
    erwarte(!(await p.evaluate(() => __heimat.kamera().frei)), `${art}: wer „fest“ wählt, behält „fest“ nach dem Neuladen`);
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Rückmeldung-Test (3D) bestanden.");
})();
