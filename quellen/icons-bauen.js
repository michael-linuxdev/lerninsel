// Baut die eigenen Bilder (Ersatz für Emojis) aus quellen/icons/<teil>.js:
//   node quellen/icons-bauen.js              → shared/icons.js + quellen/icons/bogen.html
//   node quellen/icons-bauen.js --teil tiere → nur quellen/icons/bogen-tiere.html
// Stil und Format: quellen/icons/STIL.md. G(#hex) = runder Verlauf, V(#hex) = Verlauf von oben.
const fs = require("fs"), path = require("path");
const WURZEL = path.resolve(__dirname, ".."), ORDNER = path.join(__dirname, "icons");
const liste = JSON.parse(fs.readFileSync(path.join(ORDNER, "liste.json"), "utf8"));
const arg = process.argv.indexOf("--teil"), nurTeil = arg > 0 ? process.argv[arg + 1] : null;

const hexOf = (e) => [...e].filter(c => c !== "️").map(c => c.codePointAt(0).toString(16)).join("-");
const hell = (hex, k) => { const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, m = (c) => Math.round(c + (255 - c) * k); return "#" + [m(r), m(g), m(b)].map(x => x.toString(16).padStart(2, "0")).join(""); };
const dunkel = (hex, k) => { const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, m = (c) => Math.round(c * (1 - k)); return "#" + [m(r), m(g), m(b)].map(x => x.toString(16).padStart(2, "0")).join(""); };

// Inhalt → fertiges SVG mit Verläufen (ids je Bild eindeutig: i<hex>-<n>)
function baue(hex, inhalt) {
  const defs = [], schon = new Map();
  const verlauf = (art, farbe) => {
    const k = art + farbe.toLowerCase(); if (schon.has(k)) return `url(#${schon.get(k)})`;
    const id = `i${hex}-${defs.length}`; schon.set(k, id);
    defs.push(art === "G"
      ? `<radialGradient id="${id}" cx="35%" cy="28%" r="85%"><stop offset="0" stop-color="${hell(farbe, 0.38)}"/><stop offset=".55" stop-color="${farbe}"/><stop offset="1" stop-color="${dunkel(farbe, 0.14)}"/></radialGradient>`
      : `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hell(farbe, 0.3)}"/><stop offset="1" stop-color="${dunkel(farbe, 0.1)}"/></linearGradient>`);
    return `url(#${id})`;
  };
  // Kurzzeichen: $K = Kontur einer Fläche, $L = Linie (ohne Füllung) – beide in #3B1F63 (Stil A)
  inhalt = inhalt.replace(/\$K/g, ' stroke="#3B1F63" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"')
    .replace(/\$L/g, ' stroke="#3B1F63" stroke-width="3" fill="none" stroke-linejoin="round" stroke-linecap="round"');
  const koerper = inhalt.replace(/\b([GV])\((#[0-9a-fA-F]{6})\)/g, (_, a, f) => verlauf(a, f)).replace(/\s+/g, " ").trim();
  return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${defs.length ? `<defs>${defs.join("")}</defs>` : ""}${koerper}</svg>`;
}
// sehr einfache Prüfung: Tags ausgeglichen, keine verbotenen Teile
function pruefe(svg) {
  const fehler = [], stapel = [];
  for (const m of svg.matchAll(/<(\/?)([a-zA-Z][\w:-]*)([^>]*?)(\/?)>/g)) {
    const [, zu, tag, , selbst] = m;
    if (selbst) continue; if (!zu) stapel.push(tag); else if (stapel.pop() !== tag) { fehler.push("Tags nicht ausgeglichen bei </" + tag + ">"); break; }
  }
  if (stapel.length) fehler.push("offen: " + stapel.join(","));
  if (/<script|on\w+=|href=["']https?:/i.test(svg)) fehler.push("verbotener Inhalt");
  return fehler;
}

const teile = Object.keys(liste).filter(t => !nurTeil || t === nurTeil);
const alle = {}, fehlt = [], warn = [];
// Alle Bild-Dateien im Ordner zusammenführen (Teil-Dateien und Pakete wie paket1.js); bei doppelten Schlüsseln gewinnt die spätere Datei (alphabetisch)
const norm = {};
fs.readdirSync(ORDNER).filter(f => f.endsWith(".js")).sort().forEach(f => {
  const datei = path.join(ORDNER, f); delete require.cache[require.resolve(datei)];
  Object.entries(require(datei)).forEach(([k, v]) => { norm[k.replace(/\uFE0F/g, "")] = v; });
});
for (const t of teile) {
  for (const [e, name] of liste[t]) {
    const inhalt = norm[e.replace(/️/g, "")];
    if (!inhalt) { fehlt.push(`${t}: ${e} ${name}`); continue; }
    const hex = hexOf(e), svg = baue(hex, inhalt), f = pruefe(svg);
    if (f.length) warn.push(`${t}: ${e} ${name}: ${f.join("; ")}`);
    if (inhalt.length > 1600) warn.push(`${t}: ${e} ${name}: ${inhalt.length} Zeichen (Richtwert 1500)`);
    alle[hex] = { e, name, t, svg };
  }
}
// Prüfbogen
const bogen = `<!doctype html><meta charset="utf-8"><title>Bilder ${nurTeil || "alle"}</title>
<style>body{font-family:Fredoka,system-ui,sans-serif;background:#F3F6FB;margin:12px;color:#2D3350}.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:8px}
.b{background:#fff;border-radius:14px;padding:6px;text-align:center;font-size:11px;box-shadow:0 4px 12px rgba(40,50,90,.06)}.b svg{width:64px;height:64px;display:block;margin:auto}
.k{display:flex;justify-content:center;gap:6px;align-items:center;margin-top:2px}.k svg{width:24px;height:24px;display:inline-block;margin:0}.k span{font-size:22px}</style>
<h1 style="margin:0 0 8px;font-size:18px">${Object.keys(alle).length} Bilder ${nurTeil ? "(" + nurTeil + ")" : ""}${fehlt.length ? ` – ${fehlt.length} fehlen` : ""}</h1><div class="g">${
  Object.values(alle).map(x => `<div class="b">${x.svg}<div class="k">${x.svg}<span>${x.e}</span></div>${x.name}</div>`).join("")}</div>`;
fs.writeFileSync(path.join(ORDNER, nurTeil ? `bogen-${nurTeil}.html` : "bogen.html"), bogen);
if (!nurTeil) {
  const js = `// GEBAUT von quellen/icons-bauen.js – nicht von Hand ändern. Eigene Bilder statt Emojis (Stil B), Schlüssel = Codepunkte in hex ohne FE0F.\n` +
    `window.LERN_ICONS = ${JSON.stringify(Object.fromEntries(Object.entries(alle).map(([h, x]) => [h, x.svg])))};\n`;
  fs.writeFileSync(path.join(WURZEL, "shared/icons.js"), js);
}
console.log(`${Object.keys(alle).length} Bilder gebaut${nurTeil ? " (" + nurTeil + ")" : ""}; fehlen: ${fehlt.length}; Warnungen: ${warn.length}`);
if (warn.length) console.log("Warnungen:\n  " + warn.slice(0, 40).join("\n  "));
if (fehlt.length && (nurTeil || process.argv.includes("--fehlt"))) console.log("Fehlen:\n  " + fehlt.slice(0, 200).join("\n  "));
