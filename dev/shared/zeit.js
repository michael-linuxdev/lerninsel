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
  const LERN_FAECHER = ["mathe", "deutsch", "tablet", "sachkunde"];

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
  function tag() {
    let d = S.lade("zeit");
    if (!d || d.tag !== heute()) d = { tag: heute(), lernSek: 0, aufgaben: 0, spielSek: 0, extraMin: 0, gewarnt: 0 };
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
    const L = Math.max(1, r.lernMin) * 60, A = Math.max(1, r.lernAufgaben);
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
  function zeigeSperre(st) {
    if (st.ruhe) {
      overlay(`<div style="font-size:4rem">🌙</div><h2 style="margin:6px 0">Die Insel schläft</h2>
        <p style="font-size:1.2rem;line-height:1.4">Jetzt ist Bildschirm-Pause bis ${st.regeln.ruheBis} Uhr. Erzähl jemandem von deinem Tag oder lies ein Buch!</p>
        ${knopf("spiele/eltern/", "Für Erwachsene", false)}`);
      return;
    }
    if (st.genug) {
      overlay(`<div style="font-size:4rem">😴</div><h2 style="margin:6px 0">Genug gespielt für heute</h2>
        <p style="font-size:1.2rem;line-height:1.4">Dein Tier ist müde. Wie wäre es mit Bewegung draußen, Malen oder Bauen? Morgen geht es weiter!</p>
        ${knopf("", "🏠 Zur Startseite", true)}`);
      return;
    }
    overlay(`<div style="font-size:4rem">🌱</div><h2 style="margin:6px 0">Erst lernen, dann spielen</h2>
      <p style="font-size:1.2rem;line-height:1.4">Noch ${st.fehltMin} Minuten lernen oder ${st.fehltAufgaben} Aufgaben richtig lösen, dann darfst du ${st.regeln.spielMin} Minuten spielen.</p>
      ${leiste(st)}
      <div>${knopf("spiele/mathe/", "🧮 Mathe", true)}${knopf("spiele/deutsch/", "🦊 Deutsch", true)}${knopf("spiele/sachkunde/", "🦉 Sachkunde", true)}${knopf("spiele/medien/", "🤖 Tablet", true)}</div>
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
      if ((Date.now() - letzteEingabe) / 1000 <= AKTIV_FENSTER) { d.lernSek += TICK; speichere(d); pruefeFreischaltung(); Zeit._nachLernTick && Zeit._nachLernTick(d); }
    } else if ((ART === "spielen" || ART === "insel") && st.spielen) {
      d.spielSek += TICK;
      const rest = Math.max(0, st.rest - TICK);
      if (rest <= 120 && rest > 0 && d.gewarnt !== st.bloecke + "/" + d.extraMin && C()) {
        d.gewarnt = st.bloecke + "/" + d.extraMin; C().hinweis("⏰ Noch 2 Minuten", "Dann macht die Insel eine Pause.", "#E8A33D");
      }
      speichere(d);
      Zeit._nachSpielTick && Zeit._nachSpielTick(d);
      if (rest <= 0) { if (ART === "spielen") zeigeSperre(status()); document.dispatchEvent(new CustomEvent("zeit-aenderung")); }
    }
  }

  const Zeit = {
    ART, regeln, setzeRegeln, empfehlung, status, aufgabe, inRuhe,
    extra(min) { const d = tag(); d.extraMin += min; speichere(d); },
    heute: tag,
    leisteHtml: () => leiste(status())
  };
  window.Zeit = Zeit;
  warVorher = status().spielen;
  const start = () => { pruefeSeite(); setInterval(tick, TICK * 1000); };
  if (document.body) start(); else addEventListener("DOMContentLoaded", start);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) pruefeSeite(); });
})();
