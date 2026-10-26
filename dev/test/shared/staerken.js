// Eigene Stärken entdecken (PLAN 8b): kein Test, keine Rangliste, nie eine Schwächen-Liste.
// Drei Quellen: das Kind kreuzt selbst an · die App bemerkt etwas (aus dem, was das Kind tut) und fragt nach · Eltern ergänzen
// („Heute habe ich gesehen, dass du …“). Daten: profil.daten.staerken = { selbst: [id], app: [id], abgelehnt: [id], gesehen: [{ id, t, d }] }
(function () {
  const S = window.Spielwelt; if (!S) return;
  // [id, Emoji, „Ich kann gut …“, russisch]
  const STAERKEN = [
    ["dranbleiben", "💪", "dranbleiben, auch wenn es schwer ist", "не сдаваться, даже когда трудно"],
    ["hinschauen", "🔍", "genau hinschauen", "внимательно смотреть"],
    ["fantasie", "🌈", "mir Dinge ausdenken", "придумывать"],
    ["bauen", "🧱", "bauen und erfinden", "строить и изобретать"],
    ["helfen", "🤝", "anderen helfen", "помогать другим"],
    ["erklaeren", "🗣️", "Dinge erklären", "объяснять"],
    ["freundlich", "😊", "freundlich sein", "быть добрым"],
    ["mutig", "🦁", "mutig sein", "быть смелым"],
    ["bewegen", "🤸", "mich bewegen und toben", "двигаться"],
    ["rhythmus", "🎵", "singen und Rhythmus halten", "петь и держать ритм"],
    ["malen", "🎨", "malen und gestalten", "рисовать"],
    ["tiere", "🐾", "mich um Tiere kümmern", "заботиться о животных"],
    ["lustig", "😄", "andere zum Lachen bringen", "смешить других"],
    ["zuhoeren", "👂", "gut zuhören", "хорошо слушать"],
    ["sprachen", "🌍", "in zwei Sprachen sprechen", "говорить на двух языках"],
    ["denken", "♟️", "vorausdenken", "думать наперёд"]
  ];
  const A = Object.fromEntries(STAERKEN.map(s => [s[0], s]));
  const lade = () => Object.assign({ selbst: [], app: [], abgelehnt: [], gesehen: [] }, S.lade("staerken") || {});
  const speichere = (d) => S.speichere("staerken", d);
  // Was die App bemerken kann (nur Positives, aus vorhandenen Daten)
  function bemerkt() {
    const z = window.Lernfunde ? window.Lernfunde.zaehler() : {}, ch = S.lade("schach") || {}, bau = S.lade("bauplatz") || {}, gef = S.lade("gefuehle") || {}, tier = S.lade("tier") || {};
    const stempel = window.Charakter ? window.Charakter.stempel().length : 0, bew = Object.values(gef.bewegung || {}).reduce((n, x) => n + x, 0);
    const aus = [];
    if ((z.gemeistert || 0) >= 3 || stempel >= 5) aus.push(["dranbleiben", "Du hast schwere Aufgaben so lange geübt, bis sie geklappt haben."]);
    if (Object.keys(ch.raetsel || {}).length >= 3) aus.push(["hinschauen", "Du hast Schach-Rätsel gelöst – dafür muss man genau hinschauen."]);
    if (Object.keys(ch.siege || {}).length || Object.keys(ch.lektionen || {}).length >= 6) aus.push(["denken", "Beim Schach denkst du schon voraus."]);
    if ((bau.b || []).length >= 40 || (bau.geschafft || 0) >= 2) aus.push(["bauen", "Auf dem Bauplatz hast du schon richtig viel gebaut."]);
    if ((z.erklaert || 0) >= 2) aus.push(["erklaeren", "Du hast Erwachsenen schon Dinge erklärt."]);
    if (bew >= 3) aus.push(["bewegen", "Du hast schon mehrere Bewegungs-Minuten geschafft."]);
    if ((z.welt || 0) >= 3) aus.push(["helfen", "Du machst bei Echte-Welt-Aufgaben mit – auch beim Helfen."]);
    if (tier.phase === "tier" && (tier.gepflegt || tier.leckerli || 0) > 0) aus.push(["tiere", "Du kümmerst dich um dein Tier."]);
    if (S.hilfe() && (z.wort || 0) >= 3) aus.push(["sprachen", "Du lernst neue Wörter und kennst sie in zwei Sprachen."]);
    const d = lade();
    return aus.filter(([id]) => !d.app.includes(id) && !d.selbst.includes(id) && !d.abgelehnt.includes(id));
  }
  function setzeSelbst(id, an) { const d = lade(); d.selbst = d.selbst.filter(x => x !== id); if (an) d.selbst.push(id); speichere(d); }
  function antwortApp(id, ja) { const d = lade(); if (ja) { if (!d.app.includes(id)) d.app.push(id); } else if (!d.abgelehnt.includes(id)) d.abgelehnt.push(id); speichere(d); }
  function elternGesehen(id, text) {
    const d = lade(), t = new Date(); d.gesehen.push({ id, t: String(text || "").slice(0, 120), d: `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`, neu: 1 });
    d.gesehen = d.gesehen.slice(-40); speichere(d);
  }
  function gesehenGelesen() { const d = lade(); d.gesehen.forEach(g => { delete g.neu; }); speichere(d); }
  // Alle Stärken des Kindes (ohne Doppelte), mit Herkunft
  function meine() {
    const d = lade(), m = new Map();
    d.selbst.forEach(id => A[id] && m.set(id, { id, quelle: ["selbst"] }));
    d.app.forEach(id => A[id] && (m.get(id) ? m.get(id).quelle.push("app") : m.set(id, { id, quelle: ["app"] })));
    d.gesehen.forEach(g => A[g.id] && (m.get(g.id) ? m.get(g.id).quelle.push("eltern") : m.set(g.id, { id: g.id, quelle: ["eltern"] })));
    return [...m.values()].map(x => Object.assign(x, { e: A[x.id][1], text: A[x.id][2], ru: A[x.id][3] }));
  }
  window.Staerken = { STAERKEN, A, lade, bemerkt, setzeSelbst, antwortApp, elternGesehen, gesehenGelesen, meine };
})();
