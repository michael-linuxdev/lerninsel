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
