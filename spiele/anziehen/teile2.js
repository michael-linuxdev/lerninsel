// Kleidung, Frisuren und Extras für die neue Kinderfigur (spiele/anziehen/kind.js, freigegeben am 03.11.2026).
// window.Puppe2 hat dieselben Listen und Teile-IDs wie window.Puppe (teile.js) – gespeicherte Looks bleiben gültig; Namen, Preise,
// Belohnungen und „für wen“ kommen aus teile.js. Die alte Zeichnung gibt es weiter über den Eltern-Schalter (eltern.zeichnung = "alt").
//
// Technik „Stoff aus dem Körper“: Ein Kleidungsstück ist der um W aufgeweitete Körperumriss, ausgeschnitten mit einer Maske
// (weiß = Stoff, schwarz = frei, z. B. die Hände vor der Hose). Ärmel- und Beinmasken drehen mit der Pose (POSE.armL/armR/beinR).
// Darin liegen Schattenstufe, Falten, Muster und Motive; Säume und Kragen sind eigene Linien. Röcke, Kleider und Schuhe haben eigene Formen.
// Koordinaten wie kind.js: 300 × 560, Boden y = 541.
(function (W) {
  const K = W.KindFigur, P = W.Puppe;
  if (!K || !P) return;
  const { KF, KW, ns, flaeche, form, strich, dunkel, hell } = K.werkzeug;
  const POSE = K.POSE, UMRISS = K.UMRISS;
  const dreh = (pose) => `rotate(${pose.grad} ${pose.um[0]} ${pose.um[1]})`;
  const AL = dreh(POSE.armL), AR = dreh(POSE.armR), BR = dreh(POSE.beinR);
  let nr = 0;
  const neu = () => "t2-" + (++nr);
  const weissOderDunkel = (c) => { const n = parseInt(c.slice(1), 16); return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 > 190; };
  const akzent = (c) => weissOderDunkel(c) ? dunkel(c, 0.45) : hell(c, 0.75);

  // ---------- Masken ----------
  // Teile einer Maske: [d, transform?]; Rumpf und Beine links ohne Drehung, Arme/rechtes Bein mit Drehung
  const M = {
    hals: (tief = 0) => `C${140 - tief * 0.3} ${196 + tief} ${160 + tief * 0.3} ${196 + tief} 164 186`,
    // Rumpf: unterhalb der Achsel genau zwischen Arm und Körperseite abgeschnitten (x 107 / 193), damit kein Stoff auf die Unterarme kommt
    rumpf: (bis = 322, ausschnitt = 0) => `M60 188 L136 184 C${140 - ausschnitt * 0.3} ${196 + ausschnitt} ${160 + ausschnitt * 0.3} ${196 + ausschnitt} 164 184 L240 188 L240 ${bis} L60 ${bis} Z`,
    // Ärmel bis y (ungedreht): 255 = kurz, 342 = lang (bis Handgelenk)
    armL: (bis) => [`M40 150 L160 150 L160 ${bis} L40 ${bis} Z`, AL],
    armR: (bis) => [`M140 150 L260 150 L260 ${bis} L140 ${bis} Z`, AR],
    // Beine bis y: 336 = Unterhose, 400 = kurz, 470 = Knie/Bermuda, 520 = lang
    beinL: (von, bis) => [`M60 ${von} L150 ${von} L150 ${bis} L60 ${bis} Z`],
    beinR: (von, bis) => [`M150 ${von} L240 ${von} L240 ${bis} L150 ${bis} Z`, BR],
    // Hände (frei lassen, damit sie vor Hose und Rock liegen)
    handL: [[`M70 338 L112 338 L112 400 L70 400 Z`, AL]],
    handR: [[`M188 338 L232 338 L232 400 L188 400 Z`, AR]]
  };
  function maske(weiss, schwarz = []) {
    const id = neu(), p = (l, c) => l.map(([d, t]) => `<path d="${d}" fill="${c}"${t ? ` transform="${t}"` : ""}/>`).join("");
    return { id, def: `<mask id="${id}" maskUnits="userSpaceOnUse" x="-40" y="-40" width="380" height="640">${p(weiss, "#fff")}${p(schwarz, "#000")}</mask>` };
  }
  // Stoffstück: aufgeweitetes Körperteil (K.TEILE.rumpf | armL | armR | beine), zugeschnitten mit einer Maske (Länge, Ausschnitt);
  // innen = Schatten, Muster, Falten; linien = Säume – beides bleibt im Stoff
  const WEIT = 3.5, T = K.TEILE;
  function stueck(pfad, weiss, farbe, innen = "", linien = "", schwarz = []) {
    const m = maske(weiss, schwarz), leib = neu();
    return m.def + `<mask id="${leib}" maskUnits="userSpaceOnUse" x="-40" y="-40" width="380" height="640"><path d="${pfad}" fill="#fff" stroke="#fff" stroke-width="${2 * WEIT}" stroke-linejoin="round"/></mask>` +
      `<g mask="url(#${m.id})"><path d="${pfad}" fill="${KF}" stroke="${KF}" stroke-width="${2 * (WEIT + KW)}" stroke-linejoin="round"/>` +
      `<path d="${pfad}" fill="${farbe}" stroke="${farbe}" stroke-width="${2 * WEIT}" stroke-linejoin="round"/>` +
      `<g mask="url(#${leib})">${innen}${linien}</g></g>`;
  }
  // Schattenstufe für Oberteile (rechte Seite, unter den Armen, Saum) und Falten
  const schattenOben = (c, lang) => {
    const s = dunkel(c, 0.2), t = dunkel(c, 0.36), l = hell(c, 0.28);
    return form("M168 186 C188 204 194 250 192 330 L215 330 L215 186 Z", s) + form("M100 300 C130 312 170 312 200 300 L200 330 L100 330 Z", s, 0.5) +
      `<g transform="${AR}">${form(`M200 196 C212 214 216 250 220 ${lang ? 350 : 262} L240 ${lang ? 350 : 262} L240 196 Z`, s)}</g>` +
      `<g transform="${AL}">${form(`M100 206 C96 230 94 260 92 ${lang ? 330 : 256} L98 ${lang ? 330 : 256} C99 260 101 230 106 208 Z`, l, 0.6)}</g>` +
      form("M118 214 C116 244 116 272 118 300 L124 300 C122 272 122 244 124 214 Z", l, 0.5) +
      strich("M120 240 C126 250 134 254 142 254 M180 240 C174 250 166 254 158 254 M128 300 C136 294 146 292 154 296 M160 280 C168 276 176 276 182 280", t, 1.6, 0.55);
  };
  // Saum quer über einen Arm (ungedreht) und Bündchen
  // Armbreite (ungedreht, linker Arm) je Höhe – damit Säume nur über den Arm laufen, nicht auf den Rumpf
  const armX = (y) => y < 290 ? [91 - (y - 230) * 0.06 - 4, 109 + (290 - y) * 0.03 + 4] : [86 - (y - 290) * 0.06 - 4, 106 - (y - 290) * 0.06 + 3];
  const saumArm = (y, rechts, buendchen) => {
    const [a, b] = armX(y), x0 = rechts ? 300 - b : a, x1 = rechts ? 300 - a : b;
    return `<g transform="${rechts ? AR : AL}">` + strich(`M${x0} ${y} C${x0 + 6} ${y + 2} ${x1 - 6} ${y + 2} ${x1} ${y}`, KF, KW) +
      (buendchen ? strich(`M${x0 + 1} ${y - 8} L${x1 - 1} ${y - 8}`, KF, 1.4, 0.5) : "") + `</g>`;
  };
  const saumQuer = (y, x0 = 108, x1 = 192) => strich(`M${x0} ${y} C${x0 + 30} ${y + 4} ${x1 - 30} ${y + 4} ${x1} ${y}`, KF, KW);
  const kragenRund = (c, tief = 0) => `<path d="M136 184 C${140 - tief * 0.3} ${196 + tief} ${160 + tief * 0.3} ${196 + tief} 164 184" fill="none" stroke="${KF}" stroke-width="${KW}" ${ns}/>` +
    `<path d="M137 186 C${141 - tief * 0.3} ${199 + tief} ${159 + tief * 0.3} ${199 + tief} 163 186" fill="none" stroke="${dunkel(c, 0.25)}" stroke-width="3.5" ${ns}/>`;

  // ---------- Motive (auf der Brust, Mitte 150/250) ----------
  const MOTIV = {
    herz: `<path d="M150 268 C134 258 128 248 132 240 C136 232 147 233 150 242 C153 233 164 232 168 240 C172 248 166 258 150 268 Z" fill="#FFFFFF" stroke="${KF}" stroke-width="2.2"/><path d="M139 241 C141 237 145 237 146 240" stroke="#FF9BC8" stroke-width="2" fill="none"/>`,
    stern: `<path d="M150 228 L156 242 L171 243 L159 252 L163 267 L150 258 L137 267 L141 252 L129 243 L144 242 Z" fill="#FFD84D" stroke="${KF}" stroke-width="2.2" stroke-linejoin="round"/>`,
    rakete: `<g transform="translate(150 250) rotate(-20)"><path d="M0 -24 C8 -16 9 0 6 12 L-6 12 C-9 0 -8 -16 0 -24 Z" fill="#FFFFFF" stroke="${KF}" stroke-width="2.2"/><circle cx="0" cy="-6" r="4" fill="#4FA8F0" stroke="${KF}" stroke-width="1.8"/><path d="M-6 6 L-12 16 L-6 13 Z M6 6 L12 16 L6 13 Z" fill="#E8463B" stroke="${KF}" stroke-width="1.8"/><path d="M-4 13 C-3 20 3 20 4 13" fill="#FFB547" stroke="${KF}" stroke-width="1.6"/></g>`,
    dino: `<g transform="translate(150 252)"><path d="M-20 10 C-22 -2 -12 -10 0 -8 C6 -16 16 -16 18 -8 C22 -6 22 0 16 0 C14 6 10 12 4 12 L4 18 L-2 18 L-2 12 L-10 12 L-10 18 L-16 18 L-16 12 C-22 12 -26 14 -28 10 Z" fill="#7ED957" stroke="${KF}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="12" cy="-9" r="1.8" fill="${KF}"/><path d="M-8 -9 l3 -5 l3 4 M-2 -10 l3 -5 l3 4" fill="#4CAF50" stroke="${KF}" stroke-width="1.4"/></g>`,
    held: `<g transform="translate(150 250)"><path d="M-18 -16 L18 -16 L18 2 C18 12 8 18 0 22 C-8 18 -18 12 -18 2 Z" fill="#FFD84D" stroke="${KF}" stroke-width="2.4" stroke-linejoin="round"/><path d="M4 -12 L-6 2 L1 2 L-4 16 L8 -2 L1 -2 L6 -12 Z" fill="#E8463B" stroke="${KF}" stroke-width="1.6" stroke-linejoin="round"/></g>`
  };
  // ---------- Muster (im Stoff) ----------
  const MUSTER = {
    streifen: (c) => Array.from({ length: 14 }, (_, i) => `<rect x="60" y="${190 + i * 14}" width="190" height="7" fill="${akzent(c)}"/>`).join(""),
    regenbogen: () => ["#FF6F61", "#FFA94D", "#FFD84D", "#7ED957", "#4FA8F0", "#9B6BE0"].map((f, i) => `<rect x="60" y="${190 + i * 24}" width="190" height="24" fill="${f}"/>`).join(""),
    karo: (c) => Array.from({ length: 10 }, (_, i) => `<rect x="${60 + i * 20}" y="180" width="8" height="380" fill="${akzent(c)}" opacity=".45"/><rect x="60" y="${180 + i * 20}" width="200" height="8" fill="${akzent(c)}" opacity=".45"/>`).join("") +
      Array.from({ length: 10 }, (_, i) => `<rect x="${66 + i * 20}" y="180" width="2" height="380" fill="${dunkel(c, 0.4)}" opacity=".5"/>`).join(""),
    glitzer: (c) => Array.from({ length: 40 }, (_, i) => `<circle cx="${90 + (i * 37) % 130}" cy="${190 + (i * 53) % 140}" r="${1.6 + (i % 3)}" fill="#fff" opacity=".85"/>`).join(""),
    strick: (c) => Array.from({ length: 9 }, (_, i) => strich(`M${108 + i * 10} 190 L${108 + i * 10} 330`, dunkel(c, 0.18), 2, 0.6)).join("")
  };

  // ---------- Oberteile ----------
  // art: { aermel: "kurz"|"lang"|"ohne", ausschnitt, motiv, muster, offen (Jacke), kragen, knoepfe, kapuze, tasche, nummer }
  function oberteil(art) {
    return (c) => {
      const lang = art.aermel === "lang", ohne = art.aermel === "ohne", bis = lang ? 342 : 256;
      const weiss = [[M.rumpf(art.saum || 322, art.ausschnitt || 0)]];
      if (!ohne) weiss.push(M.armL(bis), M.armR(bis));
      else weiss.push([`M118 184 L132 184 L132 200 L118 200 Z`], [`M168 184 L182 184 L182 200 L168 200 Z`]);
      const innen = (art.muster ? MUSTER[art.muster](c) : "") + schattenOben(c, lang) +
        (art.offen ? form("M146 192 L154 192 L154 324 L146 324 Z", art.innenFarbe || "#FFFFFF") + strich("M146 192 L146 324 M154 192 L154 324", KF, 2.4) +
          (art.knoepfe ? [212, 240, 268, 296].map(y => `<circle cx="141" cy="${y}" r="3.4" fill="${dunkel(c, 0.35)}" stroke="${KF}" stroke-width="1.4"/>`).join("") : strich("M150 196 L150 322", "#C9C2D6", 2)) : "") +
        (art.motiv ? MOTIV[art.motiv] : "") +
        (art.tasche ? flaeche("M122 282 C130 276 170 276 178 282 L182 318 L118 318 Z", dunkel(c, 0.08), form("M118 306 L182 306 L182 318 L118 318 Z", dunkel(c, 0.2))) : "") +
        (art.nummer ? `<text x="150" y="272" text-anchor="middle" font-size="40" font-weight="700" fill="${akzent(c)}" stroke="${KF}" stroke-width="2" font-family="Fredoka, sans-serif">10</text>` +
          `<g transform="${AL}">${form("M84 214 L92 214 L90 256 L82 256 Z", akzent(c))}</g><g transform="${AR}">${form("M208 214 L216 214 L218 256 L210 256 Z", akzent(c))}</g>` : "") +
        (art.knopfleiste ? strich("M150 196 L150 320", dunkel(c, 0.3), 2) + [214, 240, 266, 292].map(y => `<circle cx="150" cy="${y}" r="2.8" fill="#fff" stroke="${KF}" stroke-width="1.2"/>`).join("") : "") +
        (art.polo ? strich("M150 196 L150 226", dunkel(c, 0.3), 2) + [208, 220].map(y => `<circle cx="150" cy="${y}" r="2.6" fill="#fff" stroke="${KF}" stroke-width="1.2"/>`).join("") : "");
      const linien = (ohne ? "" : saumArm(bis, false, art.buendchen) + saumArm(bis, true, art.buendchen)) + saumQuer(art.saum || 322) +
        (art.buendchen ? strich(`M108 ${(art.saum || 322) - 9} C130 ${(art.saum || 322) - 5} 170 ${(art.saum || 322) - 5} 192 ${(art.saum || 322) - 9}`, KF, 1.4, 0.5) : "");
      let kragen = kragenRund(c, art.ausschnitt || 0);
      if (art.kragen === "hemd") kragen = flaeche("M136 184 L150 206 L132 210 L126 190 Z", c, form("M136 184 L150 206 L142 207 Z", dunkel(c, 0.2))) + flaeche("M164 184 L150 206 L168 210 L174 190 Z", c, form("M164 184 L150 206 L158 207 Z", dunkel(c, 0.2)));
      if (art.kragen === "bubi") kragen = flaeche("M136 184 C128 190 126 200 132 206 C140 208 148 204 150 196 Z", "#FFFFFF") + flaeche("M164 184 C172 190 174 200 168 206 C160 208 152 204 150 196 Z", "#FFFFFF");
      if (art.kragen === "v") kragen = `<path d="M136 184 L150 208 L164 184" fill="none" stroke="${KF}" stroke-width="${KW}" stroke-linejoin="round"/>` + strich("M139 186 L150 204 L161 186", akzent(c), 3);
      if (art.kragen === "jacke") kragen = flaeche("M134 184 L146 196 L146 222 L128 196 Z", dunkel(c, 0.08)) + flaeche("M166 184 L154 196 L154 222 L172 196 Z", dunkel(c, 0.08));
      const traeger = ohne ? flaeche("M120 182 L130 182 L134 200 L124 200 Z", c) + flaeche("M170 182 L180 182 L176 200 L166 200 Z", c) : "";
      const kapuze = art.kapuze ? flaeche("M120 190 C116 176 128 166 150 166 C172 166 184 176 180 190 C170 184 160 182 150 182 C140 182 130 184 120 190 Z", dunkel(c, 0.1), form("M150 166 C172 166 184 176 180 190 L170 186 Z", dunkel(c, 0.25))) +
        strich("M142 194 L140 226 M158 194 L160 226", "#FFFFFF", 2.4) + `<circle cx="140" cy="228" r="2.6" fill="#fff" stroke="${KF}" stroke-width="1.2"/><circle cx="160" cy="228" r="2.6" fill="#fff" stroke="${KF}" stroke-width="1.2"/>` : "";
      const aermelInnen = (rechts) => schattenOben(c, lang) + (art.muster ? MUSTER[art.muster](c) : "") +
        (art.nummer ? (rechts ? `<g transform="${AR}">${form("M208 214 L216 214 L218 256 L210 256 Z", akzent(c))}</g>` : `<g transform="${AL}">${form("M84 214 L92 214 L90 256 L82 256 Z", akzent(c))}</g>`) : "");
      const rumpfStueck = stueck(T.rumpf, [[M.rumpf(art.saum || 322, art.ausschnitt || 0)]], c, innen, saumQuer(art.saum || 322) +
        (art.buendchen ? strich(`M108 ${(art.saum || 322) - 9} C130 ${(art.saum || 322) - 5} 170 ${(art.saum || 322) - 5} 192 ${(art.saum || 322) - 9}`, KF, 1.4, 0.5) : ""));
      const aermel = ohne ? "" : stueck(T.armL, [M.armL(bis)], c, aermelInnen(false), saumArm(bis, false, art.buendchen)) + stueck(T.armR, [M.armR(bis)], c, aermelInnen(true), saumArm(bis, true, art.buendchen));
      return kapuze + rumpfStueck + aermel + traeger + kragen;
    };
  }
  const OBEN = {
    tshirt: { aermel: "kurz" }, herzshirt: { aermel: "kurz", motiv: "herz" }, pulli: { aermel: "lang", buendchen: true },
    hoodie: { aermel: "lang", buendchen: true, kapuze: true, tasche: true }, bluse: { aermel: "kurz", kragen: "bubi", knopfleiste: true },
    sterntop: { aermel: "ohne", motiv: "stern", ausschnitt: 6 }, glitzertop: { aermel: "ohne", muster: "glitzer", ausschnitt: 6 },
    streifen: { aermel: "lang", muster: "streifen" }, regenbogenpulli: { aermel: "lang", muster: "regenbogen", buendchen: true },
    jacke: { aermel: "lang", offen: true, kragen: "jacke", buendchen: true }, strickjacke: { aermel: "lang", offen: true, knoepfe: true, muster: "strick", innenFarbe: "#FFF6E0" },
    trikot: { aermel: "kurz", kragen: "v", nummer: true }, hemd: { aermel: "lang", muster: "karo", kragen: "hemd", knopfleiste: true },
    polo: { aermel: "kurz", kragen: "hemd", polo: true }, dinoshirt: { aermel: "kurz", motiv: "dino" }, raketenshirt: { aermel: "kurz", motiv: "rakete" },
    heldenshirt: { aermel: "kurz", motiv: "held" }
  };

  // ---------- Hosen und Röcke ----------
  const HAENDE = [...M.handL, ...M.handR];
  function hose(art) {
    return (c) => {
      const bis = art.bis || 520, s = dunkel(c, 0.22), t = dunkel(c, 0.4), l = hell(c, 0.25);
      const innen = (art.muster ? MUSTER[art.muster](c) : "") +
        form("M138 300 C142 360 144 430 142 530 L156 530 L156 300 Z", s, 0.8) + `<g transform="${BR}">${form("M172 300 C180 360 186 430 188 530 L210 530 L210 300 Z", s)}</g>` +
        form("M114 330 C112 380 114 420 118 470 L124 470 C120 420 118 380 120 330 Z", l, 0.6) +
        (art.jeans ? strich("M118 300 C124 312 132 316 140 316 M182 300 C176 312 168 316 160 316", t, 1.8, 0.8) + strich("M110 300 L110 520 M190 300 L190 520", hell(c, 0.4), 1.4, 0.6) : "") +
        (bis > 430 ? strich("M118 426 C124 432 134 432 140 426", t, 1.6, 0.6) + `<g transform="${BR}">${strich("M182 426 C176 432 166 432 160 426", t, 1.6, 0.6)}</g>` +
          strich("M114 470 C122 466 134 466 142 470", t, 1.4, 0.45) + `<g transform="${BR}">${strich("M186 470 C178 466 166 466 158 470", t, 1.4, 0.45)}</g>` : "") +
        (art.cargo ? flaeche("M108 380 L126 380 L126 410 L108 410 Z", dunkel(c, 0.08), form("M108 380 L126 380 L126 386 L108 386 Z", t)) + `<g transform="${BR}">${flaeche("M174 380 L192 380 L192 410 L174 410 Z", dunkel(c, 0.08), form("M174 380 L192 380 L192 386 L174 386 Z", t))}</g>` : "") +
        (art.jogging ? strich("M142 300 L140 316 M158 300 L160 316", "#fff", 2.2) + strich("M108 304 L108 520", hell(c, 0.55), 3, 0.9) + `<g transform="${BR}">${strich("M192 304 L192 520", hell(c, 0.55), 3, 0.9)}</g>` : "");
      const linien = strich("M102 304 C130 310 170 310 198 304", KF, 2, 0.8) +
        (art.jeans ? `<circle cx="150" cy="298" r="2.8" fill="#F2C14E" stroke="${KF}" stroke-width="1.2"/>` + strich("M150 306 L150 330", t, 1.8) : "") +
        strich(`M104 ${bis} L152 ${bis}`, KF, KW) + `<g transform="${BR}">${strich(`M148 ${bis} L200 ${bis}`, KF, KW)}</g>` +
        (art.aufschlag ? strich(`M104 ${bis - 10} L152 ${bis - 10}`, KF, 1.6, 0.6) + `<g transform="${BR}">${strich(`M148 ${bis - 10} L200 ${bis - 10}`, KF, 1.6, 0.6)}</g>` : "") +
        (art.jogging ? strich(`M104 ${bis - 9} L152 ${bis - 9}`, KF, 1.4, 0.5) + `<g transform="${BR}">${strich(`M148 ${bis - 9} L200 ${bis - 9}`, KF, 1.4, 0.5)}</g>` : "");
      return stueck(T.beine, [[`M60 270 L240 270 L240 342 L60 342 Z`], M.beinL(300, bis), M.beinR(300, bis)], c, innen, linien);
    };
  }
  // Rock: eigene Form (nicht am Körper), Hände bleiben davor
  function rock(art) {
    return (c) => {
      const lang = art.lang || 400, s = dunkel(c, 0.22), t = dunkel(c, 0.4), l = hell(c, 0.3);
      const breit = art.weit || 12;
      const d = `M110 296 C130 302 170 302 190 296 C${196 + breit * 0.3} ${330} ${200 + breit * 0.6} ${lang - 30} ${204 + breit} ${lang} C${180} ${lang + 12} ${120} ${lang + 12} ${96 - breit} ${lang} C${100 - breit * 0.6} ${lang - 30} ${104 - breit * 0.3} 330 110 296 Z`;
      const m = maske([[`M20 280 L280 280 L280 ${lang + 40} L20 ${lang + 40} Z`]]);
      const innen = (art.muster ? `<g clip-path="url(#${m.id}c)">${MUSTER[art.muster](c)}</g>` : "") +
        form(`M150 300 C160 340 166 ${lang - 40} 170 ${lang + 10} L200 ${lang + 10} C190 ${lang - 40} 172 340 160 300 Z`, s, 0.55) +
        form(`M120 300 C112 340 104 ${lang - 40} 98 ${lang + 10} L82 ${lang + 10} C92 ${lang - 40} 106 340 116 300 Z`, s, 0.5) +
        form(`M186 300 C200 340 210 ${lang - 40} 226 ${lang + 10} L240 ${lang + 10} L240 300 Z`, s) +
        form(`M134 300 C130 340 128 ${lang - 30} 126 ${lang + 8} L136 ${lang + 8} C136 ${lang - 30} 138 340 140 300 Z`, l, 0.6) +
        strich(`M128 300 C120 340 114 ${lang - 30} 110 ${lang + 4} M150 302 C150 340 150 ${lang - 30} 150 ${lang + 8} M172 300 C180 340 186 ${lang - 30} 190 ${lang + 4}`, t, 1.6, 0.5);
      // Tüll: ein hellerer Unterrock blitzt unter dem gezackten Saum hervor
      const zacken = (y, x0, x1, n) => { let z = ""; for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; z += `${i ? "L" : "M"}${x.toFixed(1)} ${y + (i % 2 ? 9 : 0)} `; } return z; };
      const lagen = art.tuell ? flaeche(`M${96 - breit + 4} ${lang - 20} ${zacken(lang + 4, 96 - breit + 4, 204 + breit - 4, 18).replace(/^M/, "L")} L${204 + breit - 4} ${lang - 20} Z`, hell(c, 0.5), "", { kw: 2 }) : "";
      return m.def + `<clipPath id="${m.id}c"><path d="${d}"/></clipPath><g mask="url(#${m.id})">` + lagen + flaeche(d, c, innen) +
        flaeche("M108 292 C130 300 170 300 192 292 L192 306 C170 312 130 312 108 306 Z", dunkel(c, 0.12)) + `</g>`;
    };
  }
  const UNTEN = {
    rock: { rock: { lang: 392 } }, karorock: { rock: { lang: 392, muster: "karo" } }, hose: { hose: { bis: 520 } }, jeans: { hose: { bis: 520, jeans: true, aufschlag: true } },
    jogging: { hose: { bis: 520, jogging: true } }, leggings: { hose: { bis: 516, eng: true } }, shorts: { hose: { bis: 392 } },
    tuell: { rock: { lang: 396, weit: 22, tuell: true } }, cargo: { hose: { bis: 520, cargo: true } }, bermuda: { hose: { bis: 452, cargo: true } }
  };


  // ---------- Kleider und Kostüme ----------
  // Ein Kleid hat unten (Rock/Beine, liegt unter den Armen) und oben (Oberteil mit Ärmeln, liegt über den Armen)
  const BUCHSTABEN = (c) => ["A", "B", "C", "D", "E", "F"].map((b, i) => `<text x="${108 + (i % 3) * 32}" y="${260 + Math.floor(i / 3) * 70}" font-size="20" font-weight="700" fill="${akzent(c)}" font-family="Fredoka, sans-serif">${b}</text>`).join("");
  const BLUMEN = (c) => Array.from({ length: 16 }, (_, i) => { const x = 100 + (i * 41) % 110, y = 230 + (i * 37) % 170; return [0, 72, 144, 216, 288].map(w => `<circle cx="${x + Math.cos(w * Math.PI / 180) * 4}" cy="${y + Math.sin(w * Math.PI / 180) * 4}" r="3.4" fill="${i % 2 ? "#FFFFFF" : "#FFD84D"}"/>`).join("") + `<circle cx="${x}" cy="${y}" r="2.4" fill="${i % 2 ? "#FFD84D" : "#FF6F61"}"/>`; }).join("");
  function kleid(art) {
    const oben = (c) => oberteil({ aermel: art.aermel || "ohne", ausschnitt: art.ausschnitt ?? 6, muster: art.muster, saum: 304, motiv: art.motiv })(c);
    const unten = (c) => rock({ lang: art.lang || 420, weit: art.weit ?? 16, muster: art.muster, tuell: art.tuell })(c);
    return { oben, unten };
  }
  // Ganzkörper-Kostüme: Oberteil (lang) + Hose aus denselben Bausteinen, dazu eigene Details
  function kostuem(art) {
    const oben = (c) => oberteil({ aermel: "lang", buendchen: true, ...(art.oben || {}) })(art.farbeOben || c) + (art.obenExtra ? art.obenExtra(c) : "");
    const unten = (c) => hose({ bis: 520, ...(art.unten || {}) })(art.farbeUnten || c) + (art.untenExtra ? art.untenExtra(c) : "");
    return { oben, unten };
  }
  const meerjungfrau = (c) => {
    const s = dunkel(c, 0.22), l = hell(c, 0.35);
    const d = "M110 296 C130 304 170 304 190 296 C196 340 194 400 184 450 C176 488 164 510 160 522 C176 518 196 524 206 540 C184 548 162 546 150 536 C138 546 116 548 94 540 C104 524 124 518 140 522 C136 510 124 488 116 450 C106 400 104 340 110 296 Z";
    const schuppen = Array.from({ length: 30 }, (_, i) => { const x = 116 + (i % 6) * 14 + (Math.floor(i / 6) % 2) * 7, y = 320 + Math.floor(i / 6) * 34; return `<path d="M${x - 7} ${y} C${x - 7} ${y + 8} ${x + 7} ${y + 8} ${x + 7} ${y}" fill="none" stroke="${l}" stroke-width="2"/>`; }).join("");
    return flaeche(d, c, schuppen + form("M150 300 C166 360 170 440 160 522 L210 540 L210 300 Z", s, 0.6) + form("M120 330 C116 380 118 420 126 460 L132 460 C126 420 124 380 126 330 Z", l, 0.5)) +
      strich("M150 522 L150 536 M140 524 C134 530 120 536 106 538 M160 524 C166 530 180 536 194 538", dunkel(c, 0.35), 1.6, 0.7);
  };
  const KLEIDER = {
    sommer: kleid({ aermel: "ohne", lang: 410 }), blumen: kleid({ aermel: "kurz", lang: 414, muster: "blumen" }),
    latzkleid: { oben: (c) => oberteil({ aermel: "kurz" })("#FFFFFF") + flaeche("M126 238 L174 238 L178 300 L122 300 Z", c, form("M164 238 L174 238 L178 300 L168 300 Z", dunkel(c, 0.2))) +
        strich("M128 240 L126 196 M172 240 L174 196", c, 7) + `<circle cx="130" cy="244" r="3.4" fill="#FFD84D" stroke="${KF}" stroke-width="1.4"/><circle cx="170" cy="244" r="3.4" fill="#FFD84D" stroke="${KF}" stroke-width="1.4"/>` +
        flaeche("M138 256 L162 256 L162 276 L138 276 Z", dunkel(c, 0.08)),
      unten: (c) => rock({ lang: 404, weit: 12 })(c) },
    fee: kleid({ aermel: "ohne", lang: 402, weit: 26, tuell: true, muster: "glitzer" }), ball: kleid({ aermel: "kurz", lang: 520, weit: 46, muster: "glitzer", tuell: true }),
    buchstabenkleid: kleid({ aermel: "kurz", lang: 412, muster: "buchstaben" }), glitzer: kleid({ aermel: "ohne", lang: 410, muster: "glitzer" }),
    regenbogenkleid: kleid({ aermel: "kurz", lang: 412, muster: "regenbogen" }),
    meerjungfrau: { oben: (c) => oberteil({ aermel: "ohne", muster: "glitzer", saum: 304 })(c), unten: meerjungfrau, ohneBeine: true },
    ritter: kostuem({ farbeOben: "#B8C2CF", farbeUnten: "#6B7280", oben: { muster: "kette" }, obenExtra: (c) => flaeche("M124 220 L176 220 L176 300 C166 312 134 312 124 300 Z", c, form("M150 220 L176 220 L176 300 L150 310 Z", dunkel(c, 0.18))) + flaeche("M138 238 L162 238 L162 256 C162 268 150 276 150 276 C150 276 138 268 138 256 Z", "#FFD84D") }),
    astronaut: kostuem({ farbeOben: "#F4F6FA", farbeUnten: "#F4F6FA", obenExtra: () => flaeche("M128 236 L172 236 L172 268 L128 268 Z", "#4FA8F0", `<circle cx="140" cy="252" r="5" fill="#FF6F61"/><circle cx="160" cy="252" r="5" fill="#FFD84D"/>`) + `<g transform="${AL}">${flaeche("M86 224 L102 224 L102 240 L86 240 Z", "#E8463B")}</g>`,
      untenExtra: () => strich("M104 304 L196 304", "#9AA3B2", 6) + strich("M116 440 L142 440", "#9AA3B2", 4) + `<g transform="${BR}">${strich("M158 440 L184 440", "#9AA3B2", 4)}</g>` }),
    pirat: kostuem({ farbeOben: "#FFFFFF", farbeUnten: "#3A3442", oben: { muster: "streifen" }, unten: { bis: 470 },
      obenExtra: (c) => flaeche("M112 196 L136 190 L140 300 L110 300 Z", c) + flaeche("M188 196 L164 190 L160 300 L190 300 Z", c) + flaeche("M108 292 L192 292 L192 308 L108 308 Z", "#E8463B"),
      untenExtra: () => "" }),
    feuerwehr: kostuem({ farbeOben: "#2E3A59", farbeUnten: "#2E3A59", obenExtra: () => strich("M108 286 L192 286", "#FFD84D", 7) + `<g transform="${AL}">${strich("M84 318 L106 318", "#FFD84D", 6)}</g><g transform="${AR}">${strich("M194 318 L216 318", "#FFD84D", 6)}</g>`,
      untenExtra: () => strich("M110 480 L144 480", "#FFD84D", 6) + `<g transform="${BR}">${strich("M156 480 L192 480", "#FFD84D", 6)}</g>` }),
    dinokostuem: kostuem({ oben: { kapuze: true }, obenExtra: (c) => flaeche("M128 230 C126 260 130 296 150 304 C170 296 174 260 172 230 Z", hell(c, 0.45)) +
        [0, 1, 2, 3].map(i => flaeche(`M${190 + i * 2} ${206 + i * 24} l14 8 l-12 10 Z`, dunkel(c, 0.2))).join(""),
      untenExtra: (c) => flaeche("M186 300 C214 310 236 330 246 360 C232 350 214 344 196 342 Z", c, form("M196 330 C216 334 232 344 246 360 L246 370 L196 344 Z", dunkel(c, 0.2))) })
  };
  MUSTER.blumen = BLUMEN; MUSTER.buchstaben = BUCHSTABEN;
  MUSTER.kette = (c) => Array.from({ length: 60 }, (_, i) => `<circle cx="${70 + (i % 12) * 14 + (Math.floor(i / 12) % 2) * 7}" cy="${200 + Math.floor(i / 12) * 14}" r="4.5" fill="none" stroke="${dunkel(c, 0.3)}" stroke-width="1.6"/>`).join("") +
    Array.from({ length: 60 }, (_, i) => `<circle cx="${70 + (i % 12) * 14 + (Math.floor(i / 12) % 2) * 7}" cy="${270 + Math.floor(i / 12) * 14}" r="4.5" fill="none" stroke="${dunkel(c, 0.3)}" stroke-width="1.6"/>`).join("");

  // ---------- Schuhe ----------
  // Fuß links ungedreht, rechts mit der Bein-Drehung; Stiefel bekommen einen Schaft aus dem Bein-Stück
  const SCHUH_L = "M103 529 C103 516 114 508 127 508 C139 508 148 514 149 524 C150 534 148 541 140 543 L110 543 C104 543 101 537 103 529 Z";
  const SCHUH_R = "M197 529 C197 516 186 508 173 508 C161 508 152 514 151 524 C150 534 152 541 160 543 L190 543 C196 543 199 537 197 529 Z";
  function schuh(art) {
    return (c) => {
      const s = dunkel(c, 0.22), l = hell(c, 0.4), sohle = art.sohle || "#FFFFFF";
      const paar = (d, rechts) => {
        let g = flaeche(d, c, form(rechts ? "M150 528 L200 528 L200 546 L150 546 Z" : "M100 528 L150 528 L150 546 L100 546 Z", s, 0.55) +
          form(rechts ? "M178 512 C188 514 192 520 192 526 L186 526 C186 520 184 516 176 514 Z" : "M122 512 C112 514 108 520 108 526 L114 526 C114 520 116 516 124 514 Z", l, 0.7));
        if (art.sohle !== "keine") g += flaeche(rechts ? "M150 536 L198 536 C199 541 196 545 190 545 L158 545 C152 545 149 541 150 536 Z" : "M102 536 L150 536 C151 541 148 545 142 545 L110 545 C104 545 101 541 102 536 Z", sohle, "", { kw: 2.4 });
        if (art.schnuer) g += strich(rechts ? "M164 514 l10 4 M166 520 l10 4" : "M136 514 l-10 4 M134 520 l-10 4", "#FFFFFF", 2.4);
        if (art.schleife) g += `<circle cx="${rechts ? 160 : 140}" cy="512" r="4" fill="${l}" stroke="${KF}" stroke-width="1.6"/>`;
        if (art.glitzer) g += [0, 1, 2, 3, 4].map(i => `<circle cx="${(rechts ? 160 : 112) + i * 7}" cy="${520 + (i % 2) * 6}" r="1.8" fill="#fff"/>`).join("");
        if (art.stollen) g += [0, 1, 2, 3].map(i => `<rect x="${(rechts ? 156 : 106) + i * 11}" y="544" width="5" height="6" rx="1.5" fill="${KF}"/>`).join("");
        if (art.rollen) g += [0, 1].map(i => `<circle cx="${(rechts ? 164 : 116) + i * 22}" cy="551" r="6" fill="#FFD84D" stroke="${KF}" stroke-width="2.4"/>`).join("") + strich(rechts ? "M156 545 L192 545" : "M108 545 L144 545", "#9AA3B2", 4);
        if (art.riemen) g = strich(rechts ? "M156 516 L194 524 M154 530 L196 532" : "M144 516 L106 524 M146 530 L104 532", c, 6) + strich(rechts ? "M156 516 L194 524 M154 530 L196 532" : "M144 516 L106 524 M146 530 L104 532", KF, 1.4, 0.6) +
          flaeche(rechts ? "M150 538 L198 538 C199 542 196 545 190 545 L158 545 C152 545 149 542 150 538 Z" : "M102 538 L150 538 C151 542 148 545 142 545 L110 545 C104 545 101 542 102 538 Z", dunkel(c, 0.3), "", { kw: 2.2 });
        if (art.hase) g += flaeche(rechts ? "M164 512 C160 494 164 484 168 486 C172 488 172 500 170 512 Z M176 512 C176 494 182 486 186 490 C188 494 184 504 180 514 Z" : "M136 512 C140 494 136 484 132 486 C128 488 128 500 130 512 Z M124 512 C124 494 118 486 114 490 C112 494 116 504 120 514 Z", c, form(rechts ? "M166 494 L168 494 L168 508 L166 508 Z" : "M132 494 L134 494 L134 508 L132 508 Z", "#FFB3C7")) +
          `<circle cx="${rechts ? 168 : 132}" cy="522" r="2" fill="${KF}"/><circle cx="${rechts ? 180 : 120}" cy="522" r="2" fill="${KF}"/>`;
        return rechts ? `<g transform="${BR}">${g}</g>` : g;
      };
      const schaft = art.schaft ? stueck(T.beine, [[`M60 ${art.schaft} L150 ${art.schaft} L150 545 L60 545 Z`], [`M150 ${art.schaft} L240 ${art.schaft} L240 545 L150 545 Z`, BR]], c,
        form("M136 470 L156 470 L156 545 L136 545 Z", s, 0.6) + `<g transform="${BR}">${form("M176 470 L200 470 L200 545 L176 545 Z", s)}</g>` + (art.glanz ? strich("M114 " + (art.schaft + 10) + " L116 520", l, 4, 0.8) : ""),
        strich(`M104 ${art.schaft} L152 ${art.schaft}`, KF, KW) + `<g transform="${BR}">${strich(`M148 ${art.schaft} L200 ${art.schaft}`, KF, KW)}</g>`) : "";
      return schaft + paar(SCHUH_L, false) + paar(SCHUH_R, true);
    };
  }
  const SCHUHE = {
    turn: { schnuer: true }, ballerina: { schleife: true, sohle: "keine" }, glitzerschuhe: { schleife: true, glitzer: true, sohle: "keine" }, sandalen: { riemen: true },
    stiefel: { schaft: 466, sohle: "#5C3A21" }, gummi: { schaft: 478, glanz: true, sohle: "#3A3442" }, rollschuhe: { schaft: 500, schnuer: true, rollen: true },
    hasen: { hase: true, sohle: "#FFE3EC" }, fussballschuhe: { stollen: true, schnuer: true, sohle: "#2E2B47" }, sneaker: { schaft: 498, schnuer: true }
  };


  // ---------- Frisuren ----------
  // Kopf: Mitte (150, 108), Schädel oben y 40, Seiten x 93/207, Kinn 178. Jede Frisur hat hinten (hinter Körper und Kopf) und vorne (über dem Kopf).
  const H = K.HAARE;
  const glanz = (f) => form("M112 52 C124 40 142 34 158 34 C138 44 126 54 118 68 Z", hell(f, 0.45), 0.8);
  const kappe = (f, rand) => flaeche(`M92 112 C85 58 118 30 152 30 C186 30 216 56 208 112 ${rand} Z`, f, form("M162 32 C194 40 214 64 208 112 L196 112 L180 32 Z", dunkel(f, 0.2)) + glanz(f));
  const RAENDER = {
    pony: "C204 98 198 88 188 82 C170 90 150 92 128 88 C114 92 102 100 92 112",
    seite: "C204 96 198 84 188 76 C176 86 154 94 120 88 C108 94 100 102 92 112",
    mitte: "C204 98 196 84 182 76 C170 76 158 66 152 56 C146 66 132 76 118 78 C104 84 96 98 92 112",
    zacken: "C207 100 204 92 199 86 L195 94 L189 79 L179 89 L173 73 L161 85 L154 70 L141 86 L133 74 L121 91 L113 81 L106 97 C100 102 95 108 92 112",
    wuschel: "C210 104 206 98 202 94 L198 100 L192 88 L184 96 L180 82 L170 92 L164 78 L156 92 L148 76 L140 92 L132 80 L124 94 L116 84 L110 100 L102 96 C98 104 94 108 92 112",
    locken: "C212 104 204 96 198 96 C196 88 188 84 182 88 C178 80 170 78 164 84 C158 76 148 76 142 84 C136 78 126 80 122 88 C114 84 106 90 106 96 C98 96 92 104 92 112"
  };
  const zopf = (x, y, n, f, rechts) => Array.from({ length: n }, (_, i) => flaeche(`M${x - 11 + (rechts ? 1 : -1) * i * 0.6} ${y + i * 20} C${x - 13} ${y + i * 20 + 10} ${x - 9} ${y + i * 20 + 20} ${x} ${y + i * 20 + 22} C${x + 9} ${y + i * 20 + 20} ${x + 13} ${y + i * 20 + 10} ${x + 11} ${y + i * 20} C${x + 6} ${y + i * 20 - 4} ${x - 6} ${y + i * 20 - 4} ${x - 11} ${y + i * 20} Z`, i % 2 ? dunkel(f, 0.08) : f, form(`M${x} ${y + i * 20} L${x + 14} ${y + i * 20} L${x + 14} ${y + i * 20 + 24} L${x} ${y + i * 20 + 24} Z`, dunkel(f, 0.2)))).join("");
  const band = (x, y, c = "#FF6F61") => `<ellipse cx="${x}" cy="${y}" rx="9" ry="6" fill="${c}" stroke="${KF}" stroke-width="2.4"/>`;
  const dutt = (x, y, r, f) => flaeche(`M${x - r} ${y} C${x - r} ${y - r * 1.2} ${x + r} ${y - r * 1.2} ${x + r} ${y} C${x + r} ${y + r * 1.1} ${x - r} ${y + r * 1.1} ${x - r} ${y} Z`, f, form(`M${x} ${y - r} L${x + r + 2} ${y - r} L${x + r + 2} ${y + r} L${x} ${y + r} Z`, dunkel(f, 0.2)) + strich(`M${x - r * 0.6} ${y - r * 0.2} C${x - r * 0.2} ${y - r * 0.6} ${x + r * 0.3} ${y - r * 0.5} ${x + r * 0.6} ${y}`, dunkel(f, 0.35), 1.6, 0.7));
  // Locken-Wolke (Afro, Puffs): Kreis aus weichen Bögen
  const puff = (x, y, r, f) => {
    const n = Math.max(10, Math.round(r / 4)), pt = (w, rr) => [(x + Math.cos(w) * rr).toFixed(1), (y + Math.sin(w) * rr).toFixed(1)];
    let d = `M${pt(0, r).join(" ")}`;
    for (let i = 0; i < n; i++) { const w0 = i * 2 * Math.PI / n, w1 = (i + 1) * 2 * Math.PI / n; d += ` Q${pt((w0 + w1) / 2, r + r * 0.16).join(" ")} ${pt(w1, r).join(" ")}`; }
    return flaeche(d + " Z", f, form(`M${x + r * 0.15} ${y - r - 8} L${x + r + 10} ${y - r - 8} L${x + r + 10} ${y + r + 8} L${x + r * 0.15} ${y + r + 8} Z`, dunkel(f, 0.2)) +
      Array.from({ length: Math.round(r / 6) }, (_, i) => { const [cx, cy] = pt(i * 2.4, r * 0.55); return strich(`M${cx - 5} ${cy} C${cx - 5} ${cy - 6} ${+cx + 5} ${cy - 6} ${+cx + 5} ${cy}`, dunkel(f, 0.32), 1.4, 0.6); }).join(""), { kw: 2.6 });
  };
  const lockenHinten = (f, bis) => flaeche(`M90 90 ${Array.from({ length: 9 }, (_, i) => `C${78 - (i % 2) * 6} ${100 + i * (bis - 100) / 9} ${78 - (i % 2) * 6} ${100 + (i + 1) * (bis - 100) / 9} 90 ${100 + (i + 1) * (bis - 100) / 9}`).join(" ")} L210 ${bis} ${Array.from({ length: 9 }, (_, i) => `C${222 + (i % 2) * 6} ${bis - i * (bis - 100) / 9} ${222 + (i % 2) * 6} ${bis - (i + 1) * (bis - 100) / 9} 210 ${bis - (i + 1) * (bis - 100) / 9}`).join(" ")} Z`, dunkel(f, 0.12), form("M150 80 L150 300 L240 300 L240 80 Z", dunkel(f, 0.28)));
  const FRISUR = {
    lang: (f) => H.lang(f), scheitel: (f) => H.scheitel(f), bob: (f) => H.bob(f),
    wellen: (f) => ({ hinten: lockenHinten(f, 262), vorne: H.lang(f).vorne }),
    zoepfe: (f) => ({ hinten: zopf(84, 132, 6, f) + zopf(216, 132, 6, f, true) + band(84, 254) + band(216, 254), vorne: kappe(f, RAENDER.mitte) }),
    seitenzopf: (f) => ({ hinten: zopf(204, 140, 7, f, true) + band(206, 282, "#5CCBA6"), vorne: kappe(f, RAENDER.seite) }),
    dutt: (f) => ({ hinten: dutt(150, 36, 24, f) + band(150, 58, "#FF9BC8"), vorne: kappe(f, RAENDER.mitte) }),
    spacebuns: (f) => ({ hinten: dutt(110, 44, 20, f) + dutt(190, 44, 20, f), vorne: kappe(f, RAENDER.pony) }),
    kurz: (f) => ({ hinten: "", vorne: kappe(f, RAENDER.pony) }),
    locken: (f) => ({ hinten: lockenHinten(f, 220), vorne: kappe(f, RAENDER.locken) }),
    puffs: (f) => ({ hinten: puff(92, 52, 26, f) + puff(208, 52, 26, f), vorne: kappe(f, RAENDER.mitte) }),
    pferd: (f) => ({ hinten: flaeche("M196 76 C226 80 236 120 228 170 C224 200 214 220 206 232 C210 200 212 160 204 120 Z", dunkel(f, 0.08), form("M216 90 C230 120 228 170 210 228 L236 228 L236 90 Z", dunkel(f, 0.22))) + band(200, 82, "#7B55B8"), vorne: kappe(f, RAENDER.seite) }),
    igel: (f) => ({ hinten: "", vorne: flaeche("M92 112 C86 76 96 52 108 40 L112 22 L124 36 L134 16 L144 32 L154 12 L162 30 L174 16 L180 34 L194 24 L194 44 C210 60 214 86 208 112 C204 100 198 92 192 88 C170 92 140 92 108 88 C100 94 96 102 92 112 Z", f, form("M170 30 L194 24 L194 44 C210 60 214 86 208 112 L196 112 Z", dunkel(f, 0.2)) + glanz(f)) }),
    wuschel: (f) => ({ hinten: "", vorne: kappe(f, RAENDER.wuschel) }),
    kurzlocken: (f) => ({ hinten: "", vorne: kappe(f, RAENDER.locken) + [[118, 52], [138, 42], [160, 42], [180, 52]].map(([x, y]) => strich(`M${x - 6} ${y} C${x - 6} ${y - 7} ${x + 6} ${y - 7} ${x + 6} ${y}`, dunkel(f, 0.35), 1.6, 0.7)).join("") }),
    afro: (f) => ({ hinten: puff(150, 80, 72, f), vorne: kappe(f, RAENDER.locken) }),
    undercut: (f) => ({ hinten: "", vorne: flaeche("M100 104 C96 80 100 66 108 60 L192 60 C200 66 204 80 200 104 Z", dunkel(f, 0.35), "", { kw: 2 }) +
      flaeche("M100 76 C98 46 124 26 156 28 C188 30 210 52 204 80 C190 70 176 68 160 70 C136 72 116 70 100 76 Z", f, form("M164 30 C194 36 210 56 204 80 L192 74 L180 30 Z", dunkel(f, 0.2)) + glanz(f)) }),
    schulterlang: (f) => ({ hinten: flaeche("M94 90 C86 130 88 180 98 214 C120 222 180 222 202 214 C212 180 214 130 206 90 Z", dunkel(f, 0.15), form("M150 80 L150 230 L220 230 L220 80 Z", dunkel(f, 0.3))), vorne: H.lang(f).vorne })
  };

  // ---------- Listen (Namen, Preise, Belohnungen, „für wen“ aus teile.js) ----------
  const mit = (alt, neu) => alt.map(t => Object.assign({}, t, neu(t) || {}));
  const oberteile = mit(P.oberteile, (t) => { const f = OBEN[t.id] ? oberteil(OBEN[t.id]) : oberteil({ aermel: "kurz" }); return { rumpf: f, aermel: () => "", teil: f }; });
  const unterteile = mit(P.unterteile, (t) => { const a = UNTEN[t.id] || { hose: {} }, f = a.rock ? rock(a.rock) : hose(a.hose); return { teil: f }; });

  const kleider = mit(P.kleider, (t) => { const k = KLEIDER[t.id] || kleid({}); return { rumpf: k.oben, aermel: () => "", rock: k.unten, oben: k.oben, unten: k.unten, ohneBeine: !!k.ohneBeine }; });
  const schuhe = mit(P.schuhe, (t) => ({ teil: schuh(SCHUHE[t.id] || {}) }));
  const haare = mit(P.haare, (t) => { const f = FRISUR[t.id] || FRISUR.kurz; return { hinten: (c) => f(c).hinten, vorne: (c) => f(c).vorne }; });
  // Gesichter: die sieben Ausdrücke der neuen Figur (Form Junge/Mädchen/keine Angabe über setzeForm)
  let geschlecht = "n", hautJetzt = K.HAUT[1];
  const setzeForm = (f) => { geschlecht = f === "m" || f === "w" ? f : "n"; };
  const gesichter = mit(P.gesichter, (t) => ({ teil: () => K.gesicht(geschlecht, t.id, hautJetzt) }));
  const koerper = { kopf: (haut) => { hautJetzt = haut; return K.kopf(haut, geschlecht); } };
  // Extras: vorerst die bewährten Zeichnungen, auf die neue Figur umgerechnet (Kopf größer und höher, Hände an der neuen Stelle)
  const LINKE_HAND = ["armband", "zauberstab", "ballon", "schwert"];
  const EXTRA_TRANSFORM = {
    kopf: "translate(150 104) scale(1.08) translate(-150 -118)", hals: "translate(0 -5)", ruecken: "translate(0 -4)",
    handL: "translate(-2 17)", handR: "translate(15 15)"
  };
  const extraTransform = (t) => t.ebene === "hand" ? EXTRA_TRANSFORM[LINKE_HAND.includes(t.id) ? "handL" : "handR"] : EXTRA_TRANSFORM[t.ebene] || "";
  // Neu gezeichnet (04.11.2026): Dinge in der Hand werden wirklich gehalten (die Finger liegen über dem Griff), Pixelbrille auf Augenhöhe,
  // Ohrringe am Ohrläppchen. Koordinaten direkt in der neuen Figur; Hand-Teile im gedrehten Arm (AL/AR). sicht = Ausschnitt für die Kachel.
  let mitHand = false;
  const kr = (x, y, r) => `M${x - r} ${y} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
  const ell = (x, y, rx, ry) => `M${x - rx} ${y} a${rx} ${ry} 0 1 0 ${2 * rx} 0 a${rx} ${ry} 0 1 0 ${-2 * rx} 0 Z`;
  const fuenfeck = (x, y, r, w = -90) => "M" + [0, 1, 2, 3, 4].map(i => { const a = (w + i * 72) * Math.PI / 180; return `${(x + r * Math.cos(a)).toFixed(1)} ${(y + r * Math.sin(a)).toFixed(1)}`; }).join(" L") + " Z";
  const sternPfad = (x, y, r) => "M" + Array.from({ length: 10 }, (_, i) => { const a = (-90 + i * 36) * Math.PI / 180, q = i % 2 ? r * 0.45 : r; return `${(x + q * Math.cos(a)).toFixed(1)} ${(y + q * Math.sin(a)).toFixed(1)}`; }).join(" L") + " Z";
  // Finger, die sich um den Griff schließen (nur an der Figur, nicht in der Kachel)
  const finger = (rechts) => {
    if (!mitHand) return "";
    const h = hautJetzt, d = rechts ? "M197 366 C197 378 198 386 202 389 C206 392 213 391 216 388 C219 385 219 376 219 366 C212 370 204 370 197 366 Z"
      : "M103 366 C103 378 102 386 98 389 C94 392 87 391 84 388 C81 385 81 376 81 366 C88 370 96 370 103 366 Z";
    const l = rechts ? "M203 372 C203 378 204 384 206 388 M210 372 C210 378 211 384 212 389" : "M97 372 C97 378 96 384 94 388 M90 372 C90 378 89 384 88 389";
    const rand = d.replace(/ C\S+ \S+ \S+ \S+ \S+ \S+ Z$/, "");   // nur die Fingerkuppen umranden, oben geht die Hand weich über
    return flaeche(d, h, form(rechts ? "M213 370 L222 370 L222 392 L213 392 Z" : "M78 370 L87 370 L87 392 L78 392 Z", dunkel(h, 0.16), 0.7), { kontur: false }) + strich(rand, KF, KW) + strich(l, dunkel(h, 0.35), 1.3, 0.8);
  };
  // gedrehter Ausschnitt: lokales Rechteck im Arm → viewBox um alle vier Ecken
  const sichtIm = (pose, x, y, w, h) => {
    const r = pose.grad * Math.PI / 180, [px, py] = pose.um, pt = [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].map(([a, b]) => [px + (a - px) * Math.cos(r) - (b - py) * Math.sin(r), py + (a - px) * Math.sin(r) + (b - py) * Math.cos(r)]);
    const xs = pt.map(q => q[0]), ys = pt.map(q => q[1]), x0 = Math.min(...xs), y0 = Math.min(...ys);
    return [x0, y0, Math.max(...xs) - x0, Math.max(...ys) - y0].map(v => Math.round(v)).join(" ");
  };
  const imArm = (rechts, inhalt) => `<g transform="${rechts ? AR : AL}">${inhalt}${finger(rechts)}</g>`;
  const NEU_EXTRA = {
    fussball: { sicht: sichtIm(POSE.armR, 188, 378, 52, 52), teil: (c) => {
      const p = weissOderDunkel(c) ? "#2E2B47" : dunkel(c, 0.5), x = 214, y = 404, r = 22;
      const flecken = [0, 1, 2, 3, 4].map(i => { const a = (-90 + i * 72) * Math.PI / 180, fx = x + 19 * Math.cos(a), fy = y + 19 * Math.sin(a); return form(fuenfeck(fx, fy, 7, -90 + i * 72 + 36), p) + strich(`M${(x + 7 * Math.cos(a)).toFixed(1)} ${(y + 7 * Math.sin(a)).toFixed(1)} L${(x + 13 * Math.cos(a)).toFixed(1)} ${(y + 13 * Math.sin(a)).toFixed(1)}`, p, 1.6); }).join("");
      return imArm(true, flaeche(kr(x, y, r), c, form(kr(x + 7, y + 7, r), dunkel(c, 0.14), 0.9) + form(fuenfeck(x, y, 7.5), p) + flecken + form(ell(x - 8, y - 10, 5, 3), "#fff", 0.6)));
    } },
    teddy: { sicht: sichtIm(POSE.armR, 186, 370, 54, 96), teil: (c) => {
      const d = dunkel(c, 0.22), l = hell(c, 0.5);
      return imArm(true,
        flaeche("M203 372 C201 386 202 400 206 412 L216 410 C214 398 213 386 212 372 Z", c, form("M209 372 L214 372 L216 410 L211 410 Z", d, 0.7)) +       // Arm, an dem das Kind ihn hält
        flaeche(ell(207, 456, 7, 6), c) + flaeche(ell(225, 456, 7, 6), c, form(ell(225, 458, 4, 3), l)) +
        flaeche(ell(216, 438, 15, 17), c, form("M222 424 C232 432 232 448 222 456 L236 456 L236 424 Z", d, 0.8) + form(ell(216, 442, 8, 9), l)) +
        flaeche(ell(230, 432, 5, 8), c) +
        flaeche(kr(203, 397, 6), c, form(kr(203, 397, 3), l)) + flaeche(kr(227, 397, 6), c, form(kr(227, 397, 3), l)) +
        flaeche(kr(215, 408, 15), c, form("M222 396 C232 402 232 416 222 422 L234 422 L234 396 Z", d, 0.8) + form(ell(215, 414, 7, 5), l)) +
        `<circle cx="210" cy="405" r="2.2" fill="${KF}"/><circle cx="220" cy="405" r="2.2" fill="${KF}"/><ellipse cx="215" cy="411.5" rx="2.6" ry="1.8" fill="${KF}"/>` +
        strich("M212 415 C214 417 216 417 218 415", KF, 1.4) +
        `<path d="M216 446 C210 441 211 436 214 436 C215 436 216 437 216 438 C216 437 217 436 218 436 C221 436 222 441 216 446 Z" fill="#E8336B"/>`);
    } },
    kuscheldino: { sicht: sichtIm(POSE.armR, 172, 362, 82, 66), teil: (c) => {
      const d = dunkel(c, 0.22), l = hell(c, 0.55), z = hell(c, 0.25);
      return imArm(true,
        [194, 203, 212, 221].map((x, i) => flaeche(`M${x - 5} ${386 - (i === 0 ? -2 : 0)} L${x} ${376 - (i % 2) * 2} L${x + 5} ${386 - (i === 0 ? -2 : 0)} Z`, z, "", { kw: 2 })).join("") +
        flaeche("M194 398 C186 402 178 410 172 418 C182 418 192 414 198 408 Z", c, form("M172 418 C182 418 192 414 198 408 L198 420 L172 420 Z", d, 0.8)) +
        flaeche(ell(204, 414, 5, 8), c) + flaeche(ell(222, 414, 5, 8), c, form(ell(223, 417, 3, 4), d, 0.7)) +
        flaeche("M226 392 C232 386 234 380 236 374 L246 376 C244 384 240 394 232 402 Z", c) +
        flaeche(ell(212, 400, 22, 15), c, form("M212 404 C222 404 230 400 234 396 L236 416 L190 416 Z", d, 0.8) + form(ell(212, 406, 12, 6), l)) +
        flaeche(ell(242, 372, 12, 10), c, form(ell(246, 376, 7, 4), l)) +
        `<circle cx="245" cy="369" r="2.3" fill="${KF}"/><circle cx="244.3" cy="368.2" r=".8" fill="#fff"/>` + strich("M240 377 C244 380 249 379 252 376", KF, 1.4));
    } },
    tasche: { sicht: sichtIm(POSE.armR, 184, 366, 54, 72), teil: (c) => {
      const d = dunkel(c, 0.22);
      return imArm(true,
        strich("M196 402 C195 384 200 372 208 372 C216 372 222 384 222 402", KF, 7) + strich("M196 402 C195 384 200 372 208 372 C216 372 222 384 222 402", dunkel(c, 0.3), 3.5) +
        flaeche("M188 404 C188 400 191 398 195 398 L223 398 C227 398 230 400 230 404 L232 428 C232 432 229 434 225 434 L193 434 C189 434 186 432 186 428 Z", c,
          form("M214 398 L232 398 L232 434 L214 434 Z", d, 0.75) + form("M188 404 L192 404 L190 430 L186 430 Z", hell(c, 0.4), 0.7)) +
        flaeche("M187 404 C187 400 191 398 195 398 L223 398 C227 398 231 400 231 404 L229 414 C220 418 198 418 189 414 Z", dunkel(c, 0.12)) +
        flaeche(kr(209, 415, 4), "#FFC83D", "", { kw: 2 }) + strich("M192 426 L226 426", dunkel(c, 0.35), 1.3, 0.6));
    } },
    schwert: { sicht: sichtIm(POSE.armL, 70, 346, 44, 140), teil: (c) => {
      const d = dunkel(c, 0.25);
      return imArm(false,
        flaeche("M86 400 L98 400 L98 466 L92 480 L86 466 Z", c, form("M92 400 L98 400 L98 466 L92 480 Z", d, 0.75) + form("M88 404 L90 404 L90 462 L88 462 Z", hell(c, 0.5), 0.8)) +
        strich("M92 410 L92 466", dunkel(c, 0.4), 1.2, 0.6) +
        flaeche("M74 392 C74 389 76 388 79 388 L105 388 C108 388 110 389 110 392 C110 395 108 396 105 396 L79 396 C76 396 74 395 74 392 Z", "#8A5A34", form("M74 392 L110 392 L110 396 L74 396 Z", "#6B4426")) +
        flaeche("M88 356 L96 356 L96 388 L88 388 Z", "#6B4426", strich("M88 362 L96 366 M88 370 L96 374 M88 378 L96 382", "#4A2E1A", 1.4)) +
        flaeche(kr(92, 354, 5.5), "#8A5A34"));
    } },
    zauberstab: { sicht: sichtIm(POSE.armL, 30, 270, 80, 126), teil: (c) => {
      return imArm(false,
        strich("M96 392 L62 302", KF, 8) + strich("M96 392 L62 302", "#fff", 4) + strich("M90 376 L84 360 M78 344 L72 328", "#B58CF0", 4) +
        flaeche(sternPfad(60, 294, 18), c, form("M60 294 L80 294 L80 320 L60 320 Z", dunkel(c, 0.18), 0.8) + form(sternPfad(55, 288, 5), "#fff", 0.6)) +
        form(sternPfad(36, 278, 5), c) + form(sternPfad(84, 270, 4), c) + form(sternPfad(34, 316, 3.5), c));
    } },
    ballon: { sicht: sichtIm(POSE.armL, 18, 150, 84, 244), teil: (c) => {
      return imArm(false,
        strich("M93 392 C88 340 70 300 72 262 C73 248 62 240 56 228", KF, 1.8) +
        flaeche("M56 228 L50 236 L62 236 Z", dunkel(c, 0.15), "", { kw: 2 }) +
        flaeche(ell(56, 192, 30, 36), c, form("M66 160 C88 176 90 214 64 228 L96 228 L96 160 Z", dunkel(c, 0.18), 0.85) + form("M38 186 C38 172 46 164 54 162 C46 170 42 178 42 188 Z", "#fff", 0.7)));
    } },
    armband: { sicht: sichtIm(POSE.armL, 74, 328, 38, 26), teil: (c) => {
      const p = [[82, 340], [86.5, 342.4], [91.5, 343.4], [96.5, 343], [101.5, 341.4]];
      return `<g transform="${AL}">` + strich("M80 339 C88 345 98 345 104 340", KF, 1.6) + p.map(([x, y], i) => flaeche(kr(x, y, 3.4), i % 2 ? c : "#FFC83D", form(kr(x - 1, y - 1, 1.2), "#fff", 0.7), { kw: 1.8 })).join("") + "</g>";
    } },
    pixelbrille: { sicht: "84 88 132 52", teil: (c) => {
      const glas = (x) => `<path d="M${x - 18} 106 h36 v4 h4 v12 h-4 v4 h-36 v-4 h-4 v-12 h4 Z" fill="${c}" stroke="${KF}" stroke-width="2.4" stroke-linejoin="round"/>` +
        `<rect x="${x - 12}" y="110" width="8" height="4" fill="#fff"/><rect x="${x - 4}" y="114" width="4" height="4" fill="#fff" opacity=".8"/>`;
      return `<rect x="92" y="109" width="20" height="5" fill="${c}" stroke="${KF}" stroke-width="2"/><rect x="188" y="109" width="20" height="5" fill="${c}" stroke="${KF}" stroke-width="2"/>` +
        `<rect x="145" y="110" width="10" height="5" fill="${c}" stroke="${KF}" stroke-width="2"/>` + glas(129) + glas(171);
    } },
    // Hüte und Mützen (04.11.2026): sitzen auf dem Haar, mit Schatten- und Lichtstufe wie die Kleidung
    cap: { teil: (c) => {
      const d = dunkel(c, 0.2);
      return flaeche("M92 94 C88 52 116 24 150 24 C184 24 212 52 208 94 C190 86 170 82 150 82 C130 82 110 86 92 94 Z", c,
          form("M162 24 C196 32 214 60 208 94 L184 86 L176 24 Z", d, 0.85) + form("M112 46 C122 36 136 30 148 30 C132 38 122 46 116 58 Z", hell(c, 0.5), 0.8)) +
        strich("M150 26 C132 40 122 60 120 84 M150 26 C168 40 178 60 180 84", dunkel(c, 0.35), 1.5, 0.7) +
        `<circle cx="150" cy="25" r="5" fill="${d}" stroke="${KF}" stroke-width="2"/>` +
        flaeche("M92 92 C116 80 184 80 208 92 C220 98 216 108 202 106 C178 98 122 98 98 106 C84 108 80 98 92 92 Z", d, form("M100 100 C124 94 176 94 200 100 L200 108 L100 108 Z", dunkel(c, 0.38), 0.8));
    }, sicht: "70 12 160 170" },
    muetze: { teil: (c) => {
      const d = dunkel(c, 0.2), r = dunkel(c, 0.12);
      return flaeche("M92 96 C88 54 116 30 150 30 C184 30 212 54 208 96 Z", c, form("M164 30 C196 38 214 62 208 96 L184 96 L178 30 Z", d, 0.85) +
          strich("M120 44 L116 92 M135 34 L133 92 M150 31 L150 92 M165 34 L167 92 M180 44 L184 92", dunkel(c, 0.3), 1.6, 0.55) + form("M112 54 C120 44 132 38 144 36 C130 44 122 52 118 62 Z", hell(c, 0.5), 0.8)) +
        flaeche("M98 86 L202 86 C212 86 216 92 216 98 C216 104 212 110 202 110 L98 110 C88 110 84 104 84 98 C84 92 88 86 98 86 Z", r,
          form("M84 100 L216 100 L216 112 L84 112 Z", dunkel(c, 0.3), 0.7) + strich([96, 106, 116, 126, 136, 146, 156, 166, 176, 186, 196, 206].map(x => `M${x} 89 L${x} 107`).join(" "), dunkel(c, 0.36), 1.4, 0.6)) +
        flaeche("M150 6 C158 4 164 10 165 16 C171 18 172 28 166 32 C164 38 156 40 150 37 C144 40 136 38 134 32 C128 28 129 18 135 16 C136 10 142 4 150 6 Z", "#FFFFFF", form(kr(158, 28, 11), "#E2DCEB") + form(kr(144, 16, 4), "#fff"));
    }, sicht: "78 2 144 112" },
    weihnachtsmuetze: { teil: (c) => {
      const d = dunkel(c, 0.22);
      return flaeche("M94 92 C94 50 120 26 156 26 C192 26 214 48 228 88 L214 94 C206 70 194 58 180 56 C196 70 204 82 206 92 Z", c,
          form("M170 26 C200 32 218 56 228 88 L214 94 C206 70 194 58 180 56 Z", d, 0.85) + form("M112 54 C120 42 134 34 148 32 C132 42 122 52 116 64 Z", hell(c, 0.45), 0.8)) +
        flaeche("M98 82 C120 78 180 78 202 82 C212 84 214 90 214 94 C214 100 210 106 202 106 C180 102 120 102 98 106 C90 106 86 100 86 94 C86 88 90 84 98 82 Z", "#FFFFFF", form("M86 98 C120 96 180 96 214 98 L214 108 L86 108 Z", "#E2DCEB")) +
        flaeche("M224 82 C232 80 238 86 238 92 C240 100 232 106 224 104 C216 104 212 96 214 90 C214 86 218 82 224 82 Z", "#FFFFFF", form(kr(230, 98, 8), "#E2DCEB"));
    }, sicht: "70 12 180 170" },
    krone: { teil: (c) => {
      const d = dunkel(c, 0.22);
      return flaeche("M112 74 L114 36 L132 54 L150 22 L168 54 L186 36 L188 74 C164 70 136 70 112 74 Z", c,
          form("M150 22 L168 54 L186 36 L188 74 L150 74 Z", d, 0.6) + form("M118 46 L124 52 L122 66 L118 66 Z", hell(c, 0.6), 0.8)) +
        flaeche("M110 70 C136 66 164 66 190 70 L190 80 C164 76 136 76 110 80 Z", d) +
        flaeche(kr(150, 58, 6), "#E8336B", form(kr(148, 56, 2), "#fff", 0.7), { kw: 2 }) + flaeche(kr(128, 63, 4.5), "#3AA0E0", "", { kw: 2 }) + flaeche(kr(172, 63, 4.5), "#5CCBA6", "", { kw: 2 }) +
        [114, 150, 186].map((x, i) => `<circle cx="${x}" cy="${[36, 22, 36][i]}" r="3.6" fill="#fff" stroke="${KF}" stroke-width="1.8"/>`).join("");
    }, sicht: "90 10 120 80" },
    hut: { teil: (c) => {
      const d = dunkel(c, 0.18);
      return flaeche(ell(150, 80, 98, 20), c, form("M52 82 C90 104 210 104 248 82 L248 102 L52 102 Z", d, 0.9)) +
        flaeche("M106 82 C104 46 122 28 150 28 C178 28 196 46 194 82 C166 88 134 88 106 82 Z", c, form("M162 28 C186 34 196 54 194 82 L172 86 Z", d, 0.85) + form("M116 46 C122 38 132 33 142 32 C130 40 124 48 120 58 Z", hell(c, 0.5), 0.8)) +
        flaeche("M106 66 C134 72 166 72 194 66 L194 80 C166 86 134 86 106 80 Z", "#FF6F61", form("M106 76 C134 82 166 82 194 76 L194 84 L106 84 Z", "#E0503F")) +
        [0, 72, 144, 216, 288].map(w => { const a = w * Math.PI / 180; return flaeche(kr(184 + 6 * Math.cos(a), 72 + 6 * Math.sin(a), 4.2), "#fff", "", { kw: 1.6 }); }).join("") + flaeche(kr(184, 72, 3), "#FFD84D", "", { kw: 1.4 });
    }, sicht: "46 14 208 120" },
    entdeckerhut: { teil: (c) => {
      const d = dunkel(c, 0.2);
      return flaeche("M58 84 C80 72 120 70 150 72 C180 70 220 72 242 84 C246 92 236 98 222 96 C190 92 110 92 78 96 C64 98 54 92 58 84 Z", c, form("M58 88 C100 96 200 96 242 88 L242 100 L58 100 Z", d, 0.9)) +
        flaeche("M106 84 C104 50 118 30 150 30 C182 30 196 50 194 84 C166 90 134 90 106 84 Z", c, form("M162 30 C188 36 196 56 194 84 L172 88 Z", d, 0.85) +
          strich("M150 32 C148 44 148 54 150 64", dunkel(c, 0.35), 1.8, 0.7) + form("M116 50 C122 40 132 35 142 34 C130 42 124 50 120 60 Z", hell(c, 0.45), 0.8)) +
        flaeche("M106 70 C134 76 166 76 194 70 L194 82 C166 88 134 88 106 82 Z", "#7A4E25", form("M106 78 C134 84 166 84 194 78 L194 86 L106 86 Z", "#5C3A1A")) +
        flaeche("M182 74 C186 58 194 46 204 40 C202 54 196 66 186 76 Z", "#5CCBA6", strich("M184 74 C190 62 196 52 202 44", "#3E9C7E", 1.4), { kw: 2 });
    }, sicht: "50 16 200 120" },
    piratenhut: { teil: (c) => {
      const d = dunkel(c, 0.25), g = "#FFC83D";
      return flaeche("M74 86 C90 48 116 28 150 28 C184 28 210 48 226 86 C200 76 176 74 150 80 C124 74 100 76 74 86 Z", c,
          form("M164 28 C196 34 214 56 226 86 C210 80 196 77 182 77 Z", d, 0.9) + form("M100 64 C112 48 128 38 144 34 C128 44 116 54 108 68 Z", hell(c, 0.35), 0.7)) +
        strich("M76 84 C100 74 124 72 150 78 C176 72 200 74 224 84", g, 4) +
        flaeche("M141 48 C141 41 159 41 159 48 C159 53 156 55 156 58 L144 58 C144 55 141 53 141 48 Z", "#FFFFFF", `<circle cx="146" cy="48" r="2.4" fill="${KF}"/><circle cx="154" cy="48" r="2.4" fill="${KF}"/>`, { kw: 1.8 }) +
        strich("M138 60 L162 70 M162 60 L138 70", "#FFFFFF", 3.2);
    }, sicht: "68 10 164 172" },
    schal: { teil: (c) => {
      const d = dunkel(c, 0.22), st = weissOderDunkel(c) ? dunkel(c, 0.4) : "#FFFFFF";
      return flaeche("M154 196 C160 214 164 236 166 262 L148 266 C146 240 144 218 142 200 Z", c,
          form("M156 196 C162 216 166 238 168 262 L158 264 C156 240 154 218 150 198 Z", d, 0.8) + strich("M146 236 L164 232 M147 246 L165 242", st, 4)) +
        strich("M150 268 L149 276 M155 267 L155 276 M160 266 L161 275 M165 265 L167 273", c, 3) +
        flaeche("M126 178 C134 196 166 196 174 178 C182 182 184 194 178 202 C166 214 134 214 122 202 C116 194 118 182 126 178 Z", c,
          form("M120 196 C134 208 166 208 180 196 L182 214 L118 214 Z", d, 0.8) + strich("M128 190 C140 200 160 200 172 190", dunkel(c, 0.35), 1.4, 0.6) + form("M126 182 C130 190 138 196 146 198 C136 198 128 194 124 188 Z", hell(c, 0.45), 0.7)) +
        flaeche("M144 196 C150 192 160 194 162 202 C162 210 154 214 148 212 C142 210 140 202 144 196 Z", c, form("M154 194 L164 194 L164 214 L154 214 Z", d, 0.8));
    }, sicht: "104 166 92 120" },
    ohrringe: { sicht: "76 116 148 42", teil: (c) => [[89, 1], [211, -1]].map(([x]) =>
      strich(`M${x} 130 L${x} 136`, dunkel(c, 0.3), 1.6) + flaeche(kr(x, 131, 2.6), c, "", { kw: 1.6 }) +
      flaeche(`M${x} 136 C${x - 6} 142 ${x - 6} 150 ${x} 152 C${x + 6} 150 ${x + 6} 142 ${x} 136 Z`, c, form(`M${x - 2} 141 C${x - 3} 144 ${x - 3} 147 ${x - 1} 149`, "#fff", 0.6), { kw: 1.8 })).join("") }
  };
  const extras = mit(P.extras, (t) => NEU_EXTRA[t.id] ? { teil: NEU_EXTRA[t.id].teil, sicht: NEU_EXTRA[t.id].sicht, neuGezeichnet: true }
    : { teil: (c) => `<g transform="${extraTransform(t)}">${t.teil(c)}</g>` });
  // Ausschnitt eines alten Extra-Bildes (viewBox) in neue Koordinaten umrechnen
  function extraSicht(t, vb) {
    if (t.sicht) return t.sicht;
    const [x, y, w, h] = vb.split(" ").map(Number), tr = extraTransform(t);
    const m = /translate\((-?[\d.]+) (-?[\d.]+)\)(?: scale\(([\d.]+)\))?/.exec(tr);
    if (!m) return vb;
    if (m[3]) { const sk = +m[3]; return [150 + (x - 150) * sk, 104 + (y - 118) * sk, w * sk, h * sk].map(v => Math.round(v)).join(" "); }
    return [x + +m[1], y + +m[2], w, h].join(" ");
  }

  // ---------- Neues Zimmer (Entwurf „Kleiderschrank“, freigegeben 03.11.2026): Fenster mit Himmel, Regal, Bett, Teppich, Pflanze ----------
  // 460 × 620; die Figur steht bei x 80–380, Füße bei y ≈ 555. Junge / Mädchen / keine Angabe mit eigenen Farben und eigener Deko.
  function zimmer() {
    const g = geschlecht;
    const wand = g === "w" ? "#FFE3EC" : g === "m" ? "#DCEEFF" : "#EFE6FF", wandS = dunkel(wand, 0.07), boden = "#E9C899", bodenS = dunkel(boden, 0.12);
    const decke = g === "w" ? "#FF9BC8" : g === "m" ? "#6FA8E8" : "#9B7BD8", kissen = g === "w" ? "#FFD84D" : "#FF8A5B", vorhang = g === "w" ? "#C9A0F0" : g === "m" ? "#7FC4A0" : "#F2B66B";
    const deko = g === "w" ? Array.from({ length: 10 }, (_, i) => `<path d="M${i * 48 + 10} 60 l22 0 l-11 18 z" fill="${["#FF9BC8", "#FFD84D", "#7ED957", "#4FA8F0"][i % 4]}" stroke="${KF}" stroke-width="1.6"/>`).join("") + strich("M0 58 Q230 76 460 58", KF, 2)
      : g === "m" ? Array.from({ length: 6 }, (_, i) => `<g transform="translate(${30 + i * 78} ${70 + (i % 2) * 14}) rotate(-30)">${flaeche("M0 -12 C5 -6 6 4 4 10 L-4 10 C-6 4 -5 -6 0 -12 Z", "#fff", "", { kw: 1.6 })}<circle cx="0" cy="-2" r="2.4" fill="#4FA8F0"/></g>`).join("")
      : Array.from({ length: 12 }, (_, i) => `<circle cx="${i * 40 + 20}" cy="${70 + (i % 2) * 12}" r="5" fill="#fff" opacity=".8"/>`).join("");
    return `<rect width="460" height="620" fill="${wand}"/><rect width="460" height="40" fill="${wandS}"/>` + deko +
      flaeche("M300 100 H436 V270 H300 Z", "#BFE6FF", form("M300 210 C340 196 390 200 436 186 V270 H300 Z", "#9ED58A") + form("M316 140 C324 130 340 130 346 140 C356 132 370 138 370 148 L316 150 Z", "#fff") + `<circle cx="404" cy="132" r="15" fill="#FFD84D"/>`) +
      strich("M368 100 V270 M300 186 H436", KF, 5) + flaeche("M290 266 H446 V280 H290 Z", "#fff", form("M290 274 H446 V280 H290 Z", "#E2DCEB")) +
      flaeche("M286 92 C302 130 304 200 296 266 L280 266 L280 92 Z", vorhang) + flaeche("M450 92 C434 130 432 200 440 266 L456 266 L456 92 Z", vorhang) +
      flaeche("M24 150 H150 V162 H24 Z", "#C98D5A", form("M24 158 H150 V162 H24 Z", "#A8693A")) +
      ["#E8463B", "#4FA8F0", "#FFD84D", "#7ED957", "#9B6BE0"].map((c, i) => flaeche(`M${32 + i * 14} ${150 - 32 - (i % 2) * 6} h11 v${32 + (i % 2) * 6} h-11 Z`, c, "", { kw: 2 })).join("") +
      (g === "w" ? flaeche("M112 150 C108 134 118 124 128 124 C138 124 146 134 142 150 Z", "#F2B66B", `<circle cx="122" cy="136" r="2" fill="${KF}"/><circle cx="134" cy="136" r="2" fill="${KF}"/>`)
        : flaeche("M110 150 L122 122 L134 150 Z", "#E8463B", `<circle cx="122" cy="138" r="3" fill="#BFE6FF"/>`)) +
      `<rect y="470" width="460" height="150" fill="${boden}"/>` + strich("M0 520 H460 M0 572 H460", bodenS, 2, 0.7) + strich("M0 470 H460", KF, 3) +
      flaeche("M60 560 C60 530 400 530 400 560 C400 590 60 590 60 560 Z", g === "w" ? "#FFC2D9" : g === "m" ? "#9BD3F2" : "#D9C8F5", form("M90 560 C90 542 370 542 370 560 C370 578 90 578 90 560 Z", "#fff", 0.35)) +
      flaeche("M330 370 H460 V476 H330 Z", "#C98D5A", form("M330 456 H460 V476 H330 Z", "#A8693A")) + flaeche("M340 340 H460 V396 H340 Z", decke, form("M340 380 H460 V396 H340 Z", dunkel(decke, 0.2))) +
      flaeche("M350 320 C350 306 404 304 408 320 C410 338 350 342 350 320 Z", kissen) + flaeche("M320 290 H336 V476 H320 Z", "#A8693A") +
      flaeche("M16 440 H66 L60 480 H22 Z", "#E8794A", form("M16 440 H66 V448 H16 Z", "#C2582D")) + flaeche("M40 440 C16 410 20 380 36 370 C40 390 42 410 42 440 Z", "#5DBB63") + flaeche("M42 440 C56 400 72 390 82 392 C76 412 62 430 44 440 Z", "#7ED957");
  }
  const orte = P.orte.map(o => o.id === "zimmer" ? Object.assign({}, o, { teil: zimmer }) : o);

  const finde = (l, id) => l.find(t => t.id === id);
  // Ganze Figur aus einem gespeicherten Look (gleiches Format wie bisher)
  function zeichneFigur(o) {
    const haut = (o.figur && o.figur.farbe) || K.HAUT[1], k = K.koerper(haut);
    const haar = o.haare && finde(haare, o.haare.id), ober = o.oberteil && finde(oberteile, o.oberteil.id), unter = o.unterteil && finde(unterteile, o.unterteil.id);
    const kl = o.kleid && finde(kleider, o.kleid.id), schuh = o.schuhe && finde(schuhe, o.schuhe.id), ges = (o.figur && finde(gesichter, o.figur.id)) || gesichter[0];
    const ex = (ebene) => extras.filter(e => e.ebene === ebene && o.extras && o.extras[e.id]).map(e => e.teil(o.extras[e.id].farbe)).join("");
    const ohneBeine = !!(kl && kl.ohneBeine);
    let s = ex("ruecken") + (haar ? haar.hinten(o.haare.farbe) : "") + k.koerper;
    if (kl) s += kl.unten(o.kleid.farbe); else s += unter ? unter.teil(o.unterteil.farbe) : k.hose;
    if (schuh && !ohneBeine) s += schuh.teil(o.schuhe.farbe);
    s += k.arme;
    if (kl) s += kl.oben(o.kleid.farbe); else s += ober ? ober.teil(o.oberteil.farbe) : k.hemd;
    hautJetzt = haut; mitHand = true;
    s += ex("hand") + ex("hals"); mitHand = false;
    s += K.kopf(haut, geschlecht) + ges.teil() + (haar ? haar.vorne(o.haare.farbe) : "") + ex("kopf");
    return s;
  }
  W.Puppe2 = { neu: true, oberteile, unterteile, kleider, schuhe, haare, gesichter, extras, orte, koerper, setzeForm, FUER: P.FUER, D: P.D, ton: P.ton,
    zeichneFigur, extraSicht, SICHT: { figur: "82 24 136 160", haare: "40 -4 220 300", oben: "52 168 196 196", unten: "50 280 200 280", kleider: "30 168 240 420", schuhe: "92 488 120 72", orte: "0 0 460 620" },
    FIGUR_Y: 14, KOPF: "50 18 200 200", BUESTE: "40 6 220 290", _intern: { stueck, maske, M, MUSTER, MOTIV, oberteil, hose, rock } };
})(window);
