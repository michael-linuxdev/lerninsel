// Ballon-Party: Ballons steigen auf, antippen lässt sie platzen.
import {
  Group, Mesh, SphereGeometry, ConeGeometry, CylinderGeometry, PlaneGeometry, BoxGeometry, ExtrudeGeometry, Shape,
  MeshLambertMaterial, MeshBasicMaterial, BufferGeometry, Line, LineBasicMaterial, Vector3, Vector2, Raycaster, Color
} from "../three/three.module.js";
import { S, welt, karte, daten, speichere, pruefeZugang } from "./gemeinsam.js";

const C = window.Charakter;
if (pruefeZugang()) {
  const W = welt({ himmel: "#BFE6FF", nebelVon: 25, nebelBis: 70 });
  const { scene, camera } = W;
  camera.position.set(0, 3.2, 12); camera.lookAt(0, 5, 0);

  // ---------- Landschaft ----------
  const wiese = new Mesh(new PlaneGeometry(120, 120), new MeshLambertMaterial({ color: "#8FD66B" }));
  wiese.rotation.x = -Math.PI / 2; scene.add(wiese);
  const huegelMat = new MeshLambertMaterial({ color: "#7AC95A", flatShading: true });
  [[-14, -22, 9], [10, -26, 11], [28, -20, 8], [-30, -18, 7]].forEach(([x, z, r]) => {
    const h = new Mesh(new SphereGeometry(r, 16, 10), huegelMat); h.scale.y = 0.45; h.position.set(x, 0, z); scene.add(h);
  });
  const stamm = new MeshLambertMaterial({ color: "#A0693F" }), krone = new MeshLambertMaterial({ color: "#3E9E5A", flatShading: true });
  [[-9, -8], [-12, -11], [8, -9], [12, -12], [-5, -14], [4, -15]].forEach(([x, z], i) => {
    const b = new Group();
    const s = new Mesh(new CylinderGeometry(0.25, 0.35, 1.6, 8), stamm); s.position.y = 0.8; b.add(s);
    const k1 = new Mesh(new ConeGeometry(1.5, 2.6, 8), krone); k1.position.y = 2.6; b.add(k1);
    const k2 = new Mesh(new ConeGeometry(1.1, 2, 8), krone); k2.position.y = 3.7; b.add(k2);
    b.position.set(x, 0, z); b.scale.setScalar(0.9 + (i % 3) * 0.2); scene.add(b);
  });
  const wolkenMat = new MeshLambertMaterial({ color: "#ffffff" });
  const wolken = [];
  for (let i = 0; i < 5; i++) {
    const w = new Group();
    [[0, 0, 1.4], [1.3, 0.3, 1.1], [-1.3, 0.2, 1], [0.5, 0.8, 1]].forEach(([x, y, r]) => { const m = new Mesh(new SphereGeometry(r, 12, 10), wolkenMat); m.position.set(x, y, 0); w.add(m); });
    w.position.set(-20 + i * 10, 12 + (i % 2) * 3, -20 - (i % 3) * 4); scene.add(w); wolken.push(w);
  }

  // ---------- Ballons ----------
  const FARBEN = ["#FF6F61", "#FF9BC8", "#C2337A", "#7B55B8", "#3AA0E0", "#5CCBA6", "#FFC83D", "#FF8C2A"];
  const kugel = new SphereGeometry(0.85, 22, 16), knoten = new ConeGeometry(0.16, 0.24, 8), glanzGeo = new SphereGeometry(0.17, 8, 6);
  const glanzMat = new MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.75 });
  const schnurMat = new LineBasicMaterial({ color: "#7a6a8a" });
  const sternForm = new Shape();
  for (let i = 0; i < 10; i++) { const w = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 0.28 : 0.7; i ? sternForm.lineTo(Math.cos(w) * r, -Math.sin(w) * r) : sternForm.moveTo(Math.cos(w) * r, -Math.sin(w) * r); }
  const sternGeo = new ExtrudeGeometry(sternForm, { depth: 0.22, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 2 });
  sternGeo.center();
  const goldMat = new MeshLambertMaterial({ color: "#FFD24D", emissive: "#7a5200", emissiveIntensity: 0.35 });

  const ballons = [], funken = [];
  function neuerBallon() {
    const gold = Math.random() < (C && C.hat("ballon-gold") ? 0.16 : 0.08);
    const g = new Group();
    let koerper;
    if (gold) {
      koerper = new Mesh(sternGeo, goldMat); koerper.scale.setScalar(1.25); g.add(koerper);
    } else {
      const mat = new MeshLambertMaterial({ color: FARBEN[Math.floor(Math.random() * FARBEN.length)] });
      koerper = new Mesh(kugel, mat); koerper.scale.set(1, 1.18, 1); g.add(koerper);
      const k = new Mesh(knoten, mat); k.position.y = -1.04; k.rotation.x = Math.PI; g.add(k);
      const gl = new Mesh(glanzGeo, glanzMat); gl.position.set(0.3, 0.44, 0.68); g.add(gl);
    }
    const punkte = []; for (let i = 0; i < 7; i++) punkte.push(new Vector3(Math.sin(i * 1.3) * 0.08, -1.12 - i * 0.24, 0));
    g.add(new Line(new BufferGeometry().setFromPoints(punkte), schnurMat));
    g.position.set((Math.random() - 0.5) * 11, -0.6, 1 - Math.random() * 4);
    g.userData = { gold, tempo: 1.1 + Math.random() * 1.1 + spielzeit * 0.012, phase: Math.random() * 6, farbe: gold ? "#FFD24D" : koerper.material.color.getStyle() };
    scene.add(g); ballons.push(g);
  }

  function platzen(b) {
    const farbe = b.userData.farbe;
    for (let i = 0; i < 16; i++) {
      const m = new Mesh(new BoxGeometry(0.12, 0.12, 0.02), new MeshBasicMaterial({ color: i % 3 ? farbe : FARBEN[i % FARBEN.length], transparent: true }));
      m.position.copy(b.position);
      m.userData = { v: new Vector3((Math.random() - 0.5) * 6, Math.random() * 5, (Math.random() - 0.5) * 4), leben: 0.9, dreh: Math.random() * 10 };
      scene.add(m); funken.push(m);
    }
    scene.remove(b); ballons.splice(ballons.indexOf(b), 1);
  }

  // "+1" über dem geplatzten Ballon
  function plusAnzeige(pos, text) {
    const v = pos.clone().project(camera);
    const el = document.createElement("div");
    el.className = "plus"; el.textContent = text;
    el.style.left = ((v.x + 1) / 2 * 100) + "%"; el.style.top = ((1 - v.y) / 2 * 100) + "%";
    document.getElementById("buehne").appendChild(el);
    setTimeout(() => el.remove(), 800);
  }

  // ---------- Antippen ----------
  const ray = new Raycaster(), zeiger = new Vector2();
  W.renderer.domElement.addEventListener("pointerdown", (e) => {
    if (!aktiv) return;
    const r = W.renderer.domElement.getBoundingClientRect();
    zeiger.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(zeiger, camera);
    // Großzügig: nächster Ballon in der Nähe des Strahls
    let bester = null, abstand = 1.25;
    ballons.forEach(b => { const d = ray.ray.distanceToPoint(b.position); if (d < abstand) { abstand = d; bester = b; } });
    if (!bester) return;
    const p = bester.userData.gold ? 3 : 1;
    punkte += p; anzeigen();
    plusAnzeige(bester.position, "+" + p);
    S.ton(bester.userData.gold ? "juhu" : "wahl");
    platzen(bester);
  });

  // ---------- Spielablauf ----------
  const DAUER = 60 + (C && C.hat("ballon-zeit-10") ? 10 : C && C.hat("ballon-zeit-5") ? 5 : 0), ZIELE = [15, 30, 45];
  let aktiv = false, punkte = 0, spielzeit = 0, naechster = 0;
  const $p = document.getElementById("punkte"), $z = document.getElementById("zeit");
  function anzeigen() { $p.textContent = punkte; $z.style.width = Math.max(0, (1 - spielzeit / DAUER) * 100) + "%"; }

  function starte() {
    ballons.slice().forEach(b => { scene.remove(b); }); ballons.length = 0;
    punkte = 0; spielzeit = 0; naechster = 0; aktiv = true; anzeigen();
  }
  function ende() {
    aktiv = false;
    const d = daten(); const vorher = d.ballon.rekord;
    const neu = ZIELE.filter(z => punkte >= z && !d.ballon.ziele.includes(z));
    d.ballon.ziele.push(...neu); d.ballon.rekord = Math.max(vorher, punkte); speichere(d);
    if (neu.length) S.gibSterne(neu.length);
    if (C) { C.gib("entdecker", 2 + Math.floor(punkte / 8)); C.ereignis("ballon-runde"); }
    const sterne = ZIELE.filter(z => punkte >= z).length;
    S.ton("juhu");
    karte({
      titel: punkte > vorher && vorher > 0 ? "Neuer Rekord!" : "Zeit ist um!", sterne,
      text: `Du hast <b>${punkte}</b> Punkte. Rekord: ${Math.max(vorher, punkte)}.` +
        (neu.length ? ` <br>+${neu.length} ${neu.length === 1 ? "Stern" : "Sterne"} für den Kleiderschrank!` : (sterne < 3 ? ` <br>Nächster Stern ab ${ZIELE.find(z => !d.ballon.ziele.includes(z))} Punkten.` : "")),
      knoepfe: [{ text: "Nochmal", haupt: true, fn: starte }, { text: "Zur 3D-Welt", fn: () => location.href = "./" }]
    });
  }

  W.start((dt, t) => {
    wolken.forEach((w, i) => { w.position.x += dt * (0.3 + i * 0.05); if (w.position.x > 30) w.position.x = -30; });
    if (aktiv) {
      spielzeit += dt; naechster -= dt;
      if (naechster <= 0) { neuerBallon(); naechster = Math.max(0.42, 0.95 - spielzeit * 0.009) * (0.7 + Math.random() * 0.6); }
      anzeigen();
      if (spielzeit >= DAUER) ende();
    }
    for (let i = ballons.length - 1; i >= 0; i--) {
      const b = ballons[i], u = b.userData;
      b.position.y += u.tempo * dt;
      b.position.x += Math.sin(t * 1.3 + u.phase) * dt * 0.4;
      b.rotation.z = Math.sin(t * 1.5 + u.phase) * 0.12;
      if (u.gold) b.children[0].rotation.y += dt * 2;
      if (b.position.y > 13) { scene.remove(b); ballons.splice(i, 1); }
    }
    for (let i = funken.length - 1; i >= 0; i--) {
      const f = funken[i], u = f.userData;
      u.leben -= dt; u.v.y -= 9 * dt;
      f.position.addScaledVector(u.v, dt); f.rotation.x += u.dreh * dt; f.rotation.y += u.dreh * dt;
      f.material.opacity = Math.max(0, u.leben / 0.9);
      if (u.leben <= 0) { scene.remove(f); f.material.dispose(); funken.splice(i, 1); }
    }
  });

  karte({
    titel: "Ballon-Party", text: `Tippe so viele Ballons an, wie du kannst! Goldene Sterne zählen 3 Punkte. Du hast ${DAUER} Sekunden.`,
    knoepfe: [{ text: "Los geht's!", haupt: true, fn: starte }]
  });
  window.__ballons = { get punkte() { return punkte; }, get anzahl() { return ballons.length; }, ende: () => { spielzeit = DAUER; } };
}
