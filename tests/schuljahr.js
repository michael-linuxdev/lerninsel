// Test Schuljahres-Gerüst Mathe: Eltern-Einstellung „gerade in der Schule“ (Lernbereich) markiert die Lernbereichs-Kachel und setzt den
// „Jetzt“-Marker auf dessen nächste Station; „Zeig, was du kannst“ je Lernbereich – eine Aufgabe je Station über die Tasten, eine absichtlich
// falsch –, Ergebnis ohne Noten und ohne Sterne-Abzug, im Elternbereich je Station. Aufruf: sh tests/laufen.sh schuljahr
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

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
  const zuEltern = async (p) => { await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300); if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); } await p.waitForSelector("#m-schule"); };
  for (const [breite, hoehe, art] of [[1180, 820, "quer"], [390, 760, "hoch"]]) {
    const { ctx, p } = await kind("2", breite, hoehe);
    await zuEltern(p); await p.selectOption("#m-schule", "rf"); await p.click("#m-speichern"); await p.waitForTimeout(200);
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForSelector(".lb-kachel");
    const w = await p.evaluate(() => ({ kacheln: [...document.querySelectorAll(".lb-kachel")].map(k => k.dataset.lb), schule: (document.querySelector(".lb-kachel.schule") || {}).dataset?.lb,
      jetzt: (document.querySelector("#karte .station.jetzt .name") || {}).textContent, passt: document.documentElement.scrollWidth <= innerWidth + 1 }));
    erwarte(w.kacheln.join() === "zo,rf,gm,dz" && w.schule === "rf" && w.jetzt === "Formen und Körper" && w.passt, `${art}: vier Lernbereichs-Kacheln, „Raum und Form“ als „gerade in der Schule“ markiert, Jetzt-Marker bei „Formen und Körper“ (${w.jetzt})`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/schuljahr-weg-${art}.png` });
    if (art === "quer") {
      const sterneVorher = await p.evaluate(() => Spielwelt.sterne());
      await p.click('.lb-zeig[data-lb="rf"]'); await p.waitForTimeout(200);
      const n = await p.evaluate(() => __mathe.lauf.liste.length);
      const stationen = await p.evaluate(() => Mathe.STATIONEN.filter(s => s.lb === "rf").length);
      erwarte(n === Math.min(10, stationen) && await p.evaluate(() => /Zeig, was du kannst/.test(document.getElementById("station-name").textContent)), `„Zeig, was du kannst“ hat eine Aufgabe je Station (${n} von ${stationen} Stationen, höchstens 10)`);
      for (let i = 0; i < n; i++) {
        if (i === 1) { // absichtlich zweimal falsch → Lösung, Weiter, keine Wiederholung am Ende
          for (let k = 0; k < 2; k++) { await p.evaluate(() => { const a = __mathe.lauf.liste[__mathe.lauf.pos]; const f = a.art === "wahl" ? a.optionen.find(o => o !== a.antwort) : String(Number(a.antwort) + 1); __mathe.antworte(f); }); await p.waitForTimeout(900); }
          await p.click("#weiter"); await p.waitForTimeout(300); continue;
        }
        await tippe(p); await p.waitForTimeout(1050);
      }
      await p.waitForSelector("#ende-ansicht:not([hidden])", { timeout: 5000 });
      const e = await p.evaluate(() => ({ titel: document.getElementById("ende-titel").textContent, text: document.getElementById("ende-text").textContent, ls: (Spielwelt.lade("mathe").lernstand || {})["k2:rf"], sterne: Spielwelt.sterne(), laenge: __mathe.lauf.liste.length }));
      erwarte(e.titel === "Danke fürs Zeigen!" && /üben wir noch/.test(e.text) && e.ls && e.ls.n === n && e.ls.richtig === n - 1 && e.laenge === n,
        `Ergebnis ohne Noten: „${e.text.slice(0, 80)}…“, gespeichert ${e.ls && e.ls.richtig} von ${e.ls && e.ls.n}, keine Wiederholungsaufgabe angehängt`);
      const k2 = await p.evaluate(() => Object.keys(Spielwelt.lade("mathe").k2 || {}).length);
      erwarte(e.sterne >= sterneVorher && k2 === 0, `keine Stations-Sterne aus dem Zeigen, nichts geht verloren (Sterne ${sterneVorher} → ${e.sterne}, Stationen mit Sternen: ${k2})`);
      if (BILDER) await p.screenshot({ path: `${BILDER}/schuljahr-ende.png` });
      await p.click("text=Zum Matheweg"); await p.waitForTimeout(300);
      erwarte(await p.evaluate(() => /zuletzt gezeigt/.test(document.querySelector('.lb-kachel[data-lb="rf"]').textContent)), "Kachel zeigt „zuletzt gezeigt: x von y“");
      await zuEltern(p);
      const el = await p.evaluate(() => (document.getElementById("lernstand-liste") || {}).textContent || "");
      erwarte(/Kl\. 2 · Raum und Form/.test(el) && /noch üben/.test(el), `Elternbereich zeigt das Ergebnis je Station („${el.slice(0, 90)}…“)`);
      if (BILDER) { await p.evaluate(() => document.getElementById("lernstand-liste").scrollIntoView()); await p.screenshot({ path: `${BILDER}/schuljahr-eltern.png` }); }
      // ohne Einstellung: Jetzt-Marker wie bisher
      await p.selectOption("#m-schule", ""); await p.click("#m-speichern"); await p.waitForTimeout(200);
      await p.goto(BASIS + "spiele/mathe/"); await p.waitForSelector(".lb-kachel");
      erwarte(await p.evaluate(() => !document.querySelector(".lb-kachel.schule") && document.querySelector("#karte .station.jetzt .name").textContent === "Plus bis 20"), "ohne Einstellung: keine Markierung, Jetzt-Marker wieder bei „Plus bis 20“");
    }
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Schuljahres-Gerüst-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
