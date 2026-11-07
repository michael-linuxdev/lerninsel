// Ellas Wetter-Drache an der Wetterstation (06.11.2026, Kapitel 5 „Der Sturm“): Sachunterricht „Wetter beobachten“ (su.na.04).
// Ablauf: 1) Wettertagebuch – das Kind schaut aus dem Fenster und trägt Wetter und Wind für heute ein (keine richtige oder falsche Antwort;
//         mit Ort im Elternbereich steht das gemessene Wetter daneben). 2) Fünf Wetter-Fragen je Klasse (Wind erkennen, passend anziehen,
//         Thermometer ablesen, Windsack, Regenmesser, Gewitter-Regeln). 3) Drachenflug: Leine ziehen, bis der Drache 8 Sekunden im grünen Band war.
// Stufen: a (Vorschule, Kl. 1) Bilder und warm/kalt · b (Kl. 2) Thermometer in 5er-Schritten · c (ab Kl. 3) Thermometer in 2er-Schritten
// mit Minusgraden, Windrichtung, Regenmenge. Sterne nur für neue Ziele: neue Frage beim ersten Versuch richtig (höchstens 3 am Tag),
// jede Wetterart zum ersten Mal im Tagebuch, erster Flug je Windstärke – nie Zufall. Nichts geht verloren, kein Zeitdruck außer im Flug.
// Daten wetterdrache = { geschafft: { id: n }, neu: { "JJJJ-MM-TT": n }, tagebuch: { "JJJJ-MM-TT": { art, wind } }, arten: { art: 1 }, fluege: { wind: n } }.
// Test-Haken: window.__wetter.
(function () {
  const S = window.Spielwelt, SP = window.Sprache;
  const $ = (id) => document.getElementById(id);
  const esc = S.esc;
  const ru = (t) => (S.hilfe() && t ? `<span class="ru">${esc(t)}</span>` : "");
  const D = "#3B1F63", RUNDE = 5, STERNE_TAG = 3, LZ = ["su.na.04"];
  const ARTEN = { sonne: ["☀️", "sonnig", "солнечно"], wolken: ["☁️", "bewölkt", "облачно"], regen: ["🌧️", "Regen", "дождь"], schnee: ["❄️", "Schnee", "снег"], nebel: ["🌫️", "Nebel", "туман"], gewitter: ["⛈️", "Gewitter", "гроза"] };
  const WIND = [["windstill", "Die Blätter bewegen sich nicht.", "безветрие"], ["leichter Wind", "Blätter rascheln, die Fahne flattert ein bisschen.", "лёгкий ветер"],
    ["kräftiger Wind", "Äste wackeln, die Fahne steht waagerecht.", "сильный ветер"], ["Sturm", "Ganze Bäume biegen sich. Bleib lieber drinnen!", "буря"]];
  const stufeFuer = (code) => (["vs", "1"].includes(code) ? "a" : code === "2" ? "b" : "c");
  const stufe = () => window.__wetterStufe || stufeFuer(((S.stufe && S.stufe()) || {}).code || "2");
  const offen = () => S.offen(!!(window.Story && Story.kapitel() >= 5));
  const daten = () => Object.assign({ geschafft: {}, neu: {}, tagebuch: {}, arten: {}, fluege: {} }, S.lade("wetterdrache") || {});
  const speichere = (d) => S.speichere("wetterdrache", d);
  let ellaText = "", lauf = null, flug = null;
  function ella(de, r) { ellaText = de; $("ella-text").innerHTML = esc(de) + ru(r); }

  // ---------- Bilder (SVG, Stil A) ----------
  // Szene mit Baum und Fahne: Wind 0–3 biegt Baum und Fahne
  function windBild(w) {
    const neig = [0, 6, 16, 30][w], fahne = [`M60 40 l0 26`, `M60 40 q14 6 26 14 l-26 6`, `M60 40 l34 4 l-34 10`, `M60 40 l38 2 l-38 6`][w];
    const blaetter = w >= 2 ? `<path d="M150 50 q6 -4 10 0 M168 70 q6 -4 10 0 M140 86 q6 -4 10 0" stroke="#5CA34A" stroke-width="4" fill="none" stroke-linecap="round"/>` : "";
    const linien = w ? Array.from({ length: w + 1 }, (_, i) => `<path d="M${14 + i * 8} ${30 + i * 22} q20 -6 40 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".9"/>`).join("") : "";
    return `<svg viewBox="0 0 220 150" class="bild" role="img" aria-label="Baum und Fahne im Wind">
      <rect width="220" height="150" rx="18" fill="#BFE7FF"/><rect y="120" width="220" height="30" fill="#8FD16A"/>${linien}
      <line x1="60" y1="120" x2="60" y2="38" stroke="${D}" stroke-width="4"/><path d="${fahne}" fill="#FF6F61" stroke="${D}" stroke-width="3" stroke-linejoin="round"/>
      <g transform="rotate(${neig} 130 120)"><rect x="124" y="70" width="12" height="50" fill="#9A6B3F" stroke="${D}" stroke-width="3"/>
      <ellipse cx="130" cy="58" rx="34" ry="30" fill="#5CA34A" stroke="${D}" stroke-width="3.5"/></g>${blaetter}</svg>`;
  }
  // Thermometer mit Skala (von, bis, Schritt der Striche) und rotem Faden bis t
  function thermoBild(t, von, bis, schritt) {
    const y = (x) => 130 - (x - von) / (bis - von) * 110;
    let striche = "";
    for (let x = von; x <= bis; x += schritt) { const lang = x % 10 === 0; striche += `<line x1="${lang ? 70 : 76}" y1="${y(x)}" x2="86" y2="${y(x)}" stroke="${D}" stroke-width="${lang ? 2.5 : 1.5}"/>` + (lang ? `<text x="64" y="${y(x) + 5}" font-size="13" text-anchor="end" fill="${D}" font-family="Fredoka, sans-serif" font-weight="600">${x}</text>` : ""); }
    return `<svg viewBox="0 0 160 160" class="bild thermo" role="img" aria-label="Thermometer">
      <rect x="86" y="12" width="20" height="126" rx="10" fill="#fff" stroke="${D}" stroke-width="3"/><circle cx="96" cy="142" r="14" fill="#FF6F61" stroke="${D}" stroke-width="3"/>
      <rect x="91" y="${y(t)}" width="10" height="${142 - y(t)}" fill="#FF6F61"/>${striche}
      <text x="128" y="30" font-size="16" fill="${D}" font-family="Fredoka, sans-serif" font-weight="700">°C</text></svg>`;
  }
  // Windsack an einer Stange; nach: "osten" | "westen" | "norden" | "sueden" (Bild zeigt Norden oben)
  function windsackBild(nach) {
    const r = { osten: 0, sueden: 90, westen: 180, norden: 270 }[nach];
    return `<svg viewBox="0 0 200 160" class="bild" role="img" aria-label="Windsack und Kompass">
      <rect width="200" height="160" rx="18" fill="#EAF6FF"/>
      <g font-family="Fredoka, sans-serif" font-weight="700" font-size="15" fill="${D}" text-anchor="middle"><text x="100" y="20">N</text><text x="100" y="154">S</text><text x="14" y="86">W</text><text x="186" y="86">O</text></g>
      <circle cx="100" cy="80" r="5" fill="${D}"/>
      <g transform="rotate(${r} 100 80)"><path d="M104 66 L164 72 L164 88 L104 94 Z" fill="#FF8A5B" stroke="${D}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M124 68 L124 92 M144 70 L144 90" stroke="#fff" stroke-width="6"/></g></svg>`;
  }
  // Regenmesser (Becher mit mm-Skala bis 20, Wasser bis mm)
  function regenBild(mm) {
    const y = (x) => 140 - x * 5.5;
    let s = "";
    for (let x = 0; x <= 20; x += 2) s += `<line x1="${x % 10 === 0 ? 46 : 52}" y1="${y(x)}" x2="60" y2="${y(x)}" stroke="${D}" stroke-width="${x % 10 === 0 ? 2.5 : 1.5}"/>` + (x % 10 === 0 ? `<text x="40" y="${y(x) + 5}" text-anchor="end" font-size="13" fill="${D}" font-family="Fredoka, sans-serif" font-weight="600">${x}</text>` : "");
    return `<svg viewBox="0 0 150 160" class="bild" role="img" aria-label="Regenmesser">
      <rect x="60" y="${y(mm)}" width="44" height="${140 - y(mm)}" fill="#7FC8F8"/><path d="M60 22 L60 140 L104 140 L104 22" fill="none" stroke="${D}" stroke-width="3.5"/>
      <path d="M50 14 L114 14 L104 24 L60 24 Z" fill="#fff" stroke="${D}" stroke-width="3"/>${s}<text x="112" y="152" font-size="13" fill="${D}" font-family="Fredoka, sans-serif" font-weight="700">mm</text></svg>`;
  }
  const himmel = (art) => `<div class="himmel">${ARTEN[art][0]}</div>`;

  // ---------- Fragen (fest, je Stufe; ab = kleinste Stufe) ----------
  // f: { id, ab, bild(), frage, ru, optionen: [richtig, …], warum, warumRu, wind? }
  const STUFEN = ["a", "b", "c"];
  const FRAGEN = [];
  const neu = (f) => FRAGEN.push(f);
  [0, 1, 2, 3].forEach(w => neu({ id: "wind-" + w, ab: "a", wind: w, bild: () => windBild(w), frage: "Wie stark weht der Wind?", ru: "Как сильно дует ветер?",
    optionen: [WIND[w][0], ...WIND.filter((_, i) => i !== w).map(x => x[0]).slice(0, 2)], warum: WIND[w][1] + (w === 0 ? " Ohne Wind fällt ein Drache herunter." : w === 3 ? " Bei Sturm lassen wir keinen Drachen steigen." : " Gutes Drachenwetter!"),
    warumRu: w === 0 ? "Без ветра змей падает." : w === 3 ? "В бурю змея не запускают." : "Хорошая погода для змея!" }));
  neu({ id: "anziehen-regen", ab: "a", bild: () => himmel("regen"), frage: "Es regnet. Was ziehst du an?", ru: "Идёт дождь. Что ты наденешь?", optionen: ["Regenjacke und Gummistiefel", "Sonnenhut und Sandalen", "Badehose"], warum: "Die Regenjacke hält dich trocken.", warumRu: "Дождевик защищает от воды." });
  neu({ id: "anziehen-schnee", ab: "a", bild: () => himmel("schnee"), frage: "Es schneit. Was ziehst du an?", ru: "Идёт снег. Что ты наденешь?", optionen: ["Mütze, Schal und Handschuhe", "T-Shirt und kurze Hose", "Sonnenbrille und Sandalen"], warum: "Im Schnee ist es kalt. Mütze und Handschuhe halten warm.", warumRu: "Снег – холодно. Шапка и перчатки греют." });
  neu({ id: "anziehen-sonne", ab: "a", bild: () => himmel("sonne"), frage: "Die Sonne scheint heiß. Was brauchst du?", ru: "Солнце жарит. Что тебе нужно?", optionen: ["Sonnenhut und Wasser", "Dicke Winterjacke", "Gummistiefel"], warum: "Der Hut schützt den Kopf, Wasser trinken ist wichtig.", warumRu: "Шляпа защищает голову, важно пить воду." });
  neu({ id: "gewitter", ab: "a", bild: () => himmel("gewitter"), frage: "Es blitzt und donnert. Was machst du?", ru: "Гремит гром и сверкает молния. Что ты делаешь?", optionen: ["Ins Haus gehen", "Unter einen hohen Baum stellen", "Den Drachen steigen lassen"], warum: "Bei Gewitter ist es im Haus am sichersten. Nie unter Bäume und nie mit Drachen!", warumRu: "В грозу безопаснее всего дома. Никогда под деревья и никогда со змеем!" });
  neu({ id: "warm-kalt", ab: "a", bild: () => thermoBild(28, 0, 40, 10), frage: "Das Thermometer zeigt viel Rot. Ist es warm oder kalt?", ru: "На термометре много красного. Тепло или холодно?", optionen: ["warm", "kalt"], warum: "Je höher der rote Faden, desto wärmer.", warumRu: "Чем выше красная полоска, тем теплее." });
  [5, 15, 20, 30].forEach(t => neu({ id: "thermo-b" + t, ab: "b", bild: () => thermoBild(t, 0, 40, 5), frage: "Wie viel Grad zeigt das Thermometer?", ru: "Сколько градусов показывает термометр?",
    optionen: [`${t} °C`, `${t + 5} °C`, `${t - 10 < 0 ? t + 10 : t - 10} °C`], warum: `Lies ab, wo der rote Faden aufhört: ${t} Grad.`, warumRu: `Посмотри, где кончается красная полоска: ${t} градусов.` }));
  neu({ id: "wolken-regen", ab: "b", bild: () => himmel("wolken"), frage: "Dicke, dunkle Wolken ziehen auf. Was kommt wohl gleich?", ru: "Идут тёмные тучи. Что, наверное, будет?", optionen: ["Regen", "Sonne pur", "Ein Regenbogen ohne Regen"], warum: "Dunkle Wolken sind voller Wassertropfen.", warumRu: "Тёмные тучи полны капель воды." });
  [-4, 6, 14, 22].forEach(t => neu({ id: "thermo-c" + (t < 0 ? "m" + -t : t), ab: "c", bild: () => thermoBild(t, -10, 30, 2), frage: "Wie viel Grad zeigt das Thermometer?", ru: "Сколько градусов показывает термометр?",
    optionen: [`${t} °C`, `${t + 2} °C`, `${-t === t ? t + 4 : -t} °C`].filter((x, i, l) => l.indexOf(x) === i).concat(t === 0 ? ["4 °C"] : []), warum: t < 0 ? `Unter der 0 zählt man nach unten: minus ${-t} Grad.` : `Jeder kleine Strich sind 2 Grad: ${t} Grad.`, warumRu: t < 0 ? `Ниже нуля считают вниз: минус ${-t} градусов.` : `Каждый маленький штрих – 2 градуса: ${t} градусов.` }));
  [["osten", "Westen", "Osten"], ["norden", "Süden", "Norden"]].forEach(([nach, aus, falsch]) => neu({ id: "windsack-" + nach, ab: "c", bild: () => windsackBild(nach), frage: "Woher kommt der Wind?", ru: "Откуда дует ветер?",
    optionen: [`aus dem ${aus}`, `aus dem ${falsch}`, nach === "osten" ? "aus dem Norden" : "aus dem Westen"], warum: `Der Windsack zeigt dahin, wohin der Wind weht. Er kommt also aus dem ${aus}.`, warumRu: "Конус показывает, куда дует ветер. Значит, ветер дует с противоположной стороны." }));
  [6, 14].forEach(mm => neu({ id: "regen-" + mm, ab: "c", bild: () => regenBild(mm), frage: "Wie viel Regen ist gefallen?", ru: "Сколько выпало дождя?", optionen: [`${mm} mm`, `${mm + 4} mm`, `${mm - 2} mm`], warum: `Jeder kleine Strich sind 2 mm. Das Wasser steht bei ${mm} mm.`, warumRu: `Каждый маленький штрих – 2 мм. Вода стоит на ${mm} мм.` }));
  neu({ id: "frost", ab: "c", bild: () => thermoBild(-2, -10, 30, 2), frage: "Unter 0 Grad wird Wasser zu …", ru: "Ниже 0 градусов вода превращается в …", optionen: ["Eis", "Dampf", "Saft"], warum: "Bei Frost gefriert Wasser zu Eis – Pfützen werden glatt.", warumRu: "В мороз вода замерзает в лёд – лужи становятся скользкими." });
  const fuerStufe = (st) => FRAGEN.filter(f => STUFEN.indexOf(f.ab) <= STUFEN.indexOf(st));

  // ---------- Echtes Wetter (aus dem Cache der Insel, nur mit Ort) ----------
  function echtesWetter() {
    try { const w = JSON.parse(localStorage.getItem("lerninsel.wetter")), O = S.kind().ort; return w && O && w.lat === O.lat && w.lon === O.lon && Date.now() - w.zeit < 6 * 3600000 ? w : null; } catch (e) { return null; }
  }
  const windStufe = (kmh) => (kmh < 6 ? 0 : kmh < 20 ? 1 : kmh < 39 ? 2 : 3);
  const artAus = (a) => ({ klar: "sonne", heiter: "sonne", wolken: "wolken", nebel: "nebel", regen: "regen", schnee: "schnee", gewitter: "gewitter" })[a] || "wolken";

  // ---------- 1) Wettertagebuch ----------
  function tagebuch() {
    stoppeFlug();
    const d = daten(), heute = S.heute(), eintrag = d.tagebuch[heute] || {}, w = echtesWetter();
    lauf = { phase: "tagebuch", art: eintrag.art || null, wind: eintrag.wind != null ? eintrag.wind : null };
    ella(`Hallo ${S.profil.name || "du"}! Schau aus dem Fenster: Wie ist das Wetter heute bei dir?`, "Посмотри в окно: какая сегодня погода у тебя?");
    const woche = [];
    for (let i = 6; i >= 0; i--) { const t = new Date(window.__jetzt || Date.now()); t.setDate(t.getDate() - i); const k = S.heuteVon ? S.heuteVon(t) : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
      const e = d.tagebuch[k]; woche.push(`<div class="tag${k === heute ? " heute" : ""}"><b>${["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"][t.getDay()]}</b><span>${e ? ARTEN[e.art][0] : "·"}</span></div>`); }
    $("bereich").innerHTML = `<section class="karte" id="tagebuch">
      <h2>📔 Mein Wettertagebuch</h2>
      ${w ? `<p class="mess" id="messung">🌡️ Die Wetterstation misst in ${esc(w.ort)}: <b>${Math.round(w.temp)} °C</b>, Wind <b>${Math.round(w.wind || 0)} km/h</b> (${WIND[windStufe(w.wind || 0)][0]}).</p>` : ""}
      <p class="frage">Wie ist der Himmel?</p>
      <div class="arten" id="arten">${Object.entries(ARTEN).map(([k, [e, n]]) => `<button class="wahl-knopf${lauf.art === k ? " an" : ""}" data-art="${k}"><span class="gross">${e}</span>${n}</button>`).join("")}</div>
      <p class="frage">Wie weht der Wind?</p>
      <div class="winde" id="winde">${WIND.map(([n], i) => `<button class="wahl-knopf${lauf.wind === i ? " an" : ""}" data-wind="${i}"><span class="mini">${windBild(i)}</span>${n}</button>`).join("")}</div>
      <p class="hinweis" id="t-hinweis" aria-live="polite"></p>
      <div class="woche" aria-label="Die letzten sieben Tage">${woche.join("")}</div>
      <div class="knoepfe"><button class="knopf haupt" id="eintragen" ${lauf.art && lauf.wind != null ? "" : "disabled"}>✍️ Eintragen</button><button class="knopf" id="zum-drachen">🪁 Zum Drachen</button></div>
    </section>`;
    $("arten").addEventListener("click", (e) => { const b = e.target.closest("[data-art]"); if (!b) return; S.ton("tipp"); lauf.art = b.dataset.art; $("arten").querySelectorAll("button").forEach(x => x.classList.toggle("an", x === b)); bereit(); });
    $("winde").addEventListener("click", (e) => { const b = e.target.closest("[data-wind]"); if (!b) return; S.ton("tipp"); lauf.wind = +b.dataset.wind; $("winde").querySelectorAll("button").forEach(x => x.classList.toggle("an", x === b)); bereit(); });
    $("eintragen").addEventListener("click", eintragen);
    $("zum-drachen").addEventListener("click", () => { S.ton("tipp"); starteFragen(); });
  }
  function bereit() { $("eintragen").disabled = !(lauf.art && lauf.wind != null); }
  function eintragen() {
    const d = daten(), heute = S.heute(), erstHeute = !d.tagebuch[heute], neueArt = !d.arten[lauf.art];
    d.tagebuch[heute] = { art: lauf.art, wind: lauf.wind };
    const tage = Object.keys(d.tagebuch).sort(); if (tage.length > 60) tage.slice(0, tage.length - 60).forEach(k => delete d.tagebuch[k]);   // Spielstand klein halten
    let stern = false;
    if (neueArt) { d.arten[lauf.art] = 1; S.gibSterne(1); stern = true; }
    speichere(d);
    if (erstHeute) {
      if (window.Charakter) Charakter.gib("sachkunde", 1);
      if (window.Lernfunde) Lernfunde.merke({ fach: "sachkunde", art: "wetter", e: ARTEN[lauf.art][0], text: `Wetter beobachtet: ${ARTEN[lauf.art][1]}, ${WIND[lauf.wind][0]}`, schluessel: "wetter:" + heute });
    }
    const w = echtesWetter(), vergleich = w ? (windStufe(w.wind || 0) === lauf.wind ? " Die Station misst das auch so!" : ` Die Station misst ${Math.round(w.wind || 0)} km/h – das ist ${WIND[windStufe(w.wind || 0)][0]}. Wind fühlt sich überall ein bisschen anders an.`) : "";
    S.ton("juhu"); $("sterne").textContent = S.sterne();
    $("t-hinweis").className = "hinweis gut";
    $("t-hinweis").innerHTML = esc(`Eingetragen: ${ARTEN[lauf.art][0]} ${ARTEN[lauf.art][1]}, ${WIND[lauf.wind][0]}.${vergleich}${stern ? " Diese Wetterart ist neu in deinem Tagebuch: ⭐" : ""}`) + ru(`Записано: ${ARTEN[lauf.art][2]}, ${WIND[lauf.wind][2]}.${stern ? " Новый вид погоды в дневнике: ⭐" : ""}`);
    setTimeout(() => { if (lauf && lauf.phase === "tagebuch") tagebuch(); }, window.__testSchnell ? 400 : 2200);
  }

  // ---------- 2) Wetter-Fragen ----------
  // Runde: zuerst noch nicht geschaffte Fragen; Arten abwechselnd (Wind, Anziehen, Thermometer …), damit nicht viermal dasselbe kommt
  function mischeArten(l) {
    const gruppen = {}; l.forEach(f => { const a = f.id.split("-")[0]; (gruppen[a] = gruppen[a] || []).push(f); });
    const g = Object.values(gruppen), aus = [];
    for (let i = 0; aus.length < l.length; i++) g.forEach(x => { if (x[i]) aus.push(x[i]); });
    return aus;
  }
  function waehle() {
    const d = daten(), l = fuerStufe(stufe());
    return mischeArten(l.filter(f => !d.geschafft[f.id])).concat(mischeArten(l.filter(f => d.geschafft[f.id]))).slice(0, RUNDE);
  }
  function starteFragen() {
    stoppeFlug();
    lauf = { phase: "fragen", liste: waehle(), pos: 0, versuche: 0, ersteRichtig: 0, sterne: 0, flugWind: null };
    ella("Bevor der Drache fliegt, schauen wir genau aufs Wetter.", "Прежде чем запустить змея, посмотрим внимательно на погоду.");
    zeigeFrage();
  }
  // Optionen in fester, aber wechselnder Reihenfolge (kein Zufall nötig)
  const ordne = (opt, pos) => { const n = pos % opt.length; return opt.slice(n).concat(opt.slice(0, n)); };
  function zeigeFrage() {
    const f = lauf.liste[lauf.pos]; lauf.versuche = 0;
    $("bereich").innerHTML = `<section class="karte" id="fragekarte">
      <p class="stand">Frage ${lauf.pos + 1} von ${lauf.liste.length}</p>
      <div class="bild-rahmen">${f.bild()}</div>
      <p class="frage" id="frage">${esc(f.frage)}${ru(f.ru)} <button class="vorlesen klein" id="frage-hoer" aria-label="Frage vorlesen">🔊</button></p>
      <div class="optionen" id="optionen">${ordne(f.optionen, lauf.pos).map(o => `<button class="wahl-knopf" data-o="${esc(o)}">${esc(o)}</button>`).join("")}</div>
      <p class="hinweis" id="hinweis" aria-live="polite"></p></section>`;
    $("frage-hoer").addEventListener("click", () => { if (SP) SP.sprich(f.frage + " " + f.optionen.join(", ")); });
    $("optionen").addEventListener("click", (e) => { const b = e.target.closest("[data-o]"); if (b && !b.disabled) antworte(b); });
  }
  function antworte(b) {
    const f = lauf.liste[lauf.pos], ok = b.dataset.o === f.optionen[0], d = daten();
    if (window.Erprobung) Erprobung.aufgabe({ inhalt: "wetterdrache:" + f.id, text: f.frage, antwort: b.dataset.o, richtig: ok, versuch: lauf.versuche + 1 });   // Erprobungsmodus (Paket K)
    if (ok) {
      S.ton("juhu"); b.classList.add("richtig");
      $("optionen").querySelectorAll("button").forEach(x => { x.disabled = true; });
      let stern = false;
      if (lauf.versuche === 0) {
        lauf.ersteRichtig++;
        if (window.Koennen) Koennen.melde(LZ, true);
        if (window.Charakter) Charakter.gib("sachkunde", 1);
        const heute = S.heute();
        if (!d.geschafft[f.id] && (d.neu[heute] || 0) < STERNE_TAG) { d.neu = { [heute]: (d.neu[heute] || 0) + 1 }; S.gibSterne(1); lauf.sterne++; stern = true;
          if (window.Lernfunde) Lernfunde.merke({ fach: "sachkunde", art: "wetter", e: "🪁", text: f.frage.replace(/\?$/, "") + ": " + f.optionen[0], schluessel: "wetterdrache:" + f.id }); }
        d.geschafft[f.id] = (d.geschafft[f.id] || 0) + 1;
      }
      speichere(d);
      if (f.wind === 1 || f.wind === 2) lauf.flugWind = f.wind;
      $("sterne").textContent = S.sterne();
      $("hinweis").className = "hinweis gut"; $("hinweis").innerHTML = esc(`Richtig! ${f.warum}${stern ? " ⭐" : ""}`) + ru(f.warumRu);
      return setTimeout(weiter, window.__testSchnell ? 80 : 2200);
    }
    S.ton("nein"); lauf.versuche++; b.classList.add("falsch"); b.disabled = true;
    if (lauf.versuche === 1) { if (window.Koennen) Koennen.melde(LZ, false);
      $("hinweis").className = "hinweis nein"; $("hinweis").innerHTML = esc("Fast! Schau dir das Bild noch einmal genau an.") + ru("Почти! Посмотри ещё раз внимательно на картинку."); return; }
    $("optionen").querySelectorAll("button").forEach(x => { x.disabled = true; if (x.dataset.o === f.optionen[0]) x.classList.add("richtig"); });
    $("hinweis").className = "hinweis"; $("hinweis").innerHTML = esc(`Es ist: ${f.optionen[0]}. ${f.warum}`) + ru(f.warumRu);
    setTimeout(weiter, window.__testSchnell ? 80 : 3000);
  }
  function weiter() {
    if (!lauf || lauf.phase !== "fragen") return;
    lauf.pos++;
    if (lauf.pos < lauf.liste.length) return zeigeFrage();
    starteFlug();
  }

  // ---------- 3) Drachenflug ----------
  // Höhe 0–100 fällt ständig, „Leine ziehen“ hebt den Drachen; Böen sind eine feste Welle (kein Zufall). Ziel: 8 s im grünen Band.
  function starteFlug() {
    stoppeFlug();
    const w = echtesWetter(), echt = w ? windStufe(w.wind || 0) : null;
    const wind = lauf.flugWind || (echt === 1 || echt === 2 ? echt : 1);
    const ziel = window.__testSchnell ? 1.5 : 8;
    flug = { wind, h: 45, v: 0, imBand: 0, ziel, landungen: 0, band: [55, 85], fertig: false, t0: performance.now(), letzt: performance.now(), raf: 0 };
    lauf.phase = "flug";
    ella(echt === 0 ? "Bei dir zu Hause ist es gerade windstill – aber auf der Insel weht ein guter Wind. Zieh an der Leine!" : echt === 3 ? "Bei dir zu Hause stürmt es – da bleiben wir drin! Auf der Insel ist der Wind zum Glück sanft. Zieh an der Leine!" : "Jetzt du! Tipp auf „Leine ziehen“, damit der Drache im grünen Band bleibt.",
      "Нажимай «Тянуть нитку», чтобы змей оставался в зелёной полосе.");
    $("bereich").innerHTML = `<section class="karte" id="flugkarte">
      <p class="stand">${lauf.ersteRichtig} von ${lauf.liste.length} Fragen gleich richtig · Wind: ${WIND[wind][0]}</p>
      <div class="himmelfeld" id="himmelfeld"><div class="band" id="band"></div><div class="drache" id="drache">🪁</div><div class="faden" id="faden"></div></div>
      <div class="fortschritt"><span id="fortschritt-balken"></span></div>
      <p class="hinweis" id="hinweis" aria-live="polite"></p>
      <button class="ziehen" id="ziehen">🧵 <b>Leine ziehen</b></button></section>`;
    $("ziehen").addEventListener("pointerdown", (e) => { e.preventDefault(); ziehe(); });
    $("ziehen").addEventListener("keydown", (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); ziehe(); } });
    male(); flug.raf = requestAnimationFrame(schritt);
  }
  function ziehe() { if (!flug || flug.fertig) return; flug.v = Math.min(flug.v + 34, 60); $("ziehen").classList.remove("zug"); void $("ziehen").offsetWidth; $("ziehen").classList.add("zug"); }
  function schritt(jetzt) {
    if (!flug || flug.fertig) return;
    const dt = Math.min(0.1, (jetzt - flug.letzt) / 1000); flug.letzt = jetzt;
    const t = (jetzt - flug.t0) / 1000, boe = Math.sin(t * 1.3) * (flug.wind === 2 ? 14 : 7);
    flug.v -= (flug.wind === 2 ? 46 : 38) * dt; flug.v = Math.max(flug.v, -40);
    flug.h += (flug.v + boe) * dt;
    if (flug.h >= 100) { flug.h = 100; flug.v = Math.min(flug.v, 0); }
    if (flug.h <= 0) landung();
    else if (flug.h >= flug.band[0] && flug.h <= flug.band[1]) flug.imBand += dt;
    male();
    if (flug.imBand >= flug.ziel) return geflogen();
    flug.raf = requestAnimationFrame(schritt);
  }
  function landung() {
    flug.landungen++; flug.h = 40; flug.v = 10; S.ton("nein");
    if (flug.landungen === 2) { flug.band = [40, 90]; }   // Ella hilft: das Band wird breiter
    $("hinweis").className = "hinweis nein";
    $("hinweis").innerHTML = flug.landungen >= 2 ? esc("Hoppla, gelandet! Ella hilft dir: Das grüne Band ist jetzt breiter. Tipp öfter, wenn der Drache sinkt.") + ru("Упс! Элла помогает: зелёная полоса стала шире.")
      : esc("Hoppla, gelandet! Tipp schneller hintereinander, wenn der Drache sinkt.") + ru("Упс, приземлился! Нажимай чаще, когда змей опускается.");
  }
  function male() {
    if (!$("drache")) return;
    $("drache").style.bottom = `calc(${flug.h * 0.82}% + 4px)`;
    $("drache").style.transform = `rotate(${Math.sin((performance.now() - flug.t0) / 400) * 8}deg)`;
    $("band").style.bottom = `${flug.band[0] * 0.82}%`; $("band").style.height = `${(flug.band[1] - flug.band[0]) * 0.82}%`;
    $("faden").style.height = `calc(${flug.h * 0.82}% + 10px)`;
    $("fortschritt-balken").style.width = `${Math.min(100, flug.imBand / flug.ziel * 100)}%`;
    $("drache").classList.toggle("gut", flug.h >= flug.band[0] && flug.h <= flug.band[1]);
  }
  function geflogen() {
    flug.fertig = true; cancelAnimationFrame(flug.raf);
    const d = daten(), erster = !d.fluege[flug.wind];
    d.fluege[flug.wind] = (d.fluege[flug.wind] || 0) + 1;
    if (erster) S.gibSterne(1);
    speichere(d); S.ton("juhu"); $("sterne").textContent = S.sterne();
    if (window.Ereignisse && Ereignisse.melde) Ereignisse.melde("wetterdrache", { wind: flug.wind });
    lauf.phase = "ende";
    ella(`Er fliegt! Toll gemacht, ${S.profil.name || "du"}!`, "Он летит! Молодец!");
    $("bereich").innerHTML = `<section class="karte ende" id="ende"><h2>🪁 Der Drache ist geflogen!</h2>
      <p>${lauf.ersteRichtig} von ${lauf.liste.length} Wetter-Fragen gleich richtig.${lauf.sterne ? ` Neue Fragen: +${lauf.sterne} ⭐` : ""}${erster ? ` Erster Flug bei ${["Windstille", "leichtem Wind", "kräftigem Wind", "Sturm"][flug.wind]}: +1 ⭐` : ""}</p>
      <div class="knoepfe"><button class="knopf haupt" id="nochmal">🪁 Noch einmal</button><button class="knopf" id="zum-tagebuch">📔 Tagebuch</button><a class="knopf" href="../welt3d/heimat.html">🏝️ Zur Insel</a></div></section>`;
    $("nochmal").addEventListener("click", () => { S.ton("tipp"); starteFragen(); });
    $("zum-tagebuch").addEventListener("click", () => { S.ton("tipp"); tagebuch(); });
  }
  function stoppeFlug() { if (flug) { flug.fertig = true; cancelAnimationFrame(flug.raf); } }

  // ---------- Start ----------
  $("sterne").textContent = S.sterne();
  $("ella-vorlesen").addEventListener("click", () => { if (SP) SP.sprich(ellaText); });
  if (!offen()) {
    $("zu").hidden = false; $("bereich").hidden = true;
    ella("Mein Drache ist noch im Schrank – er kommt nach dem Sturm heraus!", "Мой змей ещё в шкафу – он появится после бури!");
  } else if (daten().tagebuch[S.heute()]) starteFragen(); else tagebuch();

  window.__wetter = { get lauf() { return lauf; }, get flug() { return flug; }, tagebuch, starteFragen, starteFlug, waehle, fuerStufe, stufe, stufeFuer, daten, FRAGEN, ARTEN, WIND, RUNDE, STERNE_TAG, windStufe, echtesWetter };
})();
