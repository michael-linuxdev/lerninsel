// Fipsis Wörter-Werkstatt: Übungskapitel nach Lehrplan (Sachsen Kl. 1/2: Sprache untersuchen, Richtig schreiben; NA-36: Kl. 3–4).
// stufe (optional): Klasse, für die das Kapitel gedacht ist; angezeigt wird es ab der Klasse davor (Kl. 3-Kapitel also ab Kl. 2).
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
  },
  // ---------- NA-36: Klasse 3–4 (stufe = ab welcher Klasse; sichtbar ab der Klasse davor) ----------
  {
    id: "w-praeteritum", stufe: 3, lz: ["de.su.09"], name: "Heute oder gestern?", ort: "⏳", farbe: "#C2337A", grund: "#FDEAF3",
    schritte: [
      { typ: "sag", text: "Hallo {name}! Verben zeigen auch, wann etwas passiert. Heute: ich spiele (Gegenwart). Gestern: ich spielte (Vergangenheit).", ru: "Привет, {name}! Глаголы показывают, когда что-то происходит. Сегодня: я играю (настоящее). Вчера: я играл (прошедшее)." },
      { typ: "luecke", e: "⚽", satz: "Gestern ___ ich Fußball.", optionen: ["spielte", "spiele", "spielen"], ru: "Вчера я играл в футбол." },
      { typ: "luecke", e: "🎬", satz: "Gestern ___ wir ins Kino.", optionen: ["gingen", "gehen", "geht"], ru: "Вчера мы ходили в кино." },
      { typ: "luecke", e: "🍕", satz: "Heute ___ Mama Pizza.", optionen: ["backt", "backte", "backen"], ru: "Сегодня мама печёт пиццу." },
      { typ: "luecke", e: "🐕", satz: "Letzte Woche ___ der Hund laut.", optionen: ["bellte", "bellt", "bellen"], ru: "На прошлой неделе собака громко лаяла." },
      { typ: "luecke", e: "🏊", satz: "Im Sommer ___ Ben im See.", optionen: ["schwamm", "schwimmt", "schwimmen"], ru: "Летом Бен плавал в озере." },
      { typ: "luecke", e: "📖", satz: "Jetzt ___ Aylin ein Buch.", optionen: ["liest", "las", "lesen"], ru: "Сейчас Айлин читает книгу." },
      { typ: "luecke", e: "🎂", satz: "Vor einem Jahr ___ ich sieben Jahre alt.", optionen: ["war", "bin", "sind"], ru: "Год назад мне было семь лет." },
      { typ: "sag", text: "Super! Manche Verben ändern sich in der Vergangenheit ganz: gehen – ging, schwimmen – schwamm, sein – war.", ru: "Супер! Некоторые глаголы в прошедшем времени меняются полностью: gehen – ging, schwimmen – schwamm, sein – war." }
    ]
  },
  {
    id: "w-perfekt", stufe: 4, lz: ["de.su.12"], name: "Habe gespielt, werde spielen", ort: "🗓️", farbe: "#2F6FB8", grund: "#E5EFFB",
    schritte: [
      { typ: "sag", text: "Wenn wir erzählen, sagen wir oft: Ich habe gespielt. Ich bin gelaufen. Das ist das Perfekt. Für morgen sagen wir: Ich werde spielen – das ist die Zukunft (Futur).", ru: "Когда мы рассказываем, мы часто говорим: Ich habe gespielt. Ich bin gelaufen. Это Perfekt. Про завтра говорим: Ich werde spielen — это будущее время (Futur)." },
      { typ: "luecke", e: "🎨", satz: "Ich habe ein Bild ___.", optionen: ["gemalt", "malen", "male"], ru: "Я нарисовал картину." },
      { typ: "luecke", e: "🏃", satz: "Wir sind schnell ___.", optionen: ["gelaufen", "laufen", "lief"], ru: "Мы быстро бежали." },
      { typ: "luecke", e: "🍪", satz: "Mia ___ Kekse gebacken.", optionen: ["hat", "ist", "wird"], ru: "Мия испекла печенье." },
      { typ: "luecke", e: "🚌", satz: "Der Bus ___ pünktlich gekommen.", optionen: ["ist", "hat", "wird"], ru: "Автобус пришёл вовремя." },
      { typ: "luecke", e: "🌧️", satz: "Morgen ___ es regnen.", optionen: ["wird", "hat", "ist"], ru: "Завтра будет дождь." },
      { typ: "luecke", e: "✈️", satz: "In den Ferien werden wir nach Polen ___.", optionen: ["fliegen", "geflogen", "flog"], ru: "На каникулах мы полетим в Польшу." },
      { typ: "luecke", e: "📚", satz: "Gestern habe ich viel ___.", optionen: ["gelernt", "lernen", "lerne"], ru: "Вчера я много учился." },
      { typ: "sag", text: "Klasse! Bei Bewegung wie laufen, fahren, kommen sagt man meist „bin“: Ich bin gelaufen.", ru: "Класс! С глаголами движения (laufen, fahren, kommen) обычно говорят „bin“: Ich bin gelaufen." }
    ]
  },
  {
    id: "w-satzglieder", stufe: 3, lz: ["de.su.10"], name: "Wer tut was?", ort: "🧩", farbe: "#2E9C5A", grund: "#E3F7EF",
    schritte: [
      { typ: "sag", text: "Jeder Satz hat einen Satzkern. Wer oder was tut etwas? Das ist das Subjekt. Was tut es? Das ist das Prädikat.", ru: "В каждом предложении есть основа. Кто или что делает? Это подлежащее. Что делает? Это сказуемое." },
      { typ: "luecke", e: "🐕", satz: "Wer bellt? ___ bellt laut.", optionen: ["Der Hund", "Laut", "Bellt"], ru: "Кто лает? Собака громко лает." },
      { typ: "luecke", e: "🐦", satz: "Wer singt? Am Morgen singt ___.", optionen: ["die Amsel", "der Morgen", "am"], ru: "Кто поёт? Утром поёт чёрный дрозд." },
      { typ: "luecke", e: "🚂", satz: "Was macht der Zug? Der Zug ___ in den Bahnhof.", optionen: ["fährt", "Bahnhof", "schnell"], ru: "Что делает поезд? Поезд въезжает на вокзал." },
      { typ: "luecke", e: "👧", satz: "Was macht Lena? Lena ___ ihrer Oma einen Brief.", optionen: ["schreibt", "Oma", "Brief"], ru: "Что делает Лена? Лена пишет бабушке письмо." },
      { typ: "luecke", e: "🌻", satz: "Wer wächst? Im Garten wächst ___.", optionen: ["eine Sonnenblume", "im Garten", "wächst"], ru: "Что растёт? В саду растёт подсолнух." },
      { typ: "satz", e: "🐱🐟", woerter: ["Die", "Katze", "frisst", "einen", "Fisch."], ru: "Кошка ест рыбу." },
      { typ: "sag", text: "Prima! Das Prädikat ist ein Verb und steht im Aussagesatz an zweiter Stelle.", ru: "Отлично! Сказуемое — это глагол, в повествовательном предложении оно стоит на втором месте." }
    ]
  },
  {
    id: "w-satzzeichen", stufe: 4, lz: ["de.su.11"], name: "Punkt, Fragezeichen, Ausrufezeichen", ort: "❗", farbe: "#E0574A", grund: "#FFECE8",
    schritte: [
      { typ: "sag", text: "Es gibt drei Satzarten: Aussagesatz mit Punkt. Fragesatz mit Fragezeichen. Ausrufesatz oder Aufforderung mit Ausrufezeichen.", ru: "Есть три вида предложений: повествовательное с точкой, вопросительное с вопросительным знаком, восклицательное или побудительное с восклицательным знаком." },
      { typ: "luecke", e: "❓", satz: "Wie heißt du___", optionen: ["?", ".", "!"], ru: "Как тебя зовут?" },
      { typ: "luecke", e: "🌞", satz: "Die Sonne scheint___", optionen: [".", "?", "!"], ru: "Солнце светит." },
      { typ: "luecke", e: "🚨", satz: "Pass auf___", optionen: ["!", "?", "."], ru: "Осторожно!" },
      { typ: "luecke", e: "🏫", satz: "Gehst du morgen in die Schule___", optionen: ["?", ".", "!"], ru: "Ты завтра пойдёшь в школу?" },
      { typ: "luecke", e: "🐢", satz: "Die Schildkröte läuft langsam___", optionen: [".", "?", "!"], ru: "Черепаха идёт медленно." },
      { typ: "luecke", e: "🎉", satz: "Hurra, wir haben gewonnen___", optionen: ["!", "?", "."], ru: "Ура, мы победили!" },
      { typ: "luecke", e: "🕰️", satz: "Wann beginnt der Film___", optionen: ["?", ".", "!"], ru: "Когда начинается фильм?" },
      { typ: "sag", text: "Super! Ein Fragewort wie wer, wie, wann, wo am Anfang verrät oft eine Frage.", ru: "Супер! Вопросительное слово в начале — wer, wie, wann, wo — часто показывает, что это вопрос." }
    ]
  },
  {
    id: "w-kurz-lang", stufe: 3, lz: ["de.sc.08"], name: "ck, tz, ss oder ß?", ort: "🔊", farbe: "#E8A33D", grund: "#FFF1D9",
    schritte: [
      { typ: "sag", text: "Hör genau auf den Vokal! Klingt er kurz, wie in Katze, Brücke, Wasser, folgt oft tz, ck oder ss. Klingt er lang, wie in Straße, folgt ß.", ru: "Слушай гласный! Если он короткий, как в Katze, Brücke, Wasser, после него часто tz, ck или ss. Если долгий, как в Straße, — ß." },
      { typ: "luecke", e: "🐱", satz: "Die Ka___e schläft.", optionen: ["tz", "z"], ru: "Кошка спит." },
      { typ: "luecke", e: "🌉", satz: "Wir gehen über die Brü___e.", optionen: ["ck", "k"], ru: "Мы идём по мосту." },
      { typ: "luecke", e: "💧", satz: "Ich trinke Wa___er.", optionen: ["ss", "ß"], ru: "Я пью воду." },
      { typ: "luecke", e: "🛣️", satz: "Die Stra___e ist lang.", optionen: ["ß", "ss"], ru: "Улица длинная." },
      { typ: "luecke", e: "🦶", satz: "Mein Fu___ tut weh.", optionen: ["ß", "ss"], ru: "У меня болит нога." },
      { typ: "luecke", e: "🍰", satz: "Ich esse ein Stü___ Kuchen.", optionen: ["ck", "k"], ru: "Я ем кусок торта." },
      { typ: "luecke", e: "🔥", satz: "Die Sonne gibt Hi___e.", optionen: ["tz", "z"], ru: "Солнце даёт жару." },
      { typ: "luecke", e: "😘", satz: "Mama gibt mir einen Ku___.", optionen: ["ss", "ß"], ru: "Мама меня целует." },
      { typ: "sag", text: "Toll! Nach l, n, r – das merke ja – steht nie tz und nie ck: Holz, Bank, Herz.", ru: "Здорово! После l, n, r никогда не пишут tz и ck: Holz, Bank, Herz." }
    ]
  }
];
