// Test „Mein Name“ (10.11.2026, Bildungsplan Vorschule „den eigenen Namen schreiben“): Knopf auf der Lesen-Seite, der Name des Kindes
// als ein Wort in Druckschrift; Malen ohne Startpunkt zählt nicht; jeder Strich echt mit der Maus nachgespurt bis zum Ende; Zeichen ohne
// Spur (Bindestrich) stehen grau dabei; Fortschritt, Lernfund, „Noch einmal“; iPad quer und Handy ohne Scrollleiste. Aufruf: sh tests/laufen.sh meinname
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  async function kind(name, breite = 1180, hoehe = 820) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", name); await p.selectOption("#e-stufe", "vs");
    await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    await p.goto(BASIS + "spiele/lesen/"); await p.waitForSelector("#weg-name");
    return { ctx, p };
  }
  async function spureAlles(p) {
    for (let s = 0; s < 40 && await p.evaluate(() => __lesen.spurNr() === 0 && document.getElementById("spuren-ende").hidden); s++) {
      const punkte = await p.evaluate(() => __lesen.spurPunkte());
      if (!punkte.length) break;
      await p.mouse.move(punkte[0][0], punkte[0][1]); await p.mouse.down();
      for (const [x, y] of punkte.slice(1)) await p.mouse.move(x + 1, y - 1, { steps: 2 });
      await p.mouse.up(); await p.waitForTimeout(40);
    }
    await p.waitForSelector("#spuren-ende:not([hidden])", { timeout: 5000 });
  }

  for (const [name, breite, hoehe, art] of [["Mira", 1180, 820, "quer"], ["Ole-Jan", 390, 760, "Handy"]]) {
    const { ctx, p } = await kind(name, breite, hoehe);
    erwarte(await p.isVisible("#weg-name") && /Mein Name/.test(await p.textContent("#weg-name")), `${art}: Knopf „Mein Name“ auf der Lesen-Seite`);
    await p.click("#weg-name"); await p.waitForTimeout(300);
    const k = await p.evaluate(() => ({ z: __lesen.spurZeichen(), n: __lesen.spurStriche(), wort: document.getElementById("spuren-wort").textContent, grau: [...document.querySelectorAll("#spuren text[fill=\"#B9AFCB\"]")].map(t => t.textContent).join("") }));
    erwarte(k.z === name && k.n >= name.replace("-", "").length && k.wort.includes(name), `${art}: der eigene Name „${name}“ als ein Wort, ${k.n} Striche`);
    if (name.includes("-")) erwarte(k.grau === "-", `${art}: Bindestrich steht grau dabei und wird übersprungen`);
    const r = await p.evaluate(() => { const b = document.getElementById("spuren").getBoundingClientRect(); return { rechts: b.right <= innerWidth + 1, hoch: b.height > 60, scroll: document.documentElement.scrollWidth <= innerWidth + 1 }; });
    erwarte(r.rechts && r.hoch && r.scroll, `${art}: der ganze Name passt auf den Bildschirm, keine Scrollleiste`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/meinname-${art}.png` });
    if (art === "quer") {   // falsch anfangen zählt nicht
      const b = await p.evaluate(() => { const r = document.getElementById("spuren").getBoundingClientRect(); return [r.x + r.width * 0.5, r.y + r.height * 0.95]; });
      await p.mouse.move(b[0], b[1]); await p.mouse.down(); await p.mouse.move(b[0] + 40, b[1] - 5, { steps: 4 }); await p.mouse.up();
      erwarte(await p.evaluate(() => __lesen.spurStrich() === 0), "quer: Malen ohne den Startpunkt zählt nicht");
    }
    await spureAlles(p);
    const e = await p.evaluate(() => ({ text: document.getElementById("spuren-ende").textContent, name: __lesen.stand().name, fund: (window.Lernfunde && Lernfunde.heute ? Lernfunde.heute() : []).some(f => /Namen geschrieben/.test(f.t)) }));
    erwarte(e.text.includes(name) && /Stift/.test(e.text) && e.name === 1, `${art}: geschafft – Ende mit Namen und Stift-Tipp, gezählt (${e.name})`);
    erwarte(e.fund, `${art}: Lernfund „Meinen Namen geschrieben“`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/meinname-${art}-ende.png` });
    await p.click("#spuren-mehr"); await p.waitForTimeout(300);
    erwarte(await p.evaluate((n) => __lesen.spurZeichen() === n && __lesen.spurStrich() === 0, name), `${art}: „Noch einmal“ beginnt wieder beim ersten Strich`);
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Mein-Name-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
