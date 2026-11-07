// Playwright-Test (Review 07.11.2026): Stil A – Sprechblasen mit Kontur und Zipfel auf allen Seiten mit sichtbarer Sprechblase.
// Englisch, Sorbisch, Medien und Sachkunde hatten die dunkle Kontur (globale Regel in shared/style.css), aber einen weißen Zipfel ohne Kontur,
// der außerdem vom scrollenden Kasten abgeschnitten wurde (und den Kasten um 16 px scrollbar machte). Jetzt: Hülle `.blase` mit Kontur und Zipfel
// (gedrehte Raute mit zwei Konturrändern wie in Deutsch), innen `#blase.blase-innen` scrollt bei langen Texten.
// Geprüft in einer echten Lektion je Seite, quer und hoch: Zipfel-Kontur, kein Scrollrest bei kurzem Text, scrollt bei sehr langem Text,
// Hülle ohne Scroll (sonst wäre der Zipfel weg), innerer Teil ohne zweite Kontur, kein Querscrollen, Konsole ohne Fehler.
// Aufruf: sh tests/laufen.sh stil   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo/;
process.on("unhandledRejection", (e) => { console.log("❌ Abbruch: " + e.message + "\n  " + (global.__fehler || []).join("\n  ")); process.exit(1); });
const KONTUR = "rgb(59, 31, 99)";

(async () => {
  const browser = await chromium.launch();
  const fehler = global.__fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  async function kind(breite, hoehe) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__testSchnell = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`Seitenfehler: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`Konsole: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
    await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "3"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(300);
    await p.evaluate(() => { const e = Spielwelt.lade("eltern") || {}; e.sorbisch = Object.assign({}, e.sorbisch, { an: true }); Spielwelt.speichere("eltern", e); });
    return { ctx, p };
  }
  // Seite, Weg in eine Lektion (Sprechblase sichtbar), Name
  const SEITEN = [
    ["spiele/englisch/", () => __englisch.starte(0), "Englisch", "#paula-gross"],
    ["spiele/sorbisch/", () => __sorbisch.starte(0), "Sorbisch", "#paula-gross"],
    ["spiele/medien/", () => __medien.starte(0), "Medien", "#robo-gross"],
    ["spiele/sachkunde/", () => __sachkunde.starte(0), "Sachunterricht", "#eule-gross"],
    ["spiele/deutsch/", () => __deutsch.starte(0), "Deutsch (Vergleich)", "#fipsi-gross"]
  ];
  const messe = (p, figur) => p.evaluate((figur) => {
    const innen = document.getElementById("blase"), huelle = innen.closest(".blase") || innen, nach = getComputedStyle(huelle, "::after"), cs = getComputedStyle(huelle), ci = getComputedStyle(innen);
    // Wo steht die Figur, wohin zeigt der Zipfel? (Review 07.11.2026: im Hochformat steht die Figur rechts, der Zipfel zeigte nach links)
    const rb = huelle.getBoundingClientRect(), f = document.querySelector(figur), rf = f && f.getBoundingClientRect();
    const figurLage = !rf ? "?" : rf.top >= rb.bottom - 4 ? "unten" : rf.right <= rb.left + 4 ? "links" : rf.left >= rb.right - 4 ? "rechts" : "oben";
    const zipfelLage = nach.left !== "auto" && parseFloat(nach.left) < 0 ? "links" : nach.right !== "auto" && parseFloat(nach.right) < 0 ? "rechts" : "unten";
    return { text: innen.textContent.trim().length, figurLage, zipfelLage, kontur: cs.borderTopColor, breite: cs.borderTopWidth, zipfel: nach.content !== "none" && nach.content !== "" ? { b: nach.borderBottomColor, r: nach.borderRightColor, l: nach.borderLeftColor, w: nach.width, rot: nach.transform } : null,
      huelleScroll: cs.overflowY, innenKontur: huelle === innen ? "0px" : ci.borderTopWidth, rest: /auto|scroll/.test(ci.overflowY) ? innen.scrollHeight - innen.clientHeight : 0,   /* ohne Scrollkasten zählt der Zipfel nicht */ quer: document.documentElement.scrollWidth <= innerWidth + 1,
      imBild: huelle.getBoundingClientRect().bottom + 14 <= innerHeight };
  }, figur);
  for (const [breite, hoehe, lage] of [[1180, 820, "quer"], [820, 1180, "hoch"]]) {
    const { ctx, p } = await kind(breite, hoehe);
    for (const [pfad, rein, name, figur] of SEITEN) {
      await p.goto(BASIS + pfad); await p.waitForLoadState("load"); await p.waitForTimeout(400);
      await p.evaluate(rein); await p.waitForTimeout(300);
      const m = await messe(p, figur);
      erwarte(m.figurLage !== "?" && m.figurLage === m.zipfelLage, `${name} ${lage}: Zipfel zeigt zur Figur (Figur ${m.figurLage}, Zipfel ${m.zipfelLage})`);
      const zipfelOk = m.zipfel && m.zipfel.w === "20px" && /matrix/.test(m.zipfel.rot) && (m.zipfel.b === KONTUR) && (m.zipfel.r === KONTUR || m.zipfel.l === KONTUR);
      erwarte(m.text > 0 && m.kontur === KONTUR && m.breite === "3px" && zipfelOk, `${name} ${lage}: Sprechblase mit 3-px-Kontur und Zipfel mit Kontur (${JSON.stringify(m.zipfel)})`);
      erwarte(m.huelleScroll === "visible" && m.innenKontur === "0px" && m.rest === 0 && m.quer, `${name} ${lage}: Hülle scrollt nicht (Zipfel sichtbar), innen keine zweite Kontur, kein Scrollrest bei kurzem Text (${m.rest} px), kein Querscrollen`);
      await bild(p, `stil-${name.split(" ")[0].toLowerCase()}-${lage}`);
      // sehr langer Text: innen scrollt, Hülle bleibt im Bild
      if (pfad !== "spiele/deutsch/") {
        const l = await p.evaluate(() => { const b = document.getElementById("blase"); b.insertAdjacentHTML("afterbegin", "<div>" + "Das ist ein sehr langer Text zum Vorlesen. ".repeat(60) + "</div>"); const h = b.closest(".blase");
          return { rest: b.scrollHeight - b.clientHeight, oy: getComputedStyle(b).overflowY, hoehe: h.getBoundingClientRect().height, innen: innerHeight }; });
        erwarte(l.rest > 50 && l.oy === "auto" && l.hoehe < l.innen * 0.7, `${name} ${lage}: sehr langer Text scrollt innen (${l.rest} px), Blase bleibt unter 70 % der Höhe`);
      }
    }
    // (Eine Welt, 07.11.2026) Begleiter-Blasen auf den Fach-Startseiten (Benno, Fipsi, Ella) mit Kontur und Zipfel; Knöpfe mit Kontur-Umriss
    for (const [pfad, sel] of [["spiele/mathe/", "#benno-text"], ["spiele/deutsch/", "#karte-text"], ["spiele/sachkunde/", "#intro-text"]]) {
      await p.goto(BASIS + pfad); await p.waitForTimeout(600);
      const b = await p.evaluate((sel) => { const e = document.querySelector(sel), c = getComputedStyle(e), z = getComputedStyle(e, "::before"), k = document.querySelector(".knopf"), kc = k ? getComputedStyle(k) : {};
        return { kontur: c.borderTopColor, breite: c.borderTopWidth, zipfel: z.borderLeftColor, knopf: kc.outlineColor, quer: document.documentElement.scrollWidth <= innerWidth + 1 }; }, sel);
      erwarte(b.kontur === KONTUR && b.breite === "3px" && b.zipfel === KONTUR && b.knopf === KONTUR && b.quer, `${pfad} ${lage}: Begleiter-Blase mit Kontur und Zipfel, Knöpfe mit Kontur`);
    }
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Stil-Test bestanden.");
})();
