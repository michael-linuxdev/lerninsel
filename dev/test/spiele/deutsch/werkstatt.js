// Fipsis Wörter-Werkstatt: Übungskapitel nach Lehrplan (Sachsen Kl. 1/2: Sprache untersuchen, Richtig schreiben; NA-36: Kl. 3–4).
// stufe (optional): Klasse, für die das Kapitel gedacht ist; angezeigt wird es ab der Klasse davor (Kl. 3-Kapitel also ab Kl. 2).
// Gleiche Schritt-Typen wie die Geschichte, dazu:
//   wortart     { wort, e?, richtig: "nomen"|"verb"|"adjektiv", ru }
//   verlaengern { wort: "Hun_", lang: "Hunde", richtig: "d", falsch: "t", e, ru }
//   silben      { wort, teile: ["Ba","na","ne"], e, ru }
//   ordnen      { frage?, teile: [...in richtiger Reihenfolge], e?, ru }   (Paket A: Sätze/Bausteine als Karten ordnen)
//   verbessern  { frage?, satz, falsch, stelle?, optionen: [besser, ...], tipp?, e?, ru }   (Paket A: störendes Wort antippen, ersetzen)
//   sag + gedicht { text, titel?, gedicht: ["Zeile", "", …] }   (Paket D1: Gedicht zeilenweise zeigen und vorlesen; "" = Strophenpause)
//   schreiben   { frage, e? | bilder?: ["🐶⚽", …], woerter?: min. Wörter, saetze?: min. Sätze, pflicht?: [Wörter], karten?: [Wörter zum Einfügen], anfang?, ru }
//               (Paket D1: freies Schreiben über die Bildschirmtastatur; die App prüft nur Länge, Satzanfang groß, Satzzeichen, Pflichtwörter –
//                ohne KI, mit freundlichen Hinweisen; der Text bleibt auf dem Gerät, Eltern sehen ihn im Elternbereich)
//   lb          Lernbereich (Lehrplan Sachsen 2025): "sz" Sprechen und Zuhören · "sc" Schreiben · "le" Lesen · "tm" Texte und Medien · "su" Sprache untersuchen
//               (die Werkstatt zeigt die Kapitel danach gruppiert; Schuljahr Deutsch 28.10.2026)
//   hoertext    { e?, text, frage, optionen: [richtig, …], ru }   (Text wird vorgelesen, ohne Stimme steht er zum Lesen da)
//   blitz       { wort, optionen: [richtig, …], ms?, ru }   (Blitzlesen: Wort blitzt kurz auf)
//   schreiben + liste: true   (Einkaufszettel, Elfchen: nur Länge und Pflichtwörter prüfen)
//   aufnehmen   { frage, gedicht? | bilder? | e?, titel?, ru }   (Paket D1: sich selbst aufnehmen und anhören; nur wenn die Eltern es erlauben,
//               sonst wird der Schritt still weggelassen; Aufnahme nur in der eigenen IndexedDB, nie hochgeladen)
window.WERKSTATT = [
  {
    id: "w-verben", lb: "su", lz: ["de.su.04"], name: "Tunwörter", ort: "🏃", farbe: "#E0574A", grund: "#FFECE8",
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
    id: "w-adjektive", lb: "su", lz: ["de.su.04"], name: "Wiewörter", ort: "🌈", farbe: "#3AA0E0", grund: "#E1F3FF",
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
    id: "w-wortarten", lb: "su", lz: ["de.su.04"], name: "Wortarten sortieren", ort: "🗂️", farbe: "#7B55B8", grund: "#EFE6FF",
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
    id: "w-verlaengern", lb: "sc", lz: ["de.sc.04"], name: "d oder t? Verlängern!", ort: "🔍", farbe: "#E8A33D", grund: "#FFF1D9",
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
    id: "w-silben", lb: "le", lz: ["de.su.02", "de.le.03"], name: "Silben klatschen", ort: "👏", farbe: "#2E9C5A", grund: "#E3F7EF",
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
    id: "w-praeteritum", lb: "su", stufe: 3, lz: ["de.su.09"], name: "Heute oder gestern?", ort: "⏳", farbe: "#C2337A", grund: "#FDEAF3",
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
    id: "w-perfekt", lb: "su", stufe: 4, lz: ["de.su.12"], name: "Habe gespielt, werde spielen", ort: "🗓️", farbe: "#2F6FB8", grund: "#E5EFFB",
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
    id: "w-satzglieder", lb: "su", stufe: 3, lz: ["de.su.10"], name: "Wer tut was?", ort: "🧩", farbe: "#2E9C5A", grund: "#E3F7EF",
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
    id: "w-satzzeichen", lb: "sc", stufe: 4, lz: ["de.su.11"], name: "Punkt, Fragezeichen, Ausrufezeichen", ort: "❗", farbe: "#E0574A", grund: "#FFECE8",
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
    id: "w-kurz-lang", lb: "sc", stufe: 3, lz: ["de.sc.08"], name: "ck, tz, ss oder ß?", ort: "🔊", farbe: "#E8A33D", grund: "#FFF1D9",
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
    id: "w-ableiten", lb: "sc", stufe: 3, lz: ["de.sc.04"], name: "ä oder e? äu oder eu?", ort: "🌳", farbe: "#5DB84A", grund: "#E3F5DC",
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
    id: "w-dehnung", lb: "sc", stufe: 3, lz: ["de.sc.08"], name: "Mit h oder ohne?", ort: "🐄", farbe: "#8A6E2F", grund: "#F7F0DD",
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
    id: "w-rede", lb: "sc", stufe: 3, lz: ["de.sc.08", "de.sc.05"], name: "Wörtliche Rede", ort: "💬", farbe: "#3AA0E0", grund: "#E1F3FF",
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
    id: "w-textsorten", lb: "tm", stufe: 3, lz: ["de.tm.04"], name: "Märchen, Fabel, Gedicht", ort: "📚", farbe: "#7B55B8", grund: "#EFE6FF",
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
    id: "w-lesen-igel", lb: "le", stufe: 3, lz: ["de.le.06"], name: "Lesen: Der Igel", ort: "🦔", farbe: "#B5701A", grund: "#FFF1D9",
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
    id: "w-lesen-vergleich", lb: "le", stufe: 4, lz: ["de.le.07"], name: "Lesen: Biber und Otter", ort: "🦫", farbe: "#1F8FB8", grund: "#E2F4FB",
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
    id: "w-steigerung", lb: "su", stufe: 3, lz: ["de.su.04"], name: "groß, größer, am größten", ort: "📏", farbe: "#3AA0E0", grund: "#E1F3FF",
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
    id: "w-pronomen", lb: "su", stufe: 3, lz: ["de.su.04", "de.su.06"], name: "er, sie, es", ort: "👥", farbe: "#C2337A", grund: "#FDEAF3",
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
    id: "w-komma", lb: "sc", stufe: 3, lz: ["de.sc.05"], name: "Komma bei Aufzählungen", ort: "📝", farbe: "#E8A33D", grund: "#FFF1D9",
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
    id: "w-vornach", lb: "su", stufe: 3, lz: ["de.su.08"], name: "Vorsilben und Nachsilben", ort: "🧱", farbe: "#5DB84A", grund: "#E3F5DC",
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
    id: "w-faelle", lb: "su", stufe: 4, lz: ["de.su.11"], name: "Wer, wen, wem?", ort: "❔", farbe: "#7B55B8", grund: "#EFE6FF",
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
    id: "w-meinung", lb: "sz", stufe: 3, lz: ["de.sz.06"], name: "Meinung sagen – mit weil", ort: "💭", farbe: "#E0574A", grund: "#FFECE8",
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
    id: "w-geschichte-ordnen", lb: "sc", stufe: 3, lz: ["de.sc.07"], name: "Eine Geschichte ordnen", ort: "📖", farbe: "#C2337A", grund: "#FDEAF3",
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
    id: "w-satzanfaenge", lb: "sc", stufe: 3, lz: ["de.sc.07"], name: "Abwechslungsreiche Satzanfänge", ort: "✏️", farbe: "#2E9C5A", grund: "#E3F7EF",
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
    id: "w-brief", lb: "sc", stufe: 3, lz: ["de.sc.06", "de.sc.09"], name: "Einen Brief schreiben", ort: "✉️", farbe: "#E8A33D", grund: "#FFF1D9",
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
    id: "w-bericht", lb: "sc", stufe: 4, lz: ["de.sc.09"], name: "Ein Bericht: W-Fragen", ort: "📰", farbe: "#2F6FB8", grund: "#E5EFFB",
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
    id: "w-woerterbuch", lb: "sc", stufe: 3, lz: ["de.sc.09", "de.sc.04"], name: "Im Wörterbuch suchen", ort: "🔤", farbe: "#7B55B8", grund: "#EFE6FF",
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
    id: "w-vortrag", lb: "sz", stufe: 4, lz: ["de.sz.07", "de.sz.05"], name: "Einen Vortrag vorbereiten", ort: "🎤", farbe: "#E0574A", grund: "#FFECE8",
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
    id: "w-fachbegriffe", lb: "su", stufe: 5, lz: ["de.su.13", "de.su.04", "de.su.10"], name: "Fachbegriffe für Klasse 5", ort: "🎒", farbe: "#2F6FB8", grund: "#E5EFFB",
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
    id: "w-lesestrategien", lb: "le", stufe: 5, lz: ["de.le.08", "de.le.07"], name: "Lesestrategien", ort: "🔍", farbe: "#7B55B8", grund: "#EFE6FF",
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
  },
  // ---------- Paket D1: Reime, Gedichte, frei schreiben, sich selbst aufnehmen ----------
  {
    id: "w-reime", lb: "tm", lz: ["de.su.01", "de.tm.03", "de.sz.05"], name: "Reime und Gedichte", ort: "🎵", farbe: "#C2337A", grund: "#FDEAF3",
    schritte: [
      { typ: "sag", text: "Reimwörter klingen am Ende gleich: Haus und Maus, Hund und rund. Hör genau hin, {name}!", ru: "Рифмы звучат в конце одинаково: Haus и Maus, Hund и rund. Слушай внимательно!" },
      { typ: "luecke", e: "🏠", satz: "Haus reimt sich auf ___.", optionen: ["Maus", "Hund", "Baum"], ru: "Haus рифмуется с Maus." },
      { typ: "luecke", e: "🌹", satz: "Rose reimt sich auf ___.", optionen: ["Hose", "Hase", "Tisch"], ru: "Rose рифмуется с Hose." },
      { typ: "luecke", e: "🎂", satz: "Kuchen reimt sich auf ___.", optionen: ["suchen", "Kirsche", "Kanne"], ru: "Kuchen рифмуется с suchen." },
      { typ: "luecke", e: "🌙", satz: "Der Mond scheint hell, die Katze rennt ___.", optionen: ["schnell", "langsam", "weg"], ru: "Луна светит ярко, кошка бежит быстро (hell – schnell)." },
      { typ: "sag", text: "Hör dir mein Gedicht an! Am Ende der Zeilen reimt es sich.", titel: "Der Igel", gedicht: ["Ein Igel geht spazieren,", "er will sich nicht verlieren.", "Er schnuppert hier, er schnuppert dort –", "und schwupp, der Apfel ist gleich fort!"], ru: "Послушай моё стихотворение! В конце строк есть рифма. «Ёжик гуляет, не хочет потеряться. Нюхает тут и там – и хоп, яблока уже нет!»" },
      { typ: "luecke", e: "🦔", satz: "Im Gedicht reimt sich „spazieren“ auf ___.", optionen: ["verlieren", "Apfel", "schnuppert"], ru: "В стихотворении «spazieren» рифмуется с «verlieren»." },
      { typ: "ordnen", e: "🦔", frage: "Bring das Gedicht in die richtige Reihenfolge!", teile: ["Ein Igel geht spazieren,", "er will sich nicht verlieren.", "Er schnuppert hier, er schnuppert dort –", "und schwupp, der Apfel ist gleich fort!"], ru: "Расставь строки стихотворения по порядку." },
      { typ: "aufnehmen", frage: "Jetzt bist du dran! Sag das Gedicht laut auf. Tippe aufs Mikrofon – danach kannst du dich anhören.", titel: "Der Igel", gedicht: ["Ein Igel geht spazieren,", "er will sich nicht verlieren.", "Er schnuppert hier, er schnuppert dort –", "und schwupp, der Apfel ist gleich fort!"], ru: "Теперь ты! Прочитай стихотворение вслух. Нажми на микрофон – потом сможешь себя послушать." },
      { typ: "sag", text: "Super, {name}! Gedichte klingen schön, wenn man langsam spricht und am Ende jeder Zeile kurz Luft holt.", ru: "Супер! Стихи звучат красиво, если говорить медленно и в конце каждой строки делать короткий вдох." }
    ]
  },
  {
    id: "w-einladung", lb: "sc", stufe: 2, lz: ["de.sc.06", "de.sc.05"], name: "Eine Einladung schreiben", ort: "🎈", farbe: "#E8A33D", grund: "#FFF1D9",
    schritte: [
      { typ: "sag", text: "Du feierst ein Fest? Dann schreib eine Einladung! Darin steht: Wozu lädst du ein? Wann ist das Fest? Wo ist es? Und am Ende ein Gruß.", ru: "У тебя праздник? Тогда напиши приглашение! В нём написано: на что ты приглашаешь? Когда праздник? Где? А в конце – привет." },
      { typ: "ordnen", e: "🎂", frage: "Bring die Einladung in die richtige Reihenfolge!", teile: ["Liebe Lena,", "ich lade dich zu meinem Geburtstag ein.", "Wir feiern am Samstag um 15 Uhr.", "Wir treffen uns bei mir zu Hause.", "Viele Grüße, Tom"], ru: "Расставь части приглашения по порядку." },
      { typ: "luecke", e: "⏰", satz: "Wann ist das Fest? ___", optionen: ["Am Samstag um 15 Uhr.", "Bei mir zu Hause.", "Viele Grüße."], ru: "Когда праздник? В субботу в 15 часов." },
      { typ: "luecke", e: "📍", satz: "Wo ist das Fest? ___", optionen: ["Bei mir zu Hause.", "Am Samstag.", "Liebe Lena."], ru: "Где праздник? У меня дома." },
      { typ: "luecke", e: "✉️", satz: "Am Ende der Einladung steht ___.", optionen: ["ein Gruß und dein Name", "die Uhrzeit", "eine Frage"], ru: "В конце приглашения – привет и твоё имя." },
      { typ: "schreiben", e: "🎈", frage: "Jetzt du, {name}! Schreib zwei Sätze für deine Einladung: Wozu lädst du ein? Wann ist das Fest – mit Uhrzeit?", woerter: 8, saetze: 2, pflicht: ["Uhr"], karten: ["Ich lade dich", "Geburtstag", "Fest", "am Samstag", "am Sonntag", "um"], ru: "Теперь ты! Напиши два предложения для приглашения: на что ты приглашаешь? Когда праздник – со временем?" },
      { typ: "sag", text: "Toll! Vergiss nicht: Oben steht die Anrede, zum Beispiel „Liebe Lena,“ – und unten ein Gruß mit deinem Namen.", ru: "Отлично! Не забудь: вверху – обращение, например «Liebe Lena,», а внизу – привет и твоё имя." }
    ]
  },
  {
    id: "w-bildergeschichte", lb: "sc", stufe: 3, lz: ["de.sc.07", "de.sc.05", "de.sz.01"], name: "Eine Bildergeschichte schreiben", ort: "🖼️", farbe: "#2E9C5A", grund: "#E3F7EF",
    schritte: [
      { typ: "sag", text: "Eine Geschichte hat einen Anfang, eine Mitte und ein Ende. Heute schreibst du eine Geschichte zu vier Bildern – über Bello, den Hund, und Lina.", ru: "У истории есть начало, середина и конец. Сегодня ты напишешь историю по четырём картинкам – про собаку Белло и Лину." },
      { typ: "ordnen", e: "🐶", frage: "Was passiert zuerst, was danach? Bring die Sätze in die richtige Reihenfolge!", teile: ["Bello spielt im Garten mit seinem Ball.", "Plötzlich fliegt der Ball in den Baum.", "Bello bellt traurig. Lina hört ihn.", "Lina holt den Ball mit einer Leiter.", "Am Ende freut sich Bello sehr."], ru: "Что происходит сначала, а что потом? Расставь предложения по порядку." },
      { typ: "luecke", e: "⚽", satz: "___ fliegt der Ball in den Baum.", optionen: ["Plötzlich", "Ende", "Weil"], ru: "Вдруг мяч улетает на дерево." },
      { typ: "luecke", e: "😊", satz: "___ freut sich Bello sehr.", optionen: ["Am Ende", "Am Anfang", "Gestern"], ru: "В конце Белло очень радуется." },
      { typ: "schreiben", bilder: ["🐶⚽🌳", "⚽🌳❗", "🐶😢👧", "👧🪜⚽"], frage: "Schreib die Geschichte jetzt mit eigenen Worten! Zu jedem Bild mindestens ein Satz. Die Wörter oben helfen dir.", woerter: 20, saetze: 4, pflicht: ["Ball", "Baum"], karten: ["Bello", "Lina", "Leiter", "Plötzlich", "Dann", "Am Ende"], ru: "Напиши историю своими словами! К каждой картинке хотя бы одно предложение. Слова сверху помогут." },
      { typ: "aufnehmen", bilder: ["🐶⚽🌳", "⚽🌳❗", "🐶😢👧", "👧🪜⚽"], frage: "Erzähl die Geschichte jetzt laut – so, als würdest du sie einem Freund erzählen!", ru: "Теперь расскажи историю вслух – как будто рассказываешь другу!" },
      { typ: "sag", text: "Klasse, {name}! Gute Geschichten haben abwechslungsreiche Satzanfänge: zuerst, dann, plötzlich, zum Schluss.", ru: "Класс! В хороших историях предложения начинаются по-разному: сначала, потом, вдруг, в конце." }
    ]
  },
  {
    id: "w-gedicht-vortragen", lb: "sz", stufe: 3, lz: ["de.sz.05", "de.tm.04"], name: "Ein Gedicht vortragen", ort: "🎭", farbe: "#7B55B8", grund: "#EFE6FF",
    schritte: [
      { typ: "sag", text: "Ein Gedicht vortragen heißt: langsam sprechen, am Ende der Zeile kurz Pause machen, wichtige Wörter betonen und die Zuhörer ansehen.", ru: "Читать стихи наизусть – значит говорить медленно, в конце строки делать паузу, выделять важные слова и смотреть на слушателей." },
      { typ: "sag", text: "Hör dir das Gedicht an. Welche Wörter reimen sich?", titel: "Herbstwind", gedicht: ["Der Herbstwind pustet kalt und laut,", "er hat die Blätter fortgeklaut.", "Sie tanzen rot und gelb im Kreis", "und flüstern leise: Bald wird's weiß!"], ru: "Послушай стихотворение. Какие слова рифмуются? «Осенний ветер дует холодно и громко, он унёс листья. Они кружатся красные и жёлтые и тихо шепчут: скоро будет белым!»" },
      { typ: "luecke", e: "🍂", satz: "„laut“ reimt sich im Gedicht auf ___.", optionen: ["fortgeklaut", "Kreis", "Blätter"], ru: "«laut» рифмуется с «fortgeklaut»." },
      { typ: "luecke", e: "❄️", satz: "„Kreis“ reimt sich auf ___.", optionen: ["weiß", "rot", "leise"], ru: "«Kreis» рифмуется с «weiß»." },
      { typ: "luecke", e: "⏸️", satz: "Am Ende einer Zeile machst du ___.", optionen: ["eine kleine Pause", "ganz schnell weiter", "ein Geräusch"], ru: "В конце строки делаешь маленькую паузу." },
      { typ: "luecke", e: "🤫", satz: "Die Worte „flüstern leise“ sprichst du ___.", optionen: ["leise", "sehr laut", "gar nicht"], ru: "Слова «тихо шепчут» говоришь тихо." },
      { typ: "ordnen", e: "🍂", frage: "Bring das Gedicht in die richtige Reihenfolge!", teile: ["Der Herbstwind pustet kalt und laut,", "er hat die Blätter fortgeklaut.", "Sie tanzen rot und gelb im Kreis", "und flüstern leise: Bald wird's weiß!"], ru: "Расставь строки стихотворения по порядку." },
      { typ: "aufnehmen", frage: "Trag das Gedicht vor! Denk an die Pausen und sprich „leise“ wirklich leise. Danach hörst du dich an.", titel: "Herbstwind", gedicht: ["Der Herbstwind pustet kalt und laut,", "er hat die Blätter fortgeklaut.", "Sie tanzen rot und gelb im Kreis", "und flüstern leise: Bald wird's weiß!"], ru: "Прочитай стихотворение! Помни о паузах и говори «leise» по-настоящему тихо. Потом послушай себя." },
      { typ: "sag", text: "Wunderbar, {name}! Auch Profis üben ein Gedicht viele Male. Probier es ruhig noch einmal vor deiner Familie.", ru: "Чудесно! Даже профессионалы много раз репетируют стихотворение. Попробуй ещё раз перед своей семьёй." }
    ]
  },
  {
    id: "w-buchtipp", lb: "tm", stufe: 4, lz: ["de.tm.05", "de.sz.06", "de.sc.07"], name: "Mein Buchtipp", ort: "📕", farbe: "#E0574A", grund: "#FFECE8",
    schritte: [
      { typ: "sag", text: "Ein Buchtipp verrät: Wie heißt das Buch? Worum geht es – ohne das Ende zu verraten? Und wie findest du es – und warum?", ru: "Совет о книге рассказывает: как называется книга? О чём она – не раскрывая конца? И как она тебе – и почему?" },
      { typ: "ordnen", e: "📕", frage: "Bring den Buchtipp in eine gute Reihenfolge!", teile: ["Mein Buchtipp: „Der Leuchtturm-Hund“", "Darin geht es um einen Hund, der auf einer Insel wohnt.", "Mir gefällt das Buch, weil es spannend und lustig ist.", "Ich empfehle es allen, die Tiere mögen."], ru: "Расставь части совета о книге в хорошем порядке." },
      { typ: "luecke", e: "🤐", satz: "In einen Buchtipp gehört NICHT ___.", optionen: ["das ganze Ende", "der Titel", "deine Meinung"], ru: "В совет о книге НЕ входит весь конец истории." },
      { typ: "verbessern", e: "🔍", frage: "Ein Wort sagt zu wenig. Tippe es an und wähle ein genaueres!", satz: "Das Buch ist gut.", falsch: "gut", optionen: ["spannend", "grün", "laut"], tipp: "Genau! „Gut“ sagt wenig. Was ist das Buch genau?", ru: "Слово «gut» (хорошая) говорит мало. Выбери более точное: «spannend» (захватывающая)." },
      { typ: "luecke", e: "💭", satz: "Ich finde das Buch toll, ___ die Heldin so mutig ist.", optionen: ["weil", "aber", "oder"], ru: "Мне нравится книга, потому что героиня такая смелая." },
      { typ: "schreiben", e: "📕", frage: "Schreib deinen eigenen Buchtipp! Nenne den Titel, sag kurz, worum es geht, und begründe deine Meinung mit „weil“.", woerter: 15, saetze: 3, pflicht: ["weil"], karten: ["Mein Buchtipp:", "Darin geht es um", "Mir gefällt das Buch,", "spannend", "lustig", "Ich empfehle es"], ru: "Напиши свой совет о книге! Назови книгу, коротко скажи, о чём она, и объясни своё мнение со словом «weil» (потому что)." },
      { typ: "aufnehmen", e: "🎤", frage: "Stell dein Buch jetzt als kleinen Vortrag vor! Sprich langsam und deutlich – du kannst deinen Text dabei ablesen.", ru: "Теперь представь свою книгу как маленький доклад! Говори медленно и чётко – можно читать свой текст." },
      { typ: "sag", text: "Prima, {name}! Mit so einem Buchtipp findest du in der Klasse bestimmt Leute, die dein Buch auch lesen wollen.", ru: "Отлично! С таким советом ты наверняка найдёшь в классе ребят, которые тоже захотят прочитать твою книгу." }
    ]
  },
  {
    id: "w-rechengeschichten", lb: "sc", stufe: 2, lz: ["ma.zo.18", "de.sc.06"], name: "Rechengeschichten erfinden", ort: "🧮", farbe: "#2F6FB8", grund: "#E5EFFB",
    schritte: [
      { typ: "sag", text: "Heute erfindest du Rechengeschichten, {name}! Eine Rechengeschichte erzählt, was passiert – und am Ende steht eine Frage, die man ausrechnen kann.", ru: "Сегодня ты придумываешь задачи-истории! История рассказывает, что происходит, а в конце стоит вопрос, который можно посчитать." },
      { typ: "luecke", e: "🐦", satz: "Auf dem Dach sitzen 4 Vögel. 3 kommen dazu. ___", optionen: ["Wie viele Vögel sind es jetzt?", "Wie heißen die Vögel?", "Wo wohnen die Vögel?"], ru: "На крыше сидят 4 птицы. Прилетают ещё 3. Сколько птиц теперь?" },
      { typ: "luecke", e: "➖", satz: "Zu 10 − 2 passt: Tom hat 10 Murmeln. ___", optionen: ["Er verliert 2.", "Er bekommt 2 dazu.", "Er hat 2 Hosen."], ru: "К 10 − 2 подходит: у Тома 10 шариков. Он теряет 2." },
      { typ: "schreiben", e: "➕", frage: "Erfinde eine Rechengeschichte zu 4 + 3! Schreib zwei Sätze: was passiert – und eine Frage am Ende.", woerter: 10, saetze: 2, pflicht: ["4", "3"], karten: ["kommen dazu", "bekommt", "Wie viele", "sind es jetzt?"], ru: "Придумай историю к 4 + 3! Два предложения: что происходит – и вопрос в конце." },
      { typ: "schreiben", e: "➖", frage: "Jetzt eine Minus-Geschichte zu 12 − 5! Denk daran: Bei Minus wird es weniger.", woerter: 10, saetze: 2, pflicht: ["12", "5"], karten: ["gehen weg", "verliert", "isst", "Wie viele", "bleiben übrig?"], ru: "Теперь история с минусом к 12 − 5! При минусе становится меньше." },
      { typ: "schreiben", e: "✖️", frage: "Und eine Mal-Geschichte zu 3 · 5 – zum Beispiel mit Tellern, Tüten oder Reihen.", woerter: 10, saetze: 2, pflicht: ["3", "5"], karten: ["je", "Teller", "Tüten", "Wie viele", "sind es zusammen?"], ru: "И история на умножение к 3 · 5 – например, с тарелками, пакетами или рядами." },
      { typ: "sag", text: "Super, {name}! Lies deine Geschichten jemandem vor – kann er die Frage ausrechnen?", ru: "Супер! Прочитай свои истории кому-нибудь – сможет ли он посчитать ответ?" }
    ]
  }
];
// ---------- Schuljahr Deutsch (Lehrplan Sachsen 2025, Kl. 1/2): ein Kapitel je Lücke aus der Bestandsaufnahme (28.10.2026) ----------
window.WERKSTATT.push(
  {
    id: "w-erzaehlen", lb: "sz", stufe: 2, lz: ["de.sz.01", "de.sz.02"], name: "Erzählen wie ein Profi", ort: "🗣️", farbe: "#E0574A", grund: "#FFECE8",
    schritte: [
      { typ: "sag", text: "Gute Erzähler sagen zuerst, wer dabei war und wo es war. Dann erzählen sie der Reihe nach, was passiert ist – und zum Schluss, wie es ausging.", ru: "Хорошие рассказчики сначала говорят, кто был и где это было. Потом по порядку — что случилось, и в конце — чем всё закончилось." },
      { typ: "ordnen", e: "🎡", frage: "Leo erzählt vom Jahrmarkt. Bring seine Sätze in die richtige Reihenfolge!", teile: ["Am Sonntag war ich mit Papa auf dem Jahrmarkt.", "Zuerst sind wir Karussell gefahren.", "Dann hat Papa mir Zuckerwatte gekauft.", "Zum Schluss habe ich einen Teddy gewonnen."], ru: "Лео рассказывает о ярмарке. Расставь предложения по порядку." },
      { typ: "luecke", e: "👥", satz: "Am Anfang einer Erzählung sagst du, ___.", optionen: ["wer dabei war und wo es war", "wie es ausging", "was du morgen machst"], ru: "В начале рассказа говоришь, кто был и где." },
      { typ: "luecke", e: "➡️", satz: "Damit die Zuhörer folgen können, erzählst du ___.", optionen: ["der Reihe nach", "ganz durcheinander", "nur das Ende"], ru: "Чтобы слушателям было понятно, рассказываешь по порядку." },
      { typ: "luecke", e: "🔗", satz: "Diese Wörter helfen beim Erzählen: zuerst, dann, danach, ___.", optionen: ["zum Schluss", "Hund", "grün"], ru: "Эти слова помогают рассказывать: сначала, потом, после, в конце." },
      { typ: "luecke", e: "😮", satz: "Eine erfundene Geschichte wird spannend mit: „___ hörten wir ein lautes Knacken.“", optionen: ["Plötzlich", "Langweilig", "Gestern Abend um sieben Uhr zwölf"], ru: "Выдуманная история становится интересной с «вдруг»." },
      { typ: "luecke", e: "💬", satz: "Nach einer Erzählung kannst du fragen: „___“", optionen: ["Wie hat dir meine Geschichte gefallen?", "Warum hörst du nicht zu?", "Bist du fertig?"], ru: "После рассказа можно спросить: «Как тебе понравилась моя история?»" },
      { typ: "schreiben", e: "🎉", frage: "Erzähl von einem schönen Erlebnis! Schreib drei Sätze: Wer war dabei, wo wart ihr, was ist passiert?", woerter: 15, saetze: 3, karten: ["Zuerst", "Dann", "Zum Schluss", "Am Wochenende", "war ich mit"], ru: "Расскажи о хорошем событии! Напиши три предложения: кто был, где вы были, что случилось?" },
      { typ: "aufnehmen", e: "🎤", frage: "Erzähl dein Erlebnis jetzt laut – so, als würdest du es deiner Klasse erzählen. Danach hörst du dich an.", ru: "Теперь расскажи о событии вслух — как будто рассказываешь классу. Потом послушай себя." },
      { typ: "sag", text: "Super erzählt, {name}! Erzähl es heute Abend noch einmal deiner Familie – und frag, was sie erlebt haben.", ru: "Отлично рассказано! Расскажи это вечером ещё раз своей семье — и спроси, что было у них." }
    ]
  },
  {
    id: "w-sprechen", lb: "sz", stufe: 2, lz: ["de.sz.02", "de.sz.05"], name: "Deutlich sprechen und fragen", ort: "📣", farbe: "#3AA0E0", grund: "#E1F3FF",
    schritte: [
      { typ: "sag", text: "Wenn du etwas sagst, sollen dich alle verstehen. Dafür stehst du gerade, schaust die anderen an und sprichst laut genug und nicht zu schnell.", ru: "Когда ты говоришь, тебя должны понимать все. Для этого стой прямо, смотри на других, говори достаточно громко и не слишком быстро." },
      { typ: "luecke", e: "🧍", satz: "Wenn du vor der Klasse sprichst, ___.", optionen: ["stehst du gerade und schaust die anderen an", "drehst du dich zur Wand", "flüsterst du ganz leise"], ru: "Когда говоришь перед классом, стоишь прямо и смотришь на других." },
      { typ: "luecke", e: "🐢", satz: "Wer sehr schnell spricht, ___.", optionen: ["wird schlecht verstanden", "wird besser verstanden", "muss nichts erklären"], ru: "Кто говорит очень быстро, того плохо понимают." },
      { typ: "luecke", e: "❓", satz: "Mit einer W-Frage erfährst du mehr: „___ fährt der Bus ab?“", optionen: ["Wann", "Ob", "Und"], ru: "Вопросом с W узнаёшь больше: «Когда уходит автобус?»" },
      { typ: "luecke", e: "📍", satz: "Du suchst die Turnhalle. Du fragst: „___“", optionen: ["Wo ist bitte die Turnhalle?", "Turnhalle!", "Ich weiß es."], ru: "Ты ищешь спортзал. Спрашиваешь: «Где, пожалуйста, спортзал?»" },
      { typ: "luecke", e: "🧦", satz: "Eine genaue Beschreibung: „Meine Mütze ist ___.“", optionen: ["rot mit einem weißen Bommel", "irgendwie da", "schön"], ru: "Точное описание: «Моя шапка красная с белым помпоном»." },
      { typ: "luecke", e: "🧑‍🏫", satz: "Du erklärst ein Spiel. Zuerst sagst du, ___.", optionen: ["was man dafür braucht", "wer gewonnen hat", "dass es langweilig ist"], ru: "Ты объясняешь игру. Сначала говоришь, что для неё нужно." },
      { typ: "luecke", e: "🎭", satz: "Beim Theaterspielen zeigen ___ den Zuschauern, wer du bist.", optionen: ["Kostüm und Stimme", "nur die Schuhe", "die Eintrittskarten"], ru: "При игре в театр костюм и голос показывают зрителям, кто ты." },
      { typ: "aufnehmen", e: "🎲", frage: "Erklär dein Lieblingsspiel: Was braucht man? Wie geht es? Wer gewinnt? Sprich langsam und deutlich.", ru: "Объясни свою любимую игру: что нужно, как играть, кто выигрывает? Говори медленно и чётко." },
      { typ: "sag", text: "Klasse, {name}! Deutlich sprechen und genau fragen – damit kommst du überall weiter.", ru: "Класс! Говорить чётко и точно спрашивать — с этим ты везде справишься." }
    ]
  },
  {
    id: "w-sprachen", lb: "su", stufe: 2, lz: ["de.su.03", "de.sz.02"], name: "Viele Sprachen, viele Wörter", ort: "🌍", farbe: "#2E9C5A", grund: "#E3F7EF",
    schritte: [
      { typ: "sag", text: "In deiner Klasse sprechen Kinder vielleicht mehrere Sprachen. Und auch im Deutschen gibt es viele Arten zu sprechen: zu Hause, auf dem Schulhof, im Unterricht – und im Dialekt.", ru: "В твоём классе дети, может быть, говорят на нескольких языках. И в немецком есть разные способы говорить: дома, на школьном дворе, на уроке — и на диалекте." },
      { typ: "luecke", e: "👋", satz: "„Hallo“ heißt auf Englisch „hello“, auf Russisch „privet“ und auf Türkisch „merhaba“. Das zeigt: ___", optionen: ["Viele Sprachen sagen dasselbe anders.", "Nur Deutsch ist richtig.", "Alle Sprachen sind gleich."], ru: "«Привет» по-английски hello, по-русски привет, по-турецки merhaba. Это показывает: многие языки говорят одно и то же по-разному." },
      { typ: "luecke", e: "🥪", satz: "In Sachsen sagen manche zum Brot mit Belag „Bemme“. So ein Wort aus einer Gegend heißt ___.", optionen: ["Dialektwort", "Fremdwort", "Tunwort"], ru: "В Саксонии некоторые называют бутерброд «Bemme». Такое местное слово — диалектное." },
      { typ: "luecke", e: "🏫", satz: "Auf dem Schulhof: „Gib mal her!“ Im Unterricht sagst du besser: „___“", optionen: ["Kannst du mir bitte das Buch geben?", "Her damit!", "Gib!"], ru: "На дворе: «Дай сюда!» На уроке лучше: «Можешь, пожалуйста, дать мне книгу?»" },
      { typ: "luecke", e: "🔬", satz: "Im Unterricht sagst du statt „das Ding da“ besser ___.", optionen: ["das genaue Wort, zum Beispiel „die Lupe“", "„das Teil“", "gar nichts"], ru: "На уроке вместо «эта штука» лучше говорить точное слово, например «лупа»." },
      { typ: "luecke", e: "😉", satz: "Im Gespräch zeigt dein Gesicht, wie du etwas meinst. In einem Brief helfen dafür ___.", optionen: ["Satzzeichen und genaue Wörter", "Grimassen", "laute Stimmen"], ru: "В разговоре лицо показывает, как ты это имеешь в виду. В письме для этого помогают знаки препинания и точные слова." },
      { typ: "luecke", e: "💛", satz: "Ein Kind spricht zu Hause eine andere Sprache. Das ist ___.", optionen: ["ein Schatz – es kann zwei Sprachen", "ein Fehler", "verboten"], ru: "Ребёнок дома говорит на другом языке. Это сокровище — он знает два языка." },
      { typ: "schreiben", e: "🗺️", frage: "Welche Sprachen kennst du – oder welche Wörter aus einer anderen Sprache oder einem Dialekt? Schreib zwei Sätze.", woerter: 8, saetze: 2, karten: ["Ich kenne", "Auf", "heißt", "Meine Oma sagt"], ru: "Какие языки ты знаешь — или какие слова из другого языка или диалекта? Напиши два предложения." },
      { typ: "sag", text: "Toll, {name}! Jede Sprache ist wertvoll. Frag doch mal ein Kind aus deiner Klasse, wie man in seiner Sprache „Danke“ sagt.", ru: "Отлично! Каждый язык ценен. Спроси ребёнка из класса, как на его языке сказать «спасибо»." }
    ]
  },
  {
    id: "w-gespraech", lb: "sz", stufe: 1, lz: ["de.sz.02", "de.sz.03", "me.kk.01"], name: "Gut miteinander reden", ort: "🤝", farbe: "#C2337A", grund: "#FDEAF3",
    schritte: [
      { typ: "sag", text: "Damit ein Gespräch gelingt, gibt es Regeln: zuhören, sich melden, ausreden lassen, die anderen anschauen und freundlich bleiben.", ru: "Чтобы разговор получился, есть правила: слушать, поднимать руку, давать договорить, смотреть на других и оставаться дружелюбным." },
      { typ: "luecke", e: "✋", satz: "Wenn du im Kreis etwas sagen möchtest, ___.", optionen: ["meldest du dich", "rufst du dazwischen", "drehst du dich weg"], ru: "Если хочешь что-то сказать в кругу, поднимаешь руку." },
      { typ: "luecke", e: "🤐", satz: "Wenn jemand spricht, ___.", optionen: ["lässt du ihn ausreden", "redest du laut dazwischen", "lachst du ihn aus"], ru: "Когда кто-то говорит, даёшь ему договорить." },
      { typ: "luecke", e: "👀", satz: "Beim Zuhören ___.", optionen: ["schaust du den anderen an", "spielst du mit dem Stift", "schaust du aus dem Fenster"], ru: "Когда слушаешь, смотришь на говорящего." },
      { typ: "luecke", e: "🙏", satz: "Du brauchst eine Schere. Du sagst: „___“", optionen: ["Kannst du mir bitte die Schere leihen?", "Schere her!", "Ich nehm die jetzt."], ru: "Тебе нужны ножницы. Ты говоришь: «Можешь, пожалуйста, одолжить мне ножницы?»" },
      { typ: "luecke", e: "😔", satz: "Du hast aus Versehen den Turm umgestoßen. Du sagst: „___“", optionen: ["Entschuldigung, das wollte ich nicht.", "Selbst schuld.", "Na und?"], ru: "Ты случайно уронил башню. Говоришь: «Извини, я не хотел»." },
      { typ: "luecke", e: "🎂", satz: "Deine Freundin hat Geburtstag. Du sagst: „___“", optionen: ["Herzlichen Glückwunsch!", "Schon wieder?", "Gute Besserung!"], ru: "У подруги день рождения. Ты говоришь: «Поздравляю!»" },
      { typ: "luecke", e: "🎨", satz: "Ein Kind hat ein schönes Bild gemalt. Du lobst: „___“", optionen: ["Die Farben gefallen mir sehr!", "Meins ist besser.", "Hm."], ru: "Ребёнок нарисовал красивую картину. Ты хвалишь: «Мне очень нравятся цвета!»" },
      { typ: "luecke", e: "😠", satz: "Ihr streitet um die Schaukel. Ein guter Weg ist: „___“", optionen: ["Ich bin traurig. Wollen wir uns abwechseln?", "Hau ab!", "Du bist doof!"], ru: "Вы спорите из-за качелей. Хороший путь: «Мне грустно. Давай по очереди?»" },
      { typ: "luecke", e: "🤔", satz: "Ein anderes Kind findet ein anderes Buch toll als du. Das ist ___.", optionen: ["in Ordnung – jeder darf seine Meinung haben", "falsch", "ein Grund zum Streiten"], ru: "Другому ребёнку нравится другая книга. Это нормально — у каждого своё мнение." },
      { typ: "sag", text: "Prima, {name}! Mit Worten statt mit Fäusten – so löst man Streit. Und wer freundlich fragt, bekommt meist auch Hilfe.", ru: "Отлично! Словами, а не кулаками — так решают споры. А кто вежливо просит, тому обычно помогают." }
    ]
  },
  {
    id: "w-auswendig", lb: "sz", stufe: 2, lz: ["de.sz.05", "de.tm.03"], name: "Auswendig lernen", ort: "🧠", farbe: "#7B55B8", grund: "#EFE6FF",
    schritte: [
      { typ: "sag", text: "Ein Gedicht auswendig lernen geht leichter mit Tricks: Zeile für Zeile lernen, oft wiederholen, Bilder im Kopf malen – und jeden Tag ein bisschen.", ru: "Выучить стихотворение наизусть легче с хитростями: учить строчку за строчкой, часто повторять, рисовать картинки в голове — и каждый день понемногу." },
      { typ: "sag", text: "Hör dir das Gedicht an.", titel: "Der Schneemann", gedicht: ["Ein Schneemann steht im Garten,", "er will auf Kinder warten.", "Die Nase ist ein Möhrchen –", "er friert an beiden Öhrchen."], ru: "Послушай стихотворение. «Снеговик»: Снеговик стоит в саду, ждёт детей. Нос — морковка, он мёрзнет обоими ушками." },
      { typ: "luecke", e: "🥕", satz: "Ein Bild im Kopf hilft: Bei „Möhrchen“ denkst du an ___.", optionen: ["die Nase des Schneemanns", "einen Hasen im Wald", "den Sommer"], ru: "Картинка в голове помогает: при слове «морковка» думаешь о носе снеговика." },
      { typ: "luecke", e: "🔁", satz: "Am besten lernst du ein Gedicht ___.", optionen: ["jeden Tag ein Stück und oft wiederholt", "einmal ganz schnell", "erst am Morgen vor dem Vortrag"], ru: "Лучше учить стихотворение каждый день понемногу и часто повторяя." },
      { typ: "luecke", e: "🎵", satz: "„Garten“ reimt sich auf ___ – das hilft beim Merken.", optionen: ["warten", "Schnee", "Nase"], ru: "«Garten» рифмуется с «warten» — это помогает запомнить." },
      { typ: "luecke", e: "🚶", satz: "Noch ein Trick: Sprich das Gedicht beim Gehen oder klatsche dazu. So lernen ___ mit.", optionen: ["auch deine Beine und Hände", "nur die Augen", "die Nachbarn"], ru: "Ещё хитрость: говори стихотворение на ходу или хлопай. Так учат и ноги, и руки." },
      { typ: "ordnen", e: "⛄", frage: "Kannst du es schon? Bring das Gedicht in die richtige Reihenfolge!", teile: ["Ein Schneemann steht im Garten,", "er will auf Kinder warten.", "Die Nase ist ein Möhrchen –", "er friert an beiden Öhrchen."], ru: "Ты уже знаешь? Расставь строчки по порядку." },
      { typ: "luecke", e: "⛄", satz: "Ein Schneemann steht im Garten, er will auf ___ warten.", optionen: ["Kinder", "Katzen", "Kuchen"], ru: "Снеговик стоит в саду, ждёт детей." },
      { typ: "aufnehmen", frage: "Sag das Gedicht jetzt auswendig auf – ohne hinzusehen, wenn du kannst! Danach hörst du dich an.", titel: "Der Schneemann", gedicht: ["Ein Schneemann steht im Garten,", "er will auf Kinder warten.", "Die Nase ist ein Möhrchen –", "er friert an beiden Öhrchen."], ru: "Расскажи стихотворение наизусть — если можешь, не подглядывая! Потом послушай себя." },
      { typ: "sag", text: "Toll, {name}! Mit diesen Tricks kannst du jedes Gedicht lernen. Mal dir doch ein kleines Bild zu jeder Zeile!", ru: "Отлично! С этими хитростями можно выучить любое стихотворение. Нарисуй маленькую картинку к каждой строчке!" }
    ]
  },
  {
    id: "w-zuhoeren", lb: "sz", stufe: 1, lz: ["de.sz.04", "de.sz.01"], name: "Gut zuhören", ort: "👂", farbe: "#E8A33D", grund: "#FFF1D9",
    schritte: [
      { typ: "sag", text: "Gleich hörst du kurze Texte. So hörst du gut zu: Es ist ruhig, du sitzt bequem und denkst schon vorher: Worum könnte es gehen? Tippe auf den Lautsprecher – so oft du willst.", ru: "Сейчас ты услышишь короткие тексты. Так хорошо слушать: тихо, сидишь удобно и заранее думаешь, о чём может быть текст. Нажимай на динамик сколько хочешь." },
      { typ: "hoertext", e: "📢", text: "Achtung, eine Durchsage: Heute fällt der Sportunterricht aus. Die Klasse 2b geht stattdessen in die Bibliothek.", frage: "Wohin geht die Klasse 2b heute?", optionen: ["in die Bibliothek", "in die Turnhalle", "nach Hause"], ru: "Объявление: сегодня физкультуры не будет. Класс 2б идёт в библиотеку. Куда идёт класс?" },
      { typ: "hoertext", e: "📢", text: "Achtung, eine Durchsage: Heute fällt der Sportunterricht aus. Die Klasse 2b geht stattdessen in die Bibliothek.", frage: "Was fällt heute aus?", optionen: ["der Sportunterricht", "die Pause", "das Mittagessen"], ru: "Что сегодня отменяется? Физкультура." },
      { typ: "hoertext", e: "🦊", text: "Der kleine Fuchs Finn sucht seinen roten Ball. Er schaut unter dem Busch nach, aber da ist nur ein Igel. Dann hört er ein Plätschern. Der Ball schwimmt im Bach!", frage: "Wo findet Finn seinen Ball?", optionen: ["im Bach", "unter dem Busch", "beim Igel"], ru: "Лисёнок Финн ищет красный мяч. Под кустом только ёжик. Потом он слышит плеск — мяч плавает в ручье. Где мяч?" },
      { typ: "hoertext", e: "🦊", text: "Der kleine Fuchs Finn sucht seinen roten Ball. Er schaut unter dem Busch nach, aber da ist nur ein Igel. Dann hört er ein Plätschern. Der Ball schwimmt im Bach!", frage: "Welche Farbe hat der Ball?", optionen: ["rot", "blau", "gelb"], ru: "Какого цвета мяч? Красный." },
      { typ: "hoertext", e: "🚂", text: "Auf Gleis drei fährt ein: der Zug nach Leipzig. Bitte Vorsicht an der Bahnsteigkante!", frage: "Wohin fährt der Zug?", optionen: ["nach Leipzig", "nach Gleis drei", "nach Hause"], ru: "На третий путь прибывает поезд в Лейпциг. Куда идёт поезд?" },
      { typ: "luecke", e: "🤷", satz: "Du hast etwas nicht verstanden. Dann ___.", optionen: ["fragst du nach: „Kannst du das bitte wiederholen?“", "tust du so, als ob", "hältst du dir die Ohren zu"], ru: "Ты что-то не понял. Тогда переспрашиваешь: «Можешь, пожалуйста, повторить?»" },
      { typ: "luecke", e: "😊", satz: "„Toll gemacht!“, sagt Oma mit fröhlicher Stimme. Oma ist ___.", optionen: ["stolz und froh", "wütend", "müde"], ru: "«Молодец!» — говорит бабушка весёлым голосом. Бабушка гордая и радостная." },
      { typ: "sag", text: "Super zugehört, {name}! Tipp: Bei langen Texten merkst du dir zuerst das Wichtigste – wer, wo, was.", ru: "Отлично слушал! Совет: в длинных текстах сначала запоминай главное — кто, где, что." }
    ]
  },
  {
    id: "w-laute", lb: "sc", stufe: 1, lz: ["de.le.02", "de.su.02"], name: "Laute, Buchstaben und das ABC", ort: "🔠", farbe: "#2F6FB8", grund: "#E5EFFB",
    schritte: [
      { typ: "sag", text: "Buchstaben kann man sehen, Laute kann man hören. Die Selbstlaute a, e, i, o, u klingen allein. Ä, ö, ü heißen Umlaute. Ei, au, eu sind Zwielaute. Alle anderen sind Mitlaute.", ru: "Буквы видно, звуки слышно. Гласные a, e, i, o, u звучат сами. Ä, ö, ü — умлауты. Ei, au, eu — дифтонги. Остальные — согласные." },
      { typ: "luecke", e: "🍎", satz: "Welchen Laut hörst du am Anfang von „Apfel“? ___", optionen: ["A", "P", "F"], ru: "Какой звук в начале слова Apfel? A." },
      { typ: "luecke", e: "🐟", satz: "Wo hörst du das „sch“ in „Fisch“? ___", optionen: ["am Ende", "am Anfang", "in der Mitte"], ru: "Где слышно «sch» в слове Fisch? В конце." },
      { typ: "luecke", e: "🌙", satz: "Wo hörst du das „o“ in „Mond“? ___", optionen: ["in der Mitte", "am Anfang", "am Ende"], ru: "Где слышно «o» в слове Mond? В середине." },
      { typ: "luecke", e: "🔤", satz: "a, e, i, o, u sind ___.", optionen: ["Selbstlaute", "Mitlaute", "Zahlen"], ru: "a, e, i, o, u — гласные." },
      { typ: "luecke", e: "🐭", satz: "In „Maus“ steckt der Zwielaut ___.", optionen: ["au", "ei", "ä"], ru: "В Maus есть дифтонг au." },
      { typ: "luecke", e: "🐻", satz: "In „Bär“ steckt der Umlaut ___.", optionen: ["ä", "a", "eu"], ru: "В Bär есть умлаут ä." },
      { typ: "luecke", e: "⚽", satz: "In „Ball“ sind B und l ___.", optionen: ["Mitlaute", "Selbstlaute", "Umlaute"], ru: "В Ball буквы B и l — согласные." },
      { typ: "ordnen", e: "🔤", frage: "Wie geht das ABC weiter? Ordne die Buchstaben!", teile: ["D", "E", "F", "G"], ru: "Как продолжается алфавит? Расставь буквы." },
      { typ: "ordnen", e: "📖", frage: "Ordne die Wörter nach dem ABC! Schau auf den ersten Buchstaben.", teile: ["Affe", "Bus", "Igel", "Sonne"], ru: "Расставь слова по алфавиту, по первой букве." },
      { typ: "sag", text: "Super, {name}! Jetzt kennst du Selbstlaute, Mitlaute, Umlaute und Zwielaute – und das ABC hilft dir später im Wörterbuch.", ru: "Супер! Теперь ты знаешь гласные, согласные, умлауты и дифтонги — а алфавит потом поможет в словаре." }
    ]
  },
  {
    id: "w-silbe-lang-kurz", lb: "sc", stufe: 2, lz: ["de.sc.03", "de.sc.08"], name: "ie oder doppelt? Die Silbe hilft", ort: "🏠", farbe: "#E0574A", grund: "#FFECE8",
    schritte: [
      { typ: "sag", text: "Sprich das Wort in Silben! Endet die erste Silbe offen mit einem langen i, schreibst du meist ie: Bie-ne. Ist die erste Silbe zu und klingt kurz, kommt oft ein doppelter Mitlaut: Son-ne, Bal-le.", ru: "Произнеси слово по слогам! Если первый слог открытый с долгим i, обычно пишется ie: Bie-ne. Если первый слог закрытый и короткий, часто удваивается согласная: Son-ne, Bal-le." },
      { typ: "silben", e: "🐝", wort: "Biene", teile: ["Bie", "ne"], ru: "пчела" },
      { typ: "luecke", e: "🐝", satz: "Bie-ne: Die erste Silbe ist offen und klingt lang. Man schreibt ___.", optionen: ["ie", "i", "ii"], ru: "Bie-ne: первый слог открытый и долгий, пишется ie." },
      { typ: "luecke", e: "🦁", satz: "Der Hund ist mein ___.", optionen: ["Liebling", "Libling"], ru: "Собака — мой любимец (Liebling)." },
      { typ: "luecke", e: "🧸", satz: "Wir ___ im Garten.", optionen: ["spielen", "spilen"], ru: "Мы играем в саду (spielen)." },
      { typ: "silben", e: "☀️", wort: "Sonne", teile: ["Son", "ne"], ru: "солнце" },
      { typ: "luecke", e: "☀️", satz: "Son-ne: Die erste Silbe ist zu und klingt kurz. Darum schreibt man ___.", optionen: ["nn", "n", "hn"], ru: "Son-ne: первый слог закрытый и короткий, поэтому nn." },
      { typ: "luecke", e: "🪣", satz: "Ich trage die ___.", optionen: ["Kanne", "Kane"], ru: "Я несу кувшин (Kanne)." },
      { typ: "luecke", e: "🍝", satz: "Heute gibt es ___ mit Nudeln.", optionen: ["Suppe", "Supe"], ru: "Сегодня суп с лапшой (Suppe)." },
      { typ: "luecke", e: "🏃", satz: "Wir ___ um die Wette.", optionen: ["rennen", "renen"], ru: "Мы бегаем наперегонки (rennen)." },
      { typ: "luecke", e: "🛏️", satz: "Die Katze ___ auf dem Bett.", optionen: ["liegt", "ligt"], ru: "Кошка лежит на кровати (liegt, потому что lie-gen)." },
      { typ: "sag", text: "Klasse, {name}! Sprich langsam in Silben – dann hörst du, ob die Silbe offen oder zu ist.", ru: "Класс! Говори медленно по слогам — тогда слышно, открытый слог или закрытый." }
    ]
  },
  {
    id: "w-wortbau", lb: "su", stufe: 2, lz: ["de.su.08", "de.sc.04"], name: "Wörter bauen: Familien und Felder", ort: "🏗️", farbe: "#5DB84A", grund: "#E3F5DC",
    schritte: [
      { typ: "sag", text: "Aus zwei Nomen wird ein neues: Haus + Tür = die Haustür. Wörter mit demselben Wortstamm sind eine Wortfamilie: fahren, Fahrrad, Fahrer. Wörter zu einem Thema bilden ein Wortfeld: gehen, rennen, schleichen.", ru: "Из двух существительных получается новое: Haus + Tür = Haustür. Слова с одним корнем — семья слов: fahren, Fahrrad, Fahrer. Слова на одну тему — поле слов: gehen, rennen, schleichen." },
      { typ: "luecke", e: "🚪", satz: "Haus + Tür = die ___", optionen: ["Haustür", "Türhaus", "Haus Tür"], ru: "Haus + Tür = Haustür (входная дверь)." },
      { typ: "luecke", e: "⛄", satz: "Schnee + Mann = der ___", optionen: ["Schneemann", "Mannschnee", "Schnee-Mann"], ru: "Schnee + Mann = Schneemann." },
      { typ: "luecke", e: "🧦", satz: "Der Artikel richtet sich nach dem letzten Wort: der Fuß + der Ball = ___ Fußball.", optionen: ["der", "die", "das"], ru: "Артикль — по последнему слову: der Fußball." },
      { typ: "luecke", e: "🚲", satz: "Welches Wort gehört zur Wortfamilie „fahren“? ___", optionen: ["Fahrrad", "Farbe", "Faden"], ru: "Какое слово из семьи «fahren»? Fahrrad." },
      { typ: "luecke", e: "🎨", satz: "Welches Wort gehört zur Wortfamilie „malen“? ___", optionen: ["Maler", "Mantel", "Mond"], ru: "Какое слово из семьи «malen»? Maler." },
      { typ: "luecke", e: "🔁", satz: "Bei „ver-“ in „verlaufen“ steht ein ___ vor dem Wortstamm.", optionen: ["Wortbaustein", "Satzzeichen", "Artikel"], ru: "«ver-» в «verlaufen» — приставка перед корнем." },
      { typ: "luecke", e: "🏃", satz: "Wortfeld „gehen“: laufen, rennen, ___", optionen: ["schleichen", "schlafen", "schreiben"], ru: "Поле слов «идти»: бегать, мчаться, красться." },
      { typ: "luecke", e: "💬", satz: "Wortfeld „sagen“: rufen, flüstern, ___", optionen: ["fragen", "fressen", "fallen"], ru: "Поле слов «говорить»: кричать, шептать, спрашивать." },
      { typ: "schreiben", e: "🏗️", frage: "Bau selbst zusammengesetzte Nomen! Schreib drei Wörter, zum Beispiel Apfel + Baum = Apfelbaum.", woerter: 3, liste: true, karten: ["Apfelbaum", "Haustür", "Sonnenhut", "Schulranzen"], ru: "Составь сам сложные слова! Напиши три слова, например Apfel + Baum = Apfelbaum." },
      { typ: "sag", text: "Super gebaut, {name}! Wer den Wortstamm kennt, kann viele Wörter richtig schreiben.", ru: "Отлично построено! Кто знает корень, тот правильно пишет много слов." }
    ]
  },
  {
    id: "w-satzarten", lb: "su", stufe: 2, lz: ["de.su.06", "de.sc.05", "de.su.11"], name: "Erzählen, fragen, auffordern", ort: "❓", farbe: "#3AA0E0", grund: "#E1F3FF",
    schritte: [
      { typ: "sag", text: "Mit einem Aussagesatz erzählst du etwas – am Ende steht ein Punkt. Mit einem Fragesatz fragst du – am Ende steht ein Fragezeichen. Mit einem Aufforderungssatz bittest oder forderst du – oft steht ein Ausrufezeichen.", ru: "Повествовательным предложением ты что-то рассказываешь — в конце точка. Вопросительным спрашиваешь — в конце вопросительный знак. Побудительным просишь или требуешь — часто восклицательный знак." },
      { typ: "luecke", e: "🌧️", satz: "Es regnet heute___", optionen: [".", "?", "!"], ru: "Сегодня идёт дождь." },
      { typ: "luecke", e: "❓", satz: "Kommst du mit zum Spielplatz___", optionen: ["?", ".", "!"], ru: "Пойдёшь со мной на площадку?" },
      { typ: "luecke", e: "🚪", satz: "Mach bitte die Tür zu___", optionen: ["!", "?", ","], ru: "Закрой, пожалуйста, дверь!" },
      { typ: "luecke", e: "🎉", satz: "Hurra, endlich Ferien___", optionen: ["!", "?", ","], ru: "Ура, наконец каникулы!" },
      { typ: "luecke", e: "🎵", satz: "Bei einer Frage geht die Stimme am Ende meist ___.", optionen: ["nach oben", "nach unten", "ganz weg"], ru: "В вопросе голос в конце обычно идёт вверх." },
      { typ: "luecke", e: "🔎", satz: "„Wo wohnst du?“ ist ein ___.", optionen: ["Fragesatz", "Aussagesatz", "Aufforderungssatz"], ru: "«Где ты живёшь?» — вопросительное предложение." },
      { typ: "luecke", e: "🧹", satz: "„Räum bitte dein Zimmer auf!“ ist ein ___.", optionen: ["Aufforderungssatz", "Fragesatz", "Aussagesatz"], ru: "«Убери, пожалуйста, комнату!» — побудительное предложение." },
      { typ: "satz", e: "🐱", woerter: ["Wo", "ist", "die", "Katze?"], ru: "Где кошка?" },
      { typ: "satz", e: "🐱", woerter: ["Die", "Katze", "ist", "im", "Garten."], ru: "Кошка в саду." },
      { typ: "sag", text: "Klasse, {name}! Lies Sätze laut – deine Stimme verrät dir oft das richtige Satzzeichen.", ru: "Класс! Читай предложения вслух — голос часто подсказывает правильный знак." }
    ]
  },
  {
    id: "w-detektiv", lb: "sc", stufe: 2, lz: ["de.sc.04", "de.sc.07"], name: "Rechtschreib-Detektiv", ort: "🕵️", farbe: "#8A6E2F", grund: "#F7F0DD",
    schritte: [
      { typ: "sag", text: "Rechtschreib-Detektive haben Werkzeuge: Verlängern (Hund – Hunde), Ableiten (Bälle – Ball), Zerlegen (Haus-tür) und Merken. Und sie lesen ihren Text noch einmal genau – Wort für Wort.", ru: "У детективов правописания есть инструменты: удлинять (Hund – Hunde), выводить (Bälle – Ball), разбирать (Haus-tür) и запоминать. И они ещё раз внимательно читают свой текст — слово за словом." },
      { typ: "verbessern", e: "🐶", frage: "Ein Wort ist falsch geschrieben. Tippe es an und wähle das richtige!", satz: "Der Hunt bellt laut.", falsch: "Hunt", optionen: ["Hund", "Hunnd", "Hundt"], tipp: "Verlängern: die Hunde – also mit d!", ru: "Одно слово написано неправильно. Найди его." },
      { typ: "verbessern", e: "🍎", frage: "Ein Wort ist falsch. Findest du es?", satz: "Die Epfel sind reif.", falsch: "Epfel", optionen: ["Äpfel", "Äppfel", "Epfell"], tipp: "Ableiten: der Apfel – also Äpfel mit ä!", ru: "Найди ошибку: Äpfel от Apfel." },
      { typ: "verbessern", e: "🌲", frage: "Hier stimmt ein Wort nicht.", satz: "Wir gehen in den walt.", falsch: "walt", optionen: ["Wald", "Walt", "wald"], tipp: "Zwei Werkzeuge: Nomen groß – und verlängern: die Wälder!", ru: "Здесь ошибка: Wald — с большой буквы и с d." },
      { typ: "luecke", e: "🧰", satz: "Bei „Zug“ oder „Zuk“ hilft dir das Werkzeug ___.", optionen: ["Verlängern: die Züge", "Merken", "Zerlegen"], ru: "Для Zug помогает удлинение: Züge." },
      { typ: "luecke", e: "🧰", satz: "Bei „Kälte“ hilft dir das Werkzeug ___.", optionen: ["Ableiten: kalt", "Verlängern", "Zerlegen"], ru: "Для Kälte помогает выведение: kalt." },
      { typ: "luecke", e: "🧰", satz: "Bei „Fahrradhelm“ hilft dir das Werkzeug ___.", optionen: ["Zerlegen: Fahr-rad-helm", "Ableiten", "Verlängern"], ru: "Для Fahrradhelm помогает разбор." },
      { typ: "luecke", e: "📝", satz: "Wenn du ein Wort abschreibst, ___.", optionen: ["liest du es, merkst es dir, schreibst es und vergleichst", "schreibst du Buchstabe für Buchstabe ohne Lesen", "rätst du"], ru: "Когда списываешь слово: читаешь, запоминаешь, пишешь и сравниваешь." },
      { typ: "luecke", e: "🔍", satz: "Am Ende liest du deinen Text noch einmal ___.", optionen: ["langsam und Wort für Wort", "ganz schnell", "gar nicht"], ru: "В конце перечитываешь текст медленно, слово за словом." },
      { typ: "sag", text: "Fall gelöst, {name}! Tipp: Mach dir eine Liste mit deinen eigenen Fehlerwörtern und übe sie ab und zu.", ru: "Дело раскрыто! Совет: составь список своих трудных слов и иногда повторяй их." }
    ]
  },
  {
    id: "w-merkwoerter", lb: "le", stufe: 1, lz: ["de.le.04", "de.sc.03"], name: "Blitzwörter und Merkwörter", ort: "⚡", farbe: "#E8A33D", grund: "#FFF1D9",
    schritte: [
      { typ: "sag", text: "Manche Wörter kommen ganz oft vor: und, ist, der, die, das, ein, mit. Die liest man am besten blitzschnell – ohne Buchstabieren. Schau genau: Das Wort blitzt nur kurz auf!", ru: "Некоторые слова встречаются очень часто: und, ist, der, die, das, ein, mit. Их лучше читать молниеносно — не по буквам. Смотри внимательно: слово мелькает лишь на миг!" },
      { typ: "blitz", wort: "und", optionen: ["und", "uns", "um"], ru: "и" },
      { typ: "blitz", wort: "ist", optionen: ["ist", "isst", "es"], ru: "есть (является)" },
      { typ: "blitz", wort: "mit", optionen: ["mit", "mir", "mich"], ru: "с" },
      { typ: "blitz", wort: "nicht", optionen: ["nicht", "nichts", "nach"], ru: "не" },
      { typ: "blitz", wort: "auch", optionen: ["auch", "auf", "aus"], ru: "тоже" },
      { typ: "blitz", wort: "sind", optionen: ["sind", "sie", "Kind"], ms: 800, ru: "являются" },
      { typ: "sag", text: "Manche Wörter muss man sich einfach merken, weil man es nicht hört: Vogel, Vater, vier und viel schreibt man mit V.", ru: "Некоторые слова нужно просто запомнить, потому что на слух не понять: Vogel, Vater, vier и viel пишутся с V." },
      { typ: "luecke", e: "🐦", satz: "Der ___ singt im Baum.", optionen: ["Vogel", "Fogel"], ru: "Птица поёт на дереве (Vogel)." },
      { typ: "luecke", e: "4️⃣", satz: "Ich habe ___ Murmeln.", optionen: ["vier", "fier"], ru: "У меня четыре шарика (vier)." },
      { typ: "luecke", e: "👨", satz: "Mein ___ kocht heute.", optionen: ["Vater", "Fater"], ru: "Мой папа сегодня готовит (Vater)." },
      { typ: "sag", text: "Blitzschnell, {name}! Je öfter du liest, desto mehr Wörter erkennst du auf einen Blick.", ru: "Молниеносно! Чем чаще читаешь, тем больше слов узнаёшь с первого взгляда." }
    ]
  },
  {
    id: "w-glueckwunsch", lb: "sc", stufe: 2, lz: ["de.sc.06", "de.sc.05"], name: "Glückwunsch, Wunschzettel, Einkaufszettel", ort: "💌", farbe: "#C2337A", grund: "#FDEAF3",
    schritte: [
      { typ: "sag", text: "Man schreibt für andere: Mit einer Glückwunschkarte machst du jemandem eine Freude. Mit einem Einkaufszettel vergisst niemand etwas. Und auf einen Wunschzettel schreibst du, was du dir wünschst.", ru: "Пишут для других: открыткой ты радуешь человека. Со списком покупок никто ничего не забудет. А в список желаний пишешь, что хочешь." },
      { typ: "ordnen", e: "🎂", frage: "Bring die Glückwunschkarte in die richtige Reihenfolge!", teile: ["Lieber Opa,", "alles Gute zum Geburtstag!", "Ich wünsche dir viel Freude und Gesundheit.", "Dein Ben"], ru: "Расставь открытку по порядку." },
      { typ: "luecke", e: "💐", satz: "Auf eine Glückwunschkarte zum Muttertag passt: „___“", optionen: ["Danke, dass du immer für mich da bist!", "Kauf Milch!", "Gute Besserung!"], ru: "На открытку ко Дню матери подходит: «Спасибо, что ты всегда рядом!»" },
      { typ: "luecke", e: "🤒", satz: "Deine Freundin ist krank. Du schreibst: „___“", optionen: ["Gute Besserung!", "Herzlichen Glückwunsch!", "Frohe Ostern!"], ru: "Подруга заболела. Ты пишешь: «Выздоравливай!»" },
      { typ: "luecke", e: "🛒", satz: "Auf einen Einkaufszettel schreibst du ___.", optionen: ["kurz, was gekauft werden soll", "eine lange Geschichte", "ein Gedicht"], ru: "В список покупок кратко пишешь, что нужно купить." },
      { typ: "schreiben", e: "🛒", frage: "Ihr wollt Pfannkuchen backen. Schreib einen Einkaufszettel mit mindestens vier Dingen – jedes Ding in eine eigene Zeile oder mit Komma.", woerter: 4, liste: true, karten: ["Mehl", "Eier", "Milch", "Zucker", "Butter", "Äpfel"], ru: "Вы хотите печь блины. Напиши список покупок минимум из четырёх вещей." },
      { typ: "schreiben", e: "💌", frage: "Schreib eine Glückwunschkarte für jemanden, den du magst! Mit Anrede, einem Wunsch und deinem Namen.", woerter: 8, saetze: 1, karten: ["Liebe", "Lieber", "alles Gute", "Ich wünsche dir", "Dein", "Deine"], ru: "Напиши открытку тому, кого любишь! С обращением, пожеланием и своим именем." },
      { typ: "sag", text: "Wunderbar, {name}! Schreib die Karte doch auch auf Papier, mal etwas dazu – und verschenke sie.", ru: "Чудесно! Напиши открытку и на бумаге, нарисуй что-нибудь — и подари её." }
    ]
  },
  {
    id: "w-beschreiben", lb: "sc", stufe: 2, lz: ["de.sc.06", "de.sc.07"], name: "Ein Tier beschreiben", ort: "🐹", farbe: "#B5701A", grund: "#FFF1D9",
    schritte: [
      { typ: "sag", text: "Bei einer Beschreibung soll man sich das Tier genau vorstellen können. Erst sammelst du Stichwörter: Größe, Farbe, Fell, Besonderheiten. Dann schreibst du ganze Sätze – mit Überschrift.", ru: "По описанию нужно точно представить животное. Сначала собираешь ключевые слова: размер, цвет, шерсть, особенности. Потом пишешь полные предложения — с заголовком." },
      { typ: "luecke", e: "📝", satz: "Stichwörter sind ___.", optionen: ["einzelne wichtige Wörter", "lange Sätze", "Bilder"], ru: "Ключевые слова — это отдельные важные слова." },
      { typ: "luecke", e: "🐹", satz: "Welches Stichwort beschreibt den Hamster genau? ___", optionen: ["braunes, weiches Fell", "süß", "irgendwie klein"], ru: "Какое слово точно описывает хомяка? Коричневая мягкая шерсть." },
      { typ: "luecke", e: "🐹", satz: "Eine gute Überschrift für die Beschreibung ist: ___", optionen: ["Mein Hamster Krümel", "Und dann", "Ende"], ru: "Хороший заголовок: «Мой хомяк Крюмель»." },
      { typ: "ordnen", e: "🐹", frage: "Erst das Ganze, dann die Einzelheiten. Ordne die Beschreibung!", teile: ["Krümel ist ein kleiner Goldhamster.", "Sein Fell ist braun und weiß.", "Er hat dicke Backentaschen.", "Am liebsten frisst er Körner."], ru: "Сначала целое, потом детали. Расставь описание." },
      { typ: "luecke", e: "🎨", satz: "In einer Beschreibung helfen vor allem ___.", optionen: ["Wiewörter: groß, weich, gestreift", "Ausrufe: Hurra!", "Fragen"], ru: "В описании помогают прилагательные: большой, мягкий, полосатый." },
      { typ: "schreiben", e: "🐾", frage: "Beschreib ein Tier, das du kennst! Schreib eine Überschrift und mindestens drei Sätze: Wie groß ist es, welche Farbe hat es, was ist besonders?", woerter: 18, saetze: 3, karten: ["Mein Tier", "Es ist", "Sein Fell ist", "Es hat", "Am liebsten"], ru: "Опиши знакомое животное! Заголовок и минимум три предложения: какого размера, какого цвета, что особенного?" },
      { typ: "sag", text: "Toll beschrieben, {name}! Lies deine Beschreibung jemandem vor – kann er erraten, welches Tier es ist?", ru: "Отлично описано! Прочитай кому-нибудь — сможет он угадать, какое это животное?" }
    ]
  },
  {
    id: "w-elfchen", lb: "tm", stufe: 2, lz: ["de.tm.03", "de.sc.06"], name: "Ein Elfchen dichten", ort: "✨", farbe: "#7B55B8", grund: "#EFE6FF",
    schritte: [
      { typ: "sag", text: "Ein Elfchen ist ein kleines Gedicht aus elf Wörtern in fünf Zeilen: 1 Wort, 2 Wörter, 3 Wörter, 4 Wörter und zum Schluss wieder 1 Wort. Es muss sich nicht reimen!", ru: "Эльфхен — маленькое стихотворение из одиннадцати слов в пяти строках: 1 слово, 2, 3, 4 и в конце снова 1. Рифма не нужна!" },
      { typ: "sag", text: "Hör dir ein Elfchen an.", titel: "Herbst", gedicht: ["Bunt", "die Blätter", "sie tanzen leise", "ich sammle sie alle", "Herbst"], ru: "Послушай эльфхен «Осень»: Пёстрые / листья / тихо танцуют / я собираю их все / осень." },
      { typ: "luecke", e: "✨", satz: "Ein Elfchen hat ___ Wörter.", optionen: ["elf", "fünf", "zwanzig"], ru: "В эльфхен одиннадцать слов." },
      { typ: "luecke", e: "📏", satz: "Eine Zeile im Gedicht heißt auch ___.", optionen: ["Vers", "Kapitel", "Titel"], ru: "Строка в стихотворении называется также стих (Vers)." },
      { typ: "luecke", e: "🧱", satz: "Mehrere Verse zusammen bilden eine ___.", optionen: ["Strophe", "Seite", "Überschrift"], ru: "Несколько строк вместе — строфа." },
      { typ: "luecke", e: "4️⃣", satz: "In der vierten Zeile stehen ___ Wörter.", optionen: ["vier", "zwei", "eins"], ru: "В четвёртой строке четыре слова." },
      { typ: "ordnen", e: "❄️", frage: "Bring das Elfchen in die richtige Reihenfolge: erst 1 Wort, dann 2, 3, 4 und wieder 1!", teile: ["Weiß", "der Schnee", "er glitzert hell", "ich baue einen Schneemann", "Winter"], ru: "Расставь эльфхен по порядку: 1, 2, 3, 4 и снова 1 слово." },
      { typ: "schreiben", e: "✨", frage: "Dichte dein eigenes Elfchen! Eine Farbe, ein Ding, was es tut, etwas über dich – und ein Schlusswort.", woerter: 11, liste: true, karten: ["Gelb", "Rot", "die Sonne", "der Ball", "ich", "Sommer"], ru: "Сочини свой эльфхен! Цвет, предмет, что он делает, что-то о тебе — и последнее слово." },
      { typ: "sag", text: "Du bist ein Dichter, {name}! Schreib dein Elfchen schön ab und mal ein Bild dazu.", ru: "Ты поэт! Красиво перепиши эльфхен и нарисуй к нему картинку." }
    ]
  },
  {
    id: "w-ueberarbeiten", lb: "sc", stufe: 2, lz: ["de.sc.07", "de.sc.05"], name: "Texte besser machen", ort: "🔧", farbe: "#2E9C5A", grund: "#E3F7EF",
    schritte: [
      { typ: "sag", text: "Schreibprofis lesen ihren Text noch einmal und machen ihn besser. Eine Checkliste hilft: Stimmt die Reihenfolge? Sind die Wörter genau? Fangen die Sätze verschieden an? Stimmen Großschreibung und Satzzeichen?", ru: "Профессионалы перечитывают текст и улучшают его. Помогает список проверки: правильный ли порядок? Точные ли слова? По-разному ли начинаются предложения? Верны ли заглавные буквы и знаки?" },
      { typ: "verbessern", e: "🔁", frage: "Drei Sätze fangen gleich an. Tippe auf das „Dann“ im letzten Satz und wähle etwas Besseres!", satz: "Dann gingen wir in den Zoo. Dann sahen wir Löwen. Dann aßen wir Eis.", falsch: "Dann", stelle: 10, optionen: ["Zum Schluss", "Dann", "Und dann"], tipp: "Genau! Abwechslung macht den Text schöner.", ru: "Три предложения начинаются одинаково. Замени последнее «Dann»." },
      { typ: "verbessern", e: "🐘", frage: "Ein Wort sagt zu wenig. Tippe es an und wähle ein genaueres!", satz: "Der Elefant ist groß und macht etwas mit dem Rüssel.", falsch: "macht", optionen: ["trinkt", "macht", "tut"], tipp: "Super! „Trinkt“ sagt genau, was passiert.", ru: "Слово слишком общее. Выбери точнее." },
      { typ: "verbessern", e: "🔠", frage: "Hier fehlt ein großer Buchstabe. Tippe das Wort an!", satz: "Am Morgen bellt der hund.", falsch: "hund", optionen: ["Hund", "hunt", "Hunt"], tipp: "Richtig! Nomen schreibt man groß.", ru: "Здесь не хватает большой буквы. Найди слово." },
      { typ: "luecke", e: "✅", satz: "Was gehört NICHT auf eine Checkliste zum Überarbeiten? ___", optionen: ["Ist mein Stift teuer?", "Stimmt die Reihenfolge?", "Stehen am Satzende Satzzeichen?"], ru: "Что НЕ входит в список проверки? «Дорогая ли моя ручка?»" },
      { typ: "luecke", e: "👂", satz: "Ein guter Trick beim Überarbeiten: Lies deinen Text ___.", optionen: ["laut vor", "rückwärts", "gar nicht"], ru: "Хороший приём: прочитай текст вслух." },
      { typ: "luecke", e: "🤝", satz: "Ein anderes Kind gibt dir einen Tipp zu deinem Text. Du ___.", optionen: ["bedankst dich und überlegst, ob er hilft", "bist beleidigt", "wirfst den Text weg"], ru: "Другой ребёнок даёт совет. Ты благодаришь и думаешь, поможет ли он." },
      { typ: "schreiben", e: "🔧", frage: "Mach diesen Text besser: „Wir waren am See. Wir haben gebadet. Wir haben Eis gegessen.“ Schreib ihn neu – mit verschiedenen Satzanfängen.", woerter: 12, saetze: 3, karten: ["Am Sonntag", "Zuerst", "Danach", "Zum Schluss", "Weil es so heiß war"], ru: "Улучши текст: «Мы были на озере. Мы купались. Мы ели мороженое.» Напиши его по-новому — с разными началами предложений." },
      { typ: "sag", text: "Super überarbeitet, {name}! Ein Text ist zuerst ein Entwurf – und mit jedem Mal wird er besser.", ru: "Отлично переработано! Текст сначала черновик — и с каждым разом он становится лучше." }
    ]
  },
  {
    id: "w-lautlesen", lb: "le", stufe: 2, lz: ["de.le.05"], name: "Laut und flüssig lesen", ort: "📢", farbe: "#E0574A", grund: "#FFECE8",
    schritte: [
      { typ: "sag", text: "Flüssig lesen übt man durch Wiederholen: Erst hörst du den Text, dann liest du leise mit, dann liest du ihn selbst laut – und jedes Mal klappt es besser.", ru: "Бегло читать учатся повторением: сначала слушаешь текст, потом читаешь про себя, потом сам вслух — и каждый раз получается лучше." },
      { typ: "sag", text: "Hör zu und lies leise mit. Fahr mit dem Finger unter den Zeilen mit.", titel: "Die Katze Mimi", gedicht: ["Mimi ist eine kleine Katze.", "Sie schläft gern in der Sonne.", "Am Abend jagt sie Motten.", "Dann kommt sie müde nach Hause."], ru: "Слушай и читай про себя. Веди пальцем под строчками. «Кошка Мими»." },
      { typ: "luecke", e: "🐱", satz: "Wo schläft Mimi gern? ___", optionen: ["in der Sonne", "im Keller", "im Schnee"], ru: "Где любит спать Мими? На солнце." },
      { typ: "luecke", e: "📏", satz: "Beim lauten Lesen machst du am Punkt ___.", optionen: ["eine kleine Pause", "ganz schnell weiter", "einen Sprung"], ru: "При чтении вслух на точке делаешь маленькую паузу." },
      { typ: "luecke", e: "🎵", satz: "Bei einem Fragezeichen geht die Stimme ___.", optionen: ["nach oben", "nach unten", "weg"], ru: "При вопросительном знаке голос идёт вверх." },
      { typ: "luecke", e: "👫", satz: "Beim Tandemlesen liest du ___.", optionen: ["zusammen mit jemandem, der gut lesen kann", "allein unter der Decke", "rückwärts"], ru: "При чтении в тандеме читаешь вместе с тем, кто хорошо читает." },
      { typ: "aufnehmen", frage: "Jetzt du: Lies den Text laut vor. Danach hörst du dich an. Lies ihn ruhig zweimal – beim zweiten Mal wird es flüssiger!", titel: "Die Katze Mimi", gedicht: ["Mimi ist eine kleine Katze.", "Sie schläft gern in der Sonne.", "Am Abend jagt sie Motten.", "Dann kommt sie müde nach Hause."], ru: "Теперь ты: прочитай текст вслух. Потом послушай себя. Прочитай два раза — во второй раз получится глаже!" },
      { typ: "sag", text: "Klasse gelesen, {name}! Lies heute jemandem aus deiner Familie vor – das ist das beste Training.", ru: "Отлично прочитано! Почитай сегодня кому-нибудь из семьи — это лучшая тренировка." }
    ]
  },
  {
    id: "w-lesedetektiv", lb: "le", stufe: 2, lz: ["de.le.05", "de.le.06"], name: "Lese-Detektiv", ort: "🔎", farbe: "#1F8FB8", grund: "#E2F4FB",
    schritte: [
      { typ: "sag", text: "Lese-Detektive gehen so vor: Vor dem Lesen schauen sie Überschrift und Bild an und überlegen: Worum geht es? Beim Lesen suchen sie die wichtigen Wörter. Nach dem Lesen erzählen sie mit eigenen Worten.", ru: "Детективы чтения действуют так: перед чтением смотрят на заголовок и картинку и думают, о чём текст. Во время чтения ищут важные слова. После — пересказывают своими словами." },
      { typ: "luecke", e: "🐿️", satz: "Die Überschrift heißt „Das Eichhörnchen im Winter“. Worum geht es wohl? ___", optionen: ["wie Eichhörnchen den Winter verbringen", "wie man Schlitten fährt", "wie Eichhörnchen schwimmen"], ru: "Заголовок «Белка зимой». О чём, наверное, текст? Как белки проводят зиму." },
      { typ: "sag", text: "Lies jetzt genau.", titel: "Das Eichhörnchen im Winter", gedicht: ["Im Herbst sammelt das Eichhörnchen Nüsse.", "Es versteckt sie in der Erde.", "Im Winter schläft es viel in seinem Nest.", "Wenn es Hunger hat, sucht es seine Nüsse.", "Manche findet es nicht – daraus wachsen neue Bäume."], ru: "Читай внимательно. «Белка зимой»." },
      { typ: "luecke", e: "🌰", satz: "Was sammelt das Eichhörnchen im Herbst? ___", optionen: ["Nüsse", "Blätter", "Steine"], ru: "Что собирает белка осенью? Орехи." },
      { typ: "luecke", e: "🏠", satz: "Wo schläft es im Winter? ___", optionen: ["in seinem Nest", "in der Erde", "im Haus"], ru: "Где спит белка зимой? В гнезде." },
      { typ: "luecke", e: "🌳", satz: "Was passiert mit Nüssen, die es nicht findet? ___", optionen: ["Daraus wachsen neue Bäume.", "Sie werden zu Steinen.", "Ein Fuchs isst sie alle."], ru: "Что бывает с орехами, которые белка не нашла? Из них растут деревья." },
      { typ: "luecke", e: "⭐", satz: "Welches Wort ist für den Text besonders wichtig? ___", optionen: ["Nüsse", "manche", "seine"], ru: "Какое слово особенно важно? Орехи." },
      { typ: "luecke", e: "🏷️", satz: "Eine andere gute Überschrift wäre: ___", optionen: ["Ein Wintervorrat aus Nüssen", "Ferien am Meer", "Mein Fahrrad"], ru: "Другой хороший заголовок: «Зимний запас из орехов»." },
      { typ: "schreiben", e: "🐿️", frage: "Erzähl mit eigenen Worten in zwei Sätzen, was das Eichhörnchen im Herbst und im Winter macht.", woerter: 10, saetze: 2, pflicht: ["Nüsse"], karten: ["Im Herbst", "Im Winter", "versteckt", "schläft"], ru: "Перескажи своими словами в двух предложениях, что делает белка осенью и зимой." },
      { typ: "sag", text: "Fall gelöst, {name}! Vorher überlegen, beim Lesen suchen, danach erzählen – so verstehst du jeden Text besser.", ru: "Дело раскрыто! Подумать заранее, искать во время чтения, пересказать после — так понимаешь любой текст лучше." }
    ]
  },
  {
    id: "w-maerchen", lb: "tm", stufe: 2, lz: ["de.tm.03", "de.tm.02"], name: "Märchenzeit", ort: "🧚", farbe: "#C2337A", grund: "#FDEAF3",
    schritte: [
      { typ: "sag", text: "Märchen erkennst du an Zeichen: Sie beginnen oft mit „Es war einmal“. Es gibt Gute und Böse, Zauberei, die Zahlen drei und sieben – und am Ende siegt meist das Gute.", ru: "Сказки узнаёшь по признакам: часто начинаются с «Жил-был». Есть добрые и злые, волшебство, числа три и семь — и в конце обычно побеждает добро." },
      { typ: "hoertext", e: "🐸", text: "Es war einmal ein Frosch, der saß traurig an einem Brunnen. Da kam eine Prinzessin. Der Frosch sprach: Hilf mir, dann helfe ich dir! Die Prinzessin gab dem Frosch drei Küsse – und plötzlich stand ein Prinz vor ihr.", frage: "Wie viele Küsse gibt die Prinzessin dem Frosch?", optionen: ["drei", "einen", "sieben"], ru: "Жила-была лягушка у колодца. Пришла принцесса. Лягушка сказала: «Помоги мне — я помогу тебе!» Принцесса трижды поцеловала лягушку — и появился принц. Сколько поцелуев?" },
      { typ: "luecke", e: "🧙", satz: "Woran merkst du, dass es ein Märchen ist? ___", optionen: ["Es gibt Zauberei: Ein Frosch wird zum Prinzen.", "Es steht in der Zeitung.", "Es ist ganz kurz."], ru: "Как понять, что это сказка? Есть волшебство: лягушка становится принцем." },
      { typ: "luecke", e: "📜", satz: "Viele Märchen beginnen mit: ___", optionen: ["Es war einmal …", "Liebe Oma, …", "Achtung, eine Durchsage!"], ru: "Многие сказки начинаются с «Жил-был…»." },
      { typ: "luecke", e: "🐺", satz: "Im Märchen „Rotkäppchen“ ist der Wolf ___.", optionen: ["der Böse", "der Helfer", "der König"], ru: "В сказке «Красная Шапочка» волк — злой персонаж." },
      { typ: "luecke", e: "🏁", satz: "Ein Märchen endet oft mit: ___", optionen: ["… und wenn sie nicht gestorben sind, dann leben sie noch heute.", "Fortsetzung folgt.", "Viele Grüße."], ru: "Сказка часто заканчивается: «…и жили они долго и счастливо»." },
      { typ: "luecke", e: "💭", satz: "Wie fühlt sich die Prinzessin wohl, als der Prinz vor ihr steht? ___", optionen: ["überrascht und froh", "gelangweilt", "hungrig"], ru: "Что чувствует принцесса, увидев принца? Удивление и радость." },
      { typ: "schreiben", e: "🧚", frage: "Erfinde den Anfang eines Märchens! Beginne mit „Es war einmal“ und erzähle, wer darin vorkommt.", woerter: 12, saetze: 2, anfang: "Es war einmal ", karten: ["eine Königin", "ein Zauberer", "ein armes Mädchen", "im dunklen Wald", "eine sprechende Katze"], ru: "Придумай начало сказки! Начни с «Es war einmal» и расскажи, кто в ней есть." },
      { typ: "sag", text: "Zauberhaft, {name}! Frag in der Bibliothek nach einem Märchenbuch – es gibt Märchen aus der ganzen Welt.", ru: "Волшебно! Спроси в библиотеке книгу сказок — есть сказки со всего мира." }
    ]
  },
  {
    id: "w-sachtexte", lb: "tm", stufe: 2, lz: ["de.tm.03", "de.le.06"], name: "Rezept, Regel, Schild", ort: "📋", farbe: "#2F6FB8", grund: "#E5EFFB",
    schritte: [
      { typ: "sag", text: "Nicht jeder Text erzählt eine Geschichte. Manche Texte informieren dich (Lexikon), manche sagen, wie etwas geht (Rezept, Bastelanleitung), und manche sagen, was erlaubt ist (Regeln, Schilder).", ru: "Не каждый текст рассказывает историю. Некоторые сообщают сведения (энциклопедия), некоторые объясняют, как что-то делать (рецепт, инструкция), а некоторые — что разрешено (правила, знаки)." },
      { typ: "luecke", e: "🥞", satz: "„1. Mehl und Milch verrühren. 2. Eier dazugeben.“ Das ist ___.", optionen: ["ein Rezept", "ein Märchen", "ein Gedicht"], ru: "«1. Смешать муку и молоко. 2. Добавить яйца.» Это рецепт." },
      { typ: "luecke", e: "🚫", satz: "„Bitte nicht rennen!“ an der Schwimmhalle ist ___.", optionen: ["eine Regel", "eine Geschichte", "ein Witz"], ru: "«Пожалуйста, не бегать!» в бассейне — это правило." },
      { typ: "luecke", e: "📘", satz: "„Der Igel ist ein Säugetier. Er frisst Käfer.“ Dieser Text ___.", optionen: ["informiert über Igel", "erzählt ein Märchen", "lädt zu einem Fest ein"], ru: "«Ёж — млекопитающее. Он ест жуков.» Этот текст сообщает о ежах." },
      { typ: "luecke", e: "🔢", satz: "In einer Anleitung helfen ___, damit du nichts vergisst.", optionen: ["Nummern und Bilder für jeden Schritt", "Reime", "Fragen am Ende"], ru: "В инструкции помогают номера и картинки к каждому шагу." },
      { typ: "ordnen", e: "🧻", frage: "So bastelst du ein Fernglas. Bring die Schritte in die richtige Reihenfolge!", teile: ["Nimm zwei Papprollen.", "Klebe sie nebeneinander zusammen.", "Bemale sie bunt.", "Mach eine Schnur zum Umhängen dran."], ru: "Так делается бинокль из бумаги. Расставь шаги по порядку." },
      { typ: "luecke", e: "🖼️", satz: "Zum Satz „Klebe sie nebeneinander zusammen“ passt am besten ein Bild mit ___.", optionen: ["zwei Rollen und Kleber", "einem Hund", "dem fertigen Kuchen"], ru: "К предложению «Склей их рядом» лучше всего подходит картинка с двумя трубками и клеем." },
      { typ: "sag", text: "Prima, {name}! Bevor du liest, frag dich: Soll mir der Text etwas erzählen, erklären oder etwas sagen, was ich tun soll?", ru: "Отлично! Перед чтением спроси себя: текст хочет рассказать, объяснить или сказать, что делать?" }
    ]
  },
  {
    id: "w-medien", lb: "tm", stufe: 2, lz: ["de.tm.03", "me.sv.01", "me.ph.01"], name: "Bücher, Hörbücher, Bibliothek", ort: "📚", farbe: "#7B55B8", grund: "#EFE6FF",
    schritte: [
      { typ: "sag", text: "Geschichten gibt es als Buch, als Hörbuch, als Hörspiel oder als Film. Wissen findest du in Sachbüchern, Erklärvideos oder auf Kinderseiten. Und in der Bibliothek kannst du dir Bücher kostenlos ausleihen!", ru: "Истории бывают в книге, аудиокниге, радиоспектакле или фильме. Знания — в научно-популярных книгах, обучающих видео и на детских сайтах. А в библиотеке книги можно взять бесплатно!" },
      { typ: "luecke", e: "📕", satz: "Wer ein Buch geschrieben hat, ist der Autor oder die ___.", optionen: ["Autorin", "Leserin", "Verkäuferin"], ru: "Кто написал книгу — автор (Autorin)." },
      { typ: "luecke", e: "🏷️", satz: "Der Name des Buches heißt ___.", optionen: ["Titel", "Seite", "Strophe"], ru: "Название книги — Titel." },
      { typ: "luecke", e: "🎧", satz: "Bei einem Hörbuch ___.", optionen: ["liest dir jemand die Geschichte vor", "musst du selbst lesen", "gibt es keine Geschichte"], ru: "В аудиокниге тебе кто-то читает историю." },
      { typ: "luecke", e: "📺", satz: "Du willst wissen, wie ein Regenbogen entsteht. Gut passt ___.", optionen: ["ein Erklärvideo für Kinder oder ein Sachbuch", "ein Märchenbuch", "ein Witzbuch"], ru: "Хочешь узнать, как появляется радуга. Подходит обучающее видео для детей или научно-популярная книга." },
      { typ: "luecke", e: "🏛️", satz: "In der Bibliothek ___.", optionen: ["leihst du Bücher aus und bringst sie später zurück", "kaufst du Bücher", "darfst du laut toben"], ru: "В библиотеке берёшь книги на время и потом возвращаешь." },
      { typ: "luecke", e: "💛", satz: "Dein Lieblingsbuch stellst du anderen vor. Du sagst auch, ___.", optionen: ["warum es dir gefällt", "wie viel es gekostet hat", "nichts weiter"], ru: "Представляя любимую книгу, говоришь, почему она тебе нравится." },
      { typ: "schreiben", e: "📚", frage: "Welches Buch oder Hörbuch magst du? Schreib den Titel und einen Satz, warum du es magst.", woerter: 8, saetze: 2, pflicht: ["weil"], karten: ["Mein Lieblingsbuch heißt", "Ich mag es, weil", "spannend", "lustig"], ru: "Какую книгу или аудиокнигу ты любишь? Напиши название и одно предложение — почему." },
      { typ: "sag", text: "Super, {name}! Frag deine Eltern, ob ihr zusammen in die Bibliothek geht – einen Ausweis für Kinder gibt es oft kostenlos.", ru: "Супер! Спроси родителей, сходите ли вы вместе в библиотеку — читательский билет для детей часто бесплатный." }
    ]
  },
  {
    id: "w-teekessel", lb: "su", stufe: 2, lz: ["de.su.03", "de.sz.03"], name: "Teekesselchen und Bitten", ort: "🫖", farbe: "#E8A33D", grund: "#FFF1D9",
    schritte: [
      { typ: "sag", text: "Manche Wörter haben zwei Bedeutungen – das sind Teekesselchen: Die Maus ist ein Tier und ein Gerät am Computer. Und wie du etwas sagst, macht einen Unterschied: Eine Bitte klingt anders als ein Befehl.", ru: "У некоторых слов два значения — это «чайнички»: Maus — животное и компьютерная мышь. И как ты говоришь, важно: просьба звучит иначе, чем приказ." },
      { typ: "luecke", e: "🐭", satz: "Die Maus ist ein Tier und ___.", optionen: ["ein Gerät am Computer", "eine Farbe", "ein Baum"], ru: "Мышь — животное и устройство у компьютера." },
      { typ: "luecke", e: "🏰", satz: "Ein Schloss kann ein großes Gebäude sein und ___.", optionen: ["etwas zum Abschließen an der Tür", "ein Stück Kuchen", "ein Vogel"], ru: "Schloss — замок-здание и замок в двери." },
      { typ: "luecke", e: "🪑", satz: "Die Bank ist zum Sitzen da – und ___.", optionen: ["ein Ort, wo man Geld aufbewahrt", "ein Tier im Wald", "ein Lied"], ru: "Bank — скамейка и банк." },
      { typ: "luecke", e: "📖", satz: "Was bedeutet „ausleihen“? ___", optionen: ["etwas für eine Zeit bekommen und zurückgeben", "etwas für immer kaufen", "etwas wegwerfen"], ru: "Что значит «одолжить»? Получить на время и вернуть." },
      { typ: "luecke", e: "🙏", satz: "Welcher Satz ist eine freundliche Bitte? ___", optionen: ["Kannst du mir bitte helfen?", "Hilf mir sofort!", "Los, mach!"], ru: "Какое предложение — вежливая просьба? «Можешь, пожалуйста, помочь?»" },
      { typ: "luecke", e: "😊", satz: "Wer freundlich bittet, ___.", optionen: ["bekommt meist lieber Hilfe", "wird ausgelacht", "muss alles allein machen"], ru: "Кто вежливо просит, тому обычно охотнее помогают." },
      { typ: "luecke", e: "🦶", satz: "„Fuß“ kann ein Körperteil sein – und ___ eines Berges.", optionen: ["der untere Teil", "der Gipfel", "die Farbe"], ru: "Fuß — нога и подножие горы." },
      { typ: "sag", text: "Klasse, {name}! Spiel mit deiner Familie Teekesselchen: Einer denkt sich ein Wort mit zwei Bedeutungen aus, die anderen raten.", ru: "Класс! Поиграй с семьёй в «чайнички»: один загадывает слово с двумя значениями, остальные угадывают." }
    ]
  },
  {
    id: "w-verbformen", lb: "su", stufe: 2, lz: ["de.su.04"], name: "Ich laufe, du läufst", ort: "🏃‍♀️", farbe: "#E0574A", grund: "#FFECE8",
    schritte: [
      { typ: "sag", text: "Verben haben eine Grundform: laufen, spielen, essen. Im Satz verändern sie sich je nach Person: ich laufe, du läufst, er läuft, wir laufen. Das ist die Personalform. Ohne Verb gibt es keinen Satz!", ru: "У глаголов есть начальная форма: laufen, spielen, essen. В предложении они меняются по лицам: ich laufe, du läufst, er läuft, wir laufen. Это личная форма. Без глагола нет предложения!" },
      { typ: "luecke", e: "🎮", satz: "Ich ___ gern.", optionen: ["spiele", "spielen", "spielst"], ru: "Я люблю играть (spiele)." },
      { typ: "luecke", e: "🎮", satz: "Du ___ gern.", optionen: ["spielst", "spiele", "spielt"], ru: "Ты любишь играть (spielst)." },
      { typ: "luecke", e: "🎮", satz: "Wir ___ gern.", optionen: ["spielen", "spielt", "spielst"], ru: "Мы любим играть (spielen)." },
      { typ: "luecke", e: "🏃", satz: "Lena ___ schnell.", optionen: ["läuft", "laufen", "laufe"], ru: "Лена быстро бегает (läuft)." },
      { typ: "luecke", e: "🍝", satz: "Die Grundform von „isst“ ist ___.", optionen: ["essen", "isst", "aß"], ru: "Начальная форма «isst» — essen." },
      { typ: "luecke", e: "📖", satz: "Die Grundform von „liest“ ist ___.", optionen: ["lesen", "liest", "Leser"], ru: "Начальная форма «liest» — lesen." },
      { typ: "luecke", e: "🧩", satz: "Im Satz „Der Hund bellt.“ ist das Verb ___.", optionen: ["bellt", "Der", "Hund"], ru: "В предложении «Der Hund bellt.» глагол — bellt." },
      { typ: "satz", e: "🚲", woerter: ["Ihr", "fahrt", "mit", "dem", "Rad."], ru: "Вы едете на велосипеде." },
      { typ: "sag", text: "Super, {name}! Im Wörterbuch suchst du Verben immer in der Grundform – also „laufen“ statt „läuft“.", ru: "Супер! В словаре глаголы ищут в начальной форме — laufen, а не läuft." }
    ]
  },
  {
    id: "w-begleiter", lb: "su", stufe: 2, lz: ["de.su.05", "de.su.04", "de.sc.05"], name: "Der, ein und Treppensätze", ort: "🪜", farbe: "#5DB84A", grund: "#E3F5DC",
    schritte: [
      { typ: "sag", text: "Nomen haben Begleiter: der, die, das (bestimmter Artikel) oder ein, eine (unbestimmter Artikel). Zwischen Begleiter und Nomen kann ein Wiewort stehen: der kleine Hund. Das Nomen bleibt groß!", ru: "У существительных есть спутники: der, die, das (определённый артикль) или ein, eine (неопределённый). Между артиклем и существительным может стоять прилагательное: der kleine Hund. Существительное остаётся с большой буквы!" },
      { typ: "luecke", e: "🐶", satz: "Da sitzt ___ Hund. Der Hund heißt Bello.", optionen: ["ein", "der", "eine"], ru: "Там сидит собака (ein). Собаку зовут Белло." },
      { typ: "luecke", e: "🐱", satz: "Ich habe ___ Katze. Die Katze ist grau.", optionen: ["eine", "ein", "die"], ru: "У меня есть кошка (eine)." },
      { typ: "luecke", e: "🍰", satz: "Wo ist ___ Kuchen, den Oma gebacken hat?", optionen: ["der", "ein", "eine"], ru: "Где пирог, который испекла бабушка? (der)" },
      { typ: "luecke", e: "🪑", satz: "Wie schreibt man es richtig? ___", optionen: ["der schiefe Stuhl", "der Schiefe stuhl", "Der schiefe stuhl"], ru: "Как правильно? der schiefe Stuhl." },
      { typ: "luecke", e: "📦", satz: "Wie schreibt man es richtig? ___", optionen: ["die bunte Kiste", "die Bunte Kiste", "die bunte kiste"], ru: "Как правильно? die bunte Kiste." },
      { typ: "sag", text: "Ein Treppensatz wächst Stufe für Stufe: Der Hund bellt. – Der kleine Hund bellt. – Der kleine Hund bellt laut.", ru: "Предложение-лесенка растёт ступенька за ступенькой: Собака лает. — Маленькая собака лает. — Маленькая собака громко лает." },
      { typ: "ordnen", e: "🪜", frage: "Bau die Treppe: vom kürzesten zum längsten Satz!", teile: ["Die Katze schläft.", "Die graue Katze schläft.", "Die graue Katze schläft im Korb."], ru: "Построй лесенку: от самого короткого предложения к самому длинному." },
      { typ: "satz", e: "🚗", woerter: ["Das", "rote", "Auto", "fährt", "schnell."], ru: "Красная машина едет быстро." },
      { typ: "sag", text: "Prima, {name}! Wiewörter zwischen Begleiter und Nomen schreibt man klein – das Nomen groß.", ru: "Отлично! Прилагательные между артиклем и существительным пишутся с маленькой, а существительное — с большой буквы." }
    ]
  }
);
// ---------- Schuljahr Deutsch (Lehrplan Sachsen 2025, Kl. 3 und 4) ----------
window.WERKSTATT.push(
  {
    id: "w-sprachvielfalt", lb: "su", stufe: 3, lz: ["de.su.03", "de.sz.06"], name: "Dialekt, Gebärden, Anglizismen", ort: "🗺️", farbe: "#2E9C5A", grund: "#E3F7EF",
    schritte: [
      { typ: "sag", text: "Sprache hat viele Gesichter: Hochdeutsch verstehen alle. Umgangssprache sprechen wir mit Freunden. Dialekte gibt es in vielen Gegenden – in Sachsen zum Beispiel Sächsisch. In der Schule brauchst du dazu Fachwörter: die Bildungssprache.", ru: "У языка много лиц: литературный немецкий понимают все. На разговорном говорим с друзьями. Диалекты есть во многих местах — в Саксонии, например, саксонский. В школе нужны ещё специальные слова — язык обучения." },
      { typ: "luecke", e: "👄", satz: "Auf Sächsisch sagen manche „Gusche“. Auf Hochdeutsch heißt das ___.", optionen: ["Mund", "Hose", "Kuchen"], ru: "По-саксонски говорят «Gusche». На литературном это рот." },
      { typ: "luecke", e: "👍", satz: "„Nu“ heißt auf Sächsisch ___.", optionen: ["ja", "nein", "neu"], ru: "«Nu» по-саксонски значит «да»." },
      { typ: "luecke", e: "😎", satz: "„Das ist voll krass!“ ist ___.", optionen: ["Umgangssprache", "Fachsprache", "ein Gedicht"], ru: "«Это вообще круто!» — разговорная речь." },
      { typ: "luecke", e: "🔬", satz: "Im Unterricht sagst du statt „Das Wasser wird zu Dampf“ genauer: „Das Wasser ___.“", optionen: ["verdampft", "macht irgendwas", "ist weg"], ru: "На уроке вместо «вода превращается в пар» точнее: «вода испаряется»." },
      { typ: "luecke", e: "🤟", satz: "Gehörlose Menschen unterhalten sich oft in ___.", optionen: ["Gebärdensprache mit Händen und Gesicht", "Morsezeichen", "gar keiner Sprache"], ru: "Глухие люди часто общаются на жестовом языке — руками и лицом." },
      { typ: "luecke", e: "🌳", satz: "In der Lausitz leben Sorben. Sie sprechen neben Deutsch auch ___.", optionen: ["Sorbisch", "Englisch", "Sächsisch"], ru: "В Лужице живут сорбы. Они говорят и по-сорбски." },
      { typ: "luecke", e: "💻", satz: "„Laptop“, „Handy“ und „cool“ kommen aus dem Englischen. Solche Wörter heißen ___.", optionen: ["Anglizismen", "Teekesselchen", "Reimwörter"], ru: "«Laptop», «Handy», «cool» пришли из английского. Это англицизмы." },
      { typ: "luecke", e: "🔁", satz: "„Haus“ heißt auf Englisch „house“, auf Niederländisch „huis“. Diese Sprachen sind ___.", optionen: ["miteinander verwandt", "ganz zufällig gleich", "Dialekte"], ru: "«Haus» по-английски house, по-нидерландски huis. Эти языки родственны." },
      { typ: "schreiben", e: "🗺️", frage: "Kennst du Wörter aus einem Dialekt oder einer anderen Sprache? Schreib zwei Sätze: Welches Wort ist es und was bedeutet es auf Hochdeutsch?", woerter: 10, saetze: 2, karten: ["Bei uns sagt man", "Das heißt auf Hochdeutsch", "In meiner Sprache heißt"], ru: "Знаешь слова из диалекта или другого языка? Напиши два предложения: какое слово и что оно значит на литературном немецком." },
      { typ: "sag", text: "Super, {name}! Jede Art zu sprechen hat ihren Platz. Gut ist, wenn man weiß, welche gerade passt.", ru: "Супер! У каждого способа говорить своё место. Хорошо, когда знаешь, какой сейчас подходит." }
    ]
  },
  {
    id: "w-rueckmeldung", lb: "sz", stufe: 3, lz: ["de.sz.06", "me.kk.01"], name: "Rückmeldung geben", ort: "👍", farbe: "#E0574A", grund: "#FFECE8",
    schritte: [
      { typ: "sag", text: "Eine gute Rückmeldung hilft dem anderen weiter: Erst sagst du, was gut war. Dann gibst du einen Tipp – freundlich und genau. Und du sprichst über die Sache, nicht über die Person.", ru: "Хороший отзыв помогает другому: сначала говоришь, что было хорошо. Потом даёшь совет — вежливо и точно. И говоришь о деле, а не о человеке." },
      { typ: "luecke", e: "🎤", satz: "Mia hat einen Vortrag gehalten. Eine gute Rückmeldung ist: „___“", optionen: ["Deine Bilder waren toll. Sprich nächstes Mal etwas langsamer.", "Das war schlecht.", "Du kannst das nicht."], ru: "Мия сделала доклад. Хороший отзыв: «Картинки были отличные. В следующий раз говори медленнее»." },
      { typ: "luecke", e: "📋", satz: "Damit alle wissen, worauf sie achten sollen, vereinbart die Klasse vorher ___.", optionen: ["Kriterien, zum Beispiel: laut, langsam, Blickkontakt", "wer gewinnt", "nichts"], ru: "Чтобы все знали, на что обращать внимание, класс заранее договаривается о критериях." },
      { typ: "luecke", e: "🗣️", satz: "Eine Ich-Botschaft klingt so: „___“", optionen: ["Ich habe dich hinten schlecht verstanden.", "Du nuschelst immer!", "Alle finden dich zu leise."], ru: "Я-высказывание: «Мне сзади было плохо слышно»." },
      { typ: "luecke", e: "🙂", satz: "Wenn du eine Rückmeldung bekommst, ___.", optionen: ["hörst du zu und bedankst dich", "streitest du sofort", "hörst du weg"], ru: "Когда получаешь отзыв, слушаешь и благодаришь." },
      { typ: "luecke", e: "💻", satz: "In einer Videokonferenz gilt: ___", optionen: ["Mikrofon aus, wenn andere sprechen, und melden mit der Hand", "alle reden gleichzeitig", "die Kamera auf den Boden richten"], ru: "В видеоконференции: выключай микрофон, когда говорят другие, и поднимай руку." },
      { typ: "luecke", e: "🤝", satz: "Die Klasse stimmt ab und deine Idee verliert. Du ___.", optionen: ["akzeptierst die Mehrheit", "machst trotzdem deins", "bist für immer beleidigt"], ru: "Класс голосует, и твоя идея проигрывает. Ты принимаешь решение большинства." },
      { typ: "luecke", e: "🪞", satz: "Über das eigene Lernen nachdenken heißt zum Beispiel: „___“", optionen: ["Das Üben mit Karten hat mir geholfen.", "Mir doch egal.", "Fertig ist fertig."], ru: "Размышлять о своём учении: «Мне помогли карточки»." },
      { typ: "schreiben", e: "👍", frage: "Schreib eine Rückmeldung zu einem Bild oder Vortrag, den du kennst: zuerst etwas Gutes, dann einen freundlichen Tipp.", woerter: 12, saetze: 2, karten: ["Mir hat gefallen, dass", "Mein Tipp:", "Vielleicht könntest du", "nächstes Mal"], ru: "Напиши отзыв на знакомый рисунок или доклад: сначала хорошее, потом вежливый совет." },
      { typ: "sag", text: "Prima, {name}! Ehrliche und freundliche Rückmeldungen machen alle in der Klasse besser.", ru: "Отлично! Честные и вежливые отзывы делают лучше весь класс." }
    ]
  },
  {
    id: "w-pro-kontra", lb: "sz", stufe: 3, lz: ["de.sz.06"], name: "Pro und Kontra", ort: "⚖️", farbe: "#2F6FB8", grund: "#E5EFFB",
    schritte: [
      { typ: "sag", text: "In einer Pro-und-Kontra-Runde sammelt man Gründe dafür (pro) und dagegen (kontra). Jeder begründet seine Meinung, hört den anderen zu und knüpft an das Gesagte an: „Ich sehe das anders, weil …“", ru: "В дебатах «за и против» собирают доводы за (pro) и против (kontra). Каждый обосновывает мнение, слушает других и отвечает на сказанное: «Я думаю иначе, потому что…»" },
      { typ: "luecke", e: "🐹", satz: "Frage: Soll unsere Klasse ein Haustier bekommen? „Wir lernen, Verantwortung zu übernehmen.“ Das ist ein ___-Argument.", optionen: ["Pro", "Kontra"], ru: "Вопрос: заводить ли классу питомца? «Мы учимся ответственности» — довод «за»." },
      { typ: "luecke", e: "🐹", satz: "„In den Ferien kann sich niemand um das Tier kümmern.“ Das ist ein ___-Argument.", optionen: ["Kontra", "Pro"], ru: "«На каникулах некому ухаживать за животным» — довод «против»." },
      { typ: "luecke", e: "🐹", satz: "„Manche Kinder sind gegen Tierhaare allergisch.“ Das ist ein ___-Argument.", optionen: ["Kontra", "Pro"], ru: "«У некоторых детей аллергия на шерсть» — довод «против»." },
      { typ: "luecke", e: "🐹", satz: "„Ein Tier macht uns allen Freude.“ Das ist ein ___-Argument.", optionen: ["Pro", "Kontra"], ru: "«Животное радует всех нас» — довод «за»." },
      { typ: "luecke", e: "👂", satz: "Aktiv zuhören heißt: ___", optionen: ["Ich wiederhole kurz, was du gesagt hast, und antworte dann.", "Ich warte nur, bis ich dran bin.", "Ich schaue aufs Handy."], ru: "Активно слушать: кратко повторить сказанное и потом ответить." },
      { typ: "luecke", e: "🔗", satz: "So knüpfst du an: „___“", optionen: ["Ich stimme Ben zu, weil auch ich Tiere mag.", "Egal, was Ben sagt.", "Weiß nicht."], ru: "Так продолжаешь чужую мысль: «Я согласен с Беном, потому что тоже люблю животных»." },
      { typ: "schreiben", e: "⚖️", frage: "Sollen Kinder in der Pause Handys benutzen dürfen? Schreib deine Meinung und zwei Gründe – mit „weil“.", woerter: 15, saetze: 2, pflicht: ["weil"], karten: ["Ich finde", "Ich bin dafür,", "Ich bin dagegen,", "Außerdem", "weil"], ru: "Можно ли детям пользоваться телефоном на перемене? Напиши своё мнение и две причины — с «weil»." },
      { typ: "sag", text: "Stark argumentiert, {name}! Wichtig: Man darf verschiedener Meinung sein und trotzdem Freunde bleiben.", ru: "Сильные доводы! Важно: можно иметь разные мнения и оставаться друзьями." }
    ]
  },
  {
    id: "w-theater", lb: "tm", stufe: 3, lz: ["de.sz.05", "de.tm.04"], name: "Lesetheater und Rollen", ort: "🎭", farbe: "#7B55B8", grund: "#EFE6FF",
    schritte: [
      { typ: "sag", text: "Beim Lesetheater liest jeder seine Rolle vor – mit passender Stimme. Ein Erzähler liest den Text dazwischen. In einem Theaterstück stehen Regieanweisungen in Klammern: Sie sagen, wie man spricht oder was man tut.", ru: "В театре чтения каждый читает свою роль — подходящим голосом. Рассказчик читает текст между репликами. В пьесе указания для актёров стоят в скобках: как говорить или что делать." },
      { typ: "sag", text: "Hier ist ein kleines Stück.", titel: "Der Fuchs und der Rabe", gedicht: ["Erzähler: Ein Rabe sitzt mit einem Käse im Baum.", "Fuchs (schmeichelnd): Du singst bestimmt wunderschön!", "Rabe (stolz): Kraaa!", "Erzähler: Da fällt der Käse herunter.", "Fuchs (lachend): Danke für das Frühstück!"], ru: "Маленькая пьеса «Лиса и ворона»." },
      { typ: "luecke", e: "📝", satz: "„(schmeichelnd)“ ist eine ___.", optionen: ["Regieanweisung", "Überschrift", "Strophe"], ru: "«(льстиво)» — это ремарка, указание для актёра." },
      { typ: "luecke", e: "🦊", satz: "Wie spricht der Fuchs am Ende? ___", optionen: ["lachend", "traurig", "flüsternd"], ru: "Как говорит лиса в конце? Смеясь." },
      { typ: "luecke", e: "📖", satz: "Wer liest die Sätze zwischen den Rollen? ___", optionen: ["der Erzähler", "der Rabe", "das Publikum"], ru: "Кто читает текст между ролями? Рассказчик." },
      { typ: "luecke", e: "🧀", satz: "Eine passende Requisite für den Raben ist ___.", optionen: ["ein Stück Käse", "ein Fahrrad", "ein Regenschirm"], ru: "Подходящий реквизит для вороны — кусок сыра." },
      { typ: "luecke", e: "💬", satz: "Ein Gespräch zwischen zwei Figuren heißt ___.", optionen: ["Dialog", "Kapitel", "Vers"], ru: "Разговор двух персонажей — диалог." },
      { typ: "luecke", e: "👀", satz: "Beim Spielen schaust du ___.", optionen: ["deine Mitspieler und das Publikum an", "nur auf den Boden", "auf die Uhr"], ru: "Во время игры смотришь на партнёров и зрителей." },
      { typ: "aufnehmen", e: "🎭", frage: "Lies die Rolle des Fuchses: erst schmeichelnd, dann lachend! Danach hörst du dich an.", titel: "Der Fuchs", gedicht: ["Du singst bestimmt wunderschön!", "Danke für das Frühstück!"], ru: "Прочитай роль лисы: сначала льстиво, потом смеясь! Потом послушай себя." },
      { typ: "sag", text: "Bühne frei, {name}! Spiel das Stück doch mit deiner Familie – mit Erzähler, Fuchs und Rabe.", ru: "Сцена твоя! Сыграй пьесу с семьёй — с рассказчиком, лисой и вороной." }
    ]
  },
  {
    id: "w-zuhoeren-profi", lb: "sz", stufe: 3, lz: ["de.sz.04", "de.le.07"], name: "Zuhören wie ein Profi", ort: "🎧", farbe: "#E8A33D", grund: "#FFF1D9",
    schritte: [
      { typ: "sag", text: "Bevor du zuhörst, überlege: Was will ich erfahren? Beim Zuhören achtest du auf die Hauptsache und auf wichtige Einzelheiten – und auch darauf, was der Sprecher will. Danach kannst du nachfragen.", ru: "Перед тем как слушать, подумай: что я хочу узнать? Слушая, обращай внимание на главное и важные детали — и на то, чего хочет говорящий. Потом можно переспросить." },
      { typ: "hoertext", e: "📻", text: "Hier ist das Kinderradio. Am Samstag findet im Stadtpark ein Drachenfest statt. Los geht es um 10 Uhr. Bringt eure Drachen mit! Für den schönsten selbstgebauten Drachen gibt es einen Preis. Bei Regen fällt das Fest aus.", frage: "Worum geht es in der Meldung?", optionen: ["um ein Drachenfest im Stadtpark", "um das Wetter am Sonntag", "um einen Bastelladen"], ru: "Детское радио: в субботу в парке праздник воздушных змеев, начало в 10. Приз за самого красивого самодельного змея. При дожде праздник отменяется. О чём сообщение?" },
      { typ: "hoertext", e: "📻", text: "Hier ist das Kinderradio. Am Samstag findet im Stadtpark ein Drachenfest statt. Los geht es um 10 Uhr. Bringt eure Drachen mit! Für den schönsten selbstgebauten Drachen gibt es einen Preis. Bei Regen fällt das Fest aus.", frage: "Wofür gibt es einen Preis?", optionen: ["für den schönsten selbstgebauten Drachen", "für den schnellsten Läufer", "für den größten Drachen aus dem Laden"], ru: "За что приз? За самого красивого самодельного змея." },
      { typ: "hoertext", e: "📻", text: "Hier ist das Kinderradio. Am Samstag findet im Stadtpark ein Drachenfest statt. Los geht es um 10 Uhr. Bringt eure Drachen mit! Für den schönsten selbstgebauten Drachen gibt es einen Preis. Bei Regen fällt das Fest aus.", frage: "Was heißt das versteckt: Wann lohnt sich der Weg NICHT?", optionen: ["wenn es regnet", "wenn die Sonne scheint", "wenn man keinen Preis gewinnt"], ru: "Скрытая информация: когда идти НЕ стоит? Если идёт дождь." },
      { typ: "hoertext", e: "🍦", text: "Lisa sagt: Ich wollte eigentlich Erdbeereis. Aber Erdbeere war leider aus. Dann habe ich Schokolade genommen – und das war sogar noch besser!", frage: "Welches Eis hat Lisa gegessen?", optionen: ["Schokolade", "Erdbeere", "gar keins"], ru: "Лиза: я хотела клубничное, но его не было. Взяла шоколадное — и оно оказалось ещё лучше! Какое мороженое она ела?" },
      { typ: "hoertext", e: "🧩", text: "Rätsel: Ich habe Blätter, aber ich bin kein Baum. Ich habe einen Rücken, aber keine Beine. Man kann mich aufschlagen und in mir lesen.", frage: "Was ist es?", optionen: ["ein Buch", "ein Baum", "ein Stuhl"], ru: "Загадка: у меня есть листы, но я не дерево; есть корешок, но нет ног; меня открывают и читают. Что это? Книга." },
      { typ: "hoertext", e: "📢", text: "Der Schulleiter sagt mit ernster Stimme: Bitte bewahrt Ruhe und verlasst das Gebäude über die Treppe. Das ist eine Übung.", frage: "Was will der Schulleiter?", optionen: ["dass alle ruhig das Haus verlassen", "dass alle singen", "dass alle bleiben"], ru: "Директор серьёзно: сохраняйте спокойствие и выходите по лестнице. Это учения. Чего он хочет?" },
      { typ: "luecke", e: "🙋", satz: "Du hast ein Wort nicht verstanden. Du fragst gezielt: „___“", optionen: ["Was bedeutet „Drachenfest“ genau?", "Hä?", "Nochmal alles!"], ru: "Ты не понял слово. Спрашиваешь точно: «Что именно значит „праздник змеев“?»" },
      { typ: "sag", text: "Super zugehört, {name}! Profis machen sich beim Zuhören kurze Notizen – nur Stichwörter.", ru: "Отлично слушал! Профи делают короткие заметки — только ключевые слова." }
    ]
  },
  {
    id: "w-nomen-erkennen", lb: "sc", stufe: 3, lz: ["de.sc.05", "de.su.04"], name: "Nomen erkennen: groß oder klein?", ort: "🔠", farbe: "#C2337A", grund: "#FDEAF3",
    schritte: [
      { typ: "sag", text: "Nomen schreibt man groß. Aber woran erkennst du sie? Probe: Kann ein Begleiter davorstehen (das, ein, mein, dieses)? Und kann ein Wiewort dazwischen? Dann ist es ein Nomen: das (laute) Bellen, das (leuchtende) Rot.", ru: "Существительные пишутся с большой буквы. Как их узнать? Проба: можно ли поставить перед словом артикль (das, ein, mein, dieses)? И прилагательное между ними? Тогда это существительное: das (laute) Bellen." },
      { typ: "luecke", e: "🐕", satz: "Wie schreibt man es richtig? „Das ___ des Hundes weckt mich.“", optionen: ["Bellen", "bellen"], ru: "Как правильно? «Лай собаки будит меня.» — Bellen." },
      { typ: "luecke", e: "🐕", satz: "Wie schreibt man es richtig? „Der Hund will ___.“", optionen: ["bellen", "Bellen"], ru: "Как правильно? «Собака хочет лаять.» — bellen." },
      { typ: "luecke", e: "🎨", satz: "„Mir gefällt das leuchtende ___.“", optionen: ["Rot", "rot"], ru: "«Мне нравится яркий красный.» — Rot." },
      { typ: "luecke", e: "😊", satz: "Auch Gefühle sind Nomen: „Ich spüre große ___.“", optionen: ["Freude", "freude"], ru: "Чувства тоже существительные: «Я чувствую большую радость.» — Freude." },
      { typ: "luecke", e: "🏠", satz: "Artikelwörter begleiten Nomen: „___ Haus ist blau.“", optionen: ["Mein", "Mich", "Mir"], ru: "Слова-спутники сопровождают существительные: «Мой дом синий.»" },
      { typ: "luecke", e: "🚗", satz: "„___ Auto gehört meiner Tante.“", optionen: ["Dieses", "Diesen", "Dies"], ru: "«Эта машина принадлежит тёте.» — Dieses." },
      { typ: "verbessern", e: "🔍", frage: "Ein Nomen ist kleingeschrieben. Tippe es an!", satz: "Beim schwimmen im See hatten wir viel Spaß.", falsch: "schwimmen", optionen: ["Schwimmen", "schwimmen"], tipp: "Genau! Beim = bei dem – davor steht ein Begleiter.", ru: "Одно существительное написано с маленькой буквы. Найди его." },
      { typ: "luecke", e: "🧸", satz: "Ein Oberbegriff für Puppe, Ball und Teddy ist ___.", optionen: ["Spielzeug", "Kleidung", "Obst"], ru: "Обобщающее слово для куклы, мяча и мишки — игрушки." },
      { typ: "sag", text: "Klasse, {name}! Mit der Begleiter-Probe und der Wiewort-Probe findest du jedes Nomen.", ru: "Класс! Пробой с артиклем и прилагательным найдёшь любое существительное." }
    ]
  },
  {
    id: "w-trennen", lb: "sc", stufe: 3, lz: ["de.sc.05", "de.sc.08"], name: "Trennstrich und Doppelpunkt", ort: "➗", farbe: "#8A6E2F", grund: "#F7F0DD",
    schritte: [
      { typ: "sag", text: "Passt ein Wort nicht mehr in die Zeile, trennst du es nach Silben mit einem Trennstrich: Scho-ko-la-de. Einzelne Buchstaben trennt man nicht ab. Ein Doppelpunkt kündigt etwas an – eine Aufzählung oder wörtliche Rede.", ru: "Если слово не помещается в строку, его переносят по слогам с дефисом: Scho-ko-la-de. Одну букву не отделяют. Двоеточие что-то объявляет — перечисление или прямую речь." },
      { typ: "silben", e: "🍫", wort: "Schokolade", teile: ["Scho", "ko", "la", "de"], ru: "шоколад" },
      { typ: "luecke", e: "➗", satz: "Wie trennt man „Fenster“ richtig? ___", optionen: ["Fens-ter", "Fe-nster", "Fenst-er"], ru: "Как перенести «Fenster»? Fens-ter." },
      { typ: "luecke", e: "➗", satz: "Wie trennt man „Zucker“ richtig? ___", optionen: ["Zu-cker", "Zuc-ker", "Zuck-er"], ru: "Как перенести «Zucker»? Zu-cker (ck не разделяют)." },
      { typ: "luecke", e: "➗", satz: "Welches Wort darf man NICHT trennen? ___", optionen: ["Ofen (O-fen geht nicht)", "Tomate", "Sonne"], ru: "Какое слово нельзя переносить? Ofen — одну букву не отделяют." },
      { typ: "luecke", e: "🧺", satz: "Im Korb liegen___ Äpfel, Birnen und Pflaumen.", optionen: [":", ".", "?"], ru: "В корзине лежат: яблоки, груши и сливы." },
      { typ: "luecke", e: "💬", satz: "Mama ruft___ „Das Essen ist fertig!“", optionen: [":", ",", "?"], ru: "Мама зовёт: «Обед готов!»" },
      { typ: "luecke", e: "🎒", satz: "Für den Ausflug brauchst du___ Brot, Trinkflasche und Regenjacke.", optionen: [":", "!", "?"], ru: "Для экскурсии нужно: хлеб, бутылка и дождевик." },
      { typ: "sag", text: "Super, {name}! Trennstrich am Zeilenende, Doppelpunkt vor Aufzählung oder wörtlicher Rede – jetzt kennst du beide Zeichen.", ru: "Супер! Дефис в конце строки, двоеточие перед перечислением или прямой речью — теперь ты знаешь оба знака." }
    ]
  },
  {
    id: "w-merkwoerter3", lb: "sc", stufe: 3, lz: ["de.sc.08"], name: "Meer, Boot und Reihe", ort: "⛵", farbe: "#1F8FB8", grund: "#E2F4FB",
    schritte: [
      { typ: "sag", text: "Einige Wörter muss man sich merken: Manche haben doppelte Selbstlaute – aa, ee, oo: das Meer, das Boot, der Saal. Und manchmal steht ein h zwischen zwei Silben, damit man sie gut lesen kann: ge-hen, se-hen, Rei-he.", ru: "Некоторые слова надо запомнить: в одних удвоенные гласные — aa, ee, oo: Meer, Boot, Saal. А иногда между слогами стоит h, чтобы их было легко читать: ge-hen, se-hen, Rei-he." },
      { typ: "luecke", e: "🌊", satz: "Im Sommer fahren wir ans ___.", optionen: ["Meer", "Mer", "Mehr"], ru: "Летом мы едем на море (Meer)." },
      { typ: "luecke", e: "⛵", satz: "Das ___ schaukelt auf den Wellen.", optionen: ["Boot", "Bot", "Boht"], ru: "Лодка качается на волнах (Boot)." },
      { typ: "luecke", e: "🍓", satz: "Im Garten wachsen ___.", optionen: ["Beeren", "Beren", "Behren"], ru: "В саду растут ягоды (Beeren)." },
      { typ: "luecke", e: "🏛️", satz: "Das Konzert ist im großen ___.", optionen: ["Saal", "Sal", "Sahl"], ru: "Концерт в большом зале (Saal)." },
      { typ: "luecke", e: "🚶", satz: "Wir ___ zur Schule.", optionen: ["gehen", "geen", "gen"], ru: "Мы идём в школу (gehen)." },
      { typ: "luecke", e: "👀", satz: "Ich kann dich gut ___.", optionen: ["sehen", "seen", "sen"], ru: "Я хорошо тебя вижу (sehen)." },
      { typ: "luecke", e: "🧍🧍🧍", satz: "Stellt euch in einer ___ auf!", optionen: ["Reihe", "Reie", "Reihhe"], ru: "Встаньте в ряд (Reihe)!" },
      { typ: "luecke", e: "🐮", satz: "Das silbentrennende h bleibt: die Kühe – also auch ___.", optionen: ["die Kuh", "die Ku", "die Kuu"], ru: "Разделительное h остаётся: Kühe — значит и Kuh." },
      { typ: "sag", text: "Prima gemerkt, {name}! Schreib dir deine Merkwörter auf Karten und übe jeden Tag drei davon.", ru: "Отлично запомнил! Запиши слова-исключения на карточки и повторяй каждый день по три." }
    ]
  },
  {
    id: "w-email", lb: "sc", stufe: 3, lz: ["de.sc.06", "de.sc.09", "me.kk.01"], name: "E-Mail und Nachricht", ort: "📧", farbe: "#3AA0E0", grund: "#E1F3FF",
    schritte: [
      { typ: "sag", text: "Eine E-Mail hat einen Betreff, eine Anrede, einen Text und einen Gruß. Erwachsenen, die du nicht duzt, schreibst du mit „Sie“ – und „Sie“ und „Ihnen“ schreibt man dann groß. Bei Kurznachrichten im Chat gilt: freundlich bleiben, nichts Gemeines, nichts Privates an Fremde.", ru: "У письма есть тема, обращение, текст и приветствие. Взрослым, к которым обращаешься на «вы», пишешь «Sie» — и «Sie», «Ihnen» тогда пишутся с большой буквы. В чате: будь вежлив, ничего обидного, ничего личного незнакомым." },
      { typ: "luecke", e: "📧", satz: "In den Betreff schreibst du ___.", optionen: ["kurz, worum es geht", "deine Adresse", "einen langen Text"], ru: "В тему письма пишешь кратко, о чём речь." },
      { typ: "luecke", e: "👩‍🏫", satz: "An die Lehrerin: „Können ___ mir bitte die Hausaufgaben schicken?“", optionen: ["Sie", "sie", "du"], ru: "Учительнице: «Можете ли Вы прислать мне домашнее задание?» — Sie." },
      { typ: "luecke", e: "👩‍🏫", satz: "„Vielen Dank, dass ich ___ fragen durfte!“", optionen: ["Sie", "sie", "dich"], ru: "«Спасибо, что я мог спросить Вас!» — Sie." },
      { typ: "luecke", e: "👋", satz: "Eine höfliche Anrede an den Trainer: ___", optionen: ["Sehr geehrter Herr Lange,", "Hey Alter,", "Na?"], ru: "Вежливое обращение к тренеру: «Уважаемый господин Ланге,»" },
      { typ: "luecke", e: "📱", satz: "Eine Sprachnachricht ist praktisch, aber ___.", optionen: ["man kann sie weiterleiten – also überleg, was du sagst", "sie verschwindet immer sofort", "man darf darin schimpfen"], ru: "Голосовое сообщение удобно, но его могут переслать — думай, что говоришь." },
      { typ: "luecke", e: "😉", satz: "Ein Emoji im Chat hilft, weil ___.", optionen: ["man im Text das Gesicht nicht sieht", "es Buchstaben spart", "es Pflicht ist"], ru: "Смайлик в чате помогает, потому что в тексте не видно лица." },
      { typ: "luecke", e: "🔒", satz: "Jemand Fremdes fragt im Chat nach deiner Adresse. Du ___.", optionen: ["antwortest nicht und sagst es deinen Eltern", "schickst sie sofort", "schickst ein Foto vom Haus"], ru: "Незнакомец в чате спрашивает адрес. Ты не отвечаешь и говоришь родителям." },
      { typ: "schreiben", e: "📧", frage: "Schreib eine kurze E-Mail an deine Lehrerin, Frau Berg: Du warst krank und fragst nach den Hausaufgaben. Mit Anrede, Bitte und Gruß!", woerter: 18, saetze: 2, pflicht: ["Sie"], karten: ["Liebe Frau Berg,", "ich war krank.", "Können Sie mir bitte", "Viele Grüße"], ru: "Напиши короткое письмо учительнице фрау Берг: ты болел и спрашиваешь о домашнем задании. С обращением, просьбой и приветствием!" },
      { typ: "sag", text: "Super, {name}! Lies jede Nachricht einmal durch, bevor du sie abschickst.", ru: "Супер! Перечитывай каждое сообщение, прежде чем отправить." }
    ]
  },
  {
    id: "w-tagebuch", lb: "sc", stufe: 3, lz: ["de.sc.07", "de.su.04"], name: "Gefühle in Worte fassen", ort: "📔", farbe: "#C2337A", grund: "#FDEAF3",
    schritte: [
      { typ: "sag", text: "Gefühle kann man nicht anfassen – und trotzdem haben sie Namen: Freude, Angst, Wut, Stolz, Neugier. Das sind Nomen. Wer seine Gefühle benennen kann, kann sie besser aufschreiben und anderen erklären.", ru: "Чувства нельзя потрогать — но у них есть имена: радость, страх, злость, гордость, любопытство. Это существительные. Кто может назвать свои чувства, тому легче их записать и объяснить другим." },
      { typ: "luecke", e: "😊", satz: "Ich habe beim Sportfest gewonnen. Ich spüre ___.", optionen: ["Stolz", "Langeweile", "Angst"], ru: "Я победил на спортивном празднике. Я чувствую гордость." },
      { typ: "luecke", e: "😟", satz: "Morgen ist der Zahnarzttermin. Ich habe ein bisschen ___.", optionen: ["Angst", "Hunger", "Glück"], ru: "Завтра зубной врач. Мне немного страшно (Angst)." },
      { typ: "luecke", e: "😠", satz: "Mein Bruder hat mein Bild zerknittert. Ich spüre ___.", optionen: ["Wut", "Freude", "Müdigkeit"], ru: "Брат помял мой рисунок. Я чувствую злость." },
      { typ: "luecke", e: "🤔", satz: "„Freude“, „Angst“ und „Wut“ sind ___.", optionen: ["Nomen", "Verben", "Adjektive"], ru: "«Радость», «страх», «злость» — существительные." },
      { typ: "luecke", e: "🦋", satz: "Statt „Ich war aufgeregt“ kann man bildhaft schreiben: „___“", optionen: ["Mein Herz klopfte wie wild.", "Ich war da.", "Es war so."], ru: "Вместо «я волновался» образно: «Сердце бешено колотилось»." },
      { typ: "luecke", e: "👀", satz: "Eine Beobachtung schreibt man genau auf: „___“", optionen: ["Die Schnecke kroch langsam über das nasse Blatt.", "Da war was.", "Schnecke."], ru: "Наблюдение записывают точно: «Улитка медленно ползла по мокрому листу»." },
      { typ: "schreiben", e: "📔", frage: "Schreib wie in ein Tagebuch: Was hast du heute erlebt und wie hast du dich dabei gefühlt? Benutze mindestens ein Gefühlswort.", woerter: 15, saetze: 3, karten: ["Heute", "Ich habe mich gefreut,", "Ich war stolz,", "weil", "Freude", "Angst", "Neugier"], ru: "Напиши как в дневник: что было сегодня и что ты чувствовал? Используй хотя бы одно слово-чувство." },
      { typ: "sag", text: "Schön geschrieben, {name}! Dein Text bleibt auf diesem Gerät. Wenn dich etwas sehr bedrückt, sprich mit einem Erwachsenen, dem du vertraust – oder ruf die Nummer gegen Kummer an: 116 111.", ru: "Красиво написано! Текст остаётся на этом устройстве. Если тебя что-то очень тревожит, поговори со взрослым, которому доверяешь, — или позвони по телефону доверия 116 111." }
    ]
  },
  {
    id: "w-anleitung", lb: "sc", stufe: 3, lz: ["de.sc.07", "de.tm.04"], name: "Anleitung und Rezept", ort: "🥣", farbe: "#B5701A", grund: "#FFF1D9",
    schritte: [
      { typ: "sag", text: "Eine Anleitung erklärt Schritt für Schritt, wie etwas geht. Zuerst steht, was man braucht. Dann folgen die Schritte – in der richtigen Reihenfolge, kurz und genau. Oft steht das Verb vorn: Schneide …, Rühre …", ru: "Инструкция объясняет шаг за шагом, как что-то сделать. Сначала — что нужно. Потом шаги — по порядку, коротко и точно. Часто глагол стоит впереди: Нарежь…, Помешай…" },
      { typ: "luecke", e: "🥣", satz: "In einem Rezept steht zuerst ___.", optionen: ["was man braucht (die Zutaten)", "wie es geschmeckt hat", "wer es gegessen hat"], ru: "В рецепте сначала то, что нужно (ингредиенты)." },
      { typ: "ordnen", e: "🍌", frage: "Bananen-Milch: Bring die Schritte in die richtige Reihenfolge!", teile: ["Schäle die Banane.", "Schneide sie in Stücke.", "Gib Milch dazu.", "Püriere alles gut."], ru: "Банановое молоко: расставь шаги по порядку." },
      { typ: "luecke", e: "✂️", satz: "Welcher Satz passt in eine Anleitung? ___", optionen: ["Falte das Papier in der Mitte.", "Gestern war schönes Wetter.", "Ich mag Papier."], ru: "Какое предложение подходит для инструкции? «Сложи бумагу пополам»." },
      { typ: "luecke", e: "📘", satz: "Ein Lexikoneintrag ___.", optionen: ["informiert kurz und sachlich über ein Stichwort", "erzählt ein Abenteuer", "ist ein Gedicht"], ru: "Статья энциклопедии кратко и по делу рассказывает о понятии." },
      { typ: "luecke", e: "🖼️", satz: "Bei einer Bildbeschreibung gehst du ___.", optionen: ["geordnet vor: von vorn nach hinten oder von links nach rechts", "durcheinander", "nur auf die Farben ein"], ru: "При описании картины идёшь по порядку: спереди назад или слева направо." },
      { typ: "luecke", e: "🎲", satz: "Eine Spielanleitung sagt auch, ___.", optionen: ["wer gewinnt", "wie teuer das Spiel war", "wer das Spiel verloren hat"], ru: "В правилах игры сказано и то, кто выигрывает." },
      { typ: "schreiben", e: "🥪", frage: "Schreib eine Anleitung für ein Pausenbrot: Was brauchst du? Dann mindestens drei Schritte, jeder mit dem Verb vorn.", woerter: 18, saetze: 3, karten: ["Du brauchst:", "Nimm", "Bestreiche", "Lege", "Klappe"], ru: "Напиши инструкцию для бутерброда: что нужно? Потом минимум три шага, каждый с глаголом впереди." },
      { typ: "sag", text: "Prima erklärt, {name}! Teste deine Anleitung: Kann jemand nur mit deinem Text das Brot machen?", ru: "Отлично объяснено! Проверь инструкцию: сможет ли кто-то сделать бутерброд только по твоему тексту?" }
    ]
  },
  {
    id: "w-weiterschreiben", lb: "sc", stufe: 3, lz: ["de.sc.07", "de.tm.04"], name: "Weiterschreiben und umschreiben", ort: "🖋️", farbe: "#7B55B8", grund: "#EFE6FF",
    schritte: [
      { typ: "sag", text: "Beim produktiven Schreiben arbeitest du mit fremden Texten: Du schreibst eine Geschichte weiter, erzählst sie aus der Sicht einer anderen Figur oder erfindest ein neues Ende.", ru: "При творческом письме работаешь с чужими текстами: продолжаешь историю, рассказываешь её от лица другого персонажа или придумываешь новый конец." },
      { typ: "hoertext", e: "🗝️", text: "Tim findet auf dem Dachboden eine alte Kiste. Sie ist verschlossen. Unter einem Spinnennetz liegt ein kleiner goldener Schlüssel. Tim steckt ihn ins Schloss – da hört er ein leises Klicken …", frage: "Was findet Tim unter dem Spinnennetz?", optionen: ["einen goldenen Schlüssel", "eine Katze", "einen Brief"], ru: "Тим находит на чердаке старый сундук. Он заперт. Под паутиной — маленький золотой ключ. Тим вставляет его в замок — и слышит тихий щелчок… Что нашёл Тим под паутиной?" },
      { typ: "luecke", e: "🗝️", satz: "Eine passende Fortsetzung beginnt so: ___", optionen: ["Langsam öffnet sich der Deckel …", "Es war einmal ein Hund am Meer.", "Das Rezept braucht Mehl."], ru: "Подходящее продолжение: «Медленно открывается крышка…»" },
      { typ: "luecke", e: "🕷️", satz: "Aus der Sicht der Spinne könnte es heißen: „___“", optionen: ["Ein Riesenjunge zerstört mein Netz!", "Ich bin Tim.", "Ich bin ein Schlüssel."], ru: "С точки зрения паука: «Великан-мальчик рвёт мою паутину!»" },
      { typ: "luecke", e: "🎵", satz: "Beim Schreiben nach Musik ___.", optionen: ["schreibst du auf, welche Bilder dir die Musik in den Kopf malt", "schreibst du die Noten ab", "darf man nicht denken"], ru: "При письме под музыку записываешь картинки, которые она рисует в голове." },
      { typ: "luecke", e: "👫", satz: "Beim kooperativen Schreiben ___.", optionen: ["schreiben mehrere Kinder zusammen an einem Text", "schreibt jeder heimlich", "schreibt nur die Lehrerin"], ru: "При совместном письме несколько детей пишут один текст." },
      { typ: "schreiben", e: "🗝️", frage: "Was ist in der Kiste? Schreib die Geschichte von Tim weiter – mindestens vier Sätze und mit einem Ende.", woerter: 30, saetze: 4, pflicht: ["Kiste"], karten: ["Langsam", "Plötzlich", "Tim staunte,", "Zum Schluss", "Kiste"], ru: "Что в сундуке? Продолжи историю Тима — минимум четыре предложения и с концом." },
      { typ: "sag", text: "Spannend, {name}! Lies deine Fortsetzung jemandem vor und frag: Hättest du ein anderes Ende erfunden?", ru: "Интересно! Прочитай продолжение кому-нибудь и спроси: а ты придумал бы другой конец?" }
    ]
  },
  {
    id: "w-textlupe", lb: "sc", stufe: 3, lz: ["de.sc.07"], name: "Textlupe und Schreibkonferenz", ort: "🔬", farbe: "#2E9C5A", grund: "#E3F7EF",
    schritte: [
      { typ: "sag", text: "Mit der Textlupe untersuchst du einen Text genau. In der Schreibkonferenz lesen Kinder ihre Texte vor und geben sich Tipps. Man prüft drei Dinge: Ist der Text gut verständlich und spannend (Stil)? Stimmen die Sätze (Grammatik)? Stimmt die Rechtschreibung?", ru: "Через «лупу» внимательно изучаешь текст. На «писательской конференции» дети читают тексты и дают советы. Проверяют три вещи: понятен ли и интересен текст (стиль)? Правильны ли предложения (грамматика)? Верна ли орфография?" },
      { typ: "verbessern", e: "🔬", frage: "Stil: Ein Wort kommt zu oft vor. Tippe auf das zweite „schön“ und ersetze es!", satz: "Der Garten war schön und die Blumen waren schön.", falsch: "schön", stelle: 8, optionen: ["bunt", "schön", "gut"], tipp: "Genau! Abwechslung macht den Text lebendig.", ru: "Стиль: слово повторяется. Замени второе «schön»." },
      { typ: "verbessern", e: "🔬", frage: "Grammatik: Hier passt eine Verbform nicht. Tippe sie an!", satz: "Gestern gehen wir in den Zoo.", falsch: "gehen", optionen: ["gingen", "gehen", "geht"], tipp: "Richtig! Gestern – also Vergangenheit: gingen.", ru: "Грамматика: неподходящая форма глагола. Найди её." },
      { typ: "verbessern", e: "🔬", frage: "Rechtschreibung: Ein Wort ist falsch geschrieben.", satz: "Der Fogel singt im Baum.", falsch: "Fogel", optionen: ["Vogel", "Fohgel", "Fogell"], tipp: "Super! Vogel ist ein Merkwort mit V.", ru: "Орфография: слово написано неправильно." },
      { typ: "luecke", e: "📄", satz: "Ein erster Text heißt Entwurf. Das bedeutet: ___", optionen: ["Er darf noch verbessert werden.", "Er ist schon fertig.", "Er wird weggeworfen."], ru: "Первый текст — черновик. Значит, его ещё можно улучшать." },
      { typ: "luecke", e: "💬", satz: "In der Schreibkonferenz sagst du: „___“", optionen: ["Der Anfang ist spannend. Am Ende fehlt mir noch, wie es ausgeht.", "Dein Text ist doof.", "Keine Ahnung."], ru: "На конференции говоришь: «Начало интересное. В конце мне не хватает, чем всё закончилось»." },
      { typ: "luecke", e: "📝", satz: "Beim Überprüfen hilft auch dein Planungszettel, weil ___.", optionen: ["du sehen kannst, ob alles Geplante im Text steht", "er schöner aussieht", "er länger ist"], ru: "При проверке помогает план: видно, всё ли запланированное есть в тексте." },
      { typ: "luecke", e: "💻", satz: "Ein Rechtschreibprogramm am Computer ___.", optionen: ["hilft, aber findet nicht jeden Fehler", "macht alles richtig", "schreibt den Text für dich"], ru: "Программа проверки орфографии помогает, но находит не все ошибки." },
      { typ: "sag", text: "Super geprüft, {name}! Profis überarbeiten ihre Texte oft mehrmals – das ist ganz normal.", ru: "Отлично проверено! Профессионалы часто переделывают тексты по нескольку раз — это нормально." }
    ]
  },
  {
    id: "w-digital-schreiben", lb: "sc", stufe: 3, lz: ["de.sc.07", "me.pp.01"], name: "Schreiben am Gerät", ort: "⌨️", farbe: "#2F6FB8", grund: "#E5EFFB",
    schritte: [
      { typ: "sag", text: "Am Tablet oder Computer kannst du Texte schreiben, verbessern und gestalten: eine Überschrift größer machen, wichtige Wörter fett schreiben, Absätze einfügen. Und du kannst diktieren – also sprechen statt tippen.", ru: "На планшете или компьютере можно писать, исправлять и оформлять тексты: делать заголовок крупнее, выделять важные слова жирным, делать абзацы. А ещё можно диктовать — говорить вместо набора." },
      { typ: "luecke", e: "🅱️", satz: "Ein wichtiges Wort hebst du hervor, indem du es ___ schreibst.", optionen: ["fett", "ganz klein", "weiß auf weiß"], ru: "Важное слово выделяют жирным шрифтом." },
      { typ: "luecke", e: "↩️", satz: "Einen neuen Absatz machst du mit der ___.", optionen: ["Eingabetaste", "Leertaste", "Umschalttaste"], ru: "Новый абзац делают клавишей ввода (Enter)." },
      { typ: "luecke", e: "⇧", satz: "Einen großen Buchstaben bekommst du mit der ___.", optionen: ["Umschalttaste", "Eingabetaste", "Leertaste"], ru: "Большую букву даёт клавиша Shift." },
      { typ: "luecke", e: "🔠", satz: "Die Überschrift macht man meist ___ als den Text.", optionen: ["größer", "kleiner", "unsichtbar"], ru: "Заголовок обычно крупнее текста." },
      { typ: "luecke", e: "🎙️", satz: "Auf der Tablet-Tastatur gibt es oft ein Mikrofon. Damit kannst du ___.", optionen: ["diktieren – du sprichst und das Gerät schreibt", "Musik machen", "telefonieren"], ru: "На клавиатуре планшета часто есть микрофон — можно диктовать." },
      { typ: "luecke", e: "🔍", satz: "Nach dem Diktieren ___.", optionen: ["liest du den Text und verbesserst Fehler", "ist alles automatisch richtig", "löschst du ihn"], ru: "После диктовки читаешь текст и исправляешь ошибки." },
      { typ: "luecke", e: "📑", satz: "Eine übersichtliche Seite hat ___.", optionen: ["Rand, Überschrift und Absätze", "keinen Platz", "nur Bilder"], ru: "Аккуратная страница имеет поля, заголовок и абзацы." },
      { typ: "schreiben", e: "⌨️", frage: "Probier es aus! Schreib drei Sätze über dein Lieblingstier. Tipp: Auf der Tastatur kannst du auch das Mikrofon antippen und diktieren – danach prüfst du den Text.", woerter: 15, saetze: 3, karten: ["Mein Lieblingstier ist", "Es lebt", "Es frisst"], ru: "Попробуй! Напиши три предложения о любимом животном. Совет: на клавиатуре можно нажать микрофон и диктовать — потом проверь текст." },
      { typ: "sag", text: "Klasse, {name}! Frag deine Eltern, ob ihr zusammen ein Schreibprogramm ausprobiert – mit Überschrift, fett und Absätzen.", ru: "Класс! Спроси родителей, можно ли вместе попробовать текстовую программу — с заголовком, жирным шрифтом и абзацами." }
    ]
  },
  {
    id: "w-lesen-fledermaus", lb: "le", stufe: 3, lz: ["de.le.06"], name: "Lesen: Die Fledermaus", ort: "🦇", farbe: "#5A4A8A", grund: "#EEEAF8",
    schritte: [
      { typ: "sag", text: "Bevor du liest: Was weißt du schon über Fledermäuse? Was möchtest du erfahren? Lies dann Absatz für Absatz. Merk dir die Schlüsselwörter – die wichtigsten Wörter jedes Absatzes.", ru: "Перед чтением: что ты уже знаешь о летучих мышах? Что хочешь узнать? Потом читай абзац за абзацем. Запоминай ключевые слова — самые важные слова каждого абзаца." },
      { typ: "luecke", e: "🎯", satz: "Ein gutes Leseziel ist: ___", optionen: ["Ich will wissen, wie Fledermäuse im Dunkeln fliegen.", "Ich will schnell fertig sein.", "Ich will die Wörter zählen."], ru: "Хорошая цель чтения: «Хочу узнать, как летучие мыши летают в темноте»." },
      { typ: "sag", text: "Lies jetzt den Text.", titel: "Die Fledermaus", gedicht: ["Fledermäuse sind Säugetiere, die fliegen können.", "", "Am Tag schlafen sie kopfüber in Höhlen oder auf Dachböden.", "", "Nachts jagen sie Insekten. Dabei rufen sie sehr hohe Töne. Das Echo verrät ihnen, wo ein Hindernis oder eine Mücke ist.", "", "Im Winter halten Fledermäuse Winterschlaf."], ru: "Прочитай текст «Летучая мышь»." },
      { typ: "luecke", e: "🔑", satz: "Das Schlüsselwort im dritten Absatz ist ___.", optionen: ["Echo", "Tag", "Dachböden"], ru: "Ключевое слово третьего абзаца — эхо." },
      { typ: "luecke", e: "🦇", satz: "Wie finden Fledermäuse im Dunkeln den Weg? ___", optionen: ["mit hohen Tönen und dem Echo", "mit einer Taschenlampe", "mit sehr guten Augen"], ru: "Как летучие мыши находят путь в темноте? С помощью высоких звуков и эха." },
      { typ: "luecke", e: "🦇", satz: "Fledermäuse sind ___.", optionen: ["Säugetiere", "Vögel", "Insekten"], ru: "Летучие мыши — млекопитающие." },
      { typ: "luecke", e: "📑", satz: "Eine passende Zwischenüberschrift für den zweiten Absatz ist ___.", optionen: ["Schlafen am Tag", "Die Jagd", "Im Winter"], ru: "Подходящий подзаголовок для второго абзаца — «Сон днём»." },
      { typ: "luecke", e: "📖", satz: "Du kennst das Wort „Hindernis“ nicht. Du ___.", optionen: ["liest den Satz noch einmal oder schlägst nach", "überspringst den ganzen Text", "rätst irgendwas"], ru: "Ты не знаешь слово «Hindernis». Перечитываешь предложение или ищешь в словаре." },
      { typ: "luecke", e: "🤔", satz: "Warum sieht man Fledermäuse im Januar kaum? ___", optionen: ["Sie halten Winterschlaf.", "Sie sind weggeflogen.", "Sie schlafen nur nachts."], ru: "Почему летучих мышей почти не видно в январе? Они в зимней спячке." },
      { typ: "sag", text: "Super gelesen, {name}! Absätze, Schlüsselwörter und Zwischenüberschriften helfen dir, einen Sachtext zu verstehen.", ru: "Отлично прочитано! Абзацы, ключевые слова и подзаголовки помогают понять научный текст." }
    ]
  },
  {
    id: "w-fabel", lb: "tm", stufe: 3, lz: ["de.tm.04"], name: "Fabeln, Witze und Krimis", ort: "🦊", farbe: "#E0574A", grund: "#FFECE8",
    schritte: [
      { typ: "sag", text: "In Fabeln sprechen Tiere und haben menschliche Eigenschaften: Der Fuchs ist schlau, der Löwe stark. Am Ende steht eine Lehre. Daneben gibt es Witze, fantastische Geschichten und Kinderkrimis – jede Textsorte hat ihre Merkmale.", ru: "В баснях говорят животные с человеческими чертами: лиса хитрая, лев сильный. В конце — мораль. Есть ещё анекдоты, фантастические истории и детские детективы — у каждого жанра свои признаки." },
      { typ: "hoertext", e: "🐜", text: "Die Ameise schleppte den ganzen Sommer Körner in ihren Bau. Die Grille sang nur und lachte sie aus. Im Winter hatte die Grille nichts zu essen. Sie bat die Ameise um Hilfe. Die Ameise sagte: Hättest du im Sommer vorgesorgt!", frage: "Was ist die Lehre dieser Fabel?", optionen: ["Wer rechtzeitig vorsorgt, hat später genug.", "Singen ist verboten.", "Ameisen sind gemein."], ru: "Муравей всё лето носил зёрна, стрекоза только пела. Зимой ей нечего есть, она просит муравья о помощи. «Надо было летом позаботиться!» Мораль: кто заранее заботится, у того потом достаточно." },
      { typ: "luecke", e: "🐜", satz: "Welche Eigenschaft hat die Ameise in der Fabel? ___", optionen: ["fleißig", "faul", "ängstlich"], ru: "Какая черта у муравья? Трудолюбивый." },
      { typ: "luecke", e: "🦗", satz: "Wie würdest du die Grille beschreiben? ___", optionen: ["sorglos", "fleißig", "klug"], ru: "Как описать стрекозу? Беспечная." },
      { typ: "luecke", e: "😂", satz: "„Was ist grün und klopft an die Tür? – Ein Klopfsalat!“ Das ist ___.", optionen: ["ein Witz", "eine Fabel", "ein Sachtext"], ru: "«Что зелёное и стучит в дверь? — Стук-салат!» Это шутка." },
      { typ: "luecke", e: "🔍", satz: "In einem Kinderkrimi ___.", optionen: ["wird ein Rätsel oder Fall gelöst", "sprechen immer Tiere", "steht am Ende eine Lehre"], ru: "В детском детективе раскрывают загадку или дело." },
      { typ: "luecke", e: "🐉", satz: "Drachen, Zauberer, geheime Welten – das passt zu ___.", optionen: ["fantastischen Geschichten", "Rezepten", "Lexikonartikeln"], ru: "Драконы, волшебники, тайные миры — это фантастические истории." },
      { typ: "luecke", e: "💭", satz: "Findest du die Antwort der Ameise gerecht? Eine begründete Meinung klingt so: „___“", optionen: ["Ich finde sie streng, weil man Hungernden helfen sollte.", "Weiß nicht.", "Ameise."], ru: "Обоснованное мнение: «По-моему, это строго, потому что голодным надо помогать»." },
      { typ: "sag", text: "Klasse, {name}! Frag in der Bibliothek nach Fabeln von Äsop – manche sind über 2000 Jahre alt.", ru: "Класс! Спроси в библиотеке басни Эзопа — некоторым больше 2000 лет." }
    ]
  },
  {
    id: "w-hoerspiel", lb: "tm", stufe: 3, lz: ["de.tm.04", "me.pp.01"], name: "Hörspiel, Film und Bild", ort: "🎬", farbe: "#8A6E2F", grund: "#F7F0DD",
    schritte: [
      { typ: "sag", text: "Ein Hörspiel erzählt nur mit Tönen: Stimmen, Geräusche und Musik. Ein Film hat dazu Bilder. Ein Erzähler verbindet die Szenen, Sprecherinnen und Sprecher leihen den Figuren ihre Stimmen.", ru: "Радиоспектакль рассказывает только звуками: голоса, шумы и музыка. В фильме есть ещё и картинка. Рассказчик связывает сцены, а актёры озвучивают персонажей." },
      { typ: "luecke", e: "🌧️", satz: "Im Hörspiel prasselt es und es donnert. Du weißt: ___", optionen: ["Es gibt ein Gewitter.", "Die Sonne scheint.", "Es ist Mittag."], ru: "В радиоспектакле стучит и гремит. Ты понимаешь: гроза." },
      { typ: "luecke", e: "🎵", satz: "Plötzlich wird die Musik leise und unheimlich. Das zeigt: ___", optionen: ["Gleich wird es spannend.", "Das Hörspiel ist vorbei.", "Jemand hat Geburtstag."], ru: "Музыка становится тихой и жуткой. Это значит: сейчас будет напряжённо." },
      { typ: "luecke", e: "🎙️", satz: "Wer im Hörspiel die Stimme einer Figur spricht, ist ___.", optionen: ["die Sprecherin oder der Sprecher", "der Illustrator", "der Leser"], ru: "Кто озвучивает персонажа — диктор (Sprecher)." },
      { typ: "luecke", e: "🎨", satz: "Wer die Bilder in einem Buch malt, ist ___.", optionen: ["die Illustratorin oder der Illustrator", "der Erzähler", "der Verlag"], ru: "Кто рисует картинки в книге — иллюстратор." },
      { typ: "luecke", e: "🚪", satz: "Mit welchem Geräusch kannst du im Hörspiel zeigen, dass jemand kommt? ___", optionen: ["Schritte und eine knarrende Tür", "Vogelgezwitscher im Meer", "gar keinem"], ru: "Каким звуком показать, что кто-то пришёл? Шаги и скрип двери." },
      { typ: "luecke", e: "📺", satz: "Film und Buch zur selben Geschichte ___.", optionen: ["können unterschiedlich erzählen – man kann sie vergleichen", "sind immer genau gleich", "haben nichts miteinander zu tun"], ru: "Фильм и книга по одной истории могут рассказывать по-разному — их можно сравнить." },
      { typ: "aufnehmen", e: "🎧", frage: "Mach dein eigenes kleines Hörspiel! Sprich einen Satz als Erzähler und mach dazu ein Geräusch – zum Beispiel Schritte durch Klopfen. Danach hörst du dich an.", ru: "Сделай свой маленький радиоспектакль! Скажи фразу как рассказчик и добавь звук — например шаги постукиванием. Потом послушай." },
      { typ: "sag", text: "Toll, {name}! Achte beim nächsten Hörspiel einmal nur auf die Geräusche – was verraten sie dir?", ru: "Отлично! В следующем радиоспектакле послушай только звуки — что они тебе говорят?" }
    ]
  },
  {
    id: "w-buch-finden", lb: "tm", stufe: 3, lz: ["de.tm.04", "me.sv.01"], name: "Bücher finden und vorstellen", ort: "🔖", farbe: "#1F8FB8", grund: "#E2F4FB",
    schritte: [
      { typ: "sag", text: "Bücher findest du in der Bibliothek, in der Buchhandlung oder im Internet. In der Bibliothek sind sie nach Themen und Autoren geordnet. Im Buch selbst helfen dir Titel, Inhaltsverzeichnis und Kapitel.", ru: "Книги можно найти в библиотеке, книжном магазине или в интернете. В библиотеке они разложены по темам и авторам. В самой книге помогают название, оглавление и главы." },
      { typ: "luecke", e: "📑", satz: "Wo steht, auf welcher Seite ein Kapitel beginnt? ___", optionen: ["im Inhaltsverzeichnis", "auf dem Rücken des Buches", "im letzten Satz"], ru: "Где указано, на какой странице начинается глава? В оглавлении." },
      { typ: "luecke", e: "🦖", satz: "Du suchst ein Sachbuch über Dinosaurier. In der Bibliothek schaust du ___.", optionen: ["im Regal zum Thema Tiere/Urzeit", "bei den Kochbüchern", "bei den Bilderbüchern für Babys"], ru: "Ищешь книгу о динозаврах. В библиотеке смотришь на полке «Животные/Древний мир»." },
      { typ: "luecke", e: "✍️", satz: "Bücher derselben Autorin findest du, weil sie ___.", optionen: ["nach dem Namen geordnet sind", "alle rot sind", "ganz oben stehen"], ru: "Книги одного автора найдёшь, потому что они расставлены по фамилии." },
      { typ: "luecke", e: "📚", satz: "Ein langes Buch ist in ___ unterteilt.", optionen: ["Kapitel", "Strophen", "Zeilen ohne Ende"], ru: "Длинная книга разделена на главы." },
      { typ: "luecke", e: "🧑‍🤝‍🧑", satz: "In einer Geschichte heißen die Personen ___.", optionen: ["Figuren", "Kapitel", "Absätze"], ru: "Люди в истории называются персонажами." },
      { typ: "luecke", e: "🔄", satz: "Was passiert, nennt man die ___.", optionen: ["Handlung", "Illustration", "Bibliothek"], ru: "То, что происходит, называется сюжетом (Handlung)." },
      { typ: "luecke", e: "🎤", satz: "Bei einer Buchvorstellung verrätst du ___.", optionen: ["Titel, Autorin, worum es geht – aber nicht das Ende", "das ganze Ende", "nur den Preis"], ru: "Представляя книгу, называешь название, автора, о чём она — но не конец." },
      { typ: "schreiben", e: "🔖", frage: "Stell dein Lieblingsbuch kurz vor: Titel, Autorin oder Autor, die wichtigste Figur und warum du es magst.", woerter: 20, saetze: 3, pflicht: ["weil"], karten: ["Das Buch heißt", "geschrieben von", "Die Hauptfigur", "Ich mag es, weil"], ru: "Коротко представь любимую книгу: название, автор, главный персонаж и почему она тебе нравится." },
      { typ: "sag", text: "Super, {name}! Vielleicht liest jemand aus deiner Klasse dein Buch, weil du es so gut vorgestellt hast.", ru: "Супер! Может быть, кто-то из класса прочитает твою книгу, потому что ты так хорошо её представил." }
    ]
  },
  {
    id: "w-gemeint", lb: "su", stufe: 3, lz: ["de.su.03", "de.sz.06"], name: "Gesagt und gemeint", ort: "🤭", farbe: "#C2337A", grund: "#FDEAF3",
    schritte: [
      { typ: "sag", text: "Nicht alles ist so gemeint, wie es gesagt wird. „Da hast du Schwein gehabt!“ heißt nicht, dass du ein Schwein hattest – sondern Glück. Das ist eine Redensart. Sprichwörter geben einen Rat: „Übung macht den Meister.“", ru: "Не всё говорится буквально. «Тебе повезло (Schwein gehabt)!» значит не свинью, а удачу. Это идиома. Пословицы дают совет: «Повторение — мать учения»." },
      { typ: "luecke", e: "🐷", satz: "„Schwein gehabt!“ bedeutet ___.", optionen: ["Glück gehabt", "ein Schwein bekommen", "schmutzig sein"], ru: "«Schwein gehabt!» значит «повезло»." },
      { typ: "luecke", e: "🍅", satz: "„Tomaten auf den Augen haben“ bedeutet ___.", optionen: ["etwas nicht sehen", "Tomaten mögen", "müde sein"], ru: "«Помидоры на глазах» значит чего-то не замечать." },
      { typ: "luecke", e: "🏆", satz: "„Übung macht den Meister“ ist ein Sprichwort. Es rät: ___", optionen: ["Wer oft übt, wird gut.", "Meister müssen nie üben.", "Üben ist langweilig."], ru: "«Ученье делает мастером»: кто часто тренируется, становится хорошим." },
      { typ: "luecke", e: "🌧️", satz: "Es regnet in Strömen. Ben sagt: „Na toll, super Wetter!“ Er meint: ___", optionen: ["Das Wetter ist schlecht.", "Das Wetter ist schön.", "Er mag Regen sehr."], ru: "Льёт дождь. Бен: «Ну отлично, прекрасная погода!» Он имеет в виду, что погода плохая." },
      { typ: "luecke", e: "👃", satz: "Jemand ist „naseweis“. Das heißt, er ist ___.", optionen: ["vorlaut und will alles besser wissen", "erkältet", "sehr leise"], ru: "Кто-то «naseweis» — дерзкий всезнайка." },
      { typ: "luecke", e: "🕯️", satz: "Der Schwibbogen im Erzgebirge ist ___.", optionen: ["ein Lichterbogen zur Weihnachtszeit", "ein Musikinstrument", "ein Schwimmbad"], ru: "Швиббоген в Рудных горах — рождественская арка со свечами." },
      { typ: "luecke", e: "🏷️", satz: "Der Familienname „Müller“ kommt vom Beruf ___.", optionen: ["Müller – jemand, der in einer Mühle Mehl macht", "Maler", "Lehrer"], ru: "Фамилия «Мюллер» — от профессии мельника." },
      { typ: "luecke", e: "🤥", satz: "Wer absichtlich etwas Falsches sagt, damit andere es glauben, ___.", optionen: ["lügt", "scherzt immer", "flüstert"], ru: "Кто нарочно говорит неправду, чтобы другие поверили, лжёт." },
      { typ: "sag", text: "Super, {name}! Sammle mit deiner Familie Redensarten – und malt sie wörtlich. Das sieht lustig aus!", ru: "Супер! Соберите с семьёй идиомы — и нарисуйте их буквально. Получится смешно!" }
    ]
  },
  {
    id: "w-proben", lb: "su", stufe: 3, lz: ["de.su.10", "de.su.06"], name: "Umstellen, ersetzen, weglassen", ort: "🔄", farbe: "#5DB84A", grund: "#E3F5DC",
    schritte: [
      { typ: "sag", text: "Mit drei Proben untersuchst du Sätze. Umstellprobe: Wörter, die beim Umstellen zusammenbleiben, sind ein Satzglied. Ersatzprobe: Ein Wort durch ein anderes ersetzen. Weglassprobe: Was kann weg, ohne dass der Satz kaputtgeht?", ru: "Тремя пробами исследуют предложения. Перестановка: слова, которые при перестановке остаются вместе, — член предложения. Замена: заменить слово другим. Пропуск: что можно убрать, не сломав предложение?" },
      { typ: "luecke", e: "🔄", satz: "„Der Hund spielt im Garten.“ umgestellt: „Im Garten ___.“", optionen: ["spielt der Hund", "der Hund spielt", "Hund der spielt"], ru: "Перестановка: «Im Garten spielt der Hund.»" },
      { typ: "luecke", e: "🧩", satz: "Beim Umstellen bleibt zusammen: ___", optionen: ["„im Garten“", "„im“ und „spielt“", "„Hund im“"], ru: "При перестановке вместе остаётся «im Garten»." },
      { typ: "luecke", e: "🔁", satz: "Ersatzprobe: „Lena malt.“ – „___ malt.“", optionen: ["Sie", "Ihr", "Wir"], ru: "Замена: «Лена рисует» — «Она рисует»." },
      { typ: "luecke", e: "✂️", satz: "Weglassprobe: „Der kleine Hund bellt sehr laut.“ Was kann weg? ___", optionen: ["„kleine“ und „sehr laut“", "„Hund“", "„bellt“"], ru: "Пропуск: что можно убрать? «kleine» и «sehr laut»." },
      { typ: "luecke", e: "💎", satz: "Was übrig bleibt, wenn nichts mehr weg kann, ist der ___.", optionen: ["Satzkern: Subjekt und Prädikat", "Begleitsatz", "Artikel"], ru: "Что остаётся, когда ничего больше нельзя убрать, — ядро: подлежащее и сказуемое." },
      { typ: "luecke", e: "🚂", satz: "„Der Zug fährt ab.“ Das Prädikat besteht hier aus ___ Teilen.", optionen: ["zwei: „fährt … ab“", "einem: „fährt“", "drei"], ru: "«Der Zug fährt ab.» Сказуемое из двух частей: fährt … ab." },
      { typ: "satz", e: "🍎", woerter: ["Am", "Morgen", "isst", "Oma", "einen", "Apfel."], ru: "Утром бабушка ест яблоко." },
      { typ: "luecke", e: "📝", satz: "Die Umstellprobe hilft beim Schreiben, weil ___.", optionen: ["die Sätze dann verschieden anfangen", "der Text kürzer wird", "man weniger denken muss"], ru: "Перестановка помогает в письме: предложения начинаются по-разному." },
      { typ: "sag", text: "Klasse, {name}! Mit den drei Proben bist du ein echter Satzforscher.", ru: "Класс! С тремя пробами ты настоящий исследователь предложений." }
    ]
  },
  // ---------- Klasse 4 ----------
  {
    id: "w-ueberzeugen", lb: "su", stufe: 4, lz: ["de.sz.06", "me.ar.01"], name: "Überzeugen und Werbung", ort: "📢", farbe: "#E0574A", grund: "#FFECE8",
    schritte: [
      { typ: "sag", text: "Wer überzeugen will, nennt Argumente und Beispiele. Werbung will auch überzeugen – oft mit Tricks: Übertreibungen („Das beste Eis der Welt!“), bildhaften Vergleichen („weich wie eine Wolke“) und berühmten Gesichtern.", ru: "Кто хочет убедить, приводит доводы и примеры. Реклама тоже убеждает — часто хитростями: преувеличения («Лучшее мороженое в мире!»), образные сравнения («мягкий как облако») и знаменитые лица." },
      { typ: "luecke", e: "🍦", satz: "„Das beste Eis der Welt!“ ist ___.", optionen: ["eine Übertreibung", "ein Beweis", "eine Frage"], ru: "«Лучшее мороженое в мире!» — преувеличение." },
      { typ: "luecke", e: "☁️", satz: "„Das Kissen ist weich wie eine Wolke.“ Das ist ___.", optionen: ["ein bildhafter Vergleich", "eine Lüge", "eine Anleitung"], ru: "«Подушка мягкая как облако» — образное сравнение." },
      { typ: "luecke", e: "⚖️", satz: "Ein Argument mit Beispiel: „Wir sollten mehr Rad fahren, ___“", optionen: ["weil es gesund ist – zum Beispiel stärkt es das Herz.", "weil ich es sage.", "fertig."], ru: "Довод с примером: «…потому что это полезно — например, укрепляет сердце»." },
      { typ: "luecke", e: "🙏", satz: "Höflich überzeugen: Du möchtest, dass die Schule einen Garten bekommt. An die Schulleiterin schreibst du: „___“", optionen: ["Wir würden uns sehr freuen, wenn …", "Mach das jetzt!", "Alle anderen Schulen haben das!!!"], ru: "Вежливо убедить директора: «Мы были бы очень рады, если бы…»" },
      { typ: "luecke", e: "🧐", satz: "Werbung zeigt nie ___.", optionen: ["die Nachteile eines Produkts", "schöne Bilder", "fröhliche Menschen"], ru: "Реклама никогда не показывает недостатки товара." },
      { typ: "luecke", e: "🗳️", satz: "Auch Politiker wollen überzeugen. Kluge Zuhörer ___.", optionen: ["prüfen die Gründe, bevor sie zustimmen", "glauben alles", "hören nie zu"], ru: "Политики тоже убеждают. Умные слушатели проверяют доводы, прежде чем согласиться." },
      { typ: "schreiben", e: "📢", frage: "Überzeuge deine Familie von einem Ausflugsziel! Schreib zwei Argumente mit „weil“ und einem Beispiel.", woerter: 20, saetze: 3, pflicht: ["weil"], karten: ["Wir sollten", "weil", "zum Beispiel", "Außerdem"], ru: "Убеди семью поехать на экскурсию! Напиши два довода с «weil» и примером." },
      { typ: "sag", text: "Überzeugend, {name}! Und wenn du Werbung siehst, frag dich: Welchen Trick benutzt sie gerade?", ru: "Убедительно! А когда видишь рекламу, спроси себя: какой приём она сейчас использует?" }
    ]
  },
  {
    id: "w-interview", lb: "sz", stufe: 4, lz: ["de.sz.07", "de.sz.06"], name: "Interview und Streitschlichtung", ort: "🎙️", farbe: "#2F6FB8", grund: "#E5EFFB",
    schritte: [
      { typ: "sag", text: "In einem Interview stellst du Fragen und hörst genau zu. Offene Fragen (Wie? Warum?) bringen lange Antworten, Ja-Nein-Fragen kurze. Bei einem Streit helfen Streitschlichter: Jeder erzählt seine Sicht, die anderen hören zu, dann sucht man gemeinsam eine Lösung.", ru: "В интервью задаёшь вопросы и внимательно слушаешь. Открытые вопросы (Как? Почему?) дают длинные ответы, вопросы да/нет — короткие. В споре помогают примирители: каждый рассказывает свою точку зрения, другие слушают, потом вместе ищут решение." },
      { typ: "luecke", e: "❓", satz: "Welche Frage ist offen? ___", optionen: ["Warum bist du Försterin geworden?", "Bist du Försterin?", "Magst du Bäume?"], ru: "Какой вопрос открытый? «Почему вы стали лесничим?»" },
      { typ: "luecke", e: "📝", satz: "Vor einem Interview ___.", optionen: ["schreibst du deine Fragen auf und ordnest sie", "überlegst du nichts", "erzählst du die Antworten"], ru: "Перед интервью записываешь и упорядочиваешь вопросы." },
      { typ: "luecke", e: "🎙️", satz: "Die Försterin antwortet. Du ___.", optionen: ["hörst zu und fragst nach, wenn etwas unklar ist", "unterbrichst sie", "liest schon die nächste Frage"], ru: "Лесничий отвечает. Ты слушаешь и переспрашиваешь, если что-то непонятно." },
      { typ: "luecke", e: "🔒", satz: "Bevor du ein Interview aufnimmst oder veröffentlichst, ___.", optionen: ["fragst du die Person um Erlaubnis", "machst du es heimlich", "postest du es sofort"], ru: "Прежде чем записывать или публиковать интервью, спрашиваешь разрешения." },
      { typ: "ordnen", e: "🕊️", frage: "So läuft eine Streitschlichtung. Bring die Schritte in die richtige Reihenfolge!", teile: ["Beide erzählen ihre Sicht.", "Jeder sagt, wie er sich fühlt.", "Gemeinsam Lösungen sammeln.", "Eine Lösung vereinbaren."], ru: "Так проходит примирение. Расставь шаги по порядку." },
      { typ: "luecke", e: "⚖️", satz: "Der Streitschlichter ___.", optionen: ["hilft beiden, entscheidet aber nicht, wer schuld ist", "bestraft den Schuldigen", "hält zu seinem Freund"], ru: "Примиритель помогает обоим, но не решает, кто виноват." },
      { typ: "schreiben", e: "🎙️", frage: "Du interviewst einen Erwachsenen über seinen Beruf. Schreib drei offene Fragen.", woerter: 12, saetze: 3, karten: ["Warum", "Wie", "Was gefällt Ihnen", "Welche"], ru: "Ты берёшь интервью у взрослого о его профессии. Напиши три открытых вопроса." },
      { typ: "sag", text: "Super, {name}! Führ dein Interview wirklich – mit jemandem aus der Familie. Notiere die Antworten in Stichwörtern.", ru: "Супер! Проведи интервью по-настоящему — с кем-то из семьи. Запиши ответы ключевыми словами." }
    ]
  },
  {
    id: "w-fair", lb: "sz", stufe: 4, lz: ["me.kk.01", "de.sz.06"], name: "Fair reden – auch im Netz", ort: "💚", farbe: "#2E9C5A", grund: "#E3F7EF",
    schritte: [
      { typ: "sag", text: "Worte können verletzen. Wer andere wegen ihrer Herkunft, ihres Aussehens oder ihrer Sprache beschimpft, grenzt sie aus. Das gilt auch im Netz: Hinter jedem Bildschirm sitzt ein Mensch mit Gefühlen.", ru: "Слова могут ранить. Кто оскорбляет других из-за происхождения, внешности или языка, исключает их. В сети тоже: за каждым экраном сидит человек с чувствами." },
      { typ: "luecke", e: "💬", satz: "Im Klassenchat schreibt jemand gemeine Sachen über ein Kind. Du ___.", optionen: ["machst nicht mit und sagst es einem Erwachsenen", "schickst ein lachendes Emoji", "leitest es weiter"], ru: "В чате класса кто-то пишет гадости о ребёнке. Ты не участвуешь и говоришь взрослому." },
      { typ: "luecke", e: "🗣️", satz: "Ein Kind spricht mit Akzent. Fair ist: ___", optionen: ["Ihm zuhören wie allen anderen.", "Es nachäffen.", "Es auslachen."], ru: "Ребёнок говорит с акцентом. Справедливо — слушать его, как всех." },
      { typ: "luecke", e: "📱", satz: "Eine Regel für Gespräche im Netz: ___", optionen: ["Schreib nichts, was du nicht auch ins Gesicht sagen würdest.", "Im Netz ist alles erlaubt.", "Großbuchstaben heißen: Ich bin freundlich."], ru: "Правило для общения в сети: не пиши того, чего не сказал бы в лицо." },
      { typ: "luecke", e: "🧑‍🦽", satz: "Statt „der Behinderte“ sagt man respektvoll: ___", optionen: ["der Junge im Rollstuhl / Ben", "der Kranke", "der da"], ru: "Вместо «инвалид» уважительно: «мальчик в коляске» / по имени." },
      { typ: "luecke", e: "🤝", satz: "Jemand hat eine andere Meinung als du. Fair ist: ___", optionen: ["„Ich sehe das anders, weil …“", "„Du bist dumm.“", "Ihn blockieren."], ru: "У кого-то другое мнение. Справедливо: «Я думаю иначе, потому что…»" },
      { typ: "luecke", e: "📞", satz: "Wenn dich jemand im Netz oder in der Schule fertigmacht, ___.", optionen: ["sprichst du mit einer Vertrauensperson oder rufst die Nummer gegen Kummer an: 116 111", "bleibst du allein damit", "schlägst du zurück"], ru: "Если тебя травят в сети или в школе, говоришь с доверенным человеком или звонишь 116 111." },
      { typ: "sag", text: "Danke, {name}! Fair reden macht die Klasse zu einem Ort, an dem sich alle wohlfühlen. Und du bist nie allein: Die Nummer gegen Kummer (116 111) ist kostenlos.", ru: "Спасибо! Честное общение делает класс местом, где всем хорошо. И ты никогда не один: телефон доверия 116 111 бесплатный." }
    ]
  },
  {
    id: "w-rechtschreib4", lb: "sc", stufe: 4, lz: ["de.sc.04", "de.sc.08"], name: "Rechtschreib-Profi: alles gemischt", ort: "🏅", farbe: "#8A6E2F", grund: "#F7F0DD",
    schritte: [
      { typ: "sag", text: "Jetzt kommen alle Werkzeuge zusammen: Verlängern, Ableiten, Zerlegen, Merken – und der Bindestrich. Er verbindet Wörter mit Zahlen oder Namen: der 3-Jährige, die Karl-May-Straße, die U-Bahn.", ru: "Теперь все инструменты вместе: удлинять, выводить, разбирать, запоминать — и дефис. Он соединяет слова с цифрами или именами: der 3-Jährige, die Karl-May-Straße, die U-Bahn." },
      { typ: "luecke", e: "🎂", satz: "Meine Schwester ist ein ___.", optionen: ["5-jähriges Mädchen", "5 jähriges Mädchen", "5jähriges Mädchen"], ru: "Моя сестра — пятилетняя девочка (5-jähriges)." },
      { typ: "luecke", e: "🚇", satz: "Wir fahren mit der ___.", optionen: ["U-Bahn", "U Bahn", "Ubahn"], ru: "Мы едем на метро (U-Bahn)." },
      { typ: "luecke", e: "🏠", satz: "Ich wohne in der ___.", optionen: ["Anne-Frank-Straße", "Anne Frank Straße", "Annefrankstraße"], ru: "Я живу на улице Анны Франк (Anne-Frank-Straße)." },
      { typ: "luecke", e: "🌲", satz: "Die ___ sind dicht.", optionen: ["Wälder", "Welder", "Wällder"], ru: "Леса густые (Wälder — от Wald)." },
      { typ: "luecke", e: "🚲", satz: "Er ___ jeden Tag Rad.", optionen: ["fährt", "fäht", "fehrt"], ru: "Он каждый день ездит на велосипеде (fährt — от fahren)." },
      { typ: "luecke", e: "🥛", satz: "Ich trinke ein Glas ___.", optionen: ["Milch", "Millch", "Milsch"], ru: "Я пью стакан молока." },
      { typ: "luecke", e: "🦷", satz: "Der ___ wackelt.", optionen: ["Zahn", "Zan", "Zaan"], ru: "Зуб шатается (Zahn — слово с h)." },
      { typ: "luecke", e: "🔤", satz: "a, e, i, o, u heißen auch ___.", optionen: ["Vokale", "Konsonanten", "Bindestriche"], ru: "a, e, i, o, u называются также гласными (Vokale)." },
      { typ: "luecke", e: "🔤", satz: "b, d, g, k, l, m heißen auch ___.", optionen: ["Konsonanten", "Vokale", "Umlaute"], ru: "b, d, g, k, l, m — согласные (Konsonanten)." },
      { typ: "verbessern", e: "🔍", frage: "Finde den Fehler und verbessere!", satz: "Im Winter ist es kald draußen.", falsch: "kald", optionen: ["kalt", "kallt", "kaldt"], tipp: "Verlängern: kälter – also mit t!", ru: "Найди ошибку и исправь." },
      { typ: "sag", text: "Rechtschreib-Profi, {name}! Merk dir deine Fehlerwörter – die sind nämlich bei jedem anders.", ru: "Профи правописания! Запоминай свои слова-ошибки — у каждого они свои." }
    ]
  },
  {
    id: "w-lesen4", lb: "le", stufe: 4, lz: ["de.le.07", "de.le.08"], name: "Lesen: Bienen in der Stadt", ort: "🐝", farbe: "#E8A33D", grund: "#FFF1D9",
    schritte: [
      { typ: "sag", text: "Profi-Leser klären zuerst: Was für ein Text ist das? Was erwarte ich? Beim Lesen markieren sie Wichtiges. Danach fassen sie zusammen und stellen eigene Fragen an den Text.", ru: "Профи-читатели сначала выясняют: что это за текст? Чего я жду? Во время чтения отмечают важное. Потом пересказывают кратко и задают тексту свои вопросы." },
      { typ: "sag", text: "Lies den Text aus einer Kinder-Internetseite. Unterstrichene Wörter wären dort Links zu mehr Wissen.", titel: "Bienen in der Stadt", gedicht: ["Immer mehr Bienen leben mitten in der Stadt.", "", "Auf Balkonen und in Parks finden sie viele verschiedene Blüten. Auf dem Land gibt es dagegen oft große Felder mit nur einer Pflanze.", "", "Manche Menschen halten Bienen auf dem Dach. Der Stadthonig schmeckt oft nach vielen Blüten.", "", "Du kannst helfen: Pflanze Blumen auf dem Balkon und lass im Garten eine Ecke wild wachsen. ➜ Mehr zu Wildbienen"], ru: "Прочитай текст с детского сайта «Пчёлы в городе»." },
      { typ: "luecke", e: "📰", satz: "Das ist ___.", optionen: ["ein Sachtext", "ein Märchen", "ein Gedicht"], ru: "Это научно-популярный текст." },
      { typ: "luecke", e: "🌸", satz: "Warum finden Bienen in der Stadt oft gut Futter? ___", optionen: ["Es gibt viele verschiedene Blüten.", "Es gibt große Felder.", "Es ist dort wärmer im Winter."], ru: "Почему пчёлы в городе находят много корма? Много разных цветов." },
      { typ: "luecke", e: "🌾", satz: "Was ist auf dem Land oft schwierig? ___", optionen: ["große Felder mit nur einer Pflanze", "zu viele Balkone", "zu viel Honig"], ru: "Что часто сложно в деревне? Большие поля с одним растением." },
      { typ: "luecke", e: "🔗", satz: "„➜ Mehr zu Wildbienen“ ist ___.", optionen: ["ein Link zu einer anderen Seite", "eine Überschrift für den ganzen Text", "ein Rätsel"], ru: "«➜ Больше о диких пчёлах» — ссылка на другую страницу." },
      { typ: "luecke", e: "✂️", satz: "Der Text hat vier Sinnabschnitte. Im letzten geht es um ___.", optionen: ["was du tun kannst", "den Geschmack von Honig", "Bienen auf dem Land"], ru: "В последнем смысловом отрезке речь о том, что можешь сделать ты." },
      { typ: "luecke", e: "❓", satz: "Eine eigene Frage an den Text ist: ___", optionen: ["Welche Blumen mögen Bienen am liebsten?", "Wie heißt der Text?", "Wie viele Absätze hat er?"], ru: "Свой вопрос к тексту: «Какие цветы пчёлы любят больше всего?»" },
      { typ: "schreiben", e: "🐝", frage: "Fass den Text in zwei bis drei Sätzen zusammen: Worum geht es, und was kann man tun?", woerter: 15, saetze: 2, pflicht: ["Bienen"], karten: ["In dem Text geht es um", "Bienen", "Man kann helfen,", "Blumen"], ru: "Кратко перескажи текст в двух-трёх предложениях: о чём он и что можно сделать?" },
      { typ: "sag", text: "Super, {name}! Zusammenfassen heißt: nur das Wichtigste, mit eigenen Worten.", ru: "Супер! Пересказать кратко — значит только главное, своими словами." }
    ]
  },
  {
    id: "w-sage-comic", lb: "tm", stufe: 4, lz: ["de.tm.05"], name: "Sage, Schwank und Comic", ort: "💥", farbe: "#7B55B8", grund: "#EFE6FF",
    schritte: [
      { typ: "sag", text: "Eine Sage spielt an einem echten Ort und hat oft einen wahren Kern – dazu kommen Wunder und Riesen. Ein Schwank ist eine lustige Geschichte, in der jemand überlistet wird. Ein Comic erzählt mit Bildern und Sprechblasen.", ru: "Сказание (Sage) происходит в реальном месте и часто имеет правдивую основу — плюс чудеса и великаны. Шванк — смешная история, где кого-то перехитрили. Комикс рассказывает картинками и пузырями с репликами." },
      { typ: "hoertext", e: "🏰", text: "Auf dem Königstein in Sachsen erzählt man sich: Ein Page schlief einst auf einem schmalen Felsvorsprung ein – hoch über der Elbe. Man band ihn vorsichtig fest und weckte ihn mit Trompeten. Noch heute heißt die Stelle Pagenbett.", frage: "Warum ist das eine Sage und kein Märchen?", optionen: ["Sie spielt an einem echten Ort, dem Königstein.", "Sie beginnt mit „Es war einmal“.", "Tiere sprechen darin."], ru: "На крепости Кёнигштайн рассказывают: паж однажды уснул на узком выступе скалы высоко над Эльбой. Его осторожно привязали и разбудили трубами. Место до сих пор называется «Ложе пажа». Почему это сказание, а не сказка? Оно происходит в реальном месте." },
      { typ: "luecke", e: "🎺", satz: "Wie hat man den Pagen geweckt? ___", optionen: ["mit Trompeten", "mit Wasser", "gar nicht"], ru: "Как разбудили пажа? Трубами." },
      { typ: "luecke", e: "😄", satz: "Till Eulenspiegel nimmt Befehle wörtlich und führt so andere an der Nase herum. Das ist typisch für ___.", optionen: ["einen Schwank", "einen Sachtext", "ein Gedicht"], ru: "Тиль Уленшпигель понимает приказы буквально и дурачит других. Это типично для шванка." },
      { typ: "luecke", e: "💬", satz: "Was eine Figur im Comic sagt, steht ___.", optionen: ["in einer Sprechblase", "in einer Fußnote", "im Inhaltsverzeichnis"], ru: "Что говорит персонаж комикса, стоит в пузыре." },
      { typ: "luecke", e: "💭", satz: "Was eine Figur nur denkt, zeigt ___.", optionen: ["eine Gedankenblase mit Kringeln", "ein Ausrufezeichen", "ein Absatz"], ru: "Что персонаж только думает, показывает пузырь-мысль с кружочками." },
      { typ: "luecke", e: "💥", satz: "„BOOM!“ und „ZACK!“ im Comic zeigen ___.", optionen: ["Geräusche", "Namen", "Zahlen"], ru: "«БУМ!» и «БАЦ!» в комиксе показывают звуки." },
      { typ: "luecke", e: "📚", satz: "Die Sage gibt es als Text und als Comic. Beim Vergleichen fällt auf: ___", optionen: ["Der Comic zeigt vieles im Bild, was der Text beschreibt.", "Beide sind völlig gleich.", "Der Comic hat keine Handlung."], ru: "Сравнивая текст и комикс: комикс показывает картинкой то, что текст описывает." },
      { typ: "luecke", e: "🔍", satz: "Du behauptest: „Der Page war sehr müde.“ Du belegst es mit der Textstelle: ___", optionen: ["„schlief einst auf einem Felsvorsprung ein“", "„in Sachsen“", "„noch heute“"], ru: "Ты утверждаешь: «Паж очень устал». Подтверждаешь цитатой: «уснул на выступе скалы»." },
      { typ: "sag", text: "Klasse, {name}! Viele Orte in Sachsen haben Sagen – frag doch mal, welche es bei euch gibt.", ru: "Класс! У многих мест в Саксонии есть сказания — спроси, какие есть у вас." }
    ]
  },
  {
    id: "w-medien4", lb: "tm", stufe: 4, lz: ["me.ar.02", "me.sa.01", "de.tm.05"], name: "Medien prüfen und schützen", ort: "🛡️", farbe: "#1F8FB8", grund: "#E2F4FB",
    schritte: [
      { typ: "sag", text: "Nicht alles im Internet stimmt. Prüfe: Wer hat es geschrieben? Steht es auch woanders? Klingt es zu verrückt, um wahr zu sein? Und schütze dich: Name, Adresse und Fotos bleiben privat. Fremde Bilder darfst du nicht einfach verwenden.", ru: "Не всё в интернете правда. Проверь: кто написал? Есть ли это где-то ещё? Не слишком ли безумно, чтобы быть правдой? И защищай себя: имя, адрес и фото — личное. Чужие картинки нельзя просто так использовать." },
      { typ: "luecke", e: "🦄", satz: "Eine Seite meldet: „Forscher finden Einhörner im Erzgebirge!“ Du ___.", optionen: ["prüfst, ob seriöse Kinderseiten das auch melden", "glaubst es sofort", "teilst es mit allen"], ru: "Сайт сообщает: «Учёные нашли единорогов в Рудных горах!» Ты проверяешь, сообщают ли это надёжные детские сайты." },
      { typ: "luecke", e: "📰", satz: "Absichtlich falsche Nachrichten nennt man ___.", optionen: ["Fake News", "Schlagzeilen", "Hörspiele"], ru: "Нарочно ложные новости называют фейками (Fake News)." },
      { typ: "luecke", e: "🔒", satz: "Was darfst du im Netz verraten? ___", optionen: ["deinen Spitznamen in einem Kinderspiel", "deine Adresse", "dein Passwort"], ru: "Что можно сообщить в сети? Ник в детской игре." },
      { typ: "luecke", e: "📷", satz: "Du willst ein Foto von deiner Freundin posten. Zuerst ___.", optionen: ["fragst du sie, ob sie einverstanden ist", "postest du es einfach", "machst du sie unkenntlich und postest es"], ru: "Хочешь выложить фото подруги. Сначала спрашиваешь её согласие." },
      { typ: "luecke", e: "©️", satz: "Ein Bild aus dem Internet für dein Referat: ___", optionen: ["Nur verwenden, wenn es erlaubt ist, und angeben, woher es ist.", "Einfach nehmen, es ist ja im Internet.", "Als eigenes Bild ausgeben."], ru: "Картинка из интернета для доклада: только если разрешено, и указать источник." },
      { typ: "luecke", e: "📓", satz: "In einem Medientagebuch schreibst du auf, ___.", optionen: ["wann und wie lange du welche Medien nutzt", "deine Passwörter", "die Adressen deiner Freunde"], ru: "В дневник медиа записываешь, когда и сколько какими медиа пользуешься." },
      { typ: "schreiben", e: "📓", frage: "Schreib einen Eintrag für dein Medientagebuch: Welche Medien hast du gestern genutzt – Buch, Tablet, Fernsehen, Hörspiel – und wie lange ungefähr?", woerter: 15, saetze: 2, karten: ["Gestern habe ich", "Minuten", "gelesen", "gehört", "geschaut"], ru: "Напиши запись в дневник медиа: какими медиа ты вчера пользовался и примерно сколько времени?" },
      { typ: "sag", text: "Stark, {name}! Wer prüft, bevor er glaubt oder teilt, ist ein echter Medienprofi.", ru: "Сильно! Кто проверяет, прежде чем поверить или поделиться, — настоящий профи медиа." }
    ]
  },
  {
    id: "w-ergaenzungen", lb: "su", stufe: 4, lz: ["de.su.10", "de.su.11"], name: "Sätze erweitern: Ergänzungen", ort: "🎲", farbe: "#5DB84A", grund: "#E3F5DC",
    schritte: [
      { typ: "sag", text: "Subjekt und Prädikat sind der Satzkern: Mia schenkt. Das Verb verlangt aber mehr: Wem schenkt sie etwas? Was schenkt sie? Diese Satzglieder heißen Ergänzungen: Mia schenkt ihrem Opa ein Bild.", ru: "Подлежащее и сказуемое — ядро предложения: Mia schenkt. Но глагол требует большего: кому она дарит? что дарит? Эти члены предложения — дополнения: Mia schenkt ihrem Opa ein Bild." },
      { typ: "luecke", e: "🎁", satz: "„Mia schenkt ihrem Opa ein Bild.“ Was schenkt Mia? ___", optionen: ["ein Bild", "ihrem Opa", "Mia"], ru: "Что дарит Мия? Картину." },
      { typ: "luecke", e: "🎁", satz: "Wem schenkt Mia das Bild? ___", optionen: ["ihrem Opa", "ein Bild", "schenkt"], ru: "Кому Мия дарит картину? Дедушке." },
      { typ: "luecke", e: "🧩", satz: "„ihrem Opa“ und „ein Bild“ sind ___.", optionen: ["Ergänzungen", "Prädikate", "Subjekte"], ru: "«ihrem Opa» и «ein Bild» — дополнения." },
      { typ: "luecke", e: "⚽", satz: "Welche Ergänzung braucht der Satz? „Tim sucht ___.“", optionen: ["seinen Ball", "schnell", "gestern"], ru: "Какое дополнение нужно? «Тим ищет свой мяч.»" },
      { typ: "luecke", e: "🐟", satz: "Welche Ergänzung braucht der Satz? „Der Fisch gehört ___.“", optionen: ["dem Kater", "laut", "nie"], ru: "Какое дополнение нужно? «Рыба принадлежит коту.»" },
      { typ: "luecke", e: "📌", satz: "Einzahl heißt auch Singular, Mehrzahl heißt ___.", optionen: ["Plural", "Perfekt", "Futur"], ru: "Единственное число — Singular, множественное — Plural." },
      { typ: "sag", text: "Würfelsätze: Jeder Würfel hat Wörter für eine Stelle im Satz – Subjekt, Prädikat, Ergänzung. Es entstehen lustige Sätze!", ru: "Предложения-кубики: на каждом кубике слова для одного места в предложении — подлежащее, сказуемое, дополнение. Получаются смешные предложения!" },
      { typ: "satz", e: "🎲", woerter: ["Der", "Drache", "schenkt", "der", "Lehrerin", "eine", "Banane."], ru: "Дракон дарит учительнице банан." },
      { typ: "schreiben", e: "🎲", frage: "Bau eigene Würfelsätze! Schreib zwei verrückte Sätze mit Subjekt, Prädikat und mindestens einer Ergänzung.", woerter: 10, saetze: 2, karten: ["Der Pinguin", "Meine Oma", "schenkt", "zeigt", "dem Bürgermeister", "eine Pizza", "einen Regenschirm"], ru: "Составь свои предложения-кубики! Два безумных предложения с подлежащим, сказуемым и хотя бы одним дополнением." },
      { typ: "sag", text: "Super, {name}! Mit Ergänzungen werden Sätze genau – und mit Würfeln auch richtig lustig.", ru: "Супер! С дополнениями предложения становятся точными — а с кубиками и весёлыми." }
    ]
  }
);
