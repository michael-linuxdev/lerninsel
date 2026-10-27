// Gemeinsamer Kern für alle Spiele: Profil, Sterne, Freischaltungen, Töne.
// Der Spielstand liegt doppelt im Browser (localStorage + IndexedDB). Geht einer
// verloren, wird er aus dem anderen wiederhergestellt.
(function () {
  const cfg = window.SPIELWELT_CONFIG || { kind: "", modus: "schule" };
  // Testmodus (/dev): eigener, getrennter Spielstand – der echte bleibt unberührt
  // Umgebung: "prod" (Hauptseite), "dev" (/dev, neue Funktionen, normale Regeln), "test" (/dev/test, alles frei)
  const UMG = cfg.umgebung || (cfg.test ? "test" : "prod");
  const TEST = UMG === "test";
  const PRE = UMG === "prod" ? "spielwelt." : "spielwelt." + UMG + ".";   // eigene Speicher je Umgebung
  // Haushalt: PIN und Liste der Kinder auf diesem Tablet. Jedes Kind hat einen eigenen Spielstand.
  // Das erste Kind („k1“) nutzt den bisherigen Schlüssel, damit alte Spielstände erhalten bleiben.
  const HKEY = PRE + "haushalt.v1";
  const profilKey = (id) => id === "k1" ? PRE + "profil.v1" : PRE + "profil.v1." + id;
  // Erwachsenen-Modus (nach PIN im Elternbereich): alles offen, keine Zeitgrenzen, gilt für diese Sitzung
  const ERW = PRE + "erwachsen";
  const erwachsen = () => { try { return +sessionStorage.getItem(ERW) > Date.now(); } catch (e) { return false; } };
  const DB_NAME = UMG === "prod" ? "spielwelt" : "spielwelt-" + UMG, DB_STORE = "stand";

  // Hilfesprachen. fertig: Inhalte sind übersetzt (nur fertige können gewählt werden). rtl: von rechts nach links.
  const SPRACHEN = [
    { code: "ru", name: "Russisch", eigen: "Русский", kurz: "RU", tts: "ru-RU", fertig: true },
    { code: "uk", name: "Ukrainisch", eigen: "Українська", kurz: "UK", tts: "uk-UA", fertig: false },
    { code: "ar", name: "Arabisch", eigen: "العربية", kurz: "AR", tts: "ar-SA", rtl: true, fertig: false },
    { code: "tr", name: "Türkisch", eigen: "Türkçe", kurz: "TR", tts: "tr-TR", fertig: false },
    { code: "pl", name: "Polnisch", eigen: "Polski", kurz: "PL", tts: "pl-PL", fertig: false },
    { code: "fa", name: "Persisch (Farsi)", eigen: "فارسی", kurz: "FA", tts: "fa-IR", rtl: true, fertig: false }
  ];
  // Profil des Kindes (NA-02): Stufe, Bundesland, Muttersprache, Deutschstand
  const STUFEN = [
    { code: "vs", name: "Vorschule", klasse: 1, wenig: true },
    { code: "1", name: "1. Klasse", klasse: 1 }, { code: "2", name: "2. Klasse", klasse: 2 },
    { code: "3", name: "3. Klasse", klasse: 3 }, { code: "4", name: "4. Klasse", klasse: 4 },
    { code: "5", name: "Übergang Klasse 5", klasse: 4, wenig: true }
  ];
  // lehrplan: Schlüssel in shared/lehrplan.js (nur Sachsen ist schon ausgearbeitet)
  const LAENDER = [
    { code: "sn", name: "Sachsen", lehrplan: "sachsen" }, { code: "nw", name: "Nordrhein-Westfalen" },
    { code: "by", name: "Bayern" }, { code: "bw", name: "Baden-Württemberg" },
    { code: "ni", name: "Niedersachsen" }, { code: "bb", name: "Berlin / Brandenburg" }
  ];
  const DEUTSCHSTAND = [
    { code: "keine", name: "Noch kein Deutsch", text: "Das Kind ist neu in Deutschland oder hört Deutsch erst seit Kurzem." },
    { code: "wenig", name: "Wenig Deutsch", text: "Das Kind versteht einzelne Wörter und kurze Sätze." },
    { code: "alltag", name: "Alltags-Deutsch", text: "Das Kind kommt im Alltag zurecht, Schulsprache ist noch schwer." },
    { code: "gut", name: "Gutes Deutsch", text: "Das Kind spricht Deutsch wie Gleichaltrige (auch wenn zu Hause eine andere Sprache gesprochen wird)." }
  ];
  // Muttersprachen (auch ohne fertige Hilfe wählbar, Reihenfolge nach docs/SPRACHEN.md)
  const MUTTERSPRACHEN = [
    ["de", "Deutsch"], ["ru", "Russisch – Русский"], ["uk", "Ukrainisch – Українська"], ["ar", "Arabisch – العربية"],
    ["tr", "Türkisch – Türkçe"], ["pl", "Polnisch – Polski"], ["ro", "Rumänisch – Română"], ["fa", "Farsi/Dari – فارسی"],
    ["kmr", "Kurdisch (Kurmandschi) – Kurmancî"], ["en", "Englisch – English"], ["bg", "Bulgarisch – Български"],
    ["ckb", "Kurdisch (Sorani) – کوردی"], ["andere", "Andere Sprache"]
  ];
  // Alte Kind-Angaben auf die neuen Felder bringen: Klasse → Stufe, "sachsen" → "sn", Deutschstand und Muttersprache ergänzen
  function kindMigrieren(k) {
    if (!k || typeof k !== "object" || Array.isArray(k)) return k;
    if (!STUFEN.some(x => x.code === k.stufe)) k.stufe = String(Math.max(1, Math.min(4, Math.round(+k.klasse) || 2)));
    k.klasse = STUFEN.find(x => x.code === k.stufe).klasse;
    if (k.land === "sachsen" || !LAENDER.some(x => x.code === k.land)) k.land = "sn";
    if (!DEUTSCHSTAND.some(x => x.code === k.deutschstand)) k.deutschstand = "gut";
    if (!MUTTERSPRACHEN.some(x => x[0] === k.muttersprache)) k.muttersprache = k.hilfesprache || "de";
    return k;
  }
  const leeresProfil = () => ({ name: "", sterne: 0, freigeschaltet: [], ton: true, daten: {}, stand: 0 });

  // ---------- localStorage ----------
  const lesenK = (k) => { try { return JSON.parse(localStorage.getItem(k)) || null; } catch (e) { return null; } };
  const schreibenK = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
  function lokalLesen() { return lesenK(KEY); }
  function lokalSchreiben(p) { return schreibenK(KEY, p); }

  // ---------- IndexedDB (zweite Kopie) ----------
  let dbVersprechen = null;
  function db() {
    if (!("indexedDB" in window)) return Promise.reject(new Error("kein IndexedDB"));
    if (!dbVersprechen) {
      dbVersprechen = new Promise((ok, fehler) => {
        const r = indexedDB.open(DB_NAME, 1);
        r.onupgradeneeded = () => r.result.createObjectStore(DB_STORE);
        r.onsuccess = () => ok(r.result);
        r.onerror = () => fehler(r.error);
      });
    }
    return dbVersprechen;
  }
  function dbLesen(schluessel = KEY) {
    return db().then(d => new Promise((ok, fehler) => {
      const r = d.transaction(DB_STORE, "readonly").objectStore(DB_STORE).get(schluessel);
      r.onsuccess = () => ok(r.result || null);
      r.onerror = () => fehler(r.error);
    })).catch(() => null);
  }
  function dbSchreiben(p, schluessel = KEY) {
    return db().then(d => new Promise((ok) => {
      const t = d.transaction(DB_STORE, "readwrite");
      t.objectStore(DB_STORE).put(JSON.parse(JSON.stringify(p)), schluessel);
      t.oncomplete = () => ok(true);
      t.onerror = () => ok(false);
    })).catch(() => false);
  }
  let dbTimer = null;
  // Im Erwachsenen-Modus wird Spielfortschritt nicht gespeichert (keine Sterne, kein Fortschritt fürs Kind)
  function speichern() {
    if (!TEST && erwachsen()) return;
    profil.stand = Date.now();
    lokalSchreiben(profil);
    clearTimeout(dbTimer);
    dbTimer = setTimeout(() => dbSchreiben(profil), 250);
  }
  // Beim Verlassen der Seite sofort sichern
  addEventListener("pagehide", () => { if (!TEST && erwachsen()) return; clearTimeout(dbTimer); dbSchreiben(profil); });
  // Einstellungen immer speichern, auch im Erwachsenen-Modus: Änderung auf den gespeicherten Stand anwenden,
  // damit vorübergehender Fortschritt des Erwachsenen nicht mitgespeichert wird
  function speichernFest(aendern) {
    aendern(profil);
    if (TEST || !erwachsen()) { speichern(); return; }
    const p = lokalLesen() || leeresProfil();
    aendern(p); p.stand = Date.now();
    lokalSchreiben(p); dbSchreiben(p);
  }

  // ---------- Spielstand prüfen (für Datei und QR-Code) ----------
  function bereinige(p) {
    if (!p || typeof p !== "object") return null;
    const n = leeresProfil();
    n.name = typeof p.name === "string" ? p.name.trim().slice(0, 20) : "";
    n.sterne = Number.isFinite(p.sterne) && p.sterne >= 0 ? Math.floor(p.sterne) : 0;
    n.freigeschaltet = Array.isArray(p.freigeschaltet) ? p.freigeschaltet.filter(x => typeof x === "string").slice(0, 500) : [];
    n.ton = p.ton !== false;
    n.daten = p.daten && typeof p.daten === "object" && !Array.isArray(p.daten) ? p.daten : {};
    if (n.daten.eltern && n.daten.eltern.kind) kindMigrieren(n.daten.eltern.kind);
    n.stand = Number.isFinite(p.stand) ? p.stand : 0;
    return n;
  }

  // ---------- Haushalt laden (bei Bedarf aus dem alten Einzelprofil anlegen) ----------
  function bereinigeHaushalt(h) {
    if (!h || typeof h !== "object" || !Array.isArray(h.kinder) || !h.kinder.length) return null;
    const kinder = h.kinder.filter(k => k && /^k[0-9a-z]{1,12}$/.test(k.id)).map(k => ({ id: k.id, name: String(k.name || "").slice(0, 20) })).slice(0, 8);
    if (!kinder.length) return null;
    return { aktiv: kinder.some(k => k.id === h.aktiv) ? h.aktiv : kinder[0].id, kinder, pin: typeof h.pin === "string" ? h.pin : null, stand: Number.isFinite(h.stand) ? h.stand : 0 };
  }
  let haushalt = bereinigeHaushalt(lesenK(HKEY));
  if (!haushalt) {
    const alt = lesenK(PRE + "profil.v1");
    haushalt = { aktiv: "k1", kinder: [{ id: "k1", name: (alt && alt.name) || "" }], pin: (alt && alt.daten && alt.daten.eltern && alt.daten.eltern.pin) || null, stand: alt ? 1 : 0 };
    if (alt) schreibenK(HKEY, haushalt);
  }
  function haushaltSpeichern() { haushalt.stand = Date.now(); schreibenK(HKEY, haushalt); dbSchreiben(haushalt, HKEY); }
  let KEY = profilKey(haushalt.aktiv);

  let profil = bereinige(lokalLesen()) || leeresProfil();

  // Haushalt mit der zweiten Kopie abgleichen
  dbLesen(HKEY).then((kopie) => {
    const k = bereinigeHaushalt(kopie);
    if (k && (!lesenK(HKEY) || k.stand > haushalt.stand)) {
      schreibenK(HKEY, k);
      if (!sessionStorage.getItem(PRE + "haushalt-wieder")) { sessionStorage.setItem(PRE + "haushalt-wieder", "1"); location.reload(); }
    } else if (lesenK(HKEY) && (!k || haushalt.stand > k.stand)) dbSchreiben(haushalt, HKEY);
  });

  // Spielstand des aktiven Kindes mit der zweiten Kopie abgleichen
  dbLesen().then((kopie) => {
    const k = bereinige(kopie);
    const lokalDa = !!lokalLesen();
    if (k && (!lokalDa || k.stand > profil.stand)) {
      // localStorage war leer oder älter: aus IndexedDB wiederherstellen
      lokalSchreiben(k);
      if (!sessionStorage.getItem((PRE + "wiederhergestellt"))) {
        sessionStorage.setItem((PRE + "wiederhergestellt"), "1");
        location.reload();
      }
    } else if (lokalDa && (!k || profil.stand > k.stand)) {
      dbSchreiben(profil);
    }
  });

  // Browser bitten, den Speicher nicht automatisch zu löschen
  const speicherSchutz = (navigator.storage && navigator.storage.persist)
    ? navigator.storage.persisted().then(ja => ja || navigator.storage.persist()).catch(() => false)
    : Promise.resolve(false);

  const Spielwelt = {
    config: cfg,
    test: TEST,
    umgebung: UMG,
    vorsilbe: PRE,
    // Im Testmodus ist alles offen
    offen(bedingung) { return TEST || erwachsen() || !!bedingung; },
    erwachsen,
    setzeErwachsen(minuten) { try { if (minuten) sessionStorage.setItem(ERW, String(Date.now() + minuten * 60000)); else sessionStorage.removeItem(ERW); } catch (e) { /* egal */ } },
    get profil() { return profil; },
    speicherSchutz,                    // Promise<boolean>
    // "Annas", aber "Max'"
    genitiv(n) { n = n || profil.name || ""; return /[sßxz]$/i.test(n) ? n + "’" : n + "s"; },
    hatName() { return !!profil.name; },
    // Von den Eltern eingerichtet (Elternbereich): Alter, Klasse, Ansprache, Hilfesprache
    eingerichtet() { return !!(profil.daten.eltern && profil.daten.eltern.eingerichtet); },
    kind() { return kindMigrieren(Object.assign({ alter: 8, klasse: 2, geschlecht: "n", hilfesprache: "" }, (profil.daten.eltern || {}).kind || {})); },
    STUFEN, LAENDER, DEUTSCHSTAND, MUTTERSPRACHEN, kindMigrieren,
    // Insel-Zugang (NA-12): Standard ist die erste Lektion „Das Tablet bedienen“; Eltern können die alte Regel
    // (kompletter Tablet-Führerschein) wählen. Die Minispiele brauchen weiter den kompletten Führerschein.
    inselRegel() { return ((profil.daten.eltern || {}).insel || {}).zugang === "fuehrerschein" ? "fuehrerschein" : "bedienung"; },
    inselOffen() {
      const m = profil.daten.medien || {};
      if (Spielwelt.offen(m.fuehrerschein)) return true;
      return Spielwelt.inselRegel() === "bedienung" && !!(m.lektionen && m.lektionen.bedienung > 0);
    },
    minispieleOffen() { return Spielwelt.offen((profil.daten.medien || {}).fuehrerschein); },
    stufe() { return STUFEN.find(x => x.code === Spielwelt.kind().stufe); },
    land() { return LAENDER.find(x => x.code === Spielwelt.kind().land); },
    // Zwei Looks der Insel (NA-25): "rund" (three.js) und "pixel" (PixiJS) zeichnen dieselbe Welt – umschalten verliert nichts.
    // Gemerkt bei den Insel-Einstellungen des Kindes (eltern.insel.look); fehlt der Wert, gilt "rund".
    // Solange die Pixel-Insel entsteht (NA-26 bis NA-28), soll „Pixel“ nur in /dev und /dev/test wählbar sein; auf der Hauptseite gilt „Rund“.
    LOOKS: ["rund", "pixel"],
    // Seit NA-26 (Pixel-Insel spielbar) in /dev und /dev/test wählbar; auf der Hauptseite erst, wenn Figuren und Zimmer (NA-27/28) fertig sind.
    // Seit 27.10.2026 überall wählbar (Entscheidung des Auftraggebers: bis Weihnachten geht alles direkt auf die Hauptseite).
    lookWaehlbar() { return true; },
    // Übersetzungs-Entwürfe (Status „entwurf“): auf der Hauptseite nur für die freigegebenen Sprachen (Entscheidung 27.10.2026:
    // Russisch ja, alle anderen erst nach Prüfung); in /dev und /dev/test immer.
    ENTWURF_FREI: ["ru"],
    entwurfErlaubt(code) { return UMG !== "prod" || Spielwelt.ENTWURF_FREI.includes(code); },
    look() { if (!Spielwelt.lookWaehlbar()) return "rund"; return ((profil.daten.eltern || {}).insel || {}).look === "pixel" ? "pixel" : "rund"; },
    // Eltern können das Umschalten für das Kind sperren (eltern.insel.lookKind = false); Erwachsene (PIN) dürfen immer
    lookKindDarf() { return ((profil.daten.eltern || {}).insel || {}).lookKind !== false; },
    setzeLook(l) {
      const e = Spielwelt.lade("eltern") || {};
      e.insel = Object.assign({}, e.insel || {}, { look: l === "pixel" ? "pixel" : "rund" });
      Spielwelt.speichere("eltern", e); return Spielwelt.look();
    },
    // Adresse der Insel im gewählten Look (wurzel = Weg zur Startseite, z. B. "../../")
    inselUrl(wurzel = "", suche = "") { return wurzel + (Spielwelt.look() === "pixel" ? "spiele/pixel/insel.html" : "spiele/welt3d/heimat.html") + suche; },
    // Hilfesprachen: Inhalte tragen Hilfetexte als Felder je Sprache, z. B. { text, ru, uk } oder { warum, warumRu, warumUk }
    SPRACHEN,
    hilfe() { const c = Spielwelt.kind().hilfesprache; return SPRACHEN.find(x => x.code === c && x.fertig) || null; },
    hilfeRu() { return !!Spielwelt.hilfe(); },   // alter Name: „gibt es eine Hilfesprache?“
    // Hilfetext zu einem Feld: ht(o) → o.ru, ht(o, "warum") → o.warumRu (je nach gewählter Sprache)
    ht(o, feld) { const h = Spielwelt.hilfe(); if (!h || !o) return ""; const k = feld ? feld + h.code[0].toUpperCase() + h.code.slice(1) : h.code; return o[k] || ""; },
    // Feste Textpaare: [deutsch, russisch] (alt) oder { de, ru, uk } → [deutsch, hilfe]
    paar(x) { const h = Spielwelt.hilfe(); if (Array.isArray(x)) return [x[0], h && h.code === "ru" ? x[1] || "" : ""]; return [x.de, h ? x[h.code] || "" : ""]; },
    setzeName(n) {
      const name = String(n).trim().slice(0, 20); speichernFest(p => { p.name = name; });
      const e = haushalt.kinder.find(k => k.id === haushalt.aktiv); if (e && e.name !== name) { e.name = name; haushaltSpeichern(); }
    },
    // ---------- Mehrere Kinder pro Tablet ----------
    kinder() { return haushalt.kinder.map(k => Object.assign({ aktiv: k.id === haushalt.aktiv }, k)); },
    aktivesKind() { return haushalt.aktiv; },
    wechsleKind(id) { if (!haushalt.kinder.some(k => k.id === id)) return false; haushalt.aktiv = id; haushaltSpeichern(); try { sessionStorage.setItem(PRE + "gewaehlt", id); } catch (e) { /* egal */ } return true; },
    neuesKind() {
      if (haushalt.kinder.length >= 8) return null;
      let n = 2; while (haushalt.kinder.some(k => k.id === "k" + n)) n++;
      const id = "k" + n; haushalt.kinder.push({ id, name: "" }); haushaltSpeichern(); return id;
    },
    entferneKind(id) {
      if (haushalt.kinder.length <= 1) return false;
      haushalt.kinder = haushalt.kinder.filter(k => k.id !== id);
      if (haushalt.aktiv === id) haushalt.aktiv = haushalt.kinder[0].id;
      haushaltSpeichern();
      try { localStorage.removeItem(profilKey(id)); } catch (e) { /* egal */ }
      db().then(d => d.transaction(DB_STORE, "readwrite").objectStore(DB_STORE).delete(profilKey(id))).catch(() => {});
      return true;
    },
    // Wurde in dieser Sitzung schon gewählt, wer spielt? (nur nötig bei mehreren Kindern)
    kindGewaehlt() { try { return haushalt.kinder.length < 2 || sessionStorage.getItem(PRE + "gewaehlt") === haushalt.aktiv; } catch (e) { return true; } },
    profilVon(id) { return bereinige(lesenK(profilKey(id))); },
    // PIN gilt für den ganzen Haushalt
    pin() { return haushalt.pin; },
    // PIN prüfen (gleiche Prüfsumme wie im Elternbereich), z. B. wenn Erwachsene einen gemeinsamen Moment bestätigen
    pinStimmt(t) { let h = 5381; for (const c of "pin:" + String(t || "")) h = ((h << 5) + h + c.charCodeAt(0)) >>> 0; return !!haushalt.pin && haushalt.pin === h.toString(36); },
    setzePin(h) { haushalt.pin = h || null; haushaltSpeichern(); },
    sterne() { return profil.sterne; },
    gibSterne(n) { profil.sterne += n; speichern(); },
    istFrei(id) { return profil.freigeschaltet.includes(id); },
    schalteFrei(id, kosten) {
      if (profil.freigeschaltet.includes(id)) return true;
      if (profil.sterne < kosten) return false;
      profil.sterne -= kosten;
      profil.freigeschaltet.push(id);
      speichern();
      return true;
    },
    lade(spiel) { return profil.daten[spiel] || null; },
    speichere(spiel, d) { if (spiel === "eltern") speichernFest(p => { p.daten.eltern = d; }); else { profil.daten[spiel] = d; speichern(); } },
    tonAn() { return profil.ton; },
    setzeTon(an) { speichernFest(p => { p.ton = !!an; }); },

    // ---------- Sichern und Übertragen ----------
    exportiere() {
      return { app: "spielwelt", v: 1, zeit: Date.now(), profil: JSON.parse(JSON.stringify(profil)) };
    },
    pruefeImport(obj) {
      if (!obj || obj.app !== "spielwelt" || obj.v !== 1) return null;
      return bereinige(obj.profil);
    },
    importiere(neu) {
      profil = neu;
      profil.stand = Date.now();
      lokalSchreiben(profil);
      clearTimeout(dbTimer);
      return dbSchreiben(profil);
    },

    // Kleine Töne ohne Audiodateien
    ton(art) {
      if (!profil.ton) return;
      try {
        const ctx = audio();
        if (!ctx) return;
        if (ctx.state === "suspended") ctx.resume();
        const t = ctx.currentTime;
        const noten = {
          tipp: [[660, 0, 0.08]],
          wahl: [[523, 0, 0.09], [784, 0.07, 0.12]],
          juhu: [[523, 0, 0.12], [659, 0.1, 0.12], [784, 0.2, 0.12], [1047, 0.3, 0.25]],
          nein: [[300, 0, 0.15], [220, 0.12, 0.2]]
        }[art] || [[600, 0, 0.08]];
        noten.forEach(([f, start, dauer]) => {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = "triangle"; o.frequency.value = f;
          g.gain.setValueAtTime(0.0001, t + start);
          g.gain.exponentialRampToValueAtTime(0.18, t + start + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, t + start + dauer);
          o.connect(g).connect(ctx.destination);
          o.start(t + start); o.stop(t + start + dauer + 0.05);
        });
      } catch (e) { /* kein Ton möglich */ }
    },

    // Kurze Einblendung unten
    meldung(text) {
      let el = document.getElementById("meldung");
      if (!el) {
        el = document.createElement("div");
        el.id = "meldung"; el.setAttribute("role", "status");
        document.body.appendChild(el);
      }
      el.textContent = text;
      el.classList.remove("zeigen"); void el.offsetWidth; el.classList.add("zeigen");
      clearTimeout(Spielwelt._mt);
      Spielwelt._mt = setTimeout(() => el.classList.remove("zeigen"), 2600);
    }
  };

  // Audio: iPad/iPhone erlauben Ton erst nach einer Berührung. Beim ersten Antippen wird
  // der Ton entsperrt (stiller Mini-Ton) und danach immer wieder aufgeweckt.
  function audio() {
    if (Spielwelt._ctx) return Spielwelt._ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { Spielwelt._ctx = new AC(); } catch (e) { return null; }
    return Spielwelt._ctx;
  }
  function entsperren() {
    const ctx = audio();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    try {
      const b = ctx.createBuffer(1, 1, 22050), q = ctx.createBufferSource();
      q.buffer = b; q.connect(ctx.destination); q.start(0);
    } catch (e) { /* egal */ }
  }
  ["pointerdown", "touchend", "keydown"].forEach(ev => addEventListener(ev, entsperren, { capture: true, passive: true }));
  document.addEventListener("visibilitychange", () => { if (!document.hidden && Spielwelt._ctx && Spielwelt._ctx.state !== "running") Spielwelt._ctx.resume(); });

  window.Spielwelt = Spielwelt;

  if (TEST) {
    const banner = () => {
      const b = document.createElement("div");
      b.id = "testbanner";
      b.innerHTML = `<b>🧪 TESTMODUS</b><button data-t="plus">+50 ⭐</button><button data-t="reset">Zurücksetzen</button>`;
      b.style.cssText = "position:fixed;top:0;left:50%;transform:translateX(-50%);z-index:100;display:flex;gap:8px;align-items:center;" +
        "background:#FFDD00;color:#3b1f63;font:600 14px Fredoka,sans-serif;padding:4px 10px;border-radius:0 0 14px 14px;box-shadow:0 3px 0 rgba(0,0,0,.2)";
      b.querySelectorAll("button").forEach(x => x.style.cssText = "font:inherit;border:0;border-radius:999px;padding:4px 10px;background:#fff;cursor:pointer");
      b.addEventListener("click", e => {
        const t = e.target.dataset.t;
        if (t === "plus") { Spielwelt.gibSterne(50); setTimeout(() => location.reload(), 300); }
        if (t === "reset" && confirm("Testspielstand komplett löschen? Der echte Spielstand bleibt erhalten.")) {
          try { Object.keys(localStorage).filter(k => k.startsWith(PRE)).forEach(k => localStorage.removeItem(k)); } catch (er) { /* egal */ }
          try { indexedDB.deleteDatabase(DB_NAME); } catch (er) { /* egal */ }
          profil = leeresProfil(); setTimeout(() => location.reload(), 300);
        }
      });
      document.body.appendChild(b);
    };
    if (document.body) banner(); else addEventListener("DOMContentLoaded", banner);
  }

  if (UMG === "dev") {
    const marke = () => { const b = document.createElement("div"); b.textContent = "🛠 DEV";
      b.style.cssText = "position:fixed;bottom:6px;left:6px;z-index:100;background:#2E2B47;color:#fff;font:600 12px Fredoka,sans-serif;padding:3px 8px;border-radius:999px;opacity:.8;pointer-events:none";
      document.body.appendChild(b); };
    if (document.body) marke(); else addEventListener("DOMContentLoaded", marke);
  }
  if (!TEST && erwachsen()) {
    const leiste = () => {
      const b = document.createElement("div");
      b.innerHTML = `<b>👤 Erwachsenen-Modus · ohne Sterne</b><button>Beenden</button>`;
      b.style.cssText = "position:fixed;top:0;left:50%;transform:translateX(-50%);z-index:100;display:flex;gap:8px;align-items:center;" +
        "background:#3b1f63;color:#fff;font:600 14px Fredoka,sans-serif;padding:4px 10px;border-radius:0 0 14px 14px;box-shadow:0 3px 0 rgba(0,0,0,.2)";
      const k = b.querySelector("button");
      k.style.cssText = "font:inherit;border:0;border-radius:999px;padding:4px 10px;background:#fff;color:#3b1f63;cursor:pointer";
      k.addEventListener("click", () => { Spielwelt.setzeErwachsen(0); location.reload(); });
      document.body.appendChild(b);
    };
    if (document.body) leiste(); else addEventListener("DOMContentLoaded", leiste);
  }

  if ("serviceWorker" in navigator && location.protocol === "https:") {
    const tiefe = (document.currentScript && document.currentScript.dataset.root) || "./";
    navigator.serviceWorker.register(tiefe + "sw.js").catch(() => {});
  }
})();
