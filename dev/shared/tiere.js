// Haustiere: Zeichnungen für Eier und Tiere (Hund, Kätzchen, Drache; je 3 Farben, 3 Wachstumsstufen).
// 02.11.2026 (Wunsch des Auftraggebers): Der Fuchs sah aus wie Fipsi – an seiner Stelle gibt es den Hund. Hund und Katze sind
// realistischer gezeichnet (sitzend, mit Schnauze, echten Proportionen): Welpe → Junghund → Hund, Kätzchen → junge Katze → Katze;
// der Drache wächst vom Schlüpfling (mit Eierschale) über den Jungdrachen (kleine Hörner und Flügel) zum großen Drachen (langer Hals,
// große Flügel, Rückenzacken). Normale Augen statt Kulleraugen; Katze und Drache mit Schlitzpupille. Alte Füchse werden zu Hunden.
// Koordinaten: 300 x 300, Boden bei y = 270.
// 03.11.2026: neue Zeichnung (Dreiviertelansicht, Kinderbuch-Qualität, Entwurf A) ist Standard; zeichneTier({ …, stil: "alt" }) bzw.
// eltern.zeichnung = "alt" zeigt die Zeichnung vom 02.11.2026.
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

  // =====================================================================================================
  // Neue Zeichnung (03.11.2026, Wahl des Auftraggebers: Entwurf A „dunkle Kontur“): Dreiviertelansicht, Fläche + Schatten- + Lichtstufe,
  // Kontur obendrauf. Die alte Zeichnung bleibt über den Eltern-Schalter „Zeichnungen wie bis 02.11.2026“ (eltern.zeichnung = "alt").
  // =====================================================================================================
  const NEU = (function () {
  let nr = 0;
  const FARBEN_NEU = {
    hund: [{ name: "Goldbraun", h: "#DDA75F", s: "#B87B38", t: "#96602A", l: "#F7E4C2", d: "#8A552A", o: "#6B4220", nase: "#2C2230" },
      { name: "Schwarz-weiß", h: "#3C3646", s: "#28232F", t: "#1B1820", l: "#F6F2EA", d: "#25212B", o: "#141118", nase: "#141118", blesse: true },
      { name: "Hellbraun gefleckt", h: "#F2E6D4", s: "#D9C6AA", t: "#BFA786", l: "#FFFBF4", d: "#9A6538", o: "#6E4A2C", nase: "#3A2A26", flecken: "#A86E3E" }],
    katze: [{ name: "Grau getigert", h: "#A9AFBD", s: "#878D9C", t: "#6B7080", l: "#F1F2F6", d: "#5A5F6E", o: "#454A57", nase: "#E58A9A", streifen: "#626877", iris: "#9CC64A" },
      { name: "Rot getigert", h: "#F0A35A", s: "#D27F36", t: "#B0632A", l: "#FFF1DF", d: "#A9561F", o: "#7E4019", nase: "#E58A8A", streifen: "#C2672A", iris: "#E2B53A" },
      { name: "Creme", h: "#F3E2C6", s: "#DCC49F", t: "#C4A87F", l: "#FFFBF3", d: "#B8956A", o: "#8A6D4A", nase: "#E9A0A8", iris: "#6AA8D8" }],
    drache: [{ name: "Grün", h: "#78CF5A", s: "#55A93E", t: "#3E8A2D", l: "#E6F7C9", d: "#2F7A33", o: "#235C27", bauch: "#F4E7A6", fl: "#9FE07E", iris: "#F2B630" },
      { name: "Lila", h: "#AE86EC", s: "#8C64D2", t: "#6E48B6", l: "#F0E6FF", d: "#5A35A0", o: "#45277E", bauch: "#FFE3B0", fl: "#D2B8FA", iris: "#F2B630" },
      { name: "Blau", h: "#62B9EE", s: "#3F95D2", t: "#2C76B2", l: "#DFF3FF", d: "#22609A", o: "#184A78", bauch: "#FFEBB5", fl: "#A9DBFA", iris: "#F28A30" }]
  };

  // ---------- Werkzeug ----------
  function werkzeug(stil, f, ausdruck = "froh") {
    const KF = stil === "a" ? "#3B1F63" : f.o, KW = stil === "a" ? 3.4 : 2;
    const id = () => "te" + (++nr);
    const ns = 'vector-effect="non-scaling-stroke"';
    // Fläche: Grundton, darin zugeschnitten Schatten-/Lichtformen, Kontur obendrauf
    const flaeche = (d, fill, innen = "", { kontur = true, kw = KW } = {}) => {
      if (!innen) return `<path d="${d}" fill="${fill}" ${kontur ? `stroke="${KF}" stroke-width="${kw}" stroke-linejoin="round" ${ns}` : ""}/>`;
      const c = id();
      return `<clipPath id="${c}"><path d="${d}"/></clipPath><path d="${d}" fill="${fill}"/><g clip-path="url(#${c})">${innen}</g>` +
        (kontur ? `<path d="${d}" fill="none" stroke="${KF}" stroke-width="${kw}" stroke-linejoin="round" ${ns}/>` : "");
    };
    const form = (d, fill, op = 1) => `<path d="${d}" fill="${fill}"${op < 1 ? ` opacity="${op}"` : ""}/>`;
    const strich = (d, farbe = KF, w = KW, op = 1) => `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${ns}${op < 1 ? ` opacity="${op}"` : ""}/>`;
    // Auge in Dreiviertelansicht: dunkel, mit Iris (optional), Lichtpunkt; breite < 1 = hinteres Auge (schmaler)
    const auge = (x, y, r, { iris, schlitz, breite = 1, lid = true } = {}) => {
      const rx = r * breite;
      // Ausdrücke: lacht = fröhlich zugekniffen (Bogen nach oben), schläft = Lid zu (Bogen nach unten), traurig = schräge Braue
      if (ausdruck === "lacht" || ausdruck === "schlaeft") {
        const auf = ausdruck === "lacht" ? -1 : 1;
        return `<path d="M${x - rx * 1.1} ${y} Q${x} ${y + auf * r * 1.2} ${x + rx * 1.1} ${y}" fill="none" stroke="${KF}" stroke-width="${KW * 1.1}" stroke-linecap="round" ${ns}/>`;
      }
      let s = `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${r}" fill="${iris || "#2A1E2E"}" stroke="${KF}" stroke-width="${KW * 0.7}" ${ns}/>`;
      if (iris) s += schlitz ? `<ellipse cx="${x}" cy="${y}" rx="${r * 0.22 * breite}" ry="${r * 0.8}" fill="#1B1420"/>` : `<circle cx="${x}" cy="${y}" r="${r * 0.55}" fill="#1B1420"/>`;
      s += `<circle cx="${x - rx * 0.32}" cy="${y - r * 0.38}" r="${r * 0.3}" fill="#fff"/><circle cx="${x + rx * 0.3}" cy="${y + r * 0.35}" r="${r * 0.12}" fill="#fff" opacity=".8"/>`;
      if (lid) s += strich(`M${x - rx * 1.1} ${y - r * 0.75} Q${x} ${y - r * 1.35} ${x + rx * 1.1} ${y - r * 0.8}`, KF, KW * 0.8);
      if (ausdruck === "traurig") s += strich(`M${x - rx * 1.2} ${y - r * 1.5} L${x + rx * 1.1} ${y - r * 2.1}`, KF, KW);
      return s;
    };
    return { KF, KW, id, flaeche, form, strich, auge, ns, ausdruck };
  }
  const um = (x, y, sx, sy = sx, inhalt) => `<g transform="translate(${x} ${y}) scale(${sx} ${sy})">${inhalt}</g>`;
  const schatten = (rx) => `<ellipse cx="150" cy="270" rx="${rx}" ry="9" fill="#3B1F63" opacity=".13"/>`;

  // =====================================================================================================
  // Hund: sitzend, Dreiviertelansicht nach links, Schlappohren
  // =====================================================================================================
  function hund(st, stil, f, aus = "froh", zu = {}) {
    const T = werkzeug(stil, f, aus), { flaeche, form, strich, auge } = T;
    // Stufen: Kopf, Beinlänge, Pfoten, Schnauze, Rumpf
    const S = [{ kopf: 1.32, rumpf: 0.74, breit: 1.04, pfote: 1.3, schnauze: 0.62, kx: 138, ky: 150, ohr: 1.05 },
      { kopf: 1.12, rumpf: 0.88, breit: 1.0, pfote: 1.12, schnauze: 0.82, kx: 136, ky: 118, ohr: 1.05 },
      { kopf: 1.0, rumpf: 1.0, breit: 0.96, pfote: 1.0, schnauze: 1.0, kx: 134, ky: 96, ohr: 1.0 }][st];
    const fleck = (d) => (f.flecken ? form(d, f.flecken) : "");
    // ---- Rumpf (Ursprung: Boden-Mitte 160/268, nach oben negativ) ----
    const RUMPF = "M-40 -138 C-62 -122 -70 -86 -60 -52 C-54 -30 -50 -14 -48 0 L24 0 C44 -30 52 -70 42 -104 C34 -132 14 -152 -10 -154 C-24 -154 -34 -148 -40 -138 Z";
    const KEULE = "M-12 0 C-22 -48 4 -96 44 -94 C84 -92 96 -38 80 0 Z";
    const SCHWANZ = "M64 -4 C92 -2 112 -14 114 -40 C115 -50 106 -52 103 -44 C100 -26 88 -18 62 -18 Z";
    const rumpf =
      flaeche(SCHWANZ, f.h, form("M66 -12 C90 -10 106 -18 110 -32 L118 -30 L116 0 L60 0 Z", f.s) + (f.blesse ? form("M100 -44 C104 -50 112 -50 114 -44 L114 -36 L102 -36 Z", f.l) : "")) +
      // hinteres Vorderbein (dunkler)
      flaeche("M-40 -70 C-44 -40 -44 -18 -42 -6 L-24 -6 C-24 -24 -22 -48 -18 -70 Z", f.s, form("M-30 -70 L-18 -70 L-24 -6 L-30 -6 Z", f.t, 0.5)) +
      flaeche(KEULE, f.h, form("M20 0 C30 -26 56 -40 82 -36 L90 0 Z", f.s) + form("M4 -50 C14 -70 34 -78 52 -76 C36 -70 22 -60 14 -44 Z", f.l, 0.55) + fleck("M30 -66 C44 -72 60 -66 62 -54 C58 -44 40 -44 32 -52 Z")) +
      strich("M8 -36 C16 -46 26 -50 36 -50", T.KF, T.KW * 0.6, 0.5) +
      flaeche(RUMPF, f.h,
        form("M10 -150 C40 -130 46 -80 30 -40 L18 0 L60 0 L60 -160 Z", f.s) +          // Schattenseite hinten
        form("M-58 -126 C-70 -100 -66 -62 -50 -34 C-42 -56 -34 -96 -22 -140 C-36 -140 -50 -134 -58 -126 Z", f.l) +   // helle Brust (Latz)
        fleck("M0 -120 C14 -126 28 -116 26 -100 C20 -90 4 -92 0 -104 Z") +
        form("M-14 -150 C-2 -128 -2 -110 -8 -96 C-20 -110 -24 -132 -14 -150 Z", f.s, 0.55)) +   // Schatten unter dem Kopf
      // Fellbüschel an der Brust
      strich("M-44 -112 C-46 -96 -46 -84 -44 -74 M-36 -120 C-38 -104 -38 -92 -36 -84", f.t, 1.6, 0.4) +
      // Hinterpfote
      flaeche("M30 -2 C30 -14 48 -18 66 -14 C78 -10 80 0 72 2 L34 2 C30 2 30 0 30 -2 Z", f.blesse ? f.l : f.h, form("M30 -4 L82 -4 L82 4 L30 4 Z", f.blesse ? "#DDD6CB" : f.s, 0.6)) +
      strich("M52 -12 l0 10 M62 -12 l0 10", T.KF, T.KW * 0.6);
    // vorderes Vorderbein mit Pfote (Länge hängt am Rumpf, Pfotengröße an der Stufe)
    // Vorderbein: oben offen (geht ins Brustfell über), leicht nach vorn gestellt, Ellbogen-Schatten
    const bein = (x, farbe) =>
      flaeche(`M${x - 12} -112 C${x - 18} -80 ${x - 16} -40 ${x - 12} -8 L${x + 11} -8 C${x + 12} -40 ${x + 16} -76 ${x + 16} -112 Z`, farbe,
        form(`M${x + 4} -112 L${x + 18} -112 L${x + 12} -6 L${x + 5} -6 C${x + 6} -40 ${x + 8} -80 ${x + 4} -112 Z`, f.s, 0.75) +
        form(`M${x - 13} -60 C${x - 14} -40 ${x - 13} -24 ${x - 11} -8 L${x - 6} -8 C${x - 8} -26 ${x - 8} -44 ${x - 7} -60 Z`, f.l, 0.5), { kontur: false }) +
      strich(`M${x - 16} -80 C${x - 16} -50 ${x - 14} -28 ${x - 12} -8 M${x + 13} -84 C${x + 13} -50 ${x + 12} -30 ${x + 11} -8`) +
      strich(`M${x + 6} -70 C${x + 8} -60 ${x + 8} -52 ${x + 6} -46`, f.t, 1.5, 0.5);
    const pfote = (x, farbe) => um(x, -4, S.pfote, S.pfote,
      flaeche("M-16 4 C-18 -6 -10 -12 0 -12 C12 -12 18 -6 16 4 Z", farbe, form("M-18 -1 L18 -1 L18 6 L-18 6 Z", f.blesse ? "#DDD6CB" : f.s, 0.7)) +
      strich("M-5 -6 l0 8 M5 -6 l0 8", T.KF, T.KW * 0.6));
    const vorne = bein(-36, f.blesse ? f.l : f.h) + pfote(-36, f.blesse ? f.l : f.h);
    const koerper = um(160, 268, S.breit, S.rumpf, rumpf + vorne);
    const hinterePfote = um(160 - 22 * S.breit, 268, 1, 1, pfote(0, f.s));

    // ---- Kopf (Ursprung Kopfmitte) ----
    const OHR_HINTEN = "M-30 -30 C-48 -34 -60 -14 -58 12 C-56 30 -48 40 -40 36 C-34 24 -30 0 -24 -20 Z";
    const SCHAEDEL = "M-40 -4 C-44 -36 -20 -56 8 -56 C36 -56 54 -36 52 -8 C50 18 36 38 12 42 C-6 44 -24 38 -32 26 Z";
    const SCHNAUZE = "M-24 2 C-44 -2 -64 4 -68 18 C-71 30 -60 40 -42 42 C-26 44 -10 38 -8 26 C-6 14 -12 4 -24 2 Z";
    const OHR = "M18 -50 C40 -60 62 -44 64 -14 C66 12 60 34 48 40 C40 44 34 36 34 24 C34 4 26 -20 14 -36 Z";
    const schnauze = um(-12, 6, S.schnauze, 1, um(12, -6, 1, 1,
      flaeche(SCHNAUZE, f.blesse ? f.l : f.l, form("M-60 30 C-50 40 -30 44 -12 36 L-10 46 L-64 46 Z", f.blesse ? "#DDD6CB" : f.h, 0.55) + form("M-60 8 C-50 2 -36 0 -28 4 C-40 6 -52 10 -60 16 Z", "#fff", 0.5)) +
      // Nase und Mund
      `<path d="M-72 10 C-74 2 -62 -2 -56 2 C-52 6 -54 14 -60 18 C-64 20 -70 16 -72 10 Z" fill="${f.nase}" stroke="${T.KF}" stroke-width="${T.KW * 0.6}" ${T.ns}/>` +
      `<ellipse cx="-65" cy="4" rx="4" ry="2.4" fill="#fff" opacity=".7"/>` +
      strich("M-60 19 C-60 26 -56 30 -50 31 M-50 31 C-44 32 -38 30 -34 26", T.KF, T.KW * 0.75) +
      (st === 0 ? `<path d="M-50 31 C-50 40 -42 42 -40 33" fill="#E8798A" stroke="${T.KF}" stroke-width="${T.KW * 0.6}" ${T.ns}/>` : "") +
      `<circle cx="-46" cy="18" r="1.4" fill="${T.KF}" opacity=".5"/><circle cx="-40" cy="22" r="1.4" fill="${T.KF}" opacity=".5"/><circle cx="-38" cy="15" r="1.4" fill="${T.KF}" opacity=".5"/>`));
    const kopf =
      flaeche(OHR_HINTEN, f.d, form("M-50 0 C-52 20 -48 32 -42 34 L-36 30 C-40 10 -36 -10 -30 -26 Z", f.t, 0.6)) +
      flaeche(SCHAEDEL, f.h,
        form("M14 -56 C40 -52 56 -30 52 0 C48 28 30 42 8 44 L60 60 L60 -60 Z", f.s) +
        form("M-30 -30 C-20 -48 0 -54 14 -52 C-4 -46 -18 -36 -24 -20 Z", f.l, 0.6) +
        (f.blesse ? form("M-6 -56 C-10 -44 -14 -30 -14 -18 C-14 -8 -10 0 -6 6 L-40 6 C-34 0 -26 -6 -22 -16 C-20 -32 -14 -46 -6 -56 Z", f.l) : "") +
        (f.flecken ? form("M-26 -40 C-14 -50 0 -46 0 -34 C-4 -24 -18 -24 -26 -30 Z", f.flecken) : "") +
        form("M-24 30 C-10 40 10 42 24 36 C14 46 -12 48 -24 40 Z", f.s, 0.6)) +
      // Stirnfell
      strich("M-2 -50 C2 -44 2 -38 0 -32 M8 -52 C12 -46 12 -40 10 -36", f.t, 1.6, 0.5) +
      // Augen: hinteres (links, schmaler) und vorderes; Brauen-Flecken
      auge(-34, -10, 6.2 * (st === 0 ? 1.12 : 1), { breite: 0.72 }) + auge(-2, -12, 7.6 * (st === 0 ? 1.12 : 1)) +
      form("M-40 -24 C-36 -28 -30 -28 -28 -24 C-32 -23 -36 -23 -40 -24 Z", f.l, 0.85) + form("M-10 -28 C-4 -32 4 -32 8 -27 C2 -26 -4 -26 -10 -28 Z", f.l, 0.85) +
      schnauze +
      flaeche(OHR, f.d, form("M40 -40 C56 -30 60 -6 58 18 C56 30 52 36 48 38 C50 10 48 -16 36 -38 Z", f.t, 0.6) + form("M22 -46 C30 -46 36 -40 38 -30 C30 -32 24 -38 22 -46 Z", f.h, 0.4)) +
      strich("M30 -24 C36 -6 38 10 38 24", f.t, 1.6, 0.5);
    const kopfY = 268 - (268 - S.ky) ;
    return `${schatten(st === 0 ? 70 : 84)}<g class="tier-koerper">${hinterePfote}${koerper}</g><g class="tier-kopf">${um(S.kx, kopfY, S.kopf, S.kopf, zubehoerNeu("hund", zu, T, "hinten") + kopf + mundNeu("hund", aus, T) + zubehoerNeu("hund", zu, T, "vorn"))}</g>`;
  }

  // =====================================================================================================
  // Katze: sitzend, Dreiviertelansicht nach links, Schwanz um die Pfoten (Kätzchen: Schwanz hoch)
  // =====================================================================================================
  function katze(st, stil, f, aus = "froh", zu = {}) {
    const T = werkzeug(stil, f, aus), { flaeche, form, strich, auge } = T;
    const S = [{ kopf: 1.3, rumpf: 0.72, breit: 1.06, pfote: 1.25, kx: 140, ky: 156, ohr: 1.18 },
      { kopf: 1.1, rumpf: 0.88, breit: 1.0, pfote: 1.1, kx: 138, ky: 122, ohr: 1.06 },
      { kopf: 1.0, rumpf: 1.0, breit: 0.94, pfote: 1.0, kx: 136, ky: 100, ohr: 1.0 }][st];
    const str = (d, w = 4) => (f.streifen ? strich(d, f.streifen, w, 0.85) : "");
    // ---- Rumpf: schlanke Brust, große runde Keule (Birnenform) ----
    const RUMPF = "M-34 -136 C-54 -120 -60 -84 -54 -50 C-50 -28 -46 -12 -44 0 L30 0 C50 -24 60 -60 50 -96 C42 -124 20 -146 -4 -148 C-18 -148 -28 -144 -34 -136 Z";
    const KEULE = "M-14 0 C-26 -50 2 -100 46 -98 C88 -94 98 -38 82 0 Z";
    const SCHWANZ_UM = "M76 -16 C98 -12 102 6 84 10 C50 16 -10 14 -42 8 C-58 5 -68 -6 -62 -18 C-58 -24 -50 -20 -52 -12 C-46 -4 -20 -4 0 -4 C30 -4 56 -8 76 -16 Z";
    const SCHWANZ_HOCH = "M70 -30 C96 -40 104 -80 92 -112 C88 -122 78 -120 80 -110 C90 -82 84 -54 66 -46 Z";
    const schwanz = st === 0
      ? flaeche(SCHWANZ_HOCH, f.h, form("M80 -40 C96 -56 100 -84 94 -110 L104 -110 L104 -30 Z", f.s) + str("M84 -64 l14 -4 M88 -84 l12 -2 M86 -102 l10 0", 5))
      : "";
    const schwanzVorn = st === 0 ? "" :
      flaeche(SCHWANZ_UM, f.h, form("M-60 2 C-30 10 40 10 96 0 L100 24 L-64 24 Z", f.s) + str("M-28 -4 l-2 14 M2 -4 l-2 14 M32 -6 l-2 14 M60 -12 l-2 14", 5) + form("M-70 -20 L-50 -20 L-50 -6 L-70 -6 Z", f.streifen ? f.d : f.s, f.streifen ? 0.8 : 0.5));
    const rumpf =
      schwanz +
      flaeche("M-30 -70 C-34 -40 -34 -18 -32 -6 L-16 -6 C-16 -24 -14 -48 -10 -70 Z", f.s, form("M-22 -70 L-10 -70 L-16 -6 L-22 -6 Z", f.t, 0.5)) +
      flaeche(KEULE, f.h, form("M18 0 C28 -30 56 -44 86 -40 L94 0 Z", f.s) + form("M0 -54 C10 -76 30 -86 50 -86 C34 -78 20 -66 12 -48 Z", f.l, 0.55) + str("M30 -90 C26 -78 26 -68 30 -60 M50 -92 C46 -78 46 -66 50 -56 M70 -84 C64 -70 64 -56 68 -46", 4.5)) +
      flaeche(RUMPF, f.h,
        form("M14 -148 C44 -126 54 -80 40 -36 L30 0 L70 0 L70 -160 Z", f.s) +
        form("M-50 -116 C-60 -92 -58 -60 -46 -30 C-38 -52 -30 -96 -18 -138 C-32 -136 -44 -128 -50 -116 Z", f.l) +
        str("M4 -140 C10 -126 12 -112 10 -100 M20 -132 C28 -118 30 -104 28 -92 M-10 -142 C-8 -132 -8 -124 -10 -116", 4.5) +
        form("M-10 -148 C0 -128 0 -112 -6 -98 C-18 -112 -22 -132 -10 -148 Z", f.s, 0.5));
    const bein = (x, farbe) =>
      flaeche(`M${x - 10} -110 C${x - 14} -80 ${x - 13} -40 ${x - 10} -8 L${x + 9} -8 C${x + 10} -40 ${x + 13} -76 ${x + 13} -110 Z`, farbe,
        form(`M${x + 3} -110 L${x + 15} -110 L${x + 10} -6 L${x + 4} -6 C${x + 5} -40 ${x + 7} -80 ${x + 3} -110 Z`, f.s, 0.7) + str(`M${x - 12} -64 l14 -2 M${x - 12} -46 l14 -2`, 3.5), { kontur: false }) +
      strich(`M${x - 13} -78 C${x - 13} -50 ${x - 12} -28 ${x - 10} -8 M${x + 11} -80 C${x + 11} -50 ${x + 10} -30 ${x + 9} -8`);
    const pfote = (x, farbe) => um(x, -4, S.pfote, S.pfote,
      flaeche("M-13 4 C-15 -6 -8 -11 0 -11 C10 -11 15 -6 13 4 Z", farbe, form("M-15 -1 L15 -1 L15 6 L-15 6 Z", f.s, 0.6)) + strich("M-4 -5 l0 7 M4 -5 l0 7", T.KF, T.KW * 0.55));
    const vorne = bein(-30, f.l) + pfote(-30, f.l);
    const koerper = um(160, 268, S.breit, S.rumpf, rumpf + vorne);
    const hinterePfote = um(160 - 16 * S.breit, 268, 1, 1, pfote(0, f.s));
    const vornSchwanz = um(160, 268, S.breit, 1, schwanzVorn);
    // ---- Kopf: rund, breite Wangen, spitze Ohren (Größe je Stufe), kleine Schnauze ----
    const SCHAEDEL = "M-44 0 C-48 -30 -24 -48 4 -48 C34 -48 54 -30 52 -2 C56 10 52 22 44 28 C32 40 14 44 -2 44 C-20 44 -36 38 -44 28 C-52 20 -50 8 -44 0 Z";
    const ohr = (gross) => um(0, 0, gross, gross, "");
    const OHR_HINTEN = "M-40 -18 C-46 -40 -44 -60 -36 -72 C-24 -62 -14 -50 -10 -40 Z";
    const OHR_VORN = "M8 -46 C20 -64 36 -76 50 -80 C54 -62 52 -40 46 -24 Z";
    const kopf =
      um(-24, -30, S.ohr, S.ohr, um(24, 30, 1, 1, flaeche(OHR_HINTEN, f.h, form("M-38 -26 C-42 -44 -40 -58 -36 -66 C-28 -56 -22 -48 -18 -40 Z", "#F2A7B5", 0.85) + form("M-44 -30 L-34 -70 L-30 -70 L-40 -24 Z", f.s, 0.7)))) +
      um(28, -36, S.ohr, S.ohr, um(-28, 36, 1, 1, flaeche(OHR_VORN, f.h, form("M16 -44 C26 -58 38 -68 46 -72 C48 -58 46 -42 42 -30 Z", "#F2A7B5", 0.85) + form("M44 -80 L54 -80 L50 -20 L42 -24 Z", f.s)) +
        strich("M24 -48 l6 2 M28 -56 l5 3 M34 -60 l3 4", "#fff", 1.4, 0.8))) +
      flaeche(SCHAEDEL, f.h,
        form("M18 -48 C44 -42 58 -20 52 6 C50 22 40 34 24 40 L64 50 L64 -60 Z", f.s) +
        form("M-50 10 C-44 30 -22 44 0 44 C16 44 30 40 40 32 C30 34 14 34 2 30 C-14 26 -30 22 -50 10 Z", f.l) +
        form("M-30 -30 C-20 -42 -4 -46 10 -44 C-6 -38 -16 -30 -22 -20 Z", f.l, 0.55) +
        str("M-18 -46 C-14 -38 -14 -32 -16 -26 M-6 -48 C-4 -38 -4 -30 -6 -24 M6 -48 C6 -40 6 -32 4 -26", 4) + str("M34 -8 l14 -4 M36 6 l14 0", 4)) +
      // Wangenfell (Büschel)
      auge(-30, -6, 6.4, { iris: f.iris, schlitz: true, breite: 0.72 }) + auge(2, -8, 7.8, { iris: f.iris, schlitz: true }) +
      // Schnauze: Schnurrhaarpolster, Nase, Mund
      form("M-36 12 C-30 4 -16 4 -12 12 C-10 22 -18 28 -26 28 C-34 28 -40 22 -36 12 Z", f.l) +
      `<path d="M-28 6 C-30 2 -20 0 -18 4 C-18 8 -22 12 -24 12 C-26 12 -28 10 -28 6 Z" fill="${f.nase}" stroke="${T.KF}" stroke-width="${T.KW * 0.55}" ${T.ns}/>` +
      strich("M-23 12 l0 5 M-23 17 C-26 21 -30 21 -32 18 M-23 17 C-20 21 -16 21 -14 18", T.KF, T.KW * 0.65) +
      strich("M-34 14 L-62 8 M-34 18 L-60 20 M-12 14 L18 10 M-12 18 L16 22", T.KF, 1.1, 0.55) +
      `<circle cx="-30" cy="14" r="1.1" fill="${T.KF}" opacity=".5"/><circle cx="-17" cy="14" r="1.1" fill="${T.KF}" opacity=".5"/>`;
    return `${schatten(st === 0 ? 68 : 82)}<g class="tier-koerper">${hinterePfote}${koerper}</g><g class="tier-kopf">${um(S.kx, S.ky, S.kopf, S.kopf, zubehoerNeu("katze", zu, T, "hinten") + kopf + mundNeu("katze", aus, T) + zubehoerNeu("katze", zu, T, "vorn"))}</g>${vornSchwanz}`;
  }

  // =====================================================================================================
  // Drache: Schlüpfling in der Eierschale – Jungdrache (kleine Flügel und Hörner) – großer Drache (langer Hals, große Flügel, Zacken)
  // =====================================================================================================
  function drache(st, stil, f, aus = "froh", zu = {}) {
    const T = werkzeug(stil, f, aus), { flaeche, form, strich, auge } = T;
    const S = [{ kopf: 1.28, rumpf: 0.62, breit: 1.0, kx: 146, ky: 132, fl: 0.45, horn: 0.5 },
      { kopf: 1.1, rumpf: 0.86, breit: 1.0, kx: 138, ky: 118, fl: 0.72, horn: 0.8 },
      { kopf: 0.96, rumpf: 0.96, breit: 0.96, kx: 116, ky: 86, fl: 0.92, horn: 1.0 }][st];
    // Flügel (hinter dem Körper): Knochen in Grundfarbe, Haut hell, Schattenfalten
    const FLUEGEL = "M0 0 C10 -40 40 -76 84 -90 C90 -70 88 -52 80 -38 C92 -36 100 -26 100 -14 C88 -16 76 -12 70 -2 C70 10 64 20 54 24 C44 12 24 4 0 0 Z";
    const fluegel = (x, y, sx, dunkel) => um(x, y, sx * S.fl, S.fl,
      flaeche(FLUEGEL, dunkel ? f.s : f.fl, form("M30 -30 C50 -40 70 -60 84 -88 L84 -36 C66 -40 50 -30 40 -14 Z", dunkel ? f.t : f.h, 0.35) + form("M60 -6 C70 -10 84 -14 100 -14 L100 0 L58 4 Z", dunkel ? f.t : f.h, 0.35)) +
      strich("M0 0 C24 -34 50 -62 84 -90 M8 -6 C36 -28 60 -36 80 -38 M14 -4 C40 -14 60 -14 70 -2", dunkel ? f.t : f.d, T.KW * 0.8));
    // Schwanz mit Pfeilspitze
    const SCHWANZ = st === 2
      ? "M30 -20 C64 -20 88 -24 102 -44 C108 -54 104 -64 112 -70 L116 -50 L132 -44 L114 -36 C98 -14 74 -2 40 -2 Z"
      : "M24 -16 C50 -14 72 -20 82 -36 C86 -44 82 -50 88 -54 L92 -38 L104 -34 L90 -28 C78 -10 56 -2 30 -2 Z";
    // Rückenzacken auf der Kontur (x, y, Winkel), hinter dem Rumpf gezeichnet – nur die Spitzen schauen heraus
    const ZACKEN = st === 2 ? [[2, -150, 10], [24, -140, 40], [40, -120, 60], [48, -96, 75], [50, -70, 90], [80, -28, 30], [96, -46, 10]]
      : st === 1 ? [[0, -150, 10], [24, -140, 40], [40, -118, 62], [48, -92, 78], [66, -22, 40]] : [[4, -148, 20], [28, -136, 50]];
    const zacken = ZACKEN.map(([x, y, w], i) => `<g transform="translate(${x} ${y}) rotate(${w})">` +
      flaeche("M-9 6 L0 -14 L9 6 Z", i % 2 ? f.d : f.h, form("M0 -14 L9 6 L3 6 Z", f.t, 0.5)) + `</g>`).join("");
    const RUMPF = "M-42 -136 C-62 -118 -68 -82 -60 -48 C-56 -28 -52 -12 -50 0 L30 0 C50 -28 58 -66 48 -100 C40 -128 16 -150 -8 -152 C-22 -152 -34 -146 -42 -136 Z";
    const BAUCH = "M-56 -118 C-68 -92 -64 -50 -48 -4 L-20 -4 C-30 -50 -30 -96 -20 -140 C-36 -138 -50 -130 -56 -118 Z";
    const KEULE = "M-10 0 C-22 -48 4 -96 44 -94 C84 -92 96 -38 80 0 Z";
    const rumpf =
      (st === 2 ? "" : zacken) +
      flaeche(SCHWANZ, f.h, form("M30 -10 C70 -10 104 -20 124 -50 L160 -40 L140 0 L30 2 Z", f.s)) +
      flaeche("M-38 -70 C-42 -40 -42 -18 -40 -6 L-22 -6 C-22 -24 -20 -48 -16 -70 Z", f.s, form("M-28 -70 L-16 -70 L-22 -6 L-28 -6 Z", f.t, 0.5)) +
      flaeche(KEULE, f.h, form("M20 0 C30 -26 56 -40 82 -36 L90 0 Z", f.s) + form("M4 -50 C14 -70 34 -78 52 -76 C36 -70 22 -60 14 -44 Z", f.l, 0.5) +
        `<circle cx="40" cy="-60" r="4" fill="${f.s}"/><circle cx="54" cy="-48" r="3" fill="${f.s}"/><circle cx="30" cy="-44" r="3" fill="${f.s}"/>`) +
      flaeche(RUMPF, f.h,
        form("M12 -152 C40 -132 50 -84 38 -40 L30 0 L70 0 L70 -160 Z", f.s) +
        `<circle cx="10" cy="-110" r="4" fill="${f.s}"/><circle cx="22" cy="-90" r="3" fill="${f.s}"/><circle cx="4" cy="-80" r="3" fill="${f.s}"/>` +
        flaeche(BAUCH, f.bauch, form("M-34 -130 C-40 -90 -40 -50 -32 -4 L-20 -4 C-30 -50 -30 -96 -20 -140 Z", "#000", 0.08) +
          strich("M-62 -100 C-50 -98 -36 -100 -26 -104 M-64 -76 C-50 -74 -36 -76 -28 -80 M-62 -52 C-50 -50 -38 -52 -30 -56 M-56 -28 C-46 -26 -36 -28 -30 -30", f.d, 2, 0.45), { kontur: false })) +
      // Vorderbein mit Krallen: neben dem Bauch, Schulter rund (Kontur nur seitlich)
      flaeche("M-26 -104 C-34 -96 -32 -60 -28 -8 L-6 -8 C-2 -50 4 -86 -2 -104 C-8 -112 -20 -112 -26 -104 Z", f.h, form("M-12 -110 C-2 -100 0 -60 -6 -6 L4 -6 L4 -110 Z", f.s, 0.8) + form("M-28 -90 C-30 -60 -28 -30 -26 -8 L-22 -8 C-24 -30 -26 -60 -24 -90 Z", f.l, 0.5)) +
      flaeche("M-32 2 C-34 -8 -26 -14 -16 -14 C-4 -14 2 -8 0 2 Z", f.h, form("M-36 -2 L4 -2 L4 6 L-36 6 Z", f.s, 0.7)) +
      flaeche("M-34 2 l-4 4 l6 -1 Z M-24 2 l-3 5 l6 -2 Z M-14 2 l-2 5 l6 -2 Z", "#FFF6E0", "", { kw: T.KW * 0.6 }) +
      flaeche("M34 -2 C34 -14 52 -18 70 -14 C82 -10 84 0 76 2 L38 2 C34 2 34 0 34 -2 Z", f.h, form("M30 -4 L86 -4 L86 4 L30 4 Z", f.s, 0.6));
    // langer Hals (nur groß)
    const HALS = "M-40 -136 C-46 -166 -40 -192 -30 -212 L4 -208 C0 -186 0 -168 6 -148 Z";
    const hals = st === 2 ? flaeche(HALS, f.h, form("M-12 -224 C-8 -196 -6 -170 0 -146 L10 -146 L10 -224 Z", f.s) + form("M-44 -140 C-48 -170 -42 -200 -34 -224 L-24 -224 C-30 -200 -34 -170 -32 -140 Z", f.bauch) +
      strich("M-46 -160 C-40 -158 -34 -158 -30 -160 M-44 -184 C-38 -182 -32 -182 -28 -184 M-40 -206 C-34 -204 -30 -204 -26 -206", f.d, 2, 0.45)) : "";
    // Eierschale (Schlüpfling)
    const SCHALE = "M-78 -60 L-60 -74 L-46 -56 L-30 -78 L-12 -58 L4 -80 L22 -60 L38 -78 L52 -56 L68 -72 L80 -58 C86 -24 64 4 0 6 C-64 4 -86 -24 -78 -60 Z";
    const schale = st === 0 ? um(150, 268, 1, 1, flaeche(SCHALE, "#FFE2B8", form("M30 -70 L80 -58 C84 -24 64 4 0 6 L0 -20 C40 -20 60 -40 30 -70 Z", "#F7B77A", 0.7) +
      `<circle cx="-40" cy="-30" r="8" fill="#E8463B" opacity=".55"/><circle cx="20" cy="-20" r="10" fill="#E8463B" opacity=".55"/><circle cx="-10" cy="-50" r="6" fill="#E8463B" opacity=".55"/>`)) : "";
    const halsZacken = st === 2 ? [[0, -210, -10], [4, -188, 10], [6, -166, 20]].map(([x, y, w], i) => `<g transform="translate(${x} ${y}) rotate(${w + 80})">` + flaeche("M-8 6 L0 -12 L8 6 Z", i % 2 ? f.d : f.h) + `</g>`).join("") : "";
    const koerper = um(160, 268, S.breit, S.rumpf, (st === 2 ? zacken + halsZacken : "") + hals + rumpf);
    // ---- Kopf: Schnauze nach links, Nüstern, Brauenwulst, Hörner, Ohrflossen ----
    const SCHAEDEL = "M-40 -6 C-44 -34 -22 -50 6 -50 C34 -50 52 -32 50 -6 C48 18 32 36 10 38 C-8 40 -24 34 -32 24 Z";
    const SCHNAUZE = "M-26 -6 C-50 -12 -72 -4 -76 12 C-78 24 -66 34 -44 34 C-26 34 -10 28 -8 16 C-6 4 -14 -4 -26 -6 Z";
    const HORN = "M0 0 C6 -16 18 -30 34 -34 C26 -24 22 -12 22 2 Z";
    const kopf =
      um(14, -40, S.horn, S.horn, flaeche(HORN, "#FFF1D2", form("M22 2 C22 -12 26 -24 34 -34 L36 -30 C30 -20 28 -8 28 4 Z", "#E2C79A"))) +
      um(-16, -44, S.horn * 0.85, S.horn * 0.85, flaeche(HORN, "#F2DFBA", form("M22 2 C22 -12 26 -24 34 -34 L36 -30 C30 -20 28 -8 28 4 Z", "#D4B88A"))) +
      flaeche("M36 -20 C48 -30 62 -30 72 -22 C62 -16 56 -6 52 4 Z", f.fl, strich("M40 -16 C50 -20 58 -22 66 -22 M44 -8 C52 -12 58 -14 62 -14", f.d, 1.6, 0.6)) +
      flaeche(SCHAEDEL, f.h, form("M14 -50 C40 -46 54 -24 50 4 C46 26 30 38 10 40 L60 60 L60 -60 Z", f.s) + form("M-30 -30 C-18 -46 0 -50 14 -48 C-4 -42 -16 -32 -22 -18 Z", f.l, 0.55) +
        `<circle cx="20" cy="-30" r="3.5" fill="${f.s}"/><circle cx="30" cy="-18" r="2.5" fill="${f.s}"/>` + form("M-30 22 C-10 34 12 36 28 30 C16 42 -10 44 -30 34 Z", f.bauch, 0.9)) +
      flaeche(SCHNAUZE, f.h, form("M-74 20 C-66 32 -42 36 -20 30 L-8 40 L-80 40 Z", f.bauch) + form("M-64 2 C-52 -6 -38 -8 -28 -4 C-40 -2 -54 2 -64 8 Z", f.l, 0.6)) +
      `<ellipse cx="-68" cy="6" rx="3.2" ry="2.2" fill="${f.d}"/><ellipse cx="-56" cy="3" rx="2.6" ry="1.8" fill="${f.d}" opacity=".8"/>` +
      strich("M-74 20 C-60 26 -40 26 -22 20", T.KF, T.KW * 0.75) + (st === 0 ? flaeche("M-60 24 l3 6 l3 -5 Z M-48 25 l3 6 l3 -6 Z", "#fff", "", { kw: T.KW * 0.5 }) : "") +
      // Brauenwulst über den Augen
      form("M-42 -20 C-36 -28 -26 -28 -22 -22 C-28 -20 -36 -20 -42 -20 Z", f.d, 0.7) + form("M-10 -26 C-2 -34 10 -34 14 -26 C6 -24 -2 -24 -10 -26 Z", f.d, 0.7) +
      auge(-32, -10, 6 * (st === 0 ? 1.15 : 1), { iris: f.iris, schlitz: true, breite: 0.72 }) + auge(2, -12, 7.6 * (st === 0 ? 1.15 : 1), { iris: f.iris, schlitz: true });
    const fl = st === 0 ? fluegel(176, 200, 1, false) : fluegel(184, 150 + (2 - st) * 30, 1, false) + fluegel(170, 140 + (2 - st) * 30, -0.75, true);
    return `${schatten(st === 0 ? 86 : 90)}<g class="tier-koerper">${fl}${st === 0 ? um(160, 268, 1, S.rumpf, rumpf) : koerper}</g><g class="tier-kopf">${um(S.kx, S.ky, S.kopf, S.kopf, zubehoerNeu("drache", zu, T, "hinten") + kopf + mundNeu("drache", aus, T) + zubehoerNeu("drache", zu, T, "vorn"))}</g>${schale}`;
  }


  // ---------- Zubehör und Mund für die neue Zeichnung (im Kopf-Koordinatensystem, wächst mit dem Kopf) ----------
  // Anker je Art: Augen [x, y, r] (hinten, vorn), oben = Hut/Krone, ohr = Schleife, kinn = Halstuch, mund = offenes Lachen, zz = „schläft“
  const ANKER = {
    hund: { augen: [[-34, -10, 6.2, 0.72], [-2, -12, 7.6, 1]], oben: [8, -54], ohr: [44, -48], kinn: [-6, 40], mund: [-50, 31] },
    katze: { augen: [[-30, -6, 6.4, 0.72], [2, -8, 7.8, 1]], oben: [-6, -46], ohr: [30, -44], kinn: [-4, 40], mund: [-23, 19] },
    drache: { augen: [[-32, -10, 6, 0.72], [2, -12, 7.6, 1]], oben: [0, -48], ohr: [40, -24], kinn: [-8, 36], mund: [-48, 22] }
  };
  function mundNeu(art, aus, T) {
    const [x, y] = ANKER[art].mund;
    if (aus === "lacht") return `<path d="M${x - 9} ${y - 2} C${x - 7} ${y + 11} ${x + 7} ${y + 11} ${x + 9} ${y - 2} Z" fill="#B8344F" stroke="${T.KF}" stroke-width="${T.KW * 0.8}" stroke-linejoin="round" ${T.ns}/>` +
      `<path d="M${x - 5} ${y + 5} C${x - 2} ${y + 9} ${x + 2} ${y + 9} ${x + 5} ${y + 5}" fill="#F08AA0"/>`;
    if (aus === "schlaeft") return `<text x="34" y="-60" font-size="22" font-weight="700" fill="${T.KF}" font-family="Fredoka, sans-serif">z</text><text x="50" y="-78" font-size="16" font-weight="700" fill="${T.KF}" font-family="Fredoka, sans-serif">z</text>`;
    return "";
  }
  function zubehoerNeu(art, zu, T, ebene) {
    const A = ANKER[art], hat = (z) => zu && zu[z];
    let s = "";
    if (ebene === "hinten") {
      if (hat("halstuch")) { const [x, y] = A.kinn;
        s += T.flaeche(`M${x - 40} ${y - 14} C${x - 14} ${y + 4} ${x + 18} ${y + 4} ${x + 42} ${y - 12} L${x + 36} ${y + 2} C${x + 20} ${y + 10} ${x + 10} ${y + 12} ${x + 4} ${y + 34} L${x - 6} ${y + 14} C${x - 18} ${y + 10} ${x - 30} ${y + 6} ${x - 40} ${y - 2} Z`, "#3AA0E0",
          T.form(`M${x - 4} ${y + 8} L${x + 10} ${y + 10} L${x + 4} ${y + 34} Z`, "#2A7DBA") + [[-24, -2], [-6, 4], [14, 2], [2, 18]].map(([a, b]) => `<circle cx="${x + a}" cy="${y + b}" r="3" fill="#fff"/>`).join("")); }
      return s;
    }
    if (hat("brille")) s += A.augen.map(([x, y, r, b]) => `<ellipse cx="${x}" cy="${y}" rx="${r * 2 * b}" ry="${r * 2}" fill="#fff" fill-opacity=".22" stroke="#7B55B8" stroke-width="4.5"/>`).join("") +
      `<path d="M${A.augen[0][0] + A.augen[0][2] * 2 * A.augen[0][3]} ${A.augen[0][1] - 2} Q${(A.augen[0][0] + A.augen[1][0]) / 2} ${A.augen[1][1] - 8} ${A.augen[1][0] - A.augen[1][2] * 2} ${A.augen[1][1] - 2}" fill="none" stroke="#7B55B8" stroke-width="4"/>` +
      `<path d="M${A.augen[1][0] + A.augen[1][2] * 2} ${A.augen[1][1] - 4} L${A.augen[1][0] + 34} ${A.augen[1][1] - 10}" stroke="#7B55B8" stroke-width="4" stroke-linecap="round"/>`;
    if (hat("schleife")) { const [x, y] = A.ohr;
      s += T.flaeche(`M${x} ${y} C${x - 10} ${y - 18} ${x - 26} ${y - 16} ${x - 24} ${y - 2} C${x - 22} ${y + 10} ${x - 10} ${y + 8} ${x} ${y} Z`, "#FF6F61", T.form(`M${x - 24} ${y} L${x} ${y} L${x} ${y + 12} L${x - 24} ${y + 12} Z`, "#D7263D", 0.5)) +
        T.flaeche(`M${x} ${y} C${x + 10} ${y - 18} ${x + 26} ${y - 16} ${x + 24} ${y - 2} C${x + 22} ${y + 10} ${x + 10} ${y + 8} ${x} ${y} Z`, "#FF6F61", T.form(`M${x} ${y} L${x + 24} ${y} L${x + 24} ${y + 12} L${x} ${y + 12} Z`, "#D7263D", 0.5)) +
        T.flaeche(`M${x - 6} ${y} a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0`, "#D7263D"); }
    if (hat("hut")) { const [x, y] = A.oben;
      s += `<g transform="rotate(16 ${x} ${y})">` + T.flaeche(`M${x - 24} ${y + 4} L${x} ${y - 66} L${x + 24} ${y + 4} Z`, "#FFD84D",
        T.form(`M${x - 20} ${y - 8} L${x + 20} ${y - 8} L${x + 16} ${y - 18} L${x - 16} ${y - 18} Z M${x - 12} ${y - 32} L${x + 12} ${y - 32} L${x + 8} ${y - 42} L${x - 8} ${y - 42} Z`, "#E0457B") + T.form(`M${x} ${y - 66} L${x + 24} ${y + 4} L${x + 10} ${y + 4} Z`, "#E3B52E", 0.6)) +
        T.flaeche(`M${x - 8} ${y - 66} a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0`, "#FF6F61") + `</g>`; }
    if (hat("krone")) { const [x, y] = A.oben;
      s += T.flaeche(`M${x - 28} ${y + 6} L${x - 32} ${y - 26} L${x - 14} ${y - 10} L${x} ${y - 34} L${x + 14} ${y - 10} L${x + 32} ${y - 26} L${x + 28} ${y + 6} Z`, "#FFD84D",
        T.form(`M${x - 30} ${y - 4} L${x + 30} ${y - 4} L${x + 30} ${y + 8} L${x - 30} ${y + 8} Z`, "#E3B52E")) +
        [[-32, -26, "#FF6F61"], [0, -34, "#4FA8F0"], [32, -26, "#7ED957"]].map(([a, b, c]) => `<circle cx="${x + a}" cy="${y + b}" r="4.5" fill="${c}" stroke="${T.KF}" stroke-width="2"/>`).join(""); }
    return s;
  }
  const ZEICHNER_NEU = { hund, katze, drache };
    return { ZEICHNER_NEU, FARBEN_NEU };
  })();

  // ---------- Öffentlich ----------
  const altGewaehlt = () => { try { return !!(window.Spielwelt && Spielwelt.lade && (Spielwelt.lade("eltern") || {}).zeichnung === "alt"); } catch (e) { return false; } };
  function zeichneTier({ art, farbe = 0, stufe = 0, ausdruck = "froh", zubehoer = {}, stil }) {
    if (art === "fuchs" || !ZEICHNER[art]) art = "hund";
    if (stil !== "alt" && !(stil === undefined && altGewaehlt()) && NEU.ZEICHNER_NEU[art]) {
      const f = NEU.FARBEN_NEU[art][farbe] || NEU.FARBEN_NEU[art][0];
      return NEU.ZEICHNER_NEU[art](Math.max(0, Math.min(2, stufe)), "a", f, ausdruck, zubehoer || {});
    }
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

  // Ausschnitt um Kopf und Schultern (für kleine Bilder, z. B. die Startseite): viewBox als Text
  const KOPF_NEU = { hund: [[138, 150, 1.32], [136, 118, 1.12], [134, 96, 1]], katze: [[140, 156, 1.3], [138, 122, 1.1], [136, 100, 1]], drache: [[146, 132, 1.28], [138, 118, 1.1], [116, 86, 0.96]] };
  function portraet(art, stufe = 0) {
    if (art === "fuchs") art = "hund";
    const k = KOPF_NEU[art] && !altGewaehlt() ? KOPF_NEU[art][Math.max(0, Math.min(2, stufe))] : null;
    if (!k) return "40 0 220 230";
    const g = 190 * k[2];
    return `${Math.round(k[0] - g * 0.5)} ${Math.round(k[1] - g * 0.48)} ${Math.round(g)} ${Math.round(g)}`;
  }
  window.Tiere = { ARTEN, EIER, STUFEN, stufenName, ZUBEHOER, zeichneTier, zeichneEi, portraet };
})();
