// Fipsis Wörter-Werkstatt: Übungskapitel nach Lehrplan (Sachsen Kl. 1/2: Sprache untersuchen, Richtig schreiben).
// Gleiche Schritt-Typen wie die Geschichte, dazu:
//   wortart     { wort, e?, richtig: "nomen"|"verb"|"adjektiv", ru }
//   verlaengern { wort: "Hun_", lang: "Hunde", richtig: "d", falsch: "t", e, ru }
//   silben      { wort, teile: ["Ba","na","ne"], e, ru }
window.WERKSTATT = [
  {
    id: "w-verben", lz: ["de.su.04"], name: "Tunwörter", ort: "🏃", farbe: "#E0574A", grund: "#FFECE8",
    schritte: [
      { typ: "sag", text: "Willkommen in meiner Wörter-Werkstatt, {name}! Heute geht es um Tunwörter. Sie sagen, was jemand tut: laufen, essen, schlafen.", ru: "Добро пожаловать в мою мастерскую слов! Сегодня — глаголы. Они говорят, что кто-то делает: бегать, есть, спать." },
      { typ: "luecke", e: "🏃", satz: "Das Kind ___ schnell.", optionen: ["läuft", "Haus", "grün"], ru: "Ребёнок быстро бежит." },
      { typ: "luecke", e: "😴", satz: "Die Katze ___ auf dem Sofa.", optionen: ["schläft", "Sofa", "weich"], ru: "Кошка спит на диване." },
      { typ: "luecke", e: "🍎", satz: "Ich ___ einen Apfel.", optionen: ["esse", "rot", "Apfel"], ru: "Я ем яблоко." },
      { typ: "luecke", e: "🐦", satz: "Der Vogel ___ am Himmel.", optionen: ["fliegt", "blau", "Himmel"], ru: "Птица летит в небе." },
      { typ: "luecke", e: "🎨", satz: "Mia ___ ein Bild.", optionen: ["malt", "bunt", "Stift"], ru: "Мия рисует картину." },
      { typ: "wortart", wort: "springen", e: "🐸", richtig: "verb", ru: "прыгать" },
      { typ: "wortart", wort: "singen", e: "🎤", richtig: "verb", ru: "петь" },
      { typ: "wortart", wort: "Ball", e: "⚽", richtig: "nomen", ru: "мяч" },
      { typ: "wortart", wort: "schwimmen", e: "🏊", richtig: "verb", ru: "плавать" },
      { typ: "sag", text: "Super! Tunwörter schreibt man klein – außer am Satzanfang.", ru: "Супер! Глаголы пишутся с маленькой буквы — кроме начала предложения." }
    ]
  },
  {
    id: "w-adjektive", lz: ["de.su.04"], name: "Wiewörter", ort: "🌈", farbe: "#3AA0E0", grund: "#E1F3FF",
    schritte: [
      { typ: "sag", text: "Wiewörter sagen, wie etwas ist: groß, klein, laut, leise, süß.", ru: "Прилагательные говорят, какой предмет: большой, маленький, громкий, тихий, сладкий." },
      { typ: "luecke", e: "🐘", satz: "Der Elefant ist ___.", optionen: ["groß", "läuft", "Rüssel"], ru: "Слон большой." },
      { typ: "luecke", e: "🐭", satz: "Die Maus ist ___.", optionen: ["klein", "Käse", "rennt"], ru: "Мышь маленькая." },
      { typ: "luecke", e: "🍋", satz: "Die Zitrone ist ___.", optionen: ["sauer", "gelb sein", "Baum"], ru: "Лимон кислый." },
      { typ: "luecke", e: "🔥", satz: "Das Feuer ist ___.", optionen: ["heiß", "brennt", "Holz"], ru: "Огонь горячий." },
      { typ: "luecke", e: "🐢", satz: "Die Schildkröte ist ___.", optionen: ["langsam", "Panzer", "kriecht"], ru: "Черепаха медленная." },
      { typ: "wortart", wort: "weich", e: "🧸", richtig: "adjektiv", ru: "мягкий" },
      { typ: "wortart", wort: "laut", e: "📢", richtig: "adjektiv", ru: "громкий" },
      { typ: "wortart", wort: "lachen", e: "😄", richtig: "verb", ru: "смеяться" },
      { typ: "wortart", wort: "kalt", e: "❄️", richtig: "adjektiv", ru: "холодный" },
      { typ: "sag", text: "Toll! Auch Wiewörter schreibt man klein.", ru: "Отлично! Прилагательные тоже пишутся с маленькой буквы." }
    ]
  },
  {
    id: "w-wortarten", lz: ["de.su.04"], name: "Wortarten sortieren", ort: "🗂️", farbe: "#7B55B8", grund: "#EFE6FF",
    schritte: [
      { typ: "sag", text: "Jetzt sortieren wir! Namenwörter (Nomen) sind Dinge, Tiere und Menschen – sie schreibt man groß und sie haben der, die oder das. Tunwörter sagen, was man tut. Wiewörter sagen, wie etwas ist.", ru: "Теперь сортируем! Существительные — это предметы, животные и люди; они пишутся с большой буквы и имеют der, die или das. Глаголы говорят, что делают. Прилагательные — какой предмет." },
      { typ: "wortart", wort: "Hund", e: "🐶", richtig: "nomen", ru: "собака" },
      { typ: "wortart", wort: "rennen", e: "🏃", richtig: "verb", ru: "бегать" },
      { typ: "wortart", wort: "bunt", e: "🎨", richtig: "adjektiv", ru: "пёстрый" },
      { typ: "wortart", wort: "Blume", e: "🌷", richtig: "nomen", ru: "цветок" },
      { typ: "wortart", wort: "trinken", e: "🥤", richtig: "verb", ru: "пить" },
      { typ: "wortart", wort: "müde", e: "🥱", richtig: "adjektiv", ru: "усталый" },
      { typ: "wortart", wort: "Schule", e: "🏫", richtig: "nomen", ru: "школа" },
      { typ: "wortart", wort: "lesen", e: "📖", richtig: "verb", ru: "читать" },
      { typ: "wortart", wort: "nass", e: "💧", richtig: "adjektiv", ru: "мокрый" },
      { typ: "satz", e: "🐶", woerter: ["Der", "kleine", "Hund", "bellt."], ru: "Маленькая собака лает." },
      { typ: "sag", text: "Klasse, {name}! Du bist ein echter Wörter-Profi.", ru: "Класс! Ты настоящий мастер слов." }
    ]
  },
  {
    id: "w-verlaengern", lz: ["de.sc.04"], name: "d oder t? Verlängern!", ort: "🔍", farbe: "#E8A33D", grund: "#FFF1D9",
    schritte: [
      { typ: "sag", text: "Hörst du am Ende von Hund ein d oder ein t? Man hört t! Aber man schreibt d. Der Trick: Verlängere das Wort! Hund – Hunde. Jetzt hörst du das d.", ru: "Слышишь в конце слова Hund d или t? Слышно t! Но пишется d. Хитрость: удлини слово! Hund — Hunde. Теперь слышно d." },
      { typ: "verlaengern", e: "🐶", wort: "Hun_", lang: "Hunde", richtig: "d", falsch: "t", ru: "собака" },
      { typ: "verlaengern", e: "🍞", wort: "Bro_", lang: "Brote", richtig: "t", falsch: "d", ru: "хлеб" },
      { typ: "verlaengern", e: "🌲", wort: "Wal_", lang: "Wälder", richtig: "d", falsch: "t", ru: "лес" },
      { typ: "verlaengern", e: "⛺", wort: "Zel_", lang: "Zelte", richtig: "t", falsch: "d", ru: "палатка" },
      { typ: "verlaengern", e: "🐴", wort: "Pfer_", lang: "Pferde", richtig: "d", falsch: "t", ru: "лошадь" },
      { typ: "sag", text: "Das klappt auch bei g oder k und b oder p!", ru: "Это работает и для g или k, и для b или p!" },
      { typ: "verlaengern", e: "⛰️", wort: "Ber_", lang: "Berge", richtig: "g", falsch: "k", ru: "гора" },
      { typ: "verlaengern", e: "🚂", wort: "Zu_", lang: "Züge", richtig: "g", falsch: "k", ru: "поезд" },
      { typ: "verlaengern", e: "🗄️", wort: "Schran_", lang: "Schränke", richtig: "k", falsch: "g", ru: "шкаф" },
      { typ: "verlaengern", e: "🧺", wort: "Kor_", lang: "Körbe", richtig: "b", falsch: "p", ru: "корзина" },
      { typ: "verlaengern", e: "☀️", wort: "Ta_", lang: "Tage", richtig: "g", falsch: "k", ru: "день" },
      { typ: "sag", text: "Super! Wenn du unsicher bist: Verlängern hilft immer.", ru: "Супер! Если сомневаешься — удлини слово." }
    ]
  },
  {
    id: "w-silben", lz: ["de.su.02", "de.le.03"], name: "Silben klatschen", ort: "👏", farbe: "#2E9C5A", grund: "#E3F7EF",
    schritte: [
      { typ: "sag", text: "Klatsch mit mir! Ba – na – ne. Drei Mal geklatscht, drei Silben. Sprich jedes Wort und klatsche dazu.", ru: "Хлопай со мной! Ba-na-ne. Три хлопка — три слога." },
      { typ: "silben", e: "🍌", wort: "Banane", teile: ["Ba", "na", "ne"], ru: "банан" },
      { typ: "silben", e: "🍎", wort: "Apfel", teile: ["Ap", "fel"], ru: "яблоко" },
      { typ: "silben", e: "🌙", wort: "Mond", teile: ["Mond"], ru: "луна" },
      { typ: "silben", e: "🐘", wort: "Elefant", teile: ["E", "le", "fant"], ru: "слон" },
      { typ: "silben", e: "☀️", wort: "Sonne", teile: ["Son", "ne"], ru: "солнце" },
      { typ: "silben", e: "🦋", wort: "Schmetterling", teile: ["Schmet", "ter", "ling"], ru: "бабочка" },
      { typ: "silben", e: "🚀", wort: "Rakete", teile: ["Ra", "ke", "te"], ru: "ракета" },
      { typ: "silben", e: "🖊️", wort: "Kugelschreiber", teile: ["Ku", "gel", "schrei", "ber"], ru: "ручка" },
      { typ: "silben", e: "⚽", wort: "Ball", teile: ["Ball"], ru: "мяч" },
      { typ: "silben", e: "🐞", wort: "Marienkäfer", teile: ["Ma", "ri", "en", "kä", "fer"], ru: "божья коровка" },
      { typ: "sag", text: "Prima geklatscht! Silben helfen beim Lesen und Schreiben langer Wörter.", ru: "Отлично! Слоги помогают читать и писать длинные слова." }
    ]
  }
];
