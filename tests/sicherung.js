// Test Sicherungs-Erinnerung (02.11.2026, Vorbild Bastion): Im Elternbereich erinnert eine Karte an die Sicherungsdatei – zuerst nach 7 Tagen,
// danach einmal im Monat. Echt gesichert über Startseite → 💾 Spielstand → „Als Datei sichern“ (Download): Datum gemerkt, Karte weg.
// Aufruf: sh tests/laufen.sh sicherung
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const TAG = (d) => new Date(2026, 9, d, 15, 0).getTime();

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, serviceWorkers: "block", acceptDownloads: true });
  await ctx.addInitScript((t) => { let x = null; try { x = localStorage.getItem("__testJetzt"); } catch (e) { /* egal */ } window.__jetzt = x ? +x : t; window.__elternAlle = true; }, TAG(1));
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
  await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString()));
  const eltern = async () => { await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(400); if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(500); } };
  const tag = async (d) => { await p.evaluate((t) => localStorage.setItem("__testJetzt", String(t)), TAG(d)); };

  await eltern();
  erwarte(!(await p.$("#sicherung-erinnerung")), "erster Tag: noch keine Erinnerung");
  await tag(9); await eltern();
  erwarte(!!(await p.$("#sicherung-erinnerung")) && await p.evaluate(() => /noch nie gesichert/.test(document.getElementById("sicherung-erinnerung").textContent)), "nach 8 Tagen: Erinnerung „noch nie gesichert“");
  if (BILDER) await p.screenshot({ path: `${BILDER}/sicherung-erinnerung.png` });

  await p.goto(BASIS); await p.waitForTimeout(400);
  await p.click("#spielstand"); await p.waitForTimeout(300);
  const [dl] = await Promise.all([p.waitForEvent("download"), p.click('[data-tun="sichern"]')]);
  erwarte(/spielstand-2026-10-09\.json$/.test(dl.suggestedFilename()), `Datei gesichert (${dl.suggestedFilename()})`);
  await p.waitForTimeout(300);
  erwarte(await p.evaluate(() => (Spielwelt.lade("eltern") || {}).sicherung) === "2026-10-09", "Datum der Sicherung gemerkt");
  await eltern();
  erwarte(!(await p.$("#sicherung-erinnerung")), "nach der Sicherung: keine Erinnerung");
  await tag(31); await eltern();
  erwarte(!(await p.$("#sicherung-erinnerung")), "22 Tage später: noch keine Erinnerung");
  await p.evaluate((t) => localStorage.setItem("__testJetzt", String(t)), new Date(2026, 10, 9, 15, 0).getTime()); await eltern();
  erwarte(!!(await p.$("#sicherung-erinnerung")) && await p.evaluate(() => /09\.10\.2026/.test(document.getElementById("sicherung-erinnerung").textContent)), "einen Monat später: Erinnerung mit dem Datum der letzten Sicherung");

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Sicherungs-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
