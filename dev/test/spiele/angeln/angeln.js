// Wörter-Angeln an Fipsis Angelsteg (04.11.2026, NA-61): Fische mit Bildern angeln und dem richtigen Artikel-Eimer geben.
// Wörter aus dem Wortschatz-Kern (Nomen mit Bild und Artikel, passend zur Stufe), Farben und Formen der Eimer aus Wortschatz.ARTIKEL.
// Eine Runde = 8 Fische. Erster Fehler: Tipp „Sprich es laut“, zweiter: Lösung. Sterne nur für neue Ziele: ein Wort zum ersten Mal beim ersten
// Versuch richtig = 1 Stern, höchstens 3 am Tag (vorhersehbar, kein Zufall). Öffnet mit Kapitel 2 (wie die Tierpflege-Station).
// Daten angeln = { richtig: { wortId: n }, falsch: { wortId: n }, neu: { "JJJJ-MM-TT": n } }. Test-Haken: window.__angeln.
(function () {
  const S = window.Spielwelt, WS = window.Wortschatz, SP = window.Sprache;
  const $ = (id) => document.getElementById(id);
  const esc = S.esc;
  const ru = (t) => (S.hilfe() && t ? `<span class="ru">${esc(t)}</span>` : "");
  const RUNDE = 8, STERNE_TAG = 3, LZ = ["de.su.03", "daz.d0.03"];
  const FARBEN = ["#FFB547", "#FF8A5B", "#B58CF0", "#7ED957", "#FF9BC8", "#5CCBA6"];
  const offen = () => S.offen(!!(window.Story && Story.kapitel() >= 2));
  const daten = () => Object.assign({ richtig: {}, falsch: {}, neu: {} }, S.lade("angeln") || {});
  const speichere = (d) => S.speichere("angeln", d);
  let fipsiText = "", lauf = null;

  function fipsi(de, r) { fipsiText = de; $("fipsi-text").innerHTML = esc(de) + ru(r); }

  // Wörter für das Kind: Nomen mit Bild und Artikel; Stufe vs/1/2 nur die passenden, ab Kl. 3 alle
  function woerter() {
    const st = ((S.stufe && S.stufe()) || {}).code || "2";
    const alle = WS.alle().filter(w => w.artikel && w.bild && w.wortart === "nomen" && WS.ARTIKEL[w.artikel]);
    const passend = alle.filter(w => !w.stufe || w.stufe.includes(st));
    return passend.length >= RUNDE ? passend : alle;
  }
  // Auswahl: zuerst Wörter, die schon einmal falsch waren, dann neue, dann bekannte – gemischt (kein Einfluss auf Belohnungen)
  function waehle(zz = Math.random) {
    const d = daten(), w = woerter(), mische = (l) => l.map(x => [zz(), x]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
    const falsch = mische(w.filter(x => d.falsch[x.id] && !(d.richtig[x.id] > d.falsch[x.id])));
    const neu = mische(w.filter(x => !d.richtig[x.id] && !d.falsch[x.id]));
    const bekannt = mische(w.filter(x => d.richtig[x.id] && !falsch.includes(x)));
    const liste = []; [falsch.slice(0, 3), neu, bekannt].forEach(l => l.forEach(x => { if (liste.length < RUNDE && !liste.includes(x)) liste.push(x); }));
    return mische(liste);
  }

  function starte() {
    lauf = { liste: waehle(), pos: 0, versuche: 0, ersteRichtig: 0, sterne: 0, gefangen: [], wieder: [] };
    $("ende").hidden = true; $("karte").hidden = true; $("teich").hidden = false; $("stand").hidden = false;
    fipsi(`Hallo ${S.profil.name || "du"}! Im Teich schwimmen Fische mit Bildern. Tipp einen Fisch an – dann sag mir: der, die oder das?`,
      "В пруду плавают рыбы с картинками. Нажми на рыбу и выбери: der, die или das.");
    zeigeTeich();
  }

  function zeigeTeich() {
    const rest = lauf.liste.slice(lauf.pos, lauf.pos + 3);
    $("stand").textContent = `🐟 ${lauf.gefangen.length} von ${lauf.liste.length} Fischen im Eimer`;
    $("teich").innerHTML = rest.map((w, i) => {
      const weit = 120 + (i * 70) % 160;
      return `<button class="fisch" data-i="${lauf.pos + i}" aria-label="Fisch mit ${esc(w.de)}" style="left:${12 + i * 6}%;top:${18 + i * 64}px;--farbe:${FARBEN[(lauf.pos + i) % FARBEN.length]};--weit:${weit}px;--dauer:${7 + i * 2}s;animation-delay:-${i * 1.3}s">` +
        `<span class="koerper"><span class="bild">${w.bild}</span></span><span class="flosse"></span></button>`;
    }).join("");
  }

  function fange(i) {
    if (i !== lauf.pos) { const t = lauf.liste[i]; lauf.liste[i] = lauf.liste[lauf.pos]; lauf.liste[lauf.pos] = t; }   // der angetippte Fisch ist dran
    const w = lauf.liste[lauf.pos];
    lauf.versuche = lauf.wieder.includes(w.id) ? 1 : 0; S.ton("tipp");   // ein wiederkommender Fisch zählt nicht als erster Versuch
    const f = $("teich").querySelector(`[data-i="${i}"]`); if (f) f.classList.add("weg");
    $("g-bild").textContent = w.bild; $("g-wort").textContent = w.de; $("g-art").textContent = "der"; $("g-art").classList.remove("da");
    $("eimer").innerHTML = ["der", "die", "das"].map(a => { const A = WS.ARTIKEL[a]; return `<button data-a="${a}" style="background:${A.farbe}" aria-label="Eimer ${a}">${A.form}<small>${a}</small></button>`; }).join("");
    $("hinweis").className = "hinweis"; $("hinweis").textContent = "In welchen Eimer gehört der Fisch?";
    $("karte").hidden = false; $("teich").hidden = true;
  }

  function antworte(a) {
    const w = lauf.liste[lauf.pos], ok = a === w.artikel, d = daten();
    const knopf = $("eimer").querySelector(`[data-a="${a}"]`);
    if (ok) {
      S.ton("juhu"); knopf.classList.add("richtig");
      $("g-art").textContent = w.artikel; $("g-art").classList.add("da");
      $("eimer").querySelectorAll("button").forEach(b => { b.disabled = true; });
      let stern = false;
      if (lauf.versuche === 0) {
        lauf.ersteRichtig++;
        if (window.Koennen) Koennen.melde(LZ, true);
        if (window.Charakter) Charakter.gib("deutsch", 1);
        const heute = S.heute();
        if (!d.richtig[w.id] && (d.neu[heute] || 0) < STERNE_TAG) { d.neu = { [heute]: (d.neu[heute] || 0) + 1 }; S.gibSterne(1); lauf.sterne++; stern = true;
          if (window.Lernfunde) Lernfunde.merke({ fach: "deutsch", art: "angeln", e: w.bild, text: `${w.artikel} ${w.de} – geangelt!`, schluessel: "angeln:" + w.id }); }
        d.richtig[w.id] = (d.richtig[w.id] || 0) + 1;
      }
      speichere(d);
      lauf.gefangen.push(w);
      $("hinweis").className = "hinweis gut"; $("hinweis").textContent = `Richtig: ${w.artikel} ${w.de}!${stern ? " Ein neues Wort – dafür gibt es einen Stern ⭐." : ""}`;
      $("sterne").textContent = S.sterne();
      if (SP && SP.verfuegbar && SP.verfuegbar()) setTimeout(() => SP.sprich(`${w.artikel} ${w.de}`), 300);
      setTimeout(weiter, window.__testSchnell ? 120 : 1600);
      return;
    }
    S.ton("nein"); lauf.versuche++; if (knopf) { knopf.classList.add("falsch"); knopf.disabled = true; }
    if (lauf.versuche === 1) {
      if (window.Koennen) Koennen.melde(LZ, false);
      d.falsch[w.id] = (d.falsch[w.id] || 0) + 1; speichere(d);
      $("hinweis").className = "hinweis nein";
      $("hinweis").innerHTML = `Fast! Sprich es laut: der ${esc(w.de)}? die ${esc(w.de)}? das ${esc(w.de)}? Was klingt richtig?` + ru("Скажи вслух с каждым артиклем. Что звучит правильно?");
      return;
    }
    // zweiter Fehler: Lösung zeigen
    $("g-art").textContent = w.artikel; $("g-art").classList.add("da");
    $("eimer").querySelectorAll("button").forEach(b => { b.disabled = true; if (b.dataset.a === w.artikel) b.classList.add("richtig"); });
    $("hinweis").className = "hinweis"; $("hinweis").textContent = `Es heißt: ${w.artikel} ${w.de}. Den Fisch angeln wir später noch einmal.`;
    if (!lauf.wieder.includes(w.id)) { lauf.wieder.push(w.id); lauf.liste.push(w); lauf.liste.splice(lauf.pos, 1); lauf.pos--; }   // kommt am Ende der Runde einmal wieder
    setTimeout(weiter, window.__testSchnell ? 120 : 2600);
  }

  function weiter() {
    lauf.pos++;
    if (lauf.pos >= lauf.liste.length) return ende();
    $("karte").hidden = true; $("teich").hidden = false; zeigeTeich();
    fipsi(lauf.gefangen.length ? "Toll! Tipp den nächsten Fisch an." : "Tipp einen Fisch an.", "Нажми на следующую рыбу.");
  }

  function ende() {
    $("karte").hidden = true; $("teich").hidden = true; $("stand").hidden = true;
    if (window.Ereignisse && Ereignisse.melde) Ereignisse.melde("angeln", { n: lauf.gefangen.length });
    fipsi(`Super, ${S.profil.name || "du"}! Alle Fische sind im Eimer.`, "Супер! Все рыбы в ведре.");
    $("ende").innerHTML = `<h2>🪣 Dein Fang</h2>
      <div class="eimer-liste">${lauf.gefangen.map(w => `<span style="color:${WS.ARTIKEL[w.artikel].farbe}">${w.bild} ${w.artikel} ${esc(w.de)}</span>`).join("")}</div>
      <p>${lauf.ersteRichtig} von ${lauf.gefangen.length} gleich beim ersten Mal richtig.${lauf.sterne ? ` ${lauf.sterne} neue ${lauf.sterne === 1 ? "Wort" : "Wörter"}: +${lauf.sterne} ⭐` : ""}</p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button class="knopf haupt" id="nochmal">🎣 Noch eine Runde</button><a class="knopf" href="../welt3d/heimat.html" style="text-decoration:none">🏝️ Zur Insel</a></div>`;
    $("ende").hidden = false;
    $("nochmal").addEventListener("click", () => { S.ton("tipp"); starte(); });
  }

  // ---------- Start ----------
  $("sterne").textContent = S.sterne();
  $("fipsi-vorlesen").addEventListener("click", () => { if (SP) SP.sprich(fipsiText); });
  $("g-hoeren").addEventListener("click", () => { if (SP && lauf) SP.sprich(lauf.liste[lauf.pos].de); });   // nur das Wort, ohne Artikel (sonst wäre die Antwort verraten)
  $("teich").addEventListener("click", (e) => { const f = e.target.closest(".fisch"); if (f && lauf) fange(+f.dataset.i); });
  $("eimer").addEventListener("click", (e) => { const b = e.target.closest("button[data-a]"); if (b && !b.disabled && lauf) antworte(b.dataset.a); });
  if (!offen()) {
    $("zu").hidden = false; $("teich").hidden = true; $("stand").hidden = true;
    fipsi("Hier baue ich gerade meinen Angelsteg!", "Здесь я строю свой причал для рыбалки!");
  } else starte();

  window.__angeln = { get lauf() { return lauf; }, starte, fange: (i) => fange(i), antworte, woerter, waehle, daten, RUNDE, STERNE_TAG };
})();
