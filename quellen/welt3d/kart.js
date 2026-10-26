// Kart-Rennen (Fahrzeuge): 3 Runden gegen Fipsi und Benno auf einer Rennstrecke mit Münzen und Turbo-Feldern.
// Gas gibt das Kart von selbst; gelenkt wird mit den Knöpfen ◀ ▶, durch Ziehen auf dem Bildschirm oder mit den Pfeiltasten.
// Abseits der Strecke wird man langsamer. Sterne gibt es für neue Münz-Ziele, dazu Platz und Bestzeit.
import { Group, Mesh, PlaneGeometry, BoxGeometry, CylinderGeometry, ConeGeometry, BufferGeometry, Float32BufferAttribute, MeshLambertMaterial, MeshBasicMaterial,
  CatmullRomCurve3, Vector3, Sprite, SpriteMaterial, CanvasTexture, SRGBColorSpace, TorusGeometry } from "../three/three.module.js";
import { S, welt, karte, pruefeZugang, sterneFuer, daten, speichere } from "./gemeinsam.js";
import { meineFigur, teil, kugel, setze } from "./figur3d.js";

const C = window.Charakter, $ = (id) => document.getElementById(id);
if (pruefeZugang("kart")) {
  const W = welt({ himmel: "#BFE6FF", nebelVon: 45, nebelBis: 120, fov: 60, schatten: true });
  const { scene, camera, sonne } = W;
  const RUNDEN = 3, BREITE = 6;

  // ---------- Strecke ----------
  const punkte = [[0, 0], [22, -4], [34, -18], [28, -36], [10, -40], [0, -28], [-12, -38], [-30, -32], [-34, -14], [-20, -4]].map(([x, z]) => new Vector3(x, 0, z));
  const kurve = new CatmullRomCurve3(punkte, true, "catmullrom", 0.5);
  const N = 600, bahn = kurve.getSpacedPoints(N).slice(0, N), LAENGE = kurve.getLength();
  const richtung = bahn.map((p, i) => bahn[(i + 1) % N].clone().sub(p).normalize());
  const gras = new Mesh(new PlaneGeometry(260, 260), new MeshLambertMaterial({ color: "#8FD66B" })); gras.rotation.x = -Math.PI / 2; gras.position.set(0, 0, -20); gras.receiveShadow = true; scene.add(gras);
  // Straßenband aus Dreiecken
  {
    const pos = [], idx = [], rand = [];
    bahn.forEach((p, i) => { const r = richtung[i], n = new Vector3(-r.z, 0, r.x); [-1, 1].forEach(s => pos.push(p.x + n.x * s * BREITE / 2, 0.02, p.z + n.z * s * BREITE / 2)); });
    for (let i = 0; i < N; i++) { const a = i * 2, b = ((i + 1) % N) * 2; idx.push(a, b, a + 1, a + 1, b, b + 1); }
    const g = new BufferGeometry(); g.setAttribute("position", new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    const strasse = new Mesh(g, new MeshLambertMaterial({ color: "#8E8AA0", side: 2 })); strasse.receiveShadow = true; scene.add(strasse);
    // rot-weiße Randsteine
    bahn.forEach((p, i) => { if (i % 6) return; const r = richtung[i], n = new Vector3(-r.z, 0, r.x); [-1, 1].forEach(s => { const k = new Mesh(new BoxGeometry(0.5, 0.15, 1.2), new MeshLambertMaterial({ color: (i / 6) % 2 ? "#FFFFFF" : "#E0574A" })); k.position.set(p.x + n.x * s * (BREITE / 2 + 0.2), 0.08, p.z + n.z * s * (BREITE / 2 + 0.2)); k.rotation.y = Math.atan2(r.x, r.z); scene.add(k); rand.push(k); }); });
  }
  // Ziellinie (Schachbrett)
  { const r = richtung[0], n = new Vector3(-r.z, 0, r.x); for (let a = 0; a < 10; a++) for (let b = 0; b < 2; b++) { const f = new Mesh(new PlaneGeometry(0.6, 0.6), new MeshBasicMaterial({ color: (a + b) % 2 ? "#2E2240" : "#FFFFFF" })); f.rotation.x = -Math.PI / 2; f.rotation.z = -Math.atan2(r.x, r.z); f.position.set(bahn[0].x + n.x * (a - 4.5) * 0.6 + r.x * (b - 0.5) * 0.6, 0.03, bahn[0].z + n.z * (a - 4.5) * 0.6 + r.z * (b - 0.5) * 0.6); scene.add(f); } }
  // Bäume außen
  const naheStrecke = (x, z) => bahn.some(p => Math.hypot(p.x - x, p.z - z) < BREITE);
  for (let i = 0; i < 70; i++) {
    const x = (Math.random() - 0.5) * 120, z = -20 + (Math.random() - 0.5) * 100; if (naheStrecke(x, z)) continue;
    const g = new Group(); g.add(setze(teil(new CylinderGeometry(0.25, 0.35, 1.6, 10), "#9A6A3F"), 0, 0.8, 0)); g.add(setze(teil(kugel(1.2, 14, 10), ["#5DBB5A", "#4FAF62", "#F2A03D"][i % 3]), 0, 2.4, 0));
    g.position.set(x, 0, z); scene.add(g);
  }

  // ---------- Münzen und Turbo-Felder ----------
  const muenzen = [], goldMat = new MeshLambertMaterial({ color: "#FFD24D", emissive: "#7a5200", emissiveIntensity: 0.4 });
  for (let i = 15; i < N; i += 20) { const r = richtung[i], n = new Vector3(-r.z, 0, r.x), o = (((i * 7) % 5) - 2) * 0.9; const m = new Mesh(new CylinderGeometry(0.45, 0.45, 0.1, 18), goldMat); m.rotation.x = Math.PI / 2; m.position.set(bahn[i].x + n.x * o, 0.8, bahn[i].z + n.z * o); scene.add(m); muenzen.push(m); }
  const turbos = [];
  [110, 260, 420, 540].forEach(i => { const t = new Mesh(new PlaneGeometry(2.2, 2.6), new MeshBasicMaterial({ color: "#5EC3E6" })); t.rotation.x = -Math.PI / 2; t.rotation.z = -Math.atan2(richtung[i].x, richtung[i].z); t.position.set(bahn[i].x, 0.04, bahn[i].z); scene.add(t); turbos.push(t); });

  // ---------- Karts ----------
  function kartModell(farbe) {
    const k = new Group();
    k.add(setze(teil(new BoxGeometry(1.1, 0.32, 1.8), farbe), 0, 0.42, 0));
    k.add(setze(teil(new BoxGeometry(0.9, 0.25, 0.4), "#2E2240"), 0, 0.5, 0.85));
    [[-0.6, 0.6], [0.6, 0.6], [-0.6, -0.6], [0.6, -0.6]].forEach(([x, z]) => { const r = teil(new CylinderGeometry(0.28, 0.28, 0.24, 14), "#2E2240"); r.rotation.z = Math.PI / 2; setze(r, x, 0.28, z); k.add(r); });
    return k;
  }
  function schild(emoji) { const c = document.createElement("canvas"); c.width = c.height = 128; const g2 = c.getContext("2d"); g2.font = "100px sans-serif"; g2.textAlign = "center"; g2.textBaseline = "middle"; g2.fillText(emoji, 64, 70); const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; const s = new Sprite(new SpriteMaterial({ map: t })); s.scale.set(1.3, 1.3, 1); return s; }
  const ich = kartModell("#E0457B"); scene.add(ich);
  const fahrer = meineFigur(); fahrer.scale.setScalar(0.62); fahrer.position.set(0, 0.35, -0.1); ich.add(fahrer);
  if (fahrer.userData.beine) fahrer.userData.beine.forEach(b => { b.rotation.x = -1.3; });
  const gegner = [["#F28C38", "🦊", 11.0], ["#A86A3D", "🦫", 11.8]].map(([f, e, v], i) => { const k = kartModell(f); const s = schild(e); s.position.y = 1.5; k.add(s); scene.add(k); return { k, v, s: N - 6 - i * 6, seite: i ? 1.4 : -1.4 }; });

  // ---------- Steuerung ----------
  let lenk = 0; const tasten = {};
  addEventListener("keydown", e => { tasten[e.key] = true; }); addEventListener("keyup", e => { tasten[e.key] = false; });
  const halt = (id, w) => { const b = $(id); const an = (e) => { e.preventDefault(); b.dataset.an = "1"; }, aus = () => { b.dataset.an = ""; }; b.addEventListener("pointerdown", an); ["pointerup", "pointerleave", "pointercancel"].forEach(ev => b.addEventListener(ev, aus)); return () => b.dataset.an === "1" ? w : 0; };
  const links = halt("links", 1), rechts = halt("rechts", -1);
  let zieh = null;
  $("buehne").addEventListener("pointerdown", e => { zieh = { x: e.clientX, id: e.pointerId }; });
  $("buehne").addEventListener("pointermove", e => { if (zieh && e.pointerId === zieh.id) zieh.d = (zieh.x - e.clientX) / 80; });
  addEventListener("pointerup", e => { if (zieh && e.pointerId === zieh.id) zieh = null; });

  // ---------- Rennen ----------
  let laeuft = false, pos = new Vector3(), winkel = 0, v = 0, idx = 0, runde = 0, halb = false, zeit = 0, gesammelt = 0, turbo = 0, startZaehler = 0;
  function setzeStart() {
    pos.copy(bahn[N - 3]); winkel = Math.atan2(richtung[N - 3].x, richtung[N - 3].z); v = 0; idx = N - 3; runde = 0; halb = false; zeit = 0; gesammelt = 0; turbo = 0;
    gegner.forEach((g, i) => { g.s = N - 8 - i * 6; g.runde = 0; g.halb = false; g.fertig = null; });
    muenzen.forEach(m => { m.visible = true; });
  }
  const naechster = (p, von) => { let best = von, bd = Infinity; for (let k = -30; k <= 30; k++) { const i = (von + k + N) % N, d = (bahn[i].x - p.x) ** 2 + (bahn[i].z - p.z) ** 2; if (d < bd) { bd = d; best = i; } } return [best, Math.sqrt(bd)]; };
  const fortschritt = (r, i) => r * N + i;
  function platz() { const meins = fortschritt(runde, idx); return 1 + gegner.filter(g => g.fertig != null || fortschritt(g.runde, Math.floor(g.s) % N) > meins).length; }
  const zeitText = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  function anzeigen() { $("runde").textContent = `${Math.min(RUNDEN, runde + 1)}/${RUNDEN}`; $("muenzen").textContent = gesammelt; $("platz").textContent = `${platz()}.`; $("zeit").textContent = zeitText(zeit); }
  function beginne() { setzeStart(); startZaehler = 3.2; laeuft = true; anzeigen(); }
  function ende() {
    laeuft = false;
    const p = platz(), r = sterneFuer("kart", gesammelt, [8, 16, 24]);
    const d = daten(), k = d.kart = Object.assign({ rekord: 0, beste: 0 }, d.kart || {}); const bestzeit = !k.zeit || zeit < k.zeit; if (bestzeit) k.zeit = Math.round(zeit * 10) / 10; if (p === 1) k.siege = (k.siege || 0) + 1; speichere(d);
    if (C) C.gib("entdecker", 3 + (p === 1 ? 2 : 0));
    karte({
      titel: p === 1 ? "🏆 Gewonnen!" : `${p}. Platz – stark!`, sterne: r.stufe,
      text: `Zeit ${zeitText(zeit)}${bestzeit ? " – neue Bestzeit!" : ""} · ${gesammelt} Münzen.${r.neu ? ` +${r.neu} ⭐ für den Kleiderschrank.` : r.stufe < 3 ? ` Nächstes Ziel: ${[8, 16, 24][r.stufe]} Münzen.` : ""}`,
      knoepfe: [{ text: "🔁 Nochmal fahren", haupt: true, fn: beginne }, { text: "🏝️ Zurück zur Insel", fn: () => { location.href = "heimat.html"; } }]
    });
  }

  setzeStart();
  W.start((dt, t) => {
    // Gegner fahren die Ideallinie (mit leichtem Schlenker)
    gegner.forEach((g, i) => {
      if (laeuft && startZaehler <= 0 && g.fertig == null) {
        const alt = Math.floor(g.s) % N; g.s += g.v * dt * (N / LAENGE) * (1 + Math.sin(t * 0.7 + i) * 0.06);
        const neu = Math.floor(g.s) % N; if (neu < alt) { if (g.halb) { g.runde++; g.halb = false; if (g.runde >= RUNDEN) g.fertig = zeit; } } if (neu > N / 2 && neu < N * 0.75) g.halb = true;
      }
      const i0 = Math.floor(g.s) % N, r = richtung[i0], n = { x: -r.z, z: r.x }, o = g.seite + Math.sin(t * 0.5 + i) * 0.5;
      g.k.position.set(bahn[i0].x + n.x * o, 0, bahn[i0].z + n.z * o); g.k.rotation.y = Math.atan2(r.x, r.z);
    });
    if (laeuft) {
      if (startZaehler > 0) { const vor = Math.ceil(startZaehler); startZaehler -= dt; $("start").textContent = startZaehler > 0 ? Math.ceil(startZaehler) : "LOS!"; $("start").hidden = false; if (Math.ceil(startZaehler) !== vor) S.ton(startZaehler > 0 ? "tipp" : "juhu"); }
      else {
        if (startZaehler > -1) { startZaehler -= dt; if (startZaehler <= -1) $("start").hidden = true; }
        zeit += dt;
        lenk = Math.max(-1, Math.min(1, links() + rechts() + (tasten.ArrowLeft ? 1 : 0) - (tasten.ArrowRight ? 1 : 0) + (zieh && zieh.d ? Math.max(-1, Math.min(1, zieh.d)) : 0)));
        const [i, abstand] = naechster(pos, idx);
        const ab = abstand > BREITE / 2 + 0.4;
        turbo = Math.max(0, turbo - dt);
        const vmax = (ab ? 6 : 13) + (turbo > 0 ? 6 : 0);
        v += (vmax - v) * Math.min(1, dt * (v < vmax ? 1.4 : 3));
        // Lenkhilfe: das Kart zieht sanft zur Strecke (ohne Eingabe stärker) – für kleine Fahrer:innen
        const ziel = bahn[(i + 14) % N], soll = Math.atan2(ziel.x - pos.x, ziel.z - pos.z); let diff = soll - winkel; diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        winkel += lenk * dt * (1.9 + v * 0.04) + Math.max(-1, Math.min(1, diff)) * dt * (lenk ? 0.35 : 1.6);
        // Weit weg? Zurück auf die Strecke
        if (abstand > 14) { pos.copy(bahn[i]); winkel = Math.atan2(richtung[i].x, richtung[i].z); v = 3; $("start").textContent = "↩️"; $("start").hidden = false; startZaehler = -0.2; }
        pos.x += Math.sin(winkel) * v * dt; pos.z += Math.cos(winkel) * v * dt;
        if (i < idx - N / 2 && halb) { runde++; halb = false; S.ton("juhu"); if (runde >= RUNDEN) { idx = i; anzeigen(); return ende(); } }
        if (i > N / 2 && i < N * 0.75) halb = true;
        idx = i;
        muenzen.forEach(m => { if (m.visible && Math.hypot(m.position.x - pos.x, m.position.z - pos.z) < 1.3) { m.visible = false; gesammelt++; S.ton("wahl"); } });
        turbos.forEach(tb => { if (Math.hypot(tb.position.x - pos.x, tb.position.z - pos.z) < 1.5 && turbo < 0.5) { turbo = 1.6; S.ton("juhu"); } });
        anzeigen();
      }
    }
    muenzen.forEach(m => { m.rotation.z += dt * 3; });
    ich.position.copy(pos); ich.rotation.y = winkel; ich.rotation.z = -lenk * 0.08;
    // Kamera hinter dem Kart
    const cx = pos.x - Math.sin(winkel) * 7, cz = pos.z - Math.cos(winkel) * 7;
    camera.position.x += (cx - camera.position.x) * Math.min(1, dt * 4); camera.position.z += (cz - camera.position.z) * Math.min(1, dt * 4); camera.position.y = 3.6;
    camera.lookAt(pos.x + Math.sin(winkel) * 4, 0.8, pos.z + Math.cos(winkel) * 4);
    sonne.position.set(pos.x + 8, 16, pos.z + 10); sonne.target.position.copy(pos); sonne.target.updateMatrixWorld();
  });
  camera.position.set(bahn[N - 3].x, 3.6, bahn[N - 3].z + 7);
  karte({
    titel: "🏎️ Kart-Rennen",
    text: "3 Runden gegen Fipsi und Benno! Dein Kart fährt von selbst und hilft beim Lenken – lenke mit ◀ ▶. Sammle Münzen und fahr über die blauen Turbo-Felder!",
    knoepfe: [{ text: "Los geht's!", haupt: true, fn: beginne }]
  });
  window.__kart = { get platz() { return platz(); }, get runde() { return runde; }, get v() { return v; }, get muenzen() { return gesammelt; }, ende };
}
