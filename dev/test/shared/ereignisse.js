// Insel-Ereignisse und Story-Zustand (Neuausrichtung NA-01).
// Ereignisse: ein einfacher Nachrichtenweg zwischen den Bereichen der App.
//   Ereignisse.melde("bild", { id })      → alle Zuhörer auf dieser Seite bekommen es sofort
//   Ereignisse.hoere("bild", fn)          → fn(daten, eintrag); gibt eine Abmelde-Funktion zurück
//   Ereignisse.abholen("bild")            → vorgemerkte Ereignisse anderer Seiten holen (und aus der Liste nehmen)
// Was keine Seite sofort erledigt (Zuhörer gibt nicht true zurück), wird im Spielstand vorgemerkt
// (story.offen, höchstens 20 Einträge, ältere fallen weg). So erfährt z. B. die Insel beim nächsten Öffnen,
// dass im Atelier ein Bild gemalt wurde.
// Story-Zustand: profil.daten.story = { kapitel, etappen: { E1: "JJJJ-MM-TT" | 1 }, gesehen: [szenen-id], chronik: [{ s, d }], offen: [],
//   geschenke: [eingelöste Geschenk-IDs, z. B. "weihnachten-2026" oder QR-Codes] } – Etappe 1 statt Datum = bei der Umstellung übernommen
//   Story.kapitel(), Story.setzeKapitel(n) (nie rückwärts), Story.etappe(id) / Story.etappeFertig(id),
//   Story.gesehen(szene) / Story.merkeSzene(szene) (landet auch in der Chronik)
// Nach core.js laden. Alte Spielstände bekommen beim ersten Laden story mit Kapitel 0 (Migration in bereinige()).
(function () {
  const ARTEN = ["fund", "bild", "melodie", "bauwerk", "kapitel", "etappe"];
  const MAX_OFFEN = 20, MAX_GESEHEN = 100, MAX_CHRONIK = 100, MAX_KAPITEL = 20, MAX_DATEN = 160;

  // ---------- Migration und Prüfung (auch in Node testbar) ----------
  const istObjekt = (x) => !!x && typeof x === "object" && !Array.isArray(x);
  const kurz = (x, n) => String(x).slice(0, n);
  const DATUM = /^\d{4}-\d{2}-\d{2}$/;
  function bereinige(s) {
    s = istObjekt(s) ? s : {};
    const n = { kapitel: 0, etappen: {}, gesehen: [], chronik: [], offen: [], geschenke: [] };
    if (Number.isFinite(s.kapitel)) n.kapitel = Math.max(0, Math.min(MAX_KAPITEL, Math.floor(s.kapitel)));
    if (istObjekt(s.etappen)) Object.keys(s.etappen).forEach(k => {
      const v = s.etappen[k];
      if (/^E\d{1,2}$/.test(k) && v) n.etappen[k] = typeof v === "string" && DATUM.test(v) ? v : 1;
    });
    if (Array.isArray(s.gesehen)) n.gesehen = [...new Set(s.gesehen.filter(x => typeof x === "string" && x).map(x => kurz(x, 40)))].slice(-MAX_GESEHEN);
    if (Array.isArray(s.chronik)) n.chronik = s.chronik.filter(x => istObjekt(x) && typeof x.s === "string" && x.s)
      .map(x => ({ s: kurz(x.s, 40), d: typeof x.d === "string" && DATUM.test(x.d) ? x.d : "" })).slice(-MAX_CHRONIK);
    if (Array.isArray(s.geschenke)) n.geschenke = [...new Set(s.geschenke.filter(x => typeof x === "string" && x).map(x => kurz(x, 40)))].slice(-50);
    if (Array.isArray(s.offen)) n.offen = s.offen.filter(x => istObjekt(x) && ARTEN.includes(x.a))
      .map(x => ({ a: x.a, d: istObjekt(x.d) ? x.d : {}, z: Number.isFinite(x.z) ? x.z : 0 })).slice(-MAX_OFFEN);
    return n;
  }
  // Spielstand (profil.daten) bekommt immer ein gültiges story-Feld
  function migriere(daten) {
    if (!istObjekt(daten)) return daten;
    daten.story = bereinige(daten.story);
    return daten;
  }

  if (typeof module !== "undefined" && module.exports) { module.exports = { bereinige, migriere, ARTEN, MAX_OFFEN }; return; }

  const S = window.Spielwelt; if (!S) return;
  const pad = (z) => String(z).padStart(2, "0");
  const heute = () => { if (window.__heute) return window.__heute; const d = new Date(window.__jetzt || Date.now()); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const jetzt = () => window.__jetzt || Date.now();

  function lade() { return bereinige(S.lade("story")); }
  function speichere(st) { S.speichere("story", st); }
  // Beim Laden einmal migrieren (alter Spielstand ohne story → Kapitel 0). Wer schon den kompletten Tablet-Führerschein hatte,
  // kannte die Insel bereits: Etappe E1 (Ankunft) gilt als erledigt, der Prolog kommt nur, wenn die Eltern ihn neu starten.
  if (!istObjekt(S.profil.daten.story)) {
    const st = lade(), m = S.profil.daten.medien;
    if (m && m.fuehrerschein) {
      st.etappen.E1 = st.etappen.E2 = 1;   // kannte Insel und „Erst lernen, dann spielen“ schon (1 = übernommen, zählt nicht als „heute neu“)
      st.gesehen.push("sonne");                   // (ohne Chronik-Eintrag: die Szene wurde nie gezeigt)
      const lf = S.profil.daten.lernfunde;
      if (lf && (lf.summe > 0 || Object.keys(lf.tage || {}).length)) { st.etappen.E3 = 1; st.kapitel = Math.max(st.kapitel, 1); }
    }
    speichere(st);
  }

  // ---------- Ereignisse ----------
  const zuhoerer = {};
  // Daten klein halten: nur einfache Werte, höchstens 160 Zeichen
  function knapp(d) {
    if (!istObjekt(d)) return {};
    const k = {};
    Object.keys(d).forEach(x => { const v = d[x]; if (["string", "number", "boolean"].includes(typeof v)) k[x] = typeof v === "string" ? kurz(v, 60) : v; });
    return JSON.stringify(k).length > MAX_DATEN ? {} : k;
  }
  function melde(art, daten) {
    if (!ARTEN.includes(art)) return false;
    const eintrag = { a: art, d: knapp(daten), z: jetzt() };
    let erledigt = false;
    (zuhoerer[art] || []).slice().forEach(fn => { try { if (fn(eintrag.d, eintrag) === true) erledigt = true; } catch (e) { /* ein Zuhörer darf die anderen nicht stören */ } });
    if (!erledigt) {
      const st = lade(); st.offen.push(eintrag); st.offen = st.offen.slice(-MAX_OFFEN); speichere(st);
    }
    return true;
  }
  function hoere(art, fn) {
    if (!ARTEN.includes(art) || typeof fn !== "function") return () => {};
    (zuhoerer[art] = zuhoerer[art] || []).push(fn);
    return () => { zuhoerer[art] = (zuhoerer[art] || []).filter(x => x !== fn); };
  }
  // Vorgemerkte Ereignisse ansehen (ohne zu entfernen) bzw. abholen (entfernen); ohne Art: alle
  const passt = (art) => (x) => !art || x.a === art;
  function offene(art) { return lade().offen.filter(passt(art)); }
  function abholen(art) {
    const st = lade(), da = st.offen.filter(passt(art));
    if (da.length) { st.offen = st.offen.filter(x => !passt(art)(x)); speichere(st); }
    return da;
  }

  // ---------- Story-Zustand ----------
  const Story = {
    zustand: () => lade(),
    kapitel: () => lade().kapitel,
    // Kapitel öffnen sich nie rückwärts
    setzeKapitel(n) {
      const st = lade(); n = Math.floor(n);
      if (!Number.isFinite(n) || n <= st.kapitel || n > MAX_KAPITEL) return false;
      st.kapitel = n; speichere(st); melde("kapitel", { n }); return true;
    },
    etappe: (id) => !!lade().etappen[id],
    // Höchstens zwei neue Etappen am Tag (KONZEPT, Tutorial-Grundsatz 4) – die ersten Tage sollen nicht zu voll werden
    neuHeute: () => Object.values(lade().etappen).filter(x => x === heute()).length,
    darfNeueEtappe: () => Story.neuHeute() < 2,
    etappeFertig(id) {
      if (!/^E\d{1,2}$/.test(id)) return false;
      const st = lade(); if (st.etappen[id]) return false;
      st.etappen[id] = heute(); speichere(st); melde("etappe", { id }); return true;
    },
    // Eltern: eine Etappe zurücksetzen (z. B. Prolog neu starten); die Chronik bleibt
    etappeZuruecksetzen(id) { const st = lade(); if (!st.etappen[id]) return false; delete st.etappen[id]; speichere(st); return true; },
    gesehen: (szene) => lade().gesehen.includes(szene),
    vergiss(szene) { const st = lade(); if (!st.gesehen.includes(szene)) return false; st.gesehen = st.gesehen.filter(x => x !== szene); speichere(st); return true; },
    // Gesehene Szene merken; jede Szene steht einmal in der Chronik (zum Wiederansehen im Album)
    merkeSzene(szene) {
      if (typeof szene !== "string" || !szene) return false;
      const st = lade(), s = kurz(szene, 40); if (st.gesehen.includes(s)) return false;
      st.gesehen.push(s); st.gesehen = st.gesehen.slice(-MAX_GESEHEN);
      st.chronik.push({ s, d: heute() }); st.chronik = st.chronik.slice(-MAX_CHRONIK);
      speichere(st); return true;
    },
    chronik: () => lade().chronik.slice(),
    // Geschenke (Weihnachts-Sonderstart, QR-Geschenke): jedes nur einmal je Kind
    hatGeschenk: (id) => lade().geschenke.includes(id),
    merkeGeschenk(id) { const st = lade(); if (typeof id !== "string" || !id || st.geschenke.includes(id)) return false; st.geschenke.push(kurz(id, 40)); speichere(st); return true; },
    // Eltern: Story und Tutorial zurücksetzen (Lernfunde und alles andere bleiben)
    zuruecksetzen() { speichere(bereinige({})); }
  };

  const Ereignisse = { ARTEN, melde, hoere, offene, abholen, migriere };
  window.Ereignisse = Ereignisse;
  window.Story = Story;
  window.__ereignisse = { melde, offene, abholen, story: () => lade(), zuhoerer: (a) => (zuhoerer[a] || []).length };
})();
