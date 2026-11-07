// Playwright-Test (07.11.2026, Paket „Sofort-Fehler“ aus dem Review): Inhaltsfehler bleiben behoben, ehrliche Rückmeldungen und die Eltern-Übergabe
// werden echt durchgeklickt.
//  1) Ersteinrichtung: nach „Fertig – los geht's“ kommt der Übergabe-Bildschirm, die Eltern-Sitzung ist zu; zurück in den Elternbereich nur mit PIN;
//     Neuladen hält die Anmeldung, Verlassen beendet sie, „neues Kind“ bleibt im Bereich
//  2) Matheweg: eine Runde mit einem Fehlversuch lobt nicht „Alles beim ersten Mal richtig“ (auch Russisch), eine fehlerfreie schon
//  3) Deutsch: falsches Bild bei „Wo ist das Eichhörnchen?“ → „Schau noch einmal genau hin“ (nicht „Hör …“)
//  4) Garten Kl. 2: vier Beete, keine Zeile mit nur einem Beet (quer und Handy)
//  5) Inhalte: Wetterkarten-Pfeil, Vorschul-Spiele ohne Mehrdeutigkeiten, Musik/Ethik/Werken, Märchen, Rehkitz, russische Formen Junge/Mädchen
// Aufruf: sh tests/laufen.sh sofort   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo/;

process.on("unhandledRejection", (e) => { console.log("❌ Abbruch: " + e.message + "\n  " + (global.__fehler || []).join("\n  ")); process.exit(1); });
(async () => {
  const browser = await chromium.launch();
  const fehler = global.__fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/sofort-${name}.png` }); };
  async function neu(breite = 1180, hoehe = 820) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__testSchnell = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    return { ctx, p };
  }
  const sitzung = (p) => p.evaluate(() => sessionStorage.getItem(Spielwelt.vorsilbe + "eltern"));

  // ---------- 1) Übergabe nach der Ersteinrichtung ----------
  const { ctx, p } = await neu();
  await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
  await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "3");
  await p.selectOption("#e-sprache", "ru").catch(() => {});
  if (await p.$("#e-dosis")) await p.selectOption("#e-dosis", "immer").catch(() => {});
  await p.click("#e-ok");
  await p.waitForSelector("#uebergabe");
  const ub = await p.textContent("#uebergabe");
  erwarte(/Gib das Tablet jetzt deinem Kind/.test(ub) && !!(await p.$("#uebergabe-los")) && /eltern/.test(p.url()), "nach „Fertig – los geht's“: Übergabe-Bildschirm „Gib das Tablet jetzt deinem Kind“ mit Knopf „Los geht's“");
  erwarte(!(await sitzung(p)), "Eltern-Sitzung ist schon auf dem Übergabe-Bildschirm beendet");
  await bild(p, "uebergabe");
  await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString()));
  erwarte(true, "„Los geht's“ führt zur Startseite");
  await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(400);
  erwarte(!!(await p.$("#pin1")) && !(await p.$(".eltern-reiter")), "das Kind kommt danach nicht ohne PIN in den Elternbereich");
  await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForSelector(".eltern-reiter");
  await p.reload(); await p.waitForTimeout(500);
  erwarte(!!(await p.$(".eltern-reiter")), "Neuladen hält die Anmeldung (15 Minuten)");
  // Verlassen über „Bereich schließen“
  await p.click('.eltern-reiter [data-teil="kinder"]').catch(() => {});
  await p.click("#abmelden"); await p.waitForURL(u => !/eltern/.test(u.toString()));
  await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(400);
  erwarte(!!(await p.$("#pin1")), "„Bereich schließen“ meldet ab");
  // Verlassen über einen normalen Seitenwechsel (z. B. ⬅️ zur Startseite)
  await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForSelector(".eltern-reiter");
  await p.goto(BASIS); await p.waitForTimeout(400);
  await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(400);
  erwarte(!!(await p.$("#pin1")), "Verlassen des Elternbereichs (Seitenwechsel) meldet ab");
  // neues Kind anlegen: bleibt im Bereich, danach wieder Übergabe
  await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForSelector(".eltern-reiter");
  await p.click('.eltern-reiter [data-teil="kinder"]'); await p.click("#kind-neu"); await p.waitForSelector("#e-name");
  erwarte(true, "„Neues Kind“ öffnet die Einrichtung ohne neue PIN");
  await p.fill("#e-name", "Leon"); await p.click("#e-ok"); await p.waitForSelector("#uebergabe");
  erwarte(!(await sitzung(p)), "auch nach dem zweiten Kind: Übergabe, Sitzung zu");
  await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(400);
  // zurück zu Mira
  if (await p.$(".wer-kind")) { await p.click(".wer-kind >> nth=0"); await p.waitForTimeout(500); }
  await p.evaluate(() => { const k = Spielwelt.kinder().find(x => x.name === "Mira"); if (k && Spielwelt.profil.name !== "Mira") Spielwelt.wechsleKind(k.id); for (let i = 0; i < 12; i++) Zeit.aufgabe(); });
  // Hilfesprache Russisch sicher setzen (für die russische Zeile am Rundenende)
  await p.evaluate(() => { const e = Spielwelt.lade("eltern"); e.kind.hilfesprache = "ru"; e.kind.hilfedosis = "immer"; Spielwelt.speichere("eltern", e); });

  // ---------- 2) Matheweg: ehrliches Lob ----------
  async function tippe(richtig) {
    const a = await p.evaluate(() => { const x = __mathe.lauf.liste[__mathe.lauf.pos]; return { art: x.art, antwort: x.antwort }; });
    if (a.art === "wahl") await p.evaluate(([w, r]) => [...document.querySelectorAll(".wahl-tasten .taste")].find(b => r ? b.dataset.wert === w : b.dataset.wert !== w).click(), [a.antwort, richtig]);
    else { for (const z of a.antwort) await p.click(`.taste[data-ziffer="${z}"]`); await p.click(".taste.ok"); }
    return a.art;
  }
  async function runde(mitFehler) {
    const nr = await p.evaluate(() => Mathe.STATIONEN_K3.findIndex(s => s.id === "k3vierecke"));
    await p.evaluate((n) => __mathe.starte(n), nr); await p.waitForTimeout(200);
    let fehlerGemacht = false;
    for (let i = 0; i < 12; i++) {
      if (await p.evaluate(() => !document.getElementById("ende-ansicht").hidden)) break;
      const art = await p.evaluate(() => __mathe.lauf.liste[__mathe.lauf.pos].art);
      if (mitFehler && !fehlerGemacht && art === "wahl") { await tippe(false); fehlerGemacht = true; await p.waitForTimeout(900); }
      await tippe(true); await p.waitForTimeout(1050);
    }
    await p.waitForSelector("#ende-ansicht:not([hidden])", { timeout: 5000 });
    const t = await p.textContent("#ende-text");
    return { t, fehlerGemacht };
  }
  await p.goto(BASIS + "spiele/mathe/"); await p.waitForSelector("#karte .station");
  {
    const r = await runde(true);
    erwarte(r.fehlerGemacht && !/Alles beim ersten Mal richtig/.test(r.t) && /Einmal hast du nochmal hingeschaut/.test(r.t), `Runde mit einem Fehlversuch: ehrliches Lob („${r.t.slice(0, 80)}“)`);
    erwarte(/Один раз ты посмотрел\(а\) ещё раз/.test(r.t), "… mit russischer Zeile (Hilfesprache Russisch)");
    await bild(p, "mathe-ende");
    await p.click("text=Zum Matheweg"); await p.waitForTimeout(200);
    const r2 = await runde(false);
    erwarte(/Alles beim ersten Mal richtig/.test(r2.t), "fehlerfreie Runde: „Alles beim ersten Mal richtig“");
    // Eigene Idee: russische Formen nach der Ansprache im Elternbereich (Mädchen → посмотрела, Junge → посмотрел, keine Angabe → beide)
    const formen = await p.evaluate(() => ["m", "w", "n"].map(g => Spielwelt.ruDu("Ты так многому научился(-ась)! Ты приглашён(а). Ты сделал(а), нашёл (нашла) и вырос(ла). Сколько (раз)?", g)));
    erwarte(formen[0] === "Ты так многому научился! Ты приглашён. Ты сделал, нашёл и вырос. Сколько (раз)?", "Junge: научился, приглашён, сделал, нашёл, вырос (" + formen[0] + ")");
    erwarte(formen[1] === "Ты так многому научилась! Ты приглашена. Ты сделала, нашла и выросла. Сколько (раз)?", "Mädchen: научилась, приглашена, сделала, нашла, выросла (" + formen[1] + ")");
    erwarte(/научился\(-ась\)/.test(formen[2]) && /нашёл \(нашла\)/.test(formen[2]), "keine Angabe: beide Formen bleiben");
    await p.evaluate(() => { const e = Spielwelt.lade("eltern"); e.kind.geschlecht = "w"; Spielwelt.speichere("eltern", e); });
    await p.click("text=Zum Matheweg"); await p.waitForTimeout(200);
    const r3 = await runde(true);
    erwarte(/Один раз ты посмотрела ещё раз/.test(r3.t), "Mädchen: Rundenende auf Russisch „посмотрела“ (echt gespielt)");
    await p.goto(BASIS + "spiele/album/"); await p.waitForTimeout(400);
    const sz = await p.evaluate(() => Szene.hilfeText({ de: "x", ru: "Ты так многому научился(-ась)!" }));
    erwarte(sz && /научилась!/.test(sz.text), "Szenen-Hilfetext nutzt die passende Form (" + (sz ? sz.text : "–") + ")");
    await p.evaluate(() => { const e = Spielwelt.lade("eltern"); e.kind.geschlecht = "n"; Spielwelt.speichere("eltern", e); });
  }

  // ---------- 3) Deutsch: Rückmeldung passend zum Schritt ----------
  await p.goto(BASIS + "spiele/deutsch/"); await p.waitForTimeout(500);
  {
    await p.evaluate(() => __deutsch.starte(0)); await p.waitForTimeout(200);
    const i = await p.evaluate(() => __deutsch.lauf.k.schritte.findIndex(s => s.typ === "bild" && /Eichhörnchen/.test(s.frage)));
    await p.evaluate((n) => __deutsch.schritt(n), i); await p.waitForTimeout(250);
    await p.click('.option:not([aria-label="das Eichhörnchen"])');
    await p.waitForTimeout(250);
    const h = await p.textContent("#hinweis");
    erwarte(/Schau noch einmal genau hin/.test(h) && !/Hör/.test(h), `„Wo ist das Eichhörnchen?“ falsch: „${h.split("\n")[0].slice(0, 60)}“`);
    await bild(p, "deutsch-bild");
  }

  // ---------- 4) Garten: vier Beete ohne Einzel-Beet in der letzten Zeile ----------
  await p.evaluate(() => { const e = Spielwelt.lade("eltern"); e.kind.stufe = "2"; e.kind.klasse = 2; Spielwelt.speichere("eltern", e); Story.setzeKapitel(1); });
  for (const [b, h, art] of [[1180, 820, "quer"], [820, 1180, "hoch"], [390, 760, "Handy"]]) {
    await p.setViewportSize({ width: b, height: h });
    await p.goto(BASIS + "spiele/garten/"); await p.waitForTimeout(500);
    const z = await p.evaluate(() => { const tops = [...document.querySelectorAll(".beet")].map(x => Math.round(x.getBoundingClientRect().top)); const je = {}; tops.forEach(t => { je[t] = (je[t] || 0) + 1; }); return { n: tops.length, zeilen: Object.values(je) }; });
    erwarte(z.n === 4 && z.zeilen.every(x => x >= 2), `Garten ${art}: 4 Beete, Zeilen ${z.zeilen.join("/")}`);
    await bild(p, "garten-" + art);
  }
  await p.setViewportSize({ width: 1180, height: 820 });

  // ---------- 5) Inhalte ----------
  await p.goto(BASIS + "spiele/sachkunde/"); await p.waitForTimeout(400);
  {
    const w = await p.evaluate(() => { for (const t of THEMEN) for (const s of t.schritte || []) if (/Wetterkarte/.test(s.satz || "")) return s; return null; });
    erwarte(w && /wohin der Wind weht/.test(w.satz) && w.ok === true && /куда дует/.test(w.satzRu) && /zeigt nach Osten/.test(w.warum), "Wetterkarte: der Pfeil zeigt, wohin der Wind weht (Westwind → Pfeil nach Osten)");
    const f = await p.evaluate(() => JSON.stringify(window.FACH_THEMEN || []));
    erwarte(!/doppelt so lang wie der Grundschlag[^"]*"[^\]]*zwei Schläge warten/.test(f) && /einen Schlag lang halten/.test(f), "Musik: langer Klang = einmal klatschen und einen Schlag lang halten");
    erwarte(!/im Koran/.test(f) && /Goldene Regel gibt es in vielen Religionen/.test(f), "Ethik: Goldene Regel sachlich (in vielen Religionen)");
    erwarte(!/Thermoplast|Duroplast|Elastomer/.test(f), "Werken Kl. 4: keine Fachwörter Thermoplaste/Duroplaste/Elastomere");
  }
  await p.goto(BASIS + "spiele/vorschule/"); await p.waitForTimeout(400);
  {
    const v = await p.evaluate(() => {
      const a = window.VORSCHULE.flatMap(s => s.aufgaben.map(x => Object.assign({ spiel: s.id }, x)));
      const such = (re) => a.find(x => re.test(x.frage));
      return { haende: such(/Wann wäschst du dir die Hände/).optionen, wurm: such(/Schlange oder/), jahr: a.filter(x => x.spiel === "vs-jahr").map(x => x.frage),
        reime: a.filter(x => x.spiel === "vs-reime").flatMap(x => x.optionen), anzahl: window.VORSCHULE.length,
        // Wächter für künftige Aufgaben: Optionen verschieden, das Spiel-Bild verrät keine richtige Antwort, jede Aufgabe hat eine Erklärung
        doppelt: a.filter(x => x.optionen && new Set(x.optionen).size !== x.optionen.length).map(x => x.frage),
        verraet: window.VORSCHULE.filter(s => s.aufgaben.some(x => x.optionen && x.optionen[0] === s.e)).map(s => s.id),
        ohneWarum: a.filter(x => !x.warum).map(x => x.frage) };
    });
    erwarte(!v.haende.includes("🛝") && v.haende[0] === "🍽️", "Hände waschen: kein Spielplatz als falsche Antwort");
    erwarte(!v.wurm.optionen.includes("🐛") && v.wurm.optionen.includes("🪱"), "Schlange oder Wurm: Wurm-Bild statt Raupe");
    erwarte(!v.jahr.some(f => /schwimmt/.test(f)), "Jahreszeiten: keine Schwimm-Frage mehr");
    erwarte(!v.reime.includes("🏖️") && !v.reime.includes("🐇") && !v.reime.includes("🪨"), "Reime: nur eindeutige Bilder (kein Strand/Sand, Hase/Kaninchen, Stein/Fels)");
    erwarte(v.anzahl === 16, "16 Vorschul-Spiele");
    erwarte(!v.doppelt.length && !v.verraet.length && !v.ohneWarum.length, `alle Vorschul-Aufgaben: verschiedene Optionen, Spiel-Bild verrät nichts, jede mit Erklärung (${[...v.doppelt, ...v.verraet, ...v.ohneWarum].join(", ")})`);
  }
  {
    const txt = async (pfad) => p.evaluate((u) => fetch(u).then(r => r.text()), BASIS + pfad);
    const werk = await txt("spiele/deutsch/werkstatt.js"), station = await txt("spiele/tierstation/station.js");
    const szenen = await txt("shared/szenen.js"), kern = await txt("shared/insel-kern.js");
    erwarte(!/drei Küsse/.test(werk) && /selbst erfunden/.test(werk), "Märchenzeit: eigenes Frosch-Märchen ohne „drei Küsse“, klar als selbst erfunden");
    erwarte(!/Riecht es nach Menschen/.test(station) && /Wir schauen nur von weitem/.test(station) && /Мы смотрим только издалека/.test(station), "Rehkitz: ruhiger Hinweis „Nicht anfassen! … von weitem“ (auch Russisch)");
    erwarte(/Я нашёл кусочек/.test(szenen) && !/Я нашла кусочек/.test(szenen), "Fipsi (der kleine Fuchs) spricht männlich: „нашёл“");
    erwarte(!/научился!|научился –|приглашён!|сделал\.|ты выросла|здесь нашёл,/.test(szenen + kern) && /научился\(-ась\)/.test(szenen) && /приглашён\(а\)/.test(szenen) && /вырос\(ла\)/.test(kern) && /нашёл \(нашла\)/.test(kern),
      "Kind auf Russisch für Jungen und Mädchen: научился(-ась), приглашён(а), сделал(а), нашёл (нашла), вырос(ла)");
  }
  {
    const k = await p.evaluate(() => fetch("../tierstation/").then(() => true));
    await p.goto(BASIS + "spiele/tierstation/"); await p.waitForTimeout(400);
    const w = await p.evaluate(() => (window.__tierstation.TIERE.find(t => t.id === "kitz") || {}).frage);
    erwarte(k && w && /^Nicht anfassen! Die Mutter kommt zurück\./.test(w.w) && w.wRu, "Tierstation: Rehkitz-Hinweis in den Daten");
  }

  await ctx.close();
  await browser.close();
  if (fehler.length) { console.log("❌ Sofort-Fehler:\n  " + fehler.join("\n  ")); process.exit(1); }
  console.log("✅ Sofort-Fehler: alle Prüfungen bestanden.");
})();
