// Eigene Welt: erzeugt aus den Wünschen des Kindes und einer Zufallszahl (seed) ein Stück Land.
// Gespeichert werden nur Wünsche + seed (klein für den QR-Transfer); die Welt wird bei jedem Öffnen gleich neu erzeugt.
// Ohne gespeicherte Welt gilt die bisherige Insel (STANDARD) – exakt wie vorher, flach.
//
// wuensche = { biom, farbe, groesse, huegel, see, blumen, seed, name }
//   biom:    wiese | wald | berge | strand | schnee | wueste
//   farbe:   Lieblingsfarbe für Blumen und Blüten (#hex)
//   groesse: klein | mittel | gross      huegel: wenig | mittel | viel
//   see:     true/false (Teich im Land)  blumen: true/false
// Ergebnis: { insel, R, biom, farben, hoehe(x,z), plaetze{…}, baeume[], steine[], blumen[], see, pfad[] }

export const BIOME = {
  wiese:  { name: "Blumenwiese", e: "🌼", gras: "#7CCB5B", sand: "#F2D9A2", fels: "#A7A9B8", baum: "laub",  baeume: 10, steine: 4, blumen: 40, huegel: 0.9 },
  wald:   { name: "Wald",        e: "🌲", gras: "#5DB04F", sand: "#E6D3A0", fels: "#9C9EAD", baum: "misch", baeume: 30, steine: 6, blumen: 14, huegel: 1.2 },
  berge:  { name: "Berge",       e: "⛰️", gras: "#79BE5E", sand: "#D8CBB0", fels: "#9A98A6", baum: "nadel", baeume: 14, steine: 14, blumen: 12, huegel: 3.0 },
  strand: { name: "Strand",      e: "🏖️", gras: "#8FD46A", sand: "#F6E1A6", fels: "#B9B4A6", baum: "palme", baeume: 8,  steine: 4, blumen: 10, huegel: 0.45, sandRand: 4.5 },
  schnee: { name: "Schneeland",  e: "❄️", gras: "#EEF5FB", sand: "#E9EEF4", fels: "#B4BCCB", baum: "nadel", baeume: 16, steine: 8, blumen: 0,  huegel: 1.6, winter: true },
  wueste: { name: "Wüste",       e: "🌵", gras: "#EBCB86", sand: "#F2D9A2", fels: "#C99A6B", baum: "kaktus", baeume: 10, steine: 9, blumen: 6, huegel: 1.1 }
};
export const GROESSEN = { klein: 15.2, mittel: 20, gross: 25 };
export const HUEGEL = { wenig: 0.35, mittel: 1, viel: 1.8 };

// Die bisherige Insel (alle Koordinaten wie früher in heimat.js)
export const STANDARD = {
  insel: true, R: 15.2, biom: "wiese",
  hoehe: () => 0,
  plaetze: {
    start: [1, 2], tier: [2.5, 3], haus: [-5, -4.5, 0.35], station: [-1.8, -6.3, 0.3], nest: [-2.2, -6.2],
    eule: [8.5, -3, -1.2], fipsi: [-7.6, -0.6, 1.0], robo: [5.5, 8.5, -2.6], biber: [2, -8, 0.2], schild: [3.3, -8.5, 0.2],
    wissensbaum: [-3.2, 2.2], ballons: [10, 6], truhe: [-1, 13.6],
    lauf: [6, 10.2], kart: [-8.6, 8.2], bau: [11.2, -5], baer: [-3.7, 6.9, 2.6], schach: [1.5, 6.8, 3.0], buehne: [4.4, -0.8, -1.4]
  },
  baeume: [[-9, -6, 1.1], [-7.5, 3.2, 0.9], [7.5, -7, 1], [10.5, 1, 1.1], [3, -10, 0.85], [-3.5, 9.8, 0.8], [-11, -1, 0.75], [1.5, 11, 0.7], [-11.5, 6, 0.8]].map(([x, z, k], i) => ({ x, z, k, i })),
  steine: [[4.5, 3.6, 0.6], [5.2, 4.1, 0.35], [-6, 6.5, 0.5]],
  blumen: null,   // null = alte Blumen-Spirale
  see: null,
  pfad: Array.from({ length: 7 }, (_, i) => [-4 + i * 1.25, -2.6 + Math.sin(i * 0.9) * 0.6])
};

// ---------- Zufall und Rauschen (deterministisch aus dem seed) ----------
function zufall(seed) {
  let a = (seed >>> 0) || 1;
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
function rauschen(seed) {
  const hash = (x, z) => { let h = Math.imul(x, 374761393) + Math.imul(z, 668265263) + Math.imul(seed, 2147483647); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  const glatt = (t) => t * t * (3 - 2 * t);
  const wert = (x, z) => {
    const x0 = Math.floor(x), z0 = Math.floor(z), fx = glatt(x - x0), fz = glatt(z - z0);
    const a = hash(x0, z0), b = hash(x0 + 1, z0), c = hash(x0, z0 + 1), d = hash(x0 + 1, z0 + 1);
    return (a + (b - a) * fx) + ((c + (d - c) * fx) - (a + (b - a) * fx)) * fz;
  };
  return (x, z) => wert(x * 0.09, z * 0.09) * 0.62 + wert(x * 0.21 + 31, z * 0.21 + 17) * 0.28 + wert(x * 0.5 + 7, z * 0.5 + 3) * 0.1;
}
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// ---------- Erzeugen ----------
export function erzeuge(w) {
  if (!w || !BIOME[w.biom]) return STANDARD;
  const B = BIOME[w.biom], seed = (w.seed >>> 0) || 1, r = zufall(seed), n = rauschen(seed);
  const R = GROESSEN[w.groesse] || GROESSEN.mittel, amp = B.huegel * (HUEGEL[w.huegel] || 1);
  const rand = R - (B.sandRand || 2.3);               // ab hier Strand
  // Grundhöhe: Hügel, zum Rand hin flach auslaufend
  // nie unter den Meeresspiegel (nur der Teich darf tiefer liegen)
  const roh = (x, z) => Math.max(-0.12, (n(x, z) - 0.32) * 2 * amp) * (1 - smooth(rand - 4, rand, Math.hypot(x, z)));

  // Plätze: Haus, Nachbarn, Wissensbaum, Spielorte – mit Abstand zueinander
  const a0 = r() * Math.PI * 2, P = {};
  const polar = (a, d) => [Math.cos(a) * d, Math.sin(a) * d];
  P.start = [0, 0];
  P.haus = [...polar(a0, R * 0.36), 0];
  P.haus[2] = Math.atan2(-P.haus[0], -P.haus[1]);     // Tür zur Mitte
  const neben = (p, a, d) => [p[0] + Math.cos(a) * d, p[1] + Math.sin(a) * d];
  P.station = [...neben(P.haus, a0 + 1.2, 3.4), 0.3];
  P.nest = neben(P.haus, a0 + 1.55, 3.6);
  P.eule = [...polar(a0 + 1.9 + r() * 0.4, R * (0.42 + r() * 0.12)), 0];
  P.fipsi = [...polar(a0 + 3.3 + r() * 0.4, R * (0.4 + r() * 0.12)), 0];
  P.biber = [...polar(a0 + 4.6 + r() * 0.4, R * (0.42 + r() * 0.12)), 0];
  P.schild = [P.biber[0] + 1.3, P.biber[1] - 0.5, 0];
  P.robo = [...polar(a0 + 5.5, R * 0.55), 0];
  P.baer = [...polar(a0 + 1.3, R * 0.46), 0];
  P.schach = [...polar(a0 + 2.8, R * 0.3), 0];
  P.buehne = [...polar(a0 - 0.5, R * 0.38), 0];
  P.wissensbaum = polar(a0 + 0.9, 3.6);
  P.ballons = polar(a0 + 2.6 + r() * 0.5, R * 0.62);
  P.truhe = polar(a0 + Math.PI + (r() - 0.5), R - 1.6);
  P.lauf = polar(a0 + 0.25 + r() * 0.3, R * 0.62);
  P.kart = polar(a0 + 3.95 + r() * 0.2, R * 0.68);
  P.bau = polar(a0 + 5.6 + r() * 0.2, R * 0.66);
  P.tier = [1.5, 1];
  ["eule", "fipsi", "biber", "schild", "robo", "baer", "schach", "buehne"].forEach(k => { P[k][2] = Math.atan2(-P[k][0], -P[k][1]); });   // schauen zur Mitte

  // flache Flächen um die Plätze (Höhe = Rauschen in der Mitte des Platzes)
  const flach = [[P.start, 3.2], [P.haus, 3.2], [P.station, 1.2], [P.nest, 1], [P.eule, 1.6], [P.fipsi, 1.6], [P.biber, 2.4], [P.wissensbaum, 1.6], [P.ballons, 1.6], [P.tier, 1], [P.lauf, 1.8], [P.kart, 1.8], [P.bau, 1.8], [P.baer, 1.6], [P.schach, 1.8], [P.buehne, 1.8]]
    .map(([p, rad]) => ({ x: p[0], z: p[1], r: rad, h: roh(p[0], p[1]) }));

  // Teich (Wunsch): nicht auf Plätzen
  let see = null;
  if (w.see) for (let v = 0; v < 40 && !see; v++) {
    const [x, z] = polar(r() * Math.PI * 2, R * (0.35 + r() * 0.3)), rad = 2 + r() * 1.2;
    if (flach.every(f => Math.hypot(f.x - x, f.z - z) > f.r + rad + 2) && Math.hypot(x, z) + rad < rand - 1.5) see = { x, z, r: rad };
  }

  const hoehe = (x, z) => {
    let h = roh(x, z), gew = 0, ziel = 0;
    for (const f of flach) { const g = 1 - smooth(f.r, f.r + 2.6, Math.hypot(x - f.x, z - f.z)); if (g > gew) { gew = g; ziel = f.h; } }
    h = h + (ziel - h) * gew;
    if (see) { const d = Math.hypot(x - see.x, z - see.z); h -= 0.9 * (1 - smooth(see.r - 0.6, see.r + 1.2, d)); }
    return h;
  };

  // Pfad vom Haus zur Mitte
  const pfad = [];
  for (let i = 1; i < 7; i++) { const t = i / 7; pfad.push([P.haus[0] * (1 - t) + Math.sin(i * 0.9) * 0.4, P.haus[1] * (1 - t) + Math.cos(i * 1.1) * 0.4]); }

  const frei = (x, z, abst) => Math.hypot(x, z) < rand - 1.2 && flach.every(f => Math.hypot(f.x - x, f.z - z) > f.r + abst) &&
    (!see || Math.hypot(x - see.x, z - see.z) > see.r + 1.2) && pfad.every(([px, pz]) => Math.hypot(px - x, pz - z) > 1.2);
  const streue = (anzahl, abst, minR = 3) => {
    const aus = [];
    for (let v = 0; v < anzahl * 20 && aus.length < anzahl; v++) {
      const [x, z] = polar(r() * Math.PI * 2, minR + Math.sqrt(r()) * (rand - minR));
      if (frei(x, z, abst) && aus.every(o => Math.hypot(o[0] - x, o[1] - z) > abst * 1.6)) aus.push([x, z]);
    }
    return aus;
  };
  const faktor = (R / 15.2) ** 2;   // größere Welt, mehr Bäume
  const baeume = streue(Math.round(B.baeume * faktor), 1.1).map(([x, z], i) => ({ x, z, k: 0.7 + r() * 0.5, i, typ: B.baum === "misch" ? (r() < 0.5 ? "nadel" : "laub") : B.baum }));
  const steine = streue(Math.round(B.steine * faktor), 0.8).map(([x, z]) => [x, z, 0.3 + r() * 0.45]);
  const blumen = w.blumen === false ? [] : streue(Math.round(B.blumen * faktor * (w.blumen ? 1.4 : 1)), 0.25, 2.5).map(([x, z], i) => [x, z, i]);

  return { insel: false, R, rand, biom: w.biom, B, farbe: w.farbe || "#FF6F91", hoehe, plaetze: P, baeume, steine, blumen, see, pfad };
}

// Vorschlag für den Wünsche-Assistenten
export const FARBEN = [["#FF6F91", "Rosa"], ["#B28DFF", "Lila"], ["#5EC3E6", "Blau"], ["#FFD84D", "Gelb"], ["#FF9E5E", "Orange"], ["#E0574A", "Rot"], ["#FFFFFF", "Weiß"]];
export const neuerSeed = () => (Math.random() * 4294967295) >>> 0;
