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
    { wer: "eule", text: { de: "Komm zu mir, {name}! Bei mir, Fipsi und Benno lernst du. Wir helfen dir.", ru: "Иди ко мне, {name}! У меня, Фипси и Бенно ты учишься. Мы тебе поможем.", status: E } }
  ] });
  Sz.registriere("sonne", { titel: "Die Sonne geht auf", blasen: [
    { wer: "robo", text: { de: "Piep! Die Sonne ist aufgegangen. Du hast gelernt – jetzt darfst du spielen!", ru: "Пип! Солнце встало. Уроки сделаны – теперь можно играть!", status: E } },
    { wer: "robo", text: { de: "Wenn die Spielzeit vorbei ist, geht die Sonne unter. Wenn du wieder lernst, geht sie wieder auf.", ru: "Когда время игры закончится, солнце сядет. Когда снова поучишься, оно снова встанет.", status: E } }
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
    { wer: "fipsi", text: { de: "{name}, schau mal! Ich habe ein Stück von meiner Schatzkarte gefunden!", ru: "{name}, смотри! Я нашёл кусочек своей карты сокровищ!", status: E } },
    { wer: "fipsi", text: { de: "Darauf ist ein Weg eingezeichnet – und da ist er schon! Er führt zu einem Wegweiser.", ru: "На ней нарисована тропинка – и вот она! Она ведёт к указателю.", status: E } },
    { wer: "fipsi", text: { de: "Auf den Schildern stehen Wörter, die du schon kennst. Lies sie mal laut!", ru: "На табличках написаны слова, которые ты уже знаешь. Прочитай их вслух!", status: E } },
    { fuerAeltere: true, wer: "fipsi", text: { de: "Mit jedem neuen Wort finden wir mehr von der Karte. Komm einfach vorbei, wenn du Lust hast.", ru: "С каждым новым словом мы находим больше карты. Приходи, когда захочешь.", status: E } }
  ] });
  // Kapitel 3 (01.11.2026): Bennos Bäckerei öffnet
  Sz.registriere("bennos-baeckerei", { titel: "Bennos Bäckerei", kapitel: 3, blasen: [
    { wer: "biber", text: { de: "{name}, rate mal, was ich gebaut habe! Eine Bäckerei!", ru: "{name}, угадай, что я построил! Пекарню!", status: E } },
    { fuerAeltere: true, wer: "biber", text: { de: "Brötchen, Brezeln, Kuchen – alles frisch gebacken. Die Tiere der Insel kaufen bei mir ein.", ru: "Булочки, крендели, пироги – всё свежее. Звери острова покупают у меня.", status: E } },
    { wer: "biber", text: { de: "Hilfst du mir an der Theke? Wir packen die Bestellungen und rechnen mit dem Geld.", ru: "Поможешь мне за прилавком? Мы собираем заказы и считаем деньги.", status: E } }
  ] });
  // Kapitel 4 (05.11.2026): Paulas Fest – das Rhythmus-Boot an der Ballon-Wiese
  Sz.registriere("paulas-fest", { titel: "Paulas Fest", kapitel: 4, blasen: [
    { wer: "papagei", text: { de: "{name}! Am Teich hinter der Ballon-Wiese feiern wir ein Fest – und du bist eingeladen!", ru: "{name}! У пруда за поляной с шариками мы празднуем – и ты приглашён(а)!", status: E } },
    { wer: "papagei", text: { de: "Wir fahren mit meinem Boot hin. Aber paddeln geht nur im Rhythmus: Ta, ti-ti, Ta!", ru: "Мы поплывём на моей лодке. Но грести можно только в ритме: Та, ти-ти, Та!", status: E } },
    { fuerAeltere: true, wer: "papagei", text: { de: "Ich spiele vor, du paddelst nach. Das Boot wartet auf dich.", ru: "Я играю, ты повторяешь. Лодка ждёт тебя.", status: E } }
  ] });
  // Kapitel 5 (06.11.2026): Der Sturm – seit 07.11.2026 (Story-Review, KONZEPT: Bruni hat Angst vor Stürmen) tröstet das Kind Bruni: gemeinsam atmen;
  // danach räumen alle auf und Ellas Wetter-Drache steigt. Auf der Insel ziehen während der Szene Wolken, Regen und Wind auf (heimat.js, storyEffekt).
  Sz.registriere("der-sturm", { titel: "Der Sturm", kapitel: 5, blasen: [
    { wer: "eule", text: { de: "{name}, schau zum Himmel! Dunkle Wolken – ein Sturm zieht auf.", ru: "{name}, посмотри на небо! Тёмные тучи – надвигается буря.", status: E } },
    { wer: "baer", text: { de: "Oh je, ich habe ein bisschen Angst vor Stürmen. Atmest du mit mir? Ein – aus. Ein – aus.", ru: "Ой, я немного боюсь бурь. Подышишь со мной? Вдох – выдох. Вдох – выдох.", status: E } },
    { wer: "baer", text: { de: "Danke, {name}. Jetzt geht es mir besser. Zusammen ist ein Sturm nur halb so schlimm.", ru: "Спасибо, {name}. Теперь мне лучше. Вместе буря не такая страшная.", status: E } },
    { wer: "eule", text: { de: "Der Sturm ist vorbei. Alle helfen beim Aufräumen – danke, {name}! Jetzt weht ein guter Wind für meinen Drachen.", ru: "Буря прошла. Все помогают убирать – спасибо, {name}! Теперь дует хороший ветер для моего змея.", status: E } }
  ] });
  // Kapitel 6 (07.11.2026): Der Leuchtturm – Tilda führt zum alten Leuchtturm; in der Höhle lenkt das Kind das Licht mit Spiegeln, dann leuchtet die Insel
  Sz.registriere("der-leuchtturm", { titel: "Der Leuchtturm", kapitel: 6, blasen: [
    { wer: "tilda", text: { de: "{name}, du hast so viel gelernt! Jetzt zeige ich dir mein Geheimnis.", ru: "{name}, ты так многому научился(-ась)! Теперь я покажу тебе мой секрет.", status: E } },
    { wer: "tilda", text: { de: "Dort am Ufer steht der alte Leuchtturm. Unten drin ist eine Höhle mit Spiegeln und Kristallen.", ru: "Там, на берегу, стоит старый маяк. Внизу есть пещера с зеркалами и кристаллами.", status: E } },
    { wer: "tilda", text: { de: "Lenk das Licht mit den Spiegeln – dann leuchtet der Turm, und nachts strahlt die ganze Insel.", ru: "Направь свет зеркалами – тогда маяк засветится, и ночью будет сиять весь остров.", status: E } },
    { fuerAeltere: true, wer: "tilda", text: { de: "In der Höhle liegt auch meine Schatzkammer. Dort siehst du alles, was du schon geschafft hast.", ru: "В пещере есть и моя сокровищница. Там видно всё, что ты уже сделал(а).", status: E } }
  ] });
  // Kapitel 7 „Neue Ufer“ (09.11.2026, KONZEPT): Robo macht das Boot klar – Fahrt zu Nachbar-Eilanden mit Ellas Forscherlager
  Sz.registriere("neue-ufer", { titel: "Neue Ufer", kapitel: 7, blasen: [
    { wer: "robo", text: { de: "Piep, {name}! Mein Boot ist endlich bereit für eine große Fahrt.", ru: "Пип, {name}! Моя лодка наконец готова к большому путешествию.", status: E } },
    { wer: "robo", text: { de: "Wünsch dir ein Eiland: Wiese, Wald, Berge, Strand, Schnee oder Wüste. Dann fahren wir hin.", ru: "Пожелай остров: луг, лес, горы, пляж, снег или пустыню. И мы поплывём туда.", status: E } },
    { wer: "eule", text: { de: "Ich schlage dort mein Forscherlager auf. Mit Karte und Tagebuch erforschen wir alles!", ru: "Я разобью там свой лагерь исследователей. С картой и дневником мы всё исследуем!", status: E } },
    { fuerAeltere: true, wer: "robo", text: { de: "Und keine Sorge: Deine Heimatinsel bleibt, wie sie ist. Wir kommen immer zurück.", ru: "И не волнуйся: твой родной остров останется таким, как есть. Мы всегда возвращаемся.", status: E } }
  ] });
  Sz.registriere("atelier", { titel: "Paulas Atelier", etappe: "E9", blasen: [
    { wer: "papagei", text: { de: "Hallo {name}! Ich bin Paula. Auf meiner Bühne spielt Musik – und im Atelier wird gemalt!", ru: "Привет, {name}! Я Паула. На моей сцене играет музыка – а в ателье рисуют!", status: E } },
    { wer: "papagei", text: { de: "Male ein Bild oder erfinde eine Melodie. Dein neuestes Bild steht dann auf der Staffelei in deinem Zimmer.", ru: "Нарисуй картину или придумай мелодию. Твоя новая картина будет стоять на мольберте в твоей комнате.", status: E } },
    { fuerAeltere: true, wer: "papagei", text: { de: "Und deine Melodie spiele ich hier auf der Bühne – dann tanzen alle mit!", ru: "А твою мелодию я сыграю здесь на сцене – и все будут танцевать!", status: E } }
  ] });
})();

// ---------- Story-Bogen mit Finale (07.11.2026, Story-Review): Nebenszenen, Kapitel 8 „Fipsis Schatz“, Kapitel 9 „Bennos Brücke“, Kapitel 10 „Die Insel ist wach“, Jahreszeiten ----------
// Auslöser im Insel-Kern (KAPITEL, NEBEN, JAHRESZEITEN); Zeigehand, Wetter, Fest und Nebel in heimat.js (spieleStory, storyEffekt).
(function () {
  const Sz = window.Szene; if (!Sz) return;
  const E = { ru: "entwurf" };

  // Nebenszenen (höchstens eine am Tag)
  Sz.registriere("tilda", { titel: "Tilda am Schachtisch", blasen: [
    { wer: "tilda", text: { de: "Hallo {name}! Ich bin Tilda. Ich bin langsam – aber ich denke gründlich nach.", ru: "Привет, {name}! Я Тильда. Я медленная – но я хорошо думаю.", status: E } },
    { wer: "tilda", text: { de: "Hier am Tisch spiele ich Schach. Spielst du mal mit mir?", ru: "Здесь за столом я играю в шахматы. Сыграешь со мной?", status: E } },
    { fuerAeltere: true, wer: "tilda", text: { de: "Keine Eile. Beim Schach gewinnt, wer in Ruhe nachdenkt.", ru: "Не спеши. В шахматах побеждает тот, кто спокойно думает.", status: E } }
  ] });
  Sz.registriere("brunis-station", { titel: "Brunis Station", blasen: [
    { wer: "baer", text: { de: "{name}, schau mal! Meine Tierpflege-Station ist fertig.", ru: "{name}, смотри! Моя станция для животных готова.", status: E } },
    { wer: "baer", text: { de: "Hierher kommen Wildtiere, die Hilfe brauchen. Wir geben ihnen Futter und Ruhe.", ru: "Сюда приходят дикие животные, которым нужна помощь. Мы даём им еду и покой.", status: E } },
    { wer: "baer", text: { de: "Wenn sie wieder gesund sind, lassen wir sie frei. Hilfst du mir?", ru: "Когда они поправятся, мы их отпустим. Поможешь мне?", status: E } }
  ] });
  Sz.registriere("paulas-feier", { titel: "Das Inselfest", blasen: [
    { wer: "papagei", text: { de: "Hurra, {name}! Du bist mit meinem Boot zum Fest gepaddelt. Jetzt feiern wir!", ru: "Ура, {name}! Ты приплыл(а) на моей лодке на праздник. Теперь празднуем!", status: E } },
    { wer: "papagei", text: { de: "Schau, das Plakat an meiner Bühne! Dort hängt ein Bild aus deinem Atelier.", ru: "Смотри, плакат у моей сцены! Там висит картина из твоего ателье.", status: E },
      alt: { ohneBild: { de: "Schau, das Plakat an meiner Bühne! Male im Atelier ein Bild – dann hänge ich es dort auf.", ru: "Смотри, плакат у моей сцены! Нарисуй картину в ателье – и я повешу её туда.", status: E } } },
    { wer: "papagei", text: { de: "Alle tanzen im Rhythmus mit dir. Ta, ti-ti, Ta!", ru: "Все танцуют вместе с тобой в ритме. Та, ти-ти, Та!", status: E } }
  ] });

  // Kapitel 8: die Schatzkarte ist komplett – in der Truhe am Wegweiser liegt das Wörterbuch der Insel
  Sz.registriere("fipsis-schatz", { titel: "Fipsis Schatz", kapitel: 8, blasen: [
    { wer: "fipsi", text: { de: "{name}, die Schatzkarte ist komplett! Alle fünf Teile sind da.", ru: "{name}, карта сокровищ готова! Все пять частей на месте.", status: E } },
    { wer: "fipsi", text: { de: "Das Kreuz auf der Karte ist bei meinem Wegweiser. Und schau – da steht eine Truhe!", ru: "Крестик на карте – у моего указателя. И смотри – там сундук!", status: E } },
    { wer: "fipsi", text: { de: "Darin liegt unser Schatz: das Wörterbuch der Insel. Alle deine Wörter stehen darin.", ru: "В нём наше сокровище: словарь острова. В нём все твои слова.", status: E } },
    { fuerAeltere: true, wer: "fipsi", text: { de: "Jedes neue Wort kommt dazu. So wächst unser Schatz immer weiter.", ru: "Каждое новое слово добавляется. Так наше сокровище растёт.", status: E } }
  ] });
  // Kapitel 9 „Bennos Brücke“ (07.11.2026): Benno baut eine Brücke zur Sandbank – das Kind misst und rechnet mit (spiele/bruecke/)
  Sz.registriere("bennos-bruecke", { titel: "Bennos Brücke", kapitel: 9, blasen: [
    { wer: "biber", text: { de: "{name}, schau mal da draußen: eine kleine Sandbank im Meer!", ru: "{name}, посмотри туда: маленькая песчаная отмель в море!", status: E } },
    { wer: "biber", text: { de: "Ich baue eine Brücke dorthin – Stück für Stück, Brett für Brett.", ru: "Я построю туда мост – часть за частью, доска за доской.", status: E } },
    { wer: "biber", text: { de: "Dafür muss ich messen und rechnen. Hilfst du mir?", ru: "Для этого нужно измерять и считать. Будешь моим помощником (моей помощницей)?", status: E } },
    { fuerAeltere: true, wer: "biber", text: { de: "Wir bauen ganz in Ruhe. Jedes fertige Stück bleibt stehen.", ru: "Мы строим спокойно. Каждая готовая часть остаётся на месте.", status: E } }
  ] });
  // Die Brücke ist fertig (alle 8 Stücke): kurze Abschluss-Szene, danach kann die Figur hinüber auf die Sandbank laufen
  Sz.registriere("bruecke-fertig", { titel: "Die Brücke ist fertig", blasen: [
    { wer: "biber", text: { de: "Geschafft, {name}! Die Brücke reicht bis zur Sandbank.", ru: "Готово, {name}! Мост доходит до самой отмели.", status: E } },
    { wer: "biber", text: { de: "Du hast gemessen und gerechnet – ganz genau. Danke!", ru: "Ты измерял(а) и считал(а) – очень точно. Спасибо!", status: E } },
    { wer: "biber", text: { de: "Lauf doch mal hinüber! Von der Sandbank sieht man die ganze Insel.", ru: "Пройди по мосту! С отмели виден весь остров.", status: E } }
  ] });
  // Kapitel 10 = Finale „Die Insel ist wach“: alle sieben Begleiter feiern am Schachtisch, der letzte Nebel geht. Danach geht es offen weiter.
  Sz.registriere("insel-wach", { titel: "Die Insel ist wach", kapitel: 10, blasen: [
    { wer: "biber", text: { de: "{name}, komm schnell! Ich lege mein Brücken-Werkzeug weg – alle sind am Schachtisch!", ru: "{name}, скорее! Я откладываю инструменты для моста – все собрались у шахматного стола!", status: E } },
    { wer: "papagei", text: { de: "Wir feiern dich! Ohne dich wäre die Insel noch im Nebel.", ru: "Мы празднуем в твою честь! Без тебя остров был бы ещё в тумане.", status: E } },
    { wer: "eule", text: { de: "Schau, der letzte Nebel zieht weg. Die Insel ist wach – und sie wächst weiter mit dir.", ru: "Смотри, последний туман уходит. Остров проснулся – и он растёт вместе с тобой.", status: E } },
    { wer: "baer", text: { de: "Und wir sind immer für dich da. Morgen, im Herbst, im Winter – wann du willst.", ru: "А мы всегда рядом. Завтра, осенью, зимой – когда захочешь.", status: E } }
  ] });

  // Eigene Idee (07.11.2026): Feste aus Herkunftsländern als Episoden – kurz, sachlich, für alle Kinder; Kinder aus diesen Ländern erkennen ihr Fest wieder
  Sz.registriere("fest-neujahr", { titel: "Neujahr mit Väterchen Frost", fest: true, blasen: [
    { wer: "baer", text: { de: "{name}, in vielen Ländern ist Neujahr ein großes Fest – zum Beispiel in Russland, der Ukraine und Bulgarien.", ru: "{name}, во многих странах Новый год – большой праздник, например в России, Украине и Болгарии.", status: E } },
    { wer: "baer", text: { de: "Dort bringt Väterchen Frost die Geschenke – mit seiner Enkelin, dem Schneemädchen. Sie liegen unter dem Tannenbaum!", ru: "Там подарки приносит Дед Мороз со своей внучкой Снегурочкой. Под ёлку!", status: E } },
    { wer: "papagei", text: { de: "Feiert ihr auch Neujahr? Erzähl jemandem, den du lieb hast, wie ihr feiert!", ru: "А вы тоже празднуете Новый год? Расскажи кому-нибудь, кого ты любишь, как вы празднуете!", status: E } }
  ] });
  Sz.registriere("fest-nouruz", { titel: "Nouruz – Neujahr im Frühling", fest: true, blasen: [
    { wer: "papagei", text: { de: "{name}, jetzt beginnt der Frühling! Viele Familien feiern heute Nouruz – das heißt „neuer Tag“.", ru: "{name}, начинается весна! Многие семьи празднуют сегодня Навруз – это значит «новый день».", status: E } },
    { wer: "papagei", text: { de: "Nouruz feiert man zum Beispiel im Iran, in Afghanistan und bei den Kurden. Es ist dort Neujahr.", ru: "Навруз празднуют, например, в Иране, Афганистане и у курдов. Там это Новый год.", status: E } },
    { wer: "biber", text: { de: "Man putzt das Haus, deckt einen schönen Tisch und besucht die Familie. Kennst du jemanden, der Nouruz feiert?", ru: "Убирают дом, накрывают красивый стол и навещают родных. Ты знаешь кого-нибудь, кто празднует Навруз?", status: E } }
  ] });

  // Jahreszeiten-Episoden (nach dem Finale, je Jahreszeit einmal im Jahr); danach bietet die Figur ein Sachthema an (kein Zwang)
  Sz.registriere("jz-herbst", { titel: "Bunte Blätter", jahreszeit: true, blasen: [
    { wer: "eule", text: { de: "Huhu, {name}! Es ist Herbst. Siehst du die bunten Blätter am Wissensbaum?", ru: "Ух-ух, {name}! Наступила осень. Видишь цветные листья на дереве знаний?", status: E } },
    { wer: "eule", text: { de: "Im Herbst werden die Blätter gelb, rot und braun. Dann fallen sie ab.", ru: "Осенью листья становятся жёлтыми, красными и коричневыми. Потом они опадают.", status: E } },
    { wer: "eule", text: { de: "Sammelst du draußen drei Blätter? Dann schauen wir, von welchem Baum sie sind.", ru: "Соберёшь на улице три листа? Потом посмотрим, с какого они дерева.", status: E } }
  ] });
  Sz.registriere("jz-winter", { titel: "Bruni und der Schnee", jahreszeit: true, blasen: [
    { wer: "baer", text: { de: "Brr, {name}! Es ist Winter. Bären schlafen jetzt viel – ich bleibe aber wach für dich.", ru: "Брр, {name}! Наступила зима. Медведи сейчас много спят – но я не сплю ради тебя.", status: E } },
    { wer: "baer", text: { de: "Wenn es kalt ist, wird Wasser zu Eis. Und aus Wolken fällt Schnee.", ru: "Когда холодно, вода превращается в лёд. А из облаков падает снег.", status: E } },
    { wer: "baer", text: { de: "Zieh dich warm an und schau dir das Wetter draußen an!", ru: "Оденься тепло и посмотри на погоду на улице!", status: E } }
  ] });
  Sz.registriere("jz-fruehling", { titel: "Benno und die Frühblüher", jahreszeit: true, blasen: [
    { wer: "biber", text: { de: "{name}, es ist Frühling! Am Teich blühen die ersten Blumen.", ru: "{name}, наступила весна! У пруда цветут первые цветы.", status: E } },
    { wer: "biber", text: { de: "Schneeglöckchen und Krokusse heißen Frühblüher. Sie kommen als Erste aus der Erde.", ru: "Подснежники и крокусы – первоцветы. Они первыми выходят из земли.", status: E } },
    { wer: "biber", text: { de: "Wie viele Blüten zählst du draußen? Ich zähle mit!", ru: "Сколько цветков ты насчитаешь на улице? Я считаю вместе с тобой!", status: E } }
  ] });
  Sz.registriere("jz-sommer", { titel: "Paula am Strand", jahreszeit: true, blasen: [
    { wer: "papagei", text: { de: "Sommer, {name}! Ich sitze am Strand und höre den Wellen zu.", ru: "Лето, {name}! Я сижу на пляже и слушаю волны.", status: E } },
    { wer: "papagei", text: { de: "Die Sonne ist jetzt stark. Trink viel Wasser und such dir Schatten.", ru: "Солнце сейчас сильное. Пей много воды и ищи тень.", status: E } },
    { wer: "papagei", text: { de: "Das Wasser rauscht wie Musik. Schsch – schsch. Machst du mit?", ru: "Вода шумит как музыка. Шш – шш. Повторишь?", status: E } }
  ] });
})();
