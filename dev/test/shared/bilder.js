// Gemalte Bilder (Atelier, PLAN 8b). Bilder sind zu groß für den Spielstand (QR-Transfer), darum liegen sie in einer
// eigenen IndexedDB auf diesem Tablet – getrennt je Kind und Umgebung. Sie verlassen das Gerät nie.
// Im Spielstand steht nur, welche Bilder im Zimmer an der Wand hängen: profil.daten.atelier.wand = [id, …] (höchstens 3).
// Bild = { id, kind, t (Zeitstempel), url (JPEG als data-URL), auftrag? }
(function () {
  const S = window.Spielwelt; if (!S) return;
  const MAX = 30, WAND = 3;
  const NAME = "lerninsel-bilder" + (S.umgebung === "prod" ? "" : "-" + S.umgebung), STORE = "bilder";
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
  function alle(kind = S.aktivesKind()) {
    return auftrag("readonly", (st, setze) => { const r = st.index("kind").getAll(kind); r.onsuccess = () => setze(r.result.sort((a, b) => b.t - a.t)); });
  }
  const hole = (id) => auftrag("readonly", (st, setze) => { const r = st.get(id); r.onsuccess = () => setze(r.result || null); });
  // Speichert neu oder überschreibt (gleiche id). Gibt die id zurück, oder null, wenn die Galerie voll ist.
  async function speichere(bild) {
    const kind = S.aktivesKind(), liste = await alle(kind);
    if (!bild.id && liste.length >= MAX) return null;
    const id = bild.id || kind + ":" + Date.now().toString(36);
    await auftrag("readwrite", (st) => st.put({ id, kind, t: Date.now(), url: bild.url, auftrag: bild.auftrag || (liste.find(b => b.id === id) || {}).auftrag || "" }));
    return id;
  }
  async function loesche(id) { await auftrag("readwrite", (st) => st.delete(id)); setzeWand(id, false); }
  async function loescheKind(kind) { const l = await alle(kind); await auftrag("readwrite", (st) => l.forEach(b => st.delete(b.id))); }
  // Wand im Zimmer
  const daten = () => Object.assign({ wand: [] }, S.lade("atelier") || {});
  const wand = () => daten().wand;
  function setzeWand(id, an) {
    const d = daten(); d.wand = d.wand.filter(x => x !== id);
    if (an) { d.wand.unshift(id); d.wand = d.wand.slice(0, WAND); }
    S.speichere("atelier", d);
  }
  async function wandBilder() { const ids = wand(), l = await Promise.all(ids.map(hole)); return l.filter(Boolean); }
  window.Bilder = { MAX, WAND, alle, hole, speichere, loesche, loescheKind, wand, setzeWand, wandBilder };
})();
