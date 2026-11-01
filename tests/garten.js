// Playwright-Test (01.11.2026): Insel-Garten – gesperrt bis Kapitel 1, säen, gießen über echte Tage, nichts welkt, Ernte-Frage mit Fehler,
// Stern nur für die erste Ernte einer Pflanze, Beete je Klasse, Ort und Etappe E6 auf der Insel.
// Aufruf: sh tests/laufen.sh garten   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo/;
const TAG = (d) => new Date(2026, 9, d, 15, 0).getTime();

process.on("unhandledRejection", (e) => { console.log("❌ Abbruch: " + e.message + "\n  " + (global.__fehler || []).join("\n  ")); process.exit(1); });
(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const fehler = global.__fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true });
  await ctx.addInitScript((t) => { let x = null; try { x = localStorage.getItem("__testJetzt"); } catch (e) { /* egal */ } window.__jetzt = x ? +x : t; }, TAG(25));
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`Seitenfehler: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`Konsole: ${m.text()}`); });
  const tag = async (d) => { await p.evaluate((t) => localStorage.setItem("__testJetzt", String(t)), TAG(d)); };
  const garten = async () => { await p.goto(BASIS + "spiele/garten/"); await p.waitForLoadState("load"); await p.waitForTimeout(300); };

  // Ersteinrichtung (Klasse 2)
  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
  await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "2"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(600);

  // 1) gesperrt bis Kapitel 1
  await garten();
  erwarte(await p.isVisible("#zu") && !(await p.isVisible("#beete")), "vor Kapitel 1 ist der Garten zu (Hinweis sichtbar)");
  await p.evaluate(() => Story.setzeKapitel(1));
  await garten();
  const n = await p.locator(".beet").count();
  erwarte(n === 4, `Klasse 2: vier Beete (${n})`);
  if (BILDER) await p.screenshot({ path: `${BILDER}/garten-leer.png` });

  // 2) Kresse säen und gießen (Tag 1): Keim, „Morgen wieder“
  await p.click('[data-saeen="0"]'); await p.waitForSelector("[data-samen]");
  const samen = await p.$$eval("[data-samen]", l => l.map(b => b.dataset.samen));
  erwarte(samen.includes("tomate") && !samen.includes("mais"), `Samen nach Klasse (Kl. 2: Tomate ja, Mais erst ab Kl. 3): ${samen.join(", ")}`);
  await p.click('[data-samen="kresse"]');
  await p.waitForSelector('[data-beet="0"][data-art="samen"]');
  await p.click('[data-giessen="0"]'); await p.waitForTimeout(1100);
  erwarte(await p.$('[data-beet="0"][data-art="keim"]') !== null, "nach dem Gießen: ein Keim");
  erwarte(await p.isDisabled('[data-beet="0"] .knopf'), "heute schon gegossen → Knopf „Morgen wieder“");
  // Sonnenblume ins zweite Beet (über das freie Beet selbst)
  await p.click('[data-beet="1"] .erde'); await p.waitForSelector("[data-samen]"); await p.click('[data-samen="sonnenblume"]');
  await p.waitForTimeout(200);

  // 3) Tag 2: gießen → reif; Ernte-Frage erst falsch, dann richtig
  await tag(26); await garten();
  await p.click('[data-giessen="0"]'); await p.waitForTimeout(1100);
  erwarte(await p.$('[data-beet="0"][data-art="reif"]') !== null, "Tag 2: Kresse ist reif");
  const sterne0 = await p.evaluate(() => Spielwelt.sterne());
  await p.click('[data-ernten="0"]'); await p.waitForSelector("[data-antwort]");
  const falsch = await p.$('[data-antwort]:not([data-antwort="0"])'); await falsch.click();
  erwarte(await falsch.isDisabled(), "falsche Antwort wird markiert, nichts geht verloren");
  await p.click('[data-antwort="0"]'); await p.waitForSelector("#ernte-ok");
  if (BILDER) await p.screenshot({ path: `${BILDER}/garten-ernte.png` });
  await p.click("#ernte-ok"); await p.waitForTimeout(300);
  const d = await p.evaluate(() => ({ korb: Garten.lade().korb, sterne: Spielwelt.sterne(), beet0: Garten.lade().beete[0], fund: JSON.stringify(Spielwelt.lade("lernfunde") || {}) }));
  erwarte(d.korb.kresse === 1 && d.beet0 === null, "Kresse liegt im Korb, Beet ist wieder frei");
  erwarte(d.sterne === sterne0 + 1, `erste Kresse: ein Stern (${sterne0} → ${d.sterne})`);
  erwarte(/garten:kresse/.test(d.fund), "Lernfund für die erste Ernte");

  // 4) zweite Kresse: kein Stern mehr
  await p.click('[data-saeen="0"]'); await p.click('[data-samen="kresse"]'); await p.click('[data-giessen="0"]'); await p.waitForTimeout(1000);
  await tag(27); await garten(); await p.click('[data-giessen="0"]'); await p.waitForTimeout(1000);
  await p.click('[data-ernten="0"]'); await p.click('[data-antwort="0"]'); await p.click("#ernte-ok");
  const s2 = await p.evaluate(() => ({ korb: Garten.lade().korb.kresse, sterne: Spielwelt.sterne() }));
  erwarte(s2.korb === 2 && s2.sterne === d.sterne, `zweite Kresse: im Korb (${s2.korb}), kein neuer Stern`);

  // 5) eine Woche nicht da: die Sonnenblume ist nicht welk, sie wartet (Stufe unverändert)
  const vorher = await p.evaluate(() => Garten.lade().beete[1]);
  await tag(31); await garten();
  const nachher = await p.evaluate(() => ({ b: Garten.lade().beete[1], art: document.querySelector('[data-beet="1"]').dataset.art }));
  erwarte(nachher.b && nachher.b.p === "sonnenblume" && nachher.b.stufe === vorher.stufe && nachher.art !== "leer", `nach Tagen ohne Gießen: Sonnenblume wartet (Stufe ${nachher.b && nachher.b.stufe})`);

  // 6) Beete je Klasse: Klasse 3 sechs
  await p.evaluate(() => { const e = Spielwelt.lade("eltern"); e.kind.stufe = "3"; e.kind.klasse = 3; Spielwelt.speichere("eltern", e); });
  await garten();
  erwarte(await p.locator(".beet").count() === 6, "Klasse 3: sechs Beete");
  // Hochformat ohne waagerechten Überlauf
  await p.setViewportSize({ width: 820, height: 1180 }); await garten();
  erwarte(!(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)), "Hochformat: kein waagerechter Überlauf");
  if (BILDER) await p.screenshot({ path: `${BILDER}/garten-hoch.png`, fullPage: true });
  await p.setViewportSize({ width: 1180, height: 820 });

  // 7) Insel: Ort „garten“ mit Antwort und Ziel, Etappe E6 zeigt den Garten
  await p.evaluate(() => { Spielwelt.speichere("medien", { lektionen: { bedienung: 3 } }); });
  await p.goto(BASIS + "spiele/welt3d/heimat.html?stunde=14"); await p.waitForFunction(() => window.InselKern && window.Insel, null, { timeout: 30000 });
  const insel = await p.evaluate(() => {
    const a = InselKern.antwort("garten"), e6 = InselKern.ETAPPEN.find(e => e.id === "E6");
    return { ziel: a && a.blase[4], text: a && a.blase[2], ort: Insel.ORTE.includes("garten"), faellig: e6.faellig({}), genutzt: e6.genutzt(), knopf: InselKern.aktionFuer("garten")[0][1],
      szene: Szene.szenen ? JSON.stringify(Szene.szenen()) : "" };
  });
  erwarte(insel.ziel === "../garten/" && /Garten|gegossen|Durst|reif/.test(insel.text), `Insel: Garten-Blase führt in den Garten („${insel.text}“)`);
  erwarte(insel.ort && insel.knopf === "Garten", "Insel: Ort für die Zeigehand und Knopf „Garten“");
  erwarte(insel.faellig && insel.genutzt, "E6 ist fällig ab Kapitel 1 und gilt als genutzt, wenn schon gesät wurde");
  const vorKapitel = await p.evaluate(() => { const z = Story.zustand(); return InselKern.ortOffen("baeckerei") === false && InselKern.ortOffen("garten") === true; });
  erwarte(vorKapitel, "Bäckerei bleibt bis Kapitel 3 zu, Garten ist offen");
  if (BILDER) await p.screenshot({ path: `${BILDER}/garten-insel.png` });

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n  " + fehler.join("\n  ")); process.exit(1); }
  console.log("✅ Garten-Test bestanden.");
})();
