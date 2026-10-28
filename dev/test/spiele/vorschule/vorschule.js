// Vorschul-Rucksack (30.10.2026): Bilder-Aufgaben nach den Bildungsbereichen des Sächsischen Bildungsplans, ohne Lesen bedienbar.
// Jede Frage wird vorgelesen (🔊 wiederholt), Antworten sind große Bilder; „ordnen“ = Bilder der Reihe nach antippen.
// Fortschritt in vorschule.fertig[id] = Sterne (1–3); erster Versuch richtig zählt als Lernaufgabe („Erst lernen, dann spielen“).
(function () {
  const S = window.Spielwelt, SP = window.Sprache, B = window.VORSCHULE_BEREICHE || [], A = window.VORSCHULE || [];
  const $ = (id) => document.getElementById(id);
  const mische = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  // Bereich → Fähigkeit und Lernfund-Fach (vorhandene Fächer)
  const FACH = { mathe: "mathe", sprache: "deutsch", natur: "sachkunde", koerper: "sachkunde", sozial: "sachkunde", kunst: "kreativ", schule: "sachkunde" };
  const FUND = { mathe: "mathe", sprache: "deutsch", natur: "sachkunde", koerper: "sachkunde", sozial: "sachkunde", kunst: "kunst", schule: "sachkunde" };
  const LOB = ["Super!", "Toll gemacht!", "Prima!", "Richtig!"];
  const name = () => S.profil.name || "du";

  function daten() { return Object.assign({ fertig: {}, vorlesen: true }, S.lade("vorschule") || {}); }
  function speichere(d) { S.speichere("vorschule", d); }
  const sprich = (t, f) => { if (daten().vorlesen && t) SP.sprich(t.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, "").trim(), "de-DE", f); };

  function zeige(n) { ["liste", "aufgabe", "ende"].forEach(v => $(v + "-ansicht").hidden = v !== n); scrollTo(0, 0); }
  function zeichneListe() {
    const d = daten(), fertig = A.filter(a => d.fertig[a.id]).length;
    $("ton-vorlesen").textContent = d.vorlesen ? "🔊" : "🔇";
    $("intro-text").textContent = fertig ? `Toll, ${name()}! Du hast schon ${fertig} von ${A.length} Rucksack-Spielen geschafft.`
      : `Hallo ${name()}! Bald kommst du in die Schule. In deinem Rucksack sind Spiele zum Zählen, Hören, Entdecken und Malen. Tipp auf ein Bild!`;
    $("bereiche").innerHTML = B.map(b => `<section class="bereich" style="--f:${b.farbe}" data-bereich="${b.id}"><h2>${b.e} ${b.name}</h2><p class="klein">${b.text}</p><div class="kacheln">` +
      A.filter(a => a.bereich === b.id).map(a => `<button class="kachel" data-id="${a.id}" aria-label="${a.name}"><span class="e" aria-hidden="true">${a.e}</span>${a.name}<span class="st">${d.fertig[a.id] ? [1, 2, 3].map(n => `<span class="${n <= d.fertig[a.id] ? "" : "leer"}">⭐</span>`).join("") : ""}</span></button>`).join("") +
      b.links.map(([href, t, e]) => `<a class="kachel link" href="../../${href}"><span class="e" aria-hidden="true">${e}</span>${t}</a>`).join("") + `</div></section>`).join("");
    document.querySelectorAll(".kachel[data-id]").forEach(k => k.addEventListener("click", () => { S.ton("tipp"); starte(k.dataset.id); }));
  }

  let lauf = null;
  function starte(id) {
    const a = A.find(x => x.id === id); if (!a) return;
    lauf = { a, pos: 0, fehler: 0, schritte: a.aufgaben };
    $("aufgabe-name").textContent = `${a.e} ${a.name}`;
    zeige("aufgabe"); schritt();
  }
  function schritt() {
    const s = lauf.schritte[lauf.pos];
    $("balken").style.width = Math.round(lauf.pos / lauf.schritte.length * 100) + "%";
    if (!s) return beende();
    lauf.versuche = 0; lauf.gesperrt = false; lauf.gelegt = [];
    $("frage-text").textContent = s.frage; $("hinweis").textContent = ""; $("hinweis").className = "hinweis";
    const hilfe = S.hilfeRu && S.hilfeRu() && s.ru; $("ru-knopf").hidden = !hilfe; $("ru-text").hidden = true; $("ru-text").textContent = s.ru || "";
    const W = $("aufgabe");
    if (s.typ === "ordnen") {
      const karten = mische(s.teile.map((t, i) => ({ t, i }))); if (karten.every((k, n) => k.i === n)) karten.reverse();
      W.innerHTML = `<div class="reihe" id="reihe" aria-label="Deine Reihe"></div><div class="optionen">` +
        karten.map((k, n) => `<button class="option" data-i="${k.i}" data-n="${n}" aria-label="Bild ${n + 1}">${k.t}</button>`).join("") + `</div>`;
      W.querySelectorAll(".option").forEach(b => b.addEventListener("click", () => lege(b, s)));
    } else {
      const opts = mische(s.optionen.map((t, n) => ({ t, ok: n === 0 })));
      W.innerHTML = `<div class="optionen">` + opts.map((o, n) => `<button class="option${[...o.t].length > 3 ? " lang" : ""}" data-n="${n}" aria-label="Bild ${n + 1}">${o.t}</button>`).join("") + `</div>`;
      W.querySelectorAll(".option").forEach(b => b.addEventListener("click", () => antwort(b, opts[+b.dataset.n].ok, s)));
    }
    sprich(s.frage + (s.sag ? " … " + s.sag : ""));
  }
  // Ordnen: das nächste Bild der Reihe antippen; falsch → wackeln, erster Fehler zählt
  function lege(b, s) {
    if (lauf.gesperrt || b.disabled) return;
    const soll = lauf.gelegt.length;
    if (+b.dataset.i !== soll) { fehlerVersuch(b); return; }
    S.ton("tipp"); lauf.gelegt.push(soll); b.disabled = true; b.style.visibility = "hidden";
    $("reihe").insertAdjacentHTML("beforeend", `<span class="platz">${s.teile[soll]}</span>`);
    if (lauf.gelegt.length === s.teile.length) richtig(null, s);
  }
  function antwort(b, ok, s) {
    if (lauf.gesperrt) return;
    if (ok) richtig(b, s); else fehlerVersuch(b);
  }
  function richtig(b, s) {
    lauf.gesperrt = true;
    if (lauf.versuche === 0) { if (window.Charakter) Charakter.gib(FACH[lauf.a.bereich] || "sachkunde", 1); if (window.Koennen) Koennen.melde(lauf.a.lz, true); }
    if (b) b.classList.add("richtig");
    document.querySelectorAll("#aufgabe .option").forEach(o => o.disabled = true);
    const h = $("hinweis"); h.className = "hinweis gut"; h.textContent = `${LOB[Math.floor(Math.random() * LOB.length)]} ${s.warum || ""}`;
    S.ton("juhu"); SP.stopp(); sprich(h.textContent);
    const dieser = lauf, an = lauf.pos;
    setTimeout(() => { if (lauf !== dieser || lauf.pos !== an) return; weiter(); }, window.__testSchnell ? 150 : 2600);
  }
  function fehlerVersuch(b) {
    lauf.versuche++;
    if (lauf.versuche === 1) { lauf.fehler++; if (window.Koennen) Koennen.melde(lauf.a.lz, false); }
    S.ton("nein");
    if (b) { b.classList.add("falsch"); if (lauf.schritte[lauf.pos].teile) setTimeout(() => b.classList.remove("falsch"), 500); else b.disabled = true; }   // Ordnen: kurz markieren, sonst bleibt die falsche Antwort aus
    const h = $("hinweis"); h.className = "hinweis nein"; h.textContent = "Fast! Versuch es nochmal."; sprich(h.textContent);
  }
  function weiter() { SP.stopp(); lauf.pos++; schritt(); }
  function beende() {
    const { a, fehler } = lauf, sterne = fehler <= 1 ? 3 : fehler <= 3 ? 2 : 1, d = daten(), vorher = d.fertig[a.id] || 0;
    let gewinn = Math.max(0, sterne - vorher); if (vorher === 3 && sterne === 3) gewinn = 1;
    d.fertig[a.id] = Math.max(vorher, sterne); speichere(d);
    if (gewinn) S.gibSterne(gewinn);
    if (window.Charakter) { Charakter.gib(FACH[a.bereich] || "sachkunde", 5); Charakter.ereignis("vorschule-spiel"); }
    if (window.Lernfunde) Lernfunde.merke({ fach: FUND[a.bereich] || "sachkunde", art: "neu", e: a.e, schluessel: "vs:" + a.id, text: `Vorschul-Rucksack: ${a.name}` });
    $("ende-titel").textContent = `${a.name}: geschafft!`;
    $("ende-sterne").innerHTML = [1, 2, 3].map(n => `<span class="${n <= sterne ? "" : "leer"}">⭐</span>`).join("");
    $("ende-text").textContent = fehler === 0 ? "Alles beim ersten Mal richtig!" : `Geschafft! ${fehler} ${fehler === 1 ? "Aufgabe brauchte" : "Aufgaben brauchten"} einen zweiten Versuch.`;
    const kn = $("ende-knoepfe"); kn.innerHTML = "";
    const knopf = (t, haupt, fn) => { const b = document.createElement("button"); b.className = "knopf" + (haupt ? " haupt" : ""); b.textContent = t; b.addEventListener("click", () => { S.ton("tipp"); fn(); }); kn.appendChild(b); };
    const naechste = A.find(x => !daten().fertig[x.id]);
    if (naechste) knopf(`${naechste.e} Weiter: ${naechste.name}`, true, () => starte(naechste.id));
    knopf("🎒 Zum Rucksack", !naechste, () => { zeige("liste"); zeichneListe(); });
    zeige("ende"); S.ton("juhu"); sprich($("ende-titel").textContent + " " + $("ende-text").textContent);
  }

  $("nochmal").addEventListener("click", () => { const s = lauf && lauf.schritte[lauf.pos]; if (s) { SP.stopp(); SP.sprich(s.frage + (s.sag ? " … " + s.sag : ""), "de-DE"); } });
  $("ru-knopf").addEventListener("click", () => { const r = $("ru-text"); r.hidden = !r.hidden; if (!r.hidden && SP.hat && SP.hat("ru-RU")) SP.sprich(r.textContent, "ru-RU"); });
  $("zur-liste").addEventListener("click", () => { SP.stopp(); lauf = null; S.ton("tipp"); zeige("liste"); zeichneListe(); });
  $("ton-vorlesen").addEventListener("click", () => { const d = daten(); d.vorlesen = !d.vorlesen; speichere(d); S.ton("tipp"); zeichneListe(); });

  zeichneListe();
  window.__vorschule = { starte, get lauf() { return lauf; }, schritt: (n) => { lauf.pos = n; schritt(); }, daten, alle: () => A.map(a => a.id) };
})();
