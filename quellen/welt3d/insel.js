// Insel-Abenteuer: Mit Joystick über die Insel laufen, 10 Sterne sammeln, Schatztruhe öffnen.
import {
  Group, Mesh, SphereGeometry, ConeGeometry, CylinderGeometry, PlaneGeometry, BoxGeometry, CircleGeometry, RingGeometry,
  DodecahedronGeometry, ExtrudeGeometry, Shape, MeshLambertMaterial, MeshBasicMaterial, Vector3, MathUtils
} from "../three/three.module.js";
import { S, welt, karte, daten, speichere, pruefeZugang } from "./gemeinsam.js";

const C = window.Charakter;
const hat = (v) => !!(C && C.hat(v));
if (pruefeZugang()) {
  const W = welt({ himmel: "#A8DFFF", nebelVon: 35, nebelBis: 90, fov: 50, schatten: true });
  const { scene, camera } = W;
  const lam = (color, extra = {}) => new MeshLambertMaterial(Object.assign({ color, flatShading: true }, extra));
  const schatten = (m, werfen = true, empfangen = false) => { m.castShadow = werfen; m.receiveShadow = empfangen; return m; };

  // ---------- Insel ----------
  const RAND_GRAS = 11, RAND_STRAND = 14, HUEGEL = { x: -5, z: -4, r: 3.2, h: 0.4 };
  const wasser = new Mesh(new PlaneGeometry(240, 240), new MeshLambertMaterial({ color: "#4FB5E6" }));
  wasser.rotation.x = -Math.PI / 2; wasser.position.y = -0.7; scene.add(wasser);
  const schaum = new Mesh(new RingGeometry(14.6, 15.6, 64), new MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.6 }));
  schaum.rotation.x = -Math.PI / 2; schaum.position.y = -0.62; scene.add(schaum);
  const strand = schatten(new Mesh(new CylinderGeometry(RAND_STRAND, RAND_STRAND + 1.2, 1.2, 56), lam("#F6DA9B")), false, true);
  strand.position.y = -0.9; scene.add(strand);
  const gras = schatten(new Mesh(new CylinderGeometry(RAND_GRAS, RAND_GRAS + 0.4, 1, 56), lam("#7AC95A")), false, true);
  gras.position.y = -0.5; scene.add(gras);
  const huegel = schatten(new Mesh(new SphereGeometry(HUEGEL.r, 24, 14), lam("#8FD66B")), false, true);
  huegel.scale.y = HUEGEL.h; huegel.position.set(HUEGEL.x, 0, HUEGEL.z); scene.add(huegel);

  function boden(x, z) {
    const r = Math.hypot(x, z);
    let y = r < RAND_GRAS ? 0 : -0.3;
    const d = Math.hypot(x - HUEGEL.x, z - HUEGEL.z);
    if (d < HUEGEL.r) y = Math.max(y, HUEGEL.h * Math.sqrt(HUEGEL.r * HUEGEL.r - d * d));
    return y;
  }

  const hindernisse = [];
  // Palmen
  const palmen = [];
  [[8, 3], [-9, 5], [3, 9.5], [-3, -9.5], [9.5, -5], [-10, -2], [6, 7.5]].forEach(([x, z], i) => {
    const p = new Group();
    const stammMat = lam("#A0693F", { transparent: true }), blattMat = lam("#3FB36B", { transparent: true }), nussMat = lam("#6B4A1E", { transparent: true });
    palmen.push({ p, x, z, mats: [stammMat, blattMat, nussMat] });
    let y = 0;
    for (let k = 0; k < 5; k++) { const s = schatten(new Mesh(new CylinderGeometry(0.2 - k * 0.015, 0.25 - k * 0.015, 0.75, 7), stammMat)); s.position.set(k * 0.07, y + 0.37, 0); s.rotation.z = -0.06 * k; p.add(s); y += 0.72; }
    for (let k = 0; k < 6; k++) {
      const b = schatten(new Mesh(new SphereGeometry(1, 8, 6), blattMat)); b.scale.set(1.5, 0.1, 0.42);
      const w = k / 6 * Math.PI * 2; b.position.set(0.35 + Math.cos(w) * 1.1, y + 0.05, Math.sin(w) * 1.1); b.rotation.y = -w; b.rotation.z = -0.35; p.add(b);
    }
    for (let k = 0; k < 3; k++) { const n = new Mesh(new SphereGeometry(0.16, 8, 6), nussMat); n.position.set(0.35 + Math.cos(k * 2) * 0.25, y - 0.15, Math.sin(k * 2) * 0.25); p.add(n); }
    p.position.set(x, boden(x, z), z); p.rotation.y = i * 1.7; scene.add(p);
    hindernisse.push({ x, z, r: 0.55 });
  });
  // Felsen
  const steinMat = lam("#A7A9B5");
  [[4, -2, 0.9], [-6, 6.5, 1.1], [1.5, -7, 0.8], [11.8, 2, 0.9], [-2, 4, 0.7]].forEach(([x, z, r]) => {
    const s = schatten(new Mesh(new DodecahedronGeometry(r, 0), steinMat), true, true); s.position.set(x, boden(x, z) + r * 0.45, z); s.rotation.set(x, z, 0); scene.add(s);
    hindernisse.push({ x, z, r: r + 0.35 });
  });
  // Hütte
  const huette = new Group();
  const wand = schatten(new Mesh(new BoxGeometry(2.6, 1.8, 2.2), lam("#E7C08A")), true, true); wand.position.y = 0.9; huette.add(wand);
  const dach = schatten(new Mesh(new ConeGeometry(2.3, 1.4, 4), lam("#C2572B"))); dach.position.y = 2.5; dach.rotation.y = Math.PI / 4; huette.add(dach);
  const tuer = new Mesh(new BoxGeometry(0.7, 1.1, 0.05), lam("#8A5A34")); tuer.position.set(0, 0.55, 1.12); huette.add(tuer);
  huette.position.set(5.5, 0, -5.5); huette.rotation.y = -0.6; scene.add(huette);
  hindernisse.push({ x: 5.5, z: -5.5, r: 1.9 });
  // Blumen
  const blumenFarben = ["#FF6F61", "#FFC83D", "#FF9BC8", "#9B6BE0", "#ffffff"];
  for (let i = 0; i < 40; i++) {
    const w = Math.random() * Math.PI * 2, r = 2 + Math.random() * 8.5, x = Math.cos(w) * r, z = Math.sin(w) * r;
    const f = new Mesh(new SphereGeometry(0.12, 6, 4), lam(blumenFarben[i % blumenFarben.length])); f.position.set(x, boden(x, z) + 0.1, z); scene.add(f);
  }
  // Wolken
  const wolkenMat = new MeshLambertMaterial({ color: "#ffffff" }), wolken = [];
  for (let i = 0; i < 6; i++) {
    const g = new Group();
    [[0, 0, 1.6], [1.5, 0.3, 1.2], [-1.5, 0.2, 1.1], [0.4, 0.9, 1.1]].forEach(([x, y, r]) => { const m = new Mesh(new SphereGeometry(r, 10, 8), wolkenMat); m.position.set(x, y, 0); g.add(m); });
    g.position.set(-30 + i * 12, 14 + (i % 3) * 2, -25 + (i % 2) * 10); scene.add(g); wolken.push(g);
  }

  // ---------- Figur ----------
  const figur = new Group();
  const kleid = schatten(new Mesh(new CylinderGeometry(0.28, 0.55, 0.95, 14), lam("#FF7FB4"))); kleid.position.y = 0.55; figur.add(kleid);
  const beinMat = lam("#F6C9A3");
  [-0.16, 0.16].forEach(x => { const b = new Mesh(new CylinderGeometry(0.08, 0.08, 0.3, 6), beinMat); b.position.set(x, 0.12, 0); figur.add(b); });
  const kopf = schatten(new Mesh(new SphereGeometry(0.38, 18, 14), lam("#F6C9A3", { flatShading: false }))); kopf.position.y = 1.35; figur.add(kopf);
  const haar = schatten(new Mesh(new SphereGeometry(0.41, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.55), lam("#A8693A", { flatShading: false }))); haar.position.y = 1.38; haar.rotation.x = -0.35; figur.add(haar);
  const zopf = schatten(new Mesh(new SphereGeometry(0.22, 10, 8), lam("#A8693A"))); zopf.position.set(0, 1.25, -0.38); zopf.scale.set(1, 1.5, 1); figur.add(zopf);
  const augeMat = new MeshBasicMaterial({ color: "#2a1a3a" });
  [-0.13, 0.13].forEach(x => { const a = new Mesh(new SphereGeometry(0.055, 8, 6), augeMat); a.position.set(x, 1.38, 0.34); figur.add(a); });
  const wangeMat = new MeshBasicMaterial({ color: "#FF9DB8" });
  [-0.22, 0.22].forEach(x => { const a = new Mesh(new SphereGeometry(0.05, 8, 6), wangeMat); a.position.set(x, 1.28, 0.3); a.scale.z = 0.4; figur.add(a); });
  [-0.32, 0.32].forEach((x, i) => { const arm = new Mesh(new CylinderGeometry(0.07, 0.07, 0.5, 6), beinMat); arm.position.set(x, 0.75, 0); arm.rotation.z = i ? -0.35 : 0.35; figur.add(arm); });
  const blob = new Mesh(new CircleGeometry(0.5, 20), new MeshBasicMaterial({ color: "#000000", transparent: true, opacity: 0.22, depthWrite: false }));
  blob.rotation.x = -Math.PI / 2; scene.add(blob);
  scene.add(figur);

  // Pfeil zum nächsten Stern
  const pfeil = new Mesh(new ConeGeometry(0.22, 0.6, 3), new MeshBasicMaterial({ color: "#FFC83D" }));
  pfeil.rotation.x = Math.PI / 2; const pfeilHalter = new Group(); pfeilHalter.add(pfeil); pfeil.position.z = 1.0; scene.add(pfeilHalter);

  // ---------- Sterne ----------
  const form = new Shape();
  for (let i = 0; i < 10; i++) { const w = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 0.2 : 0.5; i ? form.lineTo(Math.cos(w) * r, -Math.sin(w) * r) : form.moveTo(Math.cos(w) * r, -Math.sin(w) * r); }
  const sternGeo = new ExtrudeGeometry(form, { depth: 0.16, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 2 }); sternGeo.center();
  const goldMat = new MeshLambertMaterial({ color: "#FFD24D", emissive: "#8a6000", emissiveIntensity: 0.4 });
  const ORTE = [[2, 5, 0], [-7, 1, 0], [7, -1, 0], [-1, -4, 0], [9, 7.5, 0], [-8, -7, 0], [0, 12.5, 0], [-12.6, 3, 0], [HUEGEL.x, HUEGEL.z, 0], [-3, 7.5, 1.9]];
  // [x, z, Extra-Höhe] – der letzte schwebt und braucht einen Sprung
  let sterne = [];
  function legeSterne() {
    sterne.forEach(s => scene.remove(s)); sterne = [];
    ORTE.forEach(([x, z, h], i) => {
      const s = schatten(new Mesh(sternGeo, goldMat));
      s.userData = { basis: boden(x, z) + 0.9 + h, phase: i };
      s.position.set(x, s.userData.basis, z); scene.add(s); sterne.push(s);
    });
  }

  // ---------- Schatztruhe ----------
  const truhe = new Group();
  const holz = lam("#A0693F"), gold = lam("#FFC83D");
  const kiste = schatten(new Mesh(new BoxGeometry(1.4, 0.8, 0.9), holz)); kiste.position.y = 0.4; truhe.add(kiste);
  const band = new Mesh(new BoxGeometry(1.45, 0.12, 0.95), gold); band.position.y = 0.55; truhe.add(band);
  const deckelGelenk = new Group(); deckelGelenk.position.set(0, 0.8, -0.45); truhe.add(deckelGelenk);
  const deckel = schatten(new Mesh(new CylinderGeometry(0.45, 0.45, 1.4, 12, 1, false, 0, Math.PI), holz)); deckel.rotation.z = Math.PI / 2; deckel.rotation.y = Math.PI / 2; deckel.position.z = 0.45; deckelGelenk.add(deckel);
  const schloss = new Mesh(new BoxGeometry(0.22, 0.26, 0.08), gold); schloss.position.set(0, 0.55, 0.47); truhe.add(schloss);
  const schatzLicht = new Mesh(new SphereGeometry(0.42, 12, 8), new MeshBasicMaterial({ color: "#FFF1A8", transparent: true, opacity: 0 })); schatzLicht.position.y = 0.9; truhe.add(schatzLicht);
  truhe.position.set(1.5, 0, 2.5); truhe.visible = false; scene.add(truhe);

  // ---------- Steuerung ----------
  const eingabe = { x: 0, z: 0, springen: false };
  const stick = document.getElementById("stick"), knauf = document.getElementById("knauf"), sprung = document.getElementById("springen");
  let stickId = null, mitte = { x: 0, y: 0 };
  const RADIUS = 56;
  const feld = W.renderer.domElement;
  feld.addEventListener("pointerdown", e => {
    if (stickId !== null || e.clientX > innerWidth * 0.62) return;
    stickId = e.pointerId; feld.setPointerCapture(e.pointerId);
    mitte = { x: e.clientX, y: e.clientY };
    stick.style.left = (e.clientX - 70) + "px"; stick.style.top = (e.clientY - 70) + "px"; stick.classList.add("an");
    knauf.style.transform = "translate(0,0)";
  });
  feld.addEventListener("pointermove", e => {
    if (e.pointerId !== stickId) return;
    let dx = e.clientX - mitte.x, dy = e.clientY - mitte.y; const l = Math.hypot(dx, dy);
    if (l > RADIUS) { dx *= RADIUS / l; dy *= RADIUS / l; }
    knauf.style.transform = `translate(${dx}px, ${dy}px)`;
    eingabe.x = dx / RADIUS; eingabe.z = dy / RADIUS;
  });
  const loslassen = e => { if (e.pointerId !== stickId) return; stickId = null; eingabe.x = 0; eingabe.z = 0; stick.classList.remove("an"); };
  feld.addEventListener("pointerup", loslassen); feld.addEventListener("pointercancel", loslassen);
  sprung.addEventListener("pointerdown", e => { e.preventDefault(); eingabe.springen = true; });
  const tasten = {};
  addEventListener("keydown", e => { tasten[e.key.toLowerCase()] = true; if (e.key === " ") eingabe.springen = true; });
  addEventListener("keyup", e => { tasten[e.key.toLowerCase()] = false; });

  // ---------- Spielablauf ----------
  const pos = new Vector3(0, 0, 6), blick = new Vector3();
  let vy = 0, hoehe = 0, gesammelt = 0, aktiv = false, truheAuf = false, deckelWinkel = 0, schritt = 0, luftSprung = false;
  // Glitzerspur (Vorteil aus Wort-Zauber)
  const glitzer = [], glitzerGeo = new SphereGeometry(0.08, 6, 4);
  let glitzerTakt = 0;
  const $z = document.getElementById("zaehler");
  function anzeigen() { $z.textContent = `${gesammelt} / ${ORTE.length}`; }

  function starte() {
    pos.set(0, 0, 6); vy = 0; hoehe = 0; gesammelt = 0; truheAuf = false; deckelWinkel = 0;
    truhe.visible = false; deckelGelenk.rotation.x = 0; schatzLicht.material.opacity = 0;
    legeSterne(); anzeigen(); aktiv = true;
    camera.position.set(0, 8, 16); camera.lookAt(0, 0, 6);
  }

  function belohnung() {
    aktiv = false;
    const d = daten(); const erstes = !d.insel.geschafft;
    d.insel.geschafft++; speichere(d);
    const plus = erstes ? 3 : 1; S.gibSterne(plus);
    if (C) { C.gib("entdecker", 5); C.ereignis("insel-schatz"); }
    S.ton("juhu");
    karte({
      titel: "Schatz gefunden!", sterne: 3,
      text: `In der Truhe glitzert es: <b>+${plus} ${plus === 1 ? "Stern" : "Sterne"}</b> für den Kleiderschrank. Du hast jetzt ${S.sterne()}.`,
      knoepfe: [{ text: "Nochmal spielen", haupt: true, fn: starte }, { text: "Zur 3D-Welt", fn: () => location.href = "./" }]
    });
  }

  W.start((dt, t) => {
    wolken.forEach((w, i) => { w.position.x += dt * (0.4 + i * 0.05); if (w.position.x > 40) w.position.x = -40; });
    wasser.position.y = -0.7 + Math.sin(t * 0.8) * 0.05; schaum.scale.setScalar(1 + Math.sin(t * 1.2) * 0.012);

    // Bewegung
    let ex = eingabe.x, ez = eingabe.z;
    if (tasten["a"] || tasten["arrowleft"]) ex -= 1; if (tasten["d"] || tasten["arrowright"]) ex += 1;
    if (tasten["w"] || tasten["arrowup"]) ez -= 1; if (tasten["s"] || tasten["arrowdown"]) ez += 1;
    const l = Math.hypot(ex, ez); if (l > 1) { ex /= l; ez /= l; }
    const laeuft = aktiv && l > 0.12;
    if (laeuft) {
      const tempo = hat("schnell") ? 5.6 : 4.4;
      pos.x += ex * tempo * dt; pos.z += ez * tempo * dt;
      figur.rotation.y = MathUtils.lerp(figur.rotation.y, figur.rotation.y + MathUtils.euclideanModulo(Math.atan2(ex, ez) - figur.rotation.y + Math.PI, Math.PI * 2) - Math.PI, Math.min(1, dt * 12));
      schritt += dt * 12;
    }
    // Hindernisse und Inselrand
    hindernisse.forEach(h => { const dx = pos.x - h.x, dz = pos.z - h.z, d = Math.hypot(dx, dz); if (d < h.r + 0.35 && d > 0.001) { pos.x = h.x + dx / d * (h.r + 0.35); pos.z = h.z + dz / d * (h.r + 0.35); } });
    const r = Math.hypot(pos.x, pos.z); if (r > 13.4) { pos.x *= 13.4 / r; pos.z *= 13.4 / r; }
    // Springen und Schwerkraft
    const grund = boden(pos.x, pos.z);
    const amBoden = hoehe <= grund + 0.01;
    if (amBoden) luftSprung = false;
    if (eingabe.springen && aktiv && (amBoden || (hat("doppelsprung") && !luftSprung))) {
      if (!amBoden) luftSprung = true;
      vy = hat("sprung") ? 7.8 : 6.6; S.ton("tipp");
    }
    eingabe.springen = false;
    vy -= 16 * dt; hoehe += vy * dt;
    if (hoehe < grund) { hoehe = grund; vy = 0; }
    figur.position.set(pos.x, hoehe + (laeuft && hoehe <= grund + 0.01 ? Math.abs(Math.sin(schritt)) * 0.08 : 0), pos.z);
    blob.position.set(pos.x, grund + 0.02, pos.z); blob.scale.setScalar(1 / (1 + (hoehe - grund) * 0.5));

    // Palmen zwischen Kamera und Figur werden durchsichtig
    palmen.forEach(pl => {
      const vorn = pl.z > pos.z + 0.5 && pl.z < camera.position.z + 1 && Math.abs(pl.x - pos.x) < 3.2;
      pl.mats.forEach(m => { m.opacity = MathUtils.lerp(m.opacity, vorn ? 0.25 : 1, Math.min(1, dt * 8)); m.depthWrite = m.opacity > 0.9; });
    });
    // Kamera folgt sanft
    blick.set(pos.x, 0.8 + hoehe * 0.3, pos.z);
    camera.position.lerp(new Vector3(pos.x * 0.85, 7.5, pos.z + 10.5), Math.min(1, dt * 3));
    camera.lookAt(blick);

    // Sterne drehen, sammeln
    let naechster = null, nd = 1e9;
    sterne.forEach(s => {
      if (!s.visible) return;
      s.rotation.y += dt * 2.2; s.position.y = s.userData.basis + Math.sin(t * 2 + s.userData.phase) * 0.15;
      const d = Math.hypot(s.position.x - pos.x, s.position.y - (hoehe + 0.9), s.position.z - pos.z);
      // Sternen-Magnet: nahe Sterne fliegen zur Figur
      if (aktiv && hat("insel-magnet") && d < 3) { s.position.x += (pos.x - s.position.x) * Math.min(1, dt * 4); s.position.z += (pos.z - s.position.z) * Math.min(1, dt * 4); s.userData.basis += (hoehe + 0.9 - s.userData.basis) * Math.min(1, dt * 4); }
      if (aktiv && d < 0.95) { s.visible = false; gesammelt++; anzeigen(); C && C.gib("entdecker", 1); S.ton(gesammelt === ORTE.length ? "juhu" : "wahl"); if (gesammelt === ORTE.length) { truhe.visible = true; S.meldung("Alle Sterne! Die Schatztruhe ist aufgetaucht!"); } }
      const dh = Math.hypot(s.position.x - pos.x, s.position.z - pos.z); if (s.visible && dh < nd) { nd = dh; naechster = s; }
    });
    const ziel = truhe.visible && !truheAuf ? truhe : naechster;
    pfeilHalter.visible = !!ziel && aktiv;
    if (ziel) { pfeilHalter.position.set(pos.x, grund + 0.08, pos.z); pfeilHalter.rotation.y = Math.atan2(ziel.position.x - pos.x, ziel.position.z - pos.z); pfeil.material.opacity = 1; }

    if (hat("insel-glitzer") && laeuft) {
      glitzerTakt += dt;
      if (glitzerTakt > 0.06) {
        glitzerTakt = 0;
        const g = new Mesh(glitzerGeo, new MeshBasicMaterial({ color: ["#FFD24D", "#FF9BC8", "#9FD8FF", "#ffffff"][glitzer.length % 4], transparent: true }));
        g.position.set(pos.x + (Math.random() - 0.5) * 0.4, hoehe + 0.2 + Math.random() * 0.4, pos.z + (Math.random() - 0.5) * 0.4); g.userData.leben = 1; scene.add(g); glitzer.push(g);
      }
    }
    for (let i = glitzer.length - 1; i >= 0; i--) { const g = glitzer[i]; g.userData.leben -= dt; g.position.y += dt * 0.5; g.material.opacity = Math.max(0, g.userData.leben); if (g.userData.leben <= 0) { scene.remove(g); g.material.dispose(); glitzer.splice(i, 1); } }

    // Truhe
    if (truhe.visible) {
      truhe.rotation.y = Math.sin(t) * 0.05;
      if (!truheAuf && aktiv && Math.hypot(truhe.position.x - pos.x, truhe.position.z - pos.z) < 1.6) { truheAuf = true; S.ton("juhu"); setTimeout(belohnung, 1400); }
      if (truheAuf) { deckelWinkel = Math.min(1.9, deckelWinkel + dt * 2.5); deckelGelenk.rotation.x = -deckelWinkel; schatzLicht.material.opacity = Math.min(0.9, deckelWinkel / 2); schatzLicht.scale.setScalar(1 + Math.sin(t * 6) * 0.1); }
    }
  });

  starte(); aktiv = false;
  karte({
    titel: "Insel-Abenteuer",
    text: "Sammle alle 10 Sterne! Lege den Finger links aufs Bild und schiebe, dann läufst du. Rechts unten springst du. Der gelbe Pfeil zeigt dir den Weg.",
    knoepfe: [{ text: "Los geht's!", haupt: true, fn: () => { aktiv = true; } }]
  });
  window.__insel = { get gesammelt() { return gesammelt; }, get pos() { return pos; }, sterne: () => sterne.filter(s => s.visible).map(s => [s.position.x, s.position.z, s.userData.basis]), teleport: (x, z) => { pos.set(x, 0, z); }, springe: () => { eingabe.springen = true; }, truhe: () => [truhe.position.x, truhe.position.z, truhe.visible] };
}
