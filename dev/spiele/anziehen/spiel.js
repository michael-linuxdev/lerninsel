(function () {
  const S = window.Spielwelt, P = window.Puppe;

  const HAUT = ["#FFE0C7", "#F6C9A3", "#E8B08A", "#C98D63", "#A0694A", "#6E4630"];
  const HAARFARBEN = ["#F4CD6A", "#D9A04E", "#A8693A", "#5C3A21", "#2A2230", "#C9542B", "#FF8CC6", "#9B6BE0", "#4FA8F0", "#6ED8B8"];
  const STOFF = ["#FF6F61", "#C2337A", "#FF9BC8", "#7B55B8", "#3AA0E0", "#5CCBA6", "#9BD34A", "#FFC83D", "#FFFFFF", "#2E2B47"];

  const KATEGORIEN = [
    { id: "figur", name: "Ich", icon: "🙂", teile: P.gesichter, farben: HAUT, platz: "figur" },
    { id: "haare", name: "Haare", icon: "💇‍♀️", teile: P.haare, farben: HAARFARBEN, platz: "haare" },
    { id: "oben", name: "Oben", icon: "👚", teile: P.oberteile, farben: STOFF, platz: "oberteil", leer: true },
    { id: "unten", name: "Unten", icon: "🩳", teile: P.unterteile, farben: STOFF, platz: "unterteil", leer: true },
    { id: "kleider", name: "Kleider", icon: "👗", teile: P.kleider, farben: STOFF, platz: "kleid", leer: true },
    { id: "schuhe", name: "Schuhe", icon: "👟", teile: P.schuhe, farben: STOFF, platz: "schuhe", leer: true },
    { id: "extras", name: "Extras", icon: "👑", teile: P.extras, farben: STOFF.concat(["#FFE27A"]), platz: "extras", mehrere: true },
    { id: "orte", name: "Orte", icon: "🏞️", teile: P.orte, farben: null, platz: "ort" }
  ];

  const STANDARD = window.Figur.STANDARD, zeichneFigur = window.Figur.zeichneFigur, zeichneBild = window.Figur.zeichneBild;
  const finde = (liste, id) => liste.find(t => t.id === id);

  // Kleine Vorschaubilder für die Auswahl
  const SICHT = { figur: "84 58 132 120", haare: "52 8 196 292", oben: "56 166 188 188", unten: "56 276 188 250", kleider: "40 176 220 390", schuhe: "92 448 116 120", orte: "0 0 460 620" };
  const EXTRA_SICHT = {
    kette: "100 172 100 74", schal: "104 168 92 120", tasche: "176 312 76 96", teddy: "190 340 66 84", armband: "62 318 44 36",
    zauberstab: "20 250 86 120", ballon: "10 150 90 210", krone: "90 16 120 70", einhorn: "84 0 132 110", hut: "48 14 204 86",
    muetze: "80 10 140 104", umhang: "44 170 212 330", fluegel: "0 90 300 290"
  };
  function vorschau(kat, teil, farbe) {
    const haut = (zustand.figur && zustand.figur.farbe) || HAUT[1];
    let inhalt = "", vb = SICHT[kat.id];
    switch (kat.id) {
      case "figur": inhalt = P.koerper.kopf(farbe) + teil.teil(); break;
      case "haare": inhalt = teil.hinten(farbe) + P.koerper.kopf(haut) + teil.vorne(farbe); break;
      case "oben": inhalt = teil.rumpf(farbe) + teil.aermel(farbe); break;
      case "unten": inhalt = teil.teil(farbe); break;
      case "kleider": inhalt = teil.rock(farbe) + teil.rumpf(farbe) + teil.aermel(farbe); break;
      case "schuhe": inhalt = teil.teil(farbe); break;
      case "orte": inhalt = teil.teil(); break;
      case "extras":
        vb = EXTRA_SICHT[teil.id] || "70 30 160 140";
        inhalt = (teil.ebene === "kopf" && !EXTRA_SICHT[teil.id] ? P.koerper.kopf(haut) : "") + teil.teil(farbe);
        break;
    }
    return `<svg viewBox="${vb}" aria-hidden="true">${inhalt}</svg>`;
  }

  // ---------- Zustand ----------
  const gespeichert = S.lade("anziehen") || {};
  let zustand = gespeichert.aktuell || STANDARD();
  let schrank = gespeichert.schrank || [];
  let katId = "haare";
  let aktivesExtra = null;
  const letzteFarbe = {};

  function sichern() { S.speichere("anziehen", { aktuell: zustand, schrank }); }

  // ---------- Oberfläche ----------
  const buehne = document.getElementById("buehne");
  const reiter = document.getElementById("reiter");
  const gitter = document.getElementById("teile");
  const farbLeiste = document.getElementById("farben");

  function zeigeBuehne(hopsen) {
    buehne.innerHTML = zeichneBild(zustand);
    if (hopsen) {
      const g = buehne.querySelector(".hopser");
      g.classList.add("hops");
    }
  }

  function zeigeReiter() {
    reiter.innerHTML = "";
    KATEGORIEN.forEach(k => {
      const b = document.createElement("button");
      b.className = "reiter" + (k.id === katId ? " aktiv" : "");
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", k.id === katId);
      b.innerHTML = `<span class="icon" aria-hidden="true">${k.icon}</span><span>${k.name}</span>`;
      b.addEventListener("click", () => { katId = k.id; aktivesExtra = null; S.ton("tipp"); zeigeReiter(); zeigeTeile(); zeigeFarben(); });
      reiter.appendChild(b);
    });
  }

  const kat = () => KATEGORIEN.find(k => k.id === katId);
  function gewaehlt(k) {
    if (k.mehrere) return null;
    const w = zustand[k.platz];
    return typeof w === "string" ? w : (w && w.id);
  }
  function farbeFuer(k, teil) {
    if (k.mehrere) return (zustand.extras[teil.id] && zustand.extras[teil.id].farbe) || teil.farbe;
    const w = zustand[k.platz];
    if (w && w.id === teil.id) return w.farbe;
    return letzteFarbe[k.id] || (w && w.farbe) || (k.farben ? k.farben[0] : null);
  }

  function zeigeTeile() {
    const k = kat();
    gitter.innerHTML = "";
    if (k.leer) {
      const b = document.createElement("button");
      b.className = "teil nichts" + (!gewaehlt(k) ? " aktiv" : "");
      b.setAttribute("aria-label", "Nichts");
      b.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="30" fill="none" stroke="#C9B8E6" stroke-width="8"/><path d="M29 71 71 29" stroke="#C9B8E6" stroke-width="8" stroke-linecap="round"/></svg><span>Nichts</span>`;
      b.addEventListener("click", () => { zustand[k.platz] = null; aenderung(); });
      gitter.appendChild(b);
    }
    k.teile.forEach(t => {
      const frei = (!t.preis && !t.belohnung) || S.istFrei("anziehen." + t.id);
      const an = k.mehrere ? !!zustand.extras[t.id] : gewaehlt(k) === t.id;
      const b = document.createElement("button");
      b.className = "teil" + (an ? " aktiv" : "") + (frei ? "" : " zu") + (k.id === "orte" ? " ort" : "");
      b.setAttribute("aria-pressed", an);
      b.setAttribute("aria-label", t.name + (frei ? "" : ", gesperrt"));
      b.innerHTML = vorschau(k, t, farbeFuer(k, t)) + `<span>${t.name}</span>` + (frei ? "" : t.belohnung ? `<em class="preis">🏅</em>` : `<em class="preis">🔒 ${t.preis} ⭐</em>`);
      b.addEventListener("click", () => waehle(k, t, frei));
      gitter.appendChild(b);
    });
  }

  function zeigeFarben() {
    const k = kat();
    farbLeiste.innerHTML = "";
    farbLeiste.hidden = !k.farben;
    if (!k.farben) return;
    let aktuell = null;
    if (k.mehrere) { if (aktivesExtra && zustand.extras[aktivesExtra]) aktuell = zustand.extras[aktivesExtra].farbe; }
    else { const w = zustand[k.platz]; aktuell = w && w.farbe; }
    if (k.mehrere) {
      const ex = aktivesExtra && zustand.extras[aktivesExtra] && P.extras.find(e => e.id === aktivesExtra);
      const l = document.createElement("span"); l.className = "farb-fuer";
      l.textContent = ex ? `Farbe für: ${ex.name}` : "Zieh ein Extra an, dann kannst du die Farbe ändern";
      farbLeiste.appendChild(l);
    }
    k.farben.forEach(f => {
      const b = document.createElement("button");
      b.className = "farbe" + (f === aktuell ? " aktiv" : "");
      b.style.setProperty("--f", f);
      b.setAttribute("aria-label", "Farbe " + f);
      b.addEventListener("click", () => faerbe(k, f));
      farbLeiste.appendChild(b);
    });
  }

  // Vor dem Ausgeben von Sternen nachfragen
  function frageKauf(t, k) {
    if (t.belohnung) { S.ton("nein"); S.meldung(`${t.name} bekommst du bei ${t.belohnung}. Schau unter „Meine Ecke“.`); return; }
    const hat = S.sterne(), fehlt = t.preis - hat;
    const d = document.getElementById("kauf");
    document.getElementById("kauf-bild").innerHTML = vorschau(k, t, farbeFuer(k, t));
    document.getElementById("kauf-titel").textContent = t.name;
    const text = document.getElementById("kauf-text"), ja = document.getElementById("kauf-ja"), nein = document.getElementById("kauf-nein");
    if (fehlt > 0) {
      text.innerHTML = `Das kostet <b>${t.preis} ⭐</b>. Du hast ${hat} ⭐.<br>Dir fehlen noch <b>${fehlt} ${fehlt === 1 ? "Stern" : "Sterne"}</b>. Sterne gibt es in Mathe, im Abenteuer, im Tablet-Führerschein und in der 3D-Welt.`;
      ja.hidden = true; nein.textContent = "Okay";
      S.ton("nein");
    } else {
      text.innerHTML = `Möchtest du <b>${t.preis} ⭐</b> ausgeben, um es freizuschalten?<br>Du hast ${hat} ⭐, danach noch ${hat - t.preis} ⭐.`;
      ja.hidden = false; nein.textContent = "Nein, lieber nicht";
      S.ton("tipp");
    }
    d.hidden = false;
    ja.onclick = () => {
      d.hidden = true;
      if (S.schalteFrei("anziehen." + t.id, t.preis)) { S.ton("juhu"); S.meldung(t.name + " ist jetzt frei!"); zeigeSterne(); waehle(k, t, true); }
    };
    nein.onclick = () => { d.hidden = true; S.ton("tipp"); };
  }
  function zeigeSterne() { const el = document.getElementById("sterne-zahl"); if (el) el.textContent = S.sterne(); }

  function waehle(k, t, frei) {
    if (!frei) { frageKauf(t, k); return; }
    if (k.mehrere) {
      // Ein Tipp zieht ein getragenes Extra aus, ein Tipp auf ein neues zieht es an
      if (zustand.extras[t.id]) {
        delete zustand.extras[t.id];
        const rest = Object.keys(zustand.extras);
        aktivesExtra = rest.length ? rest[rest.length - 1] : null;
      } else { zustand.extras[t.id] = { farbe: t.farbe }; aktivesExtra = t.id; }
    } else if (k.id === "orte") {
      zustand.ort = t.id;
    } else {
      const w = zustand[k.platz];
      if (k.leer && w && w.id === t.id) zustand[k.platz] = null;
      else zustand[k.platz] = { id: t.id, farbe: farbeFuer(k, t) };
      if (k.id === "kleider" && zustand.kleid) { zustand.oberteil = null; zustand.unterteil = null; }
      if ((k.id === "oben" || k.id === "unten") && zustand[k.platz]) zustand.kleid = null;
    }
    aenderung();
  }

  function faerbe(k, f) {
    letzteFarbe[k.id] = f;
    if (k.mehrere) {
      if (aktivesExtra && zustand.extras[aktivesExtra]) zustand.extras[aktivesExtra].farbe = f;
      else { S.ton("tipp"); S.meldung("Tippe zuerst auf ein Extra."); zeigeTeile(); return; }
    } else if (k.id === "figur") {
      zustand.figur.farbe = f;
    } else if (zustand[k.platz]) {
      zustand[k.platz].farbe = f;
    } else {
      S.ton("tipp"); zeigeTeile(); zeigeFarben(); return; // Farbe gilt für das nächste Teil
    }
    aenderung();
  }

  function funkeln() {
    const box = document.getElementById("buehnen-box");
    for (let i = 0; i < 6; i++) {
      const s = document.createElement("span");
      s.className = "funke"; s.textContent = "✦";
      s.style.left = (30 + Math.random() * 40) + "%";
      s.style.top = (15 + Math.random() * 60) + "%";
      s.style.animationDelay = (i * 40) + "ms";
      box.appendChild(s);
      setTimeout(() => s.remove(), 900);
    }
  }

  function aenderung() {
    S.ton("wahl");
    zeigeBuehne(true); zeigeTeile(); zeigeFarben(); funkeln(); sichern();
  }

  // ---------- Knöpfe ----------
  const zufall = (a) => a[Math.floor(Math.random() * a.length)];
  const frei = (liste) => liste.filter(t => (!t.preis && !t.belohnung) || S.istFrei("anziehen." + t.id));

  document.getElementById("zufall").addEventListener("click", () => {
    const o = STANDARD();
    o.ort = zufall(frei(P.orte)).id;
    o.figur = { id: zufall(P.gesichter).id, farbe: zustand.figur.farbe };
    o.haare = { id: zufall(P.haare).id, farbe: zufall(HAARFARBEN) };
    if (Math.random() < 0.4) { o.kleid = { id: zufall(frei(P.kleider)).id, farbe: zufall(STOFF) }; o.oberteil = null; o.unterteil = null; }
    else { o.oberteil = { id: zufall(P.oberteile).id, farbe: zufall(STOFF) }; o.unterteil = { id: zufall(P.unterteile).id, farbe: zufall(STOFF) }; }
    o.schuhe = { id: zufall(P.schuhe).id, farbe: zufall(STOFF) };
    const ex = frei(P.extras).sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3));
    ex.forEach(e => o.extras[e.id] = { farbe: e.farbe });
    zustand = o; aktivesExtra = null;
    aenderung();
  });

  document.getElementById("neu").addEventListener("click", () => {
    zustand = STANDARD(); aktivesExtra = null; aenderung();
  });

  document.getElementById("foto").addEventListener("click", () => {
    schrank.unshift(JSON.parse(JSON.stringify(zustand)));
    const C = window.Charakter;
    schrank = schrank.slice(0, C && C.hat("schrank-24") ? 24 : C && C.hat("schrank-18") ? 18 : 12);
    if (C) C.ereignis("anziehen-foto");
    sichern();
    S.ton("juhu");
    const blitz = document.getElementById("blitz");
    blitz.classList.remove("an"); void blitz.offsetWidth; blitz.classList.add("an");
    S.meldung("Im Kleiderschrank gespeichert!");
  });

  // ---------- Kleiderschrank ----------
  const dialog = document.getElementById("schrank");
  const liste = document.getElementById("schrank-liste");
  function zeigeSchrank() {
    liste.innerHTML = "";
    if (!schrank.length) {
      liste.innerHTML = `<p class="leer">Noch leer. Zieh etwas an und tippe auf „Foto“.</p>`;
      return;
    }
    schrank.forEach((o, i) => {
      const k = document.createElement("div");
      k.className = "look";
      k.innerHTML = `<button class="anziehen" aria-label="Look ${i + 1} anziehen"><svg viewBox="0 0 460 620">${zeichneBild(o)}</svg></button>
        <div class="look-knoepfe">
          <button class="mini" data-bild aria-label="Als Bild speichern">⬇️</button>
          <button class="mini" data-weg aria-label="Löschen">🗑️</button>
        </div>`;
      k.querySelector(".anziehen").addEventListener("click", () => { zustand = JSON.parse(JSON.stringify(o)); dialog.hidden = true; aenderung(); });
      k.querySelector("[data-weg]").addEventListener("click", () => { schrank.splice(i, 1); sichern(); S.ton("tipp"); zeigeSchrank(); });
      k.querySelector("[data-bild]").addEventListener("click", () => alsBild(o));
      liste.appendChild(k);
    });
  }
  document.getElementById("schrank-auf").addEventListener("click", () => { S.ton("tipp"); zeigeSchrank(); dialog.hidden = false; });
  document.getElementById("schrank-zu").addEventListener("click", () => { S.ton("tipp"); dialog.hidden = true; });

  function alsBild(o) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 620" width="920" height="1240">${zeichneBild(o)}</svg>`;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = 920; c.height = 1240;
      c.getContext("2d").drawImage(img, 0, 0, 920, 1240);
      c.toBlob(async (blob) => {
        const name = (S.profil.name || "mein") + "-look.png";
        const datei = new File([blob], name, { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [datei] })) {
          try { await navigator.share({ files: [datei], title: "Mein Look" }); return; } catch (e) { if (e.name === "AbortError") return; }
        }
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob); a.download = name; a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      }, "image/png");
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  // ---------- Start ----------
  if (S.profil.name) document.getElementById("titel").textContent = S.genitiv() + " Kleiderschrank";
  zeigeSterne();
  zeigeBuehne(false); zeigeReiter(); zeigeTeile(); zeigeFarben();
  window.__anziehen = { zeichneBild, STANDARD }; // für Tests
})();
