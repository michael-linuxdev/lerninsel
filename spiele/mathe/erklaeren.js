// „Erst erklären“ im Matheweg – kindgerecht (03.11.2026, Rückmeldung des Auftraggebers „Kein Kind versteht das“; Wahl: alle drei Arten).
// Jede Einheit hat fünf Schritte in fester Reihenfolge – kurze Sätze ohne Fachwörter, Bild zuerst, Benno spricht, 🔊 liest vor:
//   { typ: "zeigen", text, bilder: [{ satz, bild }] }        A „Schritt für Schritt“: Benno zeigt, je ▶ ein Satz und ein Bild
//   { typ: "machen", text, art: "dazu"|"weg"|"gruppen", a, b } B „Selbst machen“: das Kind tippt Punkte hinein / nimmt sie weg / tippt ➕
//   { typ: "ergaenzen", text, frage, antwort, optionen }     selbst rechnen (Optionen werden sortiert gezeigt)
//   { typ: "gegenbeispiel", text, stimmt: false, fv, warum } Robo rechnet falsch; fv = Fehler aus fehler.js
//   { typ: "geschichte", text, bilder: [{ satz, bild }] }    C „Bildergeschichte“ zum Merken: drei Bilder, je ein Satz; text = Merksatz
// bild ist eine Funktion → SVG (Bausteine in BILD, auch für die Fehler-Hinweise: bildFuer(fv, o)).
// Einheiten: k1plus10, plusUeber, minusUeber, mal1 (auch mal2, mal3), geteilt, k1minus10, zehner, plus20 (auch k1plus20), minus20, ergaenzen, uhr, k3schriftplus, k3schriftminus (minus in beiden Verfahren: abziehen | ergaenzen).
// Abschluss wird in mathe.erklaert[station] = 1 gemerkt; das Angebot kommt nur, wenn die Station noch nie gerechnet wurde.
(function (W) {
  const M = "−", D = "#3B1F63", ROT = "#FF6F61", BLAU = "#4FA8F0", STANGE = "#FFB547";

  // ---------- Bild-Bausteine ----------
  // Zehnerstangen links, Zehnerfeld (2 × 5) rechts. rot/blau = Punkte im Feld, leer = gerade weggenommene (durchgestrichen),
  // warten = blaue Punkte, die noch daneben warten (antippbar mit tipp), tausch = letzte Stange gestrichelt (wird gleich getauscht)
  function feld({ z = 0, rot = 0, blau = 0, leer = 0, warten = 0, tipp = false, nimm = false, tausch = false, neu = false } = {}) {
    const zs = Math.min(z, 10), fx = 10 + zs * 22 + (zs ? 12 : 0), breit = fx + 186 + (warten ? 104 : 4);
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${breit} 100" class="erkl-bild" role="img" aria-label="${z} Zehner und ${rot + blau} Einzelne">`;
    for (let i = 0; i < zs; i++) {
      const x = 10 + i * 22, gestr = tausch && i === zs - 1, frisch = neu && i === zs - 1;
      s += `<rect x="${x}" y="12" width="16" height="78" rx="4" fill="${frisch ? BLAU : STANGE}" stroke="${gestr ? BLAU : D}" stroke-width="${gestr ? 3.5 : 2.5}"${gestr ? ' stroke-dasharray="5 4"' : ""}/>` +
        Array.from({ length: 9 }, (_, k) => `<line x1="${x}" y1="${12 + 7.8 * (k + 1)}" x2="${x + 16}" y2="${12 + 7.8 * (k + 1)}" stroke="${D}" stroke-width="1" opacity=".35"/>`).join("");
    }
    s += `<rect x="${fx}" y="10" width="182" height="80" rx="14" fill="#fff" stroke="${D}" stroke-width="3"/><line x1="${fx}" y1="50" x2="${fx + 182}" y2="50" stroke="#E4DAF6" stroke-width="2.5"/>`;
    for (let k = 0; k < 10; k++) {
      const cx = fx + 20 + (k % 5) * 35.5, cy = 30 + Math.floor(k / 5) * 40;
      if (k < rot) s += `<g${nimm ? ` class="nimm" data-k="${k}" style="cursor:pointer"` : ""}><circle cx="${cx}" cy="${cy}" r="14" fill="${ROT}" stroke="${D}" stroke-width="2.5"/><circle cx="${cx - 4.5}" cy="${cy - 4.5}" r="4" fill="#fff" opacity=".55"/></g>`;
      else if (k < rot + blau) s += `<circle cx="${cx}" cy="${cy}" r="14" fill="${BLAU}" stroke="${D}" stroke-width="2.5"/><circle cx="${cx - 4.5}" cy="${cy - 4.5}" r="4" fill="#fff" opacity=".55"/>`;
      else if (k < rot + blau + leer) s += `<circle cx="${cx}" cy="${cy}" r="12" fill="none" stroke="${ROT}" stroke-width="2" stroke-dasharray="3 3"/><path d="M${cx - 8} ${cy - 8} L${cx + 8} ${cy + 8} M${cx + 8} ${cy - 8} L${cx - 8} ${cy + 8}" stroke="${ROT}" stroke-width="2.5" stroke-linecap="round"/>`;
      else s += `<circle cx="${cx}" cy="${cy}" r="10" fill="none" stroke="#D9D0EA" stroke-width="2" stroke-dasharray="3 4"/>`;
    }
    for (let i = 0; i < warten; i++) {
      const cx = fx + 206 + (i % 3) * 32, cy = 26 + Math.floor(i / 3) * 32;
      s += `<g${tipp ? ` class="wartet" data-i="${i}" style="cursor:pointer"` : ""}><circle cx="${cx}" cy="${cy}" r="14" fill="${BLAU}" stroke="${D}" stroke-width="2.5"/><circle cx="${cx - 4.5}" cy="${cy - 4.5}" r="4" fill="#fff" opacity=".55"/></g>`;
    }
    return s + `</svg>`;
  }
  // Punkte in Reihen: zeilen × je (für „mal“)
  function reihen(je, zeilen, max = zeilen) {
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${je * 34 + 70} ${max * 34 + 14}" class="erkl-bild" role="img" aria-label="${zeilen}-mal ${je}">`;
    for (let z = 0; z < max; z++) {
      for (let k = 0; k < je; k++) s += z < zeilen ? `<circle cx="${22 + k * 34}" cy="${22 + z * 34}" r="13" fill="${z % 2 ? BLAU : ROT}" stroke="${D}" stroke-width="2.5"/>` : `<circle cx="${22 + k * 34}" cy="${22 + z * 34}" r="9" fill="none" stroke="#D9D0EA" stroke-width="2" stroke-dasharray="3 4"/>`;
      if (z < zeilen) s += `<text x="${je * 34 + 18}" y="${29 + z * 34}" font-size="20" font-weight="700" fill="${D}" font-family="Fredoka, sans-serif">${je * (z + 1)}</text>`;
    }
    return s + `</svg>`;
  }
  // Zahlenstrahl mit Sprüngen (für „weiterzählen“): von a aus b Schritte; falsch = Robo zählt die a mit
  function strahl(a, b, op = "+", falsch = false) {
    const von = op === "+" ? a - 1 : a - b - 1, bis = op === "+" ? a + b + 1 : a + 1, n = bis - von, w = 40;
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n * w + 20} 96" class="erkl-bild" role="img" aria-label="Zahlenstrahl">` +
      `<line x1="10" y1="70" x2="${n * w + 10}" y2="70" stroke="${D}" stroke-width="3"/>`;
    for (let k = 0; k <= n; k++) { const x = 10 + k * w, z = von + k;
      s += `<line x1="${x}" y1="62" x2="${x}" y2="78" stroke="${D}" stroke-width="2.5"/><text x="${x}" y="94" font-size="15" text-anchor="middle" fill="${D}" font-family="Fredoka, sans-serif" font-weight="${z === a ? 700 : 500}">${z}</text>`; }
    const start = (falsch ? a - (op === "+" ? 1 : -1) : a) - von;
    for (let k = 0; k < b; k++) { const x1 = 10 + (op === "+" ? start + k : start - k) * w, x2 = x1 + (op === "+" ? w : -w);
      s += `<path d="M${x1} 62 Q${(x1 + x2) / 2} 22 ${x2} 62" fill="none" stroke="${falsch ? ROT : BLAU}" stroke-width="3"/><text x="${(x1 + x2) / 2}" y="34" font-size="14" text-anchor="middle" fill="${falsch ? ROT : BLAU}" font-weight="700" font-family="Fredoka, sans-serif">${k + 1}</text>`; }
    return s + `<circle cx="${10 + (a - von) * w}" cy="70" r="7" fill="${ROT}" stroke="${D}" stroke-width="2"/></svg>`;
  }
  // Schriftlich rechnen, Stelle für Stelle von rechts: bis = wie viele Stellen schon fertig sind (0 = nur hingeschrieben)
  // verfahren (minus): "abziehen" (getauschte Ziffer durchgestrichen, neue klein darüber) oder "ergaenzen" (kleine 1 unten links)
  function schrift(a, b, op, bis = 0, verfahren = "abziehen", markiere = -1) {
    const x = String(a).split("").reverse().map(Number), y = String(b).split("").reverse().map(Number), n = Math.max(x.length, y.length);
    const erg = [], klein = {}, oben = {};
    let c = 0;
    const ober = x.slice();
    for (let i = 0; i < n; i++) {
      const xi = ober[i] || 0, yi = y[i] || 0;
      if (op === "+") { const s = xi + yi + c; erg.push(s % 10); c = s >= 10 ? 1 : 0; if (c && i + 1 < n + 1) klein[i + 1] = 1; }
      else if (verfahren === "ergaenzen") { const unten = yi + c; const s = xi >= unten ? xi - unten : xi + 10 - unten; erg.push(s); c = xi >= unten ? 0 : 1; if (c) klein[i + 1] = 1; }
      else { let t = xi; if (t < yi) { t += 10; oben[i] = 1; ober[i + 1] = (ober[i + 1] || 0) - 1; } erg.push(t - yi); }   // oben[i] = hier wurde getauscht
    }
    if (op === "+" && c) erg.push(1);
    const spalten = Math.max(n, erg.length), w = 46, x0 = 40, breite = x0 + spalten * w + 20;
    const sx = (i) => x0 + (spalten - 1 - i) * w + w / 2;
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${breite} 196" class="erkl-bild" role="img" aria-label="${a} ${op} ${b} schriftlich">`;
    if (markiere >= 0) s += `<rect x="${sx(markiere) - w / 2 + 3}" y="6" width="${w - 6}" height="184" rx="10" fill="#FFF3C4"/>`;
    const ziffer = (z, i, yy, extra = "") => `<text x="${sx(i)}" y="${yy}" font-size="34" text-anchor="middle" fill="${D}" font-weight="700" font-family="Fredoka, sans-serif" ${extra}>${z}</text>`;
    x.forEach((z, i) => {
      // Abziehen: angezeigter Wert = Ziffer − 1 (rechts daneben wurde schon getauscht) + 10 (hier wurde schon getauscht)
      const wert = op === "+" || verfahren === "ergaenzen" ? z : z - (bis > i - 1 && oben[i - 1] ? 1 : 0) + (bis > i && oben[i] ? 10 : 0), anders = wert !== z;
      s += ziffer(z, i, 62, anders ? 'opacity=".45"' : "") + (anders ? `<line x1="${sx(i) - 12}" y1="56" x2="${sx(i) + 12}" y2="40" stroke="${ROT}" stroke-width="3"/><text x="${sx(i) + 4}" y="26" font-size="18" text-anchor="middle" fill="${ROT}" font-weight="700" font-family="Fredoka, sans-serif">${wert}</text>` : ""); });
    y.forEach((z, i) => { s += ziffer(z, i, 108); });
    s += `<text x="${x0 - 14}" y="108" font-size="34" text-anchor="middle" fill="${D}" font-weight="700" font-family="Fredoka, sans-serif">${op}</text>`;
    // kleine Einsen (Plus: zwischen den Zeilen; Ergänzen: unten links neben der Ziffer)
    Object.keys(klein).forEach(k => { k = +k; if (k <= bis && k < spalten) s += `<text x="${sx(k) + (op === "+" ? 0 : -16)}" y="${op === "+" ? 132 : 120}" font-size="18" text-anchor="middle" fill="${BLAU}" font-weight="700" font-family="Fredoka, sans-serif">1</text>`; });
    s += `<line x1="${x0 - 30}" y1="140" x2="${breite - 14}" y2="140" stroke="${D}" stroke-width="3.5"/>`;
    erg.forEach((z, i) => { if (i < bis && !(i === erg.length - 1 && z === 0 && erg.length > 1)) s += ziffer(z, i, 180); });
    return s + `</svg>`;
  }
  // Uhr (04.11.2026): kurzer Zeiger rot (Stunde), langer blau (Minuten); zeige = "kurz" | "lang" leuchtet gelb hinterlegt; tipp = Zahlen antippbar
  function uhr(h, m = 0, { zeige = "", tipp = false, ohneKurz = false } = {}) {
    const wS = ((h % 12) + m / 60) * 30, wM = m * 6, R = (w, r) => [100 + Math.sin(w * Math.PI / 180) * r, 100 - Math.cos(w * Math.PI / 180) * r];
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="erkl-bild erkl-uhr" role="img" aria-label="Uhr: ${h} Uhr${m ? " " + m : ""}">` +
      `<circle cx="100" cy="100" r="94" fill="#fff" stroke="${D}" stroke-width="6"/>`;
    for (let i = 1; i <= 12; i++) { const [x, y] = R(i * 30, 70), [x1, y1] = R(i * 30, 84), [x2, y2] = R(i * 30, 92);
      s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${D}" stroke-width="4"/>` +
        (tipp ? `<g class="uhrzahl" data-h="${i}" style="cursor:pointer"><circle cx="${x}" cy="${y}" r="15" fill="#F4EEFF" stroke="#D9D0EA" stroke-width="2"/>` : "<g>") +
        `<text x="${x}" y="${y + 7}" text-anchor="middle" font-size="20" font-weight="700" fill="${D}" font-family="Fredoka, sans-serif">${i}</text></g>`; }
    const zeiger = (w, l, farbe, dick, an) => { const [x, y] = R(w, l); return (an ? `<line x1="100" y1="100" x2="${x}" y2="${y}" stroke="#FFD84D" stroke-width="${dick + 10}" stroke-linecap="round" opacity=".8"/>` : "") +
      `<line x1="100" y1="100" x2="${x}" y2="${y}" stroke="${farbe}" stroke-width="${dick}" stroke-linecap="round"/>`; };
    if (!ohneKurz) s += zeiger(wS, 38, ROT, 10, zeige === "kurz");
    s += zeiger(wM, 56, BLAU, 6, zeige === "lang");
    return s + `<circle cx="100" cy="100" r="8" fill="${D}"/></svg>`;
  }
  const BILD = { feld, reihen, strahl, schrift, uhr };

  // ---------- Bilder für die Fehler-Hinweise (fehler.js liefert die Texte) ----------
  function bildFuer(fv, o) {
    if (!o) return "";
    const E = (n) => n % 10, Z = (n) => Math.floor(n / 10) % 10;
    try {
      if ((fv === "uebertrag" || fv === "uebertragdoppelt") && o.op === "+") { const s = E(o.a) + E(o.b); return s >= 10 ? feld({ rot: Math.min(10, E(o.a)), blau: 10 - E(o.a), warten: s - 10 }) : schrift(o.a, o.b, "+", 3); }
      if ((fv === "kleinvongross" || fv === "borgen") && o.op === M) return feld({ z: Math.min(9, Z(o.a)), rot: E(o.a), tausch: true });
      if (fv === "zaehlen" && o.b <= 6) return strahl(o.a, o.b, o.op === M ? "-" : "+");
      if (fv === "stellenwert" && o.a < 100) return feld({ z: Z(o.a), rot: E(o.a), warten: Math.min(9, o.b) });
      if (fv === "malreihe" && o.a <= 10 && o.b <= 10) return reihen(o.a, o.b);
      if ((fv === "geteiltminus" || fv === "geteiltreihe") && o.op === ":" && o.b <= 10 && o.a / o.b <= 10) return reihen(o.b, o.a / o.b);
      if (fv === "dreher" && o.c < 100) return feld({ z: Z(o.c), rot: E(o.c) });
      if ((fv === "zeigervertauscht" || fv === "stundedaneben") && o.uhr) return uhr(o.uhr.h, o.uhr.m, { zeige: "kurz" });
      if (fv === "malnull") return reihen(Math.max(1, Math.min(10, o.a || o.b)), 0, 2);
    } catch (e) { /* ohne Bild */ }
    return "";
  }

  // ---------- Einheiten ----------
  const F = (x) => () => feld(x);
  const ERKLAERUNGEN = {
    k1plus10: [
      { typ: "zeigen", text: "3 + 2", bilder: [
        { satz: "Das sind 3 Punkte.", bild: F({ rot: 3 }) },
        { satz: "2 kommen dazu.", bild: F({ rot: 3, warten: 2 }) },
        { satz: "Jetzt sind es 5. Also 3 + 2 = 5.", bild: F({ rot: 3, blau: 2 }) }] },
      { typ: "machen", text: "Jetzt du: Tipp die blauen Punkte an.", art: "dazu", a: 3, b: 2 },
      { typ: "ergaenzen", text: "Jetzt rechnest du.", frage: "4 + 2 = ?", antwort: "6", optionen: ["5", "6", "7"] },
      { typ: "gegenbeispiel", text: "Robo zählt bei 5 + 3: „5, 6, 7.“ Er sagt 7. Stimmt das?", stimmt: false, fv: "zaehlen", warum: "Bei der 5 ist Robo schon. 3 weiter: 6, 7, 8. Also 8." },
      { typ: "geschichte", text: "Plus heißt: Es kommt etwas dazu.", bilder: [
        { satz: "Erst die erste Zahl.", bild: F({ rot: 3 }) },
        { satz: "Dann kommen die anderen dazu.", bild: F({ rot: 3, warten: 2 }) },
        { satz: "Zum Schluss alle zählen.", bild: F({ rot: 3, blau: 2 }) }] }
    ],
    plusUeber: [
      { typ: "zeigen", text: "38 + 5 – über die 10", bilder: [
        { satz: "38 sind 3 Zehner und 8 Einzelne.", bild: F({ z: 3, rot: 8 }) },
        { satz: "5 kommen dazu.", bild: F({ z: 3, rot: 8, warten: 5 }) },
        { satz: "2 machen die 10 voll. Das sind 40.", bild: F({ z: 3, rot: 8, blau: 2, warten: 3 }) },
        { satz: "Die volle 10 ist ein Zehner. 3 sind noch übrig: 43.", bild: F({ z: 4, blau: 3, neu: true }) }] },
      { typ: "machen", text: "Jetzt du: Tipp die blauen Punkte an.", art: "dazu", a: 38, b: 5 },
      { typ: "ergaenzen", text: "Jetzt rechnest du: 47 + 6. Erst 3 bis zur 50.", frage: "50 + 3 = ?", antwort: "53", optionen: ["52", "53", "43"] },
      { typ: "gegenbeispiel", text: "Robo rechnet: 34 + 28 = 52. Stimmt das?", stimmt: false, fv: "uebertrag", warum: "4 und 8 sind 12. Das ist ein Zehner mehr. Also 62." },
      { typ: "geschichte", text: "Erst die 10 voll machen, dann den Rest.", bilder: [
        { satz: "Erst die 10 voll machen.", bild: F({ z: 3, rot: 8, blau: 2, warten: 3 }) },
        { satz: "Die volle 10 wird ein Zehner.", bild: F({ z: 4, neu: true, warten: 3 }) },
        { satz: "Dann den Rest dazu.", bild: F({ z: 4, blau: 3 }) }] }
    ],
    minusUeber: [
      { typ: "zeigen", text: `43 ${M} 5 – unter die 40`, bilder: [
        { satz: "43 sind 4 Zehner und 3 Einzelne.", bild: F({ z: 4, rot: 3 }) },
        { satz: "5 sollen weg. Erst die 3.", bild: F({ z: 4, leer: 3 }) },
        { satz: "Jetzt tauschen wir einen Zehner in 10 Einzelne.", bild: F({ z: 4, tausch: true }) },
        { satz: "Noch 2 weg. Übrig sind 38.", bild: F({ z: 3, rot: 8, leer: 2 }) }] },
      { typ: "machen", text: "Jetzt du: Tipp 5 rote Punkte weg.", art: "weg", a: 43, b: 5 },
      { typ: "ergaenzen", text: `Jetzt rechnest du: 52 ${M} 7. Erst 2 weg, dann bist du bei 50.`, frage: `50 ${M} 5 = ?`, antwort: "45", optionen: ["45", "55", "35"] },
      { typ: "gegenbeispiel", text: `Robo rechnet: 52 ${M} 27 = 35. Er sagt: „2 ${M} 7 geht nicht, also 7 ${M} 2.“ Stimmt das?`, stimmt: false, fv: "kleinvongross", warum: `Umdrehen geht nicht. Tausch einen Zehner: 12 ${M} 7 = 5. Dann 4 ${M} 2 = 2. Also 25.` },
      { typ: "geschichte", text: "Reicht es nicht, tausch einen Zehner in 10 Einzelne.", bilder: [
        { satz: "Erst die Einzelnen weg.", bild: F({ z: 4, leer: 3 }) },
        { satz: "Reicht es nicht? Tausch einen Zehner.", bild: F({ z: 4, tausch: true }) },
        { satz: "Dann den Rest weg.", bild: F({ z: 3, rot: 8, leer: 2 }) }] }
    ],
    mal1: [
      { typ: "zeigen", text: "3 · 5", bilder: [
        { satz: "3 · 5 heißt: 3-mal die 5. Einmal 5.", bild: () => reihen(5, 1, 3) },
        { satz: "Zweimal 5: 10.", bild: () => reihen(5, 2, 3) },
        { satz: "Dreimal 5: 15. Also 3 · 5 = 15.", bild: () => reihen(5, 3, 3) }] },
      { typ: "machen", text: "Jetzt du: Tipp 3-mal auf ➕.", art: "gruppen", a: 3, b: 5 },
      { typ: "ergaenzen", text: "Jetzt rechnest du: 4-mal die 5.", frage: "4 · 5 = ?", antwort: "20", optionen: ["9", "20", "25"] },
      { typ: "gegenbeispiel", text: "Robo rechnet: 4 · 2 = 6. Stimmt das?", stimmt: false, fv: "op", warum: "Robo hat plus gerechnet. 4 · 2 heißt 4-mal die 2: 2, 4, 6, 8. Also 8." },
      { typ: "geschichte", text: "Mal heißt: die gleiche Zahl mehrmals.", bilder: [
        { satz: "Immer gleich viele.", bild: () => reihen(5, 1, 3) },
        { satz: "So oft, wie die Zahl sagt.", bild: () => reihen(5, 3, 3) },
        { satz: "Zähl in Schritten: 5, 10, 15.", bild: () => reihen(5, 3, 3) }] }
    ],
    // Bis 20 und Ergänzen (04.11.2026): erst die 10 voll machen bzw. erst bis zur 10 zurück
    plus20: [
      { typ: "zeigen", text: "8 + 5 – über die 10", bilder: [
        { satz: "Das sind 8 Punkte.", bild: F({ rot: 8 }) },
        { satz: "5 kommen dazu.", bild: F({ rot: 8, warten: 5 }) },
        { satz: "2 machen die 10 voll.", bild: F({ rot: 8, blau: 2, warten: 3 }) },
        { satz: "Die volle 10 ist ein Zehner. 3 sind noch übrig: 13.", bild: F({ z: 1, blau: 3, neu: true }) }] },
      { typ: "machen", text: "Jetzt du: Tipp die blauen Punkte an.", art: "dazu", a: 8, b: 5 },
      { typ: "ergaenzen", text: "Jetzt rechnest du: 7 + 6. Erst 3 bis zur 10.", frage: "10 + 3 = ?", antwort: "13", optionen: ["12", "13", "3"] },
      { typ: "gegenbeispiel", text: "Robo zählt bei 9 + 4: „9, 10, 11, 12.“ Er sagt 12. Stimmt das?", stimmt: false, fv: "zaehlen", warum: "Bei der 9 ist Robo schon. 4 weiter: 10, 11, 12, 13. Also 13." },
      { typ: "geschichte", text: "Erst die 10 voll machen, dann den Rest.", bilder: [
        { satz: "Erst die 10 voll machen.", bild: F({ rot: 8, blau: 2, warten: 3 }) },
        { satz: "Die volle 10 wird ein Zehner.", bild: F({ z: 1, neu: true, warten: 3 }) },
        { satz: "Dann den Rest dazu.", bild: F({ z: 1, blau: 3 }) }] }
    ],
    minus20: [
      { typ: "zeigen", text: `13 ${M} 5 – unter die 10`, bilder: [
        { satz: "13 sind ein Zehner und 3 Einzelne.", bild: F({ z: 1, rot: 3 }) },
        { satz: "5 sollen weg. Erst die 3.", bild: F({ z: 1, leer: 3 }) },
        { satz: "Jetzt tauschen wir den Zehner in 10 Einzelne.", bild: F({ z: 1, tausch: true }) },
        { satz: "Noch 2 weg. Übrig sind 8.", bild: F({ rot: 8, leer: 2 }) }] },
      { typ: "machen", text: "Jetzt du: Tipp 5 rote Punkte weg.", art: "weg", a: 13, b: 5 },
      { typ: "ergaenzen", text: `Jetzt rechnest du: 15 ${M} 7. Erst 5 weg, dann bist du bei 10.`, frage: `10 ${M} 2 = ?`, antwort: "8", optionen: ["8", "12", "2"] },
      { typ: "gegenbeispiel", text: `Robo rechnet: 14 ${M} 6 = 12. Er sagt: „4 ${M} 6 geht nicht, also 6 ${M} 4.“ Stimmt das?`, stimmt: false, fv: "kleinvongross", warum: `Umdrehen geht nicht. Erst 4 weg, dann bist du bei 10. Noch 2 weg: 8.` },
      { typ: "geschichte", text: "Erst bis zur 10 zurück, dann den Rest weg.", bilder: [
        { satz: "Erst die Einzelnen weg.", bild: F({ z: 1, leer: 3 }) },
        { satz: "Reicht es nicht? Tausch den Zehner.", bild: F({ z: 1, tausch: true }) },
        { satz: "Dann den Rest weg.", bild: F({ rot: 8, leer: 2 }) }] }
    ],
    ergaenzen: [
      { typ: "zeigen", text: "34 + ? = 40", bilder: [
        { satz: "34 sind 3 Zehner und 4 Einzelne.", bild: F({ z: 3, rot: 4 }) },
        { satz: "Bis zur 40 muss die 10 voll werden.", bild: F({ z: 3, rot: 4, warten: 6 }) },
        { satz: "6 Punkte machen die 10 voll.", bild: F({ z: 3, rot: 4, blau: 6 }) },
        { satz: "Jetzt sind es 40. Es fehlen also 6.", bild: F({ z: 4, neu: true }) }] },
      { typ: "machen", text: "Jetzt du: Mach die 10 voll. Tipp die blauen Punkte an.", art: "dazu", a: 34, b: 6 },
      { typ: "ergaenzen", text: "Jetzt rechnest du: Wie viele fehlen bis zur 60?", frage: "57 + ? = 60", antwort: "3", optionen: ["3", "7", "13"] },
      { typ: "gegenbeispiel", text: "Robo rechnet: 36 + 4 = 30. Stimmt das?", stimmt: false, fv: "uebertrag", warum: "6 und 4 machen die 10 voll. Daraus wird ein Zehner. Also 40." },
      { typ: "geschichte", text: "Ergänzen heißt: Wie viele fehlen, bis die 10 voll ist?", bilder: [
        { satz: "Schau, wie viele schon da sind.", bild: F({ z: 3, rot: 4 }) },
        { satz: "Füll die 10 auf.", bild: F({ z: 3, rot: 4, blau: 6 }) },
        { satz: "Zähl, wie viele du dazugetan hast.", bild: F({ z: 4, neu: true }) }] }
    ],
    // Uhrzeit (04.11.2026): kurzer Zeiger = Stunde, langer Zeiger oben = genau, unten = halb
    uhr: [
      { typ: "zeigen", text: "Wie spät ist es?", bilder: [
        { satz: "Die Uhr hat einen kurzen und einen langen Zeiger.", bild: () => uhr(3, 0) },
        { satz: "Der kurze Zeiger zeigt die Stunde. Hier auf die 3.", bild: () => uhr(3, 0, { zeige: "kurz" }) },
        { satz: "Der lange Zeiger zeigt nach oben auf die 12. Das heißt: genau.", bild: () => uhr(3, 0, { zeige: "lang" }) },
        { satz: "Also ist es genau 3 Uhr.", bild: () => uhr(3, 0) }] },
      { typ: "machen", text: "Jetzt du: Stell 4 Uhr ein. Tipp auf die Zahl für den kurzen Zeiger.", art: "uhr", a: 4, b: 0 },
      { typ: "ergaenzen", text: "Der kurze Zeiger zeigt auf die 7. Der lange zeigt nach oben.", frage: "Es ist ? Uhr.", antwort: "7", optionen: ["7", "12", "6"] },
      { typ: "gegenbeispiel", text: "Der kurze Zeiger zeigt auf die 2, der lange nach oben. Robo sagt: „12 Uhr.“ Stimmt das?", stimmt: false, fv: "zeigervertauscht", warum: "Robo hat die Zeiger verwechselt. Der kurze zeigt die Stunde: 2. Also 2 Uhr." },
      { typ: "geschichte", text: "Kurz zeigt die Stunde. Lang oben heißt: genau.", bilder: [
        { satz: "Erst den kurzen Zeiger suchen.", bild: () => uhr(5, 0, { zeige: "kurz" }) },
        { satz: "Lang oben heißt genau, lang unten heißt halb.", bild: () => uhr(5, 30, { zeige: "lang" }) },
        { satz: "Bei halb ist der kurze schon über die Zahl hinaus.", bild: () => uhr(5, 30, { zeige: "kurz" }) }] }
    ],
    // Minus bis 10 (04.11.2026): Es geht etwas weg
    k1minus10: [
      { typ: "zeigen", text: `5 ${M} 2`, bilder: [
        { satz: "Das sind 5 Punkte.", bild: F({ rot: 5 }) },
        { satz: "2 kommen weg.", bild: F({ rot: 3, leer: 2 }) },
        { satz: `3 sind übrig. Also 5 ${M} 2 = 3.`, bild: F({ rot: 3 }) }] },
      { typ: "machen", text: "Jetzt du: Tipp 2 rote Punkte weg.", art: "weg", a: 5, b: 2 },
      { typ: "ergaenzen", text: "Jetzt rechnest du.", frage: `7 ${M} 3 = ?`, antwort: "4", optionen: ["3", "4", "10"] },
      { typ: "gegenbeispiel", text: `Robo zählt bei 8 ${M} 3: „8, 7, 6.“ Er sagt 6. Stimmt das?`, stimmt: false, fv: "zaehlen", warum: "Bei der 8 ist Robo schon. 3 zurück: 7, 6, 5. Also 5." },
      { typ: "geschichte", text: "Minus heißt: Es geht etwas weg.", bilder: [
        { satz: "Erst alle zählen.", bild: F({ rot: 5 }) },
        { satz: "Dann kommen welche weg.", bild: F({ rot: 3, leer: 2 }) },
        { satz: "Zum Schluss die übrigen zählen.", bild: F({ rot: 3 }) }] }
    ],
    // Zehner und Einer (04.11.2026): erst die Zehner, dann die Einzelnen – gegen „Zahl verdreht“
    zehner: [
      { typ: "zeigen", text: "Welche Zahl ist das?", bilder: [
        { satz: "Eine Stange hat 10 Punkte. Das ist ein Zehner.", bild: F({ z: 1 }) },
        { satz: "Hier sind 4 Zehner: 10, 20, 30, 40.", bild: F({ z: 4 }) },
        { satz: "Dazu kommen 7 Einzelne.", bild: F({ z: 4, rot: 7 }) },
        { satz: "4 Zehner und 7 Einzelne: 47. Man sagt „siebenundvierzig“.", bild: F({ z: 4, rot: 7 }) }] },
      { typ: "machen", text: "Jetzt du: Tipp die 7 blauen Punkte an.", art: "dazu", a: 40, b: 7 },
      { typ: "ergaenzen", text: "Jetzt du: 6 Zehner und 3 Einzelne.", frage: "Das ist die Zahl ?", antwort: "63", optionen: ["63", "36", "9"] },
      { typ: "gegenbeispiel", text: "Robo sieht 5 Zehner und 2 Einzelne. Er schreibt 25. Stimmt das?", stimmt: false, fv: "dreher", warum: "Die Zehner kommen zuerst. 5 Zehner und 2 Einzelne sind 52. Man sagt „zweiundfünfzig“." },
      { typ: "geschichte", text: "Erst die Zehner schreiben, dann die Einzelnen.", bilder: [
        { satz: "Erst die Zehner zählen.", bild: F({ z: 4 }) },
        { satz: "Dann die Einzelnen.", bild: F({ z: 4, rot: 7 }) },
        { satz: "Zehner zuerst schreiben: 47.", bild: F({ z: 4, rot: 7 }) }] }
    ],
    // Geteilt (04.11.2026): Wie oft passt die Zahl hinein? Reihen legen, bis alle Punkte da sind
    geteilt: [
      { typ: "zeigen", text: "12 : 3", bilder: [
        { satz: "12 : 3 heißt: Wie oft passt die 3 in die 12?", bild: () => reihen(3, 0, 4) },
        { satz: "Eine Reihe mit 3. Das sind 3.", bild: () => reihen(3, 1, 4) },
        { satz: "Noch zwei Reihen: 6, 9.", bild: () => reihen(3, 3, 4) },
        { satz: "Vier Reihen: 12. Also 12 : 3 = 4.", bild: () => reihen(3, 4, 4) }] },
      { typ: "machen", text: "Jetzt du: Tipp auf ➕, bis 12 Punkte da sind.", art: "gruppen", a: 4, b: 3, geteilt: true },
      { typ: "ergaenzen", text: "Jetzt rechnest du: Wie oft passt die 5 in die 20?", frage: "20 : 5 = ?", antwort: "4", optionen: ["4", "5", "15"] },
      { typ: "gegenbeispiel", text: "Robo rechnet: 15 : 3 = 12. Stimmt das?", stimmt: false, fv: "geteiltminus", warum: "Robo hat minus gerechnet. Wie oft passt die 3 in die 15? 3, 6, 9, 12, 15. Fünfmal. Also 5." },
      { typ: "geschichte", text: "Geteilt heißt: Wie oft passt die Zahl hinein?", bilder: [
        { satz: "Erst die große Zahl anschauen.", bild: () => reihen(3, 0, 4) },
        { satz: "Reihen legen, immer gleich viele.", bild: () => reihen(3, 2, 4) },
        { satz: "Die Reihen zählen: 4.", bild: () => reihen(3, 4, 4) }] }
    ],
    k3schriftplus: [
      { typ: "zeigen", text: "347 + 285 schriftlich", bilder: [
        { satz: "Schreib die Zahlen genau untereinander.", bild: () => schrift(347, 285, "+", 0) },
        { satz: "Fang rechts an: 7 + 5 = 12. Schreib die 2. Die 1 wandert nach links.", bild: () => schrift(347, 285, "+", 1, "", 0) },
        { satz: "4 + 8 + 1 = 13. Schreib die 3. Die 1 wandert weiter.", bild: () => schrift(347, 285, "+", 2, "", 1) },
        { satz: "3 + 2 + 1 = 6. Fertig: 632.", bild: () => schrift(347, 285, "+", 3, "", 2) }] },
      { typ: "machen", text: "Rechts steht 7 + 5. Tipp die blauen Punkte an.", art: "dazu", a: 7, b: 5 },
      { typ: "ergaenzen", text: "Jetzt rechnest du: 256 + 138. Rechts: 6 + 8 = 14.", frage: "Welche Zahl schreibst du unten rechts hin?", antwort: "4", optionen: ["4", "14", "1"] },
      { typ: "gegenbeispiel", text: "Robo rechnet: 465 + 278 = 633. Stimmt das?", stimmt: false, fv: "uebertrag", warum: "Robo hat die kleinen Einsen vergessen. 5 + 8 = 13, 6 + 7 + 1 = 14, 4 + 2 + 1 = 7. Also 743." },
      { typ: "geschichte", text: "Rechts anfangen. Bei 10 oder mehr wandert eine 1 nach links.", bilder: [
        { satz: "Rechts anfangen.", bild: () => schrift(347, 285, "+", 1, "", 0) },
        { satz: "Bei 10 oder mehr wandert eine 1 nach links.", bild: () => schrift(347, 285, "+", 2, "", 1) },
        { satz: "Die 1 rechnest du mit.", bild: () => schrift(347, 285, "+", 3, "", 2) }] }
    ],
    k3schriftminus: {
      abziehen: [
        { typ: "zeigen", text: `523 ${M} 147 schriftlich`, bilder: [
          { satz: "Schreib die Zahlen genau untereinander.", bild: () => schrift(523, 147, M, 0) },
          { satz: `Rechts: 3 ${M} 7 geht nicht. Tausch einen Zehner: 13 ${M} 7 = 6.`, bild: () => schrift(523, 147, M, 1, "abziehen", 0) },
          { satz: `Oben steht jetzt 1. Tausch einen Hunderter: 11 ${M} 4 = 7.`, bild: () => schrift(523, 147, M, 2, "abziehen", 1) },
          { satz: `Oben steht jetzt 4. 4 ${M} 1 = 3. Fertig: 376.`, bild: () => schrift(523, 147, M, 3, "abziehen", 2) }] },
        { typ: "machen", text: `Rechts: 3 ${M} 7. Tipp 7 rote Punkte weg.`, art: "weg", a: 13, b: 7 },
        { typ: "ergaenzen", text: `Jetzt rechnest du: 642 ${M} 318. Rechts: 2 ${M} 8 geht nicht.`, frage: `12 ${M} 8 = ?`, antwort: "4", optionen: ["4", "6", "10"] },
        { typ: "gegenbeispiel", text: `Robo rechnet: 642 ${M} 318 = 336. Stimmt das?`, stimmt: false, fv: "kleinvongross", warum: `Robo hat 8 ${M} 2 gerechnet. Weg kommt aber die untere 8. Tausch einen Zehner: 12 ${M} 8 = 4. Also 324.` },
        { typ: "geschichte", text: "Rechts anfangen. Reicht es nicht, tausch einen von links.", bilder: [
          { satz: "Rechts anfangen.", bild: () => schrift(523, 147, M, 0) },
          { satz: "Reicht es nicht? Tausch einen von links.", bild: () => schrift(523, 147, M, 1, "abziehen", 0) },
          { satz: "Links ist dann einer weniger.", bild: () => schrift(523, 147, M, 3, "abziehen", 1) }] }
      ],
      ergaenzen: [
        { typ: "zeigen", text: `523 ${M} 147 schriftlich – mit Ergänzen`, bilder: [
          { satz: "Schreib die Zahlen genau untereinander.", bild: () => schrift(523, 147, M, 0, "ergaenzen") },
          { satz: "Rechts: Von 7 bis 13 sind es 6. Unten links kommt eine kleine 1 dazu.", bild: () => schrift(523, 147, M, 1, "ergaenzen", 0) },
          { satz: "4 + 1 = 5. Von 5 bis 12 sind es 7. Wieder eine kleine 1.", bild: () => schrift(523, 147, M, 2, "ergaenzen", 1) },
          { satz: "1 + 1 = 2. Von 2 bis 5 sind es 3. Fertig: 376.", bild: () => schrift(523, 147, M, 3, "ergaenzen", 2) }] },
        { typ: "machen", text: "Von 7 bis 13: Tipp die blauen Punkte an und zähl mit.", art: "dazu", a: 7, b: 6 },
        { typ: "ergaenzen", text: `Jetzt rechnest du: 642 ${M} 318. Rechts: von 8 bis 12.`, frage: "Von 8 bis 12 sind es ?", antwort: "4", optionen: ["4", "6", "10"] },
        { typ: "gegenbeispiel", text: `Robo rechnet: 642 ${M} 318 = 334. Stimmt das?`, stimmt: false, fv: "borgen", warum: "Robo hat die kleine 1 vergessen. 1 + 1 = 2, von 2 bis 4 sind es 2. Also 324." },
        { typ: "geschichte", text: "Rechts anfangen, von unten nach oben. Über 10? Unten links eine 1 dazu.", bilder: [
          { satz: "Rechts anfangen, von unten nach oben.", bild: () => schrift(523, 147, M, 0, "ergaenzen") },
          { satz: "Über 10? Unten links eine kleine 1 dazu.", bild: () => schrift(523, 147, M, 1, "ergaenzen", 0) },
          { satz: "Die 1 rechnest du mit.", bild: () => schrift(523, 147, M, 2, "ergaenzen", 1) }] }
      ]
    }
  };
  ERKLAERUNGEN.k1plus20 = ERKLAERUNGEN.plus20; ERKLAERUNGEN.mal2 = ERKLAERUNGEN.mal1; ERKLAERUNGEN.mal3 = ERKLAERUNGEN.mal1;   // gleiche Idee „die gleiche Zahl mehrmals“
  const verfahren = () => { try { return ((W.Spielwelt && W.Spielwelt.lade("eltern")) || {}).mathe?.minus === "ergaenzen" ? "ergaenzen" : "abziehen"; } catch (e) { return "abziehen"; } };
  function fuer(station) { const e = ERKLAERUNGEN[station]; if (!e) return null; return Array.isArray(e) ? e : e[verfahren()] || e.abziehen; }
  W.MatheErklaeren = { ERKLAERUNGEN, fuer, hat: (s) => !!ERKLAERUNGEN[s], BILD, bildFuer };
})(typeof window !== "undefined" ? window : globalThis);
