// Heimatinsel (Stil B: rund, Toon-Licht, Konturen).
// Figur trägt den aktuellen Look aus dem Kleiderschrank, das eigene Tier läuft mit,
// Tag/Nacht nach der Uhr, Jahreszeit nach dem Datum, Nachbarn führen zu den Fächern.
// Test-Parameter: ?stunde=21  ?monat=12  (Jahreszeit/Nacht ausprobieren)
import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, Fog, HemisphereLight, DirectionalLight, Clock, SRGBColorSpace,
  PCFSoftShadowMap, Group, Mesh, MeshToonMaterial, MeshBasicMaterial, MeshLambertMaterial, BackSide,
  CylinderGeometry, SphereGeometry, ConeGeometry, BoxGeometry, CapsuleGeometry, PlaneGeometry,
  LatheGeometry, ExtrudeGeometry, Shape, Vector2, Vector3, DataTexture, RedFormat, NearestFilter, InstancedMesh,
  Object3D, Raycaster, CircleGeometry, TorusGeometry, MathUtils, BufferGeometry, BufferAttribute, Float32BufferAttribute, Points, PointsMaterial, LineSegments, LineBasicMaterial, CanvasTexture, Sprite, SpriteMaterial
} from "../three/three.module.js";
import { S, SPIELE, istFrei, baumStufe } from "./gemeinsam.js";
import { erzeuge, BIOME, FARBEN, neuerSeed } from "./welt.js";

const $ = (id) => document.getElementById(id);
const SP = window.Sprache;
const q = new URLSearchParams(location.search);
const jetzt = new Date();
const STUNDE = q.has("stunde") ? +q.get("stunde") : jetzt.getHours() + jetzt.getMinutes() / 60;
const MONAT = q.has("monat") ? +q.get("monat") : jetzt.getMonth() + 1;
const SAISON = [12, 1, 2].includes(MONAT) ? "winter" : [3, 4, 5].includes(MONAT) ? "fruehling" : [9, 10, 11].includes(MONAT) ? "herbst" : "sommer";
// ---------- Eigene Welt (Wünsche + seed, siehe welt.js); ohne gespeicherte Welt: die bisherige Insel ----------
// Test: ?biom=wald&groesse=gross&huegel=viel&see=1&seed=7
const WELT_DATEN = S.lade("welt") || {};
const WUNSCH = q.has("biom") ? { biom: q.get("biom"), groesse: q.get("groesse") || "mittel", huegel: q.get("huegel") || "mittel", see: q.get("see") === "1", blumen: q.get("blumen") !== "0", farbe: q.get("farbe") ? "#" + q.get("farbe") : undefined, seed: +q.get("seed") || 1 }
  : (WELT_DATEN.welten || [])[WELT_DATEN.aktiv] || null;
const WELT = erzeuge(WUNSCH), P = WELT.plaetze;
const ZX_GRENZE = 40;   // ab hier liegt das Zimmer (x ≈ 60), dort ist der Boden immer flach
// Bodenhöhe für Figuren und Dinge (bisherige Insel: überall 0.25)
function bodenY(x, z) {
  if (WELT.insel || x > ZX_GRENZE) return 0.25;
  const d = Math.hypot(x, z);
  if (d <= WELT.rand) return 0.25 + WELT.hoehe(x, z);
  if (d <= WELT.R) { const t = (d - WELT.rand) / (WELT.R - WELT.rand); return 0.25 - t * t * 0.35; }
  return -0.1 - Math.min(1.1, (d - WELT.R) * 1.4);
}
const WINTERLICH = SAISON === "winter" || WELT.biom === "schnee";
const NACHT = STUNDE >= 20 || STUNDE < 6.5, DAEMMER = !NACHT && (STUNDE >= 18 || STUNDE < 8);
const GRAFIK_KEY = "lerninsel.grafik";
const lies = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
// Insel-Einstellungen (Grafik, Steuerung, Kamera) werden pro Kind bei den Eltern-Daten gemerkt.
// Eltern legen im Elternbereich fest, ob das Kind die Knöpfe überhaupt sieht (kindDarf). Alte Tablet-Werte dienen als Startwert.
const EIN = Object.assign({ grafik: lies(GRAFIK_KEY) === "einfach" ? "einfach" : "schoen", steuerung: lies("lerninsel.steuerung") === "tippen" ? "tippen" : "joystick", kamera: "fest", kindDarf: true },
  (S.lade("eltern") || {}).insel || {});
function merkeEin(k, v) { EIN[k] = v; const e = S.lade("eltern") || {}; e.insel = Object.assign({}, e.insel || {}, { [k]: v }); S.speichere("eltern", e); }
const EINFACH = EIN.grafik === "einfach";
const RUHIG = !!(window.Zeit && window.Zeit.regeln().ruhig); // ruhige Darstellung: Gras und Wasser bewegen sich nicht

// ---------- Renderer, Szene, Licht ----------
const renderer = new WebGLRenderer({ antialias: !EINFACH, powerPreference: "high-performance" });
renderer.setPixelRatio(EINFACH ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
renderer.outputColorSpace = SRGBColorSpace;
renderer.shadowMap.enabled = !EINFACH;
renderer.shadowMap.type = PCFSoftShadowMap;
$("buehne").appendChild(renderer.domElement);

const scene = new Scene();
const HIMMEL = NACHT ? "#1C2A55" : DAEMMER ? "#F6B98A" : WINTERLICH ? "#CFE6F5" : WELT.biom === "wueste" ? "#BFE3F2" : "#A8DDF5";
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
  sprechblase("💤", "Schläft noch", st.genug ? "Für heute ist genug gespielt. Morgen geht es weiter!" : `Erst lernen, dann spielen! Noch ${st.fehltMin} Minuten oder ${st.fehltAufgaben} Aufgaben. Ella, Fipsi und Biber Benno helfen dir.`,
    S.paar(["", "Сначала учиться, потом играть! Элла, Фипси и бобр Бенно помогут тебе."])[1], null);
}
// aktion = Beschriftung des Aktionsknopfs, wenn die Figur nah davor steht; nah = Reichweite
function antippbar(obj, fn, aktion = ["👀", "Ansehen"], nah = 1.9) { Object.assign(obj.userData, { tipp: fn, aktion, nah }); tippbar.push(obj); }

// ---------- Insel und Wasser ----------
const JAHRESZEIT_GRAS = !WELT.insel && ["wiese", "wald", "berge"].includes(WELT.biom);
const GRAS = WELT.insel ? (SAISON === "winter" ? "#EEF5FB" : SAISON === "herbst" ? "#8DC45A" : "#7CCB5B")
  : JAHRESZEIT_GRAS && SAISON === "winter" ? "#EEF5FB" : JAHRESZEIT_GRAS && SAISON === "herbst" ? "#8DC45A" : WELT.B.gras;
const boden = [];
// Feste Deko (Bäume, Steine, Blumen, Wegsteine) kommt erst in diese Gruppe und wird danach zu wenigen Meshes verschmolzen:
// aus vielen hundert Zeichenaufrufen werden so ein paar wenige – wichtig für ältere Tablets (iPad 10 ruckelte bei „riesig“).
const deko = new Group();
if (!WELT.insel) {
  // Gelände: Ringe um die Mitte, Höhe aus der Welt, Farben je Höhe (Gras, Fels, Schneekuppen, Strand)
  const ringe = EINFACH ? Math.round(WELT.R * 1.4) : Math.round(WELT.R * 2.6), segs = EINFACH ? 64 : 120, RA = WELT.R + 1.2;
  const pos = [], farb = [], idx = [];
  const cG = new Color(GRAS), cS = new Color(WINTERLICH && WELT.biom !== "wueste" ? "#F3E9D8" : WELT.B.sand), cF = new Color(WELT.B.fels), cW = new Color("#FFFFFF"), c = new Color();
  for (let i = 0; i <= ringe; i++) {
    const rr = RA * (i / ringe) ** 0.85;
    for (let j = 0; j < segs; j++) {
      const a = j / segs * Math.PI * 2, x = Math.cos(a) * rr, z = Math.sin(a) * rr, y = bodenY(x, z);
      pos.push(x, y, z);
      if (rr > WELT.rand - 0.4) c.copy(cS);
      else { const h = y - 0.25; c.copy(cG); if (h > 1.6 && WELT.biom === "berge") c.lerp(cF, Math.min(1, (h - 1.6) / 1.2)); if (h > 3.3 && WELT.biom === "berge") c.lerp(cW, Math.min(1, (h - 3.3) / 0.6)); if (WELT.see && h < -0.25) c.lerp(cS, 0.6); }
      farb.push(c.r, c.g, c.b);
    }
  }
  for (let i = 0; i < ringe; i++) for (let j = 0; j < segs; j++) {
    const a = i * segs + j, b = i * segs + (j + 1) % segs, cc = (i + 1) * segs + j, d = (i + 1) * segs + (j + 1) % segs;
    idx.push(a, b, cc, b, d, cc);
  }
  const geo = new BufferGeometry(); geo.setAttribute("position", new Float32BufferAttribute(pos, 3)); geo.setAttribute("color", new Float32BufferAttribute(farb, 3));
  geo.setIndex(idx); geo.computeVertexNormals();
  const g = new Mesh(geo, new MeshToonMaterial({ vertexColors: true, gradientMap: verlauf })); g.receiveShadow = true; scene.add(g); boden.push(g);
  // Unterseite (Sockel unter Wasser)
  const sockel = new Mesh(new CylinderGeometry(RA, RA - 1, 1.2, segs), mat(WELT.B.sand)); sockel.position.y = -1.7; scene.add(sockel);
  // Teich
  if (WELT.see) {
    const t = new Mesh(new CircleGeometry(WELT.see.r + 0.3, 40), new MeshToonMaterial({ color: NACHT ? "#2E5F8C" : "#5EC3E6", gradientMap: verlauf, transparent: true, opacity: 0.9 }));
    t.rotation.x = -Math.PI / 2; t.position.set(WELT.see.x, -0.18, WELT.see.z); scene.add(t);
    block(WELT.see.x, WELT.see.z, WELT.see.r - 0.2);
  }
  WELT.pfad.forEach(([x, z]) => { const p = new Mesh(new CylinderGeometry(0.55, 0.6, 0.12, 20), mat("#D9CDB8")); p.receiveShadow = true; setze(p, x, bodenY(x, z) + 0.03, z); deko.add(p); });
}
if (WELT.insel) {
  const sand = new LatheGeometry([new Vector2(0, -1.2), new Vector2(15.2, -1.2), new Vector2(15.6, -0.6), new Vector2(15.2, -0.1), new Vector2(0, -0.1)], 64);
  const s = new Mesh(sand, mat(SAISON === "winter" ? "#F3E9D8" : "#F2D9A2")); s.receiveShadow = true; scene.add(s);
  const g = new Mesh(new LatheGeometry([new Vector2(13.1, -0.3), new Vector2(12.9, 0.05), new Vector2(12.2, 0.25), new Vector2(0, 0.25)], 64), mat(GRAS));
  g.receiveShadow = true; scene.add(g); boden.push(g, s);
  // Pfad vom Haus zum Platz in der Mitte
  for (let i = 0; i < 7; i++) {
    const p = new Mesh(new CylinderGeometry(0.55, 0.6, 0.12, 20), mat("#D9CDB8"));
    p.receiveShadow = true; setze(p, -4 + i * 1.25, 0.28, -2.6 + Math.sin(i * 0.9) * 0.6); deko.add(p);
  }
}
const wasserGeo = new PlaneGeometry(140, 140, EINFACH ? 1 : 70, EINFACH ? 1 : 70); wasserGeo.rotateX(-Math.PI / 2);
const wasser = new Mesh(wasserGeo, new MeshToonMaterial({ color: NACHT ? "#2E5F8C" : "#5EC3E6", gradientMap: verlauf, transparent: true, opacity: 0.92 }));
wasser.position.y = -0.55; wasser.receiveShadow = true; scene.add(wasser);
const wasserBasis = Float32Array.from(wasserGeo.attributes.position.array);
{ const schaum = new Mesh(new TorusGeometry(WELT.insel ? 15.9 : WELT.R + 0.9, 0.18, 8, 80), new MeshBasicMaterial({ color: "#EAFBFF" })); schaum.rotation.x = Math.PI / 2; schaum.position.y = -0.48; scene.add(schaum); }

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
  b.position.set(x, bodenY(x, z) - 0.05, z); b.rotation.y = x * 1.7; deko.add(b); block(x, z, 0.6 * k);
}
// Nadelbaum, Palme, Kaktus für die eigenen Welten
function nadelbaum(x, z, k) {
  const b = new Group(), f = WINTERLICH ? "#3E8E5A" : "#3F9A5C";
  b.add(setze(teil(new CylinderGeometry(0.16 * k, 0.24 * k, 1.0 * k, 12), "#8A5A34"), 0, 0.5 * k, 0));
  [[1.15, 1.3, 1.1], [0.9, 1.1, 1.9], [0.62, 0.9, 2.6]].forEach(([r, h, y]) => b.add(setze(teil(new ConeGeometry(r * k, h * k, 14), f), 0, y * k, 0)));
  if (WINTERLICH) b.add(setze(teil(new ConeGeometry(0.4 * k, 0.5 * k, 14), "#FFFFFF"), 0, 3.0 * k, 0));
  b.position.set(x, bodenY(x, z) - 0.05, z); deko.add(b); block(x, z, 0.5 * k);
}
function palme(x, z, k) {
  const b = new Group(), stamm = new Group(); b.add(stamm);
  for (let i = 0; i < 6; i++) stamm.add(setze(teil(new CylinderGeometry(0.17 * k, 0.21 * k, 0.5 * k, 10), i % 2 ? "#B98A55" : "#A47746"), Math.sin(i * 0.35) * 0.25 * k, (0.25 + i * 0.45) * k, 0));
  for (let i = 0; i < 6; i++) { const bl = teil(kugel(0.5 * k, 14, 8), "#4FAF62"); bl.scale.set(1.9, 0.18, 0.55); bl.rotation.y = i / 6 * Math.PI * 2; bl.rotation.z = -0.35; const g = new Group(); g.rotation.y = i / 6 * Math.PI * 2; setze(bl, 0.75 * k, 0, 0); g.add(bl); g.position.set(0.55 * k, 2.85 * k, 0); b.add(g); }
  [[0.45, 2.6, 0.15], [0.62, 2.62, -0.12]].forEach(([dx, y, dz]) => b.add(setze(teil(kugel(0.14 * k), "#7A4E25"), dx * k, y * k, dz * k)));
  b.position.set(x, bodenY(x, z) - 0.05, z); b.rotation.y = x * 2.1; deko.add(b); block(x, z, 0.35 * k);
}
function kaktus(x, z, k) {
  const b = new Group(), f = "#5FA05A";
  b.add(setze(teil(new CapsuleGeometry(0.28 * k, 1.4 * k, 6, 12), f), 0, 0.95 * k, 0));
  [[-1, 0.9, 0.5], [1, 1.3, 0.4]].forEach(([s, y, h]) => { b.add(setze(teil(new CapsuleGeometry(0.16 * k, 0.3 * k, 6, 10), f), 0.38 * s * k, y * k, 0)); const arm = teil(new CapsuleGeometry(0.16 * k, h * k, 6, 10), f); setze(arm, 0.52 * s * k, (y + 0.32) * k, 0); b.add(arm); });
  b.add(setze(teil(kugel(0.12 * k, 10, 8), WELT.farbe || "#FF6F91"), 0, 1.95 * k, 0));
  b.position.set(x, bodenY(x, z) - 0.05, z); b.rotation.y = x * 1.3; deko.add(b); block(x, z, 0.4 * k);
}
WELT.baeume.forEach(({ x, z, k, i, typ }) => typ === "nadel" ? nadelbaum(x, z, k) : typ === "palme" ? palme(x, z, k) : typ === "kaktus" ? kaktus(x, z, k) : baum(x, z, k, i));
WELT.steine.forEach(([x, z, r]) => {
  const st = teil(kugel(r, 20, 14), WELT.insel ? "#A7A9B8" : WELT.B.fels); st.scale.y = 0.65; setze(st, x, bodenY(x, z) + r * 0.3, z); deko.add(st); block(x, z, r);
});
if (!WELT.insel && WELT.blumen.length && !(JAHRESZEIT_GRAS && SAISON === "winter")) {
  const BL = [WELT.farbe, WELT.farbe, "#FFD84D", "#FFFFFF", WELT.farbe, "#B28DFF", "#FF9E5E"];
  WELT.blumen.forEach(([x, z, i]) => {
    const f = new Group();
    f.add(setze(new Mesh(new CylinderGeometry(0.03, 0.03, 0.4, 4), mat("#3E9E55")), 0, 0.2, 0));
    f.add(setze(teil(kugel(0.14, 12, 8), BL[i % BL.length], { dicke: 1.15 }), 0, 0.45, 0));
    f.position.set(x, bodenY(x, z), z); deko.add(f);
  });
}
if (WELT.insel && SAISON !== "winter") {
  const BL = ["#FF6F91", "#FFD84D", "#FFFFFF", "#B28DFF", "#FF9E5E"], n = SAISON === "fruehling" ? 44 : 26;
  for (let i = 0; i < n; i++) {
    const w = i * 2.399, r = 4 + (i * 37 % 70) / 10, x = Math.cos(w) * r, z = Math.sin(w) * r;
    if (Math.hypot(x + 5, z + 4.5) < 3.4) continue;
    const f = new Group();
    f.add(setze(new Mesh(new CylinderGeometry(0.03, 0.03, 0.4, 4), mat("#3E9E55")), 0, 0.2, 0));
    f.add(setze(teil(kugel(0.14, 12, 8), BL[i % BL.length], { dicke: 1.15 }), 0, 0.45, 0));
    f.position.set(x, 0.25, z); deko.add(f);
  }
}

// ---------- Deko verschmelzen (je Material ein Mesh) ----------
function verschmelze(gruppe) {
  gruppe.updateMatrixWorld(true);
  const sammel = new Map();
  gruppe.traverse(m => {
    if (!m.isMesh || Array.isArray(m.material)) return;
    let g = m.geometry.clone(); g.applyMatrix4(m.matrixWorld);
    if (!g.index) { const n = g.attributes.position.count; g.setIndex([...Array(n).keys()]); }
    const e = sammel.get(m.material) || { teile: [], schatten: false };
    e.teile.push(g); e.schatten = e.schatten || m.castShadow; sammel.set(m.material, e);
  });
  sammel.forEach(({ teile, schatten }, material) => {
    let anzahl = 0, idxAnzahl = 0; teile.forEach(g => { anzahl += g.attributes.position.count; idxAnzahl += g.index.count; });
    const pos = new Float32Array(anzahl * 3), nor = new Float32Array(anzahl * 3), idx = new Uint32Array(idxAnzahl);
    let o = 0, oi = 0;
    teile.forEach(g => {
      pos.set(g.attributes.position.array, o * 3); if (g.attributes.normal) nor.set(g.attributes.normal.array, o * 3);
      const ix = g.index.array; for (let k = 0; k < ix.length; k++) idx[oi + k] = ix[k] + o;
      o += g.attributes.position.count; oi += ix.length; g.dispose();
    });
    const geo = new BufferGeometry(); geo.setAttribute("position", new Float32BufferAttribute(pos, 3)); geo.setAttribute("normal", new Float32BufferAttribute(nor, 3)); geo.setIndex(new BufferAttribute(idx, 1));
    geo.computeBoundingSphere();
    const m = new Mesh(geo, material); m.castShadow = schatten; m.receiveShadow = true; scene.add(m);
  });
}
verschmelze(deko);

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
  h.position.set(P.haus[0], bodenY(P.haus[0], P.haus[1]), P.haus[1]); h.rotation.y = WELT.insel ? 0.35 : P.haus[2]; scene.add(h); block(P.haus[0], P.haus[1], 2.3);
  antippbar(h, () => spielOrt(() => reingehen()), ["🚪", "Reingehen"], 3.4);
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
if (WINTERLICH && !EINFACH) {
  const pos = []; for (let i = 0; i < 500; i++) pos.push((Math.random() - 0.5) * 40, Math.random() * 16, (Math.random() - 0.5) * 40);
  const g = new BufferGeometry(); g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  schnee = new Points(g, new PointsMaterial({ color: "#FFFFFF", size: 0.14 })); scene.add(schnee);
}

// ---------- Echtes Wetter (Open-Meteo, Ort aus dem Elternbereich, kein GPS) ----------
// Cache 30 Minuten in localStorage; offline bleibt das Jahreszeiten-Wetter. Test: ?wetter=regen|schnee|nebel|wolken|gewitter|klar
const WETTER_KEY = "lerninsel.wetter", ORT = S.kind().ort;
const WETTER_ART = (c) => c == null ? null : c === 0 ? "klar" : c <= 3 ? (c === 3 ? "wolken" : "heiter") : c <= 48 ? "nebel" : c <= 67 || (c >= 80 && c <= 82) ? "regen" : c <= 77 || c === 85 || c === 86 ? "schnee" : c >= 95 ? "gewitter" : "wolken";
const WETTER_TEXT = { klar: ["☀️", "Sonne pur", "солнечно"], heiter: ["🌤️", "ein paar Wolken", "немного облаков"], wolken: ["☁️", "bewölkt", "облачно"], nebel: ["🌫️", "Nebel", "туман"], regen: ["🌧️", "Regen", "дождь"], schnee: ["❄️", "Schnee", "снег"], gewitter: ["⛈️", "Gewitter", "гроза"] };
let wetter = null, regen = null, blitz = 0; const SONNE_BASIS = sonne.intensity;
function wetterCache() { try { const w = JSON.parse(lies(WETTER_KEY)); return w && ORT && w.lat === ORT.lat && w.lon === ORT.lon ? w : null; } catch (e) { return null; } }
function wendeWetterAn(w) {
  wetter = w; const art = w.art;
  sonne.intensity = SONNE_BASIS * ({ wolken: 0.7, nebel: 0.6, regen: 0.5, gewitter: 0.4, schnee: 0.75 }[art] || 1);
  const grau = { wolken: "#B7C7D3", nebel: "#C9D1D6", regen: "#8FA2B2", gewitter: "#6C7A8C", schnee: "#D5DEE6" }[art];
  if (grau && !NACHT) { scene.background = new Color(grau); scene.fog.color.set(grau); }
  if (art === "nebel") { scene.fog.near = 6; scene.fog.far = 34; } else if (art === "regen" || art === "gewitter" || art === "schnee") { scene.fog.near = 18; scene.fog.far = 60; }
  if (["wolken", "regen", "gewitter", "nebel", "schnee"].includes(art)) wolken.forEach(wo => wo.children.forEach(k => k.material.color.set(NACHT ? "#4E5B80" : art === "gewitter" ? "#7D8796" : "#C4CCD4")));
  if (art === "klar") wolken.forEach((wo, i) => { wo.visible = i < 2; });
  if ((art === "regen" || art === "gewitter") && !regen) {
    const pos = []; for (let i = 0; i < (EINFACH ? 300 : 900); i++) { const x = (Math.random() - 0.5) * 40, y = Math.random() * 16, z = (Math.random() - 0.5) * 40; pos.push(x, y, z, x + 0.05, y - 0.55, z); }
    const g = new BufferGeometry(); g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    regen = new LineSegments(g, new LineBasicMaterial({ color: "#F2F8FF", transparent: true, opacity: 0.75 })); scene.add(regen);
  }
  if (art === "schnee" && !schnee) {
    const pos = []; for (let i = 0; i < (EINFACH ? 200 : 500); i++) pos.push((Math.random() - 0.5) * 40, Math.random() * 16, (Math.random() - 0.5) * 40);
    const g = new BufferGeometry(); g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    schnee = new Points(g, new PointsMaterial({ color: "#FFFFFF", size: 0.14 })); scene.add(schnee);
  }
  if (art !== "schnee" && art !== "regen" && schnee && SAISON === "winter" && w.temp > 3) { scene.remove(schnee); schnee = null; } // kein Schneefall bei Plusgraden ohne Schnee-Wetter
}
function wetterSticker(w) { if (window.Sticker && w && w.art) { window.Sticker.entdecke("w-" + (w.art === "heiter" ? "wolken" : w.art)); if (NACHT) window.Sticker.entdecke("w-mond"); } }
function wetterSatz() {
  if (!wetter) return null;
  const [e, txt] = WETTER_TEXT[wetter.art] || WETTER_TEXT.wolken;
  return `${e} In ${wetter.ort}: ${Math.round(wetter.temp)} °C, ${txt}`;
}
async function holeWetter() {
  if (!ORT || ORT.lat == null || !navigator.onLine) return;
  try {
    const st = new AbortController(); setTimeout(() => st.abort(), 6000);
    const a = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${ORT.lat}&longitude=${ORT.lon}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`, { signal: st.signal });
    const c = (await a.json()).current; if (!c) return;
    const w = { lat: ORT.lat, lon: ORT.lon, ort: ORT.name, zeit: Date.now(), temp: c.temperature_2m, wind: c.wind_speed_10m, code: c.weather_code, art: WETTER_ART(c.weather_code) };
    try { localStorage.setItem(WETTER_KEY, JSON.stringify(w)); } catch (e) {}
    wendeWetterAn(w); zeigeWetterInfo(); wetterSticker(w);
  } catch (e) { /* offline: Jahreszeiten-Wetter bleibt */ }
}
{
  const test = q.get("wetter"), c = wetterCache();
  if (test) wendeWetterAn({ ort: (ORT && ORT.name) || "Testhausen", temp: test === "schnee" ? -2 : 14, wind: 12, art: test });
  else if (c) { wendeWetterAn(c); setTimeout(() => wetterSticker(c), 1500); if (Date.now() - c.zeit > 30 * 60000) holeWetter(); }
  else holeWetter();
}

// Wetterstation neben dem Haus: Hütte, Thermometer, Windrad
const station = new Group(); station.position.set(P.station[0], bodenY(P.station[0], P.station[1]), P.station[1]); station.rotation.y = P.station[2]; scene.add(station); block(P.station[0], P.station[1], 0.6);
station.add(setze(teil(new CylinderGeometry(0.07, 0.09, 1.6, 10), "#8A6A4A"), 0, 0.8, 0));
station.add(setze(teil(new BoxGeometry(0.8, 0.6, 0.6), "#FFFFFF"), 0, 1.85, 0));
{ const dach = teil(new ConeGeometry(0.62, 0.38, 4), "#E0574A"); dach.rotation.y = Math.PI / 4; station.add(setze(dach, 0, 2.34, 0)); }
[-0.12, 0, 0.12].forEach(y => station.add(setze(new Mesh(new BoxGeometry(0.62, 0.035, 0.02), mat("#C9D6DF")), 0, 1.85 + y, 0.31)));
station.add(setze(teil(new CylinderGeometry(0.035, 0.035, 0.5, 8), "#FFFFFF"), 0.5, 1.85, 0.05));
station.add(setze(new Mesh(kugel(0.06, 10, 8), mat("#E0574A")), 0.5, 1.62, 0.05));
const windrad = new Group(); windrad.position.set(0, 2.75, 0); station.add(windrad);
windrad.add(setze(teil(new CylinderGeometry(0.02, 0.02, 0.4, 6), "#6B6B7A"), 0, -0.2, 0));
[0, 1, 2].forEach(i => { const b = new Group(); b.rotation.y = i * Math.PI * 2 / 3; const sch = teil(kugel(0.1, 12, 8), ["#FFD84D", "#5CCBA6", "#7B9BFF"][i], { dicke: 1.1 }); sch.scale.set(1, 0.6, 1); b.add(setze(sch, 0.24, 0, 0)); b.add(setze(new Mesh(new BoxGeometry(0.22, 0.02, 0.02), mat("#6B6B7A")), 0.12, 0, 0)); windrad.add(b); });
antippbar(station, () => {
  if (!ORT || ORT.lat == null) return sprechblase("🌦️", "Die Wetterstation", "Hier siehst du das echte Wetter bei dir zu Hause. Frag deine Eltern, ob sie im Elternbereich euren Ort eintragen.", S.paar(["", "Здесь видно настоящую погоду у тебя дома. Попроси родителей вписать ваш город в разделе для родителей."])[1], null);
  if (!wetter) return sprechblase("🌦️", "Die Wetterstation", `Die Station hat noch keine Nachricht aus ${ORT.name}. Mit Internet klappt es beim nächsten Mal.`, S.paar(["", "Станция ещё не получила данные. С интернетом получится в следующий раз."])[1], null);
  const [, txt, ru] = WETTER_TEXT[wetter.art] || WETTER_TEXT.wolken, tp = Math.round(wetter.temp);
  const tipp = wetter.art === "regen" || wetter.art === "gewitter" ? "Nimm draußen eine Regenjacke mit!" : tp <= 3 ? "Brr! Mütze und Handschuhe nicht vergessen." : tp >= 26 ? "Heiß! Trink viel Wasser und denk an die Sonnencreme." : wetter.art === "klar" ? "Ein schöner Tag zum Rausgehen!" : "Zieh dich passend an, wenn du rausgehst.";
  sprechblase("🌦️", `Wetter in ${wetter.ort}`, `Draußen sind es ${tp} Grad, ${txt}. Wind: ${Math.round(wetter.wind || 0)} km/h. ${tipp}`, S.paar(["", `На улице ${tp} градусов, ${ru}.`])[1], null);
}, ["🌦️", "Ansehen"]);

// ---------- Wehendes Gras ----------
let halme = null; const halmDaten = [];
const MIT_GRAS = WELT.insel ? SAISON !== "winter" : !WINTERLICH && !["wueste"].includes(WELT.biom) && !(JAHRESZEIT_GRAS && SAISON === "winter");
const HALME = WELT.insel ? 700 : Math.min(900, Math.round(700 * (WELT.rand / 12.9) ** 2));
if (!EINFACH && MIT_GRAS) {
  const geo = new ConeGeometry(0.06, 0.45, 4); geo.translate(0, 0.22, 0);
  halme = new InstancedMesh(geo, mat(WELT.biom === "strand" ? "#7FC25A" : SAISON === "herbst" ? "#7FB24A" : "#5FB548"), HALME);
  const o = new Object3D();
  const HX = WELT.insel ? -5 : P.haus[0], HZ = WELT.insel ? -4.5 : P.haus[1], RW = WELT.insel ? 10.5 : WELT.rand - 2.4;
  for (let i = 0; i < HALME; i++) {
    const w = Math.random() * Math.PI * 2, r = 2 + Math.sqrt(Math.random()) * RW, x = Math.cos(w) * r, z = Math.sin(w) * r;
    if (Math.hypot(x - HX, z - HZ) < 2.6 || (WELT.see && Math.hypot(x - WELT.see.x, z - WELT.see.z) < WELT.see.r + 0.4)) { halmDaten.push({ x: 0, z: 0, p: 0, s: 0 }); o.scale.setScalar(0); o.updateMatrix(); halme.setMatrixAt(i, o.matrix); continue; }
    halmDaten.push({ x, z, y: bodenY(x, z), p: Math.random() * 6, s: 0.6 + Math.random() * 0.8 });
    o.position.set(x, bodenY(x, z), z); o.scale.setScalar(halmDaten[i].s); o.updateMatrix(); halme.setMatrixAt(i, o.matrix);
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
const ich = figur(look); ich.position.set(WELT.insel ? 1 : P.start[0] + 1, 0.25, WELT.insel ? 2 : P.start[1] + 2); ich.position.y = bodenY(ich.position.x, ich.position.z); scene.add(ich);

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
const NEST = new Vector3(P.nest[0], bodenY(P.nest[0], P.nest[1]), P.nest[1]);
{
  nest = new Group(); nest.position.copy(NEST); scene.add(nest); block(NEST.x, NEST.z, 0.6);
  const ring = teil(new TorusGeometry(0.45, 0.16, 10, 24), "#B98A55"); ring.rotation.x = Math.PI / 2; ring.position.y = 0.12; nest.add(ring);
  nest.add(setze(teil(new CylinderGeometry(0.45, 0.4, 0.12, 24), "#A47746", { umriss: false }), 0, 0.06, 0));
  if (tierDaten && tierDaten.phase === "tier" && T && T.ARTEN[tierDaten.art]) {
    const f = T.ARTEN[tierDaten.art].farben[tierDaten.farbe] || T.ARTEN[tierDaten.art].farben[0];
    tier = tierModell(tierDaten.art, f, TP.stufe ? TP.stufe(tierDaten) : 0);
    tier.position.set(P.tier[0], bodenY(P.tier[0], P.tier[1]), P.tier[1]); scene.add(tier);
    antippbar(tier, () => {
      herzen(tier.position);
      const ok = TP.streicheln ? TP.streicheln() : false;
      S.ton("juhu");
      $("info").textContent = `${tierDaten.name || "Dein Tier"} freut sich!` + (ok === false ? "" : "");
    }, null, 0); // läuft immer mit, darum nicht auf dem Aktionsknopf
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
// Biber Benno (Mathe): brauner Körper, cremefarbener Bauch und Schnauze, zwei große Zähne, flacher Gitter-Schwanz, gelber Helm
function biber() {
  const g = new Group(), B = "#A86A3D", H = "#F3DEC0", D2 = "#5C3A21";
  const k = new Group(); g.add(k);
  const sw = new Group(); sw.position.set(0, 0.2, -0.42); k.add(sw);
  const schwanz = teil(new CylinderGeometry(0.34, 0.34, 0.08, 20), "#6B4A3A"); schwanz.scale.set(0.75, 1, 1.25); setze(schwanz, 0, 0, -0.32); schwanz.rotation.x = 0.35; sw.add(schwanz);
  const leib = teil(kugel(0.5), B); leib.scale.set(1, 0.95, 0.9); setze(leib, 0, 0.45, 0); k.add(leib);
  const bauch = teil(kugel(0.3), H, { umriss: false }); bauch.scale.set(1, 1.05, 0.5); setze(bauch, 0, 0.4, 0.32); k.add(bauch);
  [-1, 1].forEach(s => { const f = teil(kugel(0.14), D2, { dicke: 1.1 }); f.scale.set(1.3, 0.6, 1.4); setze(f, 0.22 * s, 0.05, 0.26); k.add(f); });
  [-1, 1].forEach(s => { const a = teil(kugel(0.13), B); a.scale.set(0.8, 1.3, 0.8); setze(a, 0.42 * s, 0.55, 0.15); k.add(a); });
  const kopf = new Group(); kopf.position.y = 1.15; k.add(kopf);
  const schaedel = teil(kugel(0.5), B, { dicke: 1.04 }); schaedel.scale.set(1.08, 0.95, 0.95); kopf.add(schaedel);
  const schnauze = teil(kugel(0.28), H, { umriss: false }); schnauze.scale.set(1.2, 0.8, 0.7); setze(schnauze, 0, -0.14, 0.34); kopf.add(schnauze);
  [-1, 1].forEach(s => { const o = teil(kugel(0.13), B); o.scale.set(1, 1, 0.6); setze(o, 0.4 * s, 0.32, -0.05); kopf.add(o); });
  augen(kopf, 0.18, 0.06, 0.43, 0.07);
  const nase = new Mesh(kugel(0.08, 14, 10), AUGE); nase.scale.set(1.3, 0.9, 0.8); setze(nase, 0, -0.04, 0.6); kopf.add(nase);
  [-1, 1].forEach(s => { const z = new Mesh(new BoxGeometry(0.075, 0.12, 0.04), WEISS); setze(z, 0.042 * s, -0.27, 0.56); kopf.add(z); });
  // gelber Bauarbeiterhelm
  const helm = teil(new SphereGeometry(0.42, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2), "#FFC83D"); setze(helm, 0, 0.22, -0.02); kopf.add(helm);
  const krempe = teil(new CylinderGeometry(0.52, 0.52, 0.05, 24), "#FFB020"); setze(krempe, 0, 0.22, 0.02); kopf.add(krempe);
  g.userData.koerper = k; g.userData.schwanz = sw;
  return g;
}
// Bärin Bruni (Gefühle und Bewegung): hellbraun, rosa Schal, Laterne mit Herz
function baer() {
  const g = new Group(), B = "#C98E5A", H = "#F3DEC0";
  const k = new Group(); g.add(k);
  const leib = teil(kugel(0.55), B); leib.scale.set(1, 0.95, 0.9); setze(leib, 0, 0.5, 0); k.add(leib);
  const bauch = teil(kugel(0.32), H, { umriss: false }); bauch.scale.set(1, 1.05, 0.5); setze(bauch, 0, 0.45, 0.35); k.add(bauch);
  [-1, 1].forEach(s => { const f = teil(kugel(0.16), "#8A5A34", { dicke: 1.1 }); f.scale.set(1.3, 0.6, 1.4); setze(f, 0.24 * s, 0.06, 0.26); k.add(f); });
  [-1, 1].forEach(s => { const a = teil(kugel(0.15), B); a.scale.set(0.8, 1.3, 0.8); setze(a, 0.48 * s, 0.6, 0.12); k.add(a); });
  const schal = teil(new TorusGeometry(0.34, 0.09, 10, 24), "#FF9BC8"); schal.rotation.x = Math.PI / 2; setze(schal, 0, 0.92, 0.02); k.add(schal);
  const kopf = new Group(); kopf.position.y = 1.3; k.add(kopf);
  const schaedel = teil(kugel(0.5), B, { dicke: 1.04 }); kopf.add(schaedel);
  const schnauze = teil(kugel(0.24), H, { umriss: false }); schnauze.scale.set(1.15, 0.85, 0.7); setze(schnauze, 0, -0.12, 0.38); kopf.add(schnauze);
  [-1, 1].forEach(s => { const o = teil(kugel(0.17), B); o.scale.set(1, 1, 0.6); setze(o, 0.36 * s, 0.38, -0.02); kopf.add(o); const oi = new Mesh(kugel(0.09, 10, 8), mat("#E9A7A0")); setze(oi, 0.36 * s, 0.38, 0.06); kopf.add(oi); });
  augen(kopf, 0.17, 0.08, 0.44, 0.07);
  const nase = new Mesh(kugel(0.08, 14, 10), AUGE); nase.scale.set(1.3, 0.9, 0.8); setze(nase, 0, -0.05, 0.62); kopf.add(nase);
  // Laterne mit Herz
  const lat = new Group(); lat.position.set(0.62, 0.55, 0.25); k.add(lat);
  lat.add(setze(teil(new BoxGeometry(0.26, 0.32, 0.26), "#FFF1C2"), 0, 0, 0));
  lat.add(setze(new Mesh(kugel(0.07, 10, 8), new MeshBasicMaterial({ color: "#FF5C8A" })), 0, 0, 0.14));
  lat.add(setze(teil(new ConeGeometry(0.2, 0.14, 4), "#C2337A"), 0, 0.23, 0));
  g.userData.koerper = k;
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
  { bau: eule, x: P.eule[0], z: P.eule[1], dreh: P.eule[2], e: "eule", titel: "Eule Ella", text: `Hallo ${name}! Ich weiß spannende Dinge über die Welt. Kommst du mit?`, ru: "Привет! Я знаю много интересного о мире. Пойдёшь со мной?", ziel: "../sachkunde/" },
  { bau: fipsi, x: P.fipsi[0], z: P.fipsi[1], dreh: P.fipsi[2], e: "fipsi", titel: "Fipsi", text: `Hallo ${name}! Hilfst du mir, meine Schatzkarte zu finden?`, ru: "Привет! Поможешь мне найти мою карту сокровищ?", ziel: "../deutsch/" },
  // Robo Pixel wohnt vorerst nicht auf der Insel: Er begleitet den Tablet-Führerschein (Schlüssel zur Insel) und kommt später zurück.
  // { bau: robo, x: 5.5, z: 8.5, dreh: -2.6, e: "robo", titel: "Robo Pixel", text: `Piep! Hallo ${name}! Willst du ein Tablet-Profi werden?`, ru: "Пип! Привет! Хочешь стать мастером планшета?", ziel: "../medien/" },
  { bau: baer, x: P.baer[0], z: P.baer[1], dreh: P.baer[2], e: "baer", titel: "Bärin Bruni", text: `Hallo ${name}! Ich bin Bruni. Bei mir geht es um Gefühle – und ums Bewegen. Kommst du?`, ru: "Привет! Я медведица Бруни. У меня – про чувства и движение. Пойдёшь?", ziel: "../gefuehle/" },
  { bau: biber, x: P.biber[0], z: P.biber[1], dreh: P.biber[2], e: "biber", titel: "Biber Benno", text: `Hallo ${name}! Ich bin Benno. Ich baue Dämme und zähle jeden Stamm. Rechnest du mit mir auf dem Matheweg?`, ru: "Привет! Я бобр Бенно. Я строю плотины и считаю каждое бревно. Посчитаешь со мной на математической тропе?", ziel: "../mathe/" }
];
{ const t = tafel("Mathe", "#5CCBA6"), [x, z, d] = P.schild; t.position.set(x, bodenY(x, z), z); t.rotation.y = d; scene.add(t); block(x, z, 0.4); }

// Lernfunde des Tages: Wer heute etwas Neues im Fach gelernt hat, wird vom passenden Nachbarn begrüßt.
// Die Nachbarn hüpfen dann ab und zu, bis man mit ihnen gesprochen hat (shared/lernfunde.js).
const FACH = { eule: "sachkunde", fipsi: "deutsch", robo: "tablet", biber: "mathe" };
const FREUDE = {
  sachkunde: (f) => [`${name}, heute hast du etwas Neues entdeckt: ${f.t}. Ich bin stolz auf dich! Erzählst du es nachher deiner Familie?`, "Сегодня у тебя новое открытие! Расскажешь потом об этом своей семье?"],
  deutsch: (f) => [`Juhu, ${name}! Du kennst jetzt: ${f.t.replace(/^Neues Wort: /, "")}. Sag es einmal ganz laut!`, f.r ? `Ура! Теперь ты знаешь: ${f.r}. Скажи это вслух по-немецки!` : "Ура! Ты знаешь новые слова. Скажи их вслух!"],
  tablet: (f) => [`Piep! Neu in deinem Kopf: ${f.t}. Du wirst ein echter Tablet-Profi!`, "Пип! Ты узнаёшь всё больше о планшете!"],
  mathe: (f) => [`Super, ${name}! Das hast du heute geschafft: ${f.t.replace(/^Neu geschafft: /, "")}. Ich zähle mit dir weiter!`, "Супер! Сегодня у тебя получилось новое. Считаем дальше вместе!"]
};
NACHBARN.forEach(n => {
  const o = n.bau(); n.y = bodenY(n.x, n.z); o.position.set(n.x, n.y, n.z); o.rotation.y = n.dreh; if (n.e !== "🧮") o.scale.multiplyScalar(1.3); scene.add(o); block(n.x, n.z, 0.8);
  n.obj = o;
  const fach = FACH[n.e], fund = window.Lernfunde && fach ? window.Lernfunde.heuteFach(fach) : null;
  n.freut = !!fund && n.e !== "🧮";
  const aktion = fund ? ["🌱", n.e === "🧮" ? "Lesen" : "Reden"] : n.e === "🧮" ? ["🧮", "Lesen"] : ["💬", "Reden"];
  antippbar(o, () => {
    o.userData.huepf = 1; n.freut = false;
    if (fund) { const [de, ru] = FREUDE[fach](fund); sprechblase(n.e, `${n.titel} freut sich`, de, S.paar(["", ru])[1], n.ziel); }
    else sprechblase(n.e, n.titel, n.text, S.ht(n), n.ziel);
  }, aktion, 2.3);
});

// ---------- Wissensbaum ----------
// Wächst mit allen Lernfunden seit Beginn (shared/lernfunde.js), jeder Fund von heute hängt als leuchtende Frucht daran.
// Ohne Lernen passiert nichts Schlimmes: der Baum bleibt einfach, wie er ist (kein Welken, keine Strafe).
const WB = new Vector3(P.wissensbaum[0], bodenY(P.wissensbaum[0], P.wissensbaum[1]), P.wissensbaum[1]);
const FRUCHT = { mathe: "#2FA37C", deutsch: "#E0574A", sachkunde: "#1F8F8A", tablet: "#2F86C8", welt: "#8BC34A" };
const wissen = (() => {
  const L = window.Lernfunde; if (!L) return null;
  const info = L.baum(), funde = L.heute();
  const g = new Group(); g.position.copy(WB); scene.add(g);
  const k = [0.35, 0.5, 0.62, 0.75, 0.88, 1.0, 1.12][info.stufe];
  const krone = SAISON === "herbst" ? ["#8BD06A", "#6FBF68"] : SAISON === "winter" ? ["#5FB07A", "#5FB07A"] : ["#7FD67A", "#62C46E"];
  if (info.stufe === 0) {
    // Spross: zwei Blätter und ein kleiner Erdhügel
    g.add(setze(teil(kugel(0.35, 16, 10), "#9A6A3F"), 0, -0.15, 0));
    g.add(setze(teil(new CylinderGeometry(0.03, 0.04, 0.45, 8), "#3E9E55"), 0, 0.22, 0));
    [-1, 1].forEach(sx => { const b = teil(kugel(0.16, 12, 8), "#62C46E"); b.scale.set(1.4, 0.4, 0.8); b.rotation.z = sx * 0.5; g.add(setze(b, sx * 0.16, 0.45, 0)); });
  } else {
    g.add(setze(teil(new CylinderGeometry(0.18 * k, 0.28 * k, 1.5 * k, 14), "#A27449"), 0, 0.75 * k, 0));
    [[0, 2.15, 0, 1.0], [0.7, 1.8, 0.2, 0.7], [-0.65, 1.85, -0.1, 0.72], [0.05, 1.8, 0.7, 0.65], [0, 2.8, 0, 0.62]].slice(0, 2 + Math.min(3, info.stufe))
      .forEach(([dx, y, dz, r], i) => g.add(setze(teil(kugel(r * k), krone[i % 2]), dx * k, y * k, dz * k)));
    if (SAISON === "winter") g.add(setze(teil(kugel(0.5 * k), "#FFFFFF"), 0, 3.1 * k, 0));
    // Jahreszeiten am Wissensbaum: Blüten im Frühling, bunte Blätter im Herbst, Lichterkette im Dezember
    const aussen = (i, n, r0) => { const a = i * 2.399, y = 1.75 + (i % n) / n * 1.2, rr = r0 * Math.sqrt(Math.max(0.15, 1 - ((y - 2.15) / 1.1) ** 2)); return [Math.cos(a) * rr * k, y * k, Math.sin(a) * rr * k]; };
    if (SAISON === "fruehling") for (let i = 0; i < 14; i++) { const [x, y, zz] = aussen(i, 14, 1.02); g.add(setze(new Mesh(kugel(0.09, 8, 6), new MeshBasicMaterial({ color: i % 3 ? "#FFC4DC" : "#FFFFFF" })), x, y, zz)); }
    if (SAISON === "herbst") for (let i = 0; i < 9; i++) { const a = i * 2.1, r = 0.6 + (i % 3) * 0.35; const bl = new Mesh(new CircleGeometry(0.12, 6), mat(["#F2A03D", "#E2603A", "#F4C542"][i % 3])); bl.rotation.x = -Math.PI / 2; bl.position.set(Math.cos(a) * r, 0.03, Math.sin(a) * r); g.add(bl); }
    if (MONAT === 12) for (let i = 0; i < 26; i++) { const [x, y, zz] = aussen(i, 26, 1.06); const l = new Mesh(kugel(0.1, 8, 6), new MeshBasicMaterial({ color: ["#FFD84D", "#FF6F61", "#5EC3E6", "#5CCBA6"][i % 4] })); setze(l, x, y, zz); l.userData.licht = i; g.add(l); }
  }
  // Schild am Fuß
  const schild = new Group(); schild.position.set(0.75, 0, 0.5); schild.rotation.y = -0.4; g.add(schild);
  schild.add(setze(teil(new CylinderGeometry(0.04, 0.04, 0.7, 6), "#9A6A3F"), 0, 0.35, 0));
  schild.add(setze(teil(new BoxGeometry(0.55, 0.3, 0.05), "#FFF1D6"), 0, 0.68, 0));
  block(WB.x, WB.z, info.stufe ? 0.45 * k + 0.2 : 0.4);
  // Früchte von heute (gemeistert = golden), mit Ploppen beim Erscheinen
  // Richtungen vom Kronen-Mittelpunkt aus, Früchte sitzen knapp außen auf der Krone (vorne zuerst)
  const PL = [[0.6, -0.1, 0.8], [-0.6, 0.15, 0.8], [0.1, 0.65, 0.75], [0.9, 0.25, -0.3], [-0.85, -0.05, -0.4]].map(v => new Vector3(...v).normalize());
  const fruechte = funde.slice(0, PL.length).map((f, i) => {
    const farbe = f.x ? "#FF5C8A" : f.a === "gemeistert" ? "#FFC83D" : FRUCHT[f.f] || "#FF7A6B";   // einem Erwachsenen erklärt: rosa Herzfrucht
    const m = new Mesh(kugel(0.2, 14, 10), new MeshBasicMaterial({ color: farbe }));
    const v = PL[i], r = 1.0 * k + 0.06; setze(m, v.x * r, 2.15 * k + v.y * r, v.z * r); m.scale.setScalar(0.001); m.userData.verz = 0.6 + i * 0.35; g.add(m);
    return m;
  });
  const text = () => {
    const b = L.baum(), h = L.heute();
    const de = b.summe === 0 ? "Hier wächst dein Wissensbaum. Mit allem, was du Neues lernst, wird er größer!"
      : `Schon ${b.summe} ${b.summe === 1 ? "Ding" : "Dinge"} gelernt!` + (h.length ? ` Heute ${h.length === 1 ? "hängt eine neue Frucht" : `hängen ${h.length} neue Früchte`} dran: ${h.slice(-2).map(x => x.t.replace(/^Neues Wort: /, "")).join(" · ")}`
        : " Heute ist noch keine Frucht dazugekommen. Lern etwas Neues, dann wächst eine!") + (b.naechste ? ` Noch ${b.naechste - b.summe} bis der Baum wieder wächst.` : "");
    const ru = b.summe === 0 ? "Здесь растёт твоё дерево знаний. Чем больше ты узнаёшь, тем больше оно становится!" : `Ты уже узнаёшь так много: ${b.summe}! Каждая новая вещь — новый плод.`;
    return [de, ru];
  };
  antippbar(g, () => { const [de, ru] = text(); sprechblase("🌳", "Dein Wissensbaum", de, S.paar(["", ru])[1], "../ich/"); }, ["🌳", "Ansehen"], 2.2);
  return {
    info, fruechte,
    tick(t) {
      if (MONAT === 12) g.children.forEach(c => { if (c.userData.licht !== undefined) c.visible = Math.sin(t * 2.5 + c.userData.licht * 1.3) > -0.4; });
      fruechte.forEach((m, i) => {
        const z = MathUtils.clamp((t - m.userData.verz) * 3, 0, 1), plopp = z < 1 ? z * (1 + Math.sin(z * Math.PI) * 0.5) : 1;
        m.scale.setScalar(Math.max(0.001, plopp * (1 + Math.sin(t * 2.5 + i) * 0.06)));
      });
    }
  };
})();
if (wissen && wissen.info.gewachsen) {
  setTimeout(() => { $("info").textContent = "🌳 Dein Wissensbaum ist gewachsen!"; S.ton && S.ton("juhu"); }, 1200);
  window.Lernfunde.baumGesehen();
}

// ---------- Orte für Minispiele ----------
const ballons = new Group(); ballons.position.set(P.ballons[0], bodenY(P.ballons[0], P.ballons[1]), P.ballons[1]); scene.add(ballons); block(P.ballons[0], P.ballons[1], 0.6);
["#FF6F91", "#FFD84D", "#5CCBA6", "#7B9BFF", "#C27BFF"].forEach((c, i) => {
  const b = new Group(), a = i / 5 * Math.PI * 2;
  const ball = teil(kugel(0.34), c); ball.scale.y = 1.15; b.add(setze(ball, 0, 0, 0));
  b.add(setze(new Mesh(new CylinderGeometry(0.008, 0.008, 1.6, 4), mat("#ffffff")), 0, -1.1, 0));
  b.position.set(Math.cos(a) * 0.45, 2.3 + (i % 2) * 0.35, Math.sin(a) * 0.45); b.userData.p = i; ballons.add(b);
});
ballons.add(setze(teil(new CylinderGeometry(0.12, 0.16, 0.5, 12), "#9A6A3F"), 0, 0.25, 0));
const fuehrerscheinFehlt = () => sprechblase("🪪", "Noch gesperrt", "Mach zuerst den Tablet-Führerschein bei Robo Pixel. Dann darfst du hier spielen!", S.paar(["", "Сначала получи права на планшет у Робо Пикселя."])[1], "../medien/");
antippbar(ballons, () => spielOrt(() => profi() ? sprechblase("🎈", "Ballon-Wiese", "Lass so viele Ballons platzen, wie du kannst!", S.paar(["", "Лопни как можно больше шариков!"])[1], "ballons.html") : fuehrerscheinFehlt()), ["🎈", "Spielen"]);
const truhe = new Group(); truhe.position.set(P.truhe[0], WELT.insel ? 0.05 : bodenY(P.truhe[0], P.truhe[1]) - 0.15, P.truhe[1]); truhe.rotation.y = WELT.insel ? 0 : Math.atan2(-P.truhe[0], -P.truhe[1]); scene.add(truhe);
truhe.add(setze(teil(new BoxGeometry(0.9, 0.5, 0.6), "#B9732E"), 0, 0.25, 0));
const deckel = teil(new CylinderGeometry(0.3, 0.3, 0.9, 16, 1, false, 0, Math.PI), "#C98A3E"); deckel.rotation.z = Math.PI / 2; setze(deckel, 0, 0.5, 0); truhe.add(deckel);
truhe.add(setze(teil(new BoxGeometry(0.16, 0.2, 0.05), "#FFC83D", { dicke: 1.1 }), 0, 0.45, 0.32));
antippbar(truhe, () => spielOrt(() => profi() ? sprechblase("🏝️", "Schatz-Strand", "Auf der Schatzinsel wartet eine Truhe. Findest du sie?", S.paar(["", "На острове сокровищ ждёт сундук. Найдёшь его?"])[1], "insel.html") : fuehrerscheinFehlt()), ["🔓", "Öffnen"]);

// ---------- Neue Minispiel-Orte: öffnen sich, wenn der Wissensbaum wächst ----------
function schildSprite(text) {
  const c = document.createElement("canvas"); c.width = c.height = 128; const g2 = c.getContext("2d");
  g2.fillStyle = "rgba(255,255,255,.92)"; g2.beginPath(); g2.arc(64, 64, 56, 0, Math.PI * 2); g2.fill();
  g2.font = "64px sans-serif"; g2.textAlign = "center"; g2.textBaseline = "middle"; g2.fillText(text, 64, 70);
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace;
  const sp = new Sprite(new SpriteMaterial({ map: t, depthTest: false })); sp.scale.set(0.9, 0.9, 1); return sp;
}
const ORT_BAU = {
  lauf() { // Startbogen mit Stern
    const g = new Group();
    [-1, 1].forEach(s => g.add(setze(teil(new CylinderGeometry(0.12, 0.14, 2.2, 10), "#E0574A"), s * 1.1, 1.1, 0)));
    g.add(setze(teil(new BoxGeometry(2.6, 0.5, 0.12), "#FFFFFF"), 0, 2.15, 0));
    [-0.9, -0.3, 0.3, 0.9].forEach((x, i) => g.add(setze(new Mesh(new BoxGeometry(0.3, 0.25, 0.14), mat(i % 2 ? "#2E2240" : "#FFFFFF")), x, 2.27, 0)));
    g.add(setze(teil(kugel(0.28, 14, 10), "#FFD24D"), 0, 2.75, 0));
    return g;
  },
  kart() { // kleines Kart mit Zielflagge
    const g = new Group(), k = new Group(); g.add(k); k.rotation.y = 0.6;
    k.add(setze(teil(new BoxGeometry(1.0, 0.3, 1.6), "#3AA0E0"), 0, 0.42, 0));
    k.add(setze(teil(new BoxGeometry(0.6, 0.35, 0.5), "#FFC83D"), 0, 0.7, -0.15));
    [[-0.55, 0.55], [0.55, 0.55], [-0.55, -0.55], [0.55, -0.55]].forEach(([x, z]) => { const r = teil(new CylinderGeometry(0.25, 0.25, 0.22, 14), "#2E2240"); r.rotation.z = Math.PI / 2; setze(r, x, 0.27, z); k.add(r); });
    g.add(setze(teil(new CylinderGeometry(0.05, 0.05, 2, 8), "#8A5A34"), 1.1, 1, -0.6));
    for (let a = 0; a < 3; a++) for (let b = 0; b < 2; b++) g.add(setze(new Mesh(new BoxGeometry(0.22, 0.22, 0.04), mat((a + b) % 2 ? "#2E2240" : "#FFFFFF")), 1.25 + a * 0.22, 1.85 - b * 0.22, -0.6));
    return g;
  },
  bau() { // bunte Bausteine
    const g = new Group(), F = ["#E0574A", "#3AA0E0", "#FFC83D", "#5CCBA6", "#B28DFF"];
    [[0, 0, 0], [0.62, 0, 0], [-0.62, 0, 0], [0.31, 0.5, 0], [-0.31, 0.5, 0], [0, 1.0, 0], [0.4, 0, 0.62], [-0.3, 0, -0.62]].forEach(([x, y, z], i) => g.add(setze(teil(new BoxGeometry(0.58, 0.48, 0.58), F[i % F.length]), x, 0.25 + y, z)));
    return g;
  }
};
const BALD = new Set([]);   // Spiele, die noch entstehen
const ORT_TEXT = {
  lauf: ["Der Sternenlauf", "Lauf so schnell du kannst und sammle Sterne! Wische, um auszuweichen.", "Беги и собирай звёзды!", "lauf.html"],
  kart: ["Die Kart-Bahn", "Fahr ein Rennen mit deinem Kart!", "Гонка на карте!", "kart.html"],
  bau: ["Der Bauplatz", "Bau mit bunten Steinen, was du willst!", "Строй из цветных кубиков что хочешь!", "bau.html"]
};
["lauf", "kart", "bau"].forEach(id => {
  const [x, z] = P[id], o = ORT_BAU[id](); o.position.set(x, bodenY(x, z), z); o.rotation.y = Math.atan2(-x, -z); scene.add(o); block(x, z, 1.2);
  const frei = istFrei(id), info = SPIELE[id];
  if (!frei) { const sp = schildSprite("🔒"); sp.position.set(0, 3.2, 0); o.add(sp); o.traverse(m => { if (m.material && m.material.color && !m.isSprite) { m.material = m.material.clone(); m.material.color.lerp(new Color("#B9B4C6"), 0.55); } }); }
  const [titel, de, ru, ziel] = ORT_TEXT[id];
  antippbar(o, () => {
    if (!frei) {
      const brauch = window.Lernfunde ? window.Lernfunde.STUFEN[info.stufe - 1] : 0, hat = window.Lernfunde ? window.Lernfunde.gesamt() : 0;
      sprechblase("🌳", `${info.e} ${info.name} – noch zu`, `Dieser Ort öffnet sich, wenn dein Wissensbaum wächst. Noch ${Math.max(1, brauch - hat)} ${brauch - hat === 1 ? "Lernfund" : "Lernfunde"} – lern etwas Neues bei Ella, Fipsi oder Benno!`,
        S.paar(["", "Это место откроется, когда вырастет твоё дерево знаний. Узнай что-нибудь новое!"])[1], null);
      return;
    }
    if (BALD.has(id)) { sprechblase("🚧", titel, "Hier wird noch gebaut! Bald kannst du hier spielen.", S.paar(["", "Здесь ещё строят! Скоро можно будет играть."])[1], null); return; }
    spielOrt(() => sprechblase(info.e, titel, de, S.paar(["", ru])[1], ziel));
  }, frei ? [info.e, "Spielen"] : ["🔒", "Ansehen"], 2.4);
});


// ---------- Zimmer im Haus (eigener Bereich weit weg von der Insel) ----------
const ZX = 60; // Mitte des Zimmers
let drinnen = false;
const zimmer = new Group(); zimmer.position.set(ZX, 0, 0); scene.add(zimmer);
const WAND_HINTEN = new MeshToonMaterial({ color: "#FFD9E6", gradientMap: verlauf }), WAND_SEITE = new MeshToonMaterial({ color: "#FFE9C2", gradientMap: verlauf });
{
  const boden = new Mesh(new BoxGeometry(8.4, 0.3, 7.4), mat("#E2B47E")); boden.position.y = 0.1; boden.receiveShadow = true; zimmer.add(boden);
  for (let i = -3; i <= 3; i++) zimmer.add(setze(new Mesh(new BoxGeometry(0.04, 0.02, 7.4), mat("#C9955E")), i * 1.2, 0.26, 0));
  const wand = (b, h, t, x, z, m) => { const w = new Mesh(new BoxGeometry(b, h, t), m); w.position.set(x, h / 2 + 0.25, z); w.receiveShadow = true; zimmer.add(w); return w; };
  wand(8.4, 3.2, 0.25, 0, -3.7, WAND_HINTEN); wand(0.25, 3.2, 7.4, -4.2, 0, WAND_SEITE); wand(0.25, 3.2, 7.4, 4.2, 0, WAND_SEITE);
  zimmer.add(setze(teil(new BoxGeometry(1.8, 1.2, 0.08), fensterMat, { dicke: 1.04 }), 0, 2.1, -3.55));
  zimmer.add(setze(new Mesh(new BoxGeometry(0.08, 1.2, 0.1), mat("#FFFFFF")), 0, 2.1, -3.5));
  const teppich = new Mesh(new CylinderGeometry(1.6, 1.6, 0.04, 40), mat("#B7A4F2")); teppich.position.set(0, 0.27, 0.6); teppich.receiveShadow = true; zimmer.add(teppich);
  // Bett
  const bett = new Group(); bett.position.set(-2.9, 0.25, -2.2); zimmer.add(bett);
  bett.add(setze(teil(new BoxGeometry(1.8, 0.5, 2.6), "#9A6A3F", { dicke: 1.03 }), 0, 0.25, 0));
  bett.add(setze(teil(new BoxGeometry(1.7, 0.2, 1.8), "#7FC6F5", { dicke: 1.03 }), 0, 0.6, 0.35));
  const kissen = teil(kugel(0.4), "#FFFFFF"); kissen.scale.set(1.6, 0.5, 0.9); bett.add(setze(kissen, 0, 0.65, -0.85));
  block(ZX - 2.9, -2.2, 1.4);
  // Stickeralbum liegt auf dem Bett
  const album = new Group(); album.position.set(0.25, 0.76, 0.75); album.rotation.y = 0.4; bett.add(album);
  album.add(setze(teil(new BoxGeometry(0.62, 0.1, 0.48), "#E0457B", { dicke: 1.05 }), 0, 0, 0));
  album.add(setze(new Mesh(new BoxGeometry(0.56, 0.11, 0.42), mat("#FFF6E8")), 0.02, 0, 0));
  album.add(setze(new Mesh(kugel(0.07, 10, 8), mat("#FFD84D")), 0.05, 0.07, 0.02));
  antippbar(album, () => { const s = window.Sticker && window.Sticker.stand(); sprechblase("📒", "Dein Stickeralbum", s ? `Du hast schon ${s.hat} von ${s.gesamt} Stickern${s.neu ? ` – ${s.neu} neue warten auf dich` : ""}!` : "Hier sammelst du deine Sticker.", S.paar(["", "Здесь ты собираешь наклейки."])[1], "../album/?von=insel"); }, ["📒", "Album"], 1.6);
  antippbar(bett, () => sprechblase("🛏️", "Dein Bett", tier ? `Hier kuschelt ${tierDaten.name || "dein Tier"}, wenn es müde ist.` : "Ein gemütliches Bett. Mit dem Knopf „Einrichten“ machst du dein Zimmer schön.", S.paar(["", "Уютная кровать."])[1], null), ["🛏️", "Ansehen"], 2.2);
  // Kleiderschrank
  const schrank = new Group(); schrank.position.set(2.8, 0.25, -3.0); zimmer.add(schrank);
  schrank.add(setze(teil(new BoxGeometry(2.0, 2.6, 0.9), "#C2337A", { dicke: 1.03 }), 0, 1.3, 0));
  [-0.48, 0.48].forEach(x => { schrank.add(setze(teil(new BoxGeometry(0.9, 2.3, 0.06), "#E0579A", { dicke: 1.02 }), x, 1.3, 0.47)); schrank.add(setze(teil(kugel(0.07), "#FFC83D", { dicke: 1.15 }), x * 0.25, 1.35, 0.53)); });
  schrank.add(setze(teil(new BoxGeometry(0.5, 0.3, 0.05), "#FFFFFF", { dicke: 1.08 }), 0, 2.35, 0.52));
  block(ZX + 2.8, -3.0, 1.2);
  antippbar(schrank, () => sprechblase("👗", "Dein Kleiderschrank", "Such dir etwas Schönes zum Anziehen aus. Auf der Insel trägst du es dann!", S.paar(["", "Выбери что-нибудь красивое из одежды!"])[1], "../anziehen/?von=insel"), ["🚪", "Öffnen"], 2.0);
  // Spiegel
  const spiegel = new Group(); spiegel.position.set(-4.05, 1.7, 1.0); spiegel.rotation.y = Math.PI / 2; zimmer.add(spiegel);
  const rahmen = teil(new TorusGeometry(0.55, 0.08, 10, 30), "#FFC83D"); rahmen.scale.y = 1.4; spiegel.add(rahmen);
  const glas = new Mesh(new CircleGeometry(0.52, 30), new MeshBasicMaterial({ color: "#CFEFFF" })); glas.scale.y = 1.4; glas.position.z = 0.02; spiegel.add(glas);
  antippbar(spiegel, () => sprechblase("🪞", "Der Spiegel", "Schau, wie du gewachsen bist: deine Fähigkeiten, Aufgaben und Abzeichen.", S.paar(["", "Посмотри, как ты выросла!"])[1], "../ich/"), ["🪞", "Reinschauen"], 1.6);
  // Pinnwand: Lernfunde der letzten 7 Tage als Zettel (heute mit Glanz), Antippen zeigt die Liste
  {
    const L = window.Lernfunde, funde = L ? L.letzteTage(7) : [], heute = L ? L.heute().length : 0;
    const FARBE = { mathe: "#CFF3E4", deutsch: "#FFE1DD", sachkunde: "#D6F1EF", tablet: "#DCEBFA" };
    const c = document.createElement("canvas"); c.width = 512; c.height = 320; const g2 = c.getContext("2d");
    g2.fillStyle = "#C98F55"; g2.fillRect(0, 0, 512, 320);
    for (let i = 0; i < 260; i++) { g2.fillStyle = i % 2 ? "rgba(120,70,30,.18)" : "rgba(255,230,190,.18)"; g2.fillRect((i * 97) % 512, (i * 53) % 320, 4, 3); }
    g2.fillStyle = "#4B2380"; g2.font = "bold 34px Fredoka, sans-serif"; g2.textAlign = "center"; g2.fillText("Das habe ich gelernt", 256, 44);
    const zettel = funde.slice(0, 8);
    if (!zettel.length) zettel.push({ e: "🌱", f: "", leer: true });
    zettel.forEach((f, i) => {
      const x = 22 + (i % 4) * 122, y = 70 + Math.floor(i / 4) * 120, neu = i < heute;
      g2.save(); g2.translate(x + 50, y + 50); g2.rotate(((i * 37) % 9 - 4) * 0.025);
      g2.fillStyle = "rgba(0,0,0,.18)"; g2.fillRect(-46, -42, 100, 100);
      g2.fillStyle = f.a === "gemeistert" ? "#FFE7A3" : FARBE[f.f] || "#FFF6E0"; g2.fillRect(-50, -46, 100, 100);
      if (neu) { g2.strokeStyle = "#FFC83D"; g2.lineWidth = 6; g2.strokeRect(-50, -46, 100, 100); }
      g2.font = "54px sans-serif"; g2.textAlign = "center"; g2.textBaseline = "middle"; g2.fillText(f.e || "⭐", 0, 8);
      g2.fillStyle = "#E0457B"; g2.beginPath(); g2.arc(0, -36, 7, 0, Math.PI * 2); g2.fill();
      g2.restore();
    });
    const tex = new CanvasTexture(c); tex.colorSpace = SRGBColorSpace;
    const wand = new Group(); wand.position.set(4.06, 1.95, 0.9); wand.rotation.y = -Math.PI / 2; zimmer.add(wand);
    wand.add(teil(new BoxGeometry(1.72, 1.1, 0.06), "#8A5A34", { dicke: 1.03 }));
    wand.add(setze(new Mesh(new PlaneGeometry(1.6, 1.0), new MeshBasicMaterial({ map: tex })), 0, 0, 0.035));
    const liste = () => {
      if (!funde.length) return ["Hier hängst du auf, was du diese Woche Neues lernst. Jeder Lernfund bekommt einen Zettel!", "Здесь висит всё новое, что ты узнаёшь за неделю."];
      const de = `Diese Woche ${funde.length === 1 ? "1 Zettel" : `${funde.length} Zettel`}${heute ? `, ${heute} von heute (golden umrandet)` : ""}: ` +
        funde.slice(0, 4).map(f => f.t.replace(/^Neues Wort: /, "").replace(/ – (war|jetzt).*$/, "")).join(" · ") + (funde.length > 4 ? " …" : "");
      return [de, `На этой неделе ты узнаёшь много нового: ${funde.length}!`];
    };
    antippbar(wand, () => { const [de, ru] = liste(); sprechblase("📌", "Deine Pinnwand", de, S.paar(["", ru])[1], "../ich/"); }, ["📌", "Ansehen"], 1.9);
  }
  // Pflanze und Lampe
  const topf = new Group(); topf.position.set(3.4, 0.25, 2.4); zimmer.add(topf);
  topf.add(setze(teil(new CylinderGeometry(0.3, 0.22, 0.45, 16), "#E2604F"), 0, 0.22, 0));
  [[0, 0.75, 0, 0.35], [0.2, 0.95, 0.1, 0.25], [-0.18, 0.9, -0.05, 0.25]].forEach(([x, y, z, r]) => topf.add(setze(teil(kugel(r), "#5DBB5A"), x, y, z)));
  block(ZX + 3.4, 2.4, 0.5);
}
// ---------- Zimmer einrichten: Möbel mit Sternen kaufen und auf Plätze stellen ----------
const PLAETZE = [
  { id: "fenster", name: "am Fenster", x: -0.2, z: -3.0 },
  { id: "bett", name: "neben dem Bett", x: -1.5, z: -3.0 },
  { id: "links", name: "an der linken Wand", x: -3.5, z: 0.0 },
  { id: "vornlinks", name: "vorne links", x: -3.4, z: 2.5 },
  { id: "rechts", name: "an der rechten Wand", x: 3.5, z: -1.0 },
  { id: "mitterechts", name: "rechts beim Teppich", x: 2.2, z: 0.9 }
];
const holz = "#B07A48";
const MOEBEL = [
  { id: "lampe", name: "Stehlampe", e: "💡", preis: 4, text: "Sie macht dein Zimmer gemütlich.", bau() { const g = new Group(); g.add(setze(teil(new CylinderGeometry(0.28, 0.32, 0.08, 18), "#6B6B7A"), 0, 0.04, 0)); g.add(setze(teil(new CylinderGeometry(0.04, 0.04, 1.6, 8), "#6B6B7A"), 0, 0.84, 0)); g.add(setze(teil(new CylinderGeometry(0.22, 0.38, 0.45, 18, 1, true), "#FFD84D"), 0, 1.75, 0)); g.add(setze(new Mesh(kugel(0.12, 10, 8), new MeshBasicMaterial({ color: "#FFF4C2" })), 0, 1.65, 0)); return g; } },
  { id: "baer", name: "Kuschelbär", e: "🧸", preis: 4, text: "Er passt auf dein Zimmer auf.", bau() { const g = new Group(), f = "#C98A50"; const k = teil(kugel(0.32), f); k.scale.y = 1.1; g.add(setze(k, 0, 0.35, 0)); g.add(setze(teil(kugel(0.24), f), 0, 0.85, 0)); [-1, 1].forEach(sx => { g.add(setze(teil(kugel(0.09), f), sx * 0.17, 1.05, 0)); g.add(setze(teil(kugel(0.1), f), sx * 0.3, 0.42, 0.1)); g.add(setze(teil(kugel(0.11), f), sx * 0.17, 0.1, 0.15)); }); g.add(setze(teil(kugel(0.09), "#F2D2A8", { umriss: false }), 0, 0.8, 0.2)); augen(g, 0.08, 0.9, 0.21, 0.035); return g; } },
  { id: "sitzsack", name: "Sitzsack", e: "🫘", preis: 5, text: "Perfekt zum Lesen und Ausruhen.", bau() { const g = new Group(); const s1 = teil(kugel(0.6), "#5CCBA6"); s1.scale.set(1, 0.6, 1); g.add(setze(s1, 0, 0.35, 0)); const s2 = teil(kugel(0.4), "#5CCBA6"); s2.scale.set(1.1, 0.9, 0.6); g.add(setze(s2, 0, 0.7, -0.3)); return g; } },
  { id: "kiste", name: "Spielzeugkiste", e: "🧩", preis: 5, text: "Darin ist Platz für alle Spielsachen.", bau() { const g = new Group(); g.add(setze(teil(new BoxGeometry(1.0, 0.6, 0.6), "#7B9BFF"), 0, 0.3, 0)); g.add(setze(teil(kugel(0.14), "#FF6F91"), -0.25, 0.68, 0)); g.add(setze(teil(new BoxGeometry(0.22, 0.22, 0.22), "#FFD84D"), 0.1, 0.68, 0.05)); g.add(setze(teil(new ConeGeometry(0.12, 0.3, 4), "#5CCBA6"), 0.33, 0.72, -0.05)); return g; } },
  { id: "korb", name: "Tierkörbchen", e: "🧺", preis: 6, text: "Ein weiches Bett für dein Tier.", bau() { const g = new Group(); g.add(setze(teil(new CylinderGeometry(0.55, 0.45, 0.3, 24), "#D9A066"), 0, 0.15, 0)); g.add(setze(new Mesh(new CylinderGeometry(0.47, 0.47, 0.06, 24), mat("#FF9EC4")), 0, 0.3, 0)); g.add(setze(teil(new TorusGeometry(0.5, 0.08, 8, 24), "#C88A50"), 0, 0.3, 0).rotateX(Math.PI / 2)); return g; } },
  { id: "globus", name: "Globus", e: "🌍", preis: 7, text: "Die ganze Welt in deinem Zimmer. Ella liebt ihn!", bau() { const g = new Group(); g.add(setze(teil(new CylinderGeometry(0.4, 0.45, 0.6, 16), holz), 0, 0.3, 0)); g.add(setze(teil(new CylinderGeometry(0.03, 0.03, 0.3, 6), "#FFC83D"), 0, 0.75, 0)); const k = teil(kugel(0.32), "#5EC3E6"); setze(k, 0, 1.15, 0); k.rotation.z = 0.4; [[0.15, 0.1, 0.2], [-0.2, -0.05, 0.15], [0.05, 0.2, -0.22]].forEach(([x, y, z]) => k.add(setze(new Mesh(kugel(0.13, 10, 8), mat("#7CCB5B")), x, y, z))); g.add(k); g.userData.dreh = k; return g; } },
  { id: "regal", name: "Bücherregal", e: "📚", preis: 8, text: "Hier wohnen deine Lieblingsbücher.", bau() { const g = new Group(); g.add(setze(teil(new BoxGeometry(1.3, 1.9, 0.45), holz, { dicke: 1.03 }), 0, 0.95, 0)); [0.5, 1.1, 1.65].forEach((y, j) => { let x = -0.5; ["#E0574A", "#5CCBA6", "#7B9BFF", "#FFD84D", "#C27BFF"].forEach((c, i) => { if ((i + j) % 4 === 3) { x += 0.2; return; } const b = new Mesh(new BoxGeometry(0.14, 0.4 - (i % 2) * 0.06, 0.32), mat(c)); b.position.set(x, y - 0.1 + 0.05, 0.1); x += 0.19; g.add(b); }); }); return g; } },
  { id: "staffelei", name: "Mal-Staffelei", e: "🎨", preis: 9, text: "Für große Künstlerinnen und Künstler.", bau() { const g = new Group(); [[-0.3, 0.12], [0.3, -0.12]].forEach(([x, rz]) => { const b = teil(new BoxGeometry(0.06, 1.7, 0.06), holz); b.rotation.z = rz; g.add(setze(b, x, 0.85, 0)); }); const h = teil(new BoxGeometry(0.06, 1.6, 0.06), holz); h.rotation.x = -0.3; g.add(setze(h, 0, 0.8, -0.25)); g.add(setze(teil(new BoxGeometry(0.9, 0.7, 0.04), "#FFFFFF"), 0, 1.15, 0.06)); [["#FF6F91", -0.2, 1.25], ["#FFD84D", 0.15, 1.1], ["#5CCBA6", 0, 0.98]].forEach(([c, x, y]) => { const f = new Mesh(kugel(0.1, 10, 8), mat(c)); f.scale.set(1, 1, 0.2); g.add(setze(f, x, y, 0.09)); }); return g; } },
  { id: "tisch", name: "Schreibtisch", e: "✏️", preis: 10, text: "Hier kannst du malen und schreiben.", bau() { const g = new Group(); g.add(setze(teil(new BoxGeometry(1.4, 0.08, 0.75), holz), 0, 0.8, 0)); [[-0.6, -0.3], [0.6, -0.3], [-0.6, 0.3], [0.6, 0.3]].forEach(([x, z]) => g.add(setze(teil(new BoxGeometry(0.08, 0.8, 0.08), holz), x, 0.4, z))); g.add(setze(teil(new BoxGeometry(0.4, 0.04, 0.3), "#FFFFFF"), -0.2, 0.86, 0.05)); g.add(setze(teil(new CylinderGeometry(0.08, 0.08, 0.22, 10), "#E0574A"), 0.45, 0.95, -0.15)); const st = new Group(); st.add(setze(teil(new BoxGeometry(0.5, 0.06, 0.5), "#7B9BFF"), 0, 0.5, 0)); st.add(setze(teil(new BoxGeometry(0.5, 0.5, 0.06), "#7B9BFF"), 0, 0.78, 0.24)); [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].forEach(([x, z]) => st.add(setze(new Mesh(new BoxGeometry(0.05, 0.5, 0.05), mat("#6B6B7A")), x, 0.25, z))); st.position.z = 0.7; g.add(st); return g; } },
  { id: "aquarium", name: "Aquarium", e: "🐠", preis: 12, text: "Blub, blub! Die Fische winken dir zu.", bau() { const g = new Group(); g.add(setze(teil(new BoxGeometry(1.2, 0.7, 0.6), holz), 0, 0.35, 0)); g.add(setze(new Mesh(new BoxGeometry(1.1, 0.7, 0.5), new MeshToonMaterial({ color: "#7FD3F0", gradientMap: verlauf, transparent: true, opacity: 0.6 })), 0, 1.05, 0)); g.add(setze(new Mesh(new BoxGeometry(1.1, 0.1, 0.5), mat("#F2D9A2")), 0, 0.75, 0)); const fische = new Group(); ["#FF9E5E", "#FFD84D"].forEach((c, i) => { const f = new Mesh(kugel(0.09, 10, 8), mat(c)); f.scale.set(1.5, 1, 0.6); f.position.set(i ? 0.2 : -0.2, 1.0 + i * 0.15, 0); f.add(setze(new Mesh(new ConeGeometry(0.06, 0.12, 4), mat(c)), -0.12, 0, 0).rotateZ(Math.PI / 2)); fische.add(f); }); g.add(fische); g.userData.fische = fische; [-0.35, 0.4].forEach(x => g.add(setze(new Mesh(new ConeGeometry(0.05, 0.35, 5), mat("#3E9E5A")), x, 0.95, -0.1))); return g; } }
];
const WANDFARBEN = [
  { id: "rosa", name: "Rosa", farbe: ["#FFD9E6", "#FFE9C2"], preis: 0 },
  { id: "mint", name: "Mint", farbe: ["#C9F2E3", "#EAF8F1"], preis: 3 },
  { id: "himmel", name: "Himmelblau", farbe: ["#CFE6FF", "#EEF5FF"], preis: 3 },
  { id: "sonne", name: "Sonnengelb", farbe: ["#FFE9A8", "#FFF5D6"], preis: 3 },
  { id: "lila", name: "Lavendel", farbe: ["#E3D6FF", "#F3EDFF"], preis: 3 }
];
const zimmerDaten = () => Object.assign({ plaetze: {}, wand: "rosa" }, S.lade("zimmer") || {});
const besitzt = (id, preis) => !preis || S.offen(S.istFrei(id));
const moebelObj = {}; const platzHindernis = {};
function stelleMoebel() {
  const d = zimmerDaten();
  PLAETZE.forEach(pl => {
    const id = d.plaetze[pl.id], alt = moebelObj[pl.id];
    if (alt && alt.userData.id === id) return;
    if (alt) { zimmer.remove(alt); tippbar.splice(tippbar.indexOf(alt), 1); delete moebelObj[pl.id]; }
    if (platzHindernis[pl.id]) { hindernisse.splice(hindernisse.indexOf(platzHindernis[pl.id]), 1); delete platzHindernis[pl.id]; }
    const m = MOEBEL.find(x => x.id === id); if (!m) return;
    const o = m.bau(); o.userData.id = id; o.position.set(pl.x, 0.25, pl.z); o.rotation.y = Math.atan2(-pl.x, 0.8 - pl.z); zimmer.add(o); moebelObj[pl.id] = o;
    platzHindernis[pl.id] = { x: ZX + pl.x, z: pl.z, r: 0.6 }; hindernisse.push(platzHindernis[pl.id]);
    antippbar(o, () => sprechblase(m.e, m.name, m.text, "", null));
  });
  const w = WANDFARBEN.find(x => x.id === d.wand) || WANDFARBEN[0];
  WAND_HINTEN.color.set(w.farbe[0]); WAND_SEITE.color.set(w.farbe[1]);
}
stelleMoebel();
// Ringe zeigen beim Aussuchen, wo die Plätze sind
const platzRinge = PLAETZE.map(pl => { const r = new Mesh(new TorusGeometry(0.55, 0.05, 6, 28), new MeshBasicMaterial({ color: "#FF6F91" })); r.rotation.x = Math.PI / 2; r.position.set(pl.x, 0.3, pl.z); r.visible = false; zimmer.add(r); return r; });
let ladenWahl = null;
function laden(text) {
  const d = zimmerDaten(), L = $("laden-liste"); $("laden").hidden = false; $("blase").hidden = true;
  platzRinge.forEach(r => r.visible = !!ladenWahl);
  if (ladenWahl) {
    const m = MOEBEL.find(x => x.id === ladenWahl), steht = Object.keys(d.plaetze).find(k => d.plaetze[k] === m.id);
    $("laden-titel").textContent = `${m.e} ${m.name}: Wohin?`;
    $("laden-text").textContent = text || "Die rosa Ringe im Zimmer zeigen die Plätze.";
    L.innerHTML = PLAETZE.map((pl, i) => { const da = MOEBEL.find(x => x.id === d.plaetze[pl.id]); return `<button class="ware" data-platz="${pl.id}"><b>${i + 1}. ${pl.name}</b><span>${da ? (da.id === m.id ? "✓ steht hier" : `${da.e} ${da.name}`) : "frei"}</span></button>`; }).join("")
      + (steht ? `<button class="ware weg" data-weg="1"><b>📦 Wegräumen</b><span>in den Keller</span></button>` : "") + `<button class="ware weg" data-zurueck="1"><b>⬅️ Zurück</b></button>`;
    platzRinge.forEach((r, i) => r.material.color.set(d.plaetze[PLAETZE[i].id] ? "#FFB0C8" : "#FF6F91"));
    return;
  }
  $("laden-titel").textContent = "🛋️ Zimmer einrichten"; $("laden-text").textContent = text || "Kaufe Möbel mit deinen Sternen und stell sie auf. Gekauftes bleibt für immer deins.";
  const karte = (id, e, name, preis, info, extra) => `<button class="ware${besitzt(id, preis) ? " hat" : ""}" ${extra}><span class="e">${e}</span><b>${name}</b><span>${besitzt(id, preis) ? info : `⭐ ${preis}`}</span></button>`;
  L.innerHTML = `<h3>Möbel</h3><div class="waren">` + MOEBEL.map(m => { const steht = PLAETZE.find(pl => d.plaetze[pl.id] === m.id); return karte("moebel-" + m.id, m.e, m.name, m.preis, steht ? `✓ ${steht.name}` : "✓ Hinstellen", `data-moebel="${m.id}"`); }).join("")
    + `</div><h3>Wandfarbe</h3><div class="waren">` + WANDFARBEN.map(w => karte("wand-" + w.id, `<i style="background:${w.farbe[0]}"></i>`, w.name, w.preis, d.wand === w.id ? "✓ an der Wand" : "✓ Streichen", `data-wand="${w.id}"`)).join("") + `</div>`;
}
function kaufe(id, preis) {
  if (besitzt(id, preis)) return true;
  if (S.schalteFrei(id, preis)) { $("sterne").textContent = S.sterne(); S.ton("juhu"); return true; }
  S.ton("nein"); laden(`Dafür brauchst du ${preis} Sterne. Dir fehlen noch ${preis - S.sterne()}. Beim Lernen sammelst du neue!`); return false;
}
$("laden-liste").addEventListener("click", (ev) => {
  const b = ev.target.closest("button"); if (!b) return; const d = zimmerDaten();
  if (b.dataset.moebel) { const m = MOEBEL.find(x => x.id === b.dataset.moebel); if (kaufe("moebel-" + m.id, m.preis)) { ladenWahl = m.id; laden(); } return; }
  if (b.dataset.wand) { const w = WANDFARBEN.find(x => x.id === b.dataset.wand); if (kaufe("wand-" + w.id, w.preis)) { d.wand = w.id; S.speichere("zimmer", d); stelleMoebel(); laden("Frisch gestrichen!"); } return; }
  if (b.dataset.zurueck) { ladenWahl = null; laden(); return; }
  const raus = () => Object.keys(d.plaetze).forEach(k => { if (d.plaetze[k] === ladenWahl) delete d.plaetze[k]; });
  if (b.dataset.weg) { raus(); S.speichere("zimmer", d); stelleMoebel(); ladenWahl = null; laden("Weggeräumt. Du kannst es jederzeit wieder hinstellen."); return; }
  if (b.dataset.platz) { raus(); d.plaetze[b.dataset.platz] = ladenWahl; S.speichere("zimmer", d); stelleMoebel(); S.ton("tipp"); const pl = PLAETZE.find(x => x.id === b.dataset.platz); const m = MOEBEL.find(x => x.id === ladenWahl); ladenWahl = null; laden(`${m.e} ${m.name} steht jetzt ${pl.name}.`); }
});
$("einrichten").addEventListener("click", () => { ladenWahl = null; laden(); });
$("laden-zu").addEventListener("click", () => { $("laden").hidden = true; ladenWahl = null; platzRinge.forEach(r => r.visible = false); });

let draussenPos = new Vector3();
function reingehen() {
  drinnen = true; $("raus").hidden = false; $("einrichten").hidden = false; $("blase").hidden = true;
  draussenPos.copy(ich.position);
  ich.position.set(ZX, 0.25, 2.2); ich.rotation.y = Math.PI;
  if (tier) tier.position.set(ZX + 1.2, 0.25, 2.6);
  scene.background = new Color("#F7E3C6"); scene.fog.color.set("#F7E3C6"); wasser.visible = false; wolken.forEach(w => w.visible = false);
  $("info").textContent = "Dein Zimmer. Kleiderschrank, Spiegel – oder richte es mit 🛋️ ein!";
  S.ton("tipp");
}
function rausgehen() {
  drinnen = false; $("raus").hidden = true; $("einrichten").hidden = true; $("laden").hidden = true;
  const hr = WELT.insel ? 0.35 : P.haus[2], tx = P.haus[0] + Math.sin(hr) * 2.75, tz = P.haus[1] + Math.cos(hr) * 2.75;
  ich.position.set(tx, bodenY(tx, tz), tz); ich.rotation.y = hr;
  if (tier) tier.position.set(tx + 1.1, bodenY(tx + 1.1, tz + 0.4), tz + 0.4);
  scene.background = new Color(HIMMEL); scene.fog.color.set(HIMMEL); wasser.visible = true; wolken.forEach(w => w.visible = true);
  $("info").textContent = spielZeit() ? `Hallo ${name}!` : "🌱 Erst lernen: Geh zu Ella, Fipsi oder Benno.";
  if (wetter) { wendeWetterAn(wetter); zeigeWetterInfo(); }
  S.ton("tipp");
}
$("raus").addEventListener("click", rausgehen);

// Lernmodus anzeigen und bei Änderung der Spielzeit aktualisieren
function zeigeLernmodus() {
  const an = !spielZeit(); $("lern-hinweis").hidden = !an;
  if (an && Z) { const st = Z.status(); $("lern-hinweis").textContent = st.genug ? "😴 Für heute genug gespielt – Lernen geht noch!" : `🌱 Erst lernen: noch ${st.fehltMin} Minuten oder ${st.fehltAufgaben} Aufgaben. Geh zu Ella, Fipsi oder Benno!`; }
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
addEventListener("keydown", e => { tasten[e.key.toLowerCase()] = true; if (e.key === " ") { e.preventDefault(); springe(); } if (e.key === "Enter" || e.key.toLowerCase() === "e") { if (naechstes) { e.preventDefault(); aktion(); } } });
// Springen: einfach immer, Doppelsprung als Belohnung (Entdecker-Mut) oder im Testmodus
let hoehe = 0, vy = 0, spruenge = 0;
const doppelErlaubt = () => S.offen(window.Charakter && window.Charakter.hat && window.Charakter.hat("doppelsprung"));
function springe() {
  if (hoehe <= 0.001) { vy = 6.2; spruenge = 1; S.ton("tipp"); }
  else if (spruenge === 1 && doppelErlaubt()) { vy = 6.2; spruenge = 2; S.ton("wahl"); }
}
// Aktionsknopf: steht die Figur vor etwas Antippbarem, wird aus „Springen“ z. B. „Reden“ oder „Öffnen“
let naechstes = null, knopfZustand = "";
const wp = new Vector3();
function pruefeNaehe() {
  let best = null, bestD = Infinity;
  if ($("blase").hidden && $("laden").hidden && hoehe <= 0) for (const o of tippbar) {
    const u = o.userData; if (!u.nah || !o.visible || (o.parent && !o.parent.visible)) continue;
    o.getWorldPosition(wp); const d = Math.hypot(wp.x - ich.position.x, wp.z - ich.position.z);
    if (d < u.nah && d < bestD) { best = o; bestD = d; }
  }
  naechstes = best;
  const z = best ? best.userData.aktion.join("|") : "";
  if (z !== knopfZustand) {
    knopfZustand = z; const k = $("springen");
    k.innerHTML = best ? `<span>${best.userData.aktion[0]}</span>${best.userData.aktion[1]}` : "<span>⬆️</span>Springen";
    k.classList.toggle("aktion", !!best); k.setAttribute("aria-label", best ? best.userData.aktion[1] : "Springen");
  }
}
function aktion() {
  if (!naechstes) return springe();
  const o = naechstes; o.getWorldPosition(wp);
  ich.rotation.y = Math.atan2(wp.x - ich.position.x, wp.z - ich.position.z); ziel = null; marke.visible = false;
  o.userData.tipp();
}
$("springen").addEventListener("pointerdown", e => { e.preventDefault(); e.stopPropagation(); aktion(); });
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
function zeigeKamera() { const k = $("kamera"); k.classList.toggle("an", freiKamera); k.textContent = freiKamera ? "🎥 frei" : "🎥 fest"; }
freiKamera = EIN.kamera === "frei"; zeigeKamera();
$("kamera").addEventListener("click", () => {
  freiKamera = !freiKamera; zeigeKamera(); merkeEin("kamera", freiKamera ? "frei" : "fest");
  if (!freiKamera) { gieren = 0; neigung = 0.72; abstand = 15; }
});
// Eltern können die Einstellungs-Knöpfe ausblenden (Erwachsene sehen sie immer)
if (!EIN.kindDarf && !(S.erwachsen && S.erwachsen())) ["grafik", "steuerung", "kamera"].forEach(id => { $(id).hidden = true; });
$("grafik").textContent = EINFACH ? "✨ einfach" : "✨ schön";
// Steuerung: Joystick oder Tippen (jederzeit umschaltbar, das Tablet merkt es sich)
let STEUERUNG = EIN.steuerung === "tippen" ? "tippen" : "joystick";
function zeigeSteuerung() {
  $("steuerung").textContent = STEUERUNG === "tippen" ? "👆 Tippen" : "🕹️ Joystick";
  $("joy-hinweis").textContent = STEUERUNG === "tippen" ? "👆 Tippe auf die Wiese zum Laufen · Antippen zum Reden" : "🕹️ Hier links schieben zum Laufen · Antippen zum Reden";
}
$("steuerung").addEventListener("click", () => {
  STEUERUNG = STEUERUNG === "tippen" ? "joystick" : "tippen";
  merkeEin("steuerung", STEUERUNG);
  zeigeSteuerung(); $("joy-hinweis").hidden = false; setTimeout(() => { $("joy-hinweis").hidden = true; }, 4000); S.ton("tipp");
});
zeigeSteuerung();
$("grafik").addEventListener("click", () => { merkeEin("grafik", EINFACH ? "schoen" : "einfach"); try { localStorage.removeItem("lerninsel.sparen"); } catch (e) { /* egal */ } setTimeout(() => location.reload(), 150); });
let ankunft = null;
const marke = new Mesh(new TorusGeometry(0.35, 0.06, 6, 28), new MeshBasicMaterial({ color: "#FFFFFF", transparent: true, opacity: 0.9 }));
marke.rotation.x = Math.PI / 2; marke.visible = false; scene.add(marke);
function markiere(p) { marke.position.set(p.x, bodenY(p.x, p.z) + 0.07, p.z); marke.visible = true; }

// Begrüßung
$("sterne").textContent = S.sterne();
function zeigeWetterInfo() { const w = wetterSatz(); if (w && !drinnen && spielZeit()) $("info").textContent = `${w} – hallo ${name}!`; }
const WELT_GRUSS = { wiese: "Die Blumen blühen", wald: "Der Wald rauscht", berge: "Die Berge rufen", strand: "Die Wellen rauschen", schnee: "Alles glitzert im Schnee", wueste: "Die Sonne scheint warm" };
$("info").textContent = NACHT ? `Gute Nacht, ${name}! Die Insel schläft bald.` : !WELT.insel ? `${WELT_GRUSS[WELT.biom]}, ${name}! Willkommen in deiner Welt.` : SAISON === "winter" ? `Es hat geschneit, ${name}!` : SAISON === "herbst" ? `Die Blätter sind bunt, ${name}!` : `Hallo ${name}! Schön, dass du da bist.`;

// ---------- Größe, Schleife ----------
function groesse() { const el = $("buehne"); renderer.setSize(el.clientWidth, el.clientHeight, false); camera.aspect = el.clientWidth / Math.max(1, el.clientHeight); camera.updateProjectionMatrix(); }
addEventListener("resize", groesse); groesse();
const uhr = new Clock(), blick = new Vector3(), tmp = new Vector3(), halmO = new Object3D();
let lauf = 0, vollGas = 0, rennt = false;
function wegVonHindernissen(p, r) {
  for (const h of hindernisse) { const dx = p.x - h.x, dz = p.z - h.z, d = Math.hypot(dx, dz), m = h.r + r; if (d < m && d > 0.001) { p.x = h.x + dx / d * m; p.z = h.z + dz / d * m; } }
  if (drinnen) { p.x = MathUtils.clamp(p.x, ZX - 3.7, ZX + 3.7); p.z = MathUtils.clamp(p.z, -3.1, 3.3); if (p.z >= 3.25 && ich.position === p) rausgehen(); return; }
  const RMAX = WELT.insel ? 14.6 : WELT.R - 0.6, l = Math.hypot(p.x, p.z); if (l > RMAX) { p.x *= RMAX / l; p.z *= RMAX / l; }
}
// ---------- Automatisch sparen, wenn das Tablet nicht hinterherkommt ----------
// In den ersten Sekunden wird gemessen; unter 30 Bildern pro Sekunde: keine Schatten, Auflösung 1, Wasser und Gras ruhig.
// Das Tablet merkt es sich (localStorage), damit es beim nächsten Mal gleich flüssig startet.
const SPAR_KEY = "lerninsel.sparen";
let sparen = false, bildNr = 0, messBilder = 0, gemessen = false;
function spare(melden) {
  if (sparen) return; sparen = true;
  sonne.castShadow = false; renderer.shadowMap.enabled = false; mats.forEach(m => { m.needsUpdate = true; }); scene.traverse(o => { if (o.material && !Array.isArray(o.material)) o.material.needsUpdate = true; });
  renderer.setPixelRatio(1); groesse();
  try { localStorage.setItem(SPAR_KEY, "1"); } catch (e) { /* egal */ }
  if (melden) $("info").textContent = "🌿 Die Grafik ist jetzt etwas einfacher, damit alles flüssig läuft.";
}
if (!EINFACH && lies(SPAR_KEY) === "1") spare(false);
function bild() {
  const dt = Math.min(uhr.getDelta(), 0.05), t = uhr.elapsedTime;
  if (!gemessen && !EINFACH) { if (t > 1.5) messBilder++; if (t >= 5.5) { gemessen = true; if (messBilder / 4 < 30) spare(true); } }
  const u = ich.userData; let geht = false;
  let ix = eingabe.x, iz = eingabe.z;
  if (tasten["arrowleft"] || tasten["a"]) ix -= 1; if (tasten["arrowright"] || tasten["d"]) ix += 1;
  if (tasten["arrowup"] || tasten["w"]) iz -= 1; if (tasten["arrowdown"] || tasten["s"]) iz += 1;
  const staerke = Math.min(1, Math.hypot(ix, iz));
  if (staerke > 0.12) {
    ziel = null; ankunft = null; marke.visible = false; geht = true;
    const gw0 = freiKamera ? gieren : 0, n = Math.hypot(ix, iz);
    const wx = (ix * Math.cos(gw0) + iz * Math.sin(gw0)) / n, wz = (-ix * Math.sin(gw0) + iz * Math.cos(gw0)) / n;
    // Rennen: Joystick ganz nach außen (oder Umschalt-Taste) – nach kurzer Zeit wird die Figur schneller
    if (Math.hypot(eingabe.x, eingabe.z) > 0.92 || tasten["shift"]) { if (vollGas === 0) vollGas = t; } else vollGas = 0;
    rennt = vollGas > 0 && t - vollGas > 0.5 && !drinnen;
    const tempo = (rennt ? 7 : 4) * staerke;
    ich.position.x += wx * tempo * dt; ich.position.z += wz * tempo * dt; wegVonHindernissen(ich.position, 0.4);
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
  if (!geht) { vollGas = 0; rennt = false; }
  lauf += dt * (geht ? (rennt ? 17 : 11) : 0);
  const schwung = geht ? Math.sin(lauf) : 0;
  const ausholen = rennt ? 0.95 : 0.6;
  u.beine[0].rotation.x = schwung * ausholen; u.beine[1].rotation.x = -schwung * ausholen;
  u.arme[0].rotation.x = -schwung * ausholen; u.arme[1].rotation.x = schwung * ausholen;
  u.koerper.rotation.x = rennt ? 0.15 : 0;
  u.koerper.position.y = geht && hoehe <= 0 ? Math.abs(Math.sin(lauf)) * 0.08 : Math.sin(t * 2) * 0.015;
  if (hoehe > 0 || vy > 0) {
    vy -= 18 * dt; hoehe += vy * dt;
    if (hoehe <= 0) { hoehe = 0; vy = 0; spruenge = 0; }
  }
  const grund = bodenY(ich.position.x, ich.position.z); ich.position.y = grund + hoehe;
  if (hoehe > 0) { u.beine[0].rotation.x = -0.5; u.beine[1].rotation.x = 0.3; u.arme[0].rotation.z = 0.9; u.arme[1].rotation.z = -0.9; }
  else { u.arme[0].rotation.z = 0.25; u.arme[1].rotation.z = -0.25; }
  if (marke.visible) marke.scale.setScalar(1 + Math.sin(t * 6) * 0.1);

  if (tier) {
    tmp.subVectors(ich.position, tier.position); tmp.y = 0; const dT = tmp.length(), tu = tier.userData; let hoppelt = false;
    const schlaeft = NACHT && !geht && dT < 3;
    if (dT > 1.5) {
      hoppelt = true; tmp.normalize(); tier.position.addScaledVector(tmp, Math.min(dT - 1.5, (dT > 4 ? 7.5 : 3.2) * dt)); wegVonHindernissen(tier.position, 0.3);
      const soll = Math.atan2(tmp.x, tmp.z); let diff = soll - tier.rotation.y; diff = Math.atan2(Math.sin(diff), Math.cos(diff)); tier.rotation.y += diff * Math.min(1, dt * 8);
    }
    tier.position.y = bodenY(tier.position.x, tier.position.z);
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
    if (n.freut && !(o.userData.huepf > 0) && (t + i * 1.3) % 5 < dt) o.userData.huepf = 1;
    if (o.userData.koerper) o.userData.koerper.scale.y = 1 + Math.sin(t * 2.2 + i) * 0.02; if (o.userData.huepf > 0) { o.userData.huepf = Math.max(0, o.userData.huepf - dt * 2); }
    o.position.y = n.y + Math.sin((1 - (o.userData.huepf || 0)) * Math.PI) * (o.userData.huepf ? 0.4 : 0) + (n.e === "robo" ? Math.sin(t * 2) * 0.05 : 0);
  });
  if (wissen) wissen.tick(t);
  ballons.children.forEach(b => { if (b.userData.p !== undefined) b.position.y = 2.3 + (b.userData.p % 2) * 0.35 + Math.sin(t * 1.5 + b.userData.p) * 0.12; });
  for (let i = herzListe.length - 1; i >= 0; i--) { const h = herzListe[i]; h.userData.t += dt; h.position.y += dt * h.userData.v; h.material.opacity = 1 - h.userData.t; if (h.userData.t > 1) { scene.remove(h); herzListe.splice(i, 1); } }

  if (!EINFACH && !RUHIG && !sparen) {
    const a = wasserGeo.attributes.position;
    for (let i = 0; i < a.count; i++) { const x = wasserBasis[i * 3], z = wasserBasis[i * 3 + 2]; a.setY(i, Math.sin(x * 0.35 + t * 1.4) * 0.1 + Math.cos(z * 0.3 + t * 1.1) * 0.1); }
    a.needsUpdate = true; wasserGeo.computeVertexNormals();
  }
  if (halme && !RUHIG && !sparen && (bildNr++ & 1) === 0) {   // Gras nur jedes zweite Bild bewegen
    for (let i = 0; i < halmDaten.length; i++) {
      const h = halmDaten[i]; if (!h.s) continue;
      halmO.position.set(h.x, h.y, h.z); halmO.scale.setScalar(h.s); halmO.rotation.set(Math.sin(t * 1.8 + h.p + h.x * 0.3) * 0.18, 0, Math.cos(t * 1.5 + h.p) * 0.12);
      halmO.updateMatrix(); halme.setMatrixAt(i, halmO.matrix);
    }
    halme.instanceMatrix.needsUpdate = true;
  }
  if (schnee) { const a = schnee.geometry.attributes.position; for (let i = 0; i < a.count; i++) { let y = a.getY(i) - dt * 1.2; if (y < 0) y = 16; a.setY(i, y); a.setX(i, a.getX(i) + Math.sin(t + i) * dt * 0.2); } a.needsUpdate = true; }
  if (drinnen) { const gl = moebelObj && Object.values(moebelObj); gl.forEach(o => { if (o.userData.dreh) o.userData.dreh.rotation.y += dt * 0.5; if (o.userData.fische) o.userData.fische.children.forEach((f, i) => { f.position.x = Math.sin(t * (0.8 + i * 0.3) + i * 2) * 0.35; f.rotation.y = Math.cos(t * (0.8 + i * 0.3) + i * 2) > 0 ? 0 : Math.PI; }); }); }
  pruefeNaehe();
  windrad.rotation.y += dt * (0.6 + Math.min(40, (wetter && wetter.wind) || 8) * 0.15);
  if (regen) { const a = regen.geometry.attributes.position; for (let i = 0; i < a.count; i += 2) { let y = a.getY(i) - dt * 14; if (y < 0) y = 16; a.setY(i, y); a.setY(i + 1, y - 0.55); } a.needsUpdate = true; regen.visible = !drinnen; }
  if (schnee) schnee.visible = !drinnen;
  if (wetter && wetter.art === "gewitter" && !drinnen && !RUHIG) { blitz -= dt; if (blitz < -6 - Math.random() * 6) { blitz = 0.12; } scene.background.set(blitz > 0 ? "#E8ECF5" : NACHT ? HIMMEL : "#6C7A8C"); }
  wolken.forEach((w, i) => { w.position.x += dt * (0.4 + i * 0.1); if (w.position.x > 40) w.position.x = -40; });

  blick.set(ich.position.x, 1.0 + grund + hoehe * 0.3, ich.position.z);
  const gw = freiKamera ? gieren : 0, nw = freiKamera ? neigung : drinnen ? 0.85 : 0.72, ab = drinnen && !freiKamera ? 10 : abstand;
  if (drinnen) blick.set(MathUtils.clamp(blick.x, ZX - 1.5, ZX + 1.5), blick.y, MathUtils.clamp(blick.z, -1.5, 1.2));
  camera.position.set(blick.x + Math.sin(gw) * Math.cos(nw) * ab, blick.y + Math.sin(nw) * ab, blick.z + Math.cos(gw) * Math.cos(nw) * ab);
  camera.lookAt(blick);
  sonne.position.set(ich.position.x + 10, 18, ich.position.z + 8); sonne.target.position.copy(ich.position);
  renderer.render(scene, camera);
  requestAnimationFrame(bild);
}
requestAnimationFrame(bild);
zeigeLernmodus(); if (!NACHT) zeigeWetterInfo();
if (window.Sticker) setTimeout(() => { window.Sticker.feste(); if (NACHT && !q.has("stunde")) window.Sticker.entdecke("w-mond"); }, 1200);
if (q.get("drinnen") === "1" && spielZeit()) reingehen();
// ---------- Meine Welt: Wünsche-Assistent, Neu würfeln, gespeicherte Welten wechseln ----------
// Daten: S.lade("welt") = { welten: [wünsche…], aktiv: Index (-1/fehlt = erste Insel), entwurf: true solange „Behalten?“ offen, vorher }
const MAX_WELTEN = 5;
const weltDaten = () => Object.assign({ welten: [], aktiv: -1 }, S.lade("welt") || {});
const weltSpeichern = (d) => S.speichere("welt", d);
const neuLaden = () => setTimeout(() => location.reload(), 200);
let wunsch = null, schritt = 0;
function weltListe() {
  const d = weltDaten();
  $("welt-titel").textContent = "🌍 Meine Welten";
  const eintrag = (i, e, n) => `<div class="welt-eintrag ${d.aktiv === i || (i === -1 && !(d.aktiv >= 0)) ? "aktiv" : ""}"><span class="e">${e}</span><b>${n}</b>` +
    (d.aktiv === i || (i === -1 && !(d.aktiv >= 0)) ? `<span>📍 Hier bist du</span>` : `<button class="knopf haupt" data-besuch="${i}">Besuchen</button>`) +
    (i >= 0 ? `<button class="knopf" data-weg="${i}" aria-label="Welt löschen">🗑️</button>` : "") + `</div>`;
  $("welt-inhalt").innerHTML = `<p>Erschaffe dir eine eigene Welt, so wie du sie magst. Du kannst mehrere Welten haben und hin- und herreisen.</p>
    <div class="welt-liste">${eintrag(-1, "🏝️", "Meine erste Insel")}${d.welten.map((w, i) => eintrag(i, (BIOME[w.biom] || {}).e || "🌍", w.name || "Meine Welt")).join("")}</div>
    <div class="welt-unten">${d.welten.length < MAX_WELTEN ? `<button class="knopf haupt" id="welt-neu">✨ Neue Welt erschaffen</button>` : `<p>Du hast schon ${MAX_WELTEN} Welten. Lösche eine, um eine neue zu erschaffen.</p>`}</div>`;
  $("welt-inhalt").querySelectorAll("[data-besuch]").forEach(b => b.addEventListener("click", () => { const d2 = weltDaten(); d2.aktiv = +b.dataset.besuch; d2.entwurf = false; weltSpeichern(d2); S.ton("juhu"); neuLaden(); }));
  $("welt-inhalt").querySelectorAll("[data-weg]").forEach(b => b.addEventListener("click", () => {
    const i = +b.dataset.weg, d2 = weltDaten(), w = d2.welten[i];
    if (!confirm(`„${w.name || "Meine Welt"}“ wirklich löschen?`)) return;
    d2.welten.splice(i, 1); const war = d2.aktiv === i; if (d2.aktiv > i) d2.aktiv--; if (war) d2.aktiv = -1; weltSpeichern(d2);
    if (war) neuLaden(); else weltListe();
  }));
  const neu = $("welt-neu"); if (neu) neu.addEventListener("click", () => { wunsch = { biom: "wiese", farbe: FARBEN[0][0], groesse: "mittel", huegel: "mittel", see: false, blumen: true }; schritt = 0; assistent(); S.ton("tipp"); });
}
function assistent() {
  const W = wunsch, punkte = `<div class="schritte">${[0, 1, 2].map(i => `<span class="${i <= schritt ? "an" : ""}"></span>`).join("")}</div>`;
  $("welt-titel").textContent = "✨ Neue Welt erschaffen";
  let html = punkte;
  if (schritt === 0) html += `<h3>Wie soll deine Welt aussehen?</h3><div class="wahl-raster">${Object.entries(BIOME).map(([id, b]) => `<button class="wahl ${W.biom === id ? "an" : ""}" data-biom="${id}"><span class="e">${b.e}</span>${b.name}</button>`).join("")}</div>`;
  if (schritt === 1) html += `<h3>Deine Lieblingsfarbe für Blumen und Blüten</h3><div class="farben">${FARBEN.map(([f, n]) => `<button class="farbe ${W.farbe === f ? "an" : ""}" data-farbe="${f}" style="background:${f}" aria-label="${n}"></button>`).join("")}</div>
    <h3>Wie groß?</h3><div class="wahl-raster">${[["klein", "🏝️", "Klein"], ["mittel", "🗺️", "Mittel"], ["gross", "🌍", "Riesig"]].map(([v, e, t]) => `<button class="wahl ${W.groesse === v ? "an" : ""}" data-groesse="${v}"><span class="e">${e}</span>${t}</button>`).join("")}</div>`;
  if (schritt === 2) html += `<h3>Wie hügelig?</h3><div class="wahl-raster">${[["wenig", "➖", "Fast flach"], ["mittel", "〰️", "Ein paar Hügel"], ["viel", "⛰️", "Viele Hügel"]].map(([v, e, t]) => `<button class="wahl ${W.huegel === v ? "an" : ""}" data-huegel="${v}"><span class="e">${e}</span>${t}</button>`).join("")}</div>
    <h3>Was soll es noch geben?</h3><div class="wahl-raster"><button class="wahl ${W.see ? "an" : ""}" data-extra="see"><span class="e">💧</span>Einen Teich</button><button class="wahl ${W.blumen ? "an" : ""}" data-extra="blumen"><span class="e">🌸</span>Viele Blumen</button></div>`;
  html += `<div class="welt-unten"><button class="knopf" id="welt-zurueck">${schritt ? "⬅️ Zurück" : "Abbrechen"}</button>${schritt < 2 ? `<button class="knopf haupt" id="welt-weiter">Weiter ➡️</button>` : `<button class="knopf haupt" id="welt-los">✨ Welt erschaffen!</button>`}</div>`;
  $("welt-inhalt").innerHTML = html;
  const I = $("welt-inhalt");
  I.querySelectorAll("[data-biom]").forEach(b => b.addEventListener("click", () => { W.biom = b.dataset.biom; S.ton("tipp"); assistent(); }));
  I.querySelectorAll("[data-farbe]").forEach(b => b.addEventListener("click", () => { W.farbe = b.dataset.farbe; S.ton("tipp"); assistent(); }));
  I.querySelectorAll("[data-groesse]").forEach(b => b.addEventListener("click", () => { W.groesse = b.dataset.groesse; S.ton("tipp"); assistent(); }));
  I.querySelectorAll("[data-huegel]").forEach(b => b.addEventListener("click", () => { W.huegel = b.dataset.huegel; S.ton("tipp"); assistent(); }));
  I.querySelectorAll("[data-extra]").forEach(b => b.addEventListener("click", () => { W[b.dataset.extra] = !W[b.dataset.extra]; S.ton("tipp"); assistent(); }));
  $("welt-zurueck").addEventListener("click", () => { S.ton("tipp"); if (schritt) { schritt--; assistent(); } else weltListe(); });
  const weiter = $("welt-weiter"); if (weiter) weiter.addEventListener("click", () => { S.ton("tipp"); schritt++; assistent(); });
  const los = $("welt-los"); if (los) los.addEventListener("click", () => {
    const d = weltDaten(), anzahl = d.welten.filter(w => w.biom === W.biom).length;
    d.welten.push(Object.assign({}, W, { seed: neuerSeed(), name: `${BIOME[W.biom].name}${anzahl ? " " + (anzahl + 1) : ""}` }));
    d.vorher = d.aktiv; d.aktiv = d.welten.length - 1; d.entwurf = true; weltSpeichern(d);
    $("welt-inhalt").innerHTML = `<p style="font-size:1.4rem;text-align:center">✨ Deine Welt entsteht …</p>`; S.ton("juhu"); neuLaden();
  });
}
$("welt-knopf").addEventListener("click", () => { S.ton("tipp"); spielOrt(() => { $("welt").hidden = false; weltListe(); }); });
$("welt-zu").addEventListener("click", () => { S.ton("tipp"); $("welt").hidden = true; });
// Nach dem Erschaffen: neu würfeln, behalten oder zurück
{
  const d = weltDaten();
  if (d.entwurf && d.aktiv >= 0 && d.welten[d.aktiv]) {
    $("welt-leiste").hidden = false;
    $("welt-wuerfeln").addEventListener("click", () => { const d2 = weltDaten(); d2.welten[d2.aktiv].seed = neuerSeed(); weltSpeichern(d2); S.ton("tipp"); neuLaden(); });
    $("welt-behalten").addEventListener("click", () => { const d2 = weltDaten(); d2.entwurf = false; delete d2.vorher; weltSpeichern(d2); $("welt-leiste").hidden = true; S.ton("juhu"); $("info").textContent = "🌍 Deine Welt ist gespeichert!"; });
    $("welt-verwerfen").addEventListener("click", () => { const d2 = weltDaten(); d2.welten.splice(d2.aktiv, 1); d2.aktiv = d2.vorher >= 0 && d2.vorher < d2.welten.length ? d2.vorher : -1; d2.entwurf = false; delete d2.vorher; weltSpeichern(d2); S.ton("tipp"); neuLaden(); });
  }
}

window.__heimat = { wissen: () => wissen, zeichnungen: () => renderer.info.render.calls, get sparen() { return sparen; }, blick: (g, n, a) => { freiKamera = true; gieren = g; neigung = n; abstand = a; }, ich, tier, reingehen, rausgehen, get drinnen() { return drinnen; }, get ziel() { return ziel; }, laufeZu: (x, z) => { ziel = new Vector3(x, 0.25, z); markiere(ziel); }, tippe: (i) => NACHBARN[i].obj.userData.tipp(), station: () => station.userData.tipp(), get wetter() { return wetter; }, laden: () => laden(), zimmerDaten, get rennt() { return rennt; }, get aktion() { return naechstes ? naechstes.userData.aktion[1] : null; }, druecke: () => aktion(), SAISON, NACHT };
