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

  // NA-50: Antworten beim ersten Versuch je Lernziel melden
  const LZ = { gleich: ["de.le.01"], bild: ["de.le.02"], buchstabe: ["de.le.02", "de.su.02"], silben: ["de.le.03"], legen: ["de.sc.03", "de.sc.05"], spuren: ["de.sc.02"] };
  const kn = (lz, r) => { if (window.Koennen) Koennen.melde(lz, r); };
  function sprich(text, fertig) { if (SP) SP.sprich(text, "de-DE", fertig); else if (fertig) fertig(); }
  let ansicht = "start";
  function zeige(n) { ansicht = n; ["start", "tafel", "uebung", "texte", "text", "spuren", "legen"].forEach(v => $(v + "-ansicht").hidden = v !== n); scrollTo(0, 0); if (SP) SP.stopp(); }
  document.querySelectorAll(".zurueck").forEach(b => b.addEventListener("click", () => start()));

  // ---------- Start ----------
  function start() {
    zeige("start");
    $("fipsi-start").innerHTML = window.Figuren ? Figuren.fipsi() : "🦊";
    const vs = (S.stufe() || {}).code === "vs";
    const text = vs ? "Hör genau hin! Welche Wörter fangen gleich an? Fang mit „Gleicher Anfang“ an."
      : "Jedes Wort fängt mit einem Laut an. Hör genau hin und finde den Buchstaben!";
    // NA-50: Fipsi empfiehlt den Weg, der gerade am besten passt (Zielzone), sobald schon etwas geübt wurde
    document.querySelectorAll(".weg.tipp").forEach(b => b.classList.remove("tipp"));
    let tipp = "";
    if (window.Koennen) {
      const d = Koennen.daten(), wege = [["gleich", "weg-gleich", "Gleicher Anfang"], ["bild", "weg-bild", "Finde das Bild"], ["buchstabe", "weg-buchstabe", "Welcher Buchstabe?"],
        ["silben", "weg-silben", "Silben lesen"], ["legen", "weg-legen", "Wörter legen"]].filter(w => !vs || ["gleich", "bild"].includes(w[0]));
      if (wege.some(w => LZ[w[0]].some(z => d[z]))) {
        const w = Koennen.naechste(wege.map(x => ({ id: x[1], name: x[2], lz: LZ[x[0]] })), 1)[0];
        if (w) { $(w.id).classList.add("tipp"); tipp = ` Heute passt gut: „${w.name}“.`; }
      }
    }
    $("start-blase").textContent = text + tipp;
    $("start-ton").onclick = () => sprich(text + tipp);
    const kann = Object.values(daten().b).filter(n => n >= 2).length;
    $("stand").textContent = `Du kennst schon ${kann} von ${HOERBAR.length} Buchstaben und Lauten.`;
  }
  $("weg-tafel").addEventListener("click", tafel);
  $("weg-gleich").addEventListener("click", () => runde("gleich"));
  $("weg-bild").addEventListener("click", () => runde("bild"));
  $("weg-buchstabe").addEventListener("click", () => runde("buchstabe"));
  $("weg-silben").addEventListener("click", () => runde("silben"));
  $("weg-texte").addEventListener("click", texte);
  $("weg-spuren").addEventListener("click", () => spurenRunde());
  $("weg-sas").addEventListener("click", () => spurenRunde("sas"));
  // Schreibschrift nur, wenn die Eltern sie nicht ausgeschaltet haben (Schule nutzt eine andere Schrift): eltern.deutsch.schrift = "sas" | "aus"
  $("weg-sas").hidden = !window.SCHREIBSCHRIFT || (((S.lade("eltern") || {}).deutsch || {}).schrift === "aus");
  $("weg-legen").addEventListener("click", () => legenRunde());

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
      if (lauf.versuche === 0) { if (LK) LK.falsch("lesen", schritt); kn(LZ[lauf.modus], false); }
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
      lauf.richtig++; kn(LZ[lauf.modus], true);
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
      if (lauf.versuche === 0) { if (LK) LK.falsch("lesen", schritt); kn(LZ.silben, false); }
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
      lauf.richtig++; kn(LZ.silben, true);
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
    const tlz = tlauf.t.lz.filter(z => z.startsWith("de."));
    if (!o.richtig) { if (!tlauf.versuche) kn(tlz, false); tlauf.versuche++; b.classList.add("falsch"); $("text-rueck").textContent = "Lies nochmal im Text nach."; if (S.ton) S.ton("tipp"); return; }
    b.classList.add("richtig");
    $("text-rueck").textContent = LOB[Math.floor(Math.random() * LOB.length)];
    if (S.ton) S.ton("juhu");
    if (tlauf.versuche === 0) { tlauf.richtig++; kn(tlz, true); if (C) C.gib("deutsch", 1); }
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

  // ---------- Nachspuren (NA-35) ----------
  // Jeder Strich wird in Prüfpunkte zerlegt; der Finger muss sie der Reihe nach berühren (großzügige Toleranz, keine Schönheitsnote).
  const SCHRIFT = window.SCHRIFT || {};
  const NS = "http://www.w3.org/2000/svg";
  const REIHE = "MAOILESRTNUHDFBKGWPZJCVQXYÄÖÜ".split("");   // grobe Fibel-Reihenfolge
  const TOLERANZ = 13, ABSTAND = 6;
  function strichPunkte(st) {
    const p = [];
    st.forEach(s => {
      if (s[0] === "L") { const [, a, b, x, y] = s, n = Math.max(2, Math.ceil(Math.hypot(x - a, y - b) / 2)); for (let i = 0; i <= n; i++) p.push([a + (x - a) * i / n, b + (y - b) * i / n]); }
      else if (s[0] === "B") { const [, cx, cy, rx, ry, w0, w1] = s, n = Math.max(4, Math.ceil(Math.abs(w1 - w0) / 5)); for (let i = 0; i <= n; i++) { const w = (w0 + (w1 - w0) * i / n) * Math.PI / 180; p.push([cx + rx * Math.cos(w), cy + ry * Math.sin(w)]); } }
      else p.push([s[1], s[2]]);
    });
    return p;
  }
  function pruefpunkte(p) {
    if (p.length === 1) return p.slice();
    const out = [p[0]]; let weg = 0;
    for (let i = 1; i < p.length; i++) { weg += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); if (weg >= ABSTAND) { out.push(p[i]); weg = 0; } }
    const l = p[p.length - 1]; if (out[out.length - 1] !== l) out.push(l);
    return out;
  }
  let spur = null;
  const SAS = window.SCHREIBSCHRIFT;
  // Schreibschrift (Schulausgangsschrift): drei noch wenig geübte Kleinbuchstaben, dann ein Wort aus schon geübten Buchstaben
  function sasRunde() {
    const sas = daten().sas || {}, reihe = SAS.reihe;
    const wahl = reihe.slice().sort((x, y) => Math.min(2, sas[x] || 0) - Math.min(2, sas[y] || 0) || reihe.indexOf(x) - reihe.indexOf(y)).slice(0, 3);
    const kann = (z) => (sas[z] || 0) > 0 || wahl.includes(z);
    const passend = SAS.woerter.filter(w => [...w].every(kann)), wort = passend.length ? passend[Math.floor(Math.random() * passend.length)] : SAS.woerter[0];
    spur = { zeichen: wahl.concat([wort]), i: 0, fertig: 0, modus: "sas" };
    zeige("spuren"); $("spuren-ende").hidden = true; $("spuren").style.display = "";
    spurZeichen();
  }
  function spurenRunde(modus) {
    if (modus === "sas" && SAS) return sasRunde();
    const sp = daten().sp || {};
    const wahl = REIHE.filter(b => SCHRIFT[b]).sort((x, y) => Math.min(2, sp[x] || 0) - Math.min(2, sp[y] || 0) || REIHE.indexOf(x) - REIHE.indexOf(y)).slice(0, 3);
    const zeichen = [];
    wahl.forEach(b => { zeichen.push(b); if (SCHRIFT[b.toLowerCase()]) zeichen.push(b.toLowerCase()); });
    spur = { zeichen, i: 0, fertig: 0, modus: "druck" };
    zeige("spuren"); $("spuren-ende").hidden = true; $("spuren").style.display = "";
    spurZeichen();
  }
  function spurZeichen() {
    const z = spur.zeichen[spur.i];
    $("spuren-titel").textContent = spur.modus === "sas" ? "✒️ Schreibschrift" : "✍️ Nachspuren";
    if (spur.modus === "sas") {
      const r = SAS.baue(z), wort = z.length > 1;
      spur.striche = r.striche.map(p => ({ p, cp: pruefpunkte(p), k: 0 })); spur.s = 0;
      const rand = Math.max(0, (100 - r.breite) / 2);   // einzelne Buchstaben mittig, Wörter so breit wie nötig
      spur.vb = [r.links - rand, Math.max(100, r.breite)];
      $("spuren").setAttribute("viewBox", `${spur.vb[0]} -5 ${spur.vb[1]} 130`);
      $("spuren").style.width = wort ? `min(94vw, 980px, calc((100vh - 230px) * ${(spur.vb[1] / 130).toFixed(2)}))` : "";   // ganzes Wort passt auf den Bildschirm $("spuren").classList.toggle("breit", wort); $("spuren").parentElement.classList.toggle("breit-main", wort);
      $("spuren-bild").textContent = wort ? "📝" : "✒️";
      $("spuren-wort").textContent = wort ? `Wort: ${z}` : `kleines ${z}`;
      $("spuren-balken").style.width = Math.round(100 * spur.i / spur.zeichen.length) + "%";
      $("spuren-rueck").textContent = "";
      spurZeichnen();
      sprich(wort ? `Schreib das Wort ${z} in Schreibschrift. Fang beim Punkt an und schreib ohne abzusetzen.` : `Schreib das kleine ${z} in Schreibschrift. Fang beim Punkt an.`);
      return;
    }
    spur.vb = [0, 100]; $("spuren").setAttribute("viewBox", "0 -10 100 130"); $("spuren").classList.remove("breit"); $("spuren").style.width = ""; $("spuren").parentElement.classList.remove("breit-main");
    spur.striche = SCHRIFT[z].map(st => { const p = strichPunkte(st); return { p, cp: pruefpunkte(p), k: 0 }; });
    spur.s = 0;
    const gross = z.toUpperCase(), a = A.find(x => x.b === gross || x.b === gross[0]), w = a ? wort(a.w[0]) : null;
    $("spuren-bild").textContent = w ? w.bild : "";
    $("spuren-wort").textContent = w ? `${z} wie ${w.de}` : z;
    $("spuren-balken").style.width = Math.round(100 * spur.i / spur.zeichen.length) + "%";
    $("spuren-rueck").textContent = "";
    spurZeichnen();
    sprich(w ? `${z.toUpperCase() === z ? "Großes" : "Kleines"} ${gross} wie ${w.de}. Fang beim Punkt an.` : "Fang beim Punkt an.");
  }
  const linie = (p) => p.map(q => q[0].toFixed(1) + "," + q[1].toFixed(1)).join(" ");
  function spurZeichnen() {
    const svg = $("spuren"); let h = "";
    const [x0, b] = spur.vb || [0, 100], x1 = x0 + b;
    if (spur.modus === "sas") h += `<line x1="${x0 + 2}" y1="10" x2="${x1 - 2}" y2="10" stroke="#EEF3F9" stroke-width="1"/><line x1="${x0 + 2}" y1="115" x2="${x1 - 2}" y2="115" stroke="#EEF3F9" stroke-width="1"/>`;
    h += `<line x1="${x0 + 2}" y1="45" x2="${x1 - 2}" y2="45" stroke="#D9E8F5" stroke-width="1" stroke-dasharray="3 3"/><line x1="${x0 + 2}" y1="90" x2="${x1 - 2}" y2="90" stroke="#9CC9EA" stroke-width="1.5"/>`;
    spur.striche.forEach(st => { h += st.p.length === 1 ? `<circle cx="${st.p[0][0]}" cy="${st.p[0][1]}" r="5" fill="#E6E1F0"/>` : `<polyline points="${linie(st.p)}" fill="none" stroke="#E6E1F0" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>`; });
    spur.striche.forEach((st, i) => {
      if (i < spur.s) h += st.p.length === 1 ? `<circle cx="${st.p[0][0]}" cy="${st.p[0][1]}" r="4.5" fill="#2E9C5A"/>` : `<polyline points="${linie(st.p)}" fill="none" stroke="#2E9C5A" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
    });
    const st = spur.striche[spur.s];
    if (st) {
      if (st.p.length > 1) h += `<polyline points="${linie(st.p)}" fill="none" stroke="#7B55B8" stroke-width="2" stroke-dasharray="3 4" stroke-linecap="round"/>`;
      if (st.k > 0 && st.p.length > 1) h += `<polyline id="spur-gruen" points="${linie(st.cp.slice(0, st.k))}" fill="none" stroke="#2E9C5A" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
      const [x, y] = st.cp[Math.min(st.k, st.cp.length - 1)];
      if (st.k === 0 && st.cp.length > 1) {   // Pfeil in Schreibrichtung
        const [x2, y2] = st.cp[Math.min(2, st.cp.length - 1)], w = Math.atan2(y2 - y, x2 - x);
        h += `<path d="M${x + Math.cos(w) * 9} ${y + Math.sin(w) * 9} l${Math.cos(w + 2.5) * 5} ${Math.sin(w + 2.5) * 5} M${x + Math.cos(w) * 9} ${y + Math.sin(w) * 9} l${Math.cos(w - 2.5) * 5} ${Math.sin(w - 2.5) * 5}" stroke="#E8463B" stroke-width="2" stroke-linecap="round"/>`;
      }
      h += `<circle cx="${x}" cy="${y}" r="5.5" fill="#E8463B" class="startpunkt"><animate attributeName="r" values="5.5;7;5.5" dur="1.2s" repeatCount="indefinite"/></circle>`;
      h += `<text x="${x}" y="${y + 2.2}" font-size="6" text-anchor="middle" fill="#fff" font-weight="700">${spur.s + 1}</text>`;
    }
    svg.innerHTML = h;
  }
  function spurPunkt(e) {
    const svg = $("spuren"), m = svg.getScreenCTM(); if (!m) return null;
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const q = pt.matrixTransform(m.inverse()); return [q.x, q.y];
  }
  function spurBewegung(p) {
    const st = spur && spur.striche[spur.s]; if (!st || !p) return;
    const nah = (i) => i < st.cp.length && Math.hypot(p[0] - st.cp[i][0], p[1] - st.cp[i][1]) < TOLERANZ;
    let weiter = false;
    while (nah(st.k) || (st.k > 0 && nah(st.k + 1))) { st.k += nah(st.k) ? 1 : 2; weiter = true; }
    if (!weiter) return;
    if (st.k >= st.cp.length) {
      spur.s++; if (S.ton) S.ton("tipp");
      if (spur.s >= spur.striche.length) return spurFertig();
    }
    spurZeichnen();
  }
  let malt = false;
  $("spuren").addEventListener("pointerdown", (e) => { malt = true; try { $("spuren").setPointerCapture(e.pointerId); } catch (x) { /* egal */ } spurBewegung(spurPunkt(e)); e.preventDefault(); });
  $("spuren").addEventListener("pointermove", (e) => { if (malt) spurBewegung(spurPunkt(e)); });
  ["pointerup", "pointercancel"].forEach(t => $("spuren").addEventListener(t, () => { malt = false; }));
  function spurFertig() {
    spurZeichnen();
    const z = spur.zeichen[spur.i];
    const d = daten();
    if (spur.modus === "sas") { d.sas = d.sas || {}; [...new Set(z)].forEach(c => { d.sas[c] = Math.min(9, (d.sas[c] || 0) + 1); }); }
    else { d.sp = d.sp || {}; d.sp[z.toUpperCase()] = Math.min(9, (d.sp[z.toUpperCase()] || 0) + (z === z.toLowerCase() ? 1 : 0)); }
    S.speichere("lesen", d);
    spur.fertig++; kn(LZ.spuren, true);
    if (C) C.gib("deutsch", 1);
    const lob = LOB[Math.floor(Math.random() * LOB.length)];
    $("spuren-rueck").textContent = spur.modus === "sas" ? `${lob} ${z.length > 1 ? "Ein schön verbundenes Wort!" : "Das ist ein " + z + "."}` : `${lob} Das ist ${z}.`;
    if (S.ton) S.ton("juhu");
    sprich(lob);
    setTimeout(spurNaechstes, 1000);
  }
  function spurNaechstes() {
    spur.i++;
    if (spur.i < spur.zeichen.length) { spurZeichen(); return; }
    $("spuren-balken").style.width = "100%";
    const b = spur.modus === "sas" ? spur.zeichen.join(", ") : spur.zeichen.filter(z => z === z.toUpperCase()).join(", ");
    if (window.Lernfunde) Lernfunde.merke({ fach: "deutsch", art: "schreiben", e: spur.modus === "sas" ? "✒️" : "✍️", text: `${spur.modus === "sas" ? "In Schreibschrift geschrieben" : "Geschrieben"}: ${b}`, schluessel: (spur.modus === "sas" ? "sas:" : "spur:") + b });
    $("spuren").style.display = "none"; $("spuren-rueck").textContent = "";
    $("spuren-ende").hidden = false;
    $("spuren-ende").innerHTML = `<div class="gross">✍️</div><p>Du hast ${spur.fertig} Buchstaben geschrieben: ${spur.zeichen.join(" ")}</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap"><button class="knopf haupt" id="spuren-mehr">🔁 Noch mehr</button><button class="knopf" id="spuren-start">🔤 Übersicht</button></div>`;
    const modus = spur.modus; $("spuren-mehr").onclick = () => spurenRunde(modus); $("spuren-start").onclick = start;
  }
  $("spuren-nochmal").addEventListener("click", () => { if (spur) spurZeichen(); });
  $("spuren-weiter").addEventListener("click", () => { if (spur && spur.i < spur.zeichen.length) spurNaechstes(); });

  // ---------- Wörter legen (NA-35) ----------
  // Lautgetreue Bildwörter (jeder Laut ein Buchstabe): keine Doppelkonsonanten, kein ie/ch/ck/tz/ß/Dehnungs-h, 3–6 Buchstaben
  const LEGEWOERTER = W.alle().filter(w => w.wortart === "nomen" && w.stufe.includes("1") && /^[A-Za-zÄÖÜäöü]{3,6}$/.test(w.de)
    && !/(ie|ch|ck|tz|qu|ph|eu|äu|[aeiouäöü]h|([a-z])\2)/i.test(w.de) && !/[vxyß]/i.test(w.de))
    .filter((w, i, l) => l.findIndex(x => x.bild === w.bild) === i);
  let leg = null;
  function legenRunde() {
    const sw = daten().sw || {};
    const karten = LK ? LK.faellige("lesen", 2).filter(k => k.typ === "schreibwort" && LEGEWOERTER.some(w => w.id === k.wort)) : [];
    const rest = mische(LEGEWOERTER.filter(w => !karten.some(k => k.wort === w.id))).sort((x, y) => Math.min(2, sw[x.id] || 0) - Math.min(2, sw[y.id] || 0) || x.de.length - y.de.length);
    leg = { ziele: karten.concat(rest.slice(0, 8 - karten.length).map(w => ({ typ: "schreibwort", wort: w.id }))), i: 0, richtig: 0 };
    zeige("legen"); $("legen-ende").hidden = true;
    legAufgabe();
  }
  function legAufgabe() {
    const z = leg.ziele[leg.i], w = wort(z.wort);
    leg.pos = 0; leg.fehler = 0;
    const buchst = w.de.split("");
    const ablenker = mische("aeimnorstlu".split("").filter(b => !w.de.toLowerCase().includes(b))).slice(0, 3);
    leg.steine = mische(buchst.concat(ablenker).map((b, i) => ({ b, id: i })));
    $("legen-bild").textContent = w.bild;
    $("legen-faecher").innerHTML = buchst.map(() => `<span class="fach"></span>`).join("");
    $("legen-steine").innerHTML = leg.steine.map((s, i) => `<button class="stein" data-i="${i}">${esc(s.b)}</button>`).join("");
    $("legen-steine").querySelectorAll(".stein").forEach(b => b.addEventListener("click", () => legTippe(+b.dataset.i)));
    $("legen-rueck").textContent = "";
    $("legen-balken").style.width = Math.round(100 * leg.i / leg.ziele.length) + "%";
    $("legen-ton").onclick = () => sprich(w.de);
    setTimeout(() => sprich(w.de), 250);
  }
  function legTippe(i) {
    if (!leg || !$("legen-ende").hidden) return;
    const z = leg.ziele[leg.i], w = wort(z.wort), s = leg.steine[i], k = $("legen-steine").querySelector(`[data-i="${i}"]`);
    if (!s || k.classList.contains("weg")) return;
    if (s.b !== w.de[leg.pos]) {
      if (leg.fehler === 0) { if (LK) LK.falsch("lesen", { typ: "schreibwort", wort: z.wort }); kn(LZ.legen, false); }
      leg.fehler++; k.classList.remove("wackel"); void k.offsetWidth; k.classList.add("wackel"); setTimeout(() => k.classList.remove("wackel"), 450);
      $("legen-rueck").textContent = leg.pos === 0 && s.b.toLowerCase() === w.de[0].toLowerCase() ? "Nomen schreibt man am Anfang groß!" : "Hör nochmal genau hin.";
      if (S.ton) S.ton("tipp"); sprich(w.de); return;
    }
    k.classList.add("weg");
    const fach = $("legen-faecher").children[leg.pos]; fach.textContent = s.b; fach.classList.add("voll");
    leg.pos++;
    if (leg.pos < w.de.length) return;
    const lob = LOB[Math.floor(Math.random() * LOB.length)];
    $("legen-rueck").textContent = `${lob} ${W.mitArtikel(w)}`;
    if (S.ton) S.ton("juhu");
    if (leg.fehler === 0) {
      leg.richtig++; kn(LZ.legen, true);
      if (C) C.gib("deutsch", 1);
      const d = daten(); d.sw = d.sw || {}; d.sw[z.wort] = Math.min(9, (d.sw[z.wort] || 0) + 1); S.speichere("lesen", d);
      if (z.__karte && LK && LK.richtig("lesen", { typ: "schreibwort", wort: z.wort }) && window.Lernfunde)
        Lernfunde.merke({ fach: "deutsch", art: "gemeistert", e: "🧩", text: `Gemeistert: ${w.de} geschrieben`, schluessel: "legen:" + z.wort });
    }
    sprich(`${lob} ${w.de}.`);
    setTimeout(() => {
      leg.i++;
      if (leg.i < leg.ziele.length) { legAufgabe(); return; }
      $("legen-balken").style.width = "100%";
      $("legen-faecher").innerHTML = ""; $("legen-steine").innerHTML = ""; $("legen-rueck").textContent = ""; $("legen-bild").textContent = "";
      $("legen-ende").hidden = false;
      $("legen-ende").innerHTML = `<div class="gross">🧩</div><p>${leg.richtig} von ${leg.ziele.length} Wörtern ohne Fehler gelegt.</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap"><button class="knopf haupt" id="legen-mehr">🔁 Noch eine Runde</button><button class="knopf" id="legen-start">🔤 Übersicht</button></div>`;
      $("legen-mehr").onclick = legenRunde; $("legen-start").onclick = start;
    }, 1200);
  }

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
    silbenWoerter: () => SILBENWOERTER.length,
    spurenRunde, spurZeichen: () => spur && spur.zeichen[spur.i], spurNr: () => spur ? spur.i : -1, spurStrich: () => spur ? spur.s : -1, spurStriche: () => spur ? spur.striche.length : 0,
    // Prüfpunkte des aktuellen Strichs in Bildschirm-Koordinaten (für den Test: Finger entlangführen)
    spurPunkte: () => { const st = spur && spur.striche[spur.s]; if (!st) return []; const svg = $("spuren"), m = svg.getScreenCTM();
      return st.cp.map(([x, y]) => { const pt = svg.createSVGPoint(); pt.x = x; pt.y = y; const q = pt.matrixTransform(m); return [q.x, q.y]; }); },
    legenRunde, legeWoerter: () => LEGEWOERTER.map(w => w.de), legenZiel: () => leg && wort(leg.ziele[leg.i].wort).de, legenNr: () => leg ? leg.i : -1,
    legenStein: (b) => leg ? leg.steine.findIndex((s, i) => s.b === b && !$("legen-steine").querySelector(`[data-i="${i}"]`).classList.contains("weg")) : -1
  };
  start();
})();
