// Alle Dinge und Figuren der Pixel-Insel (NA-26) als kleine Pixelbilder im DS-Stil (Regeln in docs/GRAFIK.md Abschnitt 2).
// Jede Funktion liefert einen Pixelpuffer (bild()); die Insel legt sie mit merke() in den gemeinsamen Bildatlas.
// Maßstab: 1 Welteinheit der runden Insel = 1 Kachel = 16 Pixel. Füße/Bodenpunkt = untere Mitte des Bildes.
// Alles ist eigene Zeichnung aus Formen (keine fremden Kacheln oder Figuren).
import { REIHE, RGB, farbe, hash, bild, setze, fuelle, kugel, rect, zylinder, vieleck, ellipse, naechsteReihe } from "./zeichnen.js";

// ---------- Pflanzen ----------
// Laubbaum; reihe = "laub" | "herbst"; k = Größe (0.6 … 1.2); schnee = Schneehaube; fruechte = rote Äpfel
export function laubbaum(reihe = "laub", k = 1, { fruechte = false, schnee = false } = {}) {
  const b = Math.round(34 * k), h = Math.round(44 * k), B = bild(b + 2, h + 2), cx = b / 2 + 1;
  vieleck(B, [[cx - 6 * k, h], [cx - 3 * k, h - 6 * k], [cx + 3 * k, h - 6 * k], [cx + 6 * k, h]], "holz", x => 3.4 - (x - cx + 6 * k) / (12 * k) * 2.8);
  zylinder(B, Math.round(cx - 3 * k), Math.round(h - 17 * k), Math.max(3, Math.round(6 * k)), Math.round(13 * k), "holz");
  kugel(B, cx, 18 * k, 15 * k, 12.5 * k, reihe, 0.6, 2.2);
  [[-6, -5, 7, 6], [4, -7, 7, 6], [-1, -11, 7, 5.5], [-9, 2, 6, 5], [8, 1, 6, 5], [-1, 0, 8, 6]].forEach(([x, y, rx, ry]) => kugel(B, cx + x * k, 18 * k + y * k, rx * k, ry * k, reihe, 1.3, 4));
  if (schnee) [[-6, -9, 6, 2.5], [4, -11, 6, 2.5], [-1, -15, 5, 2]].forEach(([x, y, rx, ry]) => kugel(B, cx + x * k, 18 * k + y * k, rx * k, ry * k, "schnee", 2.5, 4));
  if (fruechte) [[-8, -1], [5, -4], [1, 5], [9, 4], [-4, -9]].forEach(([x, y]) => { kugel(B, cx + x * k, 18 * k + y * k, 1.8, 1.8, "rot", 1, 4); });
  return B;
}
export function tanne(k = 1, { schnee = false } = {}) {
  const b = Math.round(26 * k), h = Math.round(44 * k), B = bild(b + 2, h + 2), cx = b / 2 + 1;
  zylinder(B, Math.round(cx - 2), Math.round(h - 10 * k), 4, Math.round(9 * k), "holz");
  [[35, 12, 9], [27, 10, 9], [19, 8, 8], [11, 6, 7], [4, 3.5, 4]].forEach(([y, bb, hh]) => {
    const yy = y * k, br = bb * k, hk = hh * k;
    vieleck(B, [[cx - br, yy], [cx, yy - hk - 2], [cx + br, yy]], "tanne", (px, py) => 3.9 - (px - (cx - br)) / (2 * br) * 2.6 - (py > yy - 2 ? 1 : 0));
    if (schnee) vieleck(B, [[cx - br * 0.55, yy - hk * 0.45], [cx, yy - hk - 2], [cx + br * 0.55, yy - hk * 0.45]], "schnee", 3.6);
  });
  return B;
}
export function palme(k = 1) {
  const b = Math.round(34 * k), h = Math.round(46 * k), B = bild(b + 2, h + 2), cx = b / 2 + 1;
  // geschwungener Stamm mit Ringen
  for (let y = Math.round(12 * k); y < h; y++) { const x = cx + Math.sin((h - y) / h * 2.2) * 3 * k; fuelle(B, x - 2, y, x + 2, y, (px) => px >= x - 2 && px < x + 2, "sand", px => 3.6 - (px - (x - 2)) / 4 * 2.4 - (y % 4 === 0 ? 1 : 0)); }
  // Wedel
  [[-1, -0.2], [1, -0.2], [-0.8, 0.5], [0.8, 0.5], [0, -1]].forEach(([dx, dy]) => {
    for (let i = 0; i < 14 * k; i++) { const t = i / (14 * k), x = cx + dx * i, y = 12 * k + dy * i * 0.7 + t * t * 8 * k; kugel(B, x, y, 2.4 * (1 - t * 0.5), 1.8, "gras", 1.4, 4); }
  });
  kugel(B, cx - 1, 13 * k, 2, 2, "holz", 1, 3); kugel(B, cx + 2, 14 * k, 2, 2, "holz", 1, 3);
  return B;
}
export function kaktus(k = 1) {
  const b = Math.round(20 * k), h = Math.round(30 * k), B = bild(b + 2, h + 2), cx = b / 2 + 1;
  const arm = (x, y0, y1) => fuelle(B, x - 2.5, y0, x + 2.5, y1, (px, py) => Math.abs(px - x) <= 2.5 && py >= y0 && (py <= y1 || ((px - x) / 2.5) ** 2 + ((py - y0) / 2.5) ** 2 <= 1), "gruen", px => 3.8 - (px - x + 2.5) / 5 * 2.6);
  arm(cx, 3, h); arm(cx - 6 * k, h * 0.35, h * 0.6); arm(cx + 6 * k, h * 0.25, h * 0.5);
  rect(B, cx - 6 * k, h * 0.58, 6 * k, 3, "gruen", 2); rect(B, cx, h * 0.48, 6 * k, 3, "gruen", 2);
  for (let y = 6; y < h - 2; y += 5) { setze(B, cx - 1, y, "creme", 4); setze(B, cx + 1, y + 2, "creme", 4); }
  kugel(B, cx, 3, 2, 2, "rosa", 2, 4);
  return B;
}
export function stein(k = 1, reihe = "stein") {
  const B = bild(Math.round(18 * k) + 2, Math.round(14 * k) + 2), cx = B.b / 2, cy = B.h / 2 + 1;
  kugel(B, cx, cy, 7.5 * k, 5 * k, reihe, 0.8, 4); setze(B, cx + 1, cy + 1, reihe, 0); setze(B, cx - 3 * k, cy - 3 * k, "weiss", 4);
  return B;
}
export function busch(reihe = "laub") {
  const B = bild(22, 17);
  kugel(B, 11, 10, 10, 6.5, reihe, 0.7, 2.4);
  [[7, 8, 5, 4], [15, 7, 5, 4], [11, 11, 6, 4]].forEach(([x, y, rx, ry]) => kugel(B, x, y, rx, ry, reihe, 1.4, 4));
  return B;
}

// ---------- Gebäude und Orte ----------
export function haus({ winter = false, nacht = false } = {}) {
  const B = bild(66, 62);
  rect(B, 7, 54, 52, 4, "stein", 2); rect(B, 7, 54, 52, 1, "stein", 3);
  fuelle(B, 8, 28, 57, 53, () => true, "wand", (x, y) => 3.4 - (x - 8) / 50 * 1.2 - (y < 33 ? 1.6 : 0));
  [8, 32, 57].forEach(x => zylinder(B, x - 1, 30, 3, 24, "holz", 1, 3));
  [[13, 37], [42, 37]].forEach(([x, y]) => {
    rect(B, x - 1, y - 1, 13, 12, "weiss", 3);
    if (nacht) fuelle(B, x, y, x + 10, y + 9, () => true, "gelb", (px, py) => 3.6 - (py - y) / 12);
    else fuelle(B, x, y, x + 10, y + 9, () => true, "glas", (px, py) => ((px - x) - (py - y) + 12) % 9 < 2 ? 4 : 2.2 + (py - y) / 9);
    rect(B, x + 5, y, 1, 10, "weiss", 4); rect(B, x, y + 4, 11, 1, "weiss", 4);
    rect(B, x - 1, y + 11, 13, 3, "holz", 2); rect(B, x - 1, y + 11, 13, 1, "holz", 3);
    if (!winter) for (let i = 0; i < 6; i++) { const f = ["rot", "gelb", "rosa"][i % 3]; setze(B, x + i * 2, y + 10, f, 3); setze(B, x + i * 2 + 1, y + 9, f, 4); setze(B, x + i * 2, y + 9, "laub", 2); }
  });
  rect(B, 27, 38, 11, 16, "holz", 0);
  fuelle(B, 28, 39, 36, 53, () => true, "holz", x => 3.2 - (x - 28) / 9 * 1.6);
  rect(B, 30, 41, 5, 4, nacht ? "gelb" : "glas", 3); setze(B, 35, 47, "gelb", 4);
  rect(B, 25, 58, 15, 3, "stein", 3); rect(B, 25, 60, 15, 1, "stein", 1);
  zylinder(B, 44, 2, 7, 12, "stein", 1, 3.6); rect(B, 43, 1, 9, 2, "dunkel", 2);
  vieleck(B, [[1, 32], [10, 7], [56, 7], [65, 32]], "dach", (x, y) => { const reihe = Math.floor((y - 7) / 4), inReihe = (y - 7) % 4; return (inReihe === 3 ? 1 : 2.8 + (reihe % 2) * 0.4) - (x - 1) / 64 * 0.9 + (y < 10 ? 1.2 : 0); });
  for (let y = 11; y < 31; y += 4) for (let x = 4 + ((y / 4) % 2) * 3; x < 63; x += 6) setze(B, x, y, "dach", 1);
  if (winter) { vieleck(B, [[3, 20], [10, 6], [56, 6], [63, 20], [56, 14], [10, 14]], "schnee", (x, y) => 4 - (y - 6) / 14 - (x - 3) / 60); rect(B, 43, 0, 9, 2, "schnee", 4); }
  return B;
}
// Wetterstation: Pfosten, weiße Hütte mit rotem Dach, Thermometer, Windrad (2 Bilder)
export function station(f = 0) {
  const B = bild(22, 40);
  zylinder(B, 10, 22, 3, 17, "holz", 1, 3.4);
  rect(B, 4, 14, 14, 9, "weiss", 3); rect(B, 4, 14, 14, 1, "weiss", 4);
  [16, 18, 20].forEach(y => rect(B, 5, y, 12, 1, "weiss", 1));
  vieleck(B, [[3, 15], [11, 8], [19, 15]], "rot", (x) => 3.6 - (x - 3) / 16 * 1.8);
  rect(B, 18, 15, 1, 7, "weiss", 4); kugel(B, 18.5, 22, 1.4, 1.4, "rot", 2, 4);
  // Windrad oben
  rect(B, 10, 4, 1, 5, "stein", 1);
  const fl = f ? [[11, 2], [7, 6], [14, 6]] : [[8, 2], [14, 3], [10, 7]];
  ["gelb", "gruen", "blau"].forEach((r, i) => kugel(B, fl[i][0], fl[i][1], 2.2, 1.5, r, 2, 4));
  return B;
}
export function schild({ mathe = false } = {}) {
  const B = bild(20, 24);
  zylinder(B, 8, 10, 3, 13, "holz", 1, 3.5);
  fuelle(B, 1, 2, 18, 11, () => true, mathe ? "gruen" : "holz", (x, y) => 3.6 - (y - 2) / 9 * 1.4);
  if (mathe) { rect(B, 4, 6, 4, 1, "weiss", 4); rect(B, 5, 5, 1, 3, "weiss", 4); rect(B, 11, 6, 4, 1, "weiss", 4); }
  else [4, 7].forEach(y => rect(B, 3, y, 13, 1, "holz", 1));
  return B;
}
// Steg: Bretter von oben nach unten, Pfosten an den Seiten; laenge in Pixeln
export function steg(laenge) {
  const B = bild(24, laenge);
  fuelle(B, 2, 0, 21, laenge - 1, () => true, "holz", (x, y) => (y % 6 === 5 ? 1.2 : 3.2 - (x - 2) / 20 * 0.8 + (y % 12 < 6 ? 0.2 : 0)));
  for (let y = 4; y < laenge; y += 18) { kugel(B, 2, y, 2, 2, "holz", 0.8, 2.6); kugel(B, 21, y, 2, 2, "holz", 0.8, 2.6); }
  return B;
}
// Pixels Boot (von oben gesehen, Bug nach Süden), kleiner Mast mit gelber Fahne
export function boot() {
  const B = bild(26, 40);
  fuelle(B, 2, 6, 23, 37, (x, y) => ((x - 12.5) / 10.5) ** 2 + ((y - 20) / 16) ** 2 <= 1 && (y < 30 || Math.abs(x - 12.5) < (37 - y) * 1.3), "blau", (x, y) => 3.4 - (x - 2) / 21 * 1.6);
  fuelle(B, 5, 10, 20, 32, (x, y) => ((x - 12.5) / 7.5) ** 2 + ((y - 20) / 12) ** 2 <= 1, "holz", (x, y) => (y % 4 === 0 ? 1.6 : 3 - (x - 5) / 15));
  rect(B, 6, 19, 14, 2, "holz", 1);
  rect(B, 12, 2, 2, 18, "holz", 2); vieleck(B, [[14, 2], [22, 5], [14, 8]], "gelb", 3.4);
  return B;
}
// Sonnenuhr: Sockel mit Ziffernblatt und Stab; die Sonne ist ein eigenes Bild (3 Zustände)
export function sonnenuhr() {
  const B = bild(26, 30);
  zylinder(B, 7, 16, 12, 12, "creme", 1, 3.6); rect(B, 6, 27, 14, 2, "creme", 1);
  ellipse(B, 13, 15, 10, 4, "creme", (x, y) => 4 - (x - 3) / 20 - (y - 11) / 10);
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; setze(B, 13 + Math.cos(a) * 8, 15 + Math.sin(a) * 3, "holz", 1); }
  vieleck(B, [[13, 15], [13, 8], [17, 15]], "holz", 2.6);
  rect(B, 4, 2, 1, 13, "holz", 2);
  return B;
}
export function sonne(stufe) {   // 0 dunkel, 1 halb, 2 hell (mit Strahlen)
  const B = bild(16, 16), reihe = stufe === 0 ? "stein" : "gelb";
  if (stufe === 2) for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; setze(B, 8 + Math.cos(a) * 7, 8 + Math.sin(a) * 7, "orange", 3); setze(B, 8 + Math.cos(a) * 6, 8 + Math.sin(a) * 6, "gelb", 3); }
  kugel(B, 8, 8, 4.5, 4.5, reihe, stufe === 1 ? 0.6 : 1, stufe === 0 ? 2.6 : 4);
  return B;
}
export function paket() {
  const B = bild(18, 18);
  fuelle(B, 2, 6, 15, 16, () => true, "rot", (x, y) => 3.2 - (x - 2) / 14 * 1.2);
  fuelle(B, 1, 4, 16, 7, () => true, "rot", (x) => 3.8 - (x - 1) / 15 * 1.2);
  rect(B, 7, 4, 3, 13, "gelb", 3); rect(B, 1, 9, 16, 2, "gelb", 2);
  kugel(B, 6, 3, 2.5, 1.8, "gelb", 2, 4); kugel(B, 11, 3, 2.5, 1.8, "gelb", 2, 4);
  return B;
}
export function truhe() {
  const B = bild(20, 16);
  fuelle(B, 2, 7, 17, 14, () => true, "holz", (x, y) => 3 - (x - 2) / 15 * 1.2);
  fuelle(B, 2, 2, 17, 7, (x, y) => y >= 2 + Math.abs(x - 9.5) * 0.05, "orange", (x, y) => 3.4 - (y - 2) / 5 - (x - 2) / 20);
  rect(B, 2, 7, 16, 1, "holz", 0); rect(B, 8, 6, 4, 4, "gelb", 3); setze(B, 9, 7, "gelb", 4);
  return B;
}
export function ballons(f = 0) {
  const B = bild(24, 42);
  zylinder(B, 10, 32, 4, 9, "holz", 1, 3);
  const F = ["rosa", "gelb", "gruen", "blau", "lila"], P = [[5, 10], [12, 6], [19, 10], [8, 16], [16, 15]];
  P.forEach(([x, y], i) => { const yy = y + ((i + f) % 2); for (let s = yy + 4; s < 33; s++) setze(B, 12 + (x - 12) * (33 - s) / (33 - yy), s, "weiss", 2); });
  P.forEach(([x, y], i) => { const yy = y + ((i + f) % 2); kugel(B, x, yy, 3.6, 4.2, F[i], 1, 4); setze(B, x - 1, yy - 2, "weiss", 4); });
  return B;
}
export function startbogen() {
  const B = bild(40, 40);
  [5, 33].forEach(x => zylinder(B, x, 12, 3, 27, "rot", 1, 3.6));
  rect(B, 3, 9, 34, 6, "weiss", 3);
  for (let x = 4; x < 36; x += 4) { rect(B, x, 9, 2, 3, "dunkel", 2); rect(B, x + 2, 12, 2, 3, "dunkel", 2); }
  kugel(B, 20, 5, 4, 4, "gelb", 1.5, 4);
  return B;
}
export function kart() {
  const B = bild(34, 34);
  rect(B, 26, 4, 1, 22, "holz", 2);
  for (let a = 0; a < 3; a++) for (let b = 0; b < 2; b++) rect(B, 27 + a * 2, 4 + b * 2, 2, 2, (a + b) % 2 ? "dunkel" : "weiss", 3);
  [[5, 14], [5, 28], [21, 14], [21, 28]].forEach(([x, y]) => kugel(B, x, y, 3, 3.4, "dunkel", 1, 3));
  fuelle(B, 6, 10, 20, 31, (x, y) => ((x - 13) / 7.5) ** 2 + ((y - 20) / 11) ** 2 <= 1, "blau", (x, y) => 3.6 - (x - 6) / 15 * 1.6);
  kugel(B, 13, 22, 4, 4, "gelb", 1.5, 4);
  return B;
}
export function bausteine() {
  const B = bild(30, 26), F = ["rot", "blau", "gelb", "gruen", "lila"];
  const block = (x, y, i) => { fuelle(B, x, y, x + 8, y + 7, () => true, F[i % 5], (px, py) => (py < y + 2 ? 4 : 3.2 - (px - x) / 9 * 1.4)); [x + 2, x + 6].forEach(n => setze(B, n, y, F[i % 5], 4)); };
  [[1, 17, 0], [10, 17, 1], [19, 17, 2], [5, 10, 3], [14, 10, 4], [9, 3, 0]].forEach(([x, y, i]) => block(x, y, i));
  return B;
}
export function schloss() {
  const B = bild(12, 14);
  fuelle(B, 2, 1, 9, 7, (x, y) => { const d = Math.hypot(x - 5.5, y - 6); return d <= 4 && d >= 2.2; }, "stein", 3);
  fuelle(B, 1, 6, 10, 12, () => true, "gelb", (x) => 3.8 - (x - 1) / 10 * 1.6);
  rect(B, 5, 8, 2, 3, "dunkel", 1);
  return B;
}
export function schachtisch() {
  const B = bild(26, 24);
  zylinder(B, 11, 13, 4, 10, "holz", 1, 3);
  fuelle(B, 1, 3, 24, 14, () => true, "holz", 3);
  for (let a = 0; a < 4; a++) for (let c = 0; c < 4; c++) rect(B, 4 + a * 5, 4 + c * 2.5, 5, 3, (a + c) % 2 ? "holz" : "creme", (a + c) % 2 ? 0 : 4);
  kugel(B, 8, 5, 1.6, 2, "weiss", 2, 4); kugel(B, 18, 10, 1.6, 2, "dunkel", 1, 3);
  return B;
}
export function buehne() {
  const B = bild(48, 30);
  ellipse(B, 24, 18, 22, 10, "holz", (x, y) => 3 - (y - 8) / 22);
  ellipse(B, 24, 16, 19, 8, "rosa", (x, y) => 4 - (x - 5) / 50 - (y - 8) / 20);
  [3, 39].forEach(x => { fuelle(B, x, 2, x + 6, 12, () => true, "lila", (px) => 1.8 - (px - x) / 8); kugel(B, x + 3, 7, 2, 2, "gelb", 2, 4); });
  return B;
}
export function nest(ei) {   // ei = { a: reihe, b: reihe } oder null
  const B = bild(20, 16);
  ellipse(B, 10, 11, 9, 4.5, "holz", (x, y) => 3 - (y - 7) / 8);
  ellipse(B, 10, 10, 6.5, 2.8, "holz", 1);
  for (let i = 0; i < 10; i++) setze(B, 2 + i * 1.7, 9 + (i % 3), "haar", 4);
  if (ei) { kugel(B, 10, 6, 4, 5, ei.a, 1.5, 4); rect(B, 6, 6, 9, 2, ei.b, 3); }
  return B;
}

// ---------- Wissensbaum je Stufe (0 = Spross) ----------
const WB_K = [0.35, 0.5, 0.62, 0.75, 0.88, 1.0, 1.12];
export function wissensbaum(stufe, saison) {
  if (stufe === 0) {
    const B = bild(16, 14);
    ellipse(B, 8, 11, 7, 3, "holz", (x, y) => 3 - (y - 8) / 6);
    rect(B, 7, 4, 2, 7, "gruen", 2);
    kugel(B, 4.5, 4, 3.5, 2, "gruen", 1.5, 4); kugel(B, 11.5, 3, 3.5, 2, "gruen", 1.5, 4);
    return B;
  }
  const k = WB_K[stufe] * 1.25, reihe = saison === "herbst" ? "gruen" : "laub";
  const B = laubbaum(reihe, k, { schnee: saison === "winter" });
  if (saison === "fruehling") for (let i = 0; i < 10; i++) { const a = i * 2.4, r = 9 * k; setze(B, B.b / 2 + Math.cos(a) * r, 18 * k + Math.sin(a) * r * 0.7, i % 3 ? "rosa" : "weiss", 4); }
  return B;
}
// Frucht (je Farbreihe) für die Lernfunde von heute
export function frucht(reihe) { const B = bild(7, 7); kugel(B, 3.5, 3.5, 2.8, 2.8, reihe, 1.2, 4); setze(B, 2, 2, "weiss", 4); return B; }
export function licht(reihe) { const B = bild(4, 4); kugel(B, 2, 2, 1.6, 1.6, reihe, 3, 4); return B; }
export function herz() {
  const B = bild(9, 8);
  fuelle(B, 0, 0, 8, 7, (x, y) => { const X = (x - 4.5) / 4.2, Y = (y - 3.4) / 3.8; return (X * X + Y * Y - 0.45) ** 3 - X * X * Y * Y * Y * 1.4 <= 0.02 || (Math.hypot(x - 2.6, y - 2.4) < 2.2 || Math.hypot(x - 6.4, y - 2.4) < 2.2 || (y > 3 && Math.abs(x - 4.5) < (7.6 - y) * 0.95)); }, "rosa", (x, y) => 4 - (x + y) / 9);
  return B;
}
export function tropfen() { const B = bild(2, 6); rect(B, 0, 0, 1, 6, "glas", 4); rect(B, 1, 2, 1, 4, "glas", 3); return B; }
export function flocke() { const B = bild(3, 3); setze(B, 1, 0, "weiss", 4); setze(B, 0, 1, "weiss", 4); setze(B, 1, 1, "weiss", 4); setze(B, 2, 1, "weiss", 4); setze(B, 1, 2, "weiss", 4); return B; }
export function marke(f) {   // Zielring beim Tippen (2 Bilder)
  const B = bild(16, 10), r = f ? 6.5 : 5.5;
  fuelle(B, 0, 0, 15, 9, (x, y) => { const d = Math.hypot((x - 8) / r, (y - 5) / (r * 0.55)); return d <= 1 && d >= 0.62; }, "weiss", 4);
  return B;
}

// ---------- Nachbarn ----------
const augenPaar = (B, x1, x2, y, iris = "dunkel") => [x1, x2].forEach(x => { setze(B, x, y, iris, 0); setze(B, x, y + 1, iris === "dunkel" ? "blau" : iris, 1); setze(B, x + 1, y, "weiss", 4); setze(B, x + 1, y + 1, "dunkel", 0); });
// Eule Ella: braun, cremefarbener Bauch, große Augen mit lila Brille, Doktorhut mit gelber Quaste
export function eule(f = 0) {
  const B = bild(22, 28);
  kugel(B, 11, 18, 8, 8.5, "haar", 1, 4);
  ellipse(B, 11, 20, 5, 6, "creme", (x, y) => 4 - (y - 14) / 10);
  for (let y = 17; y < 25; y += 3) for (let x = 8; x < 15; x += 3) setze(B, x + (y % 2), y, "creme", 2);
  kugel(B, f ? 4 : 3.5, 18, 2.6, 5.5, "haar", 0.8, 2.6); kugel(B, f ? 18 : 18.5, 18, 2.6, 5.5, "haar", 0.8, 2.6);
  kugel(B, 11, 10, 7, 5.5, "haar", 1.2, 4);
  [7.5, 14.5].forEach(x => { kugel(B, x, 10, 2.8, 2.8, "lila", 1, 2); kugel(B, x, 10, 2, 2, "weiss", 3, 4); setze(B, x, 10, "dunkel", 0); setze(B, x + 0.8, 9.2, "weiss", 4); });
  rect(B, 10, 10, 2, 1, "lila", 1);
  vieleck(B, [[10, 12], [12, 12], [11, 14]], "orange", 3.4);
  rect(B, 4, 3, 14, 2, "dunkel", 2); rect(B, 7, 1, 8, 2, "dunkel", 3); rect(B, 16, 4, 1, 4, "gelb", 3); setze(B, 16, 8, "gelb", 4);
  [8, 13].forEach(x => rect(B, x, 26, 2, 1, "orange", 2));
  return B;
}
// Fuchs Fipsi (sitzt/läuft, 2 Bilder)
export function fipsi(s = 0) {
  const B = bild(26, 19);
  kugel(B, 5.5, 8, 4.8, 3.2, "orange", 1, 4); kugel(B, 2.6, 6.5, 2.2, 1.9, "creme", 2, 4);
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
// Robo Pixel: runder Kopf mit Bildschirm-Gesicht, Antenne, schwebt
export function robo(f = 0) {
  const B = bild(20, 28);
  rect(B, 9, 1, 2, 4, "stein", 2); kugel(B, 10, 1.5, 1.6, 1.6, f ? "gelb" : "rot", 2, 4);
  kugel(B, 10, 10, 8, 6, "blau", 1.2, 4);
  fuelle(B, 4, 7, 16, 13, (x, y) => ((x - 10) / 5.6) ** 2 + ((y - 10) / 3.2) ** 2 <= 1, "dunkel", 1);
  [7, 13].forEach(x => { rect(B, x - 1, 9, 2, 2, "gruen", 4); });
  rect(B, 8, 12, 4, 1, "gruen", 3);
  kugel(B, 10, 21, 6, 5, "stein", 1.2, 4); rect(B, 8, 19, 4, 3, "glas", 3); setze(B, 8, 19, "glas", 4);
  kugel(B, 3, 19, 2, 2.6, "stein", 1, 3); kugel(B, 17, 19, 2, 2.6, "stein", 1, 3);
  ellipse(B, 10, 26.5, 4, 1.2, "glas", f ? 4 : 3);
  return B;
}
// Bärin Bruni: braun, runde Ohren, helle Schnauze, Herz auf dem Bauch
export function baer(f = 0) {
  const B = bild(24, 28);
  kugel(B, 5, 4, 3, 3, "holz", 1, 3.6); kugel(B, 19, 4, 3, 3, "holz", 1, 3.6); setze(B, 5, 4, "rosa", 3); setze(B, 19, 4, "rosa", 3);
  kugel(B, 12, 19, 9, 8.5, "holz", 1.2, 4);
  ellipse(B, 12, 20, 5, 5, "sand", (x, y) => 4 - (y - 15) / 10);
  kugel(B, 12, 19, 2, 1.8, "rosa", 2, 4);
  kugel(B, 3.5, 18 - f, 2.6, 4, "holz", 1, 3); kugel(B, 20.5, 18 + f, 2.6, 4, "holz", 1, 3);
  kugel(B, 12, 9, 7.5, 6, "holz", 1.3, 4);
  ellipse(B, 12, 11.5, 3.2, 2.4, "sand", 3.6); setze(B, 12, 10, "dunkel", 0); setze(B, 11, 10, "dunkel", 1);
  augenPaar(B, 8, 15, 7);
  [7, 15].forEach(x => rect(B, x, 26, 3, 2, "holz", 1));
  return B;
}
// Biber Benno: braun mit flachem Schwanz, große Zähne, kleiner Bleistift hinterm Ohr
export function biber(f = 0) {
  const B = bild(24, 24);
  ellipse(B, 18, 20, 5, 3, "holz", (x, y) => (Math.floor(x + y) % 3 === 0 ? 0.8 : 1.8));
  kugel(B, 11, 16, 7, 6.5, "haar", 1.2, 4);
  ellipse(B, 11, 17, 4, 4, "sand", 3.4);
  kugel(B, 11, 7, 6, 5.2, "haar", 1.3, 4); kugel(B, 6, 3, 1.6, 1.6, "haar", 1, 3); kugel(B, 16, 3, 1.6, 1.6, "haar", 1, 3);
  ellipse(B, 11, 9.5, 3, 2, "sand", 3.8); setze(B, 11, 8, "dunkel", 0);
  rect(B, 10, 11, 2, 2, "weiss", 4); setze(B, 10, 12, "weiss", 2);
  augenPaar(B, 8, 13, 6);
  rect(B, 16, 2, 5, 1, "gelb", 3); setze(B, 21, 2, "rosa", 3);
  kugel(B, 5, 15 - f, 1.8, 2.6, "haar", 1, 3); kugel(B, 17, 15 + f, 1.8, 2.6, "haar", 1, 3);
  [7, 13].forEach(x => rect(B, x, 22, 3, 2, "holz", 1));
  return B;
}
// Tilda, die Schildkröte (von schräg oben)
export function tilda(f = 0) {
  const B = bild(22, 15);
  [[4, 12], [16, 12], [5, 5], [15, 5]].forEach(([x, y]) => kugel(B, x, y, 2, 1.8, "gruen", 2, 4));
  kugel(B, 10, 8, 8, 5.5, "gruen", 0.8, 3.4);
  for (let i = 0; i < 3; i++) { kugel(B, 6 + i * 4, 7, 1.6, 1.4, "gruen", 1, 2); }
  kugel(B, 19, 8 - f, 3, 2.6, "gruen", 2, 4); setze(B, 20, 7 - f, "dunkel", 0);
  return B;
}
// Papagei Paula: rot, grüne Flügel, lila Mütze
export function paula(f = 0) {
  const B = bild(16, 24);
  vieleck(B, [[7, 20], [9, 20], [10, 23], [6, 23]], "blau", 3);
  kugel(B, 8, 15, 5, 6, "rot", 1.2, 4); ellipse(B, 8, 16, 2.6, 3.4, "orange", 3.6);
  kugel(B, 3, 14 - f, 1.8, 4, "gruen", 1, 3.6); kugel(B, 13, 14 + f, 1.8, 4, "gruen", 1, 3.6);
  kugel(B, 8, 7, 4.5, 4, "rot", 1.3, 4); ellipse(B, 8.5, 7.5, 2.4, 2, "creme", 4);
  setze(B, 7, 6, "dunkel", 0); setze(B, 10, 6, "dunkel", 0);
  vieleck(B, [[8, 8], [11, 9], [8, 11]], "gelb", 3.6);
  rect(B, 4, 2, 9, 2, "lila", 2); kugel(B, 9, 1.5, 1.4, 1.2, "lila", 2, 4);
  return B;
}

// ---------- Kind aus den Kleiderschrank-Daten ----------
// look = Kleiderschrank-Daten (anziehen.aktuell): figur.farbe, haare.id/farbe, oberteil/unterteil/kleid/schuhe.farbe
// Liefert die Farbreihen; kind(F, richtung, schritt) zeichnet eins von 3×3 Bildern (vorn/hinten/seite × stehen/links/rechts)
export function kindFarben(look) {
  const lk = look || {}, f = (o, d) => (o && o.farbe) || d;
  const kurz = lk.haare && /kurz|bob|dutt|spacebuns/.test(lk.haare.id || "");
  return {
    haut: naechsteReihe(f(lk.figur, "#F8D2B8"), ["haut", "haut2", "haut3"]),
    haar: naechsteReihe(f(lk.haare, "#8A5232"), ["haar", "gelb", "dunkel", "orange", "rot", "rosa", "lila", "blau", "weiss"]),
    oben: naechsteReihe(lk.kleid ? f(lk.kleid, "#FF9BC8") : f(lk.oberteil, "#FF9BC8")),
    unten: naechsteReihe(lk.kleid ? f(lk.kleid, "#FF9BC8") : f(lk.unterteil, "#7B55B8")),
    schuhe: naechsteReihe(f(lk.schuhe, "#E0574A"), ["rot", "blau", "weiss", "dunkel", "rosa", "gelb", "gruen", "lila", "orange"]),
    lang: !kurz,
    rock: !!lk.kleid || /rock|kleid/.test((lk.unterteil && lk.unterteil.id) || "")
  };
}
export function kind(F, r, s) {
  const B = bild(18, 29);
  const l = s === 1, rr = s === 2, haut = F.haut, schuh = F.schuhe;
  const beinFarbe = F.rock ? haut : F.unten;
  if (r === "seite") {
    const hx = l ? 6 : rr ? 9 : 7, vx = l ? 10 : rr ? 7 : 9;
    rect(B, hx, 21, 2, 4, beinFarbe, 2); rect(B, hx - 1, 25, 3, 2, schuh, 1);
    rect(B, vx, 21, 2, 4, beinFarbe, 3); rect(B, vx, 25, 3, 2, schuh, 2); setze(B, vx + 1, 25, schuh, 3);
  } else {
    rect(B, 6, 21, 2, l ? 3 : 4, beinFarbe, 3); rect(B, 6, l ? 24 : 25, 2, 2, schuh, 2); setze(B, 6, l ? 24 : 25, schuh, 3);
    rect(B, 10, 21, 2, rr ? 3 : 4, beinFarbe, 2); rect(B, 10, rr ? 24 : 25, 2, 2, schuh, 2);
  }
  if (F.rock) vieleck(B, [[4, 21.5], [6, 16], [12, 16], [14, 21.5]], F.unten, (x, y) => (y > 20 ? 3.8 : 3.4) - (x - 4) / 10 * 1.8);
  else fuelle(B, 5, 16, 12, 21, (x, y) => !(y > 19 && x > 8 && x < 10), F.unten, x => 3.4 - (x - 5) / 8 * 1.6);
  fuelle(B, 5, 13, 12, 16, () => true, F.oben, x => 3.6 - (x - 5) / 8 * 1.6); rect(B, 6, 16, 6, 1, F.oben, 1);
  if (r === "seite") { const ax = l ? 10 : rr ? 7 : 8; rect(B, ax, 14, 2, 4, F.oben, 2); rect(B, ax, 18, 2, 1, haut, 3); }
  else { rect(B, 3, 13, 2, 4, F.oben, 3); rect(B, 13, 13, 2, 4, F.oben, 2); rect(B, 3, rr ? 16 : 17, 2, 1, haut, 3); rect(B, 13, l ? 16 : 17, 2, 1, haut, 2); }
  const hr = F.haar;
  if (r === "vorn") {
    if (F.lang) { rect(B, 2, 7, 3, 8, hr, 1); rect(B, 13, 7, 3, 8, hr, 1); }
    kugel(B, 9, 6.5, 7.2, 6.4, hr, 1, 4);
    fuelle(B, 3, 6, 15, 13, (x, y) => ((x - 9) / 5.6) ** 2 + ((y - 8.6) / 4.6) ** 2 <= 1 && y > 6 + (Math.floor(x) % 3 === 0 ? 1 : 0), haut, x => 3.7 - (x - 3) / 12 * 1.2);
    [[6, 8], [11, 8]].forEach(([x, y]) => { setze(B, x, y, "dunkel", 0); setze(B, x, y + 1, "blau", 1); setze(B, x + 1, y, "weiss", 4); setze(B, x + 1, y + 1, "dunkel", 0); });
    setze(B, 5, 11, "rosa", 3); setze(B, 13, 11, "rosa", 3); setze(B, 9, 11, "rot", 2);
  } else if (r === "hinten") {
    if (F.lang) rect(B, 3, 8, 12, 8, hr, 1);
    kugel(B, 9, 7, 7.2, 6.8, hr, 1, 4);
    if (F.lang) fuelle(B, 3, 9, 15, 16, (x, y) => y < 16 - Math.abs(x - 9) * 0.3, hr, x => 2.8 - (x - 3) / 12 * 1.4);
  } else {
    if (F.lang) rect(B, 3, 7, 4, 9, hr, 1);
    kugel(B, 8.5, 6.5, 6.8, 6.4, hr, 1, 4);
    fuelle(B, 8, 5, 16, 13, (x, y) => ((x - 10.8) / 4) ** 2 + ((y - 8.8) / 4.4) ** 2 <= 1 && y > 6, haut, x => 3.8 - (x - 8) / 8);
    rect(B, 7, 6, 3, F.lang ? 7 : 4, hr, 2);
    setze(B, 13, 8, "dunkel", 0); setze(B, 13, 9, "blau", 1); setze(B, 15, 10, haut, 3); setze(B, 12, 11, "rosa", 3);
  }
  for (let x = 4; x < 14; x++) { const y = Math.round(3 + ((x - 8.5) / 6) ** 2 * 3); const f = B.p[y * B.b + x]; if (f >= 0 && REIHE[f] === hr) setze(B, x, y, hr, 4); }
  return B;
}

// ---------- Haustier (Fuchs, Kätzchen, Drache), 2 Bilder ----------
// farben = Reihen { h: Fell, l: hell, d: dunkel }; stufe 0…2 = Größe
export function tierFarben(f) {
  const n = (h, d) => naechsteReihe(h || d, ["orange", "rot", "gelb", "creme", "weiss", "haar", "holz", "stein", "dunkel", "rosa", "lila", "blau", "gruen"]);
  return { h: n(f && f.h, "#FF9E5E"), l: n(f && f.l, "#FFFFFF"), d: n(f && f.d, "#6E3F2A") };
}
export function tier(art, F, s, stufe = 2) {
  const k = [0.75, 0.88, 1][Math.max(0, Math.min(2, stufe))];
  const B = bild(24, 20), sx = (v) => 12 + (v - 12) * k, sy = (v) => 19 - (19 - v) * k;
  const beine = s ? [[8, 17], [11, 18], [14, 18], [17, 17]] : [[8, 18], [11, 17], [14, 17], [17, 18]];
  beine.forEach(([x, y], i) => rect(B, sx(x), sy(14), 2, (y - 14) * k + 1, F.d, i % 2 ? 1 : 2));
  if (art === "katze") for (let i = 0; i < 7; i++) setze(B, sx(5 - i * 0.3), sy(12 - i), F.h, 2);
  else if (art === "drache") { vieleck(B, [[sx(7), sy(12)], [sx(1), sy(10)], [sx(7), sy(15)]], F.h, 2.6); [[9, 9], [12, 8.5], [15, 9]].forEach(([x, y]) => vieleck(B, [[sx(x - 1.5), sy(y + 1)], [sx(x), sy(y - 2)], [sx(x + 1.5), sy(y + 1)]], F.d, 3)); }
  else { kugel(B, sx(5), sy(11), 4.2 * k, 2.8 * k, F.h, 1, 4); kugel(B, sx(2.6), sy(10), 1.8 * k, 1.6 * k, F.l, 2, 4); }
  kugel(B, sx(12), sy(13), 6 * k, 3.6 * k, F.h, 1, 4);
  ellipse(B, sx(12), sy(14.5), 3.6 * k, 1.4 * k, F.l, 3.4);
  if (art === "drache") [[sx(16), sy(6)], [sx(19), sy(6)]].forEach(([x, y]) => vieleck(B, [[x - 1, y + 1], [x, y - 2], [x + 1, y + 1]], "creme", 3.6));
  else { vieleck(B, [[sx(15), sy(7)], [sx(16), sy(2.5)], [sx(17.5), sy(6.5)]], F.h, 3.2); vieleck(B, [[sx(18), sy(6.5)], [sx(19.6), sy(2.5)], [sx(20.5), sy(7)]], F.h, 2.4); }
  kugel(B, sx(18), sy(10), 4.2 * k, 3.6 * k, F.h, 1, 4);
  ellipse(B, sx(20), sy(11.5), 2.2 * k, 1.5 * k, F.l, 3.8);
  setze(B, sx(21.6), sy(11), art === "katze" ? "rosa" : "dunkel", art === "katze" ? 3 : 0);
  setze(B, sx(18.6), sy(9), "dunkel", 0); setze(B, sx(19.3), sy(8.4), "weiss", 4);
  return B;
}
// rote Schleife fürs Tier (Weihnachtsgeschenk)
export function schleife() { const B = bild(8, 5); kugel(B, 2, 2.5, 2, 2, "rot", 2, 4); kugel(B, 6, 2.5, 2, 2, "rot", 2, 4); rect(B, 3, 1, 2, 3, "rot", 1); return B; }

// ---------- Zimmer ----------
export function bett() {
  const B = bild(32, 44);
  fuelle(B, 1, 2, 30, 42, () => true, "holz", (x, y) => 3 - (x - 1) / 30 - (y < 6 ? -0.6 : 0));
  fuelle(B, 3, 6, 28, 39, () => true, "glas", (x, y) => (y < 18 ? 4 : 3.4 - (x - 3) / 26 * 1.2 - ((y - 18) % 6 === 0 ? 0.8 : 0)));
  ellipse(B, 15.5, 11, 9, 4, "weiss", (x, y) => 4 - (y - 7) / 10);
  return B;
}
export function schrank() {
  const B = bild(34, 44);
  fuelle(B, 1, 2, 32, 42, () => true, "rosa", (x, y) => (y < 6 ? 2 : 1.6 - (x - 1) / 40));
  [[4, 16], [18, 31]].forEach(([a, b]) => fuelle(B, a, 8, b, 40, () => true, "rosa", (x, y) => 3.4 - (x - a) / 14 * 1.4));
  rect(B, 13, 22, 2, 4, "gelb", 4); rect(B, 19, 22, 2, 4, "gelb", 3); rect(B, 12, 3, 10, 3, "weiss", 4);
  return B;
}
export function spiegel() {
  const B = bild(18, 28);
  fuelle(B, 0, 0, 17, 27, (x, y) => ((x - 8.5) / 8.5) ** 2 + ((y - 13.5) / 13.5) ** 2 <= 1, "gelb", (x, y) => 4 - (x + y) / 30);
  fuelle(B, 2, 2, 15, 25, (x, y) => ((x - 8.5) / 6.5) ** 2 + ((y - 13.5) / 11.5) ** 2 <= 1, "glas", (x, y) => ((x - y + 30) % 10 < 2 ? 4 : 3));
  return B;
}
export function album() { const B = bild(14, 11); fuelle(B, 0, 0, 13, 10, () => true, "rosa", (x) => 3.2 - x / 13); rect(B, 2, 1, 10, 9, "creme", 4); kugel(B, 7, 5, 2, 2, "gelb", 2, 4); return B; }
export function teppich() { const B = bild(60, 34); ellipse(B, 30, 17, 29, 16, "lila", (x, y) => ((x * 3 + y * 5) % 11 < 2 ? 2 : 3.4)); ellipse(B, 30, 17, 22, 11, "lila", 4); return B; }
export function tannenbaum(f = 0) {
  const B = tanne(0.9);
  const L = [[9, 14], [16, 18], [7, 24], [14, 28], [19, 26], [10, 33], [17, 34], [5, 31]];
  L.forEach(([x, y], i) => kugel(B, x, y, 1.3, 1.3, ["gelb", "rot", "blau", "rosa"][(i + f) % 4], 3, 4));
  kugel(B, 13, 3, 2.2, 2.2, "gelb", 3, 4);
  return B;
}

// ---------- Möbel zum Einrichten (NA-28), gleiche ids wie K.MOEBEL ----------
export const MOEBEL_BILD = {
  lampe() { const B = bild(16, 34); ellipse(B, 8, 31, 6, 2, "stein", 2); rect(B, 7, 10, 2, 21, "stein", 2); vieleck(B, [[2, 12], [5, 2], [11, 2], [14, 12]], "gelb", (x) => 3.8 - (x - 2) / 12 * 1.4); ellipse(B, 8, 12, 6, 1.4, "gelb", 2); return B; },
  baer() { const B = bild(18, 22); kugel(B, 4, 4, 2.4, 2.4, "orange", 1, 3); kugel(B, 14, 4, 2.4, 2.4, "orange", 1, 3); kugel(B, 9, 15, 6.5, 6, "orange", 1.2, 4); ellipse(B, 9, 16, 3.4, 3.4, "creme", 3.6); kugel(B, 9, 7, 5.5, 4.8, "orange", 1.3, 4); ellipse(B, 9, 9, 2.4, 1.8, "creme", 4); setze(B, 9, 8, "dunkel", 0); setze(B, 6, 6, "dunkel", 0); setze(B, 12, 6, "dunkel", 0); kugel(B, 3, 19, 2.4, 2, "orange", 1, 3); kugel(B, 15, 19, 2.4, 2, "orange", 1, 3); return B; },
  sitzsack() { const B = bild(24, 18); kugel(B, 12, 11, 11, 6.5, "gruen", 1, 4); kugel(B, 12, 6, 8, 4.5, "gruen", 1.6, 4); setze(B, 8, 4, "weiss", 4); return B; },
  kiste() { const B = bild(22, 18); fuelle(B, 1, 7, 20, 17, () => true, "blau", (x) => 3.4 - (x - 1) / 20 * 1.4); rect(B, 1, 7, 20, 1, "blau", 4); kugel(B, 6, 5, 3, 3, "rosa", 1.4, 4); fuelle(B, 10, 1, 15, 6, () => true, "gelb", 3.4); vieleck(B, [[16, 7], [18, 1], [20, 7]], "gruen", 3); return B; },
  korb() { const B = bild(24, 14); ellipse(B, 12, 8, 11, 5.5, "holz", (x, y) => ((x + y) % 3 === 0 ? 2 : 3.2)); ellipse(B, 12, 7, 8.5, 3.5, "rosa", (x, y) => 3.8 - (y - 4) / 6); return B; },
  globus() { const B = bild(16, 26); fuelle(B, 3, 17, 12, 25, () => true, "holz", (x) => 3.4 - (x - 3) / 10 * 1.6); rect(B, 7, 14, 2, 3, "gelb", 3); kugel(B, 8, 8, 6, 6, "blau", 1.4, 4); [[6, 6, 2.2, 1.6], [10, 9, 1.8, 2.2], [7, 11, 1.4, 1]].forEach(([x, y, rx, ry]) => kugel(B, x, y, rx, ry, "gruen", 2, 4)); return B; },
  regal() { const B = bild(24, 34); fuelle(B, 0, 0, 23, 33, () => true, "holz", (x, y) => (x < 2 || x > 21 || y < 2 || y > 31 || y % 10 === 0 ? 2 : 1)); const F = ["rot", "gruen", "blau", "gelb", "lila"]; [3, 13, 23].forEach((y0, j) => { let x = 3; for (let i = 0; i < 6; i++) { if ((i + j) % 4 === 3) { x += 2; continue; } const h = 7 - (i % 2); rect(B, x, y0 + 8 - h, 3, h, F[(i + j) % 5], 3); setze(B, x, y0 + 8 - h, F[(i + j) % 5], 4); x += 3; } }); return B; },
  staffelei(bunt = true) { const B = bild(20, 32); vieleck(B, [[3, 31], [5, 31], [10, 2], [9, 2]], "holz", 3); vieleck(B, [[17, 31], [15, 31], [10, 2], [11, 2]], "holz", 2.4); rect(B, 2, 20, 16, 2, "holz", 2); fuelle(B, 3, 5, 16, 19, () => true, "weiss", 4); rect(B, 3, 5, 14, 1, "weiss", 2); if (bunt) { kugel(B, 7, 10, 2.4, 2, "rosa", 2, 4); kugel(B, 12, 13, 2.6, 2, "gelb", 2, 4); kugel(B, 9, 16, 2, 1.6, "gruen", 2, 4); } return B; },
  tisch() { const B = bild(30, 26); [[2, 12], [26, 12]].forEach(([x, y]) => rect(B, x, y, 2, 12, "holz", 1)); fuelle(B, 0, 4, 29, 12, () => true, "holz", (x, y) => (y < 6 ? 4 : 3.2 - (x / 30))); rect(B, 4, 5, 8, 5, "weiss", 4); rect(B, 22, 1, 3, 6, "rot", 3); fuelle(B, 10, 15, 20, 25, (x, y) => y > 18 || Math.abs(x - 15) < 5, "blau", (x, y) => (y < 19 ? 3.6 : 2.6)); return B; },
  aquarium() { const B = bild(28, 26); fuelle(B, 0, 17, 27, 25, () => true, "holz", (x) => 3.2 - x / 28 * 1.4); fuelle(B, 1, 1, 26, 17, () => true, "glas", (x, y) => (y < 3 ? 4 : y > 14 ? 2 : 3 + ((x - y + 40) % 13 < 2 ? 1 : 0))); rect(B, 1, 15, 26, 2, "sand", 3); [[5, 14], [22, 13]].forEach(([x, y]) => vieleck(B, [[x - 1, y + 2], [x, y - 7], [x + 1, y + 2]], "gruen", 2.6)); return B; },
  tannenbaum() { return tannenbaum(0); }
};
// Fisch fürs Aquarium (2 Bilder: schwimmt links/rechts wird über Spiegeln gelöst)
export function fisch(reihe) { const B = bild(7, 5); kugel(B, 3, 2.5, 2.6, 1.8, reihe, 1.6, 4); vieleck(B, [[5, 2.5], [7, 0], [7, 5]], reihe, 2.4); setze(B, 2, 2, "dunkel", 0); return B; }
// Pinnwand mit Zetteln (Farben je Fach), heute gelernte golden umrandet
export function pinnwand(zettel) {
  const B = bild(40, 26);
  fuelle(B, 0, 0, 39, 25, () => true, "holz", (x, y) => (x < 2 || x > 37 || y < 2 || y > 23 ? 1.4 : 3 + (hash(x, y, 21) < 0.2 ? -0.8 : 0)));
  const F = { mathe: "gruen", deutsch: "rot", sachkunde: "glas", tablet: "blau" };
  zettel.slice(0, 8).forEach((z, i) => {
    const x = 4 + (i % 4) * 8.5, y = 4 + Math.floor(i / 4) * 10;
    if (z.neu) rect(B, x - 1, y - 1, 8, 8, "gelb", 4);
    rect(B, x, y, 6, 6, z.gemeistert ? "gelb" : F[z.fach] || "creme", z.gemeistert ? 3 : 4);
    rect(B, x + 1, y + 2, 4, 1, "dunkel", 3); setze(B, x + 3, y, "rosa", 2);
  });
  return B;
}
// Rahmen für ein gemaltes Bild (Poster); das Bild selbst wird auf die Palette verkleinert (bildAusFoto)
export function rahmen(b, h, reihe) { const B = bild(b, h); fuelle(B, 0, 0, b - 1, h - 1, (x, y) => x < 2 || y < 2 || x >= b - 2 || y >= h - 2, reihe, (x, y) => (x + y < b / 2 ? 4 : 2.6)); return B; }
