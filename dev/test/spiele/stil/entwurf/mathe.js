// Entwurf 03.11.2026: Mathe-Erklärungen kindgerecht (Rückmeldung des Auftraggebers: „Kein Kind versteht das“).
// Drei Varianten für dieselbe Sache (8 + 5, über den Zehner) – kurze Sätze ohne Fachwörter, Bild zuerst, Benno spricht, 🔊 liest vor:
//   A „Schritt für Schritt“: Benno zeigt, das Kind tippt ▶; je Schritt ein Satz und ein Bild (Zwanzigerfeld)
//   B „Selbst machen“: das Kind tippt die blauen Punkte selbst ins Feld; Benno sagt nur, was passiert
//   C „Bildergeschichte“: drei Bilder nebeneinander, unter jedem ein kurzer Satz
// Dazu: ein Fehler-Hinweis vorher/nachher. Nur Vorschau (spiele/stil/entwurf.html).
(function (W) {
  const KF = "#3B1F63", ROT = "#FF6F61", BLAU = "#4FA8F0";
  // Zwanzigerfeld: zwei Reihen à 10 (Fünfer-Lücke), rote und blaue Plättchen; extra = blaue Plättchen, die noch daneben warten
  function feld(rot, blauOben, blauUnten, warten = 0, { gross = false, tippbar = false } = {}) {
    const r = 15, dx = 36, x0 = 30, y0 = 34, luecke = 10;
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${gross ? 540 : 440} 130" class="feld-bild">` +
      `<rect x="10" y="10" width="${dx * 10 + luecke + 22}" height="104" rx="16" fill="#fff" stroke="${KF}" stroke-width="3"/>` +
      `<line x1="${x0 + dx * 5 - dx / 2 + luecke / 2 - 2}" y1="14" x2="${x0 + dx * 5 - dx / 2 + luecke / 2 - 2}" y2="110" stroke="#E4DAF6" stroke-width="3"/>` +
      `<line x1="14" y1="62" x2="${dx * 10 + luecke + 28}" y2="62" stroke="#E4DAF6" stroke-width="3"/>`;
    const platz = (reihe, i) => [x0 + i * dx + (i >= 5 ? luecke : 0), y0 + reihe * 50];
    for (let reihe = 0; reihe < 2; reihe++) for (let i = 0; i < 10; i++) {
      const [x, y] = platz(reihe, i), n = reihe * 10 + i;
      let farbe = null;
      if (reihe === 0 && i < rot) farbe = ROT; else if (reihe === 0 && i < rot + blauOben) farbe = BLAU; else if (reihe === 1 && i < blauUnten) farbe = BLAU;
      s += farbe ? `<circle cx="${x}" cy="${y}" r="${r}" fill="${farbe}" stroke="${KF}" stroke-width="2.5"/><circle cx="${x - 5}" cy="${y - 5}" r="4" fill="#fff" opacity=".55"/>`
        : `<circle cx="${x}" cy="${y}" r="${r - 4}" fill="none" stroke="#D9D0EA" stroke-width="2" stroke-dasharray="3 4"/>`;
      if (n === 9 && rot + blauOben === 10) s += `<text x="${x + 26}" y="${y + 6}" font-size="20" font-weight="700" fill="${KF}" font-family="Fredoka, sans-serif">10</text>`;
    }
    for (let i = 0; i < warten; i++) s += `<g ${tippbar ? `class="wartet" data-i="${i}" style="cursor:pointer"` : ""}><circle cx="${gross ? 430 + (i % 3) * 36 : 0}" cy="${gross ? 34 + Math.floor(i / 3) * 50 : 0}" r="${r}" fill="${BLAU}" stroke="${KF}" stroke-width="2.5"/></g>`;
    return s + `</svg>`;
  }
  const SCHRITTE_A = [
    { satz: "Das sind 8 rote Punkte.", bild: () => feld(8, 0, 0) },
    { satz: "5 blaue kommen dazu.", bild: () => feld(8, 0, 0, 5, { gross: true }) },
    { satz: "2 blaue machen die Reihe voll. Jetzt sind es 10.", bild: () => feld(8, 2, 0, 3, { gross: true }) },
    { satz: "3 blaue sind noch übrig. Sie kommen nach unten.", bild: () => feld(8, 2, 3) },
    { satz: "10 und 3 sind 13. Also: 8 + 5 = 13.", bild: () => feld(8, 2, 3), gross: "8 + 5 = 13" }
  ];
  const GESCHICHTE_C = [
    { satz: "8 rote. 5 blaue kommen.", bild: () => feld(8, 0, 0, 5, { gross: true }) },
    { satz: "Erst die Reihe voll machen: 10.", bild: () => feld(8, 2, 0, 3, { gross: true }) },
    { satz: "Dann der Rest: 13.", bild: () => feld(8, 2, 3) }
  ];
  const FEHLER = {
    vorher: ["Du hast an jeder Stelle nur die Ziffern addiert und den Übertrag vergessen.",
      "Wenn an einer Stelle 10 oder mehr herauskommt, sind das 10 Einer = 1 Zehner. Dieser Zehner gehört zu den Zehnern – sonst fehlen 10.", "34 + 28 = 62."],
    nachher: ["4 und 8 sind 12.", "Aus 10 Einern machst du einen Zehner. Er wandert nach links.", "Darum: 34 + 28 = 62."]
  };
  // Stellenbild für den Fehler-Hinweis: Zehnerstangen und Einerwürfel, 10 Einer werden zu einer Stange
  function stellenBild() {
    const stange = (x, y, farbe) => `<rect x="${x}" y="${y}" width="14" height="70" rx="3" fill="${farbe}" stroke="${KF}" stroke-width="2"/>` + Array.from({ length: 9 }, (_, i) => `<line x1="${x}" y1="${y + 7 * (i + 1)}" x2="${x + 14}" y2="${y + 7 * (i + 1)}" stroke="${KF}" stroke-width="1" opacity=".4"/>`).join("");
    const wuerfel = (x, y, farbe) => `<rect x="${x}" y="${y}" width="14" height="14" rx="3" fill="${farbe}" stroke="${KF}" stroke-width="2"/>`;
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 120" class="feld-bild">`;
    s += `<text x="60" y="114" font-size="16" fill="${KF}" font-family="Fredoka, sans-serif" text-anchor="middle">Zehner</text><text x="250" y="114" font-size="16" fill="${KF}" font-family="Fredoka, sans-serif" text-anchor="middle">Einer</text>`;
    for (let i = 0; i < 5; i++) s += stange(14 + i * 20, 14, i < 3 ? "#FFB547" : "#7ED957");
    s += `<g><rect x="114" y="8" width="26" height="82" rx="8" fill="none" stroke="${BLAU}" stroke-width="3" stroke-dasharray="5 4"/>${stange(120, 14, BLAU)}</g>`;
    for (let i = 0; i < 12; i++) s += wuerfel(186 + (i % 6) * 20, 30 + Math.floor(i / 6) * 20, i < 4 ? "#FFB547" : "#7ED957");
    s += `<rect x="180" y="24" width="${10 * 20 - 74}" height="48" rx="8" fill="none" stroke="${BLAU}" stroke-width="3" stroke-dasharray="5 4" transform="translate(0 0)"/>`;
    s += `<path d="M178 48 C160 30 150 20 146 14" fill="none" stroke="${BLAU}" stroke-width="3" marker-end="url(#pf)"/><defs><marker id="pf" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="${BLAU}"/></marker></defs>`;
    return s + `</svg>`;
  }
  W.MatheEntwurf = { feld, SCHRITTE_A, GESCHICHTE_C, FEHLER, stellenBild };
})(window);
