// Echte-Welt-Aufgaben: jeden Tag eine kurze, freiwillige Aufgabe weg vom Bildschirm (Brücke zwischen Insel und Alltag).
// Ein Erwachsener bestätigt mit der PIN (oder das Kind hakt selbst ab, wenn die Eltern das erlauben).
// Lohn: 1 Stern, ein Lernfund „🌍 Echte Welt“ (Wissensbaum wächst) und ein Eintrag im Wochenbericht.
// Das Zeitsystem zeigt die Aufgabe, wenn die Spielzeit vorbei ist. Keine Pflicht, keine Mahnung.
// Daten: profil.daten.echtewelt = { tag, nr, wechsel, erledigt: { "JJJJ-MM-TT": id } }
(function () {
  const S = window.Spielwelt; if (!S) return;
  // [id, Bereich, Emoji, Text, russischer Text, ab Klasse, nur mit Hilfesprache]
  const IDEEN = [
    ["teller", "mathe", "🍽️", "Deck den Tisch und zähle: Wie viele Teller, Gabeln und Löffel sind es zusammen?", "Накрой на стол и посчитай: сколько всего тарелок, вилок и ложек?", 1],
    ["wechsel", "mathe", "🪙", "Bezahl beim Einkaufen mit und zähl das Wechselgeld nach.", "Заплати в магазине и пересчитай сдачу.", 2],
    ["preise", "mathe", "🏷️", "Such im Prospekt oder Laden zwei Preise. Was ist teurer – und um wie viel?", "Найди две цены. Что дороже и на сколько?", 2],
    ["uhr", "mathe", "🕰️", "Lies heute dreimal die Uhr und sag laut, wie spät es ist.", "Посмотри сегодня три раза на часы и скажи, который час.", 2],
    ["messen", "mathe", "📏", "Miss mit einem Lineal oder Maßband drei Dinge. Was ist am längsten?", "Измерь линейкой три предмета. Что самое длинное?", 2],
    ["backen", "mathe", "🧁", "Hilf beim Backen oder Kochen und miss eine Zutat ab (Löffel, Gramm oder Becher).", "Помоги готовить и отмерь продукт (ложки, граммы или стаканы).", 1],
    ["treppe", "mathe", "🪜", "Zähl die Stufen einer Treppe – hoch in Einerschritten, runter in Zweierschritten.", "Посчитай ступеньки: вверх по одной, вниз по две.", 1],
    ["socken", "mathe", "🧦", "Sortier die Socken zu Paaren. Wie viele Paare sind es? Wie viele Socken?", "Разложи носки по парам. Сколько пар? Сколько носков?", 1],
    ["lineal", "mathe", "✏️", "Zeichne mit dem Lineal ein Rechteck, ein Dreieck und eine 8 cm lange Strecke. Miss nach!", "Нарисуй линейкой прямоугольник, треугольник и отрезок 8 см. Проверь!", 2],
    ["zirkel", "mathe", "⭕", "Zeichne mit einem Erwachsenen einen Kreis mit dem Zirkel. Wo ist der Mittelpunkt? Miss den Radius.", "Нарисуй со взрослым круг циркулем. Где центр? Измерь радиус.", 2],
    ["bauplan", "mathe", "🧱", "Bau mit Bausteinen oder Würfeln ein Gebäude und mal den Bauplan von oben: Wie viele stehen auf jedem Feld?", "Построй из кубиков дом и нарисуй план сверху: сколько кубиков на каждом поле?", 2],
    ["umfrage", "mathe", "📊", "Mach eine kleine Umfrage in der Familie (Lieblingsessen) und führ eine Strichliste.", "Проведи опрос в семье (любимая еда) и отмечай чёрточками.", 2],
    ["wegskizze", "mathe", "🗺️", "Zeichne eine Skizze von deinem Schulweg mit drei wichtigen Punkten. Schätze, wie weit es ungefähr ist.", "Нарисуй схему пути в школу с тремя важными точками. Оцени, какое примерно расстояние.", 4],
    ["rechtslinks", "mathe", "🫲", "Spiel „Rechts oder links?“: Jemand sagt „Rechte Hand aufs linke Knie!“ – du machst es.", "Игра «Право или лево?»: кто-то говорит «Правую руку на левое колено!» – ты делаешь.", 1],
    ["blaetter", "natur", "🍂", "Sammle draußen 5 verschiedene Blätter. Weißt du, von welchen Bäumen sie sind?", "Собери на улице 5 разных листьев. Знаешь, с каких они деревьев?", 1],
    ["vogel", "natur", "🐦", "Beobachte draußen einen Vogel. Wie sieht er aus? Was macht er?", "Понаблюдай за птицей. Как она выглядит? Что она делает?", 1],
    ["wetter", "natur", "🌦️", "Schau morgens aus dem Fenster: Wie ist das Wetter? Passt es zur Wetterstation auf der Insel?", "Посмотри утром в окно: какая погода? Совпадает с метеостанцией на острове?", 1],
    ["himmel", "natur", "☁️", "Leg dich hin und schau 2 Minuten in den Himmel. Welche Formen haben die Wolken?", "Ляг и 2 минуты смотри на небо. На что похожи облака?", 1],
    ["steine", "natur", "🪨", "Finde 3 Steine: einen glatten, einen rauen und einen ganz kleinen.", "Найди 3 камня: гладкий, шершавый и совсем маленький.", 1],
    ["pflanze", "natur", "🪴", "Gieß eine Pflanze und schau sie dir genau an: Wie viele Blätter hat sie?", "Полей растение и рассмотри его: сколько у него листьев?", 1],
    ["versuch", "natur", "🧪", "Mach mit einem Erwachsenen einen kleinen Versuch: Was schwimmt in einer Schüssel Wasser, was geht unter? Erst vermuten, dann ausprobieren.", "Проведи со взрослым маленький опыт: что плавает в миске с водой, а что тонет? Сначала предположи, потом проверь.", 1],
    ["vorlesen", "sprache", "📚", "Lies einem Erwachsenen eine Seite aus einem Buch vor.", "Прочитай взрослому одну страницу из книги.", 1],
    ["einkauf", "sprache", "📝", "Schreib mit einem Erwachsenen einen Einkaufszettel mit 5 Sachen.", "Напиши со взрослым список покупок из 5 вещей.", 2],
    ["schilder", "sprache", "🪧", "Lies unterwegs 5 Schilder oder Wörter, die du siehst.", "Прочитай по дороге 5 вывесок или слов.", 1],
    ["postkarte", "sprache", "💌", "Mal oder schreib eine kleine Karte für jemanden, den du magst.", "Нарисуй или напиши открытку тому, кого ты любишь.", 1],
    ["schreibhaltung", "sprache", "✍️", "Setz dich gerade hin, beide Füße auf den Boden, und halte den Stift locker. Schreib deinen Namen dreimal schön.", "Сядь прямо, обе ноги на полу, держи ручку свободно. Красиво напиши своё имя три раза.", 1],
    ["schreibschrift", "sprache", "🖋️", "Schreib einen kurzen Satz in Schreibschrift in dein Heft – so schön und flüssig, wie du kannst.", "Напиши короткое предложение прописью в тетради — как можно красивее и плавнее.", 2],
    ["bibliothek", "sprache", "🏛️", "Geh mit einem Erwachsenen in eine Bibliothek und leih dir ein Buch aus, das dich interessiert.", "Сходи со взрослым в библиотеку и возьми книгу, которая тебе интересна.", 2],
    ["faltbuch", "sprache", "📒", "Falte aus einem Blatt ein kleines Buch (Leporello) und schreib und mal eine kurze Geschichte hinein.", "Сложи из листа маленькую книжку-гармошку и напиши и нарисуй в ней короткую историю.", 2],
    ["sprachenmappe", "sprache", "📂", "Leg eine Sprachenmappe an: Schreib auf, welche Sprachen du sprichst, und heb deine schönsten Arbeiten auf Englisch darin auf.", "Заведи языковую папку: запиши, на каких языках ты говоришь, и сохрани в ней свои лучшие работы на английском.", 3],
    ["speisekarte", "sprache", "📋", "Gestalte eine kleine Speisekarte auf Englisch für ein Familienessen – mit Bildern und Preisen.", "Нарисуй маленькое меню на английском для семейного обеда — с картинками и ценами.", 4],
    ["wort-oma", "mutter", "👵", "Frag Oma, Opa oder Mama: Wie heißt ein Lieblingswort von dir in eurer Familiensprache?", "Спроси бабушку, дедушку или маму: как называется твоё любимое слово на вашем родном языке?", 1, true],
    ["lied", "mutter", "🎵", "Sing mit jemandem aus deiner Familie ein Lied in eurer Familiensprache.", "Спой с кем-нибудь из семьи песню на родном языке.", 1, true],
    ["uebersetzen", "mutter", "🌍", "Bring einem Erwachsenen 3 Wörter aus deiner Familiensprache bei – du bist die Lehrerin oder der Lehrer!", "Научи взрослого трём словам на твоём родном языке – ты учитель!", 1, true],
    ["helfen", "helfen", "🧺", "Hilf beim Aufräumen oder Wäsche falten – ganz ohne Erinnerung.", "Помоги убрать или сложить бельё – без напоминаний.", 1],
    ["tier-futter", "helfen", "🐾", "Hilf, ein Tier zu versorgen (eigenes, von Nachbarn oder Vögel im Winter).", "Помоги ухаживать за животным.", 1],
    ["frage", "helfen", "❓", "Frag jemanden aus deiner Familie: Was hast du als Kind am liebsten gespielt?", "Спроси кого-нибудь из семьи: во что ты любил(а) играть в детстве?", 1],
    ["hoehle", "bewegung", "🏕️", "Bau eine Höhle aus Decken und Kissen.", "Построй шалаш из одеял и подушек.", 1],
    ["huepfen", "bewegung", "🐸", "Spring 20-mal Seil oder hüpf 20-mal wie ein Frosch.", "Прыгни 20 раз через скакалку или как лягушка.", 1],
    ["fangen", "bewegung", "🏃", "Spiel draußen Fangen oder Verstecken.", "Поиграй на улице в догонялки или прятки.", 1],
    ["balance", "bewegung", "🦩", "Steh auf einem Bein und zähl bis 20 – dann das andere Bein.", "Постой на одной ноге и досчитай до 20 – потом на другой.", 1],
    ["radfahren", "bewegung", "🚲", "Üb mit einem Erwachsenen auf einem ruhigen Platz: anfahren, einhändig fahren für das Handzeichen, umschauen, sicher bremsen. Helm auf!", "Потренируйся со взрослым на тихой площадке: трогаться, ехать одной рукой для знака, оглядываться, уверенно тормозить. Надень шлем!", 3],
    ["turm", "bewegung", "🧱", "Bau den höchsten Turm, den du schaffst – mit Bausteinen, Büchern oder Bechern.", "Построй самую высокую башню, какую сможешь.", 1],
    ["gefuehl", "gefuehle", "😊", "Erzähl jemandem: Was hat dich heute froh gemacht?", "Расскажи кому-нибудь: что тебя сегодня порадовало?", 1],
    ["danke", "gefuehle", "🙏", "Sag heute zu drei Menschen ganz bewusst „Danke“.", "Скажи сегодня трём людям «спасибо».", 1],
    ["malen", "gefuehle", "🎨", "Mal ein Bild von deinem Tier oder deiner Welt auf der Insel.", "Нарисуй своего питомца или свой мир на острове.", 1]
  ];
  const BEREICH = { mathe: "Rechnen im Alltag", natur: "Natur", sprache: "Lesen und Schreiben", mutter: "Familiensprache", helfen: "Helfen und Fragen", bewegung: "Bewegung", gefuehle: "Gefühle und Freude" };
  const pad = (n) => String(n).padStart(2, "0");
  const heute = () => { if (window.__heute) return window.__heute; const d = window.__jetzt ? new Date(window.__jetzt) : new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const lade = () => Object.assign({ erledigt: {} }, S.lade("echtewelt") || {});
  const passend = () => { const k = S.kind(); return IDEEN.filter(i => (i[5] || 1) <= (k.klasse || 2) && (!i[6] || S.hilfe())); };
  function zahl(seed) { let h = 2166136261; for (const c of seed) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function idee(i) { return i ? { id: i[0], bereich: i[1], bereichName: BEREICH[i[1]], e: i[2], text: i[3], ru: i[4] } : null; }
  // Heutige Idee (gleich für den ganzen Tag, „Andere Idee“ blättert weiter, höchstens 2-mal)
  function heutige() {
    const d = lade(), h = heute(), liste = passend(); if (!liste.length) return null;
    if (d.tag !== h) { d.tag = h; d.nr = zahl(h + "|" + (S.profil.name || "")) % liste.length; d.wechsel = 0; S.speichere("echtewelt", d); }
    return Object.assign(idee(liste[d.nr % liste.length]), { erledigt: d.erledigt[h] === liste[d.nr % liste.length][0], wechselUebrig: 2 - (d.wechsel || 0) });
  }
  function andere() {
    const d = lade(), liste = passend(); if ((d.wechsel || 0) >= 2 || d.erledigt[heute()]) return heutige();
    d.nr = (d.nr + 1 + Math.floor(liste.length / 3)) % liste.length; d.wechsel = (d.wechsel || 0) + 1; S.speichere("echtewelt", d); return heutige();
  }
  const selbstAbhaken = () => !!(((S.lade("eltern") || {}).echtewelt || {}).selbst);
  function geschafft() {
    const a = heutige(); if (!a || a.erledigt) return false;
    const d = lade(); d.erledigt[heute()] = a.id;
    const tage = Object.keys(d.erledigt).sort(); while (tage.length > 60) delete d.erledigt[tage.shift()];
    S.speichere("echtewelt", d);
    S.gibSterne(1);
    if (window.Lernfunde) window.Lernfunde.merke({ fach: "welt", art: "welt", e: a.e, text: `Echte Welt: ${a.text.split(/[.?!–]/)[0]}`, schluessel: "ew:" + a.id });
    if (window.Familie) window.Familie.merke("welt", a.text);
    return true;
  }
  window.EchteWelt = { IDEEN, BEREICH, heutige, andere, geschafft, selbstAbhaken };
})();
