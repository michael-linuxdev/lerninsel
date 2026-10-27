// Gemeinsame Grundlage für die 3D-Spiele: Renderer, Licht, Größe, Schleife, Overlays.
import { WebGLRenderer, Scene, PerspectiveCamera, Color, Fog, HemisphereLight, DirectionalLight, Clock, SRGBColorSpace } from "../three/three.module.js";

export const S = window.Spielwelt;

// Zählwerte des letzten Bildes für den Leistungs-Test (tests/leistung.js); Budget steht in docs/GRAFIK.md Abschnitt 6.
// Texturspeicher ist eine Schätzung (Breite × Höhe × 4 Byte je Textur, ohne Mipmaps).
export function messe(renderer, scene) {
  const i = renderer.info, gesehen = new Set();
  let bytes = 0;
  scene && scene.traverse(o => {
    const ms = !o.material ? [] : Array.isArray(o.material) ? o.material : [o.material];
    ms.forEach(m => Object.values(m).forEach(v => {
      if (v && v.isTexture && !gesehen.has(v)) {
        gesehen.add(v);
        const b = v.image || {}; bytes += (b.width || 0) * (b.height || 0) * 4;
      }
    }));
  });
  if (scene && scene.background && scene.background.isTexture && !gesehen.has(scene.background)) { const b = scene.background.image || {}; bytes += (b.width || 0) * (b.height || 0) * 4; }
  return {
    zeichnungen: i.render.calls, dreiecke: i.render.triangles, geometrien: i.memory.geometries, texturen: i.memory.textures,
    texturMB: Math.round(bytes / 1048576 * 10) / 10, schatten: !!renderer.shadowMap.enabled, pixel: renderer.getPixelRatio()
  };
}

export function welt({ himmel = "#BFE6FF", nebelVon = 30, nebelBis = 80, fov = 55, schatten = false } = {}) {
  const renderer = new WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = SRGBColorSpace;
  if (schatten) { renderer.shadowMap.enabled = true; }
  document.getElementById("buehne").appendChild(renderer.domElement);

  const scene = new Scene();
  scene.background = new Color(himmel);
  scene.fog = new Fog(himmel, nebelVon, nebelBis);
  const camera = new PerspectiveCamera(fov, 1, 0.1, 200);

  scene.add(new HemisphereLight("#ffffff", "#7AC95A", 1.6));
  const sonne = new DirectionalLight("#fff6dd", 1.8);
  sonne.position.set(8, 16, 10);
  if (schatten) {
    sonne.castShadow = true;
    sonne.shadow.mapSize.set(1024, 1024);
    const c = sonne.shadow.camera; c.left = -18; c.right = 18; c.top = 18; c.bottom = -18; c.near = 1; c.far = 50;
  }
  scene.add(sonne);

  function groesse() {
    const el = document.getElementById("buehne");
    const w = el.clientWidth, h = el.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }
  addEventListener("resize", groesse);
  groesse();

  const uhr = new Clock();
  let schleife = null, laeuft = false;
  function bild() {
    if (!laeuft) return;
    const dt = Math.min(0.05, uhr.getDelta());
    schleife && schleife(dt, uhr.elapsedTime);
    renderer.render(scene, camera);
    requestAnimationFrame(bild);
  }
  const w = {
    renderer, scene, camera, sonne,
    start(fn) { schleife = fn; if (!laeuft) { laeuft = true; uhr.getDelta(); requestAnimationFrame(bild); } },
    pause() { laeuft = false; },
    weiter() { if (!laeuft) { laeuft = true; uhr.getDelta(); requestAnimationFrame(bild); } },
    zeichne() { renderer.render(scene, camera); }
  };
  document.addEventListener("visibilitychange", () => { if (document.hidden) w.pause(); else w.weiter(); });
  window.__welt3d = { info: () => messe(renderer, scene) };
  return w;
}

// Overlay-Karte mit Titel, Text und Knöpfen
export function karte({ titel, text, sterne, knoepfe }) {
  const o = document.getElementById("overlay");
  o.innerHTML = `<div class="karte3d"><h2>${titel}</h2>` +
    (sterne != null ? `<div class="gross-sterne">${[1, 2, 3].map(n => `<span class="${n <= sterne ? "" : "leer"}" style="animation-delay:${n * 160}ms">⭐</span>`).join("")}</div>` : "") +
    `<p>${text}</p><div class="karte-knoepfe"></div></div>`;
  const k = o.querySelector(".karte-knoepfe");
  knoepfe.forEach(({ text, haupt, fn }) => {
    const b = document.createElement("button");
    b.className = "knopf" + (haupt ? " haupt" : ""); b.textContent = text;
    b.addEventListener("click", () => { S.ton("tipp"); o.hidden = true; fn(); });
    k.appendChild(b);
  });
  o.hidden = false;
}

// Daten dieser Welt
export function daten() { return Object.assign({ ballon: { rekord: 0, ziele: [] }, insel: { geschafft: 0 } }, S.lade("welt3d") || {}); }
export function speichere(d) { S.speichere("welt3d", d); }

// Minispiele brauchen den kompletten Tablet-Führerschein; ohne geht es zurück auf die Insel (oder zu Robo Pixel)
export function pruefeZugang(spiel) {
  if (!S.minispieleOffen()) { location.replace(S.inselOffen() ? "../insel/" : "../../?robo=1"); return false; }
  if (spiel && !istFrei(spiel)) { location.replace("../insel/"); return false; }
  return true;
}

// Minispiele öffnen sich, wenn der Wissensbaum wächst (Lernen lohnt sich): Stufe des Baums aus shared/lernfunde.js
export const SPIELE = {
  ballons: { name: "Ballon-Party", e: "🎈", stufe: 0 },
  insel: { name: "Schatz-Strand", e: "🏝️", stufe: 0 },
  lauf: { name: "Sternenlauf", e: "🏃", stufe: 1 },
  kart: { name: "Kart-Rennen", e: "🏎️", stufe: 2 },
  bau: { name: "Bauplatz", e: "🧱", stufe: 3 }
};
export const baumStufe = () => (window.Lernfunde ? window.Lernfunde.baum().stufe : 0);
export const istFrei = (id) => S.offen(baumStufe() >= ((SPIELE[id] || {}).stufe || 0));

// Sterne nur für neu erreichte Ziele (wie auf dem Matheweg) – Wiederholen bringt Spaß, aber keine Sterne-Flut
export function sterneFuer(spiel, punkte, grenzen) {
  const d = daten(), e = d[spiel] = Object.assign({ rekord: 0, beste: 0 }, d[spiel] || {});
  const stufe = grenzen.filter(g => punkte >= g).length, neu = Math.max(0, stufe - e.beste);
  const rekord = punkte > e.rekord;
  e.beste = Math.max(e.beste, stufe); e.rekord = Math.max(e.rekord, punkte); speichere(d);
  if (neu) S.gibSterne(neu);
  return { stufe, neu, rekord, bisher: e.rekord };
}
