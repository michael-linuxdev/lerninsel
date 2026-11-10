// Paket E (Weitere Fächer, Religion, Bewegungspause): sichert die Korrekturen aus der Inhaltsprüfung ab.
// Aufruf: require("./e.js")(wurzel) → Anzahl der Prüfungen; wirft bei einem Fehler (nur assert).
const assert = require("assert"), fs = require("fs"), vm = require("vm"), path = require("path");
module.exports = function (wurzel) {
  let n = 0; const pruefe = (name, f) => { f(); n++; };
  const lies = (d) => fs.readFileSync(path.join(wurzel, d), "utf8");
  const win = {}; const ctx = vm.createContext({ window: win, console });
  const faecher = lies("spiele/sachkunde/faecher.js"), religion = lies("spiele/sachkunde/religion.js"), bewegung = lies("spiele/sachkunde/bewegung.js");
  vm.runInContext(faecher, ctx); vm.runInContext(religion, ctx);
  const T = win.FACH_THEMEN; assert.ok(T && T.length > 100, "FACH_THEMEN geladen");
  const thema = (id) => { const t = T.find(x => x.id === id); assert.ok(t, "Thema fehlt: " + id); return t; };
  const text = (t) => JSON.stringify(t);

  pruefe("Religion: der Apostel heißt Thomas", () => {
    assert.ok(!/Tomas/.test(religion), "„Tomas“ steht noch in religion.js");
    assert.ok(/Thomas/.test(thema("re-passion").name));
  });
  pruefe("kein russisches „ВОВ“ als Merkwort", () => { assert.ok(!/ВОВ/.test(faecher + religion)); });
  pruefe("Zuordnen: mindestens 4 Dinge; bei zwei Gruppen je Gruppe mindestens 2; jede Gruppe belegt", () => {
    T.forEach(t => t.schritte.forEach((s, i) => {
      if (s.typ !== "zuordnen") return;
      const je = {}; s.gruppen.forEach(g => { je[g.id] = 0; });
      s.dinge.forEach(d => { assert.ok(d.gruppe in je, `${t.id}/${i}: unbekannte Gruppe ${d.gruppe}`); je[d.gruppe]++; assert.ok(d.t && d.ru, `${t.id}/${i}: Ding ohne Text/Russisch`); });
      assert.ok(s.dinge.length >= 4, `${t.id}/${i}: nur ${s.dinge.length} Dinge`);
      assert.ok(Object.values(je).every(x => x >= 1), `${t.id}/${i}: leere Gruppe`);
      if (s.gruppen.length === 2) assert.ok(Object.values(je).every(x => x >= 2), `${t.id}/${i}: Gruppe mit nur einem Ding`);
      assert.strictEqual(new Set(s.dinge.map(d => d.t)).size, s.dinge.length, `${t.id}/${i}: doppeltes Ding`);
    }));
  });
  pruefe("Wahl: kein leeres Bild, erste Option richtig, alle Felder da", () => {
    T.forEach(t => t.schritte.forEach((s, i) => {
      if (s.typ !== "wahl") return;
      assert.ok(s.bild && s.bild.trim(), `${t.id}/${i}: Bild leer`);
      assert.ok(s.optionen[0].ok && s.optionen.slice(1).every(o => !o.ok), `${t.id}/${i}: Lösung`);
      s.optionen.forEach(o => assert.ok(o.t && o.ru && o.warum && o.warumRu, `${t.id}/${i}: Option unvollständig`));
    }));
  });
  pruefe("Bewegungspause: „1 Sekunde“ in der Einzahl, Flamingo steht ruhig", () => {
    assert.ok(/n === 1 \? "Sekunde" : "Sekunden"/.test(bewegung), "Einzahl fehlt");
    assert.ok(!/<\/span> Sekunden<\/button>/.test(bewegung), "fester Text „Sekunden“");
    assert.ok(/RUHIG = \{ flamingo: true \}/.test(bewegung) && /if \(!RUHIG\[u\.pose\]\)/.test(bewegung), "Flamingo wechselt noch im Takt");
    assert.ok(!/Step Touch/.test(faecher), "Schreibung Step-Touch");
  });
  pruefe("mu-hoeren: ein als „leise“ beschriebenes Klangbeispiel ist wirklich leise", () => {
    let gefunden = 0;
    thema("mu-hoeren").schritte.forEach(s => {
      if (!s.klang || !/leise/.test(s.optionen[0].warum) || Array.isArray(s.klang.laut)) return;
      gefunden++; assert.ok(typeof s.klang.laut === "number" && s.klang.laut < 0.5, "laut = " + s.klang.laut);
    });
    assert.ok(gefunden >= 1, "kein leises Beispiel gefunden");
  });
  pruefe("Fächer: einzelne Sachkorrekturen", () => {
    assert.ok(/im Jahr 1756/.test(text(thema("mu-mozart"))) && !/vor fast 270 Jahren/.test(faecher), "Mozart");
    assert.ok(/Melodie zur „Ode an die Freude“/.test(text(thema("mu-komponisten"))), "Beethoven");
    assert.ok(/Kreisfassung/.test(text(thema("mu-bewegung"))) && !/Zweihandfassung/.test(faecher), "Kreisfassung");
    assert.ok(!/🇬🇷/.test(faecher), "Flagge verrät Sirtaki");
    assert.ok(/112/.test(text(thema("sp-baderegeln"))), "Baderegeln: Notruf 112");
    assert.ok(!/Winter austreiben/.test(faecher), "Fasching");
    assert.ok(!/Furnier|Gummiband|Im Sitzen fernsehen|Anspitzer|Locher/.test(faecher), "mehrdeutige Dinge");
    assert.ok(/hat das Recht, zur Schule zu gehen/.test(faecher) && /Recht auf einen Namen/.test(faecher), "Kinderrechte als Recht");
    assert.strictEqual(thema("et-symbole").schritte.filter(s => s.frage === "Wofür steht das Symbol?").length, 1, "Frage doppelt");
  });
  pruefe("Religion: einzelne Sachkorrekturen", () => {
    assert.ok(/In sechs Tagen erschafft Gott/.test(religion) && !/In sieben Tagen erschafft/.test(religion), "Schöpfung");
    assert.ok(!/Katholische Christen feiern das am 6\. Januar/.test(religion), "6. Januar");
    assert.ok(!/Tuch auf dem Altar/.test(religion), "Altartuch");
    assert.ok(!/Was verbindet alle christlichen Kirchen/.test(religion), "alle Kirchen");
    assert.ok(!/Конфирмация \(миропомазание\)/.test(religion), "Firmung russisch");
    assert.ok(!/"🕎"|"🟩"/.test(religion), "Bild verrät/passt nicht");
    assert.ok(!/Gott ist wie ein Hirte", "[^"]*", "schutz"/.test(religion), "Hirte doppeldeutig");
    assert.ok(/Regenbogen/.test(text(thema("re-noah").schritte.filter(s => s.typ === "daumen"))), "Noah: Regenbogen wird geübt");
    assert.ok(/fünf Broten und zwei Fischen/.test(text(thema("re-mahl"))), "Speisung der Fünftausend");
    assert.ok(!/Festmahl/.test(text(thema("re-gleichnisse"))) && /hundert Schafe/.test(text(thema("re-gleichnisse"))), "Gleichnisse ohne Dublette");
    [["re-feste12", /Nikolaus/], ["re-bruecken", /Goldene Regel|Ermutigung/], ["re-judentum", /Jesus im Tempel/], ["re-reformation", /Leben im Mittelalter/], ["re-oekumene", /Abendmahl und Kommunion/]]
      .forEach(([id, re]) => assert.ok(!re.test(thema(id).kurz), id + ": kurz verspricht zu viel"));
  });
  return n;
};
if (require.main === module) console.log("✅ Paket E: " + module.exports(process.argv[2] || process.cwd()) + " Prüfungen bestanden.");
