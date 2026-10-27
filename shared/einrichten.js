// Zimmer einrichten (NA-28): Laden für Möbel und Wandfarben – gleich für beide Looks („Rund“ und „Pixel“).
// Möbel, Plätze, Preise und Wandfarben kommen aus dem Insel-Kern (shared/insel-kern.js); hier nur Ablauf und Oberfläche.
// Die Seite braucht das Markup #laden (#laden-titel, #laden-text, #laden-liste, #laden-zu) und #sterne.
// Benutzung:
//   Einrichten.verbinde({ neu: () => stelleMoebel(),            // nach jeder Änderung: Möbel und Wand neu zeichnen
//                         ringe: (an, besetzt) => { … } })      // Plätze im Zimmer zeigen (an = Möbel gewählt; besetzt[i] je Platz)
//   Einrichten.oeffne()   Einrichten.zu()   Einrichten.offen
// Gekauftes bleibt für immer (Sterne → S.schalteFrei); Geschenk-Möbel erscheinen nur, wenn das Kind sie bekommen hat.
(function (W) {
  "use strict";
  const $ = (id) => document.getElementById(id);
  let opt = { neu: () => {}, ringe: () => {} }, wahl = null, verbunden = false;
  const S = () => W.Spielwelt, K = () => W.InselKern;

  function ringe() {
    const d = K().zimmerDaten();
    opt.ringe(!!wahl, K().PLAETZE.map(pl => !!d.plaetze[pl.id]));
  }
  function zeige(text) {
    const k = K(), d = k.zimmerDaten(), L = $("laden-liste"), MOEBEL = k.MOEBEL, PLAETZE = k.PLAETZE;
    $("laden").hidden = false; if ($("blase")) $("blase").hidden = true;
    ringe();
    if (wahl) {
      const m = MOEBEL.find(x => x.id === wahl), steht = Object.keys(d.plaetze).find(p => d.plaetze[p] === m.id);
      $("laden-titel").textContent = `${m.e} ${m.name}: Wohin?`;
      $("laden-text").textContent = text || "Die Ringe im Zimmer zeigen die Plätze.";
      L.innerHTML = PLAETZE.map((pl, i) => { const da = MOEBEL.find(x => x.id === d.plaetze[pl.id]); return `<button class="ware" data-platz="${pl.id}"><b>${i + 1}. ${pl.name}</b><span>${da ? (da.id === m.id ? "✓ steht hier" : `${da.e} ${da.name}`) : "frei"}</span></button>`; }).join("")
        + (steht ? `<button class="ware weg" data-weg="1"><b>📦 Wegräumen</b><span>in den Keller</span></button>` : "") + `<button class="ware weg" data-zurueck="1"><b>⬅️ Zurück</b></button>`;
      return;
    }
    $("laden-titel").textContent = "🛋️ Zimmer einrichten"; $("laden-text").textContent = text || "Kaufe Möbel mit deinen Sternen und stell sie auf. Gekauftes bleibt für immer deins.";
    const karte = (id, e, name, preis, info, extra) => `<button class="ware${k.besitzt(id, preis) ? " hat" : ""}" ${extra}><span class="e">${e}</span><b>${name}</b><span>${k.besitzt(id, preis) ? info : `⭐ ${preis}`}</span></button>`;
    L.innerHTML = `<h3>Möbel</h3><div class="waren">` + MOEBEL.filter(m => !m.geschenk || S().istFrei("moebel-" + m.id)).map(m => { const steht = PLAETZE.find(pl => d.plaetze[pl.id] === m.id); return karte("moebel-" + m.id, m.e, m.name, m.preis, steht ? `✓ ${steht.name}` : "✓ Hinstellen", `data-moebel="${m.id}"`); }).join("")
      + `</div><h3>Wandfarbe</h3><div class="waren">` + k.WANDFARBEN.map(w => karte("wand-" + w.id, `<i style="background:${w.farbe[0]}"></i>`, w.name, w.preis, d.wand === w.id ? "✓ an der Wand" : "✓ Streichen", `data-wand="${w.id}"`)).join("") + `</div>`;
  }
  function kaufe(id, preis) {
    if (K().besitzt(id, preis)) return true;
    if (S().schalteFrei(id, preis)) { if ($("sterne")) $("sterne").textContent = S().sterne(); S().ton("juhu"); return true; }
    S().ton("nein"); zeige(`Dafür brauchst du ${preis} Sterne. Dir fehlen noch ${preis - S().sterne()}. Beim Lernen sammelst du neue!`); return false;
  }
  function klick(ev) {
    const b = ev.target.closest("button"); if (!b) return;
    const k = K(), d = k.zimmerDaten(), speichern = () => { S().speichere("zimmer", d); opt.neu(); };
    if (b.dataset.moebel) { const m = k.MOEBEL.find(x => x.id === b.dataset.moebel); if (kaufe("moebel-" + m.id, m.preis)) { wahl = m.id; zeige(); } return; }
    if (b.dataset.wand) { const w = k.WANDFARBEN.find(x => x.id === b.dataset.wand); if (kaufe("wand-" + w.id, w.preis)) { d.wand = w.id; speichern(); zeige("Frisch gestrichen!"); } return; }
    if (b.dataset.zurueck) { wahl = null; zeige(); return; }
    const raus = () => Object.keys(d.plaetze).forEach(p => { if (d.plaetze[p] === wahl) delete d.plaetze[p]; });
    if (b.dataset.weg) { raus(); speichern(); wahl = null; zeige("Weggeräumt. Du kannst es jederzeit wieder hinstellen."); return; }
    if (b.dataset.platz) {
      raus(); d.plaetze[b.dataset.platz] = wahl; speichern(); S().ton("tipp");
      const pl = k.PLAETZE.find(x => x.id === b.dataset.platz), m = k.MOEBEL.find(x => x.id === wahl);
      wahl = null; zeige(`${m.e} ${m.name} steht jetzt ${pl.name}.`);
    }
  }
  function zu() { if ($("laden")) $("laden").hidden = true; wahl = null; opt.ringe(false, []); }

  W.Einrichten = {
    verbinde(o) {
      opt = Object.assign({ neu: () => {}, ringe: () => {} }, o || {});
      if (verbunden) return; verbunden = true;
      $("laden-liste").addEventListener("click", klick);
      $("laden-zu").addEventListener("click", zu);
    },
    oeffne(text) { wahl = null; zeige(text); },
    zu,
    get offen() { return !!$("laden") && !$("laden").hidden; },
    get wahl() { return wahl; }
  };
})(window);
