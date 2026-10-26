// Die eigene Figur (Look aus dem Kleiderschrank) als 3D-Modell für die Minispiele.
// Kopie von figur() aus heimat.js mit eigenen Helfern (gleicher Stil B: Toon-Licht, Konturen).
// TODO: heimat.js auf dieses Modul umstellen, damit es nur eine Figur gibt.
import { Group, Mesh, MeshToonMaterial, MeshBasicMaterial, BackSide, SphereGeometry, CylinderGeometry, ConeGeometry, BoxGeometry, CapsuleGeometry,
  LatheGeometry, TorusGeometry, Vector2, DataTexture, RedFormat, NearestFilter, CircleGeometry } from "../three/three.module.js";

const EINFACH = (() => { try { const e = (window.Spielwelt.lade("eltern") || {}).insel; return e ? e.grafik === "einfach" : localStorage.getItem("lerninsel.grafik") === "einfach"; } catch (e) { return false; } })();
export const verlauf = new DataTexture(new Uint8Array([110, 190, 255]), 3, 1, RedFormat);
verlauf.minFilter = verlauf.magFilter = NearestFilter; verlauf.needsUpdate = true;
const mats = new Map();
export const mat = (f) => { if (!mats.has(f)) mats.set(f, new MeshToonMaterial({ color: f, gradientMap: verlauf })); return mats.get(f); };
const UMRISS = new MeshBasicMaterial({ color: "#4A3558", side: BackSide });
export function teil(geo, farbe, { umriss = true, dicke = 1.06, schatten = true } = {}) {
  const m = new Mesh(geo, typeof farbe === "string" ? mat(farbe) : farbe);
  m.castShadow = schatten; m.receiveShadow = true;
  if (umriss) { const u = new Mesh(geo, UMRISS); u.scale.setScalar(dicke); m.add(u); }
  return m;
}
export const kugel = (r, a = 28, b = 20) => new SphereGeometry(r, EINFACH ? Math.ceil(a / 2) : a, EINFACH ? Math.ceil(b / 2) : b);
export const setze = (o, x, y, z) => { o.position.set(x, y, z); return o; };
const AUGE = new MeshBasicMaterial({ color: "#2E2240" }), WEISS = new MeshBasicMaterial({ color: "#ffffff" });
function augen(eltern, abstand, y, z, r = 0.075) {
  [-1, 1].forEach(s => {
    const a = new Mesh(kugel(r, 14, 10), AUGE); a.scale.set(1, 1.35, 0.6); setze(a, abstand * s, y, z); eltern.add(a);
    a.add(setze(new Mesh(kugel(r * 0.4, 8, 6), WEISS), r * 0.33, r * 0.4, r * 0.8));
  });
}

const LANG = ["lang", "wellen", "locken"], KURZ = ["bob", "kurz"], HOSEN = ["hose", "jeans", "jogging", "leggings"];
function figur(look) {
  const f = new Group(), haut = look.figur.farbe, haarF = (look.haare && look.haare.farbe) || "#8A5A34", haarId = (look.haare && look.haare.id) || "lang";
  const koerper = new Group(); f.add(koerper);
  const kleid = look.kleid, oben = kleid ? kleid.farbe : (look.oberteil ? look.oberteil.farbe : "#FF9BC8");
  const unterId = kleid ? "kleid" : (look.unterteil ? look.unterteil.id : "rock"), unten = kleid ? kleid.farbe : (look.unterteil ? look.unterteil.farbe : "#7B55B8");
  const schuhF = (look.schuhe && look.schuhe.farbe) || "#FFFFFF";
  const ohneBeine = kleid && kleid.id === "meerjungfrau", langesKleid = kleid && ["ball", "fee", "meerjungfrau"].includes(kleid.id);
  const hose = HOSEN.includes(unterId), shorts = unterId === "shorts";
  // Unterteil
  if (!hose && !shorts) {
    const lang = langesKleid ? 0.5 : 0;
    const profil = [new Vector2(0.01, -lang), new Vector2(0.52 + lang * 0.25, -lang), new Vector2(0.48 + lang * 0.2, 0.15 - lang * 0.5), new Vector2(0.34, 0.55), new Vector2(0.28, 0.8), new Vector2(0.01, 0.85)];
    koerper.add(setze(teil(new LatheGeometry(profil, 28), unten), 0, 0.42, 0));
  } else {
    koerper.add(setze(teil(new CylinderGeometry(0.3, 0.33, 0.32, 20), unten), 0, 0.88, 0));
  }
  // Oberkörper
  koerper.add(setze(teil(kugel(0.3, 20, 14), oben), 0, 1.15, 0));
  // Beine
  const beine = [-0.15, 0.15].map(x => {
    const b = new Group(); b.position.set(x, 0.48, 0);
    if (!ohneBeine) {
      b.add(setze(teil(new CapsuleGeometry(0.09, 0.3, 4, 12), haut), 0, -0.22, 0));
      if (hose || shorts) { const h = teil(new CapsuleGeometry(0.11, shorts ? 0.16 : 0.5, 4, 12), unten); setze(h, 0, shorts ? 0.2 : 0.0, 0); b.add(h); }
      b.add(setze(teil(kugel(0.13), schuhF, { dicke: 1.12 }), 0, -0.42, 0.05));
    }
    koerper.add(b); return b;
  });
  // Arme
  const arme = [-1, 1].map(s => {
    const a = new Group(); a.position.set(0.33 * s, 1.22, 0);
    a.add(setze(teil(new CapsuleGeometry(0.08, 0.32, 4, 12), oben), 0, -0.2, 0));
    a.add(setze(teil(kugel(0.09), haut, { dicke: 1.12 }), 0, -0.44, 0));
    a.rotation.z = 0.25 * s; koerper.add(a); return a;
  });
  // Kopf und Frisur
  const kopf = new Group(); kopf.position.y = 1.85; koerper.add(kopf);
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
  // Gesicht
  augen(kopf, 0.2, 0.02, 0.53);
  [-1, 1].forEach(s => { const w = new Mesh(new CircleGeometry(0.09, 16), new MeshBasicMaterial({ color: "#FF9FB2", transparent: true, opacity: 0.6 })); setze(w, 0.33 * s, -0.12, 0.49); w.rotation.y = 0.5 * s; kopf.add(w); });
  const mund = new Mesh(new TorusGeometry(0.07, 0.018, 6, 12, Math.PI), AUGE); mund.rotation.z = Math.PI; setze(mund, 0, -0.15, 0.55); kopf.add(mund);
  // Extras aus dem Kleiderschrank (eine Auswahl in 3D)
  const ex = look.extras || {}, hat = (id) => ex[id];
  const farbe = (id, std) => (ex[id] && ex[id].farbe) || std;
  if (hat("krone") || hat("rechenkrone")) { const id = hat("krone") ? "krone" : "rechenkrone"; const k = teil(new CylinderGeometry(0.28, 0.26, 0.2, 16, 1, true), farbe(id, "#FFC83D")); setze(k, 0, 0.66, 0); kopf.add(k); for (let i = 0; i < 5; i++) { const z = teil(new ConeGeometry(0.06, 0.16, 8), farbe(id, "#FFC83D"), { dicke: 1.1 }); const a = i / 5 * Math.PI * 2; setze(z, Math.cos(a) * 0.27, 0.82, Math.sin(a) * 0.27); kopf.add(z); } }
  if (hat("muetze") || hat("weihnachtsmuetze")) { const id = hat("muetze") ? "muetze" : "weihnachtsmuetze"; const m = teil(new ConeGeometry(0.5, 0.75, 24), farbe(id, "#D7263D")); setze(m, 0, 0.78, -0.05); m.rotation.x = -0.25; kopf.add(m); const rand = teil(new TorusGeometry(0.47, 0.09, 10, 28), "#FFFFFF"); setze(rand, 0, 0.44, -0.02); rand.rotation.x = Math.PI / 2 - 0.25; kopf.add(rand); kopf.add(setze(teil(kugel(0.12), "#FFFFFF"), 0, 1.15, -0.25)); }
  if (hat("hut") || hat("entdeckerhut")) { const id = hat("hut") ? "hut" : "entdeckerhut"; kopf.add(setze(teil(new CylinderGeometry(0.85, 0.85, 0.05, 28), farbe(id, "#FFE27A")), 0, 0.45, 0)); kopf.add(setze(teil(new SphereGeometry(0.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), farbe(id, "#FFE27A")), 0, 0.45, 0)); }
  if (hat("katzenohren") || hat("fuchsohren")) { const id = hat("katzenohren") ? "katzenohren" : "fuchsohren"; [-1, 1].forEach(s => { const o = teil(new ConeGeometry(0.16, 0.32, 12), farbe(id, "#F28C38")); setze(o, 0.33 * s, 0.6, -0.05); o.rotation.z = -0.35 * s; kopf.add(o); }); }
  if (hat("brille") || hat("sonnenbrille") || hat("pixelbrille")) { const id = hat("brille") ? "brille" : hat("sonnenbrille") ? "sonnenbrille" : "pixelbrille"; [-1, 1].forEach(s => { const g = new Mesh(new TorusGeometry(0.12, 0.025, 8, 20), mat(farbe(id, "#7B55B8"))); setze(g, 0.2 * s, 0.02, 0.56); kopf.add(g); if (id !== "brille") kopf.add(setze(new Mesh(new CircleGeometry(0.11, 16), mat("#2A2230")), 0.2 * s, 0.02, 0.57)); }); }
  if (hat("schleife")) [-1, 1].forEach(s => kopf.add(setze(teil(kugel(0.13), farbe("schleife", "#FF6F9F")), 0.18 * s + 0.35, 0.5, 0.1)));
  if (hat("fluegel")) [-1, 1].forEach(s => { const fl = teil(kugel(0.45), new MeshToonMaterial({ color: farbe("fluegel", "#BDE7FF"), gradientMap: verlauf, transparent: true, opacity: 0.7 })); fl.scale.set(0.25, 1, 0.6); setze(fl, 0.32 * s, 1.35, -0.38); fl.rotation.z = 0.5 * s; koerper.add(fl); });
  if (hat("umhang")) { const u = teil(new CylinderGeometry(0.32, 0.6, 1.1, 20, 1, true, Math.PI * 0.6, Math.PI * 0.8), farbe("umhang", "#C2337A")); u.material = u.material.clone(); u.material.side = 2; setze(u, 0, 0.85, 0); koerper.add(u); }
  if (hat("schal")) { const sc = teil(new TorusGeometry(0.24, 0.08, 10, 24), farbe("schal", "#FF6F61")); setze(sc, 0, 1.38, 0); sc.rotation.x = Math.PI / 2; koerper.add(sc); }
  f.userData = { koerper, beine, arme, kopf };
  return f;
}

// Look des Kindes (oder Standard-Figur)
export function meineFigur() {
  const S = window.Spielwelt, look = (S.lade("anziehen") || {}).aktuell || (window.Figur ? window.Figur.STANDARD() : { figur: { farbe: "#F8D2B8" } });
  return figur(look);
}
export { figur };
