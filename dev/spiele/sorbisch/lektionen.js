// Sorbisch (Obersorbisch) mit Papagei Paula – nur nach Eltern-Wahl (eltern.sorbisch.an), 28.10.2026.
// Nach dem Lehrplan Sachsen „Sorbisch als Fremdsprache“ (Grundschule): Kl. 1/2 Themenkreise (stufe 1), Kl. 3/4 Lernbereiche 1–10 + „Mein Portfolio“ (stufe 3).
// Lektion wie Englisch: { id, lb, stufe, lz, name, e, farbe, grund, intro: { de, ru }, woerter: [{ so, de, ru, e }], extra: [satz|wahl], ende: { de, ru } }
//   satz { de, ru, woerter: ["Ja", "rěkam", "Mia."], e? } – sorbischen Satz aus Wörtern bauen
//   wahl { frage, ru, optionen: [richtig, falsch, falsch], e?, warum? } – erste Option richtig
// PRÜFSTATUS: Alle sorbischen Wörter und Sätze sind ENTWÜRFE (status: entwurf). Sie erscheinen auf der Hauptseite erst, wenn die Lektion
// in geprueft.js freigegeben ist (Prüfliste: spiele/sorbisch/pruefen.html). Russische Hilfetexte sind ebenfalls Entwürfe.
// Jedes Wort braucht ein eigenes Emoji (innerhalb der Lektion).
window.SORBISCH_STATUS = "entwurf";
window.SORBISCH_LB = [[1, "👋 Ja, moja swójba a moji přećeljo – Familie und Freunde"], [2, "👕 Moje ćěło a moja drasta – Körper, Kleidung, Befinden"],
  [3, "🏠 Doma – Zuhause"], [4, "🏫 W šuli – In der Schule"], [5, "🐶 Zwěrjata – Haus- und Zootiere"], [6, "⚽ Sport a swobodny čas – Freizeit"],
  [7, "🛒 Nakupować – Beim Einkaufen"], [8, "🥚 Swjedźenje a nałožki – Feste und Bräuche"], [9, "🚌 Po puću – Unterwegs"],
  [10, "🍂 Přiroda w běhu lěta – Natur im Jahreslauf"], [11, "📒 Moje portfolijo – Sprachen"]];
window.SORBISCH_LOB = ["Jara derje!", "Wulkotnje!", "Super!", "Haj, prawje!"];
window.SORBISCH = [
  // ---------- Klasse 1/2 ----------
  {
    id: "so-witaj", lb: 1, stufe: 1, lz: ["so.sp.01", "so.le.01"], name: "Witaj! – Begrüßen", e: "👋", farbe: "#C0392B", grund: "#FDECEA",
    intro: { de: "Witaj, {name}! In der Lausitz sprechen viele Menschen Sorbisch. Wir lernen, wie man sich begrüßt. Lies die Wörter laut!", ru: "Witaj, {name}! В Лужице многие говорят по-лужицки. Мы учимся здороваться. Читай слова вслух!" },
    woerter: [
      { so: "Dobry dźeń", de: "Guten Tag", ru: "добрый день", e: "☀️" }, { so: "Dobre ranje", de: "Guten Morgen", ru: "доброе утро", e: "🌅" },
      { so: "Dobru nóc", de: "Gute Nacht", ru: "спокойной ночи", e: "🌙" }, { so: "Božemje", de: "Tschüss / Auf Wiedersehen", ru: "до свидания", e: "🚶" },
      { so: "Dźakuju so", de: "danke", ru: "спасибо", e: "💐" }, { so: "Prošu", de: "bitte", ru: "пожалуйста", e: "🙏" },
      { so: "Haj", de: "ja", ru: "да", e: "👍" }, { so: "Ně", de: "nein", ru: "нет", e: "👎" }],
    extra: [
      { typ: "satz", de: "Stell dich vor: „Ich heiße Mia.“", ru: "Представься: «Меня зовут Мия».", woerter: ["Ja", "rěkam", "Mia."], e: "🙋" },
      { typ: "wahl", frage: "Jemand fragt: „Kak so tebi wjedźe?“ (Wie geht es dir?) Was antwortest du?", ru: "Тебя спрашивают: «Kak so tebi wjedźe?» (Как дела?) Что ответишь?", optionen: ["Dźakuju so, derje.", "Dobru nóc.", "Božemje."], e: "🙂", warum: "„Dźakuju so, derje“ heißt „Danke, gut“." }],
    ende: { de: "Super! Sag heute einmal „Dobre ranje“ oder „Dobru nóc“.", ru: "Супер! Скажи сегодня «Dobre ranje» или «Dobru nóc»." }
  },
  {
    id: "so-swojba", lb: 1, stufe: 1, lz: ["so.ws.01", "so.sp.01"], name: "Swójba – Familie", e: "👨‍👩‍👧", farbe: "#D35400", grund: "#FFF0E3",
    intro: { de: "Familie heißt auf Sorbisch „swójba“. Wer gehört zu deiner swójba?", ru: "Семья по-лужицки — «swójba». Кто входит в твою семью?" },
    woerter: [
      { so: "mama", de: "Mama", ru: "мама", e: "👩" }, { so: "nan", de: "Papa / Vater", ru: "папа", e: "👨" },
      { so: "bratr", de: "Bruder", ru: "брат", e: "👦" }, { so: "sotra", de: "Schwester", ru: "сестра", e: "👧" },
      { so: "wowka", de: "Oma", ru: "бабушка", e: "👵" }, { so: "dźěd", de: "Opa", ru: "дедушка", e: "👴" },
      { so: "dźěćo", de: "Kind", ru: "ребёнок", e: "🧒" }, { so: "swójba", de: "Familie", ru: "семья", e: "🏡" }],
    extra: [
      { typ: "satz", de: "Zeig ein Foto: „Das ist meine Mama.“", ru: "Покажи фото: «Это моя мама».", woerter: ["To", "je", "moja", "mama."], e: "🖼️" }],
    ende: { de: "Jara derje! Zeig deiner Familie, wie „Oma“ und „Opa“ auf Sorbisch heißen.", ru: "Очень хорошо! Покажи семье, как по-лужицки «бабушка» и «дедушка»." }
  },
  {
    id: "so-cylo", lb: 2, stufe: 1, lz: ["so.ws.01", "so.le.01"], name: "Ćěło – Mein Körper", e: "🧍", farbe: "#8E44AD", grund: "#F3E8FA",
    intro: { de: "Kopf, Hand, Fuß – wie heißen sie auf Sorbisch? Zeig beim Lesen auf dich selbst!", ru: "Голова, рука, нога — как это по-лужицки? Показывай на себя, когда читаешь!" },
    woerter: [
      { so: "hłowa", de: "Kopf", ru: "голова", e: "🙂" }, { so: "ruka", de: "Hand / Arm", ru: "рука", e: "✋" },
      { so: "noha", de: "Fuß / Bein", ru: "нога", e: "🦶" }, { so: "woko", de: "Auge", ru: "глаз", e: "👁️" },
      { so: "nos", de: "Nase", ru: "нос", e: "👃" }, { so: "wucho", de: "Ohr", ru: "ухо", e: "👂" },
      { so: "huba", de: "Mund", ru: "рот", e: "👄" }, { so: "włosy", de: "Haare", ru: "волосы", e: "💇" }],
    extra: [
      { typ: "wahl", frage: "Womit hörst du?", ru: "Чем ты слышишь?", optionen: ["wucho", "noha", "nos"], e: "🎵", warum: "„wucho“ heißt „Ohr“." }],
    ende: { de: "Wulkotnje! Spiel mit jemandem: Einer sagt „nos“, der andere zeigt auf die Nase.", ru: "Отлично! Поиграй: один говорит «nos», другой показывает на нос." }
  },
  {
    id: "so-drasta", lb: 2, stufe: 1, lz: ["so.ws.01"], name: "Drasta – Kleidung", e: "👕", farbe: "#2471A3", grund: "#E6F1FA",
    intro: { de: "Was ziehst du heute an? Kleidung heißt auf Sorbisch „drasta“.", ru: "Что ты сегодня надеваешь? Одежда по-лужицки — «drasta»." },
    woerter: [
      { so: "košla", de: "Hemd", ru: "рубашка", e: "👕" }, { so: "cholowy", de: "Hose", ru: "брюки", e: "👖" },
      { so: "črije", de: "Schuhe", ru: "обувь", e: "👟" }, { so: "čapka", de: "Mütze", ru: "шапка", e: "🧢" },
      { so: "suknja", de: "Rock", ru: "юбка", e: "👗" }, { so: "kabat", de: "Jacke", ru: "куртка", e: "🧥" },
      { so: "rukajcy", de: "Handschuhe", ru: "перчатки", e: "🧤" }, { so: "štrympy", de: "Strümpfe", ru: "носки", e: "🧦" }],
    extra: [
      { typ: "wahl", frage: "Draußen schneit es. Was ziehst du an die Hände?", ru: "На улице снег. Что ты наденешь на руки?", optionen: ["rukajcy", "črije", "suknja"], e: "❄️", warum: "„rukajcy“ sind Handschuhe." }],
    ende: { de: "Super! Sag morgen beim Anziehen: „košla“, „cholowy“, „štrympy“.", ru: "Супер! Завтра, одеваясь, скажи: «košla», «cholowy», «štrympy»." }
  },
  {
    id: "so-barby", lb: 4, stufe: 1, lz: ["so.ws.01", "so.le.01"], name: "Barby – Farben", e: "🎨", farbe: "#7B55B8", grund: "#EFE6FF",
    intro: { de: "Farben heißen auf Sorbisch „barby“. Achte auf die Häkchen und Striche über den Buchstaben!", ru: "Цвета по-лужицки — «barby». Обрати внимание на значки над буквами!" },
    woerter: [
      { so: "čerwjeny", de: "rot", ru: "красный", e: "🔴" }, { so: "módry", de: "blau", ru: "синий", e: "🔵" },
      { so: "zeleny", de: "grün", ru: "зелёный", e: "🟢" }, { so: "žołty", de: "gelb", ru: "жёлтый", e: "🟡" },
      { so: "čorny", de: "schwarz", ru: "чёрный", e: "⚫" }, { so: "běły", de: "weiß", ru: "белый", e: "⚪" },
      { so: "bruny", de: "braun", ru: "коричневый", e: "🟤" }, { so: "oranžowy", de: "orange", ru: "оранжевый", e: "🟠" }],
    extra: [
      { typ: "wahl", frage: "Welche Farbe hat eine Banane?", ru: "Какого цвета банан?", optionen: ["žołty", "módry", "čorny"], e: "🍌", warum: "„žołty“ heißt „gelb“." }],
    ende: { de: "Jara derje! Such zu Hause etwas „čerwjeny“ – etwas Rotes.", ru: "Очень хорошо! Найди дома что-нибудь «čerwjeny» — красное." }
  },
  {
    id: "so-licby", lb: 4, stufe: 1, lz: ["so.ws.01"], name: "Licby – Zahlen bis 10", e: "🔢", farbe: "#16A085", grund: "#E3F7F2",
    intro: { de: "Wir zählen auf Sorbisch: jedyn, dwaj, tři … Zähl mit den Fingern mit!", ru: "Считаем по-лужицки: jedyn, dwaj, tři … Считай на пальцах!" },
    woerter: [
      { so: "jedyn", de: "eins", ru: "один", e: "1️⃣" }, { so: "dwaj", de: "zwei", ru: "два", e: "2️⃣" }, { so: "tři", de: "drei", ru: "три", e: "3️⃣" },
      { so: "štyri", de: "vier", ru: "четыре", e: "4️⃣" }, { so: "pjeć", de: "fünf", ru: "пять", e: "5️⃣" }, { so: "šěsć", de: "sechs", ru: "шесть", e: "6️⃣" },
      { so: "sydom", de: "sieben", ru: "семь", e: "7️⃣" }, { so: "wosom", de: "acht", ru: "восемь", e: "8️⃣" }, { so: "dźewjeć", de: "neun", ru: "девять", e: "9️⃣" },
      { so: "dźesać", de: "zehn", ru: "десять", e: "🔟" }],
    extra: [
      { typ: "wahl", frage: "Wie viele Finger hat eine Hand?", ru: "Сколько пальцев на одной руке?", optionen: ["pjeć", "tři", "wosom"], e: "🖐️", warum: "„pjeć“ heißt „fünf“." }],
    ende: { de: "Wulkotnje! Zähl heute die Treppenstufen auf Sorbisch.", ru: "Отлично! Посчитай сегодня ступеньки по-лужицки." }
  },
  {
    id: "so-sula", lb: 4, stufe: 1, lz: ["so.ws.01"], name: "Šula – In der Schule", e: "🏫", farbe: "#B7950B", grund: "#FCF6DC",
    intro: { de: "Was ist in deiner Schultasche? Schule heißt auf Sorbisch „šula“.", ru: "Что у тебя в портфеле? Школа по-лужицки — «šula»." },
    woerter: [
      { so: "šula", de: "Schule", ru: "школа", e: "🏫" }, { so: "kniha", de: "Buch", ru: "книга", e: "📕" },
      { so: "zešiwk", de: "Heft", ru: "тетрадь", e: "📒" }, { so: "pisak", de: "Stift", ru: "ручка", e: "🖊️" },
      { so: "nožicy", de: "Schere", ru: "ножницы", e: "✂️" }, { so: "lineal", de: "Lineal", ru: "линейка", e: "📏" },
      { so: "šulska tobła", de: "Schulranzen", ru: "школьный ранец", e: "🎒" }, { so: "wučerka", de: "Lehrerin", ru: "учительница", e: "👩‍🏫" }],
    extra: [
      { typ: "wahl", frage: "Womit schneidest du Papier?", ru: "Чем ты режешь бумагу?", optionen: ["nožicy", "kniha", "lineal"], e: "📄", warum: "„nožicy“ heißt „Schere“." }],
    ende: { de: "Super! Pack morgen deine „šulska tobła“ und sag jedes Ding auf Sorbisch.", ru: "Супер! Собери завтра свой «šulska tobła» и назови каждую вещь по-лужицки." }
  },
  {
    id: "so-zwerjata", lb: 5, stufe: 1, lz: ["so.ws.01", "so.le.01"], name: "Zwěrjata – Tiere", e: "🐶", farbe: "#6E8B3D", grund: "#EEF5E2",
    intro: { de: "Hund, Katze, Kuh – welche Tiere kennst du auf Sorbisch?", ru: "Собака, кошка, корова — каких животных ты знаешь по-лужицки?" },
    woerter: [
      { so: "pos", de: "Hund", ru: "собака", e: "🐶" }, { so: "kóčka", de: "Katze", ru: "кошка", e: "🐱" },
      { so: "kruwa", de: "Kuh", ru: "корова", e: "🐄" }, { so: "kóń", de: "Pferd", ru: "лошадь", e: "🐴" },
      { so: "swinjo", de: "Schwein", ru: "свинья", e: "🐷" }, { so: "kokoš", de: "Huhn", ru: "курица", e: "🐔" },
      { so: "ryba", de: "Fisch", ru: "рыба", e: "🐟" }, { so: "ptačk", de: "Vogel", ru: "птичка", e: "🐦" }],
    extra: [
      { typ: "wahl", frage: "Wer gibt uns Milch?", ru: "Кто даёт нам молоко?", optionen: ["kruwa", "ryba", "ptačk"], e: "🥛", warum: "„kruwa“ heißt „Kuh“." }],
    ende: { de: "Jara derje! Welches Tier magst du am liebsten? Sag es auf Sorbisch.", ru: "Очень хорошо! Какое животное тебе нравится больше всего? Скажи по-лужицки." }
  },
  {
    id: "so-swjedzenje", lb: 8, stufe: 1, lz: ["so.ik.01", "so.ws.01"], name: "Swjedźenje – Feste", e: "🥚", farbe: "#C2185B", grund: "#FCE4EF",
    intro: { de: "Die Sorben feiern besondere Feste: Am 25. Januar ist Vogelhochzeit – „ptači kwas“. Da bringen die Vögel den Kindern Süßes! Und zu Ostern gibt es bunt verzierte Eier.", ru: "У лужичан есть особые праздники: 25 января — «птичья свадьба», «ptači kwas». Птицы приносят детям сладости! А на Пасху — красиво расписанные яйца." },
    woerter: [
      { so: "hody", de: "Weihnachten", ru: "Рождество", e: "🎄" }, { so: "jutry", de: "Ostern", ru: "Пасха", e: "🐣" },
      { so: "narodniny", de: "Geburtstag", ru: "день рождения", e: "🎂" }, { so: "ptači kwas", de: "Vogelhochzeit", ru: "птичья свадьба", e: "🐦" },
      { so: "jutrowne jejko", de: "Osterei", ru: "пасхальное яйцо", e: "🥚" }, { so: "dar", de: "Geschenk", ru: "подарок", e: "🎁" },
      { so: "swěčka", de: "Kerze", ru: "свечка", e: "🕯️" }, { so: "tykanc", de: "Kuchen", ru: "пирог", e: "🍰" }],
    extra: [
      { typ: "wahl", frage: "Welches Fest feiern die Sorben am 25. Januar?", ru: "Какой праздник лужичане отмечают 25 января?", optionen: ["ptači kwas", "jutry", "hody"], e: "📅", warum: "Am 25. Januar ist Vogelhochzeit – „ptači kwas“." }],
    ende: { de: "Wulkotnje! Frag einmal nach: Gibt es in deinem Kindergarten oder deiner Schule eine Vogelhochzeit?", ru: "Отлично! Спроси: празднуют ли в твоём детском саду или школе птичью свадьбу?" }
  },
  {
    id: "so-leto", lb: 10, stufe: 1, lz: ["so.ws.01"], name: "Lěto – Jahreszeiten und Wetter", e: "🌦️", farbe: "#2E86C1", grund: "#E4F1FB",
    intro: { de: "Frühling, Sommer, Herbst, Winter – und dazu Regen, Schnee und Sonne. Wie heißen sie auf Sorbisch?", ru: "Весна, лето, осень, зима — и ещё дождь, снег и солнце. Как это по-лужицки?" },
    woerter: [
      { so: "nalěćo", de: "Frühling", ru: "весна", e: "🌷" }, { so: "lěćo", de: "Sommer", ru: "лето", e: "🏖️" },
      { so: "nazyma", de: "Herbst", ru: "осень", e: "🍂" }, { so: "zyma", de: "Winter", ru: "зима", e: "⛄" },
      { so: "dešć", de: "Regen", ru: "дождь", e: "🌧️" }, { so: "sněh", de: "Schnee", ru: "снег", e: "❄️" },
      { so: "wětřik", de: "Wind", ru: "ветер", e: "💨" }, { so: "słónco", de: "Sonne", ru: "солнце", e: "☀️" }],
    extra: [
      { typ: "wahl", frage: "Wann fallen die Blätter von den Bäumen?", ru: "Когда с деревьев падают листья?", optionen: ["nazyma", "nalěćo", "lěćo"], e: "🍁", warum: "„nazyma“ heißt „Herbst“." }],
    ende: { de: "Super! Schau aus dem Fenster: Gibt es heute „słónco“, „dešć“ oder „sněh“?", ru: "Супер! Посмотри в окно: сегодня «słónco», «dešć» или «sněh»?" }
  },

  // ---------- Klasse 3/4 ----------
  {
    id: "so-preceljo", lb: 1, stufe: 3, lz: ["so.sp.02", "so.ws.02"], name: "Přećeljo – Ich und meine Freunde", e: "🧑‍🤝‍🧑", farbe: "#CB4335", grund: "#FBE9E7",
    intro: { de: "Jetzt erzählst du etwas über dich: wie du heißt, wie alt du bist und wo du wohnst.", ru: "Теперь ты рассказываешь о себе: как тебя зовут, сколько тебе лет и где ты живёшь." },
    woerter: [
      { so: "přećel", de: "Freund", ru: "друг", e: "👦" }, { so: "přećelka", de: "Freundin", ru: "подруга", e: "👧" },
      { so: "hólc", de: "Junge", ru: "мальчик", e: "🧒" }, { so: "holca", de: "Mädchen", ru: "девочка", e: "👱‍♀️" },
      { so: "mjeno", de: "Name", ru: "имя", e: "🏷️" }, { so: "wjes", de: "Dorf", ru: "деревня", e: "🏘️" },
      { so: "město", de: "Stadt", ru: "город", e: "🏙️" }],
    extra: [
      { typ: "satz", de: "Sag, wie alt du bist: „Ich bin acht Jahre alt.“", ru: "Скажи, сколько тебе лет: «Мне восемь лет».", woerter: ["Ja", "sym", "wosom", "lět."], e: "🎂" },
      { typ: "satz", de: "Sag, wo du wohnst: „Ich wohne in Bautzen.“", ru: "Скажи, где ты живёшь: «Я живу в Баутцене».", woerter: ["Ja", "bydlu", "w", "Budyšinje."], e: "🏰" },
      { typ: "wahl", frage: "Jemand fragt: „Kak ty rěkaš?“ Was antwortest du?", ru: "Тебя спрашивают: «Kak ty rěkaš?» Что ответишь?", optionen: ["Ja rěkam Mia.", "Ja sym wosom lět.", "Dobru nóc."], e: "🙋", warum: "„Kak ty rěkaš?“ heißt „Wie heißt du?“." }],
    ende: { de: "Jara derje! Bautzen heißt auf Sorbisch „Budyšin“ – viele Orte in der Lausitz haben zwei Namen.", ru: "Очень хорошо! Баутцен по-лужицки — «Budyšin»: у многих мест в Лужице два названия." }
  },
  {
    id: "so-pocucy", lb: 2, stufe: 3, lz: ["so.sp.01", "so.sp.02"], name: "Kak so tebi wjedźe? – Wie geht es dir?", e: "😊", farbe: "#AF7AC5", grund: "#F5EEF8",
    intro: { de: "Wie fühlst du dich heute? Auf Sorbisch kannst du sagen, ob es dir gut geht oder ob dir etwas wehtut.", ru: "Как ты себя чувствуешь? По-лужицки можно сказать, хорошо ли тебе или что-то болит." },
    woerter: [
      { so: "Mi so derje wjedźe.", de: "Mir geht es gut.", ru: "У меня всё хорошо.", e: "😊" }, { so: "Nic derje.", de: "Nicht gut.", ru: "Не очень.", e: "😕" },
      { so: "Mje boli hłowa.", de: "Mir tut der Kopf weh.", ru: "У меня болит голова.", e: "🤕" }, { so: "Sym wjesoły.", de: "Ich bin fröhlich.", ru: "Я весёлый.", e: "😄" },
      { so: "Sym mučny.", de: "Ich bin müde.", ru: "Я устал.", e: "😴" }, { so: "Sym hłódny.", de: "Ich habe Hunger.", ru: "Я голоден.", e: "🍽️" }],
    extra: [
      { typ: "wahl", frage: "Du hast den ganzen Tag gespielt und willst schlafen. Was sagst du?", ru: "Ты весь день играл и хочешь спать. Что ты скажешь?", optionen: ["Sym mučny.", "Sym hłódny.", "Sym wjesoły."], e: "🛏️", warum: "„Sym mučny“ heißt „Ich bin müde“." }],
    ende: { de: "Super! Wenn dir etwas wehtut, sag es immer einem Erwachsenen – auf Deutsch oder Sorbisch.", ru: "Супер! Если что-то болит, всегда скажи взрослому — по-немецки или по-лужицки." }
  },
  {
    id: "so-doma", lb: 3, stufe: 3, lz: ["so.ws.02"], name: "Doma – Zuhause", e: "🏠", farbe: "#A04000", grund: "#FBEEE6",
    intro: { de: "Wir gehen durch ein Haus: Küche, Stube, Bad. Wie heißen die Räume und Möbel auf Sorbisch?", ru: "Мы идём по дому: кухня, комната, ванная. Как называются комнаты и мебель по-лужицки?" },
    woerter: [
      { so: "dom", de: "Haus", ru: "дом", e: "🏠" }, { so: "kuchnja", de: "Küche", ru: "кухня", e: "🍳" },
      { so: "stwa", de: "Stube / Zimmer", ru: "комната", e: "🛋️" }, { so: "kupjelnja", de: "Bad", ru: "ванная", e: "🛁" },
      { so: "łožo", de: "Bett", ru: "кровать", e: "🛏️" }, { so: "blido", de: "Tisch", ru: "стол", e: "🍽️" },
      { so: "stoł", de: "Stuhl", ru: "стул", e: "🪑" }, { so: "wokno", de: "Fenster", ru: "окно", e: "🪟" }],
    extra: [
      { typ: "wahl", frage: "Wo kochst du?", ru: "Где ты готовишь?", optionen: ["w kuchni", "w kupjelni", "w łožu"], e: "🥘", warum: "„kuchnja“ heißt „Küche“ – „w kuchni“ heißt „in der Küche“." }],
    ende: { de: "Wulkotnje! Kleb kleine Zettel mit „blido“, „stoł“ und „wokno“ an die Möbel.", ru: "Отлично! Наклей бумажки с «blido», «stoł» и «wokno» на мебель." }
  },
  {
    id: "so-tydzen", lb: 4, stufe: 3, lz: ["so.ws.02", "so.le.01"], name: "Dny tydźenja – Wochentage", e: "🗓️", farbe: "#1F618D", grund: "#E5EFF7",
    intro: { de: "Die Woche hat sieben Tage. Auf Sorbisch beginnt sie mit „póndźela“ – Montag.", ru: "В неделе семь дней. По-лужицки она начинается с «póndźela» — понедельника." },
    woerter: [
      { so: "póndźela", de: "Montag", ru: "понедельник", e: "1️⃣" }, { so: "wutora", de: "Dienstag", ru: "вторник", e: "2️⃣" },
      { so: "srjeda", de: "Mittwoch", ru: "среда", e: "3️⃣" }, { so: "štwórtk", de: "Donnerstag", ru: "четверг", e: "4️⃣" },
      { so: "pjatk", de: "Freitag", ru: "пятница", e: "5️⃣" }, { so: "sobota", de: "Samstag", ru: "суббота", e: "6️⃣" },
      { so: "njedźela", de: "Sonntag", ru: "воскресенье", e: "7️⃣" }],
    extra: [
      { typ: "wahl", frage: "An welchem Tag ist keine Schule? (Tipp: der 7. Tag)", ru: "В какой день нет школы? (Подсказка: 7-й день)", optionen: ["njedźela", "srjeda", "póndźela"], e: "😎", warum: "„njedźela“ heißt „Sonntag“." }],
    ende: { de: "Super! Welcher Tag ist heute? Sag ihn auf Sorbisch.", ru: "Супер! Какой сегодня день? Скажи по-лужицки." }
  },
  {
    id: "so-sport", lb: 6, stufe: 3, lz: ["so.ws.02", "so.sp.02"], name: "Swobodny čas – Freizeit", e: "⚽", farbe: "#239B56", grund: "#E7F6EC",
    intro: { de: "Was machst du gern? Singen, tanzen, lesen? Auf Sorbisch sagst du: „Ja rady …“", ru: "Что ты любишь делать? Петь, танцевать, читать? По-лужицки говорят: «Ja rady …»" },
    woerter: [
      { so: "spěwać", de: "singen", ru: "петь", e: "🎤" }, { so: "rejować", de: "tanzen", ru: "танцевать", e: "💃" },
      { so: "čitać", de: "lesen", ru: "читать", e: "📖" }, { so: "płuwać", de: "schwimmen", ru: "плавать", e: "🏊" },
      { so: "molować", de: "malen", ru: "рисовать", e: "🖌️" }, { so: "hrać", de: "spielen", ru: "играть", e: "🧸" },
      { so: "kopańca", de: "Fußball", ru: "футбол", e: "⚽" }],
    extra: [
      { typ: "satz", de: "Sag: „Ich singe gern.“", ru: "Скажи: «Я люблю петь».", woerter: ["Ja", "rady", "spěwam."], e: "🎶" }],
    ende: { de: "Jara derje! Erzähl jemandem auf Sorbisch, was du gern machst.", ru: "Очень хорошо! Расскажи кому-нибудь по-лужицки, что ты любишь делать." }
  },
  {
    id: "so-licby100", lb: 7, stufe: 3, lz: ["so.ws.02"], name: "Licby do sto – Zahlen bis 100", e: "💯", farbe: "#117A65", grund: "#E3F4EF",
    intro: { de: "Beim Einkaufen brauchst du größere Zahlen. Wir zählen bis hundert – „sto“.", ru: "Для покупок нужны большие числа. Считаем до ста — «sto»." },
    woerter: [
      { so: "jědnaće", de: "elf", ru: "одиннадцать", e: "🧮" }, { so: "dwanaće", de: "zwölf", ru: "двенадцать", e: "🕛" },
      { so: "dwaceći", de: "zwanzig", ru: "двадцать", e: "💶" }, { so: "třiceći", de: "dreißig", ru: "тридцать", e: "📅" },
      { so: "štyrceći", de: "vierzig", ru: "сорок", e: "🎈" }, { so: "pjećdźesat", de: "fünfzig", ru: "пятьдесят", e: "🪙" },
      { so: "sto", de: "hundert", ru: "сто", e: "💯" }],
    extra: [
      { typ: "wahl", frage: "Wie viele Stunden hat ein halber Tag? (12)", ru: "Сколько часов в половине суток? (12)", optionen: ["dwanaće", "dwaceći", "jědnaće"], e: "⏰", warum: "„dwanaće“ heißt „zwölf“." }],
    ende: { de: "Wulkotnje! Lies beim nächsten Einkauf einen Preis auf Sorbisch vor.", ru: "Отлично! В следующий раз в магазине прочитай цену по-лужицки." }
  },
  {
    id: "so-jedz", lb: 7, stufe: 3, lz: ["so.ws.02", "so.sp.02"], name: "Jědź – Beim Einkaufen", e: "🛒", farbe: "#B9770E", grund: "#FDF2E0",
    intro: { de: "Wir kaufen ein: Brot, Milch, Äpfel. Wie heißen sie auf Sorbisch?", ru: "Идём за покупками: хлеб, молоко, яблоки. Как это по-лужицки?" },
    woerter: [
      { so: "chlěb", de: "Brot", ru: "хлеб", e: "🍞" }, { so: "mloko", de: "Milch", ru: "молоко", e: "🥛" },
      { so: "jabłuko", de: "Apfel", ru: "яблоко", e: "🍎" }, { so: "butra", de: "Butter", ru: "масло", e: "🧈" },
      { so: "twarožk", de: "Quark", ru: "творог", e: "🥣" }, { so: "jejo", de: "Ei", ru: "яйцо", e: "🥚" },
      { so: "woda", de: "Wasser", ru: "вода", e: "💧" }, { so: "běrny", de: "Kartoffeln", ru: "картошка", e: "🥔" }],
    extra: [
      { typ: "wahl", frage: "In der Lausitz isst man gern Kartoffeln mit Quark und Leinöl. Was sind Kartoffeln?", ru: "В Лужице любят картошку с творогом и льняным маслом. Как будет «картошка»?", optionen: ["běrny", "butra", "mloko"], e: "🥔", warum: "„běrny“ heißt „Kartoffeln“." }],
    ende: { de: "Super! Sag beim Essen auf Sorbisch, was auf dem Tisch steht.", ru: "Супер! За едой скажи по-лужицки, что стоит на столе." }
  },
  {
    id: "so-zoo", lb: 5, stufe: 3, lz: ["so.ws.02"], name: "W zoo – Im Zoo und im Wald", e: "🦁", farbe: "#7D6608", grund: "#FAF4DD",
    intro: { de: "Im Zoo und im Wald leben viele Tiere. Wie heißen Löwe, Bär und Eichhörnchen auf Sorbisch?", ru: "В зоопарке и в лесу живут разные животные. Как по-лужицки лев, медведь и белка?" },
    woerter: [
      { so: "law", de: "Löwe", ru: "лев", e: "🦁" }, { so: "słon", de: "Elefant", ru: "слон", e: "🐘" },
      { so: "opica", de: "Affe", ru: "обезьяна", e: "🐒" }, { so: "žirafa", de: "Giraffe", ru: "жираф", e: "🦒" },
      { so: "mjedwjedź", de: "Bär", ru: "медведь", e: "🐻" }, { so: "zajac", de: "Hase", ru: "заяц", e: "🐇" },
      { so: "wjewjerčka", de: "Eichhörnchen", ru: "белка", e: "🐿️" }, { so: "wjelk", de: "Wolf", ru: "волк", e: "🐺" }],
    extra: [
      { typ: "wahl", frage: "In der Lausitz leben wieder Wölfe. Wie heißt Wolf auf Sorbisch?", ru: "В Лужице снова живут волки. Как по-лужицки «волк»?", optionen: ["wjelk", "law", "słon"], e: "🌲", warum: "„wjelk“ heißt „Wolf“." }],
    ende: { de: "Jara derje! Im Tierpark Bautzen stehen manche Schilder auch auf Sorbisch – schau mal nach!", ru: "Очень хорошо! В зоопарке Баутцена некоторые таблички тоже на лужицком — посмотри!" }
  },
  {
    id: "so-jutry", lb: 8, stufe: 3, lz: ["so.ik.01", "so.sp.02"], name: "Wjesołe jutry! – Feste und Wünsche", e: "🐎", farbe: "#A93226", grund: "#FAE5E3",
    intro: { de: "Zu Festen wünscht man sich etwas. Zu Ostern reiten in der Lausitz die Osterreiter – „jutrowni rejtarjo“ – mit festlich geschmückten Pferden.", ru: "На праздники друг другу желают хорошего. На Пасху в Лужице выезжают пасхальные всадники — «jutrowni rejtarjo» — на нарядных лошадях." },
    woerter: [
      { so: "Wjesołe hody!", de: "Frohe Weihnachten!", ru: "Счастливого Рождества!", e: "🎄" }, { so: "Wjesołe jutry!", de: "Frohe Ostern!", ru: "Счастливой Пасхи!", e: "🐣" },
      { so: "Wjele zboža k narodninam!", de: "Alles Gute zum Geburtstag!", ru: "С днём рождения!", e: "🎂" }, { so: "Wjele zboža do noweho lěta!", de: "Gutes neues Jahr!", ru: "С Новым годом!", e: "🎆" },
      { so: "jutrowni rejtarjo", de: "Osterreiter", ru: "пасхальные всадники", e: "🐎" }, { so: "ptači kwas", de: "Vogelhochzeit", ru: "птичья свадьба", e: "🐦" }],
    extra: [
      { typ: "wahl", frage: "Deine Freundin hat Geburtstag. Was wünschst du ihr?", ru: "У твоей подруги день рождения. Что ты ей пожелаешь?", optionen: ["Wjele zboža k narodninam!", "Wjesołe jutry!", "Dobru nóc!"], e: "🎁", warum: "„Wjele zboža k narodninam“ heißt „Viel Glück zum Geburtstag“." }],
    ende: { de: "Wulkotnje! Schreib zum nächsten Fest eine Karte mit einem sorbischen Wunsch.", ru: "Отлично! К следующему празднику напиши открытку с лужицким пожеланием." }
  },
  {
    id: "so-puc", lb: 9, stufe: 3, lz: ["so.ws.02"], name: "Po puću – Unterwegs", e: "🚌", farbe: "#2874A6", grund: "#E6F0F8",
    intro: { de: "Womit fährst du? Auto, Bus, Zug oder Fahrrad? Wir reisen durch die Lausitz.", ru: "На чём ты ездишь? Машина, автобус, поезд или велосипед? Мы путешествуем по Лужице." },
    woerter: [
      { so: "awto", de: "Auto", ru: "машина", e: "🚗" }, { so: "bus", de: "Bus", ru: "автобус", e: "🚌" },
      { so: "ćah", de: "Zug", ru: "поезд", e: "🚆" }, { so: "koleso", de: "Fahrrad", ru: "велосипед", e: "🚲" },
      { so: "lětadło", de: "Flugzeug", ru: "самолёт", e: "✈️" }, { so: "łódź", de: "Schiff / Boot", ru: "лодка", e: "⛵" },
      { so: "dróha", de: "Straße / Weg", ru: "дорога", e: "🛣️" }],
    extra: [
      { typ: "wahl", frage: "Wie heißt Bautzen auf Sorbisch?", ru: "Как по-лужицки называется Баутцен?", optionen: ["Budyšin", "Choćebuz", "Drježdźany"], e: "🏰", warum: "Bautzen heißt „Budyšin“. Cottbus heißt auf Niedersorbisch „Chóśebuz“, Dresden „Drježdźany“." }],
    ende: { de: "Super! Achte auf Ortsschilder in der Lausitz: Oft steht der sorbische Name darunter.", ru: "Супер! Обрати внимание на таблички в Лужице: часто под ними написано лужицкое название." }
  },
  {
    id: "so-mesacy", lb: 10, stufe: 3, lz: ["so.ws.02", "so.ik.01"], name: "Měsacy – Monate", e: "📆", farbe: "#5B2C6F", grund: "#F1E8F5",
    intro: { de: "Die Sorben haben eigene Monatsnamen, die von der Natur erzählen: „róžowc“ ist der Rosenmonat Mai, „žnjenc“ der Erntemonat August.", ru: "У лужичан свои названия месяцев, они рассказывают о природе: «róžowc» — месяц роз, май; «žnjenc» — месяц жатвы, август." },
    woerter: [
      { so: "wulki róžk", de: "Januar", ru: "январь", e: "⛄" }, { so: "mały róžk", de: "Februar", ru: "февраль", e: "🎭" },
      { so: "nalětnik", de: "März", ru: "март", e: "🌱" }, { so: "jutrownik", de: "April", ru: "апрель", e: "🐣" },
      { so: "róžowc", de: "Mai", ru: "май", e: "🌹" }, { so: "smažnik", de: "Juni", ru: "июнь", e: "🍓" },
      { so: "pražnik", de: "Juli", ru: "июль", e: "🏖️" }, { so: "žnjenc", de: "August", ru: "август", e: "🌾" },
      { so: "požnjenc", de: "September", ru: "сентябрь", e: "🍎" }, { so: "winowc", de: "Oktober", ru: "октябрь", e: "🍇" },
      { so: "nazymnik", de: "November", ru: "ноябрь", e: "🍂" }, { so: "hodownik", de: "Dezember", ru: "декабрь", e: "🎄" }],
    extra: [
      { typ: "wahl", frage: "In welchem Monat ist Weihnachten („hody“)?", ru: "В каком месяце Рождество («hody»)?", optionen: ["hodownik", "róžowc", "žnjenc"], e: "🎅", warum: "„hodownik“ ist der Dezember – darin steckt „hody“, Weihnachten." }],
    ende: { de: "Jara derje! In welchem Monat hast du Geburtstag? Such den sorbischen Namen.", ru: "Очень хорошо! В каком месяце у тебя день рождения? Найди его лужицкое название." }
  },
  {
    id: "so-priroda", lb: 10, stufe: 3, lz: ["so.ws.02"], name: "Přiroda – Natur", e: "🌳", farbe: "#1E8449", grund: "#E5F5EA",
    intro: { de: "Die Lausitz hat Wälder, Wiesen, Flüsse und Teiche. Wie heißen sie auf Sorbisch?", ru: "В Лужице есть леса, луга, реки и пруды. Как это по-лужицки?" },
    woerter: [
      { so: "štom", de: "Baum", ru: "дерево", e: "🌳" }, { so: "kwětka", de: "Blume", ru: "цветок", e: "🌼" },
      { so: "lěs", de: "Wald", ru: "лес", e: "🌲" }, { so: "łuka", de: "Wiese", ru: "луг", e: "🌾" },
      { so: "rěka", de: "Fluss", ru: "река", e: "🏞️" }, { so: "hora", de: "Berg", ru: "гора", e: "⛰️" },
      { so: "hat", de: "Teich", ru: "пруд", e: "🦆" }, { so: "kamjeń", de: "Stein", ru: "камень", e: "🪨" }],
    extra: [
      { typ: "wahl", frage: "Wo wachsen viele Bäume?", ru: "Где растёт много деревьев?", optionen: ["w lěsu", "w rěce", "na horje"], e: "🦌", warum: "„lěs“ heißt „Wald“ – „w lěsu“ heißt „im Wald“." }],
    ende: { de: "Wulkotnje! Geh nach draußen und finde einen „štom“, eine „kwětka“ und einen „kamjeń“.", ru: "Отлично! Выйди на улицу и найди «štom», «kwětka» и «kamjeń»." }
  },
  {
    id: "so-rece", lb: 11, stufe: 3, lz: ["so.ik.01", "so.le.01"], name: "Rěče – Sprachen", e: "🌍", farbe: "#34495E", grund: "#EAEEF2",
    intro: { de: "Sorbisch ist mit Polnisch, Tschechisch und Russisch verwandt. Welche Sprachen sprichst du?", ru: "Лужицкий язык родственен польскому, чешскому и русскому. На каких языках говоришь ты?" },
    woerter: [
      { so: "serbšćina", de: "Sorbisch", ru: "лужицкий язык", e: "🪺" }, { so: "němčina", de: "Deutsch", ru: "немецкий язык", e: "🇩🇪" },
      { so: "jendźelšćina", de: "Englisch", ru: "английский язык", e: "🇬🇧" }, { so: "rušćina", de: "Russisch", ru: "русский язык", e: "🪆" },
      { so: "pólšćina", de: "Polnisch", ru: "польский язык", e: "🇵🇱" }, { so: "čěšćina", de: "Tschechisch", ru: "чешский язык", e: "🇨🇿" }],
    extra: [
      { typ: "satz", de: "Sag: „Ich spreche Sorbisch.“", ru: "Скажи: «Я говорю по-лужицки».", woerter: ["Ja", "rěču", "serbsce."], e: "🗣️" }],
    ende: { de: "Jara derje! Mehrere Sprachen zu können ist ein Schatz. Leg in dein Portfolio, was du schon auf Sorbisch kannst.", ru: "Очень хорошо! Знать несколько языков — это сокровище. Сложи в портфолио то, что ты уже умеешь по-лужицки." }
  }
];
