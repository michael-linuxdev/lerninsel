// Test Fehler-Ursachen, Erst erklären und „Zeig mir deinen Weg“ im Matheweg (02.11.2026, Vorbild Bastion) – echt durchgeklickt:
// - neue Station „Plus über den Zehner“: Angebot „Erst erklären?“, kindgerechte Erklärung bis zum Ende (03.11.2026: Schritt für Schritt mit ▶,
//   selbst Punkte antippen – die volle 10 wird ein Zehner –, ergänzen, Robos Fehler, Bildergeschichte; 🔊 an jeder Blase), dann die Runde
// - 34 + 28 = 52 → kurze Erklärung; zweimal → „Fast! Schau mal.“ mit Bild und drei kurzen Sätzen, zwei Kontrastaufgaben, beide richtig → aufgelöst
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
  await p.evaluate(() => { window.__testSchnell = true; });

  const weiter = async () => { await p.click("#weiter"); await p.waitForTimeout(200); };
  const tippe = async (zahl) => { for (const z of String(zahl)) await p.click(`.taste[data-ziffer="${z}"]`); await p.click('.taste[data-tun="ok"]'); };
  const fv = (id) => p.evaluate((id) => ((Spielwelt.lade("mathe").fv || {})[id] || {}).s || "", id);
  const nr = (id) => p.evaluate((id) => Mathe.STATIONEN.findIndex(s => s.id === id), id);

  // ---------- Erst erklären ----------
  await p.evaluate((n) => __mathe.starte(n, true), await nr("plusUeber")); await p.waitForTimeout(300);
  erwarte(await p.isVisible("#angebot") && await p.isVisible("#erklaer-ja") && await p.isVisible("#erklaer-nein"), "neue Station: Angebot „Erst erklären?“ mit zwei Knöpfen");
  await bild(p, "fu-angebot");
  await p.click("#erklaer-ja"); await p.waitForTimeout(200);
  {
    const blase = await p.evaluate(() => ({ t: document.getElementById("satz").textContent, hoer: !!document.getElementById("satz-hoer"), bild: !!document.querySelector(".erklaer-bild svg") }));
    erwarte(/38 sind 3 Zehner/.test(blase.t) && blase.hoer && blase.bild, "A Schritt für Schritt: Benno sagt einen Satz, 🔊 daneben, Bild darunter");
  }
  await bild(p, "fu-zeigen");
  for (let k = 0; k < 3; k++) { await p.click("#weiter"); await p.waitForTimeout(150); }   // ▶ ▶ ▶
  erwarte(await p.evaluate(() => /43/.test(document.getElementById("satz").textContent) && /Weiter/.test(document.getElementById("weiter").textContent)), "nach dreimal ▶: letzter Satz (43), dann Weiter");
  await weiter();
  // B Selbst machen: 5 blaue Punkte antippen, nach dem zweiten ist die 10 voll und wird ein Zehner
  erwarte(!(await p.isVisible("#weiter")) && await p.evaluate(() => document.querySelectorAll("#machen-bild .wartet").length === 5), "B Selbst machen: 5 blaue Punkte warten, noch kein Weiter");
  await p.click("#machen-bild .wartet >> nth=0"); await p.waitForTimeout(80); await p.click("#machen-bild .wartet >> nth=0"); await p.waitForTimeout(80);
  await p.waitForTimeout(200);
  erwarte(await p.evaluate(() => /40/.test(document.getElementById("satz").textContent) && document.querySelectorAll("#machen-bild rect[height='78']").length === 4), "die 10 ist voll und wird ein Zehner: jetzt 40");
  await bild(p, "fu-machen");
  await p.waitForTimeout(300);
  for (let k = 0; k < 3; k++) { await p.click("#machen-bild .wartet >> nth=0"); await p.waitForTimeout(80); }
  erwarte(await p.evaluate(() => /38 \+ 5 = 43/.test(document.getElementById("machen-ergebnis").textContent) && document.querySelectorAll("#machen-bild rect[height='78']").length === 4), "alle getippt: 4 Zehner und 3 – „38 + 5 = 43“");
  await weiter();
  await p.click('[data-e="52"]'); await p.waitForTimeout(150);
  erwarte(await p.evaluate(() => /genau hin/.test(document.getElementById("rueck").textContent)) && !(await p.isVisible("#weiter")), "Ergänzen: falsch → freundlicher Hinweis, noch kein Weiter");
  await p.click('[data-e="53"]'); await p.waitForTimeout(150);
  erwarte(await p.evaluate(() => document.getElementById("luecke").textContent === "53"), "Ergänzen: richtig (53)");
  await weiter();
  await p.click('[data-g="nein"]'); await p.waitForTimeout(150);
  erwarte(await p.isVisible("#warum") && await p.evaluate(() => /Robo hat sich vertan/.test(document.getElementById("rueck").textContent) && !!document.querySelector("#warum svg")), "Robos Fehler erkannt, Begründung mit Bild");
  await bild(p, "fu-gegenbeispiel");
  await weiter();
  erwarte(await p.evaluate(() => document.querySelectorAll(".geschichte > div").length === 3 && /10 voll/.test(document.getElementById("tafel").textContent)), "C Bildergeschichte: drei Bilder mit je einem Satz");
  await bild(p, "fu-geschichte");
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
  erwarte(await p.isVisible("#denkfehler") && await p.evaluate(() => { const k = document.getElementById("denkfehler"); return k.querySelectorAll(":scope > p").length === 3 && /Fast! Schau mal/.test(k.textContent) && !!k.querySelector(".erklaer-bild svg") && !!document.getElementById("fehler-hoer") && !/Übertrag|Denkfehler/.test(k.textContent); }) && await fv("uebertrag") === "vermutet",
    "zweites Mal: „Fast! Schau mal.“ mit Bild, 🔊 und drei kurzen Sätzen ohne Fachwörter");
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
  for (let k = 0; k < 4; k++) await weiter();   // ▶ ▶ ▶ Weiter
  for (let k = 0; k < 5; k++) { await p.click("#machen-bild .wartet >> nth=0"); await p.waitForTimeout(k === 1 ? 300 : 80); }
  await weiter(); await p.click('[data-e="53"]'); await weiter(); await p.click('[data-g="nein"]'); await weiter(); await weiter();
  erwarte(await p.evaluate(() => __mathe.lauf && __mathe.lauf.station.id === "plusUeber" && !!document.getElementById("ausdruck")), "💡-Erklärung durchgeklickt, zurück zur Aufgabe");

  // ---------- Geteilt (04.11.2026): Erklär-Einheit echt durchgeklickt, Denkfehler „minus statt geteilt“ ----------
  await p.click("#zum-weg"); await p.waitForTimeout(200);
  await p.evaluate((n) => __mathe.starte(n, true), await nr("geteilt")); await p.waitForTimeout(300);
  await p.click("#erklaer-ja"); await p.waitForTimeout(200);
  erwarte(await p.evaluate(() => /Wie oft passt die 3 in die 12/.test(document.getElementById("satz").textContent) && !!document.querySelector(".erklaer-bild svg")), "Geteilt: Benno fragt „Wie oft passt die 3 in die 12?“ mit Bild");
  for (let k = 0; k < 3; k++) { await p.click("#weiter"); await p.waitForTimeout(150); }
  await bild(p, "fu-geteilt-zeigen");
  await weiter();
  for (let k = 0; k < 4; k++) { await p.click("#plus-reihe"); await p.waitForTimeout(80); }
  erwarte(await p.evaluate(() => document.getElementById("machen-ergebnis").textContent === "12 : 3 = 4"), "Geteilt selbst machen: viermal ➕ – 12 Punkte in Dreier-Reihen, „12 : 3 = 4“");
  await weiter(); await p.click('[data-e="4"]'); await p.waitForTimeout(150); await weiter();
  await p.click('[data-g="nein"]'); await p.waitForTimeout(150);
  erwarte(await p.evaluate(() => /minus/.test(document.getElementById("warum").textContent) && !!document.querySelector("#warum svg")), "Robo rechnet 15 : 3 = 12: Begründung mit Bild");
  await bild(p, "fu-geteilt-robo");
  await weiter(); await weiter();
  erwarte(await p.evaluate(() => __mathe.lauf && __mathe.lauf.station.id === "geteilt" && (Spielwelt.lade("mathe").erklaert || {}).geteilt === 1), "Geteilt: Erklärung bis zum Ende, Runde startet");
  await p.evaluate(() => __mathe.setzeAufgabe({ text: "15 : 3", antwort: "5", art: "zahl", hilfe: "Denke an das Einmaleins." }));
  await tippe(12); await p.waitForTimeout(300);
  erwarte(await p.evaluate(() => /geteilt, nicht minus/.test(document.getElementById("rueck").textContent)) && await fv("geteiltminus") === "aufgefallen", "15 : 3 = 12: Hinweis „geteilt, nicht minus“, Denkfehler aufgefallen");
  await p.waitForTimeout(1300);

  // ---------- Zehner und Einer + „Zahl verdreht“ (04.11.2026) ----------
  await p.click("#zum-weg"); await p.waitForTimeout(200);
  await p.evaluate((n) => __mathe.starte(n, true), await nr("zehner")); await p.waitForTimeout(300);
  await p.click("#erklaer-ja"); await p.waitForTimeout(200);
  for (let k = 0; k < 3; k++) { await p.click("#weiter"); await p.waitForTimeout(150); }
  erwarte(await p.evaluate(() => /siebenundvierzig/.test(document.getElementById("satz").textContent)), "Zehner: „4 Zehner und 7 Einzelne: 47 – siebenundvierzig“");
  await weiter();
  for (let k = 0; k < 7; k++) { await p.click("#machen-bild .wartet >> nth=0"); await p.waitForTimeout(80); }
  erwarte(await p.evaluate(() => document.getElementById("machen-ergebnis").textContent === "40 + 7 = 47"), "Zehner selbst machen: 7 Einzelne zu 4 Zehnern getippt – 47");
  await weiter(); await p.click('[data-e="63"]'); await p.waitForTimeout(150); await weiter();
  await p.click('[data-g="nein"]'); await p.waitForTimeout(150); await weiter(); await weiter();
  erwarte(await p.evaluate(() => __mathe.lauf && __mathe.lauf.station.id === "zehner" && (Spielwelt.lade("mathe").erklaert || {}).zehner === 1), "Zehner: Erklärung bis zum Ende, Runde startet");
  await p.evaluate(() => __mathe.setzeAufgabe({ text: "", frage: "Welche Zahl ist das?", antwort: "52", art: "zahl", nurLuecke: true, hilfe: "5 Zehner und 2 Einer sind 52" }));
  await tippe(25); await p.waitForTimeout(300);
  erwarte(await p.evaluate(() => /zweiundfünfzig/.test(document.getElementById("rueck").textContent)) && await fv("dreher") === "aufgefallen", "52 als 25 geschrieben: Hinweis „Man sagt zweiundfünfzig …“, Denkfehler „Zahl verdreht“");
  await p.waitForTimeout(1300);
  // Minus bis 10 (Kl. 1) über den Test-Haken echt durchgeklickt
  await p.evaluate(() => { window.__fertig = false; __mathe.erklaere("k1minus10", () => { window.__fertig = true; }); }); await p.waitForTimeout(200);
  for (let k = 0; k < 3; k++) await weiter();
  for (let k = 0; k < 2; k++) { await p.click("#machen-bild .nimm >> nth=0"); await p.waitForTimeout(80); }
  erwarte(await p.evaluate(() => document.getElementById("machen-ergebnis").textContent === "5 − 2 = 3"), "Minus bis 10: 2 Punkte weggetippt – 5 − 2 = 3");
  await weiter(); await p.click('[data-e="4"]'); await p.waitForTimeout(150); await weiter();
  await p.click('[data-g="nein"]'); await p.waitForTimeout(150);
  erwarte(await p.evaluate(() => !!document.querySelector("#warum svg")), "Robo zählt die 8 mit: Begründung mit Zahlenstrahl");
  await weiter(); await weiter();
  erwarte(await p.evaluate(() => window.__fertig), "Minus bis 10: Erklärung bis zum Ende");

  // Bis 20 und Ergänzen (04.11.2026): über den Test-Haken echt durchgeklickt
  for (const [id, art, n, erg, wahl] of [["k1zerlegen", "wartet", 4, "3 + 4 = 7", "3"], ["k1doppelt", "wartet", 3, "3 + 3 = 6", "10"], ["plus20", "wartet", 5, "8 + 5 = 13", "13"], ["minus20", "nimm", 5, "13 − 5 = 8", "8"], ["ergaenzen", "wartet", 6, "34 + 6 = 40", "3"]]) {
    await p.evaluate((id) => { window.__fertig = false; __mathe.erklaere(id, () => { window.__fertig = true; }); }, id); await p.waitForTimeout(200);
    const nb = await p.evaluate((id) => MatheErklaeren.fuer(id)[0].bilder.length, id); for (let k = 0; k < nb; k++) await weiter();
    for (let k = 0; k < n; k++) { await p.click(`#machen-bild .${art} >> nth=0`); await p.waitForTimeout(80); if (k === 1 || k === 2) await p.waitForTimeout(250); }
    await p.waitForTimeout(200);
    const e = await p.evaluate(() => document.getElementById("machen-ergebnis").textContent);
    await weiter(); await p.click(`[data-e="${wahl}"]`); await p.waitForTimeout(150); await weiter();
    await p.click('[data-g="nein"]'); await p.waitForTimeout(150);
    const bildDa = await p.evaluate(() => !!document.querySelector("#warum svg"));
    await weiter(); await weiter();
    erwarte(e === erg && bildDa && await p.evaluate(() => window.__fertig), `Erklärung ${id}: selbst gemacht (${e}), Robos Fehler mit Bild, bis zum Ende`);
  }

  // ---------- Uhrzeit (04.11.2026): Erklärung mit Stunde einstellen, Denkfehler „Zeiger vertauscht“ bei Auswahl-Aufgaben ----------
  await p.click("#zum-weg"); await p.waitForTimeout(200);
  await p.evaluate((n) => __mathe.starte(n, true), await nr("uhr")); await p.waitForTimeout(300);
  await p.click("#erklaer-ja"); await p.waitForTimeout(200);
  erwarte(await p.evaluate(() => !!document.querySelector(".erkl-uhr")), "Uhr: Erklärung mit Uhr-Bild");
  for (let k = 0; k < 3; k++) { await p.click("#weiter"); await p.waitForTimeout(150); }
  await weiter();
  await p.click('#machen-bild .uhrzahl[data-h="2"]'); await p.waitForTimeout(120);
  const uhrFalsch = await p.evaluate(() => /Tipp auf die 4/.test(document.getElementById("satz").textContent) && !document.getElementById("weiter"));
  await p.click('#machen-bild .uhrzahl[data-h="4"]'); await p.waitForTimeout(120);
  erwarte(uhrFalsch && await p.evaluate(() => document.getElementById("machen-ergebnis").textContent === "4 Uhr"), "Uhr selbst stellen: erst die 2 (freundlicher Hinweis), dann die 4 – 4 Uhr");
  await bild(p, "fu-uhr-machen");
  await weiter(); await p.click('[data-e="7"]'); await p.waitForTimeout(150); await weiter();
  await p.click('[data-g="nein"]'); await p.waitForTimeout(150); await weiter(); await weiter();
  erwarte(await p.evaluate(() => __mathe.lauf && __mathe.lauf.station.id === "uhr" && (Spielwelt.lade("mathe").erklaert || {}).uhr === 1), "Uhr: Erklärung bis zum Ende, Runde startet");
  await p.evaluate(() => __mathe.setzeAufgabe(MatheFehler.uhrAufgabe(4, 30, () => 0.3)));
  await p.click('.taste[data-wert="6:20"]'); await p.waitForTimeout(300);
  erwarte(await p.evaluate(() => /kurze Zeiger zeigt die Stunde/.test(document.getElementById("rueck").textContent)) && await fv("zeigervertauscht") === "aufgefallen", "halb 5 als 6:20 gewählt: Hinweis „Der kurze Zeiger zeigt die Stunde“, Denkfehler „Zeiger vertauscht“");
  await p.waitForTimeout(1300);

  // ---------- Geld (04.11.2026): Münzen selbst antippen, Denkfehler „Münzen gezählt“ ----------
  await p.click("#zum-weg"); await p.waitForTimeout(200);
  await p.evaluate((n) => __mathe.starte(n, true), await nr("geld")); await p.waitForTimeout(300);
  await p.click("#erklaer-ja"); await p.waitForTimeout(200);
  for (let k = 0; k < 3; k++) { await p.click("#weiter"); await p.waitForTimeout(150); }
  await weiter();
  await p.click('#machen-bild .muenze[data-i="2"]'); await p.waitForTimeout(100);
  const erstGross = await p.evaluate(() => /Erst die große Münze: 50/.test(document.getElementById("satz").textContent));
  for (let i = 0; i < 4; i++) { await p.click(`#machen-bild .muenze[data-i="${i}"]`); await p.waitForTimeout(100); }
  erwarte(erstGross && await p.evaluate(() => document.getElementById("machen-ergebnis").textContent === "76 Cent"), "Geld selbst zählen: erst die große Münze, dann 50, 70, 75, 76 – 76 Cent");
  await bild(p, "fu-geld-machen");
  await weiter(); await p.click('[data-e="72"]'); await p.waitForTimeout(150); await weiter();
  await p.click('[data-g="nein"]'); await p.waitForTimeout(150); await weiter(); await weiter();
  erwarte(await p.evaluate(() => __mathe.lauf && __mathe.lauf.station.id === "geld" && (Spielwelt.lade("mathe").erklaert || {}).geld === 1), "Geld: Erklärung bis zum Ende, Runde startet");
  await p.evaluate(() => __mathe.setzeAufgabe({ text: "", frage: "Wie viel Geld ist das?", antwort: "25", art: "zahl", einheit: "ct", nurLuecke: true, geld: [10, 10, 5], hilfe: "10 ct + 10 ct + 5 ct = 25 ct" }));
  await tippe(3); await p.waitForTimeout(300);
  erwarte(await p.evaluate(() => /was draufsteht/.test(document.getElementById("rueck").textContent)) && await fv("muenzenzaehlen") === "aufgefallen", "3 statt 25 Cent: Hinweis „Zähl, was draufsteht“, Denkfehler „Münzen gezählt“");
  await p.waitForTimeout(1300);

  // ---------- Länge (04.11.2026): Zentimeter selbst abzählen, Denkfehler „nur das Ende abgelesen“ ----------
  await p.click("#zum-weg"); await p.waitForTimeout(200);
  await p.evaluate((n) => __mathe.starte(n, true), await nr("laenge")); await p.waitForTimeout(300);
  await p.click("#erklaer-ja"); await p.waitForTimeout(200);
  for (let k = 0; k < 3; k++) { await p.click("#weiter"); await p.waitForTimeout(150); }
  await weiter();
  for (let i = 0; i < 4; i++) { await p.click("#machen-bild .cm"); await p.waitForTimeout(100); }
  erwarte(await p.evaluate(() => document.getElementById("machen-ergebnis").textContent === "4 cm" && document.querySelectorAll("#machen-bild path[stroke='#4FA8F0']").length === 4), "Länge selbst abzählen: vier Zentimeter-Bögen von 2 bis 6 – 4 cm");
  await bild(p, "fu-laenge-machen");
  await weiter(); await p.click('[data-e="6"]'); await p.waitForTimeout(150); await weiter();
  await p.click('[data-g="nein"]'); await p.waitForTimeout(150);
  const linealBild = await p.evaluate(() => !!document.querySelector("#warum svg"));
  await weiter(); await weiter();
  erwarte(linealBild && await p.evaluate(() => __mathe.lauf && __mathe.lauf.station.id === "laenge" && (Spielwelt.lade("mathe").erklaert || {}).laenge === 1), "Länge: Robos Fehler mit Bild, Erklärung bis zum Ende, Runde startet");
  await p.evaluate(() => __mathe.setzeAufgabe({ text: "", frage: "Achtung, der Stift fängt nicht bei 0 an! Wie lang ist er?", antwort: "5", art: "zahl", einheit: "cm", nurLuecke: true, lineal: { start: 2, l: 5 }, hilfe: "Von 2 bis 7: 5 cm." }));
  await tippe(7); await p.waitForTimeout(300);
  erwarte(await p.evaluate(() => /fängt bei 2 an/.test(document.getElementById("rueck").textContent)) && await fv("linealende") === "aufgefallen", "7 statt 5 cm: Hinweis „Der Stift fängt bei 2 an“, Denkfehler „nur das Ende abgelesen“");
  await p.waitForTimeout(1300);

  // ---------- Kl. 3 (04.11.2026): Zahl bauen, Runden; Denkfehler „Null weggelassen“ und „falsch gerundet“ ----------
  await p.evaluate(() => { window.__fertig = false; __mathe.erklaere("k3stellen", () => { window.__fertig = true; }); }); await p.waitForTimeout(200);
  for (let k = 0; k < 4; k++) await weiter();
  await p.click('.bauen[data-s="0"]'); await p.click('.bauen[data-s="0"]'); await p.click('.bauen[data-s="0"]'); await p.waitForTimeout(100);
  const genug = await p.evaluate(() => /schon genug Hunderter/.test(document.getElementById("satz").textContent));
  for (const [i, n] of [[1, 4], [2, 3]]) for (let k = 0; k < n; k++) { await p.click(`.bauen[data-s="${i}"]`); await p.waitForTimeout(60); }
  erwarte(genug && await p.evaluate(() => document.getElementById("machen-ergebnis").textContent === "243"), "Zahl bauen: 2 Hunderter (der dritte zu viel – Hinweis), 4 Zehner, 3 Einzelne – 243");
  await bild(p, "fu-k3-bauen");
  await weiter(); await p.click('[data-e="508"]'); await p.waitForTimeout(150); await weiter();
  await p.click('[data-g="nein"]'); await p.waitForTimeout(150); await weiter(); await weiter();
  erwarte(await p.evaluate(() => window.__fertig), "Zahlen bis 1000: Erklärung bis zum Ende");
  await p.evaluate(() => { window.__fertig = false; __mathe.erklaere("k3runden", () => { window.__fertig = true; }); }); await p.waitForTimeout(200);
  for (let k = 0; k < 4; k++) await weiter();
  await p.click('#machen-bild .zehn[data-z="350"]'); await p.waitForTimeout(100);
  const runter = await p.evaluate(() => /Unter 5 geht es runter/.test(document.getElementById("satz").textContent));
  await p.click('#machen-bild .zehn[data-z="340"]'); await p.waitForTimeout(100);
  erwarte(runter && await p.evaluate(() => document.getElementById("machen-ergebnis").textContent === "342 ≈ 340"), "Runden: erst 350 (Hinweis „Unter 5 geht es runter“), dann 340 – 342 ≈ 340");
  await bild(p, "fu-k3-runden");
  await weiter(); await p.click('[data-e="270"]'); await p.waitForTimeout(150); await weiter();
  await p.click('[data-g="nein"]'); await p.waitForTimeout(150); await weiter(); await weiter();
  erwarte(await p.evaluate(() => window.__fertig), "Runden: Erklärung bis zum Ende");
  await p.evaluate(() => { window.__fertig = false; __mathe.erklaere("k3rest", () => { window.__fertig = true; }); }); await p.waitForTimeout(200);
  for (let k = 0; k < 4; k++) await weiter();
  for (let k = 0; k < 3; k++) { await p.click("#plus-reihe"); await p.waitForTimeout(80); }
  erwarte(await p.evaluate(() => document.getElementById("machen-ergebnis").textContent === "14 : 4 = 3 Rest 2" && document.querySelectorAll("#machen-bild circle[fill='#FFD84D']").length === 2), "Teilen mit Rest: drei Reihen mit 4, 2 gelbe Punkte übrig – 14 : 4 = 3 Rest 2");
  await bild(p, "fu-k3-rest");
  await weiter(); await p.click('[data-e="3"]'); await p.waitForTimeout(150); await weiter();
  await p.click('[data-g="nein"]'); await p.waitForTimeout(150); await weiter(); await weiter();
  erwarte(await p.evaluate(() => window.__fertig), "Teilen mit Rest: Erklärung bis zum Ende");
  await p.evaluate(() => __mathe.setzeAufgabe({ text: "", frage: "Welche Zahl ist das?", antwort: "305", art: "zahl", nurLuecke: true, stellen: 305, hilfe: "3 Hunderter, 0 Zehner, 5 Einer" }));
  await tippe(35); await p.waitForTimeout(300);
  erwarte(await p.evaluate(() => /Null darf nicht fehlen/.test(document.getElementById("rueck").textContent)) && await fv("nullvergessen") === "aufgefallen", "35 statt 305: Hinweis „Die Null darf nicht fehlen“");
  await p.waitForTimeout(1300); await tippe(305); await p.waitForTimeout(1200);
  await p.evaluate(() => __mathe.setzeAufgabe({ text: "", frage: "Runde 386 auf Zehner.", antwort: "390", art: "zahl", nurLuecke: true, runden: 386, hilfe: "Ab 5 aufrunden." }));
  await tippe(380); await p.waitForTimeout(300);
  erwarte(await p.evaluate(() => /Ab 5 geht es hoch/.test(document.getElementById("rueck").textContent)) && await fv("falschgerundet") === "aufgefallen", "386 auf 380 gerundet: Hinweis „Ab 5 geht es hoch“");
  await p.waitForTimeout(1300);

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
  erwarte(await p.evaluate(() => /kleine 1/.test(document.getElementById("rueck").textContent) && !/Übertrag|Ziffer|Stelle/.test(document.getElementById("tafel").textContent) && !!document.querySelector(".weg-bild svg rect[fill='#FFF3C4']")), "Zehner 2 statt 3: Hinweis „Denk an die kleine 1“, Rechenbild mit markierter Spalte, keine Fachwörter");
  await bild(p, "fu-weg");
  await p.waitForTimeout(700); await tippe(3); await p.waitForTimeout(250); await tippe(6); await p.waitForTimeout(300);
  erwarte(await p.evaluate(() => /Dein Fehler lag bei den Zehnern/.test(document.getElementById("weg-ende").textContent) && /muss mit/.test(document.getElementById("weg-ende").textContent) && !/Denkfehler|Übertrag/.test(document.getElementById("tafel").textContent)), "Ende: „Dein Fehler lag bei den Zehnern“ mit kurzem Satz, ohne Fehlernamen");
  await bild(p, "fu-weg-ende");
  erwarte(await fv("uebertrag") === "wieder", "Denkfehler aus dem Schrittweg zählt für die Diagnose (war aufgelöst → wieder da)");
  await weiter();
  erwarte(await p.evaluate(() => !!document.getElementById("ausdruck") && !__mathe.lauf.weg), "Weiter: nächste Aufgabe");

  // ---------- Schriftlich mal (04.11.2026): Schrittweg mit gemerkter Zahl ----------
  await p.evaluate(() => { const d = Spielwelt.lade("mathe"); d.weg = "k4"; Spielwelt.speichere("mathe", d); });
  await p.goto(BASIS + "spiele/mathe/"); await p.waitForTimeout(500);
  await p.evaluate(() => __mathe.starte(Mathe.STATIONEN_K4.findIndex(s => s.id === "k4malschrift"), true)); await p.waitForTimeout(300);
  if (await p.isVisible("#erklaer-nein")) { await p.click("#erklaer-nein"); await p.waitForTimeout(300); }
  await p.evaluate(() => __mathe.setzeAufgabe({ text: "347 · 5", antwort: "1735", art: "zahl", frage: "Rechne schriftlich: Fang bei den Einern an.", hilfe: "…", max: 7 }));
  await tippe(1535); await p.waitForTimeout(900);
  erwarte(await p.evaluate(() => /Zeig mir deinen Weg/.test(document.getElementById("tafel").textContent) && /Einern/.test(document.getElementById("ausdruck").textContent)), "schriftlich mal falsch: Schrittweg beginnt bei den Einern");
  await tippe(5); await p.waitForTimeout(250); await tippe(0); await p.waitForTimeout(250);
  erwarte(await p.evaluate(() => /gemerkte 3/.test(document.getElementById("rueck").textContent) && /merke 3/.test(document.querySelector(".weg-liste").textContent)), "Zehner 0 statt 3: Hinweis „Denk an die gemerkte 3“");
  await bild(p, "fu-weg-mal");
  await p.waitForTimeout(700); await tippe(3); await p.waitForTimeout(250); await tippe(7); await p.waitForTimeout(250); await tippe(1); await p.waitForTimeout(300);
  erwarte(await p.evaluate(() => /Dein Fehler lag bei den Zehnern/.test(document.getElementById("weg-ende").textContent)), "schriftlich mal: „Dein Fehler lag bei den Zehnern“");
  await weiter();

  // ---------- Schriftlich geteilt (04.11.2026): Schrittweg von links, Rest vergessen ----------
  await p.evaluate(() => __mathe.starte(Mathe.STATIONEN_K4.findIndex(s => s.id === "k4geteilt"), true)); await p.waitForTimeout(300);
  if (await p.isVisible("#erklaer-nein")) { await p.click("#erklaer-nein"); await p.waitForTimeout(300); }
  await p.evaluate(() => __mathe.setzeAufgabe({ text: "864 : 4", antwort: "216", art: "zahl", frage: "Teile schriftlich von links nach rechts.", hilfe: "…", max: 7 }));
  await tippe(211); await p.waitForTimeout(900);
  erwarte(await p.evaluate(() => /von links nach rechts/.test(document.getElementById("tafel").textContent) && /Wie oft passt die 4 in die 8/.test(document.getElementById("ausdruck").textContent)), "schriftlich geteilt falsch: Schrittweg „Wie oft passt die 4 in die 8?“");
  await tippe(2); await p.waitForTimeout(250); await tippe(1); await p.waitForTimeout(250);
  erwarte(await p.evaluate(() => /in die 24/.test(document.getElementById("ausdruck").textContent) && /6 : 4 = 1, Rest 2/.test(document.querySelector(".weg-liste").textContent)), "dritter Schritt: Rest 2 wandert vor die 4 – „Wie oft passt die 4 in die 24?“");
  await tippe(1); await p.waitForTimeout(250);
  erwarte(await p.evaluate(() => /Denk an den Rest 2/.test(document.getElementById("rueck").textContent)), "1 statt 6: Hinweis „Denk an den Rest 2 von vorher“");
  await bild(p, "fu-weg-geteilt");
  await p.waitForTimeout(700); await tippe(6); await p.waitForTimeout(300);
  erwarte(await p.evaluate(() => !!document.getElementById("weg-ende")) && await fv("restvergessen") === "aufgefallen", "schriftlich geteilt: Ende, Denkfehler „Rest nicht mitgenommen“ gemerkt");
  await weiter();

  // ---------- Elternbereich (04.11.2026): Denkfehler mit Namen, Zustand und Tipp für zu Hause ----------
  await p.evaluate(() => { window.__elternAlle = true; });
  await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(400);
  if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForTimeout(500); }
  await p.evaluate(() => { window.__elternAlle = true; if (window.__eltern && __eltern.teil) __eltern.teil("lernstand"); }); await p.waitForTimeout(300);
  const el = await p.evaluate(() => { const d = document.getElementById("denkfehler-eltern"); return d ? { n: d.querySelectorAll("li").length, t: d.textContent } : null; });
  erwarte(el && el.n >= 5 && /Zu Hause:/.test(el.t) && /Zahl verdreht/.test(el.t), `Elternbereich: ${el ? el.n : 0} Denkfehler mit Zustand und Tipp „Zu Hause“`);
  await p.evaluate(() => document.getElementById("denkfehler-eltern").scrollIntoView()); await bild(p, "fu-eltern");
  erwarte(await p.evaluate(() => { const t = document.querySelector('section.eltern-teil[data-teil="lernstand"]').textContent; return /Sachunterricht: \d+ von \d+ geschafft/.test(t) && !/Meine Familie –/.test(t); }), "Elternbereich: Sachunterricht als „n von N geschafft“ statt aller Themen mit „–“");

  // ---------- Startzahl: gemerkter Fehler nur als Station + Startzahl, beim Training wieder dieselbe Aufgabe ----------
  await p.evaluate(() => { const d = Spielwelt.lade("mathe"); d.weg = "k2"; d.fehler = []; Spielwelt.speichere("mathe", d); });
  await p.goto(BASIS + "spiele/mathe/"); await p.waitForTimeout(400);
  await p.evaluate((n) => __mathe.starte(n), await nr("plus20")); await p.waitForTimeout(300);
  const a0 = await p.evaluate(() => __mathe.lauf.liste[__mathe.lauf.pos]);
  const falsch = String(+a0.antwort + 3);
  await tippe(falsch); await p.waitForTimeout(1400); await tippe(falsch); await p.waitForTimeout(300);
  const f = await p.evaluate(() => Spielwelt.lade("mathe").fehler.slice(-1)[0]);
  erwarte(f && f.saat === a0.saat && f.station === "plus20" && !f.hilfe && JSON.stringify(f).length < 160, `gemerkter Fehler kompakt: Station + Startzahl (${JSON.stringify(f).length} Zeichen)`);
  await p.evaluate(() => { const d = Spielwelt.lade("mathe"); d.fehler.forEach(x => { x.faellig = "2000-01-01"; }); Spielwelt.speichere("mathe", d); });
  await p.evaluate(() => __mathe.starteTraining()); await p.waitForTimeout(300);
  const t = await p.evaluate((saat) => __mathe.lauf.liste.find(x => x.ausFehler && x.saat === saat), a0.saat);
  erwarte(t && t.text === a0.text && t.antwort === a0.antwort && t.hilfe === a0.hilfe, `Training: dieselbe Aufgabe aus der Startzahl wiederhergestellt (${a0.text})`);

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Fehler-Ursachen-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
