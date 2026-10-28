// Zeichnet die Figur aus einem gespeicherten Look – gemeinsam für Anziehspiel, „Meine Ecke“ und andere Seiten.
// Braucht teile.js (window.Puppe).
(function () {
  const P = window.Puppe;
  const HAUT = ["#FFE0C7", "#F6C9A3", "#E8B08A", "#C98D63", "#A0694A", "#6E4630"];
  const HAARFARBEN = ["#F4CD6A", "#D9A04E", "#A8693A", "#5C3A21", "#2A2230", "#C9542B", "#FF8CC6", "#9B6BE0", "#4FA8F0", "#6ED8B8"];
  // Startfigur; für Jungen (Ansprache „m“ aus der Ersteinrichtung) kurze Haare, T-Shirt und Jeans
  const STANDARD = (g = window.Spielwelt && window.Spielwelt.kind ? window.Spielwelt.kind().geschlecht : "w") => ({
    ort: "zimmer",
    figur: { id: "laecheln", farbe: HAUT[1] },
    haare: g === "m" ? { id: "scheitel", farbe: HAARFARBEN[2] } : { id: "lang", farbe: HAARFARBEN[2] },
    oberteil: { id: "tshirt", farbe: g === "m" ? "#3AA0E0" : "#FF9BC8" },
    unterteil: g === "m" ? { id: "jeans", farbe: "#3A5FA8" } : { id: "rock", farbe: "#7B55B8" },
    kleid: null,
    schuhe: { id: "turn", farbe: "#FFFFFF" },
    extras: {}
  });

  const finde = (liste, id) => liste.find(t => t.id === id);

  // ---------- Zeichnen ----------
  function zeichneFigur(o) {
    const haut = o.figur.farbe;
    const haar = o.haare && finde(P.haare, o.haare.id);
    const ober = o.oberteil && finde(P.oberteile, o.oberteil.id);
    const unter = o.unterteil && finde(P.unterteile, o.unterteil.id);
    const kleid = o.kleid && finde(P.kleider, o.kleid.id);
    const schuh = o.schuhe && finde(P.schuhe, o.schuhe.id);
    const gesicht = finde(P.gesichter, o.figur.id) || P.gesichter[0];
    const ex = (ebene) => P.extras.filter(e => e.ebene === ebene && o.extras[e.id]).map(e => e.teil(o.extras[e.id].farbe)).join("");

    let s = ex("ruecken");
    if (haar) s += haar.hinten(o.haare.farbe);
    const ohneBeine = !!(kleid && kleid.ohneBeine);
    s += P.koerper.hinten(haut, ohneBeine);
    if (!ober && !kleid) s += P.koerper.unterhemd();
    if (!unter && !kleid) s += P.koerper.unterhose();
    // Bei Kleidern liegen die Schuhe unter dem Rock, bei Hosen darüber (Stiefel über der Hose)
    if (kleid) { if (schuh && !ohneBeine) s += schuh.teil(o.schuhe.farbe); s += kleid.rock(o.kleid.farbe); }
    else { if (unter) s += unter.teil(o.unterteil.farbe); if (schuh) s += schuh.teil(o.schuhe.farbe); }
    if (kleid) s += kleid.rumpf(o.kleid.farbe);
    else if (ober) s += ober.rumpf(o.oberteil.farbe);
    s += P.koerper.arme(haut);
    if (kleid) s += kleid.aermel(o.kleid.farbe);
    else if (ober) s += ober.aermel(o.oberteil.farbe);
    s += ex("hand") + ex("hals");
    s += P.koerper.kopf(haut) + gesicht.teil();
    if (haar) s += haar.vorne(o.haare.farbe);
    s += ex("kopf");
    return s;
  }
  function zeichneBild(o) {
    const ort = finde(P.orte, o.ort) || P.orte[0];
    return ort.teil() + `<g transform="translate(80 0)"><g class="hopser">${zeichneFigur(o)}</g></g>`;
  }

  // Nur die Figur ohne Hintergrund, z. B. für kleine Porträts
  function zeichnePortraet(o) { return `<svg viewBox="40 0 220 330" aria-hidden="true">${zeichneFigur(o)}</svg>`; }
  window.Figur = { STANDARD, zeichneFigur, zeichneBild, zeichnePortraet };
})();
