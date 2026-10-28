// Religion mit Eule Ella (28.10.2026): Evangelische und Katholische Religion nach den sächsischen Lehrplänen Grundschule (Fassung 2004/2009/2019,
// PDFs vom Auftraggeber), nur zusammengefasst. Sichtbar als Reiter „Religion“, wenn die Eltern „Mein Kind hat … Religion“ gewählt haben
// (eltern.ethik.unterricht = "ev" | "ka"). Themen mit konf: ["ev"], ["ka"] oder beiden. Erzählt wird sachlich („Die Bibel erzählt …“, „Christen glauben …“).
// Lernbereiche (in beiden Lehrplänen gleich gegliedert): re1 Miteinander leben · re2 Nach Gott fragen (ev) / Das Geheimnis entdecken (ka) ·
// re3 Die biblische Botschaft kennen lernen · re4 Mit der Gemeinde (ev) bzw. Kirche (ka) feiern. Bei wahl ist die erste Option richtig (die Seite mischt).
(function () {
  const info = (titel, bild, text, ru, fakten) => Object.assign({ typ: "info", titel, bild, text, ru }, fakten ? { fakten } : {});
  const wahl = (frage, ru, bild, ...opts) => ({ typ: "wahl", frage, ru, bild, optionen: opts.map(([t, r, warum, warumRu], i) => ({ t, ru: r, ok: i === 0, warum, warumRu })) });
  const daumen = (satz, satzRu, bild, ok, warum, warumRu) => ({ typ: "daumen", satz, satzRu, bild, ok, warum, warumRu });
  const zuordnen = (frage, ru, gruppen, dinge) => ({ typ: "zuordnen", frage, ru, gruppen: gruppen.map(([id, name, r, bild]) => ({ id, name, ru: r, bild })),
    dinge: dinge.map(([t, r, gruppe]) => ({ t, ru: r, gruppe })) });
  const ende = (text, ru) => info("Geschafft!", "🦉", text, ru);

  (window.FACH_SEITEN = window.FACH_SEITEN || {}).religion = { name: "Religion", e: "✝️", nurMitWahl: true,
    intro: "In Religion hörst du Geschichten aus der Bibel und lernst Feste, Kirche und Gebete kennen.",
    lb: [["re1", "🤝 Miteinander leben"], ["re2", "✨ Nach Gott fragen, das Geheimnis entdecken"], ["re3", "📖 Die biblische Botschaft kennen lernen"], ["re4", "🕯️ Mit Gemeinde und Kirche feiern"]] };
  const T = window.FACH_THEMEN = window.FACH_THEMEN || [];
  const BEIDE = ["ev", "ka"];
  const re = (t) => T.push(Object.assign({ fach: "religion", konf: BEIDE }, t));

  // ==================== Klassen 1/2 ====================
  re({ id: "re-gefuehle", lb: "re1", kl: 2, lz: ["re.mi.01", "et.ge.01"], name: "Freude, Angst und Trost", e: "🌈", farbe: "#E0A800", grund: "#FFF7D6",
    kurz: "Gefühle zeigen, Streit verstehen, Trost finden, Jesus stillt den Sturm", schritte: [
      info("Gefühle gehören dazu", "🌈", "Jeder Mensch ist mal fröhlich, traurig, wütend oder ängstlich. Es hilft, Gefühle zu zeigen und darüber zu reden. In der Religion erzählen viele Geschichten davon, wie Menschen Trost gefunden haben.",
        "Каждый человек бывает весёлым, грустным, злым или испуганным. Помогает показывать чувства и говорить о них. В религии многие истории рассказывают, как люди находили утешение."),
      wahl("Dein Freund ist traurig. Was kannst du tun?", "Твой друг грустит. Что ты можешь сделать?", "🫂",
        ["Zu ihm gehen, zuhören und trösten", "Подойти, выслушать и утешить", "Richtig! Trösten heißt: Ich bin für dich da.", "Правильно! Утешать – значит: я рядом с тобой."],
        ["Ihn auslachen", "Посмеяться над ним", "Das tut weh. Zuhören hilft viel mehr.", "Это больно. Выслушать помогает гораздо больше."],
        ["So tun, als sähe man nichts", "Сделать вид, что ничего не видишь", "Hinsehen und helfen ist besser.", "Лучше заметить и помочь."]),
      info("Der Sturm auf dem See", "⛵", "Die Bibel erzählt: Jesus und seine Jünger fahren mit dem Boot über einen See. Ein Sturm kommt, die Jünger haben große Angst. Jesus steht auf – und der Sturm wird still.",
        "Библия рассказывает: Иисус с учениками плывут на лодке по озеру. Начинается буря, ученики очень боятся. Иисус встаёт – и буря утихает."),
      wahl("Was lernen Christen aus dieser Geschichte?", "Чему учатся христиане из этой истории?", "🌊",
        ["Auch wenn man Angst hat, ist man nicht allein", "Даже когда страшно, ты не один", "Genau! Christen glauben, dass Gott ihnen in Angst beisteht.", "Точно! Христиане верят, что Бог помогает им в страхе."],
        ["Man soll nie Boot fahren", "Никогда нельзя плавать на лодке", "Nein, darum geht es nicht.", "Нет, дело не в этом."],
        ["Stürme gibt es nicht", "Бурь не бывает", "Doch – Stürme gibt es, im Wetter und im Leben.", "Бывают – и в погоде, и в жизни."]),
      daumen("Neid und Wut können zu Streit führen – man kann aber lernen, Streit friedlich zu lösen.", "Зависть и злость могут привести к ссоре – но можно научиться мирно её решать.", "🕊️", true,
        "Stimmt! Zuhören, Wünsche sagen und gemeinsam eine Lösung suchen hilft.", "Верно! Помогает слушать, говорить о желаниях и вместе искать решение."),
      ende("Super, {name}! Wenn du traurig bist: Sprich mit jemandem, dem du vertraust.", "Супер, {name}! Если тебе грустно, поговори с тем, кому доверяешь.")
    ] });
  re({ id: "re-schoepfung", lb: "re2", kl: 2, lz: ["re.go.01", "et.we.03"], name: "Die Welt ist wunderbar", e: "🌻", farbe: "#3BAA5C", grund: "#E8F7EC",
    kurz: "Schöpfung mit allen Sinnen entdecken, staunen, loben und danken, die Schöpfung bewahren", schritte: [
      info("Staunen über die Welt", "🌻", "Menschen, Tiere, Pflanzen, Steine – die Welt ist voller Wunder. Christen glauben, dass Gott die Welt geschaffen hat. Darum nennen sie sie „Schöpfung“ und danken Gott dafür.",
        "Люди, животные, растения, камни – мир полон чудес. Христиане верят, что Бог сотворил мир. Поэтому они называют его «творением» и благодарят за него Бога."),
      zuordnen("Mit welchem Sinn entdeckst du es?", "Каким чувством ты это открываешь?", [["sehen", "Sehen", "Зрение", "👀"], ["hoeren", "Hören", "Слух", "👂"], ["riechen", "Riechen", "Обоняние", "👃"]],
        [["Ein Regenbogen", "Радуга", "sehen"], ["Vogelgezwitscher", "Пение птиц", "hoeren"], ["Duftende Blumen", "Ароматные цветы", "riechen"]]),
      wahl("In der Bibel gibt es Lieder, die Gott für die Schöpfung loben. Wie heißen sie?", "В Библии есть песни, которые славят Бога за творение. Как они называются?", "🎶",
        ["Psalmen", "Псалмы", "Richtig! Psalm 104 lobt Gott für Sonne, Meer, Tiere und Pflanzen.", "Правильно! Псалом 103/104 славит Бога за солнце, море, животных и растения."],
        ["Märchen", "Сказки", "Märchen sind ausgedachte Geschichten.", "Сказки – придуманные истории."],
        ["Rezepte", "Рецепты", "Nein, Psalmen sind Lieder und Gebete.", "Нет, псалмы – это песни и молитвы."]),
      daumen("Die Schöpfung bewahren heißt: gut mit Tieren, Pflanzen und Wasser umgehen.", "Беречь творение значит: хорошо обращаться с животными, растениями и водой.", "💧", true,
        "Stimmt! Wasser ist eine Quelle des Lebens – wir gehen sparsam damit um.", "Верно! Вода – источник жизни, её надо беречь."),
      ende("Toll, {name}! Mach draußen eine Staune-Minute: Was siehst, hörst und riechst du?", "Здорово, {name}! Устрой на улице минуту удивления: что ты видишь, слышишь, чувствуешь?")
    ] });
  re({ id: "re-noah", lb: "re2", kl: 2, lz: ["re.bi.01"], name: "Noah und der Regenbogen", e: "🌈", farbe: "#2F86C8", grund: "#EAF4FC",
    kurz: "Noah baut die Arche, die große Flut, die Taube, der Regenbogen als Zeichen des Bundes", schritte: [
      info("Die Arche", "🚢", "Die Bibel erzählt von Noah: Er baut ein riesiges Schiff, die Arche. Er nimmt seine Familie und von allen Tieren ein Paar mit. Dann kommt eine große Flut.",
        "Библия рассказывает о Ное: он строит огромный корабль – ковчег. Он берёт свою семью и по паре всех животных. Потом приходит великий потоп."),
      wahl("Wie viele Tiere jeder Art nimmt Noah in die Arche?", "Сколько животных каждого вида берёт Ной в ковчег?", "🦒",
        ["Ein Paar", "Пару", "Richtig! Ein Männchen und ein Weibchen – damit es danach wieder Tiere gibt.", "Правильно! Самца и самку – чтобы потом снова были животные."],
        ["Eins", "Одно", "Nein, ein Paar.", "Нет, пару."],
        ["Hundert", "Сто", "So viele hätten nicht hineingepasst.", "Столько бы не поместилось."]),
      wahl("Woran merkt Noah, dass das Wasser zurückgeht?", "Как Ной узнаёт, что вода уходит?", "🕊️",
        ["Eine Taube bringt einen Ölzweig", "Голубь приносит масличную ветвь", "Genau! Irgendwo wachsen wieder Bäume.", "Точно! Где-то снова растут деревья."],
        ["Ein Fisch springt ins Boot", "Рыба прыгает в лодку", "Nein, eine Taube bringt den Zweig.", "Нет, голубь приносит ветку."],
        ["Es schneit", "Идёт снег", "Nein, eine Taube bringt einen Zweig.", "Нет, голубь приносит ветку."]),
      daumen("Nach der Flut erscheint ein Regenbogen. Er ist in der Bibel ein Zeichen für Gottes Versprechen: Ich halte zu euch.", "После потопа появляется радуга. В Библии это знак Божьего обещания: Я с вами.", "🌈", true,
        "Stimmt! Christen sehen im Regenbogen ein Zeichen für Hoffnung und einen neuen Anfang.", "Верно! Христиане видят в радуге знак надежды и нового начала."),
      ende("Super, {name}! Mal eine Arche mit vielen Tierpaaren.", "Супер, {name}! Нарисуй ковчег со многими парами животных.")
    ] });
  re({ id: "re-gottesbilder", lb: "re2", kl: 2, lz: ["re.go.01"], name: "Wie ist Gott? Bilder aus der Bibel", e: "🐑", farbe: "#7B55B8", grund: "#F1EAFF",
    kurz: "Gott als Hirte, Licht, Fels, Vater und Mutter – eigene Fragen nach Gott", schritte: [
      info("Bilder für Gott", "🐑", "Niemand hat Gott gesehen. Darum benutzt die Bibel Bilder: Gott ist wie ein guter Hirte, wie ein Licht, wie ein Fels, wie ein liebender Vater oder eine tröstende Mutter.",
        "Никто не видел Бога. Поэтому Библия использует образы: Бог как добрый пастырь, как свет, как скала, как любящий отец или утешающая мать."),
      wahl("Psalm 23 beginnt mit: „Der Herr ist mein …“", "Псалом 22/23 начинается так: «Господь – мой …»", "🐑",
        ["Hirte", "пастырь", "Richtig! Ein Hirte passt auf seine Schafe auf, führt sie zum Wasser und beschützt sie.", "Правильно! Пастух бережёт овец, ведёт их к воде и защищает."],
        ["Lehrer", "учитель", "Nein, „Der Herr ist mein Hirte“.", "Нет, «Господь – Пастырь мой»."],
        ["König", "король", "Nein, in Psalm 23 heißt es Hirte.", "Нет, в этом псалме – пастырь."]),
      zuordnen("Was sagt das Bild?", "Что говорит образ?", [["schutz", "Gott beschützt", "Бог защищает", "🛡️"], ["licht", "Gott zeigt den Weg", "Бог указывает путь", "💡"]],
        [["Gott ist wie ein Fels", "Бог как скала", "schutz"], ["Gott ist wie ein Hirte", "Бог как пастырь", "schutz"], ["Gott ist mein Licht", "Бог – мой свет", "licht"]]),
      daumen("Kinder dürfen eigene Fragen über Gott stellen – auch Fragen, auf die niemand sicher antworten kann.", "Дети могут задавать свои вопросы о Боге – даже такие, на которые никто точно не ответит.", "❓", true,
        "Stimmt! Gemeinsam über solche Fragen nachdenken nennt man Theologisieren.", "Верно! Вместе размышлять над такими вопросами называют богословствовать."),
      ende("Toll, {name}! Mal ein Bild: Wie stellst du dir Gott vor – oder was fragst du dich?", "Здорово, {name}! Нарисуй: как ты представляешь Бога – или о чём ты спрашиваешь?")
    ] });
  re({ id: "re-licht-wasser", lb: "re2", kl: 2, lz: ["re.go.01", "re.fe.02"], name: "Licht und Wasser", e: "🕯️", farbe: "#1F8F8A", grund: "#E6F7F5",
    kurz: "Licht als Zeichen im Kirchenjahr, Licht für andere sein, Wasser als Quelle des Lebens, Taufwasser", schritte: [
      info("Zeichen, die viel bedeuten", "🕯️", "Licht und Wasser sind wichtige Zeichen in der Religion. Kerzen leuchten im Advent und zu Ostern. Wasser schenkt Leben – und bei der Taufe ist es ein Zeichen für das neue Leben mit Gott.",
        "Свет и вода – важные знаки в религии. Свечи горят в Адвент и на Пасху. Вода дарит жизнь – а при крещении она знак новой жизни с Богом."),
      zuordnen("Wo leuchtet das Licht?", "Где горит свет?", [["advent", "Advent", "Адвент", "🕯️"], ["ostern", "Ostern", "Пасха", "🔥"]],
        [["Adventskranz", "Рождественский венок", "advent"], ["Osterfeuer", "Пасхальный огонь", "ostern"], ["Osterkerze", "Пасхальная свеча", "ostern"]]),
      daumen("Wer anderen hilft, ist wie ein Licht für sie – so wie St. Martin oder Nikolaus.", "Кто помогает другим, тот как свет для них – как святой Мартин или Николай.", "🏮", true,
        "Stimmt! „Licht für andere sein“ heißt: Freude und Hilfe bringen.", "Верно! «Быть светом для других» значит приносить радость и помощь."),
      wahl("Wasser kann Leben schenken – und gefährlich sein. Was stimmt?", "Вода может дарить жизнь – и быть опасной. Что верно?", "💧",
        ["Ohne Wasser kann nichts leben, darum gehen wir sorgsam damit um", "Без воды ничего не живёт, поэтому мы её бережём", "Genau! Wasser ist eine Quelle des Lebens.", "Точно! Вода – источник жизни."],
        ["Wasser braucht niemand", "Вода никому не нужна", "Doch – alle Lebewesen brauchen Wasser.", "Нужна – всем живым существам."],
        ["Wasser ist immer gefährlich", "Вода всегда опасна", "Nein, nur manchmal, zum Beispiel bei Hochwasser.", "Нет, только иногда, например при наводнении."]),
      ende("Super, {name}! Zünde mit einem Erwachsenen eine Kerze an und sei einen Moment ganz still.", "Супер, {name}! Зажги со взрослым свечу и побудь минуту в тишине.")
    ] });
  re({ id: "re-zeit-jesu", lb: "re3", kl: 2, lz: ["re.bi.02"], name: "Jesus und seine Heimat", e: "🏡", farbe: "#B5651D", grund: "#FFF1E3",
    kurz: "Land und Leben zur Zeit Jesu, Menschen damals: Fischer, Zöllner, Römer, Kinder", schritte: [
      info("Wo Jesus lebte", "🏡", "Jesus lebte vor etwa 2000 Jahren im Land Israel, in Nazaret und am See Genezareth. Die Menschen wohnten in kleinen Häusern aus Lehm, backten Fladenbrot und arbeiteten als Fischer, Bauern oder Handwerker.",
        "Иисус жил около 2000 лет назад в земле Израиля, в Назарете и у Галилейского озера. Люди жили в маленьких глиняных домах, пекли лепёшки и работали рыбаками, крестьянами или ремесленниками."),
      zuordnen("Wer war das damals?", "Кто это был тогда?", [["fischer", "Fischer", "Рыбак", "🎣"], ["zoellner", "Zöllner", "Мытарь", "🪙"], ["roemer", "Römischer Soldat", "Римский солдат", "🛡️"]],
        [["Fährt mit dem Boot auf den See", "Выходит на лодке на озеро", "fischer"], ["Sammelt Geld für die Römer ein", "Собирает деньги для римлян", "zoellner"], ["Bewacht das Land für den Kaiser", "Охраняет землю для императора", "roemer"]]),
      daumen("Damals hatten Kinder keine Schule wie wir – viele mussten früh mitarbeiten.", "Тогда у детей не было школы, как у нас, – многим рано приходилось работать.", "🧺", true,
        "Stimmt! Jungen lernten oft in der Synagoge lesen, viele Kinder halfen in Haus und Feld.", "Верно! Мальчики часто учились читать в синагоге, многие дети помогали дома и в поле."),
      wahl("Was aß man zur Zeit Jesu oft?", "Что часто ели во времена Иисуса?", "🫓",
        ["Fladenbrot, Oliven, Fisch", "Лепёшки, оливки, рыбу", "Richtig! Pommes und Pizza gab es noch nicht.", "Правильно! Картошки фри и пиццы ещё не было."],
        ["Pommes", "Картошку фри", "Kartoffeln kannte man dort damals noch gar nicht.", "Картошку тогда там ещё не знали."],
        ["Schokolade", "Шоколад", "Schokolade kam erst viel später nach Europa.", "Шоколад появился в Европе гораздо позже."]),
      ende("Toll, {name}! Vielleicht könnt ihr zu Hause einmal Fladenbrot backen.", "Здорово, {name}! Может быть, вы дома испечёте лепёшки.")
    ] });
  re({ id: "re-jesus-hilft", lb: "re3", kl: 2, lz: ["re.bi.02"], name: "Jesus sieht die Not: Bartimäus und die Kinder", e: "🙌", farbe: "#C2337A", grund: "#FFEAF3",
    kurz: "Heilung des blinden Bartimäus, Jesus segnet die Kinder, Jesus ruft den Zöllner Levi", schritte: [
      info("Bartimäus", "👁️", "Die Bibel erzählt: Am Weg sitzt der blinde Bettler Bartimäus. Er ruft laut nach Jesus. Die Leute wollen, dass er still ist. Aber Jesus bleibt stehen, fragt ihn und macht ihn gesund.",
        "Библия рассказывает: у дороги сидит слепой нищий Вартимей. Он громко зовёт Иисуса. Люди хотят, чтобы он замолчал. Но Иисус останавливается, спрашивает его и исцеляет."),
      wahl("Was macht Jesus anders als die Leute?", "Что Иисус делает иначе, чем люди?", "🙋",
        ["Er hört Bartimäus zu und hilft", "Он выслушивает Вартимея и помогает", "Richtig! Er sieht hin statt weg.", "Правильно! Он смотрит, а не отворачивается."],
        ["Er schimpft mit ihm", "Ругает его", "Nein, er nimmt sich Zeit für ihn.", "Нет, он уделяет ему время."],
        ["Er geht schnell weiter", "Быстро проходит мимо", "Nein, er bleibt stehen.", "Нет, он останавливается."]),
      wahl("Die Jünger wollen Kinder wegschicken. Was sagt Jesus?", "Ученики хотят прогнать детей. Что говорит Иисус?", "👧",
        ["Lasst die Kinder zu mir kommen", "Пустите детей ко Мне", "Genau! Jesus segnet die Kinder – sie sind ihm wichtig.", "Точно! Иисус благословляет детей – они важны для Него."],
        ["Kinder sollen draußen warten", "Дети пусть ждут снаружи", "Nein, Jesus will die Kinder bei sich haben.", "Нет, Иисус хочет, чтобы дети были рядом."],
        ["Kinder sind zu laut", "Дети слишком шумные", "Nein, Jesus ruft sie zu sich.", "Нет, Иисус зовёт их к себе."]),
      daumen("Jesus aß mit dem Zöllner Levi, obwohl viele Zöllner nicht mochten.", "Иисус ел с мытарем Левием, хотя многие мытарей не любили.", "🍽️", true,
        "Stimmt! Jesus zeigte: Auch Menschen, die andere ablehnen, gehören dazu.", "Верно! Иисус показал: и те, кого другие отвергают, тоже свои."),
      ende("Super, {name}! Schau heute, ob jemand Hilfe braucht – und hilf.", "Супер, {name}! Посмотри сегодня, нужна ли кому-то помощь, – и помоги.")
    ] });
  re({ id: "re-abraham", lb: "re3", kl: 2, lz: ["re.bi.01"], name: "Abraham und Sara", e: "⭐", farbe: "#E0A800", grund: "#FFF7D6",
    kurz: "Aufbruch in ein neues Land, Gottes Versprechen, Zweifel und Vertrauen, Segen", schritte: [
      info("Ein großer Aufbruch", "⛺", "Die Bibel erzählt: Abraham und Sara verlassen ihre Heimat und ziehen mit Zelten und Tieren in ein fremdes Land. Gott verspricht ihnen: Ihr werdet Nachkommen haben, so viele wie Sterne am Himmel.",
        "Библия рассказывает: Авраам и Сарра покидают родину и уходят с шатрами и скотом в чужую землю. Бог обещает им: у вас будет потомство, столько, сколько звёзд на небе."),
      wahl("Wie lebten Abraham und Sara unterwegs?", "Как жили Авраам и Сарра в пути?", "🐪",
        ["In Zelten, mit ihren Tieren", "В шатрах, со своими животными", "Richtig! Sie waren Nomaden – Menschen, die umherziehen.", "Правильно! Они были кочевниками – людьми, которые кочуют."],
        ["In einem Hochhaus", "В высотном доме", "Nein, Hochhäuser gab es damals nicht.", "Нет, высоток тогда не было."],
        ["Auf einem Schiff", "На корабле", "Nein, sie zogen über Land.", "Нет, они шли по суше."]),
      daumen("Sara lachte, weil sie so alt war und nicht glauben konnte, noch ein Kind zu bekommen.", "Сарра засмеялась, потому что была очень старой и не верила, что родит ребёнка.", "😄", true,
        "Stimmt! Später bekam sie einen Sohn: Isaak. Sein Name erinnert an das Lachen.", "Верно! Позже у неё родился сын Исаак. Его имя напоминает о смехе."),
      wahl("Was ist ein Segen?", "Что такое благословение?", "🙏",
        ["Ein guter Wunsch, dass Gott jemanden behütet", "Доброе пожелание, чтобы Бог хранил кого-то", "Genau! Eltern segnen ihre Kinder, im Gottesdienst wird gesegnet.", "Точно! Родители благословляют детей, в богослужении благословляют."],
        ["Ein Geschenk aus dem Laden", "Подарок из магазина", "Nein, ein Segen ist ein guter Wunsch.", "Нет, благословение – это доброе пожелание."],
        ["Eine Strafe", "Наказание", "Nein, ein Segen ist etwas Gutes.", "Нет, благословение – это что-то хорошее."]),
      ende("Toll, {name}! Hast du schon einmal umziehen oder neu anfangen müssen? Erzähl jemandem davon.", "Здорово, {name}! Тебе приходилось переезжать или начинать заново? Расскажи кому-нибудь.")
    ] });
  re({ id: "re-josef", lb: "re3", kl: 2, lz: ["re.bi.01"], name: "Josef und seine Brüder", e: "🧥", farbe: "#8E5BC8", grund: "#F3ECFF",
    kurz: "Lieblingssohn, Streit mit den Brüdern, Sklave in Ägypten, Träume deuten, Versöhnung", schritte: [
      info("Der bunte Mantel", "🧥", "Die Bibel erzählt: Jakob hat zwölf Söhne. Josef ist sein Liebling und bekommt einen bunten Mantel. Die Brüder werden neidisch und verkaufen Josef als Sklaven nach Ägypten.",
        "Библия рассказывает: у Иакова двенадцать сыновей. Иосиф – любимец, он получает пёструю одежду. Братья завидуют и продают Иосифа в рабство в Египет."),
      wahl("Warum sind die Brüder böse auf Josef?", "Почему братья злятся на Иосифа?", "😠",
        ["Weil der Vater ihn bevorzugt", "Потому что отец выделяет его", "Richtig! Neid kann großen Streit auslösen.", "Правильно! Зависть может вызвать большую ссору."],
        ["Weil er nicht teilen will", "Потому что он не делится", "Davon erzählt die Geschichte nicht – es geht um den Neid.", "Об этом история не говорит – дело в зависти."],
        ["Weil er zu laut singt", "Потому что он громко поёт", "Nein, es geht um den Neid.", "Нет, дело в зависти."]),
      wahl("Der Pharao träumt von sieben fetten und sieben mageren Kühen. Was bedeutet das laut Josef?", "Фараону снятся семь тучных и семь тощих коров. Что это значит, по Иосифу?", "🐄",
        ["Sieben gute Erntejahre, dann sieben Hungerjahre", "Семь урожайных лет, потом семь голодных", "Genau! Darum sammelt Ägypten Vorräte – und Josef wird ein wichtiger Mann.", "Точно! Поэтому Египет делает запасы – и Иосиф становится важным человеком."],
        ["Es gibt bald mehr Kühe", "Скоро будет больше коров", "Nein, die Kühe stehen für Erntejahre.", "Нет, коровы означают годы урожая."],
        ["Der Pharao soll Milch trinken", "Фараон должен пить молоко", "Nein, es geht um Ernte und Hunger.", "Нет, речь об урожае и голоде."]),
      daumen("Am Ende verzeiht Josef seinen Brüdern und die Familie ist wieder zusammen.", "В конце Иосиф прощает братьев, и семья снова вместе.", "🤝", true,
        "Stimmt! Versöhnung ist schwer – aber sie macht einen neuen Anfang möglich.", "Верно! Примириться трудно – но это делает возможным новое начало."),
      ende("Super, {name}! Spielt die Versöhnung der Brüder einmal nach.", "Супер, {name}! Разыграйте примирение братьев.")
    ] });
  re({ id: "re-vaterunser", lb: "re3", kl: 2, konf: ["ka"], lz: ["re.go.02"], name: "Beten, Stille und das Vaterunser", e: "🙏", farbe: "#2F6FD6", grund: "#EAF2FF",
    kurz: "Stilleübungen, zuhören, mit Gott sprechen, das Vaterunser als Gebet aller Christen", schritte: [
      info("Still werden", "🤫", "Wenn es ganz still wird, hörst du Dinge, die du sonst überhörst: deinen Atem, das Ticken einer Uhr, einen Vogel. Christen werden auch still, wenn sie beten – mit eigenen Worten oder mit Gebeten, die alle kennen.",
        "Когда становится совсем тихо, слышишь то, что обычно не замечаешь: дыхание, тиканье часов, птицу. Христиане тоже затихают, когда молятся, – своими словами или молитвами, которые все знают."),
      wahl("Welches Gebet hat Jesus der Bibel nach seinen Jüngern beigebracht?", "Какой молитве, по Библии, Иисус научил учеников?", "📜",
        ["Das Vaterunser", "«Отче наш»", "Richtig! Christen auf der ganzen Welt beten es – in vielen Sprachen.", "Правильно! Христиане по всему миру молятся ею – на многих языках."],
        ["Das ABC-Lied", "Песенку про алфавит", "Nein, das Vaterunser.", "Нет, «Отче наш»."],
        ["Ein Geburtstagslied", "Песню на день рождения", "Nein, das Vaterunser.", "Нет, «Отче наш»."]),
      daumen("Beten kann man laut oder leise, mit gefalteten Händen, im Stehen oder im Sitzen.", "Молиться можно громко или тихо, сложив руки, стоя или сидя.", "🙏", true,
        "Stimmt! Wichtig ist, was man Gott sagen möchte: danken, bitten, klagen.", "Верно! Важно то, что хочешь сказать Богу: поблагодарить, попросить, пожаловаться."),
      ende("Toll, {name}! Mach eine Stille-Minute: Augen zu – was hörst du?", "Здорово, {name}! Устрой минуту тишины: закрой глаза – что ты слышишь?")
    ] });
  re({ id: "re-feste12", lb: "re4", kl: 2, lz: ["re.fe.01", "et.we.02"], name: "Erntedank, Advent und Weihnachten", e: "🎄", farbe: "#E0574A", grund: "#FFECE8",
    kurz: "Erntedank, Advent als Zeit des Wartens, Nikolaus, die Weihnachtsgeschichte, Stern und Krippe", schritte: [
      info("Feste im Herbst und Winter", "🎄", "Zum Erntedankfest danken Christen für das Essen. Der Advent ist eine Zeit des Wartens und Vorfreuens. An Weihnachten feiern Christen die Geburt von Jesus.",
        "На праздник урожая христиане благодарят за еду. Адвент – время ожидания и радости. На Рождество христиане празднуют рождение Иисуса."),
      wahl("Wo wurde Jesus nach der Weihnachtsgeschichte geboren?", "Где, по рождественской истории, родился Иисус?", "⭐",
        ["In einem Stall in Betlehem", "В хлеву в Вифлееме", "Richtig! Maria legte ihn in eine Futterkrippe.", "Правильно! Мария положила Его в ясли."],
        ["In einem Krankenhaus", "В больнице", "Nein, in einem Stall – es gab keinen Platz in der Herberge.", "Нет, в хлеву – в гостинице не было места."],
        ["In einem Schloss", "Во дворце", "Nein, ganz einfach in einem Stall.", "Нет, совсем просто – в хлеву."]),
      zuordnen("Wer kommt zur Krippe?", "Кто приходит к яслям?", [["hirten", "Die Hirten", "Пастухи", "🐑"], ["weise", "Die Weisen", "Волхвы", "🎁"]],
        [["Ein Engel sagt es ihnen auf dem Feld", "Им сообщает ангел в поле", "hirten"], ["Sie folgen einem Stern", "Они идут за звездой", "weise"], ["Sie bringen Gold, Weihrauch und Myrrhe", "Приносят золото, ладан и смирну", "weise"]]),
      daumen("Der Adventskranz hat vier Kerzen – an jedem Adventssonntag wird eine mehr angezündet.", "На венке Адвента четыре свечи – каждое воскресенье зажигают на одну больше.", "🕯️", true,
        "Stimmt! So wird es bis Weihnachten immer heller.", "Верно! Так до Рождества становится всё светлее."),
      ende("Super, {name}! Erzähl jemandem die Weihnachtsgeschichte mit eigenen Worten.", "Супер, {name}! Расскажи кому-нибудь рождественскую историю своими словами.")
    ] });
  re({ id: "re-ostern12", lb: "re4", kl: 2, lz: ["re.fe.01"], name: "Karwoche und Ostern", e: "🐣", farbe: "#3BAA5C", grund: "#E8F7EC",
    kurz: "Palmsonntag, das letzte Abendmahl, Karfreitag, die Auferstehung, Osterbräuche", schritte: [
      info("Die Woche vor Ostern", "🌿", "Die Woche vor Ostern heißt Karwoche. Am Palmsonntag zieht Jesus in Jerusalem ein, die Menschen jubeln. Am Gründonnerstag isst er mit seinen Jüngern. Am Karfreitag stirbt er am Kreuz.",
        "Неделя перед Пасхой называется Страстной. В Вербное воскресенье Иисус въезжает в Иерусалим, люди ликуют. В Великий четверг Он ужинает с учениками. В Страстную пятницу Он умирает на кресте."),
      wahl("Was feiern Christen an Ostern?", "Что празднуют христиане на Пасху?", "✝️",
        ["Dass Jesus auferstanden ist", "Что Иисус воскрес", "Richtig! Ostern ist ein Fest der Freude und des neuen Lebens.", "Правильно! Пасха – праздник радости и новой жизни."],
        ["Die Geburt von Jesus", "Рождение Иисуса", "Die feiern sie an Weihnachten.", "Его празднуют на Рождество."],
        ["Den Frühlingsanfang", "Начало весны", "Ostern ist im Frühling – gefeiert wird aber die Auferstehung.", "Пасха весной – но празднуют воскресение."]),
      zuordnen("Welcher Tag?", "Какой день?", [["palm", "Palmsonntag", "Вербное воскресенье", "🌿"], ["kar", "Karfreitag", "Страстная пятница", "✝️"], ["ostern", "Ostersonntag", "Пасха", "🌅"]],
        [["Menschen jubeln mit Palmzweigen", "Люди ликуют с пальмовыми ветвями", "palm"], ["Jesus stirbt am Kreuz", "Иисус умирает на кресте", "kar"], ["Frauen finden das Grab leer", "Женщины находят гроб пустым", "ostern"]]),
      daumen("Das Ei ist ein Zeichen für neues Leben – darum gibt es zu Ostern bemalte Eier.", "Яйцо – знак новой жизни, поэтому на Пасху есть крашеные яйца.", "🥚", true,
        "Stimmt! Auch das Osterfeuer und die Osterkerze sind Zeichen: Das Licht ist stärker als die Dunkelheit.", "Верно! Пасхальный огонь и свеча тоже знаки: свет сильнее тьмы."),
      ende("Toll, {name}! Bemal zu Ostern ein Ei mit einem Zeichen für neues Leben.", "Здорово, {name}! Распиши на Пасху яйцо знаком новой жизни.")
    ] });
  re({ id: "re-kirche-taufe", lb: "re4", kl: 2, lz: ["re.fe.02"], name: "Kirche, Sonntag und Taufe", e: "⛪", farbe: "#2F86C8", grund: "#EAF4FC",
    kurz: "Die Kirche als Ort der Gemeinde, Altar, Taufbecken, Kreuz, Sonntag, die Taufe", schritte: [
      info("In der Kirche", "⛪", "In der Kirche trifft sich die Gemeinde zum Gottesdienst – meist am Sonntag. Dort gibt es einen Altar, ein Kreuz, ein Taufbecken, eine Kanzel und oft eine Orgel.",
        "В церкви община собирается на богослужение – обычно в воскресенье. Там есть алтарь, крест, купель, кафедра и часто орган."),
      zuordnen("Wozu ist das in der Kirche?", "Для чего это в церкви?", [["taufe", "Zur Taufe", "Для крещения", "💧"], ["predigt", "Zum Predigen", "Для проповеди", "🗣️"], ["musik", "Für die Musik", "Для музыки", "🎹"]],
        [["Taufbecken", "Купель", "taufe"], ["Kanzel", "Кафедра", "predigt"], ["Orgel", "Орган", "musik"]]),
      wahl("Was bekommt ein Kind bei der Taufe oft geschenkt?", "Что ребёнку часто дарят при крещении?", "🕯️",
        ["Eine Taufkerze", "Крестильную свечу", "Richtig! Mit Wasser getauft wird man Teil der christlichen Gemeinde.", "Правильно! Крещённый водой становится частью христианской общины."],
        ["Einen Fußball", "Футбольный мяч", "Nein, typisch ist die Taufkerze.", "Нет, обычно – крестильная свеча."],
        ["Ein Zeugnis", "Табель", "Nein, eine Taufkerze.", "Нет, крестильную свечу."]),
      daumen("Die Taufe verbindet evangelische und katholische Christen.", "Крещение объединяет евангелических и католических христиан.", "🤝", true,
        "Stimmt! Beide Kirchen erkennen die Taufe gegenseitig an.", "Верно! Обе церкви признают крещение друг друга."),
      ende("Super, {name}! Frag zu Hause: Bist du getauft? Gibt es Fotos oder eine Taufkerze?", "Супер, {name}! Спроси дома: ты крещён? Есть ли фото или свеча?")
    ] });

  // ==================== Klasse 3 ====================
  re({ id: "re-bruecken", lb: "re1", stufe: 3, lz: ["re.mi.01", "et.mi.01"], name: "Brücken bauen: Streit und Versöhnung", e: "🌉", farbe: "#E0574A", grund: "#FFECE8",
    kurz: "Ermutigung, Konflikte, Mobbing, Vergebung, die Goldene Regel, David verschont Saul", schritte: [
      info("Konflikte gehören zum Leben", "🌉", "Streit gibt es überall. Wichtig ist, wie man damit umgeht: zuhören, sich in den anderen hineinversetzen, eine Brücke bauen. Christen glauben, dass Vergebung einen neuen Anfang schenkt.",
        "Ссоры бывают везде. Важно, как с ними обращаться: слушать, ставить себя на место другого, строить мост. Христиане верят, что прощение дарит новое начало."),
      wahl("Was ist ein guter Weg aus einem Streit?", "Какой хороший выход из ссоры?", "🗣️",
        ["Ruhig sagen, was mich stört, und dem anderen zuhören", "Спокойно сказать, что мешает, и выслушать другого", "Richtig! Ohne Beleidigungen – das nennt man gewaltfreie Sprache.", "Правильно! Без оскорблений – это называется ненасильственное общение."],
        ["Zurückschlagen", "Ударить в ответ", "Rache macht alles schlimmer.", "Месть делает всё хуже."],
        ["Lästern", "Сплетничать", "Lästern verletzt und macht den Streit größer.", "Сплетни ранят и раздувают ссору."]),
      daumen("Mobbing gibt es auch im Internet – zum Beispiel gemeine Nachrichten im Klassenchat.", "Травля бывает и в интернете – например, злые сообщения в чате класса.", "📱", true,
        "Stimmt! Hol dir Hilfe bei Erwachsenen. Du kannst auch bei der Nummer gegen Kummer anrufen: 116 111.", "Верно! Обратись за помощью ко взрослым. Можно позвонить на «телефон доверия»: 116 111."),
      wahl("Die Bibel erzählt: David könnte König Saul, der ihn verfolgt, schaden – aber er tut es nicht. Was zeigt das?", "Библия рассказывает: Давид мог навредить царю Саулу, который его преследовал, – но не сделал этого. Что это показывает?", "👑",
        ["Man kann auf Rache verzichten", "Можно отказаться от мести", "Genau! Das ist stark – nicht schwach.", "Точно! Это сила, а не слабость."],
        ["Saul war sein Freund", "Саул был его другом", "Nein, Saul verfolgte ihn.", "Нет, Саул его преследовал."],
        ["David hatte Angst", "Давид боялся", "Es geht darum, dass er auf Rache verzichtet.", "Речь о том, что он отказался от мести."]),
      ende("Super, {name}! Sag heute jemandem etwas Nettes – das ist wie eine kleine Brücke.", "Супер, {name}! Скажи сегодня кому-нибудь что-то приятное – это как маленький мост.")
    ] });
  re({ id: "re-judentum", lb: "re1", stufe: 3, lz: ["re.mi.02"], name: "Jesus war Jude: das Judentum", e: "✡️", farbe: "#2F6FD6", grund: "#EAF2FF",
    kurz: "Synagoge, Thora, Menora, Kippa, Sabbat, Jesus im Tempel, Verfolgung in der Geschichte", schritte: [
      info("Die Wurzel des Christentums", "✡️", "Jesus war Jude. Er betete in der Synagoge und kannte die Thora, die heilige Schrift der Juden. Juden glauben an den einen Gott. Ihr Ruhetag ist der Sabbat – von Freitagabend bis Samstagabend.",
        "Иисус был иудеем. Он молился в синагоге и знал Тору – священное Писание иудеев. Иудеи верят в единого Бога. Их день покоя – шаббат, с вечера пятницы до вечера субботы."),
      zuordnen("Was ist das?", "Что это?", [["synagoge", "Synagoge", "Синагога", "🕍"], ["menora", "Menora", "Менора", "🕎"], ["kippa", "Kippa", "Кипа", "🧢"]],
        [["Haus zum Beten und Versammeln", "Дом для молитвы и собраний", "synagoge"], ["Leuchter mit sieben Armen", "Светильник с семью рожками", "menora"], ["Kleine Kappe beim Gebet", "Маленькая шапочка при молитве", "kippa"]]),
      wahl("Wie ist die Thora meist geschrieben?", "Как обычно записана Тора?", "📜",
        ["Von Hand auf eine Schriftrolle", "От руки на свитке", "Richtig! Sie wird im Thoraschrein aufbewahrt.", "Правильно! Её хранят в ковчеге."],
        ["Auf einem Tablet", "На планшете", "Nein, in der Synagoge liest man aus einer Schriftrolle.", "Нет, в синагоге читают из свитка."],
        ["Als Comic", "Как комикс", "Nein, auf einer Schriftrolle.", "Нет, на свитке."]),
      daumen("Juden wurden in der Geschichte oft ausgegrenzt und verfolgt – auch in Deutschland.", "Евреев в истории часто притесняли и преследовали – и в Германии тоже.", "🕯️", true,
        "Stimmt! Daran erinnern Gedenkorte. Niemand darf wegen seiner Religion ausgegrenzt werden.", "Верно! Об этом напоминают памятные места. Никого нельзя отвергать из-за религии."),
      ende("Toll, {name}! Vielleicht könnt ihr einmal eine Synagoge besuchen.", "Здорово, {name}! Может быть, вы когда-нибудь посетите синагогу.")
    ] });
  re({ id: "re-gleichnisse", lb: "re2", stufe: 3, lz: ["re.bi.02", "re.go.01"], name: "Gleichnisse vom Reich Gottes", e: "🌱", farbe: "#3BAA5C", grund: "#E8F7EC",
    kurz: "Senfkorn, verlorenes Schaf, verlorener Sohn, barmherziger Samariter", schritte: [
      info("Jesus erzählt in Bildern", "🌱", "Jesus hat oft Gleichnisse erzählt: kurze Geschichten aus dem Alltag, die etwas über Gott sagen. Sie erzählen vom „Reich Gottes“ – davon, wie die Welt sein kann, wenn Menschen nach Gottes Willen leben.",
        "Иисус часто рассказывал притчи – короткие истории из жизни, которые говорят что-то о Боге. Они рассказывают о «Царстве Божьем» – каким может быть мир, если люди живут по воле Бога."),
      wahl("Das Senfkorn ist winzig – und wird zu einer großen Pflanze. Was will das Gleichnis sagen?", "Горчичное зерно крошечное – и вырастает в большое растение. Что хочет сказать притча?", "🌳",
        ["Aus kleinen Anfängen kann Großes wachsen", "Из малого начала может вырасти большое", "Richtig! Auch kleine gute Taten können viel bewirken.", "Правильно! И маленькие добрые дела могут многое изменить."],
        ["Senf schmeckt gut", "Горчица вкусная", "Darum geht es nicht.", "Дело не в этом."],
        ["Pflanzen wachsen nicht", "Растения не растут", "Doch – und genau das ist das Bild.", "Растут – это и есть образ."]),
      wahl("Im Gleichnis vom verlorenen Sohn kommt der Sohn nach Hause. Was macht der Vater?", "В притче о блудном сыне сын возвращается домой. Что делает отец?", "🏠",
        ["Er läuft ihm entgegen und feiert ein Fest", "Бежит навстречу и устраивает праздник", "Genau! So, sagt Jesus, ist Gott: Er wartet und verzeiht.", "Точно! Таков, говорит Иисус, Бог: Он ждёт и прощает."],
        ["Er schickt ihn weg", "Прогоняет его", "Nein, er freut sich riesig.", "Нет, он очень радуется."],
        ["Er erkennt ihn nicht", "Не узнаёт его", "Doch, er erkennt ihn schon von Weitem.", "Узнаёт – уже издалека."]),
      wahl("Ein Mann liegt verletzt am Weg. Wer hilft ihm im Gleichnis?", "Раненый человек лежит у дороги. Кто помогает ему в притче?", "🩹",
        ["Ein Fremder aus Samarien", "Чужой человек из Самарии", "Richtig! Der barmherzige Samariter zeigt: Jeder Mensch in Not ist mein Nächster.", "Правильно! Милосердный самарянин показывает: каждый в беде – мой ближний."],
        ["Der Priester", "Священник", "Der Priester ging vorbei.", "Священник прошёл мимо."],
        ["Niemand", "Никто", "Doch – der Samariter hilft.", "Помогает самарянин."]),
      daumen("Jesus vergleicht das Reich Gottes mit einem Schatz im Acker: Wer ihn findet, gibt alles dafür her.", "Иисус сравнивает Царство Божье с сокровищем в поле: кто его найдёт, отдаёт за него всё.", "💎", true,
        "Stimmt! So wertvoll ist es, sagt das Gleichnis.", "Верно! Так оно ценно, говорит притча."),
      wahl("Im Gleichnis vom Festmahl sagen die Gäste ab. Wen lädt der Gastgeber dann ein?", "В притче о пире гости отказываются. Кого тогда зовёт хозяин?", "🎉",
        ["Arme und Kranke von der Straße", "Бедных и больных с улицы", "Richtig! Bei Gott ist Platz für alle.", "Правильно! У Бога есть место для всех."],
        ["Niemanden mehr", "Больше никого", "Nein, er lädt andere ein.", "Нет, он зовёт других."],
        ["Nur reiche Leute", "Только богатых", "Nein, gerade die, die sonst niemand einlädt.", "Нет, именно тех, кого никто не зовёт."]),
      ende("Super, {name}! Denk dir ein eigenes kleines Gleichnis aus: Gott ist wie …", "Супер, {name}! Придумай свою маленькую притчу: Бог как …")
    ] });
  re({ id: "re-bildworte", lb: "re2", stufe: 3, lz: ["re.go.01"], name: "Bildworte: Gott ist wie …", e: "💬", farbe: "#7B55B8", grund: "#F1EAFF",
    kurz: "Redewendungen und biblische Bildworte, Gott als Hirte und Licht, eigene Bilder finden", schritte: [
      info("Sprachbilder", "💬", "Wir sprechen oft in Bildern: „Mir fällt ein Stein vom Herzen.“ Auch die Bibel spricht so von Gott: „Gott ist mein Licht“, „mein Fels“, „mein Hirte“.",
        "Мы часто говорим образами: «У меня камень с души упал». Библия тоже так говорит о Боге: «Бог – мой свет», «моя скала», «мой пастырь»."),
      wahl("Was bedeutet „Mir fällt ein Stein vom Herzen“?", "Что значит «у меня камень с души упал»?", "🪨",
        ["Ich bin erleichtert", "Мне стало легче", "Richtig! Kein echter Stein – ein Sprachbild.", "Правильно! Это не настоящий камень – образ."],
        ["Ich habe einen Stein verloren", "Я потерял камень", "Nein, es ist ein Bild für Erleichterung.", "Нет, это образ облегчения."],
        ["Mein Herz tut weh", "У меня болит сердце", "Nein, es geht um Erleichterung.", "Нет, речь об облегчении."]),
      daumen("„Gott ist mein Licht“ heißt: Gott ist eine Lampe.", "«Бог – мой свет» значит: Бог – это лампа.", "💡", false,
        "Nein! Es ist ein Bild: Wie Licht im Dunkeln hilft, so soll Gott Orientierung und Mut geben.", "Нет! Это образ: как свет помогает в темноте, так Бог даёт ориентир и смелость."),
      zuordnen("Bild oder wörtlich?", "Образ или буквально?", [["bild", "Sprachbild", "Образ", "🎨"], ["wort", "Wörtlich gemeint", "Буквально", "📏"]],
        [["Er ist ein Fels in der Brandung", "Он – скала в прибое", "bild"], ["Ich bin Feuer und Flamme", "Я весь горю (энтузиазмом)", "bild"], ["Der Fels ist zehn Meter hoch", "Скала высотой десять метров", "wort"]]),
      ende("Toll, {name}! Finde ein eigenes Bild: Freundschaft ist wie …", "Здорово, {name}! Найди свой образ: дружба – это как …")
    ] });
  re({ id: "re-schoepfung3", lb: "re2", stufe: 3, konf: ["ev"], lz: ["re.go.01"], name: "Die Schöpfungsgeschichte", e: "🌍", farbe: "#1F8F8A", grund: "#E6F7F5",
    kurz: "Die sieben Tage der Schöpfungsgeschichte, „und es war gut“, Glaube und Naturwissenschaft", schritte: [
      info("Am Anfang", "🌍", "Die Bibel beginnt mit einer Schöpfungsgeschichte: In sieben Tagen erschafft Gott Licht, Himmel, Land und Meer, Pflanzen, Sonne und Mond, Tiere und Menschen. Am siebten Tag ruht er.",
        "Библия начинается с истории сотворения: за семь дней Бог создаёт свет, небо, сушу и море, растения, солнце и луну, животных и людей. В седьмой день Он отдыхает."),
      wahl("Welcher Satz kommt in der Schöpfungsgeschichte immer wieder vor?", "Какая фраза снова и снова повторяется в истории сотворения?", "✨",
        ["„Und Gott sah, dass es gut war.“", "«И увидел Бог, что это хорошо»", "Richtig! Die Welt wird als gut beschrieben.", "Правильно! Мир описан как хороший."],
        ["„Es war einmal …“", "«Жили-были …»", "So beginnen Märchen.", "Так начинаются сказки."],
        ["„Fertig, los!“", "«Готово, вперёд!»", "Nein.", "Нет."]),
      daumen("Die Schöpfungsgeschichte will vor allem sagen, warum die Welt wertvoll ist – Naturwissenschaft erklärt, wie sie entstanden ist.", "История сотворения хочет прежде всего сказать, почему мир ценен, – наука объясняет, как он возник.", "🔭", true,
        "Stimmt! Viele Christen sehen darin keinen Widerspruch: Beide stellen verschiedene Fragen.", "Верно! Многие христиане не видят тут противоречия: они задают разные вопросы."),
      daumen("Auch andere Kulturen haben eigene Schöpfungsgeschichten.", "У других культур тоже есть свои истории сотворения.", "🌏", true,
        "Stimmt! Menschen auf der ganzen Welt haben sich gefragt, woher alles kommt.", "Верно! Люди во всём мире спрашивали, откуда всё взялось."),
      ende("Super, {name}! Gestalte einen Schöpfungs-Kalender mit sieben Bildern.", "Супер, {name}! Сделай календарь творения из семи картинок.")
    ] });
  re({ id: "re-brot", lb: "re2", stufe: 3, konf: ["ka"], lz: ["re.fe.02", "re.go.02"], name: "Brot teilen und Stille hören", e: "🍞", farbe: "#B5651D", grund: "#FFF1E3",
    kurz: "Brot als Zeichen, Speisung der Fünftausend, Brot in der Eucharistiefeier, Samuel hört Gottes Stimme", schritte: [
      info("Brot ist mehr als Essen", "🍞", "Brot macht satt – und es ist ein Zeichen für Gemeinschaft: Man bricht es und teilt es. In der Eucharistiefeier, der heiligen Messe, erinnern katholische Christen mit Brot und Wein an Jesus.",
        "Хлеб насыщает – и это знак общения: его преломляют и делят. На Евхаристии, святой мессе, католики хлебом и вином вспоминают Иисуса."),
      wahl("Die Bibel erzählt: Viele Menschen hören Jesus zu und haben Hunger. Es gibt nur fünf Brote und zwei Fische. Was passiert?", "Библия рассказывает: многие слушают Иисуса и голодны. Есть только пять хлебов и две рыбы. Что происходит?", "🐟",
        ["Alle werden satt, und es bleibt sogar etwas übrig", "Все насыщаются, и даже остаётся", "Richtig! Die Geschichte heißt Speisung der Fünftausend.", "Правильно! Эта история называется насыщением пяти тысяч."],
        ["Niemand bekommt etwas", "Никто ничего не получает", "Nein – alle werden satt.", "Нет – все насыщаются."],
        ["Alle gehen nach Hause", "Все расходятся по домам", "Nein, Jesus lässt das Essen verteilen.", "Нет, Иисус велит раздать еду."]),
      daumen("Hilfswerke wie Misereor sammeln Geld gegen Hunger in der Welt.", "Благотворительные организации, как Misereor, собирают деньги против голода в мире.", "🌍", true,
        "Stimmt! Teilen kann man auch über große Entfernungen.", "Верно! Делиться можно и на большом расстоянии."),
      wahl("Der junge Samuel hört nachts eine Stimme. Wer ruft ihn, erzählt die Bibel?", "Юный Самуил ночью слышит голос. Кто зовёт его, рассказывает Библия?", "🌙",
        ["Gott", "Бог", "Genau! Samuel antwortet: „Rede, denn dein Diener hört.“", "Точно! Самуил отвечает: «Говори, ибо слышит раб Твой»."],
        ["Seine Mutter", "Его мать", "Nein, in der Geschichte ruft Gott.", "Нет, в истории зовёт Бог."],
        ["Ein Hund", "Собака", "Nein, Gott ruft ihn.", "Нет, его зовёт Бог."]),
      ende("Toll, {name}! Teilt beim Essen einmal ein Brot miteinander.", "Здорово, {name}! Разделите за едой один хлеб на всех.")
    ] });
  re({ id: "re-ausgegrenzte", lb: "re3", stufe: 3, lz: ["re.bi.02", "et.mi.01"], name: "Jesus und die Ausgegrenzten", e: "🌳", farbe: "#C2337A", grund: "#FFEAF3",
    kurz: "Zachäus, die Heilung eines Aussätzigen, Menschen, die anderen geholfen haben", schritte: [
      info("Zachäus auf dem Baum", "🌳", "Die Bibel erzählt: Zachäus ist Zöllner in Jericho. Niemand mag ihn, weil er die Leute betrügt. Er ist klein und klettert auf einen Baum, um Jesus zu sehen. Jesus ruft: „Heute will ich bei dir zu Gast sein!“",
        "Библия рассказывает: Закхей – мытарь в Иерихоне. Его никто не любит, потому что он обманывает людей. Он маленький и залезает на дерево, чтобы увидеть Иисуса. Иисус говорит: «Сегодня Я буду у тебя в гостях!»"),
      wahl("Was macht Zachäus nach dem Besuch von Jesus?", "Что делает Закхей после посещения Иисуса?", "🪙",
        ["Er gibt den Armen und denen, die er betrogen hat, Geld zurück", "Отдаёт деньги бедным и тем, кого обманул", "Richtig! Er verändert sein Leben.", "Правильно! Он меняет свою жизнь."],
        ["Er klettert wieder auf den Baum", "Снова лезет на дерево", "Nein, er ändert sein Verhalten.", "Нет, он меняет своё поведение."],
        ["Er betrügt noch mehr", "Обманывает ещё больше", "Nein, im Gegenteil.", "Нет, наоборот."]),
      daumen("Menschen mit der Krankheit Aussatz mussten damals außerhalb der Dörfer leben – Jesus berührte und heilte einen von ihnen.", "Больные проказой тогда должны были жить вне деревень – Иисус коснулся одного из них и исцелил.", "🤲", true,
        "Stimmt! Jesus wandte sich gerade denen zu, die ausgegrenzt waren.", "Верно! Иисус обращался именно к тем, кого отвергали."),
      zuordnen("Wer half anderen aus christlicher Überzeugung?", "Кто помогал другим из христианских убеждений?", [["kranke", "Half Kranken und Armen", "Помогал(а) больным и бедным", "🏥"], ["kinder", "Half Kindern", "Помогал детям", "🧒"]],
        [["Mutter Teresa in Indien", "Мать Тереза в Индии", "kranke"], ["Albert Schweitzer in Afrika", "Альберт Швейцер в Африке", "kranke"], ["Don Bosco, für Straßenkinder", "Дон Боско – для беспризорных детей", "kinder"]]),
      ende("Super, {name}! Gibt es in deiner Klasse jemanden, der oft allein ist? Lad ihn zum Spielen ein.", "Супер, {name}! Есть ли в классе кто-то, кто часто один? Пригласи его поиграть.")
    ] });
  re({ id: "re-mose", lb: "re3", stufe: 3, lz: ["re.bi.01"], name: "Mose und der Weg in die Freiheit", e: "🌊", farbe: "#2F86C8", grund: "#EAF4FC",
    kurz: "Mose im Körbchen, der brennende Dornbusch, Auszug aus Ägypten, Schilfmeer, Wüste, die Zehn Gebote", schritte: [
      info("Befreiung aus Ägypten", "🌊", "Die Bibel erzählt: Das Volk Israel muss in Ägypten als Sklaven arbeiten. Das Baby Mose wird in einem Körbchen im Nil versteckt und von der Tochter des Pharao gefunden. Später führt Mose das Volk in die Freiheit.",
        "Библия рассказывает: народ Израиля должен работать в Египте рабами. Младенца Моисея прячут в корзинке на Ниле, его находит дочь фараона. Позже Моисей выводит народ на свободу."),
      wahl("Wo spricht Gott zu Mose?", "Где Бог говорит с Моисеем?", "🔥",
        ["Aus einem brennenden Dornbusch, der nicht verbrennt", "Из горящего, но не сгорающего куста", "Richtig! Gott sagt: Mein Name ist „Ich bin da“.", "Правильно! Бог говорит: Моё имя – «Я есмь» (Я рядом)."],
        ["Aus dem Radio", "По радио", "Nein, damals gab es kein Radio.", "Нет, тогда не было радио."],
        ["Aus einem Brunnen", "Из колодца", "Nein, aus einem brennenden Dornbusch.", "Нет, из горящего куста."]),
      zuordnen("Was geschah wo?", "Что где случилось?", [["meer", "Am Schilfmeer", "У Чермного моря", "🌊"], ["wueste", "In der Wüste", "В пустыне", "🏜️"], ["berg", "Am Berg Sinai", "На горе Синай", "⛰️"]],
        [["Das Wasser weicht zurück, alle kommen hindurch", "Вода расступается, все проходят", "meer"], ["Gott schickt Manna zum Essen", "Бог посылает манну", "wueste"], ["Mose erhält die Zehn Gebote", "Моисей получает Десять заповедей", "berg"]]),
      daumen("Juden feiern bis heute das Pessach-Fest zur Erinnerung an die Befreiung aus Ägypten.", "Евреи до сих пор празднуют Песах в память об освобождении из Египта.", "🫓", true,
        "Stimmt! Dabei isst man ungesäuertes Brot, die Matze.", "Верно! При этом едят пресный хлеб – мацу."),
      ende("Toll, {name}! Mal die Geschichte von Mose als Bildergeschichte in vier Bildern.", "Здорово, {name}! Нарисуй историю Моисея в четырёх картинках.")
    ] });
  re({ id: "re-pfingsten", lb: "re4", stufe: 3, lz: ["re.fe.01", "re.fe.02"], name: "Pfingsten und der Gottesdienst", e: "🕊️", farbe: "#E0574A", grund: "#FFECE8",
    kurz: "Jesus im Mittelpunkt des Kirchenjahres, Pfingsten als Geburtstag der Kirche, Teile des Gottesdienstes, Kirchenfarben", schritte: [
      info("Der Geburtstag der Kirche", "🕊️", "Die Bibel erzählt: 50 Tage nach Ostern sind die Jünger zusammen. Ein Brausen wie Sturm kommt, Feuerzungen erscheinen, und sie sprechen mutig in vielen Sprachen von Jesus. Christen nennen Pfingsten den Geburtstag der Kirche.",
        "Библия рассказывает: через 50 дней после Пасхи ученики вместе. Приходит шум, как от бури, появляются огненные языки, и они смело говорят об Иисусе на многих языках. Христиане называют Пятидесятницу днём рождения Церкви."),
      zuordnen("Welches Zeichen gehört zu Pfingsten?", "Какой знак относится к Пятидесятнице?", [["ja", "Pfingstzeichen", "Знак Пятидесятницы", "🔥"], ["nein", "Gehört zu einem anderen Fest", "Другой праздник", "🎄"]],
        [["Feuer", "Огонь", "ja"], ["Sturm", "Буря", "ja"], ["Taube", "Голубь", "ja"], ["Tannenbaum", "Ёлка", "nein"]]),
      wahl("Welche Farbe hat das Tuch auf dem Altar meist an Pfingsten?", "Какого цвета ткань на алтаре обычно на Пятидесятницу?", "🎨",
        ["Rot", "Красный", "Richtig! Rot steht für Feuer und Geist. Im Advent ist es violett, an Weihnachten und Ostern weiß.", "Правильно! Красный – огонь и Дух. В Адвент – фиолетовый, на Рождество и Пасху – белый."],
        ["Schwarz", "Чёрный", "Schwarz ist es höchstens an Trauertagen.", "Чёрный – разве что в дни траура."],
        ["Gelb-grün gestreift", "В жёлто-зелёную полоску", "Nein, Rot.", "Нет, красный."]),
      daumen("In jedem Gottesdienst gibt es Teile, die immer gleich sind – wie das Vaterunser – und Teile, die wechseln, wie Lieder und Predigt.", "В каждом богослужении есть неизменные части – как «Отче наш» – и меняющиеся, как песни и проповедь.", "⛪", true,
        "Stimmt! Im Mittelpunkt des ganzen Kirchenjahres steht Jesus Christus.", "Верно! В центре всего церковного года – Иисус Христос."),
      ende("Super, {name}! Finde drei Redewendungen mit Feuer oder Wind, zum Beispiel „Feuer und Flamme sein“.", "Супер, {name}! Найди три выражения с огнём или ветром, например «гореть энтузиазмом».")
    ] });
  re({ id: "re-emmaus", lb: "re4", stufe: 3, konf: ["ka"], lz: ["re.fe.01"], name: "Verkündigung, Weizenkorn und Emmaus", e: "🌾", farbe: "#E0A800", grund: "#FFF7D6",
    kurz: "Der Engel bei Maria, das Weizenkorn als Bild für Ostern, die Jünger auf dem Weg nach Emmaus", schritte: [
      info("Der Engel bei Maria", "👼", "Die Bibel erzählt: Der Engel Gabriel kommt zu Maria und sagt ihr, dass sie ein Kind bekommen wird: Jesus. Katholische Christen feiern das als Fest der Verkündigung des Herrn – neun Monate vor Weihnachten.",
        "Библия рассказывает: ангел Гавриил приходит к Марии и говорит, что у неё родится ребёнок – Иисус. Католики празднуют это как Благовещение – за девять месяцев до Рождества."),
      wahl("Ein Weizenkorn wird in die Erde gelegt, es vergeht – und daraus wächst eine neue Ähre. Wofür ist das ein Bild?", "Пшеничное зерно кладут в землю, оно исчезает – и вырастает новый колос. Образом чего это служит?", "🌾",
        ["Für Ostern: aus dem Tod wächst neues Leben", "Пасхи: из смерти вырастает новая жизнь", "Richtig! So deuten Christen Tod und Auferstehung Jesu.", "Правильно! Так христиане толкуют смерть и воскресение Иисуса."],
        ["Fürs Brotbacken", "Выпечки хлеба", "Das auch – aber hier ist es ein Bild für Ostern.", "И это тоже – но здесь это образ Пасхи."],
        ["Für den Winter", "Зимы", "Nein, für Ostern.", "Нет, Пасхи."]),
      wahl("Zwei Jünger gehen nach Emmaus. Woran erkennen sie Jesus?", "Два ученика идут в Эммаус. По чему они узнают Иисуса?", "🍞",
        ["Als er das Brot bricht", "Когда Он преломляет хлеб", "Genau! Die Mahlgemeinschaft öffnet ihnen die Augen.", "Точно! Общая трапеза открывает им глаза."],
        ["An seinem Auto", "По Его машине", "Nein, damals gab es keine Autos.", "Нет, тогда не было машин."],
        ["Gar nicht", "Никак", "Doch – beim Brotbrechen.", "Узнают – при преломлении хлеба."]),
      ende("Toll, {name}! Säe ein paar Körner in einen Topf und beobachte, was wächst.", "Здорово, {name}! Посей несколько зёрен в горшок и наблюдай, что вырастет.")
    ] });

  // ==================== Klasse 4 ====================
  re({ id: "re-gebote", lb: "re1", stufe: 4, konf: ["ev"], lz: ["re.mi.01", "et.we.01"], name: "Die Zehn Gebote", e: "📜", farbe: "#8A6D3B", grund: "#F7F0E3",
    kurz: "Die Zehn Gebote als Hilfe für ein gutes Leben, Freiheit und Verantwortung, Gebote und Kinderrechte", schritte: [
      info("Regeln für die Freiheit", "📜", "Die Bibel erzählt: Nach der Befreiung aus Ägypten gibt Gott dem Volk Israel die Zehn Gebote. Sie beginnen mit: „Ich bin der Herr, dein Gott, der dich befreit hat.“ Die Gebote sollen helfen, die Freiheit zu bewahren.",
        "Библия рассказывает: после освобождения из Египта Бог даёт народу Израиля Десять заповедей. Они начинаются словами: «Я Господь, Бог твой, который освободил тебя». Заповеди должны помочь сохранить свободу."),
      zuordnen("Ist das eines der Zehn Gebote?", "Это одна из Десяти заповедей?", [["ja", "Ja", "Да", "✅"], ["nein", "Nein", "Нет", "❌"]],
        [["Du sollst nicht stehlen", "Не кради", "ja"], ["Du sollst Vater und Mutter ehren", "Почитай отца и мать", "ja"], ["Du sollst jeden Tag Sport machen", "Каждый день занимайся спортом", "nein"]]),
      daumen("Man kann die Gebote auch so lesen: „Du wirst nicht stehlen, weil du frei bist.“", "Заповеди можно прочитать и так: «Ты не будешь красть, потому что ты свободен».", "🕊️", true,
        "Stimmt! Manche Übersetzungen klingen wie ein Versprechen statt wie ein Befehl.", "Верно! Некоторые переводы звучат как обещание, а не приказ."),
      wahl("Was haben Gebote, Grundgesetz und Kinderrechte gemeinsam?", "Что общего у заповедей, Основного закона и прав ребёнка?", "⚖️",
        ["Sie schützen das Zusammenleben und die Schwachen", "Они защищают совместную жизнь и слабых", "Genau! Freiheit braucht Verantwortung.", "Точно! Свободе нужна ответственность."],
        ["Sie sind alle 2000 Jahre alt", "Им всем 2000 лет", "Nein, Grundgesetz und Kinderrechte sind viel jünger.", "Нет, Основной закон и права ребёнка гораздо моложе."],
        ["Sie gelten nur für Erwachsene", "Действуют только для взрослых", "Nein, sie betreffen alle.", "Нет, они касаются всех."]),
      ende("Super, {name}! Welches Gebot ist dir am wichtigsten? Gestalte es als Bild.", "Супер, {name}! Какая заповедь для тебя важнее всего? Нарисуй её.")
    ] });
  re({ id: "re-zeit-abschied", lb: "re1", stufe: 4, konf: ["ev"], lz: ["re.mi.01", "et.we.04"], name: "Zeit, Abschied und Hoffnung", e: "🕯️", farbe: "#7B55B8", grund: "#F1EAFF",
    kurz: "Hoch- und Tiefzeiten, Werden und Vergehen, Abschied nehmen, Trost, christliche Hoffnung", schritte: [
      info("Alles hat seine Zeit", "⏳", "Im Leben gibt es frohe und traurige Zeiten: lachen und weinen, ankommen und Abschied nehmen. In der Bibel steht: Alles hat seine Zeit.",
        "В жизни бывают радостные и грустные времена: смеяться и плакать, приходить и прощаться. В Библии сказано: всему своё время."),
      wahl("Wenn jemand gestorben ist – was kann trösten?", "Если кто-то умер – что может утешить?", "🤍",
        ["Erinnerungen teilen und mit Vertrauten reden", "Делиться воспоминаниями и говорить с близкими", "Richtig! Traurig sein ist in Ordnung. Sprich mit jemandem, dem du vertraust.", "Правильно! Грустить – это нормально. Поговори с тем, кому доверяешь."],
        ["So tun, als wäre nichts", "Делать вид, что ничего не случилось", "Gefühle zu verstecken macht es oft schwerer.", "Прятать чувства часто ещё тяжелее."],
        ["Allein bleiben und mit niemandem reden", "Оставаться одному и ни с кем не говорить", "Reden hilft – du musst damit nicht allein sein.", "Разговор помогает – ты не должен быть с этим один."]),
      daumen("Christen hoffen, dass der Tod nicht das Ende ist – weil sie an die Auferstehung von Jesus glauben.", "Христиане надеются, что смерть – не конец, потому что верят в воскресение Иисуса.", "🌅", true,
        "Stimmt! Darum stehen auf vielen Gräbern ein Kreuz und eine Kerze als Zeichen der Hoffnung.", "Верно! Поэтому на многих могилах стоят крест и свеча – знаки надежды."),
      ende("Danke fürs Nachdenken, {name}. Wenn dich etwas traurig macht: Rede darüber – auch die Nummer gegen Kummer hört zu: 116 111.", "Спасибо, что подумал, {name}. Если тебе грустно, поговори об этом – и «телефон доверия» выслушает: 116 111.")
    ] });
  re({ id: "re-verantwortung", lb: "re1", stufe: 4, konf: ["ka"], lz: ["re.mi.01", "et.we.01"], name: "Mut, Verantwortung und Kinderrechte", e: "💪", farbe: "#E0574A", grund: "#FFECE8",
    kurz: "Talente und Selbstvertrauen, Verantwortung für Menschen und Natur, Gerechtigkeit, Kinderrechte", schritte: [
      info("Jeder hat Talente", "💪", "Jesus erzählt ein Gleichnis von anvertrauten Talenten: Wer seine Gaben einsetzt, kann damit Gutes bewirken. Christen glauben: Gott traut jedem Menschen etwas zu.",
        "Иисус рассказывает притчу о талантах: кто использует свои дары, может сделать много хорошего. Христиане верят: Бог доверяет каждому человеку."),
      zuordnen("Verantwortung für wen?", "Ответственность за кого?", [["menschen", "Für Menschen", "За людей", "🧑‍🤝‍🧑"], ["natur", "Für die Natur", "За природу", "🌳"]],
        [["Dem kleinen Bruder beim Lesen helfen", "Помочь младшему брату читать", "menschen"], ["Licht ausmachen, um Strom zu sparen", "Выключать свет, чтобы экономить", "natur"], ["Müll vom Spielplatz aufheben", "Поднять мусор на площадке", "natur"]]),
      daumen("Die Kinderrechte werden überall auf der Welt gut eingehalten.", "Права ребёнка везде в мире хорошо соблюдаются.", "🌍", false,
        "Leider nein! Viele Kinder müssen arbeiten oder können nicht zur Schule. Hilfswerke wie Misereor und Adveniat setzen sich für sie ein.", "К сожалению, нет! Многим детям приходится работать, или они не могут ходить в школу. За них выступают Misereor и Adveniat."),
      wahl("In deiner Klasse wird ein Kind im Chat gemobbt. Was ist verantwortlich?", "В классе ребёнка травят в чате. Что будет ответственно?", "📱",
        ["Nicht mitmachen und Erwachsenen Bescheid sagen", "Не участвовать и сообщить взрослым", "Richtig! Das ist gerecht und mutig.", "Правильно! Это справедливо и смело."],
        ["Mitlachen", "Смеяться вместе", "Nein, das verletzt.", "Нет, это ранит."],
        ["Weiterleiten", "Переслать дальше", "Nein, das macht es schlimmer.", "Нет, это делает хуже."]),
      ende("Super, {name}! Was kannst du richtig gut? Wofür könntest du dein Talent einsetzen?", "Супер, {name}! Что ты умеешь очень хорошо? Для чего ты мог бы использовать свой талант?")
    ] });
  re({ id: "re-islam", lb: "re1", stufe: 4, lz: ["re.mi.02", "et.we.02"], name: "Der Islam", e: "☪️", farbe: "#1F8F8A", grund: "#E6F7F5",
    kurz: "Glaube an Allah, Koran, Moschee, die fünf Säulen, Feste, Muslime in Deutschland", schritte: [
      info("Muslime glauben an einen Gott", "☪️", "Muslime glauben an den einen Gott – auf Arabisch „Allah“. Ihre heilige Schrift ist der Koran, ihr Prophet heißt Mohammed. Sie beten in der Moschee. Viele Muslime leben auch in Deutschland.",
        "Мусульмане верят в единого Бога – по-арабски «Аллах». Их священная книга – Коран, их пророк – Мухаммад. Они молятся в мечети. Многие мусульмане живут и в Германии."),
      zuordnen("Die fünf Säulen des Islam: Was gehört dazu?", "Пять столпов ислама: что к ним относится?", [["ja", "Gehört dazu", "Относится", "✅"], ["nein", "Gehört nicht dazu", "Не относится", "❌"]],
        [["Beten (fünfmal am Tag)", "Молитва (пять раз в день)", "ja"], ["Fasten im Ramadan", "Пост в Рамадан", "ja"], ["Den Armen geben", "Давать бедным", "ja"], ["Eine Kerze am Adventskranz", "Свеча на венке Адвента", "nein"]]),
      wahl("Wohin pilgern viele Muslime einmal im Leben?", "Куда многие мусульмане совершают паломничество раз в жизни?", "🕋",
        ["Nach Mekka", "В Мекку", "Richtig! Die Pilgerfahrt ist eine der fünf Säulen.", "Правильно! Паломничество – один из пяти столпов."],
        ["Nach Rom", "В Рим", "Nach Rom pilgern eher katholische Christen.", "В Рим скорее паломничают католики."],
        ["Zum Nordpol", "На Северный полюс", "Nein, nach Mekka.", "Нет, в Мекку."]),
      daumen("Am Ende des Fastenmonats Ramadan feiern viele Muslime das Zuckerfest.", "В конце поста Рамадан многие мусульмане празднуют Ураза-байрам.", "🍬", true,
        "Stimmt! Man besucht sich, isst zusammen und beschenkt die Kinder.", "Верно! Ходят в гости, едят вместе и дарят детям подарки."),
      ende("Toll, {name}! Vielleicht kann ein muslimisches Kind oder eine Familie von ihren Festen erzählen.", "Здорово, {name}! Может быть, мусульманский ребёнок или семья расскажут о своих праздниках.")
    ] });
  re({ id: "re-beten", lb: "re2", stufe: 4, lz: ["re.go.02"], name: "Mit Gott reden: Psalmen und Gebete", e: "🙏", farbe: "#2F6FD6", grund: "#EAF2FF",
    kurz: "Danken, bitten, klagen, loben, Morgen-, Abend- und Tischgebet, Psalmen selbst schreiben, Sonnengesang", schritte: [
      info("Viele Arten zu beten", "🙏", "Menschen sprechen mit Gott, wenn sie froh oder traurig sind: Sie danken, bitten, klagen oder loben. In der Bibel stehen 150 Psalmen – Gebete und Lieder voller Gefühle.",
        "Люди говорят с Богом, когда им радостно или грустно: благодарят, просят, жалуются или славят. В Библии 150 псалмов – молитв и песен, полных чувств."),
      zuordnen("Was für ein Gebet ist das?", "Что это за молитва?", [["dank", "Dank", "Благодарность", "🙏"], ["bitte", "Bitte", "Просьба", "🤲"], ["klage", "Klage", "Жалоба", "😢"]],
        [["Danke für das gute Essen", "Спасибо за хорошую еду", "dank"], ["Bitte beschütze meine Oma", "Пожалуйста, сохрани мою бабушку", "bitte"], ["Warum ist mein Hund gestorben?", "Почему умерла моя собака?", "klage"]]),
      daumen("Franz von Assisi hat ein Lied geschrieben, das Gott für Sonne, Mond, Wasser und Erde lobt – den Sonnengesang.", "Франциск Ассизский написал песнь, славящую Бога за солнце, луну, воду и землю, – Гимн брату Солнцу.", "☀️", true,
        "Stimmt! Auch Musik wie Haydns „Schöpfung“ oder Vivaldis „Vier Jahreszeiten“ staunt über die Welt.", "Верно! И музыка, как «Сотворение мира» Гайдна или «Времена года» Вивальди, восхищается миром."),
      wahl("Ein Tischgebet spricht man …", "Застольную молитву говорят …", "🍽️",
        ["vor oder nach dem Essen", "до или после еды", "Richtig! Es gibt auch Morgen- und Abendgebete.", "Правильно! Бывают ещё утренние и вечерние молитвы."],
        ["nur an Weihnachten", "только на Рождество", "Nein, bei jedem Essen, wenn man möchte.", "Нет, за любой едой, если хочется."],
        ["beim Sport", "во время спорта", "Nein, beim Essen.", "Нет, за едой."]),
      ende("Super, {name}! Schreib einen eigenen kleinen Psalm: Wofür bist du dankbar?", "Супер, {name}! Напиши свой маленький псалом: за что ты благодарен?")
    ] });
  re({ id: "re-symbole", lb: "re2", stufe: 4, lz: ["re.go.01", "et.we.03"], name: "Baum, Weg und Labyrinth", e: "🌳", farbe: "#3BAA5C", grund: "#E8F7EC",
    kurz: "Symbole für das Leben: der Baum, der Weg, die Sonne, das Labyrinth", schritte: [
      info("Bilder für das Leben", "🌳", "Ein Baum wurzelt fest, wächst und trägt Früchte. In der Bibel heißt es: Ein Mensch, der Gott vertraut, ist wie ein Baum am Wasser. Auch der Weg und die Sonne sind Bilder für das Leben.",
        "Дерево крепко укоренено, растёт и приносит плоды. В Библии сказано: человек, который доверяет Богу, как дерево у воды. Путь и солнце тоже образы жизни."),
      wahl("„Er ist standfest wie ein Baum“ – was bedeutet das?", "«Он стоек, как дерево» – что это значит?", "🌲",
        ["Er lässt sich nicht so leicht umwerfen", "Его нелегко сбить с толку", "Richtig! Gute Wurzeln geben Halt: Familie, Freunde, Glaube.", "Правильно! Хорошие корни дают опору: семья, друзья, вера."],
        ["Er hat grüne Haare", "У него зелёные волосы", "Nein, es ist ein Sprachbild.", "Нет, это образ."],
        ["Er bewegt sich nie", "Он никогда не двигается", "Nein, es geht um inneren Halt.", "Нет, речь о внутренней опоре."]),
      wahl("Was ist das Besondere an einem Labyrinth?", "Что особенного в лабиринте?", "🌀",
        ["Es gibt nur einen Weg – er führt sicher zur Mitte", "Есть только один путь – он верно ведёт к центру", "Genau! Anders als im Irrgarten kann man sich nicht verlaufen. Es ist ein Bild für die Suche nach der Mitte des Lebens.", "Точно! В отличие от путаницы, заблудиться нельзя. Это образ поиска центра жизни."],
        ["Man verläuft sich immer", "Всегда заблудишься", "Das ist ein Irrgarten – ein Labyrinth hat nur einen Weg.", "Это путаница – у лабиринта один путь."],
        ["Es hat keinen Eingang", "У него нет входа", "Doch – und einen einzigen Weg zur Mitte.", "Есть – и один путь к центру."]),
      daumen("Ein Weg mit Höhen und Tiefen ist ein Bild für das Leben.", "Путь с подъёмами и спусками – образ жизни.", "🛤️", true,
        "Stimmt! Christen glauben, dass Gott sie auf ihrem Weg begleitet.", "Верно! Христиане верят, что Бог сопровождает их на пути."),
      ende("Toll, {name}! Mal deinen Lebensbaum: Was sind deine Wurzeln, was deine Früchte?", "Здорово, {name}! Нарисуй своё дерево жизни: какие у тебя корни, какие плоды?")
    ] });
  re({ id: "re-jakob", lb: "re3", stufe: 4, lz: ["re.bi.01"], name: "Jakob und Esau", e: "🪜", farbe: "#B5651D", grund: "#FFF1E3",
    kurz: "Zwillingsbrüder, das Linsengericht, der erschlichene Segen, die Himmelsleiter, Versöhnung", schritte: [
      info("Zwei ungleiche Brüder", "🪜", "Die Bibel erzählt: Jakob und Esau sind Zwillinge. Esau ist Jäger, Jakob bleibt lieber bei den Zelten. Für ein Linsengericht kauft Jakob dem hungrigen Esau das Recht des Erstgeborenen ab.",
        "Библия рассказывает: Иаков и Исав – близнецы. Исав – охотник, Иаков предпочитает оставаться у шатров. За чечевичную похлёбку Иаков покупает у голодного Исава право первородства."),
      wahl("Wie bekommt Jakob den Segen seines blinden Vaters Isaak?", "Как Иаков получает благословение слепого отца Исаака?", "🧤",
        ["Er verkleidet sich als Esau – mit Fell an den Armen", "Переодевается Исавом – с шкурой на руках", "Richtig! Das war Betrug – danach muss Jakob vor Esau fliehen.", "Правильно! Это был обман – потом Иаков бежит от Исава."],
        ["Er bittet höflich darum", "Вежливо просит", "Nein, er betrügt den Vater.", "Нет, он обманывает отца."],
        ["Er gewinnt ein Wettrennen", "Выигрывает гонку", "Nein, er verkleidet sich.", "Нет, он переодевается."]),
      daumen("Auf der Flucht träumt Jakob von einer Leiter bis in den Himmel – Gott verspricht ihm, ihn zu begleiten.", "В бегстве Иакову снится лестница до неба – Бог обещает быть с ним.", "🌙", true,
        "Stimmt! Christen lesen darin: Gottes Zusage gilt sogar dem, der Fehler gemacht hat.", "Верно! Христиане видят в этом: обещание Бога действует даже для того, кто ошибся."),
      wahl("Wie endet die Geschichte der Brüder?", "Чем заканчивается история братьев?", "🤗",
        ["Sie versöhnen sich und umarmen sich", "Они мирятся и обнимаются", "Genau! Nach vielen Jahren gibt es einen neuen Anfang.", "Точно! Спустя много лет – новое начало."],
        ["Sie sehen sich nie wieder", "Больше никогда не видятся", "Doch – sie treffen sich wieder.", "Видятся – они встречаются снова."],
        ["Esau rächt sich", "Исав мстит", "Nein, Esau verzeiht.", "Нет, Исав прощает."]),
      ende("Super, {name}! Erzähl die Geschichte aus der Sicht von Esau – wie fühlt er sich?", "Супер, {name}! Расскажи историю глазами Исава – что он чувствует?")
    ] });
  re({ id: "re-bibel", lb: "re3", stufe: 4, lz: ["re.bi.03"], name: "Die Bibel – eine ganze Bibliothek", e: "📖", farbe: "#8E5BC8", grund: "#F3ECFF",
    kurz: "Altes und Neues Testament, von mündlich zu schriftlich, Klöster, Buchdruck, Übersetzungen, Bibelstellen finden", schritte: [
      info("Ein Buch aus vielen Büchern", "📖", "„Bibel“ kommt vom griechischen Wort für „Bücher“. Sie ist wie eine Bibliothek: Das Alte Testament erzählt aus der Zeit vor Jesus, das Neue Testament von Jesus und den ersten Christen.",
        "«Библия» происходит от греческого слова «книги». Она как библиотека: Ветхий Завет рассказывает о времени до Иисуса, Новый Завет – об Иисусе и первых христианах."),
      zuordnen("Altes oder Neues Testament?", "Ветхий или Новый Завет?", [["alt", "Altes Testament", "Ветхий Завет", "📜"], ["neu", "Neues Testament", "Новый Завет", "✝️"]],
        [["Noah und die Arche", "Ной и ковчег", "alt"], ["Mose und die Zehn Gebote", "Моисей и заповеди", "alt"], ["Die Weihnachtsgeschichte", "Рождественская история", "neu"], ["Pfingsten", "Пятидесятница", "neu"]]),
      wahl("Wie wurden Bibeln vor der Erfindung des Buchdrucks hergestellt?", "Как делали Библии до изобретения книгопечатания?", "✍️",
        ["Mönche schrieben sie in Klöstern von Hand ab", "Монахи переписывали их от руки в монастырях", "Richtig! Das dauerte oft Jahre. Um 1450 erfand Johannes Gutenberg den Buchdruck.", "Правильно! Это часто длилось годами. Около 1450 года Иоганн Гутенберг изобрёл книгопечатание."],
        ["Mit dem Drucker", "На принтере", "Drucker gab es damals noch nicht.", "Принтеров тогда ещё не было."],
        ["Gar nicht", "Никак", "Doch – sie wurden abgeschrieben.", "Делали – их переписывали."]),
      wahl("Was bedeutet die Angabe „Lukas 2, 1-20“?", "Что значит ссылка «Лука 2, 1-20»?", "🔎",
        ["Buch Lukas, Kapitel 2, Verse 1 bis 20", "Книга Луки, глава 2, стихи 1–20", "Genau! So findet man jede Stelle in der Bibel wieder.", "Точно! Так можно найти любое место в Библии."],
        ["Seite 2, Zeile 1 bis 20", "Страница 2, строки 1–20", "Nein, Kapitel und Verse – nicht Seiten.", "Нет, главы и стихи – не страницы."],
        ["Lukas ist 2 Jahre alt", "Луке 2 года", "Nein, es ist eine Bibelstelle.", "Нет, это место в Библии."]),
      ende("Toll, {name}! Such in einer Kinderbibel die Geschichte von Zachäus.", "Здорово, {name}! Найди в детской Библии историю Закхея.")
    ] });
  re({ id: "re-mahl", lb: "re3", stufe: 4, konf: ["ev"], lz: ["re.bi.02", "re.fe.02"], name: "Miteinander essen: das Mahl in der Bibel", e: "🍽️", farbe: "#E0A800", grund: "#FFF7D6",
    kurz: "Gleichnis vom Festmahl, Speisung der Fünftausend, das letzte Abendmahl, alle sind eingeladen", schritte: [
      info("Alle sind eingeladen", "🍽️", "In der Bibel ist gemeinsames Essen etwas Besonderes. Jesus erzählt von einem Festmahl, zu dem am Ende alle eingeladen werden – auch Arme und Kranke. Mit seinen Jüngern feiert er das letzte Abendmahl.",
        "В Библии совместная трапеза – нечто особенное. Иисус рассказывает о пире, на который в конце приглашают всех – и бедных, и больных. С учениками Он празднует Тайную вечерю."),
      wahl("Im Gleichnis vom Festmahl sagen die eingeladenen Gäste ab. Wen lädt der Gastgeber dann ein?", "В притче о пире приглашённые отказываются. Кого тогда зовёт хозяин?", "🎉",
        ["Arme, Kranke und Fremde von der Straße", "Бедных, больных и чужих с улицы", "Richtig! Bei Gott ist Platz für alle.", "Правильно! У Бога есть место для всех."],
        ["Niemanden", "Никого", "Nein, er lädt andere ein.", "Нет, он зовёт других."],
        ["Nur Könige", "Только королей", "Nein, gerade die, die sonst niemand einlädt.", "Нет, именно тех, кого никто не зовёт."]),
      daumen("Im Abendmahl erinnern evangelische Christen mit Brot und Wein (oder Saft) an das letzte Mahl von Jesus.", "На Причастии евангелические христиане хлебом и вином (или соком) вспоминают последнюю трапезу Иисуса.", "🍇", true,
        "Stimmt! Katholische Christen nennen es Eucharistie oder Kommunion.", "Верно! Католики называют это Евхаристией или Причастием."),
      ende("Super, {name}! Plant ein Essen, zu dem ihr jemanden einladet, der sonst allein ist.", "Супер, {name}! Спланируйте обед, на который пригласите того, кто обычно один.")
    ] });
  re({ id: "re-heilungen", lb: "re3", stufe: 4, konf: ["ka"], lz: ["re.bi.02"], name: "Jesus setzt sich für andere ein", e: "🤲", farbe: "#C2337A", grund: "#FFEAF3",
    kurz: "Heilung eines Aussätzigen, der Hauptmann von Kafarnaum, Jesus und die Heilige Schrift, Nachfolge heute", schritte: [
      info("Jesus hilft Benachteiligten", "🤲", "Die Bibel erzählt, wie Jesus sich Menschen zuwendet, die krank oder ausgegrenzt sind. Er berührt einen Aussätzigen, den sonst niemand anfasst, und macht ihn gesund.",
        "Библия рассказывает, как Иисус обращается к больным и отверженным. Он касается прокажённого, к которому никто не прикасается, и исцеляет его."),
      wahl("Ein römischer Hauptmann bittet Jesus, seinen kranken Diener gesund zu machen. Was ist besonders?", "Римский сотник просит Иисуса исцелить его больного слугу. Что особенного?", "🛡️",
        ["Er vertraut, dass ein Wort von Jesus genügt", "Он верит, что достаточно слова Иисуса", "Richtig! Jesus lobt sein großes Vertrauen – obwohl er ein Fremder ist.", "Правильно! Иисус хвалит его большое доверие – хотя он чужой."],
        ["Er will Jesus verhaften", "Он хочет арестовать Иисуса", "Nein, er bittet um Hilfe.", "Нет, он просит о помощи."],
        ["Er ist selbst krank", "Он сам болен", "Nein, sein Diener ist krank.", "Нет, болен его слуга."]),
      daumen("Schon als Zwölfjähriger sprach Jesus im Tempel mit den Gelehrten über die Heilige Schrift.", "Уже двенадцатилетним Иисус беседовал в Храме с учёными о Писании.", "📜", true,
        "Stimmt! Seine Eltern suchten ihn drei Tage lang.", "Верно! Родители искали Его три дня."),
      ende("Super, {name}! Wo könntest du dich heute für jemanden einsetzen?", "Супер, {name}! За кого ты мог бы сегодня заступиться?")
    ] });
  re({ id: "re-kirchenjahr", lb: "re4", stufe: 4, lz: ["re.fe.01"], name: "Das Kirchenjahr", e: "🗓️", farbe: "#2F86C8", grund: "#EAF4FC",
    kurz: "Weihnachtsfestkreis, Osterfestkreis, Zeit im Jahreskreis, der Sonntag, Kirchenfarben", schritte: [
      info("Ein Jahr voller Feste", "🗓️", "Das Kirchenjahr beginnt nicht am 1. Januar, sondern am ersten Advent. Es hat zwei große Festkreise: den Weihnachtsfestkreis und den Osterfestkreis. Dazwischen liegt die übrige Zeit im Jahr.",
        "Церковный год начинается не 1 января, а в первое воскресенье Адвента. У него два больших праздничных круга: рождественский и пасхальный. Между ними – остальное время года."),
      wahl("Womit beginnt das Kirchenjahr?", "С чего начинается церковный год?", "🕯️",
        ["Mit dem 1. Advent", "С первого воскресенья Адвента", "Richtig! Zuerst wartet man auf Weihnachten.", "Правильно! Сначала ждут Рождества."],
        ["Mit Silvester", "С Нового года", "Das ist der Beginn des Kalenderjahres.", "Это начало календарного года."],
        ["Mit Ostern", "С Пасхи", "Ostern ist das wichtigste Fest – aber nicht der Anfang.", "Пасха – главный праздник, но не начало."]),
      zuordnen("Zu welchem Festkreis gehört es?", "К какому кругу относится?", [["weihnachten", "Weihnachtsfestkreis", "Рождественский круг", "🎄"], ["ostern", "Osterfestkreis", "Пасхальный круг", "🐣"]],
        [["Advent", "Адвент", "weihnachten"], ["Heilige Drei Könige", "Богоявление (три царя)", "weihnachten"], ["Fastenzeit", "Великий пост", "ostern"], ["Pfingsten", "Пятидесятница", "ostern"]]),
      daumen("Der Sonntag erinnert Christen jede Woche an Ostern – darum ist er ein Ruhe- und Feiertag.", "Воскресенье каждую неделю напоминает христианам о Пасхе – поэтому это день отдыха и праздника.", "☀️", true,
        "Stimmt! Für Juden ist der Sabbat der Ruhetag.", "Верно! Для иудеев день покоя – шаббат."),
      ende("Toll, {name}! Gestalte einen Kreis mit den Festen des Kirchenjahres.", "Здорово, {name}! Нарисуй круг с праздниками церковного года.")
    ] });
  re({ id: "re-oekumene", lb: "re4", stufe: 4, lz: ["re.fe.02"], name: "Evangelisch und katholisch", e: "🤝", farbe: "#7B55B8", grund: "#F1EAFF",
    kurz: "Gemeinsamkeiten und Unterschiede, Taufe, Abendmahl und Kommunion, Konfirmation und Firmung, Ökumene", schritte: [
      info("Zwei Kirchen, ein Glaube an Jesus", "🤝", "Evangelische und katholische Christen glauben beide an Jesus Christus, lesen die Bibel, beten das Vaterunser und taufen. In manchem feiern sie aber verschieden.",
        "Евангелические и католические христиане оба верят в Иисуса Христа, читают Библию, молятся «Отче наш» и крестят. Но кое-что они празднуют по-разному."),
      zuordnen("Eher evangelisch oder eher katholisch?", "Скорее евангелическое или католическое?", [["ev", "Evangelisch", "Евангелическое", "📘"], ["ka", "Katholisch", "Католическое", "📕"]],
        [["Konfirmation", "Конфирмация", "ev"], ["Reformationstag", "День Реформации", "ev"], ["Firmung", "Конфирмация (миропомазание)", "ka"], ["Weihwasserbecken am Eingang", "Чаша со святой водой у входа", "ka"]]),
      wahl("Was verbindet alle christlichen Kirchen?", "Что объединяет все христианские церкви?", "💧",
        ["Die Taufe", "Крещение", "Richtig! Die Taufe wird gegenseitig anerkannt.", "Правильно! Крещение взаимно признаётся."],
        ["Der Papst", "Папа Римский", "Der Papst ist Oberhaupt der katholischen Kirche – nicht der evangelischen.", "Папа – глава католической церкви, но не евангелической."],
        ["Gar nichts", "Ничего", "Doch – zum Beispiel die Taufe und das Vaterunser.", "Объединяет – например, крещение и «Отче наш»."]),
      daumen("Ökumene heißt: Christen verschiedener Kirchen beten, feiern und helfen gemeinsam.", "Экуменизм значит: христиане разных церквей вместе молятся, празднуют и помогают.", "🌍", true,
        "Stimmt! Zum Beispiel bei ökumenischen Gottesdiensten in der Schule.", "Верно! Например, на экуменических богослужениях в школе."),
      ende("Super, {name}! Wenn ihr in einer anderen Kirche seid: Was ist dort anders, was gleich?", "Супер, {name}! Если будете в другой церкви: что там иначе, а что так же?")
    ] });
  re({ id: "re-reformation", lb: "re4", stufe: 4, konf: ["ev"], lz: ["re.fe.01"], name: "Martin Luther und der Reformationstag", e: "🌹", farbe: "#E0574A", grund: "#FFECE8",
    kurz: "Leben im Mittelalter, Luthers Thesen 1517, die Bibel auf Deutsch, Lutherrose, Buß- und Bettag", schritte: [
      info("Ein Mönch verändert die Kirche", "🌹", "Martin Luther war Mönch und Professor in Wittenberg. 1517 veröffentlichte er Thesen gegen Missstände in der Kirche. Daraus entstand die evangelische Kirche. Daran erinnert der Reformationstag am 31. Oktober – in Sachsen ein Feiertag.",
        "Мартин Лютер был монахом и профессором в Виттенберге. В 1517 году он опубликовал тезисы против злоупотреблений в церкви. Из этого возникла евангелическая церковь. Об этом напоминает День Реформации 31 октября – в Саксонии выходной."),
      wahl("Was tat Luther auf der Wartburg?", "Что Лютер делал в Вартбурге?", "🏰",
        ["Er übersetzte das Neue Testament ins Deutsche", "Перевёл Новый Завет на немецкий", "Richtig! So konnten viel mehr Menschen die Bibel selbst lesen.", "Правильно! Так гораздо больше людей могли сами читать Библию."],
        ["Er baute die Burg", "Построил замок", "Nein, die Burg war viel älter.", "Нет, замок был гораздо старше."],
        ["Er spielte Fußball", "Играл в футбол", "Nein, er übersetzte die Bibel.", "Нет, он переводил Библию."]),
      daumen("Die Lutherrose ist das Wappen von Martin Luther – ein Kreuz in einem Herz in einer Rose.", "Роза Лютера – герб Мартина Лютера: крест в сердце внутри розы.", "🌹", true,
        "Stimmt! Man findet sie heute an vielen evangelischen Kirchen.", "Верно! Её и сегодня можно увидеть на многих евангелических церквях."),
      daumen("In Sachsen ist auch der Buß- und Bettag im November ein Feiertag.", "В Саксонии День покаяния и молитвы в ноябре – тоже выходной.", "🗓️", true,
        "Stimmt! Sachsen ist das einzige Bundesland, in dem er ein gesetzlicher Feiertag ist.", "Верно! Саксония – единственная земля, где это официальный выходной."),
      ende("Toll, {name}! Schau, ob es in deinem Ort zum Reformationstag Reformationsbrötchen gibt.", "Здорово, {name}! Посмотри, есть ли у вас ко Дню Реформации особые булочки.")
    ] });
  re({ id: "re-passion", lb: "re4", stufe: 4, konf: ["ka"], lz: ["re.fe.01"], name: "Kreuz, Tomas und Sonntag", e: "✝️", farbe: "#8E5BC8", grund: "#F3ECFF",
    kurz: "Die Passionsgeschichte, das Kreuz als Zeichen, der zweifelnde Tomas, der Sonntag als Tag der Auferstehung", schritte: [
      info("Das Kreuz", "✝️", "Das Kreuz erinnert an den Tod von Jesus. Für Christen ist es aber auch ein Zeichen der Hoffnung: Sie glauben, dass Gott stärker ist als der Tod.",
        "Крест напоминает о смерти Иисуса. Но для христиан это и знак надежды: они верят, что Бог сильнее смерти."),
      wahl("Der Jünger Tomas will nicht glauben, dass Jesus lebt. Was möchte er?", "Ученик Фома не верит, что Иисус жив. Чего он хочет?", "✋",
        ["Er will Jesus selbst sehen und berühren", "Хочет сам увидеть и коснуться Иисуса", "Richtig! Darum sagt man heute manchmal „ungläubiger Thomas“. Zweifel gehören zum Glauben dazu.", "Правильно! Поэтому и говорят «Фома неверующий». Сомнения – часть веры."],
        ["Er will ein Fest feiern", "Хочет устроить праздник", "Nein, er will Beweise.", "Нет, он хочет доказательств."],
        ["Er will weglaufen", "Хочет убежать", "Nein, er will Jesus sehen.", "Нет, он хочет увидеть Иисуса."]),
      daumen("Der Sonntag ist für katholische Christen der Tag des Herrn – sie feiern Gottesdienst und ruhen sich aus.", "Воскресенье для католиков – День Господень: они идут на мессу и отдыхают.", "☀️", true,
        "Stimmt! Stell dir vor, es gäbe keinen Sonntag – jeder Tag wäre Alltag.", "Верно! Представь, что воскресенья нет – каждый день был бы будним."),
      ende("Super, {name}! Wie gestaltet ihr den Sonntag in eurer Familie?", "Супер, {name}! Как ваша семья проводит воскресенье?")
    ] });
})();
