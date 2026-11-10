// Die Kinderfigur der Lerninsel (freigegeben am 03.11.2026, Wahl des Auftraggebers: „alle neu, eher Kinderbuch“; Entwurf: spiele/stil/entwurf/kind2.js).
// Kopf mit normalen Augen (weißes Auge, Iris, Pupille, Glanzpunkt), keine Wangen; Körper als EIN durchgehender Umriss (Hals, Schultern, Arme,
// Hände, Rumpf, Beine, Füße), Arme locker vom Körper weg, rechtes Bein Spielbein. Junge ("m"), Mädchen ("w"), keine Angabe ("n").
// Fläche + Schattenstufe + Lichtstufe, Kontur #3B1F63 obendrauf. Koordinaten 300 × 560, Boden y = 541, Kopfmitte (150, 108).
// window.KindFigur: Bausteine für die Kleidung (spiele/anziehen/teile2.js): UMRISS, POSE, gedreht, koerper, kopf, gesicht, Werkzeug.
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

  // Kopfform je Junge/Mädchen/keine Angabe
  const KOPF = {
    w: "M150 40 C182 40 207 62 207 98 C207 128 197 150 181 164 C171 173 160 178 150 178 C140 178 129 173 119 164 C103 150 93 128 93 98 C93 62 118 40 150 40 Z",
    n: "M150 40 C182 40 207 62 207 98 C207 127 198 148 184 162 C173 173 161 178 150 178 C139 178 127 173 116 162 C102 148 93 127 93 98 C93 62 118 40 150 40 Z",
    m: "M150 40 C182 40 207 62 207 98 C207 126 200 146 188 160 C177 172 163 178 150 178 C137 178 123 172 112 160 C100 146 93 126 93 98 C93 62 118 40 150 40 Z"
  };

  // ---------- Körper, Neufassung (03.11.2026, „Nur der Kopf ist gut. Fang bitte nochmal von vorne mit dem Körper an.“) ----------
  // Ein einziger Umriss für Hals, Schultern, Arme, Hände, Rumpf, Beine und Füße (wie im Kinderbuch) – nichts wirkt angesetzt.
  // Linke Hälfte als Bézier-Segmente [c1x, c1y, c2x, c2y, x, y]; die rechte Hälfte ist gespiegelt und rückwärts durchlaufen.
  const START = [139, 158];
  // 7. Feld = Teil: "arm" (dreht mit dem Arm), "achsel" (nur der erste Kontrollpunkt dreht), "bein", "schritt"
  const LINKS = [
    [139, 170, 139, 180, 139, 186],              // Hals
    [128, 190, 118, 191, 111, 196],              // Schulter
    [102, 201, 97, 211, 95, 226],                // runde Schulter (Deltamuskel)
    [92, 246, 90, 266, 88, 284, "arm"],          // Oberarm außen bis Ellbogen (leicht vom Körper weg)
    [86, 302, 84, 322, 83, 340, "arm"],          // Unterarm außen bis Handgelenk
    [82, 348, 81, 358, 81, 368, "arm"],          // Handkante (schmal, leicht gewölbt)
    [81, 378, 84, 386, 89, 389, "arm"],          // Finger rund geschlossen
    [93, 391, 98, 389, 100, 385, "arm"],
    [102, 380, 103, 370, 103, 360, "arm"],       // Zeigefinger-Seite hinauf
    [103, 354, 103, 350, 103, 348, "arm"],
    [104, 328, 105, 306, 107, 288, "arm"],       // Unterarm innen bis Ellbogen
    [109, 270, 113, 252, 119, 238, "achsel"],    // Oberarm innen bis Achsel
    [117, 254, 114, 270, 114, 284],              // Rumpf bis Taille
    [113, 296, 110, 304, 110, 316],              // Hüfte
    [107, 358, 108, 398, 112, 428, "bein"],      // Oberschenkel außen bis Knie
    [113, 444, 108, 462, 110, 486, "bein"],      // Wade
    [111, 498, 115, 506, 116, 512, "bein"],      // Knöchel
    [111, 518, 106, 524, 106, 531, "bein"],      // Fuß außen
    [106, 538, 110, 541, 116, 541, "bein"],
    [124, 541, 133, 541, 139, 540, "bein"],      // Sohle bis großer Zeh
    [145, 539, 147, 534, 146, 528, "bein"],
    [145, 522, 144, 518, 143, 515, "bein"],      // Fuß innen
    [142, 510, 141, 505, 141, 498, "bein"],      // Knöchel innen
    [143, 476, 142, 450, 143, 430, "bein"],      // Wade innen bis Knie
    [145, 398, 149, 364, 150, 340, "schritt"]    // Oberschenkel innen bis Schritt
  ];
  const spiegel = (x) => +(300 - x).toFixed(1);
  // Pose: Arme schwingen leicht vom Körper weg (rechts mehr), rechtes Bein ist Spielbein und steht etwas nach außen.
  // Drehung in Grad um einen Drehpunkt; betroffen sind die Segmente des Arms/Beins (Start- und Endpunkt am Rumpf bleiben fest).
  const POSE = { armL: { um: [96, 222], grad: 4 }, armR: { um: [204, 222], grad: -9 }, beinR: { um: [186, 330], grad: -3.5 } };
  const dreh = ([x, y], [px, py], grad) => { const w = grad * Math.PI / 180, c = Math.cos(w), sn = Math.sin(w); return [+(px + (x - px) * c - (y - py) * sn).toFixed(1), +(py + (x - px) * sn + (y - py) * c).toFixed(1)]; };
  function segmente(spiegeln) {
    let p0 = spiegeln ? [spiegel(START[0]), START[1]] : START;
    return LINKS.map(([a, b, c, e, x, y, teil]) => { const f = (q) => spiegeln ? [spiegel(q[0]), q[1]] : q; const sg = { p0, c1: f([a, b]), c2: f([c, e]), p: f([x, y]), teil }; p0 = sg.p; return sg; });
  }
  // dreht alle Abschnitte eines Teils; beim folgenden Abschnitt (Achsel/Schritt) nur den ersten Kontrollpunkt
  function bewege(sg, teil, ende, pose) {
    sg.forEach((s2, i) => {
      if (s2.teil === teil) {
        s2.c1 = dreh(s2.c1, pose.um, pose.grad); s2.c2 = dreh(s2.c2, pose.um, pose.grad); s2.p = dreh(s2.p, pose.um, pose.grad);
        if (i + 1 < sg.length) sg[i + 1].p0 = s2.p;
      } else if (s2.teil === ende) s2.c1 = dreh(s2.c1, pose.um, pose.grad);
    });
  }
  function umriss() {
    const L = segmente(false), R = segmente(true);
    bewege(L, "arm", "achsel", POSE.armL); bewege(R, "arm", "achsel", POSE.armR); bewege(R, "bein", "schritt", POSE.beinR);
    let d = `M${L[0].p0.join(" ")}`;
    L.forEach(q => { d += ` C${q.c1.join(" ")} ${q.c2.join(" ")} ${q.p.join(" ")}`; });
    for (let i = R.length - 1; i >= 0; i--) { const q = R[i]; d += ` C${q.c2.join(" ")} ${q.c1.join(" ")} ${q.p0.join(" ")}`; }
    return d + " Z";
  }
  const gedreht = (pose, inhalt) => `<g transform="rotate(${pose.grad} ${pose.um[0]} ${pose.um[1]})">${inhalt}</g>`;
  const UMRISS = umriss();
  // Teilformen für die Kleidung (03.11.2026): Rumpf, Arme, Beine einzeln – aus denselben posierten Abschnitten wie der Umriss.
  // Kleidung wird aus diesen Teilen gebaut (Ärmel mit Naht an der Schulter), so stören sich Arm und Rumpf in der Achsel nicht.
  const TEILE = (() => {
    const L = segmente(false), R = segmente(true);
    bewege(L, "arm", "achsel", POSE.armL); bewege(R, "arm", "achsel", POSE.armR); bewege(R, "bein", "schritt", POSE.beinR);
    const P = (q) => q.join(" "), vor = (q) => ` C${P(q.c1)} ${P(q.c2)} ${P(q.p)}`, rueck = (q) => ` C${P(q.c2)} ${P(q.c1)} ${P(q.p0)}`;
    const armloch = (S, rechts) => rechts ? ` C188 228 190 210 ${P(S[1].p)}` : ` C112 228 110 210 ${P(S[1].p)}`;
    const arm = (S, rechts) => `M${P(S[1].p)}` + S.slice(2, 12).map(vor).join("") + armloch(S, rechts) + " Z";
    const rumpf = `M${P(L[0].p)}${vor(L[1])} C110 210 112 228 ${P(L[11].p)}${vor(L[12])}${vor(L[13])} L110 352 L190 352 L${P(R[13].p)}${rueck(R[13])}${rueck(R[12])} C188 228 190 210 ${P(R[1].p)}${rueck(R[1])} Z`;
    const beine = `M${P(L[12].p)}` + L.slice(13, 25).map(vor).join("") + R.slice(13, 25).reverse().map(rueck).join("") + " Z";
    return { rumpf, armL: arm(L, false), armR: arm(R, true), beine };
  })();
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
      gedreht(POSE.armL, strich("M87 388 C87 384 88 380 89 377 M94 390 C94 386 94 382 95 378", t, 1.3, 0.4) + strich("M82 370 C87 373 95 374 102 371", t, 1.1, 0.2) +   // (Figuren 4) ohne Ellbogenlinie, Fingerlinien zarter
        flaeche("M99 350 C98 358 98 364 99 370 C100 374 104 374 105 369 C107 362 106 355 103 349 Z", haut, form("M104 356 C106 361 106 366 104 370 L108 370 L108 356 Z", s, 0.9), { kontur: false }) +
        strich("M99 354 C98 360 98 365 99 370 C100 374 104 374 105 369 C106 364 106 359 105 355", KF, 2.4)) +   // Daumen wächst ohne Kante aus der Hand
      gedreht(POSE.armR, strich("M213 388 C213 384 212 380 211 377 M206 390 C206 386 206 382 205 378", t, 1.3, 0.4) + strich("M218 370 C213 373 205 374 198 371", t, 1.1, 0.2) +
        flaeche("M201 350 C202 358 202 364 201 370 C200 374 196 374 195 369 C193 362 194 355 197 349 Z", haut, form("M196 356 C194 361 194 366 196 370 L192 370 L192 356 Z", s, 0.9), { kontur: false }) +
        strich("M201 354 C202 360 202 365 201 370 C200 374 196 374 195 369 C194 364 194 359 195 355", KF, 2.4)) +
      gedreht(POSE.beinR, strich("M188 536 l0 4 M180 537 l0 4 M172 537 l0 3", t, 1.3, 0.4)) +   // (Figuren 4) keine Knie- und Schrittlinie mehr, Zehen zarter
      strich("M112 536 l0 4 M120 537 l0 4 M128 537 l0 3", t, 1.3, 0.4);
    // Arme noch einmal als eigene Hautteile (liegen vor Hose und Rock): mit Schatten und den Hand-Linien
    const armHaut = (rechts) => flaeche(rechts ? TEILE.armR : TEILE.armL, haut,
      rechts ? gedreht(POSE.armR, form("M192 200 C202 208 206 224 208 250 C210 300 214 340 218 392 L240 392 L240 200 Z", s)) : form("M106 200 C99 214 96 240 94 270 L99 270 C100 240 103 216 110 202 Z", l, 0.6));
    const handLinien = (rechts) => linien.split("<g transform=")[rechts ? 2 : 1] ? "<g transform=" + linien.split("<g transform=")[rechts ? 2 : 1].replace(/\)\s*\+?\s*$/, "") : "";
    return {
      arme: armHaut(false) + armHaut(true) + gedreht(POSE.armL, strich("M87 388 C87 384 88 380 89 377 M94 390 C94 386 94 382 95 378", t, 1.3, 0.4) +
          flaeche("M99 350 C98 358 98 364 99 370 C100 374 104 374 105 369 C107 362 106 355 103 349 Z", haut, form("M104 356 C106 361 106 366 104 370 L108 370 L108 356 Z", s, 0.9), { kontur: false }) +
          strich("M99 354 C98 360 98 365 99 370 C100 374 104 374 105 369 C106 364 106 359 105 355", KF, 2.4)) +
        gedreht(POSE.armR, strich("M213 388 C213 384 212 380 211 377 M206 390 C206 386 206 382 205 378", t, 1.3, 0.4) +
          flaeche("M201 350 C202 358 202 364 201 370 C200 374 196 374 195 369 C193 362 194 355 197 349 Z", haut, form("M196 356 C194 361 194 366 196 370 L192 370 L192 356 Z", s, 0.9), { kontur: false }) +
          strich("M201 354 C202 360 202 365 201 370 C200 374 196 374 195 369 C194 364 194 359 195 355", KF, 2.4)),
      koerper: flaeche(UMRISS, haut, innen) + linien,
      hemd: flaeche("M122 196 L131 194 C137 206 163 206 169 194 L178 196 C182 214 182 228 181 238 C186 256 186 270 186 284 L189 312 C170 322 130 322 111 312 L114 284 C114 270 114 256 119 238 C118 228 118 214 122 196 Z", "#FFFFFF", form("M164 198 C180 214 186 260 188 320 L200 320 L200 198 Z", "#E9E3F2")),
      hose: flaeche("M110 300 C130 308 170 308 190 300 L192 342 C180 348 166 348 157 346 L150 336 L143 346 C134 348 120 348 108 342 Z", "#FFFFFF", form("M150 304 L196 300 L196 350 L158 350 Z", "#E9E3F2")),
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
        // (Erprobung 10.11.2026) keine spitzen Strähnen vor den Wangen mehr – sie sahen aus wie Koteletten; das Haar fällt hinter den Ohren herab
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
        // (Erprobung 10.11.2026) wie bei „lang“: keine Strähnen vor den Wangen
        strich("M132 40 C124 54 120 70 122 86 M158 36 C164 48 170 60 174 72", dunkel(f, 0.35), 1.6, 0.7)
    })
  };

  function kind({ g = "n", haut = HAUT[1], haar = HAAR[2], frisur, ausdruck = "laecheln", waesche = true } = {}) {
    const k = koerperNeu(haut), h = HAARE[frisur || (g === "m" ? "scheitel" : g === "w" ? "lang" : "bob")](haar);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 560"><ellipse cx="150" cy="541" rx="70" ry="7" fill="#3B1F63" opacity=".13"/>` +
      h.hinten + k.koerper + (waesche ? k.waesche : "") + kopf(haut, g) + gesicht(g, ausdruck, haut) + h.vorne + `</svg>`;
  }
  W.KindFigur = { kind, HAUT, HAAR, AUSDRUECKE: ["laecheln", "lachen", "zwinkern", "staunen", "verliebt", "frech", "cool"],
    UMRISS, TEILE, POSE, gedreht, koerper: koerperNeu, kopf, gesicht, HAARE, KOPF, werkzeug: { KF, KW, ns, flaeche, form, strich, dunkel, hell, mische } };
})(window);
