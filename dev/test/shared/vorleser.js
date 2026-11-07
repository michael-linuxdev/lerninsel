// Paket 2 „Ohne Lesen bedienbar“ – eigene Ideen (07.11.2026). Lädt nach shared/sprache.js.
// 1) „Was gibt es hier?“ – Vorleser.kacheln(knopf, () => [Kacheln], (k) => Name): Ein 🔊-Knopf liest die Namen aller sichtbaren Kacheln
//    nacheinander vor; die gerade genannte Kachel leuchtet gelb auf. So findet ein Kind, das noch nicht liest, selbst die richtige Kachel
//    (vorher musste es raten oder jede antippen). Antippen irgendwo hält das Vorlesen an. Nur auf Knopfdruck (NA-60), die Kette läuft über
//    den fertig-Rückruf von Sprache.sprich.
// 2) „Tipp auf mich!“ – Vorleser.begleiter(el, () => Text): Der Begleiter neben einer Sprechblase (Benno, Fipsi …) wird zum Vorlese-Knopf
//    und sagt seinen Satz. Kinder tippen ohnehin zuerst auf die Figur.
// Test-Haken window.__vorleser (laeuft, aktuell).
(function () {
  const SP = () => window.Sprache;
  const st = document.createElement("style");
  st.textContent = ".vorleser-an{outline:5px solid #FFC83D!important;outline-offset:3px;box-shadow:0 0 0 10px rgba(255,200,61,.35)!important;transition:box-shadow .2s}" +
    ".begleiter-tipp{cursor:pointer;-webkit-tap-highlight-color:transparent}.begleiter-tipp:active{transform:scale(.95)}" +
    ".vorleser-knopf{flex:none}";
  document.head.appendChild(st);
  let lauf = 0, aktuell = null;
  const aus = () => { document.querySelectorAll(".vorleser-an").forEach(k => k.classList.remove("vorleser-an")); aktuell = null; };
  function stopp() { if (!lauf) return; lauf++; aus(); lauf = 0; }
  function lies(liste, nameVon) {
    const sp = SP(); if (!sp || !liste.length) return;
    const id = ++lauf;
    const schritt = (i) => {
      aus();
      if (id !== lauf || i >= liste.length) { if (id === lauf) lauf = 0; return; }
      const k = liste[i]; aktuell = k; k.classList.add("vorleser-an");
      try { k.scrollIntoView({ block: "nearest" }); } catch (e) { /* egal */ }
      sp.sprich(nameVon(k), "de-DE", () => schritt(i + 1));
    };
    sp.knopf(); sp.stopp(); schritt(0);
  }
  const name = (k) => (k.getAttribute("aria-label") || k.textContent || "").replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{E100}-\u{E1FF}⭐]/gu, " ").replace(/\s+/g, " ").trim();
  const sichtbar = (k) => !k.hidden && k.getClientRects().length > 0 && getComputedStyle(k).visibility !== "hidden";
  const Vorleser = {
    kacheln(knopf, holen, nameVon = name) {
      if (!knopf) return;
      knopf.classList.add("vorleser-knopf");
      knopf.addEventListener("click", (e) => { e.stopPropagation(); if (lauf) { stopp(); if (SP()) SP().stopp(); return; } lies(holen().filter(sichtbar), nameVon); });
    },
    begleiter(el, text) {
      if (!el) return;
      el.classList.add("begleiter-tipp"); el.setAttribute("role", "button"); el.setAttribute("tabindex", "0"); el.setAttribute("data-vorlesen", "de");
      if (!el.getAttribute("aria-label")) el.setAttribute("aria-label", "Vorlesen");
      el.removeAttribute("aria-hidden");
      const los = () => { const sp = SP(), t = typeof text === "function" ? text() : text; if (!sp || !t) return; stopp(); sp.knopf(); sp.stopp(); sp.sprich(t, "de-DE");
        el.animate && el.animate([{ transform: "rotate(0)" }, { transform: "rotate(-6deg)" }, { transform: "rotate(5deg)" }, { transform: "rotate(0)" }], { duration: 450 }); };
      el.addEventListener("click", los);
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); los(); } });
    },
    name
  };
  // Antippen woanders hält das Kachel-Vorlesen an
  addEventListener("pointerdown", (e) => { if (lauf && !(e.target.closest && e.target.closest(".vorleser-knopf"))) stopp(); }, { capture: true, passive: true });
  window.Vorleser = Vorleser;
  window.__vorleser = { get laeuft() { return !!lauf; }, get aktuell() { return aktuell ? name(aktuell) : null; } };
})();
