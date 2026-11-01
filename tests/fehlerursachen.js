// Test Fehler-Ursachen, Erst erklären und „Zeig mir deinen Weg“ im Matheweg (02.11.2026, Vorbild Bastion) – echt durchgeklickt:
// - neue Station „Plus über den Zehner“: Angebot „Erst erklären?“, Erklärung bis zum Ende (Beispiel, Ergänzen, Robos Fehler, Merksatz), dann die Runde
// - 34 + 28 = 52 → kurze Erklärung „Übertrag“; zweimal → lange Erklärung in drei Teilen, zwei Kontrastaufgaben, beide richtig → aufgelöst
// - zweiter Besuch: kein Angebot mehr, 💡 öffnet die Erklärung jederzeit
// - Schriftlich plus: falsches Ergebnis → Schrittweg Stelle für Stelle, Übertrag vergessen an der Zehnerstelle erkannt, „Dein Fehler lag bei den Zehnern“
// Aufruf: sh tests/laufen.sh fehlerursachen
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, serviceWorkers: "block" });
  await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__testOffen = true; });
  const p = await ctx.newPage();
  p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
  p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
  await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
  await p.evaluate(() => { for (let i = 0; i < 12; i++) Zeit.aufgabe(); Spielwelt.speichere("mathe", { weg: "k2" }); });
  await p.goto(BASIS + "spiele/mathe/"); await p.waitForTimeout(500);

  const weiter = async () => { await p.click("#weiter"); await p.waitForTimeout(200); };
  const tippe = async (zahl) => { for (const z of String(zahl)) await p.click(`.taste[data-ziffer="${z}"]`); await p.click('.taste[data-tun="ok"]'); };
  const fv = (id) => p.evaluate((id) => ((Spielwelt.lade("mathe").fv || {})[id] || {}).s || "", id);
  const nr = (id) => p.evaluate((id) => Mathe.STATIONEN.findIndex(s => s.id === id), id);

  // ---------- Erst erklären ----------
  await p.evaluate((n) => __mathe.starte(n, true), await nr("plusUeber")); await p.waitForTimeout(300);
  erwarte(await p.isVisible("#angebot") && await p.isVisible("#erklaer-ja") && await p.isVisible("#erklaer-nein"), "neue Station: Angebot „Erst erklären?“ mit zwei Knöpfen");
  await bild(p, "fu-angebot");
  await p.click("#erklaer-ja"); await p.waitForTimeout(200);
  erwarte(await p.evaluate(() => /über den Zehner/.test(document.getElementById("tafel").textContent)), "Schritt 1: Ziel in einem Satz");
  await weiter();
  erwarte(await p.evaluate(() => document.querySelectorAll(".erklaer-zeilen li").length === 3), "Schritt 2: vorgerechnetes Beispiel in drei Zeilen");
  await bild(p, "fu-beispiel");
  await weiter();
  await p.click('[data-e="52"]'); await p.waitForTimeout(150);
  erwarte(await p.evaluate(() => /genau hin/.test(document.getElementById("rueck").textContent)) && !(await p.isVisible("#weiter")), "Schritt 3: falsch ergänzt → freundlicher Hinweis, noch kein Weiter");
  await p.click('[data-e="53"]'); await p.waitForTimeout(150);
  erwarte(await p.evaluate(() => document.getElementById("luecke").textContent === "53"), "Schritt 3: richtig ergänzt (53)");
  await weiter();
  await p.click('[data-g="nein"]'); await p.waitForTimeout(150);
  erwarte(await p.isVisible("#warum") && await p.evaluate(() => /Robo hat sich vertan/.test(document.getElementById("rueck").textContent)), "Schritt 4: Robos Fehler erkannt, Begründung sichtbar");
  await bild(p, "fu-gegenbeispiel");
  await weiter();
  erwarte(await p.evaluate(() => /Merke dir/.test(document.getElementById("tafel").textContent)), "Schritt 5: Merksatz");
  await weiter();
  let l = await p.evaluate(() => ({ st: __mathe.lauf && __mathe.lauf.station.id, erkl: (Spielwelt.lade("mathe").erklaert || {}).plusUeber, n: __mathe.lauf && __mathe.lauf.liste.length }));
  erwarte(l.st === "plusUeber" && l.erkl === 1 && l.n === 10, "nach der Erklärung startet die Runde, Erklärung gemerkt");

  // ---------- Denkfehler ----------
  await p.evaluate(() => __mathe.setzeAufgabe({ text: "34 + 28", antwort: "62", art: "zahl", hilfe: "Erst die Zehner, dann die Einer." }));
  await tippe(52); await p.waitForTimeout(300);
  erwarte(await p.evaluate(() => /Zehner muss mit/.test(document.getElementById("rueck").textContent)) && await fv("uebertrag") === "aufgefallen", "34 + 28 = 52: kurze Erklärung zur Ursache (Übertrag), Denkfehler aufgefallen");
  await bild(p, "fu-kurz");
  await p.waitForTimeout(1300); await tippe(62); await p.waitForTimeout(1200);
  await p.evaluate(() => __mathe.setzeAufgabe({ text: "45 + 37", antwort: "82", art: "zahl", hilfe: "Erst die Zehner, dann die Einer." }));
  await tippe(72); await p.waitForTimeout(800);
  erwarte(await p.isVisible("#denkfehler") && await p.evaluate(() => document.querySelectorAll("#denkfehler p").length === 3 && /Übertrag vergessen/.test(document.getElementById("denkfehler").textContent)) && await fv("uebertrag") === "vermutet",
    "zweites Mal: lange Erklärung in drei Teilen (So denkst du – Warum nicht – So stimmt es)");
  await bild(p, "fu-lang");
  const pos = await p.evaluate(() => __mathe.lauf.pos);
  await p.click("#weiter"); await p.waitForTimeout(250);
  l = await p.evaluate((pos) => ({ k: __mathe.lauf.liste.slice(pos + 1, pos + 3).map(a => a.kontrast), s: (Spielwelt.lade("mathe").fv.uebertrag || {}).s }), pos);
  erwarte(l.k.join() === "uebertrag,uebertrag" && l.s === "arbeit", "zwei Kontrastaufgaben gleich danach, Denkfehler „wird geübt“");
  await tippe(82); await p.waitForTimeout(1200);
  for (let i = 0; i < 2; i++) { const a = await p.evaluate(() => __mathe.lauf.liste[__mathe.lauf.pos]); erwarte(!!a.kontrast && a.station === "plusUeber", `Kontrastaufgabe ${i + 1}: ${a.text}`); await tippe(a.antwort); await p.waitForTimeout(i ? 400 : 1200); }
  erwarte(await fv("uebertrag") === "aufgeloest" && await p.evaluate(() => /im Griff/.test(document.getElementById("rueck").textContent)), "beide Kontrastaufgaben richtig: Denkfehler aufgelöst, Lob dazu");
  await p.waitForTimeout(900);

  // ---------- 💡 jederzeit ----------
  await p.click("#zum-weg"); await p.waitForTimeout(200);
  await p.evaluate((n) => __mathe.starte(n, true), await nr("plusUeber")); await p.waitForTimeout(300);
  erwarte(!(await p.isVisible("#angebot")) && await p.isVisible("#erklaer-knopf"), "zweiter Besuch: kein Angebot mehr, 💡 in der Kopfzeile");
  await p.click("#erklaer-knopf"); await p.waitForTimeout(200);
  for (let i = 0; i < 2; i++) await weiter();
  await p.click('[data-e="53"]'); await weiter(); await p.click('[data-g="nein"]'); await weiter(); await weiter();
  erwarte(await p.evaluate(() => __mathe.lauf && __mathe.lauf.station.id === "plusUeber" && !!document.getElementById("ausdruck")), "💡-Erklärung durchgeklickt, zurück zur Aufgabe");

  // ---------- Zeig mir deinen Weg ----------
  await p.evaluate(() => { const d = Spielwelt.lade("mathe"); d.weg = "k3"; Spielwelt.speichere("mathe", d); });
  await p.goto(BASIS + "spiele/mathe/"); await p.waitForTimeout(500);
  await p.evaluate(() => __mathe.starte(Mathe.STATIONEN_K3.findIndex(s => s.id === "k3schriftplus"), true)); await p.waitForTimeout(300);
  await p.click("#erklaer-nein"); await p.waitForTimeout(300);
  await p.evaluate(() => __mathe.setzeAufgabe({ text: "", antwort: "632", art: "zahl", nurLuecke: true, frage: "Rechne schriftlich.", hilfe: "Einer: 7 + 5 = 12 …", ops: { a: 347, b: 285, op: "+" } }));
  await tippe(522); await p.waitForTimeout(900);
  erwarte(await p.evaluate(() => /Zeig mir deinen Weg/.test(document.getElementById("tafel").textContent) && /Einern/.test(document.getElementById("ausdruck").textContent)), "falsches Ergebnis: „Zeig mir deinen Weg“ beginnt bei den Einern");
  await tippe(2); await p.waitForTimeout(250);
  erwarte(await p.evaluate(() => /Zehnern/.test(document.getElementById("ausdruck").textContent) && document.querySelectorAll(".weg-liste .gut").length === 1), "Einer richtig (2) ✓, weiter zu den Zehnern");
  await tippe(2); await p.waitForTimeout(250);
  erwarte(await p.evaluate(() => /Übertrag/.test(document.getElementById("rueck").textContent)), "Zehner 2 statt 3: Hinweis auf den vergessenen Übertrag");
  await bild(p, "fu-weg");
  await p.waitForTimeout(700); await tippe(3); await p.waitForTimeout(250); await tippe(6); await p.waitForTimeout(300);
  erwarte(await p.evaluate(() => /Dein Fehler lag bei den Zehnern/.test(document.getElementById("weg-ende").textContent) && /Übertrag vergessen/.test(document.getElementById("weg-ende").textContent)), "Ende: „Dein Fehler lag bei den Zehnern“, Denkfehler benannt");
  await bild(p, "fu-weg-ende");
  erwarte(await fv("uebertrag") === "wieder", "Denkfehler aus dem Schrittweg zählt für die Diagnose (war aufgelöst → wieder da)");
  await weiter();
  erwarte(await p.evaluate(() => !!document.getElementById("ausdruck") && !__mathe.lauf.weg), "Weiter: nächste Aufgabe");

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Fehler-Ursachen-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
