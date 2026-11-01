// Eigene Bilder statt Emojis (01.11.2026, Stil A): ersetzt beim Anzeigen jedes Emoji, für das es ein eigenes Bild gibt (shared/icons.js,
// gebaut aus quellen/icons/*.js), durch dieses Bild. Das Emoji bleibt unsichtbar im Text erhalten (Vorlesen, Suche, Tests, textContent),
// nur das Aussehen ändert sich. Emojis ohne eigenes Bild bleiben, wie sie sind – so können die Bilder paketweise dazukommen.
// Wird von core.js nachgeladen. Ausnahmen: Eingabefelder, <option>, <canvas>, SVG, Elemente mit data-emoji="aus". Test-Haken: window.__emoji.
(function () {
  const ICONS = window.LERN_ICONS; if (!ICONS || window.__emoji) return;
  const hex = (e) => [...e].filter(c => c !== "️").map(c => c.codePointAt(0).toString(16)).join("-");
  const zeichen = (h) => h.split("-").map(x => String.fromCodePoint(parseInt(x, 16))).join("");
  const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Muster: längste Folgen zuerst; nach jedem Zeichen darf ein FE0F stehen (Schreibweise mit oder ohne Variante)
  const folgen = Object.keys(ICONS).map(zeichen).sort((a, b) => b.length - a.length);
  if (!folgen.length) return;
  const MUSTER = new RegExp(folgen.map(f => [...f].map(c => esc(c) + "\\uFE0F?").join("")).join("|"), "gu");
  const SPERRE = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "OPTION", "SELECT", "CANVAS", "TITLE", "NOSCRIPT", "svg", "SVG"]);

  const stil = document.createElement("style");
  stil.textContent = ".emo{display:inline-block;width:1.15em;height:1.15em;vertical-align:-.22em;position:relative;line-height:0;flex:none}" +
    ".emo>svg{width:100%;height:100%;display:block;overflow:visible}" +
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
      const svg = ICONS[hex(m[0])]; if (!svg) continue;
      if (m.index > pos) teile.appendChild(document.createTextNode(text.slice(pos, m.index)));
      const s = document.createElement("span"); s.className = "emo"; s.setAttribute("aria-hidden", "true");
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
  window.__emoji = { anzahl: () => Object.keys(ICONS).length, durchsuche, hat: (e) => !!ICONS[hex(e)] };
})();
