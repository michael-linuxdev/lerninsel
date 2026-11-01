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

    // Kindchenschema (01.11.2026): Kopf 1,3-fach, Körper 0,9 × 0,66 um den Hals; danach alles nach unten, damit die Füße auf dem Boden bleiben
    // Körper breiter und kürzer (Kinderproportionen), am Ende alles 1,12-fach um die Füße (y 557), damit die Figur im Bild groß genug bleibt
    const GANZ = "translate(150 557) scale(1.12) translate(-150 -557) translate(0 132)";
    const HALS = "150 170", KOPF = `${GANZ} translate(${HALS}) scale(1.3) translate(-150 -170)`, KOERPER = `${GANZ} translate(${HALS}) scale(.9 .66) translate(-150 -170)`;
    let k = "";   // Körper und Kleidung
    k += ex("ruecken");
    const ohneBeine = !!(kleid && kleid.ohneBeine);
    k += P.koerper.hinten(haut, ohneBeine);
    if (!ober && !kleid) k += P.koerper.unterhemd();
    if (!unter && !kleid) k += P.koerper.unterhose();
    // Bei Kleidern liegen die Schuhe unter dem Rock, bei Hosen darüber (Stiefel über der Hose)
    if (kleid) { if (schuh && !ohneBeine) k += schuh.teil(o.schuhe.farbe); k += kleid.rock(o.kleid.farbe); }
    else { if (unter) k += unter.teil(o.unterteil.farbe); if (schuh) k += schuh.teil(o.schuhe.farbe); }
    if (kleid) k += kleid.rumpf(o.kleid.farbe);
    else if (ober) k += ober.rumpf(o.oberteil.farbe);
    k += P.koerper.arme(haut);
    if (kleid) k += kleid.aermel(o.kleid.farbe);
    else if (ober) k += ober.aermel(o.oberteil.farbe);
    k += ex("hand") + ex("hals");
    let kopf = P.koerper.kopf(haut) + gesicht.teil();
    if (haar) kopf += haar.vorne(o.haare.farbe);
    kopf += ex("kopf");
    let s = (haar ? `<g transform="${KOPF}">${haar.hinten(o.haare.farbe)}</g>` : "") + `<g transform="${KOERPER}">${k}</g><g transform="${KOPF}">${kopf}</g>`;
    return s;
  }
  function zeichneBild(o) {
    const ort = finde(P.orte, o.ort) || P.orte[0];
    return ort.teil() + `<g transform="translate(80 0)"><g class="hopser">${zeichneFigur(o)}</g></g>`;
  }

  // Nur die Figur ohne Hintergrund, z. B. für kleine Porträts
  function zeichnePortraet(o) { return `<svg viewBox="25 95 250 345" aria-hidden="true">${zeichneFigur(o)}</svg>`; }
  // Ausschnitte für das Kindchenschema (01.11.2026): KOPF = Kopf und Schultern (quadratisch), BUESTE = bis zum Bauch
  const KOPF = "48 92 204 204", BUESTE = "40 88 220 260";
  window.Figur = { STANDARD, zeichneFigur, zeichneBild, zeichnePortraet, KOPF, BUESTE };
})();
