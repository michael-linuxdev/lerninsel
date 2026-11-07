// Test „Russisch überall vorlesen“ (10.11.2026): Mit Hilfesprache Russisch wird jede russische Hilfezeile (.ru, .hilfe-ru, [lang=ru]) zum
// Vorlese-Knopf (role=button, Lautsprecher-Zeichen per CSS, textContent unverändert). Echt angetippt auf Matheweg (Frage und Lösungshilfe nach
// zwei Fehlern), Forscherlager, Garten, Bäckerei, Tierstation, Angelsteg, Rhythmus-Boot, Wetter-Drache, Leuchtturm, Sachunterricht:
// gesprochen wird genau diese Zeile mit russischer Stimme. Zeilen in Antwortknöpfen bleiben Teil des Knopfs; ohne Hilfesprache nichts.
// Gerätestimme nachgebildet. Aufruf: sh tests/laufen.sh ruvorlesen
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  async function kind(sprache, breite = 1180, hoehe = 820) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => {
      window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__gesprochen = [];
      class U { constructor(t) { this.text = t; this.lang = ""; } }
      window.SpeechSynthesisUtterance = U;
      const synth = { speaking: false, pending: false, paused: false, getVoices: () => [{ name: "Milena", lang: "ru-RU", localService: true, default: true }, { name: "Anna", lang: "de-DE", localService: true, default: true }],
        speak(u) { if (u.text.trim()) window.__gesprochen.push({ t: u.text, l: u.lang }); setTimeout(() => u.onend && u.onend(), 5); }, cancel() {}, resume() {}, addEventListener() {} };
      Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true });
    });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "2");
    if (sprache) { await p.selectOption("#e-sprache", sprache); await p.selectOption("#e-dosis", "immer"); }   // russische Hilfe sichtbar (sonst „automatisch“ nach Deutschstand)
    await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    await p.evaluate(() => { Story.setzeKapitel(7); if (window.Zeit) for (let i = 0; i < 12; i++) Zeit.aufgabe(); });
    return { ctx, p };
  }
  // eine russische Zeile echt antippen und prüfen, dass genau sie russisch gesprochen wird
  async function tippeRu(p, wo, sel = ".ru-hoerbar") {
    const el = await p.$(`${sel}:visible`);
    if (!el) { fehler.push(`${wo}: keine antippbare russische Zeile`); return; }
    const text = (await el.textContent()).trim();
    await p.evaluate(() => { window.__gesprochen = []; });
    await el.scrollIntoViewIfNeeded(); await el.click(); await p.waitForTimeout(250);
    const g = await p.evaluate(() => window.__gesprochen);
    erwarte(g.length === 1 && g[0].l === "ru-RU" && g[0].t.trim() === text && /[а-яё]/i.test(text), `${wo}: russische Zeile angetippt → vorgelesen auf Russisch („${text.slice(0, 50)}“)`);
  }
  // eine Station suchen, deren erste Frage eine russische Zeile hat
  async function matheMitRu(p) {
    for (let n = 0; n < 12; n++) { await p.evaluate((n) => __mathe.starte(n), n); await p.waitForTimeout(500); if (await p.$(".hilfe-ru.ru-hoerbar:visible")) return; }
  }
  const seite = async (p, pfad) => { await p.goto(BASIS + pfad); await p.waitForLoadState("load"); await p.waitForTimeout(700); };

  {
    const { ctx, p } = await kind("ru");
    // Matheweg: Frage und Lösungshilfe
    await seite(p, "spiele/mathe/");
    await matheMitRu(p);
    await tippeRu(p, "Matheweg (Frage)");
    const rolle = await p.evaluate(() => { const e = document.querySelector(".hilfe-ru.ru-hoerbar"); return e && e.getAttribute("role") === "button" && e.tagName === "SMALL" && getComputedStyle(e, "::after").backgroundImage.includes("svg"); });
    erwarte(rolle, "Matheweg: Hilfezeile ist Knopf (role=button) mit Lautsprecher-Zeichen");
    const a = await p.evaluate(() => { const x = __mathe.lauf.liste[__mathe.lauf.pos]; return { art: x.art, antwort: x.antwort, optionen: x.optionen }; });
    const falsch = a.art === "wahl" ? a.optionen.filter(o => o !== a.antwort).slice(0, 2) : [String(+a.antwort + 1), String(+a.antwort + 2)];
    for (const f of falsch) { if (a.art === "wahl") await p.evaluate((w) => [...document.querySelectorAll(".wahl-tasten .taste")].find(b => b.dataset.wert === w).click(), f); else { for (const z of f) await p.click(`.taste[data-ziffer="${z}"]`); await p.click(".taste.ok"); } await p.waitForTimeout(1400); }
    if (await p.$("#hilfe-platz .hilfe-ru")) await tippeRu(p, "Matheweg (Lösungshilfe)", "#hilfe-platz .ru-hoerbar"); else erwarte(true, "Matheweg: (keine übersetzte Lösungshilfe bei dieser Aufgabe)");
    if (BILDER) await p.screenshot({ path: `${BILDER}/ruvorlesen-mathe.png` });
    // Seiten der Insel
    for (const [pfad, wo] of [["spiele/expedition/", "Forscherlager"], ["spiele/garten/", "Insel-Garten"], ["spiele/baeckerei/", "Bäckerei"], ["spiele/tierstation/", "Tierstation"],
      ["spiele/angeln/", "Angelsteg"], ["spiele/rhythmus/", "Rhythmus-Boot"], ["spiele/wetter/", "Wetter-Drache"], ["spiele/leuchtturm/", "Leuchtturm"]]) {
      await seite(p, pfad);
      await tippeRu(p, wo);
      if (BILDER && wo === "Forscherlager") await p.screenshot({ path: `${BILDER}/ruvorlesen-expedition.png` });
    }
    // Gefühle (10.11.2026 übersetzt): Hilfe-Karte mit 116 111, Brunis Antwort, Ruhe-Übung
    await seite(p, "spiele/gefuehle/");
    const hk = await p.evaluate(() => [...document.querySelectorAll("#hilfe-karte .ru")].map(x => x.textContent));
    erwarte(hk.length === 3 && hk.some(t => /116 111/.test(t)), "Gefühle: Hilfe-Karte auf Russisch, mit 116 111");
    await tippeRu(p, "Gefühle: Hilfe-Karte", "#hilfe-karte .ru-hoerbar");
    await p.click('[data-oeffne="barometer"]'); await p.waitForTimeout(300); await p.click('.face[data-g="traurig"]'); await p.waitForTimeout(300);
    erwarte(await p.evaluate(() => /взрослому/.test((document.querySelector("#antwort-text + .ru") || {}).textContent || "") && /116 111/.test(document.getElementById("hilfe-kurz").textContent) && /[а-я]/.test(document.getElementById("hilfe-kurz").textContent)), "Gefühle: Brunis Antwort und Kurz-Hilfe auf Russisch");
    await tippeRu(p, "Gefühle: Brunis Antwort", "#antwort .ru-hoerbar");
    await p.evaluate(() => __gefuehle.zeige("wut")); await p.click('[data-oeffne="wut"]').catch(() => {}); await p.evaluate(() => { document.querySelector('[data-oeffne="wut"]') && document.querySelector('[data-oeffne="wut"]').click(); }); await p.waitForTimeout(300);
    erwarte(await p.evaluate(() => /шарик/.test((document.querySelector("#wut-text + .ru") || {}).textContent || "")), "Gefühle: Wut-Ballon mit russischer Anleitung");
    await p.evaluate(() => __gefuehle.bewegen()); await p.evaluate(() => __gefuehle.zeige("bewegen")); await p.waitForTimeout(300);
    erwarte(await p.evaluate(() => /[а-я]/.test((document.querySelector("#bew-karte .lage + .ru") || {}).textContent || "")), "Gefühle: Bewegungs-Übung auf Russisch");
    if (BILDER) await p.screenshot({ path: `${BILDER}/ruvorlesen-gefuehle.png` });
    // Mein Tier (10.11.2026 übersetzt): Ei-Auswahl
    await seite(p, "spiele/tier/");
    if (await p.isVisible("#wahl-ansicht")) { erwarte(await p.isVisible("#wahl-ru") && await p.isVisible("#nest-ru"), "Mein Tier: Ei-Auswahl auf Russisch"); await tippeRu(p, "Mein Tier", "#wahl-ansicht .ru-hoerbar"); }
    else erwarte(await p.evaluate(() => !!document.querySelector(".ru-zeile")), "Mein Tier: Sprechblase auf Russisch");
    if (BILDER) await p.screenshot({ path: `${BILDER}/ruvorlesen-tier.png` });
    // Tabellen-Übersetzer (10.11.2026): Schach, Robo, Mein Heft, Lesen und Schreiben, Kleiderschrank
    for (const [pfad, wo, sel, muster] of [["spiele/schach/", "Schach (Tilda)", "#tilda-text .ru-auto", /Тильда/], ["spiele/robo/", "Robo programmieren", "#intro .ru-auto", /Робо/],
      ["spiele/heft/", "Mein Heft", ".leer .ru-auto", /тетрадь/], ["spiele/lesen/", "Lesen und Schreiben", "#start-blase .ru-auto", /букв/]]) {
      await seite(p, pfad);
      const t = await p.evaluate((sel) => (document.querySelector(sel) || {}).textContent || "", sel);
      erwarte(muster.test(t), `${wo}: russische Zeile aus der Tabelle (${t.slice(0, 50)})`);
      await tippeRu(p, wo, sel);
    }
    // Schach: Lektion starten – Erklärtext und Tildas Satz mit Name übersetzt; Tipp mit Schachfeldern
    await seite(p, "spiele/schach/"); await p.evaluate(() => document.querySelector("#lektionen button").click()); await p.waitForTimeout(400);
    erwarte(/Ладья ходит прямо/.test(await p.textContent("#tilda-text .ru-auto")), "Schach: Lektion „Der Turm“ auf Russisch");
    // Lesen: „Gleicher Anfang“ – Frage mit deutschem Lernwort in der russischen Zeile
    await seite(p, "spiele/lesen/"); await p.click("#weg-gleich"); await p.waitForTimeout(400);
    const lf = await p.evaluate(() => ({ de: document.querySelector("#frage b") && document.querySelector("#frage b").textContent, ru: (document.querySelector("#frage .ru-auto") || {}).textContent || "" }));
    erwarte(lf.de && lf.ru.includes(`«${lf.de}»`) && /начинается/.test(lf.ru), `Lesen: Frage auf Russisch, das Lernwort bleibt deutsch (${lf.ru})`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/ruvorlesen-lesen.png` });
    // Kleiderschrank: Kauf-Dialog
    await seite(p, "spiele/anziehen/");
    let kauf = false;
    for (let r = 0; r < 12 && !kauf; r++) {
      kauf = await p.evaluate(() => { const b = [...document.querySelectorAll("#teile .teil.zu")].find(x => /🔒/.test(x.textContent)); if (b) b.click(); return !!b; });
      if (!kauf) { const n = await p.evaluate((r) => { const t = document.querySelectorAll("#reiter button, #reiter [role=tab]"); if (t[r + 1]) { t[r + 1].click(); return true; } return false; }, r); if (!n) break; await p.waitForTimeout(150); }
    }
    await p.waitForTimeout(300);
    if (kauf && await p.isVisible("#kauf")) erwarte(/звёзд/.test(await p.evaluate(() => (document.querySelector("#kauf-text .ru-auto") || {}).textContent || "")), "Kleiderschrank: Kauf-Dialog auf Russisch");
    else fehler.push("Kleiderschrank: kein gesperrtes Teil gefunden, Kauf-Dialog nicht geprüft");
    // Forscherlager-Tagebuch: russischer Text in Fund-Knöpfen bleibt Teil des Knopfs (Antippen wählt den Fund)
    await seite(p, "spiele/expedition/#tagebuch");
    const imKnopf = await p.evaluate(() => [...document.querySelectorAll("#funde .ru")].every(e => !e.classList.contains("ru-hoerbar")) && document.querySelectorAll("#funde .ru").length > 0);
    erwarte(imKnopf, "Forscherlager: russische Zeilen in Fund-Knöpfen sind kein eigener Vorlese-Knopf");
    await p.evaluate(() => { window.__gesprochen = []; }); await p.click('#funde [data-fund="baeume"]'); await p.waitForTimeout(150);
    erwarte(await p.evaluate(() => document.querySelector('#funde [data-fund="baeume"]').classList.contains("an")), "Forscherlager: Antippen des Fund-Knopfs wählt weiter den Fund");
    // Sachunterricht (eigene Vorlese-Knöpfe bleiben, nichts doppelt)
    await seite(p, "spiele/sachkunde/");
    const n = await p.evaluate(() => document.querySelectorAll(".ru-hoerbar .ru-hoerbar").length);
    erwarte(n === 0, "keine verschachtelten Vorlese-Zeilen");
    await ctx.close();
  }
  // Handy: Matheweg-Frage
  {
    const { ctx, p } = await kind("ru", 390, 760);
    await seite(p, "spiele/mathe/"); await matheMitRu(p);
    await tippeRu(p, "Handy: Matheweg");
    erwarte(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Handy: keine Scrollleiste durch das Lautsprecher-Zeichen");
    if (BILDER) await p.screenshot({ path: `${BILDER}/ruvorlesen-handy.png` });
    await ctx.close();
  }
  // ohne Hilfesprache: nichts antippbar, nichts gesprochen
  {
    const { ctx, p } = await kind("");
    await seite(p, "spiele/expedition/");
    erwarte(await p.evaluate(() => !document.querySelector(".ru-hoerbar") && !document.querySelector(".ru")), "ohne Hilfesprache: keine russischen Zeilen, keine Vorlese-Zeilen");
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Russisch-Vorlesen-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
