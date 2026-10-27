// Aufgaben für Klasse 2 (STATIONEN) und Klasse 1/Vorschule (STATIONEN_K1, NA-32). Jede Station hat einen Generator, der eine Aufgabe liefert:
// { text, frage?, antwort, art: "zahl"|"wahl", optionen?, einheit?, bild?, hilfe }
// "?" in text markiert die Lücke. Ohne "?" wird "= Lücke" angehängt.
(function () {
  const r = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const wahl = (liste) => liste[Math.floor(Math.random() * liste.length)];
  const mische = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const M = "−"; // Minuszeichen

  // ---------- Rechenwege ----------
  function wegPlus(a, b) {
    const bisZehn = 10 - (a % 10);
    if (b < 10 && (a % 10) + b > 10) return `${a} + ${bisZehn} = ${a + bisZehn}, dann + ${b - bisZehn} = ${a + b}`;
    if (a < 10 && b >= 10) return `Tausche die Zahlen: ${b} + ${a} = ${a + b}`;
    if (b >= 10) {
      const z = b - (b % 10), e = b % 10;
      if (!e) return `${a} + ${z} = ${a + z}`;
      return `Erst die Zehner: ${a} + ${z} = ${a + z}. Dann die Einer: ${a + z} + ${e} = ${a + b}`;
    }
    return `Zähle ${b} weiter: ${a} + ${b} = ${a + b}`;
  }
  function wegMinus(a, b) {
    const e = a % 10;
    if (b < 10 && b > e && a > 10) return `${a} ${M} ${e} = ${a - e}, dann ${M} ${b - e} = ${a - b}`;
    if (b >= 10) {
      const z = b - (b % 10), ee = b % 10;
      if (!ee) return `${a} ${M} ${z} = ${a - z}`;
      return `Erst die Zehner: ${a} ${M} ${z} = ${a - z}. Dann die Einer: ${a - z} ${M} ${ee} = ${a - b}`;
    }
    return `Zähle ${b} zurück: ${a} ${M} ${b} = ${a - b}`;
  }
  const reihe = (n, bis) => Array.from({ length: bis }, (_, i) => n * (i + 1)).join(", ");

  // ---------- Bilder ----------
  function zehnerBild(n) {
    const z = Math.floor(n / 10), e = n % 10;
    let s = "", x = 6;
    for (let i = 0; i < z; i++) {
      s += `<g transform="translate(${x} 6)">` + Array.from({ length: 10 }, (_, k) => `<rect x="0" y="${k * 13}" width="16" height="13" fill="#5CCBA6" stroke="#2E7D62" stroke-width="2"/>`).join("") + `</g>`;
      x += 24;
    }
    x += 10;
    for (let i = 0; i < e; i++) {
      const sp = i % 2, ze = Math.floor(i / 2);
      s += `<rect x="${x + sp * 20}" y="${6 + 130 - 13 - ze * 20 - 4}" width="16" height="16" fill="#FFC83D" stroke="#B88A10" stroke-width="2"/>`;
    }
    const breite = x + (e ? 44 : 0) + 6;
    return `<svg viewBox="0 0 ${breite} 142" class="bild-zehner" role="img" aria-label="${z} Zehner und ${e} Einer">${s}</svg>`;
  }

  // Euro-Geld in echten Farben und Größenverhältnissen (Münzen: Durchmesser in mm, Scheine: mm)
  const MUENZEN = {
    1: { mm: 16.25, art: "kupfer" }, 2: { mm: 18.75, art: "kupfer" }, 5: { mm: 21.25, art: "kupfer" },
    10: { mm: 19.75, art: "gold" }, 20: { mm: 22.25, art: "gold", kerben: true }, 50: { mm: 24.25, art: "gold" },
    100: { mm: 23.25, art: "bi1" }, 200: { mm: 25.75, art: "bi2" }
  };
  const SCHEINE = {
    5: { b: 120, h: 62, f1: "#B7BFAE", f2: "#8D9A86", text: "#4A5446" },
    10: { b: 127, h: 67, f1: "#F2A497", f2: "#D9695C", text: "#7A2A22" },
    20: { b: 133, h: 72, f1: "#A9C6EC", f2: "#5E8FCF", text: "#1F3F73" },
    50: { b: 140, h: 77, f1: "#F7C58A", f2: "#E8913E", text: "#7A4210" }
  };
  let geldId = 0;
  const FARBEN = { kupfer: ["#F0A673", "#C46A35", "#7A3E18"], gold: ["#F6DC85", "#D3A93A", "#7A5A12"], silber: ["#F1F3F6", "#AEB5BF", "#5E6570"] };
  function verlauf(id, [hell, dunkel]) {
    return `<radialGradient id="${id}" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="${hell}"/><stop offset="1" stop-color="${dunkel}"/></radialGradient>`;
  }
  function muenze(cx, cy, w) {
    const m = MUENZEN[w], r = m.mm * 1.9, id = "g" + (++geldId);
    const aussen = m.art === "bi1" ? "gold" : m.art === "bi2" ? "silber" : m.art;
    const innen = m.art === "bi1" ? "silber" : m.art === "bi2" ? "gold" : null;
    let s = `<defs>${verlauf(id + "a", FARBEN[aussen])}${innen ? verlauf(id + "i", FARBEN[innen]) : ""}</defs>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}a)" stroke="${FARBEN[aussen][2]}" stroke-width="2.5"/>`;
    if (m.kerben) for (let k = 0; k < 7; k++) { const a = k * Math.PI * 2 / 7; s += `<circle cx="${cx + Math.cos(a) * r}" cy="${cy + Math.sin(a) * r}" r="3.4" fill="#fff"/>`; }
    s += `<circle cx="${cx}" cy="${cy}" r="${r - 4}" fill="none" stroke="${FARBEN[aussen][2]}" stroke-opacity=".45" stroke-width="1.5"/>`;
    if (innen) s += `<circle cx="${cx}" cy="${cy}" r="${r * 0.66}" fill="url(#${id}i)" stroke="${FARBEN[innen][2]}" stroke-width="2"/>`;
    // Sterne am Rand rechts wie auf der europäischen Seite
    for (let k = 0; k < 6; k++) { const a = (-50 + k * 20) * Math.PI / 180, rr = r * (innen ? 0.82 : 0.8); s += `<circle cx="${cx + Math.cos(a) * rr}" cy="${cy + Math.sin(a) * rr}" r="${r * 0.045 + 0.6}" fill="${FARBEN[aussen][2]}" fill-opacity=".7"/>`; }
    const zahl = w >= 100 ? w / 100 : w, klein = w >= 100 ? "EURO" : "EURO CENT";
    const farbeText = innen ? FARBEN[innen][2] : FARBEN[aussen][2];
    s += `<text x="${cx - r * 0.12}" y="${cy + r * 0.22}" text-anchor="middle" font-size="${r * (zahl >= 10 ? 0.62 : 0.8)}" font-weight="700" fill="${farbeText}" font-family="Fredoka, Arial, sans-serif">${zahl}</text>`;
    s += `<text x="${cx - r * 0.1}" y="${cy + r * 0.5}" text-anchor="middle" font-size="${r * 0.17}" font-weight="700" letter-spacing=".5" fill="${farbeText}" font-family="Arial, sans-serif">${klein}</text>`;
    s += `<path d="M${cx - r * 0.62} ${cy - r * 0.45} q${r * 0.2} ${-r * 0.22} ${r * 0.48} ${-r * 0.26}" stroke="#fff" stroke-opacity=".6" stroke-width="${Math.max(2, r * 0.08)}" fill="none" stroke-linecap="round"/>`;
    return { svg: s, b: r * 2, h: r * 2 };
  }
  function schein(x, y, w) {
    const n = SCHEINE[w], B = n.b * 1.15, H = n.h * 1.15, id = "s" + (++geldId);
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${n.f1}"/><stop offset="1" stop-color="${n.f2}"/></linearGradient></defs>`;
    s += `<rect x="${x}" y="${y}" width="${B}" height="${H}" rx="5" fill="url(#${id})" stroke="${n.text}" stroke-width="2"/>`;
    // Fenster-/Torbogen-Motiv in der Mitte
    const mx = x + B * 0.5, my = y + H * 0.46;
    s += `<path d="M${mx - 18} ${my + 22} V${my - 4} A18 18 0 0 1 ${mx + 18} ${my - 4} V${my + 22} Z" fill="#fff" fill-opacity=".35" stroke="${n.text}" stroke-opacity=".55" stroke-width="2"/>`;
    s += `<path d="M${mx - 26} ${my + 22} H${mx + 26}" stroke="${n.text}" stroke-opacity=".55" stroke-width="2"/>`;
    // Silberstreifen rechts
    s += `<rect x="${x + B * 0.8}" y="${y}" width="${B * 0.08}" height="${H}" fill="#E8ECF2" fill-opacity=".85"/>`;
    // Sterne-Kranz klein links oben
    for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; s += `<circle cx="${x + B * 0.17 + Math.cos(a) * 9}" cy="${y + H * 0.3 + Math.sin(a) * 9}" r="1.6" fill="#FFE27A"/>`; }
    s += `<text x="${x + 8}" y="${y + H - 8}" font-size="${H * 0.36}" font-weight="700" fill="${n.text}" font-family="Fredoka, Arial, sans-serif">${w}</text>`;
    s += `<text x="${x + B * 0.77}" y="${y + H * 0.3}" text-anchor="end" font-size="${H * 0.3}" font-weight="700" fill="${n.text}" font-family="Fredoka, Arial, sans-serif">${w}</text>`;
    s += `<text x="${x + B * 0.5}" y="${y + H - 6}" text-anchor="middle" font-size="${H * 0.13}" font-weight="700" letter-spacing="1" fill="${n.text}" font-family="Arial, sans-serif">EURO</text>`;
    return { svg: s, b: B, h: H };
  }
  function geldBild(stuecke, art) {
    const BREITE = 600, ABSTAND = 12;
    const teile = stuecke.map(w => {
      if (art === "ct") return { w: w, typ: "m" };
      return w <= 2 ? { w: w * 100, typ: "m" } : { w, typ: "s" };
    });
    // Maße vorab für die Zeilen
    const mass = teile.map(t => t.typ === "m" ? { b: MUENZEN[t.w].mm * 3.8, h: MUENZEN[t.w].mm * 3.8 } : { b: SCHEINE[t.w].b * 1.15, h: SCHEINE[t.w].h * 1.15 });
    const zeilen = [[]]; let x = 0;
    mass.forEach((m, i) => { if (x + m.b > BREITE && zeilen[zeilen.length - 1].length) { zeilen.push([]); x = 0; } zeilen[zeilen.length - 1].push(i); x += m.b + ABSTAND; });
    let s = "", y = 6, breiteMax = 0;
    zeilen.forEach(z => {
      const hz = Math.max(...z.map(i => mass[i].h));
      let xx = 6;
      z.forEach(i => {
        const t = teile[i], m = mass[i];
        if (t.typ === "m") s += muenze(xx + m.b / 2, y + hz / 2, t.w).svg;
        else s += schein(xx, y + (hz - m.h) / 2, t.w).svg;
        xx += m.b + ABSTAND;
      });
      breiteMax = Math.max(breiteMax, xx - ABSTAND + 6);
      y += hz + ABSTAND;
    });
    const hoehe = y - ABSTAND + 6;
    return `<svg viewBox="0 0 ${breiteMax} ${hoehe}" class="bild-geld" style="max-width:${Math.round(breiteMax * 1.6)}px" role="img" aria-label="Geld">${s}</svg>`;
  }

  function uhrBild(h, m) {
    const wS = ((h % 12) + m / 60) * 30, wM = m * 6;
    let striche = "";
    for (let i = 0; i < 60; i++) {
      const w = i * 6 * Math.PI / 180, lang = i % 5 === 0;
      const r1 = lang ? 78 : 84, r2 = 90;
      striche += `<line x1="${100 + Math.sin(w) * r1}" y1="${100 - Math.cos(w) * r1}" x2="${100 + Math.sin(w) * r2}" y2="${100 - Math.cos(w) * r2}" stroke="#3b1f63" stroke-width="${lang ? 4 : 1.5}"/>`;
    }
    let zahlen = "";
    for (let i = 1; i <= 12; i++) {
      const w = i * 30 * Math.PI / 180;
      zahlen += `<text x="${100 + Math.sin(w) * 64}" y="${100 - Math.cos(w) * 64 + 7}" text-anchor="middle" font-size="19" font-weight="700" fill="#3b1f63" font-family="Fredoka, sans-serif">${i}</text>`;
    }
    return `<svg viewBox="0 0 200 200" class="bild-uhr" role="img" aria-label="Uhr">
      <circle cx="100" cy="100" r="96" fill="#fff" stroke="#3b1f63" stroke-width="6"/>${striche}${zahlen}
      <line x1="100" y1="100" x2="100" y2="52" stroke="#C2337A" stroke-width="9" stroke-linecap="round" transform="rotate(${wS} 100 100)"/>
      <line x1="100" y1="100" x2="100" y2="26" stroke="#3AA0E0" stroke-width="6" stroke-linecap="round" transform="rotate(${wM} 100 100)"/>
      <circle cx="100" cy="100" r="8" fill="#3b1f63"/></svg>`;
  }

  // ---------- Bilder für Daten, Zufall und Formen ----------
  const D = "#3b1f63";
  function strichBild(e, n) {
    let s = "", x = 90;
    for (let i = 0; i < n; i++) {
      const imFuenfer = i % 5;
      if (imFuenfer === 4) s += `<line x1="${x - 4 * 14 - 6}" y1="70" x2="${x - 8}" y2="22" stroke="${D}" stroke-width="5" stroke-linecap="round"/>`, x += 20;
      else { s += `<line x1="${x}" y1="20" x2="${x}" y2="72" stroke="${D}" stroke-width="5" stroke-linecap="round"/>`; x += 14; }
    }
    return `<svg viewBox="0 0 ${Math.max(320, x + 20)} 92" role="img" aria-label="Strichliste"><rect x="2" y="2" width="${Math.max(316, x + 16)}" height="88" rx="14" fill="#FFFDF5" stroke="#E8DCC4" stroke-width="3"/><text x="44" y="62" font-size="42" text-anchor="middle">${e}</text>${s}</svg>`;
  }
  function diagrammBild(dinge, werte) {
    const max = Math.max(...werte, 5), H = 180, B = 70, X0 = 50;
    let s = "";
    for (let v = 0; v <= max; v++) { const y = 210 - v / max * H; s += `<line x1="${X0}" y1="${y}" x2="${X0 + dinge.length * (B + 24) + 10}" y2="${y}" stroke="#E6DDF2" stroke-width="2"/><text x="${X0 - 10}" y="${y + 6}" font-size="17" text-anchor="end" fill="${D}" font-family="Fredoka, Arial">${v}</text>`; }
    const farben = ["#FF6F91", "#FFC83D", "#5CCBA6", "#7B9BFF", "#C27BFF"];
    dinge.forEach((d, i) => {
      const h = werte[i] / max * H, x = X0 + 20 + i * (B + 24);
      s += `<rect x="${x}" y="${210 - h}" width="${B}" height="${h}" rx="8" fill="${farben[i]}" stroke="${D}" stroke-width="3"/><text x="${x + B / 2}" y="246" font-size="34" text-anchor="middle">${d}</text>`;
    });
    return `<svg viewBox="0 0 ${X0 + dinge.length * (B + 24) + 30} 256" role="img" aria-label="Säulendiagramm">${s}<line x1="${X0}" y1="210" x2="${X0 + dinge.length * (B + 24) + 10}" y2="210" stroke="${D}" stroke-width="4"/><line x1="${X0}" y1="20" x2="${X0}" y2="210" stroke="${D}" stroke-width="4"/></svg>`;
  }
  const KUGELF = { rot: "#E8453C", blau: "#3A7BE0", gelb: "#FFC83D", grün: "#3BAA5C" };
  function beutelBild(kugeln) {
    let s = "";
    kugeln.forEach((f, i) => { const x = 70 + (i % 4) * 46, y = 92 + Math.floor(i / 4) * 44; s += `<circle cx="${x}" cy="${y}" r="19" fill="${KUGELF[f]}" stroke="${D}" stroke-width="3"/><circle cx="${x - 6}" cy="${y - 6}" r="5" fill="#fff" opacity=".6"/>`; });
    return `<svg viewBox="0 0 280 200" role="img" aria-label="Beutel mit Kugeln"><path d="M30 60 Q20 190 140 192 Q260 190 250 60 Z" fill="#E9D8B5" stroke="${D}" stroke-width="4"/><path d="M30 60 Q140 40 250 60" fill="none" stroke="${D}" stroke-width="4"/><path d="M110 50 Q140 20 170 50" fill="none" stroke="#B9732E" stroke-width="6"/>${s}</svg>`;
  }
  function formBild(form, farbe = "#7B9BFF") {
    const f = `fill="${farbe}" stroke="${D}" stroke-width="5" stroke-linejoin="round"`;
    const g = {
      dreieck: `<path d="M100 20 L180 160 L20 160 Z" ${f}/>`,
      quadrat: `<rect x="35" y="25" width="130" height="130" ${f}/>`,
      rechteck: `<rect x="10" y="50" width="180" height="90" ${f}/>`,
      kreis: `<circle cx="100" cy="92" r="70" ${f}/>`,
      fuenfeck: `<path d="M100 18 L178 74 L148 164 L52 164 L22 74 Z" ${f}/>`,
      sechseck: `<path d="M55 22 L145 22 L190 92 L145 162 L55 162 L10 92 Z" ${f}/>`,
      wuerfel: `<path d="M50 60 L110 30 L170 60 L170 140 L110 170 L50 140 Z" fill="#FFC83D" stroke="${D}" stroke-width="5" stroke-linejoin="round"/><path d="M50 60 L110 90 L170 60 M110 90 L110 170" fill="none" stroke="${D}" stroke-width="5"/>`,
      quader: `<path d="M20 70 L70 40 L190 40 L190 120 L140 150 L20 150 Z" fill="#5CCBA6" stroke="${D}" stroke-width="5" stroke-linejoin="round"/><path d="M20 70 L140 70 L190 40 M140 70 L140 150" fill="none" stroke="${D}" stroke-width="5"/>`,
      kugel: `<circle cx="100" cy="95" r="72" fill="#FF6F91" stroke="${D}" stroke-width="5"/><ellipse cx="100" cy="95" rx="72" ry="22" fill="none" stroke="${D}" stroke-width="3" opacity=".5"/><circle cx="74" cy="66" r="14" fill="#fff" opacity=".5"/>`
    }[form];
    return `<svg viewBox="0 0 200 180" class="bild-uhr" role="img" aria-label="Form">${g}</svg>`;
  }

  function linealBild(start, laenge, farbe = "#FFC83D") {
    const px = 36, x0 = 30; let striche = "";
    for (let mm = 0; mm <= 150; mm++) {
      const x = x0 + mm * px / 10, cm = mm % 10 === 0, halb = mm % 5 === 0;
      striche += `<line x1="${x}" y1="96" x2="${x}" y2="${96 + (cm ? 22 : halb ? 14 : 8)}" stroke="${D}" stroke-width="${cm ? 2.5 : 1}"/>`;
      if (cm) striche += `<text x="${x}" y="138" font-size="15" text-anchor="middle" fill="${D}" font-family="Fredoka, Arial">${mm / 10}</text>`;
    }
    const xa = x0 + start * px, xb = xa + laenge * px;
    return `<svg viewBox="0 0 600 160" role="img" aria-label="Lineal"><rect x="18" y="94" width="564" height="54" rx="6" fill="#FFF3C4" stroke="${D}" stroke-width="3"/>${striche}
      <path d="M${xa} 52 L${xb - 22} 52 L${xb} 66 L${xb - 22} 80 L${xa} 80 Z" fill="${farbe}" stroke="${D}" stroke-width="3" stroke-linejoin="round"/><rect x="${xa}" y="52" width="16" height="28" fill="#FF8FA3" stroke="${D}" stroke-width="3"/>
      <line x1="${xa}" y1="84" x2="${xa}" y2="96" stroke="#C2337A" stroke-width="2" stroke-dasharray="3 3"/><line x1="${xb}" y1="84" x2="${xb}" y2="96" stroke="#C2337A" stroke-width="2" stroke-dasharray="3 3"/></svg>`;
  }
  const TAGE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
  const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const NAMEN = ["Lena", "Ben", "Aylin", "Noah", "Mia", "Ali", "Sofia", "Emil", "Nora", "Jonas"];

  // ---------- Stationen ----------
  const zahl = (text, antwort, hilfe, extra = {}) => Object.assign({ text, antwort: String(antwort), art: "zahl", hilfe }, extra);

  const STATIONEN = [
    { id: "plus20", lz: ["ma.zo.03"], name: "Plus bis 20", icon: "+",
      neu: () => { const a = r(2, 15), b = r(2, 20 - a); return zahl(`${a} + ${b}`, a + b, wegPlus(a, b)); } },
    { id: "minus20", lz: ["ma.zo.03"], name: "Minus bis 20", icon: M,
      neu: () => { const a = r(8, 20), b = r(2, a - 1); return zahl(`${a} ${M} ${b}`, a - b, wegMinus(a, b)); } },
    { id: "zehner", lz: ["ma.zo.05"], name: "Zehner und Einer", icon: "▮",
      neu: () => { const n = r(11, 99); return zahl("", n, `${Math.floor(n / 10)} Zehner und ${n % 10} Einer sind ${n}`, { frage: "Welche Zahl ist das?", bild: zehnerBild(n), nurLuecke: true }); } },
    { id: "vergleich", lz: ["ma.zo.02", "ma.zo.06"], name: "Größer oder kleiner", icon: "<",
      neu: () => {
        const a = r(10, 99);
        const b = Math.random() < 0.15 ? a : Math.max(1, Math.min(100, a + wahl([-1, 1]) * r(1, 12)));
        const z = a < b ? "<" : a > b ? ">" : "=";
        return { text: `${a} ? ${b}`, antwort: z, art: "wahl", optionen: ["<", "=", ">"], frage: "Welches Zeichen passt?",
          hilfe: a === b ? `${a} und ${b} sind gleich groß` : `Vergleiche zuerst die Zehner, dann die Einer. ${Math.min(a, b)} ist kleiner als ${Math.max(a, b)}` };
      } },
    { id: "gerade", lz: ["ma.zo.06"], name: "Gerade und ungerade", icon: "2",
      neu: () => {
        if (Math.random() < 0.6) {
          const n = r(1, 99), g = n % 2 === 0;
          const paare = n <= 12 ? `<svg viewBox="0 0 ${Math.ceil(n / 2) * 40 + 20} 100" role="img" aria-label="Punkte in Paaren">${Array.from({ length: n }, (_, i) => `<circle cx="${30 + Math.floor(i / 2) * 40}" cy="${i % 2 ? 70 : 30}" r="14" fill="${i === n - 1 && !g ? "#FF6F61" : "#5CCBA6"}" stroke="${D}" stroke-width="3"/>`).join("")}</svg>` : undefined;
          return { text: "", frage: `Ist ${n} gerade oder ungerade?`, antwort: g ? "gerade" : "ungerade", art: "wahl", optionen: ["gerade", "ungerade"], bild: paare, nurLuecke: true,
            hilfe: `Schau auf die letzte Ziffer: ${n % 10}. Gerade Zahlen enden auf 0, 2, 4, 6 oder 8. Also ist ${n} ${g ? "gerade" : "ungerade"}.` };
        }
        const g = Math.random() < 0.5; let zahlen;
        do { zahlen = Array.from({ length: 4 }, () => r(1, 99)); } while (zahlen.filter(z => (z % 2 === 0) === g).length !== 1 || new Set(zahlen).size < 4);
        const richtig = zahlen.find(z => (z % 2 === 0) === g);
        return { text: "", frage: `Welche Zahl ist ${g ? "gerade" : "ungerade"}?`, antwort: String(richtig), art: "wahl", optionen: zahlen.map(String), nurLuecke: true,
          hilfe: `${richtig} endet auf ${richtig % 10} – das ist ${g ? "gerade" : "ungerade"}. Gerade Zahlen enden auf 0, 2, 4, 6, 8.` };
      } },
    { id: "formen", lz: ["ma.rf.03", "ma.rf.04"], name: "Formen und Körper", icon: "△",
      neu: () => {
        const art = r(1, 3);
        if (art === 1) {
          const formen = { dreieck: "Dreieck", quadrat: "Quadrat", rechteck: "Rechteck", kreis: "Kreis" };
          const k = wahl(Object.keys(formen));
          return { text: "", frage: "Welche Form ist das?", antwort: formen[k], art: "wahl", optionen: mische(Object.values(formen)), bild: formBild(k, wahl(["#7B9BFF", "#FF9E5E", "#5CCBA6", "#C27BFF"])), nurLuecke: true,
            hilfe: { dreieck: "Ein Dreieck hat 3 Ecken und 3 Seiten.", quadrat: "Ein Quadrat hat 4 gleich lange Seiten und 4 Ecken.", rechteck: "Ein Rechteck hat 4 Ecken. Die gegenüberliegenden Seiten sind gleich lang.", kreis: "Ein Kreis ist rund und hat keine Ecken." }[k] };
        }
        if (art === 2) {
          const ecken = { dreieck: 3, quadrat: 4, rechteck: 4, fuenfeck: 5, sechseck: 6, kreis: 0 };
          const k = wahl(Object.keys(ecken));
          return zahl("", ecken[k], ecken[k] ? `Zähle die Ecken der Reihe nach: ${Array.from({ length: ecken[k] }, (_, i) => i + 1).join(", ")}.` : "Ein Kreis hat keine Ecken: 0.",
            { frage: "Wie viele Ecken hat die Form?", bild: formBild(k, "#FFD84D"), nurLuecke: true });
        }
        const koerper = { wuerfel: "Würfel", quader: "Quader", kugel: "Kugel" };
        const k = wahl(Object.keys(koerper));
        return { text: "", frage: "Welcher Körper ist das?", antwort: koerper[k], art: "wahl", optionen: mische(Object.values(koerper)), bild: formBild(k), nurLuecke: true,
          hilfe: { wuerfel: "Ein Würfel hat 6 gleich große quadratische Flächen – wie ein Spielwürfel.", quader: "Ein Quader sieht aus wie eine Schachtel: Die Flächen sind Rechtecke.", kugel: "Eine Kugel ist überall rund – wie ein Ball." }[k] };
      } },
    { id: "plus100", lz: ["ma.zo.07"], name: "Plus bis 100", icon: "+",
      neu: () => {
        const art = r(0, 2);
        if (art === 0) { const a = r(1, 8) * 10, b = r(1, 10 - a / 10) * 10; return zahl(`${a} + ${b}`, a + b, `${a / 10} Zehner + ${b / 10} Zehner = ${(a + b) / 10} Zehner, also ${a + b}`); }
        if (art === 1) { const a = r(2, 9) * 10 + r(0, 8), b = r(1, 9 - (a % 10)); return zahl(`${a} + ${b}`, a + b, (a % 10 ? `Nur die Einer: ${a % 10} + ${b} = ${a % 10 + b}, also ${a + b}` : `${a} und ${b} sind zusammen ${a + b}`)); }
        const a = r(1, 7) * 10 + r(1, 8), b = r(1, 9 - Math.floor(a / 10) - 1) * 10 + r(0, 9 - (a % 10));
        return zahl(`${a} + ${b}`, a + b, wegPlus(a, b));
      } },
    { id: "minus100", lz: ["ma.zo.07"], name: "Minus bis 100", icon: M,
      neu: () => {
        const art = r(0, 2);
        if (art === 0) { const a = r(3, 10) * 10, b = r(1, a / 10 - 1) * 10; return zahl(`${a} ${M} ${b}`, a - b, `${a / 10} Zehner ${M} ${b / 10} Zehner = ${(a - b) / 10} Zehner, also ${a - b}`); }
        if (art === 1) { const a = r(2, 9) * 10 + r(2, 9), b = r(1, a % 10); return zahl(`${a} ${M} ${b}`, a - b, `Nur die Einer: ${a % 10} ${M} ${b} = ${a % 10 - b}, also ${a - b}`); }
        const a = r(3, 9) * 10 + r(1, 9), b = r(1, Math.floor(a / 10) - 1) * 10 + r(0, a % 10);
        return zahl(`${a} ${M} ${b}`, a - b, wegMinus(a, b));
      } },
    { id: "plusUeber", lz: ["ma.zo.07"], name: "Plus über den Zehner", icon: "+",
      neu: () => {
        if (Math.random() < 0.5) { const e = r(3, 9), a = r(1, 8) * 10 + r(10 - e + 1, 9), b = e; return zahl(`${a} + ${b}`, a + b, wegPlus(a, b)); }
        let a, b; do { a = r(1, 7) * 10 + r(2, 9); b = r(1, 6) * 10 + r(2, 9); } while ((a % 10) + (b % 10) <= 10 || a + b > 100);
        return zahl(`${a} + ${b}`, a + b, wegPlus(a, b));
      } },
    { id: "minusUeber", lz: ["ma.zo.07"], name: "Minus über den Zehner", icon: M,
      neu: () => {
        if (Math.random() < 0.5) { const a = r(2, 9) * 10 + r(0, 7), b = r((a % 10) + 1, 9); return zahl(`${a} ${M} ${b}`, a - b, wegMinus(a, b)); }
        let a, b; do { a = r(3, 9) * 10 + r(0, 7); b = r(1, 7) * 10 + r(1, 9); } while ((b % 10) <= (a % 10) || b >= a);
        return zahl(`${a} ${M} ${b}`, a - b, wegMinus(a, b));
      } },
    { id: "doppelt", lz: ["ma.zo.04"], name: "Verdoppeln und Halbieren", icon: "×2",
      neu: () => {
        if (Math.random() < 0.5) { const n = r(3, 50); const z = n - n % 10, e = n % 10;
          return zahl(`Das Doppelte von ${n}`, 2 * n, z && e ? `${z} + ${z} = ${2 * z}, ${e} + ${e} = ${2 * e}, zusammen ${2 * n}` : `${n} + ${n} = ${2 * n}`, { nurLuecke: false, wort: true }); }
        const n = r(2, 50) * 2; const z = n - n % 10, e = n % 10;
        return zahl(`Die Hälfte von ${n}`, n / 2, (z % 20 === 0 && e) ? `Hälfte von ${z} ist ${z / 2}, Hälfte von ${e} ist ${e / 2}, zusammen ${n / 2}` : `${n / 2} + ${n / 2} = ${n}`, { wort: true });
      } },
    { id: "ergaenzen", lz: ["ma.zo.08"], name: "Ergänzen", icon: "?",
      neu: () => {
        const art = r(0, 2);
        if (art === 0) { const a = r(1, 9) * 10 + r(1, 9), z = Math.ceil(a / 10) * 10; return zahl(`${a} + ? = ${z}`, z - a, `Bis zum nächsten Zehner: ${a} + ${z - a} = ${z}`); }
        if (art === 1) { const a = r(1, 9) * 10; return zahl(`${a} + ? = 100`, 100 - a, `${a / 10} Zehner + ${10 - a / 10} Zehner = 10 Zehner, also fehlen ${100 - a}`); }
        const a = r(11, 89); const z = Math.ceil(a / 10) * 10;
        return zahl(`${a} + ? = 100`, 100 - a, a % 10 ? `${a} + ${z - a} = ${z}, ${z} + ${100 - z} = 100, also ${100 - a}` : `${a} + ${100 - a} = 100`);
      } },
    { id: "sachaufgaben", lz: ["ma.zo.18", "ma.pk.04"], name: "Sachaufgaben", icon: "📝",
      neu: () => {
        const n = wahl(NAMEN), art = r(1, 5);
        const dinge = wahl([["Äpfel", "🍎"], ["Murmeln", "🔵"], ["Sticker", "⭐"], ["Bonbons", "🍬"], ["Muscheln", "🐚"], ["Stifte", "✏️"]]);
        if (art === 1) { const a = r(5, 40), b = r(3, 30); return zahl("", a + b, `${a} + ${b} = ${a + b}. Dazubekommen heißt plus.`, { frage: `${n} hat ${a} ${dinge[0]} ${dinge[1]}. ${n} bekommt ${b} dazu. Wie viele ${dinge[0]} hat ${n} jetzt?`, nurLuecke: true }); }
        if (art === 2) { const a = r(15, 60), b = r(3, a - 2); return zahl("", a - b, `${a} ${M} ${b} = ${a - b}. Verschenken heißt minus.`, { frage: `${n} hat ${a} ${dinge[0]} ${dinge[1]} und verschenkt ${b}. Wie viele ${dinge[0]} bleiben übrig?`, nurLuecke: true }); }
        if (art === 3) { const k = r(2, 6), je = wahl([2, 5, 10]); return zahl("", k * je, `${k} · ${je} = ${k * je}. Gleich viele in jeder Tüte heißt mal.`, { frage: `In jeder Tüte sind ${je} ${dinge[0]} ${dinge[1]}. ${n} hat ${k} Tüten. Wie viele ${dinge[0]} sind das zusammen?`, nurLuecke: true }); }
        if (art === 4) { const preis = r(2, 9), euro = wahl([10, 20]); return zahl("", euro - preis, `${euro} € ${M} ${preis} € = ${euro - preis} €.`, { frage: `${n} kauft ein Buch für ${preis} € und bezahlt mit ${euro} €. Wie viel Geld bekommt ${n} zurück?`, einheit: "€", nurLuecke: true }); }
        const a = r(10, 40), b = r(2, 9); return zahl("", a + b, `${a} + ${b} = ${a + b}. Einsteigen heißt plus.`, { frage: `Im Bus sitzen ${a} Kinder 🚌. An der Haltestelle steigen ${b} Kinder ein. Wie viele Kinder sind jetzt im Bus?`, nurLuecke: true });
      } },
    { id: "daten", lz: ["ma.dz.02", "ma.dz.03"], name: "Strichlisten und Diagramme", icon: "📊",
      neu: () => {
        const art = r(1, 4);
        if (art === 1) {
          const e = wahl(["🐦", "🚗", "🌸", "🐞", "⚽"]), n = r(3, 14);
          return zahl("", n, `Zähle in Fünferbündeln: Ein Bündel mit Querstrich ist 5. ${Math.floor(n / 5)} Bündel und ${n % 5} Striche = ${n}.`, { frage: "Was zeigt die Strichliste? Wie viele sind es?", bild: strichBild(e, n), nurLuecke: true });
        }
        const dinge = mische(["🍎", "🍌", "🍓", "🍐", "🍇"]).slice(0, 4);
        let werte; do { werte = dinge.map(() => r(1, 9)); } while (new Set(werte).size < 4);
        const bild = diagrammBild(dinge, werte);
        if (art === 2) { const i = r(0, 3); return zahl("", werte[i], `Geh mit dem Finger von der Säule ${dinge[i]} nach links zur Zahl: ${werte[i]}.`, { frage: `Die Klasse hat abgestimmt: Wie viele Kinder mögen ${dinge[i]} am liebsten?`, bild, nurLuecke: true }); }
        if (art === 3) { const i = werte.indexOf(Math.max(...werte)); return { text: "", frage: "Welches Obst mögen die meisten Kinder?", antwort: dinge[i], art: "wahl", optionen: dinge.slice(), bild, nurLuecke: true, hilfe: `Die höchste Säule gehört zu ${dinge[i]}: ${werte[i]} Kinder.` }; }
        const [i, j] = mische([0, 1, 2, 3]).slice(0, 2), [g, k] = werte[i] > werte[j] ? [i, j] : [j, i];
        return zahl("", werte[g] - werte[k], `${dinge[g]}: ${werte[g]}, ${dinge[k]}: ${werte[k]}. ${werte[g]} ${M} ${werte[k]} = ${werte[g] - werte[k]}.`, { frage: `Wie viele Kinder mehr mögen ${dinge[g]} als ${dinge[k]}?`, bild, nurLuecke: true });
      } },
    { id: "mal1", lz: ["ma.zo.09"], name: "Einmaleins mit 2, 5, 10", icon: "·",
      neu: () => malAufgabe([2, 5, 10]) },
    { id: "mal2", lz: ["ma.zo.11"], name: "Einmaleins mit 3 und 4", icon: "·",
      neu: () => malAufgabe([3, 4]) },
    { id: "mal3", lz: ["ma.zo.11"], name: "Einmaleins mit 6 bis 9", icon: "·",
      neu: () => malAufgabe([6, 7, 8, 9]) },
    { id: "geteilt", lz: ["ma.zo.10"], name: "Geteilt", icon: ":",
      neu: () => { const d = wahl([2, 3, 4, 5, 10]), q = r(1, 10); return zahl(`${d * q} : ${d}`, q, `Denke an das Einmaleins: ${q} · ${d} = ${d * q}`); } },
    { id: "geld", lz: ["ma.gm.02", "ma.gm.04"], name: "Geld", icon: "€",
      neu: () => {
        if (Math.random() < 0.5) {
          let st, s; do { st = Array.from({ length: r(2, 5) }, () => wahl([1, 2, 5, 10, 20, 50])).sort((a, b) => b - a); s = st.reduce((a, b) => a + b, 0); } while (s > 99);
          return zahl("", s, st.join(" ct + ") + " ct = " + s + " ct", { frage: "Wie viel Geld ist das?", bild: geldBild(st, "ct"), einheit: "ct", nurLuecke: true });
        }
        let st, s; do { st = Array.from({ length: r(2, 5) }, () => wahl([1, 2, 5, 10, 20, 50])).sort((a, b) => b - a); s = st.reduce((a, b) => a + b, 0); } while (s > 100);
        return zahl("", s, st.join(" € + ") + " € = " + s + " €", { frage: "Wie viel Geld ist das?", bild: geldBild(st, "eur"), einheit: "€", nurLuecke: true });
      } },
    { id: "laenge", lz: ["ma.gm.05"], name: "Länge", icon: "📏",
      neu: () => {
        const art = r(1, 4);
        if (art <= 2) { const start = art === 1 ? 0 : r(1, 4), l = r(3, 15 - start); return zahl("", l, start ? `Der Stift fängt bei ${start} an und hört bei ${start + l} auf: ${start + l} ${M} ${start} = ${l} cm.` : `Der Stift fängt bei 0 an. Lies ab, wo er aufhört: ${l} cm.`, { frage: start ? "Achtung, der Stift fängt nicht bei 0 an! Wie lang ist er?" : "Wie lang ist der Stift?", bild: linealBild(start, l, wahl(["#FFC83D", "#5CCBA6", "#7B9BFF"])), einheit: "cm", nurLuecke: true }); }
        if (art === 3) { const m = r(1, 5); return zahl(`${m} m = ? cm`, m * 100, `1 m sind 100 cm. ${m} m sind ${m * 100} cm.`, { einheit: "", nurLuecke: false }); }
        const sch = wahl([["ein Bleistift", "15 cm", ["15 m", "1 cm"]], ["eine Tür", "2 m", ["2 cm", "20 m"]], ["ein Daumennagel", "1 cm", ["1 m", "10 m"]], ["ein Fußballtor", "7 m", ["7 cm", "70 cm"]], ["ein Lineal", "30 cm", ["30 m", "3 cm"]]]);
        return { text: "", frage: `Wie lang ist ${sch[0]} ungefähr?`, antwort: sch[1], art: "wahl", optionen: mische([sch[1], ...sch[2]]), nurLuecke: true, hilfe: `${sch[0][0].toUpperCase() + sch[0].slice(1)} ist ungefähr ${sch[1]} lang. Ein Zentimeter ist etwa so breit wie dein kleiner Finger.` };
      } },
    { id: "zufall", lz: ["ma.dz.04"], name: "Sicher, möglich, unmöglich", icon: "🎲",
      neu: () => {
        const OPT = ["sicher", "möglich", "unmöglich"];
        if (Math.random() < 0.6) {
          const farben = Object.keys(KUGELF), fall = r(1, 3);
          const haupt = wahl(farben), andere = wahl(farben.filter(f => f !== haupt)), n = r(4, 8);
          let kugeln, gefragt, antwort;
          if (fall === 1) { kugeln = Array(n).fill(haupt); gefragt = haupt; antwort = "sicher"; }
          else if (fall === 2) { const k = r(1, n - 1); kugeln = mische(Array(k).fill(haupt).concat(Array(n - k).fill(andere))); gefragt = wahl([haupt, andere]); antwort = "möglich"; }
          else { kugeln = mische(Array(r(1, n - 1)).fill(haupt).concat(Array(r(1, 3)).fill(andere))).slice(0, n); gefragt = wahl(farben.filter(f => !kugeln.includes(f))); antwort = "unmöglich"; }
          return { text: "", frage: `Du ziehst ohne hinzusehen eine Kugel. Dass sie ${gefragt} ist, ist …`, antwort, art: "wahl", optionen: OPT, bild: beutelBild(kugeln), nurLuecke: true,
            hilfe: { sicher: `Alle Kugeln sind ${gefragt}. Darum ist es sicher.`, möglich: `Es gibt ${gefragt}e Kugeln, aber auch andere. Darum ist es möglich.`, unmöglich: `Im Beutel ist keine ${gefragt}e Kugel. Darum ist es unmöglich.` }[antwort] };
        }
        const satz = wahl([["eine 6", "möglich", "Der Würfel hat die Zahlen 1 bis 6. Die 6 kann kommen, muss aber nicht."], ["eine 7", "unmöglich", "Auf einem Würfel gibt es keine 7."], ["eine Zahl kleiner als 7", "sicher", "Alle Zahlen auf dem Würfel (1 bis 6) sind kleiner als 7."], ["eine gerade Zahl", "möglich", "2, 4 und 6 sind gerade – aber 1, 3 und 5 können auch kommen."], ["eine 0", "unmöglich", "Auf einem Würfel gibt es keine 0."], ["eine Zahl von 1 bis 6", "sicher", "Jeder Wurf zeigt eine Zahl von 1 bis 6."]]);
        const augen = [[50, 50], [130, 130], [50, 130], [130, 50], [90, 90]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="14" fill="${D}"/>`).join("");
        const wuerfel = `<svg viewBox="0 0 180 180" class="bild-uhr" role="img" aria-label="Würfel"><rect x="12" y="12" width="156" height="156" rx="30" fill="#fff" stroke="${D}" stroke-width="7"/>${augen}</svg>`;
        return { text: "", frage: `Du würfelst einmal mit einem normalen Würfel. Dass du ${satz[0]} würfelst, ist …`, antwort: satz[1], art: "wahl", optionen: OPT, bild: wuerfel, nurLuecke: true, hilfe: satz[2] };
      } },
    { id: "uhr", lz: ["ma.gm.06"], name: "Uhrzeit", icon: "🕒",
      neu: () => {
        const h = r(1, 12), m = wahl([0, 0, 30, 30, 15, 45]);
        const f = (hh, mm) => `${((hh - 1 + 12) % 12) + 1}:${String(mm).padStart(2, "0")}`;
        const richtig = f(h, m);
        const falsch = new Set();
        falsch.add(f(m === 0 ? 12 : Math.round(m / 5), (h % 12) * 5)); // Zeiger vertauscht
        falsch.add(f(h + 1, m)); falsch.add(f(h - 1, m));
        falsch.add(f(h, (m + 30) % 60));
        falsch.delete(richtig);
        const opt = mische([richtig, ...mische([...falsch]).slice(0, 3)]);
        const worte = { 0: `${h} Uhr`, 30: `halb ${(h % 12) + 1}`, 15: `Viertel nach ${h}`, 45: `Viertel vor ${(h % 12) + 1}` }[m];
        return { text: "", frage: "Wie spät ist es?", antwort: richtig, art: "wahl", optionen: opt, bild: uhrBild(h, m), nurLuecke: true,
          hilfe: `Der kurze Zeiger zeigt die Stunde, der lange die Minuten. Es ist ${richtig} Uhr, also ${worte}.` };
      } },
    { id: "kalender", lz: ["ma.gm.07", "su.hi.02"], name: "Woche, Monat, Jahr", icon: "📅",
      neu: () => {
        const art = r(1, 5);
        if (art === 1) { const i = r(0, 6); const n = TAGE[(i + 1) % 7]; return { text: "", frage: `Welcher Tag kommt nach ${TAGE[i]}?`, antwort: n, art: "wahl", optionen: mische([n, TAGE[(i + 2) % 7], TAGE[(i + 6) % 7]]), nurLuecke: true, hilfe: `Die Wochentage: ${TAGE.join(", ")}. Nach ${TAGE[i]} kommt ${n}.` }; }
        if (art === 2) { const i = r(0, 6), d = r(2, 4), n = TAGE[(i + d) % 7]; return { text: "", frage: `Heute ist ${TAGE[i]}. Welcher Tag ist in ${d} Tagen?`, antwort: n, art: "wahl", optionen: mische([n, TAGE[(i + d + 1) % 7], TAGE[(i + d + 6) % 7]]), nurLuecke: true, hilfe: `Zähle weiter: ${Array.from({ length: d }, (_, k) => TAGE[(i + k + 1) % 7]).join(", ")}.` }; }
        if (art === 3) { const i = r(0, 11), n = MONATE[(i + 1) % 12]; return { text: "", frage: `Welcher Monat kommt nach ${MONATE[i]}?`, antwort: n, art: "wahl", optionen: mische([n, MONATE[(i + 2) % 12], MONATE[(i + 11) % 12]]), nurLuecke: true, hilfe: `Die Monate: ${MONATE.join(", ")}.` }; }
        const f = wahl([["Wie viele Tage hat eine Woche?", 7, "Montag bis Sonntag: 7 Tage."], ["Wie viele Monate hat ein Jahr?", 12, "Januar bis Dezember: 12 Monate."], ["Wie viele Stunden hat ein Tag?", 24, "Ein Tag hat 24 Stunden – Tag und Nacht zusammen."], ["Wie viele Tage hat das Wochenende?", 2, "Samstag und Sonntag: 2 Tage."]]);
        return zahl("", f[1], f[2], { frage: f[0], nurLuecke: true });
      } }
  ];

  // ---------- Klasse 1 und Vorschule (NA-32): Mengen mit Material ----------
  // Würfelbild: Augen 1–6 in der vertrauten Anordnung
  const AUGEN = { 1: [[1, 1]], 2: [[0, 0], [2, 2]], 3: [[0, 0], [1, 1], [2, 2]], 4: [[0, 0], [2, 0], [0, 2], [2, 2]],
    5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]], 6: [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]] };
  function wuerfel(n, x) {
    return `<g transform="translate(${x} 6)"><rect width="108" height="108" rx="20" fill="#fff" stroke="#3b1f63" stroke-width="5"/>` +
      AUGEN[n].map(([c, z]) => `<circle cx="${24 + c * 30}" cy="${24 + z * 30}" r="11" fill="#3b1f63"/>`).join("") + `</g>`;
  }
  function wuerfelBild(a, b) {
    const w = b ? 250 : 120;
    return `<svg viewBox="0 0 ${w} 120" role="img" aria-label="Würfel">${wuerfel(a, 6)}${b ? wuerfel(b, 136) : ""}</svg>`;
  }
  // Zwanzigerfeld: zwei Zehnerreihen, Fünfer abgesetzt; rot = n Plättchen (optional blau = zweiter Teil)
  function zwanzigerBild(n, blau = 0) {
    let s = "";
    for (let i = 0; i < 20; i++) {
      const reihe = Math.floor(i / 10), sp = i % 10, x = 14 + sp * 40 + (sp >= 5 ? 14 : 0), y = 14 + reihe * 44;
      const farbe = i < n ? "#E8463B" : i < n + blau ? "#3A7BD5" : "#fff";
      s += `<rect x="${x - 2}" y="${y - 2}" width="38" height="40" fill="none" stroke="#C9B8F0" stroke-width="2"/><circle cx="${x + 17}" cy="${y + 18}" r="14" fill="${farbe}" stroke="#3b1f63" stroke-width="${i < n + blau ? 2.5 : 1.5}"/>`;
    }
    return `<svg viewBox="0 0 440 110" role="img" aria-label="Zwanzigerfeld">${s}</svg>`;
  }
  // Menge aus Bildern, in Fünfergruppen (zählen ohne Abzählfehler); weg = so viele am Ende durchgestrichen
  const DINGE = ["🍎", "⭐", "🐟", "🌸", "🎈", "🐞", "🍓", "🚗", "🦆", "🍪"];
  function mengeBild(n, ding, weg = 0, ding2 = null, n2 = 0) {
    const alle = Array.from({ length: n }, () => ding).concat(Array.from({ length: n2 }, () => ding2));
    let s = "";
    alle.forEach((d, i) => {
      const x = 8 + (i % 10) * 46 + ((i % 10) >= 5 ? 16 : 0), y = 8 + Math.floor(i / 10) * 52;
      s += `<text x="${x + 21}" y="${y + 36}" font-size="36" text-anchor="middle">${d}</text>`;
      if (i >= n - weg && i < n) s += `<path d="M${x + 4} ${y + 44} L${x + 40} ${y + 6}" stroke="#D7263D" stroke-width="5" stroke-linecap="round"/>`;
    });
    const zeilen = Math.max(1, Math.ceil(alle.length / 10));
    return `<svg viewBox="0 0 490 ${zeilen * 52 + 12}" role="img" aria-label="${alle.length} Dinge">${s}</svg>`;
  }
  function zweiGruppen(a, b, da, db) {
    const gruppe = (n, d, x0) => Array.from({ length: n }, (_, i) => `<text x="${x0 + 24 + (i % 3) * 52}" y="${44 + Math.floor(i / 3) * 52}" font-size="38" text-anchor="middle">${d}</text>`).join("");
    const h = Math.max(Math.ceil(a / 3), Math.ceil(b / 3)) * 52 + 16;
    return `<svg viewBox="0 0 400 ${h}" role="img" aria-label="Zwei Gruppen"><rect x="2" y="2" width="180" height="${h - 4}" rx="18" fill="#FFF6DA" stroke="#E8A33D" stroke-width="3"/>` +
      `<rect x="218" y="2" width="180" height="${h - 4}" rx="18" fill="#E3F2FF" stroke="#3AA0E0" stroke-width="3"/>${gruppe(a, da, 12)}${gruppe(b, db, 228)}</svg>`;
  }
  const MUSTER = [["🔴", "🔵"], ["🍎", "🍌"], ["⭐", "🌙"], ["🐟", "🐸", "🐞"], ["▲", "●", "■"], ["🌸", "🌸", "🍃"], ["🔵", "🔵", "🟡"]];

  const STATIONEN_K1 = [
    { id: "k1wuerfel", stufe: "vs", lz: ["ma.zo.01"], name: "Würfelbilder", icon: "⚄",
      neu: () => {
        if (Math.random() < 0.6) { const n = r(1, 6); return zahl("", n, `Das Würfelbild für ${n} kennst du bald auf einen Blick. Zähle die Punkte: ${Array.from({ length: n }, (_, i) => i + 1).join(", ")}.`, { frage: "Wie viele Punkte siehst du?", bild: wuerfelBild(n), nurLuecke: true }); }
        const a = r(1, 6), b = r(1, Math.min(6, 10 - a));
        return zahl("", a + b, `Ein Würfel zeigt ${a}, der andere ${b}. Zähle beim zweiten Würfel weiter: ${a}, ${Array.from({ length: b }, (_, i) => a + i + 1).join(", ")}.`, { frage: "Wie viele Punkte sind es zusammen?", bild: wuerfelBild(a, b), nurLuecke: true });
      } },
    { id: "k1zaehlen", stufe: "vs", lz: ["ma.zo.01", "ma.pk.05"], name: "Zählen bis 10", icon: "🍎",
      neu: () => { const n = r(1, 10), d = wahl(DINGE); return zahl("", n, n > 5 ? `Erst die Fünf, dann weiterzählen: 5, ${Array.from({ length: n - 5 }, (_, i) => 6 + i).join(", ")}.` : `Zähle mit dem Finger: ${Array.from({ length: n }, (_, i) => i + 1).join(", ")}.`, { frage: "Wie viele sind es?", bild: mengeBild(n, d), nurLuecke: true }); } },
    { id: "k1mehr", stufe: "vs", lz: ["ma.zo.02", "ma.dz.01"], name: "Wo sind mehr?", icon: "⚖️",
      neu: () => {
        const a = r(1, 9), b = Math.random() < 0.15 ? a : Math.max(1, Math.min(9, a + wahl([-1, 1]) * r(1, 4)));
        const da = wahl(DINGE), db = wahl(DINGE.filter(x => x !== da));
        // Pfeile, damit auch Kinder ohne Lesen wählen können
        const antwort = a > b ? "⬅️ links" : a < b ? "rechts ➡️" : "🟰 gleich viele";
        return { text: "", frage: "Wo sind mehr?", antwort, art: "wahl", optionen: ["⬅️ links", "🟰 gleich viele", "rechts ➡️"], bild: zweiGruppen(a, b, da, db), nurLuecke: true,
          hilfe: a === b ? `Links ${a} und rechts ${b}: gleich viele.` : `Links sind ${a}, rechts sind ${b}. ${Math.max(a, b)} ist mehr als ${Math.min(a, b)}.` };
      } },
    { id: "k1muster", stufe: "vs", lz: ["ma.ms.01", "ma.ms.02"], name: "Muster fortsetzen", icon: "🔁",
      neu: () => {
        const m = wahl(MUSTER), laenge = m.length * 2 + r(0, m.length - 1), reihe = Array.from({ length: laenge }, (_, i) => m[i % m.length]);
        const antwort = m[laenge % m.length];
        const optionen = mische([...new Set(m.concat(wahl(DINGE.filter(x => !m.includes(x)))))]).slice(0, 3);
        if (!optionen.includes(antwort)) optionen[0] = antwort;
        return { text: reihe.join(" ") + " ?", frage: "Was kommt als Nächstes?", antwort, art: "wahl", optionen: mische(optionen), nurLuecke: true,
          hilfe: `Das Muster ist ${m.join(" ")} – und dann geht es wieder von vorne los. Als Nächstes kommt ${antwort}.` };
      } },
    { id: "k1zwanzig", stufe: "1", lz: ["ma.zo.02"], name: "Zwanzigerfeld", icon: "🔴",
      neu: () => { const n = r(3, 20); return zahl("", n, n >= 10 ? `Eine volle Reihe sind 10. Dazu ${n - 10}: zusammen ${n}.` : n >= 5 ? `Fünf sind abgesetzt. 5 und ${n - 5} sind ${n}.` : `Zähle die roten Punkte: ${n}.`, { frage: "Wie viele rote Punkte?", bild: zwanzigerBild(n), nurLuecke: true }); } },
    { id: "k1nachbar", stufe: "1", lz: ["ma.zo.02", "ma.ms.02"], name: "Nachbarzahlen", icon: "↔️",
      neu: () => {
        const n = r(1, 19), vor = Math.random() < 0.5 && n > 1;
        return zahl(vor ? `? ${n}` : `${n} ?`, vor ? n - 1 : n + 1, vor ? `Die Zahl vor ${n} ist um eins kleiner: ${n - 1}.` : `Die Zahl nach ${n} ist um eins größer: ${n + 1}.`,
          { frage: vor ? `Welche Zahl kommt vor ${n}?` : `Welche Zahl kommt nach ${n}?`, nurLuecke: true });
      } },
    { id: "k1zerlegen", stufe: "1", lz: ["ma.zo.04"], name: "Zahlen zerlegen", icon: "✂️",
      neu: () => { const n = r(3, 10), a = r(1, n - 1); return zahl(`${n} = ${a} + ?`, n - a, `${a} rote und ${n - a} blaue Punkte sind zusammen ${n}.`, { bild: zwanzigerBild(a, n - a) }); } },
    { id: "k1plus10", stufe: "1", lz: ["ma.zo.03"], name: "Plus bis 10", icon: "+",
      neu: () => { const a = r(1, 8), b = r(1, 10 - a), d = wahl(DINGE), d2 = wahl(DINGE.filter(x => x !== d)); return zahl(`${a} + ${b}`, a + b, `Zähle weiter: ${a}, ${Array.from({ length: b }, (_, i) => a + i + 1).join(", ")}.`, { bild: mengeBild(a, d, 0, d2, b) }); } },
    { id: "k1minus10", stufe: "1", lz: ["ma.zo.03"], name: "Minus bis 10", icon: M,
      neu: () => { const a = r(2, 10), b = r(1, a - 1), d = wahl(DINGE); return zahl(`${a} ${M} ${b}`, a - b, `${b} ${b === 1 ? "ist" : "sind"} durchgestrichen. Zähle, was übrig bleibt: ${a - b}.`, { bild: mengeBild(a, d, b) }); } },
    { id: "k1doppelt", stufe: "1", lz: ["ma.zo.04"], name: "Verdoppeln", icon: "🦋",
      neu: () => {
        if (Math.random() < 0.6) { const n = r(1, 5); return zahl(`${n} + ${n}`, 2 * n, `Doppelt so viele: ${n} und noch einmal ${n} sind ${2 * n}.`, { frage: "Verdopple!", bild: wuerfelBild(n, n) }); }
        const n = r(1, 5) * 2; return zahl("", n / 2, `Die Hälfte von ${n}: ${n / 2} und ${n / 2} sind ${n}.`, { frage: `Wie viel ist die Hälfte von ${n}?`, bild: zwanzigerBild(n / 2, n / 2), nurLuecke: true });
      } }
  ];

  // ---------- Klasse 3 (NA-33, erster Schritt): ZR 1000, schriftlich addieren, Gewichte, Zeitspannen ----------
  function stellenBild(n) {
    const h = Math.floor(n / 100), z = Math.floor(n / 10) % 10, e = n % 10;
    let s = "", x = 6;
    for (let i = 0; i < h; i++) { s += `<rect x="${x}" y="6" width="56" height="56" fill="#7B9BFF" stroke="#3b1f63" stroke-width="2"/>`; x += 62; }
    for (let i = 0; i < z; i++) { s += `<rect x="${x}" y="6" width="10" height="56" fill="#5CCBA6" stroke="#2E7D62" stroke-width="2"/>`; x += 15; }
    for (let i = 0; i < e; i++) { s += `<rect x="${x}" y="52" width="10" height="10" fill="#FFB03B" stroke="#B5701A" stroke-width="2"/>`; x += 15; }
    return `<svg viewBox="0 0 ${Math.max(x, 60) + 6} 70" role="img" aria-label="Hunderter, Zehner und Einer">${s}</svg>`;
  }
  // ---------- Klasse 3, Schritt b: schriftlich rechnen, Würfelnetze, Spiegeln, Diagramme ----------
  const stellen = (n) => [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];
  // Stellenwerttafel H | Z | E mit zwei Zahlen, Rechenzeichen und leerer Ergebniszeile
  function schriftBild(a, b, zeichen) {
    const sp = [70, 120, 170], kopf = ["H", "Z", "E"], farbe = ["#7B9BFF", "#5CCBA6", "#FFB03B"];
    let s = sp.map((x, i) => `<rect x="${x - 22}" y="4" width="44" height="34" rx="6" fill="${farbe[i]}"/><text x="${x}" y="29" text-anchor="middle" font-size="22" font-weight="700" fill="#3b1f63">${kopf[i]}</text>`).join("");
    const zeile = (n, y) => stellen(n).map((d, i) => (n >= 100 || i > 0 || d > 0) ? `<text x="${sp[i]}" y="${y}" text-anchor="middle" font-size="30" fill="#3b1f63">${d}</text>` : "").join("");
    s += zeile(a, 76) + `<text x="24" y="116" text-anchor="middle" font-size="30" font-weight="700" fill="#3b1f63">${zeichen}</text>` + zeile(b, 116);
    s += `<line x1="10" y1="132" x2="196" y2="132" stroke="#3b1f63" stroke-width="3"/>`;
    s += sp.map(x => `<rect x="${x - 18}" y="140" width="36" height="40" rx="5" fill="none" stroke="#9b8bb5" stroke-width="2" stroke-dasharray="5 4"/>`).join("");
    return `<svg viewBox="0 0 206 188" role="img" aria-label="Stellenwerttafel mit Hundertern, Zehnern und Einern">${s}</svg>`;
  }
  function schriftPlusHilfe(a, b) {
    const x = stellen(a), y = stellen(b), name = ["Hunderter", "Zehner", "Einer"]; let ue = 0; const t = [];
    for (let i = 2; i >= 0; i--) { const s = x[i] + y[i] + ue;
      t.push(`${name[i]}: ${x[i]} + ${y[i]}${ue ? " + 1 (gemerkt)" : ""} = ${s}${s >= 10 && i > 0 ? ` – schreibe ${s % 10}, merke 1` : ""}.`); ue = s >= 10 ? 1 : 0; }
    return t.join(" ") + ` Ergebnis: ${a + b}.`;
  }
  // Verfahren stellt der Elternbereich ein (Schulen nutzen unterschiedliche): "abziehen" (Abziehen mit Entbündeln) oder "ergaenzen" (Ergänzen mit Erweitern)
  const minusVerfahren = () => { try { return ((window.Spielwelt && Spielwelt.lade("eltern")) || {}).mathe?.minus === "ergaenzen" ? "ergaenzen" : "abziehen"; } catch (e) { return "abziehen"; } };
  function schriftMinusHilfe(a, b) {
    const x = stellen(a), y = stellen(b), name = ["Hunderter", "Zehner", "Einer"]; const t = [];
    if (minusVerfahren() === "ergaenzen") {
      let merk = 0;
      for (let i = 2; i >= 0; i--) { const unten = y[i] + merk, oben = unten > x[i] ? x[i] + 10 : x[i];
        t.push(`${name[i]}: ${merk ? `${y[i]} + 1 (gemerkt) = ${unten}. ` : ""}Von ${unten} bis ${oben} ${oben - unten === 1 ? "ist" : "sind"} ${oben - unten}${oben > x[i] ? ` – schreibe ${oben - unten}, merke 1` : ""}.`);
        merk = oben > x[i] ? 1 : 0; }
      return t.join(" ") + ` Ergebnis: ${a - b}.`;
    }
    for (let i = 2; i >= 0; i--) {
      if (x[i] < y[i]) { x[i] += 10; x[i - 1] -= 1; t.push(`${name[i]}: ${x[i] - 10} ${M} ${y[i]} geht nicht. Tausche einen ${name[i - 1]} in 10 ${name[i]}: ${x[i]} ${M} ${y[i]} = ${x[i] - y[i]}.`); }
      else t.push(`${name[i]}: ${x[i]} ${M} ${y[i]} = ${x[i] - y[i]}.`);
    }
    return t.join(" ") + ` Ergebnis: ${a - b}.`;
  }

  // Würfelnetz-Prüfung: Netz auf einen Würfel klappen; gültig, wenn die 6 Felder auf 6 verschiedenen Seiten landen
  function istWuerfelnetz(zellen) {
    const key = (z) => z[0] + "," + z[1], da = new Set(zellen.map(key));
    if (da.size !== 6) return false;
    const neg = (v) => v.map(x => -x), start = zellen[0], seiten = new Set(), besucht = new Map();
    const stapel = [[start, [0, 0, 1], [1, 0, 0], [0, 1, 0]]]; besucht.set(key(start), true);
    while (stapel.length) {
      const [z, n, u, v] = stapel.pop(); seiten.add(n.join(","));
      const nach = [[[z[0], z[1] + 1], u, neg(n), v], [[z[0], z[1] - 1], neg(u), n, v], [[z[0] + 1, z[1]], v, u, neg(n)], [[z[0] - 1, z[1]], neg(v), u, n]];
      for (const [nz, nn, nu, nv] of nach) if (da.has(key(nz)) && !besucht.has(key(nz))) { besucht.set(key(nz), true); stapel.push([nz, nn, nu, nv]); }
    }
    return besucht.size === 6 && seiten.size === 6;
  }
  function zufallsNetz() { // zusammenhängende Form aus 6 Kästchen
    const z = [[2, 2]], da = new Set(["2,2"]);
    while (z.length < 6) { const [a, b] = wahl(z), d = wahl([[0, 1], [0, -1], [1, 0], [-1, 0]]), n = [a + d[0], b + d[1]];
      if (da.has(n.join(","))) continue; da.add(n.join(",")); z.push(n); }
    const r0 = Math.min(...z.map(p => p[0])), c0 = Math.min(...z.map(p => p[1]));
    return z.map(p => [p[0] - r0, p[1] - c0]);
  }
  function netzBild(zellen) {
    const g = 36, zeilen = Math.max(...zellen.map(p => p[0])) + 1, spalten = Math.max(...zellen.map(p => p[1])) + 1;
    const s = zellen.map(p => `<rect x="${4 + p[1] * g}" y="${4 + p[0] * g}" width="${g}" height="${g}" fill="#FFD36B" stroke="#3b1f63" stroke-width="2.5"/>`).join("");
    return `<svg viewBox="0 0 ${spalten * g + 8} ${zeilen * g + 8}" style="max-height:220px" role="img" aria-label="Form aus sechs Quadraten">${s}</svg>`;
  }

  // Spiegelbild: 6 Spalten × 5 Zeilen, Spiegelachse in der Mitte; fehlt = Felder rechts, die noch leer sind
  function spiegelBild(links, rechts) {
    const g = 30, Z = 5; let s = "";
    for (let zi = 0; zi < Z; zi++) for (let sp = 0; sp < 6; sp++) {
      const voll = sp < 3 ? links[zi][sp] : rechts[zi][sp - 3];
      s += `<rect x="${4 + sp * g}" y="${4 + zi * g}" width="${g}" height="${g}" fill="${voll ? "#7B9BFF" : "#fff"}" stroke="#c9bfe0" stroke-width="1.5"/>`;
    }
    s += `<line x1="${4 + 3 * g}" y1="0" x2="${4 + 3 * g}" y2="${Z * g + 8}" stroke="#E5484D" stroke-width="4" stroke-dasharray="8 5"/>`;
    return `<svg viewBox="0 0 ${6 * g + 8} ${Z * g + 8}" style="max-height:200px" role="img" aria-label="Muster mit roter Spiegelachse">${s}</svg>`;
  }

  // Säulendiagramm; fehlt = Index der Säule, die noch nicht gezeichnet ist
  function saeulenBild(kat, werte, fehlt = -1, strich = -1) {
    const g = 18, h = 10 * g, b = 44, x0 = 30; let s = "";
    for (let i = 0; i <= 10; i++) s += `<line x1="${x0}" y1="${8 + h - i * g}" x2="${x0 + kat.length * (b + 14) + 4}" y2="${8 + h - i * g}" stroke="#e3dcef" stroke-width="1"/>` +
      (i % 2 === 0 ? `<text x="${x0 - 6}" y="${13 + h - i * g}" text-anchor="end" font-size="13" fill="#3b1f63">${i}</text>` : "");
    kat.forEach((k, i) => { const x = x0 + 10 + i * (b + 14);
      if (i !== fehlt) s += `<rect x="${x}" y="${8 + h - werte[i] * g}" width="${b}" height="${werte[i] * g}" fill="${["#7B9BFF", "#5CCBA6", "#FFB03B", "#F27BAA"][i]}" stroke="#3b1f63" stroke-width="1.5"/>`;
      else s += `<rect x="${x}" y="${8 + h - 1}" width="${b}" height="2" fill="#3b1f63"/><text x="${x + b / 2}" y="${h - 4}" text-anchor="middle" font-size="26" fill="#9b8bb5">?</text>`;
      s += `<text x="${x + b / 2}" y="${h + 40}" text-anchor="middle" font-size="26">${k}</text>`; });
    s += `<line x1="${x0}" y1="8" x2="${x0}" y2="${8 + h}" stroke="#3b1f63" stroke-width="2"/><line x1="${x0}" y1="${8 + h}" x2="${x0 + kat.length * (b + 14) + 4}" y2="${8 + h}" stroke="#3b1f63" stroke-width="2"/>`;
    let w = x0 + kat.length * (b + 14) + 10;
    if (strich >= 0) { // Strichliste für die fehlende Säule
      let t = "", x = w + 14; const n = werte[strich];
      for (let i = 0; i < n; i++) { const grp = Math.floor(i / 5), pos = i % 5, gx = x + grp * 46;
        t += pos < 4 ? `<line x1="${gx + pos * 9}" y1="70" x2="${gx + pos * 9}" y2="110" stroke="#3b1f63" stroke-width="3" stroke-linecap="round"/>`
                     : `<line x1="${gx - 5}" y1="104" x2="${gx + 33}" y2="76" stroke="#3b1f63" stroke-width="3" stroke-linecap="round"/>`; }
      s += `<text x="${x + 40}" y="52" text-anchor="middle" font-size="26">${kat[strich]}</text>` + t; w += 110;
    }
    return `<svg viewBox="0 0 ${w} ${h + 52}" style="max-height:240px" role="img" aria-label="Säulendiagramm">${s}</svg>`;
  }
  // [Thema, Bilder, Namen, Frage „wie viele“, Frage „wie viele mehr“, Frage „am meisten“]
  const UMFRAGEN = [["Lieblingstier", ["🐶", "🐱", "🐰", "🐦"], ["Hund", "Katze", "Hase", "Vogel"], (a) => `Wie viele Kinder haben ${a} gewählt?`, (a, b) => `Wie viele Kinder mehr haben ${a} gewählt als ${b}?`, "Welches Tier haben die meisten gewählt?"],
    ["Lieblingsobst", ["🍎", "🍌", "🍓", "🍐"], ["Apfel", "Banane", "Erdbeere", "Birne"], (a) => `Wie viele Kinder haben ${a} gewählt?`, (a, b) => `Wie viele Kinder mehr haben ${a} gewählt als ${b}?`, "Welches Obst haben die meisten gewählt?"],
    ["Wetter im Monat", ["☀️", "☁️", "🌧️", "❄️"], ["Sonne", "Wolken", "Regen", "Schnee"], (a) => `An wie vielen Tagen gab es ${a}?`, (a, b) => `An wie vielen Tagen mehr gab es ${a} als ${b}?`, "Welches Wetter gab es am häufigsten?"]];

  // ---------- Klasse 3/4: Flächen, große Zahlen, Gewinnchancen (NA-33 Rest, NA-37) ----------
  const tausend = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); // 345678 → „345 678“
  function kaestchenBild(zellen, rand = false) {
    const g = 30, zr = Math.max(...zellen.map(p => p[0])) + 1, sp = Math.max(...zellen.map(p => p[1])) + 1; let s = "";
    for (let i = 0; i <= zr + 1; i++) for (let j = 0; j <= sp + 1; j++) s += `<rect x="${4 + j * g}" y="${4 + i * g}" width="${g}" height="${g}" fill="#fff" stroke="#e3dcef" stroke-width="1"/>`;
    s += zellen.map(p => `<rect x="${4 + (p[1] + 1) * g}" y="${4 + (p[0] + 1) * g}" width="${g}" height="${g}" fill="#5CCBA6" stroke="${rand ? "#5CCBA6" : "#2E7D62"}" stroke-width="1.5"/>`).join("");
    if (rand) s += `<rect x="${4 + g}" y="${4 + g}" width="${sp * g}" height="${zr * g}" fill="none" stroke="#3b1f63" stroke-width="4"/>`;
    return `<svg viewBox="0 0 ${(sp + 2) * g + 8} ${(zr + 2) * g + 8}" style="max-height:220px" role="img" aria-label="Fläche aus Kästchen">${s}</svg>`;
  }
  function formAus(n) { const z = [[0, 0]], da = new Set(["0,0"]);
    while (z.length < n) { const [a, b] = wahl(z), d = wahl([[0, 1], [0, -1], [1, 0], [-1, 0]]), m = [a + d[0], b + d[1]];
      if (m[0] < 0 || m[1] < 0 || m[0] > 3 || m[1] > 5 || da.has(m.join(","))) continue; da.add(m.join(",")); z.push(m); }
    return z; }
  function kugelBild(farben) { // farben: [["#E5484D", n], ...]
    let s = "", i = 0; farben.forEach(([f, n]) => { for (let k = 0; k < n; k++, i++) s += `<circle cx="${30 + (i % 6) * 40}" cy="${30 + Math.floor(i / 6) * 40}" r="16" fill="${f}" stroke="#3b1f63" stroke-width="2"/>`; });
    return `<svg viewBox="0 0 250 ${30 + Math.ceil(i / 6) * 40}" style="max-height:170px" role="img" aria-label="Kugeln in einem Beutel">${s}</svg>`;
  }
  function malSchriftHilfe(a, b) { const x = stellen(a), name = ["Hunderter", "Zehner", "Einer"]; let ue = 0; const t = [];
    for (let i = 2; i >= 0; i--) { const p = x[i] * b + ue; t.push(`${name[i]}: ${b} · ${x[i]}${ue ? ` + ${ue} (gemerkt)` : ""} = ${p}${i > 0 && p >= 10 ? ` – schreibe ${p % 10}, merke ${Math.floor(p / 10)}` : ""}.`); ue = Math.floor(p / 10); }
    return t.join(" ") + ` Ergebnis: ${a * b}.`; }

  // Schema der schriftlichen Multiplikation: Aufgabe oben, je Stelle des zweiten Faktors eine leere Zeile (eingerückt), Strich, Ergebniszeile
  function malMehrBild(a, b) {
    const zeilen = String(b).length, breite = String(a * b).length + 1, g = 24, w = (String(a).length + String(b).length + 3) * g, x0 = Math.max(w, (breite + 1) * g) + 10;
    let s = `<text x="${x0 - 6}" y="30" text-anchor="end" font-size="26" fill="#3b1f63" font-family="monospace">${a} · ${b}</text><line x1="10" y1="42" x2="${x0}" y2="42" stroke="#3b1f63" stroke-width="2.5"/>`;
    for (let i = 0; i < zeilen; i++) { const rechts = x0 - 6 - (zeilen - 1 - i) * g;
      for (let k = 0; k < String(a).length + 1; k++) s += `<rect x="${rechts - (k + 1) * g + 2}" y="${52 + i * 34}" width="${g - 4}" height="28" rx="4" fill="none" stroke="#9b8bb5" stroke-width="1.5" stroke-dasharray="4 3"/>`; }
    const yl = 56 + zeilen * 34;
    s += `<line x1="10" y1="${yl}" x2="${x0}" y2="${yl}" stroke="#3b1f63" stroke-width="2.5"/>`;
    for (let k = 0; k < breite; k++) s += `<rect x="${x0 - 6 - (k + 1) * g + 2}" y="${yl + 8}" width="${g - 4}" height="30" rx="4" fill="none" stroke="#3b1f63" stroke-width="1.5" stroke-dasharray="4 3"/>`;
    return `<svg viewBox="0 0 ${x0 + 10} ${yl + 46}" style="max-height:230px" role="img" aria-label="Schema für schriftliches Malnehmen">${s}</svg>`;
  }

  const STATIONEN_K3 = [
    { id: "k3stellen", stufe: "3", lz: ["ma.zo.12"], name: "Zahlen bis 1000", icon: "💯",
      neu: () => { const n = r(101, 999); return zahl("", n, `${Math.floor(n / 100)} Hunderter, ${Math.floor(n / 10) % 10} Zehner und ${n % 10} Einer sind ${n}.`, { frage: "Welche Zahl ist das?", bild: stellenBild(n), nurLuecke: true }); } },
    { id: "k3runden", stufe: "3", lz: ["ma.zo.12"], name: "Runden", icon: "≈",
      neu: () => { const n = r(101, 989), z = Math.round(n / 10) * 10; return zahl("", z, `Schau auf die Einer: ${n % 10}. ${n % 10 >= 5 ? "Ab 5 wird aufgerundet" : "Unter 5 wird abgerundet"} → ${z}.`, { frage: `Runde ${n} auf Zehner.`, nurLuecke: true }); } },
    { id: "k3plus", stufe: "3", lz: ["ma.zo.13"], name: "Plus bis 1000", icon: "+",
      neu: () => { const a = r(120, 600), b = r(110, 999 - a); return zahl(`${a} + ${b}`, a + b, `Erst die Hunderter: ${Math.floor(a / 100) * 100} + ${Math.floor(b / 100) * 100}. Dann Zehner und Einer dazu. Ergebnis: ${a + b}.`); } },
    { id: "k3minus", stufe: "3", lz: ["ma.zo.13"], name: "Minus bis 1000", icon: M,
      neu: () => { const a = r(300, 999), b = r(110, a - 50); return zahl(`${a} ${M} ${b}`, a - b, `Erst die Hunderter abziehen: ${a} ${M} ${Math.floor(b / 100) * 100} = ${a - Math.floor(b / 100) * 100}. Dann den Rest: ${a - b}.`); } },
    { id: "k3gewicht", stufe: "3", lz: ["ma.gm.08"], name: "Gramm und Kilogramm", icon: "⚖️",
      neu: () => {
        if (Math.random() < 0.5) { const kg = r(1, 9); return zahl("", kg * 1000, `1 kg sind 1000 g. ${kg} kg sind ${kg * 1000} g.`, { frage: `Wie viel Gramm sind ${kg} kg?`, einheit: "g", nurLuecke: true, max: 7 }); }
        const d = wahl([["eine Feder", "g"], ["ein Apfel", "g"], ["ein Fahrrad", "kg"], ["ein Hund", "kg"], ["ein Brief", "g"], ["ein Kind", "kg"]]);
        return { text: "", frage: `Wiegt man ${d[0]} eher in g oder in kg?`, antwort: d[1], art: "wahl", optionen: ["g", "kg"], nurLuecke: true,
          hilfe: d[1] === "g" ? `${d[0]} ist leicht – man wiegt in Gramm.` : `${d[0]} ist schwer – man wiegt in Kilogramm.` };
      } },
    { id: "k3zeit", stufe: "3", lz: ["ma.gm.08"], name: "Zeitspannen", icon: "⏱️",
      neu: () => { const h = r(7, 16), m = wahl([0, 15, 30, 45]), d = wahl([15, 30, 45, 60, 90]), e = h * 60 + m + d;
        const t = (x) => `${Math.floor(x / 60)}:${String(x % 60).padStart(2, "0")}`;
        return zahl("", d, `Von ${t(h * 60 + m)} bis ${t(e)} Uhr: zähle die Minuten weiter. Das sind ${d} Minuten.`, { frage: `Der Film beginnt um ${t(h * 60 + m)} Uhr und endet um ${t(e)} Uhr. Wie viele Minuten dauert er?`, einheit: "min", nurLuecke: true }); } },
    { id: "k3rest", stufe: "3", lz: ["ma.zo.11"], name: "Teilen mit Rest", icon: "÷",
      neu: () => { const b = r(3, 9), q = r(2, 9), rest = r(1, b - 1), a = b * q + rest;
        return zahl(`${a} : ${b} = ${q} Rest ?`, rest, `${q} · ${b} = ${q * b}. Bis ${a} fehlen noch ${rest}. Das ist der Rest.`); } },
    { id: "k3bruch", stufe: "3", lz: ["ma.zo.14"], name: "Hälfte und Viertel", icon: "½",
      neu: () => { const art = wahl([["die Hälfte", 2], ["ein Viertel", 4], ["drei Viertel", 4]]), n = art[1] * r(2, 25), teil = n / art[1], erg = art[0] === "drei Viertel" ? teil * 3 : teil;
        return zahl("", erg, `${n} : ${art[1]} = ${teil}${art[0] === "drei Viertel" ? `, dreimal so viel: ${erg}` : ""}.`, { frage: `Wie viel ist ${art[0]} von ${n}?`, nurLuecke: true }); } },
    { id: "k3laenge", stufe: "3", lz: ["ma.gm.05", "ma.gm.09"], name: "Meter und Kilometer", icon: "🛣️",
      neu: () => {
        if (Math.random() < 0.5) { const km = r(1, 9); return zahl("", km * 1000, `1 km sind 1000 m. ${km} km sind ${km * 1000} m.`, { frage: `Wie viele Meter sind ${km} km?`, einheit: "m", nurLuecke: true, max: 7 }); }
        const d = wahl([["der Weg zur Nachbarstadt", "km"], ["die Länge eines Klassenzimmers", "m"], ["die Höhe eines Hauses", "m"], ["eine Fahrt mit dem Zug", "km"], ["ein Lauf um den Sportplatz", "m"]]);
        return { text: "", frage: `Misst man ${d[0]} eher in m oder in km?`, antwort: d[1], art: "wahl", optionen: ["m", "km"], nurLuecke: true,
          hilfe: d[1] === "km" ? `${d[0]} ist sehr lang – man misst in Kilometern.` : `${d[0]} – das misst man in Metern.` };
      } },
    { id: "k3geld", stufe: "3", lz: ["ma.gm.04", "ma.zo.18", "ma.pk.04"], name: "Einkaufen", icon: "🛒",
      neu: () => { const n = wahl(NAMEN), d = wahl([["Hefte", 2], ["Stifte", 3], ["Äpfel", 1], ["Brötchen", 1], ["Bücher", 8]]), k = r(2, 6);
        const kosten = k * d[1], schein = kosten < 20 ? wahl([20, 50]) : 50;
        return zahl("", schein - kosten, `${k} ${d[0]} kosten ${k} · ${d[1]} € = ${kosten} €. ${schein} € ${M} ${kosten} € = ${schein - kosten} €.`,
          { frage: `${n} kauft ${k} ${d[0]} für je ${d[1]} € und bezahlt mit ${schein} €. Wie viel Geld bekommt ${n} zurück?`, einheit: "€", nurLuecke: true }); } },
    { id: "k3kombi", stufe: "3", lz: ["ma.dz.05"], name: "Kombinieren", icon: "👕",
      neu: () => { const n = wahl(NAMEN), d = wahl([["T-Shirts", "Hosen"], ["Eissorten", "Waffeln"], ["Brotsorten", "Beläge"], ["Mützen", "Schals"]]), a = r(2, 5), b = r(2, 4);
        return zahl("", a * b, `Zu jedem der ${a} ${d[0]} passen ${b} ${d[1]}: ${Array.from({ length: a }, () => b).join(" + ")} = ${a * b}.`,
          { frage: `${n} hat ${a} ${d[0]} und ${b} ${d[1]}. Wie viele verschiedene Paare kann ${n} bilden?`, nurLuecke: true }); } },
    { id: "k3sach", stufe: "3", lz: ["ma.zo.11", "ma.pk.04"], name: "Mal und geteilt im Alltag", icon: "📦",
      neu: () => { const n = wahl(NAMEN), k = r(3, 9), j = r(3, 9);
        if (Math.random() < 0.5) return zahl("", k * j, `${k} Kisten mit je ${j} Äpfeln: ${k} · ${j} = ${k * j}.`, { frage: `${n} trägt ${k} Kisten. In jeder Kiste sind ${j} Äpfel. Wie viele Äpfel sind es zusammen?`, nurLuecke: true });
        return zahl("", j, `${k * j} Sticker gerecht auf ${k} Kinder verteilt: ${k * j} : ${k} = ${j}.`, { frage: `${n} verteilt ${k * j} Sticker gerecht an ${k} Kinder. Wie viele bekommt jedes Kind?`, nurLuecke: true }); } },
    { id: "k3schriftplus", stufe: "3", lz: ["ma.zo.13"], name: "Schriftlich plus", icon: "🧮",
      neu: () => { let a, b; do { a = r(105, 789); b = r(102, 999 - a); } while (b < 100 || (Math.random() < 0.7 && (a % 10) + (b % 10) < 10 && (Math.floor(a / 10) % 10) + (Math.floor(b / 10) % 10) < 10));
        return zahl("", a + b, schriftPlusHilfe(a, b), { frage: "Rechne schriftlich: Fang bei den Einern an.", bild: schriftBild(a, b, "+"), nurLuecke: true }); } },
    { id: "k3schriftminus", stufe: "3", lz: ["ma.zo.13"], name: "Schriftlich minus", icon: "🧾",
      neu: () => { let a, b, x, y; do { a = r(300, 999); b = r(101, a - 100); x = stellen(a); y = stellen(b); }
        while ((x[2] < y[2] && x[1] === 0) || (x[1] - (x[2] < y[2] ? 1 : 0) < y[1] && x[0] - 1 < y[0]) || (Math.random() < 0.6 && x[2] >= y[2] && x[1] >= y[1]));
        return zahl("", a - b, schriftMinusHilfe(a, b), { frage: "Rechne schriftlich: Fang bei den Einern an.", bild: schriftBild(a, b, M), nurLuecke: true }); } },
    { id: "k3netz", stufe: "3", lz: ["ma.rf.07"], name: "Würfelnetze", icon: "🎲",
      neu: () => { const soll = Math.random() < 0.5; let z; do z = zufallsNetz(); while (istWuerfelnetz(z) !== soll);
        return { text: "", frage: "Kann man aus dieser Form einen Würfel falten?", antwort: soll ? "ja" : "nein", art: "wahl", optionen: ["ja", "nein"], nurLuecke: true, bild: netzBild(z),
          hilfe: soll ? "Ja: Beim Falten landet jedes Quadrat auf einer anderen Würfelseite – alle 6 Seiten sind da." : "Nein: Beim Falten würden zwei Quadrate auf derselben Würfelseite liegen, eine Seite bliebe offen." }; } },
    { id: "k3spiegel", stufe: "3", lz: ["ma.rf.05", "ma.rf.07"], name: "Spiegeln", icon: "🪞",
      neu: () => {
        const links = Array.from({ length: 5 }, () => Array.from({ length: 3 }, () => Math.random() < 0.45));
        if (links.flat().filter(Boolean).length < 3) links[r(0, 4)][2] = links[r(0, 4)][1] = links[r(0, 4)][0] = true;
        const spiegel = links.map(z => z.slice().reverse());
        if (Math.random() < 0.5) { // Wie viele Kästchen fehlen noch?
          const voll = []; spiegel.forEach((z, i) => z.forEach((v, j) => v && voll.push([i, j])));
          const weg = mische(voll).slice(0, r(1, Math.min(4, voll.length))), rechts = spiegel.map(z => z.slice());
          weg.forEach(([i, j]) => { rechts[i][j] = false; });
          return zahl("", weg.length, `Vergleiche Zeile für Zeile: Jedes blaue Kästchen links braucht rechts einen Partner im gleichen Abstand zur roten Linie. Es fehlen ${weg.length}.`,
            { frage: "Die rote Linie ist ein Spiegel. Wie viele Kästchen musst du rechts noch anmalen?", bild: spiegelBild(links, rechts), nurLuecke: true });
        }
        const soll = Math.random() < 0.5, rechts = spiegel.map(z => z.slice());
        if (!soll) { const i = r(0, 4), j = r(0, 2); rechts[i][j] = !rechts[i][j]; }
        return { text: "", frage: "Ist das Muster spiegelgleich zur roten Linie?", antwort: soll ? "ja" : "nein", art: "wahl", optionen: ["ja", "nein"], nurLuecke: true, bild: spiegelBild(links, rechts),
          hilfe: soll ? "Ja: Jedes Kästchen hat auf der anderen Seite einen Partner im gleichen Abstand zur Linie." : "Nein: Mindestens ein Kästchen hat auf der anderen Seite keinen passenden Partner." };
      } },
    { id: "k3diagramm", stufe: "3", lz: ["ma.dz.03", "ma.dz.06"], name: "Diagramme", icon: "📊",
      neu: () => { const [thema, kat, namen, fWie, fMehr, fMeist] = wahl(UMFRAGEN), werte = kat.map(() => r(1, 10)), art = r(0, 3);
        if (art === 0) { const i = r(0, 3); // Diagramm erstellen: Strichliste zählen
          return zahl("", werte[i], `Zähle die Striche: Jede Fünfergruppe hat einen Querstrich. Das sind ${werte[i]} – so hoch wird die Säule.`,
            { frage: `${thema}: Die Säule für ${namen[i]} fehlt noch. Wie hoch musst du sie zeichnen?`, bild: saeulenBild(kat, werte, i, i), nurLuecke: true }); }
        if (art === 1) { const i = r(0, 3);
          return zahl("", werte[i], `Folge der Säule ${kat[i]} bis oben und lies links die Zahl ab: ${werte[i]}.`, { frage: `${thema}: ${fWie(namen[i])}`, bild: saeulenBild(kat, werte), nurLuecke: true }); }
        if (art === 2) { let i = r(0, 3), j = r(0, 3); while (werte[i] === werte[j]) { werte[i] = r(1, 10); j = (i + 1 + r(0, 2)) % 4; } if (werte[i] < werte[j]) [i, j] = [j, i];
          return zahl("", werte[i] - werte[j], `${namen[i]}: ${werte[i]}, ${namen[j]}: ${werte[j]}. ${werte[i]} ${M} ${werte[j]} = ${werte[i] - werte[j]}.`, { frage: `${thema}: ${fMehr(namen[i], namen[j])}`, bild: saeulenBild(kat, werte), nurLuecke: true }); }
        const max = Math.max(...werte), sieger = werte.indexOf(max); werte.forEach((w, k) => { if (k !== sieger && w === max) werte[k] = max - 1; });
        return { text: "", frage: `${thema}: ${fMeist}`, antwort: kat[sieger], art: "wahl", optionen: kat.slice(), nurLuecke: true, bild: saeulenBild(kat, werte),
          hilfe: `Die höchste Säule gewinnt: ${namen[sieger]} mit ${werte[sieger]}.` }; } },
    { id: "k3flaeche", stufe: "3", lz: ["ma.rf.08"], name: "Flächen vergleichen", icon: "🟩",
      neu: () => { const n = r(5, 13), z = formAus(n);
        return zahl("", n, `Zähle jedes grüne Kästchen genau einmal, am besten Reihe für Reihe. Die Fläche ist ${n} Kästchen groß.`,
          { frage: "Wie viele Kästchen groß ist die grüne Fläche?", bild: kaestchenBild(z), nurLuecke: true }); } }
  ];

  // ---------- Klasse 4 (NA-37): Zahlen bis 1 Million, schriftlich mal und geteilt, Teilbarkeit, Hohlmaße, Flächen, Chancen ----------
  const STATIONEN_K4 = [
    { id: "k4million", stufe: "4", lz: ["ma.zo.15"], name: "Zahlen bis 1 Million", icon: "🔢",
      neu: () => { const n = r(100000, 999999), st = wahl([["Hunderttausender", 100000], ["Zehntausender", 10000], ["Tausender", 1000], ["Hunderter", 100]]), d = Math.floor(n / st[1]) % 10;
        if (Math.random() < 0.5) return zahl("", d, `${tausend(n)}: Von rechts gelesen Einer, Zehner, Hunderter, Tausender, Zehntausender, Hunderttausender. An der ${st[0]}stelle steht ${d}.`, { frage: `Welche Ziffer steht in ${tausend(n)} an der ${st[0]}stelle?`, nurLuecke: true });
        const schritt = wahl([1, 10, 100, 1000]), m = Math.ceil(r(20000, 989999) / (schritt * 10)) * schritt * 10;
        return zahl("", m, `Eins weiter in ${schritt === 1 ? "Einern" : schritt + "er-Schritten"}: ${tausend(m - schritt)} + ${schritt} = ${tausend(m)}.`, { frage: `Welche Zahl kommt nach ${tausend(m - schritt)}, wenn du in ${schritt === 1 ? "Einer" : schritt + "er"}-Schritten zählst?`, nurLuecke: true, max: 7 }); } },
    { id: "k4runden", stufe: "4", lz: ["ma.zo.15", "ma.zo.16"], name: "Runden und Überschlagen", icon: "≈",
      neu: () => { if (Math.random() < 0.5) { const n = r(10000, 989999), z = Math.round(n / 1000) * 1000;
          return zahl("", z, `Schau auf die Hunderter: ${Math.floor(n / 100) % 10}. ${Math.floor(n / 100) % 10 >= 5 ? "Ab 5 wird aufgerundet" : "Unter 5 wird abgerundet"} → ${tausend(z)}.`, { frage: `Runde ${tausend(n)} auf Tausender.`, nurLuecke: true, max: 7 }); }
        const a = r(110, 590), b = r(110, 390), ra = Math.round(a / 100) * 100, rb = Math.round(b / 100) * 100;
        return zahl("", ra + rb, `Erst runden: ${a} ≈ ${ra}, ${b} ≈ ${rb}. Dann rechnen: ${ra} + ${rb} = ${ra + rb}. Das genaue Ergebnis (${a + b}) liegt in der Nähe.`, { frage: `Überschlage auf Hunderter: ${a} + ${b} ≈ ?`, nurLuecke: true, max: 7 }); } },
    { id: "k4malschrift", stufe: "4", lz: ["ma.zo.16"], name: "Schriftlich mal", icon: "✖️",
      neu: () => { const b = r(3, 9), a = r(112, 999);
        return zahl(`${a} · ${b}`, a * b, malSchriftHilfe(a, b), { frage: "Rechne schriftlich: Fang bei den Einern an.", max: 7 }); } },
    { id: "k4geteilt", stufe: "4", lz: ["ma.zo.16"], name: "Schriftlich geteilt", icon: "➗",
      neu: () => { const b = r(2, 9), q = r(Math.ceil(100 / b) + 1, Math.floor(999 / b)), a = q * b, x = stellen(a);
        let rest = 0; const t = [];
        x.forEach((d, i) => { const z = rest * 10 + d, e = Math.floor(z / b); rest = z - e * b; if (i === 0 && e === 0) { t.push(`${d} : ${b} geht nicht, nimm die nächste Stelle dazu.`); return; } t.push(`${z} : ${b} = ${e}${rest ? `, Rest ${rest}` : ""}.`); });
        return zahl(`${a} : ${b}`, q, t.join(" ") + ` Ergebnis: ${q}. Probe: ${q} · ${b} = ${a}.`, { frage: "Teile schriftlich von links nach rechts.", max: 7 }); } },
    { id: "k4teilbar", stufe: "4", lz: ["ma.zo.17"], name: "Teilbar?", icon: "🔍",
      // Teilbarkeitsregeln für 2, 3, 4, 5, 6, 9, 10 und 100 (Sachsen 2025: 2/3/5/9/10/100 in Kl. 3, 4 und 6 in Kl. 4)
      neu: () => { const t = wahl([2, 3, 4, 5, 6, 9, 10, 100]), soll = Math.random() < 0.5; let n;
        do n = t === 100 && soll ? 100 * r(1, 9) + (Math.random() < 0.5 ? 0 : 1000 * r(1, 8)) : r(100, 999); while ((n % t === 0) !== soll);
        const z = String(n).split(""), qs = z.reduce((x, y) => x + +y, 0), zwei = n % 100;
        const regel = { 2: `Durch 2 teilbar sind gerade Zahlen (letzte Ziffer 0, 2, 4, 6, 8). ${n} endet auf ${n % 10}.`,
          5: `Durch 5 teilbar ist eine Zahl mit 0 oder 5 am Ende. ${n} endet auf ${n % 10}.`, 10: `Durch 10 teilbar ist eine Zahl mit 0 am Ende. ${n} endet auf ${n % 10}.`,
          100: `Durch 100 teilbar ist eine Zahl mit 00 am Ende. ${n} endet auf ${String(zwei).padStart(2, "0")}.`,
          3: `Rechne die Quersumme: ${z.join(" + ")} = ${qs}. Ist sie durch 3 teilbar, dann auch die Zahl.`,
          9: `Rechne die Quersumme: ${z.join(" + ")} = ${qs}. Ist sie durch 9 teilbar, dann auch die Zahl.`,
          4: `Schau auf die letzten beiden Ziffern: ${String(zwei).padStart(2, "0")}. Ist diese Zahl durch 4 teilbar, dann auch ${n}.`,
          6: `Durch 6 teilbar ist eine Zahl, die durch 2 und durch 3 teilbar ist. ${n} ist ${n % 2 ? "ungerade" : "gerade"}, Quersumme ${qs}${qs % 3 ? " (nicht durch 3)" : " (durch 3)"}.` }[t];
        return { text: "", frage: `Ist ${n} durch ${t} teilbar?`, antwort: soll ? "ja" : "nein", art: "wahl", optionen: ["ja", "nein"], nurLuecke: true, hilfe: regel + (soll ? " Also ja." : " Also nein.") }; } },
    { id: "k4geschickt", stufe: "4", lz: ["ma.zo.17"], name: "Geschickt rechnen", icon: "💡",
      neu: () => { const art = r(0, 2);
        if (art === 0) { const [x, y] = wahl([[25, 4], [5, 2], [20, 5], [50, 2]]), z = r(3, 9); return zahl(`${x} · ${z} · ${y}`, x * y * z, `Tausche die Faktoren: ${x} · ${y} = ${x * y}, dann ${x * y} · ${z} = ${x * y * z}.`, { max: 7 }); }
        if (art === 1) { const c = r(110, 480), s1 = r(21, 79), s2 = 100 - s1; return zahl(`${s1} + ${c} + ${s2}`, s1 + s2 + c, `Erst die Partner zu 100: ${s1} + ${s2} = 100. Dann 100 + ${c} = ${100 + c}.`, { max: 7 }); }
        const a = r(3, 9), b = r(11, 19); return zahl(`${a} · ${b}`, a * b, `Zerlege: ${a} · 10 = ${a * 10} und ${a} · ${b - 10} = ${a * (b - 10)}. Zusammen ${a * b}.`); } },
    { id: "k4liter", stufe: "4", lz: ["ma.gm.09"], name: "Liter und Milliliter", icon: "🧃",
      neu: () => { if (Math.random() < 0.5) { const l = r(1, 9), halb = Math.random() < 0.3; const ml = l * 1000 + (halb ? 500 : 0);
          return zahl("", ml, `1 l sind 1000 ml. ${l}${halb ? ",5" : ""} l sind ${ml} ml.`, { frage: `Wie viele Milliliter sind ${l}${halb ? ",5" : ""} l?`, einheit: "ml", nurLuecke: true, max: 7 }); }
        const d = wahl([["ein Löffel Saft", "ml"], ["eine Badewanne voll Wasser", "l"], ["ein Glas Milch", "ml"], ["ein Eimer Wasser", "l"], ["eine Flasche Medizin-Tropfen", "ml"], ["ein Aquarium", "l"]]);
        return { text: "", frage: `Misst man ${d[0]} eher in ml oder in l?`, antwort: d[1], art: "wahl", optionen: ["ml", "l"], nurLuecke: true,
          hilfe: (d[1] === "l" ? `${d[0]} – das ist viel, man misst in Litern.` : `${d[0]} – das ist wenig, man misst in Millilitern.`).replace(/^./, c => c.toUpperCase()) }; } },
    { id: "k4flaeche", stufe: "4", lz: ["ma.rf.09", "ma.rf.08"], name: "Flächeninhalt und Umfang", icon: "📐",
      neu: () => { const a = r(2, 6), b = r(2, 4), z = []; for (let i = 0; i < b; i++) for (let j = 0; j < a; j++) z.push([i, j]);
        if (Math.random() < 0.5) return zahl("", a * b, `${b} Reihen mit je ${a} Kästchen: ${b} · ${a} = ${a * b}. Der Flächeninhalt ist ${a * b} Kästchen.`, { frage: "Wie viele Kästchen hat das Rechteck? (Flächeninhalt)", bild: kaestchenBild(z, true), nurLuecke: true });
        return zahl("", 2 * (a + b), `Lauf einmal um den Rand: ${a} + ${b} + ${a} + ${b} = ${2 * (a + b)} Kästchenlängen.`, { frage: "Wie viele Kästchenlängen ist der dicke Rand lang? (Umfang)", bild: kaestchenBild(z, true), nurLuecke: true }); } },
    { id: "k4chance", stufe: "4", lz: ["ma.dz.07"], name: "Gewinnchancen", icon: "🎲",
      neu: () => { const rot = r(1, 7), blau = r(1, 7); if (rot === blau) return { text: "", frage: `Im Beutel liegen Kugeln: ${rot} × rot, ${blau} × blau. Ist Rot oder Blau wahrscheinlicher?`, antwort: "gleich", art: "wahl", optionen: ["Rot", "Blau", "gleich"], nurLuecke: true, bild: kugelBild([["#E5484D", rot], ["#4B6FC8", blau]]), hilfe: `Von beiden Farben gibt es gleich viele (${rot}). Die Chancen sind gleich.` };
        const sieger = rot > blau ? "Rot" : "Blau";
        return { text: "", frage: `Im Beutel liegen Kugeln: ${rot} × rot, ${blau} × blau. Du ziehst eine, ohne hinzusehen. Was ist wahrscheinlicher?`, antwort: sieger, art: "wahl", optionen: ["Rot", "Blau", "gleich"], nurLuecke: true,
          bild: kugelBild([["#E5484D", rot], ["#4B6FC8", blau]]), hilfe: `Von ${sieger === "Rot" ? "den roten" : "den blauen"} Kugeln gibt es mehr (${Math.max(rot, blau)} gegen ${Math.min(rot, blau)}). Darum ist ${sieger} wahrscheinlicher – sicher ist es aber nicht.` }; } }
  ];

  // ---------- Schritt B (28.10.): Kl. 3 Würfelgebäude und Zufall, Kl. 4 römische Zahlen, Primzahlen, Maßstab, Zeit, mehrere Zahlen addieren ----------
  // Würfelgebäude: Höhen h[zeile][spalte], Zeile 0 = hinten. Damit jeder Turm sichtbar bleibt, werden die Türme nach vorn und nach rechts nie höher.
  function wuerfelGebaeude() {
    const zeilen = 2, spalten = r(2, 3), h = [];
    for (let y = 0; y < zeilen; y++) { h.push([]); for (let x = 0; x < spalten; x++) {
      const grenze = Math.min(3, y ? h[y - 1][x] : 3, x ? h[y][x - 1] : 3); h[y].push(x + y === 0 ? r(2, 3) : r(Math.max(1, grenze - 1), grenze)); } }
    return h;
  }
  function gebaeudeBild(h, mitPlan) {
    const a = 30, b = 17, c = 34, zeilen = h.length, spalten = h[0].length;
    const ox = zeilen * a + 6, oy = 3 * c + 6, breiteIso = (spalten + zeilen) * a + 12, hoeheIso = oy + (spalten + zeilen) * b + c + 6;
    const pt = (x, y, z) => [ox + (x - y) * a, oy + (x + y) * b - z * c];
    const poly = (p, d, f) => `<polygon points="${d.map(([dx, dy]) => `${p[0] + dx},${p[1] + dy}`).join(" ")}" fill="${f}" stroke="#3b1f63" stroke-width="1.5" stroke-linejoin="round"/>`;
    const teile = [];
    for (let y = 0; y < zeilen; y++) for (let x = 0; x < spalten; x++) for (let z = 0; z < h[y][x]; z++) teile.push([x, y, z]);
    teile.sort((p, q) => (p[0] + p[1]) - (q[0] + q[1]) || p[2] - q[2]);
    let s = teile.map(([x, y, z]) => { const p = pt(x, y, z);
      return poly(p, [[0, 0], [a, b], [0, 2 * b], [-a, b]], "#FFD36B") + poly(p, [[-a, b], [0, 2 * b], [0, 2 * b + c], [-a, b + c]], "#F2A93B") + poly(p, [[0, 2 * b], [a, b], [a, b + c], [0, 2 * b + c]], "#D9822B"); }).join("");
    let breite = breiteIso, hoehe = hoeheIso;
    if (mitPlan) { // Bauplan von oben: hintere Reihe oben
      const g = 46, x0 = breiteIso + 20, y0 = 22;
      s += `<text x="${x0 + spalten * g / 2}" y="14" text-anchor="middle" font-size="14" fill="#3b1f63">Bauplan</text>`;
      for (let y = 0; y < zeilen; y++) for (let x = 0; x < spalten; x++)
        s += `<rect x="${x0 + x * g}" y="${y0 + y * g}" width="${g}" height="${g}" fill="#FFF3D6" stroke="#3b1f63" stroke-width="2"/><text x="${x0 + x * g + g / 2}" y="${y0 + y * g + 32}" text-anchor="middle" font-size="26" font-weight="700" fill="#3b1f63">${h[y][x]}</text>`;
      s += `<text x="${x0 + spalten * g / 2}" y="${y0 + zeilen * g + 18}" text-anchor="middle" font-size="12" fill="#6b5a86">vorne</text>`;
      breite = x0 + spalten * g + 6; hoehe = Math.max(hoeheIso, y0 + zeilen * g + 26);
    }
    return `<svg viewBox="0 0 ${breite} ${hoehe}" style="width:min(100%,420px);max-height:240px" role="img" aria-label="Gebäude aus Würfeln${mitPlan ? " mit Bauplan" : ""}">${s}</svg>`;
  }
  // Glücksrad mit farbigen Feldern und Zeiger oben
  const RAD_FARBEN = { Rot: "#E5484D", Blau: "#4B6FC8", Gelb: "#FFC83D", Grün: "#4CB782" };
  function radBild(felder) {
    const n = felder.length, R = 80, cx = 90, cy = 98; let s = "";
    felder.forEach((f, i) => { const w0 = (i / n) * 2 * Math.PI - Math.PI / 2, w1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
      const p = (w) => `${(cx + R * Math.cos(w)).toFixed(1)} ${(cy + R * Math.sin(w)).toFixed(1)}`;
      s += `<path d="M${cx} ${cy} L${p(w0)} A${R} ${R} 0 0 1 ${p(w1)} Z" fill="${RAD_FARBEN[f]}" stroke="#fff" stroke-width="3"/>`; });
    s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#3b1f63" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="9" fill="#3b1f63"/>`;
    s += `<path d="M${cx - 11} 4 L${cx + 11} 4 L${cx} 26 Z" fill="#3b1f63"/>`;
    return `<svg viewBox="0 0 180 184" style="max-height:200px" role="img" aria-label="Glücksrad mit ${n} Feldern: ${felder.join(", ")}">${s}</svg>`;
  }
  // Römische Zahlen bis 100
  function roemisch(n) { let s = ""; [[100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]].forEach(([w, z]) => { while (n >= w) { s += z; n -= w; } }); return s; }
  function roemErklaerung(n) { const teile = []; [[100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]].forEach(([w, z]) => { while (n >= w) { teile.push(`${z} = ${w}`); n -= w; } }); return teile.join(", "); }
  const istPrim = (n) => { if (n < 2) return false; for (let t = 2; t * t <= n; t++) if (n % t === 0) return false; return true; };
  // Karte mit Weg und Maßstabsleiste (1 cm auf der Karte = 30 px im Bild)
  function karteBild(cm, massstab) {
    const g = 30, w = Math.max(cm, 4) * g + 40; let s = `<rect x="2" y="2" width="${w - 4}" height="118" rx="10" fill="#EAF6E3" stroke="#9cc58a" stroke-width="2"/>`;
    s += `<circle cx="20" cy="46" r="8" fill="#E5484D"/><circle cx="${20 + cm * g}" cy="46" r="8" fill="#4B6FC8"/><line x1="20" y1="46" x2="${20 + cm * g}" y2="46" stroke="#3b1f63" stroke-width="4" stroke-dasharray="8 5"/>`;
    for (let i = 0; i <= cm; i++) s += `<line x1="${20 + i * g}" y1="74" x2="${20 + i * g}" y2="${i % 5 ? 82 : 88}" stroke="#3b1f63" stroke-width="2"/>`;
    s += `<line x1="20" y1="74" x2="${20 + cm * g}" y2="74" stroke="#3b1f63" stroke-width="2"/><rect x="20" y="96" width="${g}" height="8" fill="#3b1f63"/><text x="${28 + g}" y="105" font-size="13" fill="#3b1f63">1 cm ≙ ${massstab}</text>`;
    return `<svg viewBox="0 0 ${w} 122" style="max-height:150px" role="img" aria-label="Karte mit einem Weg und Lineal">${s}</svg>`;
  }
  // Schriftlich addieren mit mehreren Zahlen (bis Tausender)
  const vierStellen = (n) => [Math.floor(n / 1000), Math.floor(n / 100) % 10, Math.floor(n / 10) % 10, n % 10];
  function schriftBildViele(zahlen) {
    const sp = [60, 104, 148, 192], kopf = ["T", "H", "Z", "E"], farbe = ["#C9A7F5", "#7B9BFF", "#5CCBA6", "#FFB03B"];
    let s = sp.map((x, i) => `<rect x="${x - 20}" y="4" width="40" height="32" rx="6" fill="${farbe[i]}"/><text x="${x}" y="28" text-anchor="middle" font-size="20" font-weight="700" fill="#3b1f63">${kopf[i]}</text>`).join("");
    zahlen.forEach((n, k) => { const y = 70 + k * 36, d = vierStellen(n), erste = d.findIndex(v => v > 0);
      s += d.map((v, i) => i >= erste ? `<text x="${sp[i]}" y="${y}" text-anchor="middle" font-size="28" fill="#3b1f63">${v}</text>` : "").join("");
      if (k === zahlen.length - 1) s += `<text x="20" y="${y}" text-anchor="middle" font-size="28" font-weight="700" fill="#3b1f63">+</text>`; });
    const yl = 70 + (zahlen.length - 1) * 36 + 14;
    s += `<line x1="8" y1="${yl}" x2="216" y2="${yl}" stroke="#3b1f63" stroke-width="3"/>` + sp.map(x => `<rect x="${x - 17}" y="${yl + 8}" width="34" height="38" rx="5" fill="none" stroke="#9b8bb5" stroke-width="2" stroke-dasharray="5 4"/>`).join("");
    return `<svg viewBox="0 0 224 ${yl + 52}" style="max-height:240px" role="img" aria-label="Stellenwerttafel mit ${zahlen.length} Zahlen">${s}</svg>`;
  }
  function schriftVieleHilfe(zahlen) {
    const name = ["Tausender", "Hunderter", "Zehner", "Einer"], st = zahlen.map(vierStellen); let ue = 0; const t = [];
    for (let i = 3; i >= 0; i--) { const summe = st.reduce((x, d) => x + d[i], 0) + ue;
      t.push(`${name[i]}: ${st.map(d => d[i]).join(" + ")}${ue ? ` + ${ue} (gemerkt)` : ""} = ${summe}${summe >= 10 && i > 0 ? ` – schreibe ${summe % 10}, merke ${Math.floor(summe / 10)}` : ""}.`);
      ue = i > 0 ? Math.floor(summe / 10) : 0; }
    return t.join(" ") + ` Ergebnis: ${zahlen.reduce((x, y) => x + y, 0)}.`;
  }
  const uhr = (x) => `${Math.floor(x / 60)}:${String(x % 60).padStart(2, "0")}`;
  const MONATE_LANG = [["Januar", 31], ["März", 31], ["April", 30], ["Mai", 31], ["Juni", 30], ["Juli", 31], ["August", 31], ["September", 30], ["Oktober", 31], ["November", 30]];
  const NACH = { Januar: "Februar", März: "April", April: "Mai", Mai: "Juni", Juni: "Juli", Juli: "August", August: "September", September: "Oktober", Oktober: "November", November: "Dezember" };

  STATIONEN_K3.push(
    { id: "k3wuerfelbau", stufe: "3", lz: ["ma.rf.06", "ma.rf.07"], name: "Würfelgebäude", icon: "🧊",
      neu: () => { const h = wuerfelGebaeude(), summe = h.flat().reduce((x, y) => x + y, 0), mitPlan = Math.random() < 0.5;
        return zahl("", summe, mitPlan ? `Zähle die Zahlen im Bauplan zusammen: ${h.flat().join(" + ")} = ${summe}.`
          : `Zähle Turm für Turm, wie hoch er ist: ${h.flat().join(" + ")} = ${summe}. Unter jedem oberen Würfel stehen auch Würfel, die man nicht ganz sieht.`,
          { frage: mitPlan ? "Wie viele Würfel braucht man für dieses Gebäude?" : "Wie viele Würfel hat das Gebäude? (Es gibt keine Lücken.)", bild: gebaeudeBild(h, mitPlan), nurLuecke: true }); } },
    { id: "k3zufall", stufe: "3", lz: ["ma.dz.04", "ma.dz.07"], name: "Sicher, möglich, unmöglich", icon: "🎡",
      neu: () => { const n = wahl([4, 6, 8]), farben = Object.keys(RAD_FARBEN), art = wahl(["sicher", "möglich", "unmöglich"]);
        let felder, gefragt;
        if (art === "sicher") { gefragt = wahl(farben); felder = Array(n).fill(gefragt); }
        else { const zwei = mische(farben).slice(0, wahl([2, 3])); felder = Array.from({ length: n }, (_, i) => zwei[i % zwei.length]); felder = mische(felder);
          gefragt = art === "möglich" ? wahl(zwei) : wahl(farben.filter(f => !zwei.includes(f))); }
        const anzahl = felder.filter(f => f === gefragt).length;
        return { text: "", frage: `Das Rad wird gedreht. Der Zeiger bleibt auf ${gefragt} stehen. Ist das sicher, möglich oder unmöglich?`, antwort: art, art: "wahl", optionen: ["sicher", "möglich", "unmöglich"], nurLuecke: true, bild: radBild(felder),
          hilfe: art === "sicher" ? `Alle ${n} Felder sind ${gefragt}. Der Zeiger muss auf ${gefragt} stehen bleiben – das ist sicher.`
            : art === "möglich" ? `${anzahl} von ${n} Feldern sind ${gefragt}. Es kann passieren, muss aber nicht – das ist möglich.`
            : `Kein Feld ist ${gefragt}. Das kann nie passieren – das ist unmöglich.` }; } }
  );

  STATIONEN_K4.push(
    { id: "k4roemisch", stufe: "4", lz: ["ma.zo.15"], name: "Römische Zahlen", icon: "🏛️",
      neu: () => { const n = Math.random() < 0.3 ? wahl([4, 9, 14, 19, 24, 29, 40, 44, 49, 90, 94, 99]) : r(2, 100), z = roemisch(n);
        const regel = "Steht ein kleineres Zeichen vor einem größeren, wird es abgezogen (IV = 4, IX = 9, XL = 40, XC = 90).";
        if (Math.random() < 0.5) return zahl("", n, `${roemErklaerung(n)}. Zusammen ${n}. ${regel}`, { frage: `Welche Zahl ist ${z}?`, nurLuecke: true });
        const falsch = new Set([roemisch(n + 1), roemisch(Math.max(1, n - 1)), roemisch(n + 10 <= 100 ? n + 10 : n - 10), z.split("").reverse().join("")]);
        falsch.delete(z); const opts = mische([z, ...mische([...falsch]).slice(0, 2)]);
        return { text: "", frage: `Wie schreibt man ${n} mit römischen Zahlzeichen?`, antwort: z, art: "wahl", optionen: opts, nurLuecke: true,
          hilfe: `I = 1, V = 5, X = 10, L = 50, C = 100. ${n}: ${roemErklaerung(n)} → ${z}.` }; } },
    { id: "k4primzahl", stufe: "4", lz: ["ma.zo.17"], name: "Primzahlen", icon: "🔑",
      neu: () => { const soll = Math.random() < 0.5; let n; do n = r(2, 50); while (istPrim(n) !== soll);
        let t = 2; while (!soll && n % t) t++;
        return { text: "", frage: `Ist ${n} eine Primzahl?`, antwort: soll ? "ja" : "nein", art: "wahl", optionen: ["ja", "nein"], nurLuecke: true,
          hilfe: soll ? `${n} lässt sich nur durch 1 und durch ${n} teilen. Also ist ${n} eine Primzahl.` : `${n} = ${t} · ${n / t}. ${n} hat also noch andere Teiler als 1 und ${n} – keine Primzahl.` }; } },
    { id: "k4massstab", stufe: "4", lz: ["ma.rf.09"], name: "Maßstab", icon: "🗺️",
      neu: () => { const [mz, me, text] = wahl([[1, "km", "1 km"], [100, "m", "100 m"], [10, "km", "10 km"], [50, "m", "50 m"]]), cm = r(2, 9), echt = cm * mz;
        if (Math.random() < 0.6) return zahl("", echt, `Jeder Zentimeter auf der Karte sind ${text} in Wirklichkeit. ${cm} cm sind also ${cm} · ${mz} ${me} = ${echt} ${me}.`,
          { frage: `Der Weg auf der Karte ist ${cm} cm lang. Maßstab: 1 cm ≙ ${text}. Wie lang ist der Weg in Wirklichkeit?`, einheit: me, bild: karteBild(cm, text), nurLuecke: true });
        return zahl("", cm, `${echt} ${me} : ${mz} ${me} = ${cm}. Auf der Karte sind es ${cm} cm.`,
          { frage: `Ein Weg ist in Wirklichkeit ${echt} ${me} lang. Maßstab: 1 cm ≙ ${text}. Wie viele Zentimeter ist er auf der Karte lang?`, einheit: "cm", nurLuecke: true }); } },
    { id: "k4zeit", stufe: "4", lz: ["ma.gm.08", "ma.gm.09", "ma.gm.07"], name: "Zeit und Datum", icon: "📅",
      neu: () => { const art = r(0, 2);
        if (art === 0) { const s = r(10, 11) * 60 + 5 * r(1, 11), e = r(12, 14) * 60 + 5 * r(0, 11), d = e - s, bisVoll = 60 - (s % 60), mitte = Math.floor(e / 60) - Math.ceil(s / 60);
          return zahl("", d, `Von ${uhr(s)} bis ${uhr(Math.ceil(s / 60) * 60)} sind es ${bisVoll} min${mitte ? `, dann ${mitte} ${mitte === 1 ? "Stunde" : "Stunden"} = ${mitte * 60} min` : ""}${e % 60 ? `, dann noch ${e % 60} min` : ""}. Zusammen ${d} min.`,
            { frage: `Der Ausflug beginnt um ${uhr(s)} Uhr und endet um ${uhr(e)} Uhr. Wie viele Minuten dauert er?`, einheit: "min", nurLuecke: true }); }
        if (art === 1) { const h = r(1, 4), m = wahl([5, 10, 15, 20, 30, 45, 50]);
          return zahl("", h * 60 + m, `1 Stunde hat 60 Minuten. ${h} h = ${h * 60} min, dazu ${m} min: ${h * 60 + m} min.`, { frage: `Wie viele Minuten sind ${h} h ${m} min?`, einheit: "min", nurLuecke: true }); }
        const [mon, laenge] = wahl(MONATE_LANG), tag = r(laenge - 8, laenge - 1), n = r(laenge - tag + 1, laenge - tag + 12), neu = tag + n - laenge;
        return zahl("", neu, `Der ${mon} hat ${laenge} Tage. Bis zum ${laenge}. ${mon} sind es ${laenge - tag} Tage. Es bleiben noch ${n - (laenge - tag)} Tage im ${NACH[mon]}: der ${neu}. ${NACH[mon]}.`,
          { frage: `Heute ist der ${tag}. ${mon}. Der wievielte ${NACH[mon]} ist in ${n} Tagen?`, nurLuecke: true }); } },
    { id: "k4plusviele", stufe: "4", lz: ["ma.zo.13", "ma.zo.16"], name: "Mehrere Zahlen addieren", icon: "➕",
      neu: () => { const k = wahl([3, 3, 4]); let z; do z = Array.from({ length: k }, () => r(k === 4 ? 105 : 120, k === 4 ? 1999 : 2999)); while (z.reduce((x, y) => x + y, 0) > 9999);
        return zahl("", z.reduce((x, y) => x + y, 0), schriftVieleHilfe(z), { frage: "Rechne schriftlich: Fang bei den Einern an. Der Übertrag kann auch 2 sein.", bild: schriftBildViele(z), nurLuecke: true, max: 7 }); } },
    { id: "k4malmehr", stufe: "4", lz: ["ma.zo.16"], name: "Schriftlich mal mehrstellig", icon: "🧮",
      // mehrstelliger Faktor (Sachsen 2025, Kl. 4); am Ende des Wegs angehängt, damit vorhandener Fortschritt keine Station sperrt: erst mit jeder Stelle des zweiten Faktors malnehmen, dann die Teilergebnisse addieren
      neu: () => { const drei = Math.random() < 0.3, a = drei ? r(12, 98) : r(102, 989), b = drei ? r(102, 499) : r(12, 98);
        const st = String(b).split("").map(Number), teile = st.map((d, i) => a * d * 10 ** (st.length - 1 - i));
        const namen = ["Hunderter", "Zehner", "Einer"].slice(3 - st.length);
        return zahl(`${a} · ${b}`, a * b, `Zerlege ${b} nach Stellen: ` + st.map((d, i) => `${a} · ${d * 10 ** (st.length - 1 - i)} = ${teile[i]}`).join(", ") +
          `. Dann die Teilergebnisse addieren: ${teile.join(" + ")} = ${a * b}. Schriftlich schreibst du jede Zeile eine Stelle weiter nach rechts (${namen.join(", ")}).`,
          { frage: "Rechne schriftlich. Tipp: Nimm mit jeder Stelle des zweiten Faktors mal und addiere dann.", bild: malMehrBild(a, b), max: 7 }); } }
  );

  // ---------- Übergang 5 (NA-39): Wiederholung Kl. 4, Brüche, Kommazahlen bei Größen, Klammern, Koordinaten, Winkel, Durchschnitt ----------
  // Bruchbild: Kreis (Tortenstücke) oder Streifen mit n gleichen Teilen, k davon gefärbt
  function bruchBild(k, n, form, farbe = "#FFB03B") {
    let s = "";
    if (form === "kreis") { const R = 70, cx = 80, cy = 80;
      if (n === 1) s = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${k ? farbe : "#fff"}" stroke="#3b1f63" stroke-width="3"/>`;
      for (let i = 0; i < n && n > 1; i++) { const w0 = (i / n) * 2 * Math.PI - Math.PI / 2, w1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2, gross = 1 / n > 0.5 ? 1 : 0;
        const p = (w) => `${(cx + R * Math.cos(w)).toFixed(1)} ${(cy + R * Math.sin(w)).toFixed(1)}`;
        s += `<path d="M${cx} ${cy} L${p(w0)} A${R} ${R} 0 ${gross} 1 ${p(w1)} Z" fill="${i < k ? farbe : "#fff"}" stroke="#3b1f63" stroke-width="3" stroke-linejoin="round"/>`; }
      return `<svg viewBox="0 0 160 160" style="max-height:190px" role="img" aria-label="Kreis in ${n} gleiche Teile geteilt, ${k} gefärbt">${s}</svg>`;
    }
    const b = 300 / n;
    for (let i = 0; i < n; i++) s += `<rect x="${6 + i * b}" y="6" width="${b}" height="60" fill="${i < k ? farbe : "#fff"}" stroke="#3b1f63" stroke-width="3"/>`;
    return `<svg viewBox="0 0 312 72" style="max-height:110px" role="img" aria-label="Streifen in ${n} gleiche Teile geteilt, ${k} gefärbt">${s}</svg>`;
  }
  function zweiBrueche(a, b) { // zwei Streifen untereinander zum Vergleichen
    const zeile = (k, n, y, f, t) => { let s = `<text x="4" y="${y + 30}" font-size="22" font-weight="700" fill="#3b1f63">${t}</text>`; const w = 260 / n;
      for (let i = 0; i < n; i++) s += `<rect x="${50 + i * w}" y="${y}" width="${w}" height="44" fill="${i < k ? f : "#fff"}" stroke="#3b1f63" stroke-width="2.5"/>`; return s; };
    return `<svg viewBox="0 0 316 110" style="max-height:140px" role="img" aria-label="Zwei Brüche als Streifen">${zeile(a[0], a[1], 4, "#FFB03B", "A")}${zeile(b[0], b[1], 60, "#5CCBA6", "B")}</svg>`;
  }
  // Koordinatengitter 0–6 mit Punkten [[name, x, y], ...]
  function gitterBild(punkte) {
    const g = 34, x0 = 30, y0 = 230; let s = "";
    for (let i = 0; i <= 6; i++) s += `<line x1="${x0 + i * g}" y1="${y0}" x2="${x0 + i * g}" y2="${y0 - 6 * g}" stroke="#e3dcef" stroke-width="1.5"/><line x1="${x0}" y1="${y0 - i * g}" x2="${x0 + 6 * g}" y2="${y0 - i * g}" stroke="#e3dcef" stroke-width="1.5"/>` +
      `<text x="${x0 + i * g}" y="${y0 + 20}" text-anchor="middle" font-size="14" fill="#3b1f63">${i}</text>` + (i ? `<text x="${x0 - 10}" y="${y0 - i * g + 5}" text-anchor="end" font-size="14" fill="#3b1f63">${i}</text>` : "");
    s += `<line x1="${x0}" y1="${y0}" x2="${x0 + 6 * g + 12}" y2="${y0}" stroke="#3b1f63" stroke-width="2.5"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 - 6 * g - 12}" stroke="#3b1f63" stroke-width="2.5"/>`;
    s += punkte.map(([n, x, y], i) => `<circle cx="${x0 + x * g}" cy="${y0 - y * g}" r="7" fill="${["#E5484D", "#4B6FC8", "#2E9C5A"][i]}"/><text x="${x0 + x * g + 9}" y="${y0 - y * g - 8}" font-size="18" font-weight="700" fill="#3b1f63">${n}</text>`).join("");
    return `<svg viewBox="0 0 260 262" style="max-height:240px" role="img" aria-label="Koordinatengitter mit Punkten">${s}</svg>`;
  }
  // Winkel: zwei Schenkel vom Scheitel, Bogen (ohne verräterisches Quadrat für den rechten Winkel)
  function winkelBild(grad, drehung) {
    const cx = 90, cy = 110, L = 80, r = (w) => (w - drehung) * Math.PI / 180, p = (w, l) => [cx + l * Math.cos(r(w)), cy - l * Math.sin(r(w))];
    const [ax, ay] = p(0, L), [bx, by] = p(grad, L), [a2x, a2y] = p(0, 26), [b2x, b2y] = p(grad, 26);
    return `<svg viewBox="0 0 180 200" style="max-height:200px" role="img" aria-label="Ein Winkel">` +
      `<path d="M${a2x.toFixed(1)} ${a2y.toFixed(1)} A26 26 0 ${grad > 180 ? 1 : 0} 0 ${b2x.toFixed(1)} ${b2y.toFixed(1)}" fill="none" stroke="#E5484D" stroke-width="3"/>` +
      `<line x1="${cx}" y1="${cy}" x2="${ax.toFixed(1)}" y2="${ay.toFixed(1)}" stroke="#3b1f63" stroke-width="4" stroke-linecap="round"/><line x1="${cx}" y1="${cy}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" stroke="#3b1f63" stroke-width="4" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="5" fill="#3b1f63"/></svg>`;
  }
  const komma = (cent, stellen = 2) => { const s = String(cent).padStart(stellen + 1, "0"); return s.slice(0, -stellen) + "," + s.slice(-stellen); };
  const K4_FIT = ["k4million", "k4runden", "k4malschrift", "k4geteilt", "k4teilbar", "k4flaeche", "k4liter", "k4massstab", "k4zeit", "k4plusviele", "k4chance", "k4malmehr"];

  const STATIONEN_K5 = [
    { id: "k5fit", stufe: "5", lz: ["ma.zo.15", "ma.zo.16"], name: "Fit aus Klasse 4", icon: "💪",
      neu: () => { const id = wahl(K4_FIT), s = STATIONEN_K4.find(x => x.id === id); return Object.assign({}, s.neu()); } },
    { id: "k5bruchbild", stufe: "5", lz: ["ma.zo.19", "ma.zo.14"], name: "Brüche erkennen", icon: "🍕",
      neu: () => { const n = wahl([2, 3, 4, 5, 6, 8]), k = r(1, n - 1), richtig = `${k}/${n}`, opts = new Set([richtig]);
        [`${n - k}/${n}`, `${k}/${n + 1}`, `${Math.min(k + 1, n)}/${n}`, `${Math.max(1, k - 1)}/${n}`, `${n}/${k}`].forEach(o => opts.size < 3 && opts.add(o));
        return { text: "", frage: "Welcher Bruchteil ist gefärbt?", antwort: richtig, art: "wahl", optionen: mische([...opts]), nurLuecke: true, bild: bruchBild(k, n, wahl(["kreis", "streifen"])),
          hilfe: `Das Ganze hat ${n} gleich große Teile – das ist der Nenner (unten). ${k} ${k === 1 ? "Teil ist" : "Teile sind"} gefärbt – das ist der Zähler (oben): ${richtig}.` }; } },
    { id: "k5bruchvon", stufe: "5", lz: ["ma.zo.19", "ma.zo.14"], name: "Bruchteile von Mengen", icon: "🧮",
      neu: () => { const n = wahl([2, 3, 4, 5, 6, 10]), k = r(1, n - 1), m = n * r(2, 10), teil = m / n, erg = teil * k, wer = wahl(NAMEN);
        const d = wahl([["Gummibärchen", "isst"], ["Murmeln", "verschenkt"], ["Seiten", "liest"], ["Euro", "spart"]]);
        return zahl("", erg, `Erst durch den Nenner teilen: ${m} : ${n} = ${teil}. Dann mal den Zähler: ${teil} · ${k} = ${erg}.`,
          { frage: `${wer} hat ${m} ${d[0]} und ${d[1]} ${k}/${n} davon. Wie viele ${d[0]} sind das?`, nurLuecke: true }); } },
    { id: "k5bruchvergleich", stufe: "5", lz: ["ma.zo.19"], name: "Brüche vergleichen", icon: "⚖️",
      neu: () => { const art = r(0, 2); let a, b;
        if (art === 0) { const n = wahl([4, 5, 6, 8]); let x = r(1, n - 1), y = r(1, n - 1); while (y === x) y = r(1, n - 1); a = [x, n]; b = [y, n]; }
        else if (art === 1) { const [n1, n2] = mische(wahl([[2, 4], [3, 6], [2, 8], [4, 8], [3, 4], [2, 3]])); a = [1, n1]; b = [1, n2]; }
        else { const [x, n] = wahl([[1, 2], [1, 3], [1, 4], [2, 3], [3, 4]]), f = wahl([2, 2, 3]); [a, b] = mische([[x, n], [x * f, n * f]]); }
        const wa = a[0] / a[1], wb = b[0] / b[1], antwort = Math.abs(wa - wb) < 1e-9 ? "gleich viel" : wa > wb ? `A: ${a[0]}/${a[1]}` : `B: ${b[0]}/${b[1]}`;
        const hilfe = art === 0 ? `Gleicher Nenner (${a[1]}): Der größere Zähler ist mehr.` : art === 1 ? "Gleicher Zähler (1): Je mehr Teile das Ganze hat, desto kleiner ist jedes Teil. Darum ist der Bruch mit dem kleineren Nenner mehr."
          : `Beide Streifen sind gleich weit gefärbt: ${a[0]}/${a[1]} und ${b[0]}/${b[1]} sind gleich viel (erweitert).`;
        return { text: "", frage: "Welcher Bruch ist mehr?", antwort, art: "wahl", optionen: [`A: ${a[0]}/${a[1]}`, `B: ${b[0]}/${b[1]}`, "gleich viel"], nurLuecke: true, bild: zweiBrueche(a, b), hilfe }; } },
    { id: "k5komma", stufe: "5", lz: ["ma.gm.10", "ma.gm.09"], name: "Kommazahlen bei Größen", icon: "💶",
      neu: () => { const art = r(0, 3);
        if (art === 0) { const c = r(105, 1999); return zahl("", c, `Vor dem Komma stehen die Euro, dahinter die Cent. ${komma(c)} € = ${Math.floor(c / 100)} € ${c % 100} ct = ${c} ct.`, { frage: `Wie viele Cent sind ${komma(c)} €?`, einheit: "ct", nurLuecke: true, max: 7 }); }
        if (art === 1) { const c = r(101, 999); return zahl("", c, `1 m = 100 cm. ${komma(c)} m = ${Math.floor(c / 100)} m ${c % 100} cm = ${c} cm.`, { frage: `Wie viele Zentimeter sind ${komma(c)} m?`, einheit: "cm", nurLuecke: true }); }
        if (art === 2) { const g = r(1, 9) * 1000 + wahl([100, 250, 500, 750]); return zahl("", g, `1 kg = 1000 g. Hinter dem Komma stehen die Gramm (drei Stellen): ${komma(g, 3)} kg = ${g} g.`, { frage: `Wie viel Gramm sind ${komma(g, 3)} kg?`, einheit: "g", nurLuecke: true, max: 7 }); }
        const e = r(1, 9), ct = wahl([5, 8, 50, 9, 40]), richtig = `${e},${String(ct).padStart(2, "0")} €`, opts = new Set([richtig, `${e},${ct} €`, `${e},${String(ct).padStart(2, "0").split("").reverse().join("")} €`, `${e}${ct} €`]);
        return { text: "", frage: `Wie schreibt man ${e} € ${ct} ct mit Komma?`, antwort: richtig, art: "wahl", optionen: mische([richtig, ...mische([...opts].filter(o => o !== richtig)).slice(0, 2)]), nurLuecke: true,
          hilfe: `Cent haben immer zwei Stellen hinter dem Komma: ${ct} ct schreibt man als ,${String(ct).padStart(2, "0")}. Also ${richtig}.` }; } },
    { id: "k5klammer", stufe: "5", lz: ["ma.zo.17", "ma.ms.06"], name: "Klammer und Punkt vor Strich", icon: "( )",
      neu: () => { const a = r(2, 9), b = r(2, 9), c = r(2, 9), art = r(0, 4);
        if (art === 0) return zahl(`${a} + ${b} · ${c}`, a + b * c, `Punkt vor Strich: erst ${b} · ${c} = ${b * c}, dann ${a} + ${b * c} = ${a + b * c}.`);
        if (art === 1) return zahl(`(${a} + ${b}) · ${c}`, (a + b) * c, `Klammer zuerst: ${a} + ${b} = ${a + b}, dann ${a + b} · ${c} = ${(a + b) * c}.`);
        if (art === 2) { const d = r(1, Math.min(9, a * b - 1)); return zahl(`${a} · ${b} ${M} ${d}`, a * b - d, `Punkt vor Strich: erst ${a} · ${b} = ${a * b}, dann ${a * b} ${M} ${d} = ${a * b - d}.`); }
        if (art === 3) { const q = b * c, s = q + a; return zahl(`${s} ${M} ${q} : ${c}`, s - b, `Punkt vor Strich: erst ${q} : ${c} = ${b}, dann ${s} ${M} ${b} = ${s - b}.`); }
        const g = Math.max(a, b) + r(1, 9); return zahl(`(${g} ${M} ${a}) · ${c}`, (g - a) * c, `Klammer zuerst: ${g} ${M} ${a} = ${g - a}, dann ${g - a} · ${c} = ${(g - a) * c}.`); } },
    { id: "k5koordinaten", stufe: "5", lz: ["ma.rf.10"], name: "Koordinaten", icon: "📍",
      neu: () => { const p = []; while (p.length < 3) { const x = r(1, 6), y = r(1, 6); if (!p.some(q => (q[1] === x && q[2] === y) || (q[1] === y && q[2] === x))) p.push([["A", "B", "C"][p.length], x, y]); }
        const z = wahl(p);
        if (Math.random() < 0.5) return { text: "", frage: `Welcher Punkt liegt bei (${z[1]}|${z[2]})?`, antwort: z[0], art: "wahl", optionen: ["A", "B", "C"], nurLuecke: true, bild: gitterBild(p),
          hilfe: `Erst ${z[1]} nach rechts, dann ${z[2]} nach oben. Dort liegt ${z[0]}.` };
        const richtig = `(${z[1]}|${z[2]})`, opts = new Set([richtig]);
        [`(${z[2]}|${z[1]})`, `(${z[1]}|${Math.min(6, z[2] + 1)})`, `(${Math.max(1, z[1] - 1)}|${z[2]})`, `(${Math.min(6, z[1] + 1)}|${z[2]})`].forEach(o => opts.size < 3 && opts.add(o));
        return { text: "", frage: `Bei welchen Koordinaten liegt ${z[0]}?`, antwort: richtig, art: "wahl", optionen: mische([...opts]), nurLuecke: true, bild: gitterBild(p),
          hilfe: `Zuerst kommt der Wert nach rechts (${z[1]}), dann der nach oben (${z[2]}): ${richtig}.` }; } },
    { id: "k5winkel", stufe: "5", lz: ["ma.rf.10"], name: "Winkel", icon: "📐",
      neu: () => { const grad = wahl([30, 45, 60, 90, 90, 90, 120, 135, 150]), dreh = wahl([0, 15, 30, 45, 60, 90, 180, 200, 270, 300]);
        const art = grad === 90 ? "rechter Winkel" : grad < 90 ? "spitz" : "stumpf";
        return { text: "", frage: "Ist der Winkel spitz, ein rechter Winkel oder stumpf?", antwort: art, art: "wahl", optionen: ["spitz", "rechter Winkel", "stumpf"], nurLuecke: true, bild: winkelBild(grad, dreh),
          hilfe: (art === "rechter Winkel" ? "Er ist genau so weit offen wie die Ecke eines Blattes Papier: ein rechter Winkel." : art === "spitz" ? "Er ist enger als die Ecke eines Blattes Papier: spitz." : "Er ist weiter offen als die Ecke eines Blattes Papier: stumpf.") + " Tipp: Halte eine Papierecke an den Bildschirm." }; } },
    { id: "k5mittel", stufe: "5", lz: ["ma.dz.08", "ma.dz.03"], name: "Durchschnitt", icon: "📊",
      neu: () => { const n = wahl([3, 4]), m = r(3, 7); let w;
        do { w = Array.from({ length: n - 1 }, () => r(Math.max(1, m - 3), Math.min(10, m + 3))); w.push(n * m - w.reduce((x, y) => x + y, 0)); } while (w[n - 1] < 1 || w[n - 1] > 10);
        const tage = ["Mo", "Di", "Mi", "Do"].slice(0, n), wer = wahl(NAMEN), was = wahl([["Kilometer", "fährt Rad"], ["Seiten", "liest"], ["Tore", "schießt beim Training"]]);
        return zahl("", m, `Alles zusammenzählen: ${w.join(" + ")} = ${n * m}. Durch die Anzahl der Tage teilen: ${n * m} : ${n} = ${m}.`,
          { frage: `${wer} ${was[1]} an ${n} Tagen (Diagramm). Wie viele ${was[0]} sind es im Durchschnitt pro Tag?`, bild: saeulenBild(tage, w), nurLuecke: true }); } },
    { id: "k5sach", stufe: "5", lz: ["ma.pk.04", "ma.ms.05"], name: "Sachaufgaben in Schritten", icon: "🧩",
      neu: () => { const wer = wahl(NAMEN), art = r(0, 2);
        if (art === 0) { const h = r(2, 4), hp = r(1, 3), s = r(2, 5), sp = r(1, 2), sum = h * hp + s * sp, schein = sum < 20 ? 20 : 50;
          return zahl("", schein - sum, `1. ${h} Hefte: ${h} · ${hp} € = ${h * hp} €. 2. ${s} Stifte: ${s} · ${sp} € = ${s * sp} €. 3. Zusammen ${sum} €. 4. ${schein} € ${M} ${sum} € = ${schein - sum} €.`,
            { frage: `${wer} kauft ${h} Hefte zu je ${hp} € und ${s} Stifte zu je ${sp} €. ${wer} bezahlt mit ${schein} €. Wie viel Geld bekommt ${wer} zurück?`, einheit: "€", nurLuecke: true }); }
        if (art === 1) { const plaetze = wahl([20, 30, 40, 50]), kinder = r(plaetze + 1, plaetze * 4 - 1), busse = Math.ceil(kinder / plaetze);
          return zahl("", busse, `${kinder} : ${plaetze} = ${Math.floor(kinder / plaetze)} Rest ${kinder % plaetze}. Auch die restlichen ${kinder % plaetze || plaetze} Kinder brauchen einen Platz – also ${busse} Busse.`,
            { frage: `${kinder} Kinder fahren ins Schullandheim. In einen Bus passen ${plaetze} Kinder. Wie viele Busse braucht man?`, nurLuecke: true }); }
        const preis = r(2, 6), stueck = wahl([3, 4, 5]), packungen = r(2, 6);
        return zahl("", packungen * stueck * preis, `1. ${packungen} Packungen mit je ${stueck} Stück: ${packungen} · ${stueck} = ${packungen * stueck} Stück. 2. Jedes kostet ${preis} €: ${packungen * stueck} · ${preis} € = ${packungen * stueck * preis} €.`,
          { frage: `Die Klasse kauft ${packungen} Packungen Wasserfarben. In jeder Packung sind ${stueck} Farbkästen, jeder kostet ${preis} €. Wie viel kostet alles?`, einheit: "€", nurLuecke: true }); } }
  ];

  function malAufgabe(reihen) {
    const n = wahl(reihen), k = r(1, 10);
    const [a, b] = Math.random() < 0.5 ? [k, n] : [n, k];
    return zahl(`${a} · ${b}`, a * b, `${n}er-Reihe: ${reihe(n, k)}`);
  }

  // ---------- Sachsen Kl. 1/2 in voller Tiefe (Lehrplan Mathematik 2025): neue Stationen am Ende des Kl.-2-Wegs ----------
  // Jede Station trägt ihren Lernbereich (lb: rf | zo | gm | dz). Der Matheweg öffnet eine Station auch dann, wenn die vorige Station
  // DESSELBEN Lernbereichs geschafft ist – so laufen die vier Lernbereiche wie im Schuljahr nebeneinander (mathe.js, lbOffen).
  const LB_K2 = { plus20: "zo", minus20: "zo", zehner: "zo", vergleich: "zo", gerade: "zo", formen: "rf", plus100: "zo", minus100: "zo", plusUeber: "zo",
    minusUeber: "zo", doppelt: "zo", ergaenzen: "zo", sachaufgaben: "zo", daten: "dz", mal1: "zo", mal2: "zo", mal3: "zo", geteilt: "zo", geld: "gm",
    laenge: "gm", zufall: "dz", uhr: "gm", kalender: "gm" };
  STATIONEN.forEach(s => { s.lb = s.lb || LB_K2[s.id]; });
  // Wahl-Aufgabe: richtige Antwort plus falsche (ohne Doppelte), höchstens 4 Knöpfe
  const wahlAufgabe = (frage, antwort, falsche, hilfe, extra = {}) => Object.assign({ text: "", frage, antwort: String(antwort), art: "wahl",
    optionen: mische([String(antwort), ...[...new Set(falsche.map(String))].filter(x => x !== String(antwort)).slice(0, 3)]), nurLuecke: true, hilfe }, extra);
  const REGAL = ["🍎", "⚽", "🧸", "📚", "🎈", "🚗", "🐱", "🌵", "⏰", "🎁", "🍌", "🦆"];
  const emojiReihe = (liste, groesse = 54) => `<svg viewBox="0 0 ${liste.length * (groesse + 8) + 8} ${groesse + 22}" style="max-height:110px" role="img" aria-label="Reihe">` +
    liste.map((e, i) => `<text x="${8 + i * (groesse + 8) + groesse / 2}" y="${groesse + 4}" text-anchor="middle" font-size="${groesse}" fill="${D}" font-family="Fredoka, Arial">${e}</text>`).join("") + `</svg>`;
  // Regal mit 3 × 3 Fächern (Lagebeziehungen)
  function regalBild(g) {
    const w = 92, h = 84; let s = `<rect x="4" y="4" width="${g[0].length * w + 12}" height="${g.length * h + 12}" rx="8" fill="#FFF3D6" stroke="${D}" stroke-width="3"/>`;
    g.forEach((z, i) => { s += `<rect x="4" y="${4 + (i + 1) * h}" width="${z.length * w + 12}" height="10" fill="#C98A4B" stroke="${D}" stroke-width="2"/>`;
      z.forEach((e, j) => { if (e) s += `<text x="${10 + j * w + w / 2}" y="${(i + 1) * h - 10}" text-anchor="middle" font-size="52">${e}</text>`; }); });
    return `<svg viewBox="0 0 ${g[0].length * w + 20} ${g.length * h + 20}" style="max-height:240px" role="img" aria-label="Regal mit Dingen">${s}</svg>`;
  }
  // Kästchengitter n × n, y = 0 ist die unterste Reihe; figuren [[x, y, Emoji]], pfad [[x, y], …]
  function wegeBild(n, figuren, pfad) {
    const g = 50, mitte = (x, y) => [6 + x * g + g / 2, 6 + (n - 1 - y) * g + g / 2]; let s = "";
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) s += `<rect x="${6 + x * g}" y="${6 + y * g}" width="${g}" height="${g}" fill="#fff" stroke="#c9bfe0" stroke-width="2"/>`;
    if (pfad) s += `<polyline points="${pfad.map(p => mitte(...p).join(",")).join(" ")}" fill="none" stroke="#E5484D" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 10"/>`;
    figuren.forEach(([x, y, e]) => { const [cx, cy] = mitte(x, y); s += `<text x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="36">${e}</text>`; });
    return `<svg viewBox="0 0 ${n * g + 12} ${n * g + 12}" style="max-height:250px" role="img" aria-label="Kästchenplan">${s}</svg>`;
  }
  const richtungText = (dx, dy) => [dx ? `${Math.abs(dx)} nach ${dx > 0 ? "rechts" : "links"}` : "", dy ? `${Math.abs(dy)} nach ${dy > 0 ? "oben" : "unten"}` : ""].filter(Boolean).join(", ");
  // Linien: Strecke, Gerade, Strahl, parallel, senkrecht, schneiden, Winkel
  function linienBild(art, winkel = 90) {
    const p = `stroke="${D}" stroke-width="5" stroke-linecap="round"`, punkt = (x, y, n) => `<circle cx="${x}" cy="${y}" r="8" fill="#E5484D"/>${n ? `<text x="${x}" y="${y + 36}" text-anchor="middle" font-size="24" font-weight="700" fill="${D}">${n}</text>` : ""}`;
    const pfeil = (x, y, rechts) => `<path d="M${x} ${y} l${rechts ? -18 : 18} -11 M${x} ${y} l${rechts ? -18 : 18} 11" ${p}/>`;
    const g = {
      strecke: `<line x1="70" y1="80" x2="250" y2="80" ${p}/>${punkt(70, 80, "A")}${punkt(250, 80, "B")}`,
      gerade: `<line x1="14" y1="80" x2="306" y2="80" ${p}/>${pfeil(14, 80, false)}${pfeil(306, 80, true)}<text x="160" y="60" text-anchor="middle" font-size="24" font-style="italic" fill="${D}">g</text>`,
      strahl: `<line x1="60" y1="80" x2="306" y2="80" ${p}/>${punkt(60, 80, "A")}${pfeil(306, 80, true)}`,
      parallel: `<line x1="30" y1="50" x2="290" y2="30" ${p}/><line x1="30" y1="120" x2="290" y2="100" ${p}/>`,
      senkrecht: `<line x1="40" y1="100" x2="280" y2="100" ${p}/><line x1="160" y1="10" x2="160" y2="150" ${p}/><rect x="160" y="78" width="22" height="22" fill="none" stroke="#E5484D" stroke-width="3"/>`,
      schneiden: `<line x1="40" y1="140" x2="280" y2="30" ${p}/><line x1="40" y1="40" x2="280" y2="120" ${p}/>`,
      winkel: (() => { const rad = winkel * Math.PI / 180; return `<line x1="110" y1="140" x2="290" y2="140" ${p}/><line x1="110" y1="140" x2="${110 + 130 * Math.cos(rad)}" y2="${140 - 130 * Math.sin(rad)}" ${p}/>${punkt(110, 140)}`; })()
    }[art];
    return `<svg viewBox="0 0 320 170" style="max-height:190px" role="img" aria-label="Linien">${g}</svg>`;
  }
  // Strecke auf Kästchenpapier (1 Kästchen = 1 cm)
  function streckeBild(l) {
    const g = 34, n = Math.max(l + 2, 8); let s = "";
    for (let y = 0; y < 3; y++) for (let x = 0; x < n; x++) s += `<rect x="${4 + x * g}" y="${4 + y * g}" width="${g}" height="${g}" fill="#fff" stroke="#c9e0f0" stroke-width="1.5"/>`;
    s += `<line x1="${4 + g}" y1="${4 + 1.5 * g}" x2="${4 + (1 + l) * g}" y2="${4 + 1.5 * g}" stroke="${D}" stroke-width="5"/><circle cx="${4 + g}" cy="${4 + 1.5 * g}" r="6" fill="#E5484D"/><circle cx="${4 + (1 + l) * g}" cy="${4 + 1.5 * g}" r="6" fill="#E5484D"/>` +
      `<text x="${4 + g}" y="${4 + 1.5 * g - 14}" text-anchor="middle" font-size="20" font-weight="700" fill="${D}">A</text><text x="${4 + (1 + l) * g}" y="${4 + 1.5 * g - 14}" text-anchor="middle" font-size="20" font-weight="700" fill="${D}">B</text>`;
    return `<svg viewBox="0 0 ${n * g + 8} ${3 * g + 8}" style="max-height:130px" role="img" aria-label="Strecke auf Kästchenpapier">${s}</svg>`;
  }
  function kreisBild(r, zeige) { // zeige: "r" oder "d"
    const R = 78; let s = `<circle cx="110" cy="96" r="${R}" fill="#CDEBFF" stroke="${D}" stroke-width="5"/><circle cx="110" cy="96" r="5" fill="${D}"/><text x="104" y="124" font-size="20" font-weight="700" fill="${D}">M</text>`;
    s += zeige === "r" ? `<line x1="110" y1="96" x2="${110 + R}" y2="96" stroke="#E5484D" stroke-width="5"/><text x="${110 + R / 2}" y="86" text-anchor="middle" font-size="20" font-weight="700" fill="#C2337A">r = ${r} cm</text>`
      : `<line x1="${110 - R}" y1="96" x2="${110 + R}" y2="96" stroke="#E5484D" stroke-width="5"/><text x="110" y="86" text-anchor="middle" font-size="20" font-weight="700" fill="#C2337A">d = ${2 * r} cm</text>`;
    return `<svg viewBox="0 0 220 190" style="max-height:200px" role="img" aria-label="Kreis">${s}</svg>`;
  }
  function viereckBild() { return `<svg viewBox="0 0 200 180" class="bild-uhr" role="img" aria-label="Viereck"><path d="M30 140 L60 30 L175 55 L150 160 Z" fill="#FFB03B" stroke="${D}" stroke-width="5" stroke-linejoin="round"/></svg>`; }
  // Zahlenstrahl von a bis b (a, b Vielfache von 10), Pfeil bei n
  function strahlBild(a, b, n) {
    const w = 640, x0 = 26, k = (w - 2 * x0) / (b - a); let s = `<line x1="${x0 - 10}" y1="70" x2="${w - x0 + 14}" y2="70" stroke="${D}" stroke-width="3"/>`;
    for (let z = a; z <= b; z++) { const x = x0 + (z - a) * k, gross = z % 10 === 0, mittel = z % 5 === 0;
      if (b - a > 40 && !mittel) continue;
      s += `<line x1="${x}" y1="${gross ? 54 : mittel ? 60 : 64}" x2="${x}" y2="${gross ? 86 : mittel ? 80 : 76}" stroke="${D}" stroke-width="${gross ? 3 : 1.5}"/>`;
      if (gross) s += `<text x="${x}" y="110" text-anchor="middle" font-size="20" fill="${D}" font-family="Fredoka, Arial">${z}</text>`; }
    const xn = x0 + (n - a) * k;
    s += `<path d="M${xn} 50 l-11 -22 h22 Z" fill="#E5484D" stroke="${D}" stroke-width="2"/>`;
    return `<svg viewBox="0 0 ${w} 120" style="max-height:130px" role="img" aria-label="Zahlenstrahl">${s}</svg>`;
  }
  function hunderterBild(n) {
    const g = 22; let s = "";
    for (let i = 0; i < 100; i++) { const z = Math.floor(i / 10), sp = i % 10, x = 6 + sp * g + (sp >= 5 ? 6 : 0), y = 6 + z * g + (z >= 5 ? 6 : 0);
      s += `<circle cx="${x + g / 2}" cy="${y + g / 2}" r="${g / 2 - 2}" fill="${i < n ? "#E5484D" : "#fff"}" stroke="#9b8bb5" stroke-width="1.5"/>`; }
    return `<svg viewBox="0 0 ${10 * g + 18} ${10 * g + 18}" style="max-height:230px" role="img" aria-label="Hunderterfeld">${s}</svg>`;
  }
  const EINER = ["", "ein", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun"];
  const ZEHNER = ["", "zehn", "zwanzig", "dreißig", "vierzig", "fünfzig", "sechzig", "siebzig", "achtzig", "neunzig"];
  const zahlwort = (n) => { const z = Math.floor(n / 10), e = n % 10;
    if (n < 10) return ["null", "eins", ...EINER.slice(2)][n]; if (n < 20) return ["zehn", "elf", "zwölf", "dreizehn", "vierzehn", "fünfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn"][n - 10];
    if (n === 100) return "hundert"; return (e ? EINER[e] + "und" : "") + ZEHNER[z]; };
  function mauerBild(reihen) { // reihen von unten nach oben; null = leerer Stein
    const w = 78, h = 50; let s = ""; const unten = reihen[0].length;
    reihen.forEach((reihe, i) => reihe.forEach((v, j) => { const x = 6 + (i * w) / 2 + j * w, y = 6 + (reihen.length - 1 - i) * h;
      s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${v == null ? "#FFF6D6" : "#F7C9A9"}" stroke="${D}" stroke-width="3"/><text x="${x + w / 2}" y="${y + 34}" text-anchor="middle" font-size="26" font-weight="700" fill="${D}" font-family="Fredoka, Arial">${v == null ? "?" : v}</text>`; }));
    return `<svg viewBox="0 0 ${unten * w + 12} ${reihen.length * h + 12}" style="max-height:200px" role="img" aria-label="Zahlenmauer">${s}</svg>`;
  }
  function quadratBild(q, weg) {
    const g = 64; let s = "";
    q.forEach((z, i) => z.forEach((v, j) => { s += `<rect x="${6 + j * g}" y="${6 + i * g}" width="${g}" height="${g}" fill="${i * 3 + j === weg ? "#FFF6D6" : "#fff"}" stroke="${D}" stroke-width="3"/><text x="${6 + j * g + g / 2}" y="${6 + i * g + 42}" text-anchor="middle" font-size="28" font-weight="700" fill="${D}" font-family="Fredoka, Arial">${i * 3 + j === weg ? "?" : v}</text>`; }));
    return `<svg viewBox="0 0 ${3 * g + 12} ${3 * g + 12}" style="max-height:200px" role="img" aria-label="Zauberquadrat">${s}</svg>`;
  }
  function punkteBild(n) {
    const g = Math.min(26, 220 / n); let s = "";
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) s += `<circle cx="${8 + j * g + g / 2}" cy="${8 + i * g + g / 2}" r="${g / 2 - 2}" fill="#7B9BFF" stroke="${D}" stroke-width="1"/>`;
    return `<svg viewBox="0 0 ${n * g + 16} ${n * g + 16}" style="max-height:210px" role="img" aria-label="Punktefeld">${s}</svg>`;
  }
  function tabelleBild(kopf, zeilen) {
    const w = 84, h = 46, sp = kopf.length + 1; let s = "";
    [["", ...kopf], ...zeilen].forEach((z, i) => z.forEach((v, j) => { const x = 4 + j * w, y = 4 + i * h, k = i === 0 || j === 0;
      s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${k ? "#E6DDF5" : "#fff"}" stroke="${D}" stroke-width="2"/><text x="${x + w / 2}" y="${y + 31}" text-anchor="middle" font-size="${k && i === 0 ? 28 : 22}" font-weight="${k ? 700 : 500}" fill="${D}" font-family="Fredoka, Arial">${v}</text>`; }));
    return `<svg viewBox="0 0 ${sp * w + 8} ${(zeilen.length + 1) * h + 8}" style="max-height:210px" role="img" aria-label="Tabelle">${s}</svg>`;
  }
  function balkenBild(kat, werte) {
    const g = 26, h = 40, x0 = 60; let s = "";
    for (let i = 0; i <= 10; i++) s += `<line x1="${x0 + i * g}" y1="6" x2="${x0 + i * g}" y2="${10 + kat.length * h}" stroke="#e3dcef"/>` + (i % 2 === 0 ? `<text x="${x0 + i * g}" y="${30 + kat.length * h}" text-anchor="middle" font-size="14" fill="${D}">${i}</text>` : "");
    kat.forEach((k, i) => { s += `<text x="${x0 - 30}" y="${10 + i * h + 28}" text-anchor="middle" font-size="26">${k}</text><rect x="${x0}" y="${10 + i * h + 6}" width="${werte[i] * g}" height="${h - 12}" fill="${["#7B9BFF", "#5CCBA6", "#FFB03B", "#F27BAA"][i]}" stroke="${D}" stroke-width="1.5"/>`; });
    s += `<line x1="${x0}" y1="6" x2="${x0}" y2="${10 + kat.length * h}" stroke="${D}" stroke-width="2"/>`;
    return `<svg viewBox="0 0 ${x0 + 10 * g + 16} ${kat.length * h + 38}" style="max-height:210px" role="img" aria-label="Balkendiagramm">${s}</svg>`;
  }
  function buchstabeBild(b) {
    return `<svg viewBox="0 0 200 190" style="max-height:200px" role="img" aria-label="Buchstabe mit Spiegelachse"><text x="100" y="160" text-anchor="middle" font-size="170" font-weight="700" fill="#7B9BFF" stroke="${D}" stroke-width="3" font-family="Arial, Helvetica, sans-serif">${b}</text><line x1="100" y1="4" x2="100" y2="186" stroke="#E5484D" stroke-width="4" stroke-dasharray="10 6"/></svg>`;
  }
  const euro = (ct) => `${Math.floor(ct / 100)},${String(ct % 100).padStart(2, "0")} €`;
  const uhrText = (h, m) => `${h}:${String(m).padStart(2, "0")} Uhr`;

  const STATIONEN_K2_NEU = [
    { id: "zahlen100", lb: "zo", lz: ["ma.zo.05", "ma.zo.06"], name: "Zahlen bis 100", icon: "💯",
      neu: () => {
        const art = r(1, 8), n = r(11, 99);
        if (art === 1) { const a = wahl([0, 0, 20, 40, 60]), b = a === 0 ? 100 : a + 40, m = a === 0 ? r(1, 19) * 5 : r(a + 1, b - 1);
          return zahl("", m, a === 0 ? `Jeder lange Strich ist ein Zehner, die kurzen Striche liegen dazwischen bei 5: ${m}.` : `Zähle von der ${Math.floor(m / 10) * 10} aus weiter: Jeder kleine Strich ist eins weiter.`, { frage: "Welche Zahl zeigt der Pfeil am Zahlenstrahl?", bild: strahlBild(a, b, m), nurLuecke: true }); }
        if (art === 2) return zahl("", n, `${Math.floor(n / 10)} volle Zehnerreihen und ${n % 10} einzelne: ${n}.`, { frage: "Wie viele Punkte sind rot?", bild: hunderterBild(n), nurLuecke: true });
        if (art === 3) return zahl("", n, `Erst kommen die Einer, dann die Zehner – geschrieben wird aber erst der Zehner: ${n}.`, { frage: `Schreib die Zahl: „${zahlwort(n)}“`, nurLuecke: true });
        if (art === 4) { const e = n % 10, z = Math.floor(n / 10), dreh = e && e !== z ? e * 10 + z : n > 89 ? n - 10 : n + 10;
          return wahlAufgabe(`Wie heißt die Zahl ${n}?`, zahlwort(n), [zahlwort(dreh), zahlwort(n > 98 ? n - 1 : n + 1)], `Bei ${n} sprichst du zuerst die Einer: ${zahlwort(n)}.`); }
        if (art === 5) { const u = Math.floor(n / 10) * 10; if (n % 10 === 0) return zahl("", n + 1, `Der Nachfolger ist eins mehr: ${n + 1}.`, { frage: `Wie heißt der Nachfolger von ${n}?`, nurLuecke: true });
          return wahlAufgabe(`Zwischen welchen Nachbarzehnern liegt ${n}?`, `${u} und ${u + 10}`, [`${u - 10} und ${u}`, u + 20 <= 100 ? `${u + 10} und ${u + 20}` : `${u - 20} und ${u - 10}`, `${n - 1} und ${n + 1}`], `${n} hat ${u / 10} Zehner – es liegt zwischen ${u} und ${u + 10}.`); }
        if (art === 6) { const v = Math.random() < 0.5; return zahl("", v ? n - 1 : n + 1, v ? `Der Vorgänger ist eins weniger: ${n - 1}.` : `Der Nachfolger ist eins mehr: ${n + 1}.`, { frage: `Wie heißt der ${v ? "Vorgänger" : "Nachfolger"} von ${n}?`, nurLuecke: true }); }
        if (art === 7) { const k = wahl([2, 5, 10, 3, 4]), rueck = Math.random() < 0.4, start = rueck ? r(4 * k + 1, 99) : r(1, 99 - 4 * k), f = [0, 1, 2, 3].map(i => rueck ? start - i * k : start + i * k);
          return zahl(`${f.join(", ")}, ?`, rueck ? start - 4 * k : start + 4 * k, `Immer ${rueck ? "minus" : "plus"} ${k}.`, { frage: `Zähle in ${k}er-Schritten ${rueck ? "rückwärts" : "weiter"}:` }); }
        const z = Math.floor(n / 10), e = n % 10;
        return Math.random() < 0.5 ? zahl(`${z} Z + ${e} E`, n, `${z} Zehner und ${e} Einer sind ${n}.`)
          : zahl("", z, `${n}: Die erste Ziffer sagt die Zehner – ${z}.`, { frage: `Wie viele Zehner hat die Zahl ${n}?`, nurLuecke: true });
      } },
    { id: "lage", lb: "rf", lz: ["ma.rf.01", "ma.rf.02"], name: "Wo ist was?", icon: "🧭",
      neu: () => {
        const d = mische(REGAL).slice(0, 9), g = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 9)], art = r(1, 5), i = r(0, 2);
        const andere = (x) => d.filter(e => e !== x);
        if (art === 1) { const j = r(1, 2); return wahlAufgabe(`Was steht direkt links neben ${g[i][j]}?`, g[i][j - 1], mische(andere(g[i][j - 1])), "Links ist die Seite, auf der deine linke Hand ein L zeigt (Daumen und Zeigefinger).", { bild: regalBild(g) }); }
        if (art === 2) { const j = r(0, 1); return wahlAufgabe(`Was steht direkt rechts neben ${g[i][j]}?`, g[i][j + 1], mische(andere(g[i][j + 1])), "Rechts ist die Seite deiner Schreibhand – bei den meisten Kindern.", { bild: regalBild(g) }); }
        if (art === 3) { const j = r(0, 2), z = r(1, 2), oben = Math.random() < 0.5, [a, b] = oben ? [g[z][j], g[z - 1][j]] : [g[z - 1][j], g[z][j]];
          return wahlAufgabe(`Was steht direkt ${oben ? "über" : "unter"} ${a}?`, b, mische(andere(b)), `${oben ? "Über" : "Unter"} heißt: im Fach ${oben ? "darüber" : "darunter"}, in derselben Spalte.`, { bild: regalBild(g) }); }
        if (art === 4) return wahlAufgabe(`Was steht zwischen ${g[i][0]} und ${g[i][2]}?`, g[i][1], mische(andere(g[i][1])), "Zwischen heißt: genau in der Mitte, links und rechts ist je eins.", { bild: regalBild(g) });
        const orte = [["oben links", 0, 0], ["oben rechts", 0, 2], ["unten links", 2, 0], ["unten rechts", 2, 2], ["in der Mitte", 1, 1]], o = wahl(orte);
        return wahlAufgabe(`Wo steht ${g[o[1]][o[2]]}?`, o[0], mische(orte.map(x => x[0])), "Schau zuerst: oben, Mitte oder unten? Dann: links oder rechts?", { bild: regalBild(g) });
      } },
    { id: "rechentricks", lb: "zo", lz: ["ma.zo.07", "ma.zo.08", "ma.ms.03"], name: "Rechentricks", icon: "💡",
      neu: () => {
        const art = r(1, 10);
        if (art === 1) { const a = r(2, 9), b = r(21, 89); return zahl(`${a} + ${b} = ${b} + ?`, a, `Tauschaufgabe: Beim Plus darfst du die Zahlen tauschen. Rechne lieber ${b} + ${a}.`); }
        if (art === 2) { const a = r(21, 69), b = r(11, 99 - a); return zahl(`${a} + ${b} = ${a + b}, also ${a + b} ${M} ${b} = ?`, a, `Umkehraufgabe: Minus macht das Plus rückgängig.`); }
        if (art === 3) { const e = r(5, 9), b = r(1, e), z = r(2, 9) * 10; return zahl(`${e} ${M} ${b} = ${e - b}, also ${z + e} ${M} ${b} = ?`, z + e - b, `Die Zehner bleiben gleich: ${z} und ${e - b} sind ${z + e - b}.`); }
        if (art === 4) { const a = r(2, 6) * 10, b = r(2, 9 - a / 10) * 10, d = wahl([1, -1]); return zahl(`${a} + ${b} = ${a + b}, also ${a} + ${b + d} = ?`, a + b + d, `Nachbaraufgabe: ${b + d} ist eins ${d > 0 ? "mehr" : "weniger"} als ${b}, also ist das Ergebnis eins ${d > 0 ? "mehr" : "weniger"}.`); }
        if (art === 5) { const a = r(41, 90), b = r(11, Math.min(39, a - 10)), k = 10 - (b % 10 || 10); if (!k) return zahl(`${a} ${M} ${b}`, a - b, wegMinus(a, b));
          return zahl(`${a} ${M} ${b} = ${a + k} ${M} ?`, b + k, `Gleichsinnig verändern: Beide Zahlen um ${k} größer – der Unterschied bleibt gleich. ${a + k} ${M} ${b + k} = ${a - b}.`); }
        if (art === 6) { const a = r(19, 59), k = 10 - (a % 10 || 10), b = r(11, 99 - a - 10); if (!k) return zahl(`${a} + ${b}`, a + b, wegPlus(a, b));
          return zahl(`${a} + ${b} = ${a + k} + ?`, b - k, `Gegensinnig verändern: Die eine Zahl ${k} mehr, die andere ${k} weniger – die Summe bleibt gleich.`); }
        if (art === 7) { const n = r(6, 9), k = r(3, 9); return zahl(`${n} · ${k} = 5 · ${k} + ? · ${k}`, n - 5, `Zerlege ${n} in 5 und ${n - 5}: ${5 * k} + ${(n - 5) * k} = ${n * k}.`); }
        if (art === 8) { const k = r(3, 9); return zahl(`9 · ${k} = 10 · ${k} ${M} ?`, k, `Neunmal ist zehnmal weniger einmal: ${10 * k} ${M} ${k} = ${9 * k}.`); }
        if (art === 9) { const a = r(3, 9), b = r(3, 9); return zahl(`${a} · ${b} = ${a * b}, also ${a * b} : ${b} = ?`, a, `Umkehraufgabe: Geteilt macht das Mal rückgängig.`); }
        const a = r(3, 9), b = r(11, 15 - a + 6), s = a + b;
        return wahlAufgabe(`Welche Aufgabe gehört NICHT zur Familie ${a}, ${b}, ${s}?`, `${s} + ${a} = ${s + a}`, [`${a} + ${b} = ${s}`, `${b} + ${a} = ${s}`, `${s} ${M} ${b} = ${a}`], `Zur Aufgabenfamilie gehören nur Aufgaben mit genau den Zahlen ${a}, ${b} und ${s}.`);
      } },
    { id: "euro", lb: "gm", lz: ["ma.gm.04"], name: "Euro und Cent", icon: "💶",
      neu: () => {
        const art = r(1, 7);
        if (art === 1) { const e = r(1, 9); return zahl(`${e} € = ? ct`, e * 100, `1 € sind 100 ct, also sind ${e} € ${e * 100} ct.`); }
        if (art === 2) { const e = r(1, 9), c = r(1, 19) * 5; return zahl(`${e} € ${c} ct = ? ct`, e * 100 + c, `${e} € sind ${e * 100} ct, dazu ${c} ct: ${e * 100 + c} ct.`); }
        if (art === 3) { const e = r(1, 9), c = wahl([5, 10, 20, 25, 50, 75, 90, 8]);
          return wahlAufgabe(`Wie schreibt man ${e} € ${c} ct mit Komma?`, euro(e * 100 + c), [euro(e * 100 + (c < 10 ? c * 10 : c % 10 ? (c % 10) * 10 + Math.floor(c / 10) : c / 10)), `${e}${c},00 €`, euro((e + 1) * 100 + c)], `Nach dem Komma stehen immer zwei Ziffern für die Cent: ${euro(e * 100 + c)}.`); }
        if (art === 4) { const a = r(60, 140), b = a + wahl([-1, 1]) * r(5, 40);
          return wahlAufgabe(`Was ist teurer?`, euro(Math.max(a, b)), [euro(Math.min(a, b))], `Rechne beides in Cent: ${a} ct und ${b} ct.`); }
        if (art === 5) { const p = r(11, 89) * 5, z = wahl([500, 1000].filter(x => x > p)); return zahl("", z - p, `Von ${euro(p)} bis ${euro(z)} ergänzen: ${z - p} ct.`, { frage: `Etwas kostet ${euro(p)}. Du bezahlst mit ${z / 100} €. Wie viele Cent bekommst du zurück?`, nurLuecke: true, einheit: "ct" }); }
        if (art === 6) { const s = wahl([["ein Brötchen", "40 ct", ["40 €", "4 €"]], ["ein Kinderbuch", "10 €", ["10 ct", "100 €"]], ["ein Fahrrad", "300 €", ["3 €", "30 ct"]], ["ein Eis", "2 €", ["20 €", "2 ct"]], ["eine Packung Milch", "1 €", ["10 €", "1 ct"]]]);
          return wahlAufgabe(`Was kostet ${s[0]} ungefähr?`, s[1], s[2], `Denk an den Einkauf mit deiner Familie: ${s[0]} kostet etwa ${s[1]}.`); }
        const n = wahl(NAMEN), st = r(2, 5), p = r(2, 9) * 10;
        return zahl("", st * p, `${st} · ${p} ct = ${st * p} ct.`, { frage: `${n} kauft ${st} Lutscher. Einer kostet ${p} ct. Wie viel kostet das zusammen?`, nurLuecke: true, einheit: "ct" });
      } },
    { id: "linien", lb: "rf", lz: ["ma.rf.03", "ma.pk.06"], name: "Linien und Strecken", icon: "📐",
      neu: () => {
        const art = r(1, 5);
        if (art === 1) { const k = wahl(["strecke", "gerade", "strahl"]), n = { strecke: "Strecke", gerade: "Gerade", strahl: "Strahl" };
          return wahlAufgabe("Was ist das?", n[k], Object.values(n), { strecke: "Eine Strecke hat zwei Endpunkte: Sie geht von A bis B.", gerade: "Eine Gerade hat kein Ende – sie geht in beide Richtungen immer weiter.", strahl: "Ein Strahl hat einen Anfangspunkt und geht in eine Richtung immer weiter." }[k], { bild: linienBild(k) }); }
        if (art === 2) { const k = wahl(["parallel", "senkrecht", "schneiden"]), n = { parallel: "parallel", senkrecht: "senkrecht", schneiden: "schief, sie schneiden sich" };
          return wahlAufgabe("Wie liegen die beiden Linien zueinander?", n[k], Object.values(n), { parallel: "Parallele Linien haben überall den gleichen Abstand – sie treffen sich nie.", senkrecht: "Senkrechte Linien bilden einen rechten Winkel – wie eine Ecke vom Blatt.", schneiden: "Die Linien treffen sich, aber nicht im rechten Winkel." }[k], { bild: linienBild(k) }); }
        if (art === 3) { const w = wahl([90, 90, 50, 130, 70]); return wahlAufgabe("Ist das ein rechter Winkel?", w === 90 ? "ja" : "nein", ["ja", "nein"], w === 90 ? "Ja: Falte ein Blatt zweimal – der Faltwinkel passt genau hinein." : "Nein: Ein gefalteter Faltwinkel passt nicht genau hinein.", { bild: linienBild("winkel", w) }); }
        if (art === 4) { const f = wahl(["dreieck", "quadrat", "rechteck", "fuenfeck", "sechseck"]), n = { dreieck: 3, quadrat: 4, rechteck: 4, fuenfeck: 5, sechseck: 6 }[f];
          return zahl("", n, `Fahre die Seiten mit dem Finger nach und zähle: ${n} Strecken.`, { frage: "Aus wie vielen Strecken besteht die Figur?", bild: formBild(f, "#B9E6FF"), nurLuecke: true }); }
        const l = r(2, 9); return zahl("", l, `Zähle die Kästchen von A bis B: ${l}.`, { frage: "1 Kästchen ist 1 cm. Wie lang ist die Strecke AB?", bild: streckeBild(l), nurLuecke: true, einheit: "cm" });
      } },
    { id: "zahlenmauer", lb: "zo", lz: ["ma.ms.02", "ma.ms.03"], name: "Zahlenmauern und Rätsel", icon: "🧱",
      neu: () => {
        const art = r(1, 6);
        if (art <= 2) { const a = r(2, 25), b = r(2, 25), c = r(2, 25), m = [a + b, b + c], t = a + 2 * b + c;
          if (art === 1) return zahl("", t, `Unten: ${a} + ${b} = ${m[0]} und ${b} + ${c} = ${m[1]}. Oben: ${m[0]} + ${m[1]} = ${t}.`, { frage: "Zahlenmauer: Jeder Stein ist die Summe der beiden Steine darunter. Was steht oben?", bild: mauerBild([[a, b, c], [m[0], m[1]], [null]]), nurLuecke: true });
          return zahl("", a, `${m[0]} ${M} ${b} = ${a}, denn ${a} + ${b} = ${m[0]}.`, { frage: "Zahlenmauer: Welche Zahl fehlt unten links?", bild: mauerBild([[null, b, c], [m[0], m[1]], [t]]), nurLuecke: true }); }
        if (art === 3) { const regel = r(1, 4); let f;
          if (regel === 1) { const k = r(2, 9), s = r(1, 40); f = [0, 1, 2, 3, 4].map(i => s + i * k); }
          else if (regel === 2) { const k = r(2, 9), s = r(5 * k, 99); f = [0, 1, 2, 3, 4].map(i => s - i * k); }
          else if (regel === 3) { const s = r(1, 3); f = [0, 1, 2, 3, 4].map(i => s * 2 ** i); }
          else { const s = r(1, 20); f = [s, s + 1, s + 3, s + 6, s + 10]; }
          return zahl(`${f.slice(0, 4).join(", ")}, ?`, f[4], { 1: `Immer plus ${f[1] - f[0]}.`, 2: `Immer minus ${f[0] - f[1]}.`, 3: "Jede Zahl ist das Doppelte der Zahl davor.", 4: "Erst plus 1, dann plus 2, dann plus 3, dann plus 4." }[regel], { frage: "Wie geht die Zahlenfolge weiter?" }); }
        if (art === 4) { const Q = [[2, 7, 6], [9, 5, 1], [4, 3, 8]], k = r(0, 10); let q = Q.map(z => z.map(v => v + k));
          if (Math.random() < 0.5) q = q.map(z => z.slice().reverse()); if (Math.random() < 0.5) q = q.slice().reverse();
          const weg = r(0, 8), summe = 15 + 3 * k, zeile = q[Math.floor(weg / 3)], rest = zeile.filter((_, j) => j !== weg % 3);
          return zahl("", q[Math.floor(weg / 3)][weg % 3], `In jeder Zeile ist die Summe ${summe}. ${summe} ${M} ${rest[0]} ${M} ${rest[1]} = ${zeile[weg % 3]}.`, { frage: `Zauberquadrat: Jede Zeile, Spalte und Diagonale ergibt ${summe}. Welche Zahl fehlt?`, bild: quadratBild(q, weg), nurLuecke: true }); }
        if (art === 5) { const a = r(20, 80), b = a + r(4, 9), passt = r(0, b - a - 1), rel = Math.random() < 0.5;
          if (rel) return wahlAufgabe(`Welche Zahl passt?  ${a} + □ < ${b}`, passt, [b - a, b - a + r(1, 5), b - a + r(6, 10)], `${a} + ${passt} = ${a + passt} – das ist kleiner als ${b}. Die anderen Zahlen sind zu groß.`);
          const gross = b - a + r(1, 9); return wahlAufgabe(`Welche Zahl passt?  ${a} + □ > ${b}`, gross, [b - a, b - a - 2, b - a - 3], `${a} + ${gross} = ${a + gross} – das ist größer als ${b}.`); }
        const z = r(3, 45); return zahl("□ + □ = " + 2 * z + "   □ = ?", z, `Gleiche Zahlen: die Hälfte von ${2 * z} ist ${z}.`, { frage: "In beiden Kästchen steht dieselbe Zahl." });
      } },
    { id: "massband", lb: "gm", lz: ["ma.gm.05"], name: "mm, cm, dm und m", icon: "📏",
      neu: () => {
        const art = r(1, 8);
        if (art === 1) { const [e, f, v] = wahl([["dm", "cm", 10], ["cm", "mm", 10], ["m", "dm", 10], ["m", "cm", 100]]), n = r(1, 9); return zahl(`${n} ${e} = ? ${f}`, n * v, `1 ${e} = ${v} ${f}, also ${n} ${e} = ${n * v} ${f}.`); }
        if (art === 2) { const m = r(1, 4), c = r(1, 99); return zahl(`${m} m ${c} cm = ? cm`, m * 100 + c, `${m} m sind ${m * 100} cm, dazu ${c} cm.`); }
        if (art === 3) { const m = r(1, 3), c = r(10, 99); return zahl(`${m},${c} m = ? cm`, m * 100 + c, `Vor dem Komma stehen die Meter, danach die Zentimeter: ${m} m ${c} cm = ${m * 100 + c} cm.`); }
        if (art === 4) { const s = wahl([["Ein Bleistift ist 15 …", "cm"], ["Eine Tür ist 2 …", "m"], ["Eine Ameise ist 5 …", "mm"], ["Ein Lineal ist 3 …", "dm"], ["Ein Schulweg ist 800 …", "m"], ["Ein Fingernagel ist 1 …", "cm"]]);
          return wahlAufgabe(`Welche Einheit passt? ${s[0]}`, s[1], ["mm", "cm", "dm", "m"], `Denk an die Stützpunkte: 1 mm ist so dick wie eine Münze, 1 cm so breit wie ein Fingernagel, 1 dm so breit wie eine Hand, 1 m ein großer Schritt.`); }
        if (art === 5) { const a = r(50, 150), b = a + wahl([-1, 1]) * r(5, 40), t = (x) => x >= 100 ? `${Math.floor(x / 100)} m${x % 100 ? ` ${x % 100} cm` : ""}` : `${x} cm`;
          return wahlAufgabe("Was ist länger?", t(Math.max(a, b)), [t(Math.min(a, b))], `Rechne beides in cm: ${a} cm und ${b} cm.`); }
        if (art === 6) { const s = wahl([["eine Tür", "2 m", ["20 cm", "20 m"]], ["dein Daumen breit", "2 cm", ["2 mm", "2 dm"]], ["ein Schritt", "50 cm", ["5 cm", "5 m"]], ["ein Klassenzimmer lang", "9 m", ["9 cm", "90 m"]]]);
          return wahlAufgabe(`Wie lang ist ${s[0]} ungefähr?`, s[1], s[2], `Stell es dir vor oder miss nach: ${s[0]} – etwa ${s[1]}.`); }
        if (art === 7) return zahl("", 50, "Ein Meter hat 100 cm. Die Hälfte davon sind 50 cm.", { frage: "Ein halber Meter sind wie viele Zentimeter?", nurLuecke: true, einheit: "cm" });
        const n = wahl(NAMEN), a = r(6, 9) * 10, b = r(11, a - 15);
        return zahl("", a - b, `${a} ${M} ${b} = ${a - b}.`, { frage: `${n} hat ein Band, das ${a} cm lang ist. ${n} schneidet ${b} cm ab. Wie lang ist der Rest?`, nurLuecke: true, einheit: "cm" });
      } },
    { id: "wege", lb: "rf", lz: ["ma.rf.02"], name: "Wege gehen", icon: "🐭",
      neu: () => {
        const n = 5, art = r(1, 3); let sx, sy, dx, dy;
        do { sx = r(0, 4); sy = r(0, 4); dx = r(-3, 3); dy = r(-3, 3); } while ((art === 2 ? !dx || !dy : !dx && !dy) || sx + dx < 0 || sx + dx > 4 || sy + dy < 0 || sy + dy > 4);
        const ziel = [sx + dx, sy + dy], frei = []; for (let x = 0; x < n; x++) for (let y = 0; y < n; y++) if (!(x === sx && y === sy) && !(x === ziel[0] && y === ziel[1])) frei.push([x, y]);
        const d = mische(["🧀", "🍎", "🌻", "🍓", "🥕"]).slice(0, 4), plaetze = [ziel, ...mische(frei).slice(0, 3)], figuren = [[sx, sy, "🐭"], ...plaetze.map((p, i) => [p[0], p[1], d[i]])];
        if (art === 1) return wahlAufgabe(`Die Maus geht ${richtungText(dx, dy)}. Wo kommt sie an?`, d[0], d.slice(1), `Geh mit dem Finger: zuerst ${richtungText(dx, 0) || "nicht zur Seite"}, dann ${richtungText(0, dy) || "nicht nach oben oder unten"}.`, { bild: wegeBild(n, figuren) });
        if (art === 2) { const pfad = [[sx, sy], [sx + dx, sy], [sx + dx, sy + dy]];
          return wahlAufgabe("Wie geht die Maus auf dem roten Weg?", richtungText(dx, dy), [richtungText(-dx, dy), richtungText(dx, -dy), richtungText(dy, dx)], "Zähle die Kästchen: erst zur Seite, dann nach oben oder unten.", { bild: wegeBild(n, figuren, pfad) }); }
        return zahl("", Math.abs(dx) + Math.abs(dy), `${Math.abs(dx)} Schritte zur Seite und ${Math.abs(dy)} nach oben oder unten: ${Math.abs(dx) + Math.abs(dy)}.`, { frage: `Wie viele Kästchen bis ${d[0]}? (nicht schräg)`, bild: wegeBild(n, figuren), nurLuecke: true });
      } },
    { id: "quadratzahlen", lb: "zo", lz: ["ma.zo.09", "ma.ms.03"], name: "Quadratzahlen", icon: "🔳",
      neu: () => {
        const art = r(1, 4), n = r(2, 10);
        if (art === 1) return zahl("", n * n, `${n} Reihen mit je ${n} Punkten: ${n} · ${n} = ${n * n}.`, { frage: "Das Punktefeld ist ein Quadrat. Wie viele Punkte sind es?", bild: punkteBild(n), nurLuecke: true });
        if (art === 2) return zahl(`${n} · ${n}`, n * n, `Quadratzahl: ${n} mal sich selbst. ${reihe(n, n)}.`);
        if (art === 3) { const q = [4, 9, 16, 25, 36, 49, 64, 81, 100], k = wahl(q), nicht = mische([6, 12, 18, 20, 24, 30, 40, 45, 50, 60, 70, 80, 90]).slice(0, 3);
          return wahlAufgabe("Welche Zahl ist eine Quadratzahl?", k, nicht, `${k} = ${Math.sqrt(k)} · ${Math.sqrt(k)}. Quadratzahlen sind 1, 4, 9, 16, 25, 36, 49, 64, 81, 100.`); }
        const m = r(3, 9); return zahl(`${m + 1} · ${m} = ${m} · ${m} + ?`, m, `Nachbaraufgabe: Einmal ${m} mehr als ${m} · ${m} = ${m * m}. Also ${m * m} + ${m} = ${m * m + m}.`);
      } },
    { id: "tabelle", lb: "dz", lz: ["ma.dz.02", "ma.dz.03"], name: "Tabellen und Balken", icon: "📋",
      neu: () => {
        const art = r(1, 7), sp = ["⚽", "🏊", "🚴"], kl = ["2a", "2b", "2c"], w = kl.map(() => sp.map(() => r(1, 9)));
        if (art === 7) { const [thema, kat, namen] = wahl(UMFRAGEN), werte = kat.map(() => r(1, 10)), i = r(0, 3); // Diagramm anlegen: Strichliste zählen
          return zahl("", werte[i], `Zähle die Striche: Jede Fünfergruppe hat einen Querstrich. Das sind ${werte[i]} – so hoch wird die Säule.`,
            { frage: `${thema}: Die Säule für ${namen[i]} fehlt noch. Wie hoch musst du sie zeichnen?`, bild: saeulenBild(kat, werte, i, i), nurLuecke: true }); }
        if (art === 1) { const i = r(0, 2), j = r(0, 2); return zahl("", w[i][j], `Geh in der Zeile ${kl[i]} bis zur Spalte ${sp[j]}: ${w[i][j]}.`, { frage: `Wie viele Kinder der ${kl[i]} mögen ${sp[j]} am liebsten?`, bild: tabelleBild(sp, kl.map((k, i) => [k, ...w[i]])), nurLuecke: true }); }
        if (art === 2) { const i = r(0, 2), s = w[i].reduce((a, b) => a + b, 0); return zahl("", s, `${w[i].join(" + ")} = ${s}.`, { frage: `Wie viele Kinder der ${kl[i]} sind es zusammen?`, bild: tabelleBild(sp, kl.map((k, i) => [k, ...w[i]])), nurLuecke: true }); }
        if (art === 3) { const j = r(0, 2), sp2 = w.map(z => z[j]); if (new Set(sp2).size < 3) w[0][j] = Math.max(...sp2) + 1;
          const werte = w.map(z => z[j]), best = kl[werte.indexOf(Math.max(...werte))];
          return wahlAufgabe(`In welcher Klasse mögen die meisten Kinder ${sp[j]}?`, best, kl, `Vergleiche die Zahlen in der Spalte ${sp[j]}: ${werte.join(", ")}.`, { bild: tabelleBild(sp, kl.map((k, i) => [k, ...w[i]])) }); }
        if (art === 4) { const z = Math.random() < 0.5; return wahlAufgabe(`Wie heißt in einer Tabelle die ${z ? "waagerechte Reihe (von links nach rechts)" : "senkrechte Reihe (von oben nach unten)"}?`, z ? "Zeile" : "Spalte", ["Zeile", "Spalte", "Achse"], "Zeilen liegen wie die Zeilen im Heft, Spalten stehen wie Säulen."); }
        if (art === 5) { const k = ["🍎", "🍌", "🍓", "🍐"], v = mische([2, 4, 6, 8, 3, 5, 7, 9]).slice(0, 4), i = r(0, 3);
          return Math.random() < 0.5 ? zahl("", v[i], `Geh am Balken von ${k[i]} entlang bis zum Ende und lies unten ab: ${v[i]}.`, { frage: `Wie viele Kinder mögen ${k[i]} am liebsten?`, bild: balkenBild(k, v), nurLuecke: true })
            : wahlAufgabe("Welcher Balken ist am längsten?", k[v.indexOf(Math.max(...v))], k, "Der längste Balken reicht am weitesten nach rechts.", { bild: balkenBild(k, v) }); }
        const k = ["🍎", "🍌", "🍓"], liste = mische(Array.from({ length: r(8, 12) }, () => wahl(k))), f = wahl(k);
        if (!liste.includes(f)) liste[0] = f;
        return zahl("", liste.filter(x => x === f).length, `Mach für jedes ${f} einen Strich und zähle: ${liste.filter(x => x === f).length}.`, { frage: `Für eine Strichliste: Wie oft kommt ${f} vor?`, bild: emojiReihe(liste, 40), nurLuecke: true });
      } },
    { id: "figuren", lb: "rf", lz: ["ma.rf.03", "ma.rf.04"], name: "Figuren und Körper genau", icon: "🔷",
      neu: () => {
        const art = r(1, 7);
        if (art === 1) { const f = wahl(["fuenfeck", "sechseck"]); return wahlAufgabe("Die Figur hat mehr als 4 Ecken. Wie heißt sie?", "Vieleck", ["Viereck", "Kreis", "Dreieck"], "Figuren mit vielen geraden Seiten und Ecken heißen Vielecke.", { bild: formBild(f, "#C27BFF") }); }
        if (art === 2) { const fr = wahl([["Ist das ein Viereck?", "ja"], ["Ist das ein Rechteck?", "nein"], ["Ist das ein Quadrat?", "nein"]]);
          return wahlAufgabe(fr[0], fr[1], ["ja", "nein"], "Die Figur hat 4 Ecken – also ist sie ein Viereck. Ihre Ecken sind aber keine rechten Winkel, darum ist sie kein Rechteck und kein Quadrat.", { bild: viereckBild() }); }
        if (art === 3) { const rr = r(1, 9); return Math.random() < 0.5
          ? zahl("", 2 * rr, `Der Durchmesser ist doppelt so lang wie der Radius: 2 · ${rr} = ${2 * rr}.`, { frage: "Der Radius ist eingezeichnet. Wie lang ist der Durchmesser?", bild: kreisBild(rr, "r"), nurLuecke: true, einheit: "cm" })
          : zahl("", rr, `Der Radius ist halb so lang wie der Durchmesser: ${2 * rr} : 2 = ${rr}.`, { frage: "Der Durchmesser ist eingezeichnet. Wie lang ist der Radius?", bild: kreisBild(rr, "d"), nurLuecke: true, einheit: "cm" }); }
        if (art === 4) { const k = wahl(["wuerfel", "quader"]), was = wahl([["Ecken", 8], ["Kanten", 12], ["Flächen", 6]]);
          return zahl("", was[1], `Ein ${k === "wuerfel" ? "Würfel" : "Quader"} hat 8 Ecken, 12 Kanten und 6 Flächen.`, { frage: `Wie viele ${was[0]} hat ein ${k === "wuerfel" ? "Würfel" : "Quader"}?`, bild: formBild(k), nurLuecke: true }); }
        if (art === 5) { const s = wahl([["eine Pizza", "Kreis", ["Dreieck", "Quadrat", "Rechteck"]], ["ein Schuhkarton", "Quader", ["Kugel", "Würfel"]], ["ein Fußball", "Kugel", ["Würfel", "Quader"]], ["ein Spielwürfel", "Würfel", ["Kugel", "Quader"]], ["ein Fenster", "Rechteck", ["Kreis", "Dreieck"]]]);
          return wahlAufgabe(`Welche Form hat ${s[0]} meistens?`, s[1], s[2], `Such solche Dinge bei dir zu Hause: ${s[0]} – ${s[1]}.`); }
        if (art === 6) return wahlAufgabe("Welcher Körper kann rollen?", "Kugel", ["Würfel", "Quader"], "Eine Kugel ist rund und hat keine Ecken und Kanten – sie rollt.");
        return Math.random() < 0.5
          ? wahlAufgabe("Welche Flächen hat ein Würfel?", "nur Quadrate", ["Kreise", "Dreiecke"], "Ein Würfel hat 6 gleich große Quadrate.", { bild: formBild("wuerfel") })
          : wahlAufgabe("Ist ein Würfel ein besonderer Quader?", "ja", ["nein"], "Ja: Ein Würfel ist ein Quader, bei dem alle Kanten gleich lang sind.", { bild: formBild("wuerfel") });
      } },
    { id: "zeitspanne", lb: "gm", lz: ["ma.gm.06", "ma.gm.07"], name: "Zeitspannen", icon: "⏱️",
      neu: () => {
        const art = r(1, 8);
        if (art === 1) { const h = r(1, 12), m = r(1, 11) * 5, f = (hh, mm) => `${((hh - 1 + 12) % 12) + 1}:${String(mm).padStart(2, "0")}`;
          return wahlAufgabe("Wie spät ist es? (auf 5 Minuten genau)", f(h, m), [f(h, (m + 5) % 60), f(h, (m + 55) % 60), f(h + 1, m)], `Der kleine Zeiger zeigt die Stunde (${h}). Der große Zeiger: Jede Zahl auf der Uhr sind 5 Minuten – ${m / 5} · 5 = ${m}.`, { bild: uhrBild(h, m) }); }
        if (art === 2) { const a = r(7, 14), d = r(1, 5); return zahl("", d, `Zähle die Stunden: von ${a} bis ${a + d} Uhr sind ${d} Stunden.`, { frage: `Wie viele Stunden sind es von ${a} Uhr bis ${a + d} Uhr?`, nurLuecke: true, einheit: "h" }); }
        if (art === 3) { const h = r(8, 16), a = r(0, 6) * 5, b = r(a / 5 + 1, 11) * 5; return zahl("", b - a, `${b} ${M} ${a} = ${b - a} Minuten.`, { frage: `Wie viele Minuten sind es von ${uhrText(h, a)} bis ${uhrText(h, b)}?`, nurLuecke: true, einheit: "min" }); }
        if (art === 4) { const s = wahl([["1 Stunde", 60], ["eine halbe Stunde", 30], ["eine Viertelstunde", 15], ["drei Viertelstunden", 45], ["2 Stunden", 120]]); return zahl("", s[1], `1 Stunde hat 60 Minuten. ${s[0]} = ${s[1]} Minuten.`, { frage: `${s[0]} = wie viele Minuten?`, nurLuecke: true, einheit: "min" }); }
        if (art === 5) { const s = wahl([["Zähneputzen", "3 Minuten", ["3 Stunden", "3 Tage"]], ["ein Schultag", "5 Stunden", ["5 Minuten", "5 Tage"]], ["eine Hofpause", "20 Minuten", ["20 Stunden", "2 Minuten"]], ["die Sommerferien", "6 Wochen", ["6 Tage", "6 Stunden"]], ["ein Kinofilm", "2 Stunden", ["2 Minuten", "2 Tage"]]]);
          return wahlAufgabe(`Wie lange dauert ${s[0]} ungefähr?`, s[1], s[2], `Denk an deinen Alltag: ${s[0]} dauert etwa ${s[1]}.`); }
        if (art === 6) { const a = r(40, 59); return wahlAufgabe("Was dauert länger?", "1 Stunde", [`${a} Minuten`], `1 Stunde hat 60 Minuten – das ist mehr als ${a} Minuten.`); }
        if (art === 7) { const t = r(1, 21), mo = wahl(["März", "Mai", "Oktober"]), tag = wahl(TAGE);
          return Math.random() < 0.5 ? wahlAufgabe(`Der ${t}. ${mo} ist ein ${tag}. Welcher Tag ist der ${t + 7}. ${mo}?`, tag, TAGE.filter(x => x !== tag).slice(0, 3), "Eine Woche später ist wieder derselbe Wochentag.")
            : wahlAufgabe(`Welches Datum ist eine Woche nach dem ${t}. ${mo}?`, `${t + 7}. ${mo}`, [`${t + 1}. ${mo}`, `${t + 6}. ${mo}`, `${t + 10}. ${mo}`], "Eine Woche hat 7 Tage: Zähle 7 Tage weiter."); }
        const s = r(13, 17), d = r(1, 3); return wahlAufgabe(`Der Film beginnt um ${s} Uhr und dauert ${d} ${d === 1 ? "Stunde" : "Stunden"}. Wann ist er zu Ende?`, `${s + d} Uhr`, [`${s + d + 1} Uhr`, `${s + d - 1} Uhr`, `${s} Uhr`], `${s} + ${d} = ${s + d}.`);
      } },
    { id: "matheworte", lb: "zo", lz: ["ma.pk.06", "ma.pk.02"], name: "Mathe-Wörter", icon: "🗣️",
      neu: () => {
        const art = r(1, 8), b = r(2, 19); let a = r(21, 69); if (a === 2 * b) a++;
        if (art === 1) return zahl("", a + b, `Summe heißt: zusammenzählen. ${a} + ${b} = ${a + b}.`, { frage: `Wie groß ist die Summe von ${a} und ${b}?`, nurLuecke: true });
        if (art === 2) return zahl("", a - b, `Differenz heißt: der Unterschied. ${a} ${M} ${b} = ${a - b}.`, { frage: `Wie groß ist die Differenz von ${a} und ${b}?`, nurLuecke: true });
        if (art === 3) { const x = r(2, 10), y = r(2, 10); return zahl("", x * y, `Produkt heißt: malnehmen. ${x} · ${y} = ${x * y}.`, { frage: `Wie groß ist das Produkt von ${x} und ${y}?`, nurLuecke: true }); }
        if (art === 4) return wahlAufgabe(`${a} + ${b} = ${a + b}. Wie heißt ${a + b}?`, "Summe", ["Summand", "Differenz", "Produkt"], `${a} und ${b} sind die Summanden, ${a + b} ist die Summe.`);
        if (art === 5) { const w = wahl([["Minuend", a], ["Subtrahend", b], ["Differenz", a - b]]); return wahlAufgabe(`${a} ${M} ${b} = ${a - b}. Wie heißt ${w[1]}?`, w[0], ["Minuend", "Subtrahend", "Differenz", "Summe"], `Minuend ${M} Subtrahend = Differenz: ${a} ${M} ${b} = ${a - b}.`); }
        if (art === 6) { const x = r(2, 9), y = r(2, 9); return wahlAufgabe(`${x} · ${y} = ${x * y}. Wie heißen ${x} und ${y}?`, "Faktoren", ["Summanden", "Quotienten", "Produkte"], `Faktor · Faktor = Produkt.`); }
        if (art === 7) { const x = r(2, 9), y = wahl([2, 3, 4, 5, 6, 7, 8, 9].filter(v => v !== x)), w = wahl([["Dividend", x * y], ["Divisor", y], ["Quotient", x]]); return wahlAufgabe(`${x * y} : ${y} = ${x}. Wie heißt ${w[1]}?`, w[0], ["Dividend", "Divisor", "Quotient", "Faktor"], `Dividend : Divisor = Quotient: ${x * y} : ${y} = ${x}.`); }
        const n = r(5, 45); return Math.random() < 0.5 ? zahl("", 2 * n, `Das Doppelte: ${n} + ${n} = ${2 * n}.`, { frage: `Wie viel ist das Doppelte von ${n}?`, nurLuecke: true }) : zahl("", n, `Die Hälfte: ${2 * n} : 2 = ${n}.`, { frage: `Wie viel ist die Hälfte von ${2 * n}?`, nurLuecke: true });
      } },
    { id: "kombinieren2", lb: "dz", lz: ["ma.dz.05"], name: "Kombinieren", icon: "🧩",
      neu: () => {
        const art = r(1, 4);
        if (art === 1) { const a = r(2, 3), b = r(2, 3), o = ["👕", "👚", "🎽"].slice(0, a), u = ["👖", "🩳", "👗"].slice(0, b), n = wahl(NAMEN);
          return zahl("", a * b, `Zu jedem Oberteil passen ${b} Hosen: ${Array.from({ length: a }, () => b).join(" + ")} = ${a * b}. Leg alle Paare der Reihe nach.`, { frage: `${n} hat ${a} Oberteile und ${b} Hosen. Wie viele verschiedene Paare (Oberteil + Hose) gibt es?`, bild: emojiReihe([...o, " ", ...u]), nurLuecke: true }); }
        if (art === 2) { const k = r(2, 3), z = mische([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, k); return zahl("", k === 2 ? 2 : 6, k === 2 ? `${z[0]}${z[1]} und ${z[1]}${z[0]}: 2 Zahlen.` : `Jede Ziffer kann vorn stehen, dahinter je 2 andere: 3 · 2 = 6.`,
          { frage: `Wie viele verschiedene zweistellige Zahlen kannst du mit den Karten ${z.join(", ")} legen? (jede Karte nur einmal pro Zahl)`, nurLuecke: true }); }
        if (art === 3) { const k = r(3, 4); return zahl("", k === 3 ? 3 : 6, k === 3 ? "A mit B, A mit C, B mit C: 3 Mal." : "A–B, A–C, A–D, B–C, B–D, C–D: 6 Mal.", { frage: `${k} Kinder geben sich zur Begrüßung jeweils einmal die Hand. Wie oft werden Hände geschüttelt?`, bild: emojiReihe(["🙂", "😀", "😊", "🤗"].slice(0, k)), nurLuecke: true }); }
        return zahl("", 3, "Erdbeere-Vanille, Erdbeere-Schoko, Vanille-Schoko: 3. Die Reihenfolge ist egal.", { frage: "Es gibt 3 Eissorten. Du nimmst 2 verschiedene Kugeln. Wie viele verschiedene Becher sind möglich? (Reihenfolge egal)", bild: emojiReihe(["🍓", "🍦", "🍫"]), nurLuecke: true });
      } },
    { id: "spiegeln2", lb: "rf", lz: ["ma.rf.05", "ma.ms.01"], name: "Spiegeln und Muster", icon: "🦋",
      neu: () => {
        const art = r(1, 3);
        if (art === 1) { const ja = "AHIMOTUVWXY", nein = "FGJLNPRSZ", sym = Math.random() < 0.5, b = wahl((sym ? ja : nein).split(""));
          return wahlAufgabe("Ist der Buchstabe spiegelgleich zur roten Linie?", sym ? "ja" : "nein", ["ja", "nein"], sym ? "Ja: Falte in Gedanken an der Linie – beide Hälften liegen genau aufeinander." : "Nein: Beim Falten an der Linie passen die beiden Hälften nicht aufeinander.", { bild: buchstabeBild(b) }); }
        if (art === 2) return STATIONEN_K3.find(s => s.id === "k3spiegel").neu();
        const formen = mische(["🔺", "🔵", "🟩", "🟨", "⭐"]), art2 = wahl(["AB", "ABB", "ABC", "AAB"]), m = art2.split("").map(c => formen[c.charCodeAt(0) - 65]);
        const reihe = Array.from({ length: 7 }, (_, i) => m[i % m.length]), naechste = m[7 % m.length];
        return wahlAufgabe("Wie geht das Muster weiter?", naechste, formen.slice(0, 4), `Das Muster wiederholt sich: ${m.join(" ")} – dann geht es von vorn los.`, { bild: emojiReihe([...reihe, "❓"], 44) });
      } },
    { id: "detektiv", lb: "zo", lz: ["ma.zo.18", "ma.pk.04", "ma.pk.01"], name: "Sachaufgaben-Detektiv", icon: "🕵️",
      neu: () => {
        const art = r(1, 6), n = wahl(NAMEN), a = r(12, 40), b = r(3, 9);
        if (art === 1) { const fehlt = Math.random() < 0.5;
          return wahlAufgabe(fehlt ? `${n} kauft Äpfel. Ein Apfel kostet 30 ct. Wie viel muss ${n} bezahlen? – Kann man das ausrechnen?` : `${n} kauft ${b} Äpfel. Ein Apfel kostet 30 ct. Wie viel muss ${n} bezahlen? – Kann man das ausrechnen?`,
            fehlt ? "nein" : "ja", ["ja", "nein"], fehlt ? "Nein: Es steht nicht da, wie viele Äpfel gekauft werden." : `Ja: ${b} · 30 ct = ${b * 30} ct.`); }
        if (art === 2) { const s = wahl([[`${n} hat ${a} Murmeln und bekommt ${b} dazu.`, `${a} + ${b}`, [`${a} ${M} ${b}`, `${a} · ${b}`]], [`${n} hat ${a} Murmeln und verliert ${b}.`, `${a} ${M} ${b}`, [`${a} + ${b}`, `${a} : ${b}`]], [`${n} kauft ${b} Packungen mit je 4 Stiften.`, `${b} · 4`, [`${b} + 4`, `${b} ${M} 4`]]]);
          return wahlAufgabe(`Welche Rechnung passt? ${s[0]}`, s[1], s[2], "Lies genau: dazu → plus, weg/verliert → minus, je/jeweils → mal."); }
        if (art === 3) return wahlAufgabe(`Im Bus sitzen ${a} Kinder. ${b} steigen aus. Welche Frage kannst du mit der Rechnung ${a} ${M} ${b} beantworten?`, "Wie viele sitzen noch im Bus?", ["Wie alt ist der Fahrer?", "Wie schnell fährt der Bus?"], `${a} ${M} ${b} = ${a - b}: So viele Kinder sitzen noch im Bus.`);
        if (art === 4) { const p = r(2, 5), k = r(2, 6); return zahl("", p * k, `Menge und Preis: 1 Eis ${p} €, ${k} Eis ${k} · ${p} € = ${p * k} €.`, { frage: `1 Eis kostet ${p} €. Wie viel kosten ${k} Eis?`, nurLuecke: true, einheit: "€" }); }
        if (art === 5) { const x = r(2, 5), y = r(2, 5); return wahlAufgabe(`Welche Geschichte passt zu ${x} · ${y}?`, `${x} Teller mit je ${y} Keksen`, [`${x} Kekse und ${y} Kekse dazu`, `${x * y} Kekse, ${y} gegessen`], `Mal heißt: ${x}-mal gleich viel – ${x} Teller mit je ${y} Keksen.`); }
        const st = wahl([4, 5, 7, 8]), nimm = st % 3; return zahl("", nimm, `Lass deinem Partner 3 Steine übrig – dann gewinnst du immer: ${st} ${M} ${nimm} = 3.`, { frage: `Spiel: Ihr nehmt abwechselnd 1 oder 2 Steine. Wer den letzten Stein nimmt, gewinnt. Es liegen ${st} Steine, du bist dran. Wie viele nimmst du, damit du sicher gewinnst? (1 oder 2)`, bild: emojiReihe(Array.from({ length: st }, () => "🪨"), 40), nurLuecke: true });
      } },
    { id: "wuerfelbau2", lb: "rf", lz: ["ma.rf.06"], name: "Würfelgebäude", icon: "🧊",
      neu: () => { const h = wuerfelGebaeude(), summe = h.flat().reduce((x, y) => x + y, 0);
        if (Math.random() < 0.5) return zahl("", h[0][0], `Im Bauplan steht in jedem Feld, wie viele Würfel übereinander stehen. Hinten links: ${h[0][0]}.`, { frage: "Wie viele Würfel stehen hinten links übereinander? Schau in den Bauplan.", bild: gebaeudeBild(h, true), nurLuecke: true });
        return zahl("", summe, `Zähle Turm für Turm: ${h.flat().join(" + ")} = ${summe}.`, { frage: "Aus wie vielen Würfeln ist das Gebäude gebaut?", bild: gebaeudeBild(h, Math.random() < 0.6), nurLuecke: true }); } }
  ];
  STATIONEN.push(...STATIONEN_K2_NEU);

  // ---------- Sachsen Kl. 3 und 4 in voller Tiefe (Lehrplan Mathematik 2025): Lernbereiche und neue Stationen am Ende der Wege ----------
  // Neue Stationen tragen `zusatz: true` – die Kl.-4-Urkunde zählt nur die ursprünglichen Stationen, damit eine schon verdiente Urkunde erreichbar bleibt.
  const LB_K34 = { k3stellen: "zo", k3runden: "zo", k3plus: "zo", k3minus: "zo", k3gewicht: "gm", k3zeit: "gm", k3rest: "zo", k3bruch: "zo", k3laenge: "gm", k3geld: "gm",
    k3kombi: "dz", k3sach: "zo", k3schriftplus: "zo", k3schriftminus: "zo", k3netz: "rf", k3spiegel: "rf", k3diagramm: "dz", k3flaeche: "rf", k3wuerfelbau: "rf", k3zufall: "dz",
    k4million: "zo", k4runden: "zo", k4malschrift: "zo", k4geteilt: "zo", k4teilbar: "zo", k4geschickt: "zo", k4liter: "gm", k4flaeche: "rf", k4chance: "dz", k4roemisch: "zo",
    k4primzahl: "zo", k4massstab: "zo", k4zeit: "gm", k4plusviele: "zo", k4malmehr: "zo" };
  STATIONEN_K3.concat(STATIONEN_K4).forEach(s => { s.lb = s.lb || LB_K34[s.id]; });
  const tz = (n) => tausend(n);
  // Zahlenstrahl mit frei wählbarer Teilung: kurze Striche alle `klein`, beschriftete alle `gross`
  function strahlTeilung(a, b, klein, gross, n) {
    const w = 640, x0 = 30, k = (w - 2 * x0) / (b - a); let s = `<line x1="${x0 - 10}" y1="70" x2="${w - x0 + 14}" y2="70" stroke="${D}" stroke-width="3"/>`;
    for (let z = a; z <= b; z += klein) { const x = x0 + (z - a) * k, g = (z - a) % gross === 0;
      s += `<line x1="${x}" y1="${g ? 54 : 62}" x2="${x}" y2="${g ? 86 : 78}" stroke="${D}" stroke-width="${g ? 3 : 1.5}"/>` + (g ? `<text x="${x}" y="110" text-anchor="middle" font-size="19" fill="${D}" font-family="Fredoka, Arial">${tz(z)}</text>` : ""); }
    const xn = x0 + (n - a) * k; s += `<path d="M${xn} 50 l-11 -22 h22 Z" fill="#E5484D" stroke="${D}" stroke-width="2"/>`;
    return `<svg viewBox="0 0 ${w} 120" style="max-height:130px" role="img" aria-label="Zahlenstrahl">${s}</svg>`;
  }
  const zahlwort1000 = (n) => { const h = Math.floor(n / 100), rest = n % 100; return (h ? (h === 1 ? "einhundert" : EINER[h] + "hundert") : "") + (rest ? zahlwort(rest) : ""); };
  function koerperBild(k) {
    const f = `stroke="${D}" stroke-width="4" stroke-linejoin="round"`;
    const g = {
      pyramide: `<path d="M110 20 L40 140 L130 160 Z" fill="#F2A93B" ${f}/><path d="M110 20 L130 160 L180 125 Z" fill="#D9822B" ${f}/>` +
        `<path d="M40 140 L90 108 L180 125 M90 108 L110 20" fill="none" stroke="${D}" stroke-width="2.5" stroke-dasharray="7 6"/>`,
      kegel: `<ellipse cx="110" cy="145" rx="70" ry="20" fill="#9DD6F5" ${f}/><path d="M40 145 L110 20 L180 145" fill="#7BC4EE" ${f}/><path d="M40 145 A70 20 0 0 0 180 145" fill="#7BC4EE" ${f}/>`,
      zylinder: `<path d="M50 40 L50 140 A60 18 0 0 0 170 140 L170 40" fill="#A3E0B8" ${f}/><ellipse cx="110" cy="40" rx="60" ry="18" fill="#CFF3DD" ${f}/>`
    }[k];
    return `<svg viewBox="0 0 220 180" class="bild-uhr" role="img" aria-label="Körper">${g}</svg>`;
  }
  const VIERECKE = { quadrat: "M50 30 L150 30 L150 130 L50 130 Z", rechteck: "M20 45 L190 45 L190 125 L20 125 Z", parallelogramm: "M50 40 L200 40 L160 130 L10 130 Z",
    raute: "M105 15 L170 85 L105 155 L40 85 Z", trapez: "M60 40 L150 40 L195 130 L15 130 Z", drachen: "M105 15 L160 60 L105 160 L50 60 Z", viereck: "M30 140 L60 30 L175 55 L150 160 Z",
    rechtwinklig: "M40 140 L40 30 L180 140 Z", spitz: "M105 20 L180 140 L30 140 Z", stumpf: "M20 140 L80 70 L200 140 Z" };
  const NAMEN_V = { quadrat: "Quadrat", rechteck: "Rechteck", parallelogramm: "Parallelogramm", raute: "Raute", trapez: "Trapez", drachen: "Drachen", viereck: "allgemeines Viereck" };
  const vierBild = (k) => `<svg viewBox="0 0 210 170" class="bild-uhr" role="img" aria-label="Figur"><path d="${VIERECKE[k]}" fill="${["#7B9BFF", "#FFB03B", "#5CCBA6", "#F27BAA"][k.length % 4]}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/></svg>`;
  // Bandornament aus einem F: verschoben, gespiegelt oder gedreht
  const ORNAMENT_FORMEN = ["M0 0 h34 v9 h-25 v12 h18 v9 h-18 v26 h-9 Z", "M0 0 h10 v46 h24 v10 h-34 Z", "M0 0 h30 l-14 18 h18 l-24 38 l6 -28 h-16 Z", "M0 0 h20 a14 14 0 0 1 0 28 h-10 v28 h-10 Z", "M0 56 l17 -56 l17 56 h-10 l-7 -26 l-7 26 Z"];
  function ornamentBild(art, form = 0) {
    const F = ORNAMENT_FORMEN[form]; let s = "";
    for (let i = 0; i < 5; i++) { const x = 20 + i * 60, anders = i % 2 === 1, t = !anders || art === "verschoben" ? `translate(${x} 20)` : art === "gespiegelt" ? `translate(${x + 34} 20) scale(-1 1)` : `translate(${x + 34} 76) rotate(180)`;
      s += `<path d="${F}" transform="${t}" fill="#7B9BFF" stroke="${D}" stroke-width="2.5"/>`; }
    return `<svg viewBox="0 0 320 100" style="max-height:120px" role="img" aria-label="Bandornament">${s}</svg>`;
  }
  // Gestapeltes Säulendiagramm (zwei Teile je Säule)
  function stapelBild(kat, a, b) {
    const g = 16, x0 = 34, h = 15 * g; let s = "";
    for (let i = 0; i <= 15; i++) s += `<line x1="${x0}" y1="${8 + h - i * g}" x2="${x0 + kat.length * 70}" y2="${8 + h - i * g}" stroke="#e3dcef"/>` + (i % 5 === 0 ? `<text x="${x0 - 6}" y="${13 + h - i * g}" text-anchor="end" font-size="13" fill="${D}">${i}</text>` : "");
    kat.forEach((k, i) => { const x = x0 + 14 + i * 70;
      s += `<rect x="${x}" y="${8 + h - a[i] * g}" width="44" height="${a[i] * g}" fill="#7B9BFF" stroke="${D}" stroke-width="1.5"/><rect x="${x}" y="${8 + h - (a[i] + b[i]) * g}" width="44" height="${b[i] * g}" fill="#F27BAA" stroke="${D}" stroke-width="1.5"/><text x="${x + 22}" y="${h + 36}" text-anchor="middle" font-size="24">${k}</text>`; });
    s += `<line x1="${x0}" y1="8" x2="${x0}" y2="${8 + h}" stroke="${D}" stroke-width="2"/><line x1="${x0}" y1="${8 + h}" x2="${x0 + kat.length * 70}" y2="${8 + h}" stroke="${D}" stroke-width="2"/>` +
      `<rect x="${x0 + kat.length * 70 + 14}" y="20" width="18" height="18" fill="#7B9BFF"/><text x="${x0 + kat.length * 70 + 38}" y="35" font-size="15" fill="${D}">Jungen</text>` +
      `<rect x="${x0 + kat.length * 70 + 14}" y="48" width="18" height="18" fill="#F27BAA"/><text x="${x0 + kat.length * 70 + 38}" y="63" font-size="15" fill="${D}">Mädchen</text>`;
    return `<svg viewBox="0 0 ${x0 + kat.length * 70 + 110} ${h + 46}" style="max-height:240px" role="img" aria-label="Gestapeltes Säulendiagramm">${s}</svg>`;
  }
  // Figurierte Zahlen: Bild 1 bis 3 nebeneinander
  function figurBild(art) {
    let s = "", x = 10; const p = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="7" fill="#FFB03B" stroke="${D}" stroke-width="1.5"/>`;
    for (let n = 1; n <= 3; n++) { const pkt = art === "quadrat" ? Array.from({ length: n * n }, (_, i) => [i % n, Math.floor(i / n)])
        : art === "dreieck" ? [].concat(...Array.from({ length: n }, (_, r) => Array.from({ length: r + 1 }, (_, c) => [c, r])))
        : [].concat(Array.from({ length: n + 1 }, (_, i) => [0, i]), Array.from({ length: n }, (_, i) => [i + 1, n]));
      const breite = Math.max(...pkt.map(q => q[0])) + 1;
      s += pkt.map(([c, r]) => p(x + 10 + c * 18, 20 + r * 18 + (3 - (Math.max(...pkt.map(q => q[1])) + 1)) * 18)).join("") + `<text x="${x + breite * 9 + 1}" y="112" text-anchor="middle" font-size="14" fill="${D}">Bild ${n}</text>`;
      x += breite * 18 + 34; }
    return `<svg viewBox="0 0 ${x} 120" style="max-height:140px" role="img" aria-label="Punktmuster">${s}</svg>`;
  }
  const figurZahl = (art, n) => art === "quadrat" ? n * n : art === "dreieck" ? n * (n + 1) / 2 : 2 * n + 1;
  // Würfelgebäude: Ansicht von vorn (je Spalte der höchste Turm), Quader-Ergänzung
  const vonVorn = (h) => h[0].map((_, x) => Math.max(...h.map(z => z[x])));

  const STATIONEN_K3_NEU = [
    { id: "k3zahlen1000", lb: "zo", zusatz: true, stufe: "3", lz: ["ma.zo.12"], name: "Zahlen bis 1000 genau", icon: "🔢",
      neu: () => { const art = r(1, 7), n = r(101, 999);
        if (art === 1) { const m = r(1, 19) * 50; return zahl("", m, `Jeder lange Strich ist ein Hunderter, die kurzen liegen bei 50: ${m}.`, { frage: "Welche Zahl zeigt der Pfeil?", bild: strahlTeilung(0, 1000, 50, 100, m), nurLuecke: true, max: 4 }); }
        if (art === 2) { const a = r(1, 8) * 100, m = a + r(1, 9) * 10; return zahl("", m, `Von ${a} aus: Jeder kurze Strich ist 10 weiter. ${m}.`, { frage: "Welche Zahl zeigt der Pfeil?", bild: strahlTeilung(a, a + 100, 10, 50, m), nurLuecke: true }); }
        if (art === 3) return zahl("", n, `Hunderter zuerst, dann der Rest: ${zahlwort1000(n)} = ${n}.`, { frage: `Schreib die Zahl: „${zahlwort1000(n)}“`, nurLuecke: true });
        if (art === 4) { const u = Math.floor(n / 100) * 100; return wahlAufgabe(`Zwischen welchen Nachbarhundertern liegt ${n}?`, `${u} und ${u + 100}`, [`${u + 100} und ${u + 200}`, `${u - 100} und ${u}`, `${Math.floor(n / 10) * 10} und ${Math.floor(n / 10) * 10 + 10}`], `${n} hat ${u / 100} Hunderter.`); }
        if (art === 5) { const k = wahl([25, 50, 100, 20]), rueck = Math.random() < 0.5, st = rueck ? r(5, 9) * 100 : r(1, 5) * 100 + wahl([0, 25, 50]), f = [0, 1, 2, 3].map(i => rueck ? st - i * k : st + i * k);
          return zahl(`${f.join(", ")}, ?`, rueck ? st - 4 * k : st + 4 * k, `Immer ${rueck ? "minus" : "plus"} ${k}.`, { frage: `Zähle in ${k}er-Schritten ${rueck ? "rückwärts" : "weiter"}:` }); }
        if (art === 6) { const h = Math.floor(n / 100), z = Math.floor(n / 10) % 10, e = n % 10; return zahl(`${h * 100} + ${z * 10} + ${e}`, n, `${h} Hunderter, ${z} Zehner, ${e} Einer: ${n}.`); }
        const x = r(51, 499); return Math.random() < 0.5 ? zahl("", 2 * x, `Das Doppelte: ${x} + ${x} = ${2 * x}.`, { frage: `Wie viel ist das Doppelte von ${x}?`, nurLuecke: true }) : zahl("", x, `Halbiere Hunderter, Zehner und Einer: ${x}.`, { frage: `Wie viel ist die Hälfte von ${2 * x}?`, nurLuecke: true }); } },
    { id: "k3malgeteilt", lb: "zo", zusatz: true, stufe: "3", lz: ["ma.zo.11", "ma.zo.16"], name: "Mal und geteilt bis 1000", icon: "✖️",
      neu: () => { const art = r(1, 6), a = r(2, 9), b = r(2, 9);
        if (art === 1) return zahl(`${a * 10} · ${b}`, a * b * 10, `Kernaufgabe ${a} · ${b} = ${a * b}, dann mal 10: ${a * b * 10}.`);
        if (art === 2) return zahl(`${a * b * 10} : ${b}`, a * 10, `Denk an ${a * b} : ${b} = ${a} – also ${a * 10}.`);
        if (art === 3) { const k = r(3, 9); return zahl(`10 · ${k} = ${10 * k}, also 11 · ${k} = ?`, 11 * k, `Nachbaraufgabe: ein ${k} mehr – ${10 * k} + ${k} = ${11 * k}.`); }
        if (art === 4) { const z = r(11, 19), k = r(3, 9); return zahl(`${z} · ${k} = 10 · ${k} + ? · ${k}`, z - 10, `Zerlege ${z} in 10 und ${z - 10}: ${10 * k} + ${(z - 10) * k} = ${z * k}.`); }
        if (art === 5) { const q = r(12, 40), d = 5; return zahl(`${q * d} : 5 = ${q * d * 2} : ?`, 10, `Gleichsinnig verändern: Beide Zahlen verdoppeln – das Ergebnis bleibt ${q}.`); }
        const f = wahl([[25, 4], [50, 2], [20, 5]]), k = r(2, 9); return zahl(`${f[0]} · ${k * f[1]}`, f[0] * k * f[1], `Rechenvorteil: ${f[0]} · ${f[1]} = 100, also ${k} · 100 = ${k * 100}.`); } },
    { id: "k3vorteil", lb: "zo", zusatz: true, stufe: "3", lz: ["ma.zo.13", "ma.zo.16", "ma.ms.04"], name: "Rechenvorteile und Fehler", icon: "🔎",
      neu: () => { const art = r(1, 5);
        if (art === 1) { const a = r(2, 20), b = r(2, 9), c = r(2, 9); return zahl(`${a} + ${b} · ${c}`, a + b * c, `Punkt vor Strich: zuerst ${b} · ${c} = ${b * c}, dann ${a} + ${b * c} = ${a + b * c}.`); }
        if (art === 2) { const a = r(1, 8) * 100 + r(0, 20) - 10, b = r(1, 8) * 100 + r(0, 20) - 10; if (a + b > 990) return zahl(`${a} ${M} 100`, a - 100, `${a} ${M} 100 = ${a - 100}.`);
          const u = Math.round(a / 100) * 100 + Math.round(b / 100) * 100; return wahlAufgabe(`Überschlage: ${a} + ${b} ist ungefähr …`, u, [u + 100, u - 100, u + 200], `Runde auf Hunderter: ${Math.round(a / 100) * 100} + ${Math.round(b / 100) * 100} = ${u}.`); }
        if (art === 3) { const a = r(120, 480), b = r(110, 450), s = a + b, f = s + wahl([100, -100, 10, -10]);
          return wahlAufgabe(`${a} + ${b} = ${f} – stimmt das?`, "nein", ["ja", "nein"], `Prüfe mit der Umkehraufgabe: ${f} ${M} ${b} = ${f - b}, nicht ${a}. Richtig ist ${s}.`); }
        if (art === 4) { const a = r(3, 9) * 100 + r(10, 99), b = r(101, a - 50); return zahl(`${a} ${M} ${b} = ${a - b}. Probe: ${a - b} + ${b} = ?`, a, `Umkehrprobe: Plus macht das Minus rückgängig – es kommt ${a} heraus.`); }
        const a = r(11, 49), b = 100 - (a % 100 === 0 ? 1 : a), c = r(2, 9) * 10 + r(1, 9); return zahl(`${a} + ${c} + ${b}`, a + b + c, `Rechenvorteil: Erst ${a} + ${b} = 100, dann + ${c}.`); } },
    { id: "k3muster", lb: "zo", zusatz: true, stufe: "3", lz: ["ma.ms.04", "ma.zo.17"], name: "Zahlenfolgen, Mauern, Quersumme", icon: "🧮",
      neu: () => { const art = r(1, 5);
        if (art === 1) { const t = r(1, 3); let f;
          if (t === 1) { const s = r(1, 5), k = r(1, 3); f = [s]; for (let i = 0; i < 4; i++) f.push(f[i] * 2 + k); }
          else if (t === 2) { const a = r(1, 5), b = r(1, 8); f = [a, b]; while (f.length < 6) f.push(f[f.length - 1] + f[f.length - 2]); }
          else { const s = r(10, 90), k = r(11, 99); f = [0, 1, 2, 3, 4].map(i => s + i * k); }
          const ziel = f[f.length - 1], zeige = f.slice(0, -1); return zahl(`${zeige.join(", ")}, ?`, ziel, { 1: "Jede Zahl ist das Doppelte der Zahl davor und dann noch etwas dazu.", 2: "Jede Zahl ist die Summe der beiden Zahlen davor.", 3: `Immer plus ${f[1] - f[0]}.` }[t], { frage: "Wie geht die Zahlenfolge weiter?" }); }
        if (art === 2) { const u = [r(5, 60), r(5, 60), r(5, 60), r(5, 60)], m1 = [u[0] + u[1], u[1] + u[2], u[2] + u[3]], m2 = [m1[0] + m1[1], m1[1] + m1[2]], t = m2[0] + m2[1];
          return zahl("", t, `Rechne Reihe für Reihe nach oben: ${m1.join(", ")} – dann ${m2.join(", ")} – oben ${t}.`, { frage: "Zahlenmauer mit 4 Steinen unten: Was steht oben?", bild: mauerBild([u, m1, m2, [null]]), nurLuecke: true }); }
        if (art === 3) { const n = r(100, 999), q = String(n).split("").reduce((a, b) => a + +b, 0); return zahl("", q, `Quersumme: alle Ziffern addieren – ${String(n).split("").join(" + ")} = ${q}.`, { frage: `Wie groß ist die Quersumme von ${n}?`, nurLuecke: true }); }
        if (art === 4) { const t = Math.random() < 0.5, n = t ? 9 * r(12, 111) : 9 * r(12, 110) + r(1, 8), q = String(n).split("").reduce((a, b) => a + +b, 0);
          return wahlAufgabe(`Ist ${n} durch 9 teilbar?`, t ? "ja" : "nein", ["ja", "nein"], `Quersumme ${q}${t ? " ist durch 9 teilbar – also auch die Zahl." : " ist nicht durch 9 teilbar – also auch die Zahl nicht."}`); }
        const z = r(3, 9) * 100, a = r(50, z / 2), b = r(30, z - a - 20); return zahl(`${a} + ${b} + ? = ${z}`, z - a - b, `Zielzahl ${z}: ${z} ${M} ${a} ${M} ${b} = ${z - a - b}.`); } },
    { id: "k3koerper", lb: "rf", zusatz: true, stufe: "3", lz: ["ma.rf.04", "ma.rf.07"], name: "Pyramide, Kegel, Zylinder", icon: "🔺",
      neu: () => { const art = r(1, 5), K = { pyramide: "Pyramide", kegel: "Kegel", zylinder: "Zylinder" };
        if (art === 1) { const k = wahl(Object.keys(K)); return wahlAufgabe("Welcher Körper ist das?", K[k], [...Object.values(K), "Quader"], { pyramide: "Eine Pyramide hat unten ein Vieleck und oben eine Spitze.", kegel: "Ein Kegel hat unten einen Kreis und oben eine Spitze.", zylinder: "Ein Zylinder hat oben und unten je einen Kreis – wie eine Dose." }[k], { bild: koerperBild(k) }); }
        if (art === 2) { const s = wahl([["eine Eistüte", "Kegel"], ["eine Dose", "Zylinder"], ["ein Zeltdach", "Pyramide"], ["eine Kerze", "Zylinder"], ["ein Partyhut", "Kegel"], ["ein Turmdach", "Pyramide"]]);
          return wahlAufgabe(`Welchen Körper hat ${s[0]} ungefähr?`, s[1], ["Kegel", "Zylinder", "Pyramide", "Kugel"], `${s[0]} – ${s[1]}.`); }
        if (art === 3) { const w = wahl([["Ecken", 5], ["Kanten", 8], ["Flächen", 5]]); return zahl("", w[1], "Eine Pyramide mit quadratischer Grundfläche hat 5 Ecken, 8 Kanten und 5 Flächen.", { frage: `Wie viele ${w[0]} hat die Pyramide (unten ein Quadrat)?`, bild: koerperBild("pyramide"), nurLuecke: true }); }
        if (art === 4) { const s = wahl([["Kegel", "von oben", "Kreis"], ["Zylinder", "von der Seite", "Rechteck"], ["Zylinder", "von oben", "Kreis"], ["Pyramide", "von oben", "Quadrat"], ["Kegel", "von der Seite", "Dreieck"]]);
          return wahlAufgabe(`Du schaust ${s[1]} auf einen ${s[0]}. Welche Form siehst du?`, s[2], ["Kreis", "Rechteck", "Quadrat", "Dreieck"], `${s[0]} ${s[1]}: ${s[2]}.`, { bild: koerperBild(s[0].toLowerCase()) }); }
        const s = wahl([["Welcher Körper hat keine Spitze, kann aber rollen?", "Zylinder"], ["Welcher Körper hat eine Spitze und kann rollen?", "Kegel"], ["Welcher Körper hat eine Spitze und kann nicht rollen?", "Pyramide"]]);
        return wahlAufgabe(s[0], s[1], ["Kegel", "Zylinder", "Pyramide"], "Kegel und Zylinder haben eine runde Fläche – sie rollen. Pyramide und Kegel haben eine Spitze."); } },
    { id: "k3vierecke", lb: "rf", zusatz: true, stufe: "3", lz: ["ma.rf.03", "ma.rf.08"], name: "Parallelogramm und Dreiecke", icon: "▱",
      neu: () => { const art = r(1, 4);
        if (art === 1) { const k = wahl(["parallelogramm", "parallelogramm", "rechteck", "quadrat", "viereck"]); return wahlAufgabe("Wie heißt das Viereck?", NAMEN_V[k], ["Parallelogramm", "Rechteck", "Quadrat", "allgemeines Viereck"], "Beim Parallelogramm sind die gegenüberliegenden Seiten parallel und gleich lang, die Ecken sind aber nicht rechtwinklig.", { bild: vierBild(k) }); }
        if (art === 2) { const s = wahl([["Beim Parallelogramm sind gegenüberliegende Seiten parallel.", "ja"], ["Ein Parallelogramm hat immer vier rechte Winkel.", "nein"], ["Jedes Rechteck ist auch ein Parallelogramm.", "ja"], ["Ein Parallelogramm hat drei Ecken.", "nein"]]);
          return wahlAufgabe(`Stimmt das? ${s[0]}`, s[1], ["ja", "nein"], "Parallelogramm: zwei Paare paralleler Seiten. Hat es zusätzlich rechte Winkel, ist es ein Rechteck."); }
        if (art === 3) { const k = wahl(["rechtwinklig", "spitz", "stumpf"]); return wahlAufgabe("Hat das Dreieck einen rechten Winkel?", k === "rechtwinklig" ? "ja" : "nein", ["ja", "nein"], "Halte eine Blattecke an die Ecken: Passt sie genau, ist es ein rechter Winkel.", { bild: `<svg viewBox="0 0 210 170" class="bild-uhr" role="img" aria-label="Dreieck"><path d="${VIERECKE[k]}" fill="#5CCBA6" stroke="${D}" stroke-width="5" stroke-linejoin="round"/></svg>` }); }
        const w = wahl([["Rechteck", 4], ["Dreieck", 3], ["Parallelogramm", 4]]); return zahl("", w[1], `Ein ${w[0]} hat ${w[1]} Ecken.`, { frage: `Wie viele Ecken hat ein ${w[0]}?`, nurLuecke: true }); } },
    { id: "k3ornament", lb: "rf", zusatz: true, stufe: "3", lz: ["ma.rf.05", "ma.ms.04"], name: "Bandornamente", icon: "🎀",
      neu: () => { const art = wahl(["verschoben", "gespiegelt", "gedreht"]), form = r(0, ORNAMENT_FORMEN.length - 1);
        if (Math.random() < 0.3) return wahlAufgabe("Wie geht das Band weiter? Die nächste Figur ist …", art === "verschoben" ? "genauso wie die erste" : art === "gespiegelt" ? "gespiegelt wie die zweite" : "gedreht wie die zweite",
          ["genauso wie die erste", "gespiegelt wie die zweite", "gedreht wie die zweite"].filter(x => x !== (art === "verschoben" ? "genauso wie die erste" : art === "gespiegelt" ? "gespiegelt wie die zweite" : "gedreht wie die zweite")),
          "Im Band wiederholt sich immer dasselbe Paar. Nach fünf Figuren käme als sechste die Form der zweiten.", { bild: ornamentBild(art, form), frage: art === "verschoben" ? "Das Band ist verschoben. Die nächste Figur ist …" : "Wie geht das Band weiter? Die sechste Figur ist …" });
        return wahlAufgabe("Wie wurde die Figur im Band bewegt?", art, ["verschoben", "gespiegelt", "gedreht"], { verschoben: "Verschoben: Die Figur sieht immer gleich aus, sie rutscht nur weiter.", gespiegelt: "Gespiegelt: Jede zweite Figur ist wie im Spiegel umgeklappt.", gedreht: "Gedreht: Jede zweite Figur steht auf dem Kopf – sie wurde halb herumgedreht." }[art], { bild: ornamentBild(art, form) }); } },
    { id: "k3ansicht", lb: "rf", zusatz: true, stufe: "3", lz: ["ma.rf.06", "ma.rf.02"], name: "Würfelgebäude: Ansichten", icon: "👀",
      neu: () => { const h = wuerfelGebaeude(), art = r(1, 3), summe = h.flat().reduce((a, b) => a + b, 0);
        if (art === 1) { const v = vonVorn(h).join(" – "), f1 = vonVorn(h).slice().reverse().join(" – "), f2 = h[1].join(" – "), f3 = h[0].map(x => x + 1).join(" – ");
          return wahlAufgabe("Du schaust von vorn auf das Gebäude. Wie hoch sind die Türme von links nach rechts?", v, [f1, f2, f3], `Von vorn siehst du in jeder Spalte den höchsten Turm: ${v}.`, { bild: gebaeudeBild(h, true) }); }
        if (art === 2) { const max = Math.max(...h.flat()), quader = max * h.length * h[0].length; return zahl("", quader - summe, `Ein Quader wäre ${h.length} · ${h[0].length} · ${max} = ${quader} Würfel. Es sind ${summe}, also fehlen ${quader - summe}.`, { frage: "Wie viele Würfel fehlen, bis es ein vollständiger Quader ist (so hoch wie der höchste Turm)?", bild: gebaeudeBild(h, true), nurLuecke: true }); }
        return zahl("", h.length * h[0].length, `Von oben siehst du jedes Feld des Bauplans einmal: ${h.length} · ${h[0].length} = ${h.length * h[0].length}.`, { frage: "Du schaust von oben auf das Gebäude. Wie viele Quadrate siehst du?", bild: gebaeudeBild(h, false), nurLuecke: true }); } },
    { id: "k3groessen", lb: "gm", zusatz: true, stufe: "3", lz: ["ma.gm.08", "ma.gm.05"], name: "Größen genauer", icon: "⚖️",
      neu: () => { const art = r(1, 8);
        if (art === 1) { const k = r(1, 4), m = r(1, 9) * 100; return zahl(`${k} km ${m} m = ? m`, k * 1000 + m, `1 km = 1000 m: ${k * 1000} m + ${m} m.`, { max: 4 }); }
        if (art === 2) { const k = r(1, 4), m = wahl([5, 25, 75, 2]); return zahl(`${k},${String(m).padEnd(1, "0")} km = ? m`, k * 1000 + (m < 10 ? m * 100 : m * 10), `Nach dem Komma stehen die Hunderter-Meter: ${k},${m} km = ${k * 1000 + (m < 10 ? m * 100 : m * 10)} m.`, { max: 4 }); }
        if (art === 3) { const s = wahl([["einen halben Kilometer", 500, "m"], ["ein halbes Kilogramm", 500, "g"], ["einen halben Meter", 50, "cm"], ["einen halben Zentimeter", 5, "mm"]]); return zahl("", s[1], `Die Hälfte: ${s[1]} ${s[2]}.`, { frage: `Wie viel ${s[2]} sind ${s[0]}?`, nurLuecke: true, einheit: s[2] }); }
        if (art === 4) { const k = r(1, 5), g = r(1, 9) * 100 + wahl([0, 50]); return zahl(`${k} kg ${g} g = ? g`, k * 1000 + g, `1 kg = 1000 g: ${k * 1000} g + ${g} g.`, { max: 4 }); }
        if (art === 5) { const s = wahl([["1 Minute", 60], ["2 Minuten", 120], ["eine halbe Minute", 30], ["eine Viertelstunde", 15 * 60]]); return zahl("", s[1], `1 Minute hat 60 Sekunden. ${s[0]} = ${s[1]} s.`, { frage: `Wie viele Sekunden sind ${s[0]}?`, nurLuecke: true, einheit: "s" }); }
        if (art === 6) { const s = wahl([["einmal in die Hände klatschen", "1 Sekunde", ["1 Minute", "1 Stunde"]], ["ein Lied", "3 Minuten", ["3 Sekunden", "3 Stunden"]], ["ein Paket Mehl", "1 kg", ["1 g", "100 kg"]], ["eine Tafel Schokolade", "100 g", ["100 kg", "1 g"]], ["1 km gehen", "15 Minuten", ["15 Sekunden", "15 Stunden"]]]);
          return wahlAufgabe(`Was passt? ${s[0]}`, s[1], s[2], `Stützpunkt: ${s[0]} – etwa ${s[1]}.`); }
        if (art === 7) { const w = wahl([["¼ h", 15], ["½ h", 30], ["¾ h", 45]]); return zahl("", w[1], `1 h = 60 min. ${w[0]} = ${w[1]} min.`, { frage: `${w[0]} = wie viele Minuten?`, nurLuecke: true, einheit: "min" }); }
        const h = r(7, 16), a = r(0, 50), d = r(5, 59 - a), n = wahl(NAMEN); return zahl("", d, `Von ${uhrText(h, a)} bis ${uhrText(h, a + d)}: ${a + d} ${M} ${a} = ${d} Minuten.`, { frage: `${n} startet um ${uhrText(h, a)} und kommt um ${uhrText(h, a + d)} an. Wie viele Minuten dauert der Weg?`, nurLuecke: true, einheit: "min" }); } },
    { id: "k3daten", lb: "dz", zusatz: true, stufe: "3", lz: ["ma.dz.05", "ma.dz.06", "ma.dz.07"], name: "Fahrplan, Möglichkeiten, Zufall", icon: "🚌",
      neu: () => { const art = r(1, 5);
        if (art <= 2) { const halte = ["🏠 Dorf", "🌳 Park", "🏫 Schule", "🏪 Markt"], start = [r(6, 7), r(0, 5) * 10], fahrt = [0, r(3, 6), r(3, 6), r(2, 5)];
          const busse = [0, 1, 2].map(b => { let m = start[0] * 60 + start[1] + b * 20; return fahrt.map(d => { m += d; return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`; }); });
          const bild = tabelleBild(["Bus 1", "Bus 2", "Bus 3"], halte.map((hh, i) => [hh.split(" ")[0], ...busse.map(b => b[i])]));
          if (art === 1) { const b = r(0, 2), i = r(1, 3); return wahlAufgabe(`Fahrplan: Wann kommt Bus ${b + 1} an der Haltestelle ${halte[i]} an?`, busse[b][i], [busse[(b + 1) % 3][i], busse[b][i - 1], busse[b][(i % 3) + 1]], "Suche die Spalte des Busses und die Zeile der Haltestelle.", { bild }); }
          const d = fahrt[1] + fahrt[2] + fahrt[3]; return zahl("", d, `Bus 1 fährt um ${busse[0][0]} ab und ist um ${busse[0][3]} am Markt: ${d} Minuten.`, { frage: "Fahrplan: Wie viele Minuten fährt Bus 1 vom Dorf (🏠) bis zum Markt (🏪)?", bild, nurLuecke: true, einheit: "min" }); }
        if (art === 3) { const a = r(2, 4), b = r(2, 3); return zahl("", a * b, `Tachometer-Prinzip: Das hintere Rad dreht sich zuerst durch – zu jeder Zahl vorn gibt es ${b} Möglichkeiten hinten: ${a} · ${b} = ${a * b}.`, { frage: `Ein Zahlenschloss hat vorn ein Rad mit den Zahlen 1 bis ${a} und hinten eins mit 1 bis ${b}. Wie viele verschiedene Codes gibt es?`, nurLuecke: true }); }
        if (art === 4) { const rot = r(1, 6), blau = r(1, 6) + (rot === 4 ? 1 : 0), gelb = r(0, 3); const m = Math.max(rot, blau, gelb); if ([rot, blau, gelb].filter(x => x === m).length > 1) return zahl("", rot + blau + gelb, "Zähle alle Kugeln.", { frage: `Im Beutel sind ${rot} rote, ${blau} blaue und ${gelb} gelbe Kugeln. Wie viele Kugeln sind es?`, nurLuecke: true });
          const sieger = m === rot ? "Rot" : m === blau ? "Blau" : "Gelb"; return wahlAufgabe(`Im Beutel sind ${rot} rote, ${blau} blaue und ${gelb} gelbe Kugeln. Welche Farbe ziehst du am wahrscheinlichsten?`, sieger, ["Rot", "Blau", "Gelb"], `Je mehr Kugeln einer Farbe, desto wahrscheinlicher: ${sieger}.`); }
        return wahlAufgabe("Welche Frage kannst du mit einer Strichliste der Lieblingstiere deiner Klasse beantworten?", "Welches Tier ist am beliebtesten?", ["Wie alt ist die Lehrerin?", "Wie heißt der Hund?"], "Eine Strichliste zählt, wie oft etwas gewählt wurde."); } }
  ];
  STATIONEN_K3.push(...STATIONEN_K3_NEU);

  const STATIONEN_K4_NEU = [
    { id: "k4vierecke", lb: "rf", zusatz: true, stufe: "4", lz: ["ma.rf.09", "ma.rf.03"], name: "Haus der Vierecke", icon: "🏠",
      neu: () => { const art = r(1, 4);
        if (art === 1) { const k = wahl(Object.keys(NAMEN_V)); return wahlAufgabe("Wie heißt das Viereck?", NAMEN_V[k], Object.values(NAMEN_V).filter(x => x !== NAMEN_V[k]).sort(() => Math.random() - 0.5), "Trapez: ein Paar parallele Seiten. Parallelogramm: zwei Paare. Raute: alle Seiten gleich lang. Drachen: je zwei benachbarte Seiten gleich lang.", { bild: vierBild(k) }); }
        if (art === 2) { const s = wahl([["Jedes Quadrat ist auch ein Rechteck.", "ja"], ["Jedes Rechteck ist auch ein Quadrat.", "nein"], ["Jedes Quadrat ist auch eine Raute.", "ja"], ["Jedes Parallelogramm ist auch ein Trapez.", "ja"], ["Jedes Trapez ist auch ein Parallelogramm.", "nein"], ["Eine Raute hat vier gleich lange Seiten.", "ja"], ["Ein Drachen hat immer vier rechte Winkel.", "nein"]]);
          return wahlAufgabe(`Haus der Vierecke – stimmt das? ${s[0]}`, s[1], ["ja", "nein"], "Im Haus der Vierecke steht unten das Quadrat: Es ist gleichzeitig Rechteck, Raute, Parallelogramm, Trapez und Drachen."); }
        if (art === 3) { const k = wahl(["rechtwinklig", "spitz", "stumpf", "rechtwinklig"]); return wahlAufgabe("Hat das Dreieck einen rechten Winkel?", k === "rechtwinklig" ? "ja" : "nein", ["ja", "nein"], "Prüfe mit dem Geodreieck oder einer Blattecke.", { bild: `<svg viewBox="0 0 210 170" class="bild-uhr" role="img" aria-label="Dreieck"><path d="${VIERECKE[k]}" fill="#F27BAA" stroke="${D}" stroke-width="5" stroke-linejoin="round"/></svg>` }); }
        const s = wahl([["Wie viele Paare paralleler Seiten hat ein Trapez mindestens?", 1], ["Wie viele Paare paralleler Seiten hat ein Parallelogramm?", 2], ["Wie viele rechte Winkel hat ein Rechteck?", 4], ["Wie viele gleich lange Seiten hat eine Raute?", 4]]);
        return zahl("", s[1], "Denk an das Haus der Vierecke.", { frage: s[0], nurLuecke: true }); } },
    { id: "k4vergroessern", lb: "rf", zusatz: true, stufe: "4", lz: ["ma.rf.09"], name: "Vergrößern und Verkleinern", icon: "🔍",
      neu: () => { const a = r(2, 6), b = r(2, 6), f = wahl([2, 3]), art = r(1, 3);
        if (art === 1) return zahl("", a * f, `Beim Vergrößern mit ${f} wird jede Seite ${f}-mal so lang: ${a} · ${f} = ${a * f}.`, { frage: `Ein Rechteck ist ${a} Kästchen lang und ${b} breit. Du vergrößerst es ${f === 2 ? "doppelt" : "dreifach"}. Wie lang wird es?`, bild: kaestchenBild(Array.from({ length: a * b }, (_, i) => [Math.floor(i / a), i % a]), true), nurLuecke: true });
        if (art === 2) return wahlAufgabe(`Welches Rechteck ist doppelt so groß wie ${a} × ${b}?`, `${2 * a} × ${2 * b}`, [`${2 * a} × ${b}`, `${a + 2} × ${b + 2}`, `${a * b} × 2`], "Beim Vergrößern werden ALLE Seiten im gleichen Verhältnis länger.");
        const A = a * 2, B = b * 2; return zahl("", b, `Halbieren: ${B} : 2 = ${b}.`, { frage: `Ein Rechteck ist ${A} cm lang und ${B} cm breit. Du verkleinerst es auf die Hälfte. Wie breit wird es?`, nurLuecke: true, einheit: "cm" }); } },
    { id: "k4volumen", lb: "rf", zusatz: true, stufe: "4", lz: ["ma.rf.09", "ma.gm.09"], name: "Volumen und Flächen", icon: "📦",
      neu: () => { const art = r(1, 4);
        if (art <= 2) { const zeilen = r(2, 3), sp = r(2, 4), h = r(1, 3), H = Array.from({ length: zeilen }, () => Array.from({ length: sp }, () => h));
          return art === 1 ? zahl("", zeilen * sp * h, `Eine Schicht hat ${zeilen} · ${sp} = ${zeilen * sp} Würfel, ${h} Schichten: ${zeilen * sp * h}.`, { frage: "Wie viele Einheitswürfel hat der Quader? (Er ist innen voll.)", bild: gebaeudeBild(H, false), nurLuecke: true })
            : zahl("", zeilen * sp, `Eine Schicht: ${zeilen} Reihen mit je ${sp} Würfeln = ${zeilen * sp}.`, { frage: "Wie viele Würfel liegen in der untersten Schicht?", bild: gebaeudeBild(H, false), nurLuecke: true }); }
        if (art === 3) { const s = wahl([["ein Blatt Papier (DIN A4)", "600 cm²", ["6 cm²", "6 m²"]], ["ein Klassenzimmer", "60 m²", ["60 cm²", "6 m²"]], ["eine Briefmarke", "6 cm²", ["6 m²", "600 cm²"]], ["ein Fußballfeld", "7000 m²", ["70 m²", "7000 cm²"]]]);
          return wahlAufgabe(`Wie groß ist ${s[0]} ungefähr?`, s[1], s[2], `Stützpunkt: ${s[0]} – etwa ${s[1]}.`); }
        const a = r(3, 9), b = r(2, 8); return zahl("", 2 * (a + b), `Umfang: alle Seiten zusammen – ${a} + ${b} + ${a} + ${b} = ${2 * (a + b)}.`, { frage: `Ein Rechteck ist ${a} m lang und ${b} m breit. Wie lang ist der Umfang?`, nurLuecke: true, einheit: "m" }); } },
    { id: "k4parkett", lb: "rf", zusatz: true, stufe: "4", lz: ["ma.rf.05", "ma.ms.04"], name: "Parkette und Drehungen", icon: "🧩",
      neu: () => { const art = r(1, 3);
        if (art === 1) { const s = wahl([["Quadrat", "ja"], ["Rechteck", "ja"], ["gleichseitiges Dreieck", "ja"], ["Sechseck (Bienenwabe)", "ja"], ["Kreis", "nein"], ["Fünfeck (regelmäßig)", "nein"]]);
          return wahlAufgabe(`Kann man mit lauter gleichen Formen „${s[0]}“ eine Fläche ohne Lücken auslegen (parkettieren)?`, s[1], ["ja", "nein"], s[1] === "ja" ? "Ja: Die Formen passen an jeder Ecke ohne Lücke zusammen." : "Nein: Es bleiben immer Lücken."); }
        if (art === 2) { const s = wahl([["ein Quadrat", 4], ["ein gleichseitiges Dreieck", 3], ["ein Rechteck (kein Quadrat)", 2], ["ein regelmäßiges Sechseck", 6]]);
          return zahl("", s[1], `Drehsymmetrie: ${s[0]} passt bei einer ganzen Umdrehung ${s[1]}-mal genau auf sich selbst.`, { frage: `Du drehst ${s[0]} einmal ganz herum. Wie oft passt es dabei genau auf sich selbst?`, nurLuecke: true }); }
        return STATIONEN_K3_NEU.find(s => s.id === "k3ornament").neu(); } },
    { id: "k4tonne", lb: "gm", zusatz: true, stufe: "4", lz: ["ma.gm.09", "ma.gm.10"], name: "Tonne, Kilogramm, Gramm", icon: "🚛",
      neu: () => { const art = r(1, 6);
        if (art === 1) { const t = r(1, 9); return zahl(`${t} t = ? kg`, t * 1000, `1 t = 1000 kg.`, { max: 4 }); }
        if (art === 2) { const t = r(1, 9), k = r(1, 9) * 100; return zahl(`${t} t ${k} kg = ? kg`, t * 1000 + k, `${t * 1000} kg + ${k} kg.`, { max: 4 }); }
        if (art === 3) { const t = r(1, 5), k = wahl([5, 25, 75]); return zahl(`${t},${k} t = ? kg`, t * 1000 + (k === 5 ? 500 : k * 10), `Nach dem Komma: ${k === 5 ? "500" : k * 10} kg.`, { max: 4 }); }
        if (art === 4) { const w = wahl([["¼ kg", 250, "g"], ["½ kg", 500, "g"], ["¾ kg", 750, "g"], ["½ t", 500, "kg"], ["¼ t", 250, "kg"]]); return zahl("", w[1], `1 ${w[0].slice(2)} = 1000 ${w[2]}, ${w[0]} = ${w[1]} ${w[2]}.`, { frage: `${w[0]} = wie viel ${w[2]}?`, nurLuecke: true, einheit: w[2] }); }
        if (art === 5) { const s = wahl([["ein Auto", "1 t", ["1 kg", "100 t"]], ["ein Pferd", "500 kg", ["50 kg", "5 t"]], ["eine Kuh", "600 kg", ["60 kg", "6 t"]], ["ein Lastwagen", "20 t", ["20 kg", "200 kg"]], ["ein Apfel", "150 g", ["15 kg", "1 g"]]]);
          return wahlAufgabe(`Wie schwer ist ${s[0]} ungefähr?`, s[1], s[2], `Stützpunkt: ${s[0]} wiegt etwa ${s[1]}.`); }
        const n = r(3, 8), k = r(2, 9) * 50; return zahl("", n * k, `${n} · ${k} kg = ${n * k} kg.`, { frage: `Ein Aufzug trägt ${n} Kisten mit je ${k} kg. Wie viele kg sind das?`, nurLuecke: true, einheit: "kg", max: 4 }); } },
    { id: "k4reise", lb: "gm", zusatz: true, stufe: "4", lz: ["ma.gm.08", "ma.gm.04", "ma.zo.18"], name: "Reiseplanung", icon: "🧳",
      neu: () => { const art = r(1, 5);
        if (art === 1) { const ab = [r(8, 14), r(0, 11) * 5], d = r(35, 150), an = ab[0] * 60 + ab[1] + d; return wahlAufgabe(`Der Zug fährt um ${uhrText(ab[0], ab[1])} ab und braucht ${Math.floor(d / 60) ? `${Math.floor(d / 60)} h ` : ""}${d % 60} min. Wann kommt er an?`,
          uhrText(Math.floor(an / 60), an % 60), [uhrText(Math.floor(an / 60) + 1, an % 60), uhrText(Math.floor((an - 10) / 60), (an - 10) % 60), uhrText(Math.floor((an + 30) / 60), (an + 30) % 60)], "Erst die vollen Stunden, dann die Minuten dazurechnen – über die volle Stunde hinaus."); }
        if (art === 2) { const e = r(6, 12), k = r(3, 6), ne = r(1, 2), nk = r(1, 3), s = ne * e + nk * k; return zahl("", s, `${ne} · ${e} € + ${nk} · ${k} € = ${s} €.`, { frage: `Preistafel Zoo: Erwachsene ${e} €, Kinder ${k} €. Was zahlen ${ne} ${ne === 1 ? "Erwachsener" : "Erwachsene"} und ${nk} ${nk === 1 ? "Kind" : "Kinder"}?`, nurLuecke: true, einheit: "€" }); }
        if (art === 3) { const a = r(1, 4) * 1000 + r(1, 9) * 100, b = r(1, 3) * 1000 + r(1, 9) * 100; return zahl("", a + b, `${tz(a)} m + ${tz(b)} m = ${tz(a + b)} m.`, { frage: `Wanderkarte: Vom Parkplatz zur Hütte sind es ${tz(a)} m, von der Hütte zum Gipfel ${tz(b)} m. Wie viele Meter sind es zusammen?`, nurLuecke: true, einheit: "m", max: 4 }); }
        if (art === 4) { const w = wahl([["¾ km", 750, "m"], ["¼ km", 250, "m"], ["¾ h", 45, "min"], ["¼ l", 250, "ml"], ["¾ l", 750, "ml"]]); return zahl("", w[1], `${w[0]} = ${w[1]} ${w[2]}.`, { frage: `${w[0]} = wie viele ${w[2]}?`, nurLuecke: true, einheit: w[2] }); }
        const tag = r(1, 19), d = r(5, 12), mo = wahl(["Juli", "August"]); return zahl("", tag + d, `${tag} + ${d} = ${tag + d}.`, { frage: `Die Ferienreise beginnt am ${tag}. ${mo} und dauert ${d} Tage. An welchem Tag im ${mo} kommt ihr zurück? (Rückreisetag = Starttag + ${d})`, nurLuecke: true }); } },
    { id: "k4diagramme", lb: "dz", zusatz: true, stufe: "4", lz: ["ma.dz.06", "ma.dz.07", "ma.dz.05"], name: "Diagramme, Baum, Würfel", icon: "🌳",
      neu: () => { const art = r(1, 6), kat = ["⚽", "🏊", "🎨", "🎵"], a = kat.map(() => r(1, 7)), b = kat.map(() => r(1, 7));
        if (art === 1) { const i = r(0, 3); return zahl("", a[i] + b[i], `Die Säule ist ${a[i]} (Jungen) + ${b[i]} (Mädchen) = ${a[i] + b[i]} hoch.`, { frage: `Gestapeltes Säulendiagramm: Wie viele Kinder wählen ${kat[i]} insgesamt?`, bild: stapelBild(kat, a, b), nurLuecke: true }); }
        if (art === 2) { const i = r(0, 3); return zahl("", b[i], `Lies den rosa Teil: von ${a[i]} bis ${a[i] + b[i]} – das sind ${b[i]}.`, { frage: `Wie viele Mädchen wählen ${kat[i]}?`, bild: stapelBild(kat, a, b), nurLuecke: true }); }
        if (art === 3) return wahlAufgabe("Welche Frage kann das Diagramm NICHT beantworten?", "Warum mögen sie das?", ["Wie viele Jungen wählen ⚽?", "Was wählen die meisten?"], "Das Diagramm zählt nur, WAS gewählt wurde – nicht WARUM. Dafür müsste man nachfragen.", { bild: stapelBild(kat, a, b) });
        if (art === 4) { const x = r(2, 4), y = r(2, 3), z = r(2, 3); return zahl("", x * y * z, `Baumdiagramm: ${x} Äste, an jedem ${y}, an jedem davon ${z} – ${x} · ${y} · ${z} = ${x * y * z}.`, { frage: `Zum Frühstück gibt es ${x} Brotsorten, ${y} Aufstriche und ${z} Getränke. Wie viele verschiedene Frühstücke (je eins von allem) gibt es?`, nurLuecke: true }); }
        if (art === 5) { const s = wahl([["Wie viele verschiedene Ergebnisse (erster Würfel, zweiter Würfel) gibt es mit zwei Würfeln?", 36, "6 · 6 = 36."], ["Bei wie vielen der 36 Würfe ist die Augensumme 12?", 1, "Nur 6 + 6."], ["Bei wie vielen der 36 Würfe ist die Augensumme 7?", 6, "1+6, 2+5, 3+4, 4+3, 5+2, 6+1."], ["Bei wie vielen der 36 Würfe ist die Augensumme 2?", 1, "Nur 1 + 1."]]);
          return zahl("", s[1], s[2], { frage: s[0], nurLuecke: true }); }
        const s = wahl([["Mit einem Würfel: eine 6 oder eine 1 zu würfeln ist …", "gleich wahrscheinlich", ["6 wahrscheinlicher", "1 wahrscheinlicher"]], ["Mit zwei Würfeln: Augensumme 7 oder Augensumme 12 – was ist wahrscheinlicher?", "Summe 7", ["Summe 12", "gleich wahrscheinlich"]], ["Münze werfen: Kopf oder Zahl ist …", "gleich wahrscheinlich", ["Kopf wahrscheinlicher", "Zahl wahrscheinlicher"]]]);
        return wahlAufgabe(s[0], s[1], s[2], "Zähle die günstigen Möglichkeiten und vergleiche."); } },
    { id: "k4rechenmeister", lb: "zo", zusatz: true, stufe: "4", lz: ["ma.zo.16", "ma.zo.17", "ma.ms.05"], name: "Rechenmeister: Muster und Fehler", icon: "📜",
      neu: () => { const art = r(1, 5);
        if (art === 1) { const f = wahl(["quadrat", "dreieck", "winkel"]), n = r(4, 7); return zahl("", figurZahl(f, n), { quadrat: `Bild n hat n · n Punkte: ${n} · ${n} = ${n * n}.`, dreieck: `Jedes Bild hat eine Reihe mehr: 1 + 2 + … + ${n} = ${n * (n + 1) / 2}.`, winkel: `Jedes Bild hat 2 Punkte mehr: 2 · ${n} + 1 = ${2 * n + 1}.` }[f], { frage: `Wie viele Punkte hat Bild ${n}?`, bild: figurBild(f), nurLuecke: true }); }
        if (art === 2) { const a = r(500, 999), b = r(100, 250), c = r(50, a - b - 50); return zahl(`${a} ${M} ${b} ${M} ${c}`, a - b - c, `Zwei Subtrahenden: Erst ${b} + ${c} = ${b + c}, dann ${a} ${M} ${b + c} = ${a - b - c}.`); }
        if (art === 3) { const x = r(120, 480), y = r(3, 9), richtig = x * y, falsch = richtig + wahl([10, 100, -10, 20]);
          const opt = mische([[`${x} · ${y} = ${falsch}`, true], [`${x + 1} · ${y} = ${(x + 1) * y}`, false], [`${x} + ${y} = ${x + y}`, false]]);
          return wahlAufgabe("Welche Rechnung hat einen Fehler?", opt.find(o => o[1])[0], opt.filter(o => !o[1]).map(o => o[0]), `Überschlag hilft: ${x} · ${y} ≈ ${Math.round(x / 100) * 100 * y}. Richtig ist ${x} · ${y} = ${richtig}.`); }
        if (art === 4) { const s = wahl([["Adam Ries war ein berühmter …", "Rechenmeister", ["Ritter", "Maler"]], ["Adam Ries lebte vor etwa …", "500 Jahren", ["50 Jahren", "5000 Jahren"]], ["In welcher sächsischen Stadt hatte Adam Ries eine Rechenschule?", "Annaberg", ["Leipzig", "Berlin"]], ["Was bedeutet „nach Adam Ries“?", "richtig gerechnet", ["schnell gerannt", "laut gesungen"]]]);
          return wahlAufgabe(s[0], s[1], s[2], "Adam Ries (um 1492–1559) schrieb Rechenbücher auf Deutsch statt Latein. In Annaberg im Erzgebirge leitete er eine Rechenschule. Er erklärte das Rechnen mit unseren Ziffern statt mit römischen Zahlzeichen."); }
        const a = r(12, 48), b = r(3, 9), c = r(3, 9); return zahl(`${a} · ${b} + ${a} · ${c} = ${a} · ?`, b + c, `Verteilungsgesetz: ${a} · ${b} + ${a} · ${c} = ${a} · (${b} + ${c}) = ${a} · ${b + c}.`); } }
  ];
  STATIONEN_K4.push(...STATIONEN_K4_NEU);

  // ---------- Sachsen in voller Tiefe: Klasse 1 (Lehrplan 2025, Kl. 1/2) und Übergang 5 ----------
  const LB_K15 = { k1wuerfel: "zo", k1zaehlen: "zo", k1mehr: "zo", k1muster: "rf", k1zwanzig: "zo", k1nachbar: "zo", k1zerlegen: "zo", k1plus10: "zo", k1minus10: "zo", k1doppelt: "zo",
    k5fit: "zo", k5bruchbild: "zo", k5bruchvon: "zo", k5bruchvergleich: "zo", k5komma: "gm", k5klammer: "zo", k5koordinaten: "rf", k5winkel: "rf", k5mittel: "dz", k5sach: "zo" };
  STATIONEN_K1.concat(STATIONEN_K5).forEach(s => { s.lb = s.lb || LB_K15[s.id]; });
  const TIERE = ["🐶", "🐱", "🐸", "🐰", "🦊", "🐻", "🐼", "🐷"];
  // Zwei Stifte nebeneinander (länger/kürzer)
  function stifteBild(a, b) {
    const s = [[a, "#E5484D", 30], [b, "#3A7BE0", 90]].map(([l, f, y]) => `<rect x="40" y="${y}" width="${l * 26}" height="26" rx="6" fill="${f}" stroke="${D}" stroke-width="3"/><path d="M${40 + l * 26} ${y} l26 13 l-26 13 Z" fill="#F7C9A9" stroke="${D}" stroke-width="3"/>`).join("") +
      `<text x="12" y="51" font-size="22" font-weight="700" fill="${D}">A</text><text x="12" y="111" font-size="22" font-weight="700" fill="${D}">B</text>`;
    return `<svg viewBox="0 0 ${Math.max(a, b) * 26 + 80} 130" style="max-height:150px" role="img" aria-label="Zwei Stifte">${s}</svg>`;
  }

  const STATIONEN_K1_NEU = [
    { id: "k1zahlen20", lb: "zo", zusatz: true, stufe: "1", lz: ["ma.zo.02"], name: "Zahlen bis 20", icon: "🔟",
      neu: () => { const art = r(1, 5), n = r(1, 20);
        if (art === 1) return zahl("", n, `${zahlwort(n)} schreibt man ${n}.`, { frage: `Schreib die Zahl: „${zahlwort(n)}“`, nurLuecke: true });
        if (art === 2) { const m = r(1, 19); return zahl("", m, `Zähle die Striche ab der 0 oder ab der 10: ${m}.`, { frage: "Welche Zahl zeigt der Pfeil?", bild: strahlBild(0, 20, m), nurLuecke: true }); }
        if (art === 3) { const m = r(2, 19), v = Math.random() < 0.5; return zahl("", v ? m - 1 : m + 1, v ? `Eins weniger: ${m - 1}.` : `Eins mehr: ${m + 1}.`, { frage: `Welche Zahl kommt ${v ? "vor" : "nach"} ${m}?`, nurLuecke: true }); }
        if (art === 4) { const reihe = mische(TIERE).slice(0, r(5, 7)), i = r(0, reihe.length - 1);
          return zahl("", i + 1, `Zähle von links: ${reihe.slice(0, i + 1).map((_, k) => k + 1).join(", ")}. ${reihe[i]} ist das ${i + 1}. Tier.`, { frage: `Das wievielte Tier ist ${reihe[i]}? (von links gezählt)`, bild: emojiReihe(reihe), nurLuecke: true }); }
        const k = wahl([2, 2, 5, 10]), st = k === 2 ? wahl([0, 1]) : 0, f = [0, 1, 2].map(i => st + k * (i + 1)); return zahl(`${f.join(", ")}, ?`, st + k * 4, `Immer ${k} weiter.`, { frage: `Zähle in ${k}er-Schritten:` }); } },
    { id: "k1vergleich", lb: "zo", zusatz: true, stufe: "1", lz: ["ma.zo.02"], name: "Größer, kleiner, gleich", icon: "⚖️",
      neu: () => { const art = r(1, 3);
        if (art === 1) { const a = r(0, 20), b = Math.random() < 0.2 ? a : r(0, 20), z = a < b ? "<" : a > b ? ">" : "=";
          return { text: `${a} ? ${b}`, antwort: z, art: "wahl", optionen: ["<", "=", ">"], frage: "Welches Zeichen passt?", hilfe: "Das Krokodil-Maul öffnet sich zur größeren Zahl: 3 < 7, 9 > 4." }; }
        if (art === 2) { const z = mische(Array.from({ length: 20 }, (_, i) => i + 1)).slice(0, 3), gross = Math.random() < 0.5, ziel = gross ? Math.max(...z) : Math.min(...z);
          return wahlAufgabe(`Welche Zahl ist am ${gross ? "größten" : "kleinsten"}?`, ziel, z, `Denk an den Zahlenstrahl: Weiter rechts ist größer.`); }
        const a = r(1, 18); return zahl(`${a} < ? < ${a + 2}`, a + 1, `Zwischen ${a} und ${a + 2} liegt nur die ${a + 1}.`, { frage: "Welche Zahl liegt dazwischen?" }); } },
    { id: "k1plus20", lb: "zo", zusatz: true, stufe: "1", lz: ["ma.zo.03", "ma.zo.04"], name: "Plus und minus bis 20", icon: "➕",
      neu: () => { const art = r(1, 8);
        if (art === 1) { const a = r(10, 15), b = r(1, 19 - a); return zahl(`${a} + ${b}`, a + b, `Die Zehn bleibt, rechne nur die Einer: ${a - 10} + ${b} = ${a - 10 + b}, also ${a + b}.`); }
        if (art === 2) { const a = r(6, 9), b = r(11 - a, 9); return zahl(`${a} + ${b}`, a + b, `Erst bis 10: ${a} + ${10 - a} = 10, dann noch ${b - (10 - a)}: ${a + b}.`); }
        if (art === 3) { const a = r(13, 19), b = r(1, a - 10); return zahl(`${a} ${M} ${b}`, a - b, `Die Zehn bleibt: ${a - 10} ${M} ${b} = ${a - 10 - b}, also ${a - b}.`); }
        if (art === 4) { const a = r(11, 17), b = r(a - 9, 9); return zahl(`${a} ${M} ${b}`, a - b, `Erst bis 10: ${a} ${M} ${a - 10} = 10, dann noch ${b - (a - 10)} weg: ${a - b}.`); }
        if (art === 5) { const a = r(2, 9), b = r(10, 18 - a); return zahl(`${a} + ${b} = ${b} + ?`, a, "Tauschaufgabe: Beim Plus darfst du tauschen."); }
        if (art === 6) { const a = r(4, 12), b = r(2, 20 - a); return zahl(`${a} + ${b} = ${a + b}, also ${a + b} ${M} ${b} = ?`, a, "Umkehraufgabe: Minus macht das Plus rückgängig."); }
        if (art === 7) { const a = r(3, 12), b = r(2, 20 - a); return zahl(`${a} + ? = ${a + b}`, b, `Von ${a} bis ${a + b} sind es ${b}.`); }
        const t = wahl(["🐦", "🦆", "🐞", "🐟"]), a = r(2, 7), b = r(1, 5), plus = Math.random() < 0.6;
        return plus ? zahl("", a + b, `${a} + ${b} = ${a + b}.`, { frage: `${a} ${t} sind schon da. ${b} kommen dazu. Wie viele sind es jetzt?`, bild: emojiReihe([...Array(a).fill(t), "➕", ...Array(b).fill(t)], 40), nurLuecke: true })
          : zahl("", a + b - b, `${a + b} ${M} ${b} = ${a}.`, { frage: `${a + b} ${t} sind da. ${b} gehen weg. Wie viele bleiben?`, bild: emojiReihe(Array(a + b).fill(t), 40), nurLuecke: true }); } },
    { id: "k1lage", lb: "rf", zusatz: true, stufe: "1", lz: ["ma.rf.01", "ma.rf.02"], name: "Oben, unten, links, rechts", icon: "↔️",
      neu: () => STATIONEN.find(s => s.id === "lage").neu() },
    { id: "k1formen", lb: "rf", zusatz: true, stufe: "1", lz: ["ma.rf.03", "ma.rf.04"], name: "Formen entdecken", icon: "🔷",
      neu: () => { const art = r(1, 4);
        if (art === 1) { const f = wahl(["🔺", "🟦", "🔵"]), anders = wahl(["🔺", "🟦", "🔵"].filter(x => x !== f)), reihe = Array(5).fill(f); reihe[r(0, 4)] = anders;
          return wahlAufgabe("Welche Form passt nicht dazu?", anders, ["🔺", "🟦", "🔵"], "Vergleiche die Formen: Eine ist anders.", { bild: emojiReihe(reihe) }); }
        if (art === 2) { const reihe = Array.from({ length: r(6, 9) }, () => wahl(["🔺", "🟦", "🔵"])), f = wahl(["🔺", "🟦", "🔵"]); if (!reihe.includes(f)) reihe[0] = f;
          const n = reihe.filter(x => x === f).length, name = { "🔺": "Dreiecke", "🟦": "Vierecke", "🔵": "Kreise" }[f];
          return zahl("", n, `Zeige auf jedes und zähle: ${n}.`, { frage: `Wie viele ${name} siehst du?`, bild: emojiReihe(reihe, 44), nurLuecke: true }); }
        if (art === 3) { const s = wahl([["ein Teller", "Kreis"], ["eine Tür", "Rechteck"], ["ein Fenster", "Rechteck"], ["eine Uhr an der Wand", "Kreis"], ["ein Stück Pizza", "Dreieck"], ["ein Fliese", "Quadrat"]]);
          return wahlAufgabe(`Welche Form hat ${s[0]}?`, s[1], ["Kreis", "Dreieck", "Rechteck", "Quadrat"], `${s[0]} – ${s[1]}.`); }
        return wahlAufgabe("Was kann rollen?", "⚽", ["🎲", "📦"], "Der Ball ist eine Kugel – rund ohne Ecken. Würfel und Kiste haben Ecken."); } },
    { id: "k1geld", lb: "gm", zusatz: true, stufe: "1", lz: ["ma.gm.02"], name: "Geld bis 20 Euro", icon: "🪙",
      neu: () => { const art = r(1, 3);
        if (art === 1) { let st, s; do { st = Array.from({ length: r(2, 4) }, () => wahl([1, 2, 5, 10])).sort((a, b) => b - a); s = st.reduce((a, b) => a + b, 0); } while (s > 20);
          return zahl("", s, st.join(" € + ") + " € = " + s + " €", { frage: "Wie viel Geld ist das?", bild: geldBild(st, "eur"), einheit: "€", nurLuecke: true }); }
        if (art === 2) { let st, s; do { st = Array.from({ length: r(2, 4) }, () => wahl([1, 2, 5, 10])).sort((a, b) => b - a); s = st.reduce((a, b) => a + b, 0); } while (s > 20);
          return zahl("", s, st.join(" ct + ") + " ct = " + s + " ct", { frage: "Wie viele Cent sind das?", bild: geldBild(st, "ct"), einheit: "ct", nurLuecke: true }); }
        const a = wahl([1, 2, 5, 10, 20]), b = wahl([1, 2, 5, 10, 20].filter(x => x !== a)); return wahlAufgabe("Was ist mehr wert?", `${Math.max(a, b)} €`, [`${Math.min(a, b)} €`], `${Math.max(a, b)} € sind mehr als ${Math.min(a, b)} €.`); } },
    { id: "k1zeit", lb: "gm", zusatz: true, stufe: "1", lz: ["ma.gm.03", "su.hi.02"], name: "Uhr und Tag", icon: "🌞",
      neu: () => { const art = r(1, 4);
        if (art === 1) { const h = r(1, 12); return wahlAufgabe("Wie spät ist es?", `${h} Uhr`, [`${(h % 12) + 1} Uhr`, `${((h + 10) % 12) + 1} Uhr`, `${((h + 5) % 12) + 1} Uhr`], `Der große Zeiger zeigt nach oben auf die 12 – volle Stunde. Der kleine zeigt auf die ${h}.`, { bild: uhrBild(h, 0) }); }
        if (art === 2) { const s = wahl([["Frühstück", "morgens"], ["Mittagessen", "mittags"], ["Schlafen gehen", "abends"], ["Zähne putzen vor der Schule", "morgens"], ["Abendbrot", "abends"]]);
          return wahlAufgabe(`Wann ist das meistens? ${s[0]}`, s[1], ["morgens", "mittags", "abends"], `${s[0]} ist meistens ${s[1]}.`); }
        if (art === 3) { const i = r(0, 6), vor = Math.random() < 0.5; return wahlAufgabe(`Welcher Tag kommt ${vor ? "vor" : "nach"} ${TAGE[i]}?`, TAGE[(i + (vor ? 6 : 1)) % 7], [TAGE[(i + 3) % 7], TAGE[(i + (vor ? 1 : 6)) % 7], TAGE[(i + 4) % 7]], `Die Woche: ${TAGE.join(", ")}.`); }
        const i = r(0, 6), w = wahl([["gestern", 6], ["morgen", 1]]); return wahlAufgabe(`Heute ist ${TAGE[i]}. Welcher Tag war oder ist ${w[0]}?`, TAGE[(i + w[1]) % 7], [TAGE[(i + 7 - w[1]) % 7], TAGE[(i + 3) % 7], TAGE[i]], "Gestern ist ein Tag vor heute, morgen ein Tag danach."); } },
    { id: "k1messen", lb: "gm", zusatz: true, stufe: "1", lz: ["ma.gm.01"], name: "Länger, kürzer, schwerer", icon: "📏",
      neu: () => { const art = r(1, 3);
        if (art === 1) { const a = r(3, 12); let b = r(3, 12); if (a === b) b = a + 2; const lang = Math.random() < 0.5;
          return wahlAufgabe(`Welcher Stift ist ${lang ? "länger" : "kürzer"}?`, (lang ? a > b : a < b) ? "A" : "B", ["A", "B"], "Beide Stifte fangen links gleich an. Schau, wo sie rechts aufhören.", { bild: stifteBild(a, b) }); }
        if (art === 2) { const s = wahl([["🐘", "🐭"], ["🚗", "🚲"], ["🍉", "🍓"], ["🐻", "🐦"], ["🏋️", "🪶"]]), schwer = Math.random() < 0.5;
          return wahlAufgabe(`Was ist ${schwer ? "schwerer" : "leichter"}?`, schwer ? s[0] : s[1], s, "Stell dir vor, du hebst beides hoch."); }
        const z = mische([r(2, 4), r(5, 7), r(8, 11)]), i = z.indexOf(Math.max(...z));
        return wahlAufgabe("Welcher Turm ist am höchsten?", ["A", "B", "C"][i], ["A", "B", "C"], "Vergleiche die Höhe: Wer reicht am weitesten nach oben?", { bild: `<svg viewBox="0 0 220 160" style="max-height:170px" role="img" aria-label="Türme">${z.map((h, k) => Array.from({ length: h }, (_, j) => `<rect x="${20 + k * 70}" y="${140 - (j + 1) * 12}" width="40" height="12" fill="${["#FFB03B", "#5CCBA6", "#7B9BFF"][k]}" stroke="${D}" stroke-width="1.5"/>`).join("") + `<text x="${40 + k * 70}" y="156" text-anchor="middle" font-size="15" font-weight="700" fill="${D}">${"ABC"[k]}</text>`).join("")}</svg>` }); } },
    { id: "k1daten", lb: "dz", zusatz: true, stufe: "1", lz: ["ma.dz.01", "ma.dz.02"], name: "Zählen und Strichliste", icon: "✏️",
      neu: () => { const art = r(1, 3), k = ["🍎", "🍌", "🍐"];
        if (art === 1) { const n = r(1, 10); return zahl("", n, `Ein Bündel mit Querstrich ist 5. ${Math.floor(n / 5)} Bündel und ${n % 5} Striche: ${n}.`, { frage: "Wie viele Striche sind es?", bild: strichBild("🍎", n), nurLuecke: true }); }
        const liste = Array.from({ length: r(6, 10) }, () => wahl(k)); k.forEach((f, i) => { if (!liste.includes(f)) liste[i] = f; });
        const z = k.map(f => liste.filter(x => x === f).length);
        if (art === 2) { const f = wahl(k); return zahl("", liste.filter(x => x === f).length, `Zeige auf jedes ${f} und zähle.`, { frage: `Wie oft siehst du ${f}?`, bild: emojiReihe(liste, 40), nurLuecke: true }); }
        if (new Set(z).size < 3 && z.filter(x => x === Math.max(...z)).length > 1) { liste.push(k[0]); z[0]++; }
        return wahlAufgabe("Wovon gibt es am meisten?", k[z.indexOf(Math.max(...z))], k, "Zähle jedes Obst. Das mit der größten Zahl gibt es am meisten.", { bild: emojiReihe(liste, 40) }); } }
  ];
  STATIONEN_K1.push(...STATIONEN_K1_NEU);

  const STATIONEN_K5_NEU = [
    { id: "k5grosszahl", lb: "zo", zusatz: true, stufe: "5", lz: ["ma.zo.15", "ma.zo.19"], name: "Große Zahlen und Potenzen", icon: "🌌",
      neu: () => { const art = r(1, 5);
        if (art === 1) { const w = wahl([["einer Million", 6], ["einer Milliarde", 9], ["hunderttausend", 5], ["zehntausend", 4]]); return zahl("", w[1], `${w[0]}: ${w[1]} Nullen.`, { frage: `Wie viele Nullen hat die Zahl mit dem Namen „${w[0].replace(/^einer /, "eine ")}“?`, nurLuecke: true }); }
        if (art === 2) { const w = wahl([["10²", 100, 3], ["10³", 1000, 4], ["2³", 8, 1], ["3²", 9, 1], ["5²", 25, 2], ["2⁴", 16, 2], ["10⁴", 10000, 5], ["4²", 16, 2]]); return zahl(w[0], w[1], `Hochzahl heißt: so oft mit sich selbst malnehmen. ${w[0]} = ${w[1]}.`, { max: w[2] }); }
        if (art === 3) { const n = r(1, 9) * 1e9 + r(0, 999999999), z = String(n), stellen = [["Milliardenstelle", 0], ["Hundertmillionenstelle", 1], ["Millionenstelle", 3], ["Tausenderstelle", 6]], w = wahl(stellen);
          return zahl("", z[w[1]], `Lies von rechts in Dreiergruppen: Einer, Tausender, Millionen, Milliarden.`, { frage: `Welche Ziffer steht in ${tz(n)} an der ${w[0]}?`, nurLuecke: true }); }
        if (art === 4) { const m = r(2, 9), t = r(1, 9) * 100; return wahlAufgabe(`Wie schreibt man „${m} Millionen ${t / 100 === 1 ? "hundert" : EINER[t / 100] + "hundert"}tausend“?`, tz(m * 1e6 + t * 1000), [tz(m * 1e6 + t * 100), tz(m * 1e5 + t * 1000), tz(m * 1e6 + t * 10000 > 9999999 ? m * 1e6 + t : m * 1e6 + t * 10000)], "Millionen, dann Tausender in Dreiergruppen: _ _ _ _ _ _ _ – jede Gruppe hat drei Stellen."); }
        const n = r(1, 9) * 1e6 + r(0, 999999), auf = Math.round(n / 1e6) * 1e6; return wahlAufgabe(`Runde ${tz(n)} auf Millionen.`, tz(auf), [tz(auf + 1e6), tz(Math.max(1e6, auf - 1e6)), tz(Math.round(n / 1e5) * 1e5)], `Schau auf die Hunderttausenderstelle: ${String(n)[1]} – ${+String(n)[1] >= 5 ? "aufrunden" : "abrunden"}.`); } },
    { id: "k5teiler", lb: "zo", zusatz: true, stufe: "5", lz: ["ma.zo.17", "ma.zo.19"], name: "Teiler und Primfaktoren", icon: "🧬",
      neu: () => { const art = r(1, 5);
        if (art === 1) { const n = wahl([12, 18, 20, 24, 30, 36, 16, 28]), t = Array.from({ length: n }, (_, i) => i + 1).filter(d => n % d === 0);
          return zahl("", t.length, `Teiler von ${n}: ${t.join(", ")} – das sind ${t.length}.`, { frage: `Wie viele Teiler hat ${n}? (1 und ${n} zählen mit)`, nurLuecke: true }); }
        if (art === 2) { const P = wahl([[12, "2 · 2 · 3"], [18, "2 · 3 · 3"], [20, "2 · 2 · 5"], [30, "2 · 3 · 5"], [24, "2 · 2 · 2 · 3"], [36, "2 · 2 · 3 · 3"], [42, "2 · 3 · 7"], [45, "3 · 3 · 5"]]);
          return wahlAufgabe(`Welche Zerlegung von ${P[0]} besteht nur aus Primzahlen?`, P[1], [`2 · ${P[0] / 2}`, `3 · ${P[0] / 3 === Math.floor(P[0] / 3) ? P[0] / 3 : 5}`, `${P[1].split(" · ").slice(1).join(" · ")}`], `Primzahlen sind nur durch 1 und sich selbst teilbar (2, 3, 5, 7, …). ${P[0]} = ${P[1]}.`); }
        if (art === 3) { const p = wahl([[12, 18, 6], [8, 12, 4], [15, 25, 5], [24, 36, 12], [14, 21, 7], [16, 24, 8]]); return zahl("", p[2], `Teiler von ${p[0]} und ${p[1]} vergleichen – der größte gemeinsame ist ${p[2]}.`, { frage: `Was ist der größte gemeinsame Teiler von ${p[0]} und ${p[1]}?`, nurLuecke: true }); }
        if (art === 4) { const p = wahl([[4, 6, 12], [3, 4, 12], [6, 8, 24], [5, 10, 10], [2, 7, 14], [6, 9, 18]]); return zahl("", p[2], `Vielfache von ${p[0]} und ${p[1]} aufschreiben – das kleinste gemeinsame ist ${p[2]}.`, { frage: `Was ist das kleinste gemeinsame Vielfache von ${p[0]} und ${p[1]}?`, nurLuecke: true }); }
        const a = r(3, 9), b = r(7, 12); return zahl("", a * b, `Das ${b}. Vielfache von ${a}: ${b} · ${a} = ${a * b}.`, { frage: `Wie heißt das ${b}. Vielfache von ${a}?`, nurLuecke: true }); } },
    { id: "k5terme", lb: "zo", zusatz: true, stufe: "5", lz: ["ma.ms.06", "ma.zo.17"], name: "Terme und Gleichungen", icon: "🔤",
      neu: () => { const art = r(1, 5), x = r(3, 15), a = r(2, 9);
        if (art === 1) return zahl(`x + ${a} = ${x + a}   x = ?`, x, `Umkehraufgabe: ${x + a} ${M} ${a} = ${x}.`);
        if (art === 2) return zahl(`${a} · x = ${a * x}   x = ?`, x, `Umkehraufgabe: ${a * x} : ${a} = ${x}.`);
        if (art === 3) return zahl("", a * (x + 2), `Setze ${x} für x ein: ${a} · (${x} + 2) = ${a} · ${x + 2} = ${a * (x + 2)}.`, { frage: `Berechne ${a} · (x + 2) für x = ${x}.`, nurLuecke: true });
        if (art === 4) { const s = wahl([[`Lena hat x Murmeln und bekommt ${a} dazu.`, `x + ${a}`, [`x ${M} ${a}`, `${a} · x`]], [`Ben hat x Euro und gibt ${a} Euro aus.`, `x ${M} ${a}`, [`x + ${a}`, `x : ${a}`]], [`${a} Kinder haben je x Sticker.`, `${a} · x`, [`${a} + x`, `x ${M} ${a}`]]]);
          return wahlAufgabe(`Welcher Term passt? ${s[0]}`, s[1], s[2], "Dazu → plus, weg → minus, je → mal."); }
        const s = wahl([["a + b = b + a", "Vertauschungsgesetz"], ["(a + b) + c = a + (b + c)", "Verbindungsgesetz"], ["a · (b + c) = a · b + a · c", "Verteilungsgesetz"]]);
        return wahlAufgabe(`Wie heißt das Rechengesetz ${s[0]}?`, s[1], ["Vertauschungsgesetz", "Verbindungsgesetz", "Verteilungsgesetz"], "Vertauschen: Reihenfolge egal. Verbinden: Klammern verschieben. Verteilen: in die Klammer hineinmultiplizieren."); } },
    { id: "k5geometrie", lb: "rf", zusatz: true, stufe: "5", lz: ["ma.rf.10", "ma.rf.05"], name: "Grad und Symmetrieachsen", icon: "📐",
      neu: () => { const art = r(1, 4);
        if (art === 1) { const w = wahl([30, 45, 60, 120, 135, 150]), opt = [w, w > 90 ? w - 60 : w + 60, w > 90 ? 180 - w : 180 - w + 0].map(x => x + "°");
          return wahlAufgabe("Wie groß ist der Winkel ungefähr?", `${w}°`, [...new Set(opt)].concat(w === 90 ? [] : ["90°"]), `Vergleiche mit dem rechten Winkel (90°): ${w < 90 ? "kleiner – spitz" : "größer – stumpf"}. Der Winkel ist etwa ${w}°.`, { bild: linienBild("winkel", w) }); }
        if (art === 2) { const s = wahl([["90°", "rechter Winkel"], ["180°", "gestreckter Winkel"], ["360°", "Vollwinkel"], ["200°", "überstumpfer Winkel"], ["40°", "spitzer Winkel"], ["130°", "stumpfer Winkel"]]);
          return wahlAufgabe(`Ein Winkel von ${s[0]} heißt …`, s[1], ["rechter Winkel", "gestreckter Winkel", "Vollwinkel", "überstumpfer Winkel", "spitzer Winkel", "stumpfer Winkel"].filter(x => x !== s[1]).sort(() => Math.random() - 0.5), "spitz < 90° · recht = 90° · stumpf < 180° · gestreckt = 180° · überstumpf > 180° · voll = 360°."); }
        if (art === 3) { const s = wahl([["ein Quadrat", 4], ["ein Rechteck (kein Quadrat)", 2], ["ein gleichseitiges Dreieck", 3], ["eine Raute (kein Quadrat)", 2], ["ein regelmäßiges Sechseck", 6]]);
          return zahl("", s[1], `${s[0]} hat ${s[1]} Symmetrieachsen.`, { frage: `Wie viele Symmetrieachsen hat ${s[0]}?`, nurLuecke: true }); }
        return wahlAufgabe("Der kürzeste Weg von einem Punkt zu einer Geraden ist …", "senkrecht zur Geraden", ["schräg zur Geraden", "parallel zur Geraden"], "Der Abstand wird immer senkrecht gemessen – mit dem Geodreieck."); } },
    { id: "k5raum", lb: "rf", zusatz: true, stufe: "5", lz: ["ma.rf.09", "ma.gm.10"], name: "Flächen- und Rauminhalt", icon: "🧊",
      neu: () => { const art = r(1, 6), a = r(2, 12), b = r(2, 12);
        if (art === 1) return zahl("", a * b, `Flächeninhalt Rechteck: Länge · Breite = ${a} · ${b} = ${a * b} cm².`, { frage: `Ein Rechteck ist ${a} cm lang und ${b} cm breit. Wie groß ist der Flächeninhalt?`, nurLuecke: true, einheit: "cm²" });
        if (art === 2) { const s = r(2, 10); return zahl("", s, `${s} · ${s} = ${s * s}.`, { frage: `Ein Quadrat hat den Flächeninhalt ${s * s} cm². Wie lang ist eine Seite?`, nurLuecke: true, einheit: "cm" }); }
        if (art === 3) { const w = wahl([["1 m²", "dm²", 100], ["1 dm²", "cm²", 100], ["3 m²", "dm²", 300], ["5 dm²", "cm²", 500], ["1 dm³", "Liter", 1], ["1 cm²", "mm²", 100]]); return zahl(`${w[0]} = ? ${w[1]}`, w[2], `Flächeneinheiten: Umrechnungszahl 100. 1 dm³ = 1 Liter.`); }
        if (art === 4) { const c = r(2, 6), x = r(2, 6), y = r(2, 6); return zahl("", x * y * c, `Volumen Quader: ${x} · ${y} · ${c} = ${x * y * c} cm³.`, { frage: `Ein Quader ist ${x} cm lang, ${y} cm breit und ${c} cm hoch. Wie groß ist das Volumen?`, nurLuecke: true, einheit: "cm³" }); }
        if (art === 5) { const s = r(2, 6); return zahl("", 6 * s * s, `Ein Würfel hat 6 gleiche Quadrate: 6 · ${s} · ${s} = ${6 * s * s} cm².`, { frage: `Ein Würfel hat die Kantenlänge ${s} cm. Wie groß ist seine Oberfläche?`, nurLuecke: true, einheit: "cm²" }); }
        return zahl("", 2 * (a + b), `Umfang: 2 · (${a} + ${b}) = ${2 * (a + b)} cm.`, { frage: `Ein Rechteck ist ${a} cm lang und ${b} cm breit. Wie groß ist der Umfang?`, nurLuecke: true, einheit: "cm" }); } },
    { id: "k5groessen", lb: "gm", zusatz: true, stufe: "5", lz: ["ma.gm.10", "ma.rf.09"], name: "Größen umrechnen, Maßstab", icon: "🗺️",
      neu: () => { const art = r(1, 5);
        if (art === 1) { const k = r(1, 9), m = r(1, 99); return zahl(`${k},${String(m).padStart(2, "0")} km = ? m`, k * 1000 + m * 10, `${k} km = ${k * 1000} m, dazu ${String(m).padStart(2, "0")} Hundertstel km = ${m * 10} m.`, { max: 4 }); }
        if (art === 2) { const w = wahl([["3 h", "min", 180], ["2 d", "h", 48], ["5 min", "s", 300], ["4 d", "h", 96], ["1 h", "s", 3600]]); return zahl(`${w[0]} = ? ${w[1]}`, w[2], "1 d = 24 h, 1 h = 60 min, 1 min = 60 s.", { max: 4 }); }
        if (art === 3) { const m = wahl([[100, "1 m"], [1000, "10 m"], [10000, "100 m"], [100000, "1 km"]]); return wahlAufgabe(`Maßstab 1 : ${tz(m[0])}. Wie lang ist 1 cm auf der Karte in Wirklichkeit?`, m[1], ["1 m", "10 m", "100 m", "1 km"], `1 cm · ${tz(m[0])} = ${tz(m[0])} cm = ${m[1]}.`); }
        if (art === 4) { const a = r(105, 495), b = r(105, 495); return zahl("", a + b, `In Cent rechnen: ${a} ct + ${b} ct = ${a + b} ct.`, { frage: `${euro(a)} + ${euro(b)} = ? Cent`, nurLuecke: true, einheit: "ct" }); }
        const t = r(2, 5), kg = r(1, 9) * 100; return zahl(`${t} t ${kg} kg = ? kg`, t * 1000 + kg, `1 t = 1000 kg.`, { max: 4 }); } }
  ];
  STATIONEN_K5.push(...STATIONEN_K5_NEU);

  // Eine Runde: verschiedene Aufgaben ohne Doppelte
  function runde(station, anzahl = 10) {
    const s = STATIONEN.find(x => x.id === station) || STATIONEN_K1.find(x => x.id === station) || STATIONEN_K3.find(x => x.id === station) || STATIONEN_K4.find(x => x.id === station) || STATIONEN_K5.find(x => x.id === station);
    const liste = [], gesehen = new Set();
    let versuche = 0;
    while (liste.length < anzahl && versuche++ < 400) {
      const a = s.neu();
      const schluessel = a.text + "|" + (a.frage || "") + "|" + a.antwort + "|" + (a.bild || "").length;
      if (gesehen.has(schluessel)) continue;
      gesehen.add(schluessel); liste.push(a);
    }
    return liste;
  }

  window.Mathe = { STATIONEN, STATIONEN_K1, STATIONEN_K3, STATIONEN_K4, STATIONEN_K5, runde, _k3: { istWuerfelnetz, zufallsNetz, roemisch, istPrim, wuerfelGebaeude }, _bilder: { zehnerBild, geldBild, uhrBild, wuerfelBild, zwanzigerBild, mengeBild } };
})();
