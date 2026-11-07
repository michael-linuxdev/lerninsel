// Test Mein Tier (spiele/tier/): „Erst lernen, dann spielen“ sperrt die Seite, Ei aussuchen (erst ablehnen, dann wählen),
// über drei Tage wärmen (einmal am Tag selbst, zweites Antippen bleibt ohne Wirkung, Tagesaufgabe wärmt mit), schlüpfen,
// Namen mit HTML-Zeichen eintippen (wird gesäubert), umbenennen per Vorschlag, streicheln, füttern bis „Füttern (0)“, spielen,
// Zubehör (zu wenig Sterne → nichts gekauft; kaufen, ausziehen, anziehen), am nächsten Tag Leckerli aus einer Lernrunde und
// Wachsen zur Stufe „Junghund“ (Hund statt Fuchs seit 02.11.2026, alter Fuchs wird Hund). Daten werden in Spielwelt.lade("tier") geprüft. Keine Konsolenfehler, keine waagerechte Scrollleiste.
// Die Uhr wird über localStorage "__testJetzt" gesetzt (wie tests/tutorial.js), damit der Test Tage vorstellen kann.
// Aufruf: sh tests/laufen.sh tier
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource/;
const TAG = (n) => new Date(2026, 9, 25 + n, 15, 0).getTime();

(async () => {
  const browser = await chromium.launch();
  const fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const passt = (p) => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  async function kind(breite, hoehe) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true });
    await ctx.addInitScript((t) => { let x = null; try { x = localStorage.getItem("__testJetzt"); } catch (e) { /* egal */ } window.__jetzt = x ? +x : t; }, TAG(0));
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`${p.url()}: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`${p.url()}: ${m.text()}`); });
    p.on("dialog", d => d.accept());   // confirm() beim Zubehör-Kauf
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok");
    await p.waitForSelector("#e-name"); await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", "3");
    await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString()));
    return { ctx, p };
  }
  const tier = (p) => p.evaluate(() => Spielwelt.lade("tier") || {});
  const tag = async (p, n) => { await p.evaluate((t) => localStorage.setItem("__testJetzt", String(t)), TAG(n)); await p.reload(); await p.waitForTimeout(400); };

  // ---------- iPad quer: der ganze Weg ----------
  {
    const { ctx, p } = await kind(1180, 820);
    await p.goto(BASIS + "spiele/tier/"); await p.waitForTimeout(500);
    erwarte(await p.evaluate(() => { const o = document.getElementById("zeit-overlay"); return !!o && /Erst lernen/.test(o.textContent); }), "ohne Lernen: Sperre „Erst lernen, dann spielen“");
    // genug gelernt → Seite frei; danach schalten die Eltern die Zeitregeln aus, damit der Test über mehrere Tage läuft
    await p.evaluate(() => { const d = Zeit.heute(); d.aufgaben += 20; Spielwelt.speichere("zeit", d); });
    await p.reload(); await p.waitForTimeout(400);
    erwarte(await p.evaluate(() => !document.getElementById("zeit-overlay")), "nach 20 gelösten Aufgaben ist die Seite frei");
    await p.evaluate(() => { const e = Spielwelt.lade("eltern") || {}; e.zeit = Object.assign({}, e.zeit, { an: false }); Spielwelt.speichere("eltern", e); });

    // Ei aussuchen
    const eier = await p.evaluate(() => ({ n: document.querySelectorAll("#eier [data-ei]").length, soll: Object.keys(Tiere.EIER).length, sichtbar: !document.getElementById("wahl-ansicht").hidden }));
    erwarte(eier.sichtbar && eier.n === eier.soll && eier.n >= 3, `Ei-Auswahl zeigt alle ${eier.n} Eier`);
    await p.click('[data-ei="feuer"]'); await p.waitForSelector("#dialog:not([hidden])");
    await p.click("#nein"); await p.waitForTimeout(150);
    erwarte(await p.evaluate(() => document.getElementById("dialog").hidden && !document.getElementById("wahl-ansicht").hidden) && !(await tier(p)).phase, "„Lieber nochmal schauen“ schließt den Dialog, kein Ei gewählt");
    await p.click('[data-ei="wald"]'); await p.waitForSelector("#dialog:not([hidden])");
    await p.click("#ja"); await p.waitForTimeout(200);
    let d = await tier(p);
    erwarte(d.phase === "ei" && d.ei === "wald" && d.waerme === 0 && await p.evaluate(() => !document.getElementById("ei-ansicht").hidden && /Pfoten-Ei/.test(document.getElementById("titel").textContent)), "Pfoten-Ei gewählt, Ei-Ansicht mit Titel");

    // Tag 1: einmal wärmen, zweites Mal geht nicht
    await p.click("#ei-bild"); await p.waitForTimeout(200);
    d = await tier(p);
    erwarte(d.waerme === 1 && d.eiGewaermt === "2026-10-25" && await p.locator("#waerme span.an").count() === 1, "Tag 1: Antippen wärmt das Ei (1 von 3 🔥)");
    await p.click("#ei-bild"); await p.waitForTimeout(200);
    d = await tier(p);
    erwarte(d.waerme === 1 && await p.evaluate(() => /schon gewärmt/.test((document.getElementById("meldung") || {}).textContent || "")), "Tag 1: zweites Antippen wärmt nicht, freundlicher Hinweis");
    if (BILDER) await p.screenshot({ path: `${BILDER}/tier-ei.png` });

    // Tag 2: selbst wärmen + Tagesaufgabe wärmt mit
    await tag(p, 1);
    erwarte(await p.evaluate(() => /Tippe auf das Ei/.test(document.getElementById("ei-text").textContent)), "Tag 2: das Ei darf wieder gewärmt werden");
    await p.click("#ei-bild"); await p.waitForTimeout(200);
    erwarte((await tier(p)).waerme === 2, "Tag 2: Antippen wärmt (2 von 3)");
    await p.evaluate(() => Charakter.ereignis("training-fertig"));   // Tagesaufgabe Mathe-Training geschafft
    await p.reload(); await p.waitForTimeout(400);
    d = await tier(p);
    erwarte(d.waerme === 3 && await p.locator("#waerme span.an").count() === 3 && await p.evaluate(() => /ganz warm/.test(document.getElementById("ei-text").textContent)), "Tagesaufgabe wärmt das Ei mit (3 von 3), „Das Ei ist ganz warm“");

    // Schlüpfen: viermal antippen
    for (let i = 0; i < 3; i++) { await p.click("#ei-bild"); await p.waitForTimeout(120); }
    erwarte(await p.evaluate(() => /knackt/.test(document.getElementById("ei-text").textContent)) && (await tier(p)).phase === "ei", "Ei knackt nach dem Antippen, noch nicht geschlüpft");
    await p.click("#ei-bild"); await p.waitForSelector("#name-feld");
    d = await tier(p);
    erwarte(d.phase === "tier" && d.art === "hund" && d.geschluepft === "2026-10-26" && await p.evaluate(() => /Hund/i.test(document.querySelector("#dkarte h2").textContent)), "geschlüpft: ein Hund (Datum gemerkt), Namensdialog offen");
    if (BILDER) await p.screenshot({ path: `${BILDER}/tier-geschluepft.png` });
    await p.click("#name-ok"); await p.waitForTimeout(150);
    erwarte(await p.evaluate(() => !document.getElementById("dialog").hidden) && !(await tier(p)).name, "ohne Namen bleibt der Dialog offen");
    await p.locator("#name-feld").pressSequentially('<b>Fips</b>"&');
    await p.click("#name-ok"); await p.waitForTimeout(250);
    d = await tier(p);
    const titel = await p.evaluate(() => ({ t: document.getElementById("titel").textContent, n: document.getElementById("tier-name").textContent, b: document.querySelectorAll("#titel b, #tier-name b, #tier-text b").length }));
    erwarte(d.name === "bFips/b" && titel.t === "bFips/b" && titel.n === "bFips/b" && titel.b === 0, `Name mit HTML-Zeichen gesäubert gespeichert und angezeigt („${d.name}“)`);
    await p.click("#umbenennen"); await p.waitForSelector("#name-feld");
    await p.click('[data-n="Lotte"]'); await p.click("#name-ok"); await p.waitForTimeout(250);
    erwarte((await tier(p)).name === "Lotte" && await p.evaluate(() => document.getElementById("titel").textContent === "Lotte"), "umbenannt per Vorschlag: Lotte");

    // Streicheln (Freundschaft nur einmal am Tag)
    d = await tier(p); const fs0 = d.freundschaft;
    await p.click("#tier-bild"); await p.waitForTimeout(250);
    await p.click("#tier-bild"); await p.waitForTimeout(250);
    erwarte((await tier(p)).freundschaft === fs0 + 1, "Streicheln: +1 Freundschaft, nur einmal am Tag");
    // Füttern bis keine Leckerli mehr da sind
    d = await tier(p);
    erwarte(d.leckerli === 3 && await p.evaluate(() => document.getElementById("leckerli").textContent === "Füttern (3)"), "3 Leckerli zum Start");
    for (let i = 0; i < 3; i++) { await p.click("#fuettern"); await p.waitForTimeout(900); }
    d = await tier(p);
    erwarte(d.leckerli === 0 && d.freundschaft === fs0 + 10 && d.satt === 100 && await p.evaluate(() => document.getElementById("fuettern").disabled && document.getElementById("leckerli").textContent === "Füttern (0)"), "dreimal gefüttert: satt, +9 Freundschaft, Knopf „Füttern (0)“ gesperrt");
    // Spielen (Freundschaft dreimal am Tag)
    for (let i = 0; i < 4; i++) { await p.click("#spielen"); await p.waitForTimeout(950); }
    d = await tier(p);
    erwarte(d.freundschaft === fs0 + 16 && d.heute.spiel === 3 && d.freude === 100, `viermal gespielt: Freude voll, Freundschaft nur dreimal (+6) → ${d.freundschaft}`);
    erwarte(await p.evaluate(() => /Noch \d+ bis „Junghund“/.test(document.getElementById("werte").textContent)), "Freundschafts-Balken zeigt, wie viel bis „Junghund“ fehlt");

    // Zubehör: zu wenig Sterne, dann kaufen, aus- und anziehen
    await p.evaluate(() => Spielwelt.gibSterne(1 - Spielwelt.sterne()));
    await p.click("#zubehoer-auf"); await p.waitForSelector("#zb-zu");
    erwarte(await p.locator("#dkarte [data-z]").count() === await p.evaluate(() => Tiere.ZUBEHOER.length), "Zubehör-Dialog zeigt alle Teile mit Vorschau");
    await p.click('[data-z="krone"]'); await p.waitForTimeout(200);
    d = await tier(p);
    erwarte(!d.besitz.krone && await p.evaluate(() => Spielwelt.sterne() === 1 && /brauchst du 4 Sterne/.test((document.getElementById("meldung") || {}).textContent || "")), "Krone mit 1 ⭐: nicht gekauft, Hinweis wie viele fehlen");
    await p.evaluate(() => Spielwelt.gibSterne(9));   // 10 ⭐
    await p.click('[data-z="schleife"]'); await p.waitForTimeout(250);
    d = await tier(p);
    erwarte(d.besitz.schleife && d.traegt.schleife && await p.evaluate(() => Spielwelt.sterne() === 8 && /trägt es/.test(document.querySelector('[data-z="schleife"]').textContent)), "Schleife für 2 ⭐ gekauft und angezogen (10 → 8 ⭐)");
    await p.click('[data-z="schleife"]'); await p.waitForTimeout(200);
    erwarte(!(await tier(p)).traegt.schleife && await p.evaluate(() => /ausgezogen/.test(document.querySelector('[data-z="schleife"]').textContent) && Spielwelt.sterne() === 8), "nochmal antippen: ausgezogen, kostet nichts");
    await p.click('[data-z="schleife"]'); await p.waitForTimeout(200);
    erwarte((await tier(p)).traegt.schleife === true, "nochmal antippen: wieder angezogen");
    if (BILDER) await p.screenshot({ path: `${BILDER}/tier-zubehoer.png` });
    await p.click("#zb-zu"); await p.waitForTimeout(200);
    erwarte(await p.evaluate(() => document.getElementById("dialog").hidden) && await passt(p), "Zubehör-Dialog geschlossen, keine Scrollleiste");

    // Tag 3: Leckerli aus einer Lernrunde, Freundschaft wächst → Stufe „Kind“
    await tag(p, 2);
    await p.evaluate(() => Charakter.ereignis("mathe-runde"));   // eine Station auf dem Matheweg geschafft → +1 Leckerli
    await p.reload(); await p.waitForTimeout(400);
    d = await tier(p);
    erwarte(d.leckerli === 1 && d.heute.datum === "2026-10-27" && d.heute.fs === 0 && await p.evaluate(() => !document.getElementById("fuettern").disabled), "Tag 3: Lernrunde bringt 1 Leckerli, Tageszähler neu");
    await p.click("#tier-bild"); await p.waitForTimeout(250);
    for (let i = 0; i < 3; i++) { await p.click("#spielen"); await p.waitForTimeout(950); }
    erwarte(await p.evaluate(() => TierPflege.stufe(TierPflege.lade()) === 0), "vor dem Füttern noch Baby");
    await p.click("#fuettern");
    await p.waitForFunction(() => /gewachsen/.test((document.querySelector("#dialog:not([hidden]) h2") || {}).textContent || ""), null, { timeout: 5000 });
    d = await tier(p);
    erwarte(d.freundschaft >= 25 && await p.evaluate(() => /Lotte ist gewachsen/.test(document.querySelector("#dkarte h2").textContent) && /Junghund/.test(document.querySelector("#dkarte").textContent)), `Freundschaft ${d.freundschaft}: „Lotte ist gewachsen!“ – jetzt Junghund`);
    if (BILDER) await p.screenshot({ path: `${BILDER}/tier-gewachsen.png` });
    await p.click("#ok"); await p.waitForTimeout(250);
    erwarte(await p.evaluate(() => document.getElementById("dialog").hidden && /Hund, Junghund/.test(document.getElementById("tier-stufe").textContent)), "Namensschild zeigt „Hund, Junghund“");
    // Alter Spielstand mit Fuchs (vor 02.11.2026) wird zum Hund, Name und Freundschaft bleiben
    const alt = await p.evaluate(() => { const t = Spielwelt.lade("tier"); t.art = "fuchs"; Spielwelt.speichere("tier", t); const n = TierPflege.lade(); return { art: n.art, name: n.name, fs: n.freundschaft, bild: /tier-kopf/.test(Tiere.zeichneTier({ art: "fuchs" })) }; });
    erwarte(alt.art === "hund" && alt.name === "Lotte" && alt.fs >= 25 && alt.bild, "alter Fuchs wird zum Hund (Name und Freundschaft bleiben)");
    // Neue Zeichnung (03.11.2026, Entwurf A) ist Standard; der Eltern-Schalter „Zeichnungen wie bis 02.11.2026“ – echt angetippt – zeigt die alte
    const zeichnung = () => p.evaluate(() => { const h = document.getElementById("tier-bild").innerHTML; return { neu: /clipPath/.test(h) && /tier-kopf/.test(h), alt: /class="augen"/.test(h) }; });
    await p.goto(BASIS + "spiele/tier/"); await p.waitForTimeout(400);
    let z = await zeichnung();
    erwarte(z.neu && !z.alt, "Mein Tier: neue Zeichnung (Dreiviertelansicht mit Schattenstufen) ist Standard");
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(400);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForSelector(".eltern-reiter"); }
    for (const t of ["zeit", "kinder", "ueberblick", "schule", "lernstand"]) { if (await p.isVisible("#alte-zeichnung")) break; await p.click(`.eltern-reiter [data-teil="${t}"]`); await p.waitForTimeout(200); }
    await p.check("#alte-zeichnung"); await p.waitForTimeout(200);
    await p.goto(BASIS + "spiele/tier/"); await p.waitForTimeout(400);
    z = await zeichnung();
    erwarte(z.alt && !z.neu, "Eltern-Schalter „Zeichnungen wie bis 02.11.2026“: Tier wieder in der alten Zeichnung");
    await p.goto(BASIS + "spiele/eltern/"); await p.waitForTimeout(400);
    if (await p.$("#pin1")) { await p.fill("#pin1", "1234"); await p.click("#pin-ok"); await p.waitForSelector(".eltern-reiter"); }
    for (const t of ["zeit", "kinder", "ueberblick", "schule", "lernstand"]) { if (await p.isVisible("#alte-zeichnung")) break; await p.click(`.eltern-reiter [data-teil="${t}"]`); await p.waitForTimeout(200); }
    await p.uncheck("#alte-zeichnung"); await p.waitForTimeout(200);
    await ctx.close();
  }

  // ---------- Handy hoch: Ei-Auswahl und Tier passen ohne Scrollleiste ----------
  {
    const { ctx, p } = await kind(390, 760);
    await p.evaluate(() => { const e = Spielwelt.lade("eltern") || {}; e.zeit = Object.assign({}, e.zeit, { an: false }); Spielwelt.speichere("eltern", e); });
    await p.goto(BASIS + "spiele/tier/"); await p.waitForTimeout(500);
    erwarte(await passt(p), "Handy: Ei-Auswahl ohne Scrollleiste");
    await p.click('[data-ei="kuschel"]'); await p.click("#ja"); await p.waitForTimeout(200);
    await p.click("#ei-bild"); await tag(p, 1); await p.click("#ei-bild"); await tag(p, 2); await p.click("#ei-bild"); await p.waitForTimeout(200);
    for (let i = 0; i < 4; i++) { await p.click("#ei-bild"); await p.waitForTimeout(120); }
    await p.waitForSelector("#name-feld");
    await p.click('[data-n="Mimi"]'); await p.click("#name-ok"); await p.waitForTimeout(250);
    const d = await tier(p);
    erwarte(d.art === "katze" && d.name === "Mimi" && await passt(p), "Handy: Kuschel-Ei über drei Tage gewärmt, Katze „Mimi“ geschlüpft, keine Scrollleiste");
    if (BILDER) await p.screenshot({ path: `${BILDER}/tier-handy.png` });
    await ctx.close();
  }

  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Tier-Test (Ei, Wärmen über Tage, Schlüpfen, Name, Pflege, Zubehör, Wachsen) bestanden.");
})().catch(err => { console.error(err); process.exit(1); });
