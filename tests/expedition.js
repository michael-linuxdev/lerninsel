// Playwright-Test (09.11.2026): Kapitel 7 „Neue Ufer“ – Ellas Forscherlager und Robos Boot.
// 3D (allein laufen lassen): Boot am Steg vor Kapitel 7 nur ansehen, Lager auf der Heimatinsel ab Kapitel 1 mit „Forschen“; Kapitel-7-Szene
// nach 50 Lernfunden und Führerschein echt durchgeklickt; am Boot „⛵ Losfahren“ öffnet die Welt-Liste, dort eine Wald-Welt echt über den
// Assistenten erschaffen; auf dem Eiland steht das Forscherlager (frei, mit „Forschen“), das Boot bringt zurück zur Heimatinsel.
// Seite: vor Kapitel 1 zu; Karte der Heimatinsel (Kl. 1, Stufe a) mit 5 Fragen echt beantwortet (eine falsch → Hinweis, zweimal falsch → Lösung),
// Sterne nur für neue Fragen (höchstens 3 am Tag); Forscher-Tagebuch echt eingetragen (Stern nur beim ersten Eintrag je Eiland); Nachbar-Eiland
// (Berge mit Teich, Kl. 3, Stufe c, Maßstab und Zwischenrichtungen) vor Kapitel 7 zu, danach offen; Hochformat und Handy ohne Querscrollen.
// Aufruf: sh tests/laufen.sh expedition   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo/;
process.on("unhandledRejection", (e) => { console.log("❌ Abbruch: " + e.message + "\n  " + (global.__fehler || []).join("\n  ")); process.exit(1); });

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const fehler = global.__fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  const INSEL = BASIS + "spiele/welt3d/heimat.html?stunde=14";
  async function kind(stufe = "2", breite = 1180, hoehe = 820) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__testSchnell = true; window.__keinSparen = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`Seitenfehler ${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`Konsole ${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
    await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe); await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(300);
    return { ctx, p };
  }
  const sterne = (p) => p.evaluate(() => Spielwelt.sterne());
  const insel = async (p, q = "") => { await p.goto(INSEL + q, { waitUntil: "domcontentloaded", timeout: 60000 }); await p.waitForFunction(() => window.__heimat && __heimat.ich, null, { timeout: 60000 }); await p.waitForTimeout(1500); };
  const szeneWeg = async (p) => { await p.evaluate(() => { if (window.__szene && __szene.aktuell()) __szene.abbrechen(); }); await p.waitForTimeout(300); };
  const weiter = async (p) => { await p.click("#szene-weiter", { force: true }); await p.waitForTimeout(400); };
  const zumLager = async (p) => { await p.evaluate(() => { const l = __heimat.lager(), r = Math.hypot(l.x, l.z); __heimat.ich.position.set(l.x * (r - 2.2) / r, __heimat.ich.position.y, l.z * (r - 2.2) / r); }); await p.waitForTimeout(900); };
  const zumBoot = async (p) => { await p.evaluate(() => { const s = __heimat.steg; __heimat.ich.position.set(s.x, __heimat.ich.position.y, s.z1 - 1.0); }); await p.waitForTimeout(900); };
  const blase = (p) => p.evaluate(() => ({ titel: document.getElementById("blase-titel").textContent, text: document.getElementById("blase-text").textContent, los: !document.getElementById("blase-los").hidden, extra: document.getElementById("blase-extra").hidden ? "" : document.getElementById("blase-extra").textContent }));

  // ---------- 3D: Boot, Lager, Kapitel 7, Reise zum Eiland und zurück ----------
  { const { ctx, p } = await kind("2");
    await p.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.lektionen = { bedienung: 3 }; Spielwelt.speichere("medien", m); Story.etappeFertig("E1");
      ["E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9"].forEach(e => Story.etappeFertig(e, true)); Story.merkeSzene("sonne"); Story.setzeKapitel(6); for (let i = 0; i < 12; i++) Zeit.aufgabe(); });
    await insel(p); await szeneWeg(p);
    const start = await p.evaluate(() => ({ insel: __heimat.insel, wege: __heimat.wege, lager: __heimat.lager(), boot: __heimat.boot() }));
    erwarte(start.insel && start.wege === 5 && start.lager.offen && !start.lager.schloss && start.lager.aktion === "Forschen", "Heimatinsel: fünf Trittstein-Wege, Forscherlager offen (Kapitel 1) mit Knopf „Forschen“");
    erwarte(start.boot.aktion === "Ansehen" && start.boot.nah === 3.2, "vor Kapitel 7 zeigt das Boot nur „Ansehen“");
    await zumBoot(p);
    erwarte(await p.evaluate(() => __heimat.aktion) === "Ansehen" && await p.evaluate(() => Math.hypot(__heimat.ich.position.x, __heimat.ich.position.z) > 19.5), "die Figur darf bis ans Ende des Stegs laufen (über die Laufgrenze hinaus)");
    await p.evaluate(() => __heimat.druecke()); await p.waitForTimeout(400);
    let b = await blase(p);
    erwarte(/Robos Boot/.test(b.titel) && /Bald fahren wir/.test(b.text) && !b.los && !b.extra, "Robo vertröstet vor Kapitel 7 – kein Reisen");
    await bild(p, "expedition-boot-zu"); await p.click("#blase-zu");
    await zumLager(p);
    erwarte(await p.evaluate(() => __heimat.aktion) === "Forschen", "am Lager steht „Forschen“ auf dem Aktionsknopf");
    await p.evaluate(() => __heimat.druecke()); await p.waitForTimeout(400);
    b = await blase(p);
    erwarte(/Forscherlager/.test(b.titel) && /Karte unserer Insel/.test(b.text) && b.los, "Ella lädt zur Karte der Heimatinsel ein (Ziel: Expedition)");
    await bild(p, "expedition-lager"); await p.click("#blase-zu");
    // Kapitel 7: 50 Lernfunde und Führerschein
    const funde = (n) => p.evaluate((n) => { const d = Spielwelt.lade("lernfunde") || { tage: {} }; d.tage = d.tage || {}; d.summe = n; Spielwelt.speichere("lernfunde", d); }, n);
    await funde(50);
    erwarte(await p.evaluate(() => InselKern.naechsteStory({})) === null, "50 Lernfunde ohne Führerschein: Kapitel 7 wartet");
    await p.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.fuehrerschein = "2026-10-20"; Spielwelt.speichere("medien", m); });
    erwarte(await p.evaluate(() => InselKern.naechsteStory({})) === "neue-ufer", "mit Führerschein: Kapitel 7 „Neue Ufer“ ist dran");
    await insel(p);
    await p.waitForFunction(() => window.__szene && __szene.aktuell() && __szene.aktuell().id === "neue-ufer", null, { timeout: 20000 });
    let a = await p.evaluate(() => __szene.aktuell());
    erwarte(a.wer === "robo" && a.zeigt && a.anzahl === 4, "Robo spricht und zeigt zum Steg (4 Sprechblasen)");
    await bild(p, "expedition-szene");
    await weiter(p); a = await p.evaluate(() => __szene.aktuell());
    erwarte(a.nr === 1 && await p.evaluate(() => Story.kapitel() === 7 && __heimat.boot().aktion === "Boot"), "zweite Blase: Kapitel 7 gemerkt, das Boot zeigt jetzt „Boot“");
    while (await p.evaluate(() => !!(window.__szene && __szene.aktuell()))) await weiter(p);
    erwarte(await p.evaluate(() => Story.kapitel() === 7 && Story.chronik().some(x => x.s === "neue-ufer")), "Kapitel 7 erreicht, Szene in der Chronik");
    // Mit dem Boot losfahren: Welt-Liste, Wald-Welt über den Assistenten erschaffen
    await zumBoot(p);
    erwarte(await p.evaluate(() => __heimat.aktion) === "Boot", "am Stegende: Knopf „Boot“");
    await p.evaluate(() => __heimat.druecke()); await p.waitForTimeout(400);
    b = await blase(p);
    erwarte(/bereit/.test(b.text) && b.extra === "⛵ Losfahren", "Robo: Boot bereit, Knopf „⛵ Losfahren“");
    await p.click("#blase-extra"); await p.waitForTimeout(400);
    erwarte(await p.evaluate(() => !document.getElementById("welt").hidden && /Heimatinsel/.test(document.getElementById("welt-inhalt").textContent)), "„Losfahren“ öffnet die Welt-Liste mit der Heimatinsel");
    await bild(p, "expedition-weltliste");
    await p.click("#welt-neu"); await p.waitForTimeout(200);
    await p.click('[data-biom="wald"]'); await p.click("#welt-weiter"); await p.waitForTimeout(150); await p.click("#welt-weiter"); await p.waitForTimeout(150);
    await p.click("#welt-los"); await p.waitForTimeout(1500);
    await p.waitForFunction(() => window.__heimat && __heimat.ich && __heimat.insel === false, null, { timeout: 60000 }); await p.waitForTimeout(1500); await szeneWeg(p);
    erwarte(await p.evaluate(() => !document.getElementById("welt-leiste").hidden), "auf dem neuen Eiland: Leiste „Neu würfeln / Behalten / Zurück“");
    await p.click("#welt-behalten"); await p.waitForTimeout(300);
    const eiland = await p.evaluate(() => ({ lager: __heimat.lager(), boot: __heimat.boot(), welt: Spielwelt.lade("welt") }));
    erwarte(eiland.welt.welten.length === 1 && eiland.welt.welten[0].biom === "wald" && eiland.welt.aktiv === 0 && !eiland.welt.entwurf, "Wald-Welt gespeichert und behalten");
    erwarte(eiland.lager.offen && !eiland.lager.schloss && eiland.lager.aktion === "Forschen" && Math.hypot(eiland.lager.x, eiland.lager.z) > 12, "auf dem Eiland steht das Forscherlager am Rand, offen (Kapitel 7)");
    await zumLager(p);
    erwarte(await p.evaluate(() => __heimat.aktion) === "Forschen", "am Lager des Eilands: „Forschen“");
    await p.evaluate(() => __heimat.druecke()); await p.waitForTimeout(400);
    b = await blase(p);
    erwarte(/neues Eiland/.test(b.text) && b.los, "Ella: neues Eiland – Tagebuch und Karte");
    await bild(p, "expedition-eiland-lager"); await p.click("#blase-zu");
    // Rückfahrt
    await zumBoot(p);
    erwarte(await p.evaluate(() => __heimat.aktion) === "Boot", "Boot am Steg des Eilands");
    await p.evaluate(() => __heimat.druecke()); await p.waitForTimeout(400);
    b = await blase(p);
    erwarte(/Heimatinsel/.test(b.text) && b.extra === "⛵ Losfahren", "Robo bietet die Rückfahrt an");
    await p.click("#blase-extra"); await p.waitForTimeout(400);
    await p.click('[data-besuch="-1"]'); await p.waitForTimeout(1500);
    await p.waitForFunction(() => window.__heimat && __heimat.ich && __heimat.insel === true, null, { timeout: 60000 });
    erwarte(true, "zurück auf der Heimatinsel");
    await ctx.close(); }

  // ---------- Seite: Heimatinsel, Kl. 1 (Stufe a) ----------
  const seite = async (p, q = "") => { await p.goto(BASIS + "spiele/expedition/" + q); await p.waitForLoadState("load"); await p.waitForTimeout(400); };
  const antworte = async (p, falsch = 0) => {
    const f = await p.evaluate(() => { const f = __expedition.lauf.liste[__expedition.lauf.pos]; return { pos: __expedition.lauf.pos, richtig: f.optionen[0], alle: f.optionen }; });
    const n = Math.min(falsch, f.alle.length - 1);   // Fragen mit zwei Antworten (oben/unten): nur ein Fehler möglich, dann die richtige
    for (let i = 0; i < n; i++) { await p.click(`#optionen [data-o="${f.alle[1 + i]}"]`); await p.waitForTimeout(120); }
    if (n < 2) await p.click(`#optionen [data-o="${f.richtig}"]`);
    await p.waitForFunction((pos) => __expedition.lauf.pos > pos || __expedition.lauf.phase !== "fragen", f.pos, { timeout: 8000 });
  };
  { const { ctx, p } = await kind("1");
    await seite(p);
    erwarte(await p.isVisible("#zu") && !(await p.isVisible("#fragekarte")) && /erste Frucht/.test(await p.textContent("#zu-text")), "vor Kapitel 1 ist das Forscherlager zu");
    await p.evaluate(() => Story.setzeKapitel(1)); await seite(p);
    const k = await p.evaluate(() => ({ key: __expedition.eilandKey, stufe: __expedition.stufe(), liste: __expedition.lauf.liste.map(f => f.id), n: __expedition.fuerStufe("a").length, orte: __expedition.ORTE.length,
      karte: !!document.querySelector("#kartenbild svg"), zeichen: document.querySelectorAll("#kartenbild .ort").length, figuren: document.querySelectorAll("#kartenbild .ort .emo.fig").length, ring: !!document.querySelector("#kartenbild .ort.gesucht") }));
    erwarte(k.key === "heimat" && k.stufe === "a" && k.liste.length === 5 && k.liste.every(id => /^(ou|lr|ganz)-/.test(id)), `Heimatinsel, Kl. 1: fünf Fragen der Stufe a (${k.liste.join(", ")})`);
    erwarte(k.karte && k.zeichen === k.orte && k.orte >= 15 && k.figuren >= 6, `Karte mit ${k.orte} Orten, Begleiter als Zeichnung (${k.figuren}), gesuchter Ort markiert: ${k.ring}`);
    erwarte(new Set(k.liste.map(id => id.split("-")[0])).size >= 2, "die Runde mischt die Fragearten");
    await bild(p, "expedition-karte-k1");
    const s0 = await sterne(p);
    await antworte(p, 1);
    erwarte((await sterne(p)) === s0, "erste Frage nach einem Fehler: kein Stern");
    await antworte(p, 2);
    erwarte((await sterne(p)) === s0, "zweite Frage falsch (bei drei Antworten zweimal → Lösung gezeigt): kein Stern");
    for (let i = 2; i < 5; i++) await antworte(p);
    await p.waitForSelector("#ende");
    const d1 = await p.evaluate(() => Spielwelt.lade("expedition"));
    erwarte((await sterne(p)) === s0 + 3 && Object.keys(d1.karten).length === 3 && Object.keys(d1.karten).every(k => k.startsWith("heimat:")), "drei neue Fragen gleich richtig: +3 ⭐, Antworten je Eiland gemerkt");
    await bild(p, "expedition-ende");
    await p.click("#nochmal"); await p.waitForTimeout(200);
    erwarte(await p.evaluate(() => !Spielwelt.lade("expedition").karten["heimat:" + __expedition.lauf.liste[0].id]), "nächste Runde beginnt mit noch nicht gelesenen Fragen");
    for (let i = 0; i < 5; i++) await antworte(p);
    await p.waitForSelector("#ende");
    erwarte((await sterne(p)) === s0 + 3, "Deckel: höchstens 3 ⭐ am Tag für Karten-Fragen");
    // Tagebuch
    await p.click("#zum-tagebuch"); await p.waitForTimeout(300);
    erwarte(await p.isVisible("#tagebuch") && await p.isDisabled("#eintragen"), "Tagebuch: Eintragen erst mit Wetter und drei Funden");
    await p.click('[data-art="sonne"]'); await p.click('[data-fund="baeume"]'); await p.click('[data-fund="blumen"]'); await p.click('[data-fund="leuchtturm"]');
    await p.click('[data-fund="steine"]');
    erwarte(/Drei Funde reichen/.test(await p.textContent("#t-hinweis")), "ein vierter Fund wird freundlich abgelehnt");
    await bild(p, "expedition-tagebuch");
    await p.click("#eintragen"); await p.waitForTimeout(150);
    const h = await p.textContent("#t-hinweis");
    erwarte(/Eingetragen/.test(h) && /neues Eiland/.test(h) && (await sterne(p)) === s0 + 4, "eingetragen, +1 ⭐ für das erste Eiland im Tagebuch");
    await p.waitForTimeout(500);
    const d2 = await p.evaluate(() => Spielwelt.lade("expedition").eilande.heimat);
    erwarte(d2 && d2.wetter === "sonne" && d2.funde.length === 3 && d2.biom === "wiese", "Eintrag gespeichert (Wetter, drei Funde)");
    erwarte(await p.evaluate(() => document.querySelectorAll("#eilande .eiland").length === 1 && !!document.querySelector("#eilande .eiland.hier")), "Liste „Erforschte Eilande“ zeigt die Heimatinsel");
    await p.click('[data-art="regen"]'); await p.click("#eintragen"); await p.waitForTimeout(500);
    erwarte((await sterne(p)) === s0 + 4, "Eintrag geändert: kein weiterer Stern");
    erwarte(await p.evaluate(() => (Lernfunde.heute ? Lernfunde.heute() : []).some(f => /Eiland erforscht/.test(f.t))), "Lernfund „Eiland erforscht“");
    await ctx.close(); }

  // ---------- Seite: Übergang Klasse 5 (Stufe d, 10.11.2026): Koordinatensystem auf der Heimatinsel, echt durchgespielt mit Fehlern ----------
  for (const [breite, hoehe, art] of [[1180, 820, "quer"], [390, 760, "Handy"]]) {
    const { ctx, p } = await kind("5", breite, hoehe);
    await p.evaluate(() => Story.setzeKapitel(1)); await seite(p);
    const k = await p.evaluate(() => ({ stufe: __expedition.stufe(), d: __expedition.FRAGEN.filter(f => f.ab === "d"), liste: __expedition.lauf.liste.map(f => f.ab),
      achsen: [...document.querySelectorAll("#kartenbild svg text")].map(t => t.textContent).join(""), ring: document.querySelectorAll('#kartenbild circle[stroke="#E5383B"]').length }));
    const arten = new Set(k.d.map(f => f.id.split("-")[0]));
    erwarte(k.stufe === "d" && k.d.length >= 9 && ["punkt", "schatz", "strecke"].every(a => arten.has(a)), `${art}: Stufe d mit ${k.d.length} Koordinaten-Fragen (Punkt ablesen, Ort finden, Strecke)`);
    erwarte(k.liste.every(a => a === "d"), `${art}: die erste Runde nimmt nur Koordinaten-Fragen`);
    erwarte(/x/.test(k.achsen) && /y/.test(k.achsen) && [..."0123456"].every(z => k.achsen.includes(z)) && !/[A-F]/.test(k.achsen) && k.ring === 1, `${art}: Karte mit Achsen 0–6, x und y, roter Punkt markiert`);
    erwarte(k.d.every(f => new Set(f.optionen).size === f.optionen.length && f.optionen.length === 3), `${art}: jede Koordinaten-Frage hat drei verschiedene Antworten`);
    const punkt = k.d.find(f => /^punkt-/.test(f.id));
    erwarte(punkt && /^\((\d)\|(\d)\)$/.test(punkt.optionen[0]) && (() => { const [, a, b] = punkt.optionen[0].match(/(\d)\|(\d)/); return a === b || punkt.optionen.includes(`(${b}|${a})`); })(), `${art}: „x und y vertauscht“ steht als falsche Antwort da (${punkt && punkt.optionen.join(" ")})`);
    const strecke = k.d.find(f => /^strecke-/.test(f.id));
    erwarte(strecke && /^\d+0 m$/.test(strecke.optionen[0]) && strecke.optionen.some(o => +o.split(" ")[0] * 50 === +strecke.optionen[0].split(" ")[0]), `${art}: Strecke mit Maßstab, „Einheiten statt Meter“ als falsche Antwort (${strecke && strecke.frage})`);
    if (art === "quer") {
      await p.click(`#optionen [data-o="${(await p.evaluate(() => __expedition.lauf.liste[0].optionen[1]))}"]`); await p.waitForTimeout(120);
      erwarte(/nach rechts zählen \(x\), dann nach oben \(y\)/.test(await p.textContent("#hinweis")), "quer: Hinweis nach einem Fehler erklärt x vor y");
      await p.click(`#optionen [data-o="${(await p.evaluate(() => __expedition.lauf.liste[0].optionen[0]))}"]`);
      await p.waitForFunction(() => __expedition.lauf.pos > 0, null, { timeout: 8000 });
      for (let i = 1; i < 5; i++) await antworte(p, i === 3 ? 2 : 0);
      await p.waitForSelector("#ende");
      const d = await p.evaluate(() => Spielwelt.lade("expedition"));
      erwarte(Object.keys(d.karten).length === 3 && Object.keys(d.karten).every(x => /^heimat:(punkt|schatz|strecke)-/.test(x)) && (await sterne(p)) === 3, "quer: Runde mit zwei Fehlern durchgespielt – 3 gleich richtig gemerkt, 3 ⭐");
    }
    erwarte(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${art}: keine waagerechte Scrollleiste`);
    await bild(p, `expedition-k5-${art}`);
    await ctx.close();
  }

  // ---------- Seite: Nachbar-Eiland Kl. 3 (Stufe c), Hochformat und Handy ----------
  for (const [breite, hoehe, art] of [[820, 1180, "hoch"], [390, 760, "Handy"]]) {
    const { ctx, p } = await kind("3", breite, hoehe);
    const q = "?biom=berge&groesse=mittel&huegel=viel&see=1&seed=3";   // „Berge mit Teich“ (wie in tests/leistung.js)
    await p.evaluate(() => Story.setzeKapitel(6)); await seite(p, q);
    erwarte(await p.isVisible("#zu") && /Kapitel 7/.test(await p.textContent("#zu-text")), `${art}: Eiland vor Kapitel 7 zu`);
    await p.evaluate(() => Story.setzeKapitel(7)); await seite(p, q);
    const k = await p.evaluate(() => ({ key: __expedition.eilandKey, stufe: __expedition.stufe(), ids: __expedition.fuerStufe("c").map(f => f.id), funde: __expedition.fundeFuer().map(f => f.id), scroll: document.documentElement.scrollWidth <= innerWidth + 1 }));
    erwarte(k.key === "berge-3" && k.stufe === "c" && k.ids.some(id => /^meter-/.test(id)) && k.ids.some(id => /^richtung8-/.test(id)) && k.ids.includes("insel-breite"), `${art}: Stufe c mit Maßstab und Zwischenrichtungen`);
    erwarte(k.funde.includes("teich") && k.funde.includes("huegel") && k.funde.includes("baeume"), `${art}: Funde des Eilands (Teich, Hügel, Bäume)`);
    erwarte(k.scroll, `${art}: keine waagerechte Scrollleiste`);
    await bild(p, `expedition-${art}`);
    for (let i = 0; i < 5; i++) await antworte(p);
    await p.waitForSelector("#ende");
    erwarte(await p.evaluate(() => Object.keys(Spielwelt.lade("expedition").karten).every(k => k.startsWith("berge-3:"))), `${art}: Antworten unter dem Eiland-Schlüssel gemerkt`);
    if (art === "hoch") {
      // Tagebuch auf dem Eiland, dann daheim: die Liste zeigt die Funde des Eilands mit dessen eigenen Zahlen (Fehler bis 10.11.: Zahlen der Heimatinsel)
      await p.click("#zum-tagebuch"); await p.waitForTimeout(300);
      await p.click('[data-art="schnee"]'); await p.click('[data-fund="baeume"]'); await p.click('[data-fund="steine"]'); await p.click('[data-fund="teich"]');
      await p.click("#eintragen"); await p.waitForTimeout(500);
      const e = await p.evaluate(() => Spielwelt.lade("expedition").eilande["berge-3"]);
      erwarte(e && e.ft && e.ft.length === 3 && /^\d+ /.test(e.ft[0]) && e.ft[2] === "ein Teich", `hoch: Eintrag „berge-3“ speichert die Fund-Texte (${e && e.ft && e.ft.join(", ")})`);
      await p.evaluate(() => { const d = Spielwelt.lade("expedition"); d.eilande["wald-9"] = { biom: "wald", name: "Altes Eiland", am: "2026-10-20", wetter: "regen", funde: ["baeume", "blumen", "steg"] }; Spielwelt.speichere("expedition", d); });
      await seite(p, "#tagebuch");
      const l = await p.evaluate(() => [...document.querySelectorAll("#eilande .eiland")].map(x => x.textContent));
      const berge = l.find(t => /Berge|berge/i.test(t) || t.includes(e.name)) || "", alt = l.find(t => /Altes Eiland/.test(t)) || "";
      erwarte(berge.includes(e.ft[0]) && berge.includes(e.ft[1]) && !/14 Laubbäume/.test(berge), `hoch: daheim zeigt die Liste die Funde des Eilands (${berge.trim()})`);
      erwarte(/Bäume, Blumenwiesen, ein Steg mit Boot/.test(alt) && !/\d+ Laubbäume/.test(alt), "hoch: alter Eintrag ohne Texte zeigt Funde ohne falsche Zahl");
    }
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Expedition-Test bestanden.");
})();
