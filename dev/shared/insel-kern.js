// Insel-Kern (NA-24): alles an der Heimatinsel, was NICHT Zeichnen ist – für beide Looks („Rund“ mit three.js, „Pixel“ mit PixiJS).
// Eine Welt, zwei Darstellungen: Orte, Plätze, Stationen, Nachbarn mit Texten, Sonnenuhr, Nebelstufe, Weihnachtspaket, Zimmer-Daten,
// Wetter-Daten und die Reihenfolge der Story-Szenen gibt es nur hier. Die Looks lesen nur aus dem Kern und zeichnen.
// Keine Abhängigkeit von DOM-Zeichnen oder einer Engine; Spielwelt, Story, Zeit, Lernfunde, TierPflege werden erst beim Aufruf gelesen
// (so läuft der Kern auch im Node-Test, tests/inselkern.js).
//
// Koordinaten: Weltmaß der runden Insel (x nach rechts, z nach vorn/Süden, 1 Einheit ≈ 1 Schritt). Die Pixel-Insel rechnet sie in Kacheln um.
(function (W) {
  "use strict";
  const S = () => W.Spielwelt;

  // ======================================================================================================
  // Welt aus Wünschen + seed (früher quellen/welt3d/welt.js; dort jetzt nur noch ein Weiterleiter)
  // wuensche = { biom, farbe, groesse, huegel, see, blumen, seed, name }
  // Ergebnis: { insel, R, biom, farben, hoehe(x,z), plaetze{…}, baeume[], steine[], blumen[], see, pfad[] }
  // ======================================================================================================
  const BIOME = {
    wiese:  { name: "Blumenwiese", e: "🌼", gras: "#7CCB5B", sand: "#F2D9A2", fels: "#A7A9B8", baum: "laub",  baeume: 10, steine: 4, blumen: 40, huegel: 0.9 },
    wald:   { name: "Wald",        e: "🌲", gras: "#5DB04F", sand: "#E6D3A0", fels: "#9C9EAD", baum: "misch", baeume: 30, steine: 6, blumen: 14, huegel: 1.2 },
    berge:  { name: "Berge",       e: "⛰️", gras: "#79BE5E", sand: "#D8CBB0", fels: "#9A98A6", baum: "nadel", baeume: 14, steine: 14, blumen: 12, huegel: 3.0 },
    strand: { name: "Strand",      e: "🏖️", gras: "#8FD46A", sand: "#F6E1A6", fels: "#B9B4A6", baum: "palme", baeume: 8,  steine: 4, blumen: 10, huegel: 0.45, sandRand: 4.5 },
    schnee: { name: "Schneeland",  e: "❄️", gras: "#EEF5FB", sand: "#E9EEF4", fels: "#B4BCCB", baum: "nadel", baeume: 16, steine: 8, blumen: 0,  huegel: 1.6, winter: true },
    wueste: { name: "Wüste",       e: "🌵", gras: "#EBCB86", sand: "#F2D9A2", fels: "#C99A6B", baum: "kaktus", baeume: 10, steine: 9, blumen: 6, huegel: 1.1 }
  };
  const GROESSEN = { klein: 15.2, mittel: 20, gross: 25 };
  const HUEGEL = { wenig: 0.35, mittel: 1, viel: 1.8 };

  // Die bisherige Insel (alle Koordinaten wie früher in heimat.js)
  const STANDARD = {
    insel: true, R: 15.2, biom: "wiese",
    hoehe: () => 0,
    plaetze: {
      start: [1, 2], tier: [2.5, 3], haus: [-5, -4.5, 0.35], station: [-1.8, -6.3, 0.3], nest: [-2.2, -6.2],
      eule: [8.5, -3, -1.2], fipsi: [-7.6, -0.6, 1.0], robo: [5.5, 8.5, -2.6], biber: [2, -8, 0.2], schild: [3.3, -8.5, 0.2],
      wissensbaum: [-3.2, 2.2], ballons: [10, 6], truhe: [-1, 13.6],
      lauf: [6, 10.2], kart: [-8.6, 8.2], bau: [11.2, -5], baer: [-3.7, 6.9, 2.6], schach: [1.5, 6.8, 3.0], buehne: [4.4, -0.8, -1.4]
    },
    baeume: [[-9, -6, 1.1], [-7.5, 3.2, 0.9], [7.5, -7, 1], [10.5, 1, 1.1], [3, -10, 0.85], [-3.5, 9.8, 0.8], [-11, -1, 0.75], [1.5, 11, 0.7], [-11.5, 6, 0.8]].map(([x, z, k], i) => ({ x, z, k, i })),
    steine: [[4.5, 3.6, 0.6], [5.2, 4.1, 0.35], [-6, 6.5, 0.5]],
    blumen: null,   // null = alte Blumen-Spirale
    see: null,
    pfad: Array.from({ length: 7 }, (_, i) => [-4 + i * 1.25, -2.6 + Math.sin(i * 0.9) * 0.6])
  };

  function zufall(seed) {
    let a = (seed >>> 0) || 1;
    return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function rauschen(seed) {
    const hash = (x, z) => { let h = Math.imul(x, 374761393) + Math.imul(z, 668265263) + Math.imul(seed, 2147483647); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
    const glatt = (t) => t * t * (3 - 2 * t);
    const wert = (x, z) => {
      const x0 = Math.floor(x), z0 = Math.floor(z), fx = glatt(x - x0), fz = glatt(z - z0);
      const a = hash(x0, z0), b = hash(x0 + 1, z0), c = hash(x0, z0 + 1), d = hash(x0 + 1, z0 + 1);
      return (a + (b - a) * fx) + ((c + (d - c) * fx) - (a + (b - a) * fx)) * fz;
    };
    return (x, z) => wert(x * 0.09, z * 0.09) * 0.62 + wert(x * 0.21 + 31, z * 0.21 + 17) * 0.28 + wert(x * 0.5 + 7, z * 0.5 + 3) * 0.1;
  }
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

  function erzeuge(w) {
    if (!w || !BIOME[w.biom]) return STANDARD;
    const B = BIOME[w.biom], seed = (w.seed >>> 0) || 1, r = zufall(seed), n = rauschen(seed);
    const R = GROESSEN[w.groesse] || GROESSEN.mittel, amp = B.huegel * (HUEGEL[w.huegel] || 1);
    const rand = R - (B.sandRand || 2.3);               // ab hier Strand
    // Grundhöhe: Hügel, zum Rand hin flach auslaufend; nie unter den Meeresspiegel (nur der Teich darf tiefer liegen)
    const roh = (x, z) => Math.max(-0.12, (n(x, z) - 0.32) * 2 * amp) * (1 - smooth(rand - 4, rand, Math.hypot(x, z)));

    // Plätze: Haus, Nachbarn, Wissensbaum, Spielorte – mit Abstand zueinander
    const a0 = r() * Math.PI * 2, P = {};
    const polar = (a, d) => [Math.cos(a) * d, Math.sin(a) * d];
    P.start = [0, 0];
    P.haus = [...polar(a0, R * 0.36), 0];
    P.haus[2] = Math.atan2(-P.haus[0], -P.haus[1]);     // Tür zur Mitte
    const neben = (p, a, d) => [p[0] + Math.cos(a) * d, p[1] + Math.sin(a) * d];
    P.station = [...neben(P.haus, a0 + 1.2, 3.4), 0.3];
    P.nest = neben(P.haus, a0 + 1.55, 3.6);
    P.eule = [...polar(a0 + 1.9 + r() * 0.4, R * (0.42 + r() * 0.12)), 0];
    P.fipsi = [...polar(a0 + 3.3 + r() * 0.4, R * (0.4 + r() * 0.12)), 0];
    P.biber = [...polar(a0 + 4.6 + r() * 0.4, R * (0.42 + r() * 0.12)), 0];
    P.schild = [P.biber[0] + 1.3, P.biber[1] - 0.5, 0];
    P.robo = [...polar(a0 + 5.5, R * 0.55), 0];
    P.baer = [...polar(a0 + 1.3, R * 0.46), 0];
    P.schach = [...polar(a0 + 2.8, R * 0.3), 0];
    P.buehne = [...polar(a0 - 0.5, R * 0.38), 0];
    P.wissensbaum = polar(a0 + 0.9, 3.6);
    P.ballons = polar(a0 + 2.6 + r() * 0.5, R * 0.62);
    P.truhe = polar(a0 + Math.PI + (r() - 0.5), R - 1.6);
    P.lauf = polar(a0 + 0.25 + r() * 0.3, R * 0.62);
    P.kart = polar(a0 + 3.95 + r() * 0.2, R * 0.68);
    P.bau = polar(a0 + 5.6 + r() * 0.2, R * 0.66);
    P.tier = [1.5, 1];
    ["eule", "fipsi", "biber", "schild", "robo", "baer", "schach", "buehne"].forEach(k => { P[k][2] = Math.atan2(-P[k][0], -P[k][1]); });   // schauen zur Mitte

    // flache Flächen um die Plätze (Höhe = Rauschen in der Mitte des Platzes)
    const flach = [[P.start, 3.2], [P.haus, 3.2], [P.station, 1.2], [P.nest, 1], [P.eule, 1.6], [P.fipsi, 1.6], [P.biber, 2.4], [P.wissensbaum, 1.6], [P.ballons, 1.6], [P.tier, 1], [P.lauf, 1.8], [P.kart, 1.8], [P.bau, 1.8], [P.baer, 1.6], [P.schach, 1.8], [P.buehne, 1.8]]
      .map(([p, rad]) => ({ x: p[0], z: p[1], r: rad, h: roh(p[0], p[1]) }));

    // Teich (Wunsch): nicht auf Plätzen
    let see = null;
    if (w.see) for (let v = 0; v < 40 && !see; v++) {
      const [x, z] = polar(r() * Math.PI * 2, R * (0.35 + r() * 0.3)), rad = 2 + r() * 1.2;
      if (flach.every(f => Math.hypot(f.x - x, f.z - z) > f.r + rad + 2) && Math.hypot(x, z) + rad < rand - 1.5) see = { x, z, r: rad };
    }

    const hoehe = (x, z) => {
      let h = roh(x, z), gew = 0, ziel = 0;
      for (const f of flach) { const g = 1 - smooth(f.r, f.r + 2.6, Math.hypot(x - f.x, z - f.z)); if (g > gew) { gew = g; ziel = f.h; } }
      h = h + (ziel - h) * gew;
      if (see) { const d = Math.hypot(x - see.x, z - see.z); h -= 0.9 * (1 - smooth(see.r - 0.6, see.r + 1.2, d)); }
      return h;
    };

    // Pfad vom Haus zur Mitte
    const pfad = [];
    for (let i = 1; i < 7; i++) { const t = i / 7; pfad.push([P.haus[0] * (1 - t) + Math.sin(i * 0.9) * 0.4, P.haus[1] * (1 - t) + Math.cos(i * 1.1) * 0.4]); }

    const frei = (x, z, abst) => Math.hypot(x, z) < rand - 1.2 && flach.every(f => Math.hypot(f.x - x, f.z - z) > f.r + abst) &&
      (!see || Math.hypot(x - see.x, z - see.z) > see.r + 1.2) && pfad.every(([px, pz]) => Math.hypot(px - x, pz - z) > 1.2);
    const streue = (anzahl, abst, minR = 3) => {
      const aus = [];
      for (let v = 0; v < anzahl * 20 && aus.length < anzahl; v++) {
        const [x, z] = polar(r() * Math.PI * 2, minR + Math.sqrt(r()) * (rand - minR));
        if (frei(x, z, abst) && aus.every(o => Math.hypot(o[0] - x, o[1] - z) > abst * 1.6)) aus.push([x, z]);
      }
      return aus;
    };
    const faktor = (R / 15.2) ** 2;   // größere Welt, mehr Bäume
    const baeume = streue(Math.round(B.baeume * faktor), 1.1).map(([x, z], i) => ({ x, z, k: 0.7 + r() * 0.5, i, typ: B.baum === "misch" ? (r() < 0.5 ? "nadel" : "laub") : B.baum }));
    const steine = streue(Math.round(B.steine * faktor), 0.8).map(([x, z]) => [x, z, 0.3 + r() * 0.45]);
    const blumen = w.blumen === false ? [] : streue(Math.round(B.blumen * faktor * (w.blumen ? 1.4 : 1)), 0.25, 2.5).map(([x, z], i) => [x, z, i]);

    return { insel: false, R, rand, biom: w.biom, B, farbe: w.farbe || "#FF6F91", hoehe, plaetze: P, baeume, steine, blumen, see, pfad };
  }
  // Vorschlag für den Wünsche-Assistenten
  const FARBEN = [["#FF6F91", "Rosa"], ["#B28DFF", "Lila"], ["#5EC3E6", "Blau"], ["#FFD84D", "Gelb"], ["#FF9E5E", "Orange"], ["#E0574A", "Rot"], ["#FFFFFF", "Weiß"]];
  const neuerSeed = () => (Math.random() * 4294967295) >>> 0;

  // Gewünschte Welt: Test-Parameter (?biom=wald&groesse=gross&huegel=viel&see=1&seed=7) oder die aktive gespeicherte Welt
  function wunsch(q) {
    if (q && q.has("biom")) return { biom: q.get("biom"), groesse: q.get("groesse") || "mittel", huegel: q.get("huegel") || "mittel", see: q.get("see") === "1", blumen: q.get("blumen") !== "0", farbe: q.get("farbe") ? "#" + q.get("farbe") : undefined, seed: +q.get("seed") || 1 };
    const d = (S() && S().lade("welt")) || {};
    return (d.welten || [])[d.aktiv] || null;
  }

  // Tageszeit und Jahreszeit (wie bisher nach der echten Uhr; Test: ?stunde=21 ?monat=12)
  function zeit(q, jetzt = new Date()) {
    const STUNDE = q && q.has("stunde") ? +q.get("stunde") : jetzt.getHours() + jetzt.getMinutes() / 60;
    const MONAT = q && q.has("monat") ? +q.get("monat") : jetzt.getMonth() + 1;
    const SAISON = [12, 1, 2].includes(MONAT) ? "winter" : [3, 4, 5].includes(MONAT) ? "fruehling" : [9, 10, 11].includes(MONAT) ? "herbst" : "sommer";
    const NACHT = STUNDE >= 20 || STUNDE < 6.5, DAEMMER = !NACHT && (STUNDE >= 18 || STUNDE < 8);
    return { STUNDE, MONAT, SAISON, NACHT, DAEMMER };
  }

  // ======================================================================================================
  // Zeit-Regeln, Sonnenuhr, Nebel
  // ======================================================================================================
  const spielZeit = () => !W.Zeit || W.Zeit.status().spielen;
  const profi = () => S().offen((S().lade("medien") || {}).fuehrerschein);
  // Text, wenn ein Spielort ohne Spielzeit angetippt wird: [emoji, titel, deutsch, hilfe]
  function schlaeftText() {
    const st = W.Zeit.status();
    return ["💤", "Schläft noch", st.genug ? "Für heute ist genug gespielt. Morgen geht es weiter!" : `Erst lernen, dann spielen! Noch ${st.fehltMin} Minuten oder ${st.fehltAufgaben} Aufgaben. Ella, Fipsi und Biber Benno helfen dir.`,
      S().paar(["", "Сначала учиться, потом играть! Элла, Фипси и бобр Бенно помогут тебе."])[1]];
  }
  const fuehrerscheinText = () => ["🪪", "Noch gesperrt", "Mach zuerst den Tablet-Führerschein bei Robo Pixel. Dann darfst du hier spielen!", S().paar(["", "Сначала получи права на планшет у Робо Пикселя."])[1]];

  // Sonnenuhr: hell 0…1 (1 = Spielzeit), genug = für heute genug gespielt
  function sonnenuhr() {
    const Zt = W.Zeit; if (!Zt) return { hell: 1, spielen: true, genug: false };
    const st = Zt.status();
    return { hell: st.spielen ? 1 : st.genug ? 0 : Math.round(st.fortschritt * 100) / 100, spielen: st.spielen, genug: st.genug };
  }
  function sonnenuhrText(u = sonnenuhr()) {
    return ["robo", "Die Sonnenuhr", u.spielen ? "Die Sonne scheint: Jetzt ist Spielzeit! Die Spielorte sind wach." : u.genug ? "Die Sonne ist untergegangen. Für heute ist genug gespielt – morgen geht sie wieder auf." : `Die Sonne ist noch dunkel. Lerne bei Ella, Fipsi oder Benno – dann geht sie auf. Schon ${Math.round(u.hell * 100)} Prozent geschafft!`,
      S().paar(["", u.spielen ? "Солнце светит: сейчас время игры!" : u.genug ? "Солнце село. На сегодня хватит игр – завтра оно снова встанет." : "Солнце ещё тёмное. Поучись у Эллы, Фипси или Бенно – и оно встанет."])[1]];
  }

  // Nebelrand: Stufe 0 (dichter Nebel) … 3 (kein Nebel) = höchstes von Kapitel und Lernfunden (1 / 5 / 15 Funde).
  // Lernfunde zählen erst, wenn Ella den Wissensbaum erklärt hat (E3) – so sieht ein neues Kind den Nebel weichen.
  function nebelStufe() {
    const St = W.Story; if (!St) return 3;
    const n = St.etappe("E3") && W.Lernfunde ? W.Lernfunde.gesamt() : 0;
    return Math.min(3, Math.max(St.kapitel(), n >= 15 ? 3 : n >= 5 ? 2 : n >= 1 ? 1 : 0));
  }

  // ======================================================================================================
  // Weihnachts-Sonderstart (NA-15): Erststart 1.–26.12. → Paket am Steg (Tannenbaum fürs Zimmer, Schleife fürs Tier)
  // ======================================================================================================
  const isoJetzt = () => { const d = new Date(W.__jetzt || Date.now()); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  // id des noch ungeöffneten Pakets („weihnachten-2026“) oder null
  function weihnachtsPaket() {
    const St = W.Story; if (!St) return null;
    const e1 = St.zustand().etappen.E1, datum = typeof e1 === "string" ? e1 : !e1 ? isoJetzt() : null;   // 1 = übernommen → kein Sonderstart
    if (!datum) return null;
    const [y, m, t] = datum.split("-").map(Number); if (m !== 12 || t > 26) return null;
    const id = "weihnachten-" + y; return St.hatGeschenk(id) ? null : id;
  }
  // Öffnet das Paket (nur Spielstand). Ergebnis: { id, zimmer: true, wenn der Tannenbaum aufgestellt wurde, blase: [...] } oder null
  function oeffnePaket() {
    const id = weihnachtsPaket(); if (!id) return null;
    W.Story.merkeGeschenk(id);
    S().schalteFrei("moebel-tannenbaum", 0);
    // Tannenbaum gleich auf einen freien Platz im Zimmer stellen (kann mit „Einrichten“ weggeräumt werden)
    const d = zimmerDaten(); let zimmer = false;
    if (!Object.values(d.plaetze).includes("tannenbaum")) {
      const frei = ["vornlinks", "links", "rechts", "mitterechts", "fenster", "bett"].find(k => !d.plaetze[k]);
      if (frei) { d.plaetze[frei] = "tannenbaum"; S().speichere("zimmer", d); zimmer = true; }
    }
    if (W.TierPflege && W.TierPflege.schenke) W.TierPflege.schenke("schleife");
    return { id, zimmer, blase: ["robo", "Dein Weihnachtspaket", "Darin sind ein Tannenbaum für dein Zimmer und eine rote Schleife für dein Tier. Der Baum steht schon in deinem Haus!",
      S().paar(["", "Внутри ёлка для твоей комнаты и красный бантик для твоего питомца. Ёлка уже стоит в твоём доме!"])[1]] };
  }

  // ======================================================================================================
  // Story: welche Szene ist als Nächstes dran? (Reihenfolge aus KONZEPT „Etappen“; höchstens zwei neue Etappen am Tag)
  // lage = { paket: liegt ein Paket, prolog: läuft die Ankunft, drinnen: im Zimmer, laeuft: eine Story-Szene läuft, test: ?szene=… }
  // Liefert die Szenen-id oder null. Ohne Zeit-Regeln wird E2 still erledigt (nichts zu erklären).
  // ======================================================================================================
  function naechsteStory(lage = {}) {
    const St = W.Story, Sz = W.Szene;
    if (!St || !Sz || lage.prolog || lage.drinnen || lage.laeuft || Sz.laeuft || !St.etappe("E1") || lage.test) return null;
    const Zt = W.Zeit, st = Zt ? Zt.status() : { frei: true, spielen: true }, frei = st.frei;
    if (lage.paket && !St.gesehen("weihnachtspaket")) return "weihnachtspaket";
    if (!St.etappe("E2")) {
      if (frei) St.etappeFertig("E2");
      else if (St.darfNeueEtappe()) return st.spielen ? "sonne" : "erst-lernen";
    }
    if (St.etappe("E2") && st.spielen && !frei && !St.gesehen("sonne")) return "sonne";
    if (!St.etappe("E3") && W.Lernfunde && W.Lernfunde.gesamt() >= 1 && St.darfNeueEtappe()) return "erste-frucht";
    return null;
  }
  // nach dem Ende einer Story-Szene
  function storyFertig(def) { const St = W.Story; if (!St || !def) return; if (def.etappe) St.etappeFertig(def.etappe); if (def.kapitel) St.setzeKapitel(def.kapitel); }
  // Soll beim Öffnen der Insel die Ankunft starten?
  const prologFaellig = (q) => !!(W.Story && !W.Story.etappe("E1") && (!q || (q.get("drinnen") !== "1" && !q.has("szene"))));

  // ======================================================================================================
  // Zimmer: Plätze, Möbel, Wandfarben (das Aussehen jedes Möbels baut der jeweilige Look nach der id)
  // ======================================================================================================
  const PLAETZE = [
    { id: "fenster", name: "am Fenster", x: -0.2, z: -3.0 },
    { id: "bett", name: "neben dem Bett", x: -1.5, z: -3.0 },
    { id: "links", name: "an der linken Wand", x: -3.5, z: 0.0 },
    { id: "vornlinks", name: "vorne links", x: -3.4, z: 2.5 },
    { id: "rechts", name: "an der rechten Wand", x: 3.5, z: -1.0 },
    { id: "mitterechts", name: "rechts beim Teppich", x: 2.2, z: 0.9 }
  ];
  const MOEBEL = [
    { id: "lampe", name: "Stehlampe", e: "💡", preis: 4, text: "Sie macht dein Zimmer gemütlich." },
    { id: "baer", name: "Kuschelbär", e: "🧸", preis: 4, text: "Er passt auf dein Zimmer auf." },
    { id: "sitzsack", name: "Sitzsack", e: "🫘", preis: 5, text: "Perfekt zum Lesen und Ausruhen." },
    { id: "kiste", name: "Spielzeugkiste", e: "🧩", preis: 5, text: "Darin ist Platz für alle Spielsachen." },
    { id: "korb", name: "Tierkörbchen", e: "🧺", preis: 6, text: "Ein weiches Bett für dein Tier." },
    { id: "globus", name: "Globus", e: "🌍", preis: 7, text: "Die ganze Welt in deinem Zimmer. Ella liebt ihn!" },
    { id: "regal", name: "Bücherregal", e: "📚", preis: 8, text: "Hier wohnen deine Lieblingsbücher." },
    { id: "staffelei", name: "Mal-Staffelei", e: "🎨", preis: 9, text: "Für große Künstlerinnen und Künstler." },
    { id: "tisch", name: "Schreibtisch", e: "✏️", preis: 10, text: "Hier kannst du malen und schreiben." },
    { id: "aquarium", name: "Aquarium", e: "🐠", preis: 12, text: "Blub, blub! Die Fische winken dir zu." },
    // Geschenke (nicht im Laden zu kaufen, erscheinen nur, wenn das Kind sie bekommen hat)
    { id: "tannenbaum", name: "Tannenbaum", e: "🎄", preis: 0, geschenk: true, text: "Ein Geschenk von Robo Pixel. Frohe Weihnachten! Mit „Einrichten“ kannst du ihn wegräumen." }
  ];
  const WANDFARBEN = [
    { id: "rosa", name: "Rosa", farbe: ["#FFD9E6", "#FFE9C2"], preis: 0 },
    { id: "mint", name: "Mint", farbe: ["#C9F2E3", "#EAF8F1"], preis: 3 },
    { id: "himmel", name: "Himmelblau", farbe: ["#CFE6FF", "#EEF5FF"], preis: 3 },
    { id: "sonne", name: "Sonnengelb", farbe: ["#FFE9A8", "#FFF5D6"], preis: 3 },
    { id: "lila", name: "Lavendel", farbe: ["#E3D6FF", "#F3EDFF"], preis: 3 }
  ];
  const zimmerDaten = () => Object.assign({ plaetze: {}, wand: "rosa" }, S().lade("zimmer") || {});
  const besitzt = (id, preis) => !preis || S().offen(S().istFrei(id));

  // ======================================================================================================
  // Wetter (Open-Meteo, Ort aus dem Elternbereich, kein GPS; Cache 30 Minuten). Das Einfärben macht der Look.
  // ======================================================================================================
  const WETTER_KEY = "lerninsel.wetter";
  const WETTER_ART = (c) => c == null ? null : c === 0 ? "klar" : c <= 3 ? (c === 3 ? "wolken" : "heiter") : c <= 48 ? "nebel" : c <= 67 || (c >= 80 && c <= 82) ? "regen" : c <= 77 || c === 85 || c === 86 ? "schnee" : c >= 95 ? "gewitter" : "wolken";
  const WETTER_TEXT = { klar: ["☀️", "Sonne pur", "солнечно"], heiter: ["🌤️", "ein paar Wolken", "немного облаков"], wolken: ["☁️", "bewölkt", "облачно"], nebel: ["🌫️", "Nebel", "туман"], regen: ["🌧️", "Regen", "дождь"], schnee: ["❄️", "Schnee", "снег"], gewitter: ["⛈️", "Gewitter", "гроза"] };
  const ort = () => S().kind().ort;
  function wetterCache() { try { const w = JSON.parse(localStorage.getItem(WETTER_KEY)), O = ort(); return w && O && w.lat === O.lat && w.lon === O.lon ? w : null; } catch (e) { return null; } }
  function wetterSatz(w) {
    if (!w) return null;
    const [e, txt] = WETTER_TEXT[w.art] || WETTER_TEXT.wolken;
    return `${e} In ${w.ort}: ${Math.round(w.temp)} °C, ${txt}`;
  }
  function wetterSticker(w, nacht) { if (W.Sticker && w && w.art) { W.Sticker.entdecke("w-" + (w.art === "heiter" ? "wolken" : w.art)); if (nacht) W.Sticker.entdecke("w-mond"); } }
  // holt neues Wetter; liefert es (oder null, offline/ohne Ort)
  async function holeWetter() {
    const O = ort();
    if (!O || O.lat == null || !navigator.onLine) return null;
    try {
      const st = new AbortController(); setTimeout(() => st.abort(), 6000);
      const a = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${O.lat}&longitude=${O.lon}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`, { signal: st.signal });
      const c = (await a.json()).current; if (!c) return null;
      const w = { lat: O.lat, lon: O.lon, ort: O.name, zeit: Date.now(), temp: c.temperature_2m, wind: c.wind_speed_10m, code: c.weather_code, art: WETTER_ART(c.weather_code) };
      try { localStorage.setItem(WETTER_KEY, JSON.stringify(w)); } catch (e) {}
      return w;
    } catch (e) { return null; /* offline: Jahreszeiten-Wetter bleibt */ }
  }
  // Startwetter: { sofort: Wetter zum gleich Anwenden (Test-Parameter oder Cache), cache: aus dem Cache?, holen: neu abrufen? }
  function startWetter(q) {
    const test = q && q.get("wetter"), c = wetterCache(), O = ort();
    if (test) return { sofort: { ort: (O && O.name) || "Testhausen", temp: test === "schnee" ? -2 : 14, wind: 12, art: test }, cache: false, holen: false };
    if (c) return { sofort: c, cache: true, holen: Date.now() - c.zeit > 30 * 60000 };
    return { sofort: null, cache: false, holen: true };
  }

  // ======================================================================================================
  // Die Insel dieser Seite: Welt + feste Orte (Steg, Sonnenuhr, Paket, Nachbarn) + Bodenhöhe
  // ======================================================================================================
  function erstelle(q) {
    const WELT = erzeuge(wunsch(q)), P = WELT.plaetze;
    const ZX = 60, ZX_GRENZE = 40;   // ab ZX_GRENZE liegt das Zimmer (x ≈ 60), dort ist der Boden immer flach
    // Bodenhöhe für Figuren und Dinge (bisherige Insel: überall 0.25)
    function bodenY(x, z) {
      if (WELT.insel || x > ZX_GRENZE) return 0.25;
      const d = Math.hypot(x, z);
      if (d <= WELT.rand) return 0.25 + WELT.hoehe(x, z);
      if (d <= WELT.R) { const t = (d - WELT.rand) / (WELT.R - WELT.rand); return 0.25 - t * t * 0.35; }
      return -0.1 - Math.min(1.1, (d - WELT.R) * 1.4);
    }
    // Steg mit Pixels Boot am Südufer (zur Kamera hin), Sonnenuhr daneben, Weihnachtspaket am Stegende
    const UFER = WELT.insel ? 15.2 : WELT.R, RMAX_LAUF = WELT.insel ? 14.6 : WELT.R - 0.6;
    const STEG = { x: 3.2, z0: UFER - 2.2, z1: UFER + 2.4 };
    const SU = { x: STEG.x + 2.1, z: Math.min(RMAX_LAUF - 1.1, STEG.z0 + 0.6) };
    const PAKET_POS = { x: STEG.x + 0.95, z: STEG.z0 + 0.15 };
    const HAUS_DREH = WELT.insel ? 0.35 : P.haus[2];
    // Vor der Haustür (dort kommt man beim Rausgehen an)
    const vorDerTuer = () => ({ x: P.haus[0] + Math.sin(HAUS_DREH) * 2.75, z: P.haus[1] + Math.cos(HAUS_DREH) * 2.75, dreh: HAUS_DREH });
    // Nebel je Stufe (Weite für die runde Darstellung, r = Radius des Nebelbands, a = Deckkraft)
    const NEBEL = [{ near: 16, far: 44, r: UFER + 3.2, a: 0.85 }, { near: 21, far: 54, r: UFER + 7, a: 0.6 }, { near: 26, far: 66, r: UFER + 12, a: 0.35 }, { near: 32, far: 80, r: 0, a: 0 }];

    // Nachbarn: Platz, Texte, Ziel. Robo Pixel wohnt am Steg bei seinem Boot (Prolog, Tablet-Führerschein).
    function nachbarn() {
      const name = S().profil.name || "du";
      return [
        { e: "eule", x: P.eule[0], z: P.eule[1], dreh: P.eule[2], titel: "Eule Ella", text: `Hallo ${name}! Ich weiß spannende Dinge über die Welt. Kommst du mit?`, ru: "Привет! Я знаю много интересного о мире. Пойдёшь со мной?", ziel: "../sachkunde/" },
        { e: "fipsi", x: P.fipsi[0], z: P.fipsi[1], dreh: P.fipsi[2], titel: "Fipsi", text: `Hallo ${name}! Hilfst du mir, meine Schatzkarte zu finden?`, ru: "Привет! Поможешь мне найти мою карту сокровищ?", ziel: "../deutsch/" },
        { e: "robo", x: STEG.x - 1.5, z: Math.min(RMAX_LAUF - 0.9, STEG.z0 + 0.9), dreh: 0.3, titel: "Robo Pixel", text: `Piep! Hallo ${name}! Mit meinem Boot habe ich dich hergebracht. Willst du ein Tablet-Profi werden?`, ru: "Пип! Привет! Я привёз тебя на своей лодке. Хочешь стать мастером планшета?", ziel: "../medien/" },
        { e: "baer", x: P.baer[0], z: P.baer[1], dreh: P.baer[2], titel: "Bärin Bruni", text: `Hallo ${name}! Ich bin Bruni. Bei mir geht es um Gefühle – und ums Bewegen. Kommst du?`, ru: "Привет! Я медведица Бруни. У меня – про чувства и движение. Пойдёшь?", ziel: "../gefuehle/" },
        { e: "biber", x: P.biber[0], z: P.biber[1], dreh: P.biber[2], titel: "Biber Benno", text: `Hallo ${name}! Ich bin Benno. Ich baue Dämme und zähle jeden Stamm. Rechnest du mit mir auf dem Matheweg?`, ru: "Привет! Я бобр Бенно. Я строю плотины и считаю каждое бревно. Посчитаешь со мной на математической тропе?", ziel: "../mathe/" }
      ];
    }
    // Orte für Zeigehand und Szenen: Bodenpunkt + Höhe über dem Boden (für „Rund“; „Pixel“ nimmt nur x/z)
    const ORTE = {
      haus: { x: P.haus[0], z: P.haus[1], h: 1.2 },
      sonnenuhr: { x: SU.x - 0.5, z: SU.z, h: 1.6 },
      wissensbaum: { x: P.wissensbaum[0], z: P.wissensbaum[1], h: 1.6 },
      eule: { x: P.eule[0], z: P.eule[1], h: 1.6 },
      steg: { x: STEG.x, z: (STEG.z0 + STEG.z1) / 2, h: 0.4 },
      paket: { x: PAKET_POS.x, z: PAKET_POS.z, h: 0.8 }
    };
    return { WELT, P, ZX, ZX_GRENZE, bodenY, UFER, RMAX_LAUF, STEG, SU, PAKET_POS, HAUS_DREH, vorDerTuer, NEBEL, nachbarn, ORTE };
  }

  // Lernfunde des Tages: der passende Nachbar freut sich (Fach je Nachbar, Freude-Text je Fach)
  const FACH = { eule: "sachkunde", fipsi: "deutsch", robo: "tablet", biber: "mathe" };
  function freude(fach, f, name) {
    const F = {
      sachkunde: () => [`${name}, heute hast du etwas Neues entdeckt: ${f.t}. Ich bin stolz auf dich! Erzählst du es nachher deiner Familie?`, "Сегодня у тебя новое открытие! Расскажешь потом об этом своей семье?"],
      deutsch: () => [`Juhu, ${name}! Du kennst jetzt: ${f.t.replace(/^Neues Wort: /, "")}. Sag es einmal ganz laut!`, f.r ? `Ура! Теперь ты знаешь: ${f.r}. Скажи это вслух по-немецки!` : "Ура! Ты знаешь новые слова. Скажи их вслух!"],
      tablet: () => [`Piep! Neu in deinem Kopf: ${f.t}. Du wirst ein echter Tablet-Profi!`, "Пип! Ты узнаёшь всё больше о планшете!"],
      mathe: () => [`Super, ${name}! Das hast du heute geschafft: ${f.t.replace(/^Neu geschafft: /, "")}. Ich zähle mit dir weiter!`, "Супер! Сегодня у тебя получилось новое. Считаем дальше вместе!"]
    };
    return F[fach] ? F[fach]() : null;
  }

  // ======================================================================================================
  // Stationen: was passiert, wenn das Kind einen Ort antippt. Antwort = { blase: [emoji, titel, deutsch, hilfe, ziel], extra?, melodie? }
  // ziel ist relativ zu einer Seite in spiele/<ordner>/ (z. B. "../welt3d/ballons.html", "../schach/") und gilt für beide Looks.
  // ======================================================================================================
  // Minispiele auf der Insel und ab welcher Stufe des Wissensbaums sie offen sind (gleich wie in quellen/welt3d/gemeinsam.js halten)
  const SPIELE = {
    ballons: { name: "Ballon-Party", e: "🎈", stufe: 0 },
    insel: { name: "Schatz-Strand", e: "🏝️", stufe: 0 },
    lauf: { name: "Sternenlauf", e: "🏃", stufe: 1 },
    kart: { name: "Kart-Rennen", e: "🏎️", stufe: 2 },
    bau: { name: "Bauplatz", e: "🧱", stufe: 3 }
  };
  const baumStufe = () => (W.Lernfunde ? W.Lernfunde.baum().stufe : 0);
  const istFrei = (id) => S().offen(baumStufe() >= ((SPIELE[id] || {}).stufe || 0));
  const BALD = new Set([]);   // Spiele, die noch entstehen
  const ORT_TEXT = {
    lauf: ["Der Sternenlauf", "Lauf so schnell du kannst und sammle Sterne! Wische, um auszuweichen.", "Беги и собирай звёзды!", "../welt3d/lauf.html"],
    kart: ["Die Kart-Bahn", "Fahr ein Rennen mit deinem Kart!", "Гонка на карте!", "../welt3d/kart.html"],
    bau: ["Der Bauplatz", "Bau mit bunten Steinen, was du willst!", "Строй из цветных кубиков что хочешь!", "../welt3d/bau.html"]
  };
  const blase = (e, titel, de, ru, ziel = null) => ({ blase: [e, titel, de, S().paar(["", ru])[1], ziel] });
  const name = () => S().profil.name || "du";
  // ohne Spielzeit schläft der Ort; ohne kompletten Tablet-Führerschein bleibt ein Minispiel gesperrt
  const spielort = (fn) => (spielZeit() ? fn() : { blase: [...schlaeftText(), null] });
  const fuehrerschein = () => ({ blase: [...fuehrerscheinText(), "../medien/"] });
  // Wissensbaum: Farben der Früchte (je Fach), Text beim Antippen
  const FRUCHT = { mathe: "#2FA37C", deutsch: "#E0574A", sachkunde: "#1F8F8A", tablet: "#2F86C8", welt: "#8BC34A", schach: "#7B55B8", kunst: "#FF8A3D", musik: "#3DB8E0" };
  const fruchtFarbe = (f) => (f.x ? "#FF5C8A" : f.a === "gemeistert" ? "#FFC83D" : FRUCHT[f.f] || "#FF7A6B");   // einem Erwachsenen erklärt: rosa Herzfrucht
  function wissensbaumText() {
    const L = W.Lernfunde, b = L.baum(), h = L.heute();
    const de = b.summe === 0 ? "Hier wächst dein Wissensbaum. Mit allem, was du Neues lernst, wird er größer!"
      : `Schon ${b.summe} ${b.summe === 1 ? "Ding" : "Dinge"} gelernt!` + (h.length ? ` Heute ${h.length === 1 ? "hängt eine neue Frucht" : `hängen ${h.length} neue Früchte`} dran: ${h.slice(-2).map(x => x.t.replace(/^Neues Wort: /, "")).join(" · ")}`
        : " Heute ist noch keine Frucht dazugekommen. Lern etwas Neues, dann wächst eine!") + (b.naechste ? ` Noch ${b.naechste - b.summe} bis der Baum wieder wächst.` : "");
    const ru = b.summe === 0 ? "Здесь растёт твоё дерево знаний. Чем больше ты узнаёшь, тем больше оно становится!" : `Ты уже узнаёшь так много: ${b.summe}! Каждая новая вещь — новый плод.`;
    return blase("🌳", "Dein Wissensbaum", de, ru, "../ich/");
  }
  // Lernfund von heute für einen Nachbarn (oder null)
  const fundFuer = (e) => { const fach = FACH[e]; return W.Lernfunde && fach ? W.Lernfunde.heuteFach(fach) : null; };
  // Nachbar antippen; extra "prolog" = Knopf „Wie ging das nochmal?“ bei Robo Pixel
  function nachbarAntwort(n) {
    const fund = fundFuer(n.e);
    if (fund) { const [de, ru] = freude(FACH[n.e], fund, name()); return { blase: [n.e, `${n.titel} freut sich`, de, S().paar(["", ru])[1], n.ziel] }; }
    return { blase: [n.e, n.titel, n.text, S().ht(n), n.ziel], extra: n.e === "robo" && W.Story && W.Story.etappe("E1") ? "prolog" : null };
  }
  function wetterAntwort(w) {
    const O = ort();
    if (!O || O.lat == null) return blase("🌦️", "Die Wetterstation", "Hier siehst du das echte Wetter bei dir zu Hause. Frag deine Eltern, ob sie im Elternbereich euren Ort eintragen.", "Здесь видно настоящую погоду у тебя дома. Попроси родителей вписать ваш город в разделе для родителей.");
    if (!w) return blase("🌦️", "Die Wetterstation", `Die Station hat noch keine Nachricht aus ${O.name}. Mit Internet klappt es beim nächsten Mal.`, "Станция ещё не получила данные. С интернетом получится в следующий раз.");
    const [, txt, ru] = WETTER_TEXT[w.art] || WETTER_TEXT.wolken, tp = Math.round(w.temp);
    const tipp = w.art === "regen" || w.art === "gewitter" ? "Nimm draußen eine Regenjacke mit!" : tp <= 3 ? "Brr! Mütze und Handschuhe nicht vergessen." : tp >= 26 ? "Heiß! Trink viel Wasser und denk an die Sonnencreme." : w.art === "klar" ? "Ein schöner Tag zum Rausgehen!" : "Zieh dich passend an, wenn du rausgehst.";
    return blase("🌦️", `Wetter in ${w.ort}`, `Draußen sind es ${tp} Grad, ${txt}. Wind: ${Math.round(w.wind || 0)} km/h. ${tipp}`, `На улице ${tp} градусов, ${ru}.`);
  }
  // Paula auf der Bühne: spielt die erste eigene Melodie aus dem Atelier (melodie = Liste von Tönen 0–7, -1 = Pause)
  function paulaAntwort() {
    const m = ((S().lade("atelier") || {}).musik || {}).melodien || [];
    if (m.length) return Object.assign(blase("papagei", "Paula auf der Bühne", `Hör mal, ${name()}! Das ist deine eigene Melodie – und alle tanzen dazu!`, "Послушай! Это твоя мелодия – и все танцуют!", "../atelier/?musik"), { melodie: m[0] });
    return blase("papagei", "Paula auf der Bühne", `Hallo ${name()}! Erfinde im Atelier deine eigene Melodie. Dann spiele ich sie hier – und alle tanzen dazu!`, "Придумай свою мелодию в ателье – и все будут танцевать!", "../atelier/?musik");
  }
  // Melodie abspielen (2 Runden); beiTon() wird bei jedem Schritt aufgerufen (Tanzen). Liefert die Dauer in ms.
  let audio = null;
  const TOENE = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5], SCHRITT = 380;
  function klang(f, wann) {
    try { audio = audio || new (W.AudioContext || W.webkitAudioContext)(); if (audio.state === "suspended") audio.resume(); } catch (e) { return; }
    const t = audio.currentTime + wann, o = audio.createOscillator(), v = audio.createGain(); o.type = "sine"; o.frequency.value = f;
    v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(0.4, t + 0.01); v.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
    o.connect(v).connect(audio.destination); o.start(t); o.stop(t + 0.85);
  }
  function spieleMelodie(mel, beiTon) {
    const runden = 2;
    for (let r = 0; r < runden; r++) mel.forEach((ton, i) => {
      const w = (r * mel.length + i) * SCHRITT;
      if (ton >= 0) klang(TOENE[ton], w / 1000);
      if (beiTon) setTimeout(beiTon, w);
    });
    return mel.length * runden * SCHRITT + 400;
  }
  // alle übrigen Stationen
  function antwort(id, lage = {}) {
    switch (id) {
      case "ballons": return spielort(() => profi() ? blase("🎈", "Ballon-Wiese", "Lass so viele Ballons platzen, wie du kannst!", "Лопни как можно больше шариков!", "../welt3d/ballons.html") : fuehrerschein());
      case "truhe": return spielort(() => profi() ? blase("🏝️", "Schatz-Strand", "Auf der Schatzinsel wartet eine Truhe. Findest du sie?", "На острове сокровищ ждёт сундук. Найдёшь его?", "../welt3d/insel.html") : fuehrerschein());
      case "schach": return blase("🐢", "Tilda am Schachtisch", `Hallo ${name()}! Ich bin Tilda. Langsam und klug gewinnt! Lernst du mit mir Schach?`, "Привет! Я черепаха Тильда. Медленно и умно побеждает! Научишься со мной шахматам?", "../schach/");
      case "buehne": return paulaAntwort();
      case "station": return wetterAntwort(lage.wetter);
      case "wissensbaum": return wissensbaumText();
      case "sonnenuhr": return { blase: [...sonnenuhrText(), null] };
      // Nest am Haus: Ei (noch warm halten) oder leer (Ei aussuchen); ein geschlüpftes Tier läuft mit und wird gestreichelt
      case "nest": {
        const d = W.TierPflege ? W.TierPflege.lade() : null;
        if (d && d.phase === "ei") return blase("🥚", "Dein Ei", "Es braucht noch Wärme. Wärme es auf der Tier-Seite!", "Ему нужно тепло. Согрей его на странице питомца!", "../tier/");
        return blase("🪺", "Ein leeres Nest", "Hier könnte dein Haustier wohnen. Such dir ein Ei aus!", "Здесь мог бы жить твой питомец. Выбери яйцо!", "../tier/");
      }
      // im Zimmer
      case "album": { const s = W.Sticker && W.Sticker.stand(); return blase("📒", "Dein Stickeralbum", s ? `Du hast schon ${s.hat} von ${s.gesamt} Stickern${s.neu ? ` – ${s.neu} neue warten auf dich` : ""}!` : "Hier sammelst du deine Sticker.", "Здесь ты собираешь наклейки.", "../album/?von=insel"); }
      case "bett": return blase("🛏️", "Dein Bett", lage.tier ? `Hier kuschelt ${lage.tier}, wenn es müde ist.` : "Ein gemütliches Bett. Mit dem Knopf „Einrichten“ machst du dein Zimmer schön.", "Уютная кровать.");
      case "schrank": return blase("👗", "Dein Kleiderschrank", "Such dir etwas Schönes zum Anziehen aus. Auf der Insel trägst du es dann!", "Выбери что-нибудь красивое из одежды!", "../anziehen/?von=insel");
      case "spiegel": return blase("🪞", "Der Spiegel", "Schau, wie du gewachsen bist: deine Fähigkeiten, was du gut kannst, und deine Pokale.", "Посмотри, как ты выросла!", "../ich/");
      case "lauf": case "kart": case "bau": {
        const info = SPIELE[id], [titel, de, ru, ziel] = ORT_TEXT[id];
        if (!istFrei(id)) {
          const brauch = W.Lernfunde ? W.Lernfunde.STUFEN[info.stufe - 1] : 0, hat = W.Lernfunde ? W.Lernfunde.gesamt() : 0;
          return blase("🌳", `${info.e} ${info.name} – noch zu`, `Dieser Ort öffnet sich, wenn dein Wissensbaum wächst. Noch ${Math.max(1, brauch - hat)} ${brauch - hat === 1 ? "Lernfund" : "Lernfunde"} – lern etwas Neues bei Ella, Fipsi oder Benno!`, "Это место откроется, когда вырастет твоё дерево знаний. Узнай что-нибудь новое!");
        }
        if (BALD.has(id)) return blase("🚧", titel, "Hier wird noch gebaut! Bald kannst du hier spielen.", "Здесь ещё строят! Скоро можно будет играть.");
        return spielort(() => profi() ? blase(info.e, titel, de, ru, ziel) : fuehrerschein());
      }
    }
    return null;
  }
  // Aufschrift des Aktionsknopfs je Station (emoji, Wort) und Reichweite (Weltmaß)
  const AKTION = {
    haus: [["🚪", "Reingehen"], 3.4], ballons: [["🎈", "Spielen"], 1.9], truhe: [["🔓", "Öffnen"], 1.9], schach: [["♟️", "Schach"], 2.4], buehne: [["🎵", "Musik"], 2.6],
    station: [["🌦️", "Ansehen"], 1.9], album: [["📒", "Album"], 1.6], bett: [["🛏️", "Ansehen"], 2.2], schrank: [["🚪", "Öffnen"], 2.0], spiegel: [["🪞", "Reinschauen"], 1.6], wissensbaum: [["🌳", "Ansehen"], 2.2], sonnenuhr: [["☀️", "Ansehen"], 1.9], paket: [["🎁", "Öffnen"], 1.8], nachbar: [["💬", "Reden"], 2.3]
  };
  const aktionFuer = (id) => (["lauf", "kart", "bau"].includes(id) ? [istFrei(id) ? [SPIELE[id].e, "Spielen"] : ["🔒", "Ansehen"], 2.4] : AKTION[id] || [["👀", "Ansehen"], 1.9]);

  W.InselKern = {
    // Stationen
    SPIELE, istFrei, baumStufe, antwort, nachbarAntwort, fundFuer, aktionFuer, FRUCHT, fruchtFarbe, spieleMelodie,
    // Welt
    BIOME, GROESSEN, HUEGEL, STANDARD, FARBEN, erzeuge, neuerSeed, wunsch, zeit, erstelle,
    // Regeln und Zustände
    spielZeit, profi, schlaeftText, fuehrerscheinText, sonnenuhr, sonnenuhrText, nebelStufe,
    weihnachtsPaket, oeffnePaket, naechsteStory, storyFertig, prologFaellig, FACH, freude,
    // Zimmer
    PLAETZE, MOEBEL, WANDFARBEN, zimmerDaten, besitzt,
    // Wetter
    WETTER_KEY, WETTER_ART, WETTER_TEXT, wetterCache, wetterSatz, wetterSticker, holeWetter, startWetter
  };
})(typeof window !== "undefined" ? window : globalThis);
