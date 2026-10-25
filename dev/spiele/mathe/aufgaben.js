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
