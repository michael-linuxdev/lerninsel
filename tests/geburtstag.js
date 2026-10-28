// Test Geburtsdatum und Geburtstagsgeschenk (30.10.2026):
// - Ersteinrichtung mit Geburtsdatum (echt eingegeben): Alter wird daraus berechnet, Auswahl gesperrt, Anzeige im Elternbereich
// - ohne Geburtsdatum: Hinweis-Karte „Geburtsdatum eintragen“ im Überblick, „Jetzt eintragen“ öffnet das Formular
// - am Geburtstag: 🎂 auf der Startseite; auf der Insel Szene „Mein Geburtstag“ und Paket am Steg; Öffnen → Partyhut fürs Tier + 5 Sterne
// - auch Tage danach noch einlösbar; einmal je Jahr; vor dem Geburtstag nichts; im nächsten Jahr wieder (Krone, weil der Hut schon da ist)
// Aufruf: sh tests/laufen.sh geburtstag (3D, allein laufen lassen)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const TAG = (j, m, d) => new Date(j, m - 1, d, 15, 0).getTime();

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  const INSEL = BASIS + "spiele/welt3d/heimat.html?stunde=14";

  async function kind(geburt, start = TAG(2026, 10, 25)) {
    const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript((t) => { let x = null; try { x = localStorage.getItem("__testJetzt"); } catch (e) { /* egal */ } window.__jetzt = x ? +x : t; window.__keinSparen = true; window.__elternAlle = true; }, start);
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira");
    if (geburt) await p.fill("#e-geburt", geburt);
    const form = await p.evaluate(() => ({ alter: document.getElementById("e-alter").value, gesperrt: document.getElementById("e-alter").disabled }));
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    await p.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.lektionen = { bedienung: 3 }; Spielwelt.speichere("medien", m);
      ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9"].forEach(e => Story.etappeFertig(e, true)); Story.merkeSzene("sonne"); Story.setzeKapitel(1); for (let i = 0; i < 12; i++) Zeit.aufgabe();
      Spielwelt.speichere("tier", { phase: "tier", art: "katze", farbe: 0, name: "Mimi", besitz: {}, traegt: {} }); });
    return { ctx, p, form };
  }
  const tag = (p, t) => p.evaluate((t) => localStorage.setItem("__testJetzt", String(t)), t);

  // ---------- ohne Geburtsdatum: Hinweis im Elternbereich ----------
  {
    const { ctx, p } = await kind("");
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(400);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(500); }
    erwarte(await p.evaluate(() => !!document.getElementById("geburt-fehlt")), "ohne Geburtsdatum: Karte „Geburtsdatum eintragen“ im Überblick");
    await p.click("#geburt-eintragen"); await p.waitForSelector("#e-geburt");
    await p.fill("#e-geburt", "2019-03-14"); await p.waitForTimeout(100);
    erwarte(await p.evaluate(() => document.getElementById("e-alter").value === "7" && document.getElementById("e-alter").disabled), "„Jetzt eintragen“: Geburtsdatum eingetragen, Alter 7 berechnet und gesperrt");
    await p.click("#e-ok"); await p.waitForTimeout(400);
    erwarte(await p.evaluate(() => Spielwelt.kind().geburt === "2019-03-14" && Spielwelt.kind().alter === 7 && !document.getElementById("geburt-fehlt")), "gespeichert, Karte verschwindet");
    await ctx.close();
  }

  // ---------- Geburtstag am 25.10. ----------
  {
    const { ctx, p, form } = await kind("2018-10-25");
    erwarte(form.alter === "8" && form.gesperrt, "Ersteinrichtung mit Geburtsdatum: Alter 8 berechnet, Auswahl gesperrt");
    erwarte(await p.evaluate(() => Spielwelt.kind().alter === 8 && Spielwelt.geburtstagHeute() && !!document.querySelector("#name .kuchen")), "am Geburtstag: 🎂 neben dem Namen auf der Startseite");
    await bild(p, "geburtstag-start");
    await p.goto(INSEL);
    await p.waitForFunction(() => window.__szene && __szene.aktuell() && __szene.aktuell().id === "geburtstag", null, { timeout: 20000 });
    const a = await p.evaluate(() => ({ s: __szene.aktuell(), paket: __heimat.paket }));
    erwarte(a.s.wer === "papagei" && /Geburtstag/.test(a.s.text) && /Mira/.test(a.s.text) && a.paket, "Insel: Paula gratuliert, Paket liegt am Steg");
    await bild(p, "geburtstag-szene");
    await p.click("#szene-weiter", { force: true }); await p.waitForTimeout(350);
    erwarte(await p.evaluate(() => { const s = __szene.aktuell(); return s && s.nr === 1 && s.wartet && s.zeigt; }), "Benno zeigt aufs Paket und wartet, bis es geöffnet ist");
    // zum Paket laufen (Teleport) und mit dem Aktionsknopf öffnen
    const sterne = await p.evaluate(() => Spielwelt.sterne());
    await p.evaluate(() => __heimat.oeffnePaket()); await p.waitForTimeout(500);
    const z = await p.evaluate((v) => ({ titel: document.getElementById("blase-titel").textContent, text: document.getElementById("blase-text").textContent, hut: !!(Spielwelt.lade("tier").besitz || {}).hut, plus: Spielwelt.sterne() - v, paket: !!__heimat.paket, szene: __szene.aktuell() }), sterne);
    erwarte(/8\. Geburtstag/.test(z.titel) && /Partyhut/.test(z.text) && z.hut && z.plus === 5 && !z.paket, `Paket geöffnet: „${z.titel}“, Partyhut fürs Tier, +5 Sterne`);
    await p.waitForTimeout(600);
    erwarte(await p.evaluate(() => { const s = __szene.aktuell(); return !s || s.nr === 2; }), "nach dem Öffnen geht die Szene weiter (Robo)");
    if (await p.evaluate(() => !!__szene.aktuell())) { await p.evaluate(() => __szene.weiter()); await p.waitForTimeout(350); }
    await bild(p, "geburtstag-paket");
    await p.goto(INSEL); await p.waitForTimeout(3000);
    erwarte(await p.evaluate(() => !__heimat.paket && !(window.__szene && __szene.aktuell())), "am selben Tag kein zweites Paket, keine Szene");
    // nächstes Jahr: wieder, diesmal eine Krone (der Hut ist schon da); erst drei Tage später gespielt
    await tag(p, TAG(2027, 10, 28));
    await p.goto(INSEL);
    await p.waitForFunction(() => window.__szene && __szene.aktuell() && __szene.aktuell().id === "geburtstag", null, { timeout: 20000 });
    await p.evaluate(() => Szene.abbrechen());
    await p.evaluate(() => __heimat.oeffnePaket()); await p.waitForTimeout(400);
    const n = await p.evaluate(() => ({ titel: document.getElementById("blase-titel").textContent, krone: !!Spielwelt.lade("tier").besitz.krone, start: Spielwelt.geburtstagHeute() }));
    erwarte(/9\. Geburtstag/.test(n.titel) && n.krone && !n.start, "nächstes Jahr drei Tage später: noch einlösbar, 9. Geburtstag, diesmal eine Krone (kein 🎂 mehr auf der Startseite)");
    await ctx.close();
  }

  // ---------- vor dem Geburtstag nichts, lange danach nichts ----------
  {
    const { ctx, p } = await kind("2018-11-05");
    await p.goto(INSEL); await p.waitForTimeout(3000);
    erwarte(await p.evaluate(() => !__heimat.paket && InselKern.geburtstagsPaket() === null), "Geburtstag erst am 5.11.: am 25.10. noch kein Paket");
    await tag(p, TAG(2027, 2, 20));
    await p.goto(INSEL); await p.waitForTimeout(2500);
    erwarte(await p.evaluate(() => InselKern.geburtstagsPaket() === null), "über 60 Tage nach dem Geburtstag: kein Paket mehr (das nächste kommt am nächsten Geburtstag)");
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Geburtstags-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
