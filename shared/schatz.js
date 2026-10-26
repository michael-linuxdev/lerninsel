// Langzeit-Motivation: Pokale (Meilensteine über Monate und Jahre) und eine Wochen-Herausforderung, die jede Woche neu kommt.
// Alles wird aus den Lernfunden, Stempeln und gemeinsamen Momenten berechnet; gespeichert werden nur geschaffte Wochen (profil.daten.schatz).
// Nach core.js, charakter.js, lernfunde.js (und wenn vorhanden familie.js, echtewelt.js) laden.
(function () {
  const S = window.Spielwelt; if (!S) return;
  const L = () => window.Lernfunde, C = () => window.Charakter;
  const lade = () => Object.assign({ wochen: {} }, S.lade("schatz") || {});
  const z = () => (L() ? L().zaehler() : {});

  // ---------- Pokale ----------
  // [id, Emoji, Name, Beschreibung, Wert-Funktion, Ziel]
  const POKALE = [
    ["fund1", "🌱", "Erster Fund", "Deinen ersten Lernfund gemacht", () => L() ? L().gesamt() : 0, 1],
    ["fund25", "🌿", "Fleißiges Pflänzchen", "25 Lernfunde", () => L() ? L().gesamt() : 0, 25],
    ["fund100", "🌳", "Starker Baum", "100 Lernfunde", () => L() ? L().gesamt() : 0, 100],
    ["fund250", "🌲", "Wissenswald", "250 Lernfunde", () => L() ? L().gesamt() : 0, 250],
    ["meister1", "💪", "Drangeblieben", "Eine schwere Aufgabe gemeistert", () => z().gemeistert || 0, 1],
    ["meister10", "🏅", "Nicht aufgeben!", "10 schwere Aufgaben gemeistert", () => z().gemeistert || 0, 10],
    ["meister50", "🏆", "Meisterin der Geduld", "50 schwere Aufgaben gemeistert", () => z().gemeistert || 0, 50],
    ["mathe20", "🦫", "Bennos Rechen-Freund", "20 Funde in Mathe", () => z()["f:mathe"] || 0, 20],
    ["deutsch20", "🦊", "Fipsis Wort-Freund", "20 Funde in Deutsch", () => z()["f:deutsch"] || 0, 20],
    ["sach20", "🦉", "Ellas Forscher-Freund", "20 Funde im Sachunterricht", () => z()["f:sachkunde"] || 0, 20],
    ["erklaert1", "🗣️", "Kleine Lehrerin", "Zum ersten Mal etwas erklärt", () => z().erklaert || 0, 1],
    ["erklaert10", "🎓", "Große Lehrerin", "10-mal etwas erklärt", () => z().erklaert || 0, 10],
    ["welt5", "🌍", "Draußen-Held", "5 Echte-Welt-Aufgaben", () => z().welt || 0, 5],
    ["welt25", "🧭", "Welt-Entdecker", "25 Echte-Welt-Aufgaben", () => z().welt || 0, 25],
    ["woche1", "⭐", "Wochen-Held", "Eine Wochen-Herausforderung geschafft", () => Object.keys(lade().wochen).length, 1],
    ["woche10", "🌟", "Zehn starke Wochen", "10 Wochen-Herausforderungen geschafft", () => Object.keys(lade().wochen).length, 10],
    ["stempel20", "📅", "Treue Seele", "20 Tage mit allen Tagesaufgaben", () => C() ? C().stempel().length : 0, 20]
  ];
  // Für Jungen/neutral passende Namen
  function name(p) {
    const g = S.kind().geschlecht;
    if (g === "w") return p[2];
    return p[2].replace("Meisterin der Geduld", g === "m" ? "Meister der Geduld" : "Geduld-Profi").replace("Kleine Lehrerin", g === "m" ? "Kleiner Lehrer" : "Kleiner Profi-Erklärer").replace("Große Lehrerin", g === "m" ? "Großer Lehrer" : "Großer Profi-Erklärer");
  }
  function pokale() { return POKALE.map(p => { const wert = p[4](); return { id: p[0], e: p[1], name: name(p), text: p[3], wert: Math.min(wert, p[5]), ziel: p[5], hat: wert >= p[5] }; }); }

  // ---------- Wochen-Herausforderung (jede Woche eine andere) ----------
  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const heute = () => window.__heute || (C() ? C().heute() : iso(new Date()));
  const montag = () => C() ? C().wocheVon(heute()) : heute();
  const seitMontag = (liste, feld = "datum") => liste.filter(x => x[feld] >= montag());
  const funde = () => L() ? seitMontag(L().letzteTage(7)) : [];
  const WOCHE = [
    { id: "funde", e: "🌱", text: "Mach diese Woche 8 Lernfunde.", ziel: 8, wert: () => funde().length },
    { id: "meister", e: "💪", text: "Meistere diese Woche 2 Aufgaben, die früher schwer waren.", ziel: 2, wert: () => funde().filter(f => f.a === "gemeistert").length },
    { id: "faecher", e: "🎨", text: "Lerne diese Woche in 3 verschiedenen Fächern etwas Neues.", ziel: 3, wert: () => new Set(funde().filter(f => f.f !== "welt").map(f => f.f)).size },
    { id: "erklaeren", e: "🗣️", text: "Erkläre diese Woche 2-mal einem Erwachsenen, was du gelernt hast.", ziel: 2, wert: () => funde().filter(f => f.x).length },
    { id: "welt", e: "🌍", text: "Schaffe diese Woche 3 Echte-Welt-Aufgaben.", ziel: 3, wert: () => funde().filter(f => f.f === "welt").length },
    { id: "stempel", e: "📅", text: "Schaffe an 4 Tagen alle Tagesaufgaben.", ziel: 4, wert: () => C() ? C().stempel().filter(t => t >= montag()).length : 0 }
  ];
  function wocheNr(m) { const [y, mo, t] = m.split("-").map(Number); return Math.floor(Date.UTC(y, mo - 1, t) / 604800000); }
  function woche() {
    const m = montag(), w = WOCHE[wocheNr(m) % WOCHE.length], wert = Math.min(w.wert(), w.ziel), d = lade();
    return { woche: m, id: w.id, e: w.e, text: w.text, ziel: w.ziel, wert, fertig: !!d.wochen[m], bereit: wert >= w.ziel && !d.wochen[m] };
  }
  // Belohnung abholen: 3 Sterne und eine Wochen-Medaille
  function abholen() {
    const w = woche(); if (!w.bereit) return 0;
    const d = lade(); d.wochen[w.woche] = w.id; const k = Object.keys(d.wochen).sort(); while (k.length > 120) delete d.wochen[k.shift()];
    S.speichere("schatz", d); S.gibSterne(3); return 3;
  }
  const medaillen = () => Object.entries(lade().wochen).sort((a, b) => b[0].localeCompare(a[0])).map(([wo, id]) => ({ woche: wo, id, e: (WOCHE.find(x => x.id === id) || { e: "⭐" }).e }));

  // Neu erreichte Pokale seit dem letzten Aufruf (für eine kurze Meldung)
  function neuePokale() {
    const d = lade(), alt = new Set(d.gesehen || []), jetzt = pokale().filter(p => p.hat), neu = jetzt.filter(p => !alt.has(p.id));
    if (neu.length) { d.gesehen = jetzt.map(p => p.id); S.speichere("schatz", d); }
    return neu;
  }
  window.Schatz = { pokale, woche, abholen, medaillen, neuePokale, WOCHE };
})();
