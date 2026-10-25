(function () {
  const S = window.Spielwelt, ST = window.Mathe.STATIONEN;
  const $ = (id) => document.getElementById(id);
  const LOB = ["Richtig!", "Super!", "Klasse!", "Genau!", "Toll gerechnet!", "Spitze!", "Prima!"];

  // ---------- Fortschritt ----------
  const daten = () => { const d = S.lade("mathe") || {}; d.k2 = d.k2 || {}; return d; };
  const bestes = (id) => daten().k2[id] || 0;
  const istOffen = (i) => S.offen(i === 0 || bestes(ST[i - 1].id) > 0);
  function merke(id, sterne) {
    const d = daten(); d.k2[id] = Math.max(d.k2[id] || 0, sterne); S.speichere("mathe", d);
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
      const { station, text, antwort, art, optionen, frage, einheit, hilfe, nurLuecke, wort } = a;
      d.fehler = d.fehler.filter(x => x.text !== text);
      d.fehler.push({ station, text, antwort, art, optionen, frage, einheit, hilfe, nurLuecke, wort, am: Date.now(), stufe: 1, faellig: tagIn(ABSTAND[1]) });
      d.fehler = d.fehler.slice(-40);
    }
    if (richtig && a.ausFehler) {
      const f = d.fehler.find(x => x.text === a.text);
      if (f) {
        const stufe = (f.stufe || 1) + 1;
        if (stufe >= ABSTAND.length) { d.fehler = d.fehler.filter(x => x !== f); d.gelernt = (d.gelernt || 0) + 1; }
        else { f.stufe = stufe; f.faellig = tagIn(ABSTAND[stufe]); }
      }
    }
    S.speichere("mathe", d);
  }

  function zeige(name) {
    ["weg", "rechnen", "ende"].forEach(n => $(n + "-ansicht").hidden = n !== name);
    scrollTo(0, 0);
  }

  // ---------- Matheweg ----------
  function zeichneWeg() {
    $("sterne").textContent = S.sterne();
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
    let jetzt = ST.findIndex((s, i) => istOffen(i) && !bestes(s.id));

    karte.innerHTML = `<svg class="pfad" viewBox="0 0 ${breite} ${hoehe}" preserveAspectRatio="none">
      <path d="${d}" stroke="#B8E6D4" stroke-width="30" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${d}" stroke="#fff" stroke-width="6" stroke-dasharray="2 18" fill="none" stroke-linecap="round"/></svg>`;

    knoten.forEach((k, i) => {
      const b = document.createElement("button");
      b.style.left = pos[i][0] + "px"; b.style.top = pos[i][1] + "px";
      if (k.ziel) {
        const alle = ST.every(s => bestes(s.id) > 0);
        b.className = "station ziel" + (alle ? "" : " zu");
        b.innerHTML = `<span class="kreis">${alle ? "🎓" : "🔒"}</span><span class="name">3. Klasse</span><span class="stern-reihe"></span>`;
        b.addEventListener("click", () => { S.ton("tipp"); S.meldung(alle ? "Die 3. Klasse wird gerade gebaut." : "Schaffe alle Stationen, dann geht es in die 3. Klasse."); });
      } else {
        const offen = istOffen(i), best = bestes(k.s.id);
        b.className = "station" + (offen ? "" : " zu") + (i === jetzt ? " jetzt" : "");
        b.setAttribute("aria-label", `${i + 1}. ${k.s.name}${offen ? "" : ", noch gesperrt"}${best ? `, ${best} Sterne` : ""}`);
        b.innerHTML = `<span class="kreis">${offen ? k.s.icon : "🔒"}</span><span class="nr">${i + 1}</span><span class="name">${k.s.name}</span>` +
          `<span class="stern-reihe">${offen && best ? [1, 2, 3].map(n => `<span class="${n <= best ? "" : "leer"}">⭐</span>`).join("") : ""}</span>`;
        b.addEventListener("click", () => {
          if (!offen) { S.ton("nein"); S.meldung("Schaffe zuerst die Station davor."); return; }
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
  function starteTraining() {
    const d = daten(), stat = d.stat || {};
    const offen = ST.filter((s, i) => istOffen(i));
    const schwaeche = (id) => { const x = stat[id] || { r: 0, f: 0 }; return (x.f + 1) / (x.r + x.f + 2); };
    const schwach = offen.slice().sort((a, b) => schwaeche(b.id) - schwaeche(a.id) || Math.random() - 0.5).slice(0, 2);
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
      (a.frage ? `<p class="frage">${a.frage}</p>` : "") +
      (a.bild ? `<div class="bild">${a.bild}</div>` : "") +
      (a.art === "wahl" && a.nurLuecke ? "" : `<div class="ausdruck ${a.wort ? "wort" : ""}" id="ausdruck">${ausdruck}</div>`) +
      `<p class="rueck" id="rueck"></p><div id="hilfe-platz"></div>`;
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
      e.innerHTML = `<div class="wahl-tasten ${a.optionen.length === 3 ? "drei" : ""}">` +
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
    if (lauf.gesperrt || lauf.eingabe.length >= 3) return;
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
      if (lauf.versuch === 0 && !a.wieder) { statistik(a, true); C() && C().gib("mathe", 1); }
      if (luecke) luecke.className = "luecke richtig";
      markiereWahl(wert, true);
      rueck.className = "rueck gut"; rueck.textContent = LOB[Math.floor(Math.random() * LOB.length)];
      S.ton("juhu");
      setTimeout(naechste, 950);
      return;
    }

    lauf.versuch++;
    if (lauf.versuch === 1 && !a.wieder) statistik(a, false);
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
    if (!a.wieder) lauf.liste.push(Object.assign({}, a, { wieder: true }));
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
    knopf("Zurück zu Mein Ich", true, () => { location.href = "../ich/"; });
    knopf("Zum Matheweg", false, () => { history.replaceState(null, "", "./"); zeige("weg"); zeichneWeg(); });
    zeige("ende");
    S.ton("juhu");
  }

  function beende() {
    if (lauf.training) return beendeTraining();
    const { station, nr, fehler } = lauf;
    const sterne = fehler === 0 ? 3 : fehler <= 2 ? 2 : 1;
    const vorher = bestes(station.id);
    let gewinn = Math.max(0, sterne - vorher);
    if (vorher === 3 && sterne === 3) gewinn = 1; // Bonus fürs fehlerfreie Üben
    merke(station.id, sterne);
    if (gewinn) S.gibSterne(gewinn);
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
  window.__mathe = { faellig, tagIn, starte, starteTraining, get lauf() { return lauf; } }; // für Tests
})();
