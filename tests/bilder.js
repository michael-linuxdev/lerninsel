// Playwright-Test (01.11.2026): eigene Bilder statt Emojis – der Baustein ersetzt bekannte Emojis durch die eigenen Bilder (Stil A),
// der Text bleibt unsichtbar erhalten (textContent), Eingabefelder bleiben unberührt, neue Inhalte werden nachträglich ersetzt,
// Eltern-Wahl „Emojis des Geräts“ (eltern.bilder = "geraet") schaltet den Ersatz ab.
// Aufruf: sh tests/laufen.sh bilder   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo/;
process.on("unhandledRejection", (e) => { console.log("❌ Abbruch: " + e.message + "\n  " + (global.__fehler || []).join("\n  ")); process.exit(1); });
(async () => {
  const browser = await chromium.launch();
  const fehler = global.__fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true });
  await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`Seitenfehler: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`Konsole: ${m.text()}`); });
  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
  await p.fill("#e-name", "Mira ⭐"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(800);
  // Startseite: Stern-Knopf zeigt das eigene Bild, Text enthält weiter ⭐
  const s = await p.evaluate(() => ({ n: document.querySelectorAll(".emo").length, stern: !!document.querySelector("#sterne") && document.querySelector("#sterne").parentElement.querySelector(".emo svg") !== null,
    text: document.querySelector("#sterne").parentElement.textContent, anzahl: window.__emoji ? __emoji.anzahl() : 0 }));
  erwarte(s.anzahl >= 100 && s.n > 5, `Startseite: ${s.n} Emojis durch eigene Bilder ersetzt (${s.anzahl} Bilder vorhanden)`);
  erwarte(s.stern && s.text.includes("⭐"), "Stern-Knopf: eigenes Bild, das Zeichen ⭐ bleibt im Text");
  if (BILDER) await p.screenshot({ path: `${BILDER}/bilder-start.png` });
  // nachträglich eingefügter Inhalt wird ersetzt, Eingabefelder nicht
  const nach = await p.evaluate(async () => {
    const d = document.createElement("div"); d.id = "probe"; d.textContent = "Ich mag 🍎 und 🦊"; document.body.appendChild(d);
    const i = document.createElement("input"); i.id = "probe-feld"; i.value = "🍎"; document.body.appendChild(i);
    await new Promise(r => setTimeout(r, 120));
    return { emo: d.querySelectorAll(".emo").length, text: d.textContent, feld: i.value, unbekannt: (() => { const x = document.createElement("p"); x.textContent = "🛸"; document.body.appendChild(x); return x; })() && true };
  });
  erwarte(nach.emo === 2 && nach.text === "Ich mag 🍎 und 🦊" && nach.feld === "🍎", "neuer Inhalt: 🍎 und 🦊 ersetzt, textContent unverändert, Eingabefeld unberührt");
  // Seiten mit vielen Emojis öffnen ohne Fehler
  for (const s of ["spiele/sachkunde/", "spiele/mathe/", "spiele/garten/", "spiele/ich/"]) { await p.goto(BASIS + s); await p.waitForLoadState("load"); await p.waitForTimeout(400); }
  erwarte(await p.evaluate(() => document.querySelectorAll(".emo").length > 0), "weitere Seiten (Sachunterricht, Mathe, Garten, Meine Ecke) laufen mit den Bildern");
  if (BILDER) await p.screenshot({ path: `${BILDER}/bilder-ich.png` });
  // Eltern-Wahl: Emojis des Geräts
  await p.evaluate(() => { const e = Spielwelt.lade("eltern"); e.bilder = "geraet"; Spielwelt.speichere("eltern", e); });
  await p.goto(BASIS); await p.waitForLoadState("load"); await p.waitForTimeout(500);
  erwarte(await p.evaluate(() => !window.__emoji && document.querySelectorAll(".emo").length === 0), "Eltern-Wahl „Emojis des Geräts“: kein Ersatz");
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n  " + fehler.join("\n  ")); process.exit(1); }
  console.log("✅ Bilder-Test bestanden.");
})();
