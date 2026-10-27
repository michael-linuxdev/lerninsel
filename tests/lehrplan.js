// Node-Test (NA-03): Lehrplan-Kern, Länderprofil Sachsen, Inhalte-Verzeichnis, errechnete Abdeckung.
// Aufruf: node tests/lehrplan.js   (LUECKEN=1 listet alle Kern-Lernziele ohne Inhalt)
// Lädt dieselben Dateien wie der Elternbereich in einer kleinen window-Attrappe.
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

let n = 0;
const pruefe = (name, fn) => { fn(); n++; console.log("  ✓ " + name); };
const WURZEL = path.join(__dirname, "..");

function lade(dateien) {
  const ctx = vm.createContext({ console });
  ctx.window = ctx;   // wie im Browser: window ist das globale Objekt
  dateien.forEach(d => vm.runInContext(fs.readFileSync(path.join(WURZEL, d), "utf8"), ctx, { filename: d }));
  return ctx;
}
const DATEN = ["spiele/mathe/aufgaben.js", "spiele/deutsch/geschichte.js", "spiele/medien/lektionen.js", "spiele/sachkunde/themen.js", "spiele/deutsch/werkstatt.js", "spiele/englisch/lektionen.js"];
const LEHRPLAN = ["shared/lehrplan/kern.js", "shared/inhalte.js", "inhalte/deutsch/anlaute.js", "inhalte/deutsch/lesetexte.js", "inhalte/deutsch/schreiben.js", "shared/lehrplan/laender/sachsen.js", "shared/lehrplan/laender/sachsen-punkte.js", "shared/lehrplan.js"];
const w = lade(DATEN.concat(LEHRPLAN));
const K = w.LernzielKern, I = w.Inhalte, L = w.LEHRPLAN;

pruefe("Kern: IDs eindeutig, Form <fach>.<bereich>.<nr>, Fach und Bereich bekannt, Stufe gültig", () => {
  const ids = K.alle().map(z => z.id);
  assert.strictEqual(new Set(ids).size, ids.length, "doppelte ID");
  K.alle().forEach(z => {
    assert.match(z.id, /^[a-z]{2,3}\.[a-z0-9]{2}\.\d{2}$/, z.id);
    assert.ok(K.FAECHER[z.fach] && K.FAECHER[z.fach].bereiche[z.bereich], "unbekannter Bereich " + z.id);
    assert.ok(K.STUFEN.includes(z.stufe), "Stufe " + z.id);
    assert.ok(z.titel.de && z.titel.de.length < 110, "Titel " + z.id);
  });
});

pruefe("Kern: Deutsch hat die fünf Bereiche der KMK-Fassung 2022, Mathe fünf Leitideen plus prozessbezogene Kompetenzen", () => {
  assert.strictEqual(Object.keys(K.FAECHER.de.bereiche).length, 5);
  assert.strictEqual(L.kmk.deutsch.length, 5);
  ["sz", "sc", "le", "tm", "su"].forEach(b => assert.ok(K.fach("de", b).length >= 4, "Deutsch " + b));
  ["zo", "rf", "ms", "gm", "dz", "pk"].forEach(b => assert.ok(K.fach("ma", b).length >= 4, "Mathe " + b));
  // Klasse 1–4 in Mathe und Deutsch jeweils mit Zielen
  ["1", "2", "3", "4"].forEach(s => ["ma", "de"].forEach(f => assert.ok(K.alle().some(z => z.fach === f && z.stufe === s), f + " Stufe " + s)));
});

pruefe("Sachsen: alle 45 Lernbereiche (Mathe, Deutsch 2025, Sachunterricht) haben lz-Verweise auf existierende Ziele (Ausnahme: Experimentieren Kl. 3)", () => {
  let lb = 0, leer = [];
  ["mathe", "deutsch", "sachkunde"].forEach(f => Object.entries(L.laender.sachsen.faecher[f].stufen).forEach(([st, liste]) => liste.forEach(x => {
    lb++;
    assert.ok(Array.isArray(x.lz), `${f} ${st} ${x.nr} ohne lz`);
    if (!x.lz.length) leer.push(`${f} ${st} ${x.titel}`);
    x.lz.forEach(id => assert.ok(K.ziel(id), `${f} ${st} ${x.nr}: unbekanntes Ziel ${id}`));
  })));
  assert.strictEqual(lb, 45);
  assert.deepStrictEqual(leer, ["sachkunde 3 Experimentieren"]);
});

pruefe("Kompatibilität: LEHRPLAN.fuer liefert dasselbe wie vorher (Abdeckung von Hand; Stand Schuljahr Deutsch und SU 28.10.2026: 37 gut, 8 teilweise)", () => {
  const n = { ja: 0, teil: 0, nein: 0 };
  [2, 3, 4].forEach(k => ["mathe", "deutsch", "sachkunde"].forEach(f => L.fuer("sachsen", f, k).forEach(x => n[x.abdeckung]++)));
  assert.deepStrictEqual({ ...n }, { ja: 37, teil: 8, nein: 0 });
  assert.strictEqual(L.fuer("sachsen", "mathe", 1), L.fuer("sachsen", "mathe", 2), "Kl. 1 und 2 teilen sich „1/2“");
  assert.strictEqual(L.fuer("bayern", "mathe", 2).length, 0);
  assert.strictEqual(L.laender.sachsen.name, "Sachsen");
});

pruefe("Sachsen in voller Tiefe: Mathe Kl. 1/2, 3 und 4 vollständig – jeder Inhaltspunkt geübt oder ehrlich als „draußen/Papier“ markiert je Lernbereich, jede Zuordnung zeigt auf eine echte Station/Aufgabe", () => {
  const lbs = L.laender.sachsen.faecher.mathe.stufen["1/2"], ids = new Set();
  const stationen = new Set([].concat(w.Mathe.STATIONEN, w.Mathe.STATIONEN_K1, w.Mathe.STATIONEN_K3, w.Mathe.STATIONEN_K4, w.Mathe.STATIONEN_K5).map(s => s.id));
  const echt = fs.readFileSync(path.join(__dirname, "..", "shared/echtewelt.js"), "utf8");
  let n = { ja: 0, teil: 0, nein: 0, aussen: 0 };
  lbs.forEach(lb => {
    assert.ok(lb.punkte && lb.punkte.length >= 6, "Punkte fehlen in " + lb.titel);
    lb.punkte.forEach(p => {
      assert.ok(!ids.has(p.id), "doppelt " + p.id); ids.add(p.id); n[p.abdeckung]++;
      assert.ok(["1", "2", "1/2"].includes(p.kl) && p.text.length < 140, p.id);
      p.app.forEach(a => { const [art, id] = a.split(":");
        if (art === "mathe") assert.ok(stationen.has(id), `${p.id}: Station ${id} gibt es nicht`);
        else if (art === "werkstatt") assert.ok(w.WERKSTATT.some(k => k.id === id), `${p.id}: Werkstatt-Kapitel ${id} gibt es nicht`);
        else if (art === "echtewelt") assert.ok(echt.includes(`["${id}", `), `${p.id}: Echte-Welt-Aufgabe ${id} gibt es nicht`);
        else assert.fail(`${p.id}: unbekannte Zuordnung ${a}`); });
      if (p.abdeckung === "ja") assert.ok(p.app.some(a => /^(mathe|werkstatt):/.test(a)), p.id + " ist „ja“ ohne Station");
    });
  });
  assert.strictEqual(ids.size, 54);
  assert.deepStrictEqual(n, { ja: 50, teil: 0, nein: 0, aussen: 4 });
  // Kl. 3 und 4 (gleiche Prüfung der Zuordnungen)
  for (const [st, soll, zahl] of [["3", { ja: 32, teil: 0, nein: 0, aussen: 2 }, 34], ["4", { ja: 28, teil: 0, nein: 0, aussen: 4 }, 32]]) {
    const m = { ja: 0, teil: 0, nein: 0, aussen: 0 }, ids2 = new Set();
    L.laender.sachsen.faecher.mathe.stufen[st].forEach(lb => { assert.ok(lb.punkte && lb.punkte.length >= 4, `Kl. ${st} ${lb.titel}`);
      lb.punkte.forEach(p => { assert.ok(!ids2.has(p.id) && p.kl === st, p.id); ids2.add(p.id); m[p.abdeckung]++;
        p.app.forEach(a => { const [art, id] = a.split(":"); assert.ok(art === "mathe" ? stationen.has(id) : art === "werkstatt" ? w.WERKSTATT.some(k => k.id === id) : art === "echtewelt" && echt.includes(`["${id}", `), `${p.id}: ${a}`); });
        if (p.abdeckung === "ja") assert.ok(p.app.some(a => /^(mathe|werkstatt):/.test(a)), p.id); }); });
    assert.strictEqual(ids2.size, zahl, "Kl. " + st); assert.deepStrictEqual(m, soll, "Kl. " + st);
  }  // Übergang 5 (vorläufig, eigene Liste)
  const ue = L.laender.sachsen.uebergang, u = { ja: 0, teil: 0, nein: 0, aussen: 0 };
  assert.ok(ue && /vorläufig/.test(ue.stand));
  ue.mathe.forEach(p => { u[p.abdeckung]++; p.app.forEach(a => { const [art, id] = a.split(":"); assert.ok(art === "mathe" ? stationen.has(id) : echt.includes(`["${id}", `), `${p.id}: ${a}`); }); });
  assert.deepStrictEqual(u, { ja: 13, teil: 1, nein: 0, aussen: 1 });
});

pruefe("Sachsen in voller Tiefe: Deutsch Kl. 1/2, 3 und 4 – jeder Inhaltspunkt zugeordnet, Zuordnungen zeigen auf echte Kapitel, LB-Abdeckung passt zu den Punkten", () => {
  const echt = fs.readFileSync(path.join(__dirname, "..", "shared/echtewelt.js"), "utf8");
  const LESEN = ["anlaute", "silben", "texte", "spuren", "legen", "tafel"];
  const gibt = (a) => { const [art, id] = a.split(":");
    if (art === "werkstatt") return w.WERKSTATT.some(k => k.id === id);
    if (art === "deutsch") return w.GESCHICHTE.some(k => k.id === id);
    if (art === "lesen") return LESEN.includes(id);
    if (art === "medien") return w.LEKTIONEN.some(k => k.id === id);
    if (art === "sachkunde") return w.THEMEN.some(k => k.id === id);
    if (art === "echtewelt") return echt.includes(`["${id}", `);
    return false; };
  const ids = new Set(), soll = { "1/2": [69, { ja: 63, teil: 2, nein: 0, aussen: 4 }], "3": [63, { ja: 59, teil: 3, nein: 0, aussen: 1 }], "4": [47, { ja: 44, teil: 2, nein: 0, aussen: 1 }] };
  const kl = { "1/2": ["1", "2", "1/2"], "3": ["3"], "4": ["4"] };
  Object.entries(soll).forEach(([st, [zahl, verteilung]]) => {
    const n = { ja: 0, teil: 0, nein: 0, aussen: 0 }; let z = 0;
    L.laender.sachsen.faecher.deutsch.stufen[st].forEach(lb => {
      assert.ok(lb.punkte && lb.punkte.length >= 4, `Deutsch ${st} ${lb.titel}: Punkte fehlen`);
      lb.punkte.forEach(p => {
        z++; n[p.abdeckung]++;
        assert.ok(!ids.has(p.id), "doppelt " + p.id); ids.add(p.id);
        assert.ok(kl[st].includes(p.kl) && p.text.length < 140, p.id);
        p.app.forEach(a => assert.ok(gibt(a), `${p.id}: Zuordnung ${a} gibt es nicht`));
        if (p.abdeckung === "ja") assert.ok(p.app.some(a => /^(werkstatt|deutsch|lesen|medien):/.test(a)), p.id + " ist „ja“ ohne Übung");
      });
      // LB „ja“ genau dann, wenn kein Punkt „teil“ oder „nein“ ist (draußen/Papier zählt nicht dagegen)
      const offen = lb.punkte.some(p => p.abdeckung === "teil" || p.abdeckung === "nein");
      assert.strictEqual(lb.abdeckung, offen ? "teil" : "ja", `Deutsch ${st} ${lb.titel}: Abdeckung passt nicht zu den Punkten`);
    });
    assert.strictEqual(z, zahl, "Deutsch Kl. " + st); assert.deepStrictEqual(n, verteilung, "Deutsch Kl. " + st);
  });
  // Jedes Werkstatt-Kapitel gehört zu einem Lernbereich und kommt in mindestens einem Inhaltspunkt vor
  const benutzt = new Set(); Object.values(L.laender.sachsen.faecher.deutsch.stufen).forEach(lbs => lbs.forEach(lb => lb.punkte.forEach(p => p.app.forEach(a => benutzt.add(a)))));
  w.WERKSTATT.forEach(k => { assert.ok(["sz", "sc", "le", "tm", "su"].includes(k.lb), k.id + ": lb fehlt");
    if (k.id !== "w-rechengeschichten" && k.stufe !== 5) assert.ok(benutzt.has("werkstatt:" + k.id), k.id + " kommt in keinem Inhaltspunkt vor"); });
});

pruefe("Sachsen in voller Tiefe: Sachunterricht Kl. 1/2, 3 und 4 (Pflicht-Lernbereiche) – jeder Inhaltspunkt zugeordnet, Zuordnungen echt, LB-Abdeckung passt", () => {
  const echt = fs.readFileSync(path.join(__dirname, "..", "shared/echtewelt.js"), "utf8");
  const stationen = new Set([].concat(w.Mathe.STATIONEN, w.Mathe.STATIONEN_K1, w.Mathe.STATIONEN_K3, w.Mathe.STATIONEN_K4).map(s => s.id));
  const gibt = (a) => { const [art, id] = a.split(":");
    return art === "sachkunde" ? w.THEMEN.some(t => t.id === id) : art === "werkstatt" ? w.WERKSTATT.some(k => k.id === id)
      : art === "medien" ? w.LEKTIONEN.some(k => k.id === id) : art === "mathe" ? stationen.has(id) : art === "echtewelt" ? echt.includes(`["${id}", `) : false; };
  const ids = new Set(), soll = { "1/2": [47, { ja: 46, teil: 0, nein: 0, aussen: 1 }], "3": [24, { ja: 22, teil: 1, nein: 0, aussen: 1 }], "4": [28, { ja: 26, teil: 1, nein: 0, aussen: 1 }] };
  const kl = { "1/2": ["1", "2", "1/2"], "3": ["3"], "4": ["4"] };
  Object.entries(soll).forEach(([st, [zahl, verteilung]]) => {
    const n = { ja: 0, teil: 0, nein: 0, aussen: 0 }; let z = 0;
    L.laender.sachsen.faecher.sachkunde.stufen[st].forEach(lb => {
      assert.ok(lb.punkte && lb.punkte.length >= 1, `SU ${st} ${lb.titel}: Punkte fehlen`);
      lb.punkte.forEach(p => {
        z++; n[p.abdeckung]++;
        assert.ok(!ids.has(p.id), "doppelt " + p.id); ids.add(p.id);
        assert.ok(kl[st].includes(p.kl) && p.text.length < 140, p.id);
        p.app.forEach(a => assert.ok(gibt(a), `${p.id}: Zuordnung ${a} gibt es nicht`));
        if (p.abdeckung === "ja") assert.ok(p.app.some(a => /^(sachkunde|werkstatt|medien|mathe):/.test(a)), p.id + " ist „ja“ ohne Übung");
      });
      const offen = lb.punkte.some(p => p.abdeckung === "teil" || p.abdeckung === "nein");
      assert.strictEqual(lb.abdeckung, offen ? "teil" : "ja", `SU ${st} ${lb.titel}: Abdeckung passt nicht zu den Punkten`);
    });
    assert.strictEqual(z, zahl, "SU Kl. " + st); assert.deepStrictEqual(n, verteilung, "SU Kl. " + st);
  });
  // Jedes Sachthema gehört zu einem Lernbereich; alle außer den Zusatzthemen (Familie, Bauen, Strom, Übergang) kommen in einem Inhaltspunkt vor
  const benutzt = new Set(); Object.values(L.laender.sachsen.faecher.sachkunde.stufen).forEach(lbs => lbs.forEach(lb => lb.punkte.forEach(p => p.app.forEach(a => benutzt.add(a)))));
  w.THEMEN.forEach(t => { assert.ok(["zl", "kg", "pt", "un", "rz", "ex"].includes(t.lb), t.id + ": lb fehlt");
    if (!["familie", "bauen", "strom", "lernen-lernen"].includes(t.id)) assert.ok(benutzt.has("sachkunde:" + t.id), t.id + " kommt in keinem Inhaltspunkt vor"); });
});

pruefe("Bestehende Inhalte tragen lz-Verweise, alle zeigen auf existierende Ziele", () => {
  const leer = [];
  w.Mathe.STATIONEN.forEach(s => (s.lz && s.lz.length) || leer.push("mathe:" + s.id));
  [w.WERKSTATT, w.THEMEN, w.LEKTIONEN, w.GESCHICHTE].forEach(arr => arr.forEach(k => (k.lz && k.lz.length) || leer.push(k.id)));
  assert.deepStrictEqual(leer, []);
  I.alle().forEach(d => d.lz.forEach(id => assert.ok(K.ziel(id), `${d.id}: unbekanntes Ziel ${id}`)));
  assert.ok(I.alle().length >= 23 + 5 + 5 + 4 + 6 + 5, "Inhalte: " + I.alle().length);
});

pruefe("Errechnete Abdeckung: Plus/Minus bis 100 und Stellenwerte gut, Wortarten gut, Anlaute gut, Lesetexte und Texte planen gut, Nachspuren teilweise", () => {
  assert.strictEqual(I.abdeckung("ma.zo.07"), "ja");    // vier Stationen
  assert.strictEqual(I.abdeckung("de.su.04"), "ja");    // NA-36: mit Steigerung und Pronomen genug Aufgaben
  assert.strictEqual(I.abdeckung("ma.zo.03"), "ja");    // Plus/Minus bis 20 und bis 10 (Klasse-1-Weg)
  assert.strictEqual(I.abdeckung("ma.zo.05"), "ja");    // Zehner und Einer, Zahlen bis 100, Bild/Zahl/Rechnung (Sachsen in voller Tiefe)
  assert.strictEqual(I.abdeckung("me.ph.01"), "teil");  // ohne Lernkartei
  assert.strictEqual(I.abdeckung("de.le.02"), "ja");    // NA-30: Tafel, Finde das Bild, Welcher Buchstabe (mit Lernkartei)
  assert.strictEqual(I.abdeckung("de.le.05"), "ja");     // Schuljahr Deutsch: Lesetexte, Laut lesen, Lese-Detektiv
  assert.strictEqual(I.abdeckung("de.sc.02"), "teil");   // NA-35: Nachspuren (ohne Lernkartei)
  assert.strictEqual(I.abdeckung("de.sc.07"), "ja");     // Schuljahr Deutsch: Geschichte ordnen, Satzanfänge, Überarbeiten, Textlupe, Weiterschreiben …
  assert.strictEqual(I.abdeckung("de.sz.07"), "teil");   // Paket A: Vortrag vorbereiten
  const z = L.zaehle("sachsen", 2).errechnet;
  assert.strictEqual(z.ja + z.teil + z.nein, 15, "Kl. 1/2: 15 Lernbereiche (Deutsch 2025: fünf statt sieben)");
  assert.ok(z.teil >= 8, "Kl. 1/2: mindestens 8 teilweise errechnet");
});

pruefe("Sachsen Englisch (Lehrplan 2019, ab Kl. 3): 10 Lernbereiche je Klasse, Kl. 1/2 ohne Englisch, Zählung 2 / 14 / 4", () => {
  const n = { ja: 0, teil: 0, nein: 0 };
  [3, 4].forEach(k => { const lb = L.fuer("sachsen", "englisch", k); assert.strictEqual(lb.length, 10); lb.forEach(x => { n[x.abdeckung]++; x.lz.forEach(id => assert.ok(K.ziel(id), id)); }); });
  assert.deepStrictEqual({ ...n }, { ja: 2, teil: 14, nein: 4 });
  assert.strictEqual(L.fuer("sachsen", "englisch", 2).length, 0);
  assert.ok(L.laender.sachsen.faecher.deutsch.stand.startsWith("Lehrplan 2025, gültig ab 1.8.2025"));
});

pruefe("Länder-Abweichung: Sachsen verschiebt einfache Kombinationen nach Kl. 2 und kennt ein Zusatz-Ziel", () => {
  assert.strictEqual(I.zielStufe("ma.dz.05", "nw"), "3");
  assert.strictEqual(I.zielStufe("ma.dz.05", "sn"), "2");
  assert.ok(K.ziel("su.hi.sn01") && K.ziel("su.hi.sn01").land === "sn");
});

pruefe("Inhalte.fuer(kind): passende Stufe oder eine darunter, Vorschule nur Vorschul-Inhalte, Länder-Filter", () => {
  const ids = (k) => w.Inhalte.fuer(k).map(d => d.id);
  const kl2 = ids({ stufe: "2", land: "sn" });
  assert.ok(kl2.includes("mathe:plus100") && kl2.includes("mathe:plus20"), "Kl. 2 bekommt Kl.-2- und Kl.-1-Stationen");
  assert.ok(!kl2.includes("mathe:mal3"), "Einmaleins 6–9 erst ab Kl. 3");
  assert.ok(ids({ stufe: "3", land: "sn" }).includes("mathe:mal3"));
  const vs = ids({ stufe: "vs", land: "sn" });
  assert.ok(vs.includes("daz:d0") && vs.includes("de.anlaute.gleich") && vs.includes("mathe:k1wuerfel"), "Vorschule: Ankommen, Anlaute, Mengen");
  assert.ok(!vs.includes("mathe:plus20") && !vs.includes("mathe:k1zwanzig"), "Vorschule: keine Klasse-1/2-Rechenaufgaben");
  I.registriere({ id: "test:nurby", lz: ["de.sc.07"], stufe: ["1"], laender: ["by"] });
  assert.ok(ids({ stufe: "1", land: "by" }).includes("test:nurby"));
  assert.ok(!ids({ stufe: "1", land: "sn" }).includes("test:nurby"));
  assert.strictEqual(I.abdeckung("de.sc.07"), "ja");
});

// Übersicht: Lernziele ohne Inhalt (Abnahme NA-03: „tests/lehrplan.js listet Lernziele ohne Inhalt“)
const frisch = lade(DATEN.concat(LEHRPLAN));
const ohne = frisch.Inhalte.ohneInhalt();
const jeFach = {};
ohne.forEach(z => { (jeFach[z.fach] = jeFach[z.fach] || []).push(z.id); });
console.log(`\nLernziele ohne Inhalt: ${ohne.length} von ${frisch.LernzielKern.alle().length}`);
Object.entries(jeFach).forEach(([f, l]) => console.log(`  ${f}: ${l.length}` + (process.env.LUECKEN ? "  " + l.join(", ") : "")));
console.log(`✅ Lehrplan: ${n} Prüfungen bestanden.`);
