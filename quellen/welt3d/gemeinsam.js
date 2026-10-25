// Gemeinsame Grundlage für die 3D-Spiele: Renderer, Licht, Größe, Schleife, Overlays.
import { WebGLRenderer, Scene, PerspectiveCamera, Color, Fog, HemisphereLight, DirectionalLight, Clock, SRGBColorSpace } from "../three/three.module.js";

export const S = window.Spielwelt;

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

// Ohne Führerschein geht es zurück zur Übersicht
export function pruefeZugang() {
  const m = S.lade("medien");
  if (!S.offen(m && m.fuehrerschein)) { location.replace("./"); return false; }
  return true;
}
