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
  const sprich = (t) => { if (SP && SP.sprich) SP.sprich(t, "de-DE"); };

  // [id, Emoji, Name, russisch, Bruni sagt …]
  const GEFUEHLE = [
    ["froh", "😊", "froh", "радостно", "Wie schön! Was hat dich froh gemacht? Erzähl es jemandem – dann freut ihr euch zu zweit."],
    ["ruhig", "😌", "ruhig", "спокойно", "Ruhig sein ist ein gutes Gefühl. Genieß es!"],
    ["muede", "🥱", "müde", "устало", "Müde sein ist okay. Vielleicht hilft eine kleine Pause, ein Glas Wasser oder frische Luft."],
    ["traurig", "😢", "traurig", "грустно", "Traurig sein gehört dazu. Erzähl einem Erwachsenen, dem du vertraust, was los ist. Eine Umarmung hilft oft."],
    ["wuetend", "😠", "wütend", "сердито", "Wut ist ein starkes Gefühl. Probier den Wut-Ballon oder atme tief wie ein Ballon. Danach kannst du darüber reden."],
    ["aengstlich", "😟", "ängstlich", "тревожно", "Wenn du Angst hast, sag es einem Erwachsenen. Ballon-Atmen kann helfen, ruhiger zu werden."],
    ["aufgeregt", "🤩", "aufgeregt", "взволнованно", "Aufgeregt – vielleicht passiert bald etwas Spannendes? Atme einmal tief durch."]
  ];
  const G = Object.fromEntries(GEFUEHLE.map(g => [g[0], g]));
  if (window.Figuren) document.querySelectorAll(".bruni").forEach(el => { el.innerHTML = window.Figuren.baer(""); });

  function zeige(n) { ["start", "barometer", "ruhe", "atmen", "schildkroete", "wut", "erkennen", "bewegen"].forEach(v => { $(v + "-ansicht").hidden = v !== n; }); scrollTo(0, 0); if (SP && SP.stopp) SP.stopp(); }
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
    $("antwort").hidden = false; $("antwort-text").textContent = g[4]; sprich(g[4]);
    $("antwort-knoepfe").innerHTML = ["traurig", "wuetend", "aengstlich", "aufgeregt"].includes(g[0]) ? `<button class="knopf haupt" data-zu="ruhe">🌬️ Ruhig werden</button>` : g[0] === "muede" ? `<button class="knopf haupt" data-zu="bewegen">🤸 Bewegungs-Minute</button>` : "";
    $("antwort-knoepfe").querySelectorAll("[data-zu]").forEach(x => x.addEventListener("click", () => { zeige(x.dataset.zu); if (x.dataset.zu === "bewegen") bewegen(); }));
  });
  $("teilen").addEventListener("change", () => { const d = lade(); d.teilen = $("teilen").checked; speichere(d); S.ton("tipp"); });

  // ---------- Ballon-Atmen ----------
  function atmen() {
    stoppe(); let runde = 0; const RUNDEN = 5, ball = $("ballon"), txt = $("atem-text");
    const schritt = (phase) => {
      if (runde >= RUNDEN) { txt.textContent = "Super! Spürst du, wie du ruhiger bist?"; ball.style.transform = "scale(.6)"; fertigUebung("atmen"); return; }
      if (phase === 0) { txt.textContent = "Einatmen … 1 … 2 … 3 … 4"; ball.style.transition = "transform 4s ease-in-out"; ball.style.transform = "scale(1.25)"; sprich("Einatmen"); laeufer.push(setTimeout(() => schritt(1), 4200)); }
      else { txt.textContent = "Ausatmen … 1 … 2 … 3 … 4"; ball.style.transition = "transform 4s ease-in-out"; ball.style.transform = "scale(.6)"; sprich("Ausatmen"); laeufer.push(setTimeout(() => { runde++; $("atem-runde").textContent = `${Math.min(runde + 1, RUNDEN)} / ${RUNDEN}`; schritt(0); }, 4200)); }
    };
    ball.style.transition = "none"; ball.style.transform = "scale(.6)"; $("atem-runde").textContent = `1 / ${RUNDEN}`; txt.textContent = "Mach es dir bequem …";
    laeufer.push(setTimeout(() => schritt(0), 1200));
  }
  // ---------- Schildkröte ----------
  function schildkroete() {
    stoppe(); let runde = 0; const t = $("schild-text"), k = $("schild");
    const los = () => {
      if (runde >= 3) { t.textContent = "Toll! Die Schildkröte ist ganz ruhig geworden – und du?"; k.textContent = "🐢"; fertigUebung("schildkroete"); return; }
      let n = 5; k.textContent = "🥚"; k.classList.add("klein"); t.textContent = "Zieh dich zusammen wie eine Schildkröte in ihrem Panzer … zähl langsam mit: 5"; sprich("Zieh dich zusammen wie eine Schildkröte");
      const iv = setInterval(() => { n--; if (n > 0) t.textContent = `… ${n}`; else { clearInterval(iv); k.textContent = "🐢"; k.classList.remove("klein"); t.textContent = "Und jetzt langsam wieder herauskommen und strecken!"; runde++; laeufer.push(setTimeout(los, 3500)); } }, 1200);
      laeufer.push(iv);
    };
    k.textContent = "🐢"; t.textContent = "Die Schildkröte hilft dir, wenn alles zu viel ist."; laeufer.push(setTimeout(los, 1500));
  }
  // ---------- Wut-Ballon ----------
  let wutGroesse = 0.4, pustet = false, platzt = 0;
  function wut() { stoppe(); wutGroesse = 0.4; platzt = 0; $("wut-ballon").style.transform = `scale(${wutGroesse})`; $("wut-text").textContent = "Halte den Knopf gedrückt und puste deine Wut in den Ballon!"; }
  const wk = $("wut-knopf");
  let ablassen = null;
  wk.addEventListener("pointerdown", e => { e.preventDefault(); clearInterval(ablassen); pustet = true; });
  ["pointerup", "pointerleave", "pointercancel"].forEach(ev => wk.addEventListener(ev, () => {
    if (!pustet) return; pustet = false;
    if (wutGroesse <= 1.1) { $("wut-text").textContent = "Noch ein bisschen länger pusten – halte den Knopf gedrückt!"; return; }
    { platzt++; $("wut-text").textContent = platzt >= 3 ? "Pfffff … die Wut ist weggeflogen. Wie fühlst du dich jetzt?" : "Pfffff … lass die Luft ganz langsam raus. Nochmal?"; S.ton("juhu"); ablassen = setInterval(() => { wutGroesse = Math.max(0.4, wutGroesse - 0.03); $("wut-ballon").style.transform = `scale(${wutGroesse})`; if (wutGroesse <= 0.4) clearInterval(ablassen); }, 60); if (platzt >= 3) fertigUebung("wut"); }
  }));
  setInterval(() => { if (pustet) { wutGroesse = Math.min(1.5, wutGroesse + 0.02); $("wut-ballon").style.transform = `scale(${wutGroesse})`; if (wutGroesse > 1.1) $("wut-text").textContent = "Jetzt loslassen!"; } }, 50);
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
      $("erk-karte").innerHTML = `<div class="gross">🌈</div><h2>Toll gemacht!</h2><p>Gefühle sind nie falsch. Es hilft, sie zu erkennen und zu benennen – bei dir und bei anderen.</p><button class="knopf haupt" data-zu="start">Zurück zu Bruni</button>`;
      $("erk-karte").querySelector("[data-zu]").addEventListener("click", () => { zeige("start"); start(); });
      if (window.Lernfunde) Lernfunde.merke({ fach: "sachkunde", art: "gefuehle", e: "🎭", text: "Gefühle erkennen: froh, traurig, wütend, ängstlich, aufgeregt …", ru: "радостно, грустно, сердито, тревожно, взволнованно", schluessel: "gefuehle" });
      S.ton("juhu"); return;
    }
    const [e, de, r, ziel] = erk.runden[erk.pos];
    const opts = [ziel, ...GEFUEHLE.map(g => g[0]).filter(x => x !== ziel).sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);
    $("erk-karte").innerHTML = `<p class="klein">${erk.pos + 1} von ${erk.runden.length}</p><div class="gross">${e}</div><p class="lage"></p>${ru(r) ? `<p class="lage-ru" lang="ru"></p>` : ""}
      <p><b>Wie fühlt sich das Kind wohl?</b></p><div class="faces">${opts.map(id => `<button class="face" data-g="${id}"><span class="e">${G[id][1]}</span>${G[id][2]}${ru(G[id][3]) ? `<small lang="ru">${G[id][3]}</small>` : ""}</button>`).join("")}</div><p class="erk-antwort" id="erk-antwort"></p>`;
    $("erk-karte").querySelector(".lage").textContent = de; if (ru(r)) $("erk-karte").querySelector(".lage-ru").textContent = r;
    sprich(de);
    let fertig = false;
    $("erk-karte").querySelectorAll(".face").forEach(b => b.addEventListener("click", () => {
      if (fertig) return; fertig = true;
      const g = b.dataset.g;
      b.classList.add("an");
      $("erk-antwort").textContent = g === ziel ? `Ja! Viele Kinder fühlen sich dann ${G[ziel][2]}.` : `Das kann auch sein! Viele Kinder fühlen sich dann eher ${G[ziel][2]}. Jeder fühlt ein bisschen anders.`;
      S.ton(g === ziel ? "juhu" : "tipp"); if (C && C.gib) C.gib("sachkunde", 1);
      laeufer.push(setTimeout(() => { erk.pos++; frage(); }, 2600));
    }));
  }

  // ---------- Bewegungs-Minute ----------
  const UEBUNGEN = [
    ["🦘", "Hüpf wie ein Känguru – 10-mal!"], ["⭐", "Mach 10 Hampelmänner wie Fipsi!"], ["🦩", "Steh auf einem Bein wie ein Flamingo."], ["🐻", "Lauf wie ein Bär auf allen vieren durchs Zimmer."],
    ["🌳", "Werde ein Baum: Arme hoch und ganz groß machen."], ["🐸", "Spring wie ein Frosch – 5-mal!"], ["💃", "Tanz, als ob niemand zuschaut!"], ["🐢", "Geh ganz langsam wie eine Schildkröte."],
    ["🙆", "Streck dich zur Decke, dann berühr deine Zehen."], ["🏃", "Lauf auf der Stelle, so schnell du kannst!"], ["🐱", "Mach einen Katzenbuckel – und dann ein Hohlkreuz."], ["👏", "Klatsch 10-mal über dem Kopf."]
  ];
  let bew = null;
  function bewegen() {
    stoppe(); bew = { liste: UEBUNGEN.slice().sort(() => Math.random() - 0.5).slice(0, 4), pos: 0 }; uebung();
  }
  function uebung() {
    if (bew.pos >= bew.liste.length) {
      const d = lade(); d.bewegung[heute()] = (d.bewegung[heute()] || 0) + 1; const k = Object.keys(d.bewegung).sort(); while (k.length > 60) delete d.bewegung[k.shift()]; speichere(d);
      $("bew-karte").innerHTML = `<div class="gross">💪</div><h2>Super bewegt!</h2><p>Eine ganze Bewegungs-Minute geschafft. Dein Körper sagt Danke!</p><button class="knopf haupt" id="bew-nochmal">🔁 Nochmal</button><button class="knopf" data-zu="start">Zurück zu Bruni</button>`;
      $("bew-nochmal").addEventListener("click", bewegen); $("bew-karte").querySelector("[data-zu]").addEventListener("click", () => { zeige("start"); start(); });
      if (C && C.hinweis) C.hinweis("💪 Bewegungs-Minute geschafft!", "Bewegung macht den Kopf frisch.", "#2E9C5A");
      S.ton("juhu"); return;
    }
    const [e, t] = bew.liste[bew.pos]; let n = 15;
    $("bew-karte").innerHTML = `<p class="klein">Übung ${bew.pos + 1} von ${bew.liste.length}</p><div class="gross huepf">${e}</div><p class="lage"></p><button class="knopf haupt" id="bew-weiter" disabled>Noch <span id="bew-n">15</span> Sekunden</button>`;
    $("bew-karte").querySelector(".lage").textContent = t; sprich(t);
    const iv = setInterval(() => { n--; const el = $("bew-n"); if (el) el.textContent = n; if (n <= 0) { clearInterval(iv); const b = $("bew-weiter"); b.disabled = false; b.textContent = "Geschafft! Weiter ➡️"; } }, 1000);
    laeufer.push(iv);
    $("bew-weiter").addEventListener("click", () => { S.ton("tipp"); bew.pos++; uebung(); });
  }

  // Kacheln auf der Startseite
  document.querySelectorAll("[data-oeffne]").forEach(b => b.addEventListener("click", () => {
    S.ton("tipp"); const n = b.dataset.oeffne; zeige(n);
    ({ barometer, atmen, schildkroete, wut, erkennen, bewegen })[n] && ({ barometer, atmen, schildkroete, wut, erkennen, bewegen })[n]();
  }));
  start();
  const q = new URLSearchParams(location.search).get("zu"); if (q && ["barometer", "bewegen", "ruhe"].includes(q)) { zeige(q); if (q === "barometer") barometer(); if (q === "bewegen") bewegen(); }
  window.__gefuehle = { zeige, barometer, atmen, erkennen, bewegen, get bew() { return bew; }, get erk() { return erk; } };
})();
