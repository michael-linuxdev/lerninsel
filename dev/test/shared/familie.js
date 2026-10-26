// Gemeinsame Momente mit Erwachsenen (Eltern als Mitspieler, nicht nur Verwalter):
// kurze, freiwillige Dinge von 1–3 Minuten – ein Lernfund erklären, ein Kopfrechen-Duell. Kein Druck, keine Mahnung.
// Daten: profil.daten.familie = { momente: [{ a: "erklaert"|"duell", d: "JJJJ-MM-TT", t: Text }] } (höchstens 80)
(function () {
  const S = window.Spielwelt; if (!S) return;
  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const heute = () => window.__heute || iso(new Date());
  const lade = () => Object.assign({ momente: [] }, S.lade("familie") || {});
  function merke(art, text) {
    const d = lade(); d.momente.push({ a: art, d: heute(), t: String(text || "").slice(0, 90) }); d.momente = d.momente.slice(-80); S.speichere("familie", d);
  }
  function letzteTage(n = 7) {
    const [y, m, t] = heute().split("-").map(Number), ab = iso(new Date(y, m - 1, t - n + 1));
    return lade().momente.filter(x => x.d >= ab);
  }
  window.Familie = { merke, letzteTage, alle: () => lade().momente.slice(), ART: { erklaert: ["🗣️", "Erklärt"], duell: ["🧮", "Kopfrechen-Duell"], welt: ["🌍", "Echte Welt"], schach: ["♟️", "Schach zu zweit"] } };
})();
