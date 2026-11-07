// Playwright-Test (06.11.2026): Ellas Wetter-Drache an der Wetterstation (Kapitel 5 „Der Sturm“) – zu bis Kapitel 5; Wettertagebuch echt
// eingetragen (mit gemessenem Wetter aus dem Cache und Vergleich), Stern nur für eine neue Wetterart; fünf Wetter-Fragen echt beantwortet
// (eine falsch → Hinweis, zweimal falsch → Lösung), Sterne nur für neue Fragen, höchstens 3 am Tag; Drachenflug echt mit „Leine ziehen“
// bis zum Ende (erst absichtlich landen lassen); Stufen nach Klasse (Kl. 1 Bilder, Kl. 3 Minusgrade/Windsack); Handy ohne Querscrollen.
// Aufruf: sh tests/laufen.sh wetterdrache   (Screenshots mit BILDER=<ordner>)
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
  async function kind(stufe, breite = 1180, hoehe = 820) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__testSchnell = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`Seitenfehler: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`Konsole: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
    await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe); await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(300);
    return { ctx, p };
  }
  const seite = async (p) => { await p.goto(BASIS + "spiele/wetter/"); await p.waitForLoadState("load"); await p.waitForTimeout(300); };
  const sterne = (p) => p.evaluate(() => Spielwelt.sterne());
  // Frage richtig (oder absichtlich falsch) beantworten
  const antworte = async (p, falsch = 0) => {
    const f = await p.evaluate(() => { const f = __wetter.lauf.liste[__wetter.lauf.pos]; return { pos: __wetter.lauf.pos, richtig: f.optionen[0], alle: f.optionen }; });
    for (let i = 0; i < falsch; i++) { await p.click(`#optionen [data-o="${f.alle[1 + i]}"]`); await p.waitForTimeout(120); }
    if (falsch < 2) await p.click(`#optionen [data-o="${f.richtig}"]`);
    await p.waitForFunction((pos) => __wetter.lauf.pos > pos || __wetter.lauf.phase !== "fragen", f.pos, { timeout: 8000 });
  };
  // Drachen fliegen lassen: im Takt ziehen, bis er geflogen ist
  const fliege = async (p) => {
    const k = await p.locator("#ziehen").boundingBox();
    for (let i = 0; i < 400 && !(await p.evaluate(() => __wetter.flug.fertig)); i++) {
      const h = await p.evaluate(() => __wetter.flug.h);
      if (h < 68) await p.mouse.click(k.x + k.width / 2, k.y + k.height / 2);
      await p.waitForTimeout(60);
    }
  };

  // ---------- Klasse 2 ----------
  { const { ctx, p } = await kind("2");
    await seite(p);
    erwarte(await p.isVisible("#zu") && !(await p.isVisible("#tagebuch")), "vor Kapitel 5 ist der Wetter-Drache zu");
    await p.evaluate(() => { Story.setzeKapitel(5);
      const e = Spielwelt.lade("eltern"); e.kind.ort = { name: "Dresden", lat: 51.05, lon: 13.74 }; Spielwelt.speichere("eltern", e);
      localStorage.setItem("lerninsel.wetter", JSON.stringify({ lat: 51.05, lon: 13.74, ort: "Dresden", zeit: Date.now(), temp: 11.6, wind: 14, code: 3, art: "wolken" })); });
    await seite(p);
    erwarte(await p.isVisible("#tagebuch") && /11 °C|12 °C/.test(await p.textContent("#messung")) && /14 km\/h/.test(await p.textContent("#messung")), "Kapitel 5: Tagebuch mit gemessenem Wetter aus Dresden (12 °C, 14 km/h)");
    const s0 = await sterne(p);
    erwarte(await p.isDisabled("#eintragen"), "Eintragen erst, wenn Himmel und Wind gewählt sind");
    await p.click('[data-art="wolken"]'); await p.click('[data-wind="1"]'); await bild(p, "wetter-tagebuch");
    await p.click("#eintragen"); await p.waitForTimeout(100);
    const h = await p.textContent("#t-hinweis");
    erwarte(/Eingetragen/.test(h) && /misst das auch so/.test(h) && (await sterne(p)) === s0 + 1, "eingetragen, Vergleich mit der Station stimmt, +1 ⭐ für die neue Wetterart");
    await p.waitForFunction(() => /☁️/.test((document.querySelector(".woche .heute") || {}).textContent || ""), null, { timeout: 5000 });
    erwarte(true, "die Woche zeigt heute ☁️");
    await p.click('[data-art="wolken"]'); await p.click('[data-wind="2"]'); await p.click("#eintragen"); await p.waitForTimeout(500);
    erwarte((await sterne(p)) === s0 + 1, "dieselbe Wetterart noch einmal: kein Stern");
    await p.waitForTimeout(200); await p.click("#zum-drachen");
    const liste = await p.evaluate(() => __wetter.lauf.liste.map(f => f.id));
    erwarte(liste.length === 5 && !liste.some(id => /thermo-c|windsack|regen-/.test(id)), `Kl. 2: 5 Fragen ohne Kl.-3-Fragen (${liste.join(", ")})`);
    erwarte(new Set(liste.map(id => id.split("-")[0])).size >= 4, "die Runde mischt die Arten (nicht viermal Wind hintereinander)");
    const s1 = await sterne(p);
    await antworte(p, 1);   // 1) einmal falsch
    erwarte((await sterne(p)) === s1, "erste Frage nach einem Fehler: kein Stern");
    await bild(p, "wetter-frage");
    await antworte(p, 2);   // 2) zweimal falsch → Lösung
    for (let i = 2; i < 5; i++) await antworte(p);
    erwarte((await sterne(p)) === s1 + 3, "drei neue Fragen beim ersten Versuch: +3 ⭐ (Deckel 3 am Tag)");
    // Drachenflug
    await p.waitForSelector("#flugkarte"); await bild(p, "wetter-flug");
    const fw = await p.evaluate(() => __wetter.flug.wind);
    erwarte(fw === 1 || fw === 2, `Flug mit Drachenwind (${fw === 1 ? "leicht" : "kräftig"}) – nie windstill oder Sturm`);
    await p.waitForFunction(() => __wetter.flug.landungen >= 2, null, { timeout: 15000 });   // nichts tun: der Drache landet zweimal
    erwarte(await p.evaluate(() => __wetter.flug.band[0] === 40 && /breiter/.test(document.getElementById("hinweis").textContent)), "zweimal gelandet: Ella macht das grüne Band breiter");
    await fliege(p);
    await p.waitForSelector("#ende");
    const d = await p.evaluate(() => Spielwelt.lade("wetterdrache"));
    erwarte(d.fluege[String(fw)] === 1 && (await sterne(p)) === s1 + 4 && Object.keys(d.geschafft).length === 3, "Drache geflogen: erster Flug bei dieser Windstärke +1 ⭐, 3 Fragen gemerkt");
    await bild(p, "wetter-ende");
    await p.click("#nochmal"); await p.waitForTimeout(200);
    erwarte(await p.evaluate(() => !Spielwelt.lade("wetterdrache").geschafft[__wetter.lauf.liste[0].id]), "nächste Runde beginnt mit noch nicht geschafften Fragen");
    // Seite neu öffnen: Tagebuch heute schon da → gleich die Fragen
    await seite(p);
    erwarte(await p.isVisible("#fragekarte"), "heute schon eingetragen: es geht gleich mit den Fragen los");
    await ctx.close(); }

  // ---------- Klasse 1, Klasse 3, Handy ----------
  for (const [stufe, breite, hoehe, art] of [["1", 1180, 820, "Kl. 1 quer"], ["3", 820, 1180, "Kl. 3 hoch"], ["3", 390, 760, "Kl. 3 Handy"]]) {
    const { ctx, p } = await kind(stufe, breite, hoehe);
    await p.evaluate(() => Story.setzeKapitel(5)); await seite(p);
    erwarte(await p.isVisible("#tagebuch") && !(await p.isVisible("#messung")), `${art}: ohne Ort kein Messwert, Tagebuch trotzdem`);
    await p.click('[data-art="sonne"]'); await p.click('[data-wind="0"]'); await p.click("#eintragen"); await p.waitForTimeout(200);
    await p.click("#zum-drachen");
    const ids = await p.evaluate(() => __wetter.fuerStufe(__wetter.stufe()).map(f => f.id));
    if (stufe === "1") erwarte(!ids.some(id => /thermo-|windsack|regen-/.test(id)), `${art}: nur Bild-Fragen (Wind, Anziehen, Gewitter, warm/kalt)`);
    else erwarte(ids.some(id => id === "thermo-cm4") && ids.some(id => /windsack/.test(id)), `${art}: auch Minusgrade und Windsack`);
    const m = await p.evaluate(() => ({ w: document.documentElement.scrollWidth, iw: innerWidth }));
    erwarte(m.w <= m.iw + 1, `${art}: keine waagerechte Scrollleiste`);
    for (let i = 0; i < 5; i++) await antworte(p);
    await p.waitForSelector("#flugkarte"); await fliege(p); await p.waitForSelector("#ende");
    erwarte(true, `${art}: Runde und Flug echt bis zum Ende`);
    await bild(p, `wetter-${art.replace(/[ .]/g, "-")}`);
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Wetter-Drache-Test bestanden.");
})();
