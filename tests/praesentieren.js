// Test „Schreiben und Präsentieren“ (30.10.2026): Text gestalten (Überschrift, fett, markiert, Größe, Absätze – echt getippt und über die
// Knöpfe formatiert, ins Heft), Rechtschreibprüfung (Beispieltext: Fehler rot, Vorschläge antippen bis „keine roten Wörter“, Name blau),
// Präsentation (zwei Folien, Vortrag bis zum Applaus), Podcast (Aufnahme mit Fake-Mikrofon), Wiki (Seite mit Link anlegen und folgen).
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--autoplay-policy=no-user-gesture-required"] });
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const passt = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  async function kind(stufe, breite = 1180, hoehe = 820) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    p.on("dialog", d => d.accept("Winterschlaf"));
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  for (const [breite, hoehe, art] of [[1180, 820, "quer"], [390, 760, "Handy"]]) {
    const { ctx, p } = await kind("4", breite, hoehe);
    await p.evaluate(() => { const e = Spielwelt.lade("eltern") || {}; e.deutsch = Object.assign({}, e.deutsch, { aufnehmen: true }); Spielwelt.speichere("eltern", e); });
    await p.goto(BASIS + "spiele/deutsch/"); await p.waitForTimeout(400);
    await p.click("#praesentieren-link"); await p.waitForURL(/praesentieren/); await p.waitForTimeout(400);
    // Gestalten: Überschrift tippen und formatieren, dann Absatz, fett, markieren, Größe
    const ed = p.locator("#g-editor"); await ed.click();
    await p.keyboard.type("Einladung"); await p.click('[data-cmd="h2"]'); await p.keyboard.press("Enter");
    await p.click('[data-cmd="p"]'); await p.keyboard.type("Ich lade dich zu meinem Fest ein. ");
    await p.click('[data-cmd="bold"]'); await p.keyboard.type("Samstag um 15 Uhr"); await p.click('[data-cmd="bold"]');
    await p.keyboard.press("Enter"); await p.keyboard.type("Bring gute Laune mit!");
    await p.keyboard.down("Shift"); for (let i = 0; i < 5; i++) await p.keyboard.press("ArrowLeft"); await p.keyboard.up("Shift");
    await p.click('[data-cmd="mark"]'); await p.selectOption("#g-groesse", "5");
    const checks = await p.evaluate(() => [...document.querySelectorAll("#g-checks li")].map(l => l.classList.contains("ok")));
    erwarte(checks.length === 5 && checks.every(Boolean), `${art}: Text gestaltet – alle fünf Haken (${checks})`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/gestalten-${art}.png` });
    await p.click("#g-speichern"); await p.waitForTimeout(400);
    erwarte(await p.evaluate(async () => /Toll gestaltet/.test(document.getElementById("g-meldung").textContent) && (await Eigenes.alle(undefined, "text")).some(e => e.kapitel === "gestalten")), `${art}: gestalteter Text liegt im Heft`);
    // Rechtschreibprüfung
    await p.click('[data-teil="pruefen"]'); await p.click("#p-beispiel"); await p.click("#p-pruefen"); await p.waitForTimeout(200);
    const r = await p.evaluate(() => ({ rot: [...document.querySelectorAll("#p-ergebnis .falsch")].map(s => s.dataset.w), blau: [...document.querySelectorAll("#p-ergebnis .name")].map(s => s.dataset.w) }));
    erwarte(["gesehn", "gros", "hate", "eis"].every(w => r.rot.includes(w)) && r.blau.includes("Jannik"), `${art}: Fehler rot (${r.rot.join(", ")}), Name blau (${r.blau})`);
    const richtig = { gesehn: "gesehen", gros: "groß", hate: "hatte", eis: "Eis" };
    for (let n = 0; n < 6; n++) {
      const w = await p.evaluate(() => (document.querySelector("#p-ergebnis .falsch") || {}).dataset?.w); if (!w) break;
      await p.click(`#p-ergebnis .falsch[data-w="${w}"]`); await p.waitForTimeout(80);
      const ziel = richtig[w], hat = await p.$(`#p-hilfe [data-v="${ziel}"]`);
      if (!hat) { fehler.push(`Vorschlag „${ziel}“ für „${w}“ fehlt (${await p.evaluate(() => [...document.querySelectorAll("#p-hilfe [data-v]")].map(b => b.dataset.v).join(","))})`); break; }
      await p.click(`#p-hilfe [data-v="${ziel}"]`); await p.waitForTimeout(80);
    }
    erwarte(await p.evaluate(() => /Keine roten Wörter/.test(document.getElementById("p-meldung").textContent) && /gesehen/.test(document.getElementById("p-text").value) && /ein Eis/.test(document.getElementById("p-text").value)), `${art}: alle Fehler über Vorschläge verbessert, Hinweis auf Grenzen der Prüfung`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/pruefen-${art}.png` });
    // Präsentation
    await p.click('[data-teil="folien"]'); await p.waitForTimeout(150);
    await p.selectOption("#f-thema", "Ein Musikinstrument");
    await p.fill('.folie-k[data-i="0"] [data-punkt="0"]', "hat vier Saiten");
    await p.click('.folie-k[data-i="0"] [data-bild="🎻"]');
    await p.fill('.folie-k[data-i="0"] [data-punkt="1"]', "klingt hell");
    await p.click("#f-neu"); await p.fill('.folie-k[data-i="1"] [data-feld="titel"]', "Wie man Geige spielt"); await p.fill('.folie-k[data-i="1"] [data-punkt="0"]', "mit einem Bogen");
    await p.click("#f-vortrag"); await p.waitForTimeout(200);
    erwarte(await p.evaluate(() => !document.getElementById("vortrag").hidden && /Ein Musikinstrument/.test(document.getElementById("v-folie").textContent)), `${art}: Vortrag startet mit Folie 1`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/vortrag-${art}.png` });
    await p.click("#v-weiter"); await p.click("#v-weiter"); await p.waitForTimeout(150);
    erwarte(await p.evaluate(() => /Applaus/.test(document.getElementById("f-meldung").textContent) && __praesentieren.daten().vortraege === 1), `${art}: Vortrag mit zwei Folien beendet`);
    // Podcast
    await p.click('[data-teil="podcast"]'); await p.fill("#pc-titel", "Miras Tierfunk"); await p.fill('[data-skript="0"]', "Hallo, hier ist Mira.");
    await p.click('[data-rec="0"]'); await p.waitForTimeout(1300); await p.click('[data-rec="0"]'); await p.waitForTimeout(800);
    erwarte(await p.evaluate(async () => !!document.querySelector('[data-hoer="0"]') && (await Eigenes.alle(undefined, "ton")).some(e => e.kapitel === "podcast")), `${art}: Podcast-Teil aufgenommen und im Heft`);
    // Wiki
    await p.click('[data-teil="wiki"]'); await p.waitForTimeout(150);
    await p.click('[data-link="Igel"]'); await p.click('[data-link="Winterschlaf"]'); await p.waitForTimeout(100);
    await p.fill("#w-text", "Im Winterschlaf schlagen Herzen langsamer. Auch [[Igel]] schlafen im Winter."); await p.click("#w-sichern"); await p.waitForTimeout(100);
    await p.click('[data-link="Igel"]'); await p.waitForTimeout(100);
    erwarte(await p.evaluate(() => /Igel sind Säugetiere/.test(document.getElementById("w-ansicht").textContent) && !!__praesentieren.daten().wiki.Winterschlaf) && await passt(p), `${art}: Wiki-Seite „Winterschlaf“ angelegt, Link zurück zu „Igel“ funktioniert`);
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Präsentieren-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
