// Gemeinsame Werkzeuge der Sprachkurse Englisch und Sorbisch (01.11.2026, aus beiden Seiten zusammengeführt – vorher wortgleich doppelt).
// Aufruf in der Seite: const { HL, mische, … } = Sprachkurs.werkzeuge({ $, daten: () => daten(), weiter: () => weiter() });
// Erwartet im HTML: #paula-gross, #blase, #liste-ansicht, #lektion-ansicht, #ende-ansicht. Nach core.js und sprache.js laden.
(function () {
  const S = window.Spielwelt, SP = window.Sprache;
  const HL = () => S.hilfe() || { code: "ru", kurz: "RU", tts: "ru-RU", name: "Russisch" };
  const mische = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const name = () => S.profil.name || "du";
  const mitName = (t) => (t || "").replace(/\{name\}/g, name());
  const klasse = () => ((S.stufe && S.stufe()) || {}).klasse || 2;
  const heute = () => S.heute();
  function werkzeuge({ $, daten, weiter }) {
    function paulaSpricht(an) { const f = $("paula-gross").firstElementChild; if (f) f.classList.toggle("spricht", an); }
    function sprichDe(text) { if (!daten().vorlesen || !text) return; paulaSpricht(true); SP.sprich(text, "de-DE", () => paulaSpricht(false)); }
    function zeige(n) { ["liste", "lektion", "ende"].forEach(v => $(v + "-ansicht").hidden = v !== n); scrollTo(0, 0); }
    function blase(html, gesprochen, ru) {
      const d = daten();
      $("blase").innerHTML = mitName(html) + `<div class="blase-knoepfe">` + (SP.verfuegbar() ? `<button class="klein-knopf" id="nochmal" aria-label="Nochmal vorlesen">🔊</button>` : "") +
        (d.ru && ru ? `<button class="klein-knopf" id="ru-knopf" lang="${HL().code}">${HL().kurz}</button>` : "") + `</div><p class="ru-text" id="ru-text" lang="${HL().code}" hidden></p>`;
      const nh = $("nochmal"); if (nh) nh.addEventListener("click", () => SP.sprich(mitName(gesprochen), "de-DE"));
      const rk = $("ru-knopf"); if (rk) rk.addEventListener("click", () => { const r = $("ru-text"); r.hidden = !r.hidden; r.textContent = mitName(ru); if (!r.hidden && SP.hat(HL().tts)) SP.sprich(mitName(ru), HL().tts); });
      if (gesprochen) sprichDe(mitName(gesprochen));
    }
    const weiterKnopf = (t = "Weiter") => `<button class="knopf weiter" id="weiter">${t}</button>`;
    const aufWeiter = () => $("weiter").addEventListener("click", () => { S.ton("tipp"); weiter(); });
    return { HL, mische, name, mitName, klasse, heute, paulaSpricht, sprichDe, zeige, blase, weiterKnopf, aufWeiter };
  }
  window.Sprachkurs = { werkzeuge, HL, mische, mitName, klasse, heute };
})();
