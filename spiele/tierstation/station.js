// Tierpflege-Station (01.11.2026): Bärin Bruni versorgt Wildtiere der Insel. Das Kind beantwortet drei Fragen (Futter, Pflege, Lebensraum),
// das Tier ruht über Nacht und wird am nächsten (echten) Tag am richtigen Ort ausgewildert. Kein Tier wird krank oder stirbt; nichts hat eine Frist.
// Sonderfall Rehkitz: richtig ist, es liegen zu lassen (die Mutter kommt wieder). Das eigene Tier hilft mit (nur Text, keine Pflicht).
// Daten: profil.daten.tierstation = { gast: { id, tag, ok: { futter, pflege, ort } } | null, frei: { id: n }, fragen: { id: 1 } }. Test-Haken: window.__tierstation.
(function () {
  const S = window.Spielwelt, SP = window.Sprache;
  const $ = (id) => document.getElementById(id);
  const esc = S.esc;
  const misch = (a) => a.map(x => [Math.random(), x]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
  // ab: ab Klasse (0 = Vorschule); fragen: futter, pflege, ort – jeweils o[0] richtig
  const TIERE = [
    { id: "igel", g: "m", name: "Igel", e: "🦔", ab: 0, lz: "su.na.01", wo: "🍂 im Laubhaufen unter der Hecke", warum: "Der Igel hat im Herbst zu wenig gefressen.",
      futter: { f: "Was frisst ein Igel?", ru: "Что ест ёж?", o: ["🐛 Insekten und Würmer", "🥛 Milch", "🍫 Schokolade"], w: "Igel fressen Käfer, Würmer und Schnecken. Milch macht sie krank!" },
      pflege: { f: "Was braucht der Igel jetzt?", ru: "Что сейчас нужно ежу?", o: ["🧣 Wärme und Ruhe", "🎵 laute Musik", "🛁 ein Bad"], w: "Ein schwacher Igel braucht einen warmen, ruhigen Platz." },
      ort: { f: "Wo lassen wir den Igel frei?", ru: "Где мы выпустим ежа?", o: ["🍂 Laubhaufen unter der Hecke", "🌊 im Teich", "🛣️ auf der Straße"], w: "Im Laub kann der Igel seinen Winterschlaf halten." } },
    { id: "amsel", g: "f", name: "Amsel", e: "🐦‍⬛", ab: 0, lz: "su.na.03", wo: "🌳 in der Hecke am Garten", warum: "Die Amsel ist gegen eine Glasscheibe geflogen.",
      futter: { f: "Was frisst eine Amsel?", ru: "Что ест чёрный дрозд?", o: ["🪱 Regenwürmer und Beeren", "🍞 Brot mit Salz", "🧀 Käse"], w: "Amseln picken Würmer aus der Wiese und fressen Beeren." },
      pflege: { f: "Was hilft der Amsel nach dem Schreck?", ru: "Что поможет дрозду после испуга?", o: ["📦 ein dunkler, ruhiger Karton", "👋 viel Streicheln", "💨 Wind vom Föhn"], w: "Im Dunkeln beruhigt sich ein Vogel am besten." },
      ort: { f: "Wo lassen wir die Amsel frei?", ru: "Где мы выпустим дрозда?", o: ["🌳 an der Hecke im Garten", "🏠 im Kinderzimmer", "🌊 mitten im See"], w: "Amseln leben in Gärten, Parks und am Waldrand." } },
    { id: "eichhoernchen", g: "n", name: "Eichhörnchen", e: "🐿️", ab: 1, lz: "su.na.03", wo: "🌲 oben im Kobel im Baum", warum: "Das junge Eichhörnchen ist aus dem Nest gefallen.",
      futter: { f: "Was frisst ein Eichhörnchen?", ru: "Что ест белка?", o: ["🌰 Nüsse und Samen", "🐟 Fisch", "🍬 Bonbons"], w: "Eichhörnchen sammeln Nüsse und verstecken sie für den Winter." },
      pflege: { f: "Was braucht das kleine Eichhörnchen?", ru: "Что нужно бельчонку?", o: ["🧣 ein warmes Nest", "🧊 Eiswürfel", "📺 Fernsehen"], w: "Junge Tiere frieren schnell. Sie brauchen Wärme." },
      ort: { f: "Wo wohnt ein Eichhörnchen?", ru: "Где живёт белка?", o: ["🌲 im Kobel oben im Baum", "🕳️ in einer Höhle im Teich", "🏜️ in der Wüste"], w: "Das Nest im Baum heißt Kobel." } },
    { id: "frosch", g: "m", name: "Frosch", e: "🐸", ab: 1, lz: "su.na.08", wo: "💧 am Teich", warum: "Der Frosch hat sich auf den trockenen Weg verirrt.",
      futter: { f: "Was frisst ein Frosch?", ru: "Что ест лягушка?", o: ["🪰 Fliegen und Mücken", "🥕 Möhren", "🍝 Nudeln"], w: "Frösche fangen Insekten mit ihrer langen Zunge." },
      pflege: { f: "Was braucht der Frosch jetzt?", ru: "Что сейчас нужно лягушке?", o: ["💧 feuchte Haut – etwas Wasser", "☀️ pralle Sonne", "🔥 die Heizung"], w: "Frösche brauchen feuchte Haut, sonst trocknen sie aus." },
      ort: { f: "Wo lassen wir den Frosch frei?", ru: "Где мы выпустим лягушку?", o: ["💧 am Teich", "🏜️ auf dem Sandweg", "🌲 oben im Baum"], w: "Frösche leben am und im Wasser." } },
    { id: "kitz", g: "n", name: "Rehkitz", e: "🦌", ab: 1, lz: "su.na.08", sonder: true, wo: "🌾 im hohen Gras", warum: "Ein Rehkitz liegt ganz allein im Gras.",
      frage: { f: "Ein Rehkitz liegt allein im Gras. Was ist richtig?", ru: "Оленёнок лежит один в траве. Как правильно?", o: ["🙌 Nicht anfassen – die Mutter kommt wieder", "🤗 Mitnehmen und streicheln", "🍼 Milch geben"], w: "Die Reh-Mutter versteckt ihr Kitz und kommt zum Säugen zurück. Riecht es nach Menschen, kann sie es nicht mehr annehmen." } },
    { id: "fledermaus", g: "f", name: "Fledermaus", e: "🦇", ab: 2, lz: "su.na.08", wo: "🏚️ im alten Dachboden", warum: "Die Fledermaus ist im Winter aufgewacht und hat sich verflogen.",
      futter: { f: "Was frisst eine Fledermaus bei uns?", ru: "Что ест летучая мышь у нас?", o: ["🦟 Insekten", "🍓 Erdbeeren", "🥜 Erdnussbutter"], w: "Unsere Fledermäuse fangen nachts Mücken und Nachtfalter." },
      pflege: { f: "Was braucht die Fledermaus im Winter?", ru: "Что нужно летучей мыши зимой?", o: ["😴 einen kühlen, ruhigen Platz zum Schlafen", "💡 helles Licht", "🎉 eine Party"], w: "Fledermäuse halten Winterschlaf an kühlen, ruhigen Orten." },
      ort: { f: "Wo verbringt die Fledermaus den Tag?", ru: "Где летучая мышь проводит день?", o: ["🏚️ kopfüber in einem dunklen Versteck", "🌞 auf der Wiese in der Sonne", "🌊 im Wasser"], w: "Tagsüber hängen Fledermäuse kopfüber in Höhlen, Dachböden oder Baumhöhlen." } },
    { id: "schwalbe", g: "f", name: "Schwalbe", e: "🐦", ab: 3, lz: "su.na.08", wo: "🏠 im Nest unter dem Dach", warum: "Die junge Schwalbe ist zu früh aus dem Nest gehüpft.",
      futter: { f: "Was frisst eine Schwalbe?", ru: "Что ест ласточка?", o: ["🦟 Insekten im Flug", "🌰 Nüsse", "🍎 Äpfel"], w: "Schwalben fangen Insekten im Flug." },
      pflege: { f: "Wohin fliegen Schwalben im Herbst?", ru: "Куда улетают ласточки осенью?", o: ["🌍 nach Afrika, wo es warm ist", "🏔️ auf die Berge", "🧊 an den Nordpol"], w: "Schwalben sind Zugvögel. Im Winter finden sie bei uns keine Insekten." },
      ort: { f: "Wo baut die Schwalbe ihr Nest?", ru: "Где ласточка строит гнездо?", o: ["🏠 aus Lehm unter dem Dach", "🕳️ unter der Erde", "🌊 auf dem Wasser"], w: "Rauchschwalben bauen Nester aus Lehm in Ställen und unter Dächern." } },
    { id: "hamster", g: "m", name: "Feldhamster", e: "🐹", ab: 3, lz: "su.na.08", wo: "🌾 im Bau unter dem Feld", warum: "Der Feldhamster hat seinen Bau verloren, weil das Feld gepflügt wurde.",
      futter: { f: "Was sammelt der Feldhamster für den Winter?", ru: "Что собирает хомяк на зиму?", o: ["🌾 Körner und Samen", "🍦 Eis", "🥩 Fleisch"], w: "In seinen Backentaschen trägt er Körner in seinen Bau." },
      pflege: { f: "Warum sind Feldhamster selten geworden?", ru: "Почему полевых хомяков стало мало?", o: ["🚜 Felder werden früh abgeerntet und gepflügt", "🎈 sie fliegen weg", "🧦 sie frieren an den Pfoten"], w: "Ohne Körner auf dem Feld und ohne Bau finden sie keinen Platz zum Leben." },
      ort: { f: "Wo wohnt der Feldhamster?", ru: "Где живёт полевой хомяк?", o: ["🌾 in einem Bau unter dem Feld", "🌲 oben im Baum", "🏠 im Keller"], w: "Der Bau hat Gänge, eine Schlafkammer und eine Vorratskammer." } }
  ];
  const ART = { m: "Der", f: "Die", n: "Das" }, ER = { m: "er", f: "sie", n: "es" }, IHN = { m: "ihn", f: "sie", n: "es" };
  const SCHRITTE = [["futter", "🍽️ Futter"], ["pflege", "🧣 Pflege"], ["ort", "🏡 Zuhause"]];
  const klasse = () => { const k = S.kind(); return k.stufe === "vs" ? 0 : Math.min(4, k.klasse || 2); };
  const offen = () => S.offen(!!(window.Story && Story.kapitel() >= 2));
  const heute = () => S.heute();
  function daten() { return Object.assign({ gast: null, frei: {}, fragen: {} }, S.lade("tierstation") || {}); }
  const speichere = (d) => S.speichere("tierstation", d);
  const tier = (id) => TIERE.find(t => t.id === id);
  // nächster Gast: zuerst ein Tier, das noch nie ausgewildert wurde (passend zur Klasse), sonst reihum
  function naechster(d) {
    const pool = TIERE.filter(t => t.ab <= klasse()), neu = pool.filter(t => !d.frei[t.id]);
    const aus = neu.length ? neu : pool; return aus[Math.floor(Math.random() * aus.length)];
  }
  const meinTier = () => { const P = window.TierPflege; if (!P) return null; const t = P.lade(); return t && t.phase === "tier" ? (t.name || "Dein Tier") : null; };

  function sage(de, ru) { $("bruni-text").innerHTML = esc(de) + (S.hilfe() && ru ? `<span class="ru">${esc(ru)}</span>` : ""); $("bruni-text").dataset.text = de; }
  function hinweis(t, art) { const h = $("hinweis"); h.textContent = t; h.className = "hinweis " + (art || ""); }
  function knoepfe(html) { $("aktionen").innerHTML = html; }

  function zeichne() {
    $("sterne").textContent = S.sterne();
    if (!offen()) { $("zu").hidden = false; $("station").hidden = true; return; }
    $("zu").hidden = true; $("station").hidden = false;
    const d = daten(); hinweis(""); $("frage").innerHTML = "";
    const frei = Object.entries(d.frei).filter(([, n]) => n > 0);
    $("ausgewildert").innerHTML = `🌿 Schon wieder in Freiheit: ${frei.length ? frei.map(([id, n]) => { const t = tier(id); return t ? `${t.e} ${esc(t.name)}${n > 1 ? ` ×${n}` : ""}` : ""; }).join(" · ") : "<em style='font-weight:500'>noch keins</em>"}`;
    if (!d.gast) {
      $("patient").innerHTML = `<div class="tier">🏥</div><h2>Die Station ist bereit</h2>`;
      sage(`Hallo ${S.profil.name || "du"}! Hier helfe ich Tieren, denen es nicht gut geht. Schau mal, wer heute kommt!`, "Здесь я помогаю животным. Посмотри, кто сегодня пришёл!");
      knoepfe(`<button class="knopf haupt" id="neu" style="min-height:64px">🚪 Wer braucht Hilfe?</button>`);
      $("neu").addEventListener("click", neuerGast);
      return;
    }
    const t = tier(d.gast.id), g = d.gast, alle = SCHRITTE.every(([k]) => g.ok[k]), ausgeruht = alle && g.ruht && g.ruht < heute();
    $("patient").innerHTML = `<div class="tier ${alle && !ausgeruht ? "schlaeft" : ""}">${t.e}</div><h2>${esc(t.name)}</h2>
      <div class="haken">${SCHRITTE.map(([k, n]) => `<span class="${g.ok[k] ? "an" : ""}">${g.ok[k] ? "✅" : "⬜"} ${n}</span>`).join("")}</div>`;
    const helfer = meinTier();
    if (!alle) {
      const offenK = SCHRITTE.find(([k]) => !g.ok[k])[0];
      sage(`${t.warum} ${helfer ? `${helfer} ist auch da und passt mit auf. ` : ""}Hilfst du mir?`, "Поможешь мне?");
      knoepfe(""); frage(t, offenK);
    } else if (!ausgeruht) {
      sage(`Danke! ${ART[t.g]} ${t.name} schläft jetzt und erholt sich. Komm morgen wieder – dann darf ${ER[t.g]} zurück nach Hause.`, "Спасибо! Животное отдыхает. Приходи завтра!");
      knoepfe("");
    } else {
      sage(`${t.name} ist wieder fit! Bringen wir ${IHN[t.g]} nach Hause – ${t.wo}.`, "Животное здорово! Отнесём его домой.");
      knoepfe(`<button class="knopf haupt" id="frei" style="min-height:64px">🌿 Auswildern</button>`);
      $("frei").addEventListener("click", () => auswildern(t));
    }
  }
  function neuerGast() {
    const d = daten(), t = naechster(d);
    S.ton("wahl");
    if (t.sonder) return sonderfall(t);
    d.gast = { id: t.id, tag: heute(), ok: {}, ruht: null }; speichere(d); zeichne();
  }
  // Frage stellen; erster Versuch zählt fürs Können; falsch = Hinweis, nochmal (nichts geht verloren)
  function frage(t, schritt, fertig) {
    const q = schritt === "sonder" ? t.frage : t[schritt], opts = misch(q.o.map((o, i) => ({ o, i })));
    let versucht = false;
    $("frage").innerHTML = `<div class="frage-titel">${esc(q.f)} <button class="vorlesen" id="frage-vorlesen" aria-label="Vorlesen" style="vertical-align:middle">🔊</button>${S.hilfe() ? `<span class="ru" style="display:block;font-size:1rem;font-weight:500">${esc(q.ru)}</span>` : ""}</div>
      <div class="wahl">${opts.map(x => `<button class="knopf" data-antwort="${x.i}">${esc(x.o)}</button>`).join("")}</div>`;
    $("frage-vorlesen").addEventListener("click", () => { if (SP) { SP.knopf && SP.knopf(); SP.sprich(q.f + " " + q.o.map(x => x.replace(/[^\p{L}\p{N} ,.–-]/gu, "")).join(", ")); } });
    $("frage").querySelectorAll("[data-antwort]").forEach(b => b.addEventListener("click", () => {
      const richtig = b.dataset.antwort === "0";
      if (!versucht && window.Koennen) Koennen.melde([t.lz], richtig);
      if (!richtig) { versucht = true; b.classList.add("falsch"); b.disabled = true; S.ton("nein"); hinweis("Hm, überleg nochmal. Was ist gut für das Tier?", "nein"); return; }
      b.classList.add("richtig"); S.ton("juhu"); $("frage").querySelectorAll("button").forEach(x => { x.disabled = true; });
      if (!versucht && window.Charakter) Charakter.gib("sachkunde", 1);
      hinweis("💡 " + q.w, "ja");
      knoepfe(`<button class="knopf haupt" id="weiter" style="min-height:60px">Weiter ➡️</button>`);
      $("weiter").addEventListener("click", () => {
        if (fertig) return fertig();
        const d = daten(); d.gast.ok[schritt] = 1; d.fragen[t.id + ":" + schritt] = 1;
        if (SCHRITTE.every(([k]) => d.gast.ok[k])) d.gast.ruht = heute();
        speichere(d); S.ton("tipp"); zeichne();
      });
    }));
  }
  function sonderfall(t) {
    $("patient").innerHTML = `<div class="tier">${t.e}</div><h2>${esc(t.name)}</h2>`;
    sage(`${t.warum} Was machen wir?`, "Что нам делать?"); knoepfe("");
    frage(t, "sonder", () => { gutGemacht(t, "Richtig! Wir lassen das Kitz in Ruhe. Seine Mutter passt auf es auf."); });
  }
  function auswildern(t) { S.ton("juhu"); gutGemacht(t, `Tschüss, ${t.name}! ${ER[t.g][0].toUpperCase() + ER[t.g].slice(1)} ist wieder zu Hause – ${t.wo}.`); }
  function gutGemacht(t, text) {
    const d = daten(), erstes = !d.frei[t.id];
    d.frei[t.id] = (d.frei[t.id] || 0) + 1; d.gast = null; speichere(d);
    if (erstes) {
      S.gibSterne(1);
      if (window.Lernfunde) Lernfunde.merke({ fach: "sachkunde", art: "tierstation", e: t.e, text: `${t.name} geholfen – lebt ${t.wo.replace(/^\S+\s/, "")}`, schluessel: "tierstation:" + t.id });
    }
    if (window.Charakter) Charakter.gib("sachkunde", 2);
    zeichne();
    sage(text + (erstes ? " Dafür bekommst du einen Stern ⭐." : ""), "Молодец! Животное снова дома.");
  }

  document.addEventListener("click", (e) => { const v = e.target.closest("[data-vorlesen]"); if (!v || !SP) return; const el = $(v.dataset.vorlesen); SP.knopf && SP.knopf(); SP.sprich(el.dataset.text || el.textContent); });
  zeichne();
  window.__tierstation = { zeichne, daten, TIERE, neuerGast, tier };
})();
