// Playwright-Test (iPad-Meldung 08.11.2026): Gedrückthalten einer Kachel öffnete in Safari die Link-Vorschau mit „Öffnen, Zur Leseliste, Link kopieren, Teilen“.
// Geprüft wird: (1) shared/style.css schaltet das iOS-Menü für Links, Knöpfe und Bilder ab (-webkit-touch-callout: none; Chromium kennt die Eigenschaft nicht, darum als Text),
// (2) auf allen Seiten unterdrückt core.js das Kontextmenü (echter Rechtsklick auf Kacheln und Knöpfe) und das Ziehen von Links und Bildern,
// (3) Eingabefelder und der Texteditor in „Schreiben und Präsentieren“ behalten ihr Menü (Einfügen, Auswahl).
// Aufruf: sh tests/laufen.sh langdruck
const fs = require("fs");
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo/;
process.on("unhandledRejection", (e) => { console.log("❌ Abbruch: " + e.message + "\n  " + (global.__fehler || []).join("\n  ")); process.exit(1); });
const SEITEN = ["", "spiele/mathe/", "spiele/deutsch/", "spiele/sachkunde/", "spiele/englisch/", "spiele/praesentieren/", "spiele/album/", "spiele/ich/", "spiele/tier/",
  "spiele/vorschule/", "spiele/garten/", "spiele/schach/", "spiele/eltern/"];

(async () => {
  const fehler = global.__fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };

  // (1) CSS
  const css = fs.readFileSync(__dirname + "/../shared/style.css", "utf8");
  erwarte(/body\s*\{[^}]*-webkit-touch-callout:\s*none/.test(css), "style.css: body ohne iOS-Callout");
  erwarte(/^a, button, img, svg[^{]*\{[^}]*-webkit-touch-callout:\s*none[^}]*-webkit-user-drag:\s*none/m.test(css), "style.css: Links, Knöpfe, Bilder ohne Callout und ohne Ziehen");
  erwarte(/^input, textarea[^{]*\{[^}]*-webkit-touch-callout:\s*default[^}]*user-select:\s*text/m.test(css), "style.css: Eingabefelder behalten Menü und Auswahl");

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, serviceWorkers: "block" });
  await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__elternAlle = true; });
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`Seitenfehler: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`Konsole: ${m.text()}`); });
  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
  await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "vs"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(400);

  // (2a) echter Rechtsklick auf eine Kachel der Startseite: Menü unterdrückt, Seite bleibt
  await p.evaluate(() => { window.__kontext = []; addEventListener("contextmenu", e => window.__kontext.push(e.defaultPrevented), false); });
  await p.click(".tuer.mathe", { button: "right" }); await p.waitForTimeout(200);
  const k = await p.evaluate(() => window.__kontext);
  erwarte(k.length === 1 && k[0] === true && !/mathe/.test(p.url()), `Startseite: Rechtsklick auf die Mathe-Kachel öffnet kein Menü und keine Seite (${JSON.stringify(k)})`);

  // (2b) alle Seiten: Kontextmenü und Ziehen auf Links, Knöpfen und Bildern unterdrückt
  for (const s of SEITEN) {
    await p.goto(BASIS + s); await p.waitForLoadState("load"); await p.waitForTimeout(600);
    const r = await p.evaluate(() => {
      const da = (e) => e.getClientRects().length && getComputedStyle(e).visibility !== "hidden" && !e.closest("input, textarea, select, [contenteditable]");
      const ziele = [...document.querySelectorAll("a, button, .tuer, .knopf, img, .emo")].filter(da).slice(0, 25);
      const offen = ziele.filter(e => e.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true }))).map(e => e.id || e.className || e.tagName);
      const links = [...document.querySelectorAll("a[href], img")].filter(da).slice(0, 10);
      const ziehen = links.filter(e => e.dispatchEvent(new DragEvent("dragstart", { bubbles: true, cancelable: true }))).map(e => e.id || e.className || e.tagName);
      return { n: ziele.length, offen, l: links.length, ziehen };
    });
    erwarte(r.n > 0 && !r.offen.length && !r.ziehen.length, `${s || "Startseite"}: ${r.n} Knöpfe/Kacheln ohne Menü, ${r.l} Links/Bilder nicht ziehbar${r.offen.length ? " – Menü offen: " + r.offen.join(", ") : ""}${r.ziehen.length ? " – ziehbar: " + r.ziehen.join(", ") : ""}`);
  }

  // (3) Eingaben behalten das Menü: Texteditor in „Schreiben und Präsentieren“, Namensfeld im Elternbereich
  await p.goto(BASIS + "spiele/praesentieren/"); await p.waitForTimeout(600);
  await p.click("#g-editor"); await p.keyboard.type("Einladung zum Fest");
  await p.evaluate(() => { window.__kontext = []; addEventListener("contextmenu", e => window.__kontext.push(e.defaultPrevented), false); });
  await p.click("#g-editor", { button: "right" }); await p.waitForTimeout(150);
  const ed = await p.evaluate(() => ({ k: window.__kontext, text: document.getElementById("g-editor").textContent }));
  erwarte(ed.k.length === 1 && ed.k[0] === false && /Einladung/.test(ed.text), `Präsentieren: im Texteditor bleibt das Menü (Einfügen, Auswahl) erlaubt (${JSON.stringify(ed.k)})`);
  await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(800);
  const feld = await p.evaluate(() => { const f = document.querySelector("input[type=text], input:not([type]), textarea"); return f ? f.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true })) : null; });
  erwarte(feld === true, "Elternbereich: Eingabefeld behält das Menü");

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n  - " + fehler.join("\n  - ")); process.exit(1); }
  console.log("✅ Langdruck-Test bestanden.");
})();
