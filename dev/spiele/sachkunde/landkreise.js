// Landkreise und kreisfreie Städte in Sachsen (30.10.2026, Sachunterricht Kl. 3: „Den eigenen Landkreis kennen“).
// window.LANDKREISE: Daten je Kreis; daraus entstehen window.LANDKREIS_THEMEN (ein Thema je Kreis, nur sichtbar für den Kreis, den die Eltern unter
// eltern.sachkunde.landkreis gewählt haben) und das Quiz „Sachsens Landkreise“ für alle Kinder aus Sachsen ab Kl. 2 (stufe 3).
// Russische Texte: Entwürfe (Ortsnamen bleiben lateinisch); je Kreis in RU: lage, besonders (wie L.besonders), satz, brauch.
// `satz` = ganzer Daumen-Satz je Kreis (stimmt immer; steht nicht wörtlich auf der Info-Karte davor).
(function () {
  const L = [
    { id: "bautzen", name: "Landkreis Bautzen", art: "Landkreis", stadt: "Bautzen", kz: "BZ", fluss: "Spree", lage: "im Osten Sachsens, in der Oberlausitz",
      besonders: ["Die Altstadt von Bautzen mit Türmen und der Alten Wasserkunst", "Hier leben viele Sorben – Ortsschilder sind deutsch und sorbisch", "Bautzener Senf ist in ganz Deutschland bekannt"],
      brauch: "Zu Ostern reiten die sorbischen Osterreiter, und am 25. Januar feiern die Kinder Vogelhochzeit.", sage: "Die Sage vom Zauberlehrling Krabat und der Schwarzen Mühle spielt hier.", e: "🏰" },
    { id: "goerlitz", name: "Landkreis Görlitz", art: "Landkreis", stadt: "Görlitz", kz: "GR", fluss: "Neiße", lage: "ganz im Osten, an der Grenze zu Polen und Tschechien",
      besonders: ["Görlitz hat eine der schönsten Altstädte Deutschlands und wird oft für Filme genutzt", "Das Zittauer Gebirge ist das kleinste Mittelgebirge Deutschlands", "In der Oberlausitz stehen viele Umgebindehäuser"],
      brauch: "In den Dörfern feiert man Osterbräuche und schmückt Brunnen.", sage: "Um die Burg- und Klosterruine auf dem Berg Oybin ranken sich viele Sagen von Rittern und Mönchen.", e: "🌉" },
    { id: "saechsische-schweiz", name: "Landkreis Sächsische Schweiz-Osterzgebirge", art: "Landkreis", stadt: "Pirna", kz: "PIR", fluss: "Elbe", lage: "südlich von Dresden bis zur Grenze nach Tschechien",
      besonders: ["Das Elbsandsteingebirge mit der Bastei und dem Nationalpark Sächsische Schweiz", "Die Festung Königstein hoch über der Elbe", "In Glashütte werden berühmte Uhren gebaut"],
      brauch: "Viele Menschen klettern und wandern hier; im Osterzgebirge gibt es Bergbau-Traditionen.", sage: "Man erzählt Sagen von Riesen und Zwergen in den Felsen.", e: "⛰️" },
    { id: "meissen", name: "Landkreis Meißen", art: "Landkreis", stadt: "Meißen", kz: "MEI", fluss: "Elbe", lage: "nordwestlich von Dresden",
      besonders: ["Meißener Porzellan mit den gekreuzten Schwertern", "Die Albrechtsburg und der Dom über der Elbe", "Schloss Moritzburg im Teich und Weinberge an der Elbe"],
      brauch: "Im Herbst feiert man Weinfeste.", sage: "Der Alchemist Böttger sollte eigentlich Gold machen – stattdessen erfand er mit anderen das erste europäische Porzellan.", e: "🏺" },
    { id: "mittelsachsen", name: "Landkreis Mittelsachsen", art: "Landkreis", stadt: "Freiberg", kz: "FG", fluss: "Freiberger Mulde", lage: "in der Mitte Sachsens zwischen Dresden, Leipzig und Chemnitz",
      besonders: ["Freiberg wurde durch den Silberbergbau reich", "Im Dom steht eine berühmte Silbermann-Orgel", "Die Bergakademie Freiberg ist eine sehr alte Bergbau-Hochschule"],
      brauch: "Bei Bergparaden ziehen Bergleute in festlicher Tracht durch die Stadt.", sage: "Sagen erzählen von Silberadern und Berggeistern.", e: "⛏️" },
    { id: "erzgebirge", name: "Erzgebirgskreis", art: "Landkreis", stadt: "Annaberg-Buchholz", kz: "ERZ", fluss: "Zschopau", lage: "im Süden an der Grenze zu Tschechien",
      besonders: ["Der Fichtelberg ist mit 1215 Metern der höchste Berg Sachsens", "Holzkunst: Räuchermännchen, Nussknacker, Schwibbögen und Pyramiden", "Früher wurde hier viel Erz abgebaut – daher der Name Erzgebirge"],
      brauch: "In der Weihnachtszeit leuchten Schwibbögen in den Fenstern, und Bergparaden ziehen durch die Städte.", sage: "Der Berggeist hilft fleißigen Bergleuten und ärgert die faulen.", e: "🕯️" },
    { id: "zwickau", name: "Landkreis Zwickau", art: "Landkreis", stadt: "Zwickau", kz: "Z", fluss: "Zwickauer Mulde", lage: "im Westen Sachsens",
      besonders: ["Zwickau ist eine Autostadt: Hier wurden Horch, Audi und der Trabant gebaut, heute Elektroautos", "Der Komponist Robert Schumann wurde in Zwickau geboren", "Früher gab es hier Steinkohlebergbau"],
      brauch: "Man pflegt Bergbau- und Musiktraditionen.", sage: "Man erzählt Geschichten von alten Bergwerken unter der Stadt.", e: "🚗" },
    { id: "vogtland", name: "Vogtlandkreis", art: "Landkreis", stadt: "Plauen", kz: "V", fluss: "Weiße Elster", lage: "ganz im Südwesten, an Bayern, Thüringen und Tschechien",
      besonders: ["Plauener Spitze ist auf der ganzen Welt bekannt", "Im Musikwinkel um Markneukirchen werden Musikinstrumente gebaut", "Die Göltzschtalbrücke ist die größte Ziegelsteinbrücke der Welt"],
      brauch: "Im Vogtland gibt es viele Heimat- und Spitzenfeste.", sage: "Sagen erzählen von Rittern auf alten Burgen.", e: "🎻" },
    { id: "leipzig-land", name: "Landkreis Leipzig", art: "Landkreis", stadt: "Borna", kz: "L", fluss: "Pleiße", lage: "rund um die Stadt Leipzig im Süden und Osten",
      besonders: ["Aus alten Braunkohle-Tagebauen ist das Leipziger Neuseenland entstanden", "Grimma liegt schön an der Mulde", "Hoch über der Mulde steht das Schloss Colditz"],
      brauch: "An den neuen Seen feiert man Badefeste.", sage: "Man erzählt von Dörfern, die dem Tagebau weichen mussten.", e: "🏊" },
    { id: "nordsachsen", name: "Landkreis Nordsachsen", art: "Landkreis", stadt: "Torgau", kz: "TDO", fluss: "Elbe", lage: "im Norden an Sachsen-Anhalt und Brandenburg",
      besonders: ["Schloss Hartenfels in Torgau mit seiner berühmten Wendeltreppe", "In Torgau trafen sich 1945 amerikanische und sowjetische Soldaten an der Elbe", "Die Dübener Heide ist ein großes Waldgebiet"],
      brauch: "In Torgau leben Bären im Schlossgraben – ein alter Brauch.", sage: "Man erzählt von Martin Luthers Frau Katharina, die in Torgau starb.", e: "🐻" },
    { id: "dresden", name: "Dresden", art: "kreisfreie Stadt", stadt: "Dresden", kz: "DD", fluss: "Elbe", lage: "an der Elbe – Dresden ist die Landeshauptstadt",
      besonders: ["Die Frauenkirche wurde nach dem Krieg wieder aufgebaut", "Der Zwinger und die Semperoper", "Hier arbeiten der Landtag und die Landesregierung"],
      brauch: "Der Striezelmarkt ist einer der ältesten Weihnachtsmärkte Deutschlands.", sage: "Man erzählt viele Geschichten über König August den Starken – sein Denkmal heißt Goldener Reiter.", e: "⛪" },
    { id: "leipzig", name: "Leipzig", art: "kreisfreie Stadt", stadt: "Leipzig", kz: "L", fluss: "Weiße Elster", lage: "im Nordwesten Sachsens – Leipzig ist die größte Stadt Sachsens",
      besonders: ["Das Völkerschlachtdenkmal", "Johann Sebastian Bach und der Thomanerchor", "1989 gingen hier viele Menschen friedlich für die Freiheit auf die Straße"],
      brauch: "Die Leipziger Messe gibt es schon seit über 800 Jahren.", sage: "In Auerbachs Keller soll der Zauberer Faust auf einem Fass geritten sein.", e: "🎶" },
    { id: "chemnitz", name: "Chemnitz", art: "kreisfreie Stadt", stadt: "Chemnitz", kz: "C", fluss: "Chemnitz", lage: "im Westen am Rand des Erzgebirges",
      besonders: ["Chemnitz war eine große Industriestadt mit Maschinenbau", "Der große Kopf von Karl Marx heißt in Chemnitz „Nischel“", "2025 war Chemnitz Kulturhauptstadt Europas"],
      brauch: "Auf dem Weihnachtsmarkt steht eine große Bergmannsfigur.", sage: "Man erzählt Geschichten aus der Zeit der Fabriken.", e: "🏭" }
  ];
  // Zusätze je Kreis (10.11.2026): Daumen-Satz als ganzer Satz und russische Entwürfe
  const ZUSATZ = {
    bautzen: { satz: "In Bautzen gibt es viele alte Türme.", satzRu: "В Bautzen много старых башен.", lageRu: "на востоке Саксонии, в Верхней Лужице",
      besondersRu: ["Старый город Bautzen с башнями и старой водонапорной башней (Alte Wasserkunst)", "Здесь живёт много сорбов – таблички с названиями на немецком и сорбском", "Горчицу из Bautzen знают по всей Германии"],
      brauchRu: "На Пасху сорбские всадники едут пасхальной процессией, а 25 января дети празднуют Птичью свадьбу. Здесь происходит легенда об ученике колдуна Крабате и Чёрной мельнице." },
    goerlitz: { satz: "In Görlitz werden oft Filme gedreht.", satzRu: "В Görlitz часто снимают фильмы.", lageRu: "на самом востоке, у границы с Польшей и Чехией",
      besondersRu: ["В Görlitz один из самых красивых старых городов Германии, здесь часто снимают кино", "Циттауские горы – самые маленькие средневысокие горы Германии", "В Верхней Лужице много особых домов – умгебиндехаусов"],
      brauchRu: "В деревнях празднуют пасхальные обычаи и украшают колодцы. О руинах замка и монастыря на горе Oybin рассказывают много легенд о рыцарях и монахах." },
    "saechsische-schweiz": { satz: "Die Festung Königstein steht hoch über der Elbe.", satzRu: "Крепость Königstein стоит высоко над Эльбой.", lageRu: "к югу от Дрездена до границы с Чехией",
      besondersRu: ["Эльбские Песчаниковые горы со скалами Bastei и национальным парком Саксонская Швейцария", "Крепость Königstein высоко над Эльбой", "В Glashütte делают знаменитые часы"],
      brauchRu: "Здесь многие лазают по скалам и ходят в походы; в Восточных Рудных горах хранят традиции горняков. Рассказывают легенды о великанах и гномах в скалах." },
    meissen: { satz: "Meißener Porzellan erkennt man an zwei gekreuzten Schwertern.", satzRu: "Майсенский фарфор узнают по двум скрещённым мечам.", lageRu: "к северо-западу от Дрездена",
      besondersRu: ["Майсенский фарфор со скрещёнными мечами", "Замок Albrechtsburg и собор над Эльбой", "Замок Moritzburg на пруду и виноградники у Эльбы"],
      brauchRu: "Осенью празднуют праздники вина. Алхимик Бёттгер должен был делать золото – а вместо этого вместе с другими изобрёл первый европейский фарфор." },
    mittelsachsen: { satz: "In Freiberg wurde früher Silber aus dem Berg geholt.", satzRu: "Во Freiberg раньше добывали серебро.", lageRu: "в центре Саксонии, между Дрезденом, Лейпцигом и Хемницем",
      besondersRu: ["Freiberg разбогател благодаря добыче серебра", "В соборе стоит знаменитый орган Зильбермана", "Горная академия Freiberg – очень старый горный университет"],
      brauchRu: "На горняцких парадах горняки идут по городу в праздничной форме. Легенды рассказывают о серебряных жилах и горных духах." },
    erzgebirge: { satz: "Räuchermännchen und Nussknacker kommen aus dem Erzgebirge.", satzRu: "Курильщики и щелкунчики родом из Рудных гор.", lageRu: "на юге, у границы с Чехией",
      besondersRu: ["Fichtelberg высотой 1215 метров – самая высокая гора Саксонии", "Изделия из дерева: курильщики, щелкунчики, арки со свечами и пирамиды", "Раньше здесь добывали много руды – отсюда название Рудные горы"],
      brauchRu: "В рождественское время в окнах светятся арки со свечами, а по городам идут горняцкие парады. Горный дух помогает усердным горнякам и сердит ленивых." },
    zwickau: { satz: "In Zwickau werden Autos gebaut.", satzRu: "В Zwickau делают автомобили.", lageRu: "на западе Саксонии",
      besondersRu: ["Zwickau – город автомобилей: здесь делали Horch, Audi и Trabant, сегодня – электромобили", "Композитор Роберт Шуман родился в Zwickau", "Раньше здесь добывали каменный уголь"],
      brauchRu: "Здесь хранят горняцкие и музыкальные традиции. Рассказывают истории о старых шахтах под городом." },
    vogtland: { satz: "Über die Göltzschtalbrücke fahren Züge.", satzRu: "По мосту Göltzschtalbrücke ходят поезда.", lageRu: "на самом юго-западе, рядом с Баварией, Тюрингией и Чехией",
      besondersRu: ["Плауэнское кружево знают во всём мире", "В «музыкальном уголке» вокруг Markneukirchen делают музыкальные инструменты", "Göltzschtalbrücke – самый большой кирпичный мост в мире"],
      brauchRu: "В Фогтланде много краеведческих праздников и праздников кружева. Легенды рассказывают о рыцарях в старых замках." },
    "leipzig-land": { satz: "Im Leipziger Neuseenland kann man in Seen baden, die früher Tagebaue waren.", satzRu: "В Лейпцигском Новоозёрье можно купаться в озёрах, которые раньше были карьерами.", lageRu: "вокруг города Лейпцига, на юге и востоке",
      besondersRu: ["Из старых буроугольных карьеров возникло Лейпцигское Новоозёрье", "Grimma красиво расположена на реке Мульде", "Высоко над Мульдой стоит замок Colditz"],
      brauchRu: "На новых озёрах празднуют купальные праздники. Рассказывают о деревнях, которым пришлось уступить место карьеру." },
    nordsachsen: { satz: "In Torgau steht das Schloss Hartenfels.", satzRu: "В Torgau стоит замок Hartenfels.", lageRu: "на севере, рядом с Саксонией-Анхальт и Бранденбургом",
      besondersRu: ["Замок Hartenfels в Torgau со знаменитой винтовой лестницей", "В Torgau в 1945 году на Эльбе встретились американские и советские солдаты", "Дюбенская пустошь – большой лесной край"],
      brauchRu: "В Torgau во рву замка живут медведи – старый обычай. Рассказывают о жене Мартина Лютера Катарине, которая умерла в Torgau." },
    dresden: { satz: "In Dresden steht die Frauenkirche.", satzRu: "В Дрездене стоит церковь Фрауэнкирхе.", lageRu: "на Эльбе – Дрезден столица Саксонии",
      besondersRu: ["Церковь Фрауэнкирхе после войны построили заново", "Цвингер и опера Земпера", "Здесь работают ландтаг и правительство земли"],
      brauchRu: "Штрицельмаркт – одна из старейших рождественских ярмарок Германии. Рассказывают много историй о короле Августе Сильном – его памятник называют Золотым всадником." },
    leipzig: { satz: "In Leipzig steht das Völkerschlachtdenkmal.", satzRu: "В Лейпциге стоит памятник Битве народов.", lageRu: "на северо-западе Саксонии – Лейпциг самый большой город Саксонии",
      besondersRu: ["Памятник Битве народов", "Иоганн Себастьян Бах и хор мальчиков церкви Святого Фомы", "В 1989 году здесь многие люди мирно вышли на улицы за свободу"],
      brauchRu: "Лейпцигской ярмарке уже больше 800 лет. В погребе Ауэрбаха, как говорят, волшебник Фауст скакал верхом на бочке.", nichtFluss: ["Pleiße"] },
    chemnitz: { satz: "In Chemnitz steht ein riesiger Kopf von Karl Marx.", satzRu: "В Хемнице стоит огромная голова Карла Маркса.", lageRu: "на западе, у края Рудных гор",
      besondersRu: ["Хемниц был большим промышленным городом с машиностроением", "Большую голову Карла Маркса в Хемнице называют «Nischel»", "В 2025 году Хемниц был культурной столицей Европы"],
      brauchRu: "На рождественской ярмарке стоит большая фигура горняка. Рассказывают истории о времени фабрик." }
  };
  L.forEach(k => Object.assign(k, ZUSATZ[k.id]));
  window.LANDKREISE = L;
  const mische = (a) => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
  const andere = (feld, x, n = 2, nicht = []) => mische(L.filter(y => y[feld] !== x[feld] && !nicht.includes(y[feld])).map(y => y[feld]).filter((v, i, a) => a.indexOf(v) === i)).slice(0, n);
  const kreis = (k) => k.art === "Landkreis";
  const desKreises = (k) => k.name.startsWith("Landkreis ") ? k.name.replace("Landkreis ", "Landkreises ") : k.name + "es";   // des Erzgebirgskreises, des Vogtlandkreises
  const T = L.map((k, i) => ({
    id: "lk-" + k.id, lb: "rz", stufe: 3, land: "sn", landkreis: k.id, lz: ["su.ge.04", "su.so.05"], name: kreis(k) ? `Unser Kreis: ${k.name}` : `Unsere Stadt: ${k.name}`,
    e: k.e, farbe: "#7B55B8", grund: "#EFE6FF", kurz: `${k.stadt}, ${k.fluss}, ${k.besonders[0]}`,
    schritte: [
      { typ: "info", titel: k.name, bild: k.e, text: kreis(k) ? `Du wohnst im ${k.name}. Er liegt ${k.lage}.` : `Du wohnst in der kreisfreien Stadt ${k.name}. Sie liegt ${k.lage}.`,
        ru: kreis(k) ? `Ты живёшь в районе ${k.name}. Он находится ${k.lageRu}.` : `Ты живёшь в городе ${k.name}. Он находится ${k.lageRu}.`,
        fakten: (kreis(k) ? [[`Kreisstadt: ${k.stadt}`, `Районный центр: ${k.stadt}`]] : [["Kreisfreie Stadt – sie gehört zu keinem Landkreis", "Самостоятельный город – он не входит ни в один район"]])
          .concat([[`Fluss: ${k.fluss}`, `Река: ${k.fluss}`], [`Autokennzeichen: ${k.kz}`, `Автомобильный номер: ${k.kz}`]]) },
      { typ: "wahl", frage: kreis(k) ? `Wie heißt die Kreisstadt des ${desKreises(k)}?` : `Welcher Fluss fließt durch ${k.name}?`, ru: kreis(k) ? "Как называется районный центр?" : "Какая река течёт через город?", bild: "🏛️",
        optionen: (kreis(k) ? [k.stadt].concat(andere("stadt", k)) : [k.fluss].concat(andere("fluss", k, 2, k.nichtFluss || []))).map((t, j) => ({ t, ok: j === 0,
          warum: j === 0 ? "Richtig!" : `Nein – ${kreis(k) ? "die Kreisstadt ist " + k.stadt : "der Fluss heißt " + k.fluss}.`,
          warumRu: j === 0 ? "Правильно!" : `Нет – ${kreis(k) ? "районный центр – " + k.stadt : "река называется " + k.fluss}.` })) },
      { typ: "wahl", frage: "Welches Autokennzeichen gehört hierher?", ru: "Какой автомобильный номер отсюда?", bild: "🚗",
        optionen: [k.kz].concat(andere("kz", k)).map((t, j) => ({ t, ok: j === 0, warum: j === 0 ? `Genau: ${k.kz}. Achte mal auf die Autos in deiner Straße!` : `Nein – hier steht ${k.kz} auf den Nummernschildern.`,
          warumRu: j === 0 ? `Точно: ${k.kz}. Посмотри на машины на своей улице!` : `Нет – здесь на номерах стоит ${k.kz}.` })) },
      { typ: "info", titel: "Das ist besonders", bild: "⭐", text: `Dafür ist ${kreis(k) ? "der " + k.name : k.name} bekannt:`, ru: "Вот чем известен твой край:",
        fakten: k.besonders.map((b, j) => [b, k.besondersRu[j]]) },
      { typ: "daumen", satz: k.satz, satzRu: k.satzRu, ok: true, warum: "Stimmt! Das gehört zu deiner Heimat.", warumRu: "Верно! Это часть твоего родного края." },
      { typ: "daumen", satz: `${k.name} liegt am Meer.`, satzRu: `${k.name} находится у моря.`, ok: false, warum: "Nein, Sachsen liegt nicht am Meer. Hier gibt es Flüsse, Seen und Berge.", warumRu: "Нет, у Саксонии нет моря. Здесь есть реки, озёра и горы." },
      { typ: "info", titel: "Bräuche und Sagen", bild: "📜", text: `${k.brauch} ${k.sage} Frag deine Familie, welche Geschichten sie kennt!`, ru: `${k.brauchRu} Спроси у семьи, какие истории они знают!` }
    ]
  }));
  // Quiz für alle Kinder aus Sachsen: die 13 Kreise auf einen Blick
  // [Kreis, Frage, russisch, Erklärung, russisch, Kreise, die nicht als falsche Antwort taugen (dort stimmt es auch)]
  const QUIZ = [
    ["erzgebirge", "Wo steht der Fichtelberg, der höchste Berg Sachsens?", "Где находится Fichtelberg, самая высокая гора Саксонии?", "Der Fichtelberg ist 1215 Meter hoch.", "Высота Fichtelberg – 1215 метров.", []],
    ["vogtland", "Wo werden Plauener Spitze und viele Musikinstrumente gemacht?", "Где делают плауэнское кружево и много музыкальных инструментов?", "Plauen und der Musikwinkel liegen im Vogtland.", "Plauen и «музыкальный уголок» находятся в Фогтланде.", []],
    ["meissen", "Woher kommt das berühmte Porzellan mit den Schwertern?", "Откуда знаменитый фарфор с мечами?", "Meißener Porzellan trägt zwei gekreuzte Schwerter.", "На майсенском фарфоре – два скрещённых меча.", []],
    ["bautzen", "Wo sind viele Ortsschilder deutsch und sorbisch?", "Где на многих табличках названия на немецком и сорбском?", "Im Landkreis Bautzen leben viele Sorben.", "В районе Bautzen живёт много сорбов.", ["goerlitz"]],
    ["zwickau", "Wo wurden Trabant und Audi gebaut?", "Где делали Trabant и Audi?", "Zwickau ist eine Autostadt.", "Zwickau – город автомобилей.", []],
    ["saechsische-schweiz", "Wo stehen die Bastei und die Festung Königstein?", "Где находятся скалы Bastei и крепость Königstein?", "Beide stehen im Elbsandsteingebirge an der Elbe.", "Они находятся в Эльбских Песчаниковых горах у Эльбы.", []]];
  T.push({ id: "lk-sachsen", lb: "rz", stufe: 3, land: "sn", lz: ["su.ge.04"], name: "Sachsens Landkreise und Städte", e: "🗺️", farbe: "#7B55B8", grund: "#EFE6FF",
    kurz: "10 Landkreise, 3 kreisfreie Städte, Kreisstädte und Kennzeichen",
    schritte: [
      { typ: "info", titel: "13 Kreise", bild: "🗺️", text: "Sachsen hat 10 Landkreise und 3 kreisfreie Städte: Dresden, Leipzig und Chemnitz. Wer weiß, wo was liegt?", ru: "В Саксонии 10 районов и 3 самостоятельных города: Дрезден, Лейпциг и Хемниц. Кто знает, где что находится?",
        fakten: L.filter(kreis).map(k => { const z = `${k.name.replace("Landkreis ", "")}: ${k.stadt} (${k.kz})`; return [z, z]; }) },
      ...QUIZ.map(([id, frage, ru, warum, warumRu, nicht]) => {
        const k = L.find(x => x.id === id), falsch = mische(L.filter(x => x.id !== id && kreis(x) && !nicht.includes(x.id))).slice(0, 2);
        return { typ: "wahl", frage, ru, bild: k.e, optionen: [k].concat(falsch).map((x, j) => ({ t: x.name, ok: j === 0, warum: j === 0 ? `Richtig! ${warum}` : `Nein – das ist im ${k.name}.`,
          warumRu: j === 0 ? `Правильно! ${warumRu}` : `Нет – это в районе ${k.name}.` })) }; }),
      { typ: "info", titel: "Und dein Kreis?", bild: "🏡", text: "Deine Eltern können im Elternbereich deinen Landkreis einstellen. Dann zeige ich dir ein Thema nur über deinen Kreis!", ru: "Родители могут выбрать твой район в разделе для родителей. Тогда я покажу тебе тему только про твой район!" }
    ] });
  window.LANDKREIS_THEMEN = T;
})();
