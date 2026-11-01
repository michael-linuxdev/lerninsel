// Playwright-Test (01.11.2026): Bäckerei Benno – zu bis Kapitel 3, je eine ganze Runde für Vorschule, Kl. 1, Kl. 2 und Kl. 3 über die Tasten echt gespielt
// (packen, Preis, passend bezahlen, Wechselgeld), Fehler und Lösungshilfe, Sterne nur für den ersten Tag und den ersten fehlerfreien Tag,
// Geld je Klasse (ab Kl. 3 mit Komma), Kapitel 3 und Ort auf der Insel.
// Aufruf: sh tests/laufen.sh baeckerei   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo/;
process.on("unhandledRejection", (e) => { console.log("❌ Abbruch: " + e.message + "\n  " + (global.__fehler || []).join("\n  ")); process.exit(1); });

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const fehler = global.__fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true });
  await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`Seitenfehler: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`Konsole: ${m.text()}`); });
  const laden = async () => { await p.goto(BASIS + "spiele/baeckerei/"); await p.waitForLoadState("load"); await p.waitForTimeout(300); };
  const stufe = (st) => p.evaluate((st) => { const e = Spielwelt.lade("eltern"); e.kind.stufe = st; e.kind.klasse = { vs: 1, "5": 4 }[st] || +st; Spielwelt.speichere("eltern", e); }, st);
  const tippe = async (text) => { for (const z of text) await p.click(`[data-taste="${z}"]`); await p.click('[data-taste="ok"]'); };
  const euroText = (ct, komma) => komma ? (Math.floor(ct / 100) + "," + String(ct % 100).padStart(2, "0")) : String(Math.round(ct / 100));

  // eine Aufgabe lösen; falsch = erst absichtlich daneben
  async function loese(falsch = false) {
    const a = await p.evaluate(() => { const l = __baeckerei.lauf(); return { art: l.aktuell.art, b: l.aktuell.b, zurueck: l.aktuell.zurueck, komma: __baeckerei.stufe() === "c" }; });
    if (a.art === "packen") {
      if (falsch) { await p.click(`[data-ware="${a.b.waren[0].id}"]`); for (let i = 0; i < 4; i++) await p.click(`[data-ware="${a.b.waren[0].id}"]`); await p.click("#fertig"); await p.waitForTimeout(150);
        while (await p.$("#tablett [data-weg]")) await p.click("#tablett [data-weg]"); }
      for (const w of a.b.waren) for (let i = 0; i < w.n; i++) await p.click(`[data-ware="${w.id}"]`);
      await p.click("#fertig");
    } else if (a.art === "preis" || a.art === "wechsel") {
      const soll = a.art === "preis" ? a.b.summe : a.zurueck;
      if (falsch) { await tippe(euroText(soll + 100, a.komma)); await p.waitForTimeout(150); }
      await tippe(euroText(soll, a.komma));
    } else if (a.art === "bezahlen") {
      const geld = (await p.$$eval("[data-geld]", l => l.map(b => +b.dataset.geld))).sort((x, y) => y - x);
      if (falsch) { await p.click(`[data-geld="${geld[geld.length - 1]}"]`); await p.click("#fertig"); await p.waitForTimeout(150); await p.click("#tablett [data-weg]"); }
      let rest = a.b.summe;
      for (const g of geld) while (rest >= g) { await p.click(`[data-geld="${g}"]`); rest -= g; }
      await p.click("#fertig");
    }
    await p.waitForSelector("#naechster", { timeout: 8000 }).catch(async (e) => { if (BILDER) await p.screenshot({ path: `${BILDER}/baeckerei-fehler.png` }); throw new Error(`${a.art} ${JSON.stringify(a.b)} ${a.zurueck}: ${await p.textContent("#hinweis")}`); });
    return a;
  }
  async function runde(falschBei = -1, bild = "") {
    await p.click("#los"); const arten = [];
    for (let i = 0; i < 5; i++) {
      const a = await loese(i === falschBei); arten.push(a.art);
      if (bild && i === 2) await p.screenshot({ path: `${BILDER}/${bild}.png` });
      await p.click("#naechster");
    }
    await p.waitForSelector("#ende:not([hidden])");
    return arten;
  }

  // Ersteinrichtung
  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
  await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "2"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(600);

  // 1) zu bis Kapitel 3
  await laden();
  erwarte(await p.isVisible("#zu"), "vor Kapitel 3 ist die Bäckerei zu");
  await p.evaluate(() => Story.setzeKapitel(3));

  // 2) Klasse 2: erster Tag mit einem Fehler → 2 Sterne, kein Fehlerfrei-Stern
  await laden();
  const s0 = await p.evaluate(() => Spielwelt.sterne());
  const arten = await runde(1, BILDER ? "baeckerei-kl2" : "");
  erwarte(arten.join(",") === "packen,preis,bezahlen,wechsel,preis", `Kl. 2: Ablauf ${arten.join(", ")}`);
  const s1 = await p.evaluate(() => ({ sterne: Spielwelt.sterne(), d: Spielwelt.lade("baeckerei"), fund: JSON.stringify(Spielwelt.lade("lernfunde") || {}) }));
  erwarte(/2 Sterne/.test(await p.textContent("#ende-text")) && s1.sterne >= s0 + 2 && s1.d.tage === 1 && !s1.d.fehlerfrei, `erster Tag (mit Fehler): +2 Sterne (${s0} → ${s1.sterne})`);
  erwarte(/baeckerei:erster/.test(s1.fund), "Lernfund für den ersten Tag in der Bäckerei");
  // zweiter Tag ohne Fehler → +1
  await p.click("#nochmal"); await p.waitForTimeout(100);
  for (let i = 0; i < 5; i++) { await loese(false); await p.click("#naechster"); }
  await p.waitForSelector("#ende:not([hidden])");
  const s2 = await p.evaluate(() => ({ sterne: Spielwelt.sterne(), d: Spielwelt.lade("baeckerei") }));
  erwarte(/1 Stern\b/.test(await p.textContent("#ende-text")) && s2.d.fehlerfrei && s2.d.tage === 2, `erster fehlerfreier Tag: +1 Stern (${s2.sterne})`);
  // dritter fehlerfreier Tag: keine Sterne mehr
  await p.click("#nochmal"); for (let i = 0; i < 5; i++) { await loese(false); await p.click("#naechster"); } await p.waitForSelector("#ende:not([hidden])");
  erwarte(!/Stern/.test(await p.textContent("#ende-text")), "weitere Tage: keine neuen Sterne (nur neue Ziele zählen)");

  // 3) zwei Fehler → Lösungshilfe, es geht trotzdem weiter
  await laden(); await p.click("#los");
  const a = await p.evaluate(() => __baeckerei.lauf().aktuell);
  // sicher falsch: von der ersten Sorte mehr als 3 Stück (Bestellungen haben höchstens 3)
  for (let i = 0; i < 2; i++) { for (let k = 0; k < 4; k++) await p.click(`[data-ware="${a.b.waren[0].id}"]`); await p.click("#fertig"); await p.waitForTimeout(120); }
  erwarte(/💡/.test(await p.textContent("#hinweis")) && !!(await p.$("#naechster")), "nach zwei Fehlern zeigt Benno die Lösung, weiter geht es trotzdem");

  // 4) Vorschule, Kl. 1, Kl. 3: je eine ganze Runde; Geld passend zur Klasse
  for (const [st, erwartet, komma] of [["vs", "packen,packen,bezahlen,packen,bezahlen", false], ["1", "packen,preis,bezahlen,packen,wechsel", false], ["3", "preis,bezahlen,wechsel,packen,wechsel", true]]) {
    await stufe(st); await laden();
    const ar = await runde(-1, BILDER ? `baeckerei-${st}` : "");
    erwarte(ar.join(",") === erwartet, `Stufe ${st}: ganze Runde gespielt (${ar.join(", ")})`);
    const g = await p.evaluate(() => ({ preise: __baeckerei.WAREN[__baeckerei.stufe()].map(w => w[1]), euro: __baeckerei.euro(120) }));
    const max = Math.max(...g.preise);
    erwarte(komma ? g.euro === "1,20 €" && g.preise.some(x => x % 100) : g.preise.every(x => x % 100 === 0) && max <= (st === "vs" ? 300 : 500), `Stufe ${st}: Preise ${komma ? "mit Komma" : "in ganzen Euro"}`);
  }
  // Hochformat
  await p.setViewportSize({ width: 820, height: 1180 }); await laden(); await p.click("#los");
  erwarte(!(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)), "Hochformat: kein waagerechter Überlauf");
  if (BILDER) await p.screenshot({ path: `${BILDER}/baeckerei-hoch.png`, fullPage: true });
  await p.setViewportSize({ width: 1180, height: 820 });

  // 5) Insel: Kapitel 3 wird fällig mit 10 Lernfunden und 3 Matheweg-Stationen, Blase führt in die Bäckerei
  await p.evaluate(() => {
    Spielwelt.speichere("medien", { lektionen: { bedienung: 3 } });
    const lf = Spielwelt.lade("lernfunde") || {}; lf.summe = 12; Spielwelt.speichere("lernfunde", lf);   // höchstens 5 Funde am Tag – Summe direkt setzen
    Spielwelt.speichere("mathe", { k2: { a: 1, b: 2, c: 1 } });
  });
  await p.goto(BASIS + "spiele/welt3d/heimat.html?stunde=14"); await p.waitForFunction(() => window.InselKern && window.Insel, null, { timeout: 30000 });
  const insel = await p.evaluate(() => { const k3 = InselKern.KAPITEL.find(k => k.n === 3), a = InselKern.antwort("baeckerei");
    return { faellig: k3.faellig(), szene: k3.szene, ziel: a.blase[4], ort: Insel.ORTE.includes("baeckerei"), knopf: InselKern.aktionFuer("baeckerei")[0][1], hat: !!(window.Szene && Szene.hole ? Szene.hole("bennos-baeckerei") : true) }; });
  erwarte(insel.faellig && insel.szene === "bennos-baeckerei", "Kapitel 3 „Bennos Bäckerei“ ist fällig (10 Lernfunde, 3 Stationen)");
  erwarte(insel.ziel === "../baeckerei/" && insel.ort && insel.knopf === "Bäckerei", "Insel: Bäckerei-Blase, Ort und Knopf");

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n  " + fehler.join("\n  ")); process.exit(1); }
  console.log("✅ Bäckerei-Test bestanden.");
})();
