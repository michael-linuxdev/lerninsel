// Können je Lernziel (NA-50): ein kleiner Stand je Lernziel-ID aus shared/lehrplan/kern.js und die Auswahl der nächsten Übung.
// Daten (kompakt, QR-tauglich): profil.daten.koennen = { "<lz>": [q, n, f] }
//   q = Trefferquote beim ersten Versuch in Prozent (anfangs Mittelwert, dann gleitend über ≈ 12 Antworten), n = Anzahl, f = Fehler in Folge.
// Stand 0–4: 0 neu, 1 angefangen (q < 50), 2 übt (q ≥ 50), 3 sicher (q ≥ 75 und n ≥ 6), 4 gemeistert (q ≥ 90 und n ≥ 12).
// Auswahl: Ziel ist eine Trefferquote von 70–85 % (fordernd, aber machbar). Nach zwei Fehlern in Folge wird es leichter.
// Reine Logik (aktualisiere, stand, abstand, waehle, leichter) ist auch in Node nutzbar (tests/koennen.js).
(function () {
  const ZONE = [70, 85];
  const NAMEN = ["neu", "angefangen", "übt", "sicher", "gemeistert"];

  function aktualisiere(e, richtig) {
    // Mittelwert der ersten Antworten (ab einem vorsichtigen Startwert 70), danach gleitend über etwa die letzten 12 Antworten
    const [q = 70, n = 0, f = 0] = e || [];
    const nq = Math.round(q + ((richtig ? 100 : 0) - q) / Math.min(n + 2, 12));
    return [nq, Math.min(999, n + 1), richtig ? 0 : Math.min(9, f + 1)];
  }
  function stand(e) {
    if (!e || !e[1]) return 0;
    const [q, n] = e;
    if (q >= 90 && n >= 12) return 4;
    if (q >= 75 && n >= 6) return 3;
    return q >= 50 ? 2 : 1;
  }
  // Abstand zur Zielzone (0 = passt genau); neue Lernziele liegen knapp darunter, damit Neues drankommt, aber nicht vor allem anderen
  function abstand(e) {
    if (!e || !e[1]) return 12;
    const q = e[0];
    if (q >= ZONE[0] && q <= ZONE[1]) return 0;
    return q < ZONE[0] ? ZONE[0] - q : (q - ZONE[1]) * 1.5;
  }
  // kandidaten: [{ id, lz: [...] }, …] in Weg-Reihenfolge → die n passendsten (gleich gut: frühere zuerst)
  function waehle(kandidaten, daten, n = 1) {
    const d = daten || {};
    return kandidaten.map((k, i) => {
      const lz = k.lz && k.lz.length ? k.lz : [];
      const a = lz.length ? lz.reduce((s, z) => s + abstand(d[z]), 0) / lz.length : 12;
      const fertig = lz.length && lz.every(z => stand(d[z]) === 4);
      return { k, wert: a + (fertig ? 40 : 0) + i * 0.01 };
    }).sort((x, y) => x.wert - y.wert).slice(0, n).map(x => x.k);
  }
  const leichter = (daten, lz) => (lz || []).some(z => ((daten || {})[z] || [])[2] >= 2);

  const kern = { ZONE, NAMEN, aktualisiere, stand, abstand, waehle, leichter };
  if (typeof module !== "undefined" && module.exports) { module.exports = kern; return; }

  const S = window.Spielwelt; if (!S) return;
  const lade = () => S.lade("koennen") || {};
  window.Koennen = Object.assign({}, kern, {
    daten: lade,
    // Eine Antwort beim ersten Versuch melden (für alle Lernziele der Aufgabe)
    melde(lz, richtig) {
      if (!lz || !lz.length) return;
      const d = lade(); lz.forEach(z => { d[z] = aktualisiere(d[z], richtig); }); S.speichere("koennen", d);
    },
    standVon: (z) => stand(lade()[z]),
    // Durchschnittlicher Stand einer Liste von Lernzielen (für Lernbereiche), gerundet; null = noch nichts geübt
    standListe(lz) { const d = lade(), m = (lz || []).filter(z => d[z]); return m.length ? Math.round(m.reduce((s, z) => s + stand(d[z]), 0) / m.length) : null; },
    naechste: (kandidaten, n = 1) => waehle(kandidaten, lade(), n),
    brauchtLeichter: (lz) => leichter(lade(), lz)
  });
})();
