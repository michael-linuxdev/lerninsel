// Hör-Schritte für Musik (07.11.2026, „Fächer ausbauen I“): kleine Klangbeispiele aus WebAudio – keine Aufnahmen, keine fremden Dateien.
// Ein Schritt `wahl` mit Feld `klang` bekommt auf der Sachunterricht-Seite einen Knopf „🔊 Anhören“; erst das Antippen spielt (iPad: Ton nur nach Berührung).
// klang = { noten: "C E G", tempo: 120 | [von, bis], laut: 0.5 | [von, bis], art: "gebunden" | "kurz", farbe: "sine" | "triangle" | "square" | "sawtooth" }
//   oder { teile: [klang, klang, …], pause: Schläge } – Teile nacheinander (z. B. A – B – A oder zwei Klangfarben im Vergleich).
// Noten wie in shared/lieder.js: C D E F G A H (eingestrichen), c d e … eine Oktave höher, ,G tiefer; Zahl dahinter = Schläge (Standard 1); „-“ = Pause.
// Test-Haken: window.__klang = { gespielt: [ { noten, dauer } ], plan(k) }.
(function () {
  const FREQ = { C: 261.63, D: 293.66, E: 329.63, F: 349.23, G: 392.0, A: 440.0, H: 493.88 };
  function note(n) {
    const m = String(n).match(/^(,?)([A-Ha-h]|-)([\d.]*)$/); if (!m) return { f: 0, d: 1 };
    const d = m[3] ? +m[3] : 1; if (m[2] === "-") return { f: 0, d };
    let f = FREQ[m[2].toUpperCase()]; if (m[2] === m[2].toLowerCase()) f *= 2; if (m[1]) f /= 2;
    return { f, d };
  }
  const zwischen = (w, x) => Array.isArray(w) ? w[0] + (w[1] - w[0]) * x : w;
  // Plan: Liste von Tönen { f, start, dauer, laut, farbe } in Sekunden – für den Test ohne Lautsprecher nachprüfbar
  function plan(k) {
    const teile = k.teile || [k], toene = []; let t = 0;
    teile.forEach((tk, ti) => {
      const noten = String(tk.noten || "").trim().split(/\s+/).filter(Boolean).map(note), schlaege = noten.reduce((s, n) => s + n.d, 0) || 1;
      let b = 0; const bisLetzte = Math.max(0.001, schlaege - (noten.length ? noten[noten.length - 1].d : 0));   // Verlauf erreicht den Zielwert beim letzten Ton
      noten.forEach(n => {
        const x = Math.min(1, b / bisLetzte), sek = 60 / zwischen(tk.tempo || 110, x) * n.d;
        if (n.f) toene.push({ f: n.f, start: t, dauer: tk.art === "kurz" ? Math.min(0.12, sek * 0.5) : sek * 0.95, laut: zwischen(tk.laut == null ? 0.5 : tk.laut, x), farbe: tk.farbe || "triangle" });
        t += sek; b += n.d;
      });
      if (ti < teile.length - 1) t += 60 / (tk.tempo && !Array.isArray(tk.tempo) ? tk.tempo : 110) * (k.pause == null ? 1 : k.pause);
    });
    return { toene, dauer: t };
  }
  let ctx = null, laufende = [];
  function audio() { if (!ctx) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; try { ctx = new A(); } catch (e) { return null; } }
    if (ctx.state === "suspended") ctx.resume(); return ctx; }
  function stopp() { laufende.forEach(o => { try { o.stop(); } catch (e) { /* schon aus */ } }); laufende = []; }
  function spiele(k) {
    stopp();
    const p = plan(k), a = audio();
    (window.__klang.gespielt = window.__klang.gespielt || []).push({ noten: (k.teile || [k]).map(x => x.noten).join(" | "), dauer: p.dauer });
    if (!a) return p;
    const t0 = a.currentTime + 0.05;
    // Eckige und Sägezahn-Wellen klingen bei gleicher Stärke viel lauter – darum leiser
    const STAERKE = { sine: 0.5, triangle: 0.45, square: 0.12, sawtooth: 0.14 };
    p.toene.forEach(n => {
      const o = a.createOscillator(), g = a.createGain(), t = t0 + n.start, v = Math.max(0.002, n.laut * (STAERKE[n.farbe] || 0.4));
      o.type = n.farbe; o.frequency.value = n.f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.02);
      g.gain.setValueAtTime(v, t + Math.max(0.03, n.dauer - 0.05)); g.gain.exponentialRampToValueAtTime(0.0001, t + n.dauer);
      o.connect(g).connect(a.destination); o.start(t); o.stop(t + n.dauer + 0.05); laufende.push(o);
    });
    return p;
  }
  window.Klang = { spiele, stopp, plan };
  window.__klang = window.__klang || { gespielt: [] }; window.__klang.plan = plan;
})();
