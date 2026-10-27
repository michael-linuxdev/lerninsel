// „Ankommen“ (DaZ D0, NA-40): erste deutsche Wörter und Sätze mit Bild, Ton und Artikel-Zeichen – ohne Lesepflicht.
// Wörter ansehen (nach Wortfeldern), Hören und zeigen (10 Aufgaben), Sätze für jeden Tag (8 Aufgaben).
// Test-Haken: window.__daz (ansicht, woerter, saetze, runde, antworte(i), richtigIndex, stand).
(function () {
  const S = window.Spielwelt, W = window.Wortschatz, SP = window.Sprache, D = window.DaZ, C = window.Charakter;
  const $ = (id) => document.getElementById(id);
  const mische = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const LOB = ["Richtig!", "Super!", "Genau!", "Toll!", "Prima!"];
  const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const name = () => S.profil.name || "";

  const WOERTER = W.daz("d0"), SAETZE = W.saetze("d0");
  const FELDER = [
    ["sprechen", "Hallo und danke", "👋"], ["schule", "Schule", "🏫"], ["zahlen", "Zahlen", "🔢"], ["farben", "Farben", "🎨"],
    ["koerper", "Mein Körper", "✋"], ["gefuehle", "Wie geht es mir?", "😊"], ["essen", "Essen und Trinken", "🍎"], ["familie", "Familie", "👨‍👩‍👧"],
    ["kleidung", "Kleidung", "👕"], ["zuhause", "Zuhause", "🏠"], ["draussen", "Draußen", "🚦"]
  ];
  const DRAUSSEN = ["verkehr", "spiel", "wetter", "natur"];
  const imFeld = (f) => WOERTER.filter(w => f === "draussen" ? w.themen.some(t => DRAUSSEN.includes(t)) && !w.themen.some(t => ["zuhause", "schule", "kleidung", "essen"].includes(t)) : w.themen.includes(f));

  // ---------- Vorlesen ----------
  const sprechbar = (w) => w.wortart === "nomen" ? W.mitArtikel(w) : w.de;
  function sprich(text) { if (SP) SP.sprich(text, "de-DE"); }
  function sprichHilfe(h) { if (SP && h && h.sprache && h.sprache.tts) SP.sprich(h.text, h.sprache.tts); }
  const hilfeHtml = (h) => h ? `<span class="hilfe${h.entwurf ? " entwurf" : ""}" lang="${h.sprache.code}"${h.sprache.rtl ? ' dir="rtl"' : ""}>${esc(h.text)}</span>` : "";
  const artikel = (a) => { const A = W.ARTIKEL[a]; return A ? `<span class="art" style="background:${A.farbe}"><i aria-hidden="true">${A.form}</i>${A.name}</span>` : ""; };

  // ---------- Ansichten ----------
  let ansicht = "start";
  function zeige(n) { ansicht = n; ["start", "felder", "karte", "uebung"].forEach(v => $(v + "-ansicht").hidden = v !== n); scrollTo(0, 0); if (SP) SP.stopp(); }
  document.querySelectorAll(".zurueck").forEach(b => b.addEventListener("click", () => start()));

  const BEGRUESSUNG = { de: "Willkommen, {name}! Hier lernst du deine ersten deutschen Wörter. Tippe auf ein Bild.",
    ru: "Добро пожаловать, {name}! Здесь ты выучишь свои первые немецкие слова. Нажми на картинку.",
    uk: "Ласкаво просимо, {name}! Тут ти вивчиш свої перші німецькі слова. Натисни на картинку.",
    status: { ru: "entwurf", uk: "entwurf" } };
  function start() {
    zeige("start");
    $("fipsi-start").innerHTML = window.Figuren ? Figuren.fipsi() : "🦊";
    const de = BEGRUESSUNG.de.replace("{name}", name()).replace(/, !/, "!");
    const h = W.hilfe(BEGRUESSUNG);
    $("start-blase").innerHTML = esc(de) + hilfeHtml(h);
    $("start-ton").onclick = () => { sprich(de); };
    const st = D.stand();
    $("stand").textContent = D.d0Fertig()
      ? `Geschafft! ${st.woerter} von ${WOERTER.length} Wörtern und ${st.saetze} von ${SAETZE.length} Sätzen. Du kannst weiter zu Fipsis Abenteuer.`
      : `Du kennst schon ${st.woerter} von ${WOERTER.length} Wörtern und ${st.saetze} von ${SAETZE.length} Sätzen.`;
    $("stand-balken").style.width = Math.min(100, Math.round(100 * (st.woerter + st.saetze) / (WOERTER.length + SAETZE.length))) + "%";
  }
  $("weg-woerter").addEventListener("click", felder);
  $("weg-hoeren").addEventListener("click", () => runde("hoeren"));
  $("weg-saetze").addEventListener("click", () => runde("saetze"));

  // ---------- Wörter ansehen ----------
  function felder() {
    zeige("felder");
    const st = D.stand().w;
    $("felder").innerHTML = FELDER.map(([id, n, e]) => {
      const l = imFeld(id); if (!l.length) return "";
      return `<button class="feld" data-feld="${id}"><span class="emoji">${e}</span>${n}<small>${l.filter(w => st[w.id]).length} / ${l.length}</small></button>`;
    }).join("");
    $("felder").querySelectorAll(".feld").forEach(b => b.addEventListener("click", () => karten(b.dataset.feld)));
  }
  let liste = [], pos = 0, feldId = "";
  function karten(f) { feldId = f; liste = imFeld(f); pos = 0; zeige("karte"); $("karte-titel").textContent = FELDER.find(x => x[0] === f).slice(2)[0] + " " + FELDER.find(x => x[0] === f)[1]; karte(); }
  function karte() {
    const w = liste[pos];
    const mz = w.mehrzahl ? `<div class="mehrzahl">${artikel("die")} ${esc(w.mehrzahl)} <span class="silben">(viele)</span></div>` : "";
    $("karte").innerHTML = `<div class="bild" aria-hidden="true">${w.bild}</div>
      <div class="wort">${artikel(w.artikel)}<span>${esc(w.de)}</span><button class="ton" id="wort-ton" aria-label="Vorlesen">🔊</button></div>
      <div class="silben" aria-label="Silben">${w.silben.map(s => `<b>${esc(s)}</b>`).join("")}</div>${mz}${hilfeHtml(W.hilfe(w))}`;
    $("wort-ton").onclick = () => sprich(sprechbar(w) + (w.mehrzahl ? ". Viele: die " + w.mehrzahl : ""));
    const h = $("karte").querySelector(".hilfe"); if (h) h.onclick = () => sprichHilfe(W.hilfe(w));
    $("karte-nr").textContent = `${pos + 1} / ${liste.length}`;
    $("karte-vor").disabled = pos === 0;
    sprich(sprechbar(w));
  }
  $("karte-vor").addEventListener("click", () => { if (pos > 0) { pos--; karte(); } });
  $("karte-nach").addEventListener("click", () => { if (pos < liste.length - 1) { pos++; karte(); } else felder(); });
  $("karte-zurueck").addEventListener("click", felder);

  // ---------- Übungen ----------
  // Bevorzugt Wörter/Sätze, die noch nicht sicher sind; Ablenker mit anderem Bild, möglichst aus demselben Feld.
  let lauf = null;
  function auswahl(pool, gekannt, n) {
    const neu = mische(pool.filter(x => !gekannt[x.id])), alt = mische(pool.filter(x => gekannt[x.id]));
    return neu.concat(alt).slice(0, n);
  }
  function ablenker(ziel, pool) {
    const gleich = pool.filter(x => x.id !== ziel.id && x.bild !== ziel.bild && x.themen && ziel.themen && x.themen.some(t => ziel.themen.includes(t)));
    const rest = pool.filter(x => x.id !== ziel.id && x.bild !== ziel.bild && !gleich.includes(x));
    const l = mische(gleich).concat(mische(rest)), raus = [];
    l.forEach(x => { if (raus.length < 2 && !raus.some(r => r.bild === x.bild)) raus.push(x); });
    return raus;
  }
  function runde(art) {
    const st = D.stand();
    const ziele = art === "hoeren"
      ? auswahl(WOERTER.filter(w => w.wortart !== "wort"), st.w, 10)   // Grüße/ja/nein lernt man in den Sätzen
      : auswahl(SAETZE, st.s, 8);
    // Ohne Gerätestimme kann man nicht hören → dann steht das gesuchte Wort in der Frage (nie eine falsche Sprache vorlesen)
    lauf = { art, ziele, i: 0, richtig: 0, versuche: 0, zeigeWort: !(SP && SP.verfuegbar()) };
    zeige("uebung");
    $("uebung-titel").textContent = art === "hoeren" ? "👂 Hören und zeigen" : "💬 Sätze für jeden Tag";
    $("uebung-ende").hidden = true;
    aufgabe();
  }
  function aufgabe() {
    const z = lauf.ziele[lauf.i];
    lauf.versuche = 0;
    $("uebung-balken").style.width = Math.round(100 * lauf.i / lauf.ziele.length) + "%";
    $("rueck").textContent = "";
    const pool = lauf.art === "hoeren" ? WOERTER.filter(w => w.wortart !== "wort") : SAETZE;
    lauf.optionen = mische([z].concat(ablenker(z, pool)));
    const text = lauf.art === "hoeren" ? sprechbar(z) : z.de.replace("{name}", name());
    lauf.text = text;
    const h = lauf.art === "saetze" ? W.hilfe(z) : null;
    $("frage").innerHTML = `<button class="ton" id="frage-ton" aria-label="Nochmal hören">🔊</button>` +
      (lauf.art === "saetze" ? `<span><span class="satz-text">${esc(text)}</span>${hilfeHtml(h)}</span>`
        : lauf.zeigeWort ? `<span>Wo ist <span class="satz-text">${esc(text)}</span>?</span>` : `<span>Wo ist das? Hör genau hin.</span>`);
    $("frage-ton").onclick = () => sprich(text);
    $("wahl").innerHTML = lauf.optionen.map((o, i) => `<button data-i="${i}" aria-label="Bild ${i + 1}">${o.bild}</button>`).join("");
    $("wahl").querySelectorAll("button").forEach(b => b.addEventListener("click", () => antworte(+b.dataset.i)));
    $("wahl").hidden = false;
    setTimeout(() => sprich(text), 250);
  }
  function antworte(i) {
    if (!lauf || $("uebung-ende").hidden === false) return;
    const z = lauf.ziele[lauf.i], o = lauf.optionen[i], b = $("wahl").querySelector(`[data-i="${i}"]`);
    if (!o || b.classList.contains("falsch") || b.classList.contains("richtig")) return;
    if (o.id !== z.id) {
      lauf.versuche++; b.classList.add("falsch"); $("rueck").textContent = "Hör nochmal hin.";
      if (S.ton) S.ton("tipp"); sprich(lauf.text); return;
    }
    b.classList.add("richtig");
    const lob = LOB[Math.floor(Math.random() * LOB.length)];
    $("rueck").textContent = `${lob} ${lauf.art === "hoeren" ? sprechbar(z) : ""}`.trim();
    if (S.ton) S.ton("juhu");
    if (lauf.versuche === 0) {
      lauf.richtig++;
      const neu = D.merke(lauf.art === "hoeren" ? "wort" : "satz", z.id);
      if (C) C.gib("deutsch", 1);   // zählt als Lernaufgabe (Zeit-Regel „Erst lernen“)
      if (neu && lauf.art === "hoeren" && window.Lernfunde) Lernfunde.merke({ fach: "deutsch", art: "wort", e: z.bild, text: `Neues Wort: ${sprechbar(z)}`, schluessel: "daz:" + z.id });
    }
    sprich(lob);
    setTimeout(weiter, 1100);
  }
  function weiter() {
    lauf.i++;
    if (lauf.i < lauf.ziele.length) { aufgabe(); return; }
    $("uebung-balken").style.width = "100%";
    $("wahl").hidden = true; $("frage").innerHTML = ""; $("rueck").textContent = "";
    const st = D.stand(), fertig = D.d0Fertig();
    $("uebung-ende").hidden = false;
    $("uebung-ende").innerHTML = `<div class="gross">${fertig ? "🏆" : "⭐"}</div>
      <p>${lauf.richtig} von ${lauf.ziele.length} gleich beim ersten Mal richtig.</p>
      <p>Du kennst jetzt ${st.woerter} Wörter und ${st.saetze} Sätze.${fertig ? " Ankommen ist geschafft!" : ""}</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <button class="knopf haupt" id="nochmal">🔁 Noch eine Runde</button><button class="knopf" id="zum-start">🧳 Ankommen</button></div>`;
    if (fertig && window.Lernfunde) Lernfunde.merke({ fach: "deutsch", art: "gemeistert", e: "🧳", text: "Ankommen geschafft: die ersten deutschen Wörter und Sätze", schluessel: "daz:d0" });
    $("nochmal").onclick = () => runde(lauf.art);
    $("zum-start").onclick = start;
    sprich(lauf.richtig >= lauf.ziele.length - 2 ? "Super gemacht!" : "Gut gemacht!");
  }

  window.__daz = {
    ansicht: () => ansicht, woerter: () => WOERTER.length, saetze: () => SAETZE.length,
    runde: (art) => runde(art), antworte, stand: () => D.stand(),
    richtigIndex: () => lauf ? lauf.optionen.findIndex(o => o.id === lauf.ziele[lauf.i].id) : -1,
    aufgabeNr: () => lauf ? lauf.i : -1, felder, karten: (f) => karten(f), karteWort: () => liste[pos] && liste[pos].id
  };
  start();
})();
