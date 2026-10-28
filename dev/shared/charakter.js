// Charakter-Entwicklung: Fähigkeiten mit Stufen, Belohnungen, Tagesaufgaben und Kalender.
// Wird auf allen Seiten nach core.js geladen. Alle Daten liegen in profil.daten.charakter.
(function () {
  const S = window.Spielwelt;
  if (!S) return;

  // ---------- Fähigkeiten ----------
  const FAEHIGKEITEN = [
    { id: "mathe", name: "Rechen-Kraft", icon: "🧮", farbe: "#2FA37C", woher: "Mathe" },
    { id: "deutsch", name: "Wort-Zauber", icon: "🪄", farbe: "#E0574A", woher: "Abenteuer und Wort des Tages" },
    { id: "tablet", name: "Tablet-Klugheit", icon: "📱", farbe: "#2F86C8", woher: "Tablet-Führerschein" },
    { id: "entdecker", name: "Entdecker-Mut", icon: "🧭", farbe: "#D08A1E", woher: "3D-Welt" },
    { id: "sachkunde", name: "Welt-Wissen", icon: "🌍", farbe: "#1F8F8A", woher: "Sachunterricht mit Eule Ella" },
    { id: "kreativ", name: "Kreativ-Funke", icon: "🎨", farbe: "#C2337A", woher: "Atelier mit Papagei Paula" },
    { id: "englisch", name: "Englisch-Ohr", icon: "🦜", farbe: "#2F86C8", woher: "Englisch mit Papagei Paula" },
    // Sorbisch (28.10.2026): nur sichtbar, wenn die Eltern Sorbisch eingeschaltet haben
    { id: "sorbisch", name: "Sorbisch-Ohr", icon: "🪺", farbe: "#1F8F8A", woher: "Sorbisch mit Papagei Paula", nurMitWahl: () => !!(((S.lade("eltern") || {}).sorbisch || {}).an) }
  ];
  // Erfahrung, die für Stufe 1…10 nötig ist
  const STUFEN_XP = [0, 10, 25, 45, 70, 100, 140, 190, 250, 320];
  const MAX = STUFEN_XP.length;

  // Belohnung je Stufe: sterne, frei (Teil im Anziehspiel), vorteil (wirkt in Spielen), text
  const BELOHNUNGEN = {
    mathe: {
      2: { sterne: 2 }, 3: { vorteil: "ballon-zeit-5", text: "Ballon-Party: 5 Sekunden mehr Zeit" },
      4: { frei: "anziehen.rechenkrone", text: "Neues Extra: Rechen-Krone" }, 5: { sterne: 3 },
      6: { vorteil: "ballon-zeit-10", text: "Ballon-Party: 10 Sekunden mehr Zeit" }, 7: { sterne: 3 },
      8: { vorteil: "ballon-gold", text: "Ballon-Party: doppelt so viele goldene Sterne" }, 9: { sterne: 4 },
      10: { sterne: 5, text: "Titel: Rechen-Profi" }
    },
    deutsch: {
      2: { frei: "anziehen.fuchsohren", text: "Neues Extra: Fuchs-Ohren" }, 3: { sterne: 2 },
      4: { vorteil: "insel-magnet", text: "Insel: Sternen-Magnet – Sterne fliegen zu dir" }, 5: { sterne: 3 },
      6: { frei: "anziehen.buchstabenkleid", text: "Neues Kleid: Buchstaben-Kleid" }, 7: { sterne: 3 },
      8: { vorteil: "insel-glitzer", text: "Insel: Glitzerspur hinter dir" }, 9: { sterne: 4 },
      10: { sterne: 5, text: "Titel: Wort-Zauber-Profi" }
    },
    tablet: {
      2: { sterne: 2 }, 3: { vorteil: "schrank-18", text: "Kleiderschrank: Platz für 18 Looks" },
      4: { frei: "anziehen.pixelbrille", text: "Neues Extra: Pixel-Brille" }, 5: { sterne: 3 },
      6: { vorteil: "schrank-24", text: "Kleiderschrank: Platz für 24 Looks" }, 7: { sterne: 3 },
      8: { frei: "anziehen.pixelwelt", text: "Neuer Ort: Pixel-Welt" }, 9: { sterne: 4 },
      10: { sterne: 5, text: "Titel: Tablet-Profi" }
    },
    entdecker: {
      2: { vorteil: "schnell", text: "Insel: schneller laufen" }, 3: { sterne: 2 },
      4: { vorteil: "sprung", text: "Insel: höher springen" }, 5: { sterne: 3 },
      6: { frei: "anziehen.entdeckerhut", text: "Neues Extra: Entdecker-Hut" },
      7: { vorteil: "doppelsprung", text: "Insel: Doppelsprung in der Luft" }, 8: { sterne: 3 }, 9: { sterne: 4 },
      10: { sterne: 5, text: "Titel: Entdecker-Profi" }
    },
    sachkunde: {
      2: { frei: "anziehen.weihnachtsmuetze", text: "Neues Extra: Weihnachtsmütze" }, 3: { sterne: 2 },
      4: { sterne: 3 }, 5: { sterne: 3 }, 6: { sterne: 3 }, 7: { sterne: 3 }, 8: { sterne: 4 }, 9: { sterne: 4 },
      10: { sterne: 5, text: "Titel: Welt-Wissen-Profi" }
    },
    englisch: {
      2: { sterne: 2 }, 3: { sterne: 2 }, 4: { sterne: 3 }, 5: { sterne: 3 }, 6: { sterne: 3 }, 7: { sterne: 3 }, 8: { sterne: 4 }, 9: { sterne: 4 },
      10: { sterne: 5, text: "Titel: Englisch-Profi" }
    },
    sorbisch: {
      2: { sterne: 2 }, 3: { sterne: 2 }, 4: { sterne: 3 }, 5: { sterne: 3 }, 6: { sterne: 3 }, 7: { sterne: 3 }, 8: { sterne: 4 }, 9: { sterne: 4 },
      10: { sterne: 5, text: "Titel: Sorbisch-Profi" }
    },
    kreativ: {
      2: { sterne: 2 }, 3: { sterne: 2 }, 4: { sterne: 3 }, 5: { sterne: 3 }, 6: { sterne: 3 }, 7: { sterne: 3 }, 8: { sterne: 4 }, 9: { sterne: 4 },
      10: { sterne: 5, text: "Titel: Kreativ-Profi" }
    }
  };
  const belohnungsText = (b) => b.text || `${b.sterne} Sterne für den Kleiderschrank`;

  // ---------- Speicher ----------
  const pad = (n) => String(n).padStart(2, "0");
  function heute() {
    if (window.__heute) return window.__heute; // nur für Tests
    const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  function wocheVon(datum) { // Montag dieser Woche
    const [y, m, t] = datum.split("-").map(Number); const d = new Date(y, m - 1, t);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  function lade() {
    const d = Object.assign({ xp: {}, vorteile: [], stempel: [], wochen: [], tag: null }, S.lade("charakter") || {});
    if (!d.tag || d.tag.datum !== heute()) d.tag = { datum: heute(), ereignisse: {}, erledigt: [], fertig: false };
    return d;
  }
  function speichere(d) { S.speichere("charakter", d); }

  const stufeAus = (xp) => { let s = 1; for (let i = 0; i < MAX; i++) if (xp >= STUFEN_XP[i]) s = i + 1; return s; };

  // ---------- Anzeige für Belohnungen (oben, blockiert nicht) ----------
  const schlange = []; let zeigt = false;
  function hinweis(titel, text, farbe = "#4B2380") {
    schlange.push({ titel, text, farbe }); if (!zeigt) naechster();
  }
  function naechster() {
    const h = schlange.shift(); if (!h) { zeigt = false; return; }
    zeigt = true;
    let el = document.getElementById("belohnung");
    if (!el) {
      el = document.createElement("button"); el.id = "belohnung"; el.type = "button";
      el.style.cssText = "position:fixed;left:50%;top:max(12px,env(safe-area-inset-top));transform:translate(-50%,-160%);z-index:90;" +
        "max-width:min(560px,calc(100vw - 24px));border:0;border-radius:24px;padding:14px 22px;color:#fff;text-align:left;" +
        "font:500 1.1rem Fredoka,sans-serif;box-shadow:0 8px 0 rgba(0,0,0,.18);transition:transform .35s cubic-bezier(.3,1.4,.5,1);cursor:pointer";
      document.body.appendChild(el);
      el.addEventListener("click", () => schliesse());
    }
    el.style.background = h.farbe;
    el.innerHTML = `<b style="display:block;font-size:1.35rem;font-weight:700">${h.titel}</b>${h.text}`;
    requestAnimationFrame(() => { el.style.transform = "translate(-50%,0)"; });
    S.ton("juhu");
    clearTimeout(naechster._t); naechster._t = setTimeout(schliesse, 4200);
  }
  function schliesse() {
    const el = document.getElementById("belohnung"); if (!el) return;
    el.style.transform = "translate(-50%,-160%)"; clearTimeout(naechster._t);
    setTimeout(naechster, 400);
  }

  // ---------- Erfahrung geben ----------
  function gib(id, n) {
    if (!n) return;
    const d = lade(), vorher = d.xp[id] || 0, nachher = vorher + n;
    d.xp[id] = nachher;
    const s0 = stufeAus(vorher), s1 = stufeAus(nachher);
    const f = FAEHIGKEITEN.find(x => x.id === id);
    for (let s = s0 + 1; s <= s1; s++) {
      const b = BELOHNUNGEN[id][s] || { sterne: 2 };
      if (b.sterne) S.gibSterne(b.sterne);
      if (b.frei) S.schalteFrei(b.frei, 0);
      if (b.vorteil && !d.vorteile.includes(b.vorteil)) d.vorteile.push(b.vorteil);
      hinweis(`${f.icon} ${f.name}: Stufe ${s}!`, belohnungsText(b), f.farbe);
    }
    speichere(d);
  }

  // ---------- Tagesaufgaben ----------
  function zufall(seed) { // gleiche Aufgaben für den ganzen Tag
    let h = 1779033703 ^ seed.length;
    for (let i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    return () => { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
  }
  const WECHSEL = [
    { id: "ballon", emoji: "🎈", titel: "Ballon-Party", text: "Spiele eine Runde Ballon-Party.", ereignis: "ballon-runde", skill: "entdecker", link: "../welt3d/ballons.html", dreiD: true },
    { id: "insel", emoji: "🏝️", titel: "Insel-Schatz", text: "Finde den Schatz auf der Insel.", ereignis: "insel-schatz", skill: "entdecker", link: "../welt3d/insel.html", dreiD: true },
    { id: "foto", emoji: "📸", titel: "Neuer Look", text: "Zieh deiner Figur etwas an und mach ein Foto.", ereignis: "anziehen-foto", skill: "tablet", link: "../anziehen/" },
    { id: "kapitel", emoji: "🦊", titel: "Abenteuer", text: "Spiele ein Kapitel mit Fipsi (auch eins von früher).", ereignis: "deutsch-kapitel", skill: "deutsch", link: "../deutsch/" },
    { id: "lektion", emoji: "🪪", titel: "Tablet-Profi", text: "Mach eine Lektion im Tablet-Führerschein.", ereignis: "tablet-lektion", skill: "tablet", link: "../medien/" },
    { id: "thema", emoji: "🦉", titel: "Sachunterricht", text: "Entdecke mit Eule Ella ein Thema (auch eins von früher).", ereignis: "sachkunde-thema", skill: "sachkunde", link: "../sachkunde/" },
    { id: "station", emoji: "🗺️", titel: "Matheweg", text: "Spiele eine Station auf dem Matheweg.", ereignis: "mathe-runde", skill: "mathe", link: "../mathe/" }
  ];
  function aufgaben() {
    const d = lade(), r = zufall(d.tag.datum + "|" + (S.profil.name || ""));
    const m = S.lade("medien"), dreiD = S.offen(m && m.fuehrerschein);
    const auswahl = WECHSEL.filter(w => !w.dreiD || (dreiD && !S.MINISPIELE_AUS));   // Minispiele ausgeblendet → keine Aufgabe dafür
    const dritte = auswahl[Math.floor(r() * auswahl.length)];
    const liste = [
      { id: "training", emoji: "🧮", titel: "Mathe-Training", text: "8 Aufgaben – genau die, die noch schwer sind.", ereignis: "training-fertig", skill: "mathe", link: "../mathe/?training=1" },
      // In den Ferien (NA-61): statt neuem Wort etwas Echtes draußen – Wiederholen statt neuem Stoff
      S.ferienModus && S.ferienModus() ? { id: "echtewelt", emoji: "🌍", titel: "Ferien-Idee", text: "Probiere eine Echte-Welt-Idee aus – draußen oder mit deiner Familie.", ereignis: "echtewelt", skill: "entdecker", link: "#echte-welt" }
        : { id: "wort", emoji: "📖", titel: "Wort des Tages", text: "Lerne ein neues Wort und löse 5 Wort-Rätsel.", ereignis: "wort-fertig", skill: "deutsch", link: "#wort" },
      dritte
    ];
    return liste.map(a => Object.assign({}, a, { erledigt: d.tag.erledigt.includes(a.id) }));
  }

  // Haustier: Leckerli für Spiele, Wärme fürs Ei bei Tagesaufgaben
  const LECKERLI = { "training-fertig": 2, "wort-fertig": 2, "mathe-runde": 1, "deutsch-kapitel": 1, "tablet-lektion": 1, "ballon-runde": 1, "insel-schatz": 1, "sachkunde-thema": 1, "sorbisch-lektion": 1, "englisch-lektion": 1 };
  function tierGib(leckerli, waerme) {
    const t = S.lade("tier"); if (!t || !t.phase) return null;
    if (leckerli && t.phase === "tier") t.leckerli = Math.min(99, (t.leckerli || 0) + leckerli);
    if (waerme && t.phase === "ei") t.waerme = Math.min(3, (t.waerme || 0) + waerme);
    S.speichere("tier", t); return t;
  }

  function ereignis(name, n = 1) {
    const d = lade();
    d.tag.ereignisse[name] = (d.tag.ereignisse[name] || 0) + n;
    speichere(d);
    if (LECKERLI[name]) {
      const t = tierGib(LECKERLI[name], 0);
      if (t && t.phase === "tier") hinweis(`🍪 +${LECKERLI[name]} Leckerli`, `für ${t.name || "dein Tier"}`, "#E8A33D");
    }
    const liste = aufgaben();
    liste.forEach(a => {
      const dd = lade();
      if (a.ereignis === name && !dd.tag.erledigt.includes(a.id)) {
        dd.tag.erledigt.push(a.id); speichere(dd);
        S.gibSterne(1);
        const t = tierGib(0, 1);
        hinweis("✅ Tagesaufgabe geschafft!", `${a.titel}: +1 ⭐` + (t && t.phase === "ei" ? " – und dein Ei wird wärmer! 🔥" : ""), "#2FA37C");
        gib(a.skill, 4);
      }
    });
    const d2 = lade();
    if (!d2.tag.fertig && liste.every(a => d2.tag.erledigt.includes(a.id))) {
      d2.tag.fertig = true;
      if (!d2.stempel.includes(d2.tag.datum)) d2.stempel.push(d2.tag.datum);
      d2.stempel = d2.stempel.slice(-120);
      speichere(d2);
      S.gibSterne(2);
      hinweis("🏅 Alle Tagesaufgaben geschafft!", "Ein Stempel im Kalender und +2 ⭐", "#C2337A");
      if (wochenTruhe().bereit) hinweis("🎁 Die Wochentruhe ist bereit!", "Öffne sie auf der Seite „Meine Ecke“.", "#D08A1E");
    }
  }

  function wochenTruhe() {
    const d = lade(), w = wocheVon(heute());
    const tage = d.stempel.filter(t => wocheVon(t) === w).length;
    return { woche: w, tage, ziel: 5, bereit: tage >= 5 && !d.wochen.includes(w), offen: d.wochen.includes(w) };
  }
  function oeffneTruhe() {
    const t = wochenTruhe(); if (!t.bereit) return 0;
    const d = lade(); d.wochen.push(t.woche); d.wochen = d.wochen.slice(-60); speichere(d);
    S.gibSterne(5); return 5;
  }

  // ---------- Abfragen ----------
  const Charakter = {
    FAEHIGKEITEN, BELOHNUNGEN, STUFEN_XP, MAX,
    sichtbareFaehigkeiten: () => FAEHIGKEITEN.filter(f => !f.nurMitWahl || f.nurMitWahl()),
    heute, wocheVon,
    xp: (id) => lade().xp[id] || 0,
    stufe: (id) => stufeAus(lade().xp[id] || 0),
    fortschritt(id) { // Anteil bis zur nächsten Stufe
      const x = lade().xp[id] || 0, s = stufeAus(x);
      if (s >= MAX) return { stufe: s, anteil: 1, fehlt: 0, naechste: null };
      const a = STUFEN_XP[s - 1], b = STUFEN_XP[s];
      return { stufe: s, anteil: (x - a) / (b - a), fehlt: b - x, naechste: belohnungsText(BELOHNUNGEN[id][s + 1] || { sterne: 2 }) };
    },
    gesamt() { return FAEHIGKEITEN.reduce((n, f) => n + stufeAus(lade().xp[f.id] || 0), 0); },
    titel() {
      const g = Charakter.gesamt(), a = S.kind().geschlecht;
      const t = (w, m, n) => a === "w" ? w : a === "m" ? m : n;
      if (g >= 42) return t("Superheldin", "Superheld", "Super-Star");
      if (g >= 32) return t("Meisterin", "Meister", "Lern-Profi");
      if (g >= 22) return t("Schlaue Heldin", "Schlauer Held", "Schlauer Kopf");
      if (g >= 12) return t("Entdeckerin", "Entdecker", "Entdecker-Herz");
      return t("Abenteuer-Anfängerin", "Abenteuer-Anfänger", "Neu im Abenteuer");
    },
    hat: (vorteil) => lade().vorteile.includes(vorteil),
    gib, ereignis, aufgaben, wochenTruhe, oeffneTruhe, hinweis,
    tag: () => lade().tag,
    stempel: () => lade().stempel.slice()
  };
  window.Charakter = Charakter;
})();
