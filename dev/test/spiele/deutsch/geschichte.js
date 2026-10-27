// Die Geschichte von Fipsi und der Schatzkarte.
// Schritte:  sag (Fipsi spricht) | bild | wort | artikel | luecke | satz | hoeren | wo
// Bei Auswahl-Aufgaben ist die ERSTE Option immer die richtige (wird beim Spielen gemischt).
// ru = Russisch-Hilfe. {name} wird durch den Spielernamen ersetzt.
window.GESCHICHTE = [
  {
    id: "wald", lz: ["daz.d0.01"], name: "Im Wald", ort: "🌲", farbe: "#5DB84A", grund: "#E3F5DC",
    schritte: [
      { typ: "sag", text: "Hallo {name}! Ich bin Fipsi, der kleine Fuchs.", ru: "Привет, {name}! Я Фипси, маленький лисёнок." },
      { typ: "sag", text: "Oh nein! Der Wind hat meine Schatzkarte weggeweht. Hilfst du mir, die fünf Teile zu finden?", ru: "О нет! Ветер унёс мою карту сокровищ. Ты поможешь мне найти пять частей?" },
      { typ: "sag", text: "Wir sind im Wald. Hier wohnen viele Tiere.", ru: "Мы в лесу. Здесь живёт много животных." },
      { typ: "bild", frage: "Wo ist das Eichhörnchen?", ru: "Где белка?",
        optionen: [{ e: "🐿️", t: "das Eichhörnchen" }, { e: "🦉", t: "die Eule" }, { e: "🦔", t: "der Igel" }] },
      { typ: "bild", frage: "Wo ist der Igel?", ru: "Где ёж?",
        optionen: [{ e: "🦔", t: "der Igel" }, { e: "🐻", t: "der Bär" }, { e: "🐿️", t: "das Eichhörnchen" }] },
      { typ: "sag", text: "Auf Deutsch hat jedes Ding ein kleines Wort davor: der, die oder das. Der Igel, die Eule, das Reh.", ru: "В немецком перед каждым словом стоит маленькое слово: der, die или das. Der Igel (ёж), die Eule (сова), das Reh (косуля)." },
      { typ: "artikel", e: "🦉", wort: "Eule", richtig: "die", ru: "сова" },
      { typ: "artikel", e: "🦔", wort: "Igel", richtig: "der", ru: "ёж" },
      { typ: "artikel", e: "🌳", wort: "Baum", richtig: "der", ru: "дерево" },
      { typ: "luecke", e: "🍄", satz: "Der Pilz ist ___.", optionen: ["rot", "blau", "grün"], ru: "Гриб красный." },
      { typ: "wort", e: "🦊", frage: "Wer bin ich?", optionen: ["der Fuchs", "der Hund", "die Katze"], ru: "Кто я?" },
      { typ: "satz", e: "🦊", woerter: ["Der", "Fuchs", "ist", "rot."], ru: "Лиса рыжая." },
      { typ: "sag", text: "Super! Schau mal, unter dem Baum liegt etwas. Das erste Kartenteil!", ru: "Супер! Смотри, под деревом что-то лежит. Первая часть карты!" }
    ]
  },
  {
    id: "hof", lz: ["de.su.05"], name: "Auf dem Bauernhof", ort: "🐄", farbe: "#E8A33D", grund: "#FFF1D9",
    schritte: [
      { typ: "sag", text: "Das nächste Teil ist auf dem Bauernhof. Komm mit!", ru: "Следующая часть на ферме. Пойдём!" },
      { typ: "hoeren", sag: "Die Kuh macht Muh.", ru: "Корова говорит «му».",
        optionen: [{ e: "🐄", t: "die Kuh" }, { e: "🐷", t: "das Schwein" }, { e: "🐔", t: "das Huhn" }] },
      { typ: "hoeren", sag: "Das Huhn legt ein Ei.", ru: "Курица несёт яйцо.",
        optionen: [{ e: "🐔", t: "das Huhn" }, { e: "🐴", t: "das Pferd" }, { e: "🐑", t: "das Schaf" }] },
      { typ: "artikel", e: "🐷", wort: "Schwein", richtig: "das", ru: "свинья" },
      { typ: "artikel", e: "🐴", wort: "Pferd", richtig: "das", ru: "лошадь" },
      { typ: "artikel", e: "🐄", wort: "Kuh", richtig: "die", ru: "корова" },
      { typ: "sag", text: "Ein Schaf, zwei Schafe. Wenn es mehr sind, verändert sich das Wort ein bisschen.", ru: "Одна овца, две овцы. Когда их больше, слово немного меняется." },
      { typ: "luecke", e: "🐑🐑🐑", satz: "Drei ___", optionen: ["Schafe", "Schaf", "Schafen"], ru: "Три овцы" },
      { typ: "luecke", e: "🐔🐔", satz: "Zwei ___", optionen: ["Hühner", "Huhn", "Huhns"], ru: "Две курицы" },
      { typ: "luecke", e: "🐴", satz: "Das Pferd ___ schnell.", optionen: ["läuft", "laufen", "laufe"], ru: "Лошадь бегает быстро." },
      { typ: "satz", e: "🐱🥛", woerter: ["Die", "Katze", "trinkt", "Milch."], ru: "Кошка пьёт молоко." },
      { typ: "sag", text: "Im Heu glitzert etwas! Das zweite Kartenteil!", ru: "В сене что-то блестит! Вторая часть карты!" }
    ]
  },
  {
    id: "baeckerei", lz: ["de.sz.03", "daz.d0.02"], name: "In der Bäckerei", ort: "🥨", farbe: "#C2337A", grund: "#FFE8F1",
    schritte: [
      { typ: "sag", text: "Jetzt gehen wir in die Stadt. Ich habe Hunger!", ru: "Теперь мы идём в город. Я голоден!" },
      { typ: "bild", frage: "Wo ist das Brot?", ru: "Где хлеб?",
        optionen: [{ e: "🍞", t: "das Brot" }, { e: "🥨", t: "die Brezel" }, { e: "🍰", t: "der Kuchen" }] },
      { typ: "bild", frage: "Wo ist die Brezel?", ru: "Где брецель?",
        optionen: [{ e: "🥨", t: "die Brezel" }, { e: "🥐", t: "das Croissant" }, { e: "🍞", t: "das Brot" }] },
      { typ: "artikel", e: "🍰", wort: "Kuchen", richtig: "der", ru: "торт" },
      { typ: "artikel", e: "🍎", wort: "Apfel", richtig: "der", ru: "яблоко" },
      { typ: "artikel", e: "🍌", wort: "Banane", richtig: "die", ru: "банан" },
      { typ: "sag", text: "Beim Einkaufen sagt man: Ich möchte …, bitte.", ru: "Когда что-то покупают, говорят: Ich möchte …, bitte. (Я бы хотела …, пожалуйста.)" },
      { typ: "luecke", e: "🥨", satz: "Ich ___ eine Brezel, bitte.", optionen: ["möchte", "möchten", "möchtest"], ru: "Я бы хотела брецель, пожалуйста." },
      { typ: "luecke", e: "💶", satz: "Das kostet zwei Euro. Hier, ___!", optionen: ["bitte", "hallo", "tschüss"], ru: "Это стоит два евро. Вот, пожалуйста!" },
      { typ: "luecke", e: "😊", satz: "Vielen ___!", optionen: ["Dank", "Danke", "Danken"], ru: "Большое спасибо!" },
      { typ: "hoeren", sag: "Ich esse einen Apfel.", ru: "Я ем яблоко.",
        optionen: [{ e: "🍎", t: "der Apfel" }, { e: "🍌", t: "die Banane" }, { e: "🥕", t: "die Karotte" }] },
      { typ: "satz", e: "🍞", woerter: ["Ich", "möchte", "ein", "Brot."], ru: "Я бы хотела хлеб." },
      { typ: "sag", text: "Die Bäckerin lächelt und gibt dir etwas: das dritte Kartenteil!", ru: "Пекарь улыбается и даёт тебе что-то: третья часть карты!" }
    ]
  },
  {
    id: "strand", lz: ["de.su.07"], name: "Am Strand", ort: "🏖️", farbe: "#3AA0E0", grund: "#E1F3FF",
    schritte: [
      { typ: "sag", text: "Wir fahren ans Meer. Die Sonne scheint!", ru: "Мы едем к морю. Светит солнце!" },
      { typ: "sag", text: "Am Strand stehen ein Tisch und eine Kiste. Wo sind die Sachen? Auf, unter, neben oder in?", ru: "На пляже стоят стол и ящик. Где вещи? На, под, рядом или в?" },
      { typ: "wo", ding: "🦀", lage: "auf", ding2: "tisch", satz: "Der Krebs ist ___ dem Tisch.", optionen: ["auf", "unter", "neben"], ru: "Краб на столе." },
      { typ: "wo", ding: "🐚", lage: "unter", ding2: "tisch", satz: "Die Muschel ist ___ dem Tisch.", optionen: ["unter", "auf", "neben"], ru: "Ракушка под столом." },
      { typ: "wo", ding: "⚽", lage: "neben", ding2: "tisch", satz: "Der Ball ist ___ dem Tisch.", optionen: ["neben", "unter", "auf"], ru: "Мяч рядом со столом." },
      { typ: "wo", ding: "🐟", lage: "in", ding2: "kiste", satz: "Der Fisch ist ___ der Kiste.", optionen: ["in", "unter", "neben"], ru: "Рыба в ящике." },
      { typ: "wort", e: "☀️", frage: "Wie ist das Wetter?", optionen: ["Die Sonne scheint.", "Es regnet.", "Es schneit."], ru: "Какая погода?" },
      { typ: "wort", e: "🌧️", frage: "Und jetzt?", optionen: ["Es regnet.", "Die Sonne scheint.", "Es ist windig."], ru: "А теперь?" },
      { typ: "luecke", e: "🥵", satz: "Im Sommer ist es ___.", optionen: ["heiß", "kalt", "dunkel"], ru: "Летом жарко." },
      { typ: "satz", e: "🏰", woerter: ["Wir", "bauen", "eine", "Sandburg."], ru: "Мы строим замок из песка." },
      { typ: "sag", text: "In der Sandburg steckt etwas: das vierte Kartenteil!", ru: "В замке из песка что-то есть: четвёртая часть карты!" }
    ]
  },
  {
    id: "schloss", lz: ["et.ge.01"], name: "Im Schloss", ort: "🏰", farbe: "#7B55B8", grund: "#EFE6FF",
    schritte: [
      { typ: "sag", text: "Das letzte Teil ist im Schloss. Pssst, ganz leise!", ru: "Последняя часть в замке. Тсс, совсем тихо!" },
      { typ: "wort", e: "🐘", frage: "Der Elefant ist …", optionen: ["groß", "klein", "leise"], ru: "Слон большой." },
      { typ: "wort", e: "🐭", frage: "Die Maus ist …", optionen: ["klein", "groß", "laut"], ru: "Мышка маленькая." },
      { typ: "luecke", e: "🔥🧊", satz: "Das Gegenteil von heiß ist ___.", optionen: ["kalt", "warm", "nass"], ru: "Противоположность «горячий» — «холодный»." },
      { typ: "luecke", e: "🥁🤫", satz: "Das Gegenteil von laut ist ___.", optionen: ["leise", "groß", "schnell"], ru: "Противоположность «громкий» — «тихий»." },
      { typ: "sag", text: "Im Schloss wohnen viele Leute. Wie fühlen sie sich?", ru: "В замке живёт много людей. Как они себя чувствуют?" },
      { typ: "bild", frage: "Wer ist traurig?", ru: "Кто грустный?",
        optionen: [{ e: "😢", t: "traurig" }, { e: "😄", t: "fröhlich" }, { e: "😠", t: "wütend" }] },
      { typ: "bild", frage: "Wer ist müde?", ru: "Кто устал?",
        optionen: [{ e: "😴", t: "müde" }, { e: "😄", t: "fröhlich" }, { e: "😮", t: "überrascht" }] },
      { typ: "hoeren", sag: "Der König trägt eine Krone.", ru: "Король носит корону.",
        optionen: [{ e: "🤴", t: "der König" }, { e: "👸", t: "die Königin" }, { e: "🧙", t: "der Zauberer" }] },
      { typ: "satz", e: "😊", woerter: ["Ich", "bin", "sehr", "glücklich."], ru: "Я очень счастлива." },
      { typ: "satz", e: "🗺️", woerter: ["Wir", "haben", "die", "Karte", "gefunden."], ru: "Мы нашли карту." },
      { typ: "sag", text: "Du hast alle fünf Teile gefunden! Danke, {name}! Du bist super!", ru: "Ты нашла все пять частей! Спасибо, {name}! Ты супер!" }
    ]
  }
];
