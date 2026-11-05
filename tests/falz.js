// Playwright-Test (UX-Paket 3, 07.11.2026): „über der Falz“ – das Wichtige ist ohne Scrollen da.
// Startseite: auf dem Handy beginnt die Insel-Tür auf dem ersten Bildschirm, Kopfzeile (Name + Knöpfe) in einer Zeile; im Hochformat stehen
// Meine Ecke, Mein Tier und Spielzeit in einer Zeile. Matheweg (erster Besuch, Kl. 2): die erste Station ist ohne Scrollen sichtbar, das Angebot
// „Was kannst du schon?“ ist eine schmale Zeile, die Lernbereiche stehen unter dem Weg. Deutsch: die Werkstatt beginnt ohne Scrollen, die Schatzkarte
// ist klein neben Fipsi. Überall: keine waagerechte Scrollleiste, Konsole ohne Fehler.
// Aufruf: sh tests/laufen.sh falz   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo/;
process.on("unhandledRejection", (e) => { console.log("❌ Abbruch: " + e.message + "\n  " + (global.__fehler || []).join("\n  ")); process.exit(1); });

(async () => {
  const browser = await chromium.launch();
  const fehler = global.__fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  async function kind(breite, hoehe, stufe = "2") {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`Seitenfehler ${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`Konsole ${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
    await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(400);
    return { ctx, p };
  }
  const oben = (p, sel) => p.evaluate((s) => { const el = document.querySelector(s); if (!el) return null; const r = el.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, h: innerHeight, breit: document.documentElement.scrollWidth <= innerWidth + 1 }; }, sel);

  for (const [breite, hoehe, art] of [[1180, 820, "iPad quer"], [820, 1180, "iPad hoch"], [390, 760, "Handy"]]) {
    const { ctx, p } = await kind(breite, hoehe);
    // ---------- Startseite ----------
    await p.goto(BASIS); await p.waitForTimeout(500);
    const s = await p.evaluate(() => {
      const r = (s) => document.querySelector(s).getBoundingClientRect();
      const knoepfe = [...document.querySelectorAll(".leiste .knopf")].filter(k => !k.hidden && getComputedStyle(k).display !== "none").map(k => Math.round(k.getBoundingClientRect().top));
      return { insel: r(".tuer.insel").top, h: innerHeight, breit: document.documentElement.scrollWidth <= innerWidth + 1, zeilen: new Set(knoepfe).size, nameZeile: Math.round(r(".name").top),
        knopfZeile: knoepfe[0], spalten: getComputedStyle(document.getElementById("reihe")).gridTemplateColumns.split(" ").length, zeitBreite: r("#erst-dann").width / r("#reihe").width };
    });
    erwarte(s.breit && s.insel < s.h - 120, `Startseite ${art}: Insel-Tür beginnt bei ${Math.round(s.insel)} px (Bildschirm ${s.h} px), keine Scrollleiste`);
    if (art === "Handy") erwarte(s.zeilen === 1 && Math.abs(s.knopfZeile - s.nameZeile) < 40, `Startseite ${art}: Knöpfe in einer Zeile neben dem Namen`);
    if (art === "iPad hoch") erwarte(s.spalten === 3 && s.zeitBreite < 0.5, `Startseite ${art}: Meine Ecke, Mein Tier und Spielzeit in einer Zeile (${s.spalten} Spalten)`);
    await bild(p, `falz-start-${art.replace(" ", "-")}`);
    // ---------- Matheweg (erster Besuch Kl. 2) ----------
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForTimeout(600);
    const m = await p.evaluate(() => {
      const st = document.querySelector(".station"), e = document.getElementById("einstufung"), sj = document.getElementById("schuljahr"), k = document.getElementById("karte");
      return { station: st ? st.getBoundingClientRect().top : null, h: innerHeight, breit: document.documentElement.scrollWidth <= innerWidth + 1, einst: e && !e.hidden ? e.getBoundingClientRect().height : 0,
        unten: !!(sj && k && (k.compareDocumentPosition(sj) & Node.DOCUMENT_POSITION_FOLLOWING)), lb: sj && !sj.hidden ? sj.querySelectorAll(".lb-zeig").length : 0 };
    });
    erwarte(m.breit && m.station !== null && m.station < (art === "Handy" ? m.h * 1.3 : m.h - 60), `Matheweg ${art}: erste Station bei ${Math.round(m.station)} px (Bildschirm ${m.h} px)`);
    erwarte(m.einst > 0 && m.einst < (art === "iPad quer" ? 100 : 135), `Matheweg ${art}: „Was kannst du schon?“ als schmale Zeile (${Math.round(m.einst)} px hoch)`);
    erwarte(m.unten && m.lb === 4, `Matheweg ${art}: Lernbereiche mit „Zeig, was du kannst“ stehen unter dem Weg (${m.lb})`);
    await bild(p, `falz-mathe-${art.replace(" ", "-")}`);
    // ---------- Deutsch ----------
    await p.goto(BASIS + "spiele/deutsch/"); await p.waitForTimeout(600);
    const d = await p.evaluate(() => {
      const w = document.querySelector(".werk-titel").getBoundingClientRect(), sv = document.querySelector("#schatz svg"), fs = document.querySelector(".fipsi-start"), g = document.querySelector(".werk-gruppe, .werkstatt .orte");
      return { werk: w.top, gruppe: g ? g.getBoundingClientRect().top : null, h: innerHeight, breit: document.documentElement.scrollWidth <= innerWidth + 1, karte: sv ? sv.getBoundingClientRect().width : 0,
        imKopf: !!(sv && fs && fs.contains(sv)), titel: document.getElementById("schatz-titel").textContent };
    });
    erwarte(d.breit && d.werk < (art === "Handy" ? d.h * 1.4 : d.h - 80), `Deutsch ${art}: Werkstatt-Titel bei ${Math.round(d.werk)} px (Bildschirm ${d.h} px)`);
    erwarte(d.imKopf && d.karte > 100 && d.karte <= 270 && /0 von 5/.test(d.titel), `Deutsch ${art}: Schatzkarte klein (${Math.round(d.karte)} px) neben Fipsi, „${d.titel}“`);
    await bild(p, `falz-deutsch-${art.replace(" ", "-")}`);
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Falz-Test bestanden.");
})();
