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
      <div class="zwei">
        <label>Alter<select id="e-alter">${option([5, 6, 7, 8, 9, 10, 11].map(n => [n, n + " Jahre"]), k.alter)}</select></label>
        <label>Klasse<select id="e-klasse">${option([1, 2, 3, 4].map(n => [n, n + ". Klasse"]), k.klasse)}</select></label>
      </div>
      <div class="zwei">
        <label>Ansprache in der App<select id="e-geschlecht">${option(ANSPRACHE, k.geschlecht)}</select></label>
        <label>Hilfesprache (Muttersprache)<select id="e-sprache">${option(SPRACHEN, k.hilfesprache)}</select></label>
      </div>
      <p class="hinweis" id="e-empf"></p>
      <p class="fehler" id="e-fehler"></p>
      <div class="knoepfe"><button class="knopf haupt" id="e-ok">${bearbeiten ? "Speichern" : "Fertig – los geht's"}</button>${bearbeiten ? `<button class="knopf" id="e-zurueck">Abbrechen</button>` : ""}</div>
    </div>`;
    const empf = () => { $("e-empf").innerHTML = `<b>Empfehlung der Kinderärzte (DGKJ):</b> ${empfehlung(+$("e-alter").value)} Wichtiger als die Minuten: Bewegung, freies Spiel, Freunde, genug Schlaf und bildschirmfreie Zeiten, z. B. beim Essen und vor dem Schlafen.`; };
    $("e-alter").addEventListener("change", empf); empf();
    setTimeout(() => { const x = $("e-name"); if (x) x.focus(); }, 50);
    $("e-ok").addEventListener("click", () => {
      const n = $("e-name").value.trim();
      if (!n) { $("e-fehler").textContent = "Bitte einen Vornamen eingeben."; $("e-name").focus(); return; }
      S.setzeName(n);
      S.speichere("eltern", Object.assign(eltern(), { eingerichtet: true, kind: {
        alter: +$("e-alter").value, klasse: +$("e-klasse").value, geschlecht: $("e-geschlecht").value, hilfesprache: $("e-sprache").value } }));
      if (bearbeiten) { S.meldung("Gespeichert."); uebersicht(); } else location.href = "../../";
    });
    if (bearbeiten) $("e-zurueck").addEventListener("click", uebersicht);
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
  }

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

    const stationen = window.Mathe.STATIONEN.map(s => {
      const x = stat[s.id], n = x ? x.r + x.f : 0, q = n ? x.r / n : null;
      return `<tr><td>${s.name}</td><td class="zahl-r">${k2[s.id] ? "⭐".repeat(k2[s.id]) : "–"}</td><td class="zahl-r">${n || "–"}</td><td class="zahl-r"><span class="quote ${quoteKlasse(n >= 3 ? q : null)}">${prozent(q)}</span></td></tr>`;
    }).join("");
    const schwach = window.Mathe.STATIONEN.map(s => ({ s, x: stat[s.id] })).filter(o => o.x && o.x.r + o.x.f >= 5 && o.x.r / (o.x.r + o.x.f) < 0.7);
    const fehler = (mathe.fehler || []).slice(-10).reverse();

    inhalt.innerHTML = `
      <div class="karte">
        <h2>${S.profil.name || "Spielstand"} auf einen Blick</h2>
        <div class="zahlen">
          <div class="zahl"><b>${S.sterne()} ⭐</b><span>Sterne gerade</span></div>
          <div class="zahl"><b>${C.gesamt()}</b><span>Gesamtstufe (${C.titel()})</span></div>
          <div class="zahl"><b>${stempel.length}</b><span>Tage mit allen Tagesaufgaben</span></div>
          <div class="zahl"><b>${gesR + gesF ? Math.round(gesR / (gesR + gesF) * 100) + " %" : "–"}</b><span>Mathe beim 1. Versuch richtig (${gesR + gesF} Aufgaben)</span></div>
        </div>
      </div>
      <div class="karte">
        <h2>Fähigkeiten</h2>
        <table><tr><th>Fähigkeit</th><th class="r">Stufe</th><th class="r">Punkte</th><th>Wächst durch</th></tr>
          ${C.FAEHIGKEITEN.map(f => `<tr><td>${f.icon} ${f.name}</td><td class="zahl-r">${C.stufe(f.id)}</td><td class="zahl-r">${C.xp(f.id)}</td><td>${f.woher}</td></tr>`).join("")}
        </table>
      </div>
      <div class="karte">
        <h2>Tagesaufgaben</h2>
        <p>Heute: ${tag.erledigt.length} von ${aufgaben.length} geschafft (${aufgaben.map(a => `${a.erledigt ? "✓" : "○"} ${a.titel}`).join(", ")}).</p>
        <p class="klein">Rosa Tage: alle Tagesaufgaben geschafft. Die letzten 4 Wochen:</p>
        <div class="kalender">${kal}</div>
      </div>
      <div class="karte">
        <h2>Mathe: Matheweg 2. Klasse</h2>
        ${schwach.length ? `<p><b>Braucht noch Übung:</b> ${schwach.map(o => o.s.name).join(", ")}. Das tägliche Mathe-Training übt diese Themen automatisch öfter.</p>` : `<p>Zurzeit keine auffälligen Schwächen (ab 5 gelösten Aufgaben pro Station bewertet).</p>`}
        <table><tr><th>Station</th><th class="r">Bestes Ergebnis</th><th class="r">Aufgaben</th><th class="r">1. Versuch richtig</th></tr>${stationen}</table>
      </div>
      <div class="karte">
        <h2>Zuletzt falsch gelöst</h2>
        ${fehler.length ? `<ul class="liste">${fehler.map(f => `<li>${f.text || f.frage} → richtig: <b>${f.antwort}${f.einheit ? " " + f.einheit : ""}</b></li>`).join("")}</ul><p class="klein">Diese Aufgaben kommen im Mathe-Training wieder, bis sie sitzen.</p>` : `<p>Noch keine gemerkten Fehler.</p>`}
      </div>
      <div class="karte">
        <h2>Deutsch, Sachkunde, Tablet-Führerschein und 3D-Welt</h2>
        <p><b>Abenteuer:</b> ${window.GESCHICHTE.map(k => `${k.name} ${deutsch.kapitel && deutsch.kapitel[k.id] ? "⭐".repeat(deutsch.kapitel[k.id]) : "–"}`).join(", ")}</p>
        <p><b>Sachkunde:</b> ${(() => { const sk = S.lade("sachkunde") || {}; return window.THEMEN.map(t => `${t.name} ${sk.themen && sk.themen[t.id] ? "⭐".repeat(sk.themen[t.id]) : "–"}`).join(", "); })()}</p>
        <p><b>Führerschein:</b> ${medien.fuehrerschein ? `bestanden am ${medien.fuehrerschein.split("-").reverse().join(".")}` : `${window.LEKTIONEN.filter(l => medien.lektionen && medien.lektionen[l.id]).length} von ${window.LEKTIONEN.length} Lektionen`}</p>
        <p><b>Haustier:</b> ${(() => { const t = S.lade("tier"); return !t || !t.phase ? "noch kein Ei ausgesucht" : t.phase === "ei" ? `Ei wird gewärmt (${t.waerme || 0} von 3)` : `${t.name || "ohne Namen"}, Freundschaft ${t.freundschaft || 0}, ${t.leckerli || 0} Leckerli`; })()}</p>
        <p><b>3D-Welt:</b> Ballon-Rekord ${(welt.ballon && welt.ballon.rekord) || 0} Punkte, Insel-Schatz ${(welt.insel && welt.insel.geschafft) || 0}× gefunden</p>
      </div>
      ${zeitKarte()}
      <div class="karte">
        <h2>Kinder auf diesem Tablet</h2>
        <ul class="kinderliste">${S.kinder().map(k => `<li>${k.aktiv ? "👉 " : ""}<b>${k.name || "(noch ohne Namen)"}</b>${k.aktiv ? " – gerade aktiv" : ` <button class="knopf klein-k" data-wechsel="${k.id}">Wechseln</button>`}${S.kinder().length > 1 ? ` <button class="knopf klein-k" data-weg="${k.id}">Entfernen</button>` : ""}</li>`).join("")}</ul>
        <div class="knoepfe"><button class="knopf" id="kind-neu">➕ Kind hinzufügen</button></div>
        <p class="klein">Jedes Kind hat einen eigenen Spielstand. Gibt es mehrere Kinder, fragt die Startseite zuerst „Wer spielt?“. Die PIN gilt für alle.</p>
      </div>
      <div class="karte">
        <h2>Kind und Einstellungen</h2>
        <p><b>${S.profil.name}</b>, ${S.kind().alter} Jahre, ${S.kind().klasse}. Klasse · Hilfesprache: ${(SPRACHEN.find(x => x[0] === S.kind().hilfesprache) || SPRACHEN[0])[1].replace(" (in Arbeit)", "")}</p>
        <p class="hinweis"><b>Empfehlung der Kinderärzte (DGKJ):</b> ${empfehlung(S.kind().alter)}</p>
        <div class="knoepfe"><button class="knopf haupt" id="erwachsen">👤 Als Erwachsener spielen</button><button class="knopf" id="kind-aendern">Ändern</button><button class="knopf" id="neu-laden">🔄 App neu laden</button></div>
        <p class="klein">„Als Erwachsener spielen“ öffnet für eine Stunde alles, ohne Sperren und Zeitgrenzen; dabei werden keine Sterne und kein Fortschritt fürs Kind gespeichert (bis „Beenden“ oder die App geschlossen wird). „App neu laden“ holt die neueste Version. Der Spielstand bleibt erhalten.</p>
      </div>
      <div class="karte">
        <h2>Hinweise</h2>
        <p>Alle Daten bleiben nur auf diesem Tablet, nichts wird ins Internet geschickt. Den Spielstand kannst du auf der Startseite unter „💾 Spielstand“ sichern oder aufs andere Tablet übertragen.</p>
        <div class="knoepfe"><button class="knopf" id="pin-neu">PIN ändern</button><button class="knopf" id="abmelden">Bereich schließen</button></div>
      </div>`;
    $("pin-neu").addEventListener("click", () => { S.setzePin(null); sessionStorage.removeItem(SITZUNG); pinSeite(); });
    $("erwachsen").addEventListener("click", () => { S.setzeErwachsen(60); location.href = "../../"; });
    $("kind-aendern").addEventListener("click", () => einrichtung(true));
    zeitKnoepfe();
    $("kind-neu").addEventListener("click", () => {
      const id = S.neuesKind(); if (!id) { S.meldung("Mehr als 8 Kinder gehen nicht."); return; }
      S.wechsleKind(id); location.href = "./?einrichtung=1";
    });
    inhalt.querySelectorAll("[data-wechsel]").forEach(b => b.addEventListener("click", () => { S.wechsleKind(b.dataset.wechsel); location.reload(); }));
    inhalt.querySelectorAll("[data-weg]").forEach(b => b.addEventListener("click", () => {
      const k = S.kinder().find(x => x.id === b.dataset.weg);
      if (!confirm(`${k.name || "Dieses Kind"} und den ganzen Spielstand wirklich löschen? Das lässt sich nicht rückgängig machen.`)) return;
      S.entferneKind(k.id); location.reload();
    }));
    $("neu-laden").addEventListener("click", neuLaden);
    $("abmelden").addEventListener("click", () => { sessionStorage.removeItem(SITZUNG); location.href = "../ich/"; });
  }

  if (sessionStorage.getItem(SITZUNG) && S.pin()) { if (S.eingerichtet()) uebersicht(); else einrichtung(false); } else pinSeite();
})();
