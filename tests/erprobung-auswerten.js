// Node-Test Auswertung Erprobung (Paket K, 12.11.2026): quellen/erprobung-auswerten.js liest Erprobungsdateien (Beispieldatei
// tests/daten/erprobung-beispiel.json und zwei hier erzeugte Dateien mit aktuellen Prüfsumme), schreibt den Bericht (Hänger, Fehlerquoten,
// Meldungen, Korrekturen, Technik) und übernimmt nur berechtigte Prüfungen in eine Kopie von quellen/pruefstand.json:
// Stufe 2 nur bei vollständiger fachlicher 👍-Abdeckung ohne offene ✏️/❓ und mit gleicher Prüfsumme, Stufe 3 nur mit einer ganzen Runde eines Kindes.
// Aufruf: node tests/erprobung-auswerten.js
const assert = require("assert"), fs = require("fs"), os = require("os"), path = require("path"), { execFileSync } = require("child_process");
const PS = require("../quellen/pruefstand.js");
const SKRIPT = path.join(__dirname, "../quellen/erprobung-auswerten.js");
let n = 0;
const pruefe = (name, fn) => { fn(); n++; console.log("  ✓ " + name); };
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "erprobung-"));
const B = PS.bereiche();
const V = B.vorschule.liste[0], W = B.werkstatt.liste.find(x => x.inhalt.schritte.length >= 5), M = B.mathe.liste[3], S = B.sachkunde.liste[0];
const h = (x) => PS.hash(x.inhalt);
let t = Date.parse("2026-11-12T09:00:00Z");
const e = (o) => Object.assign({ t: (t += 7000), seite: "spiele/mathe" }, o);
const kopf = (kuerzel, rollen, kind) => ({ format: "lerninsel-erprobung", version: 1, kuerzel, rollen, faecher: [], klassen: [], kindSpielt: kind,
  geraet: { ua: "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)", bildschirm: "820×1180", fenster: "820×1180", dpr: 2, touch: 5, sprache: "de-DE" },
  app: { version: "0.2.0", umgebung: "test", cache: "test-spielwelt-abc123" }, kind: { stufe: "1", land: "sn", hilfesprache: "" }, erstellt: "2026-11-12T10:00:00Z",
  von: "2026-11-12T09:00:00Z", bis: "2026-11-12T10:00:00Z", verworfen: 0, protokoll: [{ z: "2026-11-12T09:30:00Z", art: "fehler", text: "x is not defined (mathe/mathe.js:12)", seite: "spiele/mathe", n: 2 }] });
// Lehrkraft L1: Vorschul-Spiel ganz 👍, Mathe-Station 5 Aufgaben 👍, Werkstatt teilweise 👍 und ein ✏️, Sachthema 👍 mit alter Prüfsumme
const L1 = kopf("L1", ["lehrkraft", "ru"], false);
L1.eintraege = [].concat(
  V.inhalt.aufgaben.map((a, i) => e({ art: "pruefung", rolle: "fach", urteil: "ok", inhalt: "vorschule:" + V.id, schritt: String(i), h: h(V), fach: "vorschule", klasse: "vs" })),
  [1, 2, 3, 4, 5].map(s => e({ art: "pruefung", rolle: "fach", urteil: s === 2 ? "unklar" : "ok", inhalt: "mathe:" + M.id, schritt: "saat " + s, h: h(M) })),
  [e({ art: "pruefung", rolle: "fach", urteil: "ok", inhalt: "mathe:" + M.id, schritt: "saat 2", h: h(M) }), e({ art: "pruefung", rolle: "fach", urteil: "ok", inhalt: "mathe:" + M.id, schritt: "saat 6", h: h(M) })],
  W.inhalt.schritte.map((x, i) => e({ art: "pruefung", rolle: "fach", urteil: i === 3 ? "aendern" : "ok", korrektur: i === 3 ? "Lieber „die Katze“ statt „der Katze“" : undefined, text: "luecke: …", inhalt: "werkstatt:" + W.id, schritt: String(i), h: h(W) })),
  S.inhalt.schritte.map((x, i) => e({ art: "pruefung", rolle: "fach", urteil: "ok", inhalt: "sachkunde:" + S.id, schritt: String(i), h: "000000000000" })),
  [e({ art: "pruefung", rolle: "ru", urteil: "aendern", inhalt: "mathe:" + M.id, schritt: "saat 3", ruText: "Сколько это?", korrektur: "Сколько получится?", h: "abcdefabcdef" })]
);
// Kind K1 (Spieler/in, ein Kind spielt): ganze Runde im Vorschul-Spiel, Mathe mit Fehlern und langer Antwortzeit, Abbruch, Meldungen, Szene übersprungen
const K1 = kopf("K1", ["spieler"], true);
K1.eintraege = [
  e({ art: "seite", seite: "spiele/vorschule", ms: 410000 }),
  ...V.inhalt.aufgaben.map((a, i) => e({ art: "aufgabe", inhalt: "vorschule:" + V.id, schritt: String(i), antwort: "🍎", richtig: true, versuch: 1, ms: 4000, h: h(V) })),
  e({ art: "runde", inhalt: "vorschule:" + V.id, n: V.inhalt.aufgaben.length, beantwortet: V.inhalt.aufgaben.length, ms: 60000 }),
  e({ art: "aufgabe", inhalt: "mathe:" + M.id, schritt: "saat 9", text: "3 + 4", antwort: "8", richtig: false, versuch: 1, ms: 95000, hilfe: ["hoeren"], h: h(M) }),
  e({ art: "aufgabe", inhalt: "mathe:" + M.id, schritt: "saat 9", text: "3 + 4", antwort: "7", richtig: true, versuch: 2, ms: 3000, h: h(M) }),
  e({ art: "aufgabe", inhalt: "mathe:" + M.id, schritt: "saat 10", text: "5 + 4", antwort: "8", richtig: false, versuch: 1, ms: 5000, h: h(M) }),
  e({ art: "aufgabe", inhalt: "mathe:" + M.id, schritt: "saat 11", text: "6 + 4", antwort: "8", richtig: false, versuch: 1, ms: 5000, h: h(M) }),
  e({ art: "abbruch", inhalt: "werkstatt:" + W.id, n: 7, beantwortet: 2, schritt: "2", ms: 40000 }),
  e({ art: "szene", inhalt: "szene:fipsis-karte", uebersprungen: true }),
  e({ art: "meldung", kat: "schwer", text: "{name} wusste nicht, was ein Zehner ist", inhalt: "mathe:" + M.id, schritt: "saat 9", klasse: "1" }),
  e({ art: "meldung", kat: "schoen", text: "", seite: "insel", klasse: "1" }),
  e({ art: "technik", typ: "fehler", text: "x is not defined (mathe/mathe.js:12)", seite: "spiele/mathe" })
];
fs.writeFileSync(path.join(tmp, "lerninsel-erprobung-L1-2026-11-12.json"), JSON.stringify(L1));
fs.writeFileSync(path.join(tmp, "lerninsel-erprobung-K1-2026-11-12.json"), JSON.stringify(K1));
fs.writeFileSync(path.join(tmp, "kaputt.json"), "{\"format\":\"etwas anderes\"}");
const ps = path.join(tmp, "pruefstand.json"), bericht = path.join(tmp, "bericht.md");
fs.copyFileSync(path.join(__dirname, "../quellen/pruefstand.json"), ps);
const vorher = JSON.parse(fs.readFileSync(ps, "utf8"));
const beispiel = path.join(__dirname, "daten/erprobung-beispiel.json");

pruefe("Beispieldatei im Format „lerninsel-erprobung“ Version 1, ohne Namen", () => {
  const d = JSON.parse(fs.readFileSync(beispiel, "utf8"));
  assert.strictEqual(d.format, "lerninsel-erprobung"); assert.strictEqual(d.version, 1); assert.ok(d.eintraege.length >= 10);
  ["seite", "aufgabe", "runde", "abbruch", "meldung", "pruefung"].forEach(a => assert.ok(d.eintraege.some(e => e.art === a), a));
  assert.ok(!/Mira/.test(JSON.stringify(d)));
});
const aus = execFileSync("node", [SKRIPT, beispiel, ...["L1", "K1"].map(k => path.join(tmp, `lerninsel-erprobung-${k}-2026-11-12.json`)), path.join(tmp, "kaputt.json"),
  "--aus", bericht, "--pruefstand", "--pruefstand-datei", ps], { encoding: "utf8" });
const t2 = fs.readFileSync(bericht, "utf8"), nachher = JSON.parse(fs.readFileSync(ps, "utf8"));
pruefe("Skript läuft, liest drei Dateien, meldet die kaputte", () => {
  assert.ok(/Bericht: .*3 Dateien/.test(aus), aus);
  assert.ok(/## Nicht gelesen[\s\S]*kaputt\.json: kein Erprobungs-Format/.test(t2));
});
pruefe("Bericht: Dateien mit Rollen und Gerät", () => {
  assert.ok(/\| lerninsel-erprobung-L1-2026-11-12\.json \| L1 \| lehrkraft, ru \| nein \| 820×1180 \(iPad\/iPhone\)/.test(t2));
  assert.ok(/\| K1 \| spieler \| ja \|/.test(t2));
});
pruefe("Bericht: Hänger (lange Seite, lange Antwort, Abbruch, übersprungene Szene)", () => {
  assert.ok(/\| spiele\/vorschule \| 1 \| 6,8 min \| 6,8 min \| ⚠️ über 5 min \|/.test(t2));
  assert.ok(/\| K1 \| mathe:[^|]+ \| saat 9 \| 3 \+ 4 \| 1,6 min \| hoeren \|/.test(t2));
  assert.ok(new RegExp(`\\| werkstatt:${W.id} \\| 1 \\| 0 \\| 100 % \\| 2 von 7 \\| K1 \\|`).test(t2));
  assert.ok(/\| szene:fipsis-karte \| 1 \| 1 \|/.test(t2));
});
pruefe("Bericht: Fehlerquote je Inhalt (erster Versuch) und häufige falsche Antwort", () => {
  assert.ok(new RegExp(`\\| mathe:${M.id} \\| 3 \\| 0 % \\| 5 s \\| 33 % \\| aktuell \\|`).test(t2), t2.split("## Fehlerquoten")[1].slice(0, 600));
  assert.ok(new RegExp(`\\| mathe:${M.id} \\| 8 \\| 3 \\|`).test(t2));
});
pruefe("Bericht: Meldungen nach Kategorie, Korrekturen je Datei:Inhalt, Technik", () => {
  assert.ok(/### 🧗 Zu schwer \(2\)[\s\S]*\{name\} wusste nicht/.test(t2) && /### 💖 Schön \(1\)[\s\S]*\(ohne Text\)/.test(t2));
  assert.ok(new RegExp(`### L1:werkstatt:${W.id}[\\s\\S]*Fachlich ✏️ ändern\\*\\* \\(Schritt 3\\)[\\s\\S]*„Lieber „die Katze“ statt „der Katze““ · Prüfsumme aktuell`).test(t2));
  assert.ok(/Russisch ✏️ ändern\*\* \(Schritt saat 3\)[\s\S]*Text: „Сколько это\?“[\s\S]*„Сколько получится\?“/.test(t2));
  assert.ok(/\| fehler \| spiele\/mathe \| x is not defined \(mathe\/mathe\.js:12\) \| 5 \| K1, L1 \|/.test(t2));
});
pruefe("Prüfstand: Vorschul-Spiel → Stufe 3 (alle Schritte 👍 und eine Runde mit Kind), Prüfsumme gesetzt", () => {
  const v = nachher["vorschule:" + V.id];
  assert.ok(v && v.stufe === 3 && v.hash === h(V) && /L1/.test(v.pruefer) && /K1/.test(v.pruefer) && /^\d{4}-\d{2}-\d{2}$/.test(v.am), JSON.stringify(v));
  assert.strictEqual(PS.stufe(nachher, "vorschule:" + V.id, V.inhalt).s, 3);
});
pruefe("Prüfstand: Mathe-Station → Stufe 2 (❓ später durch 👍 ersetzt, 6 Aufgaben 👍)", () => {
  const v = nachher["mathe:" + M.id]; assert.ok(v && v.stufe === 2 && v.pruefer === "L1", JSON.stringify(v));
});
pruefe("Prüfstand: Werkstatt mit offenem ✏️ und Sachthema mit veralteter Prüfsumme bleiben ohne Vermerk", () => {
  assert.deepStrictEqual(nachher["werkstatt:" + W.id], vorher["werkstatt:" + W.id]);
  assert.deepStrictEqual(nachher["sachkunde:" + S.id], vorher["sachkunde:" + S.id]);
  assert.ok(new RegExp(`\\| werkstatt:${W.id} \\| 0 \\| 0 \\| 1 Schritt\\(e\\) mit ✏️/❓ offen`).test(t2));
  assert.ok(new RegExp(`\\| sachkunde:${S.id} \\| 0 \\| 0 \\| ${S.inhalt.schritte.length} Prüfung\\(en\\) veraltet`).test(t2));
});
pruefe("Prüfstand: ohne --pruefstand nur Vorschau, nichts geschrieben; Stufen werden nie gesenkt", () => {
  const ps2 = path.join(tmp, "ps2.json"); fs.writeFileSync(ps2, JSON.stringify({ ["vorschule:" + V.id]: { stufe: 3, pruefer: "X", am: "2026-11-01", hash: h(V) } }));
  const b = execFileSync("node", [SKRIPT, path.join(tmp, "lerninsel-erprobung-L1-2026-11-12.json"), "--pruefstand-datei", ps2], { encoding: "utf8" });
  assert.ok(/Vorschau – mit --pruefstand übernehmen/.test(b));
  const s2 = JSON.parse(fs.readFileSync(ps2, "utf8")); assert.strictEqual(Object.keys(s2).length, 1);
  execFileSync("node", [SKRIPT, path.join(tmp, "lerninsel-erprobung-L1-2026-11-12.json"), "--pruefstand", "--pruefstand-datei", ps2], { encoding: "utf8" });
  assert.strictEqual(JSON.parse(fs.readFileSync(ps2, "utf8"))["vorschule:" + V.id].stufe, 3);
});
pruefe("echte Prüfstand-Datei unverändert", () => {
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(path.join(__dirname, "../quellen/pruefstand.json"), "utf8")), vorher);
});
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`✅ Auswertung Erprobung: ${n} Prüfungen bestanden.`);
