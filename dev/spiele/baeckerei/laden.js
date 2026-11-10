// Bäckerei Benno (01.11.2026): Bestellungen packen, Preise ausrechnen, passend bezahlen, Wechselgeld geben.
// Geld je Klasse: Vorschule/Kl. 1 ganze Euro bis 10 €, Kl. 2 bis 100 €, ab Kl. 3 mit Komma (Euro und Cent). Eine Runde = 5 Kunden, dann Feierabend.
// Daten: profil.daten.baeckerei = { tage, fehlerfrei }. Öffnet mit Kapitel 3 (Szene „bennos-baeckerei“). Test-Haken: window.__baeckerei.
(function () {
  const S = window.Spielwelt, SP = window.Sprache;
  const $ = (id) => document.getElementById(id);
  const esc = S.esc;
  const zufall = (n) => Math.floor(Math.random() * n);
  const misch = (a) => a.map(x => [Math.random(), x]).sort((x, y) => x[0] - y[0]).map(x => x[1]);

  // Stufe: vs | a (Kl. 1) | b (Kl. 2) | c (ab Kl. 3)
  const stufe = () => { const k = S.kind(); return k.stufe === "vs" ? "vs" : k.klasse <= 1 ? "a" : k.klasse === 2 ? "b" : "c"; };
  // Preise in Cent
  const WAREN = {
    vs: [["broetchen", 100], ["brezel", 200], ["muffin", 300]],
    a: [["broetchen", 100], ["brezel", 200], ["muffin", 300], ["brot", 400], ["kuchen", 500]],
    b: [["broetchen", 100], ["brezel", 200], ["croissant", 300], ["brot", 400], ["kuchen", 600], ["kekse", 800], ["torte", 1500]],
    c: [["broetchen", 50], ["brezel", 80], ["croissant", 120], ["muffin", 200], ["kuchen", 250], ["brot", 350], ["torte", 1800]]   // (11.11.2026) im Kopf rechenbar: Vielfache von 10 ct
  };
  const NAME = {
    broetchen: ["Brötchen", "Brötchen", "🥖", "булочка"], brezel: ["Brezel", "Brezeln", "🥨", "крендель"], muffin: ["Muffin", "Muffins", "🧁", "маффин"],
    brot: ["Brot", "Brote", "🍞", "хлеб"], kuchen: ["Stück Kuchen", "Stück Kuchen", "🍰", "кусок пирога"], croissant: ["Croissant", "Croissants", "🥐", "круассан"],
    kekse: ["Dose Kekse", "Dosen Kekse", "🍪", "коробка печенья"], torte: ["Torte", "Torten", "🎂", "торт"]
  };
  const ABLAUF = { vs: ["packen", "packen", "bezahlen", "packen", "bezahlen"], a: ["packen", "preis", "bezahlen", "packen", "wechsel"], b: ["packen", "preis", "bezahlen", "wechsel", "preis"], c: ["preis", "bezahlen", "wechsel", "packen", "wechsel"] };
  const GELD = { vs: [100, 200], a: [100, 200, 500, 1000], b: [100, 200, 500, 1000, 2000, 5000], c: [5, 10, 20, 50, 100, 200, 500, 1000] };   // alle Preise ab Kl. 3 sind Vielfache von 5 ct
  const KUNDEN = [["\uE103", "Fipsi"], ["\uE102", "Ella"], ["\uE105", "Bruni"], ["\uE106", "Paula"], ["\uE107", "Tilda"], ["\uE101", "Robo Pixel"]];
  const LZ = { vs: "ma.gm.02", a: "ma.gm.02", b: "ma.gm.04", c: "ma.gm.04" };
  const mitKomma = () => stufe() === "c";
  const euro = (ct) => mitKomma() ? (ct / 100).toFixed(2).replace(".", ",") + " €" : Math.round(ct / 100) + " €";
  const geldName = (ct) => ct >= 100 ? `${ct / 100} €` : `${ct} ct`;
  const zahlwort = (n) => ["", "ein", "zwei", "drei", "vier", "fünf"][n] || String(n);
  const preis = (id) => WAREN[stufe()].find(w => w[0] === id)[1];

  // Bestellung: 1–3 Sorten, je 1–3 Stück; Summe passend zur Stufe (vs ≤ 5 €, a ≤ 10 €, b ≤ 100 €, c ≤ 20 €)
  function bestellung() {
    const st = stufe(), max = { vs: 500, a: 1000, b: 10000, c: 2000 }[st], sorten = st === "vs" || st === "c" ? 1 + zufall(2) : 1 + zufall(3);   // Kl. 3 rechnet mit Komma: höchstens zwei Sorten
    for (let v = 0; v < 50; v++) {
      const w = misch(WAREN[st]).slice(0, sorten).map(([id]) => ({ id, n: 1 + zufall(st === "vs" ? 2 : 3) }));
      const summe = w.reduce((s, x) => s + x.n * preis(x.id), 0);
      if (summe <= max && summe > 0) return { waren: w, summe };
    }
    return { waren: [{ id: WAREN[st][0][0], n: 1 }], summe: WAREN[st][0][1] };
  }
  // (11.11.2026) Akkusativ: „Ich möchte einen Muffin“
  const bestellText = (w) => { const t = w.map(x => `${x.n === 1 && !/Stück/.test(NAME[x.id][0]) ? (NAME[x.id][0] === "Muffin" ? "einen" : ["Brot", "Croissant", "Brötchen"].includes(NAME[x.id][0]) ? "ein" : "eine") : zahlwort(x.n)} ${x.n === 1 ? NAME[x.id][0] : NAME[x.id][1]}`); return t.length > 1 ? t.slice(0, -1).join(", ") + " und " + t[t.length - 1] : t[0]; };
  const bestellEmoji = (w) => w.map(x => NAME[x.id][2].repeat(x.n)).join(" ");

  let lauf = null;
  function daten() { return Object.assign({ tage: 0, fehlerfrei: false }, S.lade("baeckerei") || {}); }
  const offen = () => S.offen(!!(window.Story && Story.kapitel() >= 3));

  function zeige(n) { ["zu", "start", "spiel", "ende"].forEach(v => { $(v).hidden = v !== n; }); }
  function sage(id, de, ru) { $(id).innerHTML = esc(de) + (S.hilfe() && ru ? `<span class="ru">${esc(ru)}</span>` : ""); $(id).dataset.text = de; }
  function hinweis(t, art) { const h = $("hinweis"); h.textContent = t; h.className = "hinweis " + (art || ""); }

  function startseite() {
    $("sterne").textContent = S.sterne();
    if (!offen()) return zeige("zu");
    zeige("start");
    const d = daten(), name = S.profil.name || "du";
    sage("start-text", d.tage ? `Schön, dass du wieder da bist, ${name}! Heute kommen fünf Kunden. Hilfst du mir?` : `Hallo ${name}! Das ist meine Bäckerei. Hilfst du mir? Du packst die Bestellungen und rechnest mit dem Geld.`,
      "Помоги мне в пекарне: собери заказы и посчитай деньги!");
  }
  function starte() {
    lauf = { st: stufe(), ablauf: ABLAUF[stufe()], pos: 0, fehler: 0, kunden: misch(KUNDEN).slice(0, 5) };
    zeige("spiel"); kunde();
  }
  function kunde() {
    const k = lauf.kunden[lauf.pos], art = lauf.ablauf[lauf.pos], b = bestellung();
    lauf.aktuell = { art, b, versuche: 0, tablett: {}, geld: [] };
    $("kunde-figur").textContent = k[0];
    $("fortschritt").innerHTML = lauf.kunden.map((x, i) => `<span class="${i <= lauf.pos ? "an" : ""}">${x[0]}</span>`).join("");
    hinweis("");
    ({ packen, preis: preisFrage, bezahlen, wechsel })[art](k, b);
  }

  // ---------- Bestellung packen: Waren antippen, Tablett prüfen ----------
  function packen(k, b) {
    sage("kunde-text", `${k[1]}: „Ich möchte ${bestellText(b.waren)}, bitte.“`, `Я хочу: ${b.waren.map(x => `${x.n} × ${NAME[x.id][3]}`).join(", ")}`);
    const w = WAREN[lauf.st];
    $("aufgabe").innerHTML = `<div class="theke">${w.map(([id, ct]) => `<button class="ware" data-ware="${id}"><span class="e">${NAME[id][2]}</span>${esc(NAME[id][0])}<small>${euro(ct)}</small></button>`).join("")}</div>
      <p style="margin:10px 0 4px;font-weight:600">Dein Tablett (antippen nimmt wieder weg):</p><div class="tablett" id="tablett"></div>
      <div class="zeile" style="margin-top:10px"><button class="knopf haupt" id="fertig">✅ Fertig</button></div>`;
    const male = () => { const t = lauf.aktuell.tablett, l = Object.entries(t).filter(([, n]) => n > 0); $("tablett").innerHTML = l.length ? l.map(([id, n]) => [...Array(n)].map(() => `<button data-weg="${id}" aria-label="${esc(NAME[id][0])} wegnehmen">${NAME[id][2]}</button>`).join("")).join("") : `<span class="leer">noch leer</span>`; };
    male();
    $("aufgabe").querySelectorAll("[data-ware]").forEach(x => x.addEventListener("click", () => { const t = lauf.aktuell.tablett; t[x.dataset.ware] = (t[x.dataset.ware] || 0) + 1; S.ton("tipp"); male(); }));
    $("tablett").addEventListener("click", (e) => { const x = e.target.closest("[data-weg]"); if (!x) return; lauf.aktuell.tablett[x.dataset.weg]--; S.ton("tipp"); male(); });
    $("fertig").addEventListener("click", () => {
      const t = lauf.aktuell.tablett, soll = Object.fromEntries(b.waren.map(x => [x.id, x.n]));
      const ok = Object.keys({ ...t, ...soll }).every(id => (t[id] || 0) === (soll[id] || 0));
      pruefe(ok, ok ? "Genau richtig gepackt!" : "Schau nochmal genau: Was und wie viele?", `Richtig wäre: ${bestellEmoji(b.waren)}`);
    });
  }
  // ---------- Preis ausrechnen ----------
  function preisFrage(k, b) {
    sage("kunde-text", `${k[1]}: „Ich nehme ${bestellText(b.waren)}. Was kostet das zusammen?“`, "Сколько это стоит вместе?");
    $("aufgabe").innerHTML = `<div class="tablett">${b.waren.map(x => `${NAME[x.id][2].repeat(x.n)} <span style="font-size:1.1rem;font-weight:600">je ${euro(preis(x.id))}</span>`).join("&nbsp;&nbsp;")}</div>` + tasten();
    tastenAn((wert) => pruefe(wert === b.summe, wert === b.summe ? `Stimmt, das macht ${euro(b.summe)}.` : "Noch nicht. Rechne Sorte für Sorte und zähl dann zusammen.", `Es sind ${euro(b.summe)}: ` + b.waren.map(x => `${x.n} × ${euro(preis(x.id))}`).join(" + ")));
  }
  // ---------- Passend bezahlen: Münzen und Scheine hinlegen ----------
  function bezahlen(k, b) {
    sage("kunde-text", `${k[1]}: „Ich bringe dir frisches Mehl. Das kostet ${euro(b.summe)}. Bezahlst du mich passend?“`, `Я принёс(ла) муку. Это стоит ${euro(b.summe)}. Заплати ровно.`);
    const geld = GELD[lauf.st];
    $("aufgabe").innerHTML = `<div class="geld">${geld.map(ct => `<button class="muenze ${ct < 100 ? "ct" : ""} ${ct >= 500 ? "schein" : ""}" data-geld="${ct}">${geldName(ct)}</button>`).join("")}</div>
      <p style="margin:10px 0 4px;font-weight:600">Hingelegt: <span id="summe">0 €</span> (antippen nimmt wieder weg)</p><div class="tablett" id="tablett"></div>
      <div class="zeile" style="margin-top:10px"><button class="knopf haupt" id="fertig">✅ Fertig</button></div>`;
    const male = () => { const g = lauf.aktuell.geld; $("summe").textContent = euro(g.reduce((s, x) => s + x, 0)); $("tablett").innerHTML = g.length ? g.map((ct, i) => `<button data-weg="${i}" style="font-size:1.1rem;font-weight:700;background:#FFF2B0;border-radius:999px;padding:6px 12px">${geldName(ct)}</button>`).join("") : `<span class="leer">noch nichts</span>`; };
    male();
    $("aufgabe").querySelectorAll("[data-geld]").forEach(x => x.addEventListener("click", () => { lauf.aktuell.geld.push(+x.dataset.geld); S.ton("tipp"); male(); }));
    $("tablett").addEventListener("click", (e) => { const x = e.target.closest("[data-weg]"); if (!x) return; lauf.aktuell.geld.splice(+x.dataset.weg, 1); S.ton("tipp"); male(); });
    $("fertig").addEventListener("click", () => {
      const s = lauf.aktuell.geld.reduce((a, x) => a + x, 0);
      pruefe(s === b.summe, s === b.summe ? `Passend: ${euro(s)}. Danke!` : s > b.summe ? "Das ist zu viel Geld." : "Das ist noch zu wenig.", `Es müssen genau ${euro(b.summe)} sein.`);
    });
  }
  // ---------- Wechselgeld ----------
  function wechsel(k, b) {
    const schein = GELD[lauf.st].concat([2000, 5000, 10000]).filter(ct => ct > b.summe && ct >= 500).sort((x, y) => x - y)[0] || 1000;
    const zurueck = schein - b.summe;
    lauf.aktuell.zurueck = zurueck;
    sage("kunde-text", `${k[1]}: „Ich nehme ${bestellText(b.waren)}. Das kostet ${euro(b.summe)}. Ich gebe dir ${euro(schein)}. Wie viel bekomme ich zurück?“`, `Стоит ${euro(b.summe)}, я даю ${euro(schein)}. Сколько сдачи?`);
    $("aufgabe").innerHTML = `<div class="tablett">${bestellEmoji(b.waren)} <span style="font-size:1.1rem;font-weight:600">${euro(b.summe)} &nbsp;·&nbsp; bezahlt: ${euro(schein)}</span></div>` + tasten();
    tastenAn((wert) => pruefe(wert === zurueck, wert === zurueck ? `Richtig, ${euro(zurueck)} zurück.` : "Noch nicht. Rechne vom Preis bis zum Schein weiter.", `${euro(b.summe)} + ${euro(zurueck)} = ${euro(schein)}`));
  }

  // Zahlentasten (mit Komma ab Kl. 3); Wert in Cent an fertig()
  function tasten() {
    return `<div class="eingabe"><div class="anzeige" id="anzeige">… €</div><div class="tasten">${["7", "8", "9", "⌫", "4", "5", "6", mitKomma() ? "," : "", "1", "2", "3", "", "0"].map(t => t ? `<button data-taste="${t}">${t}</button>` : "<span></span>").join("")}<button class="ok" data-taste="ok" style="grid-column: span 3">OK</button></div></div>`;
  }
  function tastenAn(fertig) {
    let t = "";
    const zeig = () => { $("anzeige").textContent = (t || "…") + " €"; };
    $("aufgabe").querySelectorAll("[data-taste]").forEach(b => b.addEventListener("click", () => {
      const k = b.dataset.taste; S.ton("tipp");
      if (k === "⌫") t = t.slice(0, -1);
      else if (k === ",") { if (!t.includes(",")) t = (t || "0") + ","; }
      else if (k === "ok") { if (!t) return; const [e, c = ""] = t.split(","); fertig(Math.round((+e || 0) * 100 + (+(c + "00").slice(0, 2)))); t = ""; }
      else if (t.length < 7 && !(t.includes(",") && t.split(",")[1].length >= 2)) t += k;
      zeig();
    }));
  }

  // Auswertung: erster Versuch zählt fürs Können; nach zwei Fehlern zeigt Benno die Lösung und es geht weiter (nichts geht verloren)
  function pruefe(ok, text, loesung) {
    const a = lauf.aktuell;
    if (window.Erprobung) Erprobung.aufgabe({ inhalt: "baeckerei:" + lauf.st, schritt: a.art || null, richtig: ok, versuch: a.versuche + 1 });   // Erprobungsmodus (Paket K)
    if (a.versuche === 0) { if (window.Koennen) Koennen.melde([LZ[lauf.st]], ok); if (ok && window.Charakter) Charakter.gib("mathe", 1); }
    if (!ok) {
      a.versuche++; lauf.fehler++; S.ton("nein");
      if (a.versuche >= 2) { hinweis("💡 " + loesung, "nein"); weiterKnopf(); } else hinweis(text, "nein");
      return;
    }
    S.ton("juhu"); hinweis("🎉 " + text, "ja"); weiterKnopf();
  }
  function weiterKnopf() {
    $("aufgabe").querySelectorAll("button").forEach(b => { b.disabled = true; });
    const w = document.createElement("div"); w.className = "zeile"; w.style.marginTop = "10px";
    w.innerHTML = `<button class="knopf haupt" id="naechster">${lauf.pos < 4 ? "➡️ Nächster Kunde" : "🌙 Feierabend"}</button>`;
    $("aufgabe").appendChild(w);
    $("naechster").addEventListener("click", () => { lauf.pos++; if (lauf.pos >= 5) ende(); else kunde(); });
  }
  function ende() {
    const d = daten(), erster = !d.tage, fehlerfrei = lauf.fehler === 0, neuFehlerfrei = fehlerfrei && !d.fehlerfrei;
    d.tage++; if (fehlerfrei) d.fehlerfrei = true; S.speichere("baeckerei", d);
    let sterne = 0; if (erster) sterne += 2; if (neuFehlerfrei) sterne += 1;
    if (sterne) S.gibSterne(sterne);
    if (erster && window.Lernfunde) Lernfunde.merke({ fach: "mathe", art: "baeckerei", e: "🥨", text: "Bäckerei Benno: mit Geld gerechnet und bezahlt", schluessel: "baeckerei:erster" });
    if (window.Charakter) Charakter.gib("mathe", 2);
    zeige("ende"); $("sterne").textContent = S.sterne();
    sage("ende-text", (fehlerfrei ? "Alle fünf Kunden sind zufrieden – ganz ohne Fehler! " : "Alle fünf Kunden sind zufrieden. Danke für deine Hilfe! ") +
      (sterne ? `Dafür bekommst du ${sterne} ${sterne === 1 ? "Stern" : "Sterne"}. ` : "") + "Benno macht jetzt Feierabend.", "Все покупатели довольны. Спасибо за помощь!");
    S.ton("juhu");
  }

  document.addEventListener("click", (e) => { const v = e.target.closest("[data-vorlesen]"); if (!v || !SP) return; const t = $(v.dataset.vorlesen).dataset.text || $(v.dataset.vorlesen).textContent; SP.knopf && SP.knopf(); SP.sprich(t); });
  $("los").addEventListener("click", () => { S.ton("wahl"); starte(); });
  $("nochmal").addEventListener("click", () => { S.ton("wahl"); starte(); });
  startseite();
  window.__baeckerei = { starte, lauf: () => lauf, stufe, euro, daten, bestellung, WAREN, NAME };
})();
