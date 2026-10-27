// Node-Test (NA-24): Insel-Kern ohne Browser – Welt, Orte, Nachbarn, Story-Reihenfolge, Weihnachtspaket, Nebel, Sonnenuhr, Zimmer.
// Aufruf: node tests/inselkern.js
// Spielwelt, Story, Szene, Zeit, Lernfunde und TierPflege werden hier durch kleine Attrappen ersetzt.
const assert = require("assert");
const fs = require("fs");
const path = require("path");

let n = 0;
const pruefe = (name, fn) => { fn(); n++; console.log("  ✓ " + name); };

// ---------- Attrappen ----------
function neueUmgebung({ story = {}, zeit = null, funde = 0, speicher = {}, jetzt, heuteFach = {} } = {}) {
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
      paar: (x) => [x[0], ""], ht: () => "", kind: () => ({ ort: null })
    },
    Story: {
      etappe: (e) => !!st.etappen[e], etappeFertig: (e) => { if (!st.etappen[e]) { st.etappen[e] = "2026-10-27"; neueHeute++; } },
      kapitel: () => st.kapitel, setzeKapitel: (k) => { st.kapitel = Math.max(st.kapitel, k); },
      gesehen: (id) => st.gesehen.includes(id), darfNeueEtappe: () => neueHeute < 2,
      zustand: () => st, hatGeschenk: (id) => st.geschenke.includes(id), merkeGeschenk: (id) => { if (!st.geschenke.includes(id)) st.geschenke.push(id); }
    },
    Szene: { laeuft: false },
    Lernfunde: { gesamt: () => funde, STUFEN: [1, 5, 15, 30], baum: () => ({ stufe: funde >= 15 ? 3 : funde >= 5 ? 2 : funde >= 1 ? 1 : 0, summe: funde, naechste: funde < 1 ? 1 : funde < 5 ? 5 : funde < 15 ? 15 : 30 }),
      heute: () => [], heuteFach: (f) => (heuteFach[f] || null) },
    TierPflege: { schenke: (x) => geschenkeTier.push(x) }
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
  assert.deepStrictEqual(I.P.haus, [-5, -4.5, 0.35]);
  assert.strictEqual(I.bodenY(3, 4), 0.25);
  assert.deepStrictEqual(r4(I.STEG), { x: 3.2, z0: 13, z1: 17.6 });
  assert.deepStrictEqual(r4(I.SU), { x: 5.3, z: 13.5 });
  assert.deepStrictEqual(r4(I.PAKET_POS), { x: 4.15, z: 13.15 });
  assert.strictEqual(I.HAUS_DREH, 0.35);
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
  assert.deepStrictEqual(r4([robo.x, robo.z]), [1.7, 13.7]);
  assert.ok(N.every(x => x.text.includes("Mira") && x.ziel && x.titel), "jeder Nachbar hat Name im Text, Titel und Ziel");
  assert.deepStrictEqual(Object.keys(K.FACH), ["eule", "fipsi", "robo", "biber"]);
  assert.ok(K.freude("deutsch", { t: "Neues Wort: Apfel" }, "Mira")[0].includes("Apfel"));
});

pruefe("Orte für die Zeigehand: Bodenpunkt und Höhe", () => {
  const { K } = neueUmgebung();
  const O = K.erstelle(q("")).ORTE;
  ["haus", "sonnenuhr", "wissensbaum", "eule", "steg", "paket"].forEach(k => assert.ok(O[k] && typeof O[k].x === "number" && typeof O[k].z === "number" && O[k].h > 0, k));
  assert.deepStrictEqual(O.haus, { x: -5, z: -4.5, h: 1.2 });
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
  assert.strictEqual(v.K.naechsteStory({}), null);
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

console.log(`✅ Insel-Kern: ${n} Prüfungen bestanden.`);
