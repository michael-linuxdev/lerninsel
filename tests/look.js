// Playwright-Test (NA-25): zwei Looks der Insel – „Rund“ (three.js) und „Pixel“ (PixiJS) – mit demselben Spielstand.
// Seit 27.10.2026 auf Hauptseite und /dev wählbar: Knopf auf der Insel und Elternkarte; Umschalten verliert nichts;
// Eltern können das Umschalten für das Kind sperren; alle Insel-Links (spiele/insel/) folgen dem gewählten Look.
// Braucht ein aktuelles /dev (sh quellen/dev-bauen.sh). Aufruf: sh tests/laufen.sh look   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const DEV = BASIS + "dev/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true });
  await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__elternAlle = true; });
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
  async function neuesKind(wurzel) {
    await p.goto(wurzel); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    await p.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.lektionen = { bedienung: 3 }; Spielwelt.speichere("medien", m); Story.etappeFertig("E1"); Story.etappeFertig("E2"); });
  }
  const stand = () => p.evaluate(() => ({ e: ["E1", "E2", "E3"].map(x => !!Story.etappe(x)), chronik: Story.chronik().length, sterne: Spielwelt.sterne(), name: Spielwelt.profil.name, look: Spielwelt.look() }));

  // 1) Hauptseite: Pixel ist wählbar (Freigabe 27.10.2026), Standard bleibt „Rund“
  await neuesKind(BASIS);
  erwarte(await p.evaluate(() => Spielwelt.lookWaehlbar() && Spielwelt.look() === "rund"), "Hauptseite: Look wählbar, Standard „Rund“");
  await p.goto(BASIS + "spiele/welt3d/heimat.html?stunde=14"); await p.waitForTimeout(2000);
  await p.evaluate(() => { if (window.__szene && __szene.aktuell()) Szene.abbrechen(); });
  erwarte(await p.evaluate(() => !document.getElementById("look").hidden), "Hauptseite: Look-Knopf auf der Insel");
  await p.evaluate(() => Spielwelt.setzeLook("pixel"));
  erwarte(await p.evaluate(() => Spielwelt.look() === "pixel" && /pixel\/insel/.test(Spielwelt.inselUrl("../../"))), "Hauptseite: mit „pixel“ geht es zur Pixel-Insel");
  await p.evaluate(() => Spielwelt.setzeLook("rund"));

  // 2) /dev: neues Kind (eigener Spielstand), Knopf auf der runden Insel
  await neuesKind(DEV);
  erwarte(await p.evaluate(() => Spielwelt.lookWaehlbar() && Spielwelt.look() === "rund"), "/dev: Look wählbar, Standard „Rund“");
  await p.evaluate(() => { for (let i = 0; i < 12; i++) Zeit.aufgabe(); Spielwelt.speichere("zimmer", { plaetze: { links: "lampe" }, wand: "mint" }); });
  await p.goto(DEV + "spiele/insel/?stunde=14"); await p.waitForURL(/welt3d\/heimat/); await p.waitForTimeout(2500);
  await p.evaluate(() => { if (window.__szene && __szene.aktuell()) Szene.abbrechen(); });
  const vorher = await stand();
  const knopf = await p.evaluate(() => { const k = document.getElementById("look"); return !k.hidden && k.textContent; });
  erwarte(/Pixel/.test(knopf || ""), `runde Insel zeigt den Knopf „${knopf}“`);
  await p.click("#look"); await p.waitForURL(/pixel\/insel\.html/); await p.waitForFunction(() => !!window.__pixel, null, { timeout: 20000 });
  await p.waitForTimeout(1000);
  const nachher = await stand();
  erwarte(nachher.look === "pixel", "nach dem Umschalten gilt „Pixel“");
  erwarte(JSON.stringify(vorher.e) === JSON.stringify(nachher.e) && vorher.chronik === nachher.chronik && vorher.sterne === nachher.sterne && vorher.name === nachher.name, "Spielstand, Etappen, Chronik und Sterne bleiben beim Umschalten gleich");
  erwarte(await p.evaluate(() => __pixel.zimmerDaten().wand === "mint" && __pixel.zimmerDaten().plaetze.links === "lampe"), "Pixel liest dieselben Zimmer-Daten");
  await bild(p, "look-pixel");
  // Insel-Einstieg folgt dem Look
  await p.goto(DEV + "spiele/insel/?stunde=14"); await p.waitForURL(/pixel\/insel\.html/);
  erwarte(true, "spiele/insel/ führt jetzt zur Pixel-Insel");
  await p.waitForFunction(() => !!window.__pixel, null, { timeout: 20000 });
  const zurueck = await p.evaluate(() => { const k = document.getElementById("look"); return !k.hidden && k.textContent; });
  erwarte(/Rund/.test(zurueck || ""), `Pixel-Insel zeigt den Knopf „${zurueck}“`);
  await p.click("#look"); await p.waitForURL(/welt3d\/heimat/); await p.waitForTimeout(1500);
  erwarte(await p.evaluate(() => Spielwelt.look() === "rund"), "zurück zu „Rund“");

  // 3) Elternkarte: Look wählen und Umschalten fürs Kind sperren
  await p.goto(DEV + "spiele/eltern/"); await p.waitForTimeout(400);
  if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(300); }
  erwarte(!!(await p.$("#i-look")), "Elternbereich: Karte mit Look-Auswahl");
  await p.selectOption("#i-look", "pixel"); await p.uncheck("#i-lookkind"); await p.click("#i-speichern"); await p.waitForTimeout(300);
  const el = await p.evaluate(() => ({ look: Spielwelt.look(), kind: Spielwelt.lookKindDarf(), url: Spielwelt.inselUrl("../../") }));
  erwarte(el.look === "pixel" && !el.kind && /pixel\/insel/.test(el.url), "Eltern stellen „Pixel“ ein und sperren das Umschalten");
  await p.goto(DEV + "spiele/insel/?stunde=14"); await p.waitForURL(/pixel\/insel\.html/); await p.waitForFunction(() => !!window.__pixel, null, { timeout: 20000 });
  erwarte(await p.evaluate(() => document.getElementById("look").hidden), "gesperrt: das Kind sieht keinen Look-Knopf");
  // Grafik-Einstellungen der runden Insel bleiben erhalten
  erwarte(await p.evaluate(() => { const i = (Spielwelt.lade("eltern") || {}).insel || {}; return !!i.grafik && !!i.steuerung; }), "Elternkarte speichert Look zusammen mit den übrigen Insel-Werten");

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Look-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
