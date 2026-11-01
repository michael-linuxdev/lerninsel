// Haustiere: Zeichnungen für Eier und Tiere (Hund, Kätzchen, Drache; je 3 Farben, 3 Wachstumsstufen).
// 02.11.2026 (Wunsch des Auftraggebers): Der Fuchs sah aus wie Fipsi – an seiner Stelle gibt es den Hund. Hund und Katze sind
// realistischer gezeichnet (sitzend, mit Schnauze, echten Proportionen): Welpe → Junghund → Hund, Kätzchen → junge Katze → Katze;
// der Drache wächst vom Schlüpfling (mit Eierschale) über den Jungdrachen (kleine Hörner und Flügel) zum großen Drachen (langer Hals,
// große Flügel, Rückenzacken). Normale Augen statt Kulleraugen; Katze und Drache mit Schlitzpupille. Alte Füchse werden zu Hunden.
// Koordinaten: 300 x 300, Boden bei y = 270.
(function () {
  const D = "#3b1f63";
  const sw = `stroke="${D}" stroke-width="4" stroke-linejoin="round"`;
  const REGENBOGEN = ["#FF6F61", "#FFA94D", "#FFD84D", "#7ED957", "#4FA8F0", "#9B6BE0"];

  const ARTEN = {
    drache: { name: "Drache", ei: "feuer", stufen: ["Schlüpfling", "Jungdrache", "Drache"], farben: [
      { name: "Grün", h: "#7ED957", l: "#DDF7CC", d: "#3E8E2E" }, { name: "Lila", h: "#B58CF0", l: "#EFE4FF", d: "#6B3FB8" }, { name: "Blau", h: "#6FC2F2", l: "#DFF3FF", d: "#2C6FA6" }] },
    hund: { name: "Hund", ei: "wald", stufen: ["Welpe", "Junghund", "Hund"], farben: [
      { name: "Goldbraun", h: "#D9A35B", l: "#F6E3C4", d: "#8C5A2B" }, { name: "Schwarz-weiß", h: "#3A3442", l: "#F7F4EF", d: "#1E1A24", blesse: true }, { name: "Hellbraun", h: "#B98252", l: "#EED9BE", d: "#6B4425", flecken: true }] },
    katze: { name: "Kätzchen", ei: "kuschel", stufen: ["Kätzchen", "junge Katze", "Katze"], farben: [
      { name: "Grau getigert", h: "#A9AEBB", l: "#EEF0F4", d: "#5E6372", streifen: true }, { name: "Rot getigert", h: "#EE9E55", l: "#FFF1E0", d: "#B0601F", streifen: true }, { name: "Creme", h: "#F1DFC2", l: "#FFFAF2", d: "#B89770" }] }
  };
  Object.defineProperty(ARTEN, "fuchs", { value: ARTEN.hund, enumerable: false });   // alte Spielstände (vor 02.11.2026)
  const EIER = {
    feuer: { name: "Feuer-Ei", art: "drache", a: "#FFB36B", b: "#E8463B" },
    wald: { name: "Pfoten-Ei", art: "hund", a: "#F3E3C6", b: "#A8693A" },
    kuschel: { name: "Kuschel-Ei", art: "katze", a: "#FFE0EC", b: "#E0457B" }
  };
  const STUFEN = ["Baby", "Kind", "Groß"];
  const stufenName = (art, st) => ((ARTEN[art] || {}).stufen || STUFEN)[Math.max(0, Math.min(2, st))];
  const ZUBEHOER = [
    { id: "schleife", name: "Schleife", preis: 2 }, { id: "brille", name: "Brille", preis: 2 },
    { id: "halstuch", name: "Halstuch", preis: 2 }, { id: "hut", name: "Partyhut", preis: 3 }, { id: "krone", name: "Krone", preis: 4 }
  ];

  // ---------- Bausteine ----------
  const ellipse = (x, y, rx, ry, fill, extra = "") => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${sw} ${extra}/>`;
  const pfad = (d, fill, extra = "") => `<path d="${d}" fill="${fill}" ${sw} ${extra}/>`;
  const linie = (d, farbe = D, w = 3, extra = "") => `<path d="${d}" stroke="${farbe}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  // dicker Strich mit Kontur (Schwanz, Hals)
  const strang = (d, farbe, w) => linie(d, D, w + 8) + linie(d, farbe, w);
  // Vorderbein als runde Säule mit Pfote und Zehen
  // Vorderbein: oben etwas breiter und ohne Kante (geht in den Körper über), unten Pfote mit Zehen
  const bein = (x, oben, unten, b, farbe, pfote = farbe) => {
    const o = b * 0.68, u = b / 2;
    return `<path d="M${x - o} ${oben} Q${x - u - 2} ${(oben + unten) / 2} ${x - u} ${unten - 4} L${x + u} ${unten - 4} Q${x + u + 2} ${(oben + unten) / 2} ${x + o} ${oben} Z" fill="${farbe}"/>` +
      linie(`M${x - o} ${oben} Q${x - u - 2} ${(oben + unten) / 2} ${x - u} ${unten - 4} M${x + o} ${oben} Q${x + u + 2} ${(oben + unten) / 2} ${x + u} ${unten - 4}`, D, 4) +
      ellipse(x, unten, b * 0.64, b * 0.36, pfote) + linie(`M${x - b * 0.2} ${unten - b * 0.12} l0 ${b * 0.28} M${x + b * 0.2} ${unten - b * 0.12} l0 ${b * 0.28}`, D, 2.5);
  };
  // Hals: verbindet Kopf und Körper (liegt hinter beiden)
  const hals = (k, bx, oben, breite, farbe) => pfad(`M${k.x - k.r * 0.42} ${k.y + k.r * 0.4} L${bx - breite} ${oben} L${bx + breite} ${oben} L${k.x + k.r * 0.42} ${k.y + k.r * 0.4} Z`, farbe);

  // ---------- Gesicht ----------
  // a = { y, dx, r, iris, schlitz }, m = { x, y } (Mund unter der Nase)
  function gesicht(k, a, m, ausdruck) {
    const xs = [k.x - a.dx, k.x + a.dx];
    let augen, mund = "", extra = "";
    if (ausdruck === "lacht" || ausdruck === "schlaeft") {
      const auf = ausdruck === "lacht" ? -1 : 1;
      augen = xs.map(x => linie(`M${x - a.r * 1.1} ${a.y} Q${x} ${a.y + auf * a.r * 1.1} ${x + a.r * 1.1} ${a.y}`, D, 4)).join("");
      if (ausdruck === "lacht") mund = `<path d="M${m.x - 10} ${m.y} Q${m.x} ${m.y + 16} ${m.x + 10} ${m.y} Z" fill="#C2405A" stroke="${D}" stroke-width="3" stroke-linejoin="round"/>`;
      else extra = `<text x="${k.x + k.r * 0.9}" y="${k.y - k.r * 0.7}" font-size="28" font-weight="700" fill="${D}" font-family="Fredoka, sans-serif">z</text><text x="${k.x + k.r * 1.2}" y="${k.y - k.r * 1.05}" font-size="20" font-weight="700" fill="${D}" font-family="Fredoka, sans-serif">z</text>`;
    } else {
      // normale Augen: Iris mit Pupille (rund oder als Schlitz), kleiner Glanzpunkt, kein großer weißer Augapfel
      augen = `<g class="augen">` + xs.map(x => `<ellipse cx="${x}" cy="${a.y}" rx="${a.r}" ry="${a.r * (a.schlitz ? 0.8 : 0.92)}" fill="${a.iris}" stroke="${D}" stroke-width="2.5"/>` +
        (a.schlitz ? `<ellipse cx="${x}" cy="${a.y}" rx="${a.r * 0.22}" ry="${a.r * 0.72}" fill="${D}"/>` : `<circle cx="${x}" cy="${a.y}" r="${a.r * 0.55}" fill="${D}"/>`) +
        `<circle cx="${x + a.r * 0.3}" cy="${a.y - a.r * 0.35}" r="${a.r * 0.22}" fill="#fff"/>`).join("") + `</g>`;
      if (ausdruck === "traurig") extra = xs.map((x, i) => linie(`M${x - a.r * 1.2 * (i ? -1 : 1)} ${a.y - a.r * 1.5} L${x + a.r * 0.9 * (i ? -1 : 1)} ${a.y - a.r * 2.1}`, D, 3.5)).join("");
    }
    return augen + mund + extra;
  }

  // ---------- Hund (sitzend, von vorn) ----------
  function hund(st, f) {
    const M = [
      { hr: 54, hy: 132, bw: 44, bh: 42, by: 226, b: 24, ohr: 1.0, mz: 0.5 },   // Welpe: großer Kopf, kurze Beine, große Schlappohren
      { hr: 46, hy: 108, bw: 52, bh: 58, by: 208, b: 26, ohr: 0.85, mz: 0.6 },  // Junghund: längere Beine, Schnauze wächst
      { hr: 42, hy: 86, bw: 58, bh: 74, by: 194, b: 28, ohr: 0.7, mz: 0.72 }    // Hund: lange Beine, kräftige Brust, lange Schnauze
    ][Math.max(0, Math.min(2, st))];
    const k = { x: 150, y: M.hy, r: M.hr }, bx = 150;
    const schwanz = strang(`M${bx + M.bw * 0.7} ${M.by + M.bh * 0.55} Q${bx + M.bw * 1.6} ${M.by + M.bh * 0.4} ${bx + M.bw * 1.5} ${M.by - M.bh * 0.3}`, f.h, 12 + st * 3) +
      (f.blesse ? linie(`M${bx + M.bw * 1.52} ${M.by - M.bh * 0.12} L${bx + M.bw * 1.5} ${M.by - M.bh * 0.3}`, f.l, 12 + st * 3) : "");
    const keulen = [-1, 1].map(s => ellipse(bx + s * M.bw * 0.78, 250, M.bw * 0.42, 22, f.h)).join("");
    const rumpf = ellipse(bx, M.by, M.bw, M.bh, f.h) + ellipse(bx, M.by - M.bh * 0.12, M.bw * 0.5, M.bh * 0.62, f.l, 'stroke="none"') +
      (f.flecken ? `<ellipse cx="${bx + M.bw * 0.55}" cy="${M.by + M.bh * 0.1}" rx="${M.bw * 0.28}" ry="${M.bh * 0.25}" fill="${f.d}" opacity=".55"/>` : "");
    const beine = [-1, 1].map(s => bein(bx + s * M.bw * 0.4, M.by + M.bh * 0.1, 262, M.b, f.h, f.blesse ? f.l : f.h)).join("");
    // Ohren: Welpe große Schlappohren, später kleiner und höher angesetzt
    const ohren = [-1, 1].map(s => pfad(`M${k.x + s * k.r * 0.55} ${k.y - k.r * 0.75} Q${k.x + s * k.r * (1.25 * M.ohr + 0.15)} ${k.y - k.r * 0.7} ${k.x + s * k.r * (1.05 * M.ohr + 0.2)} ${k.y + k.r * 0.55 * M.ohr} Q${k.x + s * k.r * 0.85} ${k.y + k.r * 0.6 * M.ohr} ${k.x + s * k.r * 0.72} ${k.y - k.r * 0.1} Z`, f.d)).join("");
    const kopf = ellipse(k.x, k.y, k.r, k.r * 0.9, f.h) +
      (f.blesse ? pfad(`M${k.x - 6} ${k.y - k.r * 0.88} Q${k.x} ${k.y - k.r * 0.95} ${k.x + 6} ${k.y - k.r * 0.88} L${k.x + k.r * 0.18} ${k.y + k.r * 0.1} L${k.x - k.r * 0.18} ${k.y + k.r * 0.1} Z`, f.l, 'stroke="none"') : "") +
      ellipse(k.x, k.y + k.r * 0.42, k.r * M.mz * 0.82, k.r * (0.32 + M.mz * 0.12), f.l) +
      pfad(`M${k.x - k.r * 0.17} ${k.y + k.r * 0.24} Q${k.x} ${k.y + k.r * 0.16} ${k.x + k.r * 0.17} ${k.y + k.r * 0.24} Q${k.x + k.r * 0.12} ${k.y + k.r * 0.4} ${k.x} ${k.y + k.r * 0.42} Q${k.x - k.r * 0.12} ${k.y + k.r * 0.4} ${k.x - k.r * 0.17} ${k.y + k.r * 0.24} Z`, D, 'stroke-width="2"') +
      linie(`M${k.x} ${k.y + k.r * 0.42} L${k.x} ${k.y + k.r * 0.52} M${k.x - k.r * 0.2} ${k.y + k.r * 0.58} Q${k.x - k.r * 0.08} ${k.y + k.r * 0.62} ${k.x} ${k.y + k.r * 0.52} Q${k.x + k.r * 0.08} ${k.y + k.r * 0.62} ${k.x + k.r * 0.2} ${k.y + k.r * 0.58}`, D, 3);
    return { hinten: schwanz + keulen, koerper: hals(k, bx, M.by - M.bh * 0.55, M.bw * 0.5, f.h) + rumpf + beine, kopfHinten: "", kopf: kopf + ohren, k,
      auge: { y: k.y - k.r * 0.08, dx: k.r * 0.38, r: k.r * 0.12, iris: "#6B3E1E" }, mund: { x: k.x, y: k.y + k.r * 0.6 } };
  }

  // ---------- Katze (sitzend, Schwanz um die Pfoten) ----------
  function katze(st, f) {
    const M = [
      { hr: 54, hy: 134, bw: 40, bh: 42, by: 228, b: 20, ohr: 0.7 },   // Kätzchen: großer Kopf, riesige Ohren
      { hr: 45, hy: 112, bw: 44, bh: 58, by: 210, b: 21, ohr: 0.6 },
      { hr: 40, hy: 92, bw: 48, bh: 72, by: 196, b: 22, ohr: 0.52 }    // Katze: schlank, langer Körper, kleinerer Kopf
    ][Math.max(0, Math.min(2, st))];
    const k = { x: 150, y: M.hy, r: M.hr }, bx = 150;
    const streifen = (x, y, w, n, dy) => f.streifen ? Array.from({ length: n }, (_, i) => linie(`M${x - w} ${y + i * dy} Q${x} ${y + i * dy + 6} ${x + w} ${y + i * dy}`, f.d, 4, 'opacity=".55"')).join("") : "";
    const keulen = [-1, 1].map(s => ellipse(bx + s * M.bw * 0.72, 252, M.bw * 0.4, 20, f.h)).join("");
    const rumpf = ellipse(bx, M.by, M.bw, M.bh, f.h) + ellipse(bx, M.by - M.bh * 0.05, M.bw * 0.45, M.bh * 0.62, f.l, 'stroke="none"') +
      (f.streifen ? [-1, 1].map(s => streifen(bx + s * M.bw * 0.72, M.by - M.bh * 0.3, M.bw * 0.18, 3, M.bh * 0.25)).join("") : "");
    const beine = [-1, 1].map(s => bein(bx + s * M.bw * 0.36, M.by + M.bh * 0.12, 263, M.b, f.h, f.l)).join("");
    // Schwanz liegt vorn um die Pfoten
    const schwanz = strang(`M${bx + M.bw * 0.8} ${M.by + M.bh * 0.65} Q${bx + M.bw * 1.4} 270 ${bx + M.bw * 0.2} 272 Q${bx - M.bw * 0.6} 274 ${bx - M.bw * 0.9} 262`, f.h, 11 + st * 2) +
      (f.streifen ? linie(`M${bx - M.bw * 0.5} 266 l0 10 M${bx - M.bw * 0.1} 266 l0 10`, f.d, 4, 'opacity=".55"') : "");
    const ohren = [-1, 1].map(s => pfad(`M${k.x + s * k.r * 0.9} ${k.y - k.r * 0.2} L${k.x + s * k.r * 0.78} ${k.y - k.r * (0.75 + M.ohr * 1.1)} L${k.x + s * k.r * 0.22} ${k.y - k.r * 0.78} Z`, f.h) +
      `<path d="M${k.x + s * k.r * 0.74} ${k.y - k.r * 0.4} L${k.x + s * k.r * 0.72} ${k.y - k.r * (0.7 + M.ohr * 0.95)} L${k.x + s * k.r * 0.38} ${k.y - k.r * 0.72} Z" fill="#F2B8C4" opacity=".8"/>`).join("");
    const bart = [-1, 1].map(s => linie(`M${k.x + s * k.r * 0.32} ${k.y + k.r * 0.38} l${s * k.r * 0.75} ${-k.r * 0.1} M${k.x + s * k.r * 0.32} ${k.y + k.r * 0.46} l${s * k.r * 0.78} ${k.r * 0.08}`, D, 2, 'opacity=".55"')).join("");
    const kopf = ellipse(k.x, k.y, k.r * 1.06, k.r * 0.9, f.h) + streifen(k.x, k.y - k.r * 0.78, k.r * 0.22, 3, k.r * 0.13) +
      ellipse(k.x - k.r * 0.17, k.y + k.r * 0.42, k.r * 0.22, k.r * 0.17, f.l, 'stroke="none"') + ellipse(k.x + k.r * 0.17, k.y + k.r * 0.42, k.r * 0.22, k.r * 0.17, f.l, 'stroke="none"') +
      `<path d="M${k.x - k.r * 0.1} ${k.y + k.r * 0.24} L${k.x + k.r * 0.1} ${k.y + k.r * 0.24} L${k.x} ${k.y + k.r * 0.34} Z" fill="#E88A9C" stroke="${D}" stroke-width="2" stroke-linejoin="round"/>` +
      linie(`M${k.x} ${k.y + k.r * 0.34} L${k.x} ${k.y + k.r * 0.42} M${k.x - k.r * 0.16} ${k.y + k.r * 0.48} Q${k.x - k.r * 0.06} ${k.y + k.r * 0.52} ${k.x} ${k.y + k.r * 0.42} Q${k.x + k.r * 0.06} ${k.y + k.r * 0.52} ${k.x + k.r * 0.16} ${k.y + k.r * 0.48}`, D, 2.5) + bart;
    return { hinten: keulen, koerper: hals(k, bx, M.by - M.bh * 0.55, M.bw * 0.45, f.h) + rumpf + beine + schwanz, kopfHinten: ohren, kopf, k,
      auge: { y: k.y - k.r * 0.05, dx: k.r * 0.4, r: k.r * 0.15, iris: f.streifen && f.h === "#A9AEBB" ? "#8CC63F" : "#E8B23A", schlitz: true }, mund: { x: k.x, y: k.y + k.r * 0.5 } };
  }

  // ---------- Drache ----------
  function drache(st, f) {
    const M = [
      { hr: 52, hy: 140, bw: 48, bh: 44, by: 226 },   // Schlüpfling: sitzt noch in der Eierschale
      { hr: 44, hy: 108, bw: 54, bh: 58, by: 206 },   // Jungdrache: kleine Hörner und Flügel, erste Zacken
      { hr: 40, hy: 84, bw: 62, bh: 70, by: 198 }     // Drache: langer Hals, große Flügel, Rückenzacken, Schwanz mit Spitze
    ][Math.max(0, Math.min(2, st))];
    const k = { x: 150, y: M.hy, r: M.hr }, bx = 150;
    const w = [0.35, 0.8, 1.12][st];
    const fluegel = [-1, 1].map(s => {
      const ax = bx + s * M.bw * 0.45, ay = M.by - M.bh * 0.55;
      return pfad(`M${ax} ${ay} Q${ax + s * 50 * w} ${ay - 70 * w} ${ax + s * 95 * w} ${ay - 40 * w} L${ax + s * 80 * w} ${ay + 5 * w} Q${ax + s * 66 * w} ${ay - 8 * w} ${ax + s * 58 * w} ${ay + 20 * w} Q${ax + s * 44 * w} ${ay + 4 * w} ${ax + s * 30 * w} ${ay + 36 * w} Z`, f.d) +
        (st ? linie(`M${ax} ${ay} L${ax + s * 80 * w} ${ay + 5 * w} M${ax} ${ay} L${ax + s * 58 * w} ${ay + 20 * w}`, f.l, 2.5, 'opacity=".6"') : "");
    }).join("");
    const spitze = st === 2 ? pfad(`M${bx + M.bw * 1.9} ${M.by - M.bh * 0.55} l18 -14 l-4 22 Z`, f.d) : "";
    const schwanz = strang(`M${bx + M.bw * 0.6} ${M.by + M.bh * 0.5} Q${bx + M.bw * 1.6} ${M.by + M.bh * 0.8} ${bx + M.bw * (1.5 + st * 0.2)} ${M.by - M.bh * (0.1 + st * 0.22)}`, f.h, 14 + st * 3) + spitze;
    const zacken = st ? Array.from({ length: 2 + st * 2 }, (_, i) => {
      const y = M.by - M.bh * 0.9 + i * 14; return pfad(`M${bx + M.bw * 0.55 + i * 3} ${y} l12 -6 l-4 12 Z`, f.l);
    }).join("") : "";
    const keulen = [-1, 1].map(s => ellipse(bx + s * M.bw * 0.78, 250, M.bw * 0.4, 22, f.h)).join("");
    const rumpf = ellipse(bx, M.by, M.bw, M.bh, f.h) + ellipse(bx, M.by + M.bh * 0.1, M.bw * 0.55, M.bh * 0.72, f.l) +
      Array.from({ length: 3 + st }, (_, i) => linie(`M${bx - M.bw * 0.45} ${M.by - M.bh * 0.4 + i * M.bh * 0.3} Q${bx} ${M.by - M.bh * 0.32 + i * M.bh * 0.3} ${bx + M.bw * 0.45} ${M.by - M.bh * 0.4 + i * M.bh * 0.3}`, f.d, 2.5, 'opacity=".45"')).join("");
    const beine = [-1, 1].map(s => bein(bx + s * M.bw * 0.4, M.by + M.bh * 0.1, 262, 22 + st * 3, f.h) + linie(`M${bx + s * M.bw * 0.34 - 8} 270 l-2 5 M${bx + s * M.bw * 0.34} 271 l0 5 M${bx + s * M.bw * 0.34 + 8} 270 l2 5`, "#fff", 3)).join("");
    // Schlüpfling: untere Eierschale mit Zackenrand
    const schale = st === 0 ? pfad(`M${bx - 74} 226 L${bx - 58} 212 L${bx - 42} 228 L${bx - 22} 210 L${bx} 228 L${bx + 22} 210 L${bx + 42} 228 L${bx + 58} 212 L${bx + 74} 226 Q${bx + 78} 272 ${bx} 274 Q${bx - 78} 272 ${bx - 74} 226 Z`, "#FFE2B8") +
      [[bx - 40, 250], [bx + 30, 244], [bx + 2, 262]].map(([x, y]) => `<path d="M${x - 10} ${y} q-8 -14 4 -20 q0 10 8 12 q2 -10 -2 -16 q16 12 8 26 Z" fill="#E8463B" opacity=".75"/>`).join("") : "";
    // Hals (Jungdrache kurz, großer Drache lang)
    const halsLang = st ? strang(`M${bx} ${M.by - M.bh * 0.6} Q${bx - 6} ${(M.by - M.bh * 0.6 + k.y) / 2} ${bx} ${k.y + k.r * 0.5}`, f.h, 30 + st * 4) +
      linie(`M${bx} ${M.by - M.bh * 0.62} Q${bx - 6} ${(M.by - M.bh * 0.6 + k.y) / 2} ${bx} ${k.y + k.r * 0.6}`, f.l, 14) : "";
    const hoerner = st ? [-1, 1].map(s => pfad(`M${k.x + s * k.r * 0.35} ${k.y - k.r * 0.78} Q${k.x + s * k.r * 0.6} ${k.y - k.r * (1.2 + st * 0.25)} ${k.x + s * k.r * (0.9 + st * 0.15)} ${k.y - k.r * (1.25 + st * 0.3)} Q${k.x + s * k.r * 0.75} ${k.y - k.r * 0.9} ${k.x + s * k.r * 0.68} ${k.y - k.r * 0.62} Z`, "#FFE7A8")).join("")
      : [-1, 1].map(s => ellipse(k.x + s * k.r * 0.4, k.y - k.r * 0.82, 6, 5, "#FFE7A8")).join("");
    const kamm = st ? Array.from({ length: 2 + st }, (_, i) => pfad(`M${k.x - 8 + i * 0} ${k.y - k.r * (0.9 - i * 0.02) + i * 0} l8 ${-12 - st * 3} l8 ${12 + st * 3} Z`, f.l, `transform="translate(${(i - (1 + st) / 2) * 14} 0)"`)).join("") : "";
    const kopf = ellipse(k.x, k.y, k.r, k.r * 0.88, f.h) +
      ellipse(k.x, k.y + k.r * 0.44, k.r * (0.5 + st * 0.06), k.r * 0.32, f.l) +
      `<ellipse cx="${k.x - k.r * 0.16}" cy="${k.y + k.r * 0.36}" rx="3" ry="2.4" fill="${D}"/><ellipse cx="${k.x + k.r * 0.16}" cy="${k.y + k.r * 0.36}" rx="3" ry="2.4" fill="${D}"/>` +
      linie(`M${k.x - k.r * 0.3} ${k.y + k.r * 0.56} Q${k.x} ${k.y + k.r * 0.66} ${k.x + k.r * 0.3} ${k.y + k.r * 0.56}`, D, 3);
    return { hinten: fluegel + schwanz + zacken + keulen, koerper: (st ? "" : hals(k, bx, M.by - M.bh * 0.5, M.bw * 0.45, f.h)) + rumpf + beine + schale + halsLang, kopfHinten: hoerner + kamm, kopf, k,
      auge: { y: k.y - k.r * 0.1, dx: k.r * 0.4, r: k.r * 0.15, iris: "#F2C230", schlitz: true }, mund: { x: k.x, y: k.y + k.r * 0.58 } };
  }

  function masse(stufe) {
    return [
      { k: { x: 150, y: 132, r: 64 }, b: { x: 150, y: 222, rx: 50, ry: 44 } },
      { k: { x: 150, y: 112, r: 57 }, b: { x: 150, y: 206, rx: 66, ry: 56 } },
      { k: { x: 150, y: 96, r: 53 }, b: { x: 150, y: 194, rx: 80, ry: 66 } }
    ][Math.max(0, Math.min(2, stufe))];
  }
  const fuesse = (b, f) => [-1, 1].map(s => ellipse(b.x + s * b.rx * 0.45, 262, b.rx * 0.32, 12, f)).join("");
  function einhorn(st, f) {
    const { k, b } = masse(st);   // (altes Einhorn, nur noch für sehr alte Spielstände)
    const maehne = (i) => f.d === "regenbogen" ? REGENBOGEN[i % REGENBOGEN.length] : (i % 2 ? f.d : "#FFC1DD");
    const schweif = [0, 1, 2, 3].map(i => pfad(`M${b.x + b.rx * 0.75} ${b.y - b.ry * 0.1 + i * 6} Q${b.x + b.rx * 1.5} ${b.y - b.ry * 0.6 + i * 18} ${b.x + b.rx * 1.25} ${b.y + b.ry * 0.5 + i * 10}`, "none", `stroke="${maehne(i)}" stroke-width="12" stroke-linecap="round"`)).join("");
    const koerper = ellipse(b.x, b.y, b.rx, b.ry, f.h) + ellipse(b.x, b.y + b.ry * 0.22, b.rx * 0.55, b.ry * 0.55, f.l) +
      fuesse(b, f.h) + [-1, 1].map(s => `<ellipse cx="${b.x + s * b.rx * 0.45}" cy="268" rx="${b.rx * 0.26}" ry="6" fill="#C9A4F5"/>`).join("");
    const maehneHinten = [0, 1, 2, 3, 4].map(i => `<circle cx="${k.x - k.r * 0.75 + i * 6}" cy="${k.y - k.r * 0.55 + i * k.r * 0.32}" r="${k.r * 0.3}" fill="${maehne(i)}" ${sw}/>`).join("");
    const ohren = [-1, 1].map(s => pfad(`M${k.x + s * k.r * 0.45} ${k.y - k.r * 0.72} L${k.x + s * k.r * 0.62} ${k.y - k.r * 1.12} L${k.x + s * k.r * 0.82} ${k.y - k.r * 0.5} Z`, f.h)).join("");
    const lang = k.r * (0.55 + st * 0.18);
    const horn = pfad(`M${k.x - 9} ${k.y - k.r * 0.82} L${k.x} ${k.y - k.r * 0.82 - lang} L${k.x + 9} ${k.y - k.r * 0.82} Z`, "#FFD84D") +
      `<path d="M${k.x - 6} ${k.y - k.r * 0.82 - lang * 0.3} L${k.x + 6} ${k.y - k.r * 0.82 - lang * 0.4} M${k.x - 4} ${k.y - k.r * 0.82 - lang * 0.6} L${k.x + 4} ${k.y - k.r * 0.82 - lang * 0.68}" stroke="${D}" stroke-width="2.5"/>`;
    const kopf = ellipse(k.x, k.y, k.r, k.r * 0.95, f.h) + ellipse(k.x, k.y + k.r * 0.42, k.r * 0.42, k.r * 0.28, f.l) +
      `<ellipse cx="${k.x - 9}" cy="${k.y + k.r * 0.38}" rx="3" ry="2.5" fill="${D}" opacity=".5"/><ellipse cx="${k.x + 9}" cy="${k.y + k.r * 0.38}" rx="3" ry="2.5" fill="${D}" opacity=".5"/>` +
      [0, 1, 2].map(i => `<circle cx="${k.x - k.r * 0.25 + i * k.r * 0.22}" cy="${k.y - k.r * 0.78 + i * 3}" r="${k.r * 0.17}" fill="${maehne(i + 1)}" ${sw}/>`).join("") + horn;
    return { hinten: schweif, koerper, kopfHinten: maehneHinten + ohren, kopf, k, auge: { y: k.y + k.r * 0.05, dx: k.r * 0.38, r: k.r * 0.13, iris: "#7A4FC2" }, mund: { x: k.x, y: k.y + k.r * 0.5 } };
  }

  const ZEICHNER = { drache, einhorn, hund, katze, fuchs: hund };

  // ---------- Zubehör ----------
  function zubehoerTeil(id, t) {
    const k = t.k, r = k.r, a = t.auge;
    switch (id) {
      case "schleife": return pfad(`M${k.x + r * 0.62} ${k.y - r * 0.78} l-26 -16 l2 32 Z`, "#FF6F61") + pfad(`M${k.x + r * 0.62} ${k.y - r * 0.78} l26 -16 l-2 32 Z`, "#FF6F61") + `<circle cx="${k.x + r * 0.62}" cy="${k.y - r * 0.78}" r="7" fill="#D7263D" ${sw}/>`;
      case "brille": return [-1, 1].map(s => `<circle cx="${k.x + s * a.dx}" cy="${a.y}" r="${a.r * 2}" fill="#fff" fill-opacity=".25" stroke="#7B55B8" stroke-width="5"/>`).join("") + `<path d="M${k.x - a.dx + a.r * 2} ${a.y} Q${k.x} ${a.y - 6} ${k.x + a.dx - a.r * 2} ${a.y}" stroke="#7B55B8" stroke-width="4" fill="none"/>`;
      case "halstuch": return pfad(`M${k.x - r * 0.7} ${k.y + r * 0.78} Q${k.x} ${k.y + r * 1.0} ${k.x + r * 0.7} ${k.y + r * 0.78} L${k.x} ${k.y + r * 1.45} Z`, "#3AA0E0") + `<circle cx="${k.x - 8}" cy="${k.y + r * 1.0}" r="4" fill="#fff"/><circle cx="${k.x + 12}" cy="${k.y + r * 1.12}" r="4" fill="#fff"/>`;
      case "hut": return `<g transform="rotate(18 ${k.x + r * 0.45} ${k.y - r * 0.85})">` + pfad(`M${k.x + r * 0.45 - 26} ${k.y - r * 0.8} L${k.x + r * 0.45} ${k.y - r * 0.8 - 70} L${k.x + r * 0.45 + 26} ${k.y - r * 0.8} Z`, "#FFD84D") +
        `<path d="M${k.x + r * 0.45 - 18} ${k.y - r * 0.8 - 20} L${k.x + r * 0.45 + 18} ${k.y - r * 0.8 - 20} M${k.x + r * 0.45 - 10} ${k.y - r * 0.8 - 44} L${k.x + r * 0.45 + 10} ${k.y - r * 0.8 - 44}" stroke="#E0457B" stroke-width="6"/>` + `<circle cx="${k.x + r * 0.45}" cy="${k.y - r * 0.8 - 72}" r="9" fill="#E0457B" ${sw}/></g>`;
      case "krone": return pfad(`M${k.x - r * 0.55} ${k.y - r * 0.72} L${k.x - r * 0.6} ${k.y - r * 1.18} L${k.x - r * 0.3} ${k.y - r * 0.95} L${k.x} ${k.y - r * 1.3} L${k.x + r * 0.3} ${k.y - r * 0.95} L${k.x + r * 0.6} ${k.y - r * 1.18} L${k.x + r * 0.55} ${k.y - r * 0.72} Z`, "#FFC83D") + `<circle cx="${k.x}" cy="${k.y - r * 0.88}" r="6" fill="#E8336B"/>`;
    }
    return "";
  }

  // ---------- Öffentlich ----------
  function zeichneTier({ art, farbe = 0, stufe = 0, ausdruck = "froh", zubehoer = {} }) {
    if (art === "fuchs" || !ZEICHNER[art]) art = "hund";
    const A = ARTEN[art], f = A.farben[farbe] || A.farben[0];
    const t = ZEICHNER[art](stufe, f);
    const zu = Object.keys(zubehoer).filter(z => zubehoer[z]);
    const hinten = zu.filter(z => z === "halstuch").map(z => zubehoerTeil(z, t)).join("");
    const vorne = zu.filter(z => z !== "halstuch").map(z => zubehoerTeil(z, t)).join("");
    return `<ellipse cx="150" cy="272" rx="${70 + stufe * 18}" ry="10" fill="#000" opacity=".12"/>` +
      `<g class="tier-koerper">${t.hinten}${t.koerper}</g>${hinten}<g class="tier-kopf">${t.kopfHinten}${t.kopf}${gesicht(t.k, t.auge, t.mund, ausdruck)}${vorne}</g>`;
  }

  function zeichneEi(typ, risse = 0) {
    const e = EIER[typ] || EIER.wald, id = "ei" + typ + Math.random().toString(36).slice(2, 6);
    const form = "M150 48 C206 48 236 140 236 190 C236 240 198 268 150 268 C102 268 64 240 64 190 C64 140 94 48 150 48 Z";
    let muster = "";
    if (typ === "feuer") muster = [0, 1, 2].map(i => `<path d="M${90 + i * 60} 240 q-12 -40 10 -64 q-2 26 14 30 q6 -20 -4 -40 q34 26 20 74 Z" fill="${e.b}" opacity=".85"/>`).join("");
    if (typ === "regenbogen") muster = REGENBOGEN.map((c, i) => `<rect x="40" y="${118 + i * 20}" width="220" height="12" fill="${c}"/>`).join("");
    if (typ === "wald") muster = [[110, 120], [186, 150], [124, 212], [190, 228]].map(([x, y]) => `<ellipse cx="${x}" cy="${y + 6}" rx="11" ry="9" fill="${e.b}"/>` + [-12, -4, 4, 12].map((d, i) => `<circle cx="${x + d}" cy="${y - 8 - (i % 3 ? 4 : 0)}" r="4.5" fill="${e.b}"/>`).join("")).join("");   // Pfotenabdrücke
    if (typ === "kuschel") muster = [[115, 120], [185, 135], [150, 190], [100, 210], [200, 220]].map(([x, y]) => `<path d="M${x} ${y + 12} l-14 -14 a8 8 0 0 1 14 -10 a8 8 0 0 1 14 10 z" fill="${e.b}"/>`).join("");
    const risseD = ["", "M120 130 l14 14 l-10 10 l16 12", "M120 130 l14 14 l-10 10 l16 12 M180 160 l-12 12 l12 10 l-10 14", "M70 170 l20 -6 l14 12 l18 -10 l16 12 l20 -12 l18 10 l18 -8 l20 6"][Math.min(3, risse)];
    return `<defs><clipPath id="${id}"><path d="${form}"/></clipPath></defs><ellipse cx="150" cy="272" rx="80" ry="10" fill="#000" opacity=".12"/>` +
      `<path d="${form}" fill="${e.a}"/><g clip-path="url(#${id})">${muster}<ellipse cx="118" cy="100" rx="18" ry="30" fill="#fff" opacity=".5" transform="rotate(20 118 100)"/></g>` +
      `<path d="${form}" fill="none" ${sw}/>` + (risseD ? `<path d="${risseD}" stroke="${D}" stroke-width="4" fill="none" stroke-linejoin="round"/>` : "");
  }

  window.Tiere = { ARTEN, EIER, STUFEN, stufenName, ZUBEHOER, zeichneTier, zeichneEi };
})();
