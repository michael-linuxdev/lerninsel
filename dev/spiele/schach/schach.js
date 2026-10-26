// Schach mit Schildkröte Tilda (PLAN 8b): Figuren lernen, Matt-in-1-Rätsel, gegen die KI, zu zweit.
// Regeln in regeln.js (vereinfacht: ohne Rochade und en passant, Bauern werden Dame).
(function () {
  const S = window.Spielwelt, C = window.Charakter, R = window.Schach, SP = window.Sprache, $ = (id) => document.getElementById(id);
  const ZEICHEN = { K: "♚", Q: "♛", R: "♜", B: "♝", N: "♞", P: "♟" };
  const daten = () => Object.assign({ lektionen: {}, raetsel: {}, siege: {} }, S.lade("schach") || {});
  const speichere = (d) => S.speichere("schach", d);
  const sprich = (t) => { if (SP && SP.sprich) SP.sprich(t, "de-DE"); };
  const tilda = (t) => { $("tilda-text").textContent = t; };

  // ---------- Lernen: jede Figur sammelt Sterne ----------
  const LEKTIONEN = [
    { id: "turm", name: "Der Turm", e: "♜", text: "Der Turm fährt gerade: nach oben, unten, links und rechts – so weit er will. Sammle alle Sterne!", stellung: "wRa1", sterne: ["a5", "e5", "e8", "h8"] },
    { id: "laeufer", name: "Der Läufer", e: "♝", text: "Der Läufer läuft schräg – immer auf Feldern seiner Farbe. Sammle alle Sterne!", stellung: "wBc1", sterne: ["f4", "d6", "h2", "a3"] },
    { id: "dame", name: "Die Dame", e: "♛", text: "Die Dame ist die stärkste Figur: Sie kann gerade UND schräg ziehen.", stellung: "wQd1", sterne: ["d5", "h5", "e8", "a4"] },
    { id: "koenig", name: "Der König", e: "♚", text: "Der König macht nur einen Schritt – in jede Richtung. Er ist langsam, aber wichtig!", stellung: "wKe1", sterne: ["e3", "g3", "g1"] },
    { id: "springer", name: "Der Springer", e: "♞", text: "Der Springer springt wie ein L: zwei Felder gerade und eins zur Seite. Er kann über andere Figuren springen!", stellung: "wNb1 wPc2 wPd2", sterne: ["c3", "d5", "f6", "g8"] },
    { id: "bauer", name: "Der Bauer", e: "♟", text: "Der Bauer geht geradeaus – am Anfang auch zwei Felder. Schlagen darf er nur schräg nach vorne. Am Ende wird er zur Dame!", stellung: "wPe2 bPd5 bPc7", sterne: ["e4", "d5", "c7", "c8"] }
  ];
  // ---------- Matt in 1 (alle mit regeln.js geprüft) ----------
  const RAETSEL = [
    ["bKg8 bPf7 bPg7 bPh7 wRa1 wKg1", "Der schwarze König ist hinter seinen Bauern gefangen …"],
    ["bKh8 bPg7 bPh7 wQd4 wKa1", "Die Dame kann weit ziehen. Wohin?"],
    ["bKa8 bPa7 bPb7 wRh1 wKg1", "Der Turm hat freie Bahn."],
    ["bKe8 wKe6 wQa7", "Dein König hilft der Dame."],
    ["bKh8 bRg8 bPg7 bPh7 wNg5 wKa1", "Der König kann nicht weg – ein Springer-Trick!"],
    ["bKa8 wKc6 wRb7 wRh1", "Zwei Türme arbeiten zusammen."],
    ["bKh1 bPh2 wKf2 wNe4", "Der Springer hat das letzte Wort."],
    ["bKe8 bPd7 bPe7 bPf7 bQd8 bBf8 wQh5 wBc4 wKe1", "Wo ist Schwarz schwach? Schau auf f7!"],
    ["bKh8 bPh7 bPg7 wRf1 wBd4 wKg1", "Der Läufer passt auf – der Turm schlägt zu."]
  ];

  // ---------- Brett ----------
  let b = [], amZug = R.WEISS, wahl = null, ziele = [], letzter = null, modus = null, sterne = new Set(), fertig = false, lektion = null, raetsel = null, kiStufe = 1, denkt = false;
  function zeichne() {
    const el = $("brett"), ich = amZug, schach = R.imSchach(b, ich) ? b.indexOf(ich === R.WEISS ? "K" : "k") : -1;
    el.innerHTML = "";
    for (let i = 0; i < 64; i++) {
      const f = b[i], d = document.createElement("button"), r = Math.floor(i / 8), s = i % 8;
      d.className = "f " + ((r + s) % 2 ? "dunkel" : "hell") + (wahl === i ? " wahl" : "") + (ziele.includes(i) ? (f !== "." ? " schlag" : " ziel") : "") + (letzter && (letzter.von === i || letzter.nach === i) ? " letzt" : "") + (i === schach ? " schach" : "");
      d.dataset.i = i; d.setAttribute("aria-label", R.name(i) + (f !== "." ? " " + f : ""));
      if (f !== ".") d.innerHTML = `<span class="${R.farbe(f) === R.WEISS ? "weiss" : "schwarz"}">${ZEICHEN[f.toUpperCase()]}</span>`;
      else if (sterne.has(i)) d.innerHTML = `<span class="stern">⭐</span>`;
      if (sterne.has(i) && f !== ".") d.innerHTML += `<span class="stern klein">⭐</span>`;
      if (s === 0) d.innerHTML += `<small class="zahl">${8 - r}</small>`; if (r === 7) d.innerHTML += `<small class="buchst">${"abcdefgh"[s]}</small>`;
      el.appendChild(d);
    }
  }
  $("brett").addEventListener("click", e => {
    const f = e.target.closest(".f"); if (!f || fertig || denkt) return;
    const i = +f.dataset.i;
    if (ziele.includes(i)) return zug({ von: wahl, nach: i });
    const meine = modus === "zwei" ? amZug : R.WEISS;
    if (R.farbe(b[i]) === meine && amZug === meine) { wahl = i; ziele = R.zuege(b, meine).filter(z => z.von === i).map(z => z.nach); S.ton("tipp"); }
    else { wahl = null; ziele = []; }
    zeichne();
  });
  function zug(z) {
    b = R.ziehe(b, z); letzter = z; wahl = null; ziele = []; S.ton("wahl");
    if (modus === "lernen") {
      if (sterne.delete(z.nach)) { S.ton("juhu"); if (!sterne.size) return lektionFertig(); }
      return zeichne();
    }
    if (modus === "raetsel") return pruefeRaetsel();
    amZug = R.gegner(amZug); zeichne(); nachZug();
  }
  function nachZug() {
    const st = R.stand(b, amZug);
    if (st) return spielEnde(st);
    if (R.imSchach(b, amZug)) tilda(amZug === R.WEISS ? "Achtung, dein König steht im Schach! Schütze ihn." : "Schach! Gut gemacht.");
    else tilda(modus === "zwei" ? (amZug === R.WEISS ? "Weiß ist am Zug." : "Schwarz ist am Zug.") : "Du bist dran – tippe auf eine weiße Figur.");
    if (modus === "ki" && amZug === R.SCHWARZ) {
      denkt = true; tilda("Tilda denkt nach … 🐢");
      setTimeout(() => { const z = R.kiZug(b, R.SCHWARZ, kiStufe); denkt = false; if (z) { b = R.ziehe(b, z); letzter = z; amZug = R.WEISS; zeichne(); nachZug(); } }, 350);
    }
    if (modus === "zwei") $("brett").classList.toggle("gedreht", $("drehen").checked && amZug === R.SCHWARZ);
  }
  function spielEnde(st) {
    fertig = true; zeichne();
    const gewinner = st === "matt" ? R.gegner(amZug) : null;
    let text = st === "matt" ? (modus === "zwei" ? `Schachmatt! ${gewinner === R.WEISS ? "Weiß" : "Schwarz"} gewinnt!` : gewinner === R.WEISS ? "Schachmatt! Du hast gewonnen! 🎉" : "Schachmatt – diesmal hat Tilda gewonnen. Verlieren gehört dazu – nochmal?")
      : st === "patt" ? "Patt – unentschieden! Der König kann nicht ziehen, steht aber nicht im Schach." : "Unentschieden – nur noch die Könige sind übrig.";
    tilda(text); sprich(text); S.ton(gewinner === R.WEISS || modus === "zwei" ? "juhu" : "tipp");
    if (modus === "ki" && gewinner === R.WEISS) {
      const d = daten(), neu = !d.siege[kiStufe]; d.siege[kiStufe] = (d.siege[kiStufe] || 0) + 1; speichere(d);
      if (neu) { S.gibSterne(kiStufe + 1); if (window.Lernfunde) Lernfunde.merke({ fach: "schach", art: "sieg", e: "🏆", text: `Schach: zum ersten Mal gegen Tilda (${["", "leicht", "mittel", "schwer"][kiStufe]}) gewonnen!`, schluessel: "sieg" + kiStufe, melden: true }); }
    }
    if (modus === "zwei" && window.Familie) Familie.merke("schach", text);
    $("nochmal").hidden = false;
  }

  // ---------- Modi starten ----------
  function zeigeBereich(n) { ["auswahl", "spiel"].forEach(v => { $(v).hidden = v !== n; }); scrollTo(0, 0); }
  function neuesBrett(stellung, m) { b = R.aufstellen(stellung); amZug = R.WEISS; wahl = null; ziele = []; letzter = null; sterne = new Set(); fertig = false; modus = m; $("nochmal").hidden = true; $("brett").classList.remove("gedreht"); $("drehen-zeile").hidden = m !== "zwei"; zeigeBereich("spiel"); }
  function starteLektion(l) {
    lektion = l; neuesBrett(l.stellung, "lernen");
    sterne = new Set(l.sterne.map(R.feld));
    $("spiel-titel").textContent = `${l.e} ${l.name}`; tilda(l.text); sprich(l.text); zeichne();
  }
  function lektionFertig() {
    fertig = true; zeichne();
    const d = daten(), neu = !d.lektionen[lektion.id]; d.lektionen[lektion.id] = 1; speichere(d);
    if (neu) { S.gibSterne(1); if (window.Lernfunde) Lernfunde.merke({ fach: "schach", art: "figur", e: lektion.e, text: `Schach: So zieht ${lektion.name.replace("Der ", "der ").replace("Die ", "die ")}`, schluessel: "fig:" + lektion.id }); }
    if (C && C.gib) C.gib("mathe", 2);
    tilda(`Super! Alle Sterne gesammelt. Jetzt weißt du, wie ${lektion.name.replace("Der ", "der ").replace("Die ", "die ")} zieht!`); S.ton("juhu");
    $("nochmal").hidden = false;
  }
  function starteRaetsel(n) {
    raetsel = n; const [st, tipp] = RAETSEL[n]; neuesBrett(st, "raetsel");
    $("spiel-titel").textContent = `🧩 Matt in 1 – Rätsel ${n + 1}`; tilda(`Weiß zieht und setzt matt! ${tipp}`); zeichne();
  }
  function pruefeRaetsel() {
    if (R.stand(b, R.SCHWARZ) === "matt") {
      fertig = true; zeichne(); const d = daten(), neu = !d.raetsel[raetsel]; d.raetsel[raetsel] = 1; speichere(d);
      if (neu) { S.gibSterne(1); if (Object.keys(d.raetsel).length === RAETSEL.length && window.Lernfunde) Lernfunde.merke({ fach: "schach", art: "raetsel", e: "🧩", text: "Schach: alle Matt-in-1-Rätsel gelöst!", schluessel: "raetsel-alle", melden: true }); }
      if (C && C.gib) C.gib("mathe", 1);
      tilda("Schachmatt! Toll gesehen! 🎉"); S.ton("juhu"); $("nochmal").hidden = false;
    } else {
      zeichne(); tilda("Das ist noch kein Matt. Schau nochmal genau – ich stelle zurück."); S.ton("nein");
      setTimeout(() => { if (modus === "raetsel" && !fertig) { b = R.aufstellen(RAETSEL[raetsel][0]); letzter = null; zeichne(); } }, 1400);
    }
  }
  function starteKi(stufe) {
    kiStufe = stufe; neuesBrett(R.START, "ki");
    $("spiel-titel").textContent = `🐢 Gegen Tilda (${["", "leicht", "mittel", "schwer"][stufe]})`; tilda("Du spielst Weiß und fängst an. Tippe auf eine Figur, dann auf ein grünes Feld."); zeichne();
  }
  function starteZwei() {
    neuesBrett(R.START, "zwei"); $("spiel-titel").textContent = "👨‍👧 Schach zu zweit"; tilda("Weiß fängt an. Danach seid ihr abwechselnd dran."); zeichne();
  }
  $("nochmal").addEventListener("click", () => { S.ton("tipp"); if (modus === "lernen") { const i = LEKTIONEN.indexOf(lektion); starteLektion(LEKTIONEN[(i + 1) % LEKTIONEN.length]); } else if (modus === "raetsel") starteRaetsel((raetsel + 1) % RAETSEL.length); else if (modus === "ki") starteKi(kiStufe); else starteZwei(); });
  $("zurueck").addEventListener("click", () => { S.ton("tipp"); auswahl(); });
  $("drehen").addEventListener("change", () => $("brett").classList.toggle("gedreht", $("drehen").checked && amZug === R.SCHWARZ));

  function auswahl() {
    const d = daten(); zeigeBereich("auswahl"); modus = null;
    $("lektionen").innerHTML = LEKTIONEN.map((l, i) => `<button class="kachel ${d.lektionen[l.id] ? "fertig" : ""}" data-l="${i}"><span class="e">${l.e}</span>${l.name}${d.lektionen[l.id] ? "<small>✅ gelernt</small>" : ""}</button>`).join("");
    $("raetsel").innerHTML = RAETSEL.map((r, i) => `<button class="kachel klein ${d.raetsel[i] ? "fertig" : ""}" data-r="${i}"><span class="e">🧩</span>${i + 1}${d.raetsel[i] ? " ✅" : ""}</button>`).join("");
    $("ki-zahl").textContent = Object.keys(d.siege).length ? `Siege gegen Tilda: ${Object.entries(d.siege).map(([s, n]) => `${["", "leicht", "mittel", "schwer"][s]} ${n}×`).join(", ")}` : "";
    tilda(`Hallo ${S.profil.name || "du"}! Ich bin Tilda, die Schach-Schildkröte. Langsam und klug gewinnt! Was möchtest du machen?`);
  }
  $("lektionen").addEventListener("click", e => { const k = e.target.closest("[data-l]"); if (k) { S.ton("tipp"); starteLektion(LEKTIONEN[+k.dataset.l]); } });
  $("raetsel").addEventListener("click", e => { const k = e.target.closest("[data-r]"); if (k) { S.ton("tipp"); starteRaetsel(+k.dataset.r); } });
  document.querySelectorAll("[data-ki]").forEach(k => k.addEventListener("click", () => { S.ton("tipp"); starteKi(+k.dataset.ki); }));
  $("zu-zweit").addEventListener("click", () => { S.ton("tipp"); starteZwei(); });
  auswahl();
  window.__schach = { starteLektion: (i) => starteLektion(LEKTIONEN[i]), starteRaetsel, starteKi, zug, get brett() { return b; }, LEKTIONEN, RAETSEL };
})();
