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
  const ARM_L = "M115 197 C100 206 94 234 93 262 C92 288 90 312 89 334 L114 337 C115 314 118 292 120 270 C122 250 126 228 130 208 Z";
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
      armL: flaeche(ARM_L, haut, form("M120 204 C114 236 113 286 112 340 L130 340 L130 204 Z", s) + form("M102 230 C99 260 98 290 98 320 L103 320 C103 290 104 260 107 230 Z", l, 0.5)) +
        strich("M103 268 C106 272 110 272 113 268", t, 1.4, 0.6) +   // Ellbogen
        flaeche(HAND_L, haut, form("M106 334 C113 348 115 362 108 376 L122 376 L122 334 Z", s)) +
        strich("M96 364 L96 374 M104 365 L104 376 M111 364 L111 373", t, 1.4) +
        flaeche("M114 338 C122 341 124 352 119 359 C116 361 114 358 115 354 Z", haut, form("M117 344 C121 348 121 354 118 358 L116 356 Z", s, 0.8)),   // Daumen
      armR: flaeche(ARM_R, haut, form("M202 232 C212 248 218 262 214 276 L226 276 L226 232 Z", s) + form("M176 214 C188 226 196 238 202 250 L206 248 C200 236 192 224 180 212 Z", l, 0.5)) +
        strich("M214 256 C218 258 220 262 220 266", t, 1.4, 0.6) +
        flaeche(HAND_R, haut, form("M175 302 C180 310 192 312 201 306 L201 318 L172 318 Z", s)) +
        strich("M185 291 C183 295 183 300 185 304 M191 290 C189 294 189 299 191 303 M197 293 C195 296 195 300 196 303", t, 1.3),
      hals: flaeche("M139 160 L139 190 C146 194 154 194 161 190 L161 160 Z", haut, form("M139 160 L161 160 L161 180 C154 186 146 186 139 180 Z", s))
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
    const k = koerper(haut), h = HAARE[frisur || (g === "m" ? "scheitel" : g === "w" ? "lang" : "bob")](haar);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 560"><ellipse cx="160" cy="540" rx="74" ry="8" fill="#3B1F63" opacity=".13"/>` +
      h.hinten + k.beine + k.rumpf + (waesche ? k.waesche : "") + k.armL + k.hals + k.armR + kopf(haut, g) + gesicht(g, ausdruck, haut) + h.vorne + `</svg>`;
  }
  W.Kind2 = { kind, HAUT, HAAR, AUSDRUECKE: ["laecheln", "lachen", "zwinkern", "staunen", "verliebt", "frech", "cool"] };
})(window);
