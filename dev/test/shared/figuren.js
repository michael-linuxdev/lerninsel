// Die Figuren der App als 2D-Zeichnungen (SVG), z. B. für Sprechblasen auf der Insel.
// Quelle: dieselben Zeichnungen wie in Deutsch (Fipsi), Tablet-Profi (Robo Pixel) und Sachunterricht (Eule Ella), Mathe (Biber Benno).
(function () {
  function fipsi(klasse = "fipsi") {
    const D = "#3b1f63", O = "#F28C38", W = "#FFF3E6";
    return `<svg class="${klasse}" viewBox="0 0 200 200" aria-hidden="true">
      <path d="M134 170 Q198 160 188 100 Q180 72 160 92 Q174 134 124 150 Z" fill="${O}" stroke="${D}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M188 100 Q180 72 160 92 Q172 96 182 112 Z" fill="${W}" stroke="${D}" stroke-width="4" stroke-linejoin="round"/>
      <ellipse cx="100" cy="154" rx="42" ry="38" fill="${O}" stroke="${D}" stroke-width="4"/>
      <ellipse cx="100" cy="164" rx="24" ry="24" fill="${W}"/>
      <ellipse cx="80" cy="190" rx="14" ry="8" fill="#5C3A21" stroke="${D}" stroke-width="3"/><ellipse cx="120" cy="190" rx="14" ry="8" fill="#5C3A21" stroke="${D}" stroke-width="3"/>
      <path d="M50 72 L58 16 L88 48 Q100 44 112 48 L142 16 L150 72 Q152 116 100 124 Q48 116 50 72 Z" fill="${O}" stroke="${D}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M62 30 L65 58 L82 47 Z M138 30 L135 58 L118 47 Z" fill="#FFC3A0"/>
      <path d="M64 86 Q100 70 136 86 Q132 120 100 122 Q68 120 64 86 Z" fill="${W}"/>
      <circle cx="80" cy="78" r="8" fill="${D}"/><circle cx="120" cy="78" r="8" fill="${D}"/>
      <circle cx="83" cy="75" r="3" fill="#fff"/><circle cx="123" cy="75" r="3" fill="#fff"/>
      <ellipse cx="100" cy="96" rx="8" ry="6" fill="${D}"/>
      <path d="M91 106 Q100 114 109 106" stroke="${D}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <circle cx="70" cy="98" r="7" fill="#FF7FA6" opacity=".45"/><circle cx="130" cy="98" r="7" fill="#FF7FA6" opacity=".45"/>
    </svg>`;
  }
  function robo(klasse = "robo") {
    const D = "#3b1f63";
    return `<svg class="${klasse}" viewBox="0 0 200 210" aria-hidden="true">
      <line x1="100" y1="34" x2="100" y2="12" stroke="${D}" stroke-width="5"/><circle cx="100" cy="12" r="9" fill="#FFC83D" stroke="${D}" stroke-width="4"/>
      <rect x="40" y="34" width="120" height="92" rx="30" fill="#7FC6F5" stroke="${D}" stroke-width="5"/>
      <rect x="56" y="50" width="88" height="58" rx="20" fill="#E8F6FF" stroke="${D}" stroke-width="4"/>
      <circle cx="82" cy="78" r="10" fill="${D}"/><circle cx="118" cy="78" r="10" fill="${D}"/><circle cx="85" cy="74" r="3.5" fill="#fff"/><circle cx="121" cy="74" r="3.5" fill="#fff"/>
      <path d="M86 96 Q100 106 114 96" stroke="${D}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <rect x="30" y="66" width="12" height="30" rx="6" fill="#FF9BC8" stroke="${D}" stroke-width="4"/><rect x="158" y="66" width="12" height="30" rx="6" fill="#FF9BC8" stroke="${D}" stroke-width="4"/>
      <rect x="58" y="132" width="84" height="62" rx="20" fill="#7FC6F5" stroke="${D}" stroke-width="5"/>
      <rect x="78" y="146" width="44" height="30" rx="8" fill="#fff" stroke="${D}" stroke-width="3"/><circle cx="92" cy="161" r="5" fill="#5CCBA6"/><circle cx="108" cy="161" r="5" fill="#FF6F61"/>
      <path d="M58 150 Q36 160 34 182" stroke="${D}" stroke-width="12" stroke-linecap="round" fill="none"/><path d="M58 150 Q36 160 34 182" stroke="#7FC6F5" stroke-width="6" stroke-linecap="round" fill="none"/>
      <path d="M142 150 Q164 140 170 118" stroke="${D}" stroke-width="12" stroke-linecap="round" fill="none"/><path d="M142 150 Q164 140 170 118" stroke="#7FC6F5" stroke-width="6" stroke-linecap="round" fill="none"/>
      <rect x="70" y="192" width="20" height="14" rx="5" fill="${D}"/><rect x="110" y="192" width="20" height="14" rx="5" fill="${D}"/>
    </svg>`;
  }
  function eule(klasse = "eule") {
    const D = "#3b1f63";
    const s = `stroke="${D}" stroke-width="4" stroke-linejoin="round"`;
    return `<svg class="${klasse}" viewBox="10 20 200 240" aria-hidden="true">
      <path d="M50 70 L70 40 L84 66 Z M170 70 L150 40 L136 66 Z" fill="#A0693F" ${s}/>
      <ellipse cx="110" cy="150" rx="74" ry="92" fill="#B8804A" ${s}/><ellipse cx="110" cy="176" rx="46" ry="60" fill="#F3DEC0" ${s}/>
      ${[0, 1, 2, 3].map(i => `<path d="M${90 + (i % 2) * 20} ${150 + i * 18} q10 8 20 0" stroke="#C9A26B" stroke-width="3" fill="none"/>`).join("")}
      <circle cx="82" cy="104" r="28" fill="#fff" ${s}/><circle cx="138" cy="104" r="28" fill="#fff" ${s}/>
      <circle cx="86" cy="106" r="13" fill="${D}"/><circle cx="134" cy="106" r="13" fill="${D}"/><circle cx="90" cy="101" r="5" fill="#fff"/><circle cx="138" cy="101" r="5" fill="#fff"/>
      <circle cx="82" cy="104" r="34" fill="none" stroke="#7B55B8" stroke-width="5"/><circle cx="138" cy="104" r="34" fill="none" stroke="#7B55B8" stroke-width="5"/><path d="M116 100 h-12" stroke="#7B55B8" stroke-width="5"/>
      <path d="M100 128 L110 146 L120 128 Z" fill="#FFB03B" ${s}/>
      <path d="M38 150 Q20 190 50 220 Q60 180 50 150 Z M182 150 Q200 190 170 220 Q160 180 170 150 Z" fill="#A0693F" ${s}/>
      <path d="M86 238 l-8 12 M96 240 l0 14 M124 240 l0 14 M134 238 l8 12" stroke="#FFB03B" stroke-width="6" stroke-linecap="round"/>
      <path d="M70 56 L150 56 L156 66 L64 66 Z" fill="${D}"/><rect x="92" y="40" width="36" height="18" fill="${D}"/><path d="M150 60 q16 6 10 28" stroke="#FFC83D" stroke-width="4" fill="none"/></svg>`;
  }
  // Biber Benno (Mathe): braun, großer flacher Schwanz mit Gittermuster, zwei große Zähne, gelber Bauarbeiterhelm mit Zollstock
  function biber(klasse = "biber") {
    const D = "#3b1f63", B = "#A86A3D", H = "#F3DEC0", s = `stroke="${D}" stroke-width="4" stroke-linejoin="round"`;
    return `<svg class="${klasse}" viewBox="0 0 200 210" aria-hidden="true">
      <path d="M128 168 Q190 150 196 186 Q170 206 126 190 Z" fill="#6B4A3A" ${s}/>
      <path d="M140 172 L184 182 M146 184 L188 176 M150 170 L160 198 M168 168 L176 198" stroke="#8A6650" stroke-width="3"/>
      <ellipse cx="100" cy="150" rx="48" ry="44" fill="${B}" ${s}/>
      <ellipse cx="100" cy="160" rx="28" ry="28" fill="${H}"/>
      <ellipse cx="76" cy="194" rx="16" ry="9" fill="#5C3A21" ${s}/><ellipse cx="124" cy="194" rx="16" ry="9" fill="#5C3A21" ${s}/>
      <ellipse cx="54" cy="136" rx="12" ry="18" fill="${B}" ${s} transform="rotate(25 54 136)"/>
      <g transform="rotate(-20 152 120)"><rect x="140" y="98" width="14" height="52" rx="3" fill="#FFC83D" ${s}/><path d="M140 110h8M140 122h6M140 134h8M140 146h6" stroke="${D}" stroke-width="2"/></g>
      <ellipse cx="150" cy="134" rx="12" ry="16" fill="${B}" ${s}/>
      <circle cx="60" cy="52" r="15" fill="${B}" ${s}/><circle cx="140" cy="52" r="15" fill="${B}" ${s}/><circle cx="60" cy="52" r="7" fill="#E9A7A0"/><circle cx="140" cy="52" r="7" fill="#E9A7A0"/>
      <ellipse cx="100" cy="82" rx="54" ry="48" fill="${B}" ${s}/>
      <ellipse cx="100" cy="100" rx="32" ry="24" fill="${H}"/>
      <circle cx="80" cy="76" r="8" fill="${D}"/><circle cx="120" cy="76" r="8" fill="${D}"/><circle cx="83" cy="73" r="3" fill="#fff"/><circle cx="123" cy="73" r="3" fill="#fff"/>
      <ellipse cx="100" cy="92" rx="10" ry="7" fill="${D}"/>
      <path d="M92 101 Q100 106 108 101" stroke="${D}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <rect x="91" y="104" width="8" height="12" rx="2" fill="#fff" ${s.replace('stroke-width="4"', 'stroke-width="2.5"')}/><rect x="101" y="104" width="8" height="12" rx="2" fill="#fff" ${s.replace('stroke-width="4"', 'stroke-width="2.5"')}/>
      <circle cx="68" cy="96" r="7" fill="#FF7FA6" opacity=".4"/><circle cx="132" cy="96" r="7" fill="#FF7FA6" opacity=".4"/>
      <path d="M52 50 Q54 18 100 16 Q146 18 148 50 Z" fill="#FFC83D" ${s}/><path d="M42 50 H158 Q160 58 152 58 H48 Q40 58 42 50 Z" fill="#FFB020" ${s}/><rect x="94" y="16" width="12" height="34" rx="4" fill="#FFB020"/>
    </svg>`;
  }
  // Bärin Bruni (Gefühle und Miteinander): hellbraun, runder Bauch, rosa Schal, trägt eine Laterne mit Herz
  function baer(klasse = "baer") {
    const D = "#3b1f63", B = "#C98E5A", H = "#F3DEC0", s = `stroke="${D}" stroke-width="4" stroke-linejoin="round"`;
    return `<svg class="${klasse}" viewBox="0 0 200 210" aria-hidden="true">
      <ellipse cx="100" cy="150" rx="52" ry="48" fill="${B}" ${s}/>
      <ellipse cx="100" cy="160" rx="30" ry="30" fill="${H}"/>
      <ellipse cx="74" cy="196" rx="18" ry="10" fill="#8A5A34" ${s}/><ellipse cx="126" cy="196" rx="18" ry="10" fill="#8A5A34" ${s}/>
      <ellipse cx="50" cy="140" rx="13" ry="20" fill="${B}" ${s} transform="rotate(20 50 140)"/>
      <path d="M152 120 q22 4 22 26" stroke="${D}" stroke-width="4" fill="none"/>
      <rect x="160" y="146" width="28" height="34" rx="8" fill="#FFF1C2" ${s}/><path d="M174 172 l-8 -8 a5 5 0 0 1 8 -6 a5 5 0 0 1 8 6 z" fill="#FF5C8A"/>
      <ellipse cx="150" cy="132" rx="13" ry="18" fill="${B}" ${s}/>
      <path d="M62 112 Q100 128 138 112 L134 124 Q100 140 66 124 Z" fill="#FF9BC8" ${s}/>
      <circle cx="58" cy="44" r="18" fill="${B}" ${s}/><circle cx="142" cy="44" r="18" fill="${B}" ${s}/><circle cx="58" cy="44" r="9" fill="#E9A7A0"/><circle cx="142" cy="44" r="9" fill="#E9A7A0"/>
      <ellipse cx="100" cy="78" rx="56" ry="48" fill="${B}" ${s}/>
      <ellipse cx="100" cy="96" rx="26" ry="20" fill="${H}"/>
      <circle cx="78" cy="72" r="8" fill="${D}"/><circle cx="122" cy="72" r="8" fill="${D}"/><circle cx="81" cy="69" r="3" fill="#fff"/><circle cx="125" cy="69" r="3" fill="#fff"/>
      <ellipse cx="100" cy="88" rx="10" ry="7" fill="${D}"/>
      <path d="M88 100 Q100 110 112 100" stroke="${D}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <circle cx="66" cy="94" r="8" fill="#FF7FA6" opacity=".45"/><circle cx="134" cy="94" r="8" fill="#FF7FA6" opacity=".45"/>
    </svg>`;
  }
  // Papagei Paula: Atelier (Malen und Musik) – bunte Federn, Malerinnen-Mütze, Pinsel
  function papagei(klasse = "papagei") {
    const D = "#3b1f63", s = `stroke="${D}" stroke-width="4" stroke-linejoin="round"`;
    return `<svg class="${klasse}" viewBox="0 0 200 210" aria-hidden="true">
      <path d="M86 168 L70 206 L92 204 L100 172 Z" fill="#2F86C8" ${s}/><path d="M104 170 L112 206 L132 200 L116 166 Z" fill="#FFC83D" ${s}/>
      <ellipse cx="100" cy="126" rx="46" ry="54" fill="#E8453C" ${s}/>
      <ellipse cx="100" cy="140" rx="26" ry="32" fill="#FFB26B"/>
      <path d="M58 104 Q30 130 46 172 Q66 160 74 128 Z" fill="#2FA37C" ${s}/><path d="M50 150 Q58 160 66 150" stroke="#FFC83D" stroke-width="5" fill="none"/>
      <path d="M142 104 Q170 128 158 168 Q138 158 128 128 Z" fill="#2FA37C" ${s}/>
      <path d="M150 140 L184 98" stroke="#9A6A3F" stroke-width="7" stroke-linecap="round"/><path d="M184 98 l8 -12 l-2 14 z" fill="#FF5C8A" ${s}/>
      <path d="M84 176 l-4 10 M92 178 l0 10 M110 178 l0 10 M118 176 l4 10" stroke="#F2A33A" stroke-width="5" stroke-linecap="round"/>
      <circle cx="100" cy="70" r="40" fill="#E8453C" ${s}/>
      <ellipse cx="100" cy="74" rx="24" ry="22" fill="#FFF4E6"/>
      <path d="M58 46 Q100 6 142 40 Q150 52 132 50 Q100 30 70 52 Q52 58 58 46 Z" fill="#7B55B8" ${s}/><circle cx="104" cy="22" r="8" fill="#7B55B8" ${s}/>
      <circle cx="86" cy="68" r="8" fill="${D}"/><circle cx="114" cy="68" r="8" fill="${D}"/><circle cx="89" cy="65" r="3" fill="#fff"/><circle cx="117" cy="65" r="3" fill="#fff"/>
      <path d="M90 82 Q100 76 110 82 Q110 100 100 106 Q92 98 90 82 Z" fill="#FFC83D" ${s}/>
      <circle cx="74" cy="86" r="7" fill="#FF7FA6" opacity=".5"/><circle cx="126" cy="86" r="7" fill="#FF7FA6" opacity=".5"/>
    </svg>`;
  }
  // Schildkröte Tilda (Schach, 30.10.2026): runder Panzer mit Waben, Kopf vorn, Halstuch
  function tilda(klasse = "tilda") {
    const D = "#3b1f63", G = "#8BCB6A", P = "#3F8E52", s = `stroke="${D}" stroke-width="4" stroke-linejoin="round"`;
    return `<svg class="${klasse}" viewBox="0 0 200 200" aria-hidden="true">
      <ellipse cx="62" cy="168" rx="18" ry="14" fill="${G}" ${s}/><ellipse cx="138" cy="168" rx="18" ry="14" fill="${G}" ${s}/>
      <path d="M28 150 Q30 76 100 70 Q170 76 172 150 Z" fill="${P}" ${s}/>
      <path d="M100 82 l18 12 v20 l-18 12 l-18 -12 v-20 z M52 122 l16 -10 l16 10 v18 h-32 z M116 122 l16 -10 l16 10 v18 h-32 z" fill="#6FB25A" stroke="#2E6E3E" stroke-width="3" stroke-linejoin="round"/>
      <path d="M22 150 Q100 166 178 150 Q180 162 170 164 Q100 178 30 164 Q20 162 22 150 Z" fill="#E9D27A" ${s}/>
      <ellipse cx="100" cy="56" rx="40" ry="36" fill="${G}" ${s}/>
      <path d="M68 84 Q100 98 132 84 L126 100 Q100 108 74 100 Z" fill="#E0578F" ${s}/>
      <circle cx="86" cy="52" r="8" fill="${D}"/><circle cx="114" cy="52" r="8" fill="${D}"/><circle cx="89" cy="49" r="3" fill="#fff"/><circle cx="117" cy="49" r="3" fill="#fff"/>
      <path d="M88 70 Q100 80 112 70" stroke="${D}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <circle cx="74" cy="66" r="7" fill="#FF7FA6" opacity=".45"/><circle cx="126" cy="66" r="7" fill="#FF7FA6" opacity=".45"/>
    </svg>`;
  }
  window.Figuren = { fipsi, robo, eule, biber, baer, papagei, tilda };
})();
