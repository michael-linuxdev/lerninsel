// Sternenlauf (Geschick & Tempo): Die eigene Figur läuft von selbst auf drei Bahnen.
// Wischen oder Knöpfe: links/rechts die Bahn wechseln, nach oben/tippen springen. Sterne sammeln, Baumstämmen
// ausweichen oder drüberspringen, Steinen ausweichen. Eine Runde dauert 60 Sekunden; wer stolpert, wird kurz langsamer.
import { Group, Mesh, PlaneGeometry, BoxGeometry, CylinderGeometry, ConeGeometry, ExtrudeGeometry, Shape, MeshLambertMaterial, MeshBasicMaterial, Color } from "../three/three.module.js";
import { S, welt, karte, pruefeZugang, sterneFuer } from "./gemeinsam.js";
import { meineFigur, teil, kugel, setze } from "./figur3d.js";

const C = window.Charakter, $ = (id) => document.getElementById(id);
if (pruefeZugang("lauf")) {
  const W = welt({ himmel: "#BFE6FF", nebelVon: 30, nebelBis: 70, fov: 60, schatten: true });
  const { scene, camera, sonne } = W;
  camera.position.set(0, 4.2, 7.5); camera.lookAt(0, 1.2, -6);
  sonne.position.set(6, 14, 8);

  const BAHN = [-1.9, 0, 1.9], DAUER = 60, MAGNET = !!(C && C.hat && C.hat("insel-magnet"));
  // ---------- Strecke ----------
  const gras = new Mesh(new PlaneGeometry(80, 160), new MeshLambertMaterial({ color: "#8FD66B" })); gras.rotation.x = -Math.PI / 2; gras.position.z = -50; gras.receiveShadow = true; scene.add(gras);
  const weg = new Mesh(new PlaneGeometry(6.4, 160), new MeshLambertMaterial({ color: "#F2D9A2" })); weg.rotation.x = -Math.PI / 2; weg.position.set(0, 0.01, -50); weg.receiveShadow = true; scene.add(weg);
  const streifen = [];
  for (let i = 0; i < 40; i++) [-0.95, 0.95].forEach(x => { const s = new Mesh(new PlaneGeometry(0.12, 1.4), new MeshBasicMaterial({ color: "#E2C48A" })); s.rotation.x = -Math.PI / 2; s.position.set(x, 0.02, -i * 4); scene.add(s); streifen.push(s); });
  // Bäume und Blumen am Rand (wandern mit)
  const rand = [];
  for (let i = 0; i < 26; i++) {
    const g = new Group(), seite = i % 2 ? 1 : -1;
    if (i % 3) { g.add(setze(teil(new CylinderGeometry(0.2, 0.28, 1.4, 10), "#9A6A3F"), 0, 0.7, 0)); g.add(setze(teil(kugel(1.0), ["#5DBB5A", "#4FAF62", "#F2A03D"][i % 3]), 0, 2.1, 0)); }
    else g.add(setze(teil(kugel(0.18, 10, 8), ["#FF6F91", "#FFD84D", "#B28DFF"][i % 3], { dicke: 1.15 }), 0, 0.3, 0));
    g.position.set(seite * (4.6 + (i * 37 % 30) / 10), 0, -i * 6); scene.add(g); rand.push(g);
  }

  // ---------- Figur ----------
  const ich = meineFigur(); ich.rotation.y = Math.PI; scene.add(ich);
  const u = ich.userData;
  let bahn = 1, x = 0, y = 0, vy = 0;

  // ---------- Dinge auf der Strecke ----------
  const sternForm = new Shape();
  for (let i = 0; i < 10; i++) { const w = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 0.2 : 0.5; i ? sternForm.lineTo(Math.cos(w) * r, -Math.sin(w) * r) : sternForm.moveTo(Math.cos(w) * r, -Math.sin(w) * r); }
  const sternGeo = new ExtrudeGeometry(sternForm, { depth: 0.16, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 1 }); sternGeo.center();
  const goldMat = new MeshLambertMaterial({ color: "#FFD24D", emissive: "#7a5200", emissiveIntensity: 0.4 });
  const dinge = [];
  function neu(art, b, z) {
    let o;
    if (art === "stern") { o = new Mesh(sternGeo, goldMat); o.position.y = 0.9; }
    else if (art === "stamm") { o = teil(new CylinderGeometry(0.32, 0.32, 1.7, 14), "#A0693F"); o.rotation.z = Math.PI / 2; o.position.y = 0.32; }
    else { o = teil(kugel(0.75, 14, 10), "#A7A9B8"); o.scale.y = 0.85; o.position.y = 0.55; }
    o.position.x = BAHN[b]; o.position.z = z; scene.add(o); const d = { art, b, o }; dinge.push(d); return d;
  }
  let naechstes = -20;   // z, an dem das nächste Muster beginnt
  function muster() {
    // abwechselnd Sternreihen und Hindernisse, immer mit einer freien Bahn
    const z0 = naechstes, wahl = Math.random();
    if (wahl < 0.45) { const b = Math.floor(Math.random() * 3); for (let i = 0; i < 6; i++) neu("stern", b, z0 - i * 1.6); naechstes -= 13; }
    else if (wahl < 0.75) { const b = Math.floor(Math.random() * 3); neu("stamm", b, z0); neu("stern", b, z0).o.position.y = 2.1; naechstes -= 10; }   // Stern über dem Stamm: wer springt, bekommt ihn
    else { const frei = Math.floor(Math.random() * 3); [0, 1, 2].filter(b => b !== frei).forEach(b => neu(Math.random() < 0.5 ? "stein" : "stamm", b, z0)); neu("stern", frei, z0); naechstes -= 12; }
  }
  for (let i = 0; i < 6; i++) muster();

  // ---------- Steuerung ----------
  const wechsle = (d) => { if (!laeuft) return; bahn = Math.max(0, Math.min(2, bahn + d)); S.ton("tipp"); };
  const springe = () => { if (!laeuft || y > 0.05) return; vy = 8.2; S.ton("wahl"); };
  let start = null;
  $("buehne").addEventListener("pointerdown", e => { start = { x: e.clientX, y: e.clientY }; });
  $("buehne").addEventListener("pointerup", e => {
    if (!start) return; const dx = e.clientX - start.x, dy = e.clientY - start.y; start = null;
    if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) wechsle(dx > 0 ? 1 : -1); else springe();
  });
  $("links").addEventListener("pointerdown", (e) => { e.stopPropagation(); wechsle(-1); });
  $("rechts").addEventListener("pointerdown", (e) => { e.stopPropagation(); wechsle(1); });
  $("hoch").addEventListener("pointerdown", (e) => { e.stopPropagation(); springe(); });
  addEventListener("keydown", e => { if (e.key === "ArrowLeft") wechsle(-1); if (e.key === "ArrowRight") wechsle(1); if (e.key === "ArrowUp" || e.key === " ") springe(); });

  // ---------- Spielablauf ----------
  let laeuft = false, zeit = 0, punkte = 0, tempo = 9, stolpern = 0, lauf = 0;
  const anzeigen = () => { $("punkte").textContent = punkte; $("zeit").style.width = Math.max(0, 100 - zeit / DAUER * 100) + "%"; };
  function plus(text) { const p = document.createElement("div"); p.className = "plus"; p.textContent = text; p.style.left = "50%"; p.style.top = "55%"; document.body.appendChild(p); setTimeout(() => p.remove(), 800); }
  function beginne() {
    dinge.splice(0).forEach(d => scene.remove(d.o)); naechstes = -20; for (let i = 0; i < 6; i++) muster();
    zeit = 0; punkte = 0; tempo = 9; stolpern = 0; bahn = 1; laeuft = true; anzeigen();
  }
  function ende() {
    laeuft = false;
    const r = sterneFuer("lauf", punkte, [10, 25, 40]);
    if (C) C.gib("entdecker", 2 + Math.floor(punkte / 10));
    karte({
      titel: punkte >= 40 ? "Wahnsinn!" : punkte >= 25 ? "Super gelaufen!" : "Geschafft!", sterne: r.stufe,
      text: `${punkte} Sterne gesammelt.${r.rekord ? " 🏆 Neuer Rekord!" : ` Dein Rekord: ${r.bisher}.`}${r.neu ? ` +${r.neu} ⭐ für den Kleiderschrank.` : r.stufe < 3 ? ` Nächstes Ziel: ${[10, 25, 40][r.stufe]} Sterne.` : ""}`,
      knoepfe: [{ text: "🔁 Nochmal laufen", haupt: true, fn: beginne }, { text: "🏝️ Zurück zur Insel", fn: () => { location.href = "../insel/"; } }]
    });
  }

  W.start((dt, t) => {
    // Figur: Bahn wechseln, springen, laufen
    x += (BAHN[bahn] - x) * Math.min(1, dt * 12);
    if (y > 0 || vy > 0) { vy -= 22 * dt; y = Math.max(0, y + vy * dt); if (y === 0) vy = 0; }
    ich.position.set(x, y, 0);
    lauf += dt * (laeuft ? 14 : 0);
    const sw = Math.sin(lauf) * (y > 0 ? 0 : 0.8);
    if (u.beine) { u.beine[0].rotation.x = sw; u.beine[1].rotation.x = -sw; u.arme[0].rotation.x = -sw; u.arme[1].rotation.x = sw; }
    if (u.koerper) u.koerper.rotation.z = stolpern > 0 ? Math.sin(t * 30) * 0.15 : 0;
    if (!laeuft) return;

    zeit += dt; if (zeit >= DAUER) { anzeigen(); return ende(); }
    tempo = Math.min(19, 9 + zeit * 0.16);
    stolpern = Math.max(0, stolpern - dt);
    const v = tempo * (stolpern > 0 ? 0.45 : 1), weg = v * dt;
    streifen.forEach(s => { s.position.z += weg; if (s.position.z > 6) s.position.z -= 160; });
    rand.forEach(g => { g.position.z += weg; if (g.position.z > 8) g.position.z -= 156; });
    naechstes += weg; while (naechstes > -70) muster();
    for (let i = dinge.length - 1; i >= 0; i--) {
      const d = dinge[i], o = d.o; o.position.z += weg;
      if (d.art === "stern") {
        o.rotation.y += dt * 3;
        if (MAGNET && Math.abs(d.b - bahn) === 1 && o.position.z > -3 && o.position.z < 0.5) o.position.x += (x - o.position.x) * Math.min(1, dt * 8);
        if (Math.abs(o.position.z) < 0.6 && Math.abs(o.position.x - x) < 0.9 && Math.abs(o.position.y - 0.9 - y) < 1.1) { punkte++; anzeigen(); S.ton("wahl"); scene.remove(o); dinge.splice(i, 1); continue; }
      } else if (stolpern <= 0 && Math.abs(o.position.z) < 0.55 && Math.abs(BAHN[d.b] - x) < 1.0 && (d.art === "stein" || y < 0.55)) {
        stolpern = 1.1; const weg2 = Math.min(3, punkte); punkte -= weg2; anzeigen(); S.ton("nein"); if (weg2) plus(`−${weg2} ⭐`);
      }
      if (o.position.z > 6) { scene.remove(o); dinge.splice(i, 1); }
    }
    anzeigen();
  });

  karte({
    titel: "🏃 Sternenlauf",
    text: `Lauf 60 Sekunden und sammle so viele Sterne wie du kannst! Wische nach links und rechts, tippe zum Springen.${MAGNET ? " ✨ Dein Sternen-Magnet hilft dir!" : ""}`,
    knoepfe: [{ text: "Los geht's!", haupt: true, fn: beginne }]
  });
  window.__lauf = { get punkte() { return punkte; }, get laeuft() { return laeuft; }, wechsle, springe, ende };
}
