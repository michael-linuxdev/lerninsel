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
        if (Math.random() < 0.5) { const kg = r(1, 9); return zahl("", kg * 1000, `1 kg sind 1000 g. ${kg} kg sind ${kg * 1000} g.`, { frage: `Wie viel Gramm sind ${kg} kg?`, einheit: "g", nurLuecke: true }); }
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
        if (Math.random() < 0.5) { const km = r(1, 9); return zahl("", km * 1000, `1 km sind 1000 m. ${km} km sind ${km * 1000} m.`, { frage: `Wie viele Meter sind ${km} km?`, einheit: "m", nurLuecke: true }); }
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
          hilfe: `Die höchste Säule gewinnt: ${namen[sieger]} mit ${werte[sieger]}.` }; } }
  ];

  function malAufgabe(reihen) {
    const n = wahl(reihen), k = r(1, 10);
    const [a, b] = Math.random() < 0.5 ? [k, n] : [n, k];
    return zahl(`${a} · ${b}`, a * b, `${n}er-Reihe: ${reihe(n, k)}`);
  }

  // Eine Runde: verschiedene Aufgaben ohne Doppelte
  function runde(station, anzahl = 10) {
    const s = STATIONEN.find(x => x.id === station) || STATIONEN_K1.find(x => x.id === station) || STATIONEN_K3.find(x => x.id === station);
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

  window.Mathe = { STATIONEN, STATIONEN_K1, STATIONEN_K3, runde, _k3: { istWuerfelnetz, zufallsNetz }, _bilder: { zehnerBild, geldBild, uhrBild, wuerfelBild, zwanzigerBild, mengeBild } };
})();
