// Bauplatz (Bauen & Gestalten): mit bunten Steinen frei bauen, Benno stellt kleine Zähl-Aufgaben.
// Tippen setzt einen Stein (auf den Boden oder an einen Stein), im Abriss-Modus entfernt Tippen einen Stein.
// Ziehen dreht die Ansicht, ⟲ ⟳ ebenso; 🔍 zoomt. Das Bauwerk wird gespeichert (S "bauplatz").
import { Group, Mesh, PlaneGeometry, BoxGeometry, EdgesGeometry, LineSegments, LineBasicMaterial, MeshLambertMaterial, MeshBasicMaterial, Raycaster, Vector2, Vector3, GridHelper } from "../three/three.module.js";
import { S, welt, karte, pruefeZugang, sterneFuer } from "./gemeinsam.js";

const C = window.Charakter, $ = (id) => document.getElementById(id);
if (pruefeZugang("bau")) {
  const W = welt({ himmel: "#BFE6FF", nebelVon: 40, nebelBis: 90, fov: 50, schatten: true });
  const { scene, camera, sonne } = W;
  const G = 14, HMAX = 12, MAX = 700;
  const FARBEN = [["#E0574A", "Rot"], ["#FF9E5E", "Orange"], ["#FFC83D", "Gelb"], ["#5CCBA6", "Grün"], ["#3AA0E0", "Blau"], ["#B28DFF", "Lila"], ["#FF9BC8", "Rosa"], ["#FFFFFF", "Weiß"], ["#A0693F", "Holz"], ["#A7A9B8", "Stein"], ["#9BD7F5", "Glas"]];

  // ---------- Bauplatz ----------
  const boden = new Mesh(new PlaneGeometry(G, G), new MeshLambertMaterial({ color: "#8FD66B" })); boden.rotation.x = -Math.PI / 2; boden.receiveShadow = true; scene.add(boden);
  const raster = new GridHelper(G, G, "#6FB85A", "#6FB85A"); raster.position.y = 0.01; scene.add(raster);
  const rand = new Mesh(new PlaneGeometry(80, 80), new MeshLambertMaterial({ color: "#7CC45E" })); rand.rotation.x = -Math.PI / 2; rand.position.y = -0.02; scene.add(rand);
  sonne.position.set(10, 20, 12);

  const wuerfel = new BoxGeometry(1, 1, 1), kante = new EdgesGeometry(wuerfel), kantenMat = new LineBasicMaterial({ color: "#4A3558" });
  const mats = {}; const matVon = (f) => mats[f] || (mats[f] = new MeshLambertMaterial({ color: f, transparent: f === "#9BD7F5", opacity: f === "#9BD7F5" ? 0.6 : 1 }));
  const steine = new Map();   // "x,y,z" → Mesh
  const key = (x, y, z) => `${x},${y},${z}`;
  function setzeStein(x, y, z, f, still) {
    if (steine.has(key(x, y, z)) || steine.size >= MAX || y >= HMAX || x < -G / 2 || x >= G / 2 || z < -G / 2 || z >= G / 2 || y < 0) return false;
    const m = new Mesh(wuerfel, matVon(f)); m.castShadow = true; m.receiveShadow = true; m.add(new LineSegments(kante, kantenMat));
    m.position.set(x + 0.5, y + 0.5, z + 0.5); m.userData = { x, y, z, f }; scene.add(m); steine.set(key(x, y, z), m);   // Feld (x, z) liegt zwischen den Rasterlinien
    if (!still) { m.scale.setScalar(0.2); m.userData.plopp = 0; }
    return true;
  }
  function entferne(m) { scene.remove(m); steine.delete(key(m.userData.x, m.userData.y, m.userData.z)); }

  // Speichern / Laden (kompakt: [x, y, z, Farbindex])
  function speichere() { S.speichere("bauplatz", Object.assign(S.lade("bauplatz") || {}, { b: [...steine.values()].map(m => [m.userData.x, m.userData.y, m.userData.z, FARBEN.findIndex(f => f[0] === m.userData.f)]) })); }
  (S.lade("bauplatz") || { b: [] }).b.forEach(([x, y, z, i]) => setzeStein(x, y, z, (FARBEN[i] || FARBEN[0])[0], true));

  // ---------- Werkzeuge ----------
  let farbe = FARBEN[2][0], abriss = false; const verlauf = [];
  $("farben").innerHTML = FARBEN.map(([f, n]) => `<button class="farbe" data-f="${f}" style="background:${f}" aria-label="${n}"></button>`).join("");
  function zeigeWerkzeug() {
    document.querySelectorAll("#farben .farbe").forEach(b => b.classList.toggle("an", !abriss && b.dataset.f === farbe));
    $("abriss").classList.toggle("an", abriss);
  }
  $("farben").addEventListener("click", e => { const b = e.target.closest(".farbe"); if (!b) return; farbe = b.dataset.f; abriss = false; S.ton("tipp"); zeigeWerkzeug(); });
  $("abriss").addEventListener("click", () => { abriss = !abriss; S.ton("tipp"); zeigeWerkzeug(); });
  $("rueck").addEventListener("click", () => {
    const v = verlauf.pop(); if (!v) return; S.ton("tipp");
    if (v.art === "neu") { const m = steine.get(key(...v.p)); if (m) entferne(m); } else setzeStein(...v.p, v.f);
    speichere(); pruefeAufgabe();
  });
  $("leeren").addEventListener("click", () => { if (!steine.size || !confirm("Alles abreißen und neu anfangen?")) return; [...steine.values()].forEach(entferne); verlauf.length = 0; speichere(); S.ton("nein"); });
  zeigeWerkzeug();

  // ---------- Kamera: drehen und zoomen ----------
  let gier = 0.7, neig = 0.75, abst = 22;
  const kamera = () => { camera.position.set(Math.sin(gier) * Math.cos(neig) * abst, 1 + Math.sin(neig) * abst, Math.cos(gier) * Math.cos(neig) * abst); camera.lookAt(0, 1.5, 0); };
  kamera();
  $("links").addEventListener("click", () => { gier -= Math.PI / 4; kamera(); });
  $("rechts").addEventListener("click", () => { gier += Math.PI / 4; kamera(); });
  $("zoom").addEventListener("click", () => { abst = abst > 18 ? 13 : abst > 12 ? 30 : 22; kamera(); });

  // ---------- Tippen: setzen oder abreißen ----------
  const ray = new Raycaster(), zeiger = new Vector2(); let unten = null;
  const el = $("buehne");
  el.addEventListener("pointerdown", e => { unten = { x: e.clientX, y: e.clientY, g: gier, n: neig, bewegt: false }; });
  el.addEventListener("pointermove", e => {
    if (!unten) return; const dx = e.clientX - unten.x, dy = e.clientY - unten.y;
    if (Math.hypot(dx, dy) > 10) unten.bewegt = true;
    if (unten.bewegt) { gier = unten.g - dx * 0.008; neig = Math.max(0.2, Math.min(1.45, unten.n + dy * 0.005)); kamera(); }
  });
  el.addEventListener("pointerup", e => {
    if (!unten) return; const war = unten; unten = null; if (war.bewegt) return;
    const r = el.getBoundingClientRect(); zeiger.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(zeiger, camera);
    const t = ray.intersectObjects([...steine.values(), boden], false)[0]; if (!t) return;
    if (t.object === boden) {
      if (abriss) return;
      bau(Math.floor(t.point.x), 0, Math.floor(t.point.z));
    } else {
      const s = t.object.userData;
      if (abriss) { verlauf.push({ art: "weg", p: [s.x, s.y, s.z], f: s.f }); entferne(t.object); S.ton("nein"); speichere(); pruefeAufgabe(); return; }
      const n = t.face.normal; bau(s.x + Math.round(n.x), s.y + Math.round(n.y), s.z + Math.round(n.z));
    }
  });
  function bau(x, y, z) {
    if (setzeStein(x, y, z, farbe)) { verlauf.push({ art: "neu", p: [x, y, z] }); if (verlauf.length > 60) verlauf.shift(); S.ton("wahl"); speichere(); pruefeAufgabe(); }
    else S.ton("nein");
  }

  // ---------- Bennos Bau-Aufgaben (Zählen und Messen) ----------
  const AUFGABEN = [
    { text: (n) => `Bau einen Turm, der genau ${n} Steine hoch ist!`, n: () => 4 + Math.floor(Math.random() * 5), ok: (n) => hoechsterTurm() === n },
    { text: (n) => `Leg auf dem Boden eine gerade Reihe aus ${n} Steinen!`, n: () => 5 + Math.floor(Math.random() * 5), ok: (n) => laengsteReihe() >= n },
    { text: (n) => `Benutze genau ${n} verschiedene Farben!`, n: () => 3 + Math.floor(Math.random() * 3), ok: (n) => new Set([...steine.values()].map(m => m.userData.f)).size === n },
    { text: (n) => `Bau etwas aus genau ${n} Steinen! Zähl gut mit.`, n: () => 10 + Math.floor(Math.random() * 11), ok: (n) => steine.size === n }
  ];
  function hoechsterTurm() { const h = {}; steine.forEach(m => { const k = m.userData.x + "," + m.userData.z; h[k] = Math.max(h[k] || 0, m.userData.y + 1); }); return Math.max(0, ...Object.values(h)); }
  function laengsteReihe() {
    let best = 0; const am = (x, z) => steine.has(key(x, 0, z));
    steine.forEach(m => { const { x, y, z } = m.userData; if (y) return; let a = 0; while (am(x + a, z)) a++; let b = 0; while (am(x, z + b)) b++; best = Math.max(best, a, b); });
    return best;
  }
  let aufgabe = null;
  function neueAufgabe() { const a = AUFGABEN[Math.floor(Math.random() * AUFGABEN.length)], n = a.n(); aufgabe = { a, n }; $("benno-text").textContent = a.text(n); $("aufgabe").classList.remove("geschafft"); }
  // erst prüfen, wenn das Kind kurz innehält (sonst zählt „genau 13 Steine“ schon beim Vorbeibauen)
  let pruefTimer = null;
  function pruefeAufgabe() { clearTimeout(pruefTimer); pruefTimer = setTimeout(pruefeJetzt, 1600); }
  function pruefeJetzt() {
    if (!aufgabe || !aufgabe.a.ok(aufgabe.n)) return;
    const d = S.lade("bauplatz") || {}; d.geschafft = (d.geschafft || 0) + 1; S.speichere("bauplatz", d);
    const r = sterneFuer("bau", d.geschafft, [1, 3, 6]);
    if (C) C.gib("mathe", 2);
    $("benno-text").textContent = `Super! Das hast du toll gebaut!${r.neu ? ` +${r.neu} ⭐` : ""}`; $("aufgabe").classList.add("geschafft"); S.ton("juhu");
    aufgabe = null; setTimeout(neueAufgabe, 3500);
  }
  $("neue-aufgabe").addEventListener("click", () => { S.ton("tipp"); neueAufgabe(); });
  if (window.Figuren) $("benno").innerHTML = window.Figuren.biber("");

  W.start((dt) => {
    steine.forEach(m => { if (m.userData.plopp !== undefined) { m.userData.plopp += dt * 6; const p = Math.min(1, m.userData.plopp); m.scale.setScalar(p < 1 ? p * (1 + Math.sin(p * Math.PI) * 0.3) : 1); if (p >= 1) delete m.userData.plopp; } });
  });
  karte({ titel: "🧱 Bauplatz", text: "Bau mit bunten Steinen, was du willst: ein Haus, einen Turm, ein Tier … Tippe zum Bauen, ziehe zum Drehen. Benno hat auch Bau-Aufgaben für dich!", knoepfe: [{ text: "Los geht's!", haupt: true, fn: neueAufgabe }] });
  window.__bau = { bau, pruefeJetzt, get anzahl() { return steine.size; }, hoechsterTurm, laengsteReihe, get aufgabe() { return aufgabe; } };
}
