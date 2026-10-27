// Tablet-Führerschein: Lektionen mit Robo Pixel.
// Schritt-Typen:
//   sag      { text, ru, e? }                                  Pixel erklärt
//   wahl     { frage, ru, e?, optionen:[{t, ru, ok, warum, warumRu}] }
//   daumen   { satz, satzRu, e?, ok, warum, warumRu }          stimmt das? 👍 / 👎
//   sortieren{ frage, ru, links, linksRu, rechts, rechtsRu, dinge:[{t, ru, e, seite:"links"|"rechts"}] }
//   tippen | ziehen | wischen | halten | zoomen  { text, ru }   (Übungen)
//   popup    { text, ru }                                      Werbefenster schließen
//   chat     { von, nachricht, nachrichtRu, frage, ru, optionen:[{t, ru, ok, warum, warumRu}] }
// {name} wird durch den Spielernamen ersetzt. ru = Russisch-Hilfe.
window.LEKTIONEN = [
  {
    id: "bedienung", lz: ["me.ph.01"], name: "Das Tablet bedienen", e: "👆", farbe: "#3AA0E0", grund: "#E1F3FF",
    schritte: [
      { typ: "sag", text: "Hallo {name}! Ich bin Pixel. Ich zeige dir, wie du ein Tablet-Profi wirst. Am Ende bekommst du einen Tablet-Führerschein!",
        ru: "Привет, {name}! Я Пиксель. Я покажу тебе, как стать мастером планшета. В конце ты получишь права на планшет!" },
      { typ: "sag", e: "👆", text: "Das Tablet merkt, wenn du den Bildschirm berührst. Ein kurzes Antippen heißt Tippen.",
        ru: "Планшет чувствует, когда ты касаешься экрана. Короткое касание называется «нажать»." },
      { typ: "tippen", text: "Tippe auf den Stern. Er hüpft dreimal woanders hin!", ru: "Нажми на звёздочку. Она три раза перепрыгнет на другое место!" },
      { typ: "sag", e: "👉", text: "Mit dem Finger kannst du auch wischen. So blätterst du zum Beispiel durch Fotos.",
        ru: "Пальцем можно ещё и проводить по экрану. Так, например, листают фотографии." },
      { typ: "wischen", text: "Wische nach links, um alle Bilder anzuschauen.", ru: "Проведи пальцем влево, чтобы посмотреть все картинки." },
      { typ: "ziehen", text: "Lege den Finger auf den Apfel und ziehe ihn in den Korb.", ru: "Положи палец на яблоко и перетащи его в корзину." },
      { typ: "halten", text: "Manchmal muss man lange drücken. Halte den Knopf gedrückt, bis der Kreis voll ist.", ru: "Иногда нужно долго нажимать. Держи кнопку, пока круг не заполнится." },
      { typ: "zoomen", text: "Mit zwei Fingern kannst du etwas größer machen. Lege zwei Finger auf das Bild und ziehe sie auseinander.",
        ru: "Двумя пальцами можно сделать картинку больше. Положи два пальца на картинку и раздвинь их." },
      { typ: "wahl", e: "🔊", frage: "Das Spiel ist zu laut. Was machst du?", ru: "Игра слишком громкая. Что ты сделаешь?", optionen: [
        { t: "Die Leiser-Taste am Rand drücken", ru: "Нажать кнопку «тише» сбоку", ok: true,
          warum: "Genau! Am Rand vom Tablet sind die Tasten für laut und leise.", warumRu: "Правильно! Сбоку на планшете есть кнопки громче и тише." },
        { t: "Ganz fest auf den Bildschirm drücken", ru: "Сильно нажать на экран", ok: false,
          warum: "Das hilft nicht. Für die Lautstärke gibt es Tasten am Rand.", warumRu: "Это не поможет. Для громкости есть кнопки сбоку." },
        { t: "Das Tablet schütteln", ru: "Потрясти планшет", ok: false,
          warum: "Bitte nicht schütteln! Nimm die Leiser-Taste am Rand.", warumRu: "Пожалуйста, не тряси! Нажми кнопку «тише» сбоку." }] },
      { typ: "wahl", e: "🔋", frage: "Der Akku ist fast leer. Was machst du?", ru: "Батарея почти разряжена. Что ты сделаешь?", optionen: [
        { t: "Mit einem Erwachsenen das Ladekabel anschließen", ru: "Вместе со взрослым подключить зарядку", ok: true,
          warum: "Richtig! Das Tablet braucht Strom zum Laden.", warumRu: "Правильно! Планшету нужно электричество, чтобы зарядиться." },
        { t: "Einfach weiterspielen, bis es ausgeht", ru: "Просто играть дальше, пока он не выключится", ok: false,
          warum: "Dann geht es plötzlich aus. Besser rechtzeitig laden.", warumRu: "Тогда он вдруг выключится. Лучше зарядить вовремя." },
        { t: "Das Tablet in die Sonne legen", ru: "Положить планшет на солнце", ok: false,
          warum: "Sonne lädt kein Tablet auf. Es wird nur zu heiß.", warumRu: "Солнце не заряжает планшет. Он только перегреется." }] },
      { typ: "sag", text: "Super! Du kannst jetzt tippen, wischen, ziehen, lange drücken und zoomen.",
        ru: "Супер! Теперь ты умеешь нажимать, листать, перетаскивать, долго нажимать и увеличивать." }
    ]
  },
  {
    id: "pflege", lz: ["me.sa.02"], name: "Tablet und ich", e: "💤", farbe: "#5CCBA6", grund: "#DDF5EC",
    schritte: [
      { typ: "sag", e: "📱", text: "Ein Tablet ist empfindlich. Wenn du gut darauf aufpasst, hält es lange.",
        ru: "Планшет — хрупкая вещь. Если ты его бережёшь, он прослужит долго." },
      { typ: "daumen", e: "🧃", satz: "Ich stelle meinen Saft direkt neben das Tablet.", satzRu: "Я ставлю свой сок прямо рядом с планшетом.", ok: false,
        warum: "Lieber nicht! Wenn der Saft umkippt, kann das Tablet kaputtgehen.", warumRu: "Лучше не надо! Если сок прольётся, планшет может сломаться." },
      { typ: "daumen", e: "🙌", satz: "Ich halte das Tablet mit beiden Händen fest, wenn ich es trage.", satzRu: "Когда я несу планшет, я крепко держу его двумя руками.", ok: true,
        warum: "Genau so! Dann fällt es nicht herunter.", warumRu: "Именно так! Тогда он не упадёт." },
      { typ: "daumen", e: "☀️", satz: "Ich lasse das Tablet im Sommer im heißen Auto liegen.", satzRu: "Летом я оставляю планшет в горячей машине.", ok: false,
        warum: "Zu viel Hitze schadet dem Tablet. Nimm es lieber mit.", warumRu: "Жара вредит планшету. Лучше возьми его с собой." },
      { typ: "sag", e: "⏰", text: "Auch du brauchst Pausen. Wenn du lange auf den Bildschirm schaust, werden die Augen müde.",
        ru: "Тебе тоже нужны перерывы. Если долго смотреть на экран, глаза устают." },
      { typ: "wahl", e: "👀", frage: "Deine Augen sind müde. Was hilft?", ru: "Твои глаза устали. Что поможет?", optionen: [
        { t: "Eine Pause machen und aus dem Fenster schauen", ru: "Сделать перерыв и посмотреть в окно", ok: true,
          warum: "Richtig! Weit weg schauen entspannt die Augen. Bewegung tut auch gut.", warumRu: "Правильно! Смотреть вдаль полезно для глаз. Движение тоже помогает." },
        { t: "Noch näher an den Bildschirm gehen", ru: "Подойти ещё ближе к экрану", ok: false,
          warum: "Das macht die Augen noch müder. Halte lieber Abstand und mach Pause.", warumRu: "От этого глаза устанут ещё больше. Лучше держи расстояние и отдохни." },
        { t: "Den Bildschirm ganz hell stellen", ru: "Сделать экран очень ярким", ok: false,
          warum: "Das strengt die Augen eher an. Eine Pause hilft am besten.", warumRu: "Это скорее напрягает глаза. Лучше всего помогает перерыв." }] },
      { typ: "daumen", e: "🛏️", satz: "Ich spiele im Bett noch ganz lange, bevor ich schlafe.", satzRu: "Перед сном я ещё долго играю в кровати.", ok: false,
        warum: "Das helle Licht macht wach. Vor dem Schlafen ist Tablet-Pause.", warumRu: "Яркий свет мешает уснуть. Перед сном планшет отдыхает." },
      { typ: "daumen", e: "⚽", satz: "Nach dem Spielen gehe ich raus oder spiele etwas ohne Tablet.", satzRu: "После игры я иду на улицу или играю во что-нибудь без планшета.", ok: true,
        warum: "Super! Draußen spielen und Freunde treffen ist genauso wichtig.", warumRu: "Супер! Играть на улице и встречаться с друзьями тоже очень важно." },
      { typ: "sag", text: "Toll! Du passt auf dein Tablet auf und auf dich selbst.", ru: "Здорово! Ты бережёшь свой планшет и себя." }
    ]
  },
  {
    id: "daten", lz: ["me.sa.01"], name: "Meine Daten sind geheim", e: "🔒", farbe: "#7B55B8", grund: "#EFE6FF",
    schritte: [
      { typ: "sag", e: "🔒", text: "Manche Sachen über dich sind geheim. Die verrätst du im Internet niemandem, den du nicht kennst.",
        ru: "Некоторые вещи о тебе — секрет. В интернете ты не рассказываешь их никому, кого не знаешь." },
      { typ: "sag", e: "🏠", text: "Geheim sind zum Beispiel: wo du wohnst, deine Telefonnummer, deine Schule, deine Passwörter und Fotos von dir.",
        ru: "Секрет — это, например: где ты живёшь, твой номер телефона, твоя школа, твои пароли и твои фотографии." },
      { typ: "sortieren", frage: "Darfst du das in einem Spiel verraten?", ru: "Можно ли рассказать это в игре?",
        links: "Darf ich sagen 👍", linksRu: "Можно сказать", rechts: "Bleibt geheim 🔒", rechtsRu: "Это секрет", dinge: [
        { t: "Meine Lieblingsfarbe", ru: "Мой любимый цвет", e: "🎨", seite: "links" },
        { t: "Meine Adresse", ru: "Мой адрес", e: "🏠", seite: "rechts" },
        { t: "Mein Passwort", ru: "Мой пароль", e: "🔑", seite: "rechts" },
        { t: "Mein Lieblingstier", ru: "Моё любимое животное", e: "🐶", seite: "links" },
        { t: "Meine Telefonnummer", ru: "Мой номер телефона", e: "📞", seite: "rechts" },
        { t: "Der Name meiner Schule", ru: "Название моей школы", e: "🏫", seite: "rechts" },
        { t: "Ein Foto von mir", ru: "Моя фотография", e: "🤳", seite: "rechts" },
        { t: "Mein Spitzname im Spiel", ru: "Мой ник в игре", e: "🎮", seite: "links" }] },
      { typ: "sag", e: "🔑", text: "Ein gutes Passwort ist lang und schwer zu raten. Du verrätst es niemandem, außer deinen Eltern.",
        ru: "Хороший пароль — длинный, и его трудно угадать. Ты никому его не говоришь, кроме родителей." },
      { typ: "wahl", e: "🔑", frage: "Welches Passwort ist am sichersten?", ru: "Какой пароль самый надёжный?", optionen: [
        { t: "Blaue-Katze-tanzt-7-mal!", ru: "Blaue-Katze-tanzt-7-mal! (Синяя-кошка-танцует-7-раз!)", ok: true,
          warum: "Richtig! Lang, mit Zahl und Zeichen und trotzdem gut zu merken.", warumRu: "Правильно! Длинный, с цифрой и знаком, и всё равно легко запомнить." },
        { t: "1234", ru: "1234", ok: false, warum: "Das ist viel zu leicht zu raten.", warumRu: "Его слишком легко угадать." },
        { t: "{name}", ru: "{name}", ok: false, warum: "Deinen Namen kann jeder raten.", warumRu: "Твоё имя может угадать каждый." }] },
      { typ: "wahl", e: "👧", frage: "Deine Freundin fragt nach deinem Passwort. Was sagst du?", ru: "Подружка спрашивает твой пароль. Что ты скажешь?", optionen: [
        { t: "Das ist geheim. Das wissen nur ich und meine Eltern.", ru: "Это секрет. Его знаем только я и мои родители.", ok: true,
          warum: "Genau! Auch gute Freunde brauchen dein Passwort nicht.", warumRu: "Именно! Даже хорошим друзьям не нужен твой пароль." },
        { t: "Klar, hier ist es!", ru: "Конечно, вот он!", ok: false,
          warum: "Lieber nicht. Ein Passwort bleibt geheim, auch bei Freunden.", warumRu: "Лучше не надо. Пароль остаётся секретом, даже для друзей." }] },
      { typ: "sag", text: "Prima! Deine Geheimnisse sind bei dir gut aufgehoben.", ru: "Отлично! Твои секреты в надёжных руках." }
    ]
  },
  {
    id: "fremde", lz: ["me.sa.01", "me.kk.01"], name: "Fremde im Internet", e: "💬", farbe: "#FF6F61", grund: "#FFE9E2",
    schritte: [
      { typ: "sag", e: "🎭", text: "Im Internet sieht man nicht, wer wirklich schreibt. Jemand sagt vielleicht, er ist ein Kind, ist aber ein Erwachsener.",
        ru: "В интернете не видно, кто на самом деле пишет. Кто-то может сказать, что он ребёнок, а на самом деле это взрослый." },
      { typ: "chat", von: "Lena_2017", nachricht: "Hi! Ich bin auch 8 😊 Schick mir mal ein Foto von dir!", nachrichtRu: "Привет! Мне тоже 8 😊 Пришли мне свою фотографию!",
        frage: "Was machst du?", ru: "Что ты сделаешь?", optionen: [
        { t: "Nicht antworten und Mama oder Papa zeigen", ru: "Не отвечать и показать маме или папе", ok: true,
          warum: "Richtig! Fotos von dir schickst du nicht an Fremde. Zeig die Nachricht einem Erwachsenen.", warumRu: "Правильно! Свои фото ты не отправляешь незнакомым. Покажи сообщение взрослому." },
        { t: "Ein Foto schicken", ru: "Отправить фото", ok: false,
          warum: "Lieber nicht! Du weißt nicht, wer Lena wirklich ist.", warumRu: "Лучше не надо! Ты не знаешь, кто такая Лена на самом деле." },
        { t: "Fragen, wo sie wohnt", ru: "Спросить, где она живёт", ok: false,
          warum: "Besser gar nicht weiterschreiben und einem Erwachsenen Bescheid sagen.", warumRu: "Лучше совсем не переписываться дальше и рассказать взрослому." }] },
      { typ: "chat", von: "SpieleFan99", nachricht: "Du spielst echt gut! Wollen wir uns mal treffen? Aber sag es niemandem.", nachrichtRu: "Ты классно играешь! Давай как-нибудь встретимся? Только никому не говори.",
        frage: "Was machst du?", ru: "Что ты сделаешь?", optionen: [
        { t: "Sofort einem Erwachsenen Bescheid sagen", ru: "Сразу рассказать взрослому", ok: true,
          warum: "Genau richtig! Wenn jemand Geheimnisse will oder dich treffen will, sagst du es sofort deinen Eltern.", warumRu: "Совершенно верно! Если кто-то хочет секретов или хочет с тобой встретиться, сразу скажи родителям." },
        { t: "Ja sagen, aber nichts verraten", ru: "Согласиться, но никому не говорить", ok: false,
          warum: "Nein! Triff dich nie mit jemandem aus dem Internet. Erzähl es sofort einem Erwachsenen.", warumRu: "Нет! Никогда не встречайся с людьми из интернета. Сразу расскажи взрослому." },
        { t: "Meine Adresse schicken", ru: "Отправить свой адрес", ok: false,
          warum: "Auf keinen Fall! Deine Adresse ist geheim.", warumRu: "Ни в коем случае! Твой адрес — секрет." }] },
      { typ: "daumen", e: "😟", satz: "Wenn mir etwas im Internet Angst macht, behalte ich es für mich.", satzRu: "Если что-то в интернете меня пугает, я никому об этом не говорю.", ok: false,
        warum: "Nein! Erzähle es immer einem Erwachsenen, dem du vertraust. Du bekommst keinen Ärger.", warumRu: "Нет! Всегда рассказывай взрослому, которому доверяешь. Тебя не будут ругать." },
      { typ: "sag", e: "☎️", text: "Wichtig: Wenn du ein komisches Gefühl hast, sag es Mama, Papa oder einem anderen Erwachsenen, dem du vertraust. Kinder können auch kostenlos die Nummer gegen Kummer anrufen: 116 111.",
        ru: "Важно: если тебе стало не по себе, скажи маме, папе или другому взрослому, которому ты доверяешь. Дети в Германии могут также бесплатно позвонить на детский телефон доверия «Nummer gegen Kummer»: 116 111." },
      { typ: "sag", text: "Super! Du weißt jetzt, was du bei Fremden im Internet machst.", ru: "Супер! Теперь ты знаешь, что делать с незнакомцами в интернете." }
    ]
  },
  {
    id: "werbung", lz: ["me.ar.01"], name: "Werbung und Kaufen", e: "🛒", farbe: "#E8A33D", grund: "#FFF1D9",
    schritte: [
      { typ: "sag", e: "📢", text: "In vielen Spielen und Videos gibt es Werbung. Werbung will, dass du etwas kaufst oder irgendwo hintippst.",
        ru: "Во многих играх и видео есть реклама. Реклама хочет, чтобы ты что-нибудь купил или куда-нибудь нажал." },
      { typ: "popup", text: "Beim Spielen geht plötzlich ein Werbefenster auf. Schließe es richtig!", ru: "Во время игры вдруг открывается окно с рекламой. Закрой его правильно!" },
      { typ: "daumen", e: "🎁", satz: "Da steht: Du hast gewonnen! Tippe hier! Das stimmt bestimmt.", satzRu: "Там написано: «Ты выиграл! Нажми здесь!» Это точно правда.", ok: false,
        warum: "Vorsicht! Solche Nachrichten sind fast immer Werbung oder ein Trick. Nicht antippen.", warumRu: "Осторожно! Такие сообщения почти всегда реклама или обман. Не нажимай." },
      { typ: "wahl", e: "💎", frage: "Im Spiel kannst du Diamanten kaufen. Was machst du?", ru: "В игре можно купить алмазы. Что ты сделаешь?", optionen: [
        { t: "Erst Mama oder Papa fragen", ru: "Сначала спросить маму или папу", ok: true,
          warum: "Richtig! Kaufen kostet echtes Geld. Das entscheiden deine Eltern.", warumRu: "Правильно! Покупки стоят настоящих денег. Это решают твои родители." },
        { t: "Schnell auf Kaufen tippen", ru: "Быстро нажать «Купить»", ok: false,
          warum: "Halt! Das kostet echtes Geld. Frag immer zuerst deine Eltern.", warumRu: "Стоп! Это стоит настоящих денег. Всегда сначала спрашивай родителей." }] },
      { typ: "wahl", e: "📲", frage: "Ein Spiel will eine neue App herunterladen. Was machst du?", ru: "Игра хочет скачать новое приложение. Что ты сделаешь?", optionen: [
        { t: "Einen Erwachsenen fragen", ru: "Спросить взрослого", ok: true,
          warum: "Genau! Apps lädst du nur zusammen mit deinen Eltern herunter.", warumRu: "Именно! Приложения ты скачиваешь только вместе с родителями." },
        { t: "Einfach auf Installieren tippen", ru: "Просто нажать «Установить»", ok: false,
          warum: "Lieber nicht allein. Frag zuerst einen Erwachsenen.", warumRu: "Лучше не делать это самостоятельно. Сначала спроси взрослого." }] },
      { typ: "sag", text: "Toll! Du erkennst Werbung und fragst, bevor du etwas kaufst.", ru: "Здорово! Ты узнаёшь рекламу и спрашиваешь, прежде чем что-то купить." }
    ]
  },
  {
    id: "freundlich", lz: ["me.ar.02", "me.kk.01"], name: "Wahr, falsch und freundlich", e: "🕵️", farbe: "#C2337A", grund: "#FFE8F1",
    schritte: [
      { typ: "sag", e: "🕵️", text: "Nicht alles im Internet ist wahr. Bilder kann man verändern, und manche Geschichten sind erfunden.",
        ru: "Не всё в интернете правда. Картинки можно изменить, а некоторые истории выдуманы." },
      { typ: "daumen", e: "🦈🛒", satz: "Ein Foto zeigt einen Hai im Supermarkt. Das ist bestimmt echt.", satzRu: "На фото акула в супермаркете. Это точно настоящее фото.", ok: false,
        warum: "Wahrscheinlich nicht! Solche Bilder sind oft verändert. Frag nach, wenn du unsicher bist.", warumRu: "Скорее всего, нет! Такие картинки часто изменены. Спроси, если сомневаешься." },
      { typ: "wahl", e: "📨", frage: "Du bekommst: Schick das an 10 Freunde, sonst passiert etwas Schlimmes! Was machst du?",
        ru: "Тебе пишут: «Отправь это 10 друзьям, иначе случится что-то плохое!» Что ты сделаешь?", optionen: [
        { t: "Nicht weiterschicken und einem Erwachsenen zeigen", ru: "Не пересылать и показать взрослому", ok: true,
          warum: "Richtig! Das ist ein Kettenbrief. Es passiert nichts Schlimmes, wenn du ihn nicht weiterschickst.", warumRu: "Правильно! Это «письмо счастья». Ничего плохого не случится, если ты его не перешлёшь." },
        { t: "Schnell an alle weiterschicken", ru: "Быстро переслать всем", ok: false,
          warum: "Nicht nötig! Kettenbriefe sind ausgedacht. Es passiert wirklich nichts.", warumRu: "Не нужно! Такие письма — выдумка. Правда ничего не случится." }] },
      { typ: "sag", e: "💛", text: "Im Internet sitzt am anderen Ende ein echter Mensch. Sei freundlich, so wie auf dem Schulhof.",
        ru: "В интернете на другой стороне — настоящий человек. Будь добрым, как на школьном дворе." },
      { typ: "chat", von: "Max", nachricht: "Dein Bild ist doof 😝", nachrichtRu: "Твой рисунок дурацкий 😝", frage: "Was machst du?", ru: "Что ты сделаешь?", optionen: [
        { t: "Nicht gemein zurückschreiben und einem Erwachsenen zeigen", ru: "Не отвечать грубо и показать взрослому", ok: true,
          warum: "Genau! Gemeine Nachrichten zeigst du einem Erwachsenen. Du kannst so jemanden auch blockieren.", warumRu: "Именно! Злые сообщения показывай взрослому. Такого человека можно ещё и заблокировать." },
        { t: "Etwas noch Gemeineres zurückschreiben", ru: "Написать в ответ что-то ещё злее", ok: false,
          warum: "Dann wird es nur schlimmer. Zeig die Nachricht lieber einem Erwachsenen.", warumRu: "Тогда станет только хуже. Лучше покажи сообщение взрослому." }] },
      { typ: "daumen", e: "😢", satz: "Wenn jemand in der Klassen-Gruppe ausgelacht wird, sage ich einem Erwachsenen Bescheid.", satzRu: "Если над кем-то смеются в чате класса, я говорю об этом взрослому.", ok: true,
        warum: "Super! Das ist mutig und hilft dem anderen Kind.", warumRu: "Супер! Это смело и помогает другому ребёнку." },
      { typ: "sag", text: "Herzlichen Glückwunsch, {name}! Du bist jetzt ein Tablet-Profi!", ru: "Поздравляю, {name}! Теперь ты настоящий мастер планшета!" }
    ]
  }
];

// Feste Texte der Oberfläche in beiden Sprachen
window.LEKTIONEN_TEXTE = {
  daumenFrage: ["Stimmt das? Daumen hoch oder runter?", "Это правда? Палец вверх или вниз?"],
  nochmalHin: ["Hmm, schau nochmal genau hin.", "Хм, посмотри ещё раз внимательно."],
  dochGut: ["Doch, das ist gut so!", "Нет-нет, это как раз хорошо!"],
  geheim: ["Das bleibt besser geheim!", "Это лучше держать в секрете!"],
  darfSagen: ["Das darfst du ruhig sagen. Es verrät nicht, wer oder wo du bist.", "Это можно сказать. Это не выдаёт, кто ты и где ты."],
  sortiert: ["Alles richtig sortiert!", "Всё правильно разложено!"],
  getippt: ["Super getippt!", "Супер, получилось!"],
  gewischt: ["Toll gewischt!", "Здорово, получилось!"],
  apfel: ["Der Apfel ist im Korb!", "Яблоко в корзине!"],
  gedrueckt: ["Prima lange gedrückt!", "Отлично, получилось!"],
  kaefer: ["Der Marienkäfer ist jetzt riesig!", "Божья коровка теперь огромная!"],
  werbungFalsch: ["Halt! Der große bunte Knopf gehört zur Werbung. Such das kleine X in der Ecke.", "Стоп! Большая яркая кнопка — это часть рекламы. Найди маленький крестик в углу."],
  werbungRichtig: ["Richtig! Mit dem kleinen X schließt du das Fenster. Wenn du es nicht findest, frag einen Erwachsenen.", "Правильно! Маленьким крестиком ты закрываешь окно. Если не можешь его найти, спроси взрослого."]
};
