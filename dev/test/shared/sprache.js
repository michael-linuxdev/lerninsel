// Vorlesen mit den Stimmen des Geräts (Web Speech API).
// iPad/iPhone-Besonderheiten:
//  - Die erste Ausgabe muss durch eine Berührung ausgelöst werden → Entsperren beim ersten Antippen.
//  - "Premium"/"Erweitert"-Stimmen stehen oft in der Liste, sind aber nicht geladen und bleiben stumm.
//  - cancel() direkt vor speak() verschluckt manchmal den Satz → nur abbrechen, wenn gerade gesprochen wird.
(function () {
  const synth = window.speechSynthesis;
  const apple = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const NICHT = /premium|enhanced|erweitert|verbessert|eloquence|\b(bubbles|bad news|bahh|bells|boing|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|albert|fred|junior|ralph|grandpa|grandma|rocko|sandy|shelley|flo|reed|eddy)\b/i;
  let stimmen = [];
  const merker = []; // Chrome vergisst sonst laufende Ausgaben
  function lade() { stimmen = synth ? synth.getVoices() : []; }
  if (synth) { lade(); if (synth.addEventListener) synth.addEventListener("voiceschanged", lade); else synth.onvoiceschanged = lade; }

  function stimmeFuer(lang) {
    const kurz = lang.slice(0, 2).toLowerCase();
    const passend = stimmen.filter(v => (v.lang || "").toLowerCase().replace("_", "-").startsWith(kurz) && !NICHT.test(v.name));
    if (!passend.length) return null;
    const genau = passend.filter(v => v.lang.replace("_", "-").toLowerCase() === lang.toLowerCase());
    const liste = genau.length ? genau : passend;
    if (apple) return liste.find(v => v.default) || liste.find(v => v.localService) || liste[0];
    return liste.find(v => /google/i.test(v.name)) || liste.find(v => v.localService) || liste[0];
  }

  let entsperrt = false, abgebrochen = 0;
  function entsperren() {
    if (entsperrt || !synth) return;
    entsperrt = true;
    try { const u = new SpeechSynthesisUtterance(" "); u.volume = 0; synth.speak(u); } catch (e) { /* egal */ }
  }
  ["pointerdown", "touchend"].forEach(ev => addEventListener(ev, entsperren, { capture: true, passive: true }));

  // Vorlesen nur auf Knopfdruck (NA-60, Entscheidung des Auftraggebers): Gesprochen wird nur, wenn das Kind gerade (≤ 2,5 s) einen Vorlese-Knopf
  // angetippt hat (🔊/🔈 oder Beschriftung „Vorlesen“, „Anhören“, „Nochmal …“, „hören“, data-vorlesen), oder in einer Kette danach (fertig-Rückruf).
  // Eltern können das alte automatische Vorlesen einschalten: eltern.vorlesen.auto = true. Gesperrte Aufrufe rufen „fertig“ sofort auf.
  let letzterKnopf = 0, inKette = false;
  const VORLESE_TEXT = /vorles|anhör|hören|nochmal|vorsprech|abspielen|aussprache/i;
  const istVorleseKnopf = (el) => {
    const b = el && el.closest && el.closest("button, a, [role=button], [data-vorlesen], .wort, .karte-wort");
    if (!b) return false;
    if (b.hasAttribute("data-vorlesen")) return true;
    const t = (b.getAttribute("aria-label") || "") + " " + (b.getAttribute("title") || "") + " " + (b.textContent || "").slice(0, 40);
    return /[🔊🔈🔉]/u.test(t) || VORLESE_TEXT.test(t);
  };
  addEventListener("pointerdown", (e) => { if (istVorleseKnopf(e.target)) letzterKnopf = Date.now(); }, { capture: true, passive: true });
  addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && istVorleseKnopf(document.activeElement)) letzterKnopf = Date.now(); }, { capture: true });
  const automatisch = () => { try { const e = window.Spielwelt && window.Spielwelt.lade("eltern"); return !!(e && e.vorlesen && e.vorlesen.auto); } catch (x) { return false; } };
  const darf = () => automatisch() || inKette || Date.now() - letzterKnopf < 2500 || !!window.__vorlesenImmer;

  const Sprache = {
    // für Seiten: Ist automatisches Vorlesen erlaubt? (sonst nur auf Knopfdruck)
    automatisch,
    // ein Knopf, der vorlesen soll, aber keine passende Beschriftung hat, kann das hier melden
    knopf() { letzterKnopf = Date.now(); },
    verfuegbar() { return !!synth; },
    hat(lang) { lade(); return !!stimmeFuer(lang) || (apple && stimmen.some(v => (v.lang || "").toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()))); },
    stimmeName(lang) { lade(); const v = stimmeFuer(lang); return v ? `${v.name} (${v.lang})` : "keine eigene, Standardstimme des Geräts"; },
    stopp() { if (synth && (synth.speaking || synth.pending)) { synth.cancel(); abgebrochen = Date.now(); } },
    sprich(text, lang = "de-DE", fertig) {
      if (!synth || !text || !darf()) { if (fertig) fertig(); return; }
      text = String(text).replace(/[\uE100-\uE1FF]/g, "");   // Begleiter-Zeichen (Figuren.ZEICHEN) nicht vorlesen
      lade();
      const u = new SpeechSynthesisUtterance(text);
      const v = stimmeFuer(lang);
      if (v) u.voice = v;
      u.lang = lang;
      u.rate = apple ? 0.95 : (lang.startsWith("de") ? 0.88 : 0.9);
      u.pitch = 1.05;
      u.volume = 1;
      const ende = () => { const i = merker.indexOf(u); if (i >= 0) merker.splice(i, 1); if (fertig) { inKette = true; try { fertig(); } finally { inKette = false; } } };
      u.onend = ende; u.onerror = ende;
      merker.push(u);
      if (synth.paused) synth.resume();
      if (synth.speaking || synth.pending) { synth.cancel(); abgebrochen = Date.now(); }
      const warte = Math.max(0, 150 - (Date.now() - abgebrochen));
      if (warte) setTimeout(() => synth.speak(u), warte); else synth.speak(u);
    }
  };
  window.Sprache = Sprache;

  // Russische Zeilen vorlesen (10.11.2026, Wunsch des Auftraggebers „überall russisch vorlesen“): Jede russische Hilfezeile (.ru, .hilfe-ru,
  // [lang="ru"]) wird selbst zum Vorlese-Knopf – antippen liest sie mit der russischen Gerätestimme vor; ein kleines Lautsprecher-Zeichen zeigt das an.
  // textContent bleibt unverändert (Zeichen per CSS). Zeilen in Knöpfen/Links/Eingaben bleiben aus (dort wählt Antippen die Antwort),
  // ebenso alles unter [data-ru-vorlesen="aus"]. Gilt nur mit Hilfesprache Russisch.
  const RU_WAHL = '.ru, .hilfe-ru, [lang="ru"]';
  const hilfeRu = () => { try { const h = window.Spielwelt && window.Spielwelt.hilfe && window.Spielwelt.hilfe(); return h && h.code === "ru" ? h : null; } catch (x) { return null; } };
  // NA-54 „Ausschleichen“ (10.11.2026): bei Spielwelt.hilfeDosis() = "knopf" oder "neu" wird die Zeile versteckt (.ru-zu) und davor steht ein
  // kleiner Knopf „RU“ (.ru-auf); Antippen zeigt sie und liest sie vor. "neu": beim ersten Mal (Prüfsumme des Texts noch nicht gesehen) bleibt sie sichtbar.
  // Zeilen in Knöpfen/Links werden nur versteckt (dort hat kein zweiter Knopf Platz). Ändert sich der Text, wird neu entschieden.
  const dosis = () => { try { return (window.Spielwelt && window.Spielwelt.hilfeDosis && window.Spielwelt.hilfeDosis()) || "immer"; } catch (x) { return "immer"; } };
  const pruefsumme = (t) => { let h = 2166136261; for (const c of t) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; } return h.toString(36); };
  function ruDosiere(el) {
    const d = dosis(); if (d === "immer") return;
    const t = (el.textContent || "").trim(); if (!t || el.dataset.ruText === t) return;
    el.dataset.ruText = t;
    let b = el.previousElementSibling; if (!(b && b.classList.contains("ru-auf"))) b = null;
    const h = pruefsumme(t), S = window.Spielwelt;
    if (d === "neu" && S && S.hilfeGesehen && !S.hilfeGesehen(h)) { S.merkeHilfe(h); el.classList.remove("ru-zu"); if (b) b.hidden = true; return; }
    el.classList.add("ru-zu");
    if (el.closest('button, a, label, [role=button]:not(.ru-hoerbar)')) return;
    if (!b) { b = document.createElement("button"); b.type = "button"; b.className = "ru-auf"; b.textContent = "RU"; b.setAttribute("aria-label", "Hilfe auf Russisch zeigen"); b.dataset.vorlesen = "ru"; b.lang = "de";
      el.insertAdjacentElement("beforebegin", b); }
    b.hidden = false;
  }
  function ruMarkiere(wurzel) {
    if (!hilfeRu() || !wurzel || !wurzel.querySelectorAll) return;
    const liste = wurzel.matches && wurzel.matches(RU_WAHL) ? [wurzel] : [];
    wurzel.querySelectorAll(RU_WAHL).forEach(e => liste.push(e));
    if (wurzel.closest && !(wurzel.matches && wurzel.matches(RU_WAHL))) { const o = wurzel.closest(RU_WAHL); if (o) liste.push(o); }
    liste.forEach(ruDosiere);
    liste.forEach(el => {
      if (el.classList.contains("ru-hoerbar") || el === document.documentElement || el === document.body) return;
      if (el.closest('button, a, label, input, textarea, select, [role=button], [contenteditable], [data-ru-vorlesen="aus"]')) return;
      if (el.parentElement && el.parentElement.closest(".ru-hoerbar")) return;
      if (!(el.textContent || "").trim()) return;
      el.classList.add("ru-hoerbar"); el.setAttribute("role", "button"); el.setAttribute("tabindex", "0"); el.dataset.vorlesen = "ru";
      el.setAttribute("title", "Auf Russisch vorlesen");
    });
  }
  function ruSprich(el) { const h = hilfeRu(); letzterKnopf = Date.now(); Sprache.sprich((el.textContent || "").trim(), (h && h.tts) || "ru-RU"); }
  function ruStart() {
    if (!document.body || !hilfeRu()) return;
    const st = document.createElement("style");
    st.textContent = `.ru-hoerbar { cursor: pointer; border-radius: 8px; -webkit-tap-highlight-color: transparent; }
      .ru-hoerbar::after { content: ""; display: inline-block; width: 1.05em; height: 1.05em; margin-left: .3em; vertical-align: -.15em;
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3 9h4l5-4v14l-5-4H3z' fill='%23FFC93C' stroke='%233B1F63' stroke-width='1.8' stroke-linejoin='round'/%3E%3Cpath d='M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12' fill='none' stroke='%233B1F63' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E") center / contain no-repeat; }
      .ru-hoerbar:active, .ru-hoerbar.spricht { background: #FFF1C2; }
      .ru-zu { display: none !important; }
      .ru-auf { display: inline-flex; align-items: center; justify-content: center; min-width: 44px; min-height: 40px; margin: 2px 6px; padding: 0 10px; border-radius: 12px;
        border: 2px solid #3B1F63; background: #FFC93C; color: #3B1F63; font: 700 .9rem Fredoka, sans-serif; box-shadow: 0 3px 0 #3B1F63; cursor: pointer; vertical-align: middle; }
      .ru-auf[hidden] { display: none; }`;
    document.head.appendChild(st);
    ruMarkiere(document.body);
    new MutationObserver(m => m.forEach(x => x.addedNodes.forEach(n => { if (n.nodeType === 1) ruMarkiere(n); else if (n.parentElement) ruMarkiere(n.parentElement); })))
      .observe(document.body, { childList: true, subtree: true });
    document.addEventListener("click", (e) => { const auf = e.target.closest && e.target.closest(".ru-auf");
      if (auf) { e.stopPropagation(); e.preventDefault(); const el = auf.nextElementSibling; if (el) { el.classList.remove("ru-zu"); auf.hidden = true; ruSprich(el); } return; } }, true);
    document.addEventListener("click", (e) => { const el = e.target.closest && e.target.closest(".ru-hoerbar"); if (!el) return; e.stopPropagation(); ruSprich(el);
      el.classList.add("spricht"); setTimeout(() => el.classList.remove("spricht"), 600); }, true);
    document.addEventListener("keydown", (e) => { const el = document.activeElement; if ((e.key === "Enter" || e.key === " ") && el && el.classList && el.classList.contains("ru-hoerbar")) { e.preventDefault(); ruSprich(el); } });
  }
  Sprache.ruMarkiere = ruMarkiere;

  // Russische Zeilen per Tabelle (10.11.2026): Seiten melden Satzpaare an (Sprache.ruDazu([[de, ru], …])) und nennen die Elemente, unter deren
  // deutschem Text die russische Zeile stehen soll (Sprache.ruBeobachte(".blase p, #meldung")). Ändert sich der deutsche Text, sucht die Tabelle den
  // Satz: Der Name des Kindes wird zu {name}, Schachfelder (e2) zu {f0}, {f1} …, Zahlen zu {0}, {1} …; Emojis und Begleiter-Zeichen zählen nicht.
  // Die Zeile hängt als <span class="ru ru-auto" lang="ru"> im Element (Block, antippbar zum Vorlesen). Unbekannte Sätze bekommen keine Zeile.
  // Nur mit Hilfesprache Russisch; alle Einträge sind Entwürfe (Russisch steht in Spielwelt.ENTWURF_FREI).
  const RU_TAB = new Map();
  const PIKTO = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}️‍-←-⇿⌀-⏿■-◿♔-♟]/gu;
  function ruZerlege(text, mitPlatzhalter) {
    let t = String(text || "").replace(PIKTO, " ").replace(/([.!?])(?=[A-Za-zÄÖÜäöüß])/g, "$1 ").replace(/\s+/g, " ").trim();
    const name = (window.Spielwelt && window.Spielwelt.profil && window.Spielwelt.profil.name) || "";
    if (!mitPlatzhalter && name.length >= 2) t = t.split(name).join("{name}");
    const felder = [], zahlen = [];
    t = t.replace(/\b[a-h][1-8]\b/g, (f) => { felder.push(f); return "{f}"; });
    t = t.replace(/\d+(?:[.,]\d+)?/g, (z) => { zahlen.push(z); return "{n}"; });
    if (mitPlatzhalter) t = t.replace(/\{\d+\}/g, "{n}").replace(/\{f\d+\}/g, "{f}");
    return { key: t.replace(/\s+([.,!?;:…])/g, "$1"), felder, zahlen };
  }
  // {w} im deutschen Satz = beliebiges Wort/Textstück, das deutsch bleibt (z. B. das Lernwort); im Russischen {w0}, {w1} …
  const RU_MUSTER = [];
  const reEsc = (t) => t.replace(/[.*+?^$()|[\]\\]/g, "\\$&");
  Sprache.ruDazu = (paare) => { (paare || []).forEach(([de, ru]) => { if (!de || !ru) return; const k = ruZerlege(de, true).key;
    if (k.includes("{w}")) RU_MUSTER.push([new RegExp("^" + k.split("{w}").map(t => reEsc(t).replace(/\\\{/g, "{").replace(/\\\}/g, "}")).join("(.+?)") + "$"), ru]); else RU_TAB.set(k, ru); }); };
  Sprache.ruVon = (de) => {
    const z = ruZerlege(de); let ru = RU_TAB.get(z.key);
    if (!ru) { for (const [re, r] of RU_MUSTER) { const m = re.exec(z.key); if (m) { const w = m.slice(1).map(x => x.replace(/\{name\}/g, "%NAME%")); ru = r.replace(/\{w(\d+)\}/g, (_, i) => w[+i] || ""); break; } } }
    if (!ru) return "";
    const name = (window.Spielwelt && window.Spielwelt.profil && window.Spielwelt.profil.name) || "";
    // Platzhalter im gefundenen deutschen Stück ({n}, {f}) wieder füllen, dann die russischen Platzhalter
    let zi = 0, fi = 0;
    const zurueck = (t) => t.replace(/%NAME%/g, name).replace(/\{f\}/g, () => z.felder[fi++] || "").replace(/\{n\}/g, () => z.zahlen[zi++] || "");
    if (ru.includes("%NAME%") || /\{[nf]\}/.test(ru)) ru = zurueck(ru);
    return ru.replace(/\{name\}/g, name).replace(/\{f(\d+)\}/g, (_, i) => z.felder[+i] || "").replace(/\{(\d+)\}/g, (_, i) => z.zahlen[+i] || "");
  };
  const ruDe = (el) => { let t = ""; el.childNodes.forEach(n => { if (!(n.nodeType === 1 && (n.classList.contains("ru-auto") || n.matches("button, a, input, select, textarea")))) t += n.textContent; }); return t; };
  function ruZeile(el) {
    const de = ruDe(el); if (el.dataset.ruDe === de) return; el.dataset.ruDe = de;
    let n = el.querySelector(":scope > .ru-auto"); const ru = Sprache.ruVon(de);
    if (!ru) { if (n) n.remove(); return; }
    if (!n) { n = document.createElement("span"); n.className = "ru ru-auto"; n.lang = "ru"; n.dataset.emoji = "aus"; el.appendChild(n); }
    if (n.textContent !== ru) n.textContent = ru;
  }
  Sprache.ruBeobachte = (wahl) => {
    const los = () => {
      if (!hilfeRu() || !document.body) return;
      if (!document.getElementById("ru-auto-stil")) { const st = document.createElement("style"); st.id = "ru-auto-stil";
        st.textContent = ".ru-auto { display: block; font-size: .82em; font-weight: 500; color: #5B4A7A; margin-top: 4px; line-height: 1.3; text-align: inherit; }"; document.head.appendChild(st); }
      const lauf = () => { geplant = false; document.querySelectorAll(wahl).forEach(ruZeile); };
      let geplant = false;
      new MutationObserver(() => { if (!geplant) { geplant = true; (window.requestAnimationFrame || setTimeout)(lauf); } }).observe(document.body, { childList: true, subtree: true, characterData: true });
      lauf();
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", los); else los();
  };
  if (typeof document !== "undefined") { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ruStart); else setTimeout(ruStart, 0); }
})();
