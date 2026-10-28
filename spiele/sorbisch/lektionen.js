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

// ---------- Ausbau 30.10.2026: fehlende und teilweise Inhaltspunkte, Kultur, Wahlbereiche (lb 12) – alles ENTWÜRFE ----------
window.SORBISCH_LB.push([12, "⭐ Hišće wjace – Wahlbereiche (freiwillig)"]);
window.SORBISCH.push(
  // Klasse 1/2
  {
    id: "so-prosy", lb: 4, stufe: 1, lz: ["so.ws.01", "so.le.01"], name: "Čitaj! – Was sagt die Lehrerin?", e: "🧑‍🏫", farbe: "#B9770E", grund: "#FDF2E0",
    intro: { de: "In der Schule sagt die Lehrerin auf Sorbisch, was du tun sollst: lesen, schreiben, malen. Lies die Wörter und zeig, was sie bedeuten!", ru: "В школе учительница говорит по-лужицки, что делать: читать, писать, рисовать. Прочитай слова и покажи, что они значат!" },
    woerter: [
      { so: "Sydń so!", de: "Setz dich!", ru: "Садись!", e: "🪑" }, { so: "Stań!", de: "Steh auf!", ru: "Встань!", e: "🧍" },
      { so: "Čitaj!", de: "Lies!", ru: "Читай!", e: "📖" }, { so: "Pisaj!", de: "Schreib!", ru: "Пиши!", e: "✍️" },
      { so: "Moluj!", de: "Mal!", ru: "Рисуй!", e: "🖍️" }, { so: "Słuchaj!", de: "Hör zu!", ru: "Слушай!", e: "👂" },
      { so: "Pokaž!", de: "Zeig!", ru: "Покажи!", e: "👉" }, { so: "Wzmi pisak!", de: "Nimm den Stift!", ru: "Возьми ручку!", e: "🖊️" }],
    extra: [
      { typ: "wahl", frage: "Die Lehrerin will, dass du ein Bild malst. Was sagt sie?", ru: "Учительница хочет, чтобы ты нарисовал картинку. Что она говорит?", optionen: ["Moluj!", "Čitaj!", "Stań!"], e: "🎨", warum: "„Moluj!“ heißt „Mal!“." }],
    ende: { de: "Jara derje! Spiel zu Hause Lehrerin oder Lehrer: Sag „Stań!“ und „Sydń so!“ – wer macht mit?", ru: "Очень хорошо! Поиграй дома в учителя: скажи «Stań!» и «Sydń so!» — кто будет выполнять?" }
  },
  {
    id: "so-licby20", lb: 4, stufe: 1, lz: ["so.ws.01"], name: "Licby do dwaceći – Zahlen bis 20", e: "🔢", farbe: "#138D75", grund: "#E3F7F2",
    intro: { de: "Nach „dźesać“ (zehn) geht es weiter: Die Zahlen von 13 bis 19 enden auf Sorbisch fast alle auf „-naće“.", ru: "После «dźesać» (десять) считаем дальше: числа от 13 до 19 по-лужицки почти все кончаются на «-naće»." },
    woerter: [
      { so: "jědnaće", de: "elf", ru: "одиннадцать", e: "11" }, { so: "dwanaće", de: "zwölf", ru: "двенадцать", e: "12" },
      { so: "třinaće", de: "dreizehn", ru: "тринадцать", e: "13" }, { so: "štyrnaće", de: "vierzehn", ru: "четырнадцать", e: "14" },
      { so: "pjatnaće", de: "fünfzehn", ru: "пятнадцать", e: "15" }, { so: "šěsnaće", de: "sechzehn", ru: "шестнадцать", e: "16" },
      { so: "sydomnaće", de: "siebzehn", ru: "семнадцать", e: "17" }, { so: "wosomnaće", de: "achtzehn", ru: "восемнадцать", e: "18" },
      { so: "dźewjatnaće", de: "neunzehn", ru: "девятнадцать", e: "19" }, { so: "dwaceći", de: "zwanzig", ru: "двадцать", e: "20" }],
    extra: [
      { typ: "wahl", frage: "Zwei Hände und zwei Füße haben zusammen 20 Finger und Zehen. Wie heißt zwanzig?", ru: "У двух рук и двух ног вместе 20 пальцев. Как будет «двадцать»?", optionen: ["dwaceći", "dwanaće", "dźewjatnaće"], e: "🖐️", warum: "„dwaceći“ heißt „zwanzig“." }],
    ende: { de: "Wulkotnje! Zähl beim Treppensteigen bis „dwaceći“.", ru: "Отлично! Поднимаясь по лестнице, считай до «dwaceći»." }
  },
  {
    id: "so-letne", lb: 10, stufe: 1, lz: ["so.ws.01"], name: "Što činimy? – Im Jahreslauf", e: "🪁", farbe: "#2E86C1", grund: "#E4F1FB",
    intro: { de: "Im Winter rodeln, im Sommer baden, im Herbst Pilze sammeln: Was machst du zu welcher Jahreszeit?", ru: "Зимой — кататься на санках, летом — купаться, осенью — собирать грибы. Что ты делаешь в какое время года?" },
    woerter: [
      { so: "sankować", de: "rodeln", ru: "кататься на санках", e: "🛷" }, { so: "na łyžach jězdźić", de: "Ski fahren", ru: "кататься на лыжах", e: "⛷️" },
      { so: "kupać so", de: "baden", ru: "купаться", e: "🏊" }, { so: "kwětki trěhać", de: "Blumen pflücken", ru: "рвать цветы", e: "💐" },
      { so: "hriby zběrać", de: "Pilze sammeln", ru: "собирать грибы", e: "🍄" }, { so: "draka pušćić", de: "Drachen steigen lassen", ru: "запускать воздушного змея", e: "🪁" },
      { so: "jejka barbić", de: "Eier färben", ru: "красить яйца", e: "🥚" }],
    extra: [
      { typ: "wahl", frage: "Es liegt viel Schnee. Was kannst du machen?", ru: "Лежит много снега. Что можно делать?", optionen: ["sankować", "kupać so", "kwětki trěhać"], e: "❄️", warum: "„sankować“ heißt „rodeln“ – das geht im Winter." }],
    ende: { de: "Super! Was machst du in der jetzigen Jahreszeit am liebsten? Sag es auf Sorbisch.", ru: "Супер! Что ты больше всего любишь делать в это время года? Скажи по-лужицки." }
  },
  // Klasse 3/4
  {
    id: "so-hodzina", lb: 4, stufe: 3, lz: ["so.ws.02", "so.sp.02"], name: "Kak pozdźe je? – Die Uhrzeit", e: "🕒", farbe: "#1F618D", grund: "#E5EFF7",
    intro: { de: "„Kak pozdźe je?“ heißt „Wie spät ist es?“. Wir sagen die vollen Stunden: eine Uhr, zwei Uhr, drei Uhr …", ru: "«Kak pozdźe je?» значит «Который час?». Называем целые часы: час, два часа, три часа …" },
    woerter: [
      { so: "Kak pozdźe je?", de: "Wie spät ist es?", ru: "Который час?", e: "❓" }, { so: "časnik", de: "Uhr", ru: "часы", e: "⌚" },
      { so: "jedna hodźina", de: "ein Uhr", ru: "час", e: "🕐" }, { so: "dwě hodźinje", de: "zwei Uhr", ru: "два часа", e: "🕑" },
      { so: "tři hodźiny", de: "drei Uhr", ru: "три часа", e: "🕒" }, { so: "štyri hodźiny", de: "vier Uhr", ru: "четыре часа", e: "🕓" },
      { so: "pjeć hodźin", de: "fünf Uhr", ru: "пять часов", e: "🕔" }, { so: "dwanaće hodźin", de: "zwölf Uhr", ru: "двенадцать часов", e: "🕛" }],
    extra: [
      { typ: "satz", de: "Sag: „Es ist fünf Uhr.“", ru: "Скажи: «Сейчас пять часов».", woerter: ["Je", "pjeć", "hodźin."], e: "🕔" },
      { typ: "wahl", frage: "Mittags um 12 Uhr läuten die Glocken. Wie spät ist es?", ru: "В 12 часов дня звонят колокола. Который час?", optionen: ["dwanaće hodźin", "dwě hodźinje", "jedna hodźina"], e: "🔔", warum: "„dwanaće“ heißt „zwölf“." }],
    ende: { de: "Jara derje! Schau heute dreimal auf die Uhr und sag die volle Stunde auf Sorbisch.", ru: "Очень хорошо! Посмотри сегодня три раза на часы и назови час по-лужицки." }
  },
  {
    id: "so-predmety", lb: 4, stufe: 3, lz: ["so.ws.02"], name: "Rozwrh hodźin – Schulfächer", e: "📋", farbe: "#B7950B", grund: "#FCF6DC",
    intro: { de: "Was steht heute auf deinem Stundenplan – „rozwrh hodźin“? Mathe, Deutsch, Musik? Und natürlich Sorbisch!", ru: "Что сегодня в твоём расписании — «rozwrh hodźin»? Математика, немецкий, музыка? И, конечно, лужицкий!" },
    woerter: [
      { so: "rozwrh hodźin", de: "Stundenplan", ru: "расписание", e: "📋" }, { so: "matematika", de: "Mathematik", ru: "математика", e: "➗" },
      { so: "němčina", de: "Deutsch", ru: "немецкий язык", e: "📝" }, { so: "serbšćina", de: "Sorbisch", ru: "лужицкий язык", e: "🪺" },
      { so: "hudźba", de: "Musik", ru: "музыка", e: "🎵" }, { so: "sport", de: "Sport", ru: "физкультура", e: "🤸" },
      { so: "wuměłstwo", de: "Kunst", ru: "рисование", e: "🎨" }, { so: "wěcna wučba", de: "Sachunterricht", ru: "окружающий мир", e: "🔬" }],
    extra: [
      { typ: "satz", de: "Sag: „Mir gefällt Musik.“", ru: "Скажи: «Мне нравится музыка».", woerter: ["Mi", "so", "lubi", "hudźba."], e: "🎶" }],
    ende: { de: "Super! Schreib morgen die Fächer auf deinem Stundenplan auch auf Sorbisch dazu.", ru: "Супер! Завтра подпиши предметы в своём расписании по-лужицки." }
  },
  {
    id: "so-dzen", lb: 4, stufe: 3, lz: ["so.ws.02"], name: "Dźeń – Morgen, Mittag, Abend", e: "🌅", farbe: "#CA6F1E", grund: "#FDEFE3",
    intro: { de: "Der Tag hat viele Abschnitte: Morgen, Vormittag, Mittag, Nachmittag, Abend und Nacht.", ru: "В дне много частей: утро, первая половина дня, полдень, вторая половина дня, вечер и ночь." },
    woerter: [
      { so: "dźeń", de: "Tag", ru: "день", e: "☀️" }, { so: "ranje", de: "Morgen", ru: "утро", e: "🌅" },
      { so: "dopołdnjo", de: "Vormittag", ru: "первая половина дня", e: "🏫" }, { so: "připołdnjo", de: "Mittag", ru: "полдень", e: "🍲" },
      { so: "popołdnjo", de: "Nachmittag", ru: "вторая половина дня", e: "🛝" }, { so: "wječor", de: "Abend", ru: "вечер", e: "🌇" },
      { so: "nóc", de: "Nacht", ru: "ночь", e: "🌙" }],
    extra: [
      { typ: "wahl", frage: "Wann stehst du auf und frühstückst?", ru: "Когда ты встаёшь и завтракаешь?", optionen: ["ranje", "wječor", "nóc"], e: "🥣", warum: "„ranje“ heißt „Morgen“." }],
    ende: { de: "Wulkotnje! Sag heute Abend „Dobry wječor!“ – Guten Abend!", ru: "Отлично! Скажи сегодня вечером «Dobry wječor!» — «Добрый вечер!»" }
  },
  {
    id: "so-hdze", lb: 3, stufe: 3, lz: ["so.ws.02", "so.sp.02"], name: "Hdźe je kóčka? – Wo ist was?", e: "🐈", farbe: "#A04000", grund: "#FBEEE6",
    intro: { de: "Die Katze versteckt sich überall: auf dem Bett, unter dem Tisch, hinter der Tür. Und was machen wir zu Hause?", ru: "Кошка прячется везде: на кровати, под столом, за дверью. А что мы делаем дома?" },
    woerter: [
      { so: "na", de: "auf", ru: "на", e: "⏫" }, { so: "pod", de: "unter", ru: "под", e: "⏬" },
      { so: "pódla", de: "neben", ru: "рядом", e: "↔️" }, { so: "za", de: "hinter", ru: "за", e: "🔙" },
      { so: "moja stwa", de: "mein Zimmer", ru: "моя комната", e: "🚪" }, { so: "warić", de: "kochen", ru: "готовить", e: "🍳" },
      { so: "rumować", de: "aufräumen", ru: "убирать", e: "🧹" }, { so: "spać", de: "schlafen", ru: "спать", e: "😴" }],
    extra: [
      { typ: "wahl", frage: "Die Katze schläft unter dem Tisch. Wo ist sie?", ru: "Кошка спит под столом. Где она?", optionen: ["pod blidom", "na blidźe", "za blidom"], e: "🐈", warum: "„pod“ heißt „unter“ – „pod blidom“ heißt „unter dem Tisch“." },
      { typ: "satz", de: "Sag: „Ich räume mein Zimmer auf.“", ru: "Скажи: «Я убираю свою комнату».", woerter: ["Ja", "rumuju", "swoju", "stwu."], e: "🧹" }],
    ende: { de: "Jara derje! Versteck ein Kuscheltier und sag auf Sorbisch, wo es ist: „na“, „pod“ oder „za“.", ru: "Очень хорошо! Спрячь мягкую игрушку и скажи по-лужицки, где она: «na», «pod» или «za»." }
  },
  {
    id: "so-wosoby", lb: 1, stufe: 3, lz: ["so.ws.02", "so.sp.02"], name: "Kajki je? – Personen beschreiben", e: "🧑", farbe: "#CB4335", grund: "#FBE9E7",
    intro: { de: "Wie sieht deine Freundin aus? Ist sie groß oder klein? Hat sie lange Haare und blaue Augen?", ru: "Как выглядит твоя подруга? Она высокая или маленькая? У неё длинные волосы и голубые глаза?" },
    woerter: [
      { so: "wulki", de: "groß", ru: "большой", e: "🦒" }, { so: "mały", de: "klein", ru: "маленький", e: "🐜" },
      { so: "włosy", de: "Haare", ru: "волосы", e: "💇" }, { so: "woči", de: "Augen", ru: "глаза", e: "👀" },
      { so: "dołhe włosy", de: "lange Haare", ru: "длинные волосы", e: "👱‍♀️" }, { so: "krótke włosy", de: "kurze Haare", ru: "короткие волосы", e: "👦" },
      { so: "módre woči", de: "blaue Augen", ru: "голубые глаза", e: "🔵" }, { so: "nawoči", de: "Brille", ru: "очки", e: "👓" }],
    extra: [
      { typ: "satz", de: "Sag: „Mia hat lange Haare.“", ru: "Скажи: «У Мии длинные волосы».", woerter: ["Mia", "ma", "dołhe", "włosy."], e: "👧" },
      { typ: "wahl", frage: "Paul ist 1 Meter 90 groß. Wie ist er?", ru: "Рост Пауля — 1 метр 90. Какой он?", optionen: ["wulki", "mały", "krótki"], e: "📏", warum: "„wulki“ heißt „groß“." }],
    ende: { de: "Super! Beschreib jemanden aus deiner Familie auf Sorbisch – die anderen raten, wer es ist.", ru: "Супер! Опиши кого-нибудь из семьи по-лужицки — остальные угадывают, кто это." }
  },
  {
    id: "so-mimika", lb: 1, stufe: 3, lz: ["so.sp.02", "so.ik.01"], name: "Woblico – Gesichter und Gesten", e: "🎭", farbe: "#884EA0", grund: "#F4ECF7",
    intro: { de: "Auch ohne Worte sagt dein Gesicht viel: Du lachst, weinst oder staunst. Schau genau hin – wie fühlt sich jemand?", ru: "Даже без слов лицо говорит многое: ты смеёшься, плачешь или удивляешься. Посмотри внимательно — что чувствует человек?" },
    woerter: [
      { so: "woblico", de: "Gesicht", ru: "лицо", e: "🙂" }, { so: "smjeć so", de: "lachen", ru: "смеяться", e: "😂" },
      { so: "płakać", de: "weinen", ru: "плакать", e: "😢" }, { so: "smutny", de: "traurig", ru: "грустный", e: "😞" },
      { so: "rozhněwany", de: "wütend", ru: "сердитый", e: "😠" }, { so: "překwapjeny", de: "überrascht", ru: "удивлённый", e: "😮" },
      { so: "kiwać", de: "winken", ru: "махать", e: "👋" }],
    extra: [
      { typ: "wahl", frage: "Schau das Gesicht an: 😠 Wie fühlt sich das Kind?", ru: "Посмотри на лицо: 😠 Что чувствует ребёнок?", optionen: ["rozhněwany", "smutny", "překwapjeny"], e: "🧒", warum: "„rozhněwany“ heißt „wütend“." }],
    ende: { de: "Jara derje! Spielt in der Familie „Gesichter raten“: Einer macht ein Gesicht, die anderen sagen es auf Sorbisch.", ru: "Очень хорошо! Поиграйте в семье «угадай лицо»: один корчит рожицу, остальные говорят по-лужицки." }
  },
  {
    id: "so-lubi", lb: 2, stufe: 3, lz: ["so.sp.02", "so.ws.02"], name: "Mi so lubi – Was mir gefällt", e: "👍", farbe: "#2471A3", grund: "#E6F1FA",
    intro: { de: "„Mi so lubi …“ heißt „Mir gefällt …“, „Mi so njelubi …“ heißt „Mir gefällt … nicht“. Was ist deine Lieblingskleidung?", ru: "«Mi so lubi …» значит «Мне нравится …», «Mi so njelubi …» — «Мне не нравится …». Какая твоя любимая одежда?" },
    woerter: [
      { so: "Mi so lubi …", de: "Mir gefällt …", ru: "Мне нравится …", e: "👍" }, { so: "Mi so njelubi …", de: "Mir gefällt … nicht", ru: "Мне не нравится …", e: "👎" },
      { so: "najlubši", de: "Lieblings-", ru: "любимый", e: "❤️" }, { so: "rjany", de: "schön", ru: "красивый", e: "✨" },
      { so: "nowy", de: "neu", ru: "новый", e: "🆕" }, { so: "čapka", de: "Mütze", ru: "шапка", e: "🧢" },
      { so: "šal", de: "Schal", ru: "шарф", e: "🧣" }],
    extra: [
      { typ: "satz", de: "Sag: „Mir gefällt die rote Mütze.“", ru: "Скажи: «Мне нравится красная шапка».", woerter: ["Mi", "so", "lubi", "čerwjena", "čapka."], e: "🧢" },
      { typ: "satz", de: "Sag: „Mir gefällt der Schal nicht.“", ru: "Скажи: «Мне не нравится шарф».", woerter: ["Mi", "so", "njelubi", "šal."], e: "🧣" }],
    ende: { de: "Wulkotnje! Zeig deiner Familie dein Lieblingsstück und sag: „Mi so lubi …“", ru: "Отлично! Покажи семье свою любимую вещь и скажи: «Mi so lubi …»" }
  },
  {
    id: "so-rady", lb: 6, stufe: 3, lz: ["so.sp.02", "so.ws.02"], name: "Što rady činiš? – Über Hobbys sprechen", e: "💬", farbe: "#239B56", grund: "#E7F6EC",
    intro: { de: "Wir unterhalten uns über Hobbys: „Što rady činiš?“ – „Was machst du gern?“ Und dann fragst du zurück: „A ty?“", ru: "Говорим о хобби: «Što rady činiš?» — «Что ты любишь делать?» А потом спрашиваешь в ответ: «A ty?»" },
    woerter: [
      { so: "Što rady činiš?", de: "Was machst du gern?", ru: "Что ты любишь делать?", e: "❓" }, { so: "Ja rady hraju kopańcu.", de: "Ich spiele gern Fußball.", ru: "Я люблю играть в футбол.", e: "⚽" },
      { so: "Ja rady jězdźu na kolesu.", de: "Ich fahre gern Fahrrad.", ru: "Я люблю кататься на велосипеде.", e: "🚲" }, { so: "A ty?", de: "Und du?", ru: "А ты?", e: "👉" },
      { so: "Ja tež.", de: "Ich auch.", ru: "Я тоже.", e: "🙌" }, { so: "Ja njerady …", de: "Ich … nicht gern.", ru: "Я не люблю …", e: "🙅" },
      { so: "najradšo", de: "am liebsten", ru: "больше всего", e: "🏆" }],
    extra: [
      { typ: "satz", de: "Frag: „Was machst du gern?“", ru: "Спроси: «Что ты любишь делать?»", woerter: ["Što", "rady", "činiš?"], e: "💬" },
      { typ: "wahl", frage: "Dein Freund sagt: „Ja rady čitam.“ Du liest auch gern. Was sagst du?", ru: "Друг говорит: «Ja rady čitam». Ты тоже любишь читать. Что ты скажешь?", optionen: ["Ja tež.", "A ty?", "Ja njerady …"], e: "📚", warum: "„Ja tež“ heißt „Ich auch“." }],
    ende: { de: "Jara derje! Frag jemanden auf Sorbisch: „Što rady činiš?“", ru: "Очень хорошо! Спроси кого-нибудь по-лужицки: «Što rady činiš?»" }
  },
  {
    id: "so-wopis", lb: 5, stufe: 3, lz: ["so.ws.02", "so.sp.02"], name: "Kajke je zwěrjo? – Tiere beschreiben", e: "🐘", farbe: "#7D6608", grund: "#FAF4DD",
    intro: { de: "Der Elefant ist groß, die Schnecke ist langsam, der Fisch lebt im Wasser. Wir beschreiben Tiere – und du erfindest dein Wunschtier!", ru: "Слон большой, улитка медленная, рыба живёт в воде. Мы описываем животных — а ты придумаешь животное своей мечты!" },
    woerter: [
      { so: "wulki", de: "groß", ru: "большой", e: "🐘" }, { so: "mały", de: "klein", ru: "маленький", e: "🐭" },
      { so: "spěšny", de: "schnell", ru: "быстрый", e: "🐆" }, { so: "pomały", de: "langsam", ru: "медленный", e: "🐌" },
      { so: "sylny", de: "stark", ru: "сильный", e: "🦍" }, { so: "žiwy w lěsu", de: "lebt im Wald", ru: "живёт в лесу", e: "🌲" },
      { so: "žiwy we wodźe", de: "lebt im Wasser", ru: "живёт в воде", e: "🐟" }],
    extra: [
      { typ: "satz", de: "Sag: „Der Elefant ist groß.“", ru: "Скажи: «Слон большой».", woerter: ["Słon", "je", "wulki."], e: "🐘" },
      { typ: "wahl", frage: "Die Schnecke kriecht ganz gemütlich. Wie ist sie?", ru: "Улитка ползёт очень не спеша. Какая она?", optionen: ["pomała", "spěšna", "sylna"], e: "🐌", warum: "„pomały“ heißt „langsam“ – bei „šlinka“ (die Schnecke) heißt es „pomała“." }],
    ende: { de: "Super! Mal dein Wunschtier und schreib dazu: „Moje zwěrjo je …“ – groß, klein, schnell?", ru: "Супер! Нарисуй животное своей мечты и подпиши: «Moje zwěrjo je …» — большое, маленькое, быстрое?" }
  },
  {
    id: "so-dzesatki", lb: 7, stufe: 3, lz: ["so.ws.02"], name: "Dźesatki – Zehner bis 100", e: "💯", farbe: "#117A65", grund: "#E3F4EF",
    intro: { de: "Zehn, zwanzig, dreißig … bis hundert. Ab fünfzig enden die Zehner auf Sorbisch auf „-dźesat“.", ru: "Десять, двадцать, тридцать … до ста. Начиная с пятидесяти, десятки по-лужицки кончаются на «-dźesat»." },
    woerter: [
      { so: "dźesać", de: "zehn", ru: "десять", e: "🔟" }, { so: "dwaceći", de: "zwanzig", ru: "двадцать", e: "20" },
      { so: "třiceći", de: "dreißig", ru: "тридцать", e: "30" }, { so: "štyrceći", de: "vierzig", ru: "сорок", e: "40" },
      { so: "pjećdźesat", de: "fünfzig", ru: "пятьдесят", e: "50" }, { so: "šěsćdźesat", de: "sechzig", ru: "шестьдесят", e: "60" },
      { so: "sydomdźesat", de: "siebzig", ru: "семьдесят", e: "70" }, { so: "wosomdźesat", de: "achtzig", ru: "восемьдесят", e: "80" },
      { so: "dźewjećdźesat", de: "neunzig", ru: "девяносто", e: "90" }, { so: "sto", de: "hundert", ru: "сто", e: "💯" }],
    extra: [
      { typ: "wahl", frage: "Ein Euro hat 100 Cent. Wie heißt hundert?", ru: "В одном евро 100 центов. Как будет «сто»?", optionen: ["sto", "dźesać", "dźewjećdźesat"], e: "💶", warum: "„sto“ heißt „hundert“." }],
    ende: { de: "Wulkotnje! Zähl in Zehnerschritten bis „sto“ – so schnell du kannst.", ru: "Отлично! Посчитай десятками до «sto» — как можно быстрее." }
  },
  {
    id: "so-wobchod", lb: 7, stufe: 3, lz: ["so.sp.02", "so.ws.02"], name: "We wobchodźe – Ein Verkaufsgespräch", e: "🏪", farbe: "#B9770E", grund: "#FDF2E0",
    intro: { de: "Wir spielen Laden: „Ja bych rady …“ heißt „Ich hätte gern …“, „Što to płaći?“ heißt „Was kostet das?“. Und höflich sein: prošu und dźakuju so!", ru: "Играем в магазин: «Ja bych rady …» значит «Я бы хотел …», «Što to płaći?» — «Сколько это стоит?». И будь вежлив: prošu и dźakuju so!" },
    woerter: [
      { so: "wobchod", de: "Laden", ru: "магазин", e: "🏪" }, { so: "předawarka", de: "Verkäuferin", ru: "продавщица", e: "👩‍💼" },
      { so: "Ja bych rady …", de: "Ich hätte gern …", ru: "Я бы хотел …", e: "🙋" }, { so: "Što to płaći?", de: "Was kostet das?", ru: "Сколько это стоит?", e: "🏷️" },
      { so: "euro", de: "Euro", ru: "евро", e: "💶" }, { so: "pjenjezy", de: "Geld", ru: "деньги", e: "💰" },
      { so: "Hišće něšto?", de: "Noch etwas?", ru: "Что-нибудь ещё?", e: "➕" }],
    extra: [
      { typ: "satz", de: "Sag: „Ich hätte gern ein Brot.“", ru: "Скажи: «Я бы хотел хлеб».", woerter: ["Ja", "bych", "rady", "chlěb."], e: "🍞" },
      { typ: "wahl", frage: "Die Verkäuferin fragt: „Hišće něšto?“ Du brauchst nichts mehr. Was sagst du?", ru: "Продавщица спрашивает: «Hišće něšto?» Тебе больше ничего не нужно. Что ты скажешь?", optionen: ["Ně, dźakuju so.", "Haj, prošu.", "Dobru nóc."], e: "🛍️", warum: "„Ně, dźakuju so“ heißt „Nein, danke“ – höflich!" }],
    ende: { de: "Jara derje! Spielt zu Hause Laden – mit Spielgeld und auf Sorbisch.", ru: "Очень хорошо! Поиграйте дома в магазин — с игрушечными деньгами и по-лужицки." }
  },
  {
    id: "so-mjeniny", lb: 8, stufe: 3, lz: ["so.ik.01", "so.ws.02"], name: "Mjeniny – Kalender und Namenstage", e: "📛", farbe: "#C2185B", grund: "#FCE4EF",
    intro: { de: "Viele Sorben feiern nicht nur Geburtstag, sondern auch Namenstag – „mjeniny“. Jeder Tag im Kalender gehört zu einem Namen. Wann ist deiner?", ru: "Многие лужичане празднуют не только день рождения, но и именины — «mjeniny». Каждый день в календаре связан с каким-то именем. Когда твои?" },
    woerter: [
      { so: "kalender", de: "Kalender", ru: "календарь", e: "📅" }, { so: "mjeniny", de: "Namenstag", ru: "именины", e: "📛" },
      { so: "narodniny", de: "Geburtstag", ru: "день рождения", e: "🎂" }, { so: "dźensa", de: "heute", ru: "сегодня", e: "👇" },
      { so: "jutře", de: "morgen", ru: "завтра", e: "➡️" }, { so: "wčera", de: "gestern", ru: "вчера", e: "⬅️" },
      { so: "tydźeń", de: "Woche", ru: "неделя", e: "🗓️" }, { so: "měsac", de: "Monat", ru: "месяц", e: "🌙" }],
    extra: [
      { typ: "wahl", frage: "Am Tag ihres Namens bekommt Maria ein kleines Geschenk. Was feiert sie?", ru: "В день своего имени Мария получает маленький подарок. Что она празднует?", optionen: ["mjeniny", "narodniny", "hody"], e: "🎁", warum: "„mjeniny“ heißt „Namenstag“." }],
    ende: { de: "Wulkotnje! Bastel einen Familienkalender mit Geburtstagen und Namenstagen – und schreib die sorbischen Monatsnamen dazu.", ru: "Отлично! Сделай семейный календарь с днями рождения и именинами — и подпиши лужицкие названия месяцев." }
  },
  {
    id: "so-datum", lb: 10, stufe: 3, lz: ["so.ws.02"], name: "Prěni, druhi – Datum und Ordnungszahlen", e: "🥇", farbe: "#5B2C6F", grund: "#F1E8F5",
    intro: { de: "Wer ist Erster, wer Zweiter? Mit Ordnungszahlen sagst du auch das Datum: „prěni róžowc“ ist der erste Mai.", ru: "Кто первый, кто второй? С порядковыми числительными называют и дату: «prěni róžowc» — первое мая." },
    woerter: [
      { so: "prěni", de: "der Erste", ru: "первый", e: "🥇" }, { so: "druhi", de: "der Zweite", ru: "второй", e: "🥈" },
      { so: "třeći", de: "der Dritte", ru: "третий", e: "🥉" }, { so: "štwórty", de: "der Vierte", ru: "четвёртый", e: "4️⃣" },
      { so: "pjaty", de: "der Fünfte", ru: "пятый", e: "5️⃣" }, { so: "sydmy", de: "der Siebte", ru: "седьмой", e: "7️⃣" },
      { so: "dźesaty", de: "der Zehnte", ru: "десятый", e: "🔟" }, { so: "datum", de: "Datum", ru: "дата", e: "📆" }],
    extra: [
      { typ: "wahl", frage: "Beim Wettlauf kommst du als Erste oder Erster ins Ziel. Welcher Platz?", ru: "В забеге ты приходишь к финишу первым. Какое место?", optionen: ["prěni", "třeći", "dźesaty"], e: "🏁", warum: "„prěni“ heißt „der Erste“." },
      { typ: "wahl", frage: "Der 25. Januar ist Vogelhochzeit. Der Januar ist der … Monat.", ru: "25 января — птичья свадьба. Январь — это … месяц.", optionen: ["prěni", "druhi", "pjaty"], e: "🐦", warum: "Der Januar ist der erste Monat – „prěni“." }],
    ende: { de: "Super! Schreib das heutige Datum mit dem sorbischen Monatsnamen auf.", ru: "Супер! Напиши сегодняшнюю дату с лужицким названием месяца." }
  },
  {
    id: "so-strony", lb: 10, stufe: 3, lz: ["so.ws.02", "so.ik.01"], name: "Sewjer a juh – Himmelsrichtungen", e: "🧭", farbe: "#2E86C1", grund: "#E4F1FB",
    intro: { de: "Norden, Süden, Osten, Westen: Mit dem Kompass findest du den Weg. Die Oberlausitz liegt im Osten von Sachsen.", ru: "Север, юг, восток, запад: с компасом найдёшь дорогу. Верхняя Лужица находится на востоке Саксонии." },
    woerter: [
      { so: "sewjer", de: "Norden", ru: "север", e: "⬆️" }, { so: "juh", de: "Süden", ru: "юг", e: "⬇️" },
      { so: "wuchod", de: "Osten", ru: "восток", e: "➡️" }, { so: "zapad", de: "Westen", ru: "запад", e: "⬅️" },
      { so: "kompas", de: "Kompass", ru: "компас", e: "🧭" }, { so: "karta", de: "Landkarte", ru: "карта", e: "🗺️" }],
    extra: [
      { typ: "wahl", frage: "Wo geht morgens die Sonne auf?", ru: "Где утром восходит солнце?", optionen: ["na wuchodźe", "na zapadźe", "na sewjerje"], e: "🌄", warum: "Die Sonne geht im Osten auf – „na wuchodźe“." }],
    ende: { de: "Jara derje! Stell dich morgens so hin, dass die Sonne vor dir ist – dann schaust du nach „wuchod“.", ru: "Очень хорошо! Встань утром лицом к солнцу — значит, ты смотришь на «wuchod»." }
  },
  {
    id: "so-wjes", lb: 9, stufe: 3, lz: ["so.sp.02", "so.ws.02"], name: "Hdźe je šula? – Den Weg beschreiben", e: "🚸", farbe: "#2874A6", grund: "#E6F0F8",
    intro: { de: "Jemand sucht die Kirche. Du hilfst: links, rechts, geradeaus! „Hdźe je …?“ heißt „Wo ist …?“", ru: "Кто-то ищет церковь. Ты помогаешь: налево, направо, прямо! «Hdźe je …?» значит «Где …?»" },
    woerter: [
      { so: "Hdźe je …?", de: "Wo ist …?", ru: "Где …?", e: "❓" }, { so: "nalěwo", de: "links", ru: "налево", e: "⬅️" },
      { so: "naprawo", de: "rechts", ru: "направо", e: "➡️" }, { so: "runje", de: "geradeaus", ru: "прямо", e: "⬆️" },
      { so: "cyrkej", de: "Kirche", ru: "церковь", e: "⛪" }, { so: "dwórnišćo", de: "Bahnhof", ru: "вокзал", e: "🚉" },
      { so: "torhošćo", de: "Marktplatz", ru: "рыночная площадь", e: "🛍️" }, { so: "most", de: "Brücke", ru: "мост", e: "🌉" }],
    extra: [
      { typ: "satz", de: "Sag: „Geh nach rechts!“", ru: "Скажи: «Иди направо!»", woerter: ["Dźi", "naprawo!"], e: "➡️" },
      { typ: "wahl", frage: "Der Weg zur Schule geht geradeaus über die Brücke. Was sagst du?", ru: "Дорога в школу идёт прямо через мост. Что ты скажешь?", optionen: ["Dźi runje!", "Dźi nalěwo!", "Dźi naprawo!"], e: "🏫", warum: "„runje“ heißt „geradeaus“." }],
    ende: { de: "Super! Beschreib jemandem auf Sorbisch deinen Schulweg: „nalěwo“, „naprawo“, „runje“.", ru: "Супер! Опиши кому-нибудь по-лужицки свою дорогу в школу: «nalěwo», «naprawo», «runje»." }
  },
  {
    id: "so-luzica", lb: 9, stufe: 3, lz: ["so.ik.01", "so.ws.02"], name: "Po Łužicy – Ausflugsziele", e: "🏰", farbe: "#1A5276", grund: "#E5EEF6",
    intro: { de: "In der Lausitz gibt es viel zu entdecken: die Ortenburg in Bautzen, das Kloster St. Marienstern, den Spreewald mit seinen Kähnen und die Krabatmühle in Schwarzkollm.", ru: "В Лужице много интересного: замок Ортенбург в Баутцене, монастырь Мариенштерн, Шпревальд с лодками и мельница Крабата в Шварцколме." },
    woerter: [
      { so: "hród", de: "Burg / Schloss", ru: "замок", e: "🏰" }, { so: "klóšter", de: "Kloster", ru: "монастырь", e: "🔔" },
      { so: "muzej", de: "Museum", ru: "музей", e: "🖼️" }, { so: "wěža", de: "Turm", ru: "башня", e: "🗼" },
      { so: "młyn", de: "Mühle", ru: "мельница", e: "⚙️" }, { so: "Błota", de: "Spreewald", ru: "Шпревальд", e: "🛶" },
      { so: "jězor", de: "See", ru: "озеро", e: "🏖️" }, { so: "wulět", de: "Ausflug", ru: "экскурсия", e: "🎒" }],
    extra: [
      { typ: "wahl", frage: "Im Spreewald fährt man mit dem Kahn über die Fließe. Wie heißt der Spreewald auf Sorbisch?", ru: "В Шпревальде катаются на лодке по протокам. Как Шпревальд называется по-лужицки?", optionen: ["Błota", "Budyšin", "Łuka"], e: "🛶", warum: "Der Spreewald heißt „Błota“ – das heißt eigentlich „Sümpfe“." },
      { typ: "wahl", frage: "Aus alten Tagebauen sind in der Lausitz viele Badeseen geworden. Was ist ein See?", ru: "Из старых карьеров в Лужице получилось много озёр. Как будет «озеро»?", optionen: ["jězor", "młyn", "wěža"], e: "🏊", warum: "„jězor“ heißt „See“ – das Lausitzer Seenland." }],
    ende: { de: "Jara derje! Plant zusammen einen Ausflug in die Lausitz – wohin möchtest du?", ru: "Очень хорошо! Спланируйте вместе поездку в Лужицу — куда ты хочешь?" }
  },
  {
    id: "so-mjena", lb: 9, stufe: 3, lz: ["so.ik.01", "so.le.01"], name: "Serbske mjena – Ortsnamen", e: "🪧", farbe: "#34495E", grund: "#EAEEF2",
    intro: { de: "In der Lausitz haben viele Orte zwei Namen: einen deutschen und einen sorbischen. Auf den Ortsschildern stehen beide!", ru: "В Лужице у многих мест два названия: немецкое и лужицкое. На табличках написаны оба!" },
    woerter: [
      { so: "Budyšin", de: "Bautzen", ru: "Баутцен", e: "🏰" }, { so: "Kamjenc", de: "Kamenz", ru: "Каменц", e: "📜" },
      { so: "Wojerecy", de: "Hoyerswerda", ru: "Хойерсверда", e: "🏙️" }, { so: "Kulow", de: "Wittichenau", ru: "Виттихенау", e: "⛪" },
      { so: "Chrósćicy", de: "Crostwitz", ru: "Кроствиц", e: "🐎" }, { so: "Slepo", de: "Schleife", ru: "Шлайфе", e: "🌲" },
      { so: "Zhorjelc", de: "Görlitz", ru: "Гёрлиц", e: "🌉" }, { so: "Lubij", de: "Löbau", ru: "Лёбау", e: "⛰️" }],
    extra: [
      { typ: "wahl", frage: "Auf dem Ortsschild steht „Hoyerswerda“ und darunter …?", ru: "На табличке написано «Хойерсверда», а под ним …?", optionen: ["Wojerecy", "Kamjenc", "Kulow"], e: "🪧", warum: "Hoyerswerda heißt auf Sorbisch „Wojerecy“." }],
    ende: { de: "Super! Achte bei der nächsten Fahrt durch die Lausitz auf die zweisprachigen Ortsschilder.", ru: "Супер! В следующей поездке по Лужице обрати внимание на двуязычные таблички." }
  },
  // Wahlbereiche (freiwillig)
  {
    id: "so-domizna", lb: 12, stufe: 3, lz: ["so.ik.01", "so.ws.02"], name: "Moja domizna – Meine Heimatregion", e: "🏡", farbe: "#1E8449", grund: "#E5F5EA",
    intro: { de: "Die Lausitz – „Łužica“ – ist die Heimat der Sorben. Es gibt die Oberlausitz mit Bergen und die Niederlausitz mit dem Spreewald. Die sorbische Fahne ist blau, rot und weiß.", ru: "Лужица — «Łužica» — родина лужичан. Есть Верхняя Лужица с горами и Нижняя Лужица со Шпревальдом. Лужицкий флаг — сине-красно-белый." },
    woerter: [
      { so: "domizna", de: "Heimat", ru: "родина", e: "🏡" }, { so: "Łužica", de: "Lausitz", ru: "Лужица", e: "🗺️" },
      { so: "Hornja Łužica", de: "Oberlausitz", ru: "Верхняя Лужица", e: "⛰️" }, { so: "Delnja Łužica", de: "Niederlausitz", ru: "Нижняя Лужица", e: "🛶" },
      { so: "wjes", de: "Dorf", ru: "деревня", e: "🏘️" }, { so: "město", de: "Stadt", ru: "город", e: "🏙️" },
      { so: "Serbja", de: "die Sorben", ru: "лужичане", e: "👪" }, { so: "chorhoj", de: "Fahne", ru: "флаг", e: "🚩" }],
    extra: [
      { typ: "wahl", frage: "Welche Farben hat die sorbische Fahne?", ru: "Какого цвета лужицкий флаг?", optionen: ["módra, čerwjena, běła", "čorna, čerwjena, złota", "zelena, běła, čerwjena"], e: "🚩", warum: "Die sorbische Fahne ist blau, rot und weiß – „módra, čerwjena, běła“." }],
    ende: { de: "Wulkotnje! Mal eine Karte von deinem Wohnort und schreib „moja domizna“ darüber.", ru: "Отлично! Нарисуй карту своего места и подпиши сверху «moja domizna»." }
  },
  {
    id: "so-budysin", lb: 12, stufe: 3, lz: ["so.ik.01", "so.ws.02"], name: "Budyšin – Eine Stadt in der Lausitz", e: "🗼", farbe: "#922B21", grund: "#F9EBEA",
    intro: { de: "Bautzen – „Budyšin“ – ist über 1000 Jahre alt. Hier stehen das Haus der Sorben, das Sorbische Museum und ein Theater, das auf Deutsch und Sorbisch spielt. Der Reichenturm ist ein bisschen schief!", ru: "Баутцену — «Budyšin» — больше 1000 лет. Здесь есть Дом лужичан, Лужицкий музей и театр, который играет по-немецки и по-лужицки. Башня Райхентурм немного наклонена!" },
    woerter: [
      { so: "Budyšin", de: "Bautzen", ru: "Баутцен", e: "🏰" }, { so: "Serbski dom", de: "Haus der Sorben", ru: "Дом лужичан", e: "🏛️" },
      { so: "dźiwadło", de: "Theater", ru: "театр", e: "🎭" }, { so: "Sprjewja", de: "Spree", ru: "Шпрее", e: "🏞️" },
      { so: "kruta wěža", de: "schiefer Turm", ru: "наклонная башня", e: "🗼" }, { so: "hasa", de: "Gasse / Straße", ru: "улица", e: "🛣️" },
      { so: "hornc", de: "Senf", ru: "горчица", e: "🌭" }],
    extra: [
      { typ: "wahl", frage: "Durch Bautzen fließt ein Fluss. Wie heißt die Spree auf Sorbisch?", ru: "Через Баутцен течёт река. Как Шпрее называется по-лужицки?", optionen: ["Sprjewja", "Nysa", "Łobjo"], e: "🌊", warum: "Die Spree heißt „Sprjewja“, die Neiße „Nysa“, die Elbe „Łobjo“." }],
    ende: { de: "Jara derje! Bautzen ist auch für seinen Senf bekannt. Schau, ob ihr welchen im Kühlschrank habt!", ru: "Очень хорошо! Баутцен известен и своей горчицей. Посмотри, нет ли её у вас в холодильнике!" }
  },
  {
    id: "so-baje", lb: 12, stufe: 3, lz: ["so.ik.01", "so.le.01"], name: "Serbske baje – Sagengestalten", e: "🧙", farbe: "#4A235A", grund: "#F0E6F5",
    intro: { de: "Die Sorben erzählen alte Sagen: von Krabat, dem Müllerjungen, der in der schwarzen Mühle zaubern lernt und mit Raben fliegt; vom Wassermann, der im Teich wohnt; und von der Mittagsfrau, die mittags über die Felder geht.", ru: "Лужичане рассказывают старые предания: о Крабате, мальчике с мельницы, который научился колдовать и летал с воронами; о водяном, живущем в пруду; о полуднице, что в полдень ходит по полям." },
    woerter: [
      { so: "baja", de: "Sage", ru: "предание", e: "📜" }, { so: "Krabat", de: "Krabat", ru: "Крабат", e: "🧙" },
      { so: "hawron", de: "Rabe", ru: "ворон", e: "🐦‍⬛" }, { so: "młyn", de: "Mühle", ru: "мельница", e: "⚙️" },
      { so: "wódny muž", de: "Wassermann", ru: "водяной", e: "🌊" }, { so: "připołdnica", de: "Mittagsfrau", ru: "полуденница", e: "🌾" },
      { so: "lutki", de: "Lutki (kleine Leute)", ru: "лютки (маленький народец)", e: "🍄" }],
    extra: [
      { typ: "wahl", frage: "Krabat verwandelt sich mit den anderen Müllerburschen in Vögel. In welche?", ru: "Крабат с другими подмастерьями превращается в птиц. В каких?", optionen: ["hawrony", "ptački", "kokoše"], e: "🪶", warum: "Sie werden zu Raben – „hawrony“." }],
    ende: { de: "Super! Lass dir eine Sage erzählen oder vorlesen und mal Krabat oder den Wassermann.", ru: "Супер! Попроси рассказать или прочитать тебе предание и нарисуй Крабата или водяного." }
  },
  {
    id: "so-jutrowne", lb: 12, stufe: 3, lz: ["so.ik.01", "so.ws.02"], name: "Jutrowne nałožki – Osterbräuche", e: "🐣", farbe: "#A93226", grund: "#FAE5E3",
    intro: { de: "Zu Ostern gibt es bei den Sorben viele Bräuche: Ostereier mit Wachs und Feder verzieren, Osterwasser holen, Osterfeuer, Eier den Hang hinunterrollen (Waleien) – und am Ostersonntag reiten die Osterreiter.", ru: "На Пасху у лужичан много обычаев: расписывать яйца воском и пером, приносить пасхальную воду, пасхальный костёр, катать яйца с горки — а в пасхальное воскресенье выезжают пасхальные всадники." },
    woerter: [
      { so: "jutrowne jejko", de: "Osterei", ru: "пасхальное яйцо", e: "🥚" }, { so: "wósk", de: "Wachs", ru: "воск", e: "🕯️" },
      { so: "pjero", de: "Feder", ru: "перо", e: "🪶" }, { so: "křižerjo", de: "Osterreiter", ru: "пасхальные всадники", e: "🐎" },
      { so: "jutrowny wohen", de: "Osterfeuer", ru: "пасхальный костёр", e: "🔥" }, { so: "jutrowna woda", de: "Osterwasser", ru: "пасхальная вода", e: "💧" },
      { so: "walkowanje", de: "Eierrollen (Waleien)", ru: "катание яиц", e: "⛰️" }, { so: "jutrowny zajac", de: "Osterhase", ru: "пасхальный заяц", e: "🐇" }],
    extra: [
      { typ: "wahl", frage: "Womit tragen die Sorben die feinen Muster auf die Ostereier auf?", ru: "Чем лужичане наносят тонкие узоры на пасхальные яйца?", optionen: ["z wóskom a pjerom", "z nožicami", "z linealom"], e: "🎨", warum: "Mit Wachs und einer Feder – „z wóskom a pjerom“." }],
    ende: { de: "Wulkotnje! Verziere vor Ostern mit einem Erwachsenen ein Ei mit Wachs – wie die Sorben.", ru: "Отлично! Перед Пасхой распиши со взрослым яйцо воском — как лужичане." }
  }
);
