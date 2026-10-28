// Zeitsystem „Erst lernen, dann spielen“ (nach core.js und charakter.js laden).
// Seitenart über das Script-Attribut: data-art="lernen" | "spielen" | "insel" | "neutral" | "eltern"
//   lernen  – aktive Lernzeit wird gezählt (nur mit Eingaben in der letzten Minute)
//   spielen – verbraucht Spielzeit; ohne Spielzeit erscheint „Erst lernen, dann spielen“
//   insel   – verbraucht Spielzeit, sperrt aber nicht (die Insel zeigt selbst den Lernmodus)
// Standardwerte nach der DGKJ-Empfehlung zur freizeitlichen Bildschirmzeit; Eltern können alles ändern.
(function () {
  const S = window.Spielwelt; if (!S) return;
  const C = () => window.Charakter;
  const ART = (document.currentScript && document.currentScript.dataset.art) || "neutral";
  const TICK = 5;           // Sekunden
  const AKTIV_FENSTER = 60; // Sekunden ohne Eingabe gelten als Pause
  const LERN_FAECHER = ["mathe", "deutsch", "tablet", "sachkunde", "englisch", "sorbisch"];

  // ---------- Regeln (pro Kind, im Elternbereich einstellbar) ----------
  function empfehlung(alter) {
    if (alter < 6) return { lernMin: 5, lernAufgaben: 5, spielMin: 15, maxSpiel: 30 };
    if (alter < 9) return { lernMin: 10, lernAufgaben: 8, spielMin: 20, maxSpiel: 40 };
    if (alter < 12) return { lernMin: 15, lernAufgaben: 10, spielMin: 25, maxSpiel: 60 };
    return { lernMin: 15, lernAufgaben: 12, spielMin: 30, maxSpiel: 90 };
  }
  function regeln() {
    const e = S.lade("eltern") || {}, alter = S.kind().alter;
    return Object.assign({ an: true, ruheVon: "19:30", ruheBis: "07:00", fokus: false, ruhig: false }, empfehlung(alter), e.zeit || {});
  }
  function setzeRegeln(neu) { const e = S.lade("eltern") || {}; e.zeit = Object.assign({}, e.zeit || {}, neu); S.speichere("eltern", e); }

  // ---------- Tageswerte ----------
  const pad = (n) => String(n).padStart(2, "0");
  const heute = () => { if (window.__heute) return window.__heute; const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  // Vergangene Tage für den Wochenbericht (höchstens 60 Tage)
  function merkeTag(alt) {
    if (!alt || !alt.tag || (!alt.lernSek && !alt.spielSek && !alt.aufgaben)) return;
    const v = S.lade("zeitverlauf") || [];
    if (v.some(x => x.tag === alt.tag)) return;
    v.push({ tag: alt.tag, lern: Math.round(alt.lernSek / 60), aufgaben: alt.aufgaben, spiel: Math.round(alt.spielSek / 60) });
    S.speichere("zeitverlauf", v.slice(-60));
  }
  function verlauf() {
    const v = (S.lade("zeitverlauf") || []).slice(), d = tag();
    v.push({ tag: d.tag, lern: Math.round(d.lernSek / 60), aufgaben: d.aufgaben, spiel: Math.round(d.spielSek / 60), heute: true });
    return v;
  }
  function tag() {
    let d = S.lade("zeit");
    if (d && d.tag !== heute()) merkeTag(d);
    if (!d || d.tag !== heute()) d = { tag: heute(), lernSek: 0, aufgaben: 0, spielSek: 0, extraMin: 0, gewarnt: 0, seitPause: 0, seitWasser: 0, seitAugen: 0 };
    return d;
  }
  const speichere = (d) => S.speichere("zeit", d);

  // ---------- Ruhezeit ----------
  const minuten = (hhmm) => { const [h, m] = String(hhmm || "0:0").split(":").map(Number); return (h || 0) * 60 + (m || 0); };
  function inRuhe(r = regeln()) {
    if (!r.ruheVon || !r.ruheBis || r.ruheVon === r.ruheBis) return false;
    const d = window.__jetzt ? new Date(window.__jetzt) : new Date(), jetzt = d.getHours() * 60 + d.getMinutes();
    const von = minuten(r.ruheVon), bis = minuten(r.ruheBis);
    return von < bis ? jetzt >= von && jetzt < bis : jetzt >= von || jetzt < bis;
  }

  // ---------- Status ----------
  function status() {
    const r = regeln(), d = tag();
    const frei = !r.an || S.test || (S.erwachsen && S.erwachsen());
    // Ferien (NA-61): halbe Lernpflicht nur, wenn die Eltern es ausdrücklich erlaubt haben (eltern.ferien.weniger)
    const fw = S.ferienWeniger && S.ferienWeniger() ? 0.5 : 1;
    const L = Math.max(1, Math.round(r.lernMin * fw)) * 60, A = Math.max(1, Math.round(r.lernAufgaben * fw));
    const bloecke = Math.max(Math.floor(d.lernSek / L), Math.floor(d.aufgaben / A));
    const tagesGrenze = r.maxSpiel * 60 + d.extraMin * 60;
    const erlaubt = Math.min(bloecke * r.spielMin * 60 + d.extraMin * 60, tagesGrenze);
    const rest = Math.max(0, erlaubt - d.spielSek);
    const genug = d.spielSek >= tagesGrenze;
    const fortschritt = Math.min(1, Math.max((d.lernSek % L) / L, (d.aufgaben % A) / A));
    const ruhe = !frei && inRuhe(r);
    return {
      frei, ruhe, regeln: r, lernSek: d.lernSek, aufgaben: d.aufgaben, spielSek: d.spielSek, bloecke, erlaubt, rest, genug, fortschritt,
      spielen: frei || (!ruhe && rest > 0),
      fehltMin: Math.max(0, Math.ceil((L - d.lernSek % L) / 60)), fehltAufgaben: Math.max(0, A - d.aufgaben % A)
    };
  }

  // ---------- Zählen ----------
  let letzteEingabe = Date.now();
  ["pointerdown", "keydown", "touchstart"].forEach(ev => addEventListener(ev, () => { letzteEingabe = Date.now(); }, { capture: true, passive: true }));
  function aufgabe() { const d = tag(); d.aufgaben++; speichere(d); pruefeFreischaltung(); }
  // Richtig gelöste Aufgaben in den Lernfächern zählen (dort gibt es je 1 Erfahrungspunkt beim ersten Versuch)
  if (C() && C().gib) {
    const orig = C().gib;
    C().gib = function (id, n) { if (LERN_FAECHER.includes(id) && n === 1) aufgabe(); return orig.apply(this, arguments); };
  }
  let warVorher = null;
  function pruefeFreischaltung() {
    const st = status();
    if (warVorher === false && st.spielen && !st.frei && ART === "lernen" && C()) C().hinweis("🏝️ Spielzeit freigeschaltet!", `Du darfst jetzt ${Math.round(st.rest / 60)} Minuten spielen.`, "#2E9C5A");
    warVorher = st.spielen;
  }

  // ---------- Overlays ----------
  function overlay(html) {
    let o = document.getElementById("zeit-overlay");
    if (!o) {
      o = document.createElement("div"); o.id = "zeit-overlay";
      o.style.cssText = "position:fixed;inset:0;z-index:95;background:rgba(40,30,80,.72);display:grid;place-items:center;padding:20px;font-family:Fredoka,sans-serif";
      document.body.appendChild(o);
    }
    o.innerHTML = `<div style="background:#fff;border-radius:32px;padding:28px;width:min(560px,100%);text-align:center;box-shadow:0 12px 0 rgba(0,0,0,.15);color:#3b1f63">${html}</div>`;
    return o;
  }
  const wurzel = (document.querySelector("script[data-root]") || {}).dataset ? document.querySelector("script[data-root]").dataset.root : "./";
  const knopf = (href, text, haupt) => `<a href="${wurzel}${href}" style="display:inline-flex;align-items:center;justify-content:center;min-height:56px;padding:0 20px;margin:6px;border-radius:999px;text-decoration:none;font-weight:700;font-size:1.1rem;${haupt ? "background:#4B2380;color:#fff" : "background:#F1EAFF;color:#4B2380"}">${text}</a>`;
  function leiste(st) {
    const p = Math.round(st.fortschritt * 100);
    return `<div style="margin:14px auto;max-width:420px"><div style="height:22px;border-radius:999px;background:#EEE6FB;overflow:hidden"><div style="height:100%;width:${p}%;background:linear-gradient(90deg,#5CCBA6,#2E9C5A);border-radius:999px"></div></div>
      <div style="display:flex;justify-content:space-between;font-weight:600;margin-top:6px"><span>📚 Lernen</span><span>🏝️ Spielen</span></div></div>`;
  }
  // Ideen fürs echte Leben, wenn die Spielzeit vorbei ist
  const IDEEN = [
    ["🏕️", "Bau eine Höhle aus Decken und Kissen!"], ["🎨", "Mal ein Bild von deinem Tier auf der Insel!"], ["📚", "Lies ein Buch oder lass dir vorlesen!"],
    ["🍳", "Hilf beim Kochen oder Tischdecken!"], ["🧱", "Bau den höchsten Turm, den du schaffst!"], ["🏃", "Spiel draußen Fangen oder Verstecken!"],
    ["🍂", "Sammle draußen 5 verschiedene Blätter!"], ["🗣️", "Erzähl jemandem, was du heute gelernt hast!"], ["🧩", "Mach ein Puzzle oder spiel ein Brettspiel!"]
  ];
  const idee = () => {
    // Die Echte-Welt-Aufgabe des Tages hat Vorrang (shared/echtewelt.js), sonst eine zufällige Idee
    const ew = window.EchteWelt && window.EchteWelt.heutige();
    if (ew && !ew.erledigt) return `<p style="font-size:1.2rem;background:#E3F7EF;border-radius:18px;padding:12px 16px;margin:12px 0"><span style="font-size:2rem;vertical-align:middle">${ew.e}</span> <b>Deine Echte-Welt-Aufgabe:</b> ${ew.text}</p>`;
    const [e, t] = IDEEN[Math.floor(Math.random() * IDEEN.length)]; return `<p style="font-size:1.25rem;background:#E3F7EF;border-radius:18px;padding:12px 16px;margin:12px 0"><span style="font-size:2rem;vertical-align:middle">${e}</span> <b>Idee für jetzt:</b> ${t}</p>`; };
  function zeigeSperre(st) {
    if (st.ruhe) {
      overlay(`<div style="font-size:4rem">🌙</div><h2 style="margin:6px 0">Die Insel schläft</h2>
        <p style="font-size:1.2rem;line-height:1.4">Jetzt ist Bildschirm-Pause bis ${st.regeln.ruheBis} Uhr. Erzähl jemandem von deinem Tag oder lies ein Buch!</p>
        ${knopf("spiele/eltern/", "Für Erwachsene", false)}`);
      return;
    }
    if (st.genug) {
      overlay(`<div style="font-size:4rem">😴</div><h2 style="margin:6px 0">Genug gespielt für heute</h2>
        <p style="font-size:1.2rem;line-height:1.4">Dein Tier ist müde. Morgen geht es weiter!</p>${idee()}
        ${knopf("", "🏠 Zur Startseite", true)}`);
      return;
    }
    const vorbei = st.bloecke > 0 && st.rest <= 0;
    overlay(`<div style="font-size:4rem">${vorbei ? "⏰" : "🌱"}</div><h2 style="margin:6px 0">${vorbei ? "Spielzeit vorbei!" : "Erst lernen, dann spielen"}</h2>${vorbei ? idee() : ""}
      <p style="font-size:1.2rem;line-height:1.4">Noch ${st.fehltMin} Minuten lernen oder ${st.fehltAufgaben} Aufgaben richtig lösen, dann darfst du ${st.regeln.spielMin} Minuten spielen.</p>
      ${leiste(st)}
      <div>${(S.stufe && (S.stufe() || {}).code === "vs") ? knopf("spiele/vorschule/", "🎒 Vorschul-Rucksack", true) : ""}${knopf("spiele/mathe/", "🧮 Mathe", true)}${knopf("spiele/deutsch/", "🦊 Deutsch", true)}${knopf("spiele/sachkunde/", "🦉 Sachunterricht", true)}${knopf("spiele/englisch/", "🦜 Englisch", true)}${(((S.lade("eltern") || {}).sorbisch || {}).an) ? knopf("spiele/sorbisch/", "🪺 Sorbisch", true) : ""}${knopf("spiele/medien/", "🤖 Tablet", true)}</div>
      ${knopf("", "🏠 Zur Startseite", false)}`);
  }
  function entferneOverlay() { const o = document.getElementById("zeit-overlay"); if (o) o.remove(); }

  // ---------- Ablauf je Seite ----------
  function pruefeSeite() {
    if (ART === "eltern") return;
    const st = status();
    if (st.frei) { entferneOverlay(); return; }
    if (st.ruhe) { zeigeSperre(st); return; }
    if (ART === "spielen" && !st.spielen) { zeigeSperre(st); return; }
    entferneOverlay();
  }
  function tick() {
    if (document.hidden || ART === "eltern" || ART === "neutral") return;
    const st = status(); if (st.frei || st.ruhe) return;
    const d = tag();
    if (ART === "lernen") {
      if ((Date.now() - letzteEingabe) / 1000 <= AKTIV_FENSTER) { d.lernSek += TICK; speichere(d); pruefeFreischaltung(); window.__zeitLern(d); speichere(d); }
    } else if ((ART === "spielen" || ART === "insel") && st.spielen) {
      d.spielSek += TICK;
      const rest = Math.max(0, st.rest - TICK);
      if (rest <= 120 && rest > 0 && d.gewarnt !== st.bloecke + "/" + d.extraMin && C()) {
        d.gewarnt = st.bloecke + "/" + d.extraMin; C().hinweis("⏰ Noch 2 Minuten", "Dann macht die Insel eine Pause.", "#E8A33D");
      }
      window.__zeitSpiel(d);
      speichere(d);
      if (rest <= 0) { if (ART === "spielen") zeigeSperre(status()); document.dispatchEvent(new CustomEvent("zeit-aenderung")); }
    }
  }

  // ---------- Fokus-Hilfen und Erinnerungen ----------
  const UEBUNGEN = [
    ["Hüpfe 10-mal wie ein Frosch!", "🐸"], ["Strecke dich ganz groß bis zur Decke!", "🙆"], ["Drehe dich 3-mal langsam im Kreis!", "🌀"],
    ["Klatsche 10-mal in die Hände!", "👏"], ["Atme 3-mal tief ein und aus – wie ein Luftballon!", "🎈"], ["Stampfe 10-mal wie ein Elefant!", "🐘"],
    ["Stell dich auf ein Bein und zähle bis 10!", "🦩"], ["Schüttle Arme und Beine aus!", "💃"]
  ];
  function bewegungspause() {
    const [text, e] = UEBUNGEN[Math.floor(Math.random() * UEBUNGEN.length)];
    const o = overlay(`<div style="font-size:4rem">${e}</div><h2 style="margin:6px 0">Bewegungspause mit Fipsi</h2>
      <p style="font-size:1.4rem;line-height:1.4;font-weight:600">${text}</p>
      <button id="pause-fertig" disabled style="font:inherit;font-weight:700;font-size:1.2rem;min-height:60px;padding:0 28px;border:0;border-radius:999px;background:#2E9C5A;color:#fff;opacity:.5">Noch <span id="pause-n">15</span> Sekunden</button>`);
    if (window.Sprache && window.Sprache.sprich) window.Sprache.sprich(text, "de-DE");
    let n = 15; const b = o.querySelector("#pause-fertig");
    const t = setInterval(() => { n--; const el = o.querySelector("#pause-n"); if (el) el.textContent = n; if (n <= 0) { clearInterval(t); b.disabled = false; b.style.opacity = 1; b.textContent = "Geschafft! 💪"; } }, 1000);
    b.addEventListener("click", () => { entferneOverlay(); if (S.ton) S.ton("juhu"); });
  }
  Zeit_hooks();
  function Zeit_hooks() {
    window.__zeitLern = (d) => {
      const r = regeln();
      d.seitPause = (d.seitPause || 0) + TICK; d.seitWasser = (d.seitWasser || 0) + TICK;
      if (r.fokus && d.seitPause >= 300) { d.seitPause = 0; speichere(d); bewegungspause(); return; }
      if (d.seitWasser >= 1200 && C()) { d.seitWasser = 0; speichere(d); C().hinweis("🦉 Ella sagt:", "Trink einen Schluck Wasser! Das hilft beim Denken.", "#1F8F8A"); }
    };
    window.__zeitSpiel = (d) => {
      d.seitAugen = (d.seitAugen || 0) + TICK;
      if (d.seitAugen >= 900 && C()) { d.seitAugen = 0; speichere(d); C().hinweis("🤖 Pixel sagt:", "Augenpause! Schau 20 Sekunden aus dem Fenster in die Ferne.", "#2F86C8"); }
    };
  }
  // Ruhige Darstellung: keine Animationen und Übergänge
  function ruhigAnwenden() {
    if (!regeln().ruhig) return;
    document.documentElement.classList.add("ruhig");
    const st = document.createElement("style"); st.textContent = ".ruhig *, .ruhig *::before, .ruhig *::after { animation: none !important; transition: none !important; }";
    document.head.appendChild(st);
  }
  ruhigAnwenden();

  const Zeit = {
    ART, regeln, setzeRegeln, empfehlung, status, aufgabe, inRuhe,
    extra(min) { const d = tag(); d.extraMin += min; speichere(d); },
    // Eltern legen die restliche Spielzeit für heute direkt fest („Du darfst noch x Minuten spielen“).
    // Gilt auch ohne Lernen (bewusste Ausnahme der Eltern) und kann auch verkürzen (0 = für heute Schluss).
    // Umsetzung über extraMin (darf negativ oder krumm sein), damit Tagesgrenze und Anzeige wie gewohnt funktionieren. Ruhezeit gilt weiter.
    noch(min) {
      min = Math.max(0, Math.min(240, Math.round(min) || 0));
      const st = status(), d = tag(), r = st.regeln;
      const basis = Math.min(st.bloecke * r.spielMin * 60, r.maxSpiel * 60) + d.extraMin * 60 - d.spielSek;
      d.extraMin += (min * 60 - basis) / 60;
      d.geschenk = { min, gezeigt: false };
      speichere(d); document.dispatchEvent(new CustomEvent("zeit-aenderung"));
      return status();
    },
    heute: tag, bewegungspause, verlauf,
    leisteHtml: () => leiste(status())
  };
  window.Zeit = Zeit;
  warVorher = status().spielen;
  // Ansage fürs Kind, wenn die Eltern die Spielzeit festgelegt haben (einmal, auf der nächsten Kinder-Seite)
  function zeigeGeschenk() {
    if (ART === "eltern" || !C()) return;
    const d = tag(); if (!d.geschenk || d.geschenk.gezeigt) return;
    d.geschenk.gezeigt = true; speichere(d);
    const m = d.geschenk.min;
    if (m > 0) C().hinweis(`🎁 Du darfst heute noch ${m} ${m === 1 ? "Minute" : "Minuten"} spielen!`, "Das haben deine Eltern so eingestellt.", "#2E9C5A");
    else C().hinweis("⏰ Für heute ist Schluss mit Spielen", "Das haben deine Eltern so entschieden. Lernen geht noch!", "#E8A33D");
  }
  const start = () => { pruefeSeite(); zeigeGeschenk(); setInterval(tick, TICK * 1000); };
  if (document.body) start(); else addEventListener("DOMContentLoaded", start);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) pruefeSeite(); });
})();
