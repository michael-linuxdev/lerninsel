// Sachkunde-Themen mit Eule Ella.
// Schritt-Typen:
//   info     { titel, bild?, text, ru, fakten?: [[de, ru], ...] }
// Thema mit stufe (optional, NA-39): erst ab der Klasse davor sichtbar (stufe 5 = Übergang, sichtbar ab Kl. 4).
// Thema mit land (optional, z. B. "sn"): nur für Kinder aus diesem Bundesland (Heimatkunde wie „Unser Bundesland Sachsen“).
//   wahl     { frage, ru, bild?, optionen: [{ t, ru, ok, warum, warumRu }] }
//   daumen   { satz, satzRu, bild?, ok, warum, warumRu }
//   zuordnen { frage, ru, gruppen: [{ id, name, ru, bild }], dinge: [{ t, ru, gruppe }] }
//   baum     { frage, ru, ziel, warum, warumRu }  (auf die richtige Person im Stammbaum tippen)
// baum: [ids] statt bild zeigt den Stammbaum des Themas mit diesen Personen hervorgehoben.
// bild: Name einer Zeichnung aus bilder.js oder ein Emoji.
// lb (Schuljahr SU, 28.10.2026): Lernbereich – "zl" Zusammen leben · "kg" Körper und Gesundheit · "pt" Pflanzen und Tiere · "un" Unbelebte Natur ·
//   "rz" Raum und Zeit · "ex" Forschen, Medien, Schuljahre; die Themenliste ist danach gruppiert. kl: Klasse, zu der ein Thema ohne stufe gehört
//   (nur für „Wiederholen aus früheren Klassen“, ändert die Sichtbarkeit nicht).
window.THEMEN = [
  {
    id: "geschenkebringer", lb: "zl", kl: 2, lz: ["su.so.04"], name: "Wer bringt die Geschenke?", e: "🎅", farbe: "#D7263D", grund: "#FFEDEF",
    kurz: "Nikolaus, Weihnachtsmann, Santa Claus und Ded Moros",
    schritte: [
      { typ: "info", titel: "Bald ist Weihnachten!", bild: "baum",
        text: "Hallo {name}, ich bin Ella! Weißt du, wer die Geschenke bringt? Das ist in jedem Land ein bisschen anders. Heute lernst du drei Geschenke-Bringer kennen.",
        ru: "Привет, {name}, я Элла! Знаешь, кто приносит подарки? В каждой стране по-разному. Сегодня ты познакомишься с тремя, кто приносит подарки." },
      { typ: "info", titel: "Der Weihnachtsmann", bild: "weihnachtsmann",
        text: "In Deutschland kommt der Weihnachtsmann an Heiligabend, am 24. Dezember. Abends liegen die Geschenke unter dem Weihnachtsbaum.",
        ru: "В Германии Вайнахтсман (Weihnachtsmann) приходит в Сочельник, 24 декабря. Вечером подарки лежат под ёлкой.",
        fakten: [["Er trägt einen roten Mantel mit weißem Pelz.", "Он носит красную шубу с белым мехом."],
          ["Er hat einen langen weißen Bart und einen Sack voller Geschenke.", "У него длинная белая борода и мешок с подарками."]] },
      { typ: "info", titel: "Das Christkind", bild: "👼",
        text: "In vielen Familien, besonders im Süden von Deutschland und in Österreich, bringt nicht der Weihnachtsmann, sondern das Christkind die Geschenke. Man sieht es nie, es kommt heimlich.",
        ru: "Во многих семьях, особенно на юге Германии и в Австрии, подарки приносит не Вайнахтсман, а Кристкинд (Младенец Христос). Его никто не видит, оно приходит тайно." },
      { typ: "info", titel: "Der Nikolaus", bild: "nikolaus",
        text: "Schon am 6. Dezember kommt der Nikolaus. Am Abend vorher putzen Kinder ihre Stiefel und stellen sie vor die Tür. Am Morgen sind Nüsse, Mandarinen und Schokolade drin.",
        ru: "Уже 6 декабря приходит Николаус. Накануне вечером дети чистят сапожки и ставят их за дверь. Утром в них орехи, мандарины и шоколад.",
        fakten: [["Der Nikolaus sieht aus wie ein Bischof: mit hoher Bischofsmütze und einem goldenen Stab mit Schnörkel.", "Николаус похож на епископа: высокая митра (шапка епископа) и золотой посох с завитком."],
          ["Er hat ein goldenes Buch. Darin steht, ob die Kinder brav waren.", "У него золотая книга. В ней написано, хорошо ли вели себя дети."],
          ["Den Nikolaus gab es wirklich! Er war vor sehr langer Zeit ein Bischof und hat armen Menschen heimlich geholfen.", "Николай жил на самом деле! Очень давно он был епископом и тайно помогал бедным людям."]] },
      { typ: "info", titel: "Stiefel putzen!", bild: "stiefel",
        text: "Das ist ein schöner Brauch: Wer seine Stiefel blitzblank putzt, findet am 6. Dezember eine Überraschung darin. In Russland feiern manche den Nikolaustag am 19. Dezember.",
        ru: "Красивый обычай: кто начистит сапожки до блеска, найдёт 6 декабря в них сюрприз. В России День святого Николая отмечают 19 декабря." },
      { typ: "info", titel: "Nikolaus oder Weihnachtsmann?", bild: "vergleich",
        text: "Viele verwechseln die beiden. Aber es sind zwei verschiedene! Der Weihnachtsmann ist aus dem Nikolaus entstanden, darum sehen sie sich ein bisschen ähnlich.",
        ru: "Многие их путают. Но это два разных персонажа! Вайнахтсман появился из Николауса, поэтому они немного похожи.",
        fakten: [["Nikolaus: 6. Dezember. Weihnachtsmann: 24. Dezember.", "Николаус: 6 декабря. Вайнахтсман: 24 декабря."],
          ["Nikolaus: Bischofsmütze und Bischofsstab. Weihnachtsmann: Zipfelmütze mit Bommel.", "Николаус: митра и посох. Вайнахтсман: колпак с помпоном."],
          ["Nikolaus: kleine Sachen in den Stiefel. Weihnachtsmann: große Geschenke unter den Baum.", "Николаус: маленькие подарки в сапожок. Вайнахтсман: большие подарки под ёлку."]] },
      { typ: "daumen", satz: "Der Nikolaus kommt an Heiligabend.", satzRu: "Николаус приходит в Сочельник.", bild: "nikolaus", ok: false,
        warum: "Nein! Der Nikolaus kommt am 6. Dezember. An Heiligabend kommt der Weihnachtsmann.", warumRu: "Нет! Николаус приходит 6 декабря. В Сочельник приходит Вайнахтсман." },
      { typ: "zuordnen", frage: "Nikolaus oder Weihnachtsmann? Ordne zu!", ru: "Николаус или Вайнахтсман? Распредели!",
        gruppen: [{ id: "ni", name: "Nikolaus", ru: "Николаус", bild: "nikolaus" }, { id: "wm", name: "Weihnachtsmann", ru: "Вайнахтсман", bild: "weihnachtsmann" }],
        dinge: [
          { t: "Kommt am 6. Dezember", ru: "Приходит 6 декабря", gruppe: "ni" },
          { t: "Kommt am 24. Dezember", ru: "Приходит 24 декабря", gruppe: "wm" },
          { t: "Trägt eine hohe Bischofsmütze", ru: "Носит высокую митру", gruppe: "ni" },
          { t: "Trägt eine Zipfelmütze mit Bommel", ru: "Носит колпак с помпоном", gruppe: "wm" },
          { t: "Füllt die geputzten Stiefel", ru: "Наполняет почищенные сапожки", gruppe: "ni" },
          { t: "Legt Geschenke unter den Weihnachtsbaum", ru: "Кладёт подарки под ёлку", gruppe: "wm" },
          { t: "Hat einen goldenen Stab mit Schnörkel", ru: "У него золотой посох с завитком", gruppe: "ni" },
          { t: "Hat einen großen Sack voller Geschenke", ru: "У него большой мешок с подарками", gruppe: "wm" }] },
      { typ: "wahl", frage: "Wann bringt der Weihnachtsmann in Deutschland die Geschenke?", ru: "Когда Вайнахтсман приносит подарки в Германии?", bild: "weihnachtsmann", optionen: [
        { t: "An Heiligabend, am 24. Dezember", ru: "В Сочельник, 24 декабря", ok: true, warum: "Richtig! Am Abend vom 24. Dezember.", warumRu: "Правильно! Вечером 24 декабря." },
        { t: "An Silvester", ru: "В канун Нового года", ok: false, warum: "Nein, an Silvester kommt ein anderer. Das lernst du gleich!", warumRu: "Нет, в Новый год приходит кто-то другой. Скоро узнаешь!" },
        { t: "Im Sommer", ru: "Летом", ok: false, warum: "Im Sommer? Nein, der Weihnachtsmann kommt im Winter, an Heiligabend.", warumRu: "Летом? Нет, он приходит зимой, в Сочельник." }] },
      { typ: "info", titel: "Santa Claus", bild: "santa",
        text: "In Amerika und vielen anderen Ländern kommt Santa Claus. Er kommt in der Nacht vom 24. auf den 25. Dezember, wenn alle Kinder schlafen. Am Morgen packen sie die Geschenke aus.",
        ru: "В Америке и во многих других странах приходит Санта-Клаус. Он приходит в ночь с 24 на 25 декабря, когда все дети спят. Утром они распаковывают подарки.",
        fakten: [["Er fliegt mit einem Schlitten, den Rentiere ziehen.", "Он летает на санях, которые тянут олени."],
          ["Er rutscht durch den Schornstein ins Haus.", "Он спускается в дом через дымоход."],
          ["Er wohnt am Nordpol. Elfen helfen ihm beim Spielzeug-Bauen.", "Он живёт на Северном полюсе. Эльфы помогают ему делать игрушки."],
          ["Die Kinder stellen ihm Milch und Kekse hin.", "Дети оставляют ему молоко и печенье."]] },
      { typ: "wahl", frage: "Wie kommt Santa Claus ins Haus?", ru: "Как Санта-Клаус попадает в дом?", bild: "kamin", optionen: [
        { t: "Durch den Schornstein", ru: "Через дымоход", ok: true, warum: "Genau! Er rutscht durch den Schornstein hinunter zum Kamin.", warumRu: "Точно! Он спускается через дымоход к камину." },
        { t: "Durch das Fenster", ru: "Через окно", ok: false, warum: "Nein, Santa Claus nimmt den Schornstein.", warumRu: "Нет, Санта-Клаус спускается через дымоход." },
        { t: "Er klingelt an der Tür", ru: "Он звонит в дверь", ok: false, warum: "Nein, dann würden ja alle aufwachen! Er kommt durch den Schornstein.", warumRu: "Нет, тогда все бы проснулись! Он приходит через дымоход." }] },
      { typ: "daumen", satz: "Santa Claus wohnt am Nordpol.", satzRu: "Санта-Клаус живёт на Северном полюсе.", bild: "santa", ok: true,
        warum: "Stimmt! Dort hat er seine Werkstatt mit vielen Elfen.", warumRu: "Верно! Там у него мастерская со множеством эльфов." },
      { typ: "info", titel: "Ded Moros", bild: "dedmoros",
        text: "In Russland und vielen anderen Ländern kommt Ded Moros. Das heißt „Großväterchen Frost“. Er bringt die Geschenke an Neujahr, in der Nacht vom 31. Dezember auf den 1. Januar.",
        ru: "В России и во многих других странах приходит Дед Мороз. Он приносит подарки на Новый год, в ночь с 31 декабря на 1 января.",
        fakten: [["Die Geschenke liegen unter dem Neujahrsbaum. Der heißt auf Russisch „Jolka“.", "Подарки лежат под новогодней ёлкой."],
          ["Er trägt einen langen Mantel bis zum Boden, oft blau, rot oder silbern, und hat einen langen Stab.", "Он носит длинную шубу до пола, часто синюю, красную или серебристую, и у него есть посох."]] },
      { typ: "info", titel: "Die Troika", bild: "troika",
        text: "Ded Moros fährt mit einer Troika. Das ist ein Schlitten, den drei Pferde ziehen. „Tri“ heißt auf Russisch „drei“.",
        ru: "Дед Мороз ездит на тройке. Это сани, которые тянут три лошади." },
      { typ: "info", titel: "Snegurotschka", bild: "snegurotschka",
        text: "Ded Moros kommt nicht allein. Seine Enkelin Snegurotschka hilft ihm. Ihr Name bedeutet „Schneemädchen“. Sie trägt einen hellblauen Mantel und hat oft einen langen Zopf.",
        ru: "Дед Мороз приходит не один. Ему помогает его внучка Снегурочка. Она носит голубую шубку, и у неё часто длинная коса." },
      { typ: "wahl", frage: "Wann bringt Ded Moros die Geschenke?", ru: "Когда Дед Мороз приносит подарки?", bild: "dedmoros", optionen: [
        { t: "An Neujahr", ru: "На Новый год", ok: true, warum: "Richtig! In der Nacht vom 31. Dezember auf den 1. Januar.", warumRu: "Правильно! В ночь с 31 декабря на 1 января." },
        { t: "Am 6. Dezember", ru: "6 декабря", ok: false, warum: "Am 6. Dezember kommt der Nikolaus, das weißt du schon! Ded Moros kommt an Neujahr.", warumRu: "6 декабря приходит Николаус. Дед Мороз приходит на Новый год." },
        { t: "An Ostern", ru: "На Пасху", ok: false, warum: "An Ostern kommt der Osterhase! Ded Moros kommt an Neujahr.", warumRu: "На Пасху приходит пасхальный заяц! Дед Мороз приходит на Новый год." }] },
      { typ: "daumen", satz: "Ded Moros fährt mit Rentieren durch die Luft.", satzRu: "Дед Мороз летает на оленях по воздуху.", bild: "dedmoros", ok: false,
        warum: "Nein! Die Rentiere gehören zu Santa Claus. Ded Moros fährt mit einer Troika, drei Pferden vor einem Schlitten.", warumRu: "Нет! Олени — у Санта-Клауса. Дед Мороз ездит на тройке." },
      { typ: "zuordnen", frage: "Wer ist das? Ordne zu!", ru: "Кто это? Распредели!",
        gruppen: [{ id: "wm", name: "Weihnachtsmann", ru: "Вайнахтсман", bild: "weihnachtsmann" }, { id: "sc", name: "Santa Claus", ru: "Санта-Клаус", bild: "santa" }, { id: "dm", name: "Ded Moros", ru: "Дед Мороз", bild: "dedmoros" }],
        dinge: [
          { t: "Kommt an Heiligabend, am 24. Dezember", ru: "Приходит в Сочельник, 24 декабря", gruppe: "wm" },
          { t: "Rutscht durch den Schornstein", ru: "Спускается через дымоход", gruppe: "sc" },
          { t: "Kommt an Neujahr", ru: "Приходит на Новый год", gruppe: "dm" },
          { t: "Seine Enkelin Snegurotschka hilft ihm", ru: "Ему помогает внучка Снегурочка", gruppe: "dm" },
          { t: "Rentiere ziehen seinen Schlitten", ru: "Его сани тянут олени", gruppe: "sc" },
          { t: "Manchmal bringt statt ihm das Christkind die Geschenke", ru: "Иногда вместо него подарки приносит Кристкинд", gruppe: "wm" },
          { t: "Milch und Kekse warten auf ihn", ru: "Его ждут молоко и печенье", gruppe: "sc" },
          { t: "Fährt mit drei Pferden", ru: "Ездит на трёх лошадях", gruppe: "dm" }] },
      { typ: "info", titel: "Was alle drei gemeinsam haben", bild: "alle",
        text: "Alle drei haben einen weißen Bart, bringen Geschenke und machen Kinder froh. Manche Familien feiern sogar zweimal: an Heiligabend mit dem Weihnachtsmann und an Neujahr mit Ded Moros! In Russland ist Weihnachten übrigens erst am 7. Januar.",
        ru: "У всех троих белая борода, они приносят подарки и радуют детей. Некоторые семьи празднуют даже два раза: в Сочельник с Вайнахтсманом и на Новый год с Дедом Морозом! А в России Рождество празднуют только 7 января." },
      { typ: "wahl", frage: "Was bedeutet „Ded Moros“ auf Deutsch?", ru: "Что значит «Дед Мороз» по-немецки?", bild: "dedmoros", optionen: [
        { t: "Großväterchen Frost", ru: "Großväterchen Frost (дедушка Мороз)", ok: true, warum: "Super! „Ded“ heißt Großvater und „Moros“ heißt Frost.", warumRu: "Супер! «Дед» — это Großvater, а «Мороз» — Frost." },
        { t: "Schneemann", ru: "Снеговик", ok: false, warum: "Nicht ganz. „Ded Moros“ heißt Großväterchen Frost.", warumRu: "Не совсем. «Дед Мороз» значит Großväterchen Frost." },
        { t: "Weihnachtsbaum", ru: "Ёлка", ok: false, warum: "Nein, der Baum heißt „Jolka“. Ded Moros heißt Großväterchen Frost.", warumRu: "Нет, дерево называется «ёлка»." }] },
      { typ: "info", titel: "Geschafft!", bild: "geschenk",
        text: "Toll, {name}! Jetzt kennst du den Weihnachtsmann, Santa Claus und Ded Moros. Erzähl doch deiner Familie, was du gelernt hast!",
        ru: "Отлично, {name}! Теперь ты знаешь Вайнахтсмана, Санта-Клауса и Деда Мороза. Расскажи своей семье, что ты узнала!" }
    ]
  },
  {
    id: "familie", lb: "zl", kl: 2, lz: ["su.so.02"], name: "Meine Familie", e: "👨‍👩‍👧‍👦", farbe: "#7B55B8", grund: "#F1EAFF",
    kurz: "Oma, Opa, Tante, Cousine, Uroma, Schwager …",
    stammbaum: {
      personen: [
        { id: "karl", label: ["Uropa", "Karl"], g: "m", alter: "uralt", farbe: "#8A6E4B", x: 430, reihe: 0, wer: "Uropa Karl ist der Papa von Oma Rosa.", werRu: "Прадедушка Карл — папа бабушки Розы." },
        { id: "anna", label: ["Uroma", "Anna"], g: "w", alter: "uralt", farbe: "#B57FB8", x: 570, reihe: 0, wer: "Uroma Anna ist die Mama von Oma Rosa.", werRu: "Прабабушка Анна — мама бабушки Розы." },
        { id: "hilde", label: ["Großtante", "Hilde"], g: "w", alter: "alt", farbe: "#5CA0C8", x: 120, reihe: 1, wer: "Großtante Hilde ist die Schwester von Oma Rosa.", werRu: "Двоюродная бабушка Хильда — сестра бабушки Розы." },
        { id: "rosa", label: ["Oma", "Rosa"], g: "w", alter: "alt", farbe: "#E0457B", x: 400, reihe: 1, wer: "Oma Rosa ist Mamas Mama.", werRu: "Бабушка Роза — мама мамы." },
        { id: "peter", label: ["Opa", "Peter"], g: "m", alter: "alt", farbe: "#3A8F6A", x: 540, reihe: 1, wer: "Opa Peter ist Mamas Papa.", werRu: "Дедушка Петер — папа мамы." },
        { id: "gabi", label: ["Oma", "Gabi"], g: "w", alter: "alt", farbe: "#F2994A", x: 760, reihe: 1, wer: "Oma Gabi ist Papas Mama.", werRu: "Бабушка Габи — мама папы." },
        { id: "ulli", label: ["Opa", "Ulli"], g: "m", alter: "alt", farbe: "#4B6FC8", x: 900, reihe: 1, wer: "Opa Ulli ist Papas Papa.", werRu: "Дедушка Улли — папа папы." },
        { id: "tom", label: ["Tom"], g: "m", alter: "jung", farbe: "#6BBF59", x: 120, reihe: 2, wer: "Tom ist der Sohn von Großtante Hilde. Er ist Mamas Cousin.", werRu: "Том — сын Хильды. Он двоюродный брат мамы." },
        { id: "jan", label: ["Onkel", "Jan"], g: "m", alter: "jung", farbe: "#2F86C8", x: 270, reihe: 2, wer: "Onkel Jan ist der Mann von Tante Sara.", werRu: "Дядя Ян — муж тёти Сары." },
        { id: "sara", label: ["Tante", "Sara"], g: "w", alter: "jung", farbe: "#D7263D", x: 410, reihe: 2, wer: "Tante Sara ist Mamas Schwester.", werRu: "Тётя Сара — сестра мамы." },
        { id: "julia", label: ["Mama", "Julia"], g: "w", alter: "jung", farbe: "#C2337A", x: 590, reihe: 2, wer: "Das ist Mama Julia, Mias Mama.", werRu: "Это мама Юлия, мама Мии." },
        { id: "ben", label: ["Papa", "Ben"], g: "m", alter: "jung", farbe: "#1F8F8A", x: 750, reihe: 2, wer: "Das ist Papa Ben, Mias Papa.", werRu: "Это папа Бен, папа Мии." },
        { id: "lea", label: ["Lea"], g: "w", alter: "kind", farbe: "#FFB03B", x: 120, reihe: 3, wer: "Lea ist Toms Tochter. Sie ist Mias Großcousine.", werRu: "Леа — дочь Тома. Она троюродная сестра Мии." },
        { id: "emma", label: ["Emma"], g: "w", alter: "kind", farbe: "#9B6FD8", x: 340, reihe: 3, wer: "Emma ist die Tochter von Tante Sara. Sie ist Mias Cousine.", werRu: "Эмма — дочь тёти Сары. Она двоюродная сестра Мии." },
        { id: "mia", label: ["Mia"], g: "w", alter: "kind", farbe: "#FF6F9F", x: 600, reihe: 3, ich: true, wer: "Das ist Mia selbst.", werRu: "Это сама Мия." },
        { id: "max", label: ["Max"], g: "m", alter: "kind", farbe: "#3AA0E0", x: 740, reihe: 3, wer: "Max ist Mias Bruder.", werRu: "Макс — брат Мии." }
      ],
      paare: [["karl", "anna"], ["rosa", "peter"], ["gabi", "ulli"], ["jan", "sara"], ["julia", "ben"]],
      kinder: [
        { eltern: ["karl", "anna"], kinder: ["hilde", "rosa"] },
        { eltern: ["hilde"], kinder: ["tom"] },
        { eltern: ["rosa", "peter"], kinder: ["sara", "julia"] },
        { eltern: ["gabi", "ulli"], kinder: ["ben"] },
        { eltern: ["tom"], kinder: ["lea"] },
        { eltern: ["jan", "sara"], kinder: ["emma"] },
        { eltern: ["julia", "ben"], kinder: ["mia", "max"] }
      ]
    },
    schritte: [
      { typ: "info", titel: "Das ist Mias Familie", baum: [],
        text: "Hallo {name}! Das ist Mia, mit dem Stern. Sie ist so alt wie du. Hier siehst du ihre ganze Familie. Jede Reihe ist eine Generation: oben die Ältesten, unten die Kinder.",
        ru: "Привет, {name}! Это Мия, со звёздочкой. Ей столько же лет, сколько тебе. Здесь вся её семья. Каждый ряд — это поколение: наверху самые старшие, внизу дети." },
      { typ: "info", titel: "Eltern und Geschwister", baum: ["julia", "ben", "mia", "max"],
        text: "Mama und Papa sind Mias Eltern. Max ist Mias Bruder, Mia ist die Schwester von Max. Bruder und Schwester zusammen nennt man Geschwister.",
        ru: "Мама и папа — это родители (Eltern). Макс — брат (Bruder) Мии, а Мия — сестра (Schwester) Макса. Братья и сёстры вместе по-немецки — Geschwister." },
      { typ: "baum", frage: "Tippe auf Mias Bruder.", ru: "Нажми на брата Мии.", ziel: "max",
        warum: "Richtig! Max ist Mias Bruder. Die beiden sind Geschwister.", warumRu: "Правильно! Макс — брат Мии. Они Geschwister — брат и сестра." },
      { typ: "info", titel: "Oma und Opa", baum: ["rosa", "peter", "gabi", "ulli"],
        text: "Die Eltern von Mama und Papa sind Mias Großeltern: Oma und Opa. Mia hat zwei Omas und zwei Opas! Für Oma und Opa ist Mia die Enkelin und Max der Enkel.",
        ru: "Родители мамы и папы — это бабушки и дедушки (Großeltern). У Мии две бабушки и два дедушки! Для них Мия — внучка (Enkelin), а Макс — внук (Enkel)." },
      { typ: "wahl", frage: "Oma Gabi ist die Mutter von …", ru: "Бабушка Габи — мама …", baum: ["gabi"], optionen: [
        { t: "Papa Ben", ru: "папы Бена", ok: true, warum: "Genau! Oma Gabi und Opa Ulli sind Papas Eltern.", warumRu: "Точно! Бабушка Габи и дедушка Улли — родители папы." },
        { t: "Mama Julia", ru: "мамы Юлии", ok: false, warum: "Nein, Mamas Mama ist Oma Rosa. Folge der Linie von Oma Gabi nach unten!", warumRu: "Нет, мама мамы — бабушка Роза. Проследи линию от бабушки Габи вниз!" },
        { t: "Tante Sara", ru: "тёти Сары", ok: false, warum: "Nein, Tante Saras Mama ist Oma Rosa. Folge der Linie von Oma Gabi nach unten!", warumRu: "Нет, мама тёти Сары — бабушка Роза." }] },
      { typ: "info", titel: "Uroma und Uropa", baum: ["anna", "karl"],
        text: "Die Eltern von Oma Rosa sind Mias Urgroßeltern: Uroma und Uropa. „Ur“ heißt: noch eine Generation weiter. Für Uroma Anna ist Mia die Urenkelin und Max der Urenkel.",
        ru: "Родители бабушки Розы — прабабушка (Uroma) и прадедушка (Uropa). «Ur» значит «ещё на одно поколение дальше», как «пра-». Для прабабушки Мия — правнучка (Urenkelin), а Макс — правнук (Urenkel)." },
      { typ: "daumen", satz: "Mia ist die Urenkelin von Uroma Anna.", satzRu: "Мия — правнучка прабабушки Анны.", baum: ["anna", "mia"], ok: true,
        warum: "Stimmt! Uroma Anna → Oma Rosa → Mama → Mia. Das sind drei Generationen nach unten.", warumRu: "Верно! Прабабушка Анна → бабушка Роза → мама → Мия. Три поколения вниз." },
      { typ: "info", titel: "Tante und Onkel", baum: ["sara", "jan"],
        text: "Tante Sara ist Mamas Schwester. Darum ist sie Mias Tante. Onkel Jan ist mit Tante Sara verheiratet, also ist er Mias Onkel. Für die beiden ist Mia die Nichte und Max der Neffe.",
        ru: "Тётя Сара — сестра мамы, поэтому она тётя (Tante) Мии. Дядя Ян женат на тёте Саре, значит он дядя (Onkel). Для них Мия — племянница (Nichte), а Макс — племянник (Neffe)." },
      { typ: "info", titel: "Cousine und Cousin", baum: ["emma"],
        text: "Emma ist die Tochter von Tante Sara und Onkel Jan. Emma ist Mias Cousine. Ein Junge heißt Cousin. Cousinen und Cousins haben dieselben Großeltern.",
        ru: "Эмма — дочь тёти Сары и дяди Яна. Эмма — двоюродная сестра (Cousine) Мии. Двоюродный брат — Cousin. У двоюродных братьев и сестёр общие бабушка и дедушка." },
      { typ: "baum", frage: "Tippe auf Emmas Cousine.", ru: "Нажми на двоюродную сестру Эммы.", ziel: "mia",
        warum: "Super! Mia ist Emmas Cousine. Sie haben dieselben Großeltern: Oma Rosa und Opa Peter.", warumRu: "Супер! Мия — двоюродная сестра Эммы. У них общие бабушка Роза и дедушка Петер." },
      { typ: "wahl", frage: "Max ist ein Junge. Was ist Max für Emma?", ru: "Макс — мальчик. Кто Макс для Эммы?", baum: ["max", "emma"], optionen: [
        { t: "Ihr Cousin", ru: "Двоюродный брат (Cousin)", ok: true, warum: "Richtig! Ein Junge ist der Cousin, ein Mädchen die Cousine.", warumRu: "Правильно! Мальчик — Cousin, девочка — Cousine." },
        { t: "Ihre Cousine", ru: "Двоюродная сестра (Cousine)", ok: false, warum: "Fast! „Cousine“ sagt man zu einem Mädchen. Max ist ein Junge.", warumRu: "Почти! «Cousine» говорят о девочке. Макс — мальчик." },
        { t: "Ihr Bruder", ru: "Брат", ok: false, warum: "Nein, Emma und Max haben nicht dieselben Eltern. Max ist Emmas Cousin.", warumRu: "Нет, у Эммы и Макса разные родители. Макс — её двоюродный брат." }] },
      { typ: "info", titel: "Der Schwager", baum: ["jan", "julia"],
        text: "Onkel Jan ist der Mann von Mamas Schwester. Für Mama ist er der Schwager. Und Papa ist für Tante Sara der Schwager. Eine Frau heißt Schwägerin: Tante Sara ist Papas Schwägerin.",
        ru: "Дядя Ян — муж маминой сестры. Для мамы он Schwager (по-русски: зять). А папа для тёти Сары тоже Schwager. Женщина — Schwägerin: тётя Сара — Schwägerin папы. В русском языке для таких родственников много разных слов!" },
      { typ: "baum", frage: "Tippe auf Mamas Schwager.", ru: "Нажми на «Schwager» мамы.", ziel: "jan",
        warum: "Genau! Onkel Jan ist mit Mamas Schwester verheiratet. Darum ist er Mamas Schwager.", warumRu: "Точно! Дядя Ян женат на маминой сестре, поэтому он её Schwager." },
      { typ: "info", titel: "Großtante und Großcousine", baum: ["hilde", "tom", "lea"],
        text: "Großtante Hilde ist die Schwester von Oma Rosa. Ihr Sohn Tom ist Mamas Cousin. Und Toms Tochter Lea ist Mias Großcousine. Großcousinen haben dieselben Urgroßeltern!",
        ru: "Хильда — сестра бабушки Розы, двоюродная бабушка (Großtante). Её сын Том — двоюродный брат мамы. А дочь Тома Леа — троюродная сестра (Großcousine) Мии. У троюродных сестёр общие прабабушка и прадедушка!" },
      { typ: "baum", frage: "Tippe auf Mias Großcousine.", ru: "Нажми на троюродную сестру Мии.", ziel: "lea",
        warum: "Toll! Lea ist Mias Großcousine. Beide haben Uroma Anna und Uropa Karl als Urgroßeltern.", warumRu: "Здорово! Леа — троюродная сестра Мии. У обеих прабабушка Анна и прадедушка Карл." },
      { typ: "zuordnen", frage: "Wie alt ist die Generation? Ordne zu, von Mia aus gesehen.", ru: "Какое это поколение? Распредели, если смотреть от Мии.",
        gruppen: [{ id: "g0", name: "Gleiche Generation", ru: "Своё поколение", bild: "👧👦" }, { id: "g1", name: "Eine älter", ru: "На одно старше", bild: "👩👨" }, { id: "g2", name: "Zwei oder drei älter", ru: "На два-три старше", bild: "👵👴" }],
        dinge: [
          { t: "Max, der Bruder", ru: "Макс, брат", gruppe: "g0" },
          { t: "Emma, die Cousine", ru: "Эмма, двоюродная сестра", gruppe: "g0" },
          { t: "Lea, die Großcousine", ru: "Леа, троюродная сестра", gruppe: "g0" },
          { t: "Tante Sara", ru: "Тётя Сара", gruppe: "g1" },
          { t: "Onkel Jan", ru: "Дядя Ян", gruppe: "g1" },
          { t: "Tom, Mamas Cousin", ru: "Том, двоюродный брат мамы", gruppe: "g1" },
          { t: "Oma Rosa", ru: "Бабушка Роза", gruppe: "g2" },
          { t: "Großtante Hilde", ru: "Двоюродная бабушка Хильда", gruppe: "g2" },
          { t: "Uropa Karl", ru: "Прадедушка Карл", gruppe: "g2" }] },
      { typ: "daumen", satz: "Tante Sara ist die Schwester von Papa.", satzRu: "Тётя Сара — сестра папы.", baum: ["sara", "ben"], ok: false,
        warum: "Nein! Tante Sara ist Mamas Schwester. Für Papa ist sie die Schwägerin.", warumRu: "Нет! Тётя Сара — сестра мамы. Для папы она Schwägerin." },
      { typ: "wahl", frage: "Wer ist der Enkel von Opa Peter?", ru: "Кто внук дедушки Петера?", baum: ["peter"], optionen: [
        { t: "Max", ru: "Макс", ok: true, warum: "Richtig! Opa Peter ist Mamas Papa, also ist Max sein Enkel.", warumRu: "Правильно! Дедушка Петер — папа мамы, значит Макс — его внук." },
        { t: "Onkel Jan", ru: "Дядя Ян", ok: false, warum: "Nein, Onkel Jan ist mit Opa Peters Tochter verheiratet. Er ist sein Schwiegersohn.", warumRu: "Нет, дядя Ян женат на дочери дедушки Петера. Он его зять." },
        { t: "Tom", ru: "Том", ok: false, warum: "Nein, Tom ist der Sohn von Großtante Hilde, nicht von Opa Peters Kindern.", warumRu: "Нет, Том — сын Хильды, а не детей дедушки Петера." }] },
      { typ: "info", titel: "Geschafft!", baum: [],
        text: "Toll, {name}! Jetzt kennst du die ganze Familie. Male doch mit Mama oder Papa deinen eigenen Stammbaum! Wer ist deine Tante, wer dein Cousin, wer deine Uroma?",
        ru: "Отлично, {name}! Теперь ты знаешь всю семью. Нарисуй с мамой или папой своё семейное древо! Кто твоя тётя, кто двоюродный брат, кто прабабушка?" }
    ]
  },
  {
    id: "gesundheit", lb: "kg", kl: 2, lz: ["su.na.02"], name: "Gesund und munter", e: "🦷", farbe: "#2E9C5A", grund: "#E3F7EF",
    kurz: "Zähne putzen, Frühstück, Trinken, Erste Hilfe",
    schritte: [
      { typ: "info", titel: "Gesund und munter", bild: "🦷",
        text: "Hallo {name}! Heute geht es um deinen Körper. Was tut ihm gut? Zähne putzen, gutes Essen, viel trinken und Bewegung!",
        ru: "Привет, {name}! Сегодня поговорим о твоём теле. Что ему полезно? Чистить зубы, хорошо есть, много пить и двигаться!" },
      { typ: "info", titel: "Zähne putzen mit KAI", bild: "🪥",
        text: "Putze deine Zähne zweimal am Tag, morgens und abends, zwei bis drei Minuten lang. Die KAI-Regel hilft dir.",
        ru: "Чисти зубы два раза в день, утром и вечером, две-три минуты. Тебе поможет правило KAI.",
        fakten: [["K wie Kauflächen: oben auf den Backenzähnen hin und her.", "K — жевательные поверхности: сверху на коренных зубах туда-сюда."],
          ["A wie Außenflächen: mit kleinen Kreisen.", "A — внешние поверхности: маленькими кругами."],
          ["I wie Innenflächen: von Rot nach Weiß, also vom Zahnfleisch zum Zahn.", "I — внутренние поверхности: от красного к белому, то есть от десны к зубу."]] },
      { typ: "wahl", frage: "Wie oft am Tag putzt du die Zähne?", ru: "Сколько раз в день нужно чистить зубы?", bild: "🪥", optionen: [
        { t: "Zweimal: morgens und abends", ru: "Два раза: утром и вечером", ok: true, warum: "Genau! Morgens und abends vor dem Schlafen.", warumRu: "Точно! Утром и вечером перед сном." },
        { t: "Einmal in der Woche", ru: "Один раз в неделю", ok: false, warum: "Viel zu selten! Zweimal am Tag ist richtig.", warumRu: "Слишком редко! Правильно — два раза в день." },
        { t: "Nur wenn ich Süßes gegessen habe", ru: "Только если ел сладкое", ok: false, warum: "Nein, jeden Tag zweimal – morgens und abends.", warumRu: "Нет, каждый день два раза — утром и вечером." }] },
      { typ: "info", titel: "Ein gutes Frühstück", bild: "🥣",
        text: "Ein gutes Frühstück gibt dir Kraft für die Schule. Gut sind Vollkornbrot, Obst, Gemüse, Joghurt oder Müsli. Süßigkeiten machen nur kurz satt.",
        ru: "Хороший завтрак даёт силы для школы. Полезны цельнозерновой хлеб, фрукты, овощи, йогурт или мюсли. Сладости насыщают ненадолго." },
      { typ: "zuordnen", frage: "Was passt in eine gesunde Brotdose?", ru: "Что подходит для полезного ланч-бокса?",
        gruppen: [{ id: "ja", name: "Gesund", ru: "Полезно", bild: "🍎" }, { id: "selten", name: "Lieber selten", ru: "Лучше редко", bild: "🍭" }],
        dinge: [
          { t: "Apfel", ru: "Яблоко", gruppe: "ja" }, { t: "Vollkornbrot mit Käse", ru: "Хлеб с сыром", gruppe: "ja" },
          { t: "Gurke und Karotte", ru: "Огурец и морковь", gruppe: "ja" }, { t: "Schokoriegel", ru: "Шоколадный батончик", gruppe: "selten" },
          { t: "Gummibärchen", ru: "Мармеладные мишки", gruppe: "selten" }, { t: "Joghurt", ru: "Йогурт", gruppe: "ja" },
          { t: "Limonade", ru: "Лимонад", gruppe: "selten" }, { t: "Wasser", ru: "Вода", gruppe: "ja" }] },
      { typ: "daumen", satz: "Wasser ist das beste Getränk gegen Durst.", satzRu: "Вода — лучший напиток от жажды.", bild: "💧", ok: true,
        warum: "Stimmt! Kinder sollten über den Tag verteilt etwa einen Liter trinken, am besten Wasser.", warumRu: "Верно! Детям нужно пить около литра в день, лучше всего воду." },
      { typ: "info", titel: "Kleine Verletzungen", bild: "🩹",
        text: "Hingefallen? Bei einer kleinen Schürfwunde hilft ein Pflaster. Bei einer Beule hilft Kühlen. Sag immer einem Erwachsenen Bescheid!",
        ru: "Упал? При маленькой ссадине поможет пластырь. При шишке поможет холод. Всегда скажи взрослому!" },
      { typ: "info", titel: "Im Notfall: 112", bild: "🚑",
        text: "Wenn etwas Schlimmes passiert, hol sofort einen Erwachsenen. Ist keiner da, ruf die 112 an. Das ist der Notruf für Rettungswagen und Feuerwehr.",
        ru: "Если случилось что-то серьёзное, сразу позови взрослого. Если никого нет, звони 112. Это номер скорой помощи и пожарных.",
        fakten: [["Sag am Telefon: Wo ist es passiert?", "Скажи по телефону: где это случилось?"],
          ["Was ist passiert?", "Что случилось?"],
          ["Wer ruft an? Dann warten, bis dich jemand fragt.", "Кто звонит? Потом жди вопросов."],
          ["Die Polizei erreichst du mit 110.", "Полицию можно вызвать по номеру 110."]] },
      { typ: "wahl", frage: "Welche Nummer rufst du an, wenn ein Rettungswagen kommen soll?", ru: "Какой номер нужно набрать, чтобы вызвать скорую помощь?", bild: "🚑", optionen: [
        { t: "112", ru: "112", ok: true, warum: "Richtig! 112 ist der Notruf für Rettungswagen und Feuerwehr.", warumRu: "Правильно! 112 — номер скорой и пожарных." },
        { t: "123", ru: "123", ok: false, warum: "Nein, die Notrufnummer ist 112.", warumRu: "Нет, номер экстренной службы — 112." },
        { t: "999", ru: "999", ok: false, warum: "Das gilt in manchen anderen Ländern. In Deutschland ist es die 112.", warumRu: "Так в некоторых других странах. В Германии — 112." }] },
      { typ: "daumen", satz: "Zum Spaß darf man die 112 anrufen.", satzRu: "Можно звонить на 112 ради шутки.", bild: "📞", ok: false,
        warum: "Nein! Die 112 ist nur für echte Notfälle. Sonst kann den Menschen, die wirklich Hilfe brauchen, nicht geholfen werden.", warumRu: "Нет! 112 — только для настоящих экстренных случаев." },
      { typ: "info", titel: "Geschafft!", bild: "💪",
        text: "Super, {name}! Jetzt weißt du, was deinem Körper guttut. Hast du heute schon genug getrunken?",
        ru: "Супер, {name}! Теперь ты знаешь, что полезно твоему телу. Ты сегодня уже достаточно выпил(а)?" }
    ]
  },
  {
    id: "baeume-voegel", lb: "pt", kl: 2, lz: ["su.na.03"], name: "Bäume und Vögel", e: "🌳", farbe: "#8A6E2F", grund: "#F7F0DD",
    kurz: "Laub- und Nadelbäume, Zugvögel und Wintervögel",
    schritte: [
      { typ: "info", titel: "Draußen in der Natur", bild: "🌳",
        text: "Hallo {name}! Heute gehen wir in den Park. Wir schauen uns Bäume und Vögel an – und wie sie sich im Jahr verändern.",
        ru: "Привет, {name}! Сегодня мы идём в парк. Посмотрим на деревья и птиц и на то, как они меняются в течение года." },
      { typ: "info", titel: "Laubbäume und Nadelbäume", bild: "🍂",
        text: "Laubbäume haben breite Blätter. Im Herbst werden die Blätter bunt und fallen ab. Nadelbäume haben spitze Nadeln und bleiben meistens auch im Winter grün.",
        ru: "У лиственных деревьев широкие листья. Осенью листья становятся разноцветными и опадают. У хвойных деревьев острые иголки, и они обычно остаются зелёными и зимой.",
        fakten: [["Laubbäume: Eiche, Buche, Ahorn, Kastanie, Birke", "Лиственные: дуб, бук, клён, каштан, берёза"],
          ["Nadelbäume: Fichte, Kiefer, Tanne", "Хвойные: ель, сосна, пихта"]] },
      { typ: "zuordnen", frage: "Laubbaum oder Nadelbaum?", ru: "Лиственное или хвойное дерево?",
        gruppen: [{ id: "laub", name: "Laubbaum", ru: "Лиственное", bild: "🌳" }, { id: "nadel", name: "Nadelbaum", ru: "Хвойное", bild: "🌲" }],
        dinge: [
          { t: "Eiche", ru: "Дуб", gruppe: "laub" }, { t: "Fichte", ru: "Ель", gruppe: "nadel" }, { t: "Ahorn", ru: "Клён", gruppe: "laub" },
          { t: "Kiefer", ru: "Сосна", gruppe: "nadel" }, { t: "Birke", ru: "Берёза", gruppe: "laub" }, { t: "Tanne", ru: "Пихта", gruppe: "nadel" },
          { t: "Kastanie", ru: "Каштан", gruppe: "laub" }] },
      { typ: "wahl", frage: "Von welchem Baum kommt die Eichel?", ru: "С какого дерева жёлудь?", bild: "🌰", optionen: [
        { t: "Von der Eiche", ru: "С дуба", ok: true, warum: "Richtig! Eichhörnchen und Wildschweine fressen Eicheln gern.", warumRu: "Правильно! Белки и кабаны любят жёлуди." },
        { t: "Von der Fichte", ru: "С ели", ok: false, warum: "Die Fichte hat Zapfen. Die Eichel wächst an der Eiche.", warumRu: "У ели шишки. Жёлудь растёт на дубе." },
        { t: "Von der Birke", ru: "С берёзы", ok: false, warum: "Nein, die Eichel kommt von der Eiche.", warumRu: "Нет, жёлудь растёт на дубе." }] },
      { typ: "daumen", satz: "Die Fichte sticht, die Tanne nicht.", satzRu: "Ель колется, а пихта нет.", bild: "🌲", ok: true,
        warum: "Stimmt! Mit diesem Spruch kannst du sie unterscheiden: Fichtennadeln sind spitz, Tannennadeln eher weich.", warumRu: "Верно! Так их можно различить: иголки ели острые, а у пихты мягче." },
      { typ: "info", titel: "Zugvögel", bild: "🐦",
        text: "Manche Vögel fliegen im Herbst in den warmen Süden, bis nach Afrika. Sie heißen Zugvögel. Im Frühling kommen sie zurück.",
        ru: "Некоторые птицы осенью улетают на тёплый юг, даже в Африку. Их называют перелётными. Весной они возвращаются.",
        fakten: [["Zugvögel: Storch, Schwalbe, Kuckuck", "Перелётные: аист, ласточка, кукушка"],
          ["Diese Vögel bleiben bei uns: Amsel, Meise, Spatz", "Эти птицы остаются у нас: чёрный дрозд, синица, воробей"]] },
      { typ: "zuordnen", frage: "Fliegt der Vogel im Herbst weg oder bleibt er?", ru: "Птица осенью улетает или остаётся?",
        gruppen: [{ id: "weg", name: "Fliegt in den Süden", ru: "Улетает на юг", bild: "✈️" }, { id: "bleibt", name: "Bleibt im Winter hier", ru: "Остаётся зимой", bild: "❄️" }],
        dinge: [
          { t: "Storch", ru: "Аист", gruppe: "weg" }, { t: "Amsel", ru: "Чёрный дрозд", gruppe: "bleibt" }, { t: "Schwalbe", ru: "Ласточка", gruppe: "weg" },
          { t: "Meise", ru: "Синица", gruppe: "bleibt" }, { t: "Spatz", ru: "Воробей", gruppe: "bleibt" }, { t: "Kuckuck", ru: "Кукушка", gruppe: "weg" }] },
      { typ: "wahl", frage: "Warum fliegen Zugvögel im Herbst weg?", ru: "Почему перелётные птицы улетают осенью?", bild: "🌍", optionen: [
        { t: "Im Winter finden sie hier nicht genug Futter", ru: "Зимой им здесь не хватает корма", ok: true, warum: "Genau! Im Winter gibt es kaum Insekten. Im Süden finden sie genug zu fressen.", warumRu: "Точно! Зимой почти нет насекомых. На юге им хватает еды." },
        { t: "Sie machen Urlaub am Meer", ru: "Они едут в отпуск на море", ok: false, warum: "Lustige Idee! Aber sie fliegen weg, weil sie im Winter hier kein Futter finden.", warumRu: "Смешная идея! Но они улетают, потому что зимой здесь нет корма." },
        { t: "Sie mögen keinen Schnee anschauen", ru: "Они не любят смотреть на снег", ok: false, warum: "Nein – es geht ums Futter. Im Winter gibt es hier kaum Insekten.", warumRu: "Нет, дело в корме. Зимой здесь почти нет насекомых." }] },
      { typ: "info", titel: "Geschafft!", bild: "🍁",
        text: "Toll, {name}! Sammle beim nächsten Spaziergang doch drei verschiedene Blätter. Weißt du, von welchem Baum sie sind?",
        ru: "Отлично, {name}! На следующей прогулке собери три разных листа. Знаешь, с какого они дерева?" }
    ]
  }
  ,
  // ---------- NA-34: je GDSU-Perspektive weitere Themen für Kl. 1–2 ----------
  {
    id: "schulweg", lb: "rz", kl: 2, lz: ["su.ge.02"], name: "Mein Schulweg", e: "🚦", farbe: "#D7263D", grund: "#FFEDEF",
    kurz: "Ampel, Zebrastreifen, sicher über die Straße",
    schritte: [
      { typ: "info", titel: "Sicher zur Schule", bild: "🎒",
        text: "Hallo {name}! Auf dem Weg zur Schule gibt es Autos, Fahrräder und Ampeln. Mit ein paar Regeln kommst du immer sicher an.",
        ru: "Привет, {name}! По дороге в школу есть машины, велосипеды и светофоры. С несколькими правилами ты всегда дойдёшь безопасно." },
      { typ: "info", titel: "Die Ampel", bild: "🚦",
        text: "Bei Rot bleibst du stehen. Bei Grün darfst du gehen – aber schau trotzdem nach links und rechts.",
        ru: "На красный свет стой. На зелёный можно идти — но всё равно посмотри налево и направо.",
        fakten: [["Rot: stehen bleiben.", "Красный: стоять."], ["Grün: gehen, aber vorher schauen.", "Зелёный: идти, но сначала посмотреть."]] },
      { typ: "wahl", frage: "Die Fußgänger-Ampel ist rot. Was machst du?", ru: "Светофор для пешеходов красный. Что ты делаешь?", bild: "🔴", optionen: [
        { t: "Ich bleibe stehen.", ru: "Я стою.", ok: true, warum: "Richtig! Auch wenn kein Auto kommt.", warumRu: "Правильно! Даже если машин нет." },
        { t: "Ich renne schnell rüber.", ru: "Я быстро перебегаю.", ok: false, warum: "Nein, das ist gefährlich. Bei Rot bleibst du stehen.", warumRu: "Нет, это опасно. На красный свет стой." },
        { t: "Ich gehe, wenn andere gehen.", ru: "Я иду, если идут другие.", ok: false, warum: "Nein, schau auf die Ampel, nicht auf die anderen.", warumRu: "Нет, смотри на светофор, а не на других." }] },
      { typ: "info", titel: "Der Zebrastreifen", bild: "🦓",
        text: "Am Zebrastreifen müssen Autos anhalten. Warte am Rand, bis die Autos wirklich stehen. Dann gehst du zügig hinüber.",
        ru: "У «зебры» машины должны остановиться. Подожди у края, пока машины действительно остановятся. Потом быстро переходи." },
      { typ: "daumen", satz: "Zwischen parkenden Autos kann man gut über die Straße gehen.", satzRu: "Между припаркованными машинами удобно переходить улицу.", bild: "🚗", ok: false,
        warum: "Nein! Zwischen parkenden Autos sehen dich die Fahrer nicht. Geh lieber an der Ampel oder am Zebrastreifen.", warumRu: "Нет! Между машинами водители тебя не видят. Лучше иди на светофоре или по «зебре»." },
      { typ: "zuordnen", frage: "Was macht dich auf dem Schulweg sicher?", ru: "Что делает тебя безопасным на дороге в школу?",
        gruppen: [{ id: "ja", name: "Sicher", ru: "Безопасно", bild: "✅" }, { id: "nein", name: "Gefährlich", ru: "Опасно", bild: "⚠️" }],
        dinge: [
          { t: "Helle Jacke mit Reflektoren", ru: "Светлая куртка с отражателями", gruppe: "ja" }, { t: "An der Ampel warten", ru: "Ждать у светофора", gruppe: "ja" },
          { t: "Auf dem Gehweg gehen", ru: "Идти по тротуару", gruppe: "ja" }, { t: "Mit Kopfhörern über die Straße", ru: "Переходить в наушниках", gruppe: "nein" },
          { t: "Auf der Straße Ball spielen", ru: "Играть в мяч на дороге", gruppe: "nein" }, { t: "Hinter dem Bus hervorlaufen", ru: "Выбегать из-за автобуса", gruppe: "nein" }] },
      { typ: "info", titel: "Geschafft!", bild: "🏫",
        text: "Super, {name}! Geh deinen Schulweg einmal mit einem Erwachsenen ab und zeig ihm die sicheren Stellen.",
        ru: "Супер, {name}! Пройди свой путь в школу вместе со взрослым и покажи ему безопасные места." }
    ]
  },
  {
    id: "wasser", lb: "un", kl: 2, lz: ["su.na.01", "su.na.07"], name: "Wasser", e: "💧", farbe: "#3AA0E0", grund: "#E1F3FF",
    kurz: "Eis, Wasser, Dampf und Wasser sparen",
    schritte: [
      { typ: "info", titel: "Überall Wasser", bild: "💧",
        text: "Hallo {name}! Wasser ist im Meer, im Regen, im Schnee und sogar in dir. Ohne Wasser können Menschen, Tiere und Pflanzen nicht leben.",
        ru: "Привет, {name}! Вода есть в море, в дожде, в снеге и даже в тебе. Без воды не могут жить люди, животные и растения." },
      { typ: "info", titel: "Fest, flüssig, gasförmig", bild: "🧊",
        text: "Wird Wasser sehr kalt, wird es zu Eis. Wird es sehr heiß, wird es zu Dampf. Dazwischen ist es flüssig.",
        ru: "Когда вода очень холодная, она становится льдом. Когда очень горячая — паром. Между ними она жидкая.",
        fakten: [["Eis ist fest.", "Лёд — твёрдый."], ["Wasser ist flüssig.", "Вода — жидкая."], ["Dampf ist gasförmig.", "Пар — газообразный."]] },
      { typ: "wahl", frage: "Was passiert mit einem Eiswürfel in der Sonne?", ru: "Что происходит с кубиком льда на солнце?", bild: "🧊", optionen: [
        { t: "Er schmilzt zu Wasser.", ru: "Он тает и становится водой.", ok: true, warum: "Genau! Wärme macht aus Eis wieder Wasser.", warumRu: "Точно! Тепло превращает лёд снова в воду." },
        { t: "Er wird größer.", ru: "Он становится больше.", ok: false, warum: "Nein, in der Wärme schmilzt er.", warumRu: "Нет, в тепле он тает." },
        { t: "Er wird zu Stein.", ru: "Он превращается в камень.", ok: false, warum: "Nein, Eis wird in der Wärme zu Wasser.", warumRu: "Нет, лёд в тепле становится водой." }] },
      { typ: "info", titel: "Der Weg des Wassers", bild: "🌧️",
        text: "Die Sonne wärmt das Wasser im Meer. Es steigt als Dampf auf und bildet Wolken. Aus den Wolken fällt Regen. Der Regen fließt wieder ins Meer.",
        ru: "Солнце нагревает воду в море. Она поднимается паром и образует облака. Из облаков идёт дождь. Дождь снова стекает в море." },
      { typ: "daumen", satz: "Wolken bestehen aus winzigen Wassertröpfchen.", satzRu: "Облака состоят из крошечных капелек воды.", bild: "☁️", ok: true,
        warum: "Stimmt! Wenn die Tröpfchen zu schwer werden, fällt Regen.", warumRu: "Верно! Когда капельки становятся тяжёлыми, идёт дождь." },
      { typ: "zuordnen", frage: "Spart das Wasser?", ru: "Это экономит воду?",
        gruppen: [{ id: "ja", name: "Spart Wasser", ru: "Экономит", bild: "👍" }, { id: "nein", name: "Verschwendet Wasser", ru: "Тратит зря", bild: "👎" }],
        dinge: [
          { t: "Beim Zähneputzen den Hahn zudrehen", ru: "Закрывать кран, когда чистишь зубы", gruppe: "ja" }, { t: "Duschen statt baden", ru: "Принимать душ вместо ванны", gruppe: "ja" },
          { t: "Blumen mit Regenwasser gießen", ru: "Поливать цветы дождевой водой", gruppe: "ja" }, { t: "Wasser laufen lassen beim Spielen", ru: "Оставлять воду течь во время игры", gruppe: "nein" },
          { t: "Tropfenden Hahn nicht melden", ru: "Не сказать про капающий кран", gruppe: "nein" }] },
      { typ: "info", titel: "Geschafft!", bild: "🌊",
        text: "Toll, {name}! Lege zu Hause einen Eiswürfel auf einen Teller und schau, wie lange er braucht, bis er geschmolzen ist.",
        ru: "Здорово, {name}! Положи дома кубик льда на тарелку и посмотри, сколько времени он будет таять." }
    ]
  },
  {
    id: "frueher", lb: "ex", kl: 2, lz: ["su.hi.03", "su.hi.02"], name: "Früher und heute", e: "🕰️", farbe: "#8A6E2F", grund: "#F7F0DD",
    kurz: "Wie Kinder früher gelebt haben",
    schritte: [
      { typ: "info", titel: "Als Oma klein war", bild: "👵",
        text: "Hallo {name}! Deine Großeltern waren auch einmal Kinder. Damals war vieles anders als heute. Lass uns vergleichen!",
        ru: "Привет, {name}! Твои бабушка и дедушка тоже когда-то были детьми. Тогда многое было иначе, чем сегодня. Давай сравним!" },
      { typ: "info", titel: "Telefon früher und heute", bild: "☎️",
        text: "Früher hatte das Telefon eine Wählscheibe und hing mit einem Kabel an der Wand. Heute haben viele ein Handy in der Tasche.",
        ru: "Раньше у телефона был диск, и он висел на стене с проводом. Сегодня у многих телефон в кармане." },
      { typ: "zuordnen", frage: "Früher oder heute?", ru: "Раньше или сегодня?",
        gruppen: [{ id: "f", name: "Früher", ru: "Раньше", bild: "🕰️" }, { id: "h", name: "Heute", ru: "Сегодня", bild: "📱" }],
        dinge: [
          { t: "Tafel und Kreide in jeder Klasse", ru: "Доска и мел в каждом классе", gruppe: "f" }, { t: "Wäsche mit dem Waschbrett waschen", ru: "Стирать бельё на стиральной доске", gruppe: "f" },
          { t: "Briefe mit der Post schicken, um zu reden", ru: "Посылать письма, чтобы поговорить", gruppe: "f" }, { t: "Videoanruf mit dem Tablet", ru: "Видеозвонок с планшета", gruppe: "h" },
          { t: "Waschmaschine", ru: "Стиральная машина", gruppe: "h" }, { t: "Musik aus dem Handy", ru: "Музыка из телефона", gruppe: "h" }] },
      { typ: "daumen", satz: "Manche Dinge machen Kinder früher und heute gleich: zum Beispiel Fangen spielen.", satzRu: "Некоторые вещи дети делали раньше и делают сегодня одинаково: например, играют в догонялки.", bild: "🏃", ok: true,
        warum: "Stimmt! Fangen, Verstecken und Seilspringen gibt es schon sehr lange.", warumRu: "Верно! Догонялки, прятки и прыжки через скакалку существуют уже очень давно." },
      { typ: "info", titel: "Meine eigene Geschichte", bild: "👶",
        text: "Auch du hast schon eine Geschichte: Erst warst du ein Baby, dann ein Kindergartenkind, jetzt gehst du zur Schule.",
        ru: "У тебя тоже уже есть своя история: сначала ты был(а) малышом, потом ходил(а) в садик, а теперь ходишь в школу." },
      { typ: "wahl", frage: "Was kommt zuerst?", ru: "Что было сначала?", bild: "👶", optionen: [
        { t: "Baby", ru: "Малыш", ok: true, warum: "Genau! Zuerst ist jeder ein Baby, dann ein Kindergartenkind, dann ein Schulkind.", warumRu: "Точно! Сначала каждый малыш, потом ребёнок в садике, потом школьник." },
        { t: "Schulkind", ru: "Школьник", ok: false, warum: "Nein, Schulkind kommt erst nach dem Kindergarten.", warumRu: "Нет, школьником становятся после садика." },
        { t: "Kindergartenkind", ru: "Ребёнок в садике", ok: false, warum: "Fast! Davor warst du ein Baby.", warumRu: "Почти! До этого ты был(а) малышом." }] },
      { typ: "info", titel: "Geschafft!", bild: "📷",
        text: "Super, {name}! Frag einen Erwachsenen: Womit hast du gespielt, als du so alt warst wie ich?",
        ru: "Супер, {name}! Спроси взрослого: «Во что ты играл(а), когда был(а) в моём возрасте?»" }
    ]
  },
  {
    id: "regeln", lb: "zl", kl: 2, lz: ["su.so.03", "et.mi.01"], name: "Regeln und Streit", e: "🤝", farbe: "#7B55B8", grund: "#EFE6FF",
    kurz: "Warum es Regeln gibt und wie man Streit löst",
    schritte: [
      { typ: "info", titel: "Wozu Regeln?", bild: "📋",
        text: "Hallo {name}! In der Klasse, beim Spielen und zu Hause gibt es Regeln. Sie helfen, dass sich alle wohlfühlen und niemand verletzt wird.",
        ru: "Привет, {name}! В классе, в игре и дома есть правила. Они помогают, чтобы всем было хорошо и никто не пострадал." },
      { typ: "wahl", frage: "Warum meldet man sich im Unterricht?", ru: "Зачем на уроке поднимают руку?", bild: "🙋", optionen: [
        { t: "Damit nicht alle gleichzeitig reden.", ru: "Чтобы все не говорили одновременно.", ok: true, warum: "Richtig! So kann jeder gehört werden.", warumRu: "Правильно! Так каждого могут услышать." },
        { t: "Weil die Arme müde sind.", ru: "Потому что руки устали.", ok: false, warum: "Nein, das Melden hilft, dass alle drankommen.", warumRu: "Нет, поднятая рука помогает, чтобы все могли сказать." },
        { t: "Damit es lauter wird.", ru: "Чтобы стало громче.", ok: false, warum: "Nein, es wird dadurch ruhiger.", warumRu: "Нет, так становится тише." }] },
      { typ: "info", titel: "Wenn es Streit gibt", bild: "🗣️",
        text: "Streit passiert jedem. Wichtig ist, wie man ihn löst: erst durchatmen, dann sagen, was man fühlt, zuhören und zusammen eine Lösung suchen.",
        ru: "Ссоры бывают у всех. Важно, как их решать: сначала выдохнуть, потом сказать, что чувствуешь, выслушать и вместе найти решение.",
        fakten: [["1. Stopp sagen und durchatmen.", "1. Сказать «стоп» и выдохнуть."], ["2. Sagen, was ich fühle.", "2. Сказать, что я чувствую."],
          ["3. Dem anderen zuhören.", "3. Выслушать другого."], ["4. Eine Lösung suchen, die für beide passt.", "4. Найти решение, которое подходит обоим."]] },
      { typ: "daumen", satz: "Wenn mich jemand ärgert, darf ich ihn schlagen.", satzRu: "Если меня кто-то дразнит, я могу его ударить.", bild: "✋", ok: false,
        warum: "Nein! Schlagen ist nie eine Lösung. Sag deutlich „Stopp!“ und hol dir Hilfe bei einem Erwachsenen.", warumRu: "Нет! Драка — никогда не решение. Скажи чётко «Стоп!» и позови взрослого." },
      { typ: "zuordnen", frage: "Hilft das bei einem Streit?", ru: "Это помогает при ссоре?",
        gruppen: [{ id: "ja", name: "Hilft", ru: "Помогает", bild: "🤝" }, { id: "nein", name: "Macht es schlimmer", ru: "Делает хуже", bild: "💥" }],
        dinge: [
          { t: "Zuhören", ru: "Слушать", gruppe: "ja" }, { t: "Abwechseln", ru: "Делать по очереди", gruppe: "ja" }, { t: "Sich entschuldigen", ru: "Извиниться", gruppe: "ja" },
          { t: "Anschreien", ru: "Кричать", gruppe: "nein" }, { t: "Auslachen", ru: "Высмеивать", gruppe: "nein" }, { t: "Spielzeug wegnehmen", ru: "Отнимать игрушку", gruppe: "nein" }] },
      { typ: "info", titel: "Geschafft!", bild: "🌈",
        text: "Toll, {name}! Überlegt euch zu Hause eine Familienregel, die allen wichtig ist.",
        ru: "Здорово, {name}! Придумайте дома одно семейное правило, которое важно для всех." }
    ]
  }
  ,
  {
    id: "bauen", lb: "un", kl: 2, lz: ["su.te.01", "su.te.02"], name: "Bauen und Brücken", e: "🌉", farbe: "#E8A33D", grund: "#FFF1D9",
    kurz: "Was hält? Türme, Brücken und Dreiecke",
    schritte: [
      { typ: "info", titel: "Wir bauen!", bild: "🏗️",
        text: "Hallo {name}! Benno der Biber baut Dämme. Menschen bauen Häuser, Türme und Brücken. Aber wie baut man etwas, das nicht umfällt?",
        ru: "Привет, {name}! Бобёр Бенно строит плотины. Люди строят дома, башни и мосты. Но как построить то, что не упадёт?" },
      { typ: "info", titel: "Ein Turm braucht einen festen Fuß", bild: "🗼",
        text: "Ein Turm steht sicher, wenn er unten breit ist und oben schmal. Schwere Steine kommen nach unten, leichte nach oben.",
        ru: "Башня стоит надёжно, если внизу она широкая, а наверху узкая. Тяжёлые камни — вниз, лёгкие — наверх." },
      { typ: "wahl", frage: "Welcher Turm fällt am wenigsten um?", ru: "Какая башня падает меньше всего?", bild: "🧱", optionen: [
        { t: "Unten breit, oben schmal", ru: "Внизу широкая, наверху узкая", ok: true, warum: "Richtig! Ein breiter Fuß macht den Turm standfest.", warumRu: "Правильно! Широкое основание делает башню устойчивой." },
        { t: "Unten schmal, oben breit", ru: "Внизу узкая, наверху широкая", ok: false, warum: "Der kippt leicht um – oben ist zu viel Gewicht.", warumRu: "Она легко опрокинется — наверху слишком тяжело." },
        { t: "Ganz dünn und sehr hoch", ru: "Очень тонкая и очень высокая", ok: false, warum: "Der wackelt schon beim kleinsten Stoß.", warumRu: "Она качается от малейшего толчка." }] },
      { typ: "info", titel: "Das starke Dreieck", bild: "🔺",
        text: "Ein Viereck aus Stäben lässt sich leicht zusammendrücken. Ein Dreieck nicht! Darum sieht man an Brücken und Kränen viele Dreiecke.",
        ru: "Квадрат из палочек легко сжать. Треугольник — нет! Поэтому на мостах и кранах много треугольников." },
      { typ: "daumen", satz: "Ein Blatt Papier trägt mehr, wenn man es zu einer Ziehharmonika faltet.", satzRu: "Лист бумаги выдержит больше, если сложить его гармошкой.", bild: "📄", ok: true,
        warum: "Stimmt! Die Falten machen das Papier steif. Probier es aus: Leg ein gefaltetes Blatt zwischen zwei Bücher und stell etwas darauf.", warumRu: "Верно! Складки делают бумагу жёсткой. Попробуй: положи сложенный лист между двумя книгами и поставь сверху что-нибудь." },
      { typ: "zuordnen", frage: "Was ist ein Bauwerk von Menschen, was hat die Natur gemacht?", ru: "Что построили люди, а что создала природа?",
        gruppen: [{ id: "m", name: "Von Menschen gebaut", ru: "Построено людьми", bild: "👷" }, { id: "n", name: "Natur", ru: "Природа", bild: "🌿" }],
        dinge: [
          { t: "Brücke", ru: "Мост", gruppe: "m" }, { t: "Leuchtturm", ru: "Маяк", gruppe: "m" }, { t: "Hochhaus", ru: "Небоскрёб", gruppe: "m" },
          { t: "Berg", ru: "Гора", gruppe: "n" }, { t: "Vogelnest", ru: "Птичье гнездо", gruppe: "n" }, { t: "Biberdamm", ru: "Бобровая плотина", gruppe: "n" }] },
      { typ: "info", titel: "Geschafft!", bild: "🦫",
        text: "Super, {name}! Bau mit Bechern, Bauklötzen oder Papier einen Turm. Wie hoch schaffst du es? Auf der Insel wartet Bennos Bauplatz.",
        ru: "Супер, {name}! Построй башню из стаканчиков, кубиков или бумаги. Насколько высокой она получится? На острове ждёт стройплощадка Бенно." }
    ]
  },
  {
    id: "pflanzen", lb: "pt", kl: 2, lz: ["su.na.05"], name: "Pflanzen wachsen", e: "🌷", farbe: "#2E9C5A", grund: "#E3F7EF",
    kurz: "Samen, Keimen, Frühblüher",
    schritte: [
      { typ: "info", titel: "Aus klein wird groß", bild: "🌱",
        text: "Hallo {name}! Jede große Pflanze war einmal ein kleiner Samen. Wenn er Wasser, Wärme und Licht bekommt, beginnt er zu keimen.",
        ru: "Привет, {name}! Каждое большое растение когда-то было маленьким семечком. Когда оно получает воду, тепло и свет, оно начинает прорастать." },
      { typ: "info", titel: "Was braucht eine Pflanze?", bild: "☀️",
        text: "Pflanzen brauchen Wasser, Licht, Luft und Erde. Ohne Licht werden sie blass und dünn.",
        ru: "Растениям нужны вода, свет, воздух и земля. Без света они становятся бледными и тонкими.",
        fakten: [["Wasser 💧", "Вода 💧"], ["Licht ☀️", "Свет ☀️"], ["Luft 🌬️", "Воздух 🌬️"], ["Erde 🪴", "Земля 🪴"]] },
      { typ: "wahl", frage: "Was kommt zuerst aus dem Samen?", ru: "Что первым появляется из семечка?", bild: "🫘", optionen: [
        { t: "Die Wurzel", ru: "Корень", ok: true, warum: "Genau! Zuerst wächst die Wurzel nach unten, dann der Spross nach oben.", warumRu: "Точно! Сначала корень растёт вниз, потом росток вверх." },
        { t: "Die Blüte", ru: "Цветок", ok: false, warum: "Nein, die Blüte kommt ganz zum Schluss.", warumRu: "Нет, цветок появляется в самом конце." },
        { t: "Die Frucht", ru: "Плод", ok: false, warum: "Nein, Früchte wachsen erst, wenn die Pflanze groß ist.", warumRu: "Нет, плоды появляются, когда растение уже большое." }] },
      { typ: "info", titel: "Frühblüher", bild: "🌷",
        text: "Schneeglöckchen, Krokusse und Tulpen blühen schon im Frühling, wenn die Bäume noch keine Blätter haben. Ihre Kraft haben sie in einer Zwiebel unter der Erde gespeichert.",
        ru: "Подснежники, крокусы и тюльпаны цветут уже весной, когда на деревьях ещё нет листьев. Силу они запасли в луковице под землёй." },
      { typ: "daumen", satz: "Eine Bohne keimt auch auf feuchter Watte.", satzRu: "Фасоль прорастает и на влажной вате.", bild: "🫘", ok: true,
        warum: "Stimmt! Probier es aus: Leg eine Bohne auf feuchte Watte und halte sie ein paar Tage feucht.", warumRu: "Верно! Попробуй: положи фасолину на влажную вату и держи её влажной несколько дней." },
      { typ: "info", titel: "Geschafft!", bild: "🪴",
        text: "Toll, {name}! Säe Kresse oder eine Bohne und schau jeden Tag nach. Auf der Insel wächst dein Wissensbaum auch jeden Tag ein bisschen.",
        ru: "Здорово, {name}! Посади кресс-салат или фасоль и смотри каждый день. На острове твоё дерево знаний тоже растёт каждый день." }
    ]
  },
  // ---------- NA-34 Teil 3: Themen für Klasse 3–4 ----------
  {
    id: "sinne", lb: "kg", kl: 3, lz: ["su.na.02"], name: "Meine fünf Sinne", e: "👀", farbe: "#C2337A", grund: "#FDEAF3",
    kurz: "Sehen, hören, riechen, schmecken, tasten",
    schritte: [
      { typ: "info", titel: "Fünf Sinne", bild: "🧒",
        text: "Hallo {name}! Mit deinen Sinnen merkst du, was um dich herum passiert. Du hast fünf: sehen, hören, riechen, schmecken und tasten.",
        ru: "Привет, {name}! С помощью органов чувств ты замечаешь, что происходит вокруг. Их пять: зрение, слух, обоняние, вкус и осязание.",
        fakten: [["Augen 👀 sehen", "Глаза 👀 видят"], ["Ohren 👂 hören", "Уши 👂 слышат"], ["Nase 👃 riecht", "Нос 👃 чувствует запах"], ["Zunge 👅 schmeckt", "Язык 👅 чувствует вкус"], ["Haut ✋ tastet", "Кожа ✋ осязает"]] },
      { typ: "zuordnen", frage: "Mit welchem Sinn merkst du das?", ru: "Каким чувством ты это замечаешь?",
        gruppen: [{ id: "a", name: "Sehen", ru: "Зрение", bild: "👀" }, { id: "o", name: "Hören", ru: "Слух", bild: "👂" }, { id: "n", name: "Riechen", ru: "Обоняние", bild: "👃" }],
        dinge: [
          { t: "Regenbogen", ru: "Радуга", gruppe: "a" }, { t: "Ampel ist rot", ru: "Красный свет светофора", gruppe: "a" },
          { t: "Vogelgezwitscher", ru: "Пение птиц", gruppe: "o" }, { t: "Klingel", ru: "Звонок", gruppe: "o" },
          { t: "Frisches Brot", ru: "Свежий хлеб", gruppe: "n" }, { t: "Rauch", ru: "Дым", gruppe: "n" }] },
      { typ: "wahl", frage: "Womit fühlst du, ob etwas heiß oder kalt ist?", ru: "Чем ты чувствуешь, горячее что-то или холодное?", bild: "✋", optionen: [
        { t: "Mit der Haut", ru: "Кожей", ok: true, warum: "Richtig! In der Haut sitzen viele kleine Fühler für Wärme, Kälte, Druck und Schmerz.", warumRu: "Правильно! В коже много маленьких датчиков тепла, холода, давления и боли." },
        { t: "Mit den Ohren", ru: "Ушами", ok: false, warum: "Mit den Ohren hörst du. Wärme und Kälte fühlt die Haut.", warumRu: "Ушами ты слышишь. Тепло и холод чувствует кожа." },
        { t: "Mit der Nase", ru: "Носом", ok: false, warum: "Mit der Nase riechst du. Wärme und Kälte fühlt die Haut.", warumRu: "Носом ты чувствуешь запахи. Тепло и холод чувствует кожа." }] },
      { typ: "daumen", satz: "Wenn die Nase verstopft ist, schmeckt das Essen nach weniger.", satzRu: "Когда нос заложен, еда кажется менее вкусной.", bild: "🤧", ok: true,
        warum: "Stimmt! Riechen und Schmecken arbeiten zusammen. Mit Schnupfen schmeckt vieles fad.", warumRu: "Верно! Обоняние и вкус работают вместе. При насморке многое кажется пресным." },
      { typ: "daumen", satz: "Man darf ruhig direkt in die Sonne schauen.", satzRu: "В солнце можно смотреть прямо.", bild: "☀️", ok: false,
        warum: "Nein! Das helle Sonnenlicht kann die Augen schwer verletzen. Auch laute Musik direkt am Ohr schadet den Ohren.", warumRu: "Нет! Яркий солнечный свет может сильно повредить глаза. Громкая музыка прямо у уха тоже вредит ушам." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Toll, {name}! Probier mit geschlossenen Augen: Erkennst du Dinge nur durch Tasten, Riechen oder Hören?",
        ru: "Здорово, {name}! Попробуй с закрытыми глазами: узнаешь ли ты вещи только на ощупь, по запаху или по звуку?" }
    ]
  },
  {
    id: "wald", lb: "pt", kl: 3, lz: ["su.na.08"], name: "Lebensraum Wald und Wiese", e: "🌲", farbe: "#2E7D4F", grund: "#E3F3E8",
    kurz: "Stockwerke des Waldes, wer frisst wen, Waldregeln",
    schritte: [
      { typ: "info", titel: "Der Wald hat Stockwerke", bild: "🌲",
        text: "Hallo {name}! Ein Wald ist wie ein Haus mit Stockwerken. Ganz unten der Boden mit Moos und Pilzen, darüber Kräuter, dann Sträucher und ganz oben die Baumkronen.",
        ru: "Привет, {name}! Лес как дом с этажами. Внизу почва с мхом и грибами, над ней травы, потом кустарники, а на самом верху кроны деревьев.",
        fakten: [["Baumschicht 🌳", "Ярус деревьев 🌳"], ["Strauchschicht 🌿", "Ярус кустарников 🌿"], ["Krautschicht 🌱", "Травяной ярус 🌱"], ["Moos- und Bodenschicht 🍄", "Мох и почва 🍄"]] },
      { typ: "zuordnen", frage: "Wo lebt das Tier am liebsten?", ru: "Где это животное любит жить больше всего?",
        gruppen: [{ id: "w", name: "Im Wald", ru: "В лесу", bild: "🌲" }, { id: "i", name: "Auf der Wiese", ru: "На лугу", bild: "🌼" }],
        dinge: [
          { t: "Specht", ru: "Дятел", gruppe: "w" }, { t: "Eichhörnchen", ru: "Белка", gruppe: "w" }, { t: "Wildschwein", ru: "Кабан", gruppe: "w" },
          { t: "Grashüpfer", ru: "Кузнечик", gruppe: "i" }, { t: "Feldhase", ru: "Заяц-русак", gruppe: "i" }, { t: "Biene an Blüten", ru: "Пчела на цветах", gruppe: "i" }] },
      { typ: "wahl", frage: "Wer frisst wen? Was passt: Gras → Hase → …", ru: "Кто кого ест? Что подходит: трава → заяц → …", bild: "🐇", optionen: [
        { t: "Fuchs", ru: "Лиса", ok: true, warum: "Richtig! Das ist eine Nahrungskette: Der Hase frisst Gras, der Fuchs frisst den Hasen.", warumRu: "Правильно! Это пищевая цепь: заяц ест траву, лиса ест зайца." },
        { t: "Blume", ru: "Цветок", ok: false, warum: "Blumen fressen nicht – sie werden gefressen. Nach dem Hasen kommt ein Jäger wie der Fuchs.", warumRu: "Цветы не едят — их едят. После зайца идёт хищник, например лиса." },
        { t: "Regenwurm", ru: "Дождевой червь", ok: false, warum: "Der Regenwurm frisst keine Hasen. Er frisst welke Blätter.", warumRu: "Дождевой червь не ест зайцев. Он ест опавшие листья." }] },
      { typ: "daumen", satz: "Regenwürmer machen aus alten Blättern neue Erde.", satzRu: "Дождевые черви превращают старые листья в новую землю.", bild: "🍂", ok: true,
        warum: "Stimmt! Würmer, Asseln und Pilze zerlegen Laub. So entsteht guter Boden für neue Pflanzen.", warumRu: "Верно! Черви, мокрицы и грибы разлагают листья. Так появляется хорошая почва для новых растений." },
      { typ: "daumen", satz: "Im Wald darf man laut sein und Müll liegen lassen.", satzRu: "В лесу можно шуметь и оставлять мусор.", bild: "🦌", ok: false,
        warum: "Nein! Im Wald sind wir Gäste: leise sein, auf den Wegen bleiben, Müll wieder mitnehmen.", warumRu: "Нет! В лесу мы гости: ведём себя тихо, остаёмся на тропинках, мусор забираем с собой." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Super, {name}! Geh mal in den Wald oder auf eine Wiese und zähle, wie viele Tiere du entdeckst.",
        ru: "Супер, {name}! Сходи в лес или на луг и посчитай, сколько животных ты увидишь." }
    ]
  },
  {
    id: "kompass", lb: "rz", kl: 3, lz: ["su.ge.03"], name: "Himmelsrichtungen", e: "🧭", farbe: "#2F6FB8", grund: "#E5EFFB",
    kurz: "Norden, Osten, Süden, Westen, Kompass und Karte",
    schritte: [
      { typ: "info", titel: "Vier Himmelsrichtungen", bild: "🧭",
        text: "Hallo {name}! Es gibt vier Himmelsrichtungen: Norden, Osten, Süden und Westen. Merksatz im Uhrzeigersinn: Nie Ohne Seife Waschen.",
        ru: "Привет, {name}! Есть четыре стороны света: север, восток, юг и запад. По часовой стрелке: север, восток, юг, запад.",
        fakten: [["N – Norden", "С – север"], ["O – Osten", "В – восток"], ["S – Süden", "Ю – юг"], ["W – Westen", "З – запад"]] },
      { typ: "wahl", frage: "Wohin zeigt die Nadel eines Kompasses?", ru: "Куда показывает стрелка компаса?", bild: "🧭", optionen: [
        { t: "Nach Norden", ru: "На север", ok: true, warum: "Richtig! Die Kompassnadel ist ein kleiner Magnet und zeigt immer nach Norden.", warumRu: "Правильно! Стрелка компаса — маленький магнит, она всегда показывает на север." },
        { t: "Nach Süden", ru: "На юг", ok: false, warum: "Die bunte Spitze der Nadel zeigt nach Norden. Süden ist genau gegenüber.", warumRu: "Цветной конец стрелки показывает на север. Юг — точно напротив." },
        { t: "Zum nächsten Haus", ru: "К ближайшему дому", ok: false, warum: "Nein, die Nadel ist ein Magnet und zeigt nach Norden.", warumRu: "Нет, стрелка — магнит и показывает на север." }] },
      { typ: "wahl", frage: "Wo geht die Sonne am Morgen auf?", ru: "Где утром встаёт солнце?", bild: "🌅", optionen: [
        { t: "Im Osten", ru: "На востоке", ok: true, warum: "Genau! Im Osten geht sie auf, mittags steht sie bei uns im Süden, im Westen geht sie unter.", warumRu: "Точно! На востоке оно встаёт, в полдень у нас оно на юге, на западе садится." },
        { t: "Im Westen", ru: "На западе", ok: false, warum: "Im Westen geht die Sonne abends unter. Auf geht sie im Osten.", warumRu: "На западе солнце садится вечером. Встаёт оно на востоке." },
        { t: "Im Norden", ru: "На севере", ok: false, warum: "Im Norden steht die Sonne bei uns nie. Sie geht im Osten auf.", warumRu: "На севере у нас солнца не бывает. Оно встаёт на востоке." }] },
      { typ: "daumen", satz: "Auf den meisten Landkarten ist Norden oben.", satzRu: "На большинстве карт север наверху.", bild: "🗺️", ok: true,
        warum: "Stimmt! Darum ist auf der Karte rechts Osten, unten Süden und links Westen.", warumRu: "Верно! Поэтому на карте справа восток, внизу юг, слева запад." },
      { typ: "zuordnen", frage: "Norden ist oben. Wo liegt das?", ru: "Север наверху. Где это находится?",
        gruppen: [{ id: "o", name: "Rechts = Osten", ru: "Справа = восток", bild: "➡️" }, { id: "w", name: "Links = Westen", ru: "Слева = запад", bild: "⬅️" }],
        dinge: [
          { t: "Wo die Sonne aufgeht", ru: "Где встаёт солнце", gruppe: "o" }, { t: "Rechte Kartenseite", ru: "Правая сторона карты", gruppe: "o" },
          { t: "Wo die Sonne untergeht", ru: "Где садится солнце", gruppe: "w" }, { t: "Linke Kartenseite", ru: "Левая сторона карты", gruppe: "w" }] },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Prima, {name}! Stell dich morgens so hin, dass die Sonne vor dir ist. Dann schaust du nach Osten – wo ist Norden?",
        ru: "Отлично, {name}! Встань утром так, чтобы солнце было перед тобой. Тогда ты смотришь на восток — где север?" }
    ]
  },
  {
    id: "schwimmen", lb: "un", kl: 3, lz: ["su.na.07"], name: "Schwimmen und Sinken", e: "⛵", farbe: "#1F8FB8", grund: "#E2F4FB",
    kurz: "Was schwimmt? Warum schwimmt ein Schiff aus Stahl?",
    schritte: [
      { typ: "info", titel: "Ab ins Wasser!", bild: "🛁",
        text: "Hallo {name}! Manche Dinge schwimmen, andere gehen unter. Das hängt nicht nur davon ab, wie schwer sie sind, sondern auch vom Stoff und von der Form.",
        ru: "Привет, {name}! Одни вещи плавают, другие тонут. Это зависит не только от веса, но и от материала и формы." },
      { typ: "zuordnen", frage: "Schwimmt es oder sinkt es?", ru: "Плавает или тонет?",
        gruppen: [{ id: "s", name: "Schwimmt", ru: "Плавает", bild: "🛟" }, { id: "u", name: "Sinkt", ru: "Тонет", bild: "⬇️" }],
        dinge: [
          { t: "Korken", ru: "Пробка", gruppe: "s" }, { t: "Holzstück", ru: "Кусок дерева", gruppe: "s" }, { t: "Apfel", ru: "Яблоко", gruppe: "s" },
          { t: "Nagel", ru: "Гвоздь", gruppe: "u" }, { t: "Stein", ru: "Камень", gruppe: "u" }, { t: "Schlüssel", ru: "Ключ", gruppe: "u" }] },
      { typ: "wahl", frage: "Ein Klumpen Knete sinkt. Wie kann er schwimmen?", ru: "Комок пластилина тонет. Как сделать, чтобы он плавал?", bild: "🥣", optionen: [
        { t: "Zu einem Schiffchen formen", ru: "Слепить лодочку", ok: true, warum: "Richtig! Als Schiffchen drückt die Knete viel Wasser zur Seite. Das Wasser trägt sie.", warumRu: "Правильно! Лодочка отодвигает много воды. Вода её держит." },
        { t: "Zu einer festen Kugel rollen", ru: "Скатать плотный шарик", ok: false, warum: "Eine Kugel sinkt sofort. Erst eine hohle Form mit Rand schwimmt.", warumRu: "Шарик сразу тонет. Плавает только полая форма с бортиками." },
        { t: "Ganz fest drücken", ru: "Сильно сжать", ok: false, warum: "Dann bleibt sie ein Klumpen und sinkt. Die Form muss sich ändern.", warumRu: "Тогда он останется комком и утонет. Нужно изменить форму." }] },
      { typ: "daumen", satz: "Ein großes Schiff aus Stahl kann schwimmen.", satzRu: "Большой корабль из стали может плавать.", bild: "🚢", ok: true,
        warum: "Stimmt! Ein Schiff ist innen hohl und voller Luft. Es drückt so viel Wasser weg, dass das Wasser es trägt.", warumRu: "Верно! Корабль внутри пустой и полон воздуха. Он вытесняет столько воды, что вода его держит." },
      { typ: "daumen", satz: "Alles, was schwer ist, geht unter.", satzRu: "Всё тяжёлое тонет.", bild: "🪵", ok: false,
        warum: "Nein! Ein dicker Baumstamm ist sehr schwer und schwimmt trotzdem. Ein kleiner Nagel ist leicht und sinkt.", warumRu: "Нет! Толстое бревно очень тяжёлое и всё равно плавает. Маленький гвоздь лёгкий и тонет." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Klasse, {name}! Probier es mit einer Schüssel Wasser aus: Schätze erst, dann teste. Frag vorher, was du ins Wasser legen darfst.",
        ru: "Класс, {name}! Попробуй с миской воды: сначала угадай, потом проверь. Спроси заранее, что можно класть в воду." }
    ]
  },
  {
    id: "feuer", lb: "un", kl: 4, lz: ["su.na.09"], name: "Feuer und Brandschutz", e: "🔥", farbe: "#D2502A", grund: "#FDECE4",
    kurz: "Was ein Feuer braucht und was du im Notfall tust",
    schritte: [
      { typ: "info", titel: "Was braucht ein Feuer?", bild: "🔥",
        text: "Hallo {name}! Ein Feuer brennt nur, wenn drei Dinge zusammenkommen: etwas, das brennt, Luft und genug Hitze. Fehlt eins davon, geht es aus.",
        ru: "Привет, {name}! Огонь горит, только если есть три вещи: то, что горит, воздух и достаточно тепла. Если одного нет, огонь гаснет.",
        fakten: [["Brennstoff 🪵", "Горючее 🪵"], ["Luft 🌬️", "Воздух 🌬️"], ["Hitze 🌡️", "Жар 🌡️"]] },
      { typ: "wahl", frage: "Warum geht eine Kerze unter einem Glas aus?", ru: "Почему свеча под стаканом гаснет?", bild: "🕯️", optionen: [
        { t: "Ihr fehlt die Luft", ru: "Ей не хватает воздуха", ok: true, warum: "Richtig! Unter dem Glas ist die Luft bald verbraucht. Ohne Luft kein Feuer.", warumRu: "Правильно! Под стаканом воздух быстро заканчивается. Без воздуха нет огня." },
        { t: "Das Glas ist zu kalt", ru: "Стакан слишком холодный", ok: false, warum: "Nein, es liegt an der Luft. Unter dem Glas fehlt sie bald.", warumRu: "Нет, дело в воздухе. Под стаканом его скоро не хватает." },
        { t: "Die Kerze ist müde", ru: "Свеча устала", ok: false, warum: "Kerzen werden nicht müde! Ihr fehlt die Luft.", warumRu: "Свечи не устают! Ей не хватает воздуха." }] },
      { typ: "wahl", frage: "Es brennt! Welche Nummer rufst du an?", ru: "Пожар! По какому номеру ты звонишь?", bild: "🚒", optionen: [
        { t: "112", ru: "112", ok: true, warum: "Genau! 112 ist die Nummer für Feuerwehr und Rettungsdienst – in ganz Europa.", warumRu: "Точно! 112 — номер пожарных и скорой помощи во всей Европе." },
        { t: "110", ru: "110", ok: false, warum: "110 ist die Polizei. Bei Feuer rufst du 112.", warumRu: "110 — это полиция. При пожаре звонишь 112." },
        { t: "123", ru: "123", ok: false, warum: "Diese Nummer gibt es nicht als Notruf. Bei Feuer: 112.", warumRu: "Такого номера экстренной помощи нет. При пожаре: 112." }] },
      { typ: "daumen", satz: "Wenn es brennt, verstecke ich mich unter dem Bett.", satzRu: "Если пожар, я прячусь под кроватью.", bild: "🛏️", ok: false,
        warum: "Nein! Nie verstecken. Raus aus dem Raum, Tür zumachen, Erwachsene rufen und 112 wählen. Bei Rauch tief am Boden bleiben.", warumRu: "Нет! Никогда не прячься. Выйди из комнаты, закрой дверь, позови взрослых и набери 112. При дыме держись низко у пола." },
      { typ: "daumen", satz: "Ein Rauchmelder piept laut, wenn es nach Rauch riecht, und kann Leben retten.", satzRu: "Дымовой датчик громко пищит, если есть дым, и может спасти жизнь.", bild: "🚨", ok: true,
        warum: "Stimmt! Er weckt alle auf, auch nachts. Frag zu Hause, wo eure Rauchmelder hängen.", warumRu: "Верно! Он будит всех, даже ночью. Спроси дома, где висят ваши дымовые датчики." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Gut gemacht, {name}! Streichhölzer und Feuerzeuge sind nur für Erwachsene. Übt zu Hause: Wie kommt ihr schnell nach draußen?",
        ru: "Молодец, {name}! Спички и зажигалки — только для взрослых. Потренируйтесь дома: как быстро выйти на улицу?" }
    ]
  },
  // ---------- NA-34 Teil 4: Fahrrad, Kinderrechte, Gemeinde ----------
  {
    id: "fahrrad", lb: "rz", kl: 3, lz: ["su.te.03", "su.ge.02"], name: "Mein Fahrrad", e: "🚲", farbe: "#2F86C8", grund: "#E5F1FB",
    kurz: "Sicheres Fahrrad, Helm, Zeichen geben, wie die Kette antreibt",
    schritte: [
      { typ: "info", titel: "Ein Fahrrad ist eine Maschine", bild: "🚲",
        text: "Hallo {name}! Wenn du in die Pedale trittst, dreht sich vorn ein Zahnrad. Die Kette überträgt die Kraft auf das Zahnrad am Hinterrad – und das Rad dreht sich.",
        ru: "Привет, {name}! Когда ты крутишь педали, спереди вращается зубчатое колесо. Цепь передаёт силу на зубчатое колесо у заднего колеса — и оно крутится." },
      { typ: "info", titel: "Ist mein Fahrrad sicher?", bild: "🔦",
        text: "Ein sicheres Fahrrad hat zwei Bremsen, eine Klingel, vorn ein weißes und hinten ein rotes Licht und Rückstrahler, die im Dunkeln leuchten.",
        ru: "У безопасного велосипеда две тормоза, звонок, спереди белый и сзади красный фонарь и катафоты, которые светятся в темноте.",
        fakten: [["2 Bremsen 🛑", "2 тормоза 🛑"], ["Klingel 🔔", "Звонок 🔔"], ["Licht vorn weiß, hinten rot 💡", "Фонарь спереди белый, сзади красный 💡"], ["Rückstrahler ✨", "Катафоты ✨"]] },
      { typ: "zuordnen", frage: "Was gehört zu einem verkehrssicheren Fahrrad?", ru: "Что нужно безопасному велосипеду?",
        gruppen: [{ id: "j", name: "Muss dran sein", ru: "Обязательно", bild: "✅" }, { id: "n", name: "Nur Schmuck", ru: "Только украшение", bild: "🎀" }],
        dinge: [
          { t: "Bremsen", ru: "Тормоза", gruppe: "j" }, { t: "Klingel", ru: "Звонок", gruppe: "j" }, { t: "Rotes Rücklicht", ru: "Красный задний фонарь", gruppe: "j" },
          { t: "Wimpel", ru: "Флажок", gruppe: "n" }, { t: "Glitzer-Aufkleber", ru: "Блестящие наклейки", gruppe: "n" }, { t: "Bunte Lenkerbänder", ru: "Цветные ленточки на руле", gruppe: "n" }] },
      { typ: "wahl", frage: "Du willst nach links abbiegen. Was machst du vorher?", ru: "Ты хочешь повернуть налево. Что ты делаешь сначала?", bild: "↩️", optionen: [
        { t: "Umschauen und den linken Arm ausstrecken", ru: "Оглянуться и вытянуть левую руку", ok: true, warum: "Richtig! Erst nach hinten schauen, dann Zeichen geben. Wenn es zu schwierig ist: absteigen und schieben.", warumRu: "Правильно! Сначала оглянуться, потом подать знак. Если трудно — слезть и вести велосипед." },
        { t: "Einfach schnell rüberfahren", ru: "Просто быстро проехать", ok: false, warum: "Gefährlich! Die Autos wissen nicht, was du vorhast. Immer umschauen und Zeichen geben.", warumRu: "Опасно! Машины не знают, что ты задумал. Всегда оглядывайся и подавай знак." },
        { t: "Laut klingeln", ru: "Громко позвонить", ok: false, warum: "Die Klingel warnt andere, zeigt aber nicht die Richtung. Dafür streckst du den Arm aus.", warumRu: "Звонок предупреждает, но не показывает направление. Для этого вытягивают руку." }] },
      { typ: "daumen", satz: "Ein Fahrradhelm schützt den Kopf bei einem Sturz.", satzRu: "Велосипедный шлем защищает голову при падении.", bild: "⛑️", ok: true,
        warum: "Stimmt! Setz den Helm bei jeder Fahrt auf und mach den Riemen zu – er soll gerade auf der Stirn sitzen.", warumRu: "Верно! Надевай шлем каждый раз и застёгивай ремешок — он должен ровно сидеть на лбу." },
      { typ: "daumen", satz: "Kinder bis 8 Jahre fahren mit dem Fahrrad auf dem Gehweg.", satzRu: "Дети до 8 лет ездят на велосипеде по тротуару.", bild: "🚸", ok: true,
        warum: "Stimmt! Bis 8 Jahre müssen Kinder auf dem Gehweg fahren, bis 10 dürfen sie es. Fußgänger haben dort Vorrang.", warumRu: "Верно! До 8 лет дети обязаны ездить по тротуару, до 10 — могут. Пешеходы там главнее." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Super, {name}! Prüf mit einem Erwachsenen dein Fahrrad: Bremsen, Klingel, Licht. In Klasse 4 gibt es oft die Radfahrprüfung.",
        ru: "Супер, {name}! Проверь со взрослым свой велосипед: тормоза, звонок, фонари. В 4 классе часто бывает экзамен по езде на велосипеде." }
    ]
  },
  {
    id: "kinderrechte", lb: "zl", kl: 4, lz: ["su.so.06"], name: "Kinderrechte und Geld", e: "🧒", farbe: "#7B55B8", grund: "#F1EAFF",
    kurz: "Welche Rechte haben Kinder? Wünsche, Bedürfnisse und Taschengeld",
    schritte: [
      { typ: "info", titel: "Kinder haben Rechte", bild: "🌍",
        text: "Hallo {name}! Fast alle Länder der Welt haben versprochen, die Rechte von Kindern zu schützen. Das steht in der Kinderrechtskonvention der Vereinten Nationen von 1989.",
        ru: "Привет, {name}! Почти все страны мира пообещали защищать права детей. Это записано в Конвенции ООН о правах ребёнка 1989 года.",
        fakten: [["Recht auf Bildung 📚", "Право на образование 📚"], ["Recht auf Gesundheit 🩺", "Право на здоровье 🩺"], ["Recht auf Spiel und Freizeit ⚽", "Право на игру и отдых ⚽"], ["Schutz vor Gewalt 🛡️", "Защита от насилия 🛡️"], ["Recht, gehört zu werden 💬", "Право быть услышанным 💬"]] },
      { typ: "wahl", frage: "Welches ist ein Kinderrecht?", ru: "Что из этого — право ребёнка?", bild: "📜", optionen: [
        { t: "In die Schule gehen und lernen", ru: "Ходить в школу и учиться", ok: true, warum: "Richtig! Jedes Kind hat ein Recht auf Bildung.", warumRu: "Правильно! У каждого ребёнка есть право на образование." },
        { t: "Jeden Tag Eis essen", ru: "Каждый день есть мороженое", ok: false, warum: "Das wäre lecker, ist aber kein Recht. Kinder haben ein Recht auf gesundes Essen.", warumRu: "Это было бы вкусно, но это не право. У детей есть право на здоровую еду." },
        { t: "Immer bestimmen, was alle tun", ru: "Всегда решать, что делают все", ok: false, warum: "Nein. Kinder dürfen ihre Meinung sagen und werden gehört – aber andere haben auch Rechte.", warumRu: "Нет. Дети могут высказывать мнение, и их слушают — но у других тоже есть права." }] },
      { typ: "daumen", satz: "Wenn mich jemand schlägt oder mir Angst macht, darf ich mir Hilfe holen.", satzRu: "Если меня бьют или пугают, я могу попросить о помощи.", bild: "🤝", ok: true,
        warum: "Stimmt! Erzähl es einem Erwachsenen, dem du vertraust. Kostenlos und anonym hilft auch die Nummer gegen Kummer: 116 111.", warumRu: "Верно! Расскажи взрослому, которому доверяешь. Бесплатно и анонимно помогает телефон доверия для детей в Германии: 116 111." },
      { typ: "zuordnen", frage: "Brauche ich das zum Leben oder wünsche ich es mir nur?", ru: "Это нужно для жизни или это просто желание?",
        gruppen: [{ id: "b", name: "Brauche ich", ru: "Нужно", bild: "🏠" }, { id: "w", name: "Wunsch", ru: "Желание", bild: "🎁" }],
        dinge: [
          { t: "Wasser zum Trinken", ru: "Вода для питья", gruppe: "b" }, { t: "Warme Jacke im Winter", ru: "Тёплая куртка зимой", gruppe: "b" }, { t: "Ein Bett", ru: "Кровать", gruppe: "b" },
          { t: "Neue Spielkonsole", ru: "Новая игровая приставка", gruppe: "w" }, { t: "Fünftes Kuscheltier", ru: "Пятая мягкая игрушка", gruppe: "w" }, { t: "Glitzerstifte", ru: "Блестящие ручки", gruppe: "w" }] },
      { typ: "wahl", frage: "Du bekommst 2 € Taschengeld pro Woche und wünschst dir ein Buch für 8 €. Was tust du?", ru: "Ты получаешь 2 € карманных денег в неделю и хочешь книгу за 8 €. Что ты делаешь?", bild: "🐷", optionen: [
        { t: "4 Wochen lang sparen", ru: "Копить 4 недели", ok: true, warum: "Genau! 4 · 2 € = 8 €. Sparen braucht Geduld – dafür kaufst du dir selbst etwas, das du wirklich willst.", warumRu: "Точно! 4 · 2 € = 8 €. Копить нужно терпение — зато ты сам купишь то, что действительно хочешь." },
        { t: "Jede Woche Süßigkeiten kaufen", ru: "Каждую неделю покупать сладости", ok: false, warum: "Dann ist das Geld jede Woche weg und das Buch kommt nie.", warumRu: "Тогда деньги каждую неделю заканчиваются, и книги не будет." },
        { t: "Gar nichts, das klappt nie", ru: "Ничего, это не получится", ok: false, warum: "Doch! In 4 Wochen hast du 8 € gespart.", warumRu: "Получится! За 4 недели ты накопишь 8 €." }] },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Toll, {name}! Am 20. September ist in Deutschland Weltkindertag, in vielen Ländern feiert man am 1. Juni den Kindertag.",
        ru: "Здорово, {name}! 20 сентября в Германии Всемирный день детей, а во многих странах День защиты детей празднуют 1 июня." }
    ]
  },
  {
    id: "gemeinde", lb: "zl", kl: 3, lz: ["su.so.05"], name: "Unsere Gemeinde", e: "🏛️", farbe: "#8A6E2F", grund: "#F7F0DD",
    kurz: "Wer kümmert sich um den Ort? Wie Kinder mitbestimmen",
    schritte: [
      { typ: "info", titel: "Viele leben zusammen", bild: "🏘️",
        text: "Hallo {name}! In einem Dorf oder einer Stadt leben viele Menschen zusammen. Die Gemeinde kümmert sich um Dinge, die alle brauchen.",
        ru: "Привет, {name}! В деревне или городе вместе живёт много людей. Община (муниципалитет) заботится о том, что нужно всем." },
      { typ: "zuordnen", frage: "Wer kümmert sich darum?", ru: "Кто об этом заботится?",
        gruppen: [{ id: "g", name: "Die Gemeinde", ru: "Муниципалитет", bild: "🏛️" }, { id: "f", name: "Die Familie", ru: "Семья", bild: "🏠" }],
        dinge: [
          { t: "Spielplatz", ru: "Детская площадка", gruppe: "g" }, { t: "Straßen und Ampeln", ru: "Улицы и светофоры", gruppe: "g" }, { t: "Müllabfuhr", ru: "Вывоз мусора", gruppe: "g" },
          { t: "Mein Zimmer aufräumen", ru: "Убрать мою комнату", gruppe: "f" }, { t: "Abendessen kochen", ru: "Готовить ужин", gruppe: "f" }, { t: "Kinderzimmer streichen", ru: "Покрасить детскую", gruppe: "f" }] },
      { typ: "wahl", frage: "Wer leitet eine Stadt oder ein Dorf?", ru: "Кто руководит городом или деревней?", bild: "👩‍💼", optionen: [
        { t: "Die Bürgermeisterin oder der Bürgermeister", ru: "Бургомистр (глава города)", ok: true, warum: "Richtig! Sie oder er wird gewählt und arbeitet mit dem Gemeinderat oder Stadtrat zusammen.", warumRu: "Правильно! Его или её выбирают, и они работают вместе с городским советом." },
        { t: "Die Lehrerin", ru: "Учительница", ok: false, warum: "Die Lehrerin leitet eine Klasse. Den Ort leitet die Bürgermeisterin oder der Bürgermeister.", warumRu: "Учительница руководит классом. Городом руководит бургомистр." },
        { t: "Der Schulbusfahrer", ru: "Водитель школьного автобуса", ok: false, warum: "Er fährt euch sicher zur Schule. Den Ort leitet die Bürgermeisterin oder der Bürgermeister.", warumRu: "Он безопасно везёт вас в школу. Городом руководит бургомистр." }] },
      { typ: "daumen", satz: "Wenn alle abstimmen, gewinnt, was die meisten wollen.", satzRu: "Если все голосуют, побеждает то, чего хочет большинство.", bild: "🙋", ok: true,
        warum: "Stimmt! Das heißt Mehrheit. Wichtig ist trotzdem, dass man den anderen zuhört.", warumRu: "Верно! Это называется большинство. Но всё равно важно слушать других." },
      { typ: "daumen", satz: "Kinder können in ihrem Ort nicht mitreden.", satzRu: "Дети не могут ничего решать в своём городе.", bild: "💬", ok: false,
        warum: "Doch! Im Klassenrat, im Schülerrat und in manchen Orten im Kinder- und Jugendparlament. Man kann auch Briefe an die Bürgermeisterin schreiben.", warumRu: "Могут! В совете класса, школьном совете, а в некоторых городах — в детском и молодёжном парламенте. Можно и написать письмо бургомистру." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Prima, {name}! Was würdest du in deinem Ort verbessern? Überleg dir einen Vorschlag und erzähl ihn deiner Familie oder deiner Klasse.",
        ru: "Отлично, {name}! Что бы ты улучшил в своём городе? Придумай предложение и расскажи семье или классу." }
    ]
  },
  // ---------- NA-34 Teil 5: Korn und Brot, Wetterkarte, Strom ----------
  {
    id: "brot", lb: "pt", kl: 3, lz: ["su.na.08", "su.te.01"], name: "Vom Korn zum Brot", e: "🌾", farbe: "#C79A2E", grund: "#FBF3DD",
    kurz: "Getreide, Mühle, Bäckerei – und die Kartoffel",
    schritte: [
      { typ: "info", titel: "Getreide auf dem Feld", bild: "🌾",
        text: "Hallo {name}! Brot wird aus Getreide gemacht. Bei uns wachsen vor allem Weizen, Roggen, Gerste und Hafer. Die Körner sitzen oben in der Ähre.",
        ru: "Привет, {name}! Хлеб делают из зерна. У нас растут в основном пшеница, рожь, ячмень и овёс. Зёрна сидят наверху, в колосе.",
        fakten: [["Weizen 🌾", "Пшеница 🌾"], ["Roggen", "Рожь"], ["Gerste", "Ячмень"], ["Hafer 🥣", "Овёс 🥣"]] },
      { typ: "zuordnen", frage: "Bring die Arbeit in die richtige Gruppe.", ru: "Распредели работу по группам.",
        gruppen: [{ id: "f", name: "Auf dem Feld", ru: "В поле", bild: "🚜" }, { id: "m", name: "In der Mühle", ru: "На мельнице", bild: "🏭" }, { id: "b", name: "In der Bäckerei", ru: "В пекарне", bild: "🥖" }],
        dinge: [
          { t: "Säen", ru: "Сеять", gruppe: "f" }, { t: "Ernten mit dem Mähdrescher", ru: "Убирать комбайном", gruppe: "f" },
          { t: "Körner zu Mehl mahlen", ru: "Молоть зерно в муку", gruppe: "m" }, { t: "Mehl in Säcke füllen", ru: "Насыпать муку в мешки", gruppe: "m" },
          { t: "Teig kneten", ru: "Месить тесто", gruppe: "b" }, { t: "Brot backen", ru: "Печь хлеб", gruppe: "b" }] },
      { typ: "wahl", frage: "Was braucht man für einen einfachen Brotteig?", ru: "Что нужно для простого хлебного теста?", bild: "🥣", optionen: [
        { t: "Mehl, Wasser, Salz und Hefe", ru: "Мука, вода, соль и дрожжи", ok: true, warum: "Richtig! Die Hefe lässt den Teig aufgehen, dann wird das Brot locker.", warumRu: "Правильно! Дрожжи поднимают тесто, и хлеб становится пышным." },
        { t: "Zucker, Butter und Schokolade", ru: "Сахар, масло и шоколад", ok: false, warum: "Das klingt nach Kuchen. Für Brot reichen Mehl, Wasser, Salz und Hefe.", warumRu: "Это скорее торт. Для хлеба хватит муки, воды, соли и дрожжей." },
        { t: "Kartoffeln und Milch", ru: "Картофель и молоко", ok: false, warum: "Daraus wird eher Kartoffelbrei. Brot macht man aus Mehl.", warumRu: "Из этого получится пюре. Хлеб делают из муки." }] },
      { typ: "daumen", satz: "Kartoffeln wachsen unter der Erde.", satzRu: "Картофель растёт под землёй.", bild: "🥔", ok: true,
        warum: "Stimmt! Wir essen die Knollen. Die grünen Teile und Beeren der Kartoffelpflanze sind giftig.", warumRu: "Верно! Мы едим клубни. Зелёные части и ягоды картофеля ядовиты." },
      { typ: "daumen", satz: "Vollkornbrot enthält das ganze Korn mit der Schale.", satzRu: "Цельнозерновой хлеб содержит всё зерно вместе с оболочкой.", bild: "🍞", ok: true,
        warum: "Stimmt! Darum macht es lange satt und ist besonders gesund.", warumRu: "Верно! Поэтому он надолго насыщает и особенно полезен." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Toll, {name}! Vom Feld bis zum Brötchen arbeiten viele Menschen zusammen. Auf der Insel backt Benno auch gern.",
        ru: "Здорово, {name}! От поля до булочки вместе работают много людей. На острове Бенно тоже любит печь." }
    ]
  },
  {
    id: "wetterkarte", lb: "un", kl: 3, lz: ["su.na.04"], name: "Die Wetterkarte", e: "🗺️", farbe: "#2F86C8", grund: "#E5F1FB",
    kurz: "Wetterzeichen lesen, Temperatur, Wind",
    schritte: [
      { typ: "info", titel: "Wetterzeichen", bild: "🌦️",
        text: "Hallo {name}! Im Wetterbericht siehst du eine Karte mit Zeichen. Sie zeigen, wo die Sonne scheint, wo es regnet und wie warm es wird.",
        ru: "Привет, {name}! В прогнозе погоды есть карта со значками. Они показывают, где светит солнце, где идёт дождь и как будет тепло.",
        fakten: [["☀️ Sonne", "☀️ Солнце"], ["⛅ Sonne und Wolken", "⛅ Солнце и облака"], ["🌧️ Regen", "🌧️ Дождь"], ["⛈️ Gewitter", "⛈️ Гроза"], ["❄️ Schnee", "❄️ Снег"]] },
      { typ: "wahl", frage: "Auf der Karte steht bei Dresden ⛈️. Was nimmst du mit?", ru: "На карте у Дрездена ⛈️. Что ты возьмёшь?", bild: "⛈️", optionen: [
        { t: "Regenjacke – und bei Blitzen drinnen bleiben", ru: "Дождевик — а при молнии оставаться дома", ok: true, warum: "Richtig! Bei Gewitter sucht man Schutz in einem Haus oder Auto.", warumRu: "Правильно! В грозу прячутся в доме или машине." },
        { t: "Sonnenbrille und Badehose", ru: "Солнечные очки и плавки", ok: false, warum: "Das Zeichen zeigt Gewitter, nicht Sonne.", warumRu: "Значок показывает грозу, а не солнце." },
        { t: "Schlitten", ru: "Санки", ok: false, warum: "Für einen Schlitten brauchst du ❄️ Schnee.", warumRu: "Для санок нужен ❄️ снег." }] },
      { typ: "wahl", frage: "In Berlin sind 25 °C, in Leipzig 18 °C. Wo ist es wärmer?", ru: "В Берлине 25 °C, в Лейпциге 18 °C. Где теплее?", bild: "🌡️", optionen: [
        { t: "In Berlin", ru: "В Берлине", ok: true, warum: "Genau! 25 Grad sind mehr als 18 Grad – 7 Grad wärmer.", warumRu: "Точно! 25 градусов больше, чем 18 — на 7 градусов теплее." },
        { t: "In Leipzig", ru: "В Лейпциге", ok: false, warum: "18 ist weniger als 25. In Berlin ist es wärmer.", warumRu: "18 меньше, чем 25. В Берлине теплее." },
        { t: "Überall gleich", ru: "Везде одинаково", ok: false, warum: "Die Zahlen sind verschieden: 25 °C und 18 °C.", warumRu: "Числа разные: 25 °C и 18 °C." }] },
      { typ: "daumen", satz: "Unter 0 °C kann Wasser zu Eis gefrieren.", satzRu: "Ниже 0 °C вода может замёрзнуть.", bild: "🧊", ok: true,
        warum: "Stimmt! Dann gibt es Frost und manchmal Glätte auf den Wegen.", warumRu: "Верно! Тогда бывает мороз, а иногда гололёд." },
      { typ: "daumen", satz: "Ein Pfeil auf der Wetterkarte zeigt, woher der Wind weht.", satzRu: "Стрелка на карте погоды показывает, откуда дует ветер.", bild: "💨", ok: true,
        warum: "Stimmt! Der Pfeil zeigt die Richtung, in die der Wind weht. Westwind kommt aus dem Westen.", warumRu: "Верно! Стрелка показывает, куда дует ветер. Западный ветер дует с запада." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Super, {name}! Schau heute mit deiner Familie den Wetterbericht an. Auf der Insel ändert sich das Wetter übrigens auch.",
        ru: "Супер, {name}! Посмотри сегодня с семьёй прогноз погоды. На острове погода тоже меняется." }
    ]
  },
  {
    id: "strom", lb: "un", kl: 4, lz: ["su.na.09"], name: "Strom – nützlich und gefährlich", e: "💡", farbe: "#E0A800", grund: "#FFF7D6",
    kurz: "Stromkreis, Leiter und Nichtleiter, sicher mit Strom",
    schritte: [
      { typ: "info", titel: "Der Stromkreis", bild: "🔋",
        text: "Hallo {name}! Eine Lampe leuchtet nur, wenn der Strom im Kreis fließen kann: von der Batterie durch den Draht zur Lampe und wieder zurück. Ein Schalter öffnet oder schließt den Kreis.",
        ru: "Привет, {name}! Лампочка горит, только если ток идёт по кругу: от батарейки по проводу к лампочке и обратно. Выключатель размыкает или замыкает цепь." },
      { typ: "zuordnen", frage: "Leitet das den Strom?", ru: "Проводит ли это ток?",
        gruppen: [{ id: "l", name: "Leiter", ru: "Проводник", bild: "⚡" }, { id: "n", name: "Nichtleiter", ru: "Непроводник", bild: "🚫" }],
        dinge: [
          { t: "Kupferdraht", ru: "Медная проволока", gruppe: "l" }, { t: "Büroklammer aus Metall", ru: "Металлическая скрепка", gruppe: "l" }, { t: "Alufolie", ru: "Фольга", gruppe: "l" },
          { t: "Holzstab", ru: "Деревянная палочка", gruppe: "n" }, { t: "Gummiband", ru: "Резинка", gruppe: "n" }, { t: "Plastiklineal", ru: "Пластиковая линейка", gruppe: "n" }] },
      { typ: "wahl", frage: "Warum hat ein Kabel eine Hülle aus Kunststoff?", ru: "Зачем у кабеля оболочка из пластика?", bild: "🔌", optionen: [
        { t: "Damit der Strom nicht in uns fließt", ru: "Чтобы ток не прошёл через нас", ok: true, warum: "Richtig! Kunststoff ist ein Nichtleiter und schützt uns.", warumRu: "Правильно! Пластик — непроводник, он нас защищает." },
        { t: "Damit es schön bunt ist", ru: "Чтобы было красиво", ok: false, warum: "Die Farbe ist egal – die Hülle schützt vor Strom.", warumRu: "Цвет не важен — оболочка защищает от тока." },
        { t: "Damit der Strom schneller fließt", ru: "Чтобы ток шёл быстрее", ok: false, warum: "Nein, die Hülle isoliert. Sie schützt uns vor dem Strom.", warumRu: "Нет, оболочка изолирует. Она защищает нас от тока." }] },
      { typ: "daumen", satz: "Mit einer kleinen Batterie darf man experimentieren, mit der Steckdose nie.", satzRu: "С маленькой батарейкой можно экспериментировать, с розеткой — никогда.", bild: "⚠️", ok: true,
        warum: "Stimmt! Strom aus der Steckdose ist lebensgefährlich. Nie etwas hineinstecken, kaputte Kabel nicht anfassen.", warumRu: "Верно! Ток из розетки опасен для жизни. Ничего туда не вставляй и не трогай повреждённые провода." },
      { typ: "daumen", satz: "Elektrische Geräte darf man mit nassen Händen ruhig anfassen.", satzRu: "Электроприборы можно трогать мокрыми руками.", bild: "💧", ok: false,
        warum: "Nein! Wasser leitet Strom. Föhn und Radio gehören nie in die Nähe der Badewanne.", warumRu: "Нет! Вода проводит ток. Фен и радио никогда не должны быть рядом с ванной." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Klasse, {name}! Strom kann man sparen: Licht aus, wenn du den Raum verlässt. Das schont auch die Umwelt.",
        ru: "Класс, {name}! Электричество можно экономить: выключай свет, когда выходишь из комнаты. Это бережёт и природу." }
    ]
  },
  {
    id: "waerme", lb: "un", kl: 4, lz: ["su.na.09"], name: "Wärme und Dämmung", e: "🧤", farbe: "#D2502A", grund: "#FDECE4",
    kurz: "Wärme wandert, Leiter und Dämmstoffe, warm bleiben",
    schritte: [
      { typ: "info", titel: "Wärme wandert", bild: "🌡️",
        text: "Hallo {name}! Wärme wandert immer vom Warmen zum Kalten. Darum wird heißer Tee mit der Zeit kalt. Manche Stoffe lassen Wärme schnell durch, andere halten sie fest.",
        ru: "Привет, {name}! Тепло всегда переходит от тёплого к холодному. Поэтому горячий чай со временем остывает. Одни материалы быстро пропускают тепло, другие его удерживают.",
        fakten: [["Metall leitet Wärme gut.", "Металл хорошо проводит тепло."], ["Holz, Wolle und Luft leiten Wärme schlecht – sie dämmen.", "Дерево, шерсть и воздух плохо проводят тепло — они утепляют."]] },
      { typ: "zuordnen", frage: "Leitet es Wärme gut oder hält es Wärme fest?", ru: "Хорошо проводит тепло или удерживает его?",
        gruppen: [{ id: "l", name: "Leitet gut", ru: "Хорошо проводит", bild: "🔥" }, { id: "d", name: "Dämmt", ru: "Утепляет", bild: "🧶" }],
        dinge: [
          { t: "Metalllöffel", ru: "Металлическая ложка", gruppe: "l" }, { t: "Kochtopf", ru: "Кастрюля", gruppe: "l" }, { t: "Heizkörper", ru: "Батарея отопления", gruppe: "l" },
          { t: "Wollpullover", ru: "Шерстяной свитер", gruppe: "d" }, { t: "Holzlöffel", ru: "Деревянная ложка", gruppe: "d" }, { t: "Styropor", ru: "Пенопласт", gruppe: "d" }] },
      { typ: "wahl", frage: "Im heißen Tee stehen ein Metalllöffel und ein Holzlöffel. Welcher wird am Griff schnell heiß?", ru: "В горячем чае стоят металлическая и деревянная ложки. Какая быстро нагреется у ручки?", bild: "🥄", optionen: [
        { t: "Der Metalllöffel", ru: "Металлическая", ok: true, warum: "Richtig! Metall leitet die Wärme schnell bis zum Griff.", warumRu: "Правильно! Металл быстро проводит тепло до ручки." },
        { t: "Der Holzlöffel", ru: "Деревянная", ok: false, warum: "Holz leitet Wärme schlecht. Darum nimmt man beim Kochen gern Holzlöffel.", warumRu: "Дерево плохо проводит тепло. Поэтому при готовке часто берут деревянные ложки." },
        { t: "Beide gleich", ru: "Обе одинаково", ok: false, warum: "Nein – Metall leitet Wärme viel besser als Holz.", warumRu: "Нет — металл проводит тепло гораздо лучше дерева." }] },
      { typ: "wahl", frage: "Warum bleibt Tee in einer Thermoskanne lange warm?", ru: "Почему чай в термосе долго остаётся тёплым?", bild: "🫖", optionen: [
        { t: "Ihre Wände lassen kaum Wärme durch", ru: "Её стенки почти не пропускают тепло", ok: true, warum: "Genau! Die Kanne ist gut gedämmt. So kann die Wärme kaum nach draußen wandern.", warumRu: "Точно! Термос хорошо утеплён. Тепло почти не может выйти наружу." },
        { t: "Sie heizt den Tee auf", ru: "Он подогревает чай", ok: false, warum: "Nein, eine Thermoskanne hat keine Heizung. Sie hält nur die Wärme fest.", warumRu: "Нет, в термосе нет нагрева. Он только удерживает тепло." },
        { t: "Weil sie bunt ist", ru: "Потому что он цветной", ok: false, warum: "Die Farbe ist egal. Wichtig sind die dämmenden Wände.", warumRu: "Цвет не важен. Важны утепляющие стенки." }] },
      { typ: "daumen", satz: "Ein Pullover macht von allein Wärme.", satzRu: "Свитер сам по себе вырабатывает тепло.", bild: "🧥", ok: false,
        warum: "Nein! Dein Körper macht die Wärme. Der Pullover hält sie fest, damit sie nicht so schnell wegwandert.", warumRu: "Нет! Тепло вырабатывает твоё тело. Свитер удерживает его, чтобы оно не уходило так быстро." },
      { typ: "daumen", satz: "Häuser werden gedämmt, damit man weniger heizen muss.", satzRu: "Дома утепляют, чтобы меньше топить.", bild: "🏠", ok: true,
        warum: "Stimmt! Dämmung in Wänden, Dach und Fenstern spart Energie und schont die Umwelt.", warumRu: "Верно! Утепление стен, крыши и окон экономит энергию и бережёт природу." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Super, {name}! Ausprobieren mit einem Erwachsenen: Zwei Gläser mit warmem Wasser, eines in einen Schal gewickelt. Fühl nach 20 Minuten – welches ist wärmer geblieben?",
        ru: "Супер, {name}! Попробуй вместе со взрослым: два стакана тёплой воды, один завернуть в шарф. Через 20 минут потрогай — какой остался теплее?" }
    ]
  },
  {
    id: "gewaesser", lb: "pt", kl: 4, lz: ["su.na.08"], name: "Tiere am und im Wasser", e: "🦦", farbe: "#1F8FB8", grund: "#E2F4FB",
    kurz: "Säugetiere und Fische, Leben am Bach, Gewässer schützen",
    schritte: [
      { typ: "info", titel: "Säugetiere", bild: "🦫",
        text: "Hallo {name}! Säugetiere haben meist ein Fell, atmen mit Lungen, und ihre Jungen trinken Milch bei der Mutter. Auch Biber, Otter und sogar Wale sind Säugetiere.",
        ru: "Привет, {name}! У млекопитающих обычно есть шерсть, они дышат лёгкими, а детёныши пьют молоко матери. Бобры, выдры и даже киты — тоже млекопитающие.",
        fakten: [["Fische atmen mit Kiemen und legen Eier.", "Рыбы дышат жабрами и откладывают икру."], ["Ein Biber baut Dämme aus Ästen und Schlamm.", "Бобр строит плотины из веток и ила."]] },
      { typ: "zuordnen", frage: "Säugetier oder Fisch?", ru: "Млекопитающее или рыба?",
        gruppen: [{ id: "s", name: "Säugetier", ru: "Млекопитающее", bild: "🍼" }, { id: "f", name: "Fisch", ru: "Рыба", bild: "🐟" }],
        dinge: [
          { t: "Biber", ru: "Бобр", gruppe: "s" }, { t: "Fischotter", ru: "Выдра", gruppe: "s" }, { t: "Delfin", ru: "Дельфин", gruppe: "s" },
          { t: "Forelle", ru: "Форель", gruppe: "f" }, { t: "Hecht", ru: "Щука", gruppe: "f" }, { t: "Karpfen", ru: "Карп", gruppe: "f" }] },
      { typ: "wahl", frage: "Woran erkennst du sicher ein Säugetier?", ru: "По какому признаку точно узнать млекопитающее?", bild: "🍼", optionen: [
        { t: "Die Jungen trinken Milch", ru: "Детёныши пьют молоко", ok: true, warum: "Richtig! Daher kommt der Name: Die Mutter säugt ihre Jungen.", warumRu: "Правильно! Отсюда и название: мать кормит детёнышей молоком." },
        { t: "Es kann schwimmen", ru: "Оно умеет плавать", ok: false, warum: "Schwimmen können auch Fische, Frösche und Enten.", warumRu: "Плавать умеют и рыбы, и лягушки, и утки." },
        { t: "Es lebt im Wasser", ru: "Оно живёт в воде", ok: false, warum: "Im Wasser leben viele Tiere. Wale sind Säugetiere, Fische nicht.", warumRu: "В воде живут многие животные. Киты — млекопитающие, рыбы — нет." }] },
      { typ: "daumen", satz: "Ein Delfin ist ein Fisch.", satzRu: "Дельфин — это рыба.", bild: "🐬", ok: false,
        warum: "Nein! Ein Delfin atmet Luft mit der Lunge und säugt seine Jungen. Er ist ein Säugetier.", warumRu: "Нет! Дельфин дышит воздухом и кормит детёнышей молоком. Он млекопитающее." },
      { typ: "daumen", satz: "Brot ist ein gutes Futter für Enten im Teich.", satzRu: "Хлеб — хороший корм для уток в пруду.", bild: "🦆", ok: false,
        warum: "Nein! Brot macht Enten krank, und Reste verschmutzen das Wasser. Enten finden selbst Futter.", warumRu: "Нет! От хлеба утки болеют, а остатки загрязняют воду. Утки сами находят корм." },
      { typ: "wahl", frage: "Wie kannst du einen Bach schützen?", ru: "Как ты можешь защитить ручей?", bild: "🏞️", optionen: [
        { t: "Müll wieder mitnehmen", ru: "Забирать мусор с собой", ok: true, warum: "Genau! Müll im Wasser schadet Fischen und Vögeln.", warumRu: "Точно! Мусор в воде вредит рыбам и птицам." },
        { t: "Steine ins Wasser werfen", ru: "Бросать камни в воду", ok: false, warum: "Das stört die Tiere und kann Nester am Ufer zerstören.", warumRu: "Это пугает животных и может разрушить гнёзда на берегу." },
        { t: "Die Uferpflanzen ausreißen", ru: "Вырывать растения на берегу", ok: false, warum: "Uferpflanzen sind Verstecke und Futter für viele Tiere.", warumRu: "Прибрежные растения — укрытие и корм для многих животных." }] },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Klasse, {name}! Wenn du an einem Bach bist: leise sein, gut beobachten und nichts mitnehmen außer deinem Müll.",
        ru: "Класс, {name}! Когда будешь у ручья: веди себя тихо, внимательно наблюдай и ничего не забирай, кроме своего мусора." }
    ]
  },
  {
    id: "experiment", lb: "ex", kl: 3, lz: ["su.na.07"], name: "Ein Experiment planen", e: "🔬", farbe: "#2E9C5A", grund: "#E3F7EF",
    kurz: "Frage, Vermutung, Versuch, Beobachtung, Ergebnis",
    schritte: [
      { typ: "info", titel: "Wie Forscher arbeiten", bild: "🔬",
        text: "Hallo {name}! Forscherinnen und Forscher gehen Schritt für Schritt vor. Wir probieren es mit der Frage: Trocknet nasse Wäsche in der Sonne schneller als im Schatten?",
        ru: "Привет, {name}! Исследователи действуют шаг за шагом. Попробуем с вопросом: высыхает ли мокрое бельё на солнце быстрее, чем в тени?",
        fakten: [["1. Frage  2. Vermutung  3. Versuch", "1. Вопрос  2. Предположение  3. Опыт"], ["4. Beobachtung  5. Ergebnis", "4. Наблюдение  5. Результат"]] },
      { typ: "wahl", frage: "Was ist eine Vermutung?", ru: "Что из этого — предположение?", bild: "🤔", optionen: [
        { t: "Ich glaube, in der Sonne trocknet es schneller.", ru: "Я думаю, на солнце высохнет быстрее.", ok: true, warum: "Richtig! Eine Vermutung sagst du, bevor du es ausprobierst.", warumRu: "Правильно! Предположение высказывают до того, как проверят." },
        { t: "Das Tuch in der Sonne ist trocken.", ru: "Платок на солнце сухой.", ok: false, warum: "Das ist schon eine Beobachtung – die machst du erst beim Versuch.", warumRu: "Это уже наблюдение — его делают во время опыта." },
        { t: "Wäsche ist nass.", ru: "Бельё мокрое.", ok: false, warum: "Das stimmt zwar, sagt aber nichts über die Frage voraus.", warumRu: "Это правда, но это не ответ на вопрос заранее." }] },
      { typ: "wahl", frage: "Wie wird der Versuch fair?", ru: "Как сделать опыт честным?", bild: "⚖️", optionen: [
        { t: "Zwei gleiche nasse Tücher, eins in die Sonne, eins in den Schatten", ru: "Два одинаковых мокрых платка: один на солнце, другой в тень", ok: true, warum: "Genau! Nur eine Sache ist anders: Sonne oder Schatten. So ist der Vergleich gerecht.", warumRu: "Точно! Отличается только одно: солнце или тень. Так сравнение честное." },
        { t: "Ein kleines Tuch in die Sonne, ein großes Handtuch in den Schatten", ru: "Маленький платок на солнце, большое полотенце в тень", ok: false, warum: "Dann weißt du nicht, ob es an der Sonne oder an der Größe lag.", warumRu: "Тогда непонятно, дело в солнце или в размере." },
        { t: "Nur ein Tuch in die Sonne hängen", ru: "Повесить только один платок на солнце", ok: false, warum: "Ohne zweites Tuch kannst du nichts vergleichen.", warumRu: "Без второго платка нечего сравнивать." }] },
      { typ: "zuordnen", frage: "Vermutung oder Beobachtung?", ru: "Предположение или наблюдение?",
        gruppen: [{ id: "v", name: "Vermutung", ru: "Предположение", bild: "💭" }, { id: "b", name: "Beobachtung", ru: "Наблюдение", bild: "👀" }],
        dinge: [
          { t: "Vielleicht schwimmt der Apfel.", ru: "Может быть, яблоко плавает.", gruppe: "v" }, { t: "Ich glaube, das Eis schmilzt schnell.", ru: "Думаю, лёд быстро растает.", gruppe: "v" },
          { t: "Der Nagel ist untergegangen.", ru: "Гвоздь утонул.", gruppe: "b" }, { t: "Nach 10 Minuten ist das Eis geschmolzen.", ru: "Через 10 минут лёд растаял.", gruppe: "b" }] },
      { typ: "daumen", satz: "Wenn meine Vermutung falsch war, habe ich schlecht geforscht.", satzRu: "Если моё предположение оказалось неверным, я плохо исследовал.", bild: "🙂", ok: false,
        warum: "Nein! Auch eine falsche Vermutung bringt dich weiter. Das Ergebnis zeigt, wie es wirklich ist.", warumRu: "Нет! Даже неверное предположение полезно. Результат показывает, как на самом деле." },
      { typ: "daumen", satz: "Bei Versuchen mit Feuer oder heißem Wasser ist immer ein Erwachsener dabei.", satzRu: "При опытах с огнём или горячей водой всегда рядом взрослый.", bild: "⚠️", ok: true,
        warum: "Stimmt! Sicherheit geht vor. Und mit Strom aus der Steckdose wird nie experimentiert.", warumRu: "Верно! Безопасность прежде всего. А с током из розетки опыты не проводят никогда." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Super, {name}! Schreib beim nächsten Versuch alles auf: Frage, Vermutung, was du gemacht und gesehen hast – und dein Ergebnis.",
        ru: "Супер, {name}! В следующий раз записывай всё: вопрос, предположение, что ты делал и видел — и свой результат." }
    ]
  },
  {
    id: "erstehilfe", lb: "kg", kl: 2, lz: ["su.na.02"], name: "Erste Hilfe", e: "🩹", farbe: "#E0574A", grund: "#FFECE8",
    kurz: "Hilfe holen, Notruf 112, kleine Wunden, Unfälle vermeiden",
    schritte: [
      { typ: "info", titel: "Helfen kann jeder", bild: "🩹",
        text: "Hallo {name}! Wenn jemand verletzt ist: Ruhe bewahren, Hilfe holen und die Person trösten. Lass sie nicht allein. Den Notruf 112 darfst du auch als Kind wählen.",
        ru: "Привет, {name}! Если кто-то пострадал: сохраняй спокойствие, позови помощь и утешай. Не оставляй человека одного. Номер экстренной помощи 112 можно набирать и детям.",
        fakten: [["Beim Notruf: Wo ist es passiert? Was ist passiert?", "При звонке: где это случилось? Что случилось?"], ["Dann warten – die Leitstelle stellt noch Fragen.", "Потом жди — диспетчер задаст ещё вопросы."]] },
      { typ: "wahl", frage: "Welche Nummer rufst du für Rettungsdienst und Feuerwehr?", ru: "По какому номеру вызывают скорую помощь и пожарных?", bild: "📞", optionen: [
        { t: "112", ru: "112", ok: true, warum: "Richtig! 112 ist der Notruf für Rettungsdienst und Feuerwehr – in ganz Europa.", warumRu: "Правильно! 112 — номер скорой помощи и пожарных по всей Европе." },
        { t: "110", ru: "110", ok: false, warum: "110 ist die Polizei. Für Verletzte und Feuer wählst du 112.", warumRu: "110 — это полиция. При травмах и пожаре звони 112." },
        { t: "116 111", ru: "116 111", ok: false, warum: "Das ist die Nummer gegen Kummer, wenn du reden möchtest. Im Notfall: 112.", warumRu: "Это телефон доверия, если хочется поговорить. В экстренном случае — 112." }] },
      { typ: "wahl", frage: "Ein Kind ist auf dem Schulhof gestürzt und weint. Was tust du?", ru: "Ребёнок упал на школьном дворе и плачет. Что ты сделаешь?", bild: "🧒", optionen: [
        { t: "Trösten und eine Lehrerin holen", ru: "Утешить и позвать учительницу", ok: true, warum: "Genau! Trösten hilft, und ein Erwachsener kümmert sich um die Wunde.", warumRu: "Точно! Утешение помогает, а взрослый позаботится о ране." },
        { t: "Schnell weiterspielen", ru: "Быстро играть дальше", ok: false, warum: "Das Kind braucht jetzt Hilfe. Bleib kurz da und hol einen Erwachsenen.", warumRu: "Ребёнку сейчас нужна помощь. Побудь рядом и позови взрослого." },
        { t: "Das Kind hochziehen und rennen lassen", ru: "Поднять ребёнка и заставить бежать", ok: false, warum: "Nicht drängen – vielleicht tut etwas weh. Erst trösten und Hilfe holen.", warumRu: "Не торопи — может быть, что-то болит. Сначала утешь и позови помощь." }] },
      { typ: "daumen", satz: "Eine kleine Schürfwunde spült man mit sauberem Wasser und klebt ein Pflaster darauf.", satzRu: "Маленькую ссадину промывают чистой водой и заклеивают пластырем.", bild: "🩹", ok: true,
        warum: "Stimmt! So kommt kein Schmutz in die Wunde.", warumRu: "Верно! Так в рану не попадёт грязь." },
      { typ: "daumen", satz: "Bei Nasenbluten legt man den Kopf weit nach hinten.", satzRu: "При кровотечении из носа голову запрокидывают назад.", bild: "👃", ok: false,
        warum: "Nein! Kopf leicht nach vorn beugen, die Nase vorn zusammendrücken und den Nacken kühlen.", warumRu: "Нет! Наклони голову немного вперёд, зажми нос спереди и охлади затылок." },
      { typ: "zuordnen", frage: "Sicher oder gefährlich?", ru: "Безопасно или опасно?",
        gruppen: [{ id: "s", name: "Sicher", ru: "Безопасно", bild: "✅" }, { id: "g", name: "Gefährlich", ru: "Опасно", bild: "⚠️" }],
        dinge: [
          { t: "Mit Helm Rad fahren", ru: "Кататься на велосипеде в шлеме", gruppe: "s" }, { t: "Schuhe gut zubinden", ru: "Хорошо завязать шнурки", gruppe: "s" },
          { t: "Am nassen Beckenrand rennen", ru: "Бегать по мокрому бортику бассейна", gruppe: "g" }, { t: "Auf hohe Regale klettern", ru: "Залезать на высокие полки", gruppe: "g" }] },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Toll, {name}! Frag deine Familie, wo bei euch der Verbandskasten ist. Viele Unfälle kann man vermeiden, wenn man vorher kurz nachdenkt.",
        ru: "Здорово, {name}! Спроси у семьи, где у вас аптечка. Многих несчастных случаев можно избежать, если сначала немного подумать." }
    ]
  },
  {
    id: "medien-info", lb: "ex", kl: 3, lz: ["me.sv.01", "me.ar.02", "me.ar.01"], name: "Informationen finden", e: "🔎", farbe: "#7B55B8", grund: "#F1EAFF",
    kurz: "Bücher, Kinderseiten, Werbung erkennen, Quellen prüfen",
    schritte: [
      { typ: "info", titel: "Wo steht das Wissen?", bild: "📚",
        text: "Hallo {name}! Wissen findest du in Sachbüchern, im Lexikon, in Kinder-Nachrichten und auf Kinderseiten im Internet. Kinder-Suchmaschinen zeigen nur Seiten, die für Kinder geprüft sind.",
        ru: "Привет, {name}! Знания можно найти в научно-популярных книгах, в энциклопедии, в детских новостях и на детских сайтах. Детские поисковики показывают только проверенные для детей страницы.",
        fakten: [["Gute Suchwörter sind kurz: „Igel Winterschlaf“.", "Хорошие слова для поиска короткие: «ёж зимняя спячка»."], ["Schreib auf, woher du dein Wissen hast.", "Записывай, откуда ты узнал информацию."]] },
      { typ: "wahl", frage: "Du willst wissen, wie lange Igel Winterschlaf halten. Wo suchst du am besten?", ru: "Ты хочешь узнать, сколько длится зимняя спячка ежей. Где лучше искать?", bild: "🦔", optionen: [
        { t: "Im Tierbuch oder mit einer Kinder-Suchmaschine", ru: "В книге о животных или в детском поисковике", ok: true, warum: "Richtig! Dort stehen geprüfte Sachinformationen für Kinder.", warumRu: "Правильно! Там проверенная информация для детей." },
        { t: "In einem Werbeprospekt", ru: "В рекламном проспекте", ok: false, warum: "Werbung will etwas verkaufen – Sachwissen über Igel findest du dort nicht.", warumRu: "Реклама хочет что-то продать — знаний о ежах там нет." },
        { t: "Einen Fremden im Chat fragen", ru: "Спросить незнакомца в чате", ok: false, warum: "Fremden im Netz schreibst du nicht. Frag lieber Familie oder Lehrerin.", warumRu: "Незнакомцам в интернете не пишут. Лучше спроси семью или учительницу." }] },
      { typ: "wahl", frage: "Woran erkennst du Werbung?", ru: "Как узнать рекламу?", bild: "📢", optionen: [
        { t: "Sie will, dass du etwas kaufst", ru: "Она хочет, чтобы ты что-то купил", ok: true, warum: "Genau! Oft steht „Anzeige“ oder „Werbung“ dabei.", warumRu: "Точно! Часто там написано «Anzeige» или «Werbung»." },
        { t: "Sie erklärt etwas genau", ru: "Она что-то подробно объясняет", ok: false, warum: "Erklären tun Sachtexte. Werbung will vor allem verkaufen.", warumRu: "Объясняют научные тексты. Реклама хочет прежде всего продать." },
        { t: "Sie steht immer in Büchern", ru: "Она всегда в книгах", ok: false, warum: "Werbung gibt es überall: im Fernsehen, im Internet, auf Plakaten.", warumRu: "Реклама есть везде: по телевизору, в интернете, на плакатах." }] },
      { typ: "daumen", satz: "Alles, was im Internet steht, ist wahr.", satzRu: "Всё, что написано в интернете, — правда.", bild: "🌐", ok: false,
        warum: "Nein! Jeder kann etwas ins Internet schreiben. Prüfe es in einer zweiten guten Quelle.", warumRu: "Нет! Любой может написать что-то в интернете. Проверь в другом хорошем источнике." },
      { typ: "zuordnen", frage: "Gute Quelle oder Vorsicht?", ru: "Хороший источник или осторожно?",
        gruppen: [{ id: "g", name: "Gute Quelle", ru: "Хороший источник", bild: "👍" }, { id: "v", name: "Vorsicht", ru: "Осторожно", bild: "✋" }],
        dinge: [
          { t: "Sachbuch aus der Bücherei", ru: "Научно-популярная книга из библиотеки", gruppe: "g" }, { t: "Kinder-Nachrichten", ru: "Детские новости", gruppe: "g" },
          { t: "Video: „Unglaublich! Klick hier!“", ru: "Видео: «Невероятно! Жми сюда!»", gruppe: "v" }, { t: "Kettenbrief im Chat", ru: "Письмо-цепочка в чате", gruppe: "v" }] },
      { typ: "daumen", satz: "Zum Suchen gibst du deinen Namen und deine Adresse ein.", satzRu: "Для поиска вводят своё имя и адрес.", bild: "🔒", ok: false,
        warum: "Nein! Zum Suchen brauchst du nur Suchwörter. Deine Daten bleiben geheim.", warumRu: "Нет! Для поиска нужны только слова. Свои данные держи в секрете." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Prima, {name}! Für einen Vortrag: zwei gute Quellen suchen, Stichworte aufschreiben und sagen, woher du es weißt.",
        ru: "Отлично, {name}! Для доклада: найди два хороших источника, запиши ключевые слова и скажи, откуда ты это знаешь." }
    ]
  },
  {
    id: "lernen-lernen", lb: "zl", stufe: 5, lz: ["su.so.07"], name: "Lernen lernen", e: "🧠", farbe: "#2E9C5A", grund: "#E3F7EF",
    kurz: "Kurz und oft üben, Pausen, sich selbst abfragen, Hausaufgaben planen",
    schritte: [
      { typ: "info", titel: "So lernt dein Kopf gut", bild: "🧠",
        text: "Hallo {name}! Dein Gehirn lernt am besten in kleinen Portionen: lieber jeden Tag ein bisschen als alles auf einmal. Pausen und Schlaf helfen beim Merken.",
        ru: "Привет, {name}! Мозг лучше всего учится маленькими порциями: лучше каждый день понемногу, чем всё сразу. Перерывы и сон помогают запоминать.",
        fakten: [["Nach etwa 20 Minuten eine kurze Pause machen.", "Примерно через 20 минут делать короткий перерыв."], ["Sich selbst abfragen statt nur durchlesen.", "Проверять себя, а не просто перечитывать."]] },
      { typ: "wahl", frage: "In 5 Tagen schreibst du einen Test. Wie lernst du am besten?", ru: "Через 5 дней контрольная. Как лучше учить?", bild: "📅", optionen: [
        { t: "Jeden Tag 15 Minuten", ru: "Каждый день по 15 минут", ok: true, warum: "Genau! Wer verteilt übt, behält mehr – und am Tag davor ist es entspannter.", warumRu: "Точно! Кто учит понемногу каждый день, запоминает больше — и накануне спокойнее." },
        { t: "Am Abend vorher zwei Stunden", ru: "Накануне вечером два часа", ok: false, warum: "So vergisst man schnell wieder, und man ist müde. Besser jeden Tag ein bisschen.", warumRu: "Так быстро забываешь, и устаёшь. Лучше каждый день понемногу." },
        { t: "Gar nicht, das klappt schon", ru: "Вообще не учить, и так получится", ok: false, warum: "Üben gibt Sicherheit. Schon wenige Minuten am Tag helfen.", warumRu: "Тренировка даёт уверенность. Помогают даже несколько минут в день." }] },
      { typ: "zuordnen", frage: "Hilft das beim Lernen oder stört es?", ru: "Это помогает учиться или мешает?",
        gruppen: [{ id: "h", name: "Hilft", ru: "Помогает", bild: "👍" }, { id: "s", name: "Stört", ru: "Мешает", bild: "👎" }],
        dinge: [
          { t: "Handy in ein anderes Zimmer legen", ru: "Убрать телефон в другую комнату", gruppe: "h" }, { t: "Kurze Pause mit Bewegung", ru: "Короткий перерыв с движением", gruppe: "h" },
          { t: "Fernseher läuft nebenbei", ru: "Рядом работает телевизор", gruppe: "s" }, { t: "Alles in letzter Minute", ru: "Всё в последнюю минуту", gruppe: "s" }] },
      { typ: "daumen", satz: "Wenn ich mich selbst abfrage, merke ich, was ich schon kann und was noch nicht.", satzRu: "Когда я проверяю себя сам, я замечаю, что уже умею, а что ещё нет.", bild: "🗂️", ok: true,
        warum: "Stimmt! Zum Beispiel mit Karteikarten: vorne die Frage, hinten die Antwort.", warumRu: "Верно! Например, с карточками: спереди вопрос, сзади ответ." },
      { typ: "daumen", satz: "Fehler zeigen, dass ich etwas nicht lernen kann.", satzRu: "Ошибки показывают, что я не могу это выучить.", bild: "🌱", ok: false,
        warum: "Nein! Fehler zeigen dir, was du noch üben kannst. Aus Fehlern lernt jeder – auch Erwachsene.", warumRu: "Нет! Ошибки показывают, что ещё можно потренировать. На ошибках учатся все — и взрослые тоже." },
      { typ: "wahl", frage: "Wo schreibst du deine Hausaufgaben auf?", ru: "Куда записывать домашние задания?", bild: "📓", optionen: [
        { t: "Ins Hausaufgabenheft", ru: "В дневник для домашних заданий", ok: true, warum: "Richtig! Dann vergisst du nichts und kannst planen, was wann dran ist.", warumRu: "Правильно! Тогда ничего не забудешь и сможешь планировать." },
        { t: "Ich merke sie mir einfach", ru: "Просто запоминаю", ok: false, warum: "Bei vielen Fächern vergisst man leicht etwas. Aufschreiben ist sicherer.", warumRu: "Когда предметов много, легко что-то забыть. Записывать надёжнее." },
        { t: "Auf die Hand", ru: "На руке", ok: false, warum: "Das wäscht sich ab. Ein Heft oder Planer ist besser.", warumRu: "Это смоется. Лучше тетрадь или планер." }] },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Toll, {name}! Probier diese Woche eine Sache aus: jeden Tag kurz üben oder dich selbst abfragen. Merkst du einen Unterschied?",
        ru: "Здорово, {name}! Попробуй на этой неделе что-то одно: каждый день немного заниматься или проверять себя. Заметишь разницу?" }
    ]
  },
  {
    id: "neue-schule", lb: "zl", stufe: 5, lz: ["su.so.07"], name: "Neue Schule", e: "🏫", farbe: "#2F86C8", grund: "#E5F1FB",
    kurz: "Stundenplan, neue Fächer und Lehrkräfte, Schulweg, Hilfe holen",
    schritte: [
      { typ: "info", titel: "Was ist anders?", bild: "🏫",
        text: "Hallo {name}! Nach der Grundschule wechseln viele Kinder auf eine neue Schule – in Berlin und Brandenburg meist erst nach Klasse 6. Es gibt neue Fächer, für fast jedes Fach eine andere Lehrkraft und einen Stundenplan.",
        ru: "Привет, {name}! После начальной школы многие дети переходят в новую школу — в Берлине и Бранденбурге обычно после 6-го класса. Появляются новые предметы, почти у каждого свой учитель, и есть расписание.",
        fakten: [["Neue Fächer sind zum Beispiel Biologie, Geschichte, Erdkunde.", "Новые предметы — например, биология, история, география."], ["Jede Schule ist anders. Jede Schulform kann gut zu einem Kind passen.", "Все школы разные. Любой тип школы может хорошо подойти ребёнку."]] },
      { typ: "wahl", frage: "Du findest am ersten Tag deinen Raum nicht. Was tust du?", ru: "В первый день ты не можешь найти свой кабинет. Что ты сделаешь?", bild: "🚪", optionen: [
        { t: "Jemanden fragen", ru: "Спросить кого-нибудь", ok: true, warum: "Genau! Ältere Kinder, Lehrkräfte und das Sekretariat helfen gern. Am Anfang fragen alle.", warumRu: "Точно! Старшие ученики, учителя и секретариат охотно помогут. В начале все спрашивают." },
        { t: "Nach Hause gehen", ru: "Пойти домой", ok: false, warum: "Bitte nicht einfach gehen – frag lieber. Dann weiß auch jemand, wo du bist.", warumRu: "Пожалуйста, не уходи просто так — лучше спроси. Тогда кто-то будет знать, где ты." },
        { t: "Allein suchen, bis die Stunde vorbei ist", ru: "Искать одному, пока урок не закончится", ok: false, warum: "Fragen geht viel schneller. Das ist ganz normal.", warumRu: "Спросить гораздо быстрее. Это совершенно нормально." }] },
      { typ: "wahl", frage: "Am Dienstag stehen Mathe, Englisch und Sport auf dem Stundenplan. Was packst du ein?", ru: "Во вторник в расписании математика, английский и физкультура. Что положить в рюкзак?", bild: "🎒", optionen: [
        { t: "Mathe- und Englischsachen und Sportzeug", ru: "Вещи для математики и английского и спортивную форму", ok: true, warum: "Richtig! Den Ranzen am Abend nach dem Stundenplan packen – dann fehlt morgens nichts.", warumRu: "Правильно! Собирать рюкзак вечером по расписанию — тогда утром ничего не забудешь." },
        { t: "Alle Bücher, die ich habe", ru: "Все книги, которые у меня есть", ok: false, warum: "Das wird viel zu schwer. Nur einpacken, was laut Stundenplan dran ist.", warumRu: "Будет слишком тяжело. Бери только то, что по расписанию." },
        { t: "Nur das Mäppchen", ru: "Только пенал", ok: false, warum: "Dann fehlen Hefte, Bücher und Sportsachen.", warumRu: "Тогда не хватит тетрадей, учебников и спортивной формы." }] },
      { typ: "daumen", satz: "Vor der neuen Schule aufgeregt zu sein, ist ganz normal.", satzRu: "Волноваться перед новой школой — совершенно нормально.", bild: "💓", ok: true,
        warum: "Stimmt! Den meisten Kindern geht es so. Sprich mit deiner Familie darüber – das hilft.", warumRu: "Верно! Так чувствуют себя большинство детей. Поговори об этом с семьёй — это помогает." },
      { typ: "daumen", satz: "Den neuen Schulweg sollte man vorher einmal ausprobieren.", satzRu: "Новый путь в школу стоит заранее один раз пройти.", bild: "🚌", ok: true,
        warum: "Stimmt! Fahrt den Weg in den Ferien gemeinsam ab – mit Bus, Bahn, Rad oder zu Fuß.", warumRu: "Верно! Пройдите путь вместе на каникулах — на автобусе, поезде, велосипеде или пешком." },
      { typ: "zuordnen", frage: "Grundschule oder neue Schule (meistens)?", ru: "Начальная школа или новая школа (обычно)?",
        gruppen: [{ id: "g", name: "Grundschule", ru: "Начальная школа", bild: "🏠" }, { id: "n", name: "Neue Schule", ru: "Новая школа", bild: "🏫" }],
        dinge: [
          { t: "Eine Klassenlehrerin für fast alles", ru: "Одна учительница почти по всем предметам", gruppe: "g" }, { t: "Sachunterricht", ru: "Природоведение", gruppe: "g" },
          { t: "Viele verschiedene Lehrkräfte", ru: "Много разных учителей", gruppe: "n" }, { t: "Biologie und Geschichte", ru: "Биология и история", gruppe: "n" }] },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Prima, {name}! Viele Schulen haben einen Tag der offenen Tür. Schau dir die Schule vorher mit deiner Familie an.",
        ru: "Отлично, {name}! Во многих школах бывает день открытых дверей. Посмотри школу заранее вместе с семьёй." }
    ]
  },
  {
    id: "herz-lunge", lb: "kg", stufe: 4, lz: ["su.na.02"], name: "Herz und Lunge", e: "❤️", farbe: "#E0574A", grund: "#FFECE8",
    kurz: "Atmen, Herzschlag, Puls fühlen, was dem Herzen gut tut",
    schritte: [
      { typ: "info", titel: "Dein Motor und deine Luftpumpe", bild: "🫀",
        text: "Hallo {name}! Dein Herz ist ein Muskel. Es pumpt Tag und Nacht Blut durch deinen Körper. Die Lunge holt beim Einatmen Luft mit Sauerstoff herein, beim Ausatmen geht verbrauchte Luft wieder hinaus.",
        ru: "Привет, {name}! Сердце — это мышца. Оно днём и ночью качает кровь по телу. Лёгкие при вдохе набирают воздух с кислородом, а при выдохе выпускают использованный воздух.",
        fakten: [["Das Blut bringt Sauerstoff aus der Lunge in jeden Teil des Körpers.", "Кровь несёт кислород из лёгких во все части тела."], ["Den Herzschlag spürst du als Puls am Handgelenk oder am Hals.", "Сердцебиение можно почувствовать как пульс на запястье или на шее."]] },
      { typ: "wahl", frage: "Du rennst eine Runde um den Schulhof. Was passiert mit deinem Herzen?", ru: "Ты пробежал круг по школьному двору. Что происходит с сердцем?", bild: "🏃", optionen: [
        { t: "Es schlägt schneller", ru: "Оно бьётся быстрее", ok: true, warum: "Genau! Die Muskeln brauchen mehr Sauerstoff, also pumpt das Herz schneller – und du atmest schneller.", warumRu: "Точно! Мышцам нужно больше кислорода, поэтому сердце бьётся быстрее — и ты чаще дышишь." },
        { t: "Es bleibt stehen", ru: "Оно останавливается", ok: false, warum: "Nein, das Herz arbeitet immer – beim Rennen sogar schneller.", warumRu: "Нет, сердце работает всегда — при беге даже быстрее." },
        { t: "Es schlägt langsamer", ru: "Оно бьётся медленнее", ok: false, warum: "Langsamer schlägt es in Ruhe, zum Beispiel beim Schlafen.", warumRu: "Медленнее оно бьётся в покое, например во сне." }] },
      { typ: "info", titel: "Puls fühlen", bild: "⏱️",
        text: "Leg zwei Finger an dein Handgelenk unter den Daumen. Zähle 15 Sekunden lang die Schläge und nimm die Zahl mal 4 – so weißt du deinen Puls pro Minute. Probier es in Ruhe und nach zehn Hampelmännern!",
        ru: "Приложи два пальца к запястью под большим пальцем. Считай удары 15 секунд и умножь на 4 — так узнаешь пульс в минуту. Попробуй в покое и после десяти прыжков!" },
      { typ: "zuordnen", frage: "Tut das Herz und Lunge gut?", ru: "Это полезно для сердца и лёгких?",
        gruppen: [{ id: "g", name: "Tut gut", ru: "Полезно", bild: "💪" }, { id: "s", name: "Schadet", ru: "Вредно", bild: "🚫" }],
        dinge: [
          { t: "Fahrrad fahren", ru: "Кататься на велосипеде", gruppe: "g" }, { t: "Draußen toben", ru: "Бегать на улице", gruppe: "g" },
          { t: "Zigarettenrauch einatmen", ru: "Вдыхать сигаретный дым", gruppe: "s" }, { t: "Den ganzen Tag nur sitzen", ru: "Весь день только сидеть", gruppe: "s" }] },
      { typ: "daumen", satz: "Beim Einatmen hebt sich der Brustkorb.", satzRu: "При вдохе грудная клетка поднимается.", bild: "🫁", ok: true,
        warum: "Stimmt! Die Lunge füllt sich mit Luft. Leg die Hand auf deinen Bauch und den Brustkorb und spür es.", warumRu: "Верно! Лёгкие наполняются воздухом. Положи руку на живот и грудь и почувствуй это." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Super, {name}! Jeden Tag eine Stunde Bewegung hält Herz und Lunge fit.",
        ru: "Супер, {name}! Час движения каждый день держит сердце и лёгкие в форме." }
    ]
  },
  {
    id: "gross-werden", lb: "kg", stufe: 4, lz: ["su.na.02"], name: "Ich werde größer", e: "🌱", farbe: "#2E9C5A", grund: "#E3F7EF",
    kurz: "Pubertät: Körper und Gefühle verändern sich, Hygiene, darüber reden",
    schritte: [
      { typ: "info", titel: "Der Körper verändert sich", bild: "🌱",
        text: "Hallo {name}! Irgendwann zwischen etwa 9 und 16 Jahren beginnt die Pubertät. Der Körper wird langsam erwachsen. Das passiert bei jedem Kind zu einer anderen Zeit – früher oder später ist beides normal.",
        ru: "Привет, {name}! Примерно между 9 и 16 годами начинается половое созревание. Тело постепенно становится взрослым. У каждого это происходит в своё время — раньше или позже, оба варианта нормальны.",
        fakten: [["Man wächst schneller, bei Jungen wird die Stimme tiefer.", "Растёшь быстрее, у мальчиков голос становится ниже."], ["Man schwitzt mehr, die Haut kann Pickel bekommen.", "Больше потеешь, на коже могут появляться прыщики."]] },
      { typ: "wahl", frage: "Du schwitzt nach dem Sport mehr als früher. Was hilft?", ru: "После спорта ты потеешь больше, чем раньше. Что поможет?", bild: "🚿", optionen: [
        { t: "Duschen und frische Sachen anziehen", ru: "Принять душ и надеть чистую одежду", ok: true, warum: "Genau! Regelmäßig waschen und ein Deo helfen. Das gehört jetzt einfach dazu.", warumRu: "Точно! Помогают регулярное мытьё и дезодорант. Теперь это просто часть жизни." },
        { t: "Weniger trinken", ru: "Меньше пить", ok: false, warum: "Trinken ist wichtig, gerade beim Sport. Gegen Schweißgeruch hilft Waschen.", warumRu: "Пить важно, особенно при спорте. От запаха пота помогает мытьё." },
        { t: "Gar keinen Sport mehr machen", ru: "Совсем не заниматься спортом", ok: false, warum: "Bewegung ist gesund. Danach einfach duschen.", warumRu: "Движение полезно. После него просто прими душ." }] },
      { typ: "daumen", satz: "In der Pubertät können Gefühle schneller wechseln – mal fröhlich, mal genervt.", satzRu: "В переходном возрасте чувства могут меняться быстрее — то весело, то всё раздражает.", bild: "🎭", ok: true,
        warum: "Stimmt! Das kommt auch von den Veränderungen im Körper. Darüber reden hilft.", warumRu: "Верно! Это тоже связано с изменениями в теле. Помогает поговорить об этом." },
      { typ: "daumen", satz: "Wer später in die Pubertät kommt, mit dem stimmt etwas nicht.", satzRu: "С тем, кто позже начинает взрослеть, что-то не так.", bild: "⏳", ok: false,
        warum: "Nein! Jeder Körper hat sein eigenes Tempo. Niemand muss sich vergleichen.", warumRu: "Нет! У каждого тела свой темп. Никому не нужно сравнивать себя с другими." },
      { typ: "wahl", frage: "Du hast eine Frage zu deinem Körper. Mit wem kannst du reden?", ru: "У тебя вопрос о своём теле. С кем можно поговорить?", bild: "💬", optionen: [
        { t: "Mit Eltern, Ärztin oder Lehrkraft, der ich vertraue", ru: "С родителями, врачом или учителем, которому доверяю", ok: true, warum: "Richtig! Solche Fragen sind normal. Du kannst auch die Nummer gegen Kummer anrufen: 116 111.", warumRu: "Правильно! Такие вопросы нормальны. Можно позвонить и по телефону доверия: 116 111." },
        { t: "Mit niemandem, das ist peinlich", ru: "Ни с кем, это стыдно", ok: false, warum: "Das muss dir nicht peinlich sein. Alle Erwachsenen haben das auch erlebt.", warumRu: "Не нужно стесняться. Все взрослые тоже через это прошли." },
        { t: "Mit einem Fremden im Internet", ru: "С незнакомцем в интернете", ok: false, warum: "Fremden im Netz erzählst du nichts Persönliches. Frag lieber jemanden, den du kennst.", warumRu: "Незнакомцам в интернете ничего личного не рассказывают. Лучше спроси того, кого знаешь." }] },
      { typ: "daumen", satz: "Mein Körper gehört mir. Ich darf Nein sagen, wenn mich jemand anfassen will und ich das nicht möchte.", satzRu: "Моё тело принадлежит мне. Я могу сказать «нет», если кто-то хочет меня трогать, а я не хочу.", bild: "✋", ok: true,
        warum: "Stimmt! Und du darfst es immer einem Erwachsenen erzählen, dem du vertraust.", warumRu: "Верно! И об этом всегда можно рассказать взрослому, которому ты доверяешь." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Toll, {name}! Größer werden ist spannend. Frag ruhig nach, wenn dich etwas beschäftigt.",
        ru: "Здорово, {name}! Взрослеть интересно. Спрашивай, если тебя что-то волнует." }
    ]
  },
  {
    id: "nein-sagen", lb: "kg", stufe: 3, lz: ["su.na.02", "et.mi.01"], name: "Stark sein – Nein sagen", e: "🛡️", farbe: "#7B55B8", grund: "#EFE6FF",
    kurz: "Sucht vorbeugen, Rauchen und Alkohol, zu viel Bildschirm, Gruppendruck",
    schritte: [
      { typ: "info", titel: "Was ist Sucht?", bild: "🛡️",
        text: "Hallo {name}! Sucht heißt: Man kann mit etwas nicht mehr aufhören, obwohl es schadet. Zigaretten und Alkohol machen süchtig und sind für Kinder besonders schädlich. Auch zu viel Handy oder Spielen kann zur Gewohnheit werden, die man kaum stoppen kann.",
        ru: "Привет, {name}! Зависимость — это когда невозможно остановиться, хотя это вредно. Сигареты и алкоголь вызывают зависимость и особенно вредны для детей. И слишком много телефона или игр может стать привычкой, которую трудно прекратить.",
        fakten: [["Rauchen und Alkohol sind für Kinder verboten – zum Schutz ihres Körpers.", "Курение и алкоголь детям запрещены — чтобы защитить их организм."], ["Wer Nein sagt, ist stark – nicht langweilig.", "Кто говорит «нет», тот сильный, а не скучный."]] },
      { typ: "wahl", frage: "Ältere Kinder bieten dir eine Zigarette an: „Sei kein Baby!“ Was tust du?", ru: "Старшие дети предлагают тебе сигарету: «Не будь малышом!» Что ты сделаешь?", bild: "🚭", optionen: [
        { t: "Klar Nein sagen und weggehen", ru: "Чётко сказать «нет» и уйти", ok: true, warum: "Genau! Du musst niemandem etwas beweisen. Erzähl es danach einem Erwachsenen.", warumRu: "Точно! Тебе не нужно никому ничего доказывать. Потом расскажи об этом взрослому." },
        { t: "Mitmachen, damit sie mich mögen", ru: "Согласиться, чтобы они меня любили", ok: false, warum: "Echte Freunde mögen dich auch, wenn du Nein sagst.", warumRu: "Настоящие друзья любят тебя, даже если ты говоришь «нет»." },
        { t: "Heimlich probieren", ru: "Тайком попробовать", ok: false, warum: "Auch heimlich schadet Rauchen deiner Lunge. Nein sagen ist mutiger.", warumRu: "И тайком курение вредит лёгким. Сказать «нет» — смелее." }] },
      { typ: "zuordnen", frage: "Hilft das, wenn es dir schlecht geht – oder schadet es?", ru: "Помогает это, когда тебе плохо, или вредит?",
        gruppen: [{ id: "h", name: "Hilft", ru: "Помогает", bild: "💚" }, { id: "s", name: "Schadet", ru: "Вредит", bild: "🚫" }],
        dinge: [
          { t: "Mit Freunden reden", ru: "Поговорить с друзьями", gruppe: "h" }, { t: "Rausgehen und sich bewegen", ru: "Выйти на улицу и подвигаться", gruppe: "h" },
          { t: "Stundenlang am Handy bleiben", ru: "Часами сидеть в телефоне", gruppe: "s" }, { t: "Süßes statt Abendessen", ru: "Сладкое вместо ужина", gruppe: "s" }] },
      { typ: "daumen", satz: "Wenn ich merke, dass ich nicht mehr vom Spiel loskomme, darf ich Hilfe holen.", satzRu: "Если я замечаю, что не могу оторваться от игры, я могу попросить о помощи.", bild: "🎮", ok: true,
        warum: "Stimmt! Ein Erwachsener kann helfen, Pausen festzulegen. Darum hat auch diese App feste Spielzeiten.", warumRu: "Верно! Взрослый поможет договориться о перерывах. Поэтому и в этом приложении есть время для игр." },
      { typ: "daumen", satz: "Wer Nein sagt, verliert alle Freunde.", satzRu: "Кто говорит «нет», теряет всех друзей.", bild: "🤝", ok: false,
        warum: "Nein! Gute Freunde respektieren dein Nein. Oft sagen andere dann auch mutig Nein.", warumRu: "Нет! Хорошие друзья уважают твоё «нет». Часто другие тогда тоже смело говорят «нет»." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Stark, {name}! Übe mit deiner Familie einen Satz zum Neinsagen, zum Beispiel: „Nein danke, das will ich nicht.“",
        ru: "Сильно, {name}! Потренируй с семьёй фразу для отказа, например: «Нет, спасибо, я не хочу»." }
    ]
  },
  {
    id: "sachsen", lb: "rz", stufe: 4, land: "sn", lz: ["su.ge.04", "su.hi.sn01"], name: "Unser Bundesland Sachsen", e: "🗺️", farbe: "#2E7D62", grund: "#E3F7EF",
    kurz: "Karte, Dresden und andere Städte, Elbe, Erzgebirge, Sorben, Nachbarn",
    schritte: [
      { typ: "info", titel: "Sachsen auf der Karte", bild: "sachsen",
        text: "Hallo {name}! Du lebst in Sachsen. Die Landeshauptstadt ist Dresden an der Elbe. Die größte Stadt ist Leipzig. Im Süden liegt das Erzgebirge mit dem Fichtelberg, dem höchsten Berg Sachsens.",
        ru: "Привет, {name}! Ты живёшь в Саксонии. Столица земли — Дрезден на Эльбе. Самый большой город — Лейпциг. На юге — Рудные горы с горой Фихтельберг, самой высокой в Саксонии.",
        fakten: [["Nachbarländer: Polen im Osten, Tschechien im Süden.", "Соседние страны: Польша на востоке, Чехия на юге."], ["Nachbar-Bundesländer: Bayern, Thüringen, Sachsen-Anhalt, Brandenburg.", "Соседние федеральные земли: Бавария, Тюрингия, Саксония-Анхальт, Бранденбург."]] },
      { typ: "wahl", frage: "Wie heißt die Landeshauptstadt von Sachsen?", ru: "Как называется столица Саксонии?", bild: "sachsen", optionen: [
        { t: "Dresden", ru: "Дрезден", ok: true, warum: "Richtig! In Dresden arbeiten die Landesregierung und der Landtag. Dort stehen auch die Frauenkirche und der Zwinger.", warumRu: "Правильно! В Дрездене работают правительство и парламент земли. Там же Фрауэнкирхе и Цвингер." },
        { t: "Leipzig", ru: "Лейпциг", ok: false, warum: "Leipzig ist die größte Stadt, aber nicht die Hauptstadt. Hauptstadt ist Dresden.", warumRu: "Лейпциг — самый большой город, но не столица. Столица — Дрезден." },
        { t: "Berlin", ru: "Берлин", ok: false, warum: "Berlin ist die Hauptstadt von Deutschland. Sachsens Hauptstadt ist Dresden.", warumRu: "Берлин — столица Германии. Столица Саксонии — Дрезден." }] },
      { typ: "wahl", frage: "Welcher Fluss fließt durch Dresden?", ru: "Какая река течёт через Дрезден?", bild: "🌊", optionen: [
        { t: "die Elbe", ru: "Эльба", ok: true, warum: "Genau! Die Elbe kommt aus Tschechien und fließt durch Dresden weiter nach Norden bis zur Nordsee.", warumRu: "Точно! Эльба течёт из Чехии через Дрезден на север, до Северного моря." },
        { t: "der Rhein", ru: "Рейн", ok: false, warum: "Der Rhein fließt im Westen Deutschlands. Durch Dresden fließt die Elbe.", warumRu: "Рейн течёт на западе Германии. Через Дрезден течёт Эльба." },
        { t: "die Donau", ru: "Дунай", ok: false, warum: "Die Donau fließt durch Süddeutschland. Durch Dresden fließt die Elbe.", warumRu: "Дунай течёт по югу Германии. Через Дрезден течёт Эльба." }] },
      { typ: "zuordnen", frage: "Wohin gehört das?", ru: "К чему это относится?",
        gruppen: [{ id: "e", name: "Erzgebirge", ru: "Рудные горы", bild: "⛰️" }, { id: "l", name: "Lausitz (Sorben)", ru: "Лужица (сорбы)", bild: "🥚" }],
        dinge: [
          { t: "Räuchermännchen und Nussknacker", ru: "Курительные человечки и щелкунчики", gruppe: "e" }, { t: "Schwibbogen im Fenster", ru: "Светильник-арка в окне", gruppe: "e" },
          { t: "Kunstvoll verzierte Ostereier", ru: "Искусно расписанные пасхальные яйца", gruppe: "l" }, { t: "Vogelhochzeit am 25. Januar", ru: "Птичья свадьба 25 января", gruppe: "l" }] },
      { typ: "daumen", satz: "Die Sorben haben eine eigene Sprache. In der Lausitz stehen viele Ortsschilder auf Deutsch und Sorbisch.", satzRu: "У сорбов свой язык. В Лужице многие таблички с названиями мест на немецком и сорбском.", bild: "🪧", ok: true,
        warum: "Stimmt! Zum Beispiel Bautzen heißt auf Sorbisch Budyšin.", warumRu: "Верно! Например, Бауцен по-сорбски — Будышин." },
      { typ: "wahl", frage: "Auf einer Karte ist 1 cm so lang wie 10 km. Leipzig und Dresden sind auf der Karte etwa 10 cm voneinander entfernt. Wie weit ist das ungefähr?", ru: "На карте 1 см — это 10 км. Лейпциг и Дрезден на карте примерно в 10 см друг от друга. Это сколько примерно?", bild: "📏", optionen: [
        { t: "etwa 100 km", ru: "около 100 км", ok: true, warum: "Richtig! 10 · 10 km = 100 km. In echt sind es rund 100 km Luftlinie.", warumRu: "Правильно! 10 · 10 км = 100 км. В реальности около 100 км по прямой." },
        { t: "etwa 10 km", ru: "около 10 км", ok: false, warum: "Jeder Zentimeter sind 10 km. 10 cm sind also 10 · 10 km = 100 km.", warumRu: "Каждый сантиметр — 10 км. Значит, 10 см — это 10 · 10 км = 100 км." },
        { t: "etwa 1000 km", ru: "около 1000 км", ok: false, warum: "Das wäre viel zu weit – so weit ist es bis nach Italien. 10 cm sind 100 km.", warumRu: "Это слишком далеко — это как до Италии. 10 см — это 100 км." }] },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Klasse, {name}! Such auf einer Karte deinen Wohnort. Wie weit ist es bis Dresden?",
        ru: "Класс, {name}! Найди на карте свой город. Как далеко до Дрездена?" }
    ]
  }
];
// ---------- Schuljahr Sachunterricht (Lehrplan Sachsen 2019, Kl. 1/2): ein Thema je Lücke aus der Bestandsaufnahme (28.10.2026) ----------
window.THEMEN.push(
  {
    id: "zusammen-lernen", lb: "zl", kl: 2, lz: ["su.so.03", "su.hi.02"], name: "Zusammen lernen", e: "🧑‍🤝‍🧑", farbe: "#7B55B8", grund: "#EFE6FF",
    kurz: "Morgenkreis, Rituale, Klassendienste, aus Fehlern lernen",
    schritte: [
      { typ: "info", titel: "Unser Schultag hat einen Rhythmus", bild: "🔔",
        text: "Hallo {name}! In der Schule wechseln sich Lernen, Bewegung, Essen und Ruhe ab. Viele Klassen beginnen mit einem Morgenkreis. Solche festen Abläufe heißen Rituale – sie helfen, dass sich alle sicher fühlen.",
        ru: "Привет, {name}! В школе чередуются учёба, движение, еда и отдых. Многие классы начинают с утреннего круга. Такие постоянные действия называются ритуалами — они помогают всем чувствовать себя уверенно.",
        fakten: [["Morgenkreis ⭕", "Утренний круг ⭕"], ["Bewegungspause 🤸", "Разминка 🤸"], ["Frühstück 🍎", "Завтрак 🍎"], ["Stillarbeit 🤫", "Тихая работа 🤫"]] },
      { typ: "wahl", frage: "Nach einer langen Rechenstunde sind alle zappelig. Was hilft?", ru: "После долгого урока математики все ёрзают. Что поможет?", bild: "🤸", optionen: [
        { t: "Eine kurze Bewegungspause", ru: "Короткая разминка", ok: true, warum: "Genau! Nach dem Sitzen braucht der Körper Bewegung. Danach kann man wieder besser lernen.", warumRu: "Точно! После сидения телу нужно движение. Потом снова лучше учиться." },
        { t: "Noch eine Stunde rechnen", ru: "Ещё час считать", ok: false, warum: "Das wird schwer. Ruhe und Bewegung sollten sich abwechseln.", warumRu: "Будет трудно. Отдых и движение должны чередоваться." },
        { t: "Laut durcheinander schreien", ru: "Громко кричать", ok: false, warum: "Das stört alle. Eine Bewegungspause ist besser.", warumRu: "Это всем мешает. Лучше разминка." }] },
      { typ: "zuordnen", frage: "Allein, zu zweit oder in der Gruppe? Ordne zu!", ru: "Одному, вдвоём или в группе? Распредели!", gruppen: [
        { id: "allein", name: "Allein", ru: "Одному", bild: "🧒" }, { id: "partner", name: "Zu zweit", ru: "Вдвоём", bild: "👫" }, { id: "gruppe", name: "In der Gruppe", ru: "В группе", bild: "👨‍👩‍👧‍👦" }], dinge: [
        { t: "Ein Arbeitsblatt still lösen", ru: "Тихо решать лист", gruppe: "allein" },
        { t: "Sich gegenseitig abfragen", ru: "Спрашивать друг друга", gruppe: "partner" },
        { t: "Gemeinsam ein Plakat gestalten", ru: "Вместе делать плакат", gruppe: "gruppe" }] },
      { typ: "daumen", satz: "Wer einen Fehler macht, ist dumm.", satzRu: "Кто ошибается, тот глупый.", bild: "🤔", ok: false,
        warum: "Nein! Aus Fehlern lernt man. Jeder Fehler zeigt dir, was du noch üben kannst – das geht allen so.", warumRu: "Нет! На ошибках учатся. Каждая ошибка показывает, что ещё нужно потренировать, — так у всех." },
      { typ: "wahl", frage: "Wozu gibt es Klassendienste wie Tafeldienst oder Blumendienst?", ru: "Зачем нужны дежурства в классе — у доски или с цветами?", bild: "🧹", optionen: [
        { t: "Jeder übernimmt Verantwortung für die Klasse", ru: "Каждый отвечает за класс", ok: true, warum: "Richtig! Wenn jeder eine Aufgabe hat, ist der Klassenraum schön und alle helfen mit.", warumRu: "Правильно! Если у каждого есть задача, в классе красиво и все помогают." },
        { t: "Damit die Lehrerin nichts tun muss", ru: "Чтобы учительница ничего не делала", ok: false, warum: "Nein, es geht um die Gemeinschaft. Jeder kümmert sich um ein Stück Klasse.", warumRu: "Нет, речь о сообществе. Каждый заботится о своей части класса." },
        { t: "Als Strafe", ru: "В наказание", ok: false, warum: "Nein! Dienste sind keine Strafe. Sie zeigen: Wir gehören zusammen.", warumRu: "Нет! Дежурство — не наказание. Оно показывает, что мы вместе." }] },
      { typ: "daumen", satz: "Die Sachen der anderen Kinder darf ich einfach nehmen, wenn ich sie brauche.", satzRu: "Вещи других детей можно просто брать, когда нужно.", bild: "✏️", ok: false,
        warum: "Nein. Man fragt vorher und gibt die Sachen heil zurück. So achten wir das Eigentum der anderen.", warumRu: "Нет. Сначала спрашивают и возвращают вещи целыми. Так мы уважаем чужое." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Toll, {name}! Ein Tipp zum Merken: Jeder lernt anders – manche mit Bildern, manche durch Sprechen, manche durch Bewegung. Probier aus, was dir hilft!",
        ru: "Отлично, {name}! Совет: каждый учится по-своему — кто-то с картинками, кто-то проговаривая, кто-то в движении. Попробуй, что помогает тебе!" }
    ]
  },
  {
    id: "gesund-essen", lb: "kg", kl: 2, lz: ["su.na.02"], name: "Essen, trinken, bewegen", e: "🥕", farbe: "#5DB84A", grund: "#E3F5DC",
    kurz: "Ernährungspyramide, Trinken, Kräuter, Bewegung und Schlaf",
    schritte: [
      { typ: "info", titel: "Die Ernährungspyramide", bild: "🔺",
        text: "Unten in der Pyramide steht, wovon du viel essen und trinken darfst: Wasser, Obst, Gemüse und Brot. Weiter oben wird es weniger: Milch, Fleisch, Fisch, Fett. Ganz oben: Süßes – nur ein bisschen.",
        ru: "Внизу пирамиды — то, чего можно много: вода, фрукты, овощи и хлеб. Выше — меньше: молоко, мясо, рыба, жир. На самом верху — сладкое, совсем немного.",
        fakten: [["viel: Wasser 💧 Obst 🍎 Gemüse 🥦", "много: вода 💧 фрукты 🍎 овощи 🥦"], ["mittel: Milch 🥛 Fisch 🐟", "средне: молоко 🥛 рыба 🐟"], ["wenig: Süßes 🍬", "мало: сладкое 🍬"]] },
      { typ: "zuordnen", frage: "Viel oder wenig? Ordne zu!", ru: "Много или мало? Распредели!", gruppen: [
        { id: "viel", name: "Davon viel", ru: "Этого много", bild: "🥦" }, { id: "wenig", name: "Davon wenig", ru: "Этого мало", bild: "🍬" }], dinge: [
        { t: "Äpfel und Möhren", ru: "Яблоки и морковь", gruppe: "viel" },
        { t: "Gummibärchen", ru: "Мармелад", gruppe: "wenig" },
        { t: "Vollkornbrot", ru: "Цельнозерновой хлеб", gruppe: "viel" },
        { t: "Pommes mit viel Fett", ru: "Картошка фри в жире", gruppe: "wenig" }] },
      { typ: "wahl", frage: "Wie viel solltest du ungefähr am Tag trinken?", ru: "Сколько примерно нужно пить в день?", bild: "💧", optionen: [
        { t: "Etwa 6 Gläser, am besten Wasser", ru: "Около 6 стаканов, лучше воды", ok: true, warum: "Genau! Der Körper braucht Wasser zum Denken und Bewegen. Leitungswasser ist bei uns gut und günstig.", warumRu: "Точно! Телу нужна вода, чтобы думать и двигаться. Вода из-под крана у нас хорошая и дешёвая." },
        { t: "Ein Glas reicht", ru: "Хватит одного стакана", ok: false, warum: "Das ist zu wenig. Etwa 6 Gläser am Tag sind gut.", warumRu: "Это слишком мало. Хорошо около 6 стаканов в день." },
        { t: "Nur Limo", ru: "Только лимонад", ok: false, warum: "Limo hat viel Zucker. Wasser ist das beste Getränk.", warumRu: "В лимонаде много сахара. Вода — лучший напиток." }] },
      { typ: "daumen", satz: "Petersilie, Schnittlauch und Basilikum sind Kräuter, die man selbst im Topf ziehen kann.", satzRu: "Петрушку, лук и базилик можно вырастить самому в горшке.", bild: "🌿", ok: true,
        warum: "Stimmt! Kräuter riechen und schmecken stark. Schnittlauch auf dem Brot – lecker und gesund.", warumRu: "Верно! Травы сильно пахнут и имеют яркий вкус. Лук на хлебе — вкусно и полезно." },
      { typ: "daumen", satz: "Was in der Werbung lecker aussieht, ist immer gesund.", satzRu: "Что в рекламе выглядит вкусно, всегда полезно.", bild: "📺", ok: false,
        warum: "Nein! Werbung will verkaufen. Viele beworbene Snacks haben viel Zucker und Fett.", warumRu: "Нет! Реклама хочет продать. В рекламируемых закусках часто много сахара и жира." },
      { typ: "wahl", frage: "Was braucht dein Körper außer gutem Essen noch, um fit zu sein?", ru: "Что ещё нужно телу, кроме хорошей еды, чтобы быть бодрым?", bild: "😴", optionen: [
        { t: "Bewegung und genug Schlaf", ru: "Движение и достаточно сна", ok: true, warum: "Richtig! Kinder brauchen etwa 10 Stunden Schlaf und jeden Tag Bewegung, am besten draußen.", warumRu: "Правильно! Детям нужно около 10 часов сна и каждый день движение, лучше на улице." },
        { t: "Möglichst lange am Tablet sitzen", ru: "Как можно дольше сидеть за планшетом", ok: false, warum: "Nein. Lange sitzen macht müde. Bewegung und Schlaf machen fit.", warumRu: "Нет. Долгое сидение утомляет. Движение и сон дают силы." },
        { t: "Nachts lange wach bleiben", ru: "Долго не спать ночью", ok: false, warum: "Dann bist du am nächsten Tag müde. Genug Schlaf ist wichtig.", warumRu: "Тогда на следующий день будешь уставшим. Сон важен." }] },
      { typ: "daumen", satz: "Bananen wachsen nicht in Deutschland. Sie haben einen langen Weg hinter sich.", satzRu: "Бананы не растут в Германии. Они проделали долгий путь.", bild: "🍌", ok: true,
        warum: "Stimmt! Bananen kommen mit dem Schiff aus warmen Ländern. Äpfel, Möhren und Erdbeeren wachsen auch bei uns. Fair gehandelte Waren sorgen dafür, dass die Bauern gerecht bezahlt werden.", warumRu: "Верно! Бананы привозят на кораблях из тёплых стран. Яблоки, морковь и клубника растут и у нас. Товары «справедливой торговли» помогают честно платить фермерам." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Super, {name}! Und noch ein Tipp: Gerade sitzen, beide Füße auf dem Boden – das tut deinem Rücken gut.",
        ru: "Супер, {name}! Ещё совет: сиди прямо, обе ноги на полу — это полезно для спины." }
    ]
  },
  {
    id: "mein-koerper", lb: "kg", kl: 2, lz: ["su.na.02"], name: "Mein Körper gehört mir", e: "🙋", farbe: "#C2337A", grund: "#FDEAF3",
    kurz: "Körperteile richtig benennen, Nein sagen, Hilfe holen",
    schritte: [
      { typ: "info", titel: "Jungen und Mädchen", bild: "🧒👧",
        text: "Jungen und Mädchen haben vieles gemeinsam – und ein paar Unterschiede. Jungen haben einen Penis, Mädchen haben eine Scheide (Vulva). Das sind die richtigen Namen. Es ist gut, sie zu kennen.",
        ru: "У мальчиков и девочек много общего — и несколько различий. У мальчиков есть пенис, у девочек — влагалище (вульва). Это правильные названия. Хорошо их знать." },
      { typ: "daumen", satz: "Die Körperstellen, die die Badehose oder der Badeanzug bedeckt, sind privat.", satzRu: "Места, которые закрывают плавки или купальник, — личные.", bild: "🩱", ok: true,
        warum: "Stimmt! Niemand darf dich dort einfach anfassen oder Fotos davon machen. Ausnahme: Ärztin oder Arzt, wenn deine Eltern dabei sind.", warumRu: "Верно! Никто не имеет права просто так трогать тебя там или фотографировать. Исключение: врач, когда рядом родители." },
      { typ: "wahl", frage: "Jemand will dich anfassen und du fühlst dich unwohl. Was darfst du tun?", ru: "Кто-то хочет тебя трогать, и тебе неприятно. Что ты можешь сделать?", bild: "✋", optionen: [
        { t: "Laut Nein sagen und weggehen", ru: "Громко сказать «нет» и уйти", ok: true, warum: "Genau! Dein Körper gehört dir. Du darfst Nein sagen – auch zu Erwachsenen und Menschen, die du kennst.", warumRu: "Точно! Твоё тело принадлежит тебе. Ты можешь сказать «нет» — и взрослым, и знакомым." },
        { t: "Still sein, weil es ein Erwachsener ist", ru: "Молчать, потому что это взрослый", ok: false, warum: "Nein! Auch Erwachsenen darfst du Nein sagen, wenn sich etwas falsch anfühlt.", warumRu: "Нет! И взрослым можно сказать «нет», если что-то кажется неправильным." },
        { t: "Es aushalten", ru: "Терпеть", ok: false, warum: "Nein. Du musst nichts aushalten. Sag Nein und erzähl es einem Erwachsenen, dem du vertraust.", warumRu: "Нет. Ничего терпеть не нужно. Скажи «нет» и расскажи взрослому, которому доверяешь." }] },
      { typ: "zuordnen", frage: "Gutes oder schlechtes Geheimnis?", ru: "Хороший или плохой секрет?", gruppen: [
        { id: "gut", name: "Gutes Geheimnis", ru: "Хороший секрет", bild: "🎁" }, { id: "schlecht", name: "Schlechtes Geheimnis – erzählen!", ru: "Плохой секрет — рассказать!", bild: "😟" }], dinge: [
        { t: "Ein Geschenk für Mama", ru: "Подарок для мамы", gruppe: "gut" },
        { t: "Eine Überraschungsparty", ru: "Вечеринка-сюрприз", gruppe: "gut" },
        { t: "Jemand hat mich angefasst und sagt: Verrat es nicht!", ru: "Меня трогали и сказали: никому не говори!", gruppe: "schlecht" },
        { t: "Etwas macht mir Angst oder Bauchweh", ru: "Что-то пугает меня", gruppe: "schlecht" }] },
      { typ: "daumen", satz: "Wenn ich ein schlechtes Geheimnis weitererzähle, bin ich eine Petze.", satzRu: "Если я рассказываю плохой секрет, я ябеда.", bild: "🗣️", ok: false,
        warum: "Nein! Hilfe holen ist kein Petzen. Schlechte Geheimnisse darfst und sollst du erzählen – du bist nie schuld.", warumRu: "Нет! Позвать на помощь — не ябедничать. Плохие секреты можно и нужно рассказывать — ты никогда не виноват." },
      { typ: "wahl", frage: "Wem kannst du etwas erzählen, das dich bedrückt?", ru: "Кому можно рассказать то, что тебя тревожит?", bild: "📞", optionen: [
        { t: "Eltern, Lehrerin, Vertrauensperson – oder der Nummer gegen Kummer: 116 111", ru: "Родителям, учительнице, доверенному человеку — или по номеру 116 111", ok: true, warum: "Richtig! Die Nummer gegen Kummer ist kostenlos und du musst deinen Namen nicht sagen.", warumRu: "Правильно! Телефон доверия бесплатный, и называть имя не нужно." },
        { t: "Niemandem", ru: "Никому", ok: false, warum: "Doch! Du bist nicht allein. Erzähl es jemandem, dem du vertraust, oder ruf 116 111 an.", warumRu: "Нет! Ты не один. Расскажи тому, кому доверяешь, или позвони 116 111." },
        { t: "Nur einem Fremden im Internet", ru: "Только незнакомцу в интернете", ok: false, warum: "Lieber nicht. Erzähl es einer Vertrauensperson oder ruf die Nummer gegen Kummer an.", warumRu: "Лучше не надо. Расскажи доверенному человеку или позвони по телефону доверия." }] },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Gut gemacht, {name}! Merk dir: Mein Körper gehört mir. Ich darf Nein sagen. Und ich darf mir immer Hilfe holen – Nummer gegen Kummer: 116 111.",
        ru: "Молодец, {name}! Запомни: моё тело принадлежит мне. Я могу сказать «нет». И я всегда могу попросить помощи — телефон доверия: 116 111." }
    ]
  },
  {
    id: "jahreszeiten", lb: "pt", kl: 2, lz: ["su.na.03", "su.hi.02"], name: "Durch das Jahr", e: "🍂", farbe: "#E8A33D", grund: "#FFF1D9",
    kurz: "Frühling, Sommer, Herbst, Winter – Natur, Vögel und Feste",
    schritte: [
      { typ: "info", titel: "Vier Jahreszeiten", bild: "🌸☀️🍂❄️",
        text: "Im Frühling blühen die ersten Blumen und die Vögel bauen Nester. Im Sommer ist es warm und das Obst reift. Im Herbst färben sich die Blätter und fallen ab. Im Winter ruhen viele Pflanzen und Tiere.",
        ru: "Весной цветут первые цветы, а птицы вьют гнёзда. Летом тепло и зреют фрукты. Осенью листья желтеют и опадают. Зимой многие растения и животные отдыхают." },
      { typ: "zuordnen", frage: "Wann passiert das? Ordne zu!", ru: "Когда это бывает? Распредели!", gruppen: [
        { id: "fruehling", name: "Frühling", ru: "Весна", bild: "🌸" }, { id: "herbst", name: "Herbst", ru: "Осень", bild: "🍂" }, { id: "winter", name: "Winter", ru: "Зима", bild: "❄️" }], dinge: [
        { t: "Vögel brüten im Nest", ru: "Птицы высиживают птенцов", gruppe: "fruehling" },
        { t: "Bunte Blätter fallen", ru: "Падают цветные листья", gruppe: "herbst" },
        { t: "Der Igel hält Winterschlaf", ru: "Ёж впадает в спячку", gruppe: "winter" }] },
      { typ: "wahl", frage: "Was machen Vogeleltern im Frühling?", ru: "Что делают птицы-родители весной?", bild: "🪺", optionen: [
        { t: "Nest bauen, Eier ausbrüten, Junge füttern", ru: "Вьют гнездо, высиживают яйца, кормят птенцов", ok: true, warum: "Genau! Das heißt Brutpflege. Darum soll man brütende Vögel nicht stören.", warumRu: "Точно! Это забота о потомстве. Поэтому гнездящихся птиц нельзя беспокоить." },
        { t: "In den Süden fliegen", ru: "Улетают на юг", ok: false, warum: "Nein, im Frühling kommen die Zugvögel zurück und brüten bei uns.", warumRu: "Нет, весной перелётные птицы возвращаются и гнездятся у нас." },
        { t: "Winterschlaf halten", ru: "Впадают в спячку", ok: false, warum: "Vögel halten keinen Winterschlaf. Im Frühling brüten sie.", warumRu: "Птицы не впадают в спячку. Весной они высиживают птенцов." }] },
      { typ: "daumen", satz: "Im Herbst fliegen Schwalben und Störche in warme Länder.", satzRu: "Осенью ласточки и аисты улетают в тёплые страны.", bild: "🕊️", ok: true,
        warum: "Stimmt! Im Winter finden sie bei uns keine Insekten. Amsel, Meise und Spatz bleiben hier.", warumRu: "Верно! Зимой им у нас не найти насекомых. Дрозд, синица и воробей остаются." },
      { typ: "zuordnen", frage: "Welches Fest feiern viele Menschen wann?", ru: "Какой праздник когда отмечают многие люди?", gruppen: [
        { id: "fruehling", name: "Frühling", ru: "Весна", bild: "🌷" }, { id: "herbst", name: "Herbst", ru: "Осень", bild: "🎃" }, { id: "winter", name: "Winter", ru: "Зима", bild: "🎄" }], dinge: [
        { t: "Ostern", ru: "Пасха", gruppe: "fruehling" },
        { t: "Erntedank und Laternenumzug", ru: "Праздник урожая и шествие с фонариками", gruppe: "herbst" },
        { t: "Weihnachten", ru: "Рождество", gruppe: "winter" }] },
      { typ: "daumen", satz: "Die Natur verändert sich jedes Jahr wieder in derselben Reihenfolge.", satzRu: "Природа каждый год меняется в одном и том же порядке.", bild: "🔄", ok: true,
        warum: "Stimmt! Frühling, Sommer, Herbst, Winter – das ist der Jahreskreis. Im Kalender kannst du sehen, wann eine neue Jahreszeit beginnt.", warumRu: "Верно! Весна, лето, осень, зима — это годовой круг. В календаре видно, когда начинается новое время года." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Toll, {name}! Beobachte einen Baum vor deinem Fenster das ganze Jahr: Mach jeden Monat ein Bild – wie verändert er sich?",
        ru: "Отлично, {name}! Наблюдай за деревом у окна весь год: каждый месяц рисуй его — как оно меняется?" }
    ]
  },
  {
    id: "baeume", lb: "pt", kl: 2, lz: ["su.na.03"], name: "Bäume genau kennen", e: "🌳", farbe: "#2E9C5A", grund: "#E3F7EF",
    kurz: "Eiche, Buche, Ahorn, Linde, Kastanie, Fichte, Kiefer, Tanne – und wie alt ein Baum ist",
    schritte: [
      { typ: "info", titel: "Teile eines Baumes", bild: "🌳",
        text: "Ein Baum hat Wurzeln, einen Stamm, Äste und Zweige. Alle Äste zusammen mit den Blättern bilden die Krone. Laubbäume haben flache Blätter, Nadelbäume haben Nadeln und Zapfen mit den Samen.",
        ru: "У дерева есть корни, ствол, ветви и веточки. Все ветви с листьями образуют крону. У лиственных деревьев плоские листья, у хвойных — иголки и шишки с семенами.",
        fakten: [["Wurzel", "Корень"], ["Stamm", "Ствол"], ["Ast, Zweig", "Ветвь, веточка"], ["Krone", "Крона"]] },
      { typ: "wahl", frage: "Welcher Baum hat Eicheln?", ru: "У какого дерева жёлуди?", bild: "🌰", optionen: [
        { t: "Die Eiche", ru: "Дуб", ok: true, warum: "Richtig! Eichenblätter haben runde Buchten. Eichhörnchen und Wildschweine lieben Eicheln.", warumRu: "Правильно! У дуба листья с округлыми выемками. Белки и кабаны любят жёлуди." },
        { t: "Die Buche", ru: "Бук", ok: false, warum: "Die Buche hat kleine dreieckige Bucheckern. Eicheln wachsen an der Eiche.", warumRu: "У бука маленькие трёхгранные орешки. Жёлуди растут на дубе." },
        { t: "Die Fichte", ru: "Ель", ok: false, warum: "Die Fichte ist ein Nadelbaum mit Zapfen. Eicheln wachsen an der Eiche.", warumRu: "Ель — хвойное дерево с шишками. Жёлуди растут на дубе." }] },
      { typ: "zuordnen", frage: "Welche Frucht gehört zu welchem Baum?", ru: "Какой плод у какого дерева?", gruppen: [
        { id: "ahorn", name: "Ahorn", ru: "Клён", bild: "🍁" }, { id: "kastanie", name: "Kastanie", ru: "Каштан", bild: "🌰" }, { id: "linde", name: "Linde", ru: "Липа", bild: "🌳" }], dinge: [
        { t: "Fliegt wie ein kleiner Propeller", ru: "Летает как пропеллер", gruppe: "ahorn" },
        { t: "Glänzend braun in stacheliger Schale", ru: "Блестящий коричневый в колючей кожуре", gruppe: "kastanie" },
        { t: "Kleine Kugeln an einem Flügelblatt, Blätter wie ein Herz", ru: "Шарики на крылышке, листья как сердечко", gruppe: "linde" }] },
      { typ: "zuordnen", frage: "Fichte, Kiefer oder Tanne?", ru: "Ель, сосна или пихта?", gruppen: [
        { id: "fichte", name: "Fichte", ru: "Ель", bild: "🌲" }, { id: "kiefer", name: "Kiefer", ru: "Сосна", bild: "🌲" }, { id: "tanne", name: "Tanne", ru: "Пихта", bild: "🎄" }], dinge: [
        { t: "Spitze Nadeln, Zapfen hängen nach unten", ru: "Острые иголки, шишки висят вниз", gruppe: "fichte" },
        { t: "Lange Nadeln, immer zu zweit", ru: "Длинные иголки, всегда по две", gruppe: "kiefer" },
        { t: "Weiche Nadeln, Zapfen stehen aufrecht", ru: "Мягкие иголки, шишки стоят вверх", gruppe: "tanne" }] },
      { typ: "wahl", frage: "Wie kannst du an einem gefällten Baum sehen, wie alt er ist?", ru: "Как по спиленному дереву узнать его возраст?", bild: "🪵", optionen: [
        { t: "Die Jahresringe zählen", ru: "Посчитать годовые кольца", ok: true, warum: "Genau! Jedes Jahr wächst ein neuer Ring. 30 Ringe – 30 Jahre alt.", warumRu: "Точно! Каждый год растёт новое кольцо. 30 колец — 30 лет." },
        { t: "Die Blätter zählen", ru: "Посчитать листья", ok: false, warum: "Die Blätter wechseln jedes Jahr. Zähl die Jahresringe im Stamm.", warumRu: "Листья меняются каждый год. Считай годовые кольца в стволе." },
        { t: "Messen, wie hoch er ist", ru: "Измерить высоту", ok: false, warum: "Bäume wachsen verschieden schnell. Die Jahresringe verraten das Alter.", warumRu: "Деревья растут с разной скоростью. Возраст показывают кольца." }] },
      { typ: "daumen", satz: "Die Buche hat glatte, graue Rinde und Blätter mit glattem Rand.", satzRu: "У бука гладкая серая кора и листья с ровным краем.", bild: "🌳", ok: true,
        warum: "Stimmt! Daran erkennst du die Buche. Ihre Früchte heißen Bucheckern.", warumRu: "Верно! По этому узнаёшь бук. Его плоды называются буковыми орешками." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Super, {name}! Sammle beim nächsten Spaziergang Blätter und Früchte, kleb sie auf und schreib den Baumnamen dazu – so entsteht deine Baumsammlung.",
        ru: "Супер, {name}! На следующей прогулке собери листья и плоды, наклей их и подпиши название дерева — получится твоя коллекция." }
    ]
  },
  {
    id: "obst-garten", lb: "pt", kl: 2, lz: ["su.na.05"], name: "Obst und Garten", e: "🍒", farbe: "#E0574A", grund: "#FFECE8",
    kurz: "Kernobst, Steinobst, Beerenobst – säen, pflegen, ernten",
    schritte: [
      { typ: "info", titel: "Aus der Blüte wird die Frucht", bild: "🌸➡️🍎",
        text: "Nach der Blüte wächst die Frucht – darin sind die Samen. Beim Apfel liegen viele Kerne im Kerngehäuse: Kernobst. Die Kirsche hat einen harten Stein: Steinobst. Erdbeeren und Johannisbeeren sind Beerenobst.",
        ru: "После цветения растёт плод — в нём семена. В яблоке много семечек в сердцевине: семечковые. У вишни твёрдая косточка: косточковые. Клубника и смородина — ягоды.",
        fakten: [["Kernobst: Apfel, Birne 🍎🍐", "Семечковые: яблоко, груша 🍎🍐"], ["Steinobst: Kirsche, Pflaume 🍒", "Косточковые: вишня, слива 🍒"], ["Beerenobst: Erdbeere, Johannisbeere 🍓", "Ягоды: клубника, смородина 🍓"]] },
      { typ: "zuordnen", frage: "Kern, Stein oder Beere?", ru: "Семечковые, косточковые или ягоды?", gruppen: [
        { id: "kern", name: "Kernobst", ru: "Семечковые", bild: "🍎" }, { id: "stein", name: "Steinobst", ru: "Косточковые", bild: "🍒" }, { id: "beere", name: "Beerenobst", ru: "Ягоды", bild: "🍓" }], dinge: [
        { t: "Birne", ru: "Груша", gruppe: "kern" },
        { t: "Pflaume", ru: "Слива", gruppe: "stein" },
        { t: "Himbeere", ru: "Малина", gruppe: "beere" }] },
      { typ: "wahl", frage: "Du säst Kressesamen. Was brauchen sie zum Keimen?", ru: "Ты сеешь кресс-салат. Что нужно семенам, чтобы прорасти?", bild: "🌱", optionen: [
        { t: "Wasser, Wärme und Luft", ru: "Вода, тепло и воздух", ok: true, warum: "Richtig! Danach brauchen die Pflänzchen auch Licht zum Wachsen.", warumRu: "Правильно! Потом ростки нуждаются и в свете для роста." },
        { t: "Nur Dunkelheit", ru: "Только темнота", ok: false, warum: "Ohne Wasser keimt nichts. Samen brauchen Wasser, Wärme und Luft.", warumRu: "Без воды ничего не прорастёт. Семенам нужны вода, тепло и воздух." },
        { t: "Kälte und Trockenheit", ru: "Холод и сухость", ok: false, warum: "So bleiben die Samen schlafen. Sie brauchen Wasser und Wärme.", warumRu: "Так семена «спят». Им нужны вода и тепло." }] },
      { typ: "zuordnen", frage: "Was tut man im Garten wann?", ru: "Что делают в саду и когда?", gruppen: [
        { id: "saeen", name: "Säen und pflanzen", ru: "Сеять и сажать", bild: "🌱" }, { id: "pflegen", name: "Pflegen", ru: "Ухаживать", bild: "💧" }, { id: "ernten", name: "Ernten", ru: "Собирать урожай", bild: "🧺" }], dinge: [
        { t: "Bohnen in die Erde legen", ru: "Класть фасоль в землю", gruppe: "saeen" },
        { t: "Gießen und Unkraut zupfen", ru: "Поливать и полоть", gruppe: "pflegen" },
        { t: "Reife Tomaten pflücken", ru: "Срывать спелые помидоры", gruppe: "ernten" }] },
      { typ: "daumen", satz: "Harke und Spaten legt man mit den Zinken nach oben auf den Boden.", satzRu: "Грабли и лопату кладут на землю зубьями вверх.", bild: "🧑‍🌾", ok: false,
        warum: "Nein! Sonst tritt jemand drauf und verletzt sich. Gartengeräte immer mit den Zinken nach unten ablegen oder anlehnen.", warumRu: "Нет! Иначе кто-то наступит и поранится. Садовые инструменты кладут зубьями вниз или прислоняют." },
      { typ: "daumen", satz: "Aus Äpfeln kann man Apfelmus, Saft oder Kuchen machen.", satzRu: "Из яблок можно сделать пюре, сок или пирог.", bild: "🥧", ok: true,
        warum: "Stimmt! So kann man Obst verarbeiten und länger aufbewahren.", warumRu: "Верно! Так фрукты перерабатывают и дольше хранят." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Prima, {name}! Säe doch Kresse auf feuchter Watte. Nach ein paar Tagen kannst du sie ernten und aufs Brot streuen.",
        ru: "Отлично, {name}! Посей кресс-салат на влажной вате. Через несколько дней его можно срезать и посыпать на хлеб." }
    ]
  },
  {
    id: "kleintiere", lb: "pt", kl: 2, lz: ["su.na.01", "su.na.08"], name: "Kleine Tiere ganz groß", e: "🐞", farbe: "#B5701A", grund: "#FFF1D9",
    kurz: "Regenwurm, Marienkäfer, Schnecke, Ameise und Biene – und vier Vögel",
    schritte: [
      { typ: "info", titel: "Kleine Tiere vor der Haustür", bild: "🐞🐌🐜",
        text: "Unter Steinen, in der Wiese und im Garten leben viele kleine Tiere. Jedes hat eine wichtige Aufgabe: Regenwürmer lockern die Erde, Bienen bestäuben Blüten, Marienkäfer fressen Blattläuse.",
        ru: "Под камнями, в траве и в саду живёт много маленьких животных. У каждого важная задача: черви рыхлят землю, пчёлы опыляют цветы, божьи коровки едят тлю." },
      { typ: "zuordnen", frage: "Wer tut was?", ru: "Кто что делает?", gruppen: [
        { id: "wurm", name: "Regenwurm", ru: "Червь", bild: "🪱" }, { id: "biene", name: "Biene", ru: "Пчела", bild: "🐝" }, { id: "kaefer", name: "Marienkäfer", ru: "Божья коровка", bild: "🐞" }], dinge: [
        { t: "Lockert die Erde", ru: "Рыхлит землю", gruppe: "wurm" },
        { t: "Bestäubt Blüten und macht Honig", ru: "Опыляет цветы и делает мёд", gruppe: "biene" },
        { t: "Frisst Blattläuse", ru: "Ест тлю", gruppe: "kaefer" }] },
      { typ: "wahl", frage: "Wie viele Beine hat ein Insekt wie die Ameise?", ru: "Сколько ног у насекомого, например у муравья?", bild: "🐜", optionen: [
        { t: "Sechs", ru: "Шесть", ok: true, warum: "Richtig! Alle Insekten haben sechs Beine. Spinnen haben acht – sie sind keine Insekten.", warumRu: "Правильно! У всех насекомых шесть ног. У пауков восемь — они не насекомые." },
        { t: "Acht", ru: "Восемь", ok: false, warum: "Acht Beine haben Spinnen. Insekten haben sechs.", warumRu: "Восемь ног у пауков. У насекомых шесть." },
        { t: "Vier", ru: "Четыре", ok: false, warum: "Insekten haben sechs Beine.", warumRu: "У насекомых шесть ног." }] },
      { typ: "zuordnen", frage: "Erkennst du die Vögel?", ru: "Узнаёшь птиц?", gruppen: [
        { id: "amsel", name: "Amsel", ru: "Чёрный дрозд", bild: "🐦‍⬛" }, { id: "meise", name: "Kohlmeise", ru: "Большая синица", bild: "🐤" }, { id: "rotkehlchen", name: "Rotkehlchen", ru: "Зарянка", bild: "🐦" }], dinge: [
        { t: "Schwarz mit gelbem Schnabel (Männchen)", ru: "Чёрный с жёлтым клювом (самец)", gruppe: "amsel" },
        { t: "Gelber Bauch, schwarzer Kopf", ru: "Жёлтое брюшко, чёрная голова", gruppe: "meise" },
        { t: "Orangerote Brust", ru: "Оранжево-красная грудка", gruppe: "rotkehlchen" }] },
      { typ: "daumen", satz: "Der Spatz ist ein kleiner, brauner Vogel, der oft in der Stadt lebt.", satzRu: "Воробей — маленькая коричневая птица, которая часто живёт в городе.", bild: "🐦", ok: true,
        warum: "Stimmt! Spatzen leben gern in der Nähe von Menschen und baden sogar im Sand.", warumRu: "Верно! Воробьи любят жить рядом с людьми и даже купаются в песке." },
      { typ: "daumen", satz: "Kleine Tiere darf ich fangen und in ein Glas ohne Luftlöcher stecken.", satzRu: "Маленьких животных можно ловить и сажать в банку без дырок.", bild: "🫙", ok: false,
        warum: "Nein! Beobachte sie lieber vorsichtig mit der Becherlupe und lass sie danach wieder frei, wo du sie gefunden hast.", warumRu: "Нет! Лучше осторожно наблюдай через лупу-стаканчик и потом отпусти там, где нашёл." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Toll, {name}! Wenn viele verschiedene Tiere leben, nennt man das Artenvielfalt. Eine wilde Ecke mit Blumen im Garten hilft ihnen.",
        ru: "Отлично, {name}! Когда живёт много разных животных, это называется биоразнообразием. Дикий уголок с цветами в саду им помогает." }
    ]
  },
  {
    id: "haustiere", lb: "pt", kl: 2, lz: ["su.na.06"], name: "Heimtiere und Bauernhof", e: "🐶", farbe: "#3AA0E0", grund: "#E1F3FF",
    kurz: "Tiere pflegen, ihre Körpersprache verstehen, was der Bauernhof uns gibt",
    schritte: [
      { typ: "info", titel: "Ein Tier braucht dich", bild: "🐹",
        text: "Ein Heimtier wie Hund, Katze, Hamster oder Wellensittich braucht jeden Tag frisches Futter und Wasser, einen sauberen Platz, Bewegung – und Ruhe. Vorher informiert man sich gut, was das Tier braucht.",
        ru: "Домашнему питомцу — собаке, кошке, хомяку или попугаю — каждый день нужны свежий корм и вода, чистое место, движение и покой. Заранее надо хорошо узнать, что нужно животному." },
      { typ: "wahl", frage: "Ein Hund klemmt den Schwanz ein, legt die Ohren an und knurrt. Was bedeutet das?", ru: "Собака поджала хвост, прижала уши и рычит. Что это значит?", bild: "🐕", optionen: [
        { t: "Er hat Angst – lass ihn in Ruhe", ru: "Ей страшно — оставь её в покое", ok: true, warum: "Genau! Tiere sprechen mit dem Körper. Ein ängstlicher Hund kann zuschnappen. Abstand halten!", warumRu: "Точно! Животные говорят телом. Испуганная собака может укусить. Держи дистанцию!" },
        { t: "Er will spielen", ru: "Она хочет играть", ok: false, warum: "Nein. Eingeklemmter Schwanz und Knurren zeigen Angst oder Ärger.", warumRu: "Нет. Поджатый хвост и рычание — это страх или злость." },
        { t: "Er ist müde", ru: "Она устала", ok: false, warum: "Nein. Er zeigt Angst. Lass ihn in Ruhe.", warumRu: "Нет. Она боится. Оставь её в покое." }] },
      { typ: "daumen", satz: "Eine Katze, die schnurrt und sich an dich schmiegt, fühlt sich wohl.", satzRu: "Кошка, которая мурлычет и трётся о тебя, чувствует себя хорошо.", bild: "🐈", ok: true,
        warum: "Stimmt! Aber auch eine zufriedene Katze möchte manchmal ihre Ruhe haben.", warumRu: "Верно! Но и довольная кошка иногда хочет покоя." },
      { typ: "daumen", satz: "Nach dem Streicheln von Tieren wäscht man sich die Hände.", satzRu: "После того как гладил животных, моют руки.", bild: "🧼", ok: true,
        warum: "Richtig! Tiere können Krankheitskeime tragen. Händewaschen schützt dich.", warumRu: "Правильно! Животные могут переносить микробы. Мытьё рук защищает." },
      { typ: "zuordnen", frage: "Was bekommen wir von den Tieren auf dem Bauernhof?", ru: "Что мы получаем от животных на ферме?", gruppen: [
        { id: "kuh", name: "Kuh", ru: "Корова", bild: "🐄" }, { id: "huhn", name: "Huhn", ru: "Курица", bild: "🐔" }, { id: "schaf", name: "Schaf", ru: "Овца", bild: "🐑" }], dinge: [
        { t: "Milch, Käse, Butter", ru: "Молоко, сыр, масло", gruppe: "kuh" },
        { t: "Eier", ru: "Яйца", gruppe: "huhn" },
        { t: "Wolle", ru: "Шерсть", gruppe: "schaf" }] },
      { typ: "wahl", frage: "Wo haben Kühe es besonders gut?", ru: "Где коровам особенно хорошо?", bild: "🐄", optionen: [
        { t: "Auf der Weide mit viel Platz und Gras", ru: "На пастбище с простором и травой", ok: true, warum: "Richtig! Auf der Weide können sie laufen und fressen. Im Winter stehen sie im Stall. Manche Kühe leben in sehr großen Ställen mit wenig Platz – darüber sprechen viele Menschen.", warumRu: "Правильно! На пастбище они могут ходить и есть траву. Зимой стоят в хлеву. Некоторые коровы живут в очень больших фермах с малым местом — об этом многие спорят." },
        { t: "In einem dunklen, engen Raum", ru: "В тёмной тесной комнате", ok: false, warum: "Nein. Kühe brauchen Platz, Licht und frisches Futter.", warumRu: "Нет. Коровам нужны простор, свет и свежий корм." },
        { t: "Im Wohnzimmer", ru: "В гостиной", ok: false, warum: "Kühe sind Nutztiere, sie leben auf der Weide oder im Stall.", warumRu: "Коровы — сельскохозяйственные животные, они живут на пастбище или в хлеву." }] },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Prima, {name}! Ein Tier ist kein Spielzeug. Wer eins möchte, überlegt mit der Familie gut, ob alle genug Zeit und Platz dafür haben.",
        ru: "Отлично, {name}! Животное — не игрушка. Кто хочет питомца, обдумывает с семьёй, хватит ли у всех времени и места." }
    ]
  },
  {
    id: "licht-schatten", lb: "un", kl: 2, lz: ["su.na.04"], name: "Licht und Schatten", e: "🔦", farbe: "#E8A33D", grund: "#FFF1D9",
    kurz: "Sonne, Lampe, Schatten, durchsichtig oder undurchsichtig",
    schritte: [
      { typ: "info", titel: "Woher kommt das Licht?", bild: "☀️",
        text: "Die Sonne gibt Licht und Wärme. Lampe, Kerze und Taschenlampe sind künstliche Lichtquellen. Der Mond leuchtet nicht selbst – er wirft das Sonnenlicht zurück wie ein Spiegel.",
        ru: "Солнце даёт свет и тепло. Лампа, свеча и фонарик — искусственные источники света. Луна сама не светится — она отражает солнечный свет, как зеркало." },
      { typ: "zuordnen", frage: "Leuchtet es selbst oder nicht?", ru: "Светится само или нет?", gruppen: [
        { id: "selbst", name: "Leuchtet selbst", ru: "Светится само", bild: "💡" }, { id: "nicht", name: "Wirft Licht nur zurück", ru: "Только отражает свет", bild: "🪞" }], dinge: [
        { t: "Sonne", ru: "Солнце", gruppe: "selbst" },
        { t: "Kerze", ru: "Свеча", gruppe: "selbst" },
        { t: "Mond", ru: "Луна", gruppe: "nicht" },
        { t: "Katzenauge am Fahrrad", ru: "Катафот на велосипеде", gruppe: "nicht" }] },
      { typ: "zuordnen", frage: "Lässt es Licht durch?", ru: "Пропускает ли свет?", gruppen: [
        { id: "durch", name: "Durchsichtig", ru: "Прозрачное", bild: "🪟" }, { id: "un", name: "Undurchsichtig", ru: "Непрозрачное", bild: "🧱" }], dinge: [
        { t: "Fensterglas", ru: "Оконное стекло", gruppe: "durch" },
        { t: "Holzbrett", ru: "Доска", gruppe: "un" },
        { t: "Klarsichtfolie", ru: "Прозрачная плёнка", gruppe: "durch" },
        { t: "Pappe", ru: "Картон", gruppe: "un" }] },
      { typ: "wahl", frage: "Die Sonne steht hoch am Mittag. Wie ist dein Schatten?", ru: "В полдень солнце высоко. Какая у тебя тень?", bild: "🧍", optionen: [
        { t: "Kurz", ru: "Короткая", ok: true, warum: "Genau! Steht die Lichtquelle hoch, ist der Schatten kurz. Morgens und abends ist er lang.", warumRu: "Точно! Если источник света высоко, тень короткая. Утром и вечером она длинная." },
        { t: "Ganz lang", ru: "Очень длинная", ok: false, warum: "Lange Schatten gibt es morgens und abends, wenn die Sonne tief steht.", warumRu: "Длинные тени утром и вечером, когда солнце низко." },
        { t: "Es gibt gar keinen Schatten", ru: "Тени совсем нет", ok: false, warum: "Doch, aber er ist kurz, weil die Sonne hoch steht.", warumRu: "Есть, но короткая, потому что солнце высоко." }] },
      { typ: "daumen", satz: "Der Schatten ist immer auf der Seite, die von der Lampe abgewandt ist.", satzRu: "Тень всегда с той стороны, которая отвёрнута от лампы.", bild: "🔦", ok: true,
        warum: "Stimmt! Licht – Gegenstand – Schatten liegen auf einer Linie. Danach funktioniert auch eine Sonnenuhr.", warumRu: "Верно! Свет — предмет — тень на одной линии. Так работают и солнечные часы." },
      { typ: "daumen", satz: "Im Dunkeln sehen Autofahrer ein Kind mit heller Kleidung und Reflektoren viel früher.", satzRu: "В темноте водители гораздо раньше видят ребёнка в светлой одежде со светоотражателями.", bild: "🦺", ok: true,
        warum: "Richtig! Reflektoren werfen das Scheinwerferlicht zurück. Darum trägt man im Herbst und Winter Leuchtstreifen.", warumRu: "Правильно! Светоотражатели отражают свет фар. Поэтому осенью и зимой носят светящиеся полоски." },
      { typ: "daumen", satz: "Mit Sonnencreme, Mütze und Sonnenbrille schützt du dich im Sommer.", satzRu: "Кремом от солнца, кепкой и очками ты защищаешься летом.", bild: "🧴", ok: true,
        warum: "Stimmt! Sonnenlicht ist gut, aber zu viel schadet Haut und Augen. Nie direkt in die Sonne schauen!", warumRu: "Верно! Солнце полезно, но слишком много вредит коже и глазам. Никогда не смотри прямо на солнце!" },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Super, {name}! Probier zu Hause Schattenspiele mit der Taschenlampe: Kannst du einen Hasen an die Wand zaubern?",
        ru: "Супер, {name}! Попробуй дома театр теней с фонариком: сможешь показать зайца на стене?" }
    ]
  },
  {
    id: "luft-schall", lb: "un", kl: 2, lz: ["su.na.04"], name: "Luft, Wind und Schall", e: "🎈", farbe: "#3AA0E0", grund: "#E1F3FF",
    kurz: "Luft braucht Platz, Wind ist bewegte Luft, Töne reisen durch die Luft",
    schritte: [
      { typ: "info", titel: "Luft ist überall", bild: "🎈",
        text: "Luft kann man nicht sehen, aber sie ist da: Sie braucht Platz, sie bremst, und wenn sie warm wird, dehnt sie sich aus. Bewegte Luft ist Wind. Und wenn Luft schwingt, hören wir Töne.",
        ru: "Воздух не видно, но он есть: ему нужно место, он тормозит, а при нагревании расширяется. Движущийся воздух — это ветер. А когда воздух колеблется, мы слышим звуки." },
      { typ: "wahl", frage: "Du drückst ein umgedrehtes Glas unter Wasser. Warum kommt kein Wasser hinein?", ru: "Ты погружаешь перевёрнутый стакан в воду. Почему вода не заходит внутрь?", bild: "🥛", optionen: [
        { t: "Im Glas ist Luft, die Platz braucht", ru: "В стакане воздух, которому нужно место", ok: true, warum: "Richtig! Die Luft im Glas lässt das Wasser nicht hinein. Kippst du das Glas, blubbert die Luft heraus.", warumRu: "Правильно! Воздух в стакане не пускает воду. Если наклонить стакан, воздух выйдет пузырями." },
        { t: "Das Glas ist verzaubert", ru: "Стакан заколдован", ok: false, warum: "Es ist keine Zauberei, sondern Luft. Sie braucht Platz.", warumRu: "Это не волшебство, а воздух. Ему нужно место." },
        { t: "Wasser mag kein Glas", ru: "Вода не любит стекло", ok: false, warum: "Nein, im Glas ist Luft. Die braucht Platz.", warumRu: "Нет, в стакане воздух. Ему нужно место." }] },
      { typ: "daumen", satz: "Ein Fallschirm fällt langsam, weil die Luft ihn bremst.", satzRu: "Парашют падает медленно, потому что воздух его тормозит.", bild: "🪂", ok: true,
        warum: "Stimmt! Das nennt man Luftwiderstand. Auf dem Fahrrad spürst du ihn als Fahrtwind.", warumRu: "Верно! Это сопротивление воздуха. На велосипеде ты чувствуешь его как встречный ветер." },
      { typ: "daumen", satz: "Ein Luftballon in der warmen Sonne wird ein bisschen dicker.", satzRu: "Воздушный шарик на тёплом солнце становится немного больше.", bild: "☀️", ok: true,
        warum: "Richtig! Warme Luft dehnt sich aus. In der Kälte zieht sie sich zusammen.", warumRu: "Правильно! Тёплый воздух расширяется. На холоде сжимается." },
      { typ: "zuordnen", frage: "Wind kann nützen und schaden. Ordne zu!", ru: "Ветер может помогать и вредить. Распредели!", gruppen: [
        { id: "nutzen", name: "Nutzen", ru: "Польза", bild: "🌬️" }, { id: "gefahr", name: "Gefahr", ru: "Опасность", bild: "🌪️" }], dinge: [
        { t: "Windrad macht Strom", ru: "Ветряк делает электричество", gruppe: "nutzen" },
        { t: "Wäsche trocknet", ru: "Бельё сохнет", gruppe: "nutzen" },
        { t: "Sturm wirft Bäume um", ru: "Буря валит деревья", gruppe: "gefahr" },
        { t: "Dachziegel fliegen herunter", ru: "Слетает черепица", gruppe: "gefahr" }] },
      { typ: "wahl", frage: "Du rufst laut gegen eine Felswand und hörst deine Stimme zurück. Wie heißt das?", ru: "Ты громко кричишь в сторону скалы и слышишь свой голос. Как это называется?", bild: "⛰️", optionen: [
        { t: "Echo", ru: "Эхо", ok: true, warum: "Genau! Der Schall reist durch die Luft, prallt an der Wand ab und kommt zurück. Fledermäuse finden so im Dunkeln ihren Weg.", warumRu: "Точно! Звук летит по воздуху, отражается от стены и возвращается. Так летучие мыши находят путь в темноте." },
        { t: "Wind", ru: "Ветер", ok: false, warum: "Nein, das ist ein Echo – der Schall kommt zurück.", warumRu: "Нет, это эхо — звук возвращается." },
        { t: "Donner", ru: "Гром", ok: false, warum: "Donner kommt vom Gewitter. Deine zurückkommende Stimme ist ein Echo.", warumRu: "Гром бывает при грозе. Твой вернувшийся голос — эхо." }] },
      { typ: "daumen", satz: "Erst sieht man den Blitz, dann hört man den Donner, weil Licht schneller ist als Schall.", satzRu: "Сначала видна молния, потом слышен гром, потому что свет быстрее звука.", bild: "⛈️", ok: true,
        warum: "Stimmt! Zähl die Sekunden zwischen Blitz und Donner – je weniger, desto näher ist das Gewitter.", warumRu: "Верно! Считай секунды между молнией и громом — чем меньше, тем ближе гроза." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Toll, {name}! Bau aus zwei Bechern und einer Schnur ein Dosentelefon – der Schall reist dann durch die Schnur.",
        ru: "Отлично, {name}! Сделай телефон из двух стаканчиков и нитки — звук побежит по нитке." }
    ]
  },
  {
    id: "wetter", lb: "un", kl: 2, lz: ["su.na.04"], name: "Wetter beobachten", e: "🌡️", farbe: "#2F86C8", grund: "#E5F1FB",
    kurz: "Wettertabelle, Thermometer, die richtige Kleidung, sicher bei Nebel und Regen",
    schritte: [
      { typ: "info", titel: "Wetterforscher werden", bild: "🌦️",
        text: "Wetterforscher schauen jeden Tag: Scheint die Sonne? Regnet es? Wie warm ist es? Das tragen sie mit Zeichen in eine Wettertabelle ein. Die Temperatur misst man mit dem Thermometer in Grad Celsius (°C).",
        ru: "Исследователи погоды каждый день смотрят: светит ли солнце? Идёт ли дождь? Насколько тепло? Это записывают значками в таблицу погоды. Температуру измеряют термометром в градусах Цельсия (°C).",
        fakten: [["☀️ sonnig", "☀️ солнечно"], ["🌧️ Regen", "🌧️ дождь"], ["🌫️ Nebel", "🌫️ туман"], ["❄️ Schnee", "❄️ снег"]] },
      { typ: "wahl", frage: "Das Thermometer zeigt 0 °C. Was passiert mit Wasser draußen?", ru: "Термометр показывает 0 °C. Что происходит с водой на улице?", bild: "🧊", optionen: [
        { t: "Es gefriert zu Eis", ru: "Она замерзает в лёд", ok: true, warum: "Richtig! 0 °C ist der Gefrierpunkt. Darüber schmilzt Eis wieder.", warumRu: "Правильно! 0 °C — точка замерзания. Выше лёд снова тает." },
        { t: "Es kocht", ru: "Она кипит", ok: false, warum: "Wasser kocht erst bei 100 °C. Bei 0 °C gefriert es.", warumRu: "Вода кипит при 100 °C. При 0 °C она замерзает." },
        { t: "Nichts", ru: "Ничего", ok: false, warum: "Bei 0 °C gefriert Wasser – das ist der Gefrierpunkt.", warumRu: "При 0 °C вода замерзает — это точка замерзания." }] },
      { typ: "zuordnen", frage: "Welche Kleidung passt zu welchem Wetter?", ru: "Какая одежда к какой погоде?", gruppen: [
        { id: "regen", name: "Regen", ru: "Дождь", bild: "🌧️" }, { id: "sonne", name: "Hitze", ru: "Жара", bild: "☀️" }, { id: "kalt", name: "Frost", ru: "Мороз", bild: "❄️" }], dinge: [
        { t: "Gummistiefel und Regenjacke", ru: "Резиновые сапоги и дождевик", gruppe: "regen" },
        { t: "Sonnenhut und leichtes T-Shirt", ru: "Панама и лёгкая футболка", gruppe: "sonne" },
        { t: "Mütze, Schal und Handschuhe", ru: "Шапка, шарф и перчатки", gruppe: "kalt" }] },
      { typ: "daumen", satz: "Bei Nebel und Dunkelheit sehen Autofahrer Kinder schlechter – helle Kleidung hilft.", satzRu: "В туман и темноту водители хуже видят детей — светлая одежда помогает.", bild: "🌫️", ok: true,
        warum: "Stimmt! Und bei regennasser Straße brauchen Autos einen längeren Bremsweg. Darum besonders vorsichtig über die Straße gehen.", warumRu: "Верно! А на мокрой дороге машинам нужно больше места для торможения. Поэтому переходи улицу особенно осторожно." },
      { typ: "wahl", frage: "Montag 12 °C, Dienstag 15 °C, Mittwoch 9 °C. Wann war es am wärmsten?", ru: "Понедельник 12 °C, вторник 15 °C, среда 9 °C. Когда было теплее всего?", bild: "📊", optionen: [
        { t: "Am Dienstag", ru: "Во вторник", ok: true, warum: "Genau! 15 °C ist die höchste Zahl. So wertet man eine Wettertabelle aus.", warumRu: "Точно! 15 °C — самое большое число. Так читают таблицу погоды." },
        { t: "Am Mittwoch", ru: "В среду", ok: false, warum: "9 °C war am kältesten. Am wärmsten war der Dienstag mit 15 °C.", warumRu: "9 °C — самое холодное. Теплее всего во вторник: 15 °C." },
        { t: "Am Montag", ru: "В понедельник", ok: false, warum: "12 °C ist weniger als 15 °C. Dienstag war am wärmsten.", warumRu: "12 °C меньше 15 °C. Теплее всего было во вторник." }] },
      { typ: "daumen", satz: "Die Wettervorhersage im Radio oder in der App sagt, wie das Wetter morgen wahrscheinlich wird.", satzRu: "Прогноз по радио или в приложении говорит, какая погода, вероятно, будет завтра.", bild: "📻", ok: true,
        warum: "Richtig! „Wahrscheinlich“ – manchmal kommt es anders. Vergleich die Vorhersage mit deiner eigenen Beobachtung!", warumRu: "Правильно! «Вероятно» — иногда бывает иначе. Сравни прогноз со своим наблюдением!" },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Prima, {name}! Führ eine Woche lang eine Wettertabelle: jeden Morgen ein Zeichen und die Temperatur. Auf der Insel kannst du das Wetter auch sehen.",
        ru: "Отлично, {name}! Веди неделю таблицу погоды: каждое утро значок и температура. Погоду можно увидеть и на острове." }
    ]
  },
  {
    id: "loesen-trennen", lb: "un", kl: 2, lz: ["su.na.04", "su.na.07"], name: "Lösen und trennen", e: "🧂", farbe: "#7B55B8", grund: "#EFE6FF",
    kurz: "Was löst sich in Wasser? Filtern, verdunsten – und Vorsicht bei Putzmitteln",
    schritte: [
      { typ: "info", titel: "Wasser als Lösungsmittel", bild: "🥄",
        text: "Rührst du Salz oder Zucker in Wasser, ist es bald nicht mehr zu sehen – es hat sich gelöst. Sand oder Kieselsteine lösen sich nicht. In warmem Wasser und beim Umrühren löst sich vieles schneller.",
        ru: "Если размешать соль или сахар в воде, вскоре их не видно — они растворились. Песок и галька не растворяются. В тёплой воде и при помешивании многое растворяется быстрее." },
      { typ: "zuordnen", frage: "Löst es sich in Wasser oder nicht?", ru: "Растворяется ли в воде?", gruppen: [
        { id: "ja", name: "Löst sich", ru: "Растворяется", bild: "✨" }, { id: "nein", name: "Löst sich nicht", ru: "Не растворяется", bild: "🪨" }], dinge: [
        { t: "Salz", ru: "Соль", gruppe: "ja" },
        { t: "Zucker", ru: "Сахар", gruppe: "ja" },
        { t: "Sand", ru: "Песок", gruppe: "nein" },
        { t: "Murmel", ru: "Стеклянный шарик", gruppe: "nein" }] },
      { typ: "wahl", frage: "Wie bekommst du Sand wieder aus dem Wasser?", ru: "Как отделить песок от воды?", bild: "☕", optionen: [
        { t: "Durch einen Kaffeefilter gießen", ru: "Пропустить через фильтр", ok: true, warum: "Richtig! Das Wasser läuft durch, der Sand bleibt im Filter hängen. Oder du wartest, bis der Sand sich unten absetzt.", warumRu: "Правильно! Вода проходит, песок остаётся в фильтре. Или подожди, пока песок осядет на дно." },
        { t: "Kräftig umrühren", ru: "Сильно помешать", ok: false, warum: "Dann wirbelt der Sand nur herum. Filtern oder absetzen lassen hilft.", warumRu: "Тогда песок только кружится. Помогает фильтр или отстаивание." },
        { t: "Gar nicht", ru: "Никак", ok: false, warum: "Doch! Mit einem Filter geht es.", warumRu: "Можно! С помощью фильтра." }] },
      { typ: "wahl", frage: "Salzwasser steht ein paar Tage in einer flachen Schale am Fenster. Was bleibt übrig?", ru: "Солёная вода несколько дней стоит в плоской миске у окна. Что останется?", bild: "🧂", optionen: [
        { t: "Kleine Salzkristalle", ru: "Маленькие кристаллы соли", ok: true, warum: "Genau! Das Wasser ist verdunstet, das Salz bleibt zurück und bildet Kristalle.", warumRu: "Точно! Вода испарилась, соль осталась и образовала кристаллы." },
        { t: "Gar nichts", ru: "Ничего", ok: false, warum: "Das Wasser verdunstet, aber das Salz bleibt als Kristalle zurück.", warumRu: "Вода испаряется, а соль остаётся кристаллами." },
        { t: "Süßer Sirup", ru: "Сладкий сироп", ok: false, warum: "Es war Salz – es bleiben Salzkristalle.", warumRu: "Это была соль — остаются кристаллы соли." }] },
      { typ: "daumen", satz: "Eine Flasche mit klarer Flüssigkeit aus dem Putzschrank kann man trinken, wenn sie wie Wasser aussieht.", satzRu: "Бутылку с прозрачной жидкостью из шкафа с моющими средствами можно пить, если она похожа на воду.", bild: "🧴", ok: false,
        warum: "Nein! Putzmittel können giftig oder ätzend sein, auch wenn sie wie Wasser aussehen. Nie probieren – und solche Mittel nie in Trinkflaschen füllen.", warumRu: "Нет! Моющие средства могут быть ядовитыми или едкими, даже если похожи на воду. Никогда не пробуй — и никогда не наливай их в бутылки для питья." },
      { typ: "wahl", frage: "Was bedeutet ein Warnzeichen mit Totenkopf auf einer Flasche?", ru: "Что означает знак с черепом на бутылке?", bild: "☠️", optionen: [
        { t: "Giftig – nicht anfassen, Erwachsenen geben", ru: "Ядовито — не трогать, отдать взрослым", ok: true, warum: "Richtig! Solche Flaschen gehören verschlossen und für Kinder unerreichbar aufbewahrt.", warumRu: "Правильно! Такие бутылки хранят закрытыми и недоступными для детей." },
        { t: "Piratenschatz", ru: "Пиратский клад", ok: false, warum: "Nein! Der Totenkopf warnt vor Gift.", warumRu: "Нет! Череп предупреждает о яде." },
        { t: "Besonders lecker", ru: "Особенно вкусно", ok: false, warum: "Nein! Das Zeichen heißt: giftig.", warumRu: "Нет! Знак означает «ядовито»." }] },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Super, {name}! Mach mit einem Erwachsenen den Salz-Versuch: Salzwasser in eine Schale, ans Fenster stellen und jeden Tag nachsehen.",
        ru: "Супер, {name}! Сделай со взрослым опыт с солью: солёную воду в миску, на окно, и смотри каждый день." }
    ]
  },
  {
    id: "schule-ort", lb: "rz", kl: 2, lz: ["su.ge.01", "su.ge.02", "su.hi.04"], name: "Schule und Heimatort", e: "🏘️", farbe: "#5DB84A", grund: "#E3F5DC",
    kurz: "Räume der Schule, Fluchtweg, wichtige Orte, Ortsplan, Bus und Bahn",
    schritte: [
      { typ: "info", titel: "Mein Schulhaus", bild: "🏫",
        text: "In der Schule gibt es viele Räume: Klassenzimmer, Turnhalle, Sekretariat, Speisesaal, Toiletten und vielleicht eine Bibliothek. Grüne Schilder mit einem laufenden Männchen zeigen den Fluchtweg nach draußen.",
        ru: "В школе много помещений: классы, спортзал, секретариат, столовая, туалеты и, может быть, библиотека. Зелёные знаки с бегущим человечком показывают путь эвакуации наружу." },
      { typ: "wahl", frage: "Der Feueralarm schrillt. Was machst du?", ru: "Звенит пожарная тревога. Что ты делаешь?", bild: "🚨", optionen: [
        { t: "Ruhig mit der Klasse dem Fluchtweg nach draußen folgen", ru: "Спокойно идти с классом по пути эвакуации наружу", ok: true, warum: "Genau! Nichts mitnehmen, nicht rennen, bei der Lehrerin bleiben und am Sammelplatz warten.", warumRu: "Точно! Ничего не брать, не бежать, держаться учительницы и ждать на месте сбора." },
        { t: "Meinen Ranzen packen", ru: "Собрать рюкзак", ok: false, warum: "Nein! Sachen bleiben liegen. Schnell und ruhig raus.", warumRu: "Нет! Вещи оставляют. Быстро и спокойно наружу." },
        { t: "Mich in der Toilette verstecken", ru: "Спрятаться в туалете", ok: false, warum: "Nein! Nie verstecken. Mit der Klasse raus zum Sammelplatz.", warumRu: "Нет! Никогда не прятаться. С классом наружу к месту сбора." }] },
      { typ: "zuordnen", frage: "Wer hilft mir wo?", ru: "Кто где мне поможет?", gruppen: [
        { id: "arzt", name: "Arztpraxis", ru: "Врач", bild: "🩺" }, { id: "biblio", name: "Bibliothek", ru: "Библиотека", bild: "📚" }, { id: "rathaus", name: "Rathaus", ru: "Ратуша", bild: "🏛️" }], dinge: [
        { t: "Ich habe Halsschmerzen", ru: "У меня болит горло", gruppe: "arzt" },
        { t: "Ich suche ein Buch über Pferde", ru: "Ищу книгу о лошадях", gruppe: "biblio" },
        { t: "Ich brauche einen Kinderausweis", ru: "Нужен детский паспорт", gruppe: "rathaus" }] },
      { typ: "wahl", frage: "Auf einem Ortsplan ist die Kirche als Kreuz eingezeichnet. Wo steht, was die Zeichen bedeuten?", ru: "На плане посёлка церковь отмечена крестиком. Где написано, что значат значки?", bild: "🗺️", optionen: [
        { t: "In der Legende", ru: "В легенде (условных обозначениях)", ok: true, warum: "Richtig! Die Legende erklärt alle Zeichen eines Plans.", warumRu: "Правильно! Легенда объясняет все значки плана." },
        { t: "Auf der Rückseite der Kirche", ru: "На обратной стороне церкви", ok: false, warum: "Nein, die Zeichen erklärt die Legende auf dem Plan.", warumRu: "Нет, значки объясняет легенда на плане." },
        { t: "Nirgends", ru: "Нигде", ok: false, warum: "Doch – in der Legende.", warumRu: "Есть — в легенде." }] },
      { typ: "daumen", satz: "Straßennamen, alte Häuser und Museen erzählen etwas über die Geschichte meines Ortes.", satzRu: "Названия улиц, старые дома и музеи рассказывают об истории моего места.", bild: "🏛️", ok: true,
        warum: "Stimmt! Frag Oma, Opa oder Nachbarn, wie es früher bei euch aussah – das sind Spuren der Vergangenheit.", warumRu: "Верно! Спроси бабушку, дедушку или соседей, как раньше всё выглядело, — это следы прошлого." },
      { typ: "wahl", frage: "Du wartest an der Bushaltestelle. Wo stehst du?", ru: "Ты ждёшь на автобусной остановке. Где ты стоишь?", bild: "🚌", optionen: [
        { t: "Mit Abstand zur Bordsteinkante", ru: "На расстоянии от края тротуара", ok: true, warum: "Genau! Erst wenn der Bus steht und die Tür offen ist, steigst du ein – ohne Drängeln.", warumRu: "Точно! Садишься только когда автобус остановился и дверь открыта — без толкотни." },
        { t: "Direkt an der Straße", ru: "Прямо у дороги", ok: false, warum: "Zu gefährlich! Bleib mit Abstand zur Bordsteinkante.", warumRu: "Слишком опасно! Стой подальше от края." },
        { t: "Auf der Fahrbahn", ru: "На проезжей части", ok: false, warum: "Nein! Nie auf die Fahrbahn. Warte mit Abstand.", warumRu: "Нет! Никогда на дорогу. Жди на расстоянии." }] },
      { typ: "daumen", satz: "Ein freundlicher Fremder bietet an, mich mit dem Auto nach Hause zu fahren. Ich steige ein.", satzRu: "Дружелюбный незнакомец предлагает отвезти меня домой. Я сажусь в машину.", bild: "🚗", ok: false,
        warum: "Nein! Geh nie mit Fremden mit und steig nie zu ihnen ins Auto. Lauf weg und erzähl es einem Erwachsenen, dem du vertraust.", warumRu: "Нет! Никогда не уходи с незнакомцами и не садись к ним в машину. Убеги и расскажи взрослому, которому доверяешь." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Toll, {name}! Mal eine Wegskizze von deiner Schule nach Hause: Welche wichtigen Orte kommen unterwegs vorbei?",
        ru: "Отлично, {name}! Нарисуй схему пути от школы домой: какие важные места по дороге?" }
    ]
  },
  {
    id: "meine-schulzeit", lb: "ex", kl: 2, lz: ["su.hi.03"], name: "Meine ersten Schuljahre", e: "🎒", farbe: "#C2337A", grund: "#FDEAF3",
    kurz: "Zeitleiste, schönste Momente, Portfolio, Steckbrief zu meinem Lieblingstier",
    schritte: [
      { typ: "info", titel: "Rückschau", bild: "📅",
        text: "Erinnerst du dich an deinen ersten Schultag? An die Zuckertüte, das erste Wort, das du lesen konntest? In einem Portfolio sammelst du deine besten Arbeiten – so siehst du, was du alles gelernt hast.",
        ru: "Помнишь свой первый школьный день? Кулёк со сладостями, первое прочитанное слово? В портфолио собирают лучшие работы — так видно, сколькому ты научился." },
      { typ: "wahl", frage: "Was gehört in eine Zeitleiste deiner Schulzeit ganz nach vorn?", ru: "Что ставят в самое начало временной ленты твоей учёбы?", bild: "➡️", optionen: [
        { t: "Der erste Schultag", ru: "Первый школьный день", ok: true, warum: "Richtig! Eine Zeitleiste ordnet Ereignisse nach der Zeit: erst der erste Schultag, dann das erste Zeugnis und so weiter.", warumRu: "Правильно! Временная лента упорядочивает события: сначала первый день, потом первый табель и так далее." },
        { t: "Die Sommerferien nach Klasse 2", ru: "Летние каникулы после 2 класса", ok: false, warum: "Die kommen später. Ganz vorn steht der erste Schultag.", warumRu: "Они позже. В начале — первый школьный день." },
        { t: "Das Zeugnis der 2. Klasse", ru: "Табель 2 класса", ok: false, warum: "Das ist später. Vorn steht der erste Schultag.", warumRu: "Это позже. В начале — первый день." }] },
      { typ: "daumen", satz: "Etwas, das mir am Anfang schwerfiel und das ich jetzt kann, ist ein echter Erfolg.", satzRu: "То, что сначала было трудно, а теперь получается, — настоящий успех.", bild: "🏆", ok: true,
        warum: "Stimmt! Gerade gemeisterte Schwierigkeiten zeigen, wie viel du gelernt hast. Darauf darfst du stolz sein.", warumRu: "Верно! Преодолённые трудности показывают, сколько ты научился. Этим можно гордиться." },
      { typ: "zuordnen", frage: "Was gehört in einen Tier-Steckbrief?", ru: "Что входит в анкету животного?", gruppen: [
        { id: "ja", name: "Gehört hinein", ru: "Входит", bild: "📋" }, { id: "nein", name: "Gehört nicht hinein", ru: "Не входит", bild: "🚫" }], dinge: [
        { t: "Name des Tieres", ru: "Название животного", gruppe: "ja" },
        { t: "Was es frisst und wo es lebt", ru: "Что ест и где живёт", gruppe: "ja" },
        { t: "Was es im Laden kostet", ru: "Сколько стоит в магазине", gruppe: "nein" },
        { t: "Mein Lieblingsessen", ru: "Моя любимая еда", gruppe: "nein" }] },
      { typ: "wahl", frage: "Wie kannst du deine gelungenen Arbeiten anderen zeigen?", ru: "Как показать другим свои удачные работы?", bild: "🖼️", optionen: [
        { t: "Als Plakat, Mappe oder kleine Ausstellung", ru: "Плакатом, папкой или маленькой выставкой", ok: true, warum: "Genau! Es gibt viele Präsentationsformen – auch Fotos am Tablet.", warumRu: "Точно! Есть много способов показать — и фото на планшете." },
        { t: "Gar nicht, das ist peinlich", ru: "Никак, это стыдно", ok: false, warum: "Doch! Zeig ruhig, was du geschafft hast. Das macht Mut.", warumRu: "Можно! Покажи, что ты сделал. Это придаёт смелости." },
        { t: "Wegwerfen", ru: "Выбросить", ok: false, warum: "Lieber aufheben! Später freust du dich darüber.", warumRu: "Лучше сохранить! Потом будешь рад." }] },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Wunderbar, {name}! Mach dir mit deiner Familie eine Schatzkiste: das erste Lesebuch-Blatt, ein schönes Bild, ein Foto vom ersten Schultag.",
        ru: "Чудесно, {name}! Сделай с семьёй шкатулку-сокровищницу: первый лист из букваря, красивый рисунок, фото первого школьного дня." }
    ]
  }
);
// ---------- Schuljahr Sachunterricht (Lehrplan Sachsen 2019, Kl. 3 und 4) ----------
window.THEMEN.push(
  {
    id: "kulturen", lb: "zl", stufe: 3, lz: ["su.so.04"], name: "Kinder der Welt", e: "🌏", farbe: "#2F86C8", grund: "#E5F1FB",
    kurz: "Andere Länder, Feste und Gewohnheiten – und was uns verbindet",
    schritte: [
      { typ: "info", titel: "Viele Kulturen", bild: "🌍",
        text: "Kinder auf der ganzen Welt spielen, lernen und feiern – aber oft auf unterschiedliche Weise. Vielleicht kommen Kinder in deiner Klasse aus anderen Ländern. Auf dem Globus und im Atlas findest du, wo diese Länder liegen.",
        ru: "Дети по всему миру играют, учатся и празднуют — но часто по-разному. Может быть, в твоём классе есть дети из других стран. На глобусе и в атласе можно найти, где эти страны." },
      { typ: "zuordnen", frage: "Welches Fest gehört zu wem?", ru: "Какой праздник чей?", gruppen: [
        { id: "licht", name: "Lichterfeste", ru: "Праздники огней", bild: "🪔" }, { id: "fasten", name: "Fest nach dem Fasten", ru: "Праздник после поста", bild: "🌙" }], dinge: [
        { t: "Diwali (Hinduismus)", ru: "Дивали (индуизм)", gruppe: "licht" },
        { t: "Chanukka (Judentum)", ru: "Ханука (иудаизм)", gruppe: "licht" },
        { t: "Zuckerfest (Islam)", ru: "Ураза-байрам (ислам)", gruppe: "fasten" },
        { t: "Ostern (Christentum)", ru: "Пасха (христианство)", gruppe: "fasten" }] },
      { typ: "wahl", frage: "In Japan begrüßen sich viele Menschen mit einer Verbeugung. Was zeigt das?", ru: "В Японии многие здороваются поклоном. Что это показывает?", bild: "🙇", optionen: [
        { t: "Es gibt verschiedene Arten, höflich zu sein", ru: "Вежливость бывает разной", ok: true, warum: "Genau! Händeschütteln, Verbeugung, Wangenkuss – alles heißt: Schön, dich zu sehen.", warumRu: "Точно! Рукопожатие, поклон, поцелуй в щёку — всё значит: рад тебя видеть." },
        { t: "Japaner sind unhöflich", ru: "Японцы невежливы", ok: false, warum: "Nein! Die Verbeugung ist dort sehr höflich – nur anders als bei uns.", warumRu: "Нет! Поклон там очень вежлив — просто иначе, чем у нас." },
        { t: "Sie haben Rückenschmerzen", ru: "У них болит спина", ok: false, warum: "Nein, das ist eine höfliche Begrüßung.", warumRu: "Нет, это вежливое приветствие." }] },
      { typ: "daumen", satz: "Wer mit Stäbchen isst, isst falsch.", satzRu: "Кто ест палочками, ест неправильно.", bild: "🥢", ok: false,
        warum: "Nein! In vielen Ländern isst man mit Stäbchen, anderswo mit Besteck oder mit der Hand. Nichts davon ist falsch.", warumRu: "Нет! Во многих странах едят палочками, где-то приборами или руками. Ничто из этого не ошибка." },
      { typ: "daumen", satz: "Kinder überall auf der Welt spielen gern Fangen und Verstecken.", satzRu: "Дети во всём мире любят догонялки и прятки.", bild: "🙈", ok: true,
        warum: "Stimmt! Vieles ist anders, vieles ist gleich. Im Fremden entdeckt man oft Eigenes.", warumRu: "Верно! Многое разное, многое одинаковое. В чужом часто находишь своё." },
      { typ: "wahl", frage: "Ein neues Kind kommt aus einem anderen Land in deine Klasse. Was ist eine gute Idee?", ru: "В класс пришёл новый ребёнок из другой страны. Что будет хорошей идеей?", bild: "🤝", optionen: [
        { t: "Es fragen, wie man in seiner Sprache „Hallo“ sagt", ru: "Спросить, как на его языке «привет»", ok: true, warum: "Toll! So zeigst du Interesse und das Kind fühlt sich willkommen.", warumRu: "Здорово! Так ты показываешь интерес, и ребёнку приятно." },
        { t: "Es nicht beachten", ru: "Не обращать внимания", ok: false, warum: "Lieber nicht. Jeder möchte dazugehören.", warumRu: "Лучше не надо. Каждый хочет быть своим." },
        { t: "Über seine Kleidung lachen", ru: "Смеяться над его одеждой", ok: false, warum: "Nein, das verletzt. Sei neugierig und freundlich.", warumRu: "Нет, это обидно. Будь любопытным и дружелюбным." }] },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Super, {name}! Such mit deiner Familie auf dem Globus ein Land, das du nicht kennst, und finde drei Dinge darüber heraus.",
        ru: "Супер, {name}! Найди с семьёй на глобусе незнакомую страну и узнай о ней три вещи." }
    ]
  },
  {
    id: "land-frueher", lb: "zl", stufe: 3, lz: ["su.hi.03", "su.hi.04"], name: "Leben auf dem Land – früher und heute", e: "🚜", farbe: "#8A6E2F", grund: "#F7F0DD",
    kurz: "Pferd und Pflug, Traktor und Mähdrescher, Berufe und Freizeit im Dorf",
    schritte: [
      { typ: "info", titel: "Ein Dorf vor 100 Jahren", bild: "🐴",
        text: "Früher arbeiteten fast alle Menschen auf dem Dorf in der Landwirtschaft. Pferde zogen den Pflug, man drosch das Korn mit dem Dreschflegel und holte Wasser vom Brunnen. Auch Kinder mussten viel mithelfen.",
        ru: "Раньше почти все жители деревни работали в сельском хозяйстве. Лошади тянули плуг, зерно молотили цепом, воду носили из колодца. Дети тоже много помогали." },
      { typ: "zuordnen", frage: "Früher oder heute?", ru: "Раньше или сейчас?", gruppen: [
        { id: "frueher", name: "Früher", ru: "Раньше", bild: "🕰️" }, { id: "heute", name: "Heute", ru: "Сейчас", bild: "📱" }], dinge: [
        { t: "Pferd vor dem Pflug", ru: "Лошадь с плугом", gruppe: "frueher" },
        { t: "Mähdrescher erntet das Korn", ru: "Комбайн убирает зерно", gruppe: "heute" },
        { t: "Wasser vom Dorfbrunnen holen", ru: "Носить воду из колодца", gruppe: "frueher" },
        { t: "Melkroboter im Kuhstall", ru: "Доильный робот в коровнике", gruppe: "heute" }] },
      { typ: "wahl", frage: "Warum arbeiten heute viel weniger Menschen in der Landwirtschaft?", ru: "Почему сейчас гораздо меньше людей работает в сельском хозяйстве?", bild: "🚜", optionen: [
        { t: "Maschinen erledigen viel Arbeit", ru: "Машины делают много работы", ok: true, warum: "Richtig! Ein Mähdrescher schafft an einem Tag, wofür früher viele Menschen Wochen brauchten.", warumRu: "Правильно! Комбайн за день делает то, на что раньше много людей тратили недели." },
        { t: "Weil niemand mehr Brot isst", ru: "Потому что никто не ест хлеб", ok: false, warum: "Doch, Brot essen wir noch. Maschinen machen die Arbeit.", warumRu: "Хлеб едят. Работу делают машины." },
        { t: "Weil es keine Felder mehr gibt", ru: "Потому что нет полей", ok: false, warum: "Felder gibt es noch. Aber Maschinen helfen.", warumRu: "Поля есть. Но помогают машины." }] },
      { typ: "daumen", satz: "Früher waren die Aufgaben meist fest verteilt: Frauen im Haus, Männer auf dem Feld. Heute ist das viel freier.", satzRu: "Раньше обязанности были обычно чётко разделены: женщины дома, мужчины в поле. Сейчас это гораздо свободнее.", bild: "👩‍🌾", ok: true,
        warum: "Stimmt! Heute kann jeder jeden Beruf lernen – auch Bäuerin oder Landwirt.", warumRu: "Верно! Сейчас каждый может выучить любую профессию — и фермера тоже." },
      { typ: "wahl", frage: "Wie kannst du herausfinden, wie man früher in deinem Ort lebte?", ru: "Как узнать, как раньше жили в твоём посёлке?", bild: "🏛️", optionen: [
        { t: "Ältere Menschen befragen, alte Fotos und Gegenstände im Museum ansehen", ru: "Расспросить пожилых, посмотреть старые фото и вещи в музее", ok: true, warum: "Genau! Das sind Quellen. Mit ihnen kann man die Vergangenheit erforschen.", warumRu: "Точно! Это источники. С ними можно исследовать прошлое." },
        { t: "Raten", ru: "Угадывать", ok: false, warum: "Besser sind echte Quellen: Menschen, Fotos, Museen.", warumRu: "Лучше настоящие источники: люди, фото, музеи." },
        { t: "Einen Zeichentrickfilm schauen", ru: "Посмотреть мультфильм", ok: false, warum: "Filme sind oft ausgedacht. Echte Quellen sind besser.", warumRu: "Фильмы часто выдуманы. Настоящие источники лучше." }] },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Prima, {name}! Frag Oma oder Opa: Womit habt ihr als Kinder gespielt, und wie sah euer Dorf oder eure Stadt aus?",
        ru: "Отлично, {name}! Спроси бабушку или дедушку: во что вы играли в детстве и как выглядела ваша деревня или город?" }
    ]
  },
  {
    id: "sinne-genau", lb: "kg", stufe: 3, lz: ["su.na.02"], name: "Auge und Ohr genauer", e: "👁️", farbe: "#3AA0E0", grund: "#E1F3FF",
    kurz: "Wie Auge und Ohr arbeiten, Sinnestäuschungen, Schutz und Hilfe für Menschen mit Behinderung",
    schritte: [
      { typ: "info", titel: "So sieht das Auge", bild: "👁️",
        text: "Licht fällt durch das schwarze Loch in der Mitte – die Pupille. Die farbige Iris drumherum macht sie größer oder kleiner. Hinten im Auge entsteht das Bild, und der Sehnerv bringt es zum Gehirn.",
        ru: "Свет проходит через чёрное отверстие в центре — зрачок. Цветная радужка вокруг делает его больше или меньше. Внутри глаза возникает изображение, а зрительный нерв передаёт его в мозг.",
        fakten: [["Pupille ⚫", "Зрачок ⚫"], ["Iris 🟤", "Радужка 🟤"], ["Linse 🔍", "Хрусталик 🔍"], ["Sehnerv 🧠", "Зрительный нерв 🧠"]] },
      { typ: "wahl", frage: "Du kommst aus dem Dunkeln ins helle Licht. Was macht deine Pupille?", ru: "Ты выходишь из темноты на яркий свет. Что делает зрачок?", bild: "💡", optionen: [
        { t: "Sie wird kleiner", ru: "Становится меньше", ok: true, warum: "Richtig! So kommt weniger Licht ins Auge. Im Dunkeln wird sie groß.", warumRu: "Правильно! Так в глаз попадает меньше света. В темноте он расширяется." },
        { t: "Sie wird größer", ru: "Становится больше", ok: false, warum: "Im Hellen wird sie kleiner, damit nicht zu viel Licht hineinfällt.", warumRu: "На свету он уменьшается, чтобы не попадало слишком много света." },
        { t: "Sie verschwindet", ru: "Исчезает", ok: false, warum: "Nein, sie wird nur kleiner.", warumRu: "Нет, он только уменьшается." }] },
      { typ: "daumen", satz: "Das Trommelfell im Ohr schwingt, wenn Schall darauf trifft.", satzRu: "Барабанная перепонка в ухе колеблется, когда на неё попадает звук.", bild: "👂", ok: true,
        warum: "Stimmt! Die Ohrmuschel fängt den Schall, das Trommelfell schwingt, und Nerven melden es dem Gehirn.", warumRu: "Верно! Ушная раковина ловит звук, перепонка колеблется, а нервы сообщают мозгу." },
      { typ: "daumen", satz: "Manchmal täuschen uns die Augen: Zwei gleich lange Linien sehen verschieden lang aus.", satzRu: "Иногда глаза обманывают: две одинаковые линии кажутся разной длины.", bild: "↔️", ok: true,
        warum: "Richtig! Das ist eine Sinnestäuschung. Mit dem Lineal kann man nachprüfen.", warumRu: "Правильно! Это обман чувств. Линейкой можно проверить." },
      { typ: "zuordnen", frage: "Wie schützt du Augen und Ohren?", ru: "Как защитить глаза и уши?", gruppen: [
        { id: "auge", name: "Augen", ru: "Глаза", bild: "👓" }, { id: "ohr", name: "Ohren", ru: "Уши", bild: "🎧" }], dinge: [
        { t: "Sonnenbrille im Sommer", ru: "Солнечные очки летом", gruppe: "auge" },
        { t: "Beim Lesen gutes Licht", ru: "Хороший свет при чтении", gruppe: "auge" },
        { t: "Kopfhörer nicht zu laut", ru: "Наушники не слишком громко", gruppe: "ohr" },
        { t: "Gehörschutz bei Lärm", ru: "Защита ушей при шуме", gruppe: "ohr" }] },
      { typ: "wahl", frage: "Wie lesen blinde Menschen?", ru: "Как читают слепые люди?", bild: "⠃", optionen: [
        { t: "Mit den Fingern in Blindenschrift (Punkte zum Ertasten)", ru: "Пальцами по шрифту Брайля (точки на ощупь)", ok: true, warum: "Genau! Andere Sinne helfen aus. Ein Blindenhund oder ein weißer Stock helfen beim Gehen. Gehörlose sprechen oft in Gebärdensprache.", warumRu: "Точно! Помогают другие чувства. При ходьбе помогают собака-поводырь или белая трость. Глухие часто говорят на жестовом языке." },
        { t: "Gar nicht", ru: "Никак", ok: false, warum: "Doch! Mit der Blindenschrift ertasten sie die Buchstaben.", warumRu: "Читают! Шрифтом Брайля на ощупь." },
        { t: "Mit einer Lupe", ru: "С лупой", ok: false, warum: "Eine Lupe hilft Menschen, die schlecht sehen. Blinde lesen mit den Fingern.", warumRu: "Лупа помогает тем, кто плохо видит. Слепые читают пальцами." }] },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Toll, {name}! Wenn du einen Menschen mit Behinderung triffst: Frag freundlich, ob er Hilfe möchte – und hilf nur, wenn er Ja sagt.",
        ru: "Отлично, {name}! Если встретишь человека с инвалидностью: вежливо спроси, нужна ли помощь, — и помогай, только если он скажет «да»." }
    ]
  },
  {
    id: "getreide", lb: "pt", stufe: 3, lz: ["su.na.08"], name: "Getreide genau", e: "🌾", farbe: "#E8A33D", grund: "#FFF1D9",
    kurz: "Weizen, Roggen, Gerste, Hafer, Mais – Ähre, Rispe, Kolben, Brot wertschätzen",
    schritte: [
      { typ: "info", titel: "Fünf Getreidearten", bild: "🌾",
        text: "Weizen, Roggen und Gerste tragen ihre Körner in einer Ähre. Beim Hafer hängen die Körner an einer lockeren Rispe. Der Mais hat einen dicken Kolben. Getreide ist eine der ältesten Kulturpflanzen der Menschen.",
        ru: "У пшеницы, ржи и ячменя зёрна в колосе. У овса зёрна висят на рыхлой метёлке. У кукурузы толстый початок. Зерновые — одни из древнейших культур человека.",
        fakten: [["Ähre: Weizen, Roggen, Gerste", "Колос: пшеница, рожь, ячмень"], ["Rispe: Hafer", "Метёлка: овёс"], ["Kolben: Mais 🌽", "Початок: кукуруза 🌽"]] },
      { typ: "zuordnen", frage: "Ähre, Rispe oder Kolben?", ru: "Колос, метёлка или початок?", gruppen: [
        { id: "aehre", name: "Ähre", ru: "Колос", bild: "🌾" }, { id: "rispe", name: "Rispe", ru: "Метёлка", bild: "🌿" }, { id: "kolben", name: "Kolben", ru: "Початок", bild: "🌽" }], dinge: [
        { t: "Weizen", ru: "Пшеница", gruppe: "aehre" },
        { t: "Gerste mit langen Grannen", ru: "Ячмень с длинными остями", gruppe: "aehre" },
        { t: "Hafer", ru: "Овёс", gruppe: "rispe" },
        { t: "Mais", ru: "Кукуруза", gruppe: "kolben" }] },
      { typ: "wahl", frage: "Aus welchem Getreide backt man das typische dunkle Brot?", ru: "Из какого зерна пекут типичный тёмный хлеб?", bild: "🍞", optionen: [
        { t: "Roggen", ru: "Рожь", ok: true, warum: "Richtig! Roggenbrot ist dunkel und kräftig. Für helle Brötchen nimmt man meist Weizen.", warumRu: "Правильно! Ржаной хлеб тёмный и сытный. Для светлых булочек обычно берут пшеницу." },
        { t: "Mais", ru: "Кукуруза", ok: false, warum: "Mais nimmt man eher für Popcorn und Cornflakes. Dunkles Brot ist meist aus Roggen.", warumRu: "Кукурузу берут для попкорна и хлопьев. Тёмный хлеб обычно ржаной." },
        { t: "Hafer", ru: "Овёс", ok: false, warum: "Aus Hafer macht man Haferflocken. Dunkles Brot ist meist aus Roggen.", warumRu: "Из овса делают хлопья. Тёмный хлеб обычно ржаной." }] },
      { typ: "daumen", satz: "Die grünen Beeren der Kartoffelpflanze kann man essen.", satzRu: "Зелёные ягоды картофеля можно есть.", bild: "🥔", ok: false,
        warum: "Nein! Die Beeren sind giftig. Essen kann man nur die Knollen, die unter der Erde an den Ausläufern wachsen – und zwar gekocht.", warumRu: "Нет! Ягоды ядовиты. Едят только клубни, которые растут под землёй на побегах, — и в варёном виде." },
      { typ: "daumen", satz: "Der Kartoffelkäfer ist ein Schädling, der die Blätter der Kartoffel frisst.", satzRu: "Колорадский жук — вредитель, который ест листья картофеля.", bild: "🪲", ok: true,
        warum: "Stimmt! Er ist gelb-schwarz gestreift. Die Bauern müssen ihre Felder schützen.", warumRu: "Верно! Он в жёлто-чёрную полоску. Фермерам приходится защищать поля." },
      { typ: "wahl", frage: "In manchen Ländern haben Menschen nicht genug zu essen. Was kannst du tun?", ru: "В некоторых странах людям не хватает еды. Что можешь сделать ты?", bild: "🌍", optionen: [
        { t: "Lebensmittel nicht wegwerfen und wertschätzen", ru: "Не выбрасывать еду и ценить её", ok: true, warum: "Genau! Brot vom Vortag kann man toasten oder zu Semmelbröseln machen. Jedes Stück Brot steckt voller Arbeit.", warumRu: "Точно! Вчерашний хлеб можно поджарить или сделать сухари. В каждом куске хлеба много труда." },
        { t: "Möglichst viel kaufen", ru: "Покупать как можно больше", ok: false, warum: "Dann wird oft zu viel weggeworfen. Besser: wertschätzen und nichts verschwenden.", warumRu: "Тогда часто много выбрасывают. Лучше ценить и не тратить зря." },
        { t: "Nichts", ru: "Ничего", ok: false, warum: "Doch! Nichts verschwenden ist ein guter Anfang.", warumRu: "Можно! Ничего не тратить зря — хорошее начало." }] },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Super, {name}! Schau beim nächsten Spaziergang an einem Feld: Ist es Weizen, Gerste oder Mais?",
        ru: "Супер, {name}! На следующей прогулке посмотри на поле: это пшеница, ячмень или кукуруза?" }
    ]
  },
  {
    id: "wiese", lb: "pt", stufe: 3, lz: ["su.na.08"], name: "Lebensraum Wiese", e: "🌼", farbe: "#5DB84A", grund: "#E3F5DC",
    kurz: "Stockwerke der Wiese, vom Ei zum Schmetterling, Wiesenpflanzen bestimmen",
    schritte: [
      { typ: "info", titel: "Die Wiese hat Stockwerke", bild: "🌼",
        text: "Unten im Boden leben Regenwürmer und Käfer. Zwischen den Gräsern springen Heuschrecken und kriechen Schnecken. Oben auf den Blüten summen Bienen und gaukeln Schmetterlinge.",
        ru: "Внизу в почве живут черви и жуки. Между травами прыгают кузнечики и ползут улитки. Наверху на цветах жужжат пчёлы и порхают бабочки." },
      { typ: "zuordnen", frage: "Wo lebt das Tier am liebsten?", ru: "Где животное любит жить?", gruppen: [
        { id: "boden", name: "Im Boden", ru: "В почве", bild: "🟫" }, { id: "gras", name: "Zwischen den Gräsern", ru: "Между травами", bild: "🌱" }, { id: "bluete", name: "Auf den Blüten", ru: "На цветах", bild: "🌸" }], dinge: [
        { t: "Regenwurm", ru: "Червь", gruppe: "boden" },
        { t: "Heuschrecke", ru: "Кузнечик", gruppe: "gras" },
        { t: "Biene", ru: "Пчела", gruppe: "bluete" },
        { t: "Schmetterling", ru: "Бабочка", gruppe: "bluete" }] },
      { typ: "wahl", frage: "Wie entwickelt sich ein Schmetterling?", ru: "Как развивается бабочка?", bild: "🦋", optionen: [
        { t: "Ei – Raupe – Puppe – Schmetterling", ru: "Яйцо — гусеница — куколка — бабочка", ok: true, warum: "Richtig! Die Raupe frisst viel, verpuppt sich, und in der Puppe wird sie zum Falter.", warumRu: "Правильно! Гусеница много ест, окукливается, и в куколке превращается в бабочку." },
        { t: "Ei – Schmetterling – Raupe", ru: "Яйцо — бабочка — гусеница", ok: false, warum: "Die Reihenfolge stimmt nicht: Ei, Raupe, Puppe, Schmetterling.", warumRu: "Порядок неверный: яйцо, гусеница, куколка, бабочка." },
        { t: "Raupe – Ei – Puppe", ru: "Гусеница — яйцо — куколка", ok: false, warum: "Zuerst kommt das Ei. Dann Raupe, Puppe, Schmetterling.", warumRu: "Сначала яйцо. Потом гусеница, куколка, бабочка." }] },
      { typ: "zuordnen", frage: "Welche Wiesenpflanze ist das?", ru: "Какое это луговое растение?", gruppen: [
        { id: "loewenzahn", name: "Löwenzahn", ru: "Одуванчик", bild: "🌼" }, { id: "gaensebluemchen", name: "Gänseblümchen", ru: "Маргаритка", bild: "🌸" }, { id: "klee", name: "Klee", ru: "Клевер", bild: "☘️" }], dinge: [
        { t: "Gelbe Blüte, später eine Pusteblume", ru: "Жёлтый цветок, потом пушистый шар", gruppe: "loewenzahn" },
        { t: "Klein, weiße Blütenblätter, gelbe Mitte", ru: "Маленький, белые лепестки, жёлтая серединка", gruppe: "gaensebluemchen" },
        { t: "Drei runde Blättchen an einem Stiel", ru: "Три круглых листочка на стебле", gruppe: "klee" }] },
      { typ: "daumen", satz: "Wenn eine Wiese oft gemäht wird, finden Insekten weniger Blüten.", satzRu: "Если луг часто косят, насекомые находят меньше цветов.", bild: "🐝", ok: true,
        warum: "Stimmt! Darum lassen viele Gemeinden Blühstreifen stehen – das schützt Bienen und Schmetterlinge.", warumRu: "Верно! Поэтому многие общины оставляют цветущие полосы — это защищает пчёл и бабочек." },
      { typ: "daumen", satz: "Geschützte Wildblumen darf man in großen Sträußen pflücken.", satzRu: "Охраняемые дикие цветы можно собирать большими букетами.", bild: "💐", ok: false,
        warum: "Nein! Geschützte Pflanzen bleiben stehen. Fotografiere sie lieber oder zeichne sie.", warumRu: "Нет! Охраняемые растения не рвут. Лучше сфотографируй или нарисуй их." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Prima, {name}! Leg auf einer Wiese einen Reifen hin und zähl, wie viele verschiedene Pflanzen und Tiere du darin findest.",
        ru: "Отлично, {name}! Положи на лугу обруч и посчитай, сколько разных растений и животных внутри." }
    ]
  },
  {
    id: "wasserkreislauf", lb: "un", stufe: 3, lz: ["su.na.07"], name: "Der Kreislauf des Wassers", e: "🔄", farbe: "#1F8FB8", grund: "#E2F4FB",
    kurz: "Gefrieren, schmelzen, verdunsten, kondensieren – und warum die Sonne alles antreibt",
    schritte: [
      { typ: "info", titel: "Wasser verwandelt sich", bild: "🧊💧☁️",
        text: "Wasser gibt es fest (Eis), flüssig (Wasser) und gasförmig (Wasserdampf). Eis schmilzt, Wasser gefriert. Wasser verdunstet langsam oder verdampft beim Kochen. Kühlt Wasserdampf ab, kondensiert er wieder zu Tröpfchen.",
        ru: "Вода бывает твёрдой (лёд), жидкой (вода) и газообразной (пар). Лёд тает, вода замерзает. Вода медленно испаряется или выкипает. Когда пар остывает, он снова конденсируется в капли.",
        fakten: [["schmelzen: Eis → Wasser", "таять: лёд → вода"], ["gefrieren: Wasser → Eis", "замерзать: вода → лёд"], ["verdunsten: Wasser → Dampf", "испаряться: вода → пар"], ["kondensieren: Dampf → Tropfen", "конденсироваться: пар → капли"]] },
      { typ: "zuordnen", frage: "Wie heißt das?", ru: "Как это называется?", gruppen: [
        { id: "verdunsten", name: "Verdunsten", ru: "Испарение", bild: "☀️" }, { id: "kondensieren", name: "Kondensieren", ru: "Конденсация", bild: "🪞" }, { id: "gefrieren", name: "Gefrieren", ru: "Замерзание", bild: "❄️" }], dinge: [
        { t: "Eine Pfütze trocknet in der Sonne", ru: "Лужа высыхает на солнце", gruppe: "verdunsten" },
        { t: "Der Badezimmerspiegel beschlägt", ru: "Зеркало в ванной запотевает", gruppe: "kondensieren" },
        { t: "Der See wird im Winter zu Eis", ru: "Озеро зимой замерзает", gruppe: "gefrieren" }] },
      { typ: "wahl", frage: "Wer treibt den Wasserkreislauf an?", ru: "Что приводит в движение круговорот воды?", bild: "☀️", optionen: [
        { t: "Die Sonne", ru: "Солнце", ok: true, warum: "Richtig! Die Sonne erwärmt Meere, Seen und Böden. Das Wasser verdunstet und steigt nach oben.", warumRu: "Правильно! Солнце нагревает моря, озёра и землю. Вода испаряется и поднимается вверх." },
        { t: "Der Mond", ru: "Луна", ok: false, warum: "Der Mond bewegt Ebbe und Flut. Den Kreislauf treibt die Sonne an.", warumRu: "Луна вызывает приливы. Круговорот движет Солнце." },
        { t: "Die Wolken allein", ru: "Только облака", ok: false, warum: "Wolken entstehen erst, weil die Sonne Wasser verdunsten lässt.", warumRu: "Облака появляются, потому что солнце испаряет воду." }] },
      { typ: "wahl", frage: "Was passiert, wenn feuchte, warme Luft hoch oben abkühlt?", ru: "Что происходит, когда влажный тёплый воздух наверху остывает?", bild: "☁️", optionen: [
        { t: "Es bilden sich Wolken – und dann Regen oder Schnee", ru: "Образуются облака — потом дождь или снег", ok: true, warum: "Genau! Der Dampf kondensiert zu Tröpfchen. Werden sie schwer, fallen sie als Regen. Das Wasser fließt in Bäche, Flüsse und ins Meer – der Kreislauf beginnt von vorn.", warumRu: "Точно! Пар конденсируется в капли. Когда они тяжелеют, выпадают дождём. Вода течёт в ручьи, реки и море — круговорот начинается сначала." },
        { t: "Die Luft wird heißer", ru: "Воздух становится горячее", ok: false, warum: "Nein, sie kühlt ab und der Dampf wird zu Wolkentröpfchen.", warumRu: "Нет, он остывает, и пар превращается в капли облаков." },
        { t: "Nichts", ru: "Ничего", ok: false, warum: "Doch: Es entstehen Wolken.", warumRu: "Нет: образуются облака." }] },
      { typ: "daumen", satz: "Wasserdampf aus dem Kochtopf ist unsichtbar – erst die kleine Wolke darüber kann man sehen.", satzRu: "Пар из кастрюли невидим — видно только облачко над ней.", bild: "♨️", ok: true,
        warum: "Stimmt! Die sichtbare Wolke sind schon wieder winzige Wassertröpfchen. Vorsicht, heißer Dampf verbrüht!", warumRu: "Верно! Видимое облачко — уже снова крошечные капли. Осторожно, горячий пар обжигает!" },
      { typ: "daumen", satz: "Wenn es durch den Klimawandel wärmer wird, verändert sich auch der Wasserkreislauf: Es gibt mehr Trockenheit und mehr Starkregen.", satzRu: "Если из-за изменения климата становится теплее, меняется и круговорот воды: больше засухи и ливней.", bild: "🌡️", ok: true,
        warum: "Richtig! Darum ist es wichtig, Wasser zu schützen und sparsam damit umzugehen.", warumRu: "Правильно! Поэтому важно беречь воду и расходовать её экономно." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Toll, {name}! Mal den Wasserkreislauf als Kreis mit Pfeilen: Meer → Wolke → Regen → Fluss → Meer.",
        ru: "Отлично, {name}! Нарисуй круговорот воды кругом со стрелками: море → облако → дождь → река → море." }
    ]
  },
  {
    id: "karten-lesen", lb: "rz", stufe: 3, lz: ["su.ge.03"], name: "Pläne und Karten lesen", e: "🗺️", farbe: "#2E9C5A", grund: "#E3F5DC",
    kurz: "Grundriss, Legende, Nordpfeil, Nebenhimmelsrichtungen, Karte einnorden",
    schritte: [
      { typ: "info", titel: "Von oben gesehen", bild: "🦅",
        text: "Ein Plan zeigt die Welt von oben, viel kleiner – wie ein Vogel sie sieht. Ein Zimmer von oben heißt Grundriss. Auf jeder Karte zeigt der Nordpfeil nach Norden, und die Legende erklärt die Zeichen.",
        ru: "План показывает мир сверху, намного меньше — как его видит птица. Комната сверху называется планом помещения. На каждой карте стрелка показывает север, а легенда объясняет значки." },
      { typ: "wahl", frage: "Zwischen Norden und Osten liegt …", ru: "Между севером и востоком находится …", bild: "🧭", optionen: [
        { t: "Nordosten", ru: "Северо-восток", ok: true, warum: "Richtig! Dazu gibt es Südosten, Südwesten und Nordwesten. Das sind die Nebenhimmelsrichtungen.", warumRu: "Правильно! Есть ещё юго-восток, юго-запад и северо-запад. Это промежуточные стороны света." },
        { t: "Südwesten", ru: "Юго-запад", ok: false, warum: "Südwesten liegt gegenüber. Zwischen Norden und Osten ist Nordosten.", warumRu: "Юго-запад напротив. Между севером и востоком — северо-восток." },
        { t: "Westen", ru: "Запад", ok: false, warum: "Westen liegt gegenüber vom Osten. Gesucht ist Nordosten.", warumRu: "Запад напротив востока. Ищем северо-восток." }] },
      { typ: "wahl", frage: "Wie nordest du eine Karte ein?", ru: "Как сориентировать карту по сторонам света?", bild: "🧭", optionen: [
        { t: "Kompass auf die Karte legen und drehen, bis Nordpfeil und Kompassnadel in dieselbe Richtung zeigen", ru: "Положить компас на карту и поворачивать, пока стрелка севера и стрелка компаса не совпадут", ok: true, warum: "Genau! Dann liegt alles auf der Karte so wie in der Wirklichkeit.", warumRu: "Точно! Тогда всё на карте расположено как в реальности." },
        { t: "Die Karte umdrehen", ru: "Перевернуть карту", ok: false, warum: "Das reicht nicht. Nordpfeil und Kompassnadel müssen übereinstimmen.", warumRu: "Этого мало. Стрелка севера и стрелка компаса должны совпасть." },
        { t: "Sie in die Sonne halten", ru: "Подержать на солнце", ok: false, warum: "Nein, man nimmt den Kompass zu Hilfe.", warumRu: "Нет, используют компас." }] },
      { typ: "zuordnen", frage: "Was bedeuten die Farben auf einer Landkarte meistens?", ru: "Что обычно означают цвета на карте?", gruppen: [
        { id: "blau", name: "Blau", ru: "Синий", bild: "🟦" }, { id: "gruen", name: "Grün", ru: "Зелёный", bild: "🟩" }, { id: "braun", name: "Braun", ru: "Коричневый", bild: "🟫" }], dinge: [
        { t: "Flüsse und Seen", ru: "Реки и озёра", gruppe: "blau" },
        { t: "Tiefland, flaches Land", ru: "Низменность", gruppe: "gruen" },
        { t: "Gebirge", ru: "Горы", gruppe: "braun" }] },
      { typ: "daumen", satz: "„Pirna liegt südöstlich von Dresden“ heißt: Von Dresden aus muss ich Richtung Südosten fahren.", satzRu: "«Пирна лежит к юго-востоку от Дрездена» значит: из Дрездена нужно ехать на юго-восток.", bild: "🚆", ok: true,
        warum: "Stimmt! So beschreibt man die Lage von Orten: nördlich von …, grenzt im Süden an …", warumRu: "Верно! Так описывают положение мест: к северу от…, на юге граничит с…" },
      { typ: "wahl", frage: "Auf der Karte steht 1 : 100 000. Was bedeutet das?", ru: "На карте написано 1 : 100 000. Что это значит?", bild: "📏", optionen: [
        { t: "1 cm auf der Karte sind 1 km in Wirklichkeit", ru: "1 см на карте — 1 км в реальности", ok: true, warum: "Richtig! 100 000 cm sind 1 km. Das ist der Maßstab.", warumRu: "Правильно! 100 000 см — это 1 км. Это масштаб." },
        { t: "Die Karte ist 100 000 Jahre alt", ru: "Карте 100 000 лет", ok: false, warum: "Nein, das ist der Maßstab: 1 cm entspricht 1 km.", warumRu: "Нет, это масштаб: 1 см соответствует 1 км." },
        { t: "Es wohnen dort 100 000 Menschen", ru: "Там живут 100 000 человек", ok: false, warum: "Nein, das ist der Maßstab.", warumRu: "Нет, это масштаб." }] },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Super, {name}! Zeichne einen Grundriss von deinem Zimmer mit Bett, Tisch und Schrank – und vergiss den Nordpfeil nicht.",
        ru: "Супер, {name}! Нарисуй план своей комнаты с кроватью, столом и шкафом — и не забудь стрелку севера." }
    ]
  },
  {
    id: "landkreis", lb: "rz", stufe: 3, land: "sn", lz: ["su.ge.04", "su.so.05"], name: "Mein Landkreis", e: "🏞️", farbe: "#7B55B8", grund: "#EFE6FF",
    kurz: "Landkreise und kreisfreie Städte in Sachsen, Kreisstadt, Bräuche und Sagen",
    schritte: [
      { typ: "info", titel: "Was ist ein Landkreis?", bild: "🗺️",
        text: "Sachsen ist in 10 Landkreise und 3 kreisfreie Städte eingeteilt: Dresden, Leipzig und Chemnitz. Jeder Landkreis hat eine Kreisstadt – dort sitzt die Kreisverwaltung mit dem Landrat oder der Landrätin.",
        ru: "Саксония разделена на 10 районов и 3 города районного значения: Дрезден, Лейпциг и Хемниц. В каждом районе есть районный центр — там находится администрация с ландратом." },
      { typ: "wahl", frage: "Welche dieser Städte ist kreisfrei – gehört also zu keinem Landkreis?", ru: "Какой из этих городов не входит ни в один район?", bild: "🏙️", optionen: [
        { t: "Chemnitz", ru: "Хемниц", ok: true, warum: "Richtig! Chemnitz, Dresden und Leipzig sind die drei kreisfreien Städte in Sachsen.", warumRu: "Правильно! Хемниц, Дрезден и Лейпциг — три самостоятельных города Саксонии." },
        { t: "Pirna", ru: "Пирна", ok: false, warum: "Pirna ist Kreisstadt im Landkreis Sächsische Schweiz-Osterzgebirge.", warumRu: "Пирна — центр района Саксонская Швейцария — Восточные Рудные горы." },
        { t: "Bautzen", ru: "Баутцен", ok: false, warum: "Bautzen ist die Kreisstadt des Landkreises Bautzen.", warumRu: "Баутцен — центр района Баутцен." }] },
      { typ: "zuordnen", frage: "Was gehört zu einem Landkreis?", ru: "Что относится к району?", gruppen: [
        { id: "landschaft", name: "Landschaft", ru: "Природа", bild: "⛰️" }, { id: "wirtschaft", name: "Wirtschaft", ru: "Экономика", bild: "🏭" }, { id: "kultur", name: "Kultur", ru: "Культура", bild: "🎭" }], dinge: [
        { t: "Berge, Flüsse und Wälder", ru: "Горы, реки и леса", gruppe: "landschaft" },
        { t: "Fabriken und Betriebe", ru: "Фабрики и предприятия", gruppe: "wirtschaft" },
        { t: "Sagen, Bräuche und Denkmale", ru: "Легенды, обычаи и памятники", gruppe: "kultur" }] },
      { typ: "daumen", satz: "Wer eine Frage an den Landrat hat, kann ihm einen höflichen Brief oder eine E-Mail schreiben.", satzRu: "Кто хочет спросить ландрата, может написать ему вежливое письмо или e-mail.", bild: "✉️", ok: true,
        warum: "Stimmt! Viele Kreisverwaltungen freuen sich über Fragen von Schulklassen. Mit „Sehr geehrte …“ und „Mit freundlichen Grüßen“.", warumRu: "Верно! Многие администрации рады вопросам школьников. С «Уважаемый…» и «С уважением»." },
      { typ: "wahl", frage: "Wie findest du heraus, in welchem Landkreis du wohnst?", ru: "Как узнать, в каком районе ты живёшь?", bild: "🔍", optionen: [
        { t: "Auf einer Karte von Sachsen nachsehen oder die Eltern fragen", ru: "Посмотреть на карте Саксонии или спросить родителей", ok: true, warum: "Genau! Oft steht es auch auf dem Autokennzeichen: PIR, BZ, MEI, ERZ …", warumRu: "Точно! Часто это видно и на автомобильном номере: PIR, BZ, MEI, ERZ…" },
        { t: "Gar nicht", ru: "Никак", ok: false, warum: "Doch! Eine Karte oder deine Eltern helfen.", warumRu: "Можно! Помогут карта или родители." },
        { t: "Raten", ru: "Угадать", ok: false, warum: "Besser nachsehen: auf der Karte oder am Autokennzeichen.", warumRu: "Лучше проверить: на карте или по номеру машины." }] },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Toll, {name}! Finde mit deiner Familie heraus: Wie heißt eure Kreisstadt, welcher Fluss fließt durch euren Landkreis, und welche Sage erzählt man sich dort?",
        ru: "Отлично, {name}! Узнай с семьёй: как называется ваш районный центр, какая река течёт через район и какую легенду там рассказывают?" }
    ]
  },
  // ---------- Klasse 4 ----------
  {
    id: "schule-frueher", lb: "zl", stufe: 4, lz: ["su.hi.04", "su.so.06"], name: "Schule früher und anderswo", e: "🖊️", farbe: "#8A6E2F", grund: "#F7F0DD",
    kurz: "Schiefertafel und Griffel, große Klassen, das Recht auf Bildung",
    schritte: [
      { typ: "info", titel: "Schule vor 100 Jahren", bild: "🏫",
        text: "Früher saßen oft 50 Kinder in einer Klasse, in festen Holzbänken. Geschrieben wurde mit dem Griffel auf einer Schiefertafel. Die Lehrer waren meist sehr streng, und viele Kinder mussten nach der Schule auf dem Feld oder in der Fabrik arbeiten.",
        ru: "Раньше в классе часто сидело 50 детей на жёстких деревянных партах. Писали грифелем на сланцевой доске. Учителя были обычно очень строгими, и многие дети после школы работали в поле или на фабрике." },
      { typ: "zuordnen", frage: "Schule früher oder heute?", ru: "Школа раньше или сейчас?", gruppen: [
        { id: "frueher", name: "Früher", ru: "Раньше", bild: "🕰️" }, { id: "heute", name: "Heute", ru: "Сейчас", bild: "💻" }], dinge: [
        { t: "Schiefertafel und Griffel", ru: "Сланцевая доска и грифель", gruppe: "frueher" },
        { t: "Gruppenarbeit und Tablets", ru: "Работа в группах и планшеты", gruppe: "heute" },
        { t: "Kinder mussten still in Reihen sitzen", ru: "Дети тихо сидели рядами", gruppe: "frueher" },
        { t: "Kinder dürfen mitbestimmen, z. B. im Klassenrat", ru: "Дети участвуют в решениях, например в совете класса", gruppe: "heute" }] },
      { typ: "daumen", satz: "Alle Kinder auf der Welt haben das Recht, zur Schule zu gehen.", satzRu: "Все дети мира имеют право ходить в школу.", bild: "📜", ok: true,
        warum: "Stimmt! Das steht in der UN-Kinderrechtskonvention. Trotzdem können viele Millionen Kinder noch nicht zur Schule gehen – oft wegen Armut oder Krieg.", warumRu: "Верно! Это записано в Конвенции ООН о правах ребёнка. И всё же миллионы детей пока не могут ходить в школу — часто из-за бедности или войны." },
      { typ: "wahl", frage: "In manchen Ländern gehen Kinder stundenlang zu Fuß zur Schule. Was zeigt das?", ru: "В некоторых странах дети часами идут пешком в школу. Что это показывает?", bild: "🚶", optionen: [
        { t: "Wie wertvoll Bildung für sie ist", ru: "Как ценно для них образование", ok: true, warum: "Genau! Lernen öffnet Türen für die Zukunft.", warumRu: "Точно! Учёба открывает двери в будущее." },
        { t: "Dass sie gern wandern", ru: "Что они любят ходить в походы", ok: false, warum: "Es gibt dort oft keinen Bus. Trotzdem wollen sie lernen.", warumRu: "Там часто нет автобуса. И всё же они хотят учиться." },
        { t: "Dass Schule unwichtig ist", ru: "Что школа не важна", ok: false, warum: "Im Gegenteil: Sie nehmen den Weg auf sich, weil Schule wichtig ist.", warumRu: "Наоборот: они идут так далеко, потому что школа важна." }] },
      { typ: "daumen", satz: "Die alte Schrift, die Uroma vielleicht noch gelernt hat, heißt Sütterlin.", satzRu: "Старый почерк, которому, может быть, училась прабабушка, называется зюттерлин.", bild: "✒️", ok: true,
        warum: "Richtig! Viele alte Briefe sind in dieser Schrift geschrieben. Vielleicht kann jemand in deiner Familie sie noch lesen.", warumRu: "Правильно! Многие старые письма написаны этим почерком. Может, кто-то в семье ещё умеет его читать." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Super, {name}! Mach ein kleines Interview mit Oma oder Opa: Wie war eure Schule? Was war streng, was war schön?",
        ru: "Супер, {name}! Возьми маленькое интервью у бабушки или дедушки: какой была ваша школа? Что было строгим, что приятным?" }
    ]
  },
  {
    id: "medien-welt", lb: "zl", stufe: 4, lz: ["me.ar.01", "me.ar.02", "me.sa.01"], name: "Medien und ich", e: "📡", farbe: "#C2337A", grund: "#FDEAF3",
    kurz: "Wie Nachrichten entstehen, wer Medien bezahlt, wie Medien Gefühle und Wünsche beeinflussen",
    schritte: [
      { typ: "info", titel: "Woher kommen Nachrichten?", bild: "📰",
        text: "Journalistinnen und Journalisten recherchieren: Sie fragen nach, prüfen Quellen und schreiben dann einen Bericht für Zeitung, Radio, Fernsehen oder Internet. Viele Medien verdienen Geld mit Werbung – darum wollen sie, dass wir lange schauen.",
        ru: "Журналисты собирают сведения: расспрашивают, проверяют источники и пишут репортаж для газеты, радио, ТВ или интернета. Многие медиа зарабатывают на рекламе — поэтому хотят, чтобы мы смотрели подольше." },
      { typ: "wahl", frage: "Ein kostenloses Spiel zeigt ständig Werbung. Warum?", ru: "Бесплатная игра постоянно показывает рекламу. Почему?", bild: "🎮", optionen: [
        { t: "Die Firma verdient so Geld", ru: "Так компания зарабатывает", ok: true, warum: "Richtig! „Kostenlos“ heißt oft: Du bezahlst mit deiner Zeit und deinen Daten.", warumRu: "Правильно! «Бесплатно» часто значит: ты платишь своим временем и данными." },
        { t: "Aus Langeweile", ru: "От скуки", ok: false, warum: "Nein, Werbung bringt der Firma Geld.", warumRu: "Нет, реклама приносит компании деньги." },
        { t: "Weil Werbung Pflicht ist", ru: "Потому что реклама обязательна", ok: false, warum: "Nein, die Firma verdient damit.", warumRu: "Нет, компания на этом зарабатывает." }] },
      { typ: "zuordnen", frage: "Telefon, E-Mail oder Chat – was ist gut, was ist schwierig?", ru: "Телефон, e-mail или чат — что хорошо, что сложно?", gruppen: [
        { id: "vorteil", name: "Vorteil", ru: "Плюс", bild: "👍" }, { id: "nachteil", name: "Nachteil", ru: "Минус", bild: "👎" }], dinge: [
        { t: "Beim Telefonieren hört man die Stimme", ru: "По телефону слышно голос", gruppe: "vorteil" },
        { t: "Eine E-Mail kann man in Ruhe schreiben", ru: "Письмо можно спокойно написать", gruppe: "vorteil" },
        { t: "Im Chat werden Witze leicht falsch verstanden", ru: "В чате шутки легко понять неправильно", gruppe: "nachteil" },
        { t: "Fotos im Chat können weitergeschickt werden", ru: "Фото в чате могут переслать", gruppe: "nachteil" }] },
      { typ: "daumen", satz: "Ein Gruselfilm am Abend kann dazu führen, dass man schlecht schläft.", satzRu: "Фильм ужасов вечером может привести к плохому сну.", bild: "😱", ok: true,
        warum: "Stimmt! Medien wirken auf unsere Gefühle. Achte auf Altersfreigaben und sprich über Dinge, die dir Angst machen.", warumRu: "Верно! Медиа влияют на наши чувства. Обращай внимание на возрастные ограничения и говори о том, что тебя пугает." },
      { typ: "daumen", satz: "Wenn ein Influencer einen Saft trinkt, ist das nie Werbung.", satzRu: "Если блогер пьёт сок, это никогда не реклама.", bild: "🤳", ok: false,
        warum: "Nein! Oft wird er dafür bezahlt. Dann muss „Werbung“ oder „Anzeige“ dabeistehen. Medien beeinflussen, was wir kaufen und essen.", warumRu: "Нет! Часто ему за это платят. Тогда должно быть написано «реклама». Медиа влияют на то, что мы покупаем и едим." },
      { typ: "wahl", frage: "Du hast ein tolles Bild im Internet gefunden und willst es für dein Plakat nutzen. Was ist richtig?", ru: "Ты нашёл в интернете отличную картинку для плаката. Как правильно?", bild: "©️", optionen: [
        { t: "Nur Bilder nutzen, die man nutzen darf, und angeben, woher sie sind", ru: "Брать только разрешённые картинки и указывать источник", ok: true, warum: "Genau! Bilder gehören dem, der sie gemacht hat – das ist das Urheberrecht.", warumRu: "Точно! Картинка принадлежит автору — это авторское право." },
        { t: "Einfach nehmen und als eigenes ausgeben", ru: "Просто взять и выдать за своё", ok: false, warum: "Nein! Das verletzt das Urheberrecht.", warumRu: "Нет! Это нарушает авторское право." },
        { t: "Ein Foto von der Klassenkameradin ohne Fragen nehmen", ru: "Взять фото одноклассницы без спроса", ok: false, warum: "Nein! Fotos von Menschen nur mit deren Erlaubnis – das ist ihr Persönlichkeitsrecht.", warumRu: "Нет! Фото людей — только с их разрешения." }] },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Stark, {name}! Schreib eine Woche lang auf, welche Medien du nutzt und wie lange – das ist dein Medientagebuch.",
        ru: "Сильно, {name}! Неделю записывай, какими медиа пользуешься и сколько времени, — это твой медиадневник." }
    ]
  },
  {
    id: "stadt-frueher", lb: "zl", stufe: 4, lz: ["su.hi.04"], name: "Die Stadt – früher, heute, morgen", e: "🏙️", farbe: "#2F6FB8", grund: "#E5EFFB",
    kurz: "Familienleben, Arbeit und Verkehr in 100 Jahren – und wie wir die Zukunft mitgestalten",
    schritte: [
      { typ: "info", titel: "Vor 100 Jahren in der Stadt", bild: "🚋",
        text: "Vor 100 Jahren heizten die Menschen mit Kohleöfen, wuschen Wäsche auf dem Waschbrett und hatten meist kein Telefon. Viele arbeiteten in Fabriken, oft sehr lange am Tag. Auf den Straßen fuhren Straßenbahnen, Pferdewagen und nur wenige Autos.",
        ru: "100 лет назад люди топили печи углём, стирали на стиральной доске и обычно не имели телефона. Многие работали на фабриках, часто очень долго. По улицам ездили трамваи, повозки и лишь немного машин." },
      { typ: "zuordnen", frage: "Früher oder heute?", ru: "Раньше или сейчас?", gruppen: [
        { id: "frueher", name: "Früher", ru: "Раньше", bild: "🕰️" }, { id: "heute", name: "Heute", ru: "Сейчас", bild: "🏙️" }], dinge: [
        { t: "Kohleofen in jeder Wohnung", ru: "Угольная печь в каждой квартире", gruppe: "frueher" },
        { t: "Waschmaschine", ru: "Стиральная машина", gruppe: "heute" },
        { t: "Kinder spielen auf der fast leeren Straße", ru: "Дети играют на почти пустой улице", gruppe: "frueher" },
        { t: "Viele Autos, Staus und Ampeln", ru: "Много машин, пробки и светофоры", gruppe: "heute" }] },
      { typ: "wahl", frage: "Warum gibt es heute viele Berufe, die es früher nicht gab?", ru: "Почему сейчас много профессий, которых раньше не было?", bild: "💻", optionen: [
        { t: "Durch neue Technik wie Computer entstehen neue Aufgaben", ru: "Новая техника, например компьютеры, создаёт новые задачи", ok: true, warum: "Richtig! Programmiererin oder Windkraft-Techniker gab es vor 100 Jahren nicht. Andere Berufe, wie Kutscher, sind fast verschwunden.", warumRu: "Правильно! Программистов и техников ветряков 100 лет назад не было. Другие профессии, например извозчик, почти исчезли." },
        { t: "Weil die Menschen früher faul waren", ru: "Потому что раньше люди были ленивыми", ok: false, warum: "Nein! Früher arbeiteten viele sehr hart. Die Technik hat sich verändert.", warumRu: "Нет! Раньше многие очень тяжело работали. Изменилась техника." },
        { t: "Zufall", ru: "Случайно", ok: false, warum: "Nein, neue Technik bringt neue Berufe.", warumRu: "Нет, новая техника приносит новые профессии." }] },
      { typ: "daumen", satz: "Früher hatten Familien oft mehr Kinder und mehrere Generationen wohnten zusammen.", satzRu: "Раньше в семьях часто было больше детей и несколько поколений жили вместе.", bild: "👨‍👩‍👧‍👦", ok: true,
        warum: "Stimmt! Heute gibt es viele verschiedene Familienformen – alle sind Familie.", warumRu: "Верно! Сейчас много разных форм семьи — все они семья." },
      { typ: "wahl", frage: "In einer Zukunftswerkstatt überlegt die Klasse: Wie soll unsere Stadt in 20 Jahren sein? Welche Idee hilft Menschen und Umwelt?", ru: "В «мастерской будущего» класс думает: каким должен быть наш город через 20 лет? Какая идея помогает людям и природе?", bild: "🌳", optionen: [
        { t: "Mehr Radwege, Bäume und Spielplätze", ru: "Больше велодорожек, деревьев и площадок", ok: true, warum: "Super Idee! Kinder dürfen mitbestimmen – zum Beispiel im Kinder- und Jugendparlament.", warumRu: "Отличная идея! Дети могут участвовать — например, в детском парламенте." },
        { t: "Alle Parks zu Parkplätzen machen", ru: "Все парки превратить в парковки", ok: false, warum: "Dann fehlt Platz zum Spielen und für die Natur.", warumRu: "Тогда не будет места для игр и природы." },
        { t: "Gar nichts ändern", ru: "Ничего не менять", ok: false, warum: "Städte verändern sich immer. Gut, wenn wir mitdenken!", warumRu: "Города всегда меняются. Хорошо, когда мы участвуем!" }] },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Toll, {name}! Vergleich ein altes Foto deiner Straße oder Stadt mit heute: Was ist geblieben, was ist neu?",
        ru: "Отлично, {name}! Сравни старое фото своей улицы или города с сегодняшним: что осталось, что новое?" }
    ]
  },
  {
    id: "waldtiere", lb: "pt", stufe: 4, lz: ["su.na.08"], name: "Der Wald und seine Säugetiere", e: "🦌", farbe: "#2E9C5A", grund: "#E3F7EF",
    kurz: "Reh, Wildschwein, Fuchs: Nahrung, Spuren, Junge – und warum wir den Wald brauchen",
    schritte: [
      { typ: "info", titel: "Säugetiere im Wald", bild: "🦌",
        text: "Reh, Wildschwein, Fuchs und Eichhörnchen sind Säugetiere: Sie haben ein Fell, atmen mit Lungen und säugen ihre Jungen mit Milch. Manche fressen nur Pflanzen, manche Fleisch, manche alles.",
        ru: "Косуля, кабан, лиса и белка — млекопитающие: у них шерсть, они дышат лёгкими и кормят детёнышей молоком. Одни едят только растения, другие мясо, третьи всё." },
      { typ: "zuordnen", frage: "Wer frisst was?", ru: "Кто что ест?", gruppen: [
        { id: "pflanze", name: "Pflanzenfresser", ru: "Травоядные", bild: "🌿" }, { id: "fleisch", name: "Fleischfresser", ru: "Хищники", bild: "🥩" }, { id: "alles", name: "Allesfresser", ru: "Всеядные", bild: "🍽️" }], dinge: [
        { t: "Reh – Gras, Knospen, Blätter", ru: "Косуля — трава, почки, листья", gruppe: "pflanze" },
        { t: "Luchs – Mäuse, Rehe", ru: "Рысь — мыши, косули", gruppe: "fleisch" },
        { t: "Wildschwein – Eicheln, Würmer, Wurzeln", ru: "Кабан — жёлуди, черви, корни", gruppe: "alles" }] },
      { typ: "wahl", frage: "Im Schnee findest du Abdrücke von zwei schmalen Hufhälften. Wer war das?", ru: "На снегу отпечатки двух узких половинок копыта. Кто это был?", bild: "👣", optionen: [
        { t: "Ein Reh", ru: "Косуля", ok: true, warum: "Richtig! Rehe hinterlassen schmale, herzförmige Trittsiegel. Füchse hinterlassen Pfotenabdrücke mit Krallen.", warumRu: "Правильно! Косули оставляют узкие следы-сердечки. Лисы — следы лап с когтями." },
        { t: "Ein Fuchs", ru: "Лиса", ok: false, warum: "Füchse haben Pfoten mit Ballen und Krallen. Zwei Hufhälften gehören zum Reh.", warumRu: "У лисы лапы с подушечками и когтями. Две половинки копыта — у косули." },
        { t: "Ein Eichhörnchen", ru: "Белка", ok: false, warum: "Eichhörnchen haben kleine Pfoten mit Fingern. Das war ein Reh.", warumRu: "У белки маленькие лапки с пальцами. Это была косуля." }] },
      { typ: "daumen", satz: "Ein zahmes Wildtier oder ein totes Tier im Wald darf man anfassen.", satzRu: "Ручное дикое или мёртвое животное в лесу можно трогать.", bild: "🦊", ok: false,
        warum: "Nein! Wildtiere, die zutraulich wirken, können krank sein – zum Beispiel an Tollwut. Abstand halten und Erwachsenen Bescheid sagen.", warumRu: "Нет! Дикие животные, которые кажутся ручными, могут быть больны, например бешенством. Держись подальше и скажи взрослым." },
      { typ: "zuordnen", frage: "Was gibt uns der Wald – und was schadet ihm?", ru: "Что даёт нам лес — и что ему вредит?", gruppen: [
        { id: "gibt", name: "Der Wald gibt uns", ru: "Лес даёт нам", bild: "🌳" }, { id: "schadet", name: "Das schadet dem Wald", ru: "Это вредит лесу", bild: "⚠️" }], dinge: [
        { t: "Saubere Luft und Holz", ru: "Чистый воздух и древесину", gruppe: "gibt" },
        { t: "Er speichert Wasser und schützt den Boden", ru: "Он хранит воду и защищает почву", gruppe: "gibt" },
        { t: "Lange Trockenheit und Borkenkäfer", ru: "Долгая засуха и короед", gruppe: "schadet" },
        { t: "Zu viel abholzen", ru: "Слишком много вырубать", gruppe: "schadet" }] },
      { typ: "daumen", satz: "Pilze und Beeren aus dem Wald darf man nur essen, wenn ein Erwachsener, der sich auskennt, sie sicher bestimmt hat.", satzRu: "Грибы и ягоды из леса можно есть, только если знающий взрослый точно их определил.", bild: "🍄", ok: true,
        warum: "Stimmt! Manche Pilze und Beeren sind sehr giftig und sehen essbaren ähnlich.", warumRu: "Верно! Некоторые грибы и ягоды очень ядовиты и похожи на съедобные." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Super, {name}! Geh mit deiner Familie in den Wald und sucht Spuren: Trittsiegel, angeknabberte Zapfen, Wühlstellen von Wildschweinen.",
        ru: "Супер, {name}! Сходите с семьёй в лес и поищите следы: отпечатки копыт, обгрызенные шишки, места, где рылись кабаны." }
    ]
  },
  {
    id: "boden", lb: "pt", stufe: 4, lz: ["su.na.08"], name: "Der Boden lebt", e: "🪱", farbe: "#8A6E2F", grund: "#F7F0DD",
    kurz: "Humus, Kompost, kleine Bodentiere, Grundwasser und wie man Boden pflegt",
    schritte: [
      { typ: "info", titel: "Was ist im Boden?", bild: "🟫",
        text: "Boden besteht aus Sand, Lehm, Steinchen, Wasser, Luft – und Humus. Humus ist die dunkle Erde, die aus verrotteten Blättern und Pflanzen entsteht. Darin leben unzählige kleine Tiere: In einer Handvoll Boden mehr Lebewesen als Menschen auf der Erde!",
        ru: "Почва состоит из песка, глины, камешков, воды, воздуха — и перегноя. Перегной — тёмная земля из перегнивших листьев и растений. В ней живёт бесчисленное множество маленьких животных: в горсти земли больше живых существ, чем людей на Земле!" },
      { typ: "wahl", frage: "Wer macht aus alten Blättern neue Erde?", ru: "Кто превращает старые листья в новую землю?", bild: "🍂", optionen: [
        { t: "Regenwürmer, Asseln und winzige Lebewesen", ru: "Черви, мокрицы и крошечные существа", ok: true, warum: "Richtig! Sie fressen und zersetzen die Blätter. So entsteht Humus.", warumRu: "Правильно! Они едят и разлагают листья. Так образуется перегной." },
        { t: "Die Sonne allein", ru: "Только солнце", ok: false, warum: "Die Arbeit machen Bodentiere wie Regenwürmer und Asseln.", warumRu: "Работу делают почвенные животные — черви и мокрицы." },
        { t: "Der Wind", ru: "Ветер", ok: false, warum: "Nein, das schaffen die Bodentiere.", warumRu: "Нет, это делают почвенные животные." }] },
      { typ: "zuordnen", frage: "Was darf auf den Kompost?", ru: "Что можно класть в компост?", gruppen: [
        { id: "ja", name: "Auf den Kompost", ru: "В компост", bild: "♻️" }, { id: "nein", name: "Nicht auf den Kompost", ru: "Не в компост", bild: "🚫" }], dinge: [
        { t: "Apfelreste und Kartoffelschalen", ru: "Огрызки и картофельные очистки", gruppe: "ja" },
        { t: "Laub und Rasenschnitt", ru: "Листья и скошенная трава", gruppe: "ja" },
        { t: "Plastiktüte", ru: "Пластиковый пакет", gruppe: "nein" },
        { t: "Batterie", ru: "Батарейка", gruppe: "nein" }] },
      { typ: "wahl", frage: "Du gießt Wasser auf Sand und auf Lehm. Wo läuft es schneller durch?", ru: "Ты льёшь воду на песок и на глину. Где она протекает быстрее?", bild: "🧪", optionen: [
        { t: "Durch den Sand", ru: "Через песок", ok: true, warum: "Genau! Sand hat große Lücken. Lehm hält das Wasser länger fest.", warumRu: "Точно! В песке большие промежутки. Глина дольше удерживает воду." },
        { t: "Durch den Lehm", ru: "Через глину", ok: false, warum: "Lehm hält Wasser fest. Durch Sand läuft es schneller.", warumRu: "Глина удерживает воду. Через песок быстрее." },
        { t: "Gleich schnell", ru: "Одинаково", ok: false, warum: "Nein: Sand lässt Wasser schneller durch.", warumRu: "Нет: песок пропускает воду быстрее." }] },
      { typ: "daumen", satz: "Der Boden filtert Regenwasser, bevor es zum Grundwasser wird – daraus kommt oft unser Trinkwasser.", satzRu: "Почва фильтрует дождевую воду, прежде чем она станет грунтовой, — из неё часто наше питьё.", bild: "💧", ok: true,
        warum: "Stimmt! Darum dürfen Öl, Farbe oder Gift nie in den Boden gelangen.", warumRu: "Верно! Поэтому масло, краска или яд никогда не должны попадать в почву." },
      { typ: "daumen", satz: "Mulchen heißt: Den Boden mit Rasenschnitt oder Laub bedecken, damit er feucht bleibt.", satzRu: "Мульчирование — укрывать почву скошенной травой или листьями, чтобы она оставалась влажной.", bild: "🌱", ok: true,
        warum: "Richtig! Auch Lockern und Kompost machen den Boden besser.", warumRu: "Правильно! Рыхление и компост тоже улучшают почву." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Toll, {name}! Heb einen Stein im Garten an und schau, wer darunter wohnt – danach den Stein vorsichtig zurücklegen.",
        ru: "Отлично, {name}! Подними камень в саду и посмотри, кто под ним живёт, — потом осторожно положи камень обратно." }
    ]
  },
  {
    id: "sachsen-entdecken", lb: "rz", stufe: 4, land: "sn", lz: ["su.ge.04", "su.hi.sn01"], name: "Sachsen entdecken", e: "🏰", farbe: "#C2337A", grund: "#FDEAF3",
    kurz: "Erzgebirge, Vogtland, Oberlausitz, Dresden mit Landtag und Frauenkirche, sorbische Bräuche",
    schritte: [
      { typ: "info", titel: "Ein Land mit vielen Gesichtern", bild: "⛰️",
        text: "In Sachsen leben etwa 4 Millionen Menschen. Im Süden liegen das Erzgebirge und das Vogtland, im Osten die Oberlausitz und die Sächsische Schweiz, im Norden flaches Land. Der höchste Berg ist der Fichtelberg mit 1215 Metern.",
        ru: "В Саксонии живёт около 4 миллионов человек. На юге — Рудные горы и Фогтланд, на востоке — Верхняя Лужица и Саксонская Швейцария, на севере — равнина. Самая высокая гора — Фихтельберг, 1215 метров." },
      { typ: "zuordnen", frage: "Was passt zu welcher Region?", ru: "Что к какому региону?", gruppen: [
        { id: "erz", name: "Erzgebirge", ru: "Рудные горы", bild: "⛏️" }, { id: "lausitz", name: "Oberlausitz", ru: "Верхняя Лужица", bild: "🥚" }, { id: "schweiz", name: "Sächsische Schweiz", ru: "Саксонская Швейцария", bild: "🧗" }], dinge: [
        { t: "Bergbau, Schwibbogen und Nussknacker", ru: "Горное дело, швиббоген и щелкунчик", gruppe: "erz" },
        { t: "Sorbische Ostereier und zweisprachige Schilder", ru: "Сорбские яйца и двуязычные указатели", gruppe: "lausitz" },
        { t: "Bizarre Sandsteinfelsen an der Elbe", ru: "Причудливые песчаниковые скалы у Эльбы", gruppe: "schweiz" }] },
      { typ: "wahl", frage: "Wo treffen sich die Abgeordneten, die Gesetze für Sachsen beschließen?", ru: "Где собираются депутаты, принимающие законы Саксонии?", bild: "🏛️", optionen: [
        { t: "Im Landtag in Dresden", ru: "В ландтаге в Дрездене", ok: true, warum: "Richtig! Dresden ist die Landeshauptstadt. Dort sitzen Landtag und Landesregierung.", warumRu: "Правильно! Дрезден — столица земли. Там находятся ландтаг и правительство." },
        { t: "Im Rathaus von Leipzig", ru: "В ратуше Лейпцига", ok: false, warum: "Leipzig ist die größte Stadt, aber der Landtag ist in Dresden.", warumRu: "Лейпциг — самый большой город, но ландтаг в Дрездене." },
        { t: "Auf dem Fichtelberg", ru: "На Фихтельберге", ok: false, warum: "Nein, im Landtag in Dresden.", warumRu: "Нет, в ландтаге в Дрездене." }] },
      { typ: "daumen", satz: "Die Frauenkirche in Dresden wurde im Krieg zerstört und mit Spenden aus aller Welt wieder aufgebaut.", satzRu: "Фрауэнкирхе в Дрездене была разрушена в войну и восстановлена на пожертвования со всего мира.", bild: "⛪", ok: true,
        warum: "Stimmt! Sie wurde 2005 wieder eingeweiht. Auch der Zwinger und die Semperoper gehören zu Dresdens bekannten Bauwerken.", warumRu: "Верно! Её снова освятили в 2005 году. Цвингер и Земперопер тоже знаменитые здания Дрездена." },
      { typ: "wahl", frage: "Welcher Brauch gehört zu den Sorben?", ru: "Какой обычай относится к сорбам?", bild: "🐦", optionen: [
        { t: "Die Vogelhochzeit am 25. Januar", ru: "Птичья свадьба 25 января", ok: true, warum: "Genau! Kinder stellen einen Teller raus und finden am Morgen Gebäck in Vogelform. Auch das Osterreiten und kunstvoll verzierte Ostereier sind sorbische Bräuche.", warumRu: "Точно! Дети выставляют тарелку и утром находят выпечку в форме птиц. Пасхальные всадники и расписные яйца — тоже сорбские обычаи." },
        { t: "Der Karneval in Rio", ru: "Карнавал в Рио", ok: false, warum: "Der ist in Brasilien. Die Sorben feiern zum Beispiel die Vogelhochzeit.", warumRu: "Он в Бразилии. Сорбы празднуют, например, птичью свадьбу." },
        { t: "Halloween", ru: "Хэллоуин", ok: false, warum: "Halloween kommt aus Irland und Amerika. Sorbisch ist die Vogelhochzeit.", warumRu: "Хэллоуин из Ирландии и Америки. Сорбский — птичья свадьба." }] },
      { typ: "daumen", satz: "In Sachsen spricht man je nach Gegend ein bisschen anders – zum Beispiel Erzgebirgisch oder Vogtländisch.", satzRu: "В Саксонии в разных местах говорят немного по-разному — например, по-рудногорски или по-фогтландски.", bild: "🗣️", ok: true,
        warum: "Richtig! Dialekte gehören zur Heimat. Und in der Lausitz hörst du auch Sorbisch.", warumRu: "Правильно! Диалекты — часть родины. А в Лужице можно услышать и сорбский." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Wunderbar, {name}! Such dir eine Sehenswürdigkeit in Sachsen aus und halte einen kleinen Vortrag darüber – mit Bild und drei Stichwörtern.",
        ru: "Чудесно, {name}! Выбери достопримечательность Саксонии и сделай о ней маленький доклад — с картинкой и тремя ключевыми словами." }
    ]
  },
  {
    id: "radfahrpruefung", lb: "rz", stufe: 4, lz: ["su.ge.02", "su.te.03"], name: "Fit für die Radfahrprüfung", e: "🚴", farbe: "#E0574A", grund: "#FFECE8",
    kurz: "Rechts vor links, Linksabbiegen in Schritten, Überholen, Verkehrszeichen",
    schritte: [
      { typ: "info", titel: "Die Radfahrprüfung", bild: "🚴",
        text: "In Klasse 4 lernst du, sicher auf der Straße Rad zu fahren. Wichtig sind die Vorfahrtsregeln, das Linksabbiegen und die Verkehrszeichen. Am Ende gibt es eine Prüfung – oft mit der Polizei.",
        ru: "В 4 классе учатся безопасно ездить на велосипеде по дороге. Важны правила приоритета, левый поворот и дорожные знаки. В конце — экзамен, часто с полицией." },
      { typ: "wahl", frage: "An einer Kreuzung ohne Schilder und Ampel: Wer darf zuerst fahren?", ru: "На перекрёстке без знаков и светофора: кто едет первым?", bild: "✖️", optionen: [
        { t: "Wer von rechts kommt", ru: "Тот, кто справа", ok: true, warum: "Richtig! „Rechts vor links“ – du lässt Fahrzeuge von rechts zuerst fahren.", warumRu: "Правильно! «Правый первый» — пропускаешь тех, кто справа." },
        { t: "Wer am schnellsten ist", ru: "Кто быстрее", ok: false, warum: "Nein! Es gilt rechts vor links.", warumRu: "Нет! Действует правило «правый первый»." },
        { t: "Immer die Radfahrer", ru: "Всегда велосипедисты", ok: false, warum: "Nein, auch für Radfahrer gilt rechts vor links.", warumRu: "Нет, и для велосипедистов действует «правый первый»." }] },
      { typ: "zuordnen", frage: "Was bedeutet das Verkehrszeichen?", ru: "Что означает дорожный знак?", gruppen: [
        { id: "warten", name: "Ich muss warten", ru: "Я должен уступить", bild: "🔻" }, { id: "vorfahrt", name: "Ich habe Vorfahrt", ru: "У меня приоритет", bild: "🔶" }], dinge: [
        { t: "Rot-weißes Dreieck, Spitze nach unten", ru: "Красно-белый треугольник вершиной вниз", gruppe: "warten" },
        { t: "Rotes Achteck mit STOP", ru: "Красный восьмиугольник STOP", gruppe: "warten" },
        { t: "Gelbe Raute mit weißem Rand", ru: "Жёлтый ромб с белой каймой", gruppe: "vorfahrt" }] },
      { typ: "wahl", frage: "Du willst links abbiegen. Was kommt zuerst?", ru: "Ты хочешь повернуть налево. Что сначала?", bild: "↩️", optionen: [
        { t: "Umschauen nach hinten", ru: "Оглянуться назад", ok: true, warum: "Genau! Dann: Handzeichen links, zur Mitte einordnen, Gegenverkehr vorlassen, nochmal umschauen und abbiegen.", warumRu: "Точно! Потом: знак рукой налево, перестроиться к середине, пропустить встречных, ещё раз оглянуться и повернуть." },
        { t: "Sofort abbiegen", ru: "Сразу повернуть", ok: false, warum: "Viel zu gefährlich! Erst umschauen und Handzeichen geben.", warumRu: "Слишком опасно! Сначала оглянись и подай знак." },
        { t: "Klingeln und losfahren", ru: "Позвонить и ехать", ok: false, warum: "Nein. Erst umschauen, Zeichen geben, einordnen.", warumRu: "Нет. Сначала оглянуться, подать знак, перестроиться." }] },
      { typ: "daumen", satz: "Ein parkendes Auto überholt man links mit genug Abstand – erst nach dem Umschauen.", satzRu: "Припаркованную машину объезжают слева с достаточным расстоянием — только оглянувшись.", bild: "🚗", ok: true,
        warum: "Stimmt! Achte auch darauf, dass sich keine Autotür öffnet.", warumRu: "Верно! Следи и за тем, чтобы не открылась дверь машины." },
      { typ: "daumen", satz: "Mit dem Handy in der Hand Rad zu fahren ist in Ordnung, wenn man langsam fährt.", satzRu: "Ехать на велосипеде с телефоном в руке можно, если ехать медленно.", bild: "📱", ok: false,
        warum: "Nein! Beim Radfahren braucht man beide Augen und Hände für den Verkehr. Handy ist verboten.", warumRu: "Нет! На велосипеде нужны оба глаза и руки для дороги. Телефон запрещён." },
      { typ: "info", titel: "Geschafft!", bild: "🦉",
        text: "Super, {name}! Üb mit einem Erwachsenen auf einem ruhigen Platz: einhändig fahren für das Handzeichen, umschauen ohne zu wackeln, sicher bremsen.",
        ru: "Супер, {name}! Потренируйся со взрослым на тихой площадке: ехать одной рукой для знака, оглядываться не виляя, уверенно тормозить." }
    ]
  }
);
