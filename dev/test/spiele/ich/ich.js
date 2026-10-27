(function () {
  const S = window.Spielwelt, C = window.Charakter, SP = window.Sprache, W = window.WOERTER;
  const $ = (id) => document.getElementById(id);
  const name = () => S.profil.name || "Du";
  const ruAn = () => { const d = S.lade("deutsch"); return S.hilfeRu() && (!d || d.ru !== false); };
  const HL = () => S.hilfe() || { code: "ru", kurz: "RU", tts: "ru-RU", name: "Russisch" };

  function zufall(seed) {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
    return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const mische = (a, r = Math.random) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // ---------- Übersicht ----------
  function zeichne() {
    $("sterne").textContent = S.sterne();
    const look = (S.lade("anziehen") || {}).aktuell || window.Figur.STANDARD();
    $("portraet").innerHTML = `<svg viewBox="55 20 190 220" aria-label="Deine Figur">${window.Figur.zeichneFigur(look)}</svg>`;
    $("name").textContent = name();
    const tier = window.TierPflege && TierPflege.lade();
    if (tier && tier.phase === "tier") $("tier-link").textContent = `🐾 ${tier.name || "Mein Tier"} (${Tiere.ARTEN[tier.art].name})`;
    else if (tier && tier.phase === "ei") $("tier-link").textContent = "🥚 Mein Ei";
    $("titel").textContent = C.titel();
    // Tablet-Führerschein (Schlüssel zur Insel): Fortschritt, oder der fertige Führerschein zum Ansehen
    const md = S.lade("medien") || {}, anz = (window.LEKTIONEN || []).length || 6, ok = Object.values(md.lektionen || {}).filter(x => x > 0).length;
    const fs = $("fs-link");
    if (md.fuehrerschein) { fs.textContent = "🪪 Mein Tablet-Führerschein"; fs.href = "../medien/#fuehrerschein"; }
    else { fs.textContent = `🪪 Tablet-Führerschein: ${ok} von ${anz}`; fs.href = "../medien/"; }
    $("gesamt").textContent = `Gesamtstufe ${C.gesamt()} von ${C.FAEHIGKEITEN.length * C.MAX}`;

    // Superkräfte (Vorteile)
    const vorteile = [];
    const ueberholt = { "ballon-zeit-5": "ballon-zeit-10", "schrank-18": "schrank-24" };
    C.FAEHIGKEITEN.forEach(f => Object.entries(C.BELOHNUNGEN[f.id]).forEach(([st, b]) => {
      if (b.vorteil && C.hat(b.vorteil) && !(ueberholt[b.vorteil] && C.hat(ueberholt[b.vorteil]))) vorteile.push(`${f.icon} ${b.text}`);
    }));
    $("vorteile").innerHTML = vorteile.length ? `<h3>Meine Superkräfte</h3>` + vorteile.map(v => `<div class="vorteil">${v}</div>`).join("")
      : `<p class="klein">Superkräfte bekommst du, wenn deine Fähigkeiten wachsen.</p>`;

    // Tagesaufgaben
    const d = new Date();
    $("datum").textContent = d.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });
    const liste = C.aufgaben();
    $("aufgaben").innerHTML = liste.map(a => `<div class="aufgabe ${a.erledigt ? "fertig" : ""}">
        <span class="emoji" aria-hidden="true">${a.emoji}</span>
        <div><b>${a.titel}</b><span>${a.text}</span></div>
        ${a.erledigt ? `<span class="haken" aria-label="Geschafft">✓</span>` : `<a class="knopf haupt" href="${a.link}" data-id="${a.id}">Los</a>`}
      </div>`).join("") +
      `<p class="klein">Jede Aufgabe: +1 ⭐. Alle drei: ein Stempel und +2 ⭐.</p>`;
    $("aufgaben").querySelectorAll('[data-id="wort"]').forEach(b => b.addEventListener("click", (e) => { e.preventDefault(); S.ton("tipp"); starteWort(); }));

    zeichneFunde(); zeichneKoennen(); zeichneGemeinsam(); zeichneEchteWelt(); zeichneWoche(); zeichneStaerken();

    // Woche
    const montag = C.wocheVon(C.heute()), stempel = C.stempel();
    const tage = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
    const [y, m, t] = montag.split("-").map(Number);
    $("woche").innerHTML = tage.map((n, i) => {
      const dt = new Date(y, m - 1, t + i);
      const iso = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
      const g = stempel.includes(iso);
      return `<div class="tag ${g ? "gestempelt" : ""} ${iso === C.heute() ? "heute" : ""}">${n}<span class="st">${g ? "✓" : ""}</span></div>`;
    }).join("");
    const tr = C.wochenTruhe(), tb = $("truhe");
    tb.className = "truhe" + (tr.bereit ? " bereit" : "");
    tb.innerHTML = tr.offen ? `<span class="gross">🎉</span><p>Die Wochentruhe hast du schon geöffnet. Nächste Woche gibt es eine neue!</p>`
      : tr.bereit ? `<span class="gross">🎁</span><p>Die Wochentruhe ist bereit!</p><button class="knopf haupt" id="truhe-auf">Öffnen</button>`
      : `<span class="gross" style="filter:grayscale(.6);opacity:.6">🎁</span><p>Noch ${tr.ziel - tr.tage} ${tr.ziel - tr.tage === 1 ? "Stempel" : "Stempel"} bis zur Wochentruhe (5 Sterne).</p>`;
    const ta = $("truhe-auf");
    if (ta) ta.addEventListener("click", () => { const n = C.oeffneTruhe(); if (n) { C.hinweis("🎁 Wochentruhe!", `+${n} ⭐ für den Kleiderschrank`, "#D08A1E"); } zeichne(); });

    // Fähigkeiten
    $("faehigkeiten").innerHTML = C.FAEHIGKEITEN.map(f => {
      const p = C.fortschritt(f.id);
      return `<button class="fh" style="--f:${f.farbe}" data-f="${f.id}">
        <div class="fh-kopf"><span class="i" aria-hidden="true">${f.icon}</span><b>${f.name}</b><span class="stufe">Stufe ${p.stufe}</span></div>
        <div class="balken"><span style="width:${Math.round(p.anteil * 100)}%"></span></div>
        <p>${p.naechste ? `Noch ${p.fehlt} Punkte bis Stufe ${p.stufe + 1}: <b>${p.naechste}</b>` : "Höchste Stufe erreicht!"}</p>
      </button>`;
    }).join("");
    $("faehigkeiten").querySelectorAll(".fh").forEach(b => b.addEventListener("click", () => { S.ton("tipp"); zeigeStufen(b.dataset.f); }));
  }

  // Heute neu: konkrete Lernfunde des Tages (shared/lernfunde.js)
  // NA-50: Können je Fach als wachsende Pflanze – ohne Noten, ohne Prozentzahlen. Erst sichtbar, wenn etwas geübt wurde.
  const PFLANZEN = ["🌰", "🌱", "🌿", "🪴", "🌳"];
  const KN_FAECHER = [["Mathe", "🦫", ["ma."]], ["Deutsch", "🦊", ["de.", "daz."]], ["Sachunterricht", "🦉", ["su."]]];
  function zeichneKoennen() {
    const el = $("koennen"), K = window.Koennen; if (!el || !K) return;
    const d = K.daten(), ids = Object.keys(d);
    const faecher = KN_FAECHER.map(([name, e, vor]) => {
      const meine = ids.filter(z => vor.some(v => z.startsWith(v)));
      if (!meine.length) return null;
      const st = meine.map(z => K.stand(d[z])), sicher = st.filter(x => x >= 3).length;
      const mittel = Math.round(st.reduce((a, b) => a + b, 0) / st.length);
      return `<div class="kn-fach" data-fach="${name}"><div class="pflanze" aria-hidden="true">${PFLANZEN[mittel]}</div><b>${e} ${name}</b>
        <small>${sicher ? `${sicher} ${sicher === 1 ? "Sache kannst" : "Sachen kannst"} du schon sicher` : "wächst gerade"}</small></div>`;
    }).filter(Boolean);
    $("koennen-karte").hidden = !faecher.length;
    el.innerHTML = faecher.join("");
  }
  function zeichneFunde() {
    const el = $("heute-neu"); if (!el || !window.Lernfunde) return;
    const funde = Lernfunde.heute(), hl = S.hilfe(), F = Lernfunde.FAECHER;
    if (!funde.length) {
      el.innerHTML = `<div class="heute-leer"><span aria-hidden="true">🌱</span><p style="margin:0">Hier wächst, was du heute Neues lernst. Fang mit einer Tagesaufgabe an!</p></div>`;
      return;
    }
    const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    el.innerHTML = funde.slice().reverse().map((f, i) => `<div class="fund ${f.a === "gemeistert" ? "gemeistert" : ""}" style="animation-delay:${i * 90}ms">
        <span class="emoji" aria-hidden="true">${f.e}</span>
        <div><span class="fach">${F[f.f] ? F[f.f].e + " " + F[f.f].name : ""}</span><b>${esc(f.t)}</b>
        ${f.r && hl ? `<span class="zwei" lang="${hl.code}">🌍 Auf ${hl.name}: ${esc(f.r)} – du kennst es in zwei Sprachen!</span>` : ""}
        ${f.x ? `<span class="erklaert">❤️ Einem Erwachsenen erklärt</span>` : `<button class="knopf erklaeren" data-s="${esc(f.s)}">🗣️ Erklären</button>`}</div>
      </div>`).join("") +
      `<p class="erzaehl">🌳 Auf der Insel ${funde.length === 1 ? "hängt jetzt eine neue Frucht" : `hängen jetzt ${funde.length} neue Früchte`} an deinem Wissensbaum.</p>` +
      `<p class="erzaehl">🗣️ Erzähl heute jemandem, was du Neues weißt!</p>`;
  }

  // ---------- Gemeinsam: Erklär-Moment (Erwachsene bestätigen mit der PIN) ----------
  let erklaerFund = null;
  function oeffneErklaeren(schl) {
    const funde = window.Lernfunde ? Lernfunde.heute() : [];
    const f = schl ? funde.find(x => x.s === schl) : funde.slice().reverse().find(x => !x.x);
    if (!f) { S.meldung && S.meldung("Lern zuerst etwas Neues – dann kannst du es erklären!"); return; }
    erklaerFund = f;
    $("erklaer-fund").innerHTML = `<span class="e" aria-hidden="true">${f.e}</span><span></span>`; $("erklaer-fund").lastChild.textContent = f.t;
    $("erklaer-pin").value = ""; $("erklaer-fehler").textContent = ""; $("erklaer-dialog").hidden = false; S.ton("tipp");
  }
  $("erklaer-start").addEventListener("click", () => oeffneErklaeren(null));
  $("erklaer-zu").addEventListener("click", () => { $("erklaer-dialog").hidden = true; S.ton("tipp"); });
  $("erklaer-ok").addEventListener("click", () => {
    if (!S.pinStimmt($("erklaer-pin").value)) { $("erklaer-fehler").textContent = "Die PIN stimmt nicht."; $("erklaer-pin").value = ""; S.ton("nein"); return; }
    if (erklaerFund && Lernfunde.erklaert(Lernfunde.datumHeute(), erklaerFund.s)) { if (window.Familie) Familie.merke("erklaert", erklaerFund.t); C.gib("deutsch", 2); }
    $("erklaer-dialog").hidden = true; C.hinweis("❤️ Gut erklärt!", "Wer etwas erklärt, behält es besonders gut.", "#C2337A"); zeichne();
  });
  $("heute-neu").addEventListener("click", (e) => { const b = e.target.closest(".erklaeren"); if (b) oeffneErklaeren(b.dataset.s); });
  function zeichneGemeinsam() {
    const el = $("gemeinsam-zahl"); if (!el || !window.Familie) return;
    const n = Familie.letzteTage(7).length;
    el.textContent = n ? `❤️ Diese Woche ${n === 1 ? "ein gemeinsamer Moment" : `${n} gemeinsame Momente`}` : "";
  }

  // ---------- Echte Welt: eine freiwillige Aufgabe weg vom Bildschirm ----------
  function zeichneEchteWelt() {
    const el = $("ew"); if (!el || !window.EchteWelt) return;
    const a = EchteWelt.heutige(); if (!a) { $("ew-karte").hidden = true; return; }
    const hl = S.hilfe(), ru = hl && hl.code === "ru" ? a.ru : "";
    el.innerHTML = `<div class="ew-aufgabe"><span class="emoji" aria-hidden="true">${a.e}</span><div><span class="bereich">${a.bereichName}</span><b></b>${ru ? `<span class="ru" lang="ru"></span>` : ""}</div></div>` +
      (a.erledigt ? `<p class="ew-fertig">✅ Geschafft! Super gemacht – das war echtes Leben statt Bildschirm.</p>`
        : `<div class="ew-knoepfe"><button class="knopf haupt" id="ew-geschafft">✅ Geschafft!</button>${a.wechselUebrig > 0 ? `<button class="knopf" id="ew-andere">🔄 Andere Idee (${a.wechselUebrig})</button>` : ""}</div>`);
    el.querySelector("b").textContent = a.text; if (ru) el.querySelector(".ru").textContent = ru;
    const g = $("ew-geschafft"); if (g) g.addEventListener("click", () => {
      S.ton("tipp");
      if (EchteWelt.selbstAbhaken()) { if (EchteWelt.geschafft()) { C.hinweis("🌍 Echte Welt geschafft!", "+1 ⭐ – und eine neue Frucht für deinen Wissensbaum.", "#2E9C5A"); } zeichne(); return; }
      $("ew-was").innerHTML = `<span class="e" aria-hidden="true">${a.e}</span><span></span>`; $("ew-was").lastChild.textContent = a.text;
      $("ew-pin").value = ""; $("ew-fehler").textContent = ""; $("ew-dialog").hidden = false;
    });
    const an = $("ew-andere"); if (an) an.addEventListener("click", () => { S.ton("tipp"); EchteWelt.andere(); zeichneEchteWelt(); });
  }
  $("ew-zu").addEventListener("click", () => { $("ew-dialog").hidden = true; S.ton("tipp"); });
  $("ew-ok").addEventListener("click", () => {
    if (!S.pinStimmt($("ew-pin").value)) { $("ew-fehler").textContent = "Die PIN stimmt nicht."; $("ew-pin").value = ""; S.ton("nein"); return; }
    $("ew-dialog").hidden = true;
    if (EchteWelt.geschafft()) C.hinweis("🌍 Echte Welt geschafft!", "+1 ⭐ – und eine neue Frucht für deinen Wissensbaum.", "#2E9C5A");
    zeichne();
  });

  // ---------- Wochen-Herausforderung (shared/schatz.js) ----------
  function zeichneWoche() {
    const el = $("woche-ch"); if (!el || !window.Schatz) return;
    const w = Schatz.woche();
    el.innerHTML = `<div class="kopf"><span class="e" aria-hidden="true">${w.e}</span><p>Wochen-Herausforderung: ${w.text}</p><b>${w.wert}/${w.ziel}</b></div>
      <div class="balken"><span style="width:${Math.round(w.wert / w.ziel * 100)}%"></span></div>` +
      (w.fertig ? `<p class="klein" style="margin-top:6px">🥇 Geschafft! Am Montag kommt eine neue.</p>` : w.bereit ? `<button class="knopf haupt" id="woche-ab">🥇 Medaille abholen (+3 ⭐)</button>` : "");
    const b = $("woche-ab"); if (b) b.addEventListener("click", () => { if (Schatz.abholen()) C.hinweis("🥇 Wochen-Medaille!", "+3 ⭐ – sie hängt jetzt in deiner Schatzkammer.", "#D08A1E"); zeichne(); });
    Schatz.neuePokale().forEach(p => C.hinweis(`🏆 Neuer Pokal: ${p.e} ${p.name}`, `${p.text} – schau in deine Schatzkammer!`, "#D08A1E"));
  }

  // ---------- Was ich gut kann (shared/staerken.js) ----------
  const QUELLE = { selbst: "🙋", app: "🔍", eltern: "❤️" };
  function zeichneStaerken() {
    const el = $("staerken-inhalt"); if (!el || !window.Staerken) return;
    const ST = window.Staerken, meine = ST.meine(), d = ST.lade(), neuE = d.gesehen.filter(g => g.neu), bem = ST.bemerkt()[0], esc = (t) => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    el.innerHTML =
      neuE.map(g => `<div class="st-eltern">❤️ <b>Deine Eltern haben gesehen:</b> Du kannst gut ${esc(ST.A[g.id][2])}.${g.t ? `<br>„${esc(g.t)}“` : ""}</div>`).join("") +
      (bem ? `<div class="st-bemerkt">🔍 <b>Bruni hat bemerkt:</b> ${esc(bem[1])} Kannst du gut ${esc(ST.A[bem[0]][2])}?<br><button class="knopf haupt" data-st-ja="${bem[0]}">Ja, stimmt!</button><button class="knopf" data-st-nein="${bem[0]}">Eher nicht</button></div>` : "") +
      (meine.length ? `<div class="st-liste">${meine.map(m => `<span class="st-chip">${m.e} ${esc(m.text)} <small>${m.quelle.map(q => QUELLE[q]).join("")}</small></span>`).join("")}</div>`
        : `<p class="klein" style="margin-bottom:10px">Jeder kann etwas besonders gut. Was ist es bei dir? Kreuze es an!</p>`);
    if (neuE.length) setTimeout(() => ST.gesehenGelesen(), 4000);
    el.querySelectorAll("[data-st-ja]").forEach(b => b.addEventListener("click", () => { ST.antwortApp(b.dataset.stJa, true); S.ton("juhu"); zeichneStaerken(); }));
    el.querySelectorAll("[data-st-nein]").forEach(b => b.addEventListener("click", () => { ST.antwortApp(b.dataset.stNein, false); S.ton("tipp"); zeichneStaerken(); }));
  }
  function staerkenWahl() {
    const ST = window.Staerken, d = ST.lade(), hl = S.hilfe();
    $("st-wahl").innerHTML = ST.STAERKEN.filter(x => x[0] !== "sprachen" || hl).map(([id, e, t, r]) => `<button class="${d.selbst.includes(id) ? "an" : ""}" data-st="${id}"><span class="e">${e}</span>${t}${hl && hl.code === "ru" ? `<br><small lang="ru">${r}</small>` : ""}</button>`).join("");
  }
  $("staerken-waehlen").addEventListener("click", () => { S.ton("tipp"); staerkenWahl(); $("staerken-dialog").hidden = false; });
  $("st-wahl").addEventListener("click", e => { const b = e.target.closest("[data-st]"); if (!b) return; const an = !b.classList.contains("an"); window.Staerken.setzeSelbst(b.dataset.st, an); b.classList.toggle("an", an); S.ton("tipp"); });
  $("st-fertig").addEventListener("click", () => { $("staerken-dialog").hidden = true; zeichneStaerken(); S.ton("tipp"); });

  function zeigeStufen(id) {
    const f = C.FAEHIGKEITEN.find(x => x.id === id), st = C.stufe(id);
    $("stufen-titel").textContent = `${f.icon} ${f.name}`;
    $("stufen-woher").textContent = `Wächst durch: ${f.woher} und Tagesaufgaben.`;
    $("stufen-liste").innerHTML = [...Array(C.MAX - 1)].map((_, i) => {
      const s = i + 2, b = C.BELOHNUNGEN[id][s] || { sterne: 2 };
      return `<li class="${s <= st ? "erreicht" : ""}"><b>${s <= st ? "✓" : "🔒"} Stufe ${s}</b>${b.text || `${b.sterne} Sterne`}</li>`;
    }).join("");
    $("stufen-dialog").hidden = false;
  }
  $("stufen-zu").addEventListener("click", () => { S.ton("tipp"); $("stufen-dialog").hidden = true; });

  // ---------- Wort des Tages ----------
  let quiz = null;
  function wortDesTages() { const r = zufall("wort|" + C.heute()); return W[Math.floor(r() * W.length)]; }
  function falschePlurale(x) {
    const kandidaten = [x.w, x.w + "e", x.w + "en", x.w + "s", x.w + "n", x.w.replace(/a/, "ä") + "e"].filter(k => k !== x.p);
    return mische([...new Set(kandidaten)]).slice(0, 2);
  }
  function starteWort() {
    const r = zufall("quiz|" + C.heute());
    const heute = wortDesTages();
    const andere = mische(W.filter(x => x !== heute), r);
    const mitPlural = andere.find(x => x.p && x.p !== x.w) || heute;
    const fragen = [
      { typ: "intro", x: heute },
      { typ: "artikel", x: heute },
      { typ: "artikel", x: andere[0] },
      { typ: "bild", x: andere[1], opts: mische([andere[1], andere[2], andere[3]], r) },
      { typ: "plural", x: mitPlural, opts: mische([mitPlural.p, ...falschePlurale(mitPlural)], r) },
      { typ: "hoeren", x: heute, opts: mische([heute, andere[4], andere[5]], r) }
    ];
    quiz = { fragen, pos: 0, fehler: 0 };
    $("haupt-ansicht").hidden = true; $("wort-ansicht").hidden = false; scrollTo(0, 0);
    frage();
  }
  const farbeArt = { der: "#3A7BD5", die: "#E0457B", das: "#2FA66B" };
  function ruKnopf(text) { return ruAn() && text ? `<button class="mk" data-ru="${text}" lang="${HL().code}">${HL().kurz}</button>` : ""; }
  function deKnopf(text) { return SP.verfuegbar() ? `<button class="mk" data-de="${text}">🔊</button>` : ""; }

  function frage() {
    const q = quiz.fragen[quiz.pos], x = q.x, K = $("quiz");
    $("quiz-punkte").innerHTML = quiz.fragen.slice(1).map((_, i) => `<span class="${i < quiz.pos ? "an" : ""}"></span>`).join("");
    let versucht = false;
    const fertig = (sprechen) => {
      S.ton("juhu"); if (!versucht) C.gib("deutsch", 1);
      if (sprechen) SP.sprich(sprechen, "de-DE");
      K.insertAdjacentHTML("beforeend", `<button class="knopf haupt weiter" id="q-weiter">Weiter</button>`);
      $("q-weiter").addEventListener("click", () => { S.ton("tipp"); SP.stopp(); quiz.pos++; quiz.pos < quiz.fragen.length ? frage() : ende(); });
    };
    const falsch = (b) => { if (!versucht) { quiz.fehler++; versucht = true; } b.classList.add("falsch"); b.disabled = true; S.ton("nein"); $("q-hinweis").textContent = "Fast! Versuch es nochmal."; };
    const hinweis = `<p class="hinweis" id="q-hinweis"></p>`;

    if (q.typ === "intro") {
      K.innerHTML = `<p class="klein">Dein Wort für heute:</p><div class="riesig" aria-hidden="true">${x.e}</div>
        <div class="wort-gross"><span class="art" style="--f:${farbeArt[x.a]}">${x.a}</span> ${x.w}</div>
        ${x.p ? `<div class="zeile">Mehrzahl: <b>die ${x.p}</b></div>` : ""}
        <div class="zeile">${deKnopf(`${x.a} ${x.w}`)}${ruKnopf(S.ht(x))}</div><div class="ru-box" id="ru-box" lang="${HL().code}" hidden>${S.ht(x)}</div>
        <button class="knopf haupt weiter" id="q-weiter">Los geht's mit den Rätseln</button>`;
      SP.sprich(`${x.a} ${x.w}`, "de-DE");
      $("q-weiter").addEventListener("click", () => { S.ton("tipp"); quiz.pos++; frage(); });
    } else if (q.typ === "artikel") {
      K.innerHTML = `<p class="klein">der, die oder das?</p><div class="riesig" aria-hidden="true">${x.e}</div><div class="wort-gross">___ ${x.w}</div>
        <div class="zeile">${deKnopf(x.w)}${ruKnopf(S.ht(x))}</div><div class="ru-box" id="ru-box" lang="${HL().code}" hidden>${S.ht(x)}</div>
        <div class="opts drei">${["der", "die", "das"].map(a => `<button class="opt" data-a="${a}">${a}</button>`).join("")}</div>${hinweis}`;
      K.querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => {
        if (b.dataset.a === x.a) { b.classList.add("richtig"); K.querySelectorAll(".opt").forEach(o => o.disabled = true); K.querySelector(".wort-gross").textContent = `${x.a} ${x.w}`; $("q-hinweis").textContent = "Richtig!"; fertig(`${x.a} ${x.w}`); }
        else falsch(b);
      }));
    } else if (q.typ === "bild") {
      K.innerHTML = `<p class="klein">Was ist das?</p><div class="riesig" aria-hidden="true">${x.e}</div>
        <div class="opts">${q.opts.map((o, i) => `<button class="opt" data-i="${i}">${o.a} ${o.w}</button>`).join("")}</div>${hinweis}`;
      K.querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => {
        const o = q.opts[+b.dataset.i];
        if (o === x) { b.classList.add("richtig"); K.querySelectorAll(".opt").forEach(z => z.disabled = true); $("q-hinweis").textContent = "Genau!"; fertig(`${x.a} ${x.w}`); }
        else falsch(b);
      }));
    } else if (q.typ === "plural") {
      K.innerHTML = `<p class="klein">Wenn es mehr sind …</p><div class="riesig" aria-hidden="true">${x.e}${x.e}</div><div class="wort-gross">ein${x.a === "die" ? "e" : ""} ${x.w} – zwei ___</div>
        <div class="zeile">${deKnopf(`ein${x.a === "die" ? "e" : ""} ${x.w}`)}${ruKnopf(S.ht(x))}</div><div class="ru-box" id="ru-box" lang="${HL().code}" hidden>${S.ht(x)}</div>
        <div class="opts">${q.opts.map((o, i) => `<button class="opt" data-i="${i}">${o}</button>`).join("")}</div>${hinweis}`;
      K.querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => {
        if (q.opts[+b.dataset.i] === x.p) { b.classList.add("richtig"); K.querySelectorAll(".opt").forEach(z => z.disabled = true); K.querySelector(".wort-gross").textContent = `zwei ${x.p}`; $("q-hinweis").textContent = "Super!"; fertig(`zwei ${x.p}`); }
        else falsch(b);
      }));
    } else if (q.typ === "hoeren") {
      const stimme = SP.verfuegbar() && SP.hat("de-DE");
      K.innerHTML = `<p class="klein">${stimme ? "Hör gut zu! Welches Bild passt?" : `Welches Bild passt zu <b>${x.a} ${x.w}</b>?`}</p>
        ${stimme ? `<button class="opt gross-e" id="hoer" style="width:140px;border-radius:50%" aria-label="Anhören">🔊</button>` : ""}
        <div class="opts drei">${q.opts.map((o, i) => `<button class="opt gross-e" data-i="${i}" aria-label="Bild ${i + 1}">${o.e}</button>`).join("")}</div>${hinweis}`;
      if (stimme) { SP.sprich(`${x.a} ${x.w}`, "de-DE"); $("hoer").addEventListener("click", () => SP.sprich(`${x.a} ${x.w}`, "de-DE")); }
      K.querySelectorAll(".opt[data-i]").forEach(b => b.addEventListener("click", () => {
        if (q.opts[+b.dataset.i] === x) { b.classList.add("richtig"); K.querySelectorAll(".opt").forEach(z => z.disabled = true); $("q-hinweis").textContent = `${x.a} ${x.w}!`; fertig(`${x.a} ${x.w}`); }
        else falsch(b);
      }));
    }
    K.querySelectorAll(".mk").forEach(b => b.addEventListener("click", () => {
      if (b.dataset.de) SP.sprich(b.dataset.de, "de-DE");
      if (b.dataset.ru) { const box = $("ru-box"); if (box) box.hidden = !box.hidden; SP.sprich(b.dataset.ru, HL().tts); }
    }));
  }

  function ende() {
    const x = quiz.fragen[0].x, K = $("quiz");
    if (window.Lernfunde) Lernfunde.merke({ fach: "deutsch", art: "wort", e: x.e, text: `Neues Wort: ${x.a} ${x.w}${x.p && x.p !== x.w ? ` (die ${x.p})` : ""}`, ru: S.ht(x), schluessel: "w:" + x.w });
    C.ereignis("wort-fertig");
    $("quiz-punkte").innerHTML = quiz.fragen.slice(1).map(() => `<span class="an"></span>`).join("");
    K.innerHTML = `<div class="riesig">🎉</div><h2 style="margin:0">Geschafft!</h2>
      <p style="font-size:1.3rem;margin:0">${quiz.fehler === 0 ? "Alles beim ersten Mal richtig!" : `${5 - quiz.fehler} von 5 beim ersten Mal richtig.`}<br>Dein Wort heute: <b>${x.a} ${x.w}</b> ${x.e}</p>
      <button class="knopf haupt weiter" id="q-fertig">Zurück zu Mein Ich</button>`;
    S.ton("juhu");
    $("q-fertig").addEventListener("click", () => { S.ton("tipp"); $("wort-ansicht").hidden = true; $("haupt-ansicht").hidden = false; zeichne(); });
  }
  $("wort-zurueck").addEventListener("click", () => { S.ton("tipp"); SP.stopp(); $("wort-ansicht").hidden = true; $("haupt-ansicht").hidden = false; zeichne(); });

  zeichne();
  if (location.hash === "#wort") starteWort();
  window.__ich = { zeichne, starteWort, get quiz() { return quiz; } };
})();
