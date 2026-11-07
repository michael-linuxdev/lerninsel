// Erprobungsmodus (Paket K, 12.11.2026): Erwachsene spielen die App selbst durch, beobachten ein Kind oder prüfen Inhalte – als Spieler/in,
// Lehrkraft (Fächer/Klassen wählbar) und/oder Muttersprachler/in (Russisch, Sorbisch); eine Person kann mehrere Rollen zugleich haben.
// Eingeschaltet wird er im Elternbereich (Reiter „🔍 Erprobung & Prüfen“). Nur dann lädt core.js diese Datei – ohne Modus kostet er nichts.
// Aufgezeichnet wird nur auf diesem Gerät (eigener localStorage-Schlüssel <vorsilbe>erprobung.log, nicht im Spielstand, Ringspeicher):
//   seite    Seitenwechsel und sichtbare Verweildauer
//   aufgabe  Inhalt-ID (z. B. mathe:k2plus, werkstatt:w-nomen, sachkunde:wasser), Schritt, gegebene Antwort, richtig, Zeit bis zur Antwort, Hilfe/🔊/RU
//   runde    fertig gespielte Runde · abbruch  Runde mitten drin verlassen · szene  Szene (übersprungen?)
//   technik  Seitenfehler/voller Speicher (aus dem Protokoll in core.js) · meldung  „✍️ Melden“ · pruefung  Prüfleiste und Prüflisten
// Nie aufgezeichnet: eigene Texte und Aufnahmen des Kindes, Bilder, Namen (Namen der Kinder werden in allen Texten zu {name}).
// Export: Erprobung.datei() → { format: "lerninsel-erprobung", version: 1, … } (Elternbereich: „💾 Erprobung speichern“),
// Auswertung im Repo: node quellen/erprobung-auswerten.js <dateien…> [--pruefstand]. Prüfsumme der Inhalte wie quellen/pruefstand.js
// (sha256 über JSON mit Funktionen als Quelltext, 12 Zeichen) – geänderter Inhalt = Prüfung unwirksam.
(function () {
  if (window.Erprobung && window.Erprobung._echt) return;
  const cfg = window.SPIELWELT_CONFIG || {};
  const UMG = cfg.umgebung || (cfg.test ? "test" : "prod");
  const PRE = UMG === "prod" ? "spielwelt." : "spielwelt." + UMG + ".";
  const KEY_E = PRE + "erprobung", KEY_L = PRE + "erprobung.log";
  const GRENZE = window.__erprobungGrenze || 900000, WARN = 0.75;   // Zeichen im Ringspeicher (≈ 1 MB), ab 75 % „bitte speichern“
  const ROLLEN = { spieler: "Spieler/in", lehrkraft: "Lehrkraft", ru: "Muttersprachler/in Russisch", hsb: "Muttersprachler/in Sorbisch" };
  const FAECHER = { mathe: "Mathe", deutsch: "Deutsch", sachkunde: "Sachunterricht", englisch: "Englisch", kunst: "Kunst", musik: "Musik", werken: "Werken", sport: "Sport", ethik: "Ethik", religion: "Religion", vorschule: "Vorschule", sorbisch: "Sorbisch" };
  const KLASSEN = { vs: "Vorschule", 1: "Kl. 1", 2: "Kl. 2", 3: "Kl. 3", 4: "Kl. 4", 5: "Übergang 5" };
  const KATEGORIEN = [
    ["fehler", "🐞", { de: "Fehler", ru: "Ошибка" }], ["unklar", "❓", { de: "Verstehe ich nicht", ru: "Не понимаю" }],
    ["schwer", "🧗", { de: "Zu schwer", ru: "Слишком трудно" }], ["leicht", "🪶", { de: "Zu leicht", ru: "Слишком легко" }],
    ["schoen", "💖", { de: "Schön", ru: "Нравится" }], ["idee", "💡", { de: "Idee", ru: "Идея" }]
  ];
  // Kindsichtbare Texte (Melden-Knopf) mit russischem Entwurf (status entwurf)
  const T = {
    melden: { de: "Melden", ru: "Сообщить", status: { ru: "entwurf" } },
    titel: { de: "Was möchtest du sagen?", ru: "Что ты хочешь сказать?", status: { ru: "entwurf" } },
    text: { de: "Was genau? Du musst nichts schreiben.", ru: "Что именно? Можно ничего не писать.", status: { ru: "entwurf" } },
    fertig: { de: "Fertig", ru: "Готово", status: { ru: "entwurf" } },
    zurueck: { de: "Zurück", ru: "Назад", status: { ru: "entwurf" } },
    danke: { de: "Danke! Das ist jetzt gemerkt.", ru: "Спасибо! Это сохранено.", status: { ru: "entwurf" } },
    waehle: { de: "Tippe zuerst an, was passt.", ru: "Сначала выбери, что подходит.", status: { ru: "entwurf" } }
  };

  // ---------- Speicher ----------
  const lies = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
  const schreib = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
  const sauber = (t, max = 60) => String(t == null ? "" : t).replace(/[<>&"'`\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function einstellungen() {
    const e = lies(KEY_E, {}) || {};
    return Object.assign({ an: false, kuerzel: "", rollen: [], faecher: [], klassen: [], kindSpielt: false, verworfen: 0 }, e);
  }
  function setze(neu) {
    const e = Object.assign(einstellungen(), neu);
    e.kuerzel = sauber(e.kuerzel, 12);
    e.rollen = (e.rollen || []).filter(r => ROLLEN[r]);
    e.faecher = (e.faecher || []).filter(f => FAECHER[f]); e.klassen = (e.klassen || []).filter(k => KLASSEN[k]);
    if (e.an && !e.seit) e.seit = new Date().toISOString();
    schreib(KEY_E, e); return e;
  }
  let log = null, speichernT = null;
  const liste = () => { if (!log) { log = lies(KEY_L, []); if (!Array.isArray(log)) log = []; } return log; };
  const WEGWERFBAR = ["seite", "aufgabe", "runde", "szene", "technik"];
  function sichern() {
    clearTimeout(speichernT); speichernT = null;
    const l = liste(); let s = JSON.stringify(l);
    if (s.length > GRENZE) {   // Ringspeicher: älteste Seiten/Aufgaben zuerst verwerfen, Meldungen und Prüfungen so lange wie möglich behalten
      const e = einstellungen(); let weg = 0;
      while (s.length > GRENZE && l.length) {
        const n = Math.max(1, Math.ceil(l.length / 10)); let k = 0;
        for (let i = 0; i < l.length && k < n;) { if (WEGWERFBAR.includes(l[i].art)) { l.splice(i, 1); k++; } else i++; }
        if (!k) l.splice(0, n);
        weg += Math.max(k, 1); s = JSON.stringify(l);
      }
      e.verworfen = (e.verworfen || 0) + weg; schreib(KEY_E, e);
    }
    try { localStorage.setItem(KEY_L, s); } catch (er) { /* voll: beim nächsten Mal kleiner */ }
    return s.length;
  }
  const spaeter = () => { if (!speichernT) speichernT = setTimeout(sichern, 400); };
  // Namen der Kinder in allen Texten ersetzen (auch in Inhalten, die den Namen einsetzen)
  function namen() {
    try { if (window.Spielwelt && Spielwelt.kinder) return Spielwelt.kinder().map(k => k.name).filter(n => n && n.length > 1); } catch (e) { /* weiter */ }
    try { return ((lies(PRE + "haushalt.v1", {}) || {}).kinder || []).map(k => k.name).filter(n => n && n.length > 1); } catch (e) { return []; }
  }
  function ohneNamen(t) {
    let s = String(t == null ? "" : t);
    namen().forEach(n => { s = s.split(n).join("{name}"); });
    return s;
  }
  const seite = () => (location.pathname.replace(/index\.html$/, "").replace(/^.*?\/dev\/(test\/)?/, "/").split("/").filter(Boolean).join("/") || "start") +
    (/[?&](fach|thema|weg|lektion)=/.test(location.search) ? "?" + location.search.slice(1).split("&").filter(x => /^(fach|thema|weg|lektion)=/.test(x)).join("&") : "");
  const klasseKind = () => { try { return window.Spielwelt && Spielwelt.stufe ? (Spielwelt.stufe() || {}).code || "" : ""; } catch (e) { return ""; } };
  function merke(e) {
    const st = einstellungen();
    if (!st.an && !e.immer) return null;
    delete e.immer;
    const x = Object.assign({ t: Date.now(), art: "?", seite: seite() }, e);
    ["text", "antwort", "korrektur", "ruText", "notiz"].forEach(k => { if (x[k] != null) x[k] = ohneNamen(x[k]); });
    liste().push(x); spaeter();
    if (!warnGezeigt && JSON.stringify(log).length > GRENZE * WARN) {   // einmal je Seite: bitte speichern
      warnGezeigt = true;
      if (window.Spielwelt && Spielwelt.meldung && !/spiele\/eltern/.test(location.pathname)) Spielwelt.meldung("🔍 Erprobung: Der Speicher ist fast voll – bitte im Elternbereich „Erprobung speichern“.");
    }
    return x;
  }
  let warnGezeigt = false;

  // ---------- Prüfsumme (wie quellen/pruefstand.js) ----------
  const K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
  function sha256(str) {
    const b = new TextEncoder().encode(str), l = b.length, n = ((l + 9 + 63) >> 6) << 6, m = new Uint8Array(n);
    m.set(b); m[l] = 0x80;
    const dv = new DataView(m.buffer), bits = l * 8;
    dv.setUint32(n - 4, bits >>> 0); dv.setUint32(n - 8, Math.floor(bits / 4294967296));
    const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19], w = new Uint32Array(64);
    const r = (x, k) => (x >>> k) | (x << (32 - k));
    for (let i = 0; i < n; i += 64) {
      for (let t = 0; t < 16; t++) w[t] = dv.getUint32(i + t * 4);
      for (let t = 16; t < 64; t++) { const x = w[t - 15], y = w[t - 2]; w[t] = (w[t - 16] + (r(x, 7) ^ r(x, 18) ^ (x >>> 3)) + w[t - 7] + (r(y, 17) ^ r(y, 19) ^ (y >>> 10))) | 0; }
      let [a, bb, c, d, e, f, g, h] = H;
      for (let t = 0; t < 64; t++) {
        const t1 = (h + (r(e, 6) ^ r(e, 11) ^ r(e, 25)) + ((e & f) ^ (~e & g)) + K[t] + w[t]) | 0;
        const t2 = ((r(a, 2) ^ r(a, 13) ^ r(a, 22)) + ((a & bb) ^ (a & c) ^ (bb & c))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = bb; bb = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + bb) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0; H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    return H.map(x => (x >>> 0).toString(16).padStart(8, "0")).join("");
  }
  const textVon = (x) => JSON.stringify(x, (k, v) => typeof v === "function" ? v.toString() : v);
  const hashCache = new WeakMap();
  function pruefsumme(x) {
    if (x == null) return "";
    if (typeof x !== "object") return sha256(String(x)).slice(0, 12);
    if (!hashCache.has(x)) { try { hashCache.set(x, sha256(textVon(x)).slice(0, 12)); } catch (e) { return ""; } }
    return hashCache.get(x);
  }

  // ---------- aktuelle Aufgabe, Runden, Hilfe ----------
  let jetzt = null, runde = null;
  function zeige(o) {
    o = o || {};
    jetzt = { inhalt: sauber(o.inhalt, 80), schritt: o.schritt == null ? null : sauber(o.schritt, 40), text: sauber(ohneNamen(String(o.text || "").replace(/<[^>]*>/g, " ")), 120),
      fach: o.fach || "", klasse: String(o.klasse || klasseKind() || ""), h: o.daten ? pruefsumme(o.daten) : (o.h || ""), ab: Date.now(), hilfe: new Set(),
      ru: o.ru, hsb: !!o.hsb, el: o.el || null, bereich: o.bereich || null };
    if (o.el && einstellungen().an) leiste(o.el);
    if (document.getElementById("erp-melden")) platziereBald();
  }
  function aufgabe(o) {
    o = o || {};
    const a = jetzt || {};
    const e = merke({ art: "aufgabe", inhalt: sauber(o.inhalt || a.inhalt, 80), schritt: o.schritt != null ? sauber(o.schritt, 40) : a.schritt, text: o.text != null ? sauber(o.text, 120) : a.text,
      antwort: o.antwort == null ? undefined : sauber(o.antwort, 60), richtig: !!o.richtig, versuch: o.versuch || 1, ms: a.ab ? Date.now() - a.ab : null,
      hilfe: a.hilfe && a.hilfe.size ? [...a.hilfe] : undefined, fach: a.fach || undefined, klasse: a.klasse || undefined, h: a.h || undefined });
    if (runde && (o.versuch || 1) === 1) runde.beantwortet++;
    if (o.richtig && a.ab) a.ab = Date.now();
    return e;
  }
  function rundeStart(inhalt, n) {
    if (runde) abbruch();
    runde = { inhalt: sauber(inhalt, 80), n: n || 0, beantwortet: 0, ab: Date.now() };
  }
  function rundeFertig(o) {
    if (!runde) return;
    merke(Object.assign({ art: "runde", inhalt: runde.inhalt, n: runde.n, beantwortet: runde.beantwortet, ms: Date.now() - runde.ab }, o || {}));
    runde = null;
  }
  function abbruch() {
    if (!runde) return;
    merke({ art: "abbruch", inhalt: runde.inhalt, n: runde.n, beantwortet: runde.beantwortet, schritt: jetzt ? jetzt.schritt : null, ms: Date.now() - runde.ab });
    runde = null;
  }
  function hilfe(art) { if (jetzt) jetzt.hilfe.add(art); }
  function szene(id, uebersprungen, ms) { merke({ art: "szene", inhalt: "szene:" + sauber(id, 40), uebersprungen: !!uebersprungen, ms: ms || undefined }); }
  function technik(art, text) { merke({ art: "technik", typ: sauber(art, 20), text: sauber(text, 200) }); }
  function pruefung(o) {
    return merke({ art: "pruefung", rolle: o.rolle, urteil: o.urteil, inhalt: sauber(o.inhalt, 80), schritt: o.schritt == null ? null : sauber(o.schritt, 40), text: sauber(o.text, 200),
      korrektur: o.korrektur ? sauber(o.korrektur, 500) : undefined, h: o.h || undefined, fach: o.fach || undefined, klasse: o.klasse || undefined,
      ruText: o.ruText ? sauber(o.ruText, 300) : undefined, de: o.de ? sauber(o.de, 200) : undefined, kuerzel: einstellungen().kuerzel || undefined, immer: !!o.immer });
  }

  // ---------- Prüfleiste unter der Aufgabe ----------
  const lehrkraftPasst = (st, a) => st.rollen.includes("lehrkraft") && (!st.faecher.length || !a.fach || st.faecher.includes(a.fach)) && (!st.klassen.length || !a.klasse || st.klassen.includes(String(a.klasse)));
  function ruTextJetzt(a) {
    if (typeof a.ru === "string" && a.ru) return ohneNamen(a.ru);
    const wo = (a.bereich && document.querySelector(a.bereich)) || (a.el && (a.el.closest("[id$='-ansicht'], section, main") || a.el.parentElement)) || document.body;
    return [...wo.querySelectorAll('.ru, .hilfe-ru, [lang="ru"], .ru-text')].filter(x => !x.closest(".erp-leiste, .erp-dialog") && !x.matches("button, input, textarea"))
      .map(x => x.textContent.trim()).filter(Boolean).filter((x, i, l) => l.indexOf(x) === i).join(" | ");
  }
  let leisteEl = null;
  function leiste(el) {
    const st = einstellungen(), a = jetzt;
    const fach = lehrkraftPasst(st, a), ru = st.rollen.includes("ru"), hsb = st.rollen.includes("hsb") && a.hsb;
    if (!fach && !ru && !hsb) { if (leisteEl) leisteEl.remove(); return; }
    if (!leisteEl) {
      leisteEl = document.createElement("div"); leisteEl.className = "erp-leiste"; leisteEl.setAttribute("role", "group"); leisteEl.setAttribute("aria-label", "Prüfen");
      leisteEl.dataset.emoji = "aus";
      leisteEl.addEventListener("click", klickLeiste);
    }
    const zeile = (rolle, name, mitUnklar, besser) => `<div class="erp-zeile" data-rolle="${rolle}"${rolle === "ru" ? " hidden" : ""}><span class="erp-name">${name}</span>` +
      `<button type="button" data-u="ok" aria-label="${name}: passt">👍 passt</button><button type="button" data-u="aendern" aria-label="${name}: ${besser}">✏️ ${besser}</button>` +
      (mitUnklar ? `<button type="button" data-u="unklar" aria-label="${name}: unklar">❓ unklar</button>` : "") + `<span class="erp-ok" aria-live="polite"></span></div>`;
    leisteEl.innerHTML = `<div class="erp-kopf">🔍 ${esc(a.inhalt || "Aufgabe")}${a.schritt != null ? ` · ${esc(a.schritt)}` : ""}</div>` +
      (fach ? zeile("fach", "Fachlich", true, "ändern") : "") + (ru ? zeile("ru", "Russisch", false, "besser so") : "") + (hsb ? zeile("hsb", "Sorbisch", false, "besser so") : "") +
      `<div class="erp-korr" hidden><label>Vorschlag oder Frage <textarea maxlength="500" rows="2"></textarea></label><button type="button" class="erp-speichern">Speichern</button></div>`;
    if (el.nextSibling !== leisteEl) el.after(leisteEl);
    leisteEl.hidden = false;
    // Russisch nur, wenn die Aufgabe einen russischen Text hat (auch später eingefügte Hilfezeilen)
    if (ru) [0, 500, 1500].forEach(ms => setTimeout(() => { const z = leisteEl.querySelector('[data-rolle="ru"]'); if (z && a === jetzt && ruTextJetzt(a)) z.hidden = false; }, ms));
  }
  let offen = null;
  function klickLeiste(ev) {
    const b = ev.target.closest("button"); if (!b || !jetzt) return;
    const a = jetzt;
    if (b.classList.contains("erp-speichern")) {
      const t = leisteEl.querySelector("textarea").value;
      if (offen) { offen.e.korrektur = sauber(ohneNamen(t), 500); spaeter(); sichern(); fertig(offen.zeile, "✓ gespeichert"); }
      leisteEl.querySelector(".erp-korr").hidden = true; offen = null; return;
    }
    const zeile = b.closest(".erp-zeile"); if (!zeile) return;
    const rolle = zeile.dataset.rolle, urteil = b.dataset.u;
    const o = { rolle, urteil, inhalt: a.inhalt, schritt: a.schritt, text: a.text, fach: a.fach, klasse: a.klasse, h: a.h };
    if (rolle === "ru") { o.ruText = ruTextJetzt(a); o.h = pruefsumme(o.ruText); o.hInhalt = a.h; }
    if (rolle === "hsb" && typeof a.hsb === "string") o.ruText = a.hsb;
    const e = pruefung(o); if (e && o.hInhalt) e.hInhalt = o.hInhalt;
    zeile.querySelectorAll("button").forEach(x => x.classList.toggle("an", x === b));
    if (urteil === "ok") { fertig(zeile, "✓ gespeichert"); leisteEl.querySelector(".erp-korr").hidden = true; offen = null; sichern(); return; }
    offen = { e, zeile }; const k = leisteEl.querySelector(".erp-korr"); k.hidden = false;
    const ta = k.querySelector("textarea"); ta.value = ""; ta.placeholder = rolle === "fach" ? (urteil === "unklar" ? "Was ist unklar? (freiwillig)" : "Wie wäre es richtig?") : "Bessere Fassung";
    ta.lang = rolle === "fach" ? "de" : rolle; ta.focus();
    fertig(zeile, "✓ gemerkt – Vorschlag unten");
  }
  const fertig = (zeile, t) => { const s = zeile.querySelector(".erp-ok"); if (s) s.textContent = t; };

  // ---------- Melden ----------
  const hilfeRu = () => { try { return !!(window.Spielwelt && Spielwelt.hilfe && (Spielwelt.hilfe() || {}).code === "ru"); } catch (e) { return false; } };
  const zwei = (x, mitRu) => `<span class="erp-de">${x.de}</span>` + (mitRu ? `<small class="ru" lang="ru">${x.ru}</small>` : "");
  function meldeKnopf() {
    if (document.getElementById("erp-melden") || !document.body) return;
    const ru = hilfeRu();
    const b = document.createElement("button"); b.type = "button"; b.id = "erp-melden"; b.className = "erp-melden"; b.dataset.emoji = "aus";
    b.setAttribute("aria-label", "Melden"); b.innerHTML = `<span aria-hidden="true">✍️</span>` + zwei(T.melden, ru);
    b.addEventListener("click", () => meldeDialog());
    document.body.appendChild(b);
    platziere();
    addEventListener("resize", () => platziereBald());
    document.addEventListener("click", () => platziereBald(), true);
    setTimeout(platziere, 800);
  }
  // Der Knopf darf nichts verdecken, was das Kind braucht: am linken oder rechten Rand die Höhe suchen, an der kein Knopf, Link,
  // Eingabefeld oder keine Taste liegt (Canvas zählt nicht – auf der Insel ist alles Canvas). Neu gesucht bei jeder Aufgabe, nach Klicks, beim Drehen.
  let platzT = null;
  const platziereBald = () => { clearTimeout(platzT); platzT = setTimeout(platziere, 350); };
  function platziere() {
    const b = document.getElementById("erp-melden"); if (!b || b.hidden) return;
    const W = b.offsetWidth || 48, H = b.offsetHeight || 56, vw = innerWidth, vh = innerHeight;
    const ziele = [...document.querySelectorAll("button, a[href], input, select, textarea, [role=button], [tabindex]:not([tabindex='-1']), .taste, .option, label")]
      .filter(x => x !== b && !b.contains(x) && !x.closest(".erp-leiste, #erp-dialog") && x.offsetParent !== null)
      .map(x => x.getBoundingClientRect()).filter(r => r.width && r.height && r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw);
    const treffer = (x, y) => ziele.filter(r => r.left < x + W + 4 && r.right > x - 4 && r.top < y + H + 4 && r.bottom > y - 4).length;
    let best = null;
    for (const seite of ["links", "rechts"]) {
      const x = seite === "links" ? 0 : vw - W;
      for (let i = 0; i <= 40; i++) {   // von der Mitte aus abwechselnd nach oben und unten
        const d = Math.ceil(i / 2) * 14 * (i % 2 ? -1 : 1), y = Math.round(vh / 2 - H / 2 + d);
        if (y < 8 || y + H > vh - 8) continue;
        const n = treffer(x, y);
        if (!best || n < best.n) best = { seite, y, n };
        if (n === 0) break;
      }
      if (best && best.n === 0) break;
    }
    if (!best) return;
    b.classList.toggle("rechts", best.seite === "rechts");
    b.style.top = best.y + "px"; b.style.transform = "none";
    b.dataset.frei = best.n === 0 ? "ja" : "nein";
  }
  function meldeDialog() {
    if (document.getElementById("erp-dialog")) return;
    const ru = hilfeRu(), d = document.createElement("div");
    d.id = "erp-dialog"; d.className = "erp-dialog"; d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true"); d.setAttribute("aria-labelledby", "erp-titel");
    d.innerHTML = `<div class="erp-karte"><h2 id="erp-titel">${zwei(T.titel, ru)}</h2>
      <div class="erp-kats">${KATEGORIEN.map(([id, e, t]) => `<button type="button" data-kat="${id}" aria-pressed="false" aria-label="${t.de}"><span class="erp-e">${e}</span>${zwei(t, ru)}</button>`).join("")}</div>
      <label class="erp-l" for="erp-text">${zwei(T.text, ru)}</label><textarea id="erp-text" maxlength="500" rows="3"></textarea>
      <p class="erp-hinweis" aria-live="polite"></p>
      <div class="erp-knoepfe"><button type="button" class="erp-zu">${zwei(T.zurueck, ru)}</button><button type="button" class="erp-los">${zwei(T.fertig, ru)}</button></div></div>`;
    document.body.appendChild(d);
    const knopf = document.getElementById("erp-melden"); if (knopf) knopf.hidden = true;
    let kat = "";
    const zu = () => { d.remove(); if (knopf) { knopf.hidden = false; knopf.focus(); } };
    d.addEventListener("click", (ev) => {
      const k = ev.target.closest("[data-kat]");
      if (k) { kat = k.dataset.kat; d.querySelectorAll("[data-kat]").forEach(x => { x.classList.toggle("an", x === k); x.setAttribute("aria-pressed", x === k); }); return; }
      if (ev.target.closest(".erp-zu") || ev.target === d) return zu();
      if (ev.target.closest(".erp-los")) {
        if (!kat) { d.querySelector(".erp-hinweis").innerHTML = zwei(T.waehle, ru); return; }
        const a = jetzt || {};
        merke({ art: "meldung", kat, text: sauber(ohneNamen(d.querySelector("#erp-text").value), 500), inhalt: a.inhalt || undefined, schritt: a.schritt != null ? a.schritt : undefined,
          aufgabe: a.text || undefined, klasse: klasseKind() || undefined, h: a.h || undefined });
        sichern(); zu();
        if (window.Spielwelt && Spielwelt.meldung) Spielwelt.meldung("✍️ " + T.danke.de + (ru ? " · " + T.danke.ru : ""));
      }
    });
    d.addEventListener("keydown", (ev) => { if (ev.key === "Escape") zu(); });
    d.querySelector("[data-kat]").focus();
  }
  function stil() {
    if (document.getElementById("erp-stil")) return;
    const s = document.createElement("style"); s.id = "erp-stil";
    s.textContent = `
.erp-melden{position:fixed;left:0;top:50%;transform:translateY(-50%);z-index:95;display:flex;flex-direction:column;align-items:center;gap:2px;min-width:44px;min-height:56px;padding:6px 4px;border:3px solid #3B1F63;border-left:0;border-radius:0 16px 16px 0;background:#FFF6D6;color:#3B1F63;font:600 12px Fredoka,system-ui,sans-serif;box-shadow:0 3px 0 #3B1F63;cursor:pointer;opacity:.92}
.erp-melden>span[aria-hidden]{font-size:20px;line-height:1}.erp-melden small.ru{font-size:10px}
.erp-melden[hidden]{display:none}
.erp-melden.rechts{left:auto;right:0;border-left:3px solid #3B1F63;border-right:0;border-radius:16px 0 0 16px}
@media (max-width:640px){.erp-melden .erp-de,.erp-melden small.ru{display:none}.erp-melden{min-height:48px;padding:6px 8px}}
.erp-dialog{position:fixed;inset:0;z-index:120;background:rgba(30,16,52,.45);display:flex;align-items:center;justify-content:center;padding:16px}
.erp-karte{background:#fff;border:3px solid #3B1F63;border-radius:22px;padding:16px;max-width:520px;width:100%;max-height:calc(100vh - 32px);overflow:auto;color:#3B1F63;font-family:Fredoka,system-ui,sans-serif}
.erp-karte h2{margin:0 0 10px;font-size:1.3rem}.erp-karte small.ru,.erp-karte .ru{display:block;font-size:.85em;opacity:.85;font-weight:500}
.erp-kats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px}
.erp-kats button,.erp-knoepfe button{min-height:52px;border:3px solid #3B1F63;border-radius:16px;background:#F6F3FB;color:#3B1F63;font:inherit;font-weight:600;padding:6px;cursor:pointer;box-shadow:0 3px 0 #3B1F63}
.erp-kats button.an{background:#FFDD55}.erp-e{display:block;font-size:1.5rem}
.erp-l{display:block;font-weight:600;margin:4px 0}.erp-karte textarea,.erp-leiste textarea{width:100%;box-sizing:border-box;font:inherit;font-size:1rem;border:3px solid #D9D2EC;border-radius:12px;padding:8px;-webkit-user-select:text;user-select:text}
.erp-hinweis{min-height:1.2em;margin:6px 0;color:#A3322A;font-weight:600}
.erp-knoepfe{display:flex;gap:10px;justify-content:flex-end}.erp-knoepfe .erp-los{background:#2FA37C;color:#fff}
@media (max-width:520px){.erp-kats{grid-template-columns:repeat(2,1fr)}}
.erp-leiste{margin:10px auto 0;max-width:760px;width:100%;box-sizing:border-box;background:#EEF6FF;border:2px dashed #3B1F63;border-radius:14px;padding:6px 10px;font:500 14px Fredoka,system-ui,sans-serif;color:#3B1F63;text-align:left}
.erp-leiste[hidden]{display:none}.erp-kopf{font-size:12px;opacity:.8;margin-bottom:4px;overflow-wrap:anywhere}
.erp-zeile{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:4px 0}.erp-zeile[hidden]{display:none}.erp-name{font-weight:700;min-width:70px}
.erp-zeile button,.erp-korr button{min-height:40px;min-width:44px;padding:0 10px;border:2px solid #3B1F63;border-radius:999px;background:#fff;color:#3B1F63;font:inherit;font-weight:600;cursor:pointer}
.erp-zeile button.an{background:#3B1F63;color:#fff}.erp-ok{font-size:12px;color:#1F6E52}
.erp-korr{display:grid;gap:6px;margin-top:4px}.erp-korr label{display:grid;gap:4px;font-weight:600}.erp-korr[hidden]{display:none}`;
    document.head.appendChild(s);
  }

  // ---------- Seiten und Verweildauer ----------
  let seiteE = null, sichtbarSeit = document.visibilityState === "visible" ? Date.now() : 0, sichtbar = 0;
  function seiteStand(ende) {
    if (sichtbarSeit) { sichtbar += Date.now() - sichtbarSeit; sichtbarSeit = ende ? 0 : Date.now(); }
    if (!einstellungen().an) return;
    if (!seiteE) seiteE = merke({ art: "seite", ms: sichtbar, von: sauber(document.referrer ? new URL(document.referrer, location.href).pathname.split("/").filter(Boolean).slice(-2).join("/") : "", 60) || undefined });
    else { seiteE.ms = sichtbar; }
  }
  function start() {
    stil();
    const st = einstellungen();
    if (!st.an) return;
    if (!/spiele\/eltern\/russisch-pruefen|spiele\/sorbisch\/pruefen/.test(location.pathname)) meldeKnopf();
    // Hilfe/🔊/RU an der aktuellen Aufgabe merken (Klicks auf Vorlese-Knöpfe, „RU“, Erklären)
    document.addEventListener("click", (ev) => {
      const t = ev.target.closest && ev.target.closest("button, [role=button], a"); if (!t || t.closest(".erp-leiste, .erp-dialog, #erp-melden")) return;
      const txt = (t.textContent || "") + " " + (t.getAttribute("aria-label") || "");
      if (t.matches(".ru-auf, #ru-knopf, .ru-knopf, .ru-hoerbar") || /^\s*(RU|UK|AR|TR|PL|FA)\s*$/.test(t.textContent || "")) hilfe("ru");
      else if (t.matches("[data-vorlesen], .vorlesen-knopf, #nochmal-hoeren, #hoeren, .hoeren-knopf, #tafel-hoer") || /🔊|🔈|🔉|Vorlesen|Anhören|hören/.test(txt)) hilfe("hoeren");
      else if (t.matches("#erklaer-knopf, #nochmal-erklaeren, .tipp-knopf, #tipp") || /💡|Erklär|Tipp/.test(txt)) hilfe("erklaeren");
    }, true);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") { seiteStand(true); sichern(); } else { sichtbarSeit = Date.now(); }
    });
    addEventListener("pagehide", () => { seiteStand(true); abbruch(); sichern(); });
  }

  // ---------- Export ----------
  const geraet = () => ({
    ua: sauber(navigator.userAgent, 200), bildschirm: `${screen.width}×${screen.height}`, fenster: `${innerWidth}×${innerHeight}`, dpr: devicePixelRatio || 1,
    touch: navigator.maxTouchPoints || 0, sprache: navigator.language || "", homeBildschirm: !!(window.matchMedia && matchMedia("(display-mode: standalone)").matches) || !!navigator.standalone
  });
  function datei(cache) {
    sichern();
    const st = einstellungen(), l = liste().slice();
    let kind = null; try { if (window.Spielwelt && Spielwelt.kind) { const k = Spielwelt.kind() || {}; kind = { stufe: klasseKind(), land: k.land || "", hilfesprache: k.hilfesprache || "" }; } } catch (e) { kind = null; }
    let proto = []; try { proto = window.Spielwelt && Spielwelt.protokoll ? Spielwelt.protokoll().map(x => ({ z: x.z, art: x.a, text: ohneNamen(x.t), seite: x.s, n: x.n })) : []; } catch (e) { proto = []; }
    return { format: "lerninsel-erprobung", version: 1, kuerzel: st.kuerzel || "ohne", rollen: st.rollen, faecher: st.faecher, klassen: st.klassen, kindSpielt: !!st.kindSpielt,
      geraet: geraet(), app: { version: cfg.version || "", umgebung: UMG, cache: cache || "" }, kind, erstellt: new Date().toISOString(),
      von: l.length ? new Date(l[0].t).toISOString() : null, bis: l.length ? new Date(l[l.length - 1].t).toISOString() : null, verworfen: st.verworfen || 0, protokoll: proto, eintraege: l };
  }
  const tag = () => { const d = new Date(window.__jetzt || Date.now()); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const dateiname = () => `lerninsel-erprobung-${(einstellungen().kuerzel || "ohne").replace(/[^A-Za-z0-9ÄÖÜäöüß_-]/g, "") || "ohne"}-${tag()}.json`;
  function vorschau() {
    const l = liste(), n = {};
    l.forEach(e => { n[e.art] = (n[e.art] || 0) + 1; });
    const bsp = {}; l.slice().reverse().forEach(e => { (bsp[e.art] = bsp[e.art] || []).length < 3 && bsp[e.art].push(e); });
    return { anzahl: l.length, je: n, beispiele: bsp, zeichen: JSON.stringify(l).length, grenze: GRENZE, voll: JSON.stringify(l).length > GRENZE * WARN };
  }
  function leeren() { log = []; schreib(KEY_L, []); const e = einstellungen(); e.verworfen = 0; schreib(KEY_E, e); }
  // Übersicht „was ist geprüft“: je Rolle, Fach, Klasse (letztes Urteil je Inhalt+Schritt zählt)
  function geprueft() {
    const letzte = {};
    liste().filter(e => e.art === "pruefung").forEach(e => { letzte[[e.rolle, e.inhalt, e.schritt].join("|")] = e; });
    const z = {};
    Object.values(letzte).forEach(e => { const k = [e.rolle, e.fach || "–", e.klasse || "–"].join("|"); z[k] = z[k] || { rolle: e.rolle, fach: e.fach || "", klasse: e.klasse || "", ok: 0, aendern: 0, unklar: 0, inhalte: new Set() };
      z[k][e.urteil] = (z[k][e.urteil] || 0) + 1; z[k].inhalte.add(e.inhalt); });
    return Object.values(z).map(x => Object.assign(x, { inhalte: x.inhalte.size }));
  }

  const api = { _echt: true, ROLLEN, FAECHER, KLASSEN, KATEGORIEN, T, get aktiv() { return einstellungen().an; },
    einstellungen, setze, zeige, aufgabe, runde: rundeStart, rundeFertig, abbruch, hilfe, szene, technik, pruefung, merke: (e) => merke(e),
    eintraege: () => liste().slice(), sichern, leeren, datei, dateiname, vorschau, geprueft, pruefsumme, sha256, ohneNamen, get jetzt() { return jetzt ? Object.assign({}, jetzt, { hilfe: [...jetzt.hilfe], el: undefined }) : null; },
    melden: meldeDialog };
  // Aufrufe, die vor dem Laden dieser Datei kamen (Platzhalter aus core.js), nachholen
  const warte = window.Erprobung && window.Erprobung._q;
  window.Erprobung = api;
  const los = () => { start(); if (warte) warte.forEach(([n, a]) => { try { api[n](...a); } catch (e) { /* weiter */ } }); };
  if (document.body) los(); else addEventListener("DOMContentLoaded", los);
})();
