// Fehler-Ursachen im Matheweg (02.11.2026, nach dem Vorbild von Bastion, VERMITTLUNG §3) – ohne KI, nur feste Regeln:
// Typische falsche Antworten werden einem Denkfehler (Fehlvorstellung) zugeordnet. Die Erklärung richtet sich an die Ursache,
// nicht an die einzelne Aufgabe: „Du hast den Übertrag vergessen“ statt nur „falsch“.
//
// KATALOG: { id, name, kurz(o), lang(o) → [So denkst du gerade, Warum das nicht stimmt, So stimmt es], erkenne(o, wert), kontrast(o, zz) → Aufgabe, rueckweg? }
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
    if (a.ops) return Object.assign({ c: +a.antwort }, a.ops);
    const m = /^(\d+) ([+−·:]) (\d+)$/.exec(a.text || "");
    if (!m || (a.text || "").includes("?")) return null;
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

  // ---------- Zufall (Startzahl aus aufgaben.js, sonst Math.random) ----------
  const r = (zz, a, b) => a + Math.floor(zz() * (b - a + 1));

  // ---------- Katalog ----------
  const KATALOG = [
    { id: "op", name: "Rechenzeichen verwechselt",
      erkenne: (o, w) => (o.op === "+" && o.a > o.b && w === o.a - o.b) || (o.op === M && w === o.a + o.b) || (o.op === "·" && w === o.a + o.b && o.a * o.b !== o.a + o.b) || (o.op === ":" && w === o.a * o.b),
      kurz: (o) => `Schau genau auf das Rechenzeichen: Da steht ${o.op === "·" ? "mal" : o.op === ":" ? "geteilt" : o.op === "+" ? "plus" : "minus"}.`,
      lang: (o) => [`Du hast ${({ "+": "minus", [M]: "plus", "·": "plus", ":": "mal" })[o.op]} gerechnet.`,
        `Das Rechenzeichen sagt, was du tun sollst. ${o.a} ${o.op} ${o.b} heißt ${({ "+": "dazutun", [M]: "wegnehmen", "·": `${o.b}-mal ${o.a}`, ":": `${o.a} in ${o.b} gleiche Teile teilen` })[o.op]}.`,
        `Lies zuerst das Zeichen, dann rechne: ${o.a} ${o.op} ${o.b} = ${o.c}.`],
      kontrast: (o, zz) => { const a = r(zz, 12, 40), b = r(zz, 2, 9); return zr(zz() < 0.5 ? "+" : M, a, b, "Lies zuerst das Rechenzeichen."); } },
    { id: "kleinvongross", name: "Kleinere von der größeren Ziffer abgezogen",
      erkenne: (o, w) => o.op === M && hatBorgen(o.a, o.b) && w === kleinVonGross(o.a, o.b) && w !== o.c,
      kurz: (o) => { const x = stellen(o.a)[0], y = stellen(o.b)[0]; return x < y ? `Bei den Einern steht ${x} ${M} ${y}. Das geht nicht einfach umgedreht – du brauchst einen Zehner.` : "Bei einer Stelle reicht die obere Ziffer nicht – dann brauchst du einen von der nächsten Stelle."; },
      lang: (o) => [`Du hast bei jeder Stelle die kleinere Ziffer von der größeren abgezogen.`,
        `Bei ${o.a} ${M} ${o.b} wird aber immer die untere Zahl weggenommen. ${stellen(o.a)[0]} ${M} ${stellen(o.b)[0]} geht bei den Einern nicht, also wird ein Zehner in 10 Einer getauscht.`,
        `${o.a} ${M} ${o.b} = ${o.c}. Probe: ${o.c} + ${o.b} = ${o.a}.`],
      kontrast: (o, zz) => { let a, b; do { a = r(zz, 3, 9) * 10 + r(zz, 0, 6); b = r(zz, 1, 5) * 10 + r(zz, 1, 9); } while (b % 10 <= a % 10 || b >= a); return zr(M, a, b, `Bei den Einern reicht ${a % 10} nicht: tausche einen Zehner in 10 Einer.`); } },
    { id: "borgen", name: "Geborgt, aber nicht abgezogen",
      erkenne: (o, w) => o.op === M && hatBorgen(o.a, o.b) && w === borgenVergessen(o.a, o.b) && w !== o.c && w !== kleinVonGross(o.a, o.b),
      kurz: () => "Du hast dir einen Zehner geholt – dann hat die Zehnerstelle einen weniger.",
      lang: (o) => [`Du hast bei den Einern einen Zehner dazugenommen, ihn bei den Zehnern aber nicht weggenommen.`,
        `Der Zehner kommt nicht aus dem Nichts: Er fehlt danach an der nächsten Stelle. Darum steht dein Ergebnis 10 zu hoch.`,
        `${o.a} ${M} ${o.b} = ${o.c}.`],
      kontrast: (o, zz) => KATALOG[1].kontrast(o, zz) },
    { id: "uebertrag", name: "Übertrag vergessen",
      erkenne: (o, w) => o.op === "+" && hatUebertrag(o.a, o.b) && w === ohneUebertrag(o.a, o.b) && w !== o.c,
      kurz: (o) => { const x = stellen(o.a)[0], y = stellen(o.b)[0]; return x + y >= 10 ? `${x} + ${y} = ${x + y} – das ist mehr als 9. Der Zehner muss mit zu den Zehnern.` : "An einer Stelle kommt mehr als 9 heraus – dann wandert eine 1 zur nächsten Stelle."; },
      lang: (o) => [`Du hast an jeder Stelle nur die Ziffern addiert und den Übertrag vergessen.`,
        `Wenn an einer Stelle 10 oder mehr herauskommt, sind das 10 Einer = 1 Zehner. Dieser Zehner gehört zu den Zehnern – sonst fehlen 10.`,
        `${o.a} + ${o.b} = ${o.c}.`],
      kontrast: (o, zz) => { let a, b; do { a = r(zz, 1, 6) * 10 + r(zz, 3, 9); b = r(zz, 1, 3) * 10 + r(zz, 3, 9); } while ((a % 10) + (b % 10) <= 10 || a + b > 100); return zr("+", a, b, `${a % 10} + ${b % 10} ist mehr als 9: Denk an den Übertrag.`); } },
    { id: "uebertragdoppelt", name: "Zehner zweimal gezählt",
      erkenne: (o, w) => o.op === "+" && hatUebertrag(o.a, o.b) && w === o.c + 10,
      kurz: () => "Den Übertrag zählst du nur einmal.",
      lang: (o) => [`Du hast einen Zehner zu viel gezählt.`,
        `Der Übertrag ist ein Zehner, der aus den Einern kommt. Er kommt genau einmal dazu, nicht zweimal.`,
        `${o.a} + ${o.b} = ${o.c}.`],
      kontrast: (o, zz) => KATALOG[3].kontrast(o, zz) },
    { id: "stellenwert", name: "Einer zu den Zehnern gerechnet",
      erkenne: (o, w) => o.b < 10 && o.a >= 10 && ((o.op === "+" && w === o.a + 10 * o.b) || (o.op === M && w === o.a - 10 * o.b)),
      kurz: (o) => `${o.b} sind ${o.b} Einer, keine Zehner.`,
      lang: (o) => [`Du hast die ${o.b} zu den Zehnern gerechnet.`,
        `Bei ${o.a} stehen ${Math.floor(o.a / 10)} Zehner und ${o.a % 10} Einer. Die ${o.b} sind Einer – sie kommen zu den Einern.`,
        `${o.a} ${o.op} ${o.b} = ${o.c}.`],
      kontrast: (o, zz) => { const a = r(zz, 2, 8) * 10 + r(zz, 1, 4), b = r(zz, 2, 5); return zr(zz() < 0.5 ? "+" : M, a, b, "Einer zu den Einern, Zehner zu den Zehnern."); } },
    { id: "zaehlen", name: "Beim Zählen die Startzahl mitgezählt",
      erkenne: (o, w) => o.b <= 10 && ((o.op === "+" && w === o.c - 1) || (o.op === M && w === o.c + 1)),
      kurz: (o) => `Beim ${o.op === "+" ? "Weiterzählen" : "Rückwärtszählen"} fängst du nach der ${o.a} an.`,
      lang: (o) => [`Du hast die ${o.a} beim Zählen mitgezählt.`,
        `Bei ${o.a} ${o.op} ${o.b} machst du ${o.b} Schritte ${o.op === "+" ? "nach vorn" : "zurück"}. Der erste Schritt geht von ${o.a} nach ${o.op === "+" ? o.a + 1 : o.a - 1}.`,
        `${o.a} ${o.op} ${o.b} = ${o.c}.`],
      kontrast: (o, zz) => { const op = zz() < 0.6 ? "+" : M, b = r(zz, 2, 5), a = r(zz, 4, 14) + (op === M ? b : 0); return zr(op, a, b, `Zähle ${b} Schritte – der erste Schritt geht schon weg von der Startzahl.`); } },
    { id: "malreihe", name: "Eine Reihe daneben",
      erkenne: (o, w) => o.op === "·" && w > 0 && w !== o.c && (w === o.c + o.a || w === o.c - o.a || w === o.c + o.b || w === o.c - o.b),
      kurz: (o) => `Fast! Du bist in der Reihe einen Schritt verrutscht. Zähle die Schritte nach: ${o.b}-mal ${o.a}.`,
      lang: (o) => [`Du warst in der ${o.a}er-Reihe einen Schritt zu weit oder zu kurz.`,
        `${o.a} · ${o.b} heißt: ${o.b}-mal die ${o.a}. Ein Schritt mehr oder weniger macht genau ${o.a} Unterschied.`,
        `Merke dir eine Kernaufgabe: ${o.a} · 5 = ${o.a * 5}. Von da aus: ${o.a} · ${o.b} = ${o.c}.`],
      kontrast: (o, zz) => { const a = o.a > 1 && o.a <= 10 ? o.a : r(zz, 3, 9), b = r(zz, 3, 9); return zr("·", a, b, `${b}-mal die ${a}: Zähle die Schritte genau.`); } }
  ];
  const fv = (id) => KATALOG.find(f => f.id === id);
  // Aufgabe in derselben Form wie zahl() in aufgaben.js
  function zr(op, a, b, hilfe) {
    const c = op === "+" ? a + b : op === M ? a - b : op === "·" ? a * b : a / b;
    return { text: `${a} ${op} ${b}`, antwort: String(c), art: "zahl", hilfe, ops: { a, b, op } };
  }

  // Welche Denkfehler passen zu dieser falschen Antwort? (höchstens einer, in Katalog-Reihenfolge)
  function erkenne(a, wert) {
    const o = lies(a), w = +wert; if (!o || !isFinite(w) || w === o.c) return null;
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
  const ZUSTAND = { aufgefallen: "einmal aufgefallen", vermutet: "kommt öfter vor", arbeit: "wird geübt", aufgeloest: "aufgelöst ✓", wieder: "ist wieder da" };
  function liste(d) { return Object.entries(d.fv || {}).filter(([id, e]) => fv(id) && e.s).map(([id, e]) => ({ id, name: fv(id).name, s: e.s, text: ZUSTAND[e.s] })); }
  function kontraste(a, id, zz = Math.random) { const o = lies(a), f = fv(id); return o && f ? [f.kontrast(o, zz), f.kontrast(o, zz)].map(k => Object.assign(k, { kontrast: id })) : []; }

  // ---------- Schrittweg: schriftlich plus und minus ----------
  // Stellen von rechts; je Stelle: Ziffern x, y, Übertrag/Borgen vorher (ein), richtige Ziffer, Übertrag danach (aus)
  function schritte(a) {
    const o = lies(a); if (!o || (o.op !== "+" && o.op !== M)) return null;
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
  function pruefeSchritt(o, s, wert, art = "abziehen") {
    const w = +wert, st = STELLE[s.i], st1 = STELLE1[s.i];
    if (w === s.ziffer) return { ok: true };
    if (o.op === "+") {
      if (s.ein && w === (s.x + s.y) % 10) return { ok: false, fv: "uebertrag", hinweis: `Denk an den Übertrag: Von der Stelle davor ist noch 1 dazugekommen. ${s.x} + ${s.y} + 1 = ${s.summe}.` };
      if (String(wert).length > 1 && +wert === s.summe) return { ok: false, fv: "uebertrag", hinweis: `${s.summe} ist mehr als 9: Schreibe nur die ${s.ziffer} bei den ${st} – die 1 wandert als Übertrag weiter.` };
      return { ok: false, hinweis: `Bei den ${st}: ${s.x} + ${s.y}${s.ein ? " + 1 (Übertrag)" : ""} = ${s.summe}. Welche Ziffer schreibst du?` };
    }
    const oben = s.x - s.ein;
    if (s.aus && w === Math.abs(oben - s.y)) return { ok: false, fv: "kleinvongross", hinweis: `Bei den ${st} steht oben ${oben} und unten ${s.y}. Du darfst nicht umdrehen: Hol dir einen ${STELLE1[s.i + 1] || "Zehner"} dazu – ${oben + 10} ${M} ${s.y}.` };
    if (s.ein && w === s.ziffer + 1) return { ok: false, fv: "borgen", hinweis: art === "ergaenzen" ? `Denk an den Übertrag: Unten kommt 1 dazu, also ${s.y + 1} bis ${s.x}${s.x < s.y + 1 ? " (+10)" : ""}.` : `Du hast vorhin einen ${st1} weggenommen – oben steht jetzt nur noch ${oben}.` };
    const satz = art === "ergaenzen" ? `Von ${s.y + s.ein} bis ${s.aus ? s.x + 10 : s.x} sind es ${s.ziffer}.` : `${s.aus ? oben + 10 : oben} ${M} ${s.y} = ${s.ziffer}.`;
    return { ok: false, hinweis: `Bei den ${st}: ${satz.replace(/\.$/, "")} – versuch es nochmal.` };
  }
  const stelleName = (i) => STELLE[i];

  W.MatheFehler = { KATALOG, lies, erkenne, melde, zaehle, inArbeit, kontrastErgebnis, liste, kontraste, schritte, pruefeSchritt, stelleName, ZUSTAND, _h: { ohneUebertrag, kleinVonGross, borgenVergessen, hatUebertrag, hatBorgen } };
})(typeof window !== "undefined" ? window : globalThis);
