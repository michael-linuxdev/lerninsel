// Bewegungspause zum Mitmachen (07.11.2026): Schritt-Typ „bewegung“ in den Sach- und Fachthemen.
// { typ: "bewegung", frage, ru, uebungen: [{ pose, text, ru, sek }] } – je Übung ein Zeigebild (Strichfigur in Stil A, zwei Bilder im Wechsel; beim Flamingo nur ein Wechsel zur Halbzeit),
// ein vorlesbarer Satz und ein Zähler. „Geschafft!“ wird erst nach Ablauf der Zeit frei, „Überspringen“ geht immer (ohne Nachteil – nicht jedes
// Kind kann jede Übung). Die App sieht das Kind nicht: Der Schritt zählt nicht als Übungsaufgabe (tests/lehrplan.js) und gibt keine Fehler.
// Test-Haken: window.__bewegung (posen, svg); window.__testSchnell = true lässt eine Sekunde in 40 ms vergehen.
(function () {
  // Punkte einer Figur (viewBox 0 0 120 150): k Kopf, h Hals, b Hüfte, Arme [Ellbogen, Hand] links/rechts, Beine [Knie, Fuß] links/rechts
  const STEH = { k: [60, 26], h: [60, 40], b: [60, 86], al: [[48, 62], [44, 84]], ar: [[72, 62], [76, 84]], bl: [[53, 112], [50, 140]], br: [[67, 112], [70, 140]] };
  const mit = (x) => Object.assign({}, STEH, x);
  const POSEN = {
    marsch: [mit({ al: [[48, 58], [56, 46]], ar: [[73, 64], [78, 84]], bl: [[48, 102], [52, 122]] }), mit({ ar: [[72, 58], [64, 46]], al: [[47, 64], [42, 84]], br: [[72, 102], [68, 122]] })],
    kreisen: [mit({ al: [[42, 26], [32, 6]], ar: [[78, 26], [88, 6]] }), mit({ al: [[38, 40], [18, 40]], ar: [[82, 40], [102, 40]] })],
    seite: [mit({ k: [70, 27], h: [66, 42], al: [[44, 22], [64, 4]], ar: [[76, 62], [80, 82]] }), mit({ k: [50, 27], h: [54, 42], ar: [[76, 22], [56, 4]], al: [[44, 62], [40, 82]] })],
    flamingo: [mit({ al: [[38, 40], [18, 40]], ar: [[82, 40], [102, 40]], bl: [[44, 104], [62, 112]], br: [[64, 113], [64, 140]] }),
      mit({ al: [[38, 40], [18, 40]], ar: [[82, 40], [102, 40]], br: [[76, 104], [58, 112]], bl: [[56, 113], [56, 140]] })],
    kniebeuge: [mit({ al: [[44, 50], [30, 46]], ar: [[76, 50], [90, 46]] }),
      { k: [60, 46], h: [60, 62], b: [60, 104], al: [[44, 70], [30, 66]], ar: [[76, 70], [90, 66]], bl: [[42, 116], [48, 140]], br: [[78, 116], [72, 140]] }],
    steptouch: [mit({ k: [70, 24], h: [70, 40], b: [70, 86], al: [[60, 56], [66, 40]], ar: [[82, 56], [74, 40]], bl: [[60, 112], [50, 140]], br: [[82, 112], [92, 140]] }),
      mit({ al: [[44, 22], [57, 0]], ar: [[76, 22], [63, 0]] })],
    atmen: [mit({ al: [[42, 26], [32, 6]], ar: [[78, 26], [88, 6]] }), mit({})]
  };
  const KONTUR = "#3B1F63";
  function svg(name, n) {
    const f = (POSEN[name] || POSEN.atmen)[n % 2], L = (a, b, w = 7, c = KONTUR) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
    const glied = (start, [m, e]) => L(start, m) + L(m, e), sch = [f.h[0], f.h[1] + 6];   // Arme an den Schultern, etwas unter dem Hals
    return `<svg class="bew-figur" viewBox="0 -6 120 156" width="150" height="188" role="img" aria-label="Zeigebild">` +
      `<ellipse cx="60" cy="144" rx="34" ry="5" fill="${KONTUR}" opacity=".12"/>` +
      glied(f.b, f.bl) + glied(f.b, f.br) + L(f.h, f.b, 16, KONTUR) + L(f.h, f.b, 10, "var(--akzent, #2F86C8)") +
      glied(sch, f.al) + glied(sch, f.ar) +
      `<circle cx="${f.k[0]}" cy="${f.k[1]}" r="12" fill="#FFD9B8" stroke="${KONTUR}" stroke-width="3.5"/></svg>`;
  }

  let uhren = [];
  const stopp = () => { uhren.forEach(clearInterval); uhren = []; };
  const takt = () => (window.__testSchnell ? 40 : 1000);
  const RUHIG = { flamingo: true };   // Haltungen zum ruhigen Stehen: das Zeigebild wechselt nur einmal zur Halbzeit (Beinwechsel)
  const sekunden = (n) => (n === 1 ? "Sekunde" : "Sekunden");

  // h = Helfer der Seite: { eintrag, vt, mini, blase, weiterKnopf, aufWeiter, ton, ht }
  function zeige(A, s, h) {
    stopp();
    h.blase(s.frage, h.ht(s));
    const liste = s.uebungen || []; let k = 0;
    const naechste = () => {
      stopp();
      if (k >= liste.length) {
        const id = h.eintrag("Super bewegt! Dein Körper sagt Danke.", h.ht({ ru: "Отлично подвигались! Твоё тело говорит спасибо." }));
        A.innerHTML = `<div class="gross-emoji">💪</div><div class="warum gut">${h.vt(id)}${h.mini(id)}</div>` + h.weiterKnopf();
        h.ton("juhu"); h.aufWeiter(); return;
      }
      const u = liste[k]; let rest = u.sek || 15, bild = 0;
      const tid = h.eintrag(u.text, h.ht(u));
      A.innerHTML = `<div class="zaehler">Übung ${k + 1} von ${liste.length}</div><div class="bew-bild" data-pose="${u.pose}">${svg(u.pose, 0)}</div>` +
        `<p class="satz-gross bew-text">${h.vt(tid)}${h.mini(tid)}</p>` +
        `<div class="bew-knoepfe"><button class="knopf haupt" id="bew-weiter" disabled>Noch <span id="bew-n">${rest}</span> <span id="bew-e">${sekunden(rest)}</span></button>` +
        `<button class="knopf" id="bew-ueberspringen">⏭️ Überspringen</button></div>`;
      const weiterB = A.querySelector("#bew-weiter"), bildEl = A.querySelector(".bew-bild");
      const halb = Math.floor(rest / 2);
      if (!RUHIG[u.pose]) uhren.push(setInterval(() => { bild++; bildEl.innerHTML = svg(u.pose, bild); }, window.__testSchnell ? 60 : 800));
      const zaehlUhr = setInterval(() => {
        rest--; const n = A.querySelector("#bew-n"), e = A.querySelector("#bew-e"); if (n) n.textContent = rest; if (e) e.textContent = sekunden(rest);
        if (RUHIG[u.pose] && rest === halb) bildEl.innerHTML = svg(u.pose, 1);
        if (rest <= 0) { clearInterval(zaehlUhr); weiterB.disabled = false; weiterB.textContent = "Geschafft! ➡️"; h.ton("tipp"); }
      }, takt());
      uhren.push(zaehlUhr);
      weiterB.addEventListener("click", () => { h.ton("tipp"); k++; naechste(); });
      A.querySelector("#bew-ueberspringen").addEventListener("click", () => { k++; naechste(); });
    };
    naechste();
  }
  window.Bewegung = { POSEN, svg, zeige, stopp };
  window.__bewegung = { posen: Object.keys(POSEN), svg };
})();
