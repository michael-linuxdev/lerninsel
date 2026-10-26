// Texte der Story- und Tutorial-Szenen (NA-11 ff.). Nur Daten: die Insel ergänzt Zeigehand und „warten auf“.
// So kann die Inselchronik (Album, NA-18) jede Szene auch ohne Insel noch einmal abspielen.
// Jede Blase: { wer, text: { de, ru, …, status: { ru: "entwurf" } }, alt?: { tippen: {…} } }
// Neue Übersetzungen bleiben "entwurf", bis ein Muttersprachler sie geprüft hat (docs/SPRACHEN.md); Entwürfe erscheinen nur in /dev.
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
