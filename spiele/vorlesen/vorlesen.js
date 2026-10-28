// Vorlesen und Lesetheater (30.10.2026, Deutsch 2025 „Lesen“: flüssig und sinngestaltend vorlesen, Lautleseverfahren, Lesetheater, Viellesen).
// Ohne KI: Die App misst die Lesezeit (Wörter pro Minute), nimmt – nur mit Eltern-Erlaubnis – die eigene Stimme auf (Mein Heft) und fragt nach
// einer Selbsteinschätzung. Wiederholtes Lautlesen desselben Textes zeigt den Fortschritt. Keine Noten, keine Fristen.
// Daten: profil.daten.vorlesen = { mal: { textId: [{ am, s, wpm, selbst: [1..3, …] }] }, theater: { stueckId: [Rollen] }, pass: [{ am, titel, g }] }
(function () {
  const S = window.Spielwelt, SP = window.Sprache, C = window.Charakter, E = window.Eigenes;
  const $ = (id) => document.getElementById(id);
  const esc = (t) => String(t || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const daten = () => Object.assign({ mal: {}, theater: {}, pass: [] }, S.lade("vorlesen") || {});
  const speichere = (d) => S.speichere("vorlesen", d);
  const klasse = () => ((S.stufe && S.stufe()) || {}).klasse || 2;
  const heute = () => { const d = window.__jetzt ? new Date(window.__jetzt) : new Date(); return d.toISOString().slice(0, 10); };
  const sprich = (t, fertig) => { if (SP && SP.verfuegbar && SP.verfuegbar()) SP.sprich(t, "de-DE", fertig); else if (fertig) setTimeout(fertig, 400); };
  const RICHT = { 1: [20, 40], 2: [50, 70], 3: [80, 100], 4: [100, 120] };   // grobe Orientierung (Wörter pro Minute), keine Bewertung

  // ---------- Reiter ----------
  let teil = "laut";
  function zeigeTeil(t) {
    teil = t; document.querySelectorAll("[data-teil]").forEach(b => b.classList.toggle("an", b.dataset.teil === t));
    ["laut-liste", "laut-text", "theater-liste", "theater-stueck", "pass"].forEach(id => $(id).hidden = true);
    if (SP && SP.stopp) SP.stopp(); stoppeAufnahme();
    if (t === "laut") zeigeTexte(); else if (t === "theater") zeigeStuecke(); else zeigePass();
    scrollTo(0, 0);
  }
  document.querySelectorAll("[data-teil]").forEach(b => b.addEventListener("click", () => { S.ton("tipp"); zeigeTeil(b.dataset.teil); }));

  // ---------- Laut lesen ----------
  const ohneSilben = (t) => t.replace(/(\S)-(\S)/g, "$1$2");
  function texte() {
    const kl = klasse(), alt = (window.LESETEXTE || []).filter(t => +t.stufe <= Math.min(2, kl) && (kl <= 2 || +t.stufe === 2)).map(t => Object.assign({}, t, { text: ohneSilben(t.text) }));
    const neu = (window.VORLESETEXTE || []).filter(t => +t.stufe <= Math.max(3, kl) && kl >= 2);
    return kl >= 3 ? neu.concat(kl === 3 ? alt : []) : alt.concat(kl === 2 ? neu.filter(t => t.stufe === "3") : []);
  }
  const woerter = (t) => t.split(/\s+/).filter(w => /[A-Za-zÄÖÜäöüß0-9]/.test(w)).length;
  function zeigeTexte() {
    $("laut-liste").hidden = false; const d = daten();
    $("texte").innerHTML = texte().map(t => { const m = d.mal[t.id] || [];
      return `<button data-t="${t.id}"><span class="e">${t.bild}</span><span>${esc(t.titel)}<small>${woerter(t.text)} Wörter${m.length ? ` · ${m.length}× gelesen` : ""}</small></span></button>`; }).join("");
    $("texte").querySelectorAll("[data-t]").forEach(b => b.addEventListener("click", () => { S.ton("tipp"); oeffneText(b.dataset.t); }));
  }
  let lt = null, rec = null, aufnahme = null, uhr = null;
  function stoppeAufnahme() { if (rec) { try { rec.stopp(); } catch (x) { /* schon aus */ } rec = null; } clearInterval(uhr); }
  function oeffneText(id) {
    const t = texte().find(x => x.id === id); if (!t) return;
    lt = { t, start: 0, s: 0, selbst: [0, 0, 0] }; aufnahme = null;
    $("laut-liste").hidden = true; $("laut-text").hidden = false; $("lt-ergebnis").hidden = true;
    $("lt-titel").textContent = `${t.bild} ${t.titel}`; $("lt-text").textContent = t.text;
    $("lt-los").hidden = false; $("lt-vorbild").hidden = false; $("lt-stopp").hidden = true; $("lt-zeit").hidden = true;
    $("lt-aufnahme-info").textContent = E && E.darfAufnehmen && E.darfAufnehmen() ? "🎙️ Deine Stimme wird beim Lesen aufgenommen – du kannst dich danach anhören. Die Aufnahme bleibt auf diesem Tablet (Mein Heft)." :
      "Tipp: Wenn deine Eltern es im Elternbereich erlauben, kannst du dich beim Vorlesen auch aufnehmen.";
    scrollTo(0, 0);
  }
  $("lt-vorbild").addEventListener("click", () => { S.ton("tipp"); sprich(lt.t.text); });
  $("lt-los").addEventListener("click", async () => {
    S.ton("tipp"); if (SP && SP.stopp) SP.stopp();
    $("lt-los").hidden = true; $("lt-vorbild").hidden = true; $("lt-stopp").hidden = false; $("lt-zeit").hidden = false;
    lt.start = Date.now();
    uhr = setInterval(() => { const s = Math.floor((Date.now() - lt.start) / 1000); $("lt-zeit").textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }, 250);
    if (E && E.darfAufnehmen && E.darfAufnehmen()) { try { rec = await E.starteAufnahme((erg) => { aufnahme = erg; if (erg) $("lt-anhoeren").hidden = false; }, 240); } catch (x) { rec = null; } }
  });
  $("lt-stopp").addEventListener("click", () => {
    S.ton("tipp"); const s = Math.max(1, (Date.now() - lt.start) / 1000); lt.s = s; stoppeAufnahme();
    const n = woerter(lt.t.text), wpm = Math.round(n / s * 60), vorher = (daten().mal[lt.t.id] || []).slice(-1)[0], r = RICHT[Math.min(4, klasse())];
    lt.wpm = wpm;
    $("lt-stopp").hidden = true; $("lt-ergebnis").hidden = false; $("lt-anhoeren").hidden = !aufnahme;
    $("lt-werte").innerHTML = `<p>⏱️ <b>${Math.floor(s / 60) ? Math.floor(s / 60) + " min " : ""}${Math.round(s % 60)} s</b> für ${n} Wörter – das sind <b>${wpm} Wörter pro Minute</b>.</p>` +
      (wpm > 250 ? `<p>😮 Das ging sehr schnell! Hast du wirklich jedes Wort laut gelesen? Lies lieber genau als schnell.</p>` : "") +
      (vorher ? `<p>${wpm > vorher.wpm ? `🚀 Flüssiger als letztes Mal (${vorher.wpm})! Wiederholtes Lesen hilft.` : `Letztes Mal: ${vorher.wpm} Wörter pro Minute. Lies den Text ruhig noch einmal.`}</p>` : "") +
      `<p class="klein">Zum Vergleich: In Klasse ${Math.min(4, klasse())} lesen viele Kinder etwa ${r[0]}–${r[1]} Wörter pro Minute vor. Wichtiger als schnell ist: deutlich, ohne Stocken und mit Betonung.</p>`;
    const FR = ["Ich habe deutlich und laut genug gelesen.", "Ich habe ohne viel Stocken gelesen.", "Ich habe bei Punkt und Komma Pausen gemacht und betont."];
    $("lt-selbst").innerHTML = FR.map((f, i) => `<div class="z" data-f="${i}"><span>${f}</span><span>${[[3, "😀"], [2, "🙂"], [1, "😕"]].map(([w, e]) => `<button data-w="${w}" aria-label="${e}">${e}</button>`).join("")}</span></div>`).join("");
    $("lt-selbst").querySelectorAll(".z").forEach(z => z.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
      S.ton("tipp"); lt.selbst[+z.dataset.f] = +b.dataset.w; z.querySelectorAll("button").forEach(x => x.classList.toggle("an", x === b)); })));
    $("lt-ergebnis").scrollIntoView({ block: "nearest" });
  });
  $("lt-anhoeren").addEventListener("click", () => { if (!aufnahme) return; const a = new Audio(URL.createObjectURL(new Blob([aufnahme.ton], { type: aufnahme.typ || "audio/mp4" }))); a.play().catch(() => {}); });
  function sichern() {
    const d = daten(); d.mal[lt.t.id] = (d.mal[lt.t.id] || []).concat([{ am: heute(), s: Math.round(lt.s), wpm: lt.wpm, selbst: lt.selbst }]).slice(-10); speichere(d);
    if (aufnahme && E) E.speichere({ art: "ton", kapitel: "vorlesen", aufgabe: `Vorgelesen: ${lt.t.titel}`, ton: aufnahme.ton, typ: aufnahme.typ, dauer: aufnahme.dauer }).catch(() => null);
    if (C) C.gib("deutsch", 2);
    const gesamt = Object.values(d.mal).reduce((n, l) => n + l.length, 0);
    if (window.Lernfunde && (gesamt === 1 || d.mal[lt.t.id].length === 3)) Lernfunde.merke({ fach: "deutsch", art: "lesen", e: "🎙️", schluessel: "vorlesen:" + (gesamt === 1 ? "erst" : lt.t.id),
      text: gesamt === 1 ? "Deutsch: einen Text laut vorgelesen und die Zeit gemessen" : `Deutsch: „${lt.t.titel}“ dreimal vorgelesen – immer flüssiger` });
    aufnahme = null;
  }
  $("lt-speichern").addEventListener("click", () => { S.ton("juhu"); sichern(); zeigeTeil("laut"); });
  $("lt-nochmal").addEventListener("click", () => { S.ton("tipp"); const id = lt.t.id; sichern(); oeffneText(id); });
  $("lt-zurueck").addEventListener("click", () => { S.ton("tipp"); zeigeTeil("laut"); });

  // ---------- Lesetheater ----------
  let th = null;
  const stuecke = () => (window.LESETHEATER || []).filter(s => +s.stufe <= klasse() + 1);
  function zeigeStuecke() {
    $("theater-liste").hidden = false; const d = daten();
    $("stuecke").innerHTML = stuecke().map(s => `<button data-s="${s.id}"><span class="e">${s.bild}</span><span>${esc(s.titel)}<small>${s.rollen.length} Rollen${(d.theater[s.id] || []).length ? ` · gespielt: ${(d.theater[s.id] || []).map(r => s.rollen.find(x => x.id === r).e).join(" ")}` : ""}</small></span></button>`).join("");
    $("stuecke").querySelectorAll("[data-s]").forEach(b => b.addEventListener("click", () => { S.ton("tipp"); oeffneStueck(b.dataset.s); }));
  }
  function oeffneStueck(id) {
    const s = stuecke().find(x => x.id === id); th = { s, rolle: null, pos: -1 };
    $("theater-liste").hidden = true; $("theater-stueck").hidden = false;
    $("th-titel").textContent = `${s.bild} ${s.titel}`; $("th-info").textContent = "Welche Rolle liest du?";
    $("th-rollen").innerHTML = s.rollen.map(r => `<button class="knopf" data-r="${r.id}">${r.e} ${esc(r.name)}</button>`).join("");
    $("th-rollen").querySelectorAll("[data-r]").forEach(b => b.addEventListener("click", () => { S.ton("tipp"); th.rolle = b.dataset.r; $("th-rollen").querySelectorAll("[data-r]").forEach(x => x.classList.toggle("haupt", x === b)); starteStueck(); }));
    zeichneZeilen(); $("th-gelesen").hidden = true; $("th-weiter").hidden = true; scrollTo(0, 0);
  }
  function zeichneZeilen() {
    const s = th.s;
    $("th-zeilen").innerHTML = s.zeilen.map(([r, t], i) => { const R = s.rollen.find(x => x.id === r);
      return `<div class="zeile${r === th.rolle ? " ich" : ""}${i === th.pos ? " dran" : ""}${i < th.pos ? " vorbei" : ""}" data-z="${i}"><span class="wer">${R.e} ${esc(R.name)}</span><span>${esc(t)}</span></div>`; }).join("");
    const z = $("th-zeilen").querySelector(".dran"); if (z) z.scrollIntoView({ block: "nearest" });
  }
  function starteStueck() { th.pos = -1; $("th-info").textContent = "Deine Zeilen sind gelb. Lies sie laut, wenn sie grün umrandet sind!"; naechsteZeile(); }
  function naechsteZeile() {
    th.pos++; $("th-gelesen").hidden = true; $("th-weiter").hidden = true;
    if (th.pos >= th.s.zeilen.length) return stueckEnde();
    zeichneZeilen();
    const [r, t] = th.s.zeilen[th.pos];
    if (r === th.rolle) { $("th-gelesen").hidden = false; return; }
    const auto = SP && SP.verfuegbar && SP.verfuegbar();
    if (auto) sprich(t === "…" ? "" : t, () => { if (th && th.s.zeilen[th.pos] && th.s.zeilen[th.pos][1] === t) setTimeout(naechsteZeile, window.__testSchnell ? 10 : 350); });
    else $("th-weiter").hidden = false;
  }
  function stueckEnde() {
    th.pos = th.s.zeilen.length; zeichneZeilen();
    const d = daten(); d.theater[th.s.id] = [...new Set((d.theater[th.s.id] || []).concat([th.rolle]))]; speichere(d);
    if (C) C.gib("deutsch", 2); S.ton("juhu");
    if (window.Lernfunde) Lernfunde.merke({ fach: "deutsch", art: "lesen", e: "🎭", schluessel: "theater:" + th.s.id, text: `Deutsch: im Lesetheater „${th.s.titel}“ eine Rolle gelesen` });
    const fehlt = th.s.rollen.filter(r => !d.theater[th.s.id].includes(r.id));
    $("th-info").textContent = fehlt.length ? `👏 Applaus! Jetzt tauschen: Lies als Nächstes ${fehlt.map(r => r.e + " " + r.name).join(" oder ")}. Noch schöner: Spielt das Stück zu Hause mit verteilten Rollen!` : "👏 Applaus! Du hast alle Rollen gelesen. Spielt das Stück doch einmal für eure Familie vor!";
    th.rolle = null; $("th-rollen").querySelectorAll("[data-r]").forEach(x => x.classList.remove("haupt"));
  }
  $("th-gelesen").addEventListener("click", () => { S.ton("tipp"); naechsteZeile(); });
  $("th-weiter").addEventListener("click", () => { S.ton("tipp"); naechsteZeile(); });
  $("th-zurueck").addEventListener("click", () => { S.ton("tipp"); if (SP && SP.stopp) SP.stopp(); th = null; zeigeTeil("theater"); });

  // ---------- Lesepass (Viellesen) ----------
  let gefallen = 0;
  function zeigePass() {
    $("pass").hidden = false; const d = daten(), app = Object.values(d.mal).reduce((n, l) => n + l.length, 0);
    $("pass-zahl").textContent = `${d.pass.length} ${d.pass.length === 1 ? "Buch" : "Bücher und Hefte"} gelesen${app ? ` · ${app}× in der App vorgelesen` : ""}${d.pass.length >= 5 ? " · ⭐ Lese-Stempel!" : ""}`;
    $("pass-liste").innerHTML = d.pass.slice().reverse().map(p => `<li>${["", "😐", "🙂", "😍"][p.g] || "📖"} <b>${esc(p.titel)}</b> <span class="klein">${p.am.split("-").reverse().join(".")}</span></li>`).join("") || `<li class="klein">Noch nichts eingetragen.</li>`;
  }
  document.querySelectorAll("#pass-gefallen [data-g]").forEach(b => b.addEventListener("click", () => { S.ton("tipp"); gefallen = +b.dataset.g; document.querySelectorAll("#pass-gefallen [data-g]").forEach(x => x.classList.toggle("haupt", x === b)); }));
  $("pass-dazu").addEventListener("click", () => {
    const titel = $("pass-titel").value.trim();
    if (!titel) { $("pass-meldung").textContent = "Schreib zuerst den Titel auf."; return; }
    const d = daten(); d.pass = d.pass.concat([{ am: heute(), titel: titel.slice(0, 60), g: gefallen || 2 }]).slice(-100); speichere(d);
    S.ton("juhu"); if (C) C.gib("deutsch", 1); $("pass-titel").value = ""; gefallen = 0; document.querySelectorAll("#pass-gefallen [data-g]").forEach(x => x.classList.remove("haupt"));
    $("pass-meldung").textContent = `📚 „${titel}“ steht jetzt in deinem Lesepass.`;
    if (d.pass.length === 5 && window.Lernfunde) Lernfunde.merke({ fach: "deutsch", art: "lesen", e: "📚", schluessel: "lesepass:5", text: "Deutsch: fünf Bücher im Lesepass" });
    zeigePass();
  });

  const start = new URLSearchParams(location.search).get("teil");
  zeigeTeil(["laut", "theater", "pass"].includes(start) ? start : "laut");
  window.__vorlesen = { texte: () => texte().map(t => t.id), oeffneText, stuecke: () => stuecke().map(s => s.id), oeffneStueck, lt: () => lt, th: () => th, daten };
})();
