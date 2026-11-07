// Test Kapitel 2 „Fipsis Karte“ und Etappe E9 „Atelier“ (NA-17, 30.10.2026) auf der runden Insel:
// - Kapitel 2 kommt erst mit 5 Lernfunden UND einem fertigen Deutsch-Kapitel (vorher nicht), nur nach Kapitel 1
// - Szene echt durchgeklickt: Fipsi zeigt, der neue Weg mit Wegweiser erscheint, Kapitel 2 gesetzt, Szene in der Chronik
// - Wegweiser zeigt nur Wörter, die das Kind schon hatte (Lernkartei Deutsch), antippen liest sie vor
// - Kapitel nie rückwärts; nach dem Neuladen steht der Weg noch, die Szene kommt nicht wieder
// - E9: Paula zeigt Atelier und Bühne nach Kapitel 1 ab dem dritten Tag; wer schon gemalt hat, bekommt E9 still
// - seit 09.11.2026 auch Kapitel 7 „Neue Ufer“ (50 Lernfunde + Führerschein, Robos Boot wird bereit)
// Aufruf: sh tests/laufen.sh kapitel (allein laufen lassen, 3D)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const TAG = (d) => new Date(2026, 9, d, 15, 0).getTime();

(async () => {
  const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  const INSEL = BASIS + "spiele/welt3d/heimat.html?stunde=14";

  async function neuesKind({ e9 = true } = {}) {
    const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript((t) => { let x = null; try { x = localStorage.getItem("__testJetzt"); } catch (e) { /* egal */ } window.__jetzt = x ? +x : t; window.__keinSparen = true; }, TAG(20));
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    // Ankunft, Tutorial E1–E8 (und auf Wunsch E9) liegen zurück, Kapitel 1 erreicht, Spielzeit frei
    await p.evaluate((e9) => { const m = Spielwelt.lade("medien") || {}; m.lektionen = { bedienung: 3 }; Spielwelt.speichere("medien", m);
      Story.etappeFertig("E1"); ["E2", "E3", "E4", "E5", "E6", "E7", "E8"].concat(e9 ? ["E9"] : []).forEach(e => Story.etappeFertig(e, true));
      Story.merkeSzene("sonne"); Story.setzeKapitel(1); for (let i = 0; i < 12; i++) Zeit.aufgabe();
      ["brunis-station", "tilda", "paulas-feier"].forEach(x => Story.merkeSzene(x, true)); }, e9);   // Nebenszenen (07.11.2026) prüft tests/finale.js
    return { ctx, p };
  }
  const naechste = (p) => p.evaluate(() => InselKern.naechsteStory({}));
  const weiter = async (p) => { await p.click("#szene-weiter", { force: true }); await p.waitForTimeout(400); };

  // ---------- Kapitel 2 ----------
  {
    const { ctx, p } = await neuesKind();
    await p.goto(INSEL); await p.waitForTimeout(2500);
    await p.evaluate(() => { for (let i = 0; i < 4; i++) Lernfunde.merke({ fach: "mathe", art: "gemeistert", text: `${i} + 1`, schluessel: "t:" + i }); });
    erwarte(await naechste(p) === null, "4 Lernfunde: Kapitel 2 wartet");
    await p.evaluate(() => Lernfunde.merke({ fach: "mathe", art: "gemeistert", text: "4 + 1", schluessel: "t:4" }));
    erwarte(await naechste(p) === null, "5 Lernfunde, aber noch kein Deutsch-Kapitel: Kapitel 2 wartet");
    // Deutsch: ein Kapitel geschafft, zwei Wörter in der Lernkartei
    await p.evaluate(() => { Spielwelt.speichere("deutsch", { kapitel: { "w-nomen": 2 } });
      Spielwelt.speichere("lernkartei", { deutsch: [{ k: "wort|Apfel", s: { typ: "wort", wort: "Apfel" }, stufe: 1, faellig: "2099-01-01" }, { k: "wort|Schule", s: { typ: "wort", wort: "Schule" }, stufe: 1, faellig: "2099-01-01" }], sachkunde: [] }); });
    erwarte(await naechste(p) === "fipsis-karte", "5 Lernfunde + 1 Deutsch-Kapitel: Kapitel 2 „Fipsis Karte“ ist dran");
    await p.goto(INSEL);
    await p.waitForFunction(() => window.__szene && __szene.aktuell() && __szene.aktuell().id === "fipsis-karte", null, { timeout: 20000 });
    let a = await p.evaluate(() => __szene.aktuell());
    erwarte(a.wer === "fipsi" && a.zeigt && a.anzahl === 4, "Fipsi spricht und zeigt auf sich (4 Sprechblasen)");
    erwarte(await p.evaluate(() => !__heimat.kartenweg), "vor der Szene gibt es den Weg noch nicht");
    await weiter(p);
    a = await p.evaluate(() => __szene.aktuell());
    erwarte(a.nr === 1 && a.zeigt && await p.evaluate(() => !!__heimat.kartenweg), "zweite Blase: der neue Weg mit Wegweiser erscheint, die Zeigehand zeigt hin");
    await bild(p, "kapitel-weg");
    await weiter(p); await weiter(p); await weiter(p);
    const z = await p.evaluate(() => ({ k: Story.kapitel(), szene: __szene.aktuell(), chronik: Story.chronik().map(x => x.s), w: InselKern.wortSchilder(3) }));
    erwarte(z.k === 2 && !z.szene && z.chronik.includes("fipsis-karte"), `Kapitel 2 erreicht, Szene in der Chronik (${z.chronik.join(", ")})`);
    erwarte(z.w.join() === "Schule,Apfel", `Wegweiser: nur Wörter, die das Kind hatte (${z.w.join(", ")})`);
    // Wegweiser antippen (Aktionsknopf in der Nähe)
    await p.evaluate(() => { const o = InselKern.erstelle(new URLSearchParams(location.search)).P.kartenweg; __heimat.ich.position.set(o[0] + 0.9, __heimat.ich.position.y, o[1] + 0.6); });
    await p.waitForTimeout(800);
    const akt = await p.evaluate(() => __heimat.aktion);
    await p.evaluate(() => __heimat.druecke()); await p.waitForTimeout(400);
    const blase = await p.evaluate(() => ({ titel: document.getElementById("blase-titel").textContent, text: document.getElementById("blase-text") ? document.getElementById("blase-text").textContent : document.getElementById("blase").textContent }));
    erwarte(akt === "Lesen" && /Wegweiser/.test(blase.titel) && /Schule/.test(blase.text) && /Apfel/.test(blase.text), `Wegweiser antippen: „${akt}“, Fipsi liest die Wörter vor`);
    await bild(p, "kapitel-wegweiser");
    // nie rückwärts, Weg bleibt, Szene kommt nicht wieder
    erwarte(await p.evaluate(() => Story.setzeKapitel(1) === false && Story.kapitel() === 2), "Kapitel nie rückwärts");
    await p.goto(INSEL); await p.waitForTimeout(3500);
    erwarte(await p.evaluate(() => !!__heimat.kartenweg && !(window.__szene && __szene.aktuell())), "nach dem Neuladen: Weg steht, keine Szene");
    await ctx.close();
  }

  // ---------- Kapitel 4 „Paulas Fest“ und Kapitel 5 „Der Sturm“ (05./06.11.2026) ----------
  {
    const { ctx, p } = await neuesKind();
    // Lernfunde: höchstens 5 am Tag – für den Test den Zähler direkt setzen
    const funde = (n) => p.evaluate((n) => { const d = Spielwelt.lade("lernfunde") || { tage: {} }; d.tage = d.tage || {}; d.summe = n; Spielwelt.speichere("lernfunde", d); }, n);
    await p.evaluate(() => Story.setzeKapitel(3)); await funde(14);
    await p.goto(INSEL); await p.waitForTimeout(2500);
    erwarte(await naechste(p) === null, "Kapitel 3 und 14 Lernfunde: Kapitel 4 wartet");
    await funde(15);
    erwarte(await naechste(p) === "paulas-fest", "15 Lernfunde und Atelier (E9): Kapitel 4 „Paulas Fest“ ist dran");
    await p.goto(INSEL);
    await p.waitForFunction(() => window.__szene && __szene.aktuell() && __szene.aktuell().id === "paulas-fest", null, { timeout: 20000 });
    let a = await p.evaluate(() => __szene.aktuell());
    erwarte(a.wer === "papagei" && a.zeigt, "Paula spricht, die Zeigehand zeigt auf die Bühne");
    await weiter(p); a = await p.evaluate(() => __szene.aktuell());
    erwarte(a && a.zeigt, "zweite Blase zeigt zur Ballon-Wiese");
    await bild(p, "kapitel-4");
    while (await p.evaluate(() => !!(window.__szene && __szene.aktuell()))) await weiter(p);
    erwarte(await p.evaluate(() => Story.kapitel() === 4), "Kapitel 4 erreicht");
    erwarte(await p.evaluate(() => InselKern.antwort("ballons").blase[4] === "../rhythmus/"), "Ballon-Wiese führt jetzt zum Rhythmus-Boot");
    // Kapitel 5: 25 Lernfunde und ein Wetter-Thema
    await funde(25);
    erwarte(await naechste(p) === null, "25 Lernfunde ohne Wetter-Thema: Kapitel 5 wartet");
    await p.evaluate(() => Spielwelt.speichere("sachkunde", { themen: { wetter: 2 } }));
    erwarte(await naechste(p) === "der-sturm", "mit „Wetter beobachten“: Kapitel 5 „Der Sturm“ ist dran");
    await p.goto(INSEL);
    await p.waitForFunction(() => window.__szene && __szene.aktuell() && __szene.aktuell().id === "der-sturm", null, { timeout: 20000 });
    a = await p.evaluate(() => __szene.aktuell());
    erwarte(a.wer === "eule" && a.zeigt, "Ella spricht und zeigt (Sturm-Szene)");
    await weiter(p); a = await p.evaluate(() => __szene.aktuell());
    erwarte(a.wer === "baer" && /Angst/.test(a.text) && /Ein – aus/.test(a.text), "Bruni hat ein bisschen Angst – das Kind atmet mit ihr (07.11.2026)");
    await weiter(p); a = await p.evaluate(() => __szene.aktuell());
    erwarte(a && a.zeigt, "Ella zeigt zur Wetterstation");
    await bild(p, "kapitel-5");
    while (await p.evaluate(() => !!(window.__szene && __szene.aktuell()))) await weiter(p);
    erwarte(await p.evaluate(() => Story.kapitel() === 5 && Story.chronik().some(x => x.s === "der-sturm")), "Kapitel 5 erreicht, Szene in der Chronik");
    // Wetterstation antippen: jetzt der Drache (Knopf-Aufschrift entsteht beim Laden der Insel)
    await p.goto(INSEL); await p.waitForTimeout(3000);
    await p.evaluate(() => { const o = InselKern.erstelle(new URLSearchParams(location.search)).P.station; __heimat.ich.position.set(o[0] + 0.9, __heimat.ich.position.y, o[1] + 0.7); });
    await p.waitForTimeout(900);
    const akt5 = await p.evaluate(() => __heimat.aktion);
    await p.evaluate(() => __heimat.druecke()); await p.waitForTimeout(400);
    const titel5 = await p.evaluate(() => document.getElementById("blase-titel").textContent);
    erwarte(akt5 === "Drachen" && /Wetter-Drache/.test(titel5), `an der Wetterstation: Knopf „${akt5}“, Ella lädt zum Wetter-Drachen ein`);
    await bild(p, "kapitel-station");
    // Kapitel 6 „Der Leuchtturm“ (07.11.2026): 35 Lernfunde und drei Schach-Rätsel; danach leuchtet die Lampe, nachts kreist der Strahl
    await funde(35);
    erwarte(await naechste(p) === null, "35 Lernfunde ohne Schach: Kapitel 6 wartet");
    erwarte(await p.evaluate(() => { const l = __heimat.leuchtturm(); return l.lampe !== "#ffe14d" && !l.strahl; }), "vor Kapitel 6 ist die Lampe des Leuchtturms dunkel");
    await p.evaluate(() => Spielwelt.speichere("schach", { lektionen: {}, raetsel: { 0: 1, 1: 1, 2: 1 }, siege: {}, rennen: 0 }));
    erwarte(await naechste(p) === "der-leuchtturm", "mit drei Schach-Rätseln: Kapitel 6 „Der Leuchtturm“ ist dran");
    await p.goto(INSEL);
    await p.waitForFunction(() => window.__szene && __szene.aktuell() && __szene.aktuell().id === "der-leuchtturm", null, { timeout: 20000 });
    a = await p.evaluate(() => __szene.aktuell());
    erwarte(a.wer === "tilda" && a.zeigt, "Tilda spricht und zeigt (Leuchtturm-Szene)");
    await weiter(p); a = await p.evaluate(() => __szene.aktuell());
    erwarte(a && a.zeigt, "zweite Blase zeigt zum Leuchtturm am Ufer");
    await bild(p, "kapitel-6");
    // Review 07.11.2026: Blase 3 sagt „dann leuchtet der Turm“ – die Lampe muss jetzt schon an sein (Kapitel 6 wird hier gemerkt, nicht erst mit der letzten Blase)
    await weiter(p); a = await p.evaluate(() => __szene.aktuell());
    erwarte(!!a && await p.evaluate(() => __heimat.leuchtturm().lampe === "#ffe14d" && Story.kapitel() === 6), "dritte Blase: die Lampe leuchtet, während Tilda es sagt (Kapitel 6 schon gemerkt)");
    await weiter(p);
    erwarte(!!(await p.evaluate(() => __szene.aktuell())), "vierte Blase folgt (Kl. 2) – die Lampe war also schon vor der letzten Blase an");
    while (await p.evaluate(() => !!(window.__szene && __szene.aktuell()))) await weiter(p);
    erwarte(await p.evaluate(() => Story.kapitel() === 6 && Story.chronik().some(x => x.s === "der-leuchtturm")), "Kapitel 6 erreicht, Szene in der Chronik");
    erwarte(await p.evaluate(() => __heimat.leuchtturm().lampe === "#ffe14d"), "nach der Szene leuchtet die Lampe");
    await p.goto(INSEL); await p.waitForTimeout(3000);
    await p.evaluate(() => { const l = __heimat.leuchtturm(), r = Math.hypot(l.x, l.z); __heimat.ich.position.set(l.x * (r - 1.6) / r, __heimat.ich.position.y, l.z * (r - 1.6) / r); });
    await p.waitForTimeout(900);
    const akt6 = await p.evaluate(() => __heimat.aktion);
    await p.evaluate(() => __heimat.druecke()); await p.waitForTimeout(400);
    const blase6 = await p.evaluate(() => ({ t: document.getElementById("blase-titel").textContent }));
    erwarte(akt6 === "Leuchtturm" && /Tildas Leuchtturm/.test(blase6.t), `am Leuchtturm: Knopf „${akt6}“, Tilda lädt in die Höhle ein`);
    await bild(p, "kapitel-leuchtturm");
    // nachts: Lichtstrahl
    await p.goto(INSEL.replace("stunde=14", "stunde=22")); await p.waitForTimeout(3000);
    erwarte(await p.evaluate(() => __heimat.leuchtturm().strahl), "nachts kreist der Lichtstrahl des Leuchtturms");
    await p.evaluate(() => { const l = __heimat.leuchtturm(); __heimat.ich.position.set(l.x * 0.7, __heimat.ich.position.y, l.z * 0.7); }); await p.waitForTimeout(1200);
    await bild(p, "kapitel-leuchtturm-nacht");
    // Kapitel 7 „Neue Ufer“ (09.11.2026): 50 Lernfunde und Tablet-Führerschein; danach fährt Robos Boot (Details in tests/expedition.js)
    await p.goto(INSEL); await p.waitForTimeout(2500);
    await funde(50);
    erwarte(await naechste(p) === null, "50 Lernfunde ohne Führerschein: Kapitel 7 wartet");
    await p.evaluate(() => { const m = Spielwelt.lade("medien") || {}; m.fuehrerschein = "2026-10-20"; Spielwelt.speichere("medien", m); });
    erwarte(await naechste(p) === "neue-ufer", "mit Führerschein: Kapitel 7 „Neue Ufer“ ist dran");
    erwarte(await p.evaluate(() => __heimat.boot().aktion === "Ansehen"), "vor der Szene zeigt das Boot „Ansehen“");
    await p.goto(INSEL);
    await p.waitForFunction(() => window.__szene && __szene.aktuell() && __szene.aktuell().id === "neue-ufer", null, { timeout: 20000 });
    a = await p.evaluate(() => __szene.aktuell());
    erwarte(a.wer === "robo" && a.zeigt && a.anzahl === 4, "Robo spricht und zeigt zum Steg (4 Blasen)");
    await bild(p, "kapitel-7");
    await weiter(p);
    erwarte(await p.evaluate(() => Story.kapitel() === 7 && __heimat.boot().aktion === "Boot"), "zweite Blase: Kapitel 7 gemerkt, Boot bereit");
    while (await p.evaluate(() => !!(window.__szene && __szene.aktuell()))) await weiter(p);
    erwarte(await p.evaluate(() => Story.kapitel() === 7 && Story.chronik().some(x => x.s === "neue-ufer") && Story.KAPITEL_ZAHL === 9), "Kapitel 7 erreicht, Szene in der Chronik, KAPITEL_ZAHL = 9 (Finale, 07.11.2026)");
    await ctx.close();
  }

  // ---------- E9 Atelier ----------
  {
    const { ctx, p } = await neuesKind({ e9: false });
    await p.evaluate((t) => { localStorage.setItem("__testJetzt", String(t)); }, TAG(20));
    await p.goto(INSEL); await p.waitForTimeout(2500);
    erwarte(await naechste(p) === null, "E9 am ersten Tag noch nicht");
    await p.evaluate((t) => localStorage.setItem("__testJetzt", String(t)), TAG(22));
    await p.goto(INSEL);
    await p.waitForFunction(() => window.__szene && __szene.aktuell() && __szene.aktuell().id === "atelier", null, { timeout: 20000 });
    const a = await p.evaluate(() => __szene.aktuell());
    erwarte(a.wer === "papagei" && a.zeigt, "Tag 3: Paula zeigt auf ihre Bühne (E9)");
    await bild(p, "kapitel-atelier");
    for (let i = 0; i < 3; i++) await weiter(p);
    erwarte(await p.evaluate(() => Story.etappe("E9") && !__szene.aktuell()), "E9 erledigt");
    await ctx.close();
  }
  {
    const { ctx, p } = await neuesKind({ e9: false });
    await p.evaluate((t) => { localStorage.setItem("__testJetzt", String(t)); Spielwelt.speichere("atelier", { wand: [], gemalt: 2, tage: {}, auftraege: {} }); }, TAG(22));
    await p.goto(INSEL); await p.waitForTimeout(3000);
    erwarte(await p.evaluate(() => Story.zustand().etappen.E9 === 1 && !(window.__szene && __szene.aktuell())), "wer schon gemalt hat, bekommt E9 still");
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Kapitel-Test (Kapitel 2, E9) bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
