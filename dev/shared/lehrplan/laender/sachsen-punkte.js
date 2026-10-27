// Sachsen in voller Tiefe („wie ein Schuljahr“, Entscheidung 27.10.2026): Inhaltspunkte je Lernbereich, aus dem Lehrplantext zusammengefasst
// (nie wörtlich), mit Zuordnung zu Inhalten der App. Ergänzt das Profil aus sachsen.js um `punkte` – darum NACH sachsen.js und VOR
// shared/lehrplan.js laden.
// Punkt: [id, Text, Klasse ("1" | "2" | "1/2" | "3" | "4"), app[], abdeckung]
//   abdeckung: "ja" = in der App geübt · "teil" = teilweise · "nein" = fehlt noch · "aussen" = gehört nach draußen/aufs Papier
//   (Zeichnen mit Lineal und Zirkel, echtes Messen, Bauen) – dafür gibt es Echte-Welt-Aufgaben, die App übt es nicht selbst.
// Quellen: Mathematik 2025 (Lehrplan Grundschule Sachsen, Fassung 2025, gültig ab 1.8.2025; vom Auftraggeber als PDF bereitgestellt), Kl. 1/2, 3 und 4.
(function () {
  const P = window.LehrplanLaender && window.LehrplanLaender.sn; if (!P) return;
  const PUNKTE = {
    mathe: {
      "1/2": {
        1: [ // Raum und Form
          ["sn.ma12.rf.01", "Rechts und links am eigenen Körper unterscheiden", "1", ["mathe:k1lage", "mathe:lage", "echtewelt:rechtslinks"], "teil"],
          ["sn.ma12.rf.02", "Lage zwischen Dingen beschreiben: oben, unten, über, unter, links, rechts, neben, zwischen", "1/2", ["mathe:k1lage", "mathe:lage"], "ja"],
          ["sn.ma12.rf.03", "Vorn, hinten, vor, hinter im Raum", "1/2", ["mathe:wuerfelbau2"], "teil"],
          ["sn.ma12.rf.04", "Würfelgebäude frei und nach Bauplan bauen, eigene Baupläne finden", "2", ["mathe:wuerfelbau2", "echtewelt:bauplan"], "teil"],
          ["sn.ma12.rf.05", "Wege nach Beschreibung gehen, sichtbare Wege und Wege aus der Vorstellung beschreiben", "2", ["mathe:wege"], "ja"],
          ["sn.ma12.rf.06", "Linie, Punkt, Gerade, Strahl und Strecke unterscheiden", "2", ["mathe:linien"], "ja"],
          ["sn.ma12.rf.07", "Linien und Figuren zeichnen – frei, mit Lineal, Schablone und Geodreieck", "1/2", ["echtewelt:lineal"], "aussen"],
          ["sn.ma12.rf.08", "Parallel, senkrecht, schneiden sich, rechter Winkel (Faltwinkel)", "2", ["mathe:linien"], "ja"],
          ["sn.ma12.rf.09", "Ebene Figuren erkennen, benennen und vergleichen: Dreieck, Viereck, Rechteck, Quadrat, Vieleck, Kreis", "1/2", ["mathe:k1formen", "mathe:formen", "mathe:figuren"], "ja"],
          ["sn.ma12.rf.10", "Ebene Figuren zeichnen, auch Kreise mit dem Zirkel", "2", ["echtewelt:zirkel"], "aussen"],
          ["sn.ma12.rf.11", "Kreis: Mittelpunkt, Radius und Durchmesser (doppelt so lang)", "2", ["mathe:figuren"], "ja"],
          ["sn.ma12.rf.12", "Geometrische Muster erkennen und fortsetzen", "1/2", ["mathe:k1muster", "mathe:spiegeln2"], "ja"],
          ["sn.ma12.rf.13", "Figuren auslegen und nachlegen (z. B. Tangram)", "1/2", [], "nein"],
          ["sn.ma12.rf.14", "Körper Würfel, Quader, Kugel erkennen und vergleichen: Ecken, Kanten, Flächen, rund, eckig", "1/2", ["mathe:k1formen", "mathe:formen", "mathe:figuren"], "ja"],
          ["sn.ma12.rf.15", "Spiegelungen und Symmetrie entdecken, Symmetrieachsen erkennen, spiegelbildlich ergänzen", "2", ["mathe:spiegeln2"], "ja"]
        ],
        2: [ // Zahl und Operation
          ["sn.ma12.zo.01", "Zahlen bis 100 lesen, sprechen und schreiben – mit Ziffern und als Zahlwort", "1/2", ["mathe:k1zahlen20", "mathe:zahlen100"], "ja"],
          ["sn.ma12.zo.02", "Zahlen als Anzahl und als Platz in einer Reihe verstehen", "1", ["mathe:k1zaehlen", "mathe:k1zahlen20", "mathe:zahlen100"], "ja"],
          ["sn.ma12.zo.03", "Mengen schnell und strukturiert erfassen, ordnen, vergleichen und zerlegen (Zwanziger- und Hunderterfeld)", "1/2", ["mathe:k1wuerfel", "mathe:k1zwanzig", "mathe:k1zerlegen", "mathe:zahlen100"], "ja"],
          ["sn.ma12.zo.04", "Vorwärts, rückwärts und in Schritten zählen; Vorgänger, Nachfolger, Nachbarzehner", "1/2", ["mathe:k1nachbar", "mathe:k1zahlen20", "mathe:zahlen100"], "ja"],
          ["sn.ma12.zo.05", "Zahlen vergleichen und ordnen (<, >, =), gerade und ungerade Zahlen", "1/2", ["mathe:k1vergleich", "mathe:vergleich", "mathe:gerade"], "ja"],
          ["sn.ma12.zo.06", "Das Doppelte und die Hälfte", "1/2", ["mathe:k1doppelt", "mathe:doppelt"], "ja"],
          ["sn.ma12.zo.07", "Bündeln, Stellenwerte Hunderter, Zehner, Einer, Bedeutung der Null", "2", ["mathe:zehner", "mathe:zahlen100"], "ja"],
          ["sn.ma12.zo.08", "Zwischen Handlung, Bild, Sprache, Zeichen und Sachsituation wechseln", "1/2", ["mathe:zahlen100", "mathe:detektiv"], "teil"],
          ["sn.ma12.zo.09", "Plus und Minus verstehen: hinzufügen, vereinigen, wegnehmen, ergänzen, Unterschied", "1", ["mathe:k1plus10", "mathe:k1minus10", "mathe:k1plus20", "mathe:ergaenzen", "mathe:detektiv"], "ja"],
          ["sn.ma12.zo.10", "Grundaufgaben plus und minus bis 20 sicher können", "1", ["mathe:k1plus20", "mathe:plus20", "mathe:minus20"], "ja"],
          ["sn.ma12.zo.11", "Plus und Minus bis 100 mit Strategien: schrittweise, Tausch-, Umkehr-, Nachbaraufgaben, gleich- und gegensinnig verändern", "2", ["mathe:plus100", "mathe:minus100", "mathe:plusUeber", "mathe:minusUeber", "mathe:rechentricks"], "ja"],
          ["sn.ma12.zo.12", "Lösungswege vergleichen, begründen und mit der Umkehraufgabe prüfen", "2", ["mathe:rechentricks"], "teil"],
          ["sn.ma12.zo.13", "Platzhalter, Gleichungen und Ungleichungen", "1/2", ["mathe:k1plus20", "mathe:k1vergleich", "mathe:ergaenzen", "mathe:zahlenmauer"], "ja"],
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
          ["sn.ma12.gm.01", "Geld: Euro und Cent erfassen, vergleichen, ordnen, auch mit Komma", "1/2", ["mathe:k1geld", "mathe:geld", "mathe:euro"], "ja"],
          ["sn.ma12.gm.02", "Geld: Preise kennen (Stützpunkte), wechseln, umrechnen", "2", ["mathe:euro"], "ja"],
          ["sn.ma12.gm.03", "Geld: einfache Sachaufgaben", "2", ["mathe:euro", "mathe:sachaufgaben"], "ja"],
          ["sn.ma12.gm.04", "Länge: direkt vergleichen; mm, cm, dm, m mit einer und zwei Einheiten und mit Komma", "1/2", ["mathe:k1messen", "mathe:laenge", "mathe:massband"], "ja"],
          ["sn.ma12.gm.05", "Längen mit Lineal und Maßband messen", "2", ["mathe:laenge", "echtewelt:messen"], "teil"],
          ["sn.ma12.gm.06", "Längen: Stützpunkte, schätzen, umrechnen, Sachaufgaben", "2", ["mathe:laenge", "mathe:massband"], "ja"],
          ["sn.ma12.gm.07", "Uhren und Kalender als Zeitmesser", "1/2", ["mathe:k1zeit", "mathe:uhr", "mathe:kalender"], "ja"],
          ["sn.ma12.gm.08", "Zeitspannen: Minuten, Stunden, Tag, Woche, Monat, Jahr; halbe und Viertelstunde", "2", ["mathe:kalender", "mathe:zeitspanne"], "ja"],
          ["sn.ma12.gm.09", "Uhrzeit auf 5 Minuten genau lesen, Datum am Kalender", "2", ["mathe:uhr", "mathe:zeitspanne"], "ja"],
          ["sn.ma12.gm.10", "Zeitspannen schätzen, umrechnen, Sachaufgaben (volle Stunden, innerhalb einer Stunde)", "2", ["mathe:zeitspanne"], "ja"]
        ],
        4: [ // Daten und Zufall
          ["sn.ma12.dz.01", "Daten sammeln und ordnen: Umfragen, Strichlisten", "1/2", ["mathe:k1daten", "mathe:daten", "mathe:tabelle", "echtewelt:umfrage"], "teil"],
          ["sn.ma12.dz.02", "Tabellen anlegen und ausfüllen, Fachbegriffe Zeile, Spalte", "2", ["mathe:tabelle"], "teil"],
          ["sn.ma12.dz.03", "Säulen- und Balkendiagramm anlegen", "2", ["mathe:tabelle"], "ja"],
          ["sn.ma12.dz.04", "Werte aus Tabellen und Schaubildern ablesen und vergleichen", "1/2", ["mathe:daten", "mathe:tabelle"], "ja"],
          ["sn.ma12.dz.05", "Kombinationen finden und darstellen", "2", ["mathe:kombinieren2"], "ja"],
          ["sn.ma12.dz.06", "Einfache Zufallsexperimente: sicher, möglich, unmöglich", "2", ["mathe:zufall"], "ja"]
        ]
      },
      "3": {
        1: [ // Raum und Form
          ["sn.ma3.rf.01", "Lagebeziehungen und Wege aus verschiedenen Blickwinkeln beschreiben, Pläne und Ansichten nutzen", "3", ["mathe:k3ansicht", "mathe:wege"], "teil"],
          ["sn.ma3.rf.02", "Würfelgebäude nach Bauplan und umgekehrt, verändern, zum Quader ergänzen, Würfel zählen", "3", ["mathe:k3wuerfelbau", "mathe:k3ansicht", "echtewelt:bauplan"], "ja"],
          ["sn.ma3.rf.03", "Parallele, senkrechte und sich schneidende Geraden millimetergenau zeichnen", "3", ["echtewelt:lineal"], "aussen"],
          ["sn.ma3.rf.04", "Parallelogramm und weitere Drei- und Vierecke erkennen, beschreiben, ergänzen", "3", ["mathe:k3vierecke"], "ja"],
          ["sn.ma3.rf.05", "Flächen vergleichen, zerlegen, auslegen, auszählen und schätzen; Umfang bestimmen", "3", ["mathe:k3flaeche", "mathe:k4flaeche"], "teil"],
          ["sn.ma3.rf.06", "Pyramide, Kegel, Zylinder erkennen, vergleichen, aus verschiedenen Blickwinkeln erkennen", "3", ["mathe:k3koerper"], "ja"],
          ["sn.ma3.rf.07", "Würfel- und Quadernetze herstellen, prüfen, beschreiben", "3", ["mathe:k3netz"], "teil"],
          ["sn.ma3.rf.08", "Bandornamente fortsetzen; Achsen-, Schiebe- und Drehsymmetrie nutzen", "3", ["mathe:k3ornament", "mathe:k3spiegel"], "ja"]
        ],
        2: [ // Zahl und Operation
          ["sn.ma3.zo.01", "Zahlen bis 1000 lesen, sprechen, schreiben, als Zahlwort", "3", ["mathe:k3stellen", "mathe:k3zahlen1000"], "ja"],
          ["sn.ma3.zo.02", "Zahlen bis 1000 bilden, zerlegen, in Schritten zählen, vergleichen, Nachbarzehner und -hunderter, Doppeltes und Hälfte", "3", ["mathe:k3zahlen1000"], "ja"],
          ["sn.ma3.zo.03", "Runden", "3", ["mathe:k3runden"], "ja"],
          ["sn.ma3.zo.04", "Stellenwerte Tausender, Hunderter, Zehner, Einer; Bündeln, Bedeutung der Null", "3", ["mathe:k3stellen", "mathe:k3zahlen1000"], "ja"],
          ["sn.ma3.zo.05", "Plus und Minus bis 1000 mit Strategien, Rechenwege vergleichen, Umkehrprobe", "3", ["mathe:k3plus", "mathe:k3minus", "mathe:k3vorteil"], "ja"],
          ["sn.ma3.zo.06", "Zahlenfolgen untersuchen, Zahlenmauern mit Zielzahl, Zahlenketten, Rechendreiecke", "3", ["mathe:k3muster"], "ja"],
          ["sn.ma3.zo.07", "Schriftliche Addition mit bis zu drei Summanden", "3", ["mathe:k3schriftplus", "mathe:k4plusviele"], "ja"],
          ["sn.ma3.zo.08", "Schriftliche Subtraktion", "3", ["mathe:k3schriftminus"], "ja"],
          ["sn.ma3.zo.09", "Mal und geteilt bis 1000: Vielfache von 10, Nachbaraufgaben, gleich-/gegensinnig verändern, Zerlegen", "3", ["mathe:k3malgeteilt", "mathe:k3sach"], "ja"],
          ["sn.ma3.zo.10", "Teilbarkeit, Division mit Rest, Teilbarkeitsregeln 2, 3, 5, 9, 10, 100, Quersumme", "3", ["mathe:k3rest", "mathe:k4teilbar", "mathe:k3muster"], "ja"],
          ["sn.ma3.zo.11", "Bruchteile bilden: Hälfte, Viertel, drei Viertel von …", "3", ["mathe:k3bruch"], "ja"],
          ["sn.ma3.zo.12", "Einmaleins automatisiert", "3", ["mathe:mal2", "mathe:mal3"], "ja"],
          ["sn.ma3.zo.13", "Rechenvorteile und Rechenfehler finden, Punkt vor Strich", "3", ["mathe:k3vorteil", "mathe:k4geschickt"], "ja"],
          ["sn.ma3.zo.14", "Schriftliche Multiplikation (dreistellig mal einstellig)", "3", ["mathe:k4malschrift"], "ja"],
          ["sn.ma3.zo.15", "Überschlag und Umkehrprobe bei schriftlichen Verfahren", "3", ["mathe:k3vorteil", "mathe:k4runden"], "ja"],
          ["sn.ma3.zo.16", "Sachaufgaben: Lösungsansätze, Tabellen, Skizzen, Vermutungen, Ergebnisse prüfen", "3", ["mathe:k3sach", "mathe:k3geld"], "teil"],
          ["sn.ma3.zo.17", "Zahlenspiele, Denk- und Legespiele, Lösungsstrategien beschreiben", "3", ["mathe:detektiv"], "teil"]
        ],
        3: [ // Größen und Messen
          ["sn.ma3.gm.01", "Geld: Sachaufgaben, Tabellen und Diagramme", "3", ["mathe:k3geld"], "ja"],
          ["sn.ma3.gm.02", "Länge: Kilometer, zwei Einheiten, Komma, ½ cm/m/km, Stützpunkt 1 km, umrechnen, Sachaufgaben", "3", ["mathe:k3laenge", "mathe:k3groessen"], "ja"],
          ["sn.ma3.gm.03", "Zeit: Sekunde, minutengenau, ¼ h, ½ h, ¾ h, umrechnen, Sachaufgaben", "3", ["mathe:k3zeit", "mathe:k3groessen"], "ja"],
          ["sn.ma3.gm.04", "Masse: Gramm und Kilogramm, zwei Einheiten, ½ kg, Stützpunkte, schätzen, umrechnen", "3", ["mathe:k3gewicht", "mathe:k3groessen"], "ja"],
          ["sn.ma3.gm.05", "Messen mit Messrad, Waage und verschiedenen Uhren", "3", ["echtewelt:backen", "echtewelt:messen"], "aussen"]
        ],
        4: [ // Daten und Zufall
          ["sn.ma3.dz.01", "Säulen- und Balkendiagramme anfertigen", "3", ["mathe:k3diagramm", "mathe:tabelle"], "ja"],
          ["sn.ma3.dz.02", "Fragen an Daten stellen, Werte aus einem Fahrplan entnehmen", "3", ["mathe:k3daten", "mathe:k3diagramm"], "ja"],
          ["sn.ma3.dz.03", "Kombinieren mit Strategien (Gegenpaare, Tachometer-Prinzip), alle Möglichkeiten finden", "3", ["mathe:k3kombi", "mathe:k3daten"], "ja"],
          ["sn.ma3.dz.04", "Zufallsexperimente: vermuten, prüfen, nach Wahrscheinlichkeit ordnen", "3", ["mathe:k3zufall", "mathe:k3daten"], "ja"]
        ]
      },
      "4": {
        1: [ // Raum und Form
          ["sn.ma4.rf.01", "Wegeskizzen erstellen, Entfernungen schätzen", "4", ["mathe:k4massstab"], "teil"],
          ["sn.ma4.rf.02", "Schrägbilder aus verschiedenen Blickwinkeln lesen (verdeckte Teile, Ansichten)", "4", ["mathe:k3ansicht"], "teil"],
          ["sn.ma4.rf.03", "Trapez erkennen, beschreiben, zeichnen, ergänzen", "4", ["mathe:k4vierecke"], "ja"],
          ["sn.ma4.rf.04", "Vierecke ordnen und einteilen (Haus der Vierecke, Drachen, Raute)", "4", ["mathe:k4vierecke"], "ja"],
          ["sn.ma4.rf.05", "Kreise, Dreiecke und Vierecke in Mustern genau zeichnen", "4", ["echtewelt:zirkel"], "aussen"],
          ["sn.ma4.rf.06", "Dreiecke mit und ohne rechten Winkel unterscheiden", "4", ["mathe:k4vierecke"], "ja"],
          ["sn.ma4.rf.07", "Figuren vergrößern und verkleinern", "4", ["mathe:k4vergroessern"], "ja"],
          ["sn.ma4.rf.08", "Flächeninhalt mit Einheitsquadraten, Umfang messen und berechnen, cm² und m², Stützpunkte, schätzen", "4", ["mathe:k4flaeche", "mathe:k4volumen"], "ja"],
          ["sn.ma4.rf.09", "Körper als Schrägbild skizzieren", "4", [], "aussen"],
          ["sn.ma4.rf.10", "Volumen über Einheitswürfel in Quadern bestimmen", "4", ["mathe:k4volumen"], "ja"],
          ["sn.ma4.rf.11", "Körpernetze zuordnen und vergleichen", "4", ["mathe:k3netz"], "teil"],
          ["sn.ma4.rf.12", "Parkettierungen; Achsen-, Schiebe- und Drehsymmetrie beschreiben", "4", ["mathe:k4parkett"], "ja"]
        ],
        2: [ // Zahl und Operation
          ["sn.ma4.zo.01", "Zahlen bis 1 Million und darüber lesen, schreiben, darstellen", "4", ["mathe:k4million"], "ja"],
          ["sn.ma4.zo.02", "Zahlbeziehungen bis 1 Million: zerlegen, in Schritten zählen, vergleichen, Nachbarzahlen, runden", "4", ["mathe:k4million", "mathe:k4runden"], "ja"],
          ["sn.ma4.zo.03", "Stellenwertsystem erweitern, Stellen verändern, Bedeutung der Null", "4", ["mathe:k4million"], "ja"],
          ["sn.ma4.zo.04", "Adam Ries: römische Zahlzeichen, römischer Abakus, Leben und Wirken", "4", ["mathe:k4roemisch", "mathe:k4rechenmeister"], "teil"],
          ["sn.ma4.zo.05", "Rechengesetze und Rechenvorteile, Rechenfehler finden und korrigieren", "4", ["mathe:k4geschickt", "mathe:k5klammer", "mathe:k4rechenmeister"], "ja"],
          ["sn.ma4.zo.06", "Schriftlich addieren (bis drei Summanden) und subtrahieren (bis zwei Subtrahenden)", "4", ["mathe:k4plusviele", "mathe:k4rechenmeister"], "ja"],
          ["sn.ma4.zo.07", "Schriftliche Multiplikation mit bis zu dreistelligem zweiten Faktor", "4", ["mathe:k4malschrift", "mathe:k4malmehr"], "ja"],
          ["sn.ma4.zo.08", "Schriftliche Division (einstelliger Divisor), Teilbarkeit 4 und 6, Primzahlen, Überschlag", "4", ["mathe:k4geteilt", "mathe:k4teilbar", "mathe:k4primzahl", "mathe:k4runden"], "ja"],
          ["sn.ma4.zo.09", "Zahlenmuster in geometrischen Mustern erkennen (figurierte Zahlen)", "4", ["mathe:k4rechenmeister"], "ja"],
          ["sn.ma4.zo.10", "Funktionale Beziehungen: Maßstab, Menge und Preis, Tabellen", "4", ["mathe:k4massstab", "mathe:k4reise"], "ja"]
        ],
        3: [ // Größen und Messen
          ["sn.ma4.gm.01", "Geld, Länge und Zeit in größeren Sachsituationen (Reiseplanung, Preistafeln, Fahrpläne, Wanderkarten)", "4", ["mathe:k4reise", "mathe:k4zeit"], "ja"],
          ["sn.ma4.gm.02", "Bruchteile ¼, ½, ¾ von Größen", "4", ["mathe:k4reise", "mathe:k4tonne"], "ja"],
          ["sn.ma4.gm.03", "Masse: Tonne, zwei Einheiten, Komma, Stützpunkte, schätzen, umrechnen, Sachaufgaben", "4", ["mathe:k4tonne"], "ja"],
          ["sn.ma4.gm.04", "Volumen: Liter und Milliliter, Komma, messen, Stützpunkte, schätzen, umrechnen", "4", ["mathe:k4liter"], "ja"]
        ],
        4: [ // Daten und Zufall
          ["sn.ma4.dz.01", "Daten selbst erheben, auswerten und dokumentieren (Umfragen)", "4", ["echtewelt:umfrage"], "aussen"],
          ["sn.ma4.dz.02", "Balken- und gestapelte Säulendiagramme lesen und erstellen, Achsen", "4", ["mathe:k4diagramme", "mathe:k3diagramm"], "ja"],
          ["sn.ma4.dz.03", "Fragen über den Datensatz hinaus, fehlende Informationen erkennen", "4", ["mathe:k4diagramme"], "ja"],
          ["sn.ma4.dz.04", "Alle Möglichkeiten mit Multiplikation, Baumdiagramm und Tabelle finden (z. B. zwei Würfel)", "4", ["mathe:k4diagramme"], "ja"],
          ["sn.ma4.dz.05", "Wahrscheinlichkeiten vergleichen und ordnen, gleich wahrscheinlich", "4", ["mathe:k4chance", "mathe:k4diagramme"], "ja"]
        ]
      }
    }
  };
  // Übergang in Klasse 5 (Mathe): VORLÄUFIG – der Lehrplantext Kl. 5 (Oberschule/Gymnasium) liegt noch nicht vor. Grundlage: was der
  // Grundschul-Lehrplan Kl. 4 als Basis legt, und die üblichen Startthemen der 5. Klasse (beide Schularten). Kein Lernbereich des
  // Grundschul-Profils – wird nur für Kinder in der Stufe „Übergang 5“ im Elternbereich gezeigt.
  P.uebergang = { stand: "vorläufig – ohne Lehrplantext Klasse 5", mathe: [
    ["sn.ue5.ma.01", "Schriftlich rechnen in allen vier Grundrechenarten sicher, mit Überschlag (Basis aus Kl. 4)", "5", ["mathe:k5fit", "mathe:k4malmehr", "mathe:k4geteilt"], "ja"],
    ["sn.ue5.ma.02", "Große Zahlen bis zur Milliarde, Zehnerpotenzen, runden", "5", ["mathe:k5grosszahl", "mathe:k4million"], "ja"],
    ["sn.ue5.ma.03", "Teiler, Vielfache, Primzahlen, Primfaktorzerlegung, größter gemeinsamer Teiler, kleinstes gemeinsames Vielfaches", "5", ["mathe:k5teiler", "mathe:k4primzahl"], "ja"],
    ["sn.ue5.ma.04", "Terme mit Klammern, Punkt vor Strich, Rechengesetze, Variable und einfache Gleichungen", "5", ["mathe:k5klammer", "mathe:k5terme"], "ja"],
    ["sn.ue5.ma.05", "Brüche: Bruchteile darstellen, von Mengen bestimmen, vergleichen", "5", ["mathe:k5bruchbild", "mathe:k5bruchvon", "mathe:k5bruchvergleich"], "ja"],
    ["sn.ue5.ma.06", "Kommazahlen bei Größen", "5", ["mathe:k5komma", "mathe:k5groessen"], "ja"],
    ["sn.ue5.ma.07", "Koordinatensystem", "5", ["mathe:k5koordinaten"], "ja"],
    ["sn.ue5.ma.08", "Winkelarten, Winkelgröße in Grad schätzen und messen", "5", ["mathe:k5winkel", "mathe:k5geometrie"], "teil"],
    ["sn.ue5.ma.09", "Symmetrieachsen, Abstand Punkt–Gerade", "5", ["mathe:k5geometrie"], "ja"],
    ["sn.ue5.ma.10", "Flächeninhalt und Umfang von Rechteck und Quadrat berechnen, Flächeneinheiten umrechnen", "5", ["mathe:k5raum", "mathe:k4flaeche"], "ja"],
    ["sn.ue5.ma.11", "Volumen und Oberfläche von Quader und Würfel", "5", ["mathe:k5raum", "mathe:k4volumen"], "ja"],
    ["sn.ue5.ma.12", "Genau zeichnen mit Geodreieck und Zirkel", "5", ["echtewelt:lineal", "echtewelt:zirkel"], "aussen"],
    ["sn.ue5.ma.13", "Größen über mehrere Einheiten umrechnen, Maßstab", "5", ["mathe:k5groessen", "mathe:k4massstab"], "ja"],
    ["sn.ue5.ma.14", "Sachaufgaben in mehreren Schritten", "5", ["mathe:k5sach"], "ja"],
    ["sn.ue5.ma.15", "Daten auswerten: Mittelwert, Diagramme", "5", ["mathe:k5mittel", "mathe:k4diagramme"], "ja"]
  ].map(([id, text, kl, app, abdeckung]) => ({ id, text, kl, app, abdeckung })) };
  Object.entries(PUNKTE).forEach(([fach, stufen]) => Object.entries(stufen).forEach(([st, lbs]) => Object.entries(lbs).forEach(([nr, liste]) => {
    const lb = (((P.faecher[fach] || {}).stufen || {})[st] || []).find(x => x.nr === +nr);
    if (lb) lb.punkte = liste.map(([id, text, kl, app, abdeckung]) => ({ id, text, kl, app, abdeckung }));
  })));
})();
