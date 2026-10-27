// Probe „Pixel 2,5D“ (Entwurf 27.10.2026, nur Vorschau): Look der Handheld-Abenteuer um 2008–2010 –
// kleine 3D-Welt in niedriger Auflösung (≈ 200 Zeilen, ganzzahlig vergrößert), Toon-Licht mit harten Stufen,
// dunkle 1-Pixel-Umrisse an Kanten (wie die „Kantenmarkierung“ der damaligen Handheld-Grafik, hier als Nachbearbeitung über die Tiefe),
// Pixel-Texturen (16 Pixel je Feld), Klippen, Büsche, Grasbüschel und Figuren mit großem Kopf als einfache 3D-Modelle.
// Alles im Code gebaut – keine fremden Figuren, Texturen oder Modelle.
import {
  WebGLRenderer, WebGLRenderTarget, DepthTexture, HalfFloatType, Scene, PerspectiveCamera, OrthographicCamera, Color, HemisphereLight, DirectionalLight,
  Mesh, Group, MeshToonMaterial, MeshBasicMaterial, ShaderMaterial, PlaneGeometry, BoxGeometry, CylinderGeometry, IcosahedronGeometry, ConeGeometry,
  SphereGeometry, CircleGeometry, BufferGeometry, Float32BufferAttribute, CanvasTexture, DataTexture, RedFormat, NearestFilter, SRGBColorSpace,
  RepeatWrapping, Vector2, Vector3, Raycaster, InstancedMesh, Object3D, Clock, MathUtils
} from "../three/three.module.js";
import { messe } from "./gemeinsam.js";

// ---------- Farben und Pixel-Texturen ----------
let saat = 3; const zz = () => { saat = (saat * 16807) % 2147483647; return saat / 2147483647; };
const PAL = {
  gras: "#7FD24A", grasD: "#5AAE38", grasH: "#B4EC70", grasT: "#3E8C2E", weg: "#F0D898", wegD: "#D4B670", wegK: "#BC9C5C",
  sand: "#F8E4A8", sandD: "#E0C47E", fels: "#C89A68", felsD: "#9C6E48", felsH: "#E2BC88", wasser: "#3C8CE8", wasserD: "#2C6CC8", wasserH: "#8CD0FF", schaum: "#FFFFFF",
  stamm: "#8A5A34", laub: "#4CB848", wand: "#FFF0C8", wandD: "#E4CC98", dach: "#E8584A", dachD: "#B23C34", tuer: "#7A4A28", glas: "#9CDCFF",
  holz: "#D29A5C", holzD: "#9A6A3C", stein: "#B4B8C8", steinD: "#8488A0", umriss: "#2A2034",
  haut: "#FFD6B4", haar: "#9A5A2E", rosa: "#FF8CC0", lila: "#8A64D8", schuh: "#C83878", auge: "#2A2034", orange: "#F48A30", creme: "#FFF2E0", blau: "#5A7CF0", gelb: "#FFD448"
};
const R = (g, f, x, y, b, h) => { g.fillStyle = f; g.fillRect(x, y, b, h); };
function leinwand(b, h, malen) { const c = document.createElement("canvas"); c.width = b; c.height = h; const g = c.getContext("2d"); g.imageSmoothingEnabled = false; malen(g, b, h); return c; }
function textur(c, wiederholen = false) {
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.magFilter = t.minFilter = NearestFilter; t.generateMipmaps = false;
  if (wiederholen) t.wrapS = t.wrapT = RepeatWrapping;
  return t;
}
// gemalte Grasbüschel-Striche (nicht Rauschen): kleine „v“-Formen in dunkel, darüber ein heller Punkt
const buschel = (g, f, x, y) => { R(g, f, x, y, 1, 2); R(g, f, x + 2, y, 1, 2); R(g, f, x + 1, y + 1, 1, 2); };
const KACHELN = {
  gras0: g => { R(g, PAL.gras, 0, 0, 16, 16); buschel(g, PAL.grasD, 3, 4); buschel(g, PAL.grasD, 10, 11); R(g, PAL.grasH, 12, 3, 1, 1); R(g, PAL.grasH, 5, 12, 1, 1); },
  gras1: g => { R(g, PAL.gras, 0, 0, 16, 16); buschel(g, PAL.grasD, 8, 6); R(g, PAL.grasH, 2, 2, 2, 1); R(g, PAL.grasH, 13, 13, 1, 1); },
  gras2: g => { R(g, PAL.gras, 0, 0, 16, 16); R(g, PAL.grasH, 6, 9, 1, 1); },
  blume0: g => { R(g, PAL.gras, 0, 0, 16, 16); [[4, 4], [11, 10]].forEach(([x, y]) => { R(g, "#FFFFFF", x - 1, y, 3, 1); R(g, "#FFFFFF", x, y - 1, 1, 3); R(g, PAL.gelb, x, y, 1, 1); }); },
  blume1: g => { R(g, PAL.gras, 0, 0, 16, 16); [[10, 4], [5, 11]].forEach(([x, y]) => { R(g, PAL.rosa, x - 1, y, 3, 1); R(g, PAL.rosa, x, y - 1, 1, 3); R(g, PAL.gelb, x, y, 1, 1); }); },
  weg: g => { R(g, PAL.weg, 0, 0, 16, 16); [[3, 4, 3], [11, 2, 2], [8, 10, 3], [2, 13, 2], [13, 12, 2]].forEach(([x, y, b]) => { R(g, PAL.wegK, x, y + 1, b, 1); R(g, PAL.wegD, x, y, b, 1); }); },
  sand: g => { R(g, PAL.sand, 0, 0, 16, 16); [[4, 5], [12, 9], [7, 13]].forEach(([x, y]) => R(g, PAL.sandD, x, y, 2, 1)); },
  // Klippe: Felsband mit Schichten, oben Grasüberhang
  kanteGras: g => { R(g, PAL.fels, 0, 0, 16, 16); [4, 9, 14].forEach(y => R(g, PAL.felsD, 0, y, 16, 1)); [[2, 5], [9, 10], [12, 1], [5, 11]].forEach(([x, y]) => { R(g, PAL.felsH, x, y, 3, 1); R(g, PAL.felsD, x + 3, y, 1, 3); });
    R(g, PAL.gras, 0, 0, 16, 2); for (let x = 0; x < 16; x += 4) { R(g, PAL.gras, x + 1, 2, 2, 1); R(g, PAL.grasD, x, 2, 1, 1); } },
  kanteSand: g => { R(g, PAL.sandD, 0, 0, 16, 16); R(g, "#C8A868", 0, 9, 16, 7); [[2, 11], [9, 12], [13, 10]].forEach(([x, y]) => R(g, PAL.sandD, x, y, 2, 1)); for (let x = 0; x < 16; x++) R(g, PAL.schaum, x, 14 - ((x >> 1) % 2), 1, 3); }
};
const NAMEN = Object.keys(KACHELN);
const atlas = leinwand(NAMEN.length * 16, 16, g => NAMEN.forEach((n, i) => { g.save(); g.translate(i * 16, 0); KACHELN[n](g); g.restore(); }));
const ATLAS = textur(atlas);
const wasserTex = [0, 1].map(f => textur(leinwand(32, 32, g => {
  R(g, PAL.wasser, 0, 0, 32, 32);
  [[3, 5], [19, 12], [8, 22], [24, 27]].forEach(([x, y], i) => { const v = (i + f) % 2 ? 1 : 0; R(g, PAL.wasserH, x + v * 2, y, 5, 1); R(g, PAL.wasserH, x + 1 + v * 2, y - 1, 3, 1); });
  R(g, PAL.wasserD, 12, 3, 4, 1); R(g, PAL.wasserD, 27, 18, 3, 1); R(g, PAL.wasserD, 2, 15, 3, 1);
}), true));

// ---------- Toon-Material (drei harte Lichtstufen) ----------
const stufen = new DataTexture(new Uint8Array([120, 190, 255]), 3, 1, RedFormat); stufen.magFilter = stufen.minFilter = NearestFilter; stufen.needsUpdate = true;
const mats = new Map();
const toon = (farbe, map = null) => { const k = farbe + (map ? map.uuid : ""); if (!mats.has(k)) mats.set(k, new MeshToonMaterial({ color: farbe, map, gradientMap: stufen })); return mats.get(k); };

// ---------- Karte: Insel mit Wiese, Sand und einem höheren Plateau ----------
const BREITE = 40, TIEFE = 30, MX = 20, MZ = 15;
const karte = [];
for (let y = 0; y < TIEFE; y++) for (let x = 0; x < BREITE; x++) {
  const d = ((x + 0.5 - MX) / 15) ** 2 + ((y + 0.5 - MZ) / 11) ** 2, p = ((x + 0.5 - 29) / 6.5) ** 2 + ((y + 0.5 - 9) / 4.2) ** 2;
  karte.push(d < 0.66 ? (p < 1 ? "plateau" : "gras") : d < 1 ? "sand" : "wasser");
}
const art = (x, y) => (x < 0 || y < 0 || x >= BREITE || y >= TIEFE) ? "wasser" : karte[y * BREITE + x];
const setze = (x, y, a) => { if (art(x, y) === "gras") karte[y * BREITE + x] = a; };
[[11, 12], [11, 13]].concat(Array.from({ length: 12 }, (_, i) => [12 + i, 13]), Array.from({ length: 6 }, (_, i) => [23, 14 + i])).forEach(([x, y]) => setze(x, y, "weg"));
const HOEHE = { gras: 1, weg: 1, plateau: 2, sand: 0.45, wasser: 0.1 };
const hoehe = (x, y) => HOEHE[art(x, y)];
const fest = new Set();
for (let y = -2; y < TIEFE + 2; y++) for (let x = -2; x < BREITE + 2; x++) if (["wasser", "plateau"].includes(art(x, y))) fest.add(y * 1000 + x);
const blockiere = (x, y) => fest.add(y * 1000 + x);
const istFest = (x, y) => fest.has(y * 1000 + x);
const welt = (fx, fy) => [fx - MX, fy - MZ];
const mitte = (x, y) => { const [wx, wz] = welt(x, y); return [wx + 0.5, hoehe(x, y), wz + 0.5]; };

// ---------- Renderer: niedrige Auflösung, Szene in ein Bild, dann Umrisse ----------
const buehne = document.getElementById("buehne");
const renderer = new WebGLRenderer({ antialias: false, powerPreference: "high-performance", preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.outputColorSpace = SRGBColorSpace;
renderer.domElement.style.imageRendering = "pixelated";
buehne.appendChild(renderer.domElement);
const scene = new Scene();
scene.background = new Color(PAL.wasser);
const camera = new PerspectiveCamera(30, 1, 1, 90);
scene.add(new HemisphereLight("#FFF6E8", "#9AB878", 1.15));
const sonne = new DirectionalLight("#FFF2D8", 2.1); sonne.position.set(-5, 12, 7); scene.add(sonne);
const bildZiel = new WebGLRenderTarget(4, 4, { type: HalfFloatType, minFilter: NearestFilter, magFilter: NearestFilter, depthTexture: new DepthTexture(4, 4) });
const umriss = new ShaderMaterial({
  uniforms: { tFarbe: { value: bildZiel.texture }, tTiefe: { value: bildZiel.depthTexture }, texel: { value: new Vector2() }, near: { value: camera.near }, far: { value: camera.far } },
  vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
  fragmentShader: `uniform sampler2D tFarbe; uniform sampler2D tTiefe; uniform vec2 texel; uniform float near; uniform float far; varying vec2 vUv;
    float lin(vec2 p){ float z = texture2D(tTiefe, p).r * 2.0 - 1.0; return 2.0 * near * far / (far + near - z * (far - near)); }
    void main(){
      vec4 c = texture2D(tFarbe, vUv); float d = lin(vUv);
      float m = max(max(lin(vUv + vec2(texel.x, 0.0)) - d, lin(vUv - vec2(texel.x, 0.0)) - d), max(lin(vUv + vec2(0.0, texel.y)) - d, lin(vUv - vec2(0.0, texel.y)) - d));
      if (m > 0.12 + d * 0.012) c.rgb = mix(c.rgb, vec3(0.02, 0.012, 0.03), 0.82);
      gl_FragColor = vec4(c.rgb, 1.0);
      #include <colorspace_fragment>
    }`,
  depthTest: false, depthWrite: false
});
const nachScene = new Scene(), nachKamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
nachScene.add(new Mesh(new PlaneGeometry(2, 2), umriss));

let faktor = 3; const intern = new Vector2(), versatz = new Vector3();
function groesse() {
  const b = buehne.clientWidth, h = buehne.clientHeight;
  faktor = Math.max(2, Math.round(Math.min(b, h) / 190));
  intern.set(Math.ceil(b / faktor), Math.ceil(h / faktor));
  renderer.setSize(intern.x, intern.y, false);
  renderer.domElement.style.width = intern.x * faktor + "px"; renderer.domElement.style.height = intern.y * faktor + "px";
  bildZiel.setSize(intern.x, intern.y); umriss.uniforms.texel.value.set(1 / intern.x, 1 / intern.y);
  camera.aspect = intern.x / intern.y; camera.updateProjectionMatrix();
  const d = Math.max(15, intern.y / 16 / 0.66);         // ein Feld ≈ 16 Bildpunkte
  versatz.set(0, d * 0.74, d * 0.67);                   // schräg von oben (≈ 48°), Gesichter bleiben sichtbar
}
addEventListener("resize", groesse); groesse();

// ---------- Boden: Kachel-Oberflächen und Klippen als ein Mesh ----------
const boden = (() => {
  const pos = [], uv = [], idx = [];
  const AW = atlas.width;
  function viereck(a, b, c, d, name, v0 = 0, v1 = 1, ub = 1) {
    const i = NAMEN.indexOf(name), u0 = (i * 16 + 0.02) / AW, u1 = ((i + ub) * 16 - 0.02) / AW, n = pos.length / 3;
    pos.push(...a, ...b, ...c, ...d);
    uv.push(u0, v0 + 0.002, u1, v0 + 0.002, u1, v1 - 0.002, u0, v1 - 0.002);
    idx.push(n, n + 1, n + 2, n, n + 2, n + 3);
  }
  for (let y = 0; y < TIEFE; y++) for (let x = 0; x < BREITE; x++) {
    const a = art(x, y); if (a === "wasser") continue;
    const h = HOEHE[a], [wx, wz] = welt(x, y);
    let name = a === "plateau" ? "gras" : a;
    if (name === "gras") { const r = zz(); name = r < 0.06 ? "blume" + Math.floor(zz() * 2) : "gras" + (r < 0.35 ? 0 : r < 0.6 ? 1 : 2); }
    viereck([wx, h, wz + 1], [wx + 1, h, wz + 1], [wx + 1, h, wz], [wx, h, wz], name);
    for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
      const hn = hoehe(x + dx, y + dy); if (hn >= h) continue;
      // Klippen: je Einheit Höhe ein Felsband (Textur wiederholt sich), Sand → Wasser mit Schaum
      const dh = h - hn, k = a === "sand" ? "kanteSand" : "kanteGras";
      const teile = a === "sand" ? [[hn, h, 0, Math.min(1, dh)]] : Array.from({ length: Math.ceil(dh - 0.001) }, (_, j) => { const o = h - j, u = Math.max(hn, o - 1); return [u, o, 1 - (o - u), 1]; });
      for (const [u, o, v0, v1] of teile) {
        if (dy === 1) viereck([wx, u, wz + 1], [wx + 1, u, wz + 1], [wx + 1, o, wz + 1], [wx, o, wz + 1], k, v0, v1);
        if (dy === -1) viereck([wx + 1, u, wz], [wx, u, wz], [wx, o, wz], [wx + 1, o, wz], k, v0, v1);
        if (dx === 1) viereck([wx + 1, u, wz + 1], [wx + 1, u, wz], [wx + 1, o, wz], [wx + 1, o, wz + 1], k, v0, v1);
        if (dx === -1) viereck([wx, u, wz], [wx, u, wz + 1], [wx, o, wz + 1], [wx, o, wz], k, v0, v1);
      }
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new Float32BufferAttribute(uv, 2)); g.setIndex(idx);
  g.computeVertexNormals();
  const m = new Mesh(g, toon("#FFFFFF", ATLAS)); scene.add(m); return m;
})();
const wasserMat = new MeshToonMaterial({ map: wasserTex[0], gradientMap: stufen });
wasserTex.forEach(t => t.repeat.set(60, 60));
const wasser = new Mesh(new PlaneGeometry(120, 120), wasserMat); wasser.rotation.x = -Math.PI / 2; wasser.position.y = HOEHE.wasser; scene.add(wasser);
// Ufer: Wasserfelder neben Land sind flach und heller (Sand schimmert durch); darauf Schaum, der zur Küste zeigt und in zwei Bildern wogt
const flachTex = [0, 1].map(f => textur(leinwand(16, 16, g => {
  R(g, "#5CB4F4", 0, 0, 16, 16); R(g, "#78C8FA", 0, 0, 16, 4);
  [[2 + f * 3, 7], [10 - f * 2, 12]].forEach(([x, y]) => { R(g, PAL.wasserH, x, y, 4, 1); R(g, PAL.wasserH, x + 1, y - 1, 2, 1); });
})));
const schaumTex = [0, 1].map(f => textur(leinwand(16, 16, g => {
  // nur oben (Landseite) Schaum; Rest durchsichtig. Kante leicht wellig, Bläschen davor
  for (let x = 0; x < 16; x++) { const t = 2 + ((x + f * 2) % 6 < 3 ? 1 : 0) + f; R(g, PAL.schaum, x, 0, 1, t); R(g, "#D8F0FF", x, t, 1, 1); }
  [[3 + f * 2, 6], [11 - f, 7 + f], [7, 9 - f]].forEach(([x, y]) => R(g, PAL.schaum, x, y, 1, 1));
})));
{
  const flach = [], schaum = [];
  const ist = (x, y) => art(x, y) !== "wasser";
  for (let y = -1; y <= TIEFE; y++) for (let x = -1; x <= BREITE; x++) {
    if (ist(x, y)) continue;
    let nah = false;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (ist(x + dx, y + dy)) nah = true;
    if (!nah) continue;
    const [wx, wz] = welt(x, y);
    flach.push([wx, wz]);
    // Schaum je Landseite: Textur so drehen, dass ihr oberer Rand zur Küste zeigt
    if (ist(x, y - 1)) schaum.push([wx, wz, [0, 0, 1, 0, 1, 1, 0, 1]]);
    if (ist(x, y + 1)) schaum.push([wx, wz, [1, 1, 0, 1, 0, 0, 1, 0]]);
    if (ist(x + 1, y)) schaum.push([wx, wz, [0, 0, 0, 1, 1, 1, 1, 0].map((v, i) => i % 2 ? v : 1 - v)]);
    if (ist(x - 1, y)) schaum.push([wx, wz, [1, 1, 1, 0, 0, 0, 0, 1].map((v, i) => i % 2 ? v : 1 - v)]);
  }
  const flaechen = (liste, y, uvs) => {
    const pos = [], uv = [], idx = [];
    liste.forEach(([wx, wz, u], i) => {
      pos.push(wx, y, wz + 1, wx + 1, y, wz + 1, wx + 1, y, wz, wx, y, wz);
      uv.push(...(u || uvs)); idx.push(i * 4, i * 4 + 1, i * 4 + 2, i * 4, i * 4 + 2, i * 4 + 3);
    });
    const g = new BufferGeometry(); g.setAttribute("position", new Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
    return g;
  };
  var flachMat = new MeshToonMaterial({ map: flachTex[0], gradientMap: stufen });
  var schaumMat = new MeshToonMaterial({ map: schaumTex[0], gradientMap: stufen, alphaTest: 0.5, transparent: false });
  scene.add(new Mesh(flaechen(flach, HOEHE.wasser + 0.004, [0, 0, 1, 0, 1, 1, 0, 1]), flachMat));
  scene.add(new Mesh(flaechen(schaum, HOEHE.wasser + 0.008), schaumMat));
}

// ---------- Haus: runde Ecken gibt es nicht, aber ein dickes Dach mit Überstand ----------
{
  const [fx, fy] = [10, 9];                           // Grundfläche 3×3 Felder, Tür unten (Feld 11, 11)
  for (let y = fy; y < fy + 3; y++) for (let x = fx; x < fx + 3; x++) blockiere(x, y);
  const [wx, wz] = welt(fx, fy), H = 1, W = 3, HW = 1.9;
  const front = textur(leinwand(64, 36, g => {
    R(g, PAL.wand, 0, 0, 64, 36); for (let y = 7; y < 36; y += 7) R(g, PAL.wandD, 0, y, 64, 1);
    for (let x = 0; x < 64; x += 16) R(g, PAL.holzD, x, 0, 2, 36); R(g, PAL.holzD, 0, 33, 64, 3);
    R(g, PAL.umriss, 25, 13, 14, 23); R(g, PAL.tuer, 26, 14, 12, 22); R(g, PAL.holzD, 31, 14, 1, 22); R(g, PAL.gelb, 35, 25, 1, 2);
    [[6, 12], [46, 12]].forEach(([x, y]) => { R(g, PAL.umriss, x - 1, y - 1, 14, 12); R(g, PAL.glas, x, y, 12, 10); R(g, "#FFFFFF", x + 1, y + 1, 3, 2); R(g, PAL.holz, x, y + 5, 12, 1); R(g, PAL.holz, x + 6, y, 1, 10); R(g, PAL.holz, x - 2, y + 11, 16, 2); R(g, PAL.rosa, x, y + 9, 2, 2); R(g, PAL.gelb, x + 5, y + 9, 2, 2); R(g, PAL.rosa, x + 10, y + 9, 2, 2); });
  }));
  const seite = textur(leinwand(64, 36, g => { R(g, PAL.wand, 0, 0, 64, 36); for (let y = 7; y < 36; y += 7) R(g, PAL.wandD, 0, y, 64, 1); for (let x = 0; x < 64; x += 16) R(g, PAL.holzD, x, 0, 2, 36); R(g, PAL.holzD, 0, 33, 64, 3); R(g, PAL.umriss, 25, 11, 14, 12); R(g, PAL.glas, 26, 12, 12, 10); R(g, PAL.holz, 26, 17, 12, 1); }));
  const sM = toon("#FFFFFF", seite);
  const kasten = new Mesh(new BoxGeometry(W, HW, W), [sM, sM, toon(PAL.wand), toon(PAL.wand), toon("#FFFFFF", front), sM]);
  kasten.position.set(wx + W / 2, H + HW / 2, wz + W / 2); scene.add(kasten);
  const ziegel = textur(leinwand(16, 16, g => { R(g, PAL.dach, 0, 0, 16, 16); for (let y = 0; y < 16; y += 4) { R(g, PAL.dachD, 0, y + 3, 16, 1); for (let x = (y / 4 % 2) * 4; x < 16; x += 8) R(g, PAL.dachD, x, y, 1, 3); R(g, "#FF8070", (y * 3) % 13, y + 1, 3, 1); } }), true);
  // Satteldach mit First von vorn nach hinten – der Giebel zeigt zur Kamera (wie bei den Häusern der damaligen Handheld-Abenteuer)
  const ue = 0.4, rand = H + HW - 0.08, first = H + HW + 1.45, xl = wx - ue, xr = wx + W + ue, xm = wx + W / 2, z0 = wz - ue, z1 = wz + W + ue;
  const sch = Math.hypot(W / 2 + ue, first - rand), L = z1 - z0;
  const dg = new BufferGeometry();
  dg.setAttribute("position", new Float32BufferAttribute([xl, rand, z1, xm, first, z1, xm, first, z0, xl, rand, z0, xr, rand, z0, xm, first, z0, xm, first, z1, xr, rand, z1], 3));
  dg.setAttribute("uv", new Float32BufferAttribute([0, 0, 0, sch, L, sch, L, 0, 0, 0, 0, sch, L, sch, L, 0], 2));
  dg.setIndex([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7]); dg.computeVertexNormals();
  scene.add(new Mesh(dg, new MeshToonMaterial({ map: ziegel, gradientMap: stufen, side: 2 })));
  // Giebel vorn und hinten: senkrechte Holzbretter, Rundfenster mit Kreuz, kleiner Blumenkasten
  const giebelTex = textur(leinwand(48, 24, g => {
    R(g, PAL.holz, 0, 0, 48, 24); for (let x = 1; x < 48; x += 4) { R(g, PAL.holzD, x, 0, 1, 24); R(g, "#E8BC7C", x + 1, 0, 1, 24); }
    R(g, PAL.holzD, 0, 22, 48, 2);
    R(g, PAL.umriss, 19, 6, 10, 10); R(g, PAL.umriss, 18, 7, 12, 8); R(g, PAL.glas, 20, 7, 8, 8); R(g, PAL.glas, 19, 8, 10, 6);
    R(g, "#FFFFFF", 20, 8, 2, 2); R(g, PAL.holzD, 23, 7, 2, 8); R(g, PAL.holzD, 19, 10, 10, 2);
    R(g, PAL.holzD, 18, 16, 12, 2); R(g, PAL.rosa, 19, 15, 2, 1); R(g, PAL.gelb, 23, 15, 2, 1); R(g, PAL.rosa, 27, 15, 2, 1);
  }));
  const gh = first - 0.1, wo = H + HW, gg = new BufferGeometry();
  gg.setAttribute("position", new Float32BufferAttribute([wx, wo, wz + W + 0.002, wx + W, wo, wz + W + 0.002, xm, gh, wz + W + 0.002, wx + W, wo, wz - 0.002, wx, wo, wz - 0.002, xm, gh, wz - 0.002], 3));
  gg.setAttribute("uv", new Float32BufferAttribute([0, 0, 1, 0, 0.5, 1, 0, 0, 1, 0, 0.5, 1], 2));
  gg.computeVertexNormals(); scene.add(new Mesh(gg, new MeshToonMaterial({ map: giebelTex, gradientMap: stufen, side: 2 })));
  // Windbretter an den Giebelkanten (geben dem Dach vorn eine dicke, dunkle Kante) und ein First
  const brettM = toon(PAL.dachD), winkel = Math.atan2(first - rand, W / 2 + ue);
  [z1 + 0.04, z0 - 0.04].forEach(bz => [-1, 1].forEach(sx => {
    const b = new Mesh(new BoxGeometry(sch + 0.08, 0.22, 0.14), brettM);
    b.position.set(xm + sx * (W / 2 + ue) / 2, (rand + first) / 2 - 0.04, bz); b.rotation.z = -sx * winkel; scene.add(b);
  }));
  const firstB = new Mesh(new BoxGeometry(0.28, 0.18, L + 0.16), brettM); firstB.position.set(xm, first + 0.02, (z0 + z1) / 2); scene.add(firstB);
  const kamin = new Mesh(new BoxGeometry(0.45, 1.1, 0.45), toon(PAL.stein)); kamin.position.set(wx + 2.25, first - 0.3, wz + 0.8); scene.add(kamin);
  // Stufe vor der Tür, Briefkasten, Töpfe
  const stufe = new Mesh(new BoxGeometry(1.2, 0.12, 0.5), toon(PAL.stein)); stufe.position.set(wx + 1.5, H + 0.06, wz + W + 0.25); scene.add(stufe);
  const pf = new Mesh(new BoxGeometry(0.12, 0.7, 0.12), toon(PAL.holzD)); pf.position.set(wx + W + 0.5, H + 0.35, wz + W + 0.5); scene.add(pf);
  const bk = new Mesh(new BoxGeometry(0.4, 0.3, 0.32), toon(PAL.blau)); bk.position.set(wx + W + 0.5, H + 0.8, wz + W + 0.5); scene.add(bk);
  blockiere(13, 12);
  const topf = new CylinderGeometry(0.24, 0.17, 0.42, 8); topf.translate(0, 0.21, 0);
  instanzen(topf, toon("#C8704A"), [[wx + 0.35, H, wz + W + 0.35], [wx + 2.65, H, wz + W + 0.35]]);
  [[10, 12], [12, 12]].forEach(([x, y]) => blockiere(x, y));
}

// ---------- Bäume, Büsche, Grasbüschel, Steine, Zaun (gleiche Teile als Instanzen) ----------
function instanzen(geo, mat, liste) {
  const m = new InstancedMesh(geo, mat, liste.length), o = new Object3D();
  liste.forEach(([x, y, z, s = 1, r = 0], i) => { o.position.set(x, y, z); o.scale.setScalar(s); o.rotation.set(0, r, 0); o.updateMatrix(); m.setMatrixAt(i, o.matrix); });
  scene.add(m); return m;
}
const BAEUME = [[5, 10], [7, 18], [16, 22], [27, 22], [33, 17], [4, 15], [15, 8], [19, 6], [24, 9], [30, 6], [33, 9], [26, 12]];
const BUESCHE = [[14, 15], [15, 15], [20, 17], [21, 17], [8, 12], [28, 17], [29, 18], [17, 11], [31, 13]];
const STEINE = [[19, 15], [10, 19], [30, 21], [25, 16]];
BAEUME.concat(BUESCHE, STEINE).forEach(([x, y]) => blockiere(x, y));
const stamm = new CylinderGeometry(0.16, 0.24, 1.1, 6); stamm.translate(0, 0.55, 0);
instanzen(stamm, toon(PAL.stamm), BAEUME.map(f => mitte(...f)));
const krone = new IcosahedronGeometry(1.05, 1); krone.scale(1, 0.85, 1); krone.translate(0, 1.85, 0);
const krone2 = new IcosahedronGeometry(0.62, 1); krone2.translate(0.35, 2.45, 0.15);
const laubTex = textur(leinwand(16, 16, g => { R(g, PAL.laub, 0, 0, 16, 16); [[2, 3], [9, 1], [12, 8], [5, 10], [1, 13], [10, 13]].forEach(([x, y]) => { R(g, "#68D060", x, y, 3, 1); R(g, "#3A9A3C", x + 1, y + 1, 3, 1); }); }), true);
const laubM = new MeshToonMaterial({ color: "#FFFFFF", map: laubTex, gradientMap: stufen });
instanzen(krone, laubM, BAEUME.map((f, i) => [...mitte(...f), 1 + (i % 3) * 0.08, i]));
instanzen(krone2, laubM, BAEUME.map((f, i) => [...mitte(...f), 1 + (i % 3) * 0.08, i]));
const busch = new IcosahedronGeometry(0.5, 1); busch.scale(1, 0.75, 1); busch.translate(0, 0.32, 0);
instanzen(busch, new MeshToonMaterial({ color: "#E0FFD8", map: laubTex, gradientMap: stufen }), BUESCHE.map((f, i) => [...mitte(...f), 1, i]));
const steinGeo = new IcosahedronGeometry(0.42, 0); steinGeo.scale(1, 0.75, 1); steinGeo.translate(0, 0.25, 0);
instanzen(steinGeo, toon(PAL.stein), STEINE.map((f, i) => [...mitte(...f), 1, i * 1.3]));
// Grasbüschel: drei kleine Spitzen, über die Wiese verteilt (nicht auf Wegen)
{
  const halm = new ConeGeometry(0.07, 0.34, 3); halm.translate(0, 0.17, 0);
  const tuff = new BufferGeometry().copy(halm);
  const liste = [];
  for (let i = 0; i < 420; i++) {
    const x = Math.floor(zz() * BREITE), y = Math.floor(zz() * TIEFE), a = art(x, y);
    if (!(a === "gras" || a === "plateau") || istFest(x, y) && a !== "plateau") continue;
    const [wx, wz] = welt(x, y);
    [[0, 0], [0.12, 0.05], [-0.1, 0.07]].forEach(([dx, dz]) => liste.push([wx + 0.2 + zz() * 0.6 + dx, hoehe(x, y), wz + 0.2 + zz() * 0.6 + dz, 0.8 + zz() * 0.5, zz() * 6]));
  }
  instanzen(tuff, toon(PAL.grasT), liste);
}
// Zaun am Weg
{
  const zx = Array.from({ length: 6 }, (_, i) => 15 + i), zy = 12;
  const pf = new BoxGeometry(0.14, 0.6, 0.14); pf.translate(0, 0.3, 0);
  instanzen(pf, toon(PAL.holz), zx.map(x => { const [wx, wz] = welt(x, zy); return [wx + 0.5, 1, wz + 0.8]; }));
  const [ax, az] = welt(zx[0], zy);
  [0.24, 0.46].forEach(h => { const l = new Mesh(new BoxGeometry(zx.length - 1, 0.08, 0.06), toon(PAL.holz)); l.position.set(ax + 0.5 + (zx.length - 1) / 2, 1 + h, az + 0.8); scene.add(l); });
  zx.forEach(x => blockiere(x, zy));
}
// Schild an der Weggabelung
{
  const [wx, wz] = welt(24, 12), s = new Group();
  const p = new Mesh(new BoxGeometry(0.12, 0.75, 0.12), toon(PAL.holzD)); p.position.y = 0.37; s.add(p);
  const b = new Mesh(new BoxGeometry(0.9, 0.55, 0.1), toon(PAL.holz)); b.position.y = 0.85; s.add(b);
  s.position.set(wx + 0.5, 1, wz + 0.6); scene.add(s); blockiere(24, 12);
}

// ---------- Figuren: einfache 3D-Modelle mit großem Kopf, Toon-Licht ----------
const box = (b, h, t, f) => new Mesh(new BoxGeometry(b, h, t), toon(f));
const kugel = (r, f, w = 10, hh = 8) => new Mesh(new SphereGeometry(r, w, hh), toon(f));
const an = (eltern, kind, x, y, z) => { kind.position.set(x, y, z); eltern.add(kind); return kind; };
function kindModell() {
  const g = new Group(), k = new Group(); g.add(k);
  const beine = [-1, 1].map(s => { const b = an(k, new Group(), 0.1 * s, 0.32, 0); an(b, box(0.12, 0.26, 0.12, PAL.haut), 0, -0.15, 0); an(b, box(0.15, 0.09, 0.2, PAL.schuh), 0, -0.28, 0.03); return b; });
  an(k, new Mesh(new CylinderGeometry(0.17, 0.34, 0.32, 8), toon(PAL.lila)), 0, 0.42, 0);        // Rock
  an(k, new Mesh(new CylinderGeometry(0.18, 0.2, 0.24, 8), toon(PAL.rosa)), 0, 0.68, 0);         // Oberteil
  const arme = [-1, 1].map(s => { const a = an(k, new Group(), 0.25 * s, 0.76, 0); a.rotation.z = 0.35 * s; an(a, box(0.1, 0.24, 0.1, PAL.rosa), 0, -0.1, 0); an(a, kugel(0.07, PAL.haut, 6, 4), 0, -0.25, 0); return a; });
  const kopf = an(k, new Group(), 0, 1.08, 0);
  an(kopf, kugel(0.36, PAL.haut, 12, 10), 0, 0, 0);
  const haar = an(kopf, new Mesh(new SphereGeometry(0.39, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.45), toon(PAL.haar)), 0, 0.04, -0.03); haar.rotation.x = -0.45;
  an(kopf, kugel(0.37, PAL.haar, 10, 8), 0, -0.04, -0.12).scale.set(1, 1, 0.75);
  [-1, 1].forEach(s => an(kopf, kugel(0.14, PAL.haar, 8, 6), 0.36 * s, -0.14, -0.08));                // Zöpfe
  // Gesicht als kleine Pixel-Textur (12×10) auf einer leicht gewölbten Fläche vor dem Kopf:
  // große Augen mit Lichtpunkt, rosa Wangen, kleiner Mund – auf dem Bildschirm etwa 12 × 10 Bildpunkte
  const gesicht = textur(leinwand(12, 10, g => {
    g.clearRect(0, 0, 12, 10);
    [[2, 1], [8, 1]].forEach(([x, y]) => { R(g, PAL.auge, x, y, 2, 4); R(g, PAL.auge, x - 1 + (x > 5 ? 2 : 0), y + 1, 1, 2); R(g, "#FFFFFF", x + (x > 5 ? 0 : 1), y, 1, 1); R(g, "#5A4AA8", x, y + 3, 2, 1); });
    R(g, "#FF9AB0", 0, 5, 2, 1); R(g, "#FF9AB0", 10, 5, 2, 1);
    R(g, "#C8486A", 5, 7, 2, 1); R(g, "#C8486A", 4, 6, 1, 1); R(g, "#C8486A", 7, 6, 1, 1);
  }));
  const gf = new SphereGeometry(0.362, 12, 8, Math.PI * 0.32, Math.PI * 0.36, Math.PI * 0.33, Math.PI * 0.3);
  const gm = new Mesh(gf, new MeshToonMaterial({ map: gesicht, gradientMap: stufen, transparent: false, alphaTest: 0.5 }));
  kopf.add(gm);
  g.teile = { k, beine, arme, kopf };
  return g;
}
function fuchsModell() {
  const g = new Group(), k = new Group(); g.add(k);
  const leib = an(k, kugel(0.26, PAL.orange, 10, 8), 0, 0.32, 0); leib.scale.set(0.9, 0.85, 1.25);
  an(k, kugel(0.16, PAL.creme, 8, 6), 0, 0.27, 0.15).scale.set(1, 0.8, 1.2);
  const kopf = an(k, new Group(), 0, 0.62, 0.22);
  an(kopf, kugel(0.25, PAL.orange, 10, 8), 0, 0, 0);
  an(kopf, kugel(0.13, PAL.creme, 8, 6), 0, -0.06, 0.18).scale.set(1, 0.75, 1.1);
  an(kopf, kugel(0.04, PAL.auge, 6, 4), 0, -0.04, 0.32);
  [-1, 1].forEach(s => { an(kopf, box(0.06, 0.08, 0.03, PAL.auge), 0.1 * s, 0.05, 0.22); const o = an(kopf, new Mesh(new ConeGeometry(0.1, 0.24, 4), toon(PAL.orange)), 0.14 * s, 0.25, -0.02); o.rotation.z = -0.25 * s; });
  const beine = [[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([sx, sz]) => an(k, box(0.08, 0.2, 0.08, "#5A3A24"), 0.12 * sx, 0.1, 0.16 * sz));
  const schwanz = an(k, new Group(), 0, 0.42, -0.28);
  an(schwanz, kugel(0.17, PAL.orange, 8, 6), 0, 0.08, -0.15).scale.set(1, 1, 1.6);
  an(schwanz, kugel(0.11, PAL.creme, 8, 6), 0, 0.14, -0.4);
  g.teile = { k, beine, schwanz };
  return g;
}
const schattenMat = new MeshBasicMaterial({ color: "#000000", transparent: true, opacity: 0.28, depthWrite: false });
function mitSchatten(g, r) { const s = new Mesh(new CircleGeometry(r, 10), schattenMat); s.rotation.x = -Math.PI / 2; s.position.y = 0.02; g.add(s); scene.add(g); return g; }
const ich = mitSchatten(kindModell(), 0.34), fuchs = mitSchatten(fuchsModell(), 0.3);
const pos = new Vector3(-6.5, 1, -1.5), fpos = new Vector3(-8, 1, -1.0);
const feld = (p) => [Math.floor(p.x + MX), Math.floor(p.z + MZ)];

// ---------- Steuerung: Antippen → hinlaufen ----------
let ziel = null, blickW = 0;
const ray = new Raycaster(), zeiger = new Vector2();
renderer.domElement.addEventListener("pointerup", (e) => {
  const r = renderer.domElement.getBoundingClientRect();
  zeiger.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(zeiger, camera);
  const t = ray.intersectObject(boden, false)[0];
  if (t) { ziel = new Vector3(Math.floor(t.point.x) + 0.5, 0, Math.floor(t.point.z) + 0.5); textfeld.hidden = true; }
});
const frei = (x, z) => { const [fx, fy] = feld({ x, z }); return !istFest(fx, fy); };
const textfeld = document.createElement("div"); textfeld.className = "pixelbox";
textfeld.innerHTML = "<b>Fipsi</b><br>Hallo! Tippe irgendwohin, dann laufen wir los!";
document.body.appendChild(textfeld);

// ---------- Schleife ----------
const messEl = document.getElementById("mess");
const uhr = new Clock(); let wTakt = 0, messZeit = 0, bilder = 0, lauf = 0;
const blick = new Vector3(), tmp = new Vector3();
const dreh = (o, soll, dt) => { let d = soll - o.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d)); o.rotation.y += d * Math.min(1, dt * 12); };
function bild() {
  const dt = Math.min(uhr.getDelta(), 0.05), t = uhr.elapsedTime;
  let geht = false;
  if (ziel) {
    const dx = ziel.x - pos.x, dz = ziel.z - pos.z, v = 3.4 * dt;
    if (Math.abs(dx) < 0.05 && Math.abs(dz) < 0.05) ziel = null;
    else {
      const zuerstX = Math.abs(dx) > Math.abs(dz);
      const versuche = zuerstX ? [[Math.sign(dx), 0], [0, Math.sign(dz)]] : [[0, Math.sign(dz)], [Math.sign(dx), 0]];
      let bewegt = false;
      for (const [sx, sz] of versuche) {
        if (!sx && !sz) continue;
        const nx = pos.x + sx * Math.min(v, Math.abs(dx)), nz = pos.z + sz * Math.min(v, Math.abs(dz));
        if (frei(nx + sx * 0.3, nz + sz * 0.3)) { pos.x = nx; pos.z = nz; bewegt = true; blickW = Math.atan2(sx, sz); break; }
      }
      if (!bewegt) ziel = null; else geht = true;
    }
  }
  const [fx, fy] = feld(pos);
  pos.y += (hoehe(fx, fy) - pos.y) * Math.min(1, dt * 14);
  ich.position.copy(pos); dreh(ich, blickW, dt);
  lauf += dt * (geht ? 12 : 0);
  const u = ich.teile, sw = geht ? Math.sin(lauf) : 0;
  u.beine[0].rotation.x = sw * 0.7; u.beine[1].rotation.x = -sw * 0.7; u.arme[0].rotation.x = -sw * 0.8; u.arme[1].rotation.x = sw * 0.8;
  u.k.position.y = geht ? Math.abs(Math.sin(lauf)) * 0.07 : Math.sin(t * 2.2) * 0.012;
  u.kopf.rotation.z = geht ? 0 : Math.sin(t * 1.4) * 0.05;
  // Fuchs folgt mit Abstand
  tmp.subVectors(pos, fpos); tmp.y = 0; const fd = tmp.length(), laeuft = fd > 1.3;
  if (laeuft) { tmp.normalize(); fpos.addScaledVector(tmp, Math.min(fd - 1.3, (fd > 3.5 ? 5.5 : 3.3) * dt)); dreh(fuchs, Math.atan2(tmp.x, tmp.z), dt); }
  const [gx, gy] = feld(fpos); fpos.y += (hoehe(gx, gy) - fpos.y) * Math.min(1, dt * 14);
  fuchs.position.copy(fpos);
  const ft = fuchs.teile; ft.k.position.y = laeuft ? Math.abs(Math.sin(t * 13)) * 0.12 : 0;
  ft.beine.forEach((b, i) => { b.rotation.x = laeuft ? Math.sin(t * 13 + (i % 2) * Math.PI) * 0.6 : 0; });
  ft.schwanz.rotation.y = Math.sin(t * (laeuft ? 10 : 3)) * 0.45;
  // Wasser in zwei Bildern
  wTakt += dt; if (wTakt > 0.55) { wTakt = 0; const b = wasserMat.map === wasserTex[0] ? 1 : 0; wasserMat.map = wasserTex[b]; flachMat.map = flachTex[b]; schaumMat.map = schaumTex[b]; }
  // Kamera folgt
  blick.lerp(tmp.set(pos.x, 1, pos.z), Math.min(1, dt * 4));
  camera.position.copy(blick).add(versatz); camera.lookAt(blick);
  renderer.setRenderTarget(bildZiel); renderer.render(scene, camera);
  const w = messEl && t - messZeit > 1 ? messe(renderer, scene) : null;
  renderer.setRenderTarget(null); renderer.render(nachScene, nachKamera);
  bilder++;
  if (w) {
    messEl.textContent = `Pixel 2,5D · ${Math.round(bilder / (t - messZeit))} Bilder/s · ${w.zeichnungen} Zeichenaufrufe · ${Math.round(w.dreiecke / 100) / 10} Tsd. Dreiecke · ${intern.x}×${intern.y} Pixel ×${faktor}`;
    messZeit = t; bilder = 0;
  }
  requestAnimationFrame(bild);
}
blick.set(pos.x, 1, pos.z);
requestAnimationFrame(bild);
let letzte = null;
window.__probe = {
  name: "Pixel 2,5D", ich,
  info: () => { renderer.setRenderTarget(bildZiel); renderer.render(scene, camera); letzte = messe(renderer, scene); renderer.setRenderTarget(null); renderer.render(nachScene, nachKamera); return Object.assign(letzte, { intern: [intern.x, intern.y], faktor }); },
  laufeZu: (x, z) => { ziel = new Vector3(x, 0, z); }, nah: (f) => { versatz.multiplyScalar(f); }, teleport: (x, z) => { pos.set(x, pos.y, z); blick.set(x, 1, z); }
};
