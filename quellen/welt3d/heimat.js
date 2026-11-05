// Heimatinsel (Stil B: rund, Toon-Licht, Konturen).
// Figur trägt den aktuellen Look aus dem Kleiderschrank, das eigene Tier läuft mit,
// Tag/Nacht nach der Uhr, Jahreszeit nach dem Datum, Nachbarn führen zu den Fächern.
// Test-Parameter: ?stunde=21  ?monat=12  (Jahreszeit/Nacht ausprobieren)
import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, Fog, HemisphereLight, DirectionalLight, Clock, SRGBColorSpace,
  PCFShadowMap, Group, Mesh, MeshToonMaterial, MeshBasicMaterial, MeshLambertMaterial, BackSide, DoubleSide,
  CylinderGeometry, SphereGeometry, ConeGeometry, BoxGeometry, CapsuleGeometry, PlaneGeometry,
  LatheGeometry, ExtrudeGeometry, Shape, Vector2, Vector3, DataTexture, RedFormat, NearestFilter, InstancedMesh,
  Object3D, Matrix4, Raycaster, PointLight, CircleGeometry, TorusGeometry, MathUtils, BufferGeometry, BufferAttribute, Float32BufferAttribute, Points, PointsMaterial, LineSegments, LineBasicMaterial, CanvasTexture, Sprite, SpriteMaterial
} from "../three/three.module.js";
import { S, SPIELE, istFrei, baumStufe, messe } from "./gemeinsam.js";
import { extras3d, EXTRAS_3D } from "./extras3d.js";
import { BIOME, FARBEN, neuerSeed } from "./welt.js";

const $ = (id) => document.getElementById(id);
const SP = window.Sprache;
const q = new URLSearchParams(location.search);
// ---------- Insel-Kern (NA-24): Welt, Orte, Regeln und Story kommen aus shared/insel-kern.js; diese Datei zeichnet nur ----------
// Eigene Welt: Wünsche + seed (Test: ?biom=wald&groesse=gross&huegel=viel&see=1&seed=7); ohne gespeicherte Welt die bisherige Insel.
const K = window.InselKern, KI = K.erstelle(q);
const { STUNDE, MONAT, SAISON, NACHT, DAEMMER } = K.zeit(q);
const { WELT, P, bodenY, UFER, RMAX_LAUF, STEG, SU, PAKET_POS, ZX } = KI;
const WINTERLICH = SAISON === "winter" || WELT.biom === "schnee";
const GRAFIK_KEY = "lerninsel.grafik";
const lies = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
// Insel-Einstellungen (Grafik, Steuerung, Kamera) werden pro Kind bei den Eltern-Daten gemerkt.
// Eltern legen im Elternbereich fest, ob das Kind die Knöpfe überhaupt sieht (kindDarf). Alte Tablet-Werte dienen als Startwert.
const EIN = Object.assign({ grafik: lies(GRAFIK_KEY) === "einfach" ? "einfach" : lies(GRAFIK_KEY) === "schoen" ? "schoen" : (S.grafikStandard ? S.grafikStandard() : "schoen"), steuerung: lies("lerninsel.steuerung") === "tippen" ? "tippen" : "joystick", kamera: "fest", kindDarf: true },
  (S.lade("eltern") || {}).insel || {});
function merkeEin(k, v) { EIN[k] = v; const e = S.lade("eltern") || {}; e.insel = Object.assign({}, e.insel || {}, { [k]: v }); S.speichere("eltern", e); }
const EINFACH = EIN.grafik === "einfach";
const RUHIG = !!(window.Zeit && window.Zeit.regeln().ruhig); // ruhige Darstellung: Gras und Wasser bewegen sich nicht

// ---------- Renderer, Szene, Licht ----------
const renderer = new WebGLRenderer({ antialias: !EINFACH, powerPreference: "high-performance" });
// Auflösung (01.11.2026): passt sich dem Gerät an (AUFL_MAX … 1); die zuletzt gute Stufe merkt sich das Tablet, damit es gleich flüssig startet
const AUFL_KEY = "lerninsel.aufloesung", AUFL_MAX = EINFACH ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
let aufl = EINFACH ? 1 : Math.max(1, Math.min(AUFL_MAX, +(lies(AUFL_KEY) || AUFL_MAX) || AUFL_MAX));
renderer.setPixelRatio(aufl);
renderer.outputColorSpace = SRGBColorSpace;
renderer.shadowMap.enabled = !EINFACH;
// PCF statt PCFSoft (günstiger auf Tablet-Grafikchips); die Schattenkarte wird nur jedes zweite Bild neu gezeichnet (siehe bild())
renderer.shadowMap.type = PCFShadowMap;
renderer.shadowMap.autoUpdate = false;
$("buehne").appendChild(renderer.domElement);

const scene = new Scene();
const HIMMEL = NACHT ? "#1C2A55" : DAEMMER ? "#F6B98A" : WINTERLICH ? "#CFE6F5" : WELT.biom === "wueste" ? "#BFE3F2" : "#A8DDF5";
scene.background = new Color(HIMMEL);
scene.fog = new Fog(HIMMEL, 32, 80);
const camera = new PerspectiveCamera(40, 1, 0.1, 200);
scene.add(new HemisphereLight(NACHT ? "#8FA6E8" : "#FFF4E0", NACHT ? "#2C3E5C" : "#8CCB6E", NACHT ? 0.7 : DAEMMER ? 1.1 : 1.3));
const sonne = new DirectionalLight(NACHT ? "#AFC4FF" : DAEMMER ? "#FFC28A" : "#FFE9C7", NACHT ? 0.6 : DAEMMER ? 1.6 : 2.2);
sonne.castShadow = !EINFACH;
sonne.shadow.mapSize.set(1024, 1024); sonne.shadow.radius = 3; sonne.shadow.bias = -0.0006; sonne.shadow.normalBias = 0.03;
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
// Kugeln: in „schön“ gut die Hälfte, in „einfach“ zwei Fünftel der Segmente (NA-29: Toon-Licht und Kontur verdecken die Kanten)
const kugel = (r, a = 28, b = 20) => new SphereGeometry(r, Math.max(8, Math.ceil(a * (EINFACH ? 0.4 : 0.55))), Math.max(6, Math.ceil(b * (EINFACH ? 0.4 : 0.55))));
const setze = (o, x, y, z) => { o.position.set(x, y, z); return o; };
const AUGE = new MeshBasicMaterial({ color: "#2E2240" }), WEISS = new MeshBasicMaterial({ color: "#ffffff" });
// Normale Augen statt Kulleraugen (02.11.2026, Wunsch des Auftraggebers; ersetzt die Kulleraugen vom 01.11.): klein, kaum höher als breit,
// ein kleiner Glanzpunkt, keine Wangen. Der Parameter wangen bleibt für alte Aufrufe, wird aber nicht mehr benutzt.
function augen(eltern, abstand, y, z, r = 0.075, wangen = false) {   // eslint-disable-line no-unused-vars
  [-1, 1].forEach(s => {
    const a = new Mesh(kugel(r * 0.72, 14, 10), AUGE); a.scale.set(1, 1.12, 0.55); setze(a, abstand * s, y, z); eltern.add(a);
    a.add(setze(new Mesh(kugel(r * 0.2, 8, 6), WEISS), r * 0.24, r * 0.26, r * 0.6));
  });
}

// ---------- Hindernisse und antippbare Dinge ----------
const hindernisse = []; // { x, z, r }
const tippbar = [];     // Object3D mit userData.tipp()
const starr = [];       // NA-29: [Objekt, bewegliche Teile] – wird vor dem ersten Bild lokal verschmolzen (verschmelzeLokal)
const block = (x, z, r) => hindernisse.push({ x, z, r });
// Zeitsystem: ohne Spielzeit ist die Insel im Lernmodus (Lern-Nachbarn gehen, Spielorte schlafen)
const Z = window.Zeit;
const spielZeit = K.spielZeit, profi = K.profi;
function spielOrt(fn) {
  if (spielZeit()) { fn(); return; }
  sprechblase(...K.schlaeftText(), null);
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
  const ringe = EINFACH ? Math.round(WELT.R * 1.4) : Math.round(WELT.R * 2), segs = EINFACH ? 64 : WELT.R > 16 ? 80 : 96, RA = WELT.R + 1.2;   // NA-29: etwas gröberes Gelände in „schön“
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
const wasserGeo = new PlaneGeometry(140, 140, EINFACH ? 1 : 48, EINFACH ? 1 : 48);   // Wellen-Gitter (NA-29: 48 statt 70 reicht für die weichen Wellen)
wasserGeo.rotateX(-Math.PI / 2);   // (30.10.2026) stand versehentlich im Kommentar – in „einfach“, „ruhig“ und beim Sparen war das Wasser eine senkrechte Wand
const wasser = new Mesh(wasserGeo, new MeshToonMaterial({ color: NACHT ? "#2E5F8C" : "#5EC3E6", gradientMap: verlauf, transparent: true, opacity: 0.92 }));
wasser.position.y = -0.55; wasser.receiveShadow = true; scene.add(wasser);
// Wellen (01.11.2026) im Vertex-Shader statt jedes Bild in JavaScript (2401 Punkte + Normalen) – spart CPU auf Tablets und Handys
const ZEIT = { value: 0 };   // gemeinsame Zeit für Wasser und Gras; steht still bei „ruhig“, „einfach“ und beim Sparen
if (!EINFACH) wasser.material.onBeforeCompile = (sh) => {
  sh.uniforms.uZeit = ZEIT;
  sh.vertexShader = "uniform float uZeit;\n" + sh.vertexShader
    .replace("#include <beginnormal_vertex>", `float wA = position.x * 0.35 + uZeit * 1.4, wB = position.z * 0.3 + uZeit * 1.1;
      vec3 objectNormal = normalize(vec3(-0.035 * cos(wA), 1.0, 0.03 * sin(wB)));
      #ifdef USE_TANGENT
        vec3 objectTangent = vec3(tangent.xyz);
      #endif`)
    .replace("#include <begin_vertex>", "vec3 transformed = vec3(position); transformed.y += sin(wA) * 0.1 + cos(wB) * 0.1;");
};
{ const schaum = new Mesh(new TorusGeometry(WELT.insel ? 15.9 : WELT.R + 0.9, 0.18, 8, 80), new MeshBasicMaterial({ color: "#EAFBFF" })); schaum.rotation.x = Math.PI / 2; schaum.position.y = -0.48; scene.add(schaum); }

// ---------- Bäume (Farbe nach Jahreszeit), Steine, Blumen ----------
// Leistungsbudget (NA-29): Welten mit vielen Bäumen bekommen gröbere Kronen; in „einfach“ haben Bäume keine Kontur.
const VIELE_BAEUME = WELT.baeume.length > 30, KRONE_SEG = VIELE_BAEUME ? [14, 10] : [18, 12], DEKO_KONTUR = !EINFACH;
const KRONE = { sommer: ["#5DBB5A", "#4FAF62"], fruehling: ["#5DBB5A", "#F6B6CE"], herbst: ["#F2A03D", "#E2603A", "#F4C542", "#5DBB5A"], winter: ["#3E8E5A", "#3E8E5A"] };
function baum(x, z, k = 1, i = 0) {
  const b = new Group();
  b.add(setze(teil(new CylinderGeometry(0.22 * k, 0.32 * k, 1.6 * k, EINFACH ? 7 : 10), "#9A6A3F", { umriss: DEKO_KONTUR }), 0, 0.8 * k, 0));
  const farben = KRONE[SAISON], f = farben[i % farben.length];
  [[0, 2.4, 0, 1.15], [0.8, 2.0, 0.2, 0.8], [-0.75, 2.05, -0.1, 0.85], [0.1, 2.0, 0.8, 0.75], [0, 3.1, 0, 0.75]].forEach(([dx, y, dz, r]) =>
    b.add(setze(teil(kugel(r * k, ...KRONE_SEG), f, { umriss: DEKO_KONTUR }), dx * k, y * k, dz * k)));   // Kronen: wenige Segmente (NA-29)
  if (SAISON === "winter") b.add(setze(teil(kugel(0.6 * k, 18, 12), "#FFFFFF"), 0, 3.45 * k, 0));
  if (SAISON === "sommer" && i % 2 === 0) [[0.6, 2.3, 0.9], [-0.8, 2.6, 0.6], [0.9, 2.8, -0.4]].forEach(([dx, y, dz]) => b.add(setze(teil(kugel(0.16 * k, 10, 8), "#FF7A6B", { dicke: 1.12 }), dx * k, y * k, dz * k)));
  b.position.set(x, bodenY(x, z) - 0.05, z); b.rotation.y = x * 1.7; deko.add(b); block(x, z, 0.6 * k);
}
// Nadelbaum, Palme, Kaktus für die eigenen Welten
function nadelbaum(x, z, k) {
  const b = new Group(), f = WINTERLICH ? "#3E8E5A" : "#3F9A5C";
  const sg = EINFACH ? 7 : WELT.R > 16 ? 8 : 10;   // Segmente (NA-29; große Welten 8, damit das Dreiecks-Budget hält)
  b.add(setze(teil(new CylinderGeometry(0.16 * k, 0.24 * k, 1.0 * k, sg), "#8A5A34", { umriss: DEKO_KONTUR }), 0, 0.5 * k, 0));
  [[1.15, 1.3, 1.1], [0.9, 1.1, 1.9], [0.62, 0.9, 2.6]].forEach(([r, h, y]) => b.add(setze(teil(new ConeGeometry(r * k, h * k, sg), f, { umriss: DEKO_KONTUR }), 0, y * k, 0)));
  if (WINTERLICH) b.add(setze(teil(new ConeGeometry(0.4 * k, 0.5 * k, sg), "#FFFFFF"), 0, 3.0 * k, 0));
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
// Blumen als InstancedMesh (Performance + Code-Qualität, 01.11.2026): weniger Objekte, kein späteres Verschmelzen nötig für die Stiele
if (!WELT.insel && WELT.blumen.length && !(JAHRESZEIT_GRAS && SAISON === "winter")) {
  const BL = [WELT.farbe, WELT.farbe, "#FFD84D", "#FFFFFF", WELT.farbe, "#B28DFF", "#FF9E5E"];
  const stielGeo = new CylinderGeometry(0.03, 0.03, 0.4, 4); stielGeo.translate(0, 0.2, 0);
  const blumeGeo = kugel(0.14, 12, 8); blumeGeo.translate(0, 0.45, 0);
  const stiele = new InstancedMesh(stielGeo, mat("#3E9E55"), WELT.blumen.length);
  const o = new Object3D();
  const farben = new Map();
  WELT.blumen.forEach(([x, z, i], idx) => {
    const y = bodenY(x, z);
    o.position.set(x, y, z); o.updateMatrix(); stiele.setMatrixAt(idx, o.matrix);
    const c = BL[i % BL.length];
    if (!farben.has(c)) farben.set(c, []);
    farben.get(c).push({ x, y, z });
  });
  stiele.receiveShadow = true; scene.add(stiele);
  farben.forEach((liste, farbe) => {
    const im = new InstancedMesh(blumeGeo, mat(farbe), liste.length);
    liste.forEach((p, i) => { o.position.set(p.x, p.y, p.z); o.updateMatrix(); im.setMatrixAt(i, o.matrix); });
    im.receiveShadow = true; scene.add(im);
  });
}
if (WELT.insel && SAISON !== "winter") {
  const BL = ["#FF6F91", "#FFD84D", "#FFFFFF", "#B28DFF", "#FF9E5E"], n = SAISON === "fruehling" ? 44 : 26;
  const positionen = [];
  for (let i = 0; i < n; i++) {
    const w = i * 2.399, r = 4 + (i * 37 % 70) / 10, x = Math.cos(w) * r, z = Math.sin(w) * r;
    if (Math.hypot(x + 5, z + 4.5) < 3.4) continue;
    positionen.push({ x, z, c: BL[i % BL.length] });
  }
  if (positionen.length) {
    const stielGeo = new CylinderGeometry(0.03, 0.03, 0.4, 4); stielGeo.translate(0, 0.2, 0);
    const blumeGeo = kugel(0.14, 12, 8); blumeGeo.translate(0, 0.45, 0);
    const stiele = new InstancedMesh(stielGeo, mat("#3E9E55"), positionen.length);
    const o = new Object3D();
    const farben = new Map();
    positionen.forEach((p, idx) => {
      o.position.set(p.x, 0.25, p.z); o.updateMatrix(); stiele.setMatrixAt(idx, o.matrix);
      if (!farben.has(p.c)) farben.set(p.c, []);
      farben.get(p.c).push(p);
    });
    stiele.receiveShadow = true; scene.add(stiele);
    farben.forEach((liste, farbe) => {
      const im = new InstancedMesh(blumeGeo, mat(farbe), liste.length);
      liste.forEach((p, i) => { o.position.set(p.x, 0.25, p.z); o.updateMatrix(); im.setMatrixAt(i, o.matrix); });
      im.receiveShadow = true; scene.add(im);
    });
  }
}

// ---------- Deko verschmelzen (je Material ein Mesh) ----------
function verschmelze(gruppe, zelle = 0) {
  // zelle > 0: in Felder dieser Größe aufteilen, damit entfernte Teile großer Welten nicht gezeichnet werden (Bild und Schatten, NA-29)
  gruppe.updateMatrixWorld(true);
  const felder = new Map(), wp = new Vector3();
  gruppe.traverse(m => {
    if (!m.isMesh || Array.isArray(m.material)) return;
    let g = m.geometry.clone(); g.applyMatrix4(m.matrixWorld);
    if (!g.index) { const n = g.attributes.position.count; g.setIndex([...Array(n).keys()]); }
    m.getWorldPosition(wp);
    const feld = zelle ? Math.floor(wp.x / zelle) + "," + Math.floor(wp.z / zelle) : "";
    if (!felder.has(feld)) felder.set(feld, new Map());
    const sammel = felder.get(feld), vc = gruppeVon(m.material), key = vc || m.material;
    const e = sammel.get(key) || { teile: [], farben: vc ? [] : null, schatten: false };
    e.teile.push(g); if (vc) e.farben.push(m.material.color); e.schatten = e.schatten || m.castShadow; sammel.set(key, e);
  });
  felder.forEach(sammel => sammel.forEach(({ teile, farben, schatten }, material) => {
    const m = new Mesh(fuegeZusammen(teile, farben), material); m.castShadow = schatten; m.receiveShadow = true; scene.add(m);
  }));
}
// Viele Geometrien (schon im Zielkoordinatensystem) zu einer: nur Position, Normale, Index
function fuegeZusammen(teile, farben = null) {
  let anzahl = 0, idxAnzahl = 0; teile.forEach(g => { anzahl += g.attributes.position.count; idxAnzahl += g.index.count; });
  const pos = new Float32Array(anzahl * 3), nor = new Float32Array(anzahl * 3), idx = new Uint32Array(idxAnzahl), col = farben ? new Float32Array(anzahl * 3) : null;
  let o = 0, oi = 0;
  teile.forEach((g, t) => {
    const n = g.attributes.position.count;
    pos.set(g.attributes.position.array, o * 3); if (g.attributes.normal) nor.set(g.attributes.normal.array, o * 3);
    if (col) { const c = farben[t]; for (let k = 0; k < n; k++) { col[(o + k) * 3] = c.r; col[(o + k) * 3 + 1] = c.g; col[(o + k) * 3 + 2] = c.b; } }
    const ix = g.index.array; for (let k = 0; k < ix.length; k++) idx[oi + k] = ix[k] + o;
    o += n; oi += ix.length; g.dispose();
  });
  const geo = new BufferGeometry(); geo.setAttribute("position", new Float32BufferAttribute(pos, 3)); geo.setAttribute("normal", new Float32BufferAttribute(nor, 3)); geo.setIndex(new BufferAttribute(idx, 1));
  if (col) geo.setAttribute("color", new Float32BufferAttribute(col, 3));
  geo.computeBoundingSphere(); geo.computeBoundingBox();
  return geo;
}
// Lokal verschmelzen (NA-29, Leistungsbudget): alle starren Teile unter `wurzel` je Material zu einem Mesh, das Kind von `wurzel` bleibt –
// so bleiben Antippen (Raycast), Hüpfen, Drehen und Laufen des Ganzen erhalten. Teilbäume in `ausnahmen` (Arme, Beine, Schwanz, Früchte …)
// bleiben unverändert. Meshes mit Bild-Textur (map) bleiben ebenfalls einzeln. Aus Teil + Kontur je Teil wird so ein Aufruf je Farbe.
// Materialien mit fester Farbe werden zu Vertex-Farben eines gemeinsamen Materials (ein Aufruf statt einer je Farbe).
// Ausgenommen: Kontur, durchsichtige, mit Bild, und Materialien, deren Farbe sich später ändert (userData.lebt).
const TOON_VC = new MeshToonMaterial({ vertexColors: true, gradientMap: verlauf }), BASIC_VC = new MeshBasicMaterial({ vertexColors: true });
function gruppeVon(m) {
  if (m === UMRISS || m.transparent || m.map || m.userData.lebt || m.vertexColors || m.side !== 0) return null;
  if (m.isMeshToonMaterial && m.gradientMap === verlauf) return TOON_VC;
  if (m.isMeshBasicMaterial) return BASIC_VC;
  return null;
}
function verschmelzeLokal(wurzel, ausnahmen = []) {
  if (!wurzel) return;
  const aus = new Set(ausnahmen.filter(Boolean)), sammel = new Map(), weg = [];
  wurzel.updateMatrixWorld(true);
  const inv = new Matrix4().copy(wurzel.matrixWorld).invert(), rel = new Matrix4();
  (function besuche(o) {
    if (aus.has(o)) return;
    if (o !== wurzel && o.isMesh && !o.isInstancedMesh && !Array.isArray(o.material) && !o.material.map && !o.userData.bleibt) {
      const g = o.geometry.clone(); g.applyMatrix4(rel.multiplyMatrices(inv, o.matrixWorld));
      if (!g.index) { const n = g.attributes.position.count; g.setIndex([...Array(n).keys()]); }
      if (!g.attributes.normal) g.computeVertexNormals();
      const vc = gruppeVon(o.material), key = vc || o.material;
      const e = sammel.get(key) || { teile: [], farben: vc ? [] : null, schatten: false }; e.teile.push(g); if (vc) e.farben.push(o.material.color); e.schatten = e.schatten || o.castShadow; sammel.set(key, e);
      weg.push(o);
    }
    o.children.forEach(besuche);
  })(wurzel);
  if (weg.length < 2) { sammel.forEach(e => e.teile.forEach(g => g.dispose())); return; }
  const wegSet = new Set(weg);
  // Kinder, die nicht verschmolzen werden (Sprites, Ausnahmen unter einem Teil), an die Wurzel hängen – Lage bleibt gleich
  weg.forEach(m => [...m.children].forEach(c => { if (!wegSet.has(c)) wurzel.attach(c); }));
  weg.forEach(m => { if (m.parent) m.parent.remove(m); });
  sammel.forEach(({ teile, farben, schatten }, material) => { const m = new Mesh(fuegeZusammen(teile, farben), material); m.castShadow = schatten; m.receiveShadow = true; wurzel.add(m); });
}
// ---------- Steg mit Pixels Boot (Ankunft im Prolog, NA-11) ----------
// Liegt am Südufer (zur Kamera hin), damit die Ankunft gleich zu sehen ist. Wird mit der Deko verschmolzen.
{
  const laenge = STEG.z1 - STEG.z0, mz = (STEG.z0 + STEG.z1) / 2;
  deko.add(setze(teil(new BoxGeometry(1.4, 0.14, laenge), "#C8955B"), STEG.x, 0.2, mz));
  for (let i = 0; i < 4; i++) [-0.62, 0.62].forEach(dx => deko.add(setze(teil(new CylinderGeometry(0.09, 0.09, 1.1, 8), "#9A6A3F"), STEG.x + dx, -0.38, STEG.z0 + 0.6 + i * (laenge - 0.9) / 3)));
  const rumpf = teil(new SphereGeometry(1, EINFACH ? 12 : 20, EINFACH ? 6 : 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), "#E2604F");
  rumpf.scale.set(0.8, 0.5, 1.6); deko.add(setze(rumpf, STEG.x + 1.55, -0.18, STEG.z1 - 0.9));
  deko.add(setze(teil(new BoxGeometry(1.2, 0.1, 0.35), "#9A6A3F"), STEG.x + 1.55, -0.3, STEG.z1 - 0.9));
  deko.add(setze(teil(new CylinderGeometry(0.05, 0.05, 1.5, 6), "#9A6A3F"), STEG.x + 1.55, 0.4, STEG.z1 - 0.4));
  deko.add(setze(teil(new BoxGeometry(0.04, 0.32, 0.5), "#FFC83D"), STEG.x + 1.55, 0.98, STEG.z1 - 0.15));
}
// ---------- Sonnenuhr am Steg (NA-13): dunkel ohne Spielzeit, hell mit Spielzeit ----------
// „Die Sonne für die Spielorte – sie geht auf, wenn du gelernt hast.“ Fortschritt des Lernblocks färbt die Sonne langsam gelb.
{
  const y = bodenY(SU.x, SU.z);
  deko.add(setze(teil(new CylinderGeometry(0.42, 0.5, 0.7, 14), "#D9CDB8"), SU.x, y + 0.35, SU.z));
  deko.add(setze(teil(new CylinderGeometry(0.62, 0.62, 0.08, 20), "#F3E9D8"), SU.x, y + 0.74, SU.z));
  const zeiger = teil(new BoxGeometry(0.06, 0.4, 0.5), "#9A6A3F"); zeiger.rotation.x = -0.6; deko.add(setze(zeiger, SU.x, y + 0.92, SU.z));
  deko.add(setze(teil(new CylinderGeometry(0.04, 0.04, 0.8, 6), "#9A6A3F"), SU.x - 0.5, y + 1.1, SU.z));
  block(SU.x, SU.z, 0.6);
}
// Laternen (UX-Paket 2, 07.11.2026): zwei an der Haustür, eine an der Sonnenuhr – die Kugel nutzt fensterMat (tags hellblau, abends/nachts warm);
// Teile der Deko, also nach dem Verschmelzen fast keine zusätzlichen Zeichenaufrufe
const LATERNEN = [];
const fensterMat = new MeshBasicMaterial({ color: NACHT || DAEMMER ? "#FFD46B" : "#9BD7F5" });
{
  const h = KI.HAUS_DREH, lokal = (lx, lz) => [P.haus[0] + lx * Math.cos(h) + lz * Math.sin(h), P.haus[1] - lx * Math.sin(h) + lz * Math.cos(h)];
  [lokal(1.9, 2.1), lokal(-1.9, 2.1), [SU.x + 0.9, SU.z - 0.7]].forEach(([x, z]) => {
    const y = bodenY(x, z);
    deko.add(setze(teil(new CylinderGeometry(0.06, 0.09, 1.7, 8), "#6B5A7A"), x, y + 0.85, z));
    deko.add(setze(teil(new CylinderGeometry(0.2, 0.14, 0.1, 8), "#4A3558", { dicke: 1.08 }), x, y + 1.98, z));
    deko.add(setze(teil(kugel(0.17, 12, 8), fensterMat, { dicke: 1.1 }), x, y + 1.8, z));
    LATERNEN.push({ x, y: y + 1.8, z });
  });
}
verschmelze(deko, !WELT.insel && WELT.R > 16 ? 12 : 0);   // große Welten in Feldern (NA-29)
const sonnenMat = new MeshBasicMaterial({ color: "#7E7A92" });
const uhrSonne = setze(new Mesh(kugel(0.22, 16, 12), sonnenMat), SU.x - 0.5, bodenY(SU.x, SU.z) + 1.6, SU.z); scene.add(uhrSonne);
const SONNE_DUNKEL = new Color("#7E7A92"), SONNE_HELL = new Color("#FFC83D");
const sonnenuhr = K.sonnenuhr;   // Zustand: hell 0…1 (1 = Spielzeit), genug = für heute genug gespielt
function zeigeSonnenuhr() { const u = sonnenuhr(); sonnenMat.color.copy(SONNE_DUNKEL).lerp(SONNE_HELL, u.spielen ? 1 : u.hell * 0.6); uhrSonne.scale.setScalar(u.spielen ? 1.25 : 1); }
zeigeSonnenuhr(); setInterval(zeigeSonnenuhr, 5000);

// ---------- Nebelrand (NA-13): die Insel liegt im Nebel, der Wissensbaum vertreibt ihn ----------
// Stufe = höchstes von Kapitel und Lernfunden (1 / 5 / 15 Funde) → bestehende Kinder mit vielen Funden sehen keinen Nebel.
// Kostet höchstens 1 Zeichenaufruf (ein Nebelband über dem Wasser) plus die Szene-Fog-Werte.
const NEBEL = KI.NEBEL, nebelStufe = K.nebelStufe;
let nebelJetzt = nebelStufe(), nebelBasis = { near: 32, far: 80 }, nebelDrinnen = false;
const nebelBand = (() => {
  const g = new CylinderGeometry(1, 1, 1.6, EINFACH ? 32 : 64, 1, true), farben = [];
  const pos = g.attributes.position; for (let i = 0; i < pos.count; i++) { const unten = pos.getY(i) < 0; farben.push(1, 1, 1, unten ? 1 : 0); }
  g.setAttribute("color", new Float32BufferAttribute(farben, 4)); g.translate(0, 0.8, 0);
  const m = new Mesh(g, new MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: DoubleSide, fog: false }));
  m.position.y = -0.55; m.renderOrder = 2; scene.add(m); return m;
})();
function wendeNebelAn() {
  const n = NEBEL[nebelJetzt];
  scene.fog.near = Math.min(nebelBasis.near, n.near); scene.fog.far = Math.min(nebelBasis.far, n.far);
  nebelBand.visible = n.a > 0 && !nebelDrinnen; if (n.a > 0) { nebelBand.scale.set(n.r, 1, n.r); nebelBand.material.opacity = n.a; }
}
wendeNebelAn();
// Der Nebel weicht (z. B. nach der ersten Frucht): sanft über 3 Sekunden, zeitabhängig
function nebelWeicht() {
  const ziel = nebelStufe(); if (ziel <= nebelJetzt) return false;
  const von = NEBEL[nebelJetzt], nach = NEBEL[ziel], t0 = performance.now();
  const schritt = () => {
    const f = Math.min(1, (performance.now() - t0) / 3000), e = f * f * (3 - 2 * f);
    scene.fog.near = Math.min(nebelBasis.near, MathUtils.lerp(von.near, nach.near, e)); scene.fog.far = Math.min(nebelBasis.far, MathUtils.lerp(von.far, nach.far, e));
    const r = MathUtils.lerp(von.r || UFER + 16, nach.r || UFER + 16, e); nebelBand.scale.set(r, 1, r); nebelBand.material.opacity = MathUtils.lerp(von.a, nach.a, e);
    if (f < 1) requestAnimationFrame(schritt); else { nebelJetzt = ziel; wendeNebelAn(); }
  };
  schritt(); return true;
}

// ---------- Haus ----------
let hausObj = null, prolog = null;   // prolog: läuft gerade die Ankunft (NA-11)?
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
  h.position.set(P.haus[0], bodenY(P.haus[0], P.haus[1]), P.haus[1]); h.rotation.y = KI.HAUS_DREH; scene.add(h); block(P.haus[0], P.haus[1], 2.3);
  antippbar(h, () => prolog ? reingehen() : spielOrt(() => reingehen()), ["🚪", "Reingehen"], 3.4);
  hausObj = h; starr.push([h]);
}
// Warmes Licht vor der Haustür bei Dämmerung und Nacht (UX-Paket 2): ein Punktlicht, nicht in Stufe „einfach“
let tuerLicht = null;
if ((NACHT || DAEMMER) && !EINFACH) {
  const { x, z } = KI.vorDerTuer();
  tuerLicht = new PointLight("#FFD46B", NACHT ? 18 : 9, 9, 2); tuerLicht.position.set(x, bodenY(x, z) + 2.2, z); scene.add(tuerLicht);
}

// ---------- Wolken, Sterne, Schnee ----------
const wolken = [];
for (let i = 0; i < 5; i++) {
  const w = new Group();
  const wm = new MeshLambertMaterial({ color: NACHT ? "#6E7FB0" : "#ffffff" });   // ein Material je Wolke → 1 Aufruf nach dem Verschmelzen
  [[0, 0, 0, 1.4], [1.3, -0.2, 0, 1], [-1.3, -0.25, 0.1, 1.05], [0.4, 0.5, -0.3, 0.9]].forEach(([x, y, z, r]) =>
    w.add(setze(new Mesh(kugel(r, 18, 12), wm), x, y, z)));
  w.position.set(-30 + i * 15, 13 + (i % 2) * 2, -22 + (i % 3) * 7); scene.add(w); wolken.push(w); starr.push([w]);
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
// Abruf, Cache und Texte im Insel-Kern; hier nur das Einfärben von Himmel, Licht, Wolken, Regen und Schnee.
let wetter = null, regen = null, blitz = 0; const SONNE_BASIS = sonne.intensity;
function wendeWetterAn(w) {
  wetter = w; const art = w.art;
  sonne.intensity = SONNE_BASIS * ({ wolken: 0.7, nebel: 0.6, regen: 0.5, gewitter: 0.4, schnee: 0.75 }[art] || 1);
  const grau = { wolken: "#B7C7D3", nebel: "#C9D1D6", regen: "#8FA2B2", gewitter: "#6C7A8C", schnee: "#D5DEE6" }[art];
  if (grau && !NACHT) { scene.background = new Color(grau); scene.fog.color.set(grau); }
  nebelBasis = art === "nebel" ? { near: 6, far: 34 } : art === "regen" || art === "gewitter" || art === "schnee" ? { near: 18, far: 60 } : { near: 32, far: 80 };
  wendeNebelAn();
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
const wetterSticker = (w) => K.wetterSticker(w, NACHT);
const wetterSatz = () => K.wetterSatz(wetter);
async function holeWetter() { const w = await K.holeWetter(); if (w) { wendeWetterAn(w); zeigeWetterInfo(); wetterSticker(w); } }
{
  const st = K.startWetter(q);
  if (st.sofort) { wendeWetterAn(st.sofort); if (st.cache) setTimeout(() => wetterSticker(st.sofort), 1500); }
  if (st.holen) holeWetter();
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
antippbar(station, () => zeigeAntwort(K.antwort("station", { wetter })), ...K.aktionFuer("station"));
starr.push([station, [windrad]], [windrad]);

// ---------- Leuchtturm mit Höhle am Ufer (07.11.2026, Kapitel 6 „Der Leuchtturm“) ----------
// Vor Kapitel 6 dunkel; danach leuchtet die Lampe, nachts kreist ein Lichtstrahl über die Insel (zwei durchsichtige Kegel, 1–2 Zeichenaufrufe).
const leuchtturm = new Group();
const lampeMat = new MeshBasicMaterial({ color: "#8E879E" });
const lichtStrahl = new Group();
{
  const [x, z, d] = P.leuchtturm; leuchtturm.position.set(x, bodenY(x, z), z); leuchtturm.rotation.y = d; scene.add(leuchtturm); block(x, z, 1.25);
  const fels = teil(kugel(1.25, 18, 12), "#9C93A8"); fels.scale.set(1, 0.55, 1); leuchtturm.add(setze(fels, 0, 0.1, 0));
  const tor = new Mesh(new CircleGeometry(0.42, 18, 0, Math.PI), mat("#2B2350")); leuchtturm.add(setze(tor, 0, 0.05, 1.02)); tor.rotation.x = -0.35;   // Höhleneingang zur Mitte
  leuchtturm.add(setze(teil(new CylinderGeometry(0.42, 0.62, 2.4, 16), "#FFFFFF"), 0, 1.75, -0.1));
  [1.15, 2.15].forEach((y, i) => leuchtturm.add(setze(teil(new CylinderGeometry(0.5 - i * 0.07, 0.55 - i * 0.07, 0.38, 16), "#FF6F61", { umriss: false }), 0, y, -0.1)));
  leuchtturm.add(setze(teil(new CylinderGeometry(0.62, 0.62, 0.1, 16), "#3B1F63", { umriss: false }), 0, 2.98, -0.1));
  const lampe = new Mesh(new CylinderGeometry(0.3, 0.3, 0.42, 12), lampeMat); lampe.userData.bleibt = true; leuchtturm.add(setze(lampe, 0, 3.24, -0.1));
  leuchtturm.add(setze(teil(new ConeGeometry(0.44, 0.42, 16), "#FF6F61"), 0, 3.66, -0.1));
  lichtStrahl.position.set(0, 3.24, -0.1); leuchtturm.add(lichtStrahl);
  const strahlMat = new MeshBasicMaterial({ color: "#FFE680", transparent: true, opacity: 0.32, depthWrite: false });
  [1, -1].forEach(s => { const k = new Mesh(new ConeGeometry(0.9, 9, 14, 1, true), strahlMat); k.rotation.z = s * Math.PI / 2; k.position.x = s * 4.6; lichtStrahl.add(k); });
  lichtStrahl.visible = false;
  antippbar(leuchtturm, () => zeigeAntwort(K.antwort("leuchtturm")), ...K.aktionFuer("leuchtturm"));
  starr.push([leuchtturm, [lichtStrahl, lampe]]);
}
// Lampe an, sobald Kapitel 6 erreicht ist (auch direkt nach der Szene); Strahl nur nachts und nicht bei „Bewegung reduzieren“
function schalteLeuchtturm() {
  const an = K.leuchtturmOffen();
  lampeMat.color.set(an ? "#FFE14D" : "#8E879E");
  lichtStrahl.visible = an && NACHT;
  Object.assign(leuchtturm.userData, { aktion: K.aktionFuer("leuchtturm")[0], nah: K.aktionFuer("leuchtturm")[1] });
}
schalteLeuchtturm();

// ---------- Wehendes Gras ----------
let halme = null; const halmDaten = [];
const MIT_GRAS = WELT.insel ? SAISON !== "winter" : !WINTERLICH && !["wueste"].includes(WELT.biom) && !(JAHRESZEIT_GRAS && SAISON === "winter");
// (30.10.2026) Gras ruhiger: Halme kürzer und breiter, Farbe nur etwas dunkler als der Boden (vorher fast schwarzgrüne Spitzen), etwas weniger Halme
const HALME = WELT.insel ? 560 : Math.min(560, Math.round(560 * (WELT.rand / 12.9) ** 2));
if (!EINFACH && MIT_GRAS) {
  const geo = new ConeGeometry(0.075, 0.34, 4); geo.translate(0, 0.16, 0);
  // eigenes Material (nicht aus dem mat()-Speicher): das Wiegen im Wind läuft im Vertex-Shader (01.11.2026, vorher jedes zweite Bild 560 Matrizen in JavaScript)
  const halmMat = new MeshToonMaterial({ color: "#" + new Color(GRAS).multiplyScalar(0.86).getHexString(), gradientMap: verlauf });
  halmMat.onBeforeCompile = (sh) => {
    sh.uniforms.uZeit = ZEIT;
    sh.vertexShader = "uniform float uZeit;\n" + sh.vertexShader.replace("#include <begin_vertex>", `vec3 transformed = vec3(position);
      #ifdef USE_INSTANCING
        vec3 hp = vec3(instanceMatrix[3]); float ph = hp.x * 1.7 + hp.z * 2.3;
        transformed.z += sin(uZeit * 1.4 + ph + hp.x * 0.3) * 0.12 * position.y;
        transformed.x += cos(uZeit * 1.2 + ph) * 0.08 * position.y;
      #endif`);
  };
  halme = new InstancedMesh(geo, halmMat, HALME);
  const o = new Object3D();
  const HX = WELT.insel ? -5 : P.haus[0], HZ = WELT.insel ? -4.5 : P.haus[1], RW = WELT.insel ? 10.5 : WELT.rand - 2.4;
  for (let i = 0; i < HALME; i++) {
    const w = Math.random() * Math.PI * 2, r = 2 + Math.sqrt(Math.random()) * RW, x = Math.cos(w) * r, z = Math.sin(w) * r;
    if (Math.hypot(x - HX, z - HZ) < 2.6 || (WELT.see && Math.hypot(x - WELT.see.x, z - WELT.see.z) < WELT.see.r + 0.4)) { halmDaten.push({ x: 0, z: 0, p: 0, s: 0 }); o.scale.setScalar(0); o.updateMatrix(); halme.setMatrixAt(i, o.matrix); continue; }
    halmDaten.push({ x, z, y: bodenY(x, z), p: Math.random() * 6, s: 0.6 + Math.random() * 0.6 });
    o.position.set(x, bodenY(x, z), z); o.scale.setScalar(halmDaten[i].s); o.updateMatrix(); halme.setMatrixAt(i, o.matrix);
  }
  halme.receiveShadow = true; scene.add(halme);
}

// ---------- Figur nach dem Look aus dem Kleiderschrank ----------
// (UX-Paket 2) Frisuren mit Pony in 2D; Winkel, um den die Arme von der Hüfte abstehen
const PONY = ["lang", "wellen", "zoepfe", "bob", "kurz", "schulterlang", "pferd", "seitenzopf", "dutt", "spacebuns", "scheitel"], ARM_WINKEL = 0.3;
const LANG = ["lang", "wellen", "locken"], KURZ = ["bob", "kurz", "scheitel", "undercut", "igel", "wuschel", "kurzlocken", "afro", "schulterlang"], HOSEN = ["hose", "jeans", "jogging", "leggings", "cargo", "bermuda"];
// Anzüge aus „Kleider & Anzüge“ (30.10.2026) haben Hosenbeine statt Rock
const ANZUG = { ritter: "#B8C2CF", astronaut: "#F4F6FA", pirat: "#3A3550", feuerwehr: null, dinokostuem: null };
// (UX-Paket 2) Augenweiß als Toon-Material: nachts dunkelt es mit – als MeshBasicMaterial leuchteten die Augen aus dem dunklen Gesicht
const WEISS_AUGE = mat("#FFFFFF"), IRIS = new MeshBasicMaterial({ color: "#6B4A2E" });
function figur(look) {
  const f = new Group(), haut = look.figur.farbe, haarF = (look.haare && look.haare.farbe) || "#8A5A34", haarId = (look.haare && look.haare.id) || "lang";
  const koerper = new Group(); f.add(koerper);
  const kleid = look.kleid, oben = kleid ? kleid.farbe : (look.oberteil ? look.oberteil.farbe : "#FF9BC8");
  const anzug = kleid && kleid.id in ANZUG;
  const unterId = anzug ? "hose" : kleid ? "kleid" : (look.unterteil ? look.unterteil.id : "rock"), unten = anzug ? (ANZUG[kleid.id] || kleid.farbe) : kleid ? kleid.farbe : (look.unterteil ? look.unterteil.farbe : "#7B55B8");
  const schuhF = (look.schuhe && look.schuhe.farbe) || "#FFFFFF";
  const ohneBeine = kleid && kleid.id === "meerjungfrau", langesKleid = kleid && ["ball", "fee", "meerjungfrau"].includes(kleid.id);
  const hose = HOSEN.includes(unterId), shorts = unterId === "shorts";
  // Unterteil
  // (30.10.2026) Rock und Hose reichen nur bis zur Taille, darüber ein eigener Rumpf in der Farbe des Oberteils – vorher steckte das
  // Oberteil fast ganz im Rock und die Figur sah aus wie eine Glocke. Kleider bleiben ein Stück bis oben.
  if (kleid && !anzug) {
    const lang = langesKleid ? 0.5 : 0;
    const profil = [new Vector2(0.01, -lang), new Vector2(0.52 + lang * 0.25, -lang), new Vector2(0.48 + lang * 0.2, 0.15 - lang * 0.5), new Vector2(0.34, 0.55), new Vector2(0.28, 0.8), new Vector2(0.01, 0.85)];
    koerper.add(setze(teil(new LatheGeometry(profil, 28), unten), 0, 0.56, 0));
    koerper.add(setze(teil(new CapsuleGeometry(0.27, 0.36, 6, 20), oben), 0, 1.3, 0));
  } else {
    if (!hose && !shorts) {
      const profil = [new Vector2(0.01, 0), new Vector2(0.5, 0), new Vector2(0.46, 0.14), new Vector2(0.31, 0.5), new Vector2(0.01, 0.52)];
      koerper.add(setze(teil(new LatheGeometry(profil, 28), unten), 0, 0.56, 0));
    } else koerper.add(setze(teil(new CylinderGeometry(0.29, 0.31, 0.26, 20), unten), 0, 0.96, 0));
    koerper.add(setze(teil(new CapsuleGeometry(0.27, 0.36, 6, 20), oben), 0, 1.3, 0));
  }
  // Beine
  const beine = [-0.15, 0.15].map(x => {
    const b = new Group(); b.position.set(x, 0.92, 0);
    if (!ohneBeine) {
      b.add(setze(teil(new CapsuleGeometry(0.1, 0.62, 4, 12), haut), 0, -0.42, 0));
      if (hose || shorts) { const h = teil(new CapsuleGeometry(0.12, shorts ? 0.18 : 0.66, 4, 12), unten); setze(h, 0, shorts ? -0.12 : -0.4, 0); b.add(h); }
      b.add(setze(teil(kugel(0.14), schuhF, { dicke: 1.12 }), 0, -0.84, 0.06));
    }
    koerper.add(b); return b;
  });
  // Arme (UX-Paket 2, 07.11.2026): Schulterkugel am Drehpunkt, Drehpunkt etwas weiter außen, Hand mit Daumen – vorher wuchsen die Arme
  // ohne Schulter aus der Brust und die Hände waren Fäustlinge
  const arme = [-1, 1].map(s => {
    const a = new Group(); a.position.set(0.36 * s, 1.52, 0);
    const schulter = teil(kugel(0.115), oben, { dicke: 1.08 }); schulter.userData.art = "schulter"; a.add(schulter);
    a.add(setze(teil(new CapsuleGeometry(0.085, 0.5, 4, 12), oben), 0, -0.32, 0));
    const hand = teil(kugel(0.1), haut, { dicke: 1.12 }); hand.userData.art = "hand"; setze(hand, 0, -0.66, 0); a.add(hand);
    const daumen = teil(kugel(0.045), haut, { dicke: 1.1 }); daumen.userData.art = "daumen"; setze(daumen, -0.075 * s, 0.03, 0.06); hand.add(daumen);
    a.rotation.z = -ARM_WINKEL * s; koerper.add(a); return a;
  });
  // Kopf und Frisur
  // (03.11.2026) Proportionen wie die freigegebene 2D-Figur: Kopf etwa ein Drittel kleiner, längere Beine und Arme, Hände an der Hüfte
  const kopf = new Group(); kopf.position.y = 2.02; kopf.scale.setScalar(0.72); koerper.add(kopf);
  koerper.add(setze(teil(new CylinderGeometry(0.1, 0.11, 0.2, 14), haut), 0, 1.66, 0));   // Hals   // (02.11.2026) wieder normale Kopfgröße statt Kindchenschema
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
  if (haarId === "schulterlang") haarteil(kugel(0.62), 0, -0.3, -0.16, 1.06, 0.95, 0.85);
  if (haarId === "afro") haarteil(kugel(0.74), 0, 0.18, -0.08, 1.05, 0.95, 1);
  const bedeckt = ["cap", "hut", "entdeckerhut", "muetze", "weihnachtsmuetze", "piratenhut"].some(id => (look.extras || {})[id]);   // Spitzen und Locken oben nicht durch den Hut stechen lassen
  if (haarId === "igel" && !bedeckt) for (let i = 0; i < 7; i++) { const w = (i / 6 - 0.5) * 1.6; const z = haarteil(new ConeGeometry(0.11, 0.3, 8), Math.sin(w) * 0.4, 0.6 - Math.abs(w) * 0.12, Math.cos(w) * 0.1 - 0.05); z.rotation.z = -w * 0.5; }
  if ((haarId === "wuschel" || haarId === "kurzlocken") && !bedeckt) { const r = haarId === "wuschel" ? 0.22 : 0.17; [[-0.36, 0.4], [-0.12, 0.55], [0.12, 0.55], [0.36, 0.4], [0, 0.42]].forEach(([x, y]) => haarteil(kugel(r), x, y, 0.2)); }
  if (haarId === "undercut") haarteil(kugel(0.5), 0, 0.42, 0.05, 1, 0.55, 1);
  // Pony (UX-Paket 2): Frisuren mit Pony in 2D bekommen auch in 3D eine runde Stirnfranse – vorher saß das Haar wie ein glatter Helm (auch unter Hüten sichtbar)
  if (PONY.includes(haarId)) { const p = haarteil(kugel(0.5), 0, 0.33, 0.2, 1.1, 0.42, 0.9); p.userData.art = "pony"; }
  // Gesicht
  // Augen wie die 2D-Figur (03.11.2026): weißes Auge mit brauner Iris, dunkler Pupille und Glanzpunkt – nicht übergroß
  [-1, 1].forEach(s => {
    const w = new Mesh(kugel(0.085, 16, 12), WEISS_AUGE); w.scale.set(1.15, 0.8, 0.45); setze(w, 0.2 * s, 0.02, 0.52); kopf.add(w);
    const iris = new Mesh(kugel(0.052, 14, 10), IRIS); iris.scale.set(1, 1, 0.5); setze(iris, 0.2 * s, 0.015, 0.555); kopf.add(iris);
    const pupille = new Mesh(kugel(0.027, 10, 8), AUGE); pupille.scale.set(1, 1, 0.5); setze(pupille, 0.2 * s, 0.015, 0.575); kopf.add(pupille);
    kopf.add(setze(new Mesh(kugel(0.016, 6, 5), new MeshBasicMaterial({ color: "#ffffff" })), 0.2 * s - 0.02, 0.04, 0.585));
  });
  // Junge/Mädchen (02.11.2026): Mädchen mit Wimpern und feinen Brauen, Jungen mit kräftigen geraden Brauen und breiteren Schultern
  const form = (look.figur && look.figur.form) || (() => { try { return window.Spielwelt.kind().geschlecht; } catch (e) { return "n"; } })();
  [-1, 1].forEach(s => {
    if (form === "w") {
      [0, 1].forEach(i => { const w = new Mesh(new BoxGeometry(0.012, 0.05, 0.012), AUGE); w.position.set(s * (0.245 + i * 0.022), 0.075 + i * 0.012, 0.52 - i * 0.01); w.rotation.z = -s * (0.6 + i * 0.3); kopf.add(w); });
      const b = new Mesh(new BoxGeometry(0.11, 0.014, 0.02), AUGE); b.position.set(s * 0.2, 0.14, 0.53); b.rotation.z = -s * 0.12; kopf.add(b);
    } else if (form === "m") {
      const b = new Mesh(new BoxGeometry(0.13, 0.03, 0.025), AUGE); b.position.set(s * 0.2, 0.13, 0.53); b.rotation.z = s * 0.06; kopf.add(b);
    }
  });
  if (form === "m") koerper.children.forEach(c => { if (c.geometry && c.geometry.type === "CapsuleGeometry" && Math.abs(c.position.y - 1.3) < 0.01) c.scale.set(1.1, 1, 1.05); });
  // (01.11.2026) keine rosa Wangen mehr
  const mund = new Mesh(new TorusGeometry(0.07, 0.018, 6, 12, Math.PI), AUGE); mund.rotation.z = Math.PI; setze(mund, 0, -0.15, 0.55); kopf.add(mund);
  // (07.11.2026) gemeinsames Modul extras3d.js: alle Extras des Kleiderschranks, Dinge in der Hand werden gehalten
  extras3d(look, { kopf, koerper, arme, hand: -0.66, gross: 1.5, hals: 1.6, ruecken: 1.5, umhang: 1.05 }, { teil, kugel, setze, mat, verlauf });
  // Zählung der neuen Teile vor dem Verschmelzen (starr/verschmelzeLokal ersetzt die Einzelteile) – für den Test-Haken __heimat.figurInfo()
  const info = { schulter: 0, daumen: 0, pony: 0 }; f.traverse(o => { if (o.userData && o.userData.art in info) info[o.userData.art]++; });
  f.userData = { koerper, beine, arme, kopf, info };
  return f;
}
const look = (S.lade("anziehen") || {}).aktuell || (window.Figur ? window.Figur.STANDARD() : { figur: { farbe: "#F8D2B8" } });
const ich = figur(look); { const u = ich.userData; starr.push([u.koerper, [...u.beine, ...u.arme]], ...u.beine.map(b => [b]), ...u.arme.map(a => [a])); }
ich.position.set(WELT.insel ? 1 : P.start[0] + 1, 0.25, WELT.insel ? 2 : P.start[1] + 2); ich.position.y = bodenY(ich.position.x, ich.position.z); scene.add(ich);

// ---------- Das eigene Tier ----------
const TP = window.TierPflege, T = window.Tiere;
const tierDaten = TP ? TP.lade() : null;
function tierModell(art, f, stufe) {
  // 02.11.2026: Hund statt Fuchs; Proportionen je Stufe (Baby: großer Kopf, kurze Beine – groß: langer Körper, lange Beine)
  if (art === "fuchs") art = "hund";
  const st = Math.max(0, Math.min(2, stufe || 0));
  const t = new Group(), k = new Group(); t.add(k);
  const H = f.h, L = f.l, D = f.d;
  const bl = [0.1, 0.17, 0.24][st], ll = [0.36, 0.5, 0.62][st], kopfS = [1.25, 1.08, 1][st];
  const leib = teil(new CapsuleGeometry(art === "katze" ? 0.24 : 0.28, ll, 6, 16), H); leib.rotation.x = Math.PI / 2; setze(leib, 0, 0.3 + bl, 0); k.add(leib);
  const bauch = teil(kugel(0.24), L, { umriss: false }); bauch.scale.set(1, 0.8, 1.6); setze(bauch, 0, 0.22 + bl, 0.05); k.add(bauch);
  const kopf = new Group(); kopf.position.set(0, 0.7 + bl, 0.3 + ll * 0.4); kopf.scale.setScalar(kopfS); k.add(kopf);
  kopf.add(teil(kugel(art === "katze" ? 0.3 : 0.3), H));
  const lang = art === "hund" ? [1.1, 1.4, 1.7][st] : art === "drache" ? [1, 1.25, 1.5][st] : 0.7;
  const schnauze = teil(kugel(art === "drache" ? 0.17 : art === "hund" ? 0.15 : 0.13, 14, 10), art === "drache" ? H : L);
  schnauze.scale.set(1, 0.8, lang); setze(schnauze, 0, -0.08, 0.22 + 0.05 * lang); kopf.add(schnauze);
  kopf.add(setze(new Mesh(kugel(0.045), art === "katze" ? new MeshBasicMaterial({ color: "#E88A9C" }) : AUGE), 0, -0.03, art === "katze" ? 0.33 : 0.22 + 0.15 * lang));
  augen(kopf, 0.12, 0.07, 0.26, 0.055);
  [-1, 1].forEach(s => {
    if (art === "drache") { if (st) { const h = teil(new ConeGeometry(0.05 + st * 0.01, 0.12 + st * 0.08, 10), "#FFE7A8", { dicke: 1.12 }); setze(h, 0.13 * s, 0.3, -0.08); h.rotation.z = -0.3 * s; kopf.add(h); } }
    else if (art === "hund") { const o = teil(kugel(0.14, 12, 10), D); o.scale.set(0.45, [1.25, 1.05, 0.9][st], 0.8); setze(o, 0.28 * s, 0.02, -0.02); o.rotation.z = 0.25 * s; kopf.add(o); }   // Schlappohren
    else { const o = teil(new ConeGeometry(0.11, [0.3, 0.26, 0.22][st], 12), H); setze(o, 0.16 * s, 0.3, -0.02); o.rotation.z = -0.25 * s; kopf.add(o); }
  });
  [[-0.14, 0.2], [0.14, 0.2], [-0.14, -0.2], [0.14, -0.2]].forEach(([x, z]) => k.add(setze(teil(new CapsuleGeometry(0.07, bl + 0.06, 4, 10), H), x, (bl + 0.2) / 2, z * (1 + ll))));
  const schwanz = new Group(); schwanz.position.set(0, 0.35 + bl, -0.2 - ll * 0.5); k.add(schwanz);
  if (art === "hund") { const s1 = teil(new CapsuleGeometry(0.06, 0.3 + st * 0.08, 4, 10), H); s1.rotation.x = -0.6; setze(s1, 0, 0.14, -0.1); schwanz.add(s1); }
  else if (art === "katze") { const s1 = teil(new CapsuleGeometry(0.05, 0.45 + st * 0.12, 4, 10), H); s1.rotation.x = -0.9; setze(s1, 0, 0.22, -0.16); schwanz.add(s1); }
  else { const s1 = teil(new ConeGeometry(0.15, 0.5 + st * 0.2, 14), H); s1.rotation.x = -1.9; setze(s1, 0, -0.1, -0.3); schwanz.add(s1);
    for (let i = 0; i < 1 + st * 2; i++) k.add(setze(teil(new ConeGeometry(0.05, 0.14, 8), D, { dicke: 1.12 }), 0, 0.58 + bl - i * 0.02, 0.1 - i * 0.18));
    [-1, 1].forEach(s => { const fl = teil(kugel(0.3), L); fl.scale.set(0.15, [0.3, 0.6, 0.9][st], [0.45, 0.8, 1.1][st]); setze(fl, 0.3 * s, 0.55 + bl, -0.05); fl.rotation.z = 0.6 * s; k.add(fl); }); }
  t.userData = { k, schwanz };
  t.scale.setScalar([0.75, 0.95, 1.15][st]);   // (30.10.2026) etwas größer – neben dem Kind ging das Tier unter
  return t;
}
let tier = null, nest = null;
const NEST = new Vector3(P.nest[0], bodenY(P.nest[0], P.nest[1]), P.nest[1]);
{
  nest = new Group(); nest.position.copy(NEST); scene.add(nest); block(NEST.x, NEST.z, 0.6); starr.push([nest]);
  const ring = teil(new TorusGeometry(0.45, 0.16, 10, 24), "#B98A55"); ring.rotation.x = Math.PI / 2; ring.position.y = 0.12; nest.add(ring);
  nest.add(setze(teil(new CylinderGeometry(0.45, 0.4, 0.12, 24), "#A47746", { umriss: false }), 0, 0.06, 0));
  if (tierDaten && tierDaten.phase === "tier" && T && T.ARTEN[tierDaten.art]) {
    const f = T.ARTEN[tierDaten.art].farben[tierDaten.farbe] || T.ARTEN[tierDaten.art].farben[0];
    tier = tierModell(tierDaten.art, f, TP.stufe ? TP.stufe(tierDaten) : 0);
    tier.position.set(P.tier[0], bodenY(P.tier[0], P.tier[1]), P.tier[1]); scene.add(tier);
    starr.push([tier.userData.k, [tier.userData.schwanz]], [tier.userData.schwanz]);
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
    antippbar(nest, () => zeigeAntwort(K.antwort("nest")));
  } else {
    antippbar(nest, () => zeigeAntwort(K.antwort("nest")));
  }
}

// ---------- Nachbarn ----------
// Eule Ella wie in der 2D-Zeichnung (01.11.2026): braun, großer runder Kopf auf kleinem Körper, helles Gesichtsfeld, große Augen,
// keine Federohren (nur eine kleine Feder-Locke), cremefarbener Bauch, Flügel als Arme
function eule() {
  const g = new Group(), BR = "#B98A66", KO = "#C49470", DK = "#9C6E4E", CR = "#F7E6CF", GE = "#FFF1DC";
  const stumpf = teil(new CylinderGeometry(0.55, 0.65, 0.5, 20), "#9A6A3F"); setze(stumpf, 0, 0.25, 0); g.add(stumpf);
  const ringe = teil(new CylinderGeometry(0.42, 0.42, 0.02, 20), "#C9955E", { umriss: false }); setze(ringe, 0, 0.51, 0); g.add(ringe);
  const k = new Group(); k.position.y = 0.5; g.add(k);
  const b = teil(kugel(0.46), BR, { dicke: 1.05 }); b.scale.set(1, 1.02, 0.92); setze(b, 0, 0.46, 0); k.add(b);
  const bauch = teil(kugel(0.32), CR, { umriss: false }); bauch.scale.set(0.95, 1.05, 0.5); setze(bauch, 0, 0.42, 0.27); k.add(bauch);
  for (let i = 0; i < 3; i++) { const f = new Mesh(new TorusGeometry(0.06, 0.015, 6, 12, Math.PI), mat("#D9B48F")); f.rotation.z = Math.PI; setze(f, (i - 1) * 0.12, 0.4 + (i % 2) * 0.1, 0.43); k.add(f); }
  const kopf = teil(kugel(0.56), KO, { dicke: 1.04 }); kopf.scale.set(1.08, 0.94, 0.95); setze(kopf, 0, 1.18, 0); k.add(kopf);
  const locke = teil(new ConeGeometry(0.07, 0.2, 10), KO); setze(locke, 0.03, 1.72, 0.05); locke.rotation.z = -0.5; k.add(locke);
  [-1, 1].forEach(s => {
    const maske = teil(kugel(0.24), GE, { umriss: false }); maske.scale.set(1, 1, 0.4); setze(maske, 0.2 * s, 1.18, 0.42); k.add(maske);
    const fl = teil(kugel(0.24), DK); fl.scale.set(0.42, 0.85, 0.6); setze(fl, 0.45 * s, 0.5, 0.05); fl.rotation.z = 0.45 * s; k.add(fl);
    const fuss = teil(kugel(0.08), "#F59A3C", { dicke: 1.12 }); fuss.scale.set(1.5, 0.6, 1.3); setze(fuss, 0.16 * s, 0.03, 0.26); k.add(fuss);
  });
  { const kg = new Group(); kg.position.set(0, 1.18, 0); k.add(kg); augen(kg, 0.2, 0.03, 0.53, 0.1); }
  const schnabel = teil(new ConeGeometry(0.07, 0.15, 12), "#F59A3C", { dicke: 1.12 }); schnabel.rotation.x = Math.PI; setze(schnabel, 0, 1.0, 0.56); k.add(schnabel);
  g.userData.koerper = k;
  return g;
}
// Fipsi wie in der 2D-Zeichnung: sitzender Fuchs mit großem Kopf, weißer Gesichtsmaske, rosa Innenohren (ohne Wangen seit 01.11.2026)
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
  const kopf = new Group(); kopf.position.y = 1.16; kopf.scale.setScalar(1.12); k.add(kopf);
  const schaedel = teil(kugel(0.52), O, { dicke: 1.04 }); schaedel.scale.set(1.1, 0.95, 0.95); kopf.add(schaedel);
  const maske = teil(kugel(0.36), W, { umriss: false }); maske.scale.set(1.15, 0.72, 0.6); setze(maske, 0, -0.16, 0.3); kopf.add(maske);
  [-1, 1].forEach(s => {
    const ohr = teil(new ConeGeometry(0.2, 0.46, 16), O); setze(ohr, 0.34 * s, 0.5, -0.02); ohr.rotation.z = -0.32 * s; kopf.add(ohr);
    const innen = new Mesh(new ConeGeometry(0.11, 0.28, 12), mat("#FFC3A0")); setze(innen, 0.33 * s, 0.47, 0.08); innen.rotation.z = -0.32 * s; kopf.add(innen);
  });
  augen(kopf, 0.19, 0.04, 0.44, 0.075);
  const nase = new Mesh(kugel(0.07, 14, 10), AUGE); nase.scale.set(1.3, 1, 0.8); setze(nase, 0, -0.08, 0.53); kopf.add(nase);
  const mund = new Mesh(new TorusGeometry(0.07, 0.016, 6, 12, Math.PI), AUGE); mund.rotation.z = Math.PI; setze(mund, 0, -0.2, 0.5); kopf.add(mund);
  // blaues Halstuch als Erkennungszeichen
  const tuch = teil(new TorusGeometry(0.28, 0.07, 10, 24), "#3AA0E0"); tuch.rotation.x = Math.PI / 2; setze(tuch, 0, 0.78, 0.02); k.add(tuch);
  g.userData.koerper = k; g.userData.schwanz = sw;
  return g;
}
// Robo Pixel wie in der 2D-Zeichnung (01.11.2026): runder blauer Kopf mit dunklem Bildschirm, leuchtende Lach-Augen, Wangen, gelbe Ohren, Antenne
function robo() {
  const g = new Group(), BL = "#58B7F0", HB = "#7FCBF5", LEUCHT = new MeshBasicMaterial({ color: "#7CF0FF" });
  const k = new Group(); g.add(k);
  k.add(setze(teil(new CapsuleGeometry(0.36, 0.3, 6, 18), BL), 0, 0.72, 0));
  k.add(setze(teil(new BoxGeometry(0.34, 0.2, 0.06), "#E8F5FF", { dicke: 1.08 }), 0, 0.78, 0.36));
  ["#FF5C7A", "#FFC83D", "#5CCBA6"].forEach((f, i) => k.add(setze(new Mesh(kugel(0.035, 8, 6), new MeshBasicMaterial({ color: f })), (i - 1) * 0.09, 0.78, 0.4)));
  [-1, 1].forEach(s => { k.add(setze(teil(new CapsuleGeometry(0.09, 0.08, 4, 10), "#3A8FD0"), 0.17 * s, 0.18, 0.02)); const a = teil(new CapsuleGeometry(0.07, 0.28, 4, 10), BL); setze(a, 0.46 * s, 0.78, 0); a.rotation.z = 0.35 * s; k.add(a); });
  const kopf = new Group(); kopf.position.y = 1.55; k.add(kopf);
  const schaedel = teil(new CapsuleGeometry(0.42, 0.34, 8, 24), HB, { dicke: 1.04 }); schaedel.rotation.z = Math.PI / 2; schaedel.scale.set(1, 1, 0.82); kopf.add(schaedel);
  const schirm = teil(new CapsuleGeometry(0.28, 0.3, 6, 20), "#2E2B47", { umriss: false }); schirm.rotation.z = Math.PI / 2; schirm.scale.set(1, 1, 0.25); setze(schirm, 0, 0, 0.29); kopf.add(schirm);
  [-1, 1].forEach(s => {
    const auge = new Mesh(new TorusGeometry(0.075, 0.025, 6, 14, Math.PI), LEUCHT); setze(auge, 0.15 * s, 0.03, 0.37); kopf.add(auge);
    const ohr = teil(new CylinderGeometry(0.07, 0.07, 0.12, 14), "#FFC83D"); ohr.rotation.z = Math.PI / 2; setze(ohr, 0.66 * s, 0, 0); kopf.add(ohr);
  });
  const mund = new Mesh(new TorusGeometry(0.07, 0.022, 6, 14, Math.PI), LEUCHT); mund.rotation.z = Math.PI; setze(mund, 0, -0.1, 0.37); kopf.add(mund);
  kopf.add(setze(new Mesh(new CylinderGeometry(0.02, 0.02, 0.26, 6), mat("#3b1f63")), 0, 0.5, 0));
  kopf.add(setze(teil(kugel(0.09), "#FF5C7A", { dicke: 1.12 }), 0, 0.66, 0));
  g.userData.koerper = k;
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
  const kopf = new Group(); kopf.position.y = 1.2; kopf.scale.setScalar(1.12); k.add(kopf);
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
  const kopf = new Group(); kopf.position.y = 1.34; kopf.scale.setScalar(1.12); k.add(kopf);
  const schaedel = teil(kugel(0.5), B, { dicke: 1.04 }); kopf.add(schaedel);
  const schnauze = teil(kugel(0.24), H, { umriss: false }); schnauze.scale.set(1.15, 0.85, 0.7); setze(schnauze, 0, -0.12, 0.38); kopf.add(schnauze);
  [-1, 1].forEach(s => { const o = teil(kugel(0.17), B); o.scale.set(1, 1, 0.6); setze(o, 0.36 * s, 0.38, -0.02); kopf.add(o); const oi = new Mesh(kugel(0.09, 10, 8), mat("#E9A7A0")); setze(oi, 0.36 * s, 0.38, 0.06); kopf.add(oi); });
  augen(kopf, 0.17, 0.08, 0.48, 0.07);
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
// Platz und Texte der Nachbarn aus dem Kern; hier nur, wie sie in 3D aussehen
const BAU_NACHBAR = { eule, fipsi, robo, baer, biber };
const NACHBARN = KI.nachbarn().map(n => Object.assign(n, { bau: BAU_NACHBAR[n.e] }));
{ const t = tafel("Mathe", "#5CCBA6"), [x, z, d] = P.schild; t.position.set(x, bodenY(x, z), z); t.rotation.y = d; scene.add(t); block(x, z, 0.4); starr.push([t]); }

// Lernfunde des Tages: Wer heute etwas Neues im Fach gelernt hat, wird vom passenden Nachbarn begrüßt.
// Die Nachbarn hüpfen dann ab und zu, bis man mit ihnen gesprochen hat (shared/lernfunde.js).
NACHBARN.forEach(n => {
  const o = n.bau(); n.y = bodenY(n.x, n.z); o.position.set(n.x, n.y, n.z); o.rotation.y = n.dreh; if (n.e !== "🧮") o.scale.multiplyScalar(1.3); scene.add(o); block(n.x, n.z, 0.8);
  n.obj = o; { const u = o.userData; starr.push([o, [u.koerper, u.schwanz]], [u.koerper, [u.schwanz]], [u.schwanz]); }
  const fund = K.fundFuer(n.e);
  n.freut = !!fund && n.e !== "🧮";
  const aktion = fund ? ["🌱", n.e === "🧮" ? "Lesen" : "Reden"] : n.e === "🧮" ? ["🧮", "Lesen"] : ["💬", "Reden"];
  antippbar(o, () => {
    o.userData.huepf = 1; n.freut = false;
    zeigeAntwort(K.nachbarAntwort(n));
  }, aktion, 2.3);
});

// ---------- Kapitel 2 „Fipsis Karte“ (NA-17): neuer Weg von Fipsi zu einem Wegweiser ----------
// Die Schilder zeigen nur Wörter, die das Kind schon hatte (K.wortSchilder); ohne Wörter zeigen sie Pfeile.
// Kostet nach dem Verschmelzen wenige Zeichenaufrufe (Steine + Pfosten) plus je Schild einen (eigene Textur).
let kartenweg = null;
function wortTafel(wort, farbe) {
  const c = document.createElement("canvas"); c.width = 256; c.height = 96;
  const x = c.getContext("2d"); x.fillStyle = farbe; x.beginPath(); x.roundRect ? x.roundRect(4, 4, 248, 88, 22) : x.rect(4, 4, 248, 88); x.fill();
  x.lineWidth = 6; x.strokeStyle = "#3b1f63"; x.stroke();
  x.fillStyle = "#3b1f63"; x.textAlign = "center"; x.textBaseline = "middle";
  if (wort) { let gr = 58; do { x.font = `700 ${gr}px Fredoka, "Trebuchet MS", sans-serif`; gr -= 4; } while (x.measureText(wort).width > 220 && gr > 26); x.fillText(wort, 128, 52); }
  else { x.beginPath(); x.moveTo(60, 48); x.lineTo(176, 48); x.lineWidth = 12; x.stroke(); x.beginPath(); x.moveTo(196, 48); x.lineTo(160, 22); x.lineTo(160, 74); x.closePath(); x.fill(); }
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace;
  const g = new Group(), m = new MeshBasicMaterial({ map: t });
  const vorn = new Mesh(new PlaneGeometry(1.15, 0.43), m), hinten = new Mesh(new PlaneGeometry(1.15, 0.43), m);
  vorn.position.z = 0.035; hinten.position.z = -0.035; hinten.rotation.y = Math.PI; g.add(vorn, hinten);
  g.add(teil(new BoxGeometry(1.2, 0.48, 0.06), farbe));
  return g;
}
function zeigeKartenweg() {
  if (kartenweg) return;
  const [fx, fz] = P.fipsi, [kx, kz] = P.kartenweg, n = Math.max(3, Math.round(Math.hypot(kx - fx, kz - fz) / 0.9));
  kartenweg = new Group(); scene.add(kartenweg);
  const steine = new Group(); kartenweg.add(steine);
  for (let i = 1; i < n; i++) {   // flache Steine von Fipsi bis zum Wegweiser, leicht geschlängelt
    const f = i / n, x = fx + (kx - fx) * f + Math.sin(f * 6) * 0.25, z = fz + (kz - fz) * f + Math.cos(f * 5) * 0.2;
    const st = teil(new CylinderGeometry(0.36, 0.4, 0.1, 14), "#E8D3A8", { umriss: false }); st.receiveShadow = true; setze(st, x, bodenY(x, z) + 0.04, z); steine.add(st);
  }
  verschmelzeLokal(steine, []);
  const pfosten = new Group(), y0 = bodenY(kx, kz); pfosten.position.set(kx, y0, kz); pfosten.rotation.y = Math.atan2(fx - kx, fz - kz); kartenweg.add(pfosten);
  pfosten.add(setze(teil(new CylinderGeometry(0.07, 0.09, 2.3, 8), "#9A6A3F"), 0, 1.15, 0));
  pfosten.add(setze(teil(new ConeGeometry(0.13, 0.22, 8), "#F28C38"), 0, 2.4, 0));
  const woerter = K.wortSchilder(3), farben = ["#FFF3E6", "#FFE7C2", "#FFDCC8"];
  for (let i = 0; i < 3; i++) { const t = wortTafel(woerter[i] || "", farben[i]); t.position.set(0, 1.95 - i * 0.52, 0.1); t.rotation.y = (i % 2 ? -1 : 1) * 0.35; pfosten.add(t); }
  block(kx, kz, 0.5);
  antippbar(pfosten, () => zeigeAntwort(K.antwort("wegweiser")), ...K.aktionFuer("wegweiser"));
}
if (window.Story && Story.kapitel() >= 2) zeigeKartenweg();

// ---------- Wissensbaum ----------
// Wächst mit allen Lernfunden seit Beginn (shared/lernfunde.js), jeder Fund von heute hängt als leuchtende Frucht daran.
// Ohne Lernen passiert nichts Schlimmes: der Baum bleibt einfach, wie er ist (kein Welken, keine Strafe).
const WB = new Vector3(P.wissensbaum[0], bodenY(P.wissensbaum[0], P.wissensbaum[1]), P.wissensbaum[1]);
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
    const farbe = K.fruchtFarbe(f);
    const m = new Mesh(kugel(0.2, 14, 10), new MeshBasicMaterial({ color: farbe }));
    const v = PL[i], r = 1.0 * k + 0.06; setze(m, v.x * r, 2.15 * k + v.y * r, v.z * r); m.scale.setScalar(0.001); m.userData.verz = 0.6 + i * 0.35; g.add(m);
    return m;
  });
  antippbar(g, () => zeigeAntwort(K.antwort("wissensbaum")), ...K.aktionFuer("wissensbaum"));
  starr.push([g, [...fruechte, ...g.children.filter(c => c.userData.licht !== undefined)]]);
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
antippbar(ballons, () => zeigeAntwort(K.antwort("ballons")), ...K.aktionFuer("ballons"));
{ const bunt = ballons.children.filter(b => b.userData.p !== undefined); starr.push([ballons, bunt], ...bunt.map(b => [b])); }
const truhe = new Group(); truhe.position.set(P.truhe[0], WELT.insel ? 0.05 : bodenY(P.truhe[0], P.truhe[1]) - 0.15, P.truhe[1]); truhe.rotation.y = WELT.insel ? 0 : Math.atan2(-P.truhe[0], -P.truhe[1]); scene.add(truhe);
truhe.add(setze(teil(new BoxGeometry(0.9, 0.5, 0.6), "#B9732E"), 0, 0.25, 0));
const deckel = teil(new CylinderGeometry(0.3, 0.3, 0.9, 16, 1, false, 0, Math.PI), "#C98A3E"); deckel.rotation.z = Math.PI / 2; setze(deckel, 0, 0.5, 0); truhe.add(deckel);
truhe.add(setze(teil(new BoxGeometry(0.16, 0.2, 0.05), "#FFC83D", { dicke: 1.1 }), 0, 0.45, 0.32));
antippbar(truhe, () => zeigeAntwort(K.antwort("truhe")), ...K.aktionFuer("truhe")); starr.push([truhe]);

// ---------- Schachtisch mit Schildkröte Tilda (Lernen, daher auch ohne Spielzeit) ----------
{
  const [x, z, d] = P.schach, g = new Group(); g.position.set(x, bodenY(x, z), z); g.rotation.y = d; scene.add(g); block(x, z, 1.1);
  g.add(setze(teil(new CylinderGeometry(0.12, 0.18, 0.75, 10), "#8A5A34"), 0, 0.37, 0));
  g.add(setze(teil(new BoxGeometry(1.2, 0.1, 1.2), "#B98A55"), 0, 0.78, 0));
  for (let a = 0; a < 4; a++) for (let c = 0; c < 4; c++) g.add(setze(new Mesh(new BoxGeometry(0.25, 0.02, 0.25), mat((a + c) % 2 ? "#5C3A21" : "#F3E3C3")), -0.375 + a * 0.25, 0.84, -0.375 + c * 0.25));
  [[-0.25, 0.25, "#FFFFFF"], [0.25, -0.25, "#2E2240"]].forEach(([px, pz, f]) => { g.add(setze(teil(new CylinderGeometry(0.06, 0.09, 0.22, 10), f), px, 0.96, pz)); g.add(setze(teil(kugel(0.07, 10, 8), f), px, 1.1, pz)); });
  // Tilda, die Schildkröte
  const t = new Group(); t.position.set(0.95, 0, 0.2); t.rotation.y = -1.2; g.add(t);
  const panzer = teil(new SphereGeometry(0.42, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), "#4FAF62"); panzer.scale.set(1, 0.85, 1.15); setze(panzer, 0, 0.18, 0); t.add(panzer);
  t.add(setze(teil(new CylinderGeometry(0.43, 0.43, 0.08, 18), "#E8D9A0"), 0, 0.17, 0));
  const kopf = new Group(); kopf.position.set(0, 0.32, 0.5); t.add(kopf); kopf.add(teil(kugel(0.17, 14, 10), "#8FD06A")); augen(kopf, 0.07, 0.04, 0.14, 0.035);
  // Frisur (02.11.2026): braune Locken mit lila Schleife wie in 2D
  [[0, 0.15, -0.02, 0.09], [-0.08, 0.13, 0.03, 0.07], [0.08, 0.13, 0.03, 0.07], [-0.11, 0.07, -0.05, 0.07], [0.11, 0.07, -0.05, 0.07], [0, 0.11, -0.1, 0.08]]
    .forEach(([hx, hy, hz, hr]) => kopf.add(setze(teil(kugel(hr, 10, 8), "#9A5530", { dicke: 1.08 }), hx, hy, hz)));
  [-1, 1].forEach(s2 => { const sl = teil(new ConeGeometry(0.04, 0.08, 8), "#7B55B8", { dicke: 1.1 }); sl.rotation.z = s2 * Math.PI / 2; kopf.add(setze(sl, 0.09 + s2 * 0.05, 0.22, 0)); });
  [[-0.3, 0.35], [0.3, 0.35], [-0.3, -0.35], [0.3, -0.35]].forEach(([fx, fz]) => t.add(setze(teil(kugel(0.1, 10, 8), "#8FD06A"), fx, 0.07, fz)));
  antippbar(g, () => zeigeAntwort(K.antwort("schach")), ...K.aktionFuer("schach")); starr.push([g]);
}

// ---------- Bühne mit Papagei Paula: spielt die eigene Melodie aus dem Atelier, alle tanzen ----------
let tanzBis = 0;
const paula = (() => {
  const g = new Group(), k = new Group(); g.add(k);
  const leib = teil(kugel(0.36), "#4CC27A"); leib.scale.set(1, 1.2, 0.95); setze(leib, 0, 0.6, 0); k.add(leib);
  [-1, 1].forEach(s => { const f = teil(kugel(0.22), "#2E9C5A"); f.scale.set(0.45, 1.1, 0.9); setze(f, 0.36 * s, 0.64, -0.02); f.rotation.z = -0.25 * s; k.add(f); });
  const schwanz = teil(new BoxGeometry(0.2, 0.5, 0.06), "#3A8FD0"); setze(schwanz, 0, 0.2, -0.3); schwanz.rotation.x = 0.5; k.add(schwanz);
  [-1, 1].forEach(s => k.add(setze(teil(kugel(0.07, 8, 6), "#F2A33A"), 0.12 * s, 0.12, 0.05)));
  const kopf = new Group(); kopf.position.y = 1.12; kopf.scale.setScalar(1.15); k.add(kopf);
  kopf.add(teil(kugel(0.34), "#FF6B5C")); const ges = teil(kugel(0.24), "#FFE7DA", { umriss: false }); ges.scale.set(1.1, 0.95, 0.5); setze(ges, 0, -0.02, 0.2); kopf.add(ges);
  augen(kopf, 0.11, 0.05, 0.31, 0.05);
  const schnabel = teil(new ConeGeometry(0.065, 0.16, 10), "#FFC83D"); schnabel.rotation.x = Math.PI / 2 + 0.6; setze(schnabel, 0, -0.1, 0.36); kopf.add(schnabel);
  [-0.12, 0, 0.12].forEach((x, i) => { const f = teil(new ConeGeometry(0.06, 0.2, 8), "#FF5C5C"); setze(f, x, 0.36, -0.04); f.rotation.z = -x * 2; kopf.add(f); });   // Federschopf
  g.userData.koerper = k; return g;
})();
{
  const [x, z, d] = P.buehne, g = new Group(); g.position.set(x, bodenY(x, z), z); g.rotation.y = d; scene.add(g); block(x, z, 1.5);
  g.add(setze(teil(new CylinderGeometry(1.4, 1.5, 0.3, 28), "#B98A55"), 0, 0.15, 0));
  g.add(setze(new Mesh(new CylinderGeometry(1.25, 1.25, 0.02, 28), mat("#FFD9E6")), 0, 0.31, 0));
  [-1, 1].forEach(s => {   // Lautsprecher und Notenständer
    const box = teil(new BoxGeometry(0.4, 0.6, 0.35), "#3b1f63"); setze(box, s * 1.05, 0.6, -0.55); g.add(box);
    g.add(setze(new Mesh(new CircleGeometry(0.13, 16), mat("#FFC83D")), s * 1.05, 0.66, -0.37));
  });
  const note = schildSprite("🎵"); note.position.set(0, 2.3, 0); g.add(note); g.userData.note = note;
  paula.position.set(0, 0.3, 0); g.add(paula); starr.push([g, [paula, note]], [paula]);
  // Melodie und Texte aus dem Insel-Kern; hier tanzen alle mit
  antippbar(g, () => {
    const a = K.antwort("buehne");
    if (a.melodie) { tanzBis = performance.now() + K.spieleMelodie(a.melodie, () => { NACHBARN.forEach(n => { if (n.obj) n.obj.userData.huepf = 1; }); paula.userData.huepf = 1; }); }
    zeigeAntwort(a);
    if (a.melodie && SP && SP.stopp) setTimeout(() => SP.stopp(), 10);
  }, ...K.aktionFuer("buehne"));
}

// ---------- Neue Minispiel-Orte: öffnen sich, wenn der Wissensbaum wächst ----------
function schildSprite(text) {
  const c = document.createElement("canvas"); c.width = c.height = 128; const g2 = c.getContext("2d");
  g2.fillStyle = "rgba(255,255,255,.92)"; g2.beginPath(); g2.arc(64, 64, 56, 0, Math.PI * 2); g2.fill();
  g2.font = "64px sans-serif"; g2.textAlign = "center"; g2.textBaseline = "middle"; g2.fillText(text, 64, 70);
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace;
  // Noto-Bild (Stil A) statt Geräte-Emoji, sobald es geladen ist
  if (window.EmojiBereit) window.EmojiBereit.then(E => E && E.lade(text)).then(img => {
    if (!img) return; g2.clearRect(0, 0, 128, 128); g2.fillStyle = "rgba(255,255,255,.92)"; g2.beginPath(); g2.arc(64, 64, 56, 0, Math.PI * 2); g2.fill();
    g2.drawImage(img, 28, 28, 72, 72); t.needsUpdate = true;
  });
  const sp = new Sprite(new SpriteMaterial({ map: t, depthTest: false })); sp.scale.set(0.9, 0.9, 1); return sp;
}
// Graue Fassung eines Materials für gesperrte Orte – je Ausgangsmaterial nur einmal, damit Verschmelzen wirkt (NA-29)
const GRAU = new Map();
function grauMat(m) { if (m === UMRISS) return m; if (!GRAU.has(m)) { const g = m.clone(); g.color.lerp(new Color("#B9B4C6"), 0.55); GRAU.set(m, g); } return GRAU.get(m); }
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
// Seit 01.11.2026 stehen an den Plätzen der ausgeblendeten Minispiele die neuen Orte: Insel-Garten, Bäckerei Benno, Tierpflege-Station.
// Der Garten zeigt die echten Beete des Kindes (wächst mit); Bäckerei und Station sind feste Häuschen.
const NEU_ORT = S.MINISPIELE_AUS ? { lauf: "garten", kart: "baeckerei", bau: "tierstation" } : {};
const NEU_BAU = {
  garten() {
    const g = new Group(), G = window.Garten, d = G ? G.lade() : { beete: [] };
    const beete = d.beete.slice(0, 3);
    [-1.05, 0, 1.05].forEach((bx, i) => {
      g.add(setze(teil(new BoxGeometry(0.9, 0.22, 1.5), "#7A4A2A", { dicke: 1.03 }), bx, 0.11, 0));
      const z = G ? G.zustand(beete[i] || null) : { art: "leer" };
      if (z.art === "leer" || z.art === "samen") return;
      const h = z.art === "keim" ? 0.25 : z.art === "pflanze" ? 0.5 : 0.65;
      [-0.4, 0.15].forEach(pz => {
        g.add(setze(teil(new ConeGeometry(0.18, h, 7), "#4FAF4F", { dicke: 1.08 }), bx, 0.22 + h / 2, pz));
        if (z.art === "reif") g.add(setze(teil(kugel(0.16, 12, 8), z.p.farbe), bx, 0.25 + h, pz));
      });
    });
    // kleiner Zaun und Gießkanne
    [-1.6, 1.6].forEach(fx => g.add(setze(teil(new BoxGeometry(0.08, 0.6, 1.8), "#E9D3A6", { dicke: 1.05 }), fx, 0.3, 0)));
    const kanne = teil(new CylinderGeometry(0.16, 0.2, 0.32, 10), "#3AA0E0"); g.add(setze(kanne, 1.35, 0.16, 0.95));
    return g;
  },
  baeckerei() {
    const g = new Group();
    g.add(setze(teil(new BoxGeometry(2.0, 1.4, 1.5), "#FFE3B8", { dicke: 1.03 }), 0, 0.7, 0));
    const dach = teil(new ConeGeometry(1.6, 0.9, 4), "#C9573A", { dicke: 1.04 }); dach.rotation.y = Math.PI / 4; g.add(setze(dach, 0, 1.85, 0));
    g.add(setze(teil(new BoxGeometry(1.5, 0.12, 0.5), "#B9732E"), 0, 0.85, 0.95));
    [[-0.45, "#E8A33D"], [0, "#D98B2B"], [0.45, "#F2C46B"]].forEach(([bx, f]) => { const b = teil(kugel(0.17, 12, 8), f); b.scale.set(1.4, 0.7, 1); g.add(setze(b, bx, 1.0, 0.95)); });
    g.add(setze(teil(new CylinderGeometry(0.12, 0.12, 0.6, 10), "#9A9A9A"), 0.6, 2.0, -0.3));
    return g;
  },
  tierstation() {
    const g = new Group();
    g.add(setze(teil(new BoxGeometry(1.8, 1.2, 1.4), "#DFF3E4", { dicke: 1.03 }), 0, 0.6, 0));
    const dach = teil(new BoxGeometry(2.1, 0.18, 1.7), "#4FAF62", { dicke: 1.04 }); g.add(setze(dach, 0, 1.3, 0));
    // rotes Kreuz als Zeichen der Station
    g.add(setze(new Mesh(new BoxGeometry(0.5, 0.14, 0.04), mat("#E0453A")), 0, 0.85, 0.72));
    g.add(setze(new Mesh(new BoxGeometry(0.14, 0.5, 0.04), mat("#E0453A")), 0, 0.85, 0.72));
    // Igel-Körbchen davor
    g.add(setze(teil(new CylinderGeometry(0.35, 0.28, 0.2, 12), "#C9955E"), 1.2, 0.1, 0.8));
    const igel = teil(kugel(0.2, 10, 8), "#7A5A44"); igel.scale.set(1.2, 0.8, 1); g.add(setze(igel, 1.2, 0.28, 0.8));
    return g;
  }
};
["lauf", "kart", "bau"].forEach(id => {
  const neu = NEU_ORT[id];
  if (neu && NEU_BAU[neu]) {
    const [x, z] = P[id], o = NEU_BAU[neu](); o.position.set(x, bodenY(x, z), z); o.rotation.y = Math.atan2(-x, -z); scene.add(o); block(x, z, 1.2);
    if (!K.ortOffen(neu)) { const sp = schildSprite("🔒"); sp.position.set(0, 2.8, 0); o.add(sp); o.traverse(m => { if (m.material && m.material.color && !m.isSprite) m.material = grauMat(m.material); }); }
    antippbar(o, () => zeigeAntwort(K.antwort(neu)), ...K.aktionFuer(neu)); starr.push([o]);
    return;
  }
  const [x, z] = P[id], o = ORT_BAU[id](); o.position.set(x, bodenY(x, z), z); o.rotation.y = Math.atan2(-x, -z); scene.add(o); block(x, z, 1.2);
  const frei = istFrei(id), info = SPIELE[id];
  if (!frei) { const sp = schildSprite("🔒"); sp.position.set(0, 3.2, 0); o.add(sp); o.traverse(m => { if (m.material && m.material.color && !m.isSprite) m.material = grauMat(m.material); }); }
  antippbar(o, () => zeigeAntwort(K.antwort(id)), ...K.aktionFuer(id)); starr.push([o]);
});


// ---------- Zimmer im Haus (eigener Bereich weit weg von der Insel) ----------
// ZX (Mitte des Zimmers) kommt aus dem Kern
let drinnen = false;
const zimmerEigen = [];   // antippbare Teile des Zimmers (werden je für sich verschmolzen)
const zimmer = new Group(); zimmer.position.set(ZX, 0, 0); scene.add(zimmer);
const WAND_HINTEN = new MeshToonMaterial({ color: "#FFD9E6", gradientMap: verlauf }), WAND_SEITE = new MeshToonMaterial({ color: "#FFE9C2", gradientMap: verlauf });
WAND_HINTEN.userData.lebt = WAND_SEITE.userData.lebt = true;   // Farbe ändert sich beim Streichen – nicht in Vertex-Farben einbacken
{
  const boden = new Mesh(new BoxGeometry(8.4, 0.3, 7.4), mat("#E2B47E")); boden.position.y = 0.1; boden.receiveShadow = true; zimmer.add(boden);
  for (let i = -3; i <= 3; i++) zimmer.add(setze(new Mesh(new BoxGeometry(0.04, 0.02, 7.4), mat("#C9955E")), i * 1.2, 0.26, 0));
  const wand = (b, h, t, x, z, m) => { const w = new Mesh(new BoxGeometry(b, h, t), m); w.position.set(x, h / 2 + 0.25, z); w.receiveShadow = true; zimmer.add(w); return w; };
  wand(8.4, 3.2, 0.25, 0, -3.7, WAND_HINTEN); wand(0.25, 3.2, 7.4, -4.2, 0, WAND_SEITE); wand(0.25, 3.2, 7.4, 4.2, 0, WAND_SEITE);
  zimmer.add(setze(teil(new BoxGeometry(1.8, 1.2, 0.08), fensterMat, { dicke: 1.04 }), 0, 2.1, -3.55));
  zimmer.add(setze(new Mesh(new BoxGeometry(0.08, 1.2, 0.1), mat("#FFFFFF")), 0, 2.1, -3.5));
  // Junge und Mädchen (02.11.2026): eigene Farben und Deko im Zimmer (Ansprache aus dem Elternbereich; „keine Angabe“ = wie bisher)
  const GESCHLECHT = K.geschlecht ? K.geschlecht() : "n", JUNGE = GESCHLECHT === "m", MAEDCHEN = GESCHLECHT === "w";
  const ZF = JUNGE ? { teppich: "#7FBF6A", decke: "#3A7BD5", schrank: "#2F6FB3", tuer: "#4A8FD6" }
    : MAEDCHEN ? { teppich: "#C9A8F2", decke: "#F59AC0", schrank: "#C2337A", tuer: "#E0579A" }
    : { teppich: "#B7A4F2", decke: "#7FC6F5", schrank: "#C2337A", tuer: "#E0579A" };
  const teppich = new Mesh(new CylinderGeometry(1.6, 1.6, 0.04, 40), mat(ZF.teppich)); teppich.position.set(0, 0.27, 0.6); teppich.receiveShadow = true; zimmer.add(teppich);
  if (JUNGE) {
    // Straßen-Teppich, Fußball, Raketen-Poster
    const strasse = new Mesh(new TorusGeometry(1.05, 0.14, 4, 40), mat("#5B5B66")); strasse.rotation.x = Math.PI / 2; strasse.scale.z = 0.2; strasse.position.set(0, 0.3, 0.6); zimmer.add(strasse);
    const ball = teil(kugel(0.22), "#FFFFFF"); setze(ball, 1.3, 0.47, 1.9); zimmer.add(ball);
    [[0, 0.22, 0], [0.19, 0.08, 0.08], [-0.17, 0.06, 0.12], [0.05, -0.05, 0.21]].forEach(([x, y, z]) => ball.add(setze(new Mesh(kugel(0.07, 8, 6), mat("#2A2230")), x, y, z)));
    const poster = new Group(); poster.position.set(-1.9, 2.1, -3.55); zimmer.add(poster);
    poster.add(setze(teil(new BoxGeometry(1.0, 1.3, 0.04), "#1F2A5A", { dicke: 1.03 }), 0, 0, 0));
    const rakete = teil(new CapsuleGeometry(0.12, 0.45, 4, 12), "#FFFFFF"); rakete.rotation.z = -0.5; poster.add(setze(rakete, 0, 0.05, 0.05));
    [-1, 1].forEach(s2 => poster.add(setze(teil(new BoxGeometry(0.08, 0.16, 0.03), "#E8463B"), -0.12 + s2 * 0.1, -0.22 + s2 * 0.05, 0.06)));
    [[0.3, 0.45], [-0.32, 0.4], [0.35, -0.4], [-0.3, -0.45]].forEach(([x, y]) => poster.add(setze(new Mesh(kugel(0.04, 6, 4), mat("#FFE27A")), x, y, 0.04)));
  } else if (MAEDCHEN) {
    // Blumen-Teppich, Wimpelkette, Herz-Poster
    [0, 1, 2, 3, 4, 5].forEach(i => { const a = i / 6 * Math.PI * 2; const b = new Mesh(new CylinderGeometry(0.22, 0.22, 0.05, 16), mat(i % 2 ? "#FF9BC8" : "#FFE27A")); b.position.set(Math.cos(a) * 1.05, 0.3, 0.6 + Math.sin(a) * 1.05); zimmer.add(b); });
    for (let i = 0; i < 9; i++) { const w = teil(new ConeGeometry(0.16, 0.3, 3), ["#FF6F9F", "#FFC83D", "#9B6BE0", "#5CCBA6"][i % 4], { dicke: 1.05 }); w.rotation.x = Math.PI; setze(w, -3.2 + i * 0.36, 2.95 - Math.sin(i / 8 * Math.PI) * 0.25, -3.5); zimmer.add(w); }
    const poster = new Group(); poster.position.set(-1.9, 2.1, -3.55); zimmer.add(poster);
    poster.add(setze(teil(new BoxGeometry(1.0, 1.3, 0.04), "#FFF1F7", { dicke: 1.03 }), 0, 0, 0));
    [-1, 1].forEach(s2 => poster.add(setze(new Mesh(kugel(0.17, 12, 10), mat("#E8336B")), s2 * 0.12, 0.08, 0.04)));
    const spitze = new Mesh(new ConeGeometry(0.25, 0.32, 4), mat("#E8336B")); spitze.rotation.z = Math.PI; spitze.rotation.y = Math.PI / 4; poster.add(setze(spitze, 0, -0.12, 0.04));
  }
  // Bett
  const bett = new Group(); bett.position.set(-2.9, 0.25, -2.2); zimmer.add(bett); zimmerEigen.push(bett);
  bett.add(setze(teil(new BoxGeometry(1.8, 0.5, 2.6), "#9A6A3F", { dicke: 1.03 }), 0, 0.25, 0));
  bett.add(setze(teil(new BoxGeometry(1.7, 0.2, 1.8), ZF.decke, { dicke: 1.03 }), 0, 0.6, 0.35));
  const kissen = teil(kugel(0.4), "#FFFFFF"); kissen.scale.set(1.6, 0.5, 0.9); bett.add(setze(kissen, 0, 0.65, -0.85));
  block(ZX - 2.9, -2.2, 1.4);
  // Stickeralbum liegt auf dem Bett
  const album = new Group(); album.position.set(0.25, 0.76, 0.75); album.rotation.y = 0.4; bett.add(album); starr.push([bett, [album]], [album]);
  album.add(setze(teil(new BoxGeometry(0.62, 0.1, 0.48), "#E0457B", { dicke: 1.05 }), 0, 0, 0));
  album.add(setze(new Mesh(new BoxGeometry(0.56, 0.11, 0.42), mat("#FFF6E8")), 0.02, 0, 0));
  album.add(setze(new Mesh(kugel(0.07, 10, 8), mat("#FFD84D")), 0.05, 0.07, 0.02));
  antippbar(album, () => zeigeAntwort(K.antwort("album")), ...K.aktionFuer("album"));
  antippbar(bett, () => zeigeAntwort(K.antwort("bett", { tier: tier ? tierDaten.name || "dein Tier" : null })), ...K.aktionFuer("bett"));
  // Kleiderschrank
  const schrank = new Group(); schrank.position.set(2.8, 0.25, -3.0); zimmer.add(schrank); zimmerEigen.push(schrank); starr.push([schrank]);
  schrank.add(setze(teil(new BoxGeometry(2.0, 2.6, 0.9), ZF.schrank, { dicke: 1.03 }), 0, 1.3, 0));
  [-0.48, 0.48].forEach(x => { schrank.add(setze(teil(new BoxGeometry(0.9, 2.3, 0.06), ZF.tuer, { dicke: 1.02 }), x, 1.3, 0.47)); schrank.add(setze(teil(kugel(0.07), "#FFC83D", { dicke: 1.15 }), x * 0.25, 1.35, 0.53)); });
  schrank.add(setze(teil(new BoxGeometry(0.5, 0.3, 0.05), "#FFFFFF", { dicke: 1.08 }), 0, 2.35, 0.52));
  block(ZX + 2.8, -3.0, 1.2);
  antippbar(schrank, () => zeigeAntwort(K.antwort("schrank")), ...K.aktionFuer("schrank"));
  // Spiegel
  const spiegel = new Group(); spiegel.position.set(-4.05, 1.7, 1.0); spiegel.rotation.y = Math.PI / 2; zimmer.add(spiegel); zimmerEigen.push(spiegel); starr.push([spiegel]);
  const rahmen = teil(new TorusGeometry(0.55, 0.08, 10, 30), "#FFC83D"); rahmen.scale.y = 1.4; spiegel.add(rahmen);
  const glas = new Mesh(new CircleGeometry(0.52, 30), new MeshBasicMaterial({ color: "#CFEFFF" })); glas.scale.y = 1.4; glas.position.z = 0.02; spiegel.add(glas);
  antippbar(spiegel, () => zeigeAntwort(K.antwort("spiegel")), ...K.aktionFuer("spiegel"));
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
    const malZettel = () => zettel.forEach((f, i) => {
      const x = 22 + (i % 4) * 122, y = 70 + Math.floor(i / 4) * 120, neu = i < heute;
      g2.save(); g2.translate(x + 50, y + 50); g2.rotate(((i * 37) % 9 - 4) * 0.025);
      g2.fillStyle = "rgba(0,0,0,.18)"; g2.fillRect(-46, -42, 100, 100);
      g2.fillStyle = f.a === "gemeistert" ? "#FFE7A3" : FARBE[f.f] || "#FFF6E0"; g2.fillRect(-50, -46, 100, 100);
      if (neu) { g2.strokeStyle = "#FFC83D"; g2.lineWidth = 6; g2.strokeRect(-50, -46, 100, 100); }
      g2.fillStyle = "#4B2380";
      if (window.EmojiBild) window.EmojiBild.zeichne(g2, f.e || "⭐", 0, 8, 62);
      else { g2.font = "54px sans-serif"; g2.textAlign = "center"; g2.textBaseline = "middle"; g2.fillText(f.e || "⭐", 0, 8); }
      g2.fillStyle = "#E0457B"; g2.beginPath(); g2.arc(0, -36, 7, 0, Math.PI * 2); g2.fill();
      g2.restore();
    });
    malZettel();
    const tex = new CanvasTexture(c); tex.colorSpace = SRGBColorSpace;
    // Noto-Bilder nachladen und die Zettel neu malen (die Zettel decken die alten Zeichen ganz ab)
    if (window.EmojiBereit) window.EmojiBereit.then(E => E && Promise.all(zettel.map(f => E.lade(f.e || "⭐")))).then(l => { if (l) { malZettel(); tex.needsUpdate = true; } });
    const wand = new Group(); wand.position.set(4.06, 1.95, 0.9); wand.rotation.y = -Math.PI / 2; zimmer.add(wand); zimmerEigen.push(wand); starr.push([wand]);
    wand.add(teil(new BoxGeometry(1.72, 1.1, 0.06), "#8A5A34", { dicke: 1.03 }));
    wand.add(setze(new Mesh(new PlaneGeometry(1.6, 1.0), new MeshBasicMaterial({ map: tex })), 0, 0, 0.035));
    antippbar(wand, () => zeigeAntwort(K.antwort("pinnwand")), ["📌", "Ansehen"], 1.9);
  }
  // Atelier: Staffelei mit dem neuesten Bild und bis zu drei gemalten Bildern als Poster an den Wänden (shared/bilder.js)
  {
    const staffelei = new Group(); staffelei.position.set(-2.1, 0.25, 2.3); staffelei.rotation.y = 0.55; zimmer.add(staffelei); zimmerEigen.push(staffelei); starr.push([staffelei]);
    [[-0.42, 0.12], [0.42, -0.12]].forEach(([x, r]) => { const b = teil(new BoxGeometry(0.07, 2.0, 0.07), "#B07A48"); b.position.set(x, 1.0, 0); b.rotation.z = r; staffelei.add(b); });
    const hinten = teil(new BoxGeometry(0.07, 1.9, 0.07), "#B07A48"); hinten.position.set(0, 0.95, -0.38); hinten.rotation.x = -0.25; staffelei.add(hinten);
    staffelei.add(setze(teil(new BoxGeometry(1.0, 0.07, 0.16), "#B07A48"), 0, 0.88, 0.06));
    const brett = new Group(); brett.position.set(0, 1.32, 0.1); brett.rotation.x = -0.08; staffelei.add(brett);
    brett.add(teil(new BoxGeometry(1.06, 0.82, 0.04), "#FFFFFF", { dicke: 1.03 }));
    const leinwandMat = new MeshBasicMaterial({ color: "#FFFFFF" });
    { const lw = setze(new Mesh(new PlaneGeometry(1.0, 0.75), leinwandMat), 0, 0, 0.025); lw.userData.bleibt = true; brett.add(lw); }   // bekommt später ein Bild – nicht verschmelzen
    const klecks = [["#E8453C", -0.18, 0.05], ["#FFC83D", 0, 0.12], ["#2F86C8", 0.18, 0.04]];
    const palette = new Group(); palette.position.set(0.25, 0.94, 0.12); staffelei.add(palette);
    palette.add(setze(teil(new CylinderGeometry(0.22, 0.22, 0.03, 20), "#D9A867"), 0, 0, 0));
    klecks.forEach(([f, x, z]) => palette.add(setze(new Mesh(kugel(0.045, 8, 6), mat(f)), x * 0.8, 0.03, z - 0.06)));
    block(ZX - 2.1, 2.3, 0.6);
    const bildTextur = (url, fertig) => { const img = new Image(); img.onload = () => { const t = new CanvasTexture(img); t.colorSpace = SRGBColorSpace; fertig(t); }; img.src = url; };
    let neuestes = null;
    if (window.Bilder) {
      window.Bilder.alle().then(l => { neuestes = l[0] || null; if (neuestes) bildTextur(neuestes.url, (t) => { leinwandMat.map = t; leinwandMat.needsUpdate = true; }); }).catch(() => {});
      // Poster: zwei an der Rückwand über dem Bett, eines an der rechten Wand
      const PLATZ = [[-1.7, 2.2, -3.55, 0], [-3.0, 2.3, -3.55, 0], [4.05, 2.1, -1.0, -Math.PI / 2]];
      window.Bilder.wandBilder().then(l => l.slice(0, PLATZ.length).forEach((b, i) => bildTextur(b.url, (t) => {
        const [x, y, z, r] = PLATZ[i], p = new Group(); p.position.set(x, y, z); p.rotation.y = r; zimmer.add(p);
        p.add(teil(new BoxGeometry(0.9, 0.7, 0.05), ["#FFC83D", "#5EC3E6", "#FF7FB0"][i], { dicke: 1.03 }));
        p.add(setze(new Mesh(new PlaneGeometry(0.8, 0.6), new MeshBasicMaterial({ map: t })), 0, 0, 0.03));
        antippbar(p, () => zeigeAntwort(K.antwort("bild", { t: b.t })), ["🖼️", "Ansehen"], 2.4);
      }))).catch(() => {});
    }
    antippbar(staffelei, () => zeigeAntwort(K.antwort("staffelei", { bild: !!neuestes })), ["🎨", "Malen"], 2.0);
  }
  // Pflanze und Lampe
  const topf = new Group(); topf.position.set(3.4, 0.25, 2.4); zimmer.add(topf);
  topf.add(setze(teil(new CylinderGeometry(0.3, 0.22, 0.45, 16), "#E2604F"), 0, 0.22, 0));
  [[0, 0.75, 0, 0.35], [0.2, 0.95, 0.1, 0.25], [-0.18, 0.9, -0.05, 0.25]].forEach(([x, y, z, r]) => topf.add(setze(teil(kugel(r), "#5DBB5A"), x, y, z)));
  block(ZX + 3.4, 2.4, 0.5);
}
// ---------- Zimmer einrichten: Möbel mit Sternen kaufen und auf Plätze stellen ----------
// Plätze, Möbel (Name, Preis, Text) und Wandfarben aus dem Kern; hier nur das 3D-Aussehen je Möbel-id
const PLAETZE = K.PLAETZE, WANDFARBEN = K.WANDFARBEN;
const holz = "#B07A48";
const BAU_MOEBEL = {
  lampe() { const g = new Group(); g.add(setze(teil(new CylinderGeometry(0.28, 0.32, 0.08, 18), "#6B6B7A"), 0, 0.04, 0)); g.add(setze(teil(new CylinderGeometry(0.04, 0.04, 1.6, 8), "#6B6B7A"), 0, 0.84, 0)); g.add(setze(teil(new CylinderGeometry(0.22, 0.38, 0.45, 18, 1, true), "#FFD84D"), 0, 1.75, 0)); g.add(setze(new Mesh(kugel(0.12, 10, 8), new MeshBasicMaterial({ color: "#FFF4C2" })), 0, 1.65, 0)); return g; },
  baer() { const g = new Group(), f = "#C98A50"; const k = teil(kugel(0.32), f); k.scale.y = 1.1; g.add(setze(k, 0, 0.35, 0)); g.add(setze(teil(kugel(0.24), f), 0, 0.85, 0)); [-1, 1].forEach(sx => { g.add(setze(teil(kugel(0.09), f), sx * 0.17, 1.05, 0)); g.add(setze(teil(kugel(0.1), f), sx * 0.3, 0.42, 0.1)); g.add(setze(teil(kugel(0.11), f), sx * 0.17, 0.1, 0.15)); }); g.add(setze(teil(kugel(0.09), "#F2D2A8", { umriss: false }), 0, 0.8, 0.2)); augen(g, 0.08, 0.9, 0.21, 0.035); return g; },
  sitzsack() { const g = new Group(); const s1 = teil(kugel(0.6), "#5CCBA6"); s1.scale.set(1, 0.6, 1); g.add(setze(s1, 0, 0.35, 0)); const s2 = teil(kugel(0.4), "#5CCBA6"); s2.scale.set(1.1, 0.9, 0.6); g.add(setze(s2, 0, 0.7, -0.3)); return g; },
  kiste() { const g = new Group(); g.add(setze(teil(new BoxGeometry(1.0, 0.6, 0.6), "#7B9BFF"), 0, 0.3, 0)); g.add(setze(teil(kugel(0.14), "#FF6F91"), -0.25, 0.68, 0)); g.add(setze(teil(new BoxGeometry(0.22, 0.22, 0.22), "#FFD84D"), 0.1, 0.68, 0.05)); g.add(setze(teil(new ConeGeometry(0.12, 0.3, 4), "#5CCBA6"), 0.33, 0.72, -0.05)); return g; },
  korb() { const g = new Group(); g.add(setze(teil(new CylinderGeometry(0.55, 0.45, 0.3, 24), "#D9A066"), 0, 0.15, 0)); g.add(setze(new Mesh(new CylinderGeometry(0.47, 0.47, 0.06, 24), mat("#FF9EC4")), 0, 0.3, 0)); g.add(setze(teil(new TorusGeometry(0.5, 0.08, 8, 24), "#C88A50"), 0, 0.3, 0).rotateX(Math.PI / 2)); return g; },
  globus() { const g = new Group(); g.add(setze(teil(new CylinderGeometry(0.4, 0.45, 0.6, 16), holz), 0, 0.3, 0)); g.add(setze(teil(new CylinderGeometry(0.03, 0.03, 0.3, 6), "#FFC83D"), 0, 0.75, 0)); const k = teil(kugel(0.32), "#5EC3E6"); setze(k, 0, 1.15, 0); k.rotation.z = 0.4; [[0.15, 0.1, 0.2], [-0.2, -0.05, 0.15], [0.05, 0.2, -0.22]].forEach(([x, y, z]) => k.add(setze(new Mesh(kugel(0.13, 10, 8), mat("#7CCB5B")), x, y, z))); g.add(k); g.userData.dreh = k; return g; },
  regal() { const g = new Group(); g.add(setze(teil(new BoxGeometry(1.3, 1.9, 0.45), holz, { dicke: 1.03 }), 0, 0.95, 0)); [0.5, 1.1, 1.65].forEach((y, j) => { let x = -0.5; ["#E0574A", "#5CCBA6", "#7B9BFF", "#FFD84D", "#C27BFF"].forEach((c, i) => { if ((i + j) % 4 === 3) { x += 0.2; return; } const b = new Mesh(new BoxGeometry(0.14, 0.4 - (i % 2) * 0.06, 0.32), mat(c)); b.position.set(x, y - 0.1 + 0.05, 0.1); x += 0.19; g.add(b); }); }); return g; },
  staffelei() { const g = new Group(); [[-0.3, 0.12], [0.3, -0.12]].forEach(([x, rz]) => { const b = teil(new BoxGeometry(0.06, 1.7, 0.06), holz); b.rotation.z = rz; g.add(setze(b, x, 0.85, 0)); }); const h = teil(new BoxGeometry(0.06, 1.6, 0.06), holz); h.rotation.x = -0.3; g.add(setze(h, 0, 0.8, -0.25)); g.add(setze(teil(new BoxGeometry(0.9, 0.7, 0.04), "#FFFFFF"), 0, 1.15, 0.06)); [["#FF6F91", -0.2, 1.25], ["#FFD84D", 0.15, 1.1], ["#5CCBA6", 0, 0.98]].forEach(([c, x, y]) => { const f = new Mesh(kugel(0.1, 10, 8), mat(c)); f.scale.set(1, 1, 0.2); g.add(setze(f, x, y, 0.09)); }); return g; },
  tisch() { const g = new Group(); g.add(setze(teil(new BoxGeometry(1.4, 0.08, 0.75), holz), 0, 0.8, 0)); [[-0.6, -0.3], [0.6, -0.3], [-0.6, 0.3], [0.6, 0.3]].forEach(([x, z]) => g.add(setze(teil(new BoxGeometry(0.08, 0.8, 0.08), holz), x, 0.4, z))); g.add(setze(teil(new BoxGeometry(0.4, 0.04, 0.3), "#FFFFFF"), -0.2, 0.86, 0.05)); g.add(setze(teil(new CylinderGeometry(0.08, 0.08, 0.22, 10), "#E0574A"), 0.45, 0.95, -0.15)); const st = new Group(); st.add(setze(teil(new BoxGeometry(0.5, 0.06, 0.5), "#7B9BFF"), 0, 0.5, 0)); st.add(setze(teil(new BoxGeometry(0.5, 0.5, 0.06), "#7B9BFF"), 0, 0.78, 0.24)); [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].forEach(([x, z]) => st.add(setze(new Mesh(new BoxGeometry(0.05, 0.5, 0.05), mat("#6B6B7A")), x, 0.25, z))); st.position.z = 0.7; g.add(st); return g; },
  aquarium() { const g = new Group(); g.add(setze(teil(new BoxGeometry(1.2, 0.7, 0.6), holz), 0, 0.35, 0)); g.add(setze(new Mesh(new BoxGeometry(1.1, 0.7, 0.5), new MeshToonMaterial({ color: "#7FD3F0", gradientMap: verlauf, transparent: true, opacity: 0.6 })), 0, 1.05, 0)); g.add(setze(new Mesh(new BoxGeometry(1.1, 0.1, 0.5), mat("#F2D9A2")), 0, 0.75, 0)); const fische = new Group(); ["#FF9E5E", "#FFD84D"].forEach((c, i) => { const f = new Mesh(kugel(0.09, 10, 8), mat(c)); f.scale.set(1.5, 1, 0.6); f.position.set(i ? 0.2 : -0.2, 1.0 + i * 0.15, 0); f.add(setze(new Mesh(new ConeGeometry(0.06, 0.12, 4), mat(c)), -0.12, 0, 0).rotateZ(Math.PI / 2)); fische.add(f); }); g.add(fische); g.userData.fische = fische; [-0.35, 0.4].forEach(x => g.add(setze(new Mesh(new ConeGeometry(0.05, 0.35, 5), mat("#3E9E5A")), x, 0.95, -0.1))); return g; },
};
// Geschenk-Möbel (nur sichtbar, wenn das Kind es bekommen hat)
BAU_MOEBEL.tannenbaum = function () {
  const g = new Group();
  g.add(setze(teil(new CylinderGeometry(0.1, 0.12, 0.3, 10), "#8A5A35"), 0, 0.15, 0));
  [[0.62, 0.7, 0.55], [0.48, 0.6, 1.0], [0.32, 0.5, 1.4]].forEach(([r, h, y]) => g.add(setze(teil(new ConeGeometry(r, h, 14), "#2E8B57"), 0, y, 0)));
  g.add(setze(new Mesh(kugel(0.1, 10, 8), mat("#FFC83D")), 0, 1.72, 0));
  [[0.38, 0.55, 0.2, "#E2604F"], [-0.3, 0.7, 0.25, "#FFC83D"], [0.1, 0.95, 0.38, "#5EC3E6"], [-0.2, 1.1, -0.2, "#E2604F"], [0.25, 1.2, 0.05, "#FFC83D"], [-0.4, 0.5, -0.1, "#5EC3E6"]]
    .forEach(([x, y, z, f]) => g.add(setze(new Mesh(kugel(0.07, 8, 6), mat(f)), x, y, z)));
  return g;
};
const MOEBEL = K.MOEBEL.map(m => Object.assign({}, m, { bau: BAU_MOEBEL[m.id] }));
const zimmerDaten = K.zimmerDaten, besitzt = K.besitzt;
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
    verschmelzeLokal(o, [o.userData.dreh, o.userData.fische]);
    platzHindernis[pl.id] = { x: ZX + pl.x, z: pl.z, r: 0.6 }; hindernisse.push(platzHindernis[pl.id]);
    antippbar(o, () => zeigeAntwort(K.antwort("moebel", { id })));
  });
  const w = WANDFARBEN.find(x => x.id === d.wand) || WANDFARBEN[0];
  WAND_HINTEN.color.set(w.farbe[0]); WAND_SEITE.color.set(w.farbe[1]);
}
stelleMoebel();
// Ringe zeigen beim Aussuchen, wo die Plätze sind
const platzRinge = PLAETZE.map(pl => { const r = new Mesh(new TorusGeometry(0.55, 0.05, 6, 28), new MeshBasicMaterial({ color: "#FF6F91" })); r.rotation.x = Math.PI / 2; r.position.set(pl.x, 0.3, pl.z); r.visible = false; zimmer.add(r); return r; });
// Wände, Boden, Teppich, Fenster, Pflanze: zu wenigen Meshes verschmelzen (Möbel, Ringe und antippbare Teile bleiben eigene Objekte)
starr.push([zimmer, [...zimmerEigen, ...platzRinge, ...Object.values(moebelObj)]]);
// Laden (Kaufen, Hinstellen, Wegräumen, Wandfarbe) im gemeinsamen Baustein shared/einrichten.js – gleich für beide Looks
window.Einrichten.verbinde({
  neu: () => stelleMoebel(),
  ringe: (an, besetzt) => platzRinge.forEach((r, i) => { r.visible = an; if (an) r.material.color.set(besetzt[i] ? "#FFB0C8" : "#FF6F91"); })
});
const laden = (text) => window.Einrichten.oeffne(text);
$("einrichten").addEventListener("click", () => laden());

let draussenPos = new Vector3(), besuche = 0;
function reingehen() {
  drinnen = true; besuche++; $("raus").hidden = false; $("einrichten").hidden = false; $("blase").hidden = true;
  draussenPos.copy(ich.position);
  ich.position.set(ZX, 0.25, 1.8); ich.rotation.y = 0;   // schaut ins Bild, damit man Gesicht und Anziehsachen sieht
  if (tier) tier.position.set(ZX + 1.2, 0.25, 2.6);
  scene.background = new Color("#F7E3C6"); scene.fog.color.set("#F7E3C6"); wasser.visible = false; wolken.forEach(w => w.visible = false);
  nebelDrinnen = true; nebelBand.visible = false; scene.fog.near = 32; scene.fog.far = 80;
  $("info").textContent = "Dein Zimmer. Kleiderschrank, Spiegel – oder richte es mit 🛋️ ein!";
  S.ton("tipp");
}
function rausgehen() {
  drinnen = false; $("raus").hidden = true; $("einrichten").hidden = true; window.Einrichten.zu();
  const { x: tx, z: tz, dreh: hr } = KI.vorDerTuer();
  ich.position.set(tx, bodenY(tx, tz), tz); ich.rotation.y = hr;
  if (tier) tier.position.set(tx + 1.1, bodenY(tx + 1.1, tz + 0.4), tz + 0.4);
  scene.background = new Color(HIMMEL); scene.fog.color.set(HIMMEL); wasser.visible = true; wolken.forEach(w => w.visible = true);
  nebelDrinnen = false; wendeNebelAn();
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
let blaseExtra = null;
function sprechblase(e, titel, text, ru, ziel, extra) {
  blaseExtra = extra || null; $("blase-extra").hidden = !extra; if (extra) $("blase-extra").textContent = extra[0];
  $("blase-e").innerHTML = window.Figuren && window.Figuren[e] ? window.Figuren[e]("") : e; $("blase-titel").textContent = titel; $("blase-text").textContent = text;
  const ruEl = $("blase-ru"); ruEl.textContent = ru || ""; ruEl.hidden = true;
  const hl = S.hilfe && S.hilfe(); $("blase-ruk").hidden = !(ru && hl); if (hl) { $("blase-ruk").textContent = hl.kurz; ruEl.lang = hl.code; ruEl.dir = hl.rtl ? "rtl" : "ltr"; }
  $("blase-los").hidden = !ziel; blaseZiel = ziel;
  $("blase").hidden = false; S.ton("tipp");
  if (SP && SP.sprich) SP.sprich(text, "de-DE");
}
// Antwort einer Station aus dem Insel-Kern zeigen ({ blase: [e, titel, text, hilfe, ziel], extra })
function zeigeAntwort(a) {
  if (!a) return;
  sprechblase(...a.blase, a.extra === "prolog" ? ["🔁 Wie ging das nochmal?", () => starteProlog(true)] : null);
}
$("blase-zu").addEventListener("click", () => { $("blase").hidden = true; if (SP && SP.stopp) SP.stopp(); });
$("blase-los").addEventListener("click", () => { if (blaseZiel) location.href = blaseZiel; });
$("blase-extra").addEventListener("click", () => { $("blase").hidden = true; if (SP && SP.stopp) SP.stopp(); if (blaseExtra) blaseExtra[1](); });
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
    if (prolog && o !== hausObj) continue;   // im Prolog führt der Aktionsknopf nur ins Haus
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
// Look umschalten (NA-25): dieselbe Welt in Pixel – Spielstand, Story und Zimmer bleiben, nichts geht verloren
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
// Seit 01.11.2026 schrittweise (regleAufloesung): erst die Auflösung senken, erst bei Stufe 1 und unter 30 Bildern/s: keine Schatten, Wasser und Gras ruhig.
// Das Tablet merkt es sich (localStorage), damit es beim nächsten Mal gleich flüssig startet.
const SPAR_KEY = "lerninsel.sparen";
let sparen = false, bildNr = 0;
function spare(melden) {
  if (sparen) return; sparen = true;
  sonne.castShadow = false; renderer.shadowMap.enabled = false; mats.forEach(m => { m.needsUpdate = true; }); scene.traverse(o => { if (o.material && !Array.isArray(o.material)) o.material.needsUpdate = true; });
  aufl = 1; renderer.setPixelRatio(1); groesse();
  try { localStorage.setItem(SPAR_KEY, String(Date.now())); } catch (e) { /* egal */ }
  if (melden) $("info").textContent = "🌿 Die Grafik ist jetzt etwas einfacher, damit alles flüssig läuft.";
}
// gemerktes Sparen gilt 3 Tage, dann wird wieder „schön“ versucht (vorher für immer – auch wenn es nur einmal kurz geruckelt hat)
{ const g = lies(SPAR_KEY), alt = g === "1" ? 0 : +g; if (!EINFACH && g && (g === "1" || Date.now() - alt < 3 * 86400000)) { if (g === "1") try { localStorage.setItem(SPAR_KEY, String(Date.now())); } catch (e) { /* egal */ } spare(false); } }
// Auflösung regeln (01.11.2026): jede Sekunde Bilder zählen. Unter 45 Bildern/s eine Stufe (0,125) tiefer, bei 1,0 und unter 30 Bildern/s
// zweimal hintereinander: sparen (keine Schatten). Über 58 Bildern/s vier Sekunden lang: eine Stufe höher (bis AUFL_MAX).
let reglerZeit = 0, reglerBilder = 0, gutSek = 0, schlechtSek = 0;
function regleAufloesung(dtEcht) {
  if (EINFACH || window.__keinSparen) return;
  reglerZeit += dtEcht; reglerBilder++;
  if (reglerZeit < 1) return;
  const fps = reglerBilder / reglerZeit; reglerZeit = 0; reglerBilder = 0;
  if (uhr.elapsedTime < 2) return;   // Start (Shader, Aufbau) nicht mitzählen
  if (fps < 45 && aufl > 1) { aufl = Math.max(1, aufl - 0.125); renderer.setPixelRatio(aufl); groesse(); gutSek = 0; try { localStorage.setItem(AUFL_KEY, String(aufl)); } catch (e) { /* egal */ } return; }
  if (fps < 30 && aufl <= 1 && !sparen) { if (++schlechtSek >= 2) spare(true); return; }
  schlechtSek = 0;
  if (fps > 58 && aufl < AUFL_MAX && !sparen) { if (++gutSek >= 4) { gutSek = 0; aufl = Math.min(AUFL_MAX, aufl + 0.125); renderer.setPixelRatio(aufl); groesse(); try { localStorage.setItem(AUFL_KEY, String(aufl)); } catch (e) { /* egal */ } } } else gutSek = 0;
}
function bild() {
  const dtEcht = uhr.getDelta(), dt = Math.min(dtEcht, 0.05), t = uhr.elapsedTime; bild.dt = dtEcht;
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
  // (UX-Paket 2, 07.11.2026) Arme leicht abgespreizt: arme[0] ist der linke Arm (x < 0), ein negativer Winkel führt die Hand nach außen –
  // vorher stand das Vorzeichen falsch herum, beide Hände trafen sich vor der Brust (Auftrag des Auftraggebers: „Arme abspreizen“)
  if (hoehe > 0) { u.beine[0].rotation.x = -0.5; u.beine[1].rotation.x = 0.3; u.arme[0].rotation.z = -0.9; u.arme[1].rotation.z = 0.9; }
  else { u.arme[0].rotation.z = -ARM_WINKEL; u.arme[1].rotation.z = ARM_WINKEL; }
  if (marke.visible) marke.scale.setScalar(1 + Math.sin(t * 6) * 0.1);

  if (tier) {
    tmp.subVectors(ich.position, tier.position); tmp.y = 0; const dT = tmp.length(), tu = tier.userData; let hoppelt = false;
    const schlaeft = NACHT && !geht && dT < 3;
    if (dT > 1.5) {
      hoppelt = true; tmp.normalize(); tier.position.addScaledVector(tmp, Math.min(dT - 1.5, (dT > 4 ? 7.5 : 3.2) * dt)); wegVonHindernissen(tier.position, 0.3);
      const soll = Math.atan2(tmp.x, tmp.z); let diff = soll - tier.rotation.y; diff = Math.atan2(Math.sin(diff), Math.cos(diff)); tier.rotation.y += diff * Math.min(1, dt * 8);
    }
    tier.position.y = bodenY(tier.position.x, tier.position.z) + (performance.now() < tanzBis ? Math.abs(Math.sin(t * 9)) * 0.35 : 0);
    tu.k.position.y = hoppelt ? Math.abs(Math.sin(t * 12)) * 0.18 : 0;
    tu.k.rotation.z = schlaeft ? 1.2 : 0;
    tu.schwanz.rotation.y = Math.sin(t * (hoppelt ? 10 : schlaeft ? 0.5 : 3)) * 0.5;
  }
  { const pu = paula.userData; if (pu.huepf > 0) pu.huepf = Math.max(0, pu.huepf - dt * 2.6); paula.position.y = 0.3 + Math.sin((1 - (pu.huepf || 0)) * Math.PI) * (pu.huepf ? 0.3 : 0); paula.rotation.y = performance.now() < tanzBis ? Math.sin(t * 6) * 0.5 : 0; }
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

  if (!EINFACH && !RUHIG && !sparen) ZEIT.value = t;   // Wasser und Gras bewegen sich im Shader
  if (schnee) { const a = schnee.geometry.attributes.position; for (let i = 0; i < a.count; i++) { let y = a.getY(i) - dt * 1.2; if (y < 0) y = 16; a.setY(i, y); a.setX(i, a.getX(i) + Math.sin(t + i) * dt * 0.2); } a.needsUpdate = true; }
  if (drinnen) { const gl = moebelObj && Object.values(moebelObj); gl.forEach(o => { if (o.userData.dreh) o.userData.dreh.rotation.y += dt * 0.5; if (o.userData.fische) o.userData.fische.children.forEach((f, i) => { f.position.x = Math.sin(t * (0.8 + i * 0.3) + i * 2) * 0.35; f.rotation.y = Math.cos(t * (0.8 + i * 0.3) + i * 2) > 0 ? 0 : Math.PI; }); }); }
  pruefeNaehe();
  if (lichtStrahl.visible && !RUHIG) lichtStrahl.rotation.y += dt * 0.6;
  windrad.rotation.y += dt * (0.6 + Math.min(40, (wetter && wetter.wind) || 8) * 0.15);
  if (regen) { const a = regen.geometry.attributes.position; for (let i = 0; i < a.count; i += 2) { let y = a.getY(i) - dt * 14; if (y < 0) y = 16; a.setY(i, y); a.setY(i + 1, y - 0.55); } a.needsUpdate = true; regen.visible = !drinnen; }
  if (schnee) schnee.visible = !drinnen;
  if (wetter && wetter.art === "gewitter" && !drinnen && !RUHIG) { blitz -= dt; if (blitz < -6 - Math.random() * 6) { blitz = 0.12; } scene.background.set(blitz > 0 ? "#E8ECF5" : NACHT ? HIMMEL : "#6C7A8C"); }
  wolken.forEach((w, i) => { w.position.x += dt * (0.4 + i * 0.1); if (w.position.x > 40) w.position.x = -40; });

  blick.set(ich.position.x, 1.0 + grund + hoehe * 0.3, ich.position.z);
  let gw = freiKamera ? gieren : 0, nw = freiKamera ? neigung : drinnen ? 0.7 : 0.72, ab = drinnen && !freiKamera ? 10 : abstand;
  if (fahrt && !drinnen) {   // Ankunft: Kamera schwebt von weit oben heran (zeitabhängig, nicht pro Bild)
    const f = Math.min(1, (performance.now() - fahrt) / 3500), e = 1 - (1 - f) ** 3;
    ab = MathUtils.lerp(30, ab, e); nw = MathUtils.lerp(1.15, nw, e); gw = MathUtils.lerp(-0.6, gw, e);
    if (f >= 1) fahrt = null;
  }
  if (drinnen) blick.set(MathUtils.clamp(blick.x, ZX - 1.5, ZX + 1.5), blick.y, MathUtils.clamp(blick.z, -1.5, 1.2));
  camera.position.set(blick.x + Math.sin(gw) * Math.cos(nw) * ab, blick.y + Math.sin(nw) * ab, blick.z + Math.cos(gw) * Math.cos(nw) * ab);
  camera.lookAt(blick);
  sonne.position.set(ich.position.x + 10, 18, ich.position.z + 8); sonne.target.position.copy(ich.position);
  if (renderer.shadowMap.enabled && (bildNr++ & 1) === 0) renderer.shadowMap.needsUpdate = true;   // Schatten jedes zweite Bild
  regleAufloesung(bild.dt);
  renderer.render(scene, camera);
  requestAnimationFrame(bild);
}
// Start (01.11.2026): Shader vorab übersetzen (ohne die Seite zu blockieren), dann erst zeichnen; bis dahin „Die Insel wacht auf …“
{
  const los = () => { requestAnimationFrame(bild); requestAnimationFrame(() => requestAnimationFrame(() => { const l = $("insel-laedt"); if (l) l.hidden = true; })); };
  let gestartet = false; const einmal = () => { if (!gestartet) { gestartet = true; los(); } };
  if (renderer.compileAsync) { renderer.compileAsync(scene, camera).then(einmal, einmal); setTimeout(einmal, 4000); } else einmal();
}
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

// ---------- Weihnachts-Sonderstart (NA-15) ----------
// Wer die Insel zwischen dem 1. und 26. Dezember zum ersten Mal betritt (Etappe E1 mit diesem Datum), findet am Steg ein Paket:
// einen Tannenbaum fürs Zimmer und eine Schleife fürs Tier. Das Paket wartet, bis es geöffnet wird (auch nach Weihnachten).
// Im Dezember trägt Pixels Boot eine Lichterkette. Außerhalb des Dezembers ist der Prolog gleich, nur ohne Paket.
// Regeln (wann es ein Paket gibt, was beim Öffnen passiert) im Insel-Kern; hier Aussehen und Wegnehmen.
const weihnachtsPaket = K.paketDa;   // Weihnachts-Paket oder eingelöster Geschenk-Code (NA-16)
let paket = null;
if (weihnachtsPaket()) {
  paket = new Group(); const y = bodenY(PAKET_POS.x, PAKET_POS.z);
  paket.add(setze(teil(new BoxGeometry(0.62, 0.5, 0.62), "#E2604F"), 0, 0.25, 0));
  paket.add(setze(teil(new BoxGeometry(0.66, 0.08, 0.66), "#C94A3B"), 0, 0.52, 0));
  paket.add(setze(new Mesh(new BoxGeometry(0.12, 0.6, 0.67), mat("#FFC83D")), 0, 0.29, 0));
  paket.add(setze(new Mesh(new BoxGeometry(0.67, 0.6, 0.12), mat("#FFC83D")), 0, 0.29, 0));
  [-1, 1].forEach(sx => { const s = new Mesh(new TorusGeometry(0.1, 0.035, 6, 14), mat("#FFC83D")); s.rotation.y = sx * 0.6; paket.add(setze(s, sx * 0.09, 0.66, 0)); });
  paket.position.set(PAKET_POS.x, y, PAKET_POS.z); paket.rotation.y = 0.3; scene.add(paket); block(PAKET_POS.x, PAKET_POS.z, 0.45); starr.push([paket]);
  antippbar(paket, () => oeffnePaket(), ["🎁", "Öffnen"], 1.8);
}
function oeffnePaket() {
  if (!paket || !weihnachtsPaket()) return;
  const r = K.oeffnePaket(); if (!r) return;
  if (r.zimmer) stelleMoebel();
  // weitere eingelöste Geschenke warten: das Paket bleibt liegen, bis alle offen sind
  if (!weihnachtsPaket()) { scene.remove(paket); tippbar.splice(tippbar.indexOf(paket), 1); paket = null; naechstes = null; }
  S.ton("juhu");
  sprechblase(...r.blase, null);
}
// Lichterkette am Boot und am Steg (nur im Dezember): eine Instanz-Gruppe = 1 Zeichenaufruf, Funkeln über Farben
let lichter = null;
if (MONAT === 12) {
  const punkte = [];
  for (let i = 0; i < 7; i++) [-0.66, 0.66].forEach(dx => punkte.push([STEG.x + dx, 0.36 + Math.sin(i * 1.3) * 0.03, STEG.z0 + 0.4 + i * (STEG.z1 - STEG.z0 - 0.8) / 6]));
  for (let i = 0; i < 6; i++) punkte.push([STEG.x + 1.55 + Math.sin(i * 1.1) * 0.12, 0.1 + i * 0.16, STEG.z1 - 0.4 + Math.cos(i * 1.1) * 0.12]);
  lichter = new InstancedMesh(kugel(0.06, 8, 6), new MeshBasicMaterial({ color: "#FFFFFF" }), punkte.length);
  const o = new Object3D(), FARBEN_L = ["#FFD84D", "#FF6F61", "#5EC3E6", "#7CE38B"].map(f => new Color(f));
  punkte.forEach(([x, y, z], i) => { o.position.set(x, y, z); o.updateMatrix(); lichter.setMatrixAt(i, o.matrix); lichter.setColorAt(i, FARBEN_L[i % 4]); });
  scene.add(lichter);
  if (!RUHIG) setInterval(() => { const n = Math.floor(performance.now() / 600); for (let i = 0; i < punkte.length; i++) lichter.setColorAt(i, FARBEN_L[(i + n) % 4]); lichter.instanceColor.needsUpdate = true; }, 600);
}

// ---------- Prolog „Ankunft“ (Tutorial E1, NA-11) ----------
// Robo Pixel bringt das Kind mit dem Boot. Das Kind lernt Laufen (Joystick oder Tippen), läuft zum Haus und geht mit dem
// Aktionsknopf hinein. Genau einmal je Kind (story.etappen.E1); Eltern können ihn überspringen oder neu starten,
// das Kind kann ihn bei Pixel wiederholen. Bricht das Kind ab („Überspringen“), gilt E1 trotzdem als erledigt.
let fahrt = null;
function starteProlog(wiederholen) {
  const Sz = window.Szene, St = window.Story; if (!Sz || !St || prolog) return false;
  const def = Sz.def("prolog"); if (!def) return false;
  if (drinnen) rausgehen();
  $("blase").hidden = true; $("joy-hinweis").hidden = true;
  ich.position.set(STEG.x, 0, Math.min(RMAX_LAUF - 0.2, STEG.z0 + 1.4)); ich.position.y = bodenY(ich.position.x, ich.position.z); ich.rotation.y = Math.PI;
  ziel = null; marke.visible = false; fahrt = performance.now();
  prolog = { start: ich.position.clone() };
  const poll = (pruef, weiter) => { const id = setInterval(() => { if (pruef()) { clearInterval(id); weiter(); } }, 150); return () => clearInterval(id); };
  const b = def.blasen;
  // 2: Laufen lernen – Hand zeigt links das Schieben (oder bei „Tippen“ auf die Wiese vor der Figur)
  if (STEUERUNG === "tippen" && b[1].alt && b[1].alt.tippen) b[1].text = b[1].alt.tippen;
  b[1].zeige = STEUERUNG === "tippen"
    ? () => window.Insel.bildschirm(ich.position.x, ich.position.y, ich.position.z - 3)
    : { ziel: () => ({ x: Math.min(170, innerWidth * 0.2), y: innerHeight * 0.48 }), schieben: [0, -70] };
  b[1].bis = (weiter) => poll(() => ich.position.distanceTo(prolog.start) > 2.2, weiter);
  // 3: zum Haus – Leuchten auf dem Haus, weiter, sobald der Aktionsknopf „Reingehen“ zeigt
  b[2].zeige = window.Insel.ort("haus");
  b[2].bis = (weiter) => poll(() => naechstes === hausObj, weiter);
  // 4: Aktionsknopf drücken
  b[3].zeige = "#springen";
  b[3].bis = (weiter) => poll(() => drinnen, weiter);
  Sz.spiele(def, { chronik: !wiederholen }).then(() => {
    prolog = null; fahrt = null;
    St.etappeFertig("E1");
  });
  return true;
}
// Neues Kind: beim ersten Besuch (nicht wenn die Seite direkt im Zimmer startet)
if (K.prologFaellig(q)) setTimeout(() => starteProlog(false), 700);

// ---------- Tutorial E2 „Erst lernen“, Szene „Sonne geht auf“, E3 „Erste Frucht“ (= Kapitel 1) (NA-13) ----------
// Reihenfolge und Auslöser aus KONZEPT „Etappen“; höchstens zwei neue Etappen am Tag; nur draußen auf der Insel.
function spieleStory(id) {
  const Sz = window.Szene, St = window.Story, def = Sz && Sz.def(id); if (!def) return;
  const b = def.blasen, I = window.Insel, paketId = paket ? weihnachtsPaket() : null;
  if (id === "erst-lernen") { b[0].zeige = I.ort("sonnenuhr"); b[2].zeige = I.ort("eule"); }
  if (id === "sonne") { b[0].zeige = I.ort("sonnenuhr"); b[0].beim = zeigeSonnenuhr; }
  if (id === "weihnachtspaket" || id === "geschenkpaket" || id === "geburtstag") { b.forEach(x => { x.zeige = () => paket ? I.bildschirm(paket.position.x, paket.position.y + 0.8, paket.position.z) : null; }); b[1].bis = (weiter) => { const t = setInterval(() => { if (!paket) { clearInterval(t); weiter(); } }, 200); return () => clearInterval(t); }; }
  if (id === "erste-frucht") { b[0].zeige = I.ort("wissensbaum"); b[2].beim = () => { St.setzeKapitel(1); nebelWeicht(); }; }
  // E4–E8 (NA-14): Zeigehand und Warten; Auslöser und Texte kommen aus Kern und shared/szenen.js
  const warte = (pruef) => (weiter) => { const tt = setInterval(() => { if (pruef()) { clearInterval(tt); weiter(); } }, 200); return () => clearInterval(tt); };
  if (id === "sterne") { b[0].zeige = "#sterne"; b[1].zeige = I.ort("haus"); b[1].bis = warte(() => drinnen); b[2].zeige = "#einrichten"; b[2].bis = warte(() => window.Einrichten && window.Einrichten.offen); }
  if (id === "ei") b.forEach(x => { x.zeige = I.ort("nest"); });
  if (id === "spielorte") b.forEach(x => { x.zeige = I.ort(S.MINISPIELE_AUS ? "garten" : "ballons"); });
  if (id === "merkkiste") { const wer = K.merkkisteBei(); b.forEach(x => { x.wer = wer; x.zeige = I.ort(wer === "eule" ? "eule" : "fipsi"); }); }
  if (id === "gefuehle") b.forEach(x => { x.zeige = I.ort("baer"); });
  if (id === "fipsis-karte") { b[0].zeige = I.ort("fipsi"); b[1].beim = zeigeKartenweg; b[1].zeige = I.ort("kartenweg"); b[2].zeige = I.ort("kartenweg"); }
  if (id === "atelier") b.forEach(x => { x.zeige = I.ort("buehne"); });
  if (id === "bennos-baeckerei") b.forEach((x, i) => { x.zeige = I.ort(i === 0 ? "biber" : "baeckerei"); });
  if (id === "paulas-fest") b.forEach((x, i) => { x.zeige = I.ort(i === 0 ? "buehne" : "ballons"); });
  // Blase 3 („… dann leuchtet der Turm“): Kapitel 6 schon hier merken (wie Kapitel 1 in „erste-frucht“), sonst bleibt die Lampe grau, weil
  // schalteLeuchtturm() nach K.leuchtturmOffen() geht und das Kapitel sonst erst mit der letzten Blase gespeichert würde (ab Kl. 2 sind es vier)
  if (id === "der-leuchtturm") b.forEach((x, i) => { x.zeige = I.ort(i === 0 ? "schach" : "leuchtturm"); if (i === 2) x.beim = () => { St.setzeKapitel(6); schalteLeuchtturm(); }; });
  if (id === "der-sturm") b.forEach((x, i) => { x.zeige = I.ort(i === 1 ? "baer" : i === 2 ? "station" : "eule"); });
  storyLaeuft = true;
  // Etappe/Kapitel schon mit der letzten Blase merken – nicht erst beim Schließen (Kind verlässt die Insel oft direkt danach)
  Sz.spiele(def, { beiLetzter: () => K.storyFertig(def) }).then(() => {
    storyLaeuft = false;
    K.storyFertig(def);
    if (id === "fipsis-karte") zeigeKartenweg();   // auch beim Überspringen
    if (id === "der-leuchtturm") schalteLeuchtturm();
    if (id === "geburtstag" && paketId) St.merkeSzene(paketId);   // einmal je Jahr
    nebelWeicht();
    if (id === "ei" && !tier && $("blase").hidden) zeigeAntwort(K.antwort("nest"));
    setTimeout(naechsteStory, 1200);
  });
}
let storyLaeuft = false;
// Welche Szene dran ist, entscheidet der Insel-Kern (gleich für beide Looks)
function naechsteStory() {
  const id = K.naechsteStory({ paket: paket ? weihnachtsPaket() : false, prolog: !!prolog, drinnen, laeuft: storyLaeuft, test: q.has("szene") });
  if (id) spieleStory(id);
}
setTimeout(naechsteStory, 900);
setInterval(naechsteStory, 5000);   // z. B. wenn die Spielzeit beginnt, während das Kind auf der Insel ist
antippbar(uhrSonne, () => zeigeAntwort(K.antwort("sonnenuhr")), ...K.aktionFuer("sonnenuhr"));

// ---------- Leistungsbudget (NA-29): starre Teile je Objekt verschmelzen ----------
starr.forEach(([o, aus]) => verschmelzeLokal(o, aus || []));

// ---------- Bildschirm-Punkte für Szenen und Zeigehand (NA-10) ----------
const _bp = new Vector3();
function bildschirm(x, y, z) {
  _bp.set(x, y, z).project(camera);
  const r = renderer.domElement.getBoundingClientRect();
  return { x: r.left + (_bp.x + 1) / 2 * r.width, y: r.top + (1 - _bp.y) / 2 * r.height, sichtbar: _bp.z < 1 && Math.abs(_bp.x) <= 1.05 && Math.abs(_bp.y) <= 1.05, hinten: _bp.z >= 1 };
}
// Orte aus dem Insel-Kern (Bodenpunkt + Höhe), dazu die eigene Figur
const ORTE = { ich: () => [ich.position.x, ich.position.y + 1.4, ich.position.z] };
Object.entries(KI.ORTE).forEach(([k, o]) => { ORTE[k] = () => [o.x, bodenY(o.x, o.z) + o.h, o.z]; });
// Insel.ort("haus") liefert eine Funktion für Zeige.auf(); Insel.bildschirm(x, y, z) rechnet einen 3D-Punkt um
window.Insel = { bildschirm, ort: (name) => () => (ORTE[name] && !drinnen ? bildschirm(...ORTE[name]()) : null), ORTE: Object.keys(ORTE) };
// Test-Haken: wie viele sichtbare Meshes hat jedes Objekt der Szene (für das Leistungsbudget, NA-29)
function teileZaehlen() {
  return scene.children.map(o => { let n = 0, d = 0; o.traverseVisible(m => { if (m.isMesh || m.isPoints || m.isLineSegments) { n++; const g = m.geometry; d += g.index ? g.index.count / 3 : (g.attributes.position ? g.attributes.position.count / 3 : 0); } }); return { name: o.type + (o.userData.tipp ? "*" : "") + (o.userData.aktion ? ":" + o.userData.aktion[1] : ""), x: Math.round(o.position.x), z: Math.round(o.position.z), meshes: n, dreiecke: Math.round(d) }; })
    .filter(x => x.meshes > 0).sort((a, b) => b.meshes - a.meshes);
}
window.__heimat = { extras3d: EXTRAS_3D, ecken: (o) => { let n = 0; (o || ich).traverse(x => { if (x.isMesh) n += x.geometry.attributes.position.count; }); return n; }, armEcken: () => ich.userData.arme.map(a => { let n = 0; a.traverse(x => { if (x.isMesh) n += x.geometry.attributes.position.count; }); return n; }), figuren: () => ({ nachbarn: NACHBARN.map(n => ({ e: n.e, x: n.x, z: n.z, dreh: n.dreh })).concat([{ e: "paula", x: P.buehne[0], z: P.buehne[1], dreh: P.buehne[2] }, { e: "tilda", x: P.schach[0], z: P.schach[1], dreh: P.schach[2] }]), tier: tier ? { x: tier.position.x, z: tier.position.z } : null }), teile: teileZaehlen, bildschirm, sonnenuhr, su: SU, get paket() { return paket ? { x: paket.position.x, z: paket.position.z } : null; }, oeffnePaket, lichter: () => (lichter ? lichter.count : 0), nebel: () => ({ stufe: nebelJetzt, near: scene.fog.near, far: scene.fog.far, band: nebelBand.visible ? nebelBand.scale.x : 0 }), naechsteStory, prolog: (w) => starteProlog(!!w), get imProlog() { return !!prolog; }, steg: STEG,  wissen: () => wissen, zeichnungen: () => renderer.info.render.calls, info: () => Object.assign(messe(renderer, scene), { einfach: EINFACH, sparen, drinnen }), get sparen() { return sparen; }, blick: (g, n, a) => { freiKamera = true; gieren = g; neigung = n; abstand = a; }, ich, tier, wasser, get kartenweg() { return kartenweg; }, lampen: () => ({ n: LATERNEN.length, an: NACHT || DAEMMER, licht: tuerLicht ? tuerLicht.intensity : 0, augenweiss: WEISS_AUGE.type }), figurInfo: () => { const s = new Vector3(), h = new Vector3(); return Object.assign({}, ich.userData.info, { haende: ich.userData.arme.map(a => { a.updateMatrixWorld(true); a.getWorldPosition(s); a.localToWorld(h.set(0, -0.66, 0)); return Math.round((h.x - s.x) * 100) / 100; }) }); }, leuchtturm: () => ({ x: leuchtturm.position.x, z: leuchtturm.position.z, lampe: "#" + lampeMat.color.getHexString(), strahl: lichtStrahl.visible }), reingehen, rausgehen, get drinnen() { return drinnen; }, get besuche() { return besuche; }, get ziel() { return ziel; }, laufeZu: (x, z) => { ziel = new Vector3(x, 0.25, z); markiere(ziel); }, tippe: (i) => NACHBARN[i].obj.userData.tipp(), station: () => station.userData.tipp(), get wetter() { return wetter; }, laden: () => laden(), zimmerDaten, get rennt() { return rennt; }, get aktion() { return naechstes ? naechstes.userData.aktion[1] : null; }, druecke: () => aktion(), get tanzt() { return performance.now() < tanzBis; }, SAISON, NACHT };
