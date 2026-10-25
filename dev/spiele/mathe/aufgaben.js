// Aufgaben für Klasse 2. Jede Station hat einen Generator, der eine Aufgabe liefert:
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

  // ---------- Stationen ----------
  const zahl = (text, antwort, hilfe, extra = {}) => Object.assign({ text, antwort: String(antwort), art: "zahl", hilfe }, extra);

  const STATIONEN = [
    { id: "plus20", name: "Plus bis 20", icon: "+",
      neu: () => { const a = r(2, 15), b = r(2, 20 - a); return zahl(`${a} + ${b}`, a + b, wegPlus(a, b)); } },
    { id: "minus20", name: "Minus bis 20", icon: M,
      neu: () => { const a = r(8, 20), b = r(2, a - 1); return zahl(`${a} ${M} ${b}`, a - b, wegMinus(a, b)); } },
    { id: "zehner", name: "Zehner und Einer", icon: "▮",
      neu: () => { const n = r(11, 99); return zahl("", n, `${Math.floor(n / 10)} Zehner und ${n % 10} Einer sind ${n}`, { frage: "Welche Zahl ist das?", bild: zehnerBild(n), nurLuecke: true }); } },
    { id: "vergleich", name: "Größer oder kleiner", icon: "<",
      neu: () => {
        const a = r(10, 99);
        const b = Math.random() < 0.15 ? a : Math.max(1, Math.min(100, a + wahl([-1, 1]) * r(1, 12)));
        const z = a < b ? "<" : a > b ? ">" : "=";
        return { text: `${a} ? ${b}`, antwort: z, art: "wahl", optionen: ["<", "=", ">"], frage: "Welches Zeichen passt?",
          hilfe: a === b ? `${a} und ${b} sind gleich groß` : `Vergleiche zuerst die Zehner, dann die Einer. ${Math.min(a, b)} ist kleiner als ${Math.max(a, b)}` };
      } },
    { id: "formen", name: "Formen und Körper", icon: "△",
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
    { id: "plus100", name: "Plus bis 100", icon: "+",
      neu: () => {
        const art = r(0, 2);
        if (art === 0) { const a = r(1, 8) * 10, b = r(1, 10 - a / 10) * 10; return zahl(`${a} + ${b}`, a + b, `${a / 10} Zehner + ${b / 10} Zehner = ${(a + b) / 10} Zehner, also ${a + b}`); }
        if (art === 1) { const a = r(2, 9) * 10 + r(0, 8), b = r(1, 9 - (a % 10)); return zahl(`${a} + ${b}`, a + b, (a % 10 ? `Nur die Einer: ${a % 10} + ${b} = ${a % 10 + b}, also ${a + b}` : `${a} und ${b} sind zusammen ${a + b}`)); }
        const a = r(1, 7) * 10 + r(1, 8), b = r(1, 9 - Math.floor(a / 10) - 1) * 10 + r(0, 9 - (a % 10));
        return zahl(`${a} + ${b}`, a + b, wegPlus(a, b));
      } },
    { id: "minus100", name: "Minus bis 100", icon: M,
      neu: () => {
        const art = r(0, 2);
        if (art === 0) { const a = r(3, 10) * 10, b = r(1, a / 10 - 1) * 10; return zahl(`${a} ${M} ${b}`, a - b, `${a / 10} Zehner ${M} ${b / 10} Zehner = ${(a - b) / 10} Zehner, also ${a - b}`); }
        if (art === 1) { const a = r(2, 9) * 10 + r(2, 9), b = r(1, a % 10); return zahl(`${a} ${M} ${b}`, a - b, `Nur die Einer: ${a % 10} ${M} ${b} = ${a % 10 - b}, also ${a - b}`); }
        const a = r(3, 9) * 10 + r(1, 9), b = r(1, Math.floor(a / 10) - 1) * 10 + r(0, a % 10);
        return zahl(`${a} ${M} ${b}`, a - b, wegMinus(a, b));
      } },
    { id: "plusUeber", name: "Plus über den Zehner", icon: "+",
      neu: () => {
        if (Math.random() < 0.5) { const e = r(3, 9), a = r(1, 8) * 10 + r(10 - e + 1, 9), b = e; return zahl(`${a} + ${b}`, a + b, wegPlus(a, b)); }
        let a, b; do { a = r(1, 7) * 10 + r(2, 9); b = r(1, 6) * 10 + r(2, 9); } while ((a % 10) + (b % 10) <= 10 || a + b > 100);
        return zahl(`${a} + ${b}`, a + b, wegPlus(a, b));
      } },
    { id: "minusUeber", name: "Minus über den Zehner", icon: M,
      neu: () => {
        if (Math.random() < 0.5) { const a = r(2, 9) * 10 + r(0, 7), b = r((a % 10) + 1, 9); return zahl(`${a} ${M} ${b}`, a - b, wegMinus(a, b)); }
        let a, b; do { a = r(3, 9) * 10 + r(0, 7); b = r(1, 7) * 10 + r(1, 9); } while ((b % 10) <= (a % 10) || b >= a);
        return zahl(`${a} ${M} ${b}`, a - b, wegMinus(a, b));
      } },
    { id: "doppelt", name: "Verdoppeln und Halbieren", icon: "×2",
      neu: () => {
        if (Math.random() < 0.5) { const n = r(3, 50); const z = n - n % 10, e = n % 10;
          return zahl(`Das Doppelte von ${n}`, 2 * n, z && e ? `${z} + ${z} = ${2 * z}, ${e} + ${e} = ${2 * e}, zusammen ${2 * n}` : `${n} + ${n} = ${2 * n}`, { nurLuecke: false, wort: true }); }
        const n = r(2, 50) * 2; const z = n - n % 10, e = n % 10;
        return zahl(`Die Hälfte von ${n}`, n / 2, (z % 20 === 0 && e) ? `Hälfte von ${z} ist ${z / 2}, Hälfte von ${e} ist ${e / 2}, zusammen ${n / 2}` : `${n / 2} + ${n / 2} = ${n}`, { wort: true });
      } },
    { id: "ergaenzen", name: "Ergänzen", icon: "?",
      neu: () => {
        const art = r(0, 2);
        if (art === 0) { const a = r(1, 9) * 10 + r(1, 9), z = Math.ceil(a / 10) * 10; return zahl(`${a} + ? = ${z}`, z - a, `Bis zum nächsten Zehner: ${a} + ${z - a} = ${z}`); }
        if (art === 1) { const a = r(1, 9) * 10; return zahl(`${a} + ? = 100`, 100 - a, `${a / 10} Zehner + ${10 - a / 10} Zehner = 10 Zehner, also fehlen ${100 - a}`); }
        const a = r(11, 89); const z = Math.ceil(a / 10) * 10;
        return zahl(`${a} + ? = 100`, 100 - a, a % 10 ? `${a} + ${z - a} = ${z}, ${z} + ${100 - z} = 100, also ${100 - a}` : `${a} + ${100 - a} = 100`);
      } },
    { id: "daten", name: "Strichlisten und Diagramme", icon: "📊",
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
    { id: "mal1", name: "Einmaleins mit 2, 5, 10", icon: "·",
      neu: () => malAufgabe([2, 5, 10]) },
    { id: "mal2", name: "Einmaleins mit 3 und 4", icon: "·",
      neu: () => malAufgabe([3, 4]) },
    { id: "mal3", name: "Einmaleins mit 6 bis 9", icon: "·",
      neu: () => malAufgabe([6, 7, 8, 9]) },
    { id: "geteilt", name: "Geteilt", icon: ":",
      neu: () => { const d = wahl([2, 3, 4, 5, 10]), q = r(1, 10); return zahl(`${d * q} : ${d}`, q, `Denke an das Einmaleins: ${q} · ${d} = ${d * q}`); } },
    { id: "geld", name: "Geld", icon: "€",
      neu: () => {
        if (Math.random() < 0.5) {
          let st, s; do { st = Array.from({ length: r(2, 5) }, () => wahl([1, 2, 5, 10, 20, 50])).sort((a, b) => b - a); s = st.reduce((a, b) => a + b, 0); } while (s > 99);
          return zahl("", s, st.join(" ct + ") + " ct = " + s + " ct", { frage: "Wie viel Geld ist das?", bild: geldBild(st, "ct"), einheit: "ct", nurLuecke: true });
        }
        let st, s; do { st = Array.from({ length: r(2, 5) }, () => wahl([1, 2, 5, 10, 20, 50])).sort((a, b) => b - a); s = st.reduce((a, b) => a + b, 0); } while (s > 100);
        return zahl("", s, st.join(" € + ") + " € = " + s + " €", { frage: "Wie viel Geld ist das?", bild: geldBild(st, "eur"), einheit: "€", nurLuecke: true });
      } },
    { id: "zufall", name: "Sicher, möglich, unmöglich", icon: "🎲",
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
    { id: "uhr", name: "Uhrzeit", icon: "🕒",
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
      } }
  ];

  function malAufgabe(reihen) {
    const n = wahl(reihen), k = r(1, 10);
    const [a, b] = Math.random() < 0.5 ? [k, n] : [n, k];
    return zahl(`${a} · ${b}`, a * b, `${n}er-Reihe: ${reihe(n, k)}`);
  }

  // Eine Runde: verschiedene Aufgaben ohne Doppelte
  function runde(station, anzahl = 10) {
    const s = STATIONEN.find(x => x.id === station);
    const liste = [], gesehen = new Set();
    let versuche = 0;
    while (liste.length < anzahl && versuche++ < 400) {
      const a = s.neu();
      const schluessel = a.text + "|" + a.antwort + "|" + (a.bild || "").length;
      if (gesehen.has(schluessel)) continue;
      gesehen.add(schluessel); liste.push(a);
    }
    return liste;
  }

  window.Mathe = { STATIONEN, runde, _bilder: { zehnerBild, geldBild, uhrBild } };
})();
