// Stickeralbum: Sticker gibt es fürs Lernen (alle 6 gelösten Aufgaben einer, höchstens 3 am Tag),
// fürs Entdecken auf der Insel (echtes Wetter, Nacht) und an Festtagen (Deutschland und Russland).
// Doppelte Sticker werden gezählt – zum Tauschen per QR später.
(function () {
  const S = window.Spielwelt;
  if (!S) return;
  const SEITEN = [
    { id: "insel", name: "Inselbewohner", ru: "Жители острова", farbe: "#FFE3B8", woher: "lernen", sticker: [
      ["eule", "🦉", "Eule Ella", "Сова Элла"], ["fipsi", "🦊", "Fipsi", "Фипси"], ["robo", "🤖", "Robo Pixel", "Робо Пиксель"], ["drache", "🐉", "Drache", "Дракон"],
      ["katze", "🐈", "Katze", "Кошка"], ["igel", "🦔", "Igel", "Ёжик"], ["hoernchen", "🐿️", "Eichhörnchen", "Белка"], ["kaefer", "🐞", "Marienkäfer", "Божья коровка"]] },
    { id: "wetter", name: "Wetter", ru: "Погода", farbe: "#D6EEFF", woher: "entdecken", sticker: [
      ["w-klar", "☀️", "Sonne", "Солнце", "Scheint die Sonne bei dir? Schau auf der Insel!"], ["w-wolken", "⛅", "Wolken", "Облака", "Wolkentag auf der Insel"],
      ["w-regen", "🌧️", "Regen", "Дождь", "Regnet es bei dir? Dann auch auf der Insel."], ["w-schnee", "❄️", "Schnee", "Снег", "Kommt mit echtem Schnee"],
      ["w-nebel", "🌫️", "Nebel", "Туман", "An einem Nebeltag"], ["w-gewitter", "⛈️", "Gewitter", "Гроза", "Bei Blitz und Donner"],
      ["w-mond", "🌙", "Mond", "Луна", "Besuche die Insel am Abend"], ["w-regenbogen", "🌈", "Regenbogen", "Радуга", "Sammle alle anderen Wetter-Sticker"]] },
    { id: "wald", name: "Wald und Wiese", ru: "Лес и луг", farbe: "#DDF3D2", woher: "lernen", sticker: [
      ["eiche", "🌳", "Eiche", "Дуб"], ["pilz", "🍄", "Pilz", "Гриб"], ["sonnenblume", "🌻", "Sonnenblume", "Подсолнух"], ["biene", "🐝", "Biene", "Пчела"],
      ["schmetterling", "🦋", "Schmetterling", "Бабочка"], ["frosch", "🐸", "Frosch", "Лягушка"], ["schnecke", "🐌", "Schnecke", "Улитка"], ["blatt", "🍁", "Ahornblatt", "Кленовый лист"]] },
    { id: "meer", name: "Im Meer", ru: "В море", farbe: "#CFF1F2", woher: "lernen", sticker: [
      ["wal", "🐳", "Wal", "Кит"], ["delfin", "🐬", "Delfin", "Дельфин"], ["krake", "🐙", "Krake", "Осьминог"], ["krebs", "🦀", "Krebs", "Краб"],
      ["fisch", "🐠", "Fisch", "Рыбка"], ["muschel", "🐚", "Muschel", "Ракушка"], ["robbe", "🦭", "Robbe", "Тюлень"], ["koralle", "🪸", "Koralle", "Коралл"]] },
    { id: "weltall", name: "Weltall", ru: "Космос", farbe: "#E3DCFF", woher: "lernen", sticker: [
      ["erde", "🌍", "Erde", "Земля"], ["vollmond", "🌕", "Vollmond", "Полнолуние"], ["komet", "☄️", "Komet", "Комета"], ["rakete", "🚀", "Rakete", "Ракета"],
      ["saturn", "🪐", "Saturn", "Сатурн"], ["astronautin", "🧑‍🚀", "Astronaut", "Космонавт"], ["ufo", "🛸", "Ufo", "НЛО"], ["sterne", "✨", "Sterne", "Звёзды"]] },
    { id: "feste", name: "Feste", ru: "Праздники", farbe: "#FFDDE8", woher: "feste", sticker: [
      ["f-advent", "🕯️", "Advent", "Адвент", "1. bis 23. Dezember"], ["f-nikolaus", "🥾", "Nikolaus", "День Святого Николая", "5. und 6. Dezember"],
      ["f-weihnachten", "🎄", "Weihnachten", "Рождество", "24. bis 26. Dezember"], ["f-neujahr", "🎆", "Neujahr und Väterchen Frost", "Новый год и Дед Мороз", "31. Dezember bis 7. Januar"],
      ["f-masleniza", "🥞", "Masleniza", "Масленица", "In der Masleniza-Woche (Februar/März)"], ["f-maerz", "🌷", "8. März", "8 Марта", "7. bis 9. März"],
      ["f-ostern", "🐣", "Ostern", "Пасха", "Rund um Ostern"], ["f-schule", "🎒", "Schulanfang", "1 сентября", "Ende August bis 3. September"]] }
  ];
  const ALLE = {}; SEITEN.forEach(s => s.sticker.forEach(([id, e, name, ru, tipp]) => { ALLE[id] = { id, e, name, ru, tipp, seite: s.id }; }));
  const LERN_POOL = SEITEN.filter(s => s.woher === "lernen").flatMap(s => s.sticker.map(x => x[0]));
  const PRO_STICKER = 6, MAX_TAG = 3;
  // Bewegliche Feste (Masleniza-Woche und Ostern West/Ost) – Tabelle, bei Bedarf erweitern
  const BEWEGLICH = {
    "f-masleniza": [["2027-03-08", "2027-03-14"], ["2028-02-20", "2028-02-26"], ["2029-02-12", "2029-02-18"], ["2030-03-04", "2030-03-10"]],
    "f-ostern": [["2027-03-25", "2027-04-05"], ["2027-04-29", "2027-05-03"], ["2028-04-13", "2028-04-18"], ["2029-03-29", "2029-04-09"], ["2030-04-18", "2030-04-29"]]
  };
  const heuteStr = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const jetzt = () => new Date(window.__jetzt || Date.now());

  function daten() { return Object.assign({ hat: {}, neu: [], tag: "", heute: 0, aufgaben: 0 }, S.lade("sticker") || {}); }
  function speichere(d) { S.speichere("sticker", d); }
  function melde(st, neu) {
    const C = window.Charakter, titel = neu ? `🌟 Neuer Sticker: ${st.e} ${st.name}` : `${st.e} ${st.name} – schon da!`;
    const text = neu ? "Er klebt jetzt in deinem Stickeralbum." : "Doppelte Sticker kannst du bald tauschen.";
    if (C && C.hinweis) C.hinweis(titel, text, "#C2337A"); else if (S.meldung) S.meldung(titel);
  }
  function gib(id, d0) {
    const st = ALLE[id]; if (!st) return false;
    const d = d0 || daten(), neu = !d.hat[id];
    d.hat[id] = (d.hat[id] || 0) + 1; if (neu && !d.neu.includes(id)) d.neu.push(id);
    // Regenbogen: alle anderen Wetter-Sticker gesammelt
    if (st.seite === "wetter" && !d.hat["w-regenbogen"] && SEITEN[1].sticker.every(([x]) => x === "w-regenbogen" || d.hat[x])) { d.hat["w-regenbogen"] = 1; d.neu.push("w-regenbogen"); setTimeout(() => melde(ALLE["w-regenbogen"], true), 400); }
    if (!d0) speichere(d);
    melde(st, neu);
    return neu;
  }
  function zufall() {
    const d = daten(), fehlt = LERN_POOL.filter(id => !d.hat[id]);
    const pool = fehlt.length && Math.random() < 0.8 ? fehlt : LERN_POOL;
    return pool[Math.floor(Math.random() * pool.length)];
  }
  // Entdecken: jeder Sticker nur einmal
  function entdecke(id) { const d = daten(); if (d.hat[id]) return false; return gib(id); }
  function feste() {
    const j = jetzt(), m = j.getMonth() + 1, t = j.getDate(), h = heuteStr(j);
    const im = (id) => (BEWEGLICH[id] || []).some(([a, b]) => h >= a && h <= b);
    const heute = {
      "f-advent": m === 12 && t <= 23, "f-nikolaus": m === 12 && (t === 5 || t === 6), "f-weihnachten": m === 12 && t >= 24 && t <= 26,
      "f-neujahr": (m === 12 && t === 31) || (m === 1 && t <= 7), "f-masleniza": im("f-masleniza"), "f-maerz": m === 3 && t >= 7 && t <= 9,
      "f-ostern": im("f-ostern"), "f-schule": (m === 8 && t >= 25) || (m === 9 && t <= 3)
    };
    Object.keys(heute).forEach(id => { if (heute[id]) entdecke(id); });
  }
  // Lernaufgaben zählen (gleiche Fächer wie das Zeitsystem)
  const LERN = ["mathe", "deutsch", "tablet", "sachkunde"];
  function aufgabe() {
    const d = daten(), h = heuteStr(jetzt());
    if (d.tag !== h) { d.tag = h; d.heute = 0; d.aufgaben = 0; }
    d.aufgaben++;
    if (d.aufgaben >= PRO_STICKER && d.heute < MAX_TAG) { d.aufgaben = 0; d.heute++; gib(zufall(), d); }
    speichere(d);
  }
  const C = window.Charakter;
  if (C && C.gib && !C.__sticker) {
    const orig = C.gib; C.__sticker = true;
    C.gib = function (id, n) { const r = orig.apply(this, arguments); if (LERN.includes(id) && n === 1) aufgabe(); return r; };
  }
  function gesehen() { const d = daten(); d.neu = []; speichere(d); }
  function stand() { const d = daten(); return { hat: Object.keys(d.hat).length, gesamt: Object.keys(ALLE).length, neu: d.neu.length }; }
  window.Sticker = { SEITEN, ALLE, daten, gib, zufall, entdecke, feste, gesehen, stand, PRO_STICKER, MAX_TAG };
})();
