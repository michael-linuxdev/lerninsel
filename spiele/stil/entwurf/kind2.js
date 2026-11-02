// Entwurf 2 der Kinderfigur (03.11.2026, Wahl des Auftraggebers: „Alle neu, eher Kinderbuch“).
// Kinderbuch-Proportionen (Kopf ≈ 1/4,4 der Größe, runder Hinterkopf, kleines Kinn), lockere Pose (Standbein links, Spielbein rechts,
// linker Arm hängt locker, rechte Hand an der Hüfte), Hände mit Fingern und Daumen, Knie und Waden, nackte Füße (Schuhe kommen darüber).
// Normale Augen (weißes Auge mit Iris, Pupille, Glanzpunkt), keine Wangen. Junge ("m"), Mädchen ("w"), keine Angabe ("n") verschieden in
// Gesicht (Brauen, Wimpern, Kinn) und Grundfrisur. Fläche + Schattenstufe + Lichtstufe, Kontur #3B1F63 obendrauf.
// Koordinaten 300 × 560, Boden y = 540, Kopfmitte (150, 108). Nur Vorschau – Kleidung wird nach der Freigabe dafür neu gezeichnet.
(function (W) {
  const KF = "#3B1F63", KW = 3;
  let nr = 0;
  const ns = 'vector-effect="non-scaling-stroke"';
  const mische = (hex, ziel, t) => { const a = parseInt(hex.slice(1), 16), b = parseInt(ziel.slice(1), 16); const k = (s) => Math.round(((a >> s) & 255) * (1 - t) + ((b >> s) & 255) * t); return "#" + ((1 << 24) + (k(16) << 16) + (k(8) << 8) + k(0)).toString(16).slice(1); };
  const dunkel = (c, t = 0.2) => mische(c, "#5A2E3A", t), hell = (c, t = 0.35) => mische(c, "#FFFFFF", t);
  const flaeche = (d, fill, innen = "", { kontur = true, kw = KW } = {}) => {
    if (!innen) return `<path d="${d}" fill="${fill}" ${kontur ? `stroke="${KF}" stroke-width="${kw}" stroke-linejoin="round" ${ns}` : ""}/>`;
    const c = "k2" + (++nr);
    return `<clipPath id="${c}"><path d="${d}"/></clipPath><path d="${d}" fill="${fill}"/><g clip-path="url(#${c})">${innen}</g>` +
      (kontur ? `<path d="${d}" fill="none" stroke="${KF}" stroke-width="${kw}" stroke-linejoin="round" ${ns}/>` : "");
  };
  const form = (d, fill, op = 1) => `<path d="${d}" fill="${fill}"${op < 1 ? ` opacity="${op}"` : ""}/>`;
  const strich = (d, farbe = KF, w = KW, op = 1) => `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${ns}${op < 1 ? ` opacity="${op}"` : ""}/>`;

  const HAUT = ["#FFE3CC", "#F7CBA6", "#E9B28A", "#C98E64", "#A06A48", "#6E4631"];
  const HAAR = ["#F2CB6A", "#D29A4A", "#A0652F", "#5C3A21", "#2A2230", "#C4532A"];

  // ---------- Körper ----------
  const RUMPF = "M114 196 C126 186 174 186 186 196 C194 214 195 238 192 258 C192 278 194 292 193 306 C172 316 128 316 107 306 C106 292 108 278 108 258 C105 238 106 214 114 196 Z";
  const BEIN_L = "M109 298 C104 338 106 374 113 404 C109 424 109 448 115 474 C118 492 120 506 121 516 L144 516 C145 504 148 486 150 466 C152 446 150 422 149 404 C152 372 153 340 152 304 Z";
  const BEIN_R = "M150 304 C151 340 153 372 156 404 C155 424 157 448 162 470 C166 490 171 506 174 516 L197 516 C196 504 196 488 196 468 C198 446 196 422 192 404 C196 372 198 338 192 298 Z";
  const ARM_L = "M120 192 C104 192 95 204 93 224 C91 244 92 260 94 272 C92 292 90 312 88 330 L111 334 C113 314 116 294 118 274 C120 258 122 244 124 232 C128 214 128 200 120 192 Z";
  const ARM_R = "M168 194 C195 202 215 224 226 251 C230 263 228 274 218 282 C210 289 203 296 198 302 L180 291 C186 284 193 277 200 268 C193 251 183 236 163 220 Z";
  const HAND_L = "M88 330 C81 339 80 352 83 362 C85 369 87 375 91 377 C94 379 96 377 96 374 C98 379 102 380 104 376 C107 380 111 379 112 374 C115 376 118 372 117 366 C119 356 118 342 115 332 Z";
  const HAND_R = "M199 291 C193 284 181 283 175 290 C170 297 171 308 179 312 C187 316 197 313 201 306 Z";
  const FUSS_L = "M120 512 C113 520 110 532 115 539 C121 543 146 543 151 539 C153 532 150 520 145 512 Z";
  const FUSS_R = "M173 512 C170 520 171 532 177 539 C183 543 205 543 210 538 C212 530 204 520 198 512 Z";
  const KOPF = {
    w: "M150 40 C182 40 207 62 207 98 C207 128 197 150 181 164 C171 173 160 178 150 178 C140 178 129 173 119 164 C103 150 93 128 93 98 C93 62 118 40 150 40 Z",
    n: "M150 40 C182 40 207 62 207 98 C207 127 198 148 184 162 C173 173 161 178 150 178 C139 178 127 173 116 162 C102 148 93 127 93 98 C93 62 118 40 150 40 Z",
    m: "M150 40 C182 40 207 62 207 98 C207 126 200 146 188 160 C177 172 163 178 150 178 C137 178 123 172 112 160 C100 146 93 126 93 98 C93 62 118 40 150 40 Z"
  };


  // Hand (03.11.2026, Rückmeldung „Hände“): Handrücken, vier Finger mit Zwischenräumen und Nägeln, abgesetzter Daumen; Ursprung = Handgelenk,
  // Finger zeigen nach +y; gedreht und gespiegelt an Arm und Hüfte gesetzt
  function hand(x, y, winkel, haut, spiegel = 1, gross = 1) {
    const s = dunkel(haut, 0.16), t = dunkel(haut, 0.32), l = hell(haut, 0.3);
    const HAND = "M-11 -6 C-11 -4 -11 -3 -11 -2 C-13 6 -14 14 -13 21 C-13 28 -12 34 -8 37 C-5 39 -3 37 -3 34 C-2 39 2 41 4 38 C6 41 10 41 11 37 C13 39 16 37 15 33 C16 26 15 18 14 10 C13 5 12 1 11 -2 Z";
    const DAUMEN = "M9 5 C13 8 15 14 15 20 C15 24 12 25 10 23 C10 18 10 13 8 10 Z";
    return `<g transform="translate(${x} ${y}) rotate(${winkel}) scale(${spiegel * gross} ${gross})">` +
      flaeche(HAND, haut, form("M4 -4 L16 -4 L16 42 L6 42 C8 30 8 14 4 -4 Z", s) + form("M-10 4 C-11 12 -11 20 -10 26 L-7 26 C-8 20 -8 12 -7 4 Z", l, 0.6), { kontur: false }) +
      strich(HAND.replace(" Z", "")) +   // Kontur ohne Kante am Handgelenk
      strich("M-3 34 C-3 30 -3 27 -2 25 M4 38 C4 33 4 29 4 26 M11 37 C11 33 10 29 10 26", t, 1.4) +
      strich("M-9 24 C-5 22 4 22 13 24", t, 1.2, 0.5) +
      flaeche(DAUMEN, haut, form("M13 9 C15 13 16 18 15 23 L18 23 L18 9 Z", s, 0.8)) + `</g>`;
  }

  function koerper(haut) {
    const s = dunkel(haut, 0.16), t = dunkel(haut, 0.3), l = hell(haut, 0.3);
    const knie = (x) => strich(`M${x - 9} 402 C${x - 4} 408 ${x + 4} 408 ${x + 8} 402`, t, 1.6, 0.7);
    return {
      beine: flaeche(BEIN_R, haut, form("M174 300 C186 350 192 410 188 520 L204 520 L204 300 Z", s) + form("M156 330 C158 370 160 400 162 430 L166 430 C164 400 162 370 160 330 Z", l, 0.55)) +
        flaeche(BEIN_L, haut, form("M136 304 C142 360 144 430 142 520 L156 520 L156 304 Z", s) + form("M118 330 C120 370 120 400 122 440 L127 440 C126 400 125 370 124 330 Z", l, 0.55)) +
        knie(132) + knie(172) +
        flaeche(FUSS_L, haut, form("M112 532 L154 532 L154 545 L112 545 Z", s)) + flaeche(FUSS_R, haut, form("M170 532 L214 532 L214 545 L170 545 Z", s)) +
        strich("M126 534 l0 5 M133 535 l0 5 M140 535 l0 4 M188 535 l0 5 M195 535 l0 5 M202 534 l0 4", t, 1.3, 0.6),
      rumpf: flaeche(RUMPF, haut, form("M166 188 C190 204 196 252 192 318 L204 318 L204 188 Z", s) + form("M120 206 C116 236 116 266 118 296 L124 296 C122 266 122 236 126 206 Z", l, 0.5)),
      // Unterwäsche (ohne Kleidung): Unterhemd und Unterhose, weiß mit Schattenstufe
      waesche: flaeche("M119 194 L130 192 C136 205 164 205 170 192 L181 194 C191 216 192 250 190 280 L193 306 C172 316 128 316 107 306 L110 280 C108 250 109 216 119 194 Z", "#FFFFFF",
          form("M160 196 C184 214 190 260 188 316 L200 316 L200 196 Z", "#E9E3F2")) +
        flaeche("M107 296 C128 305 172 305 193 296 L196 332 C184 338 168 338 158 336 L151 324 L144 336 C132 338 116 338 105 332 Z", "#FFFFFF", form("M150 300 L196 296 L196 340 L158 340 Z", "#E9E3F2")),
      // linker Arm (03.11.2026, „Linker Arm auch anpassen“): runde Schulter, kommt hinter dem Rumpf hervor, Ellbogen leicht gebeugt
      armL: flaeche(ARM_L, haut, form("M112 196 C122 214 120 260 112 340 L130 340 L130 196 Z", s) + form("M99 214 C96 236 96 262 97 296 L102 296 C101 262 101 236 104 214 Z", l, 0.55), { kontur: false }) +
        strich("M128 208 C126 200 124 194 120 192 C104 192 95 204 93 224 C91 244 92 260 94 272 C92 292 90 312 88 330") + strich("M124 232 C122 244 120 258 118 274 C116 294 113 314 111 334") +
        strich("M96 268 C99 272 104 273 108 270", t, 1.4, 0.6),
      handL: hand(99, 330, 4, haut, 1),
      // rechter Arm (Hand an der Hüfte): Oberarm kommt hinter dem Rumpf hervor (armRHinten), Unterarm und Hand liegen davor –
      // so wächst der Arm aus der Schulter statt angesetzt zu wirken (Rückmeldung 03.11.2026: „Der rechte Arm ist angebaut“)
      armRHinten: flaeche("M160 194 C186 192 208 208 220 232 C228 248 228 262 218 270 C208 260 198 248 188 240 C178 232 168 228 160 226 Z", haut,
        form("M196 206 C212 220 222 238 224 256 L234 256 L234 206 Z", s) + form("M176 202 C190 208 202 220 208 232 L212 230 C206 216 194 204 180 198 Z", l, 0.5)),
      armR: flaeche("M224 246 C230 258 228 271 219 280 C211 288 204 295 199 301 L181 290 C187 283 193 276 200 268 C205 261 210 253 213 244 Z", haut,
          form("M218 250 C224 262 222 274 214 282 L226 286 L232 250 Z", s), { kontur: false }) +
        strich("M224 246 C230 258 228 271 219 280 C211 288 204 295 199 301") + strich("M213 250 C209 258 205 263 200 268 C193 276 187 283 181 290") +
        strich("M213 258 C217 260 219 264 219 268", t, 1.4, 0.6) +
        hand(190, 294, 42, haut, -1, 0.95),
      hals: flaeche("M139 160 L139 190 C146 194 154 194 161 190 L161 160 Z", haut, form("M139 160 L161 160 L161 180 C154 186 146 186 139 180 Z", s))
    };
  }


  // ---------- Körper, Neufassung (03.11.2026, „Nur der Kopf ist gut. Fang bitte nochmal von vorne mit dem Körper an.“) ----------
  // Ein einziger Umriss für Hals, Schultern, Arme, Hände, Rumpf, Beine und Füße (wie im Kinderbuch) – nichts wirkt angesetzt.
  // Linke Hälfte als Bézier-Segmente [c1x, c1y, c2x, c2y, x, y]; die rechte Hälfte ist gespiegelt und rückwärts durchlaufen.
  const START = [139, 158];
  const LINKS = [
    [139, 170, 139, 180, 139, 186],      // Hals
    [128, 190, 118, 191, 111, 196],      // Schulter
    [102, 201, 97, 211, 95, 226],        // runde Schulter (Deltamuskel)
    [92, 246, 90, 266, 88, 284],         // Oberarm außen bis Ellbogen (leicht vom Körper weg)
    [86, 302, 84, 322, 83, 340],         // Unterarm außen bis Handgelenk
    [80, 345, 77, 354, 77, 364],         // Handkante
    [77, 372, 78, 380, 81, 383],         // kleiner Finger
    [83, 384, 84, 382, 85, 381],
    [86, 386, 88, 390, 91, 389],         // Ringfinger
    [92, 388, 92, 386, 93, 385],
    [94, 390, 97, 393, 99, 391],         // Mittelfinger
    [100, 390, 100, 387, 101, 386],
    [102, 389, 105, 389, 106, 385],      // Zeigefinger
    [107, 381, 106, 376, 105, 372],
    [108, 372, 111, 368, 111, 362],      // Daumen setzt ab
    [111, 356, 107, 350, 103, 348],
    [104, 328, 105, 306, 107, 288],      // Unterarm innen bis Ellbogen
    [109, 270, 113, 252, 119, 238],      // Oberarm innen bis Achsel
    [117, 254, 114, 270, 114, 284],      // Rumpf bis Taille
    [113, 296, 110, 304, 110, 316],      // Hüfte
    [107, 358, 108, 398, 112, 428],      // Oberschenkel außen bis Knie
    [113, 444, 108, 462, 110, 486],      // Wade
    [111, 498, 115, 506, 116, 512],      // Knöchel
    [111, 518, 106, 524, 106, 531],      // Fuß außen
    [106, 538, 110, 541, 116, 541],
    [124, 541, 133, 541, 139, 540],      // Sohle bis großer Zeh
    [145, 539, 147, 534, 146, 528],
    [145, 522, 144, 518, 143, 515],      // Fuß innen
    [142, 510, 141, 505, 141, 498],      // Knöchel innen
    [143, 476, 142, 450, 143, 430],      // Wade innen bis Knie
    [145, 398, 149, 364, 150, 340]       // Oberschenkel innen bis Schritt
  ];
  const spiegel = (x) => +(300 - x).toFixed(1);
  // Pose: Arme schwingen leicht vom Körper weg (rechts mehr), rechtes Bein ist Spielbein und steht etwas nach außen.
  // Drehung in Grad um einen Drehpunkt; betroffen sind die Segmente des Arms/Beins (Start- und Endpunkt am Rumpf bleiben fest).
  const POSE = { armL: { um: [96, 222], grad: 4 }, armR: { um: [204, 222], grad: -9 }, beinR: { um: [186, 330], grad: -3.5 } };
  const dreh = ([x, y], [px, py], grad) => { const w = grad * Math.PI / 180, c = Math.cos(w), sn = Math.sin(w); return [+(px + (x - px) * c - (y - py) * sn).toFixed(1), +(py + (x - px) * sn + (y - py) * c).toFixed(1)]; };
  function segmente(spiegeln) {
    let p0 = spiegeln ? [spiegel(START[0]), START[1]] : START;
    return LINKS.map(([a, b, c, e, x, y]) => { const f = (q) => spiegeln ? [spiegel(q[0]), q[1]] : q; const sg = { p0, c1: f([a, b]), c2: f([c, e]), p: f([x, y]) }; p0 = sg.p; return sg; });
  }
  function bewege(sg, von, bis, pose, ende = true) {
    for (let i = von; i <= bis; i++) {
      const s2 = sg[i];
      s2.c1 = dreh(s2.c1, pose.um, pose.grad); s2.c2 = dreh(s2.c2, pose.um, pose.grad);
      if (i < bis || ende) s2.p = dreh(s2.p, pose.um, pose.grad);
      if (i + 1 < sg.length) sg[i + 1].p0 = s2.p;
    }
  }
  // Abschnitte in LINKS: Arm 3–16 (Achsel-Abschnitt 17 nur am Anfang), Bein 20–29 (Schritt-Abschnitt 30 nur am Anfang)
  function umriss() {
    const L = segmente(false), R = segmente(true);
    bewege(L, 3, 16, POSE.armL); L[17].c1 = dreh(L[17].c1, POSE.armL.um, POSE.armL.grad);
    bewege(R, 3, 16, POSE.armR); R[17].c1 = dreh(R[17].c1, POSE.armR.um, POSE.armR.grad);
    bewege(R, 20, 29, POSE.beinR); R[30].c1 = dreh(R[30].c1, POSE.beinR.um, POSE.beinR.grad);
    let d = `M${L[0].p0.join(" ")}`;
    L.forEach(q => { d += ` C${q.c1.join(" ")} ${q.c2.join(" ")} ${q.p.join(" ")}`; });
    for (let i = R.length - 1; i >= 0; i--) { const q = R[i]; d += ` C${q.c2.join(" ")} ${q.c1.join(" ")} ${q.p0.join(" ")}`; }
    return d + " Z";
  }
  const gedreht = (pose, inhalt) => `<g transform="rotate(${pose.grad} ${pose.um[0]} ${pose.um[1]})">${inhalt}</g>`;
  const UMRISS = umriss();
  function koerperNeu(haut) {
    const s = dunkel(haut, 0.16), t = dunkel(haut, 0.32), l = hell(haut, 0.32);
    const innen =
      form("M139 158 L161 158 L161 182 C154 188 146 188 139 182 Z", s) +                                         // Hals unter dem Kinn
      form("M170 196 C186 206 188 240 186 284 C188 300 190 316 190 340 L176 340 C178 300 176 250 166 200 Z", s, 0.85) +   // rechte Rumpfseite
      gedreht(POSE.armR, form("M192 200 C202 208 206 224 208 250 C210 300 214 340 218 392 L240 392 L240 200 Z", s)) +               // rechter Arm außen
      form("M106 200 C99 214 96 240 94 270 L99 270 C100 240 103 216 110 202 Z", l, 0.6) +                    // Licht linker Oberarm
      form("M122 240 C120 258 119 274 120 290 L124 290 C123 274 124 258 126 240 Z", l, 0.45) +                   // Licht linke Rumpfseite
      form("M172 330 C178 380 184 430 186 470 C188 500 192 520 196 541 L210 541 L210 330 Z", s) +                // rechtes Bein außen
      form("M150 340 C147 380 144 420 143 430 L140 430 C142 400 145 370 148 340 Z", s, 0.6) +                  // linkes Bein innen
      form("M114 350 C112 380 114 410 117 426 L121 426 C119 410 117 380 118 350 Z", l, 0.55) +                   // Licht linker Oberschenkel
      form("M100 534 L148 534 L148 542 L100 542 Z", s) + gedreht(POSE.beinR, form("M152 534 L204 534 L204 544 L152 544 Z", s));                      // Sohlen
    const linien =
      gedreht(POSE.armL, strich("M92 284 C95 288 100 289 104 286", t, 1.5, 0.7) + strich("M84 372 C88 374 96 374 102 371", t, 1.2, 0.45) + strich("M104 360 C102 364 102 368 104 371", t, 1.4, 0.8)) +
      gedreht(POSE.armR, strich("M208 284 C205 288 200 289 196 286", t, 1.5, 0.7) + strich("M216 372 C212 374 204 374 198 371", t, 1.2, 0.45) + strich("M196 360 C198 364 198 368 196 371", t, 1.4, 0.8)) +
      strich("M118 424 C123 430 133 430 139 424", t, 1.5, 0.6) + gedreht(POSE.beinR, strich("M182 424 C177 430 167 430 161 424", t, 1.5, 0.6) + strich("M188 536 l0 4 M180 537 l0 4 M172 537 l0 3", t, 1.3, 0.6)) +
      strich("M112 536 l0 4 M120 537 l0 4 M128 537 l0 3", t, 1.3, 0.6) + strich("M150 338 L150 344", t, 1.4, 0.5);
    return {
      koerper: flaeche(UMRISS, haut, innen) + linien,
      waesche: flaeche("M122 196 L131 194 C137 206 163 206 169 194 L178 196 C182 214 182 228 181 238 C186 256 186 270 186 284 L189 312 C170 322 130 322 111 312 L114 284 C114 270 114 256 119 238 C118 228 118 214 122 196 Z", "#FFFFFF",
          form("M164 198 C180 214 186 260 188 320 L200 320 L200 198 Z", "#E9E3F2")) +
        flaeche("M110 300 C130 308 170 308 190 300 L192 342 C180 348 166 348 157 346 L150 336 L143 346 C134 348 120 348 108 342 Z", "#FFFFFF", form("M150 304 L196 300 L196 350 L158 350 Z", "#E9E3F2"))
    };
  }

  // ---------- Kopf und Gesicht ----------
  function kopf(haut, g) {
    const s = dunkel(haut, 0.14), l = hell(haut, 0.32);
    const ohr = (x, sp) => flaeche(`M${x} 100 C${x - sp * 12} 98 ${x - sp * 14} 118 ${x - sp * 10} 128 C${x - sp * 6} 134 ${x} 132 ${x + sp * 2} 128 Z`, haut, form(`M${x - sp * 4} 106 C${x - sp * 9} 108 ${x - sp * 10} 120 ${x - sp * 6} 126 L${x} 126 Z`, s, 0.8));
    return ohr(95, 1) + ohr(205, -1) +
      flaeche(KOPF[g] || KOPF.n, haut, form("M170 44 C198 56 208 90 206 112 C202 142 188 162 168 174 L230 186 L230 40 Z", s, 0.6) + form("M110 72 C120 54 138 46 154 46 C134 54 122 66 116 82 Z", l, 0.65) +
        form("M128 168 C140 174 160 174 172 168 C162 178 138 178 128 168 Z", s, 0.7));
  }
  // Ausdrücke wie bisher: laecheln, lachen, zwinkern, staunen, verliebt, frech, cool (verträumt)
  function gesicht(g, ausdruck = "laecheln", haut = HAUT[1], iris = "#6B4A2E") {
    const t = dunkel(haut, 0.35);
    const auge = (x, gr = 1) => {
      const w = 10.5 * gr, h = 7.5 * gr, y = 114, aussen = x < 150 ? -1 : 1;
      return `<path d="M${x - w} ${y} C${x - w * 0.6} ${y - h * 1.35} ${x + w * 0.6} ${y - h * 1.35} ${x + w} ${y} C${x + w * 0.6} ${y + h * 1.05} ${x - w * 0.6} ${y + h * 1.05} ${x - w} ${y} Z" fill="#fff" stroke="${KF}" stroke-width="2" ${ns}/>` +
        `<circle cx="${x + aussen * -0.5}" cy="${y - 0.5}" r="${6 * gr}" fill="${iris}"/><circle cx="${x + aussen * -0.5}" cy="${y - 0.5}" r="${3.1 * gr}" fill="#1E1422"/>` +
        `<circle cx="${x - 2 * gr}" cy="${y - 2.8 * gr}" r="${1.8 * gr}" fill="#fff"/>` +
        strich(`M${x - w} ${y} C${x - w * 0.6} ${y - h * 1.35} ${x + w * 0.6} ${y - h * 1.35} ${x + w} ${y}`, KF, g === "w" ? 3.4 : 2.8) +
        (g === "w" ? strich(`M${x + aussen * w} ${y - 0.5} l${aussen * 4.5} -4 M${x + aussen * (w - 3.5)} ${y - h * 0.95} l${aussen * 3.5} -4.5`, KF, 2.2) : "");
    };
    const zu = (x, oben = true) => strich(`M${x - 10} 115 C${x - 5} ${oben ? 107 : 121} ${x + 5} ${oben ? 107 : 121} ${x + 10} 115`, KF, 3.6);
    const brauen = (hoch = 0) => g === "m" ? strich(`M116 ${98 - hoch} C122 ${95 - hoch} 132 ${94 - hoch} 140 ${96 - hoch} M160 ${96 - hoch} C168 ${94 - hoch} 178 ${95 - hoch} 184 ${98 - hoch}`, "#5C3A21", 4.2)
      : g === "w" ? strich(`M119 ${99 - hoch} C125 ${93 - hoch} 133 ${92 - hoch} 139 ${95 - hoch} M161 ${95 - hoch} C167 ${92 - hoch} 175 ${93 - hoch} 181 ${99 - hoch}`, "#5C3A21", 2.4)
      : strich(`M118 ${98 - hoch} C124 ${93 - hoch} 132 ${93 - hoch} 139 ${96 - hoch} M161 ${96 - hoch} C168 ${93 - hoch} 176 ${93 - hoch} 182 ${98 - hoch}`, "#5C3A21", 3.2);
    const nase = strich("M147 131 C149 135 153 135 155 131", t, 2.2) + `<ellipse cx="151" cy="127" rx="3" ry="2" fill="#fff" opacity=".35"/>`;
    const laecheln = strich("M137 146 C143 154 157 154 163 146", KF, 3.2);
    const herz = (x) => `<path d="M${x} 121 C${x - 12} 113 ${x - 11} 102 ${x - 5} 103 C${x - 2} 103 ${x} 106 ${x} 108 C${x} 106 ${x + 2} 103 ${x + 5} 103 C${x + 11} 102 ${x + 12} 113 ${x} 121 Z" fill="#E8336B" stroke="${KF}" stroke-width="2"/>`;
    const A = {
      laecheln: () => brauen() + auge(129) + auge(171) + laecheln,
      lachen: () => brauen(2) + zu(129) + zu(171) + `<path d="M135 144 C140 160 160 160 165 144 Z" fill="#A8324C" stroke="${KF}" stroke-width="2.6" stroke-linejoin="round"/><path d="M137 145 L163 145 L161 149 L139 149 Z" fill="#fff"/><path d="M143 155 C147 158 153 158 157 155" stroke="#F08AA0" stroke-width="4" fill="none" stroke-linecap="round"/>`,
      zwinkern: () => brauen() + auge(129) + zu(171) + strich("M137 147 C144 155 156 153 164 143", KF, 3.2),
      staunen: () => brauen(5) + auge(129, 1.12) + auge(171, 1.12) + `<ellipse cx="150" cy="150" rx="6" ry="8" fill="#A8324C" stroke="${KF}" stroke-width="2.6"/>`,
      verliebt: () => brauen(2) + herz(129) + herz(171) + laecheln,
      frech: () => brauen() + auge(129) + auge(171) + strich("M137 146 C143 154 157 154 163 146", KF, 3.2) + `<path d="M145 151 C146 160 154 160 155 151 Z" fill="#F08AA0" stroke="${KF}" stroke-width="2.2"/>`,
      cool: () => brauen() + strich("M119 116 C125 120 133 120 139 116 M161 116 C167 120 175 120 181 116", KF, 3.4) + strich("M119 116 l-4 -3 M181 116 l4 -3", KF, 2.2) + strich("M141 148 C146 151 154 151 159 148", KF, 3)
    };
    return (A[ausdruck] || A.laecheln)() + nase;
  }

  // ---------- Grundfrisuren (zum Zeigen; alle Frisuren kommen nach der Freigabe) ----------
  const HAARE = {
    // Mädchen: lange Haare mit Pony und Strähnen, fällt über die Schultern
    lang: (f) => ({
      hinten: flaeche("M96 86 C84 140 86 210 98 262 C118 274 182 274 202 262 C214 210 216 140 204 86 Z", dunkel(f, 0.15),
        form("M150 80 L150 280 L220 280 L220 80 Z", dunkel(f, 0.3)) + strich("M108 150 C104 190 106 226 112 258 M122 170 C120 206 122 236 126 262 M192 150 C196 190 194 226 188 258", dunkel(f, 0.45), 1.6, 0.6)),
      vorne: flaeche("M93 112 C86 56 120 30 152 30 C184 30 216 54 207 112 C204 96 196 84 186 74 C182 88 174 95 163 93 C161 84 158 79 154 76 C150 90 139 97 127 92 C124 86 122 82 120 79 C112 90 104 100 93 112 Z", f,
          form("M158 32 C190 38 212 62 207 112 C204 96 196 84 186 74 L176 32 Z", dunkel(f, 0.2)) + form("M114 52 C126 40 144 36 160 36 C140 44 128 54 120 68 Z", hell(f, 0.45), 0.8)) +
        flaeche("M95 104 C88 142 90 176 100 200 C108 184 108 148 104 112 Z", f, form("M99 150 C98 170 100 186 104 196 L108 196 L108 150 Z", dunkel(f, 0.2))) +
        flaeche("M205 104 C212 142 210 176 200 200 C192 184 192 148 196 112 Z", dunkel(f, 0.12)) +
        strich("M130 40 C122 56 120 72 124 88 M150 34 C146 50 148 66 154 80 M174 42 C180 52 184 62 184 72", dunkel(f, 0.35), 1.6, 0.7)
    }),
    // Junge: kurzer Seitenscheitel mit Volumen, Strähnen über der Stirn
    scheitel: (f) => ({
      hinten: flaeche("M98 104 C94 126 96 140 102 150 L110 150 L108 104 Z M202 104 C206 126 204 140 198 150 L190 150 L192 104 Z", dunkel(f, 0.15)),
      vorne: flaeche("M91 114 C84 60 116 28 152 28 C190 28 217 56 209 112 C207 100 204 92 199 86 L195 94 L189 79 L179 89 L173 73 L161 85 L154 70 L141 86 L133 74 L121 91 L113 81 L106 97 C101 102 96 108 91 114 Z", f,
          form("M162 30 C194 38 214 62 209 112 C207 100 204 92 199 86 L195 94 L189 79 L179 89 L173 73 L166 30 Z", dunkel(f, 0.22)) + form("M110 52 C122 40 140 34 156 34 C138 44 126 54 118 66 Z", hell(f, 0.45), 0.8)) +
        strich("M154 36 C152 48 152 58 154 70 M136 40 C132 52 132 64 133 74 M174 40 C176 52 175 62 173 73 M118 54 C116 64 116 74 121 91", dunkel(f, 0.38), 1.6, 0.7)
    }),
    // keine Angabe: kinnlanger Bob mit Seitenscheitel
    bob: (f) => ({
      hinten: flaeche("M94 90 C86 130 88 168 98 190 C120 196 180 196 202 190 C212 168 214 130 206 90 Z", dunkel(f, 0.15), form("M150 80 L150 200 L220 200 L220 80 Z", dunkel(f, 0.3))),
      vorne: flaeche("M93 116 C86 56 120 30 152 30 C186 30 216 56 207 116 C204 98 196 84 186 76 C172 84 150 88 128 86 C114 92 102 102 96 116 Z", f,
          form("M160 32 C192 40 212 64 207 116 C204 98 196 84 186 76 L178 32 Z", dunkel(f, 0.2)) + form("M114 52 C126 40 144 36 160 36 C140 44 128 54 120 68 Z", hell(f, 0.45), 0.8)) +
        flaeche("M95 110 C90 140 92 168 100 186 C106 170 106 140 104 114 Z", f) + flaeche("M205 110 C210 140 208 168 200 186 C194 170 194 140 196 114 Z", dunkel(f, 0.12)) +
        strich("M132 40 C124 54 120 70 122 86 M158 36 C164 48 170 60 174 72", dunkel(f, 0.35), 1.6, 0.7)
    })
  };

  function kind({ g = "n", haut = HAUT[1], haar = HAAR[2], frisur, ausdruck = "laecheln", waesche = true } = {}) {
    const k = koerperNeu(haut), h = HAARE[frisur || (g === "m" ? "scheitel" : g === "w" ? "lang" : "bob")](haar);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 560"><ellipse cx="150" cy="541" rx="70" ry="7" fill="#3B1F63" opacity=".13"/>` +
      h.hinten + k.koerper + (waesche ? k.waesche : "") + kopf(haut, g) + gesicht(g, ausdruck, haut) + h.vorne + `</svg>`;
  }
  W.Kind2 = { kind, HAUT, HAAR, AUSDRUECKE: ["laecheln", "lachen", "zwinkern", "staunen", "verliebt", "frech", "cool"] };
})(window);
