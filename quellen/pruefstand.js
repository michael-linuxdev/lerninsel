// Prüfstand der Lerninhalte (02.11.2026, Vorbild Bastion: „pnpm review“) – zeigt, wie viel von einem Menschen geprüft ist.
// Lerninhalte entstehen oft mit KI-Hilfe. Als geprüft gelten sie erst, wenn ein Mensch sie fachlich gelesen hat.
// Stufen: 0 = Entwurf (Standard), 1 = maschinell geprüft (Tests grün, Lehrplan-Zuordnung stimmt), 2 = fachlich geprüft (Mensch), 3 = mit Kindern ausprobiert.
// Vermerke stehen in quellen/pruefstand.json: { "<bereich>:<id>": { stufe, pruefer, am, hash } }. hash = Prüfsumme des Inhalts beim Prüfen;
// ändert sich der Inhalt danach, gilt der Vermerk als veraltet (wirksame Stufe 0), bis jemand neu prüft.
// Aufruf:
//   node quellen/pruefstand.js                       Übersicht je Bereich, veraltete Vermerke
//   node quellen/pruefstand.js liste werkstatt       alle IDs eines Bereichs mit Stufe
//   node quellen/pruefstand.js setzen --stufe 2 --pruefer "Name" werkstatt:w-nomen sachkunde:jahreszeiten …
// Im Repo stehen keine Namen von Kindern; als Prüfer genügt ein Kürzel.
const fs = require("fs"), path = require("path"), vm = require("vm"), crypto = require("crypto");
const WURZEL = path.join(__dirname, ".."), DATEI = path.join(__dirname, "pruefstand.json");
const STUFEN = ["Entwurf", "maschinell geprüft", "fachlich geprüft", "mit Kindern ausprobiert"];

function lade(dateien) {
  const ctx = vm.createContext({ console, setTimeout, Math, Date, JSON });
  ctx.window = ctx; ctx.globalThis = ctx;
  dateien.forEach(d => vm.runInContext(fs.readFileSync(path.join(WURZEL, d), "utf8"), ctx, { filename: d }));
  return ctx;
}
// Bereiche: Name → Liste von { id, inhalt } (inhalt = das, was geprüft wird; Funktionen als Quelltext)
function bereiche() {
  const w = lade(["spiele/mathe/aufgaben.js", "spiele/mathe/fehler.js", "spiele/mathe/erklaeren.js", "spiele/deutsch/werkstatt.js", "spiele/sachkunde/themen.js",
    "spiele/sachkunde/faecher.js", "spiele/sachkunde/religion.js", "spiele/englisch/lektionen.js", "spiele/vorschule/aufgaben.js"]);
  const mathe = [].concat(w.Mathe.STATIONEN_K1, w.Mathe.STATIONEN, w.Mathe.STATIONEN_K3, w.Mathe.STATIONEN_K4, w.Mathe.STATIONEN_K5);
  return {
    mathe: { name: "Mathe-Stationen", liste: mathe.map(s => ({ id: s.id, inhalt: s })) },
    erklaeren: { name: "Mathe: Erklär-Einheiten", liste: Object.keys(w.MatheErklaeren.ERKLAERUNGEN).map(id => ({ id, inhalt: w.MatheErklaeren.ERKLAERUNGEN[id] })) },
    denkfehler: { name: "Mathe: Denkfehler-Katalog", liste: w.MatheFehler.KATALOG.map(f => ({ id: f.id, inhalt: f })) },
    werkstatt: { name: "Deutsch: Werkstatt-Kapitel", liste: w.WERKSTATT.map(k => ({ id: k.id, inhalt: k })) },
    sachkunde: { name: "Sachunterricht: Themen", liste: w.THEMEN.map(t => ({ id: t.id, inhalt: t })) },
    faecher: { name: "Weitere Fächer und Religion", liste: (w.FACH_THEMEN || []).map(t => ({ id: t.id, inhalt: t })) },
    englisch: { name: "Englisch: Lektionen", liste: w.ENGLISCH.map(l => ({ id: l.id, inhalt: l })) },
    vorschule: { name: "Vorschul-Rucksack", liste: w.VORSCHULE.map(v => ({ id: v.id, inhalt: v })) }
  };
}
const text = (x) => JSON.stringify(x, (k, v) => typeof v === "function" ? v.toString() : v);
const hash = (x) => crypto.createHash("sha256").update(text(x)).digest("hex").slice(0, 12);
const vermerke = () => (fs.existsSync(DATEI) ? JSON.parse(fs.readFileSync(DATEI, "utf8")) : {});
// wirksame Stufe: Vermerk nur, wenn der Inhalt seitdem gleich geblieben ist
function stufe(v, schluessel, inhalt) { const e = v[schluessel]; if (!e) return { s: 0 }; return e.hash === hash(inhalt) ? { s: e.stufe, e } : { s: 0, alt: e }; }

function uebersicht() {
  const B = bereiche(), v = vermerke(), zeilen = [], veraltet = [];
  let gesamt = 0, geprueft = 0;
  for (const [key, b] of Object.entries(B)) {
    const z = [0, 0, 0, 0];
    b.liste.forEach(x => { const st = stufe(v, key + ":" + x.id, x.inhalt); z[st.s]++; if (st.alt) veraltet.push(key + ":" + x.id); });
    gesamt += b.liste.length; geprueft += z[2] + z[3];
    zeilen.push(`${b.name.padEnd(30)} ${String(b.liste.length).padStart(4)}   ${z.map(n => String(n).padStart(4)).join("   ")}`);
  }
  const bekannt = new Set(Object.entries(B).flatMap(([k, b]) => b.liste.map(x => k + ":" + x.id)));
  const verwaist = Object.keys(v).filter(k => !bekannt.has(k));
  console.log(`Prüfstand der Lerninhalte (Stufen: ${STUFEN.map((s, i) => i + " = " + s).join(", ")})\n`);
  console.log(`${"Bereich".padEnd(30)} ${"Anz.".padStart(4)}   ${["St.0", "St.1", "St.2", "St.3"].join("   ")}`);
  zeilen.forEach(z => console.log(z));
  console.log(`\nVon einem Menschen geprüft (Stufe 2 oder 3): ${geprueft} von ${gesamt} (${Math.round(geprueft / gesamt * 100)} %).`);
  if (veraltet.length) console.log(`Veraltet (Inhalt nach dem Prüfen geändert, bitte neu prüfen): ${veraltet.join(", ")}`);
  if (verwaist.length) console.log(`Vermerke ohne Inhalt (gelöscht oder umbenannt): ${verwaist.join(", ")}`);
  return { gesamt, geprueft, veraltet, verwaist };
}
function liste(key) {
  const b = bereiche()[key], v = vermerke(); if (!b) { console.log("Unbekannter Bereich. Bereiche: " + Object.keys(bereiche()).join(", ")); process.exitCode = 1; return; }
  b.liste.forEach(x => { const st = stufe(v, key + ":" + x.id, x.inhalt); console.log(`${String(st.s).padStart(2)}  ${key}:${x.id}${st.e ? `  (${st.e.pruefer}, ${st.e.am})` : st.alt ? "  (veraltet)" : ""}`); });
}
function setzen(args) {
  const i = args.indexOf("--stufe"), j = args.indexOf("--pruefer"), s = +args[i + 1], wer = j >= 0 ? args[j + 1] : "";
  if (!(s >= 0 && s <= 3) || !wer) { console.log('Aufruf: setzen --stufe 0-3 --pruefer "Kürzel" bereich:id …'); process.exitCode = 1; return; }
  const ids = args.filter((a, k) => !a.startsWith("--") && k !== i + 1 && k !== j + 1);
  const B = bereiche(), v = vermerke(), heute = new Date().toISOString().slice(0, 10);
  for (const id of ids) {
    const [key, ...rest] = id.split(":"), x = B[key] && B[key].liste.find(y => y.id === rest.join(":"));
    if (!x) { console.log("Unbekannt: " + id); process.exitCode = 1; continue; }
    if (s === 0) delete v[id]; else v[id] = { stufe: s, pruefer: wer, am: heute, hash: hash(x.inhalt) };
    console.log(`${id} → Stufe ${s} (${STUFEN[s]})`);
  }
  fs.writeFileSync(DATEI, JSON.stringify(v, null, 1) + "\n");
}

if (require.main === module) {
  const [befehl, ...rest] = process.argv.slice(2);
  if (befehl === "liste") liste(rest[0]);
  else if (befehl === "setzen") setzen(rest);
  else uebersicht();
}
module.exports = { bereiche, vermerke, stufe, hash, uebersicht };
