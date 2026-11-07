// Test Übergang 5, zweiter Nachtrag (10.11.2026): „Brüche am Zahlenstrahl“ (auch unechte Brüche und Würfelstange) und „Schätzen und Überschlagen“
// (Überschlag, Fermi-Aufgaben) – je eine Runde echt über die Tasten durchgespielt, mit je einem Fehler (Lösungshilfe erscheint, 2 statt 3 Sterne),
// Bilder (Zahlenstrahl mit 0/1/2, Würfelstange) und quer/Handy ohne Scrollleiste; Urkunde bleibt mit den ursprünglichen Stationen erreichbar;
// Hilfesprache Russisch: russische Zeile unter der Frage. Aufruf: sh tests/laufen.sh mathe5b
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  async function kind(breite = 1180, hoehe = 820, sprache = "") {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "5");
    if (sprache) { await p.selectOption("#e-sprache", sprache); await p.selectOption("#e-dosis", "immer"); }   // russische Hilfe sichtbar (sonst „automatisch“ nach Deutschstand)
    await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    await p.goto(BASIS + "spiele/mathe/"); await p.waitForSelector("#karte .station");
    return { ctx, p };
  }
  const aufgabe = (p) => p.evaluate(() => { const x = __mathe.lauf.liste[__mathe.lauf.pos]; return { art: x.art, antwort: x.antwort, optionen: x.optionen, frage: x.frage, bild: x.bild || "", hilfe: x.hilfe }; });
  async function tippe(p, wert, art) {
    if (art === "wahl") {   // auf die Taste warten (nach einem Fehler werden die Tasten kurz danach neu gezeichnet; CI-Lauf 100 tippte zu früh)
      await p.waitForFunction((w) => [...document.querySelectorAll(".wahl-tasten .taste")].some(b => b.dataset.wert === w && !b.disabled), wert, { timeout: 15000 });
      await p.evaluate((w) => [...document.querySelectorAll(".wahl-tasten .taste")].find(b => b.dataset.wert === w && !b.disabled).click(), wert);
    }
    else { for (const z of wert) await p.click(`.taste[data-ziffer="${z}"]`); await p.click(".taste.ok"); }
  }
  // fehler: 0 = alles richtig, 1 = Aufgabe 3 einmal falsch (nur „Fast!“, zählt nicht), 2 = Aufgabe 3 zweimal falsch (Lösung mit Hilfe, kommt am Ende wieder, 2 ⭐)
  async function spiele(p, id, art, fehlerArt) {
    const nr = await p.evaluate((id) => Mathe.STATIONEN_K5.findIndex(s => s.id === id), id);
    await p.evaluate((n) => __mathe.starte(n), nr); await p.waitForTimeout(150);
    let passt = true, hinweis = "", loesung = "", schritte = 0; const fragen = [], bilder = [];
    while (await p.evaluate(() => document.getElementById("ende-ansicht").hidden) && schritte++ < 14) {
      // erst lesen, wenn die Tasten der aktuellen Aufgabe gezeichnet sind (CI-Lauf 114: auf dem langsamen Läufer war die Aufgabe schon weiter, die Tasten noch nicht)
      await p.waitForFunction(() => { if (!document.getElementById("ende-ansicht").hidden) return true; const x = __mathe.lauf.liste[__mathe.lauf.pos];
        return x.art === "wahl" ? [...document.querySelectorAll(".wahl-tasten .taste")].some(b => !b.disabled && x.optionen.includes(b.dataset.wert)) : !!document.querySelector(".taste.ok"); }, null, { timeout: 15000 });
      if (!(await p.evaluate(() => document.getElementById("ende-ansicht").hidden))) break;
      const a = await aufgabe(p), pos = await p.evaluate(() => __mathe.lauf.pos);
      if (pos < 10) { fragen.push(a.frage); bilder.push(a.bild); }
      if (!(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))) passt = false;
      if (pos === 0 && BILDER) await p.screenshot({ path: `${BILDER}/mathe5b-${id}-${art}.png` });
      if (fehlerArt && pos === 2) {
        const falsch = a.art === "wahl" ? a.optionen.filter(o => o !== a.antwort) : [String(+a.antwort + 1), String(+a.antwort + 2)];
        await tippe(p, falsch[0], a.art); await p.waitForTimeout(1300);
        hinweis = await p.evaluate(() => document.getElementById("rueck").textContent);
        if (fehlerArt === 2) {
          await tippe(p, falsch[1], a.art); await p.waitForTimeout(500);
          loesung = await p.evaluate(() => (document.querySelector("#hilfe-platz .hilfe") || {}).textContent || "");
          if (BILDER) await p.screenshot({ path: `${BILDER}/mathe5b-${id}-${art}-loesung.png` });
          await p.click("#weiter"); await p.waitForTimeout(400); continue;
        }
      }
      await tippe(p, a.antwort, a.art); await p.waitForTimeout(1050);
    }
    await p.waitForSelector("#ende-ansicht:not([hidden])", { timeout: 6000 });
    const sterne = await p.evaluate((id) => (Spielwelt.lade("mathe").k5 || {})[id], id);
    await p.click("text=Zum Matheweg"); await p.waitForTimeout(200);
    return { sterne, passt, hinweis, loesung, fragen, bilder };
  }

  for (const [breite, hoehe, art] of [[1180, 820, "quer"], [390, 760, "Handy"]]) {
    const { ctx, p } = await kind(breite, hoehe);
    const n = await p.evaluate(() => document.querySelectorAll("#karte .station:not(.ziel)").length);
    erwarte(n === 28, `${art}: Übergang 5 hat 28 Stationen (${n})`);
    const s = await spiele(p, "k5bruchstrahl", art, art === "quer" ? 2 : 0);
    erwarte(s.sterne === (art === "quer" ? 2 : 3) && s.passt, `${art}: „Brüche am Zahlenstrahl“ – Runde über die Tasten gelöst${art === "quer" ? " mit zwei Fehlern an einer Aufgabe (2 ⭐)" : " (3 ⭐)"}, keine Scrollleiste (${s.sterne}, ${s.passt})`);
    erwarte(new Set(s.fragen.map((f, i) => f + s.bilder[i])).size === 10, `${art}: 10 verschiedene Aufgaben`);
    erwarte(s.bilder.every(b => /Zahlenstrahl mit Bruchteilen|Würfelstange/.test(b)) && s.bilder.some(b => /Zahlenstrahl/.test(b)), `${art}: jede Aufgabe mit Bild (Zahlenstrahl oder Würfelstange)`);
    if (art === "quer") erwarte(/Fast/.test(s.hinweis) && /Die Lösung ist/.test(s.loesung) && /Teil|Würfel|Ganze/.test(s.loesung), `quer: erst „Fast!“, dann Lösung mit Erklärung (${s.loesung.slice(0, 90)})`);
    const t = await spiele(p, "k5schaetzen", art, art === "quer" ? 1 : 0);
    erwarte(t.sterne === 3 && t.passt, `${art}: „Schätzen und Überschlagen“ – Runde gelöst${art === "quer" ? ", ein einzelner Fehler kostet keinen Stern" : ""}, keine Scrollleiste (${t.sterne}, ${t.passt})`);
    if (art === "quer") erwarte(/Fast/.test(t.hinweis), "quer: nach dem ersten Fehler freundlich „Fast! Versuch es nochmal.“");
    erwarte(t.fragen.every(f => /etwa|ungefähr/i.test(f)), `${art}: jede Frage fragt nach einem Näherungswert`);
    await ctx.close();
  }

  // Aufgaben-Inhalte direkt geprüft (viele Saaten): unechte Brüche kommen vor, Distraktoren mit typischen Fehlern, gerundete Fermi-Antworten
  {
    const { ctx, p } = await kind();
    const r = await p.evaluate(() => { const st = Mathe.STATIONEN_K5.find(s => s.id === "k5bruchstrahl"), sc = Mathe.STATIONEN_K5.find(s => s.id === "k5schaetzen"), a = [], b = [];
      for (let i = 1; i <= 300; i++) { a.push(Mathe.aufgabe(st.id, i)); b.push(Mathe.aufgabe(sc.id, i)); }
      return { unecht: a.filter(x => /^Welchen Bruch/.test(x.frage) && (([z, n]) => +z > +n)(x.antwort.split("/"))).length,
        gemischt: a.filter(x => /gemischte Zahl/.test(x.frage) && /^\d \d+\/\d+$/.test(x.antwort)).length,
        striche: a.filter(x => /^Welchen Bruch/.test(x.frage)).every(x => { const [z, n] = x.antwort.split("/"); return x.optionen.includes(`${z}/${+n + 1}`); }),
        stange: a.filter(x => /Würfelstange/.test(x.frage)).length,
        rund: b.filter(x => / Wörter| Schritte| Becher| Stunde/.test(x.frage)).every(x => /^etwa [1-9]( |\s)?0*(\s?000)*$/.test(x.antwort.replace(/ | /g, " ")) || /^etwa [1-9]0*$/.test(x.antwort)),
        ueberschlag: b.filter(x => /kauft/.test(x.frage)).every(x => / €$/.test(x.antwort) && x.optionen.length >= 3) };
    });
    erwarte(r.unecht > 8 && r.gemischt > 20, `Zahlenstrahl: unechte Brüche (${r.unecht}) und gemischte Zahlen (${r.gemischt}) kommen vor`);
    erwarte(r.striche, "Zahlenstrahl: „Striche statt Teile gezählt“ steht immer als falsche Antwort da");
    erwarte(r.stange > 20, `Würfelstange (Anteil an einem Körper) kommt vor (${r.stange})`);
    erwarte(r.rund && r.ueberschlag, "Schätzen: Fermi-Antworten auf die erste Stelle gerundet, Überschlag in Euro");
    await ctx.close();
  }

  // Hilfesprache Russisch: russische Zeile unter der Frage
  {
    const { ctx, p } = await kind(1180, 820, "ru");
    const nr = await p.evaluate(() => Mathe.STATIONEN_K5.findIndex(s => s.id === "k5bruchstrahl"));
    await p.evaluate((n) => __mathe.starte(n), nr); await p.waitForTimeout(400);
    const ru = await p.evaluate(() => [...document.querySelectorAll(".hilfe-ru")].map(x => x.textContent).join(" | "));
    erwarte(/[а-яё]/i.test(ru), `Russisch: Hilfezeile unter der Frage (${ru.slice(0, 80)})`);
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Mathe-Übergang-5-Nachtrag-Test bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
