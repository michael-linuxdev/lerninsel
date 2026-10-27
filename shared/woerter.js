// Wortschatz (NA-40): liest den Wortschatz-Kern aus inhalte/woerter/*.js (window.WORTSCHATZ_DATEN) und bietet
//   window.Wortschatz – wort(id), alle(), feld(thema), daz("d0"), saetze("d0"), tagesWoerter(), hilfe(wort|satz), artikel(a)
//   window.WOERTER    – alte Form für „Wort des Tages“ ({ w, a, p, e, ru }, gleiche Reihenfolge wie vorher)
// Einbinden: zuerst inhalte/woerter/bestand.js und d0.js, dann diese Datei.
(function () {
  const DATEN = window.WORTSCHATZ_DATEN || [];
  const woerter = [], saetze = [], nachId = {};

  function status(eintrag, datei) { return Object.assign({}, datei.status || {}, eintrag.status || {}); }
  DATEN.forEach(datei => {
    (datei.woerter || []).forEach(w => {
      if (nachId[w.id]) throw new Error("Wortschatz: doppelte ID " + w.id);
      const x = Object.assign({ artikel: null, mehrzahl: null, wortart: w.artikel ? "nomen" : "wort", themen: [], stufe: ["vs", "1", "2"],
        daz: datei.daz || null, ton: w.id }, w);
      x.silben = String(w.silben || w.de).split("-");
      x.status = status(w, datei);
      woerter.push(x); nachId[x.id] = x;
    });
    (datei.saetze || []).forEach(s => {
      const x = Object.assign({ daz: datei.daz || null, ton: s.id, woerter: [] }, s);
      x.status = status(s, datei);
      saetze.push(x); nachId[x.id] = x;
    });
  });
  // Ergänzungen (z. B. Ukrainisch für Bestandswörter) mit dem Status der Datei, die sie liefert
  DATEN.forEach(datei => Object.entries(datei.ergaenzungen || {}).forEach(([id, felder]) => {
    const w = nachId[id]; if (!w) throw new Error("Wortschatz: Ergänzung für unbekanntes Wort " + id);
    Object.entries(felder).forEach(([k, v]) => { w[k] = v; if (datei.status && datei.status[k] && !(w.status[k])) w.status[k] = datei.status[k]; });
  }));

  // Artikel mit Farbe UND Form (funktioniert auch bei Farbschwäche): der ■ blau, die ● rot, das ▲ grün
  const ARTIKEL = {
    der: { farbe: "#2F6FD6", form: "■", name: "der" },
    die: { farbe: "#D7263D", form: "●", name: "die" },
    das: { farbe: "#2E9C5A", form: "▲", name: "das" }
  };

  // Hilfe in der Sprache des Kindes; Entwürfe nur außerhalb der Hauptseite (wie bei den Szenen)
  function hilfe(eintrag) {
    const S = window.Spielwelt; const h = S && S.hilfe && S.hilfe();
    if (!h || !eintrag || !eintrag[h.code]) return null;
    const st = (eintrag.status || {})[h.code] || "entwurf";
    if (st === "entwurf" && S.umgebung === "prod") return null;
    const name = (S.profil && S.profil.name) || "";
    return { text: String(eintrag[h.code]).replace(/\{name\}/g, name), sprache: h, entwurf: st === "entwurf" };
  }

  window.Wortschatz = {
    ARTIKEL,
    wort: (id) => nachId[id] || null,
    alle: () => woerter.slice(),
    feld: (thema) => woerter.filter(w => w.themen.includes(thema)),
    daz: (stufe) => woerter.filter(w => w.daz === stufe),
    saetze: (stufe) => saetze.filter(s => !stufe || s.daz === stufe),
    tagesWoerter: () => woerter.filter(w => w.tag),
    hilfe,
    mitArtikel: (w) => (w.artikel ? w.artikel + " " : "") + w.de
  };

  // Alte Form für „Wort des Tages“ (spiele/ich/)
  window.WOERTER = woerter.filter(w => w.tag).map(w => ({ w: w.de, a: w.artikel, p: w.mehrzahl, e: w.bild, ru: w.ru, id: w.id }));
})();
