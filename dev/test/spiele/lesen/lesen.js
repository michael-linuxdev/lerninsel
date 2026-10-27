// „Laute und Buchstaben“ (NA-30/31): Anlaute hören, Buchstaben den Lauten zuordnen, Silben lesen, erste Lesetexte.
// Buchstaben-Tafel (ansehen und anhören), „Gleicher Anfang“ (Vorschule), „Finde das Bild“ und „Welcher Buchstabe?“ (Kl. 1),
// „Silben lesen“ (Wort in Silbenbögen lesen, Bild wählen) und „Lesetexte“ (20 kurze Texte mit Fragen, inhalte/deutsch/lesetexte.js).
// Daten: profil.daten.lesen = { b: { <Buchstabe>: n }, w: { <wort-id>: n }, t: { <text-id>: richtige Fragen }, farbe: true|false };
// Fehler kommen in die Lernkartei (Fach „lesen“).
// Test-Haken: window.__lesen (ansicht, runde(modus), antworte(i), richtigIndex, aufgabeNr, stand, tafel, detail(b), texte, text(id), textAntworte(i), textRichtig).
(function () {
  const S = window.Spielwelt, W = window.Wortschatz, SP = window.Sprache, C = window.Charakter, LK = window.Lernkartei;
  const $ = (id) => document.getElementById(id);
  const mische = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const LOB = ["Richtig!", "Super!", "Genau!", "Toll!", "Prima!"];
  const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const A = window.ANLAUTE || [];
  const HOERBAR = A.filter(x => !x.selten);
  const buchstabeVon = {};   // Wort-ID → Anlaut
  HOERBAR.forEach(x => x.w.forEach(id => { buchstabeVon[id] = x.b; }));
  // Klingen fast gleich oder sehen am Anfang gleich aus (Schaf beginnt mit S, klingt aber „sch“) → nie zusammen als Auswahl
  const VERWECHSELBAR = { E: ["Ä", "Ei"], "Ä": ["E"], Ei: ["E"], A: ["Au"], Au: ["A"], S: ["Sch"], Sch: ["S"], K: ["Qu"], Qu: ["K"] };
  const klein = (b) => b.length > 1 ? b : b + " " + b.toLowerCase();
  const wort = (id) => W.wort(id);
  const daten = () => Object.assign({ b: {}, w: {}, t: {}, farbe: true }, S.lade("lesen") || {});
  const TEXTE = window.LESETEXTE || [];

  // Silbenschrift: „Ba-na-ne“ → Silben in Bögen, abwechselnd blau/rot (abschaltbar); Satzzeichen bleiben stehen
  function silbenHtml(text, farbig = daten().farbe) {
    const teile = String(text).split(/([A-Za-zÄÖÜäöüß-]+)/);
    return `<span class="${farbig ? "farbig" : ""}">${teile.map((t, i) => i % 2
      ? `<span class="sw">${t.split("-").map(x => `<span class="sb">${esc(x)}</span>`).join("")}</span>`
      : esc(t)).join("")}</span>`;
  }
  const ohneTrenner = (t) => String(t).replace(/-/g, "");
  // Wörter für „Silben lesen“: Nomen mit eindeutigem Bild, ein bis drei Silben, Klasse 1
  const SILBENWOERTER = W.alle().filter(w => w.wortart === "nomen" && w.silben.length >= 1 && w.silben.length <= 3 && w.stufe.includes("1"))
    .filter((w, i, l) => l.findIndex(x => x.bild === w.bild) === i);

  function sprich(text, fertig) { if (SP) SP.sprich(text, "de-DE", fertig); else if (fertig) fertig(); }
  let ansicht = "start";
  function zeige(n) { ansicht = n; ["start", "tafel", "uebung", "texte", "text"].forEach(v => $(v + "-ansicht").hidden = v !== n); scrollTo(0, 0); if (SP) SP.stopp(); }
  document.querySelectorAll(".zurueck").forEach(b => b.addEventListener("click", () => start()));

  // ---------- Start ----------
  function start() {
    zeige("start");
    $("fipsi-start").innerHTML = window.Figuren ? Figuren.fipsi() : "🦊";
    const vs = (S.stufe() || {}).code === "vs";
    const text = vs ? "Hör genau hin! Welche Wörter fangen gleich an? Fang mit „Gleicher Anfang“ an."
      : "Jedes Wort fängt mit einem Laut an. Hör genau hin und finde den Buchstaben!";
    $("start-blase").textContent = text;
    $("start-ton").onclick = () => sprich(text);
    const kann = Object.values(daten().b).filter(n => n >= 2).length;
    $("stand").textContent = `Du kennst schon ${kann} von ${HOERBAR.length} Buchstaben und Lauten.`;
  }
  $("weg-tafel").addEventListener("click", tafel);
  $("weg-gleich").addEventListener("click", () => runde("gleich"));
  $("weg-bild").addEventListener("click", () => runde("bild"));
  $("weg-buchstabe").addEventListener("click", () => runde("buchstabe"));
  $("weg-silben").addEventListener("click", () => runde("silben"));
  $("weg-texte").addEventListener("click", texte);

  // ---------- Buchstaben-Tafel ----------
  function tafel() {
    zeige("tafel");
    const b = daten().b;
    $("tafel").innerHTML = A.map(x => {
      const w = wort(x.w[0]);
      return `<button class="bst${x.selten ? " selten" : ""}${x.laut ? " laut" : ""}${(b[x.b] || 0) >= 2 ? " kann" : ""}" data-b="${esc(x.b)}" aria-label="${esc(x.b)} wie ${esc(w.de)}"><b>${esc(klein(x.b))}</b><span aria-hidden="true">${w.bild}</span></button>`;
    }).join("");
    $("tafel").querySelectorAll(".bst").forEach(k => k.addEventListener("click", () => detail(k.dataset.b)));
    $("detail").hidden = true;
  }
  function detail(bst) {
    const x = A.find(y => y.b === bst); if (!x) return;
    const ws = x.w.map(wort);
    $("detail").hidden = false;
    $("detail").innerHTML = `<div class="gross">${esc(klein(x.b))}</div>
      <div class="bilder">${ws.map(w => `<button data-id="${w.id}"><span aria-hidden="true">${w.bild}</span>${esc(w.de)}</button>`).join("")}</div>
      ${x.tipp ? `<p class="tipp">${esc(x.tipp)}</p>` : ""}`;
    $("detail").querySelectorAll(".bilder button").forEach(k => k.addEventListener("click", () => sprich(wort(k.dataset.id).de)));
    sprich(`${x.b} wie ${ws.map(w => w.de).join(", ")}`);
    $("detail").scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  // ---------- Übungen ----------
  let lauf = null;
  const TITEL = { gleich: "👂 Gleicher Anfang", bild: "🖼️ Finde das Bild", buchstabe: "🅰️ Welcher Buchstabe?", silben: "🌈 Silben lesen" };
  function moeglich(modus, wortId) {
    if (modus === "silben") return SILBENWOERTER.some(w => w.id === wortId);
    const b = buchstabeVon[wortId]; if (!b) return false;
    if (modus === "gleich") return (HOERBAR.find(x => x.b === b) || { w: [] }).w.length >= 2;
    return true;
  }
  function runde(modus) {
    // Erst fällige Karten aus der Lernkartei (höchstens 3), dann neue Wörter – bevorzugt Buchstaben, die noch nicht sicher sind
    const typ = modus === "silben" ? "silbenwort" : "anlaut";
    const karten = LK ? LK.faellige("lesen", 3).filter(k => k.typ === typ && moeglich(modus, k.wort)) : [];
    const b = daten().b;
    if (modus === "silben") {
      // erst Wörter mit zwei Silben (gut zu lesen), noch nicht sichere zuerst
      const ww = daten().w;
      const pool = mische(SILBENWOERTER.filter(w => !karten.some(k => k.wort === w.id)))
        .sort((x, y) => (Math.min(2, ww[x.id] || 0) - Math.min(2, ww[y.id] || 0)) || (Math.abs(x.silben.length - 2) - Math.abs(y.silben.length - 2)));
      lauf = { modus, ziele: karten.concat(pool.slice(0, 10 - karten.length).map(w => ({ typ, wort: w.id }))), i: 0, richtig: 0 };
      zeige("uebung"); $("uebung-titel").textContent = TITEL[modus]; $("uebung-ende").hidden = true;
      aufgabe(); return;
    }
    const rest = mische(Object.keys(buchstabeVon).filter(id => moeglich(modus, id) && !karten.some(k => k.wort === id)))
      .sort((x, y) => Math.min(2, b[buchstabeVon[x]] || 0) - Math.min(2, b[buchstabeVon[y]] || 0));
    const gesehen = new Set(karten.map(k => buchstabeVon[k.wort]));
    const neu = [];
    rest.forEach(id => { if (neu.length + karten.length < 10 && !gesehen.has(buchstabeVon[id])) { gesehen.add(buchstabeVon[id]); neu.push({ typ: "anlaut", wort: id, ziel: buchstabeVon[id] }); } });
    lauf = { modus, ziele: karten.concat(neu), i: 0, richtig: 0 };
    zeige("uebung");
    $("uebung-titel").textContent = TITEL[modus];
    $("uebung-ende").hidden = true;
    aufgabe();
  }
  function andereBuchstaben(b, n) {
    const tabu = new Set([b].concat(VERWECHSELBAR[b] || []));
    return mische(HOERBAR.map(x => x.b).filter(x => !tabu.has(x))).slice(0, n);
  }
  function aufgabe() {
    const z = lauf.ziele[lauf.i], w = wort(z.wort), b = z.ziel;
    lauf.versuche = 0;
    $("uebung-balken").style.width = Math.round(100 * lauf.i / lauf.ziele.length) + "%";
    $("rueck").textContent = "";
    let optionen, frage, ansage, buchstaben = false;
    if (lauf.modus === "silben") {
      // Lesen: nichts wird vorgelesen; der Ton-Knopf erscheint erst nach einem Fehlversuch (Hilfe)
      const falsch = mische(SILBENWOERTER.filter(x => x.id !== w.id && x.bild !== w.bild && x.silben[0] !== w.silben[0])).slice(0, 2);
      optionen = mische([w].concat(falsch)).map(x => ({ id: x.id, w: x, zeige: x.bild }));
      lauf.richtig_i = optionen.findIndex(o => o.id === w.id);
      lauf.optionen = optionen; lauf.ansage = w.silben.join(" – ");
      $("frage").innerHTML = `<button class="ton" id="frage-ton" aria-label="Vorlesen (Hilfe)" hidden>🔊</button><div style="width:100%"><div class="silbenwort">${silbenHtml(w.silben.join("-"))}</div><div>Lies das Wort. Welches Bild passt?</div></div>`;
      $("frage-ton").onclick = () => sprich(lauf.ansage);
      $("wahl").className = "wahl";
      $("wahl").innerHTML = optionen.map((o, i) => `<button data-i="${i}" aria-label="Bild ${i + 1}">${o.zeige}</button>`).join("");
      $("wahl").querySelectorAll("button").forEach(k => k.addEventListener("click", () => antworte(+k.dataset.i)));
      $("wahl").hidden = false;
      return;
    }
    if (lauf.modus === "buchstabe") {
      optionen = mische([b].concat(andereBuchstaben(b, 2))).map(x => ({ b: x, zeige: klein(x) }));
      lauf.richtig_i = optionen.findIndex(o => o.b === b);
      frage = `<span class="vorlage" aria-hidden="true">${w.bild}</span><span>Womit fängt <b>${esc(w.de)}</b> an?</span>`;
      ansage = `${w.de}. Womit fängt ${w.de} an?`;
      buchstaben = true;
    } else {
      // gleich: Partnerwort mit demselben Anlaut; bild: irgendein Wort mit dem Buchstaben
      const partner = mische(HOERBAR.find(x => x.b === b).w.filter(id => id !== z.wort))[0] || z.wort;
      const richtigesWort = lauf.modus === "gleich" ? partner : z.wort;
      const falsch = andereBuchstaben(b, 2).map(x => mische(HOERBAR.find(y => y.b === x).w)[0]);
      optionen = mische([richtigesWort].concat(falsch)).map(id => ({ id, w: wort(id), zeige: wort(id).bild }));
      lauf.richtig_i = optionen.findIndex(o => o.id === richtigesWort);
      const namen = optionen.map(o => o.w.de);
      if (lauf.modus === "gleich") {
        frage = `<span class="vorlage" aria-hidden="true">${w.bild}</span><span>Was fängt genauso an wie <b>${esc(w.de)}</b>?</span>`;
        ansage = `${w.de}. Was fängt genauso an wie ${w.de}? ${namen[0]}, ${namen[1]} oder ${namen[2]}?`;
      } else {
        frage = `<span class="vorlage buchstabe">${esc(klein(b))}</span><span>Welches Bild fängt mit ${esc(b)} an?</span>`;
        ansage = `Welches Bild fängt mit ${b} an? ${namen[0]}, ${namen[1]} oder ${namen[2]}?`;
      }
    }
    lauf.optionen = optionen; lauf.ansage = ansage;
    $("frage").innerHTML = `<button class="ton" id="frage-ton" aria-label="Nochmal hören">🔊</button>${frage}`;
    $("frage-ton").onclick = () => sprich(ansage);
    $("wahl").className = "wahl" + (buchstaben ? " buchstaben" : "");
    $("wahl").innerHTML = optionen.map((o, i) => `<button data-i="${i}" aria-label="${esc(o.w ? o.w.de : o.b)}">${esc(o.zeige)}</button>`).join("");
    $("wahl").querySelectorAll("button").forEach(k => k.addEventListener("click", () => antworte(+k.dataset.i)));
    $("wahl").hidden = false;
    setTimeout(() => sprich(ansage), 250);
  }
  function antworte(i) {
    if (!lauf || !$("uebung-ende").hidden) return;
    const z = lauf.ziele[lauf.i], k = $("wahl").querySelector(`[data-i="${i}"]`);
    if (!k || k.classList.contains("falsch") || k.classList.contains("richtig")) return;
    const schritt = lauf.modus === "silben" ? { typ: "silbenwort", wort: z.wort } : { typ: "anlaut", wort: z.wort, ziel: z.ziel };
    if (lauf.modus === "silben") return antworteSilben(i, z, k, schritt);
    if (i !== lauf.richtig_i) {
      if (lauf.versuche === 0 && LK) LK.falsch("lesen", schritt);
      lauf.versuche++; k.classList.add("falsch");
      const o = lauf.optionen[i];
      $("rueck").textContent = o.w ? `${o.w.de} fängt mit ${buchstabeVon[o.id] || o.w.de[0]} an. Hör nochmal hin.` : "Hör nochmal hin.";
      if (S.ton) S.ton("tipp");
      sprich(o.w ? `${o.w.de}. Hör nochmal hin.` : "Hör nochmal hin.");
      return;
    }
    k.classList.add("richtig");
    const w = wort(z.wort), lob = LOB[Math.floor(Math.random() * LOB.length)];
    $("rueck").textContent = `${lob} ${z.ziel} wie ${w.de}.`;
    if (S.ton) S.ton("juhu");
    if (lauf.versuche === 0) {
      lauf.richtig++;
      if (C) C.gib("deutsch", 1);   // zählt als Lernaufgabe (Zeit-Regel)
      const d = daten(), vorher = d.b[z.ziel] || 0;
      if (lauf.modus !== "gleich") { d.b[z.ziel] = Math.min(9, vorher + 1); S.speichere("lesen", d); }
      if (lauf.modus !== "gleich" && vorher === 0 && window.Lernfunde)
        Lernfunde.merke({ fach: "deutsch", art: "buchstabe", e: "🔤", text: `Buchstabe ${z.ziel}: ${z.ziel} wie ${w.de}`, schluessel: "lesen:" + z.ziel });
      if (z.__karte && LK && LK.richtig("lesen", schritt) && window.Lernfunde)
        Lernfunde.merke({ fach: "deutsch", art: "gemeistert", e: "🌟", text: `Gemeistert: ${w.de} fängt mit ${z.ziel} an`, schluessel: "lesen-k:" + z.wort });
    }
    sprich(`${lob} ${z.ziel} wie ${w.de}.`);
    setTimeout(weiter, 1300);
  }
  function antworteSilben(i, z, k, schritt) {
    const w = wort(z.wort);
    if (i !== lauf.richtig_i) {
      if (lauf.versuche === 0 && LK) LK.falsch("lesen", schritt);
      lauf.versuche++; k.classList.add("falsch");
      $("rueck").textContent = "Lies nochmal Silbe für Silbe.";
      $("frage-ton").hidden = false;   // jetzt darf man sich helfen lassen
      if (S.ton) S.ton("tipp");
      return;
    }
    k.classList.add("richtig");
    const lob = LOB[Math.floor(Math.random() * LOB.length)];
    $("rueck").innerHTML = `${lob} ${silbenHtml(w.silben.join("-"))}`;
    if (S.ton) S.ton("juhu");
    if (lauf.versuche === 0) {
      lauf.richtig++;
      if (C) C.gib("deutsch", 1);
      const d = daten(); d.w[z.wort] = Math.min(9, (d.w[z.wort] || 0) + 1); S.speichere("lesen", d);
      if (z.__karte && LK && LK.richtig("lesen", schritt) && window.Lernfunde)
        Lernfunde.merke({ fach: "deutsch", art: "gemeistert", e: "🌈", text: `Gemeistert: ${w.silben.join("-")} gelesen`, schluessel: "lesen-s:" + z.wort });
    }
    sprich(`${lob} ${W.mitArtikel(w)}.`);
    setTimeout(weiter, 1300);
  }

  // ---------- Lesetexte ----------
  function texte() {
    zeige("texte");
    const d = daten(), st = (S.stufe() || {}).code;
    const knopf = $("silbenfarbe");
    knopf.textContent = d.farbe ? "🌈 Silben an" : "🌈 Silben aus"; knopf.setAttribute("aria-pressed", String(!!d.farbe));
    const gruppe = (stufe, titel) => `<h2 class="stufe-titel">${titel}</h2>` + TEXTE.filter(t => t.stufe === stufe).map(t => {
      const fertig = (d.t[t.id] || 0) >= t.fragen.length;
      return `<button class="text-karte" data-id="${t.id}"><span class="emoji" aria-hidden="true">${t.bild}</span><span>${esc(t.titel)}<small>${t.fragen.length} ${t.fragen.length === 1 ? "Frage" : "Fragen"}</small></span><span class="fertig">${fertig ? "✅" : ""}</span></button>`;
    }).join("");
    // Kinder in Klasse 2 und höher sehen zuerst die längeren Texte
    const k1 = gruppe("1", "Kurze Texte"), k2 = gruppe("2", "Längere Texte");
    $("texte").innerHTML = ["2", "3", "4", "5"].includes(st) ? k2 + k1 : k1 + k2;
    $("texte").querySelectorAll(".text-karte").forEach(b => b.addEventListener("click", () => text(b.dataset.id)));
  }
  $("silbenfarbe").addEventListener("click", () => { const d = daten(); d.farbe = !d.farbe; S.speichere("lesen", d); texte(); });
  let tlauf = null;
  function text(id) {
    const t = TEXTE.find(x => x.id === id); if (!t) return;
    tlauf = { t, f: 0, richtig: 0, versuche: 0 };
    zeige("text");
    $("text-titel").textContent = t.titel;
    $("text-bild").textContent = t.bild;
    $("text-text").innerHTML = silbenHtml(t.text);
    $("text-ton").onclick = () => sprich(ohneTrenner(t.text));
    $("text-ende").hidden = true;
    textFrage();
  }
  function textFrage() {
    const f = tlauf.t.fragen[tlauf.f];
    tlauf.versuche = 0;
    tlauf.optionen = mische(f.optionen.map((o, i) => Object.assign({ richtig: i === 0 }, o)));
    $("text-frage").innerHTML = `<b>${esc(f.frage)}</b>`;
    $("text-rueck").textContent = "";
    $("text-wahl").hidden = false;
    $("text-wahl").innerHTML = tlauf.optionen.map((o, i) => `<button data-i="${i}"><span aria-hidden="true">${o.e || ""}</span>${esc(o.t)}</button>`).join("");
    $("text-wahl").querySelectorAll("button").forEach(b => b.addEventListener("click", () => textAntworte(+b.dataset.i)));
  }
  function textAntworte(i) {
    if (!tlauf || !$("text-ende").hidden) return;
    const o = tlauf.optionen[i], b = $("text-wahl").querySelector(`[data-i="${i}"]`);
    if (!o || b.classList.contains("falsch") || b.classList.contains("richtig")) return;
    if (!o.richtig) { tlauf.versuche++; b.classList.add("falsch"); $("text-rueck").textContent = "Lies nochmal im Text nach."; if (S.ton) S.ton("tipp"); return; }
    b.classList.add("richtig");
    $("text-rueck").textContent = LOB[Math.floor(Math.random() * LOB.length)];
    if (S.ton) S.ton("juhu");
    if (tlauf.versuche === 0) { tlauf.richtig++; if (C) C.gib("deutsch", 1); }
    setTimeout(() => {
      tlauf.f++;
      if (tlauf.f < tlauf.t.fragen.length) { textFrage(); return; }
      const d = daten(), vorher = d.t[tlauf.t.id] || 0;
      d.t[tlauf.t.id] = Math.max(vorher, tlauf.richtig); S.speichere("lesen", d);
      if (!vorher && tlauf.richtig === tlauf.t.fragen.length && window.Lernfunde)
        Lernfunde.merke({ fach: "deutsch", art: "lesen", e: "📖", text: `Gelesen und verstanden: „${tlauf.t.titel}“`, schluessel: "lt:" + tlauf.t.id });
      $("text-wahl").hidden = true; $("text-frage").innerHTML = ""; $("text-rueck").textContent = "";
      const naechster = TEXTE.find(x => x.stufe === tlauf.t.stufe && !((d.t[x.id] || 0) >= x.fragen.length));
      $("text-ende").hidden = false;
      $("text-ende").innerHTML = `<div class="gross">${tlauf.richtig === tlauf.t.fragen.length ? "⭐" : "👍"}</div>
        <p>${tlauf.richtig} von ${tlauf.t.fragen.length} gleich beim ersten Mal richtig.</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          ${naechster ? `<button class="knopf haupt" id="text-weiter">📖 ${esc(naechster.titel)}</button>` : ""}<button class="knopf" id="text-liste">Alle Texte</button></div>`;
      if (naechster) $("text-weiter").onclick = () => text(naechster.id);
      $("text-liste").onclick = texte;
    }, 900);
  }
  $("text-zurueck").addEventListener("click", texte);

  function weiter() {
    lauf.i++;
    if (lauf.i < lauf.ziele.length) { aufgabe(); return; }
    $("uebung-balken").style.width = "100%";
    $("wahl").hidden = true; $("frage").innerHTML = ""; $("rueck").textContent = "";
    $("uebung-ende").hidden = false;
    $("uebung-ende").innerHTML = `<div class="gross">⭐</div><p>${lauf.richtig} von ${lauf.ziele.length} gleich beim ersten Mal richtig.</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <button class="knopf haupt" id="nochmal">🔁 Noch eine Runde</button><button class="knopf" id="zum-start">🔤 Übersicht</button></div>`;
    $("nochmal").onclick = () => runde(lauf.modus);
    $("zum-start").onclick = start;
    sprich(lauf.richtig >= lauf.ziele.length - 2 ? "Super gemacht!" : "Gut gemacht!");
  }

  window.__lesen = {
    ansicht: () => ansicht, runde, antworte, tafel, detail,
    richtigIndex: () => lauf ? lauf.richtig_i : -1, aufgabeNr: () => lauf ? lauf.i : -1, anzahl: () => lauf ? lauf.ziele.length : 0,
    ziel: () => lauf && lauf.ziele[lauf.i], stand: () => daten(),
    texte, text, textAntworte, textRichtig: () => tlauf ? tlauf.optionen.findIndex(o => o.richtig) : -1, textFrageNr: () => tlauf ? tlauf.f : -1,
    silbenWoerter: () => SILBENWOERTER.length
  };
  start();
})();
