(function () {
  const S = window.Spielwelt, C = window.Charakter;
  const $ = (id) => document.getElementById(id);
  const inhalt = $("inhalt");
  const SITZUNG = S.vorsilbe + "eltern";
  const hash = (t) => { let h = 5381; for (const c of "pin:" + t) h = ((h << 5) + h + c.charCodeAt(0)) >>> 0; return h.toString(36); };
  const eltern = () => S.lade("eltern") || {};

  // ---------- PIN ----------
  function pinSeite() {
    const neu = !S.pin();
    inhalt.innerHTML = `<div class="karte pin">
      ${neu && !S.eingerichtet() ? `<p style="font-size:2.6rem;margin:0">👋</p><h2>Willkommen!</h2><p>Diese App richtet ein Erwachsener ein. Das dauert zwei Minuten: erst eine PIN für den Elternbereich, dann ein paar Angaben zum Kind.</p>` : `<h2>${neu ? "PIN festlegen" : "PIN eingeben"}</h2>`}
      <p>${neu ? "Lege eine 4-stellige PIN fest. Damit bleibt dieser Bereich für Erwachsene." : "Dieser Bereich ist für Erwachsene."}</p>
      <input id="pin1" type="password" inputmode="numeric" maxlength="4" autocomplete="off" aria-label="PIN">
      ${neu ? `<input id="pin2" type="password" inputmode="numeric" maxlength="4" autocomplete="off" aria-label="PIN wiederholen" placeholder="nochmal">` : ""}
      <p class="fehler" id="pin-fehler"></p>
      <button class="knopf haupt" id="pin-ok">${neu ? "PIN speichern" : "Öffnen"}</button>
      ${neu ? "" : `<button class="knopf" id="pin-vergessen" style="box-shadow:none;background:transparent">PIN vergessen?</button>`}
    </div>`;
    const f = $("pin-fehler");
    setTimeout(() => { const x = $("pin1"); if (x) x.focus(); }, 50);
    $("pin-ok").addEventListener("click", () => {
      const p1 = $("pin1").value.trim();
      if (!/^\d{4}$/.test(p1)) { f.textContent = "Bitte genau 4 Ziffern eingeben."; return; }
      if (neu) {
        if ($("pin2").value.trim() !== p1) { f.textContent = "Die beiden PINs sind verschieden."; return; }
        S.setzePin(hash(p1));
      } else if (S.pin() !== hash(p1)) { f.textContent = "Die PIN stimmt nicht."; $("pin1").value = ""; return; }
      sessionStorage.setItem(SITZUNG, "1");
      if (S.eingerichtet()) uebersicht(); else einrichtung(false);
    });
    const v = $("pin-vergessen");
    if (v) v.addEventListener("click", () => {
      const a = prompt("Zum Zurücksetzen: Wie viel ist 17 × 13?");
      if (a && a.trim() === "221") { S.setzePin(null); pinSeite(); }
      else if (a !== null) f.textContent = "Leider falsch.";
    });
  }

  // ---------- Ersteinrichtung und Kind-Einstellungen ----------
  const SPRACHEN = [["", "Keine (nur Deutsch)"]].concat(S.SPRACHEN.map(x => [x.code, `${x.name} – ${x.eigen}${x.fertig ? "" : " (in Arbeit)"}`, !x.fertig]));
  const ANSPRACHE = [["w", "Mädchen"], ["m", "Junge"], ["n", "Keine Angabe"]];
  const option = (liste, wert) => liste.map(([v, t, aus]) => `<option value="${v}"${String(v) === String(wert) ? " selected" : ""}${aus ? " disabled" : ""}>${t}</option>`).join("");
  // Empfehlung zur freizeitlichen Bildschirmzeit (DGKJ, AWMF-S2k-Leitlinie zur Prävention dysregulierten Bildschirmmediengebrauchs)
  function empfehlung(alter) {
    if (alter < 6) return "3–6 Jahre: höchstens 30 Minuten an einzelnen Tagen, immer mit einem Erwachsenen, nicht täglich.";
    if (alter < 9) return "6–9 Jahre: höchstens 30–45 Minuten freizeitliche Bildschirmzeit an einzelnen Tagen (außerhalb von Hausaufgaben).";
    if (alter < 12) return "9–12 Jahre: höchstens 45–60 Minuten freizeitliche Bildschirmzeit.";
    return "Ab 12 Jahren: etwa 1–2 Stunden freizeitliche Bildschirmzeit, mit eigenen Regeln.";
  }
  function einrichtung(bearbeiten) {
    const k = S.kind();
    inhalt.innerHTML = `<div class="karte einricht">
      <h2>${bearbeiten ? "Kind und Einstellungen" : "Angaben zum Kind"}</h2>
      <p class="klein">Alles bleibt nur auf diesem Tablet.</p>
      <label>Vorname (so wird das Kind begrüßt)<input id="e-name" maxlength="20" autocomplete="off" autocapitalize="words" value="${(S.profil.name || "").replace(/"/g, "&quot;")}"></label>
      <label>Geburtsdatum (für das Alter und ein Geburtstagsgeschenk auf der Insel)<input type="date" id="e-geburt" value="${k.geburt || ""}" min="2008-01-01" max="${new Date(window.__jetzt || Date.now()).toISOString().slice(0, 10)}"></label>
      <div class="zwei">
        <label>Alter<select id="e-alter">${option([4, 5, 6, 7, 8, 9, 10, 11].map(n => [n, n + " Jahre"]), k.alter)}</select></label>
        <label>Stufe<select id="e-stufe">${option(S.STUFEN.map(x => [x.code, x.name]), k.stufe)}</select></label>
      </div>
      <p class="hinweis" id="e-stufe-hinweis" hidden></p>
      <div class="zwei">
        <label>Bundesland (Lehrplan)<select id="e-land">${option(S.LAENDER.map(x => [x.code, x.name]), k.land)}</select></label>
        <label>Ansprache in der App<select id="e-geschlecht">${option(ANSPRACHE, k.geschlecht)}</select></label>
      </div>
      <p class="hinweis" id="e-land-hinweis" hidden></p>
      <div class="zwei">
        <label>Muttersprache (zu Hause)<select id="e-mutter">${option(S.MUTTERSPRACHEN, k.muttersprache)}</select></label>
        <label>Deutsch-Kenntnisse<select id="e-deutsch">${option(S.DEUTSCHSTAND.map(x => [x.code, x.name]), k.deutschstand)}</select></label>
      </div>
      <p class="klein" id="e-deutsch-text" style="margin-top:-8px"></p>
      <label>Hilfesprache in der App<select id="e-sprache">${option(SPRACHEN, k.hilfesprache)}</select></label>
      <p class="klein" id="e-sprache-text" style="margin-top:-8px"></p>
      <label>Ort für das Wetter auf der Insel (optional)<input id="e-ort" maxlength="40" autocomplete="off" placeholder="z. B. Dresden" value="${((k.ort || {}).name || "").replace(/"/g, "&quot;")}"></label>
      <p class="klein" style="margin-top:-8px">Nur der Ortsname, kein GPS. Die Insel fragt damit das Wetter bei Open-Meteo ab.</p>
      <p class="hinweis" id="e-empf"></p>
      <p class="fehler" id="e-fehler"></p>
      <div class="knoepfe"><button class="knopf haupt" id="e-ok">${bearbeiten ? "Speichern" : "Fertig – los geht's"}</button>${bearbeiten ? `<button class="knopf" id="e-zurueck">Abbrechen</button>` : ""}</div>
    </div>`;
    const empf = () => { $("e-empf").innerHTML = `<b>Empfehlung der Kinderärzte (DGKJ):</b> ${empfehlung(+$("e-alter").value)} Wichtiger als die Minuten: Bewegung, freies Spiel, Freunde, genug Schlaf und bildschirmfreie Zeiten, z. B. beim Essen und vor dem Schlafen.`; };
    $("e-alter").addEventListener("change", empf);
    // Geburtsdatum bestimmt das Alter (Auswahl dann gesperrt)
    const geburtAlter = () => { const g = $("e-geburt").value, ok = S.geburtOk(g); $("e-alter").disabled = ok;
      if (ok) { const a = Math.max(4, Math.min(11, S.alterAus(g))); $("e-alter").value = String(a); } empf(); };
    $("e-geburt").addEventListener("change", geburtAlter); $("e-geburt").addEventListener("input", geburtAlter); geburtAlter();
    // Ehrliche Hinweise und kurze Erklärungen zu Stufe, Land, Deutschstand und Hilfesprache
    const erklaere = () => {
      const st = S.STUFEN.find(x => x.code === $("e-stufe").value), la = S.LAENDER.find(x => x.code === $("e-land").value);
      const sh = $("e-stufe-hinweis"); sh.hidden = !st.wenig;
      sh.textContent = st.code === "vs" ? "Für die Vorschule gibt es den Vorschul-Rucksack (Spiele nach den Bildungsbereichen des Sächsischen Bildungsplans) und den Matheweg „Klasse 1 und Vorschule“; dazu die leichten Aufgaben der 1. Klasse, alles mit Bildern und Ton."
        : "Für den Übergang in Klasse 5 gibt es einen eigenen Matheweg („Übergang 5“), Fachbegriffe und Lesestrategien in Deutsch sowie „Lernen lernen“ und „Neue Schule“ bei Eule Ella. Alles andere übt das Kind mit den Aufgaben der 4. Klasse. Die App bewertet nicht, welche Schulform passt.";
      const lh = $("e-land-hinweis"); lh.hidden = !!la.lehrplan;
      lh.textContent = `Für ${la.name} zeigt die App vorerst die gemeinsamen Bildungsstandards (KMK) und den sächsischen Lehrplan als Beispiel. Die Besonderheiten von ${la.name} folgen.`;
      $("e-deutsch-text").textContent = S.DEUTSCHSTAND.find(x => x.code === $("e-deutsch").value).text;
      const m = $("e-mutter").value, hilfe = S.SPRACHEN.find(x => x.code === m);
      $("e-sprache-text").textContent = m === "de" ? "Ohne Hilfesprache ist alles nur auf Deutsch."
        : hilfe && hilfe.fertig ? "Hilfetexte und Vorlesen in der Muttersprache sind möglich."
        : "Für diese Sprache gibt es noch keine geprüften Hilfetexte. Die App bleibt auf Deutsch, mit Bildern und Vorlesen.";
    };
    ["e-stufe", "e-land", "e-deutsch"].forEach(id => $(id).addEventListener("change", erklaere));
    // Muttersprache gewählt → passende fertige Hilfesprache vorschlagen; Deutsch → keine Hilfesprache, gutes Deutsch
    $("e-mutter").addEventListener("change", () => {
      const m = $("e-mutter").value, hilfe = S.SPRACHEN.find(x => x.code === m && x.fertig);
      if (hilfe) $("e-sprache").value = hilfe.code; else if (m === "de") { $("e-sprache").value = ""; $("e-deutsch").value = "gut"; }
      erklaere();
    });
    erklaere();
    setTimeout(() => { const x = $("e-name"); if (x) x.focus(); }, 50);
    $("e-ok").addEventListener("click", async () => {
      const n = $("e-name").value.trim();
      if (!n) { $("e-fehler").textContent = "Bitte einen Vornamen eingeben."; $("e-name").focus(); return; }
      const ortName = $("e-ort").value.trim(), altOrt = S.kind().ort;
      let ort = ortName ? (altOrt && altOrt.name === ortName ? altOrt : { name: ortName }) : null;
      if (ort && ort.lat == null) {
        $("e-ok").disabled = true; $("e-fehler").textContent = "Suche den Ort …";
        ort = await sucheOrt(ortName) || { name: ortName };
        $("e-ok").disabled = false; $("e-fehler").textContent = "";
        S.meldung(ort.lat != null ? `Wetter-Ort: ${ort.name}${ort.region ? ", " + ort.region : ""}` : "Ort nicht gefunden oder offline – die Insel nimmt das Jahreszeiten-Wetter.");
      }
      S.setzeName(n);
      S.speichere("eltern", Object.assign(eltern(), { eingerichtet: true, kind: {
        ...(S.geburtOk($("e-geburt").value) ? { geburt: $("e-geburt").value } : {}),
        alter: +$("e-alter").value, stufe: $("e-stufe").value, klasse: S.STUFEN.find(x => x.code === $("e-stufe").value).klasse, geschlecht: $("e-geschlecht").value,
        hilfesprache: $("e-sprache").value, muttersprache: $("e-mutter").value, deutschstand: $("e-deutsch").value, land: $("e-land").value, ort } }));
      if (bearbeiten) { S.meldung("Gespeichert."); uebersicht(); } else location.href = "../../";
    });
    if (bearbeiten) $("e-zurueck").addEventListener("click", uebersicht);
  }

  // Ort für das Wetter (Open-Meteo Geocoding, ohne GPS)
  async function sucheOrt(name) {
    try {
      const st = new AbortController(); setTimeout(() => st.abort(), 5000);
      const a = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=de&format=json`, { signal: st.signal });
      const j = await a.json(), x = j.results && j.results[0];
      return x ? { name: x.name, region: x.admin1 || x.country || "", lat: +x.latitude.toFixed(3), lon: +x.longitude.toFixed(3) } : null;
    } catch (e) { return null; }
  }

  // App neu laden: Offline-Speicher dieser Version leeren, Spielstand bleibt erhalten
  async function neuLaden() {
    try {
      const vorsilbe = S.umgebung === "prod" ? "spielwelt-" : S.umgebung + "-";
      if (window.caches) for (const k of await caches.keys()) if (k.startsWith(vorsilbe)) await caches.delete(k);
      if (navigator.serviceWorker) for (const r of await navigator.serviceWorker.getRegistrations()) if (location.href.startsWith(r.scope)) await r.unregister();
    } catch (e) { /* trotzdem neu laden */ }
    location.reload();
  }

  // ---------- Lehrplan: Was übt die App? ----------
  // NA-50: Können des Kindes je Lernbereich (Durchschnitt über dessen Lernziele), nur wenn schon geübt wurde
  function koennenZeile(lz) {
    const K = window.Koennen; if (!K || !lz) return "";
    const st = K.standListe(lz); if (st === null) return "";
    return `<br><span class="lp-koennen" data-stand="${st}">Können: ${"●".repeat(st)}${"○".repeat(4 - st)} ${K.NAMEN[st]}</span>`;
  }
  // Sachsen in voller Tiefe: Inhaltspunkte eines Lernbereichs zum Aufklappen (sachsen-punkte.js)
  const PUNKT_ZEICHEN = { ja: "✅", teil: "🟡", nein: "⭕", aussen: "🌍" };
  function punkteHtml(punkte) {
    if (!punkte || !punkte.length) return "";
    const n = (a) => punkte.filter(p => p.abdeckung === a).length;
    return `<details class="lp-punkte"><summary>${punkte.length} Inhaltspunkte: ${n("ja")} geübt, ${n("teil")} teilweise, ${n("nein")} fehlen${n("aussen") ? `, ${n("aussen")} draußen/auf Papier` : ""}</summary><ul>` +
      punkte.map(p => `<li data-punkt="${p.id}"><span class="zeichen">${PUNKT_ZEICHEN[p.abdeckung]}</span>${p.text} <span class="klein">(Kl. ${p.kl})</span></li>`).join("") + `</ul></details>`;
  }
  function lehrplanKarte(mathe) {
    const L = window.LEHRPLAN; if (!L) return "";
    // Nur Sachsen ist ausgearbeitet; andere Länder sehen vorerst Sachsen als Beispiel (ehrlicher Hinweis)
    const k = S.kind(), la = S.land(), land = la.lehrplan && L.laender[la.lehrplan] ? la.lehrplan : "sachsen", lname = (L.laender[land] || {}).name || land;
    const stufe = S.stufe();
    const zeichen = { ja: "✅", teil: "◐", nein: "○", aussen: "🌍" }, worte = { ja: "gut abgedeckt", teil: "teilweise", nein: "noch nicht", aussen: "vor allem draußen" };
    const k2 = mathe.k2 || {};
    const fortschritt = (app) => {
      // Sterne aus allen Mathewegen (Kl. 1–4, Übergang 5) zählen, nicht nur aus Kl. 2
      const st = app.filter(a => a.startsWith("mathe:")).map(a => a.slice(6)), geschafft = (id) => ["k1", "k2", "k3", "k4", "k5"].some(w => (mathe[w] || {})[id]);
      const en = app.filter(a => a.startsWith("englisch:")).map(a => a.slice(9)), enD = (S.lade("englisch") || {}).lektionen || {};
      const so = app.filter(a => a.startsWith("sorbisch:")).map(a => a.slice(9)), soD = (S.lade("sorbisch") || {}).lektionen || {};
      // Schuljahr Deutsch: Werkstatt-Kapitel des Lernbereichs (aus den Inhaltspunkten), geschafft = mindestens ein Stern
      const wk = [...new Set(app.filter(a => a.startsWith("werkstatt:")).map(a => a.slice(10)))], wkD = (S.lade("deutsch") || {}).kapitel || {};
      const su = [...new Set(app.filter(a => a.startsWith("sachkunde:")).map(a => a.slice(10)))], suD = (S.lade("sachkunde") || {}).themen || {};
      return (st.length ? ` · Matheweg: ${st.filter(geschafft).length} von ${st.length} Stationen geschafft` : "") +
        (wk.length ? ` · Werkstatt: <span class="lp-werkstatt">${wk.filter(id => wkD[id]).length} von ${wk.length}</span> Kapiteln geschafft` : "") +
        (su.length ? ` · Sachthemen: <span class="lp-sachthemen">${su.filter(id => suD[id]).length} von ${su.length}</span> entdeckt` : "") +
        (en.length ? ` · Englisch: ${en.filter(id => enD[id]).length} von ${en.length} Lektionen geschafft` : "") +
        (so.length ? ` · Sorbisch: ${so.filter(id => soD[id]).length} von ${so.length} Lektionen geschafft` : "");
    };
    let n = { ja: 0, teil: 0, nein: 0, aussen: 0 };
    // Ethik oder Religion: nur das Fach, das das Kind in der Schule hat (Eltern-Wahl eltern.ethik.unterricht)
    const unterricht = ((S.lade("eltern") || {}).ethik || {}).unterricht, nurEines = { ethik: !["ev", "ka"].includes(unterricht), evreligion: unterricht === "ev", kareligion: unterricht === "ka",
      sorbisch: !!(((S.lade("eltern") || {}).sorbisch || {}).an) && (((S.lade("eltern") || {}).sorbisch || {}).art) !== "mutter",   // Sorbisch nur nach Eltern-Wahl
      sorbischmutter: !!(((S.lade("eltern") || {}).sorbisch || {}).an) && (((S.lade("eltern") || {}).sorbisch || {}).art) === "mutter" };
    const faecher = Object.keys(L.laender[land].faecher).filter(f => !(f in nurEines) || nurEines[f]).filter(f => L.fuer(land, f, k.klasse).length).map(f => {
      const fach = L.laender[land].faecher[f], lb = L.fuer(land, f, k.klasse);
      lb.forEach(x => n[x.abdeckung]++);
      // Je Fach eingeklappt (30.10.2026): Name mit Kurzbilanz, Lernbereiche erst nach Antippen
      const bilanz = ["ja", "teil", "nein", "aussen"].map(z => { const k = lb.filter(x => x.abdeckung === z).length; return k ? `${zeichen[z]} ${k}` : ""; }).filter(Boolean).join(" · ");
      return `<h3 class="lp-fach lp-zu" role="button" tabindex="0" aria-expanded="false">${fach.name} <span class="lp-bilanz">${bilanz}</span> <span class="klein" title="${fach.stand.replace(/"/g, "&quot;")}">(${fach.stand.split(" (")[0].split(";")[0]})</span></h3><ul class="lp-liste" hidden>${lb.map(x =>
        `<li><span class="zeichen">${zeichen[x.abdeckung]}</span><b>${x.titel}</b><span class="klein">${x.inhalte.join(" · ")}${fortschritt(x.app.filter(a => !a.startsWith("werkstatt:") && !(x.punkte && a.startsWith("sachkunde:"))).concat((x.punkte || []).flatMap(p => p.app).filter(a => a.startsWith("werkstatt:") || a.startsWith("sachkunde:"))))}${x.hinweis ? `<br><i>${x.hinweis}</i>` : ""}${punkteHtml(x.punkte)}${koennenZeile(x.lz)}${L.errechnet ? `<br><span class="lp-errechnet" data-lz="${(x.lz || []).join(" ")}">Nach Lernzielen errechnet: ${zeichen[L.errechnet(x)]} ${worte[L.errechnet(x)]}</span>` : ""}</span></li>`).join("")}</ul>`;
    }).join("");
    return `<div class="karte">
      <h2>📘 Was übt die App? (Lehrplan ${lname}, ${k.klasse}. Klasse)</h2>
      ${la.lehrplan ? "" : `<p class="hinweis">Für ${la.name} ist der Lehrplan noch nicht ausgearbeitet. Gezeigt wird der sächsische Lehrplan als Beispiel; er folgt in großen Teilen den gemeinsamen KMK-Bildungsstandards.</p>`}
      ${stufe.wenig ? `<p class="hinweis">Stufe „${stufe.name}“: Gezeigt wird der Lehrplan der ${k.klasse}. Klasse${stufe.code === "5" ? "; dazu kommen eigene Übergangs-Inhalte (Matheweg „Übergang 5“, Fachbegriffe, Lesestrategien, Lernen lernen)" : stufe.code === "vs" ? "; unten steht dazu der Sächsische Bildungsplan für die Vorschule mit dem Vorschul-Rucksack" : ", bis eigene Inhalte da sind"}.</p>` : ""}
      <p>${n.ja} Lernbereiche gut abgedeckt, ${n.teil} teilweise, ${n.nein} noch nicht${n.aussen ? `, ${n.aussen} vor allem draußen (Sport, Bauen, Singen – dazu gibt es Echte-Welt-Aufgaben und Wissen in der App)` : ""}. Die App ergänzt den Unterricht, sie ersetzt ihn nicht. Was gerade in der Schule dran ist, weiß die Lehrkraft am besten.</p>
      <p class="klein">✅ gut abgedeckt · ◐ teilweise · ○ noch nicht in der App · 🌍 gehört nach draußen oder aufs Papier (dazu gibt es Echte-Welt-Aufgaben). In den aufklappbaren Inhaltspunkten: ✅ geübt · 🟡 teilweise · ⭕ fehlt noch.</p>
      ${L.zaehle ? (() => { const e = L.zaehle(land, k.klasse).errechnet; return `<p class="klein">Zum Vergleich, aus den Lernzielen der Inhalte errechnet (gut = mindestens drei Inhalte mit zusammen 30 Aufgaben und Wiederholung in der Lernkartei): ${e.ja} gut, ${e.teil} teilweise, ${e.nein} noch nicht.</p>`; })() : ""}
      ${faecher}
      ${stufe.code === "vs" && L.laender[land].vorschule ? (() => { const V = L.laender[land].vorschule, vd = (S.lade("vorschule") || {}).fertig || {};
        const alle = (window.VORSCHULE || []).length, fertig = (window.VORSCHULE || []).filter(a => vd[a.id]).length;
        return `<h3 class="lp-fach" id="lp-vorschule">🎒 Vorschule <span class="klein">(${V.stand})</span></h3><p class="klein">Was Kinder im letzten Kita-Jahr nach dem Sächsischen Bildungsplan erleben und was die App dazu anbietet: Vorschul-Rucksack (<span id="vs-fortschritt">${fertig} von ${alle}</span> Spielen geschafft), Matheweg „Klasse 1 und Vorschule“, Laute und Buchstaben, Atelier, Gefühle und Echte-Welt-Aufgaben. Vieles gehört nach draußen und ins Spiel mit anderen Kindern.</p>` +
          `<ul class="lp-liste">${V.bereiche.map(l => { const z = l.punkte.some(p => p.abdeckung === "teil" || p.abdeckung === "nein") ? "teil" : l.punkte.filter(p => p.abdeckung === "aussen").length >= l.punkte.filter(p => p.abdeckung === "ja").length ? "aussen" : "ja";
            return `<li><span class="zeichen">${zeichen[z]}</span><b>${l.titel}</b>${punkteHtml(l.punkte)}</li>`; }).join("")}</ul>`; })() : ""}
      ${stufe.code === "5" && L.laender[land].uebergang ? (() => { const U = L.laender[land].uebergang, sa = (((S.lade("eltern") || {}).mathe || {}).schulart) === "gy" ? "gy" : "os", A = U.schularten[sa];
        return `<h3 class="lp-fach" id="lp-uebergang" data-schulart="${sa}">🎒 Klasse 5 – Mathe am ${A.name} <span class="klein">(${A.quelle})</span></h3><p class="klein">Was die 5. Klasse ${sa === "gy" ? "am Gymnasium" : "an der Oberschule"} lernt und was der Matheweg „Übergang 5“ davon schon übt. Schulart umstellen: Karte „Mathe wie in der Schule“.</p>` +
          `<ul class="lp-liste">${A.lb.map(l => { const z = l.punkte.some(p => p.abdeckung === "teil" || p.abdeckung === "nein") ? "teil" : l.punkte.filter(p => p.abdeckung === "aussen").length >= l.punkte.filter(p => p.abdeckung === "ja").length ? "aussen" : "ja";
            return `<li><span class="zeichen">${zeichen[z]}</span><b>${l.nr === 9 ? "" : `LB ${l.nr}: `}${l.titel}</b>${punkteHtml(l.punkte)}</li>`; }).join("")}</ul>`; })() : ""}
      <p class="klein">Quelle: Lehrpläne Grundschule des Freistaates Sachsen (schulportal.sachsen.de), KMK-Bildungsstandards Primarbereich.</p>
    </div>`;
  }

  // ---------- Wochenbericht ----------
  const ALLTAG = {
    geld: "beim Einkaufen mit echtem Geld bezahlen und Wechselgeld nachzählen lassen",
    uhr: "im Alltag die Uhr lesen lassen („Wie spät ist es? Wann gibt es Essen?“)",
    mal1: "Einmaleins-Reihen beim Autofahren oder Treppensteigen aufsagen", mal2: "Einmaleins-Reihen beim Autofahren oder Treppensteigen aufsagen", mal3: "Einmaleins-Reihen beim Autofahren oder Treppensteigen aufsagen",
    doppelt: "beim Backen Mengen verdoppeln oder halbieren", geteilt: "Süßigkeiten oder Spielkarten gerecht aufteilen lassen",
    vergleich: "Preise im Prospekt vergleichen: Was ist teurer?", zehner: "mit Münzen oder Streichhölzern Zehnerbündel legen"
  };
  function wochenbericht(schwach, mathe) {
    if (!window.Zeit || !window.Zeit.verlauf) return "";
    const v = window.Zeit.verlauf(), tage = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      tage.push(Object.assign({ tag: iso, lern: 0, aufgaben: 0, spiel: 0, name: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"][d.getDay()] }, v.find(x => x.tag === iso) || {}));
    }
    const summe = (k) => tage.reduce((n, t) => n + (t[k] || 0), 0), lernTage = tage.filter(t => t.lern > 0 || t.aufgaben > 0).length;
    const max = Math.max(10, ...tage.map(t => Math.max(t.lern, t.spiel)));
    const faelligN = (mathe.fehler || []).filter(f => !f.faellig || f.faellig <= heuteIso()).length +
      (window.Lernkartei ? ["deutsch", "sachkunde", "englisch", "sorbisch"].reduce((n, f) => n + Lernkartei.anzahlFaellig(f), 0) : 0);
    const tipps = [];
    if (lernTage < 4) tipps.push("Lieber jeden Tag 10 Minuten als einmal lange: Eine feste Lernzeit hilft, z. B. direkt nach dem Mittagessen.");
    schwach.slice(0, 2).forEach(o => tipps.push(`Übt gemeinsam „${o.s.name}“: ${ALLTAG[o.s.id] || "im Alltag kleine Rechenaufgaben stellen"}.`));
    if (summe("spiel") > 0 && tage.filter(t => t.spiel >= Zeit.regeln().maxSpiel).length >= 3) tipps.push("Die Spielzeit wird oft ganz genutzt. Schönes Ritual danach: gemeinsam etwas draußen unternehmen.");
    if (!tipps.length) tipps.push(lernTage ? "Eine richtig gute Woche! Fragt, was am meisten Spaß gemacht hat – Lob für die Mühe wirkt am besten." : "Diese Woche wurde noch nicht gelernt. Gemeinsam anfangen hilft: einfach eine Runde Mathe zusammen machen.");
    return `<div class="karte">
      <h2>📅 Wochenbericht (letzte 7 Tage)</h2>
      <div class="zahlen">
        <div class="zahl"><b>${summe("lern")} min</b><span>gelernt an ${lernTage} von 7 Tagen</span></div>
        <div class="zahl"><b>${summe("aufgaben")}</b><span>Aufgaben richtig gelöst</span></div>
        <div class="zahl"><b>${summe("spiel")} min</b><span>gespielt</span></div>
        <div class="zahl"><b>${faelligN}</b><span>Wiederholungen heute dran${mathe.gelernt ? ` · ${mathe.gelernt} gelernt` : ""}</span></div>
      </div>
      <div class="woche-balken" aria-label="Lern- und Spielminuten pro Tag">${tage.map(t => `<div class="tag-balken"><div class="saeulen"><span class="lern" style="height:${Math.round(t.lern / max * 100)}%" title="${t.lern} min gelernt"></span><span class="spiel" style="height:${Math.round(t.spiel / max * 100)}%" title="${t.spiel} min gespielt"></span></div><small>${t.name}</small></div>`).join("")}</div>
      <p class="klein"><span class="punkt lern"></span> Lernen <span class="punkt spiel"></span> Spielen (Minuten)</p>
      ${lernfundeHtml()}
      ${gemeinsamHtml()}
      ${gefuehleHtml()}
      <h3 style="margin:10px 0 6px;font-size:1.05rem">Tipp für diese Woche</h3>
      <ul class="liste">${tipps.map(t => `<li>${t}</li>`).join("")}</ul>
    </div>`;
  }

  // Konkrete Lernfunde der Woche (shared/lernfunde.js) – als Gesprächsanlass, nicht als Prüfung
  function lernfundeHtml() {
    if (!window.Lernfunde) return "";
    const f = Lernfunde.letzteTage(7); if (!f.length) return "";
    const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const tagName = (iso) => { const [y, m, t] = iso.split("-").map(Number); return ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"][new Date(y, m - 1, t).getDay()]; };
    const n = f.filter(x => x.a === "gemeistert").length;
    return `<h3 style="margin:10px 0 6px;font-size:1.05rem">🌱 Neu gelernt (${f.length})</h3>
      <ul class="liste">${f.slice(0, 12).map(x => `<li><b>${tagName(x.datum)}</b> ${x.e} ${esc(x.t)}</li>`).join("")}</ul>
      <p class="klein">${n ? `${n}× hat eine früher schwere Matheaufgabe jetzt sicher geklappt. ` : ""}Fragt nach einem Punkt: „Erklär mir das mal!“ – das Erklären festigt das Gelernte.</p>`;
  }

  // Gemeinsame Momente der Woche (Erklären, Kopfrechen-Duell) – Eltern als Mitspieler
  // Gefühle (nur wenn das Kind es erlaubt) und Bewegungs-Minuten der Woche
  function gefuehleHtml() {
    const esc2 = (t) => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const d = S.lade("gefuehle"); if (!d) return "";
    const tage = [], E = { froh: "😊", ruhig: "😌", muede: "🥱", traurig: "😢", wuetend: "😠", aengstlich: "😟", aufgeregt: "🤩" };
    for (let i = 6; i >= 0; i--) { const t = new Date(); t.setDate(t.getDate() - i); tage.push(`${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`); }
    const bew = tage.reduce((n, t) => n + ((d.bewegung || {})[t] || 0), 0);
    const gef = d.teilen ? tage.filter(t => (d.tage || {})[t]).map(t => `${E[d.tage[t]] || "❔"} ${t.slice(8)}.${t.slice(5, 7)}.`).join(" · ") : "";
    return `<h3 style="margin:10px 0 6px;font-size:1.05rem">💗 Gefühle und Bewegung</h3>
      <p class="klein">🤸 ${bew} Bewegungs-Minute${bew === 1 ? "" : "n"} diese Woche.${d.ruhe ? ` 🌬️ ${d.ruhe}-mal eine Ruhe-Übung gemacht (insgesamt).` : ""}</p>
      ${(d.impulse || []).length ? `<p class="klein">🍽️ Gesprächsimpuls aus „Miteinander“ (${esc2(d.impulse[d.impulse.length - 1].g)}): ${esc2(d.impulse[d.impulse.length - 1].t)}</p>` : ""}
      ${d.teilen ? `<p class="klein">Gefühls-Barometer (vom Kind freigegeben): ${gef || "diese Woche noch nichts eingetragen"}</p>` : `<p class="klein">Das Gefühls-Barometer bleibt privat, solange das Kind es nicht freigibt. Fragt lieber direkt: „Wie war dein Tag?“</p>`}`;
  }
  function gemeinsamHtml() {
    if (!window.Familie) return "";
    const m = Familie.letzteTage(7), esc = (t) => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const tipp = "Kurze gemeinsame Momente (1–3 Minuten) wirken mehr als lange Sitzungen: „Erklär mir das mal!“ unter „Meine Ecke → Heute neu“ oder ein Kopfrechen-Duell.";
    if (!m.length) return `<h3 style="margin:10px 0 6px;font-size:1.05rem">🤝 Gemeinsam</h3><p class="klein">Diese Woche noch keine gemeinsamen Momente. ${tipp}</p>`;
    return `<h3 style="margin:10px 0 6px;font-size:1.05rem">🤝 Gemeinsam (${m.length})</h3>
      <ul class="liste">${m.slice(-8).reverse().map(x => `<li>${(Familie.ART[x.a] || ["❤️"])[0]} ${esc(x.t)}</li>`).join("")}</ul>`;
  }

  // ---------- Zeit-Regeln ----------
  const Z = window.Zeit;
  const minText = (sek) => `${Math.round(sek / 60)} min`;
  function zeitKarte() {
    if (!Z) return "";
    const r = Z.regeln(), st = Z.status(), e = Z.empfehlung(S.kind().alter);
    const zahl = (id, wert, min, max, schritt = 1) => `<input id="${id}" type="number" inputmode="numeric" min="${min}" max="${max}" step="${schritt}" value="${wert}">`;
    return `<div class="karte">
      <h2>⏰ Erst lernen, dann spielen</h2>
      <p><b>Heute:</b> ${minText(st.lernSek)} gelernt · ${st.aufgaben} Aufgaben richtig · ${minText(st.spielSek)} gespielt (erlaubt: ${minText(st.erlaubt)})${st.ruhe ? " · gerade Ruhezeit" : ""}</p>
      <div class="noch-zeile">
        <label>Heute noch spielen dürfen (min)<input id="z-noch" type="number" inputmode="numeric" min="0" max="240" step="5" value="${Math.round(st.rest / 60)}"></label>
        <button class="knopf haupt" id="z-noch-ok">Festlegen</button>
      </div>
      <p class="klein">Gilt sofort, auch wenn heute noch nicht gelernt wurde. 0 = für heute Schluss. Das Kind sieht beim nächsten Öffnen eine kurze Ansage. Die Ruhezeit gilt weiter.</p>
      <label class="schalter-z"><input type="checkbox" id="z-an" ${r.an ? "checked" : ""}> Zeit-Regeln einschalten</label>
      <div class="zeit-raster">
        <label>Lernzeit pro Block (min)${zahl("z-lern", r.lernMin, 1, 60)}</label>
        <label>… oder richtige Aufgaben${zahl("z-aufg", r.lernAufgaben, 1, 50)}</label>
        <label>Spielzeit pro Block (min)${zahl("z-spiel", r.spielMin, 1, 120)}</label>
        <label>Höchstens Spielzeit pro Tag (min)${zahl("z-max", r.maxSpiel, 0, 240, 5)}</label>
        <label>Ruhezeit ab<input id="z-von" type="time" value="${r.ruheVon}"></label>
        <label>Ruhezeit bis<input id="z-bis" type="time" value="${r.ruheBis}"></label>
      </div>
      <label class="schalter-z"><input type="checkbox" id="z-fokus" ${r.fokus ? "checked" : ""}> Fokus-Hilfen (kurze Häppchen, Bewegungspausen – z. B. bei ADHS)</label>
      <label class="schalter-z"><input type="checkbox" id="z-ruhig" ${r.ruhig ? "checked" : ""}> Ruhige Darstellung (weniger Bewegung und Effekte)</label>
      <p class="hinweis">Empfehlung für ${S.kind().alter} Jahre: ${e.lernMin} min lernen (oder ${e.lernAufgaben} Aufgaben) → ${e.spielMin} min spielen, höchstens ${e.maxSpiel} min Spielzeit am Tag.
        Grundlage: ${empfehlung(S.kind().alter)} Lernzeit zählt nur, wenn das Kind wirklich etwas tut.</p>
      <div class="knoepfe"><button class="knopf haupt" id="z-speichern">Speichern</button><button class="knopf" id="z-empf">Empfehlung übernehmen</button><button class="knopf" id="z-extra">+10 Minuten nur heute</button></div>
    </div>`;
  }
  // ---------- Insel-Einstellungen (pro Kind, werden auf der Insel gemerkt) ----------
  function inselEin() {
    const lies = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
    return Object.assign({ grafik: lies("lerninsel.grafik") === "einfach" ? "einfach" : lies("lerninsel.grafik") === "schoen" ? "schoen" : (S.grafikStandard ? S.grafikStandard() : "schoen"), steuerung: lies("lerninsel.steuerung") === "tippen" ? "tippen" : "joystick", kamera: "fest", kindDarf: true },
      (S.lade("eltern") || {}).insel || {});
  }
  function inselKarte() {
    const e = inselEin();
    const wahl = (id, wert, opts) => `<select id="${id}">${opts.map(([v, t]) => `<option value="${v}" ${v === wert ? "selected" : ""}>${t}</option>`).join("")}</select>`;
    return `<div class="karte">
      <h2>🏝️ Insel-Einstellungen</h2>
      <div class="zeit-raster">
        <label>Grafik${wahl("i-grafik", e.grafik, [["schoen", "✨ Schön"], ["einfach", "Einfach (für ältere Tablets)"]])}</label>
        <label>Laufen${wahl("i-steuerung", e.steuerung, [["joystick", "🕹️ Joystick"], ["tippen", "👆 Tippen"]])}</label>
        <label>Kamera${wahl("i-kamera", e.kamera, [["fest", "🎥 Fest (folgt der Figur)"], ["frei", "🎥 Frei (drehen und zoomen)"]])}</label>
      </div>
      <label class="schalter-z"><input type="checkbox" id="i-kind" ${e.kindDarf ? "checked" : ""}> Das Kind darf diese Einstellungen auf der Insel selbst umschalten</label>
      <label class="schalter-z"><input type="checkbox" id="i-zugang" ${e.zugang === "fuehrerschein" ? "checked" : ""}> Insel erst nach dem kompletten Tablet-Führerschein (alte Regel)</label>
      <p class="klein">Ohne Haken öffnet die erste Lektion „Das Tablet bedienen“ die Insel; die übrigen Lektionen bleiben Aufgaben bei Robo Pixel. Die Minispiele (Ballons, Schatz-Strand, Sternenlauf, Kart, Bauplatz) brauchen in beiden Fällen den kompletten Führerschein.</p>
      <p class="klein">Ist der Haken aus, sind die drei Knöpfe auf der Insel ausgeblendet und es gilt, was hier eingestellt ist. Änderungen des Kindes werden gemerkt.</p>
      <div class="knoepfe"><button class="knopf haupt" id="i-speichern">Speichern</button></div>
    </div>`;
  }
  // ---------- Echte-Welt-Aufgaben ----------
  function echteWeltKarte() {
    const e = (S.lade("eltern") || {}).echtewelt || {}, a = window.EchteWelt && EchteWelt.heutige();
    return `<div class="karte">
      <h2>🌍 Echte-Welt-Aufgaben</h2>
      <p>Jeden Tag schlägt die App eine kurze, freiwillige Aufgabe weg vom Bildschirm vor (Rechnen im Alltag, Natur, Lesen, Familiensprache, Helfen, Bewegung, Gefühle).
        Ist die Spielzeit vorbei, erscheint sie als Vorschlag. Geschafft bringt 1 Stern und einen Lernfund.</p>
      ${a ? `<p><b>Heute:</b> ${a.e} ${a.text}${a.erledigt ? " ✅" : ""}</p>` : ""}
      <label class="schalter-z"><input type="checkbox" id="ew-selbst" ${e.selbst ? "checked" : ""}> Das Kind darf Echte-Welt-Aufgaben selbst abhaken (sonst bestätigt ihr mit der PIN)</label>
      <div class="knoepfe"><button class="knopf haupt" id="ew-speichern">Speichern</button></div>
    </div>`;
  }
  // ---------- Mathe: Rechenverfahren wie in der Schule ----------
  const LB_NAMEN = { zo: "Zahl und Operation", rf: "Raum und Form", gm: "Größen und Messen", dz: "Daten und Zufall" };
  const WEG_NAMEN = { k1: "Kl. 1", k2: "Kl. 2", k3: "Kl. 3", k4: "Kl. 4", k5: "Übergang 5" };
  function lernstandHtml() {
    const ls = (S.lade("mathe") || {}).lernstand || {}, M = window.Mathe || {}, alle = [].concat(M.STATIONEN || [], M.STATIONEN_K1 || [], M.STATIONEN_K3 || [], M.STATIONEN_K4 || [], M.STATIONEN_K5 || []);
    const name = (id) => (alle.find(s => s.id === id) || {}).name || id, eintraege = Object.entries(ls).sort((a, b) => (b[1].am || "").localeCompare(a[1].am || ""));
    if (!eintraege.length) return `<p class="klein">„Zeig, was du kannst“ (im Matheweg je Lernbereich): noch nicht gemacht.</p>`;
    return `<h3>„Zeig, was du kannst“ – zuletzt</h3><ul class="liste" id="lernstand-liste">` + eintraege.map(([k, v]) => { const [w, lb] = k.split(":"), ueben = Object.keys(v.je).filter(id => !v.je[id]);
      return `<li><b>${WEG_NAMEN[w] || w} · ${LB_NAMEN[lb] || lb}</b> (${v.am.split("-").reverse().join(".")}): ${v.richtig} von ${v.n} Stationen auf Anhieb${ueben.length ? ` · noch üben: ${ueben.map(name).join(", ")}` : " · alles sicher"}</li>`; }).join("") + `</ul>`;
  }
  function matheKarte() {
    const m = ((S.lade("eltern") || {}).mathe || {}).minus || "abziehen", schule = ((S.lade("eltern") || {}).mathe || {}).schule || "";
    return `<div class="karte">
      <h2>🧮 Mathe wie in der Schule</h2>
      <div class="zeit-raster"><label>Schriftlich minus<select id="m-minus">
        <option value="abziehen" ${m === "abziehen" ? "selected" : ""}>Abziehen mit Entbündeln („tausche einen Zehner“)</option>
        <option value="ergaenzen" ${m === "ergaenzen" ? "selected" : ""}>Ergänzen („von 7 bis 13 sind 6, merke 1“)</option></select></label>
        <label>Schulart ab Klasse 5 (für „Übergang 5“)<select id="m-schulart"><option value="os" ${(((S.lade("eltern") || {}).mathe || {}).schulart) !== "gy" ? "selected" : ""}>Oberschule</option><option value="gy" ${(((S.lade("eltern") || {}).mathe || {}).schulart) === "gy" ? "selected" : ""}>Gymnasium</option></select></label>
        <label>Gerade in der Schule<select id="m-schule"><option value="" ${!schule ? "selected" : ""}>Keine Angabe (Matheweg der Reihe nach)</option>${Object.entries(LB_NAMEN).map(([k, n]) => `<option value="${k}" ${schule === k ? "selected" : ""}>${n}</option>`).join("")}</select></label></div>
      <p class="klein">„Gerade in der Schule“: Der Matheweg markiert diesen Lernbereich und schlägt seine nächste Station zuerst vor. Alle anderen Stationen bleiben offen wie bisher.</p>
      ${lernstandHtml()}
      <p class="klein">Schulen bringen die schriftliche Subtraktion unterschiedlich bei. Fragt im Zweifel die Lehrkraft und stellt hier dasselbe Verfahren ein – die Hilfe im Matheweg erklärt dann genauso.</p>
      <div class="knoepfe"><button class="knopf haupt" id="m-speichern">Speichern</button></div>
    </div>`;
  }
  // Englisch (Englisch-Einstieg): Beginn je nach Bundesland/Schule – meist Kl. 3, in manchen Ländern früher
  function englischKarte() {
    const ab = ((S.lade("eltern") || {}).englisch || {}).ab || "3", enSchule = ((S.lade("eltern") || {}).englisch || {}).schule || "";
    return `<div class="karte">
      <h2>🦜 Englisch wie in der Schule</h2>
      <div class="zeit-raster"><label>Englisch zeigen<select id="en-ab">
        <option value="3" ${ab === "3" ? "selected" : ""}>Wie in den meisten Ländern: ab Klasse 3 (erste Lektionen schon in Klasse 2)</option>
        <option value="1" ${ab === "1" ? "selected" : ""}>Schon ab Klasse 1 (wenn die Schule früh mit Englisch beginnt)</option></select></label>
        <label>Gerade in der Schule<select id="en-schule"><option value="">Keine Angabe</option>${Object.entries(EN_LB).map(([k, n]) => `<option value="${k}" ${String(enSchule) === k ? "selected" : ""}>${n}</option>`).join("")}</select></label></div>
      <h3>„Zeig, was du kannst“</h3>${lernstandListe("englisch", EN_LB, window.ENGLISCH || [], "lernstand-englisch")}
      <p class="klein">Englische Wörter liest die englische Stimme des Geräts vor. Fehlt sie: iPad → Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen → Englisch. Ohne Stimme werden Hör-Aufgaben zu Lese-Aufgaben.</p>
      <div class="knoepfe"><button class="knopf haupt" id="en-speichern">Speichern</button></div>
    </div>`;
  }
  // Sorbisch (Obersorbisch, „Sorbisch als Fremdsprache“, 28.10.2026): nur nach Wahl; Lektionen auf der Hauptseite erst nach Prüfung (geprueft.js)
  function sorbischKarte() {
    const so = (S.lade("eltern") || {}).sorbisch || {}, mutter = so.art === "mutter", alle = (mutter ? window.SORBISCH_MUTTER : window.SORBISCH) || [], frei = (window.SORBISCH_FREI || []).filter(id => alle.some(k => k.id === id));
    const lb = Object.fromEntries(((mutter ? window.SORBISCH_MUTTER_LB : window.SORBISCH_LB) || []).map(([nr, t]) => [String(nr), t.replace(/^\S+\s/, "")]));
    return `<div class="karte" id="sorbisch-karte">
      <h2>🪺 Sorbisch (Obersorbisch)</h2>
      <p class="klein">Für Kinder, die in der Schule Sorbisch lernen – als Fremdsprache (Lehrplan „Sorbisch als Fremdsprache“) oder als Muttersprache (Lehrplan Grundschule Sorbisch 2004: lesen, schreiben, Rechtschreibung, Sprache untersuchen, sorbische Literatur). Mit der Wahl erscheint auf der Startseite die Tür „Sorbisch“.</p>
      <div class="zeit-raster"><label>Sorbisch zeigen<select id="so-an">
        <option value="" ${!so.an ? "selected" : ""}>Nein</option><option value="1" ${so.an ? "selected" : ""}>Ja, mein Kind lernt Sorbisch</option></select></label>
        <label>Wie lernt Ihr Kind Sorbisch?<select id="so-art"><option value="fremd" ${!mutter ? "selected" : ""}>als Fremdsprache</option><option value="mutter" ${mutter ? "selected" : ""}>als Muttersprache</option></select></label>
        <label>Gerade in der Schule<select id="so-schule"><option value="">Keine Angabe</option>${Object.entries(lb).map(([k, n]) => `<option value="${k}" ${String(so.schule || "") === k ? "selected" : ""}>${n}</option>`).join("")}</select></label></div>
      <p class="klein" id="so-pruefstand">Geprüft: <b>${frei.length} von ${alle.length}</b> Lektionen. Alle sorbischen Wörter sind Entwürfe, bis sie jemand mit Sorbisch-Kenntnissen geprüft hat. Die Lektionen sind schon für die Kinder sichtbar; Korrekturen aus der Prüfung werden nachgetragen.
        Es gibt keine sorbische Gerätestimme: Sorbisch wird gelesen, nicht vorgelesen.</p>
      <p><a class="knopf" id="so-pruefen" href="../sorbisch/pruefen.html">✍️ Prüfliste für die Prüferin oder den Prüfer öffnen</a></p>
      <h3>„Zeig, was du kannst“</h3>${lernstandListe("sorbisch", lb, alle, "lernstand-sorbisch", mutter ? "m" : "k")}
      <div class="knoepfe"><button class="knopf haupt" id="so-speichern">Speichern</button></div>
    </div>`;
  }
  function sorbischKnoepfe() {
    $("so-speichern").addEventListener("click", () => { const e = S.lade("eltern") || {}; e.sorbisch = Object.assign({}, e.sorbisch || {}, { an: !!$("so-an").value, art: $("so-art").value, schule: $("so-art").value !== (((S.lade("eltern") || {}).sorbisch || {}).art || "fremd") ? "" : $("so-schule").value }); S.speichere("eltern", e); S.meldung("Gespeichert."); });
  }
  // ---------- Schuljahr Deutsch und Sachunterricht (28.10.2026): „gerade in der Schule“ und „Zeig, was du kannst“ ----------
  const DE_LB = { sz: "Sprechen und Zuhören", sc: "Schreiben", le: "Lesen", tm: "Texte und Medien", su: "Sprache untersuchen" };
  const EN_LB = { 1: "Me, my family and my friends", 2: "My body and my clothes", 3: "At home", 4: "Food and drink", 5: "Let's go shopping", 6: "At school", 7: "My hobbies", 8: "Animals", 9: "Let's go on a trip", 10: "Around the year", 11: "My Portfolio" };
  const SU_LB = { zl: "Zusammen leben und lernen", kg: "Mein Körper und meine Gesundheit", pt: "Pflanzen und Tiere", un: "Unbelebte Natur", rz: "Raum und Zeit", ex: "Forschen, Medien, Schuljahre" };
  function lernstandListe(fach, namen, liste, id, praefix) {
    const ls = (S.lade(fach) || {}).lernstand || {}, eintraege = Object.entries(ls).filter(([k]) => !praefix || k[0] === praefix).sort((a, b) => (b[1].am || "").localeCompare(a[1].am || ""));
    const name = (x) => (liste.find(k => k.id === x) || {}).name || x;
    if (!eintraege.length) return `<p class="klein" id="${id}">„Zeig, was du kannst“: noch nicht gemacht.</p>`;
    return `<ul class="liste" id="${id}">` + eintraege.map(([k, v]) => { const [kl, lb] = k.split(":"), ueben = Object.keys(v.je).filter(x => !v.je[x]);
      return `<li><b>Kl. ${kl.slice(1)} · ${namen[lb] || lb}</b> (${v.am.split("-").reverse().join(".")}): ${v.richtig} von ${v.n} auf Anhieb${ueben.length ? ` · noch üben: ${ueben.map(name).join(", ")}` : " · alles sicher"}</li>`; }).join("") + `</ul>`;
  }
  function schuljahrKarte() {
    const e = S.lade("eltern") || {}, de = (e.deutsch || {}).schule || "", su = (e.sachkunde || {}).schule || "";
    const auswahl = (id, namen, wert, leer) => `<select id="${id}"><option value="" ${!wert ? "selected" : ""}>${leer}</option>${Object.entries(namen).map(([k, n]) => `<option value="${k}" ${wert === k ? "selected" : ""}>${n}</option>`).join("")}</select>`;
    return `<div class="karte" id="schuljahr-karte">
      <h2>📚 Wie im Schuljahr: gerade in der Schule</h2>
      <p class="klein">Welcher Lernbereich ist in der Schule gerade dran?</p>
      <div class="zeit-raster"><label>Deutsch${auswahl("d-schule", DE_LB, de, "Keine Angabe")}</label>
        <label>Sachunterricht${auswahl("su-schule", SU_LB, su, "Keine Angabe")}</label>
        ${window.LANDKREISE && (S.land() || {}).code === "sn" ? `<label>Unser Landkreis (Sachunterricht)${auswahl("su-landkreis", Object.fromEntries(LANDKREISE.map(k => [k.id, k.name])), (e.sachkunde || {}).landkreis || "", "Keine Angabe")}</label>` : ""}
        ${Object.entries(window.FACH_SEITEN || {}).map(([f, x]) => `<label>${x.name}${auswahl("fs-" + f, Object.fromEntries(x.lb.map(([id, t]) => [id, t.replace(/^\S+\s/, "")])), (e[f] || {}).schule || "", "Keine Angabe")}</label>`).join("")}
        <label>Mein Kind hat in der Schule${auswahl("et-unterricht", { ev: "Evangelische Religion", ka: "Katholische Religion" }, (e.ethik || {}).unterricht === "ethik" ? "" : (e.ethik || {}).unterricht || "", "Ethik")}</label></div>
      <p class="klein" id="religion-hinweis">${["ev", "ka"].includes((e.ethik || {}).unterricht) ? `Bei Eule Ella gibt es jetzt den Reiter „Religion“ mit den Themen nach dem sächsischen Lehrplan ${(e.ethik || {}).unterricht === "ev" ? "Evangelische" : "Katholische"} Religion. Ethik bleibt zusätzlich sichtbar. Im Lehrplan unten steht Religion statt Ethik.` : "Ethik ist voreingestellt. Hat Ihr Kind evangelische oder katholische Religion, wählen Sie das hier."}</p>
      <p class="klein">Der gewählte Lernbereich steht in der Wörter-Werkstatt bzw. bei Eule Ella (auch Kunst, Musik, Werken, Sport, Ethik) ganz oben und ist markiert. Alles andere bleibt offen.
        Mit „Zeig, was du kannst“ (je Lernbereich) zeigt das Kind ohne Noten und ohne Sterne, was schon sitzt – hier seht ihr das Ergebnis.</p>
      <div class="knoepfe"><button class="knopf haupt" id="sj-speichern">Speichern</button></div>
      <h3>Deutsch – „Zeig, was du kannst“</h3>${lernstandListe("deutsch", DE_LB, window.WERKSTATT || [], "lernstand-deutsch")}
      <h3>Sachunterricht, Kunst, Musik, Werken, Sport, Ethik – „Zeig, was du kannst“</h3>${lernstandListe("sachkunde", Object.assign({}, SU_LB, ...Object.values(window.FACH_SEITEN || {}).map(f => Object.fromEntries(f.lb.map(([id, t]) => [id, `${f.name}: ${t.replace(/^\S+\s/, "")}`])))), (window.THEMEN || []).concat(window.FACH_THEMEN || []), "lernstand-sachkunde")}
    </div>`;
  }
  function schuljahrKnoepfe() {
    $("sj-speichern").addEventListener("click", () => {
      const e = S.lade("eltern") || {};
      e.deutsch = Object.assign({}, e.deutsch || {}, { schule: $("d-schule").value });
      e.sachkunde = Object.assign({}, e.sachkunde || {}, { schule: $("su-schule").value }, $("su-landkreis") ? { landkreis: $("su-landkreis").value } : {});
      Object.keys(window.FACH_SEITEN || {}).forEach(f => { e[f] = Object.assign({}, e[f] || {}, { schule: $("fs-" + f).value }); });
      e.ethik = Object.assign({}, e.ethik || {}, { unterricht: $("et-unterricht").value || "ethik" });
      S.speichere("eltern", e); S.meldung("Gespeichert.");
    });
  }
  // Deutsch (Paket D1): eigene Texte lesen, Aufnahmen anhören, Aufnehmen erlauben. Alles liegt nur in der IndexedDB dieses Geräts.
  function deutschKarte() {
    const an = !!(((S.lade("eltern") || {}).deutsch || {}).aufnehmen), schrift = ((S.lade("eltern") || {}).deutsch || {}).schrift || "sas";
    return `<div class="karte" id="deutsch-karte">
      <h2>✏️ Deutsch: Schreibschrift, eigene Texte und Aufnahmen</h2>
      <div class="zeit-raster"><label>Schreibschrift üben (Lesen und Schreiben → „Schreibschrift“)<select id="d-schrift">
        <option value="sas" ${schrift !== "aus" ? "selected" : ""}>Schulausgangsschrift (Sachsen und andere Länder)</option>
        <option value="aus" ${schrift === "aus" ? "selected" : ""}>Aus – die Schule nutzt eine andere Schrift</option></select></label></div>
      <p class="klein">Es gibt alle Klein- und Großbuchstaben und verbundene Wörter der Schulausgangsschrift; Vereinfachte und Lateinische Ausgangsschrift folgen. Die Formen sind nachgebildet – bitte mit der Schreibtabelle der Schule vergleichen. Das Kind findet seine eigenen Texte und Aufnahmen unter „Meine Ecke“ → „Mein Heft“.</p>
      <label class="schalter-z"><input type="checkbox" id="d-aufnehmen" ${an ? "checked" : ""}> Mein Kind darf sich in der Wörter-Werkstatt selbst aufnehmen (Gedicht vortragen, Geschichte nacherzählen, Buchtipp)</label>
      <p class="klein">Die Aufnahmen bleiben nur auf diesem Gerät, werden nie hochgeladen und nicht mit dem Spielstand übertragen. Das Gerät fragt beim ersten Mal nach dem Mikrofon. Ist der Schalter aus, fallen die Aufnahme-Schritte still weg.${window.Eigenes && !Eigenes.kannAufnehmen() ? " <b>Dieser Browser kann nicht aufnehmen.</b>" : ""}</p>
      <div class="knoepfe"><button class="knopf haupt" id="d-speichern">Speichern</button></div>
      <h3>Geschriebene Texte</h3><div id="eigene-texte"><p class="klein">Wird geladen …</p></div>
      <h3>Aufnahmen</h3><div id="eigene-toene"><p class="klein">Wird geladen …</p></div>
      <p class="klein">Die App prüft beim Schreiben nur Einfaches (Satzanfang groß, Satzzeichen, Länge, bestimmte Wörter) und gibt freundliche Hinweise – Rechtschreibung im Einzelnen prüft sie nicht. Lest die Texte gern gemeinsam.</p>
    </div>`;
  }
  const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const kapitelName = (id) => ((window.WERKSTATT || []).find(k => k.id === id) || {}).name || id;
  const datum = (t) => { const d = new Date(t); return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}, ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`; };
  function deutschKnoepfe() {
    $("d-speichern").addEventListener("click", () => { const e = S.lade("eltern") || {}; e.deutsch = Object.assign({}, e.deutsch || {}, { aufnehmen: $("d-aufnehmen").checked, schrift: $("d-schrift").value }); S.speichere("eltern", e); S.meldung("Gespeichert."); });
    if (!window.Eigenes) return;
    const urls = [];
    const fuelle = () => Eigenes.alle().then(liste => {
      urls.forEach(u => URL.revokeObjectURL(u)); urls.length = 0;
      const texte = liste.filter(x => x.art === "text"), toene = liste.filter(x => x.art === "ton");
      $("eigene-texte").innerHTML = texte.length ? `<ul class="liste eigene">${texte.map(x => `<li><span class="klein">${datum(x.t)} · ${esc(kapitelName(x.kapitel))}</span><br><b class="eigener-text">${esc(x.text)}</b> <button class="knopf klein-k" data-eigen-weg="${x.id}">Löschen</button></li>`).join("")}</ul>` : `<p class="klein">Noch keine Texte.</p>`;
      $("eigene-toene").innerHTML = toene.length ? `<ul class="liste eigene">${toene.map(x => { const u = Eigenes.url(x); urls.push(u); return `<li><span class="klein">${datum(x.t)} · ${esc(kapitelName(x.kapitel))} · ${x.dauer || "?"} s</span><br><audio controls preload="none" src="${u}"></audio> <button class="knopf klein-k" data-eigen-weg="${x.id}">Löschen</button></li>`; }).join("")}</ul>` : `<p class="klein">Noch keine Aufnahmen.</p>`;
      $("deutsch-karte").querySelectorAll("[data-eigen-weg]").forEach(b => b.addEventListener("click", () => {
        if (!confirm("Wirklich löschen? Das lässt sich nicht rückgängig machen.")) return;
        Eigenes.loesche(b.dataset.eigenWeg).then(fuelle);
      }));
    }).catch(() => { $("eigene-texte").innerHTML = $("eigene-toene").innerHTML = `<p class="klein">Auf diesem Gerät nicht verfügbar.</p>`; });
    fuelle();
  }
  function englischKnoepfe() {
    $("en-speichern").addEventListener("click", () => { const e = S.lade("eltern") || {}; e.englisch = Object.assign({}, e.englisch || {}, { ab: $("en-ab").value, schule: $("en-schule").value }); S.speichere("eltern", e); S.meldung("Gespeichert."); });
  }
  function matheKnoepfe() {
    $("m-speichern").addEventListener("click", () => { const e = S.lade("eltern") || {}; e.mathe = Object.assign({}, e.mathe || {}, { minus: $("m-minus").value, schule: $("m-schule").value, schulart: $("m-schulart").value }); S.speichere("eltern", e); S.meldung("Gespeichert."); });
  }
  function echteWeltKnoepfe() {
    $("ew-speichern").addEventListener("click", () => { const e = S.lade("eltern") || {}; e.echtewelt = { selbst: $("ew-selbst").checked }; S.speichere("eltern", e); S.meldung("Gespeichert."); });
  }

  // ---------- Stärken: „Heute habe ich gesehen, dass du …“ ----------
  // Geschichte und Einführung (Story-Zustand aus shared/ereignisse.js)
  const TUTORIAL = ["E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9"];
  function storyKarte() {
    const St = window.Story; if (!St) return "";
    const st = St.zustand(), e1 = St.etappe("E1");
    return `<div class="karte">
      <h2>🧭 Geschichte und Einführung</h2>
      <p>Beim ersten Besuch der Insel bringt Robo Pixel das Kind mit dem Boot: Laufen lernen, zum Haus gehen, hineingehen.
        ${e1 ? "Die Ankunft ist erledigt." : "Die Ankunft kommt beim nächsten Besuch der Insel."} Kapitel der Geschichte: ${st.kapitel} · gesehene Szenen: ${st.chronik.length}</p>
      <div class="knoepfe">${e1 ? `<button class="knopf" id="prolog-neu">🔁 Ankunft neu starten</button>` : `<button class="knopf" id="prolog-weg">⏭️ Ankunft überspringen</button>`}
        ${TUTORIAL.some(e => !St.etappe(e)) ? `<button class="knopf" id="tutorial-weg">⏭️ Einführung überspringen</button>` : ""}</div>
      <p class="klein">Einführung (höchstens zwei neue Schritte am Tag): ${TUTORIAL.filter(e => St.etappe(e)).length} von ${TUTORIAL.length} Schritten erledigt –
        Sonnenuhr, erste Frucht, Sterne fürs Zimmer, Nest und Ei, Spielorte, Merkkiste, Gefühle. Was das Kind schon kennt, wird übersprungen.</p>
      <p class="klein">Das Kind kann die Ankunft jederzeit selbst bei Robo Pixel wiederholen („Wie ging das nochmal?“). Nichts geht verloren, es gibt keine Fristen.</p>
    </div>`;
  }
  function staerkenKarte() {
    if (!window.Staerken) return "";
    const ST = window.Staerken, m = ST.meine();
    return `<div class="karte">
      <h2>⭐ Stärken</h2>
      <p>Ohne Test und ohne Rangliste: Das Kind kreuzt selbst an, die App bemerkt Dinge aus dem Spielen, und ihr könnt ergänzen. Schwächen werden nie gezeigt.</p>
      ${m.length ? `<p><b>Das kann ${S.profil.name} gut:</b> ${m.map(x => `${x.e} ${x.text}`).join(" · ")}</p>` : ""}
      <p><b>Heute habe ich gesehen, dass du …</b></p>
      <div class="zeit-raster"><label>Stärke<select id="st-id">${ST.STAERKEN.map(([id, e, t]) => `<option value="${id}">${e} gut ${t}</option>`).join("")}</select></label>
        <label>Was genau? (freiwillig)<input id="st-text" type="text" maxlength="120" placeholder="z. B. deiner Schwester beim Aufräumen geholfen"></label></div>
      <div class="knoepfe"><button class="knopf haupt" id="st-speichern">❤️ Dem Kind zeigen</button></div>
      <p class="klein">Das Kind sieht es beim nächsten Öffnen von „Meine Ecke“.</p>
    </div>`;
  }
  function staerkenKnoepfe() {
    const b = $("st-speichern"); if (!b) return;
    b.addEventListener("click", () => { window.Staerken.elternGesehen($("st-id").value, $("st-text").value.trim()); $("st-text").value = ""; S.meldung("Gespeichert – das Kind sieht es in „Meine Ecke“."); });
  }

  function inselKnoepfe() {
    $("i-speichern").addEventListener("click", () => {
      const e = S.lade("eltern") || {};
      // weitere gemerkte Insel-Werte (z. B. der Look) bleiben erhalten
      e.insel = Object.assign({}, e.insel || {}, { grafik: $("i-grafik").value, steuerung: $("i-steuerung").value, kamera: $("i-kamera").value, kindDarf: $("i-kind").checked, zugang: $("i-zugang").checked ? "fuehrerschein" : "bedienung" });
      S.speichere("eltern", e); try { localStorage.removeItem("lerninsel.sparen"); } catch (er) { /* egal */ } S.meldung("Insel-Einstellungen gespeichert.");
    });
  }

  // QR-Geschenk (NA-16): scannen oder einfügen, prüfen (Signatur, einmal je Kind), Paket wartet am Steg
  function geschenkKnoepfe() {
    const G = window.Geschenk, m = $("geschenk-meldung"); if (!G || !m) return;
    let stopp = null;
    const loese = async (text) => {
      const r = await G.einloesen(text);
      if (r.ok) { S.ton("juhu"); m.textContent = `✅ Eingelöst: ${r.geschenk.e} ${r.geschenk.name}. Das Paket liegt jetzt am Steg der Insel.`; $("geschenk-text").value = ""; }
      else { S.ton("nein"); m.textContent = "❌ " + (G.GRUND[r.grund] || "Das hat nicht geklappt."); }
      return r.ok;
    };
    $("geschenk-ok").addEventListener("click", () => loese($("geschenk-text").value));
    $("geschenk-scan").addEventListener("click", async () => {
      const v = $("geschenk-video");
      if (stopp) { stopp(); stopp = null; v.hidden = true; $("geschenk-scan").textContent = "📷 Code scannen"; return; }
      try { v.hidden = false; $("geschenk-scan").textContent = "⏹️ Kamera aus"; m.textContent = "Halte den Code vor die Kamera.";
        stopp = await G.scanne(v, async (text) => { if (await loese(text) && stopp) { stopp(); stopp = null; v.hidden = true; $("geschenk-scan").textContent = "📷 Code scannen"; } }); }
      catch (e) { v.hidden = true; $("geschenk-scan").textContent = "📷 Code scannen"; m.textContent = "Die Kamera ist nicht erlaubt. Du kannst den Code auch einfügen."; }
    });
  }
  function zeitKnoepfe() {
    if (!Z) return;
    const wert = (id) => Math.max(0, parseInt($(id).value, 10) || 0);
    $("z-speichern").addEventListener("click", () => {
      Z.setzeRegeln({ an: $("z-an").checked, lernMin: Math.max(1, wert("z-lern")), lernAufgaben: Math.max(1, wert("z-aufg")), spielMin: Math.max(1, wert("z-spiel")),
        maxSpiel: wert("z-max"), ruheVon: $("z-von").value, ruheBis: $("z-bis").value, fokus: $("z-fokus").checked, ruhig: $("z-ruhig").checked });
      S.meldung("Zeit-Regeln gespeichert."); uebersicht();
    });
    $("z-empf").addEventListener("click", () => { Z.setzeRegeln(Z.empfehlung(S.kind().alter)); S.meldung("Empfehlung übernommen."); uebersicht(); });
    $("z-extra").addEventListener("click", () => { Z.extra(10); S.meldung("Heute 10 Minuten extra."); uebersicht(); });
    $("z-noch-ok").addEventListener("click", () => {
      const st = Z.noch(parseInt($("z-noch").value, 10) || 0), m = Math.round(st.rest / 60);
      S.meldung(m ? `Heute noch ${m} Minuten Spielzeit.` : "Für heute keine Spielzeit mehr."); uebersicht();
    });
  }

  const heuteIso = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const wannWieder = (f) => !f.faellig || f.faellig <= heuteIso() ? "· heute dran" : `· wieder am ${f.faellig.slice(8)}.${f.faellig.slice(5, 7)}.`;

  // ---------- Übersicht ----------
  const quoteKlasse = (q) => q == null ? "leer" : q >= 0.8 ? "gut" : q >= 0.6 ? "mittel" : "schwach";
  const prozent = (q) => q == null ? "–" : Math.round(q * 100) + " %";

  function uebersicht() {
    const mathe = S.lade("mathe") || {}, deutsch = S.lade("deutsch") || {}, medien = S.lade("medien") || {}, welt = S.lade("welt3d") || {};
    const stat = mathe.stat || {}, k2 = mathe.k2 || {};
    const tag = C.tag(), aufgaben = C.aufgaben();
    let gesR = 0, gesF = 0; Object.values(stat).forEach(x => { gesR += x.r; gesF += x.f; });

    // Kalender: letzte 4 Wochen
    const stempel = C.stempel(), montag = C.wocheVon(C.heute());
    const [y, m, t] = montag.split("-").map(Number);
    let kal = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map(n => `<div class="kopf">${n}</div>`).join("");
    for (let w = 3; w >= 0; w--) for (let d = 0; d < 7; d++) {
      const dt = new Date(y, m - 1, t - w * 7 + d);
      const iso = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
      kal += `<div class="${stempel.includes(iso) ? "an" : ""}">${dt.getDate()}.${dt.getMonth() + 1}.</div>`;
    }

    // Klasse-1-Weg (NA-32) mit anzeigen, wenn das Kind dort übt oder in Vorschule/Klasse 1 ist
    const k1 = mathe.k1 || {}, mitK1 = Object.keys(k1).length || ["vs", "1"].includes((S.stufe() || {}).code);
    const alleSt = (mitK1 ? (window.Mathe.STATIONEN_K1 || []).map(s => ({ s, st: k1[s.id], vor: "Kl. 1: " })) : [])
      .concat(window.Mathe.STATIONEN.map(s => ({ s, st: k2[s.id], vor: "" })))
      // Klasse 3/4 (NA-33/37), wenn das Kind dort übt oder in der Klasse ist
      .concat(...[["k3", "STATIONEN_K3", "3", "Kl. 3: "], ["k4", "STATIONEN_K4", "4", "Kl. 4: "], ["k5", "STATIONEN_K5", "5", "Übergang 5: "]].map(([w, liste, kl, vor]) => {
        const d = mathe[w] || {}, mit = Object.keys(d).length || (S.stufe() || {}).code === kl;
        return mit ? (window.Mathe[liste] || []).map(s => ({ s, st: d[s.id], vor })) : []; }));
    const stationen = alleSt.map(({ s, st, vor }) => {
      const x = stat[s.id], n = x ? x.r + x.f : 0, q = n ? x.r / n : null;
      return `<tr><td>${vor}${s.name}</td><td class="zahl-r">${st ? "⭐".repeat(st) : "–"}</td><td class="zahl-r">${n || "–"}</td><td class="zahl-r"><span class="quote ${quoteKlasse(n >= 3 ? q : null)}">${prozent(q)}</span></td></tr>`;
    }).join("");
    const schwach = alleSt.map(({ s }) => ({ s, x: stat[s.id] })).filter(o => o.x && o.x.r + o.x.f >= 5 && o.x.r / (o.x.r + o.x.f) < 0.7);
    const fehler = (mathe.fehler || []).slice(-10).reverse();

    inhalt.innerHTML = `
      <nav class="eltern-reiter" role="tablist" aria-label="Bereiche">
        <button role="tab" data-teil="ueberblick" class="an">📊 Überblick</button><button role="tab" data-teil="lernstand">📘 Lernstand</button><button role="tab" data-teil="schule">🏫 Wie in der Schule</button><button role="tab" data-teil="zeit">⏰ Zeit & Regeln</button><button role="tab" data-teil="kinder">👨‍👩‍👧 Kinder & Gerät</button>
      </nav>
      <section class="eltern-teil" data-teil="ueberblick" role="tabpanel">
      ${S.kind().geburt ? "" : `<div class="karte" id="geburt-fehlt"><h2>🎂 Geburtsdatum eintragen</h2><p>Mit dem Geburtsdatum stimmt das Alter immer (Bildschirmzeit nach Alter), und am Geburtstag wartet ein Geschenk am Steg der Insel – auch wenn ${S.profil.name || "das Kind"} erst ein paar Tage später spielt.</p><div class="knoepfe"><button class="knopf haupt" id="geburt-eintragen">Jetzt eintragen</button></div></div>`}
      <div class="karte">
        <h2>${S.profil.name || "Spielstand"} auf einen Blick</h2>
        <div class="zahlen">
          <div class="zahl"><b>${S.sterne()} ⭐</b><span>Sterne gerade</span></div>
          <div class="zahl"><b>${C.gesamt()}</b><span>Gesamtstufe (${C.titel()})</span></div>
          <div class="zahl"><b>${stempel.length}</b><span>Tage mit allen Tagesaufgaben</span></div>
          <div class="zahl"><b>${gesR + gesF ? Math.round(gesR / (gesR + gesF) * 100) + " %" : "–"}</b><span>Mathe beim 1. Versuch richtig (${gesR + gesF} Aufgaben)</span></div>
        </div>
      </div>
      ${wochenbericht(schwach, mathe)}
      <div class="karte">
        <h2>Tagesaufgaben</h2>
        <p>Heute: ${tag.erledigt.length} von ${aufgaben.length} geschafft (${aufgaben.map(a => `${a.erledigt ? "✓" : "○"} ${a.titel}`).join(", ")}).</p>
        <p class="klein">Rosa Tage: alle Tagesaufgaben geschafft. Die letzten 4 Wochen:</p>
        <div class="kalender">${kal}</div>
      </div>
      <div class="karte">
        <h2>Zuletzt falsch gelöst</h2>
        ${fehler.length ? `<ul class="liste">${fehler.map(f => `<li>${f.text || f.frage} → richtig: <b>${f.antwort}${f.einheit ? " " + f.einheit : ""}</b> <span class="klein">${"●".repeat(f.stufe || 1)}${"○".repeat(3 - (f.stufe || 1))} ${wannWieder(f)}</span></li>`).join("")}</ul><p class="klein">Lernkartei: Falsch gelöste Aufgaben kommen im Mathe-Training nach 1, 3 und 7 Tagen wieder. Dreimal richtig = gelernt${mathe.gelernt ? ` (schon ${mathe.gelernt} gelernt)` : ""}.</p>` : `<p>Noch keine gemerkten Fehler.</p>`}
      </div>
      </section>
      <section class="eltern-teil" data-teil="lernstand" role="tabpanel" hidden>
      ${lehrplanKarte(mathe)}
      <div class="karte">
        <h2>Fähigkeiten</h2>
        <table><tr><th>Fähigkeit</th><th class="r">Stufe</th><th class="r">Punkte</th><th>Wächst durch</th></tr>
          ${C.sichtbareFaehigkeiten().map(f => `<tr><td>${f.icon} ${f.name}</td><td class="zahl-r">${C.stufe(f.id)}</td><td class="zahl-r">${C.xp(f.id)}</td><td>${f.woher}</td></tr>`).join("")}
        </table>
      </div>
      <div class="karte">
        <h2>Mathe: Matheweg 2. Klasse</h2>
        ${mathe.einstufung && !mathe.einstufung.uebersprungen ? `<p>🧭 <b>Einstufungstest</b> am ${mathe.einstufung.am.slice(8)}.${mathe.einstufung.am.slice(5, 7)}.: Start bei „${(window.Mathe.STATIONEN[mathe.einstufung.startAb] || {}).name || "–"}“${mathe.einstufung.geschafft && mathe.einstufung.geschafft.length ? `, schon gekonnt: ${mathe.einstufung.geschafft.map(id => (window.Mathe.STATIONEN.find(x => x.id === id) || {}).name).join(", ")}` : ""}. <button class="knopf klein-k" id="einst-neu">Test wiederholen</button></p>` : ""}
        ${schwach.length ? `<p><b>Braucht noch Übung:</b> ${schwach.map(o => o.s.name).join(", ")}. Das tägliche Mathe-Training übt diese Themen automatisch öfter.</p>` : `<p>Zurzeit keine auffälligen Schwächen (ab 5 gelösten Aufgaben pro Station bewertet).</p>`}
        <details class="aufklapp"><summary>Alle Stationen mit Ergebnis anzeigen</summary>
        <table><tr><th>Station</th><th class="r">Bestes Ergebnis</th><th class="r">Aufgaben</th><th class="r">1. Versuch richtig</th></tr>${stationen}</table></details>
      </div>
      <div class="karte">
        <h2>Deutsch, Sachunterricht, Tablet-Führerschein und 3D-Welt</h2>
        <p><b>Abenteuer:</b> ${window.GESCHICHTE.map(k => `${k.name} ${deutsch.kapitel && deutsch.kapitel[k.id] ? "⭐".repeat(deutsch.kapitel[k.id]) : "–"}`).join(", ")}</p>
        <p><b>Sachunterricht:</b> ${(() => { const sk = S.lade("sachkunde") || {}; return window.THEMEN.map(t => `${t.name} ${sk.themen && sk.themen[t.id] ? "⭐".repeat(sk.themen[t.id]) : "–"}`).join(", "); })()}</p>
        <p><b>Führerschein:</b> ${medien.fuehrerschein ? `bestanden am ${medien.fuehrerschein.split("-").reverse().join(".")}` : `${window.LEKTIONEN.filter(l => medien.lektionen && medien.lektionen[l.id]).length} von ${window.LEKTIONEN.length} Lektionen`}</p>
        <p><b>Haustier:</b> ${(() => { const t = S.lade("tier"); return !t || !t.phase ? "noch kein Ei ausgesucht" : t.phase === "ei" ? `Ei wird gewärmt (${t.waerme || 0} von 3)` : `${t.name || "ohne Namen"}, Freundschaft ${t.freundschaft || 0}, ${t.leckerli || 0} Leckerli`; })()}</p>
        <p><b>3D-Welt:</b> Ballon-Rekord ${(welt.ballon && welt.ballon.rekord) || 0} Punkte, Insel-Schatz ${(welt.insel && welt.insel.geschafft) || 0}× gefunden</p>
      </div>
      ${staerkenKarte()}
      </section>
      <section class="eltern-teil" data-teil="schule" role="tabpanel" hidden>
      ${matheKarte()}
      ${englischKarte()}
      ${sorbischKarte()}
      ${schuljahrKarte()}
      ${deutschKarte()}
      </section>
      <section class="eltern-teil" data-teil="zeit" role="tabpanel" hidden>
      ${zeitKarte()}
      ${inselKarte()}
      ${echteWeltKarte()}
      ${storyKarte()}
      </section>
      <section class="eltern-teil" data-teil="kinder" role="tabpanel" hidden>
      <div class="karte">
        <h2>Kinder auf diesem Tablet</h2>
        <ul class="kinderliste">${S.kinder().map(k => `<li>${k.aktiv ? "👉 " : ""}<b>${k.name || "(noch ohne Namen)"}</b>${k.aktiv ? " – gerade aktiv" : ` <button class="knopf klein-k" data-wechsel="${k.id}">Wechseln</button>`}${S.kinder().length > 1 ? ` <button class="knopf klein-k" data-weg="${k.id}">Entfernen</button>` : ""}</li>`).join("")}</ul>
        <div class="knoepfe"><button class="knopf" id="kind-neu">➕ Kind hinzufügen</button></div>
        <p class="klein">Jedes Kind hat einen eigenen Spielstand. Gibt es mehrere Kinder, fragt die Startseite zuerst „Wer spielt?“. Die PIN gilt für alle.</p>
      </div>
      <div class="karte">
        <h2>Kind und Einstellungen</h2>
        <p><b>${S.profil.name}</b>, ${S.kind().alter} Jahre${S.kind().geburt ? ` (Geburtstag ${S.kind().geburt.split("-").slice(1).reverse().join(".")}.)` : ""}, ${S.stufe().name}, ${S.land().name} · Muttersprache: ${(S.MUTTERSPRACHEN.find(x => x[0] === S.kind().muttersprache) || S.MUTTERSPRACHEN[0])[1].split(" – ")[0]}, ${S.DEUTSCHSTAND.find(x => x.code === S.kind().deutschstand).name} · Hilfesprache: ${(SPRACHEN.find(x => x[0] === S.kind().hilfesprache) || SPRACHEN[0])[1].replace(" (in Arbeit)", "")} · Wetter-Ort: ${(S.kind().ort || {}).lat != null ? S.kind().ort.name : "keiner"}</p>
        <p class="hinweis"><b>Empfehlung der Kinderärzte (DGKJ):</b> ${empfehlung(S.kind().alter)}</p>
        <div class="knoepfe"><button class="knopf haupt" id="erwachsen">👤 Als Erwachsener spielen</button><button class="knopf" id="kind-aendern">Ändern</button><button class="knopf" id="neu-laden">🔄 App neu laden</button></div>
        <p class="klein">„Als Erwachsener spielen“ öffnet für eine Stunde alles, ohne Sperren und Zeitgrenzen; dabei werden keine Sterne und kein Fortschritt fürs Kind gespeichert (bis „Beenden“ oder die App geschlossen wird). „App neu laden“ holt die neueste Version. Der Spielstand bleibt erhalten.</p>
      </div>
      <div class="karte" id="geschenk-karte">
        <h2>🎁 Geschenk-Code einlösen</h2>
        <p>Mit einem Geschenk-Code der Lerninsel bekommt <b>${S.profil.name}</b> ein Paket am Steg der Insel (z. B. einen Tannenbaum fürs Zimmer). Jeder Code gilt einmal je Kind; gefälschte Codes werden erkannt.</p>
        ${window.Geschenk && window.Geschenk.eingerichtet ? "" : `<p class="hinweis">Auf diesem Gerät sind Geschenk-Codes noch nicht eingerichtet (es fehlt der öffentliche Schlüssel der Lerninsel).</p>`}
        <div class="knoepfe"><button class="knopf" id="geschenk-scan">📷 Code scannen</button></div>
        <video id="geschenk-video" playsinline muted hidden style="width:100%;max-width:360px;border-radius:18px;margin:8px 0"></video>
        <label class="feld-zeile">Oder Code einfügen: <input id="geschenk-text" type="text" autocomplete="off" spellcheck="false" style="width:100%"></label>
        <div class="knoepfe"><button class="knopf haupt" id="geschenk-ok">Einlösen</button></div>
        <p id="geschenk-meldung" class="klein" aria-live="polite"></p>
      </div>
      <div class="karte">
        <h2>Hinweise</h2>
        <p>Alle Daten bleiben nur auf diesem Tablet, nichts wird ins Internet geschickt. Den Spielstand kannst du auf der Startseite unter „💾 Spielstand“ sichern oder aufs andere Tablet übertragen.</p>
        <div class="knoepfe"><button class="knopf" id="pin-neu">PIN ändern</button><button class="knopf" id="abmelden">Bereich schließen</button></div>
      </div>
      </section>
`;
    $("pin-neu").addEventListener("click", () => { S.setzePin(null); sessionStorage.removeItem(SITZUNG); pinSeite(); });
    $("erwachsen").addEventListener("click", () => { S.setzeErwachsen(60); location.href = "../../"; });
    $("kind-aendern").addEventListener("click", () => einrichtung(true));
    if ($("geburt-eintragen")) $("geburt-eintragen").addEventListener("click", () => einrichtung(true));
    if ($("prolog-neu")) $("prolog-neu").addEventListener("click", () => { window.Story.etappeZuruecksetzen("E1"); S.meldung("Die Ankunft startet beim nächsten Besuch der Insel."); uebersicht(); });
    if ($("prolog-weg")) $("prolog-weg").addEventListener("click", () => { window.Story.etappeFertig("E1"); S.meldung("Ankunft übersprungen."); uebersicht(); });
    // Einführung E2–E8 überspringen (still: zählt nicht als neue Etappe); E3 öffnet Kapitel 1 wie in der Szene „Erste Frucht“
    if ($("tutorial-weg")) $("tutorial-weg").addEventListener("click", () => { TUTORIAL.forEach(e => window.Story.etappeFertig(e, true)); window.Story.setzeKapitel(1); S.meldung("Einführung übersprungen."); uebersicht(); });
    const en = $("einst-neu"); if (en) en.addEventListener("click", () => { const m = S.lade("mathe") || {}; delete m.einstufung; m.einstufungAngebot = true; m.k2 = m.k2 || {}; S.speichere("mathe", m); S.meldung("Der Test wird beim nächsten Öffnen des Matheweges angeboten."); uebersicht(); });
    geschenkKnoepfe();
    zeitKnoepfe(); inselKnoepfe(); matheKnoepfe(); englischKnoepfe(); sorbischKnoepfe(); schuljahrKnoepfe(); deutschKnoepfe(); echteWeltKnoepfe(); staerkenKnoepfe();
    $("kind-neu").addEventListener("click", () => {
      const id = S.neuesKind(); if (!id) { S.meldung("Mehr als 8 Kinder gehen nicht."); return; }
      S.wechsleKind(id); location.href = "./?einrichtung=1";
    });
    inhalt.querySelectorAll("[data-wechsel]").forEach(b => b.addEventListener("click", () => { S.wechsleKind(b.dataset.wechsel); location.reload(); }));
    inhalt.querySelectorAll("[data-weg]").forEach(b => b.addEventListener("click", () => {
      const k = S.kinder().find(x => x.id === b.dataset.weg);
      if (!confirm(`${k.name || "Dieses Kind"} und den ganzen Spielstand wirklich löschen? Das lässt sich nicht rückgängig machen.`)) return;
      const weg = Promise.all([window.Bilder ? window.Bilder.loescheKind(k.id).catch(() => {}) : null, window.Eigenes ? window.Eigenes.loescheKind(k.id).catch(() => {}) : null]); S.entferneKind(k.id); weg.then(() => location.reload());
    }));
    $("neu-laden").addEventListener("click", neuLaden);
    // Lehrplan je Fach auf- und zuklappen (Test-Haken __elternAlle: alles offen)
    if (window.__elternAlle) inhalt.querySelectorAll("h3.lp-fach.lp-zu").forEach(h => { h.nextElementSibling.hidden = false; h.classList.add("offen"); h.setAttribute("aria-expanded", true); });
    inhalt.querySelectorAll("h3.lp-fach.lp-zu").forEach(h => { const auf = () => { const ul = h.nextElementSibling, zu = !ul.hidden; ul.hidden = zu; h.setAttribute("aria-expanded", !zu); h.classList.toggle("offen", !zu); };
      h.addEventListener("click", auf); h.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); auf(); } }); });
    // Reiter (30.10.2026): Überblick, Lernstand, Wie in der Schule, Zeit & Regeln, Kinder & Gerät; gemerkt für diese Sitzung.
    // Test-Haken window.__elternAlle zeigt alle Teile untereinander (ältere Tests bedienen Felder aus allen Teilen).
    const teile = [...inhalt.querySelectorAll(".eltern-teil")];
    const zeigeTeil = (n) => {
      if (!teile.some(x => x.dataset.teil === n)) n = "ueberblick";
      inhalt.querySelectorAll(".eltern-reiter button").forEach(b => { const an = b.dataset.teil === n; b.classList.toggle("an", an); b.setAttribute("aria-selected", an); });
      teile.forEach(x => { x.hidden = !window.__elternAlle && x.dataset.teil !== n; });
      try { sessionStorage.setItem("eltern-teil", n); } catch (e) { }
    };
    inhalt.querySelectorAll(".eltern-reiter button").forEach(b => b.addEventListener("click", () => { S.ton("tipp"); zeigeTeil(b.dataset.teil); scrollTo(0, 0); }));
    let teilStart = location.hash.slice(1); try { teilStart = teilStart || sessionStorage.getItem("eltern-teil") || "ueberblick"; } catch (e) { }
    zeigeTeil(teilStart);
    window.__eltern = Object.assign(window.__eltern || {}, { teil: zeigeTeil });
    $("abmelden").addEventListener("click", () => { sessionStorage.removeItem(SITZUNG); location.href = "../ich/"; });
  }

  if (sessionStorage.getItem(SITZUNG) && S.pin()) { if (S.eingerichtet()) uebersicht(); else einrichtung(false); } else pinSeite();
})();
