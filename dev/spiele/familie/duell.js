// Kopfrechen-Duell: Kind gegen Erwachsenen auf einem Tablet (1–2 Minuten).
// Hochformat: oben und unten (die obere Hälfte ist gedreht – man sitzt sich gegenüber), Querformat: links und rechts.
// Jede Seite bekommt eigene Aufgaben mit drei Antworten: das Kind passend zur Klasse, Erwachsene schwerere (einstellbar).
// Wer zuerst 10 richtig hat, gewinnt – oder wer nach 90 Sekunden vorne liegt. Falsch = kurz 1 Sekunde Pause.
(function () {
  const S = window.Spielwelt, C = window.Charakter, $ = (id) => document.getElementById(id);
  const ZIEL = 10, DAUER = 90;
  const r = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const mische = (a) => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(x => x[1]);

  // Aufgaben nach Schwierigkeit 1 (Klasse 1) … 5 (für Erwachsene)
  function aufgabe(stufe) {
    let t, l;
    const art = Math.random();
    if (stufe <= 1) { if (art < 0.5) { const a = r(1, 9), b = r(1, 10 - a); t = `${a} + ${b}`; l = a + b; } else { const a = r(3, 10), b = r(1, a); t = `${a} − ${b}`; l = a - b; } }
    else if (stufe === 2) { if (art < 0.4) { const a = r(3, 15), b = r(2, 20 - a); t = `${a} + ${b}`; l = a + b; } else if (art < 0.75) { const a = r(8, 20), b = r(2, a - 1); t = `${a} − ${b}`; l = a - b; } else { const a = [2, 5, 10][r(0, 2)], b = r(1, 10); t = `${b} · ${a}`; l = a * b; } }
    else if (stufe === 3) { if (art < 0.5) { const a = r(2, 9), b = r(2, 10); t = `${a} · ${b}`; l = a * b; } else if (art < 0.75) { const a = r(12, 60), b = r(11, 39); t = `${a} + ${b}`; l = a + b; } else { const b = r(2, 9), e = r(2, 9); t = `${b * e} : ${b}`; l = e; } }
    else if (stufe === 4) { if (art < 0.5) { const a = r(12, 25), b = r(3, 9); t = `${a} · ${b}`; l = a * b; } else { const a = r(120, 480), b = r(110, 390); t = `${a} + ${b}`; l = a + b; } }
    else { if (art < 0.4) { const a = r(13, 29), b = r(6, 19); t = `${a} · ${b}`; l = a * b; } else if (art < 0.7) { const a = r(301, 899), b = r(102, 299); t = `${a} − ${b}`; l = a - b; } else { const b = r(6, 19), e = r(7, 19); t = `${b * e} : ${b}`; l = e; } }
    const falsch = new Set();
    while (falsch.size < 2) { const d = [1, 2, 10, -1, -2, -10][r(0, 5)], f = l + d; if (f >= 0 && f !== l) falsch.add(f); }
    return { t, l, opts: mische([l, ...falsch]) };
  }

  const kindStufe = () => Math.max(1, Math.min(4, S.kind().klasse || 2));
  let erwStufe = 5, laeuft = false, zeit = 0, timer = null;
  const spieler = {
    kind: { punkte: 0, sperre: 0, a: null, stufe: kindStufe(), el: $("kind") },
    erw: { punkte: 0, sperre: 0, a: null, stufe: erwStufe, el: $("erw") }
  };
  function zeige(sp) {
    const s = spieler[sp];
    s.a = aufgabe(s.stufe);
    s.el.querySelector(".aufgabe").textContent = `${s.a.t} = ?`;
    s.el.querySelector(".antworten").innerHTML = s.a.opts.map(o => `<button class="antwort" data-w="${o}">${o}</button>`).join("");
    s.el.querySelector(".punkte").textContent = `${s.punkte} / ${ZIEL}`;
  }
  function antworte(sp, wert, knopf) {
    const s = spieler[sp]; if (!laeuft || Date.now() < s.sperre) return;
    if (+wert === s.a.l) {
      s.punkte++; S.ton("wahl");
      if (sp === "kind" && C) C.gib("mathe", 1);   // zählt wie Lernen
      if (s.punkte >= ZIEL) return ende();
      zeige(sp);
    } else {
      S.ton("nein"); knopf.classList.add("falsch"); s.sperre = Date.now() + 1000; s.el.classList.add("pause");
      setTimeout(() => { s.el.classList.remove("pause"); }, 1000);
    }
  }
  ["kind", "erw"].forEach(sp => spieler[sp].el.addEventListener("pointerdown", (e) => { const b = e.target.closest(".antwort"); if (b) { e.preventDefault(); antworte(sp, b.dataset.w, b); } }));

  function start() {
    spieler.kind.stufe = kindStufe(); spieler.erw.stufe = erwStufe;
    ["kind", "erw"].forEach(sp => { spieler[sp].punkte = 0; spieler[sp].sperre = 0; zeige(sp); });
    zeit = 0; laeuft = true; $("start").hidden = true; $("ende").hidden = true;
    clearInterval(timer); timer = setInterval(() => { zeit++; $("uhr").textContent = Math.max(0, DAUER - zeit); if (zeit >= DAUER) ende(); }, 1000);
    $("uhr").textContent = DAUER;
  }
  function ende() {
    if (!laeuft) return; laeuft = false; clearInterval(timer);
    const k = spieler.kind.punkte, e = spieler.erw.punkte, name = S.profil.name || "Kind";
    const text = k > e ? `🏆 ${name} gewinnt ${k} : ${e}!` : k < e ? `Die Erwachsenen gewinnen ${e} : ${k} – Revanche?` : `Unentschieden ${k} : ${e}!`;
    $("ende-text").textContent = text; $("ende").hidden = false; S.ton("juhu");
    if (window.Familie) Familie.merke("duell", `${name} ${k} : ${e} Erwachsene`);
    if (C) C.ereignis("mathe-runde");
  }
  $("los").addEventListener("click", () => { S.ton("tipp"); start(); });
  $("nochmal").addEventListener("click", () => { S.ton("tipp"); start(); });
  document.querySelectorAll("[data-erw]").forEach(b => b.addEventListener("click", () => {
    erwStufe = +b.dataset.erw; document.querySelectorAll("[data-erw]").forEach(x => x.classList.toggle("an", x === b)); S.ton("tipp");
  }));
  $("kind-name").textContent = S.profil.name || "Kind";
  window.__duell = { start, antworte: (sp, richtig) => { const s = spieler[sp]; antworte(sp, richtig ? s.a.l : s.a.l + 1, s.el.querySelector(".antwort")); }, spieler, ende };
})();
