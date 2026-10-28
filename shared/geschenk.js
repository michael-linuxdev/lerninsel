// QR-Geschenke (NA-16, 30.10.2026): signierte Geschenk-Codes, offline geprüft.
// Code: "LG1.<Daten base64url>.<Signatur base64url>"; Daten = JSON { i: Code-id, g: Geschenk, n?: Text von der Absenderin/dem Absender }.
// Signatur: ECDSA P-256 mit SHA-256 (Rohformat r||s, wie WebCrypto). Erzeugt nur beim Auftraggeber mit quellen/geschenk-erzeugen.js –
// der private Schlüssel liegt NIE im Repo; hier steht nur der öffentliche (OEFFENTLICH). Ohne öffentlichen Schlüssel wird jeder Code abgelehnt.
// Jeder Code einmal je Kind (story.geschenke enthält "qr:<id>"); eingelöste Geschenke warten als Paket am Steg (Spielwelt "geschenkpakete").
// Geschenke: "tannenbaum" | "schleife" (fürs Tier) | "moebel:<id>" (Möbel aus dem Laden) | "sterne:<1–10>" | "zubehoer:<id>" (fürs Tier).
// Nach core.js und ereignisse.js laden.
(function () {
  const S = window.Spielwelt; if (!S) return;
  // Öffentlicher Schlüssel des Auftraggebers (JWK x/y). Erzeugen: node quellen/geschenk-erzeugen.js schluessel <Ordner außerhalb des Repos>
  const OEFFENTLICH = null;
  let testSchluessel = null;   // nur Tests: Geschenk._testSchluessel(jwk)

  const b64 = (s) => { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; return Uint8Array.from(atob(s), c => c.charCodeAt(0)); };
  // Möbel wie im Insel-Kern (MOEBEL); hier fest, weil der Elternbereich den Kern nicht lädt – beim Hinzufügen neuer Möbel ergänzen
  const MOEBEL = { lampe: ["💡", "Stehlampe"], baer: ["🧸", "Kuschelbär"], sitzsack: ["🫘", "Sitzsack"], kiste: ["🧩", "Spielzeugkiste"], korb: ["🧺", "Tierkörbchen"],
    globus: ["🌍", "Globus"], regal: ["📚", "Bücherregal"], staffelei: ["🎨", "Mal-Staffelei"], tisch: ["✏️", "Schreibtisch"], aquarium: ["🐠", "Aquarium"], tannenbaum: ["🎄", "Tannenbaum"] };
  const ZUBEHOER_IDS = () => ((window.Tiere && window.Tiere.ZUBEHOER) || [{ id: "schleife" }, { id: "brille" }, { id: "halstuch" }, { id: "hut" }, { id: "krone" }]).map(z => z.id);

  // Was ist das Geschenk? → { art, id?, n?, e, name } oder null
  function beschreibe(g) {
    const [art, wert] = String(g || "").split(":");
    if (art === "tannenbaum") return { art: "moebel", id: "tannenbaum", e: "🎄", name: "ein Tannenbaum für dein Zimmer" };
    if (art === "schleife") return { art: "zubehoer", id: "schleife", e: "🎀", name: "eine rote Schleife für dein Tier" };
    if (art === "moebel" && MOEBEL[wert]) return { art, id: wert, e: MOEBEL[wert][0], name: `${MOEBEL[wert][1]} für dein Zimmer` };
    if (art === "zubehoer" && ZUBEHOER_IDS().includes(wert)) return { art, id: wert, e: "🎀", name: "etwas Schönes für dein Tier" };
    if (art === "sterne") { const n = Math.floor(+wert); if (n >= 1 && n <= 10) return { art, n, e: "⭐", name: `${n} ${n === 1 ? "Stern" : "Sterne"}` }; }
    return null;
  }

  async function schluessel() {
    const jwk = testSchluessel || OEFFENTLICH; if (!jwk || !(window.crypto && crypto.subtle)) return null;
    return crypto.subtle.importKey("jwk", Object.assign({ kty: "EC", crv: "P-256", ext: true }, { x: jwk.x, y: jwk.y }), { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
  }

  // Prüfen ohne einzulösen → { ok, grund, daten, geschenk }; grund: "format" | "kein-schluessel" | "signatur" | "unbekannt" | "doppelt"
  async function pruefe(text) {
    const m = /^LG1\.([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)$/.exec(String(text || "").trim());
    if (!m) return { ok: false, grund: "format" };
    const k = await schluessel(); if (!k) return { ok: false, grund: "kein-schluessel" };
    let gut = false;
    try { gut = await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, k, b64(m[2]), new TextEncoder().encode(m[1])); } catch (e) { gut = false; }
    if (!gut) return { ok: false, grund: "signatur" };
    let daten = null; try { daten = JSON.parse(new TextDecoder().decode(b64(m[1]))); } catch (e) { /* unten */ }
    if (!daten || typeof daten.i !== "string" || !/^[a-z0-9-]{2,32}$/.test(daten.i)) return { ok: false, grund: "format" };
    const geschenk = beschreibe(daten.g); if (!geschenk) return { ok: false, grund: "unbekannt" };
    if (window.Story && window.Story.hatGeschenk("qr:" + daten.i)) return { ok: false, grund: "doppelt", daten, geschenk };
    return { ok: true, daten, geschenk };
  }

  const pakete = () => (S.lade("geschenkpakete") || []).filter(p => p && typeof p.i === "string" && beschreibe(p.g));
  // Einlösen: merkt den Code fürs Kind und legt ein Paket an den Steg
  async function einloesen(text) {
    const r = await pruefe(text); if (!r.ok) return r;
    window.Story.merkeGeschenk("qr:" + r.daten.i);
    const liste = pakete(); liste.push({ i: r.daten.i, g: r.daten.g, n: typeof r.daten.n === "string" ? r.daten.n.slice(0, 80) : "" });
    S.speichere("geschenkpakete", liste.slice(-10));
    return r;
  }
  // Paket öffnen (auf der Insel): Geschenk wirkt, Paket verschwindet → { geschenk, n, zimmer } oder null
  function oeffne() {
    const liste = pakete(); if (!liste.length) return null;
    const p = liste.shift(); S.speichere("geschenkpakete", liste);
    const g = beschreibe(p.g); let zimmer = false;
    if (g.art === "moebel") {
      S.schalteFrei("moebel-" + g.id, 0);
      const K = window.InselKern;
      if (K && K.zimmerDaten) { const d = K.zimmerDaten(); if (!Object.values(d.plaetze).includes(g.id)) { const frei = ["vornlinks", "links", "rechts", "mitterechts", "fenster", "bett"].find(k => !d.plaetze[k]); if (frei) { d.plaetze[frei] = g.id; S.speichere("zimmer", d); zimmer = true; } } }
    } else if (g.art === "zubehoer") { if (window.TierPflege && window.TierPflege.schenke) window.TierPflege.schenke(g.id); }
    else if (g.art === "sterne") S.gibSterne(g.n);
    return { geschenk: g, n: p.n, zimmer };
  }

  // Kamera: QR-Code lesen (BarcodeDetector, sonst jsQR aus shared/vendor, nur bei Bedarf geladen). gefunden(text) wird je Code einmal gerufen.
  // Ergebnis: Funktion zum Beenden; wirft, wenn die Kamera nicht erlaubt ist.
  const ROOT = ((document.currentScript && document.currentScript.src) || "").replace(/shared\/geschenk\.js.*$/, "");
  async function scanne(video, gefunden) {
    let lies = null;
    if ("BarcodeDetector" in window) { try { if ((await BarcodeDetector.getSupportedFormats()).includes("qr_code")) { const d = new BarcodeDetector({ formats: ["qr_code"] }); lies = async () => (await d.detect(video)).map(x => x.rawValue); } } catch (e) { /* jsQR */ } }
    if (!lies) {
      if (!window.jsQR) await new Promise((ok, f) => { const sk = document.createElement("script"); sk.src = ROOT + "shared/vendor/jsQR.js"; sk.onload = ok; sk.onerror = f; document.head.appendChild(sk); });
      const c = document.createElement("canvas"), ctx = c.getContext("2d", { willReadFrequently: true });
      lies = async () => { const w = video.videoWidth, h = video.videoHeight; if (!w) return []; const f = Math.min(1, 800 / Math.max(w, h)); c.width = Math.round(w * f); c.height = Math.round(h * f);
        ctx.drawImage(video, 0, 0, c.width, c.height); const r = window.jsQR(ctx.getImageData(0, 0, c.width, c.height).data, c.width, c.height, { inversionAttempts: "dontInvert" }); return r ? [r.data] : []; };
    }
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
    let lauf = true; const schon = new Set();
    video.srcObject = stream; await video.play().catch(() => {});
    (async () => { while (lauf) { let w = []; try { w = await lies(); } catch (e) { /* nächstes Bild */ } w.filter(x => /^LG1\./.test(x) && !schon.has(x)).forEach(x => { schon.add(x); gefunden(x); }); await new Promise(r => setTimeout(r, 150)); } })();
    return () => { lauf = false; stream.getTracks().forEach(t => t.stop()); video.srcObject = null; };
  }

  const GRUND = {
    format: "Das ist kein Geschenk-Code der Lerninsel.", "kein-schluessel": "Geschenk-Codes sind auf diesem Gerät noch nicht eingerichtet.",
    signatur: "Dieser Code ist nicht echt – er wurde nicht von der Lerninsel erstellt.", unbekannt: "Dieses Geschenk kennt die App nicht. Vielleicht ist die App zu alt?",
    doppelt: "Diesen Code hat dieses Kind schon eingelöst. Jeder Code gilt einmal je Kind."
  };
  window.Geschenk = { pruefe, einloesen, oeffne, pakete, scanne, beschreibe, GRUND, get eingerichtet() { return !!(testSchluessel || OEFFENTLICH); }, _testSchluessel(jwk) { testSchluessel = jwk; } };
})();
