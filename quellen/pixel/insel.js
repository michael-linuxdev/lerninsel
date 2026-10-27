// Pixel-Insel (NA-26): dieselbe Heimatinsel wie „Rund“ (quellen/welt3d/heimat.js), gezeichnet im DS-Look mit PixiJS.
// Eine Welt, zwei Darstellungen: Welt, Orte, Stationen, Story, Paket, Nebel, Zimmer-Daten und Wetter kommen aus shared/insel-kern.js.
// Diese Datei zeichnet nur und setzt Eingaben um. Regeln des Looks: docs/GRAFIK.md Abschnitt 2.
//   Maßstab: 1 Welteinheit = 1 Kachel = 16 Pixel; Draufsicht, Norden oben (Weltachse z zeigt nach unten = Süden, dort liegt der Steg).
//   Boden = ein großes Bild in zwei Fassungen (Wasser, Schaum, Blumen bewegen sich), alle Dinge/Figuren in einem Bildatlas.
//   Ganzzahlige Vergrößerung (iPad ×4, Handy ×2) hält die Pixel scharf.
// Test-Parameter wie bei „Rund“: ?stunde=21 ?monat=12 ?wetter=regen ?biom=wald&seed=5 ?drinnen=1 ?szene=probe
import { Application, Container, Sprite, Texture, TextureSource, UPDATE_PRIORITY } from "pixi.js";
import { RGB, farbe, hash, rauschen, raster, atlas, bild, fuelle, schattenBild, SCHATTEN_FARBE, grau, naechsteReihe, leinwand } from "./zeichnen.js";
import * as D from "./dinge.js";

const $ = (id) => document.getElementById(id);
const S = window.Spielwelt, SP = window.Sprache, Z = window.Zeit;
const q = new URLSearchParams(location.search);
const K = window.InselKern, KI = K.erstelle(q);
const { MONAT, SAISON, NACHT, DAEMMER } = K.zeit(q);
const { WELT, P, UFER, RMAX_LAUF, STEG, SU, PAKET_POS } = KI;
const WINTER = SAISON === "winter" || WELT.biom === "schnee";
const RUHIG = !!(Z && Z.regeln && Z.regeln().ruhig);
const name = S.profil.name || "du";
const T = 16;

TextureSource.defaultOptions.scaleMode = "nearest";
const BUEHNE = $("buehne");
const app = new Application();
await app.init({ resizeTo: BUEHNE, background: "#2459B8", antialias: false, roundPixels: true, resolution: Math.min(devicePixelRatio || 1, 2), autoDensity: true, preference: "webgl" });
BUEHNE.appendChild(app.canvas);

// ======================================================================================================
// Bildatlas: alle Dinge und Figuren
// ======================================================================================================
const { merke, packe } = atlas();
const BIOM = WELT.biom || "wiese";
const LAUB = SAISON === "herbst" ? "herbst" : "laub";
const sch = { k: merke(schattenBild(12, 5), false), m: merke(schattenBild(20, 7), false), g: merke(schattenBild(28, 9), false), h: merke(schattenBild(58, 10), false) };
function wolkeBild() { const B = bild(96, 44); [[30, 24, 26, 15], [58, 20, 24, 15], [74, 27, 18, 11], [44, 30, 26, 11]].forEach(([x, y, rx, ry]) => fuelle(B, x - rx, y - ry, x + rx, y + ry, (a, b) => ((a - x) / rx) ** 2 + ((b - y) / ry) ** 2 <= 1, "dunkel", 0)); return B; }
// Bäume: je Typ zwei Größen (klein/groß), damit die Insel abwechslungsreich bleibt
const BAUM = {};
const baumTex = (typ, k) => {
  const g = k < 0.85 ? 0 : 1, key = typ + g;
  if (!BAUM[key]) {
    const kk = g ? 1 : 0.8;
    BAUM[key] = merke(typ === "nadel" ? D.tanne(kk, { schnee: WINTER }) : typ === "palme" ? D.palme(kk) : typ === "kaktus" ? D.kaktus(kk) : D.laubbaum(LAUB, kk, { schnee: WINTER, fruechte: !WINTER && SAISON !== "fruehling" && hash(key.length, g, 3) < 0.3 }));
  }
  return BAUM[key];
};
const STEINE = {};
const steinTex = (r) => { const k = Math.max(0.5, Math.min(1.4, Math.round(r * 1.7 * 4) / 4)); return STEINE[k] || (STEINE[k] = merke(D.stein(k, BIOM === "wueste" ? "orange" : "stein"))); };
const TX = {
  haus: merke(D.haus({ winter: WINTER, nacht: NACHT || DAEMMER })),
  station: [merke(D.station(0)), merke(D.station(1))],
  schild: merke(D.schild({ mathe: true })),
  steg: merke(D.steg(Math.round((STEG.z1 - STEG.z0) * T))),
  boot: merke(D.boot()),
  sonnenuhr: merke(D.sonnenuhr()),
  sonne: [0, 1, 2].map(s => merke(D.sonne(s))),
  paket: merke(D.paket()),
  truhe: merke(D.truhe()),
  ballons: [merke(D.ballons(0)), merke(D.ballons(1))],
  schach: merke(D.schachtisch()), buehne: merke(D.buehne()),
  schloss: merke(D.schloss()),
  eule: [merke(D.eule(0)), merke(D.eule(1))], fipsi: [merke(D.fipsi(0)), merke(D.fipsi(1))], robo: [merke(D.robo(0)), merke(D.robo(1))],
  baer: [merke(D.baer(0)), merke(D.baer(1))], biber: [merke(D.biber(0)), merke(D.biber(1))], tilda: [merke(D.tilda(0)), merke(D.tilda(1))], paula: [merke(D.paula(0)), merke(D.paula(1))],
  herz: merke(D.herz()), tropfen: merke(D.tropfen(), false), flocke: merke(D.flocke(), false), marke: [merke(D.marke(0), false), merke(D.marke(1), false)],
  licht: ["gelb", "rot", "blau", "gruen"].map(r => merke(D.licht(r), false)),
  schleife: merke(D.schleife()),
  wolke: merke(wolkeBild(), false),
  // Zimmer
  bett: merke(D.bett()), schrank: merke(D.schrank()), spiegel: merke(D.spiegel()), album: merke(D.album()), teppich: merke(D.teppich(), false),
  tannenbaum: [merke(D.tannenbaum(0)), merke(D.tannenbaum(1))],
  moebel: Object.fromEntries(Object.entries(D.MOEBEL_BILD).filter(([id]) => id !== "tannenbaum").map(([id, f]) => [id, merke(f())])),
  fisch: [merke(D.fisch("orange")), merke(D.fisch("gelb"))],
  staffelei: merke(D.MOEBEL_BILD.staffelei(false)), rahmen: merke(D.rahmen(18, 15, "gelb")),
  pinnwand: merke(D.pinnwand(K.pinnwandZettel())),
  ring: merke(D.marke(1), false)
};
// Spielorte (gesperrt in Grau mit Schloss)
const ORT_BILD = { lauf: D.startbogen, kart: D.kart, bau: D.bausteine };
const ORT_TX = {};
["lauf", "kart", "bau"].forEach(id => { const B = ORT_BILD[id](); ORT_TX[id] = merke(K.istFrei(id) ? B : grau(B)); });
// Wissensbaum je Stufe, Früchte je Farbreihe
const L = window.Lernfunde;
const WB_INFO = L ? L.baum() : { stufe: 0, summe: 0 };
const WB_TX = merke(D.wissensbaum(WB_INFO.stufe, SAISON));
const FRUCHT_REIHEN = ["gruen", "rot", "blau", "gelb", "orange", "lila", "rosa"];
const FRUCHT_TX = {}; FRUCHT_REIHEN.forEach(r => { FRUCHT_TX[r] = merke(D.frucht(r)); });
// Kind aus dem Kleiderschrank
const LOOK = (S.lade("anziehen") || {}).aktuell || (window.Figur ? window.Figur.STANDARD() : null);
const KF = D.kindFarben(LOOK);
const KIND = {}; ["vorn", "hinten", "seite"].forEach(r => { KIND[r] = [0, 1, 2].map(s => merke(D.kind(KF, r, s))); });
// Haustier oder Ei im Nest
const TP = window.TierPflege, TIERE = window.Tiere;
const tierDaten = TP ? TP.lade() : null;
const MIT_TIER = !!(tierDaten && tierDaten.phase === "tier" && TIERE && TIERE.ARTEN[tierDaten.art]);
let TIER_TX = null, NEST_TX;
if (MIT_TIER) {
  const A = TIERE.ARTEN[tierDaten.art], f = A.farben[tierDaten.farbe] || A.farben[0], F = D.tierFarben(f), st = TP.stufe ? TP.stufe(tierDaten) : 0;
  TIER_TX = { seite: [0, 1].map(i => merke(D.tier(tierDaten.art, F, i, st))), vorn: [0, 1].map(i => merke(D.tierVorn(tierDaten.art, F, i, st))), hinten: [0, 1].map(i => merke(D.tierHinten(tierDaten.art, F, i, st))) };
  NEST_TX = merke(D.nest(null));
} else if (tierDaten && tierDaten.phase === "ei" && TIERE) {
  const e = TIERE.EIER[tierDaten.ei] || { a: "#FFFFFF", b: "#E0457B" };
  NEST_TX = merke(D.nest({ a: naechsteReihe(e.a, ["creme", "orange", "gruen", "rosa", "weiss", "gelb"]), b: naechsteReihe(e.b) }));
} else NEST_TX = merke(D.nest(null));
// Bäume und Steine der Welt vor dem Packen anlegen (der Atlas ist danach fest)
WELT.baeume.forEach(b => baumTex(b.typ || "laub", b.k));
WELT.steine.forEach(([, , r]) => steinTex(r));
packe();

// ======================================================================================================
// Boden: ein großes Bild aus der Welt des Kerns (Meer, Strand, Gras/Schnee/Sand, Weg, Teich, Hügelstufen, Fels)
// ======================================================================================================
const R = WELT.insel ? 15.2 : WELT.R;
const HALB = Math.ceil(UFER + 10), KARTE = HALB * 2 * T;   // Karte in Pixeln (quadratisch, Mitte = Weltursprung)
const px = (x) => (x + HALB) * T, py = (z) => (z + HALB) * T;   // Welt → Pixel auf der Karte
const GRAS = WINTER ? "schnee" : BIOM === "wueste" ? "sand" : "gras";
const STRAND = BIOM === "wueste" ? "creme" : "sand";
const SANDBREITE = WELT.insel ? 1.7 : Math.min(4.5, WELT.R - WELT.rand) * 0.8;
// Weg: von der Haustür über den Startplatz zum Steg
const TUER = { x: P.haus[0], z: P.haus[1] + 2.0 };
const WEG = [[TUER.x, TUER.z], [P.start[0], P.start[1]], [STEG.x, STEG.z0 - 0.2]];
function wegAbstand(x, z) {
  let best = 99;
  for (let i = 0; i < WEG.length - 1; i++) {
    const [ax, az] = WEG[i], [bx, bz] = WEG[i + 1], dx = bx - ax, dz = bz - az, l = dx * dx + dz * dz;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / l));
    best = Math.min(best, Math.hypot(x - ax - dx * t, z - az - dz * t));
  }
  return best;
}
const welle = (x, z) => (rauschen(x * T, z * T, 40, 3) - 0.5) * 1.3 + (rauschen(x * T, z * T, 9, 4) - 0.5) * 0.3;
// Höhenstufen (nur eigene Welten mit Hügeln): alle 2 Pixel ein Wert
const HS = KARTE / 2, STUFE = new Int8Array(HS * HS);
if (!WELT.insel) for (let j = 0; j < HS; j++) for (let i = 0; i < HS; i++) {
  const x = (i * 2 + 1) / T - HALB, z = (j * 2 + 1) / T - HALB;
  STUFE[j * HS + i] = Math.hypot(x, z) < R ? Math.max(0, Math.min(3, Math.floor(WELT.hoehe(x, z) / 0.9))) : 0;
}
const stufeAt = (x, y) => (x < 0 || y < 0 || x >= KARTE || y >= KARTE ? 0 : STUFE[(y >> 1) * HS + (x >> 1)]);
// Typen je Pixel: 0 Meer, 1 Strand, 2 Wiese, 3 Weg, 4 Teich, 5 Fels
const TYP = new Uint8Array(KARTE * KARTE), TIEF = new Float32Array(KARTE * KARTE);
for (let y = 0; y < KARTE; y++) for (let x = 0; x < KARTE; x++) {
  const wx = (x + 0.5) / T - HALB, wz = (y + 0.5) / T - HALB, i = y * KARTE + x;
  const d = Math.hypot(wx, wz) + welle(wx, wz);
  let t;
  if (d > R) { t = 0; TIEF[i] = (d - R) / 8; }
  else if (d > R - SANDBREITE) t = 1;
  else if (WELT.see && Math.hypot(wx - WELT.see.x, wz - WELT.see.z) + welle(wx, wz) * 0.4 < WELT.see.r) { t = 4; TIEF[i] = (WELT.see.r - Math.hypot(wx - WELT.see.x, wz - WELT.see.z)) / 6; }
  else if (wegAbstand(wx, wz) < 0.55 + (rauschen(x, y, 6, 5) - 0.5) * 0.35) t = 3;
  else t = BIOM === "berge" && stufeAt(x, y) >= 2 ? 5 : 2;
  TYP[i] = t;
}
const TYP_AT = (x, y) => (x < 0 || y < 0 || x >= KARTE || y >= KARTE ? 0 : TYP[y * KARTE + x]);
const MUSTER = [0, 1, 2, 3].map(v => {
  const m = new Float32Array(T * T);
  for (let k = 0; k < 3; k++) {
    const bx = 1 + Math.floor(hash(v, k, 7) * 12), by = 2 + Math.floor(hash(v, k, 8) * 12);
    [[0, 1, -1], [2, 1, -1], [1, 0, -1], [0, 0, 1.2], [2, 0, 1.2], [1, -1, 1.2]].forEach(([dx, dy, dd]) => { const xx = bx + dx, yy = by + dy; if (xx >= 0 && yy >= 0 && xx < T && yy < T) m[yy * T + xx] = dd; });
  }
  return m;
});
// Blumen: Lieblingsfarbe der Welt und ein paar andere; feste Blumen aus dem Kern oder zufällig verteilt
const LIEBLING = WELT.farbe ? naechsteReihe(WELT.farbe) : "rosa";
const BLUMEN = [LIEBLING, LIEBLING, "gelb", "weiss", BIOM === "wueste" ? "orange" : "blau"];
const blumenPunkte = [];
if (!WINTER) {
  if (WELT.blumen) WELT.blumen.forEach(([x, z, i]) => blumenPunkte.push([Math.round(px(x)), Math.round(py(z)), i]));
  else for (let ty = 0; ty < HALB * 2; ty++) for (let tx = 0; tx < HALB * 2; tx++) { if (hash(tx, ty, 13) > 0.09) continue; blumenPunkte.push([tx * T + 3 + Math.floor(hash(tx, ty, 14) * 9), ty * T + 4 + Math.floor(hash(tx, ty, 15) * 8), tx * 31 + ty]); }
}
function bodenBild(f) {
  const c = document.createElement("canvas"); c.width = KARTE; c.height = KARTE;
  const g = c.getContext("2d"), d = g.createImageData(KARTE, KARTE), out = d.data;
  for (let y = 0; y < KARTE; y++) for (let x = 0; x < KARTE; x++) {
    const i = y * KARTE + x, t = TYP[i]; let reihe, v;
    if (t === 0 || t === 4) {
      const tiefe = TIEF[i], schaum = (t === 4 ? 0.02 : 0.03) + (f ? 0.014 : 0) * (0.6 + 0.4 * Math.sin(x * 0.4 + y * 0.2));
      if (tiefe < schaum) { reihe = "weiss"; v = tiefe < schaum * 0.5 ? 4 : 3; }
      else {
        reihe = "wasser"; v = Math.max(1.1, 3.3 - tiefe * 7);
        const gx = Math.floor((x + f * 5) / 14), gy = Math.floor(y / 10), hx = (x + f * 5) - gx * 14, hy = y - gy * 10;
        if (hash(gx, gy, 9) < 0.18 && hy === 4 && hx >= 3 && hx < 5 + Math.floor(hash(gx, gy, 10) * 4)) v = 4;
      }
    } else if (t === 1) {
      reihe = STRAND; v = 3 + (rauschen(x, y, 8, 4) - 0.5) * 0.5;
      if (TYP_AT(x, y + 3) === 0 || TYP_AT(x, y - 3) === 0 || TYP_AT(x + 3, y) === 0 || TYP_AT(x - 3, y) === 0) v = 2;   // nasser Rand
      const o = TYP_AT(x, y - 1), o2 = TYP_AT(x, y - 2); if (o >= 2 && o !== 4) v = 1.2; else if (o2 >= 2 && o2 !== 4) v = 2;
      const h = hash(x, y, 5); if (h < 0.02) v = 4; else if (h < 0.035) v = 1.5;
    } else if (t === 3) {
      reihe = "weg"; v = 3 + (rauschen(x, y, 9, 6) - 0.5) * 0.5;
      const o = TYP_AT(x, y - 1), o2 = TYP_AT(x, y - 2); if (o === 2) v = 1.3; else if (o2 === 2) v = 2.2;
      const kx = Math.floor(x / 6), ky = Math.floor(y / 5); if (hash(kx, ky, 11) < 0.22 && x % 6 < 2 && y % 5 === 2) v = x % 6 ? 1.5 : 4;
    } else {
      reihe = t === 5 ? "stein" : GRAS;
      const tx = Math.floor(x / T), ty = Math.floor(y / T), m = MUSTER[Math.floor(hash(tx, ty, 12) * 4)][(y - ty * T) * T + x - tx * T];
      const fleck = rauschen(x, y, 22, 6), st = stufeAt(x, y);
      v = (fleck < 0.3 ? 2 : 3) + (m > 0 ? 1 : m < 0 ? -1 : 0) + (st >= 1 && t !== 5 ? 0.6 : 0);
      if (t === 5) v = 2.4 + (rauschen(x, y, 6, 8) - 0.5) * 1.6;
      // Kante zu anderem Boden und Hügelstufen: unten dunkle Felswand, oben heller Rand
      const n = [TYP_AT(x + 1, y), TYP_AT(x - 1, y), TYP_AT(x, y + 1), TYP_AT(x, y - 1)];
      if (n.some(k => k !== t && !(k === 2 && t === 5) && !(k === 5 && t === 2))) v = 1;
      if (st > 0 || stufeAt(x, y - 4) > 0) {
        if (stufeAt(x, y - 1) > st || stufeAt(x, y - 3) > st) { reihe = BIOM === "wueste" ? "orange" : "stein"; v = stufeAt(x, y - 1) > st ? 1.4 : 2.2; }
        else if (stufeAt(x, y + 1) < st) v = 4;
      }
    }
    const k = farbe(reihe, raster(v, x, y)), o = i * 4;
    [out[o], out[o + 1], out[o + 2]] = RGB[k]; out[o + 3] = 255;
  }
  const punkt = (x, y, reihe, s) => { if (x < 0 || y < 0 || x >= KARTE || y >= KARTE || TYP[y * KARTE + x] !== 2) return; const o = (y * KARTE + x) * 4; [out[o], out[o + 1], out[o + 2]] = RGB[farbe(reihe, s)]; };
  blumenPunkte.forEach(([bx, by, n]) => {
    if (TYP_AT(bx, by) !== 2) return;
    const r = BLUMEN[Math.abs(n) % BLUMEN.length], w = f && hash(n, 1, 17) < 0.6 ? 1 : 0;
    punkt(bx, by + 2, GRAS, 0); punkt(bx, by + 3, GRAS, 1);
    punkt(bx + w, by - 1, r, 4); punkt(bx - 1 + w, by, r, 3); punkt(bx + 1 + w, by, r, 2); punkt(bx + w, by + 1, r, 2); punkt(bx + w, by, r === "gelb" ? "orange" : "gelb", 4);
  });
  g.putImageData(d, 0, 0);
  return Texture.from(c);
}
const BODEN = [bodenBild(0), bodenBild(1)];

// ======================================================================================================
// Bühne: welt (Kamera) = boden, unten (Steg, Boot), schatten, dinge (nach y sortiert), nebel, wolken; glanz = Lichter (nicht getönt)
// ======================================================================================================
const welt = new Container(), unten = new Container(), schatten = new Container(), dinge = new Container(), nebelC = new Container(), wolkenC = new Container();
const glanz = new Container(), himmel = new Container();
dinge.sortableChildren = true;
const boden = new Sprite(BODEN[0]);
welt.addChild(boden, unten, schatten, dinge, nebelC, wolkenC);
app.stage.addChild(welt, glanz, himmel);
const hindernisse = [];
const block = (x, z, r) => hindernisse.push({ x, z, r });
const kiste = (x0, z0, x1, z1) => hindernisse.push({ x0, z0, x1, z1 });
function schattenUnter(gr, x, y) { const s = new Sprite(sch[gr].tex); s.anchor.set(0.5); s.position.set(x, y); s.tint = SCHATTEN_FARBE; s.alpha = 0.3; schatten.addChild(s); return s; }
// Ding auf den Boden stellen: Fußpunkt = Weltpunkt (x, z)
function stelle(e, x, z, sg = "m", { dx = 0 } = {}) {
  const s = new Sprite(e.tex); s.anchor.set(0.5, 1); s.position.set(Math.round(px(x)) + dx, Math.round(py(z))); s.zIndex = s.y; dinge.addChild(s);
  if (sg) s.schatten = schattenUnter(sg, s.x + 2, s.y - 2);
  return s;
}
// Antippbare Orte: { id, x, z, nah, aktion, tipp, sprite }
const tippbar = [];
function antippbar(sprite, x, z, tipp, aktion = ["👀", "Ansehen"], nah = 1.9, id = "") { const t = { id, x, z, nah, aktion, tipp, sprite }; tippbar.push(t); return t; }

// Steg mit Pixels Boot
const stegS = new Sprite(TX.steg.tex); stegS.anchor.set(0.5, 0); stegS.position.set(Math.round(px(STEG.x)), Math.round(py(STEG.z0))); unten.addChild(stegS);
const bootS = new Sprite(TX.boot.tex); bootS.anchor.set(0.5, 0.5); bootS.position.set(Math.round(px(STEG.x + 1.6)), Math.round(py(STEG.z1 - 0.6))); unten.addChild(bootS);
const aufSteg = (x, z) => Math.abs(x - STEG.x) < 0.62 && z > STEG.z0 - 0.5 && z < STEG.z1 - 0.35;

// Bäume, Steine
WELT.baeume.forEach(b => { const typ = b.typ || "laub"; stelle(baumTex(typ, b.k), b.x, b.z + 0.25, typ === "laub" ? "g" : "m"); block(b.x, b.z, typ === "palme" ? 0.35 * b.k : typ === "kaktus" ? 0.4 * b.k : typ === "nadel" ? 0.5 * b.k : 0.6 * b.k); });
WELT.steine.forEach(([x, z, r]) => { stelle(steinTex(r), x, z + r * 0.4, "k"); block(x, z, r); });
// Haus (Tür immer nach Süden) – Antippen/Aktionsknopf an der Tür
let prolog = null, drinnen = false;
const hausS = stelle(TX.haus, P.haus[0], P.haus[1] + 1.55, "h");
kiste(P.haus[0] - 1.95, P.haus[1] - 1.6, P.haus[0] + 1.95, P.haus[1] + 1.35);
const hausT = antippbar(hausS, TUER.x, TUER.z - 0.4, () => (prolog ? reingehen() : spielOrt(reingehen)), ["🚪", "Reingehen"], 1.6, "haus");
// Wetterstation, Nest, Mathe-Schild
const stationS = stelle(TX.station[0], P.station[0], P.station[1] + 0.3, "k"); block(P.station[0], P.station[1], 0.6);
antippbar(stationS, P.station[0], P.station[1], () => zeigeAntwort(K.antwort("station", { wetter })), ...K.aktionFuer("station"), "station");
const nestS = stelle(NEST_TX, P.nest[0], P.nest[1] + 0.35, "m"); block(P.nest[0], P.nest[1], 0.6);
if (!MIT_TIER) antippbar(nestS, P.nest[0], P.nest[1], () => zeigeAntwort(K.antwort("nest")), ["👀", "Ansehen"], 1.9, "nest");
stelle(TX.schild, P.schild[0], P.schild[1] + 0.2, "k"); block(P.schild[0], P.schild[1], 0.4);
// Nachbarn (Platz und Texte aus dem Kern)
const NACHBARN = KI.nachbarn().map(n => {
  const s = stelle(TX[n.e][0], n.x, n.z + 0.2, "m"); block(n.x, n.z, 0.8);
  const fund = K.fundFuer(n.e);
  Object.assign(n, { s, y0: s.y, huepf: 0, freut: !!fund });
  antippbar(s, n.x, n.z, () => { n.huepf = 1; n.freut = false; zeigeAntwort(K.nachbarAntwort(n)); }, fund ? ["🌱", "Reden"] : ["💬", "Reden"], 2.3, "nachbar-" + n.e);
  return n;
});
// Wissensbaum mit den Früchten von heute
const wbS = stelle(WB_TX, P.wissensbaum[0], P.wissensbaum[1] + 0.3, WB_INFO.stufe ? "g" : "k"); block(P.wissensbaum[0], P.wissensbaum[1], WB_INFO.stufe ? 0.7 : 0.4);
antippbar(wbS, P.wissensbaum[0], P.wissensbaum[1], () => zeigeAntwort(K.antwort("wissensbaum")), ...K.aktionFuer("wissensbaum"), "wissensbaum");
const fruechte = [];
if (L && WB_INFO.stufe > 0) {
  const k = [0.35, 0.5, 0.62, 0.75, 0.88, 1.0, 1.12][WB_INFO.stufe] * 1.25, mitte = wbS.y - wbS.height + 18 * k + 1;
  const PL = [[-0.55, 0.3], [0.5, 0.35], [0.05, -0.4], [0.8, -0.15], [-0.8, -0.2]];
  L.heute().slice(0, PL.length).forEach((f, i) => {
    const reihe = naechsteReihe(K.fruchtFarbe(f), FRUCHT_REIHEN), s = new Sprite(FRUCHT_TX[reihe].tex);
    s.anchor.set(0.5); s.position.set(wbS.x + Math.round(PL[i][0] * 13 * k), Math.round(mitte + PL[i][1] * 11 * k)); s.zIndex = wbS.zIndex + 0.5; s.visible = false; dinge.addChild(s);
    fruechte.push({ s, ab: 0.6 + i * 0.35 });
  });
}
if (WB_INFO.gewachsen) { setTimeout(() => { $("info").textContent = "🌳 Dein Wissensbaum ist gewachsen!"; S.ton && S.ton("juhu"); }, 1200); L.baumGesehen(); }
// Minispiel-Orte
const ballonsS = stelle(TX.ballons[0], P.ballons[0], P.ballons[1] + 0.3, "m"); block(P.ballons[0], P.ballons[1], 0.6);
antippbar(ballonsS, P.ballons[0], P.ballons[1], () => zeigeAntwort(K.antwort("ballons")), ...K.aktionFuer("ballons"), "ballons");
const truheS = stelle(TX.truhe, P.truhe[0], P.truhe[1] + 0.3, "m"); block(P.truhe[0], P.truhe[1], 0.5);
antippbar(truheS, P.truhe[0], P.truhe[1], () => zeigeAntwort(K.antwort("truhe")), ...K.aktionFuer("truhe"), "truhe");
["lauf", "kart", "bau"].forEach(id => {
  const [x, z] = P[id], s = stelle(ORT_TX[id], x, z + 0.6, "g"); block(x, z, 1.2);
  if (!K.istFrei(id)) { const l = new Sprite(TX.schloss.tex); l.anchor.set(0.5, 1); l.position.set(s.x, s.y - s.height - 2); l.zIndex = s.zIndex + 0.5; dinge.addChild(l); }
  antippbar(s, x, z, () => zeigeAntwort(K.antwort(id)), ...K.aktionFuer(id), id);
});
// Schachtisch mit Tilda, Bühne mit Paula
const schachS = stelle(TX.schach, P.schach[0], P.schach[1] + 0.4, "g"); block(P.schach[0], P.schach[1], 1.1);
const tildaS = stelle(TX.tilda[0], P.schach[0] + 1.3, P.schach[1] + 0.5, "k");
antippbar(schachS, P.schach[0], P.schach[1], () => zeigeAntwort(K.antwort("schach")), ...K.aktionFuer("schach"), "schach");
const buehneS = stelle(TX.buehne, P.buehne[0], P.buehne[1] + 0.9, null); buehneS.zIndex -= 20; block(P.buehne[0], P.buehne[1], 1.5);
const paulaS = stelle(TX.paula[0], P.buehne[0], P.buehne[1] + 0.2, "k"); const paulaY = paulaS.y;
let tanzBis = 0, paulaHuepf = 0;
antippbar(buehneS, P.buehne[0], P.buehne[1], () => {
  const a = K.antwort("buehne");
  if (a.melodie) tanzBis = performance.now() + K.spieleMelodie(a.melodie, () => { NACHBARN.forEach(n => { n.huepf = 1; }); paulaHuepf = 1; });
  zeigeAntwort(a);
  if (a.melodie && SP && SP.stopp) setTimeout(() => SP.stopp(), 10);
}, ...K.aktionFuer("buehne"), "buehne");
// Sonnenuhr am Steg: Sonne dunkel → gelb mit Lernfortschritt, hell mit Spielzeit
const uhrS = stelle(TX.sonnenuhr, SU.x, SU.z + 0.4, "m"); block(SU.x, SU.z, 0.6);
const sonneS = new Sprite(TX.sonne[0].tex); sonneS.anchor.set(0.5); sonneS.position.set(uhrS.x - 9, uhrS.y - 31); sonneS.zIndex = uhrS.zIndex + 0.5; dinge.addChild(sonneS);
function zeigeSonnenuhr() { const u = K.sonnenuhr(); sonneS.texture = TX.sonne[u.spielen ? 2 : u.hell >= 0.5 ? 1 : 0].tex; }
zeigeSonnenuhr(); setInterval(zeigeSonnenuhr, 5000);
antippbar(uhrS, SU.x, SU.z, () => zeigeAntwort(K.antwort("sonnenuhr")), ...K.aktionFuer("sonnenuhr"), "sonnenuhr");

// ======================================================================================================
// Figuren: Kind und Tier
// ======================================================================================================
const ich = { x: P.start[0], z: P.start[1] + 0.6, richtung: "vorn", spiegeln: 1, hoehe: 0, vy: 0 };
const ichS = new Sprite(KIND.vorn[0].tex); ichS.anchor.set(0.5, 1); dinge.addChild(ichS);
const ichSchatten = schattenUnter("k", 0, 0);
let tierS = null, tierSchatten = null, schleifeS = null;
const tier = MIT_TIER ? { x: P.tier[0], z: P.tier[1], richtung: "seite", spiegeln: 1 } : null;
if (tier) {
  tierS = new Sprite(TIER_TX.seite[0].tex); tierS.anchor.set(0.5, 1); dinge.addChild(tierS); tierSchatten = schattenUnter("k", 0, 0);
  if (tierDaten.traegt && tierDaten.traegt.schleife) { schleifeS = new Sprite(TX.schleife.tex); schleifeS.anchor.set(0.5); dinge.addChild(schleifeS); }
}
const markeS = new Sprite(TX.marke[0].tex); markeS.anchor.set(0.5); markeS.visible = false; unten.addChild(markeS);

// Wolkenschatten (ziehen langsam)
const wolkenListe = [[-10, -12], [6, 4], [16, -18]].map(([x, z]) => { const s = new Sprite(TX.wolke.tex); s.position.set(px(x), py(z)); s.tint = SCHATTEN_FARBE; s.alpha = 0.1; s.ox = s.x; wolkenC.addChild(s); return s; });

// ======================================================================================================
// Zimmer im Haus (eigener Bereich rechts neben der Karte); Möbel aus den Zimmer-Daten des Kerns
// ======================================================================================================
const ZIM = { x0: KARTE + 6 * T, y0: 4 * T, b: Math.round(8.4 * T), h: Math.round(9.6 * T) };   // Pixel auf der Weltebene
const zimmerC = new Container(); zimmerC.visible = false; welt.addChild(zimmerC);
const FENSTER_X = 0.42;   // Fenster in der Rückwand (links davon Pinnwand und ein gemaltes Bild)
const WAND_REIHE = { rosa: "rosa", mint: "gruen", himmel: "blau", sonne: "gelb", lila: "lila" };
function zimmerBild(wandId) {
  const wr = WAND_REIHE[wandId] || "rosa", WH = 2.4 * T;
  return Texture.from(leinwand(ZIM.b, ZIM.h, (x, y) => {
    if (x < 4 || x >= ZIM.b - 4) return farbe(wr, x < 2 || x >= ZIM.b - 2 ? 1 : 2);   // Seitenwände
    if (y < WH) {                                                                   // Rückwand mit Fenster und Leiste
      const fx = x - (ZIM.b / 2 + FENSTER_X * T - 14), fy = y - 8;
      if (fx >= 0 && fx < 28 && fy >= 0 && fy < 20) return fx < 2 || fx > 25 || fy < 2 || fy > 17 || fx === 13 || fy === 9 ? farbe("weiss", 4) : farbe(NACHT ? "blau" : "glas", NACHT ? 1 : (fx - fy + 30) % 11 < 2 ? 4 : 3);
      if (y >= WH - 3) return farbe("holz", y === WH - 1 ? 1 : 3);
      return farbe(wr, raster(y < 3 ? 2.6 : 3.6 - (y / WH) * 0.6 + ((x >> 3) % 2 ? 0.25 : 0), x, y));
    }
    if (y >= ZIM.h - 5 && Math.abs(x - ZIM.b / 2) < 12) return farbe("weg", y >= ZIM.h - 2 ? 1 : 3);   // Türschwelle
    if (y >= ZIM.h - 3) return farbe(wr, 1);
    return farbe("holz", raster((y - WH) % 12 === 0 ? 1.5 : 3 + ((x + Math.floor((y - WH) / 12) * 23) % 37 === 0 ? -1.2 : 0) - (y < WH + 5 ? 0.8 : 0), x, y));
  }));
}
const zimmerBoden = new Sprite(); zimmerBoden.position.set(ZIM.x0, ZIM.y0); zimmerC.addChild(zimmerBoden);
const zimmerDinge = new Container(); zimmerDinge.sortableChildren = true; zimmerC.addChild(zimmerDinge);
// Zimmer-Koordinaten wie „Rund“ (x −4.2 … 4.2, z −3.7 … 3.7 um die Mitte), Rückwand oben
const zx = (x) => ZIM.x0 + ZIM.b / 2 + x * T, zz = (z) => ZIM.y0 + 2.4 * T + (z + 3.7) * T * (7.2 / 7.4);
const wandY = (y) => ZIM.y0 + y;   // Pixelhöhe an der Rückwand
const zimmerTipp = [], zimmerHindernisse = [];
let moebelS = [], fischeS = [];
const setzeZ = (e, x, z, anker = 1) => { const s = new Sprite(e.tex); s.anchor.set(0.5, anker); s.position.set(Math.round(zx(x)), Math.round(zz(z))); s.zIndex = s.y; zimmerDinge.addChild(s); return s; };
const tippZ = (id, x, z, nah, s, tipp, aktion = K.aktionFuer(id)[0]) => zimmerTipp.push({ id, x, z, nah, s, tipp, aktion });
// Gemaltes Bild aus dem Atelier im Pixel-Look: verkleinert und auf die Farben der Palette gebracht
function pixelBild(url, b, h) {
  return new Promise((ok) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = b; c.height = h; const g = c.getContext("2d");
      const k = Math.max(b / img.width, h / img.height); g.imageSmoothingEnabled = true;
      g.drawImage(img, (b - img.width * k) / 2, (h - img.height * k) / 2, img.width * k, img.height * k);
      const d = g.getImageData(0, 0, b, h), p = d.data;
      for (let i = 0; i < p.length; i += 4) {
        let best = 0, bd = 1e9;
        for (let f = 0; f < RGB.length; f++) { const [r, gg, bb] = RGB[f], e = (r - p[i]) ** 2 + (gg - p[i + 1]) ** 2 + (bb - p[i + 2]) ** 2; if (e < bd) { bd = e; best = f; } }
        [p[i], p[i + 1], p[i + 2]] = RGB[best]; p[i + 3] = 255;
      }
      g.putImageData(d, 0, 0); ok(Texture.from(c));
    };
    img.onerror = () => ok(null); img.src = url;
  });
}
// Feste Einrichtung: Bett mit Album, Schrank, Spiegel, Teppich, Pinnwand, Wandbild, Staffelei
{
  const tep = setzeZ(TX.teppich, 0, 0.6, 0.5); tep.zIndex = -1;
  const bett = setzeZ(TX.bett, -2.9, -0.5); const albumS = setzeZ(TX.album, -2.5, -1.4); albumS.zIndex = bett.zIndex + 1;
  const schrank = setzeZ(TX.schrank, 2.8, -2.9); const spiegel = setzeZ(TX.spiegel, 3.65, 2.4);
  tippZ("bett", -2.9, -1.2, 2.0, bett, () => zeigeAntwort(K.antwort("bett", { tier: tier ? tierDaten.name || "dein Tier" : null })));
  tippZ("album", -2.2, -1.8, 1.4, albumS, () => zeigeAntwort(K.antwort("album")));
  tippZ("schrank", 2.8, -2.6, 1.9, schrank, () => zeigeAntwort(K.antwort("schrank")));
  tippZ("spiegel", 3.65, 2.2, 1.6, spiegel, () => zeigeAntwort(K.antwort("spiegel")));
  const pinn = new Sprite(TX.pinnwand.tex); pinn.anchor.set(0.5, 0); pinn.position.set(Math.round(zx(-2.9)), wandY(6)); pinn.zIndex = -2; zimmerDinge.addChild(pinn);
  tippZ("pinnwand", -2.6, -2.2, 1.6, pinn, () => zeigeAntwort(K.antwort("pinnwand")), ["📌", "Ansehen"]);
  const staff = setzeZ(TX.staffelei, -2.1, 2.5); let neuestes = null;
  tippZ("staffelei", -2.1, 2.2, 2.0, staff, () => zeigeAntwort(K.antwort("staffelei", { bild: !!neuestes })), ["🎨", "Malen"]);
  zimmerHindernisse.push({ x: -2.1, z: 2.3, r: 0.55 }, { x: 3.65, z: 2.2, r: 0.5 });
  if (window.Bilder) {
    window.Bilder.alle().then(l => { neuestes = l[0] || null; if (neuestes) return pixelBild(neuestes.url, 12, 13).then(t => { if (!t) return; const b = new Sprite(t); b.anchor.set(0.5, 0); b.position.set(staff.x, staff.y - staff.height + 6); b.zIndex = staff.zIndex + 0.1; zimmerDinge.addChild(b); }); }).catch(() => {});
    window.Bilder.wandBilder().then(l => { const w = l[0]; if (!w) return; return pixelBild(w.url, 14, 11).then(t => {
      if (!t) return; const r = new Sprite(TX.rahmen.tex); r.anchor.set(0.5, 0); r.position.set(Math.round(zx(-1.12)), wandY(8)); r.zIndex = -2; zimmerDinge.addChild(r);
      const b = new Sprite(t); b.anchor.set(0.5, 0); b.position.set(r.x, r.y + 2); b.zIndex = -1.9; zimmerDinge.addChild(b);
      tippZ("bild", -1.0, -2.2, 1.4, r, () => zeigeAntwort(K.antwort("bild", { t: w.t })), ["🖼️", "Ansehen"]);
    }); }).catch(() => {});
  }
}
// Plätze zum Einrichten: Ringe zeigen beim Aussuchen, wo die Möbel hinkommen
const platzRinge = K.PLAETZE.map(pl => { const r = new Sprite(TX.ring.tex); r.anchor.set(0.5); r.position.set(Math.round(zx(pl.x)), Math.round(zz(pl.z + 0.4))); r.zIndex = -0.5; r.visible = false; zimmerDinge.addChild(r); return r; });
// Möbel auf den Plätzen (Daten aus dem Kern; gleiche Möbel wie bei „Rund“)
function stelleZimmer() {
  const d = K.zimmerDaten();
  zimmerBoden.texture = zimmerBild(d.wand);
  moebelS.forEach(m => m.destroy()); fischeS.forEach(f => f.destroy()); moebelS = []; fischeS = [];
  for (let i = zimmerTipp.length - 1; i >= 0; i--) if (zimmerTipp[i].moebel) zimmerTipp.splice(i, 1);
  for (let i = zimmerHindernisse.length - 1; i >= 0; i--) if (zimmerHindernisse[i].moebel) zimmerHindernisse.splice(i, 1);
  K.PLAETZE.forEach(pl => {
    const id = d.plaetze[pl.id], m = K.MOEBEL.find(x => x.id === id); if (!m || !K.besitzt("moebel-" + id, m.preis)) return;
    const e = id === "tannenbaum" ? TX.tannenbaum[0] : TX.moebel[id], halb = e.b / 2 / T + 0.3, x = Math.max(-4.2 + halb, Math.min(4.2 - halb, pl.x));   // innerhalb der Wände
    const s = setzeZ(e, x, pl.z + 0.5); s.moebel = id; moebelS.push(s);
    if (id === "aquarium") TX.fisch.forEach((f, i) => { const fs = new Sprite(f.tex); fs.anchor.set(0.5); fs.zIndex = s.zIndex + 0.1; fs.basis = { x: s.x, y: s.y - 16 + i * 5 }; fs.i = i; zimmerDinge.addChild(fs); fischeS.push(fs); });
    zimmerTipp.push({ id: "moebel-" + id, x, z: pl.z, nah: 1.6, s, moebel: true, tipp: () => zeigeAntwort(K.antwort("moebel", { id })), aktion: ["👀", "Ansehen"] });
    zimmerHindernisse.push({ x, z: pl.z + 0.2, r: 0.55, moebel: true });
  });
}
stelleZimmer();
window.Einrichten.verbinde({ neu: () => stelleZimmer(), ringe: (an, besetzt) => platzRinge.forEach((r, i) => { r.visible = an; r.tint = besetzt[i] ? 0xF592BC : 0xFFFFFF; }) });
$("einrichten").addEventListener("click", () => { S.ton("tipp"); window.Einrichten.oeffne(); });
const ZIMMER_GRENZE = { x0: -3.8, x1: 3.8, z0: -2.2, z1: 3.55 };

// ======================================================================================================
// Weihnachts-Paket und Lichterkette (Regeln im Kern)
// ======================================================================================================
let paket = null;
if (K.weihnachtsPaket()) {
  paket = stelle(TX.paket, PAKET_POS.x, PAKET_POS.z + 0.3, "k"); block(PAKET_POS.x, PAKET_POS.z, 0.45);
  paket.t = antippbar(paket, PAKET_POS.x, PAKET_POS.z, () => oeffnePaket(), ["🎁", "Öffnen"], 1.8, "paket");
}
function oeffnePaket() {
  if (!paket || !K.weihnachtsPaket()) return;
  const r = K.oeffnePaket(); if (!r) return;
  if (r.zimmer) stelleZimmer();
  paket.destroy(); paket.schatten.destroy(); tippbar.splice(tippbar.indexOf(paket.t), 1);
  const i = hindernisse.findIndex(h => h.x === PAKET_POS.x && h.z === PAKET_POS.z); if (i >= 0) hindernisse.splice(i, 1);
  paket = null; naechstes = null;
  S.ton("juhu");
  sprechblase(...r.blase, null);
}
const lichter = [];
if (MONAT === 12) {
  const setzeL = (x, y) => { const s = new Sprite(TX.licht[lichter.length % 4].tex); s.anchor.set(0.5); s.position.set(Math.round(x), Math.round(y)); glanz.addChild(s); lichter.push(s); };
  for (let i = 0; i < 7; i++) [-11, 11].forEach(dx => setzeL(stegS.x + dx, stegS.y + 6 + i * (stegS.height - 12) / 6));
  for (let i = 0; i < 6; i++) setzeL(bootS.x - 9 + i * 3.6, bootS.y - 14 + Math.abs(i - 2.5) * 1.5);
  // Lichter am Wissensbaum
  if (WB_INFO.stufe > 0) for (let i = 0; i < 8; i++) { const a = i * 0.8 + 0.4; setzeL(wbS.x + Math.cos(a) * wbS.width * 0.36, wbS.y - wbS.height * 0.55 + Math.sin(a) * wbS.height * 0.2); }
}

// ======================================================================================================
// Nebel am Rand (weicht mit Kapitel und Lernfunden), Tageszeit- und Wetter-Tönung
// ======================================================================================================
const NEBEL = KI.NEBEL;
let nebelJetzt = K.nebelStufe(), nebelS = null;
function nebelBild(r) {
  return Texture.from(leinwand(KARTE / 2, KARTE / 2, (x, y) => {   // halbe Auflösung (2×2 Pixel je Punkt), wirkt gröber wie DS-Nebel
    const wx = (x * 2 + 1) / T - HALB, wz = (y * 2 + 1) / T - HALB, t = (Math.hypot(wx, wz) + welle(wx, wz) * 0.8 - r) / 2.6;
    if (t <= 0) return -1;
    return raster(Math.min(1.4, t), x, y) >= 1 ? farbe("weiss", t > 1.6 ? 3 : 4) : -1;
  }));
}
function zeigeNebel(stufe, alpha) {
  const n = NEBEL[stufe]; if (!n.a) return null;
  const s = new Sprite(nebelBild(n.r)); s.scale.set(2); s.alpha = alpha == null ? n.a : alpha; nebelC.addChild(s); return s;
}
nebelS = zeigeNebel(nebelJetzt);
// Der Nebel weicht: neues Bild blendet ein, altes aus (3 Sekunden, zeitabhängig)
function nebelWeicht() {
  const ziel = K.nebelStufe(); if (ziel <= nebelJetzt) return false;
  const alt = nebelS, neu = zeigeNebel(ziel, 0), t0 = performance.now(), a0 = alt ? alt.alpha : 0, a1 = NEBEL[ziel].a;
  const schritt = () => {
    const f = Math.min(1, (performance.now() - t0) / 3000), e = f * f * (3 - 2 * f);
    if (alt) alt.alpha = a0 * (1 - e); if (neu) neu.alpha = a1 * e;
    if (f < 1) requestAnimationFrame(schritt); else { if (alt) { alt.destroy({ texture: true }); } nebelS = neu; nebelJetzt = ziel; }
  };
  schritt(); return true;
}
// Tönung: Nacht blau, Dämmerung warm, Wetter grau (multipliziert)
const mal = (a, b) => (((((a >> 16) & 255) * ((b >> 16) & 255) / 255) << 16) | ((((a >> 8) & 255) * ((b >> 8) & 255) / 255) << 8) | ((a & 255) * (b & 255) / 255)) >>> 0;
const ZEIT_TON = NACHT ? 0x7480C4 : DAEMMER ? 0xFFD6B4 : 0xFFFFFF;
let wetterTon = 0xFFFFFF;
const toene = () => { welt.tint = drinnen ? (NACHT ? 0xC8C8E8 : 0xFFFFFF) : mal(ZEIT_TON, wetterTon); };
toene();

// ======================================================================================================
// Wetter (Abruf, Cache und Texte im Kern): Tönung, Regen, Schnee, Blitz
// ======================================================================================================
let wetter = null, blitz = 0;
const teilchen = [];
const blitzS = new Sprite(Texture.WHITE); blitzS.alpha = 0; himmel.addChild(blitzS);
function wendeWetterAn(w) {
  wetter = w; const art = w.art;
  wetterTon = { wolken: 0xE2E8EE, nebel: 0xD6DCE2, regen: 0xB8C4D2, gewitter: 0xA0AABA, schnee: 0xEEF2F8 }[art] || 0xFFFFFF;
  toene();
  const anzahl = RUHIG ? 0 : art === "regen" || art === "gewitter" ? 70 : art === "schnee" ? 50 : 0;
  teilchen.forEach(t => t.destroy()); teilchen.length = 0;
  for (let i = 0; i < anzahl; i++) {
    const s = new Sprite((art === "schnee" ? TX.flocke : TX.tropfen).tex); s.scale.set(skala); s.alpha = 0.85;
    s.position.set(Math.random() * app.screen.width, Math.random() * app.screen.height); s.v = art === "schnee" ? 30 + Math.random() * 30 : 420 + Math.random() * 160; s.p = Math.random() * 6;
    himmel.addChild(s); teilchen.push(s);
  }
  wolkenListe.forEach((wo, i) => { wo.visible = art === "klar" ? i < 1 : true; wo.alpha = ["wolken", "regen", "gewitter"].includes(art) ? 0.16 : 0.1; });
}
const wetterSticker = (w) => K.wetterSticker(w, NACHT);
const wetterSatz = () => K.wetterSatz(wetter);
async function holeWetter() { const w = await K.holeWetter(); if (w) { wendeWetterAn(w); zeigeWetterInfo(); wetterSticker(w); } }

// ======================================================================================================
// Kamera und Größe: ganzzahlige Vergrößerung, etwa 18 × 12,5 Kacheln sichtbar
// ======================================================================================================
let skala = 3, fahrt = null, festSkala = null;   // festSkala: nur für Tests (Überblick)
function layout() {
  const w = app.screen.width, h = app.screen.height;
  skala = festSkala || Math.max(2, Math.round(Math.min(w / (T * 18), h / (T * 12.5))));
  welt.scale.set(skala); glanz.scale.set(skala);
  blitzS.width = w; blitzS.height = h;
  teilchen.forEach(t => t.scale.set(skala));
}
app.renderer.on("resize", layout); layout();
function kamera() {
  const sw = app.screen.width / skala, sh = app.screen.height / skala;
  let kx, ky, x0, x1, y0, y1;
  if (drinnen) { kx = ZIM.x0 + ZIM.b / 2; ky = ZIM.y0 + ZIM.h / 2; x0 = ZIM.x0 - 3 * T; x1 = ZIM.x0 + ZIM.b + 3 * T; y0 = ZIM.y0 - 3 * T; y1 = ZIM.y0 + ZIM.h + 3 * T; }
  else { kx = px(ich.x); ky = py(ich.z) - 8; x0 = 0; x1 = KARTE; y0 = 0; y1 = KARTE; }
  if (fahrt && !drinnen) { const f = Math.min(1, (performance.now() - fahrt) / 3500), e = 1 - (1 - f) ** 3; ky += (1 - e) * 7 * T; if (f >= 1) fahrt = null; }
  kx = sw >= x1 - x0 ? (x0 + x1) / 2 : Math.max(x0 + sw / 2, Math.min(x1 - sw / 2, kx));
  ky = sh >= y1 - y0 ? (y0 + y1) / 2 : Math.max(y0 + sh / 2, Math.min(y1 - sh / 2, ky));
  welt.position.set(Math.round(app.screen.width / 2 - kx * skala), Math.round(app.screen.height / 2 - ky * skala));
  glanz.position.copyFrom(welt.position);
}
// Weltpunkt (Weltmaß, Höhe h in Welteinheiten) → Bildschirm (für Zeigehand und Szenen)
function bildschirm(x, z, h = 0) {
  const p = welt.toGlobal({ x: px(x), y: py(z) - h * T * 0.8 }), r = app.canvas.getBoundingClientRect();
  const X = r.left + p.x, Y = r.top + p.y;
  return { x: X, y: Y, sichtbar: X >= r.left - 4 && X <= r.right + 4 && Y >= r.top - 4 && Y <= r.bottom + 4, hinten: false };
}

// ======================================================================================================
// Steuerung: Antippen = hinlaufen (auf ein Ding: hinlaufen und ansprechen), Pfeiltasten/WASD, Aktionsknopf
// ======================================================================================================
let ziel = null, ankunft = null, naechstes = null, knopfZustand = "";
const tasten = {};
addEventListener("keydown", e => {
  tasten[e.key.toLowerCase()] = true;
  if (e.key === " ") { e.preventDefault(); springe(); }
  if ((e.key === "Enter" || e.key.toLowerCase() === "e") && naechstes) { e.preventDefault(); aktion(); }
});
addEventListener("keyup", e => { tasten[e.key.toLowerCase()] = false; });
const RAND_PUFFER = 0.4;
function wegVonHindernissen(p, r) {
  if (drinnen) {
    p.x = Math.max(ZIMMER_GRENZE.x0, Math.min(ZIMMER_GRENZE.x1, p.x)); p.z = Math.max(ZIMMER_GRENZE.z0, Math.min(ZIMMER_GRENZE.z1, p.z));
    // Bett und Schrank
    for (const [x0, z0, x1, z1] of [[-4.2, -3.7, -1.85, -0.6], [1.7, -3.7, 3.9, -2.4]]) schiebeAusKiste(p, r, x0, z0, x1, z1);
    for (const h of zimmerHindernisse) { const dx = p.x - h.x, dz = p.z - h.z, d = Math.hypot(dx, dz), m = h.r + r; if (d < m && d > 0.001) { p.x = h.x + dx / d * m; p.z = h.z + dz / d * m; } }
    return;
  }
  for (const h of hindernisse) {
    if (h.x0 !== undefined) { schiebeAusKiste(p, r, h.x0, h.z0, h.x1, h.z1); continue; }
    const dx = p.x - h.x, dz = p.z - h.z, d = Math.hypot(dx, dz), m = h.r + r; if (d < m && d > 0.001) { p.x = h.x + dx / d * m; p.z = h.z + dz / d * m; }
  }
  if (!aufSteg(p.x, p.z)) { const l = Math.hypot(p.x, p.z); if (l > RMAX_LAUF) { p.x *= RMAX_LAUF / l; p.z *= RMAX_LAUF / l; } }
}
function schiebeAusKiste(p, r, x0, z0, x1, z1) {
  if (p.x < x0 - r || p.x > x1 + r || p.z < z0 - r || p.z > z1 + r) return;
  const links = p.x - (x0 - r), rechts = x1 + r - p.x, oben = p.z - (z0 - r), untenA = z1 + r - p.z, m = Math.min(links, rechts, oben, untenA);
  if (m === links) p.x = x0 - r; else if (m === rechts) p.x = x1 + r; else if (m === oben) p.z = z0 - r; else p.z = z1 + r;
}
function markiere(x, z) { markeS.position.set(Math.round(drinnen ? zx(x) : px(x)), Math.round(drinnen ? zz(z) : py(z))); markeS.visible = true; }
// Antippen: oberstes antippbares Ding unter dem Finger, sonst Boden
app.stage.eventMode = "static"; app.stage.hitArea = app.screen;
app.stage.on("pointertap", (e) => {
  if (!$("blase").hidden || !$("laden").hidden) return;
  const l = welt.toLocal(e.global);
  const liste = drinnen ? zimmerTipp.map(t => ({ ...t, sprite: t.s })) : tippbar;
  let treffer = null;
  for (const t of liste) { const b = t.sprite.getBounds(); if (e.global.x >= b.x && e.global.x <= b.x + b.width && e.global.y >= b.y && e.global.y <= b.y + b.height && (!treffer || t.sprite.zIndex > treffer.sprite.zIndex)) treffer = t; }
  // das eigene Tier streicheln
  if (!drinnen && tierS) { const b = tierS.getBounds(); if (e.global.x >= b.x - 4 && e.global.x <= b.x + b.width + 4 && e.global.y >= b.y - 4 && e.global.y <= b.y + b.height + 4) { streichle(); return; } }
  if (treffer && !(prolog && treffer.id !== "haus")) {
    const d = Math.hypot(treffer.x - ich.x, treffer.z - ich.z);
    if (d > Math.max(2.4, treffer.nah)) { const v = Math.max(0.01, d), wx = treffer.x + (ich.x - treffer.x) / v * Math.min(1.6, treffer.nah - 0.2), wz = treffer.z + (ich.z - treffer.z) / v * Math.min(1.6, treffer.nah - 0.2); ziel = { x: wx, z: wz }; ankunft = treffer.tipp; markiere(wx, wz); }
    else treffer.tipp();
    return;
  }
  // Boden: dorthin laufen
  const wx = drinnen ? (l.x - ZIM.x0 - ZIM.b / 2) / T : l.x / T - HALB, wz = drinnen ? (l.y - ZIM.y0 - 2.4 * T) / (T * 7.2 / 7.4) - 3.7 : l.y / T - HALB;
  const p = { x: wx, z: wz }; wegVonHindernissen(p, RAND_PUFFER);
  ziel = p; ankunft = null; markiere(p.x, p.z);
});
// Springen (kleiner Hüpfer) und Aktionsknopf
function springe() { if (ich.hoehe <= 0) { ich.vy = 70; S.ton("tipp"); } }
function pruefeNaehe() {
  let best = null, bestD = Infinity;
  if ($("blase").hidden && $("laden").hidden && ich.hoehe <= 0) for (const t of (drinnen ? zimmerTipp : tippbar)) {
    if (prolog && t.id !== "haus") continue;   // im Prolog führt der Aktionsknopf nur ins Haus
    const d = Math.hypot(t.x - ich.x, t.z - ich.z);
    if (d < t.nah && d < bestD) { best = t; bestD = d; }
  }
  naechstes = best;
  const z = best ? best.aktion.join("|") : "";
  if (z !== knopfZustand) {
    knopfZustand = z; const k = $("springen");
    k.innerHTML = best ? `<span>${best.aktion[0]}</span>${best.aktion[1]}` : "<span>⬆️</span>Springen";
    k.classList.toggle("aktion", !!best); k.setAttribute("aria-label", best ? best.aktion[1] : "Springen");
  }
}
function aktion() {
  if (!naechstes) return springe();
  const t = naechstes; ziel = null; markeS.visible = false;
  const dx = t.x - ich.x, dz = t.z - ich.z;
  if (Math.abs(dx) > Math.abs(dz)) { ich.richtung = "seite"; ich.spiegeln = Math.sign(dx) || 1; } else ich.richtung = dz < 0 ? "hinten" : "vorn";
  t.tipp();
}
$("springen").addEventListener("pointerdown", e => { e.preventDefault(); e.stopPropagation(); aktion(); });
// Tier streicheln: Herzen steigen auf
const herzListe = [];
function streichle() {
  if (!tier) return;
  for (let i = 0; i < 4; i++) { const h = new Sprite(TX.herz.tex); h.anchor.set(0.5); h.position.set(tierS.x + Math.round((Math.random() - 0.5) * 14), tierS.y - 18); h.zIndex = 99999; h.t = 0; h.v = 16 + Math.random() * 10; dinge.addChild(h); herzListe.push(h); }
  if (TP.streicheln) TP.streicheln();
  S.ton("juhu"); $("info").textContent = `${tierDaten.name || "Dein Tier"} freut sich!`;
}

// ======================================================================================================
// Zimmer betreten und verlassen
// ======================================================================================================
function spielOrt(fn) { if (K.spielZeit()) { fn(); return; } sprechblase(...K.schlaeftText(), null); }
let draussen = null, besuche = 0;
function reingehen() {
  drinnen = true; besuche++; $("raus").hidden = false; $("einrichten").hidden = false; $("blase").hidden = true;
  draussen = { x: ich.x, z: ich.z };
  ich.x = 0; ich.z = 2.6; ich.richtung = "hinten"; ziel = null; ankunft = null; markeS.visible = false;
  zimmerC.visible = true; boden.visible = unten.visible = schatten.visible = dinge.visible = nebelC.visible = wolkenC.visible = glanz.visible = false;
  himmel.visible = false; app.renderer.background.color = NACHT ? 0x4A4058 : 0xF7E3C6;
  dinge.removeChild(ichS); zimmerDinge.addChild(ichS); if (tierS) { dinge.removeChild(tierS); zimmerDinge.addChild(tierS); tier.x = 1.2; tier.z = 2.9; if (schleifeS) { dinge.removeChild(schleifeS); zimmerDinge.addChild(schleifeS); } }
  zimmerDinge.addChild(ichSchatten); if (tierSchatten) zimmerDinge.addChild(tierSchatten); ichSchatten.zIndex = -0.5;
  zimmerDinge.addChild(markeS); markeS.zIndex = -0.4;
  toene();
  $("info").textContent = "Dein Zimmer. Kleiderschrank, Spiegel und Album – tippe sie an!";
  S.ton("tipp");
}
function rausgehen() {
  drinnen = false; $("raus").hidden = true; $("einrichten").hidden = true; window.Einrichten.zu();
  ich.x = TUER.x; ich.z = TUER.z + 0.2; ich.richtung = "vorn"; ziel = null; ankunft = null; markeS.visible = false;
  zimmerC.visible = false; boden.visible = unten.visible = schatten.visible = dinge.visible = nebelC.visible = wolkenC.visible = glanz.visible = true; himmel.visible = true; app.renderer.background.color = 0x2459B8;
  zimmerDinge.removeChild(ichS); dinge.addChild(ichS); schatten.addChild(ichSchatten); unten.addChild(markeS);
  if (tierS) { zimmerDinge.removeChild(tierS); dinge.addChild(tierS); schatten.addChild(tierSchatten); tier.x = ich.x + 1.1; tier.z = ich.z + 0.4; if (schleifeS) { zimmerDinge.removeChild(schleifeS); dinge.addChild(schleifeS); } }
  toene();
  $("info").textContent = K.spielZeit() ? `Hallo ${name}!` : "🌱 Erst lernen: Geh zu Ella, Fipsi oder Benno.";
  if (wetter) zeigeWetterInfo();
  S.ton("tipp");
}
$("raus").addEventListener("click", rausgehen);
function zeigeLernmodus() {
  const an = !K.spielZeit(); $("lern-hinweis").hidden = !an;
  if (an && Z) { const st = Z.status(); $("lern-hinweis").textContent = st.genug ? "😴 Für heute genug gespielt – Lernen geht noch!" : `🌱 Erst lernen: noch ${st.fehltMin} Minuten oder ${st.fehltAufgaben} Aufgaben. Geh zu Ella, Fipsi oder Benno!`; }
  if (an && drinnen && !prolog) rausgehen();
}
document.addEventListener("zeit-aenderung", zeigeLernmodus);
setInterval(zeigeLernmodus, 10000);

// ======================================================================================================
// Sprechblase (gleiche Knöpfe wie bei „Rund“)
// ======================================================================================================
let blaseZiel = null, blaseExtra = null;
function sprechblase(e, titel, text, ru, ziel2, extra) {
  blaseExtra = extra || null; $("blase-extra").hidden = !extra; if (extra) $("blase-extra").textContent = extra[0];
  $("blase-e").innerHTML = window.Figuren && window.Figuren[e] ? window.Figuren[e]("") : e; $("blase-titel").textContent = titel; $("blase-text").textContent = text;
  const ruEl = $("blase-ru"); ruEl.textContent = ru || ""; ruEl.hidden = true;
  const hl = S.hilfe && S.hilfe(); $("blase-ruk").hidden = !(ru && hl); if (hl) { $("blase-ruk").textContent = hl.kurz; ruEl.lang = hl.code; ruEl.dir = hl.rtl ? "rtl" : "ltr"; }
  $("blase-los").hidden = !ziel2; blaseZiel = ziel2;
  $("blase").hidden = false; S.ton("tipp");
  if (SP && SP.sprich) SP.sprich(text, "de-DE");
}
function zeigeAntwort(a) { if (!a) return; sprechblase(...a.blase, a.extra === "prolog" ? ["🔁 Wie ging das nochmal?", () => starteProlog(true)] : null); }
// Ziele der Stationen sind relativ zu spiele/<ordner>/ – passt auch für spiele/pixel/
$("blase-zu").addEventListener("click", () => { $("blase").hidden = true; if (SP && SP.stopp) SP.stopp(); });
$("blase-los").addEventListener("click", () => { if (blaseZiel) location.href = blaseZiel; });
$("blase-extra").addEventListener("click", () => { $("blase").hidden = true; if (SP && SP.stopp) SP.stopp(); if (blaseExtra) blaseExtra[1](); });
$("blase-ruk").addEventListener("click", () => { const r = $("blase-ru"); r.hidden = !r.hidden; if (!r.hidden && SP) SP.sprich(r.textContent, (S.hilfe() || { tts: "ru-RU" }).tts); });

// ======================================================================================================
// Hauptschleife
// ======================================================================================================
let t = 0, wTakt = 0, bildNr = 0, lauf = 0;
const v = 4;   // Welteinheiten pro Sekunde
app.ticker.add((tk) => {
  const dt = Math.min(tk.deltaMS / 1000, 0.05); t += dt;
  let geht = false, ix = 0, iz = 0;
  if (tasten["arrowleft"] || tasten["a"]) ix -= 1; if (tasten["arrowright"] || tasten["d"]) ix += 1;
  if (tasten["arrowup"] || tasten["w"]) iz -= 1; if (tasten["arrowdown"] || tasten["s"]) iz += 1;
  if ((ix || iz) && $("blase").hidden) {
    ziel = null; ankunft = null; markeS.visible = false; geht = true;
    const n = Math.hypot(ix, iz); ich.x += ix / n * v * dt; ich.z += iz / n * v * dt; wegVonHindernissen(ich, RAND_PUFFER);
    if (Math.abs(ix) >= Math.abs(iz)) { ich.richtung = "seite"; ich.spiegeln = ix; } else ich.richtung = iz < 0 ? "hinten" : "vorn";
  } else if (ziel) {
    const dx = ziel.x - ich.x, dz = ziel.z - ich.z, d = Math.hypot(dx, dz);
    const fertig = () => { ziel = null; markeS.visible = false; if (ankunft) { const f = ankunft; ankunft = null; f(); } };
    if (d < 0.08) fertig();
    else {
      geht = true; const vx = ich.x, vz = ich.z, s = Math.min(d, v * dt);
      ich.x += dx / d * s; ich.z += dz / d * s; wegVonHindernissen(ich, RAND_PUFFER);
      if (Math.hypot(ich.x - vx, ich.z - vz) < 0.2 * s) fertig();   // hängt fest
      if (Math.abs(dx) > Math.abs(dz) * 1.1) { ich.richtung = "seite"; ich.spiegeln = Math.sign(dx); } else ich.richtung = dz < 0 ? "hinten" : "vorn";
    }
  }
  if (drinnen && ich.z >= ZIMMER_GRENZE.z1 - 0.02 && Math.abs(ich.x) < 0.9 && !prolog && geht) rausgehen();
  if (ich.hoehe > 0 || ich.vy > 0) { ich.vy -= 420 * dt; ich.hoehe += ich.vy * dt; if (ich.hoehe <= 0) { ich.hoehe = 0; ich.vy = 0; } }
  lauf += geht ? dt : 0;
  const schritt = geht ? [1, 0, 2, 0][Math.floor(lauf * 8) % 4] : 0;
  ichS.texture = KIND[ich.richtung][schritt].tex; ichS.scale.x = ich.richtung === "seite" ? ich.spiegeln : 1;
  const ipx = drinnen ? zx(ich.x) : px(ich.x), ipy = drinnen ? zz(ich.z) : py(ich.z);
  ichS.position.set(Math.round(ipx), Math.round(ipy - ich.hoehe)); ichS.zIndex = Math.round(ipy);
  ichSchatten.position.set(Math.round(ipx), Math.round(ipy) - 1);
  // Tier folgt
  if (tier) {
    const fx = ich.x - (ich.richtung === "seite" ? ich.spiegeln : 0) * 0.9 - tier.x, fz = ich.z + 0.15 - tier.z, fd = Math.hypot(fx, fz), laeuft = fd > 0.8;
    if (laeuft) {
      const s = Math.min(fd - 0.8, (fd > 3 ? 7 : 4.2) * dt); tier.x += fx / fd * s; tier.z += fz / fd * s;
      if (Math.abs(fx) > Math.abs(fz) * 0.8) { tier.richtung = "seite"; tier.spiegeln = Math.sign(fx) || 1; } else tier.richtung = fz < 0 ? "hinten" : "vorn";
    }
    const tanz = performance.now() < tanzBis ? Math.round(Math.abs(Math.sin(t * 9)) * 4) : 0;
    tierS.texture = TIER_TX[tier.richtung][laeuft ? Math.floor(t * 10) % 2 : 0].tex; tierS.scale.x = tier.richtung === "seite" ? tier.spiegeln : 1;
    const tpx = drinnen ? zx(tier.x) : px(tier.x), tpy = drinnen ? zz(tier.z) : py(tier.z);
    tierS.position.set(Math.round(tpx), Math.round(tpy) - tanz); tierS.zIndex = Math.round(tpy);
    tierSchatten.position.set(Math.round(tpx), Math.round(tpy) - 1);
    if (schleifeS) { schleifeS.position.set(tierS.x + (tier.richtung === "seite" ? tierS.scale.x * 6 : 0), tierS.y - (tier.richtung === "seite" ? 14 : 12)); schleifeS.zIndex = tierS.zIndex + (tier.richtung === "hinten" ? -0.1 : 0.1); }
  }
  // Nachbarn: schauen zum Kind, hüpfen, wenn sie sich freuen oder zur Musik tanzen; einfache Zwei-Bild-Animation
  NACHBARN.forEach((n, i) => {
    if (n.freut && !(n.huepf > 0) && (t + i * 1.3) % 5 < dt) n.huepf = 1;
    if (n.huepf > 0) n.huepf = Math.max(0, n.huepf - dt * 2);
    const bild = Math.floor(t * 1.6 + i * 0.7) % 4 === 0 ? 1 : 0;
    n.s.texture = TX[n.e][n.e === "robo" ? (Math.floor(t * 2) % 2) : bild].tex;
    const dx = px(ich.x) - n.s.x; if (!drinnen && Math.abs(dx) > 6 && Math.hypot(ich.x - n.x, ich.z - n.z) < 7) n.s.scale.x = n.e === "fipsi" ? Math.sign(dx) : 1;
    n.s.y = n.y0 - Math.round(Math.sin((1 - n.huepf) * Math.PI) * (n.huepf ? 6 : 0)) - (n.e === "robo" ? Math.round(Math.sin(t * 2) * 1.5) : 0);
  });
  if (paulaHuepf > 0) paulaHuepf = Math.max(0, paulaHuepf - dt * 2.6);
  paulaS.texture = TX.paula[performance.now() < tanzBis ? Math.floor(t * 6) % 2 : Math.floor(t * 1.3) % 5 === 0 ? 1 : 0].tex;
  paulaS.y = paulaY - Math.round(Math.sin((1 - paulaHuepf) * Math.PI) * (paulaHuepf ? 5 : 0));
  tildaS.texture = TX.tilda[Math.floor(t * 0.8) % 3 === 0 ? 1 : 0].tex;
  fruechte.forEach(f => { f.s.visible = t > f.ab; });
  stationS.texture = TX.station[Math.floor(t * (2 + Math.min(10, ((wetter && wetter.wind) || 8) * 0.25))) % 2].tex;
  ballonsS.texture = TX.ballons[Math.floor(t * 1.2) % 2].tex;
  for (let i = herzListe.length - 1; i >= 0; i--) { const h = herzListe[i]; h.t += dt; h.y -= h.v * dt; h.alpha = 1 - h.t; if (h.t > 1) { h.destroy(); herzListe.splice(i, 1); } }
  // Wasser, Schaum und Blumen in zwei Bildern; Boot schaukelt
  if (!RUHIG) { wTakt += dt; if (wTakt > 0.55) { wTakt = 0; bildNr ^= 1; boden.texture = BODEN[bildNr]; bootS.y = Math.round(py(STEG.z1 - 0.6)) + bildNr; } }
  wolkenListe.forEach(w => { w.ox += dt * 4; if (w.ox > KARTE + 4 * T) w.ox = -8 * T; w.x = Math.round(w.ox); });
  if (lichter.length) { const n = Math.floor(performance.now() / 600); lichter.forEach((l, i) => { l.texture = TX.licht[(i + n) % 4].tex; }); }
  if (drinnen) {
    moebelS.forEach(m => { if (m.moebel === "tannenbaum") m.texture = TX.tannenbaum[Math.floor(performance.now() / 700) % 2].tex; });
    fischeS.forEach(f => { const v = Math.sin(t * (0.8 + f.i * 0.3) + f.i * 2); f.position.set(Math.round(f.basis.x + v * 7), f.basis.y); f.scale.x = Math.cos(t * (0.8 + f.i * 0.3) + f.i * 2) > 0 ? -1 : 1; });
  }
  // Regen/Schnee (auf dem Bildschirm), Blitz
  if (!drinnen) teilchen.forEach(p => { p.y += p.v * dt; p.x += (wetter && wetter.art === "schnee" ? Math.sin(t + p.p) * 12 : -40) * dt; if (p.y > app.screen.height) { p.y = -8; p.x = Math.random() * app.screen.width; } });
  if (wetter && wetter.art === "gewitter" && !drinnen && !RUHIG) { blitz -= dt; if (blitz < -6 - Math.random() * 6) blitz = 0.12; blitzS.alpha = blitz > 0 ? 0.55 : 0; }
  pruefeNaehe();
  kamera();
}, null, UPDATE_PRIORITY.HIGH);
// Zeichenaufrufe zählen (für Tests und das Leistungsbudget): WebGL-Aufrufe je Bild
const zaehler = { n: 0, letzt: 0 };
{
  const gl = app.renderer.gl;
  if (gl) for (const f of ["drawElements", "drawArrays", "drawElementsInstanced", "drawArraysInstanced"]) { const alt = gl[f]; if (alt) gl[f] = function (...a) { zaehler.n++; return alt.apply(this, a); }; }
  app.ticker.add(() => { zaehler.letzt = zaehler.n; zaehler.n = 0; }, null, UPDATE_PRIORITY.LOW);
}

// ======================================================================================================
// Begrüßung, Wetter, Sticker
// ======================================================================================================
$("sterne").textContent = S.sterne();
function zeigeWetterInfo() { const w = wetterSatz(); if (w && !drinnen && K.spielZeit()) $("info").textContent = `${w} – hallo ${name}!`; }
const WELT_GRUSS = { wiese: "Die Blumen blühen", wald: "Der Wald rauscht", berge: "Die Berge rufen", strand: "Die Wellen rauschen", schnee: "Alles glitzert im Schnee", wueste: "Die Sonne scheint warm" };
$("info").textContent = NACHT ? `Gute Nacht, ${name}! Die Insel schläft bald.` : !WELT.insel ? `${WELT_GRUSS[WELT.biom]}, ${name}! Willkommen in deiner Welt.` : SAISON === "winter" ? `Es hat geschneit, ${name}!` : SAISON === "herbst" ? `Die Blätter sind bunt, ${name}!` : `Hallo ${name}! Schön, dass du da bist.`;
{
  const st = K.startWetter(q);
  if (st.sofort) { wendeWetterAn(st.sofort); if (st.cache) setTimeout(() => wetterSticker(st.sofort), 1500); }
  if (st.holen) holeWetter();
}
zeigeLernmodus(); if (!NACHT) zeigeWetterInfo();
if (window.Sticker) setTimeout(() => { window.Sticker.feste(); if (NACHT && !q.has("stunde")) window.Sticker.entdecke("w-mond"); }, 1200);
if (q.get("drinnen") === "1" && K.spielZeit()) reingehen();
// Look umschalten (NA-25): zurück zu „Rund“ – Spielstand, Story und Zimmer bleiben
if (S.lookWaehlbar && S.lookWaehlbar() && (S.lookKindDarf() || S.erwachsen())) {
  $("look").hidden = false;
  $("look").addEventListener("click", () => { S.ton("tipp"); S.setzeLook("rund"); location.href = "../welt3d/heimat.html" + location.search.replace(/[?&]szene=[^&]*/, ""); });
}

// ======================================================================================================
// Prolog „Ankunft“ (E1) in Pixel: Kamera schwebt vom Meer heran, Laufen per Tippen, zum Haus, Aktionsknopf
// ======================================================================================================
function starteProlog(wiederholen) {
  const Sz = window.Szene, St = window.Story; if (!Sz || !St || prolog) return false;
  const def = Sz.def("prolog"); if (!def) return false;
  if (drinnen) rausgehen();
  $("blase").hidden = true;
  ich.x = STEG.x; ich.z = Math.min(RMAX_LAUF - 0.2, STEG.z0 + 1.4); ich.richtung = "hinten"; ziel = null; markeS.visible = false; fahrt = performance.now();
  if (tier) { tier.x = ich.x + 0.9; tier.z = ich.z + 0.3; }
  prolog = { start: { x: ich.x, z: ich.z } };
  const poll = (pruef, weiter) => { const id = setInterval(() => { if (pruef()) { clearInterval(id); weiter(); } }, 150); return () => clearInterval(id); };
  const b = def.blasen;
  // 2: Laufen lernen – in Pixel immer per Tippen (die Hand zeigt auf die Wiese vor der Figur)
  if (b[1].alt && b[1].alt.tippen) b[1].text = b[1].alt.tippen;
  b[1].zeige = () => bildschirm(ich.x, ich.z - 3);
  b[1].bis = (weiter) => poll(() => Math.hypot(ich.x - prolog.start.x, ich.z - prolog.start.z) > 2.2, weiter);
  b[2].zeige = window.Insel.ort("haus");
  b[2].bis = (weiter) => poll(() => naechstes === hausT, weiter);
  b[3].zeige = "#springen";
  b[3].bis = (weiter) => poll(() => drinnen, weiter);
  Sz.spiele(def, { chronik: !wiederholen }).then(() => { prolog = null; fahrt = null; St.etappeFertig("E1"); });
  return true;
}
if (K.prologFaellig(q)) setTimeout(() => starteProlog(false), 700);

// ======================================================================================================
// Story (E2 „Erst lernen“, „Die Sonne geht auf“, E3 „Erste Frucht“, Weihnachtspaket) – Auswahl im Kern
// ======================================================================================================
let storyLaeuft = false;
function spieleStory(id) {
  const Sz = window.Szene, St = window.Story, def = Sz && Sz.def(id); if (!def) return;
  const b = def.blasen, I = window.Insel;
  if (id === "erst-lernen") { b[0].zeige = I.ort("sonnenuhr"); b[2].zeige = I.ort("eule"); }
  if (id === "sonne") { b[0].zeige = I.ort("sonnenuhr"); b[0].beim = zeigeSonnenuhr; }
  if (id === "weihnachtspaket") { b.forEach(x => { x.zeige = () => (paket ? bildschirm(PAKET_POS.x, PAKET_POS.z, 1) : null); }); b[1].bis = (weiter) => { const tt = setInterval(() => { if (!paket) { clearInterval(tt); weiter(); } }, 200); return () => clearInterval(tt); }; }
  if (id === "erste-frucht") { b[0].zeige = I.ort("wissensbaum"); b[2].beim = () => { St.setzeKapitel(1); nebelWeicht(); }; }
  // E4–E8 (NA-14): Zeigehand und Warten; Auslöser und Texte kommen aus Kern und shared/szenen.js
  const warte = (pruef) => (weiter) => { const tt = setInterval(() => { if (pruef()) { clearInterval(tt); weiter(); } }, 200); return () => clearInterval(tt); };
  if (id === "sterne") { b[0].zeige = "#sterne"; b[1].zeige = I.ort("haus"); b[1].bis = warte(() => drinnen); b[2].zeige = "#einrichten"; b[2].bis = warte(() => window.Einrichten && window.Einrichten.offen); }
  if (id === "ei") b.forEach(x => { x.zeige = I.ort("nest"); });
  if (id === "spielorte") b[0].zeige = I.ort("ballons");
  if (id === "merkkiste") { const wer = K.merkkisteBei(); b.forEach(x => { x.wer = wer; x.zeige = I.ort(wer === "eule" ? "eule" : "fipsi"); }); }
  if (id === "gefuehle") b.forEach(x => { x.zeige = I.ort("baer"); });
  storyLaeuft = true;
  Sz.spiele(def).then(() => { storyLaeuft = false; K.storyFertig(def); nebelWeicht(); if (id === "ei" && !tier && $("blase").hidden) zeigeAntwort(K.antwort("nest")); setTimeout(naechsteStory, 1200); });
}
function naechsteStory() {
  const id = K.naechsteStory({ paket: !!paket, prolog: !!prolog, drinnen, laeuft: storyLaeuft, test: q.has("szene") });
  if (id) spieleStory(id);
}
setTimeout(naechsteStory, 900);
setInterval(naechsteStory, 5000);

// ======================================================================================================
// Schnittstellen: Zeigehand/Szenen (window.Insel) und Test-Haken (window.__pixel)
// ======================================================================================================
const ORTE = { ich: () => [ich.x, ich.z, 1.4] };
Object.entries(KI.ORTE).forEach(([k, o]) => { ORTE[k] = () => [o.x, o.z, o.h]; });
window.Insel = { look: "pixel", bildschirm, ort: (n) => () => (ORTE[n] && !drinnen ? bildschirm(...ORTE[n]()) : null), ORTE: Object.keys(ORTE) };
window.__pixel = {
  bildschirm, ich, get tier() { return tier; }, reingehen, rausgehen, get drinnen() { return drinnen; }, get besuche() { return besuche; }, get ziel() { return ziel; },
  laufeZu: (x, z) => { ziel = { x, z }; ankunft = null; markiere(x, z); }, teleport: (x, z) => { ich.x = x; ich.z = z; ziel = null; ankunft = null; markeS.visible = false; },
  tippe: (id) => { const t2 = (drinnen ? zimmerTipp : tippbar).find(x => x.id === id); if (t2) t2.tipp(); return !!t2; },
  orte: () => tippbar.map(x => ({ id: x.id, x: x.x, z: x.z, nah: x.nah })), nachbarn: () => NACHBARN.map(n => n.e),
  get aktion() { return naechstes ? naechstes.aktion[1] : null; }, druecke: () => aktion(),
  get paket() { return paket ? { x: PAKET_POS.x, z: PAKET_POS.z } : null; }, oeffnePaket, lichter: () => lichter.length,
  nebel: () => ({ stufe: nebelJetzt, alpha: nebelS ? nebelS.alpha : 0 }), naechsteStory, prolog: (w) => starteProlog(!!w), get imProlog() { return !!prolog; },
  steg: STEG, su: SU, tuer: TUER, zimmerDaten: K.zimmerDaten, moebel: () => moebelS.map(m => m.moebel), einrichten: () => window.Einrichten.oeffne(), get ringe() { return platzRinge.filter(r => r.visible).length; }, get wetter() { return wetter; }, get tanzt() { return performance.now() < tanzBis; },
  zeichnungen: () => zaehler.letzt, info: () => ({ zeichnungen: zaehler.letzt, skala, karte: KARTE, sprites: dinge.children.length }), SAISON, NACHT, MONAT, skala: () => skala, zoom: (z) => { festSkala = z || null; layout(); },
  figur: () => KF, get tierRichtung() { return tier ? tier.richtung : null; }
};
