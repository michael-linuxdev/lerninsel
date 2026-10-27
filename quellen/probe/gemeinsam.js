// Gemeinsame Helfer für Probeszenen anderer Engines (Grafik-Entscheidung NA-20, 27.10.2026).
// Messwerte unten links: Bilder/s, Zeichenaufrufe und Dreiecke (über WebGL mitgezählt), Download der Engine.

// Zeichenaufrufe und Dreiecke für alle Engines gleich zählen: WebGL-Aufrufe mitzählen (wird beim Laden aktiviert,
// bevor eine Engine ihren Zeichenkontext anlegt). zaehler.neuesBild() schließt ein Bild ab.
export const zaehler = { aufrufe: 0, dreiecke: 0, letzt: { zeichnungen: 0, dreiecke: 0 }, neuesBild() { this.letzt = { zeichnungen: this.aufrufe, dreiecke: this.dreiecke }; this.aufrufe = 0; this.dreiecke = 0; } };
(function () {
  const dreieck = (modus, n) => (modus === 4 ? n / 3 : modus === 5 || modus === 6 ? Math.max(0, n - 2) : 0);
  for (const K of [window.WebGLRenderingContext, window.WebGL2RenderingContext]) {
    if (!K) continue;
    const p = K.prototype;
    for (const [name, nPos, iPos] of [["drawArrays", 2, -1], ["drawElements", 1, -1], ["drawArraysInstanced", 2, 3], ["drawElementsInstanced", 1, 4], ["drawRangeElements", 3, -1]]) {
      const alt = p[name]; if (!alt) continue;
      p[name] = function (...a) { zaehler.aufrufe++; zaehler.dreiecke += dreieck(a[0], a[nPos]) * (iPos >= 0 ? a[iPos] : 1); return alt.apply(this, a); };
    }
  }
})();

// Größe des Engine-Bündels (aus den Ladezeiten des Browsers)
export function downloadKB(datei) {
  const e = performance.getEntriesByType("resource").find(r => r.name.includes(datei));
  if (!e) return null;
  return Math.round((e.encodedBodySize || e.transferSize || e.decodedBodySize || 0) / 1024);
}

// Messanzeige; holeAufrufe() liefert Zeichenaufrufe des letzten Bildes (oder null)
export function messung(name, datei, holeAufrufe = () => zaehler.letzt) {
  const el = document.getElementById("mess");
  let bilder = 0, seit = performance.now(), fps = 0, letzte = {};
  const start = performance.now();
  function tick() {
    zaehler.neuesBild();
    bilder++;
    const jetzt = performance.now();
    if (jetzt - seit > 1000) {
      fps = Math.round(bilder * 1000 / (jetzt - seit)); bilder = 0; seit = jetzt;
      letzte = Object.assign({ fps, kb: downloadKB(datei) }, holeAufrufe ? holeAufrufe() : {});
      if (el) el.textContent = `${name} · ${fps} Bilder/s` + (letzte.zeichnungen != null ? ` · ${letzte.zeichnungen} Zeichenaufrufe` : "") +
        (letzte.dreiecke != null ? ` · ${Math.round(letzte.dreiecke / 1000)} Tsd. Dreiecke` : "") + (letzte.kb ? ` · Engine ${(letzte.kb / 1024).toFixed(1)} MB` : "");
    }
  }
  return { tick, info: () => Object.assign({ name, laufzeit: Math.round(performance.now() - start) }, letzte, holeAufrufe ? holeAufrufe() : {}, { kb: downloadKB(datei) }) };
}

// kleiner Zufall mit festem Startwert (alle Proben sehen gleich aus)
export function zufall(s = 7) { return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
