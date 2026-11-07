(function () {
  const S = window.Spielwelt, SP = window.Sprache, BI = window.SachBilder;
  const $ = (id) => document.getElementById(id);
  // Weitere Fächer (28.10.2026): ?fach=kunst|musik|werken|sport|ethik zeigt die Themen dieses Fachs aus faecher.js (gleiche Seite, gleiche Eule)
  const FS = window.FACH_SEITEN || {}, FACH = ((p) => FS[p] ? p : "")(new URLSearchParams(location.search).get("fach"));
  // Religion (ev./kath.) nur nach Eltern-Wahl eltern.ethik.unterricht; Themen mit konf passend zur Konfession (ohne Wahl: alle)
  const KONF = ((u) => ["ev", "ka"].includes(u) ? u : "")((((S.lade("eltern") || {}).ethik) || {}).unterricht);
  const passtKonf = (t) => !t.konf || !KONF || t.konf.includes(KONF);
  // Landkreis-Themen (spiele/sachkunde/landkreise.js): der von den Eltern gewählte Kreis plus das Sachsen-Quiz
  const LKW = (((S.lade("eltern") || {}).sachkunde) || {}).landkreis || "";
  const TH = FACH ? (window.FACH_THEMEN || []).filter(t => t.fach === FACH && passtKonf(t))
    : window.THEMEN.concat((window.LANDKREIS_THEMEN || []).filter(t => t.id === "lk-sachsen" || t.landkreis === LKW));
  const KARTEI = FACH || "sachkunde";   // Lernkartei und Lernfunde je Fach
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
  const SU_LB0 = [["zl", "🤝 Zusammen leben und lernen"], ["kg", "💪 Mein Körper und meine Gesundheit"], ["pt", "🌳 Pflanzen und Tiere"], ["un", "🔬 Unbelebte Natur"], ["rz", "🗺️ Raum und Zeit"], ["ex", "🧪 Forschen, Medien, meine Schulzeit"]];
  const SU_LB = FACH ? FS[FACH].lb : SU_LB0, LB0 = SU_LB[0][0];
  function zeige(n) { ["liste", "lektion", "ende"].forEach(v => $(v + "-ansicht").hidden = v !== n); scrollTo(0, 0); }
  // Reiter oben: Sachunterricht und die weiteren Fächer (nur Fächer mit Themen für diese Klasse)
  function reiter() {
    const r = $("fach-reiter"); if (!r || !Object.keys(FS).length) return;
    const kl = ((S.stufe && S.stufe()) || {}).klasse || 2, sichtbar = (t) => !(t.stufe && kl < t.stufe - 1) && !(t.land && (S.land() || {}).code !== t.land);
    const liste = [["", "🔬", "Sachunterricht"]].concat(Object.entries(FS).filter(([f, x]) => (!x.nurMitWahl || KONF || f === FACH) && (window.FACH_THEMEN || []).some(t => t.fach === f && sichtbar(t) && passtKonf(t))).map(([f, x]) => [f, x.e, x.name]));
    r.innerHTML = liste.map(([f, e, n]) => `<a class="reiter${f === FACH ? " an" : ""}" data-fach="${f}" href="./${f ? "?fach=" + f : ""}"${f === FACH ? ' aria-current="page"' : ""}><span>${e}</span> ${n}</a>`).join("") +
      (FACH === "werken" && kl >= 3 ? `<a class="reiter" id="robo-link" href="../robo/"><span>\uE101</span> Robo programmieren</a>` : "");   // Werken Kl. 4: Programmieren
  }
  function zeichneListe() {
    const d = daten();
    $("sterne").textContent = S.sterne();
    $("eule-klein").innerHTML = BI.eule("");
    $("ton-vorlesen").textContent = d.vorlesen ? "🗣️" : "🔇";
    $("ru-schalter").hidden = !S.hilfeRu(); $("ru-schalter").textContent = HL().kurz; $("ru-schalter").classList.toggle("aus", !d.ru); $("ru-schalter").setAttribute("aria-pressed", d.ru);
    const fertig = TH.filter(t => bestes(t.id) > 0).length;
    reiter();
    const religion = FACH === "ethik" && ["ev", "ka"].includes((((S.lade("eltern") || {}).ethik) || {}).unterricht);   // Eltern-Wahl: Kind hat Religion statt Ethik
    $("intro-text").textContent = fertig === 0 ? (FACH ? `Hallo ${name()}! ${religion ? "Du hast in der Schule Religion – die Religionsthemen findest du oben unter „Religion“. Hier in Ethik gibt es noch mehr zum Nachdenken: Feste, Religionen und unser Miteinander." : FS[FACH].intro}` : `Hallo ${name()}! Ich bin Eule Ella. Mit mir entdeckst du spannende Dinge über die Welt.`)
      : `Du hast schon ${fertig} ${fertig === 1 ? "Thema" : "Themen"} entdeckt. Bald kommen neue dazu!`;
    $("themen").innerHTML = "";
    nachfrageKarte();
    const klasse = ((S.stufe && S.stufe()) || {}).klasse || 2;
    const kachel = (t, i) => {
      const best = bestes(t.id);
      const b = document.createElement("button");
      b.className = "lek" + (!best ? " jetzt" : "");
      b.dataset.id = t.id;
      b.style.setProperty("--f", t.grund);
      b.innerHTML = `<span class="emoji">${t.e}</span><span>${t.name}</span>` +
        `<span class="stern-reihe">${best ? [1, 2, 3].map(n => `<span class="${n <= best ? "" : "leer"}">⭐</span>`).join("") : ""}</span>`;
      b.addEventListener("click", () => { S.ton("tipp"); starte(i); });
      return b;
    };
    // Schuljahr SU (28.10.2026): Themen nach den Lernbereichen des Lehrplans gruppiert; Themen früherer Klassen eingeklappt
    const stufeVon = (t) => Math.max(2, t.stufe || t.kl || 2);
    const schule = (((S.lade("eltern") || {})[FACH || "sachkunde"] || {}).schule) || "";   // Eltern-Einstellung „gerade in der Schule“ (Lernbereich)
    SU_LB.forEach(([lb, titel]) => {
      const alle = TH.map((t, i) => [t, i]).filter(([t]) => (t.lb || LB0) === lb
        && !(t.stufe && klasse < t.stufe - 1)                   // NA-39: Übergangs-Themen (stufe 5) erst ab Klasse 4 zeigen
        && !(t.land && (S.land() || {}).code !== t.land))       // Heimatkunde nur für Kinder aus diesem Bundesland
        .sort((a, b) => stufeVon(a[0]) - stufeVon(b[0]) || a[1] - b[1]);
      if (!alle.length) return;
      const frueher = alle.filter(([t]) => klasse >= 3 && stufeVon(t) < klasse), jetzt = alle.filter(x => !frueher.includes(x));
      const g = document.createElement("section"); g.className = "su-gruppe" + (lb === schule ? " schule" : ""); g.dataset.lb = lb;
      g.innerHTML = `<h3>${titel}${lb === schule ? ` <span class="schule-marke">📌 Gerade in der Schule</span>` : ""}</h3>` +
        (lernstandThemen(lb).length >= 2 ? `<button class="knopf lernstand-knopf" data-lb="${lb}">🎯 Zeig, was du kannst</button>` : "") + `<div class="lektionen"></div>`;
      const lk = g.querySelector(".lernstand-knopf"); if (lk) lk.addEventListener("click", () => { S.ton("tipp"); starteLernstand(lb); });
      jetzt.forEach(([t, i]) => g.querySelector(".lektionen").appendChild(kachel(t, i)));
      if (frueher.length) {
        const d = document.createElement("details"); d.className = "frueher";
        d.innerHTML = `<summary>Wiederholen aus früheren Klassen (${frueher.length})</summary><div class="lektionen"></div>`;
        frueher.forEach(([t, i]) => d.querySelector(".lektionen").appendChild(kachel(t, i)));
        g.appendChild(d);
      }
      if (lb === schule || (religion && !schule && lb === "et3")) $("themen").prepend(g); else $("themen").appendChild(g);   // „gerade in der Schule“ (bei Religion: Feste und Religionen) steht oben
    });
  }

  // ---------- Thema ----------
  let lauf = null;
  // Lernkartei (shared/lernkartei.js): fällige Fragen von früher kommen als kurze Wiederholung an den Anfang
  function mitWiederholung(t) {
    if (!window.Lernkartei) return t;
    const eigene = new Set(t.schritte.map(x => JSON.stringify(x)));
    const karten = Lernkartei.faellige(KARTEI, 3).filter(x => { const y = Object.assign({}, x); delete y.__karte; return !eigene.has(JSON.stringify(y)); });
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
    const t = TH[i].lernstand || TH[i].nachfrage ? TH[i] : mitWiederholung(TH[i]);
    lauf = { i, t, pos: 0, fehler: 0, falsch: new Set(), transferFalsch: new Set() };
    document.body.style.setProperty("--grund", t.grund);
    document.body.style.setProperty("--akzent", t.farbe);
    document.body.classList.toggle("breit", !!t.stammbaum);
    if (window.Erprobung) Erprobung.runde((t.fach ? "faecher:" : "sachkunde:") + (t.lernstand ? "lernstand" : t.nachfrage ? "nachfrage" : t.id), t.schritte.length);
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
  function weiter() { SP.stopp(); if (window.Klang) Klang.stopp(); lauf.pos++; schritt(); }
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
      if (window.Erprobung && !b.disabled) Erprobung.aufgabe({ antwort: o.t || b.getAttribute("aria-label") || b.textContent, richtig: !!o.ok });
      if (o.ok) {
        b.classList.add("richtig");
        if (!versucht && window.Charakter) Charakter.gib("sachkunde", 1); if (!versucht && window.Koennen) Koennen.melde((sj && sj.__lz) || lauf.t.lz, true);
        if (!versucht && sj && sj.__karte && window.Lernkartei && Lernkartei.richtig(KARTEI, sj) && window.Lernfunde)
          { const t = loesungText(sj); Lernfunde.merke({ fach: KARTEI, art: "gemeistert", e: "💪", text: t.length > 64 ? t : `${t} – jetzt weißt du es!`, schluessel: "sk:" + t, melden: true }); }
        container.querySelectorAll(".option").forEach(x => x.disabled = true);
        S.ton("juhu"); erklaere(warum, "gut", o.warum, o.hilfe !== undefined ? o.hilfe : S.ht(o, "warum"));
        warum.insertAdjacentHTML("afterend", weiterKnopf()); aufWeiter();
      } else {
        if (!versucht) {
          if (!(sj && sj.__karte)) lauf.fehler++;   // Wiederholungen zählen nicht gegen die Sterne
          if (sj && sj.__kap) lauf.falsch.add(sj.__kap);   // „Zeig, was du kannst“: dieses Thema noch üben
          if (sj && sj.__transfer) lauf.transferFalsch.add(lauf.pos);
          if (window.Koennen) Koennen.melde(lauf.t.lz, false);
          versucht = true;
          if (window.Lernkartei) Lernkartei.falsch(KARTEI, sj);
        }
        b.classList.add("falsch"); b.disabled = true;
        S.ton("nein"); erklaere(warum, "nein", o.warum, o.hilfe !== undefined ? o.hilfe : S.ht(o, "warum"));
      }
    }));
  }

  // Erprobungsmodus (Paket K): Inhalt-ID sachkunde:<thema> bzw. faecher:<thema> (Kunst, Musik, … Religion), Schritt = Nummer im Thema
  function erpZeige(s, A) {
    const alle = (window.THEMEN || []).concat(window.FACH_THEMEN || []), orig = TH[lauf.i] || lauf.t;
    const quelle = s.__kap ? (alle.find(x => x.id === s.__kap) || orig) : orig, idx = quelle.schritte ? quelle.schritte.indexOf(s) : -1;
    Erprobung.zeige({ inhalt: (quelle.fach ? "faecher:" : "sachkunde:") + quelle.id, schritt: idx >= 0 ? idx : s.__karte ? "wiederholung" : s.__transfer ? "transfer" : s.typ,
      text: s.typ + ": " + (s.frage || s.satz || s.titel || s.text || ""), fach: quelle.fach || "sachkunde", klasse: quelle.stufe || quelle.kl || "", daten: quelle.lernstand || quelle.nachfrage ? null : quelle,
      ru: S.ht(s) || S.ht(s, "satz") || "", el: A });
  }
  const bildVon = (s) => s.baum ? BI.stammbaum(lauf.t.stammbaum, s.baum) : BI.bild(s.bild);

  function schritt() {
    const { t } = lauf;
    $("balken").style.width = Math.round(lauf.pos / t.schritte.length * 100) + "%";
    if (lauf.pos >= t.schritte.length) return beende();
    const s = t.schritte[lauf.pos], A = $("aufgabe");
    A.innerHTML = ""; texte.length = 0;
    if (window.Erprobung) erpZeige(s, A);
    if (window.Bewegung) Bewegung.stopp();

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
        // Hör-Schritt (07.11.2026): Klangbeispiel aus klang.js, erst nach Antippen
        const hoer = s.klang && window.Klang ? `<button class="knopf haupt klang-knopf" id="klang-knopf" aria-label="Klangbeispiel abspielen">▶️ Abspielen</button>` : "";
        A.innerHTML = bildVon(s) + hoer + `<div class="optionen">` + opts.map(o => optionZeile(o.t, S.ht(o))).join("") + `</div>`;
        if (hoer) $("klang-knopf").addEventListener("click", () => { SP.stopp(); Klang.spiele(s.klang); $("klang-knopf").classList.add("gehoert"); $("klang-knopf").textContent = "🔁 Nochmal abspielen"; });
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
          if (window.Erprobung) Erprobung.aufgabe({ antwort: (P[id] || {}).name || id, richtig: id === s.ziel });
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
      case "bewegung": {   // Bewegungspause zum Mitmachen (bewegung.js)
        Bewegung.zeige(A, s, { eintrag, vt, mini, blase, weiterKnopf, aufWeiter, ton: (t) => S.ton(t), ht: (o, f) => S.ht(o, f) });
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
            if (window.Erprobung) Erprobung.aufgabe({ antwort: d.t + " → " + b.dataset.g, richtig: b.dataset.g === d.gruppe });
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
    if (window.Erprobung) Erprobung.rundeFertig({ fehler: lauf.fehler });
    if (lauf.t.lernstand) return beendeLernstand();
    if (lauf.t.nachfrage) return beendeNachfrage();
    const { t, fehler } = lauf;
    const sterne = fehler <= 1 ? 3 : fehler <= 4 ? 2 : 1;
    const vorher = bestes(t.id);
    let gewinn = Math.max(0, sterne - vorher);
    if (vorher === 3 && sterne === 3) gewinn = 1;
    const d = daten(); d.themen[t.id] = Math.max(vorher, sterne);
    planeNachfrage(d, t.id);
    speichere(d);
    if (gewinn) S.gibSterne(gewinn);
    if (window.Lernfunde) Lernfunde.merke({ fach: KARTEI, art: "thema", e: t.e, text: `${t.name} – ${t.kurz}`, schluessel: "s:" + t.id });
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


  // ---------- Schuljahr SU (28.10.2026): „Zeig, was du kannst“ je Lernbereich ----------
  // Eine Wahl- oder Daumen-Frage aus jedem Thema des Lernbereichs für die eigene Klasse (höchstens 10), ohne Sterne; Ergebnis in
  // sachkunde.lernstand["k<klasse>:<lb>"] = { am, n, richtig, je: { thema: bool } }.
  const klasseJetzt = () => ((S.stufe && S.stufe()) || {}).klasse || 2;
  const pad2 = (n) => String(n).padStart(2, "0");
  const heute = () => { const d = window.__jetzt ? new Date(window.__jetzt) : new Date(); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };
  const passtLand = (t) => !(t.land && (S.land() || {}).code !== t.land);
  function lernstandThemen(lb) {
    const kl = Math.max(2, klasseJetzt());
    return TH.filter(t => !t.lernstand && (t.lb || LB0) === lb && Math.max(2, t.stufe || t.kl || 2) === kl && passtLand(t) && t.schritte.some(x => x.typ === "wahl" || x.typ === "daumen"));
  }
  // Transfer-Fragen für Lernbereich und Klasse (nur Sachunterricht, nicht in den Fach-Reitern)
  function transferFragen(lb) {
    if (FACH || !window.SU_TRANSFER) return [];
    const kl = Math.max(2, klasseJetzt());
    return window.SU_TRANSFER.filter(x => x.lb === lb && x.kl === kl && passtLand(x));
  }
  function starteLernstand(lb) {
    const titel = (SU_LB.find(x => x[0] === lb) || [lb, lb])[1].replace(/^\S+\s/, "");
    // Wenige Themen im Lernbereich: bis zu drei Fragen je Thema, damit es etwa 8–10 Fragen werden
    const th = mische(lernstandThemen(lb)).slice(0, 10), je = Math.min(3, Math.ceil(8 / Math.max(1, th.length)));
    // Ehrlich lernen (07.11.2026): bis zu 3 Transfer-Fragen (neue Situation, gleiche Idee) aus spiele/sachkunde/transfer.js kommen dazu
    const tr = mische(transferFragen(lb)).slice(0, 3).map(x => { const t = TH.find(y => y.id === x.thema) || {};
      return Object.assign({}, x, { __kap: t.id ? x.thema : "transfer", __lz: t.lz, __transfer: true }); });
    const ausThemen = mische([].concat(...th.map(t => mische(t.schritte.filter(x => x.typ === "wahl" || x.typ === "daumen")).slice(0, je)
      .map(x => Object.assign({}, x, { __kap: t.id, __lz: t.lz }))))).slice(0, 10 - tr.length);
    const schritte = mische(ausThemen.concat(tr));
    const t = { id: "lernstand-" + lb, lernstand: lb, name: "Zeig, was du kannst", e: "🎯", farbe: "#7B55B8", grund: "#EFE6FF", lz: [], kurz: "",
      schritte: [{ typ: "info", titel: "Zeig, was du kannst", bild: "🎯", text: `Zeig mir, was du über „${titel}“ schon weißt, {name}! Das ist kein Test mit Noten – nur ein Blick, was schon klappt.`,
        ru: "Покажи, что ты уже знаешь! Это не контрольная с оценками — просто посмотрим, что уже получается." }].concat(schritte) };
    TH.push(t); starte(TH.length - 1);   // vorübergehend in die Liste, damit starte(i) wie gewohnt arbeitet
  }
  function beendeLernstand() {
    const { t } = lauf, je = {};
    t.schritte.forEach(x => { if (x.__kap) je[x.__kap] = !lauf.falsch.has(x.__kap); });
    const trIdx = t.schritte.map((x, i) => x.__transfer ? i : -1).filter(i => i >= 0);
    const transfer = { n: trIdx.length, richtig: trIdx.filter(i => !lauf.transferFalsch.has(i)).length };
    const i = TH.indexOf(t); if (i >= 0) TH.splice(i, 1);
    const ids = Object.keys(je), gut = ids.filter(id => je[id]), ueben = ids.filter(id => !je[id]), name = (id) => id === "transfer" ? "Neue Situationen" : (TH.find(x => x.id === id) || {}).name || id;
    const d = daten(); d.lernstand = d.lernstand || {}; d.lernstand[`k${Math.max(2, klasseJetzt())}:${t.lernstand}`] = Object.assign({ am: heute(), n: ids.length, richtig: gut.length, je }, transfer.n ? { transfer } : {});
    speichere(d);
    if (window.Charakter) Charakter.gib("sachkunde", 3);
    $("ende-titel").textContent = "Danke fürs Zeigen!";
    $("ende-sterne").innerHTML = `<span style="animation-delay:180ms">🎯</span>`;
    $("ende-text").textContent = (gut.length ? `Das weißt du schon: ${gut.slice(0, 4).map(name).join(", ")}${gut.length > 4 ? " und mehr" : ""}. ` : "") +
      (ueben.length ? `Das schauen wir uns noch einmal an: ${ueben.slice(0, 3).map(name).join(", ")}.` : "Alles beim ersten Mal richtig – Ella ist stolz auf dich!");
    $("ende-gewinn").textContent = (transfer.n ? `Neue Situationen: ${transfer.richtig} von ${transfer.n} gleich richtig. ` : "") + "Das war kein Test mit Noten – nur ein Blick, was schon klappt.";
    const kn = $("ende-knoepfe"); kn.innerHTML = "";
    const knopf = (txt, haupt, fn) => { const b = document.createElement("button"); b.className = "knopf" + (haupt ? " haupt" : ""); b.textContent = txt; b.addEventListener("click", () => { S.ton("tipp"); fn(); }); kn.appendChild(b); };
    const erste = ueben.length ? TH.findIndex(x => x.id === ueben[0]) : -1;
    if (erste >= 0) knopf(`Üben: ${TH[erste].name}`, true, () => starte(erste));
    knopf("Zur Übersicht", erste < 0, () => { zeige("liste"); zeichneListe(); });
    zeige("ende"); S.ton("juhu");
  }

  // ---------- Ella fragt nach (Paket „Ehrlich lernen“, 07.11.2026) ----------
  // Verteilte Wiederholung: Ein Sachthema, das zum ersten Mal geschafft ist, kommt nach 1, 7 und 30 Tagen als kurze Nachfrage
  // mit 2 Fragen aus dem Thema wieder (Karte oben in der Themenliste). Vorhersehbar, ohne Sterne, ohne Frist: Wer nicht kommt, verliert nichts,
  // die Nachfrage wartet. Ein Fehler heißt nur: morgen noch einmal dieselbe Stufe. Daten sachkunde.nachfrage = { "<thema>": { stufe, faellig, fertig? } }.
  const ABSTAND = [1, 7, 30];
  const plusTage = (tag, n) => { const [j, m, t] = tag.split("-").map(Number), d = new Date(j, m - 1, t + n); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };
  function planeNachfrage(d, id) {
    if (FACH) return;
    d.nachfrage = d.nachfrage || {};
    if (!d.nachfrage[id]) d.nachfrage[id] = { stufe: 0, faellig: plusTage(heute(), ABSTAND[0]) };
  }
  const nachfrageFragen = (t) => t.schritte.filter(x => x.typ === "wahl" || x.typ === "daumen");
  function faelligeNachfragen() {
    if (FACH) return [];
    const nf = daten().nachfrage || {}, h = heute();
    return Object.entries(nf).filter(([id, x]) => !x.fertig && x.faellig <= h && TH.some(t => t.id === id && !t.lernstand && nachfrageFragen(t).length >= 2))
      .sort((a, b) => a[1].faellig.localeCompare(b[1].faellig) || a[0].localeCompare(b[0])).map(([id]) => id);
  }
  function nachfrageKarte() {
    const ids = faelligeNachfragen().slice(0, 3); if (!ids.length) return;
    const k = document.createElement("section"); k.className = "nachfrage-karte"; k.id = "nachfrage";
    const id0 = eintrag("Ella fragt nach: Weißt du es noch? Zwei kurze Fragen – ganz ohne Sterne.", "Элла спрашивает: помнишь ещё? Два коротких вопроса – без звёзд.");
    k.innerHTML = `<div class="nachfrage-kopf"><span class="nachfrage-eule">${BI.eule("")}</span><p>${vt(id0)}${mini(id0)}</p></div><div class="nachfrage-knoepfe">` +
      ids.map(id => { const t = TH.find(x => x.id === id); return `<button class="knopf nachfrage-knopf" data-id="${id}"><span class="emoji">${t.e}</span> ${t.name}</button>`; }).join("") + `</div>`;
    k.querySelectorAll(".nachfrage-knopf").forEach(b => b.addEventListener("click", () => { S.ton("tipp"); starteNachfrage(b.dataset.id); }));
    $("themen").appendChild(k);
  }
  function starteNachfrage(id) {
    const t0 = TH.find(x => x.id === id), x = (daten().nachfrage || {})[id] || { stufe: 0 }, fr = nachfrageFragen(t0);
    // vorhersehbar: je Stufe die nächsten zwei Fragen des Themas (keine Zufallsauswahl)
    const w = [0, 1].map(k => fr[(x.stufe * 2 + k) % fr.length]).map(s => Object.assign({}, s, { __lz: t0.lz }));
    const t = { id: "nachfrage-" + id, nachfrage: id, name: "Ella fragt nach", e: "🦉", farbe: t0.farbe, grund: t0.grund, lz: t0.lz, kurz: "",
      schritte: [{ typ: "info", titel: `Weißt du es noch? ${t0.name}`, bild: t0.e, text: `Hallo {name}! Vor einer Weile hast du „${t0.name}“ entdeckt. Ich frage kurz nach: zwei Fragen.`,
        ru: "Привет, {name}! Недавно ты изучал(а) эту тему. Я коротко спрошу: два вопроса." }].concat(w) };
    TH.push(t); starte(TH.length - 1);
  }
  function beendeNachfrage() {
    const { t, fehler } = lauf, id = t.nachfrage;
    const i = TH.indexOf(t); if (i >= 0) TH.splice(i, 1);
    const d = daten(); d.nachfrage = d.nachfrage || {}; const x = d.nachfrage[id] || { stufe: 0 };
    let text;
    if (fehler === 0) {
      x.stufe++;
      if (x.stufe >= ABSTAND.length) { x.fertig = true; delete x.faellig; text = "Super, du weißt es noch! Das sitzt jetzt richtig fest."; }
      else { x.faellig = plusTage(heute(), ABSTAND[x.stufe]); text = `Super, du weißt es noch! Ella fragt in ${ABSTAND[x.stufe]} Tagen wieder nach.`; }
    } else { x.faellig = plusTage(heute(), 1); text = "Nicht schlimm! Morgen fragt Ella noch einmal nach. Du kannst das Thema auch jetzt noch einmal anschauen."; }
    d.nachfrage[id] = x; speichere(d);
    if (window.Charakter) Charakter.gib("sachkunde", 1);
    $("ende-titel").textContent = `Danke, ${name()}!`;
    $("ende-sterne").innerHTML = `<span style="animation-delay:180ms">🦉</span>`;
    $("ende-text").textContent = text;
    $("ende-gewinn").textContent = "Nachfragen gibt keine Sterne – sie helfen nur dem Gedächtnis.";
    const kn = $("ende-knoepfe"); kn.innerHTML = "";
    const knopf = (txt, haupt, fn) => { const b = document.createElement("button"); b.className = "knopf" + (haupt ? " haupt" : ""); b.textContent = txt; b.addEventListener("click", () => { S.ton("tipp"); fn(); }); kn.appendChild(b); };
    const j = TH.findIndex(y => y.id === id);
    if (fehler && j >= 0) knopf(`Thema anschauen: ${TH[j].name}`, false, () => starte(j));
    knopf("Zur Übersicht", true, () => { zeige("liste"); zeichneListe(); });
    zeige("ende"); S.ton("juhu");
  }

  $("zur-liste").addEventListener("click", () => { SP.stopp(); S.ton("tipp"); if (lauf && (lauf.t.lernstand || lauf.t.nachfrage)) { const i = TH.indexOf(lauf.t); if (i >= 0) TH.splice(i, 1); } lauf = null; zeige("liste"); zeichneListe(); });
  $("ru-schalter").addEventListener("click", () => { const d = daten(); d.ru = !d.ru; speichere(d); S.ton("tipp"); zeichneListe(); S.meldung(`${HL().name}-Hilfe ist ${d.ru ? "an" : "aus"}.`); });
  $("ton-vorlesen").addEventListener("click", () => { const d = daten(); d.vorlesen = !d.vorlesen; speichere(d); S.ton("tipp"); zeichneListe(); S.meldung(d.vorlesen ? "Vorlesen ist an." : "Vorlesen ist aus."); });

  if (FACH) { const n = FS[FACH].name + (FACH === "religion" && KONF ? (KONF === "ev" ? " (evangelisch)" : " (katholisch)") : ""); document.title = n; const h = document.querySelector("#liste-ansicht h1"); if (h) h.textContent = n; }
  zeichneListe();
  // ?thema=<id> (07.11.2026): direkt ein Thema öffnen – z. B. aus den Jahreszeiten-Episoden auf der Insel
  { const tq = new URLSearchParams(location.search).get("thema"), ti = tq ? TH.findIndex(t => t.id === tq) : -1; if (ti >= 0) starte(ti); }
  window.__sachkunde = { fach: FACH, themen: TH, starte, starteLernstand, lernstandThemen, transferFragen, nachfrage: faelligeNachfragen, starteNachfrage, schritt: (n) => { lauf.pos = n; schritt(); }, get lauf() { return lauf; } };
})();
