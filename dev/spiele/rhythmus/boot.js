// Rhythmus-Boot an der Ballon-Wiese (05.11.2026, Kapitel 4 „Paulas Fest“): Paula spielt einen Rhythmus vor, das Kind paddelt ihn nach
// („Echo“) oder findet die passende Rhythmus-Karte („Finden“). Jeder richtige Rhythmus bringt das Boot ein Stück den Fluss hinunter.
// Bausteine: Ta (Viertel, 1 Schlag), ti-ti (zwei Achtel), Ta-a (Halbe, 2 Schläge), sch (Viertelpause). Stufe nach Klasse:
//   a (Vorschule, Kl. 1): Ta, ti-ti · b (Kl. 2): + sch · c (ab Kl. 3): + Ta-a, dazu die Notenzeichen (mu.no.01).
// Echo-Prüfung ohne Taktzwang: Das Tempo des Kindes zählt (vom ersten bis zum letzten Paddelschlag), jeder Schlag darf 0,3 Schläge daneben liegen.
// Ton nur nach Antippen (▶ Anhören); ohne Ton leuchten die Karten im Takt. Eine Runde = 6 Rhythmen (abwechselnd Echo und Finden).
// Sterne nur für neue Ziele: ein Rhythmus zum ersten Mal beim ersten Versuch richtig = 1 Stern, höchstens 3 am Tag (kein Zufall).
// Daten rhythmus = { geschafft: { id: n }, neu: { "JJJJ-MM-TT": n }, runden: n }. Test-Haken: window.__rhythmus.
(function () {
  const S = window.Spielwelt, SP = window.Sprache;
  const $ = (id) => document.getElementById(id);
  const esc = S.esc;
  const ru = (t) => (S.hilfe() && t ? `<span class="ru">${esc(t)}</span>` : "");
  const RUNDE = 6, STERNE_TAG = 3, TOLERANZ = 0.3, BEAT = 600;
  // Bausteine: Einsätze (in Schlägen ab Bausteinbeginn) und Länge
  const B = {
    ta: { name: "Ta", ein: [0], lang: 1 },
    ti: { name: "ti-ti", ein: [0, 0.5], lang: 1 },
    taa: { name: "Ta-a", ein: [0], lang: 2 },
    sch: { name: "sch", ein: [], lang: 1 }
  };
  // Feste Rhythmen je Stufe (immer 4 Schläge, mindestens 3 Einsätze); die Reihenfolge ist fest, die Runde nimmt zuerst ungeübte
  const RHYTHMEN = {
    a: ["ta ta ta ta", "ta ta ti ta", "ti ta ti ta", "ta ti ti ta", "ti ti ta ta", "ta ti ta ta", "ti ti ti ta", "ta ta ta ti"],
    b: ["ta sch ta ta", "ti ta sch ta", "ta ti sch ta", "ti ti ta sch", "ta sch ti ta", "sch ta ti ta", "ti sch ti ta", "ta ta sch ti"],
    c: ["taa ta ta", "ta ta taa", "ti ti taa", "taa ti ta", "ta taa ta", "taa ti ti", "ti taa ta", "ta ti taa"]
  };
  const stufeFuer = (code) => (["vs", "1"].includes(code) ? "a" : code === "2" ? "b" : "c");
  const stufe = () => window.__rhythmusStufe || stufeFuer(((S.stufe && S.stufe()) || {}).code || "2");
  // eine Stufe übt auch die vorige mit (b enthält a, c enthält b) – die neuen Rhythmen kommen zuerst
  const vorrat = (st) => (st === "a" ? RHYTHMEN.a : st === "b" ? RHYTHMEN.b.concat(RHYTHMEN.a) : RHYTHMEN.c.concat(RHYTHMEN.b));
  const teile = (r) => r.split(" ");
  const einsaetze = (r) => { let t = 0; const e = []; teile(r).forEach(k => { B[k].ein.forEach(x => e.push(t + x)); t += B[k].lang; }); return e; };
  const offen = () => S.offen(!!(window.Story && Story.kapitel() >= 4));
  const daten = () => Object.assign({ geschafft: {}, neu: {}, runden: 0 }, S.lade("rhythmus") || {});
  const speichere = (d) => S.speichere("rhythmus", d);
  let paulaText = "", lauf = null, takt = null;

  function paula(de, r) { paulaText = de; $("paula-text").innerHTML = esc(de) + ru(r); }

  // ---------- Notenbilder (SVG, Stil A) ----------
  const D = "#3B1F63";
  function note(k, gross) {
    const h = gross ? 70 : 54, w = k === "ti" ? 52 : 34;
    const kopf = (x, voll) => `<ellipse cx="${x}" cy="${h - 12}" rx="9" ry="7" transform="rotate(-20 ${x} ${h - 12})" fill="${voll ? D : "#fff"}" stroke="${D}" stroke-width="3"/>`;
    const hals = (x) => `<line x1="${x + 8}" y1="${h - 13}" x2="${x + 8}" y2="8" stroke="${D}" stroke-width="3"/>`;
    let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">`;
    if (k === "ta") s += kopf(14, true) + hals(14);
    else if (k === "taa") s += kopf(14, false) + hals(14);
    else if (k === "ti") s += kopf(12, true) + hals(12) + kopf(36, true) + hals(36) + `<line x1="20" y1="9" x2="44" y2="9" stroke="${D}" stroke-width="6"/>`;
    else s += `<path d="M13 ${h * .2} l9 9 l-8 8 l9 10 q-10 -3 -7 8" fill="none" stroke="${D}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
    return s + `</svg>`;
  }
  // Rhythmus-Karte: Bausteine nebeneinander, Breite nach Länge; Silben darunter. mitNoten: ab Stufe c immer, sonst nur Silben + Punkte
  function karte(r, id) {
    const mitNoten = stufe() === "c";
    return `<div class="rhythmus" ${id ? `id="${id}"` : ""}>${teile(r).map((k, i) => `<div class="baustein b-${k}" data-i="${i}" style="flex:${B[k].lang}">` +
      (mitNoten ? `<span class="note">${note(k)}</span>` : `<span class="punkte">${k === "ti" ? "<i class='klein'></i><i class='klein'></i>" : k === "sch" ? "<i class='leer'></i>" : k === "taa" ? "<i class='lang'></i>" : "<i></i>"}</span>`) +
      `<b>${B[k].name}</b></div>`).join("")}</div>`;
  }

  // ---------- Klang ----------
  let ac = null;
  function klang(hoch, wann = 0, lang = 0) {   // lang = Haltedauer in Sekunden (Ta-a klingt hörbar länger als Ta + Pause)
    if (S.profil && S.profil.ton === false) return;
    try {
      const A = window.AudioContext || window.webkitAudioContext; if (!A) return;
      ac = ac || new A(); if (ac.state === "suspended") ac.resume();
      const t = ac.currentTime + wann, o = ac.createOscillator(), g = ac.createGain();
      o.type = "triangle"; o.frequency.setValueAtTime(hoch ? 880 : 520, t); o.frequency.exponentialRampToValueAtTime(hoch ? 440 : 260, t + 0.12);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.005); if (lang > 0.2) g.gain.setValueAtTime(0.4, t + lang - 0.12); g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(0.15, lang));
      o.connect(g).connect(ac.destination); o.start(t); o.stop(t + Math.max(0.18, lang + 0.03));
    } catch (e) { /* ohne Ton geht es auch */ }
  }
  // Vorspielen: Klang je Einsatz, Karte leuchtet im Takt mit; fertig() danach
  function spiele(r, elId, fertig) {
    stoppe();
    const el = $(elId), e = einsaetze(r), bau = []; let t = 0;
    teile(r).forEach((k, i) => { bau.push({ i, ab: t }); t += B[k].lang; });
    const zeit = window.__testSchnell ? 60 : BEAT;
    const timer = [];
    { let ab = 0; teile(r).forEach(k => { B[k].ein.forEach(x => klang(ab + x === 0, (ab + x) * zeit / 1000, k === "taa" ? 1.7 * zeit / 1000 : 0)); ab += B[k].lang; }); }
    // jeder Klang lässt die Vorlage kurz aufleuchten (auch ohne Ton sichtbar)
    e.forEach(x => timer.push(setTimeout(() => { if (!el) return; el.classList.add("puls"); setTimeout(() => el.classList.remove("puls"), Math.min(140, zeit * 0.4)); }, x * zeit)));
    bau.forEach(({ i, ab }) => timer.push(setTimeout(() => { if (!el) return; el.querySelectorAll(".baustein").forEach(b => b.classList.toggle("an", +b.dataset.i === i)); $("paula-fig").classList.toggle("wipp"); }, ab * zeit)));
    timer.push(setTimeout(() => { if (el) el.querySelectorAll(".baustein").forEach(b => b.classList.remove("an")); takt = null; fertig && fertig(); }, (t + 0.3) * zeit));
    takt = timer;
  }
  function stoppe() { if (takt) takt.forEach(clearTimeout); takt = null; }

  // ---------- Prüfung (ohne Taktzwang) ----------
  // schlaege: Zeitpunkte in ms. Liefert { ok, grund }.
  function pruefe(r, schlaege) {
    const e = einsaetze(r);
    if (schlaege.length !== e.length) return { ok: false, grund: schlaege.length < e.length ? "wenig" : "viel" };
    const t0 = schlaege[0], spanne = schlaege[schlaege.length - 1] - t0, beats = e[e.length - 1] - e[0];
    const beat = spanne / beats;
    if (!(beat >= 200 && beat <= 1600)) return { ok: false, grund: "tempo" };
    for (let i = 0; i < e.length; i++) if (Math.abs((schlaege[i] - t0) / beat - (e[i] - e[0])) > TOLERANZ) return { ok: false, grund: "rhythmus" };
    return { ok: true };
  }

  // ---------- Runde ----------
  function waehle() {
    const d = daten(), v = vorrat(stufe());
    const neu = v.filter(r => !d.geschafft[r]), alt = v.filter(r => d.geschafft[r]);
    return neu.concat(alt).slice(0, RUNDE);
  }
  function starte() {
    stoppe();
    lauf = { liste: waehle(), pos: 0, versuche: 0, ersteRichtig: 0, sterne: 0, schlaege: [], phase: "hoeren" };
    $("ende").hidden = true; $("spiel").hidden = false;
    paula(`Hallo ${S.profil.name || "du"}! Wir paddeln zum Fest. Ich spiele dir einen Rhythmus vor – hör gut zu!`, "Мы плывём на праздник. Я сыграю тебе ритм – слушай внимательно!");
    zeige();
  }
  const istEcho = () => lauf.pos % 2 === 0;
  function fluss() {
    $("fluss").innerHTML = `<div class="wasser">${Array.from({ length: RUNDE + 1 }, (_, i) => `<span class="boje${i < lauf.pos ? " da" : ""}${i === RUNDE ? " ziel" : ""}"></span>`).join("")}</div>` +
      `<div class="boot" style="left:calc(${(lauf.pos / RUNDE) * 100}% - ${lauf.pos / RUNDE * 70}px)" aria-hidden="true">🛶</div>`;
    $("stand").textContent = `${lauf.pos} von ${RUNDE} Rhythmen`;
  }
  function zeige() {
    const r = lauf.liste[lauf.pos]; lauf.versuche = 0; lauf.schlaege = []; lauf.phase = "hoeren";
    fluss();
    $("hinweis").className = "hinweis"; $("hinweis").innerHTML = "";
    if (istEcho()) {
      $("aufgabe").innerHTML = `<p class="frage">👂 Hör zu – dann paddle genauso!</p>${karte(r, "vorlage")}<div class="tupfen" id="tupfen"></div>`;
      $("knoepfe").innerHTML = `<button class="knopf haupt" id="anhoeren">▶ Anhören</button><button class="paddel" id="paddel" disabled aria-label="Paddeln">🛶<b>Paddeln</b></button>`;
      $("anhoeren").addEventListener("click", () => { S.ton("tipp"); hoereVor(); });
    } else {
      const wahl = optionen(r);
      $("aufgabe").innerHTML = `<p class="frage">👂 Hör zu – welche Karte passt?</p><div class="raetsel" id="vorlage"><span>?</span><span>?</span><span>?</span><span>?</span></div>` +
        `<div class="wahl" id="wahl">${wahl.map((o, i) => `<button class="wahl-karte" data-r="${o}" disabled aria-label="Karte ${i + 1}">${karte(o)}</button>`).join("")}</div>`;
      $("knoepfe").innerHTML = `<button class="knopf haupt" id="anhoeren">▶ Anhören</button>`;
      $("anhoeren").addEventListener("click", () => { S.ton("tipp"); hoereVor(); });
      $("wahl").querySelectorAll(".wahl-karte").forEach(k => k.addEventListener("click", () => waehleKarte(k)));
    }
  }
  // drei Karten: die richtige und zwei ähnliche aus dem Vorrat (fest nach Position, kein Zufall nötig)
  function optionen(r) {
    const v = vorrat(stufe()).filter(x => x !== r && einsaetze(x).join() !== einsaetze(r).join());
    const n = v.length, i = vorrat(stufe()).indexOf(r);
    const a = v[(i + 1) % n], b = v[(i + 3) % n] === a ? v[(i + 4) % n] : v[(i + 3) % n];
    const liste = [r, a, b];
    const dreh = lauf.pos % 3;   // Position der richtigen Karte wechselt
    return liste.slice(3 - dreh).concat(liste.slice(0, 3 - dreh));
  }
  function hoereVor() {
    const r = lauf.liste[lauf.pos];
    $("anhoeren").disabled = true; if ($("paddel")) $("paddel").disabled = true;
    lauf.phase = "hoeren";
    spiele(r, "vorlage", () => {
      $("anhoeren").disabled = false; $("anhoeren").textContent = "🔁 Nochmal hören";
      if (istEcho()) { $("paddel").disabled = false; lauf.phase = "paddeln"; lauf.schlaege = []; $("tupfen").innerHTML = "";
        paula("Jetzt du! Tipp aufs Paddel – im gleichen Rhythmus.", "Теперь ты! Нажимай на весло в том же ритме."); }
      else { $("wahl").querySelectorAll(".wahl-karte").forEach(k => { k.disabled = false; }); paula("Welche Karte hast du gehört?", "Какую карточку ты услышал?"); }
    });
  }
  // Paddeln: jeder Schlag klingt und hinterlässt einen Tupfer; nach dem letzten erwarteten Schlag (oder 1,5 s Pause) wird geprüft
  let warte = null;
  function paddle(zeit) {
    if (!lauf || lauf.phase !== "paddeln") return;
    const r = lauf.liste[lauf.pos];
    lauf.schlaege.push(zeit); klang(lauf.schlaege.length === 1);
    $("paddel").classList.remove("schlag"); void $("paddel").offsetWidth; $("paddel").classList.add("schlag");
    $("tupfen").insertAdjacentHTML("beforeend", "<i></i>");
    clearTimeout(warte);
    if (lauf.schlaege.length >= einsaetze(r).length) warte = setTimeout(bewerte, window.__testSchnell ? 50 : 350);
    else warte = setTimeout(bewerte, 2500);
  }
  function bewerte() {
    if (!lauf || lauf.phase !== "paddeln") return;
    lauf.phase = "warten";
    const r = lauf.liste[lauf.pos], erg = pruefe(r, lauf.schlaege);
    if (erg.ok) return richtig(r);
    lauf.versuche++; S.ton("nein");
    if (window.Koennen && lauf.versuche === 1) Koennen.melde(["mu.ma.01"], false);
    const tipp = erg.grund === "wenig" ? (stufe() === "c" ? ["Da fehlt noch ein Schlag. Zähl die Noten auf der Karte mit.", "Не хватает удара. Посчитай ноты на карточке."] : ["Da fehlt noch ein Schlag. Zähl die Punkte auf der Karte mit.", "Не хватает удара. Посчитай точки на карточке."])
      : erg.grund === "viel" ? (stufe() === "c" ? ["Das war ein Schlag zu viel. Zähl die Noten auf der Karte mit.", "Это был лишний удар. Посчитай ноты на карточке."] : ["Das war ein Schlag zu viel. Zähl die Punkte auf der Karte mit.", "Это был лишний удар. Посчитай точки на карточке."])
      : ["Fast! Ti-ti ist schnell, Ta ist langsam. Hör noch einmal hin.", "Почти! Ти-ти – быстро, Та – медленно. Послушай ещё раз."];
    if (lauf.versuche >= 2) return loesung(r, tipp);
    $("hinweis").className = "hinweis nein"; $("hinweis").innerHTML = esc(tipp[0]) + ru(tipp[1]);
    $("paddel").disabled = true; $("anhoeren").disabled = false;
  }
  function waehleKarte(k) {
    if (!lauf || lauf.phase === "fertig") return;
    const r = lauf.liste[lauf.pos];
    if (k.dataset.r === r) { k.classList.add("richtig"); return richtig(r); }
    lauf.versuche++; S.ton("nein"); k.classList.add("falsch"); k.disabled = true;
    if (window.Koennen && lauf.versuche === 1) Koennen.melde(stufe() === "c" ? ["mu.ma.01", "mu.no.01"] : ["mu.ma.01"], false);
    const tipp = ["Fast! Hör noch einmal und zeig bei jedem Klang mit dem Finger mit.", "Почти! Послушай ещё раз и показывай пальцем на каждый звук."];
    if (lauf.versuche >= 2) return loesung(r, tipp);
    $("hinweis").className = "hinweis nein"; $("hinweis").innerHTML = esc(tipp[0]) + ru(tipp[1]);
  }
  function richtig(r) {
    lauf.phase = "fertig"; S.ton("juhu");
    const d = daten(); let stern = false;
    if (lauf.versuche === 0) {
      lauf.ersteRichtig++;
      if (window.Koennen) Koennen.melde(stufe() === "c" && !istEcho() ? ["mu.ma.01", "mu.no.01"] : ["mu.ma.01"], true);
      if (window.Charakter) Charakter.gib("kreativ", 1);
      if (window.Zeit && Zeit.aufgabe) Zeit.aufgabe();
      const heute = S.heute();
      if (!d.geschafft[r] && (d.neu[heute] || 0) < STERNE_TAG) { d.neu = { [heute]: (d.neu[heute] || 0) + 1 }; S.gibSterne(1); lauf.sterne++; stern = true;
        if (window.Lernfunde) Lernfunde.merke({ fach: "musik", art: "rhythmus", e: "🥁", text: `Rhythmus „${teile(r).map(k => B[k].name).join(" ")}“ gepaddelt`, schluessel: "rhythmus:" + r }); }
      d.geschafft[r] = (d.geschafft[r] || 0) + 1;
    }
    speichere(d);
    $("sterne").textContent = S.sterne();
    $("hinweis").className = "hinweis gut"; $("hinweis").innerHTML = esc(`Genau so! ${teile(r).map(k => B[k].name).join(" – ")}.${stern ? " Ein neuer Rhythmus – dafür gibt es einen Stern ⭐." : ""}`) + ru(stern ? "Точно так! Новый ритм – за него звезда." : "Точно так!");
    if (!istEcho()) $("vorlage").outerHTML = karte(r, "vorlage");
    setTimeout(weiter, window.__testSchnell ? 120 : 1500);
  }
  function loesung(r, tipp) {
    lauf.phase = "fertig";
    $("hinweis").className = "hinweis"; $("hinweis").innerHTML = esc(`So klingt es: ${teile(r).map(k => B[k].name).join(" – ")}. Den üben wir beim nächsten Mal wieder.`) + ru("Вот как это звучит. Потренируем в следующий раз.");
    if (!istEcho()) { $("vorlage").outerHTML = karte(r, "vorlage"); $("wahl").querySelectorAll(".wahl-karte").forEach(k => { k.disabled = true; if (k.dataset.r === r) k.classList.add("richtig"); }); }
    if ($("paddel")) $("paddel").disabled = true; $("anhoeren").disabled = true;
    spiele(r, "vorlage", () => setTimeout(weiter, window.__testSchnell ? 100 : 900));
  }
  function weiter() {
    lauf.pos++;
    if (lauf.pos >= lauf.liste.length) return ende();
    paula(lauf.ersteRichtig ? "Toll gepaddelt! Weiter geht's." : "Weiter geht's – du schaffst das.", "Отлично! Плывём дальше.");
    zeige();
  }
  function ende() {
    lauf.phase = "ende"; fluss();
    const d = daten(); d.runden = (d.runden || 0) + 1; speichere(d);
    if (window.Ereignisse && Ereignisse.melde) Ereignisse.melde("rhythmus", { n: lauf.ersteRichtig });
    $("spiel").hidden = true;
    paula(`Wir sind beim Fest angekommen, ${S.profil.name || "du"}! Alle tanzen zu deinem Rhythmus.`, "Мы приплыли на праздник! Все танцуют под твой ритм.");
    $("ende").innerHTML = `<h2>🎉 Angekommen!</h2>
      <p>${lauf.ersteRichtig} von ${lauf.liste.length} Rhythmen gleich beim ersten Mal richtig.${lauf.sterne ? ` ${lauf.sterne === 1 ? "1 neuer Rhythmus" : lauf.sterne + " neue Rhythmen"}: +${lauf.sterne} ⭐` : ""}</p>
      <div class="ende-knoepfe"><button class="knopf haupt" id="nochmal">🛶 Noch eine Fahrt</button><a class="knopf" href="../welt3d/heimat.html">🏝️ Zur Insel</a></div>`;
    $("ende").hidden = false;
    $("nochmal").addEventListener("click", () => { S.ton("tipp"); starte(); });
  }

  // ---------- Start ----------
  $("sterne").textContent = S.sterne();
  $("paula-vorlesen").addEventListener("click", () => { if (SP) SP.sprich(paulaText); });
  // Paddeln: pointerdown statt click (schneller, kein 300-ms-Warten auf dem iPad); Zeit aus dem Ereignis
  document.addEventListener("pointerdown", (e) => { const p = e.target.closest && e.target.closest("#paddel"); if (p && !p.disabled) { e.preventDefault(); paddle(e.timeStamp || performance.now()); } });
  document.addEventListener("keydown", (e) => { if ((e.key === " " || e.key === "Enter") && document.activeElement && document.activeElement.id === "paddel" && !$("paddel").disabled) { e.preventDefault(); paddle(e.timeStamp || performance.now()); } });
  if (!offen()) {
    $("zu").hidden = false; $("spiel").hidden = true;
    paula("Mein Boot ist noch nicht fertig!", "Моя лодка ещё не готова!");
  } else starte();

  window.__rhythmus = { get lauf() { return lauf; }, starte, pruefe, einsaetze, waehle, optionen: (r) => optionen(r), daten, stufe, stufeFuer, RHYTHMEN, RUNDE, STERNE_TAG,
    paddle: (t) => paddle(t), bewerte };
})();
