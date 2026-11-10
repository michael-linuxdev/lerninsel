// Englisch mit Papagei Paula (Englisch-Einstieg, Kl. 3–4 und Übergang 5; nach den Grundschul-Lehrplänen der Länder, GeR-Niveau A1 angebahnt).
// Lektion: { id, lb, stufe, lz, name, e, farbe, grund, intro: { de, ru }, woerter: [{ en, de, ru, e }], extra: [Schritte], ende: { de, ru } }
// Aus den Wörtern entstehen automatisch: Wortkarten (anhören, nachsprechen), Hören („Welches Bild?“), Lesen („Welches Bild?“), Übersetzen („Wie heißt das auf Englisch?“).
// Zusätzliche Schritt-Typen in extra (dazu lied { id, ru } = Lied/Reim aus shared/lieder.js zum Mitsingen, ohne Bewertung):
//   satz { de, ru, woerter: ["I", "like", "apples."], e? }   – englischen Satz aus Wörtern bauen
//   wahl { frage, ru, optionen: [richtig, falsch, falsch], e?, warum? } – Antwort auf Englisch wählen (erste Option richtig)
// lb: Lernbereich des Lehrplans Sachsen 2019 (1 Me, my family … 10 Around the year, 11 My Portfolio); die Übersicht ist danach gruppiert.
// Russische Texte sind Entwürfe (SPRACHEN.md); englische Wörter werden mit der englischen Gerätestimme vorgelesen.
window.ENGLISCH = [
  {
    id: "en-hello", lb: 1, stufe: 3, lz: ["en.sp.01", "en.hv.01"], name: "Hello! – Begrüßen", e: "👋", farbe: "#E0574A", grund: "#FFECE8",
    intro: { de: "Hello, {name}! Ich bin Paula. Papageien sprechen gern nach – und ich kann Englisch! Hör zu und sprich mir nach.", ru: "Hello, {name}! Я Паула. Попугаи любят повторять — а я умею говорить по-английски! Слушай и повторяй за мной." },
    woerter: [
      { en: "hello", de: "hallo", ru: "привет", e: "👋" }, { en: "goodbye", de: "auf Wiedersehen", ru: "до свидания", e: "🚶" },
      { en: "good morning", de: "guten Morgen", ru: "доброе утро", e: "🌅" }, { en: "good night", de: "gute Nacht", ru: "спокойной ночи", e: "🌙" },
      { en: "please", de: "bitte", ru: "пожалуйста", e: "🙏" }, { en: "thank you", de: "danke", ru: "спасибо", e: "💐" },
      { en: "yes", de: "ja", ru: "да", e: "👍" }, { en: "no", de: "nein", ru: "нет", e: "👎" }],
    extra: [
      { typ: "lied", id: "sleeping", ru: "Пой вместе: «Are you sleeping?» — это «Братец Яков» по-английски." },
      { typ: "satz", de: "Stell dich vor: „Ich heiße Mia.“", ru: "Представься: «Меня зовут Мия».", woerter: ["My", "name", "is", "Mia."], e: "🙋" },
      { typ: "wahl", frage: "Jemand fragt: „How are you?“ Was antwortest du?", ru: "Тебя спрашивают: «How are you?» Что ответишь?", optionen: ["I'm fine, thank you.", "Good night.", "I'm eight."], e: "🙂", warum: "„How are you?“ heißt „Wie geht es dir?“ – „I'm fine“ heißt „Mir geht es gut“." }],
    ende: { de: "Super! Sag heute zu deiner Familie einmal „Good morning“ oder „Good night“.", ru: "Супер! Скажи сегодня своей семье «Good morning» или «Good night»." }
  },
  {
    id: "en-colours", lb: 2, stufe: 3, lz: ["en.ws.01", "en.hv.01"], name: "Colours – Farben", e: "🎨", farbe: "#7B55B8", grund: "#EFE6FF",
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
    id: "en-numbers", lb: 1, stufe: 3, lz: ["en.ws.01", "en.hv.01"], name: "Numbers – Zahlen bis 10", e: "🔢", farbe: "#2FA37C", grund: "#E3F7EF",
    intro: { de: "Jetzt zählen wir auf Englisch von eins bis zehn: one, two, three …", ru: "Теперь считаем по-английски от одного до десяти: one, two, three …" },
    woerter: [
      { en: "one", de: "eins", ru: "один", e: "1️⃣" }, { en: "two", de: "zwei", ru: "два", e: "2️⃣" }, { en: "three", de: "drei", ru: "три", e: "3️⃣" },
      { en: "four", de: "vier", ru: "четыре", e: "4️⃣" }, { en: "five", de: "fünf", ru: "пять", e: "5️⃣" }, { en: "six", de: "sechs", ru: "шесть", e: "6️⃣" },
      { en: "seven", de: "sieben", ru: "семь", e: "7️⃣" }, { en: "eight", de: "acht", ru: "восемь", e: "8️⃣" }, { en: "nine", de: "neun", ru: "девять", e: "9️⃣" },
      { en: "ten", de: "zehn", ru: "десять", e: "🔟" }],
    extra: [
      { typ: "lied", id: "buckle", ru: "Говори вместе: считалка «One, two, buckle my shoe»." },
      { typ: "satz", de: "Sag, wie alt du bist: „Ich bin acht.“", ru: "Скажи, сколько тебе лет: «Мне восемь».", woerter: ["I", "am", "eight."], e: "🎂" },
      { typ: "wahl", frage: "Two + three = ?", ru: "Два плюс три = ?", optionen: ["five", "four", "six"], e: "➕" }],
    ende: { de: "Klasse! Zähl heute deine Stifte auf Englisch.", ru: "Класс! Посчитай сегодня свои карандаши по-английски." }
  },
  {
    id: "en-animals", lb: 8, stufe: 3, lz: ["en.ws.01", "en.hv.01"], name: "Animals – Tiere", e: "🐶", farbe: "#B5701A", grund: "#FFF1D9",
    intro: { de: "Tiere auf Englisch! Manche Wörter kennst du vielleicht schon.", ru: "Животные по-английски! Некоторые слова ты, может быть, уже знаешь." },
    woerter: [
      { en: "dog", de: "Hund", ru: "собака", e: "🐶" }, { en: "cat", de: "Katze", ru: "кошка", e: "🐱" }, { en: "bird", de: "Vogel", ru: "птица", e: "🐦" },
      { en: "fish", de: "Fisch", ru: "рыба", e: "🐟" }, { en: "horse", de: "Pferd", ru: "лошадь", e: "🐴" }, { en: "cow", de: "Kuh", ru: "корова", e: "🐮" },
      { en: "pig", de: "Schwein", ru: "свинья", e: "🐷" }, { en: "mouse", de: "Maus", ru: "мышь", e: "🐭" }],
    extra: [
      { typ: "lied", id: "macdonald", ru: "Пой вместе: «Old MacDonald had a farm»." },
      { typ: "satz", de: "Bau den Satz: „Ich habe einen Hund.“", ru: "Составь предложение: «У меня есть собака».", woerter: ["I've", "got", "a", "dog."], e: "🐶" },
      { typ: "wahl", frage: "Welches Tier sagt „moo“?", ru: "Какое животное говорит «му»?", optionen: ["cow", "cat", "bird"], e: "🐮" }],
    ende: { de: "Prima! Welches Tier magst du am liebsten? Sag es auf Englisch!", ru: "Отлично! Какое животное тебе нравится больше всего? Скажи по-английски!" }
  },
  {
    id: "en-body", lb: 2, stufe: 3, lz: ["en.ws.01", "en.hv.01"], name: "My body – Mein Körper", e: "👂", farbe: "#E0578F", grund: "#FFE8F1",
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
    id: "en-food", lb: 4, stufe: 3, lz: ["en.ws.01", "en.sp.02"], name: "Food – Essen", e: "🍎", farbe: "#D2502A", grund: "#FDECE4",
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
    id: "en-home", lb: 3, stufe: 3, lz: ["en.ws.01", "en.sp.02"], name: "At home – Zuhause", e: "🏠", farbe: "#C2337A", grund: "#FDEAF3",
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
    id: "en-year", lb: 10, stufe: 3, lz: ["en.ik.01", "en.ws.02"], name: "Around the year – Das Jahr", e: "🎃", farbe: "#E8A33D", grund: "#FFF1D9",
    intro: { de: "Durch das Jahr! Jahreszeiten und Feste auf Englisch. In England feiert man Halloween, Christmas und Easter – und natürlich Geburtstag.", ru: "Круглый год! Времена года и праздники по-английски. В Англии празднуют Halloween, Christmas и Easter — и, конечно, день рождения." },
    woerter: [
      { en: "spring", de: "Frühling", ru: "весна", e: "🌱" }, { en: "summer", de: "Sommer", ru: "лето", e: "🏖️" }, { en: "autumn", de: "Herbst", ru: "осень", e: "🍂" },
      { en: "winter", de: "Winter", ru: "зима", e: "⛄" }, { en: "birthday", de: "Geburtstag", ru: "день рождения", e: "🎂" }, { en: "Christmas", de: "Weihnachten", ru: "Рождество", e: "🎄" },
      { en: "Easter", de: "Ostern", ru: "Пасха", e: "🐣" }, { en: "Halloween", de: "Halloween", ru: "Хэллоуин", e: "🎃" }],
    extra: [
      { typ: "lied", id: "twinkle", ru: "Пой вместе: «Twinkle, twinkle, little star»." },
      { typ: "satz", de: "Sing mit: „Happy birthday to you!“", ru: "Спой вместе: «Happy birthday to you!»", woerter: ["Happy", "birthday", "to", "you!"], e: "🎂" },
      { typ: "wahl", frage: "Welcher Monat kommt nach January?", ru: "Какой месяц идёт после January?", optionen: ["February", "December", "June"], e: "📅", warum: "Die Monate: January, February, March, April, May, June, July, August, September, October, November, December." },
      { typ: "wahl", frage: "In welchem Monat ist Christmas?", ru: "В каком месяце Рождество?", optionen: ["December", "July", "March"], e: "🎄" },
      { typ: "wahl", frage: "Was sagst du am Geburtstag?", ru: "Что говорят в день рождения?", optionen: ["Happy birthday!", "Good night!", "Thank you, goodbye!"], e: "🎁" }],
    ende: { de: "Klasse! Welches Fest kommt als Nächstes? Sag es auf Englisch!", ru: "Класс! Какой праздник будет следующим? Скажи по-английски!" }
  },
  {
    id: "en-family", lb: 1, stufe: 4, lz: ["en.ws.02", "en.sp.02"], name: "Family – Familie", e: "👨‍👩‍👧", farbe: "#2F86C8", grund: "#E5F1FB",
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
    id: "en-school", lb: 6, stufe: 4, lz: ["en.ws.02", "en.le.01"], name: "School – Schulsachen", e: "🎒", farbe: "#E8A33D", grund: "#FFF1D9",
    intro: { de: "Was ist in deinem Ranzen? Lies die englischen Wörter und finde das Bild.", ru: "Что у тебя в рюкзаке? Читай английские слова и находи картинку." },
    woerter: [
      { en: "book", de: "Buch", ru: "книга", e: "📕" }, { en: "pen", de: "Füller/Kuli", ru: "ручка", e: "🖊️" }, { en: "pencil", de: "Bleistift", ru: "карандаш", e: "✏️" },
      { en: "ruler", de: "Lineal", ru: "линейка", e: "📏" }, { en: "scissors", de: "Schere", ru: "ножницы", e: "✂️" }, { en: "schoolbag", de: "Schultasche", ru: "рюкзак", e: "🎒" },
      { en: "chair", de: "Stuhl", ru: "стул", e: "🪑" }, { en: "teacher", de: "Lehrerin/Lehrer", ru: "учитель", e: "🧑‍🏫" }],
    extra: [
      { typ: "satz", de: "Bau den Satz: „Ich habe einen roten Stift.“", ru: "Составь предложение: «У меня есть красная ручка».", woerter: ["I've", "got", "a", "red", "pen."], e: "🖊️" },
      { typ: "wahl", frage: "Womit misst du eine Linie?", ru: "Чем измеряют линию?", optionen: ["ruler", "scissors", "chair"], e: "📐" }],
    ende: { de: "Klasse! Zeig morgen beim Packen auf deine Sachen und sag die englischen Wörter.", ru: "Класс! Завтра, собирая рюкзак, показывай на вещи и называй их по-английски." }
  },
  {
    id: "en-clothes", lb: 2, stufe: 4, lz: ["en.ws.02", "en.le.01"], name: "Clothes – Kleidung", e: "👕", farbe: "#3AA0E0", grund: "#E1F3FF",
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
    id: "en-weather", lb: 2, stufe: 4, lz: ["en.ws.02", "en.sp.02"], name: "Weather – Wetter", e: "🌦️", farbe: "#1F8FB8", grund: "#E2F4FB",
    intro: { de: "Wie ist das Wetter? Auf Englisch sagt man: „It is sunny.“ – „Es ist sonnig.“", ru: "Какая погода? По-английски говорят: «It is sunny.» — «Солнечно»." },
    woerter: [
      { en: "sunny", de: "sonnig", ru: "солнечно", e: "☀️" }, { en: "rainy", de: "regnerisch", ru: "дождливо", e: "🌧️" }, { en: "cloudy", de: "bewölkt", ru: "облачно", e: "☁️" },
      { en: "windy", de: "windig", ru: "ветрено", e: "💨" }, { en: "snowy", de: "verschneit", ru: "снежно", e: "❄️" }, { en: "hot", de: "heiß", ru: "жарко", e: "🥵" },
      { en: "cold", de: "kalt", ru: "холодно", e: "🥶" }, { en: "rainbow", de: "Regenbogen", ru: "радуга", e: "🌈" }],
    extra: [
      { typ: "lied", id: "rain", ru: "Пой вместе: «Rain, rain, go away»." },
      { typ: "satz", de: "Bau den Satz: „Heute ist es sonnig.“", ru: "Составь предложение: «Сегодня солнечно».", woerter: ["It", "is", "sunny", "today."], e: "☀️" },
      { typ: "wahl", frage: "Es regnet und du nimmst einen Schirm. Wie ist das Wetter?", ru: "Идёт дождь, и ты берёшь зонтик. Какая погода?", optionen: ["rainy", "sunny", "hot"], e: "☂️" },
      { typ: "wahl", frage: "Draußen ist es neblig: Man sieht kaum etwas. Wie sagt man das?", ru: "На улице туман: почти ничего не видно. Как это сказать?", optionen: ["It's foggy.", "It's sunny.", "It's hot."], e: "🌫️" },
      { typ: "wahl", frage: "„It's cold and snowy.“ Was ziehst du an?", ru: "«It's cold and snowy.» Что ты наденешь?", optionen: ["a warm jacket and a scarf", "a T-shirt and shorts", "a swimsuit"], e: "🧣", warum: "Bei Kälte und Schnee: warme Jacke und Schal." }],
    ende: { de: "Prima! Schau morgen aus dem Fenster und sag: „It is …“.", ru: "Отлично! Завтра посмотри в окно и скажи: «It is …»." }
  },
  {
    id: "en-hobbies", lb: 7, stufe: 5, lz: ["en.sp.03", "en.ws.02"], name: "Hobbies – Über mich", e: "⚽", farbe: "#2E9C5A", grund: "#E3F7EF",
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
    id: "en-feelings", lb: 1, stufe: 3, lz: ["en.sp.01", "en.hv.01"], name: "How are you? – Gefühle", e: "😊", farbe: "#E8A33D", grund: "#FFF1D9",
    intro: { de: "„How are you?“ heißt „Wie geht es dir?“. Heute lernst du, wie du auf Englisch sagst, wie du dich fühlst.", ru: "«How are you?» значит «Как дела?». Сегодня учимся говорить по-английски, как ты себя чувствуешь." },
    woerter: [
      { en: "happy", de: "fröhlich", ru: "радостный", e: "😄" }, { en: "sad", de: "traurig", ru: "грустный", e: "😢" },
      { en: "tired", de: "müde", ru: "усталый", e: "🥱" }, { en: "hungry", de: "hungrig", ru: "голодный", e: "😋" },
      { en: "thirsty", de: "durstig", ru: "хочется пить", e: "🥤" }, { en: "angry", de: "wütend", ru: "сердитый", e: "😠" },
      { en: "scared", de: "ängstlich", ru: "испуганный", e: "😨" }, { en: "fine", de: "gut", ru: "хорошо", e: "👌" }],
    extra: [
      { typ: "satz", de: "Sag: „Ich bin hungrig.“", ru: "Скажи: «Я голоден».", woerter: ["I'm", "hungry."], e: "🍽️" },
      { typ: "wahl", frage: "Jemand sagt „Nice to meet you.“ Was antwortest du?", ru: "Тебе говорят «Nice to meet you.» Что ответишь?", optionen: ["Nice to meet you, too.", "Goodbye, I'm tired.", "I'm a dog."], e: "🤝", warum: "„Nice to meet you“ heißt „Schön, dich kennenzulernen“ – die Antwort: „Nice to meet you, too.“" },
      { typ: "wahl", frage: "Du hast heute Geburtstag und freust dich sehr. Was sagst du?", ru: "У тебя сегодня день рождения, и ты очень рад(а). Что ты скажешь?", optionen: ["I'm happy.", "I'm sad.", "I'm angry."], e: "🎂" }],
    ende: { de: "Super! Frag heute jemanden „How are you?“ – und warte auf die Antwort.", ru: "Супер! Спроси сегодня кого-нибудь «How are you?» — и дождись ответа." }
  },
  {
    id: "en-numbers2", lb: 4, stufe: 3, lz: ["en.ws.01", "en.hv.01"], name: "Numbers – bis 100", e: "💯", farbe: "#2FA37C", grund: "#E3F7EF",
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
    id: "en-shopping", lb: 5, stufe: 3, lz: ["en.sp.02", "en.ws.01"], name: "Let's go shopping – Einkaufen", e: "🛍️", farbe: "#C2337A", grund: "#FDEAF3",
    intro: { de: "In England bezahlt man mit Pfund und Pence. Im Laden fragst du: „How much is it?“ – Wie viel kostet das?", ru: "В Англии платят фунтами и пенсами. В магазине спрашивают: «How much is it?» — Сколько это стоит?" },
    woerter: [
      { en: "shop", de: "Laden", ru: "магазин", e: "🏪" }, { en: "money", de: "Geld", ru: "деньги", e: "💰" },
      { en: "pound", de: "Pfund", ru: "фунт", e: "💷" }, { en: "penny", de: "Penny", ru: "пенни", e: "🪙" },
      { en: "toy", de: "Spielzeug", ru: "игрушка", e: "🧸" }, { en: "ball", de: "Ball", ru: "мяч", e: "⚽" },
      { en: "doll", de: "Puppe", ru: "кукла", e: "🪆" }, { en: "kite", de: "Drachen", ru: "воздушный змей", e: "🪁" }],
    extra: [
      { typ: "satz", de: "Frag: „Wie viel kostet das?“", ru: "Спроси: «Сколько это стоит?»", woerter: ["How", "much", "is", "it?"], e: "🏷️" },
      { typ: "satz", de: "Sag höflich: „Ich hätte gern den Ball, bitte.“", ru: "Скажи вежливо: «Я бы хотел мяч, пожалуйста».", woerter: ["I'd", "like", "the", "ball,", "please."], e: "⚽" },
      { typ: "wahl", frage: "Du hast nicht genug Geld. Was sagst du?", ru: "У тебя не хватает денег. Что скажешь?", optionen: ["Sorry, I haven't got enough money.", "Here you are.", "Happy birthday!"], e: "😕" },
      { typ: "wahl", frage: "Die Verkäuferin gibt dir den Drachen: „Here you are.“ Was sagst du?", ru: "Продавщица даёт тебе змея: «Here you are.» Что скажешь?", optionen: ["Thank you!", "Goodbye, sad!", "How old are you?"], e: "🪁" }],
    ende: { de: "Super! Spiel mit deiner Familie Kaufladen – auf Englisch.", ru: "Супер! Поиграй с семьёй в магазин — по-английски." }
  },
  {
    id: "en-subjects", lb: 6, stufe: 3, lz: ["en.ws.02", "en.hv.01"], name: "At school – Fächer, Tage, Uhrzeit", e: "🏫", farbe: "#3AA0E0", grund: "#E1F3FF",
    intro: { de: "Welche Fächer hast du heute? Auf Englisch heißt Mathe „maths“, Kunst „art“ und Sport „PE“. Und die Wochentage beginnen mit Monday.", ru: "Какие у тебя сегодня предметы? По-английски математика — «maths», рисование — «art», физкультура — «PE». А дни недели начинаются с Monday." },
    woerter: [
      { en: "maths", de: "Mathe", ru: "математика", e: "➗" }, { en: "English", de: "Englisch", ru: "английский", e: "🇬🇧" },
      { en: "German", de: "Deutsch", ru: "немецкий", e: "🇩🇪" }, { en: "art", de: "Kunst", ru: "рисование", e: "🎨" },
      { en: "music", de: "Musik", ru: "музыка", e: "🎵" }, { en: "PE", de: "Sport", ru: "физкультура", e: "🤸" },
      { en: "science", de: "Sachunterricht", ru: "окружающий мир", e: "🔬" }, { en: "break", de: "Pause", ru: "перемена", e: "🛝" }],
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
    id: "en-trip", lb: 9, stufe: 3, lz: ["en.ws.02", "en.sp.02"], name: "Let's go on a trip – Ausflug", e: "🚆", farbe: "#2F6FB8", grund: "#E5EFFB",
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
    id: "en-party", lb: 10, stufe: 3, lz: ["en.ik.01", "en.sp.02"], name: "Party time – Glückwünsche", e: "🎉", farbe: "#E0574A", grund: "#FFECE8",
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
    id: "en-everywhere", lb: 1, stufe: 3, lz: ["en.ik.01", "en.ws.01"], name: "English everywhere – Englisch im Alltag", e: "🌐", farbe: "#7B55B8", grund: "#EFE6FF",
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
    id: "en-furniture", lb: 3, stufe: 4, lz: ["en.ws.01", "en.sp.02"], name: "At home – Möbel", e: "🛋️", farbe: "#8A6E2F", grund: "#F7F0DD",
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
    id: "en-zoo", lb: 8, stufe: 4, lz: ["en.ws.01", "en.hv.01"], name: "At the zoo – Wilde Tiere", e: "🦁", farbe: "#E8A33D", grund: "#FFF1D9",
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
    id: "en-london", lb: 9, stufe: 4, lz: ["en.ik.01", "en.ws.02"], name: "London – die Hauptstadt", e: "🎡", farbe: "#C2337A", grund: "#FDEAF3",
    intro: { de: "London ist die Hauptstadt von England und vom Vereinigten Königreich. Durch die Stadt fließt die Themse, die roten Busse haben zwei Stockwerke, und die große Glocke im Uhrturm heißt Big Ben.", ru: "Лондон — столица Англии и Соединённого Королевства. Через город течёт Темза, красные автобусы двухэтажные, а большой колокол в часовой башне называется Биг-Бен." },
    woerter: [
      { en: "Big Ben", de: "Big Ben (Glocke im Uhrturm)", ru: "Биг-Бен", e: "🕰️" }, { en: "bridge", de: "Brücke", ru: "мост", e: "🌉" },
      { en: "double-decker", de: "Doppeldeckerbus", ru: "двухэтажный автобус", e: "🚌" }, { en: "river", de: "Fluss", ru: "река", e: "🏞️" },
      { en: "palace", de: "Palast", ru: "дворец", e: "🏰" }, { en: "taxi", de: "Taxi", ru: "такси", e: "🚕" },
      { en: "underground", de: "U-Bahn", ru: "метро", e: "🚇" }, { en: "London Eye", de: "Riesenrad London Eye", ru: "колесо обозрения London Eye", e: "🎡" }],
    extra: [
      { typ: "lied", id: "london", ru: "Пой вместе: «London Bridge is falling down»." },
      { typ: "wahl", frage: "Wie heißt der Fluss in London?", ru: "Как называется река в Лондоне?", optionen: ["the Thames", "the Elbe", "the Rhine"], e: "🏞️", warum: "Die Themse (the Thames). Die Elbe fließt durch Dresden." },
      { typ: "satz", de: "Sag: „Ich mag London. Ich mag den Fluss.“", ru: "Скажи: «Мне нравится Лондон. Мне нравится река».", woerter: ["I", "like", "London.", "I", "like", "the", "river."], e: "💂" },
      { typ: "wahl", frage: "Auf welcher Straßenseite fahren die Autos in England?", ru: "По какой стороне дороги ездят машины в Англии?", optionen: ["on the left", "on the right", "in the middle"], e: "🚗", warum: "In Großbritannien fährt man links – also beim Überqueren erst nach rechts schauen!" }],
    ende: { de: "Super! Wenn du einmal nach London fährst: „A ticket for the London Eye, please!“", ru: "Супер! Если поедешь в Лондон: «A ticket for the London Eye, please!»" }
  },
  {
    id: "en-cafe", lb: 4, stufe: 4, lz: ["en.sp.02", "en.ws.01"], name: "In the café – Bestellen", e: "☕", farbe: "#B5701A", grund: "#FFF1D9",
    intro: { de: "Im Café oder in der Snackbar bestellst du höflich: „I'd like …, please.“ Typisch englisch sind fish and chips, Pfannkuchen und Tee.", ru: "В кафе вежливо заказывают: «I'd like…, please.» Типично английские — fish and chips, блины и чай." },
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
    id: "en-dates", lb: 10, stufe: 4, lz: ["en.ik.01", "en.ws.02"], name: "Festivals and dates – Feste und Datum", e: "💝", farbe: "#E0574A", grund: "#FFECE8",
    intro: { de: "In Großbritannien und Amerika feiert man besondere Tage: Valentine's Day im Februar, Pancake Day vor der Fastenzeit, Thanksgiving in Amerika im November. Für das Datum braucht man Ordnungszahlen: first, second, third …", ru: "В Великобритании и Америке отмечают особые дни: День святого Валентина в феврале, Блинный день перед постом, День благодарения в Америке в ноябре. Для даты нужны порядковые числа: first, second, third…" },
    woerter: [
      { en: "first", de: "erste", ru: "первый", e: "🥇" }, { en: "second", de: "zweite", ru: "второй", e: "🥈" },
      { en: "third", de: "dritte", ru: "третий", e: "🥉" }, { en: "Valentine's Day", de: "Valentinstag", ru: "День святого Валентина", e: "💝" },
      { en: "Mother's Day", de: "Muttertag", ru: "День матери", e: "💐" }, { en: "Pancake Day", de: "Pfannkuchentag", ru: "Блинный день", e: "🥞" },
      { en: "Thanksgiving", de: "Erntedankfest (USA)", ru: "День благодарения", e: "🦃" }, { en: "St Patrick's Day", de: "St.-Patricks-Tag (Irland)", ru: "День святого Патрика", e: "☘️" }],
    extra: [
      { typ: "wahl", frage: "Weihnachten ist am 25. Dezember. Wie sagt man das?", ru: "Рождество 25 декабря. Как это сказать?", optionen: ["the twenty-fifth of December", "twenty-five December", "December is twenty"], e: "🎄" },
      { typ: "wahl", frage: "In welchem Monat ist Valentine's Day?", ru: "В каком месяце День святого Валентина?", optionen: ["February", "October", "July"], e: "💝" },
      { typ: "satz", de: "Sag: „Heute ist der erste Mai.“", ru: "Скажи: «Сегодня первое мая».", woerter: ["Today", "is", "the", "first", "of", "May."], e: "📅" }],
    ende: { de: "Toll! Welches englische Fest gefällt dir am besten? Mal eine Karte dazu!", ru: "Отлично! Какой английский праздник тебе нравится больше всего? Нарисуй к нему открытку!" }
  },
  {
    id: "en-sports", lb: 7, stufe: 3, lz: ["en.ws.02", "en.sp.03"], name: "Sports and games – Sport", e: "🏏", farbe: "#2E9C5A", grund: "#E3F7EF",
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
    id: "en-portfolio", lb: 11, stufe: 3, lz: ["en.sp.03", "en.ik.01"], name: "My languages – Mein Sprachenpass", e: "🛂", farbe: "#1F8FB8", grund: "#E2F4FB",
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

// ---------- 30.10.2026: Bücher, Sachtext, Theater zu Festen, Mimik und Gesten ----------
// Neue Schritt-Typen: buch { titel, seiten: [{ e, en, de }], ru }, sachtext { titel, text (Schlüsselwörter in *…*), woerter: [[en, de]], ru },
// rolle { szene, rollen: { a, b }, ich, zeilen: [[rolle, en, de]], ru } – das Kind spricht seine Rolle, Paula die andere.
window.ENGLISCH.push(
  {
    id: "en-book", lb: 7, stufe: 4, lz: ["en.le.01", "en.hv.01"], name: "A picture book – Ein Bilderbuch", e: "📚", farbe: "#7B55B8", grund: "#EFE6FF",
    intro: { de: "Englische Bücher lesen – das geht schon! Achte auf die Bilder und auf Wörter, die du kennst.", ru: "Читать английские книги — это уже получится! Смотри на картинки и знакомые слова." },
    woerter: [
      { en: "book", de: "Buch", ru: "книга", e: "📕" }, { en: "page", de: "Seite", ru: "страница", e: "📄" }, { en: "story", de: "Geschichte", ru: "история", e: "🧚" },
      { en: "library", de: "Bücherei", ru: "библиотека", e: "📚" }, { en: "to read", de: "lesen", ru: "читать", e: "👓" }, { en: "the end", de: "Ende", ru: "конец", e: "🔚" }],
    extra: [
      { typ: "buch", titel: "The Hungry Little Fox", ru: "Английская книжка с картинками: «Голодный лисёнок».", seiten: [
        { e: "🦊", en: "This is Fox. Fox is little and Fox is hungry.", de: "Das ist Fuchs. Fuchs ist klein und hungrig." },
        { e: "🍎", en: "On Monday Fox eats one red apple.", de: "Am Montag isst Fuchs einen roten Apfel." },
        { e: "🍐", en: "On Tuesday Fox eats two green pears.", de: "Am Dienstag isst Fuchs zwei grüne Birnen." },
        { e: "🍓", en: "On Wednesday Fox eats three sweet strawberries.", de: "Am Mittwoch isst Fuchs drei süße Erdbeeren." },
        { e: "🤢", en: "On Thursday Fox eats too much cake. Oh no! Fox has got a tummy ache.", de: "Am Donnerstag isst Fuchs zu viel Kuchen. Oh nein! Fuchs hat Bauchweh." },
        { e: "😴", en: "On Friday Fox eats a carrot and goes to sleep. Good night, Fox! The end.", de: "Am Freitag isst Fuchs eine Möhre und geht schlafen. Gute Nacht, Fuchs! Ende." }] },
      { typ: "wahl", frage: "What does Fox eat on Tuesday?", ru: "Что ест лисёнок во вторник?", optionen: ["two green pears", "one red apple", "a carrot"], e: "🍐", warum: "On Tuesday: two green pears – zwei grüne Birnen." },
      { typ: "wahl", frage: "Why has Fox got a tummy ache?", ru: "Почему у лисёнка болит живот?", optionen: ["He eats too much cake.", "He is sleepy.", "He reads a book."], e: "🤢", warum: "Zu viel Kuchen – too much cake!" }],
    ende: { de: "Super! Such dir in der Bücherei ein englisches Bilderbuch aus – du verstehst schon viel mehr, als du denkst.", ru: "Супер! Возьми в библиотеке английскую книжку с картинками." }
  },
  {
    id: "en-hedgehog", lb: 8, stufe: 4, lz: ["en.le.01", "en.ws.01"], name: "Hedgehogs – ein Sachtext", e: "🦔", farbe: "#8A6E2F", grund: "#F7F0DD",
    intro: { de: "Heute liest du einen kleinen englischen Sachtext über Igel. Du musst nicht jedes Wort verstehen – die Schlüsselwörter helfen dir!", ru: "Сегодня ты читаешь короткий английский текст о ежах. Ключевые слова помогут!" },
    woerter: [
      { en: "hedgehog", de: "Igel", ru: "ёж", e: "🦔" }, { en: "night", de: "Nacht", ru: "ночь", e: "🌙" }, { en: "beetle", de: "Käfer", ru: "жук", e: "🪲" },
      { en: "worm", de: "Wurm", ru: "червяк", e: "🪱" }, { en: "leaves", de: "Blätter", ru: "листья", e: "🍂" }, { en: "winter", de: "Winter", ru: "зима", e: "❄️" }],
    extra: [
      { typ: "sachtext", titel: "Hedgehogs", ru: "Текст о ежах: обрати внимание на ключевые слова.", text: "*Hedgehogs* are small animals with lots of spines. They sleep in the day and look for food at *night*. They eat *beetles* and *worms*. In autumn they make a nest from *leaves*. Then they sleep all *winter*. In spring they wake up again.",
        woerter: [["spines", "Stacheln"], ["food", "Futter"], ["nest", "Nest"], ["spring", "Frühling"]] },
      { typ: "wahl", frage: "When do hedgehogs look for food?", ru: "Когда ежи ищут еду?", optionen: ["at night", "in the morning", "at lunchtime"], e: "🌙", warum: "Schlüsselwort: night – nachts." },
      { typ: "wahl", frage: "What do hedgehogs eat?", ru: "Что едят ежи?", optionen: ["beetles and worms", "pizza and chips", "carrots and apples"], e: "🪲", warum: "Schlüsselwörter: beetles and worms – Käfer und Würmer." },
      { typ: "wahl", frage: "What do hedgehogs do in winter?", ru: "Что делают ежи зимой?", optionen: ["They sleep.", "They swim.", "They fly south."], e: "⛄", warum: "They sleep all winter – Winterschlaf." }],
    ende: { de: "Toll! Du hast einen englischen Sachtext verstanden – mit Schlüsselwörtern geht das.", ru: "Отлично! Ты понял(а) английский текст с помощью ключевых слов." }
  },
  {
    id: "en-act", lb: 10, stufe: 3, lz: ["en.sp.02", "en.ik.01"], name: "Act it out! – Theater zu Festen", e: "🎭", farbe: "#E0574A", grund: "#FFECE8",
    intro: { de: "Wir spielen Theater auf Englisch: eine Szene an Halloween und eine Geburtstagsfeier. Sprich laut und spiel mit Gesicht und Händen!", ru: "Играем сценки на английском: Хэллоуин и день рождения. Говори громко и показывай жестами!" },
    woerter: [
      { en: "costume", de: "Kostüm", ru: "костюм", e: "🦸" }, { en: "pumpkin", de: "Kürbis", ru: "тыква", e: "🎃" }, { en: "sweets", de: "Süßigkeiten", ru: "сладости", e: "🍬" },
      { en: "present", de: "Geschenk", ru: "подарок", e: "🎁" }, { en: "candle", de: "Kerze", ru: "свечка", e: "🕯️" }, { en: "party", de: "Feier", ru: "праздник", e: "🥳" }],
    extra: [
      { typ: "rolle", szene: "Halloween: Ein Kind klingelt an der Tür.", ru: "Хэллоуин: ребёнок звонит в дверь.", rollen: { a: "👵 Neighbour", b: "🧛 Kind" }, ich: "b", zeilen: [
        ["b", "Trick or treat!", "Süßes oder Saures!"], ["a", "Oh! What a scary costume! Who are you?", "Oh! Was für ein gruseliges Kostüm! Wer bist du?"],
        ["b", "I'm a vampire!", "Ich bin ein Vampir!"], ["a", "Here are some sweets for you.", "Hier sind ein paar Süßigkeiten für dich."], ["b", "Thank you! Happy Halloween!", "Danke! Fröhliches Halloween!"]] },
      { typ: "rolle", szene: "Geburtstag: Du bringst ein Geschenk.", ru: "День рождения: ты приносишь подарок.", rollen: { a: "🎂 Tom", b: "🎁 Du" }, ich: "b", zeilen: [
        ["b", "Happy birthday, Tom! This is for you.", "Alles Gute zum Geburtstag, Tom! Das ist für dich."], ["a", "Thank you! What is it?", "Danke! Was ist es?"],
        ["b", "Open it!", "Mach es auf!"], ["a", "Wow, a football! I love it!", "Wow, ein Fußball! Ich liebe ihn!"], ["b", "Let's play!", "Lass uns spielen!"]] },
      { typ: "wahl", frage: "Was sagen Kinder an Halloween an der Tür?", ru: "Что говорят дети в Хэллоуин у двери?", optionen: ["Trick or treat!", "Merry Christmas!", "Good night!"], e: "🚪", warum: "„Trick or treat!“ – Süßes oder Saures!" }],
    ende: { de: "Bravo! Spielt die Szenen mit Familie oder Freunden – mit Kostüm macht es doppelt Spaß.", ru: "Браво! Сыграйте сценки с семьёй или друзьями." }
  },
  {
    id: "en-faces", lb: 1, stufe: 4, lz: ["en.sp.01", "en.sp.03"], name: "Faces and gestures – Mimik und Gesten", e: "🤷", farbe: "#2F86C8", grund: "#E1F3FF",
    intro: { de: "Beim Sprechen helfen Gesicht und Hände. Zeig mit, wenn du die Wörter hörst!", ru: "Лицо и руки помогают говорить. Показывай вместе со словами!" },
    woerter: [
      { en: "to smile", de: "lächeln", ru: "улыбаться", e: "😊" }, { en: "to wave", de: "winken", ru: "махать рукой", e: "👋" }, { en: "to point", de: "zeigen", ru: "показывать", e: "👉" },
      { en: "surprised", de: "überrascht", ru: "удивлённый", e: "😮" }, { en: "to shrug", de: "mit den Schultern zucken", ru: "пожимать плечами", e: "🤷" }, { en: "to clap", de: "klatschen", ru: "хлопать в ладоши", e: "👏" }],
    extra: [
      { typ: "wahl", frage: "Welche Geste passt zu „I don't know.“?", ru: "Какой жест подходит к «I don't know»?", optionen: ["🤷 Schultern hochziehen", "👋 winken", "👍 Daumen hoch"], e: "❓", warum: "„I don't know“ – dazu zuckt man mit den Schultern." },
      { typ: "wahl", frage: "Welche Geste passt zu „Come here, please!“?", ru: "Какой жест подходит к «Come here, please!»?", optionen: ["🫴 mit der Hand heranwinken", "🙅 Arme kreuzen", "😴 Augen zu"], e: "🙋", warum: "Mit der Hand heranwinken heißt: Komm her!" },
      { typ: "wahl", frage: "Welches Gesicht passt zu „Wow! A present for me?“", ru: "Какое лицо подходит к «Wow! A present for me?»", optionen: ["surprised 😮", "tired 🥱", "angry 😠"], e: "🎁", warum: "Bei einer Überraschung macht man große Augen: surprised." },
      { typ: "rolle", szene: "Spiel mit Gesicht und Händen!", ru: "Играй лицом и руками!", rollen: { a: "\uE106 Paula", b: "🙂 Du" }, ich: "b", zeilen: [
        ["a", "Show me: I'm happy!", "Zeig mir: Ich bin fröhlich!"], ["b", "I'm happy! 😄", "Ich bin fröhlich!"], ["a", "Show me: I'm tired!", "Zeig mir: Ich bin müde!"], ["b", "I'm tired! 🥱", "Ich bin müde!"],
        ["a", "Show me: I don't know!", "Zeig mir: Ich weiß nicht!"], ["b", "I don't know! 🤷", "Ich weiß nicht!"]] }],
    ende: { de: "Super! Gesichter und Gesten verstehen Menschen überall – das hilft, wenn dir ein Wort fehlt.", ru: "Супер! Мимику и жесты понимают везде." }
  }
);

// ---------- Sprechen, Hören, kleine Dialoge (07.11.2026, Review: Englisch war fast nur Wortschatz) ----------
// Neue Schritt-Typen in extra (in den Lektionen unten eingehängt):
//   dialog { wer, kontext?, e?, frage (EN), de, optionen: [richtig, …] (EN, {name} erlaubt), warum?, ru, punkte? }
//     – ein Begleiter (FigurenNeu, nie Emoji) fragt auf Englisch (🔊 nur auf Knopfdruck), das Kind wählt die passende Antwort und spricht sie nach
//       (mit Eltern-Erlaubnis eltern.englisch.aufnehmen auch mit Aufnahme und Selbstvergleich „Klang es gleich? 👍/🔁“ – zählt nie als Fehler).
//   gespraech { wer, titel, ru, punkte?, zuege: [{ frage, de, kontext?, e?, optionen }] } – Rollenspiel: wird zu mehreren dialog-Schritten mit Verlauf.
//   hoergeschichte { wer, titel, e, saetze: [EN], de, ru, fragen: [{ frage, de, optionen: [Emoji richtig, …], antwort, ru, punkte? }] }
//     – erst hören (Text versteckt), dann Fragen mit Bild-Antworten, danach der Text zum Mitlesen. Ohne englische Stimme steht der Text gleich da.
//   nachsprechen { satz, de, e?, tipp?, ru } – nur mit Eltern-Erlaubnis und Mikrofon, sonst fällt der Schritt still weg; ohne Bewertung.
// punkte: Inhaltspunkte (sachsen-punkte.js), für die dieser Schritt eine echte Übung ist – tests/lehrplan.js zählt sie je Punkt.
// Russisch: nur die Anleitung (Entwurf), nie die englischen Sätze.
(function () {
  const RU_D = "Нажми 🔊 и послушай вопрос. Выбери подходящий ответ и скажи его вслух.";
  const RU_G = "Послушай историю (🔊). Потом будут вопросы — отвечай картинками.";
  const SPRECHEN = {
    "en-hello": [
      { typ: "dialog", wer: "robo", e: "🌅", kontext: "Robo trifft dich am Morgen.", frage: "Good morning! I'm Robo. What's your name?", de: "Guten Morgen! Ich bin Robo. Wie heißt du?",
        optionen: ["Good morning! My name is {name}.", "Good night! I'm eight.", "Goodbye! It's red."], warum: "„What's your name?“ = „Wie heißt du?“ – „My name is …“ = „Ich heiße …“", ru: "Робо встречает тебя утром. " + RU_D, punkte: ["sn.en3.mf.03"] },
      { typ: "dialog", wer: "fipsi", e: "🚶", kontext: "Fipsi geht nach Hause.", frage: "Bye-bye, {name}! See you tomorrow!", de: "Tschüss! Bis morgen!",
        optionen: ["Goodbye, Fipsi! See you!", "Hello, Fipsi! Nice to meet you.", "Thank you, I'm fine."], ru: "Фипси идёт домой. " + RU_D, punkte: ["sn.en3.mf.03"] },
      { typ: "dialog", wer: "baer", e: "🙂", kontext: "Dir geht es gut.", frage: "Hi, {name}! How are you?", de: "Hallo! Wie geht es dir?",
        optionen: ["I'm fine, thank you. And you?", "I'm eight, thank you.", "My name is fine."], warum: "„How are you?“ fragt, wie es dir geht – nicht, wie alt du bist.", ru: "У тебя всё хорошо. " + RU_D, punkte: ["sn.en3.mf.05"] },
      { typ: "nachsprechen", satz: "Thank you!", de: "Danke!", e: "💐", tipp: "Beim „th“ schaut die Zungenspitze kurz zwischen den Zähnen hervor.", ru: "Послушай, скажи сам(а) и сравни. При «th» кончик языка чуть выглядывает между зубами." }],
    "en-numbers": [
      { typ: "dialog", wer: "tilda", e: "🎂", kontext: "Stell dir vor, du bist acht Jahre alt.", frage: "How old are you?", de: "Wie alt bist du?",
        optionen: ["I'm eight.", "I have eight years.", "I'm fine."], warum: "Auf Englisch sagt man „I'm eight“ – wie im Deutschen „Ich bin acht“.", ru: "Представь, что тебе восемь лет. " + RU_D, punkte: ["sn.en3.mf.04"] }],
    "en-family": [
      { typ: "hoergeschichte", wer: "papagei", titel: "Tom's family", e: "👨‍👩‍👧", saetze: ["Hello! I'm Tom.", "I'm nine years old.", "I've got a sister. Her name is Lily.", "Lily is six.", "And we've got a dog."],
        de: "Hallo! Ich bin Tom. Ich bin neun Jahre alt. Ich habe eine Schwester. Sie heißt Lily. Lily ist sechs. Und wir haben einen Hund.", ru: RU_G,
        fragen: [
          { frage: "How old is Tom?", de: "Wie alt ist Tom?", optionen: ["9️⃣", "6️⃣", "3️⃣"], antwort: "Tom is nine.", ru: "Сколько лет Тому?", punkte: ["sn.en3.mf.04"] },
          { frage: "Who is Lily?", de: "Wer ist Lily?", optionen: ["👧", "👩", "👵"], antwort: "Lily is Tom's sister.", ru: "Кто такая Лили?", punkte: ["sn.en3.mf.04"] },
          { frage: "What pet have they got?", de: "Welches Haustier haben sie?", optionen: ["🐶", "🐱", "🐟"], antwort: "They've got a dog.", ru: "Какое у них домашнее животное?", punkte: ["sn.en3.mf.04"] }] },
      { typ: "dialog", wer: "robo", e: "👦", kontext: "Du hast einen Bruder.", frage: "Have you got a brother or a sister?", de: "Hast du einen Bruder oder eine Schwester?",
        optionen: ["I've got a brother.", "I'm a brother.", "I've got a sister."], warum: "„I've got …“ = „Ich habe …“", ru: "У тебя есть брат. " + RU_D, punkte: ["sn.en3.mf.04"] }],
    "en-portfolio": [
      { typ: "gespraech", wer: "robo", titel: "An interview with Robo", ru: "Интервью: Робо спрашивает, ты отвечаешь. " + RU_D, punkte: ["sn.en4.mf.03"], zuege: [
        { frage: "Hello! What's your name?", de: "Hallo! Wie heißt du?", e: "🙋", optionen: ["My name is {name}.", "I'm from {name}.", "I like {name}."] },
        { frage: "Where are you from?", de: "Woher kommst du?", kontext: "Du kommst aus Deutschland.", e: "🇩🇪", optionen: ["I'm from Germany.", "I'm Germany.", "I like Germany."] },
        { frage: "What languages can you speak?", de: "Welche Sprachen kannst du sprechen?", kontext: "Du sprichst Deutsch und Englisch.", e: "🗣️", optionen: ["I can speak German and English.", "I can German and English.", "I'm German and English."] }] }],
    "en-feelings": [
      { typ: "dialog", wer: "eule", e: "🥱", kontext: "Du bist sehr müde.", frage: "How are you today?", de: "Wie geht es dir heute?",
        optionen: ["I'm tired.", "I'm hungry.", "I'm happy."], ru: "Ты очень устал(а). " + RU_D, punkte: ["sn.en3.mf.05"] },
      { typ: "dialog", wer: "biber", e: "😢", kontext: "Dein Ballon ist weggeflogen. Du bist traurig.", frage: "Oh! What's the matter?", de: "Oh! Was ist los?",
        optionen: ["I'm sad. My balloon is gone.", "I'm happy. My balloon is gone.", "I'm fine, thank you."], ru: "Твой шарик улетел, тебе грустно. " + RU_D, punkte: ["sn.en4.mf.04"] },
      { typ: "dialog", wer: "papagei", e: "🥤", kontext: "Du hast keinen Hunger, aber großen Durst.", frage: "Are you hungry?", de: "Hast du Hunger?",
        optionen: ["No, I'm not. I'm thirsty.", "Yes, I'm thirsty.", "No, I'm hungry."], warum: "hungry = hungrig, thirsty = durstig", ru: "Ты не голоден (не голодна), но очень хочешь пить. " + RU_D, punkte: ["sn.en4.mf.04"] },
      { typ: "nachsprechen", satz: "I'm happy!", de: "Ich bin fröhlich!", e: "😄", tipp: "Sag es fröhlich – mit einem Lächeln klingt es gleich richtig.", ru: "Послушай, скажи сам(а) и сравни." }],
    "en-colours": [
      { typ: "dialog", wer: "fipsi", e: "🔵", kontext: "Du magst Blau am liebsten.", frage: "What's your favourite colour?", de: "Was ist deine Lieblingsfarbe?",
        optionen: ["My favourite colour is blue.", "I'm blue.", "Yes, I like colours."], ru: "Твой любимый цвет — синий. " + RU_D, punkte: ["sn.en3.bc.05"] }],
    "en-clothes": [
      { typ: "dialog", wer: "baer", e: "🧥", kontext: "Bruni hält eine Jacke hoch. Es ist deine.", frage: "Is this your jacket?", de: "Ist das deine Jacke?",
        optionen: ["Yes, it's my jacket. Thank you!", "Yes, I'm a jacket.", "No, it's sunny."], ru: "Бруни держит куртку. Это твоя куртка. " + RU_D, punkte: ["sn.en3.bc.05"] },
      { typ: "dialog", wer: "tilda", e: "👕", kontext: "Am liebsten trägst du dein grünes T-Shirt.", frage: "What do you like to wear?", de: "Was ziehst du gern an?",
        optionen: ["I like to wear my green T-shirt.", "I like green apples.", "My T-shirt is cold."], ru: "Больше всего ты любишь носить зелёную футболку. " + RU_D, punkte: ["sn.en4.bc.02"] }],
    "en-weather": [
      { typ: "hoergeschichte", wer: "eule", titel: "A cold day", e: "❄️", saetze: ["Brr! It's cold and snowy today.", "Ben puts on his warm jacket.", "He puts on his red scarf, too.", "But where is his woolly hat?", "Oh, here it is – under the bed!"],
        de: "Brr! Heute ist es kalt und es schneit. Ben zieht seine warme Jacke an. Er zieht auch seinen roten Schal an. Aber wo ist seine Mütze? Oh, hier ist sie – unter dem Bett!", ru: RU_G,
        fragen: [
          { frage: "What's the weather like?", de: "Wie ist das Wetter?", optionen: ["❄️", "☀️", "🌧️"], antwort: "It's cold and snowy.", ru: "Какая погода?", punkte: ["sn.en4.bc.02"] },
          { frage: "What colour is Ben's scarf?", de: "Welche Farbe hat Bens Schal?", optionen: ["🔴", "🔵", "🟢"], antwort: "It's red.", ru: "Какого цвета шарф у Бена?", punkte: ["sn.en4.bc.02"] },
          { frage: "Where is the woolly hat?", de: "Wo ist die Mütze?", optionen: ["🛏️", "🛋️", "🚪"], antwort: "It's under the bed.", ru: "Где шапка?" }] },
      { typ: "dialog", wer: "robo", e: "🌧️", kontext: "Draußen regnet es.", frage: "It's rainy. What do you need?", de: "Es regnet. Was brauchst du?",
        optionen: ["I need my jacket and my umbrella.", "I need my sunglasses.", "I need a swimsuit."], ru: "На улице дождь. " + RU_D, punkte: ["sn.en4.bc.02"] }],
    "en-home": [
      { typ: "hoergeschichte", wer: "papagei", titel: "Paula's house", e: "🏠", saetze: ["Welcome to my house!", "The kitchen is yellow.", "The bathroom is blue.", "My cat sleeps in the living room.", "And I sit in the garden."],
        de: "Willkommen in meinem Haus! Die Küche ist gelb. Das Badezimmer ist blau. Meine Katze schläft im Wohnzimmer. Und ich sitze im Garten.", ru: RU_G,
        fragen: [
          { frage: "Which room is yellow?", de: "Welches Zimmer ist gelb?", optionen: ["🍳", "🛁", "🛏️"], antwort: "The kitchen is yellow.", ru: "Какая комната жёлтая?", punkte: ["sn.en3.ah.01"] },
          { frage: "Where does the cat sleep?", de: "Wo schläft die Katze?", optionen: ["🛋️", "🛏️", "🌷"], antwort: "In the living room.", ru: "Где спит кошка?", punkte: ["sn.en3.ah.01", "sn.en3.ah.03"] },
          { frage: "Where is Paula?", de: "Wo ist Paula?", optionen: ["🌷", "🍳", "🛁"], antwort: "Paula is in the garden.", ru: "Где Паула?", punkte: ["sn.en3.ah.03"] }] },
      { typ: "dialog", wer: "biber", e: "🐱", kontext: "Bennos Katze liegt unter dem Bett.", frage: "Where is my cat?", de: "Wo ist meine Katze?",
        optionen: ["It's under the bed.", "It's on the bed.", "It's in the bath."], warum: "under = unter, on = auf, in = in", ru: "Кошка Бенно лежит под кроватью. " + RU_D, punkte: ["sn.en3.ah.03"] }],
    "en-furniture": [
      { typ: "dialog", wer: "fipsi", e: "⚽", kontext: "Der Ball liegt neben dem Sofa.", frage: "Where is my ball?", de: "Wo ist mein Ball?",
        optionen: ["It's next to the sofa.", "It's under the sofa.", "It's on the sofa."], warum: "next to = neben", ru: "Мяч лежит рядом с диваном. " + RU_D, punkte: ["sn.en4.ah.02"] },
      { typ: "dialog", wer: "tilda", e: "💡", kontext: "Die Lampe steht auf dem Tisch.", frage: "Where is the lamp?", de: "Wo ist die Lampe?",
        optionen: ["It's on the table.", "It's under the table.", "It's next to the bed."], warum: "on = auf", ru: "Лампа стоит на столе. " + RU_D, punkte: ["sn.en4.ah.02"] }],
    "en-cafe": [
      { typ: "gespraech", wer: "papagei", titel: "In Paula's café", ru: "Ролевая игра: Паула — официантка, ты — гость. " + RU_D, punkte: ["sn.en4.fd.01"], zuege: [
        { frage: "Hello! Welcome to my café. What would you like?", de: "Hallo! Willkommen in meinem Café. Was möchtest du?", kontext: "Du möchtest einen Pfannkuchen.", e: "🥞",
          optionen: ["Can I have a pancake, please?", "I am a pancake, please.", "Here you are, pancake."] },
        { frage: "Here you are. Anything to drink?", de: "Bitte schön. Etwas zu trinken?", kontext: "Du möchtest einen Saft.", e: "🧃", optionen: ["Yes, a juice, please.", "Yes, you are a juice.", "No, I'm a juice."] },
        { frage: "Here's your juice.", de: "Hier ist dein Saft.", kontext: "Du möchtest wissen, was es kostet.", e: "💷", optionen: ["Thank you! How much is it?", "Thank you! How old is it?", "Thank you! Where is it?"] },
        { frage: "That's three pounds, please.", de: "Das macht drei Pfund, bitte.", kontext: "Du bezahlst und verabschiedest dich.", e: "🪙", optionen: ["Here you are. Goodbye!", "Three pounds, please.", "Happy birthday!"] }] }],
    "en-shopping": [
      { typ: "gespraech", wer: "baer", titel: "At Bruni's toy shop", ru: "Ролевая игра: Бруни — продавщица, ты — покупатель. " + RU_D, punkte: ["sn.en3.sh.03", "sn.en4.sh.02"], zuege: [
        { frage: "Good morning! Can I help you?", de: "Guten Morgen! Kann ich dir helfen?", kontext: "Du möchtest einen Drachen kaufen.", e: "🪁", optionen: ["Yes, please. I'd like a kite.", "Yes, I am a kite.", "No, it's Monday."] },
        { frage: "Here you are. It's a red kite.", de: "Bitte schön. Es ist ein roter Drachen.", kontext: "Du fragst nach dem Preis.", e: "💷", optionen: ["How much is it?", "How old is it?", "Where is it?"] },
        { frage: "It's five pounds.", de: "Er kostet fünf Pfund.", kontext: "Du hast nur zwei Pfund.", e: "🪙", optionen: ["Oh, sorry. I haven't got five pounds.", "Here you are, five pounds.", "Happy New Year!"] },
        { frage: "Never mind! This small kite is two pounds.", de: "Macht nichts! Dieser kleine Drachen kostet zwei Pfund.", kontext: "Du kaufst den kleinen Drachen und verabschiedest dich.", e: "🛍️",
          optionen: ["Great! Here you are. Thank you, goodbye!", "Can I help you?", "Good night, kite!"] }] },
      { typ: "hoergeschichte", wer: "fipsi", titel: "Mia's wish list", e: "📝", saetze: ["Mia has got a wish list.", "She would like a teddy and a ball.", "The teddy is ten pounds.", "The ball is three pounds."],
        de: "Mia hat eine Wunschliste. Sie hätte gern einen Teddy und einen Ball. Der Teddy kostet zehn Pfund. Der Ball kostet drei Pfund.", ru: RU_G,
        fragen: [
          { frage: "What would Mia like?", de: "Was hätte Mia gern?", optionen: ["🧸", "🪆", "🪁"], antwort: "A teddy and a ball.", ru: "Что хотела бы Мия?", punkte: ["sn.en4.sh.02"] },
          { frage: "How much is the ball?", de: "Wie viel kostet der Ball?", optionen: ["3️⃣", "🔟", "5️⃣"], antwort: "The ball is three pounds.", ru: "Сколько стоит мяч?", punkte: ["sn.en4.sh.02"] }] }],
    "en-school": [
      { typ: "dialog", wer: "robo", e: "✏️", kontext: "Robo braucht einen Bleistift. Du hast einen.", frage: "Have you got a pencil?", de: "Hast du einen Bleistift?",
        optionen: ["Yes, I have. Here you are.", "Yes, I am a pencil.", "No, it's my birthday."], ru: "Робо нужен карандаш. У тебя он есть. " + RU_D, punkte: ["sn.en3.sc.03"] },
      { typ: "dialog", wer: "fipsi", e: "📏", kontext: "Fipsi hat ein Lineal gefunden. Es ist deins.", frage: "Is this your ruler?", de: "Ist das dein Lineal?",
        optionen: ["Yes, this is my ruler. Thank you!", "Yes, this is my teacher.", "No, I haven't got a dog."], ru: "Фипси нашёл линейку. Это твоя. " + RU_D, punkte: ["sn.en3.sc.03"] }],
    "en-subjects": [
      { typ: "hoergeschichte", wer: "papagei", titel: "Amy's school", e: "🏫", saetze: ["This is Amy. She goes to school in England.", "All children at her school wear a school uniform.", "Amy's school jumper is red.", "School starts at nine o'clock.", "At three o'clock, school is over."],
        de: "Das ist Amy. Sie geht in England zur Schule. Alle Kinder an ihrer Schule tragen eine Schuluniform. Amys Schulpullover ist rot. Die Schule beginnt um neun Uhr. Um drei Uhr ist die Schule aus.", ru: RU_G,
        fragen: [
          { frage: "What colour is Amy's school jumper?", de: "Welche Farbe hat Amys Schulpullover?", optionen: ["🔴", "🔵", "🟢"], antwort: "It's red.", ru: "Какого цвета школьный свитер Эми?", punkte: ["sn.en3.sc.01", "sn.en4.sc.03"] },
          { frage: "When does school start?", de: "Wann beginnt die Schule?", optionen: ["🕘", "🕗", "🕐"], antwort: "At nine o'clock.", ru: "Когда начинаются уроки?", punkte: ["sn.en3.sc.01", "sn.en4.sc.02"] },
          { frage: "When is school over?", de: "Wann ist die Schule aus?", optionen: ["🕒", "🕐", "🕘"], antwort: "At three o'clock.", ru: "Когда заканчиваются уроки?", punkte: ["sn.en4.sc.02", "sn.en4.sc.03"] }] },
      { typ: "dialog", wer: "papagei", e: "👕", kontext: "An deiner Schule tragen die Kinder keine Schuluniform.", frage: "Do you wear a school uniform?", de: "Trägst du eine Schuluniform?",
        optionen: ["No, I don't. We wear our own clothes.", "Yes, I'm a uniform.", "No, it's nine o'clock."], warum: "In England tragen viele Kinder eine Schuluniform, in Deutschland meist nicht.", ru: "В твоей школе дети не носят форму. " + RU_D, punkte: ["sn.en3.sc.01", "sn.en4.sc.03"] },
      { typ: "dialog", wer: "tilda", e: "📅", kontext: "Heute ist Montag.", frage: "What day is it today?", de: "Welcher Tag ist heute?",
        optionen: ["It's Monday.", "It's Sunday.", "It's nine o'clock."], ru: "Сегодня понедельник. " + RU_D, punkte: ["sn.en4.sc.01"] },
      { typ: "dialog", wer: "eule", e: "🤸", kontext: "Sport ist dein Lieblingsfach.", frage: "What's your favourite subject?", de: "Was ist dein Lieblingsfach?",
        optionen: ["My favourite subject is PE.", "My favourite subject is Monday.", "My favourite colour is PE."], warum: "PE (physical education) = Sport", ru: "Физкультура — твой любимый предмет. " + RU_D, punkte: ["sn.en4.sc.01"] },
      { typ: "dialog", wer: "robo", e: "🕤", kontext: "Die Uhr zeigt halb zehn (9:30).", frage: "Excuse me, what time is it?", de: "Entschuldigung, wie spät ist es?",
        optionen: ["It's nine thirty.", "It's nine o'clock.", "It's thirty nine."], warum: "9:30 = nine thirty – erst die Stunde, dann die Minuten.", ru: "Часы показывают половину десятого (9:30). " + RU_D, punkte: ["sn.en4.sc.02"] }],
    "en-sports": [
      { typ: "dialog", wer: "robo", e: "🏀", kontext: "Du magst Basketball sehr.", frage: "Do you like basketball?", de: "Magst du Basketball?",
        optionen: ["Yes, I do. It's great!", "Yes, I am.", "No, I don't."], warum: "Auf „Do you like …?“ antwortet man „Yes, I do.“ oder „No, I don't.“", ru: "Ты очень любишь баскетбол. " + RU_D, punkte: ["sn.en3.ho.02"] },
      { typ: "dialog", wer: "fipsi", e: "🏑", kontext: "Hockey magst du nicht.", frage: "Do you like hockey?", de: "Magst du Hockey?",
        optionen: ["No, I don't.", "No, I'm not hockey.", "Yes, I do."], ru: "Хоккей тебе не нравится. " + RU_D, punkte: ["sn.en3.ho.02"] }],
    "en-animals": [
      { typ: "dialog", wer: "papagei", e: "🐶", kontext: "Dein Hund ist braun und kann schnell rennen.", frage: "Tell me about your dog!", de: "Erzähl mir von deinem Hund!",
        optionen: ["It's brown. It can run fast.", "It's brown. It can fly.", "It's a brown cat."], ru: "Твоя собака коричневая и быстро бегает. " + RU_D, punkte: ["sn.en3.an.02"] },
      { typ: "hoergeschichte", wer: "biber", titel: "Guess the animal!", e: "❓", saetze: ["I'm an animal on the farm.", "I'm pink.", "I've got four legs and a curly tail.", "I like mud!"],
        de: "Ich bin ein Tier auf dem Bauernhof. Ich bin rosa. Ich habe vier Beine und einen Ringelschwanz. Ich mag Matsch!", ru: "Отгадай животное: послушай загадку (🔊), потом выбери картинку.",
        fragen: [{ frage: "What animal is it?", de: "Welches Tier ist das?", optionen: ["🐷", "🐮", "🐴"], antwort: "It's a pig.", ru: "Что это за животное?", punkte: ["sn.en3.an.02"] }] }],
    "en-zoo": [
      { typ: "hoergeschichte", wer: "tilda", titel: "Animal riddle", e: "❓", saetze: ["It's very tall.", "It's yellow and brown.", "It has got a long neck.", "It eats leaves from the trees."],
        de: "Es ist sehr groß. Es ist gelb und braun. Es hat einen langen Hals. Es frisst Blätter von den Bäumen.", ru: "Отгадай животное: послушай загадку (🔊), потом выбери картинку.",
        fragen: [{ frage: "Which animal is it?", de: "Welches Tier ist das?", optionen: ["🦒", "🦓", "🐘"], antwort: "It's a giraffe.", ru: "Какое это животное?", punkte: ["sn.en4.an.02"] }] },
      { typ: "dialog", wer: "tilda", e: "🐧", kontext: "Du denkst an einen Pinguin. Tilda rät.", frage: "Is your animal big?", de: "Ist dein Tier groß?",
        optionen: ["No, it isn't. It's black and white.", "Yes, it is. It's yellow.", "No, it can fly."], ru: "Ты задумал(а) пингвина. Тильда угадывает. " + RU_D, punkte: ["sn.en4.an.02"] }],
    "en-trip": [
      { typ: "gespraech", wer: "robo", titel: "At the station", ru: "Ролевая игра на вокзале: Робо продаёт билеты. " + RU_D, punkte: ["sn.en3.tr.03", "sn.en4.tr.03"], zuege: [
        { frage: "Hello! Can I help you?", de: "Hallo! Kann ich dir helfen?", kontext: "Du möchtest eine Fahrkarte nach London.", e: "🚆", optionen: ["Yes, please. A ticket to London, please.", "Yes, please. I'm London.", "No, I like trains."] },
        { frage: "Here you are.", de: "Bitte schön.", kontext: "Du fragst, was die Fahrkarte kostet.", e: "🎫", optionen: ["How much is the ticket?", "How old is the ticket?", "Where is the ticket?"] },
        { frage: "It's twelve pounds.", de: "Sie kostet zwölf Pfund.", kontext: "Du bezahlst und bedankst dich.", e: "💷", optionen: ["Here you are. Thank you!", "Twelve, please. Goodbye, ticket!", "Happy birthday!"] }] },
      { typ: "dialog", wer: "baer", e: "🚉", kontext: "Du suchst den Bahnhof. Frag Bruni höflich nach dem Weg.", frage: "Hello! Can I help you?", de: "Hallo! Kann ich dir helfen?",
        optionen: ["Yes, please. Where is the station?", "Where are you, station?", "I'm the station, thank you."], ru: "Ты ищешь вокзал. Вежливо спроси Бруни дорогу. " + RU_D, punkte: ["sn.en3.tr.03"] }],
    "en-london": [
      { typ: "hoergeschichte", wer: "papagei", titel: "The way to the museum", e: "🗺️", saetze: ["Excuse me, where is the museum?", "Go straight on.", "Then turn left.", "The museum is next to the park."],
        de: "Entschuldigung, wo ist das Museum? Geh geradeaus. Dann bieg links ab. Das Museum ist neben dem Park.", ru: "Послушай, как пройти к музею (🔊). Потом будут вопросы.",
        fragen: [
          { frage: "Where do you go first?", de: "Wohin gehst du zuerst?", optionen: ["⬆️", "⬅️", "➡️"], antwort: "Go straight on.", ru: "Куда ты идёшь сначала?" },
          { frage: "Then where do you turn?", de: "Wohin biegst du dann ab?", optionen: ["⬅️", "➡️", "⬆️"], antwort: "Turn left.", ru: "Куда ты потом поворачиваешь?" },
          { frage: "Where is the museum?", de: "Wo ist das Museum?", optionen: ["🌳", "🏰", "🚉"], antwort: "It's next to the park.", ru: "Где музей?" }] }],
    "en-party": [
      { typ: "dialog", wer: "fipsi", e: "🎂", kontext: "Fipsi hat heute Geburtstag!", frage: "Today is my birthday!", de: "Heute ist mein Geburtstag!",
        optionen: ["Happy birthday, Fipsi! Here's a present for you.", "Merry Christmas, Fipsi!", "Good night, Fipsi!"], ru: "У Фипси сегодня день рождения! " + RU_D, punkte: ["sn.en3.yr.03"] },
      { typ: "dialog", wer: "papagei", e: "🎄", kontext: "Paula wünscht dir frohe Weihnachten.", frage: "Merry Christmas, {name}!", de: "Frohe Weihnachten!",
        optionen: ["Merry Christmas to you, too!", "Happy Easter to you, too!", "Happy birthday, Paula!"], ru: "Паула поздравляет тебя с Рождеством. " + RU_D, punkte: ["sn.en3.yr.03"] }],
    "en-numbers2": [
      { typ: "nachsprechen", satz: "thirteen – thirty", de: "dreizehn – dreißig", e: "🔢", tipp: "Bei „thirTEEN“ ist das Ende laut und lang, bei „THIRty“ der Anfang.", ru: "Послушай, скажи сам(а) и сравни: в «thirteen» ударение в конце, в «thirty» — в начале." }]
  };
  (window.ENGLISCH || []).forEach(l => { if (SPRECHEN[l.id]) l.extra = (l.extra || []).concat(SPRECHEN[l.id]); });

  // Gespräche und Hörgeschichten werden zu einzelnen Schritten (englisch.js baut damit die Lektion, tests/lehrplan.js zählt danach)
  function flach(extra) {
    const aus = [];
    (extra || []).forEach(s => {
      if (s.typ === "gespraech") s.zuege.forEach((z, i) => aus.push(Object.assign({ typ: "dialog", wer: s.wer, ru: s.ru, punkte: s.punkte, gespraech: s.titel,
        verlauf: s.zuege.slice(0, i).map(v => [v.frage, v.optionen[0]]) }, z)));
      else if (s.typ === "hoergeschichte") {
        aus.push({ typ: "hg", g: s, ru: s.ru });
        s.fragen.forEach((f, i) => aus.push({ typ: "hg-frage", g: s, f, nr: i, ru: f.ru, punkte: f.punkte }));
        aus.push({ typ: "hg-text", g: s, ru: "Теперь можно прочитать историю. Нажми 🔊, чтобы послушать ещё раз." });
      } else aus.push(s);
    });
    return aus;
  }
  window.EnglischSchritte = { flach, SPRECHEN };
})();
