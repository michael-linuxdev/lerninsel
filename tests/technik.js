// Test „Technik & Speicher“ (05.11.2026): Seitenfehler und ein voller Speicher landen im technischen Protokoll (nur auf dem Gerät,
// gleiche Meldungen gezählt, höchstens 30), der Elternbereich zeigt sie unter „Kinder & Gerät“ mit Speicherplatz und App-Version,
// „Protokoll leeren“ echt angetippt. Ohne Fehler steht „Keine Auffälligkeiten“.
// Aufruf: sh tests/laufen.sh technik
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, serviceWorkers: "block" });
  await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime();
    // Speicher-voll nachbilden, sobald der Test es einschaltet (nur für den Spielstand, nicht fürs Protokoll)
    const orig = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) { if (this === window.localStorage && sessionStorage.getItem("__voll") && /profil\.v1/.test(k)) { const e = new Error("voll"); e.name = "QuotaExceededError"; throw e; } return orig.call(this, k, v); }; });
  const p = await ctx.newPage();
  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
  await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString()));
  const kinder = async () => { await p.goto(BASIS + "spiele/eltern/#kinder"); await p.waitForTimeout(300); if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(300); } await p.click('.eltern-reiter [data-teil="kinder"]').catch(() => {}); await p.waitForSelector("#technik-karte"); await p.waitForFunction(() => !/geprüft/.test(document.getElementById("speicher-stand").textContent)); };

  await kinder();
  erwarte(await p.isVisible("#protokoll-leer"), "ohne Fehler: „Keine Auffälligkeiten“");
  erwarte(/Belegt: .*MB/.test(await p.textContent("#speicher-stand")), `Speicherplatz wird angezeigt („${(await p.textContent("#speicher-stand")).slice(0, 60)}…“)`);
  // zwei gleiche Seitenfehler und eine abgelehnte Promise auf einer Kinderseite
  await p.goto(BASIS + "spiele/mathe/"); await p.waitForTimeout(400);
  await p.evaluate(() => { for (let i = 0; i < 2; i++) setTimeout(() => { throw new Error("Testfehler 42"); }); Promise.reject(new Error("Testablehnung")); });
  await p.waitForTimeout(300);
  // Speicher voll: Spielstand lässt sich nicht mehr lokal schreiben
  await p.evaluate(() => { sessionStorage.setItem("__voll", "1"); Spielwelt.speichere("mathe", Object.assign({}, Spielwelt.lade("mathe"), { test: 1 })); sessionStorage.removeItem("__voll"); });
  const l = await p.evaluate(() => Spielwelt.protokoll());
  erwarte(l.some(x => x.a === "fehler" && /Testfehler 42/.test(x.t) && x.n === 2 && x.s === "spiele/mathe"), "Seitenfehler gemerkt, gleiche Meldung gezählt (2×), mit Seite");
  erwarte(l.some(x => /Testablehnung/.test(x.t)), "abgelehnte Promise gemerkt");
  erwarte(l.some(x => x.a === "speicher"), "voller Speicher gemerkt");
  await kinder();
  const k = await p.evaluate(() => ({ n: document.querySelectorAll("#protokoll-liste li").length, t: document.getElementById("technik-karte").textContent }));
  erwarte(k.n === 3 && /2×/.test(k.t) && /💾 Speicher/.test(k.t), `Elternbereich „Kinder & Gerät“: ${k.n} Einträge mit Zähler und Speicher-Hinweis`);
  if (BILDER) await p.locator("#technik-karte").screenshot({ path: `${BILDER}/technik-karte.png` });
  await p.click("#protokoll-leeren"); await p.waitForSelector("#protokoll-leer");
  erwarte((await p.evaluate(() => Spielwelt.protokoll().length)) === 0, "„Protokoll leeren“ echt angetippt: leer");
  await p.evaluate(() => { for (let i = 0; i < 40; i++) Spielwelt.merke("fehler", "Fehler Nr. " + i); });
  erwarte((await p.evaluate(() => Spielwelt.protokoll().length)) === 30, "höchstens 30 Einträge");
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Technik-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
