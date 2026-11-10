// Paket F (Prüfung der Lerninhalte 10.11.2026): Echte-Welt-Ideen vollständig, sorbische Korrekturen, Karten-Erklärungen der Expedition, Englisch-Bilder
const assert = require("assert"), fs = require("fs"), path = require("path");
module.exports = function (wurzel) {
  let n = 0; const lies = (p) => fs.readFileSync(path.join(wurzel, p), "utf8");
  const lade = (p, window) => { new Function("window", lies(p))(window); return window; };

  // 1. Echte Welt: jeder Eintrag ein Array mit eindeutiger id; jede echtewelt:<id> aus dem Lehrplan gibt es
  const ew = lade("shared/echtewelt.js", { Spielwelt: { lade: () => null, speichere() {}, heute: () => "2026-11-10", profil: {} } }).EchteWelt;
  assert(ew && Array.isArray(ew.IDEEN) && ew.IDEEN.length > 90, "EchteWelt.IDEEN fehlt");
  const ids = new Set();
  for (const i of ew.IDEEN) { assert(Array.isArray(i) && typeof i[0] === "string" && typeof i[3] === "string", "Echte-Welt-Idee ist kein vollständiger Eintrag: " + JSON.stringify(i).slice(0, 60)); assert(!ids.has(i[0]), "Echte-Welt-Idee doppelt: " + i[0]); ids.add(i[0]); }
  assert(ids.has("malen") && ids.has("farbkreis"), "Ideen „malen“ und „farbkreis“ fehlen (Komma in echtewelt.js?)");
  for (const p of ["shared/lehrplan/laender/sachsen-punkte.js", "shared/lehrplan/laender/sachsen.js"])
    for (const m of lies(p).matchAll(/echtewelt:([a-z0-9-]+)/g)) assert(ids.has(m[1]), `${p}: echtewelt:${m[1]} gibt es nicht`);
  n++;

  // 2. Sorbisch: korrigierte Wörter bleiben korrigiert
  const so = lies("spiele/sorbisch/lektionen.js"), sm = lies("spiele/sorbisch/mutter.js");
  for (const w of ["hornc", "róžowc", "Licby", "\"opica\"", "so: \"nos\"", "kruta wěža", "wohen\"", "štrympy", "hawron", "jutrowni rejtarjo", "wětřik", "smutny", "Błota", "Tierpark Bautzen", "trěhać", "so: \"stoł\""])
    assert(!so.includes(w), "sorbisch/lektionen.js enthält wieder „" + w + "“");
  for (const w of ["žonop", "róžownik", "Ličby", "wopica", "so: \"nós\"", "křiwa wěža", "woheń", "rapak", "křižerjo", "Błóta", "zrudny", "stólc"]) assert(so.includes(w), "sorbisch/lektionen.js: „" + w + "“ fehlt");
  for (const w of ["\"nozy\"", "Zapłać Bóh", "nosydźa", "Plańće", "hawronow", "łopješkami", "z swójbu", "dołhowčasne", "Im katholischen Teil"]) assert(!sm.includes(w), "sorbisch/mutter.js enthält wieder „" + w + "“");
  for (const w of ["\"noze\"", "Wjerš pomazy", "noša", "Planujće", "rapakow", "ze swójbu"]) assert(sm.includes(w), "sorbisch/mutter.js: „" + w + "“ fehlt");
  const S = lade("spiele/sorbisch/lektionen.js", {}).SORBISCH; assert(S.length === 47, "47 sorbische Lektionen");
  for (const k of S) { const m = new Set(); for (const w of k.woerter) { assert(!m.has(w.so), k.id + ": Wort doppelt " + w.so); m.add(w.so); }
    for (const x of k.extra || []) if (x.typ === "wahl") assert(new Set(x.optionen).size === x.optionen.length, k.id + ": Optionen doppelt"); }
  n++;

  // 3. Expedition: Erklärungen der Heimatinsel beginnen groß, kein „von das/der/die“
  const el = () => new Proxy({}, { get: (t, k) => k in t ? t[k] : (k === "addEventListener" ? () => {} : k === "classList" ? { toggle() {}, add() {}, remove() {} } : undefined), set: (t, k, v) => { t[k] = v; return true; } });
  for (const st of ["a", "b", "c", "d"]) {
    const w = { __expeditionStufe: st, Spielwelt: { profil: { name: "Mira" }, lade: () => null, speichere() {}, offen: () => false, istFrei: () => false, schalteFrei: () => true, paar: x => [x[0], ""], ht: () => "", kind: () => ({ ort: null }), sterne: () => 0, esc: x => x, hilfe: () => false, heute: () => "2026-11-10", MINISPIELE_AUS: true },
      Story: { etappe: () => true, kapitel: () => 9, gesehen: () => true, zustand: () => ({}), chronik: () => [], hatGeschenk: () => false }, Szene: { laeuft: false }, Lernfunde: { gesamt: () => 80, baum: () => ({ stufe: 3 }) }, TierPflege: { lade: () => ({ phase: null }) } };
    new Function("window", lies("shared/insel-kern.js"))(w);
    new Function("window", "document", "location", "Story", lies("spiele/expedition/expedition.js"))(w, { getElementById: () => el(), querySelectorAll: () => [] }, { search: "", hash: "" }, w.Story);
    const F = w.__expedition.FRAGEN; assert(F.length > 30, "Expedition: Fragen der Heimatinsel");
    for (const f of F) {
      assert(!/ von (das|dem|die) | von der (Steg|Garten|Leuchtturm|Wissensbaum)/.test(f.warum), f.id + ": „" + f.warum + "“");
      assert(/^[A-ZÄÖÜ]/.test(f.warum) || /^[xy] = /.test(f.warum), f.id + ": Erklärung beginnt klein: „" + f.warum + "“");
      assert(new Set(f.optionen).size === f.optionen.length, f.id + ": Optionen doppelt");
    }
  }
  assert(!/ordne\(f\.optionen, lauf\.pos\)/.test(lies("spiele/expedition/expedition.js") + lies("spiele/wetter/drache.js")), "Antworten werden wieder nach Fragenummer gedreht");
  n++;

  // 4. Englisch: je Lektion jedes Bild und jedes Wort nur einmal
  const E = lade("spiele/englisch/lektionen.js", {}).ENGLISCH; assert(E.length === 31, "31 Englisch-Lektionen");
  for (const k of E) { const b = new Set(), ww = new Set(); for (const w of k.woerter) { assert(!b.has(w.e), k.id + ": Bild doppelt " + w.e + " (" + w.en + ")"); b.add(w.e); assert(!ww.has(w.en), k.id + ": Wort doppelt " + w.en); ww.add(w.en); } }
  const book = E.find(k => k.id === "en-book"); assert(book.woerter.find(w => w.en === "story").e !== "📖", "en-book: story und book sehen gleich aus");
  n++;
  return n;
};
if (require.main === module) console.log("✅ Paket F: " + module.exports(process.argv[2] || process.cwd()) + " Prüfungen bestanden.");
