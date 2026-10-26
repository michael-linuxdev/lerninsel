// Playwright-Test (NA-15): Weihnachts-Sonderstart – Erststart im Dezember mit Schnee, Paket am Steg, Lichterkette;
// im November derselbe Prolog ohne Paket. Aufruf: sh tests/laufen.sh weihnachten   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };

  async function neuesKind(zeit) {
    const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true });
    await ctx.addInitScript((t) => { window.__jetzt = t; }, zeit);
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    await p.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.lektionen = { bedienung: 3 }; Spielwelt.speichere("medien", m); });
    return { ctx, p };
  }
  const warteSzene = (p, id) => p.waitForFunction((id) => window.__szene && __szene.aktuell() && __szene.aktuell().id === id, id, { timeout: 15000 });

  // 1) Erststart am 10. Dezember
  {
    const { ctx, p } = await neuesKind(new Date(2026, 11, 10, 15, 0).getTime());
    const INSEL = BASIS + "spiele/welt3d/heimat.html?stunde=14&monat=12";
    await p.goto(INSEL); await warteSzene(p, "prolog"); await p.waitForTimeout(3800);
    const vorher = await p.evaluate(() => ({ paket: __heimat.paket, lichter: __heimat.lichter() }));
    erwarte(!!vorher.paket && vorher.lichter > 10, `Dezember: Paket am Steg und Lichterkette (${vorher.lichter} Lichter)`);
    await bild(p, "weihnachten-ankunft");
    await p.click("#szene-weg"); await p.waitForTimeout(300);
    erwarte(await p.evaluate(() => Story.zustand().etappen.E1 === "2026-12-10"), "E1 mit Datum 10.12. gemerkt");
    await warteSzene(p, "weihnachtspaket");
    erwarte(await p.evaluate(() => __szene.aktuell().zeigt), "Pixel zeigt auf das Paket");
    await p.click("#szene-weiter", { force: true }); await p.waitForTimeout(300);
    erwarte(await p.evaluate(() => __szene.aktuell().wartet), "Szene wartet, bis das Paket geöffnet ist");
    await bild(p, "weihnachten-paket");
    await p.evaluate(() => { const k = __heimat.paket; __heimat.ich.position.set(k.x - 0.2, 0.25, k.z - 1.0); });
    await p.waitForTimeout(800);
    erwarte(await p.evaluate(() => __heimat.aktion === "Öffnen"), "am Paket zeigt der Aktionsknopf „Öffnen“");
    await p.evaluate(() => __heimat.druecke()); await p.waitForTimeout(800);
    const auf = await p.evaluate(() => ({ g: Story.hatGeschenk("weihnachten-2026"), baum: Spielwelt.istFrei("moebel-tannenbaum"), steht: Object.values(__heimat.zimmerDaten().plaetze).includes("tannenbaum"),
      schleife: !!(Spielwelt.lade("tier") || {}).besitz && !!Spielwelt.lade("tier").besitz.schleife, paket: __heimat.paket, szene: __szene.aktuell(), titel: document.getElementById("blase-titel").textContent }));
    erwarte(auf.g && auf.baum && auf.steht && !auf.paket, "Paket geöffnet: Tannenbaum steht im Zimmer, Geschenk gemerkt");
    erwarte(auf.schleife, "Schleife fürs Tier geschenkt");
    erwarte(!auf.szene && /Weihnachtspaket/.test(auf.titel), "Szene endet, Pixel erklärt den Inhalt");
    // zweiter Besuch: kein Paket mehr, Baum im Zimmer, lässt sich wegräumen
    await p.goto(INSEL); await p.waitForTimeout(2500);
    await p.evaluate(() => { if (__szene.aktuell()) Szene.abbrechen(); });
    erwarte(await p.evaluate(() => !__heimat.paket), "zweiter Besuch: kein neues Paket");
    await p.evaluate(() => __heimat.reingehen()); await p.waitForTimeout(800);
    await bild(p, "weihnachten-zimmer");
    await p.evaluate(() => __heimat.laden()); await p.waitForTimeout(200);
    await p.click('[data-moebel="tannenbaum"]'); await p.waitForTimeout(200);
    await p.click("[data-weg]"); await p.waitForTimeout(300);
    erwarte(await p.evaluate(() => !Object.values(__heimat.zimmerDaten().plaetze).includes("tannenbaum") && Spielwelt.istFrei("moebel-tannenbaum")), "Tannenbaum lässt sich wegräumen und bleibt im Besitz");
    await ctx.close();
  }

  // 2) Erststart im November: gleicher Prolog, kein Paket, keine Lichter
  {
    const { ctx, p } = await neuesKind(new Date(2026, 10, 10, 15, 0).getTime());
    await p.goto(BASIS + "spiele/welt3d/heimat.html?stunde=14&monat=11"); await warteSzene(p, "prolog");
    const nov = await p.evaluate(() => ({ paket: __heimat.paket, lichter: __heimat.lichter() }));
    erwarte(!nov.paket && nov.lichter === 0, "November: Prolog ohne Paket und Lichterkette");
    // im Dezember danach: kein Paket (Erststart war im November)
    await p.click("#szene-weg"); await p.waitForTimeout(200);
    await p.goto(BASIS + "spiele/welt3d/heimat.html?stunde=14&monat=12"); await p.waitForTimeout(2000);
    erwarte(await p.evaluate(() => !__heimat.paket && __heimat.lichter() > 0), "später im Dezember: Lichterkette, aber kein Erststart-Paket");
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Weihnachts-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
