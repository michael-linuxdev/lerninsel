// Lehrplan (NA-03): Kompatibilitäts-Schicht und errechnete Abdeckung.
// Daten: Kern-Lernziele in shared/lehrplan/kern.js, Länder in shared/lehrplan/laender/<land>.js, Inhalte in shared/inhalte.js.
// window.LEHRPLAN behält die alte Form ({ kmk, laender: { sachsen: … }, fuer(land, fach, klasse) }), damit der Elternbereich
// unverändert funktioniert. Neu: LEHRPLAN.errechnet(lernbereich) → "ja" | "teil" | "nein" aus den Lernziel-Verweisen (lz)
// und den registrierten Inhalten, LEHRPLAN.zaehle(land, klasse) für die Übersicht.
// Ladereihenfolge: (Inhaltsdaten) → shared/lehrplan/kern.js → shared/inhalte.js → shared/lehrplan/laender/*.js → shared/lehrplan.js
(function () {
  const LL = window.LehrplanLaender || {}, K = window.LernzielKern;
  const laender = {};
  Object.values(LL).forEach(l => { laender[l.schluessel] = l; });
  // Zusatz-Ziele der Länder in den Kern einhängen (nur lesbar über LernzielKern.ziel)
  if (K) Object.values(LL).forEach(l => ((l.abweichungen || {}).extra || []).forEach(([id, stufe, de]) => {
    if (!K.ziele[id]) { const [fach, bereich] = id.split("."); K.ziele[id] = { id, fach, bereich, stufe, titel: { de }, land: l.code }; }
  }));
  if (window.Inhalte) Inhalte.ausBestand();

  const ORDNUNG = { nein: 0, teil: 1, ja: 2 };
  function errechnet(lb) {
    const lz = lb.lz || []; if (!lz.length || !window.Inhalte) return "nein";
    const w = lz.map(id => Inhalte.abdeckung(id));
    if (w.every(x => x === "ja")) return "ja";
    return w.some(x => ORDNUNG[x] > 0) ? "teil" : "nein";
  }

  window.LEHRPLAN = {
    kmk: {
      mathe: ["Zahl und Operation", "Raum und Form", "Muster, Strukturen und funktionaler Zusammenhang", "Größen und Messen", "Daten und Zufall"],
      // Fassung 2022: fünf Bereiche (Lesen und der Umgang mit Texten und Medien sind getrennt)
      deutsch: K ? Object.values(K.FAECHER.de.bereiche) : []
    },
    laender,
    // Lernbereiche für eine Klasse (1 und 2 teilen sich in Sachsen die Stufe „1/2“; Fächer ohne diese Stufe, z. B. Englisch in Kl. 1/2, liefern [])
    fuer(land, fach, klasse) {
      const f = this.laender[land] && this.laender[land].faecher[fach]; if (!f) return [];
      const stufe = klasse <= 2 ? "1/2" : String(klasse);
      return f.stufen[stufe] || [];
    },
    errechnet,
    zaehle(land, klasse) {
      const n = { hand: { ja: 0, teil: 0, nein: 0 }, errechnet: { ja: 0, teil: 0, nein: 0 } };
      Object.keys((this.laender[land] || {}).faecher || {}).forEach(f => this.fuer(land, f, klasse).forEach(lb => {
        n.hand[lb.abdeckung]++; n.errechnet[errechnet(lb)]++;
      }));
      return n;
    }
  };
})();
