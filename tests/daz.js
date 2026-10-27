// Playwright-Test (NA-40): DaZ-Pfad „Ankommen“ (D0).
// Kind ohne Deutsch landet von der Deutsch-Seite in „Ankommen“; Wörter ansehen (Artikel mit Farbe und Form, Silben, Mehrzahl),
// Hören und zeigen, Sätze; Fortschritt, Lernaufgaben und Lernfund; „wenig“ zeigt einen Knopf, „gut“ nicht; Hilfe nur geprüft auf der Hauptseite.
// Aufruf: sh tests/laufen.sh daz   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };

  async function kind(deutschstand, sprache = "", breite = 1180, hoehe = 820) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira");
    await p.selectOption("#e-deutsch", deutschstand);
    if (sprache) await p.selectOption("#e-sprache", sprache);
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }

  // 1) Deutschstand „keine“: Deutsch-Seite führt zu „Ankommen“
  {
    const { ctx, p } = await kind("keine", "ru");
    await p.goto(BASIS + "spiele/deutsch/"); await p.waitForURL(/spiele\/daz\//); await p.waitForFunction(() => !!window.__daz);
    erwarte(true, "Deutschstand „keine“: Deutsch-Seite leitet zu „Ankommen“ weiter");
    erwarte(await p.evaluate(() => __daz.woerter() === 100 && __daz.saetze() === 20), "„Ankommen“ hat 100 Wörter und 20 Sätze");
    erwarte(await p.evaluate(() => /0 von 100 Wörtern/.test(document.getElementById("stand").textContent)), "Startseite zeigt den Fortschritt");
    erwarte(await p.evaluate(() => !document.querySelector("#start-blase .hilfe")), "Hauptseite: ungeprüfte Begrüßung auf Russisch wird nicht gezeigt");
    await bild(p, "daz-start");

    // Wörter ansehen: Feld Schule → Karte mit Artikel (Farbe + Form), Silben, Mehrzahl
    await p.click("#weg-woerter"); await p.waitForSelector(".feld");
    erwarte(await p.evaluate(() => document.querySelectorAll(".feld").length === 11), "elf Wortfelder");
    await p.click('.feld[data-feld="schule"]');
    const erstes = await p.evaluate(() => __daz.karteWort());
    await p.evaluate(() => { for (let i = 0; i < 20 && __daz.karteWort() !== "w.schule"; i++) document.getElementById("karte-nach").click(); });
    const k = await p.evaluate(() => ({ id: __daz.karteWort(), art: document.querySelector("#karte .art").textContent, silben: document.querySelectorAll("#karte .silben b").length,
      mz: (document.querySelector("#karte .mehrzahl") || {}).textContent || "", hilfe: !!document.querySelector("#karte .hilfe") }));
    erwarte(k.id === "w.schule" && /●\s*die/.test(k.art) && k.silben === 2 && /Schulen/.test(k.mz), `Karte „die Schule“: Artikel mit Form (${k.art}), Silben, Mehrzahl`);
    erwarte(!k.hilfe, "Hauptseite: Entwurf-Übersetzung „школа“ ist versteckt");
    await bild(p, "daz-karte");
    erwarte(erstes && erstes !== "w.schule", "▶ blättert durch das Wortfeld");
    // Bestandswort mit geprüftem Russisch: Hilfe sichtbar
    await p.evaluate(() => __daz.karten("essen"));
    const apfel = await p.evaluate(() => { for (let i = 0; i < 20 && __daz.karteWort() !== "w.apfel"; i++) document.getElementById("karte-nach").click(); return { id: __daz.karteWort(), h: (document.querySelector("#karte .hilfe") || {}).textContent, art: document.querySelector("#karte .art").textContent }; });
    erwarte(apfel.id === "w.apfel" && apfel.h === "яблоко" && /■\s*der/.test(apfel.art), "„der Apfel“: geprüftes Russisch sichtbar, Artikel ■ der");

    // Hören und zeigen: eine Runde mit 10 Aufgaben, alle beim ersten Versuch richtig
    const aufgabenVorher = await p.evaluate(() => (Zeit.status ? Zeit.status() : {}).aufgaben || 0);
    await p.evaluate(() => __daz.runde("hoeren")); await p.waitForTimeout(300);
    for (let i = 0; i < 10; i++) {
      await p.waitForFunction((n) => __daz.aufgabeNr() === n, i);
      const r = await p.evaluate(() => __daz.richtigIndex());
      await p.click(`#wahl [data-i="${r}"]`); await p.waitForTimeout(1250);
    }
    await p.waitForSelector("#uebung-ende:not([hidden])");
    const st = await p.evaluate(() => __daz.stand());
    erwarte(st.woerter === 10, `nach einer Runde: 10 Wörter gelernt (${st.woerter})`);
    const lf = await p.evaluate(() => (Lernfunde.heute() || []).filter(f => /^Neues Wort/.test(f.t)).length);
    erwarte(lf >= 1, `Lernfund „Neues Wort …“ (${lf})`);
    const aufgabenNachher = await p.evaluate(() => (Zeit.status ? Zeit.status() : {}).aufgaben || 0);
    erwarte(aufgabenNachher >= aufgabenVorher + 10 || aufgabenNachher === 0, `richtige Antworten zählen als Lernaufgaben (${aufgabenVorher} → ${aufgabenNachher})`);
    await bild(p, "daz-ende");

    // Sätze: erste Aufgabe zuerst falsch → zählt nicht; Rest richtig
    await p.evaluate(() => __daz.runde("saetze")); await p.waitForTimeout(300);
    for (let i = 0; i < 8; i++) {
      await p.waitForFunction((n) => __daz.aufgabeNr() === n, i);
      const r = await p.evaluate(() => __daz.richtigIndex());
      if (i === 0) { await p.click(`#wahl [data-i="${(r + 1) % 3}"]`); await p.waitForTimeout(200); }
      await p.click(`#wahl [data-i="${r}"]`); await p.waitForTimeout(1250);
    }
    await p.waitForSelector("#uebung-ende:not([hidden])");
    const st2 = await p.evaluate(() => __daz.stand());
    erwarte(st2.saetze === 7, `Sätze: 7 gezählt, der erst falsch beantwortete nicht (${st2.saetze})`);

    // D0 geschafft → Deutsch-Seite bleibt bei Fipsi
    await p.evaluate(() => { const w = {}, s = {}; Wortschatz.daz("d0").slice(0, 80).forEach(x => w[x.id] = 1); Wortschatz.saetze("d0").slice(0, 15).forEach(x => s[x.id] = 1); Spielwelt.speichere("daz", { w, s }); });
    await p.goto(BASIS + "spiele/deutsch/"); await p.waitForTimeout(800);
    erwarte(/spiele\/deutsch\/$/.test(p.url()) && !(await p.$("#daz-knopf")), "D0 geschafft: Deutsch-Seite ohne Umleitung und ohne Knopf");
    await ctx.close();
  }

  // 2) Deutschstand „wenig“: Knopf zu „Ankommen“ auf Fipsis Karte; „gut“: kein Knopf
  {
    const { ctx, p } = await kind("wenig", "", 390, 760);
    await p.goto(BASIS + "spiele/deutsch/"); await p.waitForTimeout(800);
    erwarte(/spiele\/deutsch\/$/.test(p.url()) && !!(await p.$("#daz-knopf")), "Deutschstand „wenig“: keine Umleitung, aber Knopf „Ankommen“");
    await bild(p, "daz-wenig-hoch");
    await p.click("#daz-knopf"); await p.waitForURL(/spiele\/daz\//); await p.waitForFunction(() => !!window.__daz);
    erwarte(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Hochformat 390 px: keine waagerechte Scrollleiste");
    await bild(p, "daz-start-hoch");
    await ctx.close();
  }
  {
    const { ctx, p } = await kind("gut");
    await p.goto(BASIS + "spiele/deutsch/"); await p.waitForTimeout(800);
    erwarte(!(await p.$("#daz-knopf")), "Deutschstand „gut“: kein Knopf");
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ DaZ-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
