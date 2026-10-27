(function () {
  const S = window.Spielwelt, SP = window.Sprache, G = window.GESCHICHTE, W = window.WERKSTATT || [];
  const $ = (id) => document.getElementById(id);
  const HL = () => S.hilfe() || { code: "ru", kurz: "RU", tts: "ru-RU", name: "Russisch" };
  const mische = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const LOB = ["Richtig!", "Super!", "Genau!", "Toll!", "Prima!", "Klasse!"];
  const name = () => S.profil.name || "du";
  const mitName = (t) => (t || "").replace(/\{name\}/g, name());

  // ---------- Einstellungen und Fortschritt ----------
  const WERK_LB = [["sz", "🗣️ Sprechen und Zuhören"], ["sc", "✏️ Schreiben"], ["le", "📖 Lesen"], ["tm", "📚 Texte und Medien"], ["su", "🔍 Sprache untersuchen"]];
  function daten() { const d = Object.assign({ kapitel: {}, vorlesen: true, ru: true }, S.lade("deutsch") || {}); if (!S.hilfeRu()) d.ru = false; return d; }
  function setze(feld, wert) { const d = daten(); d[feld] = wert; S.speichere("deutsch", d); }
  const bestes = (id) => daten().kapitel[id] || 0;
  const istOffen = (i) => S.offen(i === 0 || bestes(G[i - 1].id) > 0);

  function sprich(text, lang = "de-DE") {
    if (!daten().vorlesen && lang.startsWith("de")) return;
    const f = $("fipsi-gross").firstElementChild;
    if (f) f.classList.add("spricht");
    SP.sprich(text, lang, () => { const g = $("fipsi-gross").firstElementChild; if (g) g.classList.remove("spricht"); });
  }

  // ---------- Fipsi ----------
  function fipsi(klasse = "fipsi") {
    const D = "#3b1f63", O = "#F28C38", W = "#FFF3E6";
    return `<svg class="${klasse}" viewBox="0 0 200 200" aria-hidden="true">
      <path d="M134 170 Q198 160 188 100 Q180 72 160 92 Q174 134 124 150 Z" fill="${O}" stroke="${D}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M188 100 Q180 72 160 92 Q172 96 182 112 Z" fill="${W}" stroke="${D}" stroke-width="4" stroke-linejoin="round"/>
      <ellipse cx="100" cy="154" rx="42" ry="38" fill="${O}" stroke="${D}" stroke-width="4"/>
      <ellipse cx="100" cy="164" rx="24" ry="24" fill="${W}"/>
      <ellipse cx="80" cy="190" rx="14" ry="8" fill="#5C3A21" stroke="${D}" stroke-width="3"/><ellipse cx="120" cy="190" rx="14" ry="8" fill="#5C3A21" stroke="${D}" stroke-width="3"/>
      <path d="M50 72 L58 16 L88 48 Q100 44 112 48 L142 16 L150 72 Q152 116 100 124 Q48 116 50 72 Z" fill="${O}" stroke="${D}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M62 30 L65 58 L82 47 Z M138 30 L135 58 L118 47 Z" fill="#FFC3A0"/>
      <path d="M64 86 Q100 70 136 86 Q132 120 100 122 Q68 120 64 86 Z" fill="${W}"/>
      <circle cx="80" cy="78" r="8" fill="${D}"/><circle cx="120" cy="78" r="8" fill="${D}"/>
      <circle cx="83" cy="75" r="3" fill="#fff"/><circle cx="123" cy="75" r="3" fill="#fff"/>
      <ellipse cx="100" cy="96" rx="8" ry="6" fill="${D}"/>
      <path d="M91 106 Q100 114 109 106" stroke="${D}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <circle cx="70" cy="98" r="7" fill="#FF7FA6" opacity=".45"/><circle cx="130" cy="98" r="7" fill="#FF7FA6" opacity=".45"/>
    </svg>`;
  }

  // ---------- Schatzkarte aus 5 Teilen ----------
  function schatzkarte(gefunden) {
    const id = "sk" + Math.random().toString(36).slice(2, 6);
    const bild = `<rect width="500" height="300" rx="16" fill="#F6E3B4"/>
      <path d="M20 40 Q60 20 90 50" stroke="#E2C48A" stroke-width="3" fill="none"/>
      <g fill="#5DB84A"><circle cx="40" cy="120" r="20"/><circle cx="70" cy="100" r="16"/><circle cx="60" cy="150" r="18"/></g>
      <rect x="130" y="110" width="50" height="40" fill="#E8463B"/><path d="M124 112 L155 84 L186 112 Z" fill="#A0693F"/>
      <rect x="230" y="150" width="44" height="40" fill="#FFD1E8"/><path d="M226 152 L252 128 L278 152 Z" fill="#C2337A"/><text x="252" y="178" font-size="20" text-anchor="middle">🥨</text>
      <path d="M300 230 q20 -12 40 0 t40 0" stroke="#3AA0E0" stroke-width="6" fill="none"/><path d="M300 250 q20 -12 40 0 t40 0" stroke="#3AA0E0" stroke-width="6" fill="none"/>
      <rect x="410" y="80" width="60" height="70" fill="#C9B8F0"/><rect x="404" y="60" width="18" height="40" fill="#C9B8F0"/><rect x="458" y="60" width="18" height="40" fill="#C9B8F0"/>
      <path d="M50 190 Q120 250 160 170 T260 210 T360 200 T440 170" stroke="#D7263D" stroke-width="5" stroke-dasharray="10 9" fill="none" stroke-linecap="round"/>
      <path d="M428 158 l24 24 M452 158 l-24 24" stroke="#D7263D" stroke-width="8" stroke-linecap="round"/>`;
    const teile = [0, 1, 2, 3, 4].map(i => `M${i * 100} 0 H${(i + 1) * 100} V300 H${i * 100} Z`);
    let s = `<svg viewBox="-6 -6 512 312" role="img" aria-label="Schatzkarte, ${gefunden.filter(Boolean).length} von 5 Teilen gefunden"><defs>` +
      teile.map((d, i) => `<clipPath id="${id}${i}"><path d="${d}"/></clipPath>`).join("") + `</defs>`;
    teile.forEach((d, i) => {
      if (gefunden[i]) s += `<g clip-path="url(#${id}${i})">${bild}</g><path d="${d}" fill="none" stroke="#C8A46A" stroke-width="2"/>`;
      else s += `<path d="${d}" fill="#fff" fill-opacity=".5" stroke="#C9A6A0" stroke-width="3" stroke-dasharray="8 7"/><text x="${i * 100 + 50}" y="165" text-anchor="middle" font-size="44" font-weight="700" fill="#D9C2BD" font-family="Fredoka, sans-serif">?</text>`;
    });
    return s + `<rect x="0" y="0" width="500" height="300" rx="16" fill="none" stroke="#8A5A34" stroke-width="5"/></svg>`;
  }
  function kartenteil(i) {
    return schatzkarte([0, 1, 2, 3, 4].map(k => k === i)).replace('viewBox="-6 -6 512 312"', `viewBox="${i * 100 - 6} -6 112 312" class="teil-gross"`);
  }

  // ---------- Karte ----------
  function zeige(n) { ["karte", "kapitel", "ende"].forEach(v => $(v + "-ansicht").hidden = v !== n); scrollTo(0, 0); }

  function zeichneKarte() {
    $("sterne").textContent = S.sterne();
    $("fipsi-klein").innerHTML = fipsi("");
    const gefunden = G.map(k => bestes(k.id) > 0);
    const anzahl = gefunden.filter(Boolean).length;
    $("karte-text").textContent = anzahl === 0 ? `Hallo ${name()}! Hilfst du mir, meine Schatzkarte zu finden?`
      : anzahl < 5 ? `Schon ${anzahl} von 5 Teilen! Weiter geht's.` : `Wir haben die ganze Karte! Du kannst jeden Ort nochmal besuchen.`;
    const jetzt = G.findIndex((k, i) => istOffen(i) && !bestes(k.id));
    $("orte").innerHTML = "";
    G.forEach((k, i) => {
      const offen = istOffen(i), best = bestes(k.id);
      const b = document.createElement("button");
      b.className = "ort" + (offen ? "" : " zu") + (i === jetzt ? " jetzt" : "");
      b.setAttribute("aria-label", `${k.name}${offen ? "" : ", noch gesperrt"}`);
      b.innerHTML = `<span class="nr">${i + 1}</span><span class="emoji">${offen ? k.ort : "🔒"}</span><span>${k.name}</span>` +
        `<span class="stern-reihe">${best ? [1, 2, 3].map(n => `<span class="${n <= best ? "" : "leer"}">⭐</span>`).join("") : ""}</span>`;
      b.addEventListener("click", () => {
        if (!offen) { S.ton("nein"); S.meldung("Finde zuerst das Kartenteil davor."); return; }
        S.ton("tipp"); starte(i);
      });
      $("orte").appendChild(b);
    });
    const wk = $("werkstatt");
    if (wk) {
      wk.innerHTML = "";
      const klasse = ((S.stufe && S.stufe()) || {}).klasse || 2;
      // Schuljahr Deutsch (28.10.2026): Kapitel nach den fünf Lernbereichen des Lehrplans gruppiert; Kapitel aus früheren
      // Klassen (Kl. 1/2 zählt als eine Stufe) liegen eingeklappt unter „Wiederholen“ – nichts verschwindet
      const kachel = (k, i) => {
        const best = bestes(k.id), b = document.createElement("button");
        b.className = "ort"; b.setAttribute("aria-label", k.name); b.dataset.id = k.id;
        b.innerHTML = `<span class="emoji">${k.ort}</span><span>${k.name}</span><span class="stern-reihe">${best ? [1, 2, 3].map(n => `<span class="${n <= best ? "" : "leer"}">⭐</span>`).join("") : ""}</span>`;
        b.addEventListener("click", () => { S.ton("tipp"); starte(i, W); });
        return b;
      };
      const stufeVon = (k) => Math.max(2, k.stufe || 2);
      WERK_LB.forEach(([lb, titel]) => {
        const alle = W.map((k, i) => [k, i]).filter(([k]) => (k.lb || "su") === lb && !(k.stufe && klasse < k.stufe - 1))
          .sort((a, b) => stufeVon(a[0]) - stufeVon(b[0]) || a[1] - b[1]);
        const frueher = alle.filter(([k]) => klasse >= 3 && stufeVon(k) < klasse), jetzt = alle.filter(x => !frueher.includes(x));
        const g = document.createElement("section"); g.className = "werk-gruppe"; g.dataset.lb = lb;
        g.innerHTML = `<h3>${titel}</h3><div class="orte"></div>`;
        jetzt.forEach(([k, i]) => g.querySelector(".orte").appendChild(kachel(k, i)));
        if (lb === "le") {
          // Lesen und Schreiben (NA-30/31/35): eigene Seite, hier als Kachel im Lernbereich Lesen
          const lesen = document.createElement("a");
          lesen.className = "ort"; lesen.href = "../lesen/"; lesen.id = "zu-lesen"; lesen.style.textDecoration = "none"; lesen.style.color = "inherit";
          lesen.innerHTML = `<span class="emoji">🔤</span><span>Lesen und Schreiben</span><span class="stern-reihe"></span>`;
          g.querySelector(".orte").prepend(lesen);
        }
        if (frueher.length) {
          const d = document.createElement("details"); d.className = "frueher";
          d.innerHTML = `<summary>Wiederholen aus früheren Klassen (${frueher.length})</summary><div class="orte"></div>`;
          frueher.forEach(([k, i]) => d.querySelector(".orte").appendChild(kachel(k, i)));
          g.appendChild(d);
        }
        wk.appendChild(g);
      });
    }
    $("schatz-titel").textContent = anzahl === 5 ? "Die Schatzkarte ist komplett!" : `Die Schatzkarte: ${anzahl} von 5 Teilen`;
    $("schatz").innerHTML = schatzkarte(gefunden);
  }

  // ---------- Kapitel ----------
  let lauf = null;
  // NA-50: Lernziele eines Schritts – Werkstatt-Kapitel haben eigene lz, Fipsis Geschichte nach Schritt-Typ
  const lzSchritt = (s) => (lauf && lauf.werk && lauf.k.lz) || (s && (window.GESCHICHTE_LZ_TYP || {})[s.typ]) || [];

  // Lernkartei (shared/lernkartei.js): fällige Schritte von früher kommen als kurze Wiederholung an den Anfang
  const WIEDER_INTRO = { typ: "sag", text: "Bevor es losgeht: Wir wiederholen kurz, was letztes Mal knifflig war. Du schaffst das!",
    ru: "Сначала коротко повторим то, что в прошлый раз было трудно. У тебя получится!" };
  function mitWiederholung(k) {
    if (!window.Lernkartei) return k;
    const eigene = new Set(k.schritte.map(x => JSON.stringify(x)));
    const karten = Lernkartei.faellige("deutsch", 3).filter(x => { const y = Object.assign({}, x); delete y.__karte; return !eigene.has(JSON.stringify(y)); });
    return karten.length ? Object.assign({}, k, { schritte: [WIEDER_INTRO, ...karten, ...k.schritte] }) : k;
  }

  // Paket D1: Aufnahme-Schritte nur, wenn die Eltern es erlaubt haben und das Gerät aufnehmen kann – sonst still weglassen
  const ohneAufnahme = (k) => window.Eigenes && Eigenes.darfAufnehmen() ? k : Object.assign({}, k, { schritte: k.schritte.filter(x => x.typ !== "aufnehmen") });
  function starte(i, liste = G) {
    const k = mitWiederholung(ohneAufnahme(liste[i]));
    lauf = { i, k, liste, werk: liste !== G, pos: 0, fehler: 0, stufe: 0 };
    document.body.style.setProperty("--grund", k.grund);
    document.body.style.setProperty("--akzent", k.farbe);
    $("kapitel-name").textContent = k.name;
    $("fipsi-gross").innerHTML = fipsi();
    zeige("kapitel");
    schritt();
  }

  function blase(html, gesprochen, ru) {
    $("blase").innerHTML = html + `<div class="blase-knoepfe">` +
      (SP.verfuegbar() ? `<button class="klein-knopf" id="nochmal-hoeren" aria-label="Nochmal vorlesen">🔊</button>` : "") +
      (daten().ru && ru ? `<button class="klein-knopf" id="ru-knopf" lang="${HL().code}">${HL().kurz}</button>` : "") + `</div>`;
    const rb = $("ru-blase"); rb.hidden = true; rb.textContent = ""; rb.lang = HL().code; rb.dir = HL().rtl ? "rtl" : "ltr";
    const nh = $("nochmal-hoeren");
    if (nh) nh.addEventListener("click", () => { const st = SP.verfuegbar(); if (st) SP.sprich(gesprochen, "de-DE"); });
    const rk = $("ru-knopf");
    if (rk) rk.addEventListener("click", () => {
      rb.hidden = !rb.hidden; rb.textContent = mitName(ru);
      if (!rb.hidden && SP.hat(HL().tts)) SP.sprich(mitName(ru), HL().tts);
    });
    if (gesprochen) sprich(gesprochen);
  }

  const luecke = (satz, fuell) => satz.replace("___", `<span class="luecke">${fuell || "&nbsp;"}</span>`);
  const sprechbar = (satz) => satz.replace("___", "…");

  function schritt() {
    const { k } = lauf;
    $("balken").style.width = Math.round(lauf.pos / k.schritte.length * 100) + "%";
    if (lauf.pos >= k.schritte.length) return beende();
    const s = k.schritte[lauf.pos];
    lauf.versuche = 0;
    const A = $("aufgabe");
    A.classList.toggle("lang", ["ordnen", "verbessern", "schreiben", "aufnehmen"].includes(s.typ) || !!s.gedicht); A.scrollTop = 0;   // Paket A: hohe Inhalte oben beginnen, sonst schneidet die Zentrierung oben ab
    const hinweis = `<p class="hinweis" id="hinweis"></p>`;

    switch (s.typ) {
      case "sag": {
        const t = mitName(s.text);
        blase(t, t, S.ht(s));
        // Paket D1: Gedicht oder Reim zeilenweise zeigen, mit eigenem Vorlese-Knopf
        A.innerHTML = (s.gedicht ? gedichtHtml(s) + (SP.verfuegbar() ? `<button class="knopf" id="gedicht-hoeren">🔊 Gedicht anhören</button>` : "")
          : `<div class="gross-emoji" aria-hidden="true">${k.ort}</div>`) + `<button class="knopf weiter" id="weiter">Weiter</button>`;
        if ($("gedicht-hoeren")) $("gedicht-hoeren").addEventListener("click", () => SP.sprich(s.gedicht.filter(Boolean).join(" … "), "de-DE"));
        $("weiter").addEventListener("click", () => { S.ton("tipp"); weiter(); });
        break;
      }
      case "bild": case "hoeren": {
        const opts = mische(s.optionen.map((o, idx) => Object.assign({ richtig: idx === 0 }, o)));
        const hoeren = s.typ === "hoeren";
        const ohneStimme = hoeren && !(SP.verfuegbar() && daten().vorlesen && SP.hat("de-DE"));
        if (hoeren) blase(ohneStimme ? `Lies und finde das Bild: <b>${s.sag}</b>` : "Hör gut zu! Welches Bild passt?", ohneStimme ? "" : s.sag, S.ht(s));
        else blase(s.frage, s.frage, S.ht(s));
        A.innerHTML = (hoeren && !ohneStimme ? `<button class="hoeren-knopf" id="hoeren" aria-label="Anhören">🔊</button>` : "") +
          `<div class="optionen bilder">` + opts.map((o, n) => `<button class="option" data-n="${n}" aria-label="${hoeren ? "Bild " + (n + 1) : o.t}"><span class="emoji">${o.e}</span><span class="name"></span></button>`).join("") + `</div>` + hinweis;
        if ($("hoeren")) $("hoeren").addEventListener("click", () => SP.sprich(s.sag, "de-DE"));
        A.querySelectorAll(".option").forEach(b => b.addEventListener("click", () => {
          const o = opts[+b.dataset.n];
          antwort(b, o.richtig, () => {
            A.querySelectorAll(".option").forEach((x, n) => x.querySelector(".name").textContent = opts[n].t);
            return hoeren ? s.sag : o.t;
          });
        }));
        break;
      }
      case "hoertext": case "blitz": {
        // Schuljahr Deutsch: hoertext = längerer Text (Durchsage, kleine Geschichte) wird vorgelesen, dann eine Frage dazu
        // (ohne Stimme steht der Text zum Lesen da); blitz = ein Wort blitzt kurz auf, dann wählt das Kind, welches es war (Blitzlesen)
        const opts = mische(s.optionen.map((t, idx) => ({ t, richtig: idx === 0 })));
        const stimme = SP.verfuegbar() && daten().vorlesen && SP.hat("de-DE"), blitz = s.typ === "blitz";
        const frage = blitz ? (s.frage || "Schau genau hin! Welches Wort hast du gesehen?") : s.frage;
        // Hörtext mit Stimme: erst den Text vorlesen, danach die Frage (ohne Stimme liest das Kind beides)
        if (!blitz && stimme) { blase(frage, "", S.ht(s)); const jetzt = lauf; setTimeout(() => { if (lauf === jetzt) SP.sprich(s.text, "de-DE", () => { if (lauf === jetzt) sprich(frage); }); }, 400); }
        else blase(frage, frage, S.ht(s));
        const oben = blitz ? `<div class="blitz-feld"><span class="blitz-wort" id="blitz-wort">${s.wort}</span></div><button class="klein-knopf" id="blitz-nochmal">⚡ Noch einmal blitzen</button>`
          : `<div class="hoertext">${s.e ? `<span class="gross-emoji klein" aria-hidden="true">${s.e}</span>` : ""}` +
            (stimme ? `<button class="hoeren-knopf" id="hoeren" aria-label="Anhören">🔊</button><p class="hoertext-text" id="hoertext-text" hidden>${s.text}</p>` : `<p class="hoertext-text">${s.text}</p>`) + `</div>`;
        A.innerHTML = oben + `<div class="optionen texte">` + opts.map((o, n) => `<button class="option" data-n="${n}">${o.t}</button>`).join("") + `</div>` + hinweis;
        if (blitz) {
          const w = $("blitz-wort"), zeigeKurz = () => { w.style.visibility = "visible"; setTimeout(() => { w.style.visibility = "hidden"; }, s.ms || 900); };
          setTimeout(zeigeKurz, 700); $("blitz-nochmal").addEventListener("click", () => { S.ton("tipp"); zeigeKurz(); });
        }
        if ($("hoeren")) $("hoeren").addEventListener("click", () => SP.sprich(s.text, "de-DE"));
        A.querySelectorAll(".option").forEach(b => b.addEventListener("click", () => {
          const o = opts[+b.dataset.n];
          antwort(b, o.richtig, () => {
            if (blitz) $("blitz-wort").style.visibility = "visible";
            else if ($("hoertext-text")) $("hoertext-text").hidden = false;
            return blitz ? s.wort : s.optionen[0];
          });
        }));
        break;
      }
      case "wort": case "luecke": case "wo": {
        const opts = mische(s.optionen.map((t, idx) => ({ t, richtig: idx === 0 })));
        let oben = "";
        if (s.typ === "wort") { blase(s.frage, s.frage, S.ht(s)); oben = `<div class="gross-emoji" aria-hidden="true">${s.e}</div>`; }
        else if (s.typ === "luecke") { blase(luecke(s.satz), sprechbar(s.satz), S.ht(s)); oben = s.e ? `<div class="gross-emoji" aria-hidden="true">${s.e}</div>` : ""; }
        else { blase(luecke(s.satz), sprechbar(s.satz), S.ht(s)); oben = szene(s.ding, s.lage, s.ding2); }
        A.innerHTML = oben + `<div class="optionen texte">` + opts.map((o, n) => `<button class="option" data-n="${n}">${o.t}</button>`).join("") + `</div>` + hinweis;
        A.querySelectorAll(".option").forEach(b => b.addEventListener("click", () => {
          const o = opts[+b.dataset.n];
          antwort(b, o.richtig, () => {
            if (s.typ === "wort") return s.frage.endsWith("…") ? s.frage.replace("…", o.t) : o.t;
            $("blase").querySelector(".luecke").textContent = s.optionen[0];
            return s.satz.replace("___", s.optionen[0]);
          });
        }));
        break;
      }
      case "wortart": {
        const ARTEN = [["nomen", "Namenwort", "Nomen"], ["verb", "Tunwort", "Verb"], ["adjektiv", "Wiewort", "Adjektiv"]];
        blase("Was für ein Wort ist das?", `Was für ein Wort ist das? ${s.wort}`, S.ht(s) ? `${S.ht(s)} — ?` : "");
        A.innerHTML = (s.e ? `<div class="gross-emoji" aria-hidden="true">${s.e}</div>` : "") + `<div class="artikel-wort">${s.wort}</div>` +
          `<div class="optionen texte">` + ARTEN.map(([id, a, b]) => `<button class="option" data-wert="${id}">${a}<br><small>(${b})</small></button>`).join("") + `</div>` + hinweis;
        A.querySelectorAll(".option").forEach(b => b.addEventListener("click", () => {
          antwort(b, b.dataset.wert === s.richtig, () => {
            const a = ARTEN.find(x => x[0] === s.richtig);
            return `${s.wort} ist ein ${a[1]}.`;
          });
        }));
        break;
      }
      case "verlaengern": {
        const anzeige = s.wort.replace("_", `<span class="luecke" id="vl-luecke">&nbsp;</span>`);
        blase(`${s.richtig} oder ${s.falsch}? Verlängere das Wort!`, `${s.richtig} oder ${s.falsch}? Verlängere das Wort!`, S.ht(s));
        const opts = mische([s.richtig, s.falsch]);
        A.innerHTML = `<div class="gross-emoji" aria-hidden="true">${s.e}</div><div class="artikel-wort">${anzeige}</div>` +
          `<div class="optionen artikel klar">` + opts.map(o => `<button class="option" data-wert="${o}">${o}</button>`).join("") + `</div>` + hinweis;
        A.querySelectorAll(".option").forEach(b => b.addEventListener("click", () => {
          antwort(b, b.dataset.wert === s.richtig, () => {
            $("vl-luecke").textContent = s.richtig;
            const ganz = s.wort.replace("_", s.richtig);
            $("hinweis").insertAdjacentHTML("afterend", `<p class="hinweis gut" style="margin-top:4px">${ganz} – ${s.lang}</p>`);
            return `${ganz}, ${s.lang}`;
          });
        }));
        break;
      }
      case "silben": {
        blase("Wie viele Silben hat das Wort? Klatsch mit!", `Wie viele Silben hat das Wort? ${s.wort}`, S.ht(s));
        A.innerHTML = `<div class="gross-emoji" aria-hidden="true">${s.e}</div><div class="artikel-wort" id="silben-wort">${s.wort}</div>` +
          `<button class="knopf klatsch" id="klatsch" aria-label="Klatschen">👏 <span id="klatsch-n">0</span></button>` +
          `<div class="optionen artikel klar">` + [1, 2, 3, 4, 5].map(n => `<button class="option" data-wert="${n}">${n}</button>`).join("") + `</div>` + hinweis;
        let n = 0; $("klatsch").addEventListener("click", () => { n++; $("klatsch-n").textContent = n; S.ton("tipp"); });
        if (SP.verfuegbar() && daten().vorlesen) setTimeout(() => SP.sprich(s.wort), 600);
        A.querySelectorAll(".option").forEach(b => b.addEventListener("click", () => {
          antwort(b, +b.dataset.wert === s.teile.length, () => {
            $("silben-wort").innerHTML = s.teile.map(t => `<span class="silbe">${t}</span>`).join("<span class='trenn'>–</span>");
            return s.teile.join(" – ");
          });
        }));
        break;
      }
      case "artikel": {
        blase(`der, die oder das?`, `der, die oder das? ${s.wort}`, S.ht(s) ? `${S.ht(s)} — der, die, das?` : "");
        A.innerHTML = `<div class="gross-emoji" aria-hidden="true">${s.e}</div><div class="artikel-wort"><span class="luecke" id="art-luecke">&nbsp;</span>${s.wort}</div>` +
          `<div class="optionen artikel">` + ["der", "die", "das"].map(a => `<button class="option" data-wert="${a}">${a}</button>`).join("") + `</div>` + hinweis;
        A.querySelectorAll(".option").forEach(b => b.addEventListener("click", () => {
          antwort(b, b.dataset.wert === s.richtig, () => { $("art-luecke").textContent = s.richtig; return `${s.richtig} ${s.wort}`; });
        }));
        break;
      }
      case "satz": {
        blase("Bau den Satz! Tippe die Wörter der Reihe nach an.", "Bau den Satz!", S.ht(s));
        lauf.gewaehlt = [];
        let chips = mische(s.woerter.map((w, idx) => ({ w, idx })));
        if (chips.every((c, n) => c.idx === n)) chips = chips.reverse();
        A.innerHTML = (s.e ? `<div class="gross-emoji" aria-hidden="true" style="font-size:clamp(3.4rem,9vw,5.5rem)">${s.e}</div>` : "") +
          `<div class="satz-zeile" id="satz-zeile" aria-label="Dein Satz"></div><div class="chips" id="chips">` +
          chips.map((c, n) => `<button class="chip" data-n="${n}">${c.w}</button>`).join("") + `</div>` +
          `<button class="knopf haupt pruefen" id="pruefen" disabled>Fertig</button>` + hinweis;
        const zeile = $("satz-zeile"), pruefen = $("pruefen");
        const zeichneZeile = () => {
          zeile.innerHTML = lauf.gewaehlt.map((n, pos) => `<button class="chip" data-pos="${pos}">${chips[n].w}</button>`).join("");
          A.querySelectorAll("#chips .chip").forEach(c => c.classList.toggle("weg", lauf.gewaehlt.includes(+c.dataset.n)));
          pruefen.disabled = lauf.gewaehlt.length !== chips.length;
          zeile.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => { if (lauf.gesperrt) return; lauf.gewaehlt.splice(+c.dataset.pos, 1); S.ton("tipp"); zeichneZeile(); }));
        };
        A.querySelectorAll("#chips .chip").forEach(c => c.addEventListener("click", () => {
          if (lauf.gesperrt || lauf.gewaehlt.includes(+c.dataset.n)) return;
          lauf.gewaehlt.push(+c.dataset.n); S.ton("tipp"); SP.verfuegbar() && daten().vorlesen && SP.sprich(chips[+c.dataset.n].w);
          zeichneZeile();
        }));
        pruefen.addEventListener("click", () => {
          const satz = lauf.gewaehlt.map(n => chips[n].w).join(" ");
          const richtig = satz === s.woerter.join(" ");
          if (richtig) { zeile.classList.add("richtig"); }
          antwort(null, richtig, () => s.woerter.join(" "), () => {
            // Falsch: ab dem ersten falschen Wort zurücklegen
            const erste = lauf.gewaehlt.findIndex((n, pos) => chips[n].w !== s.woerter[pos]);
            lauf.gewaehlt = lauf.gewaehlt.slice(0, Math.max(0, erste));
            zeichneZeile();
          }, () => { lauf.gewaehlt = s.woerter.map((_, pos) => chips.findIndex(c => c.idx === pos)); zeichneZeile(); zeile.classList.add("richtig"); });
        });
        break;
      }
      case "ordnen": {
        // Paket A: ganze Sätze/Bausteine als Karten in die richtige Reihenfolge tippen (Geschichte, Brief, Stichwortzettel, ABC)
        const frage = s.frage || "Bring die Teile in die richtige Reihenfolge! Tippe sie der Reihe nach an.";
        blase(frage, frage, S.ht(s));
        lauf.gewaehlt = [];
        let karten = mische(s.teile.map((t, idx) => ({ t, idx })));
        if (karten.every((c, n) => c.idx === n)) karten = karten.reverse();
        const kurz = s.teile.every(t => t.length <= 16);
        A.innerHTML = (s.e ? `<div class="gross-emoji" aria-hidden="true" style="font-size:clamp(3rem,8vw,4.6rem)">${s.e}</div>` : "") +
          `<ol class="ordnen-liste${kurz ? " kurz" : ""}" id="ordnen-liste" aria-label="Deine Reihenfolge"></ol>` +
          `<div class="ordnen-karten${kurz ? " kurz" : ""}" id="ordnen-karten">` +
          karten.map((c, n) => `<button class="okarte" data-n="${n}">${c.t}</button>`).join("") + `</div>` +
          `<button class="knopf haupt pruefen" id="pruefen" disabled>Fertig</button>` + hinweis;
        const liste = $("ordnen-liste"), pruefen = $("pruefen");
        const zeichne = () => {
          liste.innerHTML = s.teile.map((_, pos) => {
            const n = lauf.gewaehlt[pos];
            return n == null ? `<li class="platz leer"><span class="nr">${pos + 1}</span></li>`
              : `<li class="platz"><span class="nr">${pos + 1}</span><button class="okarte drin" data-pos="${pos}">${karten[n].t}</button></li>`;
          }).join("");
          A.querySelectorAll("#ordnen-karten .okarte").forEach(c => c.classList.toggle("weg", lauf.gewaehlt.includes(+c.dataset.n)));
          pruefen.disabled = lauf.gewaehlt.length !== karten.length;
          liste.querySelectorAll(".okarte").forEach(c => c.addEventListener("click", () => { if (lauf.gesperrt) return; lauf.gewaehlt.splice(+c.dataset.pos, 1); S.ton("tipp"); zeichne(); }));
        };
        A.querySelectorAll("#ordnen-karten .okarte").forEach(c => c.addEventListener("click", () => {
          if (lauf.gesperrt || lauf.gewaehlt.includes(+c.dataset.n)) return;
          lauf.gewaehlt.push(+c.dataset.n); S.ton("tipp"); SP.verfuegbar() && daten().vorlesen && SP.sprich(karten[+c.dataset.n].t);
          zeichne();
        }));
        zeichne();
        pruefen.addEventListener("click", () => {
          const richtig = lauf.gewaehlt.every((n, pos) => karten[n].idx === pos);
          if (richtig) liste.classList.add("richtig");
          antwort(null, richtig, () => s.teile.join(" "), () => {
            // Falsch: die richtigen Karten vorn bleiben liegen, der Rest geht zurück
            const erste = lauf.gewaehlt.findIndex((n, pos) => karten[n].idx !== pos);
            lauf.gewaehlt = lauf.gewaehlt.slice(0, Math.max(0, erste));
            zeichne();
          }, () => { lauf.gewaehlt = s.teile.map((_, pos) => karten.findIndex(c => c.idx === pos)); zeichne(); liste.classList.add("richtig"); });
        });
        break;
      }
      case "verbessern": {
        // Paket A: Text überarbeiten – erst das störende Wort finden, dann eine bessere Variante wählen
        const woerter = s.satz.split(" ");
        const kern = (w) => w.replace(/[.,!?:;„“"]/g, "");
        const ziel = s.stelle != null ? s.stelle : woerter.findIndex(w => kern(w) === s.falsch);
        const frage = s.frage || "Ein Wort passt hier nicht gut. Tippe es an!";
        blase(frage, `${frage} ${s.satz}`, S.ht(s));
        A.innerHTML = (s.e ? `<div class="gross-emoji" aria-hidden="true" style="font-size:clamp(3rem,8vw,4.6rem)">${s.e}</div>` : "") +
          `<div class="vb-satz" id="vb-satz">` + woerter.map((w, n) => `<button class="vb-wort" data-n="${n}">${w}</button>`).join("") + `</div>` +
          `<div class="optionen texte" id="vb-optionen" hidden></div>` + hinweis;
        const besser = () => woerter.map((w, n) => n === ziel ? w.replace(kern(w), s.optionen[0]) : w).join(" ");
        let gefunden = false;
        A.querySelectorAll(".vb-wort").forEach(b => b.addEventListener("click", () => {
          if (gefunden || lauf.gesperrt) return;
          const n = +b.dataset.n;
          const passt = s.stelle != null ? n === ziel : kern(woerter[n]) === s.falsch;
          if (!passt) {
            antwort(b, false);
            if (lauf.versuche >= 2) A.querySelectorAll(".vb-wort")[ziel].classList.add("zeig");
            return;
          }
          gefunden = true; S.ton("tipp");
          A.querySelectorAll(".vb-wort").forEach((x, k) => { x.disabled = true; if (k === +b.dataset.n) x.classList.add("gefunden"); });
          const h = $("hinweis"); h.className = "hinweis gut"; h.textContent = s.tipp || "Gefunden! Was passt besser?";
          if (s.tipp) sprich(s.tipp);
          const opts = mische(s.optionen.map((t, idx) => ({ t, richtig: idx === 0 })));
          const box = $("vb-optionen"); box.hidden = false;
          box.innerHTML = opts.map((o, k) => `<button class="option" data-n="${k}">${o.t}</button>`).join("");
          box.querySelectorAll(".option").forEach(o => o.addEventListener("click", () => {
            const wahl = opts[+o.dataset.n];
            antwort(o, wahl.richtig, () => {
              A.querySelector(".vb-wort.gefunden").textContent = woerter[ziel].replace(kern(woerter[ziel]), s.optionen[0]);
              return besser();
            });
          }));
        }));
        break;
      }
      case "schreiben": schreibSchritt(s, A, hinweis); break;
      case "aufnehmen": aufnahmeSchritt(s, A, hinweis); break;
    }
  }

  // ---------- Paket D1: frei schreiben und sich selbst aufnehmen ----------
  const gedichtHtml = (s) => `<div class="gedicht">${s.titel ? `<b>${s.titel}</b>` : ""}${s.gedicht.map(z => z ? `<span>${z}</span>` : `<span class="leer"></span>`).join("")}</div>`;
  const bildfolgeHtml = (s) => `<div class="bildfolge" aria-hidden="true">${s.bilder.map((b, n) => `<div><span class="nr">${n + 1}</span>${b}</div>`).join("")}</div>`;
  // Einfache Prüfung ohne KI: Länge, Satzzahl, Großschreibung am Satzanfang, Satzzeichen am Ende, Pflichtwörter. Ergebnis: Liste von Punkten.
  function pruefeText(text, s) {
    const t = text.trim().replace(/\s+/g, " ");
    const woerter = t ? t.split(" ").filter(w => /[A-Za-zÄÖÜäöüß]/.test(w)) : [];
    const saetze = t ? (t.match(/[^.!?]+[.!?]*/g) || []).map(x => x.trim()).filter(x => /[A-Za-zÄÖÜäöüß]/.test(x)) : [];
    const minW = s.woerter || 5, minS = s.saetze || 1;
    const punkte = [
      { id: "laenge", ok: woerter.length >= minW, text: `Mindestens ${minW} Wörter (${woerter.length})` },
      { id: "saetze", ok: saetze.length >= minS, text: minS === 1 ? "Ein ganzer Satz" : `Mindestens ${minS} Sätze (${saetze.length})` },
      { id: "gross", ok: saetze.length > 0 && saetze.every(x => /^[^A-Za-zÄÖÜäöüß]*[A-ZÄÖÜ]/.test(x)), text: "Jeder Satz beginnt groß" },
      { id: "zeichen", ok: /[.!?][“"»«]?$/.test(t), text: "Am Ende steht . ! oder ?" }
    ];
    (s.pflicht || []).forEach(w => punkte.push({ id: "w:" + w, ok: t.toLowerCase().includes(w.toLowerCase()), text: `Das Wort „${w}“ kommt vor` }));
    // Schuljahr Deutsch: Listen und Gedichtformen (Einkaufszettel, Elfchen) brauchen keine Sätze mit Satzzeichen
    return s.liste ? punkte.filter(p => !["saetze", "gross", "zeichen"].includes(p.id)) : punkte;
  }
  const TIPP = { laenge: "Schreib noch ein bisschen mehr.", saetze: "Schreib noch einen Satz dazu.", gross: "Schau mal: Fängt jeder Satz mit einem großen Buchstaben an?",
    zeichen: "Am Satzende fehlt noch ein Punkt, ein Fragezeichen oder ein Ausrufezeichen." };
  const tippFuer = (p) => TIPP[p.id] || `Kannst du das Wort „${p.id.slice(2)}“ noch einbauen?`;

  function schreibSchritt(s, A, hinweis) {
    const frage = mitName(s.frage);
    blase(frage, frage, S.ht(s));
    const karten = (s.pflicht || []).concat(s.karten || []);
    A.innerHTML = (s.bilder ? bildfolgeHtml(s) : s.e ? `<div class="gross-emoji klein" aria-hidden="true">${s.e}</div>` : "") +
      (karten.length ? `<div class="wortkarten" aria-label="Wörter zum Einfügen">${karten.map(w => `<button class="chip wk" data-w="${w}">${w}</button>`).join("")}</div>` : "") +
      `<textarea id="schreibfeld" class="schreibfeld" rows="4" lang="de" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" placeholder="${s.anfang ? "" : "Hier schreibst du …"}" aria-label="Dein Text"></textarea>` +
      `<ul class="pruefliste" id="pruefliste"></ul>` +
      `<div class="schreib-knoepfe">${SP.verfuegbar() ? `<button class="knopf" id="vorlesen-eigen">🔊 Vorlesen</button>` : ""}<button class="knopf haupt pruefen" id="pruefen" disabled>Fertig</button></div>` + hinweis;
    const feld = $("schreibfeld"), liste = $("pruefliste"), pruefen = $("pruefen");
    if (s.anfang) feld.value = s.anfang;
    const zeichne = () => {
      const p = pruefeText(feld.value, s);
      liste.innerHTML = p.map(x => `<li class="${x.ok ? "ok" : ""}">${x.ok ? "✅" : "⬜"} ${x.text}</li>`).join("");
      pruefen.disabled = !feld.value.trim() || feld.value.trim() === (s.anfang || "").trim();
      return p;
    };
    feld.addEventListener("input", zeichne);
    A.querySelectorAll(".wk").forEach(b => b.addEventListener("click", () => {
      if (lauf.gesperrt) return;
      const a = feld.selectionStart ?? feld.value.length, e = feld.selectionEnd ?? a, v = feld.value;
      const vor = a > 0 && !/\s$/.test(v.slice(0, a)) ? " " : "";
      feld.value = v.slice(0, a) + vor + b.dataset.w + " " + v.slice(e);
      const pos = a + vor.length + b.dataset.w.length + 1; feld.setSelectionRange(pos, pos); S.ton("tipp"); zeichne();
    }));
    const ve = $("vorlesen-eigen"); if (ve) ve.addEventListener("click", () => { if (feld.value.trim()) SP.sprich(feld.value.trim(), "de-DE"); });
    zeichne();
    pruefen.addEventListener("click", () => {
      if (lauf.gesperrt) return;
      const p = zeichne(), offen = p.filter(x => !x.ok), h = $("hinweis");
      const ersterVersuch = lauf.versuche === 0;
      if (offen.length && lauf.versuche === 0) {
        // Erst ein freundlicher Hinweis statt „falsch“; zählt nicht gegen die Sterne
        lauf.versuche++;
        if (window.Koennen) Koennen.melde(lzSchritt(s), false);
        h.className = "hinweis tipp"; h.textContent = tippFuer(offen[0]) + " Dann tippe nochmal auf Fertig.";
        sprich(tippFuer(offen[0])); S.ton("tipp"); feld.focus();
        return;
      }
      lauf.gesperrt = true; feld.readOnly = true; feld.blur();
      A.querySelectorAll(".wk").forEach(b => b.disabled = true);
      if (ersterVersuch) { if (window.Charakter) Charakter.gib("deutsch", 2); if (window.Koennen) Koennen.melde(lzSchritt(s), true); }
      const text = feld.value.trim();
      const lob = offen.length ? `Gut gemacht! Tipp fürs nächste Mal: ${tippFuer(offen[0])}` : LOB[Math.floor(Math.random() * LOB.length)] + " Ein schöner Text!";
      h.className = "hinweis gut"; h.textContent = lob; S.ton("juhu"); sprich(lob);
      const gespeichert = window.Eigenes ? Eigenes.speichere({ art: "text", kapitel: lauf.k.id, aufgabe: frage, text }).catch(() => null) : Promise.resolve(null);
      gespeichert.then(id => {
        if (lauf && lauf.k.schritte[lauf.pos] === s) h.insertAdjacentHTML("afterend", `<p class="klein-info" id="gespeichert">${id ? "📒 Gespeichert – deine Eltern können deinen Text lesen." : ""}</p>`);
      });
      pruefen.remove();
      A.insertAdjacentHTML("beforeend", `<button class="knopf weiter" id="weiter">Weiter</button>`);
      $("weiter").addEventListener("click", () => { lauf.gesperrt = false; S.ton("tipp"); weiter(); });
      $("weiter").scrollIntoView({ block: "nearest" });
    });
  }

  let aufnahmeEnde = null;   // stoppt Mikrofon und Wiedergabe, wenn das Kind den Schritt verlässt
  function aufnahmeSchritt(s, A, hinweis) {
    const frage = mitName(s.frage);
    blase(frage, frage, S.ht(s));
    A.innerHTML = (s.gedicht ? gedichtHtml(s) : s.bilder ? bildfolgeHtml(s) : s.e ? `<div class="gross-emoji klein" aria-hidden="true">${s.e}</div>` : "") +
      `<button class="aufnahme-knopf" id="aufnahme" aria-label="Aufnehmen">🎙️</button><p class="aufnahme-zeit" id="aufnahme-zeit">Tippe aufs Mikrofon und leg los!</p>` +
      `<div class="schreib-knoepfe" id="nach-aufnahme" hidden><button class="knopf" id="anhoeren">▶️ Anhören</button><button class="knopf" id="nochmal">🔁 Nochmal</button><button class="knopf haupt" id="aufnahme-fertig">Fertig</button></div>` +
      `<button class="knopf leise" id="ohne-aufnahme">Lieber ohne Aufnahme weiter</button>` + hinweis;
    let rec = null, erg = null, adresse = null, uhr = null, spieler = null;
    aufnahmeEnde = () => { if (rec) rec.stopp(); aufraeumen(); };
    const knopf = $("aufnahme"), zeit = $("aufnahme-zeit"), dieser = lauf, an = lauf.pos;
    const nochDa = () => lauf === dieser && lauf.pos === an;
    const aufraeumen = () => { clearInterval(uhr); if (spieler) spieler.pause(); if (adresse) URL.revokeObjectURL(adresse); adresse = null; };
    knopf.addEventListener("click", async () => {
      if (rec) { rec.stopp(); return; }
      SP.stopp(); aufraeumen(); $("nach-aufnahme").hidden = true;
      try {
        rec = await Eigenes.starteAufnahme((x) => {
          rec = null; clearInterval(uhr); knopf.classList.remove("laeuft"); knopf.textContent = "🎙️"; knopf.setAttribute("aria-label", "Nochmal aufnehmen");
          if (!nochDa()) return;
          erg = x;
          zeit.textContent = x ? `Aufgenommen: ${x.dauer} Sekunden. Hör dich an!` : "Da war nichts zu hören. Probier es nochmal!";
          $("nach-aufnahme").hidden = !x;
          if (x) $("nach-aufnahme").scrollIntoView({ block: "nearest" });
        });
      } catch (e) {
        // Keine Erlaubnis oder kein Mikrofon: freundlich weiter ohne Aufnahme
        zeit.textContent = "Das Mikrofon ist gerade aus. Sag es einfach laut – das ist auch Üben!";
        knopf.disabled = true; $("ohne-aufnahme").textContent = "Weiter"; $("ohne-aufnahme").classList.remove("leise");
        return;
      }
      knopf.classList.add("laeuft"); knopf.textContent = "⏹️"; knopf.setAttribute("aria-label", "Aufnahme stoppen");
      const start = Date.now();
      zeit.textContent = "Ich höre zu … 0 s";
      uhr = setInterval(() => { zeit.textContent = `Ich höre zu … ${Math.round((Date.now() - start) / 1000)} s – tippe auf Stopp, wenn du fertig bist.`; }, 500);
    });
    $("anhoeren").addEventListener("click", () => {
      if (!erg) return;
      if (spieler) spieler.pause();
      if (!adresse) adresse = Eigenes.url(erg);
      spieler = new Audio(adresse); spieler.play().catch(() => {});
    });
    $("nochmal").addEventListener("click", () => { S.ton("tipp"); knopf.click(); });
    $("aufnahme-fertig").addEventListener("click", () => {
      if (!erg) return;
      if (window.Charakter) Charakter.gib("deutsch", 2);
      Eigenes.speichere({ art: "ton", kapitel: lauf.k.id, aufgabe: frage, ton: erg.ton, typ: erg.typ, dauer: erg.dauer }).catch(() => null);
      aufraeumen(); S.ton("juhu"); weiter();
    });
    $("ohne-aufnahme").addEventListener("click", () => { if (rec) rec.stopp(); aufraeumen(); S.ton("tipp"); weiter(); });
  }

  // Szene für auf / unter / neben / in
  function szene(ding, lage, ort) {
    const boden = `<rect x="0" y="236" width="320" height="14" rx="7" fill="#F2D49B"/>`;
    if (ort === "kiste") {
      return `<svg class="szene" viewBox="0 0 320 250" aria-hidden="true">${boden}` +
        `<path d="M80 130 L60 98 L120 98 Z M220 130 L240 98 L180 98 Z" fill="#B07A43" stroke="#7A4E25" stroke-width="4" stroke-linejoin="round"/>` +
        `<rect x="80" y="130" width="140" height="106" rx="6" fill="#8A5A34" stroke="#7A4E25" stroke-width="5"/>` +
        `<text x="150" y="176" font-size="50" text-anchor="middle">${ding}</text>` +
        `<rect x="80" y="166" width="140" height="70" rx="6" fill="#C98A4B" stroke="#7A4E25" stroke-width="5"/><path d="M80 200 H220" stroke="#A0693F" stroke-width="4"/></svg>`;
    }
    const pos = { auf: [150, 92], unter: [150, 226], neben: [266, 226] }[lage];
    return `<svg class="szene" viewBox="0 0 320 250" aria-hidden="true">${boden}` +
      `<rect x="90" y="118" width="14" height="118" fill="#7A4E25"/><rect x="196" y="118" width="14" height="118" fill="#7A4E25"/>` +
      `<rect x="66" y="104" width="168" height="18" rx="6" fill="#C98A4B" stroke="#7A4E25" stroke-width="5"/>` +
      `<text x="${pos[0]}" y="${pos[1]}" font-size="52" text-anchor="middle">${ding}</text></svg>`;
  }

  // Gemeinsame Prüfung: richtig → loben, vorlesen, weiter. Falsch → nochmal, nach 2 Fehlern Lösung zeigen.
  function antwort(knopf, richtig, beiRichtig, beiFalsch, zeigeLoesung) {
    if (lauf.gesperrt) return;
    const h = $("hinweis");
    const schrittJetzt = lauf.k.schritte[lauf.pos];
    if (richtig) {
      lauf.gesperrt = true;
      if (lauf.versuche === 0 && window.Charakter) Charakter.gib("deutsch", 1);
      if (lauf.versuche === 0 && window.Koennen) Koennen.melde(lzSchritt(schrittJetzt), true);
      if (knopf) knopf.classList.add("richtig");
      document.querySelectorAll(".option").forEach(o => o.disabled = true);
      h.className = "hinweis gut"; h.textContent = LOB[Math.floor(Math.random() * LOB.length)];
      S.ton("juhu");
      const satz = beiRichtig();
      if (lauf.versuche === 0 && schrittJetzt && schrittJetzt.__karte && window.Lernkartei && Lernkartei.richtig("deutsch", schrittJetzt) && window.Lernfunde) {
        const t = String(satz || "").trim();
        Lernfunde.merke({ fach: "deutsch", art: "gemeistert", e: "💪", text: t.length > 50 ? t : `${t} – war knifflig, jetzt kannst du es!`, schluessel: "dk:" + t, melden: true });
      }
      setTimeout(() => sprich(satz), 350);
      const dieser = lauf, an = lauf.pos; // nur weiterblättern, wenn noch derselbe Schritt offen ist
      setTimeout(() => { if (lauf !== dieser || lauf.pos !== an) return; lauf.gesperrt = false; weiter(); }, window.__testSchnell ? 150 : 2300);   // Test-Haken __testSchnell: kurze Pause, damit Tests viele Kapitel echt durchspielen können
      return;
    }
    lauf.versuche++;
    if (lauf.versuche === 1) {
      if (!(schrittJetzt && schrittJetzt.__karte)) lauf.fehler++;   // Wiederholungen zählen nicht gegen die Sterne
      if (window.Lernkartei) Lernkartei.falsch("deutsch", schrittJetzt);
      if (window.Koennen) Koennen.melde(lzSchritt(schrittJetzt), false);
    }
    S.ton("nein");
    if (knopf) { knopf.classList.add("falsch"); knopf.disabled = true; }
    h.className = "hinweis nein";
    if (lauf.versuche >= 2 && !knopf) {
      // Satzbau: nach dem 2. Fehler Lösung zeigen
      h.textContent = "So heißt der Satz:";
      zeigeLoesung && zeigeLoesung();
      lauf.gesperrt = true;
      const satz = beiRichtig();
      setTimeout(() => sprich(satz), 300);
      const A = $("aufgabe"); A.querySelector("#pruefen").remove();
      A.insertAdjacentHTML("beforeend", `<button class="knopf weiter" id="weiter">Weiter</button>`);
      $("weiter").addEventListener("click", () => { lauf.gesperrt = false; S.ton("tipp"); weiter(); });
      return;
    }
    h.textContent = "Fast! Versuch es nochmal.";
    beiFalsch && beiFalsch();
  }

  function weiter() { SP.stopp(); if (aufnahmeEnde) { aufnahmeEnde(); aufnahmeEnde = null; } lauf.pos++; schritt(); }

  // ---------- Ende eines Kapitels ----------
  function beende() {
    const { k, i, fehler } = lauf;
    const sterne = fehler <= 1 ? 3 : fehler <= 3 ? 2 : 1;
    const vorher = bestes(k.id);
    let gewinn = Math.max(0, sterne - vorher);
    if (vorher === 3 && sterne === 3) gewinn = 1;
    const d = daten(); d.kapitel[k.id] = Math.max(vorher, sterne); S.speichere("deutsch", d);
    if (gewinn) S.gibSterne(gewinn);
    if (window.Charakter) { Charakter.gib("deutsch", 5); Charakter.ereignis("deutsch-kapitel"); }
    const alle = G.every(x => bestes(x.id) > 0), L = lauf.liste, werk = lauf.werk;
    // Lernfund: in der Werkstatt die Regel, im Abenteuer die Wörter mit Artikel aus diesem Kapitel
    if (window.Lernfunde) {
      const w = (k.schritte || []).filter(x => x.typ === "artikel" && !x.__karte).slice(0, 3);
      if (werk) Lernfunde.merke({ fach: "deutsch", art: "geuebt", e: k.ort, text: `Werkstatt: ${k.name}`, schluessel: "d:" + k.id });
      else Lernfunde.merke({ fach: "deutsch", art: "woerter", e: k.ort, schluessel: "d:" + k.id,
        text: w.length ? `${k.name}: ${w.map(x => `${x.richtig} ${x.wort}`).join(", ")}` : `Abenteuer: ${k.name}`,
        ru: w.every(x => x.ru) ? w.map(x => x.ru).join(", ") : "" });
    }

    $("ende-titel").textContent = werk ? `${k.name}: geschafft!` : alle && i === G.length - 1 ? "Schatzkarte komplett!" : `Kartenteil ${i + 1} gefunden!`;
    $("ende-teil").innerHTML = werk ? `<div class="gross-emoji">${k.ort}</div>` : kartenteil(i);
    $("ende-sterne").innerHTML = [1, 2, 3].map(n => `<span class="${n <= sterne ? "" : "leer"}" style="animation-delay:${300 + n * 180}ms">⭐</span>`).join("");
    $("ende-text").textContent = fehler === 0 ? "Alles beim ersten Mal richtig!" : fehler === 1 ? "Nur ein kleiner Fehler. Super!" : `Geschafft! ${fehler} Aufgaben brauchten einen zweiten Versuch.`;
    $("ende-gewinn").textContent = gewinn ? `+${gewinn} ${gewinn === 1 ? "Stern" : "Sterne"} für den Kleiderschrank. Du hast jetzt ${S.sterne()}.` : `Du hast ${S.sterne()} Sterne.`;
    const kn = $("ende-knoepfe"); kn.innerHTML = "";
    const knopf = (t, haupt, fn) => { const b = document.createElement("button"); b.className = "knopf" + (haupt ? " haupt" : ""); b.textContent = t; b.addEventListener("click", () => { S.ton("tipp"); fn(); }); kn.appendChild(b); };
    if (i + 1 < L.length) knopf(`Weiter: ${L[i + 1].name}`, true, () => starte(i + 1, L));
    knopf(werk ? "Zur Werkstatt" : "Zur Schatzkarte", i + 1 >= L.length, () => { zeige("karte"); zeichneKarte(); if (werk) setTimeout(() => { const w = $("werkstatt"); if (w) w.scrollIntoView({ behavior: "smooth" }); }, 50); });
    zeige("ende"); S.ton("juhu");
  }

  // ---------- Einstellungen ----------
  function zeigeEinst() {
    const d = daten();
    $("sch-ru").hidden = !S.hilfeRu(); $("test-ru").hidden = !S.hilfeRu();
    $("sch-ru").firstChild.textContent = `Hilfe auf ${HL().name} `; $("test-ru").textContent = `🔊 ${HL().name} testen`;
    [["sch-vorlesen", d.vorlesen], ["sch-ru", d.ru]].forEach(([id, an]) => { const b = $(id); b.setAttribute("aria-pressed", an); b.querySelector("b").textContent = an ? "an" : "aus"; });
    let info;
    if (!SP.verfuegbar()) info = "Dieser Browser kann nicht vorlesen.";
    else {
      const de = SP.hat("de-DE"), h = S.hilfe(), ru = !h || SP.hat(h.tts);
      info = `Deutsch: ${de ? SP.stimmeName("de-DE") : "keine Stimme gefunden"}. ` + (h ? `${h.name}: ${ru ? SP.stimmeName(h.tts) : "keine Stimme gefunden"}. ` : "") +
        "Kein Ton? Lauter stellen und am iPad im Kontrollzentrum die Glocke (Stumm) ausschalten." +
        (!de || !ru ? " Stimmen installieren: iPad → Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen. Android → Einstellungen → Sprachausgabe → Google → Sprachdaten." : "");
    }
    $("stimmen-info").textContent = info;
  }
  $("einst-auf").addEventListener("click", () => { S.ton("tipp"); zeigeEinst(); $("einst").hidden = false; setTimeout(zeigeEinst, 600); });
  $("einst-zu").addEventListener("click", () => { S.ton("tipp"); $("einst").hidden = true; zeichneKarte(); });
  $("sch-vorlesen").addEventListener("click", () => { setze("vorlesen", !daten().vorlesen); S.ton("tipp"); zeigeEinst(); });
  $("sch-ru").addEventListener("click", () => { setze("ru", !daten().ru); S.ton("tipp"); zeigeEinst(); });
  $("test-de").addEventListener("click", () => SP.sprich(`Hallo ${name()}! Ich bin Fipsi, der kleine Fuchs.`, "de-DE"));
  $("test-ru").addEventListener("click", () => { const g = S.paar({ de: "", ru: `Привет, ${name()}! Я Фипси, маленький лисёнок.` })[1]; SP.sprich(g || `Hallo ${name()}!`, g ? HL().tts : "de-DE"); });

  $("zur-karte").addEventListener("click", () => { SP.stopp(); if (aufnahmeEnde) { aufnahmeEnde(); aufnahmeEnde = null; } S.ton("tipp"); lauf = null; zeige("karte"); zeichneKarte(); });

  zeichneKarte();
  window.__deutsch = { starte, pruefeText, schritt: (n) => { lauf.pos = n; lauf.gesperrt = false; lauf.versuche = 0; schritt(); }, get lauf() { return lauf; } };
})();
