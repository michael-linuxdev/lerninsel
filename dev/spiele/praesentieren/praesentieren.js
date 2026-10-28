// Schreiben und Präsentieren am Tablet (30.10.2026, Deutsch 2025: Texte am Gerät gestalten, Rechtschreibprüfung nutzen, Präsentationen,
// Podcasts und Wikis; Sachunterricht Kl. 4: Präsentation gestalten und vortragen; Musik Kl. 4: über Musik präsentieren).
// Alles offline: Die Rechtschreibprüfung vergleicht mit einer Wortliste aus den Texten der App (keine KI, kein Server) und zeigt, dass
// solche Prüfungen Grenzen haben (Namen, das/dass). Aufnahmen nur mit Eltern-Erlaubnis (Mein Heft).
// Daten: profil.daten.praesentieren = { gestaltet: n, folien: { thema, liste: [{ titel, bild, punkte: [] }] }, vortraege: n, podcast: { titel, skript: [] }, wiki: { Seite: Text } }
(function () {
  const S = window.Spielwelt, SP = window.Sprache, C = window.Charakter, E = window.Eigenes;
  const $ = (id) => document.getElementById(id);
  const esc = (t) => String(t || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const daten = () => Object.assign({ gestaltet: 0, folien: null, vortraege: 0, podcast: { titel: "", skript: ["", "", "", ""] }, wiki: null }, S.lade("praesentieren") || {});
  const speichere = (d) => S.speichere("praesentieren", d);
  const fund = (schluessel, text, e) => { if (window.Lernfunde) Lernfunde.merke({ fach: "deutsch", art: "medien", e, schluessel, text }); };

  // ---------- Reiter ----------
  const TEILE = ["gestalten", "pruefen", "folien", "podcast", "wiki"];
  function zeigeTeil(t) {
    TEILE.forEach(x => $("t-" + x).hidden = x !== t);
    document.querySelectorAll("[data-teil]").forEach(b => b.classList.toggle("an", b.dataset.teil === t));
    if (t === "folien") zeichneFolien(); if (t === "podcast") zeichnePodcast(); if (t === "wiki") zeigeWiki("Startseite");
    scrollTo(0, 0);
  }
  document.querySelectorAll("[data-teil]").forEach(b => b.addEventListener("click", () => { S.ton("tipp"); zeigeTeil(b.dataset.teil); }));

  // ---------- Text gestalten ----------
  const AUFTRAEGE = [
    "Gestalte eine Einladung zu deinem Fest: Wozu lädst du ein, wann und wo? Mach eine Überschrift, schreib das Wichtigste fett und markiere die Uhrzeit.",
    "Gestalte einen Steckbrief über dein Lieblingstier: Überschrift, mindestens zwei Absätze (Aussehen, Nahrung), wichtige Wörter fett.",
    "Gestalte ein Plakat für einen Flohmarkt: große Überschrift, eine andere Schriftart, das Datum markiert."
  ];
  const CHECKS = [
    ["Überschrift", (ed) => !!ed.querySelector("h2, h1")],
    ["etwas fett", (ed) => !!ed.querySelector("b, strong") || [...ed.querySelectorAll("span")].some(s => /bold|[6-9]00/.test(s.style.fontWeight))],
    ["etwas markiert", (ed) => [...ed.querySelectorAll("*")].some(x => x.style && x.style.backgroundColor && !/transparent|rgba\(0, 0, 0, 0\)/.test(x.style.backgroundColor)) || !!ed.querySelector("mark")],
    ["Größe oder Schriftart geändert", (ed) => !!ed.querySelector("font[size], font[face]") || [...ed.querySelectorAll("span")].some(s => s.style.fontSize || s.style.fontFamily)],
    ["mindestens zwei Absätze", (ed) => ed.querySelectorAll("div, p, h2").length >= 2 || (ed.innerHTML.match(/<br>/g) || []).length >= 1]
  ];
  let auftrag = 0;
  function pruefeGestaltung() {
    const ed = $("g-editor"), ok = CHECKS.map(([n, f]) => [n, f(ed)]);
    $("g-checks").innerHTML = ok.map(([n, o]) => `<li class="${o ? "ok" : ""}">${n}</li>`).join("");
    return ok.every(x => x[1]);
  }
  function neuGestalten() { auftrag = daten().gestaltet % AUFTRAEGE.length; $("g-auftrag").textContent = "🎯 " + AUFTRAEGE[auftrag]; $("g-editor").innerHTML = ""; $("g-meldung").textContent = ""; pruefeGestaltung(); }
  function befehl(cmd, wert) {
    $("g-editor").focus(); try { document.execCommand("styleWithCSS", false, cmd === "mark"); } catch (x) { /* alt */ }
    if (cmd === "h2" || cmd === "p") document.execCommand("formatBlock", false, cmd === "h2" ? "<h2>" : "<div>");
    else if (cmd === "mark") { if (!document.execCommand("hiliteColor", false, "#FFE45C")) document.execCommand("backColor", false, "#FFE45C"); }
    else if (cmd === "links") document.execCommand("justifyLeft"); else if (cmd === "mitte") document.execCommand("justifyCenter");
    else if (cmd === "groesse") document.execCommand("fontSize", false, wert); else if (cmd === "schrift") document.execCommand("fontName", false, wert);
    else document.execCommand(cmd);
    pruefeGestaltung();
  }
  $("g-leiste").querySelectorAll("[data-cmd]").forEach(b => b.addEventListener("pointerdown", (e) => { e.preventDefault(); S.ton("tipp"); befehl(b.dataset.cmd); }));
  $("g-groesse").addEventListener("change", (e) => { if (e.target.value) befehl("groesse", e.target.value); e.target.value = ""; });
  $("g-schrift").addEventListener("change", (e) => { if (e.target.value) befehl("schrift", e.target.value); e.target.value = ""; });
  $("g-editor").addEventListener("input", pruefeGestaltung);
  $("g-speichern").addEventListener("click", async () => {
    const text = $("g-editor").innerText.trim();
    if (text.length < 20) { $("g-meldung").textContent = "Schreib noch etwas mehr."; return; }
    const alles = pruefeGestaltung();
    if (E) await E.speichere({ art: "text", kapitel: "gestalten", aufgabe: "Gestalteter Text", text, html: $("g-editor").innerHTML.slice(0, 4000) }).catch(() => null);
    const d = daten(); d.gestaltet++; speichere(d); if (C) C.gib("deutsch", alles ? 3 : 1); S.ton("juhu");
    $("g-meldung").textContent = alles ? "🎉 Toll gestaltet! Der Text liegt jetzt in deinem Heft." : "💾 Gespeichert. Tipp: Probier auch die anderen Knöpfe aus (siehe Liste).";
    if (alles && d.gestaltet === 1) fund("gestalten", "Deutsch: einen Text am Tablet gestaltet (Überschrift, fett, markiert, Absätze)", "✍️");
  });
  $("g-neu").addEventListener("click", () => { S.ton("tipp"); neuGestalten(); });

  // ---------- Rechtschreibprüfung (Wortliste aus den Texten der App) ----------
  const GRUND = "der die das den dem des ein eine einen einem einer und oder aber weil dass wenn als wie auch noch schon nicht kein keine ich du er sie es wir ihr mich mir dich dir uns euch mein meine meinen dein deine sein seine ihre unser hat habe hatte hatten haben ist sind war waren bin bist wird werden kann können muss müssen will wollen darf mag geht gehen ging kam kommen kommt sagte sagen sieht sehen gesehen gemacht machen spielen gespielt gegessen essen trinken laufen lief fahren fuhr gestern heute morgen dann danach plötzlich endlich immer oft nie sehr viel viele groß klein lang kurz schön gut neu alt lustig lustigsten groß größer gern gerne mit im in auf an bei nach vor über unter zum zur vom von zu aus für ohne um bis seit Mama Papa Oma Opa Schule Zoo Elefanten Elefant Affen Rüssel Eis Freund Freundin Hund Katze Haus Baum Wald Stadt Garten Tag Nacht Uhr Woche Ferien Geburtstag".split(" ");
  let wortSet = null, wortListe = [];
  function baueWoerter() {
    if (wortSet) return;
    const quellen = [JSON.stringify(window.WERKSTATT || []), JSON.stringify(window.GESCHICHTE || []), JSON.stringify(window.LESETEXTE || []).replace(/(\S)-(\S)/g, "$1$2"),
      JSON.stringify(window.VORLESETEXTE || []), JSON.stringify(window.LESETHEATER || []), GRUND.join(" ")];
    if (window.Wortschatz && Wortschatz.alle) quellen.push(Wortschatz.alle().map(w => [w.de, w.mehrzahl].join(" ")).join(" "));
    wortSet = new Set(); quellen.forEach(q => (q.match(/[A-Za-zÄÖÜäöüß]{2,}/g) || []).forEach(w => wortSet.add(w)));
    ["typ", "ru", "de", "lz", "id", "satz", "frage", "optionen", "schritte"].forEach(w => wortSet.delete(w));   // Feldnamen der Daten
    wortListe = [...wortSet];
  }
  function abstand(a, b) {
    const m = a.length, n = b.length; if (Math.abs(m - n) > 2) return 9; const d = Array.from({ length: m + 1 }, (_, i) => [i].concat(Array(n).fill(0)));
    for (let j = 1; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  function vorschlaege(w) {
    const k = w.toLowerCase(), gross = w[0] === w[0].toUpperCase();
    const varianten = wortListe.filter(x => x.toLowerCase() === k && x !== w);
    if (varianten.length) return varianten.slice(0, 3);
    return wortListe.map(x => [x, abstand(k, x.toLowerCase())]).filter(([x, d]) => d <= 2).sort((a, b) => a[1] - b[1] || (gross === (a[0][0] === a[0][0].toUpperCase()) ? -1 : 1)).slice(0, 3).map(x => x[0]);
  }
  function pruefe() {
    baueWoerter();
    const text = $("p-text").value; let satzanfang = true, n = 0, namen = 0;
    const html = text.split(/([A-Za-zÄÖÜäöüß]+)/).map(t => {
      if (!/^[A-Za-zÄÖÜäöüß]+$/.test(t)) { if (/[.!?]/.test(t)) satzanfang = true; return esc(t).replace(/\n/g, "<br>"); }
      const anfang = satzanfang; satzanfang = false;
      const bekannt = wortSet.has(t) || (anfang && wortSet.has(t[0].toLowerCase() + t.slice(1)));
      if (bekannt || t.length < 2) return esc(t);
      const v = vorschlaege(anfang ? t[0].toLowerCase() + t.slice(1) : t);
      if (!v.length && t[0] === t[0].toUpperCase() && !anfang) { namen++; return `<span class="name" data-w="${esc(t)}">${esc(t)}</span>`; }
      n++; return `<span class="falsch" data-w="${esc(t)}" data-anfang="${anfang ? 1 : ""}">${esc(t)}</span>`;
    }).join("");
    $("p-ergebnis").hidden = false; $("p-ergebnis").innerHTML = html; $("p-hilfe").innerHTML = "";
    $("p-meldung").textContent = n ? `${n} ${n === 1 ? "Wort ist" : "Wörter sind"} rot unterstrichen. Tippe darauf!` + (namen ? " Blau gepunktet: vielleicht ein Name – das Programm kennt ihn nicht." : "")
      : "✅ Keine roten Wörter mehr." + (namen ? " (Blau gepunktet: ein Name, den das Programm nicht kennt – das ist kein Fehler.)" : "") + " Aber Achtung: Die Prüfung findet nicht jeden Fehler – lies selbst noch einmal!";
    $("p-ergebnis").querySelectorAll(".falsch, .name").forEach(s => s.addEventListener("click", () => hilfe(s)));
    if (!n && text.trim().length > 20) { const d = daten(); if (!d.geprueft) { d.geprueft = 1; speichere(d); if (C) C.gib("deutsch", 2); fund("pruefen", "Deutsch: einen Text mit der Rechtschreibprüfung überarbeitet", "🔍"); } }
    return n;
  }
  function hilfe(span) {
    S.ton("tipp"); const w = span.dataset.w, anfang = !!span.dataset.anfang;
    if (span.classList.contains("name")) { $("p-hilfe").innerHTML = `<p>„${esc(w)}“ kennt die Prüfung nicht. Wenn es ein Name ist, ist es richtig geschrieben – Namen schreibt man groß.</p>`; return; }
    let v = vorschlaege(anfang ? w[0].toLowerCase() + w.slice(1) : w); if (anfang) v = v.map(x => x[0].toUpperCase() + x.slice(1));
    $("p-hilfe").innerHTML = `<p>Meintest du …</p><div class="vorschlaege">${v.map(x => `<button class="knopf" data-v="${esc(x)}">${esc(x)}</button>`).join("")}<button class="knopf" data-v="">Nein, „${esc(w)}“ stimmt</button></div>`;
    $("p-hilfe").querySelectorAll("[data-v]").forEach(b => b.addEventListener("click", () => {
      S.ton("tipp"); const neu = b.dataset.v;
      if (neu) { const t = $("p-text").value, i = t.split(/([A-Za-zÄÖÜäöüß]+)/); let gefunden = false; $("p-text").value = i.map(x => { if (!gefunden && x === w) { gefunden = true; return neu; } return x; }).join(""); }
      else { baueWoerter(); wortSet.add(w); wortListe.push(w); }
      pruefe();
    }));
  }
  const BEISPIEL = "Gestern war ich mit meiner Oma im Zoo. Dort habe ich einen Elefanten gesehn. Er war sehr gros und hate einen langen Rüssel. Mein Freund Jannik fand die Affen am lustigsten. Dann haben wir ein eis gegessen.";
  $("p-pruefen").addEventListener("click", () => { S.ton("tipp"); pruefe(); });
  $("p-beispiel").addEventListener("click", () => { S.ton("tipp"); $("p-text").value = BEISPIEL; $("p-ergebnis").hidden = true; $("p-hilfe").innerHTML = ""; $("p-meldung").textContent = "Jetzt auf „Prüfen“ tippen."; });

  // ---------- Präsentation (Folien) ----------
  const THEMEN = ["Mein Lieblingstier", "Ein Musikinstrument", "Mein Wohnort", "Ein Sachthema meiner Wahl", "Ein Buch, das ich mag", "Eine Komponistin oder ein Komponist"];
  const BILDER = ["🦔", "🐶", "🐱", "🦊", "🐴", "🎻", "🎹", "🥁", "🎺", "🎸", "🏘️", "🏰", "🌳", "🌍", "🔬", "📚", "🌦️", "⚽", "🎨", "🚲", "⭐", "❓"];
  const TIPPS = ["Schau dein Publikum an.", "Sprich laut, deutlich und langsam.", "Erzähle mehr, als auf der Folie steht – die Stichpunkte helfen dir.", "Mach am Ende eine kleine Pause und frag: Habt ihr Fragen?"];
  function folien() { const d = daten(); if (!d.folien) d.folien = { thema: THEMEN[0], liste: [{ titel: THEMEN[0], bild: "⭐", punkte: ["", "", ""] }] }; return d; }
  function zeichneFolien() {
    const d = folien(); $("f-thema").innerHTML = THEMEN.map(t => `<option ${t === d.folien.thema ? "selected" : ""}>${t}</option>`).join("");
    $("f-liste").innerHTML = d.folien.liste.map((f, i) => `<div class="folie-k" data-i="${i}"><div class="klein">Folie ${i + 1}</div>
      <input class="feld" data-feld="titel" value="${esc(f.titel)}" maxlength="40" placeholder="Überschrift" aria-label="Überschrift Folie ${i + 1}">
      <div class="leiste" style="margin:6px 0">${BILDER.map(b => `<button data-bild="${b}" class="${b === f.bild ? "an" : ""}" style="${b === f.bild ? "border-color:var(--pflaume)" : ""}">${b}</button>`).join("")}</div>
      ${f.punkte.map((p, k) => `<input class="feld" data-punkt="${k}" value="${esc(p)}" maxlength="50" placeholder="Stichpunkt ${k + 1}" style="margin-top:4px">`).join("")}
      ${d.folien.liste.length > 1 ? `<button class="knopf" data-weg="1" style="margin-top:6px">🗑️ Folie weg</button>` : ""}</div>`).join("");
    $("f-liste").querySelectorAll(".folie-k").forEach(k => { const i = +k.dataset.i;
      k.querySelector('[data-feld="titel"]').addEventListener("input", (e) => { const d2 = folien(); d2.folien.liste[i].titel = e.target.value; speichere(d2); });
      k.querySelectorAll("[data-punkt]").forEach(inp => inp.addEventListener("input", (e) => { const d2 = folien(); d2.folien.liste[i].punkte[+inp.dataset.punkt] = e.target.value; speichere(d2); }));
      k.querySelectorAll("[data-bild]").forEach(b => b.addEventListener("click", () => { S.ton("tipp"); const d2 = folien(); d2.folien.liste[i].bild = b.dataset.bild; speichere(d2); zeichneFolien(); }));
      const weg = k.querySelector("[data-weg]"); if (weg) weg.addEventListener("click", () => { const d2 = folien(); d2.folien.liste.splice(i, 1); speichere(d2); zeichneFolien(); });
    });
    speichere(d);
  }
  $("f-thema").addEventListener("change", (e) => { const d = folien(); d.folien.thema = e.target.value; if (d.folien.liste[0] && THEMEN.includes(d.folien.liste[0].titel)) d.folien.liste[0].titel = e.target.value; speichere(d); zeichneFolien(); });
  $("f-neu").addEventListener("click", () => { const d = folien(); if (d.folien.liste.length >= 5) { $("f-meldung").textContent = "Höchstens fünf Folien – eine kurze Präsentation ist besser!"; return; } d.folien.liste.push({ titel: "", bild: "❓", punkte: ["", "", ""] }); speichere(d); S.ton("tipp"); zeichneFolien(); });
  let vt = null;
  function zeigeFolie() {
    const f = vt.liste[vt.i];
    $("v-folie").innerHTML = `<h2>${esc(f.titel || "…")}</h2><div class="bild">${f.bild}</div><ul>${f.punkte.filter(p => p.trim()).map(p => `<li>${esc(p)}</li>`).join("")}</ul>`;
    $("v-nr").textContent = `Folie ${vt.i + 1} von ${vt.liste.length} · `; $("v-tipp").textContent = "💡 " + TIPPS[vt.i % TIPPS.length];
    $("v-weiter").textContent = vt.i + 1 < vt.liste.length ? "➡️ Weiter" : "🏁 Ende";
  }
  $("f-vortrag").addEventListener("click", () => {
    const d = folien(), leer = d.folien.liste.filter(f => !f.titel.trim() || !f.punkte.some(p => p.trim()));
    if (leer.length) { $("f-meldung").textContent = "Jede Folie braucht eine Überschrift und mindestens einen Stichpunkt."; S.ton("nein"); return; }
    vt = { liste: d.folien.liste, i: 0, start: Date.now() }; $("vortrag").hidden = false; zeigeFolie(); S.ton("tipp");
    vt.uhr = setInterval(() => { const s = Math.floor((Date.now() - vt.start) / 1000); $("v-uhr").textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }, 500);
  });
  $("v-zurueck").addEventListener("click", () => { if (vt.i > 0) { vt.i--; zeigeFolie(); } });
  $("v-weiter").addEventListener("click", () => {
    if (vt.i + 1 < vt.liste.length) { vt.i++; zeigeFolie(); return; }
    clearInterval(vt.uhr); $("vortrag").hidden = true; const d = daten(); d.vortraege++; speichere(d); if (C) C.gib("deutsch", 3); S.ton("juhu");
    $("f-meldung").textContent = `👏 Applaus! Dein Vortrag hat ${$("v-uhr").textContent} Minuten gedauert. Frag dein Publikum: Was war gut? Was kann ich besser machen?`;
    if (d.vortraege === 1) fund("vortrag", `Präsentation „${vt.liste[0].titel}“ mit ${vt.liste.length} Folien vorgetragen`, "🖼️");
  });
  $("v-ende").addEventListener("click", () => { clearInterval(vt.uhr); $("vortrag").hidden = true; });

  // ---------- Podcast ----------
  const PC = [["👋 Begrüßung", "Sag, wer du bist und wie deine Sendung heißt."], ["🎯 Das Thema", "Worum geht es heute?"], ["💡 Interessantes", "Erzähl zwei, drei spannende Dinge."], ["🙋 Verabschiedung", "Sag Tschüss und was es nächstes Mal gibt."]];
  const aufnahmen = [null, null, null, null]; let rec = null;
  function zeichnePodcast() {
    const d = daten(), darf = E && E.darfAufnehmen && E.darfAufnehmen();
    $("pc-titel").value = d.podcast.titel || "";
    $("pc-teile").innerHTML = PC.map(([t, h], i) => `<div class="podcast-teil"><b style="min-width:150px">${t}</b><span class="klein" style="flex:1">${h}</span>
      <textarea class="feld" data-skript="${i}" style="min-height:60px" placeholder="Stichpunkte (Skript)">${esc(d.podcast.skript[i] || "")}</textarea>
      ${darf ? `<button class="knopf" data-rec="${i}">${aufnahmen[i] ? "✅ Neu aufnehmen" : "🎙️ Aufnehmen"}</button>${aufnahmen[i] ? `<button class="knopf" data-hoer="${i}">🔊</button>` : ""}` : ""}</div>`).join("");
    $("pc-meldung").textContent = darf ? "" : "Aufnehmen können deine Eltern im Elternbereich erlauben. Bis dahin: Schreib das Skript und lies es jemandem vor!";
    $("pc-teile").querySelectorAll("[data-skript]").forEach(t => t.addEventListener("input", () => { const d2 = daten(); d2.podcast.skript[+t.dataset.skript] = t.value.slice(0, 300); speichere(d2); }));
    $("pc-teile").querySelectorAll("[data-rec]").forEach(b => b.addEventListener("click", () => aufnehmen(+b.dataset.rec, b)));
    $("pc-teile").querySelectorAll("[data-hoer]").forEach(b => b.addEventListener("click", () => spieleTeil(+b.dataset.hoer)));
  }
  $("pc-titel").addEventListener("input", () => { const d = daten(); d.podcast.titel = $("pc-titel").value.slice(0, 40); speichere(d); });
  async function aufnehmen(i, b) {
    if (rec) { rec.stopp(); rec = null; return; }
    S.ton("tipp"); b.textContent = "⏹️ Stopp";
    try { rec = await E.starteAufnahme(async (erg) => { rec = null; aufnahmen[i] = erg; zeichnePodcast();
      if (erg) { await E.speichere({ art: "ton", kapitel: "podcast", aufgabe: `Podcast ${daten().podcast.titel || ""}: ${PC[i][0]}`, ton: erg.ton, typ: erg.typ, dauer: erg.dauer }).catch(() => null);
        if (aufnahmen.every(Boolean)) { if (C) C.gib("deutsch", 3); fund("podcast", "Deutsch: einen eigenen Podcast in vier Teilen aufgenommen", "🎧"); } } }, 120); }
    catch (x) { rec = null; $("pc-meldung").textContent = "Das Mikrofon ist gerade aus."; zeichnePodcast(); }
  }
  function spieleTeil(i, fertig) { const a = aufnahmen[i]; if (!a) { if (fertig) fertig(); return; } const el = new Audio(URL.createObjectURL(new Blob([a.ton], { type: a.typ || "audio/mp4" }))); el.onended = () => fertig && fertig(); el.play().catch(() => fertig && fertig()); }
  $("pc-alles").addEventListener("click", () => {
    const d = daten();
    if (!aufnahmen.some(Boolean)) { // ohne Aufnahmen: das Skript vorlesen lassen
      const text = d.podcast.skript.filter(Boolean).join(". "); if (!text) { $("pc-meldung").textContent = "Schreib zuerst ein Skript oder nimm etwas auf."; return; }
      if (SP && SP.sprich) SP.sprich(`${d.podcast.titel || "Mein Podcast"}. ${text}`, "de-DE"); $("pc-meldung").textContent = "▶️ Das Tablet liest dein Skript vor."; return; }
    let i = 0; const weiter = () => { if (i < 4) spieleTeil(i++, weiter); }; weiter();
  });

  // ---------- Wiki ----------
  const START = { "Startseite": "Willkommen in unserem Wiki! Hier sammeln wir Wissen. Lies zum Beispiel über [[Igel]] oder schreib eine neue Seite.", "Igel": "Igel sind Säugetiere mit Stacheln. Sie fressen Käfer und Würmer. Im Winter halten sie [[Winterschlaf]]." };
  function wiki() { const d = daten(); if (!d.wiki) d.wiki = Object.assign({}, START); return d; }
  function zeigeWiki(name, bearbeiten) {
    const d = wiki(), seiten = Object.keys(d.wiki), text = d.wiki[name];
    $("w-seiten").innerHTML = seiten.map(s => `<button data-seite="${esc(s)}" style="${s === name ? "border-color:var(--pflaume)" : ""}">📄 ${esc(s)}</button>`).join("") + `<button id="w-neu">➕ Neue Seite</button>`;
    $("w-seiten").querySelectorAll("[data-seite]").forEach(b => b.addEventListener("click", () => { S.ton("tipp"); zeigeWiki(b.dataset.seite); }));
    $("w-neu").addEventListener("click", () => { const n = prompt("Wie soll die neue Seite heißen?"); if (n && n.trim()) zeigeWiki(n.trim().slice(0, 30), true); });
    if (bearbeiten || text === undefined) {
      $("w-ansicht").innerHTML = `<h2 style="margin:6px 0">📄 ${esc(name)}</h2>${text === undefined ? `<p class="klein">Diese Seite gibt es noch nicht. Schreib sie!</p>` : ""}
        <textarea class="feld" id="w-text" maxlength="800">${esc(text || "")}</textarea><div class="leiste" style="margin-top:6px"><button id="w-sichern">💾 Speichern</button></div>`;
      $("w-sichern").addEventListener("click", () => {
        const t = $("w-text").value.trim(); if (t.length < 10) { $("w-meldung").textContent = "Schreib mindestens einen Satz."; return; }
        const d2 = wiki(); if (!(name in d2.wiki) && Object.keys(d2.wiki).length >= 12) { $("w-meldung").textContent = "Das Wiki ist voll (12 Seiten)."; return; }
        d2.wiki[name] = t.slice(0, 800); speichere(d2); S.ton("juhu"); $("w-meldung").textContent = "💾 Gespeichert.";
        const eigene = Object.keys(d2.wiki).filter(s => !(s in START)).length;
        if (eigene === 1 && /\[\[.+?\]\]/.test(t)) { if (C) C.gib("deutsch", 2); fund("wiki", "Deutsch: eine Wiki-Seite mit Link geschrieben", "📖"); }
        zeigeWiki(name);
      });
      return;
    }
    $("w-ansicht").innerHTML = `<h2 style="margin:6px 0">📄 ${esc(name)}</h2><p class="wiki-text" style="font-size:1.2rem;line-height:1.6">${esc(text).replace(/\[\[(.+?)\]\]/g, (m, z) => `<a href="#" data-link="${z}">${z}${d.wiki[z] === undefined ? " ✳️" : ""}</a>`)}</p><div class="leiste"><button id="w-bearbeiten">✏️ Bearbeiten</button></div>`;
    $("w-ansicht").querySelectorAll("[data-link]").forEach(a => a.addEventListener("click", (e) => { e.preventDefault(); S.ton("tipp"); zeigeWiki(a.dataset.link); }));
    $("w-bearbeiten").addEventListener("click", () => zeigeWiki(name, true));
  }

  neuGestalten();
  const t0 = new URLSearchParams(location.search).get("teil"); zeigeTeil(TEILE.includes(t0) ? t0 : "gestalten");
  window.__praesentieren = { zeigeTeil, pruefe, pruefeGestaltung, wortzahl: () => { baueWoerter(); return wortSet.size; }, zeigeWiki, daten };
})();
