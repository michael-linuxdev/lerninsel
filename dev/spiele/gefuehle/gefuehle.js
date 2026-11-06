// Gefühle und Bewegung mit Bärin Bruni (PLAN 8b): ohne Bewertung, ohne „falsche“ Gefühle, alles bleibt auf dem Tablet.
// - Wie geht's dir? Gefühls-Barometer (freiwillig, einmal am Tag; Eltern sehen es nur, wenn das Kind es erlaubt)
// - Ruhig werden: Ballon-Atmen, Schildkröte, Wut-Ballon
// - Gefühle erkennen: Situationen und Gefühls-Wörter (Deutsch und Hilfesprache)
// - Bewegungs-Minute: 4 Übungen zum Mitmachen, das Kind hakt selbst ab (keine Kamera)
// Daten: profil.daten.gefuehle = { tage: { "JJJJ-MM-TT": id }, teilen, bewegung: { "JJJJ-MM-TT": Minuten } }
(function () {
  const S = window.Spielwelt, C = window.Charakter, SP = window.Sprache, $ = (id) => document.getElementById(id);
  const name = S.profil.name || "du";
  const pad = (n) => String(n).padStart(2, "0");
  const heute = () => { const d = window.__jetzt ? new Date(window.__jetzt) : new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const lade = () => Object.assign({ tage: {}, teilen: false, bewegung: {} }, S.lade("gefuehle") || {});
  const speichere = (d) => S.speichere("gefuehle", d);
  const ru = (t) => S.paar(["", t])[1];
  // russische Zeile (Entwurf) unter einem deutschen Text: nur mit Hilfesprache, vorlesbar über shared/sprache.js (.ru)
  const ruP = (t, k = "p") => (ru(t) ? `<${k} class="ru" lang="ru">${S.esc(t)}</${k}>` : "");
  const setzeRu = (el, t) => { if (!el) return; let n = el.nextElementSibling; if (n && n.classList.contains("ru-auf")) n = n.nextElementSibling; if (!(n && n.classList.contains("ru"))) { n = document.createElement("p"); n.className = "ru"; n.lang = "ru"; el.insertAdjacentElement("afterend", n); } n.textContent = ru(t) || ""; n.hidden = !n.textContent; };
  // feste Sätze mit russischem Entwurf als Paare [deutsch, russisch] (so zeigt die Prüfliste beide)
  const T_ERK = ["Gefühle sind nie falsch. Es hilft, sie zu erkennen und zu benennen – bei dir und bei anderen.", "Чувства никогда не бывают неправильными. Полезно их замечать и называть – у себя и у других."];
  const T_BEW = ["Eine ganze Bewegungs-Minute geschafft. Dein Körper sagt Danke!", "Целая минута движения! Твоё тело говорит спасибо!"];
  const sprich = (t) => { if (SP && SP.sprich) SP.sprich(t, "de-DE"); };

  // [id, Emoji, Name, russisch, Bruni sagt …, Bruni sagt (russisch, Entwurf 10.11.2026)]
  const GEFUEHLE = [
    ["froh", "😊", "froh", "радостно", "Wie schön! Was hat dich froh gemacht? Erzähl es jemandem – dann freut ihr euch zu zweit.", "Как здорово! Что тебя обрадовало? Расскажи кому-нибудь – тогда вы порадуетесь вдвоём."],
    ["ruhig", "😌", "ruhig", "спокойно", "Ruhig sein ist ein gutes Gefühl. Genieß es!", "Быть спокойным – хорошее чувство. Наслаждайся!"],
    ["muede", "🥱", "müde", "устало", "Müde sein ist okay. Vielleicht hilft eine kleine Pause, ein Glas Wasser oder frische Luft.", "Устать – это нормально. Может, помогут маленький перерыв, стакан воды или свежий воздух."],
    ["traurig", "😢", "traurig", "грустно", "Traurig sein gehört dazu. Erzähl einem Erwachsenen, dem du vertraust, was los ist. Eine Umarmung hilft oft.", "Грустить – это тоже часть жизни. Расскажи взрослому, которому ты доверяешь, что случилось. Объятия часто помогают."],
    ["wuetend", "😠", "wütend", "сердито", "Wut ist ein starkes Gefühl. Probier den Wut-Ballon oder atme tief wie ein Ballon. Danach kannst du darüber reden.", "Злость – сильное чувство. Попробуй «шарик злости» или подыши глубоко, как шарик. Потом можно об этом поговорить."],
    ["aengstlich", "😟", "ängstlich", "тревожно", "Wenn du Angst hast, sag es einem Erwachsenen. Ballon-Atmen kann helfen, ruhiger zu werden.", "Если тебе страшно, скажи об этом взрослому. Дыхание «шарик» поможет успокоиться."],
    ["aufgeregt", "🤩", "aufgeregt", "взволнованно", "Aufgeregt – vielleicht passiert bald etwas Spannendes? Atme einmal tief durch.", "Волнуешься – может, скоро будет что-то интересное? Сделай глубокий вдох."]
  ];
  const G = Object.fromEntries(GEFUEHLE.map(g => [g[0], g]));
  if (window.Figuren) document.querySelectorAll(".bruni").forEach(el => { el.innerHTML = window.Figuren.baer(""); });

  function zeige(n) { ["start", "barometer", "ruhe", "atmen", "schildkroete", "wut", "erkennen", "bewegen", "miteinander"].forEach(v => { $(v + "-ansicht").hidden = v !== n; }); scrollTo(0, 0); if (SP && SP.stopp) SP.stopp(); }
  document.querySelectorAll("[data-zu]").forEach(b => b.addEventListener("click", () => { S.ton("tipp"); stoppe(); zeige(b.dataset.zu); if (b.dataset.zu === "start") start(); }));
  let laeufer = [];
  const stoppe = () => { laeufer.forEach(clearInterval); laeufer.forEach(clearTimeout); laeufer = []; };

  // ---------- Start ----------
  function start() {
    const d = lade(), g = G[d.tage[heute()]];
    $("bruni-text").textContent = g ? `Hallo ${name}! Heute fühlst du dich ${g[2]}. Schön, dass du da bist.` : `Hallo ${name}! Ich bin Bärin Bruni. Bei mir geht es um Gefühle – und ums Bewegen. Wie geht's dir heute?`;
    $("bruni-ru").textContent = ru("Привет! Я медведица Бруни. У меня – про чувства и движение."); $("bruni-ru").hidden = !$("bruni-ru").textContent;
  }

  // ---------- Barometer ----------
  function barometer() {
    const d = lade();
    $("faces").innerHTML = GEFUEHLE.map(([id, e, n, r]) => `<button class="face ${d.tage[heute()] === id ? "an" : ""}" data-g="${id}"><span class="e">${e}</span>${n}${ru(r) ? `<small lang="ru">${r}</small>` : ""}</button>`).join("");
    $("antwort").hidden = true;
    const tage = Object.keys(d.tage).sort().slice(-7);
    $("verlauf").innerHTML = tage.length ? `<p class="klein">Deine letzten Tage:</p><div class="verlauf">${tage.map(t => `<span title="${t}">${(G[d.tage[t]] || ["", "❔"])[1]}<small>${t.slice(8)}.${t.slice(5, 7)}.</small></span>`).join("")}</div>` : "";
    $("teilen").checked = !!d.teilen;
  }
  $("faces").addEventListener("click", e => {
    const b = e.target.closest(".face"); if (!b) return;
    const d = lade(); d.tage[heute()] = b.dataset.g; const k = Object.keys(d.tage).sort(); while (k.length > 60) delete d.tage[k.shift()]; speichere(d);
    const g = G[b.dataset.g]; S.ton("tipp");
    document.querySelectorAll(".face").forEach(x => x.classList.toggle("an", x === b));
    $("antwort").hidden = false; $("antwort-text").textContent = g[4]; setzeRu($("antwort-text"), g[5]); sprich(g[4]);
    $("antwort-knoepfe").innerHTML = ["traurig", "wuetend", "aengstlich", "aufgeregt"].includes(g[0]) ? `<button class="knopf haupt" data-zu="ruhe">🌬️ Ruhig werden</button>` : g[0] === "muede" ? `<button class="knopf haupt" data-zu="bewegen">🤸 Bewegungs-Minute</button>` : "";
    $("hilfe-kurz").hidden = !["traurig", "aengstlich", "wuetend"].includes(g[0]);   // Vertrauenspersonen und Nummer gegen Kummer (116 111)
    $("antwort-knoepfe").querySelectorAll("[data-zu]").forEach(x => x.addEventListener("click", () => { zeige(x.dataset.zu); if (x.dataset.zu === "bewegen") bewegen(); }));
  });
  { const hv = $("hilfe-vorlesen"); if (hv) hv.addEventListener("click", () => { if (SP) { SP.knopf && SP.knopf(); SP.sprich($("hilfe-karte").innerText.replace(/[🤝📞]/gu, "").replace("116 111", "1 1 6 1 1 1").replace(/Vorlesen$/, "")); } }); }
  $("teilen").addEventListener("change", () => { const d = lade(); d.teilen = $("teilen").checked; speichere(d); S.ton("tipp"); });

  // ---------- Ballon-Atmen ----------
  function atmen() {
    stoppe(); let runde = 0; const RUNDEN = 5, ball = $("ballon"), txt = $("atem-text");
    const schritt = (phase) => {
      if (runde >= RUNDEN) { txt.textContent = "Super! Spürst du, wie du ruhiger bist?"; setzeRu(txt, "Супер! Чувствуешь, как ты успокоился?"); ball.style.transform = "scale(.6)"; fertigUebung("atmen"); return; }
      if (phase === 0) { txt.textContent = "Einatmen … 1 … 2 … 3 … 4"; setzeRu(txt, "Вдох … 1 … 2 … 3 … 4"); ball.style.transition = "transform 4s ease-in-out"; ball.style.transform = "scale(1.25)"; sprich("Einatmen"); laeufer.push(setTimeout(() => schritt(1), 4200)); }
      else { txt.textContent = "Ausatmen … 1 … 2 … 3 … 4"; setzeRu(txt, "Выдох … 1 … 2 … 3 … 4"); ball.style.transition = "transform 4s ease-in-out"; ball.style.transform = "scale(.6)"; sprich("Ausatmen"); laeufer.push(setTimeout(() => { runde++; $("atem-runde").textContent = `${Math.min(runde + 1, RUNDEN)} / ${RUNDEN}`; schritt(0); }, 4200)); }
    };
    ball.style.transition = "none"; ball.style.transform = "scale(.6)"; $("atem-runde").textContent = `1 / ${RUNDEN}`; txt.textContent = "Mach es dir bequem …"; setzeRu(txt, "Устройся поудобнее …");
    laeufer.push(setTimeout(() => schritt(0), 1200));
  }
  // ---------- Schildkröte ----------
  function schildkroete() {
    stoppe(); let runde = 0; const t = $("schild-text"), k = $("schild");
    const los = () => {
      if (runde >= 3) { t.textContent = "Toll! Die Schildkröte ist ganz ruhig geworden – und du?"; setzeRu(t, "Отлично! Черепаха совсем успокоилась – а ты?"); k.textContent = "\uE107"; fertigUebung("schildkroete"); return; }
      let n = 5; k.textContent = "🥚"; k.classList.add("klein"); t.textContent = "Zieh dich zusammen wie eine Schildkröte in ihrem Panzer … zähl langsam mit: 5"; setzeRu(t, "Сожмись, как черепаха в панцире … считай медленно: 5"); sprich("Zieh dich zusammen wie eine Schildkröte");
      const iv = setInterval(() => { n--; if (n > 0) { t.textContent = `… ${n}`; setzeRu(t, `… ${n}`); } else { clearInterval(iv); k.textContent = "\uE107"; k.classList.remove("klein"); t.textContent = "Und jetzt langsam wieder herauskommen und strecken!"; setzeRu(t, "А теперь медленно вылезай и потянись!"); runde++; laeufer.push(setTimeout(los, 3500)); } }, 1200);
      laeufer.push(iv);
    };
    k.textContent = "\uE107"; t.textContent = "Die Schildkröte hilft dir, wenn alles zu viel ist."; setzeRu(t, "Черепаха поможет тебе, когда всего слишком много."); laeufer.push(setTimeout(los, 1500));
  }
  // ---------- Wut-Ballon ----------
  let wutGroesse = 0.4, pustet = false, platzt = 0;
  function wut() { stoppe(); wutGroesse = 0.4; platzt = 0; $("wut-ballon").style.transform = `scale(${wutGroesse})`; $("wut-text").textContent = "Halte den Knopf gedrückt und puste deine Wut in den Ballon!"; setzeRu($("wut-text"), "Держи кнопку и выдувай свою злость в шарик!"); }
  const wk = $("wut-knopf");
  let ablassen = null;
  wk.addEventListener("pointerdown", e => { e.preventDefault(); clearInterval(ablassen); pustet = true; });
  ["pointerup", "pointerleave", "pointercancel"].forEach(ev => wk.addEventListener(ev, () => {
    if (!pustet) return; pustet = false;
    if (wutGroesse <= 1.1) { $("wut-text").textContent = "Noch ein bisschen länger pusten – halte den Knopf gedrückt!"; setzeRu($("wut-text"), "Подуй ещё немного – держи кнопку!"); return; }
    { platzt++; $("wut-text").textContent = platzt >= 3 ? "Pfffff … die Wut ist weggeflogen. Wie fühlst du dich jetzt?" : "Pfffff … lass die Luft ganz langsam raus. Nochmal?"; setzeRu($("wut-text"), platzt >= 3 ? "Пффф … злость улетела. Как ты себя теперь чувствуешь?" : "Пффф … выпускай воздух очень медленно. Ещё раз?"); S.ton("juhu"); ablassen = setInterval(() => { wutGroesse = Math.max(0.4, wutGroesse - 0.03); $("wut-ballon").style.transform = `scale(${wutGroesse})`; if (wutGroesse <= 0.4) clearInterval(ablassen); }, 60); if (platzt >= 3) fertigUebung("wut"); }
  }));
  setInterval(() => { if (pustet) { wutGroesse = Math.min(1.5, wutGroesse + 0.02); $("wut-ballon").style.transform = `scale(${wutGroesse})`; if (wutGroesse > 1.1 && $("wut-text").textContent !== "Jetzt loslassen!") { $("wut-text").textContent = "Jetzt loslassen!"; setzeRu($("wut-text"), "Теперь отпускай!"); } } }, 50);
  function fertigUebung(art) { const d = lade(); d.ruhe = (d.ruhe || 0) + 1; speichere(d); if (C && C.gib) C.gib("sachkunde", 2); }

  // ---------- Gefühle erkennen ----------
  const LAGEN = [
    ["🎂", "Heute hast du Geburtstag und alle singen für dich.", "Сегодня твой день рождения, и все поют для тебя.", "froh"],
    ["🧸", "Dein Lieblings-Kuscheltier ist verloren gegangen.", "Твоя любимая мягкая игрушка потерялась.", "traurig"],
    ["🧱", "Jemand macht deinen hohen Turm einfach kaputt.", "Кто-то просто сломал твою высокую башню.", "wuetend"],
    ["🌩️", "Draußen donnert es ganz laut und du bist allein im Zimmer.", "На улице гремит гром, а ты один в комнате.", "aengstlich"],
    ["🎢", "Morgen fahrt ihr in den Freizeitpark!", "Завтра вы поедете в парк развлечений!", "aufgeregt"],
    ["🛌", "Du hast bis spät abends gespielt und musst früh aufstehen.", "Ты играл допоздна, а вставать рано.", "muede"],
    ["📖", "Du liegst gemütlich auf dem Sofa und jemand liest dir vor.", "Ты уютно лежишь на диване, и тебе читают.", "ruhig"],
    ["🐶", "Ein großer Hund bellt dich laut an.", "Большая собака громко лает на тебя.", "aengstlich"],
    ["🏆", "Du hast etwas Schweres endlich geschafft!", "У тебя наконец получилось что-то трудное!", "froh"],
    ["👋", "Deine beste Freundin zieht in eine andere Stadt.", "Твоя лучшая подруга переезжает в другой город.", "traurig"],
    ["🚫", "Du darfst nicht mitspielen, obwohl du gern möchtest.", "Тебе не дают играть, хотя ты очень хочешь.", "traurig"],
    ["🎁", "Gleich darfst du ein großes Geschenk auspacken.", "Сейчас ты распакуешь большой подарок.", "aufgeregt"]
  ];
  let erk = null;
  function erkennen() {
    const runden = LAGEN.slice().sort(() => Math.random() - 0.5).slice(0, 6);
    erk = { runden, pos: 0 }; frage();
  }
  function frage() {
    if (erk.pos >= erk.runden.length) {
      $("erk-karte").innerHTML = `<div class="gross">🌈</div><h2>Toll gemacht!</h2><p>${T_ERK[0]}</p>${ruP(T_ERK[1])}<button class="knopf haupt" data-zu="start">Zurück zu Bruni</button>`;
      $("erk-karte").querySelector("[data-zu]").addEventListener("click", () => { zeige("start"); start(); });
      if (window.Lernfunde) Lernfunde.merke({ fach: "sachkunde", art: "gefuehle", e: "🎭", text: "Gefühle erkennen: froh, traurig, wütend, ängstlich, aufgeregt …", ru: "радостно, грустно, сердито, тревожно, взволнованно", schluessel: "gefuehle" });
      S.ton("juhu"); return;
    }
    const [e, de, r, ziel] = erk.runden[erk.pos];
    const opts = [ziel, ...GEFUEHLE.map(g => g[0]).filter(x => x !== ziel).sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);
    $("erk-karte").innerHTML = `<p class="klein">${erk.pos + 1} von ${erk.runden.length}</p><div class="gross">${e}</div><p class="lage"></p>${ru(r) ? `<p class="lage-ru" lang="ru"></p>` : ""}
      <p><b>Wie fühlt sich das Kind wohl?</b></p>${ruP("Что, наверное, чувствует ребёнок?")}<div class="faces">${opts.map(id => `<button class="face" data-g="${id}"><span class="e">${G[id][1]}</span>${G[id][2]}${ru(G[id][3]) ? `<small lang="ru">${G[id][3]}</small>` : ""}</button>`).join("")}</div><p class="erk-antwort" id="erk-antwort"></p>`;
    $("erk-karte").querySelector(".lage").textContent = de; if (ru(r)) $("erk-karte").querySelector(".lage-ru").textContent = r;
    sprich(de);
    let fertig = false;
    $("erk-karte").querySelectorAll(".face").forEach(b => b.addEventListener("click", () => {
      if (fertig) return; fertig = true;
      const g = b.dataset.g;
      b.classList.add("an");
      $("erk-antwort").textContent = g === ziel ? `Ja! Viele Kinder fühlen sich dann ${G[ziel][2]}.` : `Das kann auch sein! Viele Kinder fühlen sich dann eher ${G[ziel][2]}. Jeder fühlt ein bisschen anders.`;
      setzeRu($("erk-antwort"), g === ziel ? `Да! Многим детям тогда ${G[ziel][3]}.` : `Так тоже может быть! Многим детям тогда скорее ${G[ziel][3]}. Каждый чувствует немного по-своему.`);
      S.ton(g === ziel ? "juhu" : "tipp"); if (C && C.gib) C.gib("sachkunde", 1);
      laeufer.push(setTimeout(() => { erk.pos++; frage(); }, 2600));
    }));
  }

  // ---------- Bewegungs-Minute ----------
  const UEBUNGEN = [
    ["🦘", "Hüpf wie ein Känguru – 10-mal!", "Прыгай, как кенгуру – 10 раз!"], ["⭐", "Mach 10 Hampelmänner wie Fipsi!", "Сделай 10 прыжков «звёздочкой», как Фипси!"], ["🦩", "Steh auf einem Bein wie ein Flamingo.", "Постой на одной ноге, как фламинго."], ["🐻", "Lauf wie ein Bär auf allen vieren durchs Zimmer.", "Пройди по комнате на четвереньках, как медведь."],
    ["🌳", "Werde ein Baum: Arme hoch und ganz groß machen.", "Стань деревом: руки вверх, вытянись высоко-высоко."], ["🐸", "Spring wie ein Frosch – 5-mal!", "Прыгай, как лягушка – 5 раз!"], ["💃", "Tanz, als ob niemand zuschaut!", "Танцуй, как будто никто не смотрит!"], ["🐢", "Geh ganz langsam wie eine Schildkröte.", "Иди очень медленно, как черепаха."],
    ["🙆", "Streck dich zur Decke, dann berühr deine Zehen.", "Потянись к потолку, потом дотронься до пальцев ног."], ["🏃", "Lauf auf der Stelle, so schnell du kannst!", "Беги на месте как можно быстрее!"], ["🐱", "Mach einen Katzenbuckel – und dann ein Hohlkreuz.", "Выгни спину, как кошка, – а потом прогнись."], ["👏", "Klatsch 10-mal über dem Kopf.", "Хлопни 10 раз над головой."]
  ];
  let bew = null;
  function bewegen() {
    stoppe(); bew = { liste: UEBUNGEN.slice().sort(() => Math.random() - 0.5).slice(0, 4), pos: 0 }; uebung();
  }
  function uebung() {
    if (bew.pos >= bew.liste.length) {
      const d = lade(); d.bewegung[heute()] = (d.bewegung[heute()] || 0) + 1; const k = Object.keys(d.bewegung).sort(); while (k.length > 60) delete d.bewegung[k.shift()]; speichere(d);
      $("bew-karte").innerHTML = `<div class="gross">💪</div><h2>Super bewegt!</h2><p>${T_BEW[0]}</p>${ruP(T_BEW[1])}<button class="knopf haupt" id="bew-nochmal">🔁 Nochmal</button><button class="knopf" data-zu="start">Zurück zu Bruni</button>`;
      $("bew-nochmal").addEventListener("click", bewegen); $("bew-karte").querySelector("[data-zu]").addEventListener("click", () => { zeige("start"); start(); });
      if (C && C.hinweis) C.hinweis("💪 Bewegungs-Minute geschafft!", "Bewegung macht den Kopf frisch.", "#2E9C5A");
      S.ton("juhu"); return;
    }
    const [e, t, tr] = bew.liste[bew.pos]; let n = 15;
    $("bew-karte").innerHTML = `<p class="klein">Übung ${bew.pos + 1} von ${bew.liste.length}</p><div class="gross huepf">${e}</div><p class="lage"></p><button class="knopf haupt" id="bew-weiter" disabled>Noch <span id="bew-n">15</span> Sekunden</button>`;
    $("bew-karte").querySelector(".lage").textContent = t; setzeRu($("bew-karte").querySelector(".lage"), tr); sprich(t);
    const iv = setInterval(() => { n--; const el = $("bew-n"); if (el) el.textContent = n; if (n <= 0) { clearInterval(iv); const b = $("bew-weiter"); b.disabled = false; b.textContent = "Geschafft! Weiter ➡️"; } }, 1000);
    laeufer.push(iv);
    $("bew-weiter").addEventListener("click", () => { S.ton("tipp"); bew.pos++; uebung(); });
  }

  // ---------- Miteinander: Bildergeschichten mit Entscheidungen (ohne „falsch“) ----------
  // [id, Emoji, Titel, Geschichte, russisch, [[Wahl, was passiert], …], Frage zum Nachdenken, Gesprächsimpuls fürs Abendessen]
  const GESCHICHTEN = [
    ["allein", "🧍", "Allein auf dem Hof", "In der Pause steht ein Kind ganz allein am Zaun. Es schaut traurig zu, wie die anderen spielen.", "Ребёнок стоит один у забора и грустно смотрит, как играют другие.",
      [["Ich frage: „Willst du mitspielen?“", "Das Kind lächelt. Vielleicht findet es heute einen neuen Freund – dich!"], ["Ich sage es der Lehrerin.", "Die Lehrerin hilft. Gut, dass du hingeschaut hast."], ["Ich spiele einfach weiter.", "Das ist okay, manchmal merkt man so etwas nicht. Wie fühlt sich das Kind wohl?"]],
      "Wie fühlt man sich, wenn man allein ist?", "Erinnerst du dich an einen Moment, in dem du allein warst? Was hat dir geholfen?"],
    ["teilen", "🍪", "Ein Keks für zwei", "Du hast einen Keks. Dein Freund hat seinen vergessen und schaut dich an.", "У тебя есть печенье. Друг забыл своё и смотрит на тебя.",
      [["Ich teile den Keks.", "Ihr freut euch beide. Geteilte Freude ist doppelte Freude!"], ["Ich esse ihn allein.", "Das darfst du auch. Wie fühlt sich dein Freund wohl?"], ["Wir überlegen, was wir zusammen machen.", "Gute Idee! Vielleicht findet ihr eine Lösung für beide."]],
      "Wann teilst du gern – und wann nicht?", "Was teilst du gern? Gibt es etwas, das du lieber für dich behältst – und warum?"],
    ["streit", "😤", "Streit beim Spielen", "Du und deine Schwester wollt beide mit dem gleichen Spielzeug spielen. Ihr werdet laut.", "Ты и сестра хотите играть одной игрушкой. Вы начинаете кричать.",
      [["Ich atme erst tief durch.", "Wenn man ruhiger ist, findet man leichter eine Lösung."], ["Wir wechseln uns ab – mit Sanduhr.", "So kommt jeder dran. Fair!"], ["Ich nehme es mir einfach.", "Dann ist die andere bestimmt wütend. Wie könntet ihr euch wieder vertragen?"]],
      "Wie kann man sich nach einem Streit wieder vertragen?", "Wie vertragen wir uns in unserer Familie, wenn wir gestritten haben?"],
    ["nein", "✋", "Nein sagen", "Ein Kind will, dass du einem anderen Kind die Mütze wegnimmst. Du willst das nicht.", "Ребёнок хочет, чтобы ты отобрал шапку у другого. Ты не хочешь.",
      [["Ich sage laut: „Nein, das mache ich nicht.“", "Das ist mutig! Nein sagen darf man immer, wenn sich etwas falsch anfühlt."], ["Ich gehe einfach weg.", "Auch das ist ein Nein. Gut, dass du auf dein Gefühl hörst."], ["Ich mache es doch.", "Manchmal ist es schwer, Nein zu sagen. Was könnte dir beim nächsten Mal helfen?"]],
      "Wann ist es wichtig, Nein zu sagen?", "Wann hast du schon mal Nein gesagt, obwohl es schwer war?"],
    ["regeln", "⚽", "Fair spielen", "Beim Fußball merkst du, dass dein Team schummelt. Das andere Team hat es nicht gesehen.", "В футболе твоя команда жульничает. Другая команда этого не заметила.",
      [["Ich sage es ehrlich.", "Ehrlich sein ist manchmal schwer – und richtig stark."], ["Ich sage meinem Team, dass wir fair spielen sollen.", "So macht das Spiel allen Spaß."], ["Ich sage nichts.", "Wie fühlt sich das andere Team, wenn es später davon erfährt?"]],
      "Warum gibt es beim Spielen Regeln?", "Welche Regeln haben wir zu Hause – und welche findest du wichtig?"],
    ["sprache", "🌍", "Ein neues Kind", "Ein neues Kind kommt in die Klasse. Es spricht noch wenig Deutsch und sagt kaum etwas.", "В класс пришёл новый ребёнок. Он ещё плохо говорит по-немецки.",
      [["Ich zeige ihm die Schule mit Händen und Füßen.", "Man kann sich auch ohne viele Worte verstehen. Toll!"], ["Ich frage, welche Sprache es spricht.", "Vielleicht könnt ihr euch gegenseitig Wörter beibringen!"], ["Ich warte, bis es besser Deutsch kann.", "Was würde dem Kind jetzt am meisten helfen?"]],
      "Wie fühlt man sich, wenn man die Sprache noch nicht kann?", "Welche Sprachen sprechen Menschen, die wir kennen? Welches Wort kennst du in einer anderen Sprache?"],
    ["natur", "🗑️", "Müll im Park", "Im Park liegt eine Plastikflasche auf der Wiese. Es ist nicht deine.", "В парке на траве лежит пластиковая бутылка. Она не твоя.",
      [["Ich werfe sie in den Mülleimer.", "Danke! Die Tiere und die Wiese freuen sich."], ["Ich sage es einem Erwachsenen.", "Gut – zusammen kann man aufräumen."], ["Ich lasse sie liegen.", "Was könnte mit der Flasche passieren, wenn sie dort bleibt?"]],
      "Warum ist es wichtig, die Natur zu schützen?", "Was können wir als Familie tun, damit weniger Müll entsteht?"],
    ["meinung", "🙋", "Deine Meinung zählt", "Ihr plant einen Ausflug. Alle reden, nur du sagst nichts, obwohl du eine Idee hast.", "Вы планируете поездку. Все говорят, а ты молчишь, хотя у тебя есть идея.",
      [["Ich sage meine Idee.", "Super! Kinder dürfen mitreden – das ist sogar ein Kinderrecht."], ["Ich flüstere sie einer Person zu.", "Ein guter Anfang. Vielleicht sagst du sie nächstes Mal laut?"], ["Ich bleibe still.", "Das ist okay. Was würde dir helfen, deine Idee zu sagen?"]],
      "Warum ist es gut, wenn alle mitreden dürfen?", "Bei welcher Familien-Entscheidung möchtest du gern mitreden?"]
  ];
  // russisch (Entwurf 10.11.2026) zu den Geschichten: Paare [deutsch, russisch] für Wahlen, Folgen und Fragen (so sieht die Prüfliste beide Fassungen)
  const GESCH_RU = new Map([
    ["Ich frage: „Willst du mitspielen?“", "Я спрошу: «Хочешь поиграть с нами?»"],
    ["Das Kind lächelt. Vielleicht findet es heute einen neuen Freund – dich!", "Ребёнок улыбается. Может, сегодня у него появится новый друг – ты!"],
    ["Ich sage es der Lehrerin.", "Я скажу учительнице."],
    ["Die Lehrerin hilft. Gut, dass du hingeschaut hast.", "Учительница поможет. Хорошо, что ты это заметил."],
    ["Ich spiele einfach weiter.", "Я просто играю дальше."],
    ["Das ist okay, manchmal merkt man so etwas nicht. Wie fühlt sich das Kind wohl?", "Это нормально, иногда такое не замечаешь. Что, наверное, чувствует ребёнок?"],
    ["Wie fühlt man sich, wenn man allein ist?", "Каково это – быть одному?"],
    ["Ich teile den Keks.", "Я поделюсь печеньем."],
    ["Ihr freut euch beide. Geteilte Freude ist doppelte Freude!", "Вы оба радуетесь. Разделённая радость – двойная радость!"],
    ["Ich esse ihn allein.", "Я съем его сам."],
    ["Das darfst du auch. Wie fühlt sich dein Freund wohl?", "Так тоже можно. Что, наверное, чувствует твой друг?"],
    ["Wir überlegen, was wir zusammen machen.", "Мы подумаем, что сделать вместе."],
    ["Gute Idee! Vielleicht findet ihr eine Lösung für beide.", "Хорошая идея! Может, вы найдёте решение для обоих."],
    ["Wann teilst du gern – und wann nicht?", "Когда ты охотно делишься – а когда нет?"],
    ["Ich atme erst tief durch.", "Сначала я глубоко вдохну."],
    ["Wenn man ruhiger ist, findet man leichter eine Lösung.", "Когда ты спокойнее, легче найти решение."],
    ["Wir wechseln uns ab – mit Sanduhr.", "Мы будем играть по очереди – с песочными часами."],
    ["So kommt jeder dran. Fair!", "Так каждый получит свою очередь. Честно!"],
    ["Ich nehme es mir einfach.", "Я просто заберу игрушку."],
    ["Dann ist die andere bestimmt wütend. Wie könntet ihr euch wieder vertragen?", "Тогда сестра наверняка рассердится. Как вам снова помириться?"],
    ["Wie kann man sich nach einem Streit wieder vertragen?", "Как помириться после ссоры?"],
    ["Ich sage laut: „Nein, das mache ich nicht.“", "Я громко скажу: «Нет, я этого не сделаю»."],
    ["Das ist mutig! Nein sagen darf man immer, wenn sich etwas falsch anfühlt.", "Это смело! Говорить «нет» можно всегда, когда что-то кажется неправильным."],
    ["Ich gehe einfach weg.", "Я просто уйду."],
    ["Auch das ist ein Nein. Gut, dass du auf dein Gefühl hörst.", "Это тоже «нет». Хорошо, что ты слушаешь своё чувство."],
    ["Ich mache es doch.", "Я всё-таки сделаю это."],
    ["Manchmal ist es schwer, Nein zu sagen. Was könnte dir beim nächsten Mal helfen?", "Иногда трудно сказать «нет». Что поможет тебе в следующий раз?"],
    ["Wann ist es wichtig, Nein zu sagen?", "Когда важно сказать «нет»?"],
    ["Ich sage es ehrlich.", "Я честно скажу об этом."],
    ["Ehrlich sein ist manchmal schwer – und richtig stark.", "Быть честным иногда трудно – и это очень сильно."],
    ["Ich sage meinem Team, dass wir fair spielen sollen.", "Я скажу своей команде, что надо играть честно."],
    ["So macht das Spiel allen Spaß.", "Так игра всем в радость."],
    ["Ich sage nichts.", "Я ничего не скажу."],
    ["Wie fühlt sich das andere Team, wenn es später davon erfährt?", "Что почувствует другая команда, если узнает об этом потом?"],
    ["Warum gibt es beim Spielen Regeln?", "Зачем в игре нужны правила?"],
    ["Ich zeige ihm die Schule mit Händen und Füßen.", "Я покажу ему школу жестами."],
    ["Man kann sich auch ohne viele Worte verstehen. Toll!", "Можно понять друг друга и без многих слов. Здорово!"],
    ["Ich frage, welche Sprache es spricht.", "Я спрошу, на каком языке он говорит."],
    ["Vielleicht könnt ihr euch gegenseitig Wörter beibringen!", "Может, вы научите друг друга новым словам!"],
    ["Ich warte, bis es besser Deutsch kann.", "Я подожду, пока он лучше выучит немецкий."],
    ["Was würde dem Kind jetzt am meisten helfen?", "Что сейчас больше всего помогло бы ребёнку?"],
    ["Wie fühlt man sich, wenn man die Sprache noch nicht kann?", "Каково это, когда ещё не знаешь языка?"],
    ["Ich werfe sie in den Mülleimer.", "Я выброшу её в мусорку."],
    ["Danke! Die Tiere und die Wiese freuen sich.", "Спасибо! Животные и луг радуются."],
    ["Ich sage es einem Erwachsenen.", "Я скажу взрослому."],
    ["Gut – zusammen kann man aufräumen.", "Хорошо – вместе можно убрать."],
    ["Ich lasse sie liegen.", "Я оставлю её лежать."],
    ["Was könnte mit der Flasche passieren, wenn sie dort bleibt?", "Что может случиться с бутылкой, если она там останется?"],
    ["Warum ist es wichtig, die Natur zu schützen?", "Почему важно беречь природу?"],
    ["Ich sage meine Idee.", "Я скажу свою идею."],
    ["Super! Kinder dürfen mitreden – das ist sogar ein Kinderrecht.", "Супер! Дети имеют право участвовать в решениях – это даже право ребёнка."],
    ["Ich flüstere sie einer Person zu.", "Я шепну её кому-нибудь."],
    ["Ein guter Anfang. Vielleicht sagst du sie nächstes Mal laut?", "Хорошее начало. Может, в следующий раз скажешь её вслух?"],
    ["Ich bleibe still.", "Я промолчу."],
    ["Das ist okay. Was würde dir helfen, deine Idee zu sagen?", "Это нормально. Что помогло бы тебе высказать свою идею?"],
    ["Warum ist es gut, wenn alle mitreden dürfen?", "Почему хорошо, когда все могут высказаться?"]
  ]);
  const gru = (de) => GESCH_RU.get(de) || "";
  function miteinander() {
    const d = lade(), gelesen = d.geschichten || {};
    $("mit-karte").innerHTML = `<h2>🤝 Miteinander</h2><p class="klein">Was würdest du tun? Es gibt kein Richtig oder Falsch – Bruni erzählt dir, was passieren könnte.</p>
      <div class="geschichten">${GESCHICHTEN.map((g, i) => `<button class="kachel ${["k1", "k2", "k3", "k4", "k5"][i % 5]}" data-gesch="${i}"><span class="e">${g[1]}</span>${g[2]}${gelesen[g[0]] ? "<small>✅ gelesen</small>" : ""}</button>`).join("")}</div>`;
    $("mit-karte").querySelectorAll("[data-gesch]").forEach(b => b.addEventListener("click", () => { S.ton("tipp"); geschichte(+b.dataset.gesch); }));
  }
  function geschichte(n) {
    const [id, e, titel, text, r, wahlen, frage, impuls] = GESCHICHTEN[n];
    $("mit-karte").innerHTML = `<div class="gross">${e}</div><h2>${titel}</h2><p class="lage"></p>${ru(r) ? `<p class="lage-ru" lang="ru"></p>` : ""}<p><b>Was würdest du tun?</b></p>${ruP("Что бы ты сделал?")}
      <div class="wahlen">${wahlen.map((w, i) => `<button data-w="${i}">${w[0]}${ru(gru(w[0])) ? `<small lang="ru">${S.esc(gru(w[0]))}</small>` : ""}</button>`).join("")}</div><div id="mit-folge"></div>`;
    $("mit-karte").querySelector(".lage").textContent = text; if (ru(r)) $("mit-karte").querySelector(".lage-ru").textContent = r;
    sprich(text);
    $("mit-karte").querySelectorAll("[data-w]").forEach(b => b.addEventListener("click", () => {
      const w = wahlen[+b.dataset.w]; S.ton("tipp");
      $("mit-karte").querySelectorAll("[data-w]").forEach(x => { x.disabled = true; x.style.opacity = x === b ? 1 : 0.5; });
      $("mit-folge").innerHTML = `<div class="folge"><div class="bruni-zeile"><div class="bruni" aria-hidden="true" style="width:70px;height:74px"></div><div><p></p></div></div></div>
        <p><b>🤔 ${frage}</b></p>${ruP(gru(frage))}<div class="impuls">🍽️ <b>Zum Reden beim Abendessen:</b> ${impuls}</div>
        <button class="knopf haupt" id="mit-weiter">Andere Geschichte</button>`;
      $("mit-folge").querySelector(".folge p").textContent = w[1]; setzeRu($("mit-folge").querySelector(".folge p"), gru(w[1]));
      if (window.Figuren) $("mit-folge").querySelector(".bruni").innerHTML = window.Figuren.baer("");
      sprich(w[1]);
      const d = lade(); d.geschichten = Object.assign({}, d.geschichten, { [id]: 1 }); d.impulse = (d.impulse || []).concat([{ d: heute(), t: impuls, g: titel }]).slice(-20); speichere(d);
      if (C && C.gib) C.gib("sachkunde", 2);
      if (window.Lernfunde) Lernfunde.merke({ fach: "sachkunde", art: "miteinander", e, text: `Miteinander: ${titel}`, schluessel: "mit:" + id });
      $("mit-weiter").addEventListener("click", () => { S.ton("tipp"); miteinander(); });
    }));
  }

  // Kacheln auf der Startseite
  document.querySelectorAll("[data-oeffne]").forEach(b => b.addEventListener("click", () => {
    S.ton("tipp"); const n = b.dataset.oeffne; zeige(n);
    ({ barometer, atmen, schildkroete, wut, erkennen, bewegen, miteinander })[n] && ({ barometer, atmen, schildkroete, wut, erkennen, bewegen, miteinander })[n]();
  }));
  // Hilfe-Karte (116 111) und Kurz-Hinweis auf Russisch (Entwurf) – wichtig für Kinder, die noch wenig Deutsch verstehen
  if (ru("x")) {
    const k = $("hilfe-karte"), ps = k.querySelectorAll(":scope > p"), HR = [
      ["Sprich mit einem Erwachsenen, dem du vertraust: Mama, Papa, Oma, Opa, deine Lehrerin oder dein Lehrer. Du bist nicht allein.", "Поговори со взрослым, которому ты доверяешь: мамой, папой, бабушкой, дедушкой, учительницей или учителем. Ты не один."],
      ["Du kannst auch kostenlos bei der Nummer gegen Kummer anrufen: 116 111 (Montag bis Samstag, 14 bis 20 Uhr). Dort hört dir jemand zu – du musst deinen Namen nicht sagen.", "Ты можешь бесплатно позвонить на «Номер против печали» (Nummer gegen Kummer): 116 111 (с понедельника по субботу, с 14 до 20 часов). Там тебя выслушают – называть своё имя не нужно."],
      ["Dein Körper gehört dir. Wenn dich etwas oder jemand komisch fühlen lässt, darfst du Nein sagen und es weitererzählen.", "Твоё тело принадлежит тебе. Если что-то или кто-то вызывает у тебя странное чувство, ты можешь сказать «нет» и рассказать об этом."]
    ];
    ps.forEach((p, i) => { if (HR[i]) p.insertAdjacentHTML("afterend", ruP(HR[i][1])); });   // [deutsch wie in index.html, russisch]
    const KURZ = ["Du kannst auch kostenlos die Nummer gegen Kummer anrufen: 116 111", "Ты можешь бесплатно позвонить на «Номер против печали»: 116 111"];
    $("hilfe-kurz").insertAdjacentHTML("beforeend", ruP(KURZ[1], "span"));
  }
  start();
  const q = new URLSearchParams(location.search).get("zu"); if (q && ["barometer", "bewegen", "ruhe"].includes(q)) { zeige(q); if (q === "barometer") barometer(); if (q === "bewegen") bewegen(); }
  window.__gefuehle = { zeige, barometer, atmen, erkennen, bewegen, get bew() { return bew; }, get erk() { return erk; } };
})();
