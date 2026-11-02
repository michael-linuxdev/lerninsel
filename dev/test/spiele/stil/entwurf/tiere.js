// Entwurf 03.11.2026: Mein Tier in 2D „wie ein gutes Kinderbuch“ (Rückmeldung des Auftraggebers vom 02.11.2026).
// Dreiviertelansicht (nach links schauend), sitzend; jede Fläche mit Grundton, Schattenstufe und Lichtstufe (zugeschnitten auf die Fläche),
// die Kontur liegt obendrauf. Stil "a" = dunkle Kontur #3B1F63 (Stil A der App), Stil "b" = feine Kontur im Fellton.
// Stufen 0 (Baby: großer Kopf, kurze Beine, große Pfoten, kurze Schnauze) – 1 (Kind) – 2 (erwachsen, schlank, lange Beine).
// Koordinaten 300 × 300, Boden bei y = 268. Nur Vorschau (spiele/stil/entwurf.html) – noch nicht in der App.
(function (W) {
  let nr = 0;
  const FARBEN = {
    hund: [{ name: "Goldbraun", h: "#DDA75F", s: "#B87B38", t: "#96602A", l: "#F7E4C2", d: "#8A552A", o: "#6B4220", nase: "#2C2230" },
      { name: "Schwarz-weiß", h: "#3C3646", s: "#28232F", t: "#1B1820", l: "#F6F2EA", d: "#25212B", o: "#141118", nase: "#141118", blesse: true },
      { name: "Hellbraun gefleckt", h: "#F2E6D4", s: "#D9C6AA", t: "#BFA786", l: "#FFFBF4", d: "#9A6538", o: "#6E4A2C", nase: "#3A2A26", flecken: "#A86E3E" }],
    katze: [{ name: "Grau getigert", h: "#A9AFBD", s: "#878D9C", t: "#6B7080", l: "#F1F2F6", d: "#5A5F6E", o: "#454A57", nase: "#E58A9A", streifen: "#626877", iris: "#9CC64A" },
      { name: "Rot getigert", h: "#F0A35A", s: "#D27F36", t: "#B0632A", l: "#FFF1DF", d: "#A9561F", o: "#7E4019", nase: "#E58A8A", streifen: "#C2672A", iris: "#E2B53A" },
      { name: "Creme", h: "#F3E2C6", s: "#DCC49F", t: "#C4A87F", l: "#FFFBF3", d: "#B8956A", o: "#8A6D4A", nase: "#E9A0A8", iris: "#6AA8D8" }],
    drache: [{ name: "Grün", h: "#78CF5A", s: "#55A93E", t: "#3E8A2D", l: "#E6F7C9", d: "#2F7A33", o: "#235C27", bauch: "#F4E7A6", fl: "#9FE07E", iris: "#F2B630" },
      { name: "Lila", h: "#AE86EC", s: "#8C64D2", t: "#6E48B6", l: "#F0E6FF", d: "#5A35A0", o: "#45277E", bauch: "#FFE3B0", fl: "#D2B8FA", iris: "#F2B630" },
      { name: "Blau", h: "#62B9EE", s: "#3F95D2", t: "#2C76B2", l: "#DFF3FF", d: "#22609A", o: "#184A78", bauch: "#FFEBB5", fl: "#A9DBFA", iris: "#F28A30" }]
  };

  // ---------- Werkzeug ----------
  function werkzeug(stil, f) {
    const KF = stil === "a" ? "#3B1F63" : f.o, KW = stil === "a" ? 3.4 : 2;
    const id = () => "te" + (++nr);
    const ns = 'vector-effect="non-scaling-stroke"';
    // Fläche: Grundton, darin zugeschnitten Schatten-/Lichtformen, Kontur obendrauf
    const flaeche = (d, fill, innen = "", { kontur = true, kw = KW } = {}) => {
      if (!innen) return `<path d="${d}" fill="${fill}" ${kontur ? `stroke="${KF}" stroke-width="${kw}" stroke-linejoin="round" ${ns}` : ""}/>`;
      const c = id();
      return `<clipPath id="${c}"><path d="${d}"/></clipPath><path d="${d}" fill="${fill}"/><g clip-path="url(#${c})">${innen}</g>` +
        (kontur ? `<path d="${d}" fill="none" stroke="${KF}" stroke-width="${kw}" stroke-linejoin="round" ${ns}/>` : "");
    };
    const form = (d, fill, op = 1) => `<path d="${d}" fill="${fill}"${op < 1 ? ` opacity="${op}"` : ""}/>`;
    const strich = (d, farbe = KF, w = KW, op = 1) => `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${ns}${op < 1 ? ` opacity="${op}"` : ""}/>`;
    // Auge in Dreiviertelansicht: dunkel, mit Iris (optional), Lichtpunkt; breite < 1 = hinteres Auge (schmaler)
    const auge = (x, y, r, { iris, schlitz, breite = 1, lid = true } = {}) => {
      const rx = r * breite;
      let s = `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${r}" fill="${iris || "#2A1E2E"}" stroke="${KF}" stroke-width="${KW * 0.7}" ${ns}/>`;
      if (iris) s += schlitz ? `<ellipse cx="${x}" cy="${y}" rx="${r * 0.22 * breite}" ry="${r * 0.8}" fill="#1B1420"/>` : `<circle cx="${x}" cy="${y}" r="${r * 0.55}" fill="#1B1420"/>`;
      s += `<circle cx="${x - rx * 0.32}" cy="${y - r * 0.38}" r="${r * 0.3}" fill="#fff"/><circle cx="${x + rx * 0.3}" cy="${y + r * 0.35}" r="${r * 0.12}" fill="#fff" opacity=".8"/>`;
      if (lid) s += strich(`M${x - rx * 1.1} ${y - r * 0.75} Q${x} ${y - r * 1.35} ${x + rx * 1.1} ${y - r * 0.8}`, KF, KW * 0.8);
      return s;
    };
    return { KF, KW, id, flaeche, form, strich, auge, ns };
  }
  const um = (x, y, sx, sy = sx, inhalt) => `<g transform="translate(${x} ${y}) scale(${sx} ${sy})">${inhalt}</g>`;
  const schatten = (rx) => `<ellipse cx="150" cy="270" rx="${rx}" ry="9" fill="#3B1F63" opacity=".13"/>`;

  // =====================================================================================================
  // Hund: sitzend, Dreiviertelansicht nach links, Schlappohren
  // =====================================================================================================
  function hund(st, stil, f) {
    const T = werkzeug(stil, f), { flaeche, form, strich, auge } = T;
    // Stufen: Kopf, Beinlänge, Pfoten, Schnauze, Rumpf
    const S = [{ kopf: 1.32, rumpf: 0.74, breit: 1.04, pfote: 1.3, schnauze: 0.62, kx: 138, ky: 150, ohr: 1.05 },
      { kopf: 1.12, rumpf: 0.88, breit: 1.0, pfote: 1.12, schnauze: 0.82, kx: 136, ky: 118, ohr: 1.05 },
      { kopf: 1.0, rumpf: 1.0, breit: 0.96, pfote: 1.0, schnauze: 1.0, kx: 134, ky: 96, ohr: 1.0 }][st];
    const fleck = (d) => (f.flecken ? form(d, f.flecken) : "");
    // ---- Rumpf (Ursprung: Boden-Mitte 160/268, nach oben negativ) ----
    const RUMPF = "M-40 -138 C-62 -122 -70 -86 -60 -52 C-54 -30 -50 -14 -48 0 L24 0 C44 -30 52 -70 42 -104 C34 -132 14 -152 -10 -154 C-24 -154 -34 -148 -40 -138 Z";
    const KEULE = "M-12 0 C-22 -48 4 -96 44 -94 C84 -92 96 -38 80 0 Z";
    const SCHWANZ = "M64 -4 C92 -2 112 -14 114 -40 C115 -50 106 -52 103 -44 C100 -26 88 -18 62 -18 Z";
    const rumpf =
      flaeche(SCHWANZ, f.h, form("M66 -12 C90 -10 106 -18 110 -32 L118 -30 L116 0 L60 0 Z", f.s) + (f.blesse ? form("M100 -44 C104 -50 112 -50 114 -44 L114 -36 L102 -36 Z", f.l) : "")) +
      // hinteres Vorderbein (dunkler)
      flaeche("M-40 -70 C-44 -40 -44 -18 -42 -6 L-24 -6 C-24 -24 -22 -48 -18 -70 Z", f.s, form("M-30 -70 L-18 -70 L-24 -6 L-30 -6 Z", f.t, 0.5)) +
      flaeche(KEULE, f.h, form("M20 0 C30 -26 56 -40 82 -36 L90 0 Z", f.s) + form("M4 -50 C14 -70 34 -78 52 -76 C36 -70 22 -60 14 -44 Z", f.l, 0.55) + fleck("M30 -66 C44 -72 60 -66 62 -54 C58 -44 40 -44 32 -52 Z")) +
      strich("M8 -36 C16 -46 26 -50 36 -50", T.KF, T.KW * 0.6, 0.5) +
      flaeche(RUMPF, f.h,
        form("M10 -150 C40 -130 46 -80 30 -40 L18 0 L60 0 L60 -160 Z", f.s) +          // Schattenseite hinten
        form("M-58 -126 C-70 -100 -66 -62 -50 -34 C-42 -56 -34 -96 -22 -140 C-36 -140 -50 -134 -58 -126 Z", f.l) +   // helle Brust (Latz)
        fleck("M0 -120 C14 -126 28 -116 26 -100 C20 -90 4 -92 0 -104 Z") +
        form("M-14 -150 C-2 -128 -2 -110 -8 -96 C-20 -110 -24 -132 -14 -150 Z", f.s, 0.55)) +   // Schatten unter dem Kopf
      // Fellbüschel an der Brust
      strich("M-44 -112 C-46 -96 -46 -84 -44 -74 M-36 -120 C-38 -104 -38 -92 -36 -84", f.t, 1.6, 0.4) +
      // Hinterpfote
      flaeche("M30 -2 C30 -14 48 -18 66 -14 C78 -10 80 0 72 2 L34 2 C30 2 30 0 30 -2 Z", f.blesse ? f.l : f.h, form("M30 -4 L82 -4 L82 4 L30 4 Z", f.blesse ? "#DDD6CB" : f.s, 0.6)) +
      strich("M52 -12 l0 10 M62 -12 l0 10", T.KF, T.KW * 0.6);
    // vorderes Vorderbein mit Pfote (Länge hängt am Rumpf, Pfotengröße an der Stufe)
    // Vorderbein: oben offen (geht ins Brustfell über), leicht nach vorn gestellt, Ellbogen-Schatten
    const bein = (x, farbe) =>
      flaeche(`M${x - 12} -112 C${x - 18} -80 ${x - 16} -40 ${x - 12} -8 L${x + 11} -8 C${x + 12} -40 ${x + 16} -76 ${x + 16} -112 Z`, farbe,
        form(`M${x + 4} -112 L${x + 18} -112 L${x + 12} -6 L${x + 5} -6 C${x + 6} -40 ${x + 8} -80 ${x + 4} -112 Z`, f.s, 0.75) +
        form(`M${x - 13} -60 C${x - 14} -40 ${x - 13} -24 ${x - 11} -8 L${x - 6} -8 C${x - 8} -26 ${x - 8} -44 ${x - 7} -60 Z`, f.l, 0.5), { kontur: false }) +
      strich(`M${x - 16} -80 C${x - 16} -50 ${x - 14} -28 ${x - 12} -8 M${x + 13} -84 C${x + 13} -50 ${x + 12} -30 ${x + 11} -8`) +
      strich(`M${x + 6} -70 C${x + 8} -60 ${x + 8} -52 ${x + 6} -46`, f.t, 1.5, 0.5);
    const pfote = (x, farbe) => um(x, -4, S.pfote, S.pfote,
      flaeche("M-16 4 C-18 -6 -10 -12 0 -12 C12 -12 18 -6 16 4 Z", farbe, form("M-18 -1 L18 -1 L18 6 L-18 6 Z", f.blesse ? "#DDD6CB" : f.s, 0.7)) +
      strich("M-5 -6 l0 8 M5 -6 l0 8", T.KF, T.KW * 0.6));
    const vorne = bein(-36, f.blesse ? f.l : f.h) + pfote(-36, f.blesse ? f.l : f.h);
    const koerper = um(160, 268, S.breit, S.rumpf, rumpf + vorne);
    const hinterePfote = um(160 - 22 * S.breit, 268, 1, 1, pfote(0, f.s));

    // ---- Kopf (Ursprung Kopfmitte) ----
    const OHR_HINTEN = "M-30 -30 C-48 -34 -60 -14 -58 12 C-56 30 -48 40 -40 36 C-34 24 -30 0 -24 -20 Z";
    const SCHAEDEL = "M-40 -4 C-44 -36 -20 -56 8 -56 C36 -56 54 -36 52 -8 C50 18 36 38 12 42 C-6 44 -24 38 -32 26 Z";
    const SCHNAUZE = "M-24 2 C-44 -2 -64 4 -68 18 C-71 30 -60 40 -42 42 C-26 44 -10 38 -8 26 C-6 14 -12 4 -24 2 Z";
    const OHR = "M18 -50 C40 -60 62 -44 64 -14 C66 12 60 34 48 40 C40 44 34 36 34 24 C34 4 26 -20 14 -36 Z";
    const schnauze = um(-12, 6, S.schnauze, 1, um(12, -6, 1, 1,
      flaeche(SCHNAUZE, f.blesse ? f.l : f.l, form("M-60 30 C-50 40 -30 44 -12 36 L-10 46 L-64 46 Z", f.blesse ? "#DDD6CB" : f.h, 0.55) + form("M-60 8 C-50 2 -36 0 -28 4 C-40 6 -52 10 -60 16 Z", "#fff", 0.5)) +
      // Nase und Mund
      `<path d="M-72 10 C-74 2 -62 -2 -56 2 C-52 6 -54 14 -60 18 C-64 20 -70 16 -72 10 Z" fill="${f.nase}" stroke="${T.KF}" stroke-width="${T.KW * 0.6}" ${T.ns}/>` +
      `<ellipse cx="-65" cy="4" rx="4" ry="2.4" fill="#fff" opacity=".7"/>` +
      strich("M-60 19 C-60 26 -56 30 -50 31 M-50 31 C-44 32 -38 30 -34 26", T.KF, T.KW * 0.75) +
      (st === 0 ? `<path d="M-50 31 C-50 40 -42 42 -40 33" fill="#E8798A" stroke="${T.KF}" stroke-width="${T.KW * 0.6}" ${T.ns}/>` : "") +
      `<circle cx="-46" cy="18" r="1.4" fill="${T.KF}" opacity=".5"/><circle cx="-40" cy="22" r="1.4" fill="${T.KF}" opacity=".5"/><circle cx="-38" cy="15" r="1.4" fill="${T.KF}" opacity=".5"/>`));
    const kopf =
      flaeche(OHR_HINTEN, f.d, form("M-50 0 C-52 20 -48 32 -42 34 L-36 30 C-40 10 -36 -10 -30 -26 Z", f.t, 0.6)) +
      flaeche(SCHAEDEL, f.h,
        form("M14 -56 C40 -52 56 -30 52 0 C48 28 30 42 8 44 L60 60 L60 -60 Z", f.s) +
        form("M-30 -30 C-20 -48 0 -54 14 -52 C-4 -46 -18 -36 -24 -20 Z", f.l, 0.6) +
        (f.blesse ? form("M-6 -56 C-10 -44 -14 -30 -14 -18 C-14 -8 -10 0 -6 6 L-40 6 C-34 0 -26 -6 -22 -16 C-20 -32 -14 -46 -6 -56 Z", f.l) : "") +
        (f.flecken ? form("M-26 -40 C-14 -50 0 -46 0 -34 C-4 -24 -18 -24 -26 -30 Z", f.flecken) : "") +
        form("M-24 30 C-10 40 10 42 24 36 C14 46 -12 48 -24 40 Z", f.s, 0.6)) +
      // Stirnfell
      strich("M-2 -50 C2 -44 2 -38 0 -32 M8 -52 C12 -46 12 -40 10 -36", f.t, 1.6, 0.5) +
      // Augen: hinteres (links, schmaler) und vorderes; Brauen-Flecken
      auge(-34, -10, 6.2 * (st === 0 ? 1.12 : 1), { breite: 0.72 }) + auge(-2, -12, 7.6 * (st === 0 ? 1.12 : 1)) +
      form("M-40 -24 C-36 -28 -30 -28 -28 -24 C-32 -23 -36 -23 -40 -24 Z", f.l, 0.85) + form("M-10 -28 C-4 -32 4 -32 8 -27 C2 -26 -4 -26 -10 -28 Z", f.l, 0.85) +
      schnauze +
      flaeche(OHR, f.d, form("M40 -40 C56 -30 60 -6 58 18 C56 30 52 36 48 38 C50 10 48 -16 36 -38 Z", f.t, 0.6) + form("M22 -46 C30 -46 36 -40 38 -30 C30 -32 24 -38 22 -46 Z", f.h, 0.4)) +
      strich("M30 -24 C36 -6 38 10 38 24", f.t, 1.6, 0.5);
    const kopfY = 268 - (268 - S.ky) ;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">${schatten(st === 0 ? 70 : 84)}${hinterePfote}${koerper}${um(S.kx, kopfY, S.kopf, S.kopf, kopf)}</svg>`;
  }

  // =====================================================================================================
  // Katze: sitzend, Dreiviertelansicht nach links, Schwanz um die Pfoten (Kätzchen: Schwanz hoch)
  // =====================================================================================================
  function katze(st, stil, f) {
    const T = werkzeug(stil, f), { flaeche, form, strich, auge } = T;
    const S = [{ kopf: 1.3, rumpf: 0.72, breit: 1.06, pfote: 1.25, kx: 140, ky: 156, ohr: 1.18 },
      { kopf: 1.1, rumpf: 0.88, breit: 1.0, pfote: 1.1, kx: 138, ky: 122, ohr: 1.06 },
      { kopf: 1.0, rumpf: 1.0, breit: 0.94, pfote: 1.0, kx: 136, ky: 100, ohr: 1.0 }][st];
    const str = (d, w = 4) => (f.streifen ? strich(d, f.streifen, w, 0.85) : "");
    // ---- Rumpf: schlanke Brust, große runde Keule (Birnenform) ----
    const RUMPF = "M-34 -136 C-54 -120 -60 -84 -54 -50 C-50 -28 -46 -12 -44 0 L30 0 C50 -24 60 -60 50 -96 C42 -124 20 -146 -4 -148 C-18 -148 -28 -144 -34 -136 Z";
    const KEULE = "M-14 0 C-26 -50 2 -100 46 -98 C88 -94 98 -38 82 0 Z";
    const SCHWANZ_UM = "M76 -16 C98 -12 102 6 84 10 C50 16 -10 14 -42 8 C-58 5 -68 -6 -62 -18 C-58 -24 -50 -20 -52 -12 C-46 -4 -20 -4 0 -4 C30 -4 56 -8 76 -16 Z";
    const SCHWANZ_HOCH = "M70 -30 C96 -40 104 -80 92 -112 C88 -122 78 -120 80 -110 C90 -82 84 -54 66 -46 Z";
    const schwanz = st === 0
      ? flaeche(SCHWANZ_HOCH, f.h, form("M80 -40 C96 -56 100 -84 94 -110 L104 -110 L104 -30 Z", f.s) + str("M84 -64 l14 -4 M88 -84 l12 -2 M86 -102 l10 0", 5))
      : "";
    const schwanzVorn = st === 0 ? "" :
      flaeche(SCHWANZ_UM, f.h, form("M-60 2 C-30 10 40 10 96 0 L100 24 L-64 24 Z", f.s) + str("M-28 -4 l-2 14 M2 -4 l-2 14 M32 -6 l-2 14 M60 -12 l-2 14", 5) + form("M-70 -20 L-50 -20 L-50 -6 L-70 -6 Z", f.streifen ? f.d : f.s, f.streifen ? 0.8 : 0.5));
    const rumpf =
      schwanz +
      flaeche("M-30 -70 C-34 -40 -34 -18 -32 -6 L-16 -6 C-16 -24 -14 -48 -10 -70 Z", f.s, form("M-22 -70 L-10 -70 L-16 -6 L-22 -6 Z", f.t, 0.5)) +
      flaeche(KEULE, f.h, form("M18 0 C28 -30 56 -44 86 -40 L94 0 Z", f.s) + form("M0 -54 C10 -76 30 -86 50 -86 C34 -78 20 -66 12 -48 Z", f.l, 0.55) + str("M30 -90 C26 -78 26 -68 30 -60 M50 -92 C46 -78 46 -66 50 -56 M70 -84 C64 -70 64 -56 68 -46", 4.5)) +
      flaeche(RUMPF, f.h,
        form("M14 -148 C44 -126 54 -80 40 -36 L30 0 L70 0 L70 -160 Z", f.s) +
        form("M-50 -116 C-60 -92 -58 -60 -46 -30 C-38 -52 -30 -96 -18 -138 C-32 -136 -44 -128 -50 -116 Z", f.l) +
        str("M4 -140 C10 -126 12 -112 10 -100 M20 -132 C28 -118 30 -104 28 -92 M-10 -142 C-8 -132 -8 -124 -10 -116", 4.5) +
        form("M-10 -148 C0 -128 0 -112 -6 -98 C-18 -112 -22 -132 -10 -148 Z", f.s, 0.5));
    const bein = (x, farbe) =>
      flaeche(`M${x - 10} -110 C${x - 14} -80 ${x - 13} -40 ${x - 10} -8 L${x + 9} -8 C${x + 10} -40 ${x + 13} -76 ${x + 13} -110 Z`, farbe,
        form(`M${x + 3} -110 L${x + 15} -110 L${x + 10} -6 L${x + 4} -6 C${x + 5} -40 ${x + 7} -80 ${x + 3} -110 Z`, f.s, 0.7) + str(`M${x - 12} -64 l14 -2 M${x - 12} -46 l14 -2`, 3.5), { kontur: false }) +
      strich(`M${x - 13} -78 C${x - 13} -50 ${x - 12} -28 ${x - 10} -8 M${x + 11} -80 C${x + 11} -50 ${x + 10} -30 ${x + 9} -8`);
    const pfote = (x, farbe) => um(x, -4, S.pfote, S.pfote,
      flaeche("M-13 4 C-15 -6 -8 -11 0 -11 C10 -11 15 -6 13 4 Z", farbe, form("M-15 -1 L15 -1 L15 6 L-15 6 Z", f.s, 0.6)) + strich("M-4 -5 l0 7 M4 -5 l0 7", T.KF, T.KW * 0.55));
    const vorne = bein(-30, f.l) + pfote(-30, f.l);
    const koerper = um(160, 268, S.breit, S.rumpf, rumpf + vorne);
    const hinterePfote = um(160 - 16 * S.breit, 268, 1, 1, pfote(0, f.s));
    const vornSchwanz = um(160, 268, S.breit, 1, schwanzVorn);
    // ---- Kopf: rund, breite Wangen, spitze Ohren (Größe je Stufe), kleine Schnauze ----
    const SCHAEDEL = "M-44 0 C-48 -30 -24 -48 4 -48 C34 -48 54 -30 52 -2 C56 10 52 22 44 28 C32 40 14 44 -2 44 C-20 44 -36 38 -44 28 C-52 20 -50 8 -44 0 Z";
    const ohr = (gross) => um(0, 0, gross, gross, "");
    const OHR_HINTEN = "M-40 -18 C-46 -40 -44 -60 -36 -72 C-24 -62 -14 -50 -10 -40 Z";
    const OHR_VORN = "M8 -46 C20 -64 36 -76 50 -80 C54 -62 52 -40 46 -24 Z";
    const kopf =
      um(-24, -30, S.ohr, S.ohr, um(24, 30, 1, 1, flaeche(OHR_HINTEN, f.h, form("M-38 -26 C-42 -44 -40 -58 -36 -66 C-28 -56 -22 -48 -18 -40 Z", "#F2A7B5", 0.85) + form("M-44 -30 L-34 -70 L-30 -70 L-40 -24 Z", f.s, 0.7)))) +
      um(28, -36, S.ohr, S.ohr, um(-28, 36, 1, 1, flaeche(OHR_VORN, f.h, form("M16 -44 C26 -58 38 -68 46 -72 C48 -58 46 -42 42 -30 Z", "#F2A7B5", 0.85) + form("M44 -80 L54 -80 L50 -20 L42 -24 Z", f.s)) +
        strich("M24 -48 l6 2 M28 -56 l5 3 M34 -60 l3 4", "#fff", 1.4, 0.8))) +
      flaeche(SCHAEDEL, f.h,
        form("M18 -48 C44 -42 58 -20 52 6 C50 22 40 34 24 40 L64 50 L64 -60 Z", f.s) +
        form("M-50 10 C-44 30 -22 44 0 44 C16 44 30 40 40 32 C30 34 14 34 2 30 C-14 26 -30 22 -50 10 Z", f.l) +
        form("M-30 -30 C-20 -42 -4 -46 10 -44 C-6 -38 -16 -30 -22 -20 Z", f.l, 0.55) +
        str("M-18 -46 C-14 -38 -14 -32 -16 -26 M-6 -48 C-4 -38 -4 -30 -6 -24 M6 -48 C6 -40 6 -32 4 -26", 4) + str("M34 -8 l14 -4 M36 6 l14 0", 4)) +
      // Wangenfell (Büschel)
      auge(-30, -6, 6.4, { iris: f.iris, schlitz: true, breite: 0.72 }) + auge(2, -8, 7.8, { iris: f.iris, schlitz: true }) +
      // Schnauze: Schnurrhaarpolster, Nase, Mund
      form("M-36 12 C-30 4 -16 4 -12 12 C-10 22 -18 28 -26 28 C-34 28 -40 22 -36 12 Z", f.l) +
      `<path d="M-28 6 C-30 2 -20 0 -18 4 C-18 8 -22 12 -24 12 C-26 12 -28 10 -28 6 Z" fill="${f.nase}" stroke="${T.KF}" stroke-width="${T.KW * 0.55}" ${T.ns}/>` +
      strich("M-23 12 l0 5 M-23 17 C-26 21 -30 21 -32 18 M-23 17 C-20 21 -16 21 -14 18", T.KF, T.KW * 0.65) +
      strich("M-34 14 L-62 8 M-34 18 L-60 20 M-12 14 L18 10 M-12 18 L16 22", T.KF, 1.1, 0.55) +
      `<circle cx="-30" cy="14" r="1.1" fill="${T.KF}" opacity=".5"/><circle cx="-17" cy="14" r="1.1" fill="${T.KF}" opacity=".5"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">${schatten(st === 0 ? 68 : 82)}${hinterePfote}${koerper}${um(S.kx, S.ky, S.kopf, S.kopf, kopf)}${vornSchwanz}</svg>`;
  }

  // =====================================================================================================
  // Drache: Schlüpfling in der Eierschale – Jungdrache (kleine Flügel und Hörner) – großer Drache (langer Hals, große Flügel, Zacken)
  // =====================================================================================================
  function drache(st, stil, f) {
    const T = werkzeug(stil, f), { flaeche, form, strich, auge } = T;
    const S = [{ kopf: 1.28, rumpf: 0.62, breit: 1.0, kx: 146, ky: 132, fl: 0.45, horn: 0.5 },
      { kopf: 1.1, rumpf: 0.86, breit: 1.0, kx: 138, ky: 118, fl: 0.72, horn: 0.8 },
      { kopf: 0.96, rumpf: 0.96, breit: 0.96, kx: 116, ky: 86, fl: 0.92, horn: 1.0 }][st];
    // Flügel (hinter dem Körper): Knochen in Grundfarbe, Haut hell, Schattenfalten
    const FLUEGEL = "M0 0 C10 -40 40 -76 84 -90 C90 -70 88 -52 80 -38 C92 -36 100 -26 100 -14 C88 -16 76 -12 70 -2 C70 10 64 20 54 24 C44 12 24 4 0 0 Z";
    const fluegel = (x, y, sx, dunkel) => um(x, y, sx * S.fl, S.fl,
      flaeche(FLUEGEL, dunkel ? f.s : f.fl, form("M30 -30 C50 -40 70 -60 84 -88 L84 -36 C66 -40 50 -30 40 -14 Z", dunkel ? f.t : f.h, 0.35) + form("M60 -6 C70 -10 84 -14 100 -14 L100 0 L58 4 Z", dunkel ? f.t : f.h, 0.35)) +
      strich("M0 0 C24 -34 50 -62 84 -90 M8 -6 C36 -28 60 -36 80 -38 M14 -4 C40 -14 60 -14 70 -2", dunkel ? f.t : f.d, T.KW * 0.8));
    // Schwanz mit Pfeilspitze
    const SCHWANZ = st === 2
      ? "M30 -20 C64 -20 88 -24 102 -44 C108 -54 104 -64 112 -70 L116 -50 L132 -44 L114 -36 C98 -14 74 -2 40 -2 Z"
      : "M24 -16 C50 -14 72 -20 82 -36 C86 -44 82 -50 88 -54 L92 -38 L104 -34 L90 -28 C78 -10 56 -2 30 -2 Z";
    // Rückenzacken auf der Kontur (x, y, Winkel), hinter dem Rumpf gezeichnet – nur die Spitzen schauen heraus
    const ZACKEN = st === 2 ? [[2, -150, 10], [24, -140, 40], [40, -120, 60], [48, -96, 75], [50, -70, 90], [80, -28, 30], [96, -46, 10]]
      : st === 1 ? [[0, -150, 10], [24, -140, 40], [40, -118, 62], [48, -92, 78], [66, -22, 40]] : [[4, -148, 20], [28, -136, 50]];
    const zacken = ZACKEN.map(([x, y, w], i) => `<g transform="translate(${x} ${y}) rotate(${w})">` +
      flaeche("M-9 6 L0 -14 L9 6 Z", i % 2 ? f.d : f.h, form("M0 -14 L9 6 L3 6 Z", f.t, 0.5)) + `</g>`).join("");
    const RUMPF = "M-42 -136 C-62 -118 -68 -82 -60 -48 C-56 -28 -52 -12 -50 0 L30 0 C50 -28 58 -66 48 -100 C40 -128 16 -150 -8 -152 C-22 -152 -34 -146 -42 -136 Z";
    const BAUCH = "M-56 -118 C-68 -92 -64 -50 -48 -4 L-20 -4 C-30 -50 -30 -96 -20 -140 C-36 -138 -50 -130 -56 -118 Z";
    const KEULE = "M-10 0 C-22 -48 4 -96 44 -94 C84 -92 96 -38 80 0 Z";
    const rumpf =
      (st === 2 ? "" : zacken) +
      flaeche(SCHWANZ, f.h, form("M30 -10 C70 -10 104 -20 124 -50 L160 -40 L140 0 L30 2 Z", f.s)) +
      flaeche("M-38 -70 C-42 -40 -42 -18 -40 -6 L-22 -6 C-22 -24 -20 -48 -16 -70 Z", f.s, form("M-28 -70 L-16 -70 L-22 -6 L-28 -6 Z", f.t, 0.5)) +
      flaeche(KEULE, f.h, form("M20 0 C30 -26 56 -40 82 -36 L90 0 Z", f.s) + form("M4 -50 C14 -70 34 -78 52 -76 C36 -70 22 -60 14 -44 Z", f.l, 0.5) +
        `<circle cx="40" cy="-60" r="4" fill="${f.s}"/><circle cx="54" cy="-48" r="3" fill="${f.s}"/><circle cx="30" cy="-44" r="3" fill="${f.s}"/>`) +
      flaeche(RUMPF, f.h,
        form("M12 -152 C40 -132 50 -84 38 -40 L30 0 L70 0 L70 -160 Z", f.s) +
        `<circle cx="10" cy="-110" r="4" fill="${f.s}"/><circle cx="22" cy="-90" r="3" fill="${f.s}"/><circle cx="4" cy="-80" r="3" fill="${f.s}"/>` +
        flaeche(BAUCH, f.bauch, form("M-34 -130 C-40 -90 -40 -50 -32 -4 L-20 -4 C-30 -50 -30 -96 -20 -140 Z", "#000", 0.08) +
          strich("M-62 -100 C-50 -98 -36 -100 -26 -104 M-64 -76 C-50 -74 -36 -76 -28 -80 M-62 -52 C-50 -50 -38 -52 -30 -56 M-56 -28 C-46 -26 -36 -28 -30 -30", f.d, 2, 0.45), { kontur: false })) +
      // Vorderbein mit Krallen: neben dem Bauch, Schulter rund (Kontur nur seitlich)
      flaeche("M-26 -104 C-34 -96 -32 -60 -28 -8 L-6 -8 C-2 -50 4 -86 -2 -104 C-8 -112 -20 -112 -26 -104 Z", f.h, form("M-12 -110 C-2 -100 0 -60 -6 -6 L4 -6 L4 -110 Z", f.s, 0.8) + form("M-28 -90 C-30 -60 -28 -30 -26 -8 L-22 -8 C-24 -30 -26 -60 -24 -90 Z", f.l, 0.5)) +
      flaeche("M-32 2 C-34 -8 -26 -14 -16 -14 C-4 -14 2 -8 0 2 Z", f.h, form("M-36 -2 L4 -2 L4 6 L-36 6 Z", f.s, 0.7)) +
      flaeche("M-34 2 l-4 4 l6 -1 Z M-24 2 l-3 5 l6 -2 Z M-14 2 l-2 5 l6 -2 Z", "#FFF6E0", "", { kw: T.KW * 0.6 }) +
      flaeche("M34 -2 C34 -14 52 -18 70 -14 C82 -10 84 0 76 2 L38 2 C34 2 34 0 34 -2 Z", f.h, form("M30 -4 L86 -4 L86 4 L30 4 Z", f.s, 0.6));
    // langer Hals (nur groß)
    const HALS = "M-40 -136 C-46 -166 -40 -192 -30 -212 L4 -208 C0 -186 0 -168 6 -148 Z";
    const hals = st === 2 ? flaeche(HALS, f.h, form("M-12 -224 C-8 -196 -6 -170 0 -146 L10 -146 L10 -224 Z", f.s) + form("M-44 -140 C-48 -170 -42 -200 -34 -224 L-24 -224 C-30 -200 -34 -170 -32 -140 Z", f.bauch) +
      strich("M-46 -160 C-40 -158 -34 -158 -30 -160 M-44 -184 C-38 -182 -32 -182 -28 -184 M-40 -206 C-34 -204 -30 -204 -26 -206", f.d, 2, 0.45)) : "";
    // Eierschale (Schlüpfling)
    const SCHALE = "M-78 -60 L-60 -74 L-46 -56 L-30 -78 L-12 -58 L4 -80 L22 -60 L38 -78 L52 -56 L68 -72 L80 -58 C86 -24 64 4 0 6 C-64 4 -86 -24 -78 -60 Z";
    const schale = st === 0 ? um(150, 268, 1, 1, flaeche(SCHALE, "#FFE2B8", form("M30 -70 L80 -58 C84 -24 64 4 0 6 L0 -20 C40 -20 60 -40 30 -70 Z", "#F7B77A", 0.7) +
      `<circle cx="-40" cy="-30" r="8" fill="#E8463B" opacity=".55"/><circle cx="20" cy="-20" r="10" fill="#E8463B" opacity=".55"/><circle cx="-10" cy="-50" r="6" fill="#E8463B" opacity=".55"/>`)) : "";
    const halsZacken = st === 2 ? [[0, -210, -10], [4, -188, 10], [6, -166, 20]].map(([x, y, w], i) => `<g transform="translate(${x} ${y}) rotate(${w + 80})">` + flaeche("M-8 6 L0 -12 L8 6 Z", i % 2 ? f.d : f.h) + `</g>`).join("") : "";
    const koerper = um(160, 268, S.breit, S.rumpf, (st === 2 ? zacken + halsZacken : "") + hals + rumpf);
    // ---- Kopf: Schnauze nach links, Nüstern, Brauenwulst, Hörner, Ohrflossen ----
    const SCHAEDEL = "M-40 -6 C-44 -34 -22 -50 6 -50 C34 -50 52 -32 50 -6 C48 18 32 36 10 38 C-8 40 -24 34 -32 24 Z";
    const SCHNAUZE = "M-26 -6 C-50 -12 -72 -4 -76 12 C-78 24 -66 34 -44 34 C-26 34 -10 28 -8 16 C-6 4 -14 -4 -26 -6 Z";
    const HORN = "M0 0 C6 -16 18 -30 34 -34 C26 -24 22 -12 22 2 Z";
    const kopf =
      um(14, -40, S.horn, S.horn, flaeche(HORN, "#FFF1D2", form("M22 2 C22 -12 26 -24 34 -34 L36 -30 C30 -20 28 -8 28 4 Z", "#E2C79A"))) +
      um(-16, -44, S.horn * 0.85, S.horn * 0.85, flaeche(HORN, "#F2DFBA", form("M22 2 C22 -12 26 -24 34 -34 L36 -30 C30 -20 28 -8 28 4 Z", "#D4B88A"))) +
      flaeche("M36 -20 C48 -30 62 -30 72 -22 C62 -16 56 -6 52 4 Z", f.fl, strich("M40 -16 C50 -20 58 -22 66 -22 M44 -8 C52 -12 58 -14 62 -14", f.d, 1.6, 0.6)) +
      flaeche(SCHAEDEL, f.h, form("M14 -50 C40 -46 54 -24 50 4 C46 26 30 38 10 40 L60 60 L60 -60 Z", f.s) + form("M-30 -30 C-18 -46 0 -50 14 -48 C-4 -42 -16 -32 -22 -18 Z", f.l, 0.55) +
        `<circle cx="20" cy="-30" r="3.5" fill="${f.s}"/><circle cx="30" cy="-18" r="2.5" fill="${f.s}"/>` + form("M-30 22 C-10 34 12 36 28 30 C16 42 -10 44 -30 34 Z", f.bauch, 0.9)) +
      flaeche(SCHNAUZE, f.h, form("M-74 20 C-66 32 -42 36 -20 30 L-8 40 L-80 40 Z", f.bauch) + form("M-64 2 C-52 -6 -38 -8 -28 -4 C-40 -2 -54 2 -64 8 Z", f.l, 0.6)) +
      `<ellipse cx="-68" cy="6" rx="3.2" ry="2.2" fill="${f.d}"/><ellipse cx="-56" cy="3" rx="2.6" ry="1.8" fill="${f.d}" opacity=".8"/>` +
      strich("M-74 20 C-60 26 -40 26 -22 20", T.KF, T.KW * 0.75) + (st === 0 ? flaeche("M-60 24 l3 6 l3 -5 Z M-48 25 l3 6 l3 -6 Z", "#fff", "", { kw: T.KW * 0.5 }) : "") +
      // Brauenwulst über den Augen
      form("M-42 -20 C-36 -28 -26 -28 -22 -22 C-28 -20 -36 -20 -42 -20 Z", f.d, 0.7) + form("M-10 -26 C-2 -34 10 -34 14 -26 C6 -24 -2 -24 -10 -26 Z", f.d, 0.7) +
      auge(-32, -10, 6 * (st === 0 ? 1.15 : 1), { iris: f.iris, schlitz: true, breite: 0.72 }) + auge(2, -12, 7.6 * (st === 0 ? 1.15 : 1), { iris: f.iris, schlitz: true });
    const fl = st === 0 ? fluegel(176, 200, 1, false) : fluegel(184, 150 + (2 - st) * 30, 1, false) + fluegel(170, 140 + (2 - st) * 30, -0.75, true);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">${schatten(st === 0 ? 86 : 90)}${fl}${st === 0 ? um(160, 268, 1, S.rumpf, rumpf) : koerper}${um(S.kx, S.ky, S.kopf, S.kopf, kopf)}${schale}</svg>`;
  }

  W.TiereEntwurf = { FARBEN, svg: (art, stufe = 2, stil = "a", farbe = 0) => ({ hund, katze, drache })[art](stufe, stil, FARBEN[art][farbe]) };
})(window);
