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

  // Die Heimatinsel. Weg 3 (Entscheidung des Auftraggebers 08.11.2026, gebaut 09.11.): Radius 15,2 → 19 (rund 60 % mehr Fläche), die Orte
  // liegen etwa 1,25-mal weiter auseinander (Haus und Start bleiben nah), 14 Bäume, 5 Steine, zwei Blumenwiesen statt der Spirale und
  // Trittstein-Wege vom Start zu Garten, Bäckerei, Tierstation und Leuchtturm (`wege`, Trittsteine berechnet `erstelle()`).
  // Alle Zahlen der 3D-Seite (Sand, Gras, Schaum, Laufgrenze, Nebel, Halme) leiten sich aus `R` ab – keine feste 15,2 mehr.
  // Die Figur startet bei `start` + (1, 2) wie in den eigenen Welten.
  const STANDARD = {
    insel: true, R: 19, biom: "wiese",
    hoehe: () => 0,
    plaetze: {
      start: [0, 0], tier: [-0.5, 3.6], haus: [-6.2, -5.6, 0.35], station: [-3.0, -7.4, 0.3], nest: [-3.4, -7.3],
      eule: [10.6, -3.8, -1.2], fipsi: [-9.5, -0.8, 1.0], robo: [8.5, 9.5, -2.6], biber: [2.5, -10, 0.2], schild: [4.1, -10.6, 0.2],
      wissensbaum: [-4, 2.8], ballons: [12.5, 7.5], truhe: [-1.2, 17],
      lauf: [7.5, 12.8], kart: [-10.8, 10.2], bau: [14, -6.2], baer: [-4.6, 8.6, 2.6], schach: [1.9, 8.5, 3.0], buehne: [5.5, -1, -1.4],
      kartenweg: [-8.1, 2.5],   // Kapitel 2 (NA-17): Ende des neuen Wegs von Fipsi aus
      lager: [-12.5, -4.5, 1.22]   // Forscherlager (Kapitel 7 „Neue Ufer“, 09.11.2026): Ellas Zelt mit Fernrohr, Blick zur Mitte
    },
    baeume: [[-11.25, -7.5, 1.1], [-9.4, 4, 0.9], [9.4, -8.75, 1], [12.2, 3.6, 1.1], [3.75, -12.5, 0.85], [-4.4, 12.25, 0.8], [-13.75, -1.25, 0.75], [1.9, 13.75, 0.7], [-13.8, 7.2, 0.8],
      [-8.5, -11.5, 0.9], [11.5, -10.8, 0.8], [-15, 2.5, 0.75], [14.8, 3.8, 0.85], [-7, 14, 0.8]].map(([x, z, k], i) => ({ x, z, k, i })),
    steine: [[5.6, 4.5, 0.6], [6.5, 5.1, 0.35], [-8.5, 6.5, 0.5], [12, -1.5, 0.45], [-6, -10.5, 0.5]],
    blumen: null,   // null = zwei Blumenwiesen (`blumenwiesen()`), im Frühling mehr
    see: null,
    pfad: Array.from({ length: 8 }, (_, i) => [-5 + i * 1.3, -3 + Math.sin(i * 0.9) * 0.6]),   // vom Haus zum Platz in der Mitte
    wege: [{ via: [[5, 6]], ziel: "lauf" }, { via: [[-3, 5.5]], ziel: "kart" }, { via: [[7, 1.5], [12.5, -1]], ziel: "bau" }, { von: [10.3, -0.35], via: [], ziel: "leuchtturm" }, { via: [], ziel: "lager" }]   // Leuchtturm-Weg zweigt vom Weg zur Tierstation ab
  };
  // Zwei Blumenwiesen der Heimatinsel (Goldener Winkel, deterministisch): [x, z, Farbnummer]; `n` = wie viele je Wiese
  function blumenwiesen(n = 24) {
    const aus = [], P = STANDARD.plaetze, orte = Object.values(P), baeume = STANDARD.baeume;
    [[7.5, 3.5, 3.1], [-7, 5.5, 2.6]].forEach(([mx, mz, mr]) => {
      for (let i = 0; i < n; i++) {
        const w = i * 2.399, r = Math.sqrt((i + 0.5) / n) * mr, x = +(mx + Math.cos(w) * r).toFixed(2), z = +(mz + Math.sin(w) * r).toFixed(2);
        if (orte.some(o => Math.hypot(o[0] - x, o[1] - z) < 1.4) || baeume.some(b => Math.hypot(b.x - x, b.z - z) < 1.3) || STANDARD.steine.some(s => Math.hypot(s[0] - x, s[1] - z) < s[2] + 0.3)) continue;
        aus.push([x, z, i]);
      }
    });
    return aus;
  }

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

    // Teich (Wunsch): nicht auf Plätzen – auch nicht auf Robo, Bennos Schild oder dem Angelsteg (10.11.2026: in 18 von 216 großen Welten stand Robo im Teich;
    // nur diese Welten ändern sich, weil die Suche dort weiterläuft)
    const auchFrei = [[P.robo, 1.2], [P.schild, 0.8], [P.truhe, 1.2]];
    const teichFrei = (x, z, rad) => auchFrei.every(([p, a]) => Math.hypot(p[0] - x, p[1] - z) > rad + a);
    let see = null;
    if (w.see) for (let v = 0; v < 40 && !see; v++) {
      const [x, z] = polar(r() * Math.PI * 2, R * (0.35 + r() * 0.3)), rad = 2 + r() * 1.2;
      if (flach.every(f => Math.hypot(f.x - x, f.z - z) > f.r + rad + 2) && Math.hypot(x, z) + rad < rand - 1.5 && teichFrei(x, z, rad)) see = { x, z, r: rad };
    }
    // 09.11.2026: In mittleren Welten fand sich so nie ein Platz (0 von 216 geprüften, der Wunsch „Teich“ blieb unerfüllt). Zweite Suche mit kleinerem Teich und weniger Rand –
    // mit eigenem Zufall, damit Bäume, Steine und Blumen bestehender Welten an ihrem Platz bleiben (nur Bäume im neuen Teich wandern).
    if (w.see && !see) { const r2 = zufall(seed ^ 0x5EE5EE);
      for (let v = 0; v < 120 && !see; v++) {
        const [x, z] = polar(r2() * Math.PI * 2, R * (0.3 + r2() * 0.42)), rad = 1.6 + r2() * 0.8;
        if (flach.every(f => Math.hypot(f.x - x, f.z - z) > f.r + rad + 1) && Math.hypot(x, z) + rad < rand - 1.2 && teichFrei(x, z, rad)) see = { x, z, r: rad };
      } }
    // 10.11.2026: kleine Welten (R 15,2) blieben fast immer ohne Teich (15 von 216). Dritte Suche: kleiner Teich (1,3–1,8) dicht an den Plätzen vorbei –
    // wieder mit eigenem Zufall, bestehende Welten ändern sich nur dort, wo ein gewünschter Teich jetzt Platz findet.
    if (w.see && !see) { const r3 = zufall(seed ^ 0x7E1C4);
      for (let v = 0; v < 200 && !see; v++) {
        const [x, z] = polar(r3() * Math.PI * 2, R * (0.18 + r3() * 0.6)), rad = 1.3 + r3() * 0.5;
        if (flach.every(f => Math.hypot(f.x - x, f.z - z) > f.r + rad + 0.5) && Math.hypot(x, z) + rad < rand - 1 && teichFrei(x, z, rad)) see = { x, z, r: rad };
      } }

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
  // Geburtstag (30.10.2026): Ab dem Geburtstag wartet ein Paket am Steg – auch noch Tage später (bis 60 Tage), bis es geöffnet ist.
  // id "geburtstag-JJJJ"; jedes Jahr ein neues. Ohne Geburtsdatum im Elternbereich gibt es keins.
  function geburtstagsPaket() {
    const St = W.Story, Sp = S(); if (!St || !Sp.letzterGeburtstag) return null;
    const l = Sp.letzterGeburtstag(Sp.kind().geburt, new Date(W.__jetzt || Date.now())); if (!l) return null;
    const tage = Math.round((new Date(isoJetzt() + "T12:00:00") - new Date(l.datum + "T12:00:00")) / 86400000);
    const id = "geburtstag-" + l.jahr; return tage <= 60 && !St.hatGeschenk(id) ? id : null;
  }
  // Liegt ein Paket am Steg? "weihnachten-JJJJ" (Weihnachts-Sonderstart), "geburtstag-JJJJ", "qr" (eingelöster Geschenk-Code, NA-16) oder null
  const qrPaket = () => !!(W.Geschenk && W.Geschenk.pakete().length);
  const paketDa = () => weihnachtsPaket() || geburtstagsPaket() || (qrPaket() ? "qr" : null);
  // Geburtstagsgeschenk: ein Zubehör fürs Tier, das es noch nicht hat (zuerst der Partyhut), und 5 Sterne
  function oeffneGeburtstag(id) {
    W.Story.merkeGeschenk(id);
    const Sp = S(), l = Sp.letzterGeburtstag(Sp.kind().geburt, new Date(W.__jetzt || Date.now())) || {};
    const TP = W.TierPflege, besitz = (TP && TP.lade && (TP.lade() || {}).besitz) || {};
    const zub = ["hut", "krone", "halstuch", "brille", "schleife"].find(z => !besitz[z]);
    if (zub && TP && TP.schenke) TP.schenke(zub);
    Sp.gibSterne(5);
    const NAME = { hut: "ein Partyhut", krone: "eine Krone", halstuch: "ein Halstuch", brille: "eine Brille", schleife: "eine Schleife" };
    return { id, zimmer: false, blase: ["papagei", `🎂 Alles Gute${l.alter ? " zum " + l.alter + ". Geburtstag" : ""}!`,
      `Im Paket sind ${zub ? NAME[zub] + " für dein Tier und " : ""}5 Sterne – von allen auf der Insel. Wir feiern mit dir, ${name()}!`,
      Sp.paar(["", "С днём рождения! В посылке подарок от всех жителей острова."])[1]] };
  }
  // Öffnet das Paket (nur Spielstand). Ergebnis: { id, zimmer: true, wenn etwas ins Zimmer gestellt wurde, blase: [...] } oder null
  function oeffnePaket() {
    const gb = !weihnachtsPaket() && geburtstagsPaket(); if (gb) return oeffneGeburtstag(gb);
    const id = weihnachtsPaket();
    if (!id && qrPaket()) {
      const r = W.Geschenk.oeffne(); if (!r) return null;
      const g = r.geschenk, extra = r.zimmer ? " Es steht schon in deinem Haus!" : g.art === "zubehoer" ? " Schau mal bei deinem Tier!" : "";
      return { id: "qr", zimmer: r.zimmer, blase: ["robo", `${g.e} Ein Geschenk für dich`, `Im Paket ist ${g.name}!${extra}${r.n ? ` Dazu steht auf einem Zettel: „${r.n}“` : ""}`,
        S().paar(["", "В посылке подарок для тебя!"])[1]] };
    }
    if (!id) return null;
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
    if (lage.paket === "qr" && !St.gesehen("geschenkpaket")) return "geschenkpaket";
    if (typeof lage.paket === "string" && lage.paket.startsWith("geburtstag-") && !St.gesehen(lage.paket)) return "geburtstag";
    if (lage.paket && !(typeof lage.paket === "string" && (lage.paket === "qr" || lage.paket.startsWith("geburtstag-"))) && !St.gesehen("weihnachtspaket")) return "weihnachtspaket";
    if (!St.etappe("E2")) {
      if (frei) St.etappeFertig("E2");
      else if (St.darfNeueEtappe()) return st.spielen ? "sonne" : "erst-lernen";
    }
    if (St.etappe("E2") && st.spielen && !frei && !St.gesehen("sonne")) return "sonne";
    if (!St.etappe("E3") && W.Lernfunde && W.Lernfunde.gesamt() >= 1 && St.darfNeueEtappe()) return "erste-frucht";
    // E4–E8 (NA-14): erst nach der ersten Frucht, je Etappe ein Auslöser; wer die Funktion schon kennt, bekommt sie still erledigt
    if (!St.etappe("E3")) return null;
    for (const e of ETAPPEN) {
      if (St.etappe(e.id)) continue;
      if (e.genutzt()) { St.etappeFertig(e.id, true); continue; }
      if (St.darfNeueEtappe() && e.faellig(st)) return e.szene;
    }
    for (const k of KAPITEL) if (St.kapitel() === k.n - 1 && St.darfNeueEtappe() && k.faellig()) return k.szene;
    // Bennos Brücke fertig: kleine Abschluss-Szene, danach geht es über die Brücke auf die Sandbank
    if (St.kapitel() >= 9 && brueckeFertig() && !St.gesehen("bruecke-fertig") && St.darfNeueEtappe()) return "bruecke-fertig";
    if (St.darfNeueEtappe()) return nebenszene();
    return null;
  }
  // Tutorial-Etappen E4–E8 (KONZEPT „Etappen“): Szene, Auslöser, „schon genutzt“ (für Kinder, die das schon kennen)
  const tageSeitE1 = () => { const e1 = W.Story.zustand().etappen.E1; if (typeof e1 !== "string") return 99; return Math.round((new Date(isoJetzt()) - new Date(e1)) / 86400000); };
  const tierDaten = () => (W.TierPflege ? W.TierPflege.lade() : null);
  const faelligeKarten = () => (W.Lernkartei ? W.Lernkartei.anzahlFaellig("deutsch") + W.Lernkartei.anzahlFaellig("sachkunde") : 0);
  const ETAPPEN = [
    { id: "E4", szene: "sterne", faellig: (st) => st.spielen && S().sterne() >= 4,
      genutzt: () => { const d = zimmerDaten(); return Object.keys(d.plaetze).length > 0 || d.wand !== standardWand(); } },
    { id: "E5", szene: "ei", faellig: () => !!W.TierPflege, genutzt: () => { const d = tierDaten(); return !!d && (d.phase === "ei" || d.phase === "tier"); } },
    // E6 wartet, solange die Minispiele ausgeblendet sind (Spielwelt.MINISPIELE_AUS)
    // seit 01.11.2026: E6 zeigt den Insel-Garten (öffnet mit Kapitel 1); wer schon gesät hat, bekommt die Etappe still
    { id: "E6", szene: "spielorte", faellig: (st) => S().MINISPIELE_AUS ? W.Story.kapitel() >= 1 : (st.spielen && !st.frei && profi()),
      genutzt: () => S().MINISPIELE_AUS ? !!(S().lade("garten") && (S().lade("garten").beete || []).some(Boolean) || Object.keys((S().lade("garten") || {}).korb || {}).length) : W.Story.zustand().etappen.E1 === 1 },
    { id: "E7", szene: "merkkiste", faellig: () => faelligeKarten() > 0,
      genutzt: () => { const k = S().lade("lernkartei") || {}; return ["deutsch", "sachkunde"].some(f => (k[f] || []).some(c => c.stufe >= 2)); } },
    { id: "E8", szene: "gefuehle", faellig: () => tageSeitE1() >= 1, genutzt: () => Object.keys((S().lade("gefuehle") || {}).tage || {}).length > 0 },
    // E9 Atelier (NA-17): nach Kapitel 1 und ab dem dritten Tag zeigt Paula Malen und Musik
    { id: "E9", szene: "atelier", faellig: () => W.Story.kapitel() >= 1 && tageSeitE1() >= 2,
      genutzt: () => { const a = S().lade("atelier") || {}; return (a.gemalt || 0) > 0 || (a.wand || []).length > 0 || Object.keys(a.melodien || {}).length > 0; } }
  ];
  // ======================================================================================================
  // Kapitelbogen (KONZEPT „Kapitelbogen“, NA-17): Kapitel öffnen sich über Lernfunde UND eine kleine Bedingung im Fach der Figur.
  // Nie rückwärts, keine Fristen. Kapitel 1 „Der Spross“ öffnet die Szene „erste-frucht“ (E3).
  // ======================================================================================================
  const deutschFertig = () => Object.values(((S().lade("deutsch") || {}).kapitel) || {}).filter(x => x > 0).length;
  // geschaffte Matheweg-Stationen über alle Wege
  const matheFertig = () => { const m = S().lade("mathe") || {}; return ["k1", "k2", "k3", "k4", "k5"].reduce((n, w) => n + Object.values(m[w] || {}).filter(x => x > 0).length, 0); };
  // Ein Sachthema zum Wetter geschafft (Wetter beobachten, Wetterkarte, Wind und Luft …)
  const WETTER_THEMEN = ["wetter", "wetterkarte", "luft-schall", "wasserkreislauf", "jahreszeiten"];
  const wetterThema = () => Object.keys(((S().lade("sachkunde") || {}).themen) || {}).some(id => WETTER_THEMEN.includes(id) || /wetter/.test(id));
  // Tilda (Denken, Schach): drei Matt-in-1-Rätsel oder drei Schach-Lektionen geschafft
  const tildaGenutzt = () => { const d = S().lade("schach") || {}; return Object.keys(d.raetsel || {}).length >= 3 || Object.keys(d.lektionen || {}).length >= 3; };
  // Paula schon besucht: Etappe E9 „Atelier“, eine Englisch-Lektion oder ein Musik-Thema geschafft
  const paulaGenutzt = () => !!((W.Story && W.Story.etappe && W.Story.etappe("E9")) || Object.keys(((S().lade("englisch") || {}).lektionen) || {}).length ||
    Object.keys(((S().lade("sachkunde") || {}).themen) || {}).some(id => id.startsWith("mu-")));
  const KAPITEL = [
    { n: 2, szene: "fipsis-karte", titel: "Fipsis Karte", bedingung: "5 Lernfunde und ein Deutsch-Kapitel",
      faellig: () => (W.Lernfunde ? W.Lernfunde.gesamt() : 0) >= 5 && deutschFertig() >= 1 },
    // 01.11.2026: Kapitel 3 öffnet Bennos Bäckerei (ersetzt „Bennos Brücke“ am Bauplatz, solange die Minispiele ausgeblendet sind)
    { n: 3, szene: "bennos-baeckerei", titel: "Bennos Bäckerei", bedingung: "10 Lernfunde und 3 Stationen auf dem Matheweg",
      faellig: () => (W.Lernfunde ? W.Lernfunde.gesamt() : 0) >= 10 && matheFertig() >= 3 },
    // 05.11.2026: Kapitel 4 „Paulas Fest“ öffnet das Rhythmus-Boot an der Ballon-Wiese (Paulas Fächer: Musik, Englisch, Atelier)
    { n: 4, szene: "paulas-fest", titel: "Paulas Fest", bedingung: "15 Lernfunde und etwas bei Paula (Atelier, Englisch oder ein Musik-Thema)",
      faellig: () => (W.Lernfunde ? W.Lernfunde.gesamt() : 0) >= 15 && paulaGenutzt() },
    // 06.11.2026: Kapitel 5 „Der Sturm“ (KONZEPT) – Ella und Bruni bereiten die Insel vor, danach steigt Ellas Wetter-Drache an der Wetterstation
    { n: 5, szene: "der-sturm", titel: "Der Sturm", bedingung: "25 Lernfunde und ein Sachthema zum Wetter",
      faellig: () => (W.Lernfunde ? W.Lernfunde.gesamt() : 0) >= 25 && wetterThema() },
    // 07.11.2026: Kapitel 6 „Der Leuchtturm“ (KONZEPT) – Tilda führt zum Leuchtturm, in der Höhle darunter: Licht-Rätsel und Schatzkammer
    { n: 6, szene: "der-leuchtturm", titel: "Der Leuchtturm", bedingung: "35 Lernfunde und drei Schach-Rätsel oder drei Schach-Lektionen bei Tilda",
      faellig: () => (W.Lernfunde ? W.Lernfunde.gesamt() : 0) >= 35 && tildaGenutzt() },
    // 09.11.2026: Kapitel 7 „Neue Ufer“ (KONZEPT: Pixel fährt zum Nachbar-Eiland) – Robo macht das Boot am Steg klar; dafür braucht es den Tablet-Führerschein
    { n: 7, szene: "neue-ufer", titel: "Neue Ufer", bedingung: "50 Lernfunde und der Tablet-Führerschein bei Robo Pixel",
      faellig: () => (W.Lernfunde ? W.Lernfunde.gesamt() : 0) >= 50 && profi() },
    // 07.11.2026 (Story-Review): Kapitel 8 „Fipsis Schatz“ – die Schatzkarte ist komplett; in der Truhe am Wegweiser liegt das Wörterbuch der Insel
    { n: 8, szene: "fipsis-schatz", titel: "Fipsis Schatz", bedingung: "die ganze Schatzkarte bei Fipsi (alle fünf Teile)",
      faellig: () => schatzkarteKomplett() },
    // 07.11.2026 (Auftraggeber: Reihenfolge darf sich ändern, noch spielt kein Kind): Kapitel 9 „Bennos Brücke“ – Benno baut eine Brücke zur Sandbank,
    // das Kind misst und rechnet (Längen, Maße, Bauplan). Bedingung: 55 Lernfunde und 5 geschaffte Matheweg-Stationen (Benno = Mathe).
    { n: 9, szene: "bennos-bruecke", titel: "Bennos Brücke", bedingung: "55 Lernfunde und 5 Stationen auf dem Matheweg",
      faellig: () => (W.Lernfunde ? W.Lernfunde.gesamt() : 0) >= 55 && matheFertig() >= 5 },
    // Finale „Die Insel ist wach“ (jetzt Kapitel 10): alle Begleiter feiern, der letzte Nebel geht – danach geht es offen weiter (Jahreszeiten-Episoden).
    // Die Brücke muss nicht fertig sein, nur begonnen (3 von 8 Abschnitten) – das Finale soll nicht an einer unfertigen Brücke hängenbleiben.
    { n: 10, szene: "insel-wach", titel: "Die Insel ist wach", bedingung: "70 Lernfunde und drei Abschnitte an Bennos Brücke",
      faellig: () => (W.Lernfunde ? W.Lernfunde.gesamt() : 0) >= 70 && brueckeStand() >= BRUECKE_FINALE }
  ];
  // Bennos Brücke (Kapitel 9): 8 Abschnitte, Daten bruecke = { abschnitte, neu: { "JJJJ-MM-TT": n }, runden, fehlerfrei } (spiele/bruecke/)
  const BRUECKE_ABSCHNITTE = 8, BRUECKE_FINALE = 3;
  const brueckeStand = () => { const d = S().lade("bruecke") || {}; return Math.max(0, Math.min(BRUECKE_ABSCHNITTE, Math.floor(+d.abschnitte || 0))); };
  const brueckeFertig = () => brueckeStand() >= BRUECKE_ABSCHNITTE;
  // Fipsis Schatzkarte: die fünf Kapitel der Geschichte (spiele/deutsch/geschichte.js, ids gleich – prüft tests/inselkern.js)
  const SCHATZKARTE = ["wald", "hof", "baeckerei", "strand", "schloss"];
  const schatzkarteKomplett = () => { const k = ((S().lade("deutsch") || {}).kapitel) || {}; return SCHATZKARTE.every(id => (k[id] || 0) > 0); };
  // Jahreszeiten-Episoden nach dem Finale (07.11.2026): je Jahreszeit und Jahr einmal eine kurze Szene mit einem Begleiter und ein Sachthema dazu (kein Zwang).
  // Der Winter zählt zum Jahr, in dem er beginnt (Dezember 2026 und Februar 2027 = Winter 2026).
  const JAHRESZEITEN = {
    herbst: { wer: "eule", thema: "baeume", titel: "Bäume genau kennen" },
    winter: { wer: "baer", thema: "wetter", titel: "Wetter beobachten" },
    fruehling: { wer: "biber", thema: "pflanzen", titel: "Pflanzen wachsen" },
    sommer: { wer: "papagei", thema: "wasser", titel: "Wasser" }
  };
  function jahreszeitJetzt() {
    const q = W.location && W.location.search ? new URLSearchParams(W.location.search) : null, d = new Date(W.__jetzt || Date.now()), z = zeit(q, d);
    const jahr = z.SAISON === "winter" && z.MONAT <= 2 ? d.getFullYear() - 1 : d.getFullYear();
    return { saison: z.SAISON, szene: "jz-" + z.SAISON, merke: `jz-${z.SAISON}-${jahr}` };
  }
  // Nebenszenen (07.11.2026): kleine Szenen ohne Kapitel – höchstens eine am Tag, nach den Kapitel-Szenen; wer den Ort schon kennt, bekommt sie still
  const tierstationGenutzt = () => { const d = S().lade("tierstation") || {}; return !!(d.gast || Object.keys(d.frei || {}).length); };
  const NEBEN = [
    { id: "brunis-station", faellig: () => ortOffen("tierstation"), genutzt: tierstationGenutzt },
    { id: "tilda", faellig: () => W.Story.etappe("E9") && W.Story.kapitel() >= 3,
      genutzt: () => { const d = S().lade("schach") || {}; return Object.keys(d.raetsel || {}).length > 0 || Object.keys(d.lektionen || {}).length > 0; } },
    // Paulas Fest findet statt: nach der ersten Fahrt mit dem Rhythmus-Boot
    { id: "paulas-feier", faellig: () => W.Story.kapitel() >= 4 && ((S().lade("rhythmus") || {}).runden || 0) > 0, genutzt: () => false }
  ];
  // Eigene Idee (07.11.2026): Feste aus Herkunftsländern als Episoden (KONZEPT „Episoden“) – für alle Kinder, ab Kapitel 1, je Jahr einmal,
  // nur in den Festtagen; wer in der Zeit nicht kommt, verpasst nichts (keine Belohnung, nur eine kurze Szene in der Chronik).
  const FESTE = [
    { id: "fest-neujahr", von: "12-31", bis: "01-07", wer: "baer" },   // Neujahr mit Väterchen Frost (Russland, Ukraine, Bulgarien …)
    { id: "fest-nouruz", von: "03-19", bis: "03-23", wer: "papagei" }   // Nouruz, Neujahr zum Frühlingsanfang (Iran, Afghanistan, Kurden …)
  ];
  function festJetzt() {
    const d = new Date(W.__jetzt || Date.now()), md = `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const f = FESTE.find(x => (x.von <= x.bis ? md >= x.von && md <= x.bis : md >= x.von || md <= x.bis)); if (!f) return null;
    const jahr = f.von > f.bis && md <= f.bis ? d.getFullYear() - 1 : d.getFullYear();   // Neujahr 2026/27 zählt zu 2026
    return { id: f.id, merke: `${f.id}-${jahr}`, wer: f.wer };
  }
  const NEBEN_IDS = () => NEBEN.map(n => n.id).concat(Object.keys(JAHRESZEITEN).map(j => "jz-" + j), FESTE.map(f => f.id));
  function nebenszene() {
    const St = W.Story, h = isoJetzt(), chr = St.chronik();
    if (chr.some(x => x.d === h && NEBEN_IDS().concat(["insel-wach"]).includes(x.s))) return null;   // höchstens eine am Tag, nicht am Tag des Finales
    for (const n of NEBEN) {
      if (St.gesehen(n.id)) continue;
      if (n.genutzt()) { St.merkeSzene(n.id, true); continue; }
      if (n.faellig()) return n.id;
    }
    { const f = festJetzt(); if (f && St.kapitel() >= 1 && !St.gesehen(f.merke)) return f.id; }
    if (St.kapitel() >= 10) { const j = jahreszeitJetzt(); if (!St.gesehen(j.merke)) return j.szene; }
    return null;
  }
  // Wörter für Fipsis Wegweiser: nur Wörter, die das Kind schon hatte (Lernkartei Deutsch, Lernfunde in Deutsch), höchstens n, ohne Dopplungen
  function wortSchilder(n = 3) {
    const aus = [], dazu = (w) => { w = String(w || "").trim(); if (/^[A-Za-zÄÖÜäöüß-]{2,14}$/.test(w) && !aus.some(x => x.toLowerCase() === w.toLowerCase())) aus.push(w); };
    const k = (S().lade("lernkartei") || {}).deutsch || [];
    k.slice().reverse().forEach(c => { const s = c.s || {}; dazu(s.wort || (typeof c.k === "string" && c.k.startsWith("wort|") ? c.k.slice(5) : "")); });
    // (07.11.2026) Lernfunde tragen das Fach in f (vorher stand hier f.fach – Lernfunde kamen nie an); Wörter nach der, die, das
    if (W.Lernfunde) W.Lernfunde.letzteTage(60).filter(f => (f.f || f.fach) === "deutsch").forEach(f => { const t = String(f.t || f.text || ""); (t.match(/\b(der|die|das) ([A-ZÄÖÜ][a-zäöüß-]+)/g) || []).forEach(x => dazu(x.split(" ")[1])); if (/^Neues Wort: /.test(t)) dazu(t.replace(/^Neues Wort: (der |die |das )?/, "").split(/[ ,–]/)[0]); });
    return aus.slice(0, n);
  }
  // Wer spricht in der Merkkisten-Szene? Fipsi (Deutsch) oder Ella (Sachunterricht)
  const merkkisteBei = () => (W.Lernkartei && W.Lernkartei.anzahlFaellig("deutsch") === 0 && W.Lernkartei.anzahlFaellig("sachkunde") > 0 ? "eule" : "fipsi");
  // nach dem Ende einer Story-Szene
  function storyFertig(def) {
    const St = W.Story; if (!St || !def) return; if (def.etappe) St.etappeFertig(def.etappe); if (def.kapitel) St.setzeKapitel(def.kapitel);
    if (def.jahreszeit) St.merkeSzene(jahreszeitJetzt().merke, true);
    if (def.fest) { const f = festJetzt(); if (f && f.id === def.id) St.merkeSzene(f.merke, true); }   // je Fest und Jahr einmal   // je Jahreszeit und Jahr einmal (die Szene selbst steht einmal in der Chronik)
  }
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
    { id: "rosa", name: "Rosa", farbe: ["#FFD9E6", "#FFE9C2"], preis: 0 },   // bleibt für alle kostenlos (alte Zimmer)
    { id: "mint", name: "Mint", farbe: ["#C9F2E3", "#EAF8F1"], preis: 3 },
    { id: "himmel", name: "Himmelblau", farbe: ["#CFE6FF", "#EEF5FF"], preis: 3 },
    { id: "sonne", name: "Sonnengelb", farbe: ["#FFE9A8", "#FFF5D6"], preis: 3 },
    { id: "lila", name: "Lavendel", farbe: ["#E3D6FF", "#F3EDFF"], preis: 3 }
  ];
  // Junge und Mädchen unterscheiden sich stärker (02.11.2026): Jungen starten mit himmelblauer Wand, Mädchen mit rosa; die eigene Startfarbe ist kostenlos
  const geschlecht = () => { try { return S().kind().geschlecht || "n"; } catch (e) { return "n"; } };
  const standardWand = () => geschlecht() === "m" ? "himmel" : "rosa";
  const wandPreis = (w) => w.id === standardWand() ? 0 : w.preis;
  const zimmerDaten = () => Object.assign({ plaetze: {}, wand: standardWand() }, S().lade("zimmer") || {});
  // Zettel der Pinnwand: Lernfunde der letzten 7 Tage (gezeigt werden höchstens 8), neu = von heute
  function pinnwandZettel() {
    const L = W.Lernfunde; if (!L) return [];
    const funde = L.letzteTage(7), heute = L.heute().length;
    return funde.map((f, i) => ({ t: f.t, e: f.e, fach: f.f, gemeistert: f.a === "gemeistert", neu: i < heute }));
  }
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
    const UFER = WELT.R, RMAX_LAUF = WELT.R - 0.6;
    const STEG = { x: 3.2, z0: UFER - 2.2, z1: UFER + 2.4 };
    const SU = { x: STEG.x + 2.1, z: Math.min(RMAX_LAUF - 1.1, STEG.z0 + 0.6) };
    const PAKET_POS = { x: STEG.x + 0.95, z: STEG.z0 + 0.15 };
    const HAUS_DREH = WELT.insel ? 0.35 : P.haus[2];
    // Kapitel 2 (NA-17): Der neue Weg führt von Fipsi ein Stück nach außen zu einem Wegweiser – Platz ohne Baum und ohne anderen Ort
    if (!P.kartenweg) {
      const [fx, fz] = P.fipsi, w0 = Math.atan2(fz, fx), andere = Object.entries(P).filter(([k]) => !["fipsi", "kartenweg"].includes(k)).map(([, v]) => v);
      const kand = [0.6, -0.6, 1.1, -1.1, 0, 1.6, -1.6].map(d => { let x = fx + Math.cos(w0 + d) * 3.2, z = fz + Math.sin(w0 + d) * 3.2; const r = Math.hypot(x, z), m = RMAX_LAUF - 1.6; if (r > m) { x *= m / r; z *= m / r; } return [x, z]; });
      const frei = ([x, z]) => WELT.baeume.every(b => Math.hypot(b.x - x, b.z - z) > 1.8) && andere.every(v => Math.hypot(v[0] - x, v[1] - z) > 2) && !(WELT.see && Math.hypot(x - WELT.see.x, z - WELT.see.z) < WELT.see.r + 1);
      P.kartenweg = kand.find(frei) || kand[0];
    }
    // Freier Platz am Ufer für einen großen Ort (Leuchtturm, Forscherlager): 24 Winkel (15°-Schritte, abwechselnd links/rechts von a0) auf
    // zwei Ringen (rL, rL − 1,1); Platz ohne Baum, ohne anderen Ort, nicht am Steg. Ohne freien Winkel der Platz mit dem kleinsten Mangel,
    // Bäume im Weg werden gefällt (Review 07.11.2026) – so steht nie etwas in einem Baum oder auf einem anderen Ort.
    const ABST = { haus: 4.5, lauf: 4.2, kart: 4.2, bau: 4.2, ballons: 3.8, buehne: 3.6, truhe: 3.4, start: 3.6, leuchtturm: 4.2, lager: 4.0, bruecke: 4.0 };   // große Orte brauchen mehr Platz
    function freierPlatz(a0, rL, BAUM = 3.2, extra = null) {
      const andere = Object.entries(P).map(([k, v]) => [v[0], v[1], ABST[k] || 2.8]);
      const winkel = Array.from({ length: 24 }, (_, i) => a0 + (i % 2 ? -1 : 1) * Math.ceil(i / 2) * Math.PI / 12);
      const kand = [rL, rL - 1.1].flatMap(rad => winkel.map(a => [Math.cos(a) * rad, Math.sin(a) * rad]));
      // Fehlender Abstand je Regel; 0 = Platz ist frei. Bäume zählen einfach (sie lassen sich fällen), Orte, Steg, Sonnenuhr und See dreifach.
      const mangel = ([x, z]) => {
        let m = 0; const fehlt = (ist, soll, g) => { if (ist < soll) m += (soll - ist) * g; };
        WELT.baeume.forEach(b => fehlt(Math.hypot(b.x - x, b.z - z), BAUM, 1));
        andere.forEach(v => fehlt(Math.hypot(v[0] - x, v[1] - z), v[2], 3));
        fehlt(Math.hypot(x - STEG.x, z - STEG.z0), 4, 3); fehlt(Math.hypot(x - SU.x, z - SU.z), 2.5, 3);
        if (WELT.see) fehlt(Math.hypot(x - WELT.see.x, z - WELT.see.z), WELT.see.r + 1.5, 3);
        if (extra) m += extra(x, z);
        return m;
      };
      let wahl = kand.find(k => mangel(k) === 0);
      if (!wahl) {
        wahl = kand.reduce((best, k) => (mangel(k) < mangel(best) ? k : best), kand[0]);
        const [x, z] = wahl; WELT.baeume = WELT.baeume.filter(b => Math.hypot(b.x - x, b.z - z) > BAUM);
      }
      return wahl;
    }
    // Kapitel 6 (07.11.2026): Leuchtturm mit Höhle am Ufer, Tür der Höhle zur Mitte
    if (!P.leuchtturm) { const [x, z] = freierPlatz(Math.atan2(P.schach[1], P.schach[0]), RMAX_LAUF - 1.3); P.leuchtturm = [x, z, Math.atan2(-x, -z)]; }
    // Kapitel 7 (09.11.2026): Forscherlager auf jedem Nachbar-Eiland (auf der Heimatinsel fest in STANDARD), Zelt mit Blick zur Mitte
    if (!P.lager) { const [x, z] = freierPlatz(Math.atan2(P.eule[1], P.eule[0]) + Math.PI / 2, RMAX_LAUF - 2.6, 2.6); P.lager = [x, z, Math.atan2(-x, -z)]; }
    // Kapitel 9 „Bennos Brücke“ (07.11.2026): Baustelle am Ufer in Richtung Benno, nach P.leuchtturm/P.lager gesucht (die bleiben so, wo sie waren).
    // Die Brücke führt von dort gerade hinaus aufs Wasser zu einer kleinen Sandbank; nicht in Richtung Steg/Boot (Winkel ≥ 0,9) und mit Platz
    // zu Leuchtturm und Lager auch draußen auf dem Wasser.
    if (!P.bruecke) {
      const wSteg = Math.atan2(STEG.z0, STEG.x), wink = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
      const [x, z] = freierPlatz(Math.atan2(P.biber[1], P.biber[0]), RMAX_LAUF - 1.6, 3.2, (x, z) => {
        const a = Math.atan2(z, x); let m = wink(a, wSteg) < 0.9 ? (0.9 - wink(a, wSteg)) * 30 : 0;
        ["leuchtturm", "lager"].forEach(k => { const v = P[k]; if (v && wink(a, Math.atan2(v[1], v[0])) < 0.42) m += (0.42 - wink(a, Math.atan2(v[1], v[0]))) * 30; });
        return m;
      });
      P.bruecke = [x, z, Math.atan2(-x, -z)];
    }
    // Brücke: von r0 (kurz vor der Laufgrenze) bis r1 draußen auf dem Wasser, 8 gleich lange Abschnitte, Breite 1,3; Sandbank am Ende
    const BRUECKE = (() => {
      const a = Math.atan2(P.bruecke[1], P.bruecke[0]), ux = Math.cos(a), uz = Math.sin(a), r0 = RMAX_LAUF - 0.9, r1 = UFER + 6.4, sr = 2.4;
      const laenge = r1 - r0, stueck = laenge / BRUECKE_ABSCHNITTE, breite = 1.3;
      const sand = { x: ux * (r1 + sr - 0.5), z: uz * (r1 + sr - 0.5), r: sr };
      // Liegt (x, z) auf der Brücke (bis Abschnitt n) oder – wenn sie fertig ist – auf der Sandbank?
      const lage = (x, z) => { const dx = x - ux * r0, dz = z - uz * r0; return { d: dx * ux + dz * uz, s: -dx * uz + dz * ux }; };
      const auf = (x, z, n) => {
        const { d, s } = lage(x, z); n = Math.max(0, Math.min(BRUECKE_ABSCHNITTE, n | 0));
        if (n > 0 && Math.abs(s) < breite / 2 - 0.1 && d > -0.5 && d < n * stueck - (n < BRUECKE_ABSCHNITTE ? 0.25 : -0.4)) return "bruecke";
        if (n >= BRUECKE_ABSCHNITTE && Math.hypot(x - sand.x, z - sand.z) < sr - 0.45) return "sandbank";
        return null;
      };
      return { a, ux, uz, r0, r1, laenge, stueck, breite, sand, x0: ux * r0, z0: uz * r0, abschnitte: BRUECKE_ABSCHNITTE, lage, auf,
        punkt: (d, s = 0) => [ux * r0 + ux * d - uz * s, uz * r0 + uz * d + ux * s] };
    })();
    // Vor der Haustür (dort kommt man beim Rausgehen an)
    const vorDerTuer = () => ({ x: P.haus[0] + Math.sin(HAUS_DREH) * 2.75, z: P.haus[1] + Math.cos(HAUS_DREH) * 2.75, dreh: HAUS_DREH });
    // Trittstein-Wege der Heimatinsel (Weg 3, 09.11.2026): vom Start über Zwischenpunkte zu Garten, Bäckerei, Tierstation und Leuchtturm,
    // alle 1,3 Einheiten ein Stein mit leichtem Schlenker; Steine in Bäumen, auf Steinen oder an anderen Orten fallen weg, der Weg endet 2,2 vor dem Ziel
    const alleSteine = [...(WELT.pfad || [])];   // schon gelegte Steine: gemeinsamer Anfang zweier Wege bekommt keine doppelten
    const WEGE = (WELT.wege || []).map(({ von, via, ziel }) => {
      const z = P[ziel]; if (!z) return [];
      const punkte = [von || [P.start[0] + 1, P.start[1] + 2], ...via, [z[0], z[1]]], steine = [];
      const andere = Object.entries(P).filter(([k]) => k !== "start" && k !== ziel).map(([, v]) => v);
      let rest = von ? 1.3 : 2.6;   // Abstand zum nächsten Stein; am Start etwas Luft um die Figur, an einer Abzweigung nicht
      punkte.slice(1).forEach(([bx, bz], i) => {
        const [ax, az] = punkte[i], dx = bx - ax, dz = bz - az, l = Math.hypot(dx, dz), ex = dx / l, ez = dz / l, letzter = i === punkte.length - 2;
        for (let s = rest; s < l - (letzter ? 2.2 : 0); s += 1.3) {
          const q = Math.sin(s * 1.1 + i) * 0.35, x = +(ax + ex * s - ez * q).toFixed(2), zz = +(az + ez * s + ex * q).toFixed(2);
          rest = s + 1.3 - l;
          if (WELT.baeume.some(b => Math.hypot(b.x - x, b.z - zz) < 1.3) || WELT.steine.some(st => Math.hypot(st[0] - x, st[1] - zz) < st[2] + 0.7) ||
            andere.some(o => Math.hypot(o[0] - x, o[1] - zz) < 1.6) || Math.hypot(x - STEG.x, zz - STEG.z0) < 2 || Math.hypot(x, zz) > RMAX_LAUF - 0.8 ||
            alleSteine.some(st => Math.hypot(st[0] - x, st[1] - zz) < 1.0)) continue;
          steine.push([x, zz]); alleSteine.push([x, zz]);
        }
        if (rest < 0.4) rest = 0.4;
      });
      return steine;
    }).filter(w => w.length);
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
      paket: { x: PAKET_POS.x, z: PAKET_POS.z, h: 0.8 },
      nest: { x: P.nest[0], z: P.nest[1], h: 0.8 },
      ballons: { x: P.ballons[0], z: P.ballons[1], h: 2.4 },
      fipsi: { x: P.fipsi[0], z: P.fipsi[1], h: 1.4 },
      baer: { x: P.baer[0], z: P.baer[1], h: 1.6 },
      biber: { x: P.biber[0], z: P.biber[1], h: 1.4 },
      buehne: { x: P.buehne[0], z: P.buehne[1], h: 1.8 },
      kartenweg: { x: P.kartenweg[0], z: P.kartenweg[1], h: 1.4 }
    };
    ORTE.schach = { x: P.schach[0], z: P.schach[1], h: 1.2 };   // Tilda am Schachtisch
    ORTE.leuchtturm = { x: P.leuchtturm[0], z: P.leuchtturm[1], h: 3.4 };   // Kapitel 6
    ORTE.lager = { x: P.lager[0], z: P.lager[1], h: 2.2 };   // Kapitel 7: Forscherlager
    ORTE.boot = { x: STEG.x + 1.55, z: STEG.z1 - 0.9, h: 1.0 };   // Kapitel 7: Robos Boot am Steg
    if (P.station) ORTE.station = { x: P.station[0], z: P.station[1], h: 1.6 };   // Wetterstation (Kapitel 5, Wetter-Drache)
    // neue Orte an den Plätzen der ausgeblendeten Minispiele (01.11.2026)
    if (P.lauf) ORTE.garten = { x: P.lauf[0], z: P.lauf[1], h: 1.2 };
    if (P.kart) ORTE.baeckerei = { x: P.kart[0], z: P.kart[1], h: 2.0 };
    if (P.bau) ORTE.tierstation = { x: P.bau[0], z: P.bau[1], h: 1.6 };
    // Kapitel 8 „Fipsis Schatz“ (07.11.2026): Truhe neben Fipsis Wegweiser – quer zum Weg, auf der Seite mit mehr Platz zu den Bäumen.
    // Kein Eintrag in P (sonst rückten Leuchtturm und Lager bestehender Welten), nur ein Ort für Zeigehand und 3D.
    {
      const [kx, kz] = P.kartenweg, [fx, fz] = P.fipsi, l = Math.hypot(kx - fx, kz - fz) || 1, nx = -(kz - fz) / l, nz = (kx - fx) / l;
      const platz = (s) => { const x = kx + nx * 1.15 * s - (kx - fx) / l * 0.3, z = kz + nz * 1.15 * s - (kz - fz) / l * 0.3; return [x, z, Math.min(...WELT.baeume.map(b => Math.hypot(b.x - x, b.z - z)).concat([9]))]; };
      const a = platz(1), b = platz(-1), [x, z] = a[2] >= b[2] ? a : b;
      ORTE.schatz = { x, z, h: 0.9, dreh: Math.atan2(fx - x, fz - z) };
    }
    // Finale (Kapitel 10): alle Begleiter versammeln sich am Schachtisch bei Tilda
    ORTE.fest = { x: P.schach[0], z: P.schach[1], h: 1.4 };
    // Kapitel 9: Bennos Baustelle am Ufer und die Sandbank draußen
    ORTE.bruecke = { x: P.bruecke[0], z: P.bruecke[1], h: 1.6 };
    ORTE.sandbank = { x: BRUECKE.sand.x, z: BRUECKE.sand.z, h: 0.6 };
    return { WELT, P, ZX, ZX_GRENZE, bodenY, UFER, RMAX_LAUF, STEG, SU, PAKET_POS, HAUS_DREH, vorDerTuer, NEBEL, nachbarn, ORTE, WEGE, BRUECKE };
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
  // Spiele, die noch entstehen: seit 30.10.2026 alle fünf Minispiele (ausgeblendet, werden neu gedacht – Spielwelt.MINISPIELE_AUS)
  const bald = (id) => !!S().MINISPIELE_AUS && ["ballons", "truhe", "insel", "lauf", "kart", "bau"].includes(id);
  // Neue Orte (01.11.2026) an den Plätzen der ausgeblendeten Minispiele: Garten (Kapitel 1), Tierpflege-Station (Kapitel 2), Bäckerei (öffnet Kapitel 3)
  const NEU_FERTIG = { garten: true, baeckerei: true, tierstation: true };
  function ortOffen(id, insel = true) {
    const k = W.Story ? W.Story.kapitel() : 0;
    if (id === "garten") return S().offen(k >= 1);
    if (id === "tierstation") return S().offen(k >= 2);
    if (id === "baeckerei") return S().offen(k >= 3);
    if (id === "schatz") return k >= 8;   // Fipsis Truhe mit dem Wörterbuch der Insel (Kapitel 8)
    if (id === "lager") return S().offen(insel ? k >= 1 : k >= 7);   // Forscherlager: daheim ab Kapitel 1 (Karte der Heimatinsel), auf Nachbar-Eilanden ab Kapitel 7
    if (id === "boot") return S().offen(!insel || k >= 7);
    if (id === "bruecke") return S().offen(k >= 9);   // Bennos Brücke (Kapitel 9)   // Reisen mit Robos Boot: ab Kapitel 7, auf einem Eiland immer (Rückfahrt)
    return true;
  }
  // Kapitel 7 „Neue Ufer“ (09.11.2026): Forscherlager (Ella) und Robos Boot am Steg; lage.insel = Heimatinsel (sonst Nachbar-Eiland)
  function lagerAntwort(lage = {}) {
    const insel = lage.insel !== false;
    if (!ortOffen("lager", insel)) return insel
      ? blase("eule", "Das Forscherlager – noch zu", "Hier schlagen wir bald unser Forscherlager auf. Lern etwas Neues – wenn die erste Frucht am Wissensbaum wächst, geht es los!", "Скоро здесь будет наш лагерь исследователей. Он откроется с первым плодом на дереве знаний.")
      : blase("eule", "Das Forscherlager – noch zu", "Dieses Eiland erforschen wir richtig, sobald Robos Boot bereit ist – in Kapitel 7. Bis dahin: Was entdeckst du heute auf der Heimatinsel?", "Этот остров мы исследуем по-настоящему, когда лодка Робо будет готова – в главе 7.");
    return insel
      ? blase("eule", "Ellas Forscherlager", `Hallo ${name()}! Hier ist unser Forscherlager. Kannst du die Karte unserer Insel lesen? Dann finden wir jeden Ort!`, "Это наш лагерь исследователей. Умеешь читать карту острова? Тогда мы найдём любое место!", "../expedition/")
      : blase("eule", "Ellas Forscherlager", `Ein neues Eiland, ${name()}! Schreib ins Forscher-Tagebuch, was du hier entdeckst – und lies die Karte.`, "Новый остров! Запиши в дневник исследователя, что ты здесь нашёл (нашла), и прочитай карту.", "../expedition/");
  }
  function bootAntwort(lage = {}) {
    const insel = lage.insel !== false;
    if (!ortOffen("boot", insel)) return blase("robo", "Robos Boot", `Mit diesem Boot habe ich dich hergebracht, ${name()}. Ich schraube noch am Motor – piep! Bald fahren wir zusammen zu neuen Ufern.`, "На этой лодке я привёз тебя сюда. Я ещё подкручиваю мотор – пип! Скоро мы вместе отправимся к новым берегам.");
    return Object.assign(insel
      ? blase("robo", "Robos Boot", `Piep! Mein Boot ist bereit, ${name()}. Wünsch dir ein Eiland – und wir fahren hin. Wir kommen immer zurück.`, "Пип! Моя лодка готова. Пожелай остров – и мы поплывём туда. Мы всегда возвращаемся.")
      : blase("robo", "Robos Boot", `Sollen wir weiterfahren, ${name()}? Nach Hause auf die Heimatinsel – oder zu einem anderen Eiland.`, "Поплывём дальше? Домой, на родной остров, – или на другой остров."), { extra: "reisen" });
  }
  function gartenAntwort() {
    if (!ortOffen("garten")) return blase("🌱", "Der Insel-Garten – noch zu", "Der Garten wacht auf, wenn auf deinem Wissensbaum die erste Frucht wächst. Lern etwas Neues bei Ella, Fipsi oder Benno!", "Сад проснётся, когда на дереве знаний вырастет первый плод.");
    const G = W.Garten, l = G ? G.lage() : { reif: 0, durstig: 0, leer: 3, z: [] };
    const de = l.reif ? `Hurra, ${l.reif === 1 ? "eine Pflanze ist" : `${l.reif} Pflanzen sind`} reif! Komm ernten.` : l.durstig ? `${l.durstig === 1 ? "Eine Pflanze hat" : `${l.durstig} Pflanzen haben`} Durst. Gießt du sie?`
      : l.leer === l.z.length ? `Hallo ${name()}! Hier ist dein Garten. Säst du etwas?` : "Alles gegossen! Morgen wachsen deine Pflanzen weiter.";
    return blase("eule", "Ellas Insel-Garten", de, "Это твой сад. Посей, полей и собери урожай!", "../garten/");
  }
  const baldBlase = (e, titel) => blase("🚧", `${e} ${titel}`, "Hier entsteht etwas Neues! Bald kannst du hier wieder spielen.", "Здесь появится что-то новое! Скоро здесь снова можно будет играть.");
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
  // Wetter-Drache (06.11.2026): ab Kapitel 5 führt die Wetterstation zu Ellas Wetter-Drachen; das echte Wetter steht mit in der Blase
  const drachenOffen = () => !!(W.Story && S().offen(W.Story.kapitel() >= 5));
  function drachenAntwort(w) {
    const satz = w ? `Bei dir zu Hause: ${Math.round(w.temp)} Grad, Wind ${Math.round(w.wind || 0)} km/h. ` : "";
    return blase("eule", "Ellas Wetter-Drache", `${satz}Hallo ${name()}! Wir beobachten das Wetter – und wenn der Wind passt, lassen wir den Drachen steigen!`,
      "Мы наблюдаем за погодой – а если ветер подходящий, запускаем воздушного змея!", "../wetter/");
  }
  // Tildas Leuchtturm (07.11.2026): ab Kapitel 6 offen (Licht-Rätsel und Schatzkammer in der Höhle), vorher dunkel und ohne Ziel
  const leuchtturmOffen = () => !!(W.Story && S().offen(W.Story.kapitel() >= 6));
  function leuchtturmAntwort() {
    if (!leuchtturmOffen()) return blase("tilda", "Der alte Leuchtturm", "Der Leuchtturm ist noch dunkel. Ich denke noch gründlich nach, wie wir hineinkommen. Wenn es soweit ist, zeige ich dir den Weg.",
      "Маяк ещё тёмный. Я ещё думаю, как нам туда попасть. Когда придёт время, я покажу тебе дорогу.");
    return blase("tilda", "Tildas Leuchtturm", `Hallo ${name()}! Unten in der Höhle lenken wir das Licht mit Spiegeln. Und meine Schatzkammer zeige ich dir auch!`,
      "Внизу в пещере мы направляем свет зеркалами. И свою сокровищницу я тебе тоже покажу!", "../leuchtturm/");
  }
  // Bennos Brücke (Kapitel 9, 07.11.2026): Baustelle am Ufer → spiele/bruecke/; vorher sammelt Benno noch Holz
  function brueckeAntwort() {
    if (!ortOffen("bruecke")) return blase("biber", "Bennos Holzstapel", "Hier sammle ich Holz für etwas Großes. Was es wird, verrate ich dir in Kapitel 9!", "Здесь я собираю дерево для чего-то большого. Что это будет, я расскажу в главе 9.");
    const n = brueckeStand();
    if (n >= BRUECKE_ABSCHNITTE) return blase("biber", "Bennos Brücke", `Unsere Brücke ist fertig, ${name()}! Lauf hinüber zur Sandbank. Auf dem Bauplatz messen und rechnen wir trotzdem weiter, wenn du magst.`,
      "Наш мост готов! Пройди по нему на отмель. На стройке мы можем и дальше измерять и считать.", "../bruecke/");
    return blase("biber", "Bennos Brücke", n ? `Schon ${n} von ${BRUECKE_ABSCHNITTE} Stücken stehen, ${name()}! Messen wir das nächste Stück aus?` : `Hallo ${name()}! Hier bauen wir die Brücke zur Sandbank. Hilfst du mir beim Messen und Rechnen?`,
      "Здесь мы строим мост до отмели. Поможешь мне измерять и считать?", "../bruecke/");
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
      case "ballons": if (bald(id)) return rhythmusAntwort(); return spielort(() => profi() ? blase("🎈", "Ballon-Wiese", "Lass so viele Ballons platzen, wie du kannst!", "Лопни как можно больше шариков!", "../welt3d/ballons.html") : fuehrerschein());
      case "truhe": if (bald(id)) return angelnAntwort(); return spielort(() => profi() ? blase("🏝️", "Schatz-Strand", "Auf der Schatzinsel wartet eine Truhe. Findest du sie?", "На острове сокровищ ждёт сундук. Найдёшь его?", "../welt3d/insel.html") : fuehrerschein());
      case "schach": return blase("tilda", "Tilda am Schachtisch", `Hallo ${name()}! Ich bin Tilda. Langsam und klug gewinnt! Lernst du mit mir Schach?`, "Привет! Я черепаха Тильда. Медленно и умно побеждает! Научишься со мной шахматам?", "../schach/");
      case "buehne": return paulaAntwort();
      case "leuchtturm": return leuchtturmAntwort();
      case "lager": return lagerAntwort(lage);
      case "bruecke": return brueckeAntwort();
      case "sandbank": return blase("biber", "Die Sandbank", brueckeFertig() ? `Von hier sieht man die ganze Insel, ${name()}! Schau mal, wie weit wir gebaut haben.` : "Da draußen liegt die Sandbank. Mit Bennos Brücke kommen wir bald trocken hinüber!",
        brueckeFertig() ? "Отсюда виден весь остров! Посмотри, как далеко мы построили." : "Там лежит песчаная отмель. По мосту Бенно мы скоро дойдём туда, не намокнув!");
      case "boot": return bootAntwort(lage);
      case "garten": return gartenAntwort();
      case "baeckerei": if (!NEU_FERTIG.baeckerei) return baldBlase("🥨", "Bäckerei Benno"); return baeckereiAntwort();
      case "tierstation": if (!NEU_FERTIG.tierstation) return baldBlase("🩹", "Tierpflege-Station"); return tierstationAntwort();
      case "wegweiser": {   // Kapitel 2 (NA-17): Fipsis Wegweiser zeigt Wörter, die das Kind schon hatte
        const w = wortSchilder(3);
        return blase("fipsi", "Fipsis Wegweiser", w.length ? `Auf den Schildern steht: ${w.join(", ")}. Lies die Wörter laut – du kennst sie schon!` : "Hier kommen bald Wörter hin, die du bei mir lernst. Komm in die Schatzkarte!",
          w.length ? "На табличках слова, которые ты уже знаешь. Прочитай их вслух!" : "Скоро здесь будут слова, которые ты выучишь у меня.", "../deutsch/");
      }
      case "schatz": return blase("fipsi", "Fipsis Schatz", `Unser Schatz, ${name()}: das Wörterbuch der Insel! Darin stehen alle Wörter, die du bei mir gelernt hast – von A bis Z.`,
        "Наше сокровище: словарь острова! В нём все слова, которые ты выучил(а) у меня – от А до Я.", "../album/#woerterbuch");
      case "jahreszeit": { const j = jahreszeitJetzt(), x = JAHRESZEITEN[j.saison];
        return blase(x.wer, x.titel, `Magst du mehr wissen? Bei Ella gibt es das Thema „${x.titel}“. Schau rein, wann du willst!`, "Хочешь узнать больше? У Эллы есть тема об этом. Загляни, когда захочешь!", "../sachkunde/?thema=" + x.thema); }
      case "station": return drachenOffen() ? drachenAntwort(lage.wetter) : wetterAntwort(lage.wetter);
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
      case "spiegel": return blase("🪞", "Der Spiegel", "Schau, wie du gewachsen bist: deine Fähigkeiten, was du gut kannst, und deine Pokale.", "Посмотри, как ты вырос(ла)!", "../ich/");
      // Pinnwand: Lernfunde der letzten 7 Tage als Zettel (die Looks zeichnen sie aus pinnwandZettel())
      case "pinnwand": {
        const z = pinnwandZettel(), heute = z.filter(x => x.neu).length;
        if (!z.length) return blase("📌", "Deine Pinnwand", "Hier hängst du auf, was du diese Woche Neues lernst. Jeder Lernfund bekommt einen Zettel!", "Здесь висит всё новое, что ты узнаёшь за неделю.", "../ich/");
        return blase("📌", "Deine Pinnwand", `Diese Woche ${z.length === 1 ? "1 Zettel" : `${z.length} Zettel`}${heute ? `, ${heute} von heute (golden umrandet)` : ""}: ` +
          z.slice(0, 4).map(f => f.t.replace(/^Neues Wort: /, "").replace(/ – (war|jetzt).*$/, "")).join(" · ") + (z.length > 4 ? " …" : ""), `На этой неделе ты узнаёшь много нового: ${z.length}!`, "../ich/");
      }
      case "staffelei": return blase("papagei", "Deine Staffelei", lage.bild ? "Hier steht dein neuestes Bild. Papagei Paula hat schon Farben bereitgelegt – malst du noch eins?" : "Eine leere Leinwand! Mit Papagei Paula kannst du im Atelier malen, was du willst.", "Здесь можно рисовать с попугаем Паулой!", "../atelier/");
      case "bild": return blase("papagei", "Dein Bild", `Das hast du am ${new Date(lage.t || Date.now()).toLocaleDateString("de-DE")} gemalt. Es hängt hier, bis du ein anderes aufhängst.`, "Это ты нарисовал(а)! Красиво!", "../atelier/");
      case "moebel": { const m = MOEBEL.find(x => x.id === lage.id); return m ? { blase: [m.e, m.name, m.text, "", null] } : null; }
      case "lauf": case "kart": case "bau": {
        const info = SPIELE[id], [titel, de, ru, ziel] = ORT_TEXT[id];
        if (bald(id)) return baldBlase(info.e, titel);
        if (!istFrei(id)) {
          const brauch = W.Lernfunde ? W.Lernfunde.STUFEN[info.stufe - 1] : 0, hat = W.Lernfunde ? W.Lernfunde.gesamt() : 0;
          return blase("🌳", `${info.e} ${info.name} – noch zu`, `Dieser Ort öffnet sich, wenn dein Wissensbaum wächst. Noch ${Math.max(1, brauch - hat)} ${brauch - hat === 1 ? "Lernfund" : "Lernfunde"} – lern etwas Neues bei Ella, Fipsi oder Benno!`, "Это место откроется, когда вырастет твоё дерево знаний. Узнай что-нибудь новое!");
        }
        return spielort(() => profi() ? blase(info.e, titel, de, ru, ziel) : fuehrerschein());
      }
    }
    return null;
  }
  // Aufschrift des Aktionsknopfs je Station (emoji, Wort) und Reichweite (Weltmaß)
  const AKTION = {
    haus: [["🚪", "Reingehen"], 3.4], ballons: [["🎈", "Spielen"], 1.9], truhe: [["🔓", "Öffnen"], 1.9], schach: [["♟️", "Schach"], 2.4], buehne: [["🎵", "Musik"], 2.6],
    station: [["🌦️", "Ansehen"], 1.9], album: [["📒", "Album"], 1.6], bett: [["🛏️", "Ansehen"], 2.2], schrank: [["🚪", "Öffnen"], 2.0], spiegel: [["🪞", "Reinschauen"], 1.6], wissensbaum: [["🌳", "Ansehen"], 2.2], sonnenuhr: [["☀️", "Ansehen"], 1.9], paket: [["🎁", "Öffnen"], 1.8], nachbar: [["💬", "Reden"], 2.3], wegweiser: [["🪧", "Lesen"], 2.0]
  };
  function baeckereiAntwort() {
    if (!ortOffen("baeckerei")) return blase("🥨", "Bäckerei Benno – noch zu", "Benno backt schon heimlich! Seine Bäckerei öffnet in Kapitel 3. Dafür brauchst du 10 Lernfunde und 3 geschaffte Stationen auf dem Matheweg.", "Пекарня Бенно откроется в главе 3.");
    const d = S().lade("baeckerei") || {};
    return blase("biber", "Bäckerei Benno", d.tage ? `Hallo ${name()}! Heute kommen wieder fünf Kunden. Hilfst du mir an der Theke?` : `Hallo ${name()}! Meine Bäckerei ist offen. Packst du die Bestellungen und rechnest mit dem Geld?`, "Помоги мне в пекарне!", "../baeckerei/");
  }
  // Rhythmus-Boot (05.11.2026): Paulas Boot an der Ballon-Wiese, öffnet mit Kapitel 4 „Paulas Fest“
  function rhythmusAntwort() {
    if (!(W.Story && S().offen(W.Story.kapitel() >= 4))) return blase("papagei", "Paulas Rhythmus-Boot – noch zu", "Ich male noch am Boot für mein Fest. Es fährt ab Kapitel 4. Bis dahin: Was entdeckst du heute bei Ella?", "Здесь Паула строит лодку для праздника. Она поплывёт в главе 4.");
    return blase("papagei", "Paulas Rhythmus-Boot", `Hallo ${name()}! Wir paddeln zum Fest – im Rhythmus! Ich spiele vor, du paddelst nach.`, "Мы плывём на праздник – в ритме! Я играю, ты повторяешь.", "../rhythmus/");
  }
  // Wörter-Angeln (04.11.2026, NA-61): Fipsis Angelsteg am Schatz-Strand, öffnet mit Kapitel 2
  function angelnAntwort() {
    if (!(W.Story && S().offen(W.Story.kapitel() >= 2))) return blase("fipsi", "Fipsis Angelsteg – noch zu", "Ich baue hier noch meinen Angelsteg. Er öffnet in Kapitel 2. Bis dahin: Welches Wort entdeckst du heute bei mir?", "Здесь Фипси строит причал для рыбалки. Он откроется в главе 2.");
    return blase("fipsi", "Fipsis Angelsteg", `Hallo ${name()}! Im Teich schwimmen Fische mit Bildern. Hilfst du mir, sie in den richtigen Eimer zu legen – der, die oder das?`, "В пруду плавают рыбы с картинками. Поможешь разложить их по вёдрам: der, die или das?", "../angeln/");
  }
  function tierstationAntwort() {
    if (!ortOffen("tierstation")) return blase("🩹", "Tierpflege-Station – noch zu", "Bruni richtet hier eine Station für kranke Wildtiere ein. Sie öffnet in Kapitel 2 – Fipsis Schatzkarte zeigt den Weg dorthin.", "Станция для диких животных откроется в главе 2.");
    const d = S().lade("tierstation") || {}, g = d.gast;
    const de = !g ? `Hallo ${name()}! Heute braucht wieder ein Tier Hilfe. Kommst du in die Station?`
      : g.ruht && g.ruht < isoJetzt() ? "Das Tier in der Station ist wieder fit! Wir können es auswildern." : g.ruht ? "Pssst – das Tier in der Station schläft und erholt sich." : "Ein Tier in der Station wartet auf deine Hilfe.";
    return blase("baer", "Brunis Tierpflege-Station", de, "Станция Бруни для животных.", "../tierstation/");
  }
  AKTION.garten = [["🌱", "Garten"], 2.6]; AKTION.baeckerei = [["🥨", "Bäckerei"], 2.6]; AKTION.tierstation = [["🩹", "Station"], 2.6];
  AKTION.leuchtturm = [["💡", "Leuchtturm"], 2.4]; AKTION.schatz = [["📖", "Öffnen"], 2.0]; AKTION.sandbank = [["🏝️", "Ansehen"], 2.6];
  const aktionFuer = (id, insel = true) => (id === "bruecke" ? [ortOffen("bruecke") ? ["🌉", "Bauen"] : ["👀", "Ansehen"], 2.6] : id === "boot" ? [ortOffen("boot", insel) ? ["⛵", "Boot"] : ["👀", "Ansehen"], 3.2] : id === "lager" ? [ortOffen("lager", insel) ? ["🧭", "Forschen"] : ["👀", "Ansehen"], 2.6] :
    id === "leuchtturm" && !leuchtturmOffen() ? [["👀", "Ansehen"], 2.4] : id === "station" && drachenOffen() ? [["🪁", "Drachen"], 1.9] : id === "truhe" && bald(id) ? [["🎣", "Angeln"], 1.9] : id === "ballons" && bald(id) ? [["🛶", "Boot"], 1.9] : bald(id) ? [["🚧", "Ansehen"], ["lauf", "kart", "bau"].includes(id) ? 2.4 : 1.9] : ["lauf", "kart", "bau"].includes(id) ? [istFrei(id) ? [SPIELE[id].e, "Spielen"] : ["🔒", "Ansehen"], 2.4] : AKTION[id] || [["👀", "Ansehen"], 1.9]);

  W.InselKern = {
    // Stationen
    SPIELE, istFrei, baumStufe, antwort, ortOffen, NEU_FERTIG, nachbarAntwort, fundFuer, aktionFuer, FRUCHT, fruchtFarbe, spieleMelodie,
    // Welt
    BIOME, GROESSEN, HUEGEL, STANDARD, FARBEN, blumenwiesen, erzeuge, neuerSeed, wunsch, zeit, erstelle,
    // Regeln und Zustände
    spielZeit, profi, schlaeftText, fuehrerscheinText, sonnenuhr, sonnenuhrText, nebelStufe,
    weihnachtsPaket, geburtstagsPaket, paketDa, oeffnePaket, naechsteStory, storyFertig, prologFaellig, FACH, freude, ETAPPEN, merkkisteBei,
    KAPITEL, WETTER_THEMEN, wortSchilder, tildaGenutzt, leuchtturmOffen, deutschFertig, matheFertig, BRUECKE_ABSCHNITTE, BRUECKE_FINALE, brueckeStand, brueckeFertig,
    SCHATZKARTE, schatzkarteKomplett, JAHRESZEITEN, jahreszeitJetzt, NEBEN, nebenszene, FESTE, festJetzt,
    // Zimmer
    PLAETZE, MOEBEL, WANDFARBEN, zimmerDaten, besitzt, pinnwandZettel, wandPreis, standardWand, geschlecht,
    // Wetter
    WETTER_KEY, WETTER_ART, WETTER_TEXT, wetterCache, wetterSatz, wetterSticker, holeWetter, startWetter
  };
})(typeof window !== "undefined" ? window : globalThis);
