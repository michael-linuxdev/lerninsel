// Probe „Pixel-Abenteuer“ mit PixiJS im Stil der Handheld-Abenteuer der DS-Zeit (Draufsicht, 16×16-Raster):
// alles eigene Zeichnungen aus dem Code (keine fremden Kacheln oder Figuren). Kind läuft in vier Richtungen.
// Zeichenweg (Stand 27.10.2026, „DS-Look“, Regeln in docs/GRAFIK.md Abschnitt 2):
//   1. Formen in einen kleinen Pixelpuffer malen – jede Farbe ist eine Stufe (0 dunkel … 4 hell) aus einer Farbreihe in PAL.
//   2. Licht kommt immer von oben links; Kugeln/Zylinder/Flächen werden danach schattiert, Zwischenstufen gerastert (Bayer 4×4).
//   3. Automatischer Umriss in der dunkelsten Stufe der Nachbarfarbe (farbiger Umriss statt Schwarz).
//   4. Alle Dinge und Figuren landen in EINEM Bildatlas, der Boden in einem großen Bild (zwei Bilder für Wasser/Blumen).
//   Einzige Halbtransparenz: Schatten unter Dingen und ziehende Wolkenschatten.
import { messung } from "./gemeinsam.js";
import { Application, Container, Sprite, Texture, TextureSource, Rectangle, UPDATE_PRIORITY } from "pixi.js";

TextureSource.defaultOptions.scaleMode = "nearest";
const BUEHNE = document.getElementById("buehne");
const app = new Application();
await app.init({ resizeTo: BUEHNE, background: "#2459B8", antialias: false, roundPixels: true, resolution: Math.min(devicePixelRatio || 1, 2), autoDensity: true, preference: "webgl" });
BUEHNE.appendChild(app.canvas);

// ---------- Farbreihen: je 5 Stufen, dunkel → hell (Schatten kühl, Licht warm) ----------
const PAL = {
  gras: ["#1F5B45", "#2F7D44", "#4DA546", "#7CCB4F", "#B4E66A"],
  laub: ["#173F3A", "#235F3C", "#36843F", "#5BAA45", "#94D05A"],
  tanne: ["#12343A", "#1B4D46", "#26694F", "#3A8A5A", "#62AE6A"],
  sand: ["#A8784E", "#C9A06A", "#E2C487", "#F2DCA6", "#FCF0CC"],
  weg: ["#8C6448", "#B08660", "#CFA97C", "#E6C79A", "#F5E2BC"],
  wasser: ["#1D3E8C", "#2459B8", "#3383D9", "#5BB0EE", "#A6DDF8"],
  holz: ["#4A2A22", "#6E3F2A", "#93603A", "#B8834E", "#D9A86A"],
  dach: ["#5A1E36", "#8E2A3A", "#C43F3F", "#E8684A", "#F7A06A"],
  wand: ["#7A5E5A", "#B5937E", "#DDBF9C", "#F2DDB8", "#FFF4DA"],
  stein: ["#3C3E5A", "#5E6282", "#8489A8", "#AEB4CA", "#DCE2EE"],
  haut: ["#7A4038", "#B8705A", "#E3A07E", "#F6C9A2", "#FFE6CC"],
  haar: ["#3A2026", "#5E3428", "#8A5232", "#B37A46", "#D9A666"],
  rosa: ["#6A2A55", "#A83E78", "#E0609A", "#F592BC", "#FFC6DC"],
  lila: ["#2E2458", "#4A3A8A", "#6C58B8", "#9580DA", "#C2B4F2"],
  orange: ["#6A2E22", "#A84A26", "#E07432", "#F7A04A", "#FFD07A"],
  creme: ["#8A7466", "#BFA996", "#E6D6C2", "#F7EEE0", "#FFFFFF"],
  rot: ["#5A1A2A", "#9A2A34", "#D8443E", "#F27A5E", "#FFB28A"],
  gelb: ["#7A5A1E", "#B88A22", "#E8B830", "#F8DC58", "#FFF29A"],
  blau: ["#1E2A6A", "#2E44A4", "#4A6AD8", "#7A9AF0", "#B4CCFF"],
  glas: ["#2A4A7A", "#3E78B0", "#62A6DA", "#9ACEF2", "#E0F4FF"],
  dunkel: ["#141024", "#221A34", "#30283A", "#4A4058", "#6A6078"],
  weiss: ["#9AA4C0", "#C4CCE0", "#E4EAF4", "#F4F8FC", "#FFFFFF"]
};
const RGB = [], REIHE = [], NR = {};
Object.entries(PAL).forEach(([n, r]) => { NR[n] = RGB.length; r.forEach(h => { RGB.push([parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]); REIHE.push(n); }); });
const farbe = (reihe, stufe) => NR[reihe] + Math.max(0, Math.min(4, stufe));

// ---------- Hilfen: Zufall, Rauschen, Rasterung ----------
const hash = (x, y, s = 0) => { let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s, 982451653)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
const glatt = t => t * t * (3 - 2 * t);
function rauschen(x, y, gr, s = 0) {
  const fx = x / gr, fy = y / gr, ix = Math.floor(fx), iy = Math.floor(fy), tx = glatt(fx - ix), ty = glatt(fy - iy);
  const a = hash(ix, iy, s), b = hash(ix + 1, iy, s), c = hash(ix, iy + 1, s), d = hash(ix + 1, iy + 1, s);
  return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
}
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);
// nur ein schmaler gerasterter Übergang zwischen zwei Stufen (klare Flächen wie bei DS-Grafik)
const raster = (v, x, y) => { const b = Math.floor(v), f = Math.min(1, Math.max(0, (v - b - 0.5) * 2.6 + 0.5)); return f > BAYER[(y & 3) * 4 + (x & 3)] ? b + 1 : b; };

// ---------- Pixelpuffer und Formen ----------
const bild = (b, h) => ({ b, h, p: new Int16Array(b * h).fill(-1) });
function setze(B, x, y, reihe, stufe) { if (x >= 0 && y >= 0 && x < B.b && y < B.h) B.p[y * B.b + x] = farbe(reihe, stufe); }
// füllt alle Pixel, deren Mitte „drin“ ist; licht(x, y) liefert eine Stufe als Kommazahl (wird gerastert)
function fuelle(B, x0, y0, x1, y1, drin, reihe, licht) {
  for (let y = Math.max(0, Math.floor(y0)); y <= Math.min(B.h - 1, Math.ceil(y1)); y++)
    for (let x = Math.max(0, Math.floor(x0)); x <= Math.min(B.b - 1, Math.ceil(x1)); x++)
      if (drin(x + 0.5, y + 0.5)) setze(B, x, y, reihe, typeof licht === "number" ? licht : raster(licht(x + 0.5, y + 0.5), x, y));
}
const LX = -0.55, LY = -0.65, LZ = 0.52; // Licht von oben links
function kugel(B, cx, cy, rx, ry, reihe, lo = 1, hi = 4) {
  fuelle(B, cx - rx - 1, cy - ry - 1, cx + rx + 1, cy + ry + 1, (x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1, reihe, (x, y) => {
    const nx = (x - cx) / rx, ny = (y - cy) / ry, nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
    return lo + (hi - lo + 0.99) * Math.min(1, Math.max(0, LX * nx + LY * ny + LZ * nz) * 1.1);
  });
}
const rect = (B, x, y, b, h, reihe, stufe) => fuelle(B, x, y, x + b - 1, y + h - 1, (px, py) => px >= x && px < x + b && py >= y && py < y + h, reihe, stufe);
// senkrechter Zylinder (Stamm, Pfosten): links hell, rechts dunkel
const zylinder = (B, x, y, b, h, reihe, lo = 0.6, hi = 3.6) => fuelle(B, x, y, x + b - 1, y + h - 1, (px, py) => px >= x && px < x + b && py >= y && py < y + h, reihe, px => hi - (hi - lo) * (px - x) / b);
function vieleck(B, pkt, reihe, licht) {
  const xs = pkt.map(p => p[0]), ys = pkt.map(p => p[1]);
  const drin = (x, y) => { let c = false; for (let i = 0, j = pkt.length - 1; i < pkt.length; j = i++) { const [xi, yi] = pkt[i], [xj, yj] = pkt[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  fuelle(B, Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), drin, reihe, licht);
}
// farbiger Umriss: leere Pixel neben gefüllten bekommen die dunkelste Stufe der Nachbarfarbe
function umriss(B) {
  const { b, h, p } = B, q = Int16Array.from(p);
  for (let y = 0; y < h; y++) for (let x = 0; x < b; x++) {
    if (p[y * b + x] >= 0) continue;
    for (const [dx, dy] of [[0, 1], [1, 0], [-1, 0], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= b || ny >= h) continue;
      const n = p[ny * b + nx]; if (n >= 0) { q[y * b + x] = farbe(REIHE[n] === "weiss" ? "dunkel" : REIHE[n], 0); break; }
    }
  }
  B.p = q; return B;
}

// ---------- Bildatlas: alle Dinge und Figuren in einer Textur (1 Zeichenaufruf) ----------
const ATLAS = [];
const merke = (B, mitUmriss = true) => { const e = { B: mitUmriss ? umriss(B) : B, tex: null }; ATLAS.push(e); return e; };
function packe() {
  const BR = 512; let x = 0, y = 0, zeile = 0;
  ATLAS.forEach(e => { if (x + e.B.b > BR) { x = 0; y += zeile + 1; zeile = 0; } e.x = x; e.y = y; x += e.B.b + 1; zeile = Math.max(zeile, e.B.h); });
  const c = document.createElement("canvas"); c.width = BR; c.height = y + zeile;
  const g = c.getContext("2d"), d = g.createImageData(c.width, c.height);
  ATLAS.forEach(e => { for (let j = 0; j < e.B.h; j++) for (let i = 0; i < e.B.b; i++) { const f = e.B.p[j * e.B.b + i]; if (f < 0) continue; const k = ((e.y + j) * c.width + e.x + i) * 4; [d.data[k], d.data[k + 1], d.data[k + 2]] = RGB[f]; d.data[k + 3] = 255; } });
  g.putImageData(d, 0, 0);
  const quelle = Texture.from(c).source;
  ATLAS.forEach(e => { e.tex = new Texture({ source: quelle, frame: new Rectangle(e.x, e.y, e.B.b, e.B.h) }); });
}

// ---------- Dinge ----------
function laubbaum(fruechte) {
  const B = bild(34, 44);
  // Wurzeln und Stamm
  vieleck(B, [[11, 42], [14, 36], [20, 36], [23, 42]], "holz", x => 3.4 - (x - 11) / 12 * 2.8);
  zylinder(B, 14, 27, 6, 13, "holz");
  // Krone: dunkle Grundkugel, darauf Büschel – jedes von oben links beleuchtet
  kugel(B, 17, 18, 15, 12.5, "laub", 0.6, 2.2);
  [[11, 13, 7, 6], [21, 11, 7, 6], [16, 7, 7, 5.5], [8, 20, 6, 5], [25, 19, 6, 5], [16, 18, 8, 6]].forEach(([x, y, rx, ry]) => kugel(B, x, y, rx, ry, "laub", 1.3, 4));
  if (fruechte) [[9, 17], [22, 14], [18, 23], [26, 22], [13, 9]].forEach(([x, y]) => { kugel(B, x, y, 1.8, 1.8, "rot", 1, 4); setze(B, x - 1, y - 1, "rot", 4); });
  else [[12, 10], [20, 8], [24, 17], [9, 18]].forEach(([x, y]) => { setze(B, x, y, "laub", 4); setze(B, x + 1, y, "laub", 4); });
  return B;
}
function tanne() {
  const B = bild(26, 44);
  zylinder(B, 11, 34, 4, 8, "holz");
  [[13, 35, 12, 9], [13, 27, 10, 9], [13, 19, 8, 8], [13, 11, 6, 7], [13, 4, 3.5, 4]].forEach(([x, y, b, h]) =>
    vieleck(B, [[x - b, y], [x, y - h - 2], [x + b, y]], "tanne", (px, py) => 3.9 - (px - (x - b)) / (2 * b) * 2.6 - (py > y - 2 ? 1 : 0)));
  return B;
}
function haus() {
  const B = bild(66, 62);
  // Sockel, Wand, Balken
  rect(B, 7, 54, 52, 4, "stein", 2); rect(B, 7, 54, 52, 1, "stein", 3);
  fuelle(B, 8, 28, 57, 53, () => true, "wand", (x, y) => 3.4 - (x - 8) / 50 * 1.2 - (y < 33 ? 1.6 : 0));
  [8, 32, 57].forEach(x => zylinder(B, x - 1, 30, 3, 24, "holz", 1, 3));
  // Fenster mit Spiegelung und Blumenkasten
  [[13, 37], [42, 37]].forEach(([x, y]) => {
    rect(B, x - 1, y - 1, 13, 12, "weiss", 3);
    fuelle(B, x, y, x + 10, y + 9, () => true, "glas", (px, py) => ((px - x) - (py - y) + 12) % 9 < 2 ? 4 : 2.2 + (py - y) / 9);
    rect(B, x + 5, y, 1, 10, "weiss", 4); rect(B, x, y + 4, 11, 1, "weiss", 4);
    rect(B, x - 1, y + 11, 13, 3, "holz", 2); rect(B, x - 1, y + 11, 13, 1, "holz", 3);
    for (let i = 0; i < 6; i++) { const f = ["rot", "gelb", "rosa"][i % 3]; setze(B, x + i * 2, y + 10, f, 3); setze(B, x + i * 2 + 1, y + 9, f, 4); setze(B, x + i * 2, y + 9, "laub", 2); }
  });
  // Tür mit Rahmen, Glas und Klinke; Stufe davor
  rect(B, 27, 38, 11, 16, "holz", 0);
  fuelle(B, 28, 39, 36, 53, () => true, "holz", x => 3.2 - (x - 28) / 9 * 1.6);
  rect(B, 30, 41, 5, 4, "glas", 3); setze(B, 30, 41, "glas", 4); setze(B, 35, 47, "gelb", 4);
  rect(B, 25, 58, 15, 3, "stein", 3); rect(B, 25, 60, 15, 1, "stein", 1);
  // Dach: schräge Fläche mit Ziegelreihen, heller First, Schornstein
  zylinder(B, 44, 2, 7, 12, "stein", 1, 3.6); rect(B, 43, 1, 9, 2, "dunkel", 2);
  vieleck(B, [[1, 32], [10, 7], [56, 7], [65, 32]], "dach", (x, y) => { const reihe = Math.floor((y - 7) / 4), inReihe = (y - 7) % 4; return (inReihe === 3 ? 1 : 2.8 + (reihe % 2) * 0.4) - (x - 1) / 64 * 0.9 + (y < 10 ? 1.2 : 0); });
  for (let y = 11; y < 31; y += 4) for (let x = 4 + ((y / 4) % 2) * 3; x < 63; x += 6) setze(B, x, y, "dach", 1);
  return B;
}
function stein() { const B = bild(18, 14); kugel(B, 9, 8, 7.5, 5, "stein", 0.8, 4); setze(B, 10, 9, "stein", 0); setze(B, 11, 10, "stein", 0); setze(B, 6, 5, "weiss", 4); return B; }
function busch() {
  const B = bild(22, 17);
  kugel(B, 11, 10, 10, 6.5, "laub", 0.7, 2.4);
  [[7, 8, 5, 4], [15, 7, 5, 4], [11, 11, 6, 4]].forEach(([x, y, rx, ry]) => kugel(B, x, y, rx, ry, "laub", 1.4, 4));
  [[6, 10], [12, 6], [16, 11]].forEach(([x, y]) => { setze(B, x, y, "blau", 3); setze(B, x + 1, y, "blau", 2); });
  return B;
}
function schild() {
  const B = bild(18, 22);
  zylinder(B, 7, 9, 3, 12, "holz", 1, 3.5);
  fuelle(B, 1, 2, 16, 10, () => true, "holz", (x, y) => 3.6 - (y - 2) / 9 * 1.4);
  [4, 7].forEach(y => rect(B, 3, y, 12, 1, "holz", 1));
  return B;
}
// Kind (Mädchen mit langen Haaren): 3 Ansichten × 3 Bilder (stehen, linker Schritt, rechter Schritt)
function kind(r, s) {
  const B = bild(18, 29);
  const l = s === 1, rr = s === 2;
  // Beine und Schuhe
  if (r === "seite") {
    const hx = l ? 6 : rr ? 9 : 7, vx = l ? 10 : rr ? 7 : 9;
    rect(B, hx, 21, 2, 4, "haut", 2); rect(B, hx - 1, 25, 3, 2, "rot", 1);
    rect(B, vx, 21, 2, 4, "haut", 3); rect(B, vx, 25, 3, 2, "rot", 2); setze(B, vx + 1, 25, "rot", 3);
  } else {
    rect(B, 6, 21, 2, l ? 3 : 4, "haut", 3); rect(B, 6, l ? 24 : 25, 2, 2, "rot", 2); setze(B, 6, l ? 24 : 25, "rot", 3);
    rect(B, 10, 21, 2, rr ? 3 : 4, "haut", 2); rect(B, 10, rr ? 24 : 25, 2, 2, "rot", 2);
  }
  // Rock (Trapez, Saum hell) und Oberteil
  vieleck(B, [[4, 21.5], [6, 16], [12, 16], [14, 21.5]], "lila", (x, y) => (y > 20 ? 3.8 : 3.4) - (x - 4) / 10 * 1.8);
  fuelle(B, 5, 13, 12, 16, () => true, "rosa", x => 3.6 - (x - 5) / 8 * 1.6); rect(B, 6, 16, 6, 1, "rosa", 1);
  // Arme
  if (r === "seite") { const ax = l ? 10 : rr ? 7 : 8; rect(B, ax, 14, 2, 4, "rosa", 2); rect(B, ax, 18, 2, 1, "haut", 3); }
  else { rect(B, 3, 13, 2, 4, "rosa", 3); rect(B, 13, 13, 2, 4, "rosa", 2); rect(B, 3, rr ? 16 : 17, 2, 1, "haut", 3); rect(B, 13, l ? 16 : 17, 2, 1, "haut", 2); }
  // Kopf: Haare als Kugel, dann Gesicht
  if (r === "vorn") {
    rect(B, 2, 7, 3, 8, "haar", 1); rect(B, 13, 7, 3, 8, "haar", 1);
    kugel(B, 9, 6.5, 7.2, 6.4, "haar", 1, 4);
    fuelle(B, 3, 6, 15, 13, (x, y) => ((x - 9) / 5.6) ** 2 + ((y - 8.6) / 4.6) ** 2 <= 1 && y > 6 + (Math.floor(x) % 3 === 0 ? 1 : 0), "haut", x => 3.7 - (x - 3) / 12 * 1.2);
    [[6, 8], [11, 8]].forEach(([x, y]) => { setze(B, x, y, "dunkel", 0); setze(B, x, y + 1, "blau", 1); setze(B, x + 1, y, "weiss", 4); setze(B, x + 1, y + 1, "dunkel", 0); });
    setze(B, 5, 11, "rosa", 3); setze(B, 13, 11, "rosa", 3); setze(B, 9, 11, "rot", 2);
  } else if (r === "hinten") {
    rect(B, 3, 8, 12, 8, "haar", 1);
    kugel(B, 9, 7, 7.2, 6.8, "haar", 1, 4);
    fuelle(B, 3, 9, 15, 16, (x, y) => y < 16 - Math.abs(x - 9) * 0.3, "haar", x => 2.8 - (x - 3) / 12 * 1.4);
    rect(B, 8, 10, 3, 2, "rosa", 3); setze(B, 7, 10, "rosa", 2); setze(B, 11, 11, "rosa", 2);
  } else {
    rect(B, 3, 7, 4, 9, "haar", 1);
    kugel(B, 8.5, 6.5, 6.8, 6.4, "haar", 1, 4);
    fuelle(B, 8, 5, 16, 13, (x, y) => ((x - 10.8) / 4) ** 2 + ((y - 8.8) / 4.4) ** 2 <= 1 && y > 6, "haut", x => 3.8 - (x - 8) / 8);
    rect(B, 7, 6, 3, 7, "haar", 2);
    setze(B, 13, 8, "dunkel", 0); setze(B, 13, 9, "blau", 1); setze(B, 15, 10, "haut", 3); setze(B, 12, 11, "rosa", 3);
  }
  // Glanzbogen im Haar
  for (let x = 4; x < 14; x++) { const y = Math.round(3 + ((x - 8.5) / 6) ** 2 * 3); const f = B.p[y * B.b + x]; if (f >= 0 && REIHE[f] === "haar") setze(B, x, y, "haar", 4); }
  return B;
}
function fuchs(s) {
  const B = bild(26, 19);
  kugel(B, 5.5, 8, 4.8, 3.2, "orange", 1, 4); kugel(B, 2.6, 6.5, 2.2, 1.9, "creme", 2, 4);          // Schwanz mit heller Spitze
  const beine = s ? [[8, 14], [11, 15], [15, 15], [18, 14]] : [[8, 15], [11, 14], [15, 14], [18, 15]];
  beine.forEach(([x, y], i) => { rect(B, x, 13, 2, y - 12, "holz", i % 2 ? 0 : 1); });
  kugel(B, 13, 11, 6.5, 3.8, "orange", 1, 4); fuelle(B, 9, 12, 17, 14, (x, y) => ((x - 13) / 4.2) ** 2 + ((y - 13.4) / 1.6) ** 2 <= 1, "creme", 3);
  vieleck(B, [[16, 5.5], [17.2, 0.5], [19, 5]], "orange", 3.2); vieleck(B, [[19.5, 5], [21.5, 0.5], [22.5, 5.5]], "orange", 2.4);
  setze(B, 17, 3, "dunkel", 2); setze(B, 21, 3, "dunkel", 2);
  kugel(B, 19.5, 8, 4.3, 3.7, "orange", 1, 4);
  fuelle(B, 19, 8, 25, 12, (x, y) => ((x - 21.8) / 2.6) ** 2 + ((y - 10) / 1.7) ** 2 <= 1, "creme", x => 4 - (x - 19) / 6);
  setze(B, 24, 9, "dunkel", 0); setze(B, 20, 7, "dunkel", 0); setze(B, 20, 8, "dunkel", 1); setze(B, 21, 7, "weiss", 4);
  return B;
}
// Schatten (Ellipse, wird halbdurchsichtig und kühl eingefärbt gezeichnet)
const schattenBild = (b, h) => { const B = bild(b, h); fuelle(B, 0, 0, b, h, (x, y) => ((x - b / 2) / (b / 2)) ** 2 + ((y - h / 2) / (h / 2)) ** 2 <= 1, "dunkel", 0); return B; };
function wolkeBild() { const B = bild(96, 44); [[30, 24, 26, 15], [58, 20, 24, 15], [74, 27, 18, 11], [44, 30, 26, 11]].forEach(([x, y, rx, ry]) => fuelle(B, x - rx, y - ry, x + rx, y + ry, (px, py) => ((px - x) / rx) ** 2 + ((py - y) / ry) ** 2 <= 1, "dunkel", 0)); return B; }

const D = {
  baum: [merke(laubbaum(true)), merke(laubbaum(false))], tanne: merke(tanne()), haus: merke(haus()), stein: merke(stein()), busch: merke(busch()), schild: merke(schild()),
  schatten: { k: merke(schattenBild(12, 5), false), m: merke(schattenBild(20, 7), false), g: merke(schattenBild(28, 9), false), h: merke(schattenBild(58, 10), false) },
  wolke: merke(wolkeBild(), false)
};
const KIND = {}; ["vorn", "hinten", "seite"].forEach(r => { KIND[r] = [0, 1, 2].map(s => merke(kind(r, s))); });
const FUCHS = [merke(fuchs(0)), merke(fuchs(1))];
packe();

// ---------- Karte ----------
const BREITE = 40, HOEHE = 30, T = 16, cx = 20, cy = 15;
const landwert = (px, py) => ((px / T - cx) / 15) ** 2 + ((py / T - cy) / 11) ** 2 + (rauschen(px, py, 44, 1) - 0.5) * 0.2 + (rauschen(px, py, 11, 2) - 0.5) * 0.05;
const fest = new Set();
const wegFelder = new Set();
for (let y = 0; y < HOEHE; y++) for (let x = 0; x < BREITE; x++) if (landwert(x * T + 8, y * T + 8) >= 0.97) fest.add(y * BREITE + x);
// Weg von der Haustür nach unten und dann nach Osten
[[11, 13], [11, 14]].concat(Array.from({ length: 14 }, (_, i) => [12 + i, 14])).forEach(([x, y]) => wegFelder.add(y * BREITE + x));

// Boden als ein großes Bild (zwei Fassungen: Wasser und Blumen bewegen sich)
const RX = -10, RY = -6, RB = (BREITE + 20) * T, RH = (HOEHE + 12) * T;
const typ = new Uint8Array(RB * RH), lw = new Float32Array(RB * RH);   // 0 Wasser, 1 Sand, 2 Gras, 3 Weg
function wegNah(px, py) {
  const tx = Math.floor(px / T), ty = Math.floor(py / T); let best = 99;
  for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
    if (!wegFelder.has((ty + j) * BREITE + tx + i)) continue;
    const x0 = (tx + i) * T + 2, y0 = (ty + j) * T + 2, x1 = x0 + T - 4, y1 = y0 + T - 4;
    best = Math.min(best, Math.hypot(Math.max(x0 - px, 0, px - x1), Math.max(y0 - py, 0, py - y1)));
  }
  return best;
}
for (let y = 0; y < RH; y++) for (let x = 0; x < RB; x++) {
  const px = x + RX * T + 0.5, py = y + RY * T + 0.5, w = landwert(px, py), i = y * RB + x;
  lw[i] = w;
  typ[i] = w >= 1 ? 0 : w >= 0.72 ? 1 : wegNah(px, py) < 3 + (rauschen(px, py, 5, 3) - 0.5) * 3 ? 3 : 2;
}
const T_AT = (x, y) => (x < 0 || y < 0 || x >= RB || y >= RH) ? 0 : typ[y * RB + x];
// Grasbüschel-Muster: vier Fassungen je Kachel
const MUSTER = [0, 1, 2, 3].map(v => {
  const m = new Float32Array(T * T);
  for (let k = 0; k < 3; k++) {
    const bx = 1 + Math.floor(hash(v, k, 7) * 12), by = 2 + Math.floor(hash(v, k, 8) * 12);
    [[0, 1, -1], [2, 1, -1], [1, 0, -1], [0, 0, 1.2], [2, 0, 1.2], [1, -1, 1.2]].forEach(([dx, dy, d]) => { const xx = bx + dx, yy = by + dy; if (xx >= 0 && yy >= 0 && xx < T && yy < T) m[yy * T + xx] = d; });
  }
  return m;
});
const BLUMEN = ["rosa", "gelb", "weiss", "blau", "rot"];
function bodenBild(f) {
  const c = document.createElement("canvas"); c.width = RB; c.height = RH;
  const g = c.getContext("2d"), d = g.createImageData(RB, RH), out = d.data;
  for (let y = 0; y < RH; y++) for (let x = 0; x < RB; x++) {
    const i = y * RB + x, t = typ[i], px = x + RX * T, py = y + RY * T; let reihe, v;
    if (t === 0) {                                                   // Wasser: hell am Ufer, tief dunkel, Glitzern, Schaum
      const tiefe = lw[i] - 1, schaum = 0.03 + (f ? 0.014 : 0) * (0.6 + 0.4 * Math.sin(px * 0.4 + py * 0.2));
      if (tiefe < schaum) { reihe = "weiss"; v = tiefe < schaum * 0.5 ? 4 : 3; }
      else {
        reihe = "wasser"; v = Math.max(1.1, 3.3 - tiefe * 7);
        const gx = Math.floor((px + f * 5) / 14), gy = Math.floor(py / 10), hx = (px + f * 5) - gx * 14, hy = py - gy * 10;
        if (hash(gx, gy, 9) < 0.18 && hy === 4 && hx >= 3 && hx < 3 + 2 + Math.floor(hash(gx, gy, 10) * 4)) v = 4;
      }
    } else if (t === 1) {                                            // Sand: Schatten unter der Graskante, nasser Rand
      reihe = "sand"; v = 3 + (rauschen(px, py, 8, 4) - 0.5) * 0.5;
      if (lw[i] > 0.94) v = 2 - (lw[i] - 0.94) * 10;
      if (T_AT(x, y - 1) >= 2) v = 1.2; else if (T_AT(x, y - 2) >= 2) v = 2;
      const h = hash(px, py, 5); if (h < 0.02) v = 4; else if (h < 0.035) v = 1.5;
    } else if (t === 3) {                                            // Weg: Kieselchen, Schatten an der oberen Kante
      reihe = "weg"; v = 3 + (rauschen(px, py, 9, 6) - 0.5) * 0.5;
      if (T_AT(x, y - 1) === 2) v = 1.3; else if (T_AT(x, y - 2) === 2) v = 2.2;
      const kx = Math.floor(px / 6), ky = Math.floor(py / 5); if (hash(kx, ky, 11) < 0.22 && px % 6 < 2 && py % 5 === 2) v = px % 6 ? 1.5 : 4;
    } else {                                                         // Gras: große Flecken + Büschel, dunkle Kante
      reihe = "gras";
      const tx = Math.floor(px / T), ty = Math.floor(py / T), m = MUSTER[Math.floor(hash(tx, ty, 12) * 4)][(py - ty * T) * T + px - tx * T];
      // ruhige Flächen (keine Rasterung im Gras), nur Büschel und ein dunkleres Fleckenmuster
      const fleck = rauschen(px, py, 22, 6);
      v = (fleck < 0.3 ? 2 : 3) + (m > 0 ? 1 : m < 0 ? -1 : 0);
      if (T_AT(x + 1, y) !== 2 || T_AT(x - 1, y) !== 2 || T_AT(x, y + 1) !== 2 || T_AT(x, y - 1) !== 2) v = 1;
    }
    const k = farbe(reihe, raster(v, px, py)), o = i * 4;
    [out[o], out[o + 1], out[o + 2]] = RGB[k]; out[o + 3] = 255;
  }
  // Blumen auf manchen Graskacheln (wiegen sich im zweiten Bild)
  const punkt = (x, y, reihe, s) => { if (x < 0 || y < 0 || x >= RB || y >= RH || typ[y * RB + x] !== 2) return; const o = (y * RB + x) * 4; [out[o], out[o + 1], out[o + 2]] = RGB[farbe(reihe, s)]; };
  for (let ty = RY; ty < RY + HOEHE + 12; ty++) for (let tx = RX; tx < RX + BREITE + 20; tx++) {
    if (hash(tx, ty, 13) > 0.09) continue;
    const bx = (tx - RX) * T + 3 + Math.floor(hash(tx, ty, 14) * 9), by = (ty - RY) * T + 4 + Math.floor(hash(tx, ty, 15) * 8);
    if (typ[by * RB + bx] !== 2) continue;
    const r = BLUMEN[Math.floor(hash(tx, ty, 16) * BLUMEN.length)], w = f && hash(tx, ty, 17) < 0.6 ? 1 : 0;
    punkt(bx, by + 2, "gras", 0); punkt(bx, by + 3, "gras", 1);
    punkt(bx + w, by - 1, r, 4); punkt(bx - 1 + w, by, r, 3); punkt(bx + 1 + w, by, r, 2); punkt(bx + w, by + 1, r, 2); punkt(bx + w, by, r === "gelb" ? "orange" : "gelb", 4);
  }
  g.putImageData(d, 0, 0);
  return Texture.from(c);
}
const BODEN = [bodenBild(0), bodenBild(1)];

// ---------- Bühne ----------
const welt = new Container(), schatten = new Container(), dinge = new Container(), wolken = new Container();
dinge.sortableChildren = true;
const boden = new Sprite(BODEN[0]); boden.position.set(RX * T, RY * T);
welt.addChild(boden, schatten, dinge, wolken); app.stage.addChild(welt);
const SCHATTEN_FARBE = 0x1A1040;
function schattenUnter(groesse, x, y) { const s = new Sprite(D.schatten[groesse].tex); s.anchor.set(0.5); s.position.set(x, y); s.tint = SCHATTEN_FARBE; s.alpha = 0.3; schatten.addChild(s); return s; }
function stelle(e, fx, fy, blockB = 1, blockH = 1, sg = "m") {
  const s = new Sprite(e.tex); s.anchor.set(0.5, 1); s.position.set(fx * T + T / 2, (fy + 1) * T); s.zIndex = s.y; dinge.addChild(s);
  if (sg) schattenUnter(sg, s.x + 2, s.y - 2);
  for (let i = 0; i < blockB; i++) for (let j = 0; j < blockH; j++) fest.add((fy - j) * BREITE + fx - Math.floor(blockB / 2) + i);
  return s;
}
stelle(D.haus, 11, 12, 4, 2, "h");
[[6, 10, 0], [8, 18, 1], [28, 8, 0], [31, 14, 1], [26, 21, 0], [16, 22, 0], [7, 14, 1], [23, 6, 1], [33, 18, 0], [16, 10, 0], [21, 11, 1], [27, 12, 0], [14, 19, 0], [20, 20, 1], [24, 17, 0]]
  .forEach(([x, y, t], i) => stelle(t ? D.tanne : D.baum[i % 3 ? 0 : 1], x, y, t ? 1 : 2, 1, t ? "m" : "g"));
[[22, 16], [23, 16], [10, 20], [30, 11]].forEach(([x, y]) => stelle(D.stein, x, y, 1, 1, "k"));
[[14, 12], [8, 12], [18, 17], [29, 17]].forEach(([x, y]) => stelle(D.busch, x, y, 1, 1, "m"));
stelle(D.schild, 13, 13, 1, 1, "k");
// Wolkenschatten ziehen langsam über die Insel
const wolkenListe = [[4, 6], [24, 18], [36, 2]].map(([x, y]) => { const s = new Sprite(D.wolke.tex); s.position.set(x * T, y * T); s.tint = SCHATTEN_FARBE; s.alpha = 0.1; wolken.addChild(s); return s; });

// Figuren
const ich = new Sprite(KIND.vorn[0].tex); ich.anchor.set(0.5, 1); dinge.addChild(ich);
const fuchsS = new Sprite(FUCHS[0].tex); fuchsS.anchor.set(0.5, 1); dinge.addChild(fuchsS);
const ichSchatten = schattenUnter("k", 0, 0), fuchsSchatten = schattenUnter("k", 0, 0);
const pos = { x: 18 * T + 8, y: 15 * T + 14 }, fpos = { x: 16 * T, y: 16 * T };
let richtung = "vorn", spiegeln = 1;

// Steuerung: Antippen → hinlaufen (achsenweise, Hindernisse umgehen so gut es geht)
let ziel = null, skala = 3;
app.stage.eventMode = "static"; app.stage.hitArea = app.screen;
app.stage.on("pointertap", (e) => { const l = welt.toLocal(e.global); ziel = { x: l.x, y: l.y }; tippText(); });
const frei = (px, py) => !fest.has(Math.floor(py / T) * BREITE + Math.floor(px / T)) && !fest.has(Math.floor(py / T) * BREITE + Math.floor((px - 5) / T)) && !fest.has(Math.floor(py / T) * BREITE + Math.floor((px + 5) / T));

function layout() {
  const w = app.screen.width, h = app.screen.height;
  // ganze Vergrößerung, damit die Pixel scharf bleiben: etwa 16–18 Felder breit / 12 hoch sichtbar (wie ein DS-Bildschirm)
  skala = Math.max(2, Math.round(Math.min(w / (T * 18), h / (T * 12.5))));
  welt.scale.set(skala);
}
app.renderer.on("resize", layout); layout();

// Textfeld wie in Handheld-Abenteuern
const box = document.createElement("div");
box.className = "pixelbox";
box.innerHTML = "<b>Fipsi</b><br>Hallo! Tippe irgendwohin, dann laufen wir los!";
document.body.appendChild(box);
function tippText() { box.hidden = true; }

const mess = messung("PixiJS · Pixel-Abenteuer (DS)", "pixel.js");
let t = 0, wTakt = 0, bildNr = 0;
app.ticker.add((tk) => {
  const dt = Math.min(tk.deltaMS / 1000, 0.05); t += dt;
  let geht = false;
  if (ziel) {
    const dx = ziel.x - pos.x, dy = ziel.y - pos.y, v = 70 * dt;
    if (Math.abs(dx) < 1.5 && Math.abs(dy) < 1.5) ziel = null;
    else {
      const zuerstX = Math.abs(dx) > Math.abs(dy);
      const versuche = zuerstX ? [[Math.sign(dx), 0], [0, Math.sign(dy)]] : [[0, Math.sign(dy)], [Math.sign(dx), 0]];
      let bewegt = false;
      for (const [sx, sy] of versuche) {
        if (!sx && !sy) continue;
        const nx = pos.x + sx * Math.min(v, Math.abs(dx)), ny = pos.y + sy * Math.min(v, Math.abs(dy));
        if (frei(nx, ny)) { pos.x = nx; pos.y = ny; bewegt = true; richtung = sx ? "seite" : sy < 0 ? "hinten" : "vorn"; if (sx) spiegeln = sx; break; }
      }
      if (!bewegt) ziel = null; else geht = true;
    }
  }
  // Schrittfolge: links – stehen – rechts – stehen
  const schritt = geht ? [1, 0, 2, 0][Math.floor(t * 8) % 4] : 0;
  ich.texture = KIND[richtung][schritt].tex; ich.scale.x = richtung === "seite" ? spiegeln : 1;
  ich.position.set(Math.round(pos.x), Math.round(pos.y)); ich.zIndex = ich.y;
  ichSchatten.position.set(ich.x, ich.y - 1);
  // Fuchs folgt
  const fx = pos.x - spiegeln * 14 - fpos.x, fy = pos.y + 2 - fpos.y, fd = Math.hypot(fx, fy);
  const laeuft = fd > 6;
  if (laeuft) { const s = Math.min(fd - 6, (fd > 40 ? 110 : 66) * dt); fpos.x += fx / fd * s; fpos.y += fy / fd * s; if (Math.abs(fx) > 1) fuchsS.scale.x = Math.sign(fx); }
  fuchsS.texture = FUCHS[laeuft ? Math.floor(t * 10) % 2 : 0].tex;
  fuchsS.position.set(Math.round(fpos.x), Math.round(fpos.y)); fuchsS.zIndex = fuchsS.y;
  fuchsSchatten.position.set(fuchsS.x, fuchsS.y - 1);
  // Wasser, Schaum und Blumen in zwei Bildern
  wTakt += dt; if (wTakt > 0.55) { wTakt = 0; bildNr ^= 1; boden.texture = BODEN[bildNr]; }
  // Wolkenschatten (ganzzahlig, langsam)
  wolkenListe.forEach(w => { w.ox = (w.ox ?? w.x) + dt * 4; if (w.ox > (BREITE + 10) * T) w.ox = -8 * T; w.x = Math.round(w.ox); });
  // Kamera: ganzzahlig, damit nichts flimmert
  const sw = app.screen.width / skala, sh = app.screen.height / skala;
  const kx = Math.max(sw / 2 - 10 * T, Math.min(BREITE * T + 10 * T - sw / 2, pos.x)), ky = Math.max(sh / 2 - 6 * T, Math.min(HOEHE * T + 6 * T - sh / 2, pos.y - 8));
  welt.position.set(Math.round(app.screen.width / 2 - kx * skala), Math.round(app.screen.height / 2 - ky * skala));
}, null, UPDATE_PRIORITY.HIGH);
app.ticker.add(() => mess.tick(), null, UPDATE_PRIORITY.UTILITY);
window.__probe = { name: "PixiJS · Pixel-Abenteuer (DS)", info: mess.info, laufeZu: (x, y) => { ziel = { x: x * T, y: y * T }; } };
