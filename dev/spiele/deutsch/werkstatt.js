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
  },
  // ---------- NA-36 Teil 2: Rechtschreiben, Textsorten, Lesen mit Fragen ----------
  {
    id: "w-ableiten", stufe: 3, lz: ["de.sc.04"], name: "ä oder e? äu oder eu?", ort: "🌳", farbe: "#5DB84A", grund: "#E3F5DC",
    schritte: [
      { typ: "sag", text: "Hallo {name}! Bei ä und äu hilft ein verwandtes Wort: Bäume kommt von Baum, Hände von Hand. Gibt es kein Wort mit a oder au, schreibst du meist e oder eu.", ru: "Привет, {name}! С ä и äu помогает родственное слово: Bäume от Baum, Hände от Hand. Если слова с a или au нет, обычно пишут e или eu." },
      { typ: "luecke", e: "🌳", satz: "Die B___me sind hoch. (Baum)", optionen: ["äu", "eu"], ru: "Деревья высокие." },
      { typ: "luecke", e: "🍂", satz: "Die Bl___tter fallen. (Blatt)", optionen: ["ä", "e"], ru: "Листья падают." },
      { typ: "luecke", e: "🏠", satz: "In der Straße stehen viele H___ser. (Haus)", optionen: ["äu", "eu"], ru: "На улице много домов." },
      { typ: "luecke", e: "👫", satz: "Viele L___te warten am Bus.", optionen: ["eu", "äu"], ru: "Много людей ждут автобус." },
      { typ: "luecke", e: "🙌", satz: "Ich wasche meine H___nde. (Hand)", optionen: ["ä", "e"], ru: "Я мою руки." },
      { typ: "luecke", e: "🌾", satz: "Der Bauer arbeitet auf dem F___ld.", optionen: ["e", "ä"], ru: "Фермер работает в поле." },
      { typ: "luecke", e: "🐭", satz: "Im Keller wohnen zwei M___se. (Maus)", optionen: ["äu", "eu"], ru: "В подвале живут две мыши." },
      { typ: "sag", text: "Toll! Frag dich immer: Gibt es ein verwandtes Wort mit a oder au? Dann schreibst du ä oder äu.", ru: "Здорово! Всегда спрашивай себя: есть ли родственное слово с a или au? Тогда пишешь ä или äu." }
    ]
  },
  {
    id: "w-dehnung", stufe: 3, lz: ["de.sc.08"], name: "Mit h oder ohne?", ort: "🐄", farbe: "#8A6E2F", grund: "#F7F0DD",
    schritte: [
      { typ: "sag", text: "Manchmal zeigt ein h, dass der Vokal davor lang klingt: Kuh, Zahn, fahren. Es heißt Dehnungs-h. Leider nicht immer – viele Wörter musst du dir merken.", ru: "Иногда буква h показывает, что гласный перед ней долгий: Kuh, Zahn, fahren. Это „Dehnungs-h“. Но не всегда — многие слова нужно запомнить." },
      { typ: "luecke", e: "🐄", satz: "Die ___ gibt Milch.", optionen: ["Kuh", "Ku"], ru: "Корова даёт молоко." },
      { typ: "luecke", e: "🦷", satz: "Mein ___ wackelt.", optionen: ["Zahn", "Zan"], ru: "Мой зуб шатается." },
      { typ: "luecke", e: "🚲", satz: "Ich ___ mit dem Rad.", optionen: ["fahre", "fare"], ru: "Я еду на велосипеде." },
      { typ: "luecke", e: "🏫", satz: "Die ___ beginnt um acht.", optionen: ["Schule", "Schuhle"], ru: "Школа начинается в восемь." },
      { typ: "luecke", e: "⏰", satz: "Die ___ tickt laut.", optionen: ["Uhr", "Ur"], ru: "Часы громко тикают." },
      { typ: "luecke", e: "🪑", satz: "Ich sitze auf dem ___.", optionen: ["Stuhl", "Stul"], ru: "Я сижу на стуле." },
      { typ: "luecke", e: "🌙", satz: "Am Abend scheint der ___.", optionen: ["Mond", "Mohnd"], ru: "Вечером светит луна." },
      { typ: "sag", text: "Super! Ein Dehnungs-h steht oft vor l, m, n oder r: Stuhl, nehmen, Zahn, Uhr. Schlag im Zweifel im Wörterbuch nach.", ru: "Супер! „Dehnungs-h“ часто стоит перед l, m, n или r: Stuhl, nehmen, Zahn, Uhr. Если сомневаешься — посмотри в словаре." }
    ]
  },
  {
    id: "w-rede", stufe: 3, lz: ["de.sc.08", "de.sc.05"], name: "Wörtliche Rede", ort: "💬", farbe: "#3AA0E0", grund: "#E1F3FF",
    schritte: [
      { typ: "sag", text: "Was jemand sagt, steht in Anführungszeichen: unten „ am Anfang, oben “ am Ende. Davor steht ein Doppelpunkt: Mia ruft: „Komm schnell!“", ru: "То, что кто-то говорит, ставят в кавычки: внизу „ в начале, вверху “ в конце. Перед этим — двоеточие: Mia ruft: „Komm schnell!“" },
      { typ: "luecke", e: "🗣️", satz: "Mia ruft___ „Komm schnell!“", optionen: [":", ".", "?"], ru: "Мия кричит: «Иди скорее!»" },
      { typ: "luecke", e: "⚽", satz: "Ben fragt: ___Wo ist mein Ball?“", optionen: ["„", ":", "!"], ru: "Бен спрашивает: «Где мой мяч?»" },
      { typ: "luecke", e: "👵", satz: "Oma sagt: „Das Essen ist fertig.___", optionen: ["“", "„", ":"], ru: "Бабушка говорит: «Еда готова»." },
      { typ: "luecke", e: "🐶", satz: "Der Junge ___: „Darf ich den Hund streicheln?“", optionen: ["fragt", "lacht", "rennt"], ru: "Мальчик спрашивает: «Можно погладить собаку?»" },
      { typ: "satz", e: "💬", woerter: ["Lena", "sagt:", "„Ich", "habe", "Hunger.“"], ru: "Лена говорит: «Я голодна»." },
      { typ: "sag", text: "Prima! Statt immer „sagt“ kannst du auch rufen, fragen, flüstern oder antworten schreiben.", ru: "Отлично! Вместо „sagt“ можно писать rufen, fragen, flüstern или antworten." }
    ]
  },
  {
    id: "w-textsorten", stufe: 3, lz: ["de.tm.04"], name: "Märchen, Fabel, Gedicht", ort: "📚", farbe: "#7B55B8", grund: "#EFE6FF",
    schritte: [
      { typ: "sag", text: "Texte haben verschiedene Sorten. Ein Märchen beginnt oft mit „Es war einmal“ und hat Zauber. In einer Fabel sprechen Tiere, und am Ende steht eine Lehre. Ein Gedicht hat Verse, Strophen und oft Reime.", ru: "Тексты бывают разные. Сказка часто начинается с „Es war einmal“ и в ней есть волшебство. В басне говорят животные, а в конце — мораль. В стихотворении есть строки, строфы и часто рифмы." },
      { typ: "luecke", e: "👑", satz: "„Es war einmal eine Königin, die hatte einen sprechenden Spiegel.“ Das ist ein ___.", optionen: ["Märchen", "Gedicht", "Sachtext"], ru: "«Жила-была королева, у которой было говорящее зеркало». Это сказка." },
      { typ: "luecke", e: "🦊🐦", satz: "Der Fuchs lobt den Raben, bis der Rabe den Käse fallen lässt. Lehre: Trau keinem Schmeichler. Das ist eine ___.", optionen: ["Fabel", "Märchen", "Einladung"], ru: "Лиса хвалит ворону, пока та не роняет сыр. Мораль: не верь льстецу. Это басня." },
      { typ: "luecke", e: "🌧️", satz: "„Tropfen fallen auf das Dach, / klopfen leise, machen Krach.“ Das ist ein ___.", optionen: ["Gedicht", "Märchen", "Brief"], ru: "«Капли падают на крышу, стучат тихо, шумят.» Это стихотворение." },
      { typ: "luecke", e: "🦔", satz: "„Igel fressen Käfer und Würmer. Im Winter halten sie Winterschlaf.“ Das ist ein ___.", optionen: ["Sachtext", "Märchen", "Gedicht"], ru: "«Ежи едят жуков и червей. Зимой они спят.» Это научно-познавательный текст." },
      { typ: "luecke", e: "🔁", satz: "Dach und Krach klingen am Ende gleich. Das nennt man ___.", optionen: ["Reim", "Lehre", "Titel"], ru: "Dach и Krach звучат в конце одинаково. Это рифма." },
      { typ: "luecke", e: "🐢🐇", satz: "Die Schildkröte gewinnt gegen den Hasen, weil sie nicht aufgibt. Die Lehre steht am Ende einer ___.", optionen: ["Fabel", "Einkaufsliste", "Uhr"], ru: "Черепаха побеждает зайца, потому что не сдаётся. Мораль стоит в конце басни." },
      { typ: "sag", text: "Klasse! Ein Sachtext erklärt die echte Welt. Märchen und Fabeln sind ausgedacht.", ru: "Класс! Научный текст объясняет реальный мир. Сказки и басни — выдуманные." }
    ]
  },
  {
    id: "w-lesen-igel", stufe: 3, lz: ["de.le.06"], name: "Lesen: Der Igel", ort: "🦔", farbe: "#B5701A", grund: "#FFF1D9",
    schritte: [
      { typ: "sag", text: "Lies genau, {name}! Igel sind in der Nacht unterwegs. Am Tag schlafen sie unter Hecken oder in Laubhaufen. Ihr Rücken hat etwa 7000 Stacheln. Bei Gefahr rollt sich der Igel zu einer Kugel zusammen. Igel fressen Käfer, Würmer und Schnecken. Von November bis März halten sie Winterschlaf.", ru: "Читай внимательно, {name}! Ежи активны ночью. Днём они спят под кустами или в кучах листьев. На спине у них около 7000 иголок. При опасности ёж сворачивается в клубок. Ежи едят жуков, червей и улиток. С ноября по март у них зимняя спячка." },
      { typ: "luecke", e: "🌙", satz: "Igel sind vor allem ___ unterwegs.", optionen: ["nachts", "mittags", "morgens"], ru: "Ежи активны в основном ночью." },
      { typ: "luecke", e: "🍂", satz: "Am Tag schlafen sie unter Hecken oder in ___.", optionen: ["Laubhaufen", "Bäumen", "Teichen"], ru: "Днём они спят под кустами или в кучах листьев." },
      { typ: "luecke", e: "🟤", satz: "Bei Gefahr rollt sich der Igel zu einer ___ zusammen.", optionen: ["Kugel", "Schlange", "Brücke"], ru: "При опасности ёж сворачивается в клубок." },
      { typ: "luecke", e: "🐌", satz: "Was frisst ein Igel? ___", optionen: ["Käfer und Schnecken", "Nüsse und Gras", "Fische"], ru: "Что ест ёж? Жуков и улиток." },
      { typ: "luecke", e: "❄️", satz: "Im Winter halten Igel ___.", optionen: ["Winterschlaf", "Wache", "Ausflüge"], ru: "Зимой ежи впадают в спячку." },
      { typ: "sag", text: "Super gelesen! Tipp: Bei Sachtexten erst die Fragen lesen, dann im Text die Antwort suchen.", ru: "Отлично прочитано! Совет: в научных текстах сначала прочитай вопросы, потом ищи ответ в тексте." }
    ]
  },
  {
    id: "w-lesen-vergleich", stufe: 4, lz: ["de.le.07"], name: "Lesen: Biber und Otter", ort: "🦫", farbe: "#1F8FB8", grund: "#E2F4FB",
    schritte: [
      { typ: "sag", text: "Zwei Texte, {name}! Erster Text: Der Biber frisst Rinde, Blätter und Wasserpflanzen. Er fällt Bäume mit seinen Zähnen und baut Dämme. Er wird bis zu 30 Kilogramm schwer.", ru: "Два текста, {name}! Первый: бобр ест кору, листья и водные растения. Он валит деревья зубами и строит плотины. Он весит до 30 килограммов." },
      { typ: "sag", text: "Zweiter Text: Der Fischotter frisst Fische, Frösche und Krebse. Er baut keine Dämme, sondern wohnt in Höhlen am Ufer. Er wiegt bis zu 12 Kilogramm.", ru: "Второй текст: выдра ест рыбу, лягушек и раков. Она не строит плотин, а живёт в норах на берегу. Она весит до 12 килограммов." },
      { typ: "luecke", e: "🪵", satz: "Wer baut Dämme? Der ___.", optionen: ["Biber", "Otter", "Frosch"], ru: "Кто строит плотины? Бобр." },
      { typ: "luecke", e: "🐟", satz: "Wer frisst Fische? Der ___.", optionen: ["Otter", "Biber", "Krebs"], ru: "Кто ест рыбу? Выдра." },
      { typ: "luecke", e: "⚖️", satz: "Wer ist schwerer? Der ___.", optionen: ["Biber", "Otter", "Fisch"], ru: "Кто тяжелее? Бобр." },
      { typ: "luecke", e: "➖", satz: "Um wie viele Kilogramm? 30 − 12 = ___ Kilogramm.", optionen: ["18", "12", "42"], ru: "На сколько килограммов? 30 − 12 = 18." },
      { typ: "luecke", e: "💧", satz: "Was haben beide gemeinsam? Beide leben am ___.", optionen: ["Wasser", "Berg", "Strand im Süden"], ru: "Что у них общего? Оба живут у воды." },
      { typ: "sag", text: "Klasse verglichen! Beim Vergleichen suchst du in beiden Texten dieselbe Sache: Futter, Wohnung, Gewicht.", ru: "Отлично сравнил! При сравнении ищи в обоих текстах одно и то же: еду, жильё, вес." }
    ]
  }
];
