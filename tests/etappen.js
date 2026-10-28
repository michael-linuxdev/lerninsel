// Playwright-Test (NA-14): Tutorial-Etappen E4–E8 über drei Tage – Sterne fürs Zimmer, Nest und Ei, Spielorte, Merkkiste, Gefühle.
// Höchstens zwei neue Etappen am Tag; wer eine Funktion schon kennt, bekommt die Etappe still; Eltern können die Einführung überspringen.
// Läuft auf der runden Insel (Tage 1–3; bis 30.10.2026 auf der inzwischen entfernten Pixel-Insel) und prüft „schon genutzt“ zusätzlich.
// Aufruf: sh tests/laufen.sh etappen   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const TAG = (d) => new Date(2026, 9, d, 15, 0).getTime();

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };

  async function neuesKind() {
    const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true });
    await ctx.addInitScript((t) => { let x = null; try { x = localStorage.getItem("__testJetzt"); } catch (e) { /* egal */ } window.__jetzt = x ? +x : t; }, TAG(20));
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    // Ankunft, Erst lernen, Sonne und erste Frucht liegen schon zurück (am 20.10.)
    await p.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.lektionen = { bedienung: 3 }; Spielwelt.speichere("medien", m);
      ["E1", "E2", "E3"].forEach(e => Story.etappeFertig(e)); Story.merkeSzene("sonne"); Story.setzeKapitel(1);
      Lernfunde.merke({ fach: "mathe", art: "gemeistert", text: "7 + 8 = 15", schluessel: "t:7+8" }); });
    return { ctx, p };
  }
  const szene = (p) => p.evaluate(() => window.__szene && __szene.aktuell());
  const warteSzene = (p, id) => p.waitForFunction((id) => window.__szene && __szene.aktuell() && __szene.aktuell().id === id, id, { timeout: 20000 });
  const weiter = async (p) => { await p.click("#szene-weiter", { force: true }); await p.waitForTimeout(350); };
  const tag = async (p, d) => { await p.evaluate((t) => localStorage.setItem("__testJetzt", String(t)), TAG(d)); };
  const spielzeit = (p) => p.evaluate(() => { for (let i = 0; i < 12; i++) Zeit.aufgabe(); });

  // ---------- Drei Tage auf der Insel ----------
  {
    const { ctx, p } = await neuesKind();
    const INSEL = BASIS + "spiele/welt3d/heimat.html?stunde=14";
    // Tag 2 (21.10.): Sterne und Spielzeit → E4 Sterne; danach E5 Ei; dann ist für heute Schluss
    await tag(p, 21);
    await p.goto(BASIS); await spielzeit(p); await p.evaluate(() => Spielwelt.gibSterne(6));
    await p.goto(INSEL); await warteSzene(p, "sterne");
    let a = await szene(p);
    erwarte(a.wer === "biber" && a.zeigt, "E4: Benno zeigt auf die Sterne");
    await bild(p, "etappen-sterne");
    await weiter(p);
    a = await szene(p);
    erwarte(a.nr === 1 && a.wartet && a.zeigt, "E4: Benno zeigt aufs Haus und wartet");
    await p.evaluate(() => __heimat.reingehen());
    // die Szene prüft alle 200 ms, ob das Kind drinnen ist – unter der langsamen Software-Grafik auf den Zustand warten statt fester Zeit
    await p.waitForFunction(() => { const s = window.__szene && __szene.aktuell(); return s && s.nr === 2; }, null, { timeout: 8000 }).catch(() => {});
    a = await szene(p);
    erwarte(a && a.nr === 2 && a.wartet, "E4: im Zimmer wartet Benno auf „Einrichten“");
    await p.click("#einrichten", { force: true }); await p.waitForTimeout(600);
    erwarte(await p.evaluate(() => !__szene.aktuell() && Story.etappe("E4")), "E4 erledigt, sobald der Laden offen ist");
    await p.click('[data-moebel="lampe"]'); await p.click('[data-platz="links"]'); await p.click("#laden-zu");
    erwarte(await p.evaluate(() => JSON.stringify(__heimat.zimmerDaten().plaetze).includes("lampe")), "erstes Möbel gekauft und aufgestellt");
    await p.evaluate(() => __heimat.rausgehen());
    await warteSzene(p, "ei");
    a = await szene(p);
    erwarte(a.wer === "robo" && a.zeigt, "E5: Robo Pixel zeigt auf das Nest");
    for (let i = 0; i < 3; i++) await weiter(p);
    await p.waitForTimeout(300);
    const nest = await p.evaluate(() => ({ e5: Story.etappe("E5"), titel: document.getElementById("blase-titel").textContent, los: !document.getElementById("blase-los").hidden }));
    erwarte(nest.e5 && /Nest/.test(nest.titel) && nest.los, "nach der Ei-Szene: Nest-Blase mit „Los geht's“ zur Tier-Seite");
    await p.evaluate(() => { document.getElementById("blase").hidden = true; });
    await p.goto(INSEL); await p.waitForTimeout(3000);
    erwarte(!(await szene(p)) && await p.evaluate(() => Story.neuHeute() === 2), "Tag 2: nach zwei neuen Etappen ist Schluss");

    // Tag 3 (22.10.): Führerschein, Spielzeit, fällige Karte → E6 Spielorte, dann E7 Merkkiste
    await tag(p, 22);
    await p.goto(BASIS); await spielzeit(p);
    await p.evaluate(() => { const m = Spielwelt.lade("medien"); m.fuehrerschein = "2026-10-01"; Spielwelt.speichere("medien", m);
      Spielwelt.speichere("lernkartei", { deutsch: [{ k: "wort|Apfel", s: { typ: "wort", wort: "Apfel" }, stufe: 1, faellig: "2000-01-01" }], sachkunde: [] }); });
    // E6 „Spielorte“ wartet, solange die Minispiele ausgeblendet sind (seit 30.10.2026) – direkt E7
    await p.goto(INSEL); await warteSzene(p, "merkkiste");
    a = await szene(p);
    erwarte(a.wer === "fipsi" && a.zeigt, "E7: Fipsi zeigt auf sich – die Merkkiste wartet");
    await weiter(p); await weiter(p);
    erwarte(await p.evaluate(() => !Story.etappe("E6") && Story.etappe("E7")), "E7 erledigt, E6 wartet auf die Minispiele");

    // Tag 4 (23.10.): Bruni fragt, wie es geht (E8)
    await tag(p, 23);
    await p.goto(INSEL); await warteSzene(p, "gefuehle");
    a = await szene(p);
    erwarte(a.wer === "baer" && a.zeigt, "E8: Bruni fragt, wie es dir geht");
    await weiter(p); await weiter(p);
    const ende = await p.evaluate(() => ({ e: ["E4", "E5", "E7", "E8"].every(e => Story.etappe(e)), chronik: Story.chronik().map(x => x.s) }));
    erwarte(ende.e && ["sterne", "ei", "merkkiste", "gefuehle"].every(x => ende.chronik.includes(x)) && !ende.chronik.includes("spielorte"), `Etappen ohne Minispiele erledigt, Chronik: ${ende.chronik.join(", ")}`);
    await ctx.close();
  }

  // ---------- Rund: Sterne-Szene, „schon genutzt“ und Elternbereich ----------
  {
    const { ctx, p } = await neuesKind();
    await tag(p, 21);
    await p.goto(BASIS); await spielzeit(p); await p.evaluate(() => { Spielwelt.gibSterne(6); Spielwelt.speichere("tier", { phase: "tier", art: "katze", farbe: 0, name: "Mimi" }); });
    const INSEL = BASIS + "spiele/welt3d/heimat.html?stunde=14";
    await p.goto(INSEL); await warteSzene(p, "sterne");
    await weiter(p);
    await p.evaluate(() => __heimat.reingehen()); await p.waitForTimeout(600);
    await p.click("#einrichten", { force: true }); await p.waitForTimeout(600);
    erwarte(await p.evaluate(() => Story.etappe("E4") && !__szene.aktuell()), "Rund: E4 mit Haus und „Einrichten“");
    await p.click("#laden-zu"); await p.evaluate(() => __heimat.rausgehen());
    await p.waitForFunction(() => Story.etappe("E5"), null, { timeout: 8000 }).catch(() => {});
    erwarte(await p.evaluate(() => Story.zustand().etappen.E5 === 1), "Rund: Kind mit Tier bekommt E5 still (zählt nicht zum Tageslimit)");
    // Elternbereich: Einführung überspringen
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(400);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(300); }
    await p.click('.eltern-reiter [data-teil="zeit"]');   // Reiter „Zeit & Regeln“ (30.10.2026)
    erwarte(!!(await p.$("#tutorial-weg")), "Elternbereich: Knopf „Einführung überspringen“");
    await p.click("#tutorial-weg"); await p.waitForTimeout(300);
    erwarte(await p.evaluate(() => ["E2", "E3", "E4", "E5", "E6", "E7", "E8"].every(e => Story.etappe(e)) && !document.getElementById("tutorial-weg")), "Einführung übersprungen: alle Etappen erledigt");
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Etappen-Test (E4–E8) bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
