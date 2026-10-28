// Weitere Fächer mit Eule Ella (28.10.2026): Kunst, Musik, Werken, Sport und Ethik nach den sächsischen Lehrplänen Grundschule (Fassung 2019,
// PDFs vom Auftraggeber). Die Lehrplaninhalte sind nur zusammengefasst und auf Wissensfragen gebracht – Malen, Singen, Bauen, Turnen,
// Schwimmen gehören in die echte Welt (Atelier, Echte-Welt-Aufgaben). Sachunterricht-Seite mit ?fach=<id>, gleiche Schritt-Typen wie themen.js.
// Thema: { id, fach, lb, stufe? | kl?, lz, name, e, farbe, grund, kurz, schritte } – stufe 3/4 = sichtbar ab der Klasse davor (wie themen.js).
// Hilfen unten bauen die üblichen Schritte (info, wahl, daumen, zuordnen); bei wahl ist die erste Option richtig (die Seite mischt).
// Russische Zeilen sind Entwürfe (Prüfstatus siehe docs/SPRACHEN.md), Hilfesprache nur, wenn gewählt.
(function () {
  const info = (titel, bild, text, ru, fakten) => Object.assign({ typ: "info", titel, bild, text, ru }, fakten ? { fakten } : {});
  const wahl = (frage, ru, bild, ...opts) => ({ typ: "wahl", frage, ru, bild, optionen: opts.map(([t, r, warum, warumRu], i) => ({ t, ru: r, ok: i === 0, warum, warumRu })) });
  const daumen = (satz, satzRu, bild, ok, warum, warumRu) => ({ typ: "daumen", satz, satzRu, bild, ok, warum, warumRu });
  const zuordnen = (frage, ru, gruppen, dinge) => ({ typ: "zuordnen", frage, ru, gruppen: gruppen.map(([id, name, r, bild]) => ({ id, name, ru: r, bild })),
    dinge: dinge.map(([t, r, gruppe]) => ({ t, ru: r, gruppe })) });
  const ende = (text, ru) => info("Geschafft!", "🦉", text, ru);

  window.FACH_SEITEN = {
    kunst: { name: "Kunst", e: "🎨", intro: "In Kunst entdecken wir Farben, Formen, Bilder und Künstler. Malen kannst du im Atelier!",
      lb: [["ku1", "🖌️ Flächiges Gestalten: Farben, Linien, Drucken"], ["ku2", "🏺 Körperhaft-räumliches Gestalten: Formen und Bauen"], ["ku3", "🎭 Aktionsbetontes Gestalten: Kunst mit dem Körper"]] },
    musik: { name: "Musik", e: "🎵", intro: "In Musik geht es um Stimme, Instrumente, Rhythmus und berühmte Musik. Mitspielen kannst du im Atelier bei Papagei Paula!",
      lb: [["mu1", "🎤 Musik mit der Stimme"], ["mu2", "🥁 Musik mit Instrumenten und Noten"], ["mu3", "💃 Musik und Bewegung"], ["mu4", "👂 Musik hören und verstehen"]] },
    werken: { name: "Werken", e: "🔨", intro: "In Werken geht es um Technik, Werkzeuge und Werkstoffe. Gebaut wird dann mit echten Händen!",
      lb: [["we1", "🚗 Technik im Alltag entdecken"], ["we2", "✂️ Material und Werkzeug"], ["we3", "🌉 Stabil bauen"], ["we4", "🔋 Strom nutzen"], ["we5", "🔧 Warten und pflegen"], ["we6", "🤖 Roboter und Automaten"]] },
    sport: { name: "Sport", e: "⚽", intro: "Sport machst du mit dem ganzen Körper! Hier lernst du Regeln, Tricks und wie du sicher bleibst.",
      lb: [["sp1", "🏃 Laufen, Springen, Werfen"], ["sp2", "⚽ Spiele und Fair Play"], ["sp3", "🤸 Turnen"], ["sp4", "💃 Gymnastik und Tanz"], ["sp5", "🏊 Schwimmen"], ["sp6", "⛷️ Wintersport"]] },
    ethik: { name: "Ethik", e: "💭", intro: "In Ethik denken wir zusammen nach: über uns, über andere, über Feste und über unsere Welt.",
      lb: [["et1", "🙂 Ich im Wir"], ["et2", "🤝 Miteinander"], ["et3", "🕯️ Voneinander: Feste und Religionen"], ["et4", "🌍 Wir in der Welt"]] }
  };

  const T = window.FACH_THEMEN = [];
  const neu = (fach, t) => T.push(Object.assign({ fach }, t));

  // ==================== KUNST (Lehrplan Grundschule Kunst 2019) ====================
  const ku = (t) => neu("kunst", t);
  ku({ id: "ku-farben", lb: "ku1", kl: 2, lz: ["ku.ge.01"], name: "Grundfarben und Mischfarben", e: "🎨", farbe: "#E5383B", grund: "#FFF0E6",
    kurz: "Rot, Gelb, Blau mischen, Farbkreis, aufhellen und abdunkeln", schritte: [
      info("Drei Farben reichen", "farbkreis", "Mit nur drei Farben kannst du fast alle anderen mischen: Rot, Gelb und Blau. Man nennt sie Grundfarben.",
        "Всего из трёх красок можно смешать почти все остальные: красной, жёлтой и синей. Их называют основными цветами.",
        [["Gelb + Blau = Grün", "Жёлтый + синий = зелёный"], ["Rot + Gelb = Orange", "Красный + жёлтый = оранжевый"], ["Rot + Blau = Lila", "Красный + синий = фиолетовый"]]),
      wahl("Welche Farben mischst du für Grün?", "Какие краски смешать, чтобы получить зелёный?", "🟢",
        ["Gelb und Blau", "Жёлтый и синий", "Richtig! Gelb und Blau ergeben Grün.", "Правильно! Жёлтый и синий дают зелёный."],
        ["Rot und Gelb", "Красный и жёлтый", "Rot und Gelb ergeben Orange.", "Красный и жёлтый дают оранжевый."],
        ["Rot und Blau", "Красный и синий", "Rot und Blau ergeben Lila.", "Красный и синий дают фиолетовый."]),
      zuordnen("Grundfarbe oder Mischfarbe?", "Основной цвет или смешанный?", [["grund", "Grundfarbe", "Основной цвет", "🔴"], ["misch", "Mischfarbe", "Смешанный цвет", "🟣"]],
        [["Gelb", "Жёлтый", "grund"], ["Blau", "Синий", "grund"], ["Orange", "Оранжевый", "misch"], ["Grün", "Зелёный", "misch"]]),
      wahl("Du willst ein helles Blau. Was mischst du dazu?", "Ты хочешь светло-синий. Что ты добавишь?", "🩵",
        ["Weiß", "Белый", "Genau! Mit Weiß hellst du eine Farbe auf.", "Точно! Белым краску осветляют."],
        ["Schwarz", "Чёрный", "Schwarz macht die Farbe dunkler.", "Чёрный делает цвет темнее."],
        ["Rot", "Красный", "Mit Rot wird das Blau zu Lila.", "С красным синий станет фиолетовым."]),
      daumen("Farben, die sich gut vertragen, liegen im Farbkreis oft nebeneinander – zum Beispiel Gelb und Orange.", "Цвета, которые хорошо сочетаются, часто лежат в цветовом круге рядом – например, жёлтый и оранжевый.", "farbkreis", true,
        "Stimmt! Gegenüber liegen Farben, die sich „streiten“ und ganz stark leuchten, wie Rot und Grün.", "Верно! Напротив лежат цвета, которые «спорят» и ярко светятся, как красный и зелёный."),
      ende("Super, {name}! Probier es im Atelier oder mit echten Wasserfarben: Misch dir einen eigenen Farbkreis.", "Супер, {name}! Попробуй в ателье или с настоящими красками: смешай свой цветовой круг.")
    ] });
  ku({ id: "ku-farbauftrag", lb: "ku1", kl: 2, lz: ["ku.ge.01", "ku.be.01"], name: "Tupfen, klecksen, spritzen", e: "🖌️", farbe: "#2F6FD6", grund: "#EAF2FF",
    kurz: "Farbe dick oder dünn auftragen, Pinsel, Werkzeuge, berühmte Maler", schritte: [
      info("Viele Wege, Farbe aufs Bild zu bringen", "🖌️", "Man kann malen, tupfen, klecksen, tropfen, spritzen oder mit dem Finger streichen. Jede Art sieht anders aus.",
        "Можно рисовать кистью, ставить точки, делать кляксы, капать, брызгать или водить пальцем. Каждый способ выглядит по-разному.",
        [["Deckende Farbe: Man sieht nicht mehr, was darunter ist.", "Кроющая краска: того, что под ней, не видно."], ["Lasierende Farbe ist dünn und durchscheinend.", "Лессировочная краска тонкая и просвечивает."]]),
      wahl("Georges Seurat hat Bilder aus lauter kleinen Farbpunkten gemalt. Wie hat er die Farbe aufgetragen?", "Жорж Сёра рисовал картины из маленьких цветных точек. Как он наносил краску?", "🔵",
        ["Getupft", "Точками", "Richtig! Aus der Nähe siehst du Punkte, von weitem ein ganzes Bild.", "Правильно! Вблизи видны точки, издалека – целая картина."],
        ["Gespritzt", "Брызгами", "Nein, Seurat hat ganz genau getupft.", "Нет, Сёра очень аккуратно ставил точки."],
        ["Mit dem Spachtel gestrichen", "Шпателем", "Nein, er hat kleine Punkte getupft.", "Нет, он ставил маленькие точки."]),
      wahl("Jackson Pollock hat Farbe auf eine große Leinwand am Boden …", "Джексон Поллок … краску на большой холст на полу.", "💦",
        ["tropfen und fliegen lassen", "капал и разбрызгивал", "Genau! So entstanden wilde Linien aus Farbe.", "Точно! Так получались дикие цветные линии."],
        ["mit dem Lineal gezeichnet", "рисовал по линейке", "Nein, er hat die Farbe tropfen lassen.", "Нет, он капал краской."],
        ["gestempelt", "печатал штампами", "Nein, er hat die Farbe tropfen und fliegen lassen.", "Нет, он капал и разбрызгивал краску."]),
      daumen("Vincent van Gogh hat die Farbe oft ganz dick aufgetragen – man kann die Pinselstriche sehen.", "Винсент Ван Гог часто наносил краску очень толсто – видны мазки кисти.", "🌻", true,
        "Stimmt! Seine Sonnenblumen und Sternenhimmel sind voller dicker, bewegter Striche.", "Верно! Его подсолнухи и звёздное небо полны толстых, подвижных мазков."),
      zuordnen("Welches Werkzeug passt?", "Какой инструмент подходит?", [["pinsel", "Pinsel", "Кисть", "🖌️"], ["finger", "Finger", "Палец", "☝️"]],
        [["Feine Linie für Katzenhaare", "Тонкая линия для кошачьей шерсти", "pinsel"], ["Große Fläche mit dem Flachpinsel", "Большая площадь плоской кистью", "pinsel"], ["Bunte Tupfen für Konfetti", "Цветные точки для конфетти", "finger"]]),
      ende("Klasse, {name}! Probier mal, ein Bild nur aus Tupfen zu malen – wie Seurat.", "Класс, {name}! Попробуй нарисовать картину только из точек – как Сёра.")
    ] });
  ku({ id: "ku-linie", lb: "ku1", kl: 2, lz: ["ku.ge.02"], name: "Punkt, Linie, Muster", e: "〰️", farbe: "#7B55B8", grund: "#F1EAFF",
    kurz: "Linien zeigen Bewegung, Muster fortsetzen, digital malen", schritte: [
      info("Eine Linie geht spazieren", "〰️", "Der Maler Paul Klee hat gesagt: Eine Linie geht spazieren. Linien können gerade, gebogen, zackig oder wellig sein – sie zeigen Bewegung.",
        "Художник Пауль Клее говорил: линия идёт гулять. Линии бывают прямые, изогнутые, зубчатые или волнистые – они показывают движение."),
      wahl("Welche Linie passt zu einem Gewitter-Blitz?", "Какая линия подходит к молнии?", "⚡",
        ["Zackig", "Зубчатая", "Richtig! Zackige Linien wirken schnell und wild.", "Правильно! Зубчатые линии кажутся быстрыми и дикими."],
        ["Wellig", "Волнистая", "Wellen passen eher zu Wasser.", "Волны больше подходят к воде."],
        ["Kreisrund", "Круглая", "Ein Kreis passt eher zur Sonne.", "Круг больше подходит к солнцу."]),
      wahl("Wie geht das Muster weiter? 🔴🔵🔴🔵🔴 …", "Как продолжается узор? 🔴🔵🔴🔵🔴 …", "🔁",
        ["🔵", "🔵", "Genau! Rot und Blau wechseln sich immer ab.", "Точно! Красный и синий всегда чередуются."],
        ["🔴", "🔴", "Schau genau: nach Rot kommt immer Blau.", "Посмотри внимательно: после красного всегда синий."],
        ["🟢", "🟢", "Grün kommt in dem Muster gar nicht vor.", "Зелёного в этом узоре нет."]),
      daumen("Aus vielen Punkten kann man ein Bild machen.", "Из множества точек можно сделать картину.", "⚫", true,
        "Stimmt! Punkte können eng oder locker liegen, groß oder klein sein.", "Верно! Точки могут лежать густо или редко, быть большими или маленькими."),
      daumen("Auf dem Tablet kann man nicht malen und zeichnen.", "На планшете нельзя рисовать.", "📱", false,
        "Doch! Mit einem Malprogramm kannst du digital malen – zum Beispiel im Atelier.", "Можно! В программе для рисования можно рисовать цифрово – например, в ателье."),
      ende("Toll, {name}! Mal im Atelier ein Bild nur aus Linien: gerade, wellig, zackig.", "Здорово, {name}! Нарисуй в ателье картину только из линий: прямых, волнистых, зубчатых.")
    ] });
  ku({ id: "ku-drucken", lb: "ku1", kl: 2, lz: ["ku.ge.02"], name: "Drucken und Stempeln", e: "🥔", farbe: "#C2337A", grund: "#FFEAF3",
    kurz: "Finger-, Stempel- und Materialdruck, Abdrücke, Spiegelbild", schritte: [
      info("Drucken", "🥔", "Beim Drucken bringst du Farbe auf einen Gegenstand und drückst ihn aufs Papier. So entsteht ein Abdruck – immer wieder gleich.",
        "При печати ты наносишь краску на предмет и прижимаешь его к бумаге. Получается отпечаток – каждый раз одинаковый.",
        [["Stempeln mit Korken, Kartoffel, Radiergummi", "Печать пробкой, картошкой, ластиком"], ["Abdrücke in Sand, Schnee oder Knete", "Отпечатки на песке, снегу или пластилине"]]),
      wahl("Du stempelst den Buchstaben R. Wie sieht der Abdruck aus?", "Ты печатаешь букву R. Как выглядит отпечаток?", "🔁",
        ["Spiegelverkehrt", "Зеркально", "Richtig! Ein Stempel druckt alles spiegelverkehrt. Darum muss man Buchstaben verkehrt herum schnitzen.", "Правильно! Штамп печатает всё зеркально. Поэтому буквы вырезают наоборот."],
        ["Genau gleich", "Точно так же", "Nein, der Abdruck ist gespiegelt.", "Нет, отпечаток зеркальный."],
        ["Auf dem Kopf", "Вверх ногами", "Nicht auf dem Kopf – aber gespiegelt.", "Не вверх ногами – а зеркально."]),
      zuordnen("Was kann man zum Drucken nehmen?", "Чем можно печатать?", [["ja", "Gut zum Drucken", "Подходит для печати", "✅"], ["nein", "Geht nicht", "Не подходит", "❌"]],
        [["Ein Blatt vom Baum", "Лист с дерева", "ja"], ["Eine halbe Kartoffel", "Половина картошки", "ja"], ["Ein Glas Wasser", "Стакан воды", "nein"]]),
      daumen("Beim Abklatsch faltest du ein Blatt mit nasser Farbe zusammen – beide Seiten werden gleich.", "При монотипии-«отпечатке» складываешь лист с мокрой краской – обе половины становятся одинаковыми.", "🦋", true,
        "Stimmt! So entstehen zum Beispiel bunte Schmetterlinge.", "Верно! Так получаются, например, яркие бабочки."),
      ende("Super, {name}! Druck zu Hause ein Muster mit einem Korken oder deinem Finger.", "Супер, {name}! Напечатай дома узор пробкой или пальцем.")
    ] });
  ku({ id: "ku-formen", lb: "ku1", kl: 2, lz: ["ku.ge.02"], name: "Formen und Bildaufbau", e: "🔷", farbe: "#1F8F8A", grund: "#E6F7F5",
    kurz: "rund und eckig, offen und geschlossen, Reihen und Streuen, Collage, Buchstaben als Bild", schritte: [
      info("Formen haben Gegensätze", "🔷", "Formen können rund oder eckig sein, offen oder geschlossen, gebaut wie ein Haus oder gewachsen wie ein Baum.",
        "Формы бывают круглыми или угловатыми, открытыми или закрытыми, построенными, как дом, или выросшими, как дерево."),
      zuordnen("Gebaut oder gewachsen?", "Построено или выросло?", [["gebaut", "Gebaut", "Построено", "🏠"], ["gewachsen", "Gewachsen", "Выросло", "🌳"]],
        [["Brücke", "Мост", "gebaut"], ["Hochhaus", "Высотный дом", "gebaut"], ["Blume", "Цветок", "gewachsen"], ["Schneckenhaus", "Раковина улитки", "gewachsen"]]),
      wahl("Du legst Muscheln in eine lange Reihe nebeneinander. Wie heißt diese Bildordnung?", "Ты выкладываешь ракушки в длинный ряд. Как называется такой порядок?", "🐚",
        ["Reihen", "Ряд", "Genau! Andere Ordnungen sind Ballen (eng zusammen) und Streuen (überall verteilt).", "Точно! Другие порядки – скопление (тесно вместе) и рассыпание (повсюду)."],
        ["Streuen", "Рассыпание", "Beim Streuen liegen die Dinge überall verteilt.", "При рассыпании вещи лежат повсюду."],
        ["Ballen", "Скопление", "Beim Ballen liegen die Dinge eng zusammen.", "При скоплении вещи лежат тесно вместе."]),
      wahl("Ein Bild aus aufgeklebten Papierschnipseln, Zeitung und Stoff heißt …", "Картина из наклеенных кусочков бумаги, газеты и ткани называется …", "✂️",
        ["Collage", "коллаж", "Richtig! Das Wort kommt vom französischen „coller“ – kleben.", "Правильно! Слово от французского «coller» – клеить."],
        ["Skulptur", "скульптура", "Eine Skulptur ist eine Figur zum Herumgehen.", "Скульптура – объёмная фигура."],
        ["Fotografie", "фотография", "Nein, hier wird geklebt.", "Нет, здесь клеят."]),
      daumen("Buchstaben und Ziffern können selbst ein Kunstwerk sein.", "Буквы и цифры сами могут быть произведением искусства.", "🔠", true,
        "Stimmt! Künstler wie Paul Klee haben Buchstaben in Bilder gemalt. Du kannst Buchstaben aus Zweigen, Besteck oder Steinen legen.", "Верно! Художники, как Пауль Клее, рисовали буквы в картинах. Можно выложить буквы из веток, ложек или камней."),
      ende("Klasse, {name}! Leg deinen Namen aus Dingen, die du findest – Steine, Stifte, Nudeln.", "Класс, {name}! Выложи своё имя из того, что найдёшь – камней, карандашей, макарон.")
    ] });
  ku({ id: "ku-plastik", lb: "ku2", kl: 2, lz: ["ku.ge.03"], name: "Kneten, formen, bauen", e: "🏺", farbe: "#B5651D", grund: "#FFF1E3",
    kurz: "Plastik, modellieren, antragen und abtragen, Räume gestalten", schritte: [
      info("Kunst zum Anfassen", "🏺", "Eine Plastik ist ein Kunstwerk, um das man herumgehen kann. Du kannst sie kneten, rollen, drücken und aus Ton, Knete, Sand oder Schnee formen.",
        "Пластика – это произведение искусства, вокруг которого можно обойти. Её можно мять, катать, давить и лепить из глины, пластилина, песка или снега."),
      zuordnen("Kann man es formen?", "Можно ли из этого лепить?", [["formbar", "Weich und formbar", "Мягкое, можно лепить", "🤲"], ["fest", "Fest", "Твёрдое", "🪨"]],
        [["Ton", "Глина", "formbar"], ["Salzteig", "Солёное тесто", "formbar"], ["Stein", "Камень", "fest"], ["Glas", "Стекло", "fest"]]),
      wahl("Du drückst ein Stück Knete an deine Figur an, damit sie eine Nase bekommt. Wie heißt das?", "Ты прилепляешь кусочек пластилина к фигуре, чтобы получился нос. Как это называется?", "👃",
        ["Antragen", "Налепливание", "Richtig! Wegnehmen heißt Abtragen.", "Правильно! Убирать – значит снимать."],
        ["Abtragen", "Снимание", "Abtragen ist Wegnehmen – hier kommt etwas dazu.", "Снимать – значит убирать, а здесь добавляется."],
        ["Malen", "Рисование", "Nein, hier wird geformt, nicht gemalt.", "Нет, здесь лепят, а не рисуют."]),
      daumen("Auch Tiere sind Baumeister: Biber, Vögel und Bienen bauen besondere Räume.", "Животные тоже строители: бобры, птицы и пчёлы строят особые помещения.", "🦫", true,
        "Stimmt! Ein Biberbau, ein Nest oder Bienenwaben – Künstler schauen sich solche Formen gern an.", "Верно! Хатка бобра, гнездо или соты – художники любят рассматривать такие формы."),
      daumen("Mit Kartons und Papprollen kann man keine Kunst machen.", "Из коробок и картонных втулок искусство не сделаешь.", "📦", false,
        "Doch! Aus Kartons, Korken und Naturfundstücken kann man tolle Figuren und ganze Städte bauen.", "Можно! Из коробок, пробок и природных находок строят отличные фигуры и целые города."),
      ende("Super, {name}! Knete ein kleines Tier und schau es von allen Seiten an.", "Супер, {name}! Слепи маленькое животное и рассмотри его со всех сторон.")
    ] });
  ku({ id: "ku-sinne", lb: "ku3", kl: 2, lz: ["ku.be.01"], name: "Kunst mit allen Sinnen", e: "🖼️", farbe: "#E0A800", grund: "#FFF7D6",
    kurz: "Bilder genau ansehen, Geräusche zum Bild, Körper und Gefühle zeigen", schritte: [
      info("Ein Bild entdecken", "🖼️", "Der Maler Pieter Bruegel hat vor fast 500 Jahren das Bild „Die Kinderspiele“ gemalt. Darauf spielen über 200 Kinder – mit Reifen, Stelzen und Murmeln.",
        "Художник Питер Брейгель почти 500 лет назад написал картину «Детские игры». На ней играют больше 200 детей – с обручами, ходулями и шариками.",
        [["Spiel: Ich sehe was, was du nicht siehst", "Игра: я вижу то, чего не видишь ты"], ["Erfinde einen Titel oder eine Geschichte zum Bild", "Придумай название или историю к картине"]]),
      wahl("Du schaust ein Bild vom Meer an. Welches Geräusch passt dazu?", "Ты смотришь на картину с морем. Какой звук к ней подходит?", "🌊",
        ["Rauschen und Möwen", "Шум волн и чайки", "Genau! Man kann sich zu Bildern Geräusche ausdenken.", "Точно! К картинам можно придумывать звуки."],
        ["Hupen und Bremsen", "Гудки и тормоза", "Das passt eher zu einer Stadt.", "Это больше подходит к городу."],
        ["Kuhglocken", "Коровьи колокольчики", "Das passt eher zu einer Bergwiese.", "Это больше подходит к горному лугу."]),
      wahl("Jemand macht sich ganz klein und kauert sich zusammen. Was zeigt er vielleicht?", "Кто-то сжимается в комочек. Что он, может быть, показывает?", "🧍",
        ["Angst oder Traurigkeit", "Страх или грусть", "Richtig! Mit dem Körper kann man Gefühle zeigen – wie in einem Standbild.", "Правильно! Телом можно показывать чувства – как в «живой картине»."],
        ["Große Freude", "Большую радость", "Bei Freude streckt man sich eher und springt.", "От радости скорее тянутся и прыгают."],
        ["Stolz", "Гордость", "Stolze Menschen stehen eher aufrecht.", "Гордые люди стоят скорее прямо."]),
      daumen("Masken und Verkleiden können die Wirkung eines Menschen ganz verändern.", "Маски и переодевание могут совсем изменить, как человек выглядит.", "🎭", true,
        "Stimmt! Probier vor dem Spiegel: Wie wirkst du mit Hut, Schal oder Maske?", "Верно! Попробуй перед зеркалом: как ты выглядишь в шляпе, шарфе или маске?"),
      ende("Toll, {name}! Spielt zu zweit Spiegelbild: Einer macht vor, der andere macht genau nach.", "Здорово, {name}! Поиграйте вдвоём в зеркало: один показывает, другой повторяет.")
    ] });

  ku({ id: "ku-farbgefuehl", lb: "ku1", stufe: 3, lz: ["ku.ge.01"], name: "Farben machen Stimmung", e: "🌈", farbe: "#FF9636", grund: "#FFF1E3",
    kurz: "warme und kalte Farben, Kontraste, Signalfarben, Farben trüben", schritte: [
      info("Farben und Gefühle", "🌈", "Farben wirken auf uns: Rot, Orange und Gelb wirken warm. Blau, Türkis und Grünblau wirken kalt. Maler nutzen das für Stimmungen.",
        "Цвета влияют на нас: красный, оранжевый и жёлтый кажутся тёплыми. Синий, бирюзовый и сине-зелёный – холодными. Художники используют это для настроения."),
      zuordnen("Warm oder kalt?", "Тёплый или холодный?", [["warm", "Warme Farbe", "Тёплый цвет", "🔥"], ["kalt", "Kalte Farbe", "Холодный цвет", "❄️"]],
        [["Orange", "Оранжевый", "warm"], ["Rot", "Красный", "warm"], ["Eisblau", "Ледяной синий", "kalt"], ["Türkis", "Бирюзовый", "kalt"]]),
      wahl("Warum sind Feuerwehrautos und Stoppschilder rot?", "Почему пожарные машины и знаки «Стоп» красные?", "🚒",
        ["Rot fällt sofort auf und warnt", "Красный сразу заметен и предупреждает", "Richtig! Rot ist eine Signalfarbe. Auch Gelb warnt, zum Beispiel bei Baustellen.", "Правильно! Красный – сигнальный цвет. Жёлтый тоже предупреждает, например на стройках."],
        ["Rot ist am billigsten", "Красная краска самая дешёвая", "Nein, Rot wird gewählt, weil es auffällt.", "Нет, красный выбирают, потому что он бросается в глаза."],
        ["Rot macht müde", "Красный усыпляет", "Nein, Rot macht eher wach und aufmerksam.", "Нет, красный скорее бодрит и привлекает внимание."]),
      wahl("Du mischst zu einem leuchtenden Rot ein wenig Grau. Was passiert?", "Ты добавляешь к яркому красному немного серого. Что происходит?", "🎨",
        ["Das Rot wird stumpfer (getrübt)", "Красный становится тусклее (приглушённым)", "Genau! Das nennt man trüben. Die Farbe wirkt dann ruhiger.", "Точно! Это называется приглушить. Цвет становится спокойнее."],
        ["Das Rot leuchtet mehr", "Красный ярче светится", "Nein, Grau nimmt dem Rot die Leuchtkraft.", "Нет, серый забирает у красного яркость."],
        ["Es wird Grün", "Становится зелёным", "Nein, mit Grau bleibt es ein Rot – nur stumpfer.", "Нет, с серым он остаётся красным – только тусклее."]),
      daumen("Rot neben Grün leuchtet besonders stark – das nennt man Kontrast.", "Красный рядом с зелёным светится особенно сильно – это называется контраст.", "farbkreis", true,
        "Stimmt! Farben, die sich im Farbkreis gegenüberliegen, verstärken sich gegenseitig.", "Верно! Цвета, которые лежат друг напротив друга в цветовом круге, усиливают друг друга."),
      ende("Super, {name}! Mal ein fröhliches Bild nur mit warmen Farben und ein ruhiges nur mit kalten.", "Супер, {name}! Нарисуй весёлую картину только тёплыми цветами и спокойную – только холодными.")
    ] });
  ku({ id: "ku-hell-dunkel", lb: "ku1", stufe: 3, lz: ["ku.ge.02"], name: "Hell, dunkel und Strukturen", e: "🌗", farbe: "#2E2230", grund: "#EFEFF5",
    kurz: "Hell-Dunkel-Kontrast, Oberflächen, Frottage, Monotypie, optische Täuschungen", schritte: [
      info("Hell und dunkel", "🌗", "Mit Bleistift, Kohle oder Tusche kannst du ohne Farbe zeichnen – nur mit hell und dunkel. Albrecht Dürer hat so vor 500 Jahren ganz genaue Bilder gemacht.",
        "Карандашом, углём или тушью можно рисовать без цвета – только светлым и тёмным. Альбрехт Дюрер 500 лет назад так делал очень точные картины."),
      wahl("Du legst Papier auf eine Baumrinde und reibst mit Wachsmalstift darüber. Wie heißt das?", "Ты кладёшь бумагу на кору дерева и трёшь восковым мелком. Как это называется?", "🌳",
        ["Frottage", "Фроттаж", "Richtig! So machst du Oberflächen und Strukturen sichtbar.", "Правильно! Так становятся видны поверхности и структуры."],
        ["Collage", "Коллаж", "Bei einer Collage wird geklebt.", "В коллаже клеят."],
        ["Aquarell", "Акварель", "Ein Aquarell malt man mit Wasserfarben.", "Акварель пишут водяными красками."]),
      wahl("Bei einer Monotypie entsteht …", "При монотипии получается …", "🖨️",
        ["nur ein einziger Abdruck", "только один отпечаток", "Genau! „Mono“ heißt „eins“. Jeder Druck ist ein Einzelstück.", "Точно! «Моно» значит «один». Каждый отпечаток уникален."],
        ["ein Abdruck für hundert Bilder", "отпечаток для ста картин", "Nein, bei der Monotypie gibt es nur einen Druck.", "Нет, при монотипии получается только один отпечаток."],
        ["ein Foto", "фотография", "Nein, es ist ein Druckverfahren.", "Нет, это способ печати."]),
      daumen("Eine optische Täuschung ist ein Bild, das unsere Augen hereinlegt.", "Оптическая иллюзия – это картинка, которая обманывает наши глаза.", "👀", true,
        "Stimmt! Der Künstler M. C. Escher hat Treppen gezeichnet, die immer weiter nach oben zu gehen scheinen.", "Верно! Художник М. К. Эшер рисовал лестницы, которые будто бы всё время идут вверх."),
      zuordnen("Wie fühlt sich die Oberfläche an?", "Какая поверхность на ощупь?", [["glatt", "Glatt", "Гладкая", "🪞"], ["rau", "Rau", "Шершавая", "🪵"]],
        [["Spiegel", "Зеркало", "glatt"], ["Glasflasche", "Стеклянная бутылка", "glatt"], ["Baumrinde", "Кора дерева", "rau"], ["Schleifpapier", "Наждачная бумага", "rau"]]),
      ende("Klasse, {name}! Such drei Oberflächen zu Hause und mach von jeder eine Frottage.", "Класс, {name}! Найди дома три поверхности и сделай с каждой фроттаж.")
    ] });
  ku({ id: "ku-bildraum", lb: "ku1", stufe: 3, lz: ["ku.be.01"], name: "Vorne und hinten im Bild", e: "🏞️", farbe: "#3BAA5C", grund: "#E8F7EC",
    kurz: "Raumwirkung durch Überdecken, Größe und Farbe, Figur und Grund", schritte: [
      info("Ein flaches Bild mit Tiefe", "🏞️", "Ein Bild ist flach – trotzdem kann es so aussehen, als ginge es weit nach hinten. Dafür gibt es Tricks.",
        "Картина плоская – и всё же может казаться, что она уходит далеко вглубь. Для этого есть приёмы.",
        [["Was vorne ist, verdeckt, was hinten ist.", "То, что впереди, закрывает то, что сзади."], ["Hinten wird alles kleiner.", "Сзади всё становится меньше."], ["Hinten werden die Farben blasser und bläulicher.", "Сзади цвета бледнее и голубее."]]),
      wahl("Zwei gleich große Bäume: Einer ist im Bild klein gemalt. Wo steht er?", "Два одинаковых дерева: одно нарисовано маленьким. Где оно стоит?", "🌲",
        ["Weiter hinten", "Дальше", "Richtig! Was weiter weg ist, sieht kleiner aus.", "Правильно! То, что дальше, выглядит меньше."],
        ["Ganz vorne", "Совсем впереди", "Vorne würde er groß aussehen.", "Впереди оно выглядело бы большим."],
        ["Er ist kaputt", "Оно сломано", "Nein – so zeigt der Maler, dass er weit weg ist.", "Нет – так художник показывает, что оно далеко."]),
      daumen("Berge ganz hinten im Bild malt man oft blasser und bläulicher.", "Горы далеко на картине часто рисуют бледнее и голубее.", "🏔️", true,
        "Stimmt! Das ist wie in echt: Durch die Luft sehen ferne Berge blau aus.", "Верно! Как в жизни: сквозь воздух далёкие горы кажутся голубыми."),
      wahl("Das wichtigste Ding im Bild soll auffallen. Was hilft?", "Самое важное на картине должно выделяться. Что помогает?", "⭐",
        ["Es groß und in die Mitte malen", "Нарисовать его большим и в середине", "Genau! Man kann es auch mit einer starken Farbe hervorheben.", "Точно! Его можно ещё выделить ярким цветом."],
        ["Es ganz klein in die Ecke malen", "Нарисовать его маленьким в углу", "Dann übersieht man es leicht.", "Тогда его легко не заметить."],
        ["Es übermalen", "Закрасить его", "Dann sieht man es gar nicht mehr.", "Тогда его совсем не видно."]),
      ende("Super, {name}! Mal eine Landschaft mit einem großen Baum vorne und kleinen Bäumen hinten.", "Супер, {name}! Нарисуй пейзаж с большим деревом впереди и маленькими деревьями сзади.")
    ] });
  ku({ id: "ku-schrift-foto", lb: "ku1", stufe: 3, lz: ["ku.ge.02", "me.sa.01"], name: "Schrift, Foto und Bildrechte", e: "📷", farbe: "#2F86C8", grund: "#EAF4FC",
    kurz: "Schrift als Kunst, Monogramm, Lochkamera, Bildausschnitt, Fotos von anderen", schritte: [
      info("Schrift und Foto als Kunst", "📷", "Schrift kann schön gestaltet sein – als Plakat, Monogramm oder Geheimschrift. Und auch Fotos sind Kunst: Was nehme ich ins Bild, was lasse ich weg?",
        "Шрифт можно красиво оформить – как плакат, монограмму или тайнопись. И фотографии тоже искусство: что я беру в кадр, а что оставляю?"),
      wahl("Ein Monogramm ist …", "Монограмма – это …", "🔠",
        ["ein Zeichen aus den Anfangsbuchstaben eines Namens", "знак из первых букв имени", "Richtig! Zum Beispiel M und K, schön ineinander verschlungen.", "Правильно! Например, М и К, красиво переплетённые."],
        ["ein langer Brief", "длинное письмо", "Nein, es ist ein kurzes Zeichen aus Buchstaben.", "Нет, это короткий знак из букв."],
        ["ein Musikinstrument", "музыкальный инструмент", "Nein, das ist ein Zeichen aus Buchstaben.", "Нет, это знак из букв."]),
      daumen("Eine Lochkamera ist eine dunkle Schachtel mit einem kleinen Loch – darin steht das Bild auf dem Kopf.", "Камера-обскура – тёмная коробка с маленькой дыркой; изображение в ней перевёрнуто.", "📦", true,
        "Stimmt! Das Licht geht gerade durch das Loch – oben und unten tauschen. So haben die ersten Fotoapparate funktioniert.", "Верно! Свет идёт прямо через дырку – верх и низ меняются местами. Так работали первые фотоаппараты."),
      wahl("Du hast ein lustiges Foto von deiner Freundin gemacht. Darfst du es einfach ins Internet stellen?", "Ты сделал смешное фото подруги. Можно просто выложить его в интернет?", "🙋",
        ["Nein, erst fragen – sie entscheidet über ihr Bild", "Нет, сначала спросить – она решает о своём фото", "Richtig! Jeder Mensch hat das Recht am eigenen Bild. Frag immer vorher.", "Правильно! У каждого есть право на своё изображение. Всегда спрашивай заранее."],
        ["Ja, es ist ja mein Foto", "Да, это же моё фото", "Nein, auf dem Foto ist sie zu sehen – sie muss es erlauben.", "Нет, на фото она – она должна разрешить."],
        ["Ja, wenn es lustig ist", "Да, если оно смешное", "Gerade lustige Fotos können peinlich sein. Erst fragen!", "Именно смешные фото могут быть неловкими. Сначала спроси!"]),
      daumen("Bilder aus dem Internet darf man immer verwenden, wie man will.", "Картинки из интернета всегда можно использовать как хочешь.", "🌐", false,
        "Nein! Bilder gehören dem, der sie gemacht hat (Urheberrecht). Frag einen Erwachsenen, welche Bilder erlaubt sind.", "Нет! Картинки принадлежат тому, кто их сделал (авторское право). Спроси взрослого, какие картинки можно брать."),
      ende("Klasse, {name}! Erfinde dein eigenes Monogramm aus deinen Anfangsbuchstaben.", "Класс, {name}! Придумай свою монограмму из первых букв.")
    ] });
  ku({ id: "ku-bildhauer", lb: "ku2", stufe: 3, lz: ["ku.ge.03"], name: "Bildhauer, Design und Land-Art", e: "🗿", farbe: "#8A6D3B", grund: "#F7F0E3",
    kurz: "Bildhauer und ihre Arbeit, Montage aus Fundstücken, Gebrauchsdinge gestalten, Kunst in der Natur", schritte: [
      info("Bildhauer", "🗿", "Bildhauer machen Figuren aus Stein, Holz, Ton oder Metall. Michelangelo hat vor 500 Jahren die große Figur „David“ aus einem Marmorblock geschlagen.",
        "Скульпторы делают фигуры из камня, дерева, глины или металла. Микеланджело 500 лет назад высек большую статую «Давид» из мраморной глыбы."),
      zuordnen("Kommt Material dazu oder weg?", "Материал добавляют или убирают?", [["weg", "Material kommt weg", "Материал убирают", "⛏️"], ["dazu", "Material kommt dazu", "Материал добавляют", "🤲"]],
        [["Aus Stein meißeln", "Высекать из камня", "weg"], ["Aus Holz schnitzen", "Вырезать из дерева", "weg"], ["Mit Ton aufbauen", "Лепить из глины", "dazu"]]),
      wahl("Aus alten Dosen, Draht und Korken baust du eine Figur. Wie heißt das?", "Из старых банок, проволоки и пробок ты строишь фигуру. Как это называется?", "♻️",
        ["Montage aus Fundstücken (Upcycling)", "Монтаж из находок (апсайклинг)", "Richtig! Aus Altem wird etwas Neues – gut für die Umwelt.", "Правильно! Из старого получается новое – хорошо для природы."],
        ["Malerei", "Живопись", "Nein, hier wird gebaut, nicht gemalt.", "Нет, здесь строят, а не рисуют."],
        ["Kalligrafie", "Каллиграфия", "Kalligrafie ist Schönschrift.", "Каллиграфия – это красивое письмо."]),
      daumen("Design heißt: Ein Ding soll gut aussehen und gut funktionieren – wie eine Tasse, die schön ist und nicht kippt.", "Дизайн значит: вещь должна хорошо выглядеть и хорошо работать – как красивая чашка, которая не опрокидывается.", "☕", true,
        "Stimmt! Designer gestalten Möbel, Geschirr, Kleidung und vieles mehr.", "Верно! Дизайнеры создают мебель, посуду, одежду и многое другое."),
      wahl("Ein Künstler legt im Wald einen Kreis aus bunten Blättern. Das nennt man …", "Художник выкладывает в лесу круг из ярких листьев. Это называется …", "🍂",
        ["Land-Art", "ленд-арт", "Genau! Land-Art ist Kunst in und mit der Natur. Andy Goldsworthy macht so etwas.", "Точно! Ленд-арт – искусство в природе и из природы. Так делает Энди Голдсуорси."],
        ["Comic", "комикс", "Ein Comic ist eine Bildergeschichte.", "Комикс – это история в картинках."],
        ["Porträt", "портрет", "Ein Porträt zeigt einen Menschen.", "Портрет изображает человека."]),
      ende("Super, {name}! Bau aus Fundstücken eine kleine Figur und gib ihr einen Namen.", "Супер, {name}! Построй из находок маленькую фигуру и дай ей имя.")
    ] });
  ku({ id: "ku-aktion3", lb: "ku3", stufe: 3, lz: ["ku.be.01"], name: "Lebende Bilder und Schattenspiel", e: "🎭", farbe: "#C2337A", grund: "#FFEAF3",
    kurz: "Kunstwerke spielerisch entdecken, Pantomime, Standbilder, Schattenfiguren", schritte: [
      info("Kunst spielen", "🎭", "Ein Kunstwerk kann man auch mit dem Körper entdecken: nachstellen, in Zeitlupe bewegen, ihm einen Brief schreiben oder ein Elfchen dichten.",
        "Произведение искусства можно изучить и телом: изобразить, двигаться в замедленной съёмке, написать ему письмо или стихотворение-элфчен."),
      wahl("Beim Pantomime-Spiel …", "В пантомиме …", "🤐",
        ["spielt man ohne Worte, nur mit Mimik und Gesten", "играют без слов, только мимикой и жестами", "Richtig! Die anderen raten, was du darstellst.", "Правильно! Другие угадывают, что ты показываешь."],
        ["singt man laut", "громко поют", "Nein, bei Pantomime spricht und singt man nicht.", "Нет, в пантомиме не говорят и не поют."],
        ["malt man ein Bild", "рисуют картину", "Nein, man spielt mit dem Körper.", "Нет, играют телом."]),
      daumen("Ein lebendes Bild heißt: Menschen stellen ein Gemälde nach und bleiben ganz still stehen.", "«Живая картина» значит: люди изображают картину и стоят совсем неподвижно.", "🧍", true,
        "Stimmt! Wie eingefroren – dann kann man es fotografieren.", "Верно! Как замороженные – потом можно сфотографировать."),
      wahl("Was brauchst du für ein Schattenspiel?", "Что нужно для театра теней?", "🔦",
        ["Licht, eine helle Wand und Figuren", "Свет, светлую стену и фигуры", "Genau! Die Figuren stehen zwischen Licht und Wand.", "Точно! Фигуры стоят между светом и стеной."],
        ["Viel Wasser", "Много воды", "Nein, für Schatten brauchst du Licht.", "Нет, для теней нужен свет."],
        ["Ganz dunkel, ohne Licht", "Полную темноту без света", "Ohne Licht gibt es keinen Schatten.", "Без света нет тени."]),
      ende("Toll, {name}! Mach mit einer Taschenlampe Schattentiere an der Wand.", "Здорово, {name}! Сделай фонариком теневых животных на стене.")
    ] });

  ku({ id: "ku-gemaelde", lb: "ku1", stufe: 4, lz: ["ku.be.01"], name: "Porträt, Landschaft, Stillleben", e: "🖼️", farbe: "#8E5BC8", grund: "#F3ECFF",
    kurz: "Bildarten, Gemälde und Grafik, berühmte Werke, Farbe verändern", schritte: [
      info("Bildarten", "🖼️", "Maler malen seit Jahrhunderten bestimmte Bildarten. Ein Gemälde ist mit Farbe gemalt, eine Grafik ist gezeichnet oder gedruckt.",
        "Художники веками пишут определённые жанры. Картина написана красками, графика нарисована или напечатана.",
        [["Porträt: ein Mensch", "Портрет: человек"], ["Landschaft: Natur, Berge, Felder", "Пейзаж: природа, горы, поля"], ["Stillleben: Dinge wie Obst, Blumen, Vasen", "Натюрморт: вещи – фрукты, цветы, вазы"]]),
      zuordnen("Welche Bildart ist das?", "Какой это жанр?", [["portraet", "Porträt", "Портрет", "🧑"], ["landschaft", "Landschaft", "Пейзаж", "🏞️"], ["stillleben", "Stillleben", "Натюрморт", "🍎"]],
        [["Eine Frau mit Perlenohrring", "Женщина с жемчужной серёжкой", "portraet"], ["Ein Sonnenaufgang über dem Meer", "Восход солнца над морем", "landschaft"], ["Äpfel und eine Kanne auf dem Tisch", "Яблоки и кувшин на столе", "stillleben"]]),
      wahl("Giuseppe Arcimboldo hat Gesichter gemalt – woraus bestehen sie?", "Джузеппе Арчимбольдо рисовал лица – из чего они состоят?", "🍐",
        ["Aus Obst, Gemüse und Blumen", "Из фруктов, овощей и цветов", "Richtig! Die Nase ist eine Birne, die Wangen sind Äpfel – lustig und genial.", "Правильно! Нос – груша, щёки – яблоки: смешно и гениально."],
        ["Aus Zahlen", "Из цифр", "Nein, aus Obst und Gemüse.", "Нет, из фруктов и овощей."],
        ["Aus Autos", "Из машин", "Nein – vor 450 Jahren gab es keine Autos.", "Нет – 450 лет назад машин не было."]),
      daumen("Franz Marc hat ein Pferd blau gemalt, obwohl es keine blauen Pferde gibt.", "Франц Марк нарисовал лошадь синей, хотя синих лошадей не бывает.", "🐎", true,
        "Stimmt! Künstler dürfen die Gegenstandsfarbe verändern, um Gefühle zu zeigen. Blau stand für ihn für Ruhe.", "Верно! Художники могут менять цвет предмета, чтобы показать чувства. Синий для него значил спокойствие."),
      wahl("Leonardo da Vinci hat ein berühmtes Porträt mit einem geheimnisvollen Lächeln gemalt. Wie heißt es?", "Леонардо да Винчи написал знаменитый портрет с загадочной улыбкой. Как он называется?", "🙂",
        ["Mona Lisa", "Мона Лиза", "Genau! Sie hängt im Louvre in Paris.", "Точно! Она висит в Лувре в Париже."],
        ["Die Sternennacht", "Звёздная ночь", "Die Sternennacht ist von Vincent van Gogh – eine Landschaft.", "«Звёздная ночь» – это Ван Гог, пейзаж."],
        ["Das blaue Pferd", "Синяя лошадь", "Das ist von Franz Marc.", "Это Франц Марк."]),
      ende("Super, {name}! Mal ein Stillleben: Stell drei Dinge auf den Tisch und mal sie ab.", "Супер, {name}! Нарисуй натюрморт: поставь три вещи на стол и нарисуй их.")
    ] });
  ku({ id: "ku-medienbild", lb: "ku1", stufe: 4, lz: ["ku.be.02", "me.ar.01"], name: "Bilder in Werbung und Medien", e: "📰", farbe: "#E0574A", grund: "#FFECE8",
    kurz: "Werbebilder prüfen, Plakate mit Wort und Bild, Comic, Pop-Art, Logos", schritte: [
      info("Bilder wollen etwas", "📰", "Bilder in Werbung, auf Plakaten und im Internet sind gestaltet, damit sie wirken: Sie sollen auffallen, gefallen oder zum Kaufen bringen.",
        "Картинки в рекламе, на плакатах и в интернете созданы, чтобы действовать: привлекать внимание, нравиться или заставлять покупать."),
      wahl("Auf einem Werbefoto sieht ein Burger riesig und perfekt aus. Was stimmt?", "На рекламном фото бургер огромный и идеальный. Что верно?", "🍔",
        ["Das Foto ist geschönt – in echt sieht er oft anders aus", "Фото приукрашено – на самом деле он часто выглядит иначе", "Richtig! Werbebilder werden extra schön gemacht und oft bearbeitet.", "Правильно! Рекламные фото специально делают красивыми и часто обрабатывают."],
        ["Genau so bekommst du ihn immer", "Именно такой ты всегда получишь", "Leider nein – Werbefotos sind gestellt und bearbeitet.", "К сожалению, нет – рекламные фото постановочные и обработанные."],
        ["Werbung zeigt immer die Wahrheit", "Реклама всегда показывает правду", "Nein, Werbung will verkaufen und zeigt nur die schönste Seite.", "Нет, реклама хочет продать и показывает только лучшую сторону."]),
      wahl("Andy Warhol hat das gleiche Bild einer Suppendose viele Male nebeneinander gedruckt. Diese Kunst heißt …", "Энди Уорхол много раз печатал рядом одну и ту же банку супа. Это искусство называется …", "🥫",
        ["Pop-Art", "поп-арт", "Genau! Pop-Art nimmt Dinge aus Werbung und Alltag.", "Точно! Поп-арт берёт вещи из рекламы и повседневной жизни."],
        ["Land-Art", "ленд-арт", "Land-Art ist Kunst in der Natur.", "Ленд-арт – искусство в природе."],
        ["Höhlenmalerei", "наскальная живопись", "Höhlenmalerei ist viele tausend Jahre alt.", "Наскальной живописи многие тысячи лет."]),
      zuordnen("Was ist das?", "Что это?", [["logo", "Logo oder Piktogramm", "Логотип или пиктограмма", "🚻"], ["comic", "Comic", "Комикс", "💬"]],
        [["Ein Zeichen für das WC am Bahnhof", "Знак туалета на вокзале", "logo"], ["Das Zeichen einer Firma auf dem Turnschuh", "Знак фирмы на кроссовке", "logo"], ["Bilder mit Sprechblasen", "Картинки с облачками для слов", "comic"]]),
      daumen("Ein gutes Plakat braucht wenige, große Wörter und ein Bild, das sofort auffällt.", "Хорошему плакату нужны немногие большие слова и картинка, которая сразу бросается в глаза.", "🪧", true,
        "Stimmt! Plakate sieht man oft nur im Vorbeigehen – darum müssen sie schnell wirken.", "Верно! Плакаты часто видят мимоходом – поэтому они должны действовать быстро."),
      ende("Klasse, {name}! Gestalte ein Plakat für etwas, das dir wichtig ist – mit Bild und wenigen Wörtern.", "Класс, {name}! Сделай плакат о том, что тебе важно, – с картинкой и немногими словами.")
    ] });
  ku({ id: "ku-architektur", lb: "ku2", stufe: 4, lz: ["ku.be.02", "ku.ge.03"], name: "Architektur und bewegte Kunst", e: "🏛️", farbe: "#1F8F8A", grund: "#E6F7F5",
    kurz: "Form und Funktion von Bauwerken, Hundertwasser, Relief, Mobile und Klangskulptur", schritte: [
      info("Bauen ist Kunst", "🏛️", "Architekten planen Häuser, Brücken und Kirchen. Ein Gebäude soll halten, zu seiner Aufgabe passen und schön sein: Form und Funktion gehören zusammen.",
        "Архитекторы проектируют дома, мосты и церкви. Здание должно стоять, подходить к своей задаче и быть красивым: форма и функция связаны."),
      wahl("Friedensreich Hundertwasser hat Häuser gebaut, die …", "Фриденсрайх Хундертвассер строил дома, которые …", "🏘️",
        ["bunt sind, fast ohne gerade Linien und mit Bäumen auf dem Dach", "яркие, почти без прямых линий и с деревьями на крыше", "Richtig! Er mochte krumme Linien und Pflanzen – das Haus sollte mit der Natur leben.", "Правильно! Он любил кривые линии и растения – дом должен жить вместе с природой."],
        ["grau und ganz eckig sind", "серые и совсем угловатые", "Nein, Hundertwassers Häuser sind bunt und rund.", "Нет, дома Хундертвассера яркие и округлые."],
        ["unter der Erde liegen", "находятся под землёй", "Nein, man sieht sie gut – sie sind bunt.", "Нет, их хорошо видно – они яркие."]),
      wahl("Warum haben alte Brücken und Kirchenfenster oft einen runden Bogen?", "Почему у старых мостов и церковных окон часто круглая арка?", "🌉",
        ["Der Bogen trägt schwere Last gut", "Арка хорошо держит тяжёлый груз", "Genau! Die Form folgt der Funktion: Der Bogen leitet das Gewicht zur Seite ab.", "Точно! Форма следует функции: арка отводит вес в стороны."],
        ["Bögen sind billiger als Wände", "Арки дешевле стен", "Nein, es geht um die Stabilität.", "Нет, дело в прочности."],
        ["Nur zur Verzierung", "Только для украшения", "Schön ist er auch – aber vor allem trägt er.", "Она и красивая – но главное, она держит."]),
      daumen("Ein Relief ist ein Bild, das ein Stück aus der Fläche herauskommt – wie auf einer Münze.", "Рельеф – это изображение, которое немного выступает из плоскости, как на монете.", "🪙", true,
        "Stimmt! Ein Relief liegt zwischen Bild und Figur.", "Верно! Рельеф – что-то среднее между картиной и фигурой."),
      wahl("Alexander Calder hat Kunstwerke an Fäden aufgehängt, die sich im Wind drehen. Wie heißen sie?", "Александр Колдер подвешивал на нитях произведения, которые вращаются на ветру. Как они называются?", "🎐",
        ["Mobiles", "мобили", "Richtig! Ein Mobile ist eine bewegliche Skulptur.", "Правильно! Мобиль – это подвижная скульптура."],
        ["Mosaike", "мозаики", "Ein Mosaik ist aus kleinen Steinchen gelegt.", "Мозаика выложена из маленьких камешков."],
        ["Gemälde", "картины", "Gemälde bewegen sich nicht.", "Картины не двигаются."]),
      ende("Super, {name}! Schau dir ein besonderes Gebäude in deinem Ort an: Welche Formen hat es – und wozu?", "Супер, {name}! Посмотри на особенное здание в своём городе: какие у него формы – и зачем?")
    ] });
  ku({ id: "ku-aktion4", lb: "ku3", stufe: 4, lz: ["ku.be.01", "me.pp.01"], name: "Kunst in Aktion", e: "🎬", farbe: "#E0A800", grund: "#FFF7D6",
    kurz: "Performance, Kunstwerke befragen, Bilddiktat, Aktion planen und dokumentieren", schritte: [
      info("Performance", "🎬", "Bei einer Performance ist die Aktion selbst das Kunstwerk: Künstler bewegen sich, spielen mit Dingen, Licht und Klängen – oft vor Publikum. Danach bleibt nur das Foto oder Video.",
        "В перформансе само действие – произведение искусства: художники двигаются, играют с вещами, светом и звуками, часто перед зрителями. Потом остаются только фото или видео."),
      wahl("Beim Bilddiktat …", "При «диктанте по картине» …", "🗣️",
        ["beschreibt einer ein Bild, die anderen malen nach Gehör", "один описывает картину, другие рисуют на слух", "Richtig! Danach vergleicht ihr mit dem echten Bild.", "Правильно! Потом сравниваете с настоящей картиной."],
        ["schreibt man ein Diktat ohne Fehler", "пишут диктант без ошибок", "Nein, beim Bilddiktat wird gemalt.", "Нет, при этом рисуют."],
        ["schaut man sich nur Fotos an", "только смотрят фото", "Nein, einer beschreibt, die anderen malen.", "Нет, один описывает, другие рисуют."]),
      daumen("Man kann einem Kunstwerk Fragen stellen – zum Beispiel in einem ausgedachten Interview mit einer Figur aus dem Bild.", "Произведению искусства можно задавать вопросы – например, в придуманном интервью с фигурой с картины.", "🎤", true,
        "Stimmt! So denkst du dich in das Bild hinein.", "Верно! Так ты вживаешься в картину."),
      wahl("Warum macht man von einer Aktion Fotos oder ein Video?", "Зачем снимают фото или видео акции?", "📹",
        ["Damit man sie zeigen kann, wenn sie vorbei ist", "Чтобы показать её, когда она закончится", "Genau! Eine Aktion dauert nur kurz – die Dokumentation bleibt. Frag aber alle, ob sie gefilmt werden wollen.", "Точно! Акция длится недолго – запись остаётся. Но спроси всех, хотят ли они, чтобы их снимали."],
        ["Damit sie länger dauert", "Чтобы она длилась дольше", "Nein, sie dauert genauso lang.", "Нет, она длится столько же."],
        ["Das ist verboten", "Это запрещено", "Nein – mit Erlaubnis der Beteiligten ist es eine gute Idee.", "Нет – с разрешения участников это хорошая идея."]),
      ende("Toll, {name}! Plant zu zweit ein lebendes Bild zu einem Kunstwerk und macht ein Foto davon.", "Здорово, {name}! Придумайте вдвоём «живую картину» к произведению искусства и сфотографируйте её.")
    ] });

  // ==================== MUSIK (Lehrplan Grundschule Musik 2019) ====================
  const mu = (t) => neu("musik", t);
  mu({ id: "mu-stimme", lb: "mu1", kl: 2, lz: ["mu.ma.02"], name: "Meine Stimme ist ein Instrument", e: "🎤", farbe: "#E0574A", grund: "#FFECE8",
    kurz: "Geräusche nachmachen, gut singen: Haltung und Atmung, Lieder auswendig", schritte: [
      info("Die Stimme kann viel", "🎤", "Mit deiner Stimme kannst du sprechen, singen, flüstern, rufen – und Geräusche nachmachen: Tierlaute, Wind, eine Eisenbahn.",
        "Голосом можно говорить, петь, шептать, кричать – и подражать звукам: животным, ветру, поезду."),
      wahl("Wie stehst du beim Singen am besten?", "Как лучше стоять, когда поёшь?", "🧍",
        ["Aufrecht, Füße fest auf dem Boden, Schultern locker", "Прямо, ноги твёрдо на полу, плечи расслаблены", "Richtig! So hat die Luft Platz und die Stimme klingt schön.", "Правильно! Так воздуху есть место, и голос звучит красиво."],
        ["Krumm, mit hochgezogenen Schultern", "Сгорбившись, с поднятыми плечами", "Dann wird die Stimme eng. Lieber locker und gerade.", "Тогда голос зажат. Лучше прямо и свободно."],
        ["Auf einem Bein", "На одной ноге", "Da wackelst du – fest auf beiden Füßen geht es besser.", "Так ты шатаешься – на обеих ногах лучше."]),
      daumen("Beim Singen atmest du tief in den Bauch – die Schultern bleiben unten.", "Когда поёшь, дышишь глубоко животом – плечи остаются внизу.", "🫁", true,
        "Stimmt! Leg eine Hand auf den Bauch: Beim Einatmen wölbt er sich nach vorn.", "Верно! Положи руку на живот: при вдохе он выпячивается вперёд."),
      zuordnen("Wie klingt das? Mach es nach!", "Как это звучит? Повтори!", [["tier", "Tierlaut", "Звук животного", "🐮"], ["natur", "Naturgeräusch", "Звук природы", "🌬️"], ["maschine", "Maschine", "Машина", "🚂"]],
        [["Muuuh", "Муууу", "tier"], ["Schschsch – der Wind", "Шшшш – ветер", "natur"], ["Tschu-tschu", "Чух-чух", "maschine"]]),
      daumen("Lieder kann man am besten lernen, wenn man sie oft gemeinsam singt.", "Песни лучше всего учить, если часто петь их вместе.", "🎶", true,
        "Stimmt! In einem Schuljahr lernt deine Klasse mehrere Lieder auswendig.", "Верно! За учебный год класс учит наизусть несколько песен."),
      ende("Super, {name}! Sing dein Lieblingslied – einmal laut, einmal ganz leise.", "Супер, {name}! Спой любимую песню – один раз громко, один раз тихо.")
    ] });
  mu({ id: "mu-laut-leise", lb: "mu4", kl: 2, lz: ["mu.ho.01"], name: "Laut, leise, schnell, langsam", e: "🔊", farbe: "#2F86C8", grund: "#EAF4FC",
    kurz: "Lautstärke und Tempo, Musik macht Stimmung, Musik beschreiben", schritte: [
      info("Musik hat Gestaltungsmittel", "🔊", "Musik kann laut oder leise sein, schnell oder langsam. So klingt sie mal fröhlich, mal traurig, mal spannend.",
        "Музыка бывает громкой или тихой, быстрой или медленной. Так она звучит то весело, то грустно, то напряжённо.",
        [["leise – mittellaut – laut", "тихо – средне – громко"], ["langsam – mäßig – schnell", "медленно – умеренно – быстро"]]),
      wahl("Ein Schlaflied ist meistens …", "Колыбельная обычно …", "😴",
        ["leise und langsam", "тихая и медленная", "Richtig! So wird man ruhig und müde.", "Правильно! Так становишься спокойным и сонным."],
        ["laut und schnell", "громкая и быстрая", "Dann würde niemand einschlafen.", "Тогда бы никто не уснул."],
        ["ganz schrill", "очень визгливая", "Schrille Töne machen eher wach.", "Визгливые звуки скорее будят."]),
      zuordnen("Welche Musik passt?", "Какая музыка подходит?", [["schnell", "Schnell und laut", "Быстро и громко", "🏃"], ["langsam", "Langsam und leise", "Медленно и тихо", "🐢"]],
        [["Ein Wettrennen", "Гонка", "schnell"], ["Ein Gewitter", "Гроза", "schnell"], ["Eine Schnecke kriecht", "Ползёт улитка", "langsam"], ["Schneeflocken fallen", "Падают снежинки", "langsam"]]),
      daumen("Musik kann Gefühle und Bilder im Kopf auslösen.", "Музыка может вызывать чувства и картины в голове.", "💭", true,
        "Stimmt! Probier mal, zu Musik zu malen: Was siehst du?", "Верно! Попробуй рисовать под музыку: что ты видишь?"),
      daumen("Wenn Musik lauter wird, sagt man: Sie wird schneller.", "Если музыка становится громче, говорят: она становится быстрее.", "📢", false,
        "Nein! Lauter und schneller sind zwei verschiedene Dinge. Musik kann laut und langsam sein.", "Нет! Громче и быстрее – разные вещи. Музыка может быть громкой и медленной."),
      ende("Klasse, {name}! Im Atelier bei Paula kannst du „Hoch oder tief, laut oder leise“ spielen.", "Класс, {name}! В ателье у Паулы можно поиграть в «высоко или низко, громко или тихо».")
    ] });
  mu({ id: "mu-instrumente1", lb: "mu2", kl: 2, lz: ["mu.ho.02"], name: "Klänge und Instrumente", e: "🥁", farbe: "#B5651D", grund: "#FFF1E3",
    kurz: "Rhythmusinstrumente, Klangfarben, wie ein Ton entsteht", schritte: [
      info("Klang machen", "🥁", "Klänge entstehen, wenn etwas schwingt: das Fell einer Trommel, eine Saite, Luft in einer Flöte. Auch dein Körper ist ein Instrument: klatschen, stampfen, schnipsen.",
        "Звуки возникают, когда что-то колеблется: кожа барабана, струна, воздух во флейте. Твоё тело – тоже инструмент: хлопать, топать, щёлкать."),
      zuordnen("Wie spielt man es?", "Как на этом играют?", [["schlagen", "Schlagen", "Ударять", "🥁"], ["schuetteln", "Schütteln", "Трясти", "🪇"], ["blasen", "Blasen", "Дуть", "🪈"]],
        [["Trommel", "Барабан", "schlagen"], ["Triangel", "Треугольник", "schlagen"], ["Rassel", "Погремушка", "schuetteln"], ["Blockflöte", "Блокфлейта", "blasen"]]),
      wahl("Wie klingt ein Triangel?", "Как звучит треугольник?", "🔺",
        ["Hell und klingend", "Звонко и светло", "Richtig! Metall klingt hell und lange nach.", "Правильно! Металл звучит звонко и долго."],
        ["Dumpf und tief", "Глухо и низко", "Dumpf klingt eher eine große Trommel.", "Глухо звучит скорее большой барабан."],
        ["Gar nicht", "Никак", "Doch – ganz hell!", "Звучит – очень звонко!"]),
      daumen("Ein langer Klangstab klingt tiefer als ein kurzer.", "Длинная пластинка звучит ниже, чем короткая.", "🎹", true,
        "Stimmt! Das kannst du am Xylofon im Atelier ausprobieren.", "Верно! Это можно проверить на ксилофоне в ателье."),
      daumen("Klatschen, Stampfen und Patschen sind auch Musik.", "Хлопать, топать и шлёпать – это тоже музыка.", "👏", true,
        "Stimmt! Das nennt man Körperinstrumente.", "Верно! Это называется инструменты тела."),
      ende("Super, {name}! Bau dir eine Rassel: etwas Reis in eine Dose – fertig!", "Супер, {name}! Сделай погремушку: немного риса в банку – готово!")
    ] });
  mu({ id: "mu-rhythmus", lb: "mu2", kl: 2, lz: ["mu.ma.01"], name: "Grundschlag und Rhythmus", e: "👏", farbe: "#7B55B8", grund: "#F1EAFF",
    kurz: "Grundschlag spüren, lange und kurze Klänge, ta und ti-ti, eigene Zeichen", schritte: [
      info("Der Grundschlag", "👏", "Bei fast jeder Musik gibt es einen gleichmäßigen Schlag wie dein Herzschlag – den Grundschlag. Darauf liegt der Rhythmus aus langen und kurzen Klängen.",
        "Почти в любой музыке есть ровный удар, как стук сердца, – основная доля. На ней лежит ритм из длинных и коротких звуков.",
        [["„ta“ = ein Schlag lang", "«та» = длиной в один удар"], ["„ti-ti“ = zwei schnelle Klänge in einem Schlag", "«ти-ти» = два быстрых звука за один удар"]]),
      wahl("Wie klatschst du das Wort „Ba-na-ne“?", "Как прохлопать слово «Ba-na-ne»?", "🍌",
        ["Drei Klatscher", "Три хлопка", "Richtig! Jede Silbe ein Klatscher.", "Правильно! Каждый слог – хлопок."],
        ["Ein Klatscher", "Один хлопок", "Hör genau: Ba – na – ne, das sind drei.", "Послушай: Ba – na – ne, это три."],
        ["Fünf Klatscher", "Пять хлопков", "Nein, Ba-na-ne hat drei Silben.", "Нет, в Ba-na-ne три слога."]),
      daumen("Der Grundschlag bleibt gleichmäßig – auch wenn der Rhythmus wechselt.", "Основная доля остаётся ровной – даже если ритм меняется.", "💓", true,
        "Stimmt! Du kannst ihn mit den Füßen gehen, während du den Rhythmus klatschst.", "Верно! Можно шагать её ногами, а ритм хлопать."),
      wahl("Ein Klang dauert doppelt so lang wie der Grundschlag. Wie spielst du ihn?", "Звук длится в два раза дольше основной доли. Как его сыграть?", "⏳",
        ["Einmal klatschen und zwei Schläge warten", "Один раз хлопнуть и подождать два удара", "Genau! Lange Klänge halten länger.", "Точно! Длинные звуки держатся дольше."],
        ["Ganz schnell zweimal klatschen", "Очень быстро хлопнуть два раза", "Das wären zwei kurze Klänge.", "Это были бы два коротких звука."],
        ["Gar nicht klatschen", "Совсем не хлопать", "Dann wäre es eine Pause.", "Тогда это была бы пауза."]),
      daumen("Rhythmen kann man mit eigenen Zeichen aufschreiben – zum Beispiel lange und kurze Striche.", "Ритмы можно записать своими знаками – например, длинными и короткими чёрточками.", "✏️", true,
        "Stimmt! Später lernst du dafür die Noten.", "Верно! Позже ты выучишь для этого ноты."),
      ende("Klasse, {name}! Im Atelier kannst du Rhythmen nachklatschen.", "Класс, {name}! В ателье можно повторять ритмы.")
    ] });
  mu({ id: "mu-bewegung", lb: "mu3", kl: 2, lz: ["mu.ma.01", "sp.be.01"], name: "Musik und Bewegung", e: "💃", farbe: "#C2337A", grund: "#FFEAF3",
    kurz: "Musik in Bewegung umsetzen, Tanzschritte, Musik malen und erzählen", schritte: [
      info("Musik bewegt", "💃", "Zu Musik kann man sich frei bewegen, tanzen, malen oder eine Geschichte erzählen. Einfache Tanzschritte sind zum Beispiel seit-ran oder Hacke-Spitze.",
        "Под музыку можно свободно двигаться, танцевать, рисовать или рассказывать историю. Простые шаги – например, в сторону-приставить или пятка-носок."),
      wahl("Die Musik klingt wie ein schwerer Elefant. Wie bewegst du dich?", "Музыка звучит как тяжёлый слон. Как ты двигаешься?", "🐘",
        ["Langsam und stampfend", "Медленно и топая", "Richtig! Tiefe, langsame Musik passt zu schweren Schritten.", "Правильно! Низкая медленная музыка подходит к тяжёлым шагам."],
        ["Leicht auf Zehenspitzen hüpfend", "Легко подпрыгивая на цыпочках", "Das passt eher zu einem Vogel oder einer Maus.", "Это больше подходит к птичке или мышке."],
        ["Gar nicht", "Никак", "Probier es aus – stampf wie ein Elefant!", "Попробуй – потопай, как слон!"]),
      daumen("Beim Tanzen im Kreis fassen sich die Kinder oft an den Händen.", "Танцуя в кругу, дети часто берутся за руки.", "⭕", true,
        "Stimmt! Das nennt man eine Fassung, zum Beispiel die Zweihandfassung.", "Верно! Это называется хват, например двумя руками."),
      wahl("Du hörst ein Musikstück und erfindest eine Überschrift. Was übst du dabei?", "Ты слушаешь музыку и придумываешь название. Что ты тренируешь?", "📝",
        ["Musik in Sprache umsetzen", "Переводить музыку в слова", "Genau! Du kannst auch zur Musik erzählen.", "Точно! Можно ещё рассказывать под музыку."],
        ["Schnell laufen", "Быстро бегать", "Nein, hier geht es um Worte zur Musik.", "Нет, здесь речь о словах к музыке."],
        ["Rechnen", "Считать", "Nein, hier geht es um Musik und Sprache.", "Нет, здесь музыка и речь."]),
      ende("Toll, {name}! Mach Musik an und tanze: schnelle Musik – schnelle Schritte, langsame Musik – langsame Schritte.", "Здорово, {name}! Включи музыку и танцуй: быстрая музыка – быстрые шаги, медленная – медленные.")
    ] });
  mu({ id: "mu-mozart", lb: "mu4", kl: 2, lz: ["mu.ho.03"], name: "Mozart und Musik im Alltag", e: "🎼", farbe: "#E0A800", grund: "#FFF7D6",
    kurz: "Wolfgang Amadeus Mozart, Musik zu besonderen Anlässen, Musik in der Familie", schritte: [
      info("Ein Wunderkind", "🎼", "Wolfgang Amadeus Mozart wurde vor fast 270 Jahren in Salzburg geboren. Schon mit fünf Jahren hat er eigene Stücke erfunden. Später schrieb er die Oper „Die Zauberflöte“.",
        "Вольфганг Амадей Моцарт родился почти 270 лет назад в Зальцбурге. Уже в пять лет он сочинял свои пьесы. Позже он написал оперу «Волшебная флейта»."),
      wahl("Jemand, der Musik erfindet und aufschreibt, ist ein …", "Тот, кто придумывает и записывает музыку, – это …", "✍️",
        ["Komponist", "композитор", "Richtig! Mozart war ein Komponist.", "Правильно! Моцарт был композитором."],
        ["Dirigent", "дирижёр", "Ein Dirigent leitet das Orchester.", "Дирижёр руководит оркестром."],
        ["Zuschauer", "зритель", "Zuschauer hören zu.", "Зрители слушают."]),
      zuordnen("Zu welchem Anlass passt die Musik?", "К какому случаю подходит музыка?", [["geburtstag", "Geburtstag", "День рождения", "🎂"], ["weihnachten", "Weihnachten", "Рождество", "🎄"]],
        [["„Zum Geburtstag viel Glück“", "«С днём рождения»", "geburtstag"], ["Ein Lied mit Kerzen auf dem Kuchen", "Песня со свечками на торте", "geburtstag"], ["„O Tannenbaum“", "«O Tannenbaum» (О ёлочка)", "weihnachten"]]),
      daumen("In jeder Familie und in jedem Land gibt es eigene Lieder.", "В каждой семье и в каждой стране есть свои песни.", "🌍", true,
        "Stimmt! Frag zu Hause nach einem Lied aus deiner Familie – vielleicht in einer anderen Sprache.", "Верно! Спроси дома о песне твоей семьи – может быть, на другом языке."),
      ende("Super, {name}! Hör mit einem Erwachsenen ein Stück von Mozart, zum Beispiel aus der „Zauberflöte“.", "Супер, {name}! Послушай со взрослым что-нибудь из Моцарта, например из «Волшебной флейты».")
    ] });

  mu({ id: "mu-noten", lb: "mu2", stufe: 3, lz: ["mu.no.01"], name: "Noten lesen", e: "🎵", farbe: "#2E2230", grund: "#EFEFF5",
    kurz: "ganze, halbe, Viertel- und Achtelnoten, Pausen, Notenlinien", schritte: [
      info("Noten zeigen, wie lang ein Ton ist", "noten", "Noten sind die Schrift der Musik. An ihrer Form siehst du, wie lang ein Ton klingt.",
        "Ноты – это письмо музыки. По их форме видно, как долго звучит звук.",
        [["Ganze Note: hohl, ohne Hals – 4 Schläge", "Целая нота: пустая, без штиля – 4 удара"], ["Halbe Note: hohl, mit Hals – 2 Schläge", "Половинная: пустая со штилем – 2 удара"], ["Viertelnote: schwarz, mit Hals – 1 Schlag", "Четвертная: чёрная со штилем – 1 удар"], ["Achtelnote: schwarz, mit Fähnchen – ½ Schlag", "Восьмая: чёрная с флажком – ½ удара"]]),
      wahl("Welche Note klingt am längsten?", "Какая нота звучит дольше всех?", "noten",
        ["Die ganze Note", "Целая нота", "Richtig! Sie dauert vier Schläge.", "Правильно! Она длится четыре удара."],
        ["Die Achtelnote", "Восьмая нота", "Die Achtel ist die kürzeste hier.", "Восьмая здесь самая короткая."],
        ["Die Viertelnote", "Четвертная нота", "Die Viertel dauert nur einen Schlag.", "Четвертная длится только один удар."]),
      wahl("Wie viele Achtelnoten passen in eine Viertelnote?", "Сколько восьмых помещается в одну четвертную?", "🎵",
        ["Zwei", "Две", "Genau! Zwei Achtel – „ti-ti“ – sind so lang wie eine Viertel – „ta“.", "Точно! Две восьмые – «ти-ти» – длятся как одна четвертная – «та»."],
        ["Vier", "Четыре", "Vier Achtel sind so lang wie eine halbe Note.", "Четыре восьмые длятся как половинная."],
        ["Eine", "Одна", "Nein, eine Achtel ist nur halb so lang.", "Нет, восьмая вдвое короче."]),
      daumen("Auch Stille kann man aufschreiben: mit Pausenzeichen.", "Тишину тоже можно записать: знаками паузы.", "🤫", true,
        "Stimmt! In einer Pause spielt und singt man nicht – der Grundschlag läuft aber weiter.", "Верно! В паузу не играют и не поют – но доля продолжается."),
      zuordnen("Wie viele Schläge?", "Сколько ударов?", [["eins", "1 Schlag", "1 удар", "1️⃣"], ["zwei", "2 Schläge", "2 удара", "2️⃣"], ["vier", "4 Schläge", "4 удара", "4️⃣"]],
        [["Viertelnote", "Четвертная", "eins"], ["Halbe Note", "Половинная", "zwei"], ["Ganze Note", "Целая", "vier"]]),
      ende("Klasse, {name}! Klatsch: ta – ta – ti-ti – ta. Das sind Viertel, Viertel, zwei Achtel, Viertel.", "Класс, {name}! Прохлопай: та – та – ти-ти – та. Это четвертные и две восьмые.")
    ] });
  mu({ id: "mu-singen3", lb: "mu1", stufe: 3, lz: ["mu.ma.02"], name: "Kanon, Strophe, Refrain", e: "🎶", farbe: "#E0574A", grund: "#FFECE8",
    kurz: "mehrstimmig singen, Kanon, Liedform, Stimmklang gestalten", schritte: [
      info("Lieder haben einen Bauplan", "🎶", "Viele Lieder haben Strophen mit immer neuem Text und einen Refrain, der gleich bleibt. Beim Kanon singen alle dieselbe Melodie – aber nacheinander.",
        "У многих песен есть куплеты с новым текстом и припев, который не меняется. В каноне все поют одну мелодию – но по очереди."),
      wahl("Im Kanon beginnt die zweite Gruppe …", "В каноне вторая группа начинает …", "👥",
        ["später mit derselben Melodie", "позже с той же мелодией", "Richtig! So klingen die Stimmen übereinander, wie bei „Bruder Jakob“.", "Правильно! Так голоса звучат друг над другом, как в «Братце Якове»."],
        ["gleichzeitig mit einer anderen Melodie", "одновременно с другой мелодией", "Nein, im Kanon ist es dieselbe Melodie.", "Нет, в каноне мелодия та же."],
        ["gar nicht", "не начинает вовсе", "Doch – sie fängt später an.", "Начинает – только позже."]),
      daumen("Der Refrain eines Liedes kommt mehrmals vor.", "Припев песни повторяется несколько раз.", "🔁", true,
        "Stimmt! Den Refrain kann man darum oft am schnellsten mitsingen.", "Верно! Поэтому припев часто проще всего подпевать."),
      zuordnen("Wie singst du dieses Lied?", "Как ты споёшь эту песню?", [["festlich", "Festlich und kräftig", "Торжественно и сильно", "🎺"], ["still", "Still und verhalten", "Тихо и сдержанно", "🌙"]],
        [["Ein Lied zur Geburtstagsfeier", "Песня на день рождения", "festlich"], ["Eine Hymne beim Sportfest", "Гимн на спортивном празднике", "festlich"], ["Ein Abendlied", "Вечерняя песня", "still"]]),
      ende("Super, {name}! Singt in der Familie „Bruder Jakob“ als Kanon.", "Супер, {name}! Спойте в семье «Братец Яков» каноном.")
    ] });
  mu({ id: "mu-gruppen", lb: "mu4", stufe: 3, lz: ["mu.ho.02"], name: "Instrumentengruppen", e: "🎻", farbe: "#B5651D", grund: "#FFF1E3",
    kurz: "Streich-, Blas-, Schlag- und Tasteninstrumente, wie sie klingen", schritte: [
      info("Instrumente haben Familien", "🎻", "Instrumente sortiert man danach, wie der Ton entsteht.",
        "Инструменты делят по тому, как возникает звук.",
        [["Streichinstrumente: Saiten werden mit dem Bogen gestrichen", "Струнные смычковые: по струнам ведут смычком"], ["Blasinstrumente: Luft wird hineingeblasen", "Духовые: в них дуют"], ["Schlaginstrumente: werden geschlagen", "Ударные: по ним ударяют"], ["Tasteninstrumente: haben Tasten", "Клавишные: у них есть клавиши"]]),
      zuordnen("Zu welcher Familie gehört es?", "К какому семейству относится?", [["streich", "Streichinstrument", "Смычковый", "🎻"], ["blas", "Blasinstrument", "Духовой", "🎺"], ["tasten", "Tasteninstrument", "Клавишный", "🎹"]],
        [["Geige", "Скрипка", "streich"], ["Cello", "Виолончель", "streich"], ["Trompete", "Труба", "blas"], ["Klavier", "Пианино", "tasten"]]),
      wahl("Welches Instrument klingt am tiefsten?", "Какой инструмент звучит ниже всех?", "🎻",
        ["Kontrabass", "Контрабас", "Richtig! Der Kontrabass ist das größte Streichinstrument – und das tiefste.", "Правильно! Контрабас – самый большой смычковый и самый низкий."],
        ["Geige", "Скрипка", "Die kleine Geige klingt hoch.", "Маленькая скрипка звучит высоко."],
        ["Querflöte", "Поперечная флейта", "Die Querflöte klingt hoch und hell.", "Флейта звучит высоко и светло."]),
      daumen("Die Gitarre hat Saiten, die man zupft.", "У гитары есть струны, которые щиплют.", "🎸", true,
        "Stimmt! Gitarre und Harfe sind Zupfinstrumente.", "Верно! Гитара и арфа – щипковые инструменты."),
      ende("Klasse, {name}! Hör genau hin, wenn Musik läuft: Welche Instrumente erkennst du?", "Класс, {name}! Слушай внимательно музыку: какие инструменты ты узнаёшь?")
    ] });
  mu({ id: "mu-welt", lb: "mu3", stufe: 3, lz: ["mu.ho.03", "et.we.02"], name: "Musik und Tänze aus aller Welt", e: "🌍", farbe: "#3BAA5C", grund: "#E8F7EC",
    kurz: "Lieder und Tänze anderer Länder, Instrumente der Welt, offen sein für Neues", schritte: [
      info("Musik verbindet", "🌍", "Kinder auf der ganzen Welt singen und tanzen – in vielen Sprachen und mit eigenen Instrumenten. Manche Kinder in deiner Klasse kennen Lieder aus ihrer Familie.",
        "Дети по всему миру поют и танцуют – на многих языках и со своими инструментами. Некоторые дети в твоём классе знают песни своей семьи."),
      zuordnen("Woher kommt das Instrument?", "Откуда этот инструмент?", [["afrika", "Afrika", "Африка", "🌍"], ["australien", "Australien", "Австралия", "🦘"], ["russland", "Russland", "Россия", "🪆"]],
        [["Djembe – eine Trommel", "Джембе – барабан", "afrika"], ["Didgeridoo – ein langes Holzrohr", "Диджериду – длинная деревянная труба", "australien"], ["Balalaika – mit dreieckigem Körper", "Балалайка – с треугольным корпусом", "russland"]]),
      daumen("Musik, die man nicht kennt, klingt am Anfang manchmal fremd – oft gefällt sie einem dann richtig gut.", "Незнакомая музыка сначала иногда звучит странно – а потом часто очень нравится.", "👂", true,
        "Stimmt! Neugierig zuhören lohnt sich.", "Верно! Слушать с любопытством стоит."),
      wahl("Beim Spiegeltanzen …", "В «зеркальном танце» …", "🪞",
        ["macht einer die Bewegungen genau wie ein Spiegelbild nach", "один повторяет движения как отражение", "Richtig! Dafür muss man genau hinschauen.", "Правильно! Для этого нужно внимательно смотреть."],
        ["tanzt man vor einem echten Spiegel allein", "танцуют одни перед настоящим зеркалом", "Nein, man tanzt zu zweit: Einer ist der Spiegel.", "Нет, танцуют вдвоём: один – зеркало."],
        ["darf man sich nicht bewegen", "нельзя двигаться", "Doch, man bewegt sich – genau gleich wie der andere.", "Можно – точно так же, как другой."]),
      ende("Toll, {name}! Frag in deiner Familie oder Klasse nach einem Lied aus einem anderen Land.", "Здорово, {name}! Спроси в семье или в классе о песне из другой страны.")
    ] });
  mu({ id: "mu-bach", lb: "mu4", stufe: 3, lz: ["mu.ho.03"], name: "Bach, die Orgel und Musik in der Kirche", e: "⛪", farbe: "#8E5BC8", grund: "#F3ECFF",
    kurz: "Johann Sebastian Bach in Leipzig, die Orgel, Musik in der Kirche und in der Freizeit", schritte: [
      info("Johann Sebastian Bach", "⛪", "Bach lebte vor rund 300 Jahren und war fast 30 Jahre lang Kantor an der Thomaskirche in Leipzig. Er schrieb sehr viel Musik für Orgel und Chor.",
        "Бах жил около 300 лет назад и почти 30 лет был кантором в церкви Святого Фомы в Лейпциге. Он написал очень много музыки для органа и хора."),
      wahl("Wie entsteht der Ton bei einer Orgel?", "Как возникает звук у органа?", "🎹",
        ["Luft strömt durch viele Pfeifen", "Воздух идёт через множество труб", "Richtig! Eine große Orgel hat Tausende Pfeifen – kleine klingen hoch, große tief.", "Правильно! У большого органа тысячи труб – маленькие звучат высоко, большие низко."],
        ["Man zupft Saiten", "Щиплют струны", "Nein, die Orgel hat Pfeifen.", "Нет, у органа трубы."],
        ["Man schlägt auf Trommeln", "Бьют в барабаны", "Nein, durch die Pfeifen strömt Luft.", "Нет, через трубы идёт воздух."]),
      daumen("In Sachsen gibt es viele berühmte Orgeln, zum Beispiel vom Orgelbauer Gottfried Silbermann.", "В Саксонии много знаменитых органов, например мастера Готфрида Зильбермана.", "🎶", true,
        "Stimmt! Silbermann-Orgeln stehen zum Beispiel im Dom in Freiberg und in Dresden.", "Верно! Органы Зильбермана стоят, например, в соборе Фрайберга и в Дрездене."),
      zuordnen("Wo hört man diese Musik oft?", "Где часто слышат эту музыку?", [["kirche", "In der Kirche", "В церкви", "⛪"], ["freizeit", "In der Freizeit", "В свободное время", "🎧"]],
        [["Orgelmusik zum Gottesdienst", "Органная музыка на богослужении", "kirche"], ["Ein Chor singt zu Weihnachten", "Хор поёт на Рождество", "kirche"], ["Popmusik im Radio", "Поп-музыка по радио", "freizeit"]]),
      ende("Super, {name}! Wenn du eine Kirche besuchst, schau dir die Orgelpfeifen an.", "Супер, {name}! Если будешь в церкви, посмотри на трубы органа.")
    ] });

  mu({ id: "mu-orchester", lb: "mu4", stufe: 4, lz: ["mu.ho.02"], name: "Orchester, Band und Chor", e: "🎺", farbe: "#2F6FD6", grund: "#EAF2FF",
    kurz: "Sinfonieorchester, Band, Folkloregruppe, Sopran, Alt, Tenor, Bass", schritte: [
      info("Gemeinsam musizieren", "🎺", "Ein Sinfonieorchester hat viele Musiker mit Streich-, Holzblas-, Blechblas- und Schlaginstrumenten. Vorne steht der Dirigent. Eine Band hat oft Gitarre, Bass, Schlagzeug, Keyboard und Gesang.",
        "В симфоническом оркестре много музыкантов со смычковыми, деревянными и медными духовыми и ударными. Впереди стоит дирижёр. В группе часто гитара, бас, ударные, клавишные и вокал."),
      zuordnen("Welche Stimme ist das?", "Какой это голос?", [["sopran", "Sopran", "Сопрано", "👩"], ["bass", "Bass", "Бас", "👨"]],
        [["Hohe Frauen- und Kinderstimme", "Высокий женский и детский голос", "sopran"], ["Tiefe Männerstimme", "Низкий мужской голос", "bass"]]),
      wahl("Welche Stimmen singen in einem gemischten Chor?", "Какие голоса поют в смешанном хоре?", "🎤",
        ["Sopran, Alt, Tenor und Bass", "Сопрано, альт, тенор и бас", "Richtig! Sopran und Alt sind hohe und tiefe Frauenstimmen, Tenor und Bass hohe und tiefe Männerstimmen.", "Правильно! Сопрано и альт – высокий и низкий женские, тенор и бас – высокий и низкий мужские."],
        ["Nur Bass", "Только бас", "Nein, im gemischten Chor singen Frauen und Männer.", "Нет, в смешанном хоре поют женщины и мужчины."],
        ["Trompete und Geige", "Труба и скрипка", "Das sind Instrumente, keine Stimmen.", "Это инструменты, а не голоса."]),
      wahl("Was macht der Dirigent?", "Что делает дирижёр?", "🪄",
        ["Er zeigt Tempo, Einsätze und Lautstärke", "Показывает темп, вступления и громкость", "Genau! Mit dem Taktstock hält er alle zusammen.", "Точно! Палочкой он держит всех вместе."],
        ["Er spielt die lauteste Trommel", "Играет на самом громком барабане", "Nein, er spielt selbst meist kein Instrument.", "Нет, сам он обычно не играет."],
        ["Er verkauft die Karten", "Продаёт билеты", "Nein, er leitet die Musik.", "Нет, он руководит музыкой."]),
      daumen("Auch ein Computer kann ein Musikinstrument sein.", "Компьютер тоже может быть музыкальным инструментом.", "💻", true,
        "Stimmt! Viele Musik wird heute am Computer gemacht – auch du kannst im Atelier Melodien erfinden.", "Верно! Сегодня много музыки делают на компьютере – и ты можешь сочинять мелодии в ателье."),
      ende("Klasse, {name}! Schau dir ein Konzert an – im Fernsehen oder echt – und zähl die Instrumente.", "Класс, {name}! Посмотри концерт – по телевизору или вживую – и посчитай инструменты.")
    ] });
  mu({ id: "mu-gattungen", lb: "mu4", stufe: 4, lz: ["mu.ho.03"], name: "Lied, Oper, Musical", e: "🎭", farbe: "#C2337A", grund: "#FFEAF3",
    kurz: "Gattungen: Lied, Kanon, Suite, Rondo, Oper, Musical, Singspiel", schritte: [
      info("Musik hat viele Arten", "🎭", "Ein Lied ist kurz und hat einen Text. In einer Oper wird eine ganze Geschichte gesungen – mit Orchester, Kostümen und Bühne. Im Musical wird gesungen, gesprochen und getanzt.",
        "Песня короткая и с текстом. В опере поют целую историю – с оркестром, костюмами и сценой. В мюзикле поют, говорят и танцуют."),
      zuordnen("Was ist das?", "Что это?", [["oper", "Oper", "Опера", "🎭"], ["musical", "Musical", "Мюзикл", "💃"], ["suite", "Suite", "Сюита", "🎼"]],
        [["Fast alles wird gesungen, ein Orchester spielt", "Почти всё поют, играет оркестр", "oper"], ["Singen, Sprechen und viel Tanz", "Пение, разговор и много танца", "musical"], ["Mehrere Tänze oder Stücke hintereinander", "Несколько танцев или пьес подряд", "suite"]]),
      wahl("Beim Rondo kommt ein Teil immer wieder: A – B – A – C – A. Welcher?", "В рондо одна часть всё время возвращается: A – B – A – C – A. Какая?", "🔁",
        ["Teil A", "Часть A", "Richtig! Der Teil A ist wie ein Refrain.", "Правильно! Часть A – как припев."],
        ["Teil C", "Часть C", "C kommt nur einmal vor.", "C встречается только один раз."],
        ["Teil B", "Часть B", "B kommt nur einmal vor.", "B встречается только один раз."]),
      daumen("„Die Zauberflöte“ von Mozart ist eine Oper.", "«Волшебная флейта» Моцарта – это опера.", "🪈", true,
        "Stimmt! Darin gibt es den lustigen Vogelfänger Papageno.", "Верно! В ней есть весёлый птицелов Папагено."),
      ende("Super, {name}! Vielleicht gibt es in deiner Nähe eine Kinderoper oder ein Kindermusical.", "Супер, {name}! Может быть, рядом есть детская опера или мюзикл.")
    ] });
  mu({ id: "mu-sachsen", lb: "mu4", stufe: 4, land: "sn", lz: ["mu.ho.03"], name: "Musik in Sachsen", e: "🏰", farbe: "#3BAA5C", grund: "#E8F7EC",
    kurz: "Thomanerchor, Kreuzchor, Semperoper, Gewandhaus, Musikwinkel im Vogtland, Erzgebirge", schritte: [
      info("Sachsen ist ein Musikland", "🏰", "In Sachsen gibt es berühmte Orte der Musik: den Thomanerchor in Leipzig, den Kreuzchor in Dresden, die Semperoper in Dresden und das Gewandhaus in Leipzig.",
        "В Саксонии есть знаменитые места музыки: хор Святого Фомы в Лейпциге, хор Святого Креста в Дрездене, опера Земпера в Дрездене и Гевандхаус в Лейпциге."),
      zuordnen("In welcher Stadt?", "В каком городе?", [["leipzig", "Leipzig", "Лейпциг", "🎼"], ["dresden", "Dresden", "Дрезден", "🏛️"]],
        [["Thomanerchor", "Хор Святого Фомы", "leipzig"], ["Gewandhaus", "Гевандхаус", "leipzig"], ["Semperoper", "Опера Земпера", "dresden"], ["Kreuzchor", "Хор Святого Креста", "dresden"]]),
      wahl("Im Vogtland, rund um Markneukirchen, werden seit Jahrhunderten … gebaut.", "В Фогтланде, вокруг Маркнойкирхена, веками строят …", "🎻",
        ["Musikinstrumente", "музыкальные инструменты", "Richtig! Man nennt die Gegend den „Musikwinkel“ – Geigen, Gitarren, Blasinstrumente.", "Правильно! Эту местность называют «музыкальным уголком» – скрипки, гитары, духовые."],
        ["Autos", "машины", "Nein, dort baut man Instrumente.", "Нет, там строят инструменты."],
        ["Schiffe", "корабли", "Nein, das Vogtland ist für Instrumente bekannt.", "Нет, Фогтланд известен инструментами."]),
      daumen("Im Erzgebirge singen die Bergleute traditionell Lieder mit dem Gruß „Glück auf!“.", "В Рудных горах шахтёры по традиции поют песни с приветствием «Glück auf!».", "⛏️", true,
        "Stimmt! Zur Weihnachtszeit gibt es dort Bergparaden mit Musik.", "Верно! На Рождество там проходят шахтёрские парады с музыкой."),
      ende("Toll, {name}! Vielleicht kannst du mit deiner Familie einen Musikort in Sachsen besuchen.", "Здорово, {name}! Может быть, ты с семьёй посетишь музыкальное место в Саксонии.")
    ] });
  mu({ id: "mu-komponisten", lb: "mu4", stufe: 4, lz: ["mu.ho.03"], name: "Beethoven, Schumann und Co.", e: "🎹", farbe: "#2E2230", grund: "#EFEFF5",
    kurz: "Leben und Werke von Komponisten, Musik in verschiedenen Zeiten", schritte: [
      info("Komponisten aus verschiedenen Zeiten", "🎹", "Ludwig van Beethoven wurde in Bonn geboren. Später konnte er fast nichts mehr hören – und komponierte trotzdem weiter. Seine „Ode an die Freude“ ist heute die Hymne Europas.",
        "Людвиг ван Бетховен родился в Бонне. Позже он почти ничего не слышал – и всё равно продолжал сочинять. Его «Ода к радости» сегодня гимн Европы."),
      wahl("Robert Schumann aus Zwickau schrieb Klavierstücke über das Kindsein. Wie heißen sie?", "Роберт Шуман из Цвиккау написал пьесы для фортепиано о детстве. Как они называются?", "🧒",
        ["Kinderszenen", "Детские сцены", "Richtig! Das berühmteste Stück daraus heißt „Träumerei“. Seine Frau Clara aus Leipzig war eine große Pianistin.", "Правильно! Самая известная пьеса оттуда – «Грёзы». Его жена Клара из Лейпцига была великой пианисткой."],
        ["Die Zauberflöte", "Волшебная флейта", "Die ist von Mozart.", "Это Моцарт."],
        ["Ode an die Freude", "Ода к радости", "Die ist von Beethoven.", "Это Бетховен."]),
      zuordnen("Wer war es?", "Кто это был?", [["bach", "Bach", "Бах", "⛪"], ["beethoven", "Beethoven", "Бетховен", "🎹"]],
        [["Kantor an der Thomaskirche Leipzig", "Кантор церкви Святого Фомы в Лейпциге", "bach"], ["Komponierte, obwohl er taub wurde", "Сочинял, хотя оглох", "beethoven"]]),
      daumen("Musik von heute und Musik von vor 300 Jahren klingen ganz gleich.", "Музыка сегодня и музыка 300 лет назад звучат одинаково.", "📻", false,
        "Nein! Jede Zeit hat ihre eigene Musik und eigene Instrumente.", "Нет! У каждого времени своя музыка и свои инструменты."),
      ende("Super, {name}! Such dir einen Komponisten aus und erzähl jemandem drei Dinge über ihn.", "Супер, {name}! Выбери композитора и расскажи кому-нибудь о нём три вещи.")
    ] });
  mu({ id: "mu-taenze", lb: "mu3", stufe: 4, lz: ["mu.ma.01"], name: "Tänze aus verschiedenen Zeiten", e: "🕺", farbe: "#FF9636", grund: "#FFF1E3",
    kurz: "höfischer Tanz, Walzer im Dreiertakt, Volkstanz, Poptanz, Aufstellungsformen", schritte: [
      info("Jede Zeit tanzt anders", "🕺", "Am Hof der Könige tanzte man feierlich das Menuett. Später kam der Walzer, ein Drehtanz im Dreiertakt. Dazu gibt es Volkstänze und heute Poptänze.",
        "При королевском дворе торжественно танцевали менуэт. Позже появился вальс – кружащийся танец на три счёта. Есть ещё народные танцы, а сегодня – поп-танцы."),
      wahl("Wie zählt man beim Walzer?", "Как считают в вальсе?", "💫",
        ["Eins – zwei – drei, eins – zwei – drei", "Раз – два – три, раз – два – три", "Richtig! Der Walzer hat einen Dreiertakt.", "Правильно! У вальса трёхдольный размер."],
        ["Eins – zwei, eins – zwei", "Раз – два, раз – два", "Das ist ein Zweiertakt, wie beim Marsch.", "Это двудольный размер, как у марша."],
        ["Gar nicht", "Никак не считают", "Doch – im Dreiertakt.", "Считают – на три."]),
      zuordnen("Wie heißt die Aufstellung?", "Как называется построение?", [["kreis", "Kreis", "Круг", "⭕"], ["gasse", "Gasse", "Коридор", "↕️"]],
        [["Alle stehen rund und schauen zur Mitte", "Все стоят по кругу лицом к центру", "kreis"], ["Zwei Reihen stehen sich gegenüber", "Два ряда стоят друг напротив друга", "gasse"]]),
      daumen("Ein Volkstanz ist ein Tanz, den die Menschen einer Gegend schon lange tanzen.", "Народный танец – это танец, который люди в какой-то местности танцуют уже давно.", "🎻", true,
        "Stimmt! Auch die Sorben in der Lausitz haben eigene Tänze und Trachten.", "Верно! У сорбов в Лужице тоже есть свои танцы и костюмы."),
      ende("Klasse, {name}! Probier einen Walzerschritt: eins – zwei – drei, und dreh dich dabei.", "Класс, {name}! Попробуй шаг вальса: раз – два – три, и кружись.")
    ] });
  mu({ id: "mu-medien", lb: "mu4", stufe: 4, lz: ["mu.ho.03", "me.sa.01"], name: "Musik hören im Netz", e: "🎧", farbe: "#1F8F8A", grund: "#E6F7F5",
    kurz: "Tonträger und Musikplattformen, Lautstärke, Rechte von Musikern", schritte: [
      info("Musik hören heute", "🎧", "Früher hörte man Musik von Schallplatten und CDs, heute oft über Musik- und Videoplattformen im Internet. Dabei gibt es Regeln.",
        "Раньше музыку слушали с пластинок и дисков, сегодня часто через музыкальные и видеоплатформы в интернете. При этом есть правила."),
      daumen("Ein Lied, das jemand anderes gemacht hat, darf ich einfach in mein eigenes Video einbauen und hochladen.", "Песню, которую сделал кто-то другой, можно просто вставить в своё видео и выложить.", "📹", false,
        "Nein! Musik gehört den Musikern (Urheberrecht). Frag einen Erwachsenen, welche Musik erlaubt ist.", "Нет! Музыка принадлежит музыкантам (авторское право). Спроси взрослого, какую музыку можно."),
      wahl("Du hörst mit Kopfhörern Musik. Was ist gut für deine Ohren?", "Ты слушаешь музыку в наушниках. Что хорошо для ушей?", "👂",
        ["Nicht zu laut und mit Pausen", "Не слишком громко и с перерывами", "Richtig! Zu laute Musik kann die Ohren für immer schädigen.", "Правильно! Слишком громкая музыка может навсегда повредить уши."],
        ["So laut wie möglich", "Как можно громче", "Nein, das schadet deinen Ohren.", "Нет, это вредит ушам."],
        ["Nachts ohne Ende", "Всю ночь без конца", "Nein, Ohren brauchen Ruhe – und du brauchst Schlaf.", "Нет, ушам нужен покой, а тебе – сон."]),
      daumen("Bei Musik- und Videoplattformen kommt nach einem Video automatisch das nächste – man sollte selbst entscheiden, wann Schluss ist.", "На музыкальных и видеоплатформах после одного видео автоматически идёт следующее – надо самому решать, когда хватит.", "⏹️", true,
        "Stimmt! Die Plattformen wollen, dass man lange bleibt. Mach selbst Pausen.", "Верно! Платформы хотят, чтобы ты оставался долго. Делай перерывы сам."),
      ende("Super, {name}! Erzähl jemandem von deinem Lieblingslied – und warum es dir gefällt.", "Супер, {name}! Расскажи кому-нибудь о любимой песне – и почему она тебе нравится.")
    ] });
  mu({ id: "mu-rhythmus4", lb: "mu2", stufe: 4, lz: ["mu.no.01", "mu.ma.03"], name: "Rhythmen erfinden und notieren", e: "🥁", farbe: "#7B55B8", grund: "#F1EAFF",
    kurz: "Rhythmusbausteine im Zweier- und Dreiertakt, Noten zusammensetzen, Melodien erfinden", schritte: [
      info("Takte füllen", "noten", "Ein Takt ist ein kleines Kästchen in den Noten. Im Vierertakt passen vier Viertel hinein – oder andere Noten, die zusammen vier Schläge ergeben.",
        "Такт – это маленький отрезок в нотах. В размере 4/4 туда помещаются четыре четвертные – или другие ноты, которые вместе дают четыре удара."),
      wahl("Was füllt einen Vierertakt genau?", "Что ровно заполняет такт на четыре?", "🧮",
        ["Zwei halbe Noten", "Две половинные", "Richtig! 2 + 2 = 4 Schläge.", "Правильно! 2 + 2 = 4 удара."],
        ["Eine halbe und eine Viertel", "Половинная и четвертная", "Das sind nur 3 Schläge.", "Это только 3 удара."],
        ["Zwei ganze Noten", "Две целые", "Das wären 8 Schläge – zu viel.", "Это 8 ударов – слишком много."]),
      wahl("Eine halbe Note, eine Viertel und zwei Achtel – wie viele Schläge sind das?", "Половинная, четвертная и две восьмые – сколько это ударов?", "🎵",
        ["4", "4", "Genau! 2 + 1 + ½ + ½ = 4.", "Точно! 2 + 1 + ½ + ½ = 4."],
        ["5", "5", "Zähl nach: zwei Achtel sind zusammen nur ein Schlag.", "Посчитай: две восьмые вместе – только один удар."],
        ["3", "3", "Du hast etwas vergessen: 2 + 1 + 1 = 4.", "Что-то забыто: 2 + 1 + 1 = 4."]),
      daumen("Beim Erfinden einer Melodie kann man zuerst einen Rhythmus klatschen und dann Töne dazu suchen.", "Сочиняя мелодию, можно сначала прохлопать ритм, а потом подобрать к нему звуки.", "💡", true,
        "Stimmt! Probier es im Atelier: Bei „Melodie erfinden“ kannst du eigene Lieder bauen.", "Верно! Попробуй в ателье: в «Сочини мелодию» можно строить свои песни."),
      ende("Klasse, {name}! Erfinde einen Rhythmus mit vier Schlägen und klatsch ihn jemandem vor.", "Класс, {name}! Придумай ритм на четыре удара и прохлопай его кому-нибудь.")
    ] });

  // ==================== WERKEN (Lehrplan Grundschule Werken 2019) ====================
  const we = (t) => neu("werken", t);
  we({ id: "we-fahrzeuge", lb: "we1", kl: 2, lz: ["su.te.01"], name: "Technik um uns: Fahrzeuge", e: "🚗", farbe: "#2F6FD6", grund: "#EAF2FF",
    kurz: "Fahrzeuge zu Land, Wasser und Luft, Rad und Achse, Funktion prüfen", schritte: [
      info("Technik ist überall", "🚗", "Technik hilft uns im Alltag: Spielzeug, Fahrräder, Küchengeräte. Fahrzeuge bewegen sich auf Rädern, Kufen, im Wasser oder mit Flügeln durch die Luft.",
        "Техника помогает нам каждый день: игрушки, велосипеды, кухонные приборы. Транспорт движется на колёсах, полозьях, по воде или с крыльями по воздуху."),
      zuordnen("Wo fährt oder fliegt es?", "Где оно едет или летает?", [["land", "Land", "Суша", "🚗"], ["wasser", "Wasser", "Вода", "⛵"], ["luft", "Luft", "Воздух", "✈️"]],
        [["Fahrrad", "Велосипед", "land"], ["Schlitten", "Санки", "land"], ["Ruderboot", "Гребная лодка", "wasser"], ["Hubschrauber", "Вертолёт", "luft"]]),
      wahl("Die Räder eines Spielzeugautos drehen sich um eine Stange. Wie heißt sie?", "Колёса игрушечной машинки вращаются вокруг стержня. Как он называется?", "⚙️",
        ["Achse", "Ось", "Richtig! Ohne gut gelagerte Achse rollt das Auto nicht.", "Правильно! Без хорошо закреплённой оси машинка не поедет."],
        ["Flügel", "Крыло", "Flügel haben Flugzeuge.", "Крылья у самолётов."],
        ["Kufe", "Полоз", "Kufen hat ein Schlitten.", "Полозья у санок."]),
      daumen("Ein Schlitten hat Kufen, weil sie auf Schnee gut gleiten.", "У санок полозья, потому что они хорошо скользят по снегу.", "🛷", true,
        "Stimmt! Räder würden im Schnee einsinken.", "Верно! Колёса проваливались бы в снег."),
      daumen("Bevor man ein selbst gebautes Fahrzeug benutzt, macht man eine Funktionsprobe.", "Прежде чем пользоваться самодельной машинкой, проводят проверку работы.", "✅", true,
        "Stimmt! Rollt es? Fällt nichts ab? Dann kann es losgehen.", "Верно! Едет ли? Ничего не отваливается? Тогда можно начинать."),
      ende("Super, {name}! Schau dir ein Spielzeugauto genau an: Wo sind die Achsen?", "Супер, {name}! Рассмотри игрушечную машинку: где оси?")
    ] });
  we({ id: "we-papier", lb: "we2", kl: 2, lz: ["su.te.04"], name: "Papier: falten, schneiden, kleben", e: "📄", farbe: "#E0A800", grund: "#FFF7D6",
    kurz: "Papiersorten, falten und falzen, schneiden, kleben, Recyclingpapier", schritte: [
      info("Papier ist ein Werkstoff", "📄", "Papier gibt es dünn und dick, glatt und rau: Zeichenpapier, Pappe, Karton, Wellpappe. Man kann es falten, schneiden und kleben.",
        "Бумага бывает тонкой и толстой, гладкой и шершавой: рисовальная бумага, картон, гофрокартон. Её можно складывать, резать и клеить.",
        [["Umformen: falten, falzen, biegen", "Изменить форму: сложить, загнуть, согнуть"], ["Trennen: schneiden, lochen", "Разделить: резать, пробивать"], ["Fügen: kleben, klammern", "Соединить: клеить, скреплять"]]),
      wahl("Was ist am festesten?", "Что самое прочное?", "📦",
        ["Wellpappe", "Гофрокартон", "Richtig! Die Wellen in der Mitte machen sie stabil – darum sind Kartons daraus.", "Правильно! Волны внутри делают его прочным – поэтому из него коробки."],
        ["Seidenpapier", "Папиросная бумага", "Seidenpapier ist ganz dünn.", "Папиросная бумага очень тонкая."],
        ["Zeitungspapier", "Газетная бумага", "Zeitung reißt leicht.", "Газета легко рвётся."]),
      zuordnen("Was machst du gerade?", "Что ты делаешь?", [["umformen", "Umformen", "Изменяю форму", "📐"], ["trennen", "Trennen", "Разделяю", "✂️"], ["fuegen", "Fügen", "Соединяю", "🧴"]],
        [["Einen Papierflieger falten", "Складываю самолётик", "umformen"], ["Mit der Schere schneiden", "Режу ножницами", "trennen"], ["Zwei Teile zusammenkleben", "Склеиваю две части", "fuegen"]]),
      daumen("Recyclingpapier wird aus Altpapier gemacht – das schont die Bäume.", "Бумагу из вторсырья делают из макулатуры – это бережёт деревья.", "♻️", true,
        "Stimmt! Darum gehört Papier in die Papiertonne.", "Верно! Поэтому бумага идёт в бак для бумаги."),
      ende("Klasse, {name}! Falte einen Papierflieger und teste: Fliegt er gerade?", "Класс, {name}! Сложи бумажный самолётик и проверь: летит ли он прямо?")
    ] });
  we({ id: "we-werkzeug", lb: "we2", kl: 2, lz: ["su.te.04"], name: "Werkzeug sicher benutzen", e: "✂️", farbe: "#E0574A", grund: "#FFECE8",
    kurz: "Schere, Lineal, Zirkel, Schablone, Anreißen, Ordnung am Arbeitsplatz", schritte: [
      info("Sicher arbeiten", "✂️", "Werkzeuge helfen, aber man muss sie richtig benutzen. Ein ordentlicher Arbeitsplatz verhindert Unfälle.",
        "Инструменты помогают, но ими надо правильно пользоваться. Порядок на рабочем месте помогает избежать несчастных случаев."),
      wahl("Wie gibst du jemandem eine Schere?", "Как передать кому-то ножницы?", "✂️",
        ["Geschlossen, mit dem Griff zuerst", "Закрытыми, ручками вперёд", "Richtig! So kann sich niemand verletzen.", "Правильно! Так никто не поранится."],
        ["Offen, mit der Spitze zuerst", "Открытыми, остриём вперёд", "Gefährlich! Die Spitze zeigt auf den anderen.", "Опасно! Остриё направлено на другого."],
        ["Werfen", "Бросить", "Niemals Werkzeug werfen!", "Никогда не бросай инструменты!"]),
      zuordnen("Wofür brauchst du es?", "Для чего это нужно?", [["messen", "Messen", "Измерять", "📏"], ["kreis", "Kreis zeichnen", "Рисовать круг", "⭕"], ["form", "Form übertragen", "Переносить форму", "⭐"]],
        [["Lineal", "Линейка", "messen"], ["Zirkel", "Циркуль", "kreis"], ["Schablone", "Шаблон", "form"]]),
      daumen("Anreißen heißt: Man zeichnet vor dem Schneiden genau an, wo geschnitten wird.", "Разметка значит: до резки точно отмечают, где резать.", "✏️", true,
        "Stimmt! Mit Schablone und Lineal wird es besonders genau.", "Верно! С шаблоном и линейкой получается особенно точно."),
      daumen("Am Ende räumt man den Arbeitsplatz auf und geht sparsam mit dem Material um.", "В конце убирают рабочее место и экономно расходуют материал.", "🧹", true,
        "Stimmt! Reste kann man oft noch verwenden.", "Верно! Остатки часто можно ещё использовать."),
      ende("Super, {name}! Zeichne mit einer Schablone eine Form an und schneide sie genau aus.", "Супер, {name}! Обведи фигуру по шаблону и аккуратно вырежи её.")
    ] });
  we({ id: "we-bauen", lb: "we3", kl: 2, lz: ["su.te.02"], name: "Stabile Türme und Brücken", e: "🌉", farbe: "#8A6D3B", grund: "#F7F0E3",
    kurz: "Profile, Dreiecke, Schichten und Verbinden, Stabilität testen", schritte: [
      info("Was macht ein Bauwerk stabil?", "🌉", "Brücken und Türme müssen viel aushalten. Ingenieure nutzen Tricks: gefaltete Profile, Dreiecke und gute Verbindungen.",
        "Мосты и башни должны выдерживать многое. Инженеры используют приёмы: сложенные профили, треугольники и хорошие соединения."),
      wahl("Ein flaches Blatt Papier als Brücke knickt sofort ein. Was hilft?", "Плоский лист бумаги-мост сразу прогибается. Что поможет?", "📄",
        ["Das Papier wie eine Ziehharmonika falten", "Сложить бумагу гармошкой", "Richtig! Durch das Falten entsteht ein Profil – es trägt viel mehr.", "Правильно! Складывание даёт профиль – он держит гораздо больше."],
        ["Das Papier nass machen", "Намочить бумагу", "Nasses Papier wird noch weicher.", "Мокрая бумага ещё мягче."],
        ["Ein dünneres Papier nehmen", "Взять бумагу тоньше", "Dünneres Papier trägt noch weniger.", "Тонкая бумага держит ещё меньше."]),
      daumen("Ein Dreieck ist eine besonders stabile Form – es verschiebt sich nicht.", "Треугольник – особенно устойчивая форма: он не перекашивается.", "🔺", true,
        "Stimmt! Darum sieht man an Brücken, Kränen und Dächern so viele Dreiecke.", "Верно! Поэтому на мостах, кранах и крышах столько треугольников."),
      wahl("Du baust einen Turm aus Bauklötzen. Wie hält er am besten?", "Ты строишь башню из кубиков. Как она лучше всего держится?", "🧱",
        ["Unten breit, oben schmaler", "Внизу широкая, вверху уже", "Genau! Ein breiter Fuß macht den Turm standfest.", "Точно! Широкое основание делает башню устойчивой."],
        ["Unten schmal, oben breit", "Внизу узкая, вверху широкая", "Der kippt schnell um.", "Такая быстро упадёт."],
        ["Ganz schief", "Совсем криво", "Schiefe Türme fallen leicht um.", "Кривые башни легко падают."]),
      ende("Klasse, {name}! Bau eine Papierbrücke zwischen zwei Büchern und teste, wie viele Münzen sie trägt.", "Класс, {name}! Построй бумажный мост между двумя книгами и проверь, сколько монет он выдержит.")
    ] });

  we({ id: "we-strom", lb: "we4", stufe: 3, lz: ["su.na.09", "su.te.04"], name: "Strom: Bauteile und Schaltplan", e: "🔋", farbe: "#E0A800", grund: "#FFF7D6",
    kurz: "erneuerbare Energie, Batterie, Schalter, Lampe, Motor, Schaltplan, Leiter und Isolator, Sicherheit", schritte: [
      info("Strom kommt aus der Natur", "🔋", "Strom kann aus Sonne, Wind, Wasser oder Pflanzen (Biomasse) gewonnen werden. Diese Energiequellen gehen nicht aus – man nennt sie erneuerbar.",
        "Электричество можно получать из солнца, ветра, воды или растений (биомассы). Эти источники не кончаются – их называют возобновляемыми."),
      zuordnen("Was macht das Bauteil?", "Что делает деталь?", [["quelle", "Gibt Strom", "Даёт ток", "🔋"], ["schalter", "Schaltet ein und aus", "Включает и выключает", "🔘"], ["verbraucher", "Braucht Strom", "Потребляет ток", "💡"]],
        [["Batterie", "Батарейка", "quelle"], ["Schalter", "Выключатель", "schalter"], ["Lämpchen", "Лампочка", "verbraucher"], ["Elektromotor", "Электромотор", "verbraucher"]]),
      wahl("Das Lämpchen leuchtet nicht. Woran kann es liegen?", "Лампочка не горит. В чём может быть причина?", "💡",
        ["Der Stromkreis ist nicht geschlossen", "Цепь не замкнута", "Richtig! Strom fließt nur im geschlossenen Kreis. Prüf alle Verbindungen.", "Правильно! Ток течёт только по замкнутой цепи. Проверь все соединения."],
        ["Das Kabel ist zu bunt", "Провод слишком яркий", "Die Farbe des Kabels ist egal.", "Цвет провода не важен."],
        ["Es ist Tag", "Сейчас день", "Ein Lämpchen leuchtet auch am Tag.", "Лампочка горит и днём."]),
      zuordnen("Leitet es Strom?", "Проводит ли ток?", [["leiter", "Leiter", "Проводник", "🔩"], ["isolator", "Isolator", "Изолятор", "🧤"]],
        [["Kupferdraht", "Медная проволока", "leiter"], ["Büroklammer", "Скрепка", "leiter"], ["Holzstab", "Деревянная палочка", "isolator"], ["Plastiklöffel", "Пластиковая ложка", "isolator"]]),
      daumen("Ein Schaltplan zeigt mit Zeichen, wie die Bauteile verbunden sind.", "Электрическая схема показывает знаками, как соединены детали.", "📐", true,
        "Stimmt! Mit dem Schaltplan kann jeder den Stromkreis nachbauen.", "Верно! По схеме каждый может собрать цепь."),
      daumen("Mit Strom aus der Steckdose darf man experimentieren, wenn man vorsichtig ist.", "С током из розетки можно экспериментировать, если быть осторожным.", "🔌", false,
        "Nein! Strom aus der Steckdose ist lebensgefährlich. Versuche nur mit kleinen Batterien.", "Нет! Ток из розетки опасен для жизни. Опыты – только с маленькими батарейками."),
      ende("Super, {name}! Wenn ihr einen Baukasten habt: Baut einen Stromkreis mit Schalter.", "Супер, {name}! Если есть конструктор: соберите цепь с выключателем.")
    ] });
  we({ id: "we-holz", lb: "we2", stufe: 3, lz: ["su.te.04"], name: "Holz bearbeiten", e: "🪵", farbe: "#8A6D3B", grund: "#F7F0E3",
    kurz: "Holz als nachwachsender Rohstoff, Eigenschaften, sägen, feilen, raspeln, schleifen, fügen", schritte: [
      info("Holz wächst nach", "🪵", "Holz ist ein nachwachsender Rohstoff: Für gefällte Bäume pflanzt man neue. Es gibt weiches Holz wie Fichte und hartes Holz wie Eiche oder Buche.",
        "Древесина – возобновляемое сырьё: вместо срубленных деревьев сажают новые. Бывает мягкая древесина, как ель, и твёрдая, как дуб или бук."),
      daumen("Wenn Holz nass wird, quillt es auf – es wird dicker.", "Когда дерево намокает, оно разбухает – становится толще.", "💧", true,
        "Stimmt! Darum klemmen Holztüren manchmal, wenn es feucht ist.", "Верно! Поэтому деревянные двери иногда заедают в сырую погоду."),
      zuordnen("Welches Werkzeug?", "Какой инструмент?", [["trennen", "Trennen", "Разделить", "🪚"], ["glatt", "Glätten", "Сгладить", "🧽"], ["fuegen", "Verbinden", "Соединить", "🔨"]],
        [["Säge", "Пила", "trennen"], ["Schleifpapier", "Наждачная бумага", "glatt"], ["Feile", "Напильник", "glatt"], ["Hammer und Nagel", "Молоток и гвоздь", "fuegen"]]),
      wahl("Was machst du zuerst, bevor du sägst?", "Что сделать прежде, чем пилить?", "🪚",
        ["Das Holz fest einspannen", "Крепко зажать дерево", "Richtig! Ein eingespanntes Werkstück rutscht nicht – das ist sicherer und genauer.", "Правильно! Зажатая заготовка не скользит – так безопаснее и точнее."],
        ["Das Holz mit der Hand in die Luft halten", "Держать дерево рукой на весу", "Gefährlich! Die Säge kann abrutschen.", "Опасно! Пила может соскользнуть."],
        ["Gleich losschneiden ohne Linie", "Сразу пилить без линии", "Erst anreißen und einspannen, dann sägen.", "Сначала разметить и зажать, потом пилить."]),
      wahl("Du schleifst Holz glatt. Welches Schleifpapier nimmst du zum Schluss?", "Ты шлифуешь дерево. Какую наждачную бумагу взять в конце?", "🧽",
        ["Feines", "Мелкую", "Genau! Erst grob, dann fein – so wird es ganz glatt.", "Точно! Сначала грубую, потом мелкую – так станет совсем гладко."],
        ["Ganz grobes", "Очень грубую", "Grobes Papier macht Kratzer – zum Schluss nimmt man feines.", "Грубая оставляет царапины – в конце берут мелкую."],
        ["Gar keins", "Никакую", "Ohne Schleifen bleibt das Holz rau.", "Без шлифовки дерево останется шершавым."]),
      ende("Klasse, {name}! Schleif mit einem Erwachsenen ein Stück Holz glatt und fühl den Unterschied.", "Класс, {name}! Отшлифуй со взрослым кусочек дерева и почувствуй разницу.")
    ] });

  we({ id: "we-fahrrad", lb: "we5", stufe: 4, lz: ["su.te.03", "su.te.05"], name: "Das Fahrrad pflegen", e: "🚲", farbe: "#3BAA5C", grund: "#E8F7EC",
    kurz: "Antrieb, Übertragung, Abtrieb, Fehlersuche, warten und pflegen, reparieren statt wegwerfen", schritte: [
      info("Wie ein Fahrrad funktioniert", "🚲", "Am Fahrrad gibt es Baugruppen: Antrieb (Pedale und Kettenblatt), Übertragung (Kette) und Abtrieb (Ritzel und Hinterrad).",
        "У велосипеда есть узлы: привод (педали и передняя звезда), передача (цепь) и ведомая часть (задняя звёздочка и колесо)."),
      zuordnen("Welche Baugruppe?", "Какой узел?", [["antrieb", "Antrieb", "Привод", "🦶"], ["uebertragung", "Übertragung", "Передача", "⛓️"], ["abtrieb", "Abtrieb", "Ведомая часть", "🛞"]],
        [["Pedale", "Педали", "antrieb"], ["Kette", "Цепь", "uebertragung"], ["Hinterrad", "Заднее колесо", "abtrieb"]]),
      wahl("Die Kette quietscht und ist ganz trocken. Was hilft?", "Цепь скрипит и совсем сухая. Что поможет?", "⛓️",
        ["Kette säubern und ölen", "Почистить и смазать цепь", "Richtig! So läuft sie leicht und rostet nicht.", "Правильно! Так она легко идёт и не ржавеет."],
        ["Wasser darüber kippen", "Полить водой", "Wasser allein macht sie rostig.", "Одна вода вызовет ржавчину."],
        ["Ein neues Fahrrad kaufen", "Купить новый велосипед", "Viel zu teuer – Pflege reicht.", "Слишком дорого – хватит ухода."]),
      daumen("Wenn etwas kaputt ist, sucht man den Fehler Schritt für Schritt – oft hilft die Bedienungsanleitung.", "Если что-то сломалось, ищут неисправность шаг за шагом – часто помогает инструкция.", "📖", true,
        "Stimmt! Zum Beispiel: Ist Luft im Reifen? Greift die Bremse? Sitzt die Kette?", "Верно! Например: есть ли воздух в шине? Работает ли тормоз? На месте ли цепь?"),
      daumen("Alte Batterien darf man in den Hausmüll werfen.", "Старые батарейки можно выбрасывать в обычный мусор.", "🔋", false,
        "Nein! In Batterien sind schädliche Stoffe. Sie gehören in die Sammelbox, zum Beispiel im Supermarkt.", "Нет! В батарейках вредные вещества. Их сдают в специальный ящик, например в супермаркете."),
      ende("Super, {name}! Prüf mit einem Erwachsenen dein Fahrrad: Luft, Bremsen, Licht, Kette.", "Супер, {name}! Проверь со взрослым велосипед: шины, тормоза, свет, цепь.")
    ] });
  we({ id: "we-werkstoffe", lb: "we2", stufe: 4, lz: ["su.te.04"], name: "Holz oder Kunststoff?", e: "🧪", farbe: "#2F86C8", grund: "#EAF4FC",
    kurz: "Holzwerkstoffe und Kunststoffe vergleichen, Vor- und Nachteile, Umwelt, technische Skizze und Stückliste", schritte: [
      info("Werkstoffe vergleichen", "🧪", "Für jedes Produkt wählt man den passenden Werkstoff. Holz ist natürlich und wächst nach. Kunststoff ist leicht und wasserfest, wird aber meist aus Erdöl gemacht.",
        "Для каждого изделия выбирают подходящий материал. Дерево природное и восстанавливается. Пластик лёгкий и не боится воды, но его обычно делают из нефти."),
      zuordnen("Holzwerkstoff oder Kunststoff?", "Древесный материал или пластик?", [["holz", "Holzwerkstoff", "Древесный материал", "🪵"], ["kunst", "Kunststoff", "Пластик", "🧴"]],
        [["Sperrholz", "Фанера", "holz"], ["Furnier", "Шпон", "holz"], ["Plastikflasche", "Пластиковая бутылка", "kunst"], ["Gummiband", "Резинка", "kunst"]]),
      wahl("Manche Kunststoffe werden warm weich und lassen sich formen. Wie heißen sie?", "Некоторые пластики при нагревании размягчаются и формуются. Как они называются?", "🔥",
        ["Thermoplaste", "Термопласты", "Richtig! Duroplaste bleiben auch warm hart, Elastomere sind gummiartig.", "Правильно! Реактопласты и в тепле твёрдые, эластомеры похожи на резину."],
        ["Duroplaste", "Реактопласты", "Duroplaste bleiben hart, auch wenn sie warm werden.", "Реактопласты остаются твёрдыми и в тепле."],
        ["Elastomere", "Эластомеры", "Elastomere sind dehnbar wie Gummi.", "Эластомеры растягиваются, как резина."]),
      daumen("Kunststoff in der Natur zerfällt nach wenigen Tagen.", "Пластик в природе разлагается за несколько дней.", "🌊", false,
        "Nein! Kunststoff bleibt Hunderte Jahre liegen. Darum: wenig Plastik, richtig trennen, recyceln.", "Нет! Пластик лежит сотни лет. Поэтому: меньше пластика, правильно сортировать, перерабатывать."),
      daumen("Vor dem Bauen schreibt man eine Stückliste: Welche Teile, wie viele, wie groß?", "Перед изготовлением пишут список деталей: какие, сколько, какого размера.", "📝", true,
        "Stimmt! Mit technischer Skizze und Stückliste plant man ein Produkt wie eine Bücherstütze.", "Верно! С техническим эскизом и списком деталей планируют изделие, например подставку для книг."),
      ende("Klasse, {name}! Such zu Hause drei Dinge aus Holz und drei aus Kunststoff. Warum wurde der Werkstoff gewählt?", "Класс, {name}! Найди дома три вещи из дерева и три из пластика. Почему выбрали этот материал?")
    ] });
  we({ id: "we-roboter", lb: "we6", stufe: 4, lz: ["su.te.05", "me.ph.01"], name: "Roboter und Automaten", e: "🤖", farbe: "#7B55B8", grund: "#F1EAFF",
    kurz: "Eingabe – Verarbeitung – Ausgabe, Sensor und Aktor, einfache Befehlsfolgen", schritte: [
      info("Wie ein Automat denkt", "🤖", "Roboter und Automaten arbeiten nach dem EVA-Prinzip: Eingabe – Verarbeitung – Ausgabe. Ein Sensor misst etwas, ein Programm entscheidet, ein Aktor (zum Beispiel ein Motor) bewegt etwas.",
        "Роботы и автоматы работают по принципу ВОВ: ввод – обработка – вывод. Датчик что-то измеряет, программа решает, исполнительный механизм (например, мотор) что-то двигает."),
      zuordnen("Fahrkartenautomat: Was ist was?", "Билетный автомат: что есть что?", [["e", "Eingabe", "Ввод", "⌨️"], ["v", "Verarbeitung", "Обработка", "🧠"], ["a", "Ausgabe", "Вывод", "🎫"]],
        [["Ziel wählen und Geld einwerfen", "Выбрать станцию и бросить деньги", "e"], ["Preis berechnen", "Посчитать цену", "v"], ["Fahrkarte und Wechselgeld kommen heraus", "Выходят билет и сдача", "a"]]),
      wahl("Ein Staubsaugerroboter stößt an die Wand und dreht um. Womit hat er die Wand bemerkt?", "Робот-пылесос упирается в стену и разворачивается. Чем он заметил стену?", "🧹",
        ["Ein Sensor", "Датчик", "Richtig! Der Sensor meldet das Hindernis, das Programm lässt umdrehen.", "Правильно! Датчик сообщает о препятствии, программа велит развернуться."],
        ["Die Bürste", "Щётка", "Die Bürste kehrt nur.", "Щётка только подметает."],
        ["Der Akku", "Аккумулятор", "Der Akku gibt nur Strom.", "Аккумулятор только даёт ток."]),
      wahl("Ein Roboter soll 2 Felder vor, dann nach rechts drehen und 1 Feld vor. Welches Programm stimmt?", "Робот должен пройти 2 клетки вперёд, повернуть направо и пройти 1 клетку. Какая программа верна?", "🗺️",
        ["⬆️ ⬆️ ↪️ ⬆️", "⬆️ ⬆️ ↪️ ⬆️", "Genau! Die Reihenfolge der Befehle ist wichtig.", "Точно! Порядок команд важен."],
        ["⬆️ ↪️ ⬆️ ⬆️", "⬆️ ↪️ ⬆️ ⬆️", "Hier dreht er zu früh.", "Здесь он поворачивает слишком рано."],
        ["↪️ ⬆️ ⬆️ ⬆️", "↪️ ⬆️ ⬆️ ⬆️", "Hier dreht er schon am Anfang.", "Здесь он поворачивает в самом начале."]),
      daumen("Roboter können manche Arbeit abnehmen – aber sie machen nur das, was ihr Programm sagt.", "Роботы могут взять на себя часть работы – но делают только то, что велит программа.", "⚙️", true,
        "Stimmt! Ein Rasenmähroboter mäht – aber er merkt nicht von selbst, ob ein Igel im Gras sitzt. Darum nicht nachts mähen lassen.", "Верно! Робот-газонокосилка косит – но сам не замечает ежа в траве. Поэтому не стоит косить ночью."),
      ende("Super, {name}! Spielt Roboter: Einer gibt Befehle (vor, rechts, links), der andere führt sie genau aus.", "Супер, {name}! Поиграйте в робота: один даёт команды (вперёд, направо, налево), другой точно выполняет.")
    ] });

  // ==================== SPORT (Lehrplan Grundschule Sport 2019; Klassen 1/2 und 3/4) ====================
  // Bewegen kann die App nicht ersetzen: Die Themen üben Regeln, Sicherheit und Wissen; Bewegungsideen stehen in den Echte-Welt-Aufgaben.
  // Themen für Kl. 3/4 tragen stufe 4: sichtbar ab Kl. 3 und in Kl. 4 nicht eingeklappt.
  const sp = (t) => neu("sport", t);
  sp({ id: "sp-laufen", lb: "sp1", kl: 2, lz: ["sp.be.01"], name: "Laufen, springen, werfen", e: "🏃", farbe: "#E0574A", grund: "#FFECE8",
    kurz: "Startkommando, schnell laufen, weit springen, werfen, ausdauernd laufen", schritte: [
      info("Leichtathletik", "🏃", "Laufen, Springen und Werfen nennt man Leichtathletik. Es geht um schneller, höher, weiter – und darum, dass du dich selbst verbesserst.",
        "Бег, прыжки и метание называют лёгкой атлетикой. Речь о том, чтобы быстрее, выше, дальше – и чтобы ты сам становился лучше."),
      wahl("Wie heißt das Startkommando?", "Как звучит команда старта?", "🏁",
        ["Auf die Plätze – fertig – los!", "На старт – внимание – марш!", "Richtig! Bei „los“ startest du – nicht vorher.", "Правильно! На «марш» ты стартуешь – не раньше."],
        ["Eins – zwei – drei – vier!", "Раз – два – три – четыре!", "Das ist zum Zählen, nicht zum Starten.", "Это для счёта, а не для старта."],
        ["Achtung – Pause – stopp!", "Внимание – пауза – стоп!", "Mit „stopp“ würdest du stehen bleiben.", "С «стоп» ты бы остановился."]),
      wahl("Du läufst 10 Minuten am Stück. Wie schnell läufst du?", "Ты бежишь 10 минут без остановки. Как быстро?", "🫀",
        ["So, dass du dich noch unterhalten kannst", "Так, чтобы ещё можно было разговаривать", "Genau! Ausdauernd läuft man gleichmäßig und nicht zu schnell.", "Точно! На выносливость бегут ровно и не слишком быстро."],
        ["So schnell ich kann", "Как можно быстрее", "Dann bist du nach einer Minute aus der Puste.", "Тогда через минуту ты выдохнешься."],
        ["Erst schnell, dann gehen", "Сначала быстро, потом пешком", "Für Ausdauer läufst du lieber gleichmäßig.", "Для выносливости лучше бежать ровно."]),
      daumen("Beim Weitsprung springt man mit einem Bein ab und landet mit beiden Füßen.", "В прыжке в длину отталкиваются одной ногой и приземляются на обе.", "🦘", true,
        "Stimmt! Der Anlauf wird dabei immer schneller.", "Верно! Разбег при этом становится всё быстрее."),
      wahl("Du wirfst einen Ball mit der rechten Hand weit. Welcher Fuß steht vorn?", "Ты бросаешь мяч далеко правой рукой. Какая нога впереди?", "⚾",
        ["Der linke Fuß", "Левая нога", "Richtig! Beim Schlagwurf steht das Gegenbein vorn – so kommt mehr Schwung.", "Правильно! При броске впереди противоположная нога – так больше размах."],
        ["Der rechte Fuß", "Правая нога", "Probier es aus: Mit dem linken Fuß vorn fliegt der Ball weiter.", "Попробуй: с левой ногой впереди мяч летит дальше."],
        ["Beide nebeneinander", "Обе рядом", "Mit einem Schritt nach vorn wirfst du weiter.", "С шагом вперёд бросишь дальше."]),
      ende("Super, {name}! Lauf draußen eine kurze Strecke und versuch beim zweiten Mal, schneller zu sein.", "Супер, {name}! Пробеги на улице короткую дистанцию и попробуй во второй раз быстрее.")
    ] });
  sp({ id: "sp-fair", lb: "sp2", kl: 2, lz: ["sp.be.03", "et.mi.01"], name: "Spielen und Fair Play", e: "⚽", farbe: "#3BAA5C", grund: "#E8F7EC",
    kurz: "kleine Spiele, Fangen, Staffeln, Regeln, fair mit- und gegeneinander spielen", schritte: [
      info("Kleine Spiele", "⚽", "Fangspiele, Staffeln, Ballspiele – in Sport spielt ihr viele kleine Spiele. Damit alle Spaß haben, gibt es Regeln und Fair Play.",
        "Догонялки, эстафеты, игры с мячом – на физкультуре много маленьких игр. Чтобы всем было весело, есть правила и честная игра."),
      wahl("Was ist Fair Play?", "Что такое честная игра (фэйр-плей)?", "🤝",
        ["Regeln einhalten und die anderen achten", "Соблюдать правила и уважать других", "Richtig! Auch beim Verlieren bleibt man freundlich.", "Правильно! И при проигрыше остаются дружелюбными."],
        ["Immer gewinnen wollen, egal wie", "Всегда хотеть победить любой ценой", "Nein, gewinnen ist schön – aber nur fair.", "Нет, побеждать приятно – но только честно."],
        ["Den anderen ein Bein stellen", "Ставить другим подножку", "Das ist unfair und gefährlich.", "Это нечестно и опасно."]),
      zuordnen("Fair oder unfair?", "Честно или нечестно?", [["fair", "Fair", "Честно", "👍"], ["unfair", "Unfair", "Нечестно", "👎"]],
        [["Dem Gegner aufhelfen, wenn er hinfällt", "Помочь сопернику встать, если он упал", "fair"], ["Gratulieren, wenn die anderen gewinnen", "Поздравить, когда выиграли другие", "fair"], ["Heimlich die Regeln ändern", "Тайком менять правила", "unfair"]]),
      daumen("Bei guten Fangspielen scheidet niemand für lange Zeit aus.", "В хороших догонялках никто не выбывает надолго.", "🏃", true,
        "Stimmt! Dann können alle die ganze Zeit mitspielen und sich bewegen.", "Верно! Тогда все могут играть и двигаться всё время."),
      daumen("Spielregeln kann man gemeinsam aushandeln und auch verändern.", "Правила игры можно вместе обсудить и даже изменить.", "📋", true,
        "Stimmt! Wichtig ist, dass alle vorher Bescheid wissen und zustimmen.", "Верно! Важно, чтобы все заранее знали и согласились."),
      ende("Klasse, {name}! Erfinde mit Freunden ein Spiel und macht gemeinsam die Regeln aus.", "Класс, {name}! Придумай с друзьями игру и договоритесь вместе о правилах.")
    ] });
  sp({ id: "sp-turnen", lb: "sp3", kl: 2, lz: ["sp.be.01", "sp.be.03"], name: "Sicher turnen", e: "🤸", farbe: "#2F6FD6", grund: "#EAF2FF",
    kurz: "Geräte sicher aufbauen, Rolle vorwärts, helfen, balancieren, Spannung und Entspannung", schritte: [
      info("In der Turnhalle", "🤸", "Beim Turnen kletterst, rollst, springst und balancierst du. Damit nichts passiert, baut ihr die Geräte gemeinsam auf und haltet euch an die Regeln.",
        "На гимнастике ты лазаешь, кувыркаешься, прыгаешь и держишь равновесие. Чтобы ничего не случилось, снаряды ставят вместе и соблюдают правила."),
      zuordnen("Sicher oder gefährlich?", "Безопасно или опасно?", [["sicher", "Sicher", "Безопасно", "✅"], ["gefahr", "Gefährlich", "Опасно", "⚠️"]],
        [["Schmuck vor dem Turnen ablegen", "Снять украшения перед гимнастикой", "sicher"], ["Matten unter die Geräte legen", "Положить маты под снаряды", "sicher"], ["Unter dem schwingenden Seil durchlaufen", "Пробегать под качающимся канатом", "gefahr"]]),
      wahl("Bei der Rolle vorwärts – wohin kommt dein Kinn?", "При кувырке вперёд – куда девается подбородок?", "🤸",
        ["Auf die Brust", "К груди", "Richtig! Mach dich rund wie ein Igel – dann rollst du sanft.", "Правильно! Сгруппируйся, как ёжик, – тогда кувырок мягкий."],
        ["Nach oben in die Luft", "Вверх", "Dann rollst du über den Kopf – das tut weh.", "Тогда ты перекатишься через голову – это больно."],
        ["Auf die Matte", "На мат", "Der Kopf berührt die Matte nur ganz hinten, das Kinn bleibt auf der Brust.", "Голова касается мата только затылком, подбородок у груди."]),
      daumen("Beim Balancieren hilft es, die Arme zur Seite auszustrecken.", "При балансировании помогает развести руки в стороны.", "🤹", true,
        "Stimmt! So hältst du dein Gleichgewicht leichter – wie ein Seiltänzer.", "Верно! Так легче держать равновесие – как канатоходец."),
      daumen("Wer sich etwas noch nicht traut, darf um Hilfe bitten.", "Кто ещё боится, может попросить о помощи.", "🙋", true,
        "Stimmt! Sich helfen lassen und anderen helfen gehört zum Turnen dazu.", "Верно! Принимать помощь и помогать другим – часть гимнастики."),
      ende("Super, {name}! Üb mit einem Erwachsenen auf einer weichen Wiese die Rolle vorwärts.", "Супер, {name}! Потренируйся со взрослым на мягкой траве делать кувырок вперёд.")
    ] });
  sp({ id: "sp-tanz", lb: "sp4", kl: 2, lz: ["sp.be.01", "mu.ma.01"], name: "Rhythmus, Tanz und gute Haltung", e: "💃", farbe: "#C2337A", grund: "#FFEAF3",
    kurz: "Handgeräte, Bewegungslieder, Rhythmus, Sinne schulen, Spannung und Entspannung", schritte: [
      info("Gymnastik und Tanz", "💃", "Mit Ball, Seil, Reifen oder Tüchern kann man viele Bewegungen erfinden. Zu Musik geht, läuft und hüpft man im Rhythmus.",
        "С мячом, скакалкой, обручем или платками можно придумать много движений. Под музыку ходят, бегут и прыгают в ритме."),
      wahl("Du sollst dich wie ein Tier zur Musik bewegen. Die Musik ist leicht und flatternd. Welches Tier?", "Нужно двигаться под музыку как животное. Музыка лёгкая и порхающая. Какое?", "🦋",
        ["Schmetterling", "Бабочка", "Richtig! Leichte Musik – leichte Bewegungen.", "Правильно! Лёгкая музыка – лёгкие движения."],
        ["Bär", "Медведь", "Ein Bär passt eher zu schwerer, tiefer Musik.", "Медведь подходит скорее к тяжёлой низкой музыке."],
        ["Schnecke", "Улитка", "Eine Schnecke passt eher zu sehr langsamer Musik.", "Улитка подходит скорее к очень медленной музыке."]),
      daumen("Nach dem Toben hilft eine Entspannung, zum Beispiel eine Fantasiereise.", "После беготни помогает расслабление, например путешествие в фантазии.", "🧘", true,
        "Stimmt! Anspannen und Entspannen ist gut für den Körper.", "Верно! Напрягаться и расслабляться полезно для тела."),
      zuordnen("Mit welchem Sinn?", "Каким чувством?", [["sehen", "Sehen", "Зрение", "👀"], ["hoeren", "Hören", "Слух", "👂"], ["fuehlen", "Fühlen", "Осязание", "✋"]],
        [["Einem Partner alles nachmachen", "Повторять всё за партнёром", "sehen"], ["Mit geschlossenen Augen einem Klang folgen", "С закрытыми глазами идти на звук", "hoeren"], ["Barfuß über eine Matte tasten", "Идти босиком по мату на ощупь", "fuehlen"]]),
      ende("Toll, {name}! Mach Musik an und hüpf im Rhythmus – mal mit einem Ball, mal mit einem Tuch.", "Здорово, {name}! Включи музыку и прыгай в ритме – то с мячом, то с платком.")
    ] });
  sp({ id: "sp-baderegeln", lb: "sp5", kl: 2, lz: ["sp.be.03"], name: "Schwimmen und Baderegeln", e: "🏊", farbe: "#1F8F8A", grund: "#E6F7F5",
    kurz: "Baderegeln, sicher im Wasser, Schwimmen lernen, Hilfe holen", schritte: [
      info("Sicher im Wasser", "🏊", "Schwimmen lernen ist sehr wichtig – es kann Leben retten. Meist lernt man es in Klasse 2. Dazu gehören die Baderegeln.",
        "Научиться плавать очень важно – это может спасти жизнь. Обычно этому учатся во 2 классе. К этому относятся правила купания.",
        [["Nur ins Wasser, wenn es dir gut geht", "Заходить в воду, только если хорошо себя чувствуешь"], ["Vorher abkühlen oder duschen", "Сначала охладиться или принять душ"], ["Nur springen, wo das Wasser tief genug und frei ist", "Прыгать только там, где глубоко и свободно"]]),
      wahl("Am See zieht ein Gewitter auf. Was tust du?", "Над озером собирается гроза. Что ты делаешь?", "⛈️",
        ["Sofort aus dem Wasser gehen", "Сразу выйти из воды", "Richtig! Bei Gewitter ist Baden lebensgefährlich.", "Правильно! В грозу купаться опасно для жизни."],
        ["Schnell noch tauchen", "Быстро ещё нырнуть", "Nein! Bei Gewitter sofort raus aus dem Wasser.", "Нет! В грозу сразу выходи из воды."],
        ["Weiter weg schwimmen", "Отплыть подальше", "Nein, sofort ans Ufer und raus.", "Нет, сразу к берегу и из воды."]),
      daumen("Andere unter Wasser zu drücken ist ein lustiger Spaß.", "Топить других – весёлая шутка.", "🚫", false,
        "Nein! Das ist gefährlich, denn der andere bekommt keine Luft.", "Нет! Это опасно – другому нечем дышать."),
      wahl("Jemand ruft im Wasser um Hilfe. Was machst du als Kind?", "Кто-то в воде зовёт на помощь. Что ты делаешь как ребёнок?", "🆘",
        ["Laut einen Erwachsenen oder den Bademeister rufen", "Громко позвать взрослого или спасателя", "Richtig! Hilfe holen ist das Wichtigste. Spring nicht selbst hinterher.", "Правильно! Позвать помощь – самое важное. Сам не прыгай."],
        ["Selbst hinterherspringen", "Прыгнуть следом", "Gefährlich! Du kannst selbst in Not geraten. Hol Hilfe.", "Опасно! Ты сам можешь попасть в беду. Позови помощь."],
        ["Weggehen", "Уйти", "Nein, hol sofort Hilfe!", "Нет, сразу позови помощь!"]),
      daumen("Mit Luftmatratze und Schwimmtier geht man nicht ins tiefe Wasser.", "С надувным матрасом и игрушкой не заплывают на глубину.", "🛟", true,
        "Stimmt! Sie können wegtreiben oder Luft verlieren.", "Верно! Их может унести, или из них выйдет воздух."),
      ende("Super, {name}! Geh mit einem Erwachsenen schwimmen und erklär ihm die Baderegeln.", "Супер, {name}! Сходи со взрослым поплавать и объясни ему правила купания.")
    ] });
  sp({ id: "sp-winter", lb: "sp6", kl: 2, lz: ["sp.be.03"], name: "Sport im Schnee und auf dem Eis", e: "⛷️", farbe: "#2F86C8", grund: "#EAF4FC",
    kurz: "warm anziehen, Schlitten fahren, Ski und Eislaufen, Rücksicht, Natur schonen", schritte: [
      info("Wintersport", "⛷️", "Im Winter kann man rodeln, Ski laufen und Schlittschuh fahren. Wichtig sind warme Kleidung, Rücksicht auf andere und Rücksicht auf die Natur.",
        "Зимой можно кататься на санках, лыжах и коньках. Важны тёплая одежда, внимание к другим и бережное отношение к природе."),
      wahl("Wie ziehst du dich zum Schlittenfahren am besten an?", "Как лучше одеться для катания на санках?", "🧤",
        ["Mehrere Schichten, Mütze, Handschuhe", "Несколько слоёв, шапка, перчатки", "Richtig! Wie eine Zwiebel – dann kannst du auch etwas ausziehen, wenn dir warm wird.", "Правильно! Как луковица – тогда можно что-то снять, если жарко."],
        ["Nur ein T-Shirt", "Только футболку", "Viel zu kalt!", "Слишком холодно!"],
        ["Badesachen", "Купальник", "Das ist für den Sommer.", "Это для лета."]),
      daumen("Zum Rodeln sucht man sich einen Hang, der nicht auf eine Straße führt.", "Для санок выбирают склон, который не выходит на дорогу.", "🛷", true,
        "Stimmt! Unten muss genug Platz zum Ausrollen sein.", "Верно! Внизу должно быть достаточно места, чтобы остановиться."),
      daumen("Auf jedes zugefrorene Gewässer darf man gehen.", "На любой замёрзший водоём можно выходить.", "🧊", false,
        "Nein! Das Eis kann zu dünn sein. Nur freigegebene Eisflächen betreten.", "Нет! Лёд может быть слишком тонким. Выходи только на разрешённый лёд."),
      ende("Klasse, {name}! Wenn Schnee liegt: Bau einen Schneemann oder fahr mit einem Erwachsenen Schlitten.", "Класс, {name}! Если лежит снег: слепи снеговика или покатайся со взрослым на санках.")
    ] });

  sp({ id: "sp-ausdauer", lb: "sp1", stufe: 4, lz: ["sp.be.01", "su.na.02"], name: "Ausdauer, Herz und Bestleistung", e: "🫀", farbe: "#E0574A", grund: "#FFECE8",
    kurz: "Lauf-ABC, Startformen, Puls fühlen, eigene Bestleistung, gut für die Gesundheit", schritte: [
      info("Fit werden", "🫀", "Wer regelmäßig ausdauernd läuft, stärkt sein Herz. In Klasse 3 und 4 lauft ihr bis zu 15 Minuten ohne Pause – jeder in seinem eigenen Tempo.",
        "Кто регулярно бегает на выносливость, укрепляет сердце. В 3–4 классе бегают до 15 минут без остановки – каждый в своём темпе."),
      wahl("Wo kannst du deinen Puls gut fühlen?", "Где хорошо прощупать пульс?", "💓",
        ["Am Handgelenk oder am Hals", "На запястье или на шее", "Richtig! Nach dem Laufen schlägt das Herz schneller.", "Правильно! После бега сердце бьётся быстрее."],
        ["An der Nasenspitze", "На кончике носа", "Da fühlst du ihn nicht gut.", "Там его плохо слышно."],
        ["Am Knie", "На колене", "Am Knie fühlst du ihn kaum.", "На колене его почти не прощупать."]),
      daumen("Eine Bestleistung vergleicht man vor allem mit sich selbst: Bin ich besser als letztes Mal?", "Свой рекорд сравнивают прежде всего с собой: лучше ли я, чем в прошлый раз?", "📈", true,
        "Stimmt! Jeder hat andere Voraussetzungen – dein Fortschritt zählt.", "Верно! У каждого свои данные – важен твой прогресс."),
      zuordnen("Lauf-ABC: Was gehört dazu?", "Беговая азбука: что туда входит?", [["abc", "Übung im Lauf-ABC", "Упражнение беговой азбуки", "🏃"], ["nicht", "Keine Laufübung", "Не беговое упражнение", "🛋️"]],
        [["Kniehebelauf", "Бег с высоким подниманием бедра", "abc"], ["Anfersen", "Захлёст голени", "abc"], ["Hopserlauf", "Бег с подскоком", "abc"], ["Im Sitzen fernsehen", "Смотреть телевизор сидя", "nicht"]]),
      wahl("Warum wärmt man sich vor dem Sport auf?", "Зачем разминаются перед спортом?", "🔥",
        ["Damit Muskeln und Herz bereit sind und man sich nicht verletzt", "Чтобы мышцы и сердце были готовы и не было травм", "Genau! Aufwärmen schützt vor Verletzungen.", "Точно! Разминка защищает от травм."],
        ["Damit man schneller müde wird", "Чтобы быстрее устать", "Nein, Aufwärmen macht bereit.", "Нет, разминка готовит."],
        ["Das braucht man nie", "Это никогда не нужно", "Doch – vor jedem Sport!", "Нужно – перед каждым спортом!"]),
      ende("Super, {name}! Lauf 10 Minuten gemütlich und fühl danach deinen Puls.", "Супер, {name}! Пробеги 10 минут спокойно и потом проверь пульс.")
    ] });
  sp({ id: "sp-regeln", lb: "sp2", stufe: 4, lz: ["sp.be.03", "et.mi.01"], name: "Spielregeln und Schiedsrichter", e: "🧑‍⚖️", farbe: "#3BAA5C", grund: "#E8F7EC",
    kurz: "Regeln erklären und verändern, Schiedsrichter sein, mit Sieg und Niederlage umgehen, Freizeitsport", schritte: [
      info("Wer pfeift?", "🧑‍⚖️", "In Klasse 3 und 4 dürft ihr selbst Schiedsrichter sein, Regeln erklären und verändern. Ihr lernt, mit Sieg und Niederlage umzugehen.",
        "В 3–4 классе можно самим быть судьями, объяснять и менять правила. Вы учитесь справляться с победой и поражением."),
      wahl("Der Schiedsrichter hat entschieden – du findest es falsch. Was ist fair?", "Судья решил – а ты считаешь, что неправильно. Что будет честно?", "🗣️",
        ["Die Entscheidung annehmen und später ruhig darüber sprechen", "Принять решение и потом спокойно обсудить", "Richtig! Ohne Schiedsrichter könnte man nicht spielen.", "Правильно! Без судьи играть было бы невозможно."],
        ["Laut schimpfen und den Ball wegschießen", "Громко ругаться и выбить мяч", "Das ist unfair – und das Spiel ist kaputt.", "Это нечестно – и игра сломана."],
        ["Einfach weiterspielen, als wäre nichts", "Просто играть дальше, будто ничего не было", "Die Regel gilt für alle – auch für dich.", "Правило для всех – и для тебя."]),
      daumen("Wer ein Spiel verliert, hat trotzdem etwas gelernt.", "Кто проиграл игру, всё равно чему-то научился.", "🥈", true,
        "Stimmt! Gratuliere den Gewinnern und überleg, was du nächstes Mal anders machst.", "Верно! Поздравь победителей и подумай, что сделать иначе в следующий раз."),
      zuordnen("Welcher Sport?", "Какой вид спорта?", [["schlaeger", "Mit Schläger", "С ракеткой или клюшкой", "🏸"], ["ball", "Nur mit Ball", "Только с мячом", "⚽"]],
        [["Federball", "Бадминтон", "schlaeger"], ["Tischtennis", "Настольный теннис", "schlaeger"], ["Floorball", "Флорбол", "schlaeger"], ["Völkerball", "Вышибалы", "ball"]]),
      ende("Klasse, {name}! Sei beim nächsten Spiel mit Freunden einmal der Schiedsrichter.", "Класс, {name}! Побудь в следующей игре с друзьями судьёй.")
    ] });
  sp({ id: "sp-ruecken", lb: "sp4", stufe: 4, lz: ["sp.be.02", "su.na.02"], name: "Starker Rücken, Seil und Aerobic", e: "🧘", farbe: "#7B55B8", grund: "#F1EAFF",
    kurz: "gute Körperhaltung, Kräftigen und Dehnen, Seilspringen, Aerobic-Schritte", schritte: [
      info("Halt dich gut", "🧘", "Viel Sitzen ist anstrengend für den Rücken. Bewegungspausen, Kräftigen und Dehnen helfen. Beim Seilspringen und bei Aerobic trainierst du Rhythmus und Ausdauer.",
        "Долгое сидение утомляет спину. Помогают паузы для движения, укрепление и растяжка. Прыгая на скакалке и занимаясь аэробикой, ты тренируешь ритм и выносливость."),
      wahl("Du hebst eine schwere Kiste vom Boden. Wie geht es rückenfreundlich?", "Ты поднимаешь тяжёлый ящик с пола. Как бережно для спины?", "📦",
        ["In die Knie gehen, Rücken gerade", "Присесть, спина прямая", "Richtig! Die Kraft kommt aus den Beinen.", "Правильно! Сила идёт из ног."],
        ["Mit krummem Rücken bücken", "Наклониться с круглой спиной", "Das belastet den Rücken stark.", "Это сильно нагружает спину."],
        ["Ruckartig hochreißen", "Резко дёрнуть вверх", "Ruckartig kann man sich verletzen.", "Резко можно травмироваться."]),
      daumen("Den Schulranzen trägt man am besten auf beiden Schultern.", "Ранец лучше всего носить на обоих плечах.", "🎒", true,
        "Stimmt! So wird das Gewicht gleichmäßig verteilt.", "Верно! Так вес распределяется равномерно."),
      zuordnen("Was ist das?", "Что это?", [["aerobic", "Aerobic-Schritt", "Шаг аэробики", "💃"], ["seil", "Seilsprung", "Прыжок через скакалку", "🪢"]],
        [["Step Touch", "Степ-тач", "aerobic"], ["V-Step", "Ви-степ", "aerobic"], ["Durchschlag mit Laufschritt", "Прыжок с пробежкой", "seil"]]),
      ende("Super, {name}! Mach heute eine Rücken-Pause: strecken, Katzenbuckel, gerade hinsetzen.", "Супер, {name}! Сделай сегодня паузу для спины: потянуться, «кошка», сесть ровно.")
    ] });
  sp({ id: "sp-piste", lb: "sp6", stufe: 4, lz: ["sp.be.03", "su.na.03"], name: "Regeln auf der Piste", e: "🎿", farbe: "#2F86C8", grund: "#EAF4FC",
    kurz: "Pistenregeln, Lift, Helm, Rücksicht, Natur im Winter schonen", schritte: [
      info("Regeln für alle auf der Piste", "🎿", "Auf Skipisten gelten Regeln, damit niemand verletzt wird. Die wichtigste: Nimm Rücksicht auf die anderen.",
        "На горнолыжных трассах действуют правила, чтобы никто не пострадал. Главное: будь внимателен к другим.",
        [["Fahr nur so schnell, wie du sicher bremsen kannst.", "Езжай так быстро, как можешь безопасно затормозить."], ["Wer von oben kommt, passt auf die Fahrer unter sich auf.", "Кто едет сверху, следит за теми, кто ниже."], ["Anhalten nur am Rand der Piste.", "Останавливайся только на краю трассы."]]),
      wahl("Du willst eine Pause machen. Wo hältst du an?", "Ты хочешь отдохнуть. Где остановиться?", "🛑",
        ["Am Rand der Piste", "На краю трассы", "Richtig! In der Mitte oder hinter einer Kuppe sieht man dich zu spät.", "Правильно! В середине или за бугром тебя увидят слишком поздно."],
        ["Mitten auf der Piste", "Посреди трассы", "Gefährlich! Dort fahren andere.", "Опасно! Там едут другие."],
        ["Direkt hinter einer Kuppe", "Сразу за бугром", "Dort sieht dich niemand rechtzeitig.", "Там тебя никто вовремя не увидит."]),
      daumen("Ein Helm schützt beim Skifahren und Rodeln den Kopf.", "Шлем защищает голову на лыжах и санках.", "⛑️", true,
        "Stimmt! Kinder sollten immer mit Helm fahren.", "Верно! Дети всегда должны кататься в шлеме."),
      daumen("Abseits der Pisten im Wald fahren stört keine Tiere.", "Кататься вне трасс по лесу не мешает животным.", "🦌", false,
        "Doch! Tiere brauchen im Winter Ruhe und Kraft. Bleib auf den Pisten und Wegen.", "Мешает! Зимой животным нужны покой и силы. Оставайся на трассах и дорожках."),
      ende("Klasse, {name}! Erklär jemandem drei Regeln für die Piste.", "Класс, {name}! Объясни кому-нибудь три правила для трассы.")
    ] });

  // ==================== ETHIK (Lehrplan Grundschule Ethik 2004/2019) ====================
  // Religionen werden sachlich vorgestellt („Christen glauben …“), ohne zu werten. Sensible Themen mit Verweis auf Vertrauenspersonen und 116 111.
  const et = (t) => neu("ethik", t);
  et({ id: "et-einmalig", lb: "et1", kl: 2, lz: ["et.ge.01", "et.we.01"], name: "Ich bin einmalig", e: "🌟", farbe: "#E0A800", grund: "#FFF7D6",
    kurz: "Aussehen und Eigenschaften, Gefühle zeigen, was ich gut kann, anders sein ist in Ordnung", schritte: [
      info("Es gibt dich nur einmal", "🌟", "Kein Mensch ist genau wie du: dein Aussehen, dein Name, was du magst, was du gut kannst. Jeder Mensch hat Stärken – und Dinge, die noch schwer sind.",
        "Нет человека точно такого, как ты: твоя внешность, имя, что ты любишь, что умеешь. У каждого есть сильные стороны – и то, что пока трудно."),
      zuordnen("Außen oder innen?", "Снаружи или внутри?", [["aussen", "Kann man sehen", "Можно увидеть", "👀"], ["innen", "Ist innen drin", "Это внутри", "💛"]],
        [["Rote Haare", "Рыжие волосы", "aussen"], ["Groß sein", "Быть высоким", "aussen"], ["Mutig sein", "Быть смелым", "innen"], ["Hilfsbereit sein", "Быть готовым помочь", "innen"]]),
      wahl("Ein Kind in deiner Klasse sitzt im Rollstuhl. Was stimmt?", "Ребёнок в твоём классе сидит в инвалидной коляске. Что верно?", "♿",
        ["Es kann vieles – manches eben anders", "Он многое умеет – что-то просто по-другому", "Richtig! Jeder ist irgendwie anders – und das ist gut so.", "Правильно! Каждый чем-то отличается – и это хорошо."],
        ["Es kann gar nichts", "Он ничего не умеет", "Nein! Es kann bestimmt vieles, vielleicht sogar Dinge, die du nicht kannst.", "Нет! Он наверняка многое умеет, может, даже то, чего не умеешь ты."],
        ["Man spielt besser nicht mit ihm", "С ним лучше не играть", "Nein! Fragt einfach, wie ihr zusammen spielen könnt.", "Нет! Просто спросите, как вам вместе играть."]),
      daumen("Wenn ich etwas noch nicht gut kann, ist das schlimm.", "Если я что-то пока плохо умею – это ужасно.", "🌱", false,
        "Nein! Niemand kann alles. Mit Üben wird vieles leichter – und andere Dinge kannst du schon richtig gut.", "Нет! Никто не умеет всего. С тренировкой многое станет легче – а что-то ты уже умеешь отлично."),
      wahl("Wie kann man ein Gefühl ohne Worte zeigen?", "Как показать чувство без слов?", "😊",
        ["Mit Gesicht und Körper", "Лицом и телом", "Genau! Mimik und Körpersprache verraten viel.", "Точно! Мимика и язык тела многое выдают."],
        ["Gar nicht", "Никак", "Doch – mit Gesicht und Körper!", "Можно – лицом и телом!"],
        ["Nur mit einem Brief", "Только письмом", "Ein Brief hat ja Worte. Es geht auch ohne.", "В письме ведь слова. Можно и без них."]),
      ende("Toll, {name}! Sag einem Menschen heute, was er besonders gut kann.", "Здорово, {name}! Скажи сегодня кому-нибудь, что он особенно хорошо умеет.")
    ] });
  et({ id: "et-familie", lb: "et2", kl: 2, lz: ["et.mi.01", "su.so.01"], name: "Familien sind verschieden", e: "👨‍👩‍👧", farbe: "#C2337A", grund: "#FFEAF3",
    kurz: "verschiedene Familienformen, Geborgenheit, Aufgaben in der Familie, aufeinander verlassen", schritte: [
      info("Jede Familie ist anders", "👨‍👩‍👧", "Manche Kinder leben mit Mama und Papa, manche nur mit einem Elternteil, mit zwei Mamas oder zwei Papas, mit Großeltern, in einer Patchwork-Familie oder in einer Pflegefamilie.",
        "Одни дети живут с мамой и папой, другие – с одним родителем, с двумя мамами или двумя папами, с бабушкой и дедушкой, в «лоскутной» семье или в приёмной семье."),
      daumen("Eine richtige Familie muss genau aus Mama, Papa und zwei Kindern bestehen.", "Настоящая семья должна состоять ровно из мамы, папы и двух детей.", "🏠", false,
        "Nein! Familie ist da, wo man sich lieb hat und füreinander sorgt.", "Нет! Семья – там, где любят друг друга и заботятся друг о друге."),
      wahl("Was ist eine Patchwork-Familie?", "Что такое «лоскутная» семья?", "🧩",
        ["Eltern bringen Kinder aus früheren Familien mit", "Родители приводят детей из прежних семей", "Richtig! Dann gibt es oft Stiefgeschwister oder Halbgeschwister.", "Правильно! Тогда часто есть сводные братья и сёстры."],
        ["Eine Familie, die Decken näht", "Семья, которая шьёт одеяла", "Nein – „Patchwork“ heißt zusammengesetzt, wie eine Flickendecke.", "Нет – «пэчворк» значит составленный, как лоскутное одеяло."],
        ["Eine Familie ohne Kinder", "Семья без детей", "Nein, in Patchwork-Familien gibt es Kinder aus früheren Familien.", "Нет, в «лоскутных» семьях есть дети из прежних семей."]),
      zuordnen("Wer hilft in der Familie?", "Кто помогает в семье?", [["alle", "Das können alle machen", "Это могут делать все", "🤝"], ["gross", "Das machen Erwachsene", "Это делают взрослые", "🧑"]],
        [["Den Tisch decken", "Накрыть на стол", "alle"], ["Spielsachen aufräumen", "Убрать игрушки", "alle"], ["Mit dem Auto fahren", "Водить машину", "gross"]]),
      daumen("Sich aufeinander verlassen können ist in einer Familie wichtig.", "В семье важно, чтобы можно было положиться друг на друга.", "🫂", true,
        "Stimmt! Zuhause soll ein Ort sein, an dem man sich geborgen fühlt.", "Верно! Дом должен быть местом, где чувствуешь себя защищённым."),
      ende("Super, {name}! Mal ein Bild von deiner Familie – so wie sie ist.", "Супер, {name}! Нарисуй свою семью – такой, какая она есть.")
    ] });
  et({ id: "et-klasse", lb: "et2", kl: 2, lz: ["et.mi.01", "et.ge.02"], name: "Unsere Klasse: Regeln, Streit, Versöhnung", e: "🏫", farbe: "#2F6FD6", grund: "#EAF2FF",
    kurz: "Klassengemeinschaft, warum Regeln, streiten und sich versöhnen, um Hilfe bitten", schritte: [
      info("Zusammen in der Schule", "🏫", "In der Klasse lernt und spielt ihr zusammen. Das macht Freude – und manchmal ist es auch schwer. Regeln helfen, dass es allen gut geht.",
        "В классе вы вместе учитесь и играете. Это радует – а иногда бывает и трудно. Правила помогают, чтобы всем было хорошо."),
      wahl("Stell dir vor, es gäbe in der Schule gar keine Regeln. Was würde passieren?", "Представь, что в школе нет никаких правил. Что будет?", "🤔",
        ["Es gäbe viel Streit und Chaos", "Было бы много ссор и хаоса", "Richtig! Regeln schützen alle – besonders die Schwächeren.", "Правильно! Правила защищают всех – особенно слабых."],
        ["Alle wären immer froh", "Все были бы всегда рады", "Vielleicht kurz – aber bald gäbe es viel Streit.", "Может, ненадолго – но скоро было бы много ссор."],
        ["Nichts würde sich ändern", "Ничего бы не изменилось", "Doch – ohne Regeln wird es schnell ungerecht.", "Изменилось бы – без правил быстро становится несправедливо."]),
      zuordnen("Was hilft nach einem Streit?", "Что помогает после ссоры?", [["gut", "Hilft", "Помогает", "🕊️"], ["schlecht", "Macht es schlimmer", "Делает хуже", "💥"]],
        [["Sich in Ruhe zuhören", "Спокойно выслушать друг друга", "gut"], ["Sich entschuldigen", "Извиниться", "gut"], ["Hinter dem Rücken schlecht reden", "Плохо говорить за спиной", "schlecht"]]),
      daumen("Wenn mir in der Schule etwas schwerfällt, darf ich um Hilfe bitten.", "Если мне в школе что-то трудно, я могу попросить о помощи.", "🙋", true,
        "Stimmt! Lehrer, Eltern und Mitschüler helfen gern. Um Hilfe bitten ist mutig.", "Верно! Учителя, родители и одноклассники охотно помогают. Просить о помощи – смело."),
      daumen("Wenn ein Kind nicht mitspielen darf, ist das egal.", "Если ребёнку не дают играть – это неважно.", "😞", false,
        "Nein! Ausgeschlossen werden tut weh. Lad es zum Mitspielen ein.", "Нет! Когда тебя не принимают – это больно. Пригласи его поиграть."),
      ende("Klasse, {name}! Überleg dir eine Regel, die eure Klasse noch freundlicher macht.", "Класс, {name}! Придумай правило, которое сделает ваш класс ещё дружнее.")
    ] });
  et({ id: "et-herbstfeste", lb: "et3", kl: 2, lz: ["et.we.02"], name: "Feste im Herbst und Advent", e: "🏮", farbe: "#FF9636", grund: "#FFF1E3",
    kurz: "Geburtstag, Erntedank, St. Martin, Advent, Nikolaus", schritte: [
      info("Feste im Jahr", "🏮", "Feste geben dem Jahr einen Rhythmus. Manche feiert jeder für sich, wie den Geburtstag. Viele Feste kommen aus dem Christentum.",
        "Праздники задают году ритм. Некоторые каждый празднует сам, как день рождения. Многие праздники пришли из христианства.",
        [["Erntedank im Herbst: Danke für die Ernte", "Праздник урожая осенью: спасибо за урожай"], ["St. Martin am 11. November: teilen", "День святого Мартина 11 ноября: делиться"], ["Nikolaus am 6. Dezember", "День святого Николая 6 декабря"]]),
      wahl("Was hat der heilige Martin der Legende nach getan?", "Что, по легенде, сделал святой Мартин?", "🧥",
        ["Er teilte seinen Mantel mit einem frierenden Bettler", "Разделил плащ с замерзающим нищим", "Richtig! Darum geht es an St. Martin ums Teilen und Helfen – mit Laternenumzügen.", "Правильно! Поэтому в день Мартина речь о том, чтобы делиться и помогать, – с шествиями с фонариками."],
        ["Er baute ein Schloss", "Построил замок", "Nein, er teilte seinen Mantel.", "Нет, он разделил свой плащ."],
        ["Er erfand die Laterne", "Изобрёл фонарь", "Nein – die Laternen erinnern an ihn, aber er teilte seinen Mantel.", "Нет – фонари напоминают о нём, но он разделил плащ."]),
      wahl("Wie viele Kerzen hat ein Adventskranz?", "Сколько свечей на рождественском венке?", "🕯️",
        ["Vier – eine für jeden Adventssonntag", "Четыре – по одной на каждое воскресенье Адвента", "Genau! Der Advent ist eine Zeit der Vorfreude und Stille vor Weihnachten.", "Точно! Адвент – время ожидания и тишины перед Рождеством."],
        ["Zwei", "Две", "Es sind vier – für vier Sonntage.", "Их четыре – на четыре воскресенья."],
        ["Zehn", "Десять", "Nein, vier Kerzen.", "Нет, четыре свечи."]),
      daumen("Der Nikolaus erinnert an einen Bischof aus Myra, der armen Menschen geholfen hat.", "Николай напоминает о епископе из Миры, который помогал бедным.", "🎅", true,
        "Stimmt! Darum stellen Kinder in der Nacht zum 6. Dezember ihre Stiefel raus.", "Верно! Поэтому в ночь на 6 декабря дети выставляют сапожки."),
      daumen("Zum Erntedankfest sagen Menschen Danke für das Essen auf dem Feld und im Garten.", "На праздник урожая люди благодарят за еду с полей и огородов.", "🌾", true,
        "Stimmt! Auch in anderen Kulturen gibt es Erntefeste.", "Верно! В других культурах тоже есть праздники урожая."),
      ende("Super, {name}! Erzähl jemandem, welches Fest du am liebsten magst – und warum.", "Супер, {name}! Расскажи кому-нибудь, какой праздник ты любишь больше всего – и почему.")
    ] });
  et({ id: "et-winterfeste", lb: "et3", kl: 2, lz: ["et.we.02"], name: "Weihnachten, Silvester, Fasching, Ostern", e: "🐣", farbe: "#3BAA5C", grund: "#E8F7EC",
    kurz: "Weihnachten, Wünsche und Schenken, Silvester, Fasching, Ostern und Frühling", schritte: [
      info("Feste von Winter bis Frühling", "🐣", "Christen feiern an Weihnachten die Geburt von Jesus. An Silvester verabschiedet man das alte Jahr. Ostern ist das Fest der Auferstehung von Jesus – und ein Frühlingsfest.",
        "Христиане празднуют на Рождество рождение Иисуса. В новогоднюю ночь провожают старый год. Пасха – праздник воскресения Иисуса и весенний праздник."),
      zuordnen("Welches Fest?", "Какой праздник?", [["weihnachten", "Weihnachten", "Рождество", "🎄"], ["silvester", "Silvester", "Новогодняя ночь", "🎆"], ["ostern", "Ostern", "Пасха", "🐣"]],
        [["Krippe mit Jesuskind", "Ясли с младенцем Иисусом", "weihnachten"], ["Feuerwerk um Mitternacht", "Фейерверк в полночь", "silvester"], ["Bunte Eier suchen", "Искать цветные яйца", "ostern"]]),
      wahl("Was macht Weihnachten zu Weihnachten – auch ohne viele Geschenke?", "Что делает Рождество Рождеством – даже без многих подарков?", "🎁",
        ["Zeit mit Menschen, die man lieb hat", "Время с теми, кого любишь", "Richtig! Geschenke, die nichts kosten, wie Zeit oder Hilfe, freuen oft am meisten.", "Правильно! Подарки, которые ничего не стоят, как время или помощь, часто радуют больше всего."],
        ["Nur der teuerste Wunsch", "Только самое дорогое желание", "Teuer heißt nicht unbedingt schön.", "Дорого – не значит обязательно хорошо."],
        ["Gar nichts", "Ничего", "Doch – Zusammensein, Licht, Lieder, Wärme.", "Есть что – быть вместе, свет, песни, тепло."]),
      daumen("Zu Fasching verkleiden sich viele Menschen – früher sollte das den Winter austreiben.", "На карнавал многие переодеваются – раньше так «прогоняли» зиму.", "🎭", true,
        "Stimmt! Danach beginnt bei Christen die Fastenzeit bis Ostern.", "Верно! После этого у христиан начинается пост до Пасхи."),
      daumen("An Silvester nimmt man sich manchmal etwas für das neue Jahr vor.", "В новогоднюю ночь иногда что-то себе обещают на новый год.", "📝", true,
        "Stimmt! Und man wünscht anderen Glück – mit Glücksschwein oder Kleeblatt.", "Верно! И желают другим счастья – со свинкой или клевером."),
      ende("Toll, {name}! Überleg dir ein Geschenk, das nichts kostet – und verschenk es.", "Здорово, {name}! Придумай подарок, который ничего не стоит, – и подари его.")
    ] });
  et({ id: "et-natur", lb: "et4", kl: 2, lz: ["et.we.03", "su.na.01"], name: "Staunen über die Natur", e: "🌻", farbe: "#1F8F8A", grund: "#E6F7F5",
    kurz: "Wunderbares entdecken, Sonne, Mond und Sterne, werden, wachsen, vergehen, Natur schützen", schritte: [
      info("Die Welt zum Staunen", "🌻", "Schau genau hin: ein Wassertropfen, ein Eiskristall, eine Blüte, ein Käfer – die Natur steckt voller Wunder. Pflanzen und Tiere werden geboren, wachsen und vergehen.",
        "Присмотрись: капля воды, снежинка, цветок, жук – природа полна чудес. Растения и животные рождаются, растут и уходят."),
      wahl("Was braucht eine Pflanze zum Wachsen?", "Что нужно растению, чтобы расти?", "🌱",
        ["Licht, Wasser und Erde", "Свет, вода и земля", "Richtig! Und ein bisschen Geduld.", "Правильно! И немного терпения."],
        ["Nur Dunkelheit", "Только темнота", "Ohne Licht wächst eine Pflanze nicht gut.", "Без света растение плохо растёт."],
        ["Süßigkeiten", "Сладости", "Pflanzen brauchen keine Süßigkeiten.", "Растениям не нужны сладости."]),
      daumen("Sonne, Mond und Sterne sind für Menschen schon immer wichtig – sie geben Licht, Wärme und zeigen die Zeit.", "Солнце, луна и звёзды всегда были важны людям – они дают свет, тепло и показывают время.", "🌙", true,
        "Stimmt! Viele Märchen und Geschichten erzählen von ihnen.", "Верно! О них рассказывают многие сказки и истории."),
      zuordnen("Gut für die Natur?", "Хорошо для природы?", [["gut", "Gut für die Natur", "Хорошо для природы", "💚"], ["schlecht", "Schadet der Natur", "Вредит природе", "🗑️"]],
        [["Müll in den Mülleimer werfen", "Выбрасывать мусор в урну", "gut"], ["Ein Insektenhotel bauen", "Построить домик для насекомых", "gut"], ["Blumen im Park ausreißen", "Рвать цветы в парке", "schlecht"]]),
      ende("Super, {name}! Schau dir draußen etwas ganz genau an – vielleicht mit einer Lupe. Worüber staunst du?", "Супер, {name}! Рассмотри на улице что-нибудь очень внимательно – может, через лупу. Чему ты удивляешься?")
    ] });

  et({ id: "et-staerken", lb: "et1", stufe: 3, lz: ["et.ge.02", "et.we.01"], name: "Stärken, Schwächen, Mut", e: "💪", farbe: "#E0574A", grund: "#FFECE8",
    kurz: "eigene Stärken und Schwächen, mit Angst umgehen, Mädchen und Jungen, gut und böse, Nein sagen", schritte: [
      info("Was macht mich aus?", "💪", "Jeder hat Stärken wie Ausdauer oder Fröhlichkeit – und Schwächen wie Vergesslichkeit. Wichtig ist: Man kann sich verändern, wenn man will.",
        "У каждого есть сильные стороны, как выносливость или жизнерадостность, – и слабые, как забывчивость. Важно: можно измениться, если хочешь."),
      wahl("Du hast Angst vor einem Vortrag. Was kann helfen?", "Ты боишься выступления. Что может помочь?", "😰",
        ["Gut üben und mit jemandem darüber reden", "Хорошо подготовиться и поговорить с кем-то", "Richtig! Angst wird kleiner, wenn man sie teilt und sich vorbereitet.", "Правильно! Страх уменьшается, если им поделиться и подготовиться."],
        ["Sich krank stellen", "Притвориться больным", "Das verschiebt die Angst nur.", "Это только откладывает страх."],
        ["Gar nichts sagen und hoffen", "Ничего не говорить и надеяться", "Lieber üben und darüber sprechen.", "Лучше потренироваться и поговорить."]),
      daumen("Fußball ist nur etwas für Jungen und Tanzen nur etwas für Mädchen.", "Футбол – только для мальчиков, а танцы – только для девочек.", "⚽", false,
        "Nein! Alle Kinder dürfen mögen und machen, was ihnen Freude bereitet.", "Нет! Все дети могут любить и делать то, что им нравится."),
      daumen("Kinder und Erwachsene sind in vielem verschieden – aber beide haben Gefühle, Wünsche und Rechte.", "Дети и взрослые во многом разные – но у обоих есть чувства, желания и права.", "🧒", true,
        "Stimmt! Kinder dürfen spielen und lernen, Erwachsene tragen mehr Verantwortung. Was wäre schöner – Kind oder Erwachsener sein?", "Верно! Дети могут играть и учиться, взрослые несут больше ответственности. Что лучше – быть ребёнком или взрослым?"),
      daumen("Niemand ist nur gut oder nur böse – jeder macht mal Fehler und kann sich entschuldigen.", "Никто не бывает только хорошим или только плохим – каждый ошибается и может извиниться.", "⚖️", true,
        "Stimmt! Verzeihen und sich versöhnen gehört dazu.", "Верно! Прощать и мириться – тоже часть этого."),
      wahl("Ältere Kinder wollen, dass du heimlich etwas Verbotenes probierst. Was tust du?", "Старшие дети хотят, чтобы ты тайком попробовал что-то запрещённое. Что ты сделаешь?", "✋",
        ["Laut Nein sagen und gehen", "Громко сказать «нет» и уйти", "Richtig! Nein sagen ist stark. Erzähl es einem Erwachsenen, dem du vertraust.", "Правильно! Сказать «нет» – это сила. Расскажи взрослому, которому доверяешь."],
        ["Mitmachen, damit sie dich mögen", "Сделать, чтобы тебя любили", "Echte Freunde drängen dich zu nichts.", "Настоящие друзья ни к чему не принуждают."],
        ["Es heimlich ausprobieren", "Тайком попробовать", "Nein! Sag Nein und hol dir Hilfe.", "Нет! Скажи «нет» и попроси помощи."]),
      ende("Super, {name}! Schreib drei Dinge auf, die du gut kannst – und eins, das du üben willst.", "Супер, {name}! Запиши три вещи, которые ты хорошо умеешь, и одну, которую хочешь потренировать.")
    ] });
  et({ id: "et-freundschaft", lb: "et2", stufe: 3, lz: ["et.mi.01", "me.kk.01"], name: "Freundschaft", e: "🤝", farbe: "#C2337A", grund: "#FFEAF3",
    kurz: "Freunde finden, Streitregeln, Mobbing, Goldene Regel, gute und schlechte Geheimnisse", schritte: [
      info("Was ist ein Freund?", "🤝", "Freunde vertrauen sich, helfen sich und haben Spaß zusammen. Auch Freunde streiten mal – wichtig ist, wie man sich wieder verträgt.",
        "Друзья доверяют друг другу, помогают и весело проводят время. Друзья тоже иногда ссорятся – важно, как потом помириться."),
      wahl("Wie heißt die Goldene Regel?", "Как звучит золотое правило?", "✨",
        ["Behandle andere so, wie du selbst behandelt werden möchtest", "Поступай с другими так, как хочешь, чтобы поступали с тобой", "Richtig! Diese Regel kennen viele Religionen und Kulturen.", "Правильно! Это правило знают многие религии и культуры."],
        ["Wer zuerst kommt, bekommt alles", "Кто первый пришёл, всё получил", "Nein, die Goldene Regel ist anders.", "Нет, золотое правило другое."],
        ["Immer gewinnen", "Всегда побеждать", "Nein – es geht darum, andere gut zu behandeln.", "Нет – речь о том, чтобы хорошо обращаться с другими."]),
      daumen("Wenn mehrere Kinder einem Kind immer wieder wehtun oder es auslachen – auch im Internet –, nennt man das Mobbing.", "Если несколько детей снова и снова обижают ребёнка или высмеивают – и в интернете тоже, – это называют травлей (моббинг).", "🛑", true,
        "Stimmt! Mobbing ist nie in Ordnung. Wer es sieht, holt Hilfe bei Erwachsenen.", "Верно! Травля никогда не нормальна. Кто видит, зовёт взрослых на помощь."),
      wahl("Jemand sagt: „Das ist unser Geheimnis, du darfst es niemandem sagen“ – und du fühlst dich dabei schlecht. Was tust du?", "Кто-то говорит: «Это наш секрет, никому не говори» – а тебе от этого плохо. Что ты делаешь?", "🤫",
        ["Einem Erwachsenen erzählen, dem du vertraust", "Рассказать взрослому, которому доверяешь", "Richtig! Schlechte Geheimnisse darf und soll man erzählen. Du kannst auch die Nummer gegen Kummer anrufen: 116 111 – kostenlos.", "Правильно! Плохие секреты можно и нужно рассказать. Можно позвонить на «телефон доверия»: 116 111 – бесплатно."],
        ["Für immer schweigen", "Молчать всегда", "Nein! Ein Geheimnis, bei dem du dich schlecht fühlst, ist ein schlechtes Geheimnis. Erzähl es.", "Нет! Секрет, от которого тебе плохо, – плохой секрет. Расскажи."],
        ["Selbst damit fertig werden", "Справиться самому", "Damit musst du nicht allein sein. Hol dir Hilfe.", "С этим не нужно быть одному. Попроси помощи."]),
      zuordnen("Gutes oder schlechtes Geheimnis?", "Хороший или плохой секрет?", [["gut", "Gutes Geheimnis – macht Freude", "Хороший секрет – радует", "🎁"], ["schlecht", "Schlechtes Geheimnis – erzählen!", "Плохой секрет – рассказать!", "⚠️"]],
        [["Ein Überraschungsgeschenk für Mama", "Сюрприз-подарок для мамы", "gut"], ["Eine Geburtstagsparty, die noch geheim ist", "Праздник, который пока тайна", "gut"], ["Jemand tut dir weh und sagt, du darfst nichts verraten", "Кто-то делает тебе больно и говорит молчать", "schlecht"]]),
      ende("Toll, {name}! Mein Körper gehört mir – und schlechte Geheimnisse darf ich immer erzählen. Was macht für dich einen guten Freund aus?", "Здорово, {name}! Моё тело принадлежит мне – и плохие секреты всегда можно рассказать. Каким должен быть хороший друг?")
    ] });
  et({ id: "et-wahrheit", lb: "et2", stufe: 3, lz: ["et.mi.02"], name: "Wahrheit und Lüge", e: "🤥", farbe: "#7B55B8", grund: "#F1EAFF",
    kurz: "ehrlich sein, Notlüge und Halbwahrheit, Wahrheit und Vertrauen, Wahrheit ohne zu kränken", schritte: [
      info("Ehrlich sein", "🤥", "Wer ehrlich ist, dem kann man vertrauen. Lügen machen Vertrauen kaputt. Manchmal ist es schwer: Wie sagt man die Wahrheit, ohne jemanden zu kränken?",
        "Тому, кто честен, можно доверять. Ложь разрушает доверие. Иногда трудно: как сказать правду и не обидеть?"),
      wahl("Du hast aus Versehen die Vase umgestoßen. Was ist ehrlich?", "Ты случайно опрокинул вазу. Что будет честно?", "🏺",
        ["Sagen, dass du es warst, und helfen aufzuräumen", "Сказать, что это ты, и помочь убрать", "Richtig! Ein Fehler ist nicht schlimm – ehrlich dazu zu stehen ist stark.", "Правильно! Ошибка – не страшно; честно признаться – это сила."],
        ["Sagen, es war die Katze", "Сказать, что это кошка", "Das wäre gelogen – und die Katze kann sich nicht wehren.", "Это было бы враньё – а кошка не может защититься."],
        ["Die Scherben verstecken", "Спрятать осколки", "Das kommt raus – und dann ist das Vertrauen weg.", "Это раскроется – и доверие пропадёт."]),
      daumen("Eine Halbwahrheit ist, wenn man nur einen Teil der Wahrheit sagt und etwas Wichtiges weglässt.", "Полуправда – когда говоришь только часть правды и упускаешь важное.", "½", true,
        "Stimmt! Auch damit kann man andere täuschen.", "Верно! Этим тоже можно обмануть других."),
      wahl("Dein Freund zeigt dir ein Bild, das dir nicht gefällt. Wie bleibst du ehrlich und freundlich?", "Друг показывает рисунок, который тебе не нравится. Как остаться честным и дружелюбным?", "🖼️",
        ["Sagen, was dir daran gefällt, und freundlich einen Tipp geben", "Сказать, что нравится, и дружелюбно дать совет", "Genau! Ehrlich heißt nicht gemein.", "Точно! Честно – не значит грубо."],
        ["„Das ist hässlich!“ rufen", "Крикнуть «Некрасиво!»", "Das kränkt. Ehrlich geht auch freundlich.", "Это обидно. Честно можно и по-доброму."],
        ["Sagen, es ist das schönste Bild der Welt", "Сказать, что это лучший рисунок в мире", "Das stimmt ja nicht – du kannst ehrlich und lieb sein.", "Это неправда – можно быть честным и добрым."]),
      ende("Super, {name}! Denk darüber nach: Muss man immer die ganze Wahrheit sagen? Sprich mit jemandem darüber.", "Супер, {name}! Подумай: всегда ли нужно говорить всю правду? Поговори об этом с кем-нибудь.")
    ] });
  et({ id: "et-kirchenjahr", lb: "et3", stufe: 3, lz: ["et.we.02"], name: "Ethik, Religion und das Kirchenjahr", e: "⛪", farbe: "#8E5BC8", grund: "#F3ECFF",
    kurz: "Was ist Ethik, was ist Religion, Kirche, Bibel, Weihnachten, Ostern, Pfingsten, Reformationstag", schritte: [
      info("Ethik und Religion", "⛪", "In Ethik denkt man darüber nach, wie wir gut miteinander leben. Religion bedeutet, an Gott oder Götter zu glauben. Viele Feste, Gebäude und Kunstwerke bei uns kommen aus dem Christentum.",
        "На этике размышляют о том, как хорошо жить вместе. Религия – это вера в Бога или богов. Многие наши праздники, здания и произведения искусства пришли из христианства."),
      zuordnen("Woran denkst du?", "О чём это?", [["kirche", "Kirche", "Церковь", "⛪"], ["bibel", "Bibel", "Библия", "📖"]],
        [["Turm mit Glocken", "Башня с колоколами", "kirche"], ["Orgel und Altar", "Орган и алтарь", "kirche"], ["Altes und Neues Testament", "Ветхий и Новый Завет", "bibel"]]),
      wahl("Was feiern Christen an Ostern?", "Что празднуют христиане на Пасху?", "✝️",
        ["Dass Jesus von den Toten auferstanden ist", "Что Иисус воскрес из мёртвых", "Richtig! Ostern ist das wichtigste Fest der Christen.", "Правильно! Пасха – главный праздник христиан."],
        ["Die Geburt von Jesus", "Рождение Иисуса", "Die Geburt feiern Christen an Weihnachten.", "Рождение христиане празднуют на Рождество."],
        ["Den Jahresanfang", "Начало года", "Den Jahresanfang feiert man an Neujahr.", "Начало года празднуют в Новый год."]),
      wahl("Am 31. Oktober ist in Sachsen ein Feiertag. Welcher?", "31 октября в Саксонии праздник. Какой?", "📜",
        ["Reformationstag", "День Реформации", "Genau! Er erinnert an Martin Luther, der 1517 die Kirche erneuern wollte.", "Точно! Он напоминает о Мартине Лютере, который в 1517 году хотел обновить церковь."],
        ["Tag der Arbeit", "День труда", "Der Tag der Arbeit ist am 1. Mai.", "День труда – 1 мая."],
        ["Nikolaustag", "День святого Николая", "Nikolaus ist am 6. Dezember.", "День Николая – 6 декабря."]),
      daumen("Pfingsten nennen Christen auch den „Geburtstag der Kirche“.", "Пятидесятницу христиане называют ещё «днём рождения церкви».", "🕊️", true,
        "Stimmt! Pfingsten ist 50 Tage nach Ostern.", "Верно! Пятидесятница – через 50 дней после Пасхи."),
      daumen("Bei den katholischen Sorben in der Lausitz sind auch Fronleichnam und Mariä Himmelfahrt besondere Feiertage.", "У католиков-сорбов в Лужице особые праздники – ещё и праздник Тела Христова и Успение Богородицы.", "🏵️", true,
        "Stimmt! Bekannt ist auch das sorbische Osterreiten. Katholische und evangelische Christen feiern manche Feste verschieden.", "Верно! Известна и сорбская пасхальная процессия всадников. Католики и протестанты празднуют некоторые праздники по-разному."),
      ende("Super, {name}! Wenn ihr an einer Kirche vorbeikommt: Schaut euch Turm, Fenster und Tür genau an.", "Супер, {name}! Когда будете проходить мимо церкви, рассмотрите башню, окна и дверь.")
    ] });
  et({ id: "et-symbole", lb: "et4", stufe: 3, lz: ["et.we.03"], name: "Symbole, Elemente und unsere Welt", e: "🌈", farbe: "#1F8F8A", grund: "#E6F7F5",
    kurz: "Zeichen und Symbole, Feuer, Wasser, Erde, Luft, Natur, Menschenwelt und Gedankenwelt, die Welt bewahren", schritte: [
      info("Zeichen und Symbole", "🌈", "Ein Zeichen sagt genau, was gemeint ist – wie ein Verkehrsschild. Ein Symbol hat eine tiefere Bedeutung: Ein Herz steht für Liebe, eine Taube für Frieden, ein Regenbogen für Hoffnung.",
        "Знак точно говорит, что имеется в виду, – как дорожный знак. У символа более глубокий смысл: сердце – любовь, голубь – мир, радуга – надежда."),
      zuordnen("Wofür steht das Symbol?", "Что означает символ?", [["liebe", "Liebe", "Любовь", "❤️"], ["frieden", "Frieden", "Мир", "🕊️"]],
        [["Ein rotes Herz", "Красное сердце", "liebe"], ["Eine weiße Taube", "Белый голубь", "frieden"]]),
      wahl("Schon vor über 2000 Jahren dachten Menschen, alles bestehe aus vier Elementen. Welche?", "Больше 2000 лет назад люди думали, что всё состоит из четырёх стихий. Каких?", "🔥",
        ["Feuer, Wasser, Erde, Luft", "Огонь, вода, земля, воздух", "Richtig! Jedes Element kann helfen und schaden: Feuer wärmt und zerstört, Wasser schenkt Leben und kann überschwemmen.", "Правильно! Каждая стихия может помогать и вредить: огонь греет и разрушает, вода дарит жизнь и может затопить."],
        ["Holz, Stein, Glas, Metall", "Дерево, камень, стекло, металл", "Das sind Werkstoffe, nicht die vier Elemente.", "Это материалы, а не четыре стихии."],
        ["Sonne, Mond, Sterne, Wolken", "Солнце, луна, звёзды, облака", "Nein, die vier Elemente sind Feuer, Wasser, Erde, Luft.", "Нет, четыре стихии – огонь, вода, земля, воздух."]),
      zuordnen("Welche Welt ist das?", "Какой это мир?", [["natur", "Natürliche Welt", "Мир природы", "🌳"], ["mensch", "Vom Menschen gemacht", "Создано человеком", "🏙️"], ["gedanke", "Gedankenwelt", "Мир мыслей", "💭"]],
        [["Ein Berg", "Гора", "natur"], ["Ein Hochhaus", "Высотный дом", "mensch"], ["Ein Traum", "Сон", "gedanke"]]),
      daumen("Jeder kann etwas tun, um die Welt zu bewahren – auch Kinder.", "Каждый может что-то сделать, чтобы сберечь мир, – и дети тоже.", "🌍", true,
        "Stimmt! Wasser sparen, Müll vermeiden, Tiere schützen – kleine Schritte zählen.", "Верно! Экономить воду, меньше мусорить, защищать животных – маленькие шаги важны."),
      ende("Toll, {name}! Stell dir vor, du könntest die Welt verändern: Wo würdest du anfangen?", "Здорово, {name}! Представь, что можешь изменить мир: с чего ты начнёшь?")
    ] });

  et({ id: "et-wuensche", lb: "et1", stufe: 4, lz: ["et.we.04", "et.ge.02"], name: "Wünsche, Träume, Entscheidungen", e: "🌠", farbe: "#E0A800", grund: "#FFF7D6",
    kurz: "materielle und andere Wünsche, Träume, Entscheidungen treffen, Gewissen, Vorbilder", schritte: [
      info("Was wünsche ich mir?", "🌠", "Manche Wünsche kann man kaufen, wie ein Fahrrad. Andere nicht, wie Freundschaft oder Gesundheit. Und oft muss man sich entscheiden – mit Folgen für sich und andere.",
        "Некоторые желания можно купить, как велосипед. Другие – нет, как дружбу или здоровье. И часто нужно выбирать – с последствиями для себя и других."),
      zuordnen("Kann man es kaufen?", "Можно ли это купить?", [["ja", "Kann man kaufen", "Можно купить", "🛒"], ["nein", "Kann man nicht kaufen", "Нельзя купить", "💛"]],
        [["Ein neues Spiel", "Новая игра", "ja"], ["Ein Fahrrad", "Велосипед", "ja"], ["Eine beste Freundin", "Лучшая подруга", "nein"], ["Gesund sein", "Быть здоровым", "nein"]]),
      wahl("Du findest auf dem Schulhof ein Portemonnaie. Eine innere Stimme sagt: „Gib es ab.“ Wie nennt man diese Stimme?", "Ты находишь на школьном дворе кошелёк. Внутренний голос говорит: «Отдай его». Как называется этот голос?", "👛",
        ["Gewissen", "Совесть", "Richtig! Das Gewissen hilft, gute Entscheidungen zu treffen.", "Правильно! Совесть помогает принимать хорошие решения."],
        ["Echo", "Эхо", "Ein Echo kommt von außen zurück.", "Эхо возвращается снаружи."],
        ["Werbung", "Реклама", "Werbung will, dass du etwas kaufst.", "Реклама хочет, чтобы ты что-то купил."]),
      daumen("Bei großen Entscheidungen, wie der Wahl der neuen Schule, darf ich mir Hilfe holen.", "При больших решениях, как выбор новой школы, можно попросить помощи.", "🏫", true,
        "Stimmt! Sprich mit Eltern und Lehrern – aber sag auch, was du selbst willst.", "Верно! Поговори с родителями и учителями – но скажи и то, чего хочешь ты сам."),
      daumen("Ein Vorbild muss berühmt sein.", "Образец для подражания должен быть знаменитым.", "⭐", false,
        "Nein! Ein Vorbild kann auch die Oma, ein Trainer oder eine Freundin sein – jemand, von dem du etwas lernen möchtest.", "Нет! Образцом может быть бабушка, тренер или подруга – тот, у кого ты хочешь чему-то научиться."),
      ende("Super, {name}! Stell dir vor, du schaust 20 Jahre in die Zukunft. Wie sieht dein Leben aus?", "Супер, {name}! Представь, что заглядываешь на 20 лет вперёд. Какая у тебя жизнь?")
    ] });
  et({ id: "et-miteinander4", lb: "et2", stufe: 4, lz: ["et.mi.02", "et.mi.01"], name: "Jung und Alt, Zivilcourage", e: "👵", farbe: "#C2337A", grund: "#FFEAF3",
    kurz: "Generationen, Umgangsformen, Goldene Regel in Religionen und Philosophie, Zivilcourage sicher zeigen", schritte: [
      info("Alle Generationen", "👵", "Kinder, Eltern, Großeltern – jede Generation kann etwas, was die anderen brauchen. Die Großen haben Erfahrung, die Kleinen bringen neue Ideen.",
        "Дети, родители, бабушки и дедушки – каждое поколение умеет то, что нужно другим. У старших опыт, младшие приносят новые идеи."),
      daumen("Die Goldene Regel gibt es in der Bibel, im Koran, in der Thora und auch beim chinesischen Denker Konfuzius.", "Золотое правило есть в Библии, в Коране, в Торе и у китайского мыслителя Конфуция.", "✨", true,
        "Stimmt! Viele Menschen auf der Welt teilen diese Idee.", "Верно! Многие люди в мире разделяют эту мысль."),
      wahl("Auf dem Heimweg siehst du, wie ein Kind von größeren Kindern geschubst wird. Was ist Zivilcourage?", "По дороге домой ты видишь, как старшие толкают ребёнка. Что такое гражданское мужество?", "🦸",
        ["Laut Hilfe holen und Erwachsene ansprechen", "Громко позвать помощь и обратиться ко взрослым", "Richtig! Hinschauen und Hilfe holen – ohne dich selbst in Gefahr zu bringen. Im Notfall: 110.", "Правильно! Не отворачиваться и звать помощь – не подвергая себя опасности. В экстренном случае: 110."],
        ["Schnell wegschauen", "Быстро отвернуться", "Wegschauen hilft dem Kind nicht.", "Если отвернуться, ребёнку это не поможет."],
        ["Selbst mitschubsen", "Тоже толкнуть", "Nein! Das macht alles schlimmer.", "Нет! Это сделает всё хуже."]),
      wahl("Brauchen Kinder die Erwachsenen – und Erwachsene die Kinder?", "Нужны ли детям взрослые – а взрослым дети?", "🤝",
        ["Ja, beide brauchen sich", "Да, они нужны друг другу", "Genau! Man kann viel voneinander lernen.", "Точно! Можно многому научиться друг у друга."],
        ["Nur Kinder brauchen Erwachsene", "Только детям нужны взрослые", "Auch Erwachsene lernen von Kindern – zum Beispiel am Tablet.", "Взрослые тоже учатся у детей – например, на планшете."],
        ["Niemand braucht jemanden", "Никто никому не нужен", "Doch – Menschen brauchen einander.", "Нужен – люди нужны друг другу."]),
      ende("Toll, {name}! Frag einen älteren Menschen: Was war früher wichtig, als du so alt warst wie ich?", "Здорово, {name}! Спроси пожилого человека: что было важно раньше, когда ты был в моём возрасте?")
    ] });
  et({ id: "et-religionen", lb: "et3", stufe: 4, lz: ["et.we.02"], name: "Judentum, Christentum, Islam", e: "🕍", farbe: "#2F6FD6", grund: "#EAF2FF",
    kurz: "Gotteshäuser, heilige Bücher, Symbole, Feste und Ruhetage, Gemeinsames, Helfen und Toleranz", schritte: [
      info("Drei Religionen, ein Gott", "🕍", "Juden, Christen und Muslime glauben an einen Gott. Alle drei erzählen von Abraham, und für alle ist die Stadt Jerusalem heilig.",
        "Иудеи, христиане и мусульмане верят в одного Бога. Все три рассказывают об Аврааме, и для всех свят город Иерусалим.",
        [["Judentum: Thora, Synagoge, Davidstern, Ruhetag Sabbat", "Иудаизм: Тора, синагога, звезда Давида, день покоя – шаббат"], ["Christentum: Bibel, Kirche, Kreuz, Ruhetag Sonntag", "Христианство: Библия, церковь, крест, день покоя – воскресенье"], ["Islam: Koran, Moschee, Halbmond, Freitagsgebet", "Ислам: Коран, мечеть, полумесяц, пятничная молитва"]]),
      zuordnen("Zu welcher Religion gehört es?", "К какой религии это относится?", [["juden", "Judentum", "Иудаизм", "✡️"], ["christen", "Christentum", "Христианство", "✝️"], ["islam", "Islam", "Ислам", "☪️"]],
        [["Synagoge", "Синагога", "juden"], ["Thora", "Тора", "juden"], ["Kirche", "Церковь", "christen"], ["Moschee", "Мечеть", "islam"]]),
      wahl("Wie heißt der Fastenmonat der Muslime?", "Как называется месяц поста у мусульман?", "🌙",
        ["Ramadan", "Рамадан", "Richtig! Am Ende feiern viele Muslime das Zuckerfest.", "Правильно! В конце многие мусульмане празднуют Ураза-байрам."],
        ["Advent", "Адвент", "Der Advent ist die Zeit vor Weihnachten bei Christen.", "Адвент – время перед Рождеством у христиан."],
        ["Sabbat", "Шаббат", "Der Sabbat ist der Ruhetag im Judentum.", "Шаббат – день покоя в иудаизме."]),
      daumen("Menschen, die an etwas anderes glauben als ich, verdienen genauso Respekt.", "Люди, которые верят во что-то другое, заслуживают такого же уважения.", "🤝", true,
        "Stimmt! Das nennt man Toleranz. Vielfalt kann uns bereichern.", "Верно! Это называется терпимость. Разнообразие может нас обогащать."),
      daumen("Viele gläubige Menschen und Hilfsorganisationen helfen Armen, Kranken und Menschen auf der Flucht.", "Многие верующие люди и благотворительные организации помогают бедным, больным и беженцам.", "🤲", true,
        "Stimmt! Auch du kannst helfen – zum Beispiel mit fair gehandelten Produkten oder bei einer Sammelaktion.", "Верно! Ты тоже можешь помочь – например, покупая товары честной торговли или участвуя в сборе вещей."),
      wahl("Franz von Assisi lebte vor etwa 800 Jahren. Wofür ist er bekannt?", "Франциск Ассизский жил около 800 лет назад. Чем он известен?", "🐦",
        ["Er verschenkte seinen Reichtum, half Armen und liebte Tiere und Natur", "Раздал богатство, помогал бедным и любил животных и природу", "Richtig! Bis heute ist er für viele ein Vorbild für ein Leben für andere.", "Правильно! До сих пор он для многих пример жизни ради других."],
        ["Er erfand das Fahrrad", "Изобрёл велосипед", "Nein – vor 800 Jahren gab es noch keine Fahrräder.", "Нет – 800 лет назад велосипедов ещё не было."],
        ["Er war ein berühmter Fußballspieler", "Был знаменитым футболистом", "Nein, er half armen Menschen.", "Нет, он помогал бедным."]),
      ende("Super, {name}! Frag in deiner Klasse oder Familie, welche Feste andere feiern.", "Супер, {name}! Спроси в классе или в семье, какие праздники отмечают другие.")
    ] });
  et({ id: "et-gerechtigkeit", lb: "et4", stufe: 4, lz: ["et.we.01", "su.so.06"], name: "Gerechtigkeit und Kinderrechte", e: "⚖️", farbe: "#7B55B8", grund: "#F1EAFF",
    kurz: "gerecht und ungerecht, Justitia, Regeln, Gebote und Rechte, Kinderrechte der Vereinten Nationen", schritte: [
      info("Was ist gerecht?", "⚖️", "Gerecht ist nicht immer, dass alle genau gleich viel bekommen. Manchmal braucht einer mehr Hilfe als ein anderer. Die Figur Justitia mit Waage und Augenbinde steht für Gerechtigkeit.",
        "Справедливо – не всегда, когда все получают поровну. Иногда кому-то нужно больше помощи, чем другому. Фигура Юстиции с весами и повязкой на глазах означает справедливость."),
      wahl("Warum trägt Justitia eine Augenbinde?", "Почему у Юстиции повязка на глазах?", "⚖️",
        ["Sie urteilt, ohne darauf zu schauen, wer jemand ist", "Она судит, не глядя, кто перед ней", "Richtig! Alle sollen gleich behandelt werden – reich oder arm, groß oder klein.", "Правильно! Со всеми должны обращаться одинаково – богатыми и бедными, большими и маленькими."],
        ["Sie hat Angst vor der Sonne", "Она боится солнца", "Nein, die Binde ist ein Symbol.", "Нет, повязка – символ."],
        ["Sie spielt Blindekuh", "Она играет в жмурки", "Nein – sie zeigt, dass man gerecht urteilt.", "Нет – она показывает, что судят справедливо."]),
      zuordnen("Recht oder Regel?", "Право или правило?", [["recht", "Recht", "Право", "📜"], ["regel", "Regel", "Правило", "📋"]],
        [["Jedes Kind darf zur Schule gehen", "Каждый ребёнок может ходить в школу", "recht"], ["Jedes Kind hat einen Namen", "У каждого ребёнка есть имя", "recht"], ["In der Pause bleiben alle auf dem Schulhof", "На перемене все остаются во дворе", "regel"]]),
      daumen("Die Kinderrechte gelten für alle Kinder auf der Welt.", "Права ребёнка действуют для всех детей мира.", "🌍", true,
        "Stimmt! Leider werden sie nicht überall eingehalten. Dazu gehört auch: Kein Kind darf geschlagen werden.", "Верно! К сожалению, их соблюдают не везде. К ним относится и это: ни одного ребёнка нельзя бить."),
      ende("Klasse, {name}! Welches Kinderrecht ist dir am wichtigsten? Erzähl jemandem davon.", "Класс, {name}! Какое право ребёнка для тебя самое важное? Расскажи кому-нибудь.")
    ] });
  et({ id: "et-glueck-zeit", lb: "et4", stufe: 4, lz: ["et.we.04", "et.ge.02"], name: "Glück, Zeit und Abschied", e: "🍀", farbe: "#3BAA5C", grund: "#E8F7EC",
    kurz: "Was ist Glück, gefühlte und gemessene Zeit, Zeit für mich und andere, was den Menschen ausmacht, Abschied nehmen", schritte: [
      info("Große Fragen", "🍀", "Philosophen stellen große Fragen: Was ist Glück? Was ist Zeit? Was macht den Menschen zum Menschen? Es gibt keine einfache Antwort – aber das Nachdenken lohnt sich.",
        "Философы задают большие вопросы: что такое счастье? Что такое время? Что делает человека человеком? Простого ответа нет – но размышлять стоит."),
      daumen("Eine Stunde beim Spielen fühlt sich oft kürzer an als eine Stunde Warten beim Arzt.", "Час игры часто кажется короче, чем час ожидания у врача.", "⏳", true,
        "Stimmt! Die Uhr misst gleich – aber die gefühlte Zeit ist ganz verschieden.", "Верно! Часы измеряют одинаково – но ощущаемое время совсем разное."),
      wahl("Eine Fee erfüllt dir jeden Wunsch. Wärst du dann für immer glücklich?", "Фея исполняет любое твоё желание. Будешь ли ты счастлив навсегда?", "🧚",
        ["Vielleicht nicht – Glück hat auch mit Freunden und eigenen Taten zu tun", "Может, и нет – счастье связано и с друзьями, и со своими делами", "Ein kluger Gedanke! Viele Menschen sind glücklich, wenn sie etwas selbst geschafft haben.", "Мудрая мысль! Многие люди счастливы, когда что-то сделали сами."],
        ["Ja, ganz sicher, für immer", "Да, точно, навсегда", "Darüber kann man streiten – Wünsche allein machen nicht immer glücklich.", "Об этом можно спорить – одни желания не всегда делают счастливым."],
        ["Glück gibt es gar nicht", "Счастья вообще нет", "Doch! Es gibt viele kleine Glücksmomente.", "Есть! Бывает много маленьких моментов счастья."]),
      daumen("Wenn jemand stirbt, dürfen Menschen traurig sein – und es hilft, darüber zu reden.", "Когда кто-то умирает, люди могут грустить – и помогает говорить об этом.", "🕯️", true,
        "Stimmt! Erinnerungen bleiben. Sprich mit einem Erwachsenen, dem du vertraust, wenn dich etwas traurig macht.", "Верно! Воспоминания остаются. Поговори со взрослым, которому доверяешь, если тебе грустно."),
      zuordnen("Wofür ist die Zeit?", "Для чего это время?", [["ich", "Zeit für mich", "Время для себя", "🛋️"], ["andere", "Zeit für andere", "Время для других", "🤝"]],
        [["Ein Buch lesen", "Читать книгу", "ich"], ["Oma beim Einkaufen helfen", "Помочь бабушке с покупками", "andere"], ["Mit dem kleinen Bruder spielen", "Поиграть с младшим братом", "andere"]]),
      ende("Super, {name}! Wann warst du zuletzt richtig glücklich? Mal oder schreib es auf.", "Супер, {name}! Когда ты в последний раз был по-настоящему счастлив? Нарисуй или запиши.")
    ] });
})();
