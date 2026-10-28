// Englisch mit Papagei Paula: Übersicht der Lektionen, Lektion aus Wortkarten, Hören, Lesen, Übersetzen, Satzbau und Wahl.
// Sichtbarkeit: wie Werkstatt und Sachthemen ab der Klasse vor der Lektions-Stufe; Eltern können Englisch schon ab Klasse 1 zeigen (eltern.englisch.ab = "1").
(function () {
  const S = window.Spielwelt, SP = window.Sprache, L = window.ENGLISCH || [], F = window.Figuren;
  const $ = (id) => document.getElementById(id);
  const HL = () => S.hilfe() || { code: "ru", kurz: "RU", tts: "ru-RU", name: "Russisch" };
  const mische = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const LOB = ["Great!", "Well done!", "Super!", "Fantastic!", "Yes!", "Brilliant!"];
  const name = () => S.profil.name || "du";
  const mitName = (t) => (t || "").replace(/\{name\}/g, name());

  function daten() { const d = Object.assign({ lektionen: {}, vorlesen: true, ru: true }, S.lade("englisch") || {}); if (!S.hilfeRu()) d.ru = false; return d; }
  function speichere(d) { S.speichere("englisch", d); }
  const bestes = (id) => daten().lektionen[id] || 0;
  const klasse = () => ((S.stufe && S.stufe()) || {}).klasse || 2;
  const frueh = () => (((S.lade("eltern") || {}).englisch || {}).ab === "1");
  const sichtbar = (k) => klasse() >= k.stufe - 1 || (frueh() && k.stufe <= 3);

  // Englische Stimme: britisch bevorzugt, sonst amerikanisch; ohne Stimme werden Hör-Aufgaben zu Lese-Aufgaben
  const EN = () => SP.hat("en-GB") ? "en-GB" : SP.hat("en-US") ? "en-US" : "en-GB";
  const hatEnglisch = () => SP.verfuegbar() && (SP.hat("en-GB") || SP.hat("en-US"));
  function paulaSpricht(an) { const f = $("paula-gross").firstElementChild; if (f) f.classList.toggle("spricht", an); }
  function sprichEn(text) { if (!text || !SP.verfuegbar()) return; paulaSpricht(true); SP.sprich(text, EN(), () => paulaSpricht(false)); }
  function sprichDe(text) { if (!daten().vorlesen || !text) return; paulaSpricht(true); SP.sprich(text, "de-DE", () => paulaSpricht(false)); }

  // ---------- Übersicht ----------
  function zeige(n) { ["liste", "lektion", "ende"].forEach(v => $(v + "-ansicht").hidden = v !== n); scrollTo(0, 0); }
  function zeichneListe() {
    $("sterne").textContent = S.sterne();
    $("paula-klein").innerHTML = F.papagei("");
    $("ton-vorlesen").textContent = daten().vorlesen ? "🗣️" : "🔇";
    const sicht = L.filter(sichtbar), fertig = sicht.filter(k => bestes(k.id) > 0).length;
    $("intro-text").textContent = !sicht.length ? `Hello ${name()}! Englisch beginnt in den meisten Bundesländern in Klasse 3. Bis bald! Deine Eltern können es im Elternbereich auch früher einschalten.`
      : fertig === 0 ? `Hello ${name()}! Ich bin Paula. Papageien sprechen gern nach – lass uns zusammen Englisch lernen!`
      : `Well done! Du hast schon ${fertig} ${fertig === 1 ? "Lektion" : "Lektionen"} geschafft.`;
    if (!hatEnglisch()) $("intro-text").textContent += " (Auf diesem Gerät fehlt eine englische Stimme – dann liest du die Wörter. Im Elternbereich steht, wie man eine Stimme installiert.)";
    $("lektionen").innerHTML = "";
    const jetzt = sicht.find(k => !bestes(k.id)), schule = +(((S.lade("eltern") || {}).englisch || {}).schule || 0);
    const kachel = (k) => {
      const best = bestes(k.id), b = document.createElement("button");
      b.className = "lek" + (k === jetzt ? " jetzt" : ""); b.style.setProperty("--f", k.grund); b.setAttribute("aria-label", k.name); b.dataset.id = k.id;
      b.innerHTML = `<span class="emoji">${k.e}</span><span>${k.name}</span><span class="stern-reihe">${best ? [1, 2, 3].map(n => `<span class="${n <= best ? "" : "leer"}">⭐</span>`).join("") : ""}</span>`;
      b.addEventListener("click", () => { S.ton("tipp"); starte(L.indexOf(k)); });
      return b;
    };
    // Schuljahr Englisch (28.10.2026): Lektionen nach den Lernbereichen des Lehrplans gruppiert; Kl.-3-Lektionen in Kl. 4 eingeklappt
    EN_LB.forEach(([nr, titel]) => {
      const alle = sicht.filter(k => (k.lb || 1) === nr).sort((a, b) => a.stufe - b.stufe || L.indexOf(a) - L.indexOf(b));
      if (!alle.length) return;
      const frueher = alle.filter(k => klasse() >= 4 && k.stufe < Math.min(4, klasse())), jetztL = alle.filter(k => !frueher.includes(k));
      const g = document.createElement("section"); g.className = "en-gruppe" + (nr === schule ? " schule" : ""); g.dataset.lb = nr;
      g.innerHTML = `<h3>${titel}${nr === schule ? ` <span class="schule-marke">📌 Gerade in der Schule</span>` : ""}</h3>` +
        (lernstandLektionen(nr).length ? `<button class="knopf lernstand-knopf" data-lb="${nr}">🎯 Zeig, was du kannst</button>` : "") + `<div class="lektionen"></div>`;
      const lk = g.querySelector(".lernstand-knopf"); if (lk) lk.addEventListener("click", () => { S.ton("tipp"); starteLernstand(nr); });
      jetztL.forEach(k => g.querySelector(".lektionen").appendChild(kachel(k)));
      if (frueher.length) {
        const d = document.createElement("details"); d.className = "frueher";
        d.innerHTML = `<summary>Wiederholen aus Klasse 3 (${frueher.length})</summary><div class="lektionen"></div>`;
        frueher.forEach(k => d.querySelector(".lektionen").appendChild(kachel(k)));
        g.appendChild(d);
      }
      if (nr === schule) $("lektionen").prepend(g); else $("lektionen").appendChild(g);   // „gerade in der Schule“ steht oben
    });
  }

  // ---------- Schuljahr Englisch: „Zeig, was du kannst“ je Lernbereich ----------
  // Wörter aus den Lektionen der eigenen Klasse (Kl. 3; Kl. 4: Kl. 3 und 4 – Spiralcurriculum), je Lektion bis zu 4, höchstens 10, ohne Sterne.
  // Ergebnis in englisch.lernstand["k<klasse>:<lb>"] = { am, n, richtig, je: { lektion: bool } }.
  const EN_LB = [[1, "👋 Me, my family and my friends"], [2, "👕 My body and my clothes"], [3, "🏠 At home"], [4, "🍎 Food and drink"], [5, "🛍️ Let's go shopping"],
    [6, "🏫 At school"], [7, "⚽ My hobbies"], [8, "🐶 Animals"], [9, "🚆 Let's go on a trip"], [10, "🎃 Around the year"], [11, "🛂 My Portfolio"]];
  const enKlasse = () => Math.max(3, Math.min(4, klasse()));
  const lernstandLektionen = (nr) => L.filter(k => (k.lb || 1) === nr && sichtbar(k) && k.stufe <= enKlasse());
  const pad2 = (n) => String(n).padStart(2, "0");
  const heute = () => { const d = window.__jetzt ? new Date(window.__jetzt) : new Date(); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };
  function starteLernstand(nr) {
    const lek = mische(lernstandLektionen(nr)), je = Math.min(4, Math.ceil(10 / Math.max(1, lek.length))), arten = hatEnglisch() ? ["hoeren", "deutsch", "lesen"] : ["lesen", "deutsch"];
    const schritte = mische([].concat(...lek.map(k => mische(k.woerter).slice(0, je).map(w => ({ wort: w, andere: mische(k.woerter.filter(x => x !== w)).slice(0, 2), __kap: k.id })))))
      .slice(0, 10).map((x, i) => Object.assign(x, { typ: arten[i % arten.length] }));
    const titel = (EN_LB.find(x => x[0] === nr) || [nr, ""])[1].replace(/^\S+\s/, "");
    const k = { id: "lernstand-" + nr, lernstand: nr, name: "Zeig, was du kannst", e: "🎯", farbe: "#7B55B8", grund: "#EFE6FF", lz: [...new Set([].concat(...lek.map(x => x.lz)))],
      schritte: [{ typ: "sag", text: `Show me! Zeig mir, was du in „${titel}“ schon kannst, {name}. Das ist kein Test mit Noten – nur ein Blick, was schon klappt.`,
        ru: "Покажи, что ты уже умеешь! Это не контрольная с оценками — просто посмотрим, что уже получается." }].concat(schritte) };
    starte(-1, k);
  }
  function beendeLernstand() {
    const { k } = lauf, je = {};
    k.schritte.forEach(x => { if (x.__kap) je[x.__kap] = !lauf.falsch.has(x.__kap); });
    const ids = Object.keys(je), gut = ids.filter(id => je[id]), ueben = ids.filter(id => !je[id]), nm = (id) => (L.find(x => x.id === id) || {}).name || id;
    const d = daten(); d.lernstand = d.lernstand || {}; d.lernstand[`k${enKlasse()}:${k.lernstand}`] = { am: heute(), n: ids.length, richtig: gut.length, je }; speichere(d);
    if (window.Charakter) Charakter.gib("englisch", 3);
    $("ende-titel").textContent = "Thank you – danke fürs Zeigen!";
    $("ende-sterne").innerHTML = `<span style="animation-delay:180ms">🎯</span>`;
    $("ende-text").textContent = (gut.length ? `Das kannst du schon: ${gut.slice(0, 4).map(nm).join(", ")}. ` : "") +
      (ueben.length ? `Das üben wir noch zusammen: ${ueben.slice(0, 3).map(nm).join(", ")}.` : "Alles beim ersten Mal richtig – Paula ist stolz auf dich!");
    $("ende-gewinn").textContent = "Das war kein Test mit Noten – nur ein Blick, was schon klappt.";
    const kn = $("ende-knoepfe"); kn.innerHTML = "";
    const knopf = (t, haupt, fn) => { const b = document.createElement("button"); b.className = "knopf" + (haupt ? " haupt" : ""); b.textContent = t; b.addEventListener("click", () => { S.ton("tipp"); fn(); }); kn.appendChild(b); };
    const erste = ueben.length ? L.findIndex(x => x.id === ueben[0]) : -1;
    if (erste >= 0) knopf(`Üben: ${L[erste].name}`, true, () => starte(erste));
    knopf("Zur Übersicht", erste < 0, () => { zeige("liste"); zeichneListe(); });
    zeige("ende"); S.ton("juhu");
  }

  // ---------- Lektion: Schritte aus den Wörtern erzeugen ----------
  function baue(k) {
    const w = k.woerter, quiz = mische(w).slice(0, 6), arten = hatEnglisch() ? ["hoeren", "lesen", "deutsch"] : ["lesen", "deutsch", "lesen"];
    const ablenker = (x) => mische(w.filter(y => y !== x)).slice(0, 2);
    return [{ typ: "sag", text: k.intro.de, ru: k.intro.ru }, { typ: "karten" }]
      .concat(quiz.map((x, i) => ({ typ: arten[i % 3], wort: x, andere: ablenker(x) })))
      .concat(k.extra || [])
      .concat([{ typ: "sag", text: k.ende.de, ru: k.ende.ru, letzte: true }]);
  }

  let lauf = null;
  function starte(i, lernstand) {
    const k = lernstand || L[i];
    lauf = { i, k, schritte: k.lernstand ? k.schritte : baue(k), pos: 0, fehler: 0, falsch: new Set() };
    document.body.style.setProperty("--grund", k.grund); document.body.style.setProperty("--akzent", k.farbe);
    $("lektion-name").textContent = k.name;
    $("paula-gross").innerHTML = F.papagei("papagei");
    zeige("lektion"); schritt();
  }

  function blase(html, gesprochen, ru) {
    const d = daten();
    $("blase").innerHTML = mitName(html) + `<div class="blase-knoepfe">` + (SP.verfuegbar() ? `<button class="klein-knopf" id="nochmal" aria-label="Nochmal vorlesen">🔊</button>` : "") +
      (d.ru && ru ? `<button class="klein-knopf" id="ru-knopf" lang="${HL().code}">${HL().kurz}</button>` : "") + `</div><p class="ru-text" id="ru-text" lang="${HL().code}" hidden></p>`;
    const nh = $("nochmal"); if (nh) nh.addEventListener("click", () => SP.sprich(mitName(gesprochen), "de-DE"));
    const rk = $("ru-knopf"); if (rk) rk.addEventListener("click", () => { const r = $("ru-text"); r.hidden = !r.hidden; r.textContent = mitName(ru); if (!r.hidden && SP.hat(HL().tts)) SP.sprich(mitName(ru), HL().tts); });
    if (gesprochen) sprichDe(mitName(gesprochen));
  }
  const hinweis = `<p class="hinweis" id="hinweis"></p>`;
  const weiterKnopf = (t = "Weiter") => `<button class="knopf weiter" id="weiter">${t}</button>`;
  const aufWeiter = () => $("weiter").addEventListener("click", () => { S.ton("tipp"); weiter(); });

  function schritt() {
    const s = lauf.schritte[lauf.pos], A = $("aufgabe"), k = lauf.k;
    $("balken").style.width = Math.round(lauf.pos / lauf.schritte.length * 100) + "%";
    if (!s) return beende();
    lauf.versuche = 0; lauf.gesperrt = false;
    A.scrollTop = 0;
    switch (s.typ) {
      case "sag":
        blase(s.text, s.text, s.ru);
        A.innerHTML = `<div class="gross-emoji" aria-hidden="true">${k.e}</div>` + weiterKnopf(s.letzte ? "Fertig!" : "Weiter"); aufWeiter(); break;
      case "karten": {
        blase("Tippe auf jede Karte, hör zu und sprich laut nach!", "Tippe auf jede Karte, hör zu und sprich laut nach!", "Нажимай на каждую карточку, слушай и повторяй вслух!");
        const d = daten();
        A.innerHTML = `<div class="wortkarten">` + k.woerter.map((w, n) => `<button class="wortkarte" data-n="${n}"><span class="e" aria-hidden="true">${w.e}</span><b lang="en">${w.en}</b><small>${w.de}${d.ru && S.hilfeRu() && w.ru ? ` · <span lang="${HL().code}">${w.ru}</span>` : ""}</small></button>`).join("") + `</div>` + weiterKnopf();
        A.querySelectorAll(".wortkarte").forEach(b => b.addEventListener("click", () => { b.classList.add("gehoert"); sprichEn(k.woerter[+b.dataset.n].en); }));
        aufWeiter(); break;
      }
      case "hoeren": case "lesen": {
        const opts = mische([s.wort, ...s.andere]);
        if (s.typ === "hoeren") blase("Hör zu! Welches Bild passt?", "Hör zu! Welches Bild passt?", "Слушай! Какая картинка подходит?");
        else blase("Lies das Wort. Welches Bild passt?", "Lies das Wort. Welches Bild passt?", "Прочитай слово. Какая картинка подходит?");
        A.innerHTML = (s.typ === "hoeren" ? `<button class="hoeren-knopf" id="hoeren" aria-label="Anhören">🔊</button>` : `<div class="en-wort" lang="en">${s.wort.en}</div>`) +
          `<div class="optionen bilder">` + opts.map((o, n) => `<button class="option" data-n="${n}" aria-label="Bild ${n + 1}"><span class="e">${o.e}</span></button>`).join("") + `</div>` + hinweis;
        if (s.typ === "hoeren") { $("hoeren").addEventListener("click", () => sprichEn(s.wort.en)); setTimeout(() => sprichEn(s.wort.en), 900); }
        A.querySelectorAll(".option").forEach(b => b.addEventListener("click", () => antwort(b, opts[+b.dataset.n] === s.wort, s.wort.en, `${s.wort.en} = ${s.wort.de}`)));
        break;
      }
      case "deutsch": {
        const opts = mische([s.wort, ...s.andere]);
        blase(`Wie heißt das auf Englisch? <b>${s.wort.de}</b>`, `Wie heißt das auf Englisch? ${s.wort.de}`, s.wort.ru ? `Как это по-английски? ${s.wort.ru}` : "Как это по-английски?");
        A.innerHTML = `<div class="gross-emoji" aria-hidden="true">${s.wort.e}</div><div class="optionen texte">` + opts.map((o, n) => `<button class="option" data-n="${n}" lang="en">${o.en}</button>`).join("") + `</div>` + hinweis;
        A.querySelectorAll(".option").forEach(b => b.addEventListener("click", () => antwort(b, opts[+b.dataset.n] === s.wort, s.wort.en, `${s.wort.de} = ${s.wort.en}`)));
        break;
      }
      case "wahl": {
        const opts = mische(s.optionen.map((t, n) => ({ t, ok: n === 0 })));
        blase(s.frage, s.frage, s.ru);
        A.innerHTML = (s.e ? `<div class="gross-emoji" aria-hidden="true">${s.e}</div>` : "") + `<div class="optionen texte">` + opts.map((o, n) => `<button class="option" data-n="${n}" lang="en">${o.t}</button>`).join("") + `</div>` + hinweis;
        A.querySelectorAll(".option").forEach(b => b.addEventListener("click", () => antwort(b, opts[+b.dataset.n].ok, s.optionen[0], s.warum || "")));
        break;
      }
      case "satz": {
        blase(s.de + " Tippe die Wörter der Reihe nach an.", s.de, s.ru);
        lauf.gewaehlt = [];
        let chips = mische(s.woerter.map((w, idx) => ({ w, idx }))); if (chips.every((c, n) => c.idx === n)) chips = chips.reverse();
        A.innerHTML = (s.e ? `<div class="gross-emoji klein" aria-hidden="true">${s.e}</div>` : "") + `<div class="satz-zeile" id="satz-zeile" lang="en"></div><div class="chips" id="chips" lang="en">` +
          chips.map((c, n) => `<button class="chip" data-n="${n}">${c.w}</button>`).join("") + `</div><button class="knopf haupt pruefen" id="pruefen" disabled>Fertig</button>` + hinweis;
        const zeile = $("satz-zeile"), pr = $("pruefen");
        const zeichne = () => {
          zeile.innerHTML = lauf.gewaehlt.map((n, pos) => `<button class="chip" data-pos="${pos}">${chips[n].w}</button>`).join("");
          A.querySelectorAll("#chips .chip").forEach(c => c.classList.toggle("weg", lauf.gewaehlt.includes(+c.dataset.n)));
          pr.disabled = lauf.gewaehlt.length !== chips.length;
          zeile.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => { if (lauf.gesperrt) return; lauf.gewaehlt.splice(+c.dataset.pos, 1); S.ton("tipp"); zeichne(); }));
        };
        A.querySelectorAll("#chips .chip").forEach(c => c.addEventListener("click", () => {
          if (lauf.gesperrt || lauf.gewaehlt.includes(+c.dataset.n)) return; lauf.gewaehlt.push(+c.dataset.n); S.ton("tipp"); sprichEn(chips[+c.dataset.n].w); zeichne(); }));
        pr.addEventListener("click", () => {
          const richtig = lauf.gewaehlt.every((n, pos) => chips[n].w === s.woerter[pos]),   // Wortlaut zählt – doppelte Wörter („I like … I like …“) sind austauschbar
          satz = s.woerter.join(" ");
          if (richtig) { zeile.classList.add("richtig"); antwort(null, true, satz, ""); return; }
          antwort(null, false, satz, "");
          if (lauf.versuche >= 2) { lauf.gewaehlt = s.woerter.map((_, pos) => chips.findIndex(c => c.idx === pos)); zeichne(); zeile.classList.add("richtig"); lauf.gesperrt = true;
            $("hinweis").textContent = "So heißt der Satz:"; pr.remove(); A.insertAdjacentHTML("beforeend", weiterKnopf()); aufWeiter(); sprichEn(satz); return; }
          const erste = lauf.gewaehlt.findIndex((n, pos) => chips[n].idx !== pos); lauf.gewaehlt = lauf.gewaehlt.slice(0, Math.max(0, erste)); zeichne();
        });
        break;
      }
    }
  }

  // Gemeinsame Prüfung: richtig → loben, englisch vorsprechen, Erklärung zeigen, weiter. Falsch → nochmal (erster Fehler zählt).
  function antwort(knopf, richtig, englisch, erklaerung) {
    if (lauf.gesperrt) return;
    const h = $("hinweis"), lz = lauf.k.lz;
    if (richtig) {
      lauf.gesperrt = true;
      if (lauf.versuche === 0 && window.Charakter) Charakter.gib("englisch", 1);
      if (lauf.versuche === 0 && window.Koennen) Koennen.melde(lz, true);
      if (knopf) knopf.classList.add("richtig");
      document.querySelectorAll("#aufgabe .option").forEach(o => o.disabled = true);
      h.className = "hinweis gut"; h.innerHTML = `${LOB[Math.floor(Math.random() * LOB.length)]}${erklaerung ? ` <span class="erklaerung">${erklaerung}</span>` : ""}`;
      S.ton("juhu"); setTimeout(() => sprichEn(englisch), 250);
      const dieser = lauf, an = lauf.pos;
      setTimeout(() => { if (lauf !== dieser || lauf.pos !== an) return; weiter(); }, 2300);
      return;
    }
    lauf.versuche++;
    if (lauf.versuche === 1) { lauf.fehler++; if (window.Koennen) Koennen.melde(lz, false); const sj = lauf.schritte[lauf.pos]; if (sj && sj.__kap) lauf.falsch.add(sj.__kap); }
    S.ton("nein"); if (knopf) { knopf.classList.add("falsch"); knopf.disabled = true; }
    h.className = "hinweis nein"; h.textContent = "Fast! Try again – versuch es nochmal.";
  }
  function weiter() { SP.stopp(); lauf.pos++; schritt(); }

  function beende() {
    if (lauf.k.lernstand) return beendeLernstand();
    const { k, fehler } = lauf, sterne = fehler <= 1 ? 3 : fehler <= 3 ? 2 : 1, vorher = bestes(k.id);
    let gewinn = Math.max(0, sterne - vorher); if (vorher === 3 && sterne === 3) gewinn = 1;
    const d = daten(); d.lektionen[k.id] = Math.max(vorher, sterne); speichere(d);
    if (gewinn) S.gibSterne(gewinn);
    if (window.Lernfunde) Lernfunde.merke({ fach: "englisch", art: "woerter", e: k.e, schluessel: "en:" + k.id, text: `Englisch: ${k.woerter.slice(0, 4).map(w => `${w.en} = ${w.de}`).join(", ")}` });
    if (window.Charakter) { Charakter.gib("englisch", 5); Charakter.ereignis("englisch-lektion"); }
    $("ende-titel").textContent = `${k.name}: well done!`;
    $("ende-sterne").innerHTML = [1, 2, 3].map(n => `<span class="${n <= sterne ? "" : "leer"}" style="animation-delay:${n * 180}ms">⭐</span>`).join("");
    $("ende-text").textContent = fehler === 0 ? "Alles beim ersten Mal richtig! Paula ist stolz auf dich." : `Geschafft! ${fehler} ${fehler === 1 ? "Aufgabe brauchte" : "Aufgaben brauchten"} einen zweiten Versuch.`;
    $("ende-gewinn").textContent = gewinn ? `+${gewinn} ${gewinn === 1 ? "Stern" : "Sterne"}. Du hast jetzt ${S.sterne()}.` : `Du hast ${S.sterne()} Sterne.`;
    const kn = $("ende-knoepfe"); kn.innerHTML = "";
    const knopf = (t, haupt, fn) => { const b = document.createElement("button"); b.className = "knopf" + (haupt ? " haupt" : ""); b.textContent = t; b.addEventListener("click", () => { S.ton("tipp"); fn(); }); kn.appendChild(b); };
    const sicht = L.filter(sichtbar), naechste = sicht[sicht.indexOf(k) + 1];
    if (naechste) knopf(`Weiter: ${naechste.name}`, true, () => starte(L.indexOf(naechste)));
    knopf("Zur Übersicht", !naechste, () => { zeige("liste"); zeichneListe(); });
    zeige("ende"); S.ton("juhu");
  }

  $("zur-liste").addEventListener("click", () => { SP.stopp(); S.ton("tipp"); lauf = null; zeige("liste"); zeichneListe(); });
  $("ton-vorlesen").addEventListener("click", () => { const d = daten(); d.vorlesen = !d.vorlesen; speichere(d); S.ton("tipp"); zeichneListe(); S.meldung(d.vorlesen ? "Deutsche Erklärungen werden vorgelesen." : "Deutsche Erklärungen werden nicht vorgelesen. Englische Wörter hörst du weiter."); });

  zeichneListe();
  window.__englisch = { starte, starteLernstand, lernstandLektionen, schritt: (n) => { lauf.pos = n; schritt(); }, get lauf() { return lauf; }, sichtbar: () => L.filter(sichtbar).map(k => k.id) };
})();
