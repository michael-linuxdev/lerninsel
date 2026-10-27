// Inhalt NA-30: Anlaute und Buchstabe–Laut (Deutsch Kl. 1 und Vorschule) – Format nach docs/LEHRPLAN.md „Inhalte als Daten“.
// window.ANLAUTE: die Anlaut-Tabelle (Buchstabe, Bildwörter aus dem Wortschatz-Kern). selten = kein eigener Laut am Wortanfang
// (C, V, X, Y klingen wie andere Buchstaben) → nur in der Tabelle, nicht in den Hör-Aufgaben. laut = mehrere Buchstaben, ein Laut.
// Wörter werden in den Übungen OHNE Artikel vorgelesen (sonst hört das Kind „d…“ statt des Anlauts).
// Nach shared/inhalte.js laden; registriert drei Übungen im Inhalte-Verzeichnis (Abdeckung im Elternbereich).
(function () {
  const A = [
    { b: "A", w: ["w.apfel", "w.affe", "w.ameise"] },
    { b: "B", w: ["w.banane", "w.ball", "w.baer", "w.biene", "w.bus"] },
    { b: "C", w: ["w.clown", "w.computer"], selten: true, tipp: "C klingt am Anfang oft wie K." },
    { b: "D", w: ["w.dino", "w.drache"] },
    { b: "E", w: ["w.esel", "w.ente", "w.erdbeere"] },
    { b: "F", w: ["w.fisch", "w.frosch", "w.fenster", "w.fahrrad"] },
    { b: "G", w: ["w.gabel", "w.giraffe", "w.gurke"] },
    { b: "H", w: ["w.hund", "w.haus", "w.hase", "w.hand"] },
    { b: "I", w: ["w.igel", "w.insel"] },
    { b: "J", w: ["w.jacke", "w.jaguar"] },
    { b: "K", w: ["w.katze", "w.kuh", "w.kaese", "w.krone"] },
    { b: "L", w: ["w.lampe", "w.loewe", "w.leiter"] },
    { b: "M", w: ["w.maus", "w.mond", "w.milch", "w.muetze"] },
    { b: "N", w: ["w.nase", "w.nest", "w.nuss"] },
    { b: "O", w: ["w.ohr", "w.oma", "w.opa", "w.orange"] },
    { b: "P", w: ["w.pilz", "w.pinsel", "w.papa"] },
    { b: "Qu", w: ["w.qualle"], tipp: "Q kommt fast immer mit u: Qu." },
    { b: "R", w: ["w.rakete", "w.rose", "w.regen"] },
    { b: "S", w: ["w.sonne", "w.suppe", "w.socke"] },
    { b: "T", w: ["w.tomate", "w.tuer", "w.tasche", "w.tee"] },
    { b: "U", w: ["w.uhr", "w.ufo"] },
    { b: "V", w: ["w.vogel"], selten: true, tipp: "V klingt oft wie F." },
    { b: "W", w: ["w.wal", "w.wolke", "w.wasser"] },
    { b: "X", w: ["w.xylofon"], selten: true, tipp: "X steht selten am Anfang. Es klingt wie ks." },
    { b: "Y", w: ["w.yoga"], selten: true, tipp: "Y klingt am Anfang wie J." },
    { b: "Z", w: ["w.zebra", "w.zitrone", "w.zahn", "w.zug"] },
    { b: "Ä", w: ["w.aehre"] },
    { b: "Ö", w: ["w.oel"] },
    { b: "Ü", w: ["w.ueberraschung"] },
    { b: "Sch", w: ["w.schaf", "w.schuh", "w.schwein", "w.schere"], laut: true },
    { b: "Ei", w: ["w.ei", "w.eis"], laut: true },
    { b: "Au", w: ["w.auto", "w.auge"], laut: true }
  ];
  window.ANLAUTE = A;

  // Aufgaben: je Bildwort eine Anlaut-Aufgabe (ohne seltene Buchstaben)
  const aufgaben = [];
  A.filter(x => !x.selten).forEach(x => x.w.forEach(w => aufgaben.push({ typ: "anlaut", wort: w, ziel: x.b })));
  window.ANLAUT_AUFGABEN = aufgaben;

  if (window.Inhalte) {
    const basis = { fach: "deutsch", laender: null, lernkartei: true, quelle: "spiele/lesen/" };
    Inhalte.registriere(Object.assign({ id: "de.anlaute.gleich", titel: "Gleicher Anfang", lz: ["de.le.01"], stufe: ["vs", "1"], aufgaben }, basis));
    Inhalte.registriere(Object.assign({ id: "de.anlaute.buchstabe", titel: "Welcher Buchstabe?", lz: ["de.le.02", "de.su.02"], stufe: ["1", "2"], aufgaben }, basis));
    Inhalte.registriere(Object.assign({ id: "de.anlaute.bild", titel: "Finde das Bild", lz: ["de.le.02"], stufe: ["vs", "1"], aufgaben }, basis));
    Inhalte.registriere(Object.assign({ id: "de.anlaute.tafel", titel: "Buchstaben-Tafel", lz: ["de.le.02"], stufe: ["vs", "1", "2"], aufgaben: [] }, basis, { lernkartei: false }));
  }
})();
