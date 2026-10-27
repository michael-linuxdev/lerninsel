// Lernkartei für Deutsch und Sachunterricht (Mathe hat ihre eigene in spiele/mathe/mathe.js, gleiche Abstände).
// Beim ersten Fehler wird der Schritt (reine Daten aus geschichte.js / werkstatt.js / themen.js) gemerkt.
// Fällige Karten kommen als kurze Wiederholung an den Anfang des nächsten Kapitels/Themas:
// falsch → morgen, dann nach 3 und 7 Tagen; dreimal (an verschiedenen Tagen) richtig = gemeistert → goldener Lernfund.
// Daten: profil.daten.lernkartei = { deutsch: [karte], sachkunde: [karte], lesen: [karte] }
// karte = { k: Schlüssel, s: Schritt, stufe, faellig }
(function () {
  const S = window.Spielwelt; if (!S) return;
  const ABSTAND = [0, 1, 3, 7], MAX = 40;
  const pad = (n) => String(n).padStart(2, "0");
  const tagIn = (n) => { const d = window.__heute ? new Date(window.__heute) : new Date(); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  // Nur Schritte, die ohne ihr Kapitel verständlich sind
  const GEEIGNET = { deutsch: ["artikel", "bild", "hoeren", "wort", "luecke", "wo", "wortart", "verlaengern", "silben", "satz"], sachkunde: ["wahl", "daumen"],
    lesen: ["anlaut", "silbenwort", "schreibwort"] };   // lesen: spiele/lesen/ (NA-30/31), Schritte { typ: "anlaut", wort, ziel } und { typ: "silbenwort", wort }
  const schluessel = (s) => [s.typ, s.wort, s.frage, s.satz, s.sag].filter(Boolean).join("|").slice(0, 120);

  function lade() { return Object.assign({ deutsch: [], sachkunde: [] }, S.lade("lernkartei") || {}); }
  const speichere = (d) => S.speichere("lernkartei", d);
  const geeignet = (fach, s) => !!s && (GEEIGNET[fach] || []).includes(s.typ) && !s.baum;

  // Erster Fehler bei einem Schritt (auch bei einer Wiederholung: zurück auf Anfang)
  function falsch(fach, schritt) {
    if (!geeignet(fach, schritt)) return;
    const d = lade(), k = schluessel(schritt), l = d[fach] = (d[fach] || []).filter(x => x.k !== k);
    const s = Object.assign({}, schritt); delete s.__karte;
    l.push({ k, s, stufe: 1, faellig: tagIn(ABSTAND[1]) });
    d[fach] = l.slice(-MAX); speichere(d);
  }
  // Wiederholung beim ersten Versuch richtig. Rückgabe true = gemeistert
  function richtig(fach, schritt) {
    const d = lade(), k = schluessel(schritt), l = d[fach] || [], c = l.find(x => x.k === k);
    if (!c) return false;
    const stufe = (c.stufe || 1) + 1;
    if (stufe >= ABSTAND.length) { d[fach] = l.filter(x => x !== c); speichere(d); return true; }
    c.stufe = stufe; c.faellig = tagIn(ABSTAND[stufe]); speichere(d); return false;
  }
  // Fällige Karten als Schritte (markiert mit __karte), älteste zuerst
  function faellige(fach, n = 3) {
    const h = tagIn(0);
    return (lade()[fach] || []).filter(c => !c.faellig || c.faellig <= h).sort((a, b) => (a.faellig || "").localeCompare(b.faellig || ""))
      .slice(0, n).map(c => Object.assign({}, c.s, { __karte: true }));
  }
  const anzahl = (fach) => (lade()[fach] || []).length;
  const anzahlFaellig = (fach) => faellige(fach, MAX).length;

  window.Lernkartei = { falsch, richtig, faellige, anzahl, anzahlFaellig, geeignet };
})();
