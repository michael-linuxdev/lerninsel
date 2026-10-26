// Zeigehand und Leuchten (NA-10): führt Kinder ohne Lesen zum Ziel.
//   const z = Zeige.auf("#knopf")                 → Hand tippt auf das Element, Ring leuchtet darum
//   Zeige.auf(element, { hand: false })            → nur Leuchten
//   Zeige.auf(() => ({ x, y }), { schieben: [80, 0] })  → Punkt auf dem Bildschirm (z. B. 3D-Punkt über Insel.ort("haus")),
//                                                    schieben: Hand bewegt sich in diese Richtung (Joystick zeigen)
//   z.weg() / Zeige.weg()                          → entfernen
// Das Ziel wird bei jedem Bild neu vermessen (Drehen, Scrollen, 3D-Kamera). Ruhige Darstellung: ohne Wippen.
(function () {
  const css = `
  .zeige-ring { position: fixed; z-index: 60; pointer-events: none; border-radius: 22px; box-shadow: 0 0 0 5px rgba(255,200,61,.95), 0 0 22px 8px rgba(255,200,61,.7);
    animation: zeige-puls 1.2s ease-in-out infinite; transition: opacity .2s; }
  .zeige-ring.rund { border-radius: 50%; }
  .zeige-hand { position: fixed; z-index: 61; pointer-events: none; font-size: 56px; line-height: 1; width: 64px; height: 64px; margin: 0;
    filter: drop-shadow(0 4px 0 rgba(0,0,0,.25)); transform-origin: 20% 0; animation: zeige-tipp 1.1s ease-in-out infinite; }
  .zeige-hand.schiebt { animation: none; }
  .zeige-hand[hidden], .zeige-ring[hidden] { display: none; }
  @keyframes zeige-puls { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
  @keyframes zeige-tipp { 0%, 100% { transform: translate(0, 0) scale(1); } 45% { transform: translate(-6px, -10px) scale(.92); } }
  @media (prefers-reduced-motion: reduce) { .zeige-ring, .zeige-hand { animation: none; } }
  body.ruhig .zeige-ring, body.ruhig .zeige-hand { animation: none; }`;
  let stil = false;
  const aktiv = new Set();

  // Ziel → Rechteck { x, y, w, h } in Bildschirm-Pixeln (Punkt: w = h = 0) oder null (nicht sichtbar)
  function rechteck(ziel) {
    let z = typeof ziel === "function" ? ziel() : ziel;
    if (typeof z === "string") z = document.querySelector(z);
    if (!z) return null;
    if (z instanceof Element) {
      if (z.hidden || !z.isConnected) return null;
      const r = z.getBoundingClientRect(); if (!r.width && !r.height) return null;
      return { x: r.left, y: r.top, w: r.width, h: r.height };
    }
    if (Number.isFinite(z.x) && Number.isFinite(z.y)) {
      const r = { x: z.x, y: z.y, w: z.w || 0, h: z.h || 0 };
      // Punkt außerhalb des Bildschirms (z. B. 3D-Ziel hinter dem Rand): an den Rand setzen, Pfeil zeigt die Richtung
      const R = 46, aus = z.sichtbar === false || r.x < 0 || r.y < 0 || r.x > innerWidth || r.y > innerHeight;
      if (aus) {
        const mx = innerWidth / 2, my = innerHeight / 2;
        let dx = r.x - mx, dy = r.y - my; if (z.hinten) { dx = -dx; dy = -dy; }
        const f = Math.min(Math.abs((mx - R) / (dx || 1e-6)), Math.abs((my - R) / (dy || 1e-6)));
        return { x: mx + dx * f, y: my + dy * f, w: 0, h: 0, rand: Math.abs(dx) * (my - R) > Math.abs(dy) * (mx - R) ? (dx < 0 ? "👈" : "👉") : (dy < 0 ? "👆" : "👇") };
      }
      return r;
    }
    return null;
  }

  function auf(ziel, opt = {}) {
    if (!stil) { document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`); stil = true; }
    const hand = opt.hand !== false, leuchten = opt.leuchten !== false, schieben = opt.schieben || null;
    const ring = document.createElement("div"); ring.className = "zeige-ring"; ring.hidden = !leuchten;
    const h = document.createElement("div"); h.className = "zeige-hand" + (schieben ? " schiebt" : ""); h.textContent = "👆"; h.hidden = !hand;
    h.setAttribute("aria-hidden", "true"); ring.setAttribute("aria-hidden", "true");
    document.body.append(ring, h);
    const start = performance.now();
    let lauf = true;
    const bild = () => {
      if (!lauf) return;
      const r = rechteck(ziel);
      if (!r) { ring.style.opacity = 0; h.style.opacity = 0; }
      else {
        const punkt = !r.w && !r.h, rand = punkt ? 34 : 8;
        ring.classList.toggle("rund", punkt); ring.classList.toggle("rand", !!r.rand);
        if (r.rand) { Object.assign(ring.style, { opacity: 1, left: r.x - 26 + "px", top: r.y - 26 + "px", width: "52px", height: "52px" });
          h.textContent = r.rand; h.style.opacity = 1; Object.assign(h.style, { left: r.x - 28 + "px", top: r.y - 30 + "px" }); requestAnimationFrame(bild); return; }
        h.textContent = "👆";
        Object.assign(ring.style, { opacity: 1, left: r.x - rand + "px", top: r.y - rand + "px", width: r.w + rand * 2 + "px", height: r.h + rand * 2 + "px" });
        // Hand unten rechts vom Ziel, Fingerspitze auf der Mitte; beim Schieben wandert sie in die Richtung
        let dx = 0, dy = 0;
        if (schieben) { const t = ((performance.now() - start) % 1600) / 1600, f = t < 0.7 ? t / 0.7 : 1; dx = schieben[0] * f; dy = schieben[1] * f; h.style.opacity = t < 0.9 ? 1 : 0; }
        else h.style.opacity = 1;
        Object.assign(h.style, { left: r.x + r.w / 2 - 14 + dx + "px", top: r.y + r.h / 2 - 4 + dy + "px" });
      }
      requestAnimationFrame(bild);
    };
    bild();
    const griff = { weg() { lauf = false; ring.remove(); h.remove(); aktiv.delete(griff); }, ziel };
    aktiv.add(griff);
    return griff;
  }
  function weg() { [...aktiv].forEach(g => g.weg()); }

  window.Zeige = { auf, weg, rechteck, get anzahl() { return aktiv.size; } };
})();
