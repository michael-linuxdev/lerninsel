// Insel-Garten: Beete anzeigen, säen, gießen, ernten (Logik in shared/garten.js). Test-Haken: window.__garten.
(function () {
  const S = window.Spielwelt, G = window.Garten, SP = window.Sprache;
  const $ = (id) => document.getElementById(id);
  const esc = S.esc;
  const ru = (t) => (S.hilfe() && t ? `<span class="ru">${esc(t)}</span>` : "");
  let ellaText = "";

  function ella(de, r) { ellaText = de; $("ella-text").innerHTML = esc(de) + ru(r); }
  function dialog(html) { $("dkarte").innerHTML = html; $("dialog").hidden = false; }
  function zu() { $("dialog").hidden = true; }

  function begruessung() {
    const l = G.lage(), name = S.profil.name || "du";
    if (l.reif) return ella(`${name}, schau! ${l.reif === 1 ? "Eine Pflanze ist" : `${l.reif} Pflanzen sind`} reif. Du kannst ernten!`, "Посмотри! Можно собирать урожай!");
    if (l.durstig) return ella(`Hallo ${name}! ${l.durstig === 1 ? "Eine Pflanze hat" : `${l.durstig} Pflanzen haben`} Durst. Gieß sie – dann wachsen sie ein Stück.`, "Растения хотят пить. Полей их – и они подрастут.");
    if (l.leer === l.z.length) return ella(`Hallo ${name}! Das ist dein Garten. Tippe auf ein Beet und such dir Samen aus.`, "Это твой сад. Нажми на грядку и выбери семена.");
    if (l.leer) return ella("Ein Beet ist noch frei. Möchtest du etwas säen?", "Одна грядка ещё свободна. Посеешь что-нибудь?");
    return ella(G.winter() ? "Heute hast du alles gegossen. Im Winter ist es draußen kalt – in unserem Glashaus wachsen die Pflanzen trotzdem." : "Heute hast du alles gegossen. Komm morgen wieder, dann wachsen deine Pflanzen weiter!",
      "Сегодня ты всё полил(а). Приходи завтра – растения подрастут!");
  }

  function zeichne() {
    $("sterne").textContent = S.sterne();
    const offen = G.offen();
    $("zu").hidden = offen; $("beete").hidden = !offen; $("korb").hidden = !offen;
    if (!offen) { ella("Hier entsteht bald dein Garten!", "Скоро здесь будет твой сад!"); return; }
    const d = G.lade();
    $("beete").innerHTML = d.beete.slice(0, G.anzahlBeete()).map((b, i) => {
      const z = G.zustand(b);
      if (z.art === "leer") return `<div class="beet" data-beet="${i}" data-art="leer"><div class="erde"><span class="frei">+</span></div><div class="name">Freies Beet</div><div class="info">Tippe auf „Säen“.</div><button class="knopf haupt" data-saeen="${i}">🌰 Säen</button></div>`;
      const info = z.reif ? "Reif! Du kannst ernten." : z.heuteGegossen ? `Heute gegossen. Noch ${z.noch}× gießen – an ${z.noch === 1 ? "einem Tag" : `${z.noch} Tagen`}.` : `Durst! Noch ${z.noch}× gießen.`;
      const knopf = z.reif ? `<button class="knopf haupt" data-ernten="${i}">🧺 Ernten</button>`
        : `<button class="knopf" data-giessen="${i}" ${z.heuteGegossen ? "disabled" : ""}>${z.heuteGegossen ? "✅ Morgen wieder" : "💧 Gießen"}</button>`;
      return `<div class="beet" data-beet="${i}" data-art="${z.art}"><div class="erde"><span>${z.e}</span></div><div class="name">${esc(z.p.name)}</div><div class="info">${info}</div>${knopf}</div>`;
    }).join("");
    const korb = Object.entries(d.korb).filter(([, n]) => n > 0);
    $("korb").innerHTML = `🧺 Dein Korb: ${korb.length ? korb.map(([id, n]) => { const p = G.pflanze(id); return p ? `<span>${p.e} ${n}× ${esc(p.name)}</span>` : ""; }).join("") : "<em style='font-weight:500'>noch leer</em>"}`;
  }

  function samenWahl(i) {
    const liste = G.samen();
    dialog(`<h2>Was möchtest du säen?</h2><p>Jede Pflanze braucht Wasser – jeden Tag einmal.</p>
      <div class="samen">${liste.map(p => `<button data-samen="${p.id}"><span class="e">${p.e}</span>${esc(p.name)}<small>${p.tage} Tage</small></button>`).join("")}</div>
      <button class="knopf" id="samen-zu">Doch nicht</button>`);
    $("dkarte").querySelectorAll("[data-samen]").forEach(b => b.addEventListener("click", () => {
      const p = G.pflanze(b.dataset.samen);
      if (G.saeen(i, p.id)) { S.ton("wahl"); zu(); zeichne(); ella(`${p.name} ist gesät! ${p.text} Gieß das Beet – heute schon!`, p.textRu); }
    }));
    $("samen-zu").addEventListener("click", () => { zu(); S.ton("tipp"); });
  }

  function giessen(i, knopf) {
    const r = G.giessen(i); if (!r.ok) return;
    S.ton("tipp");
    const erde = knopf.closest(".beet").querySelector(".erde");
    for (let k = 0; k < 3; k++) { const t = document.createElement("span"); t.className = "tropfen"; t.textContent = "💧"; t.style.left = (25 + k * 22) + "%"; t.style.animationDelay = k * 0.15 + "s"; erde.appendChild(t); }
    setTimeout(() => {
      zeichne();
      const z = G.zustand(G.lade().beete[i]);
      if (r.reif) { S.ton("juhu"); ella(`Super! ${z.p.name} ist reif. Tippe auf „Ernten“!`, "Готово! Нажми «Собрать»!"); }
      else ella(r.gewachsen ? (z.art === "keim" ? "Schau, ein kleiner Keim! Zuerst wächst die Wurzel nach unten, dann kommt der Keim ans Licht." : "Die Pflanze ist gewachsen! Morgen gießt du wieder.") : "Danke fürs Gießen!",
        r.gewachsen ? "Растение подросло! Завтра полей снова." : "Спасибо за полив!");
    }, 900);
  }

  function ernten(i) {
    const b = G.lade().beete[i], z = G.zustand(b); if (!z.reif) return;
    const q = G.frage(), opts = q.o.map((t, k) => ({ t, k })).sort(() => Math.random() - 0.5);
    let versucht = false;
    dialog(`<h2>${z.p.e} Ernte-Frage von Ella</h2><p>${esc(q.f)} <button class="vorlesen" id="frage-vorlesen" aria-label="Vorlesen" style="vertical-align:middle">🔊</button>${ru(q.ru)}</p>
      <div class="wahl">${opts.map(o => `<button class="knopf" data-antwort="${o.k}">${esc(o.t)}</button>`).join("")}</div><div id="frage-warum"></div>`);
    $("frage-vorlesen").addEventListener("click", () => { if (SP) { SP.knopf && SP.knopf(); SP.sprich(q.f + " " + q.o.map(t => t.replace(/[^\p{L}\p{N} ,.-]/gu, "")).join(", ")); } });
    $("dkarte").querySelectorAll("[data-antwort]").forEach(knopf => knopf.addEventListener("click", () => {
      const richtig = knopf.dataset.antwort === "0";
      if (window.Erprobung) Erprobung.aufgabe({ inhalt: "garten:" + q.id, text: q.f, antwort: knopf.textContent, richtig, versuch: versucht ? 2 : 1 });   // Erprobungsmodus (Paket K)
      if (window.Koennen && !versucht) Koennen.melde([q.lz], richtig);
      if (!richtig) { versucht = true; knopf.classList.add("falsch"); knopf.disabled = true; S.ton("nein"); return; }
      knopf.classList.add("richtig"); S.ton("juhu");
      if (!versucht && window.Charakter) Charakter.gib("sachkunde", 1);
      const r = G.ernten(i, q.id, !versucht);
      if (r && r.erstes) {
        S.gibSterne(1);
        if (window.Lernfunde) Lernfunde.merke({ fach: "sachkunde", art: "garten", e: r.p.e, text: `${r.p.name} geerntet – ${r.p.text}`, schluessel: "garten:" + r.p.id });
      }
      $("dkarte").querySelectorAll("[data-antwort]").forEach(x => { x.disabled = true; });
      $("frage-warum").innerHTML = `<div class="warum">💡 ${esc(q.warum)}${ru(q.warumRu)}</div>
        <p style="margin-top:12px">${r && r.erstes ? `Deine erste ${esc(r.p.name)}! Dafür gibt es einen Stern ⭐.` : `${esc(z.p.name)} liegt jetzt in deinem Korb.`}</p>
        <button class="knopf haupt" id="ernte-ok">Prima!</button>`;
      $("ernte-ok").addEventListener("click", () => { zu(); zeichne(); begruessung(); });
    }));
  }

  $("beete").addEventListener("click", (e) => {
    const s = e.target.closest("[data-saeen]"), g = e.target.closest("[data-giessen]"), r = e.target.closest("[data-ernten]");
    if (s) samenWahl(+s.dataset.saeen);
    else if (g && !g.disabled) giessen(+g.dataset.giessen, g);
    else if (r) ernten(+r.dataset.ernten);
    else { const b = e.target.closest('[data-art="leer"]'); if (b) samenWahl(+b.dataset.beet); }
  });
  $("ella-vorlesen").addEventListener("click", () => { if (SP && ellaText) { SP.knopf && SP.knopf(); SP.sprich(ellaText); } });

  zeichne(); begruessung();
  window.__garten = { zeichne, ernten, giessen: (i) => giessen(i, document.querySelector(`[data-beet="${i}"] .knopf`)), daten: () => G.lade(), lage: () => G.lage() };
})();
