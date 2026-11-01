// Entwurf 2: Hund detailreich, Dreiviertelansicht, sitzend. stil "a" = dunkle Kontur (Stil A), "b" = feine Kontur im Fellton
function hund(st, stil, f = { h: "#D9A35B", s: "#B97F3E", l: "#F6E2BE", d: "#8A5A2B", o: "#6B4220" }) {
  const KF = stil === "a" ? "#3B1F63" : f.o, KW = stil === "a" ? 3.2 : 2.2;
  const P = (d, fill, extra = "") => `<path d="${d}" fill="${fill}" stroke="${KF}" stroke-width="${KW}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
  const F = (d, fill, op = 1) => `<path d="${d}" fill="${fill}" opacity="${op}"/>`;
  const L = (d, farbe = KF, w = KW, op = 1) => `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${op}"/>`;
  const M = [{ by: 0.66, bx: 0.95, ks: 1.34, nx: 76, ps: 1.28, ol: 1.15 }, { by: 0.83, bx: 0.98, ks: 1.13, nx: 66, ps: 1.12, ol: 1.05 }, { by: 1, bx: 1, ks: 1, nx: 56, ps: 1, ol: 1 }][st];
  const id = "h" + st + stil + Math.random().toString(36).slice(2, 6);
  const KOERPER = "M116 152 C98 186 104 234 128 266 L208 266 C224 236 212 186 178 160 C160 146 130 140 116 152 Z";
  const KEULE = "M148 254 C136 206 174 180 212 190 C246 200 252 248 230 266 L160 268 Z";
  let nb = 0;
  const bein = (x0, x1, farbe) => { const g = id + "v" + (nb++); return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${farbe}" stop-opacity="0"/><stop offset=".32" stop-color="${farbe}"/></linearGradient></defs>` + F(`M${x0} 194 C${x0 - 3} 222 ${x0 - 1} 246 ${x0 + 2} 264 L${x1 - 2} 264 C${x1 - 5} 240 ${x1 - 4} 218 ${x1} 194 Z`, `url(#${g})`) +
    L(`M${x0 + 1} 212 C${x0 - 2} 230 ${x0 - 1} 248 ${x0 + 2} 264 M${x1 - 1} 206 C${x1 - 4} 224 ${x1 - 5} 242 ${x1 - 2} 264`); };
  const body = `<g transform="translate(150 272) scale(${M.bx} ${M.by}) translate(-150 -272)">
    ${P("M208 230 C248 224 264 190 254 160 C250 150 238 152 241 162 C248 190 232 210 204 216 Z", f.h)}
    ${L("M243 172 l7 -3 M246 186 l8 -1 M240 200 l7 2", f.d, 1.8, 0.6)}
    ${P(KEULE, f.h)}
    <clipPath id="${id}k"><path d="${KEULE}"/></clipPath>
    <g clip-path="url(#${id}k)">${F("M150 268 C162 238 200 228 240 240 L242 272 Z", f.s)}${L("M184 198 C200 196 214 202 222 214", f.l, 3, 0.8)}</g>
    ${P(KOERPER, f.h)}
    <clipPath id="${id}b"><path d="${KOERPER}"/></clipPath>
    <g clip-path="url(#${id}b)">
      ${F("M180 152 C216 182 224 238 208 268 L184 268 C198 230 190 188 170 162 Z", f.s)}
      ${F("M112 166 C106 196 114 228 132 250 C146 228 150 196 142 166 C134 156 118 156 112 166 Z", f.l)}
      ${L("M118 184 l5 5 M116 202 l6 4 M120 220 l5 5 M162 176 l6 3", f.d, 1.6, 0.5)}
    </g>
    ${bein(150, 172, f.s)}
    ${bein(122, 148, f.h)}
  </g>`;
  const pf = (x, farbe) => P(`M${x - 13 * M.ps} 271 C${x - 15 * M.ps} ${262 - 5 * M.ps} ${x + 12 * M.ps} ${261 - 5 * M.ps} ${x + 14 * M.ps} 271 Z`, farbe) + L(`M${x - 4 * M.ps} 271 l0 -5 M${x + 4 * M.ps} 271 l0 -5`, KF, 1.6, 0.8);
  const halsY = 272 - (272 - 150) * M.by;
  const n = M.nx;   // Schnauzenspitze (x); Welpe kurz, Hund lang
  const KOPF = `M120 58 C142 56 162 70 162 95 C162 117 150 131 128 135 C112 137 100 135 90 132 C${n + 20} 130 ${n + 4} 126 ${n} 117 C${n - 2} 109 ${n + 3} 101 ${n + 13} 100 C${n + 26} 99 ${92} 95 ${98} 85 C102 72 108 60 120 58 Z`;
  const kopf = `<g transform="translate(124 ${halsY - 36 * M.ks}) scale(${M.ks}) translate(-124 -100)">
    ${P("M104 66 C96 58 86 64 88 76 C90 84 98 84 102 78 Z", f.d)}
    ${P(KOPF, f.h)}
    <clipPath id="${id}s"><path d="${KOPF}"/></clipPath>
    <g clip-path="url(#${id}s)">
      ${F("M148 58 C172 88 166 128 136 138 L176 142 L180 58 Z", f.s)}
      ${F(`M${n - 4} 112 C${n + 2} 102 ${n + 18} 98 ${n + 34} 100 C${n + 46} 106 108 118 104 132 C90 138 ${n + 10} 134 ${n - 2} 124 Z`, f.l)}
      ${F("M90 128 C110 140 134 140 150 130 L150 150 L86 150 Z", f.s, 0.7)}
      ${L("M126 64 l2 -5 M134 66 l3 -5 M118 64 l0 -5", f.d, 1.4, 0.5)}
    </g>
    ${P(`M${n - 3} 110 C${n - 5} 103 ${n + 7} 99 ${n + 14} 104 C${n + 17} 111 ${n + 11} 117 ${n + 4} 116 C${n} 115 ${n - 3} 113 ${n - 3} 110 Z`, "#2A2230")}
    <ellipse cx="${n + 4}" cy="104.5" rx="3.2" ry="1.7" fill="#fff" opacity=".75"/>
    ${L(`M${n + 6} 117 C${n + 6} 122 ${n + 10} 125 ${n + 16} 124 C${n + 24} 128 ${n + 32} 127 ${n + 38} 123`, "#3B1F63", 2.2)}
    ${st === 0 ? `<path d="M${n + 15} 124 C${n + 15} 133 ${n + 25} 133 ${n + 25} 125" fill="#E8798A" stroke="#3B1F63" stroke-width="1.6"/>` : ""}
    <ellipse cx="110" cy="90" rx="${5.6 + (2 - st) * 0.6}" ry="${6.2 + (2 - st) * 0.6}" fill="#4A2A12" stroke="#2A1608" stroke-width="1.2"/>
    <circle cx="110" cy="90.5" r="${3.3 + (2 - st) * 0.4}" fill="#1A0E08"/>
    <circle cx="112.3" cy="87.6" r="1.7" fill="#fff"/><circle cx="108.4" cy="93" r=".8" fill="#fff" opacity=".7"/>
    ${L("M103 84 C107 81 113 81 117 83", f.d, 1.8, 0.8)}
    <g transform="translate(140 66) scale(1 ${M.ol}) translate(-140 -66)">
      ${P("M134 64 C150 58 167 66 169 85 C171 106 163 124 152 126 C145 118 145 98 139 80 Z", f.d)}
      ${L("M148 72 C154 88 156 104 154 118", "#000", 1.8, 0.22)}
    </g>
  </g>`;
  return `<ellipse cx="160" cy="273" rx="${66 + st * 10}" ry="8" fill="#3B1F63" opacity=".14"/>` + body + pf(166, f.s) + pf(136, f.h) + kopf;
}
if (typeof module !== "undefined") module.exports = { hund };
