// Schach-Regeln und eine freundliche KI (ohne Rochade und en passant – für Grundschulkinder vereinfacht; Bauern werden zur Dame).
// Brett: 64 Felder, Index = Reihe * 8 + Spalte, Reihe 0 = oben (Schwarz). Figuren: "PNBRQK" Weiß, "pnbrqk" Schwarz, "." leer.
(function (wurzel) {
  const WEISS = "w", SCHWARZ = "b";
  const farbe = (f) => f === "." ? null : f === f.toUpperCase() ? WEISS : SCHWARZ;
  const gegner = (c) => c === WEISS ? SCHWARZ : WEISS;
  const feld = (name) => (8 - +name[1]) * 8 + (name.charCodeAt(0) - 97);
  const name = (i) => String.fromCharCode(97 + i % 8) + (8 - Math.floor(i / 8));
  // Aufstellung aus einer Liste wie "wKg1 wRa1 bKg8 bPf7"
  function aufstellen(text) { const b = Array(64).fill("."); text.trim().split(/\s+/).forEach(t => { const f = t[0] === "w" ? t[1] : t[1].toLowerCase(); b[feld(t.slice(2))] = f; }); return b; }
  const START = "bRa8 bNb8 bBc8 bQd8 bKe8 bBf8 bNg8 bRh8 bPa7 bPb7 bPc7 bPd7 bPe7 bPf7 bPg7 bPh7 wPa2 wPb2 wPc2 wPd2 wPe2 wPf2 wPg2 wPh2 wRa1 wNb1 wBc1 wQd1 wKe1 wBf1 wNg1 wRh1";

  const SCHRITTE = { N: [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]], K: [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]] };
  const LINIEN = { B: [[-1, -1], [-1, 1], [1, -1], [1, 1]], R: [[-1, 0], [1, 0], [0, -1], [0, 1]] };
  LINIEN.Q = LINIEN.B.concat(LINIEN.R);
  // Pseudo-legale Züge einer Figur (ohne auf Schach zu achten)
  function zuegeVon(b, i) {
    const f = b[i], c = farbe(f); if (!c) return [];
    const t = f.toUpperCase(), r = Math.floor(i / 8), s = i % 8, aus = [];
    const ziel = (rr, ss) => rr >= 0 && rr < 8 && ss >= 0 && ss < 8 ? rr * 8 + ss : -1;
    if (t === "P") {
      const d = c === WEISS ? -1 : 1, start = c === WEISS ? 6 : 1;
      const v = ziel(r + d, s); if (v >= 0 && b[v] === ".") { aus.push(v); const v2 = ziel(r + 2 * d, s); if (r === start && b[v2] === ".") aus.push(v2); }
      [-1, 1].forEach(ds => { const z = ziel(r + d, s + ds); if (z >= 0 && b[z] !== "." && farbe(b[z]) !== c) aus.push(z); });
    } else if (SCHRITTE[t]) {
      SCHRITTE[t].forEach(([dr, ds]) => { const z = ziel(r + dr, s + ds); if (z >= 0 && farbe(b[z]) !== c) aus.push(z); });
    } else {
      LINIEN[t].forEach(([dr, ds]) => { let rr = r + dr, ss = s + ds; while (ziel(rr, ss) >= 0) { const z = rr * 8 + ss; if (b[z] === ".") aus.push(z); else { if (farbe(b[z]) !== c) aus.push(z); break; } rr += dr; ss += ds; } });
    }
    return aus.map(z => ({ von: i, nach: z }));
  }
  function ziehe(b, z) { const n = b.slice(); let f = n[z.von]; n[z.von] = "."; const r = Math.floor(z.nach / 8); if (f === "P" && r === 0) f = "Q"; if (f === "p" && r === 7) f = "q"; n[z.nach] = f; return n; }
  function angegriffen(b, i, von) {
    for (let k = 0; k < 64; k++) {
      if (farbe(b[k]) !== von) continue;
      if (b[k].toUpperCase() === "P") { const d = von === WEISS ? -1 : 1; if (Math.floor(i / 8) === Math.floor(k / 8) + d && Math.abs(i % 8 - k % 8) === 1) return true; continue; }
      if (zuegeVon(b, k).some(z => z.nach === i)) return true;
    }
    return false;
  }
  const koenig = (b, c) => b.indexOf(c === WEISS ? "K" : "k");
  function imSchach(b, c) { const k = koenig(b, c); return k >= 0 && angegriffen(b, k, gegner(c)); }
  // Legale Züge (ohne eigenen König im Schach). Ohne König (Lern-Aufgaben) sind alle Züge erlaubt.
  function zuege(b, c) {
    const aus = [];
    for (let i = 0; i < 64; i++) if (farbe(b[i]) === c) zuegeVon(b, i).forEach(z => { if (koenig(b, c) < 0 || !imSchach(ziehe(b, z), c)) aus.push(z); });
    return aus;
  }
  function stand(b, c) {   // "matt", "patt", "remis" (nur Könige) oder null
    const l = zuege(b, c);
    if (!l.length) return imSchach(b, c) ? "matt" : "patt";
    if (b.every(f => f === "." || f.toUpperCase() === "K")) return "remis";
    return null;
  }

  // ---------- Freundliche KI ----------
  const WERT = { P: 100, N: 300, B: 310, R: 500, Q: 900, K: 0 };
  function bewerte(b) {   // aus Sicht von Weiß
    let w = 0;
    for (let i = 0; i < 64; i++) { const f = b[i]; if (f === ".") continue; const t = f.toUpperCase(), r = Math.floor(i / 8), s = i % 8;
      let v = WERT[t] + (t === "N" || t === "B" ? 12 - (Math.abs(3.5 - r) + Math.abs(3.5 - s)) * 3 : 0) + (t === "P" ? (farbe(f) === WEISS ? 6 - r : r - 1) * 6 : 0);
      w += farbe(f) === WEISS ? v : -v; }
    return w;
  }
  function suche(b, c, tiefe, a, be) {
    const l = zuege(b, c);
    if (!l.length) return imSchach(b, c) ? (c === WEISS ? -99999 - tiefe : 99999 + tiefe) : 0;
    if (tiefe === 0) return bewerte(b);
    l.sort((x, y) => (b[y.nach] !== "." ? 1 : 0) - (b[x.nach] !== "." ? 1 : 0));
    if (c === WEISS) { let m = -Infinity; for (const z of l) { m = Math.max(m, suche(ziehe(b, z), SCHWARZ, tiefe - 1, a, be)); a = Math.max(a, m); if (a >= be) break; } return m; }
    let m = Infinity; for (const z of l) { m = Math.min(m, suche(ziehe(b, z), WEISS, tiefe - 1, a, be)); be = Math.min(be, m); if (a >= be) break; } return m;
  }
  // Stufe 1: oft zufällig (schlägt aber gern), Stufe 2: denkt 2 Halbzüge, Stufe 3: denkt 3 Halbzüge
  function kiZug(b, c, stufe) {
    const l = zuege(b, c); if (!l.length) return null;
    if (stufe <= 1 && Math.random() < 0.6) { const schlag = l.filter(z => b[z.nach] !== "."); const w = schlag.length && Math.random() < 0.6 ? schlag : l; return w[Math.floor(Math.random() * w.length)]; }
    const tiefe = stufe <= 1 ? 1 : stufe === 2 ? 2 : 3;
    let best = [], bw = c === WEISS ? -Infinity : Infinity;
    for (const z of l) { const w = suche(ziehe(b, z), gegner(c), tiefe - 1, -Infinity, Infinity) + Math.random() * 8;
      if (c === WEISS ? w > bw : w < bw) { bw = w; best = [z]; } }
    return best[0];
  }
  const API = { WEISS, SCHWARZ, farbe, gegner, feld, name, aufstellen, START, zuegeVon, zuege, ziehe, imSchach, stand, kiZug, bewerte };
  if (typeof module !== "undefined") module.exports = API; else wurzel.Schach = API;
})(typeof window !== "undefined" ? window : this);
