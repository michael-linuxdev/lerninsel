// Atelier mit Papagei Paula (PLAN 8b, Kunst): freies Malen, Ausmalbilder, Malaufträge, eigene Galerie.
// Keine Bewertung von Bildern – Erfahrung und Sterne nur fürs Mitmachen. Bilder bleiben auf dem Tablet (shared/bilder.js),
// bis zu drei hängen als Poster im Zimmer auf der Insel.
// Daten: profil.daten.atelier = { wand: [id], gemalt: Anzahl, tage: { "JJJJ-MM-TT": n }, auftraege: { id: 1 }, idee: Index }
(function () {
  const S = window.Spielwelt, C = window.Charakter, SP = window.Sprache, B = window.Bilder, V = window.Vorlagen, $ = (id) => document.getElementById(id);
  const name = S.profil.name || "du";
  const pad = (n) => String(n).padStart(2, "0");
  const heute = () => { const d = window.__jetzt ? new Date(window.__jetzt) : new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const lade = () => Object.assign({ wand: [], gemalt: 0, tage: {}, auftraege: {} }, S.lade("atelier") || {});
  const speichere = (d) => S.speichere("atelier", d);
  const ru = (t) => S.paar(["", t])[1];
  const sprich = (t) => { if (SP && SP.sprich) SP.sprich(t, "de-DE"); };
  if (window.Figuren) document.querySelectorAll(".paula").forEach(el => { el.innerHTML = window.Figuren.papagei(""); });

  // Malaufträge (Lehrplan Kunst: Farben, Formen, Muster, eigene Gefühle und Erlebnisse ausdrücken)
  // [id, Text, russisch, Lernfund]
  const AUFTRAEGE = [
    ["warm", "Male ein Bild nur mit warmen Farben: Rot, Orange und Gelb.", "Нарисуй картинку только тёплыми цветами: красным, оранжевым и жёлтым.", "Warme Farben: Rot, Orange, Gelb"],
    ["kalt", "Male ein Bild nur mit kalten Farben: Blau, Grün und Lila.", "Нарисуй картинку только холодными цветами: синим, зелёным и фиолетовым.", "Kalte Farben: Blau, Grün, Lila"],
    ["muster", "Male ein Muster, das sich wiederholt – zum Beispiel rot, blau, rot, blau …", "Нарисуй узор, который повторяется.", "Ein Muster wiederholt sich immer wieder"],
    ["punkte", "Male ein ganzes Bild nur aus Punkten.", "Нарисуй картинку только из точек.", "Bilder aus Punkten (Pointillismus)"],
    ["tier", "Male dein Lieblingstier – so groß, dass es das ganze Blatt füllt.", "Нарисуй своё любимое животное – большое, на весь лист.", "Groß malen: das Bild füllt das ganze Blatt"],
    ["gefuehl", "Male, wie du dich heute fühlst. Welche Farbe hat dein Gefühl?", "Нарисуй, как ты себя сегодня чувствуешь. Какого цвета твоё чувство?", "Gefühle kann man mit Farben malen"],
    ["familie", "Male deine Familie oder Menschen, die du lieb hast.", "Нарисуй свою семью или людей, которых ты любишь.", "Menschen malen: Kopf, Körper, Arme, Beine"],
    ["draussen", "Male etwas, das du heute draußen gesehen hast.", "Нарисуй то, что ты сегодня видел на улице.", "Nach der Natur malen: genau hinschauen"],
    ["traum", "Male einen schönen Traum.", "Нарисуй красивый сон.", "Fantasie: einen Traum gemalt"],
    ["pflanze", "Erfinde eine Fantasie-Pflanze, die es noch nicht gibt.", "Придумай фантастическое растение, которого ещё нет.", "Fantasie: eine Pflanze erfunden"],
    ["formen", "Male ein Bild nur aus Kreisen, Dreiecken und Vierecken.", "Нарисуй картинку только из кругов, треугольников и прямоугольников.", "Formen: Kreis, Dreieck, Viereck"],
    ["wetter", "Male das Wetter von heute.", "Нарисуй сегодняшнюю погоду.", "Das Wetter gemalt: Sonne, Wolken, Regen"],
    ["hell", "Male einen Tag und eine Nacht nebeneinander: hell und dunkel.", "Нарисуй рядом день и ночь: светлое и тёмное.", "Hell und dunkel: Kontrast"],
    ["haus", "Male ein Haus für dein Lieblingstier.", "Нарисуй дом для своего любимого животного.", "Ein Haus für ein Tier entworfen"]
  ];
  const tagIndex = () => { const d = new Date(heute()); return Math.floor(d.getTime() / 864e5); };
  let ideeVersatz = 0, aktiverAuftrag = null;
  const idee = () => AUFTRAEGE[(tagIndex() + ideeVersatz) % AUFTRAEGE.length];

  // ---------- Ansichten ----------
  function zeige(n) { ["start", "malen", "vorlagen", "galerie", "musik"].forEach(v => { $(v + "-ansicht").hidden = v !== n; }); scrollTo(0, 0); if (SP && SP.stopp) SP.stopp(); if (n === "start") start(); if (n === "vorlagen") zeigeVorlagen(); if (n === "galerie") zeigeGalerie(); if (n === "musik" && window.MusikEcke) window.MusikEcke.zeige(); }
  document.querySelectorAll("[data-zu]").forEach(b => b.addEventListener("click", () => { S.ton("tipp"); zeige(b.dataset.zu); }));

  async function start() {
    const d = lade(), a = idee();
    $("paula-text").textContent = d.gemalt ? `Hallo ${name}! Schön, dass du wieder malst. Ich habe eine Idee für dich – oder du malst, was du willst.` : `Hallo ${name}! Ich bin Papagei Paula. Im Atelier darfst du malen und Musik machen, wie du willst. Es gibt kein Falsch!`;
    $("paula-ru").textContent = ru("Привет! Я попугай Паула. Здесь можно рисовать всё, что хочешь. Неправильно не бывает!"); $("paula-ru").hidden = !$("paula-ru").textContent;
    $("tagesauftrag-text").textContent = `💡 ${d.auftraege[a[0]] ? "Schon gemalt: " : "Idee: "}${a[1]}`;
    let n = 0; try { n = (await B.alle()).length; } catch (e) { /* ohne IndexedDB */ }
    $("galerie-zahl").textContent = n ? `${n} ${n === 1 ? "Bild" : "Bilder"}` : "Noch leer";
  }
  $("auftrag-anderer").addEventListener("click", () => { S.ton("tipp"); ideeVersatz++; start(); });
  $("auftrag-los").addEventListener("click", () => { S.ton("tipp"); oeffneMalen({ auftrag: idee() }); });
  $("frei-malen").addEventListener("click", () => { S.ton("tipp"); oeffneMalen({}); });

  // ---------- Leinwand ----------
  const cv = $("leinwand"), g = cv.getContext("2d", { willReadFrequently: true }), W = cv.width, H = cv.height;
  const FARBEN = ["#2B1A40", "#7A7A86", "#FFFFFF", "#E8453C", "#FF8A3D", "#FFC83D", "#FFE66B", "#7CCB5B", "#2FA37C", "#5EC3E6", "#2F86C8", "#7B55B8", "#FF7FB0", "#9A6A3F", "#F2C9A0"];
  const WERKZEUGE = [["pinsel", "🖌️", "Pinsel"], ["regenbogen", "🌈", "Regenbogen"], ["eimer", "🪣", "Eimer"], ["stempel", "⭐", "Stempel"], ["radierer", "🧽", "Radierer"]];
  const GROESSEN = [6, 16, 34];
  const STEMPEL = ["⭐", "❤️", "🌸", "🦋", "🐾", "☀️", "🌙", "🍀", "🐟", "🎈", "🍎", "🌲"];
  let farbe = FARBEN[3], werkzeug = "pinsel", groesse = 1, stempel = STEMPEL[0], hue = 0;
  let undo = [], geaendert = false, bildId = null, letzter = null;

  $("farben").innerHTML = FARBEN.map(f => `<button class="farbe" data-f="${f}" style="background:${f}" aria-label="Farbe ${f}"></button>`).join("");
  $("werkzeuge").innerHTML = WERKZEUGE.map(([id, e, t]) => `<button class="wz" data-w="${id}" aria-label="${t}">${e}<small>${t}</small></button>`).join("");
  $("groessen").innerHTML = GROESSEN.map((s, i) => `<button class="wz groesse" data-g="${i}" aria-label="Größe ${i + 1}"><span style="width:${8 + i * 10}px;height:${8 + i * 10}px"></span></button>`).join("");
  $("stempel").innerHTML = STEMPEL.map(s => `<button data-s="${s}">${s}</button>`).join("");
  function markiere() {
    $("farben").querySelectorAll(".farbe").forEach(b => b.classList.toggle("an", b.dataset.f === farbe && werkzeug !== "regenbogen" && werkzeug !== "radierer" && werkzeug !== "stempel"));
    $("werkzeuge").querySelectorAll(".wz").forEach(b => b.classList.toggle("an", b.dataset.w === werkzeug));
    $("groessen").querySelectorAll(".wz").forEach(b => b.classList.toggle("an", +b.dataset.g === groesse));
    $("stempel").hidden = werkzeug !== "stempel"; $("stempel").querySelectorAll("button").forEach(b => b.classList.toggle("an", b.dataset.s === stempel));
  }
  $("farben").addEventListener("click", (e) => { const b = e.target.closest(".farbe"); if (!b) return; farbe = b.dataset.f; if (werkzeug !== "eimer") werkzeug = "pinsel"; S.ton("tipp"); markiere(); });
  $("werkzeuge").addEventListener("click", (e) => { const b = e.target.closest(".wz"); if (!b) return; werkzeug = b.dataset.w; S.ton("tipp"); markiere(); });
  $("groessen").addEventListener("click", (e) => { const b = e.target.closest(".wz"); if (!b) return; groesse = +b.dataset.g; S.ton("tipp"); markiere(); });
  $("stempel").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; stempel = b.dataset.s; S.ton("tipp"); markiere(); });

  // Leinwand so groß wie möglich, aber ganz sichtbar (4:3), damit Finger-Position und Bild genau übereinstimmen
  function passeAn() {
    if ($("malen-ansicht").hidden) return;
    const schmal = innerWidth <= 820, frei = Math.min(1100, innerWidth) - 32 - (schmal ? 0 : 232) - 20;
    const hoch = innerHeight - $("rahmen").getBoundingClientRect().top - 90;
    const b = Math.max(280, Math.min(frei, (schmal ? 900 : hoch) * 4 / 3));
    cv.style.width = Math.round(b) + "px"; cv.style.height = Math.round(b * 3 / 4) + "px";
  }
  addEventListener("resize", passeAn);
  const merkeSchritt = () => { undo.push(g.getImageData(0, 0, W, H)); if (undo.length > 8) undo.shift(); };
  $("zurueck-schritt").addEventListener("click", () => { const s = undo.pop(); if (s) { g.putImageData(s, 0, 0); S.ton("tipp"); } });
  function leer() { g.fillStyle = "#FFFFFF"; g.fillRect(0, 0, W, H); }
  $("neu").addEventListener("click", () => frage("Alles wegwischen und neu anfangen?", [["🧽 Ja, neu", () => { merkeSchritt(); leer(); geaendert = false; bildId = null; }], ["Nein", null]]));

  const punkt = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
  function strich(a, b) {
    const breite = GROESSEN[groesse] * (werkzeug === "radierer" ? 2 : 1);
    g.lineCap = "round"; g.lineJoin = "round"; g.lineWidth = breite;
    if (werkzeug === "regenbogen") { hue = (hue + 4) % 360; g.strokeStyle = `hsl(${hue} 90% 58%)`; } else g.strokeStyle = werkzeug === "radierer" ? "#FFFFFF" : farbe;
    g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0] + 0.01, b[1]); g.stroke();
  }
  function stempeln([x, y]) { const gr = [44, 80, 130][groesse]; g.font = `${gr}px sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(stempel, x, y); }
  cv.addEventListener("pointerdown", (e) => {
    e.preventDefault(); const p = punkt(e); merkeSchritt(); geaendert = true;
    if (werkzeug === "eimer") { fuelle(Math.round(p[0]), Math.round(p[1]), farbe); S.ton("tipp"); return; }
    if (werkzeug === "stempel") { stempeln(p); S.ton("tipp"); return; }
    cv.setPointerCapture(e.pointerId); letzter = p; strich(p, p);
  });
  cv.addEventListener("pointermove", (e) => { if (!letzter) return; const p = punkt(e); strich(letzter, p); letzter = p; });
  const ende = () => { letzter = null; };
  cv.addEventListener("pointerup", ende); cv.addEventListener("pointercancel", ende);

  // Farbeimer: füllt die zusammenhängende Fläche ähnlicher Farbe (Zeilen-Füllung, Toleranz wegen geglätteter Ränder)
  function fuelle(x, y, hex) {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const bild = g.getImageData(0, 0, W, H), d = bild.data, i0 = (y * W + x) * 4;
    const r0 = d[i0], g0 = d[i0 + 1], b0 = d[i0 + 2];
    const f = parseInt(hex.slice(1), 16), fr = f >> 16, fg = (f >> 8) & 255, fb = f & 255;
    if (Math.abs(r0 - fr) + Math.abs(g0 - fg) + Math.abs(b0 - fb) < 10) return;
    const passt = (i) => Math.abs(d[i] - r0) + Math.abs(d[i + 1] - g0) + Math.abs(d[i + 2] - b0) < 150;
    const gesehen = new Uint8Array(W * H), stapel = [x, y];
    while (stapel.length) {
      const sy = stapel.pop(); let sx = stapel.pop();
      while (sx > 0 && !gesehen[sy * W + sx - 1] && passt((sy * W + sx - 1) * 4)) sx--;
      let obenOffen = false, untenOffen = false;
      for (; sx < W; sx++) {
        const k = sy * W + sx; if (gesehen[k] || !passt(k * 4)) break;
        gesehen[k] = 1; d[k * 4] = fr; d[k * 4 + 1] = fg; d[k * 4 + 2] = fb; d[k * 4 + 3] = 255;
        if (sy > 0) { const o = k - W, ok = !gesehen[o] && passt(o * 4); if (ok && !obenOffen) stapel.push(sx, sy - 1); obenOffen = ok; }
        if (sy < H - 1) { const u = k + W, ok = !gesehen[u] && passt(u * 4); if (ok && !untenOffen) stapel.push(sx, sy + 1); untenOffen = ok; }
      }
    }
    // Rand-Pixel (Glättung der Linie) mitfärben, damit keine weißen Säume bleiben
    for (let k = 0; k < W * H; k++) if (!gesehen[k] && ((k % W > 0 && gesehen[k - 1]) || (k % W < W - 1 && gesehen[k + 1]) || gesehen[k - W] || gesehen[k + W])) {
      const i = k * 4, hell = d[i] + d[i + 1] + d[i + 2]; if (hell > 200) { d[i] = (d[i] + fr) >> 1; d[i + 1] = (d[i + 1] + fg) >> 1; d[i + 2] = (d[i + 2] + fb) >> 1; }
    }
    g.putImageData(bild, 0, 0);
  }

  function oeffneMalen({ auftrag = null, vorlage = null, bild = null }) {
    aktiverAuftrag = auftrag; undo = []; geaendert = false; bildId = bild ? bild.id : null;
    leer();
    if (vorlage) V.zeichne(g, vorlage);
    if (bild) { const img = new Image(); img.onload = () => g.drawImage(img, 0, 0, W, H); img.src = bild.url; }
    $("mal-auftrag").hidden = !auftrag; if (auftrag) { $("mal-auftrag-text").textContent = "💡 " + auftrag[1]; sprich(auftrag[1]); }
    werkzeug = vorlage ? "eimer" : "pinsel"; markiere();
    zeige("malen"); passeAn();
  }
  $("mal-zurueck").addEventListener("click", () => {
    S.ton("tipp");
    if (!geaendert) return zeige("start");
    frage("Möchtest du dein Bild aufheben?", [["✅ Ja, aufheben", () => sichern()], ["Nein, wegwerfen", () => zeige("start")], ["Weitermalen", null]]);
  });
  $("fertig").addEventListener("click", () => { S.ton("tipp"); sichern(); });

  async function sichern() {
    const k = document.createElement("canvas"); k.width = 800; k.height = 600; k.getContext("2d").drawImage(cv, 0, 0, 800, 600);
    const url = k.toDataURL("image/jpeg", 0.82);
    let id = null; try { id = await B.speichere({ id: bildId, url, auftrag: aktiverAuftrag ? aktiverAuftrag[0] : "" }); } catch (e) { id = null; }
    if (!id) return frage(`Deine Galerie ist voll (${B.MAX} Bilder). Lösche zuerst ein altes Bild.`, [["🖼️ Zur Galerie", () => zeige("galerie")], ["Weitermalen", null]]);
    const neu = !bildId; bildId = id; geaendert = false;
    belohne(neu);
    if (window.Ereignisse) window.Ereignisse.melde("bild", { id: String(id), neu });
    const d = lade(), wand = d.wand.length < B.WAND && !d.wand.includes(id);
    if (wand) B.setzeWand(id, true);
    frage(wand ? "Wunderschön! Dein Bild hängt jetzt auch in deinem Zimmer auf der Insel. 🖼️" : "Wunderschön! Dein Bild ist in deiner Galerie.", [["🖼️ Galerie ansehen", () => zeige("galerie")], ["🖌️ Noch ein Bild", () => zeige("start")]]);
    sprich("Wunderschön!");
  }
  // Erfahrung fürs Mitmachen (höchstens 3 Bilder am Tag), 1 Stern für das erste Bild des Tages und für jeden neuen Auftrag
  function belohne(neu) {
    const d = lade(), t = heute(); if (!neu) return;
    d.gemalt++; d.tage[t] = (d.tage[t] || 0) + 1; Object.keys(d.tage).sort().slice(0, -30).forEach(k => delete d.tage[k]);
    if (d.tage[t] <= 3 && C && C.gib) C.gib("kreativ", 3);
    if (d.tage[t] === 1) S.gibSterne(1);
    const a = aktiverAuftrag;
    if (a && !d.auftraege[a[0]]) {
      d.auftraege[a[0]] = 1; S.gibSterne(1);
      if (window.Lernfunde) Lernfunde.merke({ fach: "kunst", art: "kunst", e: "🎨", text: `Kunst: ${a[3]}`, schluessel: "kunst:" + a[0] });
    } else if (d.gemalt === 1 && window.Lernfunde) Lernfunde.merke({ fach: "kunst", art: "kunst", e: "🎨", text: "Mein erstes Bild im Atelier", schluessel: "kunst:erstes" });
    speichere(d);
    S.ton("juhu");
  }

  // ---------- Ausmalbilder ----------
  function zeigeVorlagen() {
    $("vorlagen").innerHTML = V.VORLAGEN.map(v => `<button data-v="${v.id}"><canvas width="256" height="192"></canvas>${v.name}${ru(v.ru) ? `<small lang="ru" style="font-weight:500">${ru(v.ru)}</small>` : ""}</button>`).join("");
    $("vorlagen").querySelectorAll("button").forEach(b => {
      const k = b.querySelector("canvas").getContext("2d"); k.fillStyle = "#fff"; k.fillRect(0, 0, 256, 192); V.zeichne(k, b.dataset.v, 256, 192);
      b.addEventListener("click", () => { S.ton("tipp"); oeffneMalen({ vorlage: b.dataset.v }); });
    });
  }

  // ---------- Galerie ----------
  let offen = null;
  async function zeigeGalerie() {
    let liste = []; try { liste = await B.alle(); } catch (e) { /* ohne IndexedDB */ }
    const wand = B.wand();
    $("galerie-info").textContent = liste.length ? `${liste.length} von ${B.MAX} Plätzen · 🖼️ = hängt im Zimmer (bis zu ${B.WAND} Bilder). Deine Bilder bleiben auf diesem Tablet.` : "";
    $("galerie").innerHTML = liste.length ? liste.map(b => `<button data-id="${b.id}"><img src="${b.url}" alt="Dein Bild">${wand.includes(b.id) ? '<span class="an-wand">🖼️</span>' : ""}<small style="font-weight:500">${new Date(b.t).toLocaleDateString("de-DE")}</small></button>`).join("")
      : `<div class="karte leer">Noch keine Bilder. Mal doch eins! 🖌️</div>`;
    $("galerie").querySelectorAll("button").forEach(btn => btn.addEventListener("click", async () => {
      S.ton("tipp"); offen = await B.hole(btn.dataset.id); if (!offen) return;
      $("bild-gross").src = offen.url;
      const a = AUFTRAEGE.find(x => x[0] === offen.auftrag);
      $("bild-info").textContent = (a ? "💡 " + a[1] + " · " : "") + new Date(offen.t).toLocaleDateString("de-DE");
      $("bild-wand").textContent = B.wand().includes(offen.id) ? "↩️ Von der Wand nehmen" : "🖼️ An die Wand";
      $("bild-dlg").hidden = false;
    }));
  }
  $("bild-zu").addEventListener("click", () => { $("bild-dlg").hidden = true; });
  $("bild-weiter").addEventListener("click", () => { $("bild-dlg").hidden = true; const a = AUFTRAEGE.find(x => x[0] === offen.auftrag); oeffneMalen({ bild: offen, auftrag: a || null }); });
  // ---------- Bilder digital bearbeiten (30.10.2026, Lehrplan Kunst Kl. 3: Bilder digital bearbeiten und verfremden) ----------
  // Effekte wirken auf eine Kopie; „Als neues Bild speichern“ legt das verfremdete Bild zusätzlich in die Galerie (Original bleibt).
  const EFFEKTE = [
    ["grau", "⚫ Schwarz-weiß", (d) => { for (let i = 0; i < d.length; i += 4) { const g = 0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2]; d[i] = d[i + 1] = d[i + 2] = g; } }],
    ["negativ", "🔄 Umkehren (Negativ)", (d) => { for (let i = 0; i < d.length; i += 4) { d[i] = 255 - d[i]; d[i + 1] = 255 - d[i + 1]; d[i + 2] = 255 - d[i + 2]; } }],
    ["tauschen", "🎨 Farben tauschen", (d) => { for (let i = 0; i < d.length; i += 4) { const r = d[i]; d[i] = d[i + 1]; d[i + 1] = d[i + 2]; d[i + 2] = r; } }],
    ["sepia", "📜 Wie ein altes Foto", (d) => { for (let i = 0; i < d.length; i += 4) { const r = d[i], g = d[i + 1], b = d[i + 2]; d[i] = Math.min(255, r * .39 + g * .77 + b * .19); d[i + 1] = Math.min(255, r * .35 + g * .69 + b * .17); d[i + 2] = Math.min(255, r * .27 + g * .53 + b * .13); } }],
    ["spiegeln", "↔️ Spiegeln", null], ["kaleido", "🦋 Symmetrisch", null], ["mosaik", "🟪 Mosaik", null], ["popart", "🖼️ Pop-Art (4 Farben)", null]
  ];
  let vf = null;
  function vfZeichne(art) {
    const c = $("vf-bild"), k = c.getContext("2d"), W = c.width, H = c.height;
    k.save(); k.clearRect(0, 0, W, H); k.fillStyle = "#fff"; k.fillRect(0, 0, W, H);
    if (art === "spiegeln") { k.translate(W, 0); k.scale(-1, 1); k.drawImage(vf.img, 0, 0, W, H); }
    else if (art === "kaleido") { k.drawImage(vf.img, 0, 0, vf.img.width / 2, vf.img.height, 0, 0, W / 2, H); k.translate(W, 0); k.scale(-1, 1); k.drawImage(vf.img, 0, 0, vf.img.width / 2, vf.img.height, 0, 0, W / 2, H); }
    else if (art === "popart") { [[255, 80, 120], [60, 180, 255], [255, 210, 40], [80, 220, 120]].forEach(([r, g, b], i) => {
        const x = (i % 2) * W / 2, y = Math.floor(i / 2) * H / 2; k.drawImage(vf.img, x, y, W / 2, H / 2); const d = k.getImageData(x, y, W / 2, H / 2);
        for (let j = 0; j < d.data.length; j += 4) { const hell = (d.data[j] + d.data[j + 1] + d.data[j + 2]) / 765; d.data[j] = r * hell; d.data[j + 1] = g * hell; d.data[j + 2] = b * hell; }
        k.putImageData(d, x, y); }); }
    else k.drawImage(vf.img, 0, 0, W, H);
    k.restore();
    if (art === "mosaik") { const s = 16, d = k.getImageData(0, 0, W, H); for (let y = 0; y < H; y += s) for (let x = 0; x < W; x += s) { const i = (y * W + x) * 4; k.fillStyle = `rgb(${d.data[i]},${d.data[i + 1]},${d.data[i + 2]})`; k.fillRect(x, y, s, s); } }
    const e = EFFEKTE.find(x => x[0] === art);
    if (e && e[2]) { const d = k.getImageData(0, 0, W, H); e[2](d.data); k.putImageData(d, 0, 0); }
    vf.art = art || "";
    $("vf-effekte").querySelectorAll("[data-vf]").forEach(b => b.classList.toggle("haupt", b.dataset.vf === art));
  }
  $("bild-verfremden").addEventListener("click", () => {
    if (!offen) return; S.ton("tipp"); $("bild-dlg").hidden = true;
    const img = new Image(); img.onload = () => { vf = { img, art: "" }; vfZeichne(""); $("vf-dlg").hidden = false; }; img.src = offen.url;
    $("vf-effekte").innerHTML = EFFEKTE.map(([id, n]) => `<button class="knopf" data-vf="${id}">${n}</button>`).join("");
    $("vf-effekte").querySelectorAll("[data-vf]").forEach(b => b.addEventListener("click", () => { S.ton("tipp"); vfZeichne(b.dataset.vf); }));
  });
  $("vf-original").addEventListener("click", () => { S.ton("tipp"); vfZeichne(""); });
  $("vf-zu").addEventListener("click", () => { $("vf-dlg").hidden = true; });
  $("vf-speichern").addEventListener("click", async () => {
    if (!vf || !vf.art) { $("vf-info").textContent = "Wähle zuerst einen Effekt aus."; return; }
    const id = await B.speichere({ url: $("vf-bild").toDataURL("image/jpeg", 0.85), auftrag: "verfremdet" });
    if (!id) { $("vf-info").textContent = "Die Galerie ist voll. Lösch zuerst ein Bild."; return; }
    S.ton("juhu"); $("vf-dlg").hidden = true; if (C) C.gib("kreativ", 2);
    if (window.Lernfunde) Lernfunde.merke({ fach: "kunst", art: "kunst", e: "🪄", schluessel: "verfremdet", text: "Kunst: ein Bild digital verfremdet" });
    zeigeGalerie();
  });
  $("bild-wand").addEventListener("click", () => {
    const an = !B.wand().includes(offen.id), voll = an && B.wand().length >= B.WAND;
    B.setzeWand(offen.id, an); $("bild-dlg").hidden = true; S.ton(an ? "juhu" : "tipp"); zeigeGalerie();
    if (voll) frage("Dein Bild hängt jetzt im Zimmer. Dafür ist das älteste Bild von der Wand genommen – es bleibt aber in der Galerie.", [["OK", null]]);
  });
  $("bild-loeschen").addEventListener("click", () => {
    $("bild-dlg").hidden = true;
    frage("Dieses Bild wirklich löschen? Es ist dann für immer weg.", [["🗑️ Ja, löschen", async () => { await B.loesche(offen.id); zeigeGalerie(); }], ["Nein, behalten", null]]);
  });

  // ---------- Kleine Rückfrage ----------
  function frage(text, knoepfe) {
    $("frage-text").textContent = text;
    $("frage-knoepfe").innerHTML = "";
    knoepfe.forEach(([t, fn], i) => { const b = document.createElement("button"); b.className = "knopf" + (i === 0 ? " haupt" : ""); b.textContent = t; b.addEventListener("click", () => { $("frage-dlg").hidden = true; S.ton("tipp"); if (fn) fn(); }); $("frage-knoepfe").appendChild(b); });
    $("frage-dlg").hidden = false;
  }

  window.__atelier = { fuelle, oeffneMalen, sichern, g, AUFTRAEGE, zeige };
  if (/[?&]musik\b/.test(location.search)) zeige("musik"); else start();
})();
