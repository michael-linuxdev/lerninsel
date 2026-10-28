(function () {
  const S = window.Spielwelt;
  // Zwei Wege (NA-32): „k1“ = Klasse 1 und Vorschule (Mengen mit Material), „k2“ = der bisherige Matheweg Klasse 2.
  // Fortschritt je Weg in mathe.k1 bzw. mathe.k2; der Einstufungstest gehört nur zu Klasse 2.
  const WEGE = { k1: window.Mathe.STATIONEN_K1 || [], k2: window.Mathe.STATIONEN, k3: window.Mathe.STATIONEN_K3 || [], k4: window.Mathe.STATIONEN_K4 || [], k5: window.Mathe.STATIONEN_K5 || [] };
  const ersterWeg = () => { const d = S.lade("mathe") || {}; if (d.weg && WEGE[d.weg]) return d.weg;
    const st = (S.stufe && S.stufe()) || {}; return ["vs", "1"].includes(st.code) && WEGE.k1.length ? "k1" : st.code === "5" && WEGE.k5.length ? "k5" : ["4", "5"].includes(st.code) && WEGE.k4.length ? "k4" : ["3", "4", "5"].includes(st.code) && WEGE.k3.length ? "k3" : "k2"; };
  let WEG = ersterWeg(), ST = WEGE[WEG];
  // ?weg=k3 öffnet einen Weg nur für diesen Besuch (Lücken-Check nach einer übersprungenen Klasse, NA-61); die gespeicherte Wahl bleibt
  { const w = new URLSearchParams(location.search).get("weg"); if (w && WEGE[w] && WEGE[w].length) { WEG = w; ST = WEGE[w]; } }
  // Können je Lernziel (NA-50): Lernziele einer Station (beide Wege)
  const stationVon = (id) => WEGE.k1.find(s => s.id === id) || WEGE.k2.find(s => s.id === id) || WEGE.k3.find(s => s.id === id) || WEGE.k4.find(s => s.id === id) || WEGE.k5.find(s => s.id === id);
  const lzVon = (id) => (stationVon(id) || {}).lz || [];
  const KN = () => window.Koennen;
  function setzeWeg(w) { if (!WEGE[w] || !WEGE[w].length) return; WEG = w; ST = WEGE[w]; const d = daten(); d.weg = w; S.speichere("mathe", d); }
  const $ = (id) => document.getElementById(id);
  const LOB = ["Richtig!", "Super!", "Klasse!", "Genau!", "Toll gerechnet!", "Spitze!", "Prima!"];

  // ---------- Fortschritt ----------
  const daten = () => { const d = S.lade("mathe") || {}; d.k2 = d.k2 || {}; d.k1 = d.k1 || {}; d.k3 = d.k3 || {}; d.k4 = d.k4 || {}; d.k5 = d.k5 || {}; return d; };
  const bestes = (id) => daten()[WEG][id] || 0;
  const startAb = () => WEG === "k2" ? (daten().einstufung || {}).startAb || 0 : 0;   // aus dem Einstufungstest (nur Klasse 2)
  // Lernbereichs-Pfade (Sachsen Kl. 1/2 in voller Tiefe): Eine Station mit `lb` ist auch offen, wenn die vorige Station DESSELBEN Lernbereichs
  // geschafft ist (oder es keine gibt). Das öffnet nur zusätzlich – was nach der alten Regel offen war, bleibt offen.
  function lbOffen(i) { const lb = ST[i].lb; if (!lb) return false; for (let j = i - 1; j >= 0; j--) if (ST[j].lb === lb) return bestes(ST[j].id) > 0; return true; }
  const istOffen = (i) => S.offen(i === 0 || i <= startAb() || bestes(ST[i - 1].id) > 0 || lbOffen(i));
  // Schuljahres-Gerüst: Lernbereiche des Lehrplans; Eltern-Einstellung „gerade in der Schule“ (eltern.mathe.schule = zo|rf|gm|dz)
  const LB = { zo: ["🔢", "Zahl und Operation"], rf: ["📐", "Raum und Form"], gm: ["📏", "Größen und Messen"], dz: ["📊", "Daten und Zufall"] };
  const schuleLb = () => { const x = (((S.lade("eltern") || {}).mathe || {}).schule) || ""; return LB[x] && ST.some(s => s.lb === x) ? x : ""; };
  function merke(id, sterne) {
    const d = daten(); d[WEG][id] = Math.max(d[WEG][id] || 0, sterne); S.speichere("mathe", d);
  }
  const C = () => window.Charakter;
  // Trefferquote pro Station (erster Versuch) und gemerkte Fehler fürs Training
  // Wiederholung wie bei einer Lernkartei: falsch → morgen, dann nach 3 und 7 Tagen; dreimal richtig = gelernt
  const ABSTAND = [0, 1, 3, 7];
  const pad = (n) => String(n).padStart(2, "0");
  const tagIn = (n) => { const d = window.__heute ? new Date(window.__heute) : new Date(); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const faellig = (f) => !f.faellig || f.faellig <= tagIn(0);
  function statistik(a, richtig) {
    if (!a.station) return;
    const d = daten(); d.stat = d.stat || {};
    const st = d.stat[a.station] = d.stat[a.station] || { r: 0, f: 0 };
    if (richtig) st.r++; else st.f++;
    d.fehler = d.fehler || [];
    if (!richtig && !a.bild) {
      const { station, text, antwort, art, optionen, frage, einheit, hilfe, nurLuecke, wort, max } = a;
      d.fehler = d.fehler.filter(x => x.text !== text);
      d.fehler.push({ station, text, antwort, art, optionen, frage, einheit, hilfe, nurLuecke, wort, max, am: Date.now(), stufe: 1, faellig: tagIn(ABSTAND[1]) });
      d.fehler = d.fehler.slice(-40);
    }
    if (richtig && a.ausFehler) {
      const f = d.fehler.find(x => x.text === a.text);
      if (f) {
        const stufe = (f.stufe || 1) + 1;
        if (stufe >= ABSTAND.length) { d.fehler = d.fehler.filter(x => x !== f); d.gelernt = (d.gelernt || 0) + 1; gemeistert(f); }
        else { f.stufe = stufe; f.faellig = tagIn(ABSTAND[stufe]); }
      }
    }
    S.speichere("mathe", d);
  }

  // Lernfund: eine Aufgabe, die früher schwer war, sitzt jetzt (dreimal an verschiedenen Tagen richtig)
  function loesungsText(a) {
    const e = a.einheit ? " " + a.einheit : "";
    if (a.text && a.text.includes("?")) return a.text.replace("?", a.antwort + e);
    if (!a.text) return `${a.frage} ${a.antwort}${e}`;
    return a.wort ? `${a.text} ist ${a.antwort}${e}` : `${a.text} = ${a.antwort}${e}`;
  }
  function gemeistert(a) {
    if (!window.Lernfunde) return;
    const t = loesungsText(a);
    Lernfunde.merke({ fach: "mathe", art: "gemeistert", e: "💪", text: `${t} – war schwer, jetzt kannst du es!`, schluessel: "m:" + t, melden: true });
  }

  function zeige(name) {
    ["weg", "rechnen", "ende"].forEach(n => $(n + "-ansicht").hidden = n !== name);
    scrollTo(0, 0);
  }

  // ---------- Matheweg ----------
  // Biber Benno begleitet den Matheweg
  function benno() {
    const F = window.Figuren; if (!F || !F.biber) return;
    $("benno").innerHTML = F.biber(""); $("benno-ende").innerHTML = F.biber("");
    const d = daten(), geschafft = ST.filter(s => (d[WEG][s.id] || 0) > 0).length, faellig = (d.fehler || []).filter(f => faellig_(f)).length, n = S.profil.name || "du";
    $("benno-text").textContent = geschafft === 0 ? `Hallo ${n}! Ich bin Biber Benno. Ich baue Dämme und zähle jeden Stamm. Komm, wir rechnen zusammen!`
      : faellig ? `Hallo ${n}! ${faellig} ${faellig === 1 ? "Aufgabe von früher wartet" : "Aufgaben von früher warten"} im Mathe-Training. Die schaffen wir!`
      : empfehlung() ? `Schon ${geschafft} von ${ST.length} Stationen geschafft! Heute passt gut: „${empfehlung().name}“.`
      : `Schon ${geschafft} von ${ST.length} Stationen geschafft! Mein Damm wird immer länger.`;
  }
  // NA-50: die offene Station, deren Lernziele gerade am besten in die Zielzone passen (nur wenn schon geübt wurde)
  function empfehlung() {
    if (!KN()) return null;
    const offen = ST.filter((s, i) => istOffen(i) && bestes(s.id) > 0);
    return offen.length ? KN().naechste(offen, 1)[0] : null;
  }
  const faellig_ = (f) => !f.faellig || f.faellig <= tagIn(0);

  function zeichneWeg() {
    $("sterne").textContent = S.sterne(); benno();
    // Nach Können über die Klasse hinaus (NA-60): Wer alle Stationen dieses Weges geschafft hat, bekommt den nächsten Weg vorgeschlagen (freiwillig)
    { const wk = $("weiter-klasse"), REIHE = ["k1", "k2", "k3", "k4", "k5"], naechster = REIHE[REIHE.indexOf(WEG) + 1];
      const alle = ST.length > 0 && ST.every(st => bestes(st.id) > 0);
      if (wk) { wk.hidden = !(alle && naechster && WEGE[naechster] && WEGE[naechster].length);
        if (!wk.hidden) { wk.innerHTML = `🌟 Du hast alle Stationen geschafft! Wenn du magst, schau schon mal in den nächsten Weg.<br><button class="knopf haupt" id="weiter-klasse-los">Weiter: ${naechster === "k5" ? "Übergang 5" : naechster.slice(1) + ". Klasse"}</button>`;
          $("weiter-klasse-los").addEventListener("click", () => { S.ton("tipp"); setzeWeg(naechster); zeichneWeg(); }); } } }
    // Umschalter zwischen den Wegen (Klasse 1 / Klasse 2)
    const kl = $("klasse");
    if (kl) {
      kl.innerHTML = `<button class="weg-wahl${WEG === "k1" ? " an" : ""}" data-weg="k1" aria-pressed="${WEG === "k1"}">🐣 Klasse 1 und Vorschule</button>` +
        `<button class="weg-wahl${WEG === "k2" ? " an" : ""}" data-weg="k2" aria-pressed="${WEG === "k2"}">2. Klasse</button>` +
        `<button class="weg-wahl${WEG === "k3" ? " an" : ""}" data-weg="k3" aria-pressed="${WEG === "k3"}">3. Klasse</button>` +
        (WEGE.k4.length ? `<button class="weg-wahl${WEG === "k4" ? " an" : ""}" data-weg="k4" aria-pressed="${WEG === "k4"}">4. Klasse</button>` : "") +
        (WEGE.k5.length ? `<button class="weg-wahl${WEG === "k5" ? " an" : ""}" data-weg="k5" aria-pressed="${WEG === "k5"}">🎒 Übergang 5</button>` : "");
      kl.querySelectorAll(".weg-wahl").forEach(b => b.addEventListener("click", () => { if (b.dataset.weg === WEG) return; S.ton("tipp"); setzeWeg(b.dataset.weg); zeichneWeg(); }));
    }
    const karte = $("karte");
    const breite = Math.min(karte.parentElement.clientWidth, 1100);
    const spalten = breite > 940 ? 5 : breite > 620 ? 4 : 3;
    const dx = breite / spalten, dy = 168;
    const knoten = ST.map((s, i) => ({ s, i })).concat([{ ziel: true, i: ST.length }]);
    const pos = knoten.map((_, i) => {
      const reihe = Math.floor(i / spalten), sp = i % spalten;
      const x = (reihe % 2 ? spalten - 1 - sp : sp) * dx + dx / 2;
      return [x, reihe * dy + 80];
    });
    const hoehe = (Math.ceil(knoten.length / spalten) - 1) * dy + 170;
    karte.style.height = hoehe + "px";

    let d = `M${pos[0][0]} ${pos[0][1]}`;
    for (let i = 1; i < pos.length; i++) {
      const [x0, y0] = pos[i - 1], [x1, y1] = pos[i];
      if (y0 === y1) d += ` L${x1} ${y1}`;
      else { const bogen = x0 > breite / 2 ? dx * 0.9 : -dx * 0.9; d += ` C${x0 + bogen} ${y0} ${x1 + bogen} ${y1} ${x1} ${y1}`; }
    }
    let jetzt = -1;
    if (schuleLb()) jetzt = ST.findIndex((s, i) => s.lb === schuleLb() && istOffen(i) && !bestes(s.id));
    if (jetzt < 0) jetzt = ST.findIndex((s, i) => i >= startAb() && istOffen(i) && !bestes(s.id));
    if (jetzt < 0) jetzt = ST.findIndex((s, i) => istOffen(i) && !bestes(s.id));
    zeigeEinstufungAngebot();
    zeichneSchuljahr();

    karte.innerHTML = `<svg class="pfad" viewBox="0 0 ${breite} ${hoehe}" preserveAspectRatio="none">
      <path d="${d}" stroke="#B8E6D4" stroke-width="30" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${d}" stroke="#fff" stroke-width="6" stroke-dasharray="2 18" fill="none" stroke-linecap="round"/></svg>`;

    knoten.forEach((k, i) => {
      const b = document.createElement("button");
      b.style.left = pos[i][0] + "px"; b.style.top = pos[i][1] + "px";
      if (k.ziel) {
        // Urkunde/Ziel: zählt nur die ursprünglichen Stationen (neue Zusatz-Stationen aus „Sachsen in voller Tiefe“ sperren keine verdiente Urkunde)
        const alle = ST.filter(s => !s.zusatz).every(s => bestes(s.id) > 0);
        if (WEG === "k1") {
          // Klasse 1 → weiter auf dem Matheweg Klasse 2 (immer erreichbar, auch ohne alle Stationen)
          b.className = "station ziel";
          b.innerHTML = `<span class="kreis">${alle ? "🎓" : "➡️"}</span><span class="name">2. Klasse</span><span class="stern-reihe"></span>`;
          b.addEventListener("click", () => { S.ton("tipp"); setzeWeg("k2"); zeichneWeg(); scrollTo(0, 0); });
        } else {
          if (WEG === "k2") {
            // Klasse 2 → Klasse 3 (immer erreichbar, wie bei Klasse 1 → 2)
            b.className = "station ziel";
            b.innerHTML = `<span class="kreis">${alle ? "🎓" : "➡️"}</span><span class="name">3. Klasse</span><span class="stern-reihe"></span>`;
            b.addEventListener("click", () => { S.ton("tipp"); setzeWeg("k3"); zeichneWeg(); scrollTo(0, 0); });
          } else if (WEG === "k3" && WEGE.k4.length) {
            // Klasse 3 → Klasse 4 (NA-37)
            b.className = "station ziel";
            b.innerHTML = `<span class="kreis">${alle ? "🎓" : "➡️"}</span><span class="name">4. Klasse</span><span class="stern-reihe"></span>`;
            b.addEventListener("click", () => { S.ton("tipp"); setzeWeg("k4"); zeichneWeg(); scrollTo(0, 0); });
          } else if (WEG === "k4" || WEG === "k5") {
            // Schritt B / NA-39: Abschluss eines Wegs mit Urkunde (statt „Mehr kommt bald“); von der Kl.-4-Urkunde geht es zum Übergang 5
            b.className = "station ziel" + (alle ? "" : " zu"); b.id = "urkunde-ziel";
            b.innerHTML = `<span class="kreis">${alle ? "🎓" : "🔒"}</span><span class="name">Urkunde</span><span class="stern-reihe"></span>`;
            b.addEventListener("click", () => {
              S.ton("tipp");
              if (!alle) { const fehlt = ST.filter(s => !s.zusatz && !bestes(s.id)).length; S.meldung(`Noch ${fehlt} ${fehlt === 1 ? "Station" : "Stationen"}, dann bekommst du deine Mathe-Urkunde.`); return; }
              zeigeUrkunde(WEG);
            });
          } else {
            b.className = "station ziel" + (alle ? "" : " zu");
            b.innerHTML = `<span class="kreis">${alle ? "🎓" : "🔒"}</span><span class="name">Mehr kommt bald</span><span class="stern-reihe"></span>`;
            b.addEventListener("click", () => { S.ton("tipp"); S.meldung("Weitere Stationen werden gerade gebaut."); });
          }
        }
      } else {
        const offen = istOffen(i), best = bestes(k.s.id);
        b.className = "station" + (offen ? "" : " zu") + (i === jetzt ? " jetzt" : "");
        b.setAttribute("aria-label", `${i + 1}. ${k.s.name}${offen ? "" : ", noch gesperrt"}${best ? `, ${best} Sterne` : ""}`);
        b.innerHTML = `<span class="kreis">${offen ? k.s.icon : "🔒"}</span><span class="nr">${i + 1}</span><span class="name">${k.s.name}</span>` +
          `<span class="stern-reihe">${offen && best ? [1, 2, 3].map(n => `<span class="${n <= best ? "" : "leer"}">⭐</span>`).join("") : ""}</span>`;
        b.addEventListener("click", () => {
          if (!offen) { S.ton("nein"); S.meldung(k.s.lb ? "Schaffe zuerst eine Station davor aus diesem Bereich." : "Schaffe zuerst die Station davor."); return; }
          S.ton("tipp"); starte(i);
        });
      }
      karte.appendChild(b);
    });

    if (jetzt > 2) {
      const el = karte.querySelector(".jetzt");
      if (el) setTimeout(() => el.scrollIntoView({ block: "center" }), 50);
    }
  }

  // Mathe-Urkunde am Ende des Wegs „4. Klasse“: alle Wege mit Sternen, zum Ansehen (nichts zu kaufen, nichts geht verloren)
  function zeigeUrkunde(weg = "k4") {
    const d = daten(), name = (S.profil && S.profil.name) || "Du", ue = weg === "k5";
    const zeile = (titel, w) => { const st = WEGE[w] || [], fertig = st.filter(s => (d[w] || {})[s.id] > 0).length, sterne = st.reduce((x, s) => x + ((d[w] || {})[s.id] || 0), 0);
      return st.length ? `<li><b>${titel}</b>: ${fertig} von ${st.length} Stationen, ${sterne} ⭐</li>` : ""; };
    const el = document.createElement("div"); el.className = "urkunde-schleier"; el.id = "urkunde";
    el.innerHTML = `<div class="urkunde" role="dialog" aria-label="Mathe-Urkunde"><div class="urkunde-siegel" aria-hidden="true">${ue ? "🎒" : "🎓"}</div>
      <h2>${ue ? "Fit für Klasse 5!" : "Mathe-Urkunde"}</h2><p class="urkunde-name">${name}</p>
      <p>${ue ? "hat den Übergangsweg geschafft: Brüche, Kommazahlen, Klammern, Koordinaten, Winkel und Durchschnitt. Damit bist du gut vorbereitet – egal, auf welche Schule du gehst."
        : "hat den ganzen Matheweg der 4. Klasse geschafft: große Zahlen, schriftlich rechnen, Maßstab, Zeit, Zufall und vieles mehr."}</p>
      <ul>${zeile("1. Klasse", "k1")}${zeile("2. Klasse", "k2")}${zeile("3. Klasse", "k3")}${zeile("4. Klasse", "k4")}${zeile("Übergang 5", "k5")}</ul>
      <p class="urkunde-weiter">Du kannst jede Station jederzeit wiederholen.${ue ? "" : " Weiter geht es mit dem Übergang in die 5. Klasse."}</p>
      <div class="urkunde-knoepfe">${ue || !WEGE.k5.length ? "" : `<button class="knopf" id="urkunde-weiter">🎒 Zum Übergang 5</button>`}<button class="knopf haupt" id="urkunde-zu">Toll!</button></div></div>`;
    document.body.appendChild(el); S.ton("juhu");
    el.querySelector("#urkunde-zu").addEventListener("click", () => { S.ton("tipp"); el.remove(); });
    const w5 = el.querySelector("#urkunde-weiter");
    if (w5) w5.addEventListener("click", () => { S.ton("tipp"); el.remove(); setzeWeg("k5"); zeichneWeg(); scrollTo(0, 0); });
  }

  // ---------- Runde ----------
  let lauf = null; // { nr, station, liste, pos, fehlerErste, versuch, ergebnis[], eingabe }

  function starte(nr) {
    const station = ST[nr];
    const liste = window.Mathe.runde(station.id, 10).map(a => Object.assign(a, { wieder: false, station: station.id }));
    lauf = { nr, station, liste, pos: 0, fehler: 0, versuch: 0, ergebnis: [], eingabe: "", gesperrt: false };
    $("station-name").textContent = station.name;
    zeige("rechnen");
    zeigeAufgabe();
  }

  // Tagesaufgabe: 8 Aufgaben aus gemerkten Fehlern und den schwächsten offenen Stationen
  // ---------- Einstufungstest: je 2 Aufgaben wichtiger Stationen, von leicht nach schwer ----------
  const TEST_ST = ["plus20", "minus20", "zehner", "vergleich", "plus100", "minus100", "plusUeber", "minusUeber", "doppelt", "ergaenzen", "mal1", "geld", "uhr"];
  function zeigeEinstufungAngebot() {
    const d = daten(), box = $("einstufung");
    if (!box) return;
    const zeigen = WEG === "k2" && !d.einstufung && (!Object.keys(d.k2).length || d.einstufungAngebot);
    box.hidden = !zeigen; if (!zeigen) return;
    box.innerHTML = `<b>🧭 Was kannst du schon?</b><p>Mach einen kurzen Test. Dann startest du an der richtigen Stelle auf dem Matheweg.</p>
      <div class="knoepfe-e"><button class="knopf haupt" id="einst-los">Test starten</button><button class="knopf" id="einst-nein">Lieber von vorne</button></div>`;
    $("einst-los").addEventListener("click", () => { S.ton("tipp"); starteEinstufung(); });
    $("einst-nein").addEventListener("click", () => { const x = daten(); x.einstufung = { am: tagIn(0), startAb: 0, uebersprungen: true }; S.speichere("mathe", x); S.ton("tipp"); zeichneWeg(); });
  }
  function starteEinstufung() {
    const liste = [];
    TEST_ST.forEach(id => { if (ST.some(s => s.id === id)) window.Mathe.runde(id, 2).forEach(a => liste.push(Object.assign(a, { station: id, wieder: false }))); });
    lauf = { nr: -1, einstufung: true, station: { name: "Was kannst du schon?" }, liste, pos: 0, fehler: 0, versuch: 0, ergebnis: [], erst: [], eingabe: "", gesperrt: false, fehlStationen: 0, geschafft: [] };
    $("station-name").textContent = "Was kannst du schon?";
    zeige("rechnen");
    zeigeAufgabe();
  }
  // Nach jedem Aufgabenpaar auswerten; nach 2 nicht geschafften Stationen aufhören
  function einstufungPruefen() {
    if (lauf.pos % 2 === 0) return false;
    const a = lauf.liste[lauf.pos], ok = lauf.erst[lauf.pos] && lauf.erst[lauf.pos - 1];
    if (ok) lauf.geschafft.push(a.station); else lauf.fehlStationen++;
    return lauf.fehlStationen >= 2 || lauf.pos >= lauf.liste.length - 1;
  }
  function beendeEinstufung() {
    const d = daten();
    // Startpunkt: erste getestete Station, die nicht geschafft wurde
    const ersteFehl = TEST_ST.find(id => lauf.liste.some(a => a.station === id) && !lauf.geschafft.includes(id) && lauf.liste.findIndex(a => a.station === id) <= lauf.pos);
    const startId = ersteFehl || null;
    lauf.geschafft.forEach(id => { d.k2[id] = Math.max(d.k2[id] || 0, 1); });
    let start = startId ? ST.findIndex(s => s.id === startId) : ST.findIndex(s => !d.k2[s.id]);
    if (start < 0) start = ST.length - 1;
    d.einstufung = { am: tagIn(0), startAb: Math.max(0, start), geschafft: lauf.geschafft.slice() }; delete d.einstufungAngebot;
    S.speichere("mathe", d);
    C() && C().gib("mathe", 3);
    $("ende-titel").textContent = "Test fertig!";
    $("ende-sterne").innerHTML = `<span style="animation-delay:180ms">🧭</span>`;
    $("ende-text").textContent = lauf.geschafft.length ? `Das kannst du schon: ${lauf.geschafft.map(id => ST.find(s => s.id === id).name).join(", ")}.` : "Wir fangen gemeinsam ganz vorne an. Das ist super so!";
    $("ende-gewinn").textContent = `Dein Startpunkt: ${ST[Math.max(0, start)].name}. Alle Stationen davor sind offen.`;
    const k = $("ende-knoepfe"); k.innerHTML = "";
    const knopf = (text, haupt, fn) => { const b = document.createElement("button"); b.className = "knopf" + (haupt ? " haupt" : ""); b.textContent = text; b.addEventListener("click", () => { S.ton("tipp"); fn(); }); k.appendChild(b); };
    knopf(`Los geht's: ${ST[Math.max(0, start)].name}`, true, () => starte(Math.max(0, start)));
    knopf("Zum Matheweg", false, () => { zeige("weg"); zeichneWeg(); });
    zeige("ende"); S.ton("juhu");
  }

  // ---------- Schuljahres-Gerüst: Lernbereiche, „gerade in der Schule“, „Zeig, was du kannst“ ----------
  function zeichneSchuljahr() {
    const box = $("schuljahr"); if (!box) return;
    const lbs = Object.keys(LB).filter(k => ST.some(s => s.lb === k)), d = daten(), schule = schuleLb();
    box.hidden = !lbs.length; if (!lbs.length) return;
    box.innerHTML = lbs.map(k => { const st = ST.filter(s => s.lb === k), fertig = st.filter(s => bestes(s.id) > 0).length, ls = (d.lernstand || {})[WEG + ":" + k];
      return `<div class="lb-kachel${k === schule ? " schule" : ""}" data-lb="${k}"><div class="lb-kopf"><span class="lb-icon">${LB[k][0]}</span><b>${LB[k][1]}</b></div>` +
        `<div class="lb-stand">${fertig} von ${st.length} Stationen${ls ? ` · zuletzt gezeigt: ${ls.richtig} von ${ls.n}` : ""}</div>` +
        `<div class="lb-balken" aria-hidden="true"><i style="width:${Math.round(fertig / st.length * 100)}%"></i></div>` +
        (k === schule ? `<div class="lb-schule"><span class="schule-marke">📌 Gerade in der Schule</span></div>` : "") +
        `<button class="knopf lb-zeig" data-lb="${k}">🔍 Zeig, was du kannst</button></div>`; }).join("");
    box.querySelectorAll(".lb-zeig").forEach(b => b.addEventListener("click", () => { S.ton("tipp"); starteLernstand(b.dataset.lb); }));
  }
  function starteLernstand(lb) {
    let st = ST.filter(s => s.lb === lb);
    if (st.length > 10) st = st.map((s, i) => [s, i]).sort(() => Math.random() - 0.5).slice(0, 10).sort((a, b) => a[1] - b[1]).map(x => x[0]);
    const liste = st.map(s => Object.assign(window.Mathe.runde(s.id, 1)[0], { station: s.id, wieder: false }));
    lauf = { nr: -1, lernstand: lb, station: { name: "Zeig, was du kannst" }, liste, pos: 0, fehler: 0, versuch: 0, ergebnis: [], erst: [], eingabe: "", gesperrt: false };
    $("station-name").textContent = `Zeig, was du kannst: ${LB[lb][1]}`;
    zeige("rechnen");
    zeigeAufgabe();
  }
  function beendeLernstand() {
    const d = daten(), lb = lauf.lernstand, je = {};
    lauf.liste.forEach((a, i) => { je[a.station] = lauf.erst[i] === true; });
    const ids = Object.keys(je), gut = ids.filter(id => je[id]), ueben = ids.filter(id => !je[id]), name = (id) => (ST.find(s => s.id === id) || {}).name || id;
    d.lernstand = d.lernstand || {}; d.lernstand[WEG + ":" + lb] = { am: tagIn(0), n: ids.length, richtig: gut.length, je };
    S.speichere("mathe", d);
    C() && C().gib("mathe", 3);
    $("ende-titel").textContent = "Danke fürs Zeigen!";
    $("ende-sterne").innerHTML = `<span style="animation-delay:180ms">🔍</span>`;
    $("ende-text").textContent = (gut.length ? `Das kannst du schon: ${gut.slice(0, 4).map(name).join(", ")}${gut.length > 4 ? " und mehr" : ""}. ` : "") +
      (ueben.length ? `Das üben wir noch zusammen: ${ueben.slice(0, 3).map(name).join(", ")}`.replace(/([^?!])$/, "$1.") : "Alles beim ersten Mal richtig – super!");
    $("ende-gewinn").textContent = "Das war kein Test mit Noten – nur ein Blick, was schon klappt.";
    const k = $("ende-knoepfe"); k.innerHTML = "";
    const knopf = (text, haupt, fn) => { const b = document.createElement("button"); b.className = "knopf" + (haupt ? " haupt" : ""); b.textContent = text; b.addEventListener("click", () => { S.ton("tipp"); fn(); }); k.appendChild(b); };
    const erste = ueben.map(id => ST.findIndex(s => s.id === id)).find(i => i >= 0 && istOffen(i));
    if (erste != null) knopf(`Üben: ${ST[erste].name}`, true, () => starte(erste));
    knopf("Zum Matheweg", erste == null, () => { zeige("weg"); zeichneWeg(); });
    zeige("ende"); S.ton("juhu");
  }

  function starteTraining() {
    const d = daten(), stat = d.stat || {};
    const offen = ST.filter((s, i) => istOffen(i));
    const schwaeche = (id) => { const x = stat[id] || { r: 0, f: 0 }; return (x.f + 1) / (x.r + x.f + 2); };
    // NA-50: Stationen in der Zielzone (70–85 % Treffer) zuerst; ohne Können-Daten wie bisher die schwächsten
    const schwach = KN() ? KN().naechste(offen, 2)
      : offen.slice().sort((a, b) => schwaeche(b.id) - schwaeche(a.id) || Math.random() - 0.5).slice(0, 2);
    const offeneIds = offen.map(s => s.id);
    // zuerst fällige Wiederholungen (höchstens 4), älteste zuerst
    let liste = (d.fehler || []).filter(f => offeneIds.includes(f.station) && faellig(f)).sort((x, y) => (x.faellig || "").localeCompare(y.faellig || "")).slice(0, 4)
      .map(f => Object.assign({}, f, { ausFehler: true, wieder: false }));
    const rest = 8 - liste.length;
    schwach.forEach((s, i) => {
      const n = schwach.length === 1 ? rest : i === 0 ? Math.ceil(rest / 2) : Math.floor(rest / 2);
      liste = liste.concat(window.Mathe.runde(s.id, n).map(a => Object.assign(a, { wieder: false, station: s.id })));
    });
    liste.sort(() => Math.random() - 0.5);
    lauf = { nr: -1, training: true, station: { name: "Mathe-Training" }, liste, pos: 0, fehler: 0, versuch: 0, ergebnis: [], eingabe: "", gesperrt: false, themen: schwach.map(s => s.name) };
    $("station-name").textContent = "Mathe-Training";
    zeige("rechnen");
    zeigeAufgabe();
  }

  function zeigePunkte() {
    $("punkte").innerHTML = lauf.liste.map((_, i) =>
      `<span class="${lauf.ergebnis[i] === "gut" ? "gut" : lauf.ergebnis[i] === "nochmal" ? "nochmal" : ""} ${i === lauf.pos ? "jetzt" : ""}"></span>`).join("");
  }

  function lueckeHtml(a) {
    const inhalt = lauf.eingabe;
    return `<span class="luecke ${inhalt ? "" : "leer"}" id="luecke">${inhalt}</span>` + (a.einheit ? `<span class="einheit">${a.einheit}</span>` : "");
  }

  function zeigeAufgabe() {
    const a = lauf.liste[lauf.pos];
    lauf.versuch = 0; lauf.eingabe = ""; lauf.gesperrt = false;
    zeigePunkte();

    let ausdruck;
    if (a.art === "wahl" && a.text.includes("?")) ausdruck = a.text.replace("?", `<span class="luecke leer" id="luecke"></span>`);
    else if (a.text.includes("?")) ausdruck = a.text.replace("?", "§");
    else if (a.nurLuecke || !a.text) ausdruck = "§";
    else if (a.wort) ausdruck = `${a.text} ist §`;
    else ausdruck = `${a.text} = §`;

    $("tafel").innerHTML =
      (a.frage ? `<p class="frage${a.bild ? "" : " gross"}">${a.frage}</p>` : "") +
      (a.bild ? `<div class="bild">${a.bild}</div>` : "") +
      (a.art === "wahl" && a.nurLuecke ? "" : `<div class="ausdruck ${a.wort ? "wort" : ""}" id="ausdruck">${ausdruck}</div>`) +
      `<p class="rueck" id="rueck">${a.bruecke ? "Eine leichtere Aufgabe zwischendurch 🙂" : ""}</p><div id="hilfe-platz"></div>`;
    aktualisiereLuecke();
    zeigeEingabe(a);
  }

  function aktualisiereLuecke() {
    const a = lauf.liste[lauf.pos], el = $("ausdruck");
    if (!el || a.art === "wahl") return;
    el.innerHTML = el.innerHTML.replace(/<span class="luecke[^>]*>[^<]*<\/span>(<span class="einheit">[^<]*<\/span>)?|§/, lueckeHtml(a));
  }

  function zeigeEingabe(a) {
    const e = $("eingabe");
    if (a.art === "wahl") {
      const laenge = Math.max(...a.optionen.map(o => String(o).length)), gross = laenge > 12 ? " lang" : laenge > 7 ? " mittel" : "";
      e.innerHTML = `<div class="wahl-tasten ${a.optionen.length === 3 ? "drei" : ""}${gross}">` +
        a.optionen.map(o => `<button class="taste" data-wert="${o}">${o}</button>`).join("") + `</div>`;
    } else {
      e.innerHTML = `<div class="tasten">` +
        [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button class="taste" data-ziffer="${n}">${n}</button>`).join("") +
        `<button class="taste loeschen" data-tun="weg" aria-label="Löschen">⌫</button>` +
        `<button class="taste" data-ziffer="0">0</button>` +
        `<button class="taste ok" data-tun="ok" aria-label="Fertig">✓</button></div>`;
    }
  }

  function tippe(ziffer) {
    if (lauf.gesperrt || lauf.eingabe.length >= ((lauf.liste[lauf.pos] || {}).max || 3)) return;
    if (lauf.eingabe === "0") lauf.eingabe = "";
    lauf.eingabe += ziffer; S.ton("tipp"); aktualisiereLuecke();
  }
  function loesche() { if (lauf.gesperrt) return; lauf.eingabe = lauf.eingabe.slice(0, -1); S.ton("tipp"); aktualisiereLuecke(); }

  function pruefe(wert) {
    if (lauf.gesperrt) return;
    const a = lauf.liste[lauf.pos];
    if (a.art === "zahl" && !lauf.eingabe) { S.ton("nein"); $("rueck").className = "rueck nein"; $("rueck").textContent = "Tippe zuerst eine Zahl."; return; }
    const antwort = a.art === "wahl" ? wert : String(parseInt(lauf.eingabe, 10));
    const luecke = $("luecke"), rueck = $("rueck");
    if (a.art === "wahl" && luecke) luecke.textContent = wert;

    if (antwort === a.antwort) {
      lauf.gesperrt = true;
      if (!lauf.ergebnis[lauf.pos]) lauf.ergebnis[lauf.pos] = "gut";
      if (lauf.einstufung || lauf.lernstand) lauf.erst[lauf.pos] = lauf.versuch === 0;
      if (lauf.versuch === 0 && !a.wieder) { statistik(a, true); C() && C().gib("mathe", 1); if (KN()) KN().melde(lzVon(a.station), true); }
      if (luecke) luecke.className = "luecke richtig";
      markiereWahl(wert, true);
      rueck.className = "rueck gut"; rueck.textContent = LOB[Math.floor(Math.random() * LOB.length)];
      S.ton("juhu");
      const dieser = lauf; setTimeout(() => { if (lauf === dieser) naechste(); }, 950); // nicht weiterblättern, wenn inzwischen eine andere Runde läuft
      return;
    }

    lauf.versuch++;
    if (lauf.versuch === 1 && !a.wieder) {
      statistik(a, false);
      if (KN()) {
        KN().melde(lzVon(a.station), false);
        // Zwei Fehler in Folge beim selben Lernziel: einmal je Runde eine leichtere Aufgabe von der Station davor einschieben
        if (!lauf.bruecke && !lauf.einstufung && !lauf.lernstand && !lauf.training && lauf.nr > 0 && KN().brauchtLeichter(lzVon(a.station))) {
          const vorher = ST[lauf.nr - 1], leicht = window.Mathe.runde(vorher.id, 1)[0];
          if (leicht) { lauf.bruecke = true; lauf.liste.splice(lauf.pos + 1, 0, Object.assign(leicht, { station: vorher.id, wieder: true, bruecke: true })); }
        }
      }
    }
    S.ton("nein");
    if (luecke) { luecke.className = "luecke falsch"; }
    markiereWahl(wert, false);
    if (lauf.versuch === 1) {
      rueck.className = "rueck nein"; rueck.textContent = "Fast! Versuch es nochmal.";
      lauf.gesperrt = true;
      setTimeout(() => {
        lauf.gesperrt = false; lauf.eingabe = "";
        if (a.art === "wahl") { if (luecke) { luecke.className = "luecke leer"; luecke.textContent = ""; } zeigeEingabe(a); }
        else aktualisiereLuecke();
      }, 750);
      return;
    }

    // Zweiter Fehler: Lösung und Rechenweg zeigen, Aufgabe kommt am Ende nochmal
    lauf.gesperrt = true;
    if (!lauf.ergebnis[lauf.pos]) { lauf.ergebnis[lauf.pos] = "nochmal"; lauf.fehler++; }
    if (!a.wieder && !lauf.einstufung && !lauf.lernstand) lauf.liste.push(Object.assign({}, a, { wieder: true }));
    rueck.className = "rueck"; rueck.textContent = "";
    if (luecke) { luecke.className = "luecke loesung"; luecke.textContent = a.antwort; }
    $("hilfe-platz").innerHTML = `<div class="hilfe"><b>Die Lösung ist ${a.antwort}${a.einheit ? " " + a.einheit : ""}.</b>${a.hilfe}</div>`;
    $("eingabe").innerHTML = `<button class="knopf weiter" id="weiter">Weiter</button>`;
    $("weiter").addEventListener("click", () => { S.ton("tipp"); naechste(); });
    zeigePunkte();
  }

  function markiereWahl(wert, gut) {
    document.querySelectorAll(".wahl-tasten .taste").forEach(t => {
      if (t.dataset.wert === wert) t.style.background = gut ? "var(--minze)" : "#FFE1DD";
      if (gut) t.disabled = true;
    });
  }

  function naechste() {
    if (lauf.einstufung && einstufungPruefen()) return beendeEinstufung();
    lauf.pos++;
    if (lauf.pos < lauf.liste.length) zeigeAufgabe();
    else beende();
  }

  // ---------- Ende ----------
  function beendeTraining() {
    const { fehler, liste } = lauf, gesamt = liste.filter(a => !a.wieder).length;
    C() && C().gib("mathe", 3);
    C() && C().ereignis("training-fertig");
    $("ende-titel").textContent = fehler === 0 ? "Training perfekt!" : "Training geschafft!";
    const sterne = fehler === 0 ? 3 : fehler <= 2 ? 2 : 1;
    $("ende-sterne").innerHTML = [1, 2, 3].map(n => `<span class="${n <= sterne ? "" : "leer"}" style="animation-delay:${n * 180}ms">⭐</span>`).join("");
    $("ende-text").textContent = `${gesamt - fehler} von ${gesamt} beim ersten Mal richtig. Geübt: ${lauf.themen.join(" und ")}.`;
    $("ende-gewinn").textContent = `Du hast jetzt ${S.sterne()} Sterne.`;
    const k = $("ende-knoepfe"); k.innerHTML = "";
    const knopf = (text, haupt, fn) => { const b = document.createElement("button"); b.className = "knopf" + (haupt ? " haupt" : ""); b.textContent = text; b.addEventListener("click", () => { S.ton("tipp"); fn(); }); k.appendChild(b); };
    knopf("Zurück zu meiner Ecke", true, () => { location.href = "../ich/"; });
    knopf("Zum Matheweg", false, () => { history.replaceState(null, "", "./"); zeige("weg"); zeichneWeg(); });
    zeige("ende");
    S.ton("juhu");
  }

  function beende() {
    if (lauf.training) return beendeTraining();
    if (lauf.lernstand) return beendeLernstand();
    const { station, nr, fehler } = lauf;
    const sterne = fehler === 0 ? 3 : fehler <= 2 ? 2 : 1;
    const vorher = bestes(station.id);
    let gewinn = Math.max(0, sterne - vorher);
    if (vorher === 3 && sterne === 3) gewinn = 1; // Bonus fürs fehlerfreie Üben
    merke(station.id, sterne);
    if (gewinn) S.gibSterne(gewinn);
    if (sterne > vorher && window.Lernfunde) Lernfunde.merke({ fach: "mathe", art: vorher ? "besser" : "neu", e: station.e || "🧮",
      text: vorher ? `${station.name}: jetzt ${sterne} ${sterne === 1 ? "Stern" : "Sterne"} statt ${vorher}` : `Neu geschafft: ${station.name}`, schluessel: "s:" + station.id });
    if (C()) { C().gib("mathe", sterne === 3 ? 5 : 3); C().ereignis("mathe-runde"); }

    $("ende-titel").textContent = sterne === 3 ? "Super gemacht!" : sterne === 2 ? "Toll geschafft!" : "Geschafft!";
    $("ende-sterne").innerHTML = [1, 2, 3].map(n => `<span class="${n <= sterne ? "" : "leer"}" style="animation-delay:${n * 180}ms">⭐</span>`).join("");
    $("ende-text").textContent = fehler === 0 ? "Alles beim ersten Mal richtig." : `${10 - fehler} von 10 Aufgaben beim ersten Mal richtig.`;
    $("ende-gewinn").textContent = gewinn
      ? `+${gewinn} ${gewinn === 1 ? "Stern" : "Sterne"} für den Kleiderschrank. Du hast jetzt ${S.sterne()}.`
      : `Du hast ${S.sterne()} Sterne. Mit 3 Sternen hier gibt es noch mehr.`;
    const k = $("ende-knoepfe"); k.innerHTML = "";
    const knopf = (text, haupt, fn) => { const b = document.createElement("button"); b.className = "knopf" + (haupt ? " haupt" : ""); b.textContent = text; b.addEventListener("click", () => { S.ton("tipp"); fn(); }); k.appendChild(b); };
    if (nr + 1 < ST.length) knopf(`Weiter zu: ${ST[nr + 1].name}`, true, () => starte(nr + 1));
    knopf("Nochmal üben", nr + 1 >= ST.length, () => starte(nr));
    knopf("Zum Matheweg", false, () => { zeige("weg"); zeichneWeg(); });
    zeige("ende");
    S.ton("juhu");
  }

  // ---------- Bedienung ----------
  document.addEventListener("click", (e) => {
    const t = e.target.closest(".taste"); if (!t || !lauf) return;
    if (t.dataset.ziffer) tippe(t.dataset.ziffer);
    else if (t.dataset.tun === "weg") loesche();
    else if (t.dataset.tun === "ok") pruefe();
    else if (t.dataset.wert) pruefe(t.dataset.wert);
  });
  document.addEventListener("keydown", (e) => {
    if ($("rechnen-ansicht").hidden || !lauf) return;
    const a = lauf.liste[lauf.pos];
    if (/^[0-9]$/.test(e.key) && a.art === "zahl") tippe(e.key);
    else if (e.key === "Backspace") loesche();
    else if (e.key === "Enter") { const w = $("weiter"); if (w) w.click(); else if (a.art === "zahl") pruefe(); }
  });
  $("zum-weg").addEventListener("click", () => { S.ton("tipp"); lauf = null; zeige("weg"); zeichneWeg(); });
  let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { if (!$("weg-ansicht").hidden) zeichneWeg(); }, 150); });

  zeichneWeg();
  if (new URLSearchParams(location.search).has("training")) starteTraining();
  window.__mathe = { faellig, tagIn, starteEinstufung, starteLernstand, zeige: (n) => { lauf.pos = n; zeigeAufgabe(); }, antworte: (w) => { const a = lauf.liste[lauf.pos]; if (a.art === "zahl") { lauf.eingabe = String(w); pruefe(); } else pruefe(String(w)); }, starte, starteTraining, zeigeUrkunde, get lauf() { return lauf; } }; // für Tests
})();
