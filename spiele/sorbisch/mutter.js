// Sorbisch als Muttersprache (Obersorbisch, 30.10.2026) – nur nach Eltern-Wahl eltern.sorbisch.art = "mutter".
// Nach dem Lehrplan Grundschule Sorbisch (Sachsen 2004): Lernbereiche Schriftspracherwerb (Kl. 1/2), Sprechen und Zuhören, Schreiben für sich
// und andere, Richtig schreiben, Lesen und Umgang mit Medien, Sprache untersuchen, dazu die Wahlbereiche.
// Anders als die Fremdsprache: Lektionen mit festen Schritten (kein Wortschatz-Training), Aufgaben auf Sorbisch, deutsche Hilfe darunter.
// Lektion: { id: "sm-…", lb (1–7, SORBISCH_MUTTER_LB), stufe (1 = Kl. 1/2, 3, 4), lz, name, e, farbe, grund, mutter: true, schritte }
//   sag       { so?, text (de, wird vorgelesen), ru, letzte? }
//   wahl      { so? (Frage auf Sorbisch), frage (de), ru, optionen: [richtig, …], e?, warum? }
//   textfrage { titel?, text (sorbischer Lesetext), so?, frage (de), ru, optionen: [richtig, …], warum? }
//   satz      { de, ru, woerter: [...], e? }
// PRÜFSTATUS: Alles sind ENTWÜRFE (Prüfliste spiele/sorbisch/pruefen.html). Keine sorbische Stimme: Sorbisch wird gelesen, nicht vorgelesen.
window.SORBISCH_MUTTER_LB = [[1, "✏️ Pismiki a złóžki – Lesen und Schreiben lernen"], [2, "🗣️ Rěčeć a připosłuchać – Sprechen und Zuhören"],
  [3, "✉️ Za sebje a druhich pisać – Schreiben"], [4, "✅ Prawje pisać – Richtig schreiben"], [5, "📖 Čitanje a medije – Lesen und Medien"],
  [6, "🔍 Rěč přepytować – Sprache untersuchen"], [7, "⭐ Wólbnowinowatosće – Wahlbereiche"]];
window.SORBISCH_MUTTER = [
  // ---------- Klasse 1/2 ----------
  {
    id: "sm-pismiki", lb: 1, stufe: 1, lz: ["sm.sp.01"], name: "Pismiki – Sorbische Buchstaben", e: "🔤", farbe: "#C0392B", grund: "#FDECEA", mutter: true,
    schritte: [
      { typ: "sag", so: "Witaj! Serbšćina ma wosebite pismiki: č, ć, dź, ě, ł, ń, ó, ř, š, ž.", text: "Willkommen! Sorbisch hat besondere Buchstaben mit Häkchen und Strichen. Schau genau hin!", ru: "Добро пожаловать! В лужицком есть особые буквы с галочками и чёрточками. Смотри внимательно!" },
      { typ: "wahl", so: "Z kotrym pismikom so započina „čapka“?", frage: "Mit welchem Buchstaben beginnt „čapka“ (Mütze)?", ru: "С какой буквы начинается «čapka» (шапка)?", optionen: ["č", "c", "ć"], e: "🧢", warum: "čapka – mit Häkchen: č." },
      { typ: "wahl", so: "Z kotrym pismikom so započina „šula“?", frage: "Mit welchem Buchstaben beginnt „šula“ (Schule)?", ru: "С какой буквы начинается «šula» (школа)?", optionen: ["š", "s", "ž"], e: "🏫", warum: "šula – mit š." },
      { typ: "wahl", so: "Z kotrym pismikom so započina „žaba“?", frage: "Mit welchem Buchstaben beginnt „žaba“ (Frosch)?", ru: "С какой буквы начинается «žaba» (лягушка)?", optionen: ["ž", "z", "š"], e: "🐸", warum: "žaba – mit ž." },
      { typ: "wahl", so: "Z kotrym pismikom so započina „łódź“?", frage: "Mit welchem Buchstaben beginnt „łódź“ (Boot)?", ru: "С какой буквы начинается «łódź» (лодка)?", optionen: ["ł", "l", "w"], e: "🛶", warum: "łódź – mit dem durchgestrichenen ł." },
      { typ: "wahl", so: "Z kotrym pismikom so započina „dźěći“?", frage: "Womit beginnt „dźěći“ (Kinder)?", ru: "С чего начинается «dźěći» (дети)?", optionen: ["dź", "d", "ć"], e: "🧒", warum: "dźěći – mit dź (zwei Buchstaben, ein Laut)." },
      { typ: "wahl", so: "Z kotrym pismikom so započina „ćěło“?", frage: "Mit welchem Buchstaben beginnt „ćěło“ (Körper)?", ru: "С какой буквы начинается «ćěło» (тело)?", optionen: ["ć", "č", "c"], e: "🧍", warum: "ćěło – mit Strich: ć." },
      { typ: "sag", so: "Jara derje! Pisaj swoje mjeno a pytaj w nim wosebite pismiki.", text: "Sehr gut! Schreib deinen Namen und such darin besondere Buchstaben.", ru: "Очень хорошо! Напиши своё имя и найди в нём особые буквы.", letzte: true }]
  },
  {
    id: "sm-zlozki", lb: 1, stufe: 1, lz: ["sm.sp.01", "sm.le.01"], name: "Złóžki – Silben klatschen", e: "👏", farbe: "#D35400", grund: "#FFF0E3", mutter: true,
    schritte: [
      { typ: "sag", so: "Placaj z nami: kó-čka, ja-błu-ko!", text: "Klatsch mit: Jedes Wort hat Silben. kó-čka hat zwei, ja-błu-ko hat drei.", ru: "Хлопай с нами: в каждом слове есть слоги. kó-čka — два, ja-błu-ko — три." },
      { typ: "wahl", so: "Kak wjele złóžkow ma „šu-la“?", frage: "Wie viele Silben hat „šula“?", ru: "Сколько слогов в слове «šula»?", optionen: ["2", "1", "3"], e: "🏫", warum: "šu-la: zwei Silben." },
      { typ: "wahl", so: "Kak wjele złóžkow ma „ko-le-so“?", frage: "Wie viele Silben hat „koleso“ (Fahrrad)?", ru: "Сколько слогов в слове «koleso» (велосипед)?", optionen: ["3", "2", "4"], e: "🚲", warum: "ko-le-so: drei Silben." },
      { typ: "wahl", so: "Kak wjele złóžkow ma „dom“?", frage: "Wie viele Silben hat „dom“ (Haus)?", ru: "Сколько слогов в слове «dom» (дом)?", optionen: ["1", "2", "3"], e: "🏠", warum: "dom: eine Silbe." },
      { typ: "wahl", so: "Kak wjele złóžkow ma „wje-wjer-čka“?", frage: "Wie viele Silben hat „wjewjerčka“ (Eichhörnchen)?", ru: "Сколько слогов в слове «wjewjerčka» (белка)?", optionen: ["3", "2", "4"], e: "🐿️", warum: "wje-wjer-čka: drei Silben." },
      { typ: "sag", so: "Wulkotnje! Placaj mjena swojeje swójby.", text: "Toll! Klatsch die Namen deiner Familie in Silben.", ru: "Отлично! Прохлопай по слогам имена своей семьи.", letzte: true }]
  },
  {
    id: "sm-slowa", lb: 1, stufe: 1, lz: ["sm.le.01"], name: "Čitam słowa – Wörter lesen", e: "📗", farbe: "#16A085", grund: "#E3F7F2", mutter: true,
    schritte: [
      { typ: "sag", so: "Čitaj słowo a pokaž wobraz!", text: "Lies das Wort und zeig das passende Bild!", ru: "Прочитай слово и покажи подходящую картинку!" },
      { typ: "wahl", so: "kóčka", frage: "Welches Bild passt zu „kóčka“?", ru: "Какая картинка подходит к «kóčka»?", optionen: ["🐱", "🐶", "🐴"], warum: "kóčka = Katze" },
      { typ: "wahl", so: "jabłuko", frage: "Welches Bild passt zu „jabłuko“?", ru: "Какая картинка подходит к «jabłuko»?", optionen: ["🍎", "🍞", "🥛"], warum: "jabłuko = Apfel" },
      { typ: "wahl", so: "słónco", frage: "Welches Bild passt zu „słónco“?", ru: "Какая картинка подходит к «słónco»?", optionen: ["☀️", "🌙", "⭐"], warum: "słónco = Sonne" },
      { typ: "wahl", so: "Mama čita.", frage: "Welches Bild passt zum Satz?", ru: "Какая картинка подходит к предложению?", optionen: ["📖", "🍳", "🚲"], warum: "„Mama čita“ – Mama liest." },
      { typ: "wahl", so: "Pos běži.", frage: "Welches Bild passt zum Satz?", ru: "Какая картинка подходит к предложению?", optionen: ["🐕", "🐟", "🐦"], warum: "„Pos běži“ – der Hund läuft." },
      { typ: "sag", so: "Jara derje! Ty hižo čitaš!", text: "Sehr gut! Du liest schon!", ru: "Очень хорошо! Ты уже читаешь!", letzte: true }]
  },
  {
    id: "sm-zdwoliwy", lb: 2, stufe: 1, lz: ["sm.sz.01"], name: "Strowić, prosyć, dźakować – Höflich sprechen", e: "🙏", farbe: "#8E44AD", grund: "#F3E8FA", mutter: true,
    schritte: [
      { typ: "sag", so: "Strowić, prosyć, so dźakować a so zamołwić – to je zdwórliwe.", text: "Grüßen, bitten, danken, sich entschuldigen: So sind wir höflich zueinander.", ru: "Здороваться, просить, благодарить, извиняться — так мы вежливы друг с другом." },
      { typ: "wahl", frage: "Du hast aus Versehen jemanden angerempelt. Was sagst du?", ru: "Ты нечаянно толкнул кого-то. Что ты скажешь?", optionen: ["Wodaj!", "Dźakuju so!", "Dobru nóc!"], e: "😬", warum: "„Wodaj!“ heißt „Entschuldige!“." },
      { typ: "wahl", frage: "Du bekommst ein Geschenk. Was sagst du?", ru: "Тебе дарят подарок. Что ты скажешь?", optionen: ["Wutrobny dźak!", "Wodaj!", "Božemje!"], e: "🎁", warum: "„Wutrobny dźak!“ heißt „Herzlichen Dank!“." },
      { typ: "wahl", frage: "Im katholischen Teil der Lausitz grüßen sich viele Menschen mit …", ru: "В католической части Лужицы многие здороваются словами …", optionen: ["Pomhaj Bóh!", "Dobru nóc!", "Wjesołe hody!"], e: "⛪", warum: "„Pomhaj Bóh!“ ist ein alter sorbischer Gruß; man antwortet „Zapłać Bóh!“." },
      { typ: "wahl", frage: "Deine Freundin hat Geburtstag. Was wünschst du?", ru: "У подруги день рождения. Что ты пожелаешь?", optionen: ["Wšo najlěpše k narodninam!", "Wodaj!", "Dobre ranje!"], e: "🎂", warum: "„Wšo najlěpše k narodninam!“ heißt „Alles Gute zum Geburtstag!“." },
      { typ: "sag", so: "Wulkotnje! Hraj z swójbu: Štó dźensa najwjace króć „prošu“ a „dźakuju so“ praji?", text: "Toll! Spielt in der Familie: Wer sagt heute am öftesten „bitte“ und „danke“?", ru: "Отлично! Поиграйте в семье: кто сегодня чаще всех скажет «пожалуйста» и «спасибо»?", letzte: true }]
  },
  {
    id: "sm-preprosenje", lb: 3, stufe: 1, lz: ["sm.sc.01"], name: "Přeprošenje – Eine Einladung schreiben", e: "💌", farbe: "#C2185B", grund: "#FCE4EF", mutter: true,
    schritte: [
      { typ: "sag", so: "Ty swjećiš narodniny a chceš přećelow přeprosyć.", text: "Du feierst Geburtstag und willst Freunde einladen. Was muss in der Einladung stehen?", ru: "Ты празднуешь день рождения и хочешь пригласить друзей. Что должно быть в приглашении?" },
      { typ: "wahl", frage: "Was gehört unbedingt in eine Einladung?", ru: "Что обязательно должно быть в приглашении?", optionen: ["Wann und wo gefeiert wird", "Was es zum Abendbrot gab", "Wie das Wetter gestern war"], e: "📝", warum: "Die Gäste müssen wissen: Wann? Wo? Wer lädt ein?" },
      { typ: "satz", de: "Bau den Satz: „Ich lade dich zu meinem Geburtstag ein.“", ru: "Составь предложение: «Приглашаю тебя на мой день рождения».", woerter: ["Přeprošuju", "će", "na", "swoje", "narodniny."], e: "🎈" },
      { typ: "wahl", so: "Kak so list kónči?", frage: "Womit endet die Einladung?", ru: "Чем заканчивается приглашение?", optionen: ["Twoja Mia", "Dobre ranje", "Wodaj"], e: "✍️", warum: "Am Ende steht, wer einlädt: „Twoja Mia“ – deine Mia." },
      { typ: "sag", so: "Jara derje! Napisaj přeprošenje na papjeru a wumoluj je.", text: "Sehr gut! Schreib eine Einladung auf Papier und mal sie bunt an.", ru: "Очень хорошо! Напиши приглашение на бумаге и раскрась его.", letzte: true }]
  },
  {
    id: "sm-wulke1", lb: 4, stufe: 1, lz: ["sm.rs.01"], name: "Wulki pismik a dypk – Satzanfang und Punkt", e: "🔠", farbe: "#B7950B", grund: "#FCF6DC", mutter: true,
    schritte: [
      { typ: "sag", so: "Sada so započina z wulkim pismikom a kónči so z dypkom.", text: "Ein Satz beginnt mit einem großen Buchstaben und endet mit einem Punkt. Auch Namen schreibt man groß.", ru: "Предложение начинается с большой буквы и кончается точкой. Имена тоже пишут с большой буквы." },
      { typ: "wahl", frage: "Welcher Satz ist richtig geschrieben?", ru: "Какое предложение написано правильно?", optionen: ["Mama čita knihu.", "mama čita knihu.", "Mama čita knihu"], e: "📖", warum: "Großer Anfang, Punkt am Ende." },
      { typ: "wahl", frage: "Welcher Satz ist richtig geschrieben?", ru: "Какое предложение написано правильно?", optionen: ["Pawoł hraje kopańcu.", "pawoł hraje kopańcu.", "Pawoł Hraje Kopańcu."], e: "⚽", warum: "Der Name „Pawoł“ und der Satzanfang groß – sonst klein." },
      { typ: "wahl", frage: "Welches Zeichen gehört an das Ende einer Frage: „Hdźe je kóčka …“?", ru: "Какой знак ставят в конце вопроса: «Hdźe je kóčka …»?", optionen: ["?", ".", "!"], e: "❓", warum: "Am Ende einer Frage steht ein Fragezeichen." },
      { typ: "sag", so: "Wulkotnje! Pruwuj swoje sady: wulki započatk, dypk na kóncu.", text: "Toll! Prüf deine Sätze: großer Anfang, Punkt am Ende.", ru: "Отлично! Проверяй свои предложения: большая буква в начале, точка в конце.", letzte: true }]
  },
  {
    id: "sm-mica", lb: 5, stufe: 1, lz: ["sm.le.01"], name: "Mica – Ein kleiner Lesetext", e: "🐈‍⬛", farbe: "#2471A3", grund: "#E6F1FA", mutter: true,
    schritte: [
      { typ: "sag", so: "Čitaj tekst a wotmołw na prašenja.", text: "Lies den Text und beantworte die Fragen. Du kannst den Text immer wieder lesen.", ru: "Прочитай текст и ответь на вопросы. Текст можно перечитывать." },
      { typ: "textfrage", titel: "Mica", text: "Mica je mała kóčka. Wona je čorna a ma běłe łapki. Mica rady spi na łožu. Rano pije mloko.", so: "Kajka je Mica?", frage: "Welche Farbe hat Mica?", ru: "Какого цвета Мица?", optionen: ["čorna", "běła", "bruna"], warum: "„Wona je čorna“ – sie ist schwarz." },
      { typ: "textfrage", titel: "Mica", text: "Mica je mała kóčka. Wona je čorna a ma běłe łapki. Mica rady spi na łožu. Rano pije mloko.", so: "Hdźe Mica rady spi?", frage: "Wo schläft Mica gern?", ru: "Где Мица любит спать?", optionen: ["na łožu", "na blidźe", "w kuchni"], warum: "„Mica rady spi na łožu“ – auf dem Bett." },
      { typ: "textfrage", titel: "Mica", text: "Mica je mała kóčka. Wona je čorna a ma běłe łapki. Mica rady spi na łožu. Rano pije mloko.", so: "Što Mica rano pije?", frage: "Was trinkt Mica am Morgen?", ru: "Что Мица пьёт утром?", optionen: ["mloko", "wodu", "čaj"], warum: "„Rano pije mloko“ – Milch." },
      { typ: "sag", so: "Jara derje! Moluj Micu.", text: "Sehr gut! Mal Mica, wie sie auf dem Bett schläft.", ru: "Очень хорошо! Нарисуй Мицу, как она спит на кровати.", letzte: true }]
  },
  {
    id: "sm-bajki", lb: 7, stufe: 1, lz: ["sm.ku.01"], name: "Bajki a powěsće – Märchen und Sagengestalten", e: "🧚", farbe: "#4A235A", grund: "#F0E6F5", mutter: true,
    schritte: [
      { typ: "sag", so: "Serbja maja wjele bajkow a powěsćow: wo wódnym mužu, připołdnicy a lutkach.", text: "Die Sorben erzählen viele Märchen und Sagen: vom Wassermann im Teich, von der Mittagsfrau auf dem Feld und von den Lutki, kleinen Leuten unter der Erde.", ru: "Лужичане рассказывают много сказок и преданий: о водяном в пруду, о полуднице в поле и о лютках — маленьком народце под землёй." },
      { typ: "wahl", so: "Štó bydli we wodźe?", frage: "Wer wohnt im Wasser?", ru: "Кто живёт в воде?", optionen: ["wódny muž", "připołdnica", "lutki"], e: "🌊", warum: "Der Wassermann – „wódny muž“ – wohnt im Teich." },
      { typ: "wahl", so: "Štó chodźi připołdnju po polu?", frage: "Wer geht mittags über das Feld?", ru: "Кто ходит в полдень по полю?", optionen: ["připołdnica", "wódny muž", "Kašpork"], e: "🌾", warum: "Die Mittagsfrau – „připołdnica“." },
      { typ: "wahl", frage: "Im Kasperletheater spielt eine lustige Figur mit Zipfelmütze. Wie heißt der Kasper auf Sorbisch?", ru: "В кукольном театре играет весёлый персонаж в колпаке. Как по-лужицки Касперле?", optionen: ["Kašpork", "Krabat", "Mica"], e: "🎭", warum: "Der Kasper heißt „Kašpork“." },
      { typ: "sag", so: "Wulkotnje! Hraj z łopješkami abo z pupkami małe dźiwadło.", text: "Toll! Spiel mit Handpuppen oder Kuscheltieren ein kleines Theaterstück.", ru: "Отлично! Сыграй с куклами или мягкими игрушками маленький спектакль.", letzte: true }]
  },

  // ---------- Klasse 3 ----------
  {
    id: "sm-rozmolwa", lb: 2, stufe: 3, lz: ["sm.sz.01"], name: "Rozmołwne prawidła – Gesprächsregeln", e: "💬", farbe: "#AF7AC5", grund: "#F5EEF8", mutter: true,
    schritte: [
      { typ: "sag", so: "W rozmołwje so słowa jimamy, druhim připosłuchamy a damy jim wurěčeć.", text: "Im Gespräch melden wir uns, hören zu, schauen den anderen an und lassen ihn ausreden.", ru: "В разговоре мы поднимаем руку, слушаем, смотрим на собеседника и даём ему договорить." },
      { typ: "wahl", frage: "Ein anderes Kind erzählt noch. Was machst du?", ru: "Другой ребёнок ещё рассказывает. Что ты делаешь?", optionen: ["Dam jemu wurěčeć.", "Skočim jemu do rěče.", "Hladam z wokna."], e: "👂", warum: "„Dam jemu wurěčeć“ – ich lasse ihn ausreden." },
      { typ: "wahl", frage: "Du willst im Kreis etwas sagen. Was machst du?", ru: "Ты хочешь что-то сказать в кругу. Что ты делаешь?", optionen: ["So słowa jimam.", "Wołam najhłośišo.", "Mjelču cyły dźeń."], e: "✋", warum: "„So słowa jimam“ – ich melde mich." },
      { typ: "wahl", frage: "Du hast etwas nicht verstanden. Was sagst du?", ru: "Ты что-то не понял. Что ты скажешь?", optionen: ["Móžeš to hišće raz prajić?", "To je dołhowčasne.", "Božemje!"], e: "🤔", warum: "Nachfragen ist gut: „Kannst du das noch einmal sagen?“" },
      { typ: "sag", so: "Jara derje! Wumolujće swoje rozmołwne prawidła na plakat.", text: "Sehr gut! Malt eure Gesprächsregeln auf ein Plakat.", ru: "Очень хорошо! Нарисуйте свои правила разговора на плакате.", letzte: true }]
  },
  {
    id: "sm-stawizna", lb: 3, stufe: 3, lz: ["sm.sc.01"], name: "Prěnje, potom, skónčnje – Eine Geschichte ordnen", e: "📚", farbe: "#CB4335", grund: "#FBE9E7", mutter: true,
    schritte: [
      { typ: "sag", so: "Stawizna ma započatk, srjedź a kónc. Słowa „prěnje“, „potom“ a „skónčnje“ pomhaja.", text: "Eine Geschichte hat Anfang, Mitte und Schluss. Wörter wie „zuerst“, „dann“ und „zum Schluss“ helfen.", ru: "У истории есть начало, середина и конец. Помогают слова «сначала», «потом» и «наконец»." },
      { typ: "satz", de: "Ordne den Morgen: aufstehen, waschen, frühstücken, zur Schule gehen.", ru: "Упорядочи утро: встать, умыться, позавтракать, пойти в школу.", woerter: ["Stanu.", "Myju so.", "Snědam.", "Du do šule."], e: "🌅" },
      { typ: "wahl", frage: "Mit welchem Wort beginnt der Schluss einer Geschichte?", ru: "Каким словом начинается конец истории?", optionen: ["skónčnje", "prěnje", "potom"], e: "🏁", warum: "„skónčnje“ heißt „zum Schluss / endlich“." },
      { typ: "wahl", frage: "Was macht eine Geschichte spannend?", ru: "Что делает историю интересной?", optionen: ["Eine Überraschung in der Mitte", "Immer derselbe Satz", "Gar kein Ende"], e: "😮", warum: "In der Mitte passiert etwas Überraschendes – das ist der Höhepunkt." },
      { typ: "sag", so: "Wulkotnje! Napisaj stawiznu z prěnje – potom – skónčnje.", text: "Toll! Schreib eine eigene kleine Geschichte mit zuerst – dann – zum Schluss.", ru: "Отлично! Напиши свою маленькую историю: сначала — потом — наконец.", letzte: true }]
  },
  {
    id: "sm-zwuki", lb: 4, stufe: 3, lz: ["sm.rs.01"], name: "Dub abo dup? – Wörter verlängern", e: "🌳", farbe: "#1E8449", grund: "#E5F5EA", mutter: true,
    schritte: [
      { typ: "sag", so: "Na kóncu słowa słyšimy [p], ale pisamy „b“: dub – duby. Podlěš słowo!", text: "Am Wortende hört man oft p, t, s, š – geschrieben wird vielleicht b, d, z, ž. Verlängere das Wort: dub – duby, dann hörst du es.", ru: "В конце слова слышно p, t, s, š — а пишется, может быть, b, d, z, ž. Удлини слово: dub — duby, и услышишь." },
      { typ: "wahl", so: "Słyšiš [zup]. Kak so piše?", frage: "Du hörst [zup] (Zahn). Wie schreibt man es? Tipp: zuby", ru: "Слышишь [zup] (зуб). Как пишется? Подсказка: zuby", optionen: ["zub", "zup"], e: "🦷", warum: "zuby → zub mit b." },
      { typ: "wahl", so: "Słyšiš [hrót]. Kak so piše?", frage: "Du hörst [hrót] (Burg). Tipp: hrody", ru: "Слышишь [hrót] (замок). Подсказка: hrody", optionen: ["hród", "hrót"], e: "🏰", warum: "hrody → hród mit d." },
      { typ: "wahl", so: "Słyšiš [wós]. Kak so piše?", frage: "Du hörst [wós] (Wagen). Tipp: wozy", ru: "Слышишь [wós] (повозка). Подсказка: wozy", optionen: ["wóz", "wós"], e: "🛒", warum: "wozy → wóz mit z." },
      { typ: "wahl", so: "Słyšiš [nóš]. Kak so piše?", frage: "Du hörst [nóš] (Messer). Tipp: nože", ru: "Слышишь [nóš] (нож). Подсказка: nože", optionen: ["nóž", "nóš"], e: "🔪", warum: "nože → nóž mit ž." },
      { typ: "sag", so: "Jara derje! Hdyž njewěš, podlěš słowo.", text: "Sehr gut! Wenn du unsicher bist: Verlängere das Wort.", ru: "Очень хорошо! Если не уверен — удлини слово.", letzte: true }]
  },
  {
    id: "sm-cc", lb: 4, stufe: 3, lz: ["sm.rs.01"], name: "č abo ć? ł abo w? – Ähnliche Laute", e: "🔎", farbe: "#B9770E", grund: "#FDF2E0", mutter: true,
    schritte: [
      { typ: "sag", so: "Někotre zwuki klinča podobnje: č a ć, ł a w. Tu pomha jenož wuknyć a w słowniku pytać.", text: "Manche Laute klingen ähnlich: č und ć, ł und w. Hier hilft nur üben und im Wörterbuch nachschauen.", ru: "Некоторые звуки звучат похоже: č и ć, ł и w. Тут помогает только тренировка и словарь." },
      { typ: "wahl", frage: "Wie schreibt man „Mütze“?", ru: "Как пишется «шапка»?", optionen: ["čapka", "ćapka"], e: "🧢", warum: "čapka mit č." },
      { typ: "wahl", frage: "Wie schreibt man „Körper“?", ru: "Как пишется «тело»?", optionen: ["ćěło", "čěło"], e: "🧍", warum: "ćěło mit ć." },
      { typ: "wahl", frage: "Wie schreibt man „Boot“?", ru: "Как пишется «лодка»?", optionen: ["łódź", "wódź"], e: "🛶", warum: "łódź mit ł." },
      { typ: "wahl", frage: "Wie schreibt man „Fenster“?", ru: "Как пишется «окно»?", optionen: ["wokno", "łokno"], e: "🪟", warum: "wokno mit w." },
      { typ: "sag", so: "Wulkotnje! Zestaj sej słowny kartaj z ćežkimi słowami.", text: "Toll! Leg dir eine Wörterkartei mit deinen schwierigen Wörtern an.", ru: "Отлично! Заведи картотеку с трудными словами.", letzte: true }]
  },
  {
    id: "sm-ptaci", lb: 5, stufe: 3, lz: ["sm.le.01", "sm.ku.01"], name: "Ptači kwas – Lesen und verstehen", e: "🐦", farbe: "#2E86C1", grund: "#E4F1FB", mutter: true,
    schritte: [
      { typ: "sag", so: "Čitaj tekst wo ptačim kwasu.", text: "Lies den Text über die Vogelhochzeit und beantworte die Fragen.", ru: "Прочитай текст о птичьей свадьбе и ответь на вопросы." },
      { typ: "textfrage", titel: "Ptači kwas", text: "Dnja 25. januara swjeća Serbja ptači kwas. Wječor do toho staja dźěći talerik na wokno. Rano su na nim słódkosće: ptački su je přinjesli. W pěstowarni maja dźěći drasty kaž kwasarjo: njewjesta, nawoženja a hosćo.", so: "Hdy je ptači kwas?", frage: "Wann ist Vogelhochzeit?", ru: "Когда птичья свадьба?", optionen: ["25. januara", "24. decembra", "1. meje"], warum: "Am 25. Januar." },
      { typ: "textfrage", titel: "Ptači kwas", text: "Dnja 25. januara swjeća Serbja ptači kwas. Wječor do toho staja dźěći talerik na wokno. Rano su na nim słódkosće: ptački su je přinjesli. W pěstowarni maja dźěći drasty kaž kwasarjo: njewjesta, nawoženja a hosćo.", so: "Što staja dźěći na wokno?", frage: "Was stellen die Kinder ans Fenster?", ru: "Что дети ставят на окно?", optionen: ["talerik", "črije", "swěčku"], warum: "Einen Teller – „talerik“." },
      { typ: "textfrage", titel: "Ptači kwas", text: "Dnja 25. januara swjeća Serbja ptači kwas. Wječor do toho staja dźěći talerik na wokno. Rano su na nim słódkosće: ptački su je přinjesli. W pěstowarni maja dźěći drasty kaž kwasarjo: njewjesta, nawoženja a hosćo.", so: "Štó je słódkosće přinjesł?", frage: "Wer hat die Süßigkeiten gebracht?", ru: "Кто принёс сладости?", optionen: ["ptački", "dźěd", "wučerka"], warum: "Die Vögel – „ptački“." },
      { typ: "sag", so: "Jara derje! Powědaj swojej swójbje, što sy wo ptačim kwasu čitał(a).", text: "Sehr gut! Erzähl deiner Familie mit eigenen Worten, was du über die Vogelhochzeit gelesen hast.", ru: "Очень хорошо! Перескажи семье своими словами, что ты прочитал о птичьей свадьбе.", letzte: true }]
  },
  {
    id: "sm-druziny", lb: 6, stufe: 3, lz: ["sm.su.01"], name: "Słowne družiny – Wortarten", e: "🏷️", farbe: "#34495E", grund: "#EAEEF2", mutter: true,
    schritte: [
      { typ: "sag", so: "Substantiw mjenuje wěc, werb praji, što so stawa, adjektiw praji, kajke něšto je.", text: "Ein Substantiv nennt ein Ding oder Lebewesen, ein Verb sagt, was jemand tut, ein Adjektiv sagt, wie etwas ist. Wichtig: Im Sorbischen schreibt man Substantive klein!", ru: "Существительное называет предмет, глагол говорит о действии, прилагательное — какой предмет. Важно: в лужицком существительные пишутся с маленькой буквы!" },
      { typ: "wahl", so: "Kotra słowna družina je „kóčka“?", frage: "Welche Wortart ist „kóčka“?", ru: "Какая часть речи «kóčka»?", optionen: ["substantiw", "werb", "adjektiw"], e: "🐱", warum: "kóčka ist ein Tier – ein Substantiv." },
      { typ: "wahl", so: "Kotra słowna družina je „běži“?", frage: "Welche Wortart ist „běži“ (läuft)?", ru: "Какая часть речи «běži» (бежит)?", optionen: ["werb", "substantiw", "adjektiw"], e: "🏃", warum: "běži sagt, was jemand tut – ein Verb." },
      { typ: "wahl", so: "Kotra słowna družina je „wulki“?", frage: "Welche Wortart ist „wulki“ (groß)?", ru: "Какая часть речи «wulki» (большой)?", optionen: ["adjektiw", "werb", "substantiw"], e: "🐘", warum: "wulki sagt, wie etwas ist – ein Adjektiv." },
      { typ: "wahl", frage: "Wie schreibt man „Katze“ mitten im sorbischen Satz?", ru: "Как пишется «кошка» в середине лужицкого предложения?", optionen: ["kóčka", "Kóčka"], e: "✏️", warum: "Anders als im Deutschen: Sorbische Substantive schreibt man klein." },
      { typ: "sag", so: "Wulkotnje! Pytaj w swojej knize tři substantiwy, tři werby a tři adjektiwy.", text: "Toll! Such in deinem Buch drei Substantive, drei Verben und drei Adjektive.", ru: "Отлично! Найди в своей книге три существительных, три глагола и три прилагательных.", letzte: true }]
  },
  {
    id: "sm-dual", lb: 6, stufe: 3, lz: ["sm.su.01"], name: "Dwě ruce – Der Dual", e: "✌️", farbe: "#117A65", grund: "#E3F4EF", mutter: true,
    schritte: [
      { typ: "sag", so: "Serbšćina ma za dwě wěcy swójsku formu: dual. Jedna ruka – dwě ruce – tři ruki.", text: "Sorbisch hat eine besondere Form für genau zwei Dinge: den Dual. Das gibt es im Deutschen nicht!", ru: "В лужицком есть особая форма для двух предметов — двойственное число. В немецком такого нет!" },
      { typ: "wahl", so: "jedna noha – dwě …", frage: "ein Bein – zwei …", ru: "одна нога — две …", optionen: ["nozy", "nohi", "noha"], e: "🦵", warum: "dwě nozy – Dual." },
      { typ: "wahl", so: "jedna kóčka – dwě …", frage: "eine Katze – zwei …", ru: "одна кошка — две …", optionen: ["kóčce", "kóčki", "kóčka"], e: "🐈", warum: "dwě kóčce – Dual." },
      { typ: "wahl", so: "jedyn bratr – dwaj …", frage: "ein Bruder – zwei …", ru: "один брат — два …", optionen: ["bratraj", "bratřa", "bratr"], e: "👬", warum: "dwaj bratraj – Dual." },
      { typ: "wahl", so: "jedna kniha – dwě …", frage: "ein Buch – zwei …", ru: "одна книга — две …", optionen: ["knize", "knihi", "kniha"], e: "📚", warum: "dwě knize – Dual." },
      { typ: "sag", so: "Jara derje! Pytaj doma wěcy, kotrež su dwě: dwě ruce, dwě woči …", text: "Sehr gut! Such zu Hause Dinge, die es doppelt gibt, und sag sie im Dual.", ru: "Очень хорошо! Найди дома парные вещи и назови их в двойственном числе.", letzte: true }]
  },
  {
    id: "sm-plomjo", lb: 7, stufe: 3, lz: ["sm.ku.01", "sm.le.01"], name: "Płomjo a rěče Łužicy – Mehrsprachige Lausitz", e: "📰", farbe: "#A93226", grund: "#FAE5E3", mutter: true,
    schritte: [
      { typ: "sag", so: "W Łužicy so rěči hornjoserbsce, delnjoserbsce a němsce. Za dźěći wuchadźa časopis „Płomjo“.", text: "In der Lausitz spricht man Obersorbisch, Niedersorbisch und Deutsch. Für Kinder gibt es die Zeitschrift „Płomjo“ (Flamme).", ru: "В Лужице говорят на верхнелужицком, нижнелужицком и немецком. Для детей выходит журнал «Płomjo» («Пламя»)." },
      { typ: "wahl", frage: "Wie heißt die sorbische Kinderzeitschrift?", ru: "Как называется лужицкий детский журнал?", optionen: ["Płomjo", "Mica", "Krabat"], e: "📰", warum: "„Płomjo“ heißt „Flamme“." },
      { typ: "wahl", frage: "In der Niederlausitz (Niedersorbisch) sagt man zu „Guten Tag“ …", ru: "В Нижней Лужице (нижнелужицкий) говорят «Добрый день» …", optionen: ["Dobry źeń", "Good morning", "Bonjour"], e: "🛶", warum: "Niedersorbisch „Dobry źeń“, Obersorbisch „Dobry dźeń“ – fast gleich!" },
      { typ: "wahl", frage: "Welche Sprachen hört man in der Lausitz?", ru: "Какие языки слышны в Лужице?", optionen: ["Obersorbisch, Niedersorbisch und Deutsch", "nur Englisch", "nur Französisch"], e: "🗣️", warum: "Die Lausitz ist mehrsprachig – und Polnisch und Tschechisch sind nah." },
      { typ: "sag", so: "Wulkotnje! Pytaj w Płomjenju abo w bibliotece serbsku knihu.", text: "Toll! Such in der Płomjo oder in der Bibliothek ein sorbisches Buch.", ru: "Отлично! Найди в журнале «Płomjo» или в библиотеке лужицкую книгу.", letzte: true }]
  },
  {
    id: "sm-dziwadlo", lb: 7, stufe: 3, lz: ["sm.sz.01", "sm.ku.01"], name: "Dwurěčne dźiwadło – Zweisprachig Theater spielen", e: "🎭", farbe: "#884EA0", grund: "#F4ECF7", mutter: true,
    schritte: [
      { typ: "sag", so: "W dwurěčnym dźiwadle rěči jedna figura serbsce, druha němsce – a wobě so zrozumitej.", text: "Im zweisprachigen Theater spricht eine Figur Sorbisch, die andere Deutsch – und beide verstehen sich.", ru: "В двуязычном театре один персонаж говорит по-лужицки, другой по-немецки — и они понимают друг друга." },
      { typ: "textfrage", titel: "Kašpork a krokodil", text: "Kašpork: Dobry dźeń, dźěći! – Krokodil: Hallo! Ich habe Hunger! – Kašpork: Ty sy hłódny? Tu maš jabłuko. – Krokodil: Danke, Kašpork!", so: "Štó je hłódny?", frage: "Wer hat Hunger?", ru: "Кто голоден?", optionen: ["krokodil", "Kašpork", "dźěći"], warum: "Das Krokodil sagt: „Ich habe Hunger!“" },
      { typ: "textfrage", titel: "Kašpork a krokodil", text: "Kašpork: Dobry dźeń, dźěći! – Krokodil: Hallo! Ich habe Hunger! – Kašpork: Ty sy hłódny? Tu maš jabłuko. – Krokodil: Danke, Kašpork!", so: "Što Kašpork krokodilej da?", frage: "Was gibt Kašpork dem Krokodil?", ru: "Что Кашпорк даёт крокодилу?", optionen: ["jabłuko", "chlěb", "mloko"], warum: "„Tu maš jabłuko“ – einen Apfel." },
      { typ: "sag", so: "Jara derje! Hrajće scenu we dwěmaj: jedyn rěči serbsce, druhi němsce.", text: "Sehr gut! Spielt die Szene zu zweit: einer spricht Sorbisch, der andere Deutsch.", ru: "Очень хорошо! Сыграйте сцену вдвоём: один говорит по-лужицки, другой по-немецки.", letzte: true }]
  },

  // ---------- Klasse 4 ----------
  {
    id: "sm-powesc", lb: 2, stufe: 4, lz: ["sm.sz.01", "sm.le.01"], name: "Powěsć – Eine Nachricht weitergeben", e: "📣", farbe: "#1F618D", grund: "#E5EFF7", mutter: true,
    schritte: [
      { typ: "sag", so: "Hdyž powěsć dale dawaš, dyrbiš wšitko wažne wobchować: Štó? Što? Hdy? Hdźe?", text: "Wenn du eine Nachricht weitergibst, musst du dir das Wichtige merken: Wer? Was? Wann? Wo?", ru: "Когда передаёшь сообщение, запомни главное: кто? что? когда? где?" },
      { typ: "textfrage", titel: "Wučerka praji", text: "Jutře pojědźemy z busom do Budyšina. Zetkamy so w sydmich pola šule. Přinjesće sej pićo a dešćnik!", so: "Hdźe pojědźeće?", frage: "Wohin fahrt ihr?", ru: "Куда вы поедете?", optionen: ["do Budyšina", "do Drježdźan", "do lěsa"], warum: "„do Budyšina“ – nach Bautzen." },
      { typ: "textfrage", titel: "Wučerka praji", text: "Jutře pojědźemy z busom do Budyšina. Zetkamy so w sydmich pola šule. Přinjesće sej pićo a dešćnik!", so: "Što maće sobu wzać?", frage: "Was sollt ihr mitbringen?", ru: "Что нужно взять с собой?", optionen: ["pićo a dešćnik", "bul a kopańcu", "ničo"], warum: "Etwas zu trinken und einen Regenschirm." },
      { typ: "textfrage", titel: "Wučerka praji", text: "Jutře pojědźemy z busom do Budyšina. Zetkamy so w sydmich pola šule. Přinjesće sej pićo a dešćnik!", so: "Hdy so zetkaće?", frage: "Wann trefft ihr euch?", ru: "Когда вы встречаетесь?", optionen: ["w sydmich", "w dźewjećich", "wječor"], warum: "„w sydmich“ – um sieben Uhr." },
      { typ: "sag", so: "Wulkotnje! Daj powěsć doma dale – bjez toho, zo by něšto zabył(a).", text: "Toll! Gib zu Hause eine Nachricht aus der Schule weiter – ohne etwas zu vergessen.", ru: "Отлично! Передай дома сообщение из школы — ничего не забыв.", letzte: true }]
  },
  {
    id: "sm-list", lb: 3, stufe: 4, lz: ["sm.sc.01"], name: "List – Einen Brief schreiben", e: "✉️", farbe: "#D35400", grund: "#FFF0E3", mutter: true,
    schritte: [
      { typ: "sag", so: "List ma narěč, tekst a postrow na kóncu.", text: "Ein Brief hat eine Anrede, den eigentlichen Text und einen Gruß am Ende.", ru: "У письма есть обращение, текст и приветствие в конце." },
      { typ: "wahl", frage: "Womit beginnt ein Brief an die Oma?", ru: "С чего начинается письмо бабушке?", optionen: ["Luba wowka,", "Wutrobny postrow", "Božemje!"], e: "👵", warum: "„Luba wowka,“ heißt „Liebe Oma,“." },
      { typ: "satz", de: "Bau den Satz: „Liebe Oma, danke für das Geschenk.“", ru: "Составь: «Дорогая бабушка, спасибо за подарок».", woerter: ["Luba", "wowka,", "dźakuju", "so", "za", "dar."], e: "🎁" },
      { typ: "wahl", frage: "Womit endet der Brief?", ru: "Чем заканчивается письмо?", optionen: ["Wutrobny postrow, twoja Mia", "Luba wowka,", "Dobre ranje"], e: "✍️", warum: "„Wutrobny postrow“ heißt „Herzliche Grüße“." },
      { typ: "sag", so: "Jara derje! Napisaj woprawdźity list – swojej wowce, dźědej abo přećelce.", text: "Sehr gut! Schreib einen echten Brief – an Oma, Opa oder eine Freundin.", ru: "Очень хорошо! Напиши настоящее письмо — бабушке, дедушке или подруге.", letzte: true }]
  },
  {
    id: "sm-slownik", lb: 4, stufe: 4, lz: ["sm.rs.01", "sm.su.01"], name: "Słownik – Im Wörterbuch suchen", e: "📕", farbe: "#922B21", grund: "#F9EBEA", mutter: true,
    schritte: [
      { typ: "sag", so: "Serbski alfabet: a b c č ć d dź e ě f g h ch i j k ł l m n ń o ó p r ř s š t u w y z ž.", text: "Im sorbischen Alphabet stehen besondere Buchstaben hinter ihren Geschwistern: č nach c, š nach s – und ł sogar vor l! Und ch kommt nach h.", ru: "В лужицком алфавите особые буквы стоят после «родственников»: č после c, š после s — а ł даже перед l! А ch идёт после h." },
      { typ: "wahl", so: "Kotre słowo steji w słowniku prjedy?", frage: "Welches Wort steht im Wörterbuch weiter vorn?", ru: "Какое слово стоит в словаре раньше?", optionen: ["cybla", "čapka"], e: "🧅", warum: "c kommt vor č." },
      { typ: "wahl", so: "Kotre słowo steji w słowniku prjedy?", frage: "Welches Wort steht im Wörterbuch weiter vorn?", ru: "Какое слово стоит в словаре раньше?", optionen: ["łódź", "lěto"], e: "🛶", warum: "Im sorbischen Alphabet steht ł vor l." },
      { typ: "wahl", so: "Kotre słowo steji w słowniku prjedy?", frage: "Welches Wort steht im Wörterbuch weiter vorn?", ru: "Какое слово стоит в словаре раньше?", optionen: ["hora", "chlěb"], e: "⛰️", warum: "h kommt vor ch." },
      { typ: "sag", so: "Wulkotnje! Pytaj w słowniku pjeć słowow z „š“.", text: "Toll! Such im Wörterbuch fünf Wörter mit š.", ru: "Отлично! Найди в словаре пять слов на «š».", letzte: true }]
  },
  {
    id: "sm-krabat", lb: 5, stufe: 4, lz: ["sm.le.01", "sm.ku.01"], name: "Krabat – Eine sorbische Sage lesen", e: "🧙", farbe: "#4A235A", grund: "#F0E6F5", mutter: true,
    schritte: [
      { typ: "sag", so: "Čitaj powěsć wo Krabaće.", text: "Lies die Sage von Krabat und beantworte die Fragen.", ru: "Прочитай предание о Крабате и ответь на вопросы." },
      { typ: "textfrage", titel: "Krabat", text: "Krabat je chudy hólc. Wón dźěła w młynje w Čornym Chołmcu. Mišter młyna je zły kuzłar. Hólcy wuknu tam kuzłać a so do hawronow přeměnjeć. Krabat je mudry a skónčnje mištra dobudźe.", so: "Hdźe Krabat dźěła?", frage: "Wo arbeitet Krabat?", ru: "Где работает Крабат?", optionen: ["w młynje", "w šuli", "na polu"], warum: "In der Mühle – „w młynje“." },
      { typ: "textfrage", titel: "Krabat", text: "Krabat je chudy hólc. Wón dźěła w młynje w Čornym Chołmcu. Mišter młyna je zły kuzłar. Hólcy wuknu tam kuzłać a so do hawronow přeměnjeć. Krabat je mudry a skónčnje mištra dobudźe.", so: "Do čeho so hólcy přeměnjeja?", frage: "In was verwandeln sich die Jungen?", ru: "В кого превращаются мальчики?", optionen: ["do hawronow", "do psow", "do rybow"], warum: "In Raben – „hawrony“." },
      { typ: "textfrage", titel: "Krabat", text: "Krabat je chudy hólc. Wón dźěła w młynje w Čornym Chołmcu. Mišter młyna je zły kuzłar. Hólcy wuknu tam kuzłać a so do hawronow přeměnjeć. Krabat je mudry a skónčnje mištra dobudźe.", so: "Kajki je Krabat?", frage: "Wie ist Krabat?", ru: "Какой Крабат?", optionen: ["mudry", "zły", "mały"], warum: "„Krabat je mudry“ – klug." },
      { typ: "sag", so: "Jara derje! W Čornym Chołmcu (Schwarzkollm) móžeš Krabatowy młyn wopytać.", text: "Sehr gut! In Schwarzkollm kannst du die Krabatmühle besuchen.", ru: "Очень хорошо! В Шварцколме можно побывать на мельнице Крабата.", letzte: true }]
  },
  {
    id: "sm-medije", lb: 5, stufe: 4, lz: ["sm.le.01", "sm.ku.01"], name: "Serbske medije – Zeitung, Radio, Bücher", e: "📻", farbe: "#2874A6", grund: "#E6F0F8", mutter: true,
    schritte: [
      { typ: "sag", so: "Po serbsku móžeš čitać, słuchać a hladać: nowiny, rozhłós, telewizija a knihi.", text: "Auf Sorbisch kannst du lesen, hören und schauen: Zeitung, Radio, Fernsehen und Bücher.", ru: "По-лужицки можно читать, слушать и смотреть: газеты, радио, телевидение и книги." },
      { typ: "wahl", frage: "Wie heißt die sorbische Tageszeitung?", ru: "Как называется лужицкая ежедневная газета?", optionen: ["Serbske Nowiny", "Płomjo", "Wuhladko"], e: "🗞️", warum: "„Serbske Nowiny“ erscheint jeden Werktag." },
      { typ: "wahl", frage: "Wie heißt die sorbische Fernsehsendung im MDR?", ru: "Как называется лужицкая телепередача на MDR?", optionen: ["Wuhladko", "Serbske Nowiny", "Kašpork"], e: "📺", warum: "„Wuhladko“ ist das obersorbische Fernsehmagazin." },
      { typ: "wahl", frage: "Wo erscheinen viele sorbische Kinderbücher?", ru: "Где выходят многие лужицкие детские книги?", optionen: ["im Domowina-Verlag in Bautzen", "nur im Internet", "gar nicht"], e: "📚", warum: "Der Domowina-Verlag (Ludowe nakładnistwo Domowina) sitzt in Bautzen." },
      { typ: "sag", so: "Wulkotnje! Słuchaj z dorosćenym serbski rozhłós.", text: "Toll! Hör mit einem Erwachsenen sorbisches Radio.", ru: "Отлично! Послушай со взрослым лужицкое радио.", letzte: true }]
  },
  {
    id: "sm-swojba", lb: 6, stufe: 4, lz: ["sm.su.01"], name: "Słowna swójba – Wortfamilien", e: "🌱", farbe: "#239B56", grund: "#E7F6EC", mutter: true,
    schritte: [
      { typ: "sag", so: "Słowa jedneje swójby maja samsny zdónk: pisać, pisak, pismo, napisać.", text: "Wörter einer Wortfamilie haben denselben Stamm: pisać, pisak, pismo, napisać – alle haben „pis“.", ru: "У слов одной семьи общий корень: pisać, pisak, pismo, napisać — во всех есть «pis»." },
      { typ: "wahl", so: "Kotre słowo njesłuša k swójbje „pisać“?", frage: "Welches Wort gehört nicht zur Familie „pisać“ (schreiben)?", ru: "Какое слово не из семьи «pisać» (писать)?", optionen: ["kniha", "pisak", "pismo"], e: "✍️", warum: "kniha hat nicht den Stamm „pis“." },
      { typ: "wahl", so: "Kotre słowo njesłuša k swójbje „čitać“?", frage: "Welches Wort gehört nicht zur Familie „čitać“ (lesen)?", ru: "Какое слово не из семьи «čitać» (читать)?", optionen: ["spěwać", "čitanka", "předčitać"], e: "📖", warum: "spěwać (singen) hat nicht den Stamm „čit“." },
      { typ: "wahl", so: "Kotry zdónk maja „rěč, rěčeć, rěčny“?", frage: "Welchen Stamm haben „rěč, rěčeć, rěčny“?", ru: "Какой корень у «rěč, rěčeć, rěčny»?", optionen: ["rěč", "eć", "ny"], e: "🗣️", warum: "Der Stamm ist „rěč“ (Sprache)." },
      { typ: "sag", so: "Jara derje! Zběraj słowa ze zdónkom „spěw“.", text: "Sehr gut! Sammle Wörter mit dem Stamm „spěw“ (singen).", ru: "Очень хорошо! Собери слова с корнем «spěw» (петь).", letzte: true }]
  },
  {
    id: "sm-slowjan", lb: 7, stufe: 4, lz: ["sm.su.01", "sm.ku.01"], name: "Słowjanske rěče – Slawische Verwandte", e: "🌍", farbe: "#5B2C6F", grund: "#F1E8F5", mutter: true,
    schritte: [
      { typ: "sag", so: "Serbšćina je słowjanska rěč – přiwuzna z pólšćinu, čěšćinu a rušćinu.", text: "Sorbisch ist eine slawische Sprache – verwandt mit Polnisch, Tschechisch und Russisch. Viele Wörter sind fast gleich!", ru: "Лужицкий — славянский язык, родственный польскому, чешскому и русскому. Многие слова почти одинаковы!" },
      { typ: "wahl", frage: "„woda“ (Sorbisch) heißt auf Tschechisch …", ru: "«woda» (лужицкий) по-чешски …", optionen: ["voda", "water", "eau"], e: "💧", warum: "woda – voda – woda (Polnisch) – вода (Russisch)." },
      { typ: "wahl", frage: "„dom“ (Haus) heißt auf Polnisch …", ru: "«dom» (дом) по-польски …", optionen: ["dom", "house", "maison"], e: "🏠", warum: "Im Polnischen auch „dom“, im Russischen „дом“." },
      { typ: "wahl", frage: "Welche Sprache ist mit Sorbisch verwandt?", ru: "Какой язык родственен лужицкому?", optionen: ["Tschechisch", "Englisch", "Französisch"], e: "🇨🇿", warum: "Tschechisch ist – wie Sorbisch – eine westslawische Sprache." },
      { typ: "sag", so: "Wulkotnje! Hdyž do Čěskeje abo Pólskeje jědźeš, budźeš wjele słowow zrozumić.", text: "Toll! Wenn du nach Tschechien oder Polen fährst, verstehst du schon viele Wörter.", ru: "Отлично! Если поедешь в Чехию или Польшу, многие слова уже поймёшь.", letzte: true }]
  },
  {
    id: "sm-swjedzen", lb: 7, stufe: 4, lz: ["sm.ku.01"], name: "Serbski swjedźeń – Ein sorbisches Fest", e: "🎉", farbe: "#C0392B", grund: "#FDECEA", mutter: true,
    schritte: [
      { typ: "sag", so: "Na serbskim swjedźenju so spěwa, rejuje a mnozy nosydźa serbsku drastu.", text: "Auf einem sorbischen Fest wird gesungen und getanzt, und viele tragen die sorbische Tracht.", ru: "На лужицком празднике поют, танцуют, и многие надевают лужицкий национальный костюм." },
      { typ: "wahl", frage: "Wie heißt die Tracht auf Sorbisch?", ru: "Как по-лужицки национальный костюм?", optionen: ["drasta", "čapka", "kniha"], e: "👗", warum: "„drasta“ heißt Tracht (und Kleidung)." },
      { typ: "wahl", frage: "Was macht man auf einem Fest gemeinsam?", ru: "Что делают вместе на празднике?", optionen: ["spěwać a rejować", "spać a mjelčeć", "ličić a pisać"], e: "💃", warum: "Singen und tanzen – „spěwać a rejować“." },
      { typ: "satz", de: "Bau den Satz: „Wir feiern ein sorbisches Fest.“", ru: "Составь: «Мы празднуем лужицкий праздник».", woerter: ["Swjećimy", "serbski", "swjedźeń."], e: "🎶" },
      { typ: "sag", so: "Jara derje! Plańće w swojej rjadowni mały serbski swjedźeń.", text: "Sehr gut! Plant in eurer Klasse ein kleines sorbisches Fest mit Liedern und Spielen.", ru: "Очень хорошо! Спланируйте в классе маленький лужицкий праздник с песнями и играми.", letzte: true }]
  }
];
