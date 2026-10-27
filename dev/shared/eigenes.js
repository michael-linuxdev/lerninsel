// Eigene Texte und Aufnahmen (Paket D1, Werkstatt-Schritte „schreiben“ und „aufnehmen“). Wie die gemalten Bilder liegen sie in einer
// eigenen IndexedDB auf diesem Tablet – getrennt je Kind und Umgebung, nicht im Spielstand (QR-Übertragung bleibt klein). Sie verlassen
// das Gerät nie; Eltern sehen und hören sie im Elternbereich und können sie dort löschen.
// Eintrag = { id, kind, t (Zeitstempel), art: "text" | "ton", kapitel, aufgabe, text? , ton?: ArrayBuffer, typ?: MIME-Typ, dauer?: Sekunden }
// Aufnehmen ist nur erlaubt, wenn die Eltern es eingeschaltet haben: Spielwelt.lade("eltern").deutsch.aufnehmen === true.
(function () {
  const S = window.Spielwelt; if (!S) return;
  const MAX = { text: 60, ton: 30 };
  const NAME = "lerninsel-eigenes" + (S.umgebung === "prod" ? "" : "-" + S.umgebung), STORE = "eigenes";
  let dbV = null;
  function db() {
    if (!("indexedDB" in window)) return Promise.reject(new Error("kein IndexedDB"));
    if (!dbV) dbV = new Promise((ok, fehler) => {
      const r = indexedDB.open(NAME, 1);
      r.onupgradeneeded = () => { const s = r.result.createObjectStore(STORE, { keyPath: "id" }); s.createIndex("kind", "kind"); };
      r.onsuccess = () => ok(r.result); r.onerror = () => fehler(r.error);
    });
    return dbV;
  }
  const auftrag = (modus, fn) => db().then(d => new Promise((ok, fehler) => {
    const tx = d.transaction(STORE, modus), st = tx.objectStore(STORE); let erg;
    fn(st, (x) => { erg = x; }); tx.oncomplete = () => ok(erg); tx.onerror = () => fehler(tx.error);
  }));
  function alle(kind = S.aktivesKind(), art) {
    return auftrag("readonly", (st, setze) => { const r = st.index("kind").getAll(kind); r.onsuccess = () => setze(r.result.filter(x => !art || x.art === art).sort((a, b) => b.t - a.t)); });
  }
  // Speichert einen Text oder eine Aufnahme; gibt die id zurück, oder null, wenn der Platz voll ist (oder ein Erwachsener spielt).
  async function speichere(e) {
    if (S.erwachsen && S.erwachsen()) return null;
    const kind = S.aktivesKind(), liste = await alle(kind, e.art);
    if (liste.length >= MAX[e.art]) return null;
    const id = kind + ":" + e.art + ":" + Date.now().toString(36);
    await auftrag("readwrite", (st) => st.put(Object.assign({}, e, { id, kind, t: Date.now() })));
    return id;
  }
  const loesche = (id) => auftrag("readwrite", (st) => st.delete(id));
  async function loescheKind(kind) { const l = await alle(kind); await auftrag("readwrite", (st) => l.forEach(x => st.delete(x.id))); }
  // Aufnahme als abspielbare Adresse (für <audio>); der Aufrufer gibt sie mit URL.revokeObjectURL wieder frei.
  const url = (e) => URL.createObjectURL(new Blob([e.ton], { type: e.typ || "audio/mp4" }));

  // ---------- Aufnehmen ----------
  const elternErlaubt = () => !!(((S.lade("eltern") || {}).deutsch || {}).aufnehmen);
  const kannAufnehmen = () => !!(window.MediaRecorder && navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  const darfAufnehmen = () => elternErlaubt() && kannAufnehmen();
  function mime() {
    const MR = window.MediaRecorder;
    return ["audio/mp4", "audio/webm;codecs=opus", "audio/webm", "audio/ogg"].find(t => MR.isTypeSupported && MR.isTypeSupported(t)) || "";
  }
  // Startet eine Aufnahme (höchstens maxSek Sekunden). Gibt { stopp() } zurück; fertig(erg) bekommt { ton, typ, dauer } oder null.
  async function starteAufnahme(fertig, maxSek = 90) {
    const strom = await navigator.mediaDevices.getUserMedia({ audio: true });
    const typ = mime(), rec = new MediaRecorder(strom, typ ? { mimeType: typ } : undefined), teile = [], start = Date.now();
    rec.ondataavailable = (ev) => { if (ev.data && ev.data.size) teile.push(ev.data); };
    rec.onstop = async () => {
      strom.getTracks().forEach(t => t.stop());
      clearTimeout(zeit);
      if (!teile.length) { fertig(null); return; }
      const blob = new Blob(teile, { type: rec.mimeType || typ || "audio/webm" });
      fertig({ ton: await blob.arrayBuffer(), typ: blob.type, dauer: Math.round((Date.now() - start) / 1000) });
    };
    rec.start(250);
    const zeit = setTimeout(() => { if (rec.state !== "inactive") rec.stop(); }, maxSek * 1000);
    return { stopp() { if (rec.state !== "inactive") rec.stop(); } };
  }

  window.Eigenes = { alle, speichere, loesche, loescheKind, url, MAX, elternErlaubt, kannAufnehmen, darfAufnehmen, starteAufnahme };
})();
