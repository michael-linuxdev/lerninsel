// „Mein Heft“ (29.10.2026): Das Kind findet seine eigenen Texte und Aufnahmen aus der Wörter-Werkstatt wieder, liest sie (oder lässt sie
// vorlesen) und hört sich selbst. Daten aus shared/eigenes.js (eigene IndexedDB, verlässt das Gerät nie). Löschen können nur die Eltern
// (Elternbereich) – im Heft geht nichts verloren.
(function () {
  const S = window.Spielwelt, SP = window.Sprache, E = window.Eigenes;
  const $ = (id) => document.getElementById(id);
  const esc = (t) => String(t || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const SONDER = { vorlesen: { name: "Vorlesen", ort: "🎙️" }, gestalten: { name: "Text gestaltet", ort: "✍️" }, podcast: { name: "Podcast", ort: "🎧" } };
  const kapitel = (id) => SONDER[id] || (window.WERKSTATT || []).find(k => k.id === id) || { name: "Wörter-Werkstatt", ort: "✏️" };
  const datum = (t) => new Date(t).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
  let art = "text", liste = { text: [], ton: [] }, urls = [];

  function zeichne() {
    $("r-text").classList.toggle("an", art === "text"); $("r-ton").classList.toggle("an", art === "ton");
    $("n-text").textContent = liste.text.length ? `(${liste.text.length})` : ""; $("n-ton").textContent = liste.ton.length ? `(${liste.ton.length})` : "";
    urls.forEach(u => URL.revokeObjectURL(u)); urls = [];
    const l = liste[art], B = $("blatt");
    if (!l.length) {
      B.innerHTML = `<div class="leer"><div class="gross">${art === "text" ? "✏️" : "🎙️"}</div>
        <p>${art === "text" ? "Dein Heft ist noch leer. In der Wörter-Werkstatt kannst du eigene Texte schreiben – sie landen dann hier." :
          E && E.darfAufnehmen && E.darfAufnehmen() ? "Noch keine Aufnahmen. In der Wörter-Werkstatt kannst du dich beim Vorlesen aufnehmen." :
          "Noch keine Aufnahmen. Sich selbst aufnehmen können deine Eltern im Elternbereich erlauben."}</p>
        <a class="knopf haupt" href="../deutsch/">🦊 Zur Wörter-Werkstatt</a></div>`;
      return;
    }
    B.innerHTML = l.map((e, i) => { const k = kapitel(e.kapitel);
      return `<article class="seite" data-i="${i}"><div class="kopf"><span class="e" aria-hidden="true">${k.ort || "✏️"}</span><span>${esc(k.name)}</span><span>· ${datum(e.t)}</span></div>
        ${e.aufgabe ? `<p class="aufgabe">${esc(e.aufgabe)}</p>` : ""}
        ${art === "text" ? `<p class="text">${esc(e.text)}</p><div class="knoepfe">${SP && SP.verfuegbar() ? `<button class="knopf vorlesen" data-i="${i}">🔊 Vorlesen</button>` : ""}</div>`
          : `<audio controls preload="none" data-i="${i}"></audio><p class="aufgabe">${e.dauer ? `${e.dauer} Sekunden` : ""}</p>`}</article>`; }).join("");
    B.querySelectorAll(".vorlesen").forEach(b => b.addEventListener("click", () => { S.ton("tipp"); SP.sprich(l[+b.dataset.i].text, "de-DE"); }));
    B.querySelectorAll("audio").forEach(a => { const u = E.url(l[+a.dataset.i]); urls.push(u); a.src = u; });
  }
  async function lade() {
    try { if (E) { liste.text = await E.alle(undefined, "text"); liste.ton = await E.alle(undefined, "ton"); } } catch (x) { /* kein IndexedDB: leeres Heft */ }
    if (!liste.text.length && liste.ton.length) art = "ton";
    zeichne();
  }
  $("r-text").addEventListener("click", () => { art = "text"; S.ton("tipp"); if (SP) SP.stopp(); zeichne(); });
  $("r-ton").addEventListener("click", () => { art = "ton"; S.ton("tipp"); if (SP) SP.stopp(); zeichne(); });
  lade();
  window.__heft = { lade, art: () => art, anzahl: () => ({ text: liste.text.length, ton: liste.ton.length }) };
})();
