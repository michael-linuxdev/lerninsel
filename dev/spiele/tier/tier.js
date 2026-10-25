(function () {
  const S = window.Spielwelt, T = window.Tiere, P = window.TierPflege;
  const $ = (id) => document.getElementById(id);
  const VB = "-30 -40 360 320";
  const NAMEN = { drache: ["Funki", "Flammi", "Drako", "Rubin"], einhorn: ["Luna", "Glitzer", "Sternchen", "Rosalie"], fuchs: ["Flocke", "Rusty", "Fips", "Ronja"], katze: ["Mimi", "Schnurri", "Mia", "Tiger"] };
  let ausdruckJetzt = null, ausdruckTimer = null;

  function zeige(n) { ["wahl", "ei", "tier"].forEach(v => $(v + "-ansicht").hidden = v !== n); }
  function dialog(html) { $("dkarte").innerHTML = html; $("dialog").hidden = false; }
  function zu() { $("dialog").hidden = true; }

  function zeichne() {
    $("sterne").textContent = S.sterne();
    const d = P.lade(); P.speichere(d);
    if (!d.phase) return zeigeWahl();
    if (d.phase === "ei") return zeigeEi(d);
    zeigeTier(d);
  }

  // ---------- Ei aussuchen ----------
  function zeigeWahl() {
    $("titel").textContent = "Mein Tier";
    zeige("wahl");
    $("eier").innerHTML = Object.entries(T.EIER).map(([id, e]) => `<button class="ei-wahl" data-ei="${id}"><svg viewBox="40 30 220 250">${T.zeichneEi(id)}</svg>${e.name}<span>${{ feuer: "Es ist ganz warm …", regenbogen: "Es glitzert bunt …", wald: "Es riecht nach Wald …", kuschel: "Es ist ganz weich …" }[id]}</span></button>`).join("");
    $("eier").querySelectorAll("[data-ei]").forEach(b => b.addEventListener("click", () => {
      S.ton("tipp");
      const e = T.EIER[b.dataset.ei];
      dialog(`<h2>${e.name}</h2><svg viewBox="40 30 220 250" style="width:160px">${T.zeichneEi(b.dataset.ei)}</svg>
        <p>Möchtest du dieses Ei? Du kannst es danach nicht mehr tauschen.</p>
        <div class="dknoepfe"><button class="knopf haupt" id="ja">Ja, das will ich!</button><button class="knopf" id="nein">Lieber nochmal schauen</button></div>`);
      $("ja").onclick = () => { P.waehleEi(b.dataset.ei); zu(); S.ton("juhu"); zeichne(); };
      $("nein").onclick = () => { zu(); S.ton("tipp"); };
    }));
  }

  // ---------- Ei wärmen und schlüpfen ----------
  let risse = 0;
  function zeigeEi(d) {
    zeige("ei");
    $("titel").textContent = T.EIER[d.ei].name;
    const bereit = d.waerme >= P.WAERME_ZIEL, heuteGewaermt = d.eiGewaermt === (window.Charakter ? Charakter.heute() : "");
    $("ei-bild").innerHTML = `<svg viewBox="${VB}">${T.zeichneEi(d.ei, risse)}</svg>`;
    $("waerme").innerHTML = [...Array(P.WAERME_ZIEL)].map((_, i) => `<span class="${i < d.waerme ? "an" : ""}">🔥</span>`).join("");
    $("ei-text").textContent = bereit ? (risse ? "Es knackt! Weiter tippen!" : "Das Ei ist ganz warm. Tippe darauf – es schlüpft!") : heuteGewaermt ? "Das Ei fühlt sich schon wärmer an." : "Tippe auf das Ei, um es zu wärmen!";
    $("ei-hilfe").textContent = bereit ? "" : "Jede geschaffte Tagesaufgabe wärmt das Ei. Einmal am Tag darfst du es auch selbst wärmen.";
  }
  $("ei-bild").addEventListener("click", () => {
    const d = P.lade();
    if (d.waerme >= P.WAERME_ZIEL) {
      risse++; S.ton("tipp");
      if (risse >= 4) return schluepfen();
      zeigeEi(d); return;
    }
    if (P.waermen()) { S.ton("juhu"); herzen($("ei-bild"), "🔥"); }
    else { S.ton("tipp"); S.meldung("Heute hast du schon gewärmt. Mach Tagesaufgaben, dann wird es noch wärmer!"); }
    zeigeEi(P.lade());
  });
  function schluepfen() {
    const d = P.schluepfen(); if (!d) return;
    S.ton("juhu");
    zeigeTier(d, "lacht");
    herzen($("tier-bild"), "✨", 10);
    const art = T.ARTEN[d.art];
    dialog(`<h2>Ein ${art.name}!</h2><svg viewBox="${VB}" style="width:200px">${T.zeichneTier({ art: d.art, farbe: d.farbe, stufe: 0, ausdruck: "lacht" })}</svg>
      <p>Wie soll ${d.art === "einhorn" || d.art === "katze" ? "es" : "er"} heißen?</p>
      <input id="name-feld" maxlength="16" autocomplete="off" value="">
      <div class="vorschlaege">${NAMEN[d.art].map(n => `<button data-n="${n}">${n}</button>`).join("")}</div>
      <div class="dknoepfe"><button class="knopf haupt" id="name-ok">Fertig</button></div>`);
    namensDialog();
  }
  function namensDialog() {
    $("dkarte").querySelectorAll("[data-n]").forEach(b => b.addEventListener("click", () => { $("name-feld").value = b.dataset.n; S.ton("tipp"); }));
    $("name-ok").onclick = () => {
      const n = $("name-feld").value.trim(); if (!n) { $("name-feld").focus(); return; }
      P.nenne(n); zu(); S.ton("juhu"); zeichne();
    };
  }

  // ---------- Tier ----------
  function zeigeTier(d, ausdruck) {
    zeige("tier");
    const st = P.stufe(d), art = T.ARTEN[d.art];
    $("titel").textContent = d.name ? `${d.name}` : "Mein Tier";
    $("tier-bild").innerHTML = `<svg viewBox="${VB}">${T.zeichneTier({ art: d.art, farbe: d.farbe, stufe: st, ausdruck: ausdruck || ausdruckJetzt || P.ausdruck(d), zubehoer: d.traegt })}</svg>`;
    $("tier-name").textContent = d.name || art.name;
    $("tier-stufe").textContent = `${art.name}, ${T.STUFEN[st]}`;
    $("tier-text").textContent = P.stimmung(d);
    const naechste = P.STUFE_AB[st + 1];
    const balken = (icon, name, w, farbe, unten) => `<div class="wert">${icon} ${name}<div class="balken"><span style="width:${Math.round(w)}%;background:${farbe}"></span></div>${unten ? `<small>${unten}</small>` : ""}</div>`;
    $("werte").innerHTML =
      balken("🍽️", "Satt", d.satt, "#FFB03B") + balken("😊", "Freude", d.freude, "#5CCBA6") +
      balken("❤️", "Freundschaft", naechste ? (d.freundschaft - P.STUFE_AB[st]) / (naechste - P.STUFE_AB[st]) * 100 : 100, "#E0457B",
        naechste ? `Noch ${naechste - d.freundschaft} bis „${T.STUFEN[st + 1]}“` : "Ganz groß geworden!");
    $("leckerli").textContent = `Füttern (${d.leckerli})`;
    $("fuettern").disabled = d.leckerli < 1;
  }

  function herzen(el, zeichen = "❤️", n = 5) {
    const r = el.getBoundingClientRect();
    for (let i = 0; i < n; i++) {
      const h = document.createElement("span"); h.className = "herz"; h.textContent = zeichen;
      h.style.left = (20 + Math.random() * 60) + "%"; h.style.top = (20 + Math.random() * 40) + "%"; h.style.animationDelay = (i * 90) + "ms";
      el.appendChild(h); setTimeout(() => h.remove(), 1400);
    }
  }
  function kurzAusdruck(a, ms = 1300) {
    ausdruckJetzt = a; clearTimeout(ausdruckTimer);
    zeigeTier(P.lade());
    ausdruckTimer = setTimeout(() => { ausdruckJetzt = null; zeigeTier(P.lade()); }, ms);
  }
  function gewachsen(r) {
    if (!r || !r.gewachsen) return;
    const d = r.d, st = P.stufe(d);
    setTimeout(() => {
      S.ton("juhu");
      dialog(`<h2>${d.name} ist gewachsen!</h2><svg viewBox="${VB}" style="width:220px">${T.zeichneTier({ art: d.art, farbe: d.farbe, stufe: st, ausdruck: "lacht", zubehoer: d.traegt })}</svg>
        <p>Jetzt: <b>${T.STUFEN[st]}</b>. Eure Freundschaft wird immer größer!</p><div class="dknoepfe"><button class="knopf haupt" id="ok">Juhu!</button></div>`);
      $("ok").onclick = () => { zu(); zeichne(); };
      if (window.Charakter) Charakter.hinweis("🌱 Gewachsen!", `${d.name} ist jetzt ${T.STUFEN[st]}.`, "#2FA37C");
    }, 900);
  }

  $("tier-bild").addEventListener("click", () => {
    const r = P.streicheln(); if (!r) return;
    S.ton("wahl"); herzen($("tier-bild")); kurzAusdruck("lacht"); gewachsen(r);
  });

  $("fuettern").addEventListener("click", () => {
    const vorher = P.lade(); if (vorher.leckerli < 1) return;
    const btn = $("fuettern").getBoundingClientRect(), ziel = $("tier-bild").getBoundingClientRect();
    const f = document.createElement("span"); f.className = "flieger";
    f.textContent = { drache: "🌶️", einhorn: "🍓", fuchs: "🍎", katze: "🐟" }[vorher.art] || "🍪";
    f.style.left = btn.left + btn.width / 2 - 24 + "px"; f.style.top = btn.top + "px";
    document.body.appendChild(f);
    requestAnimationFrame(() => { f.style.left = ziel.left + ziel.width / 2 - 24 + "px"; f.style.top = ziel.top + ziel.height * 0.45 + "px"; f.style.transform = "scale(.6)"; });
    setTimeout(() => { f.style.opacity = "0"; }, 650); setTimeout(() => f.remove(), 1000);
    setTimeout(() => { const r = P.fuettern(); S.ton("juhu"); herzen($("tier-bild"), "😋", 3); kurzAusdruck("lacht"); gewachsen(r); }, 700);
  });

  $("spielen").addEventListener("click", () => {
    const ziel = $("tier-bild").getBoundingClientRect();
    const b = document.createElement("span"); b.className = "flieger"; b.textContent = "⚽";
    b.style.left = "-60px"; b.style.top = ziel.top + ziel.height * 0.2 + "px";
    document.body.appendChild(b);
    requestAnimationFrame(() => { b.style.left = ziel.left + ziel.width / 2 - 24 + "px"; b.style.top = ziel.top - 30 + "px"; b.style.transform = "rotate(540deg)"; });
    setTimeout(() => { $("tier-bild").classList.remove("springt"); void $("tier-bild").offsetWidth; $("tier-bild").classList.add("springt"); }, 450);
    setTimeout(() => { b.style.left = innerWidth + 60 + "px"; b.style.top = ziel.top + ziel.height * 0.3 + "px"; }, 750);
    setTimeout(() => b.remove(), 1500);
    setTimeout(() => { const r = P.spielen(); S.ton("juhu"); kurzAusdruck("lacht", 1500); gewachsen(r); }, 800);
  });

  $("umbenennen").addEventListener("click", () => {
    const d = P.lade(); S.ton("tipp");
    dialog(`<h2>Neuer Name</h2><input id="name-feld" maxlength="16" autocomplete="off" value="${(d.name || "").replace(/"/g, "")}">
      <div class="vorschlaege">${NAMEN[d.art].map(n => `<button data-n="${n}">${n}</button>`).join("")}</div>
      <div class="dknoepfe"><button class="knopf haupt" id="name-ok">Speichern</button><button class="knopf" id="name-ab">Abbrechen</button></div>`);
    namensDialog(); $("name-ab").onclick = () => { zu(); };
  });

  $("zubehoer-auf").addEventListener("click", () => { S.ton("tipp"); zeigeZubehoer(); });
  function zeigeZubehoer() {
    const d = P.lade(), st = P.stufe(d);
    dialog(`<h2>Zubehör für ${d.name}</h2><p>Du hast ${S.sterne()} ⭐.</p><div class="zubehoer">` +
      T.ZUBEHOER.map(z => `<button class="zb ${d.traegt[z.id] ? "an" : ""}" data-z="${z.id}"><svg viewBox="${VB}">${T.zeichneTier({ art: d.art, farbe: d.farbe, stufe: st, zubehoer: { [z.id]: 1 } })}</svg>${z.name}<em>${d.besitz[z.id] ? (d.traegt[z.id] ? "trägt es" : "ausgezogen") : `${z.preis} ⭐`}</em></button>`).join("") +
      `</div><div class="dknoepfe"><button class="knopf haupt" id="zb-zu">Fertig</button></div>`);
    $("zb-zu").onclick = () => { zu(); zeichne(); };
    $("dkarte").querySelectorAll("[data-z]").forEach(b => b.addEventListener("click", () => {
      const id = b.dataset.z, z = T.ZUBEHOER.find(x => x.id === id), dd = P.lade();
      if (dd.besitz[id]) { P.trage(id, !dd.traegt[id]); S.ton("wahl"); zeigeZubehoer(); return; }
      if (S.sterne() < z.preis) { S.ton("nein"); S.meldung(`Für ${z.name} brauchst du ${z.preis} Sterne. Dir fehlen noch ${z.preis - S.sterne()}.`); return; }
      if (confirm(`${z.name} für ${z.preis} ⭐ kaufen? Du hast ${S.sterne()} ⭐.`)) { P.kaufe(id); S.ton("juhu"); zeigeZubehoer(); $("sterne").textContent = S.sterne(); }
    }));
  }

  zeichne();
  window.__tier = { zeichne };
})();
