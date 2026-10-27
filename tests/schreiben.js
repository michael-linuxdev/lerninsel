// Test Paket D1: Deutsch schreiben und sprechen – Werkstatt-Schritte „schreiben“ (Bildschirmtastatur, einfache Prüfung ohne KI) und
// „aufnehmen“ (nur mit Eltern-Erlaubnis, Fake-Mikrofon), Gedichte. Alle fünf neuen Kapitel werden echt durchgeklickt bis zum Ende;
// Texte und Aufnahmen landen in der IndexedDB und erscheinen im Elternbereich; ohne Erlaubnis oder ohne Mikrofon geht es still weiter.
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const NEU = ["w-reime", "w-einladung", "w-bildergeschichte", "w-gedicht-vortragen", "w-buchtipp"];

(async () => {
  const browser = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--autoplay-policy=no-user-gesture-required"] });
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  async function kind(stufe, breite, hoehe, ohneMikro) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    if (ohneMikro) await ctx.addInitScript(() => { navigator.mediaDevices.getUserMedia = () => Promise.reject(new DOMException("verweigert", "NotAllowedError")); });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    p.on("dialog", d => d.accept());
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe);
    await p.click("#e-ok"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    await p.goto(BASIS + "spiele/deutsch/"); await p.waitForTimeout(500);
    return { ctx, p };
  }
  const zuEltern = async (p) => { await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(300); if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); } await p.waitForSelector("#deutsch-karte"); await p.waitForTimeout(400); };
  const erlaubeAufnahme = async (p, an) => { await zuEltern(p); await p.setChecked("#d-aufnehmen", an); await p.click("#d-speichern"); await p.goto(BASIS + "spiele/deutsch/"); await p.waitForTimeout(400); };
  const starte = (p, id) => p.evaluate((id) => __deutsch.starte(WERKSTATT.findIndex(k => k.id === id), WERKSTATT), id);
  const passt = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  // Ein gültiger Text für einen Schreib-Schritt: genug Sätze, groß am Anfang, Punkt am Ende, alle Pflichtwörter
  const guterText = (s) => {
    const n = Math.max(s.saetze || 1, Math.ceil((s.woerter || 5) / 8));
    return Array.from({ length: n }, (_, i) => `${["Heute", "Dann", "Danach", "Am Ende", "Zum Schluss"][i % 5]} schreibe ich etwas über ${(s.pflicht || ["meine Freunde"]).join(" und ")} für dich.`).join(" ");
  };

  // Ein Kapitel echt bis zum Ende durchklicken. aufnahme: true = Mikrofon benutzen, "aus" = Mikrofon verweigert.
  async function durchklicken(p, id, art, aufnahme) {
    await starte(p, id); await p.waitForTimeout(150);
    let ok = true;
    for (let schutz = 0; schutz < 40; schutz++) {
      const r = await p.evaluate(() => {
        if (!document.querySelector("#ende-ansicht").hidden) return { ende: true };
        const l = __deutsch.lauf, x = l.k.schritte[l.pos];
        return { pos: l.pos, typ: x.typ, richtig: (x.optionen || [])[0], teile: x.teile, satz: x.satz, falsch: x.falsch, stelle: x.stelle, woerter: x.woerter, saetze: x.saetze, pflicht: x.pflicht };
      });
      if (r.ende) break;
      if (!(await passt(p))) { ok = false; console.log(`    Scrollleiste: ${id} Schritt ${r.pos} (${art})`); }
      const vorher = r.pos;
      if (r.typ === "sag") await p.click("#weiter", { force: true });
      else if (r.typ === "luecke") await p.evaluate((t) => [...document.querySelectorAll(".optionen .option")].find(b => b.textContent === t).click(), r.richtig);
      else if (r.typ === "ordnen") { for (const t of r.teile) await p.click(`#ordnen-karten .okarte:not(.weg) >> text="${t}"`); await p.click("#pruefen"); }
      else if (r.typ === "verbessern") {
        const w = r.satz.split(" "), kern = (x) => x.replace(/[.,!?:;„“"]/g, "");
        const ziel = r.stelle != null ? r.stelle : w.findIndex(x => kern(x) === r.falsch);
        await p.click(`.vb-wort[data-n="${ziel}"]`); await p.click(`#vb-optionen .option >> text="${r.richtig}"`);
      } else if (r.typ === "schreiben") {
        if (BILDER) await p.screenshot({ path: `${BILDER}/schreiben-start-${id}-${art}.png` });
        await p.fill("#schreibfeld", guterText(r));
        await p.click("#pruefen");
        const gut = await p.evaluate(() => document.querySelector("#hinweis").classList.contains("gut") && !!document.querySelector("#weiter"));
        if (!gut) { ok = false; console.log(`    Text nicht angenommen: ${id} Schritt ${r.pos}`); }
        if (BILDER) await p.screenshot({ path: `${BILDER}/schreiben-${id}-${art}.png` });
        await p.click("#weiter");
      } else if (r.typ === "aufnehmen") {
        if (!aufnahme) { ok = false; console.log(`    Aufnahme-Schritt trotz fehlender Erlaubnis: ${id}`); }
        await p.click("#aufnahme");
        if (aufnahme === "aus") {
          await p.waitForFunction(() => /Mikrofon ist gerade aus/.test(document.querySelector("#aufnahme-zeit").textContent));
          await p.click("#ohne-aufnahme");
        } else {
          await p.waitForSelector(".aufnahme-knopf.laeuft"); await p.waitForTimeout(1300);
          if (BILDER) await p.screenshot({ path: `${BILDER}/aufnehmen-${id}-${art}.png` });
          await p.click("#aufnahme", { force: true });
          await p.waitForSelector("#nach-aufnahme:not([hidden])", { timeout: 5000 });
          await p.click("#anhoeren"); await p.waitForTimeout(200);
          await p.click("#aufnahme-fertig");
        }
      } else { ok = false; console.log(`    unbekannter Schritt ${r.typ}`); break; }
      // Warten, bis der nächste Schritt (oder das Ende) da ist – richtige Antworten blättern nach gut 2 s selbst weiter
      await p.waitForFunction((v) => !document.querySelector("#ende-ansicht").hidden || __deutsch.lauf.pos !== v, vorher, { timeout: 6000 });
    }
    const ende = await p.evaluate(() => !document.querySelector("#ende-ansicht").hidden && document.querySelectorAll("#ende-sterne span:not(.leer)").length);
    return { ok, sterne: ende };
  }

  // --- Prüfregeln ohne Browser-Klicks ---
  {
    const { ctx, p } = await kind("3", 1180, 820);
    const t = await p.evaluate(() => {
      const s = { woerter: 6, saetze: 2, pflicht: ["Ball"] };
      const offen = (txt) => __deutsch.pruefeText(txt, s).filter(x => !x.ok).map(x => x.id);
      return { gut: offen("Der Hund spielt mit dem Ball. Dann fliegt er weg!"), klein: offen("der Hund spielt mit dem Ball. dann fliegt er weg."),
        ohnePunkt: offen("Der Hund spielt mit dem Ball. Dann fliegt er weg"), kurz: offen("Ein Ball."), ohneWort: offen("Der Hund spielt im Garten. Dann rennt er weg.") };
    });
    erwarte(t.gut.length === 0, "Prüfung: guter Text hat keine offenen Punkte");
    erwarte(t.klein.join() === "gross", "Prüfung: kleiner Satzanfang wird bemerkt");
    erwarte(t.ohnePunkt.join() === "zeichen", "Prüfung: fehlendes Satzzeichen am Ende wird bemerkt");
    erwarte(t.kurz.includes("laenge") && t.kurz.includes("saetze"), "Prüfung: zu kurz und zu wenige Sätze");
    erwarte(t.ohneWort.join() === "w:Ball", "Prüfung: fehlendes Pflichtwort");
    await ctx.close();
  }

  // --- Sichtbarkeit je Klasse ---
  for (const [stufe, ids] of [["1", ["w-reime", "w-einladung"]], ["2", ["w-reime", "w-einladung", "w-bildergeschichte", "w-gedicht-vortragen"]], ["3", NEU]]) {
    const { ctx, p } = await kind(stufe, 1180, 820);
    const sichtbar = await p.evaluate(() => [...document.querySelectorAll("#werkstatt button.ort")].map(b => b.getAttribute("aria-label")));
    const namen = await p.evaluate((ids) => ids.map(id => WERKSTATT.find(k => k.id === id).name), NEU);
    const soll = NEU.map((id, i) => ids.includes(id) ? namen[i] : null);
    erwarte(soll.every((n, i) => n ? sichtbar.includes(n) : !sichtbar.includes(namen[i])), `Klasse ${stufe}: ${ids.length} neue Kapitel sichtbar`);
    await ctx.close();
  }

  // --- Klasse 3, quer: ohne Erlaubnis keine Aufnahme; echtes Tippen mit freundlichem Hinweis; Wortkarten; Text im Elternbereich ---
  {
    const { ctx, p } = await kind("3", 1180, 820);
    const daten = await p.evaluate(() => WERKSTATT.filter(k => k.id.startsWith("w-")).slice(-5).every(k => k.lz.length && k.schritte.every(s => s.ru)));
    erwarte(daten, "neue Kapitel mit Lernziel und russischem Entwurf in jedem Schritt");
    await starte(p, "w-bildergeschichte");
    const ohne = await p.evaluate(() => __deutsch.lauf.k.schritte.some(s => s.typ === "aufnehmen"));
    erwarte(!ohne, "ohne Eltern-Erlaubnis: Aufnahme-Schritt fällt still weg");
    const pos = await p.evaluate(() => __deutsch.lauf.k.schritte.findIndex(s => s.typ === "schreiben"));
    await p.evaluate((n) => __deutsch.schritt(n), pos);
    const att = await p.evaluate(() => { const f = document.querySelector("#schreibfeld"); return f.getAttribute("autocapitalize") === "off" && f.getAttribute("spellcheck") === "false"; });
    erwarte(att, "Schreibfeld ohne automatische Großschreibung und Korrektur (das Kind soll es selbst lernen)");
    await p.click("#schreibfeld");
    await p.locator("#schreibfeld").pressSequentially("bello spielt mit dem ", { delay: 5 });
    await p.click('.wk[data-w="Ball"]');
    const mitKarte = await p.inputValue("#schreibfeld");
    erwarte(/dem Ball $/.test(mitKarte), `Wortkarte fügt das Wort ein („${mitKarte.trim()}“)`);
    await p.locator("#schreibfeld").pressSequentially("im Garten. der Ball fliegt in den Baum. bello ist traurig. lina holt ihn mit der Leiter", { delay: 2 });
    const liste = await p.evaluate(() => [...document.querySelectorAll("#pruefliste li")].map(l => l.className));
    erwarte(liste.length === 6 && liste.filter(c => c === "ok").length === 4, "Prüfliste zeigt beim Tippen, was schon klappt (4 von 6)");
    await p.click("#pruefen");
    const tipp = await p.evaluate(() => ({ tipp: document.querySelector("#hinweis").className.includes("tipp"), text: document.querySelector("#hinweis").textContent, noch: !!document.querySelector("#pruefen"), fehler: __deutsch.lauf.fehler }));
    erwarte(tipp.tipp && tipp.noch && tipp.fehler === 0 && /groß/.test(tipp.text), `erster Versuch mit Fehlern: freundlicher Hinweis statt „falsch“, zählt nicht als Fehler („${tipp.text}“)`);
    await p.fill("#schreibfeld", "Bello spielt im Garten mit dem Ball. Der Ball fliegt in den Baum. Bello ist traurig. Lina holt ihn mit der Leiter.");
    await p.click("#pruefen"); await p.waitForSelector("#gespeichert");
    const gut = await p.evaluate(() => ({ gut: document.querySelector("#hinweis").className.includes("gut"), gesp: document.querySelector("#gespeichert").textContent }));
    erwarte(gut.gut && /Gespeichert/.test(gut.gesp), "verbesserter Text wird angenommen und gespeichert");
    if (BILDER) await p.screenshot({ path: `${BILDER}/schreiben-tipp-quer.png` });
    // Zweimal mit Fehlern: dann trotzdem angenommen, mit Tipp fürs nächste Mal
    await p.evaluate((n) => __deutsch.schritt(n), pos);
    await p.fill("#schreibfeld", "bello spielt mit dem Ball im Baum");
    await p.click("#pruefen"); await p.click("#pruefen");
    const zweit = await p.evaluate(() => ({ gut: document.querySelector("#hinweis").className.includes("gut"), text: document.querySelector("#hinweis").textContent, weiter: !!document.querySelector("#weiter") }));
    erwarte(zweit.gut && zweit.weiter && /nächste Mal/.test(zweit.text), "zweiter Versuch: angenommen mit Tipp fürs nächste Mal");
    // Ganze Kapitel ohne Aufnahme bis zum Ende
    for (const id of ["w-bildergeschichte", "w-buchtipp"]) {
      const r = await durchklicken(p, id, "quer", false);
      erwarte(r.ok && r.sterne === 3, `quer ohne Aufnahme: „${id}“ bis zum Ende, 3 Sterne`);
    }
    const texte = await p.evaluate(() => Eigenes.alle().then(l => l.filter(x => x.art === "text").map(x => x.text)));
    erwarte(texte.length === 4 && texte.some(t => t.startsWith("Bello spielt im Garten")), `Texte in der IndexedDB (${texte.length})`);
    const imSpielstand = await p.evaluate(() => JSON.stringify(Spielwelt.profil).includes("Bello spielt im Garten"));
    erwarte(!imSpielstand, "Texte stehen nicht im Spielstand (QR bleibt klein)");
    await zuEltern(p);
    const eltern = await p.evaluate(() => ({ texte: document.querySelectorAll("#eigene-texte li").length, toene: document.querySelector("#eigene-toene").textContent }));
    erwarte(eltern.texte === 4 && /Noch keine Aufnahmen/.test(eltern.toene), "Elternbereich zeigt die 4 Texte, noch keine Aufnahmen");
    await p.click("#eigene-texte [data-eigen-weg]"); await p.waitForTimeout(300);
    erwarte(await p.evaluate(() => document.querySelectorAll("#eigene-texte li").length === 3), "Eltern können einen Text löschen");
    if (BILDER) await p.locator("#deutsch-karte").screenshot({ path: `${BILDER}/schreiben-eltern.png` });
    await ctx.close();
  }

  // --- Mit Erlaubnis und Fake-Mikrofon: alle fünf Kapitel bis zum Ende, quer und hoch ---
  for (const [breite, hoehe, art] of [[1180, 820, "quer"], [390, 760, "hoch"]]) {
    const { ctx, p } = await kind("4", breite, hoehe);
    await erlaubeAufnahme(p, true);
    for (const id of art === "quer" ? NEU : ["w-reime", "w-bildergeschichte"]) {
      const r = await durchklicken(p, id, art, true);
      erwarte(r.ok && r.sterne === 3, `${art} mit Aufnahme: „${id}“ bis zum Ende, 3 Sterne, keine Scrollleiste`);
    }
    if (art === "quer") {
      const toene = await p.evaluate(() => Eigenes.alle().then(l => l.filter(x => x.art === "ton").map(x => ({ n: x.ton.byteLength, typ: x.typ, d: x.dauer }))));
      erwarte(toene.length === 4 && toene.every(t => t.n > 0 && /^audio\//.test(t.typ)), `4 Aufnahmen in der IndexedDB (${toene.map(t => t.typ + " " + t.n + " B").join(", ")})`);
      // Gedicht wird zeilenweise gezeigt
      await starte(p, "w-reime");
      await p.evaluate(() => __deutsch.schritt(__deutsch.lauf.k.schritte.findIndex(s => s.gedicht)));
      const ged = await p.evaluate(() => document.querySelectorAll(".gedicht span").length);
      erwarte(ged === 4, "Gedicht erscheint zeilenweise");
      await zuEltern(p);
      const audio = await p.evaluate(() => document.querySelectorAll("#eigene-toene audio").length);
      erwarte(audio === 4, "Elternbereich: 4 Aufnahmen zum Anhören");
      if (BILDER) await p.locator("#deutsch-karte").screenshot({ path: `${BILDER}/aufnehmen-eltern.png` });
    }
    await ctx.close();
  }

  // --- Erlaubt, aber Mikrofon verweigert: freundlich ohne Aufnahme weiter ---
  {
    const { ctx, p } = await kind("3", 1180, 820, true);
    await erlaubeAufnahme(p, true);
    const r = await durchklicken(p, "w-gedicht-vortragen", "ohne-mikro", "aus");
    erwarte(r.ok && r.sterne === 3, "Mikrofon verweigert: Hinweis, weiter ohne Aufnahme, Kapitel bis zum Ende");
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Schreiben-und-Sprechen-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
