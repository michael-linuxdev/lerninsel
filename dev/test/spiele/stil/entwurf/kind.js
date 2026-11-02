// Entwurf 03.11.2026: neue Kinderfigur für den Kleiderschrank (Rückmeldung des Auftraggebers vom 02.11.2026: „dünn, steif, Strichbeine,
// Schlauch-Arme“ → richtige Kinderproportionen, Hände, lockere Pose; Kleidung mit Stoff, Falten und Schatten).
// Vorderansicht, Gewicht auf einem Bein, linker Arm hängt locker, rechte Hand an der Hüfte. Fläche + Schattenstufe + Lichtstufe, Kontur obendrauf.
// Variante "a" = Kinderbuch (Kopf ≈ 1/4,6 der Größe, weicher), "b" = schlanker/älter (Kopf ≈ 1/5,4, längere Beine).
// Koordinaten 300 × 560, Boden bei y = 540. Nur Vorschau (spiele/stil/entwurf.html) – noch nicht in der App.
(function (W) {
  const KF = "#3B1F63", KW = 3;
  let nr = 0;
  const ns = 'vector-effect="non-scaling-stroke"';
  const flaeche = (d, fill, innen = "", { kontur = true, kw = KW } = {}) => {
    if (!innen) return `<path d="${d}" fill="${fill}" ${kontur ? `stroke="${KF}" stroke-width="${kw}" stroke-linejoin="round" ${ns}` : ""}/>`;
    const c = "kd" + (++nr);
    return `<clipPath id="${c}"><path d="${d}"/></clipPath><path d="${d}" fill="${fill}"/><g clip-path="url(#${c})">${innen}</g>` +
      (kontur ? `<path d="${d}" fill="none" stroke="${KF}" stroke-width="${kw}" stroke-linejoin="round" ${ns}/>` : "");
  };
  const form = (d, fill, op = 1) => `<path d="${d}" fill="${fill}"${op < 1 ? ` opacity="${op}"` : ""}/>`;
  const strich = (d, farbe = KF, w = KW, op = 1) => `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${ns}${op < 1 ? ` opacity="${op}"` : ""}/>`;
  // Farbe abdunkeln/aufhellen (Schatten- und Lichtstufe aus dem Grundton)
  const mische = (hex, ziel, t) => { const a = parseInt(hex.slice(1), 16), b = parseInt(ziel.slice(1), 16); const k = (s) => Math.round(((a >> s) & 255) * (1 - t) + ((b >> s) & 255) * t); return "#" + ((1 << 24) + (k(16) << 16) + (k(8) << 8) + k(0)).toString(16).slice(1); };
  const dunkel = (c, t = 0.22) => mische(c, "#3B1F63", t), hell = (c, t = 0.35) => mische(c, "#FFFFFF", t);

  // ---------- Körper ----------
  const BEIN_L = "M118 300 C113 342 115 382 119 420 C121 452 121 490 123 524 L146 524 C146 492 147 454 148 420 C150 380 150 342 150 306 Z";
  const BEIN_R = "M182 300 C188 342 188 382 183 420 C182 454 186 492 191 524 L168 524 C166 492 163 456 160 420 C157 382 155 346 152 306 Z";
  const RUMPF = "M116 186 C130 180 170 180 184 186 C192 230 190 270 184 304 C164 314 136 314 116 304 C110 270 108 230 116 186 Z";
  const ARM_L = "M108 190 C98 218 93 246 92 268 C90 292 89 314 89 334 L113 336 C114 314 117 292 119 270 C121 248 125 224 130 200 Z";
  const ARM_R = "M172 194 C196 204 213 226 223 252 C227 263 225 273 216 280 C208 287 201 294 196 300 L180 290 C186 283 193 276 200 268 C193 250 184 234 168 218 Z";
  const HAND_L = "M88 330 C83 340 83 354 88 363 C93 371 106 373 113 366 C118 359 118 345 115 332 Z";
  const HAND_R = "M198 292 C192 285 180 285 175 292 C170 300 172 310 180 313 C188 315 197 312 200 305 Z";
  const KOPF_W = "M98 102 C96 62 122 38 150 38 C178 38 204 62 202 102 C202 130 192 152 176 165 C167 172 159 176 150 176 C141 176 133 172 124 165 C108 152 98 130 98 102 Z";
  const KOPF_M = "M98 102 C96 62 122 38 150 38 C178 38 204 62 202 102 C202 128 194 148 182 162 C172 172 162 176 150 176 C138 176 128 172 118 162 C106 148 98 128 98 102 Z";

  function koerper(haut, g, kurzeArme = true) {
    const s = dunkel(haut, 0.18), l = hell(haut, 0.3);
    const bein = (d, schatten) => flaeche(d, haut, form(schatten, s) + form("M120 330 C124 380 126 420 128 470 L134 470 C132 420 130 380 126 330 Z", l, 0.5));
    return {
      beine: bein(BEIN_L, "M140 300 C142 360 142 420 140 530 L160 530 L160 300 Z") + bein(BEIN_R, "M166 300 C176 360 180 420 178 530 L200 530 L200 300 Z") +
        strich("M128 420 C132 424 138 424 142 420 M168 420 C172 424 178 424 182 420", s, 1.6, 0.8),   // Knie
      rumpf: flaeche(RUMPF, haut, form("M160 180 C180 200 186 250 182 310 L200 310 L200 180 Z", s)),
      armL: flaeche(ARM_L, haut, form("M110 196 C104 230 102 270 100 336 L118 336 L128 196 Z", s, 0.0) + form("M118 200 C114 240 112 290 112 336 L120 336 L130 200 Z", s)) +
        flaeche(HAND_L, haut, form("M104 334 C108 344 110 356 106 366 L118 366 L118 334 Z", s)) +
        strich("M96 348 C94 352 94 357 96 362 M103 350 C102 354 102 359 104 364 M110 348 C109 352 109 357 110 361", s, 1.4) + strich("M90 338 C84 344 84 352 89 356", KF, KW * 0.7),   // Finger, Daumen
      armR: flaeche(ARM_R, haut, form("M200 230 C210 246 216 262 212 274 L222 274 L222 230 Z", s)) +
        flaeche(HAND_R, haut, form("M176 302 C180 308 190 310 198 304 L198 314 L174 314 Z", s)) + strich("M184 292 C182 296 182 300 184 304 M190 292 C188 296 188 300 190 304", s, 1.3),
      hals: flaeche("M139 158 L139 188 C146 192 154 192 161 188 L161 158 Z", haut, form("M139 158 L161 158 L161 176 C154 182 146 182 139 176 Z", s)),
      kopf: (() => {
        const K = g === "m" ? KOPF_M : KOPF_W;
        return flaeche("M92 112 C88 104 90 96 96 98 L102 120 C98 122 94 118 92 112 Z", haut) + flaeche("M208 112 C212 104 210 96 204 98 L198 120 C202 122 206 118 208 112 Z", haut) +
          flaeche(K, haut, form("M168 40 C196 52 206 90 202 112 C198 140 186 160 168 172 L220 180 L220 40 Z", s, 0.55) + form("M112 70 C122 52 140 44 156 44 C136 52 124 64 118 80 Z", l, 0.6));
      })(),
      gesicht: (() => {
        const auge = (x) => `<path d="M${x - 10} 112 C${x - 6} 104 ${x + 6} 104 ${x + 10} 112 C${x + 6} 118 ${x - 6} 118 ${x - 10} 112 Z" fill="#fff" stroke="${KF}" stroke-width="2" ${ns}/>` +
          `<circle cx="${x + 1}" cy="111.5" r="5.4" fill="#6B4A2E"/><circle cx="${x + 1}" cy="111.5" r="2.8" fill="#1E1422"/><circle cx="${x - 1}" cy="109.5" r="1.6" fill="#fff"/>`;
        const brauen = g === "m" ? strich("M117 96 L138 94 M162 94 L183 96", "#5C3A21", 3.2) : strich("M118 98 C124 93 132 93 137 95 M163 95 C168 93 176 93 182 98", "#5C3A21", 2.2);
        const wimpern = g === "m" ? "" : strich("M118 109 l-4 -3 M182 109 l4 -3", KF, 1.8);
        return auge(128) + auge(172) + brauen + wimpern +
          strich("M150 120 C152 128 152 132 148 134", dunkel(haut, 0.3), 2) +
          `<path d="M138 146 C144 153 156 153 162 146 C156 149 144 149 138 146 Z" fill="#C2405A" stroke="${KF}" stroke-width="2.4" stroke-linejoin="round" ${ns}/>`;
      })()
    };
  }

  // ---------- Haare ----------
  const HAARE = {
    lang: (f) => ({
      hinten: flaeche("M98 90 C88 150 88 220 102 262 C120 270 180 270 198 262 C212 220 212 150 202 90 Z", dunkel(f, 0.12), form("M150 80 L150 270 L210 270 L210 80 Z", dunkel(f, 0.28)) + strich("M110 160 C108 200 110 230 116 256 M190 160 C192 200 190 230 184 256", dunkel(f, 0.4), 1.6, 0.6)),
      vorne: flaeche("M96 112 C90 56 124 32 152 32 C182 32 212 56 204 112 C200 92 192 78 180 68 C170 82 146 90 120 86 C108 90 100 100 96 112 Z", f,
        form("M156 34 C186 38 206 64 204 112 C198 94 190 80 180 70 L176 34 Z", dunkel(f, 0.2)) + form("M118 50 C130 40 146 36 160 38 C140 44 128 54 122 66 Z", hell(f, 0.4), 0.7)) +
        flaeche("M98 108 C94 140 96 170 104 190 C108 170 108 140 106 112 Z", f) + flaeche("M202 108 C206 140 204 170 196 190 C192 170 192 140 194 112 Z", dunkel(f, 0.15)) +
        strich("M130 44 C122 56 118 70 120 86 M150 36 C146 52 146 66 150 80 M172 44 C176 54 180 62 180 70", dunkel(f, 0.35), 1.6, 0.7)
    }),
    scheitel: (f) => ({
      hinten: "",
      vorne: flaeche("M96 110 C90 58 120 32 152 32 C186 32 210 58 204 106 C200 94 196 86 190 82 C178 78 166 68 160 56 C150 72 126 82 104 86 C100 94 98 102 96 110 Z", f,
        form("M160 34 C190 40 208 64 204 106 C200 94 196 86 190 82 C178 78 166 68 160 56 Z", dunkel(f, 0.22)) + form("M112 54 C122 42 138 36 154 36 C136 46 124 56 118 68 Z", hell(f, 0.4), 0.7)) +
        strich("M160 56 C150 50 140 48 128 50 M150 40 C140 46 130 54 120 66 M168 44 C176 52 184 62 194 70", dunkel(f, 0.35), 1.6, 0.7)
    })
  };

  // ---------- Kleidung ----------
  // T-Shirt mit Ärmeln für beide Arme (hängender und angewinkelter Arm), Kragen, Falten und Motiv
  function tshirt(f, motiv) {
    const s = dunkel(f), t = dunkel(f, 0.38), l = hell(f, 0.3);
    const R = "M110 186 C126 176 174 176 190 186 C196 228 195 272 190 310 C166 320 134 320 110 310 C105 272 104 228 110 186 Z";
    return {
      aermelL: flaeche("M110 186 C96 194 89 214 88 236 L121 244 C121 226 123 208 130 196 Z", f, form("M112 230 L124 234 L124 246 L106 246 Z", s) + strich("M93 230 C100 234 110 236 121 236", t, 1.5, 0.6)),
      aermelR: flaeche("M172 186 C196 192 210 210 218 230 L196 250 C190 232 182 218 170 208 Z", f, form("M198 218 L218 232 L198 252 Z", s) + strich("M184 206 C190 214 195 224 198 232", t, 1.5, 0.6)),
      rumpf: flaeche(R, f, form("M164 180 C186 196 192 250 186 316 L200 316 L200 180 Z", s) + form("M110 296 C130 306 170 306 192 296 L192 320 L110 320 Z", s, 0.7) + form("M114 196 C118 240 116 270 116 296 L122 296 C124 270 124 240 120 196 Z", l, 0.5) +
        strich("M124 200 C128 214 134 222 140 226 M178 200 C176 214 170 222 164 226 M132 290 C140 284 150 282 158 286 M120 262 C126 256 130 254 134 254", t, 1.6, 0.55) + (motiv || "")) +
      `<path d="M136 182 C142 192 158 192 164 182" fill="none" stroke="${KF}" stroke-width="${KW}" ${ns}/>` + strich("M137 184 C143 196 157 196 163 184", s, 3.4) };
  }
  const RAKETE = `<g transform="translate(150 246) rotate(-20)"><path d="M0 -24 C8 -16 9 0 6 12 L-6 12 C-9 0 -8 -16 0 -24 Z" fill="#FFFFFF" stroke="${KF}" stroke-width="2.2"/><circle cx="0" cy="-6" r="4" fill="#4FA8F0" stroke="${KF}" stroke-width="1.8"/><path d="M-6 6 L-12 16 L-6 13 Z M6 6 L12 16 L6 13 Z" fill="#E8463B" stroke="${KF}" stroke-width="1.8"/><path d="M-4 13 C-3 20 3 20 4 13" fill="#FFB547" stroke="${KF}" stroke-width="1.6"/></g>`;
  const HERZ = `<path d="M150 262 C136 252 130 244 134 236 C138 228 148 230 150 238 C152 230 162 228 166 236 C170 244 164 252 150 262 Z" fill="#FFFFFF" stroke="${KF}" stroke-width="2.2"/><path d="M140 238 C142 234 146 234 147 237" stroke="#FF9BC8" stroke-width="2" fill="none"/>`;
  // Jeans: Hosenbeine folgen den Beinen, Bund, Taschen, Knie- und Saumfalten, Aufschlag
  function jeans(f) {
    const s = dunkel(f, 0.25), t = dunkel(f, 0.45), l = hell(f, 0.22);
    const BL = "M112 300 L152 300 L152 318 C152 360 150 400 149 440 C148 470 148 494 148 512 L118 512 C117 490 116 466 116 440 C113 400 110 350 112 300 Z";
    const BR = "M148 300 L190 300 C192 350 190 400 186 440 C186 468 188 492 192 512 L164 512 C162 490 160 466 158 440 C155 400 152 360 150 318 Z";
    return flaeche(BR, f, form("M174 300 C182 360 184 420 182 520 L200 520 L200 300 Z", s) + form("M156 340 C158 380 160 410 162 440 L166 440 C164 410 162 380 160 340 Z", l, 0.6) +
        strich("M166 430 C172 436 180 436 186 430 M164 476 C170 472 178 472 184 476", t, 1.6, 0.6)) +
      flaeche(BL, f, form("M138 300 C140 360 142 420 142 520 L156 520 L156 300 Z", s) + form("M120 330 C122 380 122 420 122 460 L128 460 C126 420 126 380 126 330 Z", l, 0.6) +
        strich("M122 430 C128 436 136 436 142 430 M120 476 C126 472 136 472 144 476", t, 1.6, 0.6)) +
      flaeche("M116 500 L150 500 L150 514 L116 514 Z", l) + flaeche("M162 500 L193 500 L194 514 L163 514 Z", l) +
      flaeche("M110 296 L192 296 L192 312 L110 312 Z", f, form("M110 306 L192 306 L192 314 L110 314 Z", s, 0.6)) +
      strich("M150 312 L150 336 M118 314 C124 326 132 330 140 330 M184 314 C178 326 170 330 162 330", t, 1.6, 0.8) + `<circle cx="150" cy="304" r="2.6" fill="#F2C14E" stroke="${KF}" stroke-width="1.2"/>`;
  }
  // Rock (Tellerrock) mit Falten
  function rock(f) {
    const s = dunkel(f, 0.22), t = dunkel(f, 0.4), l = hell(f, 0.3);
    const R = "M112 296 L190 296 C204 330 214 360 220 388 C190 400 110 400 80 388 C88 360 98 330 112 296 Z";
    return flaeche(R, f, form("M150 300 C160 340 166 370 170 400 L196 400 C186 360 172 330 160 300 Z", s, 0.55) + form("M120 300 C112 330 104 360 98 396 L84 396 C92 360 104 330 116 300 Z", s, 0.55) +
      form("M184 300 C200 336 210 364 222 400 L230 400 L230 300 Z", s) + form("M134 300 C130 340 128 370 126 398 L136 398 C136 370 138 340 140 300 Z", l, 0.6) +
      strich("M128 300 C120 330 114 360 110 392 M150 302 C150 334 150 364 150 396 M172 300 C180 330 186 360 190 392", t, 1.6, 0.55)) +
      flaeche("M110 292 L192 292 L192 306 L110 306 Z", dunkel(f, 0.1)) + `<path d="M84 388 C110 398 190 398 218 388" fill="none" stroke="${hell(f, 0.6)}" stroke-width="2" ${ns}/>`;
  }
  // Schuhe
  function sneaker(f) {
    const s = dunkel(f, 0.22);
    const schuh = (x, dx) => flaeche(`M${x - 18} 524 C${x - 18} 510 ${x - 10} 504 ${x} 504 C${x + 10} 504 ${x + 16} 510 ${x + 18 + dx} 520 C${x + 26 + dx} 524 ${x + 26 + dx} 534 ${x + 18 + dx} 536 L${x - 18} 536 C${x - 22} 536 ${x - 22} 528 ${x - 18} 524 Z`, f,
      form(`M${x - 24} 528 L${x + 30 + dx} 528 L${x + 30 + dx} 540 L${x - 24} 540 Z`, "#FFFFFF") + form(`M${x + 6} 504 C${x + 14} 506 ${x + 18} 512 ${x + 20} 520 L${x + 30} 528 L${x + 6} 528 Z`, s, 0.6)) +
      strich(`M${x - 6} 512 l10 2 M${x - 4} 518 l10 2`, "#FFFFFF", 2.2) + strich(`M${x - 22} 529 L${x + 28 + dx} 529`, KF, 1.8);
    return schuh(133, -2) + schuh(178, 4);
  }
  function ballerina(f) {
    const schuh = (x, dx) => flaeche(`M${x - 16} 526 C${x - 16} 516 ${x - 8} 512 ${x} 512 C${x + 10} 512 ${x + 16} 516 ${x + 20 + dx} 526 C${x + 24 + dx} 532 ${x + 20 + dx} 538 ${x + 12 + dx} 538 L${x - 14} 538 C${x - 20} 538 ${x - 20} 530 ${x - 16} 526 Z`, f,
      form(`M${x - 20} 532 L${x + 24 + dx} 532 L${x + 24 + dx} 540 L${x - 20} 540 Z`, dunkel(f, 0.3))) + `<circle cx="${x + 2}" cy="516" r="3.4" fill="${hell(f, 0.5)}" stroke="${KF}" stroke-width="1.4"/>`;
    return schuh(134, 0) + schuh(178, 2);
  }

  // ---------- Figur ----------
  function figur({ g = "m", variante = "a", haut = "#F6C9A3", haar = "#A8693A", oben = "#2E6FB8", unten = "#4A6FA5", schuh = "#E8463B" } = {}) {
    const k = koerper(haut, g);
    const h = (g === "m" ? HAARE.scheitel : HAARE.lang)(haar);
    const art = arguments[0] || {};
    const untenArt = art.untenArt || (g === "m" ? "jeans" : "rock"), schuhArt = art.schuhArt || (g === "m" ? "sneaker" : "ballerina");
    const kleidung = TEILE[untenArt](unten) + TEILE[schuhArt](schuh);
    const shirt = tshirt(oben, art.motiv === "" ? "" : (art.motiv === "herz" || (!art.motiv && g === "w")) ? HERZ : RAKETE);
    // Proportionen: Variante b = kleinerer Kopf, längerer Körper (gleiche Teile, anders gestreckt)
    const V = variante === "a" ? { kopf: 1, koerper: 1, schlank: 1 } : { kopf: 0.84, koerper: 1.08, schlank: 0.92 };
    const KOERPER = `translate(150 540) scale(${V.schlank} ${V.koerper}) translate(-150 -540)`;
    const halsOben = 540 - (540 - 186) * V.koerper;   // Schulterhöhe nach dem Strecken
    const KOPF = `translate(150 ${halsOben}) scale(${V.kopf}) translate(-150 -186)`;
    const unterBeine = g === "m" ? "" : "";
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 560">` +
      `<ellipse cx="156" cy="540" rx="78" ry="9" fill="#3B1F63" opacity=".13"/>` +
      `<g transform="${KOPF}">${h.hinten}</g>` +
      `<g transform="${KOERPER}">${k.beine}${unterBeine}${k.rumpf}${kleidung}${k.armL}${shirt.aermelL}${shirt.rumpf}${k.hals}${k.armR}${shirt.aermelR}</g>` +
      `<g transform="${KOPF}">${k.kopf}${k.gesicht}${h.vorne}</g></svg>`;
  }

  const TEILE = { jeans, rock, sneaker, ballerina };
  // Einzelbild eines Kleidungsstücks (für die Kacheln im Kleiderschrank)
  function teilBild(art, farbe) {
    if (art === "tshirt" || art === "herz" || art === "rakete") { const t = tshirt(farbe, art === "herz" ? HERZ : art === "rakete" ? RAKETE : "");
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="80 170 146 156">${t.aermelL}${t.rumpf}${t.aermelR}</svg>`; }
    if (art === "jeans") return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="70 288 160 236">${jeans(farbe)}</svg>`;
    if (art === "rock") return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="70 270 160 140">${rock(farbe)}</svg>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="98 496 110 50">${TEILE[art](farbe)}</svg>`;
  }
  // Zimmer im Hintergrund: Fenster mit Himmel, Regal, Bett, Teppich, Pflanze – zwei Lichtstufen, warme Farben
  function zimmer(g = "m") {
    const wand = g === "w" ? "#FFE3EC" : "#DCEEFF", wandS = dunkel(wand, 0.08), boden = "#E9C899", bodenS = dunkel(boden, 0.12);
    const decke = g === "w" ? "#FF9BC8" : "#6FA8E8", kissen = g === "w" ? "#FFD84D" : "#FF8A5B";
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 560" preserveAspectRatio="xMidYMid slice">` +
      `<rect width="600" height="560" fill="${wand}"/>` + `<path d="M0 0 H600 V40 H0 Z" fill="${wandS}"/>` +
      (g === "w" ? Array.from({ length: 13 }, (_, i) => `<circle cx="${i * 50 + 10}" cy="${80 + (i % 2) * 14}" r="5" fill="#fff" opacity=".7"/>`).join("") : Array.from({ length: 12 }, (_, i) => `<path d="M${i * 52} 60 l26 0 l-13 22 z" fill="#fff" opacity=".55"/>`).join("")) +
      // Fenster
      flaeche("M60 110 H230 V300 H60 Z", "#BFE6FF", form("M60 230 C110 210 160 220 230 200 V300 H60 Z", "#9ED58A") + form("M80 150 C90 138 110 138 118 148 C130 140 146 146 146 158 L80 160 Z", "#fff") + `<circle cx="196" cy="146" r="16" fill="#FFD84D"/>`) +
      strich("M145 110 V300 M60 205 H230", KF, 5) + flaeche("M48 296 H242 V312 H48 Z", "#fff", form("M48 306 H242 V312 H48 Z", "#E2DCEB")) +
      flaeche("M40 100 C60 140 64 220 52 300 L36 300 L36 100 Z", g === "w" ? "#C9A0F0" : "#7FC4A0") + flaeche("M250 100 C230 140 226 220 238 300 L254 300 L254 100 Z", g === "w" ? "#C9A0F0" : "#7FC4A0") +
      // Regal mit Büchern und Spielzeug
      flaeche("M400 150 H560 V164 H400 Z", "#C98D5A", form("M400 160 H560 V164 H400 Z", "#A8693A")) +
      ["#E8463B", "#4FA8F0", "#FFD84D", "#7ED957", "#9B6BE0"].map((c, i) => flaeche(`M${410 + i * 16} ${150 - 34 - (i % 2) * 6} h13 v${34 + (i % 2) * 6} h-13 Z`, c)).join("") +
      flaeche("M500 150 C496 134 506 122 520 122 C534 122 542 134 538 150 Z", "#F2B66B", `<circle cx="512" cy="134" r="2.4" fill="${KF}"/><circle cx="526" cy="134" r="2.4" fill="${KF}"/>`) +
      // Boden und Teppich
      `<path d="M0 420 H600 V560 H0 Z" fill="${boden}"/>` + strich("M0 470 H600 M0 520 H600", bodenS, 2, 0.7) + `<path d="M0 420 H600" stroke="${KF}" stroke-width="3"/>` +
      flaeche("M150 470 C150 448 450 448 450 470 C450 500 150 500 150 470 Z", g === "w" ? "#FFC2D9" : "#9BD3F2", form("M170 470 C170 456 430 456 430 470 C430 488 170 488 170 470 Z", "#fff", 0.35)) +
      // Bett rechts
      flaeche("M420 330 H600 V440 H420 Z", "#C98D5A", form("M420 420 H600 V440 H420 Z", "#A8693A")) + flaeche("M430 300 H600 V360 H430 Z", decke, form("M430 344 H600 V360 H430 Z", dunkel(decke, 0.2))) +
      flaeche("M440 280 C440 266 500 264 504 280 C506 300 440 304 440 280 Z", kissen) + flaeche("M410 250 H426 V440 H410 Z", "#A8693A") +
      // Pflanze links
      flaeche("M20 400 H70 L64 440 H26 Z", "#E8794A", form("M20 400 H70 V408 H20 Z", "#C2582D")) + flaeche("M44 400 C20 370 24 340 40 330 C44 350 46 370 46 400 Z", "#5DBB63") + flaeche("M46 400 C60 360 76 350 86 352 C80 372 66 390 48 400 Z", "#7ED957") +
      `</svg>`;
  }
  W.KindEntwurf = { figur, teilBild, zimmer, dunkel, hell };
})(window);
