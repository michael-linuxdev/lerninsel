// Haustiere: Zeichnungen für Eier und Tiere (4 Arten, je 3 Farben, 3 Wachstumsstufen).
// Koordinaten: 300 x 300, Boden bei y = 270.
(function () {
  const D = "#3b1f63";
  const sw = `stroke="${D}" stroke-width="4" stroke-linejoin="round"`;
  const REGENBOGEN = ["#FF6F61", "#FFA94D", "#FFD84D", "#7ED957", "#4FA8F0", "#9B6BE0"];

  const ARTEN = {
    drache: { name: "Drache", ei: "feuer", farben: [
      { name: "Grün", h: "#7ED957", l: "#DDF7CC", d: "#3E8E2E" }, { name: "Lila", h: "#B58CF0", l: "#EFE4FF", d: "#6B3FB8" }, { name: "Blau", h: "#6FC2F2", l: "#DFF3FF", d: "#2C6FA6" }] },
    fuchs: { name: "Fuchs", ei: "wald", farben: [
      { name: "Rot", h: "#F28C38", l: "#FFF3E6", d: "#7A3E18" }, { name: "Silber", h: "#AEB7C7", l: "#F5F7FB", d: "#4B5566" }, { name: "Polar", h: "#F5F1EA", l: "#FFFFFF", d: "#8C95A6" }] },
    katze: { name: "Kätzchen", ei: "kuschel", farben: [
      { name: "Grau", h: "#B9BDC8", l: "#F3F4F7", d: "#6B7080" }, { name: "Rot", h: "#F5A55A", l: "#FFF1E0", d: "#B8642A" }, { name: "Creme", h: "#F3E2C7", l: "#FFFAF2", d: "#B89770" }] }
  };
  const EIER = {
    feuer: { name: "Feuer-Ei", art: "drache", a: "#FFB36B", b: "#E8463B" },
    wald: { name: "Wald-Ei", art: "fuchs", a: "#CDEBB5", b: "#3E9E5A" },
    kuschel: { name: "Kuschel-Ei", art: "katze", a: "#FFE0EC", b: "#E0457B" }
  };
  const STUFEN = ["Baby", "Kind", "Groß"];
  const ZUBEHOER = [
    { id: "schleife", name: "Schleife", preis: 2 }, { id: "brille", name: "Brille", preis: 2 },
    { id: "halstuch", name: "Halstuch", preis: 2 }, { id: "hut", name: "Partyhut", preis: 3 }, { id: "krone", name: "Krone", preis: 4 }
  ];

  function masse(stufe) {
    return [
      { k: { x: 150, y: 132, r: 64 }, b: { x: 150, y: 222, rx: 50, ry: 44 } },
      { k: { x: 150, y: 112, r: 57 }, b: { x: 150, y: 206, rx: 66, ry: 56 } },
      { k: { x: 150, y: 96, r: 53 }, b: { x: 150, y: 194, rx: 80, ry: 66 } }
    ][Math.max(0, Math.min(2, stufe))];
  }

  // ---------- Gesicht ----------
  function gesicht(k, stufe, ausdruck) {
    const g = stufe === 0 ? 1.12 : 1, ex = k.r * 0.38, ey = k.y + k.r * 0.05, rx = k.r * 0.17 * g, ry = rx * 1.25;
    const m = { x: k.x, y: k.y + k.r * 0.45 };
    let augen, mund, extra = "";
    if (ausdruck === "lacht") {
      augen = [-1, 1].map(s => `<path d="M${k.x + s * ex - rx} ${ey + 2} Q${k.x + s * ex} ${ey - ry} ${k.x + s * ex + rx} ${ey + 2}" stroke="${D}" stroke-width="5" fill="none" stroke-linecap="round"/>`).join("");
      mund = `<path d="M${m.x - 14} ${m.y - 4} Q${m.x} ${m.y + 18} ${m.x + 14} ${m.y - 4} Z" fill="#B8324F" stroke="${D}" stroke-width="3" stroke-linejoin="round"/>`;
    } else if (ausdruck === "schlaeft") {
      augen = [-1, 1].map(s => `<path d="M${k.x + s * ex - rx} ${ey} Q${k.x + s * ex} ${ey + ry * 0.7} ${k.x + s * ex + rx} ${ey}" stroke="${D}" stroke-width="5" fill="none" stroke-linecap="round"/>`).join("");
      mund = `<ellipse cx="${m.x}" cy="${m.y}" rx="5" ry="4" fill="#B8324F"/>`;
      extra = `<text x="${k.x + k.r * 0.9}" y="${k.y - k.r * 0.7}" font-size="28" font-weight="700" fill="${D}" font-family="Fredoka, sans-serif">z</text><text x="${k.x + k.r * 1.2}" y="${k.y - k.r * 1.05}" font-size="20" font-weight="700" fill="${D}" font-family="Fredoka, sans-serif">z</text>`;
    } else {
      augen = `<g class="augen">` + [-1, 1].map(s => `<ellipse cx="${k.x + s * ex}" cy="${ey}" rx="${rx}" ry="${ry}" fill="${D}"/><circle cx="${k.x + s * ex + rx * 0.35}" cy="${ey - ry * 0.4}" r="${rx * 0.42}" fill="#fff"/><circle cx="${k.x + s * ex - rx * 0.35}" cy="${ey + ry * 0.4}" r="${rx * 0.18}" fill="#fff"/>`).join("") + `</g>`;
      if (ausdruck === "traurig") {
        mund = `<path d="M${m.x - 10} ${m.y + 6} Q${m.x} ${m.y - 4} ${m.x + 10} ${m.y + 6}" stroke="${D}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
        extra = [-1, 1].map(s => `<path d="M${k.x + s * (ex + rx)} ${ey - ry - 3} L${k.x + s * (ex - rx * 0.6)} ${ey - ry - 12}" stroke="${D}" stroke-width="4" stroke-linecap="round"/>`).join("");
      } else mund = `<path d="M${m.x - 12} ${m.y - 2} Q${m.x} ${m.y + 10} ${m.x + 12} ${m.y - 2}" stroke="${D}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    }
    const wangen = [-1, 1].map(s => `<ellipse cx="${k.x + s * k.r * 0.62}" cy="${k.y + k.r * 0.32}" rx="${k.r * 0.13}" ry="${k.r * 0.09}" fill="#FF7FA6" opacity=".5"/>`).join("");
    return augen + wangen + mund + extra;
  }

  // ---------- Arten ----------
  const ellipse = (x, y, rx, ry, fill, extra = "") => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${sw} ${extra}/>`;
  const pfad = (d, fill, extra = "") => `<path d="${d}" fill="${fill}" ${sw} ${extra}/>`;
  const fuesse = (b, f) => [-1, 1].map(s => ellipse(b.x + s * b.rx * 0.45, 262, b.rx * 0.32, 12, f)).join("");

  function drache(st, f) {
    const { k, b } = masse(st), w = [0.6, 0.85, 1.1][st];
    const fluegel = [-1, 1].map(s => pfad(`M${b.x + s * b.rx * 0.4} ${b.y - b.ry * 0.5} Q${b.x + s * (b.rx + 70 * w)} ${b.y - b.ry - 50 * w} ${b.x + s * (b.rx + 80 * w)} ${b.y - 10 * w} Q${b.x + s * (b.rx + 50 * w)} ${b.y - 18 * w} ${b.x + s * (b.rx + 40 * w)} ${b.y + 8 * w} Q${b.x + s * (b.rx + 20 * w)} ${b.y - 6 * w} ${b.x + s * b.rx * 0.7} ${b.y + 10}`, f.d, 'opacity=".95"')).join("");
    const schwanz = pfad(`M${b.x + b.rx * 0.6} ${b.y + b.ry * 0.4} Q${b.x + b.rx * 1.6} ${b.y + b.ry * 0.7} ${b.x + b.rx * 1.7} ${b.y - b.ry * 0.2} L${b.x + b.rx * 1.95} ${b.y - b.ry * 0.5} L${b.x + b.rx * 1.6} ${b.y - b.ry * 0.45} Q${b.x + b.rx * 1.3} ${b.y + b.ry * 0.2} ${b.x + b.rx * 0.5} ${b.y}`, f.h);
    const koerper = ellipse(b.x, b.y, b.rx, b.ry, f.h) + ellipse(b.x, b.y + b.ry * 0.18, b.rx * 0.58, b.ry * 0.68, f.l) +
      [0, 1, 2].map(i => `<path d="M${b.x - b.rx * 0.4} ${b.y - b.ry * 0.1 + i * b.ry * 0.28} Q${b.x} ${b.y + i * b.ry * 0.28} ${b.x + b.rx * 0.4} ${b.y - b.ry * 0.1 + i * b.ry * 0.28}" stroke="${f.d}" stroke-width="3" fill="none" opacity=".5"/>`).join("");
    const hoerner = [-1, 1].map(s => pfad(`M${k.x + s * k.r * 0.35} ${k.y - k.r * 0.8} L${k.x + s * k.r * 0.55} ${k.y - k.r * (1.25 + st * 0.1)} L${k.x + s * k.r * 0.7} ${k.y - k.r * 0.62} Z`, f.l)).join("");
    const kopf = ellipse(k.x, k.y, k.r, k.r * 0.95, f.h) + ellipse(k.x, k.y + k.r * 0.42, k.r * 0.45, k.r * 0.3, f.l) +
      `<circle cx="${k.x - 8}" cy="${k.y + k.r * 0.34}" r="3" fill="${f.d}"/><circle cx="${k.x + 8}" cy="${k.y + k.r * 0.34}" r="3" fill="${f.d}"/>`;
    return { hinten: fluegel + schwanz, koerper: koerper + fuesse(b, f.h), kopfHinten: hoerner, kopf, k };
  }

  function einhorn(st, f) {
    const { k, b } = masse(st);
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
    return { hinten: schweif, koerper, kopfHinten: maehneHinten + ohren, kopf, k };
  }

  function fuchs(st, f) {
    const { k, b } = masse(st), s2 = 1 + st * 0.15;
    const schwanz = pfad(`M${b.x + b.rx * 0.65} ${b.y + b.ry * 0.35} Q${b.x + b.rx * 1.9 * s2} ${b.y + b.ry * 0.1} ${b.x + b.rx * 1.55 * s2} ${b.y - b.ry * 1.25} Q${b.x + b.rx * 1.05} ${b.y - b.ry * 0.35} ${b.x + b.rx * 0.55} ${b.y - b.ry * 0.1} Z`, f.h) +
      pfad(`M${b.x + b.rx * 1.55 * s2} ${b.y - b.ry * 1.25} Q${b.x + b.rx * 1.75 * s2} ${b.y - b.ry * 0.75} ${b.x + b.rx * 1.72 * s2} ${b.y - b.ry * 0.45} Q${b.x + b.rx * 1.45 * s2} ${b.y - b.ry * 0.7} ${b.x + b.rx * 1.3 * s2} ${b.y - b.ry * 0.82} Z`, f.l);
    const koerper = ellipse(b.x, b.y, b.rx, b.ry, f.h) + ellipse(b.x, b.y + b.ry * 0.22, b.rx * 0.5, b.ry * 0.6, f.l) + fuesse(b, f.d);
    const ohren = [-1, 1].map(s => pfad(`M${k.x + s * k.r * 0.78} ${k.y - k.r * 0.3} L${k.x + s * k.r * 0.6} ${k.y - k.r * 1.25} L${k.x + s * k.r * 0.12} ${k.y - k.r * 0.78} Z`, f.h) +
      `<path d="M${k.x + s * k.r * 0.66} ${k.y - k.r * 0.45} L${k.x + s * k.r * 0.58} ${k.y - k.r * 1.02} L${k.x + s * k.r * 0.28} ${k.y - k.r * 0.75} Z" fill="${f.l}"/>`).join("");
    const kopf = ellipse(k.x, k.y, k.r, k.r * 0.92, f.h) + pfad(`M${k.x - k.r * 0.75} ${k.y + k.r * 0.05} Q${k.x} ${k.y - k.r * 0.2} ${k.x + k.r * 0.75} ${k.y + k.r * 0.05} Q${k.x + k.r * 0.6} ${k.y + k.r * 0.85} ${k.x} ${k.y + k.r * 0.85} Q${k.x - k.r * 0.6} ${k.y + k.r * 0.85} ${k.x - k.r * 0.75} ${k.y + k.r * 0.05} Z`, f.l, 'stroke="none"') +
      `<ellipse cx="${k.x}" cy="${k.y + k.r * 0.3}" rx="9" ry="7" fill="${D}"/>`;
    return { hinten: schwanz, koerper, kopfHinten: ohren, kopf, k };
  }

  function katze(st, f) {
    const { k, b } = masse(st);
    const schwanz = `<path d="M${b.x + b.rx * 0.7} ${b.y + b.ry * 0.4} Q${b.x + b.rx * 1.6} ${b.y + b.ry * 0.3} ${b.x + b.rx * 1.35} ${b.y - b.ry * 0.5} Q${b.x + b.rx * 1.2} ${b.y - b.ry * 1.1} ${b.x + b.rx * 1.55} ${b.y - b.ry * 1.2}" stroke="${D}" stroke-width="${22 + st * 4}" fill="none" stroke-linecap="round"/>` +
      `<path d="M${b.x + b.rx * 0.7} ${b.y + b.ry * 0.4} Q${b.x + b.rx * 1.6} ${b.y + b.ry * 0.3} ${b.x + b.rx * 1.35} ${b.y - b.ry * 0.5} Q${b.x + b.rx * 1.2} ${b.y - b.ry * 1.1} ${b.x + b.rx * 1.55} ${b.y - b.ry * 1.2}" stroke="${f.h}" stroke-width="${14 + st * 4}" fill="none" stroke-linecap="round"/>`;
    const koerper = ellipse(b.x, b.y, b.rx, b.ry, f.h) + ellipse(b.x, b.y + b.ry * 0.25, b.rx * 0.5, b.ry * 0.55, f.l) + fuesse(b, f.l);
    const ohren = [-1, 1].map(s => pfad(`M${k.x + s * k.r * 0.85} ${k.y - k.r * 0.25} L${k.x + s * k.r * 0.72} ${k.y - k.r * 1.1} L${k.x + s * k.r * 0.2} ${k.y - k.r * 0.8} Z`, f.h) +
      `<path d="M${k.x + s * k.r * 0.72} ${k.y - k.r * 0.4} L${k.x + s * k.r * 0.66} ${k.y - k.r * 0.9} L${k.x + s * k.r * 0.38} ${k.y - k.r * 0.72} Z" fill="#FFB8D0"/>`).join("");
    const streifen = [-1, 0, 1].map(i => `<path d="M${k.x + i * 13} ${k.y - k.r * 0.9} L${k.x + i * 9} ${k.y - k.r * 0.55}" stroke="${f.d}" stroke-width="5" stroke-linecap="round"/>`).join("");
    const barthaare = [-1, 1].map(s => `<path d="M${k.x + s * 22} ${k.y + k.r * 0.4} l${s * 38} -8 M${k.x + s * 22} ${k.y + k.r * 0.48} l${s * 40} 4" stroke="${D}" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>`).join("");
    const kopf = ellipse(k.x, k.y, k.r * 1.05, k.r * 0.92, f.h) + streifen + ellipse(k.x, k.y + k.r * 0.42, k.r * 0.36, k.r * 0.24, f.l, 'stroke="none"') +
      `<path d="M${k.x - 7} ${k.y + k.r * 0.28} L${k.x + 7} ${k.y + k.r * 0.28} L${k.x} ${k.y + k.r * 0.38} Z" fill="#FF8FA3"/>` + barthaare;
    return { hinten: schwanz, koerper, kopfHinten: ohren, kopf, k };
  }
  const ZEICHNER = { drache, einhorn, fuchs, katze };

  // ---------- Zubehör ----------
  function zubehoerTeil(id, k) {
    const r = k.r;
    switch (id) {
      case "schleife": return pfad(`M${k.x + r * 0.62} ${k.y - r * 0.78} l-26 -16 l2 32 Z`, "#FF6F61") + pfad(`M${k.x + r * 0.62} ${k.y - r * 0.78} l26 -16 l-2 32 Z`, "#FF6F61") + `<circle cx="${k.x + r * 0.62}" cy="${k.y - r * 0.78}" r="7" fill="#D7263D" ${sw}/>`;
      case "brille": return [-1, 1].map(s => `<circle cx="${k.x + s * r * 0.38}" cy="${k.y + r * 0.05}" r="${r * 0.27}" fill="#fff" fill-opacity=".25" stroke="#7B55B8" stroke-width="5"/>`).join("") + `<path d="M${k.x - r * 0.11} ${k.y} Q${k.x} ${k.y - 6} ${k.x + r * 0.11} ${k.y}" stroke="#7B55B8" stroke-width="4" fill="none"/>`;
      case "halstuch": return pfad(`M${k.x - r * 0.7} ${k.y + r * 0.78} Q${k.x} ${k.y + r * 1.0} ${k.x + r * 0.7} ${k.y + r * 0.78} L${k.x} ${k.y + r * 1.45} Z`, "#3AA0E0") + `<circle cx="${k.x - 8}" cy="${k.y + r * 1.0}" r="4" fill="#fff"/><circle cx="${k.x + 12}" cy="${k.y + r * 1.12}" r="4" fill="#fff"/>`;
      case "hut": return `<g transform="rotate(18 ${k.x + r * 0.45} ${k.y - r * 0.85})">` + pfad(`M${k.x + r * 0.45 - 26} ${k.y - r * 0.8} L${k.x + r * 0.45} ${k.y - r * 0.8 - 70} L${k.x + r * 0.45 + 26} ${k.y - r * 0.8} Z`, "#FFD84D") +
        `<path d="M${k.x + r * 0.45 - 18} ${k.y - r * 0.8 - 20} L${k.x + r * 0.45 + 18} ${k.y - r * 0.8 - 20} M${k.x + r * 0.45 - 10} ${k.y - r * 0.8 - 44} L${k.x + r * 0.45 + 10} ${k.y - r * 0.8 - 44}" stroke="#E0457B" stroke-width="6"/>` + `<circle cx="${k.x + r * 0.45}" cy="${k.y - r * 0.8 - 72}" r="9" fill="#E0457B" ${sw}/></g>`;
      case "krone": return pfad(`M${k.x - r * 0.55} ${k.y - r * 0.72} L${k.x - r * 0.6} ${k.y - r * 1.18} L${k.x - r * 0.3} ${k.y - r * 0.95} L${k.x} ${k.y - r * 1.3} L${k.x + r * 0.3} ${k.y - r * 0.95} L${k.x + r * 0.6} ${k.y - r * 1.18} L${k.x + r * 0.55} ${k.y - r * 0.72} Z`, "#FFC83D") + `<circle cx="${k.x}" cy="${k.y - r * 0.88}" r="6" fill="#E8336B"/>`;
    }
    return "";
  }

  // ---------- Öffentlich ----------
  function zeichneTier({ art, farbe = 0, stufe = 0, ausdruck = "froh", zubehoer = {} }) {
    const A = ARTEN[art] || ARTEN.fuchs, f = A.farben[farbe] || A.farben[0];
    const t = ZEICHNER[art](stufe, f);
    const zu = Object.keys(zubehoer).filter(z => zubehoer[z]);
    const hinten = zu.filter(z => z === "halstuch").map(z => zubehoerTeil(z, t.k)).join("");
    const vorne = zu.filter(z => z !== "halstuch").map(z => zubehoerTeil(z, t.k)).join("");
    return `<ellipse cx="150" cy="272" rx="${70 + stufe * 18}" ry="10" fill="#000" opacity=".12"/>` +
      `<g class="tier-koerper">${t.hinten}${t.koerper}</g>${hinten}<g class="tier-kopf">${t.kopfHinten}${t.kopf}${gesicht(t.k, stufe, ausdruck)}${vorne}</g>`;
  }

  function zeichneEi(typ, risse = 0) {
    const e = EIER[typ] || EIER.wald, id = "ei" + typ + Math.random().toString(36).slice(2, 6);
    const form = "M150 48 C206 48 236 140 236 190 C236 240 198 268 150 268 C102 268 64 240 64 190 C64 140 94 48 150 48 Z";
    let muster = "";
    if (typ === "feuer") muster = [0, 1, 2].map(i => `<path d="M${90 + i * 60} 240 q-12 -40 10 -64 q-2 26 14 30 q6 -20 -4 -40 q34 26 20 74 Z" fill="${e.b}" opacity=".85"/>`).join("");
    if (typ === "regenbogen") muster = REGENBOGEN.map((c, i) => `<rect x="40" y="${118 + i * 20}" width="220" height="12" fill="${c}"/>`).join("");
    if (typ === "wald") muster = [[110, 110], [180, 140], [120, 200], [190, 220], [150, 170], [90, 160]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="14" ry="7" transform="rotate(${i * 40} ${x} ${y})" fill="${e.b}"/>`).join("");
    if (typ === "kuschel") muster = [[115, 120], [185, 135], [150, 190], [100, 210], [200, 220]].map(([x, y]) => `<path d="M${x} ${y + 12} l-14 -14 a8 8 0 0 1 14 -10 a8 8 0 0 1 14 10 z" fill="${e.b}"/>`).join("");
    const risseD = ["", "M120 130 l14 14 l-10 10 l16 12", "M120 130 l14 14 l-10 10 l16 12 M180 160 l-12 12 l12 10 l-10 14", "M70 170 l20 -6 l14 12 l18 -10 l16 12 l20 -12 l18 10 l18 -8 l20 6"][Math.min(3, risse)];
    return `<defs><clipPath id="${id}"><path d="${form}"/></clipPath></defs><ellipse cx="150" cy="272" rx="80" ry="10" fill="#000" opacity=".12"/>` +
      `<path d="${form}" fill="${e.a}"/><g clip-path="url(#${id})">${muster}<ellipse cx="118" cy="100" rx="18" ry="30" fill="#fff" opacity=".5" transform="rotate(20 118 100)"/></g>` +
      `<path d="${form}" fill="none" ${sw}/>` + (risseD ? `<path d="${risseD}" stroke="${D}" stroke-width="4" fill="none" stroke-linejoin="round"/>` : "");
  }

  window.Tiere = { ARTEN, EIER, STUFEN, ZUBEHOER, zeichneTier, zeichneEi };
})();
