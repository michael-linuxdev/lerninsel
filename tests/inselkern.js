// Node-Test (NA-24): Insel-Kern ohne Browser – Welt, Orte, Nachbarn, Story-Reihenfolge, Weihnachtspaket, Nebel, Sonnenuhr, Zimmer.
// Aufruf: node tests/inselkern.js
// Spielwelt, Story, Szene, Zeit, Lernfunde und TierPflege werden hier durch kleine Attrappen ersetzt.
const assert = require("assert");
const fs = require("fs");
const path = require("path");

let n = 0;
const pruefe = (name, fn) => { fn(); n++; console.log("  ✓ " + name); };

// ---------- Attrappen ----------
function neueUmgebung({ story = {}, zeit = null, funde = 0, speicher = {}, jetzt, heuteFach = {}, sterne = 0, tier = null, karten = 0, minispieleAus = false } = {}) {
  const daten = JSON.parse(JSON.stringify(speicher)), frei = new Set(), geschenkeTier = [];
  const st = Object.assign({ kapitel: 0, etappen: {}, gesehen: [], geschenke: [] }, story);
  let neueHeute = 0;
  const window = {
    __jetzt: jetzt,
    Spielwelt: {
      profil: { name: "Mira" },
      lade: (k) => (k in daten ? JSON.parse(JSON.stringify(daten[k])) : null),
      speichere: (k, v) => { daten[k] = JSON.parse(JSON.stringify(v)); },
      offen: (x) => !!x, istFrei: (id) => frei.has(id), schalteFrei: (id) => { frei.add(id); return true; },
      paar: (x) => [x[0], ""], ht: () => "", kind: () => ({ ort: null }), sterne: () => sterne, MINISPIELE_AUS: minispieleAus
    },
    Story: {
      etappe: (e) => !!st.etappen[e], etappeFertig: (e, still) => { if (!st.etappen[e]) { st.etappen[e] = still ? 1 : "2026-10-27"; if (!still) neueHeute++; } },
      kapitel: () => st.kapitel, setzeKapitel: (k) => { st.kapitel = Math.max(st.kapitel, k); },
      gesehen: (id) => st.gesehen.includes(id), darfNeueEtappe: () => neueHeute < 2,
      zustand: () => st, hatGeschenk: (id) => st.geschenke.includes(id), merkeGeschenk: (id) => { if (!st.geschenke.includes(id)) st.geschenke.push(id); }
    },
    Szene: { laeuft: false },
    Lernfunde: { gesamt: () => funde, STUFEN: [1, 5, 15, 30], baum: () => ({ stufe: funde >= 15 ? 3 : funde >= 5 ? 2 : funde >= 1 ? 1 : 0, summe: funde, naechste: funde < 1 ? 1 : funde < 5 ? 5 : funde < 15 ? 15 : 30 }),
      heute: () => [], heuteFach: (f) => (heuteFach[f] || null) },
    TierPflege: { schenke: (x) => geschenkeTier.push(x), lade: () => tier || { phase: null } },
    Lernkartei: { anzahlFaellig: (f) => (f === "deutsch" ? karten : 0) }
  };
  if (zeit) window.Zeit = { status: () => zeit };
  // im selben Realm laden (sonst vergleicht assert Arrays aus zwei Welten als ungleich); window ist hier ein Parameter
  new Function("window", fs.readFileSync(path.join(__dirname, "../shared/insel-kern.js"), "utf8"))(window);
  return { K: window.InselKern, window, st, daten, frei, geschenkeTier };
}
const q = (s) => new URLSearchParams(s);
// Koordinaten auf 4 Stellen runden (Gleitkomma)
const r4 = (o) => JSON.parse(JSON.stringify(o, (k, v) => typeof v === "number" ? +v.toFixed(4) : v));

// ---------- Welt ----------
pruefe("ohne gespeicherte Welt gilt die bisherige Insel (flach, feste Plätze)", () => {
  const { K } = neueUmgebung();
  const I = K.erstelle(q(""));
  assert.strictEqual(I.WELT.insel, true);
  assert.strictEqual(I.WELT.R, 19);   // Weg 3 (09.11.2026): vorher 15,2
  assert.deepStrictEqual(I.P.haus, [-6.2, -5.6, 0.35]);
  assert.strictEqual(I.bodenY(3, 4), 0.25);
  assert.strictEqual(I.UFER, 19); assert.strictEqual(r4(I.RMAX_LAUF), 18.4);
  assert.deepStrictEqual(r4(I.STEG), { x: 3.2, z0: 16.8, z1: 21.4 });
  assert.deepStrictEqual(r4(I.SU), { x: 5.3, z: 17.3 });
  assert.deepStrictEqual(r4(I.PAKET_POS), { x: 4.15, z: 16.95 });
  assert.strictEqual(I.HAUS_DREH, 0.35);
  assert.deepStrictEqual(r4(I.NEBEL[0]), { near: 16, far: 44, r: 22.2, a: 0.85 });
});

pruefe("größere Heimatinsel (Weg 3): Orte mit Abstand, innerhalb der Laufgrenze, kein Baum auf einem Ort, 14 Bäume, 5 Steine", () => {
  const { K } = neueUmgebung();
  const I = K.erstelle(q("")), P = I.P, ks = Object.keys(P);
  assert.strictEqual(I.WELT.baeume.length, 14); assert.strictEqual(I.WELT.steine.length, 5);
  const NAH = [["nest", "station"], ["biber", "schild"], ["start", "tier"]];   // gehören zusammen
  ks.forEach(a => ks.forEach(b => {
    if (a >= b || NAH.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) return;
    const d = Math.hypot(P[a][0] - P[b][0], P[a][1] - P[b][1]);
    assert.ok(d >= 2.4, `Orte zu nah: ${a} – ${b} (${d.toFixed(2)})`);
  }));
  ks.forEach(k => assert.ok(Math.hypot(P[k][0], P[k][1]) <= I.RMAX_LAUF - 0.9, `Ort ${k} zu nah am Ufer`));
  I.WELT.baeume.forEach(b => { ks.forEach(k => assert.ok(Math.hypot(b.x - P[k][0], b.z - P[k][1]) > 1.5, `Baum im Ort ${k}`)); assert.ok(Math.hypot(b.x, b.z) < I.WELT.R - 3, "Baum im Sand"); });
  // der Leuchtturm steht am Ufer, Tür zur Mitte
  const [lx, lz, ld] = P.leuchtturm; assert.ok(Math.hypot(lx, lz) > I.RMAX_LAUF - 2.5 && Math.hypot(lx, lz) < I.RMAX_LAUF, "Leuchtturm am Ufer");
  assert.strictEqual(+ld.toFixed(4), +Math.atan2(-lx, -lz).toFixed(4));
  // Gras-Halme und Blumen bleiben auf dem Gras (Blumenwiesen: zwei Haufen, Frühling dichter)
  const bl = K.blumenwiesen(24), bl2 = K.blumenwiesen(14);
  assert.ok(bl.length >= 36 && bl2.length >= 20 && bl.length > bl2.length, `Blumenwiesen: ${bl.length} / ${bl2.length}`);
  bl.forEach(([x, z]) => { assert.ok(Math.hypot(x, z) < I.WELT.R - 3.3, "Blume im Sand"); ks.forEach(k => assert.ok(Math.hypot(x - P[k][0], z - P[k][1]) >= 1.4, `Blume im Ort ${k}`)); });
});

pruefe("Trittstein-Wege führen vom Start zu Garten, Bäckerei, Tierstation und Leuchtturm", () => {
  const { K } = neueUmgebung();
  const I = K.erstelle(q("")), P = I.P;
  assert.strictEqual(I.WEGE.length, 5);
  const start = [P.start[0] + 1, P.start[1] + 2];
  [["lauf", 0], ["kart", 1], ["bau", 2], ["leuchtturm", 3], ["lager", 4]].forEach(([ziel, i]) => {
    const w = I.WEGE[i], abzweig = ziel === "leuchtturm";   // der Leuchtturm-Weg zweigt vom Weg zur Tierstation ab
    assert.ok(w.length >= (abzweig ? 2 : 5), `Weg ${ziel}: nur ${w.length} Steine`);
    const erster = w[0], letzter = w[w.length - 1];
    if (abzweig) assert.ok(I.WEGE[2].some(s => Math.hypot(s[0] - erster[0], s[1] - erster[1]) < 2.2), "Leuchtturm-Weg beginnt am Weg zur Tierstation");
    else assert.ok(Math.hypot(erster[0] - start[0], erster[1] - start[1]) < 6, `Weg ${ziel} beginnt am Start`);
    assert.ok(Math.hypot(letzter[0] - P[ziel][0], letzter[1] - P[ziel][1]) < 4.2, `Weg ${ziel} endet am Ziel (${Math.hypot(letzter[0] - P[ziel][0], letzter[1] - P[ziel][1]).toFixed(2)})`);
    for (let k = 1; k < w.length; k++) assert.ok(Math.hypot(w[k][0] - w[k - 1][0], w[k][1] - w[k - 1][1]) <= 4.5, `Weg ${ziel}: Lücke bei Stein ${k}`);
    w.forEach(([x, z]) => { I.WELT.baeume.forEach(b => assert.ok(Math.hypot(b.x - x, b.z - z) >= 1.3, `Weg ${ziel}: Stein im Baum`)); assert.ok(Math.hypot(x, z) <= I.RMAX_LAUF - 0.8, "Stein im Wasser"); });
  });
  // keine doppelten Steine (gemeinsamer Anfang zweier Wege)
  const alle = [...I.WELT.pfad, ...I.WEGE.flat()];
  alle.forEach((a, i) => alle.forEach((b, j) => { if (i < j) assert.ok(Math.hypot(a[0] - b[0], a[1] - b[1]) >= 1.0, `doppelter Stein ${a} / ${b}`); }));
  // eigene Welten haben keine Trittstein-Wege (eigener Pfad aus der Welt)
  assert.deepStrictEqual(K.erstelle(q("?biom=wald&seed=3")).WEGE, []);
});

pruefe("Welterzeugung wie vor der Trennung (Werte aus dem alten welt.js, Saat 7)", () => {
  const { K } = neueUmgebung();
  const erwartet = { wiese: [17, 0.9105], wald: [52, 1.2139], berge: [24, 3.0349], strand: [14, 0.4552], schnee: [28, 1.6186], wueste: [17, 1.1128] };
  for (const [biom, [baeume, h]] of Object.entries(erwartet)) {
    const w = K.erzeuge({ biom, seed: 7, groesse: "mittel", huegel: "viel", see: true, blumen: true });
    assert.deepStrictEqual(w.plaetze.haus.map(v => +v.toFixed(4)), [7.1805, 0.529, -1.6443], biom);
    assert.strictEqual(w.baeume.length, baeume, biom);
    assert.strictEqual(+w.hoehe(3, -2).toFixed(4), h, biom);
  }
});

pruefe("Teich-Wunsch wird fast immer erfüllt (10.11.2026: auch kleine Welten), ohne andere Welten zu ändern; nie an einem Ort", () => {
  const { K } = neueUmgebung();
  for (const groesse of ["klein", "mittel", "gross"]) { let mit = 0, alle = 0;
    for (const biom of Object.keys(K.BIOME)) for (const huegel of ["wenig", "mittel", "viel"]) for (let seed = 1; seed <= 12; seed++) {
      alle++; const I = K.erstelle(new URLSearchParams(`biom=${biom}&groesse=${groesse}&huegel=${huegel}&see=1&seed=${seed}`)), W = I.WELT;
      if (!W.see) continue; mit++;
      for (const [k, p] of Object.entries(I.P)) if (Array.isArray(p)) assert.ok(Math.hypot(p[0] - W.see.x, p[1] - W.see.z) > W.see.r + 0.8, `Teich auf ${k}: ${biom}/${groesse}/${seed}`);
      assert.ok(Math.hypot(W.see.x, W.see.z) + W.see.r < W.rand, `Teich im Sand: ${biom}/${groesse}/${seed}`);
      // ohne Teich-Wunsch bleibt die Welt, wie sie war (Bäume an ihrem Platz)
      const ohne = K.erzeuge({ biom, groesse, huegel, see: false, seed });
      assert.ok(ohne.see === null, "ohne Wunsch kein Teich");
    }
    assert.ok(mit / alle >= (groesse === "klein" ? 0.85 : 0.97), `${groesse}: Teich in ${mit} von ${alle} Welten`);
  }
});

pruefe("Test-Parameter und gespeicherte Welt werden gelesen", () => {
  const { K } = neueUmgebung({ speicher: { welt: { welten: [{ biom: "strand", seed: 3, groesse: "klein" }], aktiv: 0 } } });
  assert.strictEqual(K.erstelle(q("")).WELT.biom, "strand");
  assert.strictEqual(K.erstelle(q("?biom=berge&seed=5")).WELT.biom, "berge");
  const I = K.erstelle(q("?biom=wald&groesse=gross&seed=9"));
  assert.strictEqual(I.UFER, 25); assert.strictEqual(r4(I.RMAX_LAUF), 24.4);
  assert.ok(I.bodenY(70, 0) === 0.25, "im Zimmer ist der Boden flach");
  assert.ok(I.bodenY(40, 0) < -1, "weit draußen liegt Wasser");
});

pruefe("Tages- und Jahreszeit aus der Uhr oder den Test-Parametern", () => {
  const { K } = neueUmgebung();
  assert.deepStrictEqual(K.zeit(q("?stunde=21&monat=12")), { STUNDE: 21, MONAT: 12, SAISON: "winter", NACHT: true, DAEMMER: false });
  const z = K.zeit(q(""), new Date(2026, 6, 1, 18, 30));
  assert.deepStrictEqual([z.SAISON, z.NACHT, z.DAEMMER], ["sommer", false, true]);
});

// ---------- Orte und Nachbarn ----------
pruefe("Nachbarn mit Platz, Texten und Ziel; Robo Pixel wohnt am Steg", () => {
  const { K } = neueUmgebung();
  const I = K.erstelle(q("")), N = I.nachbarn();
  assert.deepStrictEqual(N.map(x => x.e), ["eule", "fipsi", "robo", "baer", "biber"]);
  const robo = N.find(x => x.e === "robo");
  assert.deepStrictEqual(r4([robo.x, robo.z]), [1.7, 17.5]);
  assert.ok(N.every(x => x.text.includes("Mira") && x.ziel && x.titel), "jeder Nachbar hat Name im Text, Titel und Ziel");
  assert.deepStrictEqual(Object.keys(K.FACH), ["eule", "fipsi", "robo", "biber"]);
  assert.ok(K.freude("deutsch", { t: "Neues Wort: Apfel" }, "Mira")[0].includes("Apfel"));
});

pruefe("Orte für die Zeigehand: Bodenpunkt und Höhe", () => {
  const { K } = neueUmgebung();
  const O = K.erstelle(q("")).ORTE;
  ["haus", "sonnenuhr", "wissensbaum", "eule", "steg", "paket"].forEach(k => assert.ok(O[k] && typeof O[k].x === "number" && typeof O[k].z === "number" && O[k].h > 0, k));
  assert.deepStrictEqual(O.haus, { x: -6.2, z: -5.6, h: 1.2 });
});

// ---------- Story-Reihenfolge ----------
const LERNEN = { frei: false, spielen: false, genug: false, fortschritt: 0.3, fehltMin: 14, fehltAufgaben: 7 };
const SPIELEN = { frei: false, spielen: true, genug: false, fortschritt: 1 };
pruefe("ohne Ankunft (E1) keine Story-Szene; im Zimmer, im Prolog oder während einer Szene auch nicht", () => {
  const { K } = neueUmgebung({ zeit: LERNEN });
  assert.strictEqual(K.naechsteStory({}), null);
  const u = neueUmgebung({ zeit: LERNEN, story: { etappen: { E1: "2026-10-26" } } });
  assert.strictEqual(u.K.naechsteStory({ drinnen: true }), null);
  assert.strictEqual(u.K.naechsteStory({ prolog: true }), null);
  assert.strictEqual(u.K.naechsteStory({ laeuft: true }), null);
  assert.strictEqual(u.K.naechsteStory({ test: true }), null);
});

pruefe("E2: ohne Spielzeit „Erst lernen“, mit Spielzeit gleich „Die Sonne geht auf“", () => {
  assert.strictEqual(neueUmgebung({ zeit: LERNEN, story: { etappen: { E1: "x" } } }).K.naechsteStory({}), "erst-lernen");
  assert.strictEqual(neueUmgebung({ zeit: SPIELEN, story: { etappen: { E1: "x" } } }).K.naechsteStory({}), "sonne");
});

pruefe("ohne Zeit-Regeln wird E2 still erledigt", () => {
  const u = neueUmgebung({ zeit: { frei: true, spielen: true }, story: { etappen: { E1: "x" } } });
  assert.strictEqual(u.K.naechsteStory({}), null);
  assert.ok(u.st.etappen.E2);
});

pruefe("nach E2: Sonne geht auf (einmal), dann erste Frucht ab dem ersten Lernfund", () => {
  const u = neueUmgebung({ zeit: SPIELEN, story: { etappen: { E1: "x", E2: "x" } } });
  assert.strictEqual(u.K.naechsteStory({}), "sonne");
  u.st.gesehen.push("sonne");
  assert.strictEqual(u.K.naechsteStory({}), null, "ohne Lernfund noch keine Frucht");
  const v = neueUmgebung({ zeit: SPIELEN, funde: 1, story: { etappen: { E1: "x", E2: "x" }, gesehen: ["sonne"] } });
  assert.strictEqual(v.K.naechsteStory({}), "erste-frucht");
  v.K.storyFertig({ etappe: "E3", kapitel: 1 });
  assert.ok(v.st.etappen.E3); assert.strictEqual(v.st.kapitel, 1);
  assert.strictEqual(v.K.naechsteStory({}), "ei", "nach E3 (erste neue Etappe heute) darf eine zweite kommen: das Ei");
});

pruefe("höchstens zwei neue Etappen am Tag", () => {
  const u = neueUmgebung({ zeit: SPIELEN, funde: 3, story: { etappen: { E1: "x" }, gesehen: ["sonne"] } });
  u.K.storyFertig({ etappe: "E2" }); u.K.storyFertig({ etappe: "E9" });
  assert.strictEqual(u.K.naechsteStory({}), null, "dritte Etappe wartet bis morgen");
});

pruefe("liegt ein Weihnachtspaket, kommt zuerst seine Szene", () => {
  const u = neueUmgebung({ zeit: LERNEN, story: { etappen: { E1: "2026-12-10" } } });
  assert.strictEqual(u.K.naechsteStory({ paket: true }), "weihnachtspaket");
  u.st.gesehen.push("weihnachtspaket");
  assert.strictEqual(u.K.naechsteStory({ paket: true }), "erst-lernen");
});

pruefe("Ankunft ist fällig für neue Kinder, nicht beim Start im Zimmer oder mit Probeszene", () => {
  const { K } = neueUmgebung();
  assert.strictEqual(K.prologFaellig(q("")), true);
  assert.strictEqual(K.prologFaellig(q("?drinnen=1")), false);
  assert.strictEqual(K.prologFaellig(q("?szene=probe")), false);
  assert.strictEqual(neueUmgebung({ story: { etappen: { E1: "x" } } }).K.prologFaellig(q("")), false);
});

// ---------- Weihnachtspaket ----------
pruefe("Paket-Regeln: Erststart 1.–26.12., nicht bei übernommener Ankunft, nur einmal", () => {
  assert.strictEqual(neueUmgebung({ story: { etappen: { E1: "2026-12-10" } } }).K.weihnachtsPaket(), "weihnachten-2026");
  assert.strictEqual(neueUmgebung({ story: { etappen: { E1: "2026-12-27" } } }).K.weihnachtsPaket(), null);
  assert.strictEqual(neueUmgebung({ story: { etappen: { E1: "2026-11-30" } } }).K.weihnachtsPaket(), null);
  assert.strictEqual(neueUmgebung({ story: { etappen: { E1: 1 } } }).K.weihnachtsPaket(), null);
  assert.strictEqual(neueUmgebung({ story: { etappen: { E1: "2026-12-10" }, geschenke: ["weihnachten-2026"] } }).K.weihnachtsPaket(), null);
  assert.strictEqual(neueUmgebung({ jetzt: new Date(2026, 11, 3, 15).getTime() }).K.weihnachtsPaket(), "weihnachten-2026", "neues Kind im Dezember");
  assert.strictEqual(neueUmgebung({ jetzt: new Date(2026, 9, 25, 15).getTime() }).K.weihnachtsPaket(), null, "neues Kind im Oktober");
});

pruefe("Paket öffnen: Geschenk gemerkt, Tannenbaum frei und im Zimmer, Schleife fürs Tier, nur einmal", () => {
  const u = neueUmgebung({ story: { etappen: { E1: "2026-12-10" } }, speicher: { zimmer: { plaetze: { vornlinks: "lampe" }, wand: "mint" } } });
  const r = u.K.oeffnePaket();
  assert.strictEqual(r.id, "weihnachten-2026"); assert.strictEqual(r.zimmer, true); assert.strictEqual(r.blase[0], "robo");
  assert.ok(u.st.geschenke.includes("weihnachten-2026"));
  assert.ok(u.frei.has("moebel-tannenbaum"));
  assert.deepStrictEqual(u.daten.zimmer, { plaetze: { vornlinks: "lampe", links: "tannenbaum" }, wand: "mint" });
  assert.deepStrictEqual(u.geschenkeTier, ["schleife"]);
  assert.strictEqual(u.K.oeffnePaket(), null);
});

// ---------- Nebel, Sonnenuhr, Zimmer ----------
pruefe("Nebelstufe aus Kapitel und Lernfunden (Funde zählen erst nach E3)", () => {
  assert.strictEqual(neueUmgebung({ funde: 20 }).K.nebelStufe(), 0);
  assert.strictEqual(neueUmgebung({ funde: 5, story: { etappen: { E3: "x" } } }).K.nebelStufe(), 2);
  assert.strictEqual(neueUmgebung({ funde: 15, story: { etappen: { E3: "x" } } }).K.nebelStufe(), 3);
  assert.strictEqual(neueUmgebung({ story: { kapitel: 1 } }).K.nebelStufe(), 1);
  assert.strictEqual(neueUmgebung().K.erstelle(q("")).NEBEL.length, 4);
});

pruefe("Sonnenuhr: hell nach Lernfortschritt, ganz hell in der Spielzeit", () => {
  assert.deepStrictEqual(neueUmgebung().K.sonnenuhr(), { hell: 1, spielen: true, genug: false });
  assert.deepStrictEqual(neueUmgebung({ zeit: { spielen: false, genug: false, fortschritt: 0.456 } }).K.sonnenuhr(), { hell: 0.46, spielen: false, genug: false });
  assert.deepStrictEqual(neueUmgebung({ zeit: { spielen: false, genug: true, fortschritt: 1 } }).K.sonnenuhr(), { hell: 0, spielen: false, genug: true });
  assert.ok(neueUmgebung({ zeit: { spielen: false, genug: false, fortschritt: 0.5 } }).K.sonnenuhrText()[2].includes("50 Prozent"));
  assert.ok(neueUmgebung({ zeit: LERNEN }).K.schlaeftText()[2].includes("14 Minuten"));
});

pruefe("Zimmer: 6 Plätze, 11 Möbel (Tannenbaum nur als Geschenk), 5 Wandfarben", () => {
  const { K } = neueUmgebung();
  assert.strictEqual(K.PLAETZE.length, 6);
  assert.strictEqual(K.MOEBEL.length, 11);
  assert.deepStrictEqual(K.MOEBEL.filter(m => m.geschenk).map(m => m.id), ["tannenbaum"]);
  assert.strictEqual(K.WANDFARBEN.length, 5);
  assert.deepStrictEqual(K.zimmerDaten(), { plaetze: {}, wand: "rosa" });
  assert.strictEqual(K.besitzt("moebel-lampe", 0), true);
  assert.strictEqual(K.besitzt("moebel-lampe", 4), false);
});

pruefe("Wetter: Art aus dem Wettercode, Satz, Start mit Test-Parameter", () => {
  const { K } = neueUmgebung();
  assert.deepStrictEqual([0, 2, 3, 45, 61, 71, 95].map(K.WETTER_ART), ["klar", "heiter", "wolken", "nebel", "regen", "schnee", "gewitter"]);
  assert.strictEqual(K.wetterSatz({ art: "regen", ort: "Testhausen", temp: 9.6 }), "🌧️ In Testhausen: 10 °C, Regen");
  const st = K.startWetter(q("?wetter=schnee"));
  assert.deepStrictEqual([st.sofort.art, st.sofort.temp, st.holen], ["schnee", -2, false]);
});

// ---------- Stationen ----------
pruefe("Spielort: ohne Spielzeit schläft er, ohne Führerschein gesperrt, sonst geht es zum Minispiel", () => {
  assert.strictEqual(neueUmgebung({ zeit: LERNEN }).K.antwort("ballons").blase[1], "Schläft noch");
  assert.deepStrictEqual(neueUmgebung({ zeit: SPIELEN }).K.antwort("ballons").blase.slice(1, 2).concat(neueUmgebung({ zeit: SPIELEN }).K.antwort("ballons").blase[4]), ["Noch gesperrt", "../medien/"]);
  const u = neueUmgebung({ zeit: SPIELEN, speicher: { medien: { fuehrerschein: true } } });
  assert.strictEqual(u.K.antwort("ballons").blase[4], "../welt3d/ballons.html");
  assert.strictEqual(u.K.antwort("truhe").blase[4], "../welt3d/insel.html");
  assert.strictEqual(u.K.antwort("schach").blase[4], "../schach/", "Tilda geht auch ohne Spielzeit");
});

pruefe("Minispiele ausgeblendet (30.10.2026): vier Orte zeigen „bald“ ohne Ziel, Aktionsknopf „Ansehen“; der Schatz-Strand ist seit 04.11. Fipsis Angelsteg", () => {
  const u = neueUmgebung({ zeit: SPIELEN, funde: 20, speicher: { medien: { fuehrerschein: true } }, minispieleAus: true });
  { const b = u.K.antwort("truhe").blase; assert.ok(b[0] === "fipsi" && /Angelsteg/.test(b[1]), "Strand: Angelsteg"); assert.deepStrictEqual(u.K.aktionFuer("truhe")[0], ["🎣", "Angeln"]); }
  ["lauf", "kart", "bau"].forEach(id => { const b = u.K.antwort(id).blase;
    assert.ok(b[0] === "🚧" && /entsteht etwas Neues/.test(b[2]) && !b[4], id); assert.deepStrictEqual(u.K.aktionFuer(id)[0], ["🚧", "Ansehen"], id); });
  assert.strictEqual(u.K.antwort("schach").blase[4], "../schach/", "Schach bleibt");
});

pruefe("Wetter-Drache (06.11.2026): Wetterstation zeigt bis Kapitel 5 das Wetter, danach Ellas Drachen; Kapitel 5 „Der Sturm“ braucht 25 Lernfunde und ein Wetter-Thema", () => {
  const vor = neueUmgebung({ funde: 30, story: { kapitel: 4 } });
  assert.strictEqual(vor.K.antwort("station", {}).blase[0], "🌦️", "vor Kapitel 5: Wetterstation");
  assert.deepStrictEqual(vor.K.aktionFuer("station")[0], ["🌦️", "Ansehen"]);
  const nach = neueUmgebung({ funde: 30, story: { kapitel: 5 } });
  { const b = nach.K.antwort("station", { wetter: { temp: 12.4, wind: 18, ort: "Dresden", art: "wolken" } }).blase; assert.ok(b[0] === "eule" && b[4] === "../wetter/" && /12 Grad/.test(b[2]), "ab Kapitel 5: Drachen mit echtem Wetter"); }
  assert.deepStrictEqual(nach.K.aktionFuer("station")[0], ["🪁", "Drachen"]);
  const k5 = (u) => u.K.KAPITEL.find(k => k.n === 5);
  assert.ok(k5(nach) && k5(nach).szene === "der-sturm");
  assert.strictEqual(k5(neueUmgebung({ funde: 30 })).faellig(), false, "ohne Wetter-Thema nicht fällig");
  assert.strictEqual(k5(neueUmgebung({ funde: 30, speicher: { sachkunde: { themen: { wetter: 2 } } } })).faellig(), true, "mit „Wetter beobachten“ fällig");
  assert.strictEqual(k5(neueUmgebung({ funde: 24, speicher: { sachkunde: { themen: { wetterkarte: 1 } } } })).faellig(), false, "unter 25 Lernfunden nicht fällig");
});

pruefe("Leuchtturm (07.11.2026): Platz am Ufer frei, dunkel bis Kapitel 6, danach Tildas Licht-Rätsel; Kapitel 6 braucht 35 Lernfunde und drei Schach-Rätsel oder -Lektionen", () => {
  const vor = neueUmgebung({ funde: 40, story: { kapitel: 5 } });
  const W = vor.K.erstelle(new URLSearchParams("")), [x, z] = W.P.leuchtturm;
  assert.ok(Math.hypot(x, z) > W.RMAX_LAUF - 2 && Math.hypot(x, z) < W.RMAX_LAUF, "am Ufer");
  Object.entries(W.P).filter(([k]) => k !== "leuchtturm").forEach(([k, v]) => assert.ok(Math.hypot(v[0] - x, v[1] - z) > 2.7, "Abstand zu " + k));
  assert.ok(W.ORTE.leuchtturm && W.ORTE.schach, "Orte für die Zeigehand");
  // Review 07.11.2026: in jeder Welt (6 Biome × 3 Größen × mit/ohne See × 6 Seeds) steht der Leuchtturm am Ufer, nie in einem Baum, nicht am Steg,
  // nicht im See und mindestens 2,5 Einheiten von jedem anderen Ort (Rückfall: Platz mit dem kleinsten Mangel, Bäume im Weg werden gefällt)
  let welten = 0, notloesung = 0;
  const WELTEN = [];
  for (const biom of ["wiese", "wald", "berge", "strand", "schnee", "wueste"]) for (const groesse of ["klein", "mittel", "gross"]) for (const see of [0, 1]) for (let seed = 1; seed <= 6; seed++) WELTEN.push([biom, groesse, see, seed]);
  // bekannte Welten ohne freien Winkel (kleiner Wald): hier greift der Rückfall – vorher stand der Turm dort in Bäumen
  WELTEN.push(["wald", "klein", 0, 4], ["wald", "klein", 1, 3], ["wald", "klein", 1, 15], ["wald", "klein", 1, 25]);
  for (const [biom, groesse, see, seed] of WELTEN) {
    const u = neueUmgebung({ funde: 40, story: { kapitel: 5 } }), q = new URLSearchParams(`biom=${biom}&groesse=${groesse}&huegel=${["wenig", "mittel", "viel"][seed % 3]}&see=${see}&seed=${seed}`);
    const E = u.K.erstelle(q), [x, z] = E.P.leuchtturm, wo = `${biom}/${groesse}/see=${see}/seed=${seed}`;
    welten++;
    if (E.WELT.baeume.length < u.K.erzeuge(u.K.wunsch(q)).baeume.length) notloesung++;   // Bäume gefällt = Rückfall
    assert.ok([x, z].every(Number.isFinite) && Math.hypot(x, z) > E.RMAX_LAUF - 2.6 && Math.hypot(x, z) < E.RMAX_LAUF, "am Ufer: " + wo);
    E.WELT.baeume.forEach(b => assert.ok(Math.hypot(b.x - x, b.z - z) > 3.2, `Baum im Leuchtturm: ${wo}`));
    Object.entries(E.P).filter(([k]) => k !== "leuchtturm").forEach(([k, v]) => assert.ok(Math.hypot(v[0] - x, v[1] - z) > 2.5, `zu nah an ${k}: ${wo}`));
    assert.ok(Math.hypot(x - E.STEG.x, z - E.STEG.z0) > 4, "zu nah am Steg: " + wo);
    if (E.WELT.see) assert.ok(Math.hypot(x - E.WELT.see.x, z - E.WELT.see.z) > E.WELT.see.r + 1.5, "im See: " + wo);
    // Kapitel 7 (09.11.2026): das Forscherlager steht in jeder Welt frei – nicht im Baum, nicht auf einem Ort, nicht am Steg, nicht im See
    const [lx, lz] = E.P.lager;
    assert.ok([lx, lz].every(Number.isFinite) && Math.hypot(lx, lz) > E.RMAX_LAUF - 4 && Math.hypot(lx, lz) < E.RMAX_LAUF - 1.5, "Lager am Rand: " + wo);
    E.WELT.baeume.forEach(b => assert.ok(Math.hypot(b.x - lx, b.z - lz) > 2.6, `Baum im Lager: ${wo}`));
    Object.entries(E.P).filter(([k]) => k !== "lager").forEach(([k, v]) => assert.ok(Math.hypot(v[0] - lx, v[1] - lz) > 2.5, `Lager zu nah an ${k}: ${wo}`));
    assert.ok(Math.hypot(lx - E.STEG.x, lz - E.STEG.z0) > 4, "Lager zu nah am Steg: " + wo);
    if (E.WELT.see) assert.ok(Math.hypot(lx - E.WELT.see.x, lz - E.WELT.see.z) > E.WELT.see.r + 1.5, "Lager im See: " + wo);
    assert.ok(E.ORTE.lager && E.ORTE.boot, "Orte Lager und Boot: " + wo);
  }
  assert.ok(notloesung >= 4 && notloesung < welten / 10, `Rückfall in ${notloesung} von ${welten} Welten (erwartet: die vier bekannten, sonst selten)`);
  console.log(`    ${welten} Welten geprüft, Rückfall mit gefällten Bäumen in ${notloesung}`);
  // Schatzkammer „Kapitel x von y“: y steht in shared/ereignisse.js (Seiten ohne Insel-Kern) und muss dem letzten Kapitel hier entsprechen
  const zahl = +(/const KAPITEL_ZAHL = (\d+)/.exec(fs.readFileSync(path.join(__dirname, "../shared/ereignisse.js"), "utf8")) || [])[1];
  assert.strictEqual(zahl, Math.max(...vor.K.KAPITEL.map(k => k.n)), "Story.KAPITEL_ZAHL in shared/ereignisse.js = letztes Kapitel in KAPITEL");
  { const b = vor.K.antwort("leuchtturm").blase; assert.ok(b[0] === "tilda" && /dunkel/.test(b[2]) && !b[4], "vor Kapitel 6 dunkel, ohne Ziel"); }
  assert.deepStrictEqual(vor.K.aktionFuer("leuchtturm")[0], ["👀", "Ansehen"]);
  const nach = neueUmgebung({ funde: 40, story: { kapitel: 6 } });
  { const b = nach.K.antwort("leuchtturm").blase; assert.ok(b[0] === "tilda" && b[4] === "../leuchtturm/", "ab Kapitel 6 offen"); }
  assert.deepStrictEqual(nach.K.aktionFuer("leuchtturm")[0], ["💡", "Leuchtturm"]);
  const k6 = (u) => u.K.KAPITEL.find(k => k.n === 6);
  assert.ok(k6(nach) && k6(nach).szene === "der-leuchtturm");
  assert.strictEqual(k6(neueUmgebung({ funde: 40 })).faellig(), false, "ohne Schach nicht fällig");
  assert.strictEqual(k6(neueUmgebung({ funde: 40, speicher: { schach: { raetsel: { 0: 1, 1: 1 } } } })).faellig(), false, "zwei Rätsel reichen nicht");
  assert.strictEqual(k6(neueUmgebung({ funde: 40, speicher: { schach: { raetsel: { 0: 1, 1: 1, 4: 1 } } } })).faellig(), true, "drei Rätsel");
  assert.strictEqual(k6(neueUmgebung({ funde: 40, speicher: { schach: { lektionen: { turm: 1, laeufer: 1, springer: 1 } } } })).faellig(), true, "drei Lektionen");
  assert.strictEqual(k6(neueUmgebung({ funde: 34, speicher: { schach: { raetsel: { 0: 1, 1: 1, 2: 1 } } } })).faellig(), false, "unter 35 Lernfunden nicht fällig");
});

pruefe("Kapitel 7 „Neue Ufer“ (09.11.2026): 50 Lernfunde und Tablet-Führerschein; Boot am Steg und Forscherlager – daheim ab Kapitel 1, auf Eilanden ab Kapitel 7", () => {
  const k7 = (u) => u.K.KAPITEL.find(k => k.n === 7);
  assert.ok(k7(neueUmgebung()).szene === "neue-ufer");
  assert.strictEqual(k7(neueUmgebung({ funde: 50 })).faellig(), false, "ohne Führerschein nicht fällig");
  assert.strictEqual(k7(neueUmgebung({ funde: 49, speicher: { medien: { fuehrerschein: true } } })).faellig(), false, "unter 50 Lernfunden nicht fällig");
  assert.strictEqual(k7(neueUmgebung({ funde: 50, speicher: { medien: { fuehrerschein: true } } })).faellig(), true, "50 Lernfunde + Führerschein");
  // Reihenfolge: Kapitel 7 erst nach Kapitel 6
  const u6 = neueUmgebung({ funde: 60, speicher: { medien: { fuehrerschein: true } }, story: { kapitel: 5, etappen: { E1: "2026-10-01", E2: 1, E3: 1, E4: 1, E5: 1, E6: 1, E7: 1, E8: 1, E9: 1 } }, zeit: { frei: true, spielen: true, genug: false, fortschritt: 1 } });
  assert.notStrictEqual(u6.K.naechsteStory({}), "neue-ufer", "mit Kapitel 5 kommt erst Kapitel 6");
  const u7 = neueUmgebung({ funde: 60, speicher: { medien: { fuehrerschein: true }, schach: { raetsel: { 0: 1, 1: 1, 2: 1 } } }, story: { kapitel: 6, etappen: { E1: "2026-10-01", E2: 1, E3: 1, E4: 1, E5: 1, E6: 1, E7: 1, E8: 1, E9: 1 } }, zeit: { frei: true, spielen: true, genug: false, fortschritt: 1 } });
  assert.strictEqual(u7.K.naechsteStory({}), "neue-ufer", "mit Kapitel 6, 60 Funden und Führerschein ist „Neue Ufer“ dran");
  // Boot: vor Kapitel 7 nur ansehen, ab Kapitel 7 reisen; auf einem Eiland immer (Rückfahrt)
  const vor = neueUmgebung({ story: { kapitel: 6 } }), nach = neueUmgebung({ story: { kapitel: 7 } });
  { const a = vor.K.antwort("boot", { insel: true }); assert.ok(a.blase[0] === "robo" && /Bald fahren wir/.test(a.blase[2]) && !a.blase[4] && !a.extra, "vor Kapitel 7: Robo vertröstet, kein Reisen"); }
  assert.deepStrictEqual(vor.K.aktionFuer("boot", true), [["👀", "Ansehen"], 3.2]);
  { const a = nach.K.antwort("boot", { insel: true }); assert.ok(a.blase[0] === "robo" && /bereit/.test(a.blase[2]) && a.extra === "reisen", "ab Kapitel 7: Boot bereit, Knopf zum Reisen"); }
  assert.deepStrictEqual(nach.K.aktionFuer("boot", true), [["⛵", "Boot"], 3.2]);
  { const a = vor.K.antwort("boot", { insel: false }); assert.ok(/Heimatinsel/.test(a.blase[2]) && a.extra === "reisen", "auf einem Eiland: Rückfahrt auch vor Kapitel 7"); }
  // Forscherlager
  { const a = neueUmgebung({ story: { kapitel: 0 } }).K.antwort("lager", { insel: true }); assert.ok(a.blase[0] === "eule" && /noch zu/.test(a.blase[1]) && !a.blase[4], "daheim vor Kapitel 1 zu"); }
  { const a = neueUmgebung({ story: { kapitel: 1 } }).K.antwort("lager", { insel: true }); assert.ok(a.blase[0] === "eule" && a.blase[4] === "../expedition/" && /Karte/.test(a.blase[2]), "daheim ab Kapitel 1: Karte der Insel lesen"); }
  { const a = vor.K.antwort("lager", { insel: false }); assert.ok(/Kapitel 7/.test(a.blase[2]) && !a.blase[4], "auf einem Eiland vor Kapitel 7 zu"); }
  { const a = nach.K.antwort("lager", { insel: false }); assert.ok(a.blase[4] === "../expedition/" && /Tagebuch/.test(a.blase[2]), "auf einem Eiland ab Kapitel 7: Tagebuch und Karte"); }
  assert.deepStrictEqual(nach.K.aktionFuer("lager", false), [["🧭", "Forschen"], 2.6]);
  assert.deepStrictEqual(vor.K.aktionFuer("lager", false), [["👀", "Ansehen"], 2.6]);
  assert.strictEqual(vor.K.ortOffen("lager", true), true); assert.strictEqual(vor.K.ortOffen("lager", false), false); assert.strictEqual(nach.K.ortOffen("boot", true), true);
});

pruefe("Rhythmus-Boot (05.11.2026): Ballon-Wiese = Paulas Boot, zu bis Kapitel 4; Kapitel 4 „Paulas Fest“ braucht 15 Lernfunde und etwas bei Paula", () => {
  const zu = neueUmgebung({ zeit: SPIELEN, funde: 20, minispieleAus: true, story: { kapitel: 3 } });
  { const b = zu.K.antwort("ballons").blase; assert.ok(b[0] === "papagei" && /noch zu/.test(b[1]) && !b[4], "vor Kapitel 4 zu"); assert.deepStrictEqual(zu.K.aktionFuer("ballons")[0], ["🛶", "Boot"]); }
  const auf = neueUmgebung({ zeit: SPIELEN, funde: 20, minispieleAus: true, story: { kapitel: 4 } });
  { const b = auf.K.antwort("ballons").blase; assert.ok(b[0] === "papagei" && b[4] === "../rhythmus/", "ab Kapitel 4 offen"); }
  const k4 = (u) => u.K.KAPITEL.find(k => k.n === 4);
  assert.ok(k4(auf) && k4(auf).szene === "paulas-fest");
  assert.strictEqual(k4(neueUmgebung({ funde: 20 })).faellig(), false, "ohne Paula nicht fällig");
  assert.strictEqual(k4(neueUmgebung({ funde: 20, story: { etappen: { E9: "2026-10-30" } } })).faellig(), true, "mit Atelier (E9) fällig");
  assert.strictEqual(k4(neueUmgebung({ funde: 20, speicher: { englisch: { lektionen: { "en-farben": 2 } } } })).faellig(), true, "mit einer Englisch-Lektion fällig");
  assert.strictEqual(k4(neueUmgebung({ funde: 20, speicher: { sachkunde: { themen: { "mu-rhythmus": 1 } } } })).faellig(), true, "mit einem Musik-Thema fällig");
  assert.strictEqual(k4(neueUmgebung({ funde: 14, story: { etappen: { E9: 1 } } })).faellig(), false, "unter 15 Lernfunden nicht fällig");
});

pruefe("neue Minispiel-Orte öffnen sich mit dem Wissensbaum", () => {
  const zu = neueUmgebung({ zeit: SPIELEN, funde: 2, speicher: { medien: { fuehrerschein: true } } });
  assert.ok(zu.K.antwort("kart").blase[1].includes("noch zu"));
  assert.ok(zu.K.antwort("kart").blase[2].includes("Noch 3 Lernfunde"));
  assert.deepStrictEqual(zu.K.aktionFuer("kart")[0], ["🔒", "Ansehen"]);
  assert.strictEqual(zu.K.antwort("lauf").blase[4], "../welt3d/lauf.html");
  assert.deepStrictEqual(zu.K.aktionFuer("lauf")[0], ["🏃", "Spielen"]);
});

pruefe("Nachbarn: Freude über den Lernfund von heute, sonst Begrüßung; Robo bietet die Ankunft nochmal an", () => {
  const u = neueUmgebung({ story: { etappen: { E1: "x" } }, heuteFach: { mathe: { t: "Neu geschafft: Plus bis 20" } } });
  const N = u.K.erstelle(q("")).nachbarn();
  const benno = u.K.nachbarAntwort(N.find(x => x.e === "biber"));
  assert.strictEqual(benno.blase[1], "Biber Benno freut sich"); assert.ok(benno.blase[2].includes("Plus bis 20"));
  const robo = u.K.nachbarAntwort(N.find(x => x.e === "robo"));
  assert.strictEqual(robo.extra, "prolog"); assert.strictEqual(robo.blase[4], "../medien/");
});

pruefe("Paula, Wetterstation, Wissensbaum, Sonnenuhr antworten", () => {
  const u = neueUmgebung({ funde: 3, speicher: { atelier: { musik: { melodien: [[0, 2, 4, -1]] } } } });
  assert.deepStrictEqual(u.K.antwort("buehne").melodie, [0, 2, 4, -1]);
  assert.strictEqual(neueUmgebung().K.antwort("buehne").melodie, undefined);
  assert.strictEqual(u.K.antwort("station", {}).blase[1], "Die Wetterstation");
  assert.ok(u.K.antwort("wissensbaum").blase[2].startsWith("Schon 3 Dinge gelernt!"));
  assert.strictEqual(u.K.antwort("sonnenuhr").blase[1], "Die Sonnenuhr");
  assert.strictEqual(u.K.fruchtFarbe({ f: "mathe" }), "#2FA37C");
});

pruefe("E4–E8 (NA-14): Auslöser, Reihenfolge, höchstens zwei am Tag, schon Genutztes wird still erledigt", () => {
  const SP = { spielen: true, frei: false };
  const basis = { etappen: { E1: "2026-10-20", E2: "2026-10-20", E3: "2026-10-21" }, gesehen: ["sonne"] };
  // Sterne (mind. 4) und Spielzeit → Benno erklärt die Sterne
  let u = neueUmgebung({ zeit: SP, sterne: 5, story: JSON.parse(JSON.stringify(basis)) });
  assert.strictEqual(u.K.naechsteStory({}), "sterne");
  u.K.storyFertig({ etappe: "E4" });
  assert.strictEqual(u.K.naechsteStory({}), "ei", "danach das Ei");
  u.K.storyFertig({ etappe: "E5" });
  assert.strictEqual(u.K.naechsteStory({}), null, "dritte Etappe wartet bis morgen");
  // ohne Sterne: gleich das Ei; wer schon ein Tier hat, bekommt E5 still
  u = neueUmgebung({ zeit: SP, tier: { phase: "tier" }, story: JSON.parse(JSON.stringify(basis)) });
  const id = u.K.naechsteStory({});
  assert.strictEqual(u.st.etappen.E5, 1, "E5 still erledigt (Tier schon da)");
  assert.notStrictEqual(id, "ei");
  // Spielorte nur mit Führerschein und Spielzeit; Merkkiste bei fälliger Karte; Bruni ab Tag 2
  u = neueUmgebung({ zeit: SP, tier: { phase: "ei" }, karten: 2, jetzt: new Date(2026, 9, 22, 15).getTime(), story: JSON.parse(JSON.stringify(basis)) });
  assert.strictEqual(u.K.naechsteStory({}), "merkkiste", "ohne Führerschein: E6 übersprungen, E7 fällig");
  u.daten.medien = { fuehrerschein: "2026-10-01" };
  assert.strictEqual(u.K.naechsteStory({}), "spielorte");
  u.K.storyFertig({ etappe: "E6" }); u.K.storyFertig({ etappe: "E7" });
  const w = neueUmgebung({ zeit: SP, tier: { phase: "ei" }, jetzt: new Date(2026, 9, 22, 15).getTime(), story: { gesehen: ["sonne"], etappen: Object.assign({}, basis.etappen, { E4: 1, E6: 1, E7: 1 }) } });
  assert.strictEqual(w.K.naechsteStory({}), "gefuehle", "Bruni ab dem zweiten Tag nach der Ankunft");
  const x = neueUmgebung({ zeit: SP, tier: { phase: "ei" }, jetzt: new Date(2026, 9, 20, 15).getTime(), story: { gesehen: ["sonne"], etappen: Object.assign({}, basis.etappen, { E4: 1, E6: 1, E7: 1 }) } });
  assert.strictEqual(x.K.naechsteStory({}), null, "am Ankunftstag noch nicht");
  // Merkkiste bei Ella, wenn nur Sachunterricht fällig ist
  assert.strictEqual(u.K.merkkisteBei(), "fipsi");
});

console.log(`✅ Insel-Kern: ${n} Prüfungen bestanden.`);
