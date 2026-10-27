// Playwright-Test (NA-30): „Laute und Buchstaben“ (spiele/lesen/).
// Kachel auf Fipsis Karte; Buchstaben-Tafel; „Welcher Buchstabe?“, „Finde das Bild“, „Gleicher Anfang“ mit Prüfung der Auswahl;
// erster Fehler → Lernkartei (Fach „lesen“), fällige Karte kommt in der nächsten Runde zuerst; Lernaufgaben und Lernfund; Hochformat.
// Aufruf: sh tests/laufen.sh lesen   (Screenshots mit BILDER=<ordner>)
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
  // Eine Runde durchspielen; fehlerBei = Index der Aufgabe, bei der zuerst falsch getippt wird
  async function spiele(p, modus, fehlerBei = -1, pruefe = null) {
    await p.evaluate((m) => __lesen.runde(m), modus); await p.waitForTimeout(200);
    const n = await p.evaluate(() => __lesen.anzahl());
    for (let i = 0; i < n; i++) {
      await p.waitForFunction((k) => __lesen.aufgabeNr() === k, i);
      if (pruefe) await pruefe(i);
      const r = await p.evaluate(() => __lesen.richtigIndex());
      if (i === fehlerBei) { await p.click(`#wahl [data-i="${(r + 1) % 3}"]`); await p.waitForTimeout(150); }
      await p.click(`#wahl [data-i="${r}"]`); await p.waitForTimeout(1400);
    }
    await p.waitForSelector("#uebung-ende:not([hidden])");
    return n;
  }

  {
    const { ctx, p } = await kind("1");
    await p.goto(BASIS + "spiele/deutsch/"); await p.waitForSelector("#zu-lesen");
    erwarte(true, "Fipsis Karte hat die Kachel „Laute und Buchstaben“");
    await p.click("#zu-lesen"); await p.waitForURL(/spiele\/lesen\//); await p.waitForFunction(() => !!window.__lesen);
    await bild(p, "lesen-start");

    // Tafel
    await p.click("#weg-tafel");
    const kacheln = await p.evaluate(() => document.querySelectorAll(".bst").length);
    erwarte(kacheln === 32, `Buchstaben-Tafel: 26 Buchstaben + Ä, Ö, Ü + Sch, Ei, Au (${kacheln})`);
    await p.click('.bst[data-b="A"]');
    const det = await p.evaluate(() => ({ gross: document.querySelector("#detail .gross").textContent, bilder: document.querySelectorAll("#detail .bilder button").length }));
    erwarte(det.gross === "A a" && det.bilder === 3, `„A a“ mit drei Bildwörtern (${det.gross}, ${det.bilder})`);
    await p.click('.bst[data-b="C"]');
    erwarte(await p.evaluate(() => /wie K/.test(document.querySelector("#detail .tipp").textContent)), "seltener Buchstabe C mit Hinweis „klingt wie K“");
    await bild(p, "lesen-tafel");

    // Welcher Buchstabe? – erste Aufgabe zuerst falsch → Lernkartei
    const aufgabenVorher = await p.evaluate(() => Zeit.status().aufgaben || 0);
    let ersteZiel = null;
    const n1 = await spiele(p, "buchstabe", 0, async (i) => {
      const z = await p.evaluate(() => ({ ziel: __lesen.ziel(), opt: [...document.querySelectorAll("#wahl button")].map(b => b.textContent) }));
      if (i === 0) ersteZiel = z.ziel;
      const r = await p.evaluate(() => __lesen.richtigIndex());
      if (!z.opt[r].startsWith(z.ziel.ziel)) fehler.push(`Welcher Buchstabe: richtige Taste ${z.opt[r]} passt nicht zu ${z.ziel.ziel}`);
      if (new Set(z.opt).size !== 3) fehler.push("Welcher Buchstabe: doppelte Auswahl " + z.opt.join("/"));
    });
    erwarte(n1 === 10, "Welcher Buchstabe?: 10 Aufgaben");
    const k = await p.evaluate(() => (Spielwelt.lade("lernkartei") || {}).lesen || []);
    erwarte(k.length === 1 && k[0].s.wort === ersteZiel.wort, `erster Fehler landet in der Lernkartei (${k.map(x => x.s.wort).join()})`);
    const aufgabenNachher = await p.evaluate(() => Zeit.status().aufgaben || 0);
    erwarte(aufgabenNachher === aufgabenVorher + 9, `9 richtige beim ersten Versuch zählen als Lernaufgaben (${aufgabenVorher} → ${aufgabenNachher})`);

    // Finde das Bild: richtiges Bild beginnt mit dem Buchstaben; neue Buchstaben werden Lernfunde
    await spiele(p, "bild", -1, async () => {
      const z = await p.evaluate(() => { const r = __lesen.richtigIndex(), b = [...document.querySelectorAll("#wahl button")]; return { ziel: __lesen.ziel().ziel, richtig: b[r].getAttribute("aria-label"), alle: b.map(x => x.getAttribute("aria-label")) }; });
      const anfang = (w) => w.toUpperCase().startsWith(z.ziel.toUpperCase());
      if (!anfang(z.richtig)) fehler.push(`Finde das Bild: ${z.richtig} beginnt nicht mit ${z.ziel}`);
      if (z.alle.filter(anfang).length !== 1) fehler.push(`Finde das Bild: mehrere passende Bilder für ${z.ziel}: ${z.alle.join("/")}`);
    });
    await bild(p, "lesen-ende");
    const lf = await p.evaluate(() => (Lernfunde.heute() || []).filter(f => /^Buchstabe /.test(f.t)).length);
    erwarte(lf >= 1, `Lernfund „Buchstabe …“ beim ersten Treffer (${lf})`);

    // Gleicher Anfang: die richtige Wahl hat denselben Anlaut wie das Vorlagebild, die anderen nicht
    await spiele(p, "gleich", -1, async () => {
      const z = await p.evaluate(() => { const r = __lesen.richtigIndex(), b = [...document.querySelectorAll("#wahl button")]; const ziel = __lesen.ziel();
        return { ziel: ziel.ziel, vorlage: ziel.wort, richtig: b[r].getAttribute("aria-label"), alle: b.map(x => x.getAttribute("aria-label")) }; });
      const passt = z.alle.filter(w => w.toUpperCase().startsWith(z.ziel.toUpperCase()));
      if (passt.length !== 1 || passt[0] !== z.richtig) fehler.push(`Gleicher Anfang: ${z.ziel} → ${z.alle.join("/")} (richtig: ${z.richtig})`);
    });
    erwarte(true, "Gleicher Anfang: genau ein Bild mit demselben Anlaut");

    // Lernkartei: Karte am nächsten Tag fällig → kommt in der nächsten Runde zuerst
    await p.evaluate(() => { const d = Spielwelt.lade("lernkartei"); d.lesen.forEach(c => c.faellig = "2000-01-01"); Spielwelt.speichere("lernkartei", d); });
    await p.evaluate(() => __lesen.runde("buchstabe")); await p.waitForTimeout(200);
    const erste = await p.evaluate(() => __lesen.ziel());
    erwarte(erste.__karte && erste.wort === ersteZiel.wort, "fällige Lernkarten-Aufgabe steht am Anfang der nächsten Runde");
    await ctx.close();
  }

  // Vorschule im Hochformat: Empfehlung „Gleicher Anfang“, keine waagerechte Scrollleiste
  {
    const { ctx, p } = await kind("vs", 390, 760);
    await p.goto(BASIS + "spiele/lesen/"); await p.waitForFunction(() => !!window.__lesen);
    erwarte(await p.evaluate(() => /Gleicher Anfang/.test(document.getElementById("start-blase").textContent)), "Vorschule: Fipsi empfiehlt „Gleicher Anfang“");
    erwarte(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Hochformat 390 px: keine waagerechte Scrollleiste");
    await bild(p, "lesen-hoch");
    await p.click("#weg-tafel");
    erwarte(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Tafel im Hochformat passt");
    await bild(p, "lesen-tafel-hoch");
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Lesen-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
