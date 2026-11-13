// Test „Fächer ausbauen I“ (07.11.2026): Kunst, Musik, Werken – jeder Inhaltspunkt mit eigenen Übungen.
// Klickt die erweiterten Themen echt bis zum Ende durch (Weiter, Wahl, Daumen, Zuordnen per Antippen), in jedem Fach einmal mit einem Fehler,
// spielt das neue Hör-Thema „Hör genau hin!“ (Klangbeispiele aus WebAudio, erst nach Antippen) und prüft die Klang-Pläne (lauter, schneller, A – B – A),
// zeigt im Elternbereich die neuen „✅“-Punkte (keine „🟡“ mehr in Kunst, Musik, Werken; Tun mit Material/Stimme „🌍“), Hilfesprache Russisch, Handy 390 × 760.
// Aufruf: sh tests/laufen.sh faecher1   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) { fehler.push(text); console.log("  ✗ " + text); } else console.log("  ✓ " + text); };
  async function kind(stufe, breite = 1180, hoehe = 820, sprache = "") {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__elternAlle = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    if (sprache) { await p.selectOption("#e-sprache", sprache); await p.selectOption("#e-dosis", "immer"); }
    await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  const oeffne = async (p, fach) => { await p.goto(BASIS + "spiele/sachkunde/?fach=" + fach); await p.waitForSelector("#themen .su-gruppe"); };
  const passt = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);

  // Ein Thema echt durchklicken; mitFehler = beim ersten Wahl-Schritt erst eine falsche Antwort antippen
  async function durchklicken(p, fach, id, { mitFehler = false, bild = "" } = {}) {
    const kachel = `#themen button.lek[data-id="${id}"]`;
    await p.evaluate((sel) => { const b = document.querySelector(sel); const d = b && b.closest("details"); if (d) d.open = true; }, kachel);
    await p.click(kachel); await p.waitForSelector("#lektion-ansicht:not([hidden])");
    let runden = 0, haengt = false, breit = false, fehlerGemacht = false, hoerSchritte = 0, gespielt = 0, knopfOk = true, schritte = 0;
    while (runden++ < 120) {
      const lage = await p.evaluate(() => { const l = __sachkunde.lauf; const s = l && l.t.schritte[l.pos];
        return { ende: !document.getElementById("ende-ansicht").hidden, typ: s && s.typ, schritt: s, weiter: !!document.getElementById("weiter"),
          karte: (document.querySelector(".sortier-karte") || {}).innerText || "", klang: !!document.getElementById("klang-knopf") }; });
      if (lage.ende) break;
      if (!(await passt(p))) breit = true;
      if (lage.weiter) { await p.click("#weiter"); await p.waitForTimeout(60); continue; }
      if (!lage.schritt.__nochmal) schritte++;   // 13.11.: eine falsch beantwortete Frage kommt am Ende noch einmal (shared/raten.js) – nicht doppelt zählen
      if (lage.typ === "wahl") {
        if (lage.schritt.klang && !lage.schritt.__nochmal) {
          hoerSchritte++;
          if (!lage.klang) knopfOk = false;
          else {
            const box = await p.locator("#klang-knopf").boundingBox();
            if (!box || box.height < 40 || box.x < 0 || box.x + box.width > (await p.evaluate(() => innerWidth)) + 1) knopfOk = false;
            const vorher = await p.evaluate(() => (window.__klang.gespielt || []).length);
            await p.click("#klang-knopf"); await p.waitForTimeout(80);
            const nachher = await p.evaluate(() => ({ n: (window.__klang.gespielt || []).length, text: document.getElementById("klang-knopf").textContent }));
            if (nachher.n === vorher + 1 && /Nochmal/.test(nachher.text)) gespielt++;
            if (BILDER && hoerSchritte === 1) await p.screenshot({ path: `${BILDER}/faecher1-hoeren-${(await p.evaluate(() => innerWidth))}.png` });
          }
        }
        if (mitFehler && !fehlerGemacht) {
          const falsch = lage.schritt.optionen.find(o => !o.ok).t;
          await p.locator(".optionen .option", { hasText: falsch }).first().click(); await p.waitForTimeout(120);
          fehlerGemacht = await p.evaluate(() => !!document.querySelector(".option.falsch") && !document.querySelector(".warum").hidden);
          if (BILDER && bild) await p.screenshot({ path: `${BILDER}/faecher1-fehler-${bild}.png` });
        }
        await p.locator(".optionen .option", { hasText: lage.schritt.optionen.find(o => o.ok).t }).first().click();
      } else if (lage.typ === "daumen") await p.locator(".daumen .option").nth(lage.schritt.ok ? 0 : 1).click();
      else if (lage.typ === "zuordnen") {
        const ding = lage.schritt.dinge.filter(d => lage.karte.includes(d.t)).sort((a, b) => b.t.length - a.t.length)[0];
        if (!ding) { haengt = true; break; }
        await p.click(`.gruppen .option[data-g="${ding.gruppe}"]`); await p.waitForTimeout(900);
        schritte--;   // ein Zuordnen-Schritt hat mehrere Karten
      } else { haengt = true; break; }
      await p.waitForTimeout(80);
    }
    const ende = await p.evaluate(() => ({ titel: document.getElementById("ende-titel").textContent, text: document.getElementById("ende-text").textContent }));
    const sterne = await p.evaluate((id) => ((Spielwelt.lade("sachkunde") || {}).themen || {})[id] || 0, id);
    if (BILDER && bild) await p.screenshot({ path: `${BILDER}/faecher1-ende-${bild}.png` });
    await oeffne(p, fach);
    return { ok: !haengt && !breit && /geschafft/.test(ende.titel), ende: ende.text, sterne, breit, haengt, fehlerGemacht, hoerSchritte, gespielt, knopfOk };
  }
  const zahlUebungen = (p, id) => p.evaluate((id) => FACH_THEMEN.find(t => t.id === id).schritte.filter(s => !["info", "sag"].includes(s.typ)).length, id);

  // --- Kl. 2: Hör-Thema mit einem Fehler, Plastik (3 Gruppen), Papier, Formen ---
  {
    const { ctx, p } = await kind("2");
    await oeffne(p, "musik");
    const plaene = await p.evaluate(() => { const t = FACH_THEMEN.find(x => x.id === "mu-hoeren"), k = t.schritte.filter(s => s.klang).map(s => __klang.plan(s.klang));
      const lauter = k[0].toene, schneller = k[1].toene, aba = k[6].toene;
      const abstand = (l, i) => l[i + 1].start - l[i].start;
      return { n: k.length, lauter: lauter[0].laut < 0.1 && lauter[lauter.length - 1].laut > 0.9, schneller: abstand(schneller, 0) > 2.5 * abstand(schneller, schneller.length - 2),
        aba: aba.slice(0, 5).map(x => x.f).join() === aba.slice(-5).map(x => x.f).join() && aba[5].f !== aba[0].f, dauer: k.every(x => x.dauer > 1.5 && x.dauer < 12) }; });
    erwarte(plaene.n === 8 && plaene.lauter && plaene.schneller && plaene.aba && plaene.dauer,
      `„Hör genau hin!“: 8 Klangbeispiele – lauter von leise bis laut, schneller (Abstände schrumpfen), A – B – A mit gleichem Anfang und Ende, je 1,5–12 s (${JSON.stringify(plaene)})`);
    const kachel = await p.evaluate(() => { const b = document.querySelector('[data-id="mu-hoeren"]'); return b ? b.closest(".su-gruppe").dataset.lb : ""; });
    erwarte(kachel === "mu4", `Kachel „Hör genau hin!“ steht bei Kl. 2 unter „Musik hören und verstehen“ (${kachel})`);
    const r = await durchklicken(p, "musik", "mu-hoeren", { mitFehler: true, bild: "mu-hoeren" });
    erwarte(r.ok && r.fehlerGemacht && r.sterne === 3 && !/ersten Mal/.test(r.ende),
      `Musik „Hör genau hin!“ echt bis zum Ende, ein Fehler mit Erklärung (ein Fehler kostet noch keinen Stern, aber kein „beim ersten Mal richtig“) (${r.sterne}; ${r.ende.slice(0, 60)})`);
    erwarte(r.hoerSchritte === 8 && r.gespielt === 8 && r.knopfOk, `8 Hör-Schritte, jeder mit „▶️ Abspielen“ (≥ 40 px), Antippen spielt und wird zu „🔁 Nochmal abspielen“ (${r.gespielt}/${r.hoerSchritte})`);
    for (const [fach, id, min] of [["kunst", "ku-plastik", 8], ["werken", "we-papier", 6], ["kunst", "ku-formen", 6], ["kunst", "ku-sinne", 6], ["musik", "mu-stimme", 8], ["werken", "we-fahrzeuge", 6], ["werken", "we-werkzeug", 8], ["werken", "we-bauen", 4], ["musik", "mu-mozart", 4], ["musik", "mu-bewegung", 8], ["musik", "mu-laut-leise", 7]]) {
      await oeffne(p, fach);
      const n = await zahlUebungen(p, id);
      const x = await durchklicken(p, fach, id, { mitFehler: id === "we-papier", bild: id === "ku-plastik" ? "ku-plastik" : "" });
      erwarte(x.ok && n >= min && x.sterne === 3 && (id === "we-papier" ? x.fehlerGemacht && !/ersten Mal/.test(x.ende) : /ersten Mal/.test(x.ende)),
        `Kl. 2 ${fach} „${id}“: ${n} Übungen (≥ ${min}), echt bis zum Ende${id === "we-papier" ? " mit einem Fehler (Erklärung, kein „beim ersten Mal richtig“)" : ", ohne Fehler"}${x.breit ? " – zu breit" : ""}${x.haengt ? " – hängt" : ""}`);
    }
    await ctx.close();
  }

  // --- Kl. 3 mit Hilfesprache Russisch: Schrift/Foto, Bildhauer, Kanon, Bach, Strom, Holz; Elternbereich ---
  {
    const { ctx, p } = await kind("3", 1180, 820, "ru");
    await oeffne(p, "kunst");
    // russische Zeile unter einer neuen Frage
    await p.evaluate(() => { const b = document.querySelector('[data-id="ku-schrift-foto"]'); const d = b.closest("details"); if (d) d.open = true; });
    await p.click('[data-id="ku-schrift-foto"]'); await p.waitForSelector("#lektion-ansicht:not([hidden])");
    await p.evaluate(() => { const l = __sachkunde.lauf; __sachkunde.schritt(l.t.schritte.findIndex(s => s.frage && s.frage.startsWith("Kalligrafie"))); });
    await p.waitForTimeout(100);
    const ru = await p.evaluate(() => document.getElementById("blase").textContent);
    if (BILDER) await p.screenshot({ path: `${BILDER}/faecher1-ru-kalligrafie.png` });
    erwarte(/Каллиграфия/.test(ru), `Hilfesprache Russisch: russischer Entwurf unter der neuen Frage zur Kalligrafie (${ru.slice(0, 80)})`);
    for (const [fach, id, min, mitFehler] of [["kunst", "ku-schrift-foto", 6, true], ["kunst", "ku-bildhauer", 8, false], ["kunst", "ku-aktion3", 6, false], ["kunst", "ku-farbgefuehl", 6, false],
      ["musik", "mu-singen3", 6, true], ["musik", "mu-bach", 4, false], ["werken", "we-strom", 8, true], ["werken", "we-holz", 8, false]]) {
      await oeffne(p, fach);
      const n = await zahlUebungen(p, id);
      const x = await durchklicken(p, fach, id, { mitFehler, bild: mitFehler ? id + "-ru" : "" });
      erwarte(x.ok && n >= min && x.sterne === 3 && (mitFehler ? x.fehlerGemacht && !/ersten Mal/.test(x.ende) : /ersten Mal/.test(x.ende)),
        `Kl. 3 ${fach} „${id}“: ${n} Übungen (≥ ${min}), echt bis zum Ende${mitFehler ? " mit einem Fehler (Erklärung, kein „beim ersten Mal richtig“)" : ", ohne Fehler"}${x.breit ? " – zu breit" : ""}${x.haengt ? " – hängt" : ""}`);
    }
    // Elternbereich: neue „ja“-Punkte, keine „teilweise“ mehr in Kunst, Musik, Werken
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); }
    await p.waitForSelector(".lp-punkte");
    const e = await p.evaluate(() => {
      const fach = (n) => { const h = [...document.querySelectorAll("h3.lp-fach")].find(x => x.textContent.startsWith(n)); const ul = h && h.nextElementSibling;
        if (!ul) return null; const z = (s) => [...ul.querySelectorAll("li[data-punkt] .zeichen")].filter(x => x.textContent === s).length;
        return { ja: z("✅"), teil: z("🟡"), welt: z("🌍") }; };
      const zeichen = (id) => ((document.querySelector(`li[data-punkt="${id}"] .zeichen`) || {}).textContent || "");
      const hinweis = (id) => ((document.querySelector(`li[data-punkt="${id}"] .lp-hinweis`) || {}).textContent || "");
      return { kunst: fach("Kunst"), musik: fach("Musik"), werken: fach("Werken"),
        neu: ["sn.ku3.1.07", "sn.ku3.1.08", "sn.ku3.1.09", "sn.ku3.2.01", "sn.ku3.3.01", "sn.mu3.1.04", "sn.mu3.3.03", "sn.mu3.4.01", "sn.mu3.4.03", "sn.we3.1.01", "sn.we3.2.01", "sn.we3.2.04"].map(zeichen).join(""),
        welt: ["sn.ku3.2.03", "sn.ku3.3.02", "sn.mu3.1.02"].map(zeichen).join(""), hinweis: hinweis("sn.mu3.1.02") };
    });
    if (BILDER) { await p.evaluate(() => { const h = [...document.querySelectorAll("h3.lp-fach")].find(x => x.textContent.startsWith("Musik")); h.scrollIntoView(); h.nextElementSibling.querySelectorAll("details").forEach(d => d.open = true); }); await p.screenshot({ path: `${BILDER}/faecher1-eltern-musik.png` }); }
    erwarte(e.kunst && e.musik && e.werken && e.kunst.teil + e.musik.teil + e.werken.teil === 0 && e.kunst.ja >= 8 && e.musik.ja >= 8 && e.werken.ja >= 6,
      `Elternbereich Kl. 3: Kunst, Musik, Werken ohne „🟡 teilweise“ (${JSON.stringify({ k: e.kunst, m: e.musik, w: e.werken })})`);
    erwarte(e.neu === "✅".repeat(12), `Elternbereich: die bisher „teilweise“ geübten Punkte (Schrift, Foto, Bildrechte, Kanon, Hören, Strom, Holz …) sind jetzt ✅ (${e.neu})`);
    erwarte(e.welt === "🌍🌍🌍" && /Singen selbst/.test(e.hinweis), `Upcycling, Pantomime, Singen-Technik ehrlich 🌍 mit Hinweis (${e.welt}; ${e.hinweis.slice(0, 60)})`);
    await ctx.close();
  }

  // --- Kl. 4: Fahrrad, Werkstoffe, Aktion, Tänze, Rhythmen ---
  {
    const { ctx, p } = await kind("4");
    for (const [fach, id, min, mitFehler] of [["werken", "we-fahrrad", 8, true], ["werken", "we-werkstoffe", 6, false], ["kunst", "ku-aktion4", 6, true], ["musik", "mu-taenze", 8, true], ["musik", "mu-rhythmus4", 5, false]]) {
      await oeffne(p, fach);
      const n = await zahlUebungen(p, id);
      const x = await durchklicken(p, fach, id, { mitFehler, bild: id === "we-fahrrad" ? "we-fahrrad" : "" });
      erwarte(x.ok && n >= min && x.sterne === 3 && (mitFehler ? x.fehlerGemacht && !/ersten Mal/.test(x.ende) : /ersten Mal/.test(x.ende)),
        `Kl. 4 ${fach} „${id}“: ${n} Übungen (≥ ${min}), echt bis zum Ende${mitFehler ? " mit einem Fehler (Erklärung, kein „beim ersten Mal richtig“)" : ", ohne Fehler"}${x.breit ? " – zu breit" : ""}${x.haengt ? " – hängt" : ""}`);
    }
    // „Zeig, was du kannst“ in Kunst Kl. 4 (Flächiges Gestalten) echt durchgespielt
    await oeffne(p, "kunst");
    await p.click('.su-gruppe[data-lb="ku1"] .lernstand-knopf'); await p.waitForSelector("#lektion-ansicht:not([hidden])");
    let runden = 0;
    while (runden++ < 40) {
      const lage = await p.evaluate(() => { const l = __sachkunde.lauf; const s = l && l.t.schritte[l.pos]; return { ende: !document.getElementById("ende-ansicht").hidden, s, weiter: !!document.getElementById("weiter") }; });
      if (lage.ende) break;
      if (lage.weiter) { await p.click("#weiter"); continue; }
      if (lage.s.typ === "wahl") await p.locator(".optionen .option", { hasText: lage.s.optionen.find(o => o.ok).t }).first().click();
      else await p.locator(".daumen .option").nth(lage.s.ok ? 0 : 1).click();
      await p.waitForTimeout(60);
    }
    const ls = await p.evaluate(() => ((Spielwelt.lade("sachkunde") || {}).lernstand || {})["k4:ku1"]);
    erwarte(ls && ls.n >= 2 && ls.richtig === ls.n, `Kunst Kl. 4 „Zeig, was du kannst“ (Flächiges Gestalten) echt durchgespielt: ${ls ? ls.richtig + " von " + ls.n : "fehlt"}`);
    await ctx.close();
  }

  // --- Handy 390 × 760: Hör-Thema und Werkzeug ohne waagerechte Scrollleiste ---
  {
    const { ctx, p } = await kind("2", 390, 760);
    for (const [fach, id] of [["musik", "mu-hoeren"], ["werken", "we-werkzeug"], ["kunst", "ku-plastik"]]) {
      await oeffne(p, fach);
      const x = await durchklicken(p, fach, id, { bild: id === "mu-hoeren" ? "mu-hoeren-handy" : "" });
      erwarte(x.ok && x.sterne === 3 && x.knopfOk, `Handy (390 × 760): „${id}“ bis zum Ende, keine Scrollleiste${id === "mu-hoeren" ? ", Abspiel-Knopf passt" : ""}${x.breit ? " – zu breit" : ""}`);
    }
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Fächer-Test I (Kunst, Musik, Werken ausgebaut) bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
