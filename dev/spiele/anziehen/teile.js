// Alle Teile der Anziehpuppe als kleine SVG-Bausteine.
// Koordinaten: Figur in 300 x 620, Kopfmitte (150,118). IDs nie ändern – sie stecken in gespeicherten Looks.
(function () {
  const D = "#3b1f63"; // Umrisslinie
  let uid = 0;
  const neueId = (p) => p + "-" + (++uid);

  function hexZuRgb(h) { h = h.replace("#", ""); if (h.length === 3) h = [...h].map(c => c + c).join(""); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function rgbZuHex(r, g, b) { return "#" + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join(""); }
  function ton(hex, f) { // f > 0 heller, f < 0 dunkler
    const [r, g, b] = hexZuRgb(hex);
    if (f >= 0) return rgbZuHex(r + (255 - r) * f, g + (255 - g) * f, b + (255 - b) * f);
    return rgbZuHex(r * (1 + f), g * (1 + f), b * (1 + f));
  }
  // Helle Farben (Weiß, Gelb) bekommen dunklere Details, sonst hellere
  const hell = (hex) => { const [r, g, b] = hexZuRgb(hex); return (r * 299 + g * 587 + b * 114) / 1000 > 200; };
  const detail = (c, f = 0.25) => hell(c) ? ton(c, -f) : ton(c, -f);
  const glanzFarbe = (c) => ton(c, 0.45);

  const flaeche = (d, c, extra = "") => `<path d="${d}" fill="${c}" stroke="${D}" stroke-width="3" stroke-linejoin="round" ${extra}/>`;
  const linie = (d, c, w = 3, extra = "") => `<path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  const glanz = (d, c, w = 5) => linie(d, glanzFarbe(c), w, 'opacity=".75"');
  const glied = (x1, y1, x2, y2, w, c) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${D}" stroke-width="${w + 6}" stroke-linecap="round"/>` +
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
  const kreis = (cx, cy, r, c, rand = true) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}" ${rand ? `stroke="${D}" stroke-width="3"` : ""}/>`;
  const AL = (t) => [112 - 26 * t, 198 + 150 * t];
  const AR = (t) => [188 + 26 * t, 198 + 150 * t];
  function stern(cx, cy, r, c, rand = true) {
    let p = "";
    for (let i = 0; i < 10; i++) {
      const w = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
      p += (i ? "L" : "M") + (cx + Math.cos(w) * rr).toFixed(1) + " " + (cy + Math.sin(w) * rr).toFixed(1);
    }
    return `<path d="${p}Z" fill="${c}" ${rand ? `stroke="${D}" stroke-width="2.5" stroke-linejoin="round"` : ""}/>`;
  }
  const herz = (x, y, s, c, rand = true) => `<path d="M${x} ${y + 9 * s} l${-10 * s} ${-10 * s} a${6 * s} ${6 * s} 0 0 1 ${10 * s} ${-7 * s} a${6 * s} ${6 * s} 0 0 1 ${10 * s} ${7 * s} z" fill="${c}" ${rand ? `stroke="${D}" stroke-width="2.5" stroke-linejoin="round"` : ""}/>`;
  const bluete = (x, y, r, c, mitte = "#FFC83D") => [0, 72, 144, 216, 288].map(w => kreis(x + Math.cos(w * Math.PI / 180) * r, y + Math.sin(w * Math.PI / 180) * r, r * 0.85, c, true)).join("") + kreis(x, y, r * 0.7, mitte, false);
  const funkeln = (punkte, c = "#fff") => punkte.map(([x, y, r = 5]) => stern(x, y, r, c, false)).join("");
  // Muster in eine Form schneiden, danach Umriss neu zeichnen
  function muster(d, grund, inhalt) {
    const id = neueId("m");
    return `<clipPath id="${id}"><path d="${d}"/></clipPath>` + `<path d="${d}" fill="${grund}"/>` +
      `<g clip-path="url(#${id})">${inhalt}</g>` + `<path d="${d}" fill="none" stroke="${D}" stroke-width="3" stroke-linejoin="round"/>`;
  }
  const aermel = (t0, t1, w, c) => { const [a, b] = AL(t0), [e, f] = AL(t1), [g, h] = AR(t0), [i, j] = AR(t1); return glied(a, b, e, f, w, c) + glied(g, h, i, j, w, c); };
  const zickzack = (x0, x1, yTop, yBot, zacken) => {
    let d = `M${x0 + 18} ${yTop} L${x1 - 18} ${yTop} L${x1} ${yBot}`;
    const schritt = (x1 - x0) / zacken;
    for (let k = zacken - 1; k >= 0; k--) d += ` L${(x0 + k * schritt + schritt / 2).toFixed(1)} ${yBot - 14} L${(x0 + k * schritt).toFixed(1)} ${yBot}`;
    return d + "Z";
  };
  const welle = (x0, x1, y, h, n) => { let d = ""; const s = (x1 - x0) / n; for (let k = 0; k < n; k++) d += ` Q${x1 - k * s - s / 2} ${y + h} ${x1 - (k + 1) * s} ${y}`; return d; };
  const REGENBOGEN = ["#FF6F61", "#FFA94D", "#FFD84D", "#7ED957", "#4FA8F0", "#9B6BE0"];

  // ---------- Körper ----------
  const BEIN_L = "M120 298 Q115 420 119 538 L137 538 Q145 420 149 298 Z";
  const BEIN_R = "M151 298 Q155 420 163 538 L181 538 Q185 420 180 298 Z";
  const RUMPF = "M108 192 Q150 182 192 192 Q186 245 184 302 Q150 312 116 302 Q114 245 108 192 Z";
  const ARM_L = "M103 196 Q88 270 76 342 Q84 351 95 346 Q107 274 121 206 Z";
  const ARM_R = "M197 196 Q212 270 224 342 Q216 351 205 346 Q193 274 179 206 Z";
  const koerper = {
    hinten(haut, ohneBeine) { // Beine, Rumpf, Hals (Beine weg bei Meerjungfrau)
      const schatten = ton(haut, -0.12);
      return (ohneBeine ? "" : flaeche(BEIN_L, haut) + flaeche(BEIN_R, haut) +
        `<ellipse cx="128" cy="547" rx="19" ry="10" fill="${haut}" stroke="${D}" stroke-width="3"/>` +
        `<ellipse cx="172" cy="547" rx="19" ry="10" fill="${haut}" stroke="${D}" stroke-width="3"/>`) +
        flaeche(RUMPF, haut) +
        `<rect x="138" y="156" width="24" height="44" rx="9" fill="${haut}" stroke="${D}" stroke-width="3"/>` +
        `<path d="M139 166 Q150 180 161 166 L161 176 Q150 188 139 176 Z" fill="${schatten}"/>`;
    },
    arme(haut) {
      return flaeche(ARM_L, haut) + flaeche(ARM_R, haut) + kreis(85, 353, 12.5, haut) + kreis(215, 353, 12.5, haut);
    },
    kopf(haut) {
      const innen = ton(haut, -0.15);
      return kreis(97, 124, 11, haut) + `<path d="M95 119 q-5 5 0 10" stroke="${innen}" stroke-width="3" fill="none" stroke-linecap="round"/>` +
        kreis(203, 124, 11, haut) + `<path d="M205 119 q5 5 0 10" stroke="${innen}" stroke-width="3" fill="none" stroke-linecap="round"/>` +
        kreis(150, 118, 54, haut) +
        `<circle cx="117" cy="147" r="9.5" fill="#FF7FA6" opacity=".42"/><circle cx="183" cy="147" r="9.5" fill="#FF7FA6" opacity=".42"/>` +
        `<path d="M147 140 Q150 143.5 153 140" stroke="${D}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".5"/>`;
    },
    unterhemd: () => flaeche("M118 192 L126 192 L130 210 Q150 218 170 210 L174 192 L182 192 Q186 245 186 302 Q150 312 114 302 Q114 245 118 192 Z", "#ffffff"),
    unterhose: () => flaeche("M114 290 L186 290 L190 338 L156 338 L150 318 L144 338 L110 338 Z", "#ffffff")
  };

  // ---------- Gesicht ----------
  const brauen = (hoch = 0) => linie(`M119 ${106 - hoch} Q129 ${100 - hoch} 139 ${106 - hoch} M161 ${106 - hoch} Q171 ${100 - hoch} 181 ${106 - hoch}`, D, 3.5);
  const auge = (x, g = 1) =>
    `<ellipse cx="${x}" cy="128" rx="${8.5 * g}" ry="${10.5 * g}" fill="${D}"/>` +
    `<ellipse cx="${x}" cy="${129.5}" rx="${6 * g}" ry="${7.5 * g}" fill="#7A4A2A"/>` +
    `<circle cx="${x}" cy="130" r="${3.6 * g}" fill="#1E1030"/>` +
    `<circle cx="${x + 3 * g}" cy="${123.5}" r="${3.2 * g}" fill="#fff"/><circle cx="${x - 2.8 * g}" cy="${133}" r="${1.5 * g}" fill="#fff"/>` +
    linie(`M${x + (x < 150 ? -8 : 8) * g} ${120 - g * 2} l${x < 150 ? -5 : 5} -4`, D, 2.5);
  const augeZu = (x) => linie(`M${x - 9} 129 Q${x} 119 ${x + 9} 129`, D, 4);
  const mundLaecheln = linie("M137 151 Q150 164 163 151", D, 4);
  const gesichter = [
    { id: "laecheln", name: "Lächeln", teil: () => brauen() + auge(130) + auge(170) + mundLaecheln },
    { id: "lachen", name: "Lachen", teil: () => brauen(2) + augeZu(130) + augeZu(170) + `<path d="M133 148 Q150 175 167 148 Z" fill="#B8324F" stroke="${D}" stroke-width="3" stroke-linejoin="round"/><path d="M135 149 L165 149 L163 154 L137 154 Z" fill="#fff"/><path d="M142 162 Q150 168 158 162" stroke="#FF8FA3" stroke-width="5" fill="none" stroke-linecap="round"/>` },
    { id: "zwinkern", name: "Zwinkern", teil: () => brauen() + auge(130) + augeZu(170) + linie("M136 151 Q152 166 166 148", D, 4) },
    { id: "staunen", name: "Staunen", teil: () => brauen(4) + auge(130, 1.15) + auge(170, 1.15) + `<ellipse cx="150" cy="157" rx="7" ry="9" fill="#B8324F" stroke="${D}" stroke-width="3"/>` },
    { id: "verliebt", name: "Verliebt", teil: () => brauen() + herz(130, 124, 1.05, "#E8336B") + herz(170, 124, 1.05, "#E8336B") + mundLaecheln },
    { id: "frech", name: "Frech", teil: () => brauen() + auge(130) + auge(170) + linie("M137 150 Q150 162 163 150", D, 4) + `<path d="M144 155 Q150 166 156 155 Z" fill="#FF7FA6" stroke="${D}" stroke-width="2.5"/>` },
    { id: "cool", name: "Verträumt", teil: () => brauen() + linie("M121 130 Q130 135 139 130 M161 130 Q170 135 179 130", D, 4) + linie("M121 130 l-4 -3 M179 130 l4 -3", D, 2.5) + linie("M140 153 Q150 159 160 153", D, 4) }
  ];

  // ---------- Haare ----------
  const kappe = "M94 122 Q92 52 150 50 Q208 52 206 122 Q200 90 150 88 Q100 90 94 122 Z";
  const kappeGlanz = (c) => glanz("M112 72 Q130 58 152 56", c, 6);
  const haare = [
    { id: "lang", name: "Lange Haare",
      hinten: c => flaeche("M90 124 Q84 44 150 46 Q216 44 210 124 L218 268 Q150 292 82 268 Z", c) + linie("M100 170 L96 262 M200 170 L204 262", detail(c), 3),
      vorne: c => flaeche("M94 124 Q92 50 150 48 Q208 50 206 124 Q196 96 174 88 Q140 104 102 100 Q96 110 94 124 Z", c) + kappeGlanz(c) + linie("M174 88 Q186 70 172 56", detail(c), 3) },
    { id: "wellen", name: "Lange Wellen",
      hinten: c => flaeche("M90 124 Q84 44 150 46 Q216 44 210 124 Q224 160 210 192 Q226 226 212 256 Q222 282 196 290 Q150 302 104 290 Q78 282 88 256 Q74 226 90 192 Q76 160 90 124 Z", c) +
        linie("M96 196 Q106 226 96 256 M204 196 Q194 226 204 256", detail(c), 3),
      vorne: c => flaeche("M94 124 Q90 50 150 48 Q210 50 206 124 Q200 92 176 86 Q160 104 124 100 Q100 104 94 124 Z", c) + kappeGlanz(c) + glanz("M188 70 Q198 84 200 100", c, 4) },
    { id: "zoepfe", name: "Zöpfe",
      hinten: c => flaeche("M58 150 Q70 120 92 132 Q106 190 88 226 Q60 236 58 150 Z", c) + flaeche("M242 150 Q230 120 208 132 Q194 190 212 226 Q240 236 242 150 Z", c) + kreis(150, 112, 57, c) +
        linie("M72 160 Q80 190 76 214 M228 160 Q220 190 224 214", detail(c), 3) + kreis(92, 134, 8, "#FF6F61") + kreis(208, 134, 8, "#FF6F61"),
      vorne: c => flaeche(kappe, c) + linie("M150 50 L150 86", detail(c), 3) + kappeGlanz(c) },
    { id: "seitenzopf", name: "Seitenzopf",
      hinten: c => kreis(150, 112, 57, c) + [0, 1, 2, 3, 4, 5].map(i => `<ellipse cx="${204 + i * 3}" cy="${160 + i * 24}" rx="${17 - i}" ry="15" fill="${c}" stroke="${D}" stroke-width="3"/>` + linie(`M${194 + i * 3} ${156 + i * 24} Q${204 + i * 3} ${164 + i * 24} ${214 + i * 3} ${156 + i * 24}`, detail(c), 2.5)).join("") +
        linie("M214 296 L208 314 M218 296 L220 316 M222 294 L230 312", c, 5) + kreis(219, 292, 7, "#5CCBA6"),
      vorne: c => flaeche("M94 122 Q92 50 150 48 Q208 50 206 128 Q190 84 140 86 Q112 92 94 122 Z", c) + linie("M120 54 Q134 62 140 86", detail(c), 3) + kappeGlanz(c) },
    { id: "dutt", name: "Dutt",
      hinten: c => kreis(150, 112, 57, c) + kreis(150, 44, 30, c) + linie("M132 40 Q150 30 168 40 M134 52 Q150 44 166 52", detail(c), 3),
      vorne: c => flaeche(kappe, c) + linie("M126 60 Q150 50 174 60", detail(c), 3) + kappeGlanz(c) },
    { id: "spacebuns", name: "Zwei Dutts",
      hinten: c => kreis(150, 112, 57, c) + kreis(106, 62, 25, c) + kreis(194, 62, 25, c) + linie("M94 56 Q106 48 118 56 M182 56 Q194 48 206 56", detail(c), 3),
      vorne: c => flaeche(kappe, c) + linie("M150 50 L150 86", detail(c), 3) + glanz("M98 54 Q104 46 112 46", c, 4) + glanz("M186 46 Q194 44 200 50", c, 4) },
    { id: "bob", name: "Bob",
      hinten: c => flaeche("M88 124 Q86 46 150 46 Q214 46 212 124 L214 186 Q150 200 86 186 Z", c),
      vorne: c => flaeche("M94 116 Q96 50 150 50 Q204 50 206 116 Q150 96 94 116 Z", c) + kappeGlanz(c) + linie("M120 104 L122 92 M150 98 L150 84 M180 104 L178 92", detail(c), 2.5) },
    { id: "kurz", name: "Kurz mit Pony",
      hinten: c => flaeche("M90 128 Q86 46 150 46 Q214 46 210 128 L206 152 Q150 142 94 152 Z", c),
      vorne: c => flaeche("M94 116 Q96 50 150 50 Q204 50 206 116 L196 100 L184 112 L172 98 L160 110 L148 96 L136 110 L124 98 L112 112 L102 100 Z", c) + kappeGlanz(c) },
    { id: "locken", name: "Locken",
      hinten: c => [[92, 90, 22], [110, 62, 24], [140, 48, 24], [170, 50, 24], [196, 66, 24], [210, 96, 22], [214, 132, 20], [86, 132, 20], [84, 168, 20], [216, 168, 20], [90, 202, 18], [210, 202, 18]].map(([x, y, r]) => kreis(x, y, r, c) + glanz(`M${x - r * 0.5} ${y - r * 0.4} q${r * 0.3} ${-r * 0.3} ${r * 0.6} ${-r * 0.2}`, c, 3)).join(""),
      vorne: c => [[108, 90, 16], [128, 78, 16], [150, 74, 16], [172, 78, 16], [192, 90, 16]].map(([x, y, r]) => kreis(x, y, r, c) + glanz(`M${x - 7} ${y - 5} q4 -5 9 -4`, c, 3)).join("") },
    { id: "puffs", name: "Afro-Puffs",
      hinten: c => kreis(150, 112, 57, c) + [[94, 66], [206, 66]].map(([x, y]) => [0, 45, 90, 135, 180, 225, 270, 315].map(w => kreis(x + Math.cos(w * Math.PI / 180) * 22, y + Math.sin(w * Math.PI / 180) * 22, 15, c)).join("") + kreis(x, y, 24, c, false)).join(""),
      vorne: c => flaeche(kappe, c) + [[118, 66], [136, 58], [158, 58], [178, 64], [128, 76], [168, 74], [148, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="${detail(c)}"/>`).join("") + kreis(112, 100, 7, "#FFC83D") + kreis(188, 100, 7, "#FFC83D") },
    { id: "pferd", name: "Pferdeschwanz",
      hinten: c => flaeche("M186 72 Q254 86 240 196 Q232 248 208 238 Q226 150 176 98 Z", c) + linie("M200 96 Q236 130 222 220", detail(c), 3) + kreis(150, 112, 57, c) + kreis(196, 78, 8, "#FFC83D"),
      vorne: c => flaeche("M94 122 Q92 52 150 50 Q208 52 206 122 Q196 88 160 86 Q120 96 94 122 Z", c) + kappeGlanz(c) }
  ];

  // ---------- Oberteile ----------
  const rumpfT = "M102 190 Q150 176 198 190 Q192 248 192 306 Q150 316 108 306 Q108 248 102 190 Z";
  const rumpfTop = "M116 192 L126 192 L130 210 Q150 220 170 210 L174 192 L184 192 Q190 248 190 304 Q150 314 110 304 Q110 248 116 192 Z";
  const ausschnitt = linie("M132 186 Q150 202 168 186", D, 3);
  const falten = (c) => linie("M118 270 Q126 286 122 300 M182 270 Q174 286 178 300", detail(c, 0.18), 3);
  const oberteile = [
    { id: "tshirt", name: "T-Shirt", rumpf: c => flaeche(rumpfT, c) + ausschnitt + falten(c), aermel: c => aermel(0, .32, 36, c) },
    { id: "herzshirt", name: "Herz-Shirt", rumpf: c => flaeche(rumpfT, c) + ausschnitt + herz(150, 236, 2.1, hell(c) ? "#E8336B" : "#fff") + falten(c), aermel: c => aermel(0, .32, 36, c) },
    { id: "pulli", name: "Pulli",
      rumpf: c => flaeche(rumpfT, c) + flaeche("M108 292 Q150 302 192 292 L192 306 Q150 316 108 306 Z", detail(c, 0.18)) + ausschnitt + falten(c),
      aermel: c => aermel(0, .9, 32, c) + aermel(.86, .93, 34, detail(c, 0.18)) },
    { id: "hoodie", name: "Kapuzenpulli",
      rumpf: c => flaeche("M118 196 Q150 166 182 196 Q168 206 150 206 Q132 206 118 196 Z", detail(c, 0.15)) + flaeche(rumpfT, c) +
        flaeche("M124 254 L176 254 L184 290 L116 290 Z", detail(c, 0.12)) + linie("M142 200 L140 232 M158 200 L160 232", "#fff", 3) + kreis(140, 234, 3, "#fff", false) + kreis(160, 234, 3, "#fff", false) +
        flaeche("M108 292 Q150 302 192 292 L192 306 Q150 316 108 306 Z", detail(c, 0.2)),
      aermel: c => aermel(0, .9, 32, c) + aermel(.86, .93, 34, detail(c, 0.2)) },
    { id: "bluse", name: "Bluse",
      rumpf: c => flaeche(rumpfT, c) + flaeche("M132 184 L150 206 L130 214 Z", "#fff") + flaeche("M168 184 L150 206 L170 214 Z", "#fff") + [226, 250, 274].map(y => kreis(150, y, 4, "#fff")).join("") + falten(c),
      aermel: c => aermel(0, .28, 40, c) },
    { id: "sterntop", name: "Stern-Top",
      rumpf: c => flaeche(rumpfTop, c) + stern(150, 254, 26, "#FFC83D"),
      aermel: () => "" },
    { id: "glitzertop", name: "Glitzer-Top", preis: 2,
      rumpf: c => muster(rumpfTop, c, `<rect x="100" y="180" width="100" height="140" fill="${glanzFarbe(c)}" opacity=".35"/>` + funkeln([[128, 222, 6], [168, 236, 7], [140, 268, 5], [176, 284, 6], [122, 292, 4], [154, 216, 4], [158, 290, 5]], "#FFF6B0")),
      aermel: () => "" },
    { id: "streifen", name: "Ringelshirt",
      rumpf: c => muster(rumpfT, c, [214, 244, 274, 304].map(y => `<rect x="90" y="${y}" width="120" height="13" fill="#fff" opacity=".85"/>`).join("")) + ausschnitt,
      aermel: c => aermel(0, .32, 36, c) },
    { id: "regenbogenpulli", name: "Regenbogen-Pulli", preis: 3,
      rumpf: c => muster(rumpfT, c, REGENBOGEN.map((f, i) => `<rect x="90" y="${222 + i * 12}" width="120" height="12" fill="${f}"/>`).join("")) + ausschnitt,
      aermel: c => aermel(0, .9, 32, c) + aermel(.5, .56, 33, "#FFD84D") + aermel(.62, .68, 33, "#4FA8F0") },
    { id: "jacke", name: "Jacke",
      rumpf: c => flaeche(rumpfT, c) + flaeche("M138 186 L162 186 L164 310 L136 310 Z", "#fff") + flaeche("M130 184 L146 230 L136 236 L120 196 Z", detail(c, 0.2)) + flaeche("M170 184 L154 230 L164 236 L180 196 Z", detail(c, 0.2)) +
        linie("M116 270 L132 270 M168 270 L184 270", detail(c, 0.3), 3),
      aermel: c => aermel(0, .9, 32, c) },
    { id: "strickjacke", name: "Strickjacke",
      rumpf: c => flaeche(rumpfTop, "#fff") + flaeche("M102 190 Q124 182 134 186 L144 306 Q126 314 108 306 Q108 248 102 190 Z", c) + flaeche("M198 190 Q176 182 166 186 L156 306 Q174 314 192 306 Q192 248 198 190 Z", c) +
        [222, 250, 278].map(y => kreis(138, y, 4, detail(c, 0.3))).join("") + linie("M114 214 Q118 250 114 290 M186 214 Q182 250 186 290", detail(c, 0.15), 3, 'stroke-dasharray="4 6"'),
      aermel: c => aermel(0, .9, 32, c) + aermel(.86, .93, 34, detail(c, 0.18)) }
  ];

  // ---------- Hosen und Röcke ----------
  const huefte = "M110 288 L190 288 L192 336 L108 336 Z";
  const naht = (c) => linie("M150 292 L150 336", detail(c, 0.3), 3);
  const LEGGING = "M112 290 L188 290 Q190 420 184 532 L162 532 Q154 420 150 330 Q146 420 138 532 L116 532 Q110 420 112 290 Z";
  const unterteile = [
    { id: "rock", name: "Rock",
      teil: c => flaeche("M114 288 L186 288 L208 390 Q150 402 92 390 Z", c) + `<rect x="113" y="284" width="74" height="14" rx="5" fill="${detail(c)}" stroke="${D}" stroke-width="3"/>` +
        linie("M132 300 L122 392 M150 300 L150 396 M168 300 L178 392", detail(c), 3) },
    { id: "karorock", name: "Karorock",
      teil: c => { const d = "M114 288 L186 288 L208 390 Q150 402 92 390 Z";
        return muster(d, c, [100, 124, 148, 172, 196].map(x => `<rect x="${x}" y="280" width="9" height="130" fill="${detail(c, 0.3)}" opacity=".6"/>`).join("") + [306, 330, 354, 378].map(y => `<rect x="80" y="${y}" width="140" height="9" fill="${detail(c, 0.3)}" opacity=".6"/>`).join("") + [112, 160].map(x => `<rect x="${x}" y="280" width="3" height="130" fill="#fff" opacity=".7"/>`).join("")) +
          `<rect x="113" y="284" width="74" height="14" rx="5" fill="${detail(c, 0.35)}" stroke="${D}" stroke-width="3"/>`; } },
    { id: "hose", name: "Hose",
      teil: c => glied(134, 320, 132, 512, 36, c) + glied(166, 320, 168, 512, 36, c) + flaeche(huefte, c) +
        glied(132, 500, 132, 512, 38, detail(c)) + glied(168, 500, 168, 512, 38, detail(c)) + naht(c) },
    { id: "jeans", name: "Jeans",
      teil: c => glied(134, 320, 132, 512, 36, c) + glied(166, 320, 168, 512, 36, c) + flaeche(huefte, c) +
        linie("M120 330 L118 500 M180 330 L182 500", glanzFarbe(c), 2.5, 'stroke-dasharray="5 5"') +
        herz(132, 410, 1.1, "#FF6F61") + `<rect x="158" y="410" width="20" height="18" rx="3" fill="${glanzFarbe(c)}" stroke="${D}" stroke-width="2.5"/>` +
        linie("M116 296 Q124 312 136 302 M184 296 Q176 312 164 302", "#FFC83D", 2.5) + naht(c) + glied(132, 504, 132, 512, 38, ton(c, 0.25)) + glied(168, 504, 168, 512, 38, ton(c, 0.25)) },
    { id: "jogging", name: "Jogginghose",
      teil: c => glied(134, 320, 132, 500, 38, c) + glied(166, 320, 168, 500, 38, c) + flaeche(huefte, c) +
        linie("M115 300 L113 498 M185 300 L187 498", "#fff", 5) + glied(132, 500, 132, 512, 30, detail(c, 0.25)) + glied(168, 500, 168, 512, 30, detail(c, 0.25)) +
        linie("M146 296 L144 312 M154 296 L156 312", "#fff", 2.5) },
    { id: "leggings", name: "Leggings",
      teil: c => muster(LEGGING, c, [...Array(40)].map((_, i) => `<circle cx="${112 + (i % 5) * 18 + (Math.floor(i / 5) % 2) * 9}" cy="${300 + Math.floor(i / 5) * 30}" r="4" fill="${hell(c) ? D : "#fff"}" opacity=".7"/>`).join("")) },
    { id: "shorts", name: "Shorts",
      teil: c => glied(134, 320, 133, 362, 40, c) + glied(166, 320, 167, 362, 40, c) + flaeche(huefte, c) + naht(c) + glied(133, 356, 133, 362, 42, detail(c)) + glied(167, 356, 167, 362, 42, detail(c)) },
    { id: "tuell", name: "Tüllrock",
      teil: c => flaeche(zickzack(88, 212, 296, 372, 8), ton(c, 0.45)) + flaeche(zickzack(96, 204, 294, 354, 7), ton(c, 0.2)) + flaeche(zickzack(104, 196, 292, 334, 6), c) +
        funkeln([[110, 350, 4], [190, 352, 4], [150, 362, 5]]) +
        `<rect x="112" y="284" width="76" height="14" rx="5" fill="${detail(c, 0.15)}" stroke="${D}" stroke-width="3"/>` }
  ];

  // ---------- Kleider ----------
  const kleidOben = "M112 196 Q150 206 188 196 L186 298 L114 298 Z";
  const traeger = (c) => glied(122, 188, 124, 198, 7, c) + glied(178, 188, 176, 198, 7, c);
  const kleider = [
    { id: "sommer", name: "Sommerkleid",
      rock: c => { let p = ""; [[110, 340], [150, 360], [190, 340], [100, 400], [140, 410], [180, 405], [205, 395]].forEach(([x, y]) => p += kreis(x, y, 5, "#fff", false)); return flaeche("M114 290 L186 290 L220 430 Q150 446 80 430 Z", c) + p; },
      rumpf: c => flaeche(kleidOben, c) + traeger(c) + `<path d="M114 292 Q150 300 186 292" stroke="${detail(c)}" stroke-width="5" fill="none"/>`,
      aermel: () => "" },
    { id: "blumen", name: "Blumenkleid",
      rock: c => { const d = "M114 290 L186 290 Q214 360 222 440 Q150 458 78 440 Q86 360 114 290 Z";
        return muster(d, c, [[106, 330], [150, 318], [192, 336], [96, 390], [136, 372], [176, 384], [210, 410], [116, 430], [160, 424]].map(([x, y], i) => bluete(x, y, 6, ["#fff", "#FFD84D", "#FF9BC8"][i % 3])).join("")); },
      rumpf: c => flaeche("M106 192 Q150 186 194 192 L186 298 L114 298 Z", c) + flaeche("M128 186 Q150 212 172 186", "#fff") + `<path d="M114 292 Q150 300 186 292" stroke="#fff" stroke-width="5" fill="none"/>`,
      aermel: c => { const [a, b] = AL(.1), [e, f] = AR(.1); return kreis(a, b, 18, c) + kreis(e, f, 18, c); } },
    { id: "latzkleid", name: "Latzkleid",
      rock: c => flaeche("M112 290 L188 290 L206 410 Q150 422 94 410 Z", c) + flaeche("M128 330 L152 330 L150 356 L130 356 Z", detail(c, 0.12)) + linie("M100 400 Q150 412 200 400", detail(c, 0.3), 3, 'stroke-dasharray="5 5"'),
      rumpf: c => flaeche(rumpfT, "#fff") + flaeche("M124 230 L176 230 L182 298 L118 298 Z", c) + glied(126, 192, 128, 232, 7, c) + glied(174, 192, 172, 232, 7, c) + kreis(128, 234, 4, "#FFC83D") + kreis(172, 234, 4, "#FFC83D") + herz(150, 256, 1, "#fff", false),
      aermel: () => aermel(0, .3, 36, "#fff") },
    { id: "fee", name: "Feenkleid",
      rock: c => flaeche(zickzack(78, 222, 292, 470, 7), ton(c, 0.4)) + flaeche(zickzack(90, 210, 292, 430, 6), ton(c, 0.15)) + flaeche(zickzack(104, 196, 292, 380, 5), c) + funkeln([[100, 440, 5], [200, 446, 5], [150, 420, 6], [126, 360, 4], [176, 362, 4]]),
      rumpf: c => flaeche("M112 204 Q130 192 150 204 Q170 192 188 204 L186 298 L114 298 Z", c) + traeger(c) + bluete(150, 214, 6, "#fff"),
      aermel: () => "" },
    { id: "ball", name: "Ballkleid",
      rock: c => flaeche("M116 294 Q150 300 184 294 Q240 420 246 540 Q150 562 54 540 Q60 420 116 294 Z", c) +
        flaeche("M60 520 Q150 544 240 520 L246 540 Q150 562 54 540 Z", ton(c, 0.4)) + glanz("M108 320 Q84 420 76 520", c, 7) +
        [[96, 430], [130, 470], [176, 452], [210, 490], [150, 400], [110, 510], [190, 380]].map(([x, y]) => stern(x, y, 7, "#fff", false)).join(""),
      rumpf: c => flaeche("M110 192 Q150 186 190 192 L184 300 Q150 312 116 300 Z", c) + `<path d="M116 298 Q150 310 184 298" stroke="${detail(c)}" stroke-width="6" fill="none"/>`,
      aermel: c => { const [a, b] = AL(.07), [e, f] = AR(.07); return kreis(a, b, 20, ton(c, 0.3)) + kreis(e, f, 20, ton(c, 0.3)); } },
    { id: "buchstabenkleid", name: "Buchstaben-Kleid", belohnung: "Wort-Zauber Stufe 6",
      rock: c => { const d = "M114 290 L186 290 Q214 360 222 440 Q150 458 78 440 Q86 360 114 290 Z";
        const b = ["A", "B", "C", "D", "E", "F", "G", "H", "I"], pos = [[106, 330], [150, 322], [192, 336], [96, 388], [140, 380], [184, 392], [212, 420], [118, 430], [164, 432]];
        return muster(d, c, pos.map(([x, y], i) => `<text x="${x}" y="${y}" font-size="22" font-weight="700" text-anchor="middle" fill="${["#fff", "#FFD84D", "#FF9BC8"][i % 3]}" font-family="Fredoka, Arial">${b[i]}</text>`).join("")); },
      rumpf: c => flaeche("M106 192 Q150 186 194 192 L186 298 L114 298 Z", c) + `<text x="150" y="258" font-size="26" font-weight="700" text-anchor="middle" fill="#fff" font-family="Fredoka, Arial">abc</text>`,
      aermel: c => { const [a, b] = AL(.1), [e, f] = AR(.1); return kreis(a, b, 18, c) + kreis(e, f, 18, c); } },
    { id: "glitzer", name: "Glitzerkleid", preis: 3,
      rock: c => flaeche("M114 290 L186 290 L214 470 Q150 488 86 470 Z", c) + glanz("M118 300 Q104 390 96 460", c, 6) +
        [[110, 330], [150, 350], [188, 335], [124, 400], [170, 395], [100, 450], [150, 445], [196, 452]].map(([x, y]) => stern(x, y, 9, "#FFE27A", false)).join(""),
      rumpf: c => flaeche("M112 204 Q130 190 150 204 Q170 190 188 204 L186 298 L114 298 Z", c) + stern(150, 250, 12, "#FFE27A", false) + glied(122, 190, 124, 202, 6, detail(c)) + glied(178, 190, 176, 202, 6, detail(c)),
      aermel: () => "" },
    { id: "regenbogenkleid", name: "Regenbogenkleid", preis: 3,
      rock: c => { const d = "M114 290 L186 290 Q220 380 230 470 Q150 490 70 470 Q80 380 114 290 Z";
        return muster(d, REGENBOGEN[0], REGENBOGEN.map((f, i) => `<rect x="60" y="${290 + i * 32}" width="180" height="32" fill="${f}"/>`).join("") + funkeln([[110, 340, 5], [190, 370, 5], [140, 430, 6], [200, 450, 4]])); },
      rumpf: c => flaeche(kleidOben, c) + traeger(c) + stern(150, 246, 12, "#FFE27A"),
      aermel: () => "" },
    { id: "meerjungfrau", name: "Meerjungfrau-Kleid", preis: 4, ohneBeine: true,
      rock: c => { const d = "M114 290 L186 290 Q192 400 176 480 Q214 520 228 552 Q150 540 72 552 Q86 520 124 480 Q108 400 114 290 Z";
        let s = ""; for (let y = 300; y < 560; y += 18) for (let x = 100 + ((y / 18) % 2) * 9; x < 210; x += 18) s += `<path d="M${x - 9} ${y} q9 12 18 0" stroke="${glanzFarbe(c)}" stroke-width="2.5" fill="none" opacity=".8"/>`;
        return muster(d, c, s) + linie("M100 548 Q118 520 132 530 M200 548 Q182 520 168 530", ton(c, 0.4), 3); },
      rumpf: c => flaeche("M112 204 Q130 192 150 206 Q170 192 188 204 L186 298 L114 298 Z", c) + flaeche("M122 206 Q134 194 148 208 L146 226 Q134 222 122 226 Z", "#FFE0EC") + flaeche("M178 206 Q166 194 152 208 L154 226 Q166 222 178 226 Z", "#FFE0EC"),
      aermel: () => "" }
  ];

  // ---------- Schuhe ----------
  const fussPaar = (fn) => fn(128) + fn(172);
  const schuhe = [
    { id: "turn", name: "Turnschuhe",
      teil: c => fussPaar(x => `<rect x="${x - 23}" y="534" width="46" height="22" rx="11" fill="${c}" stroke="${D}" stroke-width="3"/>` +
        `<rect x="${x - 25}" y="551" width="50" height="9" rx="4" fill="#fff" stroke="${D}" stroke-width="3"/>` +
        linie(`M${x - 8} 540 l8 6 M${x - 1} 538 l8 6`, hell(c) ? D : "#fff", 3)) },
    { id: "ballerina", name: "Ballerinas",
      teil: c => fussPaar(x => `<ellipse cx="${x}" cy="550" rx="22" ry="12" fill="${c}" stroke="${D}" stroke-width="3"/>` + kreis(x - 5, 540, 5, detail(c)) + kreis(x + 5, 540, 5, detail(c)) + glanz(`M${x - 14} 548 q6 -5 12 -5`, c, 3)) },
    { id: "glitzerschuhe", name: "Glitzerschuhe", preis: 2,
      teil: c => fussPaar(x => `<ellipse cx="${x}" cy="550" rx="22" ry="12" fill="${c}" stroke="${D}" stroke-width="3"/>` + stern(x, 540, 8, "#FFE27A") + funkeln([[x - 12, 552, 3], [x + 13, 550, 3], [x, 556, 2.5]])) },
    { id: "sandalen", name: "Sandalen",
      teil: c => fussPaar(x => `<rect x="${x - 23}" y="552" width="46" height="8" rx="4" fill="${detail(c)}" stroke="${D}" stroke-width="3"/>` + linie(`M${x - 16} 548 L${x + 16} 540 M${x - 14} 538 L${x + 14} 550`, c, 6) + kreis(x, 544, 4, "#FFC83D")) },
    { id: "stiefel", name: "Stiefel",
      teil: c => glied(133, 462, 130, 540, 34, c) + glied(167, 462, 170, 540, 34, c) +
        fussPaar(x => `<rect x="${x - 23}" y="532" width="46" height="26" rx="12" fill="${c}" stroke="${D}" stroke-width="3"/>`) +
        glied(133, 460, 133, 470, 38, detail(c)) + glied(167, 460, 167, 470, 38, detail(c)) + glanz("M124 480 L123 528 M161 480 L163 528", c, 4) },
    { id: "gummi", name: "Gummistiefel",
      teil: c => glied(133, 470, 130, 540, 34, c) + glied(167, 470, 170, 540, 34, c) +
        fussPaar(x => `<rect x="${x - 23}" y="532" width="46" height="26" rx="12" fill="${c}" stroke="${D}" stroke-width="3"/>`) +
        [[131, 490], [127, 515], [136, 530], [169, 490], [173, 515], [164, 530]].map(([x, y]) => kreis(x, y, 4, "#fff", false)).join("") },
    { id: "rollschuhe", name: "Rollschuhe", preis: 2,
      teil: c => glied(133, 490, 130, 536, 34, c) + glied(167, 490, 170, 536, 34, c) +
        fussPaar(x => `<rect x="${x - 23}" y="528" width="46" height="24" rx="11" fill="${c}" stroke="${D}" stroke-width="3"/>` + `<rect x="${x - 24}" y="550" width="48" height="6" rx="3" fill="#fff" stroke="${D}" stroke-width="2.5"/>` +
          kreis(x - 14, 562, 7, "#FFC83D") + kreis(x + 14, 562, 7, "#FFC83D") + linie(`M${x - 6} 504 l12 0 M${x - 6} 514 l12 0`, "#fff", 3)) },
    { id: "hasen", name: "Hasen-Hausschuhe",
      teil: c => fussPaar(x => `<ellipse cx="${x + 2}" cy="548" rx="25" ry="14" fill="${c}" stroke="${D}" stroke-width="3"/>` +
        `<ellipse cx="${x - 8}" cy="528" rx="5" ry="12" fill="${c}" stroke="${D}" stroke-width="2.5"/><ellipse cx="${x + 6}" cy="528" rx="5" ry="12" fill="${c}" stroke="${D}" stroke-width="2.5"/>` +
        `<circle cx="${x - 4}" cy="545" r="2.2" fill="${D}"/><circle cx="${x + 8}" cy="545" r="2.2" fill="${D}"/><circle cx="${x + 2}" cy="550" r="2.5" fill="#FF7FA6"/>`) }
  ];

  // ---------- Extras ----------
  const reif = (c) => linie("M96 96 Q150 40 204 96", D, 12) + linie("M96 96 Q150 40 204 96", c, 7);
  const extras = [
    { id: "krone", name: "Krone", ebene: "kopf", farbe: "#FFC83D",
      teil: c => flaeche("M116 70 L122 34 L137 54 L150 26 L163 54 L178 34 L184 70 Z", c) + glanz("M124 62 L126 46", c, 3) + kreis(150, 58, 6, "#E8336B") + kreis(130, 62, 4.5, "#3AA0E0") + kreis(170, 62, 4.5, "#5CCBA6") },
    { id: "schleife", name: "Schleife", ebene: "kopf", farbe: "#FF6F61",
      teil: c => flaeche("M194 78 L170 62 L172 94 Z", c) + flaeche("M194 78 L218 62 L216 94 Z", c) + kreis(194, 78, 7, detail(c)) },
    { id: "blume", name: "Blüte im Haar", ebene: "kopf", farbe: "#FF9BC8",
      teil: c => bluete(110, 82, 11, c) },
    { id: "haarreif", name: "Blumen-Haarreif", ebene: "kopf", farbe: "#C2337A",
      teil: c => reif(c) + [[112, 74], [150, 58], [188, 74]].map(([x, y]) => bluete(x, y, 7, "#fff")).join("") },
    { id: "katzenohren", name: "Katzenohren", ebene: "kopf", farbe: "#2E2B47",
      teil: c => reif(c) + flaeche("M104 84 L106 48 L132 66 Z", c) + flaeche("M196 84 L194 48 L168 66 Z", c) + `<path d="M110 74 L111 56 L124 66 Z M190 74 L189 56 L176 66 Z" fill="#FF9BC8"/>` },
    { id: "einhorn", name: "Einhorn-Reif", ebene: "kopf", farbe: "#FF9BC8", preis: 2,
      teil: c => reif(c) + flaeche("M108 78 L104 52 L124 68 Z", c) + flaeche("M192 78 L196 52 L176 68 Z", c) +
        flaeche("M138 62 L150 8 L162 62 Z", "#FFE27A") + linie("M142 50 L158 44 M144 36 L156 32 M146 24 L154 21", D, 2.5) },
    { id: "muetze", name: "Bommelmütze", ebene: "kopf", farbe: "#3AA0E0",
      teil: c => flaeche("M94 98 Q94 38 150 36 Q206 38 206 98 Z", c) + `<rect x="90" y="88" width="120" height="20" rx="10" fill="${detail(c)}" stroke="${D}" stroke-width="3"/>` +
        linie("M120 46 L118 86 M150 38 L150 86 M180 46 L182 86", detail(c, 0.15), 3) + kreis(150, 30, 15, "#fff") },
    { id: "hut", name: "Sonnenhut", ebene: "kopf", farbe: "#FFE27A",
      teil: c => `<ellipse cx="150" cy="72" rx="96" ry="18" fill="${c}" stroke="${D}" stroke-width="3"/>` + flaeche("M106 72 Q108 26 150 24 Q192 26 194 72 Z", c) +
        linie("M107 62 Q150 70 193 62", "#FF6F61", 9) + bluete(186, 60, 6, "#fff") },
    { id: "kopfhoerer", name: "Kopfhörer", ebene: "kopf", farbe: "#C2337A",
      teil: c => linie("M92 120 Q90 44 150 42 Q210 44 208 120", D, 14) + linie("M92 120 Q90 44 150 42 Q210 44 208 120", c, 8) +
        `<rect x="80" y="106" width="22" height="38" rx="10" fill="${c}" stroke="${D}" stroke-width="3"/><rect x="198" y="106" width="22" height="38" rx="10" fill="${c}" stroke="${D}" stroke-width="3"/>` + herz(91, 120, 0.6, "#fff", false) + herz(209, 120, 0.6, "#fff", false) },
    { id: "rechenkrone", name: "Rechen-Krone", ebene: "kopf", farbe: "#5CCBA6", belohnung: "Rechen-Kraft Stufe 4",
      teil: c => flaeche("M114 72 L118 30 L134 50 L150 20 L166 50 L182 30 L186 72 Z", c) +
        `<text x="128" y="66" font-size="15" font-weight="700" text-anchor="middle" fill="#fff" font-family="Arial">+</text><text x="150" y="58" font-size="15" font-weight="700" text-anchor="middle" fill="#fff" font-family="Arial">×</text><text x="172" y="66" font-size="15" font-weight="700" text-anchor="middle" fill="#fff" font-family="Arial">=</text>` + kreis(150, 20, 5, "#FFC83D") },
    { id: "fuchsohren", name: "Fuchs-Ohren", ebene: "kopf", farbe: "#F28C38", belohnung: "Wort-Zauber Stufe 2",
      teil: c => reif(c) + flaeche("M100 88 L96 38 L134 62 Z", c) + flaeche("M200 88 L204 38 L166 62 Z", c) + `<path d="M104 76 L102 50 L124 64 Z M196 76 L198 50 L176 64 Z" fill="#FFF3E6"/>` },
    { id: "pixelbrille", name: "Pixel-Brille", ebene: "kopf", farbe: "#2E2B47", belohnung: "Tablet-Klugheit Stufe 4",
      teil: c => `<path d="M110 118 h40 v6 h0 v14 h-40 Z M150 118 h40 v20 h-40 Z" fill="${c}"/>` + `<rect x="114" y="121" width="10" height="6" fill="#fff"/><rect x="154" y="121" width="10" height="6" fill="#fff"/>` + `<rect x="96" y="120" width="14" height="5" fill="${c}"/><rect x="190" y="120" width="14" height="5" fill="${c}"/>` },
    { id: "entdeckerhut", name: "Entdecker-Hut", ebene: "kopf", farbe: "#C9A266", belohnung: "Entdecker-Mut Stufe 6",
      teil: c => `<ellipse cx="150" cy="78" rx="88" ry="16" fill="${c}" stroke="${D}" stroke-width="3"/>` + flaeche("M104 78 Q104 30 150 30 Q196 30 196 78 Z", c) +
        linie("M105 68 Q150 76 195 68", "#7A4E25", 8) + `<path d="M176 66 l14 -26 l4 4 z" fill="#5CCBA6" stroke="${D}" stroke-width="2"/>` },
    { id: "weihnachtsmuetze", name: "Weihnachtsmütze", ebene: "kopf", farbe: "#D7263D", belohnung: "Welt-Wissen Stufe 2",
      teil: c => flaeche("M106 74 Q112 26 160 22 Q200 24 214 64 L200 70 Q190 46 168 44 Q190 60 194 74 Z", c) +
        `<rect x="98" y="62" width="104" height="20" rx="10" fill="#fff" stroke="${D}" stroke-width="3"/>` + kreis(214, 78, 11, "#fff") },
    { id: "brille", name: "Brille", ebene: "kopf", farbe: "#7B55B8",
      teil: c => [130, 170].map(x => `<circle cx="${x}" cy="128" r="16" fill="#fff" fill-opacity=".3" stroke="${c}" stroke-width="5"/>`).join("") + linie("M146 126 Q150 122 154 126", c, 4) },
    { id: "sonnenbrille", name: "Sonnenbrille", ebene: "kopf", farbe: "#E8336B",
      teil: c => [130, 170].map(x => `<path d="M${x - 17} 118 L${x + 17} 118 L${x + 14} 136 Q${x} 144 ${x - 14} 136 Z" fill="#2A2230" stroke="${c}" stroke-width="4" stroke-linejoin="round"/>` + linie(`M${x - 9} 123 l6 0`, "#fff", 3)).join("") + linie("M147 120 L153 120", c, 4) },
    { id: "ohrringe", name: "Ohrringe", ebene: "kopf", farbe: "#FFC83D",
      teil: c => [97, 203].map(x => kreis(x, 140, 4, c) + `<path d="M${x} 144 l-6 12 h12 z" fill="${c}" stroke="${D}" stroke-width="2.5" stroke-linejoin="round"/>`).join("") },
    { id: "kette", name: "Kette", ebene: "hals", farbe: "#FFC83D",
      teil: c => linie("M126 192 Q150 226 174 192", D, 7) + linie("M126 192 Q150 226 174 192", c, 3.5) + herz(150, 222, 1, "#E8336B") },
    { id: "schal", name: "Schal", ebene: "hals", farbe: "#FF6F61",
      teil: c => flaeche("M124 178 Q150 196 176 178 L180 200 Q150 220 120 200 Z", c) + flaeche("M160 204 L176 204 L180 270 L162 272 Z", c) +
        linie("M162 262 L180 260", "#fff", 4) + linie("M163 250 L179 248", "#fff", 4) + linie("M164 272 l-2 8 M170 272 l0 9 M176 271 l2 8", c, 4) },
    { id: "armband", name: "Armband", ebene: "hand", farbe: "#5CCBA6",
      teil: c => [0, 1, 2, 3, 4].map(i => kreis(77 + i * 4.5, 334 + i * 1.5, 4.5, i % 2 ? c : "#FFC83D")).join("") },
    { id: "tasche", name: "Handtasche", ebene: "hand", farbe: "#C2337A",
      teil: c => linie("M200 362 Q216 322 232 362", D, 7) + linie("M200 362 Q216 322 232 362", detail(c), 3.5) +
        `<rect x="192" y="358" width="48" height="38" rx="9" fill="${c}" stroke="${D}" stroke-width="3"/>` + kreis(216, 368, 5, "#FFC83D") + glanz("M198 384 L198 366", c, 3) },
    { id: "teddy", name: "Teddy", ebene: "hand", farbe: "#B8804A", preis: 2,
      teil: c => kreis(222, 396, 22, c) + kreis(206, 370, 7, c) + kreis(238, 370, 7, c) + kreis(222, 368, 17, c) + `<ellipse cx="222" cy="374" rx="8" ry="6" fill="${ton(c, 0.4)}"/>` +
        `<circle cx="216" cy="364" r="2.4" fill="${D}"/><circle cx="228" cy="364" r="2.4" fill="${D}"/><circle cx="222" cy="372" r="2.5" fill="${D}"/>` + kreis(222, 400, 9, ton(c, 0.35), false) + herz(222, 396, 0.5, "#E8336B", false) },
    { id: "zauberstab", name: "Zauberstab", ebene: "hand", farbe: "#FFC83D",
      teil: c => linie("M86 358 L58 300", D, 9) + linie("M86 358 L58 300", "#fff", 5) +
        stern(56, 292, 18, c) + kreis(36, 276, 3, c, false) + kreis(74, 268, 2.5, c, false) + funkeln([[30, 306, 4], [80, 290, 3]], c) },
    { id: "ballon", name: "Luftballon", ebene: "hand", farbe: "#FF6F61",
      teil: c => linie("M85 352 Q60 300 54 236", D, 2) + `<ellipse cx="50" cy="196" rx="30" ry="36" fill="${c}" stroke="${D}" stroke-width="3"/>` + `<path d="M50 232 l-5 7 h10 z" fill="${c}" stroke="${D}" stroke-width="2"/>` + glanz("M34 180 Q36 168 46 164", c, 5) },
    { id: "umhang", name: "Umhang", ebene: "ruecken", farbe: "#7B55B8",
      teil: c => flaeche("M112 188 Q150 176 188 188 Q232 330 246 470 Q150 492 54 470 Q68 330 112 188 Z", c) + linie("M100 300 Q92 380 82 460 M200 300 Q208 380 218 460", ton(c, 0.25), 4) + funkeln([[76, 420, 6], [224, 400, 6], [96, 350, 4], [208, 330, 4]], "#FFE27A") },
    { id: "fluegel", name: "Feenflügel", ebene: "ruecken", farbe: "#9FD8FF", preis: 4,
      teil: c => { const f = (s) => `<g transform="translate(150 0) scale(${s} 1) translate(-150 0)">` +
          `<path d="M150 210 Q84 84 14 122 Q-6 220 122 250 Z" fill="${c}" fill-opacity=".7" stroke="${D}" stroke-width="3" stroke-linejoin="round"/>` +
          `<path d="M150 236 Q66 246 40 330 Q86 372 136 264 Z" fill="${ton(c, 0.3)}" fill-opacity=".75" stroke="${D}" stroke-width="3" stroke-linejoin="round"/>` +
          linie("M146 218 Q90 166 34 140 M146 244 Q90 270 62 326", "#fff", 2.5, 'opacity=".8"') + funkeln([[46, 160, 6], [74, 312, 5], [90, 200, 4]]) + `</g>`;
        return f(1) + f(-1); } }
  ];

  // ---------- Orte (Hintergründe, 460 x 620) ----------
  const wolke = (x, y, s, c = "#fff") => `<g fill="${c}"><circle cx="${x}" cy="${y}" r="${22 * s}"/><circle cx="${x + 24 * s}" cy="${y - 10 * s}" r="${26 * s}"/><circle cx="${x + 50 * s}" cy="${y}" r="${20 * s}"/><rect x="${x}" y="${y}" width="${50 * s}" height="${20 * s}" rx="${10 * s}"/></g>`;
  const baum = (x, y, s) => `<rect x="${x - 10 * s}" y="${y}" width="${20 * s}" height="${90 * s}" rx="6" fill="#A0693F"/>` + [[0, -10, 44], [-30, 18, 32], [30, 18, 32]].map(([dx, dy, r]) => `<circle cx="${x + dx * s}" cy="${y + dy * s}" r="${r * s}" fill="#5DB84A"/>`).join("") + `<circle cx="${x - 12 * s}" cy="${y - 22 * s}" r="${12 * s}" fill="#7ACB62"/>`;
  const orte = [
    { id: "zimmer", name: "Zimmer",
      teil: () => `<rect width="460" height="620" fill="#F1E2FF"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<circle cx="${30 + i * 60}" cy="${30 + (i % 2) * 20}" r="6" fill="#E4CCF7"/>`).join("") +
        `<rect y="470" width="460" height="150" fill="#E9C59A"/>` + [520, 570].map(y => `<path d="M0 ${y} H460" stroke="#D4A774" stroke-width="3"/>`).join("") +
        `<rect x="318" y="70" width="112" height="132" rx="10" fill="#BFE6FF" stroke="#fff" stroke-width="10"/><path d="M374 70 V202 M318 136 H430" stroke="#fff" stroke-width="8"/>` +
        `<path d="M306 60 Q330 140 308 214 M442 60 Q418 140 440 214" stroke="#FF9BC8" stroke-width="16" fill="none" stroke-linecap="round"/>` +
        `<rect x="28" y="96" width="84" height="70" rx="6" fill="#fff" stroke="#E8C1F0" stroke-width="6"/><path d="M70 146 l-16 -16 a9 9 0 0 1 16 -12 a9 9 0 0 1 16 12 z" fill="#FF8FA3"/>` +
        `<rect x="20" y="380" width="70" height="92" rx="8" fill="#FFF3D6" stroke="#E2C48A" stroke-width="4"/><path d="M30 404 H80 M30 428 H80 M30 452 H80" stroke="#E2C48A" stroke-width="3"/>` +
        `<ellipse cx="230" cy="562" rx="180" ry="30" fill="#FF9BC8"/><ellipse cx="230" cy="562" rx="140" ry="20" fill="#FFB8D9"/>` },
    { id: "park", name: "Park",
      teil: () => `<rect width="460" height="620" fill="#BFE6FF"/><circle cx="398" cy="74" r="38" fill="#FFD84D"/>` + wolke(160, 90, 1) + wolke(300, 150, 0.7) +
        `<path d="M0 440 Q120 400 240 440 T460 430 V620 H0 Z" fill="#8FD66B"/><path d="M0 500 Q160 470 300 500 T460 495 V620 H0 Z" fill="#7AC95A"/>` +
        baum(54, 250, 1.1) + baum(410, 330, 0.8) +
        [[300, 560], [340, 590], [400, 548], [30, 580], [420, 600], [250, 590]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#FF6F61"/><circle cx="${x}" cy="${y}" r="3" fill="#FFE27A"/>`).join("") },
    { id: "wald", name: "Wald",
      teil: () => `<rect width="460" height="620" fill="#D6F0D0"/>` + [[40, 180, 1.4], [150, 150, 1.1], [330, 170, 1.3], [430, 200, 1.1]].map(([x, y, s]) => `<path d="M${x} ${y - 120 * s} L${x + 60 * s} ${y + 60 * s} L${x - 60 * s} ${y + 60 * s} Z" fill="#3E9E5A"/><path d="M${x} ${y - 60 * s} L${x + 70 * s} ${y + 140 * s} L${x - 70 * s} ${y + 140 * s} Z" fill="#358A4E"/><rect x="${x - 10}" y="${y + 140 * s}" width="20" height="60" fill="#8A5A34"/>`).join("") +
        `<path d="M0 470 Q230 440 460 470 V620 H0 Z" fill="#6DBB55"/>` +
        [[60, 540], [390, 560], [330, 520]].map(([x, y]) => `<rect x="${x - 5}" y="${y}" width="10" height="16" fill="#FFF3D6"/><path d="M${x - 18} ${y + 2} Q${x} ${y - 22} ${x + 18} ${y + 2} Z" fill="#E8463B"/><circle cx="${x - 6}" cy="${y - 6}" r="3" fill="#fff"/><circle cx="${x + 7}" cy="${y - 4}" r="2.5" fill="#fff"/>`).join("") },
    { id: "strand", name: "Strand",
      teil: () => `<rect width="460" height="620" fill="#A8DFFF"/><circle cx="80" cy="80" r="40" fill="#FFD84D"/>` + wolke(280, 70, 0.9) +
        `<rect y="330" width="460" height="130" fill="#4FB5E6"/>` + [360, 400].map(y => `<path d="M0 ${y} q20 -10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#fff" stroke-width="4" fill="none" opacity=".7"/>`).join("") +
        `<path d="M0 450 Q230 420 460 450 V620 H0 Z" fill="#F6DA9B"/><path d="M380 580 q12 -28 24 0 z" fill="#FF9BC8" stroke="#E46C9A" stroke-width="3"/>` +
        `<path d="M40 560 L60 520 L80 560 Z" fill="#FF6F61"/><rect x="28" y="560" width="64" height="10" rx="4" fill="#3AA0E0"/>` },
    { id: "stadt", name: "Stadt",
      teil: () => `<rect width="460" height="620" fill="#CDE7FF"/>` + wolke(60, 80, 0.8) +
        [[0, 200, 90, "#FFB3A7"], [90, 140, 80, "#FFE08A"], [170, 230, 70, "#A7D8C8"], [240, 170, 100, "#C9B8F0"], [340, 220, 120, "#FFC9DE"]].map(([x, y, w, f]) => `<rect x="${x}" y="${y}" width="${w}" height="${470 - y}" fill="${f}"/>` +
          [...Array(Math.floor((470 - y) / 50))].map((_, r) => [...Array(Math.floor(w / 34))].map((_, k) => `<rect x="${x + 12 + k * 34}" y="${y + 18 + r * 50}" width="18" height="24" rx="3" fill="#fff" opacity=".85"/>`).join("")).join("")).join("") +
        `<rect y="470" width="460" height="150" fill="#9AA3B5"/><rect y="470" width="460" height="18" fill="#C3C9D6"/>` + [40, 140, 240, 340].map(x => `<rect x="${x}" y="560" width="60" height="10" rx="4" fill="#fff"/>`).join("") },
    { id: "buehne", name: "Bühne",
      teil: () => { const id = neueId("licht"); return `<defs><radialGradient id="${id}" cx="50%" cy="40%" r="50%"><stop offset="0" stop-color="#FFF3B0" stop-opacity=".9"/><stop offset="1" stop-color="#FFF3B0" stop-opacity="0"/></radialGradient></defs>` +
        `<rect width="460" height="620" fill="#4B2380"/><ellipse cx="230" cy="330" rx="200" ry="300" fill="url(#${id})"/><rect y="520" width="460" height="100" fill="#8A4F2D"/>` +
        `<path d="M0 0 H90 Q70 300 100 620 H0 Z" fill="#D7263D"/><path d="M460 0 H370 Q390 300 360 620 H460 Z" fill="#D7263D"/>` +
        [30, 60].map(x => `<path d="M${x} 0 Q${x - 10} 300 ${x + 10} 620" stroke="#A81B2F" stroke-width="6" fill="none"/>`).join("") +
        [400, 430].map(x => `<path d="M${x} 0 Q${x + 10} 300 ${x - 10} 620" stroke="#A81B2F" stroke-width="6" fill="none"/>`).join("") +
        `<path d="M0 0 H460 V44 Q420 70 383 44 Q345 70 307 44 Q268 70 230 44 Q192 70 153 44 Q115 70 77 44 Q38 70 0 44 Z" fill="#FFC83D"/>`; } },
    { id: "schnee", name: "Schnee",
      teil: () => `<rect width="460" height="620" fill="#D6E7FF"/><path d="M0 430 Q130 380 260 430 T460 410 V620 H0 Z" fill="#fff" stroke="#B9D3F5" stroke-width="4"/>` +
        `<circle cx="60" cy="470" r="34" fill="#fff" stroke="#B9D3F5" stroke-width="4"/><circle cx="60" cy="418" r="24" fill="#fff" stroke="#B9D3F5" stroke-width="4"/><path d="M60 418 l14 4 l-14 4 z" fill="#FF8C2A"/><circle cx="52" cy="410" r="3" fill="#3b1f63"/><circle cx="66" cy="410" r="3" fill="#3b1f63"/>` +
        [[40, 60], [120, 140], [200, 40], [300, 110], [390, 60], [420, 220], [90, 260], [340, 300], [250, 220], [160, 330]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#fff"/>`).join("") },
    { id: "wolkenland", name: "Wolkenland",
      teil: () => `<rect width="460" height="620" fill="#FFE6F2"/>` + REGENBOGEN.map((f, i) => `<path d="M-20 400 A250 250 0 0 1 480 400" stroke="${f}" stroke-width="18" fill="none" transform="translate(0 ${i * 18})"/>`).join("") +
        wolke(-10, 400, 1.6) + wolke(330, 410, 1.6) + wolke(150, 120, 1) + wolke(20, 540, 2.2) + wolke(250, 560, 2.2) + `<rect y="560" width="460" height="60" fill="#fff"/>` +
        funkeln([[90, 80, 8], [380, 60, 7], [300, 200, 6], [60, 230, 5]], "#FFD84D") },
    { id: "unterwasser", name: "Unterwasser", preis: 2,
      teil: () => { const id = neueId("meer"); return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FD3F5"/><stop offset="1" stop-color="#1E6FB8"/></linearGradient></defs><rect width="460" height="620" fill="url(#${id})"/>` +
        `<path d="M0 540 Q230 510 460 540 V620 H0 Z" fill="#F2D49B"/>` +
        [[40, 540], [90, 560], [380, 545], [420, 560]].map(([x, y], i) => `<path d="M${x} ${y} Q${x - 20} ${y - 80} ${x + 6} ${y - 150} Q${x + 20} ${y - 80} ${x + 4} ${y}" fill="${i % 2 ? "#3FB36B" : "#2E9C5A"}"/>`).join("") +
        `<g transform="translate(330 180)"><ellipse rx="34" ry="20" fill="#FFA94D"/><path d="M30 0 L56 -18 L56 18 Z" fill="#FFA94D"/><circle cx="-16" cy="-4" r="5" fill="#fff"/><circle cx="-16" cy="-4" r="2.5" fill="#3b1f63"/><path d="M-6 -18 v36 M8 -18 v36" stroke="#fff" stroke-width="5"/></g>` +
        `<g transform="translate(90 300) scale(-.8 .8)"><ellipse rx="34" ry="20" fill="#FF8CC6"/><path d="M30 0 L56 -18 L56 18 Z" fill="#FF8CC6"/><circle cx="-16" cy="-4" r="5" fill="#fff"/><circle cx="-16" cy="-4" r="2.5" fill="#3b1f63"/></g>` +
        [[200, 80, 10], [214, 50, 6], [400, 300, 8], [60, 140, 7], [70, 110, 4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>`).join("") +
        stern(380, 580, 14, "#FF6F61"); } },
    { id: "schloss", name: "Schloss", preis: 3,
      teil: () => `<rect width="460" height="620" fill="#D9ECFF"/>` + wolke(30, 90, 1) + wolke(340, 60, 0.9) +
        `<path d="M0 480 Q230 450 460 480 V620 H0 Z" fill="#8FD66B"/>` +
        `<rect x="40" y="220" width="380" height="270" fill="#FFD1E8" stroke="#E79BC3" stroke-width="5"/>` +
        [[20, 160, 70], [370, 160, 70], [170, 110, 120]].map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="${490 - y}" fill="#FFC2E0" stroke="#E79BC3" stroke-width="5"/><path d="M${x - 10} ${y} L${x + w / 2} ${y - 80} L${x + w + 10} ${y} Z" fill="#9B6BE0" stroke="#7B55B8" stroke-width="5"/><path d="M${x + w / 2} ${y - 80} v-26 l22 8 l-22 8" fill="#FFD84D" stroke="#7B55B8" stroke-width="3"/>`).join("") +
        [[45, 250], [395, 250], [210, 200], [250, 200]].map(([x, y]) => `<rect x="${x - 12}" y="${y}" width="24" height="36" rx="12" fill="#fff" stroke="#E79BC3" stroke-width="4"/>`).join("") +
        `<path d="M196 490 V420 Q230 384 264 420 V490 Z" fill="#B8804A" stroke="#8A5A34" stroke-width="5"/>` },
    { id: "pixelwelt", name: "Pixel-Welt", belohnung: "Tablet-Klugheit Stufe 8",
      teil: () => { let q = ""; const f = ["#7FC6F5", "#9FD8FF", "#BFE6FF"];
        for (let y = 0; y < 31; y++) for (let x = 0; x < 23; x++) q += `<rect x="${x * 20}" y="${y * 20}" width="20" height="20" fill="${y > 23 ? (x + y) % 2 ? "#5DB84A" : "#4FA83F" : f[(x * 7 + y * 3) % 3]}"/>`;
        return q + [[60, 60], [380, 120], [220, 40]].map(([x, y]) => `<rect x="${x}" y="${y}" width="60" height="20" fill="#fff"/><rect x="${x + 20}" y="${y - 20}" width="20" height="20" fill="#fff"/>`).join("") +
          `<rect x="360" y="380" width="40" height="100" fill="#A0693F"/><rect x="320" y="320" width="120" height="80" fill="#3E9E5A"/>` +
          `<rect x="40" y="420" width="20" height="20" fill="#FFD84D"/><rect x="60" y="400" width="20" height="20" fill="#FFD84D"/>`; } },
    { id: "weltall", name: "Weltall", preis: 3,
      teil: () => `<rect width="460" height="620" fill="#1E1446"/>` +
        [[30, 40], [90, 120], [160, 30], [250, 90], [330, 40], [420, 150], [50, 300], [400, 330], [120, 420], [300, 470], [430, 560], [20, 560], [220, 260]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 + 1.5}" fill="#fff"/>`).join("") +
        `<circle cx="370" cy="110" r="46" fill="#FF9BC8"/><ellipse cx="370" cy="110" rx="78" ry="16" fill="none" stroke="#FFE27A" stroke-width="7" transform="rotate(-18 370 110)"/>` +
        `<circle cx="70" cy="190" r="26" fill="#E6E1FF"/><circle cx="62" cy="182" r="6" fill="#C9C1F2"/><path d="M0 560 Q230 520 460 560 V620 H0 Z" fill="#7B55B8"/>` }
  ];


  // ---------- Jungen gleichziehen (30.10.2026): Frisuren, Oberteile, Hosen, Anzüge, Schuhe und Extras ----------
  // Neue Teile stehen weiter vorn in den Listen; IDs bleiben dauerhaft (gespeicherte Looks).
  const zuerst = (liste, neue, nachId) => { const i = liste.findIndex(t => t.id === nachId); liste.splice(i < 0 ? 0 : i + 1, 0, ...neue); };
  zuerst(haare, [
    { id: "scheitel", name: "Seitenscheitel",
      hinten: c => flaeche("M92 126 Q88 48 150 46 Q212 48 208 126 L204 146 Q150 138 96 146 Z", c),
      vorne: c => flaeche("M94 118 Q94 50 150 48 Q206 50 206 118 Q204 94 188 84 Q150 70 120 90 Q102 102 94 118 Z", c) + linie("M120 54 Q128 70 120 90", detail(c), 3) + kappeGlanz(c) },
    { id: "igel", name: "Igel-Frisur",
      hinten: c => flaeche("M92 128 Q88 52 150 50 Q212 52 208 128 L204 148 Q150 140 96 148 Z", c),
      vorne: c => flaeche("M94 112 L90 72 L108 82 L108 48 L126 66 L134 34 L150 58 L166 34 L174 66 L192 48 L192 82 L210 72 L206 112 Q150 94 94 112 Z", c) + glanz("M134 50 L140 64 M164 50 L160 64", c, 3) },
    { id: "wuschel", name: "Wuschelkopf",
      hinten: c => kreis(150, 106, 62, c),
      vorne: c => [[104, 92, 20], [124, 72, 22], [150, 64, 22], [176, 72, 22], [196, 92, 20], [116, 98, 14], [140, 90, 14], [164, 92, 14], [186, 100, 13]].map(([x, y, r]) => kreis(x, y, r, c)).join("") + glanz("M138 60 q8 -6 16 -2", c, 4) },
    { id: "kurzlocken", name: "Kurze Locken",
      hinten: c => [[96, 100, 18], [108, 72, 20], [134, 56, 21], [166, 56, 21], [192, 72, 20], [204, 100, 18], [92, 128, 15], [208, 128, 15]].map(([x, y, r]) => kreis(x, y, r, c)).join(""),
      vorne: c => [[112, 90, 13], [132, 80, 13], [150, 76, 13], [168, 80, 13], [188, 90, 13]].map(([x, y, r]) => kreis(x, y, r, c) + glanz(`M${x - 5} ${y - 4} q3 -4 7 -3`, c, 2.5)).join("") },
    { id: "afro", name: "Afro",
      hinten: c => kreis(150, 98, 84, c) + [[96, 66], [120, 40], [150, 30], [180, 40], [204, 66], [84, 104], [216, 104]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${detail(c)}"/>`).join(""),
      vorne: c => flaeche("M90 120 Q86 44 150 42 Q214 44 210 120 Q200 92 150 90 Q100 92 90 120 Z", c) + [[120, 62], [140, 54], [162, 54], [182, 62], [130, 74], [170, 74], [150, 66]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="${detail(c)}"/>`).join("") },
    { id: "undercut", name: "Undercut",
      hinten: c => flaeche("M96 128 Q92 60 150 58 Q208 60 204 128 L200 140 Q150 134 100 140 Z", detail(c, 0.12)),
      vorne: c => flaeche("M98 106 Q94 36 152 34 Q206 38 202 106 Q192 78 154 72 Q114 76 98 106 Z", c) + linie("M132 40 Q150 52 176 46", detail(c), 3) + kappeGlanz(c) +
        linie("M96 112 L96 132 M204 112 L204 132", detail(c, 0.12), 6) },
    { id: "schulterlang", name: "Schulterlang",
      hinten: c => flaeche("M88 124 Q84 46 150 46 Q216 46 212 124 L216 200 Q202 212 188 204 L150 210 L112 204 Q98 212 84 200 Z", c) + linie("M98 150 L96 196 M202 150 L204 196", detail(c), 3),
      vorne: c => flaeche("M94 124 Q92 50 150 48 Q208 50 206 124 Q196 84 154 64 L146 64 Q104 84 94 124 Z", c) + kappeGlanz(c) }
  ], "lang");
  const vAusschnitt = linie("M134 188 L150 206 L166 188", D, 3);
  const kragen = (c) => flaeche("M128 184 L150 200 L136 214 L120 194 Z", c) + flaeche("M172 184 L150 200 L164 214 L180 194 Z", c);
  zuerst(oberteile, [
    { id: "trikot", name: "Fußball-Trikot",
      rumpf: c => flaeche(rumpfT, c) + flaeche("M102 190 L114 190 L116 306 L108 306 Q108 248 102 190 Z", "#fff") + flaeche("M198 190 L186 190 L184 306 L192 306 Q192 248 198 190 Z", "#fff") + vAusschnitt +
        `<text x="150" y="268" font-size="44" font-weight="700" text-anchor="middle" fill="${hell(c) ? D : "#fff"}" stroke="${D}" stroke-width="1.5" font-family="Fredoka, Arial">10</text>`,
      aermel: c => aermel(0, .32, 36, c) + aermel(.27, .32, 37, "#fff") },
    { id: "hemd", name: "Karohemd",
      rumpf: c => muster(rumpfT, c, [104, 128, 152, 176].map(x => `<rect x="${x}" y="176" width="10" height="140" fill="${detail(c, 0.3)}" opacity=".55"/>`).join("") + [204, 232, 260, 288].map(y => `<rect x="96" y="${y}" width="110" height="10" fill="${detail(c, 0.3)}" opacity=".55"/>`).join("")) +
        kragen(ton(c, 0.25)) + [222, 248, 274].map(y => kreis(150, y, 4, "#fff")).join("") + linie("M150 206 L150 306", D, 2.5),
      aermel: c => aermel(0, .9, 32, c) + aermel(.84, .9, 34, detail(c, 0.25)) },
    { id: "polo", name: "Polo-Shirt",
      rumpf: c => flaeche(rumpfT, c) + kragen(ton(c, 0.3)) + linie("M150 200 L150 230", D, 2.5) + kreis(150, 214, 3.5, "#fff") + kreis(150, 226, 3.5, "#fff") + falten(c),
      aermel: c => aermel(0, .32, 36, c) + aermel(.27, .32, 37, ton(c, 0.3)) },
    { id: "dinoshirt", name: "Dino-Shirt",
      rumpf: c => flaeche(rumpfT, c) + ausschnitt + `<g transform="translate(150 250)"><path d="M-30 18 Q-34 -6 -10 -8 L8 -8 Q14 -30 30 -26 Q40 -20 32 -10 L22 -10 L20 10 L26 26 L16 26 L12 14 L-12 14 L-14 26 L-24 26 L-22 14 Q-40 20 -46 8 Z" fill="#5CCB6A" stroke="${D}" stroke-width="2.5" stroke-linejoin="round"/>` +
        `<path d="M-22 -6 l4 -8 l4 8 M-10 -8 l4 -9 l4 9 M2 -8 l4 -9 l4 9" fill="#3E9E5A" stroke="${D}" stroke-width="2"/><circle cx="26" cy="-19" r="2.5" fill="${D}"/></g>`,
      aermel: c => aermel(0, .32, 36, c) },
    { id: "raketenshirt", name: "Raketen-Shirt",
      rumpf: c => flaeche(rumpfT, c) + ausschnitt + `<g transform="translate(150 252) rotate(30)"><path d="M0 -40 Q16 -22 14 14 L-14 14 Q-16 -22 0 -40 Z" fill="#fff" stroke="${D}" stroke-width="2.5"/>` +
        `<circle cx="0" cy="-12" r="6" fill="#4FA8F0" stroke="${D}" stroke-width="2"/><path d="M-14 4 L-24 20 L-12 14 Z M14 4 L24 20 L12 14 Z" fill="#E8463B" stroke="${D}" stroke-width="2"/><path d="M-8 16 Q0 34 8 16 Z" fill="#FFC83D"/></g>` +
        funkeln([[118, 222, 4], [184, 288, 4], [122, 290, 3]], "#FFE27A"),
      aermel: c => aermel(0, .32, 36, c) },
    { id: "heldenshirt", name: "Superhelden-Shirt",
      rumpf: c => flaeche(rumpfT, c) + ausschnitt + kreis(150, 248, 28, "#FFC83D") + flaeche("M156 226 L136 252 L150 252 L142 272 L166 242 L152 242 L160 226 Z", "#E8463B") +
        `<rect x="108" y="290" width="84" height="12" rx="4" fill="#FFC83D" stroke="${D}" stroke-width="2.5"/>`,
      aermel: c => aermel(0, .9, 32, c) + aermel(.84, .9, 34, "#FFC83D") }
  ], "tshirt");
  zuerst(unterteile, [
    { id: "cargo", name: "Cargohose",
      teil: c => glied(134, 320, 132, 512, 38, c) + glied(166, 320, 168, 512, 38, c) + flaeche(huefte, c) +
        `<rect x="104" y="392" width="22" height="30" rx="4" fill="${detail(c, 0.18)}" stroke="${D}" stroke-width="2.5"/><rect x="174" y="392" width="22" height="30" rx="4" fill="${detail(c, 0.18)}" stroke="${D}" stroke-width="2.5"/>` +
        linie("M106 400 L124 400 M176 400 L194 400", D, 2) + naht(c) + glied(132, 504, 132, 512, 40, detail(c)) + glied(168, 504, 168, 512, 40, detail(c)) },
    { id: "bermuda", name: "Bermudas",
      teil: c => glied(134, 320, 133, 420, 40, c) + glied(166, 320, 167, 420, 40, c) + flaeche(huefte, c) + naht(c) +
        glied(133, 414, 133, 420, 42, detail(c)) + glied(167, 414, 167, 420, 42, detail(c)) + linie("M118 340 L118 380 M182 340 L182 380", glanzFarbe(c), 2.5, 'stroke-dasharray="4 4"') }
  ], "hose");
  const beinPaar = (c, bis = 512, w = 38) => glied(134, 318, 132, bis, w, c) + glied(166, 318, 168, bis, w, c) + flaeche(huefte, c);
  zuerst(kleider, [
    { id: "ritter", name: "Ritter-Rüstung",
      rock: c => beinPaar("#B8C2CF") + linie("M132 440 L132 470 M168 440 L168 470", "#8E99A8", 4) + flaeche("M110 286 L190 286 L198 372 Q150 382 102 372 Z", c) + linie("M150 300 L150 368 M126 330 L174 330", "#FFC83D", 7),
      rumpf: c => flaeche(rumpfT, "#B8C2CF") + flaeche("M118 196 Q150 188 182 196 L180 292 Q150 300 120 292 Z", "#D3DAE3") + glanz("M126 210 L128 280", "#D3DAE3", 4) + flaeche("M136 222 L164 222 L164 246 Q150 262 136 246 Z", c),
      aermel: () => aermel(0, .9, 32, "#B8C2CF") + aermel(0, .14, 38, "#D3DAE3") },
    { id: "astronaut", name: "Astronaut", preis: 2,
      rock: () => beinPaar("#F4F6FA", 512, 42) + glied(132, 494, 132, 512, 44, "#C9D2DE") + glied(168, 494, 168, 512, 44, "#C9D2DE"),
      rumpf: c => flaeche(rumpfT, "#F4F6FA") + `<rect x="128" y="226" width="44" height="34" rx="6" fill="${c}" stroke="${D}" stroke-width="2.5"/>` + kreis(140, 236, 4, "#FFC83D", false) + kreis(152, 236, 4, "#5CCB6A", false) + kreis(164, 236, 4, "#E8463B", false) +
        `<rect x="134" y="246" width="32" height="6" rx="3" fill="#fff"/>` + linie("M104 290 L196 290", "#C9D2DE", 6),
      aermel: c => aermel(0, .9, 34, "#F4F6FA") + aermel(.84, .92, 36, c) },
    { id: "pirat", name: "Pirat",
      rock: c => beinPaar("#3A3550", 470) + glied(132, 462, 132, 470, 40, "#fff") + glied(168, 462, 168, 470, 40, "#fff"),
      rumpf: c => flaeche(rumpfT, "#fff") + linie("M130 188 L150 220 L170 188", D, 2.5) + flaeche("M102 190 Q118 186 128 190 L138 306 Q120 314 108 306 Q108 248 102 190 Z", c) + flaeche("M198 190 Q182 186 172 190 L162 306 Q180 314 192 306 Q192 248 198 190 Z", c) +
        `<rect x="106" y="282" width="88" height="14" rx="4" fill="#5A3A22" stroke="${D}" stroke-width="2.5"/><rect x="142" y="280" width="16" height="18" rx="2" fill="#FFC83D" stroke="${D}" stroke-width="2"/>`,
      aermel: () => aermel(0, .9, 34, "#fff") },
    { id: "feuerwehr", name: "Feuerwehr",
      rock: c => beinPaar(c) + glied(132, 440, 132, 448, 40, "#FFE27A") + glied(168, 440, 168, 448, 40, "#FFE27A"),
      rumpf: c => flaeche(rumpfT, c) + `<rect x="104" y="248" width="92" height="12" fill="#FFE27A" stroke="${D}" stroke-width="2"/><rect x="104" y="280" width="92" height="12" fill="#FFE27A" stroke="${D}" stroke-width="2"/>` + linie("M150 192 L150 306", D, 2.5),
      aermel: c => aermel(0, .9, 32, c) + aermel(.55, .62, 33, "#FFE27A") },
    { id: "dinokostuem", name: "Dino-Kostüm", preis: 2,
      rock: c => flaeche("M196 300 Q262 330 270 420 Q240 380 196 360 Z", c) + beinPaar(c, 500, 42) + flaeche("M126 300 Q150 292 174 300 L172 370 Q150 380 128 370 Z", ton(c, 0.45)),
      rumpf: c => flaeche(rumpfT, c) + flaeche("M128 200 Q150 194 172 200 L170 298 Q150 306 130 298 Z", ton(c, 0.45)) + [210, 236, 262, 288].map(y => linie(`M134 ${y} L166 ${y}`, ton(c, 0.25), 2.5)).join("") +
        `<path d="M196 196 l14 6 l-10 10 l14 8 l-12 10 l12 10 l-14 6" fill="${detail(c, 0.2)}" stroke="${D}" stroke-width="2.5" stroke-linejoin="round"/>`,
      aermel: c => aermel(0, .9, 34, c) }
  ], null);
  zuerst(schuhe, [
    { id: "fussballschuhe", name: "Fußballschuhe",
      teil: c => fussPaar(x => `<rect x="${x - 23}" y="532" width="46" height="22" rx="11" fill="${c}" stroke="${D}" stroke-width="3"/>` + linie(`M${x - 12} 538 l18 10`, hell(c) ? D : "#fff", 4) +
        [-16, -6, 4, 14].map(d => `<rect x="${x + d - 3}" y="554" width="6" height="8" rx="2" fill="${D}"/>`).join("")) },
    { id: "sneaker", name: "Sneaker (hoch)",
      teil: c => glied(132, 512, 131, 540, 32, c) + glied(168, 512, 169, 540, 32, c) + fussPaar(x => `<rect x="${x - 23}" y="530" width="46" height="24" rx="11" fill="${c}" stroke="${D}" stroke-width="3"/>` +
        `<rect x="${x - 25}" y="550" width="50" height="9" rx="4" fill="#fff" stroke="${D}" stroke-width="3"/>` + linie(`M${x - 6} 516 l12 0 M${x - 6} 524 l12 0 M${x - 6} 532 l12 0`, "#fff", 2.5) + kreis(x + 10, 540, 5, "#FFC83D")) }
  ], "turn");
  zuerst(extras, [
    { id: "cap", name: "Basecap", ebene: "kopf", farbe: "#3AA0E0",
      teil: c => flaeche("M94 94 Q94 38 150 36 Q206 38 206 94 Z", c) + flaeche("M90 92 Q150 104 210 92 L218 104 Q150 122 82 104 Z", detail(c, 0.2)) + kreis(150, 38, 6, detail(c, 0.2)) + glanz("M112 60 Q130 46 150 44", c, 5) },
    { id: "piratenhut", name: "Piratenhut", ebene: "kopf", farbe: "#2E2B47",
      teil: c => flaeche("M80 88 Q100 34 150 30 Q200 34 220 88 Q150 70 80 88 Z", c) + linie("M86 84 Q150 66 214 84", "#FFC83D", 4) +
        kreis(150, 54, 11, "#fff", false) + `<circle cx="146" cy="52" r="2.2" fill="${D}"/><circle cx="154" cy="52" r="2.2" fill="${D}"/>` + linie("M138 68 L162 76 M162 68 L138 76", "#fff", 3) },
    { id: "augenklappe", name: "Augenklappe", ebene: "kopf", farbe: "#2A2230",
      teil: c => linie("M96 104 L206 148", c, 4) + `<ellipse cx="170" cy="128" rx="16" ry="14" fill="${c}" stroke="${D}" stroke-width="2.5"/>` },
    { id: "maske", name: "Helden-Maske", ebene: "kopf", farbe: "#E8463B",
      teil: c => `<path d="M100 118 Q150 104 200 118 L198 140 Q174 148 150 136 Q126 148 102 140 Z M118 128 a12 9 0 1 0 24 0 a12 9 0 1 0 -24 0 Z M158 128 a12 9 0 1 0 24 0 a12 9 0 1 0 -24 0 Z" fill="${c}" fill-rule="evenodd" stroke="${D}" stroke-width="3" stroke-linejoin="round"/>` +
        linie("M100 124 L84 118 M200 124 L216 118", c, 6) },
    { id: "fliege", name: "Fliege", ebene: "hals", farbe: "#E8463B",
      teil: c => flaeche("M150 196 L128 184 L128 208 Z", c) + flaeche("M150 196 L172 184 L172 208 Z", c) + kreis(150, 196, 6, detail(c)) },
    { id: "fussball", name: "Fußball", ebene: "hand", farbe: "#FFFFFF",
      teil: c => kreis(224, 392, 23, c) + `<path d="M224 382 l9 6 l-3 10 h-12 l-3 -10 z" fill="${D}"/>` + linie("M224 382 L224 370 M233 388 L245 384 M230 398 L238 410 M218 398 L210 410 M215 388 L203 384", D, 2.5) },
    { id: "kuscheldino", name: "Kuschel-Dino", ebene: "hand", farbe: "#5CCB6A", preis: 2,
      teil: c => `<ellipse cx="224" cy="398" rx="24" ry="18" fill="${c}" stroke="${D}" stroke-width="3"/>` + kreis(240, 372, 13, c) + `<circle cx="244" cy="369" r="2.4" fill="${D}"/>` +
        `<path d="M206 384 l5 -9 l5 9 M218 380 l5 -10 l5 10" fill="${detail(c, 0.25)}" stroke="${D}" stroke-width="2"/>` + `<ellipse cx="224" cy="404" rx="12" ry="8" fill="${ton(c, 0.45)}"/>` },
    { id: "schwert", name: "Holzschwert", ebene: "hand", farbe: "#C9A266",
      teil: c => linie("M86 356 L58 262", D, 13) + linie("M86 356 L58 262", c, 8) + linie("M72 330 L98 322", D, 10) + linie("M72 330 L98 322", "#8A5A34", 6) + glanz("M80 340 L64 284", c, 2.5) }
  ], null);

  window.Puppe = { D, ton, koerper, gesichter, haare, oberteile, unterteile, kleider, schuhe, extras, orte };
})();
