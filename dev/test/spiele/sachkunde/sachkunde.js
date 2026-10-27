(function () {
  const S = window.Spielwelt, SP = window.Sprache, TH = window.THEMEN, BI = window.SachBilder;
  const $ = (id) => document.getElementById(id);
  const HL = () => S.hilfe() || { code: "ru", kurz: "RU", tts: "ru-RU", name: "Russisch" };
  const LANG = () => `lang="${HL().code}"${HL().rtl ? ' dir="rtl"' : ""}`;
  const mische = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const name = () => S.profil.name || "du";
  const mitName = (t) => (t || "").replace(/\{name\}/g, name());
  const T = {
    daumenFrage: ["Stimmt das? Daumen hoch oder runter?", "Это правда? Палец вверх или вниз?"],
    nochmalHin: ["Hmm, überleg nochmal.", "Хм, подумай ещё раз."],
    dochNicht: ["Doch, das stimmt!", "Нет-нет, это правда!"],
    sortiert: ["Alles richtig zugeordnet!", "Всё правильно!"],
    zuordnenFalsch: ["Nicht ganz. Das gehört zu jemand anderem.", "Не совсем. Это относится к кому-то другому."]
  };

  function daten() { const d = Object.assign({ themen: {}, vorlesen: true, ru: true }, S.lade("sachkunde") || {}); if (!S.hilfeRu()) d.ru = false; return d; }
  function speichere(d) { S.speichere("sachkunde", d); }
  const bestes = (id) => daten().themen[id] || 0;

  // ---------- Vorlesen und Russisch an jedem Text ----------
  const texte = [];
  const ohneTags = (t) => String(t || "").replace(/<[^>]+>/g, "");
  function eintrag(de, ru) { texte.push({ de: mitName(de), ru: mitName(ru || "") }); return texte.length - 1; }
  function vt(id) { const e = texte[id]; return e.de + (e.ru ? `<span class="ru-text" ${LANG()} data-ru="${id}" hidden>${e.ru}</span>` : ""); }
  function mini(id) {
    const e = texte[id];
    return `<span class="mini-knoepfe">` + (SP.verfuegbar() ? `<button class="mk" data-vt="${id}" data-sprache="de" aria-label="Vorlesen">🔊</button>` : "") +
      (daten().ru && e.ru ? `<button class="mk ru" data-vt="${id}" data-sprache="hilfe" ${LANG()} aria-label="Auf ${HL().name}">${HL().kurz}</button>` : "") + `</span>`;
  }
  document.addEventListener("click", (ev) => {
    const b = ev.target.closest(".mk"); if (!b) return;
    ev.stopPropagation(); ev.preventDefault();
    const e = texte[+b.dataset.vt]; if (!e) return;
    if (b.dataset.sprache === "de") { SP.sprich(ohneTags(e.de), "de-DE"); return; }
    const els = document.querySelectorAll(`.ru-text[data-ru="${b.dataset.vt}"]`);
    const zeigen = els.length && els[0].hidden;
    els.forEach(x => x.hidden = !zeigen);
    b.classList.toggle("an", !!zeigen);
    if (zeigen || !els.length) SP.sprich(ohneTags(e.ru), HL().tts);
  }, true);

  function sprich(text) {
    if (!daten().vorlesen || !text) return;
    const r = $("eule-gross").firstElementChild; if (r) r.classList.add("spricht");
    SP.sprich(ohneTags(text), "de-DE", () => { const x = $("eule-gross").firstElementChild; if (x) x.classList.remove("spricht"); });
  }

  // ---------- Übersicht ----------
  function zeige(n) { ["liste", "lektion", "ende"].forEach(v => $(v + "-ansicht").hidden = v !== n); scrollTo(0, 0); }
  function zeichneListe() {
    const d = daten();
    $("sterne").textContent = S.sterne();
    $("eule-klein").innerHTML = BI.eule("");
    $("ton-vorlesen").textContent = d.vorlesen ? "🗣️" : "🔇";
    $("ru-schalter").hidden = !S.hilfeRu(); $("ru-schalter").textContent = HL().kurz; $("ru-schalter").classList.toggle("aus", !d.ru); $("ru-schalter").setAttribute("aria-pressed", d.ru);
    const fertig = TH.filter(t => bestes(t.id) > 0).length;
    $("intro-text").textContent = fertig === 0 ? `Hallo ${name()}! Ich bin Eule Ella. Mit mir entdeckst du spannende Dinge über die Welt.`
      : `Du hast schon ${fertig} ${fertig === 1 ? "Thema" : "Themen"} entdeckt. Bald kommen neue dazu!`;
    $("themen").innerHTML = "";
    const klasse = ((S.stufe && S.stufe()) || {}).klasse || 2;
    TH.forEach((t, i) => {
      if (t.stufe && klasse < t.stufe - 1) return; // NA-39: Übergangs-Themen (stufe 5) erst ab Klasse 4 zeigen
      const best = bestes(t.id);
      const b = document.createElement("button");
      b.className = "lek" + (!best ? " jetzt" : "");
      b.style.setProperty("--f", t.grund);
      b.innerHTML = `<span class="emoji">${t.e}</span><span>${t.name}</span>` +
        `<span class="stern-reihe">${best ? [1, 2, 3].map(n => `<span class="${n <= best ? "" : "leer"}">⭐</span>`).join("") : ""}</span>`;
      b.addEventListener("click", () => { S.ton("tipp"); starte(i); });
      $("themen").appendChild(b);
    });
  }

  // ---------- Thema ----------
  let lauf = null;
  // Lernkartei (shared/lernkartei.js): fällige Fragen von früher kommen als kurze Wiederholung an den Anfang
  function mitWiederholung(t) {
    if (!window.Lernkartei) return t;
    const eigene = new Set(t.schritte.map(x => JSON.stringify(x)));
    const karten = Lernkartei.faellige("sachkunde", 3).filter(x => { const y = Object.assign({}, x); delete y.__karte; return !eigene.has(JSON.stringify(y)); });
    if (!karten.length) return t;
    const intro = { typ: "info", titel: "Kurz wiederholen", bild: "🔁",
      text: "Hallo {name}! Bevor wir anfangen, schauen wir uns kurz an, was letztes Mal knifflig war.",
      ru: "Привет, {name}! Сначала коротко повторим то, что в прошлый раз было трудно." };
    return Object.assign({}, t, { schritte: [intro, ...karten, ...t.schritte] });
  }
  function loesungText(s) {
    if (s.typ === "daumen") return `${s.satz} – ${s.ok ? "stimmt" : "stimmt nicht"}`;
    const o = (s.optionen || []).find(x => x.ok);
    return o ? `${s.frage} – ${o.t}` : s.frage;
  }

  function starte(i) {
    const t = mitWiederholung(TH[i]);
    lauf = { i, t, pos: 0, fehler: 0 };
    document.body.style.setProperty("--grund", t.grund);
    document.body.style.setProperty("--akzent", t.farbe);
    document.body.classList.toggle("breit", !!t.stammbaum);
    $("thema-name").textContent = t.name;
    $("eule-gross").innerHTML = BI.eule();
    zeige("lektion"); schritt();
  }

  function blase(text, ru) {
    const id = eintrag(text, ru);
    $("blase").innerHTML = `<div>${vt(id)}</div>` + mini(id);
    sprich(texte[id].de);
  }
  const weiterKnopf = (text = "Weiter") => `<button class="knopf weiter" id="weiter">${text}</button>`;
  function aufWeiter() { const w = $("weiter"); if (w) w.addEventListener("click", () => { S.ton("tipp"); weiter(); }); }
  function weiter() { SP.stopp(); lauf.pos++; schritt(); }
  function erklaere(el, art, de, ru) {
    const id = eintrag(de, ru);
    el.hidden = false; el.className = "warum " + art; el.innerHTML = vt(id) + mini(id);
    sprich(texte[id].de);
  }
  function optionZeile(de, ru) {
    const id = eintrag(de, ru);
    return `<div class="option-zeile"><button class="option">${vt(id)}</button>${mini(id)}</div>`;
  }
  function auswahl(container, optionen) {
    const warum = document.createElement("div"); warum.className = "warum"; warum.hidden = true;
    let versucht = false;
    container.after(warum);
    container.querySelectorAll(".option").forEach((b, n) => b.addEventListener("click", () => {
      const o = optionen[n];
      const sj = lauf.t.schritte[lauf.pos];
      if (o.ok) {
        b.classList.add("richtig");
        if (!versucht && window.Charakter) Charakter.gib("sachkunde", 1); if (!versucht && window.Koennen) Koennen.melde(lauf.t.lz, true);
        if (!versucht && sj && sj.__karte && window.Lernkartei && Lernkartei.richtig("sachkunde", sj) && window.Lernfunde)
          { const t = loesungText(sj); Lernfunde.merke({ fach: "sachkunde", art: "gemeistert", e: "💪", text: t.length > 64 ? t : `${t} – jetzt weißt du es!`, schluessel: "sk:" + t, melden: true }); }
        container.querySelectorAll(".option").forEach(x => x.disabled = true);
        S.ton("juhu"); erklaere(warum, "gut", o.warum, o.hilfe !== undefined ? o.hilfe : S.ht(o, "warum"));
        warum.insertAdjacentHTML("afterend", weiterKnopf()); aufWeiter();
      } else {
        if (!versucht) {
          if (!(sj && sj.__karte)) lauf.fehler++;   // Wiederholungen zählen nicht gegen die Sterne
          if (window.Koennen) Koennen.melde(lauf.t.lz, false);
          versucht = true;
          if (window.Lernkartei) Lernkartei.falsch("sachkunde", sj);
        }
        b.classList.add("falsch"); b.disabled = true;
        S.ton("nein"); erklaere(warum, "nein", o.warum, o.hilfe !== undefined ? o.hilfe : S.ht(o, "warum"));
      }
    }));
  }

  const bildVon = (s) => s.baum ? BI.stammbaum(lauf.t.stammbaum, s.baum) : BI.bild(s.bild);

  function schritt() {
    const { t } = lauf;
    $("balken").style.width = Math.round(lauf.pos / t.schritte.length * 100) + "%";
    if (lauf.pos >= t.schritte.length) return beende();
    const s = t.schritte[lauf.pos], A = $("aufgabe");
    A.innerHTML = ""; texte.length = 0;

    switch (s.typ) {
      case "info": {
        blase(s.text, S.ht(s));
        const fakten = (s.fakten || []).map(([de, ru]) => { const id = eintrag(de, ru); return `<li>${vt(id)}${mini(id)}</li>`; }).join("");
        A.innerHTML = `<h2 style="margin:0">${mitName(s.titel)}</h2>` + bildVon(s) + (fakten ? `<ul class="fakten">${fakten}</ul>` : "") + weiterKnopf(lauf.pos === t.schritte.length - 1 ? "Fertig!" : "Weiter");
        aufWeiter(); break;
      }
      case "wahl": {
        const opts = mische(s.optionen);
        blase(s.frage, S.ht(s));
        A.innerHTML = bildVon(s) + `<div class="optionen">` + opts.map(o => optionZeile(o.t, S.ht(o))).join("") + `</div>`;
        auswahl(A.querySelector(".optionen"), opts);
        break;
      }
      case "daumen": {
        blase(...S.paar(T.daumenFrage));
        const sid = eintrag(s.satz, S.ht(s, "satz"));
        A.innerHTML = bildVon(s) + `<p class="satz-gross">${vt(sid)}${mini(sid)}</p>` +
          `<div class="daumen optionen" style="display:flex;width:auto"><button class="option" aria-label="Stimmt">👍</button><button class="option" aria-label="Stimmt nicht">👎</button></div>`;
        auswahl(A.querySelector(".daumen"), [
          { ok: s.ok, warum: s.ok ? s.warum : S.paar(T.nochmalHin)[0], hilfe: s.ok ? S.ht(s, "warum") : S.paar(T.nochmalHin)[1] },
          { ok: !s.ok, warum: s.ok ? S.paar(T.dochNicht)[0] : s.warum, hilfe: s.ok ? S.paar(T.dochNicht)[1] : S.ht(s, "warum") }]);
        setTimeout(() => sprich(s.satz), 50);
        break;
      }
      case "baum": {
        blase(s.frage, S.ht(s));
        const P = {}; t.stammbaum.personen.forEach(p => P[p.id] = p);
        A.innerHTML = BI.stammbaum(t.stammbaum, [], true) + `<div class="warum" hidden></div>`;
        A.querySelector(".stammbaum").classList.add("gross");
        let versucht = false, fertig = false;
        A.querySelectorAll(".person").forEach(g => g.addEventListener("click", () => {
          if (fertig) return;
          const id = g.dataset.id, w = A.querySelector(".warum");
          if (id === s.ziel) {
            fertig = true; S.ton("juhu");
            if (!versucht && window.Charakter) Charakter.gib("sachkunde", 1); if (!versucht && window.Koennen) Koennen.melde(lauf.t.lz, true);
            A.querySelector(".stammbaum").outerHTML = BI.stammbaum(t.stammbaum, [id]);
            A.querySelector(".stammbaum").classList.add("gross");
            erklaere(w, "gut", s.warum, S.ht(s, "warum"));
            w.insertAdjacentHTML("afterend", weiterKnopf()); aufWeiter();
          } else {
            if (!versucht) { lauf.fehler++; versucht = true; if (window.Koennen) Koennen.melde(lauf.t.lz, false); }
            S.ton("nein"); g.classList.add("falsch");
            erklaere(w, "nein", `Das ist nicht die richtige Person. ${P[id].wer}`, S.ht(P[id], "wer") ? S.paar({ de: "", ru: "Это не тот человек." })[1] + " " + S.ht(P[id], "wer") : "");
          }
        }));
        break;
      }
      case "zuordnen": {
        blase(s.frage, S.ht(s));
        const dinge = mische(s.dinge); let k = 0;
        const zeichne = () => {
          if (k >= dinge.length) {
            A.innerHTML = `<div class="gross-emoji">🎉</div>`;
            S.ton("juhu"); const id = eintrag(...S.paar(T.sortiert));
            A.insertAdjacentHTML("beforeend", `<div class="warum gut">${vt(id)}${mini(id)}</div>` + weiterKnopf());
            aufWeiter(); sprich(texte[id].de); return;
          }
          const d = dinge[k]; let versucht = false;
          const did = eintrag(d.t, S.ht(d));
          const gruppen = s.gruppen.map(g => { const gid = eintrag(g.name, S.ht(g)); return `<button class="option" data-g="${g.id}">${BI.bild(g.bild, "klein")}${vt(gid)}</button>`; }).join("");
          A.innerHTML = `<div class="zaehler">${k + 1} von ${dinge.length}</div><div class="sortier-karte">${vt(did)}${mini(did)}</div>` +
            `<div class="gruppen">${gruppen}</div><div class="warum" hidden></div>`;
          sprich(d.t);
          A.querySelectorAll(".gruppen .option").forEach(b => b.addEventListener("click", () => {
            const w = A.querySelector(".warum");
            if (b.dataset.g === d.gruppe) {
              b.classList.add("richtig"); S.ton("juhu"); A.querySelectorAll(".gruppen .option").forEach(x => x.disabled = true);
              if (!versucht && window.Charakter) Charakter.gib("sachkunde", 1); if (!versucht && window.Koennen) Koennen.melde(lauf.t.lz, true);
              setTimeout(() => { k++; zeichne(); }, 800);
            } else {
              if (!versucht) { lauf.fehler++; versucht = true; if (window.Koennen) Koennen.melde(lauf.t.lz, false); }
              b.classList.add("falsch"); b.disabled = true; S.ton("nein");
              erklaere(w, "nein", ...S.paar(T.zuordnenFalsch));
            }
          }));
        };
        zeichne(); break;
      }
    }
  }

  // ---------- Ende ----------
  function beende() {
    const { t, fehler } = lauf;
    const sterne = fehler <= 1 ? 3 : fehler <= 4 ? 2 : 1;
    const vorher = bestes(t.id);
    let gewinn = Math.max(0, sterne - vorher);
    if (vorher === 3 && sterne === 3) gewinn = 1;
    const d = daten(); d.themen[t.id] = Math.max(vorher, sterne); speichere(d);
    if (gewinn) S.gibSterne(gewinn);
    if (window.Lernfunde) Lernfunde.merke({ fach: "sachkunde", art: "thema", e: t.e, text: `${t.name} – ${t.kurz}`, schluessel: "s:" + t.id });
    if (window.Charakter) { Charakter.gib("sachkunde", 2 + sterne * 2); Charakter.ereignis("sachkunde-thema"); }

    $("ende-titel").textContent = "Thema geschafft!";
    $("ende-sterne").innerHTML = [1, 2, 3].map(n => `<span class="${n <= sterne ? "" : "leer"}" style="animation-delay:${n * 180}ms">⭐</span>`).join("");
    $("ende-text").textContent = fehler === 0 ? "Alles beim ersten Mal richtig! Ella ist stolz auf dich." : `${t.name}: geschafft!`;
    $("ende-gewinn").textContent = gewinn ? `+${gewinn} ${gewinn === 1 ? "Stern" : "Sterne"}. Du hast jetzt ${S.sterne()}.` : `Du hast ${S.sterne()} Sterne.`;
    const kn = $("ende-knoepfe"); kn.innerHTML = "";
    const knopf = (txt, haupt, fn) => { const b = document.createElement("button"); b.className = "knopf" + (haupt ? " haupt" : ""); b.textContent = txt; b.addEventListener("click", () => { S.ton("tipp"); fn(); }); kn.appendChild(b); };
    knopf("Zur Übersicht", true, () => { zeige("liste"); zeichneListe(); });
    knopf("🏠 Zur Spielwelt", false, () => { location.href = "../../"; });
    zeige("ende"); S.ton("juhu");
  }

  $("zur-liste").addEventListener("click", () => { SP.stopp(); S.ton("tipp"); lauf = null; zeige("liste"); zeichneListe(); });
  $("ru-schalter").addEventListener("click", () => { const d = daten(); d.ru = !d.ru; speichere(d); S.ton("tipp"); zeichneListe(); S.meldung(`${HL().name}-Hilfe ist ${d.ru ? "an" : "aus"}.`); });
  $("ton-vorlesen").addEventListener("click", () => { const d = daten(); d.vorlesen = !d.vorlesen; speichere(d); S.ton("tipp"); zeichneListe(); S.meldung(d.vorlesen ? "Vorlesen ist an." : "Vorlesen ist aus."); });

  zeichneListe();
  window.__sachkunde = { starte, schritt: (n) => { lauf.pos = n; schritt(); }, get lauf() { return lauf; } };
})();
