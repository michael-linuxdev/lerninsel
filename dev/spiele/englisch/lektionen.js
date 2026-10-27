// Englisch mit Papagei Paula (Englisch-Einstieg, Kl. 3–4 und Übergang 5; nach den Grundschul-Lehrplänen der Länder, GeR-Niveau A1 angebahnt).
// Lektion: { id, stufe, lz, name, e, farbe, grund, intro: { de, ru }, woerter: [{ en, de, ru, e }], extra: [Schritte], ende: { de, ru } }
// Aus den Wörtern entstehen automatisch: Wortkarten (anhören, nachsprechen), Hören („Welches Bild?“), Lesen („Welches Bild?“), Übersetzen („Wie heißt das auf Englisch?“).
// Zusätzliche Schritt-Typen in extra:
//   satz { de, ru, woerter: ["I", "like", "apples."], e? }   – englischen Satz aus Wörtern bauen
//   wahl { frage, ru, optionen: [richtig, falsch, falsch], e?, warum? } – Antwort auf Englisch wählen (erste Option richtig)
// Russische Texte sind Entwürfe (SPRACHEN.md); englische Wörter werden mit der englischen Gerätestimme vorgelesen.
window.ENGLISCH = [
  {
    id: "en-hello", stufe: 3, lz: ["en.sp.01", "en.hv.01"], name: "Hello! – Begrüßen", e: "👋", farbe: "#E0574A", grund: "#FFECE8",
    intro: { de: "Hello, {name}! Ich bin Paula. Papageien sprechen gern nach – und ich kann Englisch! Hör zu und sprich mir nach.", ru: "Hello, {name}! Я Паула. Попугаи любят повторять — а я умею говорить по-английски! Слушай и повторяй за мной." },
    woerter: [
      { en: "hello", de: "hallo", ru: "привет", e: "👋" }, { en: "goodbye", de: "auf Wiedersehen", ru: "до свидания", e: "🚶" },
      { en: "good morning", de: "guten Morgen", ru: "доброе утро", e: "🌅" }, { en: "good night", de: "gute Nacht", ru: "спокойной ночи", e: "🌙" },
      { en: "please", de: "bitte", ru: "пожалуйста", e: "🙏" }, { en: "thank you", de: "danke", ru: "спасибо", e: "💐" },
      { en: "yes", de: "ja", ru: "да", e: "👍" }, { en: "no", de: "nein", ru: "нет", e: "👎" }],
    extra: [
      { typ: "satz", de: "Stell dich vor: „Ich heiße Mia.“", ru: "Представься: «Меня зовут Мия».", woerter: ["My", "name", "is", "Mia."], e: "🙋" },
      { typ: "wahl", frage: "Jemand fragt: „How are you?“ Was antwortest du?", ru: "Тебя спрашивают: «How are you?» Что ответишь?", optionen: ["I'm fine, thank you.", "Good night.", "I'm eight."], e: "🙂", warum: "„How are you?“ heißt „Wie geht es dir?“ – „I'm fine“ heißt „Mir geht es gut“." }],
    ende: { de: "Super! Sag heute zu deiner Familie einmal „Good morning“ oder „Good night“.", ru: "Супер! Скажи сегодня своей семье «Good morning» или «Good night»." }
  },
  {
    id: "en-colours", stufe: 3, lz: ["en.ws.01", "en.hv.01"], name: "Colours – Farben", e: "🎨", farbe: "#7B55B8", grund: "#EFE6FF",
    intro: { de: "Farben heißen auf Englisch „colours“. Hör genau hin – manche klingen ganz anders als auf Deutsch.", ru: "Цвета по-английски — «colours». Слушай внимательно — некоторые звучат совсем не так, как по-немецки." },
    woerter: [
      { en: "red", de: "rot", ru: "красный", e: "🔴" }, { en: "blue", de: "blau", ru: "синий", e: "🔵" }, { en: "green", de: "grün", ru: "зелёный", e: "🟢" },
      { en: "yellow", de: "gelb", ru: "жёлтый", e: "🟡" }, { en: "orange", de: "orange", ru: "оранжевый", e: "🟠" }, { en: "purple", de: "lila", ru: "фиолетовый", e: "🟣" },
      { en: "black", de: "schwarz", ru: "чёрный", e: "⚫" }, { en: "white", de: "weiß", ru: "белый", e: "⚪" }],
    extra: [
      { typ: "satz", de: "Bau den Satz: „Der Apfel ist rot.“", ru: "Составь предложение: «Яблоко красное».", woerter: ["The", "apple", "is", "red."], e: "🍎" },
      { typ: "wahl", frage: "Welche Farbe hat eine Banane?", ru: "Какого цвета банан?", optionen: ["yellow", "blue", "black"], e: "🍌" },
      { typ: "wahl", frage: "Wie heißt „hellgrün“ auf Englisch?", ru: "Как по-английски «светло-зелёный»?", optionen: ["light green", "dark green", "green light"], e: "🍏", warum: "light = hell, dark = dunkel: light green, dark blue." }],
    ende: { de: "Toll! Such zu Hause etwas, das „green“ ist, und sag es laut.", ru: "Здорово! Найди дома что-нибудь «green» и скажи это вслух." }
  },
  {
    id: "en-numbers", stufe: 3, lz: ["en.ws.01", "en.hv.01"], name: "Numbers – Zahlen bis 10", e: "🔢", farbe: "#2FA37C", grund: "#E3F7EF",
    intro: { de: "Jetzt zählen wir auf Englisch von eins bis zehn: one, two, three …", ru: "Теперь считаем по-английски от одного до десяти: one, two, three …" },
    woerter: [
      { en: "one", de: "eins", ru: "один", e: "1️⃣" }, { en: "two", de: "zwei", ru: "два", e: "2️⃣" }, { en: "three", de: "drei", ru: "три", e: "3️⃣" },
      { en: "four", de: "vier", ru: "четыре", e: "4️⃣" }, { en: "five", de: "fünf", ru: "пять", e: "5️⃣" }, { en: "six", de: "sechs", ru: "шесть", e: "6️⃣" },
      { en: "seven", de: "sieben", ru: "семь", e: "7️⃣" }, { en: "eight", de: "acht", ru: "восемь", e: "8️⃣" }, { en: "nine", de: "neun", ru: "девять", e: "9️⃣" },
      { en: "ten", de: "zehn", ru: "десять", e: "🔟" }],
    extra: [
      { typ: "satz", de: "Sag, wie alt du bist: „Ich bin acht.“", ru: "Скажи, сколько тебе лет: «Мне восемь».", woerter: ["I", "am", "eight."], e: "🎂" },
      { typ: "wahl", frage: "Two + three = ?", ru: "Два плюс три = ?", optionen: ["five", "four", "six"], e: "➕" }],
    ende: { de: "Klasse! Zähl heute deine Stifte auf Englisch.", ru: "Класс! Посчитай сегодня свои карандаши по-английски." }
  },
  {
    id: "en-animals", stufe: 3, lz: ["en.ws.01", "en.hv.01"], name: "Animals – Tiere", e: "🐶", farbe: "#B5701A", grund: "#FFF1D9",
    intro: { de: "Tiere auf Englisch! Manche Wörter kennst du vielleicht schon.", ru: "Животные по-английски! Некоторые слова ты, может быть, уже знаешь." },
    woerter: [
      { en: "dog", de: "Hund", ru: "собака", e: "🐶" }, { en: "cat", de: "Katze", ru: "кошка", e: "🐱" }, { en: "bird", de: "Vogel", ru: "птица", e: "🐦" },
      { en: "fish", de: "Fisch", ru: "рыба", e: "🐟" }, { en: "horse", de: "Pferd", ru: "лошадь", e: "🐴" }, { en: "cow", de: "Kuh", ru: "корова", e: "🐮" },
      { en: "pig", de: "Schwein", ru: "свинья", e: "🐷" }, { en: "mouse", de: "Maus", ru: "мышь", e: "🐭" }],
    extra: [
      { typ: "satz", de: "Bau den Satz: „Ich habe einen Hund.“", ru: "Составь предложение: «У меня есть собака».", woerter: ["I", "have", "a", "dog."], e: "🐶" },
      { typ: "wahl", frage: "Welches Tier sagt „moo“?", ru: "Какое животное говорит «му»?", optionen: ["cow", "cat", "bird"], e: "🐮" }],
    ende: { de: "Prima! Welches Tier magst du am liebsten? Sag es auf Englisch!", ru: "Отлично! Какое животное тебе нравится больше всего? Скажи по-английски!" }
  },
  {
    id: "en-body", stufe: 3, lz: ["en.ws.01", "en.hv.01"], name: "My body – Mein Körper", e: "👂", farbe: "#E0578F", grund: "#FFE8F1",
    intro: { de: "Zeig mit: Wenn ich „nose“ sage, tippst du auf deine Nase!", ru: "Показывай: когда я скажу «nose», дотронься до своего носа!" },
    woerter: [
      { en: "eye", de: "Auge", ru: "глаз", e: "👁️" }, { en: "ear", de: "Ohr", ru: "ухо", e: "👂" }, { en: "nose", de: "Nase", ru: "нос", e: "👃" },
      { en: "mouth", de: "Mund", ru: "рот", e: "👄" }, { en: "hand", de: "Hand", ru: "рука (кисть)", e: "✋" }, { en: "foot", de: "Fuß", ru: "ступня", e: "🦶" },
      { en: "leg", de: "Bein", ru: "нога", e: "🦵" }, { en: "arm", de: "Arm", ru: "рука", e: "💪" }],
    extra: [
      { typ: "satz", de: "Bau den Satz: „Berühre deine Nase.“", ru: "Составь предложение: «Дотронься до своего носа».", woerter: ["Touch", "your", "nose."], e: "👃" },
      { typ: "wahl", frage: "Womit hörst du?", ru: "Чем ты слышишь?", optionen: ["ear", "foot", "mouth"], e: "🎵" }],
    ende: { de: "Super! Spiel mit deiner Familie „Touch your …“ – wer zeigt am schnellsten?", ru: "Супер! Поиграй с семьёй в «Touch your …» — кто покажет быстрее?" }
  },
  {
    id: "en-food", stufe: 3, lz: ["en.ws.01", "en.sp.02"], name: "Food – Essen", e: "🍎", farbe: "#D2502A", grund: "#FDECE4",
    intro: { de: "Was isst du gern? Heute lernst du Essen auf Englisch – und den Satz „I like …“.", ru: "Что ты любишь есть? Сегодня — еда по-английски и фраза «I like …»." },
    woerter: [
      { en: "apple", de: "Apfel", ru: "яблоко", e: "🍎" }, { en: "banana", de: "Banane", ru: "банан", e: "🍌" }, { en: "bread", de: "Brot", ru: "хлеб", e: "🍞" },
      { en: "milk", de: "Milch", ru: "молоко", e: "🥛" }, { en: "egg", de: "Ei", ru: "яйцо", e: "🥚" }, { en: "cheese", de: "Käse", ru: "сыр", e: "🧀" },
      { en: "water", de: "Wasser", ru: "вода", e: "💧" }, { en: "cake", de: "Kuchen", ru: "торт", e: "🍰" }],
    extra: [
      { typ: "satz", de: "Bau den Satz: „Ich mag Bananen.“", ru: "Составь предложение: «Я люблю бананы».", woerter: ["I", "like", "bananas."], e: "🍌" },
      { typ: "wahl", frage: "Was trinkst du, wenn du Durst hast?", ru: "Что ты пьёшь, когда хочешь пить?", optionen: ["water", "bread", "cheese"], e: "🥤" }],
    ende: { de: "Lecker! Sag beim Essen heute einmal „I like …“.", ru: "Вкусно! Скажи сегодня за едой «I like …»." }
  },
  {
    id: "en-home", stufe: 3, lz: ["en.ws.01", "en.sp.02"], name: "At home – Zuhause", e: "🏠", farbe: "#C2337A", grund: "#FDEAF3",
    intro: { de: "Komm mit in Paulas Haus! Heute lernst du Zimmer und Sachen im Haus – und wo etwas ist: in, on, under.", ru: "Пойдём в дом Паулы! Сегодня — комнаты и вещи в доме, и где что находится: in, on, under." },
    woerter: [
      { en: "house", de: "Haus", ru: "дом", e: "🏠" }, { en: "kitchen", de: "Küche", ru: "кухня", e: "🍳" }, { en: "bathroom", de: "Badezimmer", ru: "ванная", e: "🛁" },
      { en: "bedroom", de: "Schlafzimmer", ru: "спальня", e: "🛏️" }, { en: "living room", de: "Wohnzimmer", ru: "гостиная", e: "🛋️" }, { en: "garden", de: "Garten", ru: "сад", e: "🌷" },
      { en: "door", de: "Tür", ru: "дверь", e: "🚪" }, { en: "window", de: "Fenster", ru: "окно", e: "🪟" }],
    extra: [
      { typ: "satz", de: "Bau den Satz: „Die Katze ist in der Küche.“", ru: "Составь предложение: «Кошка на кухне».", woerter: ["The", "cat", "is", "in", "the", "kitchen."], e: "🐱" },
      { typ: "wahl", frage: "Die Katze liegt unter dem Tisch: „The cat is ___ the table.“", ru: "Кошка лежит под столом: «The cat is ___ the table.»", optionen: ["under", "on", "in"], e: "🐈", warum: "„under“ heißt „unter“, „on“ heißt „auf“, „in“ heißt „in“." },
      { typ: "wahl", frage: "Wo schläfst du?", ru: "Где ты спишь?", optionen: ["in the bedroom", "in the kitchen", "in the garden"], e: "😴" }],
    ende: { de: "Super! Geh heute durch deine Wohnung und sag die Zimmer auf Englisch.", ru: "Супер! Пройдись сегодня по квартире и назови комнаты по-английски." }
  },
  {
    id: "en-year", stufe: 3, lz: ["en.ik.01", "en.ws.02"], name: "Around the year – Das Jahr", e: "🎃", farbe: "#E8A33D", grund: "#FFF1D9",
    intro: { de: "Durch das Jahr! Jahreszeiten und Feste auf Englisch. In England feiert man Halloween, Christmas und Easter – und natürlich Geburtstag.", ru: "Круглый год! Времена года и праздники по-английски. В Англии празднуют Halloween, Christmas и Easter — и, конечно, день рождения." },
    woerter: [
      { en: "spring", de: "Frühling", ru: "весна", e: "🌱" }, { en: "summer", de: "Sommer", ru: "лето", e: "🏖️" }, { en: "autumn", de: "Herbst", ru: "осень", e: "🍂" },
      { en: "winter", de: "Winter", ru: "зима", e: "⛄" }, { en: "birthday", de: "Geburtstag", ru: "день рождения", e: "🎂" }, { en: "Christmas", de: "Weihnachten", ru: "Рождество", e: "🎄" },
      { en: "Easter", de: "Ostern", ru: "Пасха", e: "🐣" }, { en: "Halloween", de: "Halloween", ru: "Хэллоуин", e: "🎃" }],
    extra: [
      { typ: "satz", de: "Sing mit: „Happy birthday to you!“", ru: "Спой вместе: «Happy birthday to you!»", woerter: ["Happy", "birthday", "to", "you!"], e: "🎂" },
      { typ: "wahl", frage: "Welcher Monat kommt nach January?", ru: "Какой месяц идёт после January?", optionen: ["February", "December", "June"], e: "📅", warum: "Die Monate: January, February, March, April, May, June, July, August, September, October, November, December." },
      { typ: "wahl", frage: "In welchem Monat ist Christmas?", ru: "В каком месяце Рождество?", optionen: ["December", "July", "March"], e: "🎄" },
      { typ: "wahl", frage: "Was sagst du am Geburtstag?", ru: "Что говорят в день рождения?", optionen: ["Happy birthday!", "Good night!", "Thank you, goodbye!"], e: "🎁" }],
    ende: { de: "Klasse! Welches Fest kommt als Nächstes? Sag es auf Englisch!", ru: "Класс! Какой праздник будет следующим? Скажи по-английски!" }
  },
  {
    id: "en-family", stufe: 4, lz: ["en.ws.02", "en.sp.02"], name: "Family – Familie", e: "👨‍👩‍👧", farbe: "#2F86C8", grund: "#E5F1FB",
    intro: { de: "Heute geht es um die Familie. Mit „This is my …“ kannst du jemanden vorstellen.", ru: "Сегодня — семья. С фразой «This is my …» можно кого-то представить." },
    woerter: [
      { en: "mother", de: "Mutter", ru: "мама", e: "👩" }, { en: "father", de: "Vater", ru: "папа", e: "👨" }, { en: "sister", de: "Schwester", ru: "сестра", e: "👧" },
      { en: "brother", de: "Bruder", ru: "брат", e: "👦" }, { en: "baby", de: "Baby", ru: "малыш", e: "👶" }, { en: "grandma", de: "Oma", ru: "бабушка", e: "👵" },
      { en: "grandpa", de: "Opa", ru: "дедушка", e: "👴" }, { en: "friend", de: "Freund/Freundin", ru: "друг/подруга", e: "🧑‍🤝‍🧑" }],
    extra: [
      { typ: "satz", de: "Bau den Satz: „Das ist meine Schwester.“", ru: "Составь предложение: «Это моя сестра».", woerter: ["This", "is", "my", "sister."], e: "👧" },
      { typ: "wahl", frage: "Die Mutter deiner Mutter ist deine …", ru: "Мама твоей мамы — это твоя …", optionen: ["grandma", "sister", "baby"], e: "👵" }],
    ende: { de: "Schön! Stell jemanden aus deiner Familie auf Englisch vor: „This is my …“.", ru: "Хорошо! Представь кого-нибудь из семьи по-английски: «This is my …»." }
  },
  {
    id: "en-school", stufe: 4, lz: ["en.ws.02", "en.le.01"], name: "School – Schulsachen", e: "🎒", farbe: "#E8A33D", grund: "#FFF1D9",
    intro: { de: "Was ist in deinem Ranzen? Lies die englischen Wörter und finde das Bild.", ru: "Что у тебя в рюкзаке? Читай английские слова и находи картинку." },
    woerter: [
      { en: "book", de: "Buch", ru: "книга", e: "📕" }, { en: "pen", de: "Füller/Kuli", ru: "ручка", e: "🖊️" }, { en: "pencil", de: "Bleistift", ru: "карандаш", e: "✏️" },
      { en: "ruler", de: "Lineal", ru: "линейка", e: "📏" }, { en: "scissors", de: "Schere", ru: "ножницы", e: "✂️" }, { en: "schoolbag", de: "Schultasche", ru: "рюкзак", e: "🎒" },
      { en: "chair", de: "Stuhl", ru: "стул", e: "🪑" }, { en: "teacher", de: "Lehrerin/Lehrer", ru: "учитель", e: "🧑‍🏫" }],
    extra: [
      { typ: "satz", de: "Bau den Satz: „Ich habe einen roten Stift.“", ru: "Составь предложение: «У меня есть красная ручка».", woerter: ["I", "have", "a", "red", "pen."], e: "🖊️" },
      { typ: "wahl", frage: "Womit misst du eine Linie?", ru: "Чем измеряют линию?", optionen: ["ruler", "scissors", "chair"], e: "📐" }],
    ende: { de: "Klasse! Zeig morgen beim Packen auf deine Sachen und sag die englischen Wörter.", ru: "Класс! Завтра, собирая рюкзак, показывай на вещи и называй их по-английски." }
  },
  {
    id: "en-clothes", stufe: 4, lz: ["en.ws.02", "en.le.01"], name: "Clothes – Kleidung", e: "👕", farbe: "#3AA0E0", grund: "#E1F3FF",
    intro: { de: "Was ziehst du heute an? Kleidung auf Englisch – mit Farben kannst du sie beschreiben.", ru: "Что ты сегодня надеваешь? Одежда по-английски — с цветами её можно описать." },
    woerter: [
      { en: "T-shirt", de: "T-Shirt", ru: "футболка", e: "👕" }, { en: "trousers", de: "Hose", ru: "брюки", e: "👖" }, { en: "dress", de: "Kleid", ru: "платье", e: "👗" },
      { en: "shoes", de: "Schuhe", ru: "обувь", e: "👟" }, { en: "cap", de: "Kappe", ru: "кепка", e: "🧢" }, { en: "socks", de: "Socken", ru: "носки", e: "🧦" },
      { en: "jacket", de: "Jacke", ru: "куртка", e: "🧥" }, { en: "scarf", de: "Schal", ru: "шарф", e: "🧣" }],
    extra: [
      { typ: "satz", de: "Bau den Satz: „Meine Socken sind grün.“", ru: "Составь предложение: «Мои носки зелёные».", woerter: ["My", "socks", "are", "green."], e: "🧦" },
      { typ: "wahl", frage: "Was trägst du im Winter um den Hals?", ru: "Что носят зимой на шее?", optionen: ["scarf", "shoes", "T-shirt"], e: "❄️" }],
    ende: { de: "Toll! Beschreib morgen früh deine Kleidung auf Englisch: „My T-shirt is …“.", ru: "Здорово! Завтра утром опиши свою одежду по-английски: «My T-shirt is …»." }
  },
  {
    id: "en-weather", stufe: 4, lz: ["en.ws.02", "en.sp.02"], name: "Weather – Wetter", e: "🌦️", farbe: "#1F8FB8", grund: "#E2F4FB",
    intro: { de: "Wie ist das Wetter? Auf Englisch sagt man: „It is sunny.“ – „Es ist sonnig.“", ru: "Какая погода? По-английски говорят: «It is sunny.» — «Солнечно»." },
    woerter: [
      { en: "sunny", de: "sonnig", ru: "солнечно", e: "☀️" }, { en: "rainy", de: "regnerisch", ru: "дождливо", e: "🌧️" }, { en: "cloudy", de: "bewölkt", ru: "облачно", e: "☁️" },
      { en: "windy", de: "windig", ru: "ветрено", e: "💨" }, { en: "snowy", de: "verschneit", ru: "снежно", e: "❄️" }, { en: "hot", de: "heiß", ru: "жарко", e: "🥵" },
      { en: "cold", de: "kalt", ru: "холодно", e: "🥶" }, { en: "rainbow", de: "Regenbogen", ru: "радуга", e: "🌈" }],
    extra: [
      { typ: "satz", de: "Bau den Satz: „Heute ist es sonnig.“", ru: "Составь предложение: «Сегодня солнечно».", woerter: ["It", "is", "sunny", "today."], e: "☀️" },
      { typ: "wahl", frage: "Es regnet und du nimmst einen Schirm. Wie ist das Wetter?", ru: "Идёт дождь, и ты берёшь зонтик. Какая погода?", optionen: ["rainy", "sunny", "hot"], e: "☂️" },
      { typ: "wahl", frage: "Draußen ist es neblig: Man sieht kaum etwas. Wie sagt man das?", ru: "На улице туман: почти ничего не видно. Как это сказать?", optionen: ["It's foggy.", "It's sunny.", "It's hot."], e: "🌫️" },
      { typ: "wahl", frage: "„It's cold and snowy.“ Was ziehst du an?", ru: "«It's cold and snowy.» Что ты наденешь?", optionen: ["a warm jacket and a scarf", "a T-shirt and shorts", "a swimsuit"], e: "🧣", warum: "Bei Kälte und Schnee: warme Jacke, Mütze und Schal." }],
    ende: { de: "Prima! Schau morgen aus dem Fenster und sag: „It is …“.", ru: "Отлично! Завтра посмотри в окно и скажи: «It is …»." }
  },
  {
    id: "en-hobbies", stufe: 5, lz: ["en.sp.03", "en.ws.02"], name: "Hobbies – Über mich", e: "⚽", farbe: "#2E9C5A", grund: "#E3F7EF",
    intro: { de: "In Klasse 5 erzählst du auf Englisch über dich: Alter, Herkunft und Hobbys. Los geht's!", ru: "В 5-м классе ты рассказываешь о себе по-английски: возраст, откуда ты и хобби. Поехали!" },
    woerter: [
      { en: "football", de: "Fußball", ru: "футбол", e: "⚽" }, { en: "swimming", de: "Schwimmen", ru: "плавание", e: "🏊" }, { en: "reading", de: "Lesen", ru: "чтение", e: "📖" },
      { en: "music", de: "Musik", ru: "музыка", e: "🎵" }, { en: "painting", de: "Malen", ru: "рисование", e: "🎨" }, { en: "dancing", de: "Tanzen", ru: "танцы", e: "💃" },
      { en: "cycling", de: "Radfahren", ru: "езда на велосипеде", e: "🚴" }, { en: "games", de: "Spiele", ru: "игры", e: "🎲" }],
    extra: [
      { typ: "satz", de: "Bau den Satz: „Ich schwimme gern.“", ru: "Составь предложение: «Я люблю плавать».", woerter: ["I", "like", "swimming."], e: "🏊" },
      { typ: "wahl", frage: "Jemand fragt: „How old are you?“ Was antwortest du?", ru: "Тебя спрашивают: «How old are you?» Что ответишь?", optionen: ["I am ten.", "I am from Germany.", "I like music."], e: "🎂", warum: "„How old are you?“ fragt nach dem Alter: „Wie alt bist du?“" },
      { typ: "wahl", frage: "Jemand fragt: „Where are you from?“ Was passt?", ru: "Тебя спрашивают: «Where are you from?» Что подходит?", optionen: ["I am from Germany.", "I am ten.", "My name is Mia."], e: "🌍", warum: "„Where are you from?“ heißt „Woher kommst du?“" }],
    ende: { de: "Super, {name}! Jetzt kannst du dich auf Englisch vorstellen: Name, Alter, Hobbys.", ru: "Супер, {name}! Теперь ты можешь представиться по-английски: имя, возраст, хобби." }
  }
];
// ---------- Schuljahr Englisch (Lehrplan Sachsen 2019, Kl. 3 und 4): eine Lektion je Lücke aus der Bestandsaufnahme (28.10.2026) ----------
window.ENGLISCH.push(
  {
    id: "en-feelings", stufe: 3, lz: ["en.sp.01", "en.hv.01"], name: "How are you? – Gefühle", e: "😊", farbe: "#E8A33D", grund: "#FFF1D9",
    intro: { de: "„How are you?“ heißt „Wie geht es dir?“. Heute lernst du, wie du auf Englisch sagst, wie du dich fühlst.", ru: "«How are you?» значит «Как дела?». Сегодня учимся говорить по-английски, как ты себя чувствуешь." },
    woerter: [
      { en: "happy", de: "fröhlich", ru: "радостный", e: "😄" }, { en: "sad", de: "traurig", ru: "грустный", e: "😢" },
      { en: "tired", de: "müde", ru: "усталый", e: "🥱" }, { en: "hungry", de: "hungrig", ru: "голодный", e: "🍽️" },
      { en: "thirsty", de: "durstig", ru: "хочется пить", e: "🥤" }, { en: "angry", de: "wütend", ru: "сердитый", e: "😠" },
      { en: "scared", de: "ängstlich", ru: "испуганный", e: "😨" }, { en: "fine", de: "gut", ru: "хорошо", e: "👌" }],
    extra: [
      { typ: "satz", de: "Sag: „Ich bin hungrig.“", ru: "Скажи: «Я голоден».", woerter: ["I'm", "hungry."], e: "🍽️" },
      { typ: "wahl", frage: "Jemand sagt „Nice to meet you.“ Was antwortest du?", ru: "Тебе говорят «Nice to meet you.» Что ответишь?", optionen: ["Nice to meet you, too.", "Goodbye, I'm tired.", "I'm a dog."], e: "🤝", warum: "„Nice to meet you“ heißt „Schön, dich kennenzulernen“ – die Antwort: „Nice to meet you, too.“" },
      { typ: "wahl", frage: "Du hast heute Geburtstag. Wie fühlst du dich?", ru: "У тебя сегодня день рождения. Как ты себя чувствуешь?", optionen: ["I'm happy.", "I'm sad.", "I'm angry."], e: "🎂" }],
    ende: { de: "Super! Frag heute jemanden „How are you?“ – und warte auf die Antwort.", ru: "Супер! Спроси сегодня кого-нибудь «How are you?» — и дождись ответа." }
  },
  {
    id: "en-numbers2", stufe: 3, lz: ["en.ws.01", "en.hv.01"], name: "Numbers – bis 100", e: "💯", farbe: "#2FA37C", grund: "#E3F7EF",
    intro: { de: "Nach ten kommen eleven und twelve. Ab dreizehn hängt man „-teen“ an: thirteen, fourteen … Die Zehner enden auf „-ty“: twenty, thirty …", ru: "После ten идут eleven и twelve. С тринадцати добавляют «-teen»: thirteen, fourteen… Десятки заканчиваются на «-ty»: twenty, thirty…" },
    woerter: [
      { en: "eleven", de: "elf", ru: "одиннадцать", e: "1️⃣1️⃣" }, { en: "twelve", de: "zwölf", ru: "двенадцать", e: "🕛" },
      { en: "thirteen", de: "dreizehn", ru: "тринадцать", e: "1️⃣3️⃣" }, { en: "fifteen", de: "fünfzehn", ru: "пятнадцать", e: "1️⃣5️⃣" },
      { en: "twenty", de: "zwanzig", ru: "двадцать", e: "2️⃣0️⃣" }, { en: "thirty", de: "dreißig", ru: "тридцать", e: "3️⃣0️⃣" },
      { en: "fifty", de: "fünfzig", ru: "пятьдесят", e: "5️⃣0️⃣" }, { en: "one hundred", de: "hundert", ru: "сто", e: "💯" }],
    extra: [
      { typ: "wahl", frage: "Wie heißt 25 auf Englisch?", ru: "Как по-английски 25?", optionen: ["twenty-five", "fifty-two", "fifteen"], e: "2️⃣5️⃣", warum: "Erst die Zehner, dann die Einer: twenty-five." },
      { typ: "wahl", frage: "Achtung, das klingt ähnlich! Welche Zahl ist „thirteen“?", ru: "Внимание, похоже звучит! Какое число «thirteen»?", optionen: ["13", "30", "3"], e: "👂", warum: "„-teen“ = 13 bis 19, „-ty“ = 20, 30, 40 …" },
      { typ: "satz", de: "Sag: „Ich bin neun Jahre alt.“", ru: "Скажи: «Мне девять лет».", woerter: ["I'm", "nine", "years", "old."], e: "🎈" }],
    ende: { de: "Klasse! Zähl beim Treppensteigen auf Englisch – bis twenty schaffst du es bestimmt.", ru: "Класс! Считай ступеньки по-английски — до twenty точно получится." }
  },
  {
    id: "en-shopping", stufe: 3, lz: ["en.sp.02", "en.ws.01"], name: "Let's go shopping – Einkaufen", e: "🛍️", farbe: "#C2337A", grund: "#FDEAF3",
    intro: { de: "In England bezahlt man mit Pfund und Pence. Im Laden fragst du: „How much is it?“ – Wie viel kostet das?", ru: "В Англии платят фунтами и пенсами. В магазине спрашивают: «How much is it?» — Сколько это стоит?" },
    woerter: [
      { en: "shop", de: "Laden", ru: "магазин", e: "🏪" }, { en: "money", de: "Geld", ru: "деньги", e: "💰" },
      { en: "pound", de: "Pfund", ru: "фунт", e: "💷" }, { en: "penny", de: "Penny", ru: "пенни", e: "🪙" },
      { en: "toy", de: "Spielzeug", ru: "игрушка", e: "🧸" }, { en: "ball", de: "Ball", ru: "мяч", e: "⚽" },
      { en: "doll", de: "Puppe", ru: "кукла", e: "🪆" }, { en: "kite", de: "Drachen", ru: "воздушный змей", e: "🪁" }],
    extra: [
      { typ: "satz", de: "Frag: „Wie viel kostet das?“", ru: "Спроси: «Сколько это стоит?»", woerter: ["How", "much", "is", "it?"], e: "🏷️" },
      { typ: "satz", de: "Sag höflich: „Ich hätte gern den Ball, bitte.“", ru: "Скажи вежливо: «Я бы хотел мяч, пожалуйста».", woerter: ["I'd", "like", "the", "ball,", "please."], e: "⚽" },
      { typ: "wahl", frage: "Du hast nicht genug Geld. Was sagst du?", ru: "У тебя не хватает денег. Что скажешь?", optionen: ["Sorry, I haven't got the money.", "Here you are.", "Happy birthday!"], e: "😕" },
      { typ: "wahl", frage: "Die Verkäuferin gibt dir den Drachen: „Here you are.“ Was sagst du?", ru: "Продавщица даёт тебе змея: «Here you are.» Что скажешь?", optionen: ["Thank you!", "Goodbye, sad!", "How old are you?"], e: "🪁" }],
    ende: { de: "Super! Spiel mit deiner Familie Kaufladen – auf Englisch.", ru: "Супер! Поиграй с семьёй в магазин — по-английски." }
  },
  {
    id: "en-subjects", stufe: 3, lz: ["en.ws.02", "en.hv.01"], name: "At school – Fächer, Tage, Uhrzeit", e: "🏫", farbe: "#3AA0E0", grund: "#E1F3FF",
    intro: { de: "Welche Fächer hast du heute? Auf Englisch heißt Mathe „maths“, Kunst „art“ und Sport „PE“. Und die Wochentage beginnen mit Monday.", ru: "Какие у тебя сегодня предметы? По-английски математика — «maths», рисование — «art», физкультура — «PE». А дни недели начинаются с Monday." },
    woerter: [
      { en: "maths", de: "Mathe", ru: "математика", e: "➗" }, { en: "English", de: "Englisch", ru: "английский", e: "🇬🇧" },
      { en: "German", de: "Deutsch", ru: "немецкий", e: "🇩🇪" }, { en: "art", de: "Kunst", ru: "рисование", e: "🎨" },
      { en: "music", de: "Musik", ru: "музыка", e: "🎵" }, { en: "PE", de: "Sport", ru: "физкультура", e: "🤸" },
      { en: "science", de: "Sachunterricht", ru: "окружающий мир", e: "🔬" }, { en: "break", de: "Pause", ru: "перемена", e: "🍎" }],
    extra: [
      { typ: "wahl", frage: "Welcher Tag kommt nach Monday?", ru: "Какой день идёт после Monday?", optionen: ["Tuesday", "Thursday", "Sunday"], e: "📅", warum: "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday. Achtung: Tuesday und Thursday klingen ähnlich!" },
      { typ: "wahl", frage: "Die Uhr zeigt 9 Uhr. Was sagst du?", ru: "Часы показывают 9 часов. Что скажешь?", optionen: ["It's nine o'clock.", "It's nine years old.", "It's Monday."], e: "🕘" },
      { typ: "satz", de: "Sag: „Mein Lieblingsfach ist Kunst.“", ru: "Скажи: «Мой любимый предмет — рисование».", woerter: ["My", "favourite", "subject", "is", "art."], e: "🎨" },
      { typ: "wahl", frage: "Die Uhr zeigt halb zehn (9:30). Was sagst du?", ru: "Часы показывают половину десятого (9:30). Что скажешь?", optionen: ["It's nine thirty.", "It's thirty nine.", "It's nine o'clock."], e: "🕤", warum: "Erst die Stunde, dann die Minuten: nine thirty = 9:30, nine twenty = 9:20." },
      { typ: "wahl", frage: "Du kommst zu spät in den Unterricht. Was sagst du?", ru: "Ты опоздал на урок. Что скажешь?", optionen: ["Sorry, I'm late.", "Good night!", "I'm nine."], e: "🏃" },
      { typ: "wahl", frage: "In vielen englischen Schulen tragen Kinder …", ru: "Во многих английских школах дети носят …", optionen: ["a school uniform", "a crown", "pyjamas"], e: "👔", warum: "Eine Schuluniform – alle tragen die gleiche Kleidung in den Farben der Schule." }],
    ende: { de: "Toll! Sag morgen früh deinen Stundenplan auf Englisch auf.", ru: "Отлично! Завтра утром расскажи своё расписание по-английски." }
  },
  {
    id: "en-trip", stufe: 3, lz: ["en.ws.02", "en.sp.02"], name: "Let's go on a trip – Ausflug", e: "🚆", farbe: "#2F6FB8", grund: "#E5EFFB",
    intro: { de: "Wir machen einen Ausflug! Mit dem Bus, dem Zug oder dem Flugzeug – ans Meer oder in die Berge.", ru: "Мы едем на экскурсию! На автобусе, поезде или самолёте — к морю или в горы." },
    woerter: [
      { en: "bus", de: "Bus", ru: "автобус", e: "🚌" }, { en: "train", de: "Zug", ru: "поезд", e: "🚆" },
      { en: "plane", de: "Flugzeug", ru: "самолёт", e: "✈️" }, { en: "car", de: "Auto", ru: "машина", e: "🚗" },
      { en: "bike", de: "Fahrrad", ru: "велосипед", e: "🚲" }, { en: "ship", de: "Schiff", ru: "корабль", e: "🚢" },
      { en: "beach", de: "Strand", ru: "пляж", e: "🏖️" }, { en: "mountain", de: "Berg", ru: "гора", e: "⛰️" }],
    extra: [
      { typ: "satz", de: "Sag: „Ich mag Züge.“", ru: "Скажи: «Я люблю поезда».", woerter: ["I", "like", "trains."], e: "🚆" },
      { typ: "satz", de: "Kauf eine Fahrkarte: „Eine Fahrkarte nach London, bitte.“", ru: "Купи билет: «Билет до Лондона, пожалуйста».", woerter: ["A", "ticket", "to", "London,", "please."], e: "🎫" },
      { typ: "wahl", frage: "Du suchst den Flughafen. Was fragst du?", ru: "Ты ищешь аэропорт. Что спросишь?", optionen: ["Where is the airport?", "How old is the airport?", "I like the airport."], e: "🛫" }],
    ende: { de: "Gute Reise! Mit welchem Verkehrsmittel fährst du am liebsten? Sag es auf Englisch.", ru: "Счастливого пути! На чём ты больше всего любишь ездить? Скажи по-английски." }
  },
  {
    id: "en-party", stufe: 3, lz: ["en.ik.01", "en.sp.02"], name: "Party time – Glückwünsche", e: "🎉", farbe: "#E0574A", grund: "#FFECE8",
    intro: { de: "Feste feiern auf Englisch! Zu jedem Fest gibt es einen Glückwunsch: Happy Birthday, Merry Christmas, Happy Easter …", ru: "Празднуем по-английски! К каждому празднику есть поздравление: Happy Birthday, Merry Christmas, Happy Easter…" },
    woerter: [
      { en: "party", de: "Party", ru: "вечеринка", e: "🥳" }, { en: "present", de: "Geschenk", ru: "подарок", e: "🎁" },
      { en: "card", de: "Karte", ru: "открытка", e: "💌" }, { en: "candle", de: "Kerze", ru: "свеча", e: "🕯️" },
      { en: "balloon", de: "Luftballon", ru: "воздушный шарик", e: "🎈" }, { en: "song", de: "Lied", ru: "песня", e: "🎶" },
      { en: "egg", de: "Ei", ru: "яйцо", e: "🥚" }, { en: "pumpkin", de: "Kürbis", ru: "тыква", e: "🎃" }],
    extra: [
      { typ: "wahl", frage: "Was wünschst du an Weihnachten?", ru: "Что желают на Рождество?", optionen: ["Merry Christmas!", "Happy Easter!", "Good night!"], e: "🎄" },
      { typ: "wahl", frage: "Was wünschst du an Silvester um Mitternacht?", ru: "Что желают в Новый год в полночь?", optionen: ["Happy New Year!", "Happy Birthday!", "See you later!"], e: "🎆" },
      { typ: "satz", de: "Frag: „Wann hast du Geburtstag?“", ru: "Спроси: «Когда у тебя день рождения?»", woerter: ["When", "is", "your", "birthday?"], e: "📅" },
      { typ: "satz", de: "Antworte: „Mein Geburtstag ist im Mai.“", ru: "Ответь: «Мой день рождения в мае».", woerter: ["My", "birthday", "is", "in", "May."], e: "🌷" }],
    ende: { de: "Toll! Schreib eine Karte mit „Happy Birthday“ für das nächste Geburtstagskind in deiner Familie.", ru: "Отлично! Напиши открытку «Happy Birthday» для следующего именинника в семье." }
  },
  {
    id: "en-everywhere", stufe: 3, lz: ["en.ik.01", "en.ws.01"], name: "English everywhere – Englisch im Alltag", e: "🌐", farbe: "#7B55B8", grund: "#EFE6FF",
    intro: { de: "Du kennst schon viele englische Wörter! Sie stecken in Spielen, Essen, Kleidung und am Computer. Englisch ist eine Sprache, die auf der ganzen Welt gesprochen wird.", ru: "Ты уже знаешь много английских слов! Они есть в играх, еде, одежде и на компьютере. На английском говорят во всём мире." },
    woerter: [
      { en: "computer", de: "Computer", ru: "компьютер", e: "💻" }, { en: "smartphone", de: "Smartphone", ru: "смартфон", e: "📱" },
      { en: "sandwich", de: "Sandwich", ru: "сэндвич", e: "🥪" }, { en: "popcorn", de: "Popcorn", ru: "попкорн", e: "🍿" },
      { en: "skateboard", de: "Skateboard", ru: "скейтборд", e: "🛹" }, { en: "jeans", de: "Jeans", ru: "джинсы", e: "👖" },
      { en: "hamburger", de: "Hamburger", ru: "гамбургер", e: "🍔" }, { en: "cornflakes", de: "Cornflakes", ru: "кукурузные хлопья", e: "🥣" }],
    extra: [
      { typ: "wahl", frage: "Welches Wort siehst du oft am Computer oder Tablet?", ru: "Какое слово часто видишь на компьютере или планшете?", optionen: ["download", "Kartoffel", "Schulranzen"], e: "🖥️", warum: "Viele Wörter aus der Computerwelt kommen aus dem Englischen: download, online, start, stop." },
      { typ: "wahl", frage: "In welchem Land spricht man KEIN Englisch als Hauptsprache?", ru: "В какой стране английский НЕ основной язык?", optionen: ["France", "England", "Australia"], e: "🗺️", warum: "In England, Irland, den USA, Kanada, Australien und Neuseeland spricht man Englisch. In Frankreich (France) spricht man Französisch." }],
    ende: { de: "Klasse! Such zu Hause drei Dinge mit englischen Wörtern darauf – auf Verpackungen, Spielen oder Kleidung.", ru: "Класс! Найди дома три вещи с английскими словами — на упаковках, играх или одежде." }
  },
  // ---------- Klasse 4 ----------
  {
    id: "en-furniture", stufe: 4, lz: ["en.ws.01", "en.sp.02"], name: "At home – Möbel", e: "🛋️", farbe: "#8A6E2F", grund: "#F7F0DD",
    intro: { de: "In jedem Zimmer stehen Möbel. Heute lernst du sie auf Englisch – und sagst, wo etwas ist: in the kitchen, next to the bed …", ru: "В каждой комнате стоит мебель. Сегодня учим её по-английски — и говорим, где что находится: in the kitchen, next to the bed…" },
    woerter: [
      { en: "bed", de: "Bett", ru: "кровать", e: "🛏️" }, { en: "sofa", de: "Sofa", ru: "диван", e: "🛋️" },
      { en: "lamp", de: "Lampe", ru: "лампа", e: "💡" }, { en: "cupboard", de: "Schrank", ru: "шкаф", e: "🗄️" },
      { en: "bath", de: "Badewanne", ru: "ванна", e: "🛁" }, { en: "mirror", de: "Spiegel", ru: "зеркало", e: "🪞" },
      { en: "clock", de: "Uhr", ru: "часы", e: "⏰" }, { en: "shower", de: "Dusche", ru: "душ", e: "🚿" }],
    extra: [
      { typ: "satz", de: "Sag: „Das Bett ist im Schlafzimmer.“", ru: "Скажи: «Кровать в спальне».", woerter: ["The", "bed", "is", "in", "the", "bedroom."], e: "🛏️" },
      { typ: "wahl", frage: "„Where is your sister?“ – Sie ist im Garten.", ru: "«Where is your sister?» — Она в саду.", optionen: ["She's in the garden.", "He's in the garden.", "It's a garden."], e: "🌷" },
      { typ: "wahl", frage: "Viele alte englische Häuser haben einen Kamin im Wohnzimmer – und oft eine bunte Haustür. Wie heißt der Kamin?", ru: "Во многих старых английских домах в гостиной есть камин — и часто яркая входная дверь. Как называется камин?", optionen: ["fireplace", "bathroom", "garden"], e: "🔥" },
      { typ: "wahl", frage: "Wie heißt „neben“ auf Englisch?", ru: "Как по-английски «рядом с»?", optionen: ["next to", "under", "on"], e: "↔️", warum: "„The lamp is next to the sofa.“ – Die Lampe steht neben dem Sofa." }],
    ende: { de: "Super! Mach eine Führung durch eure Wohnung: „This is the kitchen …“", ru: "Супер! Проведи экскурсию по квартире: «This is the kitchen…»" }
  },
  {
    id: "en-zoo", stufe: 4, lz: ["en.ws.01", "en.hv.01"], name: "At the zoo – Wilde Tiere", e: "🦁", farbe: "#E8A33D", grund: "#FFF1D9",
    intro: { de: "Im Zoo leben Tiere aus der ganzen Welt. Manche sind in der freien Natur vom Aussterben bedroht – Zoos helfen, sie zu schützen.", ru: "В зоопарке живут животные со всего мира. Некоторым в дикой природе грозит исчезновение — зоопарки помогают их сохранить." },
    woerter: [
      { en: "lion", de: "Löwe", ru: "лев", e: "🦁" }, { en: "elephant", de: "Elefant", ru: "слон", e: "🐘" },
      { en: "monkey", de: "Affe", ru: "обезьяна", e: "🐒" }, { en: "giraffe", de: "Giraffe", ru: "жираф", e: "🦒" },
      { en: "tiger", de: "Tiger", ru: "тигр", e: "🐯" }, { en: "zebra", de: "Zebra", ru: "зебра", e: "🦓" },
      { en: "penguin", de: "Pinguin", ru: "пингвин", e: "🐧" }, { en: "crocodile", de: "Krokodil", ru: "крокодил", e: "🐊" }],
    extra: [
      { typ: "wahl", frage: "„It's big and grey. It has got a long nose.“ Welches Tier ist das?", ru: "«Оно большое и серое. У него длинный нос.» Что это за животное?", optionen: ["elephant", "penguin", "zebra"], e: "❓" },
      { typ: "wahl", frage: "„It's black and white. It can swim, but it can't fly.“", ru: "«Оно чёрно-белое. Умеет плавать, но не летает.»", optionen: ["penguin", "lion", "giraffe"], e: "❓" },
      { typ: "satz", de: "Sag: „Mein Lieblingstier ist der Tiger.“", ru: "Скажи: «Моё любимое животное — тигр».", woerter: ["My", "favourite", "animal", "is", "the", "tiger."], e: "🐯" }],
    ende: { de: "Toll! Mach einen Tier-Steckbrief auf Englisch: „It's … It has got … It can …“", ru: "Отлично! Сделай анкету животного по-английски: «It's… It has got… It can…»" }
  },
  {
    id: "en-london", stufe: 4, lz: ["en.ik.01", "en.ws.02"], name: "London – die Hauptstadt", e: "🎡", farbe: "#C2337A", grund: "#FDEAF3",
    intro: { de: "London ist die Hauptstadt von England und Großbritannien. Durch die Stadt fließt die Themse, die roten Busse haben zwei Stockwerke, und der Glockenturm heißt Big Ben.", ru: "Лондон — столица Англии и Великобритании. Через город течёт Темза, красные автобусы двухэтажные, а часовая башня называется Биг-Бен." },
    woerter: [
      { en: "Big Ben", de: "Big Ben (Glockenturm)", ru: "Биг-Бен", e: "🕰️" }, { en: "bridge", de: "Brücke", ru: "мост", e: "🌉" },
      { en: "double-decker", de: "Doppeldeckerbus", ru: "двухэтажный автобус", e: "🚌" }, { en: "river", de: "Fluss", ru: "река", e: "🏞️" },
      { en: "palace", de: "Palast", ru: "дворец", e: "🏰" }, { en: "taxi", de: "Taxi", ru: "такси", e: "🚕" },
      { en: "underground", de: "U-Bahn", ru: "метро", e: "🚇" }, { en: "London Eye", de: "Riesenrad London Eye", ru: "колесо обозрения London Eye", e: "🎡" }],
    extra: [
      { typ: "wahl", frage: "Wie heißt der Fluss in London?", ru: "Как называется река в Лондоне?", optionen: ["the Thames", "the Elbe", "the Rhine"], e: "🏞️", warum: "Die Themse (the Thames). Die Elbe fließt durch Dresden." },
      { typ: "satz", de: "Sag: „Ich mag London. Ich mag den Fluss.“", ru: "Скажи: «Мне нравится Лондон. Мне нравится река».", woerter: ["I", "like", "London.", "I", "like", "the", "river."], e: "💂" },
      { typ: "wahl", frage: "Auf welcher Straßenseite fahren die Autos in England?", ru: "По какой стороне дороги ездят машины в Англии?", optionen: ["on the left", "on the right", "in the middle"], e: "🚗", warum: "In Großbritannien fährt man links – also beim Überqueren erst nach rechts schauen!" }],
    ende: { de: "Super! Wenn du einmal nach London fährst: „A ticket for the London Eye, please!“", ru: "Супер! Если поедешь в Лондон: «A ticket for the London Eye, please!»" }
  },
  {
    id: "en-cafe", stufe: 4, lz: ["en.sp.02", "en.ws.01"], name: "In the café – Bestellen", e: "☕", farbe: "#B5701A", grund: "#FFF1D9",
    intro: { de: "Im Café oder Snackbar bestellst du höflich: „I'd like …, please.“ Typisch englisch sind fish and chips, Pfannkuchen und Tee.", ru: "В кафе вежливо заказывают: «I'd like…, please.» Типично английские — fish and chips, блины и чай." },
    woerter: [
      { en: "menu", de: "Speisekarte", ru: "меню", e: "📋" }, { en: "pancake", de: "Pfannkuchen", ru: "блин", e: "🥞" },
      { en: "chips", de: "Pommes", ru: "картошка фри", e: "🍟" }, { en: "fish", de: "Fisch", ru: "рыба", e: "🐟" },
      { en: "salad", de: "Salat", ru: "салат", e: "🥗" }, { en: "juice", de: "Saft", ru: "сок", e: "🧃" },
      { en: "milkshake", de: "Milchshake", ru: "молочный коктейль", e: "🥤" }, { en: "tea", de: "Tee", ru: "чай", e: "🍵" }],
    extra: [
      { typ: "satz", de: "Bestell: „Ich hätte gern einen Milchshake, bitte.“", ru: "Закажи: «Я бы хотел молочный коктейль, пожалуйста».", woerter: ["I'd", "like", "a", "milkshake,", "please."], e: "🥤" },
      { typ: "wahl", frage: "Die Kellnerin fragt: „Would you like some tea?“ Du möchtest nicht.", ru: "Официантка спрашивает: «Would you like some tea?» Ты не хочешь.", optionen: ["No, thank you.", "Yes, I'm tea.", "Goodbye, tea."], e: "🍵" },
      { typ: "wahl", frage: "Welches Essen ist am gesündesten?", ru: "Какая еда самая полезная?", optionen: ["salad", "chips", "milkshake"], e: "🥗", warum: "Salat hat viele Vitamine. Pommes und Milchshakes sind lecker – aber lieber nicht jeden Tag." }],
    ende: { de: "Lecker! Spiel zu Hause Café: Einer bestellt auf Englisch, der andere bringt das Essen.", ru: "Вкусно! Поиграйте дома в кафе: один заказывает по-английски, другой приносит еду." }
  },
  {
    id: "en-dates", stufe: 4, lz: ["en.ik.01", "en.ws.02"], name: "Festivals and dates – Feste und Datum", e: "💝", farbe: "#E0574A", grund: "#FFECE8",
    intro: { de: "In Großbritannien und Amerika feiert man besondere Tage: Valentine's Day im Februar, Pancake Day vor der Fastenzeit, Thanksgiving in Amerika im November. Für das Datum braucht man Ordnungszahlen: first, second, third …", ru: "В Великобритании и Америке отмечают особые дни: День святого Валентина в феврале, Блинный день перед постом, День благодарения в Америке в ноябре. Для даты нужны порядковые числа: first, second, third…" },
    woerter: [
      { en: "first", de: "erste", ru: "первый", e: "🥇" }, { en: "second", de: "zweite", ru: "второй", e: "🥈" },
      { en: "third", de: "dritte", ru: "третий", e: "🥉" }, { en: "Valentine's Day", de: "Valentinstag", ru: "День святого Валентина", e: "💝" },
      { en: "Mother's Day", de: "Muttertag", ru: "День матери", e: "👩" }, { en: "Pancake Day", de: "Pfannkuchentag", ru: "Блинный день", e: "🥞" },
      { en: "Thanksgiving", de: "Erntedankfest (USA)", ru: "День благодарения", e: "🦃" }, { en: "St Patrick's Day", de: "St.-Patricks-Tag (Irland)", ru: "День святого Патрика", e: "☘️" }],
    extra: [
      { typ: "wahl", frage: "Weihnachten ist am 25. Dezember. Wie sagt man das?", ru: "Рождество 25 декабря. Как это сказать?", optionen: ["the twenty-fifth of December", "twenty-five December", "December is twenty"], e: "🎄" },
      { typ: "wahl", frage: "In welchem Monat ist Valentine's Day?", ru: "В каком месяце День святого Валентина?", optionen: ["February", "October", "July"], e: "💝" },
      { typ: "satz", de: "Sag: „Heute ist der erste Mai.“", ru: "Скажи: «Сегодня первое мая».", woerter: ["Today", "is", "the", "first", "of", "May."], e: "📅" }],
    ende: { de: "Toll! Welches englische Fest gefällt dir am besten? Mal eine Karte dazu!", ru: "Отлично! Какой английский праздник тебе нравится больше всего? Нарисуй к нему открытку!" }
  },
  {
    id: "en-sports", stufe: 4, lz: ["en.ws.02", "en.sp.03"], name: "Sports and games – Sport", e: "🏏", farbe: "#2E9C5A", grund: "#E3F7EF",
    intro: { de: "Fußball spielt man auf der ganzen Welt. In England ist auch Cricket beliebt, in Amerika American Football. Welchen Sport magst du?", ru: "В футбол играют во всём мире. В Англии популярен ещё крикет, в Америке — американский футбол. Какой спорт любишь ты?" },
    woerter: [
      { en: "cricket", de: "Cricket", ru: "крикет", e: "🏏" }, { en: "tennis", de: "Tennis", ru: "теннис", e: "🎾" },
      { en: "basketball", de: "Basketball", ru: "баскетбол", e: "🏀" }, { en: "volleyball", de: "Volleyball", ru: "волейбол", e: "🏐" },
      { en: "hockey", de: "Hockey", ru: "хоккей", e: "🏑" }, { en: "badminton", de: "Federball", ru: "бадминтон", e: "🏸" },
      { en: "American football", de: "American Football", ru: "американский футбол", e: "🏈" }, { en: "rugby", de: "Rugby", ru: "регби", e: "🏉" }],
    extra: [
      { typ: "wahl", frage: "„Do you like tennis?“ – Ja!", ru: "«Do you like tennis?» — Да!", optionen: ["Yes, I do.", "Yes, I am tennis.", "No, it's Monday."], e: "🎾" },
      { typ: "satz", de: "Frag: „Möchtest du mit mir spielen?“", ru: "Спроси: «Хочешь поиграть со мной?»", woerter: ["Would", "you", "like", "to", "play", "with", "me?"], e: "🤾" },
      { typ: "satz", de: "Sag: „Mein Hobby ist Basketball.“", ru: "Скажи: «Моё хобби — баскетбол».", woerter: ["My", "hobby", "is", "basketball."], e: "🏀" }],
    ende: { de: "Super! Mach mit deiner Familie eine Top-3-Liste eurer Lieblingssportarten – auf Englisch.", ru: "Супер! Составь с семьёй топ-3 любимых видов спорта — по-английски." }
  },
  {
    id: "en-portfolio", stufe: 4, lz: ["en.sp.03", "en.ik.01"], name: "My languages – Mein Sprachenpass", e: "🛂", farbe: "#1F8FB8", grund: "#E2F4FB",
    intro: { de: "In deinem Sprachenpass steht, welche Sprachen du kannst – auch die Sprache deiner Familie! In deine Sprachenmappe kommen deine besten Arbeiten. So siehst du, was du schon alles kannst.", ru: "В твоём языковом паспорте записано, какие языки ты знаешь, — и язык твоей семьи! В языковую папку кладёшь свои лучшие работы. Так видно, сколько ты уже умеешь." },
    woerter: [
      { en: "English", de: "Englisch", ru: "английский", e: "🇬🇧" }, { en: "German", de: "Deutsch", ru: "немецкий", e: "🇩🇪" },
      { en: "French", de: "Französisch", ru: "французский", e: "🇫🇷" }, { en: "Spanish", de: "Spanisch", ru: "испанский", e: "🇪🇸" },
      { en: "Polish", de: "Polnisch", ru: "польский", e: "🇵🇱" }, { en: "Czech", de: "Tschechisch", ru: "чешский", e: "🇨🇿" },
      { en: "Turkish", de: "Türkisch", ru: "турецкий", e: "🇹🇷" }, { en: "Ukrainian", de: "Ukrainisch", ru: "украинский", e: "🇺🇦" }],
    extra: [
      { typ: "satz", de: "Sag: „Ich kann Deutsch und Englisch sprechen.“", ru: "Скажи: «Я говорю по-немецки и по-английски».", woerter: ["I", "can", "speak", "German", "and", "English."], e: "🗣️" },
      { typ: "wahl", frage: "„Where are you from?“ – Ich komme aus Deutschland.", ru: "«Where are you from?» — Я из Германии.", optionen: ["I'm from Germany.", "I'm Germany years old.", "I like Germany food."], e: "🌍" },
      { typ: "wahl", frage: "Was kommt in deine Sprachenmappe (das Dossier)?", ru: "Что кладут в языковую папку (досье)?", optionen: ["my best English work", "my old socks", "nothing"], e: "📂", warum: "Im Dossier sammelst du Arbeiten, auf die du stolz bist – zum Beispiel einen Steckbrief oder eine Karte auf Englisch." }],
    ende: { de: "Toll! Frag deine Familie: Welche Sprachen sprechen wir? Schreib sie in deinen Sprachenpass.", ru: "Отлично! Спроси семью: на каких языках мы говорим? Запиши их в свой языковой паспорт." }
  }
);
