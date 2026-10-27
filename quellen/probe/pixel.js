// Probe „Pixel-Abenteuer“ mit PixiJS: Draufsicht aus 16×16-Kacheln wie bei Handheld-Abenteuern der 2000er –
// alles eigene Zeichnungen aus dem Code (keine fremden Kacheln oder Figuren). Kind läuft in vier Richtungen.
// Zeichenweg: kleine Formen auf eine Mini-Leinwand malen → auf eine feste Farbpalette einrasten → automatischer dunkler Umriss.
import { messung, zufall } from "./gemeinsam.js";
import { Application, Container, Sprite, Texture, TextureSource, UPDATE_PRIORITY } from "pixi.js";

TextureSource.defaultOptions.scaleMode = "nearest";
const BUEHNE = document.getElementById("buehne");
const app = new Application();
await app.init({ resizeTo: BUEHNE, background: "#3890F8", antialias: false, roundPixels: true, resolution: Math.min(devicePixelRatio || 1, 2), autoDensity: true, preference: "webgl" });
BUEHNE.appendChild(app.canvas);
const zz = zufall(3);

// ---------- Palette (eigene Farben, warm und kräftig) ----------
const PAL = {
  umriss: "#30283A", gras: "#70C850", grasD: "#50A038", grasH: "#98E070", sand: "#F0D890", sandD: "#D8B868", weg: "#E8D0A0", wegD: "#C8A878",
  wasser: "#4898F0", wasserH: "#88C8F8", schaum: "#F0F8FF", stamm: "#9A6A3F", stammD: "#704828", laub: "#48A848", laubD: "#307830", laubH: "#80D068",
  frucht: "#F05850", wand: "#F8E0B0", wandD: "#D8B888", dach: "#E05040", dachD: "#B03830", tuer: "#8A5A30", glas: "#90D0F8",
  stein: "#A8A8C0", steinD: "#787890", rosa: "#FF88C0", rosaD: "#D05898", lila: "#8060C8", lilaD: "#5840A0", haut: "#F8D0B0", hautD: "#E0A888",
  haar: "#8A5A34", haarH: "#B07A4A", auge: "#2E2240", weiss: "#FFFFFF", schuh: "#C83878", orange: "#F08838", orangeD: "#C86018", creme: "#FFF0E0",
  gelb: "#F8D048", blau: "#5878E8"
};
const PALRGB = Object.values(PAL).map(h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);
function pixelbild(b, h, malen, { umriss = true } = {}) {
  const c = document.createElement("canvas"); c.width = b; c.height = h;
  const g = c.getContext("2d"); g.imageSmoothingEnabled = false; malen(g, b, h);
  const d = g.getImageData(0, 0, b, h), p = d.data;
  for (let i = 0; i < p.length; i += 4) {           // auf die Palette einrasten, keine halbdurchsichtigen Ränder
    if (p[i + 3] < 110) { p[i + 3] = 0; continue; }
    let best = 0, bd = 1e9;
    PALRGB.forEach(([r, gg, bb], k) => { const e = (p[i] - r) ** 2 + (p[i + 1] - gg) ** 2 + (p[i + 2] - bb) ** 2; if (e < bd) { bd = e; best = k; } });
    [p[i], p[i + 1], p[i + 2]] = PALRGB[best]; p[i + 3] = 255;
  }
  if (umriss) {                                      // dunkler Umriss außen herum
    const voll = (x, y) => x >= 0 && y >= 0 && x < b && y < h && p[(y * b + x) * 4 + 3] === 255 && !(p[(y * b + x) * 4] === 0x30 && p[(y * b + x) * 4 + 1] === 0x28);
    const neu = [];
    for (let y = 0; y < h; y++) for (let x = 0; x < b; x++) if (p[(y * b + x) * 4 + 3] === 0 && (voll(x - 1, y) || voll(x + 1, y) || voll(x, y - 1) || voll(x, y + 1))) neu.push((y * b + x) * 4);
    neu.forEach(i => { p[i] = 0x30; p[i + 1] = 0x28; p[i + 2] = 0x3A; p[i + 3] = 255; });
  }
  g.putImageData(d, 0, 0);
  return Texture.from(c);
}
const R = (g, f, x, y, b, h) => { g.fillStyle = f; g.fillRect(x, y, b, h); };
const E = (g, f, x, y, rx, ry) => { g.fillStyle = f; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); g.fill(); };
const punkte = (g, f, n, b = 16, h = 16) => { for (let i = 0; i < n; i++) R(g, f, Math.floor(zz() * b), Math.floor(zz() * h), 1, 1); };

// ---------- Kacheln ----------
const K = {
  gras: [0, 1, 2].map(() => pixelbild(16, 16, g => { R(g, PAL.gras, 0, 0, 16, 16); for (let i = 0; i < 3; i++) { const x = Math.floor(zz() * 13), y = 3 + Math.floor(zz() * 11); R(g, PAL.grasD, x, y, 1, 2); R(g, PAL.grasD, x + 2, y, 1, 2); R(g, PAL.grasD, x + 1, y - 1, 1, 2); } punkte(g, PAL.grasH, 3); }, { umriss: false })),
  blume: [PAL.rosa, PAL.gelb, PAL.weiss, PAL.blau].map(f => pixelbild(16, 16, g => { R(g, PAL.gras, 0, 0, 16, 16); [[4, 5], [11, 10]].forEach(([x, y]) => { R(g, PAL.grasD, x, y + 2, 1, 3); R(g, f, x - 1, y, 3, 1); R(g, f, x, y - 1, 1, 3); R(g, PAL.gelb === f ? PAL.weiss : PAL.gelb, x, y, 1, 1); }); }, { umriss: false })),
  weg: pixelbild(16, 16, g => { R(g, PAL.weg, 0, 0, 16, 16); punkte(g, PAL.wegD, 10); R(g, PAL.wegD, 3, 4, 3, 1); R(g, PAL.wegD, 10, 11, 3, 1); }, { umriss: false }),
  sand: pixelbild(16, 16, g => { R(g, PAL.sand, 0, 0, 16, 16); punkte(g, PAL.sandD, 8); }, { umriss: false }),
  wasser: [0, 1].map(f => pixelbild(16, 16, g => { R(g, PAL.wasser, 0, 0, 16, 16); R(g, PAL.wasserH, 2 + f * 4, 4, 4, 1); R(g, PAL.wasserH, 9 - f * 3, 11, 4, 1); }, { umriss: false })),
  ufer: [0, 1].map(f => pixelbild(16, 16, g => { R(g, PAL.wasser, 0, 0, 16, 16); R(g, PAL.schaum, 0, 0, 16, 2 + f); for (let x = 0; x < 16; x += 4) R(g, PAL.schaum, x + f, 3 + f, 2, 1); }, { umriss: false }))
};
// Dinge (größer als eine Kachel)
const BAUM = pixelbild(32, 40, g => { R(g, PAL.stamm, 13, 24, 6, 14); R(g, PAL.stammD, 17, 24, 2, 14); E(g, PAL.laubD, 16, 17, 14, 12); E(g, PAL.laub, 15, 15, 13, 11); E(g, PAL.laubH, 11, 11, 5, 4); [[9, 18], [21, 14], [18, 22]].forEach(([x, y]) => R(g, PAL.frucht, x, y, 2, 2)); });
const TANNE = pixelbild(24, 40, g => { R(g, PAL.stamm, 10, 30, 4, 9); [[12, 30, 11, 8], [12, 22, 9, 8], [12, 14, 7, 7], [12, 7, 4, 5]].forEach(([x, y, b, h]) => { g.fillStyle = PAL.laubD; g.beginPath(); g.moveTo(x - b, y + h); g.lineTo(x, y - h); g.lineTo(x + b, y + h); g.fill(); g.fillStyle = PAL.laub; g.beginPath(); g.moveTo(x - b + 2, y + h - 1); g.lineTo(x - 1, y - h + 2); g.lineTo(x + b - 4, y + h - 1); g.fill(); }); });
const HAUS = pixelbild(56, 56, g => {
  R(g, PAL.wand, 6, 24, 44, 30); R(g, PAL.wandD, 6, 50, 44, 4);
  g.fillStyle = PAL.dachD; g.beginPath(); g.moveTo(1, 27); g.lineTo(28, 3); g.lineTo(55, 27); g.fill();
  g.fillStyle = PAL.dach; g.beginPath(); g.moveTo(4, 25); g.lineTo(28, 5); g.lineTo(52, 25); g.fill();
  for (let y = 10; y < 25; y += 4) R(g, PAL.dachD, 28 - (y - 5), y, (y - 5) * 2, 1);
  R(g, PAL.tuer, 24, 38, 9, 16); R(g, PAL.gelb, 30, 46, 1, 1);
  [[10, 32], [38, 32]].forEach(([x, y]) => { R(g, PAL.glas, x, y, 9, 8); R(g, PAL.weiss, x + 4, y, 1, 8); R(g, PAL.weiss, x, y + 4, 9, 1); });
  R(g, PAL.dachD, 40, 6, 5, 9);
});
const STEIN = pixelbild(16, 12, g => { E(g, PAL.steinD, 8, 7, 7, 4); E(g, PAL.stein, 7, 6, 6, 3.5); R(g, PAL.weiss, 4, 4, 2, 1); });
// Kind: vorne, hinten, Seite; je zwei Schritte
function kind(richtung, schritt) {
  return pixelbild(16, 24, g => {
    const bein = schritt ? 1 : 0;
    // Beine und Schuhe
    if (richtung === "seite") { R(g, PAL.haut, 6 - bein, 17, 2, 4); R(g, PAL.haut, 8 + bein, 17, 2, 4); R(g, PAL.schuh, 5 - bein, 21, 3, 2); R(g, PAL.schuh, 8 + bein, 21, 3, 2); }
    else { R(g, PAL.haut, 5, 17, 2, 4 - bein); R(g, PAL.haut, 9, 17, 2, 3 + bein); R(g, PAL.schuh, 5, 21 - bein, 2, 2); R(g, PAL.schuh, 9, 20 + bein, 2, 2); }
    // Rock und Oberteil
    g.fillStyle = PAL.lila; g.beginPath(); g.moveTo(4, 18); g.lineTo(6, 13); g.lineTo(10, 13); g.lineTo(12, 18); g.fill(); R(g, PAL.lilaD, 4, 17, 8, 1);
    R(g, PAL.rosa, 5, 11, 6, 3); R(g, PAL.rosaD, 5, 13, 6, 1);
    if (richtung !== "seite") { R(g, PAL.rosa, 3, 11, 2, 3); R(g, PAL.rosa, 11, 11, 2, 3); R(g, PAL.haut, 3, 14 - bein, 2, 1); R(g, PAL.haut, 11, 13 + bein, 2, 1); }
    else { R(g, PAL.rosa, 7 - bein, 11, 2, 3); R(g, PAL.haut, 7 - bein, 14, 2, 1); }
    // Kopf und Haare
    E(g, PAL.haar, 8, 6, 6, 6);
    if (richtung === "vorn") { R(g, PAL.haut, 4, 5, 8, 6); R(g, PAL.hautD, 4, 10, 8, 1); R(g, PAL.haar, 4, 3, 8, 3); R(g, PAL.auge, 5, 7, 1, 2); R(g, PAL.auge, 10, 7, 1, 2); R(g, PAL.rosaD, 7, 9, 2, 1); R(g, PAL.haar, 2, 5, 2, 7); R(g, PAL.haar, 12, 5, 2, 7); }
    if (richtung === "hinten") { R(g, PAL.haar, 3, 4, 10, 8); R(g, PAL.haarH, 6, 2, 4, 2); R(g, PAL.haar, 3, 10, 2, 3); R(g, PAL.haar, 11, 10, 2, 3); }
    if (richtung === "seite") { R(g, PAL.haut, 8, 5, 5, 6); R(g, PAL.hautD, 8, 10, 4, 1); R(g, PAL.haar, 6, 2, 7, 4); R(g, PAL.haar, 3, 4, 5, 9); R(g, PAL.auge, 11, 7, 1, 2); R(g, PAL.haut, 13, 8, 1, 1); }
    R(g, PAL.haarH, 6, 1, 4, 1);
  });
}
const KIND = { vorn: [kind("vorn", 0), kind("vorn", 1)], hinten: [kind("hinten", 0), kind("hinten", 1)], seite: [kind("seite", 0), kind("seite", 1)] };
function fuchsBild(schritt) {
  return pixelbild(20, 16, g => {
    E(g, PAL.orange, 4, 6, 4, 3); E(g, PAL.creme, 2, 5, 2, 2);                         // Schwanz
    E(g, PAL.orange, 10, 9, 5, 3); R(g, PAL.creme, 8, 10, 5, 2);                      // Körper
    R(g, PAL.stammD, 6 + schritt, 12, 2, 3); R(g, PAL.stammD, 12 - schritt, 12, 2, 3);
    E(g, PAL.orange, 15, 6, 4, 4); R(g, PAL.creme, 16, 7, 4, 2); R(g, PAL.auge, 19, 7, 1, 1);
    g.fillStyle = PAL.orange; g.beginPath(); g.moveTo(12, 4); g.lineTo(13, -1); g.lineTo(15, 3); g.fill(); g.beginPath(); g.moveTo(15, 3); g.lineTo(17, -1); g.lineTo(18, 4); g.fill();
    R(g, PAL.auge, 16, 5, 1, 1);
  });
}
const FUCHS = [fuchsBild(0), fuchsBild(1)];

// ---------- Karte ----------
const BREITE = 40, HOEHE = 30, T = 16;
const karte = [];          // Bodenart je Feld
const fest = new Set();    // Felder, die blockieren
const cx = 20, cy = 15;
const insel = (x, y) => ((x + 0.5 - cx) / 15) ** 2 + ((y + 0.5 - cy) / 11) ** 2;
for (let y = 0; y < HOEHE; y++) for (let x = 0; x < BREITE; x++) {
  const d = insel(x, y);
  karte.push(d < 0.72 ? "gras" : d < 1 ? "sand" : "wasser");
  if (d >= 1) fest.add(y * BREITE + x);
}
const art = (x, y) => (x < 0 || y < 0 || x >= BREITE || y >= HOEHE) ? "wasser" : karte[y * BREITE + x];
// Weg von der Haustür nach unten und dann nach Osten
[[11, 13], [11, 14]].concat(Array.from({ length: 14 }, (_, i) => [12 + i, 14])).forEach(([x, y]) => { if (art(x, y) === "gras") karte[y * BREITE + x] = "weg"; });

const boden = new Container(), dinge = new Container(); dinge.sortableChildren = true;
const welt = new Container(); welt.addChild(boden, dinge); app.stage.addChild(welt);
const wasserSprites = [];
for (let y = -6; y < HOEHE + 6; y++) for (let x = -10; x < BREITE + 10; x++) {
  const a = art(x, y); let tex;
  if (a === "wasser") { const ufer = art(x, y - 1) === "sand"; tex = (ufer ? K.ufer : K.wasser)[(x + y) & 1]; }
  else if (a === "gras") tex = zz() < 0.08 ? K.blume[Math.floor(zz() * 4)] : K.gras[Math.floor(zz() * 3)];
  else tex = K[a];
  const s = new Sprite(tex); s.position.set(x * T, y * T); boden.addChild(s);
  if (a === "wasser") { s.ufer = art(x, y - 1) === "sand"; s.phase = (x + y) & 1; wasserSprites.push(s); }
}
function stelle(tex, fx, fy, blockB = 1, blockH = 1) {
  const s = new Sprite(tex); s.anchor.set(0.5, 1); s.position.set(fx * T + T / 2, (fy + 1) * T); s.zIndex = s.y; dinge.addChild(s);
  for (let i = 0; i < blockB; i++) for (let j = 0; j < blockH; j++) fest.add((fy - j) * BREITE + fx - Math.floor(blockB / 2) + i);
  return s;
}
stelle(HAUS, 11, 12, 3, 2);
[[6, 10, 0], [8, 18, 1], [28, 8, 0], [31, 14, 1], [26, 21, 0], [16, 22, 0], [7, 14, 1], [23, 6, 1], [33, 18, 0], [16, 10, 0], [21, 11, 1], [27, 12, 0], [14, 19, 0], [20, 20, 1], [24, 17, 0]].forEach(([x, y, t]) => stelle(t ? TANNE : BAUM, x, y, t ? 1 : 2, 1));
[[22, 16], [23, 16], [10, 20], [30, 11]].forEach(([x, y]) => stelle(STEIN, x, y));

// Figuren
const ich = new Sprite(KIND.vorn[0]); ich.anchor.set(0.5, 1); dinge.addChild(ich);
const fuchs = new Sprite(FUCHS[0]); fuchs.anchor.set(0.5, 1); dinge.addChild(fuchs);
const pos = { x: 18 * T + 8, y: 15 * T + 14 }, fpos = { x: 16 * T, y: 16 * T };
let richtung = "vorn", spiegeln = 1;

// Steuerung: Antippen → hinlaufen (achsenweise, Hindernisse umgehen so gut es geht)
let ziel = null, skala = 3;
app.stage.eventMode = "static"; app.stage.hitArea = app.screen;
app.stage.on("pointertap", (e) => { const l = welt.toLocal(e.global); ziel = { x: l.x, y: l.y }; tippText(); });
const frei = (px, py) => !fest.has(Math.floor(py / T) * BREITE + Math.floor(px / T)) && !fest.has(Math.floor(py / T) * BREITE + Math.floor((px - 5) / T)) && !fest.has(Math.floor(py / T) * BREITE + Math.floor((px + 5) / T));

function layout() {
  const w = app.screen.width, h = app.screen.height;
  // ganze Vergrößerung, damit die Pixel scharf bleiben: etwa 15 Felder breit / 11 hoch sichtbar
  skala = Math.max(2, Math.round(Math.min(w / (T * 18), h / (T * 12.5))));
  welt.scale.set(skala);
}
app.renderer.on("resize", layout); layout();

// Textfeld wie in alten Abenteuern
const box = document.createElement("div");
box.className = "pixelbox";
box.innerHTML = "<b>Fipsi</b><br>Hallo! Tippe irgendwohin, dann laufen wir los!";
document.body.appendChild(box);
function tippText() { box.hidden = true; }

const mess = messung("PixiJS · Pixel-Abenteuer", "pixel.js");
let t = 0, wTakt = 0;
app.ticker.add((tk) => {
  const dt = Math.min(tk.deltaMS / 1000, 0.05); t += dt;
  let geht = false;
  if (ziel) {
    const dx = ziel.x - pos.x, dy = ziel.y - pos.y, v = 70 * dt;
    if (Math.abs(dx) < 1.5 && Math.abs(dy) < 1.5) ziel = null;
    else {
      // erst die längere Achse, bei Hindernis die andere
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
  const schritt = geht ? Math.floor(t * 8) % 2 : 0;
  ich.texture = KIND[richtung][schritt]; ich.scale.x = richtung === "seite" ? spiegeln : 1;
  ich.position.set(Math.round(pos.x), Math.round(pos.y)); ich.zIndex = ich.y;
  // Fuchs folgt
  const fx = pos.x - spiegeln * 14 - fpos.x, fy = pos.y + 2 - fpos.y, fd = Math.hypot(fx, fy);
  const laeuft = fd > 6;
  if (laeuft) { const s = Math.min(fd - 6, (fd > 40 ? 110 : 66) * dt); fpos.x += fx / fd * s; fpos.y += fy / fd * s; if (Math.abs(fx) > 1) fuchs.scale.x = Math.sign(fx); }
  fuchs.texture = FUCHS[laeuft ? Math.floor(t * 10) % 2 : 0];
  fuchs.position.set(Math.round(fpos.x), Math.round(fpos.y)); fuchs.zIndex = fuchs.y;
  // Wasser in zwei Bildern (wie bei alten Konsolen)
  wTakt += dt; if (wTakt > 0.5) { wTakt = 0; wasserSprites.forEach(s => { s.phase ^= 1; s.texture = (s.ufer ? K.ufer : K.wasser)[s.phase]; }); }
  // Kamera: ganzzahlig, damit nichts flimmert
  const sw = app.screen.width / skala, sh = app.screen.height / skala;
  const kx = Math.max(sw / 2 - 10 * T, Math.min(BREITE * T + 10 * T - sw / 2, pos.x)), ky = Math.max(sh / 2 - 6 * T, Math.min(HOEHE * T + 6 * T - sh / 2, pos.y - 8));
  welt.position.set(Math.round(app.screen.width / 2 - kx * skala), Math.round(app.screen.height / 2 - ky * skala));
}, null, UPDATE_PRIORITY.HIGH);
app.ticker.add(() => mess.tick(), null, UPDATE_PRIORITY.UTILITY);
window.__probe = { name: "PixiJS · Pixel-Abenteuer", info: mess.info, laufeZu: (x, y) => { ziel = { x: x * T, y: y * T }; } };
