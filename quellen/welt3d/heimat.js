// Heimatinsel (Stil B: rund, Toon-Licht, Konturen).
// Figur trägt den aktuellen Look aus dem Kleiderschrank, das eigene Tier läuft mit,
// Tag/Nacht nach der Uhr, Jahreszeit nach dem Datum, Nachbarn führen zu den Fächern.
// Test-Parameter: ?stunde=21  ?monat=12  (Jahreszeit/Nacht ausprobieren)
import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, Fog, HemisphereLight, DirectionalLight, Clock, SRGBColorSpace,
  PCFSoftShadowMap, Group, Mesh, MeshToonMaterial, MeshBasicMaterial, MeshLambertMaterial, BackSide,
  CylinderGeometry, SphereGeometry, ConeGeometry, BoxGeometry, CapsuleGeometry, PlaneGeometry,
  LatheGeometry, ExtrudeGeometry, Shape, Vector2, Vector3, DataTexture, RedFormat, NearestFilter, InstancedMesh,
  Object3D, Raycaster, CircleGeometry, TorusGeometry, MathUtils, BufferGeometry, Float32BufferAttribute, Points, PointsMaterial
} from "../three/three.module.js";
import { S } from "./gemeinsam.js";

const $ = (id) => document.getElementById(id);
const SP = window.Sprache;
const q = new URLSearchParams(location.search);
const jetzt = new Date();
const STUNDE = q.has("stunde") ? +q.get("stunde") : jetzt.getHours() + jetzt.getMinutes() / 60;
const MONAT = q.has("monat") ? +q.get("monat") : jetzt.getMonth() + 1;
const SAISON = [12, 1, 2].includes(MONAT) ? "winter" : [3, 4, 5].includes(MONAT) ? "fruehling" : [9, 10, 11].includes(MONAT) ? "herbst" : "sommer";
const NACHT = STUNDE >= 20 || STUNDE < 6.5, DAEMMER = !NACHT && (STUNDE >= 18 || STUNDE < 8);
const GRAFIK_KEY = "lerninsel.grafik";
const lies = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const EINFACH = lies(GRAFIK_KEY) === "einfach";
const RUHIG = !!(window.Zeit && window.Zeit.regeln().ruhig); // ruhige Darstellung: Gras und Wasser bewegen sich nicht

// ---------- Renderer, Szene, Licht ----------
const renderer = new WebGLRenderer({ antialias: !EINFACH, powerPreference: "high-performance" });
renderer.setPixelRatio(EINFACH ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
renderer.outputColorSpace = SRGBColorSpace;
renderer.shadowMap.enabled = !EINFACH;
renderer.shadowMap.type = PCFSoftShadowMap;
$("buehne").appendChild(renderer.domElement);

const scene = new Scene();
const HIMMEL = NACHT ? "#1C2A55" : DAEMMER ? "#F6B98A" : SAISON === "winter" ? "#CFE6F5" : "#A8DDF5";
scene.background = new Color(HIMMEL);
scene.fog = new Fog(HIMMEL, 32, 80);
const camera = new PerspectiveCamera(40, 1, 0.1, 200);
scene.add(new HemisphereLight(NACHT ? "#8FA6E8" : "#FFF4E0", NACHT ? "#2C3E5C" : "#8CCB6E", NACHT ? 0.7 : DAEMMER ? 1.1 : 1.3));
const sonne = new DirectionalLight(NACHT ? "#AFC4FF" : DAEMMER ? "#FFC28A" : "#FFE9C7", NACHT ? 0.6 : DAEMMER ? 1.6 : 2.2);
sonne.castShadow = !EINFACH;
sonne.shadow.mapSize.set(1024, 1024); sonne.shadow.radius = 6; sonne.shadow.bias = -0.0006; sonne.shadow.normalBias = 0.03;
Object.assign(sonne.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, near: 1, far: 60 });
scene.add(sonne); scene.add(sonne.target);

// ---------- Material- und Formhelfer ----------
const verlauf = new DataTexture(new Uint8Array([110, 190, 255]), 3, 1, RedFormat);
verlauf.minFilter = verlauf.magFilter = NearestFilter; verlauf.needsUpdate = true;
const mats = new Map();
const mat = (f) => { if (!mats.has(f)) mats.set(f, new MeshToonMaterial({ color: f, gradientMap: verlauf })); return mats.get(f); };
const UMRISS = new MeshBasicMaterial({ color: "#4A3558", side: BackSide });
function teil(geo, farbe, { umriss = true, dicke = 1.06, schatten = true } = {}) {
  const m = new Mesh(geo, typeof farbe === "string" ? mat(farbe) : farbe);
  m.castShadow = schatten; m.receiveShadow = true;
  if (umriss) { const u = new Mesh(geo, UMRISS); u.scale.setScalar(dicke); m.add(u); }
  return m;
}
const kugel = (r, a = 28, b = 20) => new SphereGeometry(r, EINFACH ? Math.ceil(a / 2) : a, EINFACH ? Math.ceil(b / 2) : b);
const setze = (o, x, y, z) => { o.position.set(x, y, z); return o; };
const AUGE = new MeshBasicMaterial({ color: "#2E2240" }), WEISS = new MeshBasicMaterial({ color: "#ffffff" });
function augen(eltern, abstand, y, z, r = 0.075) {
  [-1, 1].forEach(s => {
    const a = new Mesh(kugel(r, 14, 10), AUGE); a.scale.set(1, 1.35, 0.6); setze(a, abstand * s, y, z); eltern.add(a);
    a.add(setze(new Mesh(kugel(r * 0.4, 8, 6), WEISS), r * 0.33, r * 0.4, r * 0.8));
  });
}

// ---------- Hindernisse und antippbare Dinge ----------
const hindernisse = []; // { x, z, r }
const tippbar = [];     // Object3D mit userData.tipp()
const block = (x, z, r) => hindernisse.push({ x, z, r });
// Zeitsystem: ohne Spielzeit ist die Insel im Lernmodus (Lern-Nachbarn gehen, Spielorte schlafen)
const Z = window.Zeit;
const spielZeit = () => !Z || Z.status().spielen;
const profi = () => S.offen((S.lade("medien") || {}).fuehrerschein);
function spielOrt(fn) {
  if (spielZeit()) { fn(); return; }
  const st = Z.status();
  sprechblase("💤", "Schläft noch", st.genug ? "Für heute ist genug gespielt. Morgen geht es weiter!" : `Erst lernen, dann spielen! Noch ${st.fehltMin} Minuten oder ${st.fehltAufgaben} Aufgaben. Ella, Fipsi, Pixel und der Matheweg helfen dir.`,
    S.paar(["", "Сначала учиться, потом играть! Элла, Фипси, Пиксель и математическая тропа помогут тебе."])[1], null);
}
function antippbar(obj, fn) { obj.userData.tipp = fn; tippbar.push(obj); }

// ---------- Insel und Wasser ----------
const GRAS = SAISON === "winter" ? "#EEF5FB" : SAISON === "herbst" ? "#8DC45A" : "#7CCB5B";
const boden = [];
{
  const sand = new LatheGeometry([new Vector2(0, -1.2), new Vector2(15.2, -1.2), new Vector2(15.6, -0.6), new Vector2(15.2, -0.1), new Vector2(0, -0.1)], 64);
  const s = new Mesh(sand, mat(SAISON === "winter" ? "#F3E9D8" : "#F2D9A2")); s.receiveShadow = true; scene.add(s);
  const g = new Mesh(new LatheGeometry([new Vector2(13.1, -0.3), new Vector2(12.9, 0.05), new Vector2(12.2, 0.25), new Vector2(0, 0.25)], 64), mat(GRAS));
  g.receiveShadow = true; scene.add(g); boden.push(g, s);
  // Pfad vom Haus zum Platz in der Mitte
  for (let i = 0; i < 7; i++) {
    const p = new Mesh(new CylinderGeometry(0.55, 0.6, 0.12, 20), mat("#D9CDB8"));
    p.receiveShadow = true; setze(p, -4 + i * 1.25, 0.28, -2.6 + Math.sin(i * 0.9) * 0.6); scene.add(p);
  }
}
const wasserGeo = new PlaneGeometry(140, 140, EINFACH ? 1 : 70, EINFACH ? 1 : 70); wasserGeo.rotateX(-Math.PI / 2);
const wasser = new Mesh(wasserGeo, new MeshToonMaterial({ color: NACHT ? "#2E5F8C" : "#5EC3E6", gradientMap: verlauf, transparent: true, opacity: 0.92 }));
wasser.position.y = -0.55; wasser.receiveShadow = true; scene.add(wasser);
const wasserBasis = Float32Array.from(wasserGeo.attributes.position.array);
{ const schaum = new Mesh(new TorusGeometry(15.9, 0.18, 8, 80), new MeshBasicMaterial({ color: "#EAFBFF" })); schaum.rotation.x = Math.PI / 2; schaum.position.y = -0.48; scene.add(schaum); }

// ---------- Bäume (Farbe nach Jahreszeit), Steine, Blumen ----------
const KRONE = { sommer: ["#5DBB5A", "#4FAF62"], fruehling: ["#5DBB5A", "#F6B6CE"], herbst: ["#F2A03D", "#E2603A", "#F4C542", "#5DBB5A"], winter: ["#3E8E5A", "#3E8E5A"] };
function baum(x, z, k = 1, i = 0) {
  const b = new Group();
  b.add(setze(teil(new CylinderGeometry(0.22 * k, 0.32 * k, 1.6 * k, 16), "#9A6A3F"), 0, 0.8 * k, 0));
  const farben = KRONE[SAISON], f = farben[i % farben.length];
  [[0, 2.4, 0, 1.15], [0.8, 2.0, 0.2, 0.8], [-0.75, 2.05, -0.1, 0.85], [0.1, 2.0, 0.8, 0.75], [0, 3.1, 0, 0.75]].forEach(([dx, y, dz, r]) =>
    b.add(setze(teil(kugel(r * k), f), dx * k, y * k, dz * k)));
  if (SAISON === "winter") b.add(setze(teil(kugel(0.6 * k), "#FFFFFF"), 0, 3.45 * k, 0));
  if (SAISON === "sommer" && i % 2 === 0) [[0.6, 2.3, 0.9], [-0.8, 2.6, 0.6], [0.9, 2.8, -0.4]].forEach(([dx, y, dz]) => b.add(setze(teil(kugel(0.16 * k), "#FF7A6B", { dicke: 1.12 }), dx * k, y * k, dz * k)));
  b.position.set(x, 0.2, z); b.rotation.y = x * 1.7; scene.add(b); block(x, z, 0.6 * k);
}
[[-9, -6, 1.1], [-7.5, 3.2, 0.9], [7.5, -7, 1], [10.5, 1, 1.1], [3, -10, 0.85], [-3.5, 9.8, 0.8], [-11, -1, 0.75], [1.5, 11, 0.7], [-11.5, 6, 0.8]]
  .forEach(([x, z, k], i) => baum(x, z, k, i));
[[4.5, 3.6, 0.6], [5.2, 4.1, 0.35], [-6, 6.5, 0.5]].forEach(([x, z, r]) => {
  const st = teil(kugel(r, 20, 14), "#A7A9B8"); st.scale.y = 0.65; setze(st, x, 0.25 + r * 0.3, z); scene.add(st); block(x, z, r);
});
if (SAISON !== "winter") {
  const BL = ["#FF6F91", "#FFD84D", "#FFFFFF", "#B28DFF", "#FF9E5E"], n = SAISON === "fruehling" ? 44 : 26;
  for (let i = 0; i < n; i++) {
    const w = i * 2.399, r = 4 + (i * 37 % 70) / 10, x = Math.cos(w) * r, z = Math.sin(w) * r;
    if (Math.hypot(x + 5, z + 4.5) < 3.4) continue;
    const f = new Group();
    f.add(setze(new Mesh(new CylinderGeometry(0.03, 0.03, 0.4, 4), mat("#3E9E55")), 0, 0.2, 0));
    f.add(setze(teil(kugel(0.14, 12, 8), BL[i % BL.length], { dicke: 1.15 }), 0, 0.45, 0));
    f.position.set(x, 0.25, z); scene.add(f);
  }
}

// ---------- Haus ----------
const fensterMat = new MeshBasicMaterial({ color: NACHT || DAEMMER ? "#FFD46B" : "#9BD7F5" });
{
  const h = new Group();
  const form = new Shape(), w = 1.5, r = 0.35;
  form.moveTo(-w + r, -w); form.lineTo(w - r, -w); form.quadraticCurveTo(w, -w, w, -w + r); form.lineTo(w, w - r); form.quadraticCurveTo(w, w, w - r, w);
  form.lineTo(-w + r, w); form.quadraticCurveTo(-w, w, -w, w - r); form.lineTo(-w, -w + r); form.quadraticCurveTo(-w, -w, -w + r, -w);
  const koerper = new ExtrudeGeometry(form, { depth: 2.4, bevelEnabled: true, bevelSize: 0.15, bevelThickness: 0.15, bevelSegments: 4, curveSegments: 10 });
  koerper.rotateX(-Math.PI / 2);
  const d = new Shape(); d.moveTo(-2, 0); d.lineTo(0, 1.6); d.lineTo(2, 0); d.lineTo(-2, 0);
  const dach = new ExtrudeGeometry(d, { depth: 3.4, bevelEnabled: true, bevelSize: 0.18, bevelThickness: 0.18, bevelSegments: 4 }); dach.translate(0, 0, -1.7);
  h.add(teil(koerper, "#FFE3B8", { dicke: 1.03 }));
  h.add(setze(teil(dach, "#E2604F", { dicke: 1.03 }), 0, 2.5, 0));
  if (SAISON === "winter") { const sch = teil(new BoxGeometry(3.6, 0.2, 3.9), "#FFFFFF", { dicke: 1.03 }); sch.rotation.z = 0; setze(sch, 0, 4.15, 0); sch.scale.set(0.35, 1, 1); h.add(sch); }
  h.add(setze(teil(new BoxGeometry(0.8, 1.3, 0.12), "#9A6A3F", { dicke: 1.08 }), 0, 0.65, 1.7));
  [0.95, -0.95].forEach(x => h.add(setze(teil(new BoxGeometry(0.7, 0.7, 0.1), fensterMat, { dicke: 1.1 }), x, 1.5, 1.7)));
  h.add(setze(teil(new CylinderGeometry(0.22, 0.22, 0.9, 16), "#B9584A"), 0.9, 3.5, -0.5));
  h.position.set(-5, 0.25, -4.5); h.rotation.y = 0.35; scene.add(h); block(-5, -4.5, 2.3);
  antippbar(h, () => spielOrt(() => reingehen()));
}

// ---------- Wolken, Sterne, Schnee ----------
const wolken = [];
for (let i = 0; i < 5; i++) {
  const w = new Group();
  [[0, 0, 0, 1.4], [1.3, -0.2, 0, 1], [-1.3, -0.25, 0.1, 1.05], [0.4, 0.5, -0.3, 0.9]].forEach(([x, y, z, r]) =>
    w.add(setze(new Mesh(kugel(r, 18, 12), new MeshLambertMaterial({ color: NACHT ? "#6E7FB0" : "#ffffff" })), x, y, z)));
  w.position.set(-30 + i * 15, 13 + (i % 2) * 2, -22 + (i % 3) * 7); scene.add(w); wolken.push(w);
}
if (NACHT) {
  const pos = []; for (let i = 0; i < 300; i++) { const a = Math.random() * Math.PI * 2, h = 0.25 + Math.random() * 0.7; pos.push(Math.cos(a) * 70 * Math.cos(h), 70 * Math.sin(h), Math.sin(a) * 70 * Math.cos(h)); }
  const g = new BufferGeometry(); g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  const sterne = new Points(g, new PointsMaterial({ color: "#FFFFFF", size: 0.5, fog: false })); scene.add(sterne);
}
let schnee = null;
if (SAISON === "winter" && !EINFACH) {
  const pos = []; for (let i = 0; i < 500; i++) pos.push((Math.random() - 0.5) * 40, Math.random() * 16, (Math.random() - 0.5) * 40);
  const g = new BufferGeometry(); g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  schnee = new Points(g, new PointsMaterial({ color: "#FFFFFF", size: 0.14 })); scene.add(schnee);
}

// ---------- Wehendes Gras ----------
let halme = null; const halmDaten = [];
if (!EINFACH && SAISON !== "winter") {
  const geo = new ConeGeometry(0.06, 0.45, 4); geo.translate(0, 0.22, 0);
  halme = new InstancedMesh(geo, mat(SAISON === "herbst" ? "#7FB24A" : "#5FB548"), 700);
  const o = new Object3D();
  for (let i = 0; i < 700; i++) {
    const w = Math.random() * Math.PI * 2, r = 2 + Math.sqrt(Math.random()) * 10.5, x = Math.cos(w) * r, z = Math.sin(w) * r;
    if (Math.hypot(x + 5, z + 4.5) < 2.6) { halmDaten.push({ x: 0, z: 0, p: 0, s: 0 }); o.scale.setScalar(0); o.updateMatrix(); halme.setMatrixAt(i, o.matrix); continue; }
    halmDaten.push({ x, z, p: Math.random() * 6, s: 0.6 + Math.random() * 0.8 });
    o.position.set(x, 0.25, z); o.scale.setScalar(halmDaten[i].s); o.updateMatrix(); halme.setMatrixAt(i, o.matrix);
  }
  halme.receiveShadow = true; scene.add(halme);
}

// ---------- Figur nach dem Look aus dem Kleiderschrank ----------
const LANG = ["lang", "wellen", "locken"], KURZ = ["bob", "kurz"], HOSEN = ["hose", "jeans", "jogging", "leggings"];
function figur(look) {
  const f = new Group(), haut = look.figur.farbe, haarF = (look.haare && look.haare.farbe) || "#8A5A34", haarId = (look.haare && look.haare.id) || "lang";
  const koerper = new Group(); f.add(koerper);
  const kleid = look.kleid, oben = kleid ? kleid.farbe : (look.oberteil ? look.oberteil.farbe : "#FF9BC8");
  const unterId = kleid ? "kleid" : (look.unterteil ? look.unterteil.id : "rock"), unten = kleid ? kleid.farbe : (look.unterteil ? look.unterteil.farbe : "#7B55B8");
  const schuhF = (look.schuhe && look.schuhe.farbe) || "#FFFFFF";
  const ohneBeine = kleid && kleid.id === "meerjungfrau", langesKleid = kleid && ["ball", "fee", "meerjungfrau"].includes(kleid.id);
  const hose = HOSEN.includes(unterId), shorts = unterId === "shorts";
  // Unterteil
  if (!hose && !shorts) {
    const lang = langesKleid ? 0.5 : 0;
    const profil = [new Vector2(0.01, -lang), new Vector2(0.52 + lang * 0.25, -lang), new Vector2(0.48 + lang * 0.2, 0.15 - lang * 0.5), new Vector2(0.34, 0.55), new Vector2(0.28, 0.8), new Vector2(0.01, 0.85)];
    koerper.add(setze(teil(new LatheGeometry(profil, 28), unten), 0, 0.42, 0));
  } else {
    koerper.add(setze(teil(new CylinderGeometry(0.3, 0.33, 0.32, 20), unten), 0, 0.88, 0));
  }
  // Oberkörper
  koerper.add(setze(teil(kugel(0.3, 20, 14), oben), 0, 1.15, 0));
  // Beine
  const beine = [-0.15, 0.15].map(x => {
    const b = new Group(); b.position.set(x, 0.48, 0);
    if (!ohneBeine) {
      b.add(setze(teil(new CapsuleGeometry(0.09, 0.3, 4, 12), haut), 0, -0.22, 0));
      if (hose || shorts) { const h = teil(new CapsuleGeometry(0.11, shorts ? 0.16 : 0.5, 4, 12), unten); setze(h, 0, shorts ? 0.2 : 0.0, 0); b.add(h); }
      b.add(setze(teil(kugel(0.13), schuhF, { dicke: 1.12 }), 0, -0.42, 0.05));
    }
    koerper.add(b); return b;
  });
  // Arme
  const arme = [-1, 1].map(s => {
    const a = new Group(); a.position.set(0.33 * s, 1.22, 0);
    a.add(setze(teil(new CapsuleGeometry(0.08, 0.32, 4, 12), oben), 0, -0.2, 0));
    a.add(setze(teil(kugel(0.09), haut, { dicke: 1.12 }), 0, -0.44, 0));
    a.rotation.z = 0.25 * s; koerper.add(a); return a;
  });
  // Kopf und Frisur
  const kopf = new Group(); kopf.position.y = 1.85; koerper.add(kopf);
  kopf.add(teil(kugel(0.58), haut, { dicke: 1.04 }));
  const kappe = teil(new SphereGeometry(0.62, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.55), haarF, { dicke: 1.04 });
  kappe.position.set(0, 0.04, -0.04); kappe.rotation.x = -0.35; kopf.add(kappe);
  const haarteil = (geo, x, y, z, sx = 1, sy = 1, sz = 1) => { const m = teil(geo, haarF, { dicke: 1.06 }); m.scale.set(sx, sy, sz); kopf.add(setze(m, x, y, z)); return m; };
  if (LANG.includes(haarId)) { haarteil(kugel(0.6), 0, -0.35, -0.22, 1.05, 1.1, 0.75); if (haarId === "locken") haarteil(kugel(0.66), 0, 0.05, -0.05, 1.08, 1, 1.05); }
  else if (haarId === "zoepfe") [-1, 1].forEach(s => { haarteil(new CapsuleGeometry(0.12, 0.6, 4, 12), 0.55 * s, -0.55, -0.1); haarteil(kugel(0.08), 0.55 * s, -0.95, -0.1); });
  else if (haarId === "seitenzopf") haarteil(new CapsuleGeometry(0.14, 0.55, 4, 12), 0.58, -0.45, -0.15);
  else if (haarId === "pferd") haarteil(new CapsuleGeometry(0.14, 0.6, 4, 12), 0, -0.2, -0.68).rotation.x = 0.5;
  else if (haarId === "dutt") haarteil(kugel(0.26), 0, 0.62, -0.12);
  else if (haarId === "spacebuns") [-1, 1].forEach(s => haarteil(kugel(0.22), 0.36 * s, 0.5, -0.05));
  else if (haarId === "puffs") [-1, 1].forEach(s => haarteil(kugel(0.28), 0.6 * s, 0.1, -0.05));
  else if (!KURZ.includes(haarId)) [-1, 1].forEach(s => haarteil(kugel(0.2), 0.6 * s, -0.05, -0.1));
  if (haarId === "bob") haarteil(kugel(0.62), 0, -0.12, -0.12, 1.04, 0.75, 0.9);
  // Gesicht
  augen(kopf, 0.2, 0.02, 0.53);
  [-1, 1].forEach(s => { const w = new Mesh(new CircleGeometry(0.09, 16), new MeshBasicMaterial({ color: "#FF9FB2", transparent: true, opacity: 0.6 })); setze(w, 0.33 * s, -0.12, 0.49); w.rotation.y = 0.5 * s; kopf.add(w); });
  const mund = new Mesh(new TorusGeometry(0.07, 0.018, 6, 12, Math.PI), AUGE); mund.rotation.z = Math.PI; setze(mund, 0, -0.15, 0.55); kopf.add(mund);
  // Extras aus dem Kleiderschrank (eine Auswahl in 3D)
  const ex = look.extras || {}, hat = (id) => ex[id];
  const farbe = (id, std) => (ex[id] && ex[id].farbe) || std;
  if (hat("krone") || hat("rechenkrone")) { const id = hat("krone") ? "krone" : "rechenkrone"; const k = teil(new CylinderGeometry(0.28, 0.26, 0.2, 16, 1, true), farbe(id, "#FFC83D")); setze(k, 0, 0.66, 0); kopf.add(k); for (let i = 0; i < 5; i++) { const z = teil(new ConeGeometry(0.06, 0.16, 8), farbe(id, "#FFC83D"), { dicke: 1.1 }); const a = i / 5 * Math.PI * 2; setze(z, Math.cos(a) * 0.27, 0.82, Math.sin(a) * 0.27); kopf.add(z); } }
  if (hat("muetze") || hat("weihnachtsmuetze")) { const id = hat("muetze") ? "muetze" : "weihnachtsmuetze"; const m = teil(new ConeGeometry(0.5, 0.75, 24), farbe(id, "#D7263D")); setze(m, 0, 0.78, -0.05); m.rotation.x = -0.25; kopf.add(m); const rand = teil(new TorusGeometry(0.47, 0.09, 10, 28), "#FFFFFF"); setze(rand, 0, 0.44, -0.02); rand.rotation.x = Math.PI / 2 - 0.25; kopf.add(rand); kopf.add(setze(teil(kugel(0.12), "#FFFFFF"), 0, 1.15, -0.25)); }
  if (hat("hut") || hat("entdeckerhut")) { const id = hat("hut") ? "hut" : "entdeckerhut"; kopf.add(setze(teil(new CylinderGeometry(0.85, 0.85, 0.05, 28), farbe(id, "#FFE27A")), 0, 0.45, 0)); kopf.add(setze(teil(new SphereGeometry(0.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), farbe(id, "#FFE27A")), 0, 0.45, 0)); }
  if (hat("katzenohren") || hat("fuchsohren")) { const id = hat("katzenohren") ? "katzenohren" : "fuchsohren"; [-1, 1].forEach(s => { const o = teil(new ConeGeometry(0.16, 0.32, 12), farbe(id, "#F28C38")); setze(o, 0.33 * s, 0.6, -0.05); o.rotation.z = -0.35 * s; kopf.add(o); }); }
  if (hat("brille") || hat("sonnenbrille") || hat("pixelbrille")) { const id = hat("brille") ? "brille" : hat("sonnenbrille") ? "sonnenbrille" : "pixelbrille"; [-1, 1].forEach(s => { const g = new Mesh(new TorusGeometry(0.12, 0.025, 8, 20), mat(farbe(id, "#7B55B8"))); setze(g, 0.2 * s, 0.02, 0.56); kopf.add(g); if (id !== "brille") kopf.add(setze(new Mesh(new CircleGeometry(0.11, 16), mat("#2A2230")), 0.2 * s, 0.02, 0.57)); }); }
  if (hat("schleife")) [-1, 1].forEach(s => kopf.add(setze(teil(kugel(0.13), farbe("schleife", "#FF6F9F")), 0.18 * s + 0.35, 0.5, 0.1)));
  if (hat("fluegel")) [-1, 1].forEach(s => { const fl = teil(kugel(0.45), new MeshToonMaterial({ color: farbe("fluegel", "#BDE7FF"), gradientMap: verlauf, transparent: true, opacity: 0.7 })); fl.scale.set(0.25, 1, 0.6); setze(fl, 0.32 * s, 1.35, -0.38); fl.rotation.z = 0.5 * s; koerper.add(fl); });
  if (hat("umhang")) { const u = teil(new CylinderGeometry(0.32, 0.6, 1.1, 20, 1, true, Math.PI * 0.6, Math.PI * 0.8), farbe("umhang", "#C2337A")); u.material = u.material.clone(); u.material.side = 2; setze(u, 0, 0.85, 0); koerper.add(u); }
  if (hat("schal")) { const sc = teil(new TorusGeometry(0.24, 0.08, 10, 24), farbe("schal", "#FF6F61")); setze(sc, 0, 1.38, 0); sc.rotation.x = Math.PI / 2; koerper.add(sc); }
  f.userData = { koerper, beine, arme, kopf };
  return f;
}
const look = (S.lade("anziehen") || {}).aktuell || (window.Figur ? window.Figur.STANDARD() : { figur: { farbe: "#F8D2B8" } });
const ich = figur(look); ich.position.set(1, 0.25, 2); scene.add(ich);

// ---------- Das eigene Tier ----------
const TP = window.TierPflege, T = window.Tiere;
const tierDaten = TP ? TP.lade() : null;
function tierModell(art, f, stufe) {
  const t = new Group(), k = new Group(); t.add(k);
  const H = f.h, L = f.l, D = f.d;
  const leib = teil(new CapsuleGeometry(0.28, 0.5, 6, 16), H); leib.rotation.x = Math.PI / 2; setze(leib, 0, 0.45, 0); k.add(leib);
  const bauch = teil(kugel(0.24), L, { umriss: false }); bauch.scale.set(1, 0.8, 1.6); setze(bauch, 0, 0.36, 0.05); k.add(bauch);
  const kopf = new Group(); kopf.position.set(0, 0.85, 0.42); k.add(kopf);
  kopf.add(teil(kugel(art === "katze" ? 0.34 : 0.32), H));
  const schnauze = teil(kugel(art === "drache" ? 0.18 : 0.14, 14, 10), art === "katze" ? L : art === "drache" ? H : L);
  schnauze.scale.set(1, 0.8, art === "katze" ? 0.7 : 1.25); setze(schnauze, 0, -0.08, 0.28); kopf.add(schnauze);
  kopf.add(setze(new Mesh(kugel(0.045), art === "katze" ? new MeshBasicMaterial({ color: "#FF8FA3" }) : AUGE), 0, -0.03, art === "katze" ? 0.4 : 0.47));
  augen(kopf, 0.13, 0.06, 0.27, 0.055);
  [-1, 1].forEach(s => {
    if (art === "drache") { const h = teil(new ConeGeometry(0.06, 0.24, 10), "#FFE7A8", { dicke: 1.12 }); setze(h, 0.14 * s, 0.32, -0.08); h.rotation.z = -0.3 * s; kopf.add(h); }
    else { const o = teil(new ConeGeometry(art === "katze" ? 0.13 : 0.12, art === "katze" ? 0.22 : 0.3, 12), H); setze(o, 0.17 * s, 0.32, -0.02); o.rotation.z = -0.25 * s; kopf.add(o); }
  });
  [[-0.15, 0.25], [0.15, 0.25], [-0.15, -0.25], [0.15, -0.25]].forEach(([x, z]) => k.add(setze(teil(new CapsuleGeometry(0.07, 0.18, 4, 10), art === "fuchs" ? D : H), x, 0.15, z)));
  const schwanz = new Group(); schwanz.position.set(0, 0.55, -0.45); k.add(schwanz);
  if (art === "fuchs") { const s1 = teil(kugel(0.22, 16, 12), H); s1.scale.set(1, 1, 1.8); setze(s1, 0, 0.12, -0.3); schwanz.add(s1); schwanz.add(setze(teil(kugel(0.14), L), 0, 0.2, -0.68)); }
  else if (art === "katze") { const s1 = teil(new CapsuleGeometry(0.06, 0.6, 4, 10), H); s1.rotation.x = -0.9; setze(s1, 0, 0.25, -0.22); schwanz.add(s1); }
  else { const s1 = teil(new ConeGeometry(0.16, 0.8, 14), H); s1.rotation.x = -1.9; setze(s1, 0, -0.1, -0.35); schwanz.add(s1);
    for (let i = 0; i < 4; i++) k.add(setze(teil(new ConeGeometry(0.06, 0.16, 8), D, { dicke: 1.12 }), 0, 0.78 - i * 0.03, 0.15 - i * 0.2));
    [-1, 1].forEach(s => { const fl = teil(kugel(0.3), L); fl.scale.set(0.15, 0.6, 0.8); setze(fl, 0.32 * s, 0.75, -0.05); fl.rotation.z = 0.6 * s; k.add(fl); }); }
  t.userData = { k, schwanz };
  t.scale.setScalar([0.6, 0.8, 1][Math.max(0, Math.min(2, stufe || 0))]);
  return t;
}
let tier = null, nest = null;
const NEST = new Vector3(-2.2, 0.25, -6.2);
{
  nest = new Group(); nest.position.copy(NEST); scene.add(nest); block(NEST.x, NEST.z, 0.6);
  const ring = teil(new TorusGeometry(0.45, 0.16, 10, 24), "#B98A55"); ring.rotation.x = Math.PI / 2; ring.position.y = 0.12; nest.add(ring);
  nest.add(setze(teil(new CylinderGeometry(0.45, 0.4, 0.12, 24), "#A47746", { umriss: false }), 0, 0.06, 0));
  if (tierDaten && tierDaten.phase === "tier" && T && T.ARTEN[tierDaten.art]) {
    const f = T.ARTEN[tierDaten.art].farben[tierDaten.farbe] || T.ARTEN[tierDaten.art].farben[0];
    tier = tierModell(tierDaten.art, f, TP.stufe ? TP.stufe(tierDaten) : 0);
    tier.position.set(2.5, 0.25, 3); scene.add(tier);
    antippbar(tier, () => {
      herzen(tier.position);
      const ok = TP.streicheln ? TP.streicheln() : false;
      S.ton("juhu");
      $("info").textContent = `${tierDaten.name || "Dein Tier"} freut sich!` + (ok === false ? "" : "");
    });
  } else if (tierDaten && tierDaten.phase === "ei" && T) {
    const e = T.EIER[tierDaten.ei] || { a: "#FFFFFF", b: "#E0457B" };
    const ei = teil(kugel(0.36), e.a); ei.scale.set(1, 1.3, 1); setze(ei, 0, 0.5, 0); nest.add(ei);
    const band = teil(new TorusGeometry(0.33, 0.07, 10, 24), e.b, { dicke: 1.1 }); band.rotation.x = Math.PI / 2; setze(band, 0, 0.5, 0); nest.add(band);
    antippbar(nest, () => sprechblase("🥚", "Dein Ei", "Es braucht noch Wärme. Wärme es auf der Tier-Seite!", S.paar(["", "Ему нужно тепло. Согрей его на странице питомца!"])[1], "../tier/"));
  } else {
    antippbar(nest, () => sprechblase("🪺", "Ein leeres Nest", "Hier könnte dein Haustier wohnen. Such dir ein Ei aus!", S.paar(["", "Здесь мог бы жить твой питомец. Выбери яйцо!"])[1], "../tier/"));
  }
}

// ---------- Nachbarn ----------
// Eule Ella wie in der 2D-Zeichnung: braun, cremefarbener Bauch, große Augen mit lila Brille, Doktorhut mit gelber Quaste
function eule() {
  const g = new Group(), BR = "#B8804A", DK = "#A0693F", CR = "#F3DEC0";
  const stumpf = teil(new CylinderGeometry(0.55, 0.65, 0.5, 20), "#9A6A3F"); setze(stumpf, 0, 0.25, 0); g.add(stumpf);
  const ringe = teil(new CylinderGeometry(0.42, 0.42, 0.02, 20), "#C9955E", { umriss: false }); setze(ringe, 0, 0.51, 0); g.add(ringe);
  const k = new Group(); k.position.y = 0.5; g.add(k);
  const b = teil(kugel(0.62), BR, { dicke: 1.04 }); b.scale.set(1, 1.12, 0.95); setze(b, 0, 0.72, 0); k.add(b);
  const bauch = teil(kugel(0.44), CR, { umriss: false }); bauch.scale.set(0.95, 1.1, 0.5); setze(bauch, 0, 0.55, 0.34); k.add(bauch);
  for (let i = 0; i < 3; i++) { const f = new Mesh(new TorusGeometry(0.08, 0.018, 6, 12, Math.PI), mat("#C9A26B")); f.rotation.z = Math.PI; setze(f, (i - 1) * 0.16, 0.5 + (i % 2) * 0.14, 0.56); k.add(f); }
  [-1, 1].forEach(s => {
    const auge = teil(kugel(0.2), "#FFFFFF", { dicke: 1.06 }); auge.scale.z = 0.6; setze(auge, 0.21 * s, 0.98, 0.48); k.add(auge);
    const pupille = new Mesh(kugel(0.1, 16, 12), AUGE); pupille.scale.z = 0.5; setze(pupille, 0.22 * s, 0.97, 0.6); k.add(pupille);
    k.add(setze(new Mesh(kugel(0.04, 8, 6), WEISS), 0.25 * s, 1.01, 0.65));
    const brille = new Mesh(new TorusGeometry(0.24, 0.035, 10, 28), mat("#7B55B8")); setze(brille, 0.21 * s, 0.98, 0.57); k.add(brille);
    const ohr = teil(new ConeGeometry(0.12, 0.3, 14), DK); setze(ohr, 0.38 * s, 1.42, 0); ohr.rotation.z = -0.35 * s; k.add(ohr);
    const fl = teil(kugel(0.32), DK); fl.scale.set(0.35, 0.95, 0.7); setze(fl, 0.6 * s, 0.62, 0); fl.rotation.z = 0.25 * s; k.add(fl);
    const fuss = teil(kugel(0.09), "#FFB03B", { dicke: 1.12 }); fuss.scale.set(1.5, 0.6, 1.3); setze(fuss, 0.18 * s, 0.03, 0.3); k.add(fuss);
  });
  k.add(setze(new Mesh(new BoxGeometry(0.07, 0.04, 0.05), mat("#7B55B8")), 0, 0.99, 0.6));
  const schnabel = teil(new ConeGeometry(0.08, 0.18, 12), "#FFB03B", { dicke: 1.12 }); schnabel.rotation.x = Math.PI; setze(schnabel, 0, 0.78, 0.6); k.add(schnabel);
  // Doktorhut
  const hut = new Group(); hut.position.set(0, 1.42, -0.02); hut.rotation.x = -0.12; k.add(hut);
  hut.add(setze(teil(new CylinderGeometry(0.26, 0.28, 0.16, 18), "#3b1f63"), 0, 0, 0));
  hut.add(setze(teil(new BoxGeometry(0.85, 0.06, 0.85), "#3b1f63", { dicke: 1.04 }), 0, 0.1, 0));
  const quaste = teil(new CylinderGeometry(0.02, 0.02, 0.32, 6), "#FFC83D", { umriss: false }); setze(quaste, 0.36, -0.04, 0.2); hut.add(quaste);
  hut.add(setze(teil(kugel(0.06), "#FFC83D", { dicke: 1.12 }), 0.36, -0.22, 0.2));
  g.userData.koerper = k;
  return g;
}
// Fipsi wie in der 2D-Zeichnung: sitzender Fuchs mit großem Kopf, weißer Gesichtsmaske, rosa Innenohren und Wangen
function fipsi() {
  const g = new Group(), O = "#F28C38", W = "#FFF3E6", D2 = "#5C3A21";
  const k = new Group(); g.add(k);
  // Schwanz (hinten, nach oben geschwungen) mit weißer Spitze
  const sw = new Group(); sw.position.set(0.25, 0.35, -0.3); k.add(sw);
  const s1 = teil(kugel(0.28), O); s1.scale.set(0.8, 1.3, 0.8); setze(s1, 0.18, 0.15, -0.1); s1.rotation.z = -0.5; sw.add(s1);
  const s2 = teil(kugel(0.2), W); setze(s2, 0.42, 0.5, -0.12); sw.add(s2);
  // Körper und Bauch
  const leib = teil(kugel(0.46), O); leib.scale.set(1, 0.92, 0.88); setze(leib, 0, 0.42, 0); k.add(leib);
  const bauch = teil(kugel(0.28), W, { umriss: false }); bauch.scale.set(1, 1, 0.5); setze(bauch, 0, 0.36, 0.3); k.add(bauch);
  [-1, 1].forEach(s => { const f = teil(kugel(0.13), D2, { dicke: 1.1 }); f.scale.set(1.2, 0.6, 1.4); setze(f, 0.2 * s, 0.05, 0.26); k.add(f); });
  // Kopf
  const kopf = new Group(); kopf.position.y = 1.12; k.add(kopf);
  const schaedel = teil(kugel(0.52), O, { dicke: 1.04 }); schaedel.scale.set(1.1, 0.95, 0.95); kopf.add(schaedel);
  const maske = teil(kugel(0.36), W, { umriss: false }); maske.scale.set(1.15, 0.72, 0.6); setze(maske, 0, -0.16, 0.3); kopf.add(maske);
  [-1, 1].forEach(s => {
    const ohr = teil(new ConeGeometry(0.2, 0.46, 16), O); setze(ohr, 0.34 * s, 0.5, -0.02); ohr.rotation.z = -0.32 * s; kopf.add(ohr);
    const innen = new Mesh(new ConeGeometry(0.11, 0.28, 12), mat("#FFC3A0")); setze(innen, 0.33 * s, 0.47, 0.08); innen.rotation.z = -0.32 * s; kopf.add(innen);
    const w = new Mesh(new CircleGeometry(0.08, 16), new MeshBasicMaterial({ color: "#FF7FA6", transparent: true, opacity: 0.5 })); setze(w, 0.36 * s, -0.12, 0.44); w.rotation.y = 0.55 * s; kopf.add(w);
  });
  augen(kopf, 0.19, 0.04, 0.44, 0.075);
  const nase = new Mesh(kugel(0.07, 14, 10), AUGE); nase.scale.set(1.3, 1, 0.8); setze(nase, 0, -0.08, 0.53); kopf.add(nase);
  const mund = new Mesh(new TorusGeometry(0.07, 0.016, 6, 12, Math.PI), AUGE); mund.rotation.z = Math.PI; setze(mund, 0, -0.2, 0.5); kopf.add(mund);
  // blaues Halstuch als Erkennungszeichen
  const tuch = teil(new TorusGeometry(0.28, 0.07, 10, 24), "#3AA0E0"); tuch.rotation.x = Math.PI / 2; setze(tuch, 0, 0.78, 0.02); k.add(tuch);
  g.userData.koerper = k; g.userData.schwanz = sw;
  return g;
}
function robo() {
  const g = new Group();
  g.add(setze(teil(new CapsuleGeometry(0.38, 0.4, 6, 18), "#7FC6F5"), 0, 0.75, 0));
  const k = teil(new BoxGeometry(0.9, 0.65, 0.65), "#7FC6F5"); setze(k, 0, 1.6, 0); g.add(k);
  const sch = teil(new BoxGeometry(0.66, 0.42, 0.05), "#E8F6FF", { dicke: 1.08 }); setze(sch, 0, 1.6, 0.34); g.add(sch);
  [-1, 1].forEach(s => g.add(setze(new Mesh(kugel(0.07), AUGE), 0.15 * s, 1.63, 0.38)));
  [-1, 1].forEach(s => g.add(setze(teil(new CapsuleGeometry(0.07, 0.2, 4, 10), "#FF9BC8"), 0.5 * s, 1.6, 0)));
  g.add(setze(new Mesh(new CylinderGeometry(0.02, 0.02, 0.3, 6), mat("#3b1f63")), 0, 2.05, 0));
  g.add(setze(teil(kugel(0.09), "#FFC83D", { dicke: 1.12 }), 0, 2.22, 0));
  [-1, 1].forEach(s => { const a = teil(new CapsuleGeometry(0.07, 0.35, 4, 10), "#FF9BC8"); setze(a, 0.5 * s, 0.85, 0); a.rotation.z = 0.3 * s; g.add(a); });
  return g;
}
function tafel(text, farbe) {
  const g = new Group();
  g.add(setze(teil(new CylinderGeometry(0.06, 0.06, 1.3, 8), "#9A6A3F"), 0, 0.65, 0));
  g.add(setze(teil(new BoxGeometry(1.1, 0.5, 0.08), farbe), 0, 1.2, 0));
  return g;
}
const name = S.profil.name || "du";
const NACHBARN = [
  { bau: eule, x: 8.5, z: -3, dreh: -1.2, e: "eule", titel: "Eule Ella", text: `Hallo ${name}! Ich weiß spannende Dinge über die Welt. Kommst du mit?`, ru: "Привет! Я знаю много интересного о мире. Пойдёшь со мной?", ziel: "../sachkunde/" },
  { bau: fipsi, x: -7.6, z: -0.6, dreh: 1.0, e: "fipsi", titel: "Fipsi", text: `Hallo ${name}! Hilfst du mir, meine Schatzkarte zu finden?`, ru: "Привет! Поможешь мне найти мою карту сокровищ?", ziel: "../deutsch/" },
  { bau: robo, x: 5.5, z: 8.5, dreh: -2.6, e: "robo", titel: "Robo Pixel", text: `Piep! Hallo ${name}! Willst du ein Tablet-Profi werden?`, ru: "Пип! Привет! Хочешь стать мастером планшета?", ziel: "../medien/" },
  { bau: () => tafel("Mathe", "#5CCBA6"), x: 2, z: -8, dreh: 0.2, e: "🧮", titel: "Der Matheweg", text: "Hier beginnt der Matheweg. Sammle Sterne an jeder Station!", ru: "Здесь начинается математическая тропа. Собирай звёзды на каждой станции!", ziel: "../mathe/" }
];
NACHBARN.forEach(n => {
  const o = n.bau(); o.position.set(n.x, 0.25, n.z); o.rotation.y = n.dreh; if (n.e !== "🧮") o.scale.multiplyScalar(1.3); scene.add(o); block(n.x, n.z, 0.8);
  n.obj = o;
  antippbar(o, () => { o.userData.huepf = 1; sprechblase(n.e, n.titel, n.text, S.ht(n), n.ziel); });
});

// ---------- Orte für Minispiele ----------
const ballons = new Group(); ballons.position.set(10, 0.25, 6); scene.add(ballons); block(10, 6, 0.6);
["#FF6F91", "#FFD84D", "#5CCBA6", "#7B9BFF", "#C27BFF"].forEach((c, i) => {
  const b = new Group(), a = i / 5 * Math.PI * 2;
  const ball = teil(kugel(0.34), c); ball.scale.y = 1.15; b.add(setze(ball, 0, 0, 0));
  b.add(setze(new Mesh(new CylinderGeometry(0.008, 0.008, 1.6, 4), mat("#ffffff")), 0, -1.1, 0));
  b.position.set(Math.cos(a) * 0.45, 2.3 + (i % 2) * 0.35, Math.sin(a) * 0.45); b.userData.p = i; ballons.add(b);
});
ballons.add(setze(teil(new CylinderGeometry(0.12, 0.16, 0.5, 12), "#9A6A3F"), 0, 0.25, 0));
const fuehrerscheinFehlt = () => sprechblase("🪪", "Noch gesperrt", "Mach zuerst den Tablet-Führerschein bei Robo Pixel. Dann darfst du hier spielen!", S.paar(["", "Сначала получи права на планшет у Робо Пикселя."])[1], "../medien/");
antippbar(ballons, () => spielOrt(() => profi() ? sprechblase("🎈", "Ballon-Wiese", "Lass so viele Ballons platzen, wie du kannst!", S.paar(["", "Лопни как можно больше шариков!"])[1], "ballons.html") : fuehrerscheinFehlt()));
const truhe = new Group(); truhe.position.set(-1, 0.05, 13.6); scene.add(truhe);
truhe.add(setze(teil(new BoxGeometry(0.9, 0.5, 0.6), "#B9732E"), 0, 0.25, 0));
const deckel = teil(new CylinderGeometry(0.3, 0.3, 0.9, 16, 1, false, 0, Math.PI), "#C98A3E"); deckel.rotation.z = Math.PI / 2; setze(deckel, 0, 0.5, 0); truhe.add(deckel);
truhe.add(setze(teil(new BoxGeometry(0.16, 0.2, 0.05), "#FFC83D", { dicke: 1.1 }), 0, 0.45, 0.32));
antippbar(truhe, () => spielOrt(() => profi() ? sprechblase("🏝️", "Schatz-Strand", "Auf der Schatzinsel wartet eine Truhe. Findest du sie?", S.paar(["", "На острове сокровищ ждёт сундук. Найдёшь его?"])[1], "insel.html") : fuehrerscheinFehlt()));

// ---------- Zimmer im Haus (eigener Bereich weit weg von der Insel) ----------
const ZX = 60; // Mitte des Zimmers
let drinnen = false;
const zimmer = new Group(); zimmer.position.set(ZX, 0, 0); scene.add(zimmer);
{
  const boden = new Mesh(new BoxGeometry(8.4, 0.3, 7.4), mat("#E2B47E")); boden.position.y = 0.1; boden.receiveShadow = true; zimmer.add(boden);
  for (let i = -3; i <= 3; i++) zimmer.add(setze(new Mesh(new BoxGeometry(0.04, 0.02, 7.4), mat("#C9955E")), i * 1.2, 0.26, 0));
  const wand = (b, h, t, x, z, f) => { const w = new Mesh(new BoxGeometry(b, h, t), mat(f)); w.position.set(x, h / 2 + 0.25, z); w.receiveShadow = true; zimmer.add(w); return w; };
  wand(8.4, 3.2, 0.25, 0, -3.7, "#FFD9E6"); wand(0.25, 3.2, 7.4, -4.2, 0, "#FFE9C2"); wand(0.25, 3.2, 7.4, 4.2, 0, "#FFE9C2");
  zimmer.add(setze(teil(new BoxGeometry(1.8, 1.2, 0.08), fensterMat, { dicke: 1.04 }), 0, 2.1, -3.55));
  zimmer.add(setze(new Mesh(new BoxGeometry(0.08, 1.2, 0.1), mat("#FFFFFF")), 0, 2.1, -3.5));
  const teppich = new Mesh(new CylinderGeometry(1.6, 1.6, 0.04, 40), mat("#B7A4F2")); teppich.position.set(0, 0.27, 0.6); teppich.receiveShadow = true; zimmer.add(teppich);
  // Bett
  const bett = new Group(); bett.position.set(-2.9, 0.25, -2.2); zimmer.add(bett);
  bett.add(setze(teil(new BoxGeometry(1.8, 0.5, 2.6), "#9A6A3F", { dicke: 1.03 }), 0, 0.25, 0));
  bett.add(setze(teil(new BoxGeometry(1.7, 0.2, 1.8), "#7FC6F5", { dicke: 1.03 }), 0, 0.6, 0.35));
  const kissen = teil(kugel(0.4), "#FFFFFF"); kissen.scale.set(1.6, 0.5, 0.9); bett.add(setze(kissen, 0, 0.65, -0.85));
  block(ZX - 2.9, -2.2, 1.4);
  antippbar(bett, () => sprechblase("🛏️", "Dein Bett", tier ? `Hier kuschelt ${tierDaten.name || "dein Tier"}, wenn es müde ist.` : "Ein gemütliches Bett. Bald kannst du dein Zimmer einrichten.", S.paar(["", "Уютная кровать."])[1], null));
  // Kleiderschrank
  const schrank = new Group(); schrank.position.set(2.8, 0.25, -3.0); zimmer.add(schrank);
  schrank.add(setze(teil(new BoxGeometry(2.0, 2.6, 0.9), "#C2337A", { dicke: 1.03 }), 0, 1.3, 0));
  [-0.48, 0.48].forEach(x => { schrank.add(setze(teil(new BoxGeometry(0.9, 2.3, 0.06), "#E0579A", { dicke: 1.02 }), x, 1.3, 0.47)); schrank.add(setze(teil(kugel(0.07), "#FFC83D", { dicke: 1.15 }), x * 0.25, 1.35, 0.53)); });
  schrank.add(setze(teil(new BoxGeometry(0.5, 0.3, 0.05), "#FFFFFF", { dicke: 1.08 }), 0, 2.35, 0.52));
  block(ZX + 2.8, -3.0, 1.2);
  antippbar(schrank, () => sprechblase("👗", "Dein Kleiderschrank", "Such dir etwas Schönes zum Anziehen aus. Auf der Insel trägst du es dann!", S.paar(["", "Выбери что-нибудь красивое из одежды!"])[1], "../anziehen/?von=insel"));
  // Spiegel
  const spiegel = new Group(); spiegel.position.set(-4.05, 1.7, 1.0); spiegel.rotation.y = Math.PI / 2; zimmer.add(spiegel);
  const rahmen = teil(new TorusGeometry(0.55, 0.08, 10, 30), "#FFC83D"); rahmen.scale.y = 1.4; spiegel.add(rahmen);
  const glas = new Mesh(new CircleGeometry(0.52, 30), new MeshBasicMaterial({ color: "#CFEFFF" })); glas.scale.y = 1.4; glas.position.z = 0.02; spiegel.add(glas);
  antippbar(spiegel, () => sprechblase("🪞", "Der Spiegel", "Schau, wie du gewachsen bist: deine Fähigkeiten, Aufgaben und Abzeichen.", S.paar(["", "Посмотри, как ты выросла!"])[1], "../ich/"));
  // Pflanze und Lampe
  const topf = new Group(); topf.position.set(3.4, 0.25, 2.4); zimmer.add(topf);
  topf.add(setze(teil(new CylinderGeometry(0.3, 0.22, 0.45, 16), "#E2604F"), 0, 0.22, 0));
  [[0, 0.75, 0, 0.35], [0.2, 0.95, 0.1, 0.25], [-0.18, 0.9, -0.05, 0.25]].forEach(([x, y, z, r]) => topf.add(setze(teil(kugel(r), "#5DBB5A"), x, y, z)));
  block(ZX + 3.4, 2.4, 0.5);
}
let draussenPos = new Vector3();
function reingehen() {
  drinnen = true; $("raus").hidden = false; $("blase").hidden = true;
  draussenPos.copy(ich.position);
  ich.position.set(ZX, 0.25, 2.2); ich.rotation.y = Math.PI;
  if (tier) tier.position.set(ZX + 1.2, 0.25, 2.6);
  scene.background = new Color("#F7E3C6"); scene.fog.color.set("#F7E3C6"); wasser.visible = false; wolken.forEach(w => w.visible = false);
  $("info").textContent = "Dein Zimmer. Tippe auf den Kleiderschrank oder den Spiegel!";
  S.ton("tipp");
}
function rausgehen() {
  drinnen = false; $("raus").hidden = true;
  ich.position.set(-4.1, 0.25, -2.0); ich.rotation.y = 0;
  if (tier) tier.position.set(-3.0, 0.25, -1.6);
  scene.background = new Color(HIMMEL); scene.fog.color.set(HIMMEL); wasser.visible = true; wolken.forEach(w => w.visible = true);
  $("info").textContent = spielZeit() ? `Hallo ${name}!` : "🌱 Erst lernen: Geh zu Ella, Fipsi, Pixel oder zum Matheweg.";
  S.ton("tipp");
}
$("raus").addEventListener("click", rausgehen);

// Lernmodus anzeigen und bei Änderung der Spielzeit aktualisieren
function zeigeLernmodus() {
  const an = !spielZeit(); $("lern-hinweis").hidden = !an;
  if (an && Z) { const st = Z.status(); $("lern-hinweis").textContent = st.genug ? "😴 Für heute genug gespielt – Lernen geht noch!" : `🌱 Erst lernen: noch ${st.fehltMin} Minuten oder ${st.fehltAufgaben} Aufgaben. Geh zu Ella, Fipsi, Pixel oder zum Matheweg!`; }
  if (an && drinnen) rausgehen();
}
document.addEventListener("zeit-aenderung", zeigeLernmodus);
setInterval(zeigeLernmodus, 10000);

// ---------- Sprechblase ----------
let blaseZiel = null;
function sprechblase(e, titel, text, ru, ziel) {
  $("blase-e").innerHTML = window.Figuren && window.Figuren[e] ? window.Figuren[e]("") : e; $("blase-titel").textContent = titel; $("blase-text").textContent = text;
  const ruEl = $("blase-ru"); ruEl.textContent = ru || ""; ruEl.hidden = true;
  const hl = S.hilfe && S.hilfe(); $("blase-ruk").hidden = !(ru && hl); if (hl) { $("blase-ruk").textContent = hl.kurz; ruEl.lang = hl.code; ruEl.dir = hl.rtl ? "rtl" : "ltr"; }
  $("blase-los").hidden = !ziel; blaseZiel = ziel;
  $("blase").hidden = false; S.ton("tipp");
  if (SP && SP.sprich) SP.sprich(text, "de-DE");
}
$("blase-zu").addEventListener("click", () => { $("blase").hidden = true; if (SP && SP.stopp) SP.stopp(); });
$("blase-los").addEventListener("click", () => { if (blaseZiel) location.href = blaseZiel; });
$("blase-ruk").addEventListener("click", () => { const r = $("blase-ru"); r.hidden = !r.hidden; if (!r.hidden && SP) SP.sprich(r.textContent, (S.hilfe() || { tts: "ru-RU" }).tts); });

// ---------- Herzen beim Streicheln ----------
const herzListe = [];
function herzen(p) {
  for (let i = 0; i < 5; i++) {
    const h = new Mesh(kugel(0.09, 10, 8), new MeshBasicMaterial({ color: "#FF6F91", transparent: true }));
    h.position.set(p.x + (Math.random() - 0.5) * 0.6, 1.1, p.z + (Math.random() - 0.5) * 0.6);
    h.userData.t = 0; h.userData.v = 0.8 + Math.random() * 0.6; scene.add(h); herzListe.push(h);
  }
}

// ---------- Steuerung ----------
let ziel = null, freiKamera = false, gieren = 0, neigung = 0.72, abstand = 15;
const ray = new Raycaster(), zeiger = new Vector2(), fl = renderer.domElement, finger = new Map();
// Joystick: Finger links aufsetzen und schieben (erscheint, wo der Finger ist). Kurz tippen = antippen.
const eingabe = { x: 0, z: 0 }, RADIUS = 56, stick = $("stick"), knauf = $("knauf");
let stickId = null, stickMitte = null, stickAktiv = false;
const tasten = {};
addEventListener("keydown", e => { tasten[e.key.toLowerCase()] = true; if (e.key === " ") { e.preventDefault(); springe(); } });
// Springen: einfach immer, Doppelsprung als Belohnung (Entdecker-Mut) oder im Testmodus
let hoehe = 0, vy = 0, spruenge = 0;
const doppelErlaubt = () => S.offen(window.Charakter && window.Charakter.hat && window.Charakter.hat("doppelsprung"));
function springe() {
  if (hoehe <= 0.001) { vy = 6.2; spruenge = 1; S.ton("tipp"); }
  else if (spruenge === 1 && doppelErlaubt()) { vy = 6.2; spruenge = 2; S.ton("wahl"); }
}
$("springen").addEventListener("pointerdown", e => { e.preventDefault(); e.stopPropagation(); springe(); });
addEventListener("keyup", e => { tasten[e.key.toLowerCase()] = false; });
let unten = null, bewegt = false;
fl.addEventListener("pointerdown", e => {
  fl.setPointerCapture(e.pointerId); finger.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (STEUERUNG === "joystick" && stickId === null && e.clientX < innerWidth * 0.55) { stickId = e.pointerId; stickMitte = { x: e.clientX, y: e.clientY }; stickAktiv = false; }
  unten = { x: e.clientX, y: e.clientY }; bewegt = false;
});
fl.addEventListener("pointermove", e => {
  const alt = finger.get(e.pointerId); if (!alt) return;
  const dx = e.clientX - alt.x, dy = e.clientY - alt.y;
  if (e.pointerId === stickId) {
    let sx = e.clientX - stickMitte.x, sy = e.clientY - stickMitte.y; const l = Math.hypot(sx, sy);
    if (!stickAktiv && l > 10) {
      stickAktiv = true; ziel = null; ankunft = null; marke.visible = false;
      stick.style.left = (stickMitte.x - 70) + "px"; stick.style.top = (stickMitte.y - 70) + "px"; stick.classList.add("an");
      $("joy-hinweis").hidden = true; try { localStorage.setItem("lerninsel.joystick", "1"); } catch (er) { /* egal */ }
    }
    if (stickAktiv) {
      if (l > RADIUS) { sx *= RADIUS / l; sy *= RADIUS / l; }
      knauf.style.transform = `translate(${sx}px, ${sy}px)`;
      eingabe.x = sx / RADIUS; eingabe.z = sy / RADIUS;
    }
    finger.set(e.pointerId, { x: e.clientX, y: e.clientY });
    return;
  }
  if (finger.size === 2 && stickId === null) {
    const [a, b] = [...finger.values()]; const d0 = Math.hypot(a.x - b.x, a.y - b.y);
    finger.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const [c, d] = [...finger.values()]; const d1 = Math.hypot(c.x - d.x, c.y - d.y);
    if (freiKamera) abstand = MathUtils.clamp(abstand * d0 / Math.max(1, d1), 6, 26);
    bewegt = true; return;
  }
  finger.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (unten && Math.hypot(e.clientX - unten.x, e.clientY - unten.y) > 8) bewegt = true;
  if (freiKamera && bewegt) { gieren -= dx * 0.008; neigung = MathUtils.clamp(neigung + dy * 0.005, 0.25, 1.35); }
});
function stickLos(e) {
  if (e.pointerId !== stickId) return false;
  const warAktiv = stickAktiv;
  stickId = null; stickAktiv = false; eingabe.x = 0; eingabe.z = 0; stick.classList.remove("an"); knauf.style.transform = "translate(0,0)";
  return warAktiv;
}
fl.addEventListener("pointercancel", e => { finger.delete(e.pointerId); stickLos(e); });
fl.addEventListener("pointerup", e => {
  finger.delete(e.pointerId);
  if (stickLos(e)) return;
  if (bewegt) return;
  // Antippen: Nachbarn, Tier, Haus, Ballons, Truhe
  const r = fl.getBoundingClientRect();
  zeiger.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(zeiger, camera);
  const treffer = ray.intersectObjects(tippbar, true)[0];
  if (treffer) {
    let o = treffer.object; while (o && !o.userData.tipp) o = o.parent;
    if (o) {
      const p = new Vector3(); o.getWorldPosition(p);
      tmp.subVectors(ich.position, p); tmp.y = 0;
      if (tmp.length() > 2.4) { tmp.setLength(1.6); ziel = p.clone().add(tmp); ziel.y = 0.25; ankunft = o.userData.tipp; markiere(ziel); }
      else o.userData.tipp();
      return;
    }
  }
  // Tipp-Steuerung: auf den Boden tippen = dorthin laufen
  if (STEUERUNG === "tippen") {
    const t = ray.intersectObjects(drinnen ? [zimmer] : boden, true)[0];
    if (t) { ziel = new Vector3(t.point.x, 0.25, t.point.z); wegVonHindernissen(ziel, 0.4); ankunft = null; markiere(ziel); }
  }
});
fl.addEventListener("wheel", e => { if (!freiKamera) return; e.preventDefault(); abstand = MathUtils.clamp(abstand + e.deltaY * 0.01, 6, 26); }, { passive: false });
$("kamera").addEventListener("click", (e) => {
  freiKamera = !freiKamera; e.currentTarget.classList.toggle("an", freiKamera);
  e.currentTarget.textContent = freiKamera ? "🎥 frei" : "🎥 fest";
  if (!freiKamera) { gieren = 0; neigung = 0.72; abstand = 15; }
});
$("grafik").textContent = EINFACH ? "✨ einfach" : "✨ schön";
// Steuerung: Joystick oder Tippen (jederzeit umschaltbar, das Tablet merkt es sich)
let STEUERUNG = lies("lerninsel.steuerung") === "tippen" ? "tippen" : "joystick";
function zeigeSteuerung() {
  $("steuerung").textContent = STEUERUNG === "tippen" ? "👆 Tippen" : "🕹️ Joystick";
  $("joy-hinweis").textContent = STEUERUNG === "tippen" ? "👆 Tippe auf die Wiese zum Laufen · Antippen zum Reden" : "🕹️ Hier links schieben zum Laufen · Antippen zum Reden";
}
$("steuerung").addEventListener("click", () => {
  STEUERUNG = STEUERUNG === "tippen" ? "joystick" : "tippen";
  try { localStorage.setItem("lerninsel.steuerung", STEUERUNG); } catch (e) { /* egal */ }
  zeigeSteuerung(); $("joy-hinweis").hidden = false; setTimeout(() => { $("joy-hinweis").hidden = true; }, 4000); S.ton("tipp");
});
zeigeSteuerung();
$("grafik").addEventListener("click", () => { try { localStorage.setItem(GRAFIK_KEY, EINFACH ? "schoen" : "einfach"); } catch (e) { /* egal */ } location.reload(); });
let ankunft = null;
const marke = new Mesh(new TorusGeometry(0.35, 0.06, 6, 28), new MeshBasicMaterial({ color: "#FFFFFF", transparent: true, opacity: 0.9 }));
marke.rotation.x = Math.PI / 2; marke.visible = false; scene.add(marke);
function markiere(p) { marke.position.set(p.x, 0.32, p.z); marke.visible = true; }

// Begrüßung
$("sterne").textContent = S.sterne();
$("info").textContent = NACHT ? `Gute Nacht, ${name}! Die Insel schläft bald.` : SAISON === "winter" ? `Es hat geschneit, ${name}!` : SAISON === "herbst" ? `Die Blätter sind bunt, ${name}!` : `Hallo ${name}! Schön, dass du da bist.`;

// ---------- Größe, Schleife ----------
function groesse() { const el = $("buehne"); renderer.setSize(el.clientWidth, el.clientHeight, false); camera.aspect = el.clientWidth / Math.max(1, el.clientHeight); camera.updateProjectionMatrix(); }
addEventListener("resize", groesse); groesse();
const uhr = new Clock(), blick = new Vector3(), tmp = new Vector3(), halmO = new Object3D();
let lauf = 0;
function wegVonHindernissen(p, r) {
  for (const h of hindernisse) { const dx = p.x - h.x, dz = p.z - h.z, d = Math.hypot(dx, dz), m = h.r + r; if (d < m && d > 0.001) { p.x = h.x + dx / d * m; p.z = h.z + dz / d * m; } }
  if (drinnen) { p.x = MathUtils.clamp(p.x, ZX - 3.7, ZX + 3.7); p.z = MathUtils.clamp(p.z, -3.1, 3.3); if (p.z >= 3.25 && ich.position === p) rausgehen(); return; }
  const l = Math.hypot(p.x, p.z); if (l > 14.6) { p.x *= 14.6 / l; p.z *= 14.6 / l; }
}
function bild() {
  const dt = Math.min(uhr.getDelta(), 0.05), t = uhr.elapsedTime;
  const u = ich.userData; let geht = false;
  let ix = eingabe.x, iz = eingabe.z;
  if (tasten["arrowleft"] || tasten["a"]) ix -= 1; if (tasten["arrowright"] || tasten["d"]) ix += 1;
  if (tasten["arrowup"] || tasten["w"]) iz -= 1; if (tasten["arrowdown"] || tasten["s"]) iz += 1;
  const staerke = Math.min(1, Math.hypot(ix, iz));
  if (staerke > 0.12) {
    ziel = null; ankunft = null; marke.visible = false; geht = true;
    const gw0 = freiKamera ? gieren : 0, n = Math.hypot(ix, iz);
    const wx = (ix * Math.cos(gw0) + iz * Math.sin(gw0)) / n, wz = (-ix * Math.sin(gw0) + iz * Math.cos(gw0)) / n;
    ich.position.x += wx * 4 * staerke * dt; ich.position.z += wz * 4 * staerke * dt; wegVonHindernissen(ich.position, 0.4);
    const soll = Math.atan2(wx, wz); let diff = soll - ich.rotation.y; diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    ich.rotation.y += diff * Math.min(1, dt * 12);
  } else if (ziel) {
    tmp.subVectors(ziel, ich.position); tmp.y = 0; const d = tmp.length();
    if (d < 0.1) { ziel = null; marke.visible = false; if (ankunft) { const f = ankunft; ankunft = null; f(); } }
    else {
      geht = true; tmp.normalize();
      const vorher = ich.position.clone();
      ich.position.addScaledVector(tmp, Math.min(d, 3.4 * dt)); wegVonHindernissen(ich.position, 0.4);
      if (ich.position.distanceTo(vorher) < 0.2 * 3.4 * dt) { ziel = null; marke.visible = false; if (ankunft) { const f = ankunft; ankunft = null; f(); } } // hängt fest
      const soll = Math.atan2(tmp.x, tmp.z); let diff = soll - ich.rotation.y; diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      ich.rotation.y += diff * Math.min(1, dt * 10);
    }
  }
  lauf += dt * (geht ? 11 : 0);
  const schwung = geht ? Math.sin(lauf) : 0;
  u.beine[0].rotation.x = schwung * 0.6; u.beine[1].rotation.x = -schwung * 0.6;
  u.arme[0].rotation.x = -schwung * 0.6; u.arme[1].rotation.x = schwung * 0.6;
  u.koerper.position.y = geht && hoehe <= 0 ? Math.abs(Math.sin(lauf)) * 0.08 : Math.sin(t * 2) * 0.015;
  if (hoehe > 0 || vy > 0) {
    vy -= 18 * dt; hoehe += vy * dt;
    if (hoehe <= 0) { hoehe = 0; vy = 0; spruenge = 0; }
  }
  ich.position.y = 0.25 + hoehe;
  if (hoehe > 0) { u.beine[0].rotation.x = -0.5; u.beine[1].rotation.x = 0.3; u.arme[0].rotation.z = 0.9; u.arme[1].rotation.z = -0.9; }
  else { u.arme[0].rotation.z = 0.25; u.arme[1].rotation.z = -0.25; }
  if (marke.visible) marke.scale.setScalar(1 + Math.sin(t * 6) * 0.1);

  if (tier) {
    tmp.subVectors(ich.position, tier.position); tmp.y = 0; const dT = tmp.length(), tu = tier.userData; let hoppelt = false;
    const schlaeft = NACHT && !geht && dT < 3;
    if (dT > 1.5) {
      hoppelt = true; tmp.normalize(); tier.position.addScaledVector(tmp, Math.min(dT - 1.5, (dT > 4 ? 5 : 3.2) * dt)); wegVonHindernissen(tier.position, 0.3);
      const soll = Math.atan2(tmp.x, tmp.z); let diff = soll - tier.rotation.y; diff = Math.atan2(Math.sin(diff), Math.cos(diff)); tier.rotation.y += diff * Math.min(1, dt * 8);
    }
    tu.k.position.y = hoppelt ? Math.abs(Math.sin(t * 12)) * 0.18 : 0;
    tu.k.rotation.z = schlaeft ? 1.2 : 0;
    tu.schwanz.rotation.y = Math.sin(t * (hoppelt ? 10 : schlaeft ? 0.5 : 3)) * 0.5;
  }
  NACHBARN.forEach((n, i) => {
    const o = n.obj;
    if (o.userData.schwanz) o.userData.schwanz.rotation.z = Math.sin(t * 3) * 0.25;
    // zur Figur drehen, wenn sie in der Nähe ist
    const dx = ich.position.x - o.position.x, dz = ich.position.z - o.position.z, nah = !drinnen && Math.hypot(dx, dz) < 7;
    const soll = nah ? Math.atan2(dx, dz) : n.dreh; let diff = soll - o.rotation.y; diff = Math.atan2(Math.sin(diff), Math.cos(diff)); o.rotation.y += diff * Math.min(1, dt * 4);
    if (o.userData.koerper) o.userData.koerper.scale.y = 1 + Math.sin(t * 2.2 + i) * 0.02; if (o.userData.huepf > 0) { o.userData.huepf = Math.max(0, o.userData.huepf - dt * 2); }
    o.position.y = 0.25 + Math.sin((1 - (o.userData.huepf || 0)) * Math.PI) * (o.userData.huepf ? 0.4 : 0) + (i === 2 ? Math.sin(t * 2) * 0.05 : 0);
  });
  ballons.children.forEach(b => { if (b.userData.p !== undefined) b.position.y = 2.3 + (b.userData.p % 2) * 0.35 + Math.sin(t * 1.5 + b.userData.p) * 0.12; });
  for (let i = herzListe.length - 1; i >= 0; i--) { const h = herzListe[i]; h.userData.t += dt; h.position.y += dt * h.userData.v; h.material.opacity = 1 - h.userData.t; if (h.userData.t > 1) { scene.remove(h); herzListe.splice(i, 1); } }

  if (!EINFACH && !RUHIG) {
    const a = wasserGeo.attributes.position;
    for (let i = 0; i < a.count; i++) { const x = wasserBasis[i * 3], z = wasserBasis[i * 3 + 2]; a.setY(i, Math.sin(x * 0.35 + t * 1.4) * 0.1 + Math.cos(z * 0.3 + t * 1.1) * 0.1); }
    a.needsUpdate = true; wasserGeo.computeVertexNormals();
  }
  if (halme && !RUHIG) {
    for (let i = 0; i < halmDaten.length; i++) {
      const h = halmDaten[i]; if (!h.s) continue;
      halmO.position.set(h.x, 0.25, h.z); halmO.scale.setScalar(h.s); halmO.rotation.set(Math.sin(t * 1.8 + h.p + h.x * 0.3) * 0.18, 0, Math.cos(t * 1.5 + h.p) * 0.12);
      halmO.updateMatrix(); halme.setMatrixAt(i, halmO.matrix);
    }
    halme.instanceMatrix.needsUpdate = true;
  }
  if (schnee) { const a = schnee.geometry.attributes.position; for (let i = 0; i < a.count; i++) { let y = a.getY(i) - dt * 1.2; if (y < 0) y = 16; a.setY(i, y); a.setX(i, a.getX(i) + Math.sin(t + i) * dt * 0.2); } a.needsUpdate = true; }
  wolken.forEach((w, i) => { w.position.x += dt * (0.4 + i * 0.1); if (w.position.x > 40) w.position.x = -40; });

  blick.set(ich.position.x, 1.25 + hoehe * 0.3, ich.position.z);
  const gw = freiKamera ? gieren : 0, nw = freiKamera ? neigung : drinnen ? 0.85 : 0.72, ab = drinnen && !freiKamera ? 10 : abstand;
  if (drinnen) blick.set(MathUtils.clamp(blick.x, ZX - 1.5, ZX + 1.5), blick.y, MathUtils.clamp(blick.z, -1.5, 1.2));
  camera.position.set(blick.x + Math.sin(gw) * Math.cos(nw) * ab, blick.y + Math.sin(nw) * ab, blick.z + Math.cos(gw) * Math.cos(nw) * ab);
  camera.lookAt(blick);
  sonne.position.set(ich.position.x + 10, 18, ich.position.z + 8); sonne.target.position.copy(ich.position);
  renderer.render(scene, camera);
  requestAnimationFrame(bild);
}
requestAnimationFrame(bild);
zeigeLernmodus();
if (q.get("drinnen") === "1" && spielZeit()) reingehen();
window.__heimat = { blick: (g, n, a) => { freiKamera = true; gieren = g; neigung = n; abstand = a; }, ich, tier, reingehen, rausgehen, get drinnen() { return drinnen; }, get ziel() { return ziel; }, laufeZu: (x, z) => { ziel = new Vector3(x, 0.25, z); markiere(ziel); }, tippe: (i) => NACHBARN[i].obj.userData.tipp(), SAISON, NACHT };
