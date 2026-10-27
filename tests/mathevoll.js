// Test „Mathe Grundschule vollständig“ (Lehrplan Sachsen 2025): die letzten 16 Stationen (Kl. 1: Rechts/links, Vorn/hinten, Figuren legen;
// Kl. 2: Baupläne, Rechenwege, Bild/Zahl/Rechnung, Strategiespiele, Tabellen ausfüllen; Kl. 3: Pläne, Fläche/Umfang, Netze, Skizzen,
// Knobeln; Kl. 4: Wegeskizzen, Schrägbilder, Rechenbrett) echt über die Tasten durchgespielt, Werkstatt „Rechengeschichten erfinden“ mit
// echtem Schreiben bis zum Ende, Elternbereich: alle Mathe-Lernbereiche „gut“, kein Inhaltspunkt fehlt.
// Aufruf: sh tests/laufen.sh mathevoll   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const WEGE = [["1", "k1", ["k1rechtslinks", "k1vornhinten", "k1legen"]], ["2", "k2", ["bauplaene", "rechenwege", "darstellungen", "strategie", "tabelle2"]],
  ["3", "k3", ["k3plaene", "k3umfang", "k3netze", "k3skizze", "k3knobeln"]], ["4", "k4", ["k4wegeskizze", "k4schraegbild", "k4rechenbrett"]]];

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
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
  const offen = (p) => p.evaluate(() => [...document.querySelectorAll("#karte .station:not(.ziel)")].map(b => !b.classList.contains("zu")));
  // Eine Aufgabe über die Tasten lösen (wie ein Kind): Ziffern + ✓ oder die passende Wahltaste
  async function tippe(p) {
    const a = await p.evaluate(() => { const x = __mathe.lauf.liste[__mathe.lauf.pos]; return { art: x.art, antwort: x.antwort }; });
    if (a.art === "wahl") await p.evaluate((w) => [...document.querySelectorAll(".wahl-tasten .taste")].find(b => b.dataset.wert === w).click(), a.antwort);
    else { for (const z of a.antwort) await p.click(`.taste[data-ziffer="${z}"]`); await p.click(".taste.ok"); }
  }
  async function spiele(p, id, art, weg) {
    const nr = await p.evaluate(([id, liste]) => Mathe[liste].findIndex(s => s.id === id), [id, ({ k1: "STATIONEN_K1", k2: "STATIONEN", k3: "STATIONEN_K3", k4: "STATIONEN_K4" })[weg]]);
    await p.evaluate((n) => __mathe.starte(n), nr); await p.waitForTimeout(150);
    let passt = true;
    for (let i = 0; i < 10; i++) {
      if (!(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))) passt = false;
      if (i === 0 && BILDER) await p.screenshot({ path: `${BILDER}/mathevoll-${id}-${art}.png` });
      await tippe(p); await p.waitForTimeout(1050);
    }
    await p.waitForSelector("#ende-ansicht:not([hidden])", { timeout: 4000 });
    const sterne = await p.evaluate(([id, weg]) => (Spielwelt.lade("mathe")[weg] || {})[id], [id, weg]);
    await p.click("text=Zum Matheweg"); await p.waitForTimeout(200);
    return { sterne, passt };
  }

  for (const [stufe, weg, liste] of WEGE) {
    const { ctx, p } = await kind(stufe);
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForSelector("#karte .station");
    for (const id of liste) {
      const r = await spiele(p, id, "quer", weg);
      erwarte(r.sterne === 3 && r.passt, `Kl. ${stufe} quer: „${id}“ – 10 Aufgaben über die Tasten, 3 Sterne, keine Scrollleiste (${r.sterne}, ${r.passt})`);
    }
    // Elternbereich: alle Mathe-Lernbereiche dieser Klasse „gut“, kein Inhaltspunkt teilweise oder fehlend
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
    await p.waitForSelector(".lp-punkte");
    const e = await p.evaluate(() => { const fach = [...document.querySelectorAll("h3.lp-fach")].find(h => /Mathematik/.test(h.textContent)), liste = fach.nextElementSibling;
      return { zeichen: [...liste.querySelectorAll(":scope > li > .zeichen")].map(z => z.textContent), offen: [...liste.querySelectorAll(".lp-punkte li .zeichen")].filter(z => /🟡|⭕/.test(z.textContent)).length }; });
    erwarte(e.zeichen.length === 4 && e.zeichen.every(z => z === "✅") && e.offen === 0, `Elternbereich Kl. ${stufe}: alle 4 Mathe-Lernbereiche ✅, kein Inhaltspunkt teilweise oder fehlend (${e.zeichen.join("")}, offen ${e.offen})`);
    if (BILDER && stufe === "2") { await p.evaluate(() => { const fach = [...document.querySelectorAll("h3.lp-fach")].find(h => /Mathematik/.test(h.textContent)); fach.scrollIntoView(); }); await p.screenshot({ path: `${BILDER}/mathevoll-eltern.png` }); }
    if (stufe === "2") {
      // Werkstatt „Rechengeschichten erfinden“ echt bis zum Ende (Schreiben über die Tastatur)
      await p.goto(BASIS + "spiele/deutsch/"); await p.waitForTimeout(400);
      await p.evaluate(() => __deutsch.starte(WERKSTATT.findIndex(k => k.id === "w-rechengeschichten"), WERKSTATT)); await p.waitForTimeout(150);
      for (let schutz = 0; schutz < 20; schutz++) {
        const x = await p.evaluate(() => { if (!document.querySelector("#ende-ansicht").hidden) return { ende: true }; const l = __deutsch.lauf, s = l.k.schritte[l.pos]; return { pos: l.pos, typ: s.typ, richtig: (s.optionen || [])[0], pflicht: s.pflicht }; });
        if (x.ende) break;
        if (x.typ === "sag") await p.click("#weiter", { force: true });
        else if (x.typ === "luecke") await p.evaluate((t) => [...document.querySelectorAll(".optionen .option")].find(b => b.textContent === t).click(), x.richtig);
        else if (x.typ === "schreiben") {
          await p.locator("#schreibfeld").pressSequentially(`Im Garten spielen ${x.pflicht[0]} Kinder und ${x.pflicht[1]} kommen noch dazu. Wie viele Kinder sind es dann zusammen?`, { delay: 1 });
          if (BILDER && x.pos === 3) await p.screenshot({ path: `${BILDER}/mathevoll-rechengeschichte.png` });
          await p.click("#pruefen"); await p.waitForSelector("#weiter"); await p.click("#weiter");
        }
        await p.waitForFunction((v) => !document.querySelector("#ende-ansicht").hidden || __deutsch.lauf.pos !== v, x.pos, { timeout: 6000 });
      }
      const ende = await p.evaluate(() => !document.querySelector("#ende-ansicht").hidden && document.querySelectorAll("#ende-sterne span:not(.leer)").length);
      erwarte(ende === 3, `Werkstatt „Rechengeschichten erfinden“: drei eigene Geschichten geschrieben, bis zum Ende, 3 Sterne (${ende})`);
    }
    await ctx.close();
  }
  // Hochformat: je Weg zwei neue Stationen
  for (const [stufe, weg, liste] of WEGE) {
    const { ctx, p } = await kind(stufe, 390, 760);
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForSelector("#karte .station");
    for (const id of liste.slice(0, 2)) { const r = await spiele(p, id, "hoch", weg); erwarte(r.sterne === 3 && r.passt, `hoch: „${id}“ – 3 Sterne, keine Scrollleiste (${r.sterne}, ${r.passt})`); }
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Mathe-Grundschule-vollständig-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
