// Vorschul-Rucksack (30.10.2026): kleine Bilder-Aufgaben für das letzte Kita-Jahr nach den Bildungsbereichen des Sächsischen Bildungsplans
// (Leitfaden für Krippen, Kindergärten und Horte, 2011) und der Schulvorbereitung. Alles ohne Lesen: Frage wird vorgelesen, Antworten sind Bilder.
// Bereich: { id, name, e, farbe, text, links: [[Pfad, Name, Emoji]] } – links führen zu passenden Inhalten, die es schon gibt.
// Aufgabe: { id: "vs-…", bereich, name, e (darf keine Antwort verraten), lz, aufgaben: [ { frage, ru, optionen: [richtig, …] (Emojis), sag?, warum? }
//   | { typ: "ordnen", frage, ru, teile: [Emojis in richtiger Reihenfolge], warum? } ] }
//   sag = zusätzlich vorgelesen (z. B. „Ba – na – ne“); warum = Erklärung nach der richtigen Antwort (vorgelesen).
window.VORSCHULE_BEREICHE = [
  { id: "mathe", name: "Zahlen und Formen", e: "🔢", farbe: "#2FA37C", text: "Mathematische Bildung: zählen, vergleichen, Formen und Muster",
    links: [["spiele/mathe/", "Matheweg: Würfelbilder, Zählen, Muster", "🦫"]] },
  { id: "sprache", name: "Sprechen und Hören", e: "🗣️", farbe: "#E0574A", text: "Kommunikative Bildung: Reime, Silben, Anlaute, Geschichten",
    links: [["spiele/lesen/", "Laute und Buchstaben: Gleicher Anfang, Nachspuren", "🦊"]] },
  { id: "natur", name: "Natur entdecken", e: "🌱", farbe: "#1F8F8A", text: "Naturwissenschaftliche Bildung: Tiere, Pflanzen, Wasser, Jahreszeiten",
    links: [["spiele/sachkunde/", "Sachunterricht mit Eule Ella", "🦉"]] },
  { id: "koerper", name: "Körper und Gesundheit", e: "🧼", farbe: "#3AA0E0", text: "Somatische Bildung: Körper, Sinne, gesund essen, Hygiene, Bewegung",
    links: [["spiele/gefuehle/", "Bewegung mit Bärin Bruni", "🐻"]] },
  { id: "sozial", name: "Miteinander", e: "🤝", farbe: "#E0578F", text: "Soziale Bildung: Gefühle, Regeln, helfen, sicher unterwegs",
    links: [["spiele/gefuehle/", "Gefühle mit Bärin Bruni", "💗"]] },
  { id: "kunst", name: "Malen und Musik", e: "🎨", farbe: "#E07A2E", text: "Ästhetische Bildung: Farben, Klänge, Instrumente",
    links: [["spiele/atelier/", "Atelier: malen und Musik machen", "🎨"]] },
  { id: "schule", name: "Bald bin ich Schulkind", e: "🎒", farbe: "#7B55B8", text: "Schulvorbereitung: Schulsachen, Tagesablauf, sich melden",
    links: [["spiele/lesen/", "Den eigenen Namen nachspuren", "✏️"]] }
];
window.VORSCHULE = [
  // ---------- Zahlen und Formen ----------
  { id: "vs-zaehlen", bereich: "mathe", name: "Wie viele?", e: "🍎", lz: ["ma.zo.01"], aufgaben: [
    { frage: "Wie viele Äpfel siehst du? 🍎🍎🍎 Tipp auf den Würfel mit genauso vielen Punkten.", ru: "Сколько яблок? 🍎🍎🍎 Нажми на кубик с таким же числом точек.", optionen: ["⚂", "⚁", "⚃"], warum: "Drei Äpfel – drei Punkte." },
    { frage: "Wie viele Enten schwimmen da? 🦆🦆", ru: "Сколько уток плавает? 🦆🦆", optionen: ["⚁", "⚀", "⚂"], warum: "Zwei Enten – zwei Punkte." },
    { frage: "Wie viele Sterne? ⭐⭐⭐⭐⭐", ru: "Сколько звёзд? ⭐⭐⭐⭐⭐", optionen: ["⚄", "⚃", "⚅"], warum: "Fünf Sterne – fünf Punkte." },
    { frage: "Wie viele Bälle? ⚽⚽⚽⚽", ru: "Сколько мячей? ⚽⚽⚽⚽", optionen: ["⚃", "⚂", "⚄"], warum: "Vier Bälle – vier Punkte." },
    { frage: "Wo sind mehr? Tipp auf die Gruppe mit mehr Tieren.", ru: "Где больше? Нажми на группу, где больше животных.", optionen: ["🐟🐟🐟🐟", "🐟🐟", "🐟"], warum: "Vier Fische sind mehr als zwei." }] },
  { id: "vs-formen", bereich: "mathe", name: "Kreis, Dreieck, Viereck", e: "🔷", lz: ["ma.rf.02"], aufgaben: [
    { frage: "Welche Form ist ein Kreis?", ru: "Какая фигура — круг?", optionen: ["🔵", "🔺", "🟦"], warum: "Der Kreis ist ganz rund." },
    { frage: "Welche Form ist ein Dreieck? Es hat drei Ecken.", ru: "Какая фигура — треугольник? У него три угла.", optionen: ["🔺", "🔵", "🟩"], warum: "Ein Dreieck hat drei Ecken." },
    { frage: "Welche Form ist ein Viereck? Es hat vier Ecken.", ru: "Какая фигура — четырёхугольник? У него четыре угла.", optionen: ["🟧", "🔴", "🔺"], warum: "Ein Viereck hat vier Ecken." },
    { frage: "Was ist rund wie ein Kreis?", ru: "Что круглое, как круг?", optionen: ["🍪", "📦", "📐"], warum: "Der Keks ist rund." },
    { frage: "Was hat eckige Kanten wie ein Würfel?", ru: "У чего углы, как у кубика?", optionen: ["🎁", "⚽", "🍊"], warum: "Das Geschenkpaket hat Ecken und Kanten." }] },
  { id: "vs-vergleichen", bereich: "mathe", name: "Groß, schwer, lang", e: "⚖️", lz: ["ma.gm.01", "ma.rf.01"], aufgaben: [
    { frage: "Welches Tier ist am größten?", ru: "Какое животное самое большое?", optionen: ["🐘", "🐭", "🐱"], warum: "Der Elefant ist am größten." },
    { frage: "Was ist schwerer?", ru: "Что тяжелее?", optionen: ["🪨", "🪶", "🎈"], warum: "Der Stein ist schwerer als die Feder." },
    { frage: "Wer ist länger: die Schlange oder der Wurm?", ru: "Кто длиннее: змея или червяк?", optionen: ["🐍", "🐛"], warum: "Die Schlange ist länger." },
    { frage: "Der Vogel sitzt oben im Baum. Zeig nach oben!", ru: "Птица сидит наверху на дереве. Покажи наверх!", optionen: ["⬆️", "⬇️", "➡️"], warum: "Oben ist da, wo der Himmel ist." },
    { frage: "Ordne von klein nach groß!", ru: "Расставь от маленького к большому!", typ: "ordnen", teile: ["🐜", "🐈", "🐘"], warum: "Ameise, Katze, Elefant." }] },
  { id: "vs-muster", bereich: "mathe", name: "Muster und Reihen", e: "🔁", lz: ["ma.ms.01"], aufgaben: [
    { frage: "Rot, blau, rot, blau, rot … Was kommt als Nächstes?", ru: "Красный, синий, красный, синий, красный … Что дальше?", optionen: ["🔵", "🔴", "🟡"], sag: "🔴🔵🔴🔵🔴", warum: "Nach Rot kommt wieder Blau." },
    { frage: "Sonne, Mond, Sonne, Mond … Was kommt als Nächstes?", ru: "Солнце, луна, солнце, луна … Что дальше?", optionen: ["☀️", "🌙", "⭐"], warum: "Nach dem Mond kommt wieder die Sonne." },
    { frage: "Apfel, Apfel, Birne, Apfel, Apfel … Was kommt dann?", ru: "Яблоко, яблоко, груша, яблоко, яблоко … Что потом?", optionen: ["🍐", "🍎", "🍌"], warum: "Nach zwei Äpfeln kommt eine Birne." },
    { frage: "Leg die Zahlen der Reihe nach: eins, zwei, drei!", ru: "Разложи числа по порядку: один, два, три!", typ: "ordnen", teile: ["⚀", "⚁", "⚂"], warum: "Eins, zwei, drei." }] },

  // ---------- Sprechen und Hören ----------
  { id: "vs-reime", bereich: "sprache", name: "Was reimt sich?", e: "🎶", lz: ["de.su.01"], aufgaben: [
    { frage: "Was reimt sich auf Maus?", ru: "Что рифмуется со словом Maus (мышь)?", optionen: ["🏠", "🐟", "🚗"], warum: "Maus – Haus. Das klingt am Ende gleich!" },
    { frage: "Was reimt sich auf Hose?", ru: "Что рифмуется со словом Hose (брюки)?", optionen: ["🌹", "👟", "🧢"], warum: "Hose – Rose." },
    { frage: "Was reimt sich auf Nase?", ru: "Что рифмуется со словом Nase (нос)?", optionen: ["🐇", "🐶", "🐦"], warum: "Nase – Hase." },
    { frage: "Was reimt sich auf Bein?", ru: "Что рифмуется со словом Bein (нога)?", optionen: ["🪨", "🌳", "🍎"], warum: "Bein – Stein." },
    { frage: "Was reimt sich auf Hand?", ru: "Что рифмуется со словом Hand (рука)?", optionen: ["🏖️", "🌙", "🍌"], warum: "Hand – Sand." }] },
  { id: "vs-silben", bereich: "sprache", name: "Silben klatschen", e: "👏", lz: ["de.su.01"], aufgaben: [
    { frage: "Klatsch mit: Ba – na – ne. Wie oft hast du geklatscht?", ru: "Хлопай: Ба – на – не. Сколько раз ты хлопнул?", optionen: ["⚂", "⚁", "⚀"], sag: "Ba – na – ne", warum: "Ba-na-ne: dreimal klatschen." },
    { frage: "Klatsch mit: Hund. Wie oft hast du geklatscht?", ru: "Хлопай: Hund. Сколько раз?", optionen: ["⚀", "⚁", "⚂"], sag: "Hund", warum: "Hund: einmal klatschen." },
    { frage: "Klatsch mit: Kat – ze. Wie oft hast du geklatscht?", ru: "Хлопай: Кат – це. Сколько раз?", optionen: ["⚁", "⚀", "⚂"], sag: "Kat – ze", warum: "Kat-ze: zweimal klatschen." },
    { frage: "Klatsch mit: Schmet – ter – ling. Wie oft hast du geklatscht?", ru: "Хлопай: Шмет – тер – линг. Сколько раз?", optionen: ["⚂", "⚁", "⚃"], sag: "Schmet – ter – ling", warum: "Schmet-ter-ling: dreimal." },
    { frage: "Welches Wort ist lang und hat drei Silben?", ru: "Какое слово длинное и имеет три слога?", optionen: ["🐘", "🐟", "🐝"], sag: "E – le – fant, Fisch, Bie – ne", warum: "E-le-fant hat drei Silben." }] },
  { id: "vs-geschichte", bereich: "sprache", name: "Bildergeschichten", e: "📖", lz: ["de.sz.01", "de.tm.01"], aufgaben: [
    { typ: "ordnen", frage: "Was passiert zuerst, dann, zum Schluss? Tipp die Bilder der Reihe nach an.", ru: "Что сначала, потом, в конце? Нажимай на картинки по порядку.", teile: ["🥚", "🐣", "🐔"], warum: "Erst das Ei, dann schlüpft das Küken, dann wird es ein Huhn." },
    { typ: "ordnen", frage: "Wie wächst die Blume? Tipp der Reihe nach.", ru: "Как растёт цветок? Нажимай по порядку.", teile: ["🌰", "🌱", "🌻"], warum: "Samen, kleine Pflanze, Blume." },
    { typ: "ordnen", frage: "Erst Regen, dann …? Tipp der Reihe nach.", ru: "Сначала дождь, потом …? Нажимай по порядку.", teile: ["☁️", "🌧️", "🌈"], warum: "Wolken, Regen, dann kommt die Sonne und ein Regenbogen." },
    { frage: "Welches Bild passt zum Ende der Geschichte: Der Junge hat Geburtstag und pustet die Kerzen aus.", ru: "Какая картинка подходит к концу истории: мальчик задувает свечи на торте?", optionen: ["🎂", "🛏️", "🚿"], warum: "Der Geburtstagskuchen mit Kerzen." }] },

  // ---------- Natur entdecken ----------
  { id: "vs-tiere", bereich: "natur", name: "Tiere und Pflanzen", e: "🔎", lz: ["su.na.01"], aufgaben: [
    { frage: "Welches Tier legt Eier?", ru: "Какое животное несёт яйца?", optionen: ["🐔", "🐶", "🐱"], warum: "Das Huhn legt Eier." },
    { frage: "Wer lebt im Wasser?", ru: "Кто живёт в воде?", optionen: ["🐟", "🐿️", "🐄"], warum: "Der Fisch lebt im Wasser." },
    { frage: "Wer kann fliegen?", ru: "Кто умеет летать?", optionen: ["🦋", "🐌", "🐢"], warum: "Der Schmetterling hat Flügel." },
    { frage: "Was braucht eine Pflanze zum Wachsen?", ru: "Что нужно растению, чтобы расти?", optionen: ["💧", "🍫", "📱"], warum: "Wasser – und Licht und Erde." },
    { frage: "Welches Tier macht „Muh“?", ru: "Какое животное говорит «Му»?", optionen: ["🐄", "🐑", "🐸"], sag: "Muh!", warum: "Die Kuh macht Muh." }] },
  { id: "vs-jahr", bereich: "natur", name: "Wetter und Jahreszeiten", e: "🌦️", lz: ["su.na.01", "su.hi.01"], aufgaben: [
    { frage: "Wann baust du einen Schneemann? Im Frühling, Sommer, Herbst oder Winter?", ru: "Когда лепят снеговика?", optionen: ["⛄", "🌷", "☀️", "🍂"], warum: "Im Winter, wenn Schnee liegt." },
    { frage: "Wann blühen die ersten Blumen?", ru: "Когда расцветают первые цветы?", optionen: ["🌷", "⛄", "🍂"], warum: "Im Frühling." },
    { frage: "Wann fallen bunte Blätter von den Bäumen?", ru: "Когда с деревьев падают разноцветные листья?", optionen: ["🍂", "🌷", "☀️"], warum: "Im Herbst." },
    { frage: "Es regnet. Was ziehst du an?", ru: "Идёт дождь. Что ты наденешь?", optionen: ["🧥", "👙", "🩳"], warum: "Eine Regenjacke – und Gummistiefel!" },
    { frage: "Was schwimmt auf dem Wasser?", ru: "Что плавает на воде?", optionen: ["🦆", "🪨", "🔑"], warum: "Die Ente schwimmt, Stein und Schlüssel gehen unter." }] },

  // ---------- Körper und Gesundheit ----------
  { id: "vs-sinne", bereich: "koerper", name: "Meine Sinne", e: "🙂", lz: ["su.so.01"], aufgaben: [
    { frage: "Womit hörst du?", ru: "Чем ты слышишь?", optionen: ["👂", "👃", "👅"], warum: "Mit den Ohren." },
    { frage: "Womit riechst du eine Blume?", ru: "Чем ты нюхаешь цветок?", optionen: ["👃", "👂", "🖐️"], warum: "Mit der Nase." },
    { frage: "Womit siehst du?", ru: "Чем ты видишь?", optionen: ["👀", "👅", "👂"], warum: "Mit den Augen." },
    { frage: "Womit schmeckst du, ob etwas süß ist?", ru: "Чем ты пробуешь, сладкое ли что-то?", optionen: ["👅", "👀", "👃"], warum: "Mit der Zunge." },
    { frage: "Womit fühlst du, ob etwas weich ist?", ru: "Чем ты чувствуешь, мягкое ли что-то?", optionen: ["🖐️", "👂", "👀"], warum: "Mit den Händen und der Haut." }] },
  { id: "vs-gesund", bereich: "koerper", name: "Gesund und sauber", e: "🦷", lz: ["su.so.01"], aufgaben: [
    { frage: "Was ist gut für deine Zähne?", ru: "Что полезно для зубов?", optionen: ["🍎", "🍭", "🍬"], warum: "Obst und Gemüse – und danach Zähne putzen." },
    { frage: "Was brauchst du zum Zähneputzen?", ru: "Что нужно, чтобы почистить зубы?", optionen: ["🪥", "🍴", "🖍️"], warum: "Die Zahnbürste – zweimal am Tag." },
    { typ: "ordnen", frage: "Hände waschen: Was kommt zuerst? Tipp der Reihe nach.", ru: "Мытьё рук: что сначала? Нажимай по порядку.", teile: ["💧", "🧼", "🧻"], warum: "Nass machen, einseifen und abspülen, abtrocknen." },
    { frage: "Wann wäschst du dir die Hände?", ru: "Когда ты моешь руки?", optionen: ["🍽️", "📺", "🛝"], warum: "Vor dem Essen – und nach der Toilette." },
    { frage: "Was hält dich fit?", ru: "Что помогает быть здоровым?", optionen: ["🏃", "📱", "🍟"], warum: "Bewegung, Spielen draußen und genug Schlaf." }] },

  // ---------- Miteinander ----------
  { id: "vs-miteinander", bereich: "sozial", name: "Freundlich miteinander", e: "🧑‍🤝‍🧑", lz: ["su.so.01", "et.mi.01"], aufgaben: [
    { frage: "Ein Kind ist traurig. Was kannst du tun?", ru: "Ребёнку грустно. Что ты можешь сделать?", optionen: ["🤗", "😝", "🏃"], warum: "Trösten und fragen, was los ist." },
    { frage: "Du möchtest auch mit dem Ball spielen. Was machst du?", ru: "Ты тоже хочешь поиграть с мячом. Что ты делаешь?", optionen: ["🙋", "😠", "😭"], warum: "Freundlich fragen: Darf ich mitspielen?" },
    { frage: "Du hast aus Versehen einen Turm umgeworfen. Was sagst du?", ru: "Ты нечаянно сломал башню. Что ты скажешь?", optionen: ["🙏", "😂", "🙈"], warum: "„Entschuldigung!“ – und beim Aufbauen helfen." },
    { frage: "Wie fühlt sich ein Kind, das Geburtstag hat und Geschenke bekommt?", ru: "Что чувствует ребёнок, у которого день рождения?", optionen: ["😄", "😢", "😠"], warum: "Fröhlich!" },
    { frage: "Du hast dich verletzt. Wer hilft dir?", ru: "Ты поранился. Кто тебе поможет?", optionen: ["🧑‍🏫", "🐈", "🧸"], warum: "Ein Erwachsener: Erzieherin, Lehrer, Mama, Papa." }] },
  { id: "vs-verkehr", bereich: "sozial", name: "Sicher über die Straße", e: "🚦", lz: ["su.ge.01"], aufgaben: [
    { frage: "Bei welcher Ampelfarbe darfst du gehen?", ru: "На какой свет светофора можно идти?", optionen: ["🟢", "🔴", "🟡"], warum: "Bei Grün darfst du gehen – bei Rot bleibst du stehen." },
    { frage: "Wo gehst du am sichersten über die Straße?", ru: "Где безопаснее всего переходить дорогу?", optionen: ["🦓", "🚗", "🌳"], warum: "Am Zebrastreifen oder an der Ampel." },
    { frage: "Was ziehst du im Dunkeln an, damit Autos dich sehen?", ru: "Что надеть в темноте, чтобы машины тебя видели?", optionen: ["🦺", "🕶️", "🎩"], warum: "Etwas Leuchtendes: Warnweste oder Reflektoren." },
    { frage: "Wohin schaust du, bevor du über die Straße gehst?", ru: "Куда ты смотришь, прежде чем перейти дорогу?", optionen: ["↔️", "⬆️", "⬇️"], warum: "Nach links, nach rechts und noch einmal nach links." }] },

  // ---------- Malen und Musik ----------
  { id: "vs-farben", bereich: "kunst", name: "Farben mischen", e: "🎨", lz: ["ku.ge.01"], aufgaben: [
    { frage: "Gelb und Blau zusammen ergibt …?", ru: "Жёлтый и синий вместе дают …?", optionen: ["🟢", "🟣", "🟠"], warum: "Gelb und Blau ergibt Grün." },
    { frage: "Rot und Gelb zusammen ergibt …?", ru: "Красный и жёлтый вместе дают …?", optionen: ["🟠", "🟢", "🟣"], warum: "Rot und Gelb ergibt Orange." },
    { frage: "Rot und Blau zusammen ergibt …?", ru: "Красный и синий вместе дают …?", optionen: ["🟣", "🟠", "🟢"], warum: "Rot und Blau ergibt Lila." },
    { frage: "Welche Farbe hat eine Banane?", ru: "Какого цвета банан?", optionen: ["🟡", "🔵", "🟤"], warum: "Gelb." },
    { frage: "Welche Farbe hat eine Wiese im Sommer?", ru: "Какого цвета луг летом?", optionen: ["🟢", "🔴", "⚫"], warum: "Grün." }] },
  { id: "vs-klaenge", bereich: "kunst", name: "Klänge und Instrumente", e: "🎼", lz: ["mu.ho.01"], aufgaben: [
    { frage: "Mit welchem Instrument trommelst du?", ru: "На каком инструменте барабанят?", optionen: ["🥁", "🎻", "🎺"], warum: "Mit der Trommel." },
    { frage: "In welches Instrument bläst du hinein?", ru: "В какой инструмент дуют?", optionen: ["🎺", "🥁", "🎹"], warum: "In die Trompete." },
    { frage: "Was ist ganz leise?", ru: "Что очень тихое?", optionen: ["🐭", "🦁", "🚒"], warum: "Die Maus trippelt ganz leise." },
    { frage: "Wer macht „Kikeriki“?", ru: "Кто кричит «Кукареку»?", optionen: ["🐓", "🐷", "🐴"], sag: "Kikeriki!", warum: "Der Hahn." },
    { frage: "Wer macht „Quak, quak“?", ru: "Кто говорит «Ква-ква»?", optionen: ["🐸", "🐶", "🐦"], sag: "Quak, quak!", warum: "Der Frosch." }] },

  // ---------- Bald bin ich Schulkind ----------
  { id: "vs-schulkind", bereich: "schule", name: "Meine Schultasche", e: "🧒", lz: ["de.sc.01", "su.so.01"], aufgaben: [
    { frage: "Was brauchst du in der Schule zum Schreiben?", ru: "Что нужно в школе, чтобы писать?", optionen: ["✏️", "🧸", "🍳"], warum: "Einen Stift." },
    { frage: "Worin trägst du deine Schulsachen?", ru: "В чём ты носишь школьные вещи?", optionen: ["🎒", "🛒", "🧺"], warum: "Im Schulranzen." },
    { frage: "Du willst in der Schule etwas sagen. Was machst du?", ru: "Ты хочешь что-то сказать в школе. Что ты делаешь?", optionen: ["✋", "📢", "🙊"], warum: "Du meldest dich und wartest, bis du dran bist." },
    { typ: "ordnen", frage: "Dein Schulmorgen: Tipp der Reihe nach!", ru: "Твоё школьное утро: нажимай по порядку!", teile: ["🛏️", "🥣", "🎒", "🏫"], warum: "Aufstehen, frühstücken, Ranzen nehmen, ab in die Schule." },
    { frage: "Was gehört NICHT in die Schultasche?", ru: "Что НЕ кладут в портфель?", optionen: ["🐈", "📒", "✂️"], warum: "Die Katze bleibt zu Hause!" }] }
];
