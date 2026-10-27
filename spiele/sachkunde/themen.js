// Sachkunde-Themen mit Eule Ella.
// Schritt-Typen:
//   info     { titel, bild?, text, ru, fakten?: [[de, ru], ...] }
//   wahl     { frage, ru, bild?, optionen: [{ t, ru, ok, warum, warumRu }] }
//   daumen   { satz, satzRu, bild?, ok, warum, warumRu }
//   zuordnen { frage, ru, gruppen: [{ id, name, ru, bild }], dinge: [{ t, ru, gruppe }] }
//   baum     { frage, ru, ziel, warum, warumRu }  (auf die richtige Person im Stammbaum tippen)
// baum: [ids] statt bild zeigt den Stammbaum des Themas mit diesen Personen hervorgehoben.
// bild: Name einer Zeichnung aus bilder.js oder ein Emoji.
window.THEMEN = [
  {
    id: "geschenkebringer", lz: ["su.so.04"], name: "Wer bringt die Geschenke?", e: "🎅", farbe: "#D7263D", grund: "#FFEDEF",
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
    id: "familie", lz: ["su.so.02"], name: "Meine Familie", e: "👨‍👩‍👧‍👦", farbe: "#7B55B8", grund: "#F1EAFF",
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
    id: "gesundheit", lz: ["su.na.02"], name: "Gesund und munter", e: "🦷", farbe: "#2E9C5A", grund: "#E3F7EF",
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
    id: "baeume-voegel", lz: ["su.na.03"], name: "Bäume und Vögel", e: "🌳", farbe: "#8A6E2F", grund: "#F7F0DD",
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
    id: "schulweg", lz: ["su.ge.02"], name: "Mein Schulweg", e: "🚦", farbe: "#D7263D", grund: "#FFEDEF",
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
    id: "wasser", lz: ["su.na.01", "su.na.07"], name: "Wasser", e: "💧", farbe: "#3AA0E0", grund: "#E1F3FF",
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
    id: "frueher", lz: ["su.hi.03", "su.hi.02"], name: "Früher und heute", e: "🕰️", farbe: "#8A6E2F", grund: "#F7F0DD",
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
    id: "regeln", lz: ["su.so.03", "et.mi.01"], name: "Regeln und Streit", e: "🤝", farbe: "#7B55B8", grund: "#EFE6FF",
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
    id: "bauen", lz: ["su.te.01", "su.te.02"], name: "Bauen und Brücken", e: "🌉", farbe: "#E8A33D", grund: "#FFF1D9",
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
    id: "pflanzen", lz: ["su.na.05"], name: "Pflanzen wachsen", e: "🌷", farbe: "#2E9C5A", grund: "#E3F7EF",
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
    id: "sinne", lz: ["su.na.02"], name: "Meine fünf Sinne", e: "👀", farbe: "#C2337A", grund: "#FDEAF3",
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
    id: "wald", lz: ["su.na.08"], name: "Lebensraum Wald und Wiese", e: "🌲", farbe: "#2E7D4F", grund: "#E3F3E8",
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
    id: "kompass", lz: ["su.ge.03"], name: "Himmelsrichtungen", e: "🧭", farbe: "#2F6FB8", grund: "#E5EFFB",
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
    id: "schwimmen", lz: ["su.na.07"], name: "Schwimmen und Sinken", e: "⛵", farbe: "#1F8FB8", grund: "#E2F4FB",
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
    id: "feuer", lz: ["su.na.09"], name: "Feuer und Brandschutz", e: "🔥", farbe: "#D2502A", grund: "#FDECE4",
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
    id: "fahrrad", lz: ["su.te.03", "su.ge.02"], name: "Mein Fahrrad", e: "🚲", farbe: "#2F86C8", grund: "#E5F1FB",
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
    id: "kinderrechte", lz: ["su.so.06"], name: "Kinderrechte und Geld", e: "🧒", farbe: "#7B55B8", grund: "#F1EAFF",
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
    id: "gemeinde", lz: ["su.so.05"], name: "Unsere Gemeinde", e: "🏛️", farbe: "#8A6E2F", grund: "#F7F0DD",
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
  }
];
