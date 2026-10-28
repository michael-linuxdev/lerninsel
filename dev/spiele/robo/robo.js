// Robo programmieren (30.10.2026): Robo Pixel läuft mit Befehlen über ein Gitter – vorwärts, links drehen, rechts drehen, später Schleifen.
// Lehrplan Werken Kl. 4 („Einfache Programmierumgebung: kurze Befehlsfolgen“) und Medienbildung (Problemlösen). Ohne Zeitdruck, Fehler zeigen
// die Stelle, an der das Programm nicht mehr passt („Fehler finden“). Daten: profil.daten.robo = { fertig: { level: Anzahl Bausteine } }.
(function () {
  const S = window.Spielwelt, C = window.Charakter, SP = window.Sprache;
  const $ = (id) => document.getElementById(id);
  const N = 5, ZELLE = 100;
  const NAME = { v: "⬆️", l: "↰", r: "↱" }, WORT = { v: "vorwärts", l: "links drehen", r: "rechts drehen" };
  // Level: start [x, y, Richtung 0 = hoch, 1 = rechts, 2 = runter, 3 = links], ziel [x, y], steine, max (Bausteine), schleife (erlaubt), loesung (für den Test)
  const LEVELS = [
    { start: [0, 4, 0], ziel: [0, 1], text: "Bring Robo zum Stern! Er schaut nach oben.", loesung: "vvv" },
    { start: [0, 4, 1], ziel: [4, 4], text: "Robo schaut nach rechts. Wie oft muss er vorwärts gehen?", loesung: "vvvv" },
    { start: [0, 4, 0], ziel: [2, 2], text: "Jetzt musst du Robo auch drehen. Drehen bewegt ihn nicht vom Fleck!", loesung: "vvrvv" },
    { start: [0, 4, 1], ziel: [4, 0], text: "Ein langer Weg in die Ecke.", loesung: "vvvvlvvvv" },
    { start: [0, 2, 1], ziel: [4, 2], steine: [[2, 2]], text: "Ein Stein liegt im Weg. Fahr außen herum!", loesung: "vlvrvvrvlv" },
    { start: [2, 4, 0], ziel: [2, 0], steine: [[2, 2], [1, 1]], text: "Zwei Steine – finde einen Weg.", loesung: "vrvlvvvlv" },
    { start: [0, 0, 2], ziel: [4, 4], steine: [[0, 3], [2, 1], [3, 3]], text: "Kreuz und quer durch die Steine.", loesung: "vvlvvvvrvv" },
    { start: [4, 4, 3], ziel: [0, 0], steine: [[2, 4], [3, 2], [1, 1]], text: "Robo schaut nach links. Achte gut auf seine Richtung!", loesung: "rvvvvlvvvv" },
    { start: [0, 4, 1], ziel: [4, 4], max: 2, schleife: true, text: "Neu: die Schleife 🔁! Sie wiederholt Befehle. Schaffst du es mit nur 2 Bausteinen?", loesung: "4[v]" },
    { start: [0, 4, 0], ziel: [0, 0], max: 2, schleife: true, text: "Ganz nach oben – mit nur 2 Bausteinen.", loesung: "4[v]" },
    { start: [0, 4, 1], ziel: [4, 0], max: 5, schleife: true, text: "Eine Treppe! Was wiederholt sich immer wieder? Höchstens 5 Bausteine.", loesung: "4[vlvr]" },
    { start: [0, 4, 0], ziel: [4, 4], steine: [[1, 4], [1, 3], [3, 4], [3, 3], [1, 1], [3, 1]], max: 9, schleife: true, text: "Hoch, rüber, runter – nutze Schleifen. Höchstens 9 Bausteine.", loesung: "2[v]r4[v]r2[v]" },
    { start: [2, 2, 0], ziel: [2, 2], umweg: true, max: 6, schleife: true, text: "Fahr einmal im Quadrat um die Mitte und komm zurück zum Start. Höchstens 6 Bausteine.", loesung: "4[vrvr]" }
  ];
  // Level 13 (umweg): Ziel = Start, gilt erst nach mindestens vier Schritten

  const daten = () => Object.assign({ fertig: {} }, S.lade("robo") || {});
  const speichere = (d) => S.speichere("robo", d);
  let lv = null, nr = 0, prog = [], offen = null, laeuft = false, zustand = null;
  const schnell = () => !!window.__testSchnell;
  const sprich = (t) => { if (SP && SP.sprich) SP.sprich(t, "de-DE"); };

  // ---------- Programm als Liste: "v" | "l" | "r" | { n, innen: [...] } ----------
  const bausteine = (p) => p.reduce((s, b) => s + (typeof b === "string" ? 1 : 1 + b.innen.length), 0);
  const ausrollen = (p) => [].concat(...p.map((b, i) => typeof b === "string" ? [{ c: b, i }] : [].concat(...Array.from({ length: b.n }, () => b.innen.map(c => ({ c, i }))))));
  function parse(t) {   // "4[vlvr]" → Programm (für Test und Lösung)
    const p = []; let i = 0;
    while (i < t.length) { const m = t.slice(i).match(/^(\d)\[([vlr]*)\]/); if (m) { p.push({ n: +m[1], innen: m[2].split("") }); i += m[0].length; } else p.push(t[i++]); }
    return p;
  }
  function simuliere(level, p) {
    let [x, y, d] = level.start; const stein = (a, b) => (level.steine || []).some(s => s[0] === a && s[1] === b), schritte = [];
    let gelaufen = 0;
    for (const s of ausrollen(p)) {
      if (s.c === "l") d = (d + 3) % 4; else if (s.c === "r") d = (d + 1) % 4;
      else { const nx = x + [0, 1, 0, -1][d], ny = y + [-1, 0, 1, 0][d];
        if (nx < 0 || ny < 0 || nx >= N || ny >= N) { schritte.push({ x, y, d, fehler: "rand", i: s.i }); return { ok: false, schritte, grund: "rand", i: s.i }; }
        if (stein(nx, ny)) { schritte.push({ x, y, d, fehler: "stein", i: s.i }); return { ok: false, schritte, grund: "stein", i: s.i }; }
        x = nx; y = ny; gelaufen++; }
      schritte.push({ x, y, d, i: s.i });
    }
    const ok = x === level.ziel[0] && y === level.ziel[1] && (!level.umweg || gelaufen >= 4);
    return { ok, schritte, grund: ok ? "" : "daneben" };
  }

  // ---------- Zeichnen ----------
  function robo(x, y, d, farbe = "#2F86C8") {
    return `<g transform="translate(${x * ZELLE + 50} ${y * ZELLE + 50}) rotate(${d * 90})"><rect x="-28" y="-26" width="56" height="52" rx="14" fill="${farbe}"/>` +
      `<circle cx="-11" cy="-6" r="7" fill="#fff"/><circle cx="11" cy="-6" r="7" fill="#fff"/><circle cx="-11" cy="-8" r="3.5" fill="#1B2A44"/><circle cx="11" cy="-8" r="3.5" fill="#1B2A44"/>` +
      `<path d="M-10 -32 L0 -46 L10 -32 Z" fill="#E5484D"/><rect x="-12" y="10" width="24" height="5" rx="2.5" fill="#fff"/></g>`;
  }
  function zeichneFeld(pos, spur = []) {
    let h = "";
    for (let i = 0; i <= N; i++) h += `<line x1="${i * ZELLE}" y1="0" x2="${i * ZELLE}" y2="${N * ZELLE}" stroke="#D6E4F2" stroke-width="3"/><line x1="0" y1="${i * ZELLE}" x2="${N * ZELLE}" y2="${i * ZELLE}" stroke="#D6E4F2" stroke-width="3"/>`;
    spur.forEach(([x, y]) => { h += `<circle cx="${x * ZELLE + 50}" cy="${y * ZELLE + 50}" r="9" fill="#9FD3F5"/>`; });
    (lv.steine || []).forEach(([x, y]) => { h += `<text x="${x * ZELLE + 50}" y="${y * ZELLE + 66}" font-size="54" text-anchor="middle">🪨</text>`; });
    h += `<text x="${lv.ziel[0] * ZELLE + 50}" y="${lv.ziel[1] * ZELLE + 68}" font-size="56" text-anchor="middle" opacity="${lv.umweg ? 0.35 : 1}">⭐</text>`;
    h += robo(pos[0], pos[1], pos[2], pos[3] ? "#E5484D" : "#2F86C8");
    $("gitter").setAttribute("viewBox", `-6 -6 ${N * ZELLE + 12} ${N * ZELLE + 12}`); $("gitter").innerHTML = h;
  }
  function zeichneProgramm(markiere = -1, fehler = -1) {
    $("zeile").innerHTML = prog.map((b, i) => typeof b === "string"
      ? `<button class="befehl${i === markiere ? " dran" : ""}${i === fehler ? " fehler" : ""}" data-i="${i}" aria-label="${WORT[b]}">${NAME[b]}</button>`
      : `<button class="befehl schleife${i === markiere ? " dran" : ""}${i === fehler ? " fehler" : ""}${b === offen ? " offen" : ""}" data-i="${i}" aria-label="Schleife ${b.n} mal">🔁${b.n}× [${b.innen.map(c => NAME[c]).join("")}${b === offen ? " …" : ""}]</button>`).join("") || `<span class="klein">Tippe unten auf die Befehle.</span>`;
    const n = bausteine(prog);
    $("laenge").textContent = lv.max ? `(${n} von höchstens ${lv.max} Bausteinen)` : `(${n} Bausteine)`;
    $("tasten").querySelectorAll("[data-zu]").forEach(b => { b.hidden = !offen; });
  }
  function zeichneTasten() {
    $("tasten").innerHTML = ["v", "l", "r"].map(c => `<button class="befehl" data-c="${c}" aria-label="${WORT[c]}">${NAME[c]}</button>`).join("") +
      (lv.schleife ? [2, 3, 4].map(n => `<button class="befehl schleife" data-n="${n}" aria-label="Schleife ${n} mal">🔁${n}×</button>`).join("") + `<button class="befehl schleife" data-zu="1" hidden aria-label="Schleife zu">] zu</button>` : "");
    $("tasten").querySelectorAll("[data-c]").forEach(b => b.addEventListener("click", () => tippe(b.dataset.c)));
    $("tasten").querySelectorAll("[data-n]").forEach(b => b.addEventListener("click", () => schleife(+b.dataset.n)));
    $("tasten").querySelectorAll("[data-zu]").forEach(b => b.addEventListener("click", () => { offen = null; S.ton("tipp"); zeichneProgramm(); }));
  }
  function tippe(c) { if (laeuft) return; S.ton("tipp"); if (offen) offen.innen.push(c); else prog.push(c); meldung(""); zeichneFeld(lv.start); zeichneProgramm(); }
  function schleife(n) { if (laeuft) return; S.ton("tipp"); offen = { n, innen: [] }; prog.push(offen); meldung("Jetzt die Befehle für die Schleife tippen, dann „] zu“.", ""); zeichneProgramm(); }
  function meldung(t, art = "") { $("meldung").textContent = t; $("meldung").className = "meldung" + (art ? " " + art : ""); }

  // ---------- Ablauf ----------
  function zeigeListe() {
    laeuft = false; $("liste-ansicht").hidden = false; $("spiel-ansicht").hidden = true;
    const d = daten(), frei = (i) => i === 0 || d.fertig[i - 1];
    $("intro").textContent = Object.keys(d.fertig).length ? `Super, du hast schon ${Object.keys(d.fertig).length} von ${LEVELS.length} Aufgaben gelöst!` : "Hallo! Ich bin Robo Pixel. Ich mache genau, was du programmierst. Hilfst du mir zum Stern?";
    $("levels").innerHTML = LEVELS.map((l, i) => `<button data-l="${i}" class="${d.fertig[i] ? "fertig" : ""}" ${frei(i) ? "" : "disabled"}>${d.fertig[i] ? "⭐" : frei(i) ? "▶️" : "🔒"} ${i + 1}<small>${l.schleife ? "Schleife" : (l.steine ? "Steine" : "Weg")}</small></button>`).join("");
    $("levels").querySelectorAll("[data-l]").forEach(b => b.addEventListener("click", () => { S.ton("tipp"); starte(+b.dataset.l); }));
  }
  function starte(i) {
    nr = i; lv = LEVELS[i]; prog = []; offen = null; laeuft = false; zustand = null;
    $("liste-ansicht").hidden = true; $("spiel-ansicht").hidden = false; scrollTo(0, 0);
    $("level-titel").textContent = `Aufgabe ${i + 1} von ${LEVELS.length}`; $("auftrag").textContent = lv.text; sprich(lv.text);
    zeichneTasten(); zeichneFeld(lv.start); zeichneProgramm(); meldung("");
  }
  function start() {
    if (laeuft || !prog.length) return;
    offen = null; zeichneProgramm();
    if (lv.max && bausteine(prog) > lv.max) { meldung(`Zu viele Bausteine: ${bausteine(prog)}. Schaffst du es mit höchstens ${lv.max}? Tipp: Was wiederholt sich?`, "nein"); S.ton("nein"); return; }
    const r = simuliere(lv, prog); laeuft = true; zustand = r; let k = 0; const spur = [];
    const schritt = () => {
      if (k >= r.schritte.length) return ende(r);
      const s = r.schritte[k++]; spur.push([s.x, s.y]); zeichneFeld([s.x, s.y, s.d, !!s.fehler], spur); zeichneProgramm(s.i, s.fehler ? s.i : -1);
      setTimeout(schritt, schnell() ? 20 : 480);
    };
    schritt();
  }
  function ende(r) {
    laeuft = false;
    if (r.ok) {
      const d = daten(), neu = !d.fertig[nr]; d.fertig[nr] = bausteine(prog); speichere(d);
      meldung(nr + 1 < LEVELS.length ? "🎉 Geschafft! Robo ist am Ziel." : "🎉 Alle Aufgaben gelöst – du kannst programmieren!", "gut"); S.ton("juhu"); sprich("Geschafft!");
      if (neu) { if (C) C.gib("tablet", 2); if (neu && Object.keys(d.fertig).length === 1) S.gibSterne(1);
        if (window.Lernfunde && (nr === 0 || nr === 8 || nr === LEVELS.length - 1)) Lernfunde.merke({ fach: "tablet", art: "programmieren", e: "🤖", schluessel: "robo:" + nr, text: nr === 8 ? "Programmieren: Schleifen wiederholen Befehle" : nr === 0 ? "Programmieren: Befehle in der richtigen Reihenfolge" : "Programmieren: alle Robo-Aufgaben gelöst" }); }
      const w = document.createElement("button"); w.className = "knopf haupt"; w.id = "weiter"; w.textContent = nr + 1 < LEVELS.length ? "➡️ Nächste Aufgabe" : "Zur Übersicht";
      w.addEventListener("click", () => { S.ton("tipp"); if (nr + 1 < LEVELS.length) starte(nr + 1); else zeigeListe(); });
      $("meldung").appendChild(document.createElement("br")); $("meldung").appendChild(w);
    } else {
      S.ton("nein");
      meldung(r.grund === "stein" ? "Autsch, ein Stein! Der rot markierte Befehl passt nicht – ändere das Programm ab dort." : r.grund === "rand" ? "Halt, da ist der Rand! Der rot markierte Befehl passt nicht." : lv.umweg ? "Robo ist nicht wieder am Start angekommen. Schau, wo er steht, und ändere das Programm." : "Robo ist nicht beim Stern. Schau, wo er steht, und ändere das Programm.", "nein");
    }
  }
  $("start").addEventListener("click", () => { S.ton("tipp"); start(); });
  $("loeschen").addEventListener("click", () => { if (laeuft) return; S.ton("tipp");
    if (offen && offen.innen.length) offen.innen.pop(); else { const b = prog.pop(); if (b === offen) offen = null; }
    meldung(""); zeichneFeld(lv.start); zeichneProgramm(); });
  $("leeren").addEventListener("click", () => { if (laeuft) return; S.ton("tipp"); prog = []; offen = null; meldung(""); zeichneFeld(lv.start); zeichneProgramm(); });
  $("zur-liste").addEventListener("click", () => { S.ton("tipp"); zeigeListe(); });
  if (window.Figuren && Figuren.robo) $("robo-klein").outerHTML = `<div class="robo">${Figuren.robo("")}</div>`;

  zeigeListe();
  window.__robo = { LEVELS, parse, simuliere, starte, tippe, schleife, zu: () => { offen = null; zeichneProgramm(); }, start, programm: () => prog, daten };
})();
