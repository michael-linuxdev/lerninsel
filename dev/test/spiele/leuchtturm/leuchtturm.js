// Tildas Leuchtturm (07.11.2026, Kapitel 6 „Der Leuchtturm“): Licht-Rätsel in der Höhle unter dem Leuchtturm und Tildas Schatzkammer.
// Licht-Rätsel: Eine Lampe links schickt einen Lichtstrahl nach rechts. Das Kind tippt Spiegel an und dreht sie (/ ↔ \), bis der Strahl
// alle Kristalle trifft. Felsen halten das Licht auf. Denken in Wegen und Richtungen (Raum und Form: Lage und Wege, ma.rf.02).
// Stufen: a (Vorschule, Kl. 1) 4 × 4, ein oder zwei Spiegel · b (Kl. 2) 5 × 5, zwei oder drei Spiegel und ein Fels ·
// c (ab Kl. 3) 6 × 6, drei oder vier Spiegel, zwei Kristalle, zwei Felsen. Jedes Rätsel hat genau eine Lösung (geprüft in tests/leuchtturm.js).
// Eine Runde = 3 Rätsel; zuerst noch nicht gelöste der eigenen Stufe, dann der nächsten, dann wieder von vorn. Kein Zeitdruck, kein Zufall:
// Die Rätsel sind feste Daten. 💡 Tipp markiert einen Spiegel, der noch falsch steht (kostet nichts).
// Sterne nur für neue Ziele: jedes Rätsel beim ersten Lösen 1 ⭐ (höchstens 3 am Tag); Können und Erfahrung ebenfalls nur beim ersten Lösen
// (ohne Tipp = gekonnt), damit „Noch eine Runde“ mit gelösten Rätseln weder Mein Können aufbläht noch über Stufenaufstiege Sterne nachschiebt.
// Schatzkammer: zeigt, was das Kind auf der Insel geschafft hat (Lernfunde, Matheweg, Werkstatt, Sachthemen, Ernten, Tiere …) als Schätze.
// Daten leuchtturm = { geloest: { id: n }, neu: { "JJJJ-MM-TT": n }, runden: n }. Test-Haken: window.__leuchtturm.
(function () {
  const S = window.Spielwelt, SP = window.Sprache;
  const $ = (id) => document.getElementById(id);
  const esc = S.esc;
  const ru = (t) => (S.hilfe() && t ? `<span class="ru">${esc(t)}</span>` : "");
  const D = "#3B1F63", RUNDE = 3, STERNE_TAG = 3, LZ = ["ma.rf.02"];
  // Rätsel: [id, Zeile der Lampe, Feld] – "/" und "L" (= \) Spiegel in der Lösungsstellung, "#" Fels, "*" Kristall, "." frei.
  // Zu Beginn stehen alle Spiegel verkehrt herum.
  const RAETSEL = [
    ["a1", 0, [".L..", "....", "....", ".*.."]],
    ["a2", 2, [".*..", "....", "./..", "...."]],
    ["a3", 3, [".*..", "....", "....", "./.."]],
    ["a4", 1, ["....", ".L..", ".L.*", "...."]],
    ["a5", 2, ["....", "./.*", "./..", "...."]],
    ["a6", 3, ["....", "/..*", "....", "/..."]],
    ["a7", 2, ["....", "/..*", "/...", "...."]],
    ["a8", 2, ["....", "*L..", "./..", "...."]],
    ["b1", 2, ["#....", "/...*", "/....", ".....", "....."]],
    ["b2", 4, [".....", "...#.", ".....", "./..*", "./..."]],
    ["b3", 3, [".....", "....#", ".....", "...L.", "...L*"]],
    ["b4", 4, [".....", "..#..", "./..L", ".....", "./..*"]],
    ["b5", 4, ["*....", ".....", ".....", "LL...", "./#.."]],
    ["b6", 0, [".L...", ".LL..", ".....", "#....", "..*.."]],
    ["b7", 1, [".#...", ".L...", ".LL..", ".....", "..*.."]],
    ["b8", 0, ["....L", ".#/./", ".....", ".....", "..*.."]],
    ["c1", 4, ["......", "....#.", "./.*.L", "..#...", "./....", ".....*"]],
    ["c2", 0, [".L....", "......", ".*....", ".....#", ".LL...", "..*..#"]],
    ["c3", 0, [".L....", ".LL.#.", "......", "..*.#.", "......", "..*..."]],
    ["c4", 2, ["..#...", "./L...", "./....", "..*...", ".....#", "..*..."]],
    ["c5", 5, ["......", "#/*..*", "......", ".LL..#", "......", "../..."]],
    ["c6", 0, [".L...#", "#LL...", "..L.**", "......", "......", "......"]],
    ["c7", 0, ["...L..", "......", "..#*..", "././..", "*/...#", "......"]],
    ["c8", 2, ["../*.*", "/./...", "/....#", "......", "......", "....#."]]
  ].map(([id, q, z]) => ({ id, stufe: id[0], q, z }));
  const STUFEN = ["a", "b", "c"];
  const stufeFuer = (code) => (["vs", "1"].includes(code) ? "a" : code === "2" ? "b" : "c");
  const stufe = () => window.__leuchtturmStufe || stufeFuer(((S.stufe && S.stufe()) || {}).code || "2");
  const offen = () => S.offen(!!(window.Story && Story.kapitel() >= 6));
  const daten = () => Object.assign({ geloest: {}, neu: {}, runden: 0 }, S.lade("leuchtturm") || {});
  const speichere = (d) => S.speichere("leuchtturm", d);
  let tildaText = "", lauf = null, brett = null, reiter = "raetsel";
  function tilda(de, r) { tildaText = de; $("tilda-text").innerHTML = esc(de) + ru(r); }

  // ---------- Strahl ----------
  // Feld g = Liste von Zeichenketten oder Zeichen-Listen; liefert die Felder, durch die das Licht läuft, und wo es endet
  function strahl(g, q) {
    const n = g.length, weg = [], gesehen = new Set();
    let y = q, x = 0, dy = 0, dx = 1, ende = "rand";
    while (y >= 0 && y < n && x >= 0 && x < n) {
      const k = `${y},${x},${dy},${dx}`; if (gesehen.has(k)) { ende = "kreis"; break; } gesehen.add(k);
      weg.push([y, x]); const c = g[y][x];
      if (c === "#") { ende = "fels"; break; }
      if (c === "/") [dy, dx] = [-dx, -dy]; else if (c === "L") [dy, dx] = [dx, dy];
      y += dy; x += dx;
    }
    return { weg, ende, raus: [y, x] };
  }
  const kristalle = (g) => { const l = []; g.forEach((z, y) => [...z].forEach((c, x) => { if (c === "*") l.push([y, x]); })); return l; };
  const getroffen = (g, q) => { const w = new Set(strahl(g, q).weg.map(String)); return kristalle(g).filter(p => w.has(String(p))); };
  const geloest = (g, q) => getroffen(g, q).length === kristalle(g).length;
  const spiegelVon = (g) => { const l = []; g.forEach((z, y) => [...z].forEach((c, x) => { if (c === "/" || c === "L") l.push([y, x]); })); return l; };
  const dreh = (c) => (c === "/" ? "L" : "/");
  const startFeld = (r) => r.z.map(z => [...z].map(c => (c === "/" || c === "L" ? dreh(c) : c)));

  // ---------- Runde ----------
  function waehle() {
    const d = daten(), i = STUFEN.indexOf(stufe()), eigen = RAETSEL.filter(r => r.stufe === STUFEN[i]), naechste = RAETSEL.filter(r => r.stufe === STUFEN[Math.min(2, i + 1)] && r.stufe !== STUFEN[i]);
    const offenEigen = eigen.filter(r => !d.geloest[r.id]), offenNaechste = naechste.filter(r => !d.geloest[r.id]);
    const liste = offenEigen.concat(offenNaechste);
    // alles gelöst: wieder von vorn, mit dem Rätsel nach der letzten Runde weiter
    const rest = eigen.concat(naechste), ab = (d.runden * RUNDE) % rest.length;
    return liste.concat(rest.slice(ab), rest.slice(0, ab)).filter((r, k, a) => a.indexOf(r) === k).slice(0, RUNDE);
  }
  // Wartezeit nach einem gelösten Rätsel abbrechen (Reiterwechsel, neue Runde) – sonst überschreibt „weiter“ die Schatzkammer oder springt ein Rätsel weiter
  function stoppe() { if (lauf && lauf.timer) { clearTimeout(lauf.timer); lauf.timer = null; } }
  function starteRunde() {
    stoppe();
    lauf = { liste: waehle(), pos: 0, geloestNeu: 0, sterne: 0, ohneTipp: 0, timer: null };
    tilda("Dreh die Spiegel, bis das Licht alle Kristalle trifft. Tipp einen Spiegel an!", "Поворачивай зеркала, пока свет не попадёт на все кристаллы. Нажми на зеркало!");
    zeigeRaetsel();
  }
  function zeigeRaetsel() {
    const r = lauf.liste[lauf.pos];
    brett = { r, g: startFeld(r), zuege: 0, tipp: false, fertig: false, markiert: null };
    $("bereich").innerHTML = `<section class="karte" id="raetselkarte">
      <p class="stand" id="stand">Rätsel ${lauf.pos + 1} von ${lauf.liste.length} · ${kristalle(r.z).length === 1 ? "1 Kristall" : kristalle(r.z).length + " Kristalle"}</p>
      <div class="brett-rahmen"><div class="brett" id="brett" style="--n:${r.z.length}"></div></div>
      <p class="hinweis" id="hinweis" aria-live="polite"></p>
      <div class="knoepfe"><button class="knopf" id="tipp">💡 Tipp</button><button class="knopf" id="neu-start">↩ Von vorn</button></div></section>`;
    $("brett").addEventListener("click", (e) => { const b = e.target.closest("[data-y]"); if (b) tippe(+b.dataset.y, +b.dataset.x); });
    $("tipp").addEventListener("click", tipp);
    $("neu-start").addEventListener("click", () => { if (brett.fertig) return; S.ton("tipp"); brett.g = startFeld(r); brett.markiert = null; male(); });
    male();
  }
  function spiegelSvg(c) {
    const l = c === "/" ? "M18 82 L82 18" : "M18 18 L82 82";
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${l}" stroke="${D}" stroke-width="22" stroke-linecap="round"/><path d="${l}" stroke="#BFEFFF" stroke-width="12" stroke-linecap="round"/><path d="${l}" stroke="#fff" stroke-width="3" stroke-linecap="round" transform="translate(-3 -3)"/></svg>`;
  }
  function male() {
    const { r, g } = brett, n = g.length, s = strahl(g, r.q), treff = new Set(getroffen(g, r.q).map(String)), lichtAuf = new Set(s.weg.map(String));
    // Gitter: Spalte 0 = Lampe, danach n Spalten
    let h = "";
    for (let y = 0; y < n; y++) {
      h += `<div class="lampe-feld">${y === r.q ? `<span class="lampe" aria-label="Lampe">🔦</span>` : ""}</div>`;
      for (let x = 0; x < n; x++) {
        const c = g[y][x], wo = `Reihe ${y + 1}, Feld ${x + 1}`;
        if (c === "/" || c === "L") h += `<button class="feld spiegel${brett.markiert === `${y},${x}` ? " markiert" : ""}${lichtAuf.has(`${y},${x}`) ? " licht" : ""}" data-y="${y}" data-x="${x}" aria-label="Spiegel ${wo} drehen">${spiegelSvg(c)}</button>`;
        else if (c === "#") h += `<div class="feld fels" role="img" aria-label="Fels ${wo}">🪨</div>`;
        else if (c === "*") h += `<div class="feld kristall${treff.has(`${y},${x}`) ? " an" : ""}" role="img" aria-label="Kristall ${wo}${treff.has(`${y},${x}`) ? ", leuchtet" : ""}">💎</div>`;
        else h += `<div class="feld"></div>`;
      }
    }
    // Strahl als SVG darüber: Mitte der Felder (Einheit 100), Lampe in Spalte 0
    const pkt = (y, x) => `${(x + 1) * 100 + 50},${y * 100 + 50}`;
    const punkte = [`${100 - 20},${r.q * 100 + 50}`].concat(s.weg.map(([y, x]) => pkt(y, x)));
    if (s.ende === "rand") { const [y, x] = s.raus; punkte.push(`${Math.max(100, Math.min((n + 1) * 100, (x + 1) * 100 + 50))},${Math.max(0, Math.min(n * 100, y * 100 + 50))}`); }
    else if (s.ende === "fels") { punkte.pop(); const [y, x] = s.weg[s.weg.length - 1], [py, px] = s.weg.length > 1 ? s.weg[s.weg.length - 2] : [r.q, -1]; punkte.push(`${(px + 1) * 100 + 50 + (x - px) * 55},${py * 100 + 50 + (y - py) * 55}`); }
    h += `<svg class="strahl" viewBox="0 0 ${(n + 1) * 100} ${n * 100}" preserveAspectRatio="none" aria-hidden="true">
      <polyline points="${punkte.join(" ")}" fill="none" stroke="${D}" stroke-width="26" stroke-linejoin="round" stroke-linecap="round" opacity=".55"/>
      <polyline points="${punkte.join(" ")}" fill="none" stroke="#FFE14D" stroke-width="16" stroke-linejoin="round" stroke-linecap="round"/>
      <polyline points="${punkte.join(" ")}" fill="none" stroke="#FFFBE0" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
    $("brett").innerHTML = h;
  }
  function tippe(y, x) {
    if (!brett || brett.fertig) return;
    const c = brett.g[y][x]; if (c !== "/" && c !== "L") return;
    S.ton("tipp"); brett.g[y][x] = dreh(c); brett.zuege++; if (brett.markiert === `${y},${x}`) brett.markiert = null;
    male();
    if (geloest(brett.g, brett.r.q)) return geschafft();
    const n = kristalle(brett.r.z).length, t = getroffen(brett.g, brett.r.q).length;
    $("hinweis").className = "hinweis";
    $("hinweis").innerHTML = n > 1 && t ? esc(`${t} von ${n} Kristallen leuchten. Weiter so!`) + ru(`Светятся ${t} из ${n} кристаллов.`) : "";
  }
  // Tipp: ein Spiegel, der anders steht als in der Lösung, blinkt
  function tipp() {
    if (!brett || brett.fertig) return;
    S.ton("tipp"); brett.tipp = true;
    const falsch = spiegelVon(brett.r.z).find(([y, x]) => brett.g[y][x] !== brett.r.z[y][x]);
    if (!falsch) return;
    brett.markiert = falsch.join(","); male();
    $("hinweis").className = "hinweis"; $("hinweis").innerHTML = esc("Schau mal: Dieser Spiegel steht noch falsch. Tipp ihn an!") + ru("Посмотри: это зеркало стоит неправильно. Нажми на него!");
  }
  function geschafft() {
    brett.fertig = true;
    const d = daten(), r = brett.r, heute = S.heute(), neu = !d.geloest[r.id];
    let stern = false;
    if (neu) {
      lauf.geloestNeu++;
      if ((d.neu[heute] || 0) < STERNE_TAG) { d.neu = { [heute]: (d.neu[heute] || 0) + 1 }; S.gibSterne(1); lauf.sterne++; stern = true; }
      if (window.Lernfunde) Lernfunde.merke({ fach: "mathe", art: "raetsel", e: "💡", text: `Licht-Rätsel ${r.id.toUpperCase()} gelöst`, schluessel: "leuchtturm:" + r.id });
    }
    if (!brett.tipp) lauf.ohneTipp++;
    // nur beim ersten Lösen: Können (ohne Tipp = gekonnt) und Erfahrung
    if (neu && window.Koennen) Koennen.melde(LZ, !brett.tipp);
    if (neu && window.Charakter) Charakter.gib("mathe", 1);
    d.geloest[r.id] = (d.geloest[r.id] || 0) + 1; speichere(d);
    S.ton("juhu"); $("sterne").textContent = S.sterne();
    $("tipp").disabled = true; $("neu-start").disabled = true;
    $("raetselkarte").classList.add("hell");
    $("hinweis").className = "hinweis gut";
    $("hinweis").innerHTML = esc(`Hell! Alle Kristalle leuchten.${stern ? " ⭐" : ""}`) + ru("Светло! Все кристаллы светятся.");
    lauf.timer = setTimeout(weiter, window.__testSchnell ? 120 : 1800);
  }
  function weiter() {
    if (!lauf || reiter !== "raetsel") return;
    lauf.timer = null;
    lauf.pos++;
    if (lauf.pos < lauf.liste.length) return zeigeRaetsel();
    ende();
  }
  function ende() {
    const d = daten(); d.runden = (d.runden || 0) + 1; speichere(d);
    if (window.Ereignisse && Ereignisse.melde) Ereignisse.melde("leuchtturm", { runde: d.runden });
    brett = null;
    tilda(`Der Leuchtturm strahlt! Danke, ${S.profil.name || "du"}. Heute Nacht leuchtet die ganze Insel.`, "Маяк светит! Сегодня ночью светится весь остров.");
    $("bereich").innerHTML = `<section class="karte ende" id="ende"><div class="turm-gross" aria-hidden="true">${turmSvg(true)}</div><h2>💡 Der Leuchtturm strahlt!</h2>
      <p>${lauf.liste.length} Rätsel gelöst${lauf.ohneTipp === lauf.liste.length ? ", alle ohne Tipp" : ""}.${lauf.sterne ? ` Neue Rätsel: +${lauf.sterne} ⭐` : ""}</p>
      <div class="knoepfe"><button class="knopf haupt" id="nochmal">💡 Noch eine Runde</button><button class="knopf" id="zur-kammer">💎 Schatzkammer</button><a class="knopf" href="../welt3d/heimat.html">🏝️ Zur Insel</a></div></section>`;
    $("nochmal").addEventListener("click", () => { S.ton("tipp"); starteRunde(); });
    $("zur-kammer").addEventListener("click", () => { S.ton("tipp"); zeigeReiter("kammer"); });
  }
  function turmSvg(an) {
    return `<svg viewBox="0 0 160 170" width="150" height="160">
      ${an ? `<path d="M80 34 L4 6 L4 62 Z" fill="#FFE14D" opacity=".75"/><path d="M80 34 L156 6 L156 62 Z" fill="#FFE14D" opacity=".75"/>` : ""}
      <path d="M58 160 L66 52 L94 52 L102 160 Z" fill="#fff" stroke="${D}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M62 116 L98 116 L100 140 L60 140 Z M64 80 L96 80 L97 98 L63 98 Z" fill="#FF6F61"/>
      <rect x="62" y="22" width="36" height="30" rx="6" fill="${an ? "#FFE14D" : "#C9C3D6"}" stroke="${D}" stroke-width="5"/>
      <path d="M58 22 L80 6 L102 22 Z" fill="#FF6F61" stroke="${D}" stroke-width="5" stroke-linejoin="round"/>
      <rect x="44" y="156" width="72" height="10" rx="5" fill="#9A8C7A" stroke="${D}" stroke-width="4"/></svg>`;
  }

  // ---------- Schatzkammer ----------
  const zahl = (o) => Object.values(o || {}).filter(x => x).length;
  function schaetze() {
    const L = (k) => S.lade(k) || {}, m = L("mathe");
    const mathe = ["k1", "k2", "k3", "k4", "k5"].reduce((n, w) => n + zahl(m[w]), 0);
    const flug = Object.values(L("wetterdrache").fluege || {}).reduce((a, b) => a + b, 0);
    return [
      ["🌳", "Lernfunde", window.Lernfunde ? Lernfunde.gesamt() : 0, "Находки"],
      ["", "Matheweg-Stationen", mathe, "Станции математики"],
      ["", "Werkstatt-Kapitel", zahl(L("deutsch").kapitel), "Главы мастерской"],
      ["", "Sachthemen", zahl(L("sachkunde").themen), "Темы"],
      ["", "Englisch-Lektionen", zahl(L("englisch").lektionen), "Уроки английского"],
      ["🥕", "Ernten im Garten", zahl(L("garten").geerntet), "Урожай"],
      ["🦔", "Tiere ausgewildert", zahl(L("tierstation").frei), "Выпущенные животные"],
      ["🥨", "Tage in der Bäckerei", zahl(L("baeckerei").tage), "Дни в пекарне"],
      ["🎣", "Wörter geangelt", zahl(L("angeln").richtig), "Пойманные слова"],
      ["🛶", "Rhythmen", zahl(L("rhythmus").geschafft), "Ритмы"],
      ["🪁", "Drachenflüge", flug, "Полёты змея"],
      ["♟️", "Schach-Rätsel", zahl(L("schach").raetsel), "Шахматные задачи"],
      ["💡", "Licht-Rätsel", zahl(daten().geloest), "Световые загадки"],
      ["🧭", "Eilande erforscht", zahl(L("expedition").eilande), "Исследованные острова"]
    ];
  }
  function kammer() {
    const l = schaetze(), zahl = window.Story ? Story.KAPITEL_ZAHL : 0, kap = Math.min(zahl, window.Story ? Story.kapitel() : 0);
    tilda("Das ist meine Schatzkammer. Jede Truhe zeigt, was du auf der Insel geschafft hast.", "Это моя сокровищница. Каждый сундук показывает, что ты сделал на острове.");
    $("bereich").innerHTML = `<section class="karte" id="kammer"><h2>💎 Tildas Schatzkammer</h2>
      <p class="stand">Kapitel ${kap} von ${zahl} erlebt · ${l.filter(x => x[2]).length} von ${l.length} Truhen gefüllt</p>
      <div class="truhen" id="truhen" data-ausgleich>${l.map(([e, t, n, r]) => `<div class="truhe${n ? "" : " zu"}"><span class="e" aria-hidden="true">${n ? e : "🧰"}</span><b>${n}</b><span>${esc(t)}${ru(r)}</span></div>`).join("")}</div>
      <p class="klein">Leere Truhen füllen sich ganz von allein, wenn du etwas Neues ausprobierst. Nichts geht verloren.</p>
      <div class="knoepfe"><a class="knopf" href="../schatz/">🏆 Pokale und Medaillen</a><a class="knopf" href="../album/#chronik">📜 Inselchronik</a></div></section>`;
  }
  function zeigeReiter(r) {
    stoppe(); reiter = r;
    document.querySelectorAll(".reiter [data-reiter]").forEach(b => { b.classList.toggle("an", b.dataset.reiter === r); b.setAttribute("aria-selected", b.dataset.reiter === r ? "true" : "false"); });
    if (r === "kammer") { brett = null; kammer(); } else starteRunde();
  }

  // ---------- Start ----------
  $("sterne").textContent = S.sterne();
  $("tilda-vorlesen").addEventListener("click", () => { if (SP) SP.sprich(tildaText); });
  $("reiter").addEventListener("click", (e) => { const b = e.target.closest("[data-reiter]"); if (b) { S.ton("tipp"); zeigeReiter(b.dataset.reiter); } });
  if (!offen()) {
    $("zu").hidden = false; $("bereich").hidden = true; $("reiter").hidden = true;
    tilda("Der Leuchtturm ist noch dunkel. Wenn du viel gelernt hast, zeige ich dir den Weg.", "Маяк ещё тёмный. Когда ты многому научишься, я покажу тебе дорогу.");
  } else zeigeReiter(location.hash === "#kammer" ? "kammer" : "raetsel");

  window.__leuchtturm = { get lauf() { return lauf; }, get brett() { return brett; }, get reiter() { return reiter; }, RAETSEL, STUFEN, RUNDE, STERNE_TAG, strahl, geloest, getroffen, kristalle, startFeld, spiegelVon,
    waehle, stufe, stufeFuer, daten, schaetze, starteRunde, zeigeReiter, tippe, tipp };
})();
