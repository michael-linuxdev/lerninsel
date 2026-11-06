// Russische Hilfe für die Mathe-Erklärungen und Denkfehler (05.11.2026, Entwurf – noch nicht von Muttersprachlern geprüft;
// Russisch steht nach Entscheidung des Auftraggebers in Spielwelt.ENTWURF_FREI).
// Nur sichtbar, wenn im Elternbereich die Hilfesprache Russisch gewählt ist: unter jeder deutschen Sprechblase steht dann klein die Übersetzung.
// Übersetzt wird über Satz-Skelette: Zahlen werden zu {0}, {1} … und einzelne Zahlwörter in „…“ zu {w}; so passt ein Eintrag zu allen Aufgaben.
// Neue deutsche Sätze in erklaeren.js/fehler.js: Skelett hier ergänzen (tests/mathe-fehler.js meldet fehlende).
// Test-Haken: MatheRu.uebersetze(text), MatheRu.skelett(text), MatheRu.STATUS.
(function (W) {
  const STATUS = { ru: "entwurf" };
  const T = [
    // ---------- Erklär-Einheiten (erklaeren.js) ----------
    ["Das sind {0} Punkte.", "Это {0} точек."],
    ["{0} kommen dazu.", "Добавляется {0}."],
    ["Jetzt sind es {0}. Also {1} + {2} = {3}.", "Теперь их {0}. Значит, {1} + {2} = {3}."],
    ["Jetzt du: Tipp die blauen Punkte an.", "Теперь ты: нажми на синие точки."],
    ["Jetzt rechnest du.", "Теперь считаешь ты."],
    ["Robo zählt bei {0} + {1}: „{2}, {3}, {4}.“ Er sagt {5}. Stimmt das?", "Робо считает {0} + {1}: «{2}, {3}, {4}». Он говорит {5}. Это правильно?"],
    ["Bei der {0} ist Robo schon. {1} weiter: {2}, {3}, {4}. Also {5}.", "На {0} Робо уже стоит. Ещё {1}: {2}, {3}, {4}. Значит, {5}."],
    ["Plus heißt: Es kommt etwas dazu.", "Плюс значит: что-то добавляется."],
    ["Erst die erste Zahl.", "Сначала первое число."],
    ["Dann kommen die anderen dazu.", "Потом добавляются остальные."],
    ["Zum Schluss alle zählen.", "В конце посчитай все."],
    ["{0} + {1} – über die {2}", "{0} + {1} – через {2}"],
    ["{0} sind {1} Zehner und {2} Einzelne.", "{0} – это {1} десятка и {2} единиц."],
    ["{0} machen die {1} voll. Das sind {2}.", "{0} дополняют до {1}. Это {2}."],
    ["Die volle {0} ist ein Zehner. {1} sind noch übrig: {2}.", "Полная {0} – это один десяток. Осталось ещё {1}: {2}."],
    ["Jetzt rechnest du: {0} + {1}. Erst {2} bis zur {3}.", "Теперь считаешь ты: {0} + {1}. Сначала {2} до {3}."],
    ["Robo rechnet: {0} + {1} = {2}. Stimmt das?", "Робо считает: {0} + {1} = {2}. Это правильно?"],
    ["{0} und {1} sind {2}. Das ist ein Zehner mehr. Also {3}.", "{0} и {1} – это {2}. Это на один десяток больше. Значит, {3}."],
    ["Erst die {0} voll machen, dann den Rest.", "Сначала дополни до {0}, потом остаток."],
    ["Erst die {0} voll machen.", "Сначала дополни до {0}."],
    ["Die volle {0} wird ein Zehner.", "Полная {0} становится десятком."],
    ["Dann den Rest dazu.", "Потом добавь остаток."],
    ["{0} − {1} – unter die {2}", "{0} − {1} – через {2}"],
    ["{0} sollen weg. Erst die {1}.", "Нужно убрать {0}. Сначала {1}."],
    ["Jetzt tauschen wir einen Zehner in {0} Einzelne.", "Теперь меняем один десяток на {0} единиц."],
    ["Noch {0} weg. Übrig sind {1}.", "Убираем ещё {0}. Осталось {1}."],
    ["Jetzt du: Tipp {0} rote Punkte weg.", "Теперь ты: убери {0} красных точек."],
    ["Jetzt rechnest du: {0} − {1}. Erst {2} weg, dann bist du bei {3}.", "Теперь считаешь ты: {0} − {1}. Сначала убери {2}, тогда будет {3}."],
    ["Robo rechnet: {0} − {1} = {2}. Er sagt: „{3} − {4} geht nicht, also {5} − {6}.“ Stimmt das?", "Робо считает: {0} − {1} = {2}. Он говорит: «{3} − {4} нельзя, значит {5} − {6}». Это правильно?"],
    ["Umdrehen geht nicht. Tausch einen Zehner: {0} − {1} = {2}. Dann {3} − {4} = {5}. Also {6}.", "Переворачивать нельзя. Разменяй десяток: {0} − {1} = {2}. Потом {3} − {4} = {5}. Значит, {6}."],
    ["Reicht es nicht, tausch einen Zehner in {0} Einzelne.", "Если не хватает, разменяй десяток на {0} единиц."],
    ["Erst die Einzelnen weg.", "Сначала убери единицы."],
    ["Reicht es nicht? Tausch einen Zehner.", "Не хватает? Разменяй десяток."],
    ["Dann den Rest weg.", "Потом убери остаток."],
    ["{0} · {1} heißt: {2}-mal die {3}. Einmal {4}.", "{0} · {1} значит: {2} раза по {3}. Один раз {4}."],
    ["Zweimal {0}: {1}.", "Два раза {0}: {1}."],
    ["Dreimal {0}: {1}. Also {2} · {3} = {4}.", "Три раза {0}: {1}. Значит, {2} · {3} = {4}."],
    ["Jetzt du: Tipp {0}-mal auf ➕.", "Теперь ты: нажми {0} раза на ➕."],
    ["Jetzt rechnest du: {0}-mal die {1}.", "Теперь считаешь ты: {0} раза по {1}."],
    ["Robo rechnet: {0} · {1} = {2}. Stimmt das?", "Робо считает: {0} · {1} = {2}. Это правильно?"],
    ["Robo hat plus gerechnet. {0} · {1} heißt {2}-mal die {3}: {4}, {5}, {6}, {7}. Also {8}.", "Робо сложил. {0} · {1} значит {2} раза по {3}: {4}, {5}, {6}, {7}. Значит, {8}."],
    ["Mal heißt: die gleiche Zahl mehrmals.", "Умножить значит: одно и то же число несколько раз."],
    ["Immer gleich viele.", "Всегда поровну."],
    ["So oft, wie die Zahl sagt.", "Столько раз, сколько говорит число."],
    ["Zähl in Schritten: {0}, {1}, {2}.", "Считай шагами: {0}, {1}, {2}."],
    ["{0} machen die {1} voll.", "{0} дополняют до {1}."],
    ["Robo zählt bei {0} + {1}: „{2}, {3}, {4}, {5}.“ Er sagt {6}. Stimmt das?", "Робо считает {0} + {1}: «{2}, {3}, {4}, {5}». Он говорит {6}. Это правильно?"],
    ["Bei der {0} ist Robo schon. {1} weiter: {2}, {3}, {4}, {5}. Also {6}.", "На {0} Робо уже стоит. Ещё {1}: {2}, {3}, {4}, {5}. Значит, {6}."],
    ["{0} sind ein Zehner und {1} Einzelne.", "{0} – это один десяток и {1} единиц."],
    ["Jetzt tauschen wir den Zehner in {0} Einzelne.", "Теперь меняем десяток на {0} единиц."],
    ["Umdrehen geht nicht. Erst {0} weg, dann bist du bei {1}. Noch {2} weg: {3}.", "Переворачивать нельзя. Сначала убери {0}, тогда будет {1}. Убери ещё {2}: {3}."],
    ["Erst bis zur {0} zurück, dann den Rest weg.", "Сначала назад до {0}, потом убери остаток."],
    ["Reicht es nicht? Tausch den Zehner.", "Не хватает? Разменяй десяток."],
    ["Bis zur {0} muss die {1} voll werden.", "До {0} нужно дополнить {1}."],
    ["{0} Punkte machen die {1} voll.", "{0} точек дополняют до {1}."],
    ["Jetzt sind es {0}. Es fehlen also {1}.", "Теперь их {0}. Значит, не хватало {1}."],
    ["Jetzt du: Mach die {0} voll. Tipp die blauen Punkte an.", "Теперь ты: дополни до {0}. Нажми на синие точки."],
    ["Jetzt rechnest du: Wie viele fehlen bis zur {0}?", "Теперь считаешь ты: сколько не хватает до {0}?"],
    ["{0} und {1} machen die {2} voll. Daraus wird ein Zehner. Also {3}.", "{0} и {1} дополняют до {2}. Из этого получается десяток. Значит, {3}."],
    ["Ergänzen heißt: Wie viele fehlen, bis die {0} voll ist?", "Дополнить значит: сколько не хватает до {0}?"],
    ["Schau, wie viele schon da sind.", "Посмотри, сколько уже есть."],
    ["Füll die {0} auf.", "Дополни до {0}."],
    ["Zähl, wie viele du dazugetan hast.", "Посчитай, сколько ты добавил."],
    ["Wie spät ist es?", "Который час?"],
    ["Die Uhr hat einen kurzen und einen langen Zeiger.", "У часов есть короткая и длинная стрелка."],
    ["Der kurze Zeiger zeigt die Stunde. Hier auf die {0}.", "Короткая стрелка показывает час. Здесь на {0}."],
    ["Der lange Zeiger zeigt nach oben auf die {0}. Das heißt: genau.", "Длинная стрелка показывает вверх на {0}. Это значит: ровно."],
    ["Also ist es genau {0} Uhr.", "Значит, ровно {0} часов."],
    ["Jetzt du: Stell {0} Uhr ein. Tipp auf die Zahl für den kurzen Zeiger.", "Теперь ты: поставь {0} часов. Нажми на число для короткой стрелки."],
    ["Der kurze Zeiger zeigt auf die {0}. Der lange zeigt nach oben.", "Короткая стрелка показывает на {0}. Длинная показывает вверх."],
    ["Es ist ? Uhr.", "Сейчас ? часов."],
    ["Der kurze Zeiger zeigt auf die {0}, der lange nach oben. Robo sagt: „{1} Uhr.“ Stimmt das?", "Короткая стрелка показывает на {0}, длинная вверх. Робо говорит: «{1} часов». Это правильно?"],
    ["Robo hat die Zeiger verwechselt. Der kurze zeigt die Stunde: {0}. Also {1} Uhr.", "Робо перепутал стрелки. Короткая показывает час: {0}. Значит, {1} часов."],
    ["Kurz zeigt die Stunde. Lang oben heißt: genau.", "Короткая показывает час. Длинная вверху значит: ровно."],
    ["Erst den kurzen Zeiger suchen.", "Сначала найди короткую стрелку."],
    ["Lang oben heißt genau, lang unten heißt halb.", "Длинная вверху – ровно, длинная внизу – половина."],
    ["Bei halb ist der kurze schon über die Zahl hinaus.", "В половину короткая уже прошла число."],
    ["Wie viel Geld ist das?", "Сколько здесь денег?"],
    ["Leg die Münzen so: die größte zuerst.", "Положи монеты так: самую большую первой."],
    ["Fang mit der größten an: {0}.", "Начни с самой большой: {0}."],
    ["Dann weiterzählen: {0}, {1}, {2}.", "Потом считай дальше: {0}, {1}, {2}."],
    ["Das sind {0} Cent.", "Это {0} центов."],
    ["Jetzt du: Tipp die Münzen an. Fang mit der größten an.", "Теперь ты: нажми на монеты. Начни с самой большой."],
    ["Jetzt du: {0} Cent, {1} Cent und {2} Cent.", "Теперь ты: {0} центов, {1} центов и {2} центов."],
    ["Das sind ? Cent.", "Это ? центов."],
    ["Robo hat {0}, {1} und {2} Cent. Er zählt: „{3}, {4}, {5} – drei Cent.“ Stimmt das?", "У Робо {0}, {1} и {2} центов. Он считает: «{3}, {4}, {5} – три цента». Это правильно?"],
    ["Robo hat die Münzen gezählt. Jede ist so viel wert, wie draufsteht: {0}, {1}, {2}. Also {3} Cent.", "Робо посчитал монеты. Каждая стоит столько, сколько на ней написано: {0}, {1}, {2}. Значит, {3} центов."],
    ["Mit der größten Münze anfangen und weiterzählen.", "Начни с самой большой монеты и считай дальше."],
    ["Die größte zuerst.", "Самая большая – первой."],
    ["Weiterzählen: {0}, {1}, {2}.", "Считай дальше: {0}, {1}, {2}."],
    ["Wie lang ist der Stift?", "Какой длины карандаш?"],
    ["Der Stift fängt bei der {0} an.", "Карандаш начинается на {0}."],
    ["Er hört bei der {0} auf. Er ist {1} cm lang.", "Он заканчивается на {0}. Его длина {1} см."],
    ["Dieser Stift fängt bei der {0} an.", "Этот карандаш начинается на {0}."],
    ["Von {0} bis {1} sind es {2} Schritte. Er ist {3} cm lang.", "От {0} до {1} – {2} шагов. Его длина {3} см."],
    ["Jetzt du: Tipp die Zentimeter an, von der {0} bis zum Ende.", "Теперь ты: нажимай на сантиметры, от {0} до конца."],
    ["Der Stift fängt bei {0} an und hört bei {1} auf.", "Карандаш начинается на {0} и заканчивается на {1}."],
    ["Er ist ? cm lang.", "Его длина ? см."],
    ["Der Stift fängt bei {0} an und hört bei {1} auf. Robo sagt: „{2} cm.“ Stimmt das?", "Карандаш начинается на {0} и заканчивается на {1}. Робо говорит: «{2} см». Это правильно?"],
    ["Robo hat nur das Ende abgelesen. Von {0} bis {1} sind es {2} Schritte. Also {3} cm.", "Робо посмотрел только на конец. От {0} до {1} – {2} шагов. Значит, {3} см."],
    ["Schau, wo der Stift anfängt. Dann die Schritte zählen.", "Посмотри, где начинается карандаш. Потом считай шаги."],
    ["Wo fängt der Stift an?", "Где начинается карандаш?"],
    ["Zähl die Schritte bis zum Ende.", "Посчитай шаги до конца."],
    ["So viele Zentimeter ist er lang.", "Столько сантиметров его длина."],
    ["Welche Zahl ist das?", "Какое это число?"],
    ["Eine Platte sind {0}. Das ist ein Hunderter.", "Одна пластинка – это {0}. Это сотня."],
    ["Hier sind {0} Hunderter, {1} Zehner und {2} Einzelne.", "Здесь {0} сотни, {1} десятка и {2} единицы."],
    ["Darunter schreiben wir: {0}, {1}, {2}. Das ist {3}.", "Внизу пишем: {0}, {1}, {2}. Это {3}."],
    ["Keine Zehner? Dann steht dort eine {0}: {1}.", "Нет десятков? Тогда там стоит {0}: {1}."],
    ["Jetzt du: Bau die Zahl {0}.", "Теперь ты: составь число {0}."],
    ["Jetzt du: {0} Hunderter, keine Zehner, {1} Einzelne.", "Теперь ты: {0} сотни, нет десятков, {1} единицы."],
    ["Das ist die Zahl ?", "Это число ?"],
    ["Robo sieht {0} Hunderter, keine Zehner und {1} Einzelne. Er schreibt {2}. Stimmt das?", "Робо видит {0} сотни, нет десятков и {1} единицы. Он пишет {2}. Это правильно?"],
    ["Robo hat die Null weggelassen. Die Null zeigt: keine Zehner. Also {0}.", "Робо пропустил ноль. Ноль показывает: десятков нет. Значит, {0}."],
    ["Hunderter, Zehner, Einzelne – und die Null hält den Platz frei.", "Сотни, десятки, единицы – а ноль держит место."],
    ["Erst die Hunderter zählen.", "Сначала посчитай сотни."],
    ["Keine Zehner? Dann eine {0}.", "Нет десятков? Тогда {0}."],
    ["Zum Schluss die Einzelnen: {0}.", "В конце единицы: {0}."],
    ["Runde {0} auf Zehner.", "Округли {0} до десятков."],
    ["{0} liegt zwischen {1} und {2}.", "{0} находится между {1} и {2}."],
    ["Schau auf die letzte Zahl: {0}.", "Посмотри на последнюю цифру: {0}."],
    ["{0} ist näher an {1}.", "{0} ближе к {1}."],
    ["Also ist {0} ungefähr {1}. Ab {2} geht es hoch.", "Значит, {0} – это примерно {1}. С {2} округляем вверх."],
    ["Jetzt du: {0} – welcher Zehner ist näher? Tipp ihn an.", "Теперь ты: {0} – какой десяток ближе? Нажми на него."],
    ["Runde {0} auf Zehner. Bei {1} geht es hoch.", "Округли {0} до десятков. При {1} округляем вверх."],
    ["{0} ist ungefähr ?", "{0} – это примерно ?"],
    ["Robo rundet {0} auf Zehner. Er sagt: {1}. Stimmt das?", "Робо округляет {0} до десятков. Он говорит: {1}. Это правильно?"],
    ["Hinten steht eine {0}. Das ist {1} oder mehr. Darum geht es hoch: {2}.", "В конце стоит {0}. Это {1} или больше. Поэтому вверх: {2}."],
    ["Unter {0} geht es runter, ab {1} geht es hoch.", "Меньше {0} – вниз, с {1} – вверх."],
    ["Zwischen welchen Zehnern liegt die Zahl?", "Между какими десятками находится число?"],
    ["Unter {0}: runter.", "Меньше {0}: вниз."],
    ["Ab {0}: hoch.", "С {0}: вверх."],
    ["Wir wollen {0} Punkte haben.", "Нам нужно {0} точек."],
    ["{0} rote sind schon da.", "{0} красных уже есть."],
    ["Wie viele fehlen bis {0}? Wir legen blaue dazu.", "Сколько не хватает до {0}? Добавляем синие."],
    ["{0} blaue. Also {1} = {2} + {3}.", "{0} синих. Значит, {1} = {2} + {3}."],
    ["Jetzt du: Mach aus {0} die {1}. Tipp die blauen Punkte an.", "Теперь ты: сделай из {0} число {1}. Нажми на синие точки."],
    ["Jetzt du: {0} Punkte. {1} sind rot.", "Теперь ты: {0} точек. {1} красные."],
    ["Robo zählt bei {0} = {1} + ?: „{2}, {3}, {4}, {5}, {6}.“ Er sagt {7}. Stimmt das?", "Робо считает {0} = {1} + ?: «{2}, {3}, {4}, {5}, {6}». Он говорит {7}. Это правильно?"],
    ["Bei der {0} ist Robo schon. Weiter: {1}, {2}, {3}, {4}. Das sind {5} Schritte. Also {6}.", "На {0} Робо уже стоит. Дальше: {1}, {2}, {3}, {4}. Это {5} шага. Значит, {6}."],
    ["Eine Zahl hat zwei Teile: rot und blau.", "У числа две части: красная и синяя."],
    ["Erst die roten zählen.", "Сначала посчитай красные."],
    ["Dann bis zur Zahl auffüllen.", "Потом дополни до числа."],
    ["Die blauen sind der fehlende Teil.", "Синие – это недостающая часть."],
    ["Doppelt heißt: noch einmal genauso viele.", "Удвоить значит: ещё столько же."],
    ["{0} und {1} sind {2}. Das Doppelte von {3} ist {4}.", "{0} и {1} – это {2}. Удвоенное {3} – это {4}."],
    ["Jetzt du: Verdopple die {0}. Tipp die blauen Punkte an.", "Теперь ты: удвой {0}. Нажми на синие точки."],
    ["Jetzt rechnest du: das Doppelte von {0}.", "Теперь считаешь ты: удвоенное {0}."],
    ["Robo hat die {0} mitgezählt. {1} und noch einmal {2} sind {3}.", "Робо посчитал {0} лишний раз. {1} и ещё {2} – это {3}."],
    ["Doppelt heißt: zweimal gleich viele.", "Удвоить значит: два раза поровну."],
    ["Erst einmal.", "Сначала один раз."],
    ["Noch einmal genauso viele.", "Ещё столько же."],
    ["Alle zusammen zählen.", "Посчитай все вместе."],
    ["{0} kommen weg.", "{0} убираем."],
    ["{0} sind übrig. Also {1} − {2} = {3}.", "Осталось {0}. Значит, {1} − {2} = {3}."],
    ["Robo zählt bei {0} − {1}: „{2}, {3}, {4}.“ Er sagt {5}. Stimmt das?", "Робо считает {0} − {1}: «{2}, {3}, {4}». Он говорит {5}. Это правильно?"],
    ["Bei der {0} ist Robo schon. {1} zurück: {2}, {3}, {4}. Also {5}.", "На {0} Робо уже стоит. {1} назад: {2}, {3}, {4}. Значит, {5}."],
    ["Minus heißt: Es geht etwas weg.", "Минус значит: что-то убирается."],
    ["Erst alle zählen.", "Сначала посчитай все."],
    ["Dann kommen welche weg.", "Потом некоторые убираем."],
    ["Zum Schluss die übrigen zählen.", "В конце посчитай оставшиеся."],
    ["Eine Stange hat {0} Punkte. Das ist ein Zehner.", "В одной палочке {0} точек. Это десяток."],
    ["Hier sind {0} Zehner: {1}, {2}, {3}, {4}.", "Здесь {0} десятка: {1}, {2}, {3}, {4}."],
    ["Dazu kommen {0} Einzelne.", "К ним добавляются {0} единиц."],
    ["{0} Zehner und {1} Einzelne: {2}. Man sagt {w}.", "{0} десятка и {1} единиц: {2}. По-немецки говорят {w}."],
    ["Jetzt du: Tipp die {0} blauen Punkte an.", "Теперь ты: нажми на {0} синие точки."],
    ["Jetzt du: {0} Zehner und {1} Einzelne.", "Теперь ты: {0} десятка и {1} единиц."],
    ["Robo sieht {0} Zehner und {1} Einzelne. Er schreibt {2}. Stimmt das?", "Робо видит {0} десятков и {1} единиц. Он пишет {2}. Это правильно?"],
    ["Die Zehner kommen zuerst. {0} Zehner und {1} Einzelne sind {2}. Man sagt {w}.", "Десятки идут первыми. {0} десятков и {1} единицы – это {2}. По-немецки говорят {w}."],
    ["Erst die Zehner schreiben, dann die Einzelnen.", "Сначала пиши десятки, потом единицы."],
    ["Erst die Zehner zählen.", "Сначала посчитай десятки."],
    ["Dann die Einzelnen.", "Потом единицы."],
    ["Zehner zuerst schreiben: {0}.", "Десятки пиши первыми: {0}."],
    ["{0} Punkte. Wir legen Reihen mit {1}.", "{0} точек. Кладём ряды по {1}."],
    ["Eine, zwei, drei Reihen: {0} Punkte.", "Один, два, три ряда: {0} точек."],
    ["{0} bleiben übrig. Für eine Reihe reicht das nicht.", "Осталось {0}. На целый ряд не хватает."],
    ["Also {0} : {1} = {2} Rest {3}.", "Значит, {0} : {1} = {2}, остаток {3}."],
    ["Jetzt du: {0} : {1}. Tipp auf ➕, bis es nicht mehr reicht.", "Теперь ты: {0} : {1}. Нажимай на ➕, пока хватает."],
    ["Jetzt rechnest du: {0} : {1}. Vier Reihen sind {2}.", "Теперь считаешь ты: {0} : {1}. Четыре ряда – это {2}."],
    ["{0} : {1} = {2} Rest ?", "{0} : {1} = {2}, остаток ?"],
    ["Robo teilt {0} durch {1}. Er sagt: „{2} Reihen, Rest {3}.“ Stimmt das?", "Робо делит {0} на {1}. Он говорит: «{2} ряда, остаток {3}». Это правильно?"],
    ["Mit {0} übrig passt noch eine Reihe mit {1} hinein. Richtig sind {2} Reihen und Rest {3}.", "Если осталось {0}, помещается ещё один ряд по {1}. Правильно: {2} ряда и остаток {3}."],
    ["Der Rest ist immer kleiner als eine ganze Reihe.", "Остаток всегда меньше целого ряда."],
    ["Reihen legen.", "Клади ряды."],
    ["Bis keine ganze Reihe mehr passt.", "Пока не перестанет помещаться целый ряд."],
    ["Was übrig ist, ist der Rest.", "Что осталось – это остаток."],
    ["{0} : {1} heißt: Wie oft passt die {2} in die {3}?", "{0} : {1} значит: сколько раз {2} помещается в {3}?"],
    ["Eine Reihe mit {0}. Das sind {1}.", "Один ряд по {0}. Это {1}."],
    ["Noch zwei Reihen: {0}, {1}.", "Ещё два ряда: {0}, {1}."],
    ["Vier Reihen: {0}. Also {1} : {2} = {3}.", "Четыре ряда: {0}. Значит, {1} : {2} = {3}."],
    ["Jetzt du: Tipp auf ➕, bis {0} Punkte da sind.", "Теперь ты: нажимай на ➕, пока не будет {0} точек."],
    ["Jetzt rechnest du: Wie oft passt die {0} in die {1}?", "Теперь считаешь ты: сколько раз {0} помещается в {1}?"],
    ["Robo rechnet: {0} : {1} = {2}. Stimmt das?", "Робо считает: {0} : {1} = {2}. Это правильно?"],
    ["Robo hat minus gerechnet. Wie oft passt die {0} in die {1}? {2}, {3}, {4}, {5}, {6}. Fünfmal. Also {7}.", "Робо вычел. Сколько раз {0} помещается в {1}? {2}, {3}, {4}, {5}, {6}. Пять раз. Значит, {7}."],
    ["Geteilt heißt: Wie oft passt die Zahl hinein?", "Разделить значит: сколько раз число помещается?"],
    ["Erst die große Zahl anschauen.", "Сначала посмотри на большое число."],
    ["Reihen legen, immer gleich viele.", "Клади ряды, всегда поровну."],
    ["Die Reihen zählen: {0}.", "Посчитай ряды: {0}."],
    ["{0} + {1} schriftlich", "{0} + {1} столбиком"],
    ["Schreib die Zahlen genau untereinander.", "Запиши числа точно друг под другом."],
    ["Fang rechts an: {0} + {1} = {2}. Schreib die {3}. Die {4} wandert nach links.", "Начни справа: {0} + {1} = {2}. Запиши {3}. {4} переходит влево."],
    ["{0} + {1} + {2} = {3}. Schreib die {4}. Die {5} wandert weiter.", "{0} + {1} + {2} = {3}. Запиши {4}. {5} переходит дальше."],
    ["{0} + {1} + {2} = {3}. Fertig: {4}.", "{0} + {1} + {2} = {3}. Готово: {4}."],
    ["Rechts steht {0} + {1}. Tipp die blauen Punkte an.", "Справа стоит {0} + {1}. Нажми на синие точки."],
    ["Jetzt rechnest du: {0} + {1}. Rechts: {2} + {3} = {4}.", "Теперь считаешь ты: {0} + {1}. Справа: {2} + {3} = {4}."],
    ["Welche Zahl schreibst du unten rechts hin?", "Какую цифру ты пишешь внизу справа?"],
    ["Robo hat die kleinen Einsen vergessen. {0} + {1} = {2}, {3} + {4} + {5} = {6}, {7} + {8} + {9} = {10}. Also {11}.", "Робо забыл маленькие единички. {0} + {1} = {2}, {3} + {4} + {5} = {6}, {7} + {8} + {9} = {10}. Значит, {11}."],
    ["Rechts anfangen. Bei {0} oder mehr wandert eine {1} nach links.", "Начинай справа. Если {0} или больше, {1} переходит влево."],
    ["Rechts anfangen.", "Начинай справа."],
    ["Bei {0} oder mehr wandert eine {1} nach links.", "Если {0} или больше, {1} переходит влево."],
    ["Die {0} rechnest du mit.", "{0} ты тоже считаешь."],
    ["{0} − {1} schriftlich", "{0} − {1} столбиком"],
    ["Rechts: {0} − {1} geht nicht. Tausch einen Zehner: {2} − {3} = {4}.", "Справа: {0} − {1} нельзя. Разменяй десяток: {2} − {3} = {4}."],
    ["Oben steht jetzt {0}. Tausch einen Hunderter: {1} − {2} = {3}.", "Наверху теперь {0}. Разменяй сотню: {1} − {2} = {3}."],
    ["Oben steht jetzt {0}. {1} − {2} = {3}. Fertig: {4}.", "Наверху теперь {0}. {1} − {2} = {3}. Готово: {4}."],
    ["Rechts: {0} − {1}. Tipp {2} rote Punkte weg.", "Справа: {0} − {1}. Убери {2} красных точек."],
    ["Jetzt rechnest du: {0} − {1}. Rechts: {2} − {3} geht nicht.", "Теперь считаешь ты: {0} − {1}. Справа: {2} − {3} нельзя."],
    ["Robo rechnet: {0} − {1} = {2}. Stimmt das?", "Робо считает: {0} − {1} = {2}. Это правильно?"],
    ["Robo hat {0} − {1} gerechnet. Weg kommt aber die untere {2}. Tausch einen Zehner: {3} − {4} = {5}. Also {6}.", "Робо посчитал {0} − {1}. Но убирать нужно нижнюю {2}. Разменяй десяток: {3} − {4} = {5}. Значит, {6}."],
    ["Rechts anfangen. Reicht es nicht, tausch einen von links.", "Начинай справа. Если не хватает, разменяй один слева."],
    ["Reicht es nicht? Tausch einen von links.", "Не хватает? Разменяй один слева."],
    ["Links ist dann einer weniger.", "Слева тогда на один меньше."],
    ["{0} − {1} schriftlich – mit Ergänzen", "{0} − {1} столбиком – дополнением"],
    ["Rechts: Von {0} bis {1} sind es {2}. Unten links kommt eine kleine {3} dazu.", "Справа: от {0} до {1} – это {2}. Внизу слева добавляется маленькая {3}."],
    ["{0} + {1} = {2}. Von {3} bis {4} sind es {5}. Wieder eine kleine {6}.", "{0} + {1} = {2}. От {3} до {4} – это {5}. Снова маленькая {6}."],
    ["{0} + {1} = {2}. Von {3} bis {4} sind es {5}. Fertig: {6}.", "{0} + {1} = {2}. От {3} до {4} – это {5}. Готово: {6}."],
    ["Von {0} bis {1}: Tipp die blauen Punkte an und zähl mit.", "От {0} до {1}: нажимай на синие точки и считай."],
    ["Jetzt rechnest du: {0} − {1}. Rechts: von {2} bis {3}.", "Теперь считаешь ты: {0} − {1}. Справа: от {2} до {3}."],
    ["Von {0} bis {1} sind es ?", "От {0} до {1} – это ?"],
    ["Robo hat die kleine {0} vergessen. {1} + {2} = {3}, von {4} bis {5} sind es {6}. Also {7}.", "Робо забыл маленькую {0}. {1} + {2} = {3}, от {4} до {5} – это {6}. Значит, {7}."],
    ["Rechts anfangen, von unten nach oben. Über {0}? Unten links eine {1} dazu.", "Начинай справа, снизу вверх. Больше {0}? Внизу слева добавь {1}."],
    ["Rechts anfangen, von unten nach oben.", "Начинай справа, снизу вверх."],
    ["Über {0}? Unten links eine kleine {1} dazu.", "Больше {0}? Внизу слева добавь маленькую {1}."],
    // ---------- Denkfehler (fehler.js): kurze und lange Erklärung, Kontrast-Hilfen ----------
    ["{0} + {1} = {2}. Der Zehner muss mit zu den Zehnern.", "{0} + {1} = {2}. Десяток нужно перенести к десяткам."],
    ["Kommt 10 oder mehr heraus, wandert eine 1 nach links.", "Если получается 10 или больше, 1 переходит влево."],
    ["Kommt {0} oder mehr heraus, wandert eine {1} nach links.", "Если получается {0} или больше, {1} переходит влево."],
    ["Die Zahl, die du dir merkst, kommt links dazu.", "Число, которое ты запомнил, добавляется слева."],
    ["Irgendwo kommt {0} oder mehr heraus.", "Где-то получается {0} или больше."],
    ["{0} und {1} sind {2}.", "{0} и {1} – это {2}."],
    ["Aus {0} Einzelnen machst du einen Zehner. Er wandert nach links.", "Из {0} единиц получается десяток. Он переходит влево."],
    ["Darum: {0} + {1} = {2}.", "Поэтому: {0} + {1} = {2}."],
    ["{0} + {1} ist mehr als {2}: Denk an den Übertrag.", "{0} + {1} больше {2}: не забудь перенос."],
    ["Die kleine {0} zählst du nur einmal.", "Маленькую {0} считай только один раз."],
    ["Du hast einen Zehner zu viel.", "У тебя один лишний десяток."],
    ["Die kleine {0} kommt nur einmal dazu.", "Маленькая {0} добавляется только один раз."],
    ["{0} − {1} geht nicht. Umdrehen darfst du nicht – tausch einen Zehner.", "{0} − {1} нельзя. Переворачивать нельзя – разменяй десяток."],
    ["Oben reicht es nicht? Dann tausch einen von links.", "Наверху не хватает? Тогда разменяй один слева."],
    ["Du hast oben und unten umgedreht.", "Ты поменял верх и низ местами."],
    ["Weg kommt immer die untere Zahl. Reicht es nicht, tauschst du einen Zehner in {0} Einzelne.", "Убирается всегда нижнее число. Если не хватает, разменяй десяток на {0} единиц."],
    ["Darum: {0} − {1} = {2}.", "Поэтому: {0} − {1} = {2}."],
    ["Bei den Einern reicht {0} nicht: tausche einen Zehner in {1} Einer.", "У единиц {0} не хватает: разменяй десяток на {1} единиц."],
    ["Du hast einen Zehner getauscht – dann ist links einer weniger.", "Ты разменял десяток – значит, слева на один меньше."],
    ["Den Zehner hast du dir geholt.", "Десяток ты взял себе."],
    ["Links fehlt er dann. Dort ist einer weniger.", "Слева его тогда нет. Там на один меньше."],
    ["Schau aufs Zeichen: Da steht mal.", "Посмотри на знак: там умножить."],
    ["Schau aufs Zeichen: Da steht plus.", "Посмотри на знак: там плюс."],
    ["Schau aufs Zeichen: Da steht minus.", "Посмотри на знак: там минус."],
    ["Schau aufs Zeichen: Da steht geteilt.", "Посмотри на знак: там разделить."],
    ["Da steht mal, nicht plus.", "Там умножить, а не плюс."],
    ["Da steht plus, nicht minus.", "Там плюс, а не минус."],
    ["Da steht minus, nicht plus.", "Там минус, а не плюс."],
    ["Da steht geteilt, nicht mal.", "Там разделить, а не умножить."],
    ["{0} · {1} heißt: {2}-mal die {3}.", "{0} · {1} значит: {2} раза по {3}."],
    ["Darum: {0} · {1} = {2}.", "Поэтому: {0} · {1} = {2}."],
    ["{0} + {1} heißt: dazutun.", "{0} + {1} значит: добавить."],
    ["{0} − {1} heißt: wegnehmen.", "{0} − {1} значит: убрать."],
    ["Lies zuerst das Rechenzeichen.", "Сначала прочитай знак действия."],
    ["Bei der {0} bist du schon. Zähl ab der {1}.", "На {0} ты уже стоишь. Считай с {1}."],
    ["Du hast die {0} mitgezählt.", "Ты посчитал {0} лишний раз."],
    ["Bei der {0} bist du schon. Der erste Schritt geht zur {1}.", "На {0} ты уже стоишь. Первый шаг – к {1}."],
    ["Darum: {0} − {1} = {2}.", "Поэтому: {0} − {1} = {2}."],
    ["Zähle {0} Schritte – der erste Schritt geht schon weg von der Startzahl.", "Сделай {0} шагов – первый шаг уже уходит от начального числа."],
    ["{0} sind {1} Einzelne, keine Zehner.", "{0} – это {1} единиц, а не десятки."],
    ["Die {0} sind keine Zehner.", "{0} – это не десятки."],
    ["{0} hat {1} Zehner und {2} Einzelne. Die {3} kommt zu den Einzelnen.", "В {0} – {1} десятка и {2} единиц. {3} добавляется к единицам."],
    ["Einer zu den Einern, Zehner zu den Zehnern.", "Единицы к единицам, десятки к десяткам."],
    ["Fast! Ein Schritt zu viel oder zu wenig. Zähl nach: {0}-mal die {1}.", "Почти! На шаг больше или меньше. Пересчитай: {0} раз по {1}."],
    ["Du bist einen Schritt verrutscht.", "Ты сбился на один шаг."],
    ["Zähl in {0}er-Schritten. Dann: {1} · {2} = {3}.", "Считай шагами по {0}. Тогда: {1} · {2} = {3}."],
    ["{0}-mal die {1}: Zähle die Schritte genau.", "{0} раз по {1}: считай шаги точно."],
    ["Mal {0} heißt: keinmal. Da ist nichts. Also {1}.", "Умножить на {0} значит: ни разу. Там ничего нет. Значит, {1}."],
    ["{0}-mal nichts: Da liegt auch nichts.", "{0} раз ничего: там тоже ничего нет."],
    ["Darum: {0} · {1} = {2}. Mit {3} oder jeder anderen Zahl.", "Поэтому: {0} · {1} = {2}. С {3} или любым другим числом."],
    ["Keinmal die {0}: nichts.", "Ни разу {0}: ничего."],
    ["{0}-mal nichts ist nichts.", "{0} раз ничего – это ничего."],
    ["Keinmal die {0}: Da liegt nichts.", "Ни разу {0}: там ничего нет."],
    ["Da steht geteilt, nicht minus. Wie oft passt die Zahl hinein?", "Там разделить, а не минус. Сколько раз число помещается?"],
    ["Da steht geteilt, nicht minus.", "Там разделить, а не минус."],
    ["Zähl in {0}er-Schritten bis {1}. Das geht {2}-mal. Also {3}.", "Считай шагами по {0} до {1}. Это {2} раз. Значит, {3}."],
    ["Wie oft passt die {0} in die {1}? Zähl in {2}er-Schritten.", "Сколько раз {0} помещается в {1}? Считай шагами по {2}."],
    ["Fast! Zähl nach: Wie oft passt die {0} in die {1}?", "Почти! Пересчитай: сколько раз {0} помещается в {1}?"],
    ["Du bist eine Gruppe verrutscht.", "Ты сбился на одну группу."],
    ["Zähl in {0}er-Schritten: {1}, {2}, {3}, {4}, {5}, {6}.", "Считай шагами по {0}: {1}, {2}, {3}, {4}, {5}, {6}."],
    ["Das sind {0} Schritte. Also {1} : {2} = {3}.", "Это {0} шагов. Значит, {1} : {2} = {3}."],
    ["Zähl in {0}er-Schritten bis {1}.", "Считай шагами по {0} до {1}."],
    ["{0} : {1} heißt: {2} in {3} gleiche Teile.", "{0} : {1} значит: {2} на {3} равные части."],
    ["Darum: {0} : {1} = {2}.", "Поэтому: {0} : {1} = {2}."],
    ["Verdreht? Man sagt {w}. Geschrieben kommt die {0} zuerst.", "Перепутал? По-немецки говорят {w}. Но пишется сначала {0}."],
    ["Du hast die Zahl verdreht.", "Ты перепутал цифры местами."],
    ["Wir sagen {w}. Die {0} hört man zuerst.", "По-немецки говорят {w}. {0} слышно первой."],
    ["Geschrieben kommt die {0} zuerst: {1}.", "Пишется сначала {0}: {1}."],
    ["Erst die Zehner hinschreiben, dann die Einer.", "Сначала пиши десятки, потом единицы."],
    ["Der kurze Zeiger zeigt die Stunde, der lange die Minuten.", "Короткая стрелка показывает час, длинная – минуты."],
    ["Du hast die Zeiger verwechselt.", "Ты перепутал стрелки."],
    ["Der kurze Zeiger zeigt die Stunde: {0}.", "Короткая стрелка показывает час: {0}."],
    ["Darum ist es {0} Uhr.", "Поэтому сейчас {0} часов."],
    ["Der kurze Zeiger zeigt die Stunde, der lange die Minuten. Es ist {0}:{1} Uhr, also {2} Uhr.", "Короткая стрелка показывает час, длинная – минуты. Сейчас {0}:{1}, то есть {2} часов."],
    ["Darum ist es halb {0}.", "Поэтому сейчас половина (halb) {0}."],
    ["Der kurze Zeiger zeigt die Stunde, der lange die Minuten. Es ist {0}:{1} Uhr, also halb {2}.", "Короткая стрелка показывает час, длинная – минуты. Сейчас {0}:{1}, по-немецки «halb {2}»."],
    ["Schau genau: Der kurze Zeiger ist schon über die Zahl hinaus.", "Посмотри внимательно: короткая стрелка уже прошла число."],
    ["Schau genau auf den kurzen Zeiger.", "Посмотри внимательно на короткую стрелку."],
    ["Er ist an der {0} vorbei, aber noch nicht bei der {1}.", "Она прошла {0}, но ещё не дошла до {1}."],
    ["Schau genau: Der kurze Zeiger zeigt auf die {0}.", "Посмотри внимательно: короткая стрелка показывает на {0}."],
    ["Er zeigt genau auf die {0}.", "Она показывает точно на {0}."],
    ["Darum ist es Viertel nach {0}.", "Поэтому сейчас четверть после {0} (Viertel nach {0})."],
    ["Der kurze Zeiger zeigt die Stunde, der lange die Minuten. Es ist {0}:{1} Uhr, also Viertel nach {2}.", "Короткая стрелка показывает час, длинная – минуты. Сейчас {0}:{1}, по-немецки «Viertel nach {2}»."],
    ["Darum ist es Viertel vor {0}.", "Поэтому сейчас без четверти {0} (Viertel vor {0})."],
    ["Der kurze Zeiger zeigt die Stunde, der lange die Minuten. Es ist {0}:{1} Uhr, also Viertel vor {2}.", "Короткая стрелка показывает час, длинная – минуты. Сейчас {0}:{1}, по-немецки «Viertel vor {2}»."],
    ["Zähl nicht die Münzen. Zähl, was draufsteht.", "Не считай монеты. Считай, что на них написано."],
    ["Du hast die Münzen gezählt.", "Ты посчитал монеты."],
    ["Jede Münze ist so viel wert, wie draufsteht.", "Каждая монета стоит столько, сколько на ней написано."],
    ["Zusammen: {0} + {1} + {2} = {3}.", "Вместе: {0} + {1} + {2} = {3}."],
    ["Fang mit der größten Münze an und zähl weiter: {0} ct + {1} ct + {2} ct + {3} ct = {4} ct", "Начни с самой большой монеты и считай дальше: {0} ct + {1} ct + {2} ct + {3} ct = {4} ct"],
    ["Der Stift fängt bei {0} an, nicht bei {1}. Zähl die Schritte.", "Карандаш начинается на {0}, а не на {1}. Посчитай шаги."],
    ["Du hast nur das Ende abgelesen.", "Ты посмотрел только на конец."],
    ["Der Stift fängt bei {0} an, nicht bei {1}.", "Карандаш начинается на {0}, а не на {1}."],
    ["Von {0} bis {1} sind es {2} Schritte. Also {3} cm.", "От {0} до {1} – {2} шагов. Значит, {3} см."],
    ["Achtung, der Stift fängt nicht bei {0} an! Wie lang ist er?", "Внимание, карандаш начинается не на {0}! Какой он длины?"],
    ["Der Stift fängt bei {0} an und hört bei {1} auf: {2} − {3} = {4} cm.", "Карандаш начинается на {0} и заканчивается на {1}: {2} − {3} = {4} см."],
    ["{0} Meter sind {1} Zentimeter.", "{0} метра – это {1} сантиметров."],
    ["Ein Meter ist so lang wie {0} Zentimeter.", "Один метр такой же длинный, как {0} сантиметров."],
    ["{0} Meter sind {1}-mal {2}.", "{0} метра – это {1} раза по {2}."],
    ["Also {0} m = {1} cm.", "Значит, {0} м = {1} см."],
    ["{0} m sind {1} cm. {2} m sind {3} cm.", "{0} м – это {1} см. {2} м – это {3} см."],
    ["{0} Kilogramm sind {1} Gramm.", "{0} килограмма – это {1} граммов."],
    ["{0} Kilometer sind {1} Meter.", "{0} километра – это {1} метров."],
    ["Zähl die Nullen genau.", "Посчитай нули точно."],
    ["{0}-mal {1} sind {2}. Also {3} g.", "{0} раза по {1} – это {2}. Значит, {3} г."],
    ["{0}-mal {1} sind {2}. Also {3} m.", "{0} раза по {1} – это {2}. Значит, {3} м."],
    ["Wie viele Gramm sind {0} kg?", "Сколько граммов в {0} кг?"],
    ["Wie viele Meter sind {0} km?", "Сколько метров в {0} км?"],
    ["{0} kg sind {1} g. {2} kg sind {3} g.", "{0} кг – это {1} г. {2} кг – это {3} г."],
    ["{0} km sind {1} m. {2} km sind {3} m.", "{0} км – это {1} м. {2} км – это {3} м."],
    ["Die Null darf nicht fehlen. Sie zeigt: keine Zehner.", "Ноль нельзя пропускать. Он показывает: десятков нет."],
    ["Du hast die Null weggelassen.", "Ты пропустил ноль."],
    ["Das sind {0} Hunderter, {1} Zehner und {2} Einzelne.", "Это {0} сотни, {1} десятков и {2} единиц."],
    ["Die Null hält den Platz frei: {0}.", "Ноль держит место: {0}."],
    ["{0} Hunderter, {1} Zehner und {2} Einer sind {3}.", "{0} сотни, {1} десятков и {2} единиц – это {3}."],
    ["Hinten steht {0}. Ab {1} geht es hoch.", "В конце стоит {0}. С {1} округляем вверх."],
    ["Das ist {0} oder mehr. Dann geht es zum nächsten Zehner hoch.", "Это {0} или больше. Тогда округляем вверх до следующего десятка."],
    ["Darum ist {0} ungefähr {1}.", "Поэтому {0} – это примерно {1}."],
    ["Schau auf die Einer: {0}. Ab {1} wird aufgerundet → {2}.", "Посмотри на единицы: {0}. С {1} округляем вверх → {2}."],
    ["Hinten steht {0}. Unter {1} geht es runter.", "В конце стоит {0}. Меньше {1} – округляем вниз."],
    ["Das ist weniger als {0}. Dann bleibt der Zehner.", "Это меньше {0}. Тогда десяток остаётся."],
    ["Schau auf die Einer: {0}. Unter {1} wird abgerundet → {2}.", "Посмотри на единицы: {0}. Меньше {1} – округляем вниз → {2}."],
    // ---------- Schriftlich mal mehrstellig (06.11.2026) ----------
    ["{0} · {1} schriftlich", "{0} · {1} столбиком"],
    ["Erst malnehmen mit der {0} von der {1}: {2} · {3} = {4}.", "Сначала умножаем на {0} из числа {1}: {2} · {3} = {4}."],
    ["Die {0} sind {1} Zehner. Darum endet die Zeile einen Platz weiter links.", "{0} – это {1} десятка. Поэтому строка кончается на одну клетку левее."],
    ["Dann mit der {0}: {1} · {2} = {3}. Diese Zeile endet ganz rechts.", "Потом на {0}: {1} · {2} = {3}. Эта строка кончается справа."],
    ["Zum Schluss zusammenzählen: {0} + {1} = {2}.", "В конце складываем: {0} + {1} = {2}."],
    ["Jetzt du: Bau die erste Zeile: {0}.", "Теперь ты: составь первую строку: {0}."],
    ["Jetzt rechnest du: {0} · {1}. Erst die Zeile mit der {2}.", "Теперь считаешь ты: {0} · {1}. Сначала строка с {2}."],
    ["Robo hat die erste Zeile nicht eingerückt. Richtig ist {0} + {1} = {2}.", "Робо не сдвинул первую строку. Правильно: {0} + {1} = {2}."],
    ["Jede Zahl unten bekommt eine Zeile. Jede Zeile rückt weiter. Dann zusammenzählen.", "Каждая цифра внизу получает строку. Каждая строка сдвигается. Потом складываем."],
    ["Mit der ersten Zahl malnehmen.", "Умножаем на первую цифру."],
    ["Mit der nächsten Zahl – einen Platz weiter rechts.", "На следующую цифру – на одну клетку правее."],
    ["Die Zeilen zusammenzählen.", "Складываем строки."],
    ["Jede neue Zeile rückt einen Platz weiter nach rechts.", "Каждая новая строка сдвигается на одну клетку вправо."],
    ["Du hast die Zeilen nicht eingerückt.", "Ты не сдвинул строки."],
    ["{0} · {1} heißt hier {2} · {3} = {4}.", "{0} · {1} здесь значит {2} · {3} = {4}."],
    ["Darum: {0} + {1} = {2}.", "Поэтому: {0} + {1} = {2}."],
    ["Darum: {0} + {1} + {2} = {3}.", "Поэтому: {0} + {1} + {2} = {3}."],
    ["Jede Zeile rückt einen Platz weiter nach rechts.", "Каждая строка сдвигается на одну клетку вправо."],
    ["Fast! Schreib nur {0}. Weil die Zeile eingerückt ist, brauchst du die Null nicht.", "Почти! Напиши только {0}. Строка сдвинута, поэтому ноль не нужен."],
    ["Denk an die Zahl, die du dir merkst. Fang rechts an: {0} · {1} = {2}.", "Не забудь число, которое запоминаешь. Начни справа: {0} · {1} = {2}."],
    ["Rechne {0} · {1} von rechts. Fang an mit {2} · {3} = {4}.", "Считай {0} · {1} справа. Начни с {2} · {3} = {4}."],
    ["Die Zeilen sind eingerückt. Rechne {0} + {1}.", "Строки сдвинуты. Считай {0} + {1}."],
    ["Zähl die Zeilen zusammen: {0} + {1}.", "Сложи строки: {0} + {1}."],
    ["Zeig mir deinen Weg! Für jede Zahl unten eine Zeile – dann zusammenzählen.", "Покажи свой путь! Для каждой цифры внизу – строка, потом складываем."],
    ["Richtig! Nächste Zeile – sie endet einen Platz weiter rechts.", "Правильно! Следующая строка – она кончается на одну клетку правее."],
    ["Richtig! Jetzt zählst du die Zeilen zusammen.", "Правильно! Теперь сложи строки."],
    ["Richtig ist {0}. Weiter.", "Правильно: {0}. Дальше."],
    ["Dein Fehler lag beim Zusammenzählen.", "Ошибка была при сложении."],
    ["Dein Fehler lag in der Zeile {0} · {1}.", "Ошибка была в строке {0} · {1}."],
    // ---------- Rahmen der Matheseite (mathe.js) ----------
    ["Fast! Schau mal.", "Почти! Посмотри."],
    ["Fast! Versuch es nochmal.", "Почти! Попробуй ещё раз."],
    ["Das ist neu für dich.", "Это для тебя новое."],
    ["Soll ich es dir erst erklären?", "Объяснить тебе сначала?"],
    ["Das sind schon genug Hunderter. Wir wollen {0}.", "Сотен уже достаточно. Нам нужно {0}."],
    ["Das sind schon genug Zehner. Wir wollen {0}.", "Десятков уже достаточно. Нам нужно {0}."],
    ["Das sind schon genug Einzelne. Wir wollen {0}.", "Единиц уже достаточно. Нам нужно {0}."],
    ["{0} Hunderter, {1} Zehner, {2} Einzelne. Weiter!", "{0} сотни, {1} десятка, {2} единицы. Дальше!"],
    ["{0}. Weiter!", "{0}. Дальше!"],
    ["Das ist {0} Uhr. Wir wollen {1} Uhr. Tipp auf die {2}.", "Это {0} часов. Нам нужно {1} часов. Нажми на {2}."],
    ["Erst die große Münze: {0} Cent.", "Сначала большая монета: {0} центов."],
    ["Geschafft! {0} ist ungefähr {1}.", "Получилось! {0} – это примерно {1}."],
    ["Geschafft! Das ist {0}.", "Получилось! Это {0}."],
    ["Geschafft! Kurz auf der {0}, lang oben: {1} Uhr.", "Получилось! Короткая на {0}, длинная вверху: {1} часов."],
    ["Geschafft! Von {0} bis {1} sind es {2} Schritte: {3} cm.", "Получилось! От {0} до {1} – {2} шагов: {3} см."],
    ["Leer! Wir tauschen einen Zehner in 10 Einzelne.", "Пусто! Меняем десяток на 10 единиц."],
    ["Leer! Wir tauschen einen Zehner in {0} Einzelne.", "Пусто! Меняем десяток на {0} единиц."],
    ["Die {0} ist voll! Daraus wird ein Zehner.", "{0} заполнена! Из неё получается десяток."],
    ["Noch {0} weg.", "Убери ещё {0}."],
    ["Jetzt du – und danach zwei Aufgaben, die genau das üben.", "Теперь ты – а потом два задания, которые тренируют именно это."]
  ];
  // Skelett: Zahlen → #, ein einzelnes Zahlwort in „…“ → § (in der Tabelle als {0}, {1} … und {w} geschrieben; die russische Seite nimmt die Zahlen nach Nummer)
  function zerlege(text) {
    const zahlen = [], worte = [], emos = [];
    const s = String(text).replace(/\s+/g, " ").trim()
      .replace(/„([a-zäöüß]+)“/g, (m) => { worte.push(m); return "§"; })
      .replace(EMO, (m) => { emos.push(m); return "¤"; })
      .replace(/\d+/g, (z) => { zahlen.push(z); return "#"; });
    return { s, zahlen, worte, emos };
  }
  // Emojis (auch zusammengesetzte) sind wie Zahlen Platzhalter: in der Tabelle {e}
  const EMO = /\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic}|\p{Emoji_Modifier})*/gu;
  const schluessel = (de) => de.replace(/\s+/g, " ").trim().replace(/\{w\}/g, "§").replace(/\{e\}/g, "¤").replace(EMO, "¤").replace(/\{\d+\}/g, "#").replace(/\d+/g, "#");   // feste Emojis (➕) stehen im Russischen wörtlich
  const TAB = new Map(T.map(([de, ru]) => [schluessel(de), ru]));
  // Rahmen um einen Hinweis („Fast! … Versuch es nochmal.“) wird abgetrennt und einzeln übersetzt
  const RAHMEN = [[/^Fast! /, "Почти! ", "vorn"], [/ Versuch es nochmal\.$/, " Попробуй ещё раз.", "hinten"]];
  // Satzanfänge mit beliebig langer Rechnung danach (z. B. unterschiedlich viele Münzen): Anfang übersetzen, Rechnung übernehmen
  const ANFAENGE = [["Fang mit der größten Münze an und zähl weiter: ", "Начни с самой большой монеты и считай дальше: "], ["Die Lösung ist ", "Ответ: "]];
  // Lange Hinweise (Lösungshilfen, 07.11.2026) Satz für Satz: nur wenn jeder Satz übersetzt ist, gibt es eine russische Zeile.
  // Satzgrenze = Satzzeichen, Leerraum, dann Großbuchstabe/Zahl/„/( – ohne Lookbehind, das versteht Safari erst ab 16.4 (iPadOS 16.0–16.3 bricht
  // sonst beim Laden der ganzen Datei ab; tests/offline.js prüft alle Dateien darauf).
  const SATZENDE = /[.!?]\s+(?=[A-ZÄÖÜ0-9„(])/g;
  function saetzeVon(text) {
    const aus = []; let von = 0, m; SATZENDE.lastIndex = 0;
    while ((m = SATZENDE.exec(text))) { aus.push(text.slice(von, m.index + 1)); von = m.index + m[0].length; }
    aus.push(text.slice(von));
    return aus;
  }
  function uebersetze(text) {
    if (!text) return "";
    const ganz = einzeln(text);
    if (ganz) return ganz;
    const saetze = saetzeVon(String(text).replace(/\s+/g, " ").trim());
    if (saetze.length < 2) return "";
    // reine Rechnungen („42 : 2 = 21.“, „2 € + 1 € = 3 €“) bleiben stehen; mindestens ein Satz muss Wörter haben
    const nurRechnung = (s) => !/[a-zäöüß]{3}/i.test(s.replace(/\b(cm|mm|km|kg|ml|ct|m|l|g|t)\b/g, ""));
    if (saetze.every(nurRechnung)) return "";
    const ru = saetze.map(s => einzeln(s) || (nurRechnung(s) ? s : ""));
    return ru.every(Boolean) ? ru.join(" ") : "";
  }
  function einzeln(text) {
    if (!text) return "";
    const z = zerlege(text), ru = TAB.get(z.s);
    const reihe = !ru && /^(\d+)er-Reihe: ([\d, ]+)$/.exec(String(text).trim());
    if (reihe) return `Ряд на ${reihe[1]}: ${reihe[2]}`;
    const anf = !ru && ANFAENGE.find(([de]) => String(text).startsWith(de) && !/[a-zäöüß]{3}/i.test(String(text).slice(de.length)));
    if (anf) return anf[1] + String(text).slice(anf[0].length);
    if (!ru) {
      let kern = String(text).replace(/\s+/g, " ").trim(), vorn = "", hinten = "";
      for (const [re, r, wo] of RAHMEN) if (re.test(kern)) { kern = kern.replace(re, ""); if (wo === "vorn") vorn = r; else hinten = r; }
      if ((vorn || hinten) && kern && kern !== text) { const k = einzeln(kern); return k ? vorn + k + hinten : ""; }
      return "";
    }
    return ru.replace(/\{(\d+)\}/g, (_, i) => z.zahlen[+i] !== undefined ? z.zahlen[+i] : "").replace(/\{w\}/g, () => z.worte.shift() || "").replace(/\{e\}/g, () => z.emos.shift() || "");
  }
  // Auf der Matheseite: unter jeder deutschen Sprechblase/Erklärzeile die russische Zeile ergänzen (nur mit Hilfesprache Russisch)
  const ZIELE = ".hilfe .hilfe-t, .hilfe > b, #tafel > p.frage, .erklaer-blase > span, .geschichte span, #warum-t, .denkfehler-karte > p, .hilfe .denkfehler, #rueck, #angebot h2, #angebot .frage";
  function aktiv() { try { const h = W.Spielwelt && W.Spielwelt.hilfe(); return !!(h && h.code === "ru"); } catch (e) { return false; } }
  function auffrischen(wurzel) {
    if (!aktiv()) return;
    (wurzel || document).querySelectorAll(ZIELE).forEach(el => {
      if (el.closest(".hilfe-ru")) return;
      const de = el.textContent;
      if (el.dataset.ruVon === de) return;
      el.dataset.ruVon = de;
      let n = el.nextElementSibling; if (n && n.classList.contains("ru-auf")) n = n.nextElementSibling;   // NA-54: „RU“-Knopf davor überspringen
      if (!(n && n.classList.contains("hilfe-ru"))) n = null;
      const ru = uebersetze(de);
      if (!ru) { if (n) { const b = n.previousElementSibling; if (b && b.classList.contains("ru-auf")) b.remove(); n.remove(); } return; }
      if (!n) { n = document.createElement("small"); n.className = "hilfe-ru"; n.lang = "ru"; n.dataset.emoji = "aus"; el.insertAdjacentElement("afterend", n); }
      n.textContent = ru;
    });
  }
  function beobachte() {
    if (!aktiv() || !W.MutationObserver) return;
    let geplant = false;
    const lauf = () => { geplant = false; auffrischen(); };
    new MutationObserver(() => { if (!geplant) { geplant = true; (W.requestAnimationFrame || setTimeout)(lauf); } })
      .observe(document.body, { childList: true, subtree: true, characterData: true });
    auffrischen();
  }
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", beobachte); else beobachte();
  }
  // weitere Paare (z. B. Aufgabenfragen aus hilfe-ru-fragen.js) nachtragen
  function dazu(paare) { paare.forEach(([de, ru]) => { T.push([de, ru]); TAB.set(schluessel(de), ru); }); }
  // Satzanfänge, nach denen nur noch eine Rechnung beliebiger Länge folgt (z. B. „Zähle Turm für Turm: 3 + 2 + 2 = 7.“)
  function anfaenge(paare) { paare.forEach(p => ANFAENGE.push(p)); }
  W.MatheRu = { uebersetze, skelett: (t) => zerlege(t).s, hat: (t) => TAB.has(zerlege(t).s), STATUS, TABELLE: T, ANFAENGE, auffrischen, dazu, anfaenge };
})(typeof window !== "undefined" ? window : globalThis);
