// Test Schach mit Tilda (spiele/schach/): alles per Antippen auf dem Brett.
// - Lektion „Der Turm“: illegaler Zug (schräg) wird abgelehnt, alle Sterne gesammelt → gelernt, gespeichert, Stern
// - „Weiter“ → nächste Lektion; Lektion „Der Springer“ bis zum Ende (springt über Bauern, eigene Figur nicht schlagbar)
// - Rätsel Matt in 1: falscher Zug → „noch kein Matt“, Brett wird zurückgestellt; richtiger Zug → gelöst, ✅ in der Auswahl
// - Gegen Tilda (leicht): illegaler Bauernzug abgelehnt, schwarze Figur nicht wählbar, legaler Zug → Tilda antwortet
// - Zu zweit (mit gedrehtem Brett): Narrenmatt bis „Schachmatt! Schwarz gewinnt!“, Moment in Familie gemerkt
// Keine Konsolenfehler, keine waagerechte Scrollleiste (iPad quer, Handy). Aufruf: sh tests/laufen.sh schach
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const feld = (n) => (8 - +n[1]) * 8 + (n.charCodeAt(0) - 97);

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const passt = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  async function kind(breite, hoehe) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "3");
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  const tippe = async (p, n, warte = 60) => { await p.click(`#brett [data-i="${feld(n)}"]`); await p.waitForTimeout(warte); };
  const ziehe = async (p, von, nach, warte = 80) => { await tippe(p, von); await tippe(p, nach, warte); };
  const an = (p, n) => p.evaluate((i) => __schach.brett[i], feld(n));
  const ziele = (p) => p.locator("#brett .f.ziel, #brett .f.schlag").count();
  const tilda = (p) => p.evaluate(() => document.getElementById("tilda-text").textContent);
  const daten = (p) => p.evaluate(() => Spielwelt.lade("schach") || {});

  {
    const { ctx, p } = await kind(1180, 820);
    await p.goto(BASIS + "spiele/schach/"); await p.waitForTimeout(500);
    const start = await p.evaluate(() => ({ l: document.querySelectorAll("#lektionen [data-l]").length, r: document.querySelectorAll("#raetsel [data-r]").length, t: document.getElementById("tilda-text").textContent }));
    erwarte(start.l === 6 && start.r === 9 && /Hallo Mira/.test(start.t) && await passt(p), "Auswahl: 6 Lektionen, 9 Rätsel, Tilda begrüßt Mira");

    // ---------- Lektion Turm ----------
    const sterne0 = await p.evaluate(() => Spielwelt.sterne());
    await p.click('#lektionen [data-l="0"]'); await p.waitForTimeout(200);
    erwarte(await p.evaluate(() => !document.getElementById("spiel").hidden && /Turm/.test(document.getElementById("spiel-titel").textContent)) && await p.locator("#brett .stern").count() === 4, "Lektion „Der Turm“: Brett mit 4 Sternen");
    await tippe(p, "a1");
    erwarte(await ziele(p) === 14, "Turm antippen: 14 grüne Zielfelder (gerade Linien)");
    await tippe(p, "b2");
    erwarte(await an(p, "a1") === "R" && await an(p, "b2") === "." && await ziele(p) === 0, "schräger Turmzug a1→b2 wird abgelehnt, Turm bleibt stehen");
    await ziehe(p, "a1", "a5");
    erwarte(await an(p, "a5") === "R" && await p.locator("#brett .stern").count() === 3, "a1→a5: Stern eingesammelt (noch 3)");
    await ziehe(p, "a5", "e5"); await ziehe(p, "e5", "e8");
    if (BILDER) await p.screenshot({ path: `${BILDER}/schach-lektion.png` });
    await ziehe(p, "e8", "h8", 200);
    let d = await daten(p);
    erwarte(d.lektionen && d.lektionen.turm === 1 && /Alle Sterne gesammelt/.test(await tilda(p)) && await p.isVisible("#nochmal") && await p.evaluate((s) => Spielwelt.sterne() >= s + 1, sterne0), "alle Sterne gesammelt: Turm gelernt, gespeichert, +1 ⭐");
    await tippe(p, "h8"); await tippe(p, "h1");
    erwarte(await an(p, "h8") === "R", "nach dem Ende bewegt sich nichts mehr");

    // ---------- Weiter → Läufer, dann Springer bis zum Ende ----------
    await p.click("#nochmal"); await p.waitForTimeout(200);
    erwarte(await p.evaluate(() => /Läufer/.test(document.getElementById("spiel-titel").textContent)) && await an(p, "c1") === "B", "„Weiter“ startet die nächste Lektion (Läufer)");
    await ziehe(p, "c1", "c4");
    erwarte(await an(p, "c1") === "B" && await an(p, "c4") === ".", "gerader Läuferzug c1→c4 wird abgelehnt");
    await p.click("#zurueck"); await p.waitForTimeout(200);
    erwarte(await p.evaluate(() => /✅ gelernt/.test(document.querySelector('#lektionen [data-l="0"]').textContent)), "Auswahl: Turm mit ✅ gelernt");
    await p.click('#lektionen [data-l="4"]'); await p.waitForTimeout(200);
    await tippe(p, "b1");
    const springerZiele = await p.evaluate(() => Array.from(document.querySelectorAll("#brett .f.ziel, #brett .f.schlag")).map(f => +f.dataset.i).sort((a, b) => a - b));
    erwarte(JSON.stringify(springerZiele) === JSON.stringify([feld("c3"), feld("a3")].sort((a, b) => a - b)), "Springer auf b1: nur a3 und c3 (d2 ist eigene Figur)");
    await tippe(p, "d2");
    erwarte(await an(p, "b1") === "N" && await an(p, "d2") === "P", "Springer kann den eigenen Bauern auf d2 nicht schlagen");
    await ziehe(p, "b1", "b3");
    erwarte(await an(p, "b1") === "N", "Springerzug b1→b3 (gerade) wird abgelehnt");
    await ziehe(p, "b1", "c3"); await ziehe(p, "c3", "d5"); await ziehe(p, "d5", "f6"); await ziehe(p, "f6", "g8", 200);
    d = await daten(p);
    erwarte(d.lektionen.springer === 1 && /Alle Sterne/.test(await tilda(p)), "Lektion „Der Springer“ bis zum Ende: gelernt und gespeichert");
    erwarte(await p.evaluate(() => JSON.stringify(Spielwelt.lade("lernfunde") || {}).includes("Springer")), "Lernfund „So zieht der Springer“ gemerkt");

    // ---------- Rätsel Matt in 1 ----------
    await p.click("#zurueck"); await p.waitForTimeout(150);
    await p.click('#raetsel [data-r="0"]'); await p.waitForTimeout(200);
    await ziehe(p, "a1", "a2", 150);
    erwarte(/noch kein Matt/.test(await tilda(p)) && !(await daten(p)).raetsel[0], "Rätsel 1: Ta2 ist kein Matt → Hinweis");
    await p.waitForTimeout(1600);
    erwarte(await an(p, "a1") === "R" && await an(p, "a2") === ".", "Brett wird zurückgestellt");
    await ziehe(p, "a1", "a8", 200);
    erwarte((await daten(p)).raetsel[0] === 1 && /Schachmatt/.test(await tilda(p)), "Ta8# – Rätsel gelöst und gespeichert");
    if (BILDER) await p.screenshot({ path: `${BILDER}/schach-raetsel.png` });
    await p.click("#zurueck"); await p.waitForTimeout(150);
    erwarte(await p.evaluate(() => /✅/.test(document.querySelector('#raetsel [data-r="0"]').textContent)), "Auswahl: Rätsel 1 mit ✅");

    // ---------- Gegen Tilda (leicht) ----------
    await p.click('[data-ki="1"]'); await p.waitForTimeout(200);
    await ziehe(p, "e2", "e5");
    erwarte(await an(p, "e2") === "P" && await an(p, "e5") === ".", "gegen Tilda: Bauer e2→e5 (drei Felder) wird abgelehnt");
    await tippe(p, "e7");
    erwarte(await ziele(p) === 0 && await p.locator("#brett .f.wahl").count() === 0, "schwarze Figur lässt sich nicht wählen");
    const schwarz = () => p.evaluate(() => __schach.brett.map(f => f !== "." && f === f.toLowerCase() ? f : ".").join(""));
    const vorher = await schwarz();
    await ziehe(p, "e2", "e4");
    erwarte(await an(p, "e4") === "P" && await an(p, "e2") === ".", "legaler Zug e2→e4");
    await p.waitForFunction(() => /Du bist dran|Achtung/.test(document.getElementById("tilda-text").textContent), null, { timeout: 5000 });
    erwarte(vorher !== await schwarz() && await an(p, "e4") === "P", "Tilda hat mit einer schwarzen Figur geantwortet, Weiß ist wieder dran");
    await ctx.close();
  }

  // ---------- Zu zweit, Narrenmatt mit gedrehtem Brett ----------
  {
    const { ctx, p } = await kind(1180, 820);
    await p.goto(BASIS + "spiele/schach/"); await p.waitForTimeout(400);
    await p.click("#zu-zweit"); await p.waitForTimeout(200);
    await p.check("#drehen");
    await ziehe(p, "f2", "f3", 650);
    erwarte(await p.evaluate(() => document.getElementById("brett").classList.contains("gedreht")) && /Schwarz ist am Zug/.test(await tilda(p)), "zu zweit: nach Weiß dreht sich das Brett, Schwarz ist am Zug");
    await tippe(p, "g2");
    erwarte(await ziele(p) === 0, "Weiß darf nicht zweimal hintereinander ziehen");
    await ziehe(p, "e7", "e5", 650);
    erwarte(await p.evaluate(() => !document.getElementById("brett").classList.contains("gedreht")), "nach Schwarz dreht sich das Brett zurück");
    await ziehe(p, "g2", "g4", 650);
    await ziehe(p, "d8", "h4", 650);
    const t = await tilda(p);
    erwarte(/Schachmatt! Schwarz gewinnt/.test(t) && await p.isVisible("#nochmal"), "Narrenmatt: „Schachmatt! Schwarz gewinnt!“");
    erwarte(await p.evaluate(() => (Spielwelt.lade("familie") || { momente: [] }).momente.some(m => m.a === "schach" && /Schwarz gewinnt/.test(m.t))), "gemeinsamer Moment „Schach zu zweit“ gemerkt");
    if (BILDER) await p.screenshot({ path: `${BILDER}/schach-zuzweit.png` });
    await tippe(p, "e2");
    erwarte(await ziele(p) === 0, "nach dem Matt lässt sich nichts mehr ziehen");
    await ctx.close();
  }

  // ---------- Handy hoch ----------
  {
    const { ctx, p } = await kind(390, 760);
    await p.goto(BASIS + "spiele/schach/"); await p.waitForTimeout(400);
    const ok1 = await passt(p);
    await p.click('#lektionen [data-l="3"]'); await p.waitForTimeout(200);
    await ziehe(p, "e1", "e2"); await ziehe(p, "e2", "e3"); await ziehe(p, "e3", "f3"); await ziehe(p, "f3", "g3"); await ziehe(p, "g3", "g2"); await ziehe(p, "g2", "g1", 200);
    erwarte(ok1 && await passt(p) && (await daten(p)).lektionen.koenig === 1, "Handy: Lektion „Der König“ Schritt für Schritt geschafft, keine Scrollleiste");
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Schach-Test (Lektionen, illegale Züge, Rätsel, gegen Tilda, zu zweit) bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
