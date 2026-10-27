// Inhalt NA-35: Schreiben – Buchstaben in Druckschrift nachspuren und lautgetreue Wörter legen.
// window.SCHRIFT: je Buchstabe die Striche in Schreibreihenfolge. Koordinaten in einem Feld 100 × 120:
//   Großbuchstaben von y = 10 (oben) bis y = 90 (Grundlinie); Kleinbuchstaben: Oberlänge 10, Mittellinie 45, Grundlinie 90, Unterlänge 112.
// Ein Strich ist eine Folge von Stücken: ["L", x1, y1, x2, y2] Linie, ["B", cx, cy, rx, ry, w0, w1] Bogen (Grad, Bildschirm-Koordinaten:
// 0 = rechts, 90 = unten, −90 = oben; von w0 nach w1 gezeichnet), ["P", x, y] Punkt (i-Punkt, Umlaut-Punkte).
// Die Form folgt einer einfachen Druckschrift (Grundschule); Länder-Schriften (Grundschrift, Schulausgangsschrift) kommen später (LEHRPLAN.md).
(function () {
  const L = (a, b, c, d) => ["L", a, b, c, d], B = (cx, cy, rx, ry, w0, w1) => ["B", cx, cy, rx, ry, w0, w1], P = (x, y) => ["P", x, y];
  const kreis = (cx, cy, r, start = 0) => B(cx, cy, r, r * 1.02, start, start - 360);   // gegen den Uhrzeigersinn, wie man o schreibt
  const S = {
    A: [[L(50, 10, 20, 90)], [L(50, 10, 80, 90)], [L(31, 62, 69, 62)]],
    B: [[L(25, 10, 25, 90)], [L(25, 10, 50, 10), B(50, 30, 20, 20, -90, 90), L(50, 50, 25, 50)], [L(25, 50, 54, 50), B(54, 70, 22, 20, -90, 90), L(54, 90, 25, 90)]],
    C: [[B(55, 50, 34, 40, -45, -315)]],
    D: [[L(25, 10, 25, 90)], [L(25, 10, 42, 10), B(42, 50, 36, 40, -90, 90), L(42, 90, 25, 90)]],
    E: [[L(25, 10, 25, 90)], [L(25, 10, 72, 10)], [L(25, 50, 65, 50)], [L(25, 90, 72, 90)]],
    F: [[L(25, 10, 25, 90)], [L(25, 10, 72, 10)], [L(25, 50, 65, 50)]],
    G: [[B(55, 50, 34, 40, -45, -360)], [L(60, 50, 89, 50)]],
    H: [[L(25, 10, 25, 90)], [L(75, 10, 75, 90)], [L(25, 50, 75, 50)]],
    I: [[L(50, 10, 50, 90)]],
    J: [[L(65, 10, 65, 68), B(45, 68, 20, 22, 0, 180)]],
    K: [[L(25, 10, 25, 90)], [L(72, 10, 25, 56)], [L(40, 42, 75, 90)]],
    L: [[L(25, 10, 25, 90), L(25, 90, 70, 90)]],
    M: [[L(20, 90, 20, 10), L(20, 10, 50, 60), L(50, 60, 80, 10), L(80, 10, 80, 90)]],
    N: [[L(25, 90, 25, 10), L(25, 10, 75, 90), L(75, 90, 75, 10)]],
    O: [[B(50, 50, 32, 40, -90, -450)]],
    P: [[L(25, 10, 25, 90)], [L(25, 10, 52, 10), B(52, 30, 20, 20, -90, 90), L(52, 50, 25, 50)]],
    Q: [[B(50, 50, 32, 40, -90, -450)], [L(58, 70, 82, 95)]],
    R: [[L(25, 10, 25, 90)], [L(25, 10, 52, 10), B(52, 30, 20, 20, -90, 90), L(52, 50, 25, 50)], [L(45, 50, 75, 90)]],
    S: [[B(50, 30, 24, 20, -30, -270), B(50, 70, 26, 20, -90, 150)]],
    T: [[L(20, 10, 80, 10)], [L(50, 10, 50, 90)]],
    U: [[L(25, 10, 25, 60), B(50, 60, 25, 30, 180, 0), L(75, 60, 75, 10)]],
    V: [[L(20, 10, 50, 90), L(50, 90, 80, 10)]],
    W: [[L(15, 10, 32, 90), L(32, 90, 50, 30), L(50, 30, 68, 90), L(68, 90, 85, 10)]],
    X: [[L(25, 10, 75, 90)], [L(75, 10, 25, 90)]],
    Y: [[L(25, 10, 50, 50)], [L(75, 10, 50, 50), L(50, 50, 50, 90)]],
    Z: [[L(25, 10, 75, 10), L(75, 10, 25, 90), L(25, 90, 75, 90)]],
    a: [[kreis(49, 67.5, 22, 0)], [L(71, 45, 71, 90)]],
    b: [[L(28, 10, 28, 90)], [B(50, 67.5, 22, 22.5, 180, 540)]],
    c: [[B(52, 67.5, 22, 22.5, -45, -315)]],
    d: [[kreis(48, 67.5, 22, 0)], [L(70, 10, 70, 90)]],
    e: [[L(28, 67, 72, 67), B(50, 67.5, 22, 22.5, 0, -315)]],
    f: [[B(58, 26, 12, 14, -30, -180), L(46, 26, 46, 90)], [L(32, 48, 62, 48)]],
    g: [[kreis(48, 67.5, 22, 0)], [L(70, 45, 70, 100), B(50, 100, 20, 12, 0, 150)]],
    h: [[L(28, 10, 28, 90)], [B(50, 62, 22, 17, 180, 360), L(72, 62, 72, 90)]],
    i: [[L(50, 45, 50, 90)], [P(50, 30)]],
    j: [[L(56, 45, 56, 100), B(41, 100, 15, 12, 0, 150)], [P(56, 30)]],
    k: [[L(28, 10, 28, 90)], [L(68, 45, 28, 72)], [L(42, 63, 70, 90)]],
    l: [[L(50, 10, 50, 90)]],
    m: [[L(20, 45, 20, 90)], [B(35, 60, 15, 15, 180, 360), L(50, 60, 50, 90)], [B(65, 60, 15, 15, 180, 360), L(80, 60, 80, 90)]],
    n: [[L(28, 45, 28, 90)], [B(50, 62, 22, 17, 180, 360), L(72, 62, 72, 90)]],
    o: [[B(50, 67.5, 22, 22.5, -90, -450)]],
    p: [[L(28, 45, 28, 112)], [B(50, 67.5, 22, 22.5, 180, 540)]],
    q: [[kreis(48, 67.5, 22, 0)], [L(70, 45, 70, 112)]],
    r: [[L(32, 45, 32, 90)], [B(52, 62, 20, 16, 180, 300)]],
    s: [[B(50, 56, 18, 11, -30, -270), B(50, 79, 20, 11, -90, 150)]],
    t: [[L(45, 20, 45, 90)], [L(30, 48, 62, 48)]],
    u: [[L(28, 45, 28, 70), B(50, 70, 22, 20, 180, 0), L(72, 70, 72, 45)], [L(72, 45, 72, 90)]],
    v: [[L(25, 45, 50, 90), L(50, 90, 75, 45)]],
    w: [[L(15, 45, 32, 90), L(32, 90, 50, 56), L(50, 56, 68, 90), L(68, 90, 85, 45)]],
    x: [[L(28, 45, 72, 90)], [L(72, 45, 28, 90)]],
    y: [[L(28, 45, 50, 90)], [L(72, 45, 36, 112)]],
    z: [[L(28, 45, 72, 45), L(72, 45, 28, 90), L(28, 90, 72, 90)]]
  };
  // Umlaute: Grundbuchstabe plus zwei Punkte
  const punkte = (hoch) => [[P(38, hoch)], [P(62, hoch)]];
  S["Ä"] = S.A.concat([[P(36, 0)], [P(64, 0)]]);   // über dem Großbuchstaben (y = 0 liegt im Feld über der Kappe)
  S["Ö"] = S.O.concat([[P(38, 0)], [P(62, 0)]]);
  S["Ü"] = S.U.concat([[P(36, 0)], [P(64, 0)]]);
  S["ä"] = S.a.concat(punkte(30)); S["ö"] = S.o.concat(punkte(30)); S["ü"] = S.u.concat(punkte(30));
  window.SCHRIFT = S;

  if (window.Inhalte) {
    const basis = { fach: "deutsch", laender: null, quelle: "spiele/lesen/" };
    Inhalte.registriere(Object.assign({ id: "de.schreiben.spuren", titel: "Buchstaben nachspuren", lz: ["de.sc.02"], stufe: ["vs", "1"],
      aufgaben: Object.keys(S).length, lernkartei: false }, basis));
    Inhalte.registriere(Object.assign({ id: "de.schreiben.woerter", titel: "Wörter legen", lz: ["de.sc.03", "de.sc.05"], stufe: ["1", "2"],
      aufgaben: 40, lernkartei: true }, basis));
  }
})();
