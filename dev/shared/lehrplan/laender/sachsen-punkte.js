// Sachsen in voller Tiefe („wie ein Schuljahr“, Entscheidung 27.10.2026): Inhaltspunkte je Lernbereich, aus dem Lehrplantext zusammengefasst
// (nie wörtlich), mit Zuordnung zu Inhalten der App. Ergänzt das Profil aus sachsen.js um `punkte` – darum NACH sachsen.js und VOR
// shared/lehrplan.js laden.
// Punkt: [id, Text, Klasse ("1" | "2" | "1/2" | "3" | "4"), app[], abdeckung]
//   abdeckung: "ja" = in der App geübt · "teil" = teilweise · "nein" = fehlt noch · "aussen" = gehört nach draußen/aufs Papier
//   (Zeichnen mit Lineal und Zirkel, echtes Messen, Bauen) – dafür gibt es Echte-Welt-Aufgaben, die App übt es nicht selbst.
// Quellen: Mathematik 2025 (Lehrplan Grundschule Sachsen, Fassung 2025, gültig ab 1.8.2025; vom Auftraggeber als PDF bereitgestellt).
(function () {
  const P = window.LehrplanLaender && window.LehrplanLaender.sn; if (!P) return;
  const PUNKTE = {
    mathe: {
      "1/2": {
        1: [ // Raum und Form
          ["sn.ma12.rf.01", "Rechts und links am eigenen Körper unterscheiden", "1", ["mathe:lage", "echtewelt:rechtslinks"], "teil"],
          ["sn.ma12.rf.02", "Lage zwischen Dingen beschreiben: oben, unten, über, unter, links, rechts, neben, zwischen", "1/2", ["mathe:lage"], "ja"],
          ["sn.ma12.rf.03", "Vorn, hinten, vor, hinter im Raum", "1/2", ["mathe:wuerfelbau2"], "teil"],
          ["sn.ma12.rf.04", "Würfelgebäude frei und nach Bauplan bauen, eigene Baupläne finden", "2", ["mathe:wuerfelbau2", "echtewelt:bauplan"], "teil"],
          ["sn.ma12.rf.05", "Wege nach Beschreibung gehen, sichtbare Wege und Wege aus der Vorstellung beschreiben", "2", ["mathe:wege"], "ja"],
          ["sn.ma12.rf.06", "Linie, Punkt, Gerade, Strahl und Strecke unterscheiden", "2", ["mathe:linien"], "ja"],
          ["sn.ma12.rf.07", "Linien und Figuren zeichnen – frei, mit Lineal, Schablone und Geodreieck", "1/2", ["echtewelt:lineal"], "aussen"],
          ["sn.ma12.rf.08", "Parallel, senkrecht, schneiden sich, rechter Winkel (Faltwinkel)", "2", ["mathe:linien"], "ja"],
          ["sn.ma12.rf.09", "Ebene Figuren erkennen, benennen und vergleichen: Dreieck, Viereck, Rechteck, Quadrat, Vieleck, Kreis", "1/2", ["mathe:formen", "mathe:figuren"], "ja"],
          ["sn.ma12.rf.10", "Ebene Figuren zeichnen, auch Kreise mit dem Zirkel", "2", ["echtewelt:zirkel"], "aussen"],
          ["sn.ma12.rf.11", "Kreis: Mittelpunkt, Radius und Durchmesser (doppelt so lang)", "2", ["mathe:figuren"], "ja"],
          ["sn.ma12.rf.12", "Geometrische Muster erkennen und fortsetzen", "1/2", ["mathe:k1muster", "mathe:spiegeln2"], "ja"],
          ["sn.ma12.rf.13", "Figuren auslegen und nachlegen (z. B. Tangram)", "1/2", [], "nein"],
          ["sn.ma12.rf.14", "Körper Würfel, Quader, Kugel erkennen und vergleichen: Ecken, Kanten, Flächen, rund, eckig", "1/2", ["mathe:formen", "mathe:figuren"], "ja"],
          ["sn.ma12.rf.15", "Spiegelungen und Symmetrie entdecken, Symmetrieachsen erkennen, spiegelbildlich ergänzen", "2", ["mathe:spiegeln2"], "ja"]
        ],
        2: [ // Zahl und Operation
          ["sn.ma12.zo.01", "Zahlen bis 100 lesen, sprechen und schreiben – mit Ziffern und als Zahlwort", "1/2", ["mathe:zahlen100"], "ja"],
          ["sn.ma12.zo.02", "Zahlen als Anzahl und als Platz in einer Reihe verstehen", "1", ["mathe:k1zaehlen", "mathe:zahlen100"], "ja"],
          ["sn.ma12.zo.03", "Mengen schnell und strukturiert erfassen, ordnen, vergleichen und zerlegen (Zwanziger- und Hunderterfeld)", "1/2", ["mathe:k1wuerfel", "mathe:k1zwanzig", "mathe:k1zerlegen", "mathe:zahlen100"], "ja"],
          ["sn.ma12.zo.04", "Vorwärts, rückwärts und in Schritten zählen; Vorgänger, Nachfolger, Nachbarzehner", "1/2", ["mathe:k1nachbar", "mathe:zahlen100"], "ja"],
          ["sn.ma12.zo.05", "Zahlen vergleichen und ordnen (<, >, =), gerade und ungerade Zahlen", "1/2", ["mathe:vergleich", "mathe:gerade"], "ja"],
          ["sn.ma12.zo.06", "Das Doppelte und die Hälfte", "1/2", ["mathe:k1doppelt", "mathe:doppelt"], "ja"],
          ["sn.ma12.zo.07", "Bündeln, Stellenwerte Hunderter, Zehner, Einer, Bedeutung der Null", "2", ["mathe:zehner", "mathe:zahlen100"], "ja"],
          ["sn.ma12.zo.08", "Zwischen Handlung, Bild, Sprache, Zeichen und Sachsituation wechseln", "1/2", ["mathe:zahlen100", "mathe:detektiv"], "teil"],
          ["sn.ma12.zo.09", "Plus und Minus verstehen: hinzufügen, vereinigen, wegnehmen, ergänzen, Unterschied", "1", ["mathe:k1plus10", "mathe:k1minus10", "mathe:ergaenzen", "mathe:detektiv"], "ja"],
          ["sn.ma12.zo.10", "Grundaufgaben plus und minus bis 20 sicher können", "1", ["mathe:plus20", "mathe:minus20"], "ja"],
          ["sn.ma12.zo.11", "Plus und Minus bis 100 mit Strategien: schrittweise, Tausch-, Umkehr-, Nachbaraufgaben, gleich- und gegensinnig verändern", "2", ["mathe:plus100", "mathe:minus100", "mathe:plusUeber", "mathe:minusUeber", "mathe:rechentricks"], "ja"],
          ["sn.ma12.zo.12", "Lösungswege vergleichen, begründen und mit der Umkehraufgabe prüfen", "2", ["mathe:rechentricks"], "teil"],
          ["sn.ma12.zo.13", "Platzhalter, Gleichungen und Ungleichungen", "1/2", ["mathe:ergaenzen", "mathe:zahlenmauer"], "ja"],
          ["sn.ma12.zo.14", "Zahlenfolgen und Formate wie Zahlenmauern, Zauberquadrate, Entdeckerpäckchen", "1/2", ["mathe:zahlenmauer"], "teil"],
          ["sn.ma12.zo.15", "Mal und geteilt verstehen: vervielfachen, verteilen, aufteilen, Punktefelder", "2", ["mathe:mal1", "mathe:geteilt", "mathe:detektiv"], "ja"],
          ["sn.ma12.zo.16", "Alle Mal- und Geteiltaufgaben bis 100 mit Strategien (Kern-, Tausch-, Umkehr-, Nachbaraufgaben, Quadratzahlen)", "2", ["mathe:mal2", "mathe:mal3", "mathe:rechentricks", "mathe:quadratzahlen"], "ja"],
          ["sn.ma12.zo.17", "Kernaufgaben mit 2, 5 und 10 sicher können", "2", ["mathe:mal1"], "ja"],
          ["sn.ma12.zo.18", "Fachbegriffe: Summe, Summand, Differenz, Minuend, Subtrahend, Produkt, Faktor, Quotient …", "2", ["mathe:matheworte"], "ja"],
          ["sn.ma12.zo.19", "Sachaufgaben: Fragen stellen, fehlende oder zu viele Angaben erkennen, passende Rechnung finden, Menge und Preis", "2", ["mathe:sachaufgaben", "mathe:detektiv"], "ja"],
          ["sn.ma12.zo.20", "Rechengeschichten zu Aufgaben erfinden", "2", ["mathe:detektiv"], "teil"],
          ["sn.ma12.zo.21", "Muster und Strategien in Spielen beschreiben (Nim-Spiel, Würfelspiele)", "2", ["mathe:detektiv"], "teil"]
        ],
        3: [ // Größen und Messen
          ["sn.ma12.gm.01", "Geld: Euro und Cent erfassen, vergleichen, ordnen, auch mit Komma", "1/2", ["mathe:geld", "mathe:euro"], "ja"],
          ["sn.ma12.gm.02", "Geld: Preise kennen (Stützpunkte), wechseln, umrechnen", "2", ["mathe:euro"], "ja"],
          ["sn.ma12.gm.03", "Geld: einfache Sachaufgaben", "2", ["mathe:euro", "mathe:sachaufgaben"], "ja"],
          ["sn.ma12.gm.04", "Länge: mm, cm, dm, m mit einer und zwei Einheiten und mit Komma", "2", ["mathe:laenge", "mathe:massband"], "ja"],
          ["sn.ma12.gm.05", "Längen mit Lineal und Maßband messen", "2", ["mathe:laenge", "echtewelt:messen"], "teil"],
          ["sn.ma12.gm.06", "Längen: Stützpunkte, schätzen, umrechnen, Sachaufgaben", "2", ["mathe:laenge", "mathe:massband"], "ja"],
          ["sn.ma12.gm.07", "Uhren und Kalender als Zeitmesser", "1/2", ["mathe:uhr", "mathe:kalender"], "ja"],
          ["sn.ma12.gm.08", "Zeitspannen: Minuten, Stunden, Tag, Woche, Monat, Jahr; halbe und Viertelstunde", "2", ["mathe:kalender", "mathe:zeitspanne"], "ja"],
          ["sn.ma12.gm.09", "Uhrzeit auf 5 Minuten genau lesen, Datum am Kalender", "2", ["mathe:uhr", "mathe:zeitspanne"], "ja"],
          ["sn.ma12.gm.10", "Zeitspannen schätzen, umrechnen, Sachaufgaben (volle Stunden, innerhalb einer Stunde)", "2", ["mathe:zeitspanne"], "ja"]
        ],
        4: [ // Daten und Zufall
          ["sn.ma12.dz.01", "Daten sammeln und ordnen: Umfragen, Strichlisten", "1/2", ["mathe:daten", "mathe:tabelle", "echtewelt:umfrage"], "teil"],
          ["sn.ma12.dz.02", "Tabellen anlegen und ausfüllen, Fachbegriffe Zeile, Spalte", "2", ["mathe:tabelle"], "teil"],
          ["sn.ma12.dz.03", "Säulen- und Balkendiagramm anlegen", "2", ["mathe:tabelle"], "ja"],
          ["sn.ma12.dz.04", "Werte aus Tabellen und Schaubildern ablesen und vergleichen", "1/2", ["mathe:daten", "mathe:tabelle"], "ja"],
          ["sn.ma12.dz.05", "Kombinationen finden und darstellen", "2", ["mathe:kombinieren2"], "ja"],
          ["sn.ma12.dz.06", "Einfache Zufallsexperimente: sicher, möglich, unmöglich", "2", ["mathe:zufall"], "ja"]
        ]
      }
    }
  };
  Object.entries(PUNKTE).forEach(([fach, stufen]) => Object.entries(stufen).forEach(([st, lbs]) => Object.entries(lbs).forEach(([nr, liste]) => {
    const lb = (((P.faecher[fach] || {}).stufen || {})[st] || []).find(x => x.nr === +nr);
    if (lb) lb.punkte = liste.map(([id, text, kl, app, abdeckung]) => ({ id, text, kl, app, abdeckung }));
  })));
})();
