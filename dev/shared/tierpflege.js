// Haustier-Pflege: Ei, Wärme, Schlüpfen, Satt/Freude/Freundschaft, Leckerli, Zubehör.
// Daten in profil.daten.tier. Nie Strafe: Werte sinken langsam, das Tier wird nur hungrig oder müde.
(function () {
  const S = window.Spielwelt, T = window.Tiere;
  if (!S || !T) return;
  const WAERME_ZIEL = 3, STUFE_AB = [0, 25, 70];
  const heute = () => (window.Charakter ? Charakter.heute() : new Date().toISOString().slice(0, 10));

  function lade() {
    const d = Object.assign({ phase: null, ei: null, waerme: 0, eiGewaermt: null, art: null, farbe: 0, name: "",
      freundschaft: 0, satt: 70, freude: 70, zeit: Date.now(), besitz: {}, traegt: {}, leckerli: 3, heute: null }, S.lade("tier") || {});
    if (!d.heute || d.heute.datum !== heute()) d.heute = { datum: heute(), fs: 0, spiel: 0, streichel: 0 };
    // Werte sinken mit der Zeit (pro Tag etwa ein Drittel), nie unter 0
    const tage = Math.max(0, (Date.now() - (d.zeit || Date.now())) / 86400000);
    if (d.phase === "tier" && tage > 0.01) {
      d.satt = Math.max(0, d.satt - 35 * tage); d.freude = Math.max(0, d.freude - 30 * tage);
    }
    d.zeit = Date.now();
    return d;
  }
  const speichere = (d) => S.speichere("tier", d);
  const stufe = (d) => d.freundschaft >= STUFE_AB[2] ? 2 : d.freundschaft >= STUFE_AB[1] ? 1 : 0;

  const Pflege = {
    WAERME_ZIEL, STUFE_AB,
    lade, speichere, stufe,
    waehleEi(typ) { const d = lade(); d.phase = "ei"; d.ei = typ; d.waerme = 0; speichere(d); },
    waermen() { // einmal am Tag durch Antippen
      const d = lade(); if (d.phase !== "ei" || d.eiGewaermt === heute()) return false;
      d.eiGewaermt = heute(); d.waerme = Math.min(WAERME_ZIEL, d.waerme + 1); speichere(d); return true;
    },
    schluepfen() {
      const d = lade(); if (d.phase !== "ei" || d.waerme < WAERME_ZIEL) return null;
      d.phase = "tier"; d.art = T.EIER[d.ei].art; d.farbe = Math.floor(Math.random() * 3);
      d.satt = 80; d.freude = 90; d.geschluepft = heute(); speichere(d); return d;
    },
    nenne(name) { const d = lade(); d.name = String(name).trim().slice(0, 16); speichere(d); },
    fuettern() {
      const d = lade(); if (d.phase !== "tier" || d.leckerli < 1) return null;
      const vorher = stufe(d);
      d.leckerli--; d.satt = Math.min(100, d.satt + 35); d.freude = Math.min(100, d.freude + 5);
      if (d.heute.fs < 15) { d.freundschaft += 3; d.heute.fs += 3; }
      speichere(d); return { gewachsen: stufe(d) > vorher, d };
    },
    spielen() {
      const d = lade(); if (d.phase !== "tier") return null;
      const vorher = stufe(d);
      d.freude = Math.min(100, d.freude + 30); d.satt = Math.max(0, d.satt - 4);
      if (d.heute.spiel < 3) { d.freundschaft += 2; d.heute.spiel++; }
      speichere(d); return { gewachsen: stufe(d) > vorher, d };
    },
    streicheln() {
      const d = lade(); if (d.phase !== "tier") return null;
      const vorher = stufe(d);
      d.freude = Math.min(100, d.freude + 4);
      if (d.heute.streichel < 1) { d.freundschaft += 1; d.heute.streichel++; }
      speichere(d); return { gewachsen: stufe(d) > vorher, d };
    },
    kaufe(id) {
      const z = T.ZUBEHOER.find(x => x.id === id), d = lade();
      if (!z || d.besitz[id]) return !!d.besitz[id];
      if (S.sterne() < z.preis) return false;
      S.gibSterne(-z.preis); d.besitz[id] = true; d.traegt[id] = true; speichere(d); return true;
    },
    // Geschenk (z. B. Weihnachtspaket): Zubehör gehört dem Kind und wird gleich getragen
    schenke(id) { const d = lade(); if (!T.ZUBEHOER.some(x => x.id === id) || d.besitz[id]) return false; d.besitz[id] = true; d.traegt[id] = true; speichere(d); return true; },
    trage(id, an) { const d = lade(); if (d.besitz[id]) { d.traegt[id] = !!an; speichere(d); } },
    // Wird von Tagesaufgaben und Spielen aufgerufen
    gib(leckerli, waerme) {
      const d = lade(); if (!d.phase) return null;
      if (leckerli) d.leckerli = Math.min(99, d.leckerli + leckerli);
      if (waerme && d.phase === "ei") d.waerme = Math.min(WAERME_ZIEL, d.waerme + waerme);
      speichere(d); return d;
    },
    ausdruck(d) {
      if (d.satt < 25 || d.freude < 20) return "traurig";
      const h = new Date().getHours();
      if (h >= 21 || h < 6) return "schlaeft";
      return "froh";
    },
    stimmung(d) {
      const n = d.name || "Dein Tier";
      if (d.satt < 25) return `${n} hat Hunger! Mach eine Tagesaufgabe, dann gibt es Leckerli.`;
      if (d.freude < 20) return `${n} ist ein bisschen traurig. Spielst du mit ihm?`;
      const h = new Date().getHours();
      if (h >= 21 || h < 6) return `Pssst … ${n} schläft. Gute Nacht!`;
      if (d.satt > 85 && d.freude > 85) return `${n} ist rundum glücklich!`;
      return ["Schön, dass du da bist!", "Spielen wir?", "Ich habe dich vermisst!", "Hast du heute schon gerechnet?", "Kraul mich mal!"][new Date().getDate() % 5];
    }
  };
  window.TierPflege = Pflege;
})();
