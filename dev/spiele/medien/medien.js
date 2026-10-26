(function () {
  const S = window.Spielwelt, SP = window.Sprache, L = window.LEKTIONEN, T = window.LEKTIONEN_TEXTE;
  const $ = (id) => document.getElementById(id);
  const HL = () => S.hilfe() || { code: "ru", kurz: "RU", tts: "ru-RU", name: "Russisch" };
  const LANG = () => `lang="${HL().code}"${HL().rtl ? ' dir="rtl"' : ""}`;
  const mische = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const name = () => S.profil.name || "du";
  const mitName = (t) => (t || "").replace(/\{name\}/g, name());

  function daten() { const d = Object.assign({ lektionen: {}, vorlesen: true, ru: true, fuehrerschein: null }, S.lade("medien") || {}); if (!S.hilfeRu()) d.ru = false; return d; }

  // ---------- Vorlesen und Russisch an jedem Text ----------
  // vt(de, ru): deutscher Text mit verstecktem russischen Text darunter.
  // mini(id): 🔊 liest Deutsch vor, RU zeigt Russisch und liest es vor.
  const texte = [];
  const ohneTags = (t) => String(t || "").replace(/<[^>]+>/g, "");
  function eintrag(de, ru) { texte.push({ de: mitName(de), ru: mitName(ru || "") }); return texte.length - 1; }
  function vt(id, extraRu = "") {
    const e = texte[id];
    return `${e.de}` + (e.ru ? `<span class="ru-text" ${LANG()} data-ru="${id}" hidden>${extraRu || e.ru}</span>` : "");
  }
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
  function speichere(d) { S.speichere("medien", d); }
  const bestes = (id) => daten().lektionen[id] || 0;
  const istOffen = (i) => S.offen(i === 0 || bestes(L[i - 1].id) > 0);

  function sprich(text) {
    if (!daten().vorlesen || !text) return;
    const r = $("robo-gross").firstElementChild; if (r) r.classList.add("spricht");
    SP.sprich(text, "de-DE", () => { const x = $("robo-gross").firstElementChild; if (x) x.classList.remove("spricht"); });
  }

  // ---------- Robo Pixel ----------
  function robo(klasse = "robo") {
    const D = "#3b1f63";
    return `<svg class="${klasse}" viewBox="0 0 200 210" aria-hidden="true">
      <line x1="100" y1="34" x2="100" y2="12" stroke="${D}" stroke-width="5"/><circle cx="100" cy="12" r="9" fill="#FFC83D" stroke="${D}" stroke-width="4"/>
      <rect x="40" y="34" width="120" height="92" rx="30" fill="#7FC6F5" stroke="${D}" stroke-width="5"/>
      <rect x="56" y="50" width="88" height="58" rx="20" fill="#E8F6FF" stroke="${D}" stroke-width="4"/>
      <circle cx="82" cy="78" r="10" fill="${D}"/><circle cx="118" cy="78" r="10" fill="${D}"/><circle cx="85" cy="74" r="3.5" fill="#fff"/><circle cx="121" cy="74" r="3.5" fill="#fff"/>
      <path d="M86 96 Q100 106 114 96" stroke="${D}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <rect x="30" y="66" width="12" height="30" rx="6" fill="#FF9BC8" stroke="${D}" stroke-width="4"/><rect x="158" y="66" width="12" height="30" rx="6" fill="#FF9BC8" stroke="${D}" stroke-width="4"/>
      <rect x="58" y="132" width="84" height="62" rx="20" fill="#7FC6F5" stroke="${D}" stroke-width="5"/>
      <rect x="78" y="146" width="44" height="30" rx="8" fill="#fff" stroke="${D}" stroke-width="3"/><circle cx="92" cy="161" r="5" fill="#5CCBA6"/><circle cx="108" cy="161" r="5" fill="#FF6F61"/>
      <path d="M58 150 Q36 160 34 182" stroke="${D}" stroke-width="12" stroke-linecap="round" fill="none"/><path d="M58 150 Q36 160 34 182" stroke="#7FC6F5" stroke-width="6" stroke-linecap="round" fill="none"/>
      <path d="M142 150 Q164 140 170 118" stroke="${D}" stroke-width="12" stroke-linecap="round" fill="none"/><path d="M142 150 Q164 140 170 118" stroke="#7FC6F5" stroke-width="6" stroke-linecap="round" fill="none"/>
      <rect x="70" y="192" width="20" height="14" rx="5" fill="${D}"/><rect x="110" y="192" width="20" height="14" rx="5" fill="${D}"/>
    </svg>`;
  }

  // ---------- Übersicht ----------
  function zeige(n) { ["liste", "lektion", "ende", "fs"].forEach(v => $(v + "-ansicht").hidden = v !== n); scrollTo(0, 0); }
  function zeichneListe() {
    const d = daten();
    $("sterne").textContent = S.sterne();
    $("robo-klein").innerHTML = robo("");
    $("ton-vorlesen").textContent = d.vorlesen ? "🗣️" : "🔇";
    $("ru-schalter").hidden = !S.hilfeRu(); $("ru-schalter").textContent = HL().kurz; $("ru-schalter").classList.toggle("aus", !d.ru); $("ru-schalter").setAttribute("aria-pressed", d.ru);
    const fertig = L.filter(l => bestes(l.id) > 0).length;
    $("intro-text").textContent = fertig === 0 ? `Hallo ${name()}! Ich bin Pixel. Schaffe alle 6 Lektionen, dann bekommst du deinen Tablet-Führerschein.`
      : fertig < L.length ? `Schon ${fertig} von ${L.length} Lektionen geschafft. Weiter so!` : `Du hast den Tablet-Führerschein! Du kannst jede Lektion nochmal machen.`;
    const jetzt = L.findIndex((l, i) => istOffen(i) && !bestes(l.id));
    $("lektionen").innerHTML = "";
    L.forEach((l, i) => {
      const offen = istOffen(i), best = bestes(l.id);
      const b = document.createElement("button");
      b.className = "lek" + (offen ? "" : " zu") + (i === jetzt ? " jetzt" : "");
      b.style.setProperty("--f", l.grund);
      b.innerHTML = `<span class="emoji">${offen ? l.e : "🔒"}</span><span>${i + 1}. ${l.name}</span>` +
        `<span class="stern-reihe">${best ? [1, 2, 3].map(n => `<span class="${n <= best ? "" : "leer"}">⭐</span>`).join("") : ""}</span>`;
      b.addEventListener("click", () => { if (!offen) { S.ton("nein"); S.meldung("Mach zuerst die Lektion davor."); return; } S.ton("tipp"); starte(i); });
      $("lektionen").appendChild(b);
    });
    $("fs-zeigen").hidden = !d.fuehrerschein;
  }

  // ---------- Lektion ----------
  let lauf = null;
  function starte(i) {
    const l = L[i];
    lauf = { i, l, pos: 0, fehler: 0 };
    document.body.style.setProperty("--grund", l.grund);
    document.body.style.setProperty("--akzent", l.farbe);
    $("lektion-name").textContent = l.name;
    $("robo-gross").innerHTML = robo();
    zeige("lektion"); schritt();
  }

  function blase(text, ru) {
    const id = eintrag(text, ru);
    $("blase").innerHTML = `<div>${vt(id)}</div>` + mini(id);
    sprich(ohneTags(texte[id].de));
  }
  const weiterKnopf = (text = "Weiter") => `<button class="knopf weiter" id="weiter">${text}</button>`;
  function aufWeiter() { const w = $("weiter"); if (w) w.addEventListener("click", () => { S.ton("tipp"); weiter(); }); }
  function weiter() { SP.stopp(); aufraeumen(); lauf.pos++; schritt(); }
  let aufraeumer = [];
  function aufraeumen() { aufraeumer.forEach(f => f()); aufraeumer = []; }
  function uebungGeschafft([text, ru] = ["Super gemacht!", "Супер!"]) {
    S.ton("juhu");
    const A = $("aufgabe"), id = eintrag(text, ru);
    A.insertAdjacentHTML("beforeend", `<div class="warum gut">${vt(id)}${mini(id)}</div>` + weiterKnopf());
    aufWeiter(); sprich(text);
  }
  function erklaere(el, art, de, ru) {
    const id = eintrag(de, ru);
    el.hidden = false; el.className = "warum " + art; el.innerHTML = vt(id) + mini(id);
    sprich(texte[id].de);
  }
  // Antwortzeile: großer Knopf zum Antworten, daneben 🔊 und RU
  function optionZeile(de, ru, attr = "") {
    const id = eintrag(de, ru);
    return `<div class="option-zeile"><button class="option" ${attr}>${vt(id)}</button>${mini(id)}</div>`;
  }

  // Auswahl mit Erklärung (wahl, daumen, chat)
  function auswahl(container, optionen) {
    const warum = document.createElement("div"); warum.className = "warum"; warum.hidden = true;
    let versucht = false;
    container.after(warum);
    container.querySelectorAll(".option").forEach((b, n) => b.addEventListener("click", () => {
      const o = optionen[n];
      if (o.ok) {
        b.classList.add("richtig");
        if (!versucht && window.Charakter) Charakter.gib("tablet", 1);
        container.querySelectorAll(".option").forEach(x => x.disabled = true);
        S.ton("juhu"); erklaere(warum, "gut", o.warum, o.hilfe !== undefined ? o.hilfe : S.ht(o, "warum"));
        warum.insertAdjacentHTML("afterend", weiterKnopf()); aufWeiter();
      } else {
        if (!versucht) { lauf.fehler++; versucht = true; }
        b.classList.add("falsch"); b.disabled = true;
        S.ton("nein"); erklaere(warum, "nein", o.warum, o.hilfe !== undefined ? o.hilfe : S.ht(o, "warum"));
      }
    }));
  }

  function schritt() {
    const { l } = lauf;
    $("balken").style.width = Math.round(lauf.pos / l.schritte.length * 100) + "%";
    if (lauf.pos >= l.schritte.length) return beende();
    const s = l.schritte[lauf.pos], A = $("aufgabe");
    A.innerHTML = ""; texte.length = 0;

    switch (s.typ) {
      case "sag":
        blase(s.text, S.ht(s));
        A.innerHTML = `<div class="gross-emoji" aria-hidden="true">${s.e || l.e}</div>` + weiterKnopf();
        aufWeiter(); break;

      case "wahl": case "chat": {
        const opts = mische(s.optionen);
        blase(s.frage, S.ht(s));
        let oben = s.e ? `<div class="gross-emoji" aria-hidden="true">${s.e}</div>` : "";
        if (s.typ === "chat") { const id = eintrag(s.nachricht, S.ht(s, "nachricht")); oben = `<div class="chat"><div class="kopf"><span>👤</span>${s.von}</div><div class="nachricht">${vt(id)}${mini(id)}</div></div>`; }
        A.innerHTML = oben + `<div class="optionen">` + opts.map(o => optionZeile(o.t, S.ht(o))).join("") + `</div>`;
        auswahl(A.querySelector(".optionen"), opts);
        break;
      }

      case "daumen": {
        blase(...S.paar(T.daumenFrage));
        const sid = eintrag(s.satz, S.ht(s, "satz"));
        A.innerHTML = (s.e ? `<div class="gross-emoji" aria-hidden="true">${s.e}</div>` : "") + `<p class="satz-gross">${vt(sid)}${mini(sid)}</p>` +
          `<div class="daumen optionen" style="display:flex;width:auto"><button class="option" aria-label="Stimmt">👍</button><button class="option" aria-label="Stimmt nicht">👎</button></div>`;
        auswahl(A.querySelector(".daumen"), [
          { ok: s.ok, warum: s.ok ? s.warum : S.paar(T.nochmalHin)[0], hilfe: s.ok ? S.ht(s, "warum") : S.paar(T.nochmalHin)[1] },
          { ok: !s.ok, warum: s.ok ? S.paar(T.dochGut)[0] : s.warum, hilfe: s.ok ? S.paar(T.dochGut)[1] : S.ht(s, "warum") }]);
        sprich(s.satz);
        break;
      }

      case "sortieren": {
        blase(s.frage, S.ht(s));
        const dinge = mische(s.dinge); let k = 0;
        const zeichne = () => {
          if (k >= dinge.length) { A.innerHTML = `<div class="gross-emoji">🎉</div>`; uebungGeschafft(S.paar(T.sortiert)); return; }
          const d = dinge[k]; let versucht = false;
          const did = eintrag(d.t, S.ht(d));
          const ruBtn = (t) => daten().ru ? `<span class="ru-text" ${LANG()} data-ru="${did}" hidden>${t}</span>` : "";
          A.innerHTML = `<div class="zaehler">${k + 1} von ${dinge.length}</div><div class="sortier-karte"><span class="e">${d.e}</span>${vt(did)}${mini(did)}</div>` +
            `<div class="sortier-knoepfe"><button class="option" data-seite="links">${s.links}${ruBtn(S.ht(s, "links"))}</button><button class="option" data-seite="rechts">${s.rechts}${ruBtn(S.ht(s, "rechts"))}</button></div><div class="warum" hidden></div>`;
          sprich(d.t);
          A.querySelectorAll(".option").forEach(b => b.addEventListener("click", () => {
            const w = A.querySelector(".warum");
            if (b.dataset.seite === d.seite) {
              b.classList.add("richtig"); S.ton("juhu"); A.querySelectorAll(".option").forEach(x => x.disabled = true);
              setTimeout(() => { k++; zeichne(); }, 800);
            } else {
              if (!versucht) { lauf.fehler++; versucht = true; }
              b.classList.add("falsch"); b.disabled = true; S.ton("nein");
              const [de, ru] = d.seite === "rechts" ? S.paar(T.geheim) : S.paar(T.darfSagen);
              erklaere(w, "nein", de, ru);
            }
          }));
        };
        zeichne(); break;
      }

      case "tippen": {
        blase(s.text, S.ht(s));
        A.innerHTML = `<div class="zaehler" id="zaehler">0 von 3</div><div class="feld" id="feld"><button class="ziel-stern" id="ziel" aria-label="Stern">⭐</button></div>`;
        let n = 0; const z = $("ziel");
        const setze = () => { z.style.left = (15 + Math.random() * 70) + "%"; z.style.top = (18 + Math.random() * 64) + "%"; };
        setze();
        z.addEventListener("click", () => {
          n++; $("zaehler").textContent = `${n} von 3`; S.ton("wahl");
          if (n >= 3) { z.remove(); uebungGeschafft(S.paar(T.getippt)); } else setze();
        });
        break;
      }

      case "wischen": {
        blase(s.text, S.ht(s));
        const bilder = ["🐶", "🌈", "🚀", "🦄"];
        A.innerHTML = `<div class="feld" id="feld"><div class="karussell" id="kar">${bilder.map(b => `<div>${b}</div>`).join("")}</div></div><div class="punkte" id="pkt"></div>`;
        let idx = 0, fertig = false;
        const zeigeP = () => { $("pkt").innerHTML = bilder.map((_, i) => `<span class="${i === idx ? "an" : ""}"></span>`).join(""); $("kar").style.transform = `translateX(${-idx * 100}%)`; };
        zeigeP();
        let x0 = null;
        const feld = $("feld");
        feld.addEventListener("pointerdown", e => { x0 = e.clientX; });
        feld.addEventListener("pointerup", e => {
          if (x0 === null) return; const dx = e.clientX - x0; x0 = null;
          if (Math.abs(dx) < 40) return;
          idx = Math.max(0, Math.min(bilder.length - 1, idx + (dx < 0 ? 1 : -1))); S.ton("tipp"); zeigeP();
          if (idx === bilder.length - 1 && !fertig) { fertig = true; uebungGeschafft(S.paar(T.gewischt)); }
        });
        break;
      }

      case "ziehen": {
        blase(s.text, S.ht(s));
        A.innerHTML = `<div class="feld" id="feld"><div class="korb" id="korb">🧺</div><div class="apfel" id="apfel" role="img" aria-label="Apfel">🍎</div></div>`;
        const apfel = $("apfel"), feld = $("feld"), korb = $("korb");
        let ziehe = false, fertig = false;
        apfel.addEventListener("pointerdown", e => { if (fertig) return; ziehe = true; apfel.setPointerCapture(e.pointerId); S.ton("tipp"); });
        apfel.addEventListener("pointermove", e => {
          if (!ziehe) return; const r = feld.getBoundingClientRect();
          apfel.style.left = ((e.clientX - r.left) / r.width * 100) + "%"; apfel.style.top = ((e.clientY - r.top) / r.height * 100) + "%";
        });
        apfel.addEventListener("pointerup", e => {
          if (!ziehe) return; ziehe = false;
          const k = korb.getBoundingClientRect();
          if (e.clientX > k.left - 20 && e.clientX < k.right + 20 && e.clientY > k.top - 20 && e.clientY < k.bottom + 20) {
            fertig = true; korb.classList.add("voll"); korb.textContent = "🧺🍎"; apfel.remove(); uebungGeschafft(S.paar(T.apfel));
          }
        });
        break;
      }

      case "halten": {
        blase(s.text, S.ht(s));
        A.innerHTML = `<button class="halten" id="halten"><span>Gedrückt halten</span></button>`;
        const b = $("halten"); let t0 = 0, raf = 0, fertig = false;
        const lauf2 = () => {
          const p = Math.min(100, (performance.now() - t0) / 12);
          b.style.setProperty("--p", p);
          if (p >= 100) { fertig = true; b.querySelector("span").textContent = "Geschafft!"; uebungGeschafft(S.paar(T.gedrueckt)); return; }
          raf = requestAnimationFrame(lauf2);
        };
        b.addEventListener("pointerdown", e => { if (fertig) return; b.setPointerCapture(e.pointerId); t0 = performance.now(); raf = requestAnimationFrame(lauf2); });
        const los = () => { if (fertig) return; cancelAnimationFrame(raf); b.style.setProperty("--p", 0); };
        b.addEventListener("pointerup", los); b.addEventListener("pointercancel", los);
        b.addEventListener("contextmenu", e => e.preventDefault());
        aufraeumer.push(() => cancelAnimationFrame(raf));
        break;
      }

      case "zoomen": {
        blase(s.text, S.ht(s));
        A.innerHTML = `<div class="feld" id="feld"><div class="zoom-bild" id="zb">🐞</div></div><button class="knopf ueberspringen" id="skip" hidden>Klappt nicht? Weiter</button>`;
        const feld = $("feld"), zb = $("zb"), punkte = new Map(); let d0 = 0, s0 = 1, sk = 1, fertig = false;
        const abst = () => { const [a, b] = [...punkte.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };
        feld.addEventListener("pointerdown", e => { feld.setPointerCapture(e.pointerId); punkte.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (punkte.size === 2) { d0 = abst(); s0 = sk; } });
        feld.addEventListener("pointermove", e => {
          if (!punkte.has(e.pointerId)) return; punkte.set(e.pointerId, { x: e.clientX, y: e.clientY });
          if (punkte.size === 2 && d0 > 0) { sk = Math.max(1, Math.min(4, s0 * abst() / d0)); zb.style.setProperty("--s", sk); if (sk >= 2.4 && !fertig) { fertig = true; uebungGeschafft(S.paar(T.kaefer)); } }
        });
        const weg = e => punkte.delete(e.pointerId);
        feld.addEventListener("pointerup", weg); feld.addEventListener("pointercancel", weg);
        // Ohne Touch (z. B. am Computer): Strg + Mausrad zum Zoomen, sonst Überspringen anbieten
        feld.addEventListener("wheel", e => { e.preventDefault(); sk = Math.max(1, Math.min(4, sk - e.deltaY / 200)); zb.style.setProperty("--s", sk); if (sk >= 2.4 && !fertig) { fertig = true; uebungGeschafft(S.paar(T.kaefer)); } }, { passive: false });
        const t = setTimeout(() => { const k = $("skip"); if (k && !fertig) { k.hidden = false; k.addEventListener("click", () => { S.ton("tipp"); weiter(); }); } }, 9000);
        aufraeumer.push(() => clearTimeout(t));
        break;
      }

      case "popup": {
        blase(s.text, S.ht(s));
        A.innerHTML = `<div class="spielchen"><div class="frosch">🐸</div>
          <div class="werbung" id="werbung"><span class="label">Werbung</span><button class="schliessen" id="zu" aria-label="Werbung schließen">✕</button>
            <div class="gross">🎁💎</div><b style="font-size:1.4rem">Du hast gewonnen!</b><button class="gratis" id="gratis">GRATIS HOLEN!</button></div></div><div class="warum" id="w" hidden></div>`;
        let versucht = false;
        $("gratis").addEventListener("click", () => {
          if (!versucht) { lauf.fehler++; versucht = true; }
          S.ton("nein"); erklaere($("w"), "nein", ...S.paar(T.werbungFalsch));
        });
        $("zu").addEventListener("click", () => {
          $("werbung").remove(); const w = $("w");
          S.ton("juhu"); erklaere(w, "gut", ...S.paar(T.werbungRichtig)); w.insertAdjacentHTML("afterend", weiterKnopf()); aufWeiter();
        });
        break;
      }
    }
  }

  // ---------- Ende ----------
  function beende() {
    const { l, i, fehler } = lauf;
    const sterne = fehler <= 1 ? 3 : fehler <= 3 ? 2 : 1;
    const vorher = bestes(l.id);
    let gewinn = Math.max(0, sterne - vorher);
    if (vorher === 3 && sterne === 3) gewinn = 1;
    const d = daten(); d.lektionen[l.id] = Math.max(vorher, sterne);
    const inselVorher = S.inselOffen();
    const neuFuehrerschein = !d.fuehrerschein && L.every(x => d.lektionen[x.id] > 0);
    if (neuFuehrerschein) { d.fuehrerschein = new Date().toISOString().slice(0, 10); gewinn += 3; }
    speichere(d);
    if (gewinn) S.gibSterne(gewinn);
    if (window.Lernfunde) Lernfunde.merke({ fach: "tablet", art: "lektion", e: l.e, text: `Tablet-Führerschein: ${l.name}`, schluessel: "t:" + l.id });
    if (window.Charakter) { Charakter.gib("tablet", 2 + sterne * 2); Charakter.ereignis("tablet-lektion"); }

    $("ende-titel").textContent = neuFuehrerschein ? "Führerschein bestanden!" : "Lektion geschafft!";
    $("ende-sterne").innerHTML = [1, 2, 3].map(n => `<span class="${n <= sterne ? "" : "leer"}" style="animation-delay:${n * 180}ms">⭐</span>`).join("");
    const inselNeu = !inselVorher && S.inselOffen();   // NA-12: die erste Lektion öffnet die Insel
    $("ende-text").textContent = neuFuehrerschein ? "Du hast alle Lektionen geschafft. Dafür gibt es 3 Extra-Sterne!"
      : inselNeu ? "Geschafft! Jetzt hast du den Schlüssel: Deine Insel ist offen. Robo Pixel bringt dich mit dem Boot hin!"
      : fehler === 0 ? "Alles beim ersten Mal richtig!" : `${l.name}: geschafft!`;
    $("ende-gewinn").textContent = gewinn ? `+${gewinn} ${gewinn === 1 ? "Stern" : "Sterne"} für den Kleiderschrank. Du hast jetzt ${S.sterne()}.` : `Du hast ${S.sterne()} Sterne.`;
    const kn = $("ende-knoepfe"); kn.innerHTML = "";
    const knopf = (t, haupt, fn) => { const b = document.createElement("button"); b.className = "knopf" + (haupt ? " haupt" : ""); b.textContent = t; b.addEventListener("click", () => { S.ton("tipp"); fn(); }); kn.appendChild(b); };
    if (inselNeu) knopf("🏝️ Zur Insel", true, () => { location.href = "../welt3d/heimat.html"; });
    if (neuFuehrerschein) knopf("🪪 Führerschein ansehen", true, zeigeFuehrerschein);
    else if (i + 1 < L.length) knopf(`Weiter: ${L[i + 1].name}`, !inselNeu, () => starte(i + 1));
    knopf("Zur Übersicht", false, () => { zeige("liste"); zeichneListe(); });
    zeige("ende"); S.ton("juhu");
  }

  // ---------- Führerschein ----------
  function fuehrerscheinSvg() {
    const d = daten(), datum = d.fuehrerschein ? d.fuehrerschein.split("-").reverse().join(".") : "";
    const D = "#3b1f63";
    const marken = L.map((l, i) => `<g transform="translate(${296 + i * 62} 306)"><circle r="26" fill="${l.grund}" stroke="${l.farbe}" stroke-width="4"/><text y="11" text-anchor="middle" font-size="28">${l.e}</text></g>`).join("");
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 420">
      <rect width="720" height="420" rx="28" fill="#FFFDF5"/><rect x="12" y="12" width="696" height="396" rx="22" fill="none" stroke="#7FC6F5" stroke-width="8"/>
      <rect x="12" y="12" width="696" height="70" rx="22" fill="#7FC6F5"/><rect x="12" y="60" width="696" height="22" fill="#7FC6F5"/>
      <text x="360" y="60" text-anchor="middle" font-size="36" font-weight="700" fill="#fff" font-family="Fredoka, Arial, sans-serif">Tablet-Führerschein</text>
      <g transform="translate(46 112) scale(.95)">${robo("").replace(/<svg[^>]*>|<\/svg>/g, "")}</g>
      <text x="270" y="150" font-size="22" fill="${D}" font-family="Fredoka, Arial, sans-serif">Hiermit bestätigt Robo Pixel:</text>
      <text x="270" y="200" font-size="44" font-weight="700" fill="#C2337A" font-family="Fredoka, Arial, sans-serif">${name()}</text>
      <text x="270" y="238" font-size="22" fill="${D}" font-family="Fredoka, Arial, sans-serif">ist ein echter Tablet-Profi und weiß,</text>
      <text x="270" y="266" font-size="22" fill="${D}" font-family="Fredoka, Arial, sans-serif">wie man sicher im Internet unterwegs ist.</text>
      ${marken}
      <text x="270" y="380" font-size="20" fill="${D}" font-family="Fredoka, Arial, sans-serif">Bestanden am ${datum}</text>
      <g transform="translate(656 372)"><circle r="32" fill="#FFC83D" stroke="${D}" stroke-width="4"/><text y="12" text-anchor="middle" font-size="32">⭐</text></g>
    </svg>`;
  }
  function zeigeFuehrerschein() { $("urkunde").innerHTML = fuehrerscheinSvg(); zeige("fs"); }
  $("fs-bild").addEventListener("click", () => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = 1440; c.height = 840;
      c.getContext("2d").drawImage(img, 0, 0, 1440, 840);
      c.toBlob(async blob => {
        const datei = new File([blob], `${name().toLowerCase()}-tablet-fuehrerschein.png`, { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [datei] })) { try { await navigator.share({ files: [datei] }); return; } catch (e) { if (e.name === "AbortError") return; } }
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = datei.name; a.click();
      }, "image/png");
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(fuehrerscheinSvg());
  });
  $("fs-zurueck").addEventListener("click", () => { S.ton("tipp"); zeige("liste"); zeichneListe(); });
  $("fs-zeigen").addEventListener("click", () => { S.ton("tipp"); zeigeFuehrerschein(); });
  $("zur-liste").addEventListener("click", () => { SP.stopp(); aufraeumen(); S.ton("tipp"); lauf = null; zeige("liste"); zeichneListe(); });
  $("ru-schalter").addEventListener("click", () => { const d = daten(); d.ru = !d.ru; speichere(d); S.ton("tipp"); zeichneListe(); S.meldung(`${HL().name}-Hilfe ist ${d.ru ? "an" : "aus"}.`); });
  $("ton-vorlesen").addEventListener("click", () => { const d = daten(); d.vorlesen = !d.vorlesen; speichere(d); S.ton("tipp"); zeichneListe(); S.meldung(d.vorlesen ? "Vorlesen ist an." : "Vorlesen ist aus."); });

  zeichneListe();
  // Aus „Mein Ich“: direkt den Führerschein zeigen – aber nur, wenn das Kind ihn wirklich hat
  if (location.hash === "#fuehrerschein" && daten().fuehrerschein) zeigeFuehrerschein();
  window.__medien = { starte, get lauf() { return lauf; } };
})();
