// Schach mit Schildkröte Tilda (PLAN 8b): Figuren lernen, Matt-in-1-Rätsel, gegen die KI, zu zweit.
// Regeln in regeln.js (vereinfacht: ohne Rochade und en passant, Bauern werden Dame).
(function () {
  const S = window.Spielwelt, C = window.Charakter, R = window.Schach, SP = window.Sprache, $ = (id) => document.getElementById(id);
  const ZEICHEN = { K: "♚", Q: "♛", R: "♜", B: "♝", N: "♞", P: "♟" };
  const daten = () => Object.assign({ lektionen: {}, raetsel: {}, siege: {}, rennen: 0 }, S.lade("schach") || {});
  // Bauern-Rennen (01.11.2026, für Jüngere): nur Bauern; wer zuerst die letzte Reihe erreicht (oder der Gegner nicht mehr ziehen kann), gewinnt
  const RENNEN = "wPa2 wPb2 wPc2 wPd2 wPe2 wPf2 wPg2 wPh2 bPa7 bPb7 bPc7 bPd7 bPe7 bPf7 bPg7 bPh7";
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
    ["bKh8 bPh7 bPg7 wRf1 wBd4 wKg1", "Der König ist hinter seinen Bauern eingesperrt – der Turm setzt matt."]
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
    if (modus === "rennen") return rennenZug();
    amZug = R.gegner(amZug); zeichne(); nachZug();
  }
  function nachZug() {
    const st = R.stand(b, amZug);
    if (st) return spielEnde(st);
    if (R.imSchach(b, amZug)) tilda(amZug === R.WEISS ? "Achtung, dein König steht im Schach! Schütze ihn." : "Schach! Gut gemacht.");
    else tilda(modus === "zwei" ? (amZug === R.WEISS ? "Weiß ist am Zug." : "Schwarz ist am Zug.") : "Du bist dran – tippe auf eine weiße Figur.");
    if (modus === "ki" && amZug === R.SCHWARZ) {
      denkt = true; tilda("Tilda denkt nach … \uE107");
      setTimeout(() => { const z = R.kiZug(b, R.SCHWARZ, kiStufe); denkt = false; if (z) { b = R.ziehe(b, z); letzter = z; amZug = R.WEISS; zeichne(); nachZug(); } }, 350);
    }
    if (modus === "zwei") $("brett").classList.toggle("gedreht", $("drehen").checked && amZug === R.SCHWARZ);
  }
  function spielEnde(st) {
    fertig = true; zeichne();
    const gewinner = st === "matt" ? R.gegner(amZug) : null;
    let text = st === "matt" ? (modus === "zwei" ? `Schachmatt! ${gewinner === R.WEISS ? "Weiß" : "Schwarz"} gewinnt!` : gewinner === R.WEISS ? "Schachmatt! Du hast gewonnen! 🎉" : "Schachmatt – diesmal hat Tilda gewonnen. Verlieren gehört dazu – nochmal?")
      : st === "patt" ? "Patt – unentschieden! Wer am Zug ist, kann keinen Zug mehr machen, steht aber nicht im Schach." : "Unentschieden – nur noch die Könige sind übrig.";
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
  function neuesBrett(stellung, m) { b = R.aufstellen(stellung); amZug = R.WEISS; wahl = null; ziele = []; letzter = null; sterne = new Set(); fertig = false; modus = m; $("nochmal").hidden = true; $("tipp").hidden = !(m === "ki" || m === "rennen"); $("brett").classList.remove("gedreht"); $("drehen-zeile").hidden = m !== "zwei"; zeigeBereich("spiel"); }
  // ---------- Bauern-Rennen ----------
  function rennenSieger() { if (b.includes("Q")) return R.WEISS; if (b.includes("q")) return R.SCHWARZ; return null; }
  function rennenZug() {
    let sieger = rennenSieger();
    if (!sieger) { amZug = R.SCHWARZ; if (!R.zuege(b, R.SCHWARZ).length) sieger = R.WEISS; }
    zeichne(); if (sieger) return rennenEnde(sieger);
    denkt = true; tilda("Tilda überlegt … \uE107");
    setTimeout(() => {
      const z = R.kiZug(b, R.SCHWARZ, 1); denkt = false;
      if (z) { b = R.ziehe(b, z); letzter = z; }
      amZug = R.WEISS; let s = rennenSieger(); if (!s && !R.zuege(b, R.WEISS).length) s = R.SCHWARZ;
      zeichne(); if (s) return rennenEnde(s);
      tilda("Du bist dran! Bauern ziehen geradeaus und schlagen schräg.");
    }, 350);
  }
  function rennenEnde(sieger) {
    fertig = true; zeichne(); $("nochmal").hidden = false;
    if (sieger === R.WEISS) {
      const d = daten(), erster = !d.rennen; d.rennen = (d.rennen || 0) + 1; speichere(d);
      if (erster) { S.gibSterne(1); if (window.Lernfunde) Lernfunde.merke({ fach: "schach", art: "rennen", e: "🏁", text: "Schach: Bauern-Rennen gewonnen – Bauern ziehen geradeaus und schlagen schräg", schluessel: "rennen" }); }
      if (C && C.gib) C.gib("mathe", 1);
      tilda(erster ? "Geschafft! Dein Bauer ist angekommen – dafür gibt es einen Stern ⭐." : "Geschafft! Dein Bauer ist angekommen! 🎉"); S.ton("juhu");
    } else { tilda("Diesmal war Tilda schneller. Langsam und klug – nochmal?"); S.ton("tipp"); }
  }
  function starteRennen() {
    neuesBrett(RENNEN, "rennen"); $("spiel-titel").textContent = "🏁 Bauern-Rennen";
    tilda("Bring einen Bauern ans andere Ende! Bauern ziehen geradeaus – am Anfang auch zwei Felder – und schlagen schräg."); zeichne();
  }
  // Tipp (gegen Tilda und im Rennen): Tilda zeigt einen guten Zug
  $("tipp").addEventListener("click", () => {
    if (fertig || denkt || amZug !== R.WEISS) return;
    const z = R.kiZug(b, R.WEISS, 2); if (!z) return;
    wahl = z.von; ziele = [z.nach]; S.ton("tipp"); zeichne(); tilda(`Wie wäre es mit ${R.name(z.von)} nach ${R.name(z.nach)}? Tippe auf das grüne Feld.`);
  });
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
    $("spiel-titel").textContent = `\uE107 Gegen Tilda (${["", "leicht", "mittel", "schwer"][stufe]})`; tilda("Du spielst Weiß und fängst an. Tippe auf eine Figur, dann auf ein grünes Feld."); zeichne();
  }
  function starteZwei() {
    neuesBrett(R.START, "zwei"); $("spiel-titel").textContent = "👨‍👧 Schach zu zweit"; tilda("Weiß fängt an. Danach seid ihr abwechselnd dran."); zeichne();
  }
  $("nochmal").addEventListener("click", () => { S.ton("tipp"); if (modus === "lernen") { const i = LEKTIONEN.indexOf(lektion); starteLektion(LEKTIONEN[(i + 1) % LEKTIONEN.length]); } else if (modus === "raetsel") starteRaetsel((raetsel + 1) % RAETSEL.length); else if (modus === "ki") starteKi(kiStufe); else if (modus === "rennen") starteRennen(); else starteZwei(); });
  $("zurueck").addEventListener("click", () => { S.ton("tipp"); auswahl(); });
  $("drehen").addEventListener("change", () => $("brett").classList.toggle("gedreht", $("drehen").checked && amZug === R.SCHWARZ));

  function auswahl() {
    const d = daten(); zeigeBereich("auswahl"); modus = null;
    $("lektionen").innerHTML = LEKTIONEN.map((l, i) => `<button class="kachel ${d.lektionen[l.id] ? "fertig" : ""}" data-l="${i}"><span class="e">${l.e}</span>${l.name}${d.lektionen[l.id] ? "<small>✅ gelernt</small>" : ""}</button>`).join("");
    $("raetsel").innerHTML = RAETSEL.map((r, i) => `<button class="kachel klein ${d.raetsel[i] ? "fertig" : ""}" data-r="${i}"><span class="e">🧩</span>${i + 1}${d.raetsel[i] ? " ✅" : ""}</button>`).join("");
    $("ki-zahl").textContent = Object.keys(d.siege).length ? `Siege gegen Tilda: ${Object.entries(d.siege).map(([s, n]) => `${["", "leicht", "mittel", "schwer"][s]} ${n}×`).join(", ")}` : "";
    $("rennen-zahl").textContent = d.rennen ? `Bauern-Rennen gewonnen: ${d.rennen}×` : "";
    tilda(`Hallo ${S.profil.name || "du"}! Ich bin Tilda, die Schach-Schildkröte. Langsam und klug gewinnt! Was möchtest du machen?`);
  }
  $("lektionen").addEventListener("click", e => { const k = e.target.closest("[data-l]"); if (k) { S.ton("tipp"); starteLektion(LEKTIONEN[+k.dataset.l]); } });
  $("raetsel").addEventListener("click", e => { const k = e.target.closest("[data-r]"); if (k) { S.ton("tipp"); starteRaetsel(+k.dataset.r); } });
  document.querySelectorAll("[data-ki]").forEach(k => k.addEventListener("click", () => { S.ton("tipp"); starteKi(+k.dataset.ki); }));
  $("zu-zweit").addEventListener("click", () => { S.ton("tipp"); starteZwei(); });
  $("rennen").addEventListener("click", () => { S.ton("tipp"); starteRennen(); });
  auswahl();
  // ---------- Russisch (Entwurf 10.11.2026, nur mit Hilfesprache): Tildas Sätze und die Erklärtexte, vorlesbar über shared/sprache.js ----------
  if (SP && SP.ruDazu) {
    // Paare [deutsch, russisch] – so zeigt auch die Prüfliste (quellen/ru-sammeln.js) beide Fassungen nebeneinander
    const L_PAARE = [
      ["Der Turm fährt gerade: nach oben, unten, links und rechts – so weit er will. Sammle alle Sterne!", "Ладья ходит прямо: вверх, вниз, влево и вправо – так далеко, как хочет. Собери все звёзды!"],
      ["Der Läufer läuft schräg – immer auf Feldern seiner Farbe. Sammle alle Sterne!", "Слон ходит наискосок – всегда по полям своего цвета. Собери все звёзды!"],
      ["Die Dame ist die stärkste Figur: Sie kann gerade UND schräg ziehen.", "Ферзь – самая сильная фигура: он ходит и прямо, И наискосок."],
      ["Der König macht nur einen Schritt – in jede Richtung. Er ist langsam, aber wichtig!", "Король делает только один шаг – в любую сторону. Он медленный, но важный!"],
      ["Der Springer springt wie ein L: zwei Felder gerade und eins zur Seite. Er kann über andere Figuren springen!", "Конь прыгает буквой Г: два поля прямо и одно в сторону. Он может перепрыгивать через другие фигуры!"],
      ["Der Bauer geht geradeaus – am Anfang auch zwei Felder. Schlagen darf er nur schräg nach vorne. Am Ende wird er zur Dame!", "Пешка ходит прямо – в начале можно на два поля. Бить можно только наискосок вперёд. В конце она превращается в ферзя!"]
    ];
    const FERTIG_PAARE = [
      ["Super! Alle Sterne gesammelt. Jetzt weißt du, wie der Turm zieht!", "Супер! Все звёзды собраны. Теперь ты знаешь, как ходит ладья!"],
      ["Super! Alle Sterne gesammelt. Jetzt weißt du, wie der Läufer zieht!", "Супер! Все звёзды собраны. Теперь ты знаешь, как ходит слон!"],
      ["Super! Alle Sterne gesammelt. Jetzt weißt du, wie die Dame zieht!", "Супер! Все звёзды собраны. Теперь ты знаешь, как ходит ферзь!"],
      ["Super! Alle Sterne gesammelt. Jetzt weißt du, wie der König zieht!", "Супер! Все звёзды собраны. Теперь ты знаешь, как ходит король!"],
      ["Super! Alle Sterne gesammelt. Jetzt weißt du, wie der Springer zieht!", "Супер! Все звёзды собраны. Теперь ты знаешь, как ходит конь!"],
      ["Super! Alle Sterne gesammelt. Jetzt weißt du, wie der Bauer zieht!", "Супер! Все звёзды собраны. Теперь ты знаешь, как ходит пешка!"]
    ];
    const R_PAARE = [
      ["Weiß zieht und setzt matt! Der schwarze König ist hinter seinen Bauern gefangen …", "Белые ходят и ставят мат! Чёрный король заперт за своими пешками …"],
      ["Weiß zieht und setzt matt! Die Dame kann weit ziehen. Wohin?", "Белые ходят и ставят мат! Ферзь может ходить далеко. Куда?"],
      ["Weiß zieht und setzt matt! Der Turm hat freie Bahn.", "Белые ходят и ставят мат! У ладьи свободный путь."],
      ["Weiß zieht und setzt matt! Dein König hilft der Dame.", "Белые ходят и ставят мат! Твой король помогает ферзю."],
      ["Weiß zieht und setzt matt! Der König kann nicht weg – ein Springer-Trick!", "Белые ходят и ставят мат! Король не может уйти – хитрость с конём!"],
      ["Weiß zieht und setzt matt! Zwei Türme arbeiten zusammen.", "Белые ходят и ставят мат! Две ладьи работают вместе."],
      ["Weiß zieht und setzt matt! Der Springer hat das letzte Wort.", "Белые ходят и ставят мат! Последнее слово за конём."],
      ["Weiß zieht und setzt matt! Wo ist Schwarz schwach? Schau auf f7!", "Белые ходят и ставят мат! Где у чёрных слабое место? Посмотри на f7!"],
      ["Weiß zieht und setzt matt! Der Läufer passt auf – der Turm schlägt zu.", "Белые ходят и ставят мат! Слон следит – ладья бьёт."]
    ];
    SP.ruDazu([
      ["Hallo {name}! Ich bin Tilda, die Schach-Schildkröte. Langsam und klug gewinnt! Was möchtest du machen?", "Привет, {name}! Я Тильда, черепаха-шахматистка. Медленно и умно – и побеждаешь! Что ты хочешь делать?"],
      ["Hallo du! Ich bin Tilda, die Schach-Schildkröte. Langsam und klug gewinnt! Was möchtest du machen?", "Привет! Я Тильда, черепаха-шахматистка. Медленно и умно – и побеждаешь! Что ты хочешь делать?"],
      ["Achtung, dein König steht im Schach! Schütze ihn.", "Внимание, твоему королю шах! Защити его."], ["Schach! Gut gemacht.", "Шах! Молодец."],
      ["Weiß ist am Zug.", "Ход белых."], ["Schwarz ist am Zug.", "Ход чёрных."], ["Du bist dran – tippe auf eine weiße Figur.", "Твой ход – нажми на белую фигуру."],
      ["Tilda denkt nach …", "Тильда думает …"], ["Tilda überlegt …", "Тильда размышляет …"],
      ["Schachmatt! Weiß gewinnt!", "Мат! Белые выиграли!"], ["Schachmatt! Schwarz gewinnt!", "Мат! Чёрные выиграли!"], ["Schachmatt! Du hast gewonnen!", "Мат! Ты выиграл!"],
      ["Schachmatt – diesmal hat Tilda gewonnen. Verlieren gehört dazu – nochmal?", "Мат – на этот раз выиграла Тильда. Проигрывать – тоже часть игры. Ещё раз?"],
      ["Patt – unentschieden! Wer am Zug ist, kann keinen Zug mehr machen, steht aber nicht im Schach.", "Пат – ничья! У того, чей ход, нет ни одного хода, но шаха нет."],
      ["Unentschieden – nur noch die Könige sind übrig.", "Ничья – остались только короли."],
      ["Du bist dran! Bauern ziehen geradeaus und schlagen schräg.", "Твой ход! Пешки ходят прямо, а бьют наискосок."],
      ["Geschafft! Dein Bauer ist angekommen – dafür gibt es einen Stern.", "Получилось! Твоя пешка дошла – за это звезда."], ["Geschafft! Dein Bauer ist angekommen!", "Получилось! Твоя пешка дошла!"],
      ["Diesmal war Tilda schneller. Langsam und klug – nochmal?", "На этот раз Тильда была быстрее. Медленно и умно – ещё раз?"],
      ["Bring einen Bauern ans andere Ende! Bauern ziehen geradeaus – am Anfang auch zwei Felder – und schlagen schräg.", "Доведи пешку до другого края! Пешки ходят прямо – в начале можно на два поля – и бьют наискосок."],
      ["Wie wäre es mit e2 nach e4? Tippe auf das grüne Feld.", "Как насчёт хода {f0} – {f1}? Нажми на зелёное поле."],
      ["Schachmatt! Toll gesehen!", "Мат! Отлично увидел!"], ["Das ist noch kein Matt. Schau nochmal genau – ich stelle zurück.", "Это ещё не мат. Посмотри внимательно – я верну ход."],
      ["Du spielst Weiß und fängst an. Tippe auf eine Figur, dann auf ein grünes Feld.", "Ты играешь белыми и начинаешь. Нажми на фигуру, потом на зелёное поле."],
      ["Weiß fängt an. Danach seid ihr abwechselnd dran.", "Белые начинают. Потом ходите по очереди."],
      ["Jede Figur zieht anders. Sammle mit ihr alle Sterne!", "Каждая фигура ходит по-своему. Собери ею все звёзды!"],
      ["Weiß zieht – und der schwarze König kann nicht mehr entkommen.", "Белые ходят – и чёрный король уже не может убежать."],
      ["Für den Anfang: nur Bauern. Wer zuerst einen Bauern ans andere Ende bringt, gewinnt!", "Для начала – только пешки. Кто первым доведёт пешку до другого края, тот выиграл!"],
      ["Einfache Regeln für den Anfang: ohne Rochade und „en passant“, ein Bauer am Ende wird zur Dame.", "Простые правила для начала: без рокировки и взятия на проходе, пешка в конце становится ферзём."],
      ...L_PAARE, ...FERTIG_PAARE, ...R_PAARE,
    ]);
    SP.ruBeobachte("#tilda-text, .klein-t");
  }
  window.__schach = { starteLektion: (i) => starteLektion(LEKTIONEN[i]), starteRaetsel, starteKi, starteRennen, zug, stellung: (t) => { b = R.aufstellen(t); zeichne(); }, get brett() { return b; }, LEKTIONEN, RAETSEL };
})();
