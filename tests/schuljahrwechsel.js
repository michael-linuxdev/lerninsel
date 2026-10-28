// Test Schuljahreswechsel und Ferien (NA-61, 30.10.2026):
// - Einrichtung merkt das Schuljahr; vor dem 1. August keine Frage
// - ab 1. August: Hinweis auf der Startseite, Karte im Elternbereich; „Ja“ → nächste Klasse, Matheweg und „gerade in der Schule“ neu
// - „Nein, bleibt“ (Wiederholen): still, nichts für das Kind sichtbar; „Andere Stufe“ mit Überspringen → Lücken-Check in Meine Ecke mit Matheweg der Klasse
// - alter Spielstand ohne Schuljahr: still das laufende Schuljahr, keine Frage
// - Ferien Sachsen: Karte „Ferien“, Tagesaufgabe „Ferien-Idee“ statt „Wort des Tages“, halbe Lernzeit nur mit Eltern-Erlaubnis, nicht außerhalb der Ferien,
//   nicht für andere Bundesländer
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const TAG = (j, m, d) => new Date(j, m - 1, d, 15, 0).getTime();

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, serviceWorkers: "block" });
  await ctx.addInitScript((t) => { let x = null; try { x = localStorage.getItem("__testJetzt"); } catch (e) { /* egal */ } window.__jetzt = x ? +x : t; window.__elternAlle = true; }, TAG(2026, 10, 25));
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
  const tag = (t) => p.evaluate((t) => localStorage.setItem("__testJetzt", String(t)), t);
  const eltern = async () => {
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(400);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(500); }
  };
  const kind = () => p.evaluate(() => Spielwelt.kind());

  // ---------- Einrichtung im Oktober 2026 ----------
  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
  await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "2"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
  let k = await kind();
  erwarte(k.schuljahr === 2026 && !(await p.$("#schuljahr-hinweis")), "Einrichtung im Oktober 2026: Schuljahr 2026/27 gemerkt, kein Hinweis");
  await p.evaluate(() => { Spielwelt.speichere("mathe", { weg: "k2" }); const e = Spielwelt.lade("eltern"); e.mathe = { schule: "rf" }; Spielwelt.speichere("eltern", e); });

  // ---------- 1. August 2027: Klasse 3 ----------
  await tag(TAG(2027, 7, 31)); await p.goto(BASIS); await p.waitForTimeout(300);
  erwarte(!(await p.$("#schuljahr-hinweis")), "31. Juli: noch keine Frage");
  await tag(TAG(2027, 8, 2)); await p.goto(BASIS); await p.waitForTimeout(300);
  erwarte(await p.evaluate(() => { const h = document.getElementById("schuljahr-hinweis"); return h && h.getBoundingClientRect().height > 20; }), "2. August: Hinweis für Erwachsene auf der Startseite");
  await bild(p, "schuljahr-start");
  await p.click("#schuljahr-hinweis"); await p.waitForURL(/eltern/); await p.waitForTimeout(400);
  if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(500); }
  erwarte(await p.evaluate(() => /2027\/28/.test(document.getElementById("schuljahr-frage").textContent) && /2\. Klasse/.test(document.getElementById("sj-bleibt").textContent) && /3\. Klasse/.test(document.getElementById("sj-ja").textContent)), "Elternbereich fragt: „Neues Schuljahr 2027/28 – jetzt in der 3. Klasse?“");
  await bild(p, "schuljahr-frage");
  await p.click("#sj-ja"); await p.waitForTimeout(400);
  k = await kind();
  erwarte(k.stufe === "3" && k.schuljahr === 2027 && !k.wiederholt && !(await p.$("#schuljahr-frage")) && await p.evaluate(() => !(Spielwelt.lade("mathe") || {}).weg && Spielwelt.lade("eltern").mathe.schule === ""), "„Ja“: 3. Klasse, Matheweg und „gerade in der Schule“ starten neu, Frage weg");
  await p.goto(BASIS + "spiele/mathe/"); await p.waitForTimeout(500);
  erwarte(await p.evaluate(() => /3\. Klasse/.test(document.querySelector(".weg-wahl.an").textContent)), "Matheweg öffnet jetzt Klasse 3");

  // ---------- 2028: bleibt in Klasse 3 (still) ----------
  await tag(TAG(2028, 8, 5)); await eltern();
  await p.click("#sj-bleibt"); await p.waitForTimeout(400);
  k = await kind();
  erwarte(k.stufe === "3" && k.schuljahr === 2028 && k.wiederholt === 2028, "„Nein, bleibt“: weiter 3. Klasse, Wiederholen still gemerkt");
  await p.goto(BASIS + "spiele/ich/"); await p.waitForTimeout(500);
  erwarte(await p.evaluate(() => document.getElementById("luecken-check").hidden && !/sitzen|wiederhol/i.test(document.body.innerText)), "Kind sieht nichts davon (kein „sitzengeblieben“, kein Check)");

  // ---------- 2029: von 3 auf 5 (Klasse 4 übersprungen) ----------
  await tag(TAG(2029, 8, 6)); await eltern();
  await p.selectOption("#sj-andere", "5"); await p.click("#sj-andere-ok"); await p.waitForTimeout(400);
  k = await kind();
  erwarte(k.stufe === "5" && JSON.stringify(k.luecken) === '["4"]' && !k.wiederholt, "„Andere Stufe“: Übergang 5, Klasse 4 als übersprungen gemerkt");
  await p.goto(BASIS + "spiele/ich/"); await p.waitForTimeout(500);
  erwarte(await p.evaluate(() => { const b = document.getElementById("luecken-check"); return !b.hidden && /Klasse 4/.test(b.textContent); }), "Meine Ecke: freiwilliger Lücken-Check „Klasse 4“");
  await bild(p, "schuljahr-luecken");
  await p.click('#luecken-check a[href*="mathe"]'); await p.waitForURL(/mathe/); await p.waitForTimeout(500);
  erwarte(await p.evaluate(() => /4\. Klasse/.test(document.querySelector(".weg-wahl.an").textContent) && !(Spielwelt.lade("mathe") || {}).weg), "Lücken-Check öffnet den Matheweg Klasse 4 (ohne die gespeicherte Wahl zu ändern)");

  // ---------- alter Spielstand ohne Schuljahr ----------
  await p.evaluate(() => { const e = Spielwelt.lade("eltern"); delete e.kind.schuljahr; Spielwelt.speichere("eltern", e); });
  await eltern();
  erwarte((await kind()).schuljahr === 2029 && !(await p.$("#schuljahr-frage")), "alter Spielstand ohne Schuljahr: still das laufende, keine Frage");

  // ---------- Ferien ----------
  await p.evaluate(() => { const e = Spielwelt.lade("eltern"); e.kind.stufe = "2"; e.kind.klasse = 2; e.kind.alter = 8; delete e.kind.geburt; Spielwelt.speichere("eltern", e); });
  const lern = () => p.evaluate(() => { Spielwelt.speichere("zeit", null); for (let i = 0; i < 4; i++) Zeit.aufgabe(); return Zeit.status().spielen; });   // je Prüfung frischer Tag
  await tag(TAG(2029, 9, 10)); await p.goto(BASIS + "spiele/ich/"); await p.waitForTimeout(400);
  erwarte(await p.evaluate(() => !Spielwelt.ferien() && !Charakter.aufgaben().some(a => a.id === "echtewelt") && Charakter.aufgaben().some(a => a.id === "wort")) && !(await lern()), "Schulzeit (10.09.2029): keine Ferien, „Wort des Tages“, 4 Aufgaben reichen nicht");
  await tag(TAG(2029, 10, 25)); await eltern();
  erwarte(await p.evaluate(() => /Gerade sind Herbstferien/.test(document.getElementById("ferien-karte").textContent)), "Herbstferien 2029: Ferien-Karte im Elternbereich");
  await bild(p, "schuljahr-ferien-eltern");
  await p.goto(BASIS + "spiele/ich/"); await p.waitForTimeout(400);
  erwarte(await p.evaluate(() => [...document.querySelectorAll("#aufgaben a[data-id], #aufgaben .aufgabe")].some(x => /Ferien-Idee/.test(x.textContent))) && !(await lern()), "Ferien: Tagesaufgabe „Ferien-Idee“; ohne Erlaubnis bleibt die volle Lernpflicht (4 Aufgaben reichen nicht)");
  await eltern(); await p.check("#fe-weniger"); await p.waitForTimeout(200);
  await p.goto(BASIS); await p.waitForTimeout(300);
  erwarte(await p.evaluate(() => Spielwelt.ferienWeniger()) && await lern(), "mit Eltern-Erlaubnis: in den Ferien reicht die halbe Lernpflicht (4 von 8 Aufgaben)");
  await eltern(); await p.uncheck("#fe-modus"); await p.waitForTimeout(200);
  erwarte(await p.evaluate(() => !Spielwelt.ferienModus() && !Spielwelt.ferienWeniger()), "Ferien-Modus abgeschaltet: auch keine halbe Lernzeit");
  await p.evaluate(() => { const e = Spielwelt.lade("eltern"); e.ferien = {}; e.kind.land = "nw"; Spielwelt.speichere("eltern", e); });
  erwarte(await p.evaluate(() => Spielwelt.ferien() === null), "anderes Bundesland: keine Ferien hinterlegt");

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Schuljahreswechsel-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
