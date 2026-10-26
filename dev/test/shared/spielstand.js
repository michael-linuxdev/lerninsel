// Spielstand sichern (Datei) und zwischen Tablets übertragen (QR-Code).
// Braucht: core.js, vendor/qrcodegen.js. jsQR wird nur bei Bedarf nachgeladen.
(function () {
  const S = window.Spielwelt;
  const ROOT = (document.currentScript && document.currentScript.dataset.root) || "./";
  const TEIL_GROESSE = 450;      // Zeichen pro QR-Code (gut lesbar vom Bildschirm)
  const WECHSEL_MS = 900;        // so lange wird jeder Teil gezeigt

  // ---------- Kodieren ----------
  const b64url = {
    aus(bytes) {
      let s = ""; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
      return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    },
    ein(text) {
      const s = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
      const b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i);
      return b;
    }
  };
  async function strom(bytes, transform) {
    const r = new Blob([bytes]).stream().pipeThrough(transform);
    return new Uint8Array(await new Response(r).arrayBuffer());
  }
  async function packe(obj) {
    const roh = new TextEncoder().encode(JSON.stringify(obj));
    if ("CompressionStream" in window) {
      try { return "z" + b64url.aus(await strom(roh, new CompressionStream("deflate-raw"))); } catch (e) { /* weiter ohne */ }
    }
    return "j" + b64url.aus(roh);
  }
  async function entpacke(text) {
    let bytes = b64url.ein(text.slice(1));
    if (text[0] === "z") bytes = await strom(bytes, new DecompressionStream("deflate-raw"));
    return JSON.parse(new TextDecoder().decode(bytes));
  }
  async function zuTeilen(obj) {
    const daten = await packe(obj);
    const id = Math.random().toString(36).slice(2, 6);
    const n = Math.ceil(daten.length / TEIL_GROESSE);
    const teile = [];
    for (let i = 0; i < n; i++) teile.push(`SW1:${id}:${i + 1}:${n}:${daten.slice(i * TEIL_GROESSE, (i + 1) * TEIL_GROESSE)}`);
    return teile;
  }

  function zeichneQR(canvas, text) {
    const qr = qrcodegen.QrCode.encodeText(text, qrcodegen.QrCode.Ecc.LOW);
    const rand = 4, punkte = qr.size + rand * 2;
    const px = Math.max(4, Math.floor(Math.min(560, innerWidth - 80, innerHeight - 360) / punkte));
    canvas.width = canvas.height = punkte * px;
    const c = canvas.getContext("2d");
    c.fillStyle = "#fff"; c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "#000";
    for (let y = 0; y < qr.size; y++) for (let x = 0; x < qr.size; x++)
      if (qr.getModule(x, y)) c.fillRect((x + rand) * px, (y + rand) * px, px, px);
  }

  // ---------- Oberfläche ----------
  const html = `
  <div class="dialog" id="stand-dialog" hidden>
    <div class="karte stand-karte" role="dialog" aria-labelledby="stand-titel">
      <section data-ansicht="start">
        <h2 id="stand-titel">Spielstand</h2>
        <p class="stand-info" id="stand-info"></p>
        <div class="stand-knoepfe">
          <button class="knopf" data-tun="sichern"><span aria-hidden="true">💾</span>Als Datei sichern</button>
          <button class="knopf" data-tun="laden"><span aria-hidden="true">📂</span>Datei laden</button>
          <button class="knopf" data-tun="senden"><span aria-hidden="true">📤</span>Zum anderen Tablet schicken</button>
          <button class="knopf" data-tun="holen"><span aria-hidden="true">📷</span>Vom anderen Tablet holen</button>
        </div>
        <button class="knopf leise" data-tun="zu">Schließen</button>
        <input type="file" id="stand-datei" accept=".json,application/json" hidden>
      </section>

      <section data-ansicht="senden" hidden>
        <h2>Zum anderen Tablet schicken</h2>
        <p>Öffne am anderen Tablet „Spielstand“ und tippe auf „Vom anderen Tablet holen“. Halte es dann vor diesen Code.</p>
        <canvas id="stand-qr" aria-label="QR-Code mit deinem Spielstand"></canvas>
        <p class="stand-teil" id="stand-teil"></p>
        <button class="knopf" data-tun="zurueck">Fertig</button>
      </section>

      <section data-ansicht="holen" hidden>
        <h2>Vom anderen Tablet holen</h2>
        <p id="stand-holen-text">Zeig die Kamera auf den Code am anderen Tablet.</p>
        <div class="stand-kamera"><video id="stand-video" playsinline muted></video></div>
        <div class="stand-fortschritt" id="stand-fortschritt" aria-live="polite"></div>
        <button class="knopf" data-tun="zurueck">Abbrechen</button>
      </section>

      <section data-ansicht="fragen" hidden>
        <h2>Spielstand gefunden</h2>
        <p id="stand-frage"></p>
        <div class="stand-knoepfe zwei">
          <button class="knopf haupt" data-tun="ersetzen">Ja, ersetzen</button>
          <button class="knopf" data-tun="zurueck">Nein</button>
        </div>
      </section>
    </div>
  </div>`;

  const css = `
  .stand-karte { width: min(620px, 100%); max-height: calc(100dvh - 40px); overflow-y: auto; }
  .stand-karte p { font-size: 1.2rem; margin: 0 0 16px; line-height: 1.35; }
  .stand-knoepfe { display: grid; gap: 12px; margin-bottom: 12px; }
  .stand-knoepfe.zwei { grid-template-columns: 1fr 1fr; }
  .stand-knoepfe .knopf { margin-top: 0; width: 100%; min-height: 66px; font-size: 1.3rem; justify-content: flex-start; padding: 0 22px; gap: .6em; background: var(--himmel); }
  .stand-knoepfe.zwei .knopf { justify-content: center; }
  .stand-knoepfe .knopf.haupt { background: var(--pflaume); color: #fff; }
  .stand-karte .knopf.leise { box-shadow: none; background: transparent; width: 100%; }
  .stand-karte section > .knopf { width: 100%; margin-top: 6px; min-height: 56px; font-size: 1.2rem; }
  #stand-qr { display: block; margin: 0 auto 10px; max-width: 100%; height: auto; border-radius: 12px; }
  .stand-teil { text-align: center; font-weight: 600; min-height: 1.4em; }
  .stand-kamera { position: relative; border-radius: 20px; overflow: hidden; background: #000; aspect-ratio: 4 / 3; margin-bottom: 12px; }
  .stand-kamera video { width: 100%; height: 100%; object-fit: cover; display: block; }
  .stand-kamera::after { content: ""; position: absolute; inset: 14%; border: 5px solid var(--sonne); border-radius: 20px; }
  .stand-fortschritt { display: flex; gap: 8px; justify-content: center; min-height: 26px; margin-bottom: 8px; }
  .stand-fortschritt span { width: 22px; height: 22px; border-radius: 50%; background: var(--himmel); box-shadow: inset 0 0 0 3px var(--pflaume-hell); }
  .stand-fortschritt span.da { background: var(--minze); box-shadow: none; }`;

  document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
  document.body.insertAdjacentHTML("beforeend", html);

  const dialog = document.getElementById("stand-dialog");
  const ansichten = dialog.querySelectorAll("[data-ansicht]");
  let aufraeumen = null, gefunden = null;

  function zeige(name) {
    if (aufraeumen) { aufraeumen(); aufraeumen = null; }
    ansichten.forEach(a => a.hidden = a.dataset.ansicht !== name);
  }
  const anzahlLooks = (p) => ((p.daten.anziehen && p.daten.anziehen.schrank) || []).length;
  const beschreibe = (p) => `${p.sterne} ${p.sterne === 1 ? "Stern" : "Sterne"} und ${anzahlLooks(p)} ${anzahlLooks(p) === 1 ? "Look" : "Looks"}`;

  function oeffnen() {
    document.getElementById("stand-info").textContent = "Du hast gerade " + beschreibe(S.profil) + ".";
    zeige("start"); dialog.hidden = false;
  }
  function schliessen() { zeige("start"); dialog.hidden = true; }

  function frage(neu) {
    // Story-Zustand prüfen bzw. bei alten Spielständen anlegen (Kapitel 0)
    if (window.Ereignisse) window.Ereignisse.migriere(neu.daten);
    gefunden = neu;
    document.getElementById("stand-frage").textContent =
      `Spielstand von ${neu.name || "ohne Namen"}: ${beschreibe(neu)}. Soll er den Spielstand auf diesem Tablet ersetzen?`;
    S.ton("juhu");
    zeige("fragen");
  }

  // Datei sichern
  async function sichern() {
    const text = JSON.stringify(S.exportiere(), null, 1);
    const tag = new Date().toISOString().slice(0, 10);
    const name = `${(S.profil.name || "spielwelt").toLowerCase()}-spielstand-${tag}.json`;
    const datei = new File([text], name, { type: "application/json" });
    if (navigator.canShare && navigator.canShare({ files: [datei] })) {
      try { await navigator.share({ files: [datei], title: "Spielstand" }); S.meldung("Spielstand gesichert."); return; }
      catch (e) { if (e.name === "AbortError") return; }
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(datei); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 3000);
    S.meldung("Gespeichert im Ordner „Downloads“.");
  }

  // Datei laden
  const dateiFeld = document.getElementById("stand-datei");
  dateiFeld.addEventListener("change", async () => {
    const f = dateiFeld.files[0]; dateiFeld.value = "";
    if (!f) return;
    try {
      const neu = S.pruefeImport(JSON.parse(await f.text()));
      if (!neu) throw new Error();
      frage(neu);
    } catch (e) { S.ton("nein"); S.meldung("Das ist keine Spielstand-Datei."); }
  });

  // QR-Code zeigen
  async function senden() {
    zeige("senden");
    const teile = await zuTeilen(S.exportiere());
    const canvas = document.getElementById("stand-qr"), info = document.getElementById("stand-teil");
    let i = 0, lauf = true;
    const weiter = () => {
      if (!lauf) return;
      zeichneQR(canvas, teile[i]);
      info.textContent = teile.length > 1 ? `Code ${i + 1} von ${teile.length}` : "";
      i = (i + 1) % teile.length;
      if (teile.length > 1) timer = setTimeout(weiter, WECHSEL_MS);
    };
    let timer = null; weiter();
    aufraeumen = () => { lauf = false; clearTimeout(timer); };
  }

  // QR-Code lesen
  let jsqrLaden = null;
  function ladeJsQR() {
    if (window.jsQR) return Promise.resolve();
    return jsqrLaden || (jsqrLaden = new Promise((ok, fehler) => {
      const s = document.createElement("script"); s.src = ROOT + "shared/vendor/jsQR.js";
      s.onload = ok; s.onerror = fehler; document.head.appendChild(s);
    }));
  }
  async function leser() {
    if ("BarcodeDetector" in window) {
      try {
        if ((await BarcodeDetector.getSupportedFormats()).includes("qr_code")) {
          const d = new BarcodeDetector({ formats: ["qr_code"] });
          return async (video) => { const r = await d.detect(video); return r.map(x => x.rawValue); };
        }
      } catch (e) { /* weiter mit jsQR */ }
    }
    await ladeJsQR();
    const c = document.createElement("canvas"), ctx = c.getContext("2d", { willReadFrequently: true });
    return async (video) => {
      const w = video.videoWidth, h = video.videoHeight; if (!w) return [];
      const f = Math.min(1, 800 / Math.max(w, h));
      c.width = Math.round(w * f); c.height = Math.round(h * f);
      ctx.drawImage(video, 0, 0, c.width, c.height);
      const r = jsQR(ctx.getImageData(0, 0, c.width, c.height).data, c.width, c.height, { inversionAttempts: "dontInvert" });
      return r ? [r.data] : [];
    };
  }

  async function holen() {
    zeige("holen");
    const video = document.getElementById("stand-video");
    const text = document.getElementById("stand-holen-text");
    const fort = document.getElementById("stand-fortschritt");
    text.textContent = "Zeig die Kamera auf den Code am anderen Tablet.";
    fort.innerHTML = "";
    let lauf = true, stream = null;
    aufraeumen = () => { lauf = false; if (stream) stream.getTracks().forEach(t => t.stop()); video.srcObject = null; };

    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
    } catch (e) {
      text.textContent = "Die Kamera ist nicht erlaubt. Erlaube sie in den Browser-Einstellungen für diese Seite und versuche es nochmal.";
      return;
    }
    if (!lauf) { stream.getTracks().forEach(t => t.stop()); return; }
    video.srcObject = stream; await video.play().catch(() => {});

    const lies = await leser();
    let id = null, teile = [];
    const zeigeFortschritt = (n) => { fort.innerHTML = Array.from({ length: n }, (_, k) => `<span class="${teile[k] ? "da" : ""}"></span>`).join(""); };

    while (lauf) {
      let werte = [];
      try { werte = await lies(video); } catch (e) { /* nächstes Bild */ }
      for (const w of werte) {
        const m = /^SW1:([a-z0-9]{4}):(\d+):(\d+):(.+)$/.exec(w || "");
        if (!m) continue;
        const [, wid, i, n, daten] = m; const nr = +i - 1, gesamt = +n;
        if (wid !== id) { id = wid; teile = new Array(gesamt); }
        if (!teile[nr]) { teile[nr] = daten; S.ton("tipp"); }
        zeigeFortschritt(gesamt);
        if (teile.filter(Boolean).length === gesamt) {
          aufraeumen(); aufraeumen = null;
          try {
            const neu = S.pruefeImport(await entpacke(teile.join("")));
            if (!neu) throw new Error();
            frage(neu);
          } catch (e) { S.ton("nein"); zeige("start"); S.meldung("Der Code konnte nicht gelesen werden. Bitte nochmal."); }
          return;
        }
      }
      await new Promise(r => setTimeout(r, 120));
    }
  }

  dialog.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-tun]"); if (!b) return;
    S.ton("tipp");
    switch (b.dataset.tun) {
      case "sichern": sichern(); break;
      case "laden": dateiFeld.click(); break;
      case "senden": senden(); break;
      case "holen": holen(); break;
      case "zurueck": oeffnen(); break;
      case "zu": schliessen(); break;
      case "ersetzen":
        await S.importiere(gefunden);
        S.ton("juhu"); S.meldung("Spielstand übernommen!");
        setTimeout(() => location.reload(), 900);
        break;
    }
  });

  window.Spielstand = { oeffnen, _test: { zuTeilen, entpacke } };
})();
