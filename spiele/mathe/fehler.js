// Fehler-Ursachen im Matheweg (02.11.2026, nach dem Vorbild von Bastion, VERMITTLUNG §3) – ohne KI, nur feste Regeln:
// Typische falsche Antworten werden einem Denkfehler (Fehlvorstellung) zugeordnet. Die Erklärung richtet sich an die Ursache,
// nicht an die einzelne Aufgabe: „Du hast den Übertrag vergessen“ statt nur „falsch“.
//
// KATALOG: { id, name (nur für Eltern), kurz(o), lang(o) → drei kurze Sätze für Kinder (03.11.2026: ohne Fachwörter und ohne Überschriften; Bild aus erklaeren.js bildFuer), erkenne(o, wert), kontrast(o, zz) → Aufgabe, rueckweg? }
//   o = { a, b, op: "+"|"−"|"·"|":", c (richtiges Ergebnis) } aus aufgabe.ops oder dem Aufgabentext „34 + 28“.
// Diagnose je Denkfehler (Daten mathe.fv = { <id>: { s, z: [Zähler], k } }, mathe.fvZaehler = Anzahl beantworteter Aufgaben):
//   aufgefallen (einmal erkannt) → kurze Erklärung; vermutet (zweimal in den letzten 10 Aufgaben) → lange Erklärung + 2 Kontrastaufgaben;
//   arbeit (nach der langen Erklärung) → zwei Kontrastaufgaben beim ersten Versuch richtig → aufgeloest; danach erneut erkannt → wieder (wie vermutet).
// Schrittweg „Zeig mir deinen Weg“ für schriftliches Plus/Minus: schritte(o) → Stellen von rechts mit Ziffer, Übertrag und Prüfung je Stelle.
// Reine Logik, auch in Node nutzbar (tests/mathe-fehler.js).
(function (W) {
  const M = "−";
  const stellen = (n) => String(n).split("").reverse().map(Number);   // Einer zuerst
  const ausStellen = (d) => d.reduce((s, x, i) => s + x * Math.pow(10, i), 0);
  const STELLE = ["Einern", "Zehnern", "Hundertern", "Tausendern"];
  const STELLE1 = ["Einer", "Zehner", "Hunderter", "Tausender"];

  // ---------- Aufgabe lesen ----------
  function lies(a) {
    if (!a) return null;
    if (a.stellen) return { stellen: a.stellen, op: "stellen", c: +a.antwort };   // Kl. 3 (04.11.2026)
    if (a.runden) return { runden: a.runden, op: "runden", c: +a.antwort };
    if (a.lineal) return { lineal: a.lineal, op: "lineal", c: +a.antwort };   // Länge (04.11.2026)
    if (a.umrechnen) return { umrechnen: a.umrechnen, op: "umrechnen", c: +a.antwort };   // kg → g, km → m, € → ct (04.11.2026)
    if (a.meter) return { meter: a.meter, op: "meter", c: +a.antwort };
    if (a.geld) return { geld: a.geld, op: "geld", c: +a.antwort };   // Geld (04.11.2026): Münzen zählen
    if (a.uhr) return { uhr: a.uhr, op: "uhr", c: a.antwort };   // Uhr (04.11.2026): Auswahl-Aufgabe mit Stunde/Minute
    if (a.ops) return Object.assign({ c: +a.antwort }, a.ops);
    const m = /^(\d+) ([+−·:]) (\d+)$/.exec(a.text || "");
    // (04.11.2026) ohne Rechnung (z. B. „Welche Zahl ist das?“) nur das Ergebnis – reicht für „Zahl verdreht“
    if (!m || (a.text || "").includes("?")) return /^\d+$/.test(String(a.antwort)) ? { a: null, b: null, op: "", c: +a.antwort } : null;
    return { a: +m[1], op: m[2], b: +m[3], c: +a.antwort };
  }

  // ---------- Rechenhilfen ----------
  // Ziffernweise ohne Übertrag (Plus) bzw. ziffernweise „kleinere von größerer“ (Minus)
  function ohneUebertrag(a, b) { const x = stellen(a), y = stellen(b), n = Math.max(x.length, y.length); const d = []; for (let i = 0; i < n; i++) d.push(((x[i] || 0) + (y[i] || 0)) % 10); return ausStellen(d); }
  function hatUebertrag(a, b) { const x = stellen(a), y = stellen(b); let c = 0; for (let i = 0; i < Math.max(x.length, y.length); i++) { const s = (x[i] || 0) + (y[i] || 0) + c; if (s >= 10) return true; c = 0; } return false; }
  function kleinVonGross(a, b) { const x = stellen(a), y = stellen(b); return ausStellen(x.map((d, i) => Math.abs(d - (y[i] || 0)))); }
  function hatBorgen(a, b) { const x = stellen(a), y = stellen(b); let c = 0; for (let i = 0; i < x.length; i++) { if (x[i] - c < (y[i] || 0)) return true; c = 0; } return false; }
  // geborgt, aber die nächste Stelle nicht verkleinert
  function borgenVergessen(a, b) { const x = stellen(a), y = stellen(b); return ausStellen(x.map((d, i) => { const e = y[i] || 0; return d < e ? d + 10 - e : d - e; })); }

  // (06.11.2026) Schriftlich mal mit mehrstelliger Zahl: je Ziffer der zweiten Zahl (von links) eine Zeile; k = wie weit die Zeile eingerückt ist
  function zeilen(o) { const d = String(o.b).split("").map(Number); return d.map((x, j) => ({ d: x, k: d.length - 1 - j, wert: o.a * x })); }
  const ohneEinruecken = (o) => zeilen(o).reduce((n, z) => n + z.wert, 0);
  // ---------- Zufall (Startzahl aus aufgaben.js, sonst Math.random) ----------
  const r = (zz, a, b) => a + Math.floor(zz() * (b - a + 1));

  // (11.11.2026) Eltern-Wahl „Ergänzen“ gilt auch für die Hinweise; „schriftlich“ = dreistellige Rechnung (dort gibt es die kleine 1)
  const minusArt = () => { try { return (((W.Spielwelt.lade("eltern") || {}).mathe || {}).minus) === "ergaenzen" ? "ergaenzen" : "abziehen"; } catch (e) { return "abziehen"; } };
  const schriftlich = (o) => o.a >= 100 || o.b >= 100;
  const ergaenzt = (o) => schriftlich(o) && minusArt() === "ergaenzen";
  // ---------- Katalog ----------
  const KATALOG = [
    { id: "op", name: "Rechenzeichen verwechselt",
      erkenne: (o, w) => (o.op === "+" && o.a > o.b && w === o.a - o.b) || (o.op === M && w === o.a + o.b) || (o.op === "·" && o.a && o.b && w === o.a + o.b && o.a * o.b !== o.a + o.b) || (o.op === ":" && w === o.a * o.b),
      kurz: (o) => `Schau aufs Zeichen: Da steht ${o.op === "·" ? "mal" : o.op === ":" ? "geteilt" : o.op === "+" ? "plus" : "minus"}.`,
      lang: (o) => [`Da steht ${({ "+": "plus", [M]: "minus", "·": "mal", ":": "geteilt" })[o.op]}, nicht ${({ "+": "minus", [M]: "plus", "·": "plus", ":": "mal" })[o.op]}.`,
        o.op === ":" ? `${o.a} : ${o.b} heißt: Wie oft passt die ${o.b} in die ${o.a}?` : `${o.a} ${o.op} ${o.b} heißt: ${({ "+": "dazutun", [M]: "wegnehmen", "·": `${o.a}-mal die ${o.b}` })[o.op]}.`,
        `Darum: ${o.a} ${o.op} ${o.b} = ${o.c}.`],
      kontrast: (o, zz) => { const a = r(zz, 12, 40), b = r(zz, 2, 9); return zr(zz() < 0.5 ? "+" : M, a, b, "Lies zuerst das Rechenzeichen."); } },
    { id: "kleinvongross", name: "Kleinere von der größeren Ziffer abgezogen",
      erkenne: (o, w) => o.op === M && hatBorgen(o.a, o.b) && w === kleinVonGross(o.a, o.b) && w !== o.c,
      kurz: (o) => { const x = stellen(o.a)[0], y = stellen(o.b)[0]; if (ergaenzt(o)) return x < y ? `Von ${y} bis ${x} geht nicht. Zähl bis ${x + 10} und schreib unten links eine kleine 1.` : "Reicht es oben nicht? Dann zähl bis zur Zahl mit 10 mehr."; return x < y ? `${x} ${M} ${y} geht nicht. Umdrehen darfst du nicht – tausch einen Zehner.` : "Oben reicht es nicht? Dann tausch einen von links."; },
      lang: (o) => [`Du hast oben und unten umgedreht.`,
        ergaenzt(o) ? `Zähl immer von unten nach oben. Reicht es nicht, zählst du bis zur Zahl mit 10 mehr. Dann schreibst du unten links eine kleine 1.` : `Weg kommt immer die untere Zahl. Reicht es nicht, tauschst du einen Zehner in 10 Einzelne.`,
        `Darum: ${o.a} ${M} ${o.b} = ${o.c}.`],
      kontrast: (o, zz) => { let a, b; do { a = r(zz, 3, 9) * 10 + r(zz, 0, 6); b = r(zz, 1, 5) * 10 + r(zz, 1, 9); } while (b % 10 <= a % 10 || b >= a); return zr(M, a, b, `Bei den Einzelnen reicht ${a % 10} nicht: Tausch einen Zehner in 10 Einzelne.`); } },
    { id: "borgen", name: "Geborgt, aber nicht abgezogen",
      erkenne: (o, w) => o.op === M && hatBorgen(o.a, o.b) && w === borgenVergessen(o.a, o.b) && w !== o.c && w !== kleinVonGross(o.a, o.b),
      kurz: (o) => ergaenzt(o) ? "Denk an die kleine 1 unten. Sie zählt links mit." : "Du hast einen Zehner getauscht – dann ist links einer weniger.",
      lang: (o) => [ergaenzt(o) ? `Du hast bis zur Zahl mit 10 mehr gezählt.` : `Den Zehner hast du dir geholt.`,
        ergaenzt(o) ? `Dafür steht unten links eine kleine 1. Sie zählt dort mit.` : `Links fehlt er dann. Dort ist einer weniger.`,
        `Darum: ${o.a} ${M} ${o.b} = ${o.c}.`],
      kontrast: (o, zz) => KATALOG[1].kontrast(o, zz) },
    { id: "uebertrag", name: "Übertrag vergessen",
      erkenne: (o, w) => o.op === "+" && hatUebertrag(o.a, o.b) && w === ohneUebertrag(o.a, o.b) && w !== o.c,
      kurz: (o) => { if (o.op === "·") return "Die Zahl, die du dir merkst, kommt links dazu."; const x = stellen(o.a)[0], y = stellen(o.b)[0]; return x + y >= 10 ? `${x} + ${y} = ${x + y}. Der Zehner muss mit zu den Zehnern.` : "Kommt 10 oder mehr heraus, wandert eine 1 nach links."; },
      lang: (o) => { const x = stellen(o.a)[0], y = stellen(o.b)[0]; return [x + y >= 10 ? `${x} und ${y} sind ${x + y}.` : "Irgendwo kommt 10 oder mehr heraus.",
        `Aus 10 Einzelnen machst du einen Zehner. Er wandert nach links.`,
        `Darum: ${o.a} + ${o.b} = ${o.c}.`]; },
      kontrast: (o, zz) => { let a, b; do { a = r(zz, 1, 6) * 10 + r(zz, 3, 9); b = r(zz, 1, 3) * 10 + r(zz, 3, 9); } while ((a % 10) + (b % 10) <= 10 || a + b > 100); return zr("+", a, b, `${a % 10} + ${b % 10} ist mehr als 9: Ein Zehner wandert nach links.`); } },
    { id: "uebertragdoppelt", name: "Zehner zweimal gezählt",
      erkenne: (o, w) => o.op === "+" && hatUebertrag(o.a, o.b) && w === o.c + 10,
      kurz: (o) => schriftlich(o) ? "Die kleine 1 zählst du nur einmal." : "Den neuen Zehner zählst du nur einmal.",
      lang: (o) => [`Du hast einen Zehner zu viel.`,
        schriftlich(o) ? `Die kleine 1 kommt nur einmal dazu.` : `Der neue Zehner kommt nur einmal dazu.`,
        `Darum: ${o.a} + ${o.b} = ${o.c}.`],
      kontrast: (o, zz) => KATALOG[3].kontrast(o, zz) },
    { id: "stellenwert", name: "Einer zu den Zehnern gerechnet",
      erkenne: (o, w) => o.b < 10 && o.a >= 10 && ((o.op === "+" && w === o.a + 10 * o.b) || (o.op === M && w === o.a - 10 * o.b)),
      kurz: (o) => `${o.b} sind ${o.b} Einzelne, keine Zehner.`,
      lang: (o) => [`Die ${o.b} sind keine Zehner.`,
        `${o.a} hat ${Math.floor(o.a / 10)} Zehner und ${o.a % 10} Einzelne. Die ${o.b} kommt zu den Einzelnen.`,
        `Darum: ${o.a} ${o.op} ${o.b} = ${o.c}.`],
      kontrast: (o, zz) => { const a = r(zz, 2, 8) * 10 + r(zz, 1, 4), b = r(zz, 2, 5); return zr(zz() < 0.5 ? "+" : M, a, b, "Einzelne zu den Einzelnen, Zehner zu den Zehnern."); } },
    { id: "zaehlen", name: "Beim Zählen die Startzahl mitgezählt",
      erkenne: (o, w) => o.b <= 10 && ((o.op === "+" && w === o.c - 1) || (o.op === M && w === o.c + 1)),
      kurz: (o) => `Bei der ${o.a} bist du schon. Zähl ab der ${o.op === "+" ? o.a + 1 : o.a - 1}.`,
      lang: (o) => [`Du hast die ${o.a} mitgezählt.`,
        `Bei der ${o.a} bist du schon. Der erste Schritt geht zur ${o.op === "+" ? o.a + 1 : o.a - 1}.`,
        `Darum: ${o.a} ${o.op} ${o.b} = ${o.c}.`],
      kontrast: (o, zz) => { const op = zz() < 0.6 ? "+" : M, b = r(zz, 2, 5), a = r(zz, 4, 14) + (op === M ? b : 0); return zr(op, a, b, `Zähle ${b} Schritte – der erste Schritt geht schon weg von der Startzahl.`); } },
    { id: "malreihe", name: "Eine Reihe daneben",
      erkenne: (o, w) => o.op === "·" && o.a && o.b && w > 0 && w !== o.c && (w === o.c + o.a || w === o.c - o.a || w === o.c + o.b || w === o.c - o.b),
      kurz: (o) => `Fast! Ein Schritt zu viel oder zu wenig. Zähl nach: ${o.a}-mal die ${o.b}.`,
      lang: (o) => [`Du bist einen Schritt verrutscht.`,
        `${o.a} · ${o.b} heißt: ${o.a}-mal die ${o.b}.`,
        `Zähl in ${o.b}er-Schritten. Dann: ${o.a} · ${o.b} = ${o.c}.`],
      kontrast: (o, zz) => { const a = o.a > 1 && o.a <= 10 ? o.a : r(zz, 3, 9), b = r(zz, 3, 9); return zr("·", a, b, `${a}-mal die ${b}: Zähle die Schritte genau.`); } },
    // (04.11.2026) Einmaleins und Geteilt: mal 0, geteilt mit minus verwechselt, eine Gruppe daneben
    { id: "malnull", name: "Mal 0 nicht als „keinmal“ verstanden",
      erkenne: (o, w) => o.op === "·" && (o.a === 0 || o.b === 0) && w !== 0 && (w === o.a + o.b || w === 1),
      kurz: () => "Mal 0 heißt: keinmal. Da ist nichts. Also 0.",
      lang: (o) => { const n = o.a || o.b; return [`${o.a} · ${o.b} heißt: ${o.a}-mal die ${o.b}.`,
        o.a === 0 ? `Keinmal die ${o.b}: Da liegt nichts.` : `${o.a}-mal nichts: Da liegt auch nichts.`,
        `Darum: ${o.a} · ${o.b} = 0. Mit ${n} oder jeder anderen Zahl.`]; },
      kontrast: (o, zz) => { const n = r(zz, 2, 9); return zz() < 0.5 ? zr("·", n, 0, `${n}-mal nichts ist nichts.`) : zr("·", 0, n, `Keinmal die ${n}: nichts.`); } },
    { id: "geteiltminus", name: "Geteilt mit Minus verwechselt",
      erkenne: (o, w) => o.op === ":" && w === o.a - o.b && w !== o.c,
      kurz: () => "Da steht geteilt, nicht minus. Wie oft passt die Zahl hinein?",
      lang: (o) => [`Da steht geteilt, nicht minus.`,
        `${o.a} : ${o.b} heißt: Wie oft passt die ${o.b} in die ${o.a}?`,
        `Zähl in ${o.b}er-Schritten bis ${o.a}. Das geht ${o.c}-mal. Also ${o.c}.`],
      kontrast: (o, zz) => { const b = o.b > 1 && o.b <= 10 ? o.b : r(zz, 2, 5), q = r(zz, 3, 9); return zr(":", b * q, b, `Wie oft passt die ${b} in die ${b * q}? Zähl in ${b}er-Schritten.`); } },
    { id: "geteiltreihe", name: "Geteilt: eine Gruppe daneben",
      erkenne: (o, w) => o.op === ":" && w > 0 && (w === o.c + 1 || w === o.c - 1),
      kurz: (o) => `Fast! Zähl nach: Wie oft passt die ${o.b} in die ${o.a}?`,
      lang: (o) => o.c > 10 ? [`Du bist eine Gruppe verrutscht.`,
        `Mach die Probe mit mal: ${o.c} · ${o.b} = ${o.a}.`,
        `Also ${o.a} : ${o.b} = ${o.c}.`] : [`Du bist eine Gruppe verrutscht.`,
        `Zähl in ${o.b}er-Schritten: ${Array.from({ length: Math.min(o.c, 10) }, (_, i) => o.b * (i + 1)).join(", ")}.`,
        `Das sind ${o.c} Schritte. Also ${o.a} : ${o.b} = ${o.c}.`],
      kontrast: (o, zz) => { const b = o.b > 1 && o.b <= 10 ? o.b : r(zz, 2, 9), q = r(zz, 3, 9); return zr(":", b * q, b, `Zähl in ${b}er-Schritten bis ${b * q}.`); } }
  ];
  // Zahlwort 13–99 („siebenundvierzig“) für „Zahl verdreht“
  function zahlwort(n) {
    const E1 = ["", "ein", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun"], Z1 = ["", "zehn", "zwanzig", "dreißig", "vierzig", "fünfzig", "sechzig", "siebzig", "achtzig", "neunzig"];
    const z = Math.floor(n / 10), e = n % 10;
    if (z === 1) return ({ 6: "sechzehn", 7: "siebzehn" })[e] || E1[e] + "zehn";
    return (e ? E1[e] + "und" : "") + Z1[z];
  }
  const dreht = (c) => c >= 13 && c < 100 && c % 10 !== 0 && Math.floor(c / 10) !== c % 10;
  // (06.11.2026) Mal mehrstellig: Teilergebnisse ohne Einrücken addiert (234 · 26 → 468 + 1404 = 1872 statt 4680 + 1404)
  KATALOG.push({ id: "verrueckt", name: "Mal mehrstellig: Zeilen nicht eingerückt",
    erkenne: (o, w) => o.op === "·" && o.a >= 10 && o.b >= 10 && !(o.a === 10 && o.b === 10) && w === ohneEinruecken(o) && w !== o.c,
    kurz: () => "Jede neue Zeile rückt einen Platz weiter nach rechts.",
    lang: (o) => { const z = zeilen(o); return ["Du hast die Zeilen nicht eingerückt.",
      `${o.a} · ${z[0].d} heißt hier ${o.a} · ${z[0].d * 10 ** z[0].k} = ${z[0].wert * 10 ** z[0].k}.`,
      `Darum: ${z.map(x => x.wert * 10 ** x.k).join(" + ")} = ${o.c}.`]; },
    kontrast: (o, zz) => zr("·", r(zz, 102, 489), r(zz, 12, 39), "Jede Zeile rückt einen Platz weiter nach rechts.") });
  KATALOG.push({ id: "dreher", name: "Zahl verdreht (Zehner und Einer vertauscht)",
    erkenne: (o, w) => dreht(o.c) && w === (o.c % 10) * 10 + Math.floor(o.c / 10),
    kurz: (o) => `Verdreht? Man sagt „${zahlwort(o.c)}“. Geschrieben kommt die ${Math.floor(o.c / 10)} zuerst.`,
    lang: (o) => [`Du hast die Zahl verdreht.`, `Wir sagen „${zahlwort(o.c)}“. Die ${o.c % 10} hört man zuerst.`, `Geschrieben kommt die ${Math.floor(o.c / 10)} zuerst: ${o.c}.`],
    kontrast: (o, zz) => {
      let a, b, op, c;
      do { op = o.op === M ? M : "+"; a = r(zz, 12, 80); b = r(zz, 3, 19); if (op === M) { const t = a; a = Math.max(t, b) + 20; } c = op === "+" ? a + b : a - b; } while (!dreht(c));
      return zr(op, a, b, "Erst die Zehner hinschreiben, dann die Einzelnen.");
    } });
  // Uhr (04.11.2026): Zeiger vertauscht, Stunde daneben (bei halb/Viertel ist der kurze Zeiger schon über die Zahl hinaus)
  const uhrText = (h, m) => `${((h - 1 + 12) % 12) + 1}:${String(m).padStart(2, "0")}`;
  const uhrWort = (h, m) => ({ 0: `${h} Uhr`, 30: `halb ${(h % 12) + 1}`, 15: `Viertel nach ${h}`, 45: `Viertel vor ${(h % 12) + 1}` })[m] || uhrText(h, m) + " Uhr";
  function uhrAufgabe(h, m, zz) {
    const richtig = uhrText(h, m), falsch = [uhrText(m === 0 ? 12 : Math.round(m / 5), (h % 12) * 5), uhrText(h + 1, m), uhrText(h - 1, m), uhrText(h, (m + 30) % 60)].filter((x, i, l) => x !== richtig && l.indexOf(x) === i);
    const opt = [richtig, ...falsch.slice(0, 3)].map(x => [zz(), x]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
    const B = (W.Mathe && W.Mathe._bilder && W.Mathe._bilder.uhrBild) || (W.MatheErklaeren && W.MatheErklaeren.BILD.uhr);
    return { text: "", frage: "Wie spät ist es?", antwort: richtig, art: "wahl", optionen: opt, bild: B ? B(h, m) : undefined, nurLuecke: true, uhr: { h, m },
      hilfe: `Der kurze Zeiger zeigt die Stunde, der lange die Minuten. Es ist ${richtig} Uhr, also ${uhrWort(h, m)}.` };
  }
  KATALOG.push({ id: "zeigervertauscht", name: "Uhr: Stunden- und Minutenzeiger vertauscht",
      erkenne: (o, w) => !!o.uhr && w === uhrText(o.uhr.m === 0 ? 12 : Math.round(o.uhr.m / 5), (o.uhr.h % 12) * 5) && w !== o.c,
      kurz: () => "Der kurze Zeiger zeigt die Stunde, der lange die Minuten.",
      lang: (o) => [`Du hast die Zeiger verwechselt.`, `Der kurze Zeiger zeigt die Stunde: ${o.uhr.h}.`, `Darum ist es ${uhrWort(o.uhr.h, o.uhr.m)}.`],
      kontrast: (o, zz) => { let h; do { h = r(zz, 1, 12); } while (h === o.uhr.h); return uhrAufgabe(h, o.uhr.m, zz); } },
    { id: "stundedaneben", name: "Uhr: Stunde daneben abgelesen",
      erkenne: (o, w) => !!o.uhr && (w === uhrText(o.uhr.h + 1, o.uhr.m) || w === uhrText(o.uhr.h - 1, o.uhr.m)) && w !== o.c,
      kurz: (o) => o.uhr.m ? "Schau genau: Der kurze Zeiger ist schon über die Zahl hinaus." : `Schau genau: Der kurze Zeiger zeigt auf die ${o.uhr.h}.`,
      lang: (o) => [`Schau genau auf den kurzen Zeiger.`, o.uhr.m ? `Er ist an der ${o.uhr.h} vorbei, aber noch nicht bei der ${(o.uhr.h % 12) + 1}.` : `Er zeigt genau auf die ${o.uhr.h}.`, `Darum ist es ${uhrWort(o.uhr.h, o.uhr.m)}.`],
      kontrast: (o, zz) => { let h; do { h = r(zz, 1, 12); } while (h === o.uhr.h); return uhrAufgabe(h, o.uhr.m === 0 ? 30 : o.uhr.m, zz); } });
  // Geld (04.11.2026): Münzen gezählt statt ihre Werte addiert
  function geldAufgabe(zz) {
    let st, s; do { st = Array.from({ length: r(zz, 3, 4) }, () => [1, 2, 5, 10, 20, 50][r(zz, 0, 5)]).sort((x, y) => y - x); s = st.reduce((x, y) => x + y, 0); } while (s > 99 || s === st.length);
    const B = W.Mathe && W.Mathe._bilder && W.Mathe._bilder.geldBild;
    return { text: "", frage: "Wie viel Geld ist das?", antwort: String(s), art: "zahl", einheit: "ct", nurLuecke: true, geld: st, bild: B ? B(st, "ct") : (W.MatheErklaeren ? W.MatheErklaeren.BILD.geld(st) : undefined),
      hilfe: `Fang mit der größten Münze an und zähl weiter: ${st.join(" ct + ")} ct = ${s} ct` };
  }
  KATALOG.push({ id: "muenzenzaehlen", name: "Geld: Münzen gezählt statt Werte addiert",
    erkenne: (o, w) => !!o.geld && w === o.geld.length && w !== o.c,
    kurz: () => "Zähl nicht die Münzen. Zähl, was draufsteht.",
    lang: (o) => [`Du hast die Münzen gezählt.`, `Jede Münze ist so viel wert, wie draufsteht.`, `Zusammen: ${o.geld.join(" + ")} = ${o.c}.`],
    kontrast: (o, zz) => geldAufgabe(zz) });
  // Länge (04.11.2026): am Lineal nur das Ende abgelesen; 1 m für 10 cm gehalten
  function aus(station, zz, passt) { for (let i = 0; i < 200 && W.Mathe; i++) { const t = W.Mathe.aufgabe(station, Math.floor(zz() * 4294967296)); if (t && passt(t)) return t; } return null; }
  KATALOG.push({ id: "linealende", name: "Länge: am Lineal nur das Ende abgelesen",
      erkenne: (o, w) => !!o.lineal && o.lineal.start > 0 && w === o.lineal.start + o.lineal.l,
      kurz: (o) => `Der Stift fängt bei ${o.lineal.start} an, nicht bei 0. Zähl die Schritte.`,
      lang: (o) => [`Du hast nur das Ende abgelesen.`, `Der Stift fängt bei ${o.lineal.start} an, nicht bei 0.`, `Von ${o.lineal.start} bis ${o.lineal.start + o.lineal.l} sind es ${o.lineal.l} Schritte. Also ${o.lineal.l} cm.`],
      kontrast: (o, zz) => aus("laenge", zz, (t) => t.lineal && t.lineal.start > 0) || { text: "", frage: "Wie lang ist der Stift?", antwort: "5", art: "zahl", einheit: "cm", nurLuecke: true, lineal: { start: 2, l: 5 }, hilfe: "Von 2 bis 7 sind es 5 cm." } },
    { id: "meter", name: "Länge: 1 m für 10 cm gehalten",
      erkenne: (o, w) => !!o.meter && (w === o.meter * 10 || w === o.meter) && w !== o.c,
      kurz: () => "1 Meter sind 100 Zentimeter.",
      lang: (o) => [`Ein Meter ist so lang wie 100 Zentimeter.`, `${o.meter} Meter sind ${o.meter}-mal 100.`, `Also ${o.meter} m = ${o.meter * 100} cm.`],
      kontrast: (o, zz) => { let m; do { m = r(zz, 1, 9); } while (m === o.meter); return { text: `${m} m = ? cm`, antwort: String(m * 100), art: "zahl", einheit: "", meter: m, max: 3, hilfe: `1 m sind 100 cm. ${m} m sind ${m * 100} cm.` }; } });
  // Kl. 3 (04.11.2026): Null weggelassen (305 → 35), falsch gerundet
  const ohneNull = (c) => +String(c).replace(/0/g, "");
  function stellenAufgabe(zz) {
    let n; do { n = r(zz, 101, 990); } while (!/0/.test(String(n).slice(1)));
    const B = W.Mathe && W.Mathe._bilder && W.Mathe._bilder.stellenBild;
    return { text: "", frage: "Welche Zahl ist das?", antwort: String(n), art: "zahl", nurLuecke: true, stellen: n, bild: B ? B(n) : undefined,
      hilfe: `${Math.floor(n / 100)} Hunderter, ${Math.floor(n / 10) % 10} Zehner und ${n % 10} Einer sind ${n}.` };
  }
  function rundenAufgabe(zz, hoch) {
    let n; do { n = r(zz, 101, 989); } while ((n % 10 >= 5) !== hoch || n % 10 === 0);
    const z = Math.round(n / 10) * 10;
    return { text: "", frage: `Runde ${n} auf Zehner.`, antwort: String(z), art: "zahl", nurLuecke: true, runden: n,
      hilfe: `Schau auf die Einer: ${n % 10}. ${hoch ? "Ab 5 wird aufgerundet" : "Unter 5 wird abgerundet"} → ${z}.` };
  }
  KATALOG.push({ id: "nullvergessen", name: "Null weggelassen (305 → 35)",
      erkenne: (o, w) => !!o.stellen && /0/.test(String(o.c)) && o.c >= 100 && w === ohneNull(o.c),
      kurz: (o) => `Die Null darf nicht fehlen. Sie zeigt: keine ${Math.floor(o.c / 10) % 10 === 0 ? "Zehner" : "Einzelnen"}.`,
      lang: (o) => [`Du hast die Null weggelassen.`, `Das sind ${Math.floor(o.c / 100)} Hunderter, ${Math.floor(o.c / 10) % 10} Zehner und ${o.c % 10} Einzelne.`, `Die Null hält den Platz frei: ${o.c}.`],
      kontrast: (o, zz) => stellenAufgabe(zz) },
    { id: "falschgerundet", name: "Falsch gerundet (auf- und abrunden verwechselt)",
      erkenne: (o, w) => !!o.runden && o.runden % 10 !== 0 && w === (o.runden % 10 >= 5 ? Math.floor(o.runden / 10) * 10 : Math.ceil(o.runden / 10) * 10),
      kurz: (o) => o.runden % 10 >= 5 ? `Hinten steht ${o.runden % 10}. Ab 5 geht es hoch.` : `Hinten steht ${o.runden % 10}. Unter 5 geht es runter.`,
      lang: (o) => [`Schau auf die letzte Zahl: ${o.runden % 10}.`, o.runden % 10 >= 5 ? `Das ist 5 oder mehr. Dann geht es zum nächsten Zehner hoch.` : `Das ist weniger als 5. Dann bleibt der Zehner.`, `Darum ist ${o.runden} ungefähr ${o.c}.`],
      kontrast: (o, zz) => rundenAufgabe(zz, o.runden % 10 >= 5) });
  // Einheiten (04.11.2026): 1 kg = 1000 g, nicht 100 g – eine Null zu wenig oder zu viel
  const WORT = { kg: "Kilogramm", g: "Gramm", km: "Kilometer", m: "Meter", "€": "Euro", ct: "Cent", l: "Liter", ml: "Milliliter" };
  KATALOG.push({ id: "umrechnen", name: "Einheiten: eine Null zu wenig oder zu viel (1 kg = 100 g)",
    erkenne: (o, w) => !!o.umrechnen && w !== o.c && [o.umrechnen.n * o.umrechnen.f / 10, o.umrechnen.n * o.umrechnen.f * 10, o.umrechnen.n].includes(w),
    kurz: (o) => `1 ${WORT[o.umrechnen.von]} sind ${o.umrechnen.f} ${WORT[o.umrechnen.nach]}.`,
    lang: (o) => { const u = o.umrechnen; return [`Zähl die Nullen genau.`, `1 ${WORT[u.von]} sind ${u.f} ${WORT[u.nach]}.`, `${u.n}-mal ${u.f} sind ${u.n * u.f}. Also ${u.n * u.f} ${u.nach}.`]; },
    kontrast: (o, zz) => { const u = o.umrechnen; let n; do { n = r(zz, 2, 9); } while (n === u.n);
      return { text: "", frage: `Wie viele ${WORT[u.nach]} sind ${n} ${u.von}?`, antwort: String(n * u.f), art: "zahl", einheit: u.nach, nurLuecke: true, max: 7, umrechnen: Object.assign({}, u, { n }), hilfe: `1 ${u.von} sind ${u.f} ${u.nach}. ${n} ${u.von} sind ${n * u.f} ${u.nach}.` }; } });
  // Schriftlich geteilt (04.11.2026): der Rest wird nicht vor die nächste Zahl geschrieben – nur im Schrittweg erkennbar
  KATALOG.push({ id: "restvergessen", name: "Schriftlich geteilt: Rest nicht mitgenommen",
    erkenne: () => false,
    kurz: () => "Der Rest wandert vor die nächste Zahl.",
    lang: (o) => [`Du hast den Rest vergessen.`, `Was übrig bleibt, schreibst du vor die nächste Zahl.`, `Dann rechnest du damit weiter: ${o.a} : ${o.b} = ${o.c}.`],
    kontrast: (o, zz) => { const b = o.b > 1 && o.b < 10 ? o.b : r(zz, 3, 7); let q, a; do { q = r(zz, 21, Math.floor(999 / b)); a = q * b; } while (a < 100 || Math.floor(a / 100) % b === 0); return zr(":", a, b, "Teile von links. Der Rest wandert vor die nächste Zahl."); } });
  const fv = (id) => KATALOG.find(f => f.id === id);
  // Aufgabe in derselben Form wie zahl() in aufgaben.js
  function zr(op, a, b, hilfe) {
    const c = op === "+" ? a + b : op === M ? a - b : op === "·" ? a * b : a / b;
    return { text: `${a} ${op} ${b}`, antwort: String(c), art: "zahl", hilfe, ops: { a, b, op } };
  }

  // Welche Denkfehler passen zu dieser falschen Antwort? (höchstens einer, in Katalog-Reihenfolge)
  function erkenne(a, wert) {
    const o = lies(a); if (!o) return null;
    const w = o.uhr ? String(wert) : +wert; if ((!o.uhr && !isFinite(w)) || w === o.c) return null;
    const f = KATALOG.find(x => x.erkenne(o, w));
    return f ? { id: f.id, name: f.name, kurz: f.kurz(o), lang: f.lang(o) } : null;
  }

  // ---------- Diagnose (reine Datenlogik) ----------
  const FENSTER = 10;
  // d = mathe-Daten (wird verändert); gibt den neuen Zustand zurück
  function melde(d, id) {
    d.fv = d.fv || {}; const z = d.fvZaehler || 0;
    const e = d.fv[id] = d.fv[id] || { s: "", z: [], k: 0 };
    e.z = e.z.filter(x => z - x < FENSTER).concat([z]).slice(-5);
    if (e.s === "aufgeloest") e.s = "wieder";
    else if (e.s === "arbeit" || e.s === "vermutet" || e.s === "wieder") { e.s = "vermutet"; e.k = 0; }
    else e.s = e.z.length >= 2 ? "vermutet" : "aufgefallen";
    return e.s;
  }
  const zaehle = (d) => { d.fvZaehler = (d.fvZaehler || 0) + 1; };
  function inArbeit(d, id) { const e = (d.fv || {})[id]; if (e && (e.s === "vermutet" || e.s === "wieder")) { e.s = "arbeit"; e.k = 0; } }
  function kontrastErgebnis(d, id, richtig) {
    const e = (d.fv || {})[id]; if (!e || e.s !== "arbeit") return e ? e.s : "";
    if (richtig) { e.k++; if (e.k >= 2) { e.s = "aufgeloest"; e.k = 0; } }
    return e.s;
  }
  // Tipps für Eltern (04.11.2026): eine kurze Idee für zu Hause je Denkfehler, ohne Arbeitsblatt
  const TIPP = {
    verrueckt: "Auf Kästchenpapier rechnen: Jede Zeile beginnt genau unter der Zahl, mit der gerade malgenommen wird.",
    op: "Vor dem Rechnen das Zeichen laut vorlesen lassen: „plus“, „minus“, „mal“.",
    kleinvongross: "Mit Münzen spielen: Reicht es nicht, wird ein 10-Cent-Stück in zehn 1-Cent-Stücke getauscht.",
    borgen: "Beim Tauschen sichtbar machen: den getauschten Zehner wirklich wegnehmen (Münze, Stange, Strich).",
    uebertrag: "Zehn 1-Cent-Münzen gegen ein 10-Cent-Stück tauschen – „aus 10 Einzelnen wird ein Zehner“.",
    uebertragdoppelt: "Die kleine 1 nach dem Dazurechnen durchstreichen lassen, dann wird sie nicht doppelt gezählt.",
    stellenwert: "Zahlen mit Geld legen: 34 Cent = drei 10-Cent-Stücke und vier 1-Cent-Stücke.",
    zaehlen: "Auf einer Treppe oder einem Zahlenstrahl hüpfen: Der erste Sprung geht schon weg von der Startzahl.",
    malreihe: "Einmaleins-Reihen beim Treppensteigen oder Klatschen mitsprechen (3, 6, 9, …).",
    malnull: "Ganz konkret fragen: „Dreimal nichts – wie viel ist das?“",
    geteiltminus: "Geteilt als Verteilen spielen: 12 Gummibärchen gerecht auf 3 Teller verteilen.",
    geteiltreihe: "Beim Teilen die Reihe mitzählen und die Schritte mit den Fingern zeigen.",
    dreher: "Zahlen diktieren und zuerst die Zehner schreiben lassen – auch wenn man „zweiundsechzig“ sagt.",
    zeigervertauscht: "Eine echte Uhr anschauen: erst den kurzen Zeiger suchen, dann den langen.",
    stundedaneben: "Bei „halb“ zeigen: Der kurze Zeiger steht zwischen zwei Zahlen.",
    muenzenzaehlen: "Beim Einkaufen echtes Kleingeld zählen lassen, mit der größten Münze anfangen.",
    linealende: "Gegenstände messen, die nicht bei 0 anfangen, und die Zentimeter-Schritte abzählen.",
    meter: "Mit einem Zollstock zeigen: 1 Meter hat 100 Zentimeter.",
    nullvergessen: "Zahlen in eine Tabelle H | Z | E schreiben – leere Felder bekommen eine 0.",
    restvergessen: "Mit Geld teilen: 7 Zehner-Münzen auf 3 Kinder – der übrige Zehner wird in Einer getauscht und weiterverteilt.",
    umrechnen: "Beim Einkaufen und Wiegen fragen: „Wie viel Gramm sind 1 Kilo?“ – Packungen mit 1000 g zeigen.",
    falschgerundet: "Beim Einkaufen Preise runden: „Ist 3,47 € näher an 3,40 € oder an 3,50 €?“"
  };
  const ZUSTAND = { aufgefallen: "einmal aufgefallen", vermutet: "kommt öfter vor", arbeit: "wird geübt", aufgeloest: "aufgelöst ✓", wieder: "ist wieder da" };
  function liste(d) { return Object.entries(d.fv || {}).filter(([id, e]) => fv(id) && e.s).map(([id, e]) => ({ id, name: fv(id).name, s: e.s, text: ZUSTAND[e.s], tipp: TIPP[id] || "" })); }
  function kontraste(a, id, zz = Math.random) { const o = lies(a), f = fv(id); return o && f ? [f.kontrast(o, zz), f.kontrast(o, zz)].map(k => Object.assign(k, { kontrast: id })) : []; }

  // ---------- Schrittweg: schriftlich plus und minus ----------
  // Stellen von rechts; je Stelle: Ziffern x, y, Übertrag/Borgen vorher (ein), richtige Ziffer, Übertrag danach (aus)
  function schritte(a) {
    const o = lies(a); if (!o) return null;
    if (o.op === "·" && o.b >= 10 && o.a >= 10) {   // (06.11.2026) mal mehrstellig: erst jede Zeile, dann zusammenzählen
      const z = zeilen(o), liste = z.map((x, j) => ({ art: "zeile", j, i: x.k, x: o.a, y: x.d, ziffer: x.wert, k: x.k }));
      liste.push({ art: "summe", j: z.length, i: -1, teile: z.map(x => x.wert * 10 ** x.k), ziffer: o.c });
      return { o, liste, zeilen: true };
    }
    if ((o.op !== "+" && o.op !== M && !(o.op === "·" && o.b < 10 && o.a >= 10) && !(o.op === ":" && o.b < 10 && o.a >= 10 * o.b && o.a % o.b === 0))) return null;
    if (o.op === ":") {   // (04.11.2026) schriftlich geteilt: von links, der Rest wandert vor die nächste Zahl
      const d = String(o.a).split("").map(Number), liste = []; let rest = 0, pos = 0;
      if (d[0] < o.b) { liste.push({ pos: 1, x: d[0] * 10 + d[1], ein: 0, z: d[0] * 10 + d[1] }); pos = 2; } else { liste.push({ pos: 0, x: d[0], ein: 0, z: d[0] }); pos = 1; }
      for (; pos <= d.length; pos++) {
        const L = liste[liste.length - 1]; L.y = o.b; L.ziffer = Math.floor(L.z / o.b); L.rest = L.z - L.ziffer * o.b; L.i = d.length - 1 - L.pos; rest = L.rest;
        if (pos < d.length) liste.push({ pos, x: d[pos], ein: rest, z: rest * 10 + d[pos] });
      }
      return { o, liste };
    }
    if (o.op === "·") {   // (04.11.2026) schriftlich mal mit einstelliger Zahl: von rechts, die gemerkte Zahl kommt links dazu
      const x = stellen(o.a), liste = []; let ein = 0;
      x.forEach((xi, i) => { const p = xi * o.b + ein; liste.push({ i, x: xi, y: o.b, ein, ziffer: p % 10, aus: Math.floor(p / 10), summe: p }); ein = Math.floor(p / 10); });
      if (ein) liste.push({ i: x.length, x: 0, y: o.b, ein, ziffer: ein, aus: 0, summe: ein, vorn: true });
      return { o, liste };
    }
    const x = stellen(o.a), y = stellen(o.b), z = stellen(o.c), n = Math.max(x.length, y.length, z.length), liste = [];
    let ein = 0;
    for (let i = 0; i < n; i++) {
      const xi = x[i] || 0, yi = y[i] || 0;
      if (o.op === "+") { const s = xi + yi + ein; liste.push({ i, x: xi, y: yi, ein, ziffer: s % 10, aus: s >= 10 ? 1 : 0, summe: s }); ein = s >= 10 ? 1 : 0; }
      else { const oben = xi - ein, borgt = oben < yi; liste.push({ i, x: xi, y: yi, ein, ziffer: (borgt ? oben + 10 : oben) - yi, aus: borgt ? 1 : 0 }); ein = borgt ? 1 : 0; }
    }
    while (liste.length > 1 && liste[liste.length - 1].ziffer === 0 && liste[liste.length - 1].x === 0 && liste[liste.length - 1].y === 0 && !liste[liste.length - 1].ein) liste.pop();
    return { o, liste };
  }
  // Prüft eine Ziffer an einer Stelle: { ok, fv? (id), hinweis }
  // (04.11.2026) Hinweise kindgerecht: kurze Sätze, keine Fachwörter („Übertrag“, „Ziffer“, „Stelle“), die kleine 1 statt Übertrag
  function pruefeSchritt(o, s, wert, art = "abziehen") {
    const w = +wert, st = STELLE[s.i], st1 = STELLE1[s.i];
    if (w === s.ziffer) return { ok: true };
    if (o.op === ":") {
      if (s.ein && w === Math.floor(s.x / s.y)) return { ok: false, fv: "restvergessen", hinweis: `Denk an den Rest ${s.ein} von vorher. Er kommt vor die ${s.x}: Das sind ${s.z}.` };
      if (w * s.y > s.z) return { ok: false, hinweis: `Zu viel: ${w} · ${s.y} = ${w * s.y}. Das ist mehr als ${s.z}.` };
      if ((w + 1) * s.y <= s.z) return { ok: false, hinweis: `Da passt noch mehr hinein: ${w + 1} · ${s.y} = ${(w + 1) * s.y}.` };
      return { ok: false, hinweis: `Wie oft passt die ${s.y} in die ${s.z}? Denk an die ${s.y}er-Reihe.` };
    }
    if (s.art === "zeile") {
      if (s.k && w === s.ziffer * 10 ** s.k) return { ok: false, fast: true, hinweis: `Fast! Schreib nur ${s.ziffer}. Weil die Zeile eingerückt ist, brauchst du die Null nicht.` };
      const ohne = ausStellen(stellen(s.x).map(d => (d * s.y) % 10));
      if (w === ohne && ohne !== s.ziffer) return { ok: false, fv: "uebertrag", hinweis: `Denk an die Zahl, die du dir merkst. Fang rechts an: ${stellen(s.x)[0]} · ${s.y} = ${stellen(s.x)[0] * s.y}.` };
      return { ok: false, hinweis: `Rechne ${s.x} · ${s.y} von rechts. Fang an mit ${stellen(s.x)[0]} · ${s.y} = ${stellen(s.x)[0] * s.y}.` };
    }
    if (s.art === "summe") {
      if (w === ohneEinruecken(o)) return { ok: false, fv: "verrueckt", hinweis: `Die Zeilen sind eingerückt. Rechne ${s.teile.join(" + ")}.` };
      return { ok: false, hinweis: `Zähl die Zeilen zusammen: ${s.teile.join(" + ")}.` };
    }
    if (o.op === "·") {
      if (s.vorn) return { ok: false, fv: "uebertrag", hinweis: `Du hast dir zuletzt ${s.ein} gemerkt. Die kommt jetzt nach vorn.` };
      if (s.ein && w === (s.x * s.y) % 10) return { ok: false, fv: "uebertrag", hinweis: `Denk an die gemerkte ${s.ein}: ${s.x} · ${s.y} + ${s.ein} = ${s.summe}.` };
      if (String(wert).length > 1 && w === s.summe) return { ok: false, fv: "uebertrag", hinweis: `${s.summe} ist mehr als 9. Schreib nur die ${s.ziffer} hin. Die ${s.aus} merkst du dir für links.` };
      return { ok: false, hinweis: `${s.x} · ${s.y}${s.ein ? " + " + s.ein : ""} = ${s.summe}. Was schreibst du bei den ${st} hin?` };
    }
    if (o.op === "+") {
      if (s.ein && w === (s.x + s.y) % 10) return { ok: false, fv: "uebertrag", hinweis: `Denk an die kleine 1 von rechts: ${s.x} + ${s.y} + 1 = ${s.summe}.` };
      if (String(wert).length > 1 && +wert === s.summe) return { ok: false, fv: "uebertrag", hinweis: `${s.summe} ist mehr als 9. Schreib nur die ${s.ziffer} hin. Die kleine 1 wandert nach links.` };
      return { ok: false, hinweis: `${s.x} + ${s.y}${s.ein ? " + 1" : ""} = ${s.summe}. Was schreibst du bei den ${st} hin?` };
    }
    const oben = s.x - s.ein;
    if (s.aus && w === Math.abs(oben - s.y)) return { ok: false, fv: "kleinvongross", hinweis: art === "ergaenzen" ? `Von ${s.y + s.ein} bis ${s.x} geht nicht. Zähl bis ${s.x + 10} und schreib unten links eine kleine 1.` : `Oben ${oben}, unten ${s.y}. Umdrehen geht nicht. Tausch einen ${STELLE1[s.i + 1] || "Zehner"}: ${oben + 10} ${M} ${s.y}.` };
    if (s.ein && w === s.ziffer + 1) return { ok: false, fv: "borgen", hinweis: art === "ergaenzen" ? `Denk an die kleine 1 unten: von ${s.y + 1} bis ${s.aus ? s.x + 10 : s.x}.` : oben < 0 ? `Du hast vorhin einen ${st1} getauscht. Oben steht aber eine 0. Tausch erst einen von links.` : `Du hast vorhin einen ${st1} getauscht. Oben steht jetzt nur noch ${oben}.` };
    const satz = art === "ergaenzen" ? `Von ${s.y + s.ein} bis ${s.aus ? s.x + 10 : s.x} sind es ${s.ziffer}.` : `${s.aus ? oben + 10 : oben} ${M} ${s.y} = ${s.ziffer}.`;
    return { ok: false, hinweis: `Bei den ${st}: ${satz.replace(/\.$/, "")}. Versuch es nochmal.` };
  }
  const stelleName = (i) => STELLE[i];

  W.MatheFehler = { KATALOG, TIPP, lies, erkenne, melde, zaehle, inArbeit, kontrastErgebnis, liste, kontraste, schritte, pruefeSchritt, stelleName, ZUSTAND, zahlwort, uhrAufgabe, geldAufgabe, stellenAufgabe, rundenAufgabe, _h: { ohneUebertrag, kleinVonGross, borgenVergessen, hatUebertrag, hatBorgen } };
})(typeof window !== "undefined" ? window : globalThis);
