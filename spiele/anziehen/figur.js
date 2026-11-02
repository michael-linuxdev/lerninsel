// Zeichnet die Figur aus einem gespeicherten Look – gemeinsam für Anziehspiel, „Meine Ecke“ und andere Seiten.
// Braucht teile.js (window.Puppe).
(function () {
  // 03.11.2026: neue Kinderfigur (kind.js + teile2.js = window.Puppe2) ist Standard; Eltern-Schalter „Zeichnungen wie bis 02.11.2026“
  // (eltern.zeichnung = "alt") zeigt die alte Figur aus teile.js. Gespeicherte Looks gelten für beide (gleiche Teile-IDs).
  const altGewaehlt = () => { try { return !!(window.Spielwelt && Spielwelt.lade && (Spielwelt.lade("eltern") || {}).zeichnung === "alt"); } catch (e) { return false; } };
  const P = (!altGewaehlt() && window.Puppe2) || window.Puppe;
  const HAUT = ["#FFE0C7", "#F6C9A3", "#E8B08A", "#C98D63", "#A0694A", "#6E4630"];
  const HAARFARBEN = ["#F4CD6A", "#D9A04E", "#A8693A", "#5C3A21", "#2A2230", "#C9542B", "#FF8CC6", "#9B6BE0", "#4FA8F0", "#6ED8B8"];
  const geschlecht = () => (window.Spielwelt && window.Spielwelt.kind ? window.Spielwelt.kind().geschlecht : "n") || "n";
  // Startfigur je Ansprache aus der Ersteinrichtung (02.11.2026 deutlicher verschieden):
  // Junge: Seitenscheitel, Raketen-Shirt, Cargohose, Sneaker – Mädchen: lange Haare mit Schleife, Herz-Shirt, Tüllrock, Ballerinas – ohne Angabe wie bisher.
  const STANDARD = (g = geschlecht()) => g === "m" ? {
    ort: "zimmer", figur: { id: "laecheln", farbe: HAUT[1] }, haare: { id: "scheitel", farbe: HAARFARBEN[2] },
    oberteil: { id: "raketenshirt", farbe: "#2E6FB8" }, unterteil: { id: "cargo", farbe: "#6B8E4E" }, kleid: null, schuhe: { id: "sneaker", farbe: "#E8463B" }, extras: {}
  } : g === "w" ? {
    ort: "zimmer", figur: { id: "laecheln", farbe: HAUT[1] }, haare: { id: "lang", farbe: HAARFARBEN[2] },
    oberteil: { id: "herzshirt", farbe: "#FF9BC8" }, unterteil: { id: "tuell", farbe: "#B58CF0" }, kleid: null, schuhe: { id: "ballerina", farbe: "#E0457B" }, extras: { schleife: { farbe: "#FF6F9F" } }
  } : {
    ort: "zimmer", figur: { id: "laecheln", farbe: HAUT[1] }, haare: { id: "lang", farbe: HAARFARBEN[2] },
    oberteil: { id: "tshirt", farbe: "#FF9BC8" }, unterteil: { id: "rock", farbe: "#7B55B8" }, kleid: null, schuhe: { id: "turn", farbe: "#FFFFFF" }, extras: {}
  };

  const finde = (liste, id) => liste.find(t => t.id === id);

  // ---------- Zeichnen ----------
  function zeichneFigur(o) {
    if (P.neu) { P.setzeForm(o.figur.form || geschlecht()); return P.zeichneFigur(o); }
    const haut = o.figur.farbe;
    if (P.setzeForm) P.setzeForm(o.figur.form || geschlecht());   // Gesicht und Kopfform nach Junge/Mädchen
    const haar = o.haare && finde(P.haare, o.haare.id);
    const ober = o.oberteil && finde(P.oberteile, o.oberteil.id);
    const unter = o.unterteil && finde(P.unterteile, o.unterteil.id);
    const kleid = o.kleid && finde(P.kleider, o.kleid.id);
    const schuh = o.schuhe && finde(P.schuhe, o.schuhe.id);
    const gesicht = finde(P.gesichter, o.figur.id) || P.gesichter[0];
    const ex = (ebene) => P.extras.filter(e => e.ebene === ebene && o.extras[e.id]).map(e => e.teil(o.extras[e.id].farbe)).join("");

    // Normale Proportionen (02.11.2026, Wunsch des Auftraggebers; das Kindchenschema vom 01.11. mit großem Kopf ist zurückgenommen).
    // Kopf und Körper bleiben getrennte Gruppen, damit sich die Proportionen später an einer Stelle ändern lassen.
    const KOPF = "", KOERPER = "";
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
    if (P.setzeForm) P.setzeForm(o.figur.form || geschlecht());   // auch das Zimmer im Hintergrund
    const ort = finde(P.orte, o.ort) || P.orte[0];
    return ort.teil() + `<g transform="translate(80 ${P.FIGUR_Y || 0})"><g class="hopser">${zeichneFigur(o)}</g></g>`;
  }

  // Nur die Figur ohne Hintergrund, z. B. für kleine Porträts
  function zeichnePortraet(o) { return `<svg viewBox="${P.neu ? "40 0 220 330" : "40 0 220 330"}" aria-hidden="true">${zeichneFigur(o)}</svg>`; }
  // Ausschnitte: KOPF = Kopf und Schultern (quadratisch), BUESTE = bis zum Bauch
  const KOPF = P.KOPF || "50 34 200 200", BUESTE = P.BUESTE || "40 20 220 280";
  window.Figur = { STANDARD, zeichneFigur, zeichneBild, zeichnePortraet, KOPF, BUESTE, P, neu: !!P.neu };
})();
