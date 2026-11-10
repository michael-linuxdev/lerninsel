// Die Figuren der App als 2D-Zeichnungen (SVG), Stil A „Insel bunt“ (neu gezeichnet am 01.11.2026, Wahl des Auftraggebers):
// Robo Pixel, Eule Ella (braun, ohne Federohren), Fipsi, Biber Benno, Bärin Bruni, Papagei Paula, Schildkröte Tilda (mit Frisur und lila Schleife, 02.11.2026) – ohne rosa Wangen, normale Augen statt Kulleraugen.
// Figuren 2/3 (07.11.2026): Tilda aufrecht mit Panzer auf dem Rücken und Bauchplatte (wie in 3D); Paula mit Federkamm, gebogenem Schnabel, Flügeln und Schwanzfedern.
// Figuren.<name>(klasse) → SVG mit class=klasse (für Sprechblasen, Türen, Seiten). FigurenNeu.svg(name, stil, ausdruck) für Ausdrücke
// ("froh" | "staunt" | "denkt") und die Stil-Vorschau (stil "a" = Insel bunt, "b" = weich).
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
  // Augen und Mund (gemeinsam): x1/x2 = Augenmitte, y = Höhe, r = Größe.
  // Normale Augen statt Kulleraugen (Wunsch des Auftraggebers 02.11.2026): kleine dunkle Augen mit einem kleinen Glanzpunkt,
  // kein weißer Augapfel mehr; opt.iris = Farbe der Iris (Eule: bernsteinfarben mit dunkler Pupille).
  function gesicht(s, x1, x2, y, r, mundY, ausdruck, opt = {}) {
    const rx = r * 0.52, ry = r * (ausdruck === "staunt" ? 0.74 : 0.66);
    const dx = ausdruck === "denkt" ? r * 0.18 : 0, dy = ausdruck === "denkt" ? -r * 0.18 : 0;
    const auge = (x) => {
      const cx = x + dx, cy = y + dy;
      const kern = opt.iris
        ? `<ellipse cx="${cx}" cy="${cy}" rx="${rx * 1.25}" ry="${ry * 1.15}" fill="${opt.iris}"${s.kontur ? ` stroke="${D}" stroke-width="2.5"` : ""}/><ellipse cx="${cx}" cy="${cy}" rx="${rx * 0.62}" ry="${ry * 0.66}" fill="${D}"/>`
        : `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${D}"/>`;
      const glanz = `<circle cx="${cx + rx * 0.3}" cy="${cy - ry * 0.38}" r="${r * 0.13}" fill="#fff"/>`;
      // Beim Nachdenken eine leicht gehobene Braue, sonst nur das Auge
      const braue = ausdruck === "denkt" ? `<path d="M${x - rx * 1.4} ${y - ry * 1.9} Q${x} ${y - ry * 2.5} ${x + rx * 1.4} ${y - ry * 2.0}" fill="none" stroke="${D}" stroke-width="3" stroke-linecap="round"/>` : "";
      return kern + glanz + braue;
    };
    const mx = (x1 + x2) / 2;
    const mund = ausdruck === "staunt" ? `<ellipse cx="${mx}" cy="${mundY + 4}" rx="6" ry="7" fill="${D}"/>`
      : ausdruck === "denkt" ? `<path d="M${mx - 10} ${mundY + 4} Q${mx} ${mundY} ${mx + 12} ${mundY + 2}" fill="none" stroke="${D}" stroke-width="4" stroke-linecap="round"/>`
      : `<path d="M${mx - 12} ${mundY} Q${mx} ${mundY + 12} ${mx + 12} ${mundY}" fill="${opt.mundFuell || "none"}" stroke="${D}" stroke-width="4" stroke-linecap="round"/>`;
    return auge(x1) + auge(x2) + (opt.ohneMund ? "" : mund);   // keine rosa Wangen (Wunsch des Auftraggebers 01.11.2026)
  }
  // Doppelte Attribute entfernen (Erprobung 10.11.2026): Die Kontur hängt stroke-width="5" an, manche Teile nennen danach noch eine eigene Breite.
  // Im HTML gilt still die erste – als eigenständiges SVG-Bild (Tablet-Führerschein „Als Bild speichern“, Canvas) ist das aber ungültiges XML,
  // das Bild lud nie. Die erste Angabe bleibt, das Aussehen ändert sich nicht.
  const ohneDoppelte = (t) => t.replace(/<[a-zA-Z][^>]*>/g, (tag) => { const da = new Set(); return tag.replace(/\s([a-zA-Z:-]+)="[^"]*"/g, (m, n) => (da.has(n) ? "" : (da.add(n), m))); });
  const svg = (s, inhalt) => ohneDoppelte(`<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>${s.defs.join("")}</defs>${s.schatten}${inhalt}</svg>`);

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
      <ellipse cx="100" cy="160" rx="46" ry="44" fill="${s.f("#B98A66")}"${s.k()}/>
      <ellipse cx="100" cy="168" rx="28" ry="30" fill="${s.f("#F7E6CF")}"/>
      <path d="M88 160 q6 6 12 0 M100 172 q6 6 12 0 M86 180 q6 6 12 0" fill="none" stroke="#D9B48F" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="60" cy="150" rx="13" ry="22" fill="${s.f("#9C6E4E")}"${s.k()} transform="rotate(24 60 150)"/><ellipse cx="140" cy="150" rx="13" ry="22" fill="${s.f("#9C6E4E")}"${s.k()} transform="rotate(-24 140 150)"/>
      <path d="M72 204 l6 -9 l6 9 Z M116 204 l6 -9 l6 9 Z" fill="${s.f("#F59A3C")}"${s.k(' stroke-width="3.5"')}/>
      <ellipse cx="100" cy="84" rx="62" ry="54" fill="${s.f("#C49470")}"${s.k()}/>
      <path d="M100 40 q-4 -12 6 -16 q-2 8 4 14" fill="${s.f("#C49470")}"${s.k(' stroke-width="4"')}/>
      <path d="M100 66 Q86 50 72 54 Q50 60 52 84 Q54 108 78 110 Q92 110 100 100 Q108 110 122 110 Q146 108 148 84 Q150 60 128 54 Q114 50 100 66 Z" fill="${s.f("#FFF1DC")}"/>
      ${gesicht(s, 78, 122, 82, 12, 0, a, { ohneMund: true, iris: "#F2A93B" })}
      <path d="M93 98 L107 98 L100 110 Z" fill="${s.f("#F59A3C")}"${s.k(' stroke-width="3.5"')}/>
      ${a === "staunt" ? `<ellipse cx="100" cy="120" rx="5" ry="6" fill="${D}"/>` : a === "denkt" ? "" : `<path d="M92 116 Q100 122 108 116" fill="none" stroke="${D}" stroke-width="3.5" stroke-linecap="round"/>`}`); },

    fipsi(stil, a) { const s = bau(stil); return svg(s, `
      <path d="M140 176 Q196 168 186 108 Q178 84 160 100 Q172 140 128 156 Z" fill="${s.f("#F28C38")}"${s.k()}/><path d="M186 108 Q178 84 160 100 Q172 102 182 118 Z" fill="#FFF3E6"/>
      <ellipse cx="100" cy="160" rx="44" ry="42" fill="${s.f("#F28C38")}"${s.k()}/><ellipse cx="100" cy="170" rx="26" ry="26" fill="${s.f("#FFF3E6")}"/>
      <ellipse cx="78" cy="202" rx="14" ry="7" fill="${s.f("#5C3A21")}"${s.k(' stroke-width="3.5"')}/><ellipse cx="122" cy="202" rx="14" ry="7" fill="${s.f("#5C3A21")}"${s.k(' stroke-width="3.5"')}/>
      <ellipse cx="66" cy="150" rx="11" ry="16" fill="${s.f("#F28C38")}"${s.k()} transform="rotate(20 66 150)"/><ellipse cx="134" cy="150" rx="11" ry="16" fill="${s.f("#F28C38")}"${s.k()} transform="rotate(-20 134 150)"/>
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
      <ellipse cx="66" cy="146" rx="11" ry="16" fill="${s.f("#A8754E")}"${s.k()} transform="rotate(20 66 146)"/><ellipse cx="134" cy="146" rx="11" ry="16" fill="${s.f("#A8754E")}"${s.k()} transform="rotate(-20 134 146)"/>
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
      <ellipse cx="66" cy="146" rx="11" ry="16" fill="${s.f("#C98A55")}"${s.k()} transform="rotate(20 66 146)"/><ellipse cx="134" cy="146" rx="11" ry="16" fill="${s.f("#C98A55")}"${s.k()} transform="rotate(-20 134 146)"/>
      <circle cx="52" cy="44" r="19" fill="${s.f("#C98A55")}"${s.k()}/><circle cx="148" cy="44" r="19" fill="${s.f("#C98A55")}"${s.k()}/>
      <circle cx="52" cy="44" r="9" fill="#F2B7A0"/><circle cx="148" cy="44" r="9" fill="#F2B7A0"/>
      <ellipse cx="100" cy="82" rx="62" ry="54" fill="${s.f("#D69A62")}"${s.k()}/>
      <ellipse cx="100" cy="104" rx="28" ry="20" fill="${s.f("#F2D3B0")}"/>
      ${gesicht(s, 76, 124, 74, 10, 108, a)}<ellipse cx="100" cy="96" rx="10" ry="7" fill="${D}"/>`); },

    papagei(stil, a) { const s = bau(stil); return svg(s, `
      <path d="M84 184 L66 222 L90 204 L100 226 L110 204 L134 222 L116 184 Z" fill="${s.f("#3A8FD0")}"${s.k()}/>
      <path d="M92 186 L92 214 M108 186 L108 214" stroke="#2A6FA8" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="100" cy="148" rx="44" ry="52" fill="${s.f("#4CC27A")}"${s.k()}/>
      <path d="M62 120 Q36 150 46 192 Q58 180 66 186 Q68 172 76 178 Q80 150 70 124 Z" fill="${s.f("#2E9C5A")}"${s.k()}/>
      <path d="M138 120 Q164 150 154 192 Q142 180 134 186 Q132 172 124 178 Q120 150 130 124 Z" fill="${s.f("#2E9C5A")}"${s.k()}/>
      <path d="M58 146 Q52 160 56 174 M142 146 Q148 160 144 174" fill="none" stroke="#FFC83D" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="100" cy="158" rx="22" ry="30" fill="${s.f("#FFE27A")}" opacity=".9"/>
      <path d="M84 44 Q74 22 92 20 Q86 4 104 10 Q112 -4 120 14 Q136 6 134 28 Q146 26 138 46 Z" fill="${s.f("#FF5C5C")}"${s.k()}/>
      <path d="M92 20 Q96 30 100 38 M104 10 Q104 24 104 38 M120 14 Q114 28 110 40" fill="none" stroke="#C93A3A" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="100" cy="82" rx="46" ry="44" fill="${s.f("#FF6B5C")}"${s.k()}/>
      <ellipse cx="100" cy="90" rx="30" ry="26" fill="${s.f("#FFE7DA")}"/>
      ${gesicht(s, 82, 118, 76, 10, 0, a, { ohneMund: true })}
      <path d="M82 92 Q100 80 118 92 Q126 108 116 128 Q110 118 104 116 Q96 112 88 104 Z" fill="${s.f("#FFC83D")}"${s.k(' stroke-width="3.5"')}/>
      <path d="M90 110 Q98 118 106 114 Q104 124 96 122 Q90 118 90 110 Z" fill="${s.f("#E8A62E")}"${s.k(' stroke-width="3"')}/>
      <ellipse cx="86" cy="206" rx="11" ry="5" fill="#8E5C35"/><ellipse cx="114" cy="206" rx="11" ry="5" fill="#8E5C35"/>`); },

    tilda(stil, a) { const s = bau(stil); return svg(s, `
      <ellipse cx="100" cy="128" rx="60" ry="58" fill="${s.f("#4FAF62")}"${s.k()}/>
      <path d="M100 86 L128 102 L128 134 L100 150 L72 134 L72 102 Z" fill="${s.f("#7FCB6A")}" opacity=".85"/>
      <path d="M58 112 L72 102 M58 146 L72 134 M142 112 L128 102 M142 146 L128 134 M86 176 L100 150 M114 176 L100 150" fill="none" stroke="#2E7D45" stroke-width="3.5" stroke-linecap="round"/>
      <ellipse cx="52" cy="150" rx="15" ry="11" fill="${s.f("#8FD67A")}"${s.k()} transform="rotate(-28 52 150)"/><ellipse cx="148" cy="150" rx="15" ry="11" fill="${s.f("#8FD67A")}"${s.k()} transform="rotate(28 148 150)"/>
      <ellipse cx="100" cy="146" rx="38" ry="44" fill="${s.f("#E8D9A0")}"${s.k()}/>
      <path d="M78 128 L122 128 M74 146 L126 146 M80 164 L120 164 M100 104 L100 188" fill="none" stroke="#C9B87A" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="74" cy="200" rx="17" ry="10" fill="${s.f("#8FD67A")}"${s.k()}/><ellipse cx="126" cy="200" rx="17" ry="10" fill="${s.f("#8FD67A")}"${s.k()}/>
      <rect x="86" y="86" width="28" height="22" rx="11" fill="${s.f("#8FD67A")}"${s.k()}/>
      <ellipse cx="100" cy="62" rx="44" ry="40" fill="${s.f("#8FD67A")}"${s.k()}/>
      ${gesicht(s, 84, 116, 56, 10, 80, a)}
      <path d="M60 56 Q46 40 58 26 Q62 8 82 12 Q92 0 106 8 Q122 0 132 14 Q152 16 146 36 Q156 48 142 58 Q138 42 124 40 Q118 30 106 36 Q96 28 86 36 Q72 34 68 46 Q62 48 60 56 Z" fill="${s.f("#9A5530")}"${s.k(' stroke-width="3.5"')}/>
      <path d="M78 22 q8 4 8 12 M100 14 q8 4 8 14 M122 20 q8 6 6 14" fill="none" stroke="#6A3519" stroke-width="3" stroke-linecap="round"/>
      <path d="M134 18 l16 -8 l-2 18 Z M134 18 l-12 -12 l-4 18 Z" fill="${s.f("#7B55B8")}"${s.k(' stroke-width="3"')}/><circle cx="134" cy="17" r="5" fill="${s.f("#B58CF0")}"${s.k(' stroke-width="2.5"')}/>`); }
  };
  const NAMEN = { robo: "Robo Pixel", eule: "Eule Ella", fipsi: "Fipsi", biber: "Biber Benno", baer: "Bärin Bruni", papagei: "Papagei Paula", tilda: "Schildkröte Tilda" };
  // Begleiter dürfen nie als Emoji erscheinen (Wunsch des Auftraggebers 01.11.2026): In Texten und Daten steht statt 🦊 das Zeichen
  // Figuren.ZEICHEN.fipsi (Unicode-Privatbereich); shared/emoji.js ersetzt es überall durch die Zeichnung (auch ohne Noto-Bilder, auch auf Canvas).
  const ZEICHEN = { robo: "\uE101", eule: "\uE102", fipsi: "\uE103", biber: "\uE104", baer: "\uE105", papagei: "\uE106", tilda: "\uE107" };
  // kleines Bild (Kopf und Schultern) für die Stelle eines Emojis
  const mini = (n, ausdruck = "froh") => FIGUREN[n]("a", ausdruck).replace('viewBox="0 0 200 220"', 'viewBox="14 -4 172 172"').replace(/<ellipse cx="100" cy="210"[^>]*\/>/, "");
  window.FigurenNeu = { svg: (n, stil = "a", ausdruck = "froh") => FIGUREN[n](stil, ausdruck), NAMEN, LISTE: Object.keys(FIGUREN), ZEICHEN, mini };
})();

// Gewohnte Schnittstelle der App (vorher eigene Zeichnungen je Seite): Figuren.fipsi("fipsi") usw.
(function () {
  const F = window.FigurenNeu, mit = (name) => (klasse = name, ausdruck = "froh") => F.svg(name, "a", ausdruck).replace("<svg ", `<svg class="${klasse}" `);
  window.Figuren = { fipsi: mit("fipsi"), robo: mit("robo"), eule: mit("eule"), biber: mit("biber"), baer: mit("baer"), papagei: mit("papagei"), tilda: mit("tilda") };
})();
