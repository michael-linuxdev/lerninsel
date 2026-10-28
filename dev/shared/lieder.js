// Liederbuch zum Mitsingen und Mitsprechen (29.10.2026): gemeinfreie Kinderlieder und Reime (Volkslieder, englische Nursery Rhymes) mit
// Text in Silben, die beim Vorspielen der Melodie nacheinander leuchten (wie Karaoke). Die Melodie entsteht im Browser (Web Audio,
// sanfter Flötenklang), es gibt keine Audiodateien. Reime ohne Melodie (noten fehlt) liest die Gerätestimme zeilenweise vor.
// Lied: { id, titel, sprache: "de" | "en", de?: Übersetzung/Erklärung, ru?, zeilen: [[Text mit Silben-Bindestrichen, Noten], …], tempo? }
//   Noten: je Silbe eine Note: C D E F G A H (C4 … H4), c d e (eine Oktave höher), ,G ,A ,H (tiefer); Zahl dahinter = Schläge (Standard 1).
//   Text: Silben durch Leerzeichen oder Bindestrich getrennt („Al-le mei-ne Ent-chen“); Satzzeichen hängen an der Silbe.
// Nutzung: Lieder.zeige(element, id, { fertig }) zeichnet das Lied mit Knöpfen; Lieder.alle(sprache); Test-Haken window.__lieder.
(function () {
  const L = [
    { id: "entchen", titel: "Alle meine Entchen", sprache: "de", ru: "«Все мои утята» (народная песня)", zeilen: [
      ["Al-le mei-ne Ent-chen", "C D E F G2 G2"], ["schwim-men auf dem See,", "A A A A G4"], ["schwim-men auf dem See,", "A A A A G4"],
      ["Köpf-chen in das Was-ser,", "F F F F E2 E2"], ["Schwänz-chen in die Höh.", "D D D D C4"]] },
    { id: "haenschen", titel: "Hänschen klein", sprache: "de", ru: "«Маленький Гансик» (народная песня)", zeilen: [
      ["Häns-chen klein", "G E E2"], ["ging al-lein", "F D D2"], ["in die wei-te Welt hi-nein.", "C D E F G G G2"],
      ["Stock und Hut", "G E E2"], ["steht ihm gut,", "F D D2"], ["ist gar wohl-ge-mut.", "C E G G C4"]] },
    { id: "jakob", titel: "Bruder Jakob", sprache: "de", ru: "«Братец Яков» (народная песня, канон)", zeilen: [
      ["Bru-der Ja-kob,", "C D E C"], ["Bru-der Ja-kob,", "C D E C"], ["schläfst du noch?", "E F G2"], ["Schläfst du noch?", "E F G2"],
      ["Hörst du nicht die Glo-cken?", "G.5 A.5 G.5 F.5 E C"], ["Hörst du nicht die Glo-cken?", "G.5 A.5 G.5 F.5 E C"],
      ["Ding, dang, dong!", "C ,G C2"], ["Ding, dang, dong!", "C ,G C2"]] },
    { id: "twinkle", titel: "Twinkle, Twinkle, Little Star", sprache: "en", de: "Funkel, funkel, kleiner Stern", ru: "«Мерцай, мерцай, звёздочка»", zeilen: [
      ["Twin-kle, twin-kle, lit-tle star,", "C C G G A A G2"], ["how I won-der what you are.", "F F E E D D C2"],
      ["Up a-bove the world so high,", "G G F F E E D2"], ["like a dia-mond in the sky.", "G G F F E E D2"],
      ["Twin-kle, twin-kle, lit-tle star,", "C C G G A A G2"], ["how I won-der what you are.", "F F E E D D C2"]] },
    { id: "sleeping", titel: "Are You Sleeping?", sprache: "en", de: "Bruder Jakob auf Englisch", ru: "«Братец Яков» по-английски", zeilen: [
      ["Are you sleep-ing,", "C D E C"], ["are you sleep-ing,", "C D E C"], ["Bro-ther John?", "E F G2"], ["Bro-ther John?", "E F G2"],
      ["Morn-ing bells are ring-ing,", "G.5 A.5 G.5 F.5 E C"], ["morn-ing bells are ring-ing.", "G.5 A.5 G.5 F.5 E C"],
      ["Ding, dang, dong!", "C ,G C2"], ["Ding, dang, dong!", "C ,G C2"]] },
    { id: "macdonald", titel: "Old MacDonald Had a Farm", sprache: "en", de: "Der alte MacDonald hat einen Bauernhof", ru: "«У старого Макдональда была ферма»", zeilen: [
      ["Old Mac-Don-ald had a farm,", "G G G D E E D2"], ["E-I-E-I-O.", "H H A A G3"],
      ["And on that farm he had a cow,", "D G G G D E E D2"], ["E-I-E-I-O.", "H H A A G3"],
      ["With a moo moo here", "D D G G G"], ["and a moo moo there,", "D D G G G2"],
      ["here a moo, there a moo,", "G G G2 G G G2"], ["ev-ery-where a moo moo.", "G G G G G G2"],
      ["Old Mac-Don-ald had a farm,", "G G G D E E D2"], ["E-I-E-I-O.", "H H A A G3"]] },
    { id: "london", titel: "London Bridge Is Falling Down", sprache: "en", de: "Die Londoner Brücke fällt ein", ru: "«Лондонский мост падает»", zeilen: [
      ["Lon-don Bridge is fall-ing down,", "G A G F E F G2"], ["fall-ing down,", "D E F2"], ["fall-ing down.", "E F G2"],
      ["Lon-don Bridge is fall-ing down,", "G A G F E F G2"], ["my fair la-dy.", "D2 G2 E C2"]] },
    { id: "rain", titel: "Rain, Rain, Go Away", sprache: "en", de: "Regen, Regen, geh weg", ru: "«Дождик, дождик, уходи»", zeilen: [
      ["Rain, rain, go a-way,", "G E G G E2"], ["come a-gain an-oth-er day.", "G G E E G G E2"],
      ["Lit-tle chil-dren want to play,", "G G E E G G E2"], ["rain, rain, go a-way.", "G E G G E2"]] },
    { id: "buckle", titel: "One, Two, Buckle My Shoe", sprache: "en", de: "Ein Zähl-Reim zum Mitsprechen", ru: "Считалка «Раз, два — застегни туфлю»", zeilen: [
      ["One, two, buckle my shoe;"], ["three, four, knock at the door;"], ["five, six, pick up sticks;"], ["seven, eight, lay them straight;"], ["nine, ten, a big fat hen."]] }
  ];
  const FREQ = { C: 261.63, D: 293.66, E: 329.63, F: 349.23, G: 392.0, A: 440.0, H: 493.88 };
  function note(n) {
    const m = n.match(/^(,?)([A-Ha-h])([\d.]*)$/); if (!m) return { f: 0, d: 1 };
    let f = FREQ[m[2].toUpperCase()]; if (m[2] === m[2].toLowerCase()) f *= 2; if (m[1]) f /= 2;
    return { f, d: m[3] ? +m[3] : 1 };
  }
  const silben = (t) => t.replace(/-/g, "- ").split(/\s+/).filter(Boolean);   // „Al-le mei-ne“ → ["Al-", "le", "mei-", "ne"]
  const pruefe = (l) => l.zeilen.every(([t, n]) => !n || silben(t).length === n.trim().split(/\s+/).length);

  // ---------- Klang (sanfte Flöte) ----------
  let ctx = null;
  function audio() { if (!ctx) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; ctx = new A(); } if (ctx.state === "suspended") ctx.resume(); return ctx; }
  function floete(f, wann, dauer) {
    const a = audio(); if (!a || !f) return; const t = a.currentTime + wann;
    const g = a.createGain(); g.connect(a.destination);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.22, t + 0.04); g.gain.setValueAtTime(0.22, t + Math.max(0.05, dauer - 0.08)); g.gain.exponentialRampToValueAtTime(0.0001, t + dauer);
    [[1, "triangle", 1], [2, "sine", 0.18]].forEach(([k, typ, v]) => { const o = a.createOscillator(), og = a.createGain(); o.type = typ; o.frequency.value = f * 2 * k; og.gain.value = v; o.connect(og).connect(g); o.start(t); o.stop(t + dauer + 0.05); });
  }

  let laeufer = [];
  const stopp = () => { laeufer.forEach(clearTimeout); laeufer = []; if (window.Sprache && Sprache.stopp) Sprache.stopp(); };
  const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function zeige(el, id, opt = {}) {
    const l = L.find(x => x.id === id); if (!el || !l) return;
    const singen = l.zeilen.every(z => z[1]);
    el.innerHTML = `<div class="liedbuch" data-lied="${l.id}"><h3 class="lied-titel">🎵 ${esc(l.titel)}</h3>${l.de ? `<p class="lied-de">${esc(l.de)}</p>` : ""}
      <div class="lied-text" lang="${l.sprache}">${l.zeilen.map((z, i) => `<p class="lied-zeile" data-z="${i}">${singen ? silben(z[0]).map((s, j) => `<span class="silbe" data-s="${j}">${esc(s)}</span>${s.endsWith("-") ? "" : " "}`).join("") : esc(z[0])}</p>`).join("")}</div>
      <div class="lied-knoepfe"><button class="knopf haupt lied-spielen">${singen ? "▶️ Vorspielen und mitsingen" : "▶️ Vorsprechen und mitsprechen"}</button>${singen ? `<button class="knopf lied-langsam">🐢 Langsamer</button>` : ""}</div></div>`;
    const box = el.querySelector(".liedbuch");
    const leuchte = (z, s) => { box.querySelectorAll(".an").forEach(x => x.classList.remove("an")); if (z == null) return;
      const zl = box.querySelector(`[data-z="${z}"]`); if (zl) zl.classList.add("an"); const sl = zl && s != null ? zl.querySelector(`[data-s="${s}"]`) : null; if (sl) sl.classList.add("an"); };
    function spiele(tempo) {
      stopp(); audio(); let t = 0;
      if (singen) {
        const schlag = (l.tempo || 520) * tempo * (window.__liederSchnell ? 0.04 : 1);   // Test: sehr schnell
        l.zeilen.forEach(([, n], zi) => n.trim().split(/\s+/).forEach((x, si) => { const { f, d } = note(x), w = t;
          laeufer.push(setTimeout(() => leuchte(zi, si), w)); floete(f, w / 1000, d * schlag / 1000 * 0.92); t += d * schlag; }));
        laeufer.push(setTimeout(() => { leuchte(null); if (opt.fertig) opt.fertig(); }, t + 200));
      } else {
        const SP = window.Sprache, tts = l.sprache === "en" ? "en-GB" : "de-DE";
        const zeile = (i) => { if (i >= l.zeilen.length) { leuchte(null); if (opt.fertig) opt.fertig(); return; } leuchte(i);
          if (SP && SP.verfuegbar && SP.verfuegbar()) SP.sprich(l.zeilen[i][0], tts, () => laeufer.push(setTimeout(() => zeile(i + 1), 250)));
          else laeufer.push(setTimeout(() => zeile(i + 1), 1800)); };
        zeile(0);
      }
    }
    box.querySelector(".lied-spielen").addEventListener("click", () => spiele(1));
    const la = box.querySelector(".lied-langsam"); if (la) la.addEventListener("click", () => spiele(1.6));
    return { spiele, stopp };
  }
  const STIL = `.liedbuch{background:#fff;border-radius:22px;padding:14px 16px;box-shadow:0 5px 0 rgba(0,0,0,.08);text-align:left}
    .lied-titel{margin:0 0 4px;font-size:1.3rem}.lied-de{margin:0 0 8px;opacity:.8}
    .lied-zeile{margin:4px 0;font-size:1.35rem;line-height:1.5;border-radius:10px;padding:2px 8px}.lied-zeile.an{background:#FFF3C4}
    .silbe{border-radius:6px;padding:0 1px;margin:0 -1px;transition:background .1s}.silbe.an{background:#FFC83D;color:#3A2400}
    .lied-knoepfe{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px}`;
  if (document.head) { const st = document.createElement("style"); st.textContent = STIL; document.head.appendChild(st); }

  window.Lieder = { LIEDER: L, zeige, stopp, alle: (sprache) => L.filter(l => !sprache || l.sprache === sprache), finde: (id) => L.find(l => l.id === id), pruefe, silben };
  window.__lieder = { pruefe: () => L.filter(l => !pruefe(l)).map(l => l.id) };
})();
