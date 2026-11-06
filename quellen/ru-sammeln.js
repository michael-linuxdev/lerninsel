// Sammelt alle russischen Texte (Entwürfe) aus den ausgelieferten JS-Dateien für die Prüfliste spiele/eltern/russisch-pruefen.html (10.11.2026).
// Je Zeichenkette mit kyrillischen Buchstaben: Datei, Zeile, der russische Text und – als Hilfe für die Prüfung – die deutsche Zeichenkette direkt
// davor in derselben Zeile (oder in der Zeile davor). Schlüssel ist eine Prüfsumme des russischen Texts: Ändert sich der Text, gilt ein alter Haken nicht mehr.
// Aufruf: node quellen/ru-sammeln.js  (läuft in quellen/dev-bauen.sh) → schreibt spiele/eltern/ru-texte.js
const fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const ORDNER = ["shared", "spiele", "inhalte"], AUS = /(^|\/)(welt3d|pixel)(\/|$)|ru-texte\.js$|\.min\.js$/;
const KYR = /[А-Яа-яЁё]/;
function dateien(d) { return fs.readdirSync(path.join(WURZEL, d), { withFileTypes: true }).flatMap(e => { const p = path.join(d, e.name); return e.isDirectory() ? dateien(p) : /\.js$/.test(e.name) ? [p] : []; }); }
// Zeichenketten einer Zeile: "…", '…', `…` (ohne ${…}-Ausdrücke aufzulösen)
function ketten(zeile) {
  const aus = [], re = /"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g; let m;
  while ((m = re.exec(zeile))) aus.push({ t: (m[1] ?? m[2] ?? m[3]).replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\n/g, " "), pos: m.index });
  return aus;
}
const hash = (t) => { let h = 2166136261; for (const c of t) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; } return h.toString(36); };
const istDeutsch = (t) => /[A-Za-zÄÖÜäöüß]{3}/.test(t) && !KYR.test(t) && !/^[a-z0-9_.\-]+$/.test(t) && !/^[#.\[:]/.test(t.trim()) && !/[{}]$/.test(t.trim());
const ANDERE = new Set(["uk", "ar", "tr", "pl", "fa", "so", "hsb", "en"]);
const DE_SCHLUESSEL = ["de", "wort", "name", "text", "frage", "satz", "t", "titel", "kurz", "warum"];
// Wert eines deutschen Schlüssels (de: "hallo"): auch kleine Einzelwörter zählen, nur keine Kennungen mit Punkt/Unterstrich
const deWert = (t) => !!t && /[A-Za-zÄÖÜäöüß]/.test(t) && !KYR.test(t) && !/[._]/.test(t);
// Wert eines Schlüssels in derselben Zeile (erste Zeichenkette nach „schluessel:“)
const wertVon = (zeile, k, vor) => { const m = new RegExp(`(?:^|[\\s{,])${k}\\s*:\\s*("((?:[^"\\\\]|\\\\.)*)"|'((?:[^'\\\\]|\\\\.)*)'|\`((?:[^\`\\\\]|\\\\.)*)\`)`, "g"); let r, best = "";
  while ((r = m.exec(zeile))) { if (r.index > vor) break; best = r[2] ?? r[3] ?? r[4]; } return best; };
const liste = [], gesehen = new Set();
ORDNER.flatMap(dateien).filter(f => !AUS.test(f)).sort().forEach(f => {
  const z = fs.readFileSync(path.join(WURZEL, f), "utf8").split("\n");
  z.forEach((zeile, i) => {
    if (!KYR.test(zeile)) return;
    const k = ketten(zeile);
    k.forEach((s, j) => {
      if (!KYR.test(s.t) || /[іїєґІЇЄҐ]/.test(s.t)) return;   // Ukrainisch nicht mitzählen
      const schl = (zeile.slice(0, s.pos).match(/(\w+)\s*:\s*$/) || [])[1] || "";
      if (ANDERE.has(schl)) return;
      const ru = s.t.trim(); if (ru.length < 2) return;
      let de = "";
      if (/Ru$/.test(schl)) de = wertVon(zeile, schl.slice(0, -2), s.pos);
      if (!de && schl === "ru") for (const d of DE_SCHLUESSEL) { const w = wertVon(zeile, d, s.pos); if (deWert(w)) { de = w; break; } }
      for (let x = j - 1; x >= 0 && !de; x--) if (istDeutsch(k[x].t)) de = k[x].t;
      if (!de && i > 0) { const v = ketten(z[i - 1]).filter(x => istDeutsch(x.t)); if (v.length) de = v[v.length - 1].t; }
      const h = hash(ru); if (gesehen.has(h)) return; gesehen.add(h);
      liste.push([f.replace(/\\/g, "/"), i + 1, h, ru, de.replace(/\\"/g, '"').trim()]);
    });
  });
});
const kopf = "// Erzeugt von quellen/ru-sammeln.js – nicht von Hand ändern. [Datei, Zeile, Schlüssel, Russisch, Deutsch davor]\n";
const inhalt = kopf + "window.RU_TEXTE = " + JSON.stringify(liste).replace(/\],\[/g, "],\n[") + ";\n", ziel = path.join(WURZEL, "spiele/eltern/ru-texte.js");
if (process.argv.includes("--pruefen")) {   // für tests/offline.js: ist die Datei aktuell?
  const alt = fs.existsSync(ziel) ? fs.readFileSync(ziel, "utf8") : "";
  if (alt !== inhalt) { console.error("spiele/eltern/ru-texte.js ist veraltet – node quellen/ru-sammeln.js ausführen (läuft auch in dev-bauen.sh)"); process.exit(1); }
  console.log("ru-texte.js aktuell"); process.exit(0);
}
fs.writeFileSync(ziel, inhalt);
const je = {}; liste.forEach(([f]) => { je[f] = (je[f] || 0) + 1; });
console.log(`Russische Texte: ${liste.length} (ohne Doppelte) in ${Object.keys(je).length} Dateien`);
if (process.argv.includes("-v")) Object.entries(je).sort((a, b) => b[1] - a[1]).forEach(([f, n]) => console.log(String(n).padStart(6), f));
