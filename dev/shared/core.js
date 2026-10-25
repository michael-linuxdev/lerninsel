// Gemeinsamer Kern für alle Spiele: Profil, Sterne, Freischaltungen, Töne.
// Der Spielstand liegt doppelt im Browser (localStorage + IndexedDB). Geht einer
// verloren, wird er aus dem anderen wiederhergestellt.
(function () {
  const cfg = window.SPIELWELT_CONFIG || { kind: "", modus: "schule" };
  // Testmodus (/dev): eigener, getrennter Spielstand – der echte bleibt unberührt
  const TEST = !!cfg.test;
  const KEY = TEST ? "spielwelt.dev.profil.v1" : "spielwelt.profil.v1";
  // Erwachsenen-Modus (nach PIN im Elternbereich): alles offen, keine Zeitgrenzen, gilt für diese Sitzung
  const ERW = TEST ? "spielwelt.dev.erwachsen" : "spielwelt.erwachsen";
  const erwachsen = () => { try { return +sessionStorage.getItem(ERW) > Date.now(); } catch (e) { return false; } };
  const DB_NAME = TEST ? "spielwelt-dev" : "spielwelt", DB_STORE = "stand";

  const leeresProfil = () => ({ name: "", sterne: 0, freigeschaltet: [], ton: true, daten: {}, stand: 0 });

  // ---------- localStorage ----------
  function lokalLesen() {
    try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; }
  }
  function lokalSchreiben(p) {
    try { localStorage.setItem(KEY, JSON.stringify(p)); return true; } catch (e) { return false; }
  }

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
  function dbLesen() {
    return db().then(d => new Promise((ok, fehler) => {
      const r = d.transaction(DB_STORE, "readonly").objectStore(DB_STORE).get(KEY);
      r.onsuccess = () => ok(r.result || null);
      r.onerror = () => fehler(r.error);
    })).catch(() => null);
  }
  function dbSchreiben(p) {
    return db().then(d => new Promise((ok) => {
      const t = d.transaction(DB_STORE, "readwrite");
      t.objectStore(DB_STORE).put(JSON.parse(JSON.stringify(p)), KEY);
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
    n.stand = Number.isFinite(p.stand) ? p.stand : 0;
    return n;
  }

  let profil = bereinige(lokalLesen()) || leeresProfil();

  // Beim Start mit der zweiten Kopie abgleichen
  dbLesen().then((kopie) => {
    const k = bereinige(kopie);
    const lokalDa = !!lokalLesen();
    if (k && (!lokalDa || k.stand > profil.stand)) {
      // localStorage war leer oder älter: aus IndexedDB wiederherstellen
      lokalSchreiben(k);
      if (!sessionStorage.getItem((TEST ? "spielwelt.dev.wiederhergestellt" : "spielwelt.wiederhergestellt"))) {
        sessionStorage.setItem((TEST ? "spielwelt.dev.wiederhergestellt" : "spielwelt.wiederhergestellt"), "1");
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
    kind() { return Object.assign({ alter: 8, klasse: 2, geschlecht: "n", hilfesprache: "" }, (profil.daten.eltern || {}).kind || {}); },
    hilfeRu() { return Spielwelt.kind().hilfesprache === "ru"; },
    setzeName(n) { const name = String(n).trim().slice(0, 20); speichernFest(p => { p.name = name; }); },
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
          try { localStorage.removeItem(KEY); } catch (er) { /* egal */ }
          try { indexedDB.deleteDatabase(DB_NAME); } catch (er) { /* egal */ }
          profil = leeresProfil(); setTimeout(() => location.reload(), 300);
        }
      });
      document.body.appendChild(b);
    };
    if (document.body) banner(); else addEventListener("DOMContentLoaded", banner);
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
