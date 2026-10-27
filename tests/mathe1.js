// Playwright-Test (NA-32): Matheweg Klasse 1 und Vorschule (Mengen mit Würfelbildern, Zählen, Zwanzigerfeld …).
// Kind in Klasse 1 startet auf dem Klasse-1-Weg; Station spielen → Sterne in mathe.k1 (nicht k2); zweite Station wird frei;
// Umschalter auf Klasse 2 (mit Einstufungsangebot) und zurück; Kind in Klasse 2 startet auf Klasse 2; Elternbericht zeigt Kl.-1-Stationen.
// Aufruf: sh tests/laufen.sh mathe1   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  async function kind(stufe, breite = 1180, hoehe = 820) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  const wegInfo = (p) => p.evaluate(() => ({ an: (document.querySelector(".weg-wahl.an") || {}).dataset?.weg, stationen: document.querySelectorAll("#karte .station:not(.ziel)").length,
    erste: (document.querySelector("#karte .station .name") || {}).textContent, zweiteZu: document.querySelectorAll("#karte .station")[1].classList.contains("zu"),
    einstufung: !document.getElementById("einstufung").hidden }));

  {
    const { ctx, p } = await kind("1");
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForSelector("#karte .station");
    let w = await wegInfo(p);
    erwarte(w.an === "k1" && w.stationen === 10 && w.erste === "Würfelbilder", `Klasse 1: Weg „Klasse 1 und Vorschule“ mit 10 Stationen (${w.an}, ${w.stationen}, ${w.erste})`);
    erwarte(w.zweiteZu && !w.einstufung, "zweite Station noch zu, kein Einstufungstest auf dem Klasse-1-Weg");
    await bild(p, "mathe1-weg");

    // Station 1 fehlerfrei spielen; zwischendurch das Bild prüfen
    await p.evaluate(() => __mathe.starte(0)); await p.waitForTimeout(300);
    erwarte(await p.evaluate(() => !!document.querySelector("#rechnen-ansicht svg")), "Aufgabe zeigt ein Würfelbild");
    await bild(p, "mathe1-aufgabe");
    for (let i = 0; i < 10; i++) {
      await p.evaluate(() => __mathe.antworte(__mathe.lauf.liste[__mathe.lauf.pos].antwort));
      await p.waitForTimeout(1050);
    }
    await p.waitForSelector("#ende-ansicht:not([hidden])");
    const m = await p.evaluate(() => Spielwelt.lade("mathe"));
    erwarte(m.k1 && m.k1.k1wuerfel === 3 && !Object.keys(m.k2 || {}).length, `3 Sterne in mathe.k1, mathe.k2 bleibt leer (${JSON.stringify(m.k1)})`);
    await p.click("text=Zum Matheweg"); await p.waitForTimeout(300);
    w = await wegInfo(p);
    erwarte(!w.zweiteZu, "danach ist die zweite Station offen");

    // NA-50 Können: Treffer werden je Lernziel gezählt; zwei Fehler in Folge → leichtere Aufgabe von der Station davor
    const kn = await p.evaluate(() => Object.assign({ stand: Koennen.standVon("ma.zo.01") }, Spielwelt.lade("koennen") || {}));
    erwarte(kn["ma.zo.01"] && kn["ma.zo.01"][1] === 10 && kn.stand >= 3, `Können „ma.zo.01“ nach 10 Treffern: ${JSON.stringify(kn["ma.zo.01"])}`);
    await p.evaluate(() => __mathe.starte(1)); await p.waitForTimeout(200);
    const falsch = (a) => a.art === "wahl" ? a.optionen.find(o => o !== a.antwort) : String(Number(a.antwort) + 1);
    await p.evaluate((f) => { const a = __mathe.lauf.liste[0]; __mathe.antworte(eval(f)(a)); }, falsch.toString()); await p.waitForTimeout(850);
    await p.evaluate((f) => { const a = __mathe.lauf.liste[0]; __mathe.antworte(eval(f)(a)); }, falsch.toString()); await p.waitForTimeout(300);
    await p.click("#weiter"); await p.waitForTimeout(300);
    await p.evaluate((f) => { const a = __mathe.lauf.liste[1]; __mathe.antworte(eval(f)(a)); }, falsch.toString()); await p.waitForTimeout(300);
    const br = await p.evaluate(() => { const l = __mathe.lauf.liste; return { naechste: l[2] && l[2].bruecke, station: l[2] && l[2].station }; });
    erwarte(br.naechste && br.station === "k1wuerfel", `nach zwei Fehlern in Folge kommt eine leichtere Aufgabe (${JSON.stringify(br)})`);
    await p.waitForTimeout(900);
    await p.evaluate(() => { const a = __mathe.lauf.liste[__mathe.lauf.pos]; __mathe.antworte(a.antwort); }); await p.waitForTimeout(1100);
    erwarte(await p.evaluate(() => /leichtere Aufgabe/.test(document.getElementById("rueck").textContent) || __mathe.lauf.liste[__mathe.lauf.pos].bruecke), "Hinweis „Eine leichtere Aufgabe zwischendurch“");
    await p.evaluate(() => { document.getElementById("zum-weg").click(); }); await p.waitForTimeout(300);

    // Alle Stationen einmal anspielen (je eine richtige Aufgabe), damit jeder Generator im Browser läuft
    for (let s = 1; s < 10; s++) {
      await p.evaluate((n) => __mathe.starte(n), s); await p.waitForTimeout(150);
      const ok = await p.evaluate(() => { const a = __mathe.lauf.liste[0]; return !!a && a.antwort !== undefined && document.getElementById("rechnen-ansicht").hidden === false; });
      if (!ok) fehler.push("Station " + s + " startet nicht");
      if (s === 4) await bild(p, "mathe1-zwanzigerfeld");
      if (s === 2) await bild(p, "mathe1-mehr");
    }
    erwarte(true, "alle 10 Stationen starten mit Aufgaben");
    await p.evaluate(() => { document.getElementById("zum-weg").click(); });
    await p.waitForTimeout(300);

    // Umschalten auf Klasse 2 und zurück; Wahl bleibt gespeichert
    await p.click('.weg-wahl[data-weg="k2"]'); await p.waitForTimeout(300);
    w = await wegInfo(p);
    erwarte(w.an === "k2" && w.stationen === 23 && w.einstufung, `Umschalter: Klasse 2 mit 23 Stationen und Einstufungsangebot (${w.stationen})`);
    await p.reload(); await p.waitForSelector("#karte .station");
    erwarte((await wegInfo(p)).an === "k2", "gewählter Weg bleibt nach dem Neuladen");
    // NA-33: dritter Weg Klasse 3
    await p.click('.weg-wahl[data-weg="k3"]'); await p.waitForTimeout(300);
    const w3 = await wegInfo(p);
    erwarte(w3.an === "k3" && w3.stationen === 17 && w3.erste === "Zahlen bis 1000" && !w3.einstufung, `Klasse 3: 17 Stationen, beginnt mit „Zahlen bis 1000“ (${w3.stationen})`);
    for (let s3 = 0; s3 < 17; s3++) { await p.evaluate((n) => __mathe.starte(n), s3); await p.waitForTimeout(120);
      if (!(await p.evaluate(() => __mathe.lauf.liste.length === 10))) fehler.push("Kl. 3 Station " + s3 + " hat keine 10 Aufgaben"); }
    // NA-33b: schriftlich plus/minus, Würfelnetze, Spiegeln, Diagramme – Bild sichtbar, richtige Antwort wird angenommen
    for (const [s3, name] of [[12, "schriftplus"], [13, "schriftminus"], [14, "netz"], [15, "spiegel"], [16, "diagramm"]]) {
      await p.evaluate((n) => __mathe.starte(n), s3); await p.waitForTimeout(200);
      const info = await p.evaluate(() => { const a = __mathe.lauf.liste[__mathe.lauf.pos], svg = document.querySelector(".bild svg"), r = svg && svg.getBoundingClientRect();
        return { bild: !!svg && r.width > 60 && r.height > 60, passt: document.documentElement.scrollWidth <= innerWidth + 1, antwort: a.antwort, wahl: a.art === "wahl" }; });
      erwarte(info.bild && info.passt, `Kl. 3 ${name}: Bild sichtbar, keine Scrollleiste`);
      await bild(p, "mathe3-" + name);
      await p.evaluate((w) => __mathe.antworte(w), info.antwort); await p.waitForTimeout(250);
      erwarte(await p.evaluate(() => /\bgut\b/.test(document.getElementById("rueck").className)), `Kl. 3 ${name}: richtige Antwort wird angenommen`);
    }
    await p.evaluate(() => document.getElementById("zum-weg").click()); await p.waitForTimeout(300);
    await p.click('.weg-wahl[data-weg="k1"]'); await p.waitForTimeout(300);
    erwarte((await wegInfo(p)).an === "k1", "zurück zu Klasse 1");

    // Elternbericht zeigt die Klasse-1-Stationen
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(400);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(500); }
    const bericht = await p.evaluate(() => document.body.textContent);
    erwarte(/Kl\. 1: Würfelbilder/.test(bericht), "Elternbericht listet „Kl. 1: Würfelbilder“");
    erwarte(/Können: [●○]{4}/.test(bericht), "„Was übt die App?“ zeigt das Können je Lernbereich");
    await ctx.close();
  }
  {
    const { ctx, p } = await kind("2", 390, 760);
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForSelector("#karte .station");
    const w = await wegInfo(p);
    erwarte(w.an === "k2" && w.stationen === 23, "Klasse 2: startet auf dem bisherigen Matheweg");
    erwarte(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Hochformat 390 px: keine waagerechte Scrollleiste");
    await bild(p, "mathe1-hoch");
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Mathe-Klasse-1-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
