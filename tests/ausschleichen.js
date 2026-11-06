// Test NA-54 „Muttersprache dosiert (Ausschleichen)“ (10.11.2026): Eltern wählen bei der Hilfesprache „Immer zeigen“ | „Nur bei Neuem“ | „Nur auf Knopfdruck“
// (Empfehlung nach Deutschstand, Feld nur mit Hilfesprache). „Knopfdruck“: jede russische Zeile versteckt, davor ein Knopf „RU“ – echt angetippt zeigt er
// die Zeile und liest sie vor; neue Frage → wieder versteckt. „Neu“: beim ersten Besuch sichtbar, beim zweiten versteckt. Zeilen in Antwortknöpfen nur
// versteckt. „Immer“: wie bisher, kein RU-Knopf. Gerätestimme nachgebildet. Aufruf: sh tests/laufen.sh ausschleichen
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  async function kind(dosis, { breite = 1180, hoehe = 820, deutsch = "alltag" } = {}) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => {
      window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__gesprochen = [];
      window.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; this.lang = ""; } };
      Object.defineProperty(window, "speechSynthesis", { configurable: true, value: { speaking: false, pending: false, paused: false, getVoices: () => [{ name: "Milena", lang: "ru-RU", localService: true, default: true }],
        speak(u) { if (u.text.trim()) window.__gesprochen.push({ t: u.text, l: u.lang }); setTimeout(() => u.onend && u.onend(), 5); }, cancel() {}, resume() {}, addEventListener() {} } });
    });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "2"); await p.selectOption("#e-deutsch", deutsch);
    const vorher = await p.isVisible("#e-dosis");
    await p.selectOption("#e-sprache", "ru"); await p.waitForTimeout(100);
    const info = { vorher, nachher: await p.isVisible("#e-dosis"), text: await p.textContent("#e-dosis-text") };
    if (dosis) await p.selectOption("#e-dosis", dosis);
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    await p.evaluate(() => { Story.setzeKapitel(7); if (window.Zeit) for (let i = 0; i < 12; i++) Zeit.aufgabe(); });
    return { ctx, p, info };
  }
  const seite = async (p, pfad) => { await p.goto(BASIS + pfad); await p.waitForLoadState("load"); await p.waitForTimeout(700); };
  async function matheMitRu(p) { for (let n = 0; n < 12; n++) { await p.evaluate((n) => __mathe.starte(n), n); await p.waitForTimeout(500); if (await p.$(".hilfe-ru")) return true; } return false; }
  const zustand = (p, sel) => p.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; const b = e.previousElementSibling;
    return { zu: e.classList.contains("ru-zu"), sichtbar: !!(e.offsetParent || e.getClientRects().length), knopf: !!(b && b.classList.contains("ru-auf") && !b.hidden), text: e.textContent }; }, sel);

  // ---------- Nur auf Knopfdruck ----------
  {
    const { ctx, p, info } = await kind("knopf");
    erwarte(!info.vorher && info.nachher && /Alltags-Deutsch/.test(info.text) && /Nur bei Neuem/.test(info.text), "Elternbereich: Feld erst mit Hilfesprache, Empfehlung nach Deutschstand");
    erwarte(await p.evaluate(() => Spielwelt.kind().hilfedosis === "knopf" && Spielwelt.hilfeDosis() === "knopf"), "Einstellung gespeichert (hilfedosis = knopf)");
    await seite(p, "spiele/mathe/"); erwarte(await matheMitRu(p), "Matheweg: Aufgabe mit russischer Zeile gefunden");
    let z = await zustand(p, "#tafel .hilfe-ru, .hilfe-ru");
    erwarte(z && z.zu && !z.sichtbar && z.knopf, "Matheweg: russische Zeile versteckt, Knopf „RU“ davor");
    if (BILDER) await p.screenshot({ path: `${BILDER}/ausschleichen-knopf.png` });
    await p.evaluate(() => { window.__gesprochen = []; }); await p.click(".ru-auf:visible"); await p.waitForTimeout(200);
    z = await zustand(p, ".hilfe-ru"); const g = await p.evaluate(() => window.__gesprochen);
    erwarte(z && !z.zu && z.sichtbar && !z.knopf && g.length === 1 && g[0].l === "ru-RU" && g[0].t.trim() === z.text.trim(), "„RU“ angetippt: Zeile sichtbar und auf Russisch vorgelesen");
    erwarte(await p.evaluate(() => document.querySelectorAll(".hilfe-ru").length === new Set([...document.querySelectorAll(".hilfe-ru")].map(e => e.previousElementSibling && e.previousElementSibling.previousElementSibling)).size), "keine doppelten russischen Zeilen durch den Knopf");
    // nächste Aufgabe: wieder versteckt
    const a = await p.evaluate(() => { const x = __mathe.lauf.liste[__mathe.lauf.pos]; return { art: x.art, antwort: x.antwort }; });
    if (a.art === "wahl") await p.evaluate((w) => [...document.querySelectorAll(".wahl-tasten .taste")].find(b => b.dataset.wert === w).click(), a.antwort); else { for (const c of a.antwort) await p.click(`.taste[data-ziffer="${c}"]`); await p.click(".taste.ok"); }
    await p.waitForTimeout(1500);
    const neu = await p.evaluate(() => [...document.querySelectorAll(".hilfe-ru")].filter(e => e.getClientRects().length || e.classList.contains("ru-zu")).map(e => e.classList.contains("ru-zu")));
    erwarte(neu.length === 0 || neu.every(Boolean), "nächste Aufgabe: russische Zeilen wieder versteckt");
    // Forscherlager: Ellas Zeile versteckt; Funde im Tagebuch (in Knöpfen) nur versteckt
    await seite(p, "spiele/expedition/");
    z = await zustand(p, "#ella-text .ru");
    erwarte(z && z.zu && z.knopf, "Forscherlager: Ellas russische Zeile versteckt, mit „RU“-Knopf");
    await seite(p, "spiele/expedition/#tagebuch"); await p.reload(); await p.waitForTimeout(700);
    erwarte(await p.evaluate(() => { const l = [...document.querySelectorAll("#funde .ru")]; return l.length > 0 && l.every(e => e.classList.contains("ru-zu")) && !document.querySelector("#funde .ru-auf"); }), "Tagebuch: russische Zeilen in Fund-Knöpfen nur versteckt (kein Knopf im Knopf)");
    erwarte(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "keine Scrollleiste");
    await ctx.close();
  }
  // ---------- Nur bei Neuem ----------
  {
    const { ctx, p } = await kind("neu");
    await seite(p, "spiele/expedition/");
    let z = await zustand(p, "#ella-text .ru");
    erwarte(z && !z.zu && z.sichtbar && !z.knopf, "„Nur bei Neuem“: beim ersten Mal ist Ellas Zeile sichtbar");
    await seite(p, "spiele/expedition/");
    z = await zustand(p, "#ella-text .ru");
    erwarte(z && z.zu && z.knopf, "beim zweiten Besuch: dieselbe Zeile versteckt, mit „RU“-Knopf");
    await ctx.close();
  }
  // ---------- Immer (Standard) ----------
  {
    const { ctx, p } = await kind("", { deutsch: "keine" });
    erwarte(await p.evaluate(() => Spielwelt.hilfeDosis() === "immer"), "Standard: „Immer zeigen“");
    await seite(p, "spiele/expedition/");
    const z = await zustand(p, "#ella-text .ru");
    erwarte(z && !z.zu && z.sichtbar && !z.knopf && !(await p.$(".ru-auf")), "„Immer“: Zeile sichtbar, kein „RU“-Knopf");
    await ctx.close();
  }
  // ---------- Handy, Knopfdruck ----------
  {
    const { ctx, p } = await kind("knopf", { breite: 390, hoehe: 760 });
    await seite(p, "spiele/gefuehle/");
    erwarte(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1 && !!document.querySelector("#hilfe-karte .ru-auf")), "Handy: Gefühle mit „RU“-Knöpfen, keine Scrollleiste");
    if (BILDER) await p.screenshot({ path: `${BILDER}/ausschleichen-handy.png`, fullPage: true });
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Ausschleichen-Test (NA-54) bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
