// Fipsis Wörter-Werkstatt: Übungskapitel nach Lehrplan (Sachsen Kl. 1/2: Sprache untersuchen, Richtig schreiben; NA-36: Kl. 3–4).
// stufe (optional): Klasse, für die das Kapitel gedacht ist; angezeigt wird es ab der Klasse davor (Kl. 3-Kapitel also ab Kl. 2).
// Gleiche Schritt-Typen wie die Geschichte, dazu:
//   wortart     { wort, e?, richtig: "nomen"|"verb"|"adjektiv", ru }
//   verlaengern { wort: "Hun_", lang: "Hunde", richtig: "d", falsch: "t", e, ru }
//   silben      { wort, teile: ["Ba","na","ne"], e, ru }
//   ordnen      { frage?, teile: [...in richtiger Reihenfolge], e?, ru }   (Paket A: Sätze/Bausteine als Karten ordnen)
//   verbessern  { frage?, satz, falsch, stelle?, optionen: [besser, ...], tipp?, e?, ru }   (Paket A: störendes Wort antippen, ersetzen)
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
  },
  // ---------- NA-36 Teil 3: Steigerung, Pronomen, Komma, Vor-/Nachsilben, Fälle, Meinung ----------
  {
    id: "w-steigerung", stufe: 3, lz: ["de.su.04"], name: "groß, größer, am größten", ort: "📏", farbe: "#3AA0E0", grund: "#E1F3FF",
    schritte: [
      { typ: "sag", text: "Mit Adjektiven kann man vergleichen: Die Maus ist klein. Der Käfer ist kleiner. Die Ameise ist am kleinsten.", ru: "С прилагательными можно сравнивать: мышь маленькая, жук меньше, муравей самый маленький." },
      { typ: "luecke", e: "🐘🦒", satz: "Die Giraffe ist ___ als der Elefant.", optionen: ["größer", "groß", "am größten"], ru: "Жираф выше слона." },
      { typ: "luecke", e: "🐆", satz: "Der Gepard ist von allen Tieren am ___.", optionen: ["schnellsten", "schneller", "schnell"], ru: "Гепард самый быстрый из всех животных." },
      { typ: "luecke", e: "🍫", satz: "Schokolade schmeckt mir ___ als Spinat.", optionen: ["besser", "guter", "am gutesten"], ru: "Шоколад мне нравится больше, чем шпинат." },
      { typ: "luecke", e: "🏔️", satz: "Der Berg ist hoch, der Turm ist ___.", optionen: ["höher", "hocher", "am hoch"], ru: "Гора высокая, башня выше." },
      { typ: "luecke", e: "🐌", satz: "Die Schnecke ist ___ als die Katze.", optionen: ["langsamer", "langsam", "am langsamsten"], ru: "Улитка медленнее кошки." },
      { typ: "luecke", e: "🍰", satz: "Ich esse Kuchen gern, Eis esse ich am ___.", optionen: ["liebsten", "gernsten", "lieber"], ru: "Я люблю торт, а мороженое больше всего." },
      { typ: "sag", text: "Super! Aufpassen bei gut – besser – am besten und gern – lieber – am liebsten. Die musst du dir merken.", ru: "Супер! Внимание: gut – besser – am besten и gern – lieber – am liebsten. Их нужно запомнить." }
    ]
  },
  {
    id: "w-pronomen", stufe: 3, lz: ["de.su.04", "de.su.06"], name: "er, sie, es", ort: "👥", farbe: "#C2337A", grund: "#FDEAF3",
    schritte: [
      { typ: "sag", text: "Damit ein Text nicht langweilig klingt, ersetzen wir Nomen durch Pronomen: der Hund → er, die Katze → sie, das Pferd → es, die Kinder → sie.", ru: "Чтобы текст не звучал скучно, существительные заменяют местоимениями: der Hund → er, die Katze → sie, das Pferd → es, die Kinder → sie." },
      { typ: "luecke", e: "🐕", satz: "Der Hund bellt. ___ will spielen.", optionen: ["Er", "Sie", "Es"], ru: "Собака лает. Она хочет играть." },
      { typ: "luecke", e: "🐈", satz: "Die Katze schläft. ___ ist müde.", optionen: ["Sie", "Er", "Es"], ru: "Кошка спит. Она устала." },
      { typ: "luecke", e: "🐎", satz: "Das Pferd läuft. ___ ist schnell.", optionen: ["Es", "Er", "Sie"], ru: "Лошадь бежит. Она быстрая." },
      { typ: "luecke", e: "👧👦", satz: "Lena und Ben spielen. ___ lachen laut.", optionen: ["Sie", "Er", "Wir"], ru: "Лена и Бен играют. Они громко смеются." },
      { typ: "luecke", e: "🙋", satz: "Mein Bruder und ich gehen schwimmen. ___ freuen uns.", optionen: ["Wir", "Ihr", "Sie"], ru: "Мы с братом идём плавать. Мы радуемся." },
      { typ: "luecke", e: "🎁", satz: "Mia, hast ___ dein Geschenk schon ausgepackt?", optionen: ["du", "er", "ich"], ru: "Мия, ты уже распаковала подарок?" },
      { typ: "sag", text: "Prima! Ich, du, er, sie, es, wir, ihr, sie – das sind die Personalpronomen.", ru: "Отлично! Ich, du, er, sie, es, wir, ihr, sie — это личные местоимения." }
    ]
  },
  {
    id: "w-komma", stufe: 3, lz: ["de.sc.05"], name: "Komma bei Aufzählungen", ort: "📝", farbe: "#E8A33D", grund: "#FFF1D9",
    schritte: [
      { typ: "sag", text: "Zählst du Dinge auf, kommt zwischen sie ein Komma. Vor „und“ und „oder“ steht kein Komma: Ich esse Äpfel, Birnen und Bananen.", ru: "При перечислении между словами ставят запятую. Перед „und“ и „oder“ запятой нет: Ich esse Äpfel, Birnen und Bananen." },
      { typ: "luecke", e: "🍎🍐🍌", satz: "Ich kaufe Äpfel___ Birnen und Bananen.", optionen: [",", ".", "!"], ru: "Я покупаю яблоки, груши и бананы." },
      { typ: "luecke", e: "🐶🐱🐰", satz: "Wir haben einen Hund, eine Katze ___ einen Hasen.", optionen: ["und", ",", "."], ru: "У нас есть собака, кошка и кролик." },
      { typ: "luecke", e: "🎨", satz: "Ich male mit Rot, Gelb___ Grün und Blau.", optionen: [",", "und", "."], ru: "Я рисую красным, жёлтым, зелёным и синим." },
      { typ: "luecke", e: "🍦", satz: "Möchtest du Erdbeere, Vanille ___ Schokolade?", optionen: ["oder", ",", "."], ru: "Хочешь клубничное, ванильное или шоколадное?" },
      { typ: "luecke", e: "📅", satz: "Am Montag___ Dienstag und Freitag habe ich Sport.", optionen: [",", "!", "?"], ru: "В понедельник, вторник и пятницу у меня спорт." },
      { typ: "sag", text: "Toll! Merke: Komma zwischen die Glieder der Aufzählung – aber nicht vor und, oder.", ru: "Здорово! Запомни: запятая между частями перечисления — но не перед und, oder." }
    ]
  },
  {
    id: "w-vornach", stufe: 3, lz: ["de.su.08"], name: "Vorsilben und Nachsilben", ort: "🧱", farbe: "#5DB84A", grund: "#E3F5DC",
    schritte: [
      { typ: "sag", text: "Mit Bausteinen entstehen neue Wörter. Vorsilben stehen vorn: un-, ver-, vor-. Nachsilben stehen hinten: -ung, -heit, -keit. Wörter mit -ung, -heit, -keit sind Nomen und werden großgeschrieben.", ru: "Из «кирпичиков» получаются новые слова. Приставки стоят спереди: un-, ver-, vor-. Суффиксы сзади: -ung, -heit, -keit. Слова с -ung, -heit, -keit — существительные, их пишут с большой буквы." },
      { typ: "luecke", e: "😢", satz: "Das Gegenteil von glücklich ist ___glücklich.", optionen: ["un", "ver", "vor"], ru: "Противоположность «счастливый» — «несчастный» (unglücklich)." },
      { typ: "luecke", e: "🤞", satz: "hoffen → die Hoff___", optionen: ["nung", "heit", "keit"], ru: "надеяться → надежда (die Hoffnung)." },
      { typ: "luecke", e: "🕊️", satz: "frei → die Frei___", optionen: ["heit", "ung", "keit"], ru: "свободный → свобода (die Freiheit)." },
      { typ: "luecke", e: "😊", satz: "freundlich → die Freundlich___", optionen: ["keit", "heit", "ung"], ru: "дружелюбный → дружелюбие (die Freundlichkeit)." },
      { typ: "luecke", e: "📖", satz: "Die Lehrerin ___liest eine Geschichte.", optionen: ["vor", "un", "heit"], ru: "Учительница читает вслух историю." },
      { typ: "luecke", e: "🔑", satz: "Ich habe meinen Schlüssel ___loren.", optionen: ["ver", "un", "vor"], ru: "Я потерял ключ." },
      { typ: "sag", text: "Klasse! Wer die Bausteine kennt, kann lange Wörter leichter lesen und richtig schreiben.", ru: "Класс! Кто знает «кирпичики», тот легче читает длинные слова и пишет их правильно." }
    ]
  },
  {
    id: "w-faelle", stufe: 4, lz: ["de.su.11"], name: "Wer, wen, wem?", ort: "❔", farbe: "#7B55B8", grund: "#EFE6FF",
    schritte: [
      { typ: "sag", text: "Mit Fragen findest du den Fall: Wer? (der Hund) – Wen? (den Hund) – Wem? (dem Hund). Der Artikel verändert sich.", ru: "Вопросами можно найти падеж: Wer? (der Hund) – Wen? (den Hund) – Wem? (dem Hund). Артикль меняется." },
      { typ: "luecke", e: "🐕", satz: "Ich sehe ___ Hund. (Wen sehe ich?)", optionen: ["den", "der", "dem"], ru: "Я вижу собаку." },
      { typ: "luecke", e: "⚽", satz: "Der Ball gehört ___ Jungen. (Wem gehört er?)", optionen: ["dem", "den", "der"], ru: "Мяч принадлежит мальчику." },
      { typ: "luecke", e: "🐈", satz: "Ich gebe ___ Katze Futter. (Wem?)", optionen: ["der", "die", "das"], ru: "Я даю кошке корм." },
      { typ: "luecke", e: "👨‍🍳", satz: "___ Koch kocht Suppe. (Wer kocht?)", optionen: ["Der", "Den", "Dem"], ru: "Повар варит суп." },
      { typ: "luecke", e: "❓", satz: "___ hilfst du? – Ich helfe meiner Oma.", optionen: ["Wem", "Wen", "Wer"], ru: "Кому ты помогаешь? — Бабушке." },
      { typ: "luecke", e: "🚲", satz: "Wir besuchen ___ Onkel. (Wen?)", optionen: ["den", "dem", "der"], ru: "Мы навещаем дядю." },
      { typ: "sag", text: "Super! Wer-Fall (1. Fall), Wen-Fall (4. Fall), Wem-Fall (3. Fall). Frag einfach mit dem passenden Fragewort.", ru: "Супер! Wer — 1-й падеж, Wen — 4-й, Wem — 3-й. Просто задай подходящий вопрос." }
    ]
  },
  {
    id: "w-meinung", stufe: 3, lz: ["de.sz.06"], name: "Meinung sagen – mit weil", ort: "💭", farbe: "#E0574A", grund: "#FFECE8",
    schritte: [
      { typ: "sag", text: "Eine Meinung überzeugt besser mit Grund. Sag, was du denkst, und dann „weil …“: Ich finde Hunde toll, weil sie treu sind.", ru: "Мнение убеждает лучше с причиной. Скажи, что думаешь, и потом „weil …“: Ich finde Hunde toll, weil sie treu sind." },
      { typ: "luecke", e: "🌳", satz: "Ich spiele gern draußen, ___ ich dort rennen kann.", optionen: ["weil", "aber", "oder"], ru: "Я люблю играть на улице, потому что там можно бегать." },
      { typ: "luecke", e: "🧹", satz: "Ich finde Aufräumen wichtig, weil ich dann ___.", optionen: ["alles schneller finde", "Eis mag", "blau bin"], ru: "Я считаю уборку важной, потому что так всё быстрее нахожу." },
      { typ: "luecke", e: "📵", satz: "Handys beim Essen finde ich nicht gut, weil wir dann ___.", optionen: ["weniger miteinander reden", "schneller wachsen", "Wolken sehen"], ru: "Телефоны за едой — плохо, потому что тогда мы меньше разговариваем." },
      { typ: "luecke", e: "🐶", satz: "Ich möchte einen Hund, ___ ich viel mit ihm spazieren gehen würde.", optionen: ["weil", "oder", "und dann aber"], ru: "Я хочу собаку, потому что я бы много с ней гулял." },
      { typ: "satz", e: "📚", woerter: ["Ich", "lese", "gern,", "weil", "Bücher", "spannend", "sind."], ru: "Я люблю читать, потому что книги интересные." },
      { typ: "sag", text: "Prima! Im Gespräch gilt auch: zuhören, ausreden lassen und andere Meinungen respektieren.", ru: "Отлично! В разговоре важно слушать, давать договорить и уважать чужое мнение." }
    ]
  },
  {
    id: "w-geschichte-ordnen", stufe: 3, lz: ["de.sc.07"], name: "Eine Geschichte ordnen", ort: "📖", farbe: "#C2337A", grund: "#FDEAF3",
    schritte: [
      { typ: "sag", text: "Eine gute Geschichte hat drei Teile: Die Einleitung sagt, wer, wann und wo. Im Hauptteil passiert das Spannende. Der Schluss erzählt, wie alles ausgeht.", ru: "У хорошего рассказа три части: вступление говорит, кто, когда и где. В основной части происходит самое интересное. Концовка рассказывает, чем всё закончилось." },
      { typ: "ordnen", e: "🎈", frage: "Bring die Geschichte in die richtige Reihenfolge!", teile: ["Am Sonntag war Lena mit Opa im Park.", "Plötzlich flog ihr roter Luftballon davon.", "Opa kletterte auf eine Bank und fing die Schnur.", "Lena lachte und hielt den Ballon ganz fest."], ru: "Расставь части истории по порядку." },
      { typ: "luecke", e: "🏰", satz: "„Es war einmal ein kleiner Drache.“ Dieser Satz gehört in die ___.", optionen: ["Einleitung", "Hauptteil", "Schluss"], ru: "«Жил-был маленький дракон». Это предложение — из вступления." },
      { typ: "ordnen", e: "🐱", frage: "Was passiert zuerst? Ordne die Geschichte!", teile: ["Eines Morgens saß eine Katze auf unserem Dach.", "Sie miaute laut und traute sich nicht herunter.", "Papa holte die lange Leiter aus dem Keller.", "Vorsichtig trug er die Katze nach unten.", "Seitdem besucht sie uns jeden Tag."], ru: "Что случилось сначала? Расставь историю по порядку." },
      { typ: "luecke", e: "⚡", satz: "Im ___ passiert das Spannendste.", optionen: ["Hauptteil", "Schluss", "Datum"], ru: "Самое интересное происходит в основной части." },
      { typ: "ordnen", e: "📝", frage: "So schreibst du eine Geschichte. Was machst du zuerst?", teile: ["Ideen sammeln", "Reihenfolge planen", "Geschichte schreiben", "Text noch einmal lesen und verbessern"], ru: "Так пишут рассказ. Что делать сначала? Собрать идеи, спланировать порядок, написать, перечитать и исправить." },
      { typ: "luecke", e: "🔚", satz: "„Müde, aber glücklich gingen alle nach Hause.“ Das ist ein guter ___.", optionen: ["Schluss", "Anfang", "Titel"], ru: "«Усталые, но счастливые, все пошли домой». Это хорошая концовка." },
      { typ: "sag", text: "Super, {name}! Erst planen, dann schreiben, dann überarbeiten – so machen es auch echte Autorinnen und Autoren.", ru: "Супер! Сначала спланировать, потом написать, потом исправить — так делают и настоящие писатели." }
    ]
  },
  {
    id: "w-satzanfaenge", stufe: 3, lz: ["de.sc.07"], name: "Abwechslungsreiche Satzanfänge", ort: "✏️", farbe: "#2E9C5A", grund: "#E3F7EF",
    schritte: [
      { typ: "sag", text: "Wenn jeder Satz mit „Dann“ anfängt, wird es langweilig. Besser klingen: Danach, Plötzlich, Später, Zum Schluss, Am Abend.", ru: "Если каждое предложение начинается с «Dann», становится скучно. Лучше звучат: Danach, Plötzlich, Später, Zum Schluss, Am Abend." },
      { typ: "verbessern", e: "🍰", frage: "Hier steht zweimal „dann“. Tippe das zweite „dann“ an!", satz: "Wir aßen Kuchen. Dann spielten wir Fangen und dann gingen wir nach Hause.", falsch: "dann", stelle: 8, optionen: ["danach", "weil", "oder"], tipp: "Genau, das „dann“ wiederholt sich. Welches Wort klingt besser?", ru: "Здесь дважды «dann». Найди второе и замени его." },
      { typ: "verbessern", e: "⛈️", frage: "Welches Wort am Satzanfang kannst du spannender machen?", satz: "Dann fing es an zu donnern.", falsch: "Dann", optionen: ["Plötzlich", "Und", "Aber"], tipp: "Richtig! Mit welchem Wort wird es spannender?", ru: "Какое слово в начале можно сделать интереснее? «Plötzlich» — «вдруг»." },
      { typ: "verbessern", e: "🌙", satz: "Wir spielten den ganzen Tag. Dann gingen wir müde ins Bett.", falsch: "Dann", optionen: ["Am Abend", "Gestern früh", "Weil"], tipp: "Genau! Sag lieber, wann es war.", ru: "Найди скучное начало и скажи лучше, когда это было: «Am Abend» — «вечером»." },
      { typ: "verbessern", e: "🎨", frage: "Ein Name kommt zu oft vor. Tippe den letzten an!", satz: "Mia malt ein Bild. Mia malt einen Baum. Mia malt eine Sonne.", falsch: "Mia", stelle: 8, optionen: ["Sie", "Er", "Es"], tipp: "Genau! Statt „Mia“ kannst du ein Fürwort nehmen.", ru: "Имя повторяется слишком часто. Вместо «Mia» можно сказать «Sie» — «она»." },
      { typ: "luecke", e: "🏁", satz: "Am Ende der Geschichte passt gut: „___ waren alle froh.“", optionen: ["Zum Schluss", "Zuerst", "Am Anfang"], ru: "В конце истории подходит: «В конце все были рады»." },
      { typ: "luecke", e: "🔍", satz: "Wenn du deinen Text überarbeitest, suchst du nach Wörtern, die sich ___.", optionen: ["wiederholen", "reimen", "verstecken"], ru: "Когда исправляешь текст, ищешь слова, которые повторяются." },
      { typ: "sag", text: "Klasse! Lies deinen Text immer noch einmal durch und ersetze Wörter, die zu oft vorkommen.", ru: "Класс! Всегда перечитывай свой текст и заменяй слова, которые встречаются слишком часто." }
    ]
  },
  {
    id: "w-brief", stufe: 3, lz: ["de.sc.06", "de.sc.09"], name: "Einen Brief schreiben", ort: "✉️", farbe: "#E8A33D", grund: "#FFF1D9",
    schritte: [
      { typ: "sag", text: "Ein Brief hat feste Teile: oben rechts Ort und Datum, dann die Anrede mit Komma, dann dein Text, zum Schluss ein Gruß und dein Name.", ru: "У письма есть постоянные части: вверху справа место и дата, потом обращение с запятой, потом твой текст, в конце прощание и твоё имя." },
      { typ: "ordnen", e: "✉️", frage: "Bring die Teile des Briefes in die richtige Reihenfolge!", teile: ["Dresden, 3. Mai", "Liebe Oma,", "vielen Dank für das tolle Buch!", "Viele Grüße", "deine Mia"], ru: "Расставь части письма по порядку: место и дата, обращение, текст, прощание, имя." },
      { typ: "luecke", e: "👵", satz: "Nach der Anrede „Liebe Oma“ steht ein ___.", optionen: ["Komma", "Fragezeichen", "Ausrufezeichen und Smiley"], ru: "После обращения «Liebe Oma» ставится запятая." },
      { typ: "verbessern", e: "✏️", frage: "In der Anrede ist ein Fehler. Tippe das Wort an!", satz: "lieber Tom, wie geht es dir?", falsch: "lieber", optionen: ["Lieber", "Liber", "Leiber"], tipp: "Richtig! Die Anrede beginnt groß.", ru: "В обращении ошибка: первое слово пишется с большой буквы." },
      { typ: "luecke", e: "👩‍🏫", satz: "An die Lehrerin schreibst du höflich: „Können ___ mir bitte helfen?“", optionen: ["Sie", "du", "ihr"], ru: "Учительнице пишут вежливо: «Können Sie mir bitte helfen?»" },
      { typ: "luecke", e: "🤝", satz: "Ein passender Gruß am Ende: „Viele ___“", optionen: ["Grüße", "Hallo", "Tschüss Anfang"], ru: "Подходящее прощание в конце: «Viele Grüße»." },
      { typ: "ordnen", e: "🎉", frage: "Ordne die Einladung!", teile: ["Liebe Jana,", "ich lade dich zu meinem Geburtstag ein.", "Wir feiern am Samstag um 15 Uhr bei mir zu Hause.", "Bitte sag mir bis Freitag Bescheid.", "Dein Paul"], ru: "Расставь приглашение по порядку." },
      { typ: "sag", text: "Prima, {name}! Mit Ort, Datum, Anrede, Text, Gruß und Namen ist dein Brief komplett.", ru: "Отлично! С местом, датой, обращением, текстом, прощанием и именем твоё письмо готово." }
    ]
  },
  {
    id: "w-bericht", stufe: 4, lz: ["de.sc.09"], name: "Ein Bericht: W-Fragen", ort: "📰", farbe: "#2F6FB8", grund: "#E5EFFB",
    schritte: [
      { typ: "sag", text: "Ein Bericht erzählt genau und sachlich, was passiert ist. Er beantwortet die W-Fragen: Wer? Was? Wann? Wo? Wie? Warum? Er steht in der Vergangenheit.", ru: "Отчёт (Bericht) точно и по делу рассказывает, что произошло. Он отвечает на вопросы: кто? что? когда? где? как? почему? Пишется в прошедшем времени." },
      { typ: "luecke", e: "🕗", satz: "„Am Montag um 8 Uhr“ beantwortet die Frage ___", optionen: ["Wann?", "Wo?", "Wer?"], ru: "«В понедельник в 8 часов» отвечает на вопрос «Когда?»." },
      { typ: "luecke", e: "🏫", satz: "„Auf dem Schulhof“ beantwortet die Frage ___", optionen: ["Wo?", "Warum?", "Wie?"], ru: "«На школьном дворе» отвечает на вопрос «Где?»." },
      { typ: "luecke", e: "🧊", satz: "„Weil der Boden glatt war“ beantwortet die Frage ___", optionen: ["Warum?", "Wann?", "Wer?"], ru: "«Потому что пол был скользким» отвечает на вопрос «Почему?»." },
      { typ: "verbessern", e: "🚲", frage: "Ein Bericht steht in der Vergangenheit. Welches Wort passt nicht?", satz: "Gestern stürzt ein Junge mit dem Fahrrad.", falsch: "stürzt", optionen: ["stürzte", "stürzen", "stürzend"], tipp: "Richtig! Das war gestern, also Vergangenheit.", ru: "Отчёт пишется в прошедшем времени. Какое слово не подходит? Правильно: «stürzte»." },
      { typ: "verbessern", e: "🧐", frage: "Ein Bericht ist sachlich. Welches Wort ist zu übertrieben?", satz: "Das Fenster war mega-super-kaputt.", falsch: "mega-super-kaputt", optionen: ["zerbrochen", "toll", "langweilig"], tipp: "Genau! Im Bericht schreibst du ohne Übertreibung.", ru: "Отчёт пишется по делу. Какое слово преувеличивает? Лучше: «zerbrochen» — «разбито»." },
      { typ: "ordnen", e: "📰", frage: "Ordne den Bericht in der Reihenfolge, wie es passiert ist!", teile: ["Am Dienstag fand unser Sportfest statt.", "Zuerst liefen alle Klassen um die Wette.", "Danach gab es Weitsprung und Ballwerfen.", "Am Ende bekamen alle Kinder eine Urkunde."], ru: "Расставь отчёт по порядку событий." },
      { typ: "luecke", e: "💭", satz: "Gefühle wie „Ich fand es so schön!“ gehören ___ in einen Bericht.", optionen: ["nicht", "immer", "zuerst"], ru: "Чувства вроде «Мне было так здорово!» в отчёт не пишут." },
      { typ: "sag", text: "Super! Ein Bericht beantwortet die W-Fragen, ist in der richtigen Reihenfolge und bleibt sachlich.", ru: "Супер! Отчёт отвечает на вопросы, идёт по порядку и остаётся деловым." }
    ]
  },
  {
    id: "w-woerterbuch", stufe: 3, lz: ["de.sc.09", "de.sc.04"], name: "Im Wörterbuch suchen", ort: "🔤", farbe: "#7B55B8", grund: "#EFE6FF",
    schritte: [
      { typ: "sag", text: "Im Wörterbuch stehen die Wörter nach dem ABC. Zuerst zählt der erste Buchstabe. Ist er gleich, schaust du auf den zweiten, dann auf den dritten.", ru: "В словаре слова стоят по алфавиту. Сначала смотрят на первую букву. Если она одинаковая — на вторую, потом на третью." },
      { typ: "ordnen", e: "🍎", frage: "Ordne nach dem ABC! Schau auf den ersten Buchstaben.", teile: ["Apfel", "Birne", "Kirsche", "Pflaume", "Zitrone"], ru: "Расставь по алфавиту: смотри на первую букву." },
      { typ: "ordnen", e: "🏠", frage: "Alle beginnen mit H. Schau auf den zweiten Buchstaben!", teile: ["Hase", "Hemd", "Himmel", "Hose", "Hund"], ru: "Все начинаются на H. Смотри на вторую букву." },
      { typ: "ordnen", e: "🐟", frage: "Jetzt wird es knifflig: erster und zweiter Buchstabe sind gleich!", teile: ["Bach", "Ball", "Bank", "Baum"], ru: "Теперь сложно: первая и вторая буквы одинаковые. Смотри на третью." },
      { typ: "luecke", e: "🏃", satz: "„lief“ findest du im Wörterbuch unter ___.", optionen: ["laufen", "lief", "Lauf"], ru: "«lief» ищут в словаре под словом «laufen» (неопределённая форма)." },
      { typ: "luecke", e: "🌳", satz: "„Bäume“ findest du im Wörterbuch unter ___.", optionen: ["Baum", "Bäume", "bäumen"], ru: "«Bäume» ищут под словом «Baum» (единственное число)." },
      { typ: "luecke", e: "🌡️", satz: "„kälter“ findest du im Wörterbuch unter ___.", optionen: ["kalt", "kälter", "Kälte am"], ru: "«kälter» ищут под словом «kalt» (основная форма)." },
      { typ: "luecke", e: "📘", satz: "Welches Wort steht im Wörterbuch weiter vorn? ___", optionen: ["Maus", "Mund", "Mutter"], ru: "Какое слово стоит в словаре раньше? «Maus»." },
      { typ: "sag", text: "Klasse, {name}! Verben suchst du in der Grundform, Nomen in der Einzahl und Wiewörter in der Grundstufe.", ru: "Класс! Глаголы ищут в неопределённой форме, существительные — в единственном числе, прилагательные — в основной форме." }
    ]
  },
  {
    id: "w-vortrag", stufe: 4, lz: ["de.sz.07", "de.sz.05"], name: "Einen Vortrag vorbereiten", ort: "🎤", farbe: "#E0574A", grund: "#FFECE8",
    schritte: [
      { typ: "sag", text: "Bei einem Vortrag erzählst du anderen etwas, das du weißt. Auf einen Stichwortzettel schreibst du nur wichtige Wörter, keine ganzen Sätze.", ru: "Во время доклада ты рассказываешь другим то, что знаешь. На листок-шпаргалку пишут только важные слова, а не целые предложения." },
      { typ: "ordnen", e: "🦊", frage: "Ordne den Stichwortzettel für einen Vortrag über den Fuchs!", teile: ["Thema: der Fuchs", "Aussehen: rotes Fell, buschiger Schwanz", "Nahrung: Mäuse, Beeren, Käfer", "Wohnung: Bau unter der Erde", "Schluss: Habt ihr Fragen?"], ru: "Расставь шпаргалку для доклада о лисе по порядку." },
      { typ: "luecke", e: "🗒️", satz: "Auf den Stichwortzettel schreibst du ___.", optionen: ["nur wichtige Wörter", "den ganzen Text", "gar nichts"], ru: "На шпаргалку пишут только важные слова." },
      { typ: "luecke", e: "👀", satz: "Beim Vortrag schaust du ___.", optionen: ["die Zuhörer an", "auf den Boden", "aus dem Fenster"], ru: "Во время доклада смотрят на слушателей." },
      { typ: "verbessern", e: "🗣️", frage: "Ein Tipp ist falsch. Tippe das Wort an!", satz: "Sprich laut und schnell.", falsch: "schnell", optionen: ["langsam", "leise", "flüsternd"], tipp: "Richtig! Was ist besser beim Vortragen?", ru: "Один совет неправильный: говори громко и медленно." },
      { typ: "luecke", e: "🖼️", satz: "Ein Bild oder ein Plakat hilft, weil die Zuhörer etwas ___ können.", optionen: ["sehen", "essen", "verlieren"], ru: "Картинка или плакат помогают, потому что слушатели могут что-то увидеть." },
      { typ: "ordnen", e: "🎤", frage: "So bereitest du einen Vortrag vor. Was kommt zuerst?", teile: ["Thema wählen", "Informationen sammeln", "Stichwortzettel schreiben", "Zu Hause laut üben", "Vortrag halten"], ru: "Как готовить доклад: выбрать тему, собрать информацию, написать шпаргалку, потренироваться вслух, выступить." },
      { typ: "sag", text: "Toll! Übe deinen Vortrag vorher laut, zum Beispiel vor deiner Familie oder vor dem Spiegel.", ru: "Здорово! Потренируй доклад заранее вслух, например перед семьёй или перед зеркалом." }
    ]
  },
  {
    id: "w-fachbegriffe", stufe: 5, lz: ["de.su.13", "de.su.04", "de.su.10"], name: "Fachbegriffe für Klasse 5", ort: "🎒", farbe: "#2F6FB8", grund: "#E5EFFB",
    schritte: [
      { typ: "sag", text: "In Klasse 5 hörst du oft Fachbegriffe. Namenwörter heißen Nomen oder Substantive, Tunwörter Verben, Wiewörter Adjektive. Die kennst du schon – nur mit neuem Namen!", ru: "В 5-м классе часто звучат научные термины. Существительные называют Nomen или Substantive, глаголы — Verben, прилагательные — Adjektive. Ты их уже знаешь — только под новым названием!" },
      { typ: "luecke", e: "🐕", satz: "„Hund“ ist ein ___.", optionen: ["Substantiv", "Verb", "Adjektiv"], ru: "«Hund» — существительное (Substantiv)." },
      { typ: "luecke", e: "🏃", satz: "„laufen“ ist ein ___.", optionen: ["Verb", "Substantiv", "Pronomen"], ru: "«laufen» — глагол (Verb)." },
      { typ: "luecke", e: "⚡", satz: "„schnell“ ist ein ___.", optionen: ["Adjektiv", "Artikel", "Verb"], ru: "«schnell» — прилагательное (Adjektiv)." },
      { typ: "luecke", e: "👥", satz: "„er, sie, es, wir“ sind ___.", optionen: ["Pronomen", "Präpositionen", "Artikel"], ru: "«er, sie, es, wir» — местоимения (Pronomen)." },
      { typ: "luecke", e: "📦", satz: "„auf, unter, neben, in“ sind ___.", optionen: ["Präpositionen", "Pronomen", "Adjektive"], ru: "«auf, unter, neben, in» — предлоги (Präpositionen)." },
      { typ: "luecke", e: "🔤", satz: "„der, die, das, ein“ sind ___.", optionen: ["Artikel", "Verben", "Präpositionen"], ru: "«der, die, das, ein» — артикли (Artikel)." },
      { typ: "luecke", e: "🐶", satz: "Im Satz „Der Hund bellt.“ ist „Der Hund“ das ___.", optionen: ["Subjekt", "Prädikat", "Adjektiv"], ru: "В предложении «Der Hund bellt.» «Der Hund» — подлежащее (Subjekt)." },
      { typ: "luecke", e: "📢", satz: "Im Satz „Der Hund bellt.“ ist „bellt“ das ___.", optionen: ["Prädikat", "Subjekt", "Artikel"], ru: "В предложении «Der Hund bellt.» «bellt» — сказуемое (Prädikat)." },
      { typ: "sag", text: "Super, {name}! Leg dir in Klasse 5 eine kleine Liste mit den Fachbegriffen an. Dann hast du sie immer dabei.", ru: "Супер! Заведи себе в 5-м классе маленький список терминов. Тогда они всегда будут под рукой." }
    ]
  },
  {
    id: "w-lesestrategien", stufe: 5, lz: ["de.le.08", "de.le.07"], name: "Lesestrategien", ort: "🔍", farbe: "#7B55B8", grund: "#EFE6FF",
    schritte: [
      { typ: "sag", text: "Lange Sachtexte verstehst du besser mit einem Plan: erst Überschrift und Bilder ansehen, dann lesen, unbekannte Wörter klären, Schlüsselwörter finden und jeden Abschnitt kurz zusammenfassen.", ru: "Длинные научные тексты понятнее, если есть план: сначала посмотреть заголовок и картинки, потом читать, выяснить незнакомые слова, найти ключевые слова и коротко пересказать каждый абзац." },
      { typ: "ordnen", e: "🗺️", frage: "Bring die Lesestrategie in die richtige Reihenfolge!", teile: ["Überschrift und Bilder ansehen: Worum geht es?", "Den Text einmal ganz lesen", "Unbekannte Wörter klären", "Schlüsselwörter markieren", "Jeden Abschnitt in einem Satz zusammenfassen"], ru: "Расставь шаги чтения по порядку." },
      { typ: "sag", text: "Lies diesen Text: Die Honigbiene. Honigbienen leben in einem Volk mit bis zu 50 000 Tieren. Es gibt eine Königin, viele Arbeiterinnen und im Sommer auch Drohnen. Die Arbeiterinnen sammeln Nektar und Blütenstaub. Aus dem Nektar machen sie im Stock Honig. Dabei bestäuben sie die Blüten – so wachsen Äpfel, Kirschen und viele andere Früchte.", ru: "Прочитай текст: Медоносная пчела. Пчёлы живут семьёй до 50 000 особей. Есть матка, много рабочих пчёл, а летом ещё и трутни. Рабочие пчёлы собирают нектар и пыльцу. Из нектара в улье они делают мёд. При этом они опыляют цветы — так растут яблоки, вишни и многие другие плоды." },
      { typ: "luecke", e: "🐝", satz: "Ein Schlüsselwort aus dem Text ist ___.", optionen: ["Nektar", "dabei", "viele"], ru: "Ключевое слово из текста — «Nektar» (нектар)." },
      { typ: "luecke", e: "👑", satz: "In einem Bienenvolk gibt es eine ___.", optionen: ["Königin", "Kaiserin", "Lehrerin"], ru: "В пчелиной семье есть одна матка (Königin)." },
      { typ: "luecke", e: "🍯", satz: "Honig machen die Bienen aus ___.", optionen: ["Nektar", "Wasser", "Blättern"], ru: "Мёд пчёлы делают из нектара." },
      { typ: "luecke", e: "🍎", satz: "Welche Überschrift passt zum letzten Satz? „___“", optionen: ["Bienen helfen den Früchten", "Bienen schlafen im Winter", "Wie ein Stock gebaut ist"], ru: "Какой заголовок подходит к последнему предложению? «Пчёлы помогают плодам»." },
      { typ: "verbessern", e: "📝", frage: "In dieser Zusammenfassung steht etwas Falsches. Tippe das Wort an!", satz: "Honigbienen leben allein und sammeln Nektar.", falsch: "allein", optionen: ["im Volk", "im Wasser", "im Winter"], tipp: "Richtig! Was steht im Text?", ru: "В пересказе ошибка: пчёлы живут не поодиночке, а семьёй." },
      { typ: "sag", text: "Klasse, {name}! Mit dieser Strategie schaffst du auch lange Texte in Erdkunde, Biologie und Geschichte.", ru: "Класс! С этой стратегией ты справишься и с длинными текстами по географии, биологии и истории." }
    ]
  }
];
