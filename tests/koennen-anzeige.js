// Playwright-Test (NA-50, Anzeige): „Mein Können“ in Meine Ecke und Fipsis Empfehlung in „Lesen und Schreiben“.
// Ohne geübte Lernziele: Karte versteckt, keine Empfehlung. Mit Können-Daten: Pflanze je Fach, Empfehlung in der Zielzone.
// Aufruf: sh tests/laufen.sh koennen-anzeige
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 } });
  await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
  await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "1");
  await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));

  await p.goto(BASIS + "spiele/ich/"); await p.waitForTimeout(600);
  erwarte(await p.evaluate(() => document.getElementById("koennen-karte").hidden), "ohne Übung: keine Karte „Mein Können“");
  await p.goto(BASIS + "spiele/lesen/"); await p.waitForFunction(() => !!window.__lesen);
  erwarte(await p.evaluate(() => !document.querySelector(".weg.tipp") && !/Heute passt/.test(document.getElementById("start-blase").textContent)), "ohne Übung: keine Empfehlung");

  // Können-Daten: Mathe sicher, Deutsch gemischt (Anlaute gemeistert, Silben in der Zielzone)
  await p.evaluate(() => Spielwelt.speichere("koennen", { "ma.zo.01": [95, 14, 0], "ma.zo.03": [80, 8, 0], "de.le.01": [97, 20, 0], "de.le.02": [96, 16, 0], "de.su.02": [95, 14, 0], "de.le.03": [78, 6, 0] }));
  await p.goto(BASIS + "spiele/ich/"); await p.waitForTimeout(600);
  const k = await p.evaluate(() => ({ hidden: document.getElementById("koennen-karte").hidden, faecher: [...document.querySelectorAll(".kn-fach")].map(x => x.dataset.fach + ":" + x.querySelector(".pflanze").textContent + ":" + x.querySelector("small").textContent) }));
  erwarte(!k.hidden && k.faecher.length === 2 && /^Mathe:/.test(k.faecher[0]) && /2 Sachen/.test(k.faecher[0]), `Karte zeigt Mathe und Deutsch (${k.faecher.join(" | ")})`);
  erwarte(!k.faecher.some(f => /%|Note/.test(f)), "keine Prozente, keine Noten");
  await p.goto(BASIS + "spiele/lesen/"); await p.waitForFunction(() => !!window.__lesen);
  const t = await p.evaluate(() => ({ tipp: (document.querySelector(".weg.tipp") || {}).id, text: document.getElementById("start-blase").textContent }));
  erwarte(t.tipp === "weg-silben" && /Silben lesen/.test(t.text), `Fipsi empfiehlt „Silben lesen“ (${t.tipp})`);

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Können-Anzeige-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
