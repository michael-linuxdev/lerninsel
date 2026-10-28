// Schreibschrift nachspuren (29.10.2026): Schulausgangsschrift (SAS), die Schreibschrift des sächsischen Deutsch-Lehrplans 2025 (Kl. 1/2:
// „Beherrschen der Schulausgangsschrift“). Klein- und Großbuchstaben einzeln und verbundene Wörter (Großbuchstaben seit 30.10.2026).
// Formen von Hand nachgebildet (aufrecht entworfen, beim Zeichnen leicht nach rechts geneigt) – bitte mit der Schreibtabelle der Schule
// vergleichen; Rückmeldungen im Plan sammeln.
// Feld wie window.SCHRIFT: Oberlänge y = 10, Mittellinie 45, Grundlinie 90, Unterlänge bis 115. Jeder Buchstabe:
//   e: Endpunkt des Aufstrichs (der Aufstrich beginnt bei (0, 90) bzw. am Ende des vorigen Buchstabens),
//   k: Pfad des Buchstabenkörpers ab e (SVG-Befehle M, L, C, absolut), x: Ausgang (Verbindung zum nächsten Buchstaben), w: Breite,
//   extra: Zusatzstriche (i-Punkt, t-Strich, Umlautpunkte) – im Wort erst nach dem ganzen Wort, wie man es mit der Hand macht.
(function () {
  const punkt = (x, y) => ({ punkt: [x, y] });
  const B = {
    a: { e: [32, 48], ein: [3, 80, 6, 50], k: "M32 48 C26 44 10 48 10 68 C10 90 30 92 34 70 L34 46 L34 84 C34 90 38 91 44 88", x: [44, 88] },
    b: { e: [4, 72], k: "M4 72 C14 60 24 34 24 20 C24 8 14 8 12 20 C10 34 12 70 12 84 C12 92 30 92 32 74 C33 60 30 50 26 50 C30 50 36 48 42 46", x: [42, 46] },
    c: { e: [36, 50], ein: [3, 80, 10, 44], k: "M36 50 C34 44 26 43 20 46 C12 52 10 66 12 76 C14 88 28 92 40 86", x: [40, 86] },
    d: { e: [32, 48], ein: [3, 80, 6, 50], k: "M32 48 C26 44 10 48 10 68 C10 90 30 92 34 70 L34 10 L34 84 C34 90 38 91 44 88", x: [44, 88] },
    e: { e: [8, 74], k: "M8 74 C18 72 30 64 30 54 C30 46 18 44 13 54 C8 66 12 88 26 90 C32 90 36 88 40 85", x: [40, 85] },
    f: { e: [4, 72], k: "M4 72 C14 60 24 34 24 20 C24 8 14 8 12 20 L12 106 C12 116 4 116 4 108 C4 98 16 92 30 88", x: [30, 88] },
    g: { e: [32, 48], ein: [3, 80, 6, 50], k: "M32 48 C26 44 10 48 10 68 C10 90 30 92 34 70 L34 46 L34 104 C34 118 16 118 16 108 C16 98 30 92 42 88", x: [42, 88] },
    h: { e: [4, 72], k: "M4 72 C14 60 24 34 24 20 C24 8 14 8 12 20 C10 34 12 70 12 90 L12 64 C14 48 32 42 34 60 L34 84 C34 90 38 91 46 88", x: [46, 88] },
    i: { e: [14, 45], k: "M14 45 L14 84 C14 90 18 91 26 88", x: [26, 88], extra: [punkt(14, 32)] },
    j: { e: [14, 45], k: "M14 45 L14 104 C14 118 0 118 0 108 C0 98 14 92 26 88", x: [26, 88], extra: [punkt(14, 32)] },
    k: { e: [4, 72], k: "M4 72 C14 60 24 34 24 20 C24 8 14 8 12 20 C10 34 12 70 12 90 L12 66 C18 48 36 46 34 58 C32 66 20 68 16 66 C24 70 30 80 32 86 C33 90 38 91 44 88", x: [44, 88] },
    l: { e: [4, 72], k: "M4 72 C14 60 24 34 24 20 C24 8 14 8 12 20 C10 34 12 70 12 84 C12 90 16 91 24 88", x: [24, 88] },
    m: { e: [8, 46], k: "M8 46 L8 90 L8 64 C10 48 26 42 28 60 L28 90 L28 64 C30 48 46 42 48 60 L48 84 C48 90 52 91 60 88", x: [60, 88] },
    n: { e: [8, 46], k: "M8 46 L8 90 L8 64 C10 48 30 42 32 60 L32 84 C32 90 36 91 44 88", x: [44, 88] },
    o: { e: [26, 46], ein: [3, 80, 6, 50], k: "M26 46 C14 44 8 58 8 70 C8 88 30 92 32 70 C33 56 30 46 26 46 C32 46 36 46 42 45", x: [42, 45] },
    p: { e: [8, 46], k: "M8 46 L8 114 L8 64 C10 48 32 44 32 66 C32 86 18 92 10 86 C18 90 30 90 40 88", x: [40, 88] },
    q: { e: [32, 48], ein: [3, 80, 6, 50], k: "M32 48 C26 44 10 48 10 68 C10 90 30 92 34 70 L34 46 L34 112 C34 104 40 96 46 90", x: [46, 90] },
    r: { e: [10, 46], k: "M10 46 C12 43 15 45 17 48 C19 45 22 43 26 44 C25 52 24 70 24 84 C24 90 28 91 34 88", x: [34, 88] },
    s: { e: [20, 44], k: "M20 44 C24 58 34 64 32 78 C30 90 14 92 8 84 C12 88 20 90 32 88", x: [32, 88] },
    t: { e: [14, 22], k: "M14 22 L14 84 C14 90 18 91 26 88", x: [26, 88], extra: ["M5 46 L25 46"] },
    u: { e: [12, 45], k: "M12 45 L12 78 C12 92 30 92 34 74 L34 45 L34 84 C34 90 38 91 46 88", x: [46, 88] },
    v: { e: [8, 46], k: "M8 46 L8 78 C8 92 28 92 30 72 C31 60 30 50 28 48 C32 48 38 47 42 46", x: [42, 46] },
    w: { e: [8, 46], k: "M8 46 L8 78 C8 92 24 92 26 78 L26 50 L26 78 C26 92 42 92 44 72 C45 60 44 50 42 48 C46 48 52 47 56 46", x: [56, 46] },
    x: { e: [6, 48], k: "M6 48 C14 42 20 48 21 58 C22 72 24 88 36 88", x: [36, 88], extra: ["M30 50 L12 86"] },
    y: { e: [12, 45], k: "M12 45 L12 78 C12 92 30 92 34 74 L34 45 L34 104 C34 118 16 118 16 108 C16 98 30 92 42 88", x: [42, 88] },
    z: { e: [6, 50], k: "M6 50 C12 44 26 44 26 54 C26 64 14 68 10 70 C22 70 28 80 28 96 C28 112 14 116 10 108 C8 100 20 92 34 88", x: [34, 88] },
    ß: { e: [8, 46], k: "M8 46 L8 108 L8 30 C8 12 30 12 30 28 C30 38 18 42 16 44 C28 46 34 56 32 70 C30 88 18 92 12 86 C18 90 28 90 36 88", x: [36, 88] }
  };
  // Großbuchstaben (30.10.2026): s = Striche in Schreibreihenfolge (der letzte trägt den Ausgang x zum nächsten Buchstaben; x fehlt = absetzen),
  // extra = Zusatzstriche (Querstriche, Punkte). Oberlänge y = 10; Umlautpunkte über dem Buchstaben bei y = 2.
  const G = {
    A: { s: ["M4 90 C14 60 24 30 30 10 C34 30 40 60 46 84 C47 90 52 91 58 88"], extra: ["M15 58 L41 58"], x: [58, 88] },
    B: { s: ["M14 10 L14 90 L14 14 C24 6 42 8 42 28 C42 44 26 48 18 48 C40 48 48 60 46 72 C44 88 26 92 14 90"] },
    C: { s: ["M44 22 C40 10 26 8 18 18 C8 30 6 60 12 76 C18 92 38 92 50 84"], x: [50, 84] },
    D: { s: ["M10 18 C14 10 20 10 20 20 L20 90 C44 92 52 70 52 50 C52 26 40 10 20 12"] },
    E: { s: ["M42 18 C38 8 18 8 16 24 C14 38 26 46 34 46 C18 46 8 56 10 72 C12 90 34 92 48 84"], x: [48, 84] },
    F: { s: ["M28 14 L28 70 C28 92 12 96 6 86"], extra: ["M8 14 C20 8 32 16 48 10", "M18 50 L40 50"] },
    G: { s: ["M46 22 C42 10 24 8 16 20 C6 36 8 72 16 84 C26 96 44 88 46 72 L46 50 L46 104 C46 118 28 118 28 108 C28 98 42 92 54 88"], x: [54, 88] },
    H: { s: ["M12 10 L12 90", "M42 10 L42 84 C42 90 46 91 54 88"], extra: ["M12 50 L42 50"], x: [54, 88] },
    I: { s: ["M14 14 C20 8 28 10 28 18 L28 84 C28 90 32 91 40 88"], x: [40, 88] },
    J: { s: ["M14 14 C20 8 30 10 30 18 L30 100 C30 116 10 116 10 104 C10 94 26 90 40 88"], x: [40, 88] },
    K: { s: ["M14 10 L14 90", "M44 12 C30 30 22 44 16 50 C26 52 32 70 36 84 C37 90 42 91 50 88"], x: [50, 88] },
    L: { s: ["M24 20 C24 8 40 8 40 16 C40 26 28 32 24 50 C20 70 16 86 8 88 C4 89 4 84 10 84 C20 84 32 92 48 88"], x: [48, 88] },
    M: { s: ["M8 90 L14 10 L28 70 L42 10 L48 84 C48 90 52 91 60 88"], x: [60, 88] },
    N: { s: ["M10 90 L14 10 L40 88 L44 10"] },
    O: { s: ["M30 10 C14 10 6 34 6 52 C6 76 16 92 30 92 C44 92 52 74 52 52 C52 30 44 10 30 10 C26 10 22 14 24 18"] },
    P: { s: ["M14 10 L14 90 L14 14 C24 6 46 8 46 28 C46 46 26 52 14 50"] },
    Q: { s: ["M30 10 C14 10 6 34 6 52 C6 76 16 92 30 92 C44 92 52 74 52 52 C52 30 44 10 30 10 C26 10 22 14 24 18"], extra: ["M32 76 C38 86 46 92 56 90"] },
    R: { s: ["M14 10 L14 90 L14 14 C24 6 46 8 46 28 C46 46 26 52 18 50 C30 54 36 76 40 86 C41 90 46 91 54 88"], x: [54, 88] },
    S: { s: ["M44 20 C40 8 18 8 18 26 C18 44 46 50 46 70 C46 90 20 94 10 82"] },
    T: { s: ["M28 12 L28 84 C28 92 20 94 14 88"], extra: ["M8 14 C20 8 34 16 50 10"] },
    U: { s: ["M10 14 C14 10 16 14 16 20 L16 70 C16 94 44 94 44 70 L44 14 L44 84 C44 90 48 91 56 88"], x: [56, 88] },
    V: { s: ["M10 14 C14 10 16 14 18 22 L30 90 L46 10"] },
    W: { s: ["M6 14 C10 10 12 14 14 22 L22 90 L32 40 L42 90 L54 10"] },
    X: { s: ["M10 12 C24 30 34 70 48 88"], extra: ["M46 12 L12 88"], x: [48, 88] },
    Y: { s: ["M10 14 C14 10 16 14 16 20 L16 60 C16 76 40 76 42 60 L42 14 L42 104 C42 118 24 118 24 108 C24 98 38 92 52 88"], x: [52, 88] },
    Z: { s: ["M10 16 C20 8 34 16 46 12 L12 88 C24 84 36 92 50 88"] }
  };
  const umsG = (b, dx) => Object.assign({}, G[b], { extra: (G[b].extra || []).concat([punkt(dx - 6, 2), punkt(dx + 6, 2)]) });
  G["Ä"] = umsG("A", 30); G["Ö"] = umsG("O", 30); G["Ü"] = umsG("U", 30);
  const ums = (b, dx) => Object.assign({}, B[b], { extra: (B[b].extra || []).concat([punkt(dx - 5, 32), punkt(dx + 5, 32)]) });
  B["ä"] = ums("a", 22); B["ö"] = ums("o", 20); B["ü"] = ums("u", 23);
  Object.values(B).forEach(b => { b.w = b.x[0]; });
  Object.values(G).forEach(b => { b.gross = true; });

  const NEIGUNG = 0.18;   // leicht nach rechts geneigt
  // Pfad (M/L/C, absolut) in Punkte zerlegen
  function abtasten(pfad, dx) {
    const t = pfad.match(/[MLC]|-?[\d.]+/g), p = []; let i = 0, cur = [0, 0];
    const zahl = () => +t[i++];
    while (i < t.length) {
      const cmd = t[i++];
      if (cmd === "M") { cur = [zahl() + dx, zahl()]; p.push(cur); }
      else if (cmd === "L") { const z = [zahl() + dx, zahl()], n = Math.max(2, Math.ceil(Math.hypot(z[0] - cur[0], z[1] - cur[1]) / 2)); for (let k = 1; k <= n; k++) p.push([cur[0] + (z[0] - cur[0]) * k / n, cur[1] + (z[1] - cur[1]) * k / n]); cur = z; }
      else if (cmd === "C") {
        const c1 = [zahl() + dx, zahl()], c2 = [zahl() + dx, zahl()], z = [zahl() + dx, zahl()];
        const n = Math.max(6, Math.ceil((Math.hypot(c1[0] - cur[0], c1[1] - cur[1]) + Math.hypot(c2[0] - c1[0], c2[1] - c1[1]) + Math.hypot(z[0] - c2[0], z[1] - c2[1])) / 2));
        for (let k = 1; k <= n; k++) { const s = k / n, u = 1 - s; p.push([u * u * u * cur[0] + 3 * u * u * s * c1[0] + 3 * u * s * s * c2[0] + s * s * s * z[0], u * u * u * cur[1] + 3 * u * u * s * c1[1] + 3 * u * s * s * c2[1] + s * s * s * z[1]]); }
        cur = z;
      }
    }
    return p;
  }
  // Verbindung (bzw. Anstrich) von a nach b: aus der Grundlinie als Aufstrich, vom Oberband (b, o, v, w) fast waagerecht
  function verbindung(a, b, ein, x) {
    const d = b[0] - a[0];
    if (ein && a[1] > 70) return `M${a[0]} ${a[1]} C${x + ein[0]} ${ein[1]} ${x + ein[2]} ${ein[3]} ${b[0]} ${b[1]}`;   // um das Oval herum (a, d, g, o, q)
    return a[1] > 70 ? `M${a[0]} ${a[1]} C${a[0] + d * 0.35} ${a[1]} ${b[0] - d * 0.25} ${Math.min(90, b[1] + 18)} ${b[0]} ${b[1]}`
      : `M${a[0]} ${a[1]} C${a[0] + Math.max(3, d * 0.4)} ${a[1]} ${b[0] - Math.max(2, d * 0.3)} ${b[1] - 2} ${b[0]} ${b[1]}`;
  }
  const neige = (p) => p.map(([x, y]) => [x + (90 - y) * NEIGUNG, y]);
  // Ein Wort (oder ein Buchstabe) als Striche: [Hauptstrich (verbunden), Zusatzstriche …]; Breite für das Bildfeld
  function baue(wort) {
    const zeichen = [...wort].filter(z => B[z] || G[z]);
    const striche = [], extra = [];
    let cur = [], x = 0, aus = [0, 90];
    const neuerStrich = (p) => { if (cur.length) striche.push(cur); cur = p; };
    zeichen.forEach((z, n) => {
      if (G[z]) {   // Großbuchstabe: eigene Striche, Ausgang (falls vorhanden) verbindet zum nächsten Buchstaben
        const g = G[z], teile = g.s.map(st => abtasten(st, x)), maxX = Math.max(...[].concat(...teile).map(q => q[0] + (90 - q[1]) * NEIGUNG));   // geneigt gemessen
        teile.forEach(t => neuerStrich(t));
        (g.extra || []).forEach(st => extra.push(st.punkt ? [[st.punkt[0] + x, st.punkt[1]]] : abtasten(st, x)));
        aus = g.x ? [x + g.x[0], g.x[1]] : null; x = g.x ? x + g.x[0] : maxX + 6;
        return;
      }
      const b = B[z];
      if (n > 0 && aus && aus[1] < 70) x = aus[0] - b.e[0] + 6 + (b.e[1] > 70 ? 4 : 0);   // nach o, v, w, b rückt der nächste Buchstabe an den Ausgang heran
      const e2 = [x + b.e[0], b.e[1]];
      if (aus) cur = cur.concat(abtasten(verbindung(aus, e2, b.ein, x), 0).slice(cur.length ? 1 : 0));
      else neuerStrich(abtasten(verbindung([x, 90], e2, b.ein, x), 0));   // nach abgesetztem Großbuchstaben: neuer Aufstrich
      cur = cur.concat(abtasten(b.k, x).slice(1));
      (b.extra || []).forEach(st => extra.push(st.punkt ? [[st.punkt[0] + x, st.punkt[1]]] : abtasten(st, x)));
      aus = [x + b.x[0], b.x[1]]; x += b.w;
    });
    if (cur.length) striche.push(cur);
    const alle = striche.concat(extra).map(neige);
    const xs = [].concat(...alle).map(q => q[0]);
    return { striche: alle, links: Math.min(...xs) - 8, breite: Math.max(...xs) - Math.min(...xs) + 16 };
  }
  // Übungswörter: erst nur Kleinbuchstaben, dann Namenwörter mit Großbuchstaben (kommen dran, sobald ihre Buchstaben geübt sind)
  const WOERTER = ["im", "in", "um", "nie", "mit", "rot", "gut", "und", "auf", "ich", "wir", "oma", "opa", "mama", "papa", "eis", "lila",
    "malen", "lesen", "rufen", "baden", "singen", "laufen", "spielen", "schreiben", "hallo", "danke", "bitte", "heute", "morgen", "blau", "grün", "süß", "klein",
    "Oma", "Opa", "Mama", "Uhr", "Igel", "Hut", "Auto", "Ente", "Leo", "Maus", "Nase", "Rose", "Tor", "Kino", "Ball", "Baum", "Fisch", "Sonne",
    "Dorf", "Garten", "Pferd", "Vogel", "Wald", "Zebra", "Juli", "Eis", "Quark", "Xaver", "Yak", "Clown", "Äpfel", "Öl", "Übung", "Sachsen"];
  window.SCHREIBSCHRIFT = { name: "Schulausgangsschrift", kurz: "SAS", buchstaben: Object.assign({}, B, G), reihe: "ilutenmrsaodcbhkfgjpqvwxyzäöüß".split("").concat("ILHUAMKRETNOCGSJDPBFVWZXYQÄÖÜ".split("")), woerter: WOERTER, baue };

  if (window.Inhalte) Inhalte.registriere({ id: "de.schreiben.sas", titel: "Schreibschrift nachspuren (Schulausgangsschrift)", lz: ["de.sc.02"], stufe: ["1", "2"],
    aufgaben: Object.keys(B).length + Object.keys(G).length + WOERTER.length, lernkartei: false, fach: "deutsch", laender: null, quelle: "spiele/lesen/" });
})();
