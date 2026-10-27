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
    erwarte(true, "Fipsis Karte hat die Kachel „Lesen und Schreiben“");
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

    // NA-31 Silben lesen: Wort in Silbenbögen, kein Vorlesen bis zum ersten Fehler; Fehler → Lernkarte „silbenwort“
    erwarte(await p.evaluate(() => __lesen.silbenWoerter() >= 60), "genug Bildwörter für „Silben lesen“");
    await p.evaluate(() => __lesen.runde("silben")); await p.waitForTimeout(200);
    const sw = await p.evaluate(() => ({ silben: document.querySelectorAll(".silbenwort .sb").length, ton: document.getElementById("frage-ton").hidden, wort: Wortschatz.wort(__lesen.ziel().wort) }));
    erwarte(sw.silben === sw.wort.silben.length && sw.ton, `Silbenwort „${sw.wort.silben.join("-")}“ in ${sw.silben} Bögen, Vorlesen erst als Hilfe`);
    await bild(p, "lesen-silben");
    const nSilben = await p.evaluate(() => __lesen.anzahl());
    for (let i = 0; i < nSilben; i++) {
      await p.waitForFunction((k) => __lesen.aufgabeNr() === k, i);
      const r = await p.evaluate(() => __lesen.richtigIndex());
      if (i === 1) { await p.click(`#wahl [data-i="${(r + 1) % 3}"]`); await p.waitForTimeout(150);
        if (await p.evaluate(() => document.getElementById("frage-ton").hidden)) fehler.push("nach dem Fehler fehlt der Vorlese-Knopf"); }
      await p.click(`#wahl [data-i="${r}"]`); await p.waitForTimeout(1400);
    }
    await p.waitForSelector("#uebung-ende:not([hidden])");
    const lks = await p.evaluate(() => (Spielwelt.lade("lernkartei").lesen || []).filter(k => k.s.typ === "silbenwort").length);
    const ws = await p.evaluate(() => Object.keys(__lesen.stand().w).length);
    erwarte(lks === 1 && ws === nSilben - 1, `Silben: ${ws} Wörter gelesen, 1 Lernkarte „silbenwort“ (${lks})`);

    // NA-31 Lesetexte: Liste, Text mit Silbenbögen, Fragen; erste Frage zuerst falsch
    await p.evaluate(() => __lesen.texte()); await p.waitForTimeout(200);
    const liste = await p.evaluate(() => ({ n: document.querySelectorAll(".text-karte").length, erst: document.querySelector(".stufe-titel").textContent }));
    erwarte(liste.n === 20 && /Kurze/.test(liste.erst), `20 Lesetexte, Klasse 1 sieht zuerst die kurzen (${liste.n})`);
    await p.click('.text-karte[data-id="lt.05"]'); await p.waitForTimeout(200);
    const tx = await p.evaluate(() => ({ text: document.getElementById("text-text").textContent, boegen: document.querySelectorAll("#text-text .sb").length, farbig: !!document.querySelector("#text-text .farbig") }));
    erwarte(/^Im Nest sind drei Eier\./.test(tx.text) && tx.boegen > 15 && tx.farbig, `Text ohne Trennstriche, ${tx.boegen} Silbenbögen, farbig`);
    await bild(p, "lesen-text");
    for (let f = 0; f < 2; f++) {
      await p.waitForFunction((k) => __lesen.textFrageNr() === k, f);
      const r = await p.evaluate(() => __lesen.textRichtig());
      if (f === 0) { await p.click(`#text-wahl [data-i="${(r + 1) % 3}"]`); await p.waitForTimeout(150); }
      await p.click(`#text-wahl [data-i="${r}"]`); await p.waitForTimeout(1100);
    }
    await p.waitForSelector("#text-ende:not([hidden])");
    const tst = await p.evaluate(() => __lesen.stand().t["lt.05"]);
    erwarte(tst === 1, `Text „Das Nest“: 1 von 2 Fragen gleich richtig gespeichert (${tst})`);
    await p.click("#text-liste"); await p.waitForTimeout(200);
    await p.click("#silbenfarbe"); await p.waitForTimeout(200);
    await p.click('.text-karte[data-id="lt.11"]'); await p.waitForTimeout(200);
    erwarte(await p.evaluate(() => !document.querySelector("#text-text .farbig") && document.querySelectorAll("#text-text .sb").length > 20), "Silbenfarben abschaltbar, Bögen bleiben");

    // NA-35 Nachspuren: Finger (Maus) entlang der Striche führen; falscher Start zählt nicht
    await p.evaluate(() => __lesen.spurenRunde()); await p.waitForTimeout(300);
    const erstesZeichen = await p.evaluate(() => __lesen.spurZeichen());
    erwarte(erstesZeichen === "M", `Nachspuren beginnt mit „M“ (${erstesZeichen})`);
    await bild(p, "lesen-spuren");
    // falsch: irgendwo in der Mitte anfangen → nichts passiert
    const box = await p.evaluate(() => { const r = document.getElementById("spuren").getBoundingClientRect(); return [r.x + r.width * 0.9, r.y + r.height * 0.15]; });
    await p.mouse.move(box[0], box[1]); await p.mouse.down(); await p.mouse.move(box[0] - 5, box[1] + 40, { steps: 5 }); await p.mouse.up();
    erwarte(await p.evaluate(() => __lesen.spurNr() === 0 && __lesen.spurZeichen() === "M"), "Malen ohne den Startpunkt zählt nicht");
    for (let z = 0; z < 6; z++) {
      const zeichen = await p.evaluate(() => __lesen.spurZeichen());
      for (let s = 0; s < 8 && await p.evaluate((zz) => __lesen.spurZeichen() === zz && __lesen.spurNr() >= 0, zeichen); s++) {
        const punkte = await p.evaluate(() => __lesen.spurPunkte());
        if (!punkte.length) break;
        await p.mouse.move(punkte[0][0], punkte[0][1]); await p.mouse.down();
        for (const [x, y] of punkte.slice(1)) await p.mouse.move(x + 2, y - 1, { steps: 2 });
        await p.mouse.up(); await p.waitForTimeout(60);
      }
      await p.waitForTimeout(1150);
    }
    await p.waitForSelector("#spuren-ende:not([hidden])", { timeout: 5000 }).catch(() => fehler.push("Nachspuren: Runde nicht beendet"));
    const sp = await p.evaluate(() => __lesen.stand().sp || {});
    erwarte(sp.M === 1 && sp.A === 1 && sp.O === 1, `M m, A a, O o nachgespurt (${JSON.stringify(sp)})`);
    await bild(p, "lesen-spuren-ende");

    // NA-35 Wörter legen: Großbuchstabe am Anfang, zuerst ein falscher Stein
    const lw = await p.evaluate(() => __lesen.legeWoerter());
    erwarte(lw.length >= 25 && lw.every(w => !/(ie|ch|ck|ll|mm|nn|ss|tt|ah|eh|oh|uh)/i.test(w)), `${lw.length} lautgetreue Wörter zum Legen (z. B. ${lw.slice(0, 5).join(", ")})`);
    await p.evaluate(() => __lesen.legenRunde()); await p.waitForTimeout(300);
    for (let i = 0; i < 8; i++) {
      await p.waitForFunction((k) => __lesen.legenNr() === k, i);
      const ziel = await p.evaluate(() => __lesen.legenZiel());
      if (i === 0) {
        const klein = await p.evaluate((b) => __lesen.legenStein(b), ziel[0].toLowerCase());
        const falsch = await p.evaluate((w) => { const andere = [...document.querySelectorAll("#legen-steine .stein")].findIndex(b => !w.includes(b.textContent)); return andere; }, ziel);
        await p.click(`#legen-steine [data-i="${falsch}"]`); await p.waitForTimeout(100);
        if (klein >= 0) fehler.push("Wörter legen: kleiner Anfangsbuchstabe als Stein vorhanden");
      }
      for (const b of ziel) { const k = await p.evaluate((x) => __lesen.legenStein(x), b); await p.click(`#legen-steine [data-i="${k}"]`); await p.waitForTimeout(80); }
      if (i === 0) await bild(p, "lesen-legen");
      await p.waitForTimeout(1300);
    }
    await p.waitForSelector("#legen-ende:not([hidden])");
    const legenStand = await p.evaluate(() => ({ sw: Object.keys(__lesen.stand().sw || {}).length, k: (Spielwelt.lade("lernkartei").lesen || []).filter(k => k.s.typ === "schreibwort").length }));
    erwarte(legenStand.sw === 7 && legenStand.k === 1, `Wörter legen: 7 ohne Fehler, 1 Lernkarte „schreibwort“ (${JSON.stringify(legenStand)})`);
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
    await p.evaluate(() => __lesen.text("lt.14")); await p.waitForTimeout(200);
    erwarte(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Lesetext im Hochformat passt");
    await bild(p, "lesen-text-hoch");
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Lesen-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
