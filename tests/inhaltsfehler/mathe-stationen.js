// Prüfungen zu den Korrekturen der Inhaltsprüfung (10.11.2026) in spiele/mathe/aufgaben.js – Paket A.
// Aufruf: node a.js [wurzel]   oder   require("./a.js")(wurzel) → Anzahl der Prüfungen. Keine Ausgabe außer bei Fehler.
const assert = require("assert");
const path = require("path");

module.exports = function (wurzel) {
  wurzel = wurzel || "/home/user/lerninsel";
  const vorher = global.window;
  global.window = {};
  const datei = path.join(wurzel, "spiele/mathe/aufgaben.js");
  delete require.cache[require.resolve(datei)];
  require(datei);
  const M = global.window.Mathe;
  global.window = vorher;
  let n = 0;
  const pruefe = (name, fn) => { try { fn(); } catch (e) { e.message = name + ": " + e.message; throw e; } n++; };
  const ALLE = [M.STATIONEN_K1, M.STATIONEN, M.STATIONEN_K3, M.STATIONEN_K4, M.STATIONEN_K5].flat();
  const st = id => { const s = ALLE.find(x => x.id === id); assert.ok(s, "Station fehlt: " + id); return s; };
  // viele Startzahlen einer Station: feste Saaten (eindeutig), dazu freie Würfe
  const proben = (id, anzahl, filter) => { const s = st(id), aus = [];
    for (let i = 0; i < anzahl; i++) { const a = M.aufgabe(s.id, 1000 + i * 7919); if (!filter || filter(a)) aus.push(a); } return aus; };
  const zahlen = t => (String(t).match(/\d+/g) || []).map(Number);
  const zaehle = (t, e) => String(t).split(e).length - 1;

  pruefe("k1daten: „am meisten“ ist immer eindeutig", () => {
    const p = proben("k1daten", 3000, a => /am meisten/.test(a.frage)); assert.ok(p.length > 300);
    for (const a of p) { const z = ["🍎", "🍌", "🍐"].map(e => zaehle(a.bild, e)), mx = Math.max(...z);
      assert.strictEqual(z.filter(x => x === mx).length, 1, "Gleichstand " + z);
      assert.strictEqual(a.antwort, ["🍎", "🍌", "🍐"][z.indexOf(mx)]); }
  });
  pruefe("tabelle2: Spalten ohne Dopplung und ohne Sprung, Hilfe passt", () => {
    const p = proben("tabelle2", 3000, a => /Setze die Tabelle fort/.test(a.frage)); assert.ok(p.length > 300);
    for (const a of p) { const kopf = (a.bild.match(/>(\d+) 🍦</g) || []).map(x => parseInt(x.slice(1), 10)); assert.strictEqual(kopf.length, 4, "4 Spalten");
      kopf.forEach((k, i) => { if (i) assert.strictEqual(k, kopf[i - 1] + 1, "Spalten " + kopf); });
      const werte = (a.bild.match(/>(\d+)<\/text>/g) || []).map(x => +x.slice(1, -7)), preis = werte[1] - werte[0];
      assert.ok(preis > 0 && werte[0] === kopf[0] * preis, "Preise " + werte);
      assert.strictEqual(+a.antwort, kopf[3] * preis); assert.ok(a.hilfe.includes(`${kopf[3]} · ${preis} = ${kopf[3] * preis}`) && /Für jedes Eis/.test(a.hilfe), a.hilfe); }
  });
  pruefe("detektiv: Nim-Hilfe rechnet richtig und lässt 3 oder 6 übrig", () => {
    const p = proben("detektiv", 3000, a => /Steine/.test(a.frage)); assert.ok(p.length > 100);
    for (const a of p) { const m = /: (\d+) − (\d+) = (\d+)\.$/.exec(a.hilfe); assert.ok(m, a.hilfe);
      assert.strictEqual(+m[1] - +m[2], +m[3], a.hilfe); assert.ok(+m[3] % 3 === 0 && +m[2] === +a.antwort && zaehle(a.bild, "🪨") === +m[1], a.hilfe); }
  });
  pruefe("k1legen: fehlendes Teil – „Quadrat“ nur für echte Quadrate", () => {
    const p = proben("k1legen", 3000, a => /fehlt noch/.test(a.frage)); assert.ok(p.length > 300); const gesehen = new Set();
    for (const a of p) { const pkt = /<polygon points="([^"]+)" fill="#fff"/.exec(a.bild)[1].split(" ").map(q => q.split(",").map(Number));
      gesehen.add(a.antwort);
      if (pkt.length === 3) assert.strictEqual(a.antwort, "Dreieck");
      else { const xs = pkt.map(q => q[0]), ys = pkt.map(q => q[1]), b = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys);
        assert.strictEqual(a.antwort, b === h ? "Quadrat" : "Rechteck", `${b} × ${h}`); }
      assert.ok(!(a.optionen.includes("Quadrat") && a.optionen.includes("Rechteck")), "Quadrat und Rechteck nie zusammen"); }
    assert.ok(gesehen.has("Rechteck") && gesehen.has("Quadrat") && gesehen.has("Dreieck"));
  });
  pruefe("Bandornament: keine Form ist spiegelgleich („gespiegelt“ sieht nie wie „verschoben“ aus)", () => {
    const ecken = d => { let x = 0, y = 0; const aus = []; const re = /([MLlhvaZ])([^MLlhvaZ]*)/g; let m;
      while ((m = re.exec(d))) { const z = (m[2].match(/-?\d+(\.\d+)?/g) || []).map(Number);
        if (m[1] === "M") { x = z[0]; y = z[1]; } else if (m[1] === "l") { x += z[0]; y += z[1]; } else if (m[1] === "h") x += z[0]; else if (m[1] === "v") y += z[0];
        else if (m[1] === "a") { x += z[5]; y += z[6]; } else continue; aus.push([x, y]); } return aus; };
    const formen = new Set();
    for (const id of ["k3ornament", "k4parkett"]) for (const a of proben(id, 1500, a => /Bandornament/.test(a.bild || ""))) formen.add(/<path d="([^"]+)"/.exec(a.bild)[1]);
    assert.ok(formen.size >= 5, "Formen: " + formen.size);
    for (const d of formen) { const e = ecken(d), xs = e.map(p => p[0]), mitte = Math.min(...xs) + Math.max(...xs), ys = e.map(p => p[1]), mitteY = Math.min(...ys) + Math.max(...ys);
      const hat = (x, y) => e.some(p => Math.abs(p[0] - x) < 0.5 && Math.abs(p[1] - y) < 0.5);
      assert.ok(!e.every(p => hat(mitte - p[0], p[1])), "links-rechts-gleich: " + d);
      assert.ok(!e.every(p => hat(p[0], mitteY - p[1])), "oben-unten-gleich (gedreht = gespiegelt): " + d);
      assert.ok(!e.every(p => hat(mitte - p[0], mitteY - p[1])), "punktgleich (gedreht = verschoben): " + d); }
  });
  pruefe("k4vergroessern: Frage eindeutig (beide Seiten), genau eine passende Antwort, vier Antworten", () => {
    const p = proben("k4vergroessern", 3000, a => a.art === "wahl"); assert.ok(p.length > 300);
    for (const a of p) { assert.ok(/beide Seiten doppelt so lang/.test(a.frage) && !/doppelt so groß/.test(a.frage), a.frage);
      const [x, y] = zahlen(a.frage); assert.strictEqual(a.antwort, `${2 * x} × ${2 * y}`); assert.strictEqual(a.optionen.length, 4, a.optionen.join(" ; "));
      assert.strictEqual(a.optionen.filter(o => { const [p1, p2] = zahlen(o); return p1 === 2 * x && p2 === 2 * y; }).length, 1); }
  });
  pruefe("k5teiler: Zerlegungen ohne Kommazahl; falsche sind echte Zerlegungen mit teilbarer Zahl oder 1", () => {
    const prim = M._k3.istPrim, p = proben("k5teiler", 3000, a => /Zerlegung/.test(a.frage || "")); assert.ok(p.length > 200);
    for (const a of p) { const zahl = zahlen(a.frage)[0];
      for (const o of a.optionen) { assert.ok(/^\d+( · \d+)+$/.test(o), "Option: " + o); const f = zahlen(o);
        assert.strictEqual(f.reduce((x, y) => x * y, 1), zahl, `${o} ist keine Zerlegung von ${zahl}`);
        assert.strictEqual(f.every(prim), o === a.antwort, o); } }
  });
  pruefe("Sätze: richtige Fälle, Einzahl/Mehrzahl, keine kaputten Randfälle (alle Stationen)", () => {
    const VERBOTEN = [/man ein (Brief|Apfel|Hund|Löffel|Eimer|Lauf)\b/, /man der Weg/, /einen Pyramide/, /sind einen halben/, /von eine (Strecke|Figur)/, /von ein Winkel/,
      /(^|[^\d,])1 (Tage|Stunden|Striche|Schritte|Wochen|Zehnerreihen)\b/, /(^|\D)0 (Bündel|Striche)\b/, /Rest 0\b/, /dauert die Sommerferien/, /Sommerferien dauert /, /Daumen breit ungefähr/, /Klassenzimmer lang ungefähr/,
      /\d\.\d/, /Zu jedem der \d+ (Eissorten|Brotsorten|Mützen)/, /Zentimeter auf der Karte sind/, /\b1 kommen dazu/, /\b1 gehen weg/, /war oder ist/, /[−-] 0 = \d+, dann/, /Dazu 0:/, /5 und 0 sind/, /\b0 nach oben/,
      /ein \d+ mehr/, /1 von \d+ Feldern sind/, /Kleidungen/, /Tachometer/, /\b1 € \d+ ct\b.*also sind 1 €/, /h 0 min/, /€ 0 ct/, /m 0 cm/, /Halbiere Hunderter, Zehner und Einer/, /doppelt so groß wie \d+ ×/];
    const KLEIN = /^(ein|eine|einer|einen|der|die|das|dein|acht|drei|zwei|vier)\b/;
    for (const s of ALLE) for (let i = 0; i < 500; i++) { const a = M.aufgabe(s.id, 31 + i * 104729);
      for (const t of [a.frage, a.hilfe, ...(a.optionen || [])]) { if (!t) continue; const text = String(t);
        for (const re of VERBOTEN) assert.ok(!re.test(text), `${s.id}: „${text.slice(0, 140)}“ (${re})`); }
      if (a.hilfe) assert.ok(!KLEIN.test(String(a.hilfe)), `${s.id}: Hilfe beginnt klein: ${String(a.hilfe).slice(0, 80)}`);
      if (a.frage) assert.ok(!KLEIN.test(String(a.frage)), `${s.id}: Frage beginnt klein: ${String(a.frage).slice(0, 80)}`); }
  });
  pruefe("k3vorteil: „stimmt das?“ ist mal ja, mal nein – und stimmt", () => {
    const p = proben("k3vorteil", 3000, a => /stimmt das\?/.test(a.frage || "")); assert.ok(p.length > 200); let ja = 0;
    for (const a of p) { const [x, y, f] = zahlen(a.frage); assert.strictEqual(a.antwort, x + y === f ? "ja" : "nein", a.frage); if (a.antwort === "ja") ja++; }
    assert.ok(ja > p.length * 0.3 && ja < p.length * 0.7, `ja: ${ja} von ${p.length}`);
  });
  pruefe("k3plaene: kürzerer Weg ist mal blau, mal rot – und stimmt mit den gezählten Kästchen", () => {
    const p = proben("k3plaene", 3000, a => /kürzer/.test(a.frage || "")); assert.ok(p.length > 200); let blau = 0;
    for (const a of p) { const m = /blau (\d+), rot (\d+)/.exec(a.hilfe); assert.ok(m && m[1] !== m[2], a.hilfe);
      assert.strictEqual(a.antwort, +m[1] < +m[2] ? "der blaue" : "der rote"); if (a.antwort === "der blaue") blau++; }
    assert.ok(blau > p.length * 0.3 && blau < p.length * 0.7, `blau: ${blau} von ${p.length}`);
  });
  pruefe("Zahlenraum: Kl. 2 Geld und Rechenwege bis 100, „Zahlen bis 20“ bleibt bei 20", () => {
    for (const a of proben("euro", 3000)) { if (/zurück|Lutscher/.test(a.frage || "")) assert.ok(+a.antwort <= 100 && +a.antwort > 0, `${a.frage} → ${a.antwort}`); }
    for (const a of proben("rechenwege", 3000, a => /am geschicktesten/.test(a.frage || ""))) { const [x, y] = zahlen(a.frage); assert.ok(x + y <= 100, a.frage);
      assert.ok(Math.max(...zahlen(a.hilfe)) <= 100, a.hilfe); assert.strictEqual(a.antwort, `${x + 1} + ${y} − 1`); }
    for (const a of proben("k1zahlen20", 3000)) { assert.ok(+a.antwort <= 20, `${a.text} ${a.frage} → ${a.antwort}`); assert.ok(Math.max(0, ...zahlen(a.text)) <= 20, a.text); }
  });
  pruefe("Kl. 2 Formen/Kl. 1 Formen: beim Quadrat steht „Rechteck“ nicht als falsche Antwort", () => {
    for (const id of ["formen", "k1formen"]) for (const a of proben(id, 2000, a => a.antwort === "Quadrat")) assert.ok(!a.optionen.includes("Rechteck"), id + ": " + a.frage);
    for (const a of proben("k1formen", 2000)) assert.ok(!/Fliese|Fenster/.test(a.frage || ""), a.frage);
  });
  pruefe("kombinieren2: so viele Hosen im Bild wie im Text, kein Kleid", () => {
    const p = proben("kombinieren2", 2000, a => /Oberteile/.test(a.frage || "")); assert.ok(p.length > 100);
    for (const a of p) { const [o, h] = zahlen(a.frage); assert.ok(!a.bild.includes("👗"), "Kleid im Bild");
      assert.strictEqual(zaehle(a.bild, "👖") + zaehle(a.bild, "🩳"), h); assert.strictEqual(+a.antwort, o * h); }
  });
  pruefe("bauplaene: „Wie viele Würfel brauchst du noch?“ ist nie 0", () => {
    for (const a of proben("bauplaene", 3000, a => /brauchst du noch/.test(a.frage || ""))) assert.ok(+a.antwort > 0);
  });
  pruefe("Busse: geht die Rechnung auf, sagt die Hilfe das auch", () => {
    for (const id of ["k3skizze", "k5sach"]) { let glatt = 0;
      for (const a of proben(id, 6000, a => /Busse/.test(a.frage || ""))) { const [k, p] = zahlen(a.frage); assert.strictEqual(+a.antwort, Math.ceil(k / p));
        if (k % p === 0) { glatt++; assert.ok(/geht genau auf/.test(a.hilfe) && !/Rest/.test(a.hilfe), a.hilfe); } else assert.ok(a.hilfe.includes(`Rest ${k % p}`), a.hilfe); }
      assert.ok(glatt > 0, id + ": kein glatter Fall erzeugt"); }
  });
  pruefe("k4rechenbrett: roter Pfennig nur ab Ziffer 5", () => {
    const p = proben("k4rechenbrett", 3000, a => /Die Ziffer ist/.test(a.hilfe || "")); assert.ok(p.length > 200);
    for (const a of p) { const d = +/Die Ziffer ist (\d)/.exec(a.hilfe)[1]; assert.strictEqual(/roter Pfennig/.test(a.hilfe), d >= 5, a.hilfe); assert.strictEqual(+a.antwort, d >= 5 ? d - 5 : d); }
  });
  pruefe("k5lage: geschätzter Winkel – falsche Antworten liegen mindestens 25° daneben", () => {
    const p = proben("k5lage", 3000, a => /Welcher Winkel ist das ungefähr/.test(a.frage || "")); assert.ok(p.length > 200);
    for (const a of p) { assert.strictEqual(a.optionen.length, 4); for (const o of a.optionen) if (o !== a.antwort) assert.ok(Math.abs(parseInt(o) - parseInt(a.antwort)) >= 25, `${a.antwort} neben ${o}`); }
    for (const a of proben("k5lage", 3000, a => /rechte Winkel hat ein Parallelogramm/.test(a.frage || ""))) assert.ok(/kein Rechteck/.test(a.frage), a.frage);
  });
  pruefe("Uhr: Viertel-Zeiten nennen beide Sprechweisen", () => {
    const p = proben("uhr", 2000, a => /Viertel/.test(a.hilfe || "")); assert.ok(p.length > 100);
    for (const a of p) { const m = /Es ist (\d+):(\d+) Uhr, also Viertel (nach|vor) (\d+) \(manche sagen: (drei )?viertel (\d+)\)/.exec(a.hilfe); assert.ok(m, a.hilfe);
      const h = +m[1], naechste = (h % 12) + 1; assert.strictEqual(+m[6], naechste); assert.strictEqual(m[3] === "vor", !!m[5]); assert.strictEqual(+m[4], m[3] === "nach" ? h : naechste); }
  });
  pruefe("Vierecke: Raute, allgemeines Viereck und stumpfes Dreieck sind deutlich gezeichnet", () => {
    const winkel = pts => pts.map((p, i) => { const a = pts[(i + pts.length - 1) % pts.length], b = pts[(i + 1) % pts.length], u = [a[0] - p[0], a[1] - p[1]], v = [b[0] - p[0], b[1] - p[1]];
      return Math.acos((u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v))) * 180 / Math.PI; });
    const punkte = bild => (/<path d="([^"]+)"/.exec(bild)[1].match(/-?\d+(\.\d+)?/g) || []).map(Number).reduce((l, z, i, alle) => i % 2 ? l : l.concat([[z, alle[i + 1]]]), []);
    let raute = 0, viereck = 0, stumpf = 0;
    for (const a of proben("k4vierecke", 4000)) {
      if (a.antwort === "Raute") { raute++; for (const w of winkel(punkte(a.bild))) assert.ok(Math.abs(w - 90) >= 20, "Raute fast quadratisch: " + w.toFixed(1)); }
      if (a.antwort === "allgemeines Viereck") { viereck++; const p = punkte(a.bild), s = p.map((q, i) => Math.hypot(p[(i + 1) % 4][0] - q[0], p[(i + 1) % 4][1] - q[1]));
        const r = p.map((q, i) => Math.atan2(p[(i + 1) % 4][1] - q[1], p[(i + 1) % 4][0] - q[0]) * 180 / Math.PI);
        for (const [i, j] of [[0, 2], [1, 3]]) { const d = Math.abs(((r[i] - r[j]) % 180 + 180) % 180); assert.ok(Math.min(d, 180 - d) >= 15, "fast parallel: " + d.toFixed(1)); }
        for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) assert.ok(Math.abs(s[i] - s[j]) >= 8, "zwei Seiten fast gleich lang"); }
      if (/rechten Winkel/.test(a.frage || "") && a.antwort === "nein") { const w = Math.max(...winkel(punkte(a.bild))); if (w > 90) { stumpf++; assert.ok(w >= 115, "stumpfer Winkel zu nah an 90°: " + w.toFixed(1)); } }
    }
    assert.ok(raute && viereck && stumpf, `${raute}/${viereck}/${stumpf}`);
  });
  return n;
};

if (require.main === module) { const k = module.exports(process.argv[2]); if (process.argv.includes("-v")) console.log(k + " Prüfungen bestanden"); }
