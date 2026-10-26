// Szenen-Baustein (NA-10): eine kurze Folge von Sprechblasen für Story und Tutorial.
// Regeln (KONZEPT „Regeln für die Geschichte“, Tutorial-Grundsätze):
//  - höchstens 4 Sprechblasen je Szene, jede wird automatisch vorgelesen (abschaltbar mit 🔊/🔇)
//  - ohne Lesen bedienbar: Vorlesen, Zeigehand (shared/zeige.js), „Weiter“ leuchtet nach dem Vorlesen
//  - Hilfesprache per Knopf; bei Deutschstand „keine“/„wenig“ ist die Hilfe gleich sichtbar
//  - Übersetzungen mit Prüfstatus: status: { ru: "entwurf" } erscheint nur in /dev, nie auf der Hauptseite
//  - gesehene Szenen landen in story.gesehen und story.chronik (shared/ereignisse.js), auch beim Überspringen
// Benutzung:
//   Szene.registriere("prolog", { blasen: [ { wer: "robo", text: { de: "Hallo {name}!", ru: "…", status: { ru: "entwurf" } },
//     zeige: "#knopf" | () => ({ x, y }) | { ziel, schieben: [80, 0] }, bis: (weiter) => aufraeumen } ] })
//   await Szene.spiele("prolog")       → Promise, wenn die Szene zu Ende ist ({ uebersprungen })
// Nach core.js, ereignisse.js, sprache.js, figuren.js und zeige.js laden (fehlende Teile werden übersprungen).
(function () {
  const S = window.Spielwelt; if (!S) return;
  const MAX_BLASEN = 4;
  const FIGUREN = {
    robo: { name: "Robo Pixel", e: "🤖" }, eule: { name: "Eule Ella", e: "🦉" }, fipsi: { name: "Fuchs Fipsi", e: "🦊" },
    biber: { name: "Biber Benno", e: "🦫" }, baer: { name: "Bärin Bruni", e: "🐻" }, papagei: { name: "Papagei Paula", e: "🦜" },
    tilda: { name: "Tilda", e: "🐢" }
  };
  const TEXTE = {
    weiter: { de: "Weiter", ru: "Дальше", status: { ru: "entwurf" } },
    fertig: { de: "Los geht's!", ru: "Поехали!", status: { ru: "entwurf" } },
    ueberspringen: { de: "Überspringen", ru: "Пропустить", status: { ru: "entwurf" } }
  };
  const szenen = {};

  // ---------- Texte ----------
  const ersetze = (t) => String(t || "").replace(/\{name\}/g, S.profil.name || "");
  // Hilfetext in der gewählten Hilfesprache; Entwürfe (ungeprüft) nur in /dev und /dev/test
  function hilfeText(text) {
    const h = S.hilfe(); if (!h || !text || !text[h.code]) return null;
    const st = (text.status || {})[h.code] || "geprueft";
    if (st === "entwurf" && S.umgebung === "prod") return null;
    return { text: ersetze(text[h.code]), sprache: h, entwurf: st === "entwurf" };
  }
  const hilfeSofort = () => ["keine", "wenig"].includes(S.kind().deutschstand);
  const stumm = () => !!(S.lade("szene") || {}).stumm;
  const sprecher = () => window.Sprache && window.Sprache.verfuegbar() ? window.Sprache : null;

  // ---------- Oberfläche ----------
  let el = null;
  function baue() {
    if (el) return el;
    document.body.insertAdjacentHTML("beforeend", `
    <div id="szene" class="szene" hidden role="dialog" aria-live="polite" aria-labelledby="szene-wer">
      <div class="szene-kopf" id="szene-kopf"></div>
      <div class="szene-inhalt">
        <div class="szene-wer" id="szene-wer"></div>
        <p class="szene-text" id="szene-text"></p>
        <p class="szene-hilfe" id="szene-hilfe" hidden></p>
      </div>
      <div class="szene-knoepfe">
        <button class="knopf szene-klein" id="szene-ton" aria-label="Vorlesen an oder aus"></button>
        <button class="knopf szene-klein" id="szene-hk" hidden></button>
        <button class="knopf szene-klein" id="szene-weg"></button>
        <button class="knopf haupt szene-weiter" id="szene-weiter"></button>
      </div>
      <div class="szene-punkte" id="szene-punkte" aria-hidden="true"></div>
    </div>`);
    el = document.getElementById("szene");
    document.getElementById("szene-weiter").addEventListener("click", () => { S.ton("tipp"); weiter(); });
    document.getElementById("szene-weg").addEventListener("click", () => { S.ton("tipp"); ende(true); });
    document.getElementById("szene-ton").addEventListener("click", () => {
      const d = S.lade("szene") || {}; d.stumm = !d.stumm; S.speichere("szene", d); zeigeTon();
      if (d.stumm) { const sp = sprecher(); if (sp) sp.stopp(); } else lies();
    });
    document.getElementById("szene-hk").addEventListener("click", () => {
      const h = document.getElementById("szene-hilfe"); h.hidden = !h.hidden;
      if (!h.hidden && laufend && laufend.hilfe && !stumm()) { const sp = sprecher(); if (sp) sp.sprich(laufend.hilfe.text, laufend.hilfe.sprache.tts); }
    });
    return el;
  }
  const $ = (id) => document.getElementById(id);
  function zeigeTon() { $("szene-ton").textContent = stumm() ? "🔇" : "🔊"; }

  // ---------- Ablauf ----------
  let aktiv = null;      // { def, nr, fertig, zeiger, bisWeg }
  let laufend = null;    // aktuelle Blase { wer, text, hilfe }
  let leuchtTimer = null;

  function registriere(id, def) {
    if (!def || !Array.isArray(def.blasen) || !def.blasen.length) return false;
    if (def.blasen.length > MAX_BLASEN) { console.warn(`Szene ${id}: höchstens ${MAX_BLASEN} Sprechblasen, der Rest wird weggelassen`); def.blasen = def.blasen.slice(0, MAX_BLASEN); }
    szenen[id] = Object.assign({ id }, def); return true;
  }

  function spiele(szene, opt = {}) {
    const def = typeof szene === "string" ? szenen[szene] : szene;
    if (!def || !def.blasen || !def.blasen.length) return Promise.resolve({ fehlt: true });
    if (aktiv) ende(true);
    baue();
    return new Promise((fertig) => {
      aktiv = { def: Object.assign({}, def, { blasen: def.blasen.slice(0, MAX_BLASEN) }), nr: -1, fertig, opt };
      el.hidden = false; zeigeTon();
      $("szene-weg").textContent = ersetze(TEXTE.ueberspringen.de);
      weiter();
    });
  }

  function aufraeumenBlase() {
    clearTimeout(leuchtTimer);
    if (!aktiv) return;
    if (aktiv.zeiger) { aktiv.zeiger.weg(); aktiv.zeiger = null; }
    if (typeof aktiv.bisWeg === "function") { try { aktiv.bisWeg(); } catch (e) { /* egal */ } }
    aktiv.bisWeg = null;
    $("szene-weiter").classList.remove("leuchtet");
  }

  function weiter() {
    if (!aktiv) return;
    aufraeumenBlase();
    aktiv.nr++;
    const b = aktiv.def.blasen[aktiv.nr];
    if (!b) { ende(false); return; }
    const fig = FIGUREN[b.wer] || { name: b.name || "", e: b.wer || "💬" };
    laufend = { wer: b.wer, text: ersetze(b.text.de), hilfe: hilfeText(b.text) };
    $("szene-kopf").innerHTML = window.Figuren && window.Figuren[b.wer] ? window.Figuren[b.wer]("") : `<span>${fig.e}</span>`;
    $("szene-wer").textContent = b.name || fig.name;
    $("szene-text").textContent = laufend.text;
    const hilfe = $("szene-hilfe"), hk = $("szene-hk");
    if (laufend.hilfe) {
      hilfe.textContent = laufend.hilfe.text; hilfe.lang = laufend.hilfe.sprache.code; hilfe.dir = laufend.hilfe.sprache.rtl ? "rtl" : "ltr";
      hilfe.classList.toggle("entwurf", laufend.hilfe.entwurf); hilfe.hidden = !hilfeSofort();
      hk.hidden = false; hk.textContent = laufend.hilfe.sprache.kurz; hk.lang = laufend.hilfe.sprache.code;
    } else { hilfe.hidden = true; hk.hidden = true; }
    const letzte = aktiv.nr === aktiv.def.blasen.length - 1;
    const wk = $("szene-weiter");
    wk.textContent = (letzte ? TEXTE.fertig.de : TEXTE.weiter.de) + (letzte ? "" : " ▶");
    const hw = hilfeText(letzte ? TEXTE.fertig : TEXTE.weiter); wk.title = hw ? hw.text : "";
    $("szene-punkte").innerHTML = aktiv.def.blasen.map((_, i) => `<span class="${i === aktiv.nr ? "da" : ""}"></span>`).join("");
    // Etwas passiert in der Welt, sobald die Blase erscheint (z. B. der Nebel weicht)
    if (typeof b.beim === "function") { try { b.beim(); } catch (e) { console.warn(e); } }
    // Zeigehand
    if (b.zeige && window.Zeige) {
      const z = b.zeige, istOpt = z && typeof z === "object" && !(z instanceof Element) && "ziel" in z;
      aktiv.zeiger = window.Zeige.auf(istOpt ? z.ziel : z, istOpt ? z : {});
    }
    // Liegt das Ziel der Zeigehand unter der Sprechblase (z. B. Aktionsknopf im Hochformat), rutscht die Blase nach oben
    el.classList.remove("oben");
    const ueberdeckt = () => {
      const r = window.Zeige.rechteck(aktiv && aktiv.zeiger ? aktiv.zeiger.ziel : null), k = el.getBoundingClientRect();
      if (r && r.x < k.right && r.x + r.w > k.left && r.y < k.bottom && r.y + r.h > k.top - 30) el.classList.add("oben");
    };
    if (aktiv.zeiger && window.Zeige) { ueberdeckt(); requestAnimationFrame(() => { if (aktiv) ueberdeckt(); }); }
    // Warten auf eine Handlung des Kindes (z. B. Joystick schieben): „Weiter“ erst danach
    wk.hidden = !!b.bis;
    if (typeof b.bis === "function") {
      const nr = aktiv.nr;
      aktiv.bisWeg = b.bis(() => { if (aktiv && aktiv.nr === nr) weiter(); });
    }
    lies();
  }

  // Vorlesen; danach leuchtet „Weiter“ (auch ohne Ton nach kurzer Zeit)
  function lies() {
    if (!aktiv || !laufend) return;
    const nr = aktiv.nr;
    const leuchte = () => { if (aktiv && aktiv.nr === nr) $("szene-weiter").classList.add("leuchtet"); };
    clearTimeout(leuchtTimer);
    const sp = sprecher();
    if (stumm() || !sp) { leuchtTimer = setTimeout(leuchte, 1500); return; }
    const hilfeDanach = laufend.hilfe && hilfeSofort() ? laufend.hilfe : null;
    sp.sprich(laufend.text, "de-DE", () => {
      if (hilfeDanach && aktiv && aktiv.nr === nr) sp.sprich(hilfeDanach.text, hilfeDanach.sprache.tts, leuchte); else leuchte();
    });
    leuchtTimer = setTimeout(leuchte, 9000);   // falls die Stimme hängt
  }

  function ende(uebersprungen) {
    if (!aktiv) return;
    aufraeumenBlase();
    const a = aktiv; aktiv = null; laufend = null;
    el.hidden = true;
    const sp = sprecher(); if (sp) sp.stopp();
    if (a.def.chronik !== false && a.opt.chronik !== false && a.def.id && window.Story) window.Story.merkeSzene(a.def.id);
    a.fertig({ uebersprungen: !!uebersprungen });
  }

  function aktuell() {
    if (!aktiv || !laufend) return null;
    return { id: aktiv.def.id || null, nr: aktiv.nr, anzahl: aktiv.def.blasen.length, wer: laufend.wer, text: laufend.text,
      hilfe: laufend.hilfe ? laufend.hilfe.text : null, hilfeSichtbar: !$("szene-hilfe").hidden, zeigt: !!aktiv.zeiger, wartet: $("szene-weiter").hidden };
  }

  // Probeszene zum Ausprobieren (?szene=probe auf Startseite und Insel); landet nicht in der Chronik
  registriere("probe", { chronik: false, blasen: [
    { wer: "robo", text: { de: "Hallo {name}! Ich bin Robo Pixel. Ich zeige dir, wie Szenen funktionieren.", ru: "Привет, {name}! Я Робо Пиксель. Я покажу тебе, как работают сцены.", status: { ru: "entwurf" } } },
    { wer: "robo", text: { de: "Ich lese alles vor. Siehst du die Hand? Sie zeigt dir, wohin du tippen kannst.", ru: "Я всё читаю вслух. Видишь руку? Она показывает, куда нажать.", status: { ru: "entwurf" } },
      zeige: () => window.Insel ? window.Insel.ort("haus")() : [...document.querySelectorAll(".kachel, .knopf")].find(x => !x.closest("#szene") && x.getClientRects().length) },
    { wer: "eule", text: { de: "Und wenn du fertig bist, tippst du auf den leuchtenden Knopf.", ru: "А когда закончишь, нажми на светящуюся кнопку.", status: { ru: "entwurf" } } }
  ] });

  // Kopie einer registrierten Szene (z. B. um Zeigehand und Bedingungen zu ergänzen)
  const def = (id) => szenen[id] ? Object.assign({}, szenen[id], { blasen: szenen[id].blasen.map(x => Object.assign({}, x)) }) : null;
  const Szene = { MAX_BLASEN, FIGUREN, registriere, def, spiele, weiter, aktuell, abbrechen: () => ende(true), hilfeText, get laeuft() { return !!aktiv; } };
  window.Szene = Szene;
  window.__szene = { spiele, aktuell, weiter, abbrechen: () => ende(true), szenen: () => Object.keys(szenen) };

  // ?szene=<id> spielt eine registrierte Szene ab (zum Ausprobieren und für Tests)
  const q = new URLSearchParams(location.search).get("szene");
  if (q) addEventListener("load", () => setTimeout(() => spiele(q), 600));
})();
