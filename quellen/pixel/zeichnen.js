// Gemeinsamer Zeichenweg für den Look „Pixel“ (DS-Stil, Regeln in docs/GRAFIK.md Abschnitt 2):
//   1. Formen in einen kleinen Pixelpuffer malen – jede Farbe ist eine Stufe (0 dunkel … 4 hell) aus einer Farbreihe in PAL.
//   2. Licht kommt immer von oben links; Kugeln/Zylinder/Flächen werden danach schattiert, Zwischenstufen schmal gerastert (Bayer 4×4).
//   3. Automatischer Umriss in der dunkelsten Stufe der Nachbarfarbe (farbiger Umriss statt Schwarz).
//   4. Alle Dinge und Figuren landen in EINEM Bildatlas (merke → packe), damit alles in einem Zeichenaufruf bleibt.
// Benutzt von der Pixel-Probe (quellen/probe/pixel.js) und der Pixel-Insel (quellen/pixel/insel.js).
import { Texture, Rectangle } from "pixi.js";

// ---------- Farbreihen: je 5 Stufen, dunkel → hell (Schatten kühl, Licht warm) ----------
export const PAL = {
  gras: ["#1F5B45", "#2F7D44", "#4DA546", "#7CCB4F", "#B4E66A"],
  laub: ["#173F3A", "#235F3C", "#36843F", "#5BAA45", "#94D05A"],
  tanne: ["#12343A", "#1B4D46", "#26694F", "#3A8A5A", "#62AE6A"],
  herbst: ["#5A3A28", "#8A5A2A", "#C8862E", "#E8B040", "#F8DC78"],
  schnee: ["#6A7AA0", "#9AAACC", "#C8D4EC", "#E8EEF8", "#FFFFFF"],
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
  gruen: ["#14483E", "#1E7A5E", "#2FA37C", "#5CCBA6", "#A6EED0"],
  blau: ["#1E2A6A", "#2E44A4", "#4A6AD8", "#7A9AF0", "#B4CCFF"],
  glas: ["#2A4A7A", "#3E78B0", "#62A6DA", "#9ACEF2", "#E0F4FF"],
  dunkel: ["#141024", "#221A34", "#30283A", "#4A4058", "#6A6078"],
  weiss: ["#9AA4C0", "#C4CCE0", "#E4EAF4", "#F4F8FC", "#FFFFFF"]
};
export const RGB = [], REIHE = [];
const NR = {};
Object.entries(PAL).forEach(([n, r]) => { NR[n] = RGB.length; r.forEach(h => { RGB.push([parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]); REIHE.push(n); }); });
export const farbe = (reihe, stufe) => NR[reihe] + Math.max(0, Math.min(4, stufe));
// Farbe als Zahl (für tint) – nur Farben aus PAL
export const hex = (reihe, stufe) => parseInt(PAL[reihe][stufe].slice(1), 16);
// Nächste Farbreihe zu einer beliebigen Farbe (z. B. Lieblingsfarbe aus dem Wünsche-Assistenten)
export function naechsteReihe(h, aus = ["rosa", "lila", "blau", "gelb", "orange", "rot", "weiss", "gruen"]) {
  const c = [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  let best = aus[0], bd = 1e9;
  aus.forEach(r => { const [a, b, d] = RGB[farbe(r, 3)], e = (a - c[0]) ** 2 + (b - c[1]) ** 2 + (d - c[2]) ** 2; if (e < bd) { bd = e; best = r; } });
  return best;
}

// ---------- Zufall, Rauschen, Rasterung ----------
export const hash = (x, y, s = 0) => { let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s, 982451653)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
const glatt = t => t * t * (3 - 2 * t);
export function rauschen(x, y, gr, s = 0) {
  const fx = x / gr, fy = y / gr, ix = Math.floor(fx), iy = Math.floor(fy), tx = glatt(fx - ix), ty = glatt(fy - iy);
  const a = hash(ix, iy, s), b = hash(ix + 1, iy, s), c = hash(ix, iy + 1, s), d = hash(ix + 1, iy + 1, s);
  return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
}
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);
// nur ein schmaler gerasterter Übergang zwischen zwei Stufen (klare Flächen wie bei DS-Grafik)
export const raster = (v, x, y) => { const b = Math.floor(v), f = Math.min(1, Math.max(0, (v - b - 0.5) * 2.6 + 0.5)); return f > BAYER[(y & 3) * 4 + (x & 3)] ? b + 1 : b; };

// ---------- Pixelpuffer und Formen ----------
export const bild = (b, h) => ({ b, h, p: new Int16Array(b * h).fill(-1) });
export function setze(B, x, y, reihe, stufe) { x = Math.floor(x); y = Math.floor(y); if (x >= 0 && y >= 0 && x < B.b && y < B.h) B.p[y * B.b + x] = farbe(reihe, stufe); }
// füllt alle Pixel, deren Mitte „drin“ ist; licht(x, y) liefert eine Stufe als Kommazahl (wird gerastert)
export function fuelle(B, x0, y0, x1, y1, drin, reihe, licht) {
  for (let y = Math.max(0, Math.floor(y0)); y <= Math.min(B.h - 1, Math.ceil(y1)); y++)
    for (let x = Math.max(0, Math.floor(x0)); x <= Math.min(B.b - 1, Math.ceil(x1)); x++)
      if (drin(x + 0.5, y + 0.5)) setze(B, x, y, reihe, typeof licht === "number" ? licht : raster(licht(x + 0.5, y + 0.5), x, y));
}
const LX = -0.55, LY = -0.65, LZ = 0.52; // Licht von oben links
export function kugel(B, cx, cy, rx, ry, reihe, lo = 1, hi = 4) {
  fuelle(B, cx - rx - 1, cy - ry - 1, cx + rx + 1, cy + ry + 1, (x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1, reihe, (x, y) => {
    const nx = (x - cx) / rx, ny = (y - cy) / ry, nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
    return lo + (hi - lo + 0.99) * Math.min(1, Math.max(0, LX * nx + LY * ny + LZ * nz) * 1.1);
  });
}
export const rect = (B, x, y, b, h, reihe, stufe) => fuelle(B, x, y, x + b - 1, y + h - 1, (px, py) => px >= x && px < x + b && py >= y && py < y + h, reihe, stufe);
// senkrechter Zylinder (Stamm, Pfosten): links hell, rechts dunkel
export const zylinder = (B, x, y, b, h, reihe, lo = 0.6, hi = 3.6) => fuelle(B, x, y, x + b - 1, y + h - 1, (px, py) => px >= x && px < x + b && py >= y && py < y + h, reihe, px => hi - (hi - lo) * (px - x) / b);
export function vieleck(B, pkt, reihe, licht) {
  const xs = pkt.map(p => p[0]), ys = pkt.map(p => p[1]);
  const drin = (x, y) => { let c = false; for (let i = 0, j = pkt.length - 1; i < pkt.length; j = i++) { const [xi, yi] = pkt[i], [xj, yj] = pkt[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  fuelle(B, Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), drin, reihe, licht);
}
export const ellipse = (B, cx, cy, rx, ry, reihe, licht) => fuelle(B, cx - rx - 1, cy - ry - 1, cx + rx + 1, cy + ry + 1, (x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1, reihe, licht);
// farbiger Umriss: leere Pixel neben gefüllten bekommen die dunkelste Stufe der Nachbarfarbe
export function umriss(B) {
  const { b, h, p } = B, q = Int16Array.from(p);
  for (let y = 0; y < h; y++) for (let x = 0; x < b; x++) {
    if (p[y * b + x] >= 0) continue;
    for (const [dx, dy] of [[0, 1], [1, 0], [-1, 0], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= b || ny >= h) continue;
      const n = p[ny * b + nx]; if (n >= 0) { q[y * b + x] = farbe(REIHE[n] === "weiss" || REIHE[n] === "schnee" ? "dunkel" : REIHE[n], 0); break; }
    }
  }
  B.p = q; return B;
}
// Graustufen-Fassung (gesperrte Orte): jede Farbe wird zur gleichen Stufe in „stein“
export function grau(B) { const q = Int16Array.from(B.p, f => (f < 0 ? -1 : farbe("stein", (f - farbe(REIHE[f], 0))))); return { b: B.b, h: B.h, p: q }; }

// ---------- Bildatlas: alle Dinge und Figuren in einer Textur ----------
export function atlas() {
  const liste = [];
  return {
    merke(B, mitUmriss = true) { const e = { B: mitUmriss ? umriss(B) : B, tex: null, b: B.b, h: B.h }; liste.push(e); return e; },
    packe(breite = 1024) {
      let x = 0, y = 0, zeile = 0;
      liste.forEach(e => { if (x + e.B.b > breite) { x = 0; y += zeile + 1; zeile = 0; } e.x = x; e.y = y; x += e.B.b + 1; zeile = Math.max(zeile, e.B.h); });
      const c = document.createElement("canvas"); c.width = breite; c.height = y + zeile;
      const g = c.getContext("2d"), d = g.createImageData(c.width, c.height);
      liste.forEach(e => { for (let j = 0; j < e.B.h; j++) for (let i = 0; i < e.B.b; i++) { const f = e.B.p[j * e.B.b + i]; if (f < 0) continue; const k = ((e.y + j) * c.width + e.x + i) * 4; [d.data[k], d.data[k + 1], d.data[k + 2]] = RGB[f]; d.data[k + 3] = 255; } });
      g.putImageData(d, 0, 0);
      const quelle = Texture.from(c).source;
      liste.forEach(e => { e.tex = new Texture({ source: quelle, frame: new Rectangle(e.x, e.y, e.B.b, e.B.h) }); });
      return c;
    }
  };
}
// Schatten (Ellipse; wird halbdurchsichtig und kühl eingefärbt gezeichnet)
export const schattenBild = (b, h) => { const B = bild(b, h); ellipse(B, b / 2, h / 2, b / 2, h / 2, "dunkel", 0); return B; };
export const SCHATTEN_FARBE = 0x1A1040;
// Pixelbild direkt in ein Canvas (für große Flächen wie den Boden): pixel(x, y) → Farbnummer
export function leinwand(b, h, pixel) {
  const c = document.createElement("canvas"); c.width = b; c.height = h;
  const g = c.getContext("2d"), d = g.createImageData(b, h), out = d.data;
  for (let y = 0; y < h; y++) for (let x = 0; x < b; x++) { const f = pixel(x, y); if (f < 0) continue; const o = (y * b + x) * 4; [out[o], out[o + 1], out[o + 2]] = RGB[f]; out[o + 3] = 255; }
  g.putImageData(d, 0, 0);
  return c;
}
