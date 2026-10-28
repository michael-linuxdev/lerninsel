// Schreibschrift nachspuren (29.10.2026): Schulausgangsschrift (SAS), die Schreibschrift des sächsischen Deutsch-Lehrplans 2025 (Kl. 1/2:
// „Beherrschen der Schulausgangsschrift“). Kleinbuchstaben einzeln und verbundene Wörter; Großbuchstaben folgen (PLAN.md).
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
    c: { e: [34, 52], k: "M34 52 C32 45 24 44 18 50 C12 56 10 66 12 76 C14 88 28 92 40 86", x: [40, 86] },
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
  const ums = (b, dx) => Object.assign({}, B[b], { extra: (B[b].extra || []).concat([punkt(dx - 5, 32), punkt(dx + 5, 32)]) });
  B["ä"] = ums("a", 22); B["ö"] = ums("o", 20); B["ü"] = ums("u", 23);
  Object.values(B).forEach(b => { b.w = b.x[0]; });

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
    const zeichen = [...wort].filter(z => B[z]);
    let haupt = [], extra = [], x = 0, aus = [0, 90];
    zeichen.forEach((z, n) => {
      const b = B[z];
      if (n > 0 && aus[1] < 70) x = aus[0] - b.e[0] + 6 + (b.e[1] > 70 ? 4 : 0);   // nach o, v, w, b rückt der nächste Buchstabe an den Ausgang heran
      const e2 = [x + b.e[0], b.e[1]];
      haupt = haupt.concat(abtasten(verbindung(aus, e2, b.ein, x), 0).slice(haupt.length ? 1 : 0)).concat(abtasten(b.k, x).slice(1));
      (b.extra || []).forEach(s => extra.push(s.punkt ? [[s.punkt[0] + x, s.punkt[1]]] : abtasten(s, x)));
      aus = [x + b.x[0], b.x[1]]; x += b.w;
    });
    const striche = [haupt].concat(extra).map(neige);
    const xs = [].concat(...striche).map(q => q[0]);
    return { striche, links: Math.min(...xs) - 8, breite: Math.max(...xs) - Math.min(...xs) + 16 };
  }
  // Übungswörter nur aus Kleinbuchstaben (Großbuchstaben folgen), nach Schwierigkeit
  const WOERTER = ["im", "in", "um", "nie", "mit", "rot", "gut", "und", "auf", "ich", "wir", "oma", "opa", "mama", "papa", "eis", "lila",
    "malen", "lesen", "rufen", "baden", "singen", "laufen", "spielen", "schreiben", "hallo", "danke", "bitte", "heute", "morgen", "blau", "grün", "süß", "klein"];
  window.SCHREIBSCHRIFT = { name: "Schulausgangsschrift", kurz: "SAS", buchstaben: B, reihe: "ilutenmrsaodcbhkfgjpqvwxyzäöüß".split(""), woerter: WOERTER, baue };

  if (window.Inhalte) Inhalte.registriere({ id: "de.schreiben.sas", titel: "Schreibschrift nachspuren (Schulausgangsschrift)", lz: ["de.sc.02"], stufe: ["1", "2"],
    aufgaben: Object.keys(B).length + WOERTER.length, lernkartei: false, fach: "deutsch", laender: null, quelle: "spiele/lesen/" });
})();
