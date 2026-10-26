// Schatzkammer: Pokale, Wochen-Medaillen, Schätze nach Monaten, Funde je Fach.
(function () {
  const S = window.Spielwelt, L = window.Lernfunde, SC = window.Schatz, C = window.Charakter, $ = (id) => document.getElementById(id);
  const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  function zeichne() {
    $("sterne").textContent = S.sterne();
    const z = L.zaehler(), b = L.baum(), pk = SC.pokale(), med = SC.medaillen();
    $("zahlen").innerHTML = [[L.gesamt(), "Lernfunde"], [z.gemeistert || 0, "schwere Aufgaben gemeistert"], [pk.filter(p => p.hat).length + " / " + pk.length, "Pokale"], [`Stufe ${b.stufe}`, "Wissensbaum"]]
      .map(([w, t]) => `<div class="zahl"><b>${w}</b>${t}</div>`).join("");
    const w = SC.woche();
    $("woche").innerHTML = `<div class="woche-ch"><span class="e">${w.e}</span><p>${w.text}</p><b>${w.wert} / ${w.ziel}</b></div><div class="balken"><span style="width:${Math.round(w.wert / w.ziel * 100)}%"></span></div>` +
      (w.fertig ? `<p class="klein" style="margin-top:8px">🥇 Geschafft! Nächste Woche kommt eine neue Herausforderung.</p>` : w.bereit ? `<button class="knopf haupt" id="abholen" style="margin-top:10px">🥇 Medaille abholen (+3 ⭐)</button>` : `<p class="klein" style="margin-top:8px">Jeden Montag gibt es eine neue Herausforderung.</p>`);
    const ab = $("abholen"); if (ab) ab.addEventListener("click", () => { if (SC.abholen()) { C.hinweis("🥇 Wochen-Medaille!", "+3 ⭐ – stark gemacht diese Woche!", "#D08A1E"); } zeichne(); });
    $("pokale").innerHTML = pk.map(p => `<div class="pokal ${p.hat ? "" : "zu"}"><span class="e" aria-hidden="true">${p.e}</span><b>${esc(p.name)}</b><span class="t">${esc(p.text)}</span>` +
      (p.hat ? "" : `<div class="balken" aria-label="${p.wert} von ${p.ziel}"><span style="width:${Math.round(p.wert / p.ziel * 100)}%"></span></div><span class="t">${p.wert} / ${p.ziel}</span>`) + `</div>`).join("");
    $("medaillen").innerHTML = med.length ? med.slice(0, 52).map(m => `<span class="medaille" title="Woche ab ${m.woche}">${m.e}</span>`).join("") : `<p class="klein">Schaffe eine Wochen-Herausforderung – dann bekommst du hier deine erste Medaille.</p>`;
    const F = L.FAECHER, max = Math.max(1, ...Object.keys(F).map(f => z["f:" + f] || 0));
    $("faecher").innerHTML = Object.entries(F).map(([id, f]) => `<div class="fach-zeile"><span>${f.e} ${f.name}</span><div class="balken"><span style="width:${Math.round((z["f:" + id] || 0) / max * 100)}%"></span></div><span>${z["f:" + id] || 0}</span></div>`).join("");
    const sch = L.schaetze().slice().reverse(), gruppen = {};
    sch.forEach(x => { const k = x.d.slice(0, 7); (gruppen[k] = gruppen[k] || []).push(x); });
    const ART = { gemeistert: "💪 gemeistert", erklaert: "❤️ erklärt", welt: "🌍 Echte Welt" };
    $("schaetze").innerHTML = sch.length ? Object.entries(gruppen).map(([k, l]) => `<div class="monat"><h3>${MONATE[+k.slice(5) - 1]} ${k.slice(0, 4)}</h3>` +
      l.map(x => `<div class="schatz"><span class="e" aria-hidden="true">${x.e}</span><span>${esc(x.t)}<br><small>${x.d.slice(8)}.${x.d.slice(5, 7)}.</small></span><small>${ART[x.a] || ""}</small></div>`).join("") + `</div>`).join("")
      : `<p class="klein" style="margin-top:8px">Noch leer. Meistere eine schwere Aufgabe, erkläre etwas oder schaffe eine Echte-Welt-Aufgabe!</p>`;
  }
  zeichne();
  SC.neuePokale();
})();
