// Texte der Story- und Tutorial-Szenen (NA-11 ff.). Nur Daten: die Insel ergänzt Zeigehand und „warten auf“.
// So kann die Inselchronik (Album, NA-18) jede Szene auch ohne Insel noch einmal abspielen.
// Jede Blase: { wer, text: { de, ru, …, status: { ru: "entwurf" } }, alt?: { tippen: {…} } }
// Neue Übersetzungen bleiben "entwurf", bis ein Muttersprachler sie geprüft hat (docs/SPRACHEN.md); Entwürfe erscheinen in /dev und – für freigegebene Sprachen (Spielwelt.ENTWURF_FREI, zurzeit Russisch) – auch auf der Hauptseite.
// Nach szene.js laden.
(function () {
  const Sz = window.Szene; if (!Sz) return;
  const E = { ru: "entwurf" };
  Sz.registriere("prolog", { titel: "Ankunft auf der Insel", etappe: "E1", blasen: [
    { wer: "robo", text: { de: "Willkommen auf deiner Insel, {name}! Ich bin Robo Pixel. Mit meinem Boot habe ich dich hergebracht.",
      ru: "Добро пожаловать на твой остров, {name}! Я Робо Пиксель. Я привёз тебя на своей лодке.", status: E } },
    { wer: "robo", text: { de: "Leg deinen Finger links auf den Bildschirm und schieb ihn. So läufst du!",
      ru: "Положи палец слева на экран и двигай его. Так ты ходишь!", status: E },
      alt: { tippen: { de: "Tippe auf die Wiese. Dorthin läufst du!", ru: "Нажми на траву. Туда ты и пойдёшь!", status: E } } },
    { wer: "robo", text: { de: "Super! Siehst du das Haus? Das ist dein Zuhause. Lauf hin!",
      ru: "Супер! Видишь дом? Это твой дом. Иди туда!", status: E } },
    { wer: "robo", text: { de: "Tippe jetzt auf den runden Knopf mit der Tür. Dann gehst du hinein.",
      ru: "Теперь нажми на круглую кнопку с дверью. Тогда ты войдёшь внутрь.", status: E } }
  ] });
})();

// ---------- Weihnachts-Sonderstart (NA-15): Paket am Steg ----------
(function () {
  const Sz = window.Szene; if (!Sz) return;
  const E = { ru: "entwurf" };
  Sz.registriere("weihnachtspaket", { titel: "Ein Paket am Steg", blasen: [
    { wer: "robo", text: { de: "Frohe Weihnachten, {name}! Am Steg liegt ein Paket für dich.", ru: "С Рождеством, {name}! У причала лежит подарок для тебя.", status: E } },
    { wer: "robo", text: { de: "Lauf hin und mach es auf!", ru: "Подойди и открой его!", status: E } }
  ] });
  // Geburtstag (30.10.2026): jedes Jahr einmal, ab dem Geburtstag (auch Tage später), Paket am Steg
  Sz.registriere("geburtstag", { titel: "Mein Geburtstag", blasen: [
    { wer: "papagei", text: { de: "Herzlichen Glückwunsch zum Geburtstag, {name}! 🎂", ru: "С днём рождения, {name}! 🎂", status: E } },
    { wer: "biber", text: { de: "Alle auf der Insel haben zusammen ein Geschenk für dich gepackt.", ru: "Все жители острова вместе упаковали для тебя подарок.", status: E } },
    { wer: "robo", text: { de: "Es liegt am Steg. Lauf hin und mach es auf!", ru: "Он лежит у причала. Подойди и открой его!", status: E } }
  ] });
  // QR-Geschenk (NA-16): einmal erklärt; spätere Geschenke liegen einfach am Steg
  Sz.registriere("geschenkpaket", { titel: "Ein Geschenk am Steg", blasen: [
    { wer: "robo", text: { de: "Piep, {name}! Jemand hat dir ein Geschenk geschickt. Es liegt am Steg.", ru: "Пип, {name}! Тебе прислали подарок. Он лежит у причала.", status: E } },
    { wer: "robo", text: { de: "Lauf hin und mach es auf!", ru: "Подойди и открой его!", status: E } }
  ] });
})();

// ---------- Tutorial E2 „Erst lernen“ und Szene „Die Sonne geht auf“, E3 „Erste Frucht“ = Kapitel 1 „Der Spross“ (NA-13) ----------
(function () {
  const Sz = window.Szene; if (!Sz) return;
  const E = { ru: "entwurf" };
  Sz.registriere("erst-lernen", { titel: "Erst lernen, dann spielen", etappe: "E2", blasen: [
    { wer: "robo", text: { de: "Schau, die Sonnenuhr am Steg! Ihre Sonne ist noch dunkel.", ru: "Смотри, солнечные часы у причала! Их солнце ещё тёмное.", status: E } },
    { wer: "robo", text: { de: "Die Sonne geht auf, wenn du gelernt hast. Dann wachen die Spielorte auf.", ru: "Солнце встанет, когда ты поучишься. Тогда проснутся места для игр.", status: E } },
    { wer: "eule", text: { de: "Komm zu mir, {name}! Bei Ella, Fipsi und Benno lernst du. Wir helfen dir.", ru: "Иди ко мне, {name}! У Эллы, Фипси и Бенно ты учишься. Мы тебе поможем.", status: E } }
  ] });
  Sz.registriere("sonne", { titel: "Die Sonne geht auf", blasen: [
    { wer: "robo", text: { de: "Piep! Die Sonne ist aufgegangen. Du hast gelernt – jetzt darfst du spielen!", ru: "Пип! Солнце встало. Уроки сделаны – теперь можно играть!", status: E } },
    { wer: "robo", text: { de: "Ist die Spielzeit vorbei, geht die Sonne unter. Wenn du wieder lernst, geht sie wieder auf.", ru: "Когда время игры закончится, солнце сядет. Когда снова поучишься, оно снова встанет.", status: E } }
  ] });
  Sz.registriere("erste-frucht", { titel: "Der Spross", etappe: "E3", kapitel: 1, blasen: [
    { wer: "eule", text: { de: "Sieh mal, {name}: eine Frucht an deinem Wissensbaum!", ru: "Смотри, {name}: плод на твоём дереве знаний!", status: E } },
    { wer: "eule", text: { de: "Jede Frucht ist etwas, das du neu kannst. Du hast etwas gelernt – und der Baum wächst.", ru: "Каждый плод – это то, что ты теперь умеешь. Ты узнаёшь новое – и дерево растёт.", status: E } },
    { wer: "eule", text: { de: "Dein Baum vertreibt den Nebel. Je mehr du lernst, desto mehr von der Insel wacht auf.", ru: "Твоё дерево прогоняет туман. Чем больше ты учишься, тем больше острова просыпается.", status: E } }
  ] });
})();

// ---------- Tutorial E4–E8 (NA-14): Sterne, Ei, Spielorte, Merkkiste, Gefühle ----------
// Auslöser und Reihenfolge im Insel-Kern (ETAPPEN in shared/insel-kern.js); Zeigehand und Warten setzt jeder Look.
(function () {
  const Sz = window.Szene; if (!Sz) return;
  const E = { ru: "entwurf" };
  Sz.registriere("sterne", { titel: "Sterne fürs Zuhause", etappe: "E4", blasen: [
    { wer: "biber", text: { de: "Schau mal, {name}: Du hast schon Sterne gesammelt!", ru: "Смотри, {name}: ты уже собрал(а) звёзды!", status: E } },
    { wer: "biber", text: { de: "Mit Sternen kaufst du schöne Sachen für dein Zimmer. Geh in dein Haus!", ru: "За звёзды можно купить красивые вещи для комнаты. Иди в свой дом!", status: E } },
    { wer: "biber", text: { de: "Tippe auf „Einrichten“ und such dir etwas aus. Was du kaufst, bleibt für immer deins.", ru: "Нажми «Обустроить» и выбери что-нибудь. Купленное останется твоим навсегда.", status: E } }
  ] });
  Sz.registriere("ei", { titel: "Das Nest", etappe: "E5", blasen: [
    { wer: "robo", text: { de: "Siehst du das Nest neben deinem Haus? Dort kann ein Haustier wohnen.", ru: "Видишь гнездо рядом с домом? Там может жить питомец.", status: E } },
    { wer: "robo", text: { de: "Such dir ein Ei aus und wärme es jeden Tag ein bisschen. Dann schlüpft dein Tier!", ru: "Выбери яйцо и каждый день немного согревай его. Тогда вылупится твой питомец!", status: E } },
    { fuerAeltere: true, wer: "robo", text: { de: "Dein Tier ist nie böse, wenn du mal keine Zeit hast. Es freut sich einfach, wenn du kommst.", ru: "Твой питомец никогда не обижается, если у тебя нет времени. Он просто радуется, когда ты приходишь.", status: E } }
  ] });
  // E6: seit 01.11.2026 der Insel-Garten (die alten Spielorte sind ausgeblendet); mit MINISPIELE_AUS = false gilt wieder die alte Szene
  if (!(window.Spielwelt && window.Spielwelt.MINISPIELE_AUS)) Sz.registriere("spielorte", { titel: "Die Spielorte sind wach", etappe: "E6", blasen: [
    { wer: "robo", text: { de: "Die Sonne scheint, die Spielorte sind wach! Die Ballon-Wiese wartet auf dich.", ru: "Солнце светит, места для игр проснулись! Поляна с шариками ждёт тебя.", status: E } },
    { wer: "robo", text: { de: "Spiel eine Runde! Wenn die Sonne untergeht, ist die Spielzeit für heute vorbei – morgen geht es weiter.", ru: "Сыграй раунд! Когда солнце сядет, время игры на сегодня закончится – завтра продолжим.", status: E } }
  ] });
  else Sz.registriere("spielorte", { titel: "Der Insel-Garten", etappe: "E6", blasen: [
    { wer: "eule", text: { de: "{name}, komm mal mit! Neben dem Wissensbaum ist ein Garten aufgewacht.", ru: "{name}, пойдём! Рядом с деревом знаний проснулся сад.", status: E } },
    { wer: "eule", text: { de: "Hier säst du Samen und gießt sie jeden Tag einmal. Dann wachsen sie.", ru: "Здесь ты сеешь семена и поливаешь их раз в день. Тогда они растут.", status: E } },
    { wer: "eule", text: { de: "Keine Sorge: Deine Pflanzen werden nie welk. Sie warten auf dich.", ru: "Не волнуйся: твои растения никогда не завянут. Они ждут тебя.", status: E } }
  ] });
  Sz.registriere("merkkiste", { titel: "Die Merkkiste", etappe: "E7", blasen: [
    { wer: "fipsi", text: { de: "Psst, {name}! In meiner Merkkiste liegt etwas, das du schon einmal geübt hast.", ru: "Псс, {name}! В моём сундучке лежит то, что ты уже упражнял(а).", status: E } },
    { wer: "fipsi", text: { de: "Wiederholen macht dein Gedächtnis stark. Komm zu mir, dann üben wir es kurz!", ru: "Повторение делает память сильной. Иди ко мне, и мы быстро повторим!", status: E } }
  ] });
  Sz.registriere("gefuehle", { titel: "Wie geht es dir?", etappe: "E8", blasen: [
    { wer: "baer", text: { de: "Hallo {name}! Ich bin Bruni. Wie geht es dir heute?", ru: "Привет, {name}! Я Бруни. Как ты сегодня?", status: E } },
    { wer: "baer", text: { de: "Bei mir kannst du zeigen, wie du dich fühlst. Und wenn du müde bist, machen wir zusammen eine Pause.", ru: "У меня можно показать, что ты чувствуешь. А если устанешь, мы вместе сделаем перерыв.", status: E } }
  ] });
})();

// ---------- Kapitel 2 „Fipsis Karte“ und Etappe E9 „Atelier“ (NA-17) ----------
// Auslöser im Insel-Kern (KAPITEL, ETAPPEN); Zeigehand und der neue Weg in heimat.js (spieleStory).
(function () {
  const Sz = window.Szene; if (!Sz) return;
  const E = { ru: "entwurf" };
  Sz.registriere("fipsis-karte", { titel: "Fipsis Karte", kapitel: 2, blasen: [
    { wer: "fipsi", text: { de: "{name}, schau mal! Ich habe ein Stück von meiner Schatzkarte gefunden!", ru: "{name}, смотри! Я нашла кусочек своей карты сокровищ!", status: E } },
    { wer: "fipsi", text: { de: "Darauf ist ein Weg eingezeichnet – und da ist er schon! Er führt zu einem Wegweiser.", ru: "На ней нарисована тропинка – и вот она! Она ведёт к указателю.", status: E } },
    { wer: "fipsi", text: { de: "Auf den Schildern stehen Wörter, die du schon kennst. Lies sie mal laut!", ru: "На табличках написаны слова, которые ты уже знаешь. Прочитай их вслух!", status: E } },
    { fuerAeltere: true, wer: "fipsi", text: { de: "Mit jedem neuen Wort finden wir mehr von der Karte. Wann immer du magst, üben wir weiter.", ru: "С каждым новым словом мы находим больше карты. Когда захочешь, продолжим.", status: E } }
  ] });
  // Kapitel 3 (01.11.2026): Bennos Bäckerei öffnet
  Sz.registriere("bennos-baeckerei", { titel: "Bennos Bäckerei", kapitel: 3, blasen: [
    { wer: "biber", text: { de: "{name}, rate mal, was ich gebaut habe! Eine Bäckerei!", ru: "{name}, угадай, что я построил! Пекарню!", status: E } },
    { fuerAeltere: true, wer: "biber", text: { de: "Brötchen, Brezeln, Kuchen – alles frisch gebacken. Die Tiere der Insel kaufen bei mir ein.", ru: "Булочки, крендели, пироги – всё свежее. Звери острова покупают у меня.", status: E } },
    { wer: "biber", text: { de: "Hilfst du mir an der Theke? Wir packen die Bestellungen und rechnen mit dem Geld.", ru: "Поможешь мне за прилавком? Мы собираем заказы и считаем деньги.", status: E } }
  ] });
  // Kapitel 4 (05.11.2026): Paulas Fest – das Rhythmus-Boot an der Ballon-Wiese
  Sz.registriere("paulas-fest", { titel: "Paulas Fest", kapitel: 4, blasen: [
    { wer: "papagei", text: { de: "{name}! Am Fluss hinter der Ballon-Wiese feiern wir ein Fest – und du bist eingeladen!", ru: "{name}! У реки за поляной с шариками мы празднуем – и ты приглашён!", status: E } },
    { wer: "papagei", text: { de: "Wir fahren mit meinem Boot hin. Aber paddeln geht nur im Rhythmus: Ta, ti-ti, Ta!", ru: "Мы поплывём на моей лодке. Но грести можно только в ритме: Та, ти-ти, Та!", status: E } },
    { fuerAeltere: true, wer: "papagei", text: { de: "Ich spiele vor, du paddelst nach. Wann immer du magst, fahren wir los.", ru: "Я играю, ты повторяешь. Когда захочешь, поплывём.", status: E } }
  ] });
  // Kapitel 5 (06.11.2026): Der Sturm – Ella und Bruni bereiten die Insel vor, ohne Angst; danach steigt der Wetter-Drache
  Sz.registriere("der-sturm", { titel: "Der Sturm", kapitel: 5, blasen: [
    { wer: "eule", text: { de: "{name}, schau zum Himmel! Dunkle Wolken – heute Nacht kommt ein Sturm.", ru: "{name}, посмотри на небо! Тёмные тучи – ночью будет буря.", status: E } },
    { wer: "baer", text: { de: "Keine Angst. Wir binden die Boote fest und bleiben drinnen, bis er vorbei ist.", ru: "Не бойся. Мы привяжем лодки и останемся дома, пока буря не пройдёт.", status: E } },
    { wer: "eule", text: { de: "Danach weht ein guter Wind. Komm an die Wetterstation – wir lassen meinen Drachen steigen!", ru: "А потом подует хороший ветер. Приходи к метеостанции – запустим моего змея!", status: E } },
    { fuerAeltere: true, wer: "eule", text: { de: "Vorher schauen wir genau aufs Wetter: Wie warm ist es? Wie stark weht der Wind?", ru: "Сначала посмотрим на погоду: Как тепло? Как сильно дует ветер?", status: E } }
  ] });
  // Kapitel 6 (07.11.2026): Der Leuchtturm – Tilda führt zum alten Leuchtturm; in der Höhle lenkt das Kind das Licht mit Spiegeln, dann leuchtet die Insel
  Sz.registriere("der-leuchtturm", { titel: "Der Leuchtturm", kapitel: 6, blasen: [
    { wer: "tilda", text: { de: "{name}, du hast so viel gelernt! Jetzt zeige ich dir mein Geheimnis.", ru: "{name}, ты так многому научился! Теперь я покажу тебе мой секрет.", status: E } },
    { wer: "tilda", text: { de: "Dort am Ufer steht der alte Leuchtturm. Unten drin ist eine Höhle mit Spiegeln und Kristallen.", ru: "Там, на берегу, стоит старый маяк. Внизу есть пещера с зеркалами и кристаллами.", status: E } },
    { wer: "tilda", text: { de: "Lenk das Licht mit den Spiegeln – dann leuchtet der Turm, und nachts strahlt die ganze Insel.", ru: "Направь свет зеркалами – тогда маяк засветится, и ночью будет сиять весь остров.", status: E } },
    { fuerAeltere: true, wer: "tilda", text: { de: "In der Höhle liegt auch meine Schatzkammer. Dort siehst du alles, was du schon geschafft hast.", ru: "В пещере есть и моя сокровищница. Там видно всё, что ты уже сделал.", status: E } }
  ] });
  Sz.registriere("atelier", { titel: "Paulas Atelier", etappe: "E9", blasen: [
    { wer: "papagei", text: { de: "Hallo {name}! Ich bin Paula. Auf meiner Bühne spielt Musik – und im Atelier wird gemalt!", ru: "Привет, {name}! Я Паула. На моей сцене играет музыка – а в ателье рисуют!", status: E } },
    { wer: "papagei", text: { de: "Male ein Bild oder erfinde eine Melodie. Dein neuestes Bild steht dann auf der Staffelei in deinem Zimmer.", ru: "Нарисуй картину или придумай мелодию. Твоя новая картина будет стоять на мольберте в твоей комнате.", status: E } },
    { fuerAeltere: true, wer: "papagei", text: { de: "Und deine Melodie spiele ich hier auf der Bühne – dann tanzen alle mit!", ru: "А твою мелодию я сыграю здесь на сцене – и все будут танцевать!", status: E } }
  ] });
})();
