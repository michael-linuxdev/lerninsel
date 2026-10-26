// Musik-Ecke im Atelier mit Papagei Paula (PLAN 8b, Lehrplan Musik): Xylofon mit Liedern zum Mitspielen,
// Rhythmus nachklatschen, Hoch oder tief / laut oder leise, eigene Melodie komponieren. Alle Töne entstehen im Browser (Web Audio),
// es gibt keine Audiodateien. Lieder: nur gemeinfreie Melodien (Volkslieder, Beethoven), keine Liedtexte.
// Keine Bewertung: falsche Töne klingen einfach, es gibt immer „Nochmal hören“. Erfahrung (Kreativ-Funke) nur fürs Mitmachen.
// Daten: profil.daten.atelier.musik = { lieder: { id: 1 }, rhythmus: Anzahl, hoertest: Anzahl, melodien: [[8 Töne, -1 = Pause]], xp: { Tag: n } }
(function () {
  const S = window.Spielwelt, C = window.Charakter, SP = window.Sprache, $ = (id) => document.getElementById(id);
  const pad = (n) => String(n).padStart(2, "0");
  const heute = () => { const d = window.__jetzt ? new Date(window.__jetzt) : new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const ru = (t) => S.paar(["", t])[1];
  const sprich = (t) => { if (SP && SP.sprich) SP.sprich(t, "de-DE"); };
  const ladeA = () => S.lade("atelier") || {};
  const lade = () => Object.assign({ lieder: {}, rhythmus: 0, hoertest: 0, melodien: [], xp: {} }, ladeA().musik || {});
  const speichere = (m) => { const a = Object.assign({ wand: [] }, ladeA()); a.musik = m; S.speichere("atelier", a); };
  // Erfahrung fürs Mitmachen, höchstens 12 Punkte Musik am Tag
  function gib(n) {
    const m = lade(), t = heute(); Object.keys(m.xp).filter(k => k !== t).forEach(k => delete m.xp[k]);
    const frei = Math.max(0, 12 - (m.xp[t] || 0)), x = Math.min(n, frei); m.xp[t] = (m.xp[t] || 0) + x; speichere(m);
    if (x && C && C.gib) C.gib("kreativ", x);
  }
  const fund = (text, schluessel, e = "🎵") => { if (window.Lernfunde) Lernfunde.merke({ fach: "musik", art: "musik", e, text, schluessel }); };

  // ---------- Klang ----------
  let ctx = null;
  function audio() {
    if (!ctx) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; ctx = new A(); }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  // Töne des Xylofons: C D E F G A H C (C5 bis C6)
  const TOENE = [["C", 523.25, "#E8453C"], ["D", 587.33, "#FF8A3D"], ["E", 659.25, "#FFC83D"], ["F", 698.46, "#7CCB5B"], ["G", 783.99, "#2FA37C"], ["A", 880.0, "#5EC3E6"], ["H", 987.77, "#2F86C8"], ["C", 1046.5, "#7B55B8"]];
  function klang(freq, { laut = 0.5, dauer = 1.1, wann = 0 } = {}) {
    const a = audio(); if (!a) return; const t = a.currentTime + wann;
    const g = a.createGain(); g.connect(a.destination);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(laut, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + dauer);
    [[1, 1], [3.9, 0.25], [9.2, 0.08]].forEach(([f, v]) => {   // Holz/Metall-Klang: Grundton und zwei schnell abklingende Obertöne
      const o = a.createOscillator(), og = a.createGain(); o.type = "sine"; o.frequency.value = freq * f;
      og.gain.setValueAtTime(v, t); og.gain.exponentialRampToValueAtTime(0.0001, t + (f === 1 ? dauer : 0.15));
      o.connect(og).connect(g); o.start(t); o.stop(t + dauer + 0.05);
    });
  }
  let rauschen = null;
  function klatsch(wann = 0, laut = 0.9) {
    const a = audio(); if (!a) return; const t = a.currentTime + wann;
    if (!rauschen) { rauschen = a.createBuffer(1, a.sampleRate * 0.2, a.sampleRate); const d = rauschen.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3); }
    const q = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(); q.buffer = rauschen; f.type = "bandpass"; f.frequency.value = 1400; f.Q.value = 0.8;
    g.gain.value = laut; q.connect(f).connect(g).connect(a.destination); q.start(t);
  }

  // ---------- Bereiche ----------
  const TEILE = ["menue", "xylo", "rhythmus", "hoertest", "melodie"];
  let laeufer = [];
  const stoppe = () => { laeufer.forEach(clearTimeout); laeufer = []; };
  const spaeter = (fn, ms) => laeufer.push(setTimeout(fn, ms));
  const TEXTE = {
    menue: ["Willkommen in der Musik-Ecke! Hier kannst du spielen, klatschen, hören und eigene Melodien erfinden.", "Добро пожаловать в музыкальный уголок!"],
    xylo: ["Tippe auf die Klangstäbe. Lange Stäbe klingen tief, kurze klingen hoch. Oder spiel ein Lied mit – der leuchtende Stab ist dran.", "Длинные пластинки звучат низко, короткие – высоко."],
    rhythmus: ["Hör gut zu! Ich klatsche einen Rhythmus vor. Dann tippst du ihn auf der Trommel nach.", "Слушай внимательно и повтори ритм на барабане."],
    hoertest: ["Ich spiele zwei Töne. Hör genau hin!", "Я сыграю два звука. Слушай внимательно!"],
    melodie: ["Erfinde deine eigene Melodie! Vielleicht tanzen bald die Tiere auf der Insel dazu.", "Придумай свою мелодию!"]
  };
  function teil(n) {
    stoppe(); TEILE.forEach(t => { $("m-" + t).hidden = t !== n; });
    const [de, r] = TEXTE[n]; $("musik-text").textContent = de; $("musik-ru").textContent = ru(r); $("musik-ru").hidden = !$("musik-ru").textContent;
    if (n === "xylo") zeigeXylo(); if (n === "rhythmus") rhStart(); if (n === "hoertest") htStart(); if (n === "melodie") zeigeRaster();
    scrollTo(0, 0);
  }
  document.querySelectorAll("[data-m]").forEach(b => b.addEventListener("click", () => { S.ton("tipp"); audio(); teil(b.dataset.m); }));

  // ---------- Xylofon und Lieder ----------
  // Melodien als [Tonindex, Schläge]; 0 = C … 7 = hohes C
  const LIEDER = [
    { id: "entchen", name: "Alle meine Entchen", ru: "«Все мои утята» (немецкая народная песня)", n: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 2], [4, 2], [5, 1], [5, 1], [5, 1], [5, 1], [4, 4], [5, 1], [5, 1], [5, 1], [5, 1], [4, 4], [3, 1], [3, 1], [3, 1], [3, 1], [2, 2], [2, 2], [1, 1], [1, 1], [1, 1], [1, 1], [0, 4]] },
    { id: "haenschen", name: "Hänschen klein", ru: "«Маленький Гансик» (немецкая народная песня)", n: [[4, 1], [2, 1], [2, 2], [3, 1], [1, 1], [1, 2], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [4, 1], [4, 2], [4, 1], [2, 1], [2, 2], [3, 1], [1, 1], [1, 2], [0, 1], [2, 1], [4, 1], [4, 1], [0, 4]] },
    { id: "sternchen", name: "Morgen kommt der Weihnachtsmann", ru: "Мелодия «Мерцай, звёздочка» (народная)", n: [[0, 1], [0, 1], [4, 1], [4, 1], [5, 1], [5, 1], [4, 2], [3, 1], [3, 1], [2, 1], [2, 1], [1, 1], [1, 1], [0, 2], [4, 1], [4, 1], [3, 1], [3, 1], [2, 1], [2, 1], [1, 2], [4, 1], [4, 1], [3, 1], [3, 1], [2, 1], [2, 1], [1, 2], [0, 1], [0, 1], [4, 1], [4, 1], [5, 1], [5, 1], [4, 2], [3, 1], [3, 1], [2, 1], [2, 1], [1, 1], [1, 1], [0, 2]] },
    { id: "freude", name: "Ode an die Freude (Beethoven)", ru: "«Ода к радости» (Бетховен)", n: [[2, 1], [2, 1], [3, 1], [4, 1], [4, 1], [3, 1], [2, 1], [1, 1], [0, 1], [0, 1], [1, 1], [2, 1], [2, 1.5], [1, 0.5], [1, 2], [2, 1], [2, 1], [3, 1], [4, 1], [4, 1], [3, 1], [2, 1], [1, 1], [0, 1], [0, 1], [1, 1], [2, 1], [1, 1.5], [0, 0.5], [0, 2]] }
  ];
  let lied = null, pos = 0, vorspiel = false;
  function zeigeXylo() {
    $("xylo").innerHTML = TOENE.map(([n, , f], i) => `<button data-t="${i}" style="background:${f};height:${260 - i * 18}px" aria-label="Ton ${n}">${n}</button>`).join("");
    $("lieder").innerHTML = `<button class="knopf an" data-lied="">🎹 Frei spielen</button>` + LIEDER.map(l => `<button class="knopf" data-lied="${l.id}">${lade().lieder[l.id] ? "⭐ " : "🎵 "}${l.name}</button>`).join("");
    lied = null; markiereDran(); $("xylo-text").textContent = "";
  }
  function markiereDran() { $("xylo").querySelectorAll("button").forEach((b, i) => b.classList.toggle("dran", !!lied && !vorspiel && pos < lied.n.length && lied.n[pos][0] === i)); }
  function anschlagen(i) { klang(TOENE[i][1]); const b = $("xylo").children[i]; if (b) { b.classList.add("tipp"); setTimeout(() => b.classList.remove("tipp"), 120); } }
  $("xylo").addEventListener("pointerdown", (e) => {
    const b = e.target.closest("button"); if (!b) return; e.preventDefault();
    const i = +b.dataset.t; anschlagen(i);
    if (!lied || vorspiel) return;
    if (lied.n[pos][0] === i) { pos++; if (pos >= lied.n.length) liedFertig(); markiereDran(); }
  });
  $("lieder").addEventListener("click", (e) => {
    const b = e.target.closest("[data-lied]"); if (!b) return; stoppe(); vorspiel = false;
    $("lieder").querySelectorAll(".knopf").forEach(x => x.classList.toggle("an", x === b));
    lied = LIEDER.find(l => l.id === b.dataset.lied) || null; pos = 0; markiereDran();
    if (!lied) { $("xylo-text").textContent = "Spiel, was dir einfällt!"; return; }
    $("xylo-text").innerHTML = `Hör erst zu – dann spielst du mit. <button class="knopf" id="vorspielen">🎧 Vorspielen</button>`;
    $("vorspielen").addEventListener("click", spieleVor); spieleVor();
  });
  function spieleVor() {
    if (!lied) return; stoppe(); vorspiel = true; markiereDran(); let t = 0; const SCHLAG = 420;
    lied.n.forEach(([i, d]) => { spaeter(() => anschlagen(i), t); t += d * SCHLAG; });
    spaeter(() => { vorspiel = false; pos = 0; markiereDran(); $("xylo-text").textContent = "Jetzt du! Tippe den leuchtenden Stab."; }, t + 300);
  }
  function liedFertig() {
    const m = lade(), neu = !m.lieder[lied.id]; m.lieder[lied.id] = 1; speichere(m);
    $("xylo-text").textContent = `🎉 Toll! Du hast „${lied.name}“ gespielt!`; sprich(`Toll! Du hast ${lied.name} gespielt!`); S.ton("juhu");
    gib(3); if (neu) { S.gibSterne(1); fund(`Musik: „${lied.name}“ auf dem Xylofon gespielt`, "lied:" + lied.id, "🎹"); }
    const b = $("lieder").querySelector(`[data-lied="${lied.id}"]`); if (b) b.textContent = "⭐ " + lied.name;
    lied = null;
  }

  // ---------- Rhythmus ----------
  // 8 Achtel pro Takt; Zahlen = Schläge, auf denen geklatscht wird (vom Leichten zum Schwereren)
  const RHYTHMEN = [[0, 2, 4], [0, 2, 4, 6], [0, 4, 6], [0, 1, 2, 4], [0, 2, 3, 4], [0, 2, 4, 5, 6], [0, 1, 2, 3, 4], [0, 3, 4, 6], [0, 1, 4, 5, 6], [0, 2, 3, 5, 6]];
  const ACHTEL = 300, RUNDEN = 5;
  let rh = null;
  function rhStart() { rh = { runde: 0, erfolge: 0, fehl: 0 }; rhNeu(); }
  function rhNeu() {
    const stufe = Math.min(RHYTHMEN.length - 1, rh.runde * 2 + Math.floor(Math.random() * 2));
    rh.muster = RHYTHMEN[stufe]; rh.taps = []; rh.hoeren = true; rh.fehl = 0; $("rh-weiter").hidden = true;
    $("takt").innerHTML = Array.from({ length: 8 }, (_, i) => `<span class="${rh.muster.includes(i) ? "voll" : ""}">${rh.muster.includes(i) ? "👏" : "·"}</span>`).join("");
    rhVorspielen();
  }
  function rhVorspielen() {
    stoppe(); rh.hoeren = true; rh.taps = []; $("rh-text").textContent = `Rhythmus ${rh.runde + 1} von ${RUNDEN}: Hör zu …`;
    const punkte = $("takt").children;
    for (let i = 0; i < 8; i++) spaeter(() => { [...punkte].forEach((p, k) => p.classList.toggle("jetzt", k === i)); if (rh.muster.includes(i)) klatsch(); }, 400 + i * ACHTEL);
    spaeter(() => { [...punkte].forEach(p => p.classList.remove("jetzt")); rh.hoeren = false; $("rh-text").textContent = "Jetzt du! Tippe auf die Trommel."; }, 400 + 8 * ACHTEL + 200);
  }
  $("rh-hoeren").addEventListener("click", () => { audio(); if (rh) rhVorspielen(); });
  $("rh-weiter").addEventListener("click", () => { rh.runde++; if (rh.runde >= RUNDEN) return rhEnde(); rhNeu(); });
  $("trommel").addEventListener("pointerdown", (e) => {
    e.preventDefault(); audio(); klatsch(0, 0.7); const t = $("trommel"); t.classList.add("tipp"); setTimeout(() => t.classList.remove("tipp"), 100);
    if (!rh || rh.hoeren || rh.fertig) return;
    rh.taps.push(performance.now()); stoppe();
    const n = rh.taps.length, z = rh.muster.length;
    const punkte = $("takt").children, idx = rh.muster[Math.min(n, z) - 1]; if (punkte[idx]) { punkte[idx].classList.add("jetzt"); setTimeout(() => punkte[idx].classList.remove("jetzt"), 150); }
    // Nach dem letzten erwarteten Schlag (oder einer Pause) wird geprüft
    spaeter(rhPruefen, n >= z ? 350 : (rh.muster[z - 1] - rh.muster[0] + 2) * ACHTEL);
  });
  function rhPruefen() {
    const taps = rh.taps, m = rh.muster; rh.taps = [];
    const stimmt = taps.length === m.length && taps.every((t, i) => Math.abs((t - taps[0]) - (m[i] - m[0]) * ACHTEL) <= ACHTEL * 0.45);
    if (stimmt) {
      rh.erfolge++; S.ton("juhu"); $("rh-text").textContent = ["👏 Genau so!", "🎉 Super Rhythmus!", "⭐ Perfekt nachgeklatscht!"][rh.erfolge % 3];
      const d = lade(); d.rhythmus++; speichere(d); gib(2);
      if (d.rhythmus === 5) fund("Musik: einen Rhythmus hören und nachklatschen", "rhythmus", "👏");
      rh.hoeren = true; spaeter(() => { rh.runde++; if (rh.runde >= RUNDEN) rhEnde(); else rhNeu(); }, 1300);
    } else {
      rh.fehl++;
      $("rh-text").textContent = taps.length < m.length ? `Fast! Es waren ${m.length} Klatscher. Hör noch einmal.` : taps.length > m.length ? `Fast! Es waren nur ${m.length} Klatscher. Hör noch einmal.` : "Fast! Die Abstände waren etwas anders. Hör noch einmal.";
      $("rh-weiter").hidden = rh.fehl < 2; rh.hoeren = true; spaeter(rhVorspielen, 1600);
    }
  }
  function rhEnde() {
    rh.fertig = true; stoppe(); $("takt").innerHTML = ""; $("rh-weiter").hidden = true;
    $("rh-text").textContent = `🥁 Fertig! Du hast ${rh.erfolge} von ${RUNDEN} Rhythmen nachgeklatscht. Klatsch doch mal mit deiner Familie!`;
    sprich("Fertig! Klatsch doch mal mit deiner Familie!");
    spaeter(() => { $("rh-text").innerHTML += ` <button class="knopf" id="rh-neu">🔁 Noch einmal</button>`; $("rh-neu").addEventListener("click", rhStart); }, 50);
  }

  // ---------- Hoch oder tief, laut oder leise ----------
  const FRAGEN = 6;
  let ht = null;
  function htStart() { ht = { nr: 0, richtig: 0 }; htNeu(); }
  function htNeu() {
    $("ht-weiter").hidden = true; $("ht-text").textContent = "";
    const art = ht.nr % 3 === 2 ? "laut" : "hoch", abstand = [7, 4, 2, 1][Math.min(3, Math.floor(ht.nr / 2))];
    const tief = Math.floor(Math.random() * (8 - abstand)), anders = Math.random() < 0.5 ? 0 : 1;
    if (art === "hoch") { const a = TOENE[tief][1], b = TOENE[tief + abstand][1]; ht.toene = anders ? [[a, 0.5], [b, 0.5]] : [[b, 0.5], [a, 0.5]]; }
    else { const f = TOENE[Math.floor(Math.random() * 8)][1]; ht.toene = anders ? [[f, 0.12], [f, 0.7]] : [[f, 0.7], [f, 0.12]]; }
    ht.art = art; ht.loesung = anders; ht.beantwortet = false;
    $("ht-frage").textContent = art === "hoch" ? "👂 Welcher Ton war höher?" : "🔊 Welcher Ton war lauter?";
    $("ht-stand").textContent = `Frage ${ht.nr + 1} von ${FRAGEN}` + (ru(art === "hoch" ? "Какой звук выше?" : "Какой звук громче?") ? " · " + ru(art === "hoch" ? "Какой звук выше?" : "Какой звук громче?") : "");
    htSpielen();
  }
  function htSpielen() { audio(); stoppe(); ht.toene.forEach(([f, l], i) => spaeter(() => klang(f, { laut: l, dauer: 0.9 }), 300 + i * 900)); }
  $("ht-hoeren").addEventListener("click", () => { if (ht) htSpielen(); });
  document.querySelectorAll("[data-ht]").forEach(b => b.addEventListener("click", () => {
    if (!ht || ht.beantwortet) return;
    const w = +b.dataset.ht, ok = w === ht.loesung, wort = ht.art === "hoch" ? "höher" : "lauter";
    if (ok) { ht.beantwortet = true; ht.richtig++; S.ton("juhu"); $("ht-text").textContent = `✅ Richtig! Der ${ht.loesung ? "zweite" : "erste"} Ton war ${wort}.`; $("ht-weiter").hidden = false; }
    else { S.ton("tipp"); $("ht-text").textContent = `Hör noch einmal genau hin – welcher war ${wort}?`; htSpielen(); }
  }));
  $("ht-weiter").addEventListener("click", () => {
    ht.nr++; if (ht.nr < FRAGEN) return htNeu();
    const d = lade(); d.hoertest++; speichere(d); gib(3);
    if (d.hoertest === 1) { S.gibSterne(1); fund("Musik: Töne hoch und tief, laut und leise unterscheiden", "hoertest", "👂"); }
    $("ht-frage").textContent = "🎉 Super zugehört!"; $("ht-stand").textContent = ""; $("ht-weiter").hidden = true;
    $("ht-text").innerHTML = `Du hast ${FRAGEN} Fragen geschafft. Tipp: Lange Klangstäbe klingen tief, kurze hoch. <button class="knopf" id="ht-neu">🔁 Noch einmal</button>`;
    $("ht-neu").addEventListener("click", htStart);
  });

  // ---------- Meine Melodie ----------
  let mel = [-1, -1, -1, -1, -1, -1, -1, -1];
  function zeigeRaster() {
    let h = "";
    for (let r = 7; r >= 0; r--) { h += `<span class="ton">${TOENE[r][0]}${r === 7 ? "'" : ""}</span>`; for (let s = 0; s < 8; s++) h += `<button data-r="${r}" data-s="${s}" style="--f:${TOENE[r][2]}" class="${mel[s] === r ? "an" : ""}" aria-label="Spalte ${s + 1}, Ton ${TOENE[r][0]}"></button>`; }
    $("raster").innerHTML = h; zeigeListe();
  }
  $("raster").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return; audio();
    const r = +b.dataset.r, s = +b.dataset.s; mel[s] = mel[s] === r ? -1 : r; if (mel[s] >= 0) klang(TOENE[r][1], { dauer: 0.6 });
    zeigeRaster();
  });
  function spieleMelodie(m) {
    stoppe(); audio();
    m.forEach((r, s) => spaeter(() => { $("raster").querySelectorAll("button").forEach(b => b.classList.toggle("spalte", +b.dataset.s === s)); if (r >= 0) klang(TOENE[r][1], { dauer: 0.7 }); }, s * 380));
    spaeter(() => $("raster").querySelectorAll("button").forEach(b => b.classList.remove("spalte")), 8 * 380);
  }
  $("mel-spielen").addEventListener("click", () => spieleMelodie(mel));
  $("mel-leer").addEventListener("click", () => { mel = mel.map(() => -1); S.ton("tipp"); zeigeRaster(); });
  $("mel-zufall").addEventListener("click", () => {   // Kleine Schritte klingen schön: meist Nachbartöne, Ende auf C
    let r = [0, 2, 4][Math.floor(Math.random() * 3)];
    mel = mel.map((_, s) => { if (s === 7) return Math.random() < 0.5 ? 0 : 7; if (s > 0 && Math.random() < 0.15) return -1; r = Math.max(0, Math.min(7, r + [-2, -1, 1, 2, 0][Math.floor(Math.random() * 5)])); return r; });
    zeigeRaster(); spieleMelodie(mel);
  });
  $("mel-speichern").addEventListener("click", () => {
    if (mel.every(x => x < 0)) { $("musik-text").textContent = "Tippe erst ein paar Töne ins Raster!"; return; }
    const d = lade(); d.melodien.unshift(mel.slice()); d.melodien = d.melodien.slice(0, 5); speichere(d);
    S.ton("juhu"); gib(2); if (d.melodien.length === 1) fund("Musik: eine eigene Melodie komponiert", "melodie", "🎼");
    $("musik-text").textContent = "💾 Gespeichert! Deine Melodien stehen unten (höchstens 5)."; zeigeListe();
  });
  function zeigeListe() {
    const l = lade().melodien;
    $("mel-liste").innerHTML = l.map((m, i) => `<button class="knopf" data-mel="${i}">▶️ Melodie ${l.length - i}</button>`).join("");
    $("mel-liste").querySelectorAll("[data-mel]").forEach(b => b.addEventListener("click", () => { mel = lade().melodien[+b.dataset.mel].slice(); zeigeRaster(); spieleMelodie(mel); }));
  }

  window.MusikEcke = { zeige: () => teil("menue"), teil, LIEDER, TOENE, klang, lade };
  window.__musik = { rh: () => rh, ht: () => ht, lied: () => ({ lied: lied && lied.id, pos, vorspiel }), mel: () => mel, RHYTHMEN, ACHTEL };
})();
