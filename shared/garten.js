// Insel-Garten (01.11.2026): säen, gießen, ernten über echte Tage – mit Eule Ella (Sachunterricht: Keimen und Wachsen, Jahreszeiten).
// Regeln (MINISPIELE.md): nichts welkt, nichts geht verloren, keine Fristen. Eine Pflanze wächst höchstens einen Schritt am Tag – wenn sie gegossen wird.
// Daten: profil.daten.garten = { beete: [ { p, gesaet, stufe, gegossen, wuchs } | null ], korb: { p: n }, geerntet: { p: 1 }, fragen: { id: 1 } }
// Nach core.js laden (auf der Insel auch: die Beete wachsen dort sichtbar mit). Test-Haken über die Seite: window.__garten.
(function (W) {
  const S = () => W.Spielwelt;
  const heute = () => (S() && S().heute ? S().heute() : new Date().toISOString().slice(0, 10));
  // ab: ab welcher Klasse die Pflanze im Samenkorb liegt (vs = Vorschule); tage = so oft (an verschiedenen Tagen) gießen bis zur Ernte
  const PFLANZEN = [
    { id: "kresse", name: "Kresse", e: "🌿", tage: 2, ab: 0, farbe: "#7BC74D", ru: "кресс-салат",
      text: "Kresse wächst ganz schnell. Schon nach zwei Tagen kannst du sie ernten!", textRu: "Кресс-салат растёт очень быстро." },
    { id: "salat", name: "Salat", e: "🥬", tage: 3, ab: 0, farbe: "#8BD35A", ru: "салат",
      text: "Vom Salat essen wir die Blätter.", textRu: "У салата мы едим листья." },
    { id: "erdbeere", name: "Erdbeere", e: "🍓", tage: 3, ab: 0, farbe: "#E8484E", ru: "клубника",
      text: "Erst kommt eine weiße Blüte, dann wird daraus die rote Frucht.", textRu: "Сначала белый цветок, потом из него получается красная ягода." },
    { id: "moehre", name: "Möhre", e: "🥕", tage: 4, ab: 1, farbe: "#F08A2B", ru: "морковь",
      text: "Die Möhre wächst unter der Erde. Wir essen ihre Wurzel!", textRu: "Морковь растёт под землёй. Мы едим её корень!" },
    { id: "sonnenblume", name: "Sonnenblume", e: "🌻", tage: 4, ab: 1, farbe: "#FFC83D", ru: "подсолнух",
      text: "Die Sonnenblume dreht ihren Kopf zur Sonne. In der Blüte reifen viele Kerne.", textRu: "Подсолнух поворачивается к солнцу." },
    { id: "tomate", name: "Tomate", e: "🍅", tage: 4, ab: 2, farbe: "#E0453A", ru: "помидор",
      text: "Tomaten brauchen viel Sonne und Wärme. Aus der gelben Blüte wird die Tomate.", textRu: "Помидорам нужно много солнца и тепла." },
    { id: "kuerbis", name: "Kürbis", e: "🎃", tage: 5, ab: 2, farbe: "#F59A23", ru: "тыква",
      text: "Der Kürbis braucht lange und viel Platz. Im Herbst ist er reif.", textRu: "Тыкве нужно много времени и места. Осенью она созревает." },
    { id: "kartoffel", name: "Kartoffel", e: "🥔", tage: 4, ab: 3, farbe: "#C9A26B", ru: "картофель",
      text: "Kartoffeln sind Knollen. Sie wachsen unter der Erde an den Wurzeln.", textRu: "Картофель – это клубни. Они растут под землёй." },
    { id: "mais", name: "Mais", e: "🌽", tage: 5, ab: 3, farbe: "#F2D04B", ru: "кукуруза",
      text: "Mais wird größer als du! Der Wind trägt den Blütenstaub von Pflanze zu Pflanze.", textRu: "Кукуруза вырастает выше тебя!" }
  ];
  // Fragen beim Ernten (Eule Ella). ab wie oben; o[0] ist richtig. lz: Lernziel-ID (shared/lehrplan/kern.js)
  const FRAGEN = [
    { id: "g-giessen", ab: 0, lz: "su.na.01", f: "Was braucht eine Pflanze zum Wachsen?", ru: "Что нужно растению, чтобы расти?", o: ["💧☀️ Wasser und Licht", "🍬 Zucker", "🧦 Socken"], warum: "Pflanzen brauchen Wasser, Licht, Luft und Erde.", warumRu: "Растениям нужны вода, свет, воздух и земля." },
    { id: "g-wurzel", ab: 0, lz: "su.na.05", f: "Welcher Teil holt das Wasser aus der Erde?", ru: "Какая часть растения берёт воду из земли?", o: ["Die Wurzel", "Die Blüte", "Das Blatt"], warum: "Die Wurzel ist wie ein Strohhalm in der Erde.", warumRu: "Корень – как соломинка в земле." },
    { id: "g-zuerst", ab: 1, lz: "su.na.05", f: "Was wächst zuerst aus dem Samen?", ru: "Что первым вырастает из семени?", o: ["Eine kleine Wurzel", "Eine Blüte", "Eine Frucht"], warum: "Zuerst kommt die Wurzel, dann der Keim mit den ersten Blättern.", warumRu: "Сначала корень, потом росток с первыми листьями." },
    { id: "g-licht", ab: 0, lz: "su.na.05", f: "Wohin wachsen die Blätter?", ru: "Куда растут листья?", o: ["☀️ Zum Licht", "⬇️ In die Erde", "🌙 Zum Mond"], warum: "Blätter brauchen Licht. Darum wachsen sie zur Sonne.", warumRu: "Листьям нужен свет, поэтому они тянутся к солнцу." },
    { id: "g-bienen", ab: 1, lz: "su.na.03", f: "Wer trägt Blütenstaub von Blüte zu Blüte?", ru: "Кто переносит пыльцу с цветка на цветок?", o: ["🐝 Bienen und Hummeln", "🐟 Fische", "🐌 Schnecken"], warum: "Bienen besuchen Blüten. So kann aus der Blüte eine Frucht werden.", warumRu: "Пчёлы посещают цветы – так из цветка получается плод." },
    { id: "g-wurm", ab: 1, lz: "su.na.08", f: "Was macht der Regenwurm im Garten?", ru: "Что делает дождевой червь в саду?", o: ["Er lockert die Erde", "Er gießt die Blumen", "Er frisst die Steine"], warum: "Regenwürmer graben Gänge. So kommen Luft und Wasser in die Erde.", warumRu: "Черви роют ходы – так в землю попадают воздух и вода." },
    { id: "g-wurzelessen", ab: 1, lz: "su.na.05", f: "Von welcher Pflanze essen wir die Wurzel?", ru: "У какого растения мы едим корень?", o: ["🥕 Möhre", "🍓 Erdbeere", "🌻 Sonnenblume"], warum: "Die Möhre ist eine dicke Wurzel.", warumRu: "Морковь – это толстый корень." },
    { id: "g-frucht", ab: 2, lz: "su.na.05", f: "Was wird aus einer Blüte?", ru: "Что получается из цветка?", o: ["Eine Frucht mit Samen", "Eine Wurzel", "Ein Stein"], warum: "Aus der Blüte wird die Frucht. Darin stecken neue Samen.", warumRu: "Из цветка получается плод, в нём новые семена." },
    { id: "g-keimen", ab: 2, lz: "su.na.05", f: "Wie heißt es, wenn aus dem Samen eine Pflanze wächst?", ru: "Как называется, когда из семени вырастает растение?", o: ["Keimen", "Welken", "Frieren"], warum: "Der Samen keimt, wenn er Wasser und Wärme bekommt.", warumRu: "Семя прорастает, когда получает воду и тепло." },
    { id: "g-winter", ab: 2, lz: "su.na.03", f: "Warum wächst draußen im Winter kaum etwas?", ru: "Почему зимой на улице почти ничего не растёт?", o: ["Es ist zu kalt und dunkel", "Die Pflanzen sind im Urlaub", "Es regnet zu wenig"], warum: "Im Winter ist es kalt und die Tage sind kurz. Viele Pflanzen ruhen.", warumRu: "Зимой холодно и дни короткие. Многие растения отдыхают." },
    { id: "g-blatt", ab: 3, lz: "su.na.08", f: "Was brauchen grüne Blätter, um Nahrung für die Pflanze zu bilden?", ru: "Что нужно зелёным листьям, чтобы создавать пищу для растения?", o: ["Sonnenlicht", "Dunkelheit", "Schnee"], warum: "Mit Licht, Wasser und Luft machen die Blätter Zucker – die Nahrung der Pflanze.", warumRu: "Со светом, водой и воздухом листья делают сахар – пищу растения." },
    { id: "g-knolle", ab: 3, lz: "su.na.08", f: "Wo wachsen Kartoffeln?", ru: "Где растёт картофель?", o: ["Unter der Erde", "An Bäumen", "Im Wasser"], warum: "Die Kartoffel ist eine Knolle unter der Erde.", warumRu: "Картофель – клубень под землёй." },
    { id: "g-samen", ab: 3, lz: "su.na.05", f: "Wie kommen Samen an neue Orte?", ru: "Как семена попадают на новые места?", o: ["Mit Wind, Wasser und Tieren", "Mit der Post", "Gar nicht"], warum: "Der Wind trägt Pusteblumen, Tiere tragen Samen im Fell.", warumRu: "Ветер несёт одуванчики, животные переносят семена в шерсти." }
  ];
  const klasse = () => { const k = S().kind(); return k.stufe === "vs" ? 0 : Math.min(4, k.klasse || 2); };
  // Anzahl Beete nach Klasse: Vorschule und Kl. 1 drei, Kl. 2 vier, ab Kl. 3 sechs
  const anzahlBeete = () => { const k = klasse(); return k <= 1 ? 3 : k === 2 ? 4 : 6; };
  const pflanze = (id) => PFLANZEN.find(p => p.id === id) || null;
  const samen = () => PFLANZEN.filter(p => p.ab <= klasse());

  function lade() {
    const d = Object.assign({ beete: [], korb: {}, geerntet: {}, fragen: {} }, S().lade("garten") || {});
    d.beete = Array.isArray(d.beete) ? d.beete : []; while (d.beete.length < anzahlBeete()) d.beete.push(null);
    return d;
  }
  const speichere = (d) => S().speichere("garten", d);
  // Freigeschaltet mit Kapitel 1 „Der Spross“ (erster Lernfund); Erwachsene und Testmodus immer
  const offen = () => S().offen(!!(W.Story && W.Story.kapitel() >= 1));
  // Zustand eines Beets für die Anzeige: leer | samen | keim | pflanze | reif
  function zustand(b) {
    if (!b) return { art: "leer" };
    const p = pflanze(b.p); if (!p) return { art: "leer" };
    const reif = b.stufe >= p.tage, anteil = b.stufe / p.tage;
    const art = reif ? "reif" : b.stufe === 0 ? "samen" : anteil <= 0.5 ? "keim" : "pflanze";
    const e = art === "reif" ? p.e : art === "samen" ? "🟤" : art === "keim" ? "🌱" : "🌿";
    return { art, e, p, reif, noch: Math.max(0, p.tage - b.stufe), heuteGegossen: b.gegossen === heute(), anteil: Math.min(1, anteil) };
  }
  function saeen(i, id) {
    const d = lade(), p = pflanze(id);
    if (!p || d.beete[i] || i < 0 || i >= anzahlBeete() || p.ab > klasse()) return false;
    d.beete[i] = { p: id, gesaet: heute(), stufe: 0, gegossen: null, wuchs: null };
    speichere(d); return true;
  }
  // Gießen: einmal am Tag je Beet; dabei wächst die Pflanze einen Schritt (ab dem Tag nach dem Säen auch ohne Warten – wer am Säe-Tag gießt, sieht sofort den Keim)
  function giessen(i) {
    const d = lade(), b = d.beete[i]; if (!b) return { ok: false };
    const p = pflanze(b.p), h = heute();
    if (b.gegossen === h) return { ok: false, schon: true };
    b.gegossen = h;
    let gewachsen = false;
    if (b.stufe < p.tage && b.wuchs !== h) { b.stufe++; b.wuchs = h; gewachsen = true; }
    speichere(d);
    return { ok: true, gewachsen, reif: b.stufe >= p.tage };
  }
  // Frage beim Ernten: zuerst eine noch nie richtig beantwortete passend zur Klasse
  function frage() {
    const d = lade(), k = klasse(), pool = FRAGEN.filter(q => q.ab <= k), neu = pool.filter(q => !d.fragen[q.id]);
    const aus = neu.length ? neu : pool;
    return aus[Math.floor(Math.random() * aus.length)];
  }
  function ernten(i, frageId, richtig) {
    const d = lade(), b = d.beete[i]; if (!b) return null;
    const p = pflanze(b.p); if (b.stufe < p.tage) return null;
    d.beete[i] = null;
    d.korb[p.id] = (d.korb[p.id] || 0) + 1;
    const erstes = !d.geerntet[p.id]; d.geerntet[p.id] = 1;
    if (frageId && richtig) d.fragen[frageId] = 1;
    speichere(d);
    return { p, erstes };
  }
  // Text für die Insel und die Startansage: was gerade los ist
  function lage() {
    const d = lade(), z = d.beete.map(zustand);
    return { reif: z.filter(x => x.art === "reif").length, durstig: z.filter(x => x.art !== "leer" && x.art !== "reif" && !x.heuteGegossen).length, leer: z.filter(x => x.art === "leer").length, z };
  }
  const winter = () => { const m = new Date(W.__jetzt || Date.now()).getMonth(); return m === 11 || m <= 1; };

  W.Garten = { PFLANZEN, FRAGEN, pflanze, samen, lade, speichere, offen, zustand, saeen, giessen, ernten, frage, lage, anzahlBeete, klasse, winter };
})(typeof window !== "undefined" ? window : globalThis);
