// Bennos Brücke (07.11.2026, Kapitel 9 „Bennos Brücke“): Bauplatz am Ufer. Das Kind misst und rechnet mit Benno – Länge, Maß, Bauplan –
// und baut die Brücke zur Sandbank Stück für Stück. Eine Runde = 4 Bauschritte (Pfeiler, Balken, Bretter, Geländer) = ein Brückenstück;
// nach jedem richtigen Schritt wächst das Stück im Bauplan sichtbar weiter. Die Brücke hat 8 Stücke; jedes Stück bleibt stehen.
// Stufen (wie im Lehrplan Sachsen, Größen und Messen):
//   a (Vorschule, Kl. 1): Bretter nach Länge ordnen, länger/kürzer, mit Pfoten-Schritten messen (ma.gm.01)
//   b (Kl. 2): cm und m, Bretter zusammensetzen bis zur Spannweite, kleine Sachaufgaben (ma.gm.05)
//   c (Kl. 3): m/cm und km/m umrechnen, gleich lange Felder (Teilen), Pfeiler im gleichen Abstand setzen (ma.gm.05, ma.zo.08)
//   d (Kl. 4, Übergang 5): Maßstab auf dem Bauplan (auch selbst zeichnen), km/m, Tragkraft in kg und t (ma.gm.09, ma.rf.09)
// Fehler: erst ein freundlicher Hinweis, beim zweiten Fehler zeigt Benno die Lösung (Lösungshilfe) – nichts geht verloren, kein Zeitdruck.
// Werte kommen aus einem festen Zufall (Saat = Runde, Stück, Stufe): jede Runde ist anders, aber vorhersehbar.
// Sterne nur für neue Brückenstücke: je neues Stück 1 ⭐, höchstens 3 am Tag; danach steht das Stück trotzdem. Fertige Brücke: weiter üben ohne Sterne.
// Daten bruecke = { abschnitte: 0–8, neu: { "JJJJ-MM-TT": n }, runden: n, fehlerfrei: n }. Test-Haken: window.__bruecke.
(function () {
  const S = window.Spielwelt, SP = window.Sprache;
  const $ = (id) => document.getElementById(id);
  const esc = S.esc;
  const ru = (t) => (S.hilfe() && t ? `<span class="ru">${esc(t)}</span>` : "");
  const D = "#3B1F63", ABSCHNITTE = 8, STERNE_TAG = 3, SCHRITTE = 4;
  const TEILE = [["Pfeiler", "сваи"], ["Balken", "балки"], ["Bretter", "доски"], ["Geländer", "перила"]];
  const LZ = { a: ["ma.gm.01"], b: ["ma.gm.05"], c: ["ma.gm.05", "ma.zo.08"], d: ["ma.gm.09", "ma.rf.09"] };
  const stufeFuer = (code) => (["vs", "1"].includes(code) ? "a" : code === "2" ? "b" : code === "3" ? "c" : "d");
  const stufe = () => window.__brueckeStufe || stufeFuer(((S.stufe && S.stufe()) || {}).code || "2");
  const offen = () => S.offen(!!(window.Story && Story.kapitel() >= 9));
  const daten = () => Object.assign({ abschnitte: 0, neu: {}, runden: 0, fehlerfrei: 0 }, S.lade("bruecke") || {});
  const speichere = (d) => S.speichere("bruecke", d);
  const name = () => S.profil.name || "du";
  let bennoText = "", lauf = null, auf = null;

  function benno(de, r) { bennoText = de; $("benno-text").innerHTML = esc(de) + ru(r); }
  // fester Zufall (mulberry32) – nie Math.random
  function zufall(saat) { let a = (saat >>> 0) || 1; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const wahl = (z, l) => l[Math.floor(z() * l.length)];
  const mische = (z, l) => { const a = l.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(z() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const zahlText = (n) => String(n);

  // ======================================================================================================
  // Aufgaben je Stufe. Jede Aufgabe: { art, frage, ru, hilfe, hilfeRu, loesungText, … } und je nach Art:
  //   art "zahl":   antwort (Zahl), einheit; Eingabe über die Zahlentasten
  //   art "wahl":   optionen [{ t, r }], richtig (Index)
  //   art "ordnen": bretter [Längen], Reihenfolge kurz → lang
  //   art "legen":  spann (cm), stuecke [cm]; Bretter in die Lücke legen, bis es genau passt
  //   art "pfeiler": laenge (m), abstand (m); Pfeiler an den richtigen Metern setzen
  //   art "plan":   zellen (Kästchen auf dem Plan), antwort (Zahl der Kästchen); Brücke auf dem Plan zeichnen
  // ======================================================================================================
  const BAU = {
    vergleich(z) {
      const a = 3 + Math.floor(z() * 4), b = a + 2 + Math.floor(z() * 3), laenger = z() < 0.5, l = mische(z, [a, b]);
      return { art: "wahl", bild: "zwei", bretter: l, richtig: l.indexOf(laenger ? b : a), optionen: l.map((x, i) => ({ t: i ? "Brett rechts" : "Brett links", r: "" })),
        frage: laenger ? "Tipp das längere Brett!" : "Tipp das kürzere Brett!", ru: laenger ? "Нажми на более длинную доску!" : "Нажми на более короткую доску!",
        hilfe: "Leg die Bretter in Gedanken nebeneinander. Welches steht weiter heraus?", hilfeRu: "Представь доски рядом. Какая длиннее?",
        loesungText: laenger ? "Das längere Brett blinkt. Tipp es an!" : "Das kürzere Brett blinkt. Tipp es an!" };
    },
    ordnen(z, n = 3) {
      const pool = mische(z, [2, 3, 4, 5, 6, 7, 8, 9]).slice(0, n);
      return { art: "ordnen", bretter: pool, frage: "Leg die Bretter der Reihe nach: zuerst das kürzeste!", ru: "Положи доски по порядку: сначала самую короткую!",
        hilfe: "Schau genau: Welches Brett ist das kürzeste von allen, die noch liegen?", hilfeRu: "Посмотри внимательно: какая доска самая короткая из оставшихся?",
        loesungText: "Das nächste Brett blinkt. Tipp es an!" };
    },
    schritte(z) {
      const n = 2 + Math.floor(z() * 5);
      return { art: "zahl", bild: "pfoten", pfoten: n, antwort: n, einheit: "Pfoten", max: 1,
        frage: "Benno misst mit seinen Pfoten. Wie viele Pfoten lang ist das Brett?", ru: "Бенно измеряет лапами. Сколько лап длина доски?",
        hilfe: "Zeig mit dem Finger auf jede Pfote und zähl laut mit.", hilfeRu: "Покажи пальцем на каждую лапу и считай вслух.",
        loesungText: `Es sind ${n} Pfoten.` };
    },
    einheit(z) {
      if (z() < 0.4) return { art: "wahl", optionen: mische(z, [100, 10, 1000]).map(x => ({ t: `${x} cm`, r: `${x} см`, ok: x === 100 })), frage: "Wie viele Zentimeter hat 1 Meter?", ru: "Сколько сантиметров в 1 метре?",
        hilfe: "Ein Meter ist so lang wie ein großer Schritt. Ein Zentimeter ist so breit wie dein kleiner Finger.", hilfeRu: "Метр – как большой шаг. Сантиметр – как ширина мизинца.",
        loesungText: "1 m = 100 cm." };
      const cm = wahl(z, [50, 80, 90, 120, 150]), richtigT = cm > 100 ? `${cm} cm` : "1 m";
      return { art: "wahl", optionen: mische(z, ["1 m", `${cm} cm`]).map(t => ({ t, r: t.replace("cm", "см").replace("m", "м"), ok: t === richtigT })),
        frage: `Was ist länger: 1 m oder ${cm} cm?`, ru: `Что длиннее: 1 м или ${cm} см?`,
        hilfe: "Denk daran: 1 m sind 100 cm. Vergleiche dann die Zentimeter.", hilfeRu: "Помни: 1 м = 100 см. Потом сравни сантиметры.",
        loesungText: `1 m = 100 cm. Also ist ${richtigT} länger.` };
    },
    legen(z) {
      const spann = wahl(z, [60, 70, 80, 90, 100]);
      return { art: "legen", spann, stuecke: [10, 20, 30, 50], frage: `Die Lücke ist ${spann} cm breit. Leg Bretter hinein, bis sie genau passt!`, ru: `Промежуток ${spann} см. Положи доски так, чтобы они точно подошли!`,
        hilfe: "Zu lang! Das Brett ragt über. Schau, wie viele Zentimeter noch fehlen.", hilfeRu: "Слишком длинно! Посмотри, сколько сантиметров ещё не хватает.",
        loesungText: "Das passende Brett blinkt." };
    },
    rest(z) {
      if (z() < 0.5) { const ab = wahl(z, [20, 30, 40, 60]); return { art: "zahl", antwort: 100 - ab, einheit: "cm", max: 3, frage: `Ein Brett ist 1 m lang. Benno sägt ${ab} cm ab. Wie viele Zentimeter bleiben übrig?`, ru: `Доска длиной 1 м. Бенно отпиливает ${ab} см. Сколько сантиметров остаётся?`,
        hilfe: "1 m sind 100 cm. Rechne 100 minus das abgesägte Stück.", hilfeRu: "1 м = 100 см. Вычти отпиленный кусок из 100.", loesungText: `100 cm − ${ab} cm = ${100 - ab} cm` }; }
      const je = wahl(z, [20, 30, 40, 45]), n = je === 45 ? 2 : wahl(z, [2, 3]);
      return { art: "zahl", antwort: je * n, einheit: "cm", max: 3, frage: `Benno legt ${n} Bretter hintereinander, jedes ${je} cm lang. Wie lang sind sie zusammen?`, ru: `Бенно кладёт ${n} доски друг за другом, каждая ${je} см. Какой они длины вместе?`,
        hilfe: "Zähl die Längen zusammen – Brett für Brett.", hilfeRu: "Сложи длины – доску за доской.", loesungText: `${Array(n).fill(je + " cm").join(" + ")} = ${je * n} cm` };
    },
    umrechnen(z, form = 0) {
      if (form === 0) { const m = 2 + Math.floor(z() * 7), cm = wahl(z, [5, 20, 40, 50, 75, 90]); return { art: "zahl", antwort: m * 100 + cm, einheit: "cm", max: 4, frage: `Benno braucht ein Seil: ${m} m ${cm} cm. Wie viele Zentimeter sind das?`, ru: `Бенно нужна верёвка: ${m} м ${cm} см. Сколько это сантиметров?`,
        hilfe: `1 m sind 100 cm. Also sind ${m} m schon ${m * 100} cm. Dann kommen noch ${cm} cm dazu.`, hilfeRu: `1 м = 100 см. Значит, ${m} м – это ${m * 100} см. Добавь ещё ${cm} см.`, loesungText: `${m} m ${cm} cm = ${m * 100} cm + ${cm} cm = ${m * 100 + cm} cm` }; }
      const km = 1 + Math.floor(z() * 3), m = wahl(z, [100, 200, 250, 500, 800]);
      return { art: "zahl", antwort: km * 1000 + m, einheit: "m", max: 4, frage: `Vom Steg bis zur Brücke sind es ${km} km ${m} m. Wie viele Meter sind das?`, ru: `От причала до моста ${km} км ${m} м. Сколько это метров?`,
        hilfe: `1 km sind 1000 m. Also sind ${km} km schon ${km * 1000} m. Dann kommen noch ${m} m dazu.`, hilfeRu: `1 км = 1000 м. Значит, ${km} км – это ${km * 1000} м. Добавь ещё ${m} м.`, loesungText: `${km} km ${m} m = ${km * 1000 + m} m` };
    },
    teilen(z) {
      const f = wahl(z, [3, 4, 5, 6]), k = wahl(z, [2, 3, 4, 5, 6, 8]), L = f * k;
      return { art: "zahl", bild: "felder", felder: f, laenge: L, antwort: k, einheit: "m", max: 2, frage: `Die Brücke ist ${L} m lang. Sie bekommt ${f} gleich lange Felder. Wie lang ist ein Feld?`, ru: `Мост длиной ${L} м. У него ${f} одинаковых пролётов. Какой длины один пролёт?`,
        hilfe: `Teile die ganze Länge gerecht in ${f} Teile: ${L} : ${f}.`, hilfeRu: `Раздели всю длину поровну на ${f} части: ${L} : ${f}.`, loesungText: `${L} m : ${f} = ${k} m` };
    },
    pfeiler(z) {
      const k = wahl(z, [2, 3, 4]), f = k === 2 ? wahl(z, [4, 5, 6]) : wahl(z, [3, 4]), L = k * f;
      return { art: "pfeiler", laenge: L, abstand: k, frage: `Die Brücke ist ${L} m lang. Setz alle ${k} m einen Pfeiler! Anfang und Ende stehen schon.`, ru: `Мост длиной ${L} м. Поставь сваю через каждые ${k} м! Начало и конец уже стоят.`,
        hilfe: `Fang beim Anfang an und geh immer ${k} m weiter: ${k}, ${2 * k}, …`, hilfeRu: `Начни с начала и каждый раз прибавляй ${k} м: ${k}, ${2 * k}, …`, loesungText: "Der nächste Platz für einen Pfeiler blinkt." };
    },
    massstab(z) {
      const je = wahl(z, [2, 3, 5, 10]), cm = wahl(z, [3, 4, 5, 6, 7]);
      return { art: "zahl", bild: "plan", zellen: cm, je, antwort: je * cm, einheit: "m", max: 2, frage: `Auf dem Bauplan ist 1 cm so lang wie ${je} m in echt. Die Brücke ist auf dem Plan ${cm} cm lang. Wie lang ist sie in echt?`,
        ru: `На плане 1 см – это ${je} м в действительности. На плане мост длиной ${cm} см. Какой он длины на самом деле?`,
        hilfe: `Jedes Kästchen auf dem Plan sind ${je} m. Zähl die Kästchen und rechne ${cm} mal ${je}.`, hilfeRu: `Каждая клетка на плане – ${je} м. Посчитай клетки и умножь ${cm} на ${je}.`, loesungText: `${cm} · ${je} m = ${cm * je} m` };
    },
    plan(z) {
      const je = wahl(z, [2, 3, 5]), cm = 2 + Math.floor(z() * 6);
      return { art: "plan", zellen: 8, je, antwort: cm, frage: `In echt ist die Brücke ${cm * je} m lang. Auf dem Plan ist 1 cm so lang wie ${je} m. Zeichne sie auf dem Plan: Tipp das letzte Kästchen an!`,
        ru: `На самом деле мост длиной ${cm * je} м. На плане 1 см – это ${je} м. Нарисуй его на плане: нажми на последнюю клетку!`,
        hilfe: `Rechne: ${cm * je} m : ${je} m. So viele Kästchen braucht die Brücke.`, hilfeRu: `Посчитай: ${cm * je} м : ${je} м. Столько клеток нужно мосту.`, loesungText: `${cm * je} m : ${je} m = ${cm} Kästchen` };
    },
    tragkraft(z) {
      if (z() < 0.35) return { art: "zahl", antwort: 1000, einheit: "kg", max: 4, frage: "Auf dem Schild steht: Die Brücke trägt 1 t. Wie viele Kilogramm sind 1 t?", ru: "На табличке написано: мост выдерживает 1 т. Сколько килограммов в 1 т?",
        hilfe: "Eine Tonne ist so schwer wie ein kleines Auto. Sie hat tausend Kilogramm.", hilfeRu: "Тонна весит как маленькая машина. В ней тысяча килограммов.", loesungText: "1 t = 1000 kg" };
      const wagen = wahl(z, [300, 400, 500]), last = wahl(z, [400, 500, 600, 700]), sum = wagen + last, ok = sum <= 1000;
      const opt = ok ? [{ t: `Ja – ${sum} kg sind nicht mehr als 1 t`, r: "Да", ok: true }, { t: "Nein – das ist zu schwer", r: "Нет" }]
        : [{ t: `Nein – ${sum} kg sind mehr als 1 t`, r: "Нет", ok: true }, { t: "Ja – das passt", r: "Да" }];
      return { art: "wahl", optionen: mische(z, opt), frage: `Die Brücke trägt 1 t. Ein Wagen wiegt ${wagen} kg und hat ${last} kg Holz geladen. Darf er hinüber?`,
        ru: `Мост выдерживает 1 т. Тележка весит ${wagen} кг и везёт ${last} кг дерева. Можно ей проехать?`,
        hilfe: "Zähl Wagen und Holz zusammen. 1 t sind 1000 kg.", hilfeRu: "Сложи тележку и дерево. 1 т = 1000 кг.", loesungText: `${wagen} kg + ${last} kg = ${sum} kg` };
    }
  };
  const PLAN = { a: [(z) => BAU.vergleich(z), (z) => BAU.ordnen(z, 3), (z) => BAU.schritte(z), (z) => BAU.ordnen(z, 4)],
    b: [(z) => BAU.einheit(z), (z) => BAU.legen(z), (z) => BAU.rest(z), (z) => BAU.legen(z)],
    c: [(z) => BAU.umrechnen(z, 0), (z) => BAU.teilen(z), (z) => BAU.pfeiler(z), (z) => BAU.umrechnen(z, 1)],
    d: [(z) => BAU.massstab(z), (z) => BAU.umrechnen(z, 1), (z) => BAU.plan(z), (z) => BAU.tragkraft(z)] };
  function aufgabenFuer(st, saat) {
    const z = zufall(saat);
    return PLAN[st].map(f => { const a = f(z); if (a.art === "wahl" && a.richtig == null) a.richtig = a.optionen.findIndex(o => o.ok); return a; });
  }

  // ======================================================================================================
  // Bauplan der Brücke (SVG): Ufer links, Sandbank rechts, 8 Stücke; das aktuelle Stück zeigt die schon gebauten Teile
  // ======================================================================================================
  function planSvg(fertig, teile) {
    const x0 = 70, x1 = 730, w = (x1 - x0) / ABSCHNITTE, y = 92;
    let h = `<svg viewBox="0 0 800 170" class="bauplan" role="img" aria-label="Brücke: ${fertig} von ${ABSCHNITTE} Stücken gebaut">
      <rect x="0" y="0" width="800" height="170" rx="22" fill="#BFE6F7"/>
      <path d="M0 112 Q 200 104 400 112 T 800 112 L800 170 L0 170 Z" fill="#6EC3E8"/>
      <path d="M0 50 L60 50 Q 82 56 84 112 L0 112 Z" fill="#7CCB5B" stroke="${D}" stroke-width="4"/>
      <path d="M716 112 Q 724 78 770 76 Q 800 76 800 80 L800 112 Z" fill="#F2D9A2" stroke="${D}" stroke-width="4"/>
      <line x1="770" y1="76" x2="770" y2="38" stroke="${D}" stroke-width="4"/><path d="M770 38 L796 46 L770 54 Z" fill="#FF6F61" stroke="${D}" stroke-width="3"/>`;
    const stueck = (i, n) => {   // n = 1…4 Teile
      const a = x0 + i * w, b = a + w;
      let s = "";
      if (n >= 1) s += `<rect x="${b - 14}" y="${y}" width="10" height="60" fill="#7A5230" stroke="${D}" stroke-width="3"/>` + (i === 0 ? `<rect x="${a + 4}" y="${y}" width="10" height="60" fill="#7A5230" stroke="${D}" stroke-width="3"/>` : "");
      if (n >= 2) s += `<rect x="${a}" y="${y - 2}" width="${w}" height="9" fill="#9A6A3F" stroke="${D}" stroke-width="3"/>`;
      if (n >= 3) s += `<rect x="${a + 1}" y="${y - 13}" width="${w - 2}" height="11" rx="2" fill="${i % 2 ? "#C8955B" : "#D2A066"}" stroke="${D}" stroke-width="3"/>`;
      if (n >= 4) s += `<line x1="${a}" y1="${y - 40}" x2="${b}" y2="${y - 40}" stroke="${D}" stroke-width="5"/><line x1="${b - 4}" y1="${y - 40}" x2="${b - 4}" y2="${y - 13}" stroke="${D}" stroke-width="4"/>` + (i === 0 ? `<line x1="${a + 3}" y1="${y - 40}" x2="${a + 3}" y2="${y - 13}" stroke="${D}" stroke-width="4"/>` : "");
      return `<g class="stueck${n >= 4 ? " fertig" : " im-bau"}" data-stueck="${i}" data-teile="${n}">${s}</g>`;
    };
    for (let i = 0; i < Math.min(fertig, ABSCHNITTE); i++) h += stueck(i, 4);
    if (teile != null && fertig < ABSCHNITTE) {
      const a = x0 + fertig * w; h += `<rect x="${a + 2}" y="${y - 44}" width="${w - 4}" height="106" rx="10" fill="none" stroke="#FF8A3D" stroke-width="4" stroke-dasharray="10 8"/>`;
      if (teile > 0) h += stueck(fertig, teile);
    }
    return h + "</svg>";
  }
  const zeigePlan = () => { $("plan").innerHTML = planSvg(daten().abschnitte, lauf && !lauf.ende ? lauf.pos : null); };

  // ======================================================================================================
  // Runde
  // ======================================================================================================
  function starteRunde() {
    const d = daten(), st = stufe();
    lauf = { st, liste: aufgabenFuer(st, (d.runden + 1) * 7919 + d.abschnitte * 31 + "abcd".indexOf(st)), pos: 0, fehler: 0, ende: false, sterne: 0, timer: null };
    if (d.abschnitte >= ABSCHNITTE) benno(`Die Brücke ist fertig, ${name()}! Wir messen trotzdem gern weiter – Benno prüft jedes Brett.`, "Мост готов! Мы всё равно можем измерять дальше – Бенно проверяет каждую доску.");
    else benno(`Stück ${d.abschnitte + 1} von ${ABSCHNITTE}: Wir brauchen Pfeiler, Balken, Bretter und ein Geländer. Hilfst du mir?`, `Часть ${d.abschnitte + 1} из ${ABSCHNITTE}: нам нужны сваи, балки, доски и перила. Поможешь?`);
    zeigeAufgabe();
  }
  function zeigeAufgabe() {
    const a = lauf.liste[lauf.pos], d = daten();
    auf = Object.assign(a, { versuche: 0, gelegt: [], wert: "", fertig: false, markiert: null, gezeichnet: 0 });
    zeigePlan();
    const teil = TEILE[lauf.pos];
    $("bereich").innerHTML = `<section class="karte" id="aufgabe">
      <p class="stand" id="stand">${d.abschnitte < ABSCHNITTE ? `Stück ${d.abschnitte + 1} von ${ABSCHNITTE}` : "Nachmessen"} · Schritt ${lauf.pos + 1} von ${SCHRITTE}: ${teil[0]}${ru(teil[1])}</p>
      <div class="frage-zeile"><p id="frage">${esc(a.frage)}${ru(a.ru)}</p><button class="vorlesen" id="frage-vorlesen" aria-label="Aufgabe vorlesen">🔊</button></div>
      <div id="werkstueck" class="werkstueck"></div>
      <div id="eingabe"></div>
      <p class="hinweis" id="hinweis" aria-live="polite"></p></section>`;
    $("frage-vorlesen").addEventListener("click", () => { if (SP) SP.sprich(a.frage); });
    male();
  }
  const brettSvg = (l, maxL, farbe = "#D2A066") => `<svg viewBox="0 0 ${maxL * 30 + 10} 40" width="${Math.round((l * 30 + 10) / (maxL * 30 + 10) * 100)}%" preserveAspectRatio="xMinYMid meet" aria-hidden="true"><rect x="4" y="6" width="${l * 30}" height="28" rx="6" fill="${farbe}" stroke="${D}" stroke-width="4"/><line x1="16" y1="20" x2="${l * 30 - 6}" y2="20" stroke="#B07A45" stroke-width="3" stroke-linecap="round"/></svg>`;
  const tasten = (einheit) => `<div class="eingabe"><div class="anzeige" id="anzeige">…${einheit ? " " + esc(einheit) : ""}</div><div class="tasten">${["7", "8", "9", "⌫", "4", "5", "6", "", "1", "2", "3", "", "0"].map(t => t ? `<button data-taste="${t}" aria-label="${t === "⌫" ? "Löschen" : t}">${t}</button>` : "<span></span>").join("")}<button class="ok" data-taste="ok" style="grid-column: span 3">✓ OK</button></div></div>`;
  function male() {
    const a = auf, wk = $("werkstueck"), ein = $("eingabe");
    if (a.art === "zahl") {
      if (a.bild === "pfoten") wk.innerHTML = `<div class="brett-mess"><div class="brett-lang">${brettSvg(a.pfoten * 1.2, 7.4)}</div><div class="pfoten" aria-label="Pfoten">${"🐾".repeat(a.pfoten)}</div></div>`;
      else if (a.bild === "felder") wk.innerHTML = `<div class="feldleiste" aria-hidden="true">${Array.from({ length: a.felder }, (_, i) => `<span class="feld${a.fertig ? " an" : ""}">${a.fertig ? `${a.antwort} m` : "?"}</span>`).join("")}</div><p class="klein">${a.laenge} m</p>`;
      else if (a.bild === "plan") wk.innerHTML = `<div class="planraster" aria-label="Bauplan">${Array.from({ length: 8 }, (_, i) => `<span class="zelle${i < a.zellen ? " voll" : ""}">${i === 0 ? "1 cm" : ""}</span>`).join("")}</div><p class="klein">1 cm ≙ ${a.je} m</p>`;
      else wk.innerHTML = "";
      if (!ein.firstChild) { ein.innerHTML = tasten(a.einheit); ein.querySelectorAll("[data-taste]").forEach(b => b.addEventListener("click", () => taste(b.dataset.taste))); }
      $("anzeige").textContent = (a.wert || "…") + (a.einheit ? " " + a.einheit : "");
    } else if (a.art === "wahl") {
      if (a.bild === "zwei") {
        wk.innerHTML = "";
        ein.innerHTML = `<div class="bretter-wahl">${a.bretter.map((l, i) => `<button class="brett-knopf${a.markiert === i ? " markiert" : ""}" data-wahl="${i}" aria-label="${a.optionen[i].t}">${brettSvg(l, 9)}</button>`).join("")}</div>`;
      } else {
        wk.innerHTML = "";
        ein.innerHTML = `<div class="wahl">${a.optionen.map((o, i) => `<button class="knopf wahl-knopf${a.markiert === i ? " markiert" : ""}" data-wahl="${i}">${esc(o.t)}${o.r && S.hilfe() ? `<small class="ru">${esc(o.r)}</small>` : ""}</button>`).join("")}</div>`;
      }
      ein.querySelectorAll("[data-wahl]").forEach(b => b.addEventListener("click", () => waehle(+b.dataset.wahl)));
    } else if (a.art === "ordnen") {
      const max = Math.max(...a.bretter);
      wk.innerHTML = `<div class="gelegt" id="gelegt" aria-label="Gelegte Bretter">${a.gelegt.map(i => `<div class="gelegt-brett">${brettSvg(a.bretter[i], max, "#C8955B")}</div>`).join("") || '<p class="klein">Hier liegen die Bretter.</p>'}</div>`;
      ein.innerHTML = `<div class="bretter-wahl">${a.bretter.map((l, i) => a.gelegt.includes(i) ? "" : `<button class="brett-knopf${a.markiert === i ? " markiert" : ""}" data-brett="${i}" aria-label="Brett ${i + 1}">${brettSvg(l, max)}</button>`).join("")}</div>`;
      ein.querySelectorAll("[data-brett]").forEach(b => b.addEventListener("click", () => ordne(+b.dataset.brett)));
    } else if (a.art === "legen") {
      const sum = a.gelegt.reduce((x, y) => x + y, 0), farben = { 10: "#FFD84D", 20: "#5CCBA6", 30: "#7B9BFF", 50: "#FF8A80" };
      wk.innerHTML = `<div class="luecke" aria-label="Lücke ${a.spann} cm, ${sum} cm belegt"><div class="luecke-innen">${a.gelegt.map(x => `<span class="stk" style="flex:0 0 ${x / a.spann * 100}%;background:${farben[x]}">${x}</span>`).join("")}</div>
        <div class="massband" aria-hidden="true">${Array.from({ length: a.spann / 10 + 1 }, (_, i) => `<i style="left:${i * 10 / a.spann * 100}%">${i % (a.spann > 80 ? 2 : 1) === 0 ? i * 10 : ""}</i>`).join("")}</div></div>
        <p class="stand" id="summe">${sum} cm von ${a.spann} cm</p>`;
      ein.innerHTML = `<div class="stuecke">${a.stuecke.map(x => `<button class="stk-knopf${a.markiert === x ? " markiert" : ""}" data-stk="${x}" style="background:${farben[x]};min-width:${50 + x * 2}px">${x} cm</button>`).join("")}<button class="knopf" id="weg" aria-label="Letztes Brett wegnehmen" ${a.gelegt.length ? "" : "disabled"}>↩</button></div>`;
      ein.querySelectorAll("[data-stk]").forEach(b => b.addEventListener("click", () => lege(+b.dataset.stk)));
      $("weg").addEventListener("click", () => { if (a.fertig || !a.gelegt.length) return; S.ton("tipp"); a.gelegt.pop(); male(); });
    } else if (a.art === "pfeiler") {
      const L = a.laenge, k = a.abstand;
      wk.innerHTML = `<svg viewBox="-20 0 840 120" class="pfeilerbild" aria-label="Brücke ${L} m">
        <rect x="0" y="40" width="800" height="14" rx="4" fill="#D2A066" stroke="${D}" stroke-width="4"/>
        ${[0, L].concat(a.gelegt).map(m => `<rect x="${m / L * 800 - 7}" y="54" width="14" height="50" fill="#7A5230" stroke="${D}" stroke-width="3"/>`).join("")}
        ${Array.from({ length: L + 1 }, (_, m) => `<line x1="${m / L * 800}" y1="30" x2="${m / L * 800}" y2="${m % k === 0 ? 18 : 24}" stroke="${D}" stroke-width="3"/>`).join("")}
        <text x="0" y="14" font-size="16" text-anchor="middle" fill="${D}">0 m</text><text x="800" y="14" font-size="16" text-anchor="middle" fill="${D}">${L} m</text></svg>`;
      ein.innerHTML = `<div class="meter">${Array.from({ length: L - 1 }, (_, i) => i + 1).map(m => `<button class="meter-knopf${a.gelegt.includes(m) ? " an" : ""}${a.markiert === m ? " markiert" : ""}" data-meter="${m}" ${a.gelegt.includes(m) ? "disabled" : ""}>${m} m</button>`).join("")}</div>`;
      ein.querySelectorAll("[data-meter]").forEach(b => b.addEventListener("click", () => pfeiler(+b.dataset.meter)));
    } else if (a.art === "plan") {
      wk.innerHTML = `<p class="klein">1 Kästchen = 1 cm ≙ ${a.je} m</p>`;
      ein.innerHTML = `<div class="planraster tippbar">${Array.from({ length: a.zellen }, (_, i) => `<button class="zelle${i < a.gezeichnet ? " voll" : ""}${a.markiert === i + 1 ? " markiert" : ""}" data-zelle="${i + 1}" aria-label="${i + 1} Kästchen">${i + 1}</button>`).join("")}</div>
        <div class="knoepfe"><button class="knopf haupt" id="plan-ok" ${a.gezeichnet ? "" : "disabled"}>✓ Fertig gezeichnet</button></div>`;
      ein.querySelectorAll("[data-zelle]").forEach(b => b.addEventListener("click", () => { if (a.fertig) return; S.ton("tipp"); a.gezeichnet = +b.dataset.zelle; male(); }));
      $("plan-ok").addEventListener("click", () => pruefe(a.gezeichnet === a.antwort, () => { a.markiert = a.antwort; male(); }));
    }
  }
  // ---------- Eingaben ----------
  function taste(t) {
    const a = auf; if (!a || a.fertig) return; S.ton("tipp");
    if (t === "⌫") a.wert = a.wert.slice(0, -1);
    else if (t === "ok") { if (!a.wert) return; return pruefe(+a.wert === a.antwort, () => { a.wert = ""; male(); }); }
    else if (a.wert.length < (a.max || 4)) a.wert += t;
    male();
  }
  function waehle(i) { const a = auf; if (!a || a.fertig) return; S.ton("tipp"); pruefe(i === a.richtig, () => { a.markiert = a.richtig; male(); }); }
  function ordne(i) {
    const a = auf; if (!a || a.fertig) return; S.ton("tipp");
    const naechstes = a.bretter.map((l, k) => [l, k]).filter(([, k]) => !a.gelegt.includes(k)).sort((x, y) => x[0] - y[0])[0][1];
    if (i !== naechstes) return fehler(() => { a.markiert = naechstes; male(); });
    a.gelegt.push(i); a.markiert = null; male();
    if (a.gelegt.length === a.bretter.length) richtig();
  }
  function lege(x) {
    const a = auf; if (!a || a.fertig) return; S.ton("tipp");
    const sum = a.gelegt.reduce((p, q) => p + q, 0) + x;
    if (sum > a.spann) {   // Brett ragt über: es fällt zurück, freundlicher Hinweis
      return fehler(() => { const rest = a.spann - sum + x; a.markiert = a.stuecke.filter(s => s <= rest).sort((p, q) => q - p)[0]; male(); });
    }
    a.gelegt.push(x); a.markiert = null; male();
    if (sum === a.spann) richtig();
  }
  function pfeiler(m) {
    const a = auf; if (!a || a.fertig) return; S.ton("tipp");
    const fehlt = Array.from({ length: a.laenge / a.abstand - 1 }, (_, i) => (i + 1) * a.abstand).filter(x => !a.gelegt.includes(x));
    if (m % a.abstand !== 0) return fehler(() => { a.markiert = fehlt[0]; male(); });
    a.gelegt.push(m); a.markiert = null; male();
    if (fehlt.length === 1) richtig();
  }
  // ---------- richtig / falsch ----------
  function pruefe(ok, hilfeZeigen) { if (ok) richtig(); else fehler(hilfeZeigen); }
  function fehler(hilfeZeigen) {
    const a = auf; a.versuche++; lauf.fehler++;
    if (a.versuche === 1 && window.Koennen) Koennen.melde(LZ[lauf.st], false);
    S.ton("nein");
    const h = $("hinweis"); h.className = "hinweis";
    if (a.versuche === 1) { h.innerHTML = esc("Fast! " + a.hilfe) + ru(a.hilfeRu); if (a.art === "zahl") { a.wert = ""; male(); } }
    else { h.innerHTML = esc("Benno zeigt es dir: " + a.loesungText) + ru("Бенно показывает: " + a.loesungText); if (hilfeZeigen) hilfeZeigen(); h.classList.add("loesung"); }
  }
  function richtig() {
    const a = auf; a.fertig = true;
    if (a.versuche === 0 && window.Koennen) Koennen.melde(LZ[lauf.st], true);
    S.ton("juhu");
    if (a.art === "zahl") male();
    const teil = TEILE[lauf.pos];
    $("hinweis").className = "hinweis gut"; $("hinweis").innerHTML = esc(`Genau! Die ${teil[0]} sind dran.`) + ru(`Точно! ${teil[1][0].toUpperCase() + teil[1].slice(1)} на месте.`);
    lauf.pos++; zeigePlan(); lauf.pos--;
    lauf.timer = setTimeout(weiter, window.__testSchnell ? 120 : 1600);
  }
  function weiter() {
    if (!lauf) return; lauf.timer = null; lauf.pos++;
    if (lauf.pos < lauf.liste.length) return zeigeAufgabe();
    ende();
  }
  function ende() {
    const d = daten(), heute = S.heute(), neu = d.abschnitte < ABSCHNITTE;
    let stern = false;
    d.runden = (d.runden || 0) + 1; if (!lauf.fehler) d.fehlerfrei = (d.fehlerfrei || 0) + 1;
    if (neu) {
      d.abschnitte++;
      if ((d.neu[heute] || 0) < STERNE_TAG) { d.neu = { [heute]: (d.neu[heute] || 0) + 1 }; S.gibSterne(1); stern = true; lauf.sterne = 1; }
      if (window.Lernfunde) Lernfunde.merke({ fach: "mathe", art: "bruecke", e: "🌉", text: `Brückenstück ${d.abschnitte} gebaut`, schluessel: "bruecke:" + d.abschnitte });
      if (window.Charakter) Charakter.gib("mathe", 1);
    }
    speichere(d); lauf.ende = true; auf = null;
    if (window.Ereignisse && Ereignisse.melde) Ereignisse.melde("bauwerk", { id: "bruecke", n: d.abschnitte });
    $("sterne").textContent = S.sterne(); zeigePlan();
    const fertig = d.abschnitte >= ABSCHNITTE;
    if (neu && fertig) benno(`Hurra, ${name()}! Die Brücke ist fertig. Geh auf die Insel und lauf hinüber zur Sandbank!`, "Ура! Мост готов. Иди на остров и пройди по мосту на отмель!");
    else if (neu) benno(`Stück ${d.abschnitte} steht! Noch ${ABSCHNITTE - d.abschnitte} bis zur Sandbank. Es bleibt stehen – wir bauen weiter, wann du willst.`, `Часть ${d.abschnitte} стоит! До отмели осталось ${ABSCHNITTE - d.abschnitte}. Она останется – продолжим, когда захочешь.`);
    else benno("Alles nachgemessen – die Brücke hält!", "Всё измерено – мост держится!");
    $("bereich").innerHTML = `<section class="karte ende hell" id="ende"><h2>${neu ? `🌉 Stück ${d.abschnitte} von ${ABSCHNITTE} gebaut!` : "📏 Gut nachgemessen!"}</h2>
      <p>${lauf.fehler ? "Mit Bennos Hilfe geschafft." : "Alles beim ersten Mal richtig."}${stern ? " Neues Brückenstück: +1 ⭐" : neu ? " Heute gab es schon 3 ⭐ für neue Stücke – das Stück steht trotzdem." : ""}</p>
      <div class="knoepfe"><button class="knopf haupt" id="nochmal">${fertig ? "📏 Weiter messen" : "🔨 Nächstes Stück"}</button><a class="knopf" href="../welt3d/heimat.html">🏝️ Zur Insel</a></div></section>`;
    $("nochmal").addEventListener("click", () => { S.ton("tipp"); starteRunde(); });
  }

  // ---------- Start ----------
  $("sterne").textContent = S.sterne();
  $("benno-vorlesen").addEventListener("click", () => { if (SP) SP.sprich(bennoText); });
  if (!offen()) {
    $("zu").hidden = false; $("bereich").hidden = true; $("plan").hidden = true;
    benno("Hier sammle ich noch Holz. In Kapitel 9 bauen wir zusammen etwas Großes!", "Здесь я пока собираю дерево. В главе 9 мы вместе построим что-то большое!");
  } else starteRunde();

  window.__bruecke = { get lauf() { return lauf; }, get aufgabe() { return auf; }, ABSCHNITTE, STERNE_TAG, SCHRITTE, LZ, PLAN, BAU, aufgabenFuer, stufe, stufeFuer, daten, starteRunde, planSvg,
    // Lösungsweg für Tests (welche Knöpfe in welcher Reihenfolge) – geklickt wird im Test echt
    loesung() {
      const a = auf; if (!a) return [];
      if (a.art === "zahl") return [...String(a.antwort)].map(t => `[data-taste="${t}"]`).concat(['[data-taste="ok"]']);
      if (a.art === "wahl") return [`[data-wahl="${a.richtig}"]`];
      if (a.art === "ordnen") return a.bretter.map((l, k) => [l, k]).filter(([, k]) => !a.gelegt.includes(k)).sort((x, y) => x[0] - y[0]).map(([, k]) => `[data-brett="${k}"]`);
      if (a.art === "legen") { let rest = a.spann - a.gelegt.reduce((x, y) => x + y, 0); const l = []; [50, 30, 20, 10].forEach(s => { while (rest >= s) { l.push(`[data-stk="${s}"]`); rest -= s; } }); return l; }
      if (a.art === "pfeiler") return Array.from({ length: a.laenge / a.abstand - 1 }, (_, i) => (i + 1) * a.abstand).filter(x => !a.gelegt.includes(x)).map(m => `[data-meter="${m}"]`);
      if (a.art === "plan") return [`[data-zelle="${a.antwort}"]`, "#plan-ok"];
      return [];
    },
    // ein falscher Klick für Tests
    falsch() {
      const a = auf; if (!a) return [];
      if (a.art === "zahl") return [`[data-taste="${(a.antwort + 1) % 10 === 0 ? 2 : String(a.antwort + 1).slice(-1)}"]`, '[data-taste="ok"]'];
      if (a.art === "wahl") return [`[data-wahl="${a.richtig === 0 ? 1 : 0}"]`];
      if (a.art === "ordnen") { const k = a.bretter.map((l, i) => [l, i]).filter(([, i]) => !a.gelegt.includes(i)).sort((x, y) => y[0] - x[0])[0][1]; return [`[data-brett="${k}"]`]; }
      if (a.art === "legen") { const l = [], erst = a.spann % 50 === 0 ? 30 : 50; let s = erst; l.push(`[data-stk="${erst}"]`); while (s <= a.spann) { s += 50; l.push('[data-stk="50"]'); } return l; }
      if (a.art === "pfeiler") { const m = Array.from({ length: a.laenge - 1 }, (_, i) => i + 1).find(x => x % a.abstand !== 0); return [`[data-meter="${m}"]`]; }
      if (a.art === "plan") return [`[data-zelle="${a.antwort === 8 ? 1 : a.antwort + 1}"]`, "#plan-ok"];
      return [];
    }
  };
})();
