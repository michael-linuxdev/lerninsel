// Ellas Forscherlager (09.11.2026, Kapitel 7 „Neue Ufer“): Inselkarte lesen und Forscher-Tagebuch – auf der Heimatinsel (ab Kapitel 1,
// „Karte der Heimatinsel“) und auf jedem Nachbar-Eiland (ab Kapitel 7). Die Karte entsteht aus der echten Welt dieser Seite (Insel-Kern,
// dieselben Orte, Bäume und der Teich wie in 3D): Norden ist oben, Raster A–F / 1–6, Kompassrose, Legende.
// Karte lesen: 5 Fragen je Runde aus der eigenen Karte – Stufe a (Vorschule, Kl. 1): oben/unten, links/rechts, „ganz oben“ (Lage, ma.rf.02);
// b (Kl. 2): Himmelsrichtungen, Felder A–F/1–6, „was steht im Feld“ (su.ge.03); c (ab Kl. 3): dazu Zwischenrichtungen und Maßstab
// „1 Kästchen = 10 Meter“ (ma.rf.09). Keine Zufallsfragen: alle Fragen folgen aus den Koordinaten, Reihenfolge fest (erst ungelöste).
// Tagebuch: je Eiland einmal Biom, Wetter und drei Funde eintragen (nichts falsch oder richtig). Sterne nur für Neues: neue Frage beim ersten
// Versuch richtig (höchstens 3 am Tag), erster Tagebuch-Eintrag je Eiland – nie Zufall, nichts geht verloren.
// Daten expedition = { karten: { "<eiland>:<frage>": n }, neu: { "JJJJ-MM-TT": n }, eilande: { "<eiland>": { biom, name, am, wetter, funde } } }.
// Eiland-Schlüssel: "heimat" oder "<biom>-<seed>". Test-Haken: window.__expedition.
(function () {
  const S = window.Spielwelt, SP = window.Sprache, K = window.InselKern;
  const $ = (id) => document.getElementById(id);
  const esc = S.esc;
  const ru = (t) => (S.hilfe() && t ? `<span class="ru">${esc(t)}</span>` : "");
  const D = "#3B1F63", RUNDE = 5, STERNE_TAG = 3, ZELLEN = 6, METER_JE_KAESTCHEN = 50;
  const STUFEN = ["a", "b", "c"];
  const stufeFuer = (code) => (["vs", "1"].includes(code) ? "a" : code === "2" ? "b" : "c");
  const stufe = () => window.__expeditionStufe || stufeFuer(((S.stufe && S.stufe()) || {}).code || "2");
  const daten = () => Object.assign({ karten: {}, neu: {}, eilande: {} }, S.lade("expedition") || {});
  const speichere = (d) => S.speichere("expedition", d);
  const ARTEN = { sonne: ["☀️", "sonnig", "солнечно"], wolken: ["☁️", "bewölkt", "облачно"], regen: ["🌧️", "Regen", "дождь"], schnee: ["❄️", "Schnee", "снег"], nebel: ["🌫️", "Nebel", "туман"], gewitter: ["⛈️", "Gewitter", "гроза"] };
  let ellaText = "", lauf = null, reiter = "karte";
  function ella(de, r) { ellaText = de; $("ella-text").innerHTML = esc(de) + ru(r); }

  // ---------- Die Welt dieser Seite (wie in 3D: ?biom=… im Test, sonst die aktive Welt des Kindes) ----------
  const I = K.erstelle(new URLSearchParams(location.search)), WELT = I.WELT, P = I.P, R = WELT.R;
  const insel = !!WELT.insel;
  const wunsch = insel ? null : (K.wunsch(new URLSearchParams(location.search)) || {});
  const eilandKey = insel ? "heimat" : `${WELT.biom}-${(wunsch && wunsch.seed) || 1}`;
  const eilandName = insel ? "Meine Heimatinsel" : (wunsch && wunsch.name) || (K.BIOME[WELT.biom] || {}).name || "Mein Eiland";
  const eilandE = insel ? "🏝️" : (K.BIOME[WELT.biom] || {}).e || "🌍";
  const offen = () => K.ortOffen("lager", insel);
  // Orte der Karte: Zeichen (Begleiter als Figuren-Zeichen, nie Emoji), Name mit Artikel, russischer Name; nur Orte, die die Welt hat
  const ORTE = [
    ["haus", "🏠", "das Haus", "дом"], ["eule", "", "Ella", "Элла"], ["fipsi", "", "Fipsi", "Фипси"], ["biber", "", "Benno", "Бенно"],
    ["baer", "", "Bruni", "Бруни"], ["schach", "", "Tildas Schachtisch", "шахматный стол Тильды"], ["buehne", "", "Paulas Bühne", "сцена Паулы"],
    ["wissensbaum", "🌳", "der Wissensbaum", "дерево знаний"], ["lauf", "🥕", "der Garten", "сад"], ["kart", "🥨", "die Bäckerei", "пекарня"], ["bau", "🩹", "die Tierstation", "станция для животных"],
    ["ballons", "🛶", "Paulas Boot", "лодка Паулы"], ["truhe", "🎣", "der Angelsteg", "рыбацкий мостик"], ["station", "🪁", "die Wetterstation", "метеостанция"],
    ["leuchtturm", "🔆", "der Leuchtturm", "маяк"], ["lager", "⛺", "das Forscherlager", "лагерь исследователей"], ["steg", "⛵", "der Steg mit Robos Boot", "причал с лодкой Робо"]
  ].filter(([id]) => id === "steg" || P[id]).map(([id, e, name, r]) => ({ id, e, name, r, x: id === "steg" ? I.STEG.x : P[id][0], z: id === "steg" ? (I.STEG.z0 + I.STEG.z1) / 2 : P[id][1] }));
  const ort = (id) => ORTE.find(o => o.id === id);
  const von = (o) => o.name.replace(/^das /, "vom ").replace(/^der /, "vom ").replace(/^die /, "von der ").replace(/^(?![vV]o)/, "von ");
  const zu = (o) => o.name.replace(/^das /, "zum ").replace(/^der /, "zum ").replace(/^die /, "zur ").replace(/^(?![zZ]u)/, "zu ");
  // Karte: 6 × 6 Felder über [−R−1, R+1]; Spalte A–F von links (Westen), Zeile 1–6 von oben (Norden = −z)
  const spanne = 2 * R + 2, zelle = spanne / ZELLEN;
  const spalte = (x) => Math.min(ZELLEN - 1, Math.max(0, Math.floor((x + R + 1) / zelle)));
  const zeile = (z) => Math.min(ZELLEN - 1, Math.max(0, Math.floor((z + R + 1) / zelle)));
  const feld = (o) => "ABCDEF"[spalte(o.x)] + (zeile(o.z) + 1);
  const meter = (a, b) => Math.hypot(a.x - b.x, a.z - b.z) / zelle * METER_JE_KAESTCHEN;
  const rund10 = (m) => Math.max(10, Math.round(m / 10) * 10);
  // Himmelsrichtung von a nach b: Haupt- (4) oder mit Zwischenrichtungen (8); null, wenn nicht eindeutig
  const RICHTUNG = { N: ["Norden", "север"], O: ["Osten", "восток"], S: ["Süden", "юг"], W: ["Westen", "запад"], NO: ["Nordosten", "северо-восток"], SO: ["Südosten", "юго-восток"], SW: ["Südwesten", "юго-запад"], NW: ["Nordwesten", "северо-запад"] };
  function richtung(a, b, acht) {
    const dx = b.x - a.x, dz = b.z - a.z, ax = Math.abs(dx), az = Math.abs(dz);
    if (Math.hypot(dx, dz) < 3) return null;
    const ns = dz < 0 ? "N" : "S", ow = dx > 0 ? "O" : "W";
    if (acht && ax > 0.6 * az && az > 0.6 * ax) return ns + ow;
    if (ax > 2 * az) return ow;
    if (az > 2 * ax) return ns;
    return null;
  }

  // ---------- Kartenbild (SVG) + Orte als Zeichen ----------
  function kartenBild(markiert) {
    const G = 600, M = 60, B = G - 2 * M, px = (x) => M + (x + R + 1) / spanne * B, pz = (z) => M + (z + R + 1) / spanne * B, sk = B / spanne;
    const biom = K.BIOME[WELT.biom] || {}, gras = insel ? "#7CCB5B" : biom.gras || "#7CCB5B", sand = insel ? "#F2D9A2" : biom.sand || "#F2D9A2";
    const rGras = insel ? R - 3 : WELT.rand;
    let s = `<svg viewBox="0 0 ${G} ${G}" role="img" aria-label="Karte: ${esc(eilandName)}">
      <rect width="${G}" height="${G}" fill="#A9DDF5"/>
      <circle cx="${px(0)}" cy="${pz(0)}" r="${R * sk}" fill="${sand}" stroke="${D}" stroke-width="3"/>
      <circle cx="${px(0)}" cy="${pz(0)}" r="${rGras * sk}" fill="${gras}"/>`;
    if (WELT.see) s += `<circle cx="${px(WELT.see.x)}" cy="${pz(WELT.see.z)}" r="${(WELT.see.r + 0.3) * sk}" fill="#5EC3E6" stroke="${D}" stroke-width="2"/>`;
    WELT.baeume.forEach(b => { const r = Math.max(4, 0.9 * b.k * sk); s += b.typ === "nadel" ? `<path d="M${px(b.x)} ${pz(b.z) - r * 1.3} l${r} ${r * 2.2} h${-2 * r} z" fill="#3F9A5C" stroke="${D}" stroke-width="1.5"/>`
      : b.typ === "kaktus" ? `<rect x="${px(b.x) - r * 0.5}" y="${pz(b.z) - r}" width="${r}" height="${r * 2}" rx="${r * 0.5}" fill="#5FA05A" stroke="${D}" stroke-width="1.5"/>`
      : `<circle cx="${px(b.x)}" cy="${pz(b.z)}" r="${r}" fill="${b.typ === "palme" ? "#4FAF62" : "#5DBB5A"}" stroke="${D}" stroke-width="1.5"/>`; });
    (WELT.steine || []).forEach(([x, z, r]) => { s += `<ellipse cx="${px(x)}" cy="${pz(z)}" rx="${Math.max(3, r * sk)}" ry="${Math.max(2.5, r * sk * 0.75)}" fill="#A7A9B8" stroke="${D}" stroke-width="1.5"/>`; });
    [...(WELT.pfad || []), ...((I.WEGE || []).flat())].forEach(([x, z]) => { s += `<circle cx="${px(x)}" cy="${pz(z)}" r="${Math.max(2.5, 0.5 * sk)}" fill="#D9CDB8"/>`; });
    s += `<rect x="${px(I.STEG.x) - 0.7 * sk}" y="${pz(I.STEG.z0)}" width="${1.4 * sk}" height="${(I.STEG.z1 - I.STEG.z0) * sk}" fill="#C8955B" stroke="${D}" stroke-width="2"/>`;
    // Raster und Beschriftung
    for (let i = 0; i <= ZELLEN; i++) { const t = M + i / ZELLEN * B; s += `<line x1="${t}" y1="${M}" x2="${t}" y2="${G - M}" stroke="${D}" stroke-width="1.5" opacity=".55"/><line x1="${M}" y1="${t}" x2="${G - M}" y2="${t}" stroke="${D}" stroke-width="1.5" opacity=".55"/>`; }
    for (let i = 0; i < ZELLEN; i++) { const t = M + (i + 0.5) / ZELLEN * B; s += `<text x="${t}" y="${M - 14}" text-anchor="middle" font-size="26" font-weight="700" fill="${D}" font-family="Fredoka, sans-serif">${"ABCDEF"[i]}</text><text x="${M - 18}" y="${t + 9}" text-anchor="middle" font-size="26" font-weight="700" fill="${D}" font-family="Fredoka, sans-serif">${i + 1}</text>`; }
    if (markiert && markiert.feld) { const c = "ABCDEF".indexOf(markiert.feld[0]), r = +markiert.feld[1] - 1; s += `<rect x="${M + c / ZELLEN * B}" y="${M + r / ZELLEN * B}" width="${B / ZELLEN}" height="${B / ZELLEN}" fill="none" stroke="#FF6F61" stroke-width="6"/>`; }
    // Kompassrose rechts unten im Wasser (Feld F6 ist dort frei)
    const cx = G - M - 44, cy = G - M - 44;
    s += `<g font-family="Fredoka, sans-serif" font-weight="700" fill="${D}"><circle cx="${cx}" cy="${cy}" r="30" fill="#fff" stroke="${D}" stroke-width="2.5"/>
      <path d="M${cx} ${cy - 24} L${cx + 7} ${cy} L${cx} ${cy + 24} L${cx - 7} ${cy} Z" fill="#FF6F61" stroke="${D}" stroke-width="1.5"/><path d="M${cx} ${cy} L${cx + 7} ${cy} L${cx} ${cy + 24} L${cx - 7} ${cy} Z" fill="#fff" stroke="${D}" stroke-width="1.5"/>
      <text x="${cx}" y="${cy - 32}" text-anchor="middle" font-size="18">N</text><text x="${cx}" y="${cy + 46}" text-anchor="middle" font-size="18">S</text><text x="${cx - 38}" y="${cy + 6}" text-anchor="middle" font-size="18">W</text><text x="${cx + 38}" y="${cy + 6}" text-anchor="middle" font-size="18">O</text></g>`;
    s += `</svg>`;
    const orte = ORTE.map(o => `<span class="ort${["eule", "fipsi", "biber", "baer", "schach", "buehne", "wissensbaum", "lager"].includes(o.id) ? "" : " klein"}${markiert && markiert.ort === o.id ? " gesucht" : ""}" style="left:${(px(o.x) / G * 100).toFixed(1)}%;top:${(pz(o.z) / G * 100).toFixed(1)}%" aria-label="${esc(o.name)}">${o.e}</span>`).join("");
    return `<div class="karte-rahmen" id="kartenbild">${s}${orte}</div>`;
  }
  const legende = () => `<div class="legende" aria-label="Legende">${ORTE.map(o => `<span>${o.e} ${esc(o.name.replace(/^(der|die|das) /, ""))}</span>`).join("")}</div>`;

  // ---------- Fragen aus der Karte (fest, aus den Koordinaten) ----------
  // f = { id, ab, frage, ru, optionen: [richtig, …], warum, warumRu, lz, markiert? }
  function fragen() {
    const F = [], grosse = ORTE.filter(o => !["steg", "station", "truhe", "ballons"].includes(o.id) || o.id === "steg");
    const neu = (f) => F.push(f);
    const haus = ort("haus"), steg = ort("steg");
    // Stufe a: oben/unten und links/rechts (deutlich entfernt von der Mitte), „ganz oben / ganz unten“
    grosse.filter(o => Math.abs(o.z) > R * 0.3).slice(0, 6).forEach(o => neu({ id: "ou-" + o.id, ab: "a", lz: ["ma.rf.02"], markiert: { ort: o.id },
      frage: `Schau auf die Karte: Ist ${o.name} oben oder unten?`, ru: `Посмотри на карту: ${o.r} вверху или внизу?`,
      optionen: o.z < 0 ? ["oben", "unten"] : ["unten", "oben"], warum: `${o.name} ist ${o.z < 0 ? "oben" : "unten"} auf der Karte – das ist ${o.z < 0 ? "Norden" : "Süden"}.`, warumRu: `${o.r} ${o.z < 0 ? "вверху" : "внизу"} на карте – это ${o.z < 0 ? "север" : "юг"}.` }));
    grosse.filter(o => Math.abs(o.x) > R * 0.3).slice(0, 6).forEach(o => neu({ id: "lr-" + o.id, ab: "a", lz: ["ma.rf.02"], markiert: { ort: o.id },
      frage: `Ist ${o.name} links oder rechts auf der Karte?`, ru: `${o.r} слева или справа на карте?`,
      optionen: o.x < 0 ? ["links", "rechts"] : ["rechts", "links"], warum: `${o.name} ist ${o.x < 0 ? "links" : "rechts"} – das ist ${o.x < 0 ? "Westen" : "Osten"}.`, warumRu: `${o.r} ${o.x < 0 ? "слева" : "справа"} – это ${o.x < 0 ? "запад" : "восток"}.` }));
    const ganz = (wert, name, rName, wo, woRu) => { const sortiert = grosse.slice().sort((a, b) => wert(b) - wert(a)); const o = sortiert[0], andere = sortiert.slice(1).filter(x => wert(o) - wert(x) > 3).slice(-2);
      if (andere.length === 2) neu({ id: "ganz-" + name, ab: "a", lz: ["ma.rf.02", "su.ge.03"], frage: `Welcher Ort liegt ganz ${wo}?`, ru: `Какое место находится ${woRu}?`,
        optionen: [o, ...andere].map(x => x.e + " " + x.name), warum: `${o.name} liegt ganz ${wo} – im ${name}.`, warumRu: `${o.r} находится ${woRu} – на ${rName}.` }); };
    ganz((o) => -o.z, "Norden", "севере", "oben", "вверху"); ganz((o) => o.z, "Süden", "юге", "unten", "внизу"); ganz((o) => -o.x, "Westen", "западе", "links", "слева"); ganz((o) => o.x, "Osten", "востоке", "rechts", "справа");
    // Stufe b: Kompass, Felder, Himmelsrichtung von A nach B
    neu({ id: "kompass-o", ab: "b", lz: ["su.ge.03"], frage: "Norden ist oben auf der Karte. Wo ist Osten?", ru: "Север – вверху карты. Где восток?", optionen: ["rechts", "links", "unten"], warum: "Im Uhrzeigersinn: Norden, Osten, Süden, Westen – Osten ist rechts.", warumRu: "По часовой стрелке: север, восток, юг, запад – восток справа." });
    neu({ id: "kompass-w", ab: "b", lz: ["su.ge.03"], frage: "Wo ist Westen auf der Karte?", ru: "Где запад на карте?", optionen: ["links", "rechts", "oben"], warum: "Westen ist links – dort geht die Sonne unter.", warumRu: "Запад слева – там заходит солнце." });
    const felder = () => { const alle = []; for (let r = 0; r < ZELLEN; r++) for (let c = 0; c < ZELLEN; c++) alle.push("ABCDEF"[c] + (r + 1)); return alle; };
    grosse.slice(0, 8).forEach(o => { const f = feld(o), c = "ABCDEF".indexOf(f[0]), r = +f[1] - 1;
      const falsch = [["ABCDEF"[(c + 2) % ZELLEN] + (r + 1)], ["ABCDEF"[c] + ((r + 3) % ZELLEN + 1)]].map(x => x[0]).filter(x => x !== f);
      neu({ id: "feld-" + o.id, ab: "b", lz: ["su.ge.03"], markiert: { ort: o.id }, frage: `In welchem Feld steht ${o.name}? Erst der Buchstabe, dann die Zahl.`, ru: `В каком квадрате ${o.r}? Сначала буква, потом цифра.`,
        optionen: [f, ...falsch], warum: `${o.name} steht in Spalte ${f[0]} und Zeile ${f[1]}: Feld ${f}.`, warumRu: `${o.r} в столбце ${f[0]} и строке ${f[1]}: квадрат ${f}.` }); });
    // „Was steht im Feld …?“ – nur Felder mit genau einem großen Ort
    const je = {}; grosse.forEach(o => { (je[feld(o)] = je[feld(o)] || []).push(o); });
    Object.entries(je).filter(([, l]) => l.length === 1).slice(0, 5).forEach(([f, [o]]) => { const andere = grosse.filter(x => feld(x) !== f).slice(0, 2);
      if (andere.length === 2) neu({ id: "imfeld-" + f, ab: "b", lz: ["su.ge.03"], markiert: { feld: f }, frage: `Was steht im Feld ${f}?`, ru: `Что находится в квадрате ${f}?`,
        optionen: [o, ...andere].map(x => x.e + " " + x.name), warum: `Spalte ${f[0]}, Zeile ${f[1]}: dort steht ${o.name}.`, warumRu: `Столбец ${f[0]}, строка ${f[1]}: там ${o.r}.` }); });
    const paare = [[haus, steg], [haus, ort("eule")], [haus, ort("lager")], [steg, ort("leuchtturm")], [ort("lager"), haus], [ort("fipsi"), ort("biber")]].filter(([a, b]) => a && b);
    paare.forEach(([a, b]) => { const r4 = richtung(a, b, false), r8 = richtung(a, b, true);
      if (r4) neu({ id: `richtung-${a.id}-${b.id}`, ab: "b", lz: ["su.ge.03"], frage: `Du gehst ${von(a)} ${zu(b)}. In welche Himmelsrichtung?`, ru: `Ты идёшь от ${a.r} к ${b.r}. В какую сторону света?`,
        optionen: [RICHTUNG[r4][0], ...["N", "O", "S", "W"].filter(x => x !== r4).slice(0, 2).map(x => RICHTUNG[x][0])], warum: `${b.name} liegt im ${RICHTUNG[r4][0]} von ${a.name}.`, warumRu: `${b.r} находится на ${RICHTUNG[r4][1]} от ${a.r}.` });
      else if (r8 && r8.length === 2) neu({ id: `richtung8-${a.id}-${b.id}`, ab: "c", lz: ["su.ge.03"], frage: `Du gehst ${von(a)} ${zu(b)}. Welche Himmelsrichtung ist das?`, ru: `Ты идёшь от ${a.r} к ${b.r}: какая это сторона света?`,
        optionen: [RICHTUNG[r8][0], RICHTUNG[r8[0]][0], RICHTUNG[r8[1]][0]], warum: `Es geht nach ${RICHTUNG[r8[0]][0]} und nach ${RICHTUNG[r8[1]][0]} zugleich: ${RICHTUNG[r8][0]}.`, warumRu: `Одновременно на ${RICHTUNG[r8[0]][1]} и на ${RICHTUNG[r8[1]][1]}: ${RICHTUNG[r8][1]}.` }); });
    // Stufe c: Maßstab
    const falscheMeter = (m) => { const a = m + Math.max(30, Math.round(m * 0.5 / 10) * 10), b = m - Math.max(20, Math.round(m * 0.3 / 10) * 10); return [`${a} m`, `${b >= 10 ? b : a + 50} m`]; };
    [[haus, steg], [haus, ort("lager")], [steg, ort("leuchtturm")], [ort("fipsi"), ort("eule")]].filter(([a, b]) => a && b).forEach(([a, b]) => { const m = rund10(meter(a, b));
      neu({ id: `meter-${a.id}-${b.id}`, ab: "c", lz: ["ma.rf.09"], frage: `Ein Kästchen auf der Karte sind ${METER_JE_KAESTCHEN} Meter. Wie weit ist es ungefähr ${von(a)} ${zu(b)}?`,
        ru: `Один квадрат на карте – ${METER_JE_KAESTCHEN} метров. Сколько примерно от ${a.r} до ${b.r}?`, optionen: [`${m} m`, ...falscheMeter(m)],
        warum: `Zähle die Kästchen zwischen den Orten: etwa ${(meter(a, b) / METER_JE_KAESTCHEN).toFixed(1).replace(".", ",")} Kästchen – also ungefähr ${m} Meter.`, warumRu: `Посчитай квадраты между местами: примерно ${(meter(a, b) / METER_JE_KAESTCHEN).toFixed(1).replace(".", ",")} квадрата – то есть около ${m} метров.` }); });
    neu({ id: "insel-breite", ab: "c", lz: ["ma.rf.09"], frage: `Ein Kästchen sind ${METER_JE_KAESTCHEN} Meter. Wie breit ist die Insel ungefähr?`, ru: `Один квадрат – ${METER_JE_KAESTCHEN} метров. Какой примерно ширины остров?`,
      optionen: [`${rund10(2 * R / zelle * METER_JE_KAESTCHEN)} m`, ...falscheMeter(rund10(2 * R / zelle * METER_JE_KAESTCHEN))], warum: `Die Insel ist fast so breit wie die ganze Karte: etwa ${(2 * R / zelle).toFixed(1).replace(".", ",")} Kästchen.`, warumRu: `Остров почти такой же ширины, как вся карта: около ${(2 * R / zelle).toFixed(1).replace(".", ",")} квадратов.` });
    return F;
  }
  const FRAGEN = fragen();
  const fuerStufe = (st) => FRAGEN.filter(f => STUFEN.indexOf(f.ab) <= STUFEN.indexOf(st));
  // Arten abwechselnd, damit nicht fünfmal „oben/unten“ hintereinander kommt
  function mischeArten(l) {
    const gruppen = {}; l.forEach(f => { const a = f.id.split("-")[0]; (gruppen[a] = gruppen[a] || []).push(f); });
    const g = Object.values(gruppen), aus = [];
    for (let i = 0; aus.length < l.length; i++) g.forEach(x => { if (x[i]) aus.push(x[i]); });
    return aus;
  }
  function waehle() {
    const d = daten(), l = fuerStufe(stufe()), schon = (f) => d.karten[eilandKey + ":" + f.id];
    return mischeArten(l.filter(f => !schon(f))).concat(mischeArten(l.filter(f => schon(f)))).slice(0, RUNDE);
  }

  // ---------- Karte lesen (Runde) ----------
  function starteRunde() {
    lauf = { phase: "fragen", liste: waehle(), pos: 0, versuche: 0, ersteRichtig: 0, sterne: 0 };
    ella(insel ? `Das ist die Karte unserer Heimatinsel, ${S.profil.name || "du"}. Norden ist oben. Findest du dich zurecht?` : `Das ist die Karte von diesem Eiland, ${S.profil.name || "du"}. Norden ist oben. Findest du dich zurecht?`,
      "Это карта острова. Север – вверху. Сориентируешься?");
    zeigeFrage();
  }
  const ordne = (opt, pos) => { const n = pos % opt.length; return opt.slice(n).concat(opt.slice(0, n)); };
  function zeigeFrage() {
    const f = lauf.liste[lauf.pos]; lauf.versuche = 0;
    $("bereich").innerHTML = `<section class="karte" id="fragekarte">
      <p class="stand">Frage ${lauf.pos + 1} von ${lauf.liste.length} · ${eilandE} ${esc(eilandName)}</p>
      ${kartenBild(f.markiert)}${legende()}
      <p class="frage" id="frage">${esc(f.frage)}${ru(f.ru)} <button class="vorlesen klein" id="frage-hoer" aria-label="Frage vorlesen">🔊</button></p>
      <div class="optionen" id="optionen">${ordne(f.optionen, lauf.pos).map(o => `<button class="wahl-knopf" data-o="${esc(o)}">${esc(o)}</button>`).join("")}</div>
      <p class="hinweis" id="hinweis" aria-live="polite"></p></section>`;
    $("frage-hoer").addEventListener("click", () => { if (SP) SP.sprich(f.frage + " " + f.optionen.map(o => o.replace(/[-]/g, "")).join(", ")); });
    $("optionen").addEventListener("click", (e) => { const b = e.target.closest("[data-o]"); if (b && !b.disabled) antworte(b); });
  }
  function antworte(b) {
    const f = lauf.liste[lauf.pos], ok = b.dataset.o === f.optionen[0], d = daten(), schluessel = eilandKey + ":" + f.id;
    if (ok) {
      S.ton("juhu"); b.classList.add("richtig");
      $("optionen").querySelectorAll("button").forEach(x => { x.disabled = true; });
      let stern = false;
      if (lauf.versuche === 0) {
        lauf.ersteRichtig++;
        if (window.Koennen) Koennen.melde(f.lz, true);
        if (window.Charakter) Charakter.gib("sachkunde", 1);
        const heute = S.heute();
        if (!d.karten[schluessel] && (d.neu[heute] || 0) < STERNE_TAG) { d.neu = { [heute]: (d.neu[heute] || 0) + 1 }; S.gibSterne(1); lauf.sterne++; stern = true;
          if (window.Lernfunde) Lernfunde.merke({ fach: "sachkunde", art: "karte", e: "🧭", text: `Karte gelesen: ${f.frage.replace(/\?$/, "")} – ${f.optionen[0].replace(/[-] /g, "")}`, schluessel: "expedition:" + schluessel }); }
        d.karten[schluessel] = (d.karten[schluessel] || 0) + 1;
      }
      speichere(d);
      $("sterne").textContent = S.sterne();
      $("hinweis").className = "hinweis gut"; $("hinweis").innerHTML = esc(`Richtig! ${f.warum}${stern ? " ⭐" : ""}`) + ru(f.warumRu);
      return setTimeout(weiter, window.__testSchnell ? 80 : 2200);
    }
    S.ton("nein"); lauf.versuche++; b.classList.add("falsch"); b.disabled = true;
    if (lauf.versuche === 1) { if (window.Koennen) Koennen.melde(f.lz, false);
      $("hinweis").className = "hinweis nein"; $("hinweis").innerHTML = esc("Fast! Schau noch einmal auf die Karte – Norden ist oben.") + ru("Почти! Посмотри ещё раз на карту – север вверху."); return; }
    $("optionen").querySelectorAll("button").forEach(x => { x.disabled = true; if (x.dataset.o === f.optionen[0]) x.classList.add("richtig"); });
    $("hinweis").className = "hinweis"; $("hinweis").innerHTML = esc(`Es ist: ${f.optionen[0]}. ${f.warum}`) + ru(f.warumRu);
    setTimeout(weiter, window.__testSchnell ? 80 : 3000);
  }
  function weiter() {
    if (!lauf || lauf.phase !== "fragen") return;
    lauf.pos++;
    if (lauf.pos < lauf.liste.length) return zeigeFrage();
    ende();
  }
  function ende() {
    lauf.phase = "ende";
    const d = daten(), alle = fuerStufe(stufe()).length, gelesen = fuerStufe(stufe()).filter(f => d.karten[eilandKey + ":" + f.id]).length;
    if (window.Ereignisse && Ereignisse.melde) Ereignisse.melde("expedition", { eiland: eilandKey, richtig: lauf.ersteRichtig });
    ella(lauf.ersteRichtig >= 4 ? `Du kannst die Karte lesen, ${S.profil.name || "du"}! Eine echte Forscherin, ein echter Forscher.` : "Gut gemacht! Mit jeder Runde kennst du die Karte besser.", lauf.ersteRichtig >= 4 ? "Ты умеешь читать карту! Настоящий исследователь." : "Молодец! С каждым разом ты знаешь карту лучше.");
    $("bereich").innerHTML = `<section class="karte" id="ende"><h2>🗺️ Karte gelesen!</h2>
      <p>${lauf.ersteRichtig} von ${lauf.liste.length} Fragen gleich richtig.${lauf.sterne ? ` Neue Fragen: +${lauf.sterne} ⭐` : ""} Auf dieser Karte kennst du ${gelesen} von ${alle} Fragen.</p>
      <div class="knoepfe"><button class="knopf haupt" id="nochmal">🗺️ Noch eine Runde</button><button class="knopf" id="zum-tagebuch">📔 Forscher-Tagebuch</button><a class="knopf" href="../welt3d/heimat.html">🏝️ Zur Insel</a></div></section>`;
    $("nochmal").addEventListener("click", () => { S.ton("tipp"); starteRunde(); });
    $("zum-tagebuch").addEventListener("click", () => { S.ton("tipp"); zeigeReiter("tagebuch"); });
  }

  // ---------- Forscher-Tagebuch ----------
  // Funde: was es auf diesem Eiland wirklich gibt (aus der Welt), drei auswählen
  function fundeFuer() {
    const B = K.BIOME[WELT.biom] || {}, n = WELT.baeume.length, typ = insel ? "laub" : B.baum, l = [];
    l.push({ id: "baeume", e: typ === "nadel" ? "🌲" : typ === "palme" ? "🌴" : typ === "kaktus" ? "🌵" : "🌳", t: `${n} ${typ === "nadel" ? "Nadelbäume" : typ === "palme" ? "Palmen" : typ === "kaktus" ? "Kakteen" : typ === "misch" ? "Bäume (Laub und Nadel)" : "Laubbäume"}`, r: `${n} деревьев` });
    l.push({ id: "steine", e: "🪨", t: `${(WELT.steine || []).length} Felsen`, r: `${(WELT.steine || []).length} камней` });
    if (WELT.see) l.push({ id: "teich", e: "💧", t: "ein Teich", r: "пруд" });
    if (!insel && (B.huegel || 0) * (K.HUEGEL[(wunsch || {}).huegel] || 1) >= 1) l.push({ id: "huegel", e: "⛰️", t: "Hügel", r: "холмы" });
    if (insel || (WELT.blumen || []).length) l.push({ id: "blumen", e: "🌸", t: "Blumenwiesen", r: "цветочные луга" });
    if (!insel && B.winter) l.push({ id: "schnee", e: "❄️", t: "Schnee das ganze Jahr", r: "снег круглый год" });
    if (!insel && WELT.biom === "wueste") l.push({ id: "sand", e: "🏜️", t: "Sand, so weit man sieht", r: "песок, насколько хватает глаз" });
    if (!insel && WELT.biom === "strand") l.push({ id: "strand", e: "🏖️", t: "ein breiter Strand", r: "широкий пляж" });
    l.push({ id: "leuchtturm", e: "🔆", t: "ein Leuchtturm", r: "маяк" });
    l.push({ id: "steg", e: "⛵", t: "ein Steg mit Boot", r: "причал с лодкой" });
    return l;
  }
  function tagebuch() {
    const d = daten(), e = d.eilande[eilandKey], f = fundeFuer();
    lauf = { phase: "tagebuch", wetter: e ? e.wetter : null, funde: e ? e.funde.slice() : [] };
    ella(e ? `Dieses Eiland steht schon in deinem Tagebuch. Du kannst den Eintrag ändern.` : `Trag ein, was du hier entdeckt hast, ${S.profil.name || "du"}: das Wetter und drei Funde.`, e ? "Этот остров уже в твоём дневнике. Запись можно изменить." : "Запиши, что ты здесь обнаружил: погоду и три находки.");
    const liste = Object.entries(d.eilande).sort((a, b) => (a[1].am < b[1].am ? 1 : -1));
    $("bereich").innerHTML = `<section class="karte" id="tagebuch">
      <h2>📔 Forscher-Tagebuch</h2>
      <p class="stand">${eilandE} ${esc(eilandName)} · ${insel ? "Wiese" : esc((K.BIOME[WELT.biom] || {}).name || "")}${wunsch && wunsch.groesse ? ` · ${({ klein: "klein", mittel: "mittel", gross: "riesig" })[wunsch.groesse] || ""}` : ""}</p>
      <p class="frage">Wie ist das Wetter heute?</p>
      <div class="arten" id="arten">${Object.entries(ARTEN).map(([k, [em, n]]) => `<button class="wahl-knopf${lauf.wetter === k ? " an" : ""}" data-art="${k}"><span class="gross">${em}</span>${n}</button>`).join("")}</div>
      <p class="frage">Was hast du entdeckt? Wähle drei Funde.</p>
      <div class="funde" id="funde">${f.map(x => `<button class="wahl-knopf${lauf.funde.includes(x.id) ? " an" : ""}" data-fund="${x.id}"><span class="gross">${x.e}</span>${esc(x.t)}${ru(x.r)}</button>`).join("")}</div>
      <p class="hinweis" id="t-hinweis" aria-live="polite"></p>
      <div class="knoepfe"><button class="knopf haupt" id="eintragen" ${lauf.wetter && lauf.funde.length === 3 ? "" : "disabled"}>✍️ Eintragen</button><button class="knopf" id="zur-karte">🗺️ Karte lesen</button></div>
      ${liste.length ? `<h2>🌍 Erforschte Eilande</h2><div class="eilande" id="eilande">${liste.map(([k, x]) => `<div class="eiland${k === eilandKey ? " hier" : ""}"><span class="e">${k === "heimat" ? "🏝️" : (K.BIOME[x.biom] || {}).e || "🌍"}</span><span><b>${esc(x.name)}</b><br>${ARTEN[x.wetter] ? ARTEN[x.wetter][0] + " " : ""}${esc(x.funde.map(id => (f.find(y => y.id === id) || { t: id }).t).join(", "))}</span></div>`).join("")}</div>` : ""}
      <p class="klein">Jedes Eiland bekommt einen Eintrag. Nichts geht verloren.</p>
    </section>`;
    $("arten").addEventListener("click", (ev) => { const b = ev.target.closest("[data-art]"); if (!b) return; S.ton("tipp"); lauf.wetter = b.dataset.art; $("arten").querySelectorAll("button").forEach(x => x.classList.toggle("an", x === b)); bereit(); });
    $("funde").addEventListener("click", (ev) => { const b = ev.target.closest("[data-fund]"); if (!b) return; const id = b.dataset.fund;
      if (lauf.funde.includes(id)) lauf.funde = lauf.funde.filter(x => x !== id); else if (lauf.funde.length < 3) lauf.funde.push(id); else { S.ton("nein"); $("t-hinweis").className = "hinweis nein"; $("t-hinweis").textContent = "Drei Funde reichen. Tipp einen an, um ihn abzuwählen."; return; }
      S.ton("tipp"); $("funde").querySelectorAll("button").forEach(x => x.classList.toggle("an", lauf.funde.includes(x.dataset.fund))); $("t-hinweis").textContent = ""; bereit(); });
    $("eintragen").addEventListener("click", eintragen);
    $("zur-karte").addEventListener("click", () => { S.ton("tipp"); zeigeReiter("karte"); });
  }
  function bereit() { $("eintragen").disabled = !(lauf.wetter && lauf.funde.length === 3); }
  function eintragen() {
    const d = daten(), erster = !d.eilande[eilandKey], f = fundeFuer();
    d.eilande[eilandKey] = { biom: insel ? "wiese" : WELT.biom, name: eilandName, am: S.heute(), wetter: lauf.wetter, funde: lauf.funde.slice(0, 3) };
    const keys = Object.keys(d.eilande); if (keys.length > 30) keys.sort((a, b) => (d.eilande[a].am < d.eilande[b].am ? -1 : 1)).slice(0, keys.length - 30).forEach(k => delete d.eilande[k]);   // Spielstand klein halten
    if (erster) { S.gibSterne(1); if (window.Charakter) Charakter.gib("sachkunde", 1);
      if (window.Lernfunde) Lernfunde.merke({ fach: "sachkunde", art: "karte", e: eilandE, text: `Eiland erforscht: ${eilandName} – ${lauf.funde.map(id => (f.find(y => y.id === id) || { t: id }).t).join(", ")}`, schluessel: "expedition:eiland:" + eilandKey }); }
    speichere(d); S.ton("juhu"); $("sterne").textContent = S.sterne();
    $("t-hinweis").className = "hinweis gut";
    $("t-hinweis").innerHTML = esc(`Eingetragen: ${ARTEN[lauf.wetter][1]}, ${lauf.funde.map(id => (f.find(y => y.id === id) || { t: id }).t).join(", ")}.${erster ? " Ein neues Eiland in deinem Tagebuch: ⭐" : ""}`) + ru(`Записано.${erster ? " Новый остров в дневнике: ⭐" : ""}`);
    setTimeout(() => { if (lauf && lauf.phase === "tagebuch") tagebuch(); }, window.__testSchnell ? 300 : 2200);
  }

  function zeigeReiter(r) {
    reiter = r;
    document.querySelectorAll(".reiter [data-reiter]").forEach(b => { b.classList.toggle("an", b.dataset.reiter === r); b.setAttribute("aria-selected", b.dataset.reiter === r ? "true" : "false"); });
    if (r === "tagebuch") tagebuch(); else starteRunde();
  }

  // ---------- Start ----------
  $("sterne").textContent = S.sterne();
  $("ella-vorlesen").addEventListener("click", () => { if (SP) SP.sprich(ellaText); });
  $("reiter").addEventListener("click", (e) => { const b = e.target.closest("[data-reiter]"); if (b) { S.ton("tipp"); zeigeReiter(b.dataset.reiter); } });
  if (!offen()) {
    $("zu").hidden = false; $("bereich").hidden = true; $("reiter").hidden = true;
    $("zu-text").textContent = insel ? "🔒 Das Forscherlager öffnet, wenn die erste Frucht am Wissensbaum wächst. Lern etwas Neues!" : "🔒 Dieses Eiland erforschen wir ab Kapitel 7 – wenn Robos Boot bereit ist. Lern weiter auf der Heimatinsel!";
    ella("Mein Fernrohr ist noch eingepackt. Bald geht es los!", "Моя подзорная труба ещё упакована. Скоро начнём!");
  } else if (location.hash === "#tagebuch") zeigeReiter("tagebuch"); else starteRunde();

  window.__expedition = { get lauf() { return lauf; }, get reiter() { return reiter; }, starteRunde, tagebuch, waehle, fuerStufe, stufe, stufeFuer, daten, FRAGEN, ORTE, feld, richtung, meter, fundeFuer, eilandKey, insel, RUNDE, STERNE_TAG, ZELLEN, zelle };
})();
