// Probeszene für die Heimatinsel: zwei Grafikstile auf derselben Insel.
//   ?stil=a  Low-Poly mit weichem Licht (kantig, flach schattiert)
//   ?stil=b  Rund im Animal-Crossing-Stil (glatt, Toon-Licht, Konturen, wehendes Gras, Wellen)
import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, Fog, HemisphereLight, DirectionalLight, Clock, SRGBColorSpace,
  PCFSoftShadowMap, Group, Mesh, MeshLambertMaterial, MeshToonMaterial, MeshBasicMaterial, BackSide, DoubleSide,
  CylinderGeometry, SphereGeometry, IcosahedronGeometry, ConeGeometry, BoxGeometry, CapsuleGeometry, PlaneGeometry,
  LatheGeometry, ExtrudeGeometry, Shape, Vector2, Vector3, DataTexture, RedFormat, NearestFilter, InstancedMesh,
  Object3D, Raycaster, CircleGeometry, TorusGeometry, MathUtils
} from "../three/three.module.js";
import { messe } from "./gemeinsam.js";

const STIL = new URLSearchParams(location.search).get("stil") === "b" ? "b" : "a";
const RUND = STIL === "b";
document.body.dataset.stil = STIL;

// ---------- Renderer, Szene, Licht ----------
const renderer = new WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
renderer.outputColorSpace = SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
document.getElementById("buehne").appendChild(renderer.domElement);

const scene = new Scene();
const HIMMEL = RUND ? "#A8DDF5" : "#BFE6FF";
scene.background = new Color(HIMMEL);
scene.fog = new Fog(HIMMEL, 30, 75);
const camera = new PerspectiveCamera(RUND ? 40 : 45, 1, 0.1, 200);

scene.add(new HemisphereLight(RUND ? "#FFF4E0" : "#ffffff", RUND ? "#8CCB6E" : "#7AC95A", RUND ? 1.3 : 1.5));
const sonne = new DirectionalLight(RUND ? "#FFE9C7" : "#fff6dd", RUND ? 2.2 : 1.9);
sonne.position.set(10, 18, 8);
sonne.castShadow = true;
sonne.shadow.mapSize.set(1024, 1024);
sonne.shadow.radius = RUND ? 6 : 3;
sonne.shadow.bias = -0.0006; sonne.shadow.normalBias = 0.03;
Object.assign(sonne.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, near: 1, far: 60 });
scene.add(sonne);

// ---------- Material- und Formhelfer je Stil ----------
let toonVerlauf = null;
if (RUND) {
  toonVerlauf = new DataTexture(new Uint8Array([110, 190, 255]), 3, 1, RedFormat);
  toonVerlauf.minFilter = toonVerlauf.magFilter = NearestFilter;
  toonVerlauf.needsUpdate = true;
}
const mats = new Map();
function mat(farbe) {
  if (!mats.has(farbe)) mats.set(farbe, RUND ? new MeshToonMaterial({ color: farbe, gradientMap: toonVerlauf })
    : new MeshLambertMaterial({ color: farbe, flatShading: true }));
  return mats.get(farbe);
}
const UMRISS = new MeshBasicMaterial({ color: "#4A3558", side: BackSide });
const seg = (wenig, viel) => RUND ? viel : wenig;
// Ein Körper mit Schatten; im runden Stil mit dunkler Kontur (umgedrehte Hülle)
function teil(geo, farbe, { umriss = true, dicke = 1.06 } = {}) {
  const m = new Mesh(geo, mat(farbe));
  m.castShadow = true; m.receiveShadow = true;
  if (RUND && umriss) { const u = new Mesh(geo, UMRISS); u.scale.setScalar(dicke); m.add(u); }
  return m;
}
const kugel = (r) => RUND ? new SphereGeometry(r, 28, 20) : new IcosahedronGeometry(r, 1);
const setze = (o, x, y, z) => { o.position.set(x, y, z); return o; };

// ---------- Insel und Wasser ----------
const boden = [];
const insel = new Group(); scene.add(insel);
{
  // Profil: Sandstrand, Grasfläche obenauf
  const sand = RUND
    ? new LatheGeometry([new Vector2(0, -1.2), new Vector2(15.2, -1.2), new Vector2(15.6, -0.6), new Vector2(15.2, -0.1), new Vector2(0, -0.1)].map(v => v), 64)
    : new CylinderGeometry(15, 15.6, 1.1, 14);
  const s = new Mesh(sand, mat("#F2D9A2")); s.receiveShadow = true;
  if (!RUND) s.position.y = -0.65;
  insel.add(s);
  const gras = RUND
    ? new LatheGeometry([new Vector2(13.1, -0.3), new Vector2(12.9, 0.05), new Vector2(12.2, 0.25), new Vector2(0, 0.25)], 64)
    : new CylinderGeometry(12.6, 13.2, 0.5, 12);
  const g = new Mesh(gras, mat(RUND ? "#7CCB5B" : "#6CC24A")); g.receiveShadow = true;
  if (!RUND) g.position.y = 0;
  insel.add(g); boden.push(g, s);
  // Pfad aus Steinplatten
  for (let i = 0; i < 7; i++) {
    const p = new Mesh(RUND ? new CylinderGeometry(0.55, 0.6, 0.12, 20) : new CylinderGeometry(0.55, 0.6, 0.12, 6), mat("#D9CDB8"));
    p.receiveShadow = true; setze(p, -4 + i * 1.25, 0.28, -2.6 + Math.sin(i * 0.9) * 0.6); p.rotation.y = i; insel.add(p);
  }
}
const wasserGeo = new PlaneGeometry(140, 140, RUND ? 70 : 28, RUND ? 70 : 28);
wasserGeo.rotateX(-Math.PI / 2);
const wasser = new Mesh(wasserGeo, RUND ? new MeshToonMaterial({ color: "#5EC3E6", gradientMap: toonVerlauf, transparent: true, opacity: 0.92 })
  : new MeshLambertMaterial({ color: "#4FB3E0", flatShading: true }));
wasser.position.y = -0.55; wasser.receiveShadow = true; scene.add(wasser);
const wasserBasis = Float32Array.from(wasserGeo.attributes.position.array);
if (!RUND) { // feste, kantige Wellen
  const a = wasserGeo.attributes.position;
  for (let i = 0; i < a.count; i++) a.setY(i, (Math.sin(i * 12.9898) * 43758.5453 % 1) * 0.18);
  wasserGeo.computeVertexNormals();
}
if (RUND) { // heller Schaumring am Strand
  const schaum = new Mesh(new TorusGeometry(15.9, 0.18, 8, 80), new MeshBasicMaterial({ color: "#EAFBFF" }));
  schaum.rotation.x = Math.PI / 2; schaum.position.y = -0.48; scene.add(schaum);
}

// ---------- Bäume, Steine, Blumen ----------
function baum(x, z, k = 1, art = 0) {
  const b = new Group();
  b.add(setze(teil(new CylinderGeometry(0.22 * k, 0.32 * k, 1.6 * k, seg(5, 16)), "#9A6A3F"), 0, 0.8 * k, 0));
  if (art === 1 && !RUND) { // Tanne low-poly
    [[1.3, 1.6, 1.7], [1.0, 1.3, 2.6], [0.7, 1.0, 3.4]].forEach(([r, h, y]) => b.add(setze(teil(new ConeGeometry(r * k, h * k, 6), "#3E9E55"), 0, y * k, 0)));
  } else if (RUND) { // runde Krone aus Kugeln
    const gruen = art === 1 ? "#4FAF62" : "#5DBB5A";
    [[0, 2.4, 0, 1.15], [0.8, 2.0, 0.2, 0.8], [-0.75, 2.05, -0.1, 0.85], [0.1, 2.0, 0.8, 0.75], [0, 3.1, 0, 0.75]].forEach(([dx, y, dz, r]) => b.add(setze(teil(kugel(r * k), gruen), dx * k, y * k, dz * k)));
    if (art === 0) [[0.6, 2.3, 0.9], [-0.8, 2.6, 0.6], [0.9, 2.8, -0.4]].forEach(([dx, y, dz]) => b.add(setze(teil(kugel(0.16 * k), "#FF7A6B", { dicke: 1.12 }), dx * k, y * k, dz * k)));
  } else { // Laubbaum low-poly
    b.add(setze(teil(new IcosahedronGeometry(1.3 * k, 0), "#5DBB5A"), 0, 2.4 * k, 0));
    b.add(setze(teil(new IcosahedronGeometry(0.85 * k, 0), "#4FAF52"), 0.6 * k, 3.1 * k, 0.2 * k));
  }
  b.position.set(x, 0.2, z); b.rotation.y = x * 1.7; insel.add(b); return b;
}
[[-9, -6, 1.1, 0], [-7.5, 3, 0.9, 1], [7.5, -6.5, 1, 1], [9.5, 2, 1.15, 0], [3, -9.2, 0.85, 0], [-2.5, 8.5, 0.8, 1], [6.5, 7.5, 0.9, 0], [-10.5, 0, 0.75, 0]]
  .forEach(([x, z, k, a]) => baum(x, z, k, a));
[[4.5, 3.6, 0.6], [5.2, 4.1, 0.35], [-6, 6.5, 0.5], [10, -2, 0.45]].forEach(([x, z, r]) => {
  const st = teil(RUND ? new SphereGeometry(r, 20, 14) : new IcosahedronGeometry(r, 0), "#A7A9B8"); st.scale.y = 0.65; setze(st, x, 0.25 + r * 0.3, z); insel.add(st);
});
const BLUETEN = ["#FF6F91", "#FFD84D", "#FFFFFF", "#B28DFF", "#FF9E5E"];
for (let i = 0; i < 26; i++) {
  const w = i * 2.399, r = 4 + (i * 37 % 70) / 10;
  const x = Math.cos(w) * r, z = Math.sin(w) * r;
  if (Math.hypot(x + 5, z + 4) < 3.2) continue;
  const f = new Group();
  f.add(setze(new Mesh(new CylinderGeometry(0.03, 0.03, 0.4, 4), mat("#3E9E55")), 0, 0.2, 0));
  const kopf = teil(RUND ? new SphereGeometry(0.14, 12, 8) : new IcosahedronGeometry(0.15, 0), BLUETEN[i % BLUETEN.length], { dicke: 1.15 });
  f.add(setze(kopf, 0, 0.45, 0)); f.position.set(x, 0.25, z); insel.add(f);
}

// ---------- Häuschen (später Baumhaus) ----------
{
  const h = new Group();
  let koerper, dach;
  if (RUND) {
    const form = new Shape(); const w = 1.5, r = 0.35;
    form.moveTo(-w + r, -w); form.lineTo(w - r, -w); form.quadraticCurveTo(w, -w, w, -w + r); form.lineTo(w, w - r); form.quadraticCurveTo(w, w, w - r, w);
    form.lineTo(-w + r, w); form.quadraticCurveTo(-w, w, -w, w - r); form.lineTo(-w, -w + r); form.quadraticCurveTo(-w, -w, -w + r, -w);
    koerper = new ExtrudeGeometry(form, { depth: 2.4, bevelEnabled: true, bevelSize: 0.15, bevelThickness: 0.15, bevelSegments: 4, curveSegments: 10 });
    koerper.rotateX(-Math.PI / 2);
    const d = new Shape(); d.moveTo(-2, 0); d.lineTo(0, 1.6); d.lineTo(2, 0); d.lineTo(-2, 0);
    dach = new ExtrudeGeometry(d, { depth: 3.4, bevelEnabled: true, bevelSize: 0.18, bevelThickness: 0.18, bevelSegments: 4 });
    dach.translate(0, 0, -1.7);
  } else {
    koerper = new BoxGeometry(3, 2.4, 3); koerper.translate(0, 1.2, 0);
    dach = new ConeGeometry(2.5, 1.7, 4); dach.rotateY(Math.PI / 4); dach.translate(0, 0.85, 0);
  }
  h.add(teil(koerper, "#FFE3B8", { dicke: 1.03 }));
  h.add(setze(teil(dach, "#E2604F", { dicke: 1.03 }), 0, 2.5, 0));
  const vorn = RUND ? 1.7 : 1.56;
  h.add(setze(teil(new BoxGeometry(0.8, 1.3, 0.12), "#9A6A3F", { dicke: 1.08 }), 0, 0.65, vorn));
  h.add(setze(teil(new BoxGeometry(0.7, 0.7, 0.1), "#9BD7F5", { dicke: 1.1 }), 0.95, 1.5, vorn));
  h.add(setze(teil(new BoxGeometry(0.7, 0.7, 0.1), "#9BD7F5", { dicke: 1.1 }), -0.95, 1.5, vorn));
  h.add(setze(teil(new CylinderGeometry(0.22, 0.22, 0.9, seg(6, 16)), "#B9584A"), 0.9, 3.5, -0.5));
  h.position.set(-5, 0.25, -4.5); h.rotation.y = 0.35; insel.add(h);
}

// ---------- Wolken ----------
const wolken = [];
for (let i = 0; i < 5; i++) {
  const w = new Group();
  [[0, 0, 0, 1.4], [1.3, -0.2, 0, 1], [-1.3, -0.25, 0.1, 1.05], [0.4, 0.5, -0.3, 0.9]].forEach(([x, y, z, r]) => {
    const m = new Mesh(RUND ? new SphereGeometry(r, 18, 12) : new IcosahedronGeometry(r, 0), new MeshLambertMaterial({ color: "#ffffff", flatShading: !RUND }));
    w.add(setze(m, x, y, z));
  });
  w.position.set(-30 + i * 15, 13 + (i % 2) * 2, -22 + (i % 3) * 7); scene.add(w); wolken.push(w);
}

// ---------- Wehendes Gras (nur runder Stil) ----------
let halme = null; const halmDaten = [];
if (RUND) {
  const geo = new ConeGeometry(0.06, 0.45, 4); geo.translate(0, 0.22, 0);
  halme = new InstancedMesh(geo, new MeshToonMaterial({ color: "#5FB548", gradientMap: toonVerlauf }), 700);
  const o = new Object3D();
  for (let i = 0; i < 700; i++) {
    const w = Math.random() * Math.PI * 2, r = 2 + Math.sqrt(Math.random()) * 10.5;
    const x = Math.cos(w) * r, z = Math.sin(w) * r;
    halmDaten.push({ x, z, p: Math.random() * 6, s: 0.6 + Math.random() * 0.8 });
    o.position.set(x, 0.25, z); o.scale.setScalar(halmDaten[i].s); o.updateMatrix(); halme.setMatrixAt(i, o.matrix);
  }
  halme.receiveShadow = true; insel.add(halme);
}

// ---------- Figur (großer Kopf, kleiner Körper) ----------
function figur() {
  const f = new Group(), HAUT = "#F8D2B8", HAAR = "#8A5A34";
  const koerper = new Group(); f.add(koerper);
  // Kleid/Oberteil
  const kleid = RUND ? new LatheGeometry([new Vector2(0.01, 0), new Vector2(0.52, 0), new Vector2(0.48, 0.15), new Vector2(0.34, 0.55), new Vector2(0.28, 0.8), new Vector2(0.01, 0.85)], 28)
    : new CylinderGeometry(0.27, 0.5, 0.85, 7);
  if (!RUND) kleid.translate(0, 0.42, 0);
  koerper.add(setze(teil(kleid, "#8E6FD8"), 0, 0.42, 0));
  koerper.add(setze(teil(RUND ? new SphereGeometry(0.3, 20, 14) : new IcosahedronGeometry(0.3, 0), "#FF9BC8"), 0, 1.15, 0));
  // Beine und Schuhe
  const beine = [-0.15, 0.15].map(x => {
    const b = new Group(); b.position.set(x, 0.48, 0);
    b.add(setze(teil(new CapsuleGeometry(0.09, 0.3, 4, seg(5, 12)), HAUT), 0, -0.22, 0));
    b.add(setze(teil(kugel(0.13), "#C2337A", { dicke: 1.12 }), 0, -0.42, 0.05));
    koerper.add(b); return b;
  });
  // Arme
  const arme = [-1, 1].map(s => {
    const a = new Group(); a.position.set(0.33 * s, 1.22, 0);
    a.add(setze(teil(new CapsuleGeometry(0.08, 0.32, 4, seg(5, 12)), "#FF9BC8"), 0, -0.2, 0));
    a.add(setze(teil(kugel(0.09), HAUT, { dicke: 1.12 }), 0, -0.44, 0));
    a.rotation.z = 0.25 * s; koerper.add(a); return a;
  });
  // Kopf
  const kopf = new Group(); kopf.position.y = 1.85; koerper.add(kopf);
  kopf.add(teil(kugel(0.58), HAUT, { dicke: 1.04 }));
  const haar = teil(RUND ? new SphereGeometry(0.62, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.55) : new IcosahedronGeometry(0.62, 1), HAAR, { dicke: 1.04 });
  if (!RUND) { haar.scale.set(1, 0.9, 1); haar.position.set(0, 0.06, -0.1); } else { haar.position.set(0, 0.04, -0.04); haar.rotation.x = -0.35; }
  kopf.add(haar);
  [-1, 1].forEach(s => kopf.add(setze(teil(kugel(0.2), HAAR, { dicke: 1.08 }), 0.6 * s, -0.05, -0.1)));
  // Gesicht
  const augeMat = new MeshBasicMaterial({ color: "#2E2240" });
  [-1, 1].forEach(s => {
    const a = new Mesh(RUND ? new SphereGeometry(0.075, 14, 10) : new IcosahedronGeometry(0.07, 0), augeMat);
    a.scale.set(1, RUND ? 1.35 : 1, 0.6); setze(a, 0.2 * s, 0.02, 0.53); kopf.add(a);
    if (RUND) {
      a.add(setze(new Mesh(new SphereGeometry(0.03, 8, 6), new MeshBasicMaterial({ color: "#ffffff" })), 0.025, 0.03, 0.06));
      const w = new Mesh(new CircleGeometry(0.09, 16), new MeshBasicMaterial({ color: "#FF9FB2", transparent: true, opacity: 0.6 }));
      setze(w, 0.33 * s, -0.12, 0.49); w.rotation.y = 0.5 * s; kopf.add(w);
    }
  });
  const mund = new Mesh(new TorusGeometry(0.07, 0.018, 6, 12, Math.PI), augeMat);
  mund.rotation.z = Math.PI; setze(mund, 0, -0.15, 0.55); kopf.add(mund);
  f.userData = { koerper, beine, arme, kopf };
  return f;
}
const ich = figur(); ich.position.set(1, 0.25, 2); scene.add(ich);

// ---------- Fuchs (folgt der Figur) ----------
function fuchs() {
  const t = new Group(), O = "#F28C38", W = "#FFF3E6";
  const k = new Group(); t.add(k);
  const leib = teil(new CapsuleGeometry(0.28, 0.5, 6, seg(6, 16)), O); leib.rotation.x = Math.PI / 2; setze(leib, 0, 0.45, 0); k.add(leib);
  const kopf = new Group(); kopf.position.set(0, 0.85, 0.42); k.add(kopf);
  kopf.add(teil(kugel(0.32), O));
  const schnauze = teil(RUND ? new SphereGeometry(0.15, 14, 10) : new IcosahedronGeometry(0.15, 0), W); schnauze.scale.set(1, 0.8, 1.2); setze(schnauze, 0, -0.08, 0.28); kopf.add(schnauze);
  kopf.add(setze(new Mesh(kugel(0.05), new MeshBasicMaterial({ color: "#2E2240" })), 0, -0.04, 0.45));
  [-1, 1].forEach(s => {
    const ohr = teil(new ConeGeometry(0.12, 0.3, seg(4, 12)), O); setze(ohr, 0.17 * s, 0.32, -0.02); ohr.rotation.z = -0.25 * s; kopf.add(ohr);
    kopf.add(setze(new Mesh(kugel(0.045), new MeshBasicMaterial({ color: "#2E2240" })), 0.12 * s, 0.05, 0.28));
  });
  [[-0.15, 0.25], [0.15, 0.25], [-0.15, -0.25], [0.15, -0.25]].forEach(([x, z]) => k.add(setze(teil(new CapsuleGeometry(0.07, 0.18, 4, seg(5, 10)), "#4A3328"), x, 0.15, z)));
  const schwanz = new Group(); schwanz.position.set(0, 0.55, -0.45); k.add(schwanz);
  const s1 = teil(RUND ? new SphereGeometry(0.22, 16, 12) : new IcosahedronGeometry(0.22, 0), O); s1.scale.set(1, 1, 1.8); setze(s1, 0, 0.12, -0.3); schwanz.add(s1);
  schwanz.add(setze(teil(kugel(0.14), W), 0, 0.2, -0.68));
  t.userData = { k, schwanz };
  t.scale.setScalar(0.85);
  return t;
}
const tier = fuchs(); tier.position.set(2.5, 0.25, 3); scene.add(tier);

// ---------- Steuerung: Hintippen zum Laufen, freie Kamera optional ----------
let ziel = null, freiKamera = false;
let gieren = 0, neigung = 0.72, abstand = RUND ? 15 : 13;
const ray = new Raycaster(), zeiger = new Vector2();
const fl = renderer.domElement;
let unten = null, bewegt = false;
const finger = new Map();
fl.addEventListener("pointerdown", e => { fl.setPointerCapture(e.pointerId); finger.set(e.pointerId, { x: e.clientX, y: e.clientY }); unten = { x: e.clientX, y: e.clientY }; bewegt = false; });
fl.addEventListener("pointermove", e => {
  const alt = finger.get(e.pointerId); if (!alt) return;
  const dx = e.clientX - alt.x, dy = e.clientY - alt.y;
  if (finger.size === 2) {
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
fl.addEventListener("pointerup", e => {
  finger.delete(e.pointerId);
  if (bewegt) return;
  const r = fl.getBoundingClientRect();
  zeiger.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(zeiger, camera);
  const t = ray.intersectObjects(boden, false)[0];
  if (t) { ziel = new Vector3(t.point.x, 0.25, t.point.z); if (ziel.length() > 14.5) ziel.setLength(14.5); markiere(ziel); }
});
fl.addEventListener("wheel", e => { if (!freiKamera) return; e.preventDefault(); abstand = MathUtils.clamp(abstand + e.deltaY * 0.01, 6, 26); }, { passive: false });
document.getElementById("kamera").addEventListener("click", (e) => {
  freiKamera = !freiKamera; e.currentTarget.classList.toggle("an", freiKamera);
  e.currentTarget.textContent = freiKamera ? "🎥 Kamera frei" : "🎥 Kamera fest";
  if (!freiKamera) { gieren = 0; neigung = 0.72; abstand = RUND ? 15 : 13; }
});

// Markierung, wohin gelaufen wird
const marke = new Mesh(new TorusGeometry(0.35, 0.06, 6, seg(10, 28)), new MeshBasicMaterial({ color: "#FFFFFF", transparent: true, opacity: 0.9 }));
marke.rotation.x = Math.PI / 2; marke.visible = false; scene.add(marke);
function markiere(p) { marke.position.set(p.x, 0.32, p.z); marke.visible = true; marke.scale.setScalar(1); }

// ---------- Größe, Schleife ----------
function groesse() {
  const el = document.getElementById("buehne");
  renderer.setSize(el.clientWidth, el.clientHeight, false);
  camera.aspect = el.clientWidth / Math.max(1, el.clientHeight); camera.updateProjectionMatrix();
}
addEventListener("resize", groesse); groesse();

const uhr = new Clock(), blick = new Vector3(), tmp = new Vector3(), halmO = new Object3D();
let lauf = 0;
function bild() {
  const dt = Math.min(uhr.getDelta(), 0.05), t = uhr.elapsedTime;
  // Figur läuft zum Ziel
  const u = ich.userData; let geht = false;
  if (ziel) {
    tmp.subVectors(ziel, ich.position); tmp.y = 0; const d = tmp.length();
    if (d < 0.08) { ziel = null; marke.visible = false; }
    else {
      geht = true; tmp.normalize(); ich.position.addScaledVector(tmp, Math.min(d, 3.4 * dt));
      const soll = Math.atan2(tmp.x, tmp.z); let diff = soll - ich.rotation.y; diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      ich.rotation.y += diff * Math.min(1, dt * 10);
    }
  }
  lauf += dt * (geht ? 11 : 0);
  const schwung = geht ? Math.sin(lauf) : 0;
  u.beine[0].rotation.x = schwung * 0.6; u.beine[1].rotation.x = -schwung * 0.6;
  u.arme[0].rotation.x = -schwung * 0.6; u.arme[1].rotation.x = schwung * 0.6;
  u.koerper.position.y = geht ? Math.abs(Math.sin(lauf)) * 0.08 : Math.sin(t * 2) * 0.015;
  u.kopf.rotation.z = geht ? 0 : Math.sin(t * 1.3) * 0.05;
  if (marke.visible) marke.scale.setScalar(1 + Math.sin(t * 6) * 0.1);

  // Fuchs folgt mit Abstand
  tmp.subVectors(ich.position, tier.position); tmp.y = 0; const dT = tmp.length();
  const tu = tier.userData; let hoppelt = false;
  if (dT > 1.5) {
    hoppelt = true; tmp.normalize(); tier.position.addScaledVector(tmp, Math.min(dT - 1.5, (dT > 4 ? 5 : 3.2) * dt));
    const soll = Math.atan2(tmp.x, tmp.z); let diff = soll - tier.rotation.y; diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    tier.rotation.y += diff * Math.min(1, dt * 8);
  }
  tu.k.position.y = hoppelt ? Math.abs(Math.sin(t * 12)) * 0.18 : 0;
  tu.schwanz.rotation.y = Math.sin(t * (hoppelt ? 10 : 3)) * 0.5;

  // Wasser, Gras, Wolken
  if (RUND) {
    const a = wasserGeo.attributes.position;
    for (let i = 0; i < a.count; i++) { const x = wasserBasis[i * 3], z = wasserBasis[i * 3 + 2]; a.setY(i, Math.sin(x * 0.35 + t * 1.4) * 0.1 + Math.cos(z * 0.3 + t * 1.1) * 0.1); }
    a.needsUpdate = true; wasserGeo.computeVertexNormals();
    for (let i = 0; i < halmDaten.length; i++) {
      const h = halmDaten[i];
      halmO.position.set(h.x, 0.25, h.z); halmO.scale.setScalar(h.s);
      halmO.rotation.set(Math.sin(t * 1.8 + h.p + h.x * 0.3) * 0.18, 0, Math.cos(t * 1.5 + h.p) * 0.12);
      halmO.updateMatrix(); halme.setMatrixAt(i, halmO.matrix);
    }
    halme.instanceMatrix.needsUpdate = true;
  }
  wolken.forEach((w, i) => { w.position.x += dt * (0.4 + i * 0.1); if (w.position.x > 40) w.position.x = -40; });

  // Kamera
  blick.copy(ich.position).add(tmp.set(0, 1, 0));
  const gw = freiKamera ? gieren : 0, nw = freiKamera ? neigung : 0.72;
  camera.position.set(blick.x + Math.sin(gw) * Math.cos(nw) * abstand, blick.y + Math.sin(nw) * abstand, blick.z + Math.cos(gw) * Math.cos(nw) * abstand);
  camera.lookAt(blick);
  sonne.position.set(ich.position.x + 10, 18, ich.position.z + 8); sonne.target.position.copy(ich.position); sonne.target.updateMatrixWorld();

  renderer.render(scene, camera);
  requestAnimationFrame(bild);
}
requestAnimationFrame(bild);
window.__probe = { ich, tier, laufeZu: (x, z) => { ziel = new Vector3(x, 0.25, z); markiere(ziel); }, stil: STIL, stile: ["a", "b"], info: () => messe(renderer, scene), blick: (g, n, a) => { freiKamera = true; gieren = g; neigung = n; abstand = a; } };
