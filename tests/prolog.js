// Playwright-Test (NA-11): Prolog „Ankunft“ (Tutorial E1) auf der Insel.
// Aufruf: sh tests/laufen.sh prolog   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  const INSEL = BASIS + "spiele/welt3d/heimat.html?stunde=14";

  for (const [b, h, lage] of [[1180, 820, "quer"], [820, 1180, "hoch"]]) {
    const ctx = await browser.newContext({ viewport: { width: b, height: h }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__elternAlle = true; });
    const seite = async (name) => {
      const p = await ctx.newPage();
      p.on("pageerror", e => fehler.push(`${name}: ${e.message}`));
      p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${name}: ${m.text()}`); });
      return p;
    };
    const e = await seite("einrichtung");
    await e.goto(BASIS); await e.waitForURL(/eltern/); await e.waitForLoadState("load"); await e.waitForTimeout(300);
    await e.fill("#pin1", "1234"); await e.fill("#pin2", "1234"); await e.click("#pin-ok");
    await e.waitForSelector("#e-name"); await e.fill("#e-name", "Mira"); await e.click("#e-ok"); await e.waitForURL(u => !/eltern/.test(u.toString()));
    // Insel-Zugang wie heute (kompletter Führerschein); das Kind war aber noch nie auf der Insel
    await e.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.fuehrerschein = "2026-10-01"; Spielwelt.speichere("medien", m); });
    erwarte(!(await e.evaluate(() => Story.etappe("E1"))), `neues Kind hat E1 noch nicht (${lage})`);
    await e.close();

    // 1) Erster Besuch: Prolog startet von selbst
    const p = await seite(`insel ${lage}`);
    await p.goto(INSEL);
    await p.waitForFunction(() => window.__szene && __szene.aktuell() && __szene.aktuell().id === "prolog", null, { timeout: 30000 });
    let a = await p.evaluate(() => __szene.aktuell());
    erwarte(a.nr === 0 && a.wer === "robo" && /Mira/.test(a.text), `Prolog beginnt mit Robo Pixel (${lage})`);
    const spielzeit = await p.evaluate(() => Zeit.status().spielen);
    erwarte(!spielzeit, `Kind hat noch keine Spielzeit (Prolog muss trotzdem funktionieren) (${lage})`);
    await p.waitForTimeout(3800);   // Kamerafahrt
    await bild(p, `prolog-1-${lage}`);
    await p.click("#szene-weiter", { force: true }); await p.waitForTimeout(500);
    a = await p.evaluate(() => __szene.aktuell());
    erwarte(a.nr === 1 && a.wartet && a.zeigt, `Blase 2: Zeigehand zeigt das Schieben, „Weiter“ wartet aufs Laufen (${lage})`);
    await bild(p, `prolog-2-${lage}`);
    // Laufen: Pfeiltaste nach oben, bis die Figur sich bewegt hat (Swiftshader ist langsam → notfalls nachhelfen)
    await p.keyboard.down("ArrowUp"); await p.waitForTimeout(2500); await p.keyboard.up("ArrowUp");
    if ((await p.evaluate(() => __szene.aktuell().nr)) === 1) await p.evaluate(() => { __heimat.ich.position.z -= 2.5; });
    await p.waitForFunction(() => __szene.aktuell() && __szene.aktuell().nr === 2, null, { timeout: 5000 });
    a = await p.evaluate(() => __szene.aktuell());
    erwarte(a.nr === 2 && a.wartet && a.zeigt, `nach dem Laufen: Blase 3 zeigt aufs Haus (${lage})`);
    await bild(p, `prolog-3-${lage}`);
    // Zum Haus: vor die Tür stellen, Aktionsknopf zeigt „Reingehen“
    await p.evaluate(() => { __heimat.ich.position.set(-4.2, 0.25, -1.3); });
    await p.waitForFunction(() => __szene.aktuell() && __szene.aktuell().nr === 3, null, { timeout: 5000 });
    erwarte(await p.evaluate(() => __heimat.aktion === "Reingehen"), `vor dem Haus zeigt der Aktionsknopf „Reingehen“ (${lage})`);
    await bild(p, `prolog-4-${lage}`);
    await p.click("#springen", { force: true }); await p.waitForTimeout(800);
    const nachher = await p.evaluate(() => ({ drinnen: __heimat.besuche === 1, szene: __szene.aktuell(), e1: Story.etappe("E1"), chronik: Story.chronik().map(x => x.s), imProlog: __heimat.imProlog }));
    erwarte(nachher.drinnen && (!nachher.szene || nachher.szene.id !== "prolog") && nachher.e1 && !nachher.imProlog, `Aktionsknopf führt ins Haus, Prolog fertig, story.etappen.E1 gesetzt (${lage})`);
    erwarte(nachher.chronik.includes("prolog"), `Prolog steht in der Inselchronik (${lage})`);

    // 2) Zweiter Besuch: kein Prolog
    await p.goto(INSEL); await p.waitForTimeout(2500);
    erwarte(await p.evaluate(() => !__szene.aktuell() || __szene.aktuell().id !== "prolog"), `zweiter Besuch: kein Prolog (${lage})`);
    await p.evaluate(() => { if (__szene.aktuell()) Szene.abbrechen(); });

    if (lage === "quer") {
      // 3) Bei Robo Pixel wiederholen
      const robo = await p.evaluate(() => { for (let i = 0; i < 8; i++) { try { __heimat.tippe(i); } catch (er) { break; } if (/Pixel/.test(document.getElementById("blase-titel").textContent)) return i; } return -1; });
      const knopf = await p.evaluate(() => { const k = document.getElementById("blase-extra"); return !k.hidden && k.textContent; });
      erwarte(robo >= 0 && /nochmal/.test(knopf || ""), "Robo Pixel bietet „Wie ging das nochmal?“ an");
      await p.click("#blase-extra"); await p.waitForTimeout(500);
      erwarte(await p.evaluate(() => __heimat.imProlog && __szene.aktuell().id === "prolog"), "Wiederholen startet die Ankunft noch einmal");
      await p.click("#szene-weg"); await p.waitForTimeout(300);
      const ch = await p.evaluate(() => Story.chronik().filter(x => x.s === "prolog").length);
      erwarte(ch === 1, "Wiederholung legt keinen zweiten Chronik-Eintrag an");

      // 4) Elternbereich: Ankunft neu starten → beim nächsten Besuch wieder da
      await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300);
      if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
      await p.click("#prolog-neu"); await p.waitForTimeout(300);
      erwarte(await p.evaluate(() => !Story.etappe("E1") && !!document.getElementById("prolog-weg")), "Eltern: Ankunft neu starten setzt E1 zurück");
      await p.click("#prolog-weg"); await p.waitForTimeout(200);
      erwarte(await p.evaluate(() => Story.etappe("E1")), "Eltern: Ankunft überspringen setzt E1");
      await p.click("#prolog-neu"); await p.waitForTimeout(200);

      // 5) Grafik „einfach“: Prolog läuft, Zeichenaufrufe im Budget
      await p.evaluate(() => { const el = Spielwelt.lade("eltern"); el.insel = Object.assign({}, el.insel, { grafik: "einfach" }); Spielwelt.speichere("eltern", el); });
      await p.goto(INSEL); await p.waitForFunction(() => __szene.aktuell() && __szene.aktuell().id === "prolog", null, { timeout: 15000 });
      await p.waitForTimeout(4000);
      const einfach = await p.evaluate(() => __heimat.zeichnungen());
      // Die Insel liegt schon vor dem Prolog über dem Budget (GRAFIK Abschnitt 6, wird mit NA-20/21 gelöst);
      // hier nur ein Schutz gegen Ausreißer. Steg und Boot werden mit der Deko verschmolzen.
      erwarte(einfach <= 360, `Prolog in „einfach“: ${einfach} Zeichenaufrufe (Insel vorher ≈ 335)`);
      await p.click("#szene-weg"); await p.waitForTimeout(200);
      await p.evaluate(() => { const el = Spielwelt.lade("eltern"); el.insel.grafik = "schoen"; Spielwelt.speichere("eltern", el); });
      await p.goto(INSEL); await p.waitForTimeout(4000);
      const schoen = await p.evaluate(() => __heimat.zeichnungen());
      erwarte(schoen <= 530, `Insel mit Steg in „schön“: ${schoen} Zeichenaufrufe (vorher ≈ 495)`);
    }
    await p.close();

    // 6) Kind mit komplettem Führerschein aus der Zeit vor der Neuausrichtung: kein Prolog
    if (lage === "quer") {
      const alt = await seite("altes Kind");
      await alt.goto(BASIS); await alt.waitForTimeout(400);
      await alt.evaluate(() => { const k = Spielwelt.vorsilbe + "profil.v1", pr = JSON.parse(localStorage.getItem(k)); delete pr.daten.story; pr.stand = Date.now() + 60000; localStorage.setItem(k, JSON.stringify(pr)); });
      await alt.goto(INSEL); await alt.waitForTimeout(2500);
      const r = await alt.evaluate(() => ({ e1: Story.etappe("E1"), szene: __szene.aktuell() }));
      erwarte(r.e1 && (!r.szene || r.szene.id !== "prolog"), "altes Kind mit Führerschein bekommt keinen Prolog (E1 gilt als erledigt)");
      await alt.close();
    }
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Prolog-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
