// Emoji-Bilder (01.11.2026, Noto in Stil A): ersetzt beim Anzeigen jedes Emoji, für das es ein Bild gibt (shared/icons/<teil>.js,
// gebaut von quellen/noto-stil-a.py aus quellen/noto/, Noto Emoji von Google, Apache 2.0, Lizenz quellen/noto/LICENSE), durch dieses Bild. Das Emoji bleibt unsichtbar im Text erhalten (Vorlesen, Suche, Tests, textContent),
// nur das Aussehen ändert sich. Emojis ohne eigenes Bild bleiben, wie sie sind – so können die Bilder paketweise dazukommen.
// Wird von core.js nachgeladen. Ausnahmen: Eingabefelder, <option>, <canvas>, SVG, Elemente mit data-emoji="aus". Test-Haken: window.__emoji.
// Paket 5 (07.11.2026): Jedes Bild ist ein <img> mit einer Blob-Adresse, die je Emoji einmal entsteht (vorher ein ganzes Inline-SVG je Anzeige –
// im Elternbereich waren 74 % aller DOM-Knoten Emoji-Teile). Aufbau bleibt <span class="emo"><span class="emo-t">🍎</span><img></span>, textContent gleich.
// Die Noto-Bilder kommen erst nach dem ersten Bild der Seite (core.js); bis dahin hält span.emo.warte den Platz in
// derselben Größe frei und zeigt das Emoji des Geräts (shared/icons-liste.js sagt, welche Emojis ein Bild bekommen).
// Paket „icons.js verkleinern“ (07.11.2026): statt einer großen icons.js kleine Häppchen shared/icons/<teil>-<n>.js in Kurzform
// (quellen/noto-stil-a.py). Nach dem ersten Bild (core.js ruft __emoji.los()) lädt emoji.js nur die Häppchen, deren Emojis auf der Seite
// stehen, später nach Bedarf. Die Bilder entstehen in kleinen Portionen (höchstens ~12 ms am Stück) – keine lange Aufgabe. Statt einer Blob-Adresse
// bekommt jedes Emoji eine data:-Adresse (einmal je Emoji, dieselbe Zeichenkette für jede Anzeige): Blob + createObjectURL kosteten gemessen
// 10- bis 25-mal so viel Zeit auf dem Hauptfaden (60 Emojis bei Drossel 4: 43–121 ms gegen 2–10 ms), das Laden ins <img> dauert gleich lang.
(function () {
  if (window.__emoji) return;
  // Ohne Noto-Bilder (Eltern-Wahl „Emojis des Geräts“) werden nur die Begleiter-Zeichen ersetzt
  const nurFiguren = !window.LERN_ICON_LISTE && !window.LERN_ICONS;
  const ORDNER = ((document.currentScript && document.currentScript.src) || "").replace(/emoji\.js(\?.*)?$/, "") + "icons/";
  const ICONS = {};                 // Hex → SVG-Text (sobald da)
  const BEKANNT = new Set();        // Hex mit Bild (auch wenn das SVG noch lädt)
  const FIG = new Set();
  const eigene = (h, svg) => { ICONS[h] = svg; BEKANNT.add(h); };
  if (window.FigurenNeu && FigurenNeu.ZEICHEN) for (const [n, z] of Object.entries(FigurenNeu.ZEICHEN)) { const h = z.codePointAt(0).toString(16); eigene(h, FigurenNeu.mini(n)); FIG.add(h); }
  // Würfel überall gleich (iPad-Meldung 02.11.2026): ⚀–⚅ und 🎲 als ein Würfel in Stil A – dieselbe Zeichnung wie in Mathe (wuerfelInnen in spiele/mathe/aufgaben.js)
  const AUGEN = { 1: [[1, 1]], 2: [[0, 0], [2, 2]], 3: [[0, 0], [1, 1], [2, 2]], 4: [[0, 0], [2, 0], [0, 2], [2, 2]], 5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]], 6: [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]] };
  const wuerfel = (n) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect x="8" y="8" width="112" height="112" rx="24" fill="#fff"/>` +
    `<path d="M8 94h112v2a24 24 0 0 1-24 24H32A24 24 0 0 1 8 96z" fill="#E4DAF6"/><rect x="8" y="8" width="112" height="112" rx="24" fill="none" stroke="#3B1F63" stroke-width="7"/>` +
    AUGEN[n].map(([c, z]) => `<circle cx="${36 + c * 28}" cy="${36 + z * 28}" r="10.5" fill="#3B1F63"/>`).join("") + `</svg>`;
  for (let n = 1; n <= 6; n++) eigene((0x267f + n).toString(16), wuerfel(n));
  eigene("1f3b2", wuerfel(5));
  // Formen zum Erkennen (iPad-Meldung 03.11.2026: 🔵/🔺/🟦 waren verschieden farbig und groß): eigene Zeichen  Kreis,  Dreieck,
  //  Viereck (Quadrat),  Rechteck – gleiche Farbe, gleiche Größe; dieselbe Zeichnung wie formSvg in spiele/mathe/aufgaben.js. Vorlesen lässt sie weg.
  const FORM = { e110: '<circle cx="64" cy="64" r="46"/>', e111: '<path d="M64 14 L116 106 H12 Z" stroke-linejoin="round"/>',
    e112: '<rect x="20" y="20" width="88" height="88" rx="6"/>', e113: '<rect x="8" y="34" width="112" height="60" rx="6"/>' };
  for (const [h, f] of Object.entries(FORM)) eigene(h, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><g fill="#4FA8F0" stroke="#3B1F63" stroke-width="7">${f}</g></svg>`);
  // Noto-Bilder: schon da (eine Seite hat window.LERN_ICONS selbst gesetzt) oder angekündigt (icons-liste.js; die Häppchen kommen nach dem ersten Bild)
  if (window.LERN_ICONS) for (const [h, s] of Object.entries(window.LERN_ICONS)) if (!ICONS[h]) eigene(h, s);
  const WO = new Map();              // Hex → Häppchen (shared/icons/<teil>.js)
  if (window.LERN_ICON_LISTE) window.LERN_ICON_LISTE.split(",").forEach((h, i) => { if (!h) return; BEKANNT.add(h);
    const t = window.LERN_ICON_WO && (window.LERN_ICON_TEILE || [])[parseInt(window.LERN_ICON_WO[i], 36)]; if (t && !ICONS[h]) WO.set(h, t); });
  // SVG eines Emojis, sobald sein Häppchen da ist (Kurzform wird erst hier ausgepackt, je Emoji einmal)
  function svgVon(h) {
    if (ICONS[h]) return ICONS[h];
    const k = window.LERN_ICONS_KURZ && window.LERN_ICONS_KURZ[h];
    if (k && window.LernIconAuf) { ICONS[h] = window.LernIconAuf(h, k); NOTO_H.add(h); }
    return ICONS[h] || "";
  }
  const NOTO_H = new Set();
  const hex = (e) => [...e].filter(c => c !== "️").map(c => c.codePointAt(0).toString(16)).join("-");
  const zeichen = (h) => h.split("-").map(x => String.fromCodePoint(parseInt(x, 16))).join("");
  const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Muster: längste Folgen zuerst; nach jedem Zeichen darf ein FE0F stehen (Schreibweise mit oder ohne Variante)
  const folgen = [...BEKANNT].map(zeichen).sort((a, b) => b.length - a.length);
  if (!folgen.length) return;
  const MUSTER = new RegExp(folgen.map(f => [...f].map(c => esc(c) + "\\uFE0F?").join("")).join("|"), "gu");
  const SPERRE = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "OPTION", "SELECT", "CANVAS", "TITLE", "NOSCRIPT", "svg", "SVG"]);

  const stil = document.createElement("style");
  stil.textContent = ".emo{display:inline-block;width:1.15em;height:1.15em;vertical-align:-.22em;position:relative;line-height:0;flex:none;pointer-events:none}" +
    // overflow hidden: manche Noto-Bilder haben Formen weit außerhalb (z. B. 📦); als <img> bleibt ohnehin alles in der viewBox
    ".emo>img{width:100%;height:100%;display:block;overflow:hidden}" +
    // Alte Seitenregeln wie „.gruppen .option img { width: 80px }“ dürfen die Emoji-Bilder nicht vergrößern (iPad-Meldung 02.11.: 🪔 über „Lichterfeste“).
    // :not(#emo-x) hebt die Spezifität über jede Klassen-Regel, !important über deren !important.
    ".emo>img:not(#emo-x){width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;min-width:0!important;min-height:0!important;margin:0!important;padding:0!important;position:static!important;flex:none!important;transform:none!important;animation:none!important;border:0!important;box-shadow:none!important;border-radius:0!important;background:none!important;opacity:1!important;object-fit:contain!important;aspect-ratio:auto!important;pointer-events:none!important;-webkit-user-drag:none;user-select:none}" +
    ".emo.fig{width:1.45em;height:1.45em;vertical-align:-.36em}" +
    ".emo>.emo-t{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap}" +
    // solange das Bild noch lädt: Emoji des Geräts mittig im freigehaltenen Platz (gleiche Größe wie das Bild danach)
    ".emo.warte>.emo-t{inset:0;width:auto;height:auto;margin:0;clip:auto;clip-path:none;overflow:visible;line-height:1.15em;text-align:center;font-size:.92em}";
  document.head.appendChild(stil);

  // Eine Adresse je Emoji (das SVG wird über den HTML-Parser zu gültigem XML gemacht – ein <img> verzeiht keine Tippfehler im Markup)
  const ADRESSEN = new Map();
  // Noto-Bilder sind schon gültiges XML (quellen/noto-stil-a.py, geprüft in tests/bilder.js) – nur Figuren & Co. gehen durch den Parser
  const NOTO = (h) => (NOTO_H.has(h) || !!(window.LERN_ICONS && window.LERN_ICONS[h] === ICONS[h])) && !FIG.has(h);
  function xmlVon(h) {
    const svg = svgVon(h); if (!svg) return "";
    if (NOTO(h) && /^<svg xmlns=/.test(svg)) return svg;
    let xml = svg;
    try {
      const t = document.createElement("template"); t.innerHTML = svg; const el = t.content.querySelector("svg");
      if (el) { el.removeAttribute("aria-hidden"); xml = new XMLSerializer().serializeToString(el); }
    } catch (e) { /* dann roh */ }
    if (!/xmlns=/.test(xml.slice(0, 200))) xml = xml.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    return xml;
  }
  function adresse(h) {
    let a = ADRESSEN.get(h); if (a) return a;
    const xml = xmlVon(h); if (!xml) return "";
    a = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
    ADRESSEN.set(h, a); return a;
  }
  function bild(s, h) {
    const img = document.createElement("img"); img.alt = ""; img.draggable = false; img.decoding = "async";
    img.src = adresse(h); s.appendChild(img); s.classList.remove("warte");
  }

  function erlaubt(knoten) {
    for (let el = knoten.parentNode; el && el.nodeType === 1; el = el.parentNode) {
      if (SPERRE.has(el.nodeName) || el.isContentEditable) return false;
      if (el.classList && el.classList.contains("emo")) return false;
      if (el.dataset && el.dataset.emoji === "aus") return false;
    }
    return true;
  }
  const wartend = new Set();   // span.emo.warte, die auf ihr Häppchen oder ihre Adresse warten
  // Adressen in Portionen: 50 neue Emojis auf einmal waren mit Blob-Adressen eine lange Aufgabe von 150 ms und mehr (Sachunterricht, Drossel 4).
  // Mit data:-Adressen viel billiger, aber trotzdem höchstens ~12 ms am Stück (große Bilder, Auspacken der Kurzform).
  const schlange = []; let pumpt = false; const stat = { portionen: 0, portionMax: 0 };
  // eigene Aufgabe ohne die 4-ms-Bremse verschachtelter setTimeout-Aufrufe
  const kanal = typeof MessageChannel === "function" ? new MessageChannel() : null;
  const spaeter = kanal ? (() => kanal.port2.postMessage(0)) : (() => setTimeout(pumpe, 0));
  if (kanal) kanal.port1.onmessage = () => pumpe();
  function pumpe() {
    pumpt = false; const t0 = performance.now();
    while (schlange.length) {
      const s = schlange.shift(), h = s.dataset.h;
      if (!s.classList.contains("warte")) continue;
      if (!svgVon(h)) continue;   // Häppchen noch nicht da – kommt über teilDa wieder in die Schlange
      wartend.delete(s); bild(s, h);
      if (performance.now() - t0 > 12 && schlange.length) { stat.portionen++; stat.portionMax = Math.max(stat.portionMax, performance.now() - t0); pumpt = true; spaeter(); return; }
    }
    stat.portionen++; stat.portionMax = Math.max(stat.portionMax, performance.now() - t0);
    pruefeBereit();
  }
  function einreihen(s) { schlange.push(s); if (!pumpt) { pumpt = true; spaeter(); } }
  function ersetzeText(t) {
    const text = t.nodeValue; if (!text || text.length < 1) return;
    MUSTER.lastIndex = 0; if (!MUSTER.test(text)) return;
    if (!erlaubt(t)) return;
    MUSTER.lastIndex = 0;
    const teile = document.createDocumentFragment(); let pos = 0, m;
    while ((m = MUSTER.exec(text))) {
      const h = hex(m[0]); if (!BEKANNT.has(h)) continue;
      if (m.index > pos) teile.appendChild(document.createTextNode(text.slice(pos, m.index)));
      const s = document.createElement("span"); s.className = FIG.has(h) ? "emo fig" : "emo"; s.setAttribute("aria-hidden", "true"); s.dataset.h = h;
      const tx = document.createElement("span"); tx.className = "emo-t"; tx.textContent = m[0]; s.appendChild(tx);
      if (ADRESSEN.has(h) || (ICONS[h] && !WO.has(h))) bild(s, h);
      else { s.classList.add("warte"); wartend.add(s); if (svgVon(h)) einreihen(s); else brauche(h); }
      teile.appendChild(s); pos = m.index + m[0].length;
    }
    if (!pos) return;
    if (pos < text.length) teile.appendChild(document.createTextNode(text.slice(pos)));
    t.parentNode.replaceChild(teile, t);
  }
  function durchsuche(wurzel) {
    if (!wurzel) return;
    if (wurzel.nodeType === 3) { ersetzeText(wurzel); return; }
    if (wurzel.nodeType !== 1 || SPERRE.has(wurzel.nodeName) || (wurzel.classList && wurzel.classList.contains("emo"))) return;
    const w = document.createTreeWalker(wurzel, NodeFilter.SHOW_TEXT), liste = [];
    while (w.nextNode()) liste.push(w.currentNode);
    liste.forEach(ersetzeText);
  }
  // Änderungen gesammelt im nächsten Bild bearbeiten
  let offen = new Set(), geplant = false;
  const plane = () => { if (geplant) return; geplant = true; requestAnimationFrame(() => { geplant = false; const l = offen; offen = new Set(); l.forEach(n => { if (n.isConnected) durchsuche(n); }); }); };
  const beobachter = new MutationObserver((liste) => {
    for (const m of liste) {
      if (m.type === "characterData") { if (!(m.target.parentNode && m.target.parentNode.classList && m.target.parentNode.classList.contains("emo-t"))) offen.add(m.target); }
      else m.addedNodes.forEach(n => { if (!(n.classList && (n.classList.contains("emo") || n.parentNode && n.parentNode.classList && n.parentNode.classList.contains("emo")))) offen.add(n); });
    }
    if (offen.size) plane();
  });
  function start() { durchsuche(document.body); beobachter.observe(document.body, { childList: true, subtree: true, characterData: true }); }

  // Häppchen laden: erst nach dem ersten Bild (core.js ruft los()), dann nur die gebrauchten, jedes einmal
  const TEIL = new Map();      // Häppchen → { p: Promise, fertig }
  let frei = false;
  function teil(t) {
    let x = TEIL.get(t); if (x) return x;
    let fertig; x = { p: new Promise(ok => { fertig = ok; }), da: !!(window.LERN_ICONS_GELADEN && window.LERN_ICONS_GELADEN[t]), geholt: false };
    x.fertig = () => { x.da = true; fertig(); }; if (x.da) fertig();
    TEIL.set(t, x); return x;
  }
  function hole(t) {
    const x = teil(t); if (x.da || x.geholt) return x.p; x.geholt = true;
    const s = document.createElement("script"); s.src = ORDNER + t + ".js"; s.async = true;
    // Fehler (z. B. offline ohne Cache): Platz freigeben, das Emoji des Geräts bleibt sichtbar
    s.onerror = () => { x.fertig(); wartend.forEach(w => { if (WO.get(w.dataset.h) === t) { w.classList.remove("warte"); wartend.delete(w); } }); pruefeBereit(); };
    document.head.appendChild(s); return x.p;
  }
  function brauche(h) { const t = WO.get(h); if (!t) return Promise.resolve(); const x = teil(t); if (frei) hole(t); return x.p; }
  // ein Häppchen hat sich angemeldet (LERN_ICONS_DAZU in icons-liste.js)
  const vorher = window.LERN_ICONS_DA;
  window.LERN_ICONS_DA = function (t) {
    teil(t).fertig();
    wartend.forEach(s => { if (WO.get(s.dataset.h) === t) einreihen(s); });
    if (vorher) vorher(t);
  };
  let bereitFertig; const bereit = new Promise(ok => { bereitFertig = ok; });
  let fertigGemeldet = false;
  function pruefeBereit() { if (frei && !fertigGemeldet && !wartend.size && !schlange.length) { fertigGemeldet = true; bereitFertig(); } }
  function los() {
    if (frei) return; frei = true;
    if (window.LERN_ICONS) for (const [h, s] of Object.entries(window.LERN_ICONS)) if (!ICONS[h]) { ICONS[h] = s; WO.delete(h); }
    const brauchen = new Set();
    wartend.forEach(s => { const h = s.dataset.h; if (svgVon(h)) einreihen(s); else if (WO.has(h)) brauchen.add(WO.get(h)); else { s.classList.remove("warte"); wartend.delete(s); } });
    TEIL.forEach((x, t) => { if (!x.da) brauchen.add(t); });
    brauchen.forEach(hole);
    // bereit, sobald die Häppchen dieser Seite da sind (auch wenn ein Fehler kam)
    Promise.all([...brauchen].map(t => teil(t).p)).then(() => setTimeout(pruefeBereit, 0));
    pruefeBereit();
  }
  // alle Bilder auf einmal (Prüfseiten, Tests): Promise → { hex: SVG }
  function alle() {
    los();
    const t = [...new Set(WO.values())];
    return Promise.all(t.map(hole)).then(() => { const o = {}; BEKANNT.forEach(h => { if (!FIG.has(h) && (WO.has(h) || NOTO_H.has(h))) { const v = svgVon(h); if (v) o[h] = v; } }); return o; });
  }
  if (nurFiguren || !window.LERN_ICON_LISTE) los();
  else setTimeout(los, window.Spielwelt ? 2500 : 0);   // Seiten ohne core.js (Prüfseiten) gleich, sonst Sicherheitsnetz (core.js ruft los() schon nach dem ersten Bild)
  window.__emoji = { anzahl: () => [...BEKANNT].filter(h => !FIG.has(h)).length, figuren: FIG.size, nurFiguren, durchsuche, hat: (e) => BEKANNT.has(hex(e)),
    los, iconsDa: los, bereit, svg: (h) => svgVon(h), wartend: () => wartend.size, alle, brauche: (e) => brauche(hex(String(e || ""))),
    stat: () => ({ ...stat, adressen: ADRESSEN.size }), teile: () => [...TEIL].filter(([, x]) => x.da).map(([t]) => t), teilVon: (e) => WO.get(hex(String(e || ""))) || null };
  if (document.body) start(); else addEventListener("DOMContentLoaded", start);
  // Für Canvas und 3D (Schilder auf der Insel, Pinnwand, Atelier-Stempel): Bild als Image laden und zeichnen (data-Adresse wie bisher: Safari zeichnet
  // Blob-SVGs nicht in jede Leinwand, ohne sie zu sperren)
  const bilder = new Map();
  function lade(e) {
    const h = hex(String(e || "")); if (!BEKANNT.has(h)) return Promise.resolve(null);
    if (!bilder.has(h)) bilder.set(h, (WO.has(h) && !svgVon(h) ? new Promise(ok => { brauche(h).then(ok); if (!frei) setTimeout(los, 0); }) : Promise.resolve()).then(() => new Promise((fertig) => {
      if (!svgVon(h)) { fertig(null); return; }
      const img = new Image(); img.onload = () => { img.__fertig = true; fertig(img); }; img.onerror = () => fertig(null);
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xmlVon(h).replace("<svg ", "<svg width='128' height='128' "));
      bilder.set(h + ":img", img);
    })));
    return bilder.get(h);
  }
  // zeichnet sofort, wenn das Bild schon geladen ist (sonst als Text) – gibt true zurück, wenn es das Bild war
  function zeichne(g, e, x, y, gr) {
    const img = bilder.get(hex(String(e || "")) + ":img");
    if (img && img.__fertig) { g.drawImage(img, x - gr / 2, y - gr / 2, gr, gr); return true; }
    lade(e); g.font = `${Math.round(gr * 0.8)}px sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(e, x, y + gr * 0.05); return false;
  }
  window.EmojiBild = { lade, zeichne, hat: (e) => BEKANNT.has(hex(String(e || ""))) };
})();
