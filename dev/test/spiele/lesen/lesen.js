// „Laute und Buchstaben“ (NA-30): Anlaute hören, Buchstaben den Lauten zuordnen – ohne Lesepflicht, alles mit Bild und Vorlesen.
// Buchstaben-Tafel (ansehen und anhören), „Gleicher Anfang“ (Vorschule), „Finde das Bild“ und „Welcher Buchstabe?“ (Kl. 1).
// Daten: profil.daten.lesen = { b: { <Buchstabe>: richtig-Anzahl } }; Fehler kommen in die Lernkartei (Fach „lesen“).
// Test-Haken: window.__lesen (ansicht, runde(modus), antworte(i), richtigIndex, aufgabeNr, stand, tafel, detail(b)).
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
  const daten = () => Object.assign({ b: {} }, S.lade("lesen") || {});

  function sprich(text, fertig) { if (SP) SP.sprich(text, "de-DE", fertig); else if (fertig) fertig(); }
  let ansicht = "start";
  function zeige(n) { ansicht = n; ["start", "tafel", "uebung"].forEach(v => $(v + "-ansicht").hidden = v !== n); scrollTo(0, 0); if (SP) SP.stopp(); }
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
  const TITEL = { gleich: "👂 Gleicher Anfang", bild: "🖼️ Finde das Bild", buchstabe: "🅰️ Welcher Buchstabe?" };
  function moeglich(modus, wortId) {
    const b = buchstabeVon[wortId]; if (!b) return false;
    if (modus === "gleich") return (HOERBAR.find(x => x.b === b) || { w: [] }).w.length >= 2;
    return true;
  }
  function runde(modus) {
    // Erst fällige Karten aus der Lernkartei (höchstens 3), dann neue Wörter – bevorzugt Buchstaben, die noch nicht sicher sind
    const karten = LK ? LK.faellige("lesen", 3).filter(k => moeglich(modus, k.wort)) : [];
    const b = daten().b;
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
    const schritt = { typ: "anlaut", wort: z.wort, ziel: z.ziel };
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
    ziel: () => lauf && lauf.ziele[lauf.i], stand: () => daten()
  };
  start();
})();
