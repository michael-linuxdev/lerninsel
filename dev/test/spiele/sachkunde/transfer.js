// Transfer-Fragen für „Zeig, was du kannst“ im Sachunterricht (Paket „Ehrlich lernen“, 07.11.2026):
// neue Situation, gleiche Idee wie im Thema – damit der Lernstand nicht nur wiedererkannte Fragen misst.
// Eintrag: { lb, kl, thema, land?, typ: "wahl", frage, ru, bild, optionen: [{ t, ru, ok, warum, warumRu }] }
//      oder { lb, kl, thema, land?, typ: "daumen", satz, satzRu, bild, ok, warum, warumRu }
// lb wie in themen.js (zl kg pt un rz ex), kl = Klassenstufe des Lernstands (2 = Kl. 1/2, 3, 4, 5 = Übergang), thema = Thema mit derselben Idee,
// land: "sn" = nur für Kinder aus Sachsen. Die erste Option ist richtig (die Seite mischt). Russisch ist Entwurf.
(function () {
  const T = window.SU_TRANSFER = [];
  const W = (lb, kl, thema, bild, frage, ru, ...opts) => T.push({ lb, kl, thema, typ: "wahl", frage, ru, bild, transfer: true,
    optionen: opts.map(([t, r, warum, warumRu], i) => ({ t, ru: r, ok: i === 0, warum, warumRu })) });
  const D = (lb, kl, thema, bild, satz, satzRu, ok, warum, warumRu) => T.push({ lb, kl, thema, typ: "daumen", satz, satzRu, bild, ok, warum, warumRu, transfer: true });
  const nurSn = () => { T[T.length - 1].land = "sn"; };

  // ---------- Kl. 1/2 ----------
  W("zl", 2, "familie", "👧", "Lisa ist die Tochter von Tante Sara. Sara ist die Schwester deiner Mama. Was ist Lisa für dich?", "Лиза – дочь тёти Сары. Сара – сестра твоей мамы. Кем тебе приходится Лиза?",
    ["Meine Cousine", "Моя двоюродная сестра", "Richtig! Die Kinder von Onkel und Tante sind Cousin oder Cousine.", "Правильно! Дети дяди и тёти – двоюродные братья и сёстры."],
    ["Meine Schwester", "Моя сестра", "Nein, eine Schwester hat dieselben Eltern wie du. Lisa ist deine Cousine.", "Нет, у сестры те же родители, что у тебя. Лиза – твоя двоюродная сестра."],
    ["Meine Tante", "Моя тётя", "Nein, Tante ist Sara. Ihre Tochter ist deine Cousine.", "Нет, тётя – это Сара. Её дочь – твоя двоюродная сестра."]);
  W("zl", 2, "regeln", "⚽", "In der Pause wollen drei Kinder den einzigen Ball. Was ist fair?", "На перемене трое детей хотят единственный мяч. Что справедливо?",
    ["Zusammen spielen oder abwechseln", "Играть вместе или по очереди", "Genau! So kommen alle dran.", "Точно! Так все смогут поиграть."],
    ["Wer ihn zuerst gesehen hat, behält ihn den ganzen Tag", "Кто первым увидел, тот держит его весь день", "Das ist nicht fair – die anderen gehen leer aus. Besser: zusammen spielen oder abwechseln.", "Это несправедливо – другим ничего не достанется. Лучше играть вместе или по очереди."],
    ["Das älteste Kind bestimmt allein", "Решает только самый старший", "Nein, eine gute Lösung passt für alle, nicht nur für einen.", "Нет, хорошее решение подходит всем, а не одному."]);
  D("zl", 2, "zusammen-lernen", "👥", "In der Gruppenarbeit darf nur das schnellste Kind etwas sagen.", "В групповой работе говорить может только самый быстрый ребёнок.", false,
    "Stimmt nicht! In der Gruppe kommt jeder zu Wort. Gemeinsam findet man oft die besten Ideen.", "Неверно! В группе каждый может высказаться. Вместе часто находят лучшие идеи.");
  W("zl", 2, "geschenkebringer", "🎁", "Ein Kind aus Russland erzählt: „Bei uns gibt es die Geschenke in der Nacht zum 1. Januar.“ Wer bringt sie?", "Ребёнок из России рассказывает: «У нас подарки приносят в ночь на 1 января». Кто их приносит?",
    ["Ded Moros", "Дед Мороз", "Richtig! Ded Moros kommt an Neujahr.", "Правильно! Дед Мороз приходит на Новый год."],
    ["Der Nikolaus", "Николаус", "Nein, der Nikolaus kommt am 6. Dezember.", "Нет, Николаус приходит 6 декабря."],
    ["Das Christkind", "Кристкинд", "Nein, das Christkind kommt in manchen Familien an Heiligabend.", "Нет, Кристкинд приходит в некоторых семьях в Сочельник."]);
  D("zl", 2, "regeln", "🚦", "Auch Erwachsene müssen sich an Regeln halten, zum Beispiel im Straßenverkehr.", "Взрослые тоже должны соблюдать правила, например на дороге.", true,
    "Stimmt! Regeln gelten für alle – damit niemand verletzt wird.", "Верно! Правила действуют для всех – чтобы никто не пострадал.");

  W("kg", 2, "erstehilfe", "🩹", "Dein Freund hat sich das Knie aufgeschürft. Es blutet ein bisschen. Was tust du?", "Твой друг ободрал коленку. Немного идёт кровь. Что ты делаешь?",
    ["Einem Erwachsenen Bescheid sagen, die Wunde mit sauberem Wasser spülen, Pflaster drauf", "Сказать взрослому, промыть ранку чистой водой, наклеить пластырь", "Genau! Sauber machen und abdecken – und einem Erwachsenen Bescheid sagen.", "Точно! Промыть и закрыть – и сказать взрослому."],
    ["Etwas Erde darauf reiben, damit es aufhört", "Потереть землёй, чтобы перестало", "Nein! Erde ist schmutzig, die Wunde kann sich entzünden.", "Нет! Земля грязная, ранка может воспалиться."],
    ["Nichts sagen und weiterspielen", "Ничего не говорить и играть дальше", "Lieber nicht. Eine Wunde sollte sauber gemacht werden.", "Лучше не надо. Ранку нужно промыть."]);
  D("kg", 2, "gesundheit", "🤧", "Wenn ich niese, halte ich die Hand vor und gebe danach allen die Hand.", "Когда я чихаю, я прикрываюсь ладонью и потом всем жму руку.", false,
    "Stimmt nicht! So wandern die Keime weiter. Besser in die Armbeuge niesen und danach Hände waschen.", "Неверно! Так микробы передаются дальше. Лучше чихать в локоть и потом мыть руки.");
  W("kg", 2, "gesund-essen", "🥤", "Du hast nach dem Sport großen Durst. Was trinkst du am besten?", "После спорта тебе очень хочется пить. Что лучше выпить?",
    ["Wasser", "Воду", "Richtig! Wasser löscht den Durst am besten.", "Правильно! Вода лучше всего утоляет жажду."],
    ["Eine Cola, die gibt viel Energie", "Колу, она даёт много энергии", "Cola hat viel Zucker und löscht den Durst schlecht. Wasser ist besser.", "В коле много сахара, она плохо утоляет жажду. Вода лучше."],
    ["Gar nichts, sonst bekomme ich Bauchweh", "Ничего, а то заболит живот", "Nein, nach dem Sport braucht dein Körper Wasser. Trink in kleinen Schlucken.", "Нет, после спорта телу нужна вода. Пей маленькими глотками."]);
  W("kg", 2, "mein-koerper", "🤫", "Ein Erwachsener sagt: „Das ist unser Geheimnis, erzähl es niemandem.“ Du fühlst dich dabei schlecht. Was tust du?", "Взрослый говорит: «Это наш секрет, никому не рассказывай». Тебе от этого плохо. Что ты делаешь?",
    ["Einer Vertrauensperson davon erzählen", "Рассказать человеку, которому доверяю", "Richtig! Schlechte Geheimnisse darfst du immer erzählen – das ist kein Petzen. Du kannst auch die Nummer gegen Kummer anrufen: 116 111.", "Правильно! Плохие секреты всегда можно рассказать – это не ябедничество. Можно позвонить и на телефон доверия: 116 111."],
    ["Schweigen, weil ich es versprochen habe", "Молчать, потому что я пообещал(а)", "Nein, ein Geheimnis, bei dem du dich schlecht fühlst, darfst du immer erzählen. Hilfe gibt es auch unter 116 111.", "Нет, секрет, от которого тебе плохо, всегда можно рассказать. Помощь есть и по номеру 116 111."],
    ["Es einfach vergessen", "Просто забыть", "Gefühle gehen so nicht weg. Erzähl es einer Person, der du vertraust – oder ruf 116 111 an.", "Чувства так не уходят. Расскажи человеку, которому доверяешь, – или позвони 116 111."]);
  D("kg", 2, "gesundheit", "🪥", "Auch wer keine Süßigkeiten isst, putzt zweimal am Tag die Zähne.", "Даже тот, кто не ест сладкого, чистит зубы два раза в день.", true,
    "Stimmt! Auch Brot, Obst und Nudeln lassen Reste an den Zähnen. Darum morgens und abends putzen.", "Верно! Хлеб, фрукты и макароны тоже оставляют остатки на зубах. Поэтому чистят утром и вечером.");

  W("pt", 2, "kleintiere", "🕷️", "Eine Spinne hat acht Beine. Ist sie ein Insekt?", "У паука восемь ног. Он насекомое?",
    ["Nein, Insekten haben sechs Beine", "Нет, у насекомых шесть ног", "Richtig! Spinnen sind keine Insekten.", "Правильно! Пауки не насекомые."],
    ["Ja, alle kleinen Krabbeltiere sind Insekten", "Да, все маленькие ползающие животные – насекомые", "Nein! Insekten erkennst du an sechs Beinen. Die Spinne hat acht.", "Нет! Насекомых узнают по шести ногам. У паука восемь."],
    ["Ja, weil sie so klein ist", "Да, потому что он такой маленький", "Nein, auf die Größe kommt es nicht an, sondern auf die Beine: Insekten haben sechs.", "Нет, дело не в размере, а в ногах: у насекомых шесть."]);
  W("pt", 2, "pflanzen", "🌱", "Eine Bohne keimt im dunklen Schrank, eine andere am Fenster. Wie sehen sie nach zwei Wochen aus?", "Одна фасолина прорастает в тёмном шкафу, другая на окне. Как они выглядят через две недели?",
    ["Am Fenster grün und kräftig, im Schrank blass und dünn", "На окне зелёная и крепкая, в шкафу бледная и тонкая", "Genau! Ohne Licht werden Pflanzen blass und dünn.", "Точно! Без света растения становятся бледными и тонкими."],
    ["Beide genau gleich", "Обе совершенно одинаковые", "Nein, Pflanzen brauchen Licht. Ohne Licht werden sie blass.", "Нет, растениям нужен свет. Без света они бледнеют."],
    ["Im Schrank grüner, weil sie dort Ruhe hat", "В шкафу зеленее, потому что там спокойно", "Nein, Ruhe hilft der Pflanze nicht – sie braucht Licht.", "Нет, покой растению не помогает – ему нужен свет."]);
  D("pt", 2, "jahreszeiten", "❄️", "Im Winter halten alle Tiere Winterschlaf.", "Зимой все животные впадают в спячку.", false,
    "Stimmt nicht! Igel und Siebenschläfer schlafen. Rehe, Füchse und viele Vögel bleiben wach und suchen Futter.", "Неверно! Ёж и соня спят. Косули, лисы и многие птицы бодрствуют и ищут корм.");
  W("pt", 2, "haustiere", "🐰", "Ein Kaninchen lebt allein in einem kleinen Käfig. Was fehlt ihm am meisten?", "Кролик живёт один в маленькой клетке. Чего ему больше всего не хватает?",
    ["Ein zweites Kaninchen und viel Platz zum Hoppeln", "Второго кролика и места, чтобы прыгать", "Richtig! Kaninchen leben gern zu zweit und brauchen viel Platz.", "Правильно! Кролики любят жить вдвоём, и им нужно много места."],
    ["Ein Spiegel, dann ist es nicht allein", "Зеркало, тогда ему не будет одиноко", "Nein, ein Spiegelbild ist kein Freund. Kaninchen brauchen einen echten Partner.", "Нет, отражение – не друг. Кроликам нужен настоящий партнёр."],
    ["Süßigkeiten als Belohnung", "Сладости в награду", "Nein, Süßes macht Kaninchen krank. Sie fressen Heu, Gras und Gemüse.", "Нет, сладкое вредит кроликам. Они едят сено, траву и овощи."]);
  D("pt", 2, "obst-garten", "🍎", "Die Kerne in einem Apfel sind seine Samen.", "Косточки в яблоке – это его семена.", true,
    "Stimmt! Aus einem Apfelkern kann ein neuer Apfelbaum wachsen.", "Верно! Из яблочной косточки может вырасти новая яблоня.");

  W("rz", 2, "schulweg", "🌫️", "Es ist dunkel und neblig. Was ziehst du für den Schulweg an?", "Темно и туман. Что ты наденешь в школу?",
    ["Eine helle Jacke mit Reflektoren", "Светлую куртку со светоотражателями", "Genau! So sehen dich die Autofahrer früh.", "Точно! Так водители заметят тебя заранее."],
    ["Meine dunkle Lieblingsjacke – Hauptsache warm", "Мою тёмную любимую куртку – главное, тепло", "Warm ist gut, aber dunkle Kleidung sieht man im Nebel kaum. Hell und mit Reflektoren ist sicherer.", "Тепло – хорошо, но тёмную одежду в тумане почти не видно. Светлая и со светоотражателями – безопаснее."],
    ["Egal, die Autos haben ja Licht", "Неважно, у машин же есть фары", "Nein, im Nebel sehen Autofahrer dunkel gekleidete Kinder sehr spät.", "Нет, в тумане водители очень поздно замечают детей в тёмной одежде."]);
  W("rz", 2, "schule-ort", "🗺️", "Im Tierpark hängt ein großer Plan. Darauf ist ein blauer Tropfen gemalt. Wie findest du heraus, was er bedeutet?", "В зоопарке висит большой план. На нём нарисована синяя капля. Как узнать, что она значит?",
    ["Ich schaue in der Legende nach", "Посмотрю в легенде", "Richtig! Die Legende erklärt alle Zeichen – der Tropfen steht vielleicht für Trinkwasser.", "Правильно! Легенда объясняет все знаки – капля, может быть, означает питьевую воду."],
    ["Ich schaue auf die Windrose", "Посмотрю на розу ветров", "Nein, die Windrose zeigt die Himmelsrichtungen.", "Нет, роза ветров показывает стороны света."],
    ["Ein Tropfen heißt immer Regen", "Капля всегда означает дождь", "Nein, jedes Zeichen kann auf jedem Plan etwas anderes bedeuten. Dafür gibt es die Legende.", "Нет, на каждом плане знак может значить что-то своё. Для этого есть легенда."]);
  D("rz", 2, "schulweg", "🚸", "Der kürzeste Schulweg ist immer der sicherste.", "Самый короткий путь в школу – всегда самый безопасный.", false,
    "Stimmt nicht! Ein kleiner Umweg über eine Ampel oder einen Zebrastreifen ist oft sicherer.", "Неверно! Небольшой крюк через светофор или «зебру» часто безопаснее.");
  W("rz", 2, "schule-ort", "🚗", "Ein Fremder sagt: „Deine Mama schickt mich, steig ein.“ Was tust du?", "Незнакомец говорит: «Меня прислала твоя мама, садись». Что ты делаешь?",
    ["Nicht einsteigen, weggehen und es einem bekannten Erwachsenen erzählen", "Не садиться, уйти и рассказать знакомому взрослому", "Richtig! Mit Fremden gehst du nie mit – egal, was sie sagen.", "Правильно! С незнакомыми никогда не уходи – что бы они ни говорили."],
    ["Einsteigen, er kennt ja Mama", "Сесть, он же знает маму", "Nein! Das kann jeder behaupten. Geh weg und erzähl es einem Erwachsenen, den du kennst.", "Нет! Так может сказать любой. Уйди и расскажи знакомому взрослому."],
    ["Erst fragen, wie er heißt, dann einsteigen", "Сначала спросить, как его зовут, потом сесть", "Nein, auch mit Namen ist er ein Fremder. Nicht einsteigen!", "Нет, даже с именем он незнакомец. Не садись!"]);
  D("rz", 2, "schule-ort", "🔔", "Bei Feueralarm hole ich schnell noch meine Jacke aus der Garderobe.", "При пожарной тревоге я быстро забираю свою куртку из раздевалки.", false,
    "Stimmt nicht! Bei Alarm lässt du alles liegen und gehst sofort mit der Klasse den Fluchtweg nach draußen.", "Неверно! При тревоге всё оставляют и сразу выходят с классом по пути эвакуации.");

  W("un", 2, "loesen-trennen", "🍵", "Du rührst Zucker in den Tee. Danach siehst du ihn nicht mehr. Wo ist er?", "Ты размешиваешь сахар в чае. Потом его не видно. Где он?",
    ["Er hat sich im Tee gelöst – der Tee schmeckt süß", "Он растворился в чае – чай сладкий", "Genau! Der Zucker ist noch da, nur in winzigen Teilchen verteilt.", "Точно! Сахар ещё там, только разделился на крошечные частички."],
    ["Er ist verschwunden", "Он исчез", "Nein, dann wäre der Tee nicht süß. Der Zucker hat sich gelöst.", "Нет, тогда чай не был бы сладким. Сахар растворился."],
    ["Er ist als Dampf weggeflogen", "Он улетел с паром", "Nein, Zucker verdampft nicht so. Er hat sich im Tee gelöst.", "Нет, сахар так не испаряется. Он растворился в чае."]);
  W("un", 2, "licht-schatten", "🌇", "Am Abend steht die Sonne tief. Wie ist dein Schatten?", "Вечером солнце стоит низко. Какая у тебя тень?",
    ["Lang", "Длинная", "Richtig! Je tiefer die Sonne steht, desto länger ist der Schatten.", "Правильно! Чем ниже солнце, тем длиннее тень."],
    ["Kurz", "Короткая", "Nein, kurz ist der Schatten am Mittag, wenn die Sonne hoch steht.", "Нет, короткая тень в полдень, когда солнце высоко."],
    ["Es gibt keinen Schatten", "Тени нет", "Doch, solange die Sonne scheint, gibt es einen Schatten.", "Есть, пока светит солнце, тень есть."]);
  W("un", 2, "wasser", "🪞", "Nach dem Duschen ist der Spiegel im Bad beschlagen. Warum?", "После душа зеркало в ванной запотело. Почему?",
    ["Warmer Wasserdampf wird am kalten Spiegel wieder zu Tröpfchen", "Тёплый пар на холодном зеркале снова превращается в капельки", "Genau! Am kalten Spiegel kühlt der Dampf ab und wird wieder flüssig.", "Точно! На холодном зеркале пар остывает и снова становится жидким."],
    ["Der Spiegel schwitzt", "Зеркало потеет", "Nein, ein Spiegel kann nicht schwitzen. Das Wasser kommt aus dem Dampf in der Luft.", "Нет, зеркало не может потеть. Вода появляется из пара в воздухе."],
    ["Das ist Seife in der Luft", "Это мыло в воздухе", "Nein, es ist Wasser: Der Dampf wird am kalten Spiegel zu Tröpfchen.", "Нет, это вода: пар на холодном зеркале превращается в капельки."]);
  D("un", 2, "luft-schall", "🌬️", "Wind ist Luft, die sich bewegt.", "Ветер – это движущийся воздух.", true,
    "Stimmt! Luft kann man nicht sehen, aber wenn sie sich bewegt, spürst du sie als Wind.", "Верно! Воздух не видно, но когда он движется, ты чувствуешь его как ветер.");
  D("un", 2, "wasser", "🧊", "Ein Eiswürfel geht im Wasserglas sofort unter.", "Кубик льда в стакане воды сразу тонет.", false,
    "Stimmt nicht! Eis ist leichter als Wasser und schwimmt oben. Darum frieren Teiche von oben zu.", "Неверно! Лёд легче воды и плавает сверху. Поэтому пруды замерзают сверху.");

  W("ex", 2, "frueher", "👵", "Wer ist am ältesten?", "Кто самый старший?",
    ["Die Uroma", "Прабабушка", "Richtig! Die Uroma ist die Mama von Oma oder Opa.", "Правильно! Прабабушка – мама бабушки или дедушки."],
    ["Die Oma", "Бабушка", "Fast! Die Uroma ist noch älter – sie ist Omas oder Opas Mama.", "Почти! Прабабушка ещё старше – она мама бабушки или дедушки."],
    ["Die Mama", "Мама", "Nein, Oma und Uroma sind älter als Mama.", "Нет, бабушка и прабабушка старше мамы."]);
  W("ex", 2, "meine-schulzeit", "📅", "Du malst eine Zeitleiste deiner Schulzeit. Was kommt ganz ans Ende?", "Ты рисуешь линию времени своей школьной жизни. Что будет в самом конце?",
    ["Das, was ich zuletzt geschafft habe", "То, чего я добился(-лась) последним", "Genau! Auf einer Zeitleiste steht das Neueste am Ende.", "Точно! На линии времени самое новое – в конце."],
    ["Mein erster Schultag", "Мой первый школьный день", "Nein, der erste Schultag kommt ganz an den Anfang.", "Нет, первый школьный день – в самом начале."],
    ["Mein Kindergarten", "Мой детский сад", "Nein, der Kindergarten war noch vor der Schule – also ganz vorn.", "Нет, детский сад был ещё до школы – то есть в самом начале."]);
  D("ex", 2, "frueher", "📷", "Auf alten Fotos ist alles schwarz-weiß, weil es früher keine Farben gab.", "На старых фото всё чёрно-белое, потому что раньше не было цветов.", false,
    "Stimmt nicht! Farben gab es immer. Nur die Fotoapparate konnten sie damals noch nicht zeigen.", "Неверно! Цвета были всегда. Только фотоаппараты тогда ещё не могли их показать.");
  W("ex", 2, "frueher", "📻", "Wie haben Kinder früher Musik gehört, als es noch keine Handys gab?", "Как раньше дети слушали музыку, когда ещё не было мобильных?",
    ["Mit dem Radio oder mit Schallplatten", "По радио или с пластинок", "Richtig! Radio und Plattenspieler gab es schon bei den Großeltern.", "Правильно! Радио и проигрыватели были ещё у бабушек и дедушек."],
    ["Mit dem Tablet", "С планшета", "Nein, Tablets gab es damals noch nicht.", "Нет, планшетов тогда ещё не было."],
    ["Gar nicht, Musik gab es damals nicht", "Никак, музыки тогда не было", "Doch! Musik gibt es schon sehr lange – man hat auch viel selbst gesungen.", "Была! Музыка существует очень давно – и много пели сами."]);
  D("ex", 2, "meine-schulzeit", "✏️", "Auch Fehler gehören zu meiner Lerngeschichte – aus ihnen habe ich viel gelernt.", "Ошибки тоже часть моей истории учёбы – на них я многому научился(-лась).", true,
    "Stimmt! Wer Fehler macht und es nochmal versucht, lernt dazu.", "Верно! Кто ошибается и пробует снова, тот учится.");

  // ---------- Kl. 3 ----------
  W("kg", 3, "sinne", "👃", "Du hältst dir die Nase zu und isst ein Stück Apfel. Was merkst du?", "Ты зажимаешь нос и ешь кусочек яблока. Что ты замечаешь?",
    ["Ich schmecke weniger", "Я чувствую вкус слабее", "Richtig! Nase und Zunge arbeiten beim Schmecken zusammen.", "Правильно! Нос и язык вместе распознают вкус."],
    ["Ich schmecke mehr", "Я чувствую вкус сильнее", "Nein, ohne Nase schmeckt man weniger.", "Нет, без носа вкус слабее."],
    ["Ich höre den Apfel lauter", "Я громче слышу яблоко", "Das Hören hat damit nichts zu tun. Du schmeckst weniger, weil die Nase hilft.", "Слух тут ни при чём. Вкус слабее, потому что нос помогает."]);
  W("kg", 3, "sinne-genau", "🎬", "Im Kino wird es plötzlich dunkel. Was macht deine Pupille?", "В кино вдруг становится темно. Что делает твой зрачок?",
    ["Sie wird größer, damit mehr Licht hineinkommt", "Он расширяется, чтобы попадало больше света", "Genau! Im Dunkeln öffnet sich die Pupille weit.", "Точно! В темноте зрачок широко раскрывается."],
    ["Sie wird kleiner", "Он сужается", "Nein, kleiner wird sie im hellen Licht.", "Нет, сужается он на ярком свету."],
    ["Sie bleibt immer gleich", "Он всегда остаётся одинаковым", "Nein, die Pupille passt sich dem Licht an.", "Нет, зрачок подстраивается под свет."]);
  D("kg", 3, "nein-sagen", "👥", "Wenn alle in der Gruppe etwas tun, ist es auch richtig.", "Если все в группе что-то делают, значит, это правильно.", false,
    "Stimmt nicht! Auch wenn alle mitmachen, kann etwas falsch oder gefährlich sein. Du darfst Nein sagen.", "Неверно! Даже если все участвуют, это может быть неправильно или опасно. Ты можешь сказать «нет».");
  W("kg", 3, "nein-sagen", "📱", "Ein Freund sagt: „Komm, wir spielen noch drei Stunden am Handy, das merkt keiner.“ Was ist eine gute Antwort?", "Друг говорит: «Давай поиграем в телефоне ещё три часа, никто не заметит». Какой ответ хороший?",
    ["„Nein, ich mache jetzt etwas anderes. Komm doch mit raus!“", "«Нет, я сейчас займусь другим. Пойдём лучше на улицу!»", "Prima! Nein sagen und etwas anderes vorschlagen ist stark.", "Отлично! Сказать «нет» и предложить другое – это сильно."],
    ["„Okay, sonst bist du sauer auf mich.“", "«Ладно, а то ты на меня обидишься»", "Ein echter Freund versteht ein Nein. Du darfst Nein sagen.", "Настоящий друг поймёт «нет». Ты можешь отказаться."],
    ["Heimlich mitspielen", "Тайком играть", "Heimlich ist keine Lösung. Sag lieber klar, was du willst.", "Тайком – не решение. Лучше ясно скажи, чего хочешь."]);
  D("kg", 3, "sinne-genau", "👂", "Mit zwei Ohren hört man besser, aus welcher Richtung ein Geräusch kommt.", "Двумя ушами лучше слышно, с какой стороны идёт звук.", true,
    "Stimmt! Das Geräusch kommt am näheren Ohr etwas früher und lauter an.", "Верно! Звук приходит к ближнему уху чуть раньше и громче.");

  W("pt", 3, "wald", "🦊", "In einem Wald gibt es plötzlich keine Füchse mehr. Was passiert mit den Mäusen?", "В лесу вдруг не стало лис. Что будет с мышами?",
    ["Es werden mehr Mäuse, weil sie weniger gejagt werden", "Мышей станет больше, потому что на них меньше охотятся", "Richtig! In der Nahrungskette hängen alle zusammen.", "Правильно! В пищевой цепи все связаны."],
    ["Es werden auch weniger Mäuse", "Мышей тоже станет меньше", "Nein, der Fuchs frisst Mäuse. Ohne Füchse werden es mehr Mäuse.", "Нет, лиса ест мышей. Без лис мышей станет больше."],
    ["Nichts, die Tiere hängen nicht zusammen", "Ничего, животные не связаны друг с другом", "Doch! Fressen und gefressen werden verbindet die Tiere im Wald.", "Связаны! Пищевые цепи соединяют животных в лесу."]);
  W("pt", 3, "getreide", "🌾", "Aus welchem Teil der Getreidepflanze macht man Mehl?", "Из какой части злака делают муку?",
    ["Aus den Körnern", "Из зёрен", "Genau! Die Körner werden in der Mühle gemahlen.", "Точно! Зёрна мелют на мельнице."],
    ["Aus dem Halm", "Из стебля", "Nein, aus den Halmen wird Stroh. Mehl kommt aus den Körnern.", "Нет, из стеблей получается солома. Мука – из зёрен."],
    ["Aus den Wurzeln", "Из корней", "Nein, die Wurzeln bleiben im Boden. Mehl kommt aus den Körnern.", "Нет, корни остаются в земле. Мука – из зёрен."]);
  D("pt", 3, "wiese", "🐛", "Eine Raupe und ein Schmetterling können dasselbe Tier sein.", "Гусеница и бабочка могут быть одним и тем же животным.", true,
    "Stimmt! Aus der Raupe wird eine Puppe und daraus der Schmetterling.", "Верно! Из гусеницы получается куколка, а из неё – бабочка.");
  W("pt", 3, "brot", "🍞", "Warum geht ein Hefeteig auf?", "Почему дрожжевое тесто поднимается?",
    ["Die Hefe macht kleine Gasbläschen im Teig", "Дрожжи образуют в тесте маленькие пузырьки газа", "Richtig! Die Bläschen machen den Teig locker.", "Правильно! Пузырьки делают тесто пышным."],
    ["Weil man ihn fest drückt", "Потому что его сильно мнут", "Kneten mischt den Teig, aber aufgehen lässt ihn die Hefe.", "Замес перемешивает тесто, но поднимают его дрожжи."],
    ["Weil das Mehl im Warmen schmilzt", "Потому что мука тает в тепле", "Nein, Mehl schmilzt nicht. Die Hefe macht Gasbläschen.", "Нет, мука не тает. Дрожжи образуют пузырьки газа."]);
  D("pt", 3, "wald", "🪵", "Totes Holz im Wald ist nutzlos und sollte weggeräumt werden.", "Мёртвое дерево в лесу бесполезно, его надо убирать.", false,
    "Stimmt nicht! In totem Holz leben Käfer, Pilze und kleine Tiere. Es wird langsam wieder zu Erde.", "Неверно! В мёртвом дереве живут жуки, грибы и мелкие животные. Оно медленно снова становится землёй.");

  W("rz", 3, "kompass", "☀️", "Am Mittag steht die Sonne im Süden. Wo ist dann Norden?", "В полдень солнце на юге. Где тогда север?",
    ["Hinter mir, wenn ich zur Sonne schaue", "За моей спиной, если я смотрю на солнце", "Richtig! Norden liegt Süden gegenüber.", "Правильно! Север напротив юга."],
    ["Dort, wo die Sonne steht", "Там, где солнце", "Nein, am Mittag steht die Sonne im Süden. Norden ist genau gegenüber.", "Нет, в полдень солнце на юге. Север точно напротив."],
    ["Links von der Sonne", "Слева от солнца", "Links ist Osten, wenn du zur Mittagssonne schaust. Norden ist hinter dir.", "Слева восток, если смотришь на полуденное солнце. Север у тебя за спиной."]);
  W("rz", 3, "fahrrad", "🚲", "Was braucht ein verkehrssicheres Fahrrad unbedingt?", "Что обязательно нужно безопасному велосипеду?",
    ["Zwei funktionierende Bremsen, Licht und Klingel", "Два исправных тормоза, фары и звонок", "Genau! Dazu kommen Reflektoren an Rädern und Pedalen.", "Точно! К этому ещё светоотражатели на колёсах и педалях."],
    ["Ein bunter Wimpel reicht", "Достаточно цветного флажка", "Ein Wimpel ist schön, aber ohne Bremsen und Licht ist das Rad nicht sicher.", "Флажок – красиво, но без тормозов и фар велосипед небезопасен."],
    ["Ein Korb und ein Ständer", "Корзина и подножка", "Praktisch, aber nicht wichtig für die Sicherheit. Wichtig sind Bremsen, Licht, Klingel.", "Удобно, но для безопасности не важно. Важны тормоза, фары, звонок."]);
  W("rz", 3, "karten-lesen", "🧭", "Zwischen Süden und Westen liegt …", "Между югом и западом находится …",
    ["Südwesten", "Юго-запад", "Richtig! Süd und West zusammen: Südwesten.", "Правильно! Юг и запад вместе: юго-запад."],
    ["Nordosten", "Северо-восток", "Nein, Nordosten liegt genau gegenüber.", "Нет, северо-восток как раз напротив."],
    ["Nordwesten", "Северо-запад", "Fast! Nordwesten liegt zwischen Norden und Westen.", "Почти! Северо-запад между севером и западом."]);
  D("rz", 3, "fahrrad", "↪️", "Wenn ich mit dem Fahrrad rechts abbiege, muss ich kein Handzeichen geben.", "Когда я поворачиваю на велосипеде направо, подавать знак рукой не нужно.", false,
    "Stimmt nicht! Auch beim Rechtsabbiegen streckst du den rechten Arm aus. So wissen alle, was du vorhast.", "Неверно! И при повороте направо вытягивают правую руку. Так все знают, что ты собираешься делать.");
  D("rz", 3, "karten-lesen", "🗺️", "Auf einer Karte mit 1 : 100 000 sieht man ein größeres Gebiet als auf einer mit 1 : 10 000.", "На карте 1 : 100 000 видна бо́льшая территория, чем на карте 1 : 10 000.", true,
    "Stimmt! Bei 1 : 100 000 ist alles stärker verkleinert – dafür passt mehr auf die Karte.", "Верно! При 1 : 100 000 всё сильнее уменьшено – зато на карту помещается больше.");

  W("un", 3, "schwimmen", "🪵", "Ein großer Holzbalken und ein kleiner Stein liegen im Wasser. Was schwimmt?", "Большое бревно и маленький камень лежат в воде. Что плавает?",
    ["Der Holzbalken, obwohl er schwerer ist", "Бревно, хотя оно тяжелее", "Richtig! Ob etwas schwimmt, hängt nicht nur vom Gewicht ab, sondern vom Stoff und der Form.", "Правильно! Плавает ли предмет, зависит не только от веса, но и от материала и формы."],
    ["Der Stein, weil er kleiner ist", "Камень, потому что он меньше", "Nein, auch kleine Steine gehen unter. Holz schwimmt.", "Нет, даже маленькие камни тонут. Дерево плавает."],
    ["Keins, große Dinge gehen immer unter", "Ничего, большие вещи всегда тонут", "Nein! Auch riesige Schiffe schwimmen.", "Нет! Даже огромные корабли плавают."]);
  W("un", 3, "wasserkreislauf", "💧", "Am Morgen ist eine Pfütze da, am Nachmittag ist sie weg. Wo ist das Wasser?", "Утром была лужа, а днём её нет. Где вода?",
    ["Ein Teil ist verdunstet, ein Teil im Boden versickert", "Часть испарилась, часть впиталась в землю", "Genau! Das Wasser ist in der Luft und im Boden – es ist nicht weg.", "Точно! Вода в воздухе и в земле – она никуда не исчезла."],
    ["Es ist einfach verschwunden", "Она просто исчезла", "Nein, Wasser verschwindet nicht. Es verdunstet oder versickert.", "Нет, вода не исчезает. Она испаряется или впитывается."],
    ["Ein Tier hat alles ausgetrunken", "Животное всё выпило", "Das ist sehr unwahrscheinlich. Meist verdunstet das Wasser oder versickert im Boden.", "Это очень маловероятно. Обычно вода испаряется или впитывается в землю."]);
  D("un", 3, "schwimmen", "🍎", "Ein Apfel schwimmt im Wasser.", "Яблоко плавает в воде.", true,
    "Stimmt! Im Apfel ist viel Luft. Probier es in einer Schüssel aus.", "Верно! В яблоке много воздуха. Попробуй в миске.");
  D("un", 3, "wasserkreislauf", "☁️", "Das Wasser auf der Erde wird immer weniger, weil es in den Wolken verschwindet.", "Воды на Земле становится всё меньше, потому что она исчезает в облаках.", false,
    "Stimmt nicht! Aus den Wolken fällt das Wasser als Regen oder Schnee wieder herunter. Es wandert im Kreis.", "Неверно! Из облаков вода снова выпадает дождём или снегом. Она движется по кругу.");
  W("un", 3, "wetterkarte", "🌨️", "Auf der Wetterkarte ist bei Leipzig eine Schneeflocke. Was erwartest du dort?", "На карте погоды у Лейпцига снежинка. Чего ты там ждёшь?",
    ["Es ist kalt und es kann schneien", "Холодно, может пойти снег", "Richtig! Zieh dich warm an.", "Правильно! Одевайся тепло."],
    ["Es wird heiß und sonnig", "Будет жарко и солнечно", "Nein, die Schneeflocke zeigt Schnee – es ist kalt.", "Нет, снежинка означает снег – холодно."],
    ["Es regnet warmen Regen", "Пойдёт тёплый дождь", "Nein, Regen zeigt die Karte mit Tropfen. Die Schneeflocke heißt Schnee.", "Нет, дождь на карте обозначают каплями. Снежинка – это снег."]);

  W("zl", 3, "gemeinde", "🛝", "Die Kinder im Ort wünschen sich einen neuen Spielplatz. Wer entscheidet darüber?", "Дети в посёлке хотят новую детскую площадку. Кто это решает?",
    ["Der Gemeinderat mit der Bürgermeisterin oder dem Bürgermeister", "Совет общины вместе с бургомистром", "Genau! Kinder können ihre Wünsche dort vortragen, zum Beispiel mit einem Brief.", "Точно! Дети могут рассказать там о своих пожеланиях, например в письме."],
    ["Die Polizei", "Полиция", "Nein, die Polizei sorgt für Sicherheit. Über Spielplätze entscheidet der Gemeinderat.", "Нет, полиция следит за безопасностью. О площадках решает совет общины."],
    ["Der Spielwarenladen", "Магазин игрушек", "Nein, ein Laden verkauft nur Sachen. Entscheiden tut der Gemeinderat.", "Нет, магазин только продаёт. Решает совет общины."]);
  D("zl", 3, "kulturen", "🥢", "Mit Stäbchen oder mit der Hand zu essen ist genauso richtig wie mit Messer und Gabel.", "Есть палочками или руками так же правильно, как ножом и вилкой.", true,
    "Stimmt! Jede Kultur hat ihre eigenen Tischsitten. Keine ist besser als die andere.", "Верно! В каждой культуре свои правила за столом. Ни одни не лучше других.");
  W("zl", 3, "land-frueher", "🚜", "Früher haben viele Menschen das Getreide mit der Hand geerntet. Was macht das heute?", "Раньше многие люди убирали зерно вручную. Кто делает это сегодня?",
    ["Ein Mähdrescher", "Комбайн", "Richtig! Eine Maschine schafft heute, wofür früher viele Menschen nötig waren.", "Правильно! Машина сегодня делает то, для чего раньше нужно было много людей."],
    ["Die Kinder in den Ferien", "Дети на каникулах", "Nein, heute erntet meist eine Maschine, der Mähdrescher.", "Нет, сегодня обычно убирает машина – комбайн."],
    ["Niemand, Getreide wird heute in der Fabrik gemacht", "Никто, зерно сегодня делают на фабрике", "Nein, Getreide wächst immer noch auf dem Feld. Geerntet wird mit dem Mähdrescher.", "Нет, зерно по-прежнему растёт в поле. Убирают его комбайном."]);
  D("zl", 3, "gemeinde", "🗳️", "Bei einer Abstimmung in der Klasse zählt die Stimme des lautesten Kindes doppelt.", "При голосовании в классе голос самого громкого ребёнка считается дважды.", false,
    "Stimmt nicht! Bei einer Abstimmung hat jedes Kind genau eine Stimme.", "Неверно! При голосовании у каждого ребёнка ровно один голос.");

  W("ex", 3, "experiment", "🌱", "Du willst prüfen, ob Kresse mit Licht besser wächst. Wie machst du den Versuch fair?", "Ты хочешь проверить, лучше ли растёт кресс на свету. Как сделать опыт честным?",
    ["Zwei gleiche Schalen, gleich viel Wasser – eine ins Licht, eine ins Dunkle", "Две одинаковые миски, поровну воды – одну на свет, другую в темноту", "Genau! Nur eine Sache ist anders: das Licht.", "Точно! Отличается только одно: свет."],
    ["Eine Schale ins Licht, die andere ins Dunkle und ohne Wasser", "Одну миску на свет, другую в темноту и без воды", "Dann weißt du nicht, ob es am Licht oder am Wasser lag. Ändere nur eine Sache.", "Тогда непонятно, дело в свете или в воде. Меняй только одно."],
    ["Nur eine Schale ans Fenster stellen", "Поставить только одну миску на окно", "Dann fehlt der Vergleich. Du brauchst eine zweite Schale im Dunkeln.", "Тогда нет сравнения. Нужна вторая миска в темноте."]);
  W("ex", 3, "medien-info", "🦔", "Auf einer Internetseite steht: „Igel trinken am liebsten Milch.“ Wie prüfst du das?", "На сайте написано: «Ежи больше всего любят молоко». Как это проверить?",
    ["In einem Tierbuch oder einer zweiten guten Quelle nachsehen", "Посмотреть в книге о животных или во втором хорошем источнике", "Richtig! Dort steht: Milch macht Igel krank. Gut, dass du geprüft hast!", "Правильно! Там написано: молоко вредно ежам. Хорошо, что ты проверил(а)!"],
    ["Das stimmt bestimmt, es steht ja im Internet", "Это точно правда, это же в интернете", "Nein, im Internet steht auch Falsches. Hier ist es falsch: Milch macht Igel krank.", "Нет, в интернете бывает и неправда. Здесь это неверно: молоко вредно ежам."],
    ["Einen Fremden im Chat fragen", "Спросить незнакомца в чате", "Fremde im Chat sind keine sichere Quelle. Schau in einem Buch nach oder frag einen Erwachsenen.", "Незнакомцы в чате – ненадёжный источник. Посмотри в книге или спроси взрослого."]);
  D("ex", 3, "experiment", "🔬", "Ein Versuch, der anders ausgeht als vermutet, ist trotzdem ein guter Versuch.", "Опыт, который закончился не так, как предполагалось, всё равно хороший опыт.", true,
    "Stimmt! Dann hast du etwas Neues herausgefunden.", "Верно! Значит, ты узнал(а) что-то новое.");
  D("ex", 3, "medien-info", "▶️", "Wenn ein Video sehr viele Klicks hat, stimmt alles, was darin gesagt wird.", "Если у видео очень много просмотров, всё, что в нём говорят, правда.", false,
    "Stimmt nicht! Viele Klicks heißt nur: Viele haben es angeschaut. Ob es stimmt, prüfst du mit guten Quellen.", "Неверно! Много просмотров значит только: многие его посмотрели. Правда ли это, проверяй по хорошим источникам.");

  // ---------- Kl. 4 ----------
  W("un", 4, "strom", "🪁", "Dein Drachen hängt in einer Stromleitung fest. Was tust du?", "Твой воздушный змей застрял в линии электропередачи. Что ты делаешь?",
    ["Nicht anfassen, weggehen und einen Erwachsenen holen", "Не трогать, отойти и позвать взрослого", "Richtig! Strom aus Leitungen ist lebensgefährlich – auch über die Schnur.", "Правильно! Ток в проводах смертельно опасен – даже через верёвку."],
    ["Mit einem langen Stock herunterholen", "Снять длинной палкой", "Nein! Auch über einen Stock kann der Strom in dich fließen. Weg da und Erwachsene holen.", "Нет! Ток может пройти в тебя и через палку. Отойди и позови взрослых."],
    ["An der Schnur ziehen, wenn es nicht regnet", "Потянуть за верёвку, если нет дождя", "Nein! Auch bei Trockenheit ist das lebensgefährlich.", "Нет! Даже в сухую погоду это смертельно опасно."]);
  W("un", 4, "waerme", "🧥", "Warum ziehst du im Winter lieber mehrere dünne Schichten an?", "Почему зимой лучше надеть несколько тонких слоёв?",
    ["Zwischen den Schichten ist Luft, die die Wärme hält", "Между слоями есть воздух, который держит тепло", "Genau! Luft lässt Wärme schlecht durch – sie hält dich warm.", "Точно! Воздух плохо проводит тепло – он сохраняет тебе тепло."],
    ["Weil Kleidung von allein warm macht", "Потому что одежда сама греет", "Nein, Kleidung macht keine Wärme. Sie hält deine Körperwärme fest.", "Нет, одежда не производит тепло. Она удерживает тепло твоего тела."],
    ["Damit man dicker aussieht", "Чтобы выглядеть толще", "Darum geht es nicht. Die Luft zwischen den Schichten hält warm.", "Дело не в этом. Воздух между слоями сохраняет тепло."]);
  D("un", 4, "feuer", "🍳", "Brennendes Fett in der Pfanne löscht man mit Wasser.", "Горящий жир на сковороде тушат водой.", false,
    "Stimmt nicht! Wasser auf brennendem Fett ist sehr gefährlich – es entsteht eine Stichflamme. Deckel drauf, Herd aus, Erwachsene holen, 112 rufen.", "Неверно! Вода на горящем жире очень опасна – вспыхивает пламя. Накрыть крышкой, выключить плиту, позвать взрослых, звонить 112.");
  D("un", 4, "strom", "🔌", "Ein Draht aus Metall leitet Strom, ein Stab aus Holz nicht.", "Металлическая проволока проводит ток, а деревянная палочка – нет.", true,
    "Stimmt! Metalle sind Leiter. Holz und Kunststoff sind Nichtleiter.", "Верно! Металлы – проводники. Дерево и пластик – непроводники.");

  W("zl", 4, "medien-welt", "📝", "Ein Spiel will dein Geburtsdatum, deine Adresse und ein Foto. Was tust du?", "Игра просит дату рождения, адрес и фото. Что ты делаешь?",
    ["Nichts eingeben und meine Eltern fragen", "Ничего не вводить и спросить родителей", "Richtig! Persönliche Daten gibst du nur mit deinen Eltern zusammen ein.", "Правильно! Личные данные вводят только вместе с родителями."],
    ["Alles eingeben, sonst geht es nicht weiter", "Ввести всё, иначе дальше не пройти", "Nein, deine Daten sind wertvoll. Frag erst deine Eltern.", "Нет, твои данные ценны. Сначала спроси родителей."],
    ["Nur das Foto schicken", "Отправить только фото", "Auch ein Foto ist eine persönliche Sache. Erst die Eltern fragen.", "Фото – тоже личное. Сначала спроси родителей."]);
  W("zl", 4, "kinderrechte", "🤝", "Ein Kind wird wegen seiner Hautfarbe ausgelacht. Welches Kinderrecht ist verletzt?", "Над ребёнком смеются из-за цвета кожи. Какое право ребёнка нарушено?",
    ["Kein Kind darf benachteiligt werden", "Ни один ребёнок не должен подвергаться дискриминации", "Genau! Alle Kinder haben dieselben Rechte – egal, wie sie aussehen.", "Точно! У всех детей одинаковые права – независимо от того, как они выглядят."],
    ["Das Recht auf Freizeit", "Право на отдых", "Das ist auch ein Kinderrecht, aber hier geht es um Benachteiligung.", "Это тоже право ребёнка, но здесь речь о дискриминации."],
    ["Gar keins, das ist nur Spaß", "Никакое, это просто шутка", "Nein! Auslachen tut weh. Kein Kind darf benachteiligt werden.", "Нет! Насмешки причиняют боль. Ни один ребёнок не должен подвергаться дискриминации."]);
  D("zl", 4, "stadt-frueher", "🏙️", "Städte bleiben immer so, wie sie sind – sie verändern sich nicht.", "Города всегда остаются такими, какие есть, – они не меняются.", false,
    "Stimmt nicht! Städte verändern sich ständig: Neue Häuser, Straßen und Berufe kommen dazu, alte verschwinden.", "Неверно! Города постоянно меняются: появляются новые дома, улицы и профессии, старые исчезают.");
  D("zl", 4, "schule-frueher", "📏", "Früher wurden Kinder in der Schule oft geschlagen – heute ist das verboten.", "Раньше детей в школе часто били – сегодня это запрещено.", true,
    "Stimmt! Heute haben Kinder das Recht, ohne Gewalt zu lernen.", "Верно! Сегодня у детей есть право учиться без насилия.");

  W("pt", 4, "gewaesser", "🐸", "Ein Frosch legt seine Eier ins Wasser. Was schlüpft daraus?", "Лягушка откладывает икру в воду. Кто из неё вылупляется?",
    ["Kaulquappen", "Головастики", "Richtig! Aus Kaulquappen werden später Frösche.", "Правильно! Из головастиков потом получаются лягушки."],
    ["Kleine Frösche mit Beinen", "Маленькие лягушки с лапками", "Nein, zuerst schlüpfen Kaulquappen. Die Beine wachsen erst später.", "Нет, сначала вылупляются головастики. Лапки вырастают позже."],
    ["Fische", "Рыбы", "Nein, aus Froscheiern schlüpfen Kaulquappen – sie sehen nur ein bisschen aus wie Fische.", "Нет, из лягушачьей икры вылупляются головастики – они только немного похожи на рыб."]);
  W("pt", 4, "boden", "🌧️", "Auf einem Beet ohne Pflanzen spült der Regen die Erde weg. Was hilft?", "С грядки без растений дождь смывает землю. Что поможет?",
    ["Pflanzen oder Mulch – Wurzeln und Laub halten den Boden fest", "Растения или мульча – корни и листья удерживают почву", "Genau! Ein bedeckter Boden wird nicht weggespült.", "Точно! Укрытую почву не смывает."],
    ["Noch öfter umgraben", "Перекапывать ещё чаще", "Nein, lockere, nackte Erde spült der Regen noch leichter weg.", "Нет, рыхлую голую землю дождь смывает ещё легче."],
    ["Alle Regenwürmer entfernen", "Убрать всех дождевых червей", "Nein! Regenwürmer helfen dem Boden. Pflanzen und Mulch schützen ihn.", "Нет! Дождевые черви помогают почве. Растения и мульча защищают её."]);
  D("pt", 4, "waldtiere", "🦌", "Ein Rehkitz, das allein im Gras liegt, wurde verlassen und muss mitgenommen werden.", "Оленёнок, лежащий один в траве, брошен, и его надо забрать.", false,
    "Stimmt nicht! Die Mutter kommt zurück. Nicht anfassen – sonst nimmt sie ihr Kitz vielleicht nicht mehr an.", "Неверно! Мама вернётся. Не трогай – иначе она может не принять своего детёныша.");
  D("pt", 4, "gewaesser", "🐋", "Ein Wal ist ein Säugetier, obwohl er im Meer lebt.", "Кит – млекопитающее, хотя живёт в море.", true,
    "Stimmt! Wale atmen mit einer Lunge, und ihre Jungen trinken Milch.", "Верно! Киты дышат лёгкими, а их детёныши пьют молоко.");

  W("kg", 4, "herz-lunge", "🪜", "Nach dem Treppensteigen atmest du schnell. Warum?", "После подъёма по лестнице ты часто дышишь. Почему?",
    ["Die Muskeln brauchen mehr Sauerstoff", "Мышцам нужно больше кислорода", "Richtig! Lunge und Herz arbeiten schneller, um ihn zu liefern.", "Правильно! Лёгкие и сердце работают быстрее, чтобы его доставить."],
    ["Die Lunge ist kleiner geworden", "Лёгкие стали меньше", "Nein, die Lunge bleibt gleich groß. Die Muskeln brauchen mehr Sauerstoff.", "Нет, лёгкие остаются того же размера. Мышцам нужно больше кислорода."],
    ["Im Treppenhaus gibt es weniger Luft", "На лестнице меньше воздуха", "Nein, die Luft ist dort genauso. Dein Körper braucht nur mehr Sauerstoff.", "Нет, воздух там такой же. Просто телу нужно больше кислорода."]);
  W("kg", 4, "gross-werden", "🌱", "Deine Freundin bekommt schon Pickel, du noch nicht. Was stimmt?", "У твоей подруги уже появляются прыщики, у тебя ещё нет. Что верно?",
    ["Das ist normal – jeder Körper hat seine eigene Zeit", "Это нормально – у каждого тела своё время", "Genau! Früher oder später ist beides normal.", "Точно! Раньше или позже – оба варианта нормальны."],
    ["Bei mir stimmt etwas nicht", "Со мной что-то не так", "Nein, die Pubertät beginnt bei jedem zu einer anderen Zeit.", "Нет, половое созревание у каждого начинается в своё время."],
    ["Pickel bekommt man nur vom Schokoladeessen", "Прыщи бывают только от шоколада", "Nein, Pickel kommen vor allem von den Veränderungen im Körper.", "Нет, прыщи появляются прежде всего из-за изменений в организме."]);
  D("kg", 4, "herz-lunge", "🚭", "Rauchen schadet nur der Lunge, nicht dem Herzen.", "Курение вредит только лёгким, а не сердцу.", false,
    "Stimmt nicht! Rauchen schadet Lunge und Herz – und vielen anderen Teilen des Körpers.", "Неверно! Курение вредит и лёгким, и сердцу – и многим другим частям тела.");
  D("kg", 4, "gross-werden", "💬", "Über Veränderungen am Körper darf man mit Eltern, Ärztin oder Lehrkraft reden – das ist nicht peinlich.", "Об изменениях тела можно говорить с родителями, врачом или учителем – это не стыдно.", true,
    "Stimmt! Fragen sind gut. Auch die Nummer gegen Kummer hilft: 116 111.", "Верно! Вопросы – это хорошо. Помогает и телефон доверия: 116 111.");

  W("rz", 4, "radfahrpruefung", "🚗", "Du fährst geradeaus. Von rechts kommt ein Auto aus einer Straße, es gibt keine Schilder. Wer fährt zuerst?", "Ты едешь прямо. Справа из улицы выезжает машина, знаков нет. Кто едет первым?",
    ["Das Auto, es kommt von rechts", "Машина, она едет справа", "Richtig! Rechts vor links – auch für Radfahrer.", "Правильно! «Правый первый» – и для велосипедистов."],
    ["Ich, weil ich geradeaus fahre", "Я, потому что еду прямо", "Nein, geradeaus fahren gibt keine Vorfahrt. Es gilt rechts vor links.", "Нет, езда прямо не даёт преимущества. Действует «правый первый»."],
    ["Wer zuerst klingelt", "Тот, кто первым позвонит", "Nein, Klingeln gibt keine Vorfahrt. Es gilt rechts vor links.", "Нет, звонок не даёт преимущества. Действует «правый первый»."]);
  D("rz", 4, "radfahrpruefung", "👀", "Bevor ich an einem parkenden Auto vorbeifahre, schaue ich nach hinten und gebe ein Handzeichen.", "Прежде чем объехать припаркованную машину, я оглядываюсь назад и подаю знак рукой.", true,
    "Stimmt! Umschauen, Zeichen geben, mit Abstand vorbeifahren.", "Верно! Оглянуться, подать знак, объехать на расстоянии.");
  D("rz", 4, "radfahrpruefung", "⛑️", "Nach der Radfahrprüfung braucht man keinen Helm mehr – man kann ja jetzt sicher fahren.", "После велосипедного экзамена шлем больше не нужен – ведь теперь умеешь ездить безопасно.", false,
    "Stimmt nicht! Auch wer gut fährt, kann stürzen oder angefahren werden. Der Helm schützt den Kopf bei jeder Fahrt.", "Неверно! Даже тот, кто хорошо ездит, может упасть или попасть под машину. Шлем защищает голову в каждой поездке.");
  W("rz", 4, "radfahrpruefung", "🛣️", "Du bist 10 Jahre alt. Es gibt keinen Radweg. Wo fährst du?", "Тебе 10 лет. Велодорожки нет. Где ты едешь?",
    ["Auf der Straße, am rechten Rand", "По дороге, у правого края", "Richtig! Ab 10 Jahren fahren Kinder auf der Straße oder dem Radweg.", "Правильно! С 10 лет дети ездят по дороге или по велодорожке."],
    ["Auf dem Gehweg, wie mit 7 Jahren", "По тротуару, как в 7 лет", "Nein, auf dem Gehweg fahren nur Kinder bis 10 Jahre. Mit 10 geht es auf die Straße.", "Нет, по тротуару ездят только дети до 10 лет. С 10 – по дороге."],
    ["In der Mitte der Straße", "Посередине дороги", "Nein, du fährst am rechten Rand.", "Нет, ты едешь у правого края."]);
  W("rz", 4, "sachsen-entdecken", "🏞️", "Welcher Fluss fließt durch Meißen, Dresden und Pirna?", "Какая река течёт через Мейсен, Дрезден и Пирну?",
    ["Die Elbe", "Эльба", "Richtig! Die Elbe fließt quer durch Sachsen.", "Правильно! Эльба течёт через всю Саксонию."],
    ["Die Spree", "Шпрее", "Die Spree fließt durch Bautzen und Berlin, aber nicht durch Dresden.", "Шпрее течёт через Баутцен и Берлин, но не через Дрезден."],
    ["Der Rhein", "Рейн", "Nein, der Rhein fließt im Westen von Deutschland.", "Нет, Рейн течёт на западе Германии."]); nurSn();
  D("rz", 4, "sachsen", "🏛️", "Leipzig ist die Landeshauptstadt von Sachsen, weil es die größte Stadt ist.", "Лейпциг – столица Саксонии, потому что это самый большой город.", false,
    "Stimmt nicht! Leipzig ist zwar die größte Stadt, aber Landeshauptstadt ist Dresden.", "Неверно! Лейпциг хоть и самый большой город, но столица – Дрезден."); nurSn();

  // ---------- Übergang Kl. 5 ----------
  W("zl", 5, "lernen-lernen", "📚", "Du sollst 20 neue Englischwörter lernen. Was hilft am meisten?", "Тебе нужно выучить 20 новых английских слов. Что поможет больше всего?",
    ["Jeden Tag ein paar Wörter und mich selbst abfragen", "Каждый день по нескольку слов и проверять себя", "Genau! Kleine Portionen und Abfragen bleiben gut im Kopf.", "Точно! Маленькие порции и самопроверка хорошо запоминаются."],
    ["Einmal alle Wörter lange anschauen", "Один раз долго смотреть на все слова", "Anschauen allein reicht selten. Besser jeden Tag ein bisschen und abfragen.", "Одного просмотра редко хватает. Лучше каждый день понемногу и проверять себя."],
    ["Am Abend vor dem Test alle auf einmal", "Вечером перед контрольной все сразу", "Dann vergisst man viel schnell wieder. Verteilt lernen hilft mehr.", "Тогда многое быстро забывается. Учить понемногу полезнее."]);
  W("zl", 5, "neue-schule", "🏫", "Du hast in der neuen Schule eine Frage zum Stundenplan. Was tust du?", "У тебя в новой школе вопрос по расписанию. Что ты делаешь?",
    ["Die Klassenlehrerin oder ein Kind aus der Klasse fragen", "Спросить классного руководителя или ребёнка из класса", "Richtig! Fragen ist klug – alle sind am Anfang neu.", "Правильно! Спрашивать – умно, в начале все новенькие."],
    ["Niemanden fragen, ich muss das allein wissen", "Никого не спрашивать, я должен(-на) знать сам(а)", "Nein, Fragen ist ganz normal und hilft dir.", "Нет, спрашивать нормально, это тебе поможет."],
    ["Warten, bis es mir jemand von allein sagt", "Ждать, пока кто-нибудь сам скажет", "Das kann lange dauern. Frag lieber selbst.", "Это может долго длиться. Лучше спроси сам(а)."]);
  D("zl", 5, "lernen-lernen", "⏸️", "Wer beim Lernen Pausen macht, ist faul.", "Кто делает перерывы во время учёбы, тот ленивый.", false,
    "Stimmt nicht! Kurze Pausen helfen dem Kopf, sich Dinge zu merken.", "Неверно! Короткие перерывы помогают голове запоминать.");
  D("zl", 5, "neue-schule", "🙂", "In der neuen Schule darf ich Fehler machen – alle müssen sich erst eingewöhnen.", "В новой школе можно ошибаться – всем сначала нужно привыкнуть.", true,
    "Stimmt! Am Anfang ist vieles neu. Fehler gehören dazu.", "Верно! Сначала многое новое. Ошибки – это нормально.");
})();
