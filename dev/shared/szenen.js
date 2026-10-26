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
