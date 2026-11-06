// Test „Schriftlich mal mehrstellig“ (06.11.2026, Kl. 4, Station k4malmehr) – echt durchgeklickt:
// - neue Station: Angebot „Erst erklären?“, Erklär-Einheit bis zum Ende (▶, erste Zeile 468 selbst bauen, 312 · 2 ergänzen, Robos Fehler
//   „nicht eingerückt“, Bildergeschichte), dann die Runde
// - 234 · 26 falsch → „Zeig mir deinen Weg“ in Zeilen: 234 · 2 (erst mit Null → freundlicher Hinweis), 234 · 6, dann 4680 + 1404 (erst 1872 → Denkfehler
//   „Zeilen nicht eingerückt“), Ende „Dein Fehler lag beim Zusammenzählen“; Denkfehler zählt im Elternbereich
// - mit Hilfesprache Russisch: russische Zeilen unter der Erklärung und den Hinweisen; Handy ohne Querscrollen
// Aufruf: sh tests/laufen.sh malmehr
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  for (const [breite, hoehe, art, sprache] of [[1180, 820, "iPad quer", ""], [390, 760, "Handy, Russisch", "ru"]]) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__testOffen = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "4"); if (sprache) { await p.selectOption("#e-sprache", sprache); await p.selectOption("#e-dosis", "immer"); }   // russische Hilfe sichtbar (sonst „automatisch“ nach Deutschstand)
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    await p.evaluate(() => { for (let i = 0; i < 12; i++) Zeit.aufgabe(); Spielwelt.speichere("mathe", { weg: "k4" }); });
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForTimeout(500);
    await p.evaluate(() => { window.__testSchnell = true; });
    const weiter = async () => { await p.click("#weiter"); await p.waitForTimeout(220); };
    const tippe = async (zahl) => { for (const z of String(zahl)) await p.click(`.taste[data-ziffer="${z}"]`); await p.click('.taste[data-tun="ok"]'); };
    const satz = () => p.evaluate(() => (document.getElementById("satz") || {}).textContent || "");
    const ruZeilen = () => p.evaluate(() => [...document.querySelectorAll(".hilfe-ru")].map(x => x.textContent));

    // ---------- Erklären ----------
    await p.evaluate(() => __mathe.starte(Mathe.STATIONEN_K4.findIndex(s => s.id === "k4malmehr"), true)); await p.waitForTimeout(300);
    erwarte(await p.isVisible("#erklaer-ja"), `${art}: neue Station „Schriftlich mal mehrstellig“ bietet die Erklärung an`);
    await p.click("#erklaer-ja"); await p.waitForTimeout(250);
    erwarte(/234 · 2 = 468/.test(await satz()) && await p.evaluate(() => !!document.querySelector(".erklaer-bild svg")), `${art}: A – erst die Zeile mit der 2: 234 · 2 = 468, mit Bild`);
    if (sprache) erwarte((await ruZeilen()).some(t => /Сначала умножаем/.test(t)), `${art}: russische Zeile unter Bennos Satz`);
    await bild(p, `malmehr-zeigen-${sprache || "de"}`);
    for (let k = 0; k < 3; k++) { await p.click("#weiter"); await p.waitForTimeout(150); }
    erwarte(/4680 \+ 1404 = 6084/.test(await satz()), `${art}: letzter Satz – zusammenzählen 4680 + 1404 = 6084`);
    await bild(p, `malmehr-summe-${sprache || "de"}`);
    await weiter();
    // B: erste Zeile 468 bauen
    for (const [i, n] of [[0, 4], [1, 6], [2, 8]]) for (let k = 0; k < n; k++) { await p.click(`.taste.bauen[data-s="${i}"]`); await p.waitForTimeout(60); }
    await p.waitForTimeout(300);
    erwarte(await p.isVisible("#weiter"), `${art}: B – 468 aus Hundertern, Zehnern und Einern gebaut`);
    await weiter();
    await p.click('[data-e="634"]'); await p.waitForTimeout(150);
    erwarte(!(await p.isVisible("#weiter")), `${art}: Ergänzen – 634 ist falsch, noch kein Weiter`);
    await p.click('[data-e="624"]'); await p.waitForTimeout(250);
    if (await p.isVisible("#weiter")) await weiter();
    erwarte(/1872/.test(await p.evaluate(() => document.getElementById("tafel").textContent)), `${art}: Robo rechnet 234 · 26 = 1872`);
    await p.click('[data-g="nein"]'); await p.waitForTimeout(200);
    erwarte(/nicht eingerückt/.test(await p.evaluate(() => document.getElementById("warum-t").textContent)) && await p.evaluate(() => !!document.querySelector("#warum svg")), `${art}: Robos Fehler mit Bild erklärt`);
    await bild(p, `malmehr-robo-${sprache || "de"}`);
    await weiter();
    erwarte(await p.evaluate(() => document.querySelectorAll(".geschichte > div").length === 3), `${art}: C – Bildergeschichte mit drei Bildern`);
    await weiter();
    erwarte(await p.evaluate(() => __mathe.lauf && __mathe.lauf.station.id === "k4malmehr" && (Spielwelt.lade("mathe").erklaert || {}).k4malmehr === 1), `${art}: Erklärung gemerkt, Runde startet`);

    // ---------- Zeilen-Weg ----------
    await p.evaluate(() => __mathe.setzeAufgabe({ text: "234 · 26", antwort: "6084", art: "zahl", frage: "Rechne schriftlich.", hilfe: "…", max: 7 }));
    await tippe(6000); await p.waitForTimeout(900);
    const start = await p.evaluate(() => ({ t: document.getElementById("tafel").textContent, a: document.getElementById("ausdruck").textContent }));
    erwarte(/Für jede Zahl unten eine Zeile/.test(start.t) && /234 · 2 =/.test(start.a), `${art}: falsch → Zeig mir deinen Weg: erste Zeile 234 · 2`);
    await tippe(4680); await p.waitForTimeout(250);
    erwarte(/nur 468/.test(await p.textContent("#rueck")), `${art}: 4680 eingetippt → „Schreib nur 468“`);
    if (sprache) { await p.waitForTimeout(200); erwarte((await ruZeilen()).some(t => /Напиши только 468/.test(t)), `${art}: Hinweis auch auf Russisch`); }
    await p.waitForTimeout(700); await tippe(468); await p.waitForTimeout(250);
    erwarte(/234 · 6 =/.test(await p.textContent("#ausdruck")) && /234 · 2 = 468/.test(await p.textContent(".weg-liste")), `${art}: richtig ✓, nächste Zeile 234 · 6`);
    await tippe(1404); await p.waitForTimeout(250);
    erwarte(/4680 \+ 1404 =/.test(await p.textContent("#ausdruck")), `${art}: dann zusammenzählen: 4680 + 1404`);
    await bild(p, `malmehr-weg-${sprache || "de"}`);
    await tippe(1872); await p.waitForTimeout(250);
    erwarte(/eingerückt/.test(await p.textContent("#rueck")), `${art}: 1872 → „Die Zeilen sind eingerückt“`);
    await p.waitForTimeout(700); await tippe(6084); await p.waitForTimeout(300);
    erwarte(/beim Zusammenzählen/.test(await p.textContent("#weg-ende")) && /einen Platz/.test(await p.textContent("#weg-ende")), `${art}: Ende – „Dein Fehler lag beim Zusammenzählen“ mit kurzem Satz`);
    erwarte(await p.evaluate(() => !!(Spielwelt.lade("mathe").fv || {}).verrueckt), `${art}: Denkfehler „nicht eingerückt“ für den Elternbereich gemerkt`);
    const m = await p.evaluate(() => ({ w: document.documentElement.scrollWidth, iw: innerWidth }));
    erwarte(m.w <= m.iw + 1, `${art}: keine waagerechte Scrollleiste`);
    await bild(p, `malmehr-ende-${sprache || "de"}`);
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Mal-mehrstellig-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
