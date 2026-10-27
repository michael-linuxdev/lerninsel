// DaZ-Pfad (NA-40): Fortschritt in „Ankommen“ (D0) und Einstieg für Kinder mit wenig oder ohne Deutsch.
// Daten: profil.daten.daz = { w: { <wort-id>: richtig-Anzahl }, s: { <satz-id>: richtig-Anzahl } } – bewusst knapp (QR-Transfer).
// D0 gilt als geschafft, wenn mindestens 80 der 100 Wörter und 15 der 20 Sätze einmal richtig erkannt wurden.
// DaZ.einstieg() auf der Deutsch-Seite: Deutschstand „keine“ → weiter zu „Ankommen“, solange D0 nicht geschafft ist
// (mit ?karte=1 bleibt das Kind auf Fipsis Karte); bei „keine“ und „wenig“ steht oben ein Knopf zu „Ankommen“.
(function () {
  const S = window.Spielwelt; if (!S) return;
  const ZIEL = { woerter: 80, saetze: 15 };
  const lade = () => Object.assign({ w: {}, s: {} }, S.lade("daz") || {});
  const zahl = (o) => Object.values(o).filter(n => n > 0).length;

  function merke(art, id) {
    const d = lade(), feld = art === "satz" ? "s" : "w";
    const neu = !d[feld][id];
    d[feld][id] = Math.min(9, (d[feld][id] || 0) + 1);
    S.speichere("daz", d);
    return neu;
  }
  function stand() { const d = lade(); return { woerter: zahl(d.w), saetze: zahl(d.s), w: d.w, s: d.s }; }
  const d0Fertig = () => { const s = stand(); return s.woerter >= ZIEL.woerter && s.saetze >= ZIEL.saetze; };
  const deutschstand = () => (S.kind && S.kind().deutschstand) || "gut";
  const empfohlen = () => ["keine", "wenig"].includes(deutschstand()) && !d0Fertig();

  // Auf der Deutsch-Seite aufrufen (Pfad relativ zu spiele/deutsch/)
  function einstieg() {
    const q = new URLSearchParams(location.search);
    if (deutschstand() === "keine" && !d0Fertig() && !q.has("karte")) { location.replace("../daz/"); return true; }
    if (!empfohlen()) return false;
    const zeige = () => {
      const ziel = document.getElementById("karte-ansicht"); if (!ziel || document.getElementById("daz-knopf")) return;
      const a = document.createElement("a");
      a.id = "daz-knopf"; a.href = "../daz/"; a.className = "knopf haupt";
      a.style.cssText = "display:block;max-width:520px;margin:14px auto 0;text-align:center;text-decoration:none;font-size:1.2rem";
      a.textContent = "🧳 Ankommen – meine ersten deutschen Wörter";
      const kopf = ziel.querySelector(".oben"); if (kopf) kopf.after(a); else ziel.prepend(a);
    };
    if (document.readyState === "loading") addEventListener("DOMContentLoaded", zeige); else zeige();
    return false;
  }

  window.DaZ = { ZIEL, merke, stand, d0Fertig, empfohlen, einstieg, deutschstand };
})();
