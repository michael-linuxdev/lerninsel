// Neue Figuren (Entwurf 01.11.2026) in zwei Stilen für die Vorschau: "a" = Insel bunt (kräftige Kontur, flache Farben),
// "b" = weich und ruhig (ohne Kontur, sanfte Verläufe). Ausdruck: "froh" | "staunt" | "denkt".
// FigurenNeu.svg(name, stil, ausdruck) → SVG-Text (viewBox 0 0 200 220). Namen: robo, eule, fipsi, biber, baer, papagei, tilda.
(function () {
  let zaehler = 0;
  const D = "#3b1f63";
  function bau(stil) {
    const id = "f" + (++zaehler), defs = [];
    const kontur = stil === "a" ? ` stroke="${D}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"` : "";
    const hell = (hex, k) => { const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, m = (c) => Math.round(c + (255 - c) * k); return `rgb(${m(r)},${m(g)},${m(b)})`; };
    const dunkel = (hex, k) => { const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, m = (c) => Math.round(c * (1 - k)); return `rgb(${m(r)},${m(g)},${m(b)})`; };
    // Füllung: Stil a flach, Stil b weicher Verlauf (oben heller, unten etwas dunkler)
    const f = (hex) => {
      if (stil === "a") return hex;
      const g = id + "g" + defs.length;
      defs.push(`<radialGradient id="${g}" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="${hell(hex, 0.35)}"/><stop offset="0.6" stop-color="${hex}"/><stop offset="1" stop-color="${dunkel(hex, 0.12)}"/></radialGradient>`);
      return `url(#${g})`;
    };
    const k = (extra = "") => kontur + extra;
    return { f, k, kontur, defs, schatten: `<ellipse cx="100" cy="210" rx="56" ry="8" fill="rgba(59,31,99,${stil === "a" ? 0.18 : 0.12})"/>` };
  }
  // Augen und Mund (gemeinsam): x1/x2 = Augenmitte, y = Höhe, r = Größe
  function gesicht(s, x1, x2, y, r, mundY, ausdruck, opt = {}) {
    const pupille = (x) => ausdruck === "denkt" ? `<circle cx="${x + r * 0.3}" cy="${y - r * 0.35}" r="${r * 0.48}" fill="${D}"/>` : `<circle cx="${x}" cy="${y + r * 0.1}" r="${r * (ausdruck === "staunt" ? 0.42 : 0.55)}" fill="${D}"/>`;
    const glanz = (x) => `<circle cx="${x - r * 0.18}" cy="${y - r * 0.2}" r="${r * 0.2}" fill="#fff"/>`;
    const auge = (x) => opt.ohneWeiss ? pupille(x) + glanz(x) : `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.12}" fill="#fff"${s.kontur ? ` stroke="${D}" stroke-width="3.5"` : ""}/>` + pupille(x) + glanz(x);
    const mx = (x1 + x2) / 2;
    const mund = ausdruck === "staunt" ? `<ellipse cx="${mx}" cy="${mundY + 4}" rx="7" ry="9" fill="${D}"/>`
      : ausdruck === "denkt" ? `<path d="M${mx - 10} ${mundY + 4} Q${mx} ${mundY} ${mx + 12} ${mundY + 2}" fill="none" stroke="${D}" stroke-width="4" stroke-linecap="round"/>`
      : `<path d="M${mx - 14} ${mundY} Q${mx} ${mundY + 16} ${mx + 14} ${mundY}" fill="${opt.mundFuell || "none"}" stroke="${D}" stroke-width="4" stroke-linecap="round"/>`;
    const wangen = `<ellipse cx="${x1 - r * 0.9}" cy="${y + r * 1.6}" rx="${r * 0.62}" ry="${r * 0.38}" fill="#FF8FA8" opacity=".55"/><ellipse cx="${x2 + r * 0.9}" cy="${y + r * 1.6}" rx="${r * 0.62}" ry="${r * 0.38}" fill="#FF8FA8" opacity=".55"/>`;
    return auge(x1) + auge(x2) + (opt.ohneMund ? "" : mund) + (opt.ohneWangen ? "" : wangen);
  }
  const svg = (s, inhalt) => `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>${s.defs.join("")}</defs>${s.schatten}${inhalt}</svg>`;

  const FIGUREN = {
    robo(stil, a) { const s = bau(stil); return svg(s, `
      <line x1="100" y1="34" x2="100" y2="16" stroke="${D}" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="14" r="9" fill="${s.f("#FF5C7A")}"${s.k()}/>
      <rect x="66" y="128" width="68" height="64" rx="18" fill="${s.f("#58B7F0")}"${s.k()}/>
      <rect x="80" y="146" width="40" height="26" rx="8" fill="${s.f("#E8F5FF")}"${s.k(' stroke-width="3.5"')}/>
      <circle cx="90" cy="159" r="5" fill="#FF5C7A"/><circle cx="100" cy="159" r="5" fill="#FFC83D"/><circle cx="110" cy="159" r="5" fill="#5CCBA6"/>
      <rect x="44" y="140" width="22" height="14" rx="7" fill="${s.f("#58B7F0")}"${s.k()}/><rect x="134" y="140" width="22" height="14" rx="7" fill="${s.f("#58B7F0")}"${s.k()}/>
      <rect x="76" y="190" width="18" height="16" rx="6" fill="${s.f("#3A8FD0")}"${s.k()}/><rect x="106" y="190" width="18" height="16" rx="6" fill="${s.f("#3A8FD0")}"${s.k()}/>
      <rect x="42" y="34" width="116" height="96" rx="30" fill="${s.f("#7FCBF5")}"${s.k()}/>
      <rect x="56" y="50" width="88" height="62" rx="20" fill="${s.f("#2E2B47")}"${s.k(' stroke-width="3.5"')}/>
      <rect x="36" y="68" width="10" height="26" rx="5" fill="${s.f("#FFC83D")}"${s.k(' stroke-width="3.5"')}/><rect x="154" y="68" width="10" height="26" rx="5" fill="${s.f("#FFC83D")}"${s.k(' stroke-width="3.5"')}/>
      ${a === "staunt" ? `<circle cx="82" cy="78" r="9" fill="#7CF0FF"/><circle cx="118" cy="78" r="9" fill="#7CF0FF"/><ellipse cx="100" cy="99" rx="6" ry="7" fill="#7CF0FF"/>`
        : a === "denkt" ? `<rect x="73" y="74" width="18" height="6" rx="3" fill="#7CF0FF"/><circle cx="118" cy="77" r="8" fill="#7CF0FF"/><path d="M90 99 H112" stroke="#7CF0FF" stroke-width="5" stroke-linecap="round"/>`
        : `<path d="M73 80 Q82 70 91 80" fill="none" stroke="#7CF0FF" stroke-width="6" stroke-linecap="round"/><path d="M109 80 Q118 70 127 80" fill="none" stroke="#7CF0FF" stroke-width="6" stroke-linecap="round"/><path d="M86 95 Q100 106 114 95" fill="none" stroke="#7CF0FF" stroke-width="5" stroke-linecap="round"/>`}`); },

    eule(stil, a) { const s = bau(stil); return svg(s, `
      <path d="M58 52 L46 22 L80 40 Z" fill="${s.f("#3E9E8F")}"${s.k()}/><path d="M142 52 L154 22 L120 40 Z" fill="${s.f("#3E9E8F")}"${s.k()}/>
      <ellipse cx="100" cy="122" rx="66" ry="80" fill="${s.f("#4FB3A2")}"${s.k()}/>
      <ellipse cx="100" cy="150" rx="40" ry="44" fill="${s.f("#E9F7EE")}"/>
      <path d="M80 140 q6 6 12 0 M100 140 q6 6 12 0 M88 158 q6 6 12 0 M108 158 q6 6 12 0" fill="none" stroke="#9BCFC3" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="40" cy="128" rx="16" ry="38" fill="${s.f("#3E9E8F")}"${s.k()} transform="rotate(12 40 128)"/><ellipse cx="160" cy="128" rx="16" ry="38" fill="${s.f("#3E9E8F")}"${s.k()} transform="rotate(-12 160 128)"/>
      <circle cx="74" cy="84" r="26" fill="${s.f("#FFF6E0")}"${s.k()}/><circle cx="126" cy="84" r="26" fill="${s.f("#FFF6E0")}"${s.k()}/>
      ${gesicht(s, 74, 126, 84, 13, 0, a, { ohneWeiss: true, ohneMund: true, ohneWangen: true })}
      <path d="M92 100 L108 100 L100 116 Z" fill="${s.f("#FFB23D")}"${s.k(' stroke-width="3.5"')}/>
      ${a === "staunt" ? `<ellipse cx="100" cy="122" rx="5" ry="6" fill="${D}"/>` : ""}
      <ellipse cx="82" cy="204" rx="12" ry="6" fill="${s.f("#FFB23D")}"${s.k(' stroke-width="3.5"')}/><ellipse cx="118" cy="204" rx="12" ry="6" fill="${s.f("#FFB23D")}"${s.k(' stroke-width="3.5"')}/>`); },

    fipsi(stil, a) { const s = bau(stil); return svg(s, `
      <path d="M140 176 Q196 168 186 108 Q178 84 160 100 Q172 140 128 156 Z" fill="${s.f("#F28C38")}"${s.k()}/><path d="M186 108 Q178 84 160 100 Q172 102 182 118 Z" fill="#FFF3E6"/>
      <ellipse cx="100" cy="160" rx="44" ry="42" fill="${s.f("#F28C38")}"${s.k()}/><ellipse cx="100" cy="170" rx="26" ry="26" fill="${s.f("#FFF3E6")}"/>
      <ellipse cx="78" cy="202" rx="14" ry="7" fill="${s.f("#5C3A21")}"${s.k(' stroke-width="3.5"')}/><ellipse cx="122" cy="202" rx="14" ry="7" fill="${s.f("#5C3A21")}"${s.k(' stroke-width="3.5"')}/>
      <path d="M46 78 L52 18 L88 50 Z" fill="${s.f("#F28C38")}"${s.k()}/><path d="M154 78 L148 18 L112 50 Z" fill="${s.f("#F28C38")}"${s.k()}/>
      <path d="M56 62 L58 32 L78 50 Z M144 62 L142 32 L122 50 Z" fill="#5C3A21"/>
      <path d="M40 80 Q40 40 100 40 Q160 40 160 80 Q160 128 100 132 Q40 128 40 80 Z" fill="${s.f("#F7A04F")}"${s.k()}/>
      <path d="M62 104 Q100 92 138 104 Q132 132 100 134 Q68 132 62 104 Z" fill="${s.f("#FFF3E6")}"/>
      ${gesicht(s, 78, 122, 84, 11, 112, a)}<ellipse cx="100" cy="104" rx="8" ry="6" fill="${D}"/>`); },

    biber(stil, a) { const s = bau(stil); return svg(s, `
      <ellipse cx="158" cy="186" rx="34" ry="16" fill="${s.f("#6B4A33")}"${s.k()} transform="rotate(-18 158 186)"/>
      <path d="M134 178 l40 -14 M140 190 l40 -14" stroke="#8E6A4E" stroke-width="3"/>
      <ellipse cx="100" cy="158" rx="50" ry="46" fill="${s.f("#A8754E")}"${s.k()}/><ellipse cx="100" cy="166" rx="30" ry="30" fill="${s.f("#E8C9A6")}"/>
      <ellipse cx="78" cy="202" rx="14" ry="7" fill="${s.f("#6B4A33")}"${s.k(' stroke-width="3.5"')}/><ellipse cx="122" cy="202" rx="14" ry="7" fill="${s.f("#6B4A33")}"${s.k(' stroke-width="3.5"')}/>
      <circle cx="58" cy="50" r="15" fill="${s.f("#A8754E")}"${s.k()}/><circle cx="142" cy="50" r="15" fill="${s.f("#A8754E")}"${s.k()}/>
      <ellipse cx="100" cy="84" rx="60" ry="52" fill="${s.f("#B8845A")}"${s.k()}/>
      <ellipse cx="100" cy="108" rx="30" ry="22" fill="${s.f("#E8C9A6")}"/>
      ${gesicht(s, 78, 122, 76, 11, 112, a, { ohneMund: true })}<ellipse cx="100" cy="100" rx="10" ry="7" fill="${D}"/>
      <rect x="91" y="112" width="18" height="18" rx="4" fill="#fff"${s.k(' stroke-width="3"')}/><line x1="100" y1="112" x2="100" y2="130" stroke="${D}" stroke-width="2.5"/>
      ${a === "staunt" ? `<ellipse cx="100" cy="136" rx="5" ry="4" fill="${D}"/>` : ""}`); },

    baer(stil, a) { const s = bau(stil); return svg(s, `
      <ellipse cx="100" cy="158" rx="54" ry="48" fill="${s.f("#C98A55")}"${s.k()}/><ellipse cx="100" cy="166" rx="32" ry="32" fill="${s.f("#F2D3B0")}"/>
      <path d="M86 150 q14 -14 28 0 q-14 22 -28 0 Z" fill="#FF7FA0" opacity=".85"/>
      <ellipse cx="76" cy="204" rx="16" ry="8" fill="${s.f("#8E5C35")}"${s.k(' stroke-width="3.5"')}/><ellipse cx="124" cy="204" rx="16" ry="8" fill="${s.f("#8E5C35")}"${s.k(' stroke-width="3.5"')}/>
      <circle cx="52" cy="44" r="19" fill="${s.f("#C98A55")}"${s.k()}/><circle cx="148" cy="44" r="19" fill="${s.f("#C98A55")}"${s.k()}/>
      <circle cx="52" cy="44" r="9" fill="#F2B7A0"/><circle cx="148" cy="44" r="9" fill="#F2B7A0"/>
      <ellipse cx="100" cy="82" rx="62" ry="54" fill="${s.f("#D69A62")}"${s.k()}/>
      <ellipse cx="100" cy="104" rx="28" ry="20" fill="${s.f("#F2D3B0")}"/>
      ${gesicht(s, 76, 124, 74, 10, 108, a)}<ellipse cx="100" cy="96" rx="10" ry="7" fill="${D}"/>`); },

    papagei(stil, a) { const s = bau(stil); return svg(s, `
      <path d="M86 186 L70 216 L92 200 L100 218 L108 200 L130 216 L114 186 Z" fill="${s.f("#3A8FD0")}"${s.k()}/>
      <ellipse cx="100" cy="150" rx="46" ry="52" fill="${s.f("#4CC27A")}"${s.k()}/>
      <ellipse cx="62" cy="152" rx="18" ry="40" fill="${s.f("#2E9C5A")}"${s.k()} transform="rotate(14 62 152)"/><ellipse cx="138" cy="152" rx="18" ry="40" fill="${s.f("#2E9C5A")}"${s.k()} transform="rotate(-14 138 152)"/>
      <path d="M62 148 l-6 22 M138 148 l6 22" stroke="#FFC83D" stroke-width="5" stroke-linecap="round"/>
      <path d="M80 40 Q86 10 100 22 Q112 8 120 40 Z" fill="${s.f("#FF5C5C")}"${s.k()}/>
      <circle cx="100" cy="80" r="50" fill="${s.f("#FF6B5C")}"${s.k()}/>
      <ellipse cx="100" cy="92" rx="34" ry="28" fill="${s.f("#FFE7DA")}"/>
      ${gesicht(s, 80, 120, 76, 11, 0, a, { ohneMund: true })}
      <path d="M88 96 Q100 86 114 96 Q116 116 100 126 Q104 110 88 104 Z" fill="${s.f("#FFC83D")}"${s.k(' stroke-width="3.5"')}/>
      <ellipse cx="86" cy="204" rx="10" ry="5" fill="#8E5C35"/><ellipse cx="114" cy="204" rx="10" ry="5" fill="#8E5C35"/>`); },

    tilda(stil, a) { const s = bau(stil); return svg(s, `
      <ellipse cx="54" cy="196" rx="16" ry="10" fill="${s.f("#7FCB6A")}"${s.k()}/><ellipse cx="146" cy="196" rx="16" ry="10" fill="${s.f("#7FCB6A")}"${s.k()}/>
      <rect x="82" y="84" width="36" height="30" rx="14" fill="${s.f("#8FD67A")}"${s.k()}/>
      <path d="M30 178 Q30 104 100 100 Q170 104 170 178 Z" fill="${s.f("#4FAF62")}"${s.k()}/>
      <path d="M100 112 L124 126 L124 152 L100 166 L76 152 L76 126 Z" fill="${s.f("#7FCB6A")}" opacity=".9"/>
      <path d="M48 160 L66 148 L66 128 M152 160 L134 148 L134 128" fill="none" stroke="#2E7D45" stroke-width="3.5" stroke-linecap="round"/>
      <rect x="26" y="172" width="148" height="16" rx="8" fill="${s.f("#E8D9A0")}"${s.k()}/>
      <ellipse cx="100" cy="62" rx="44" ry="40" fill="${s.f("#8FD67A")}"${s.k()}/>
      ${gesicht(s, 84, 116, 56, 10, 80, a)}
      <path d="M70 26 Q100 6 130 26 L126 34 Q100 22 74 34 Z" fill="${s.f("#7B55B8")}"${s.k(' stroke-width="3.5"')}/>`); }
  };
  const NAMEN = { robo: "Robo Pixel", eule: "Eule Ella", fipsi: "Fipsi", biber: "Biber Benno", baer: "Bärin Bruni", papagei: "Papagei Paula", tilda: "Schildkröte Tilda" };
  window.FigurenNeu = { svg: (n, stil = "a", ausdruck = "froh") => FIGUREN[n](stil, ausdruck), NAMEN, LISTE: Object.keys(FIGUREN) };
})();
