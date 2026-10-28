// Inhalte-Verzeichnis (NA-03c): jeder Lerninhalt einmal beschrieben, mit Lernziel-IDs aus dem Lehrplan-Kern (shared/lehrplan/kern.js).
// Neue Inhalte: Inhalte.registriere({ id, fach, lz: ["de.le.02"], stufe?: ["vs","1"], laender?: null|["sn"], aufgaben: <Anzahl>,
//   aufgabenJe?: { "<lz>": <Anzahl> }, lernkartei: true|false, ... }) – Format siehe docs/LEHRPLAN.md „Inhalte als Daten“;
//   aufgaben darf eine Anzahl oder (wie in LEHRPLAN.md) die Liste der Aufgaben sein.
// Bestehende Inhalte (Matheweg, Fipsi, Werkstatt, Sachthemen, Führerschein …) werden mit Inhalte.ausBestand() aus ihren Daten
// gelesen, sofern die Datendateien auf der Seite geladen sind; sie tragen dafür nur ein Feld `lz` (nichts umgebaut).
// Abdeckung je Lernziel wird errechnet: "ja" ab 3 Inhalten mit zusammen ≥ 30 Aufgaben und Lernkartei, "teil" ab 1 Inhalt, sonst "nein".
(function () {
  const liste = [], nachId = {};
  const K = () => window.LernzielKern;
  const STUFEN = ["vs", "1", "2", "3", "4", "5"];

  function registriere(def) {
    if (!def || !def.id || !Array.isArray(def.lz)) throw new Error("Inhalte.registriere: id und lz nötig");
    const d = Object.assign({ laender: null, aufgaben: 0, lernkartei: false }, def);
    if (nachId[d.id]) liste.splice(liste.indexOf(nachId[d.id]), 1, d); else liste.push(d);
    nachId[d.id] = d;
    return d;
  }

  // Fipsis Geschichte mischt viele Übungen; dort ergibt sich das Lernziel aus dem Schritt-Typ.
  const TYP_LZ_GESCHICHTE = window.GESCHICHTE_LZ_TYP || {
    artikel: ["de.su.05", "daz.d0.03"], bild: ["de.su.03", "daz.d0.01"], wort: ["de.su.03"], hoeren: ["de.sz.04"],
    luecke: ["de.le.04"], satz: ["de.su.06", "de.le.04"], wo: ["de.su.07"]
  };
  const UEBUNG = (s) => s && !["sag", "info", "popup"].includes(s.typ);

  // Feste Angebote ohne eigene Aufgaben-Datei auf der Elternseite
  const STATISCH = [
    { id: "atelier:malen", fach: "kunst", lz: ["ku.ge.01", "ku.ge.02", "me.pp.01"], aufgaben: 14, quelle: "spiele/atelier/" },
    { id: "atelier:musik", fach: "musik", lz: ["mu.ho.01", "mu.ma.01", "mu.ma.02", "mu.ma.03"], aufgaben: 10, quelle: "spiele/atelier/musik.js" },
    { id: "gefuehle:alle", fach: "ethik", lz: ["et.ge.01", "et.ge.02", "et.mi.01", "sp.be.01", "sp.be.02"], aufgaben: 20, quelle: "spiele/gefuehle/" },
    { id: "wort:tag", fach: "deutsch", lz: ["de.su.03", "daz.d0.01"], aufgaben: 0, quelle: "shared/woerter.js" },
    { id: "insel:wetter", fach: "sachkunde", lz: ["su.na.04"], aufgaben: 0, quelle: "Wetterstation auf der Insel" },
    { id: "atelier:erkennen", fach: "musik", lz: ["mu.ho.01", "mu.ho.02"], aufgaben: 8, quelle: "spiele/atelier/musik.js (Ohren-Rätsel)" },
    { id: "atelier:verfremden", fach: "kunst", lz: ["ku.ge.02", "me.pp.01"], aufgaben: 8, quelle: "spiele/atelier/ (Bilder verfremden)" },
    { id: "vorlesen:alle", fach: "deutsch", lz: ["de.le.05", "de.sz.07"], stufe: ["1", "2", "3", "4"], aufgaben: 30, quelle: "spiele/vorlesen/ (Lautlesen, Lesetheater, Lesepass)" },
    { id: "praesentieren:alle", fach: "deutsch", lz: ["de.sc.07", "de.sz.07", "me.pp.01"], stufe: ["2", "3", "4"], aufgaben: 20, quelle: "spiele/praesentieren/ (gestalten, prüfen, Folien, Podcast, Wiki)" },
    { id: "robo:alle", fach: "werken", lz: ["me.ph.01", "su.te.05"], stufe: ["3", "4"], aufgaben: 13, quelle: "spiele/robo/ (Programmieren)" },
    { id: "daz:d0", fach: "deutsch", lz: ["daz.d0.01", "daz.d0.02", "daz.d0.03", "de.su.03"], stufe: ["vs", "1", "2", "3", "4"], aufgaben: 120, quelle: "spiele/daz/ (Ankommen)" }
  ];

  function ausBestand() {
    if (window.Mathe && Mathe.STATIONEN) Mathe.STATIONEN.concat(Mathe.STATIONEN_K1 || [], Mathe.STATIONEN_K3 || [], Mathe.STATIONEN_K4 || [], Mathe.STATIONEN_K5 || []).forEach(s => s.lz && registriere({
      id: "mathe:" + s.id, fach: "mathe", lz: s.lz, aufgaben: 50, lernkartei: true, titel: s.name, quelle: "bestand",
      stufe: s.stufe ? (s.stufe === "vs" ? ["vs", "1"] : [s.stufe]) : undefined }));
    (window.GESCHICHTE || []).forEach(k => {
      const je = {};
      k.schritte.forEach(s => (TYP_LZ_GESCHICHTE[s.typ] || []).forEach(z => { je[z] = (je[z] || 0) + 1; }));
      const lz = [...new Set([...Object.keys(je), ...(k.lz || [])])];
      registriere({ id: "deutsch:" + k.id, fach: "deutsch", lz, aufgabenJe: je, aufgaben: 0, lernkartei: true, titel: k.name, quelle: "bestand" });
    });
    const kapitel = (arr, vors, fach, lk) => (arr || []).forEach(k => k.lz && registriere({
      id: vors + k.id, fach, lz: k.lz, aufgaben: (k.schritte || []).filter(UEBUNG).length, lernkartei: lk, titel: k.name, quelle: "bestand",
      laender: k.land ? [k.land] : undefined }));
    kapitel(window.WERKSTATT, "werkstatt:", "deutsch", true);
    kapitel(window.THEMEN, "sachkunde:", "sachkunde", true);
    kapitel(window.LANDKREIS_THEMEN, "sachkunde:", "sachkunde", true);   // Landkreise Sachsen (nur nach Eltern-Wahl bzw. Sachsen-Quiz)
    (window.FACH_THEMEN || []).forEach(t => kapitel([t], "sachkunde:", t.fach, true));   // Kunst, Musik, Werken, Sport, Ethik (spiele/sachkunde/faecher.js)
    kapitel(window.LEKTIONEN, "medien:", "medien", false);
    (window.ENGLISCH || []).forEach(k => registriere({ id: "englisch:" + k.id, fach: "englisch", lz: k.lz, aufgaben: Math.min(6, k.woerter.length) + (k.extra || []).length,
      lernkartei: false, titel: k.name, quelle: "bestand", stufe: [String(k.stufe)] }));
    (window.SORBISCH || []).forEach(k => registriere({ id: "sorbisch:" + k.id, fach: "sorbisch", lz: k.lz, aufgaben: Math.min(6, k.woerter.length) + (k.extra || []).length,
      lernkartei: false, titel: k.name, quelle: "bestand", stufe: k.stufe < 3 ? ["1", "2"] : ["3", "4"] }));   // nur nach Eltern-Wahl sichtbar
    (window.SORBISCH_MUTTER || []).forEach(k => registriere({ id: "sorbisch:" + k.id, fach: "sorbisch", lz: k.lz, aufgaben: k.schritte.filter(x => x.typ !== "sag").length,
      lernkartei: false, titel: k.name, quelle: "bestand", stufe: k.stufe < 3 ? ["1", "2"] : [String(k.stufe)] }));   // Sorbisch als Muttersprache, nur nach Eltern-Wahl
    // Vorschul-Rucksack (spiele/vorschule/aufgaben.js): Bilder-Aufgaben für die Vorschule
    const VS_FACH = { mathe: "mathe", sprache: "deutsch", natur: "sachkunde", koerper: "sachkunde", sozial: "sachkunde", kunst: "kunst", schule: "sachkunde" };
    (window.VORSCHULE || []).forEach(a => registriere({ id: "vorschule:" + a.id, fach: VS_FACH[a.bereich] || "sachkunde", lz: a.lz, aufgaben: a.aufgaben.length,
      lernkartei: false, titel: a.name, quelle: "spiele/vorschule/", stufe: ["vs"] }));
    STATISCH.forEach(s => nachId[s.id] || registriere(Object.assign({ quelle: "bestand" }, s)));
  }

  // Stufe eines Lernziels für ein Land (Länder-Abweichung vor Kern)
  function zielStufe(id, land) {
    const L = (window.LehrplanLaender || {})[land], ab = L && L.abweichungen;
    if (ab && ab.stufe && ab.stufe[id]) return ab.stufe[id];
    const z = K() && K().ziel(id); if (z) return z.stufe;
    const ex = ab && (ab.extra || []).find(e => e[0] === id);
    return ex ? ex[1] : null;
  }
  // Stufen, für die ein Inhalt gedacht ist: ausdrücklich oder aus seinen Lernzielen
  function stufenVon(def, land) {
    if (def.stufe) return def.stufe;
    return [...new Set(def.lz.map(id => zielStufe(id, land)).filter(Boolean))];
  }
  // Passt der Inhalt zum Kind? Gleiche Stufe oder eine darunter (Wiederholung); Vorschule nur mit Vorschul-Inhalten.
  function passt(def, kind) {
    if (def.laender && kind.land && !def.laender.includes(kind.land)) return false;
    const i = STUFEN.indexOf(String(kind.stufe));
    return stufenVon(def, kind.land).some(s => { const j = STUFEN.indexOf(s); return j === i || (j === i - 1 && j >= 1); });
  }

  function zuLernziel(id) { return liste.filter(d => d.lz.includes(id)); }
  function abdeckung(id) {
    const inh = zuLernziel(id);
    if (!inh.length) return "nein";
    const zahl = (d) => Array.isArray(d.aufgaben) ? d.aufgaben.length : d.aufgaben || 0;   // aufgaben: Anzahl oder Liste (LEHRPLAN.md)
    const aufgaben = inh.reduce((n, d) => n + (d.aufgabenJe && d.aufgabenJe[id] != null ? d.aufgabenJe[id] : zahl(d)), 0);
    return inh.length >= 3 && aufgaben >= 30 && inh.some(d => d.lernkartei) ? "ja" : "teil";
  }

  window.Inhalte = {
    registriere, ausBestand, zuLernziel, abdeckung, stufenVon, zielStufe,
    alle: () => liste.slice(),
    get: (id) => nachId[id] || null,
    fuer: (kind) => liste.filter(d => passt(d, kind || {})),
    // Kern-Ziele (optional eines Fachs/einer Stufe), zu denen es noch keinen Inhalt gibt
    ohneInhalt: (filter = {}) => (K() ? K().alle() : []).filter(z => (!filter.fach || z.fach === filter.fach) &&
      (!filter.stufe || z.stufe === filter.stufe) && !zuLernziel(z.id).length)
  };
})();
