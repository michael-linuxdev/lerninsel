// Gegen das Durchraten (13.11.2026, Beobachtung des Auftraggebers: „es wird nicht gelesen, solange geraten, bis es mit der richtigen
// Lösung weitergeht“). Gemeinsamer Baustein für Sachunterricht/Fächer, Tablet-Führerschein und Deutsch (Abenteuer, Werkstatt):
//   1. Anlauf:     Antwortknöpfe sind erst kurz nach dem Erscheinen der Frage antippbar (Zeit zum Lesen).
//   2. Denkpause:  Nach einer falschen Antwort ruhen die übrigen Knöpfe ein paar Sekunden – die Erklärung steht da, ein Balken läuft ab.
//   3. Rate-Bremse: Zwei sehr schnelle Fehler hintereinander → längere Pause und der Satz „Langsam! Erst lesen oder anhören“.
//   4. Bilanz:     Waren die meisten Fragen beim ersten Mal falsch, heißt es am Ende „Das üben wir noch einmal“ (Sterne erst im nächsten
//                  Durchgang, nichts geht verloren); der Elternbereich zeigt es (Daten `raten`).
// Keine Strafe, kein Verlust: Es wird nur langsamer als Nachdenken. Im automatischen Browser (navigator.webdriver) sind alle Zeiten 0,
// außer mit window.__ratenEcht = true (dann optional window.__ratenZeit = { anlauf, pause, lang, schnell } in ms). Test-Haken __raten.
(function () {
  const S = window.Spielwelt;
  const ZEIT = { anlauf: 1200, pause: 3000, lang: 6000, schnell: 2000 };
  const auto = () => !!navigator.webdriver && !window.__ratenEcht;
  const zeit = (k) => auto() ? 0 : (window.__ratenZeit && window.__ratenZeit[k] != null ? window.__ratenZeit[k] : ZEIT[k]);
  const jetzt = () => Date.now();
  const T = {
    lies: { de: "Erst lesen, dann weiter.", ru: "Сначала прочитай, потом дальше.", status: { ru: "entwurf" } },
    langsam: { de: "Langsam, {name}! Erst lesen oder anhören, dann tippen.", ru: "Не спеши, {name}! Сначала прочитай или послушай, потом нажимай.", status: { ru: "entwurf" } }
  };
  const esc = (t) => S && S.esc ? S.esc(t) : String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const mitName = (t) => t.replace("{name}", (S && S.profil && S.profil.name) || "du");

  let r = null;        // laufende Runde
  let uhr = null;      // Zeitgeber der laufenden Sperre
  function runde() { r = { fragen: 0, fehler: 0, schnell: 0, reihe: 0, frei: jetzt(), offen: false }; weg(); return r; }
  function weg() {
    clearTimeout(uhr); uhr = null;
    document.querySelectorAll(".raten-warte").forEach(b => b.classList.remove("raten-warte"));
    document.querySelectorAll(".raten-pause").forEach(p => p.remove());
  }
  const liste = (k) => !k ? [] : typeof k === "function" ? liste(k()) : k.nodeType ? [k] : Array.from(k);
  function sperre(knoepfe, ms, danach) {
    clearTimeout(uhr);
    const ks = liste(knoepfe).filter(b => b && !b.disabled);
    if (ms <= 0) { r.frei = jetzt(); danach && danach(); return; }
    ks.forEach(b => b.classList.add("raten-warte"));
    r.frei = jetzt() + ms;
    uhr = setTimeout(() => { uhr = null; ks.forEach(b => b.classList.remove("raten-warte")); danach && danach(); }, ms);
  }

  // Eine neue Frage erscheint. zaehlt: false = Wiederholung einer Frage (zählt nicht für die Bilanz);
  // teil: true = nächstes Kärtchen derselben Aufgabe (Zuordnen, Sortieren): die ganze Aufgabe zählt als eine Frage.
  function frage(knoepfe, { zaehlt = true, teil = false } = {}) {
    if (!r) runde();
    weg();
    if (teil) { sperre(knoepfe, zeit("anlauf")); return; }
    if (zaehlt) r.fragen++;
    r.offen = zaehlt; r.sauber = true;
    sperre(knoepfe, zeit("anlauf"));
  }
  // Falsche Antwort. knoepfe = die übrigen Antwortknöpfe, nach = Element, hinter dem der Pausen-Balken steht (Erklärung, Tipp).
  function fehler({ knoepfe, nach } = {}) {
    if (!r) runde();
    if (r.offen) { r.fehler++; r.offen = false; }
    r.sauber = false;
    const grenze = zeit("schnell"), schnell = grenze > 0 && jetzt() - r.frei < grenze;
    if (schnell) { r.schnell++; r.reihe++; } else r.reihe = 0;
    const lang = r.reihe >= 2, ms = zeit(lang ? "lang" : "pause");
    document.querySelectorAll(".raten-pause").forEach(p => p.remove());
    if (ms > 0 && nach && nach.insertAdjacentHTML) {
      const [de, ru] = S && S.paar ? S.paar(lang ? T.langsam : T.lies) : [(lang ? T.langsam : T.lies).de, ""];
      nach.insertAdjacentHTML("afterend", `<div class="raten-pause${lang ? " lang" : ""}" role="status"><span class="raten-text">${lang ? "🐢 " : "👀 "}${esc(mitName(de))}` +
        (ru ? `<small class="ru" lang="ru">${esc(mitName(ru))}</small>` : "") + `</span><span class="raten-bahn"><span class="raten-balken" style="animation-duration:${ms}ms"></span></span></div>`);
    }
    sperre(knoepfe, ms, () => document.querySelectorAll(".raten-pause").forEach(p => p.remove()));
    return { schnell, lang, ms };
  }
  // Richtig beim ersten Versuch beendet die Reihe schneller Fehler – richtig nach einem Fehler nicht (bei zwei Antworten ist das Durchtippen)
  function richtig() { if (!r) return; r.offen = false; if (r.sauber) r.reihe = 0; weg(); }
  // Bilanz der Runde: „ueben“, wenn mindestens 3 Fragen und mindestens die Hälfte beim ersten Mal falsch waren.
  const ueben = (fehlerN, fragen) => fragen >= 2 && fehlerN >= Math.max(3, Math.ceil(fragen / 2));
  function bilanz() { const x = r || { fragen: 0, fehler: 0, schnell: 0 }; return { fragen: x.fragen, fehler: x.fehler, schnell: x.schnell, ueben: ueben(x.fehler, x.fragen) }; }

  // Für den Elternbereich: Runden, die noch einmal geübt werden sollen (höchstens 12, je Inhalt die letzte). `raten.offen` =
  // [{ b: Bereich, id, name, am, fehler, fragen, schnell }]; ein später ordentlich geschaffter Inhalt verschwindet wieder.
  function merke(bereich, id, name) {
    if (!S || !S.lade) return;
    const d = S.lade("raten") || {}, x = bilanz();
    d.offen = (d.offen || []).filter(e => !(e.b === bereich && e.id === id));
    d.offen.unshift({ b: bereich, id, name: S.sauber ? S.sauber(name, 60) : String(name).slice(0, 60), am: S.heute(), fehler: x.fehler, fragen: x.fragen, schnell: x.schnell });
    d.offen = d.offen.slice(0, 12);
    S.speichere("raten", d);
  }
  function erledigt(bereich, id) {
    if (!S || !S.lade) return;
    const d = S.lade("raten"); if (!d || !d.offen || !d.offen.some(e => e.b === bereich && e.id === id)) return;
    d.offen = d.offen.filter(e => !(e.b === bereich && e.id === id)); S.speichere("raten", d);
  }
  const offen = () => ((S && S.lade && S.lade("raten")) || {}).offen || [];

  window.Raten = { ZEIT, runde, frage, fehler, richtig, bilanz, ueben, merke, erledigt, offen, weg };
  window.__raten = { get stand() { return r; }, zeit, wartet: () => document.querySelectorAll(".raten-warte").length };
})();
