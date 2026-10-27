// Stickeralbum: Seiten mit Reitern, fehlende Sticker als Umriss mit Hinweis, neue Sticker markiert.
(function () {
  const S = window.Spielwelt, ST = window.Sticker, SP = window.Sprache;
  const $ = (id) => document.getElementById(id);
  const q = new URLSearchParams(location.search);
  if (q.get("von") === "insel") $("zurueck").href = "../insel/?drinnen=1";
  ST.feste();
  const d = ST.daten(), neu = new Set(d.neu);
  ST.gesehen(); // Markierung nur bei diesem Besuch zeigen
  const hl = S.hilfe && S.hilfe();
  const WIE = { lernen: "Gibt es fürs Lernen", entdecken: "Gibt es fürs Entdecken auf der Insel", feste: "Gibt es an Festtagen" };
  let aktiv = Math.max(0, ST.SEITEN.findIndex(s => s.sticker.some(([id]) => neu.has(id))));

  const st = ST.stand();
  $("zaehler").textContent = `${st.hat} / ${st.gesamt}`;
  $("wie").textContent = `Alle ${ST.PRO_STICKER} gelösten Aufgaben gibt es einen Sticker (bis zu ${ST.MAX_TAG} am Tag). Wetter-Sticker findest du auf der Insel, Fest-Sticker an Festtagen.`;

  function reiter() {
    $("reiter").innerHTML = ST.SEITEN.map((s, i) => {
      const n = s.sticker.filter(([id]) => d.hat[id]).length, punkt = s.sticker.some(([id]) => neu.has(id));
      return `<button role="tab" aria-selected="${i === aktiv}" class="${i === aktiv ? "an" : ""}" data-i="${i}">${s.sticker[0][1]} ${s.name} ${n}/${s.sticker.length}${punkt ? '<span class="punkt"></span>' : ""}</button>`;
    }).join("");
  }
  function seite() {
    const s = ST.SEITEN[aktiv], el = $("seite");
    el.style.background = s.farbe;
    const voll = s.sticker.every(([id]) => d.hat[id]);
    el.innerHTML = `<h2>${s.name}${voll ? " 🏆" : ""}</h2><p class="klein">${voll ? "Seite komplett!" : WIE[s.woher]}${hl && hl.code === "ru" ? " · " + s.ru : ""}</p>
      <div class="feld">${s.sticker.map(([id, e, name]) => {
        const n = d.hat[id] || 0;
        return `<button class="st ${n ? "hat" : "fehlt"}" data-id="${id}">${neu.has(id) ? '<span class="neu">neu!</span>' : ""}${n > 1 ? `<span class="anz">×${n}</span>` : ""}<span class="e">${e}</span><b>${n ? name : "?"}</b></button>`;
      }).join("")}</div>`;
  }
  function gross(id) {
    const x = ST.ALLE[id], n = d.hat[id] || 0, k = $("gross-karte");
    if (n) {
      k.innerHTML = `<div class="e">${x.e}</div><h2>${x.name}</h2>${hl && hl.code === "ru" ? `<p><span class="ru" lang="ru">${x.ru}</span></p>` : ""}
        <p>${n > 1 ? `Du hast ihn ${n}-mal. Doppelte kannst du bald mit Freunden tauschen.` : "Klebt in deinem Album."}</p>
        <div class="knoepfe"><button class="knopf" id="g-hoer">🔊 Anhören</button><button class="knopf haupt" id="g-zu">Schließen</button></div>`;
      if (SP && SP.sprich) SP.sprich(x.name, "de-DE");
    } else {
      const s = ST.SEITEN.find(y => y.id === x.seite);
      k.innerHTML = `<div class="e" style="filter:grayscale(1) brightness(.35);opacity:.3">${x.e}</div><h2>Noch nicht gefunden</h2>
        <p>${x.tipp || WIE[s.woher]}</p><div class="knoepfe"><button class="knopf haupt" id="g-zu">Schließen</button></div>`;
    }
    $("gross").hidden = false;
    $("g-zu").addEventListener("click", () => { $("gross").hidden = true; });
    const h = $("g-hoer"); if (h) h.addEventListener("click", () => { SP && SP.sprich(x.name, "de-DE"); if (hl && hl.code === "ru") setTimeout(() => SP.sprich(x.ru, hl.tts), 900); });
  }
  $("reiter").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; aktiv = +b.dataset.i; reiter(); seite(); S.ton("tipp"); });
  $("seite").addEventListener("click", (e) => { const b = e.target.closest(".st"); if (b) { S.ton("tipp"); gross(b.dataset.id); } });
  $("gross").addEventListener("click", (e) => { if (e.target.id === "gross") $("gross").hidden = true; });
  reiter(); seite();
})();
