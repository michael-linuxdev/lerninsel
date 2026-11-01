// Emoji-Bilder (01.11.2026, Noto in Stil A): ersetzt beim Anzeigen jedes Emoji, für das es ein Bild gibt (shared/icons.js,
// gebaut von quellen/noto-stil-a.py aus quellen/noto/, Noto Emoji von Google, Apache 2.0, Lizenz quellen/noto/LICENSE), durch dieses Bild. Das Emoji bleibt unsichtbar im Text erhalten (Vorlesen, Suche, Tests, textContent),
// nur das Aussehen ändert sich. Emojis ohne eigenes Bild bleiben, wie sie sind – so können die Bilder paketweise dazukommen.
// Wird von core.js nachgeladen. Ausnahmen: Eingabefelder, <option>, <canvas>, SVG, Elemente mit data-emoji="aus". Test-Haken: window.__emoji.
(function () {
  if (window.__emoji) return;
  // Ohne Noto-Bilder (Eltern-Wahl „Emojis des Geräts“) werden nur die Begleiter-Zeichen ersetzt
  const nurFiguren = !window.LERN_ICONS;
  const ICONS = Object.assign({}, window.LERN_ICONS || {});
  const FIG = new Set();
  if (window.FigurenNeu && FigurenNeu.ZEICHEN) for (const [n, z] of Object.entries(FigurenNeu.ZEICHEN)) { const h = z.codePointAt(0).toString(16); ICONS[h] = FigurenNeu.mini(n); FIG.add(h); }
  const hex = (e) => [...e].filter(c => c !== "️").map(c => c.codePointAt(0).toString(16)).join("-");
  const zeichen = (h) => h.split("-").map(x => String.fromCodePoint(parseInt(x, 16))).join("");
  const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Muster: längste Folgen zuerst; nach jedem Zeichen darf ein FE0F stehen (Schreibweise mit oder ohne Variante)
  const folgen = Object.keys(ICONS).map(zeichen).sort((a, b) => b.length - a.length);
  if (!folgen.length) return;
  const MUSTER = new RegExp(folgen.map(f => [...f].map(c => esc(c) + "\\uFE0F?").join("")).join("|"), "gu");
  let nr = 0;
  const SPERRE = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "OPTION", "SELECT", "CANVAS", "TITLE", "NOSCRIPT", "svg", "SVG"]);

  const stil = document.createElement("style");
  stil.textContent = ".emo{display:inline-block;width:1.15em;height:1.15em;vertical-align:-.22em;position:relative;line-height:0;flex:none;pointer-events:none}" +
    ".emo>svg{width:100%;height:100%;display:block;overflow:hidden}" +   // hidden: manche Noto-Bilder haben Formen weit außerhalb (z. B. 📦); die Kontur passt in die viewBox
    ".emo.fig{width:1.45em;height:1.45em;vertical-align:-.36em}" +
    ".emo>.emo-t{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap}";
  document.head.appendChild(stil);

  function erlaubt(knoten) {
    for (let el = knoten.parentNode; el && el.nodeType === 1; el = el.parentNode) {
      if (SPERRE.has(el.nodeName) || el.isContentEditable) return false;
      if (el.classList && el.classList.contains("emo")) return false;
      if (el.dataset && el.dataset.emoji === "aus") return false;
    }
    return true;
  }
  function ersetzeText(t) {
    const text = t.nodeValue; if (!text || text.length < 1) return;
    MUSTER.lastIndex = 0; if (!MUSTER.test(text)) return;
    if (!erlaubt(t)) return;
    MUSTER.lastIndex = 0;
    const teile = document.createDocumentFragment(); let pos = 0, m;
    while ((m = MUSTER.exec(text))) {
      const h = hex(m[0]), roh = ICONS[h]; if (!roh) continue;
      // ids je Anzeige eindeutig (Kontur über <use>, Verläufe): sonst zeigt eine Kopie in einem versteckten Teil ins Leere
      const p = "n" + h.replace(/-/g, "") + "-", svg = roh.split(p).join(p + (++nr) + "-");
      if (m.index > pos) teile.appendChild(document.createTextNode(text.slice(pos, m.index)));
      const s = document.createElement("span"); s.className = FIG.has(h) ? "emo fig" : "emo"; s.setAttribute("aria-hidden", "true");
      s.innerHTML = `<span class="emo-t">${m[0]}</span>${svg}`;
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
      if (m.type === "characterData") offen.add(m.target);
      else m.addedNodes.forEach(n => { if (!(n.classList && n.classList.contains("emo"))) offen.add(n); });
    }
    plane();
  });
  function start() { durchsuche(document.body); beobachter.observe(document.body, { childList: true, subtree: true, characterData: true }); }
  if (document.body) start(); else addEventListener("DOMContentLoaded", start);
  window.__emoji = { anzahl: () => Object.keys(ICONS).length - FIG.size, figuren: FIG.size, nurFiguren, durchsuche, hat: (e) => !!ICONS[hex(e)] };
  // Für Canvas und 3D (Schilder auf der Insel, Pinnwand, Atelier-Stempel): Bild als Image laden und zeichnen
  const bilder = new Map();
  function lade(e) {
    const h = hex(String(e || "")); if (!ICONS[h]) return Promise.resolve(null);
    if (!bilder.has(h)) bilder.set(h, new Promise((fertig) => {
      const img = new Image(); img.onload = () => { img.__fertig = true; fertig(img); }; img.onerror = () => fertig(null);
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(ICONS[h].replace("<svg ", "<svg width='128' height='128' "));
      bilder.set(h + ":img", img);
    }));
    return bilder.get(h);
  }
  // zeichnet sofort, wenn das Bild schon geladen ist (sonst als Text) – gibt true zurück, wenn es das Bild war
  function zeichne(g, e, x, y, gr) {
    const img = bilder.get(hex(String(e || "")) + ":img");
    if (img && img.__fertig) { g.drawImage(img, x - gr / 2, y - gr / 2, gr, gr); return true; }
    lade(e); g.font = `${Math.round(gr * 0.8)}px sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(e, x, y + gr * 0.05); return false;
  }
  window.EmojiBild = { lade, zeichne, hat: (e) => !!ICONS[hex(String(e || ""))] };
})();
