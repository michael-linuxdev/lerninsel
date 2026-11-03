// Test „Russische Hilfe in Mathe“ (05.11.2026): Mit Hilfesprache Russisch steht unter jeder Sprechblase der Erklär-Einheit und unter dem
// Denkfehler-Hinweis eine russische Zeile (Entwurf); ohne Hilfesprache keine. Echt durchgeklickt: Angebot, ▶, Punkte antippen, ergänzen, Robos Fehler,
// Bildergeschichte; danach zweimal derselbe Denkfehler (Übertrag) mit kurzer und langer Erklärung.
// Aufruf: sh tests/laufen.sh matheru
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const RU = /[а-яё]{3}/i;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  async function kind(sprache, breite = 1180, hoehe = 820) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__testOffen = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); if (sprache) await p.selectOption("#e-sprache", sprache);
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    await p.evaluate(() => { for (let i = 0; i < 12; i++) Zeit.aufgabe(); Spielwelt.speichere("mathe", { weg: "k2" }); });
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForTimeout(500);
    await p.evaluate(() => { window.__testSchnell = true; });
    return { ctx, p };
  }
  const ruUnter = (p, sel = "#satz") => p.evaluate((sel) => { const el = document.querySelector(sel), n = el && el.nextElementSibling; return n && n.classList.contains("hilfe-ru") ? n.textContent : ""; }, sel);
  const nr = (p, id) => p.evaluate((id) => Mathe.STATIONEN.findIndex(s => s.id === id), id);
  const tippe = async (p, zahl) => { for (const z of String(zahl)) await p.click(`.taste[data-ziffer="${z}"]`); await p.click('.taste[data-tun="ok"]'); };

  for (const [breite, hoehe, art] of [[1180, 820, "iPad quer"], [390, 760, "Handy"]]) {
    const { ctx, p } = await kind("ru", breite, hoehe);
    await p.evaluate((n) => __mathe.starte(n, true), await nr(p, "plusUeber")); await p.waitForTimeout(300);
    erwarte(RU.test(await ruUnter(p, "#angebot .frage")), `${art}: Angebot „Erst erklären?“ mit russischer Zeile`);
    await p.click("#erklaer-ja"); await p.waitForTimeout(250);
    const z1 = await ruUnter(p);
    erwarte(/38/.test(z1) && RU.test(z1), `${art}: A Schritt für Schritt – russische Zeile mit den Zahlen der Aufgabe („${z1}“)`);
    await bild(p, `matheru-zeigen-${art.replace(" ", "-")}`);
    for (let k = 0; k < 3; k++) { await p.click("#weiter"); await p.waitForTimeout(200); }
    erwarte(RU.test(await ruUnter(p)), `${art}: nach ▶ ▶ ▶ wechselt auch die russische Zeile`);
    await p.click("#weiter"); await p.waitForTimeout(250);
    erwarte(RU.test(await ruUnter(p)), `${art}: B Selbst machen mit russischer Zeile`);
    for (let k = 0; k < 5; k++) { await p.click("#machen-bild .wartet >> nth=0"); await p.waitForTimeout(150); }
    await p.waitForTimeout(400); await p.click("#weiter"); await p.waitForTimeout(250);
    await p.click('[data-e="53"]'); await p.waitForTimeout(250);
    if (await p.isVisible("#weiter")) { await p.click("#weiter"); await p.waitForTimeout(250); }
    erwarte(/Робо/.test(await ruUnter(p)), `${art}: Robos Fehler auf Russisch`);
    await p.click('[data-g="nein"]');
    await p.waitForTimeout(300);
    const warum = await ruUnter(p, "#warum-t");
    erwarte(RU.test(warum), `${art}: Begründung („warum“) auf Russisch`);
    await bild(p, `matheru-robo-${art.replace(" ", "-")}`);
    if (await p.isVisible("#weiter")) { await p.click("#weiter"); await p.waitForTimeout(250); }
    const gesch = await p.evaluate(() => [...document.querySelectorAll(".geschichte .hilfe-ru")].map(x => x.textContent));
    erwarte(gesch.length === 3 && gesch.every(t => RU.test(t)), `${art}: Bildergeschichte – alle drei Bilder mit russischer Zeile`);
    await bild(p, `matheru-geschichte-${art.replace(" ", "-")}`);
    // Denkfehler Übertrag: erst kurz, dann lang
    await p.click("#weiter"); await p.waitForTimeout(300);
    await p.evaluate(() => __mathe.setzeAufgabe({ text: "34 + 28", antwort: "62", art: "zahl", hilfe: "Erst die Zehner, dann die Einer." }));
    await tippe(p, 52); await p.waitForTimeout(300);
    erwarte(RU.test(await ruUnter(p, "#rueck")), `${art}: kurzer Denkfehler-Hinweis mit russischer Zeile`);
    await p.waitForTimeout(1300); await tippe(p, 62); await p.waitForTimeout(1200);
    await p.evaluate(() => __mathe.setzeAufgabe({ text: "45 + 37", antwort: "82", art: "zahl", hilfe: "Erst die Zehner, dann die Einer." }));
    await tippe(p, 72); await p.waitForTimeout(1000);
    const lang = await p.evaluate(() => [...document.querySelectorAll("#denkfehler .hilfe-ru")].map(x => x.textContent));
    erwarte(await p.isVisible("#denkfehler") && lang.length >= 4 && lang.every(t => RU.test(t)), `${art}: „Fast! Schau mal.“ und drei Sätze, alle mit russischer Zeile (${lang.length})`);
    await bild(p, `matheru-denkfehler-${art.replace(" ", "-")}`);
    const m = await p.evaluate(() => ({ w: document.documentElement.scrollWidth, iw: innerWidth }));
    erwarte(m.w <= m.iw + 1, `${art}: keine waagerechte Scrollleiste`);
    await ctx.close();
  }
  // Ohne Hilfesprache: keine russische Zeile
  { const { ctx, p } = await kind("");
    await p.evaluate((n) => __mathe.starte(n, true), await nr(p, "plusUeber")); await p.waitForTimeout(300);
    await p.click("#erklaer-ja"); await p.waitForTimeout(300);
    erwarte(await p.evaluate(() => !document.querySelector(".hilfe-ru")), "ohne Hilfesprache: keine russische Zeile");
    await ctx.close(); }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Mathe-Russisch-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
