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

  // ---------- Listen (Namen, Preise, Belohnungen, „für wen“ aus teile.js) ----------
  const mit = (alt, neu) => alt.map(t => Object.assign({}, t, neu(t) || {}));
  const oberteile = mit(P.oberteile, (t) => { const f = OBEN[t.id] ? oberteil(OBEN[t.id]) : oberteil({ aermel: "kurz" }); return { rumpf: f, aermel: () => "", teil: f }; });
  const unterteile = mit(P.unterteile, (t) => { const a = UNTEN[t.id] || { hose: {} }, f = a.rock ? rock(a.rock) : hose(a.hose); return { teil: f }; });

  W.Puppe2 = { oberteile, unterteile, _intern: { stueck, maske, M, MUSTER, MOTIV, oberteil, hose, rock } };
})(window);
