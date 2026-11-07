// Wörterbuch der Insel (07.11.2026, Kapitel 8 „Fipsis Schatz“): alle deutschen Wörter, die das Kind bei Fipsi hatte – vorhersehbar, kein Zufall.
// Quellen: Artikel-Wörter aus den geschafften Kapiteln der Schatzkarte (window.GESCHICHTE, spiele/deutsch/geschichte.js),
// die Lernkartei Deutsch und die Lernfunde Deutsch („Im Wald: die Eule, der Igel“, „Neues Wort: die Eiche“).
// Einmal gefundene Wörter bleiben (profil.daten.woerterbuch = { w: [[wort, artikel, emoji]] }, höchstens 400) – nichts geht verloren,
// auch wenn Lernfunde nach 60 Tagen und gemeisterte Karten aus der Lernkartei verschwinden.
// Nach core.js (und lernfunde.js, geschichte.js, wenn vorhanden) laden. Test-Haken: window.Woerterbuch.
(function () {
  const S = window.Spielwelt; if (!S) return;
  const MAX = 400, WORT = /^[A-ZÄÖÜ][A-Za-zÄÖÜäöüß-]{1,15}$/, ART = ["der", "die", "das"];
  function sammle() {
    const d = S.lade("woerterbuch") || {}, liste = Array.isArray(d.w) ? d.w.filter(x => Array.isArray(x) && WORT.test(x[0] || "")) : [];
    const da = new Map(liste.map(x => [x[0].toLowerCase(), x]));
    const dazu = (wort, artikel, e) => {
      wort = String(wort || "").trim(); if (!WORT.test(wort)) return;
      const k = wort.toLowerCase(), alt = da.get(k), a = ART.includes(artikel) ? artikel : "";
      if (alt) { if (!alt[1] && a) alt[1] = a; if (!alt[2] && e) alt[2] = e; return; }
      const neu = [wort, a, e || ""]; da.set(k, neu); liste.push(neu);
    };
    // 1. geschaffte Kapitel der Schatzkarte: Artikel-Schritte mit Bild
    const kap = ((S.lade("deutsch") || {}).kapitel) || {};
    (window.GESCHICHTE || []).filter(k => (kap[k.id] || 0) > 0).forEach(k => (k.schritte || []).forEach(s => { if (s.typ === "artikel") dazu(s.wort, s.richtig, s.e); }));
    // 2. Lernkartei Deutsch (auch die gerade geübten Wörter)
    (((S.lade("lernkartei") || {}).deutsch) || []).forEach(c => { const s = c.s || {}; dazu(typeof s.wort === "string" ? s.wort : (typeof c.k === "string" && c.k.startsWith("wort|") ? c.k.slice(5) : ""), s.richtig, s.e); });
    // 3. Lernfunde Deutsch
    const L = window.Lernfunde;
    if (L) L.letzteTage(60).filter(f => f.f === "deutsch").forEach(f => {
      const t = String(f.t || "");
      (t.match(/\b(der|die|das) ([A-ZÄÖÜ][a-zäöüß-]+)/g) || []).forEach(x => { const [a, w] = x.split(" "); dazu(w, a); });
      const m = /^Neues Wort: (der |die |das )?([A-ZÄÖÜ][A-Za-zäöüß-]+)/.exec(t); if (m) dazu(m[2], (m[1] || "").trim());
    });
    liste.sort((a, b) => a[0].localeCompare(b[0], "de"));
    const w = liste.slice(0, MAX);
    if (JSON.stringify(w) !== JSON.stringify(d.w || [])) S.speichere("woerterbuch", { w });
    return w.map(([wort, artikel, e]) => ({ wort, artikel, e }));
  }
  // nach Anfangsbuchstaben gruppiert (Ä zu A, Ö zu O, Ü zu U)
  function gruppen() {
    const g = {}, B = { Ä: "A", Ö: "O", Ü: "U" };
    sammle().forEach(x => { const b = B[x.wort[0].toUpperCase()] || x.wort[0].toUpperCase(); (g[b] = g[b] || []).push(x); });
    return Object.keys(g).sort().map(b => ({ buchstabe: b, woerter: g[b] }));
  }
  window.Woerterbuch = { sammle, gruppen };
})();
