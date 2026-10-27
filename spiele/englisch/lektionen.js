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
      { typ: "wahl", frage: "Welche Farbe hat eine Banane?", ru: "Какого цвета банан?", optionen: ["yellow", "blue", "black"], e: "🍌" }],
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
      { typ: "wahl", frage: "Es regnet und du nimmst einen Schirm. Wie ist das Wetter?", ru: "Идёт дождь, и ты берёшь зонтик. Какая погода?", optionen: ["rainy", "sunny", "hot"], e: "☂️" }],
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
