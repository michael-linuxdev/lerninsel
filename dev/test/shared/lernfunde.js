// Lernfunde: konkrete Dinge, die das Kind heute NEU kann oder weiß – nicht nur Sterne.
// Beispiele: „7 + 8 = 15 – war schwer, jetzt kannst du es“, „Neues Wort: die Eiche“, „Thema: Bäume und Vögel“.
// Die Lernspiele melden Funde, „Mein Ich“ zeigt „Heute neu“, die Nachbarn auf der Insel sprechen darüber,
// der Wochenbericht im Elternbereich listet sie. Später Grundlage für das persönliche Museum (KONZEPT: Langzeit-Motivation).
// Nach core.js und charakter.js laden. Daten: profil.daten.lernfunde = { tage: { "JJJJ-MM-TT": [fund, …] } }
// summe: alle Funde seit Beginn (Wissensbaum), baumGesehen: zuletzt auf der Insel gezeigte Baum-Stufe
// fund = { f: fach, a: art, e: emoji, t: Text (de), r?: Text in der Hilfesprache, s: Schlüssel gegen Doppelte }
// Bewusst knapp gehalten (höchstens 5 am Tag, 60 Tage), damit der Spielstand für den QR-Transfer klein bleibt.
(function () {
  const S = window.Spielwelt; if (!S) return;
  const MAX_TAG = 5, TAGE = 60;
  const FAECHER = {
    mathe: { e: "🦫", name: "Mathe" },
    deutsch: { e: "🦊", name: "Deutsch" },
    sachkunde: { e: "🦉", name: "Sachunterricht" },
    tablet: { e: "🤖", name: "Tablet" },
    welt: { e: "🌍", name: "Echte Welt" }
  };
  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const heute = () => window.__heute || (window.Charakter ? window.Charakter.heute() : iso(new Date()));

  function lade() {
    const d = S.lade("lernfunde") || {}; d.tage = d.tage || {};
    // Dauerhafte Zähler und Schatzkammer (werden nicht mit den 60 Tagen gekürzt); alte Spielstände einmalig aus den Tagen füllen
    if (!d.z) { d.z = {}; d.schatz = d.schatz || []; Object.entries(d.tage).forEach(([tag, l]) => l.forEach(f => zaehle(d, f, tag))); }
    d.schatz = d.schatz || [];
    return d;
  }
  // Zähler: je Art (gemeistert, welt, wort …), je Fach (f:mathe …), erklärt; Schätze = gemeisterte, erklärte und Echte-Welt-Funde
  function zaehle(d, f, tag) {
    d.z[f.a] = (d.z[f.a] || 0) + 1; d.z["f:" + f.f] = (d.z["f:" + f.f] || 0) + 1;
    if (f.x) d.z.erklaert = (d.z.erklaert || 0) + 1;
    if (f.a === "gemeistert" || f.a === "welt" || f.x) schatzRein(d, f, tag);
  }
  function schatzRein(d, f, tag) {
    if (d.schatz.some(x => x.s === f.s && x.d === tag)) return;
    d.schatz.push({ e: f.e, t: f.t, f: f.f, a: f.x ? "erklaert" : f.a, d: tag, s: f.s }); d.schatz = d.schatz.slice(-200);
  }

  // fund: { fach, art, e, text, ru, schluessel, melden }
  function merke(fund) {
    if (!fund || !fund.text || !FAECHER[fund.fach]) return false;
    const d = lade(), h = heute(), liste = d.tage[h] = d.tage[h] || [];
    const s = String(fund.schluessel || fund.text).slice(0, 60);
    if (liste.some(x => x.s === s)) return false;
    // Gemeisterte Aufgaben sind der wertvollste Fund: sie dürfen einen einfachen Fund vom selben Tag ersetzen
    if (liste.length >= MAX_TAG) {
      if (fund.art !== "gemeistert") return false;
      const i = liste.findIndex(x => x.a !== "gemeistert"); if (i < 0) return false;
      liste.splice(i, 1);
    }
    const neu = { f: fund.fach, a: fund.art || "neu", e: fund.e || FAECHER[fund.fach].e, t: String(fund.text).slice(0, 90), s };
    if (fund.ru) neu.r = String(fund.ru).slice(0, 90);
    d.summe = summeAus(d) + 1;   // vor dem Hinzufügen zählen, sonst doppelt bei alten Spielständen ohne summe
    liste.push(neu); zaehle(d, neu, h);
    const alt = Object.keys(d.tage).sort(); while (alt.length > TAGE) delete d.tage[alt.shift()];
    S.speichere("lernfunde", d);
    if (fund.melden && window.Charakter && window.Charakter.hinweis) window.Charakter.hinweis("🌱 Das kannst du jetzt!", neu.t, "#2E9C5A");
    return true;
  }

  // Lebenszeit-Zähler (wird nie gekürzt) – daran wächst der Wissensbaum auf der Insel
  function summeAus(d) { return Number.isFinite(d.summe) ? d.summe : Object.values(d.tage).reduce((n, l) => n + l.length, 0); }
  const STUFEN = [1, 5, 15, 35, 70, 120];   // ab so vielen Funden die nächste Baum-Stufe (0 = Samen/Spross)
  const stufeVon = (n) => STUFEN.filter(x => n >= x).length;
  function baum() {
    const d = lade(), summe = summeAus(d), stufe = stufeVon(summe);
    return { summe, stufe, max: STUFEN.length, naechste: STUFEN[stufe] || null, gewachsen: stufe > (d.baumGesehen || 0) };
  }
  function baumGesehen() { const d = lade(), st = stufeVon(summeAus(d)); if ((d.baumGesehen || 0) !== st) { d.baumGesehen = st; S.speichere("lernfunde", d); } }

  const tag = (datum) => (lade().tage[datum] || []).slice();
  // Letzte n Tage (heute eingeschlossen), jeder Fund mit Datum, neueste zuerst
  function letzteTage(n = 7) {
    const d = lade(), [y, m, t] = heute().split("-").map(Number), aus = [];
    for (let i = 0; i < n; i++) {
      const k = iso(new Date(y, m - 1, t - i));
      (d.tage[k] || []).slice().reverse().forEach(f => aus.push(Object.assign({ datum: k }, f)));
    }
    return aus;
  }
  // Neuester Fund eines Fachs von heute (für die Nachbarn auf der Insel)
  const heuteFach = (fach) => tag(heute()).filter(x => x.f === fach).pop() || null;
  const gesamt = () => summeAus(lade());

  // Ein Fund wurde einem Erwachsenen erklärt (gemeinsamer Moment) → Markierung x: 1
  function erklaert(datum, schl) {
    const d = lade(), f = (d.tage[datum] || []).find(x => x.s === schl); if (!f || f.x) return false;
    f.x = 1; d.z.erklaert = (d.z.erklaert || 0) + 1; schatzRein(d, f, datum); S.speichere("lernfunde", d); return true;
  }
  const zaehler = () => Object.assign({}, lade().z);
  const schaetze = () => lade().schatz.slice();
  window.Lernfunde = { FAECHER, MAX_TAG, STUFEN, merke, zaehler, schaetze, erklaert, datumHeute: heute, heute: () => tag(heute()), tag, letzteTage, heuteFach, gesamt, baum, baumGesehen };
})();
