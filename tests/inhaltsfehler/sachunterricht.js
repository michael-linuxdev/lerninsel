// Paket D (Sachunterricht): Absicherung der Korrekturen an themen.js, transfer.js, landkreise.js, bilder.js.
// Aufruf: node -e 'console.log(require("./d.js")("/pfad/zum/repo"))'  → Anzahl der Prüfungen
const assert = require("assert"), fs = require("fs"), path = require("path"), vm = require("vm");
module.exports = function (wurzel) {
  let n = 0;
  const lade = () => {
    const w = {}; const ctx = vm.createContext({ window: w, console, Math, document: { addEventListener() {} } });
    for (const d of ["spiele/sachkunde/themen.js", "spiele/sachkunde/landkreise.js", "spiele/sachkunde/faecher.js", "spiele/sachkunde/religion.js", "spiele/sachkunde/transfer.js"]) {
      const p = path.join(wurzel, d); if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, "utf8"), ctx, { filename: d });
    }
    return w;
  };
  const w = lade();
  const alle = w.THEMEN.concat(w.LANDKREIS_THEMEN, w.FACH_THEMEN || [], w.RELIGION_THEMEN || []);
  const thema = (id) => { const t = alle.find(x => x.id === id); assert(t, "Thema fehlt: " + id); return t; };
  const text = (t) => JSON.stringify(t);

  // 1. Fakten sind überall Paare [deutsch, russisch] (sonst zeigt die Seite Einzelbuchstaben)
  for (const t of alle) for (const s of t.schritte) for (const f of s.fakten || []) {
    assert(Array.isArray(f) && f.length === 2 && typeof f[0] === "string" && typeof f[1] === "string" && f[0].length > 3, `${t.id}: Fakt ist kein Paar: ${JSON.stringify(f)}`);
  }
  n++;
  // 2. Landkreise: 13 Kreise + Quiz, Daumen-Sätze sind ganze Sätze und stehen nicht wörtlich auf der Info-Karte
  const LK = w.LANDKREIS_THEMEN; assert.strictEqual(LK.length, 14);
  const VERB = /\b(ist|sind|steht|stehen|gibt|liegt|liegen|werden|wird|wurde|wurden|kann|kommen|kommt|fahren|fährt|erkennt|leben|hat|haben)\b/;
  for (const t of LK.filter(x => x.landkreis)) {
    const d = t.schritte.filter(s => s.typ === "daumen"); assert.strictEqual(d.length, 2, t.id);
    const info = t.schritte.filter(s => s.typ === "info").map(s => s.text + " " + (s.fakten || []).map(f => f[0]).join(" ")).join(" ");
    for (const s of d) {
      assert(s.satz.split(/\s+/).length >= 4 && VERB.test(s.satz) && /\.$/.test(s.satz), `${t.id}: kein ganzer Satz: ${s.satz}`);
      assert(/[а-яё]/i.test(s.satzRu) && s.satzRu !== "Это правда?", `${t.id}: russischer Satz fehlt`);
      assert(!info.includes(s.satz.replace(/\.$/, "")), `${t.id}: Daumen-Satz steht wörtlich auf der Info-Karte`);
    }
    for (const s of t.schritte) { assert(/[а-яё]/i.test(s.ru || s.satzRu || ""), `${t.id}: Russisch fehlt`); for (const o of s.optionen || []) assert(o.warumRu && o.warumRu !== "Нет.", `${t.id}: warumRu leer`); }
    assert(!/Kreisstadt:/.test(text(t)) || t.schritte[0].text.includes(" im "), `${t.id}: kreisfreie Stadt mit „Kreisstadt:“`);
  }
  n++;
  // 3. Sprache: keine Stadt „fließt“, Genitiv mit -es
  const lkText = text(LK);
  assert(!/Durch welchen Fluss fließt/.test(lkText)); assert(/Welcher Fluss fließt durch Dresden\?/.test(lkText));
  assert(/des Erzgebirgskreises\?/.test(lkText) && /des Vogtlandkreises\?/.test(lkText) && !/des Erzgebirgskreis\?|des Vogtlandkreis\?/.test(lkText));
  assert(/kleinste Mittelgebirge/.test(lkText) && !/kleinste Gebirge/.test(lkText));
  n++;
  // 4. Zufällige Ablenker: nie eine Antwort, die auch stimmt (300 frische Ladungen)
  for (let i = 0; i < 300; i++) {
    const L2 = lade().LANDKREIS_THEMEN;
    const lpz = L2.find(t => t.id === "lk-leipzig").schritte.find(s => s.typ === "wahl" && /Fluss/.test(s.frage));
    assert(lpz.optionen[0].t === "Weiße Elster" && lpz.optionen[0].ok && !lpz.optionen.some(o => o.t === "Pleiße"), "Pleiße als Ablenker bei der Stadt Leipzig");
    const sorb = L2.find(t => t.id === "lk-sachsen").schritte.find(s => /sorbisch/.test(s.frage || ""));
    assert(sorb.optionen[0].t === "Landkreis Bautzen" && !sorb.optionen.some(o => /Görlitz/.test(o.t)), "Görlitz als Ablenker bei der Sorbisch-Frage");
    for (const t of L2) for (const s of t.schritte) if (s.typ === "wahl") {
      assert.strictEqual(s.optionen.filter(o => o.ok).length, 1); assert.strictEqual(new Set(s.optionen.map(o => o.t)).size, s.optionen.length, t.id + ": doppelte Option");
    }
  }
  n++;
  // 5. Sensible Themen: Vertrauensperson und Nummer gegen Kummer
  for (const id of ["nein-sagen", "kinderrechte", "gross-werden", "mein-koerper"]) assert(/116 111/.test(text(thema(id))), id + ": 116 111 fehlt");
  assert(/vertrau/.test(text(thema("nein-sagen"))) && /vertrau/.test(text(thema("kinderrechte"))));
  assert(/außen eine Vulva und innen die Scheide/.test(text(thema("mein-koerper"))) && !/Scheide \(Vulva\)/.test(text(alle)));
  assert(/zwischen etwa 8 und 14 Jahren/.test(text(thema("gross-werden"))));
  n++;
  // 6. Veraltetes und Widersprüche
  const su = text(w.THEMEN) + text(w.SU_TRANSFER) + lkText;
  for (const wort of ["Bauplatz", "Kinderausweis", "Tollwut", "Будишин", "две тормоза", "Bal-le"]) assert(!su.includes(wort), "noch vorhanden: " + wort);
  assert(!/Tablets gibt es erst seit ein paar Jahren/.test(su));
  assert(!/Wasser, Wärme und Licht bekommt, beginnt er zu keimen/.test(su), "Keimen: Info-Karte widerspricht der Frage");
  assert(!/Spaten legt man mit den Zinken/.test(su) && !/Tannenzapfen"/.test(text(thema("waldtiere"))));
  n++;
  // 7. Begleiter nie als Emoji in Bildern der Sachthemen (Benno 🦫 nur als echtes Tier „Säugetiere“, Ella nie als 🦉 bei „Geschafft!“)
  for (const t of w.THEMEN) for (const s of t.schritte) {
    if (s.titel === "Geschafft!") assert(s.bild !== "🦉" && s.bild !== "🦫", t.id + ": Begleiter-Emoji bei „Geschafft!“");
    if (/Benno/.test((s.frage || "") + (s.text || ""))) assert(s.bild !== "🦫", t.id + ": Benno als Biber-Emoji");
  }
  n++;
  // 8. Keine doppelte Frage innerhalb eines Themas; Zuordnen: Gruppenname steht nicht wörtlich im Ding
  for (const t of w.THEMEN) {
    const fr = t.schritte.map(s => s.frage || s.satz).filter(Boolean); assert.strictEqual(new Set(fr).size, fr.length, t.id + ": doppelte Frage");
  }
  const komp = thema("kompass").schritte.find(s => s.typ === "zuordnen"); assert(!komp.gruppen.some(g => /Rechts|Links/.test(g.name)), "Kompass: Gruppenname verrät die Antwort");
  n++;
  // 9. Transfer: erste Option richtig, genau eine; Karte: „Polen“ steht außerhalb des Sachsen-Umrisses (x > 206)
  for (const f of w.SU_TRANSFER) if (f.typ === "wahl") { assert(f.optionen[0].ok && f.optionen.filter(o => o.ok).length === 1, "Transfer: " + f.frage); }
  const bi = fs.readFileSync(path.join(wurzel, "spiele/sachkunde/bilder.js"), "utf8"), m = bi.match(/<text x="([\d.]+)" y="([\d.]+)"[^>]*>Polen<\/text>/);
  assert(m && +m[1] > 206, "Polen-Beschriftung liegt im Sachsen-Umriss");
  n++;
  return n;
};
if (require.main === module) console.log("Paket D: " + module.exports(process.argv[2] || process.cwd()) + " Prüfungen bestanden.");
