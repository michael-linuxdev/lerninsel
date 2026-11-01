// „Erst erklären“ im Matheweg (02.11.2026, nach dem Vorbild von Bastion, VERMITTLUNG §2): kurze Erklär-Einheiten vor neuen Stationen,
// ohne KI – alles vorher geschrieben. Feste Reihenfolge: ziel → beispiel → ergaenzen → gegenbeispiel → merksatz → üben.
// Schritt-Typen:
//   { typ: "ziel", text }                                 – was man danach kann (ein Satz)
//   { typ: "beispiel", text, zeilen: [..], bild? }        – vorgerechnet, Zeile für Zeile; bild = Funktion → SVG (Mathe._bilder)
//   { typ: "ergaenzen", text, frage, antwort, optionen }  – selbst ergänzen (erste Option ist nicht immer die richtige: optionen werden gemischt)
//   { typ: "gegenbeispiel", text, stimmt: false, fv, warum } – Robo rechnet falsch; fv = Denkfehler aus fehler.js (gleiche Erklärung wie beim Üben)
//   { typ: "merksatz", text }                             – das Wichtigste; steht danach unter „💡 Erklären“ der Station
// Pilot: k1plus10, plusUeber, minusUeber, mal1, k3schriftplus, k3schriftminus (minus in beiden Verfahren: abziehen | ergaenzen).
// Abschluss wird in mathe.erklaert[station] = 1 gemerkt; das Angebot kommt nur, wenn die Station noch nie gerechnet wurde.
(function (W) {
  const M = "−";
  const B = () => (W.Mathe && W.Mathe._bilder) || {};
  const ERKLAERUNGEN = {
    k1plus10: [
      { typ: "ziel", text: "Danach kannst du Plusaufgaben bis 10 rechnen." },
      { typ: "beispiel", text: "3 + 2: Du hast 3 und bekommst 2 dazu.", zeilen: ["Erst 3 Punkte.", "Dann kommen 2 dazu.", "Jetzt sind es 5: 3 + 2 = 5."], bild: () => (B().mengeBild ? B().mengeBild(3, "🍎", 0, "🍐", 2) : "") },
      { typ: "ergaenzen", text: "Jetzt du.", frage: "4 + 2 = ?", antwort: "6", optionen: ["5", "6", "7"] },
      { typ: "gegenbeispiel", text: "Robo zählt bei 5 + 3 so: „5, 6, 7“ – und sagt 7. Stimmt das?", stimmt: false, fv: "zaehlen", warum: "Die 5 hast du schon. Du zählst 3 Schritte weiter: 6, 7, 8. Also 5 + 3 = 8." },
      { typ: "merksatz", text: "Plus heißt: dazutun. Beim Weiterzählen fängst du nach der ersten Zahl an." }
    ],
    plusUeber: [
      { typ: "ziel", text: "Danach kannst du Plusaufgaben rechnen, bei denen du über den Zehner kommst." },
      { typ: "beispiel", text: "38 + 5: Erst bis zum nächsten Zehner, dann den Rest.", zeilen: ["38 + 2 = 40 (bis zum Zehner)", "40 + 3 = 43 (der Rest von 5)", "Also: 38 + 5 = 43"], bild: () => (B().zehnerBild ? B().zehnerBild(38) : "") },
      { typ: "ergaenzen", text: "Jetzt du: 47 + 6. Bis zum Zehner sind es 3.", frage: "47 + 3 = 50, dann 50 + 3 = ?", antwort: "53", optionen: ["52", "53", "43"] },
      { typ: "gegenbeispiel", text: "Robo rechnet: 34 + 28 = 52. Stimmt das?", stimmt: false, fv: "uebertrag", warum: "4 + 8 = 12. Das ist 1 Zehner und 2 Einer. Der Zehner muss mit: 30 + 20 + 10 = 60, dazu 2 – also 62." },
      { typ: "merksatz", text: "Kommen bei den Einern 10 oder mehr heraus, wandert ein Zehner zu den Zehnern." }
    ],
    minusUeber: [
      { typ: "ziel", text: "Danach kannst du Minusaufgaben rechnen, bei denen du unter den Zehner kommst." },
      { typ: "beispiel", text: "43 − 5: Erst bis zum Zehner zurück, dann den Rest.", zeilen: ["43 − 3 = 40 (bis zum Zehner)", "40 − 2 = 38 (der Rest von 5)", "Also: 43 − 5 = 38"], bild: () => (B().zehnerBild ? B().zehnerBild(43) : "") },
      { typ: "ergaenzen", text: "Jetzt du: 52 − 7. Bis zum Zehner sind es 2.", frage: "52 − 2 = 50, dann 50 − 5 = ?", antwort: "45", optionen: ["45", "55", "35"] },
      { typ: "gegenbeispiel", text: `Robo rechnet: 52 ${M} 27 = 35. Er sagt: „2 ${M} 7 geht nicht, also 7 ${M} 2 = 5.“ Stimmt das?`, stimmt: false, fv: "kleinvongross", warum: `Du darfst nicht umdrehen – weggenommen wird immer die 27. Tausche einen Zehner: 12 ${M} 7 = 5, 4 ${M} 2 = 2. Also 25.` },
      { typ: "merksatz", text: "Reicht die obere Einerziffer nicht, tauschst du einen Zehner in 10 Einer. Umdrehen ist verboten." }
    ],
    mal1: [
      { typ: "ziel", text: "Danach kannst du mit 2, 5 und 10 malnehmen." },
      { typ: "beispiel", text: "3 · 5 heißt: 3-mal die 5.", zeilen: ["5", "5 + 5 = 10", "5 + 5 + 5 = 15", "Also: 3 · 5 = 15"] },
      { typ: "ergaenzen", text: "Jetzt du: 4-mal die 5.", frage: "4 · 5 = ?", antwort: "20", optionen: ["9", "20", "25"] },
      { typ: "gegenbeispiel", text: "Robo rechnet: 4 · 2 = 6. Stimmt das?", stimmt: false, fv: "op", warum: "Robo hat plus gerechnet. 4 · 2 heißt 4-mal die 2: 2 + 2 + 2 + 2 = 8." },
      { typ: "merksatz", text: "Mal heißt: die gleiche Zahl mehrmals. 3 · 5 = 5 + 5 + 5." }
    ],
    k3schriftplus: [
      { typ: "ziel", text: "Danach kannst du große Zahlen schriftlich addieren." },
      { typ: "beispiel", text: "347 + 285: Stelle unter Stelle, rechts anfangen.", zeilen: ["Einer: 7 + 5 = 12 – schreibe 2, merke 1", "Zehner: 4 + 8 + 1 = 13 – schreibe 3, merke 1", "Hunderter: 3 + 2 + 1 = 6", "Ergebnis: 632"] },
      { typ: "ergaenzen", text: "Jetzt du: 256 + 138. Bei den Einern: 6 + 8 = 14.", frage: "Welche Ziffer schreibst du bei den Einern?", antwort: "4", optionen: ["4", "14", "1"] },
      { typ: "gegenbeispiel", text: "Robo rechnet: 465 + 278 = 633. Stimmt das?", stimmt: false, fv: "uebertrag", warum: "Robo hat das Merken vergessen. 5 + 8 = 13: schreibe 3, merke 1. 6 + 7 + 1 = 14: schreibe 4, merke 1. 4 + 2 + 1 = 7. Also 743." },
      { typ: "merksatz", text: "Rechts anfangen. Kommt 10 oder mehr heraus, schreibe nur die Einerziffer und merke 1 für die nächste Stelle." }
    ],
    k3schriftminus: {
      abziehen: [
        { typ: "ziel", text: "Danach kannst du große Zahlen schriftlich subtrahieren." },
        { typ: "beispiel", text: `523 ${M} 147: Stelle unter Stelle, rechts anfangen.`, zeilen: [`Einer: 3 ${M} 7 geht nicht. Tausche einen Zehner: 13 ${M} 7 = 6`, `Zehner: Oben steht jetzt 1. 1 ${M} 4 geht nicht. Tausche einen Hunderter: 11 ${M} 4 = 7`, `Hunderter: Oben steht jetzt 4. 4 ${M} 1 = 3`, "Ergebnis: 376"] },
        { typ: "ergaenzen", text: `Jetzt du: 642 ${M} 318. Bei den Einern: 2 ${M} 8 geht nicht.`, frage: `12 ${M} 8 = ?`, antwort: "4", optionen: ["4", "6", "10"] },
        { typ: "gegenbeispiel", text: `Robo rechnet: 642 ${M} 318 = 336. Stimmt das?`, stimmt: false, fv: "kleinvongross", warum: `Robo hat bei den Einern 8 ${M} 2 gerechnet. Unten steht die 8 – sie wird weggenommen. Tausche einen Zehner: 12 ${M} 8 = 4. Ergebnis: 324.` },
        { typ: "merksatz", text: "Rechts anfangen. Reicht die obere Ziffer nicht, tausche einen von der nächsten Stelle – dort steht dann einer weniger." }
      ],
      ergaenzen: [
        { typ: "ziel", text: "Danach kannst du große Zahlen schriftlich subtrahieren – mit Ergänzen." },
        { typ: "beispiel", text: `523 ${M} 147: Du ergänzt von unten nach oben, rechts anfangen.`, zeilen: ["Einer: Von 7 bis 13 sind es 6 – schreibe 6, merke 1", "Zehner: 4 + 1 = 5. Von 5 bis 12 sind es 7 – schreibe 7, merke 1", "Hunderter: 1 + 1 = 2. Von 2 bis 5 sind es 3", "Ergebnis: 376"] },
        { typ: "ergaenzen", text: `Jetzt du: 642 ${M} 318. Bei den Einern: von 8 bis 12.`, frage: "Von 8 bis 12 sind es ?", antwort: "4", optionen: ["4", "6", "10"] },
        { typ: "gegenbeispiel", text: `Robo rechnet: 642 ${M} 318 = 334. Stimmt das?`, stimmt: false, fv: "borgen", warum: "Robo hat die gemerkte 1 vergessen. Bei den Zehnern: 1 + 1 = 2, von 2 bis 4 sind es 2. Ergebnis: 324." },
        { typ: "merksatz", text: "Rechts anfangen, von unten nach oben ergänzen. Musstest du über 10 gehen, merke 1 für die nächste Stelle unten." }
      ]
    }
  };
  const verfahren = () => { try { return ((W.Spielwelt && W.Spielwelt.lade("eltern")) || {}).mathe?.minus === "ergaenzen" ? "ergaenzen" : "abziehen"; } catch (e) { return "abziehen"; } };
  function fuer(station) { const e = ERKLAERUNGEN[station]; if (!e) return null; return Array.isArray(e) ? e : e[verfahren()] || e.abziehen; }
  W.MatheErklaeren = { ERKLAERUNGEN, fuer, hat: (s) => !!ERKLAERUNGEN[s] };
})(typeof window !== "undefined" ? window : globalThis);
