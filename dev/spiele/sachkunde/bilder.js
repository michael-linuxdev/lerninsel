// Zeichnungen für Sachkunde (eigene, einfache Figuren). viewBox 0 0 220 260.
(function () {
  const D = "#3b1f63";
  const s = `stroke="${D}" stroke-width="4" stroke-linejoin="round"`;
  const gesicht = (x, y, bart = "#fff", lang = 1) =>
    `<circle cx="${x}" cy="${y}" r="28" fill="#F8D2B8" ${s}/>` +
    `<path d="M${x - 30} ${y + 2} Q${x - 34} ${y + 50 * lang} ${x} ${y + 62 * lang} Q${x + 34} ${y + 50 * lang} ${x + 30} ${y + 2} Q${x + 18} ${y + 18} ${x} ${y + 16} Q${x - 18} ${y + 18} ${x - 30} ${y + 2} Z" fill="${bart}" ${s}/>` +
    `<path d="M${x - 16} ${y + 12} Q${x - 8} ${y + 4} ${x} ${y + 12} Q${x + 8} ${y + 4} ${x + 16} ${y + 12}" fill="#fff" ${s}/>` +
    `<circle cx="${x - 9}" cy="${y - 4}" r="3.5" fill="${D}"/><circle cx="${x + 9}" cy="${y - 4}" r="3.5" fill="${D}"/>` +
    `<circle cx="${x}" cy="${y + 4}" r="6" fill="#F0A08A" ${s}/><circle cx="${x - 18}" cy="${y + 4}" r="5" fill="#FF8FA3" opacity=".5"/><circle cx="${x + 18}" cy="${y + 4}" r="5" fill="#FF8FA3" opacity=".5"/>`;

  const B = {
    weihnachtsmann: `
      <path d="M150 120 Q190 112 192 160 Q190 200 150 196 Z" fill="#A0693F" ${s}/><path d="M160 120 Q170 108 178 118" fill="none" ${s}/>
      <path d="M72 120 Q110 104 148 120 L162 228 Q110 244 58 228 Z" fill="#D7263D" ${s}/>
      <path d="M58 222 Q110 240 162 222 L163 234 Q110 252 57 234 Z" fill="#fff" ${s}/>
      <rect x="104" y="126" width="12" height="100" fill="#fff" opacity=".9"/>
      <rect x="64" y="176" width="92" height="12" fill="${D}"/><rect x="100" y="173" width="20" height="18" rx="3" fill="#FFC83D" ${s}/>
      <rect x="78" y="236" width="24" height="14" rx="5" fill="${D}"/><rect x="118" y="236" width="24" height="14" rx="5" fill="${D}"/>
      ${gesicht(110, 92)}
      <path d="M80 80 Q110 20 150 50 Q160 70 170 96" fill="#D7263D" ${s}/><circle cx="172" cy="100" r="10" fill="#fff" ${s}/>
      <rect x="78" y="72" width="66" height="16" rx="8" fill="#fff" ${s}/>`,
    santa: `
      <path d="M66 124 Q110 108 154 124 Q170 170 156 196 L64 196 Q50 170 66 124 Z" fill="#E0312B" ${s}/>
      <rect x="64" y="166" width="92" height="14" fill="${D}"/><rect x="98" y="162" width="24" height="22" rx="4" fill="#FFC83D" ${s}/><rect x="104" y="168" width="12" height="10" fill="#E0312B"/>
      <path d="M66 190 L154 190 L150 214 L70 214 Z" fill="#fff" ${s}/>
      <rect x="74" y="210" width="28" height="30" fill="#E0312B" ${s}/><rect x="118" y="210" width="28" height="30" fill="#E0312B" ${s}/>
      <path d="M68 236 h38 v14 h-44 Z M114 236 h38 l6 14 h-44 Z" fill="${D}"/>
      ${gesicht(110, 92)}
      <circle cx="101" cy="88" r="9" fill="none" stroke="${D}" stroke-width="3"/><circle cx="119" cy="88" r="9" fill="none" stroke="${D}" stroke-width="3"/><path d="M110 88 h0" stroke="${D}"/>
      <path d="M82 74 Q100 30 142 56 L156 92" fill="#E0312B" ${s}/><circle cx="158" cy="96" r="10" fill="#fff" ${s}/>
      <rect x="78" y="68" width="66" height="16" rx="8" fill="#fff" ${s}/>
      <g transform="translate(176 200)"><path d="M-10 -24 l-8 -14 M-10 -24 l2 -16 M-10 -24 l-14 -4 M10 -24 l8 -14 M10 -24 l-2 -16 M10 -24 l14 -4" stroke="#8A5A34" stroke-width="4" stroke-linecap="round"/><ellipse rx="18" ry="20" cy="-6" fill="#B8804A" ${s}/><circle cy="8" r="7" fill="#E0312B"/><circle cx="-7" cy="-12" r="3" fill="${D}"/><circle cx="7" cy="-12" r="3" fill="${D}"/></g>`,
    dedmoros: `
      <line x1="44" y1="60" x2="52" y2="250" stroke="#C9D6E8" stroke-width="10" stroke-linecap="round"/><line x1="44" y1="60" x2="52" y2="250" stroke="${D}" stroke-width="3" stroke-dasharray="2 18"/>
      <g transform="translate(43 50)" fill="#9FD8FF" ${s}><path d="M0 -18 L5 -5 L18 0 L5 5 L0 18 L-5 5 L-18 0 L-5 -5 Z"/></g>
      <path d="M74 122 Q110 108 146 122 L170 252 Q110 262 50 252 Z" fill="#2F6FC0" ${s}/>
      <path d="M104 122 L116 122 L118 252 L102 252 Z" fill="#fff"/><path d="M50 246 Q110 258 170 246 L172 256 Q110 266 48 256 Z" fill="#fff" ${s}/>
      ${[[78, 170], [140, 186], [86, 214], [134, 226], [120, 150]].map(([x, y]) => `<g transform="translate(${x} ${y})" stroke="#DDEBFF" stroke-width="2.5" stroke-linecap="round"><path d="M0 -8 V8 M-7 -4 L7 4 M-7 4 L7 -4"/></g>`).join("")}
      <path d="M62 140 Q50 170 60 196" stroke="#2F6FC0" stroke-width="20" fill="none" stroke-linecap="round"/><circle cx="56" cy="200" r="11" fill="#fff" ${s}/>
      ${gesicht(110, 92, "#fff", 1.5)}
      <path d="M78 74 Q76 40 110 38 Q144 40 142 74 Z" fill="#2F6FC0" ${s}/><rect x="76" y="66" width="68" height="16" rx="8" fill="#fff" ${s}/>`,
    snegurotschka: `
      <path d="M80 124 Q110 112 140 124 L160 250 Q110 260 60 250 Z" fill="#8FD0F5" ${s}/>
      <path d="M104 124 L116 124 L118 250 L102 250 Z" fill="#fff"/><path d="M60 244 Q110 256 160 244 L162 254 Q110 264 58 254 Z" fill="#fff" ${s}/>
      ${[[84, 180], [136, 200], [118, 160]].map(([x, y]) => `<g transform="translate(${x} ${y})" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><path d="M0 -7 V7 M-6 -3 L6 3 M-6 3 L6 -3"/></g>`).join("")}
      <path d="M138 96 Q160 130 150 200" stroke="#F4CD6A" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M142 110 l8 6 M146 130 l8 4 M148 150 l8 4 M148 170 l8 4" stroke="#C99A3A" stroke-width="3"/>
      <circle cx="110" cy="92" r="27" fill="#F8D2B8" ${s}/><path d="M84 86 Q90 62 110 62 Q130 62 136 86 Q120 74 110 76 Q98 74 84 86 Z" fill="#F4CD6A" ${s}/>
      <circle cx="101" cy="92" r="3.5" fill="${D}"/><circle cx="119" cy="92" r="3.5" fill="${D}"/><path d="M102 104 Q110 110 118 104" stroke="${D}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="92" cy="100" r="5" fill="#FF8FA3" opacity=".5"/><circle cx="128" cy="100" r="5" fill="#FF8FA3" opacity=".5"/>
      <path d="M80 68 Q80 40 110 32 Q140 40 140 68 Q110 58 80 68 Z" fill="#DDEBFF" ${s}/><circle cx="110" cy="46" r="5" fill="#9FD8FF" ${s}/>`,
    stiefel: `
      <path d="M60 238 L60 170 Q60 150 80 150 L100 150 L100 238 Z" fill="#7A3E18" ${s}/><path d="M60 232 h74 q10 0 10 10 v6 h-84 Z" fill="#5C2E12" ${s}/>
      <path d="M58 150 Q80 140 102 150 L100 160 L60 160 Z" fill="#fff" ${s}/>
      <path d="M74 150 Q70 110 90 100 Q96 120 92 150 Z" fill="#E0457B" ${s}/><circle cx="84" cy="112" r="10" fill="#FFD84D" ${s}/>
      <path d="M140 238 L140 170 Q140 150 160 150 L180 150 L180 238 Z" fill="#7A3E18" ${s}/><path d="M140 232 h74 q10 0 10 10 v6 h-84 Z" fill="#5C2E12" ${s}/>
      <path d="M138 150 Q160 140 182 150 L180 160 L140 160 Z" fill="#fff" ${s}/><circle cx="160" cy="128" r="14" fill="#FF6F61" ${s}/><circle cx="168" cy="120" r="10" fill="#5CCBA6" ${s}/>
      ${[[40, 60], [110, 40], [180, 70]].map(([x, y]) => `<path d="M${x} ${y - 12} L${x + 4} ${y - 4} L${x + 12} ${y} L${x + 4} ${y + 4} L${x} ${y + 12} L${x - 4} ${y + 4} L${x - 12} ${y} L${x - 4} ${y - 4} Z" fill="#FFD84D"/>`).join("")}`,
    nikolaus: `
      <path d="M176 40 Q196 40 196 60 Q196 78 178 78 Q166 76 168 64" stroke="#E8B830" stroke-width="9" fill="none" stroke-linecap="round"/><line x1="176" y1="60" x2="168" y2="252" stroke="#E8B830" stroke-width="9" stroke-linecap="round"/><line x1="176" y1="60" x2="168" y2="252" stroke="${D}" stroke-width="2" stroke-dasharray="1 24"/>
      <path d="M70 124 Q110 110 150 124 L168 252 Q110 262 52 252 Z" fill="#fff" ${s}/>
      <path d="M68 124 Q110 112 152 124 L162 210 Q110 222 58 210 Z" fill="#C8102E" ${s}/>
      <path d="M100 124 L120 124 L118 214 L102 214 Z" fill="#E8B830" ${s}/><path d="M110 150 v30 M100 162 h20" stroke="#C8102E" stroke-width="5"/>
      <path d="M150 140 Q170 150 172 170" stroke="#C8102E" stroke-width="20" fill="none" stroke-linecap="round"/><circle cx="172" cy="176" r="10" fill="#F8D2B8" ${s}/>
      <path d="M70 140 Q52 160 60 196" stroke="#C8102E" stroke-width="20" fill="none" stroke-linecap="round"/>
      <rect x="40" y="186" width="40" height="30" rx="4" fill="#8A5A34" ${s}/><path d="M60 186 v30" stroke="#E8B830" stroke-width="3"/>
      ${gesicht(110, 96, "#fff", 1.2)}
      <path d="M80 80 L84 34 Q110 6 136 34 L140 80 Q110 70 80 80 Z" fill="#C8102E" ${s}/><path d="M110 18 L110 76" stroke="#E8B830" stroke-width="6"/><path d="M98 44 H122" stroke="#E8B830" stroke-width="6"/>
      <path d="M80 80 Q110 70 140 80" stroke="#E8B830" stroke-width="7" fill="none"/>`,
    baum: `
      <rect x="98" y="210" width="24" height="34" fill="#8A5A34" ${s}/>
      <path d="M110 30 L170 120 L140 120 L186 186 L150 186 L196 222 L24 222 L70 186 L34 186 L80 120 L50 120 Z" fill="#2E9C5A" ${s}/>
      ${[[90, 110, "#E0312B"], [132, 132, "#FFC83D"], [80, 170, "#3AA0E0"], [140, 196, "#E0457B"], [110, 160, "#FFC83D"], [64, 206, "#E0312B"], [160, 206, "#3AA0E0"]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="9" fill="${c}" ${s}/>`).join("")}
      <path d="M110 6 L117 24 L136 24 L121 35 L127 54 L110 42 L93 54 L99 35 L84 24 L103 24 Z" fill="#FFC83D" ${s}/>
      <rect x="20" y="226" width="40" height="28" rx="4" fill="#E0457B" ${s}/><rect x="36" y="226" width="8" height="28" fill="#FFC83D"/>
      <rect x="160" y="230" width="44" height="24" rx="4" fill="#3AA0E0" ${s}/><rect x="178" y="230" width="8" height="24" fill="#fff"/>`,
    kamin: `
      <rect x="40" y="70" width="140" height="180" fill="#C2572B" ${s}/>
      ${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M40 ${96 + i * 26} H180" stroke="#9A3F1C" stroke-width="3"/>`).join("")}
      <rect x="30" y="56" width="160" height="20" fill="#8A5A34" ${s}/>
      <rect x="70" y="150" width="80" height="100" rx="40" fill="#3b1f63"/><path d="M90 250 Q100 200 110 230 Q118 190 130 250 Z" fill="#FFA94D"/><path d="M100 250 Q106 220 112 236 Q118 214 122 250 Z" fill="#FFD84D"/>
      ${[[70, 108], [110, 102], [150, 108]].map(([x, y], i) => `<path d="M${x - 12} ${y} h24 v26 l-10 10 h-14 v-10 Z" fill="${["#E0312B", "#5CCBA6", "#FFC83D"][i]}" ${s}/>`).join("")}
      <g transform="translate(150 20) scale(.5)"><path d="M0 0 Q20 -20 40 0" stroke="#fff" stroke-width="6" fill="none"/></g>`,
    troika: `
      <path d="M10 236 Q110 250 214 232" stroke="#C9D6E8" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M150 168 L206 168 Q214 168 212 178 L206 206 L150 206 Z" fill="#2F6FC0" ${s}/><path d="M146 168 Q140 150 156 148 L160 168" fill="#2F6FC0" ${s}/>
      <path d="M140 222 L214 222 Q222 222 222 212" stroke="#FFC83D" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M156 206 v16 M200 206 v16" stroke="${D}" stroke-width="4"/>
      ${[[124, 150, "#8A5A34", 1], [80, 172, "#F2E9DC", 1.05], [38, 194, "#5C3A21", 1]].map(([x, y, c, k]) => `<g transform="translate(${x} ${y}) scale(${k})">
        <path d="M-20 10 l-4 30 M-10 12 l2 30 M16 10 l-4 30 M24 8 l4 30" stroke="${D}" stroke-width="6" stroke-linecap="round"/>
        <path d="M-20 10 l-4 30 M-10 12 l2 30 M16 10 l-4 30 M24 8 l4 30" stroke="${c}" stroke-width="3" stroke-linecap="round"/>
        <path d="M28 -6 Q44 0 40 22" stroke="${D}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <ellipse cx="2" cy="0" rx="30" ry="15" fill="${c}" ${s}/>
        <path d="M-22 -4 L-34 -32 L-22 -36 L-12 -8 Z" fill="${c}" ${s}/>
        <path d="M-36 -40 Q-52 -36 -54 -26 Q-50 -20 -40 -24 L-26 -30 Z" fill="${c}" ${s}/>
        <path d="M-24 -38 L-20 -48 L-30 -40" fill="${c}" ${s}/><circle cx="-38" cy="-32" r="2.5" fill="${D}"/>
        <path d="M-20 -36 Q-12 -22 -10 -6" stroke="${D}" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M-28 -8 Q2 -2 26 -10" stroke="#D7263D" stroke-width="4" fill="none"/></g>`).join("")}
      <path d="M64 146 Q80 106 96 146" stroke="#D7263D" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="80" cy="120" r="6" fill="#FFC83D" ${s}/>
      <path d="M146 160 L152 172" stroke="${D}" stroke-width="3"/>
      <circle cx="40" cy="60" r="3" fill="#C9D6E8"/><circle cx="120" cy="40" r="4" fill="#C9D6E8"/><circle cx="180" cy="80" r="3" fill="#C9D6E8"/><circle cx="80" cy="90" r="3" fill="#C9D6E8"/>`,
    geschenk: `
      <rect x="40" y="110" width="140" height="120" rx="8" fill="#E0457B" ${s}/><rect x="30" y="86" width="160" height="34" rx="6" fill="#FF6F9F" ${s}/>
      <rect x="100" y="86" width="20" height="144" fill="#FFC83D" ${s}/>
      <path d="M110 86 Q70 40 60 70 Q60 90 110 86 Q150 90 160 70 Q150 40 110 86 Z" fill="#FFC83D" ${s}/>
      ${[[30, 50], [190, 60], [20, 160], [200, 170]].map(([x, y]) => `<path d="M${x} ${y - 10} L${x + 3} ${y - 3} L${x + 10} ${y} L${x + 3} ${y + 3} L${x} ${y + 10} L${x - 3} ${y + 3} L${x - 10} ${y} L${x - 3} ${y - 3} Z" fill="#FFD84D"/>`).join("")}`,
    eule: `
      <path d="M50 70 L70 40 L84 66 Z M170 70 L150 40 L136 66 Z" fill="#A0693F" ${s}/>
      <ellipse cx="110" cy="150" rx="74" ry="92" fill="#B8804A" ${s}/><ellipse cx="110" cy="176" rx="46" ry="60" fill="#F3DEC0" ${s}/>
      ${[0, 1, 2, 3].map(i => `<path d="M${90 + (i % 2) * 20} ${150 + i * 18} q10 8 20 0" stroke="#C9A26B" stroke-width="3" fill="none"/>`).join("")}
      <circle cx="82" cy="104" r="28" fill="#fff" ${s}/><circle cx="138" cy="104" r="28" fill="#fff" ${s}/>
      <circle cx="86" cy="106" r="13" fill="${D}"/><circle cx="134" cy="106" r="13" fill="${D}"/><circle cx="90" cy="101" r="5" fill="#fff"/><circle cx="138" cy="101" r="5" fill="#fff"/>
      <circle cx="82" cy="104" r="34" fill="none" stroke="#7B55B8" stroke-width="5"/><circle cx="138" cy="104" r="34" fill="none" stroke="#7B55B8" stroke-width="5"/><path d="M116 100 h-12" stroke="#7B55B8" stroke-width="5"/>
      <path d="M100 128 L110 146 L120 128 Z" fill="#FFB03B" ${s}/>
      <path d="M38 150 Q20 190 50 220 Q60 180 50 150 Z M182 150 Q200 190 170 220 Q160 180 170 150 Z" fill="#A0693F" ${s}/>
      <path d="M86 238 l-8 12 M96 240 l0 14 M124 240 l0 14 M134 238 l8 12" stroke="#FFB03B" stroke-width="6" stroke-linecap="round"/>
      <path d="M70 56 L150 56 L156 66 L64 66 Z" fill="${D}"/><rect x="92" y="40" width="36" height="18" fill="${D}"/><path d="M150 60 q16 6 10 28" stroke="#FFC83D" stroke-width="4" fill="none"/>`
  };
  // Vereinfachte Karte von Sachsen (grob aus Längen-/Breitengraden; Hauptstadt rot, Elbe blau, Nachbarn kursiv)
  B.sachsen = `<rect x="0" y="0" width="220" height="260" rx="14" fill="#EAF6FB"/><polygon points="16.2,174.3 36.0,188.6 57.0,181.0 78.0,174.3 102.0,159.2 126.0,145.8 147.0,136.3 165.0,130.6 180.0,133.5 193.2,130.6 202.8,121.2 205.8,95.5 195.0,73.7 186.0,64.2 159.0,68.9 129.0,73.7 102.0,67.0 78.0,60.4 51.0,54.6 34.2,73.7 39.0,100.2 33.0,126.8 19.2,149.6" fill="#CDEBC0" stroke="#2E7D62" stroke-width="2.5" stroke-linejoin="round"/><polyline points="160.8,132.5 144.0,123.0 128.4,114.5 115.2,103.1 100.8,88.8 91.2,74.6 84.0,60.4" fill="none" stroke="#3A8FD6" stroke-width="3" stroke-linecap="round"/><text x="111.0" y="97.6" font-size="9" fill="#2266A8" transform="rotate(-38 111.0 93.6)">Elbe</text><path d="M81.0 164.4 l6 10 h-12 z" fill="#8A6E2F"/><text x="89.0" y="175.4" font-size="8.5" fill="#5C4A1E">Fichtelberg</text><circle cx="128.4" cy="114.5" r="5" fill="#E5484D"/><text x="135.4" y="118.5" font-size="11" font-weight="700" fill="#3b1f63">Dresden</text><circle cx="46.2" cy="86.9" r="3.5" fill="#3b1f63"/><text x="53.2" y="90.9" font-size="9.5" font-weight="500" fill="#3b1f63">Leipzig</text><circle cx="79.2" cy="135.4" r="3.5" fill="#3b1f63"/><text x="86.2" y="139.4" font-size="9.5" font-weight="500" fill="#3b1f63">Chemnitz</text><circle cx="169.8" cy="102.1" r="3.5" fill="#3b1f63"/><text x="167.8" y="95.1" font-size="9.5" font-weight="500" fill="#3b1f63">Bautzen</text><text x="125" y="32" font-size="10" fill="#6b5a86" font-style="italic">Brandenburg</text><text x="8" y="40" font-size="10" fill="#6b5a86" font-style="italic">Sachsen-Anhalt</text><text x="4" y="150" font-size="10" fill="#6b5a86" font-style="italic">Thüringen</text><text x="8" y="236" font-size="10" fill="#6b5a86" font-style="italic">Bayern</text><text x="112" y="236" font-size="10" fill="#6b5a86" font-style="italic">Tschechien</text><text x="188" y="128" font-size="10" fill="#6b5a86" font-style="italic">Polen</text><text x="110" y="254" text-anchor="middle" font-size="8" fill="#6b5a86">vereinfachte Karte</text>`;
  B.vergleich = `<g transform="translate(-6 20) scale(.6)">${B.nikolaus}</g><g transform="translate(92 20) scale(.6)">${B.weihnachtsmann}</g>`;
  B.alle = `<g transform="translate(-30 30) scale(.55)">${B.weihnachtsmann}</g><g transform="translate(64 20) scale(.55)">${B.santa}</g><g transform="translate(130 30) scale(.55)">${B.dedmoros}</g>`;

  window.SachBilder = {
    bild(name, klasse = "") {
      if (!name) return "";
      if (!B[name]) return `<div class="gross-emoji ${klasse}" aria-hidden="true">${name}</div>`;
      return `<svg class="sachbild ${klasse}" viewBox="0 0 220 260" aria-hidden="true">${B[name]}</svg>`;
    },
    eule: (klasse = "eule") => `<svg class="${klasse}" viewBox="10 20 200 240" aria-hidden="true">${B.eule}</svg>`,
    stammbaum
  };

  // ---------- Stammbaum ----------
  // baum = { personen: [{ id, label: [zeile1, zeile2?], g: "w"|"m", alter: kind|jung|alt|uralt, farbe, x, reihe }],
  //          paare: [[id, id]], kinder: [{ eltern: [id] | [id, id], kinder: [id] }] }
  const REIHE_Y = [80, 260, 440, 620];
  const HAAR = { kind: ["#8A5A34", "#E2B04A"], jung: ["#5C3A21", "#2E2230", "#B8723A"], alt: ["#A9A9B8"], uralt: ["#EDEDF2"] };
  function gesichtKlein(p, i) {
    const haar = HAAR[p.alter][i % HAAR[p.alter].length], hautT = ["#F8D2B8", "#EBC1A0", "#F3C9A8"][i % 3];
    const lang = p.g === "w";
    const k = p.alter === "kind" ? 0.86 : 1;
    let h = `<circle r="44" fill="#FFF8EE"/>`;
    h += `<path d="M-30 46 Q-30 18 0 16 Q30 18 30 46 Z" fill="${p.farbe}" ${s}/>`;
    if (lang) h += `<path d="M-22 -6 Q-28 20 -20 30 L20 30 Q28 20 22 -6 Z" fill="${haar}"/>`;
    h += `<g transform="scale(${k})"><circle cy="-6" r="20" fill="${hautT}" ${s}/>`;
    h += lang ? `<path d="M-21 -6 Q-22 -30 0 -30 Q22 -30 21 -6 Q10 -18 -4 -20 Q-12 -14 -21 -6 Z" fill="${haar}" stroke="${D}" stroke-width="3"/>`
      : p.alter === "uralt" || p.alter === "alt" ? `<path d="M-20 -8 Q-20 -24 -10 -22 M20 -8 Q20 -24 10 -22" stroke="${haar}" stroke-width="7" fill="none" stroke-linecap="round"/>`
      : `<path d="M-20 -8 Q-20 -30 0 -29 Q20 -30 20 -8 Q14 -20 0 -20 Q-14 -20 -20 -8 Z" fill="${haar}" stroke="${D}" stroke-width="3"/>`;
    if (p.alter === "uralt" && p.g === "w") h += `<circle cy="-32" r="8" fill="${haar}" stroke="${D}" stroke-width="3"/>`;
    h += `<circle cx="-7" cy="-6" r="2.6" fill="${D}"/><circle cx="7" cy="-6" r="2.6" fill="${D}"/><path d="M-6 3 Q0 8 6 3" stroke="${D}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    if (p.alter === "alt" || p.alter === "uralt") h += `<circle cx="-7" cy="-6" r="6.5" fill="none" stroke="${D}" stroke-width="2"/><circle cx="7" cy="-6" r="6.5" fill="none" stroke="${D}" stroke-width="2"/>`;
    if (p.alter === "uralt" && p.g === "m") h += `<path d="M-12 4 Q0 16 12 4 Q0 9 -12 4 Z" fill="${haar}" stroke="${D}" stroke-width="2"/>`;
    h += `</g>`;
    return h;
  }
  function stammbaum(baum, hell = [], klickbar = false) {
    const P = {}; baum.personen.forEach((p, i) => P[p.id] = Object.assign({ i, y: REIHE_Y[p.reihe] }, p));
    let linien = "";
    const L = (d) => linien += `<path d="${d}" stroke="#B49ACF" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    baum.paare.forEach(([a, b]) => L(`M${P[a].x + 44} ${P[a].y} H${P[b].x - 44}`));
    baum.kinder.forEach(({ eltern, kinder }) => {
      const e = eltern.map(id => P[id]), y0 = e[0].y;
      const mx = e.length === 2 ? (e[0].x + e[1].x) / 2 : e[0].x;
      const start = e.length === 2 ? y0 : y0 + 96;
      const bar = y0 + 128, ks = kinder.map(id => P[id]);
      L(`M${mx} ${start} V${bar}`);
      const xs = ks.map(k => k.x).concat(mx);
      if (Math.max(...xs) - Math.min(...xs) > 1) L(`M${Math.min(...xs)} ${bar} H${Math.max(...xs)}`);
      ks.forEach(k => L(`M${k.x} ${bar} V${k.y - 44}`));
    });
    const leute = baum.personen.map(p => P[p.id]).map(p => {
      const an = hell.includes(p.id), dunkel = hell.length && !an && !klickbar;
      const [z1, z2] = p.label;
      return `<g class="person${klickbar ? " tippbar" : ""}" data-id="${p.id}" transform="translate(${p.x} ${p.y})" opacity="${dunkel ? 0.5 : 1}">
        ${an ? `<circle r="54" fill="#FFE08A"/>` : ""}
        <clipPath id="kreis-${p.id}"><circle r="44"/></clipPath><g clip-path="url(#kreis-${p.id})">${gesichtKlein(p, p.i)}</g>
        <circle r="44" fill="none" stroke="${an ? "#E8A33D" : D}" stroke-width="${an ? 6 : 4}"/>
        ${p.ich ? `<text x="34" y="-28" font-size="26" text-anchor="middle">⭐</text>` : ""}
        <text y="${z2 ? 70 : 78}" text-anchor="middle" font-size="${z2 ? 22 : 27}" font-weight="600" fill="${D}" font-family="Fredoka, Arial, sans-serif">${z1}</text>
        ${z2 ? `<text y="95" text-anchor="middle" font-size="25" font-weight="700" fill="${D}" font-family="Fredoka, Arial, sans-serif">${z2}</text>` : ""}
        ${klickbar ? `<rect x="-62" y="-50" width="124" height="148" fill="transparent"/>` : ""}
      </g>`;
    }).join("");
    return `<svg class="stammbaum" viewBox="40 26 920 694" role="img" aria-label="Stammbaum">${linien}${leute}</svg>`;
  }
})();
