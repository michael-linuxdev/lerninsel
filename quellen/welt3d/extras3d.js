// Extras aus dem Kleiderschrank als 3D-Teile (07.11.2026) – gemeinsam für die Insel-Figur (heimat.js) und die Minispiel-Figur (figur3d.js).
// Angeglichen an die 2D-Zeichnungen (teile.js/teile2.js): Bommelmütze rund mit Bommel (Weihnachtsmütze bleibt spitz), Dinge in der Hand
// werden gehalten (erstes Ding rechts, zweites links), Kopfschmuck sitzt auf dem Haar. Alle Extras von Puppe.extras haben hier ein Teil.
// t = { kopf, koerper, arme: [links, rechts], hand: y der Hand im Arm, gross: Faktor für Dinge in der Hand, hals: y des Halses im Körper, ruecken: y der Schultern, umhang: y }
// h = { teil, kugel, setze, mat, verlauf } – die Helfer des aufrufenden Moduls (gleiche Materialien und Konturen)
import { Group, Mesh, MeshToonMaterial, CylinderGeometry, ConeGeometry, BoxGeometry, CapsuleGeometry, TorusGeometry, SphereGeometry, CircleGeometry, OctahedronGeometry } from "../three/three.module.js";

export const EXTRAS_3D = ["krone", "rechenkrone", "schleife", "blume", "haarreif", "katzenohren", "fuchsohren", "einhorn", "muetze", "weihnachtsmuetze", "hut", "entdeckerhut",
  "kopfhoerer", "pixelbrille", "brille", "sonnenbrille", "ohrringe", "cap", "piratenhut", "augenklappe", "maske", "kette", "schal", "fliege", "armband",
  "tasche", "teddy", "zauberstab", "ballon", "fussball", "kuscheldino", "schwert", "umhang", "fluegel"];
const HAND = ["tasche", "teddy", "zauberstab", "ballon", "fussball", "kuscheldino", "schwert"];

export function extras3d(look, t, h) {
  const { teil, kugel, setze, mat, verlauf } = h, { kopf, koerper, arme } = t;
  const ex = look.extras || {}, hat = (id) => !!ex[id];
  const farbe = (id, std) => (ex[id] && ex[id].farbe) || std;
  const dunkel = mat("#2E2240");
  const bluete = (eltern, c, x, y, z, r = 0.07) => {   // fünf Blütenblätter und gelbe Mitte
    const g = new Group(); setze(g, x, y, z); eltern.add(g);
    for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; g.add(setze(teil(kugel(r, 10, 8), c, { dicke: 1.12 }), Math.cos(a) * r * 1.2, Math.sin(a) * r * 1.2, 0)); }
    g.add(setze(new Mesh(kugel(r * 0.7, 8, 6), mat("#FFD84D")), 0, 0, r * 0.4));
    return g;
  };
  // ---------- Kopf ----------
  if (hat("krone") || hat("rechenkrone")) { const id = hat("krone") ? "krone" : "rechenkrone"; const k = teil(new CylinderGeometry(0.28, 0.26, 0.2, 16, 1, true), farbe(id, "#FFC83D")); setze(k, 0, 0.66, 0); kopf.add(k); for (let i = 0; i < 5; i++) { const z = teil(new ConeGeometry(0.06, 0.16, 8), farbe(id, "#FFC83D"), { dicke: 1.1 }); const a = i / 5 * Math.PI * 2; setze(z, Math.cos(a) * 0.27, 0.82, Math.sin(a) * 0.27); kopf.add(z); } }
  // Bommelmütze wie in 2D: rund über dem Haar, Umschlag, Bommel oben
  if (hat("muetze")) { const c = farbe("muetze", "#3AA0E0"); const m = teil(new SphereGeometry(0.66, 24, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), c); m.scale.set(1, 0.95, 1); setze(m, 0, 0.18, -0.03); kopf.add(m); const rand = teil(new TorusGeometry(0.63, 0.1, 10, 28), c); rand.rotation.x = Math.PI / 2; setze(rand, 0, 0.2, -0.03); kopf.add(rand); kopf.add(setze(teil(kugel(0.17, 14, 10), "#FFFFFF", { dicke: 1.1 }), 0, 0.86, -0.04)); }
  if (hat("weihnachtsmuetze")) { const m = teil(new ConeGeometry(0.5, 0.75, 24), farbe("weihnachtsmuetze", "#D7263D")); setze(m, 0, 0.78, -0.05); m.rotation.x = -0.25; kopf.add(m); const rand = teil(new TorusGeometry(0.47, 0.09, 10, 28), "#FFFFFF"); setze(rand, 0, 0.44, -0.02); rand.rotation.x = Math.PI / 2 - 0.25; kopf.add(rand); kopf.add(setze(teil(kugel(0.12), "#FFFFFF"), 0, 1.15, -0.25)); }
  if (hat("hut") || hat("entdeckerhut")) { const id = hat("hut") ? "hut" : "entdeckerhut"; kopf.add(setze(teil(new CylinderGeometry(0.85, 0.85, 0.05, 28), farbe(id, "#FFE27A")), 0, 0.45, 0)); kopf.add(setze(teil(new SphereGeometry(0.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), farbe(id, "#FFE27A")), 0, 0.45, 0));
    kopf.add(setze(teil(new CylinderGeometry(0.51, 0.51, 0.08, 24, 1, true), id === "hut" ? "#FF6F61" : "#7A5A34", { umriss: false }), 0, 0.5, 0)); }   // Hutband
  if (hat("katzenohren") || hat("fuchsohren")) { const id = hat("katzenohren") ? "katzenohren" : "fuchsohren"; [-1, 1].forEach(s => { const o = teil(new ConeGeometry(0.16, 0.32, 12), farbe(id, "#F28C38")); setze(o, 0.33 * s, 0.6, -0.05); o.rotation.z = -0.35 * s; kopf.add(o); const i = new Mesh(new ConeGeometry(0.08, 0.18, 10), mat(id === "katzenohren" ? "#FF9BC8" : "#FFF4E8")); setze(i, 0.33 * s, 0.58, 0.04); i.rotation.z = -0.35 * s; kopf.add(i); }); }
  if (hat("brille") || hat("sonnenbrille") || hat("pixelbrille")) { const id = hat("brille") ? "brille" : hat("sonnenbrille") ? "sonnenbrille" : "pixelbrille"; [-1, 1].forEach(s => { const g = new Mesh(new TorusGeometry(0.12, 0.025, 8, 20), mat(farbe(id, "#7B55B8"))); setze(g, 0.2 * s, 0.02, 0.56); kopf.add(g); if (id !== "brille") kopf.add(setze(new Mesh(new CircleGeometry(0.11, 16), mat("#2A2230")), 0.2 * s, 0.02, 0.57)); }); kopf.add(setze(new Mesh(new BoxGeometry(0.12, 0.025, 0.025), mat(farbe(id, "#7B55B8"))), 0, 0.04, 0.58)); }
  if (hat("cap")) { const c = farbe("cap", "#3AA0E0"); const k = teil(new SphereGeometry(0.62, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), c); k.scale.set(1, 0.72, 1); kopf.add(setze(k, 0, 0.26, -0.02)); kopf.add(setze(teil(kugel(0.06), c), 0, 0.71, -0.02)); const sch = teil(new CylinderGeometry(0.4, 0.4, 0.05, 20, 1, false, -Math.PI / 2, Math.PI), c); sch.rotation.x = 0.12; setze(sch, 0, 0.3, 0.36); kopf.add(sch); }
  if (hat("piratenhut")) { const c = farbe("piratenhut", "#2E2B47"); const hu = teil(new ConeGeometry(0.75, 0.5, 3), c); hu.rotation.y = Math.PI; setze(hu, 0, 0.62, -0.02); kopf.add(hu); kopf.add(setze(new Mesh(kugel(0.07, 10, 8), mat("#FFFFFF")), 0, 0.66, 0.36)); }
  if (hat("schleife")) { const c = farbe("schleife", "#FF6F61"), g = new Group(); setze(g, 0.34, 0.5, 0.12); g.rotation.z = -0.4; kopf.add(g); [-1, 1].forEach(s => { const sch = teil(new ConeGeometry(0.11, 0.2, 10), c); sch.rotation.z = -s * Math.PI / 2; g.add(setze(sch, s * 0.1, 0, 0)); }); g.add(teil(kugel(0.06, 10, 8), c)); }
  if (hat("blume")) bluete(kopf, farbe("blume", "#FF9BC8"), 0.42, 0.36, 0.22, 0.075);
  if (hat("haarreif") || hat("einhorn")) {
    const id = hat("einhorn") ? "einhorn" : "haarreif", c = farbe(id, id === "einhorn" ? "#FF9BC8" : "#C2337A");
    const reif = teil(new TorusGeometry(0.64, 0.035, 8, 28, Math.PI), c, { dicke: 1.2 }); reif.rotation.y = Math.PI / 2; reif.rotation.z = 0.3; setze(reif, 0, 0.02, 0.02); kopf.add(reif);
    if (id === "haarreif") [[-0.42, 0.42], [0, 0.62], [0.42, 0.42]].forEach(([x, y], i) => bluete(kopf, ["#FF9BC8", "#FFD84D", "#9FD8FF"][i], x, y, 0.2, 0.06));
    else { const horn = teil(new ConeGeometry(0.09, 0.4, 12), "#FFF4D6"); horn.rotation.x = 0.35; setze(horn, 0, 0.78, 0.22); kopf.add(horn); [0.68, 0.78, 0.88].forEach(y => kopf.add(setze(new Mesh(new TorusGeometry(0.075 - (y - 0.68) * 0.25, 0.012, 6, 14), mat(c)), 0, y, 0.22 + (y - 0.68) * 0.35))); }
  }
  if (hat("kopfhoerer")) { const c = farbe("kopfhoerer", "#C2337A"); const b = teil(new TorusGeometry(0.66, 0.05, 8, 28, Math.PI), c); setze(b, 0, 0.02, -0.02); kopf.add(b); [-1, 1].forEach(s => { const m = teil(new CylinderGeometry(0.17, 0.17, 0.12, 16), c); m.rotation.z = Math.PI / 2; setze(m, 0.62 * s, 0.0, 0); kopf.add(m); }); }
  if (hat("ohrringe")) [-1, 1].forEach(s => kopf.add(setze(teil(kugel(0.05, 10, 8), farbe("ohrringe", "#FFC83D"), { dicke: 1.2 }), 0.57 * s, -0.2, 0.02)));
  if (hat("augenklappe")) { const c = farbe("augenklappe", "#2A2230"); kopf.add(setze(teil(new CylinderGeometry(0.13, 0.13, 0.03, 16), c, { umriss: false }), -0.2, 0.02, 0.585).rotateX(Math.PI / 2)); const band = new Mesh(new TorusGeometry(0.6, 0.015, 6, 32), mat(c)); band.rotation.set(0, Math.PI / 2, 0.45); kopf.add(band); }
  if (hat("maske")) { const c = farbe("maske", "#E0574A"); [-1, 1].forEach(s => kopf.add(setze(new Mesh(new TorusGeometry(0.12, 0.05, 8, 18), mat(c)), 0.2 * s, 0.03, 0.56))); kopf.add(setze(new Mesh(new BoxGeometry(0.14, 0.07, 0.04), mat(c)), 0, 0.05, 0.58)); const band = new Mesh(new TorusGeometry(0.59, 0.035, 6, 32), mat(c)); band.rotation.x = Math.PI / 2; setze(band, 0, 0.04, 0); kopf.add(band); }
  // ---------- Hals ----------
  if (hat("schal")) { const sc = teil(new TorusGeometry(0.24, 0.08, 10, 24), farbe("schal", "#FF6F61")); setze(sc, 0, t.hals, 0); sc.rotation.x = Math.PI / 2; koerper.add(sc); const ende = teil(new BoxGeometry(0.13, 0.32, 0.06), farbe("schal", "#FF6F61")); setze(ende, 0.1, t.hals - 0.2, 0.24); ende.rotation.z = 0.15; koerper.add(ende); }
  if (hat("kette")) { const c = farbe("kette", "#FFC83D"); const k = new Mesh(new TorusGeometry(0.2, 0.018, 6, 24), mat(c)); k.rotation.x = Math.PI / 2 - 0.5; setze(k, 0, t.hals - 0.06, 0.06); koerper.add(k); koerper.add(setze(teil(kugel(0.05, 10, 8), c, { dicke: 1.2 }), 0, t.hals - 0.2, 0.25)); }
  if (hat("fliege")) { const c = farbe("fliege", "#D7263D"); [-1, 1].forEach(s => { const f = teil(new ConeGeometry(0.08, 0.15, 4), c); f.rotation.z = -s * Math.PI / 2; koerper.add(setze(f, s * 0.08, t.hals - 0.1, 0.26)); }); koerper.add(setze(teil(kugel(0.035, 8, 6), c), 0, t.hals - 0.1, 0.27)); }
  // ---------- Hände ----------
  if (hat("armband")) { const a = new Mesh(new TorusGeometry(0.1, 0.025, 6, 18), mat(farbe("armband", "#5CCBA6"))); a.rotation.x = Math.PI / 2; setze(a, 0, t.hand + 0.12, 0); arme[0].add(a); }
  const inHand = HAND.filter(hat);
  inHand.slice(0, 2).forEach((id, i) => {
    const arm = arme[i === 0 ? 1 : 0], s = i === 0 ? 1 : -1, g = new Group(); setze(g, 0, t.hand - 0.04, 0.06); arm.add(g); g.rotation.z = -arm.rotation.z; g.scale.setScalar(t.gross || 1);   // aufrecht halten; gross = Größe passend zur Figur
    const c = farbe(id, "#C2337A");
    if (id === "tasche") { g.add(setze(teil(new BoxGeometry(0.3, 0.24, 0.12), c), 0, -0.22, 0)); const gr = new Mesh(new TorusGeometry(0.09, 0.02, 6, 14, Math.PI), mat(c)); g.add(setze(gr, 0, -0.1, 0)); }
    if (id === "teddy") { const b = farbe("teddy", "#B8804A"); g.add(setze(teil(kugel(0.13, 12, 10), b), 0.02 * s, -0.12, 0.1)); g.add(setze(teil(kugel(0.1, 12, 10), b), 0.02 * s, 0.07, 0.12)); [-1, 1].forEach(o => g.add(setze(teil(kugel(0.04, 8, 6), b), 0.02 * s + o * 0.07, 0.15, 0.1))); g.add(setze(new Mesh(kugel(0.018, 6, 5), dunkel), 0.02 * s, 0.07, 0.22)); }
    if (id === "zauberstab") { const st = teil(new CylinderGeometry(0.02, 0.02, 0.5, 8), "#3B1F63"); st.rotation.x = 0.5; g.add(setze(st, 0, 0.12, 0.1)); g.add(setze(teil(new OctahedronGeometry(0.1), farbe("zauberstab", "#FFC83D"), { dicke: 1.15 }), 0, 0.34, 0.22)); }
    if (id === "ballon") { const fa = new Mesh(new CylinderGeometry(0.006, 0.006, 1.3, 4), dunkel); g.add(setze(fa, 0, 0.65, 0)); const bl = teil(kugel(0.24, 16, 12), farbe("ballon", "#FF6F61")); bl.scale.set(1, 1.18, 1); g.add(setze(bl, 0, 1.45, 0)); g.userData.ballon = bl; }
    if (id === "fussball") { const ball = teil(kugel(0.17, 14, 10), "#FFFFFF"); g.add(setze(ball, 0, -0.14, 0.08)); [[0, 0.17, 0], [0.12, 0.05, 0.1], [-0.12, 0.05, 0.1], [0, -0.06, 0.15]].forEach(([x, y, z]) => ball.add(setze(new Mesh(kugel(0.05, 8, 6), dunkel), x, y - 0.05, z))); }
    if (id === "kuscheldino") { const d = farbe("kuscheldino", "#5CCBA6"); const k = teil(new CapsuleGeometry(0.09, 0.16, 4, 10), d); k.rotation.z = Math.PI / 2; g.add(setze(k, 0, -0.12, 0.1)); g.add(setze(teil(kugel(0.08, 10, 8), d), 0.16 * s, -0.04, 0.12)); [-0.06, 0, 0.06].forEach(x => g.add(setze(teil(new ConeGeometry(0.03, 0.07, 6), "#FFC83D", { umriss: false }), x, -0.01, 0.1))); }
    if (id === "schwert") { const kl = teil(new BoxGeometry(0.06, 0.6, 0.02), "#D9B07A"); g.add(setze(kl, 0, 0.36, 0.06)); g.add(setze(teil(new BoxGeometry(0.22, 0.04, 0.05), farbe("schwert", "#8A5A34")), 0, 0.06, 0.06)); }
  });
  // ---------- Rücken ----------
  if (hat("fluegel")) [-1, 1].forEach(s => { const fl = teil(kugel(0.45), new MeshToonMaterial({ color: farbe("fluegel", "#BDE7FF"), gradientMap: verlauf, transparent: true, opacity: 0.7 })); fl.scale.set(0.25, 1, 0.6); setze(fl, 0.32 * s, t.ruecken, -0.38); fl.rotation.z = 0.5 * s; koerper.add(fl); });
  if (hat("umhang")) { const u = teil(new CylinderGeometry(0.32, 0.6, 1.1, 20, 1, true, Math.PI * 0.6, Math.PI * 0.8), farbe("umhang", "#C2337A")); u.material = u.material.clone(); u.material.side = 2; setze(u, 0, t.umhang, 0); koerper.add(u); }
  return { hand: inHand };
}
