// Barrierefreiheits-Rundgang (06.11.2026): öffnet alle 2D-Seiten (iPad quer, Kind Kl. 3 mit allen Kapiteln offen) und prüft
// - jeder sichtbare Knopf/Link hat einen Namen (Text, aria-label oder title) – wichtig für VoiceOver und die Vorlese-Logik
// - Tippflächen sind mindestens 40 × 40 CSS-Pixel groß (Apple empfiehlt 44; kleine Text-Links im Fließtext ausgenommen)
// - keine doppelten ids, <html lang="de">, Bilder (img) mit alt, Eingabefelder mit Beschriftung
// - Ladezeit je Seite (DOMContentLoaded, nur Info) und Menge der geladenen Skripte
// Aufruf: sh tests/laufen.sh barriere   (AUSGABE=1 listet alle Funde, auch erlaubte)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const SEITEN = ["", "spiele/anziehen/", "spiele/mathe/", "spiele/deutsch/", "spiele/medien/", "spiele/sachkunde/", "spiele/sachkunde/?fach=kunst", "spiele/englisch/", "spiele/heft/", "spiele/robo/", "spiele/vorlesen/",
  "spiele/praesentieren/", "spiele/vorschule/", "spiele/ich/", "spiele/schatz/", "spiele/gefuehle/", "spiele/atelier/", "spiele/schach/", "spiele/familie/duell.html", "spiele/tier/", "spiele/garten/", "spiele/baeckerei/",
  "spiele/tierstation/", "spiele/angeln/", "spiele/rhythmus/", "spiele/wetter/", "spiele/leuchtturm/", "spiele/bruecke/", "spiele/expedition/", "spiele/eltern/", "spiele/daz/", "spiele/lesen/", "spiele/album/"];
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [], info = [];
  const GROESSE = process.env.HANDY ? { width: 390, height: 760 } : { width: 1180, height: 820 };
  const ctx = await browser.newContext({ viewport: GROESSE, hasTouch: true, serviceWorkers: "block" });
  await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__elternAlle = true; });
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
  await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "3"); await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString()));
  await p.evaluate(() => { for (let i = 0; i < 12; i++) Zeit.aufgabe(); Story.setzeKapitel(6); const m = Spielwelt.lade("medien") || {}; m.lektionen = { bedienung: 3 }; Spielwelt.speichere("medien", m); });
  let funde = 0;
  for (const s of SEITEN) {
    const skripte = []; const h = (r) => { if (r.request().resourceType() === "script") skripte.push(+(r.headers()["content-length"] || 0)); }; p.on("response", h);
    await p.goto(BASIS + s); await p.waitForLoadState("load"); await p.waitForTimeout(700);
    p.off("response", h);
    const r = await p.evaluate(() => {
      const sicht = (e) => { const b = e.getBoundingClientRect(), st = getComputedStyle(e); return b.width > 0 && b.height > 0 && st.visibility !== "hidden" && st.display !== "none" && !e.closest("[hidden]"); };
      const name = (e) => (e.getAttribute("aria-label") || e.getAttribute("title") || e.textContent || (e.querySelector("img[alt]") || {}).alt || "").replace(/\s+/g, " ").trim();
      const kz = (e) => (e.id ? "#" + e.id : e.tagName.toLowerCase() + (e.className && typeof e.className === "string" ? "." + e.className.trim().split(/\s+/).join(".") : ""));
      const ohneName = [], klein = [], ids = {}, ohneAlt = [], ohneLabel = [];
      document.querySelectorAll("button, a[href], [role=button], [role=tab]").forEach(e => {
        if (!sicht(e)) return;
        if (!name(e)) ohneName.push(kz(e));
        const b = e.getBoundingClientRect(), imText = e.tagName === "A" && e.closest("p, li, .klein, small") && !e.classList.contains("knopf");
        if (!imText && (b.width < 40 || b.height < 40)) klein.push(`${kz(e)} ${Math.round(b.width)}×${Math.round(b.height)}`);
      });
      document.querySelectorAll("[id]").forEach(e => { ids[e.id] = (ids[e.id] || 0) + 1; });
      document.querySelectorAll("img").forEach(e => { if (sicht(e) && !e.hasAttribute("alt")) ohneAlt.push(kz(e)); });
      document.querySelectorAll("input:not([type=hidden]), select, textarea").forEach(e => {
        if (!sicht(e)) return;
        const hat = e.getAttribute("aria-label") || e.getAttribute("placeholder") || e.closest("label") || (e.id && document.querySelector(`label[for="${e.id}"]`)) || e.getAttribute("title");
        if (!hat) ohneLabel.push(kz(e));
      });
      const n = performance.getEntriesByType("navigation")[0];
      return { lang: document.documentElement.lang, ohneName, klein, doppelt: Object.entries(ids).filter(([, n]) => n > 1).map(([k]) => k), ohneAlt, ohneLabel, dcl: Math.round(n.domContentLoadedEventEnd) };
    });
    const kb = Math.round(skripte.reduce((a, b) => a + b, 0) / 1024);
    info.push(`${(s || "Startseite").padEnd(32)} ${String(r.dcl).padStart(5)} ms  Skripte ${String(kb).padStart(5)} KB`);
    const zeile = (art, l) => { if (l.length) { funde += l.length; fehler.push(`${s || "Startseite"}: ${art}: ${l.slice(0, 8).join(", ")}${l.length > 8 ? ` … (${l.length})` : ""}`); } };
    if (r.lang !== "de") zeile("lang fehlt", ["html"]);
    zeile("Knopf ohne Namen", r.ohneName); zeile("Tippfläche zu klein", r.klein); zeile("doppelte id", r.doppelt); zeile("Bild ohne alt", r.ohneAlt); zeile("Eingabe ohne Beschriftung", r.ohneLabel);
  }
  console.log("  Ladezeiten (lokal, nur Info):\n    " + info.join("\n    "));
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log(`✅ Barrierefreiheit bestanden: ${SEITEN.length} Seiten ohne Funde.`);   // „bestanden“ prüft die CI-Schleife in .github/workflows/tests.yml
})().catch(err => { console.error(err); process.exit(1); });
