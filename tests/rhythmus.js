// Playwright-Test (05.11.2026): Paulas Rhythmus-Boot an der Ballon-Wiese (Kapitel 4 „Paulas Fest“) – zu bis Kapitel 4, eine ganze Fahrt
// echt gespielt: „Anhören“ antippen, im Rhythmus aufs Paddel tippen (eigenes Tempo), bei „Finden“ die passende Karte wählen; mit Fehlern
// (zu wenige Schläge, falsche Karte), Sterne nur für neue Rhythmen beim ersten Versuch und höchstens 3 am Tag; Stufen nach Klasse
// (Kl. 1 Punkte, ab Kl. 3 Notenzeichen und Ta-a), Prüfung ohne Taktzwang, Handy ohne Querscrollen, keine Konsolenfehler.
// Aufruf: sh tests/laufen.sh rhythmus   (Screenshots mit BILDER=<ordner>)
const { chromium } = require("playwright");
const BASIS = process.env.BASIS || "http://localhost:8799/";
const BILDER = process.env.BILDER || "";
const IGNORIEREN = /fonts\.g|ERR_TUNNEL|ERR_CONNECTION|net::ERR|Failed to load resource|open-meteo/;
process.on("unhandledRejection", (e) => { console.log("❌ Abbruch: " + e.message + "\n  " + (global.__fehler || []).join("\n  ")); process.exit(1); });

(async () => {
  const browser = await chromium.launch();
  const fehler = global.__fehler = [];
  const erwarte = (ok, text) => { if (!ok) fehler.push(text); else console.log("  ✓ " + text); };
  const bild = async (p, name) => { if (BILDER) await p.screenshot({ path: `${BILDER}/${name}.png` }); };
  async function kind(stufe, breite = 1180, hoehe = 820) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: true, serviceWorkers: "block" });
    await ctx.addInitScript(() => { window.__jetzt = new Date(2026, 9, 25, 15, 0).getTime(); window.__testSchnell = true; });
    const p = await ctx.newPage();
    p.on("pageerror", e => fehler.push(`Seitenfehler: ${e.message}`));
    p.on("console", m => { if (m.type() === "error" && !IGNORIEREN.test(m.text())) fehler.push(`Konsole: ${m.text()}`); });
    await p.goto(BASIS); await p.waitForURL(/eltern/); await p.waitForLoadState("load"); await p.waitForTimeout(300);
    await p.fill("#pin1", "1234"); await p.fill("#pin2", "1234"); await p.click("#pin-ok"); await p.waitForSelector("#e-name");
    await p.fill("#e-name", "Mira"); await p.selectOption("#e-stufe", stufe); await p.click("#e-ok"); await p.click("#uebergabe-los"); await p.waitForURL(u => !/eltern/.test(u.toString())); await p.waitForTimeout(300);
    return { ctx, p };
  }
  const boot = async (p) => { await p.goto(BASIS + "spiele/rhythmus/"); await p.waitForLoadState("load"); await p.waitForTimeout(300); };
  const anhoeren = async (p) => { await p.click("#anhoeren"); await p.waitForFunction(() => !document.getElementById("anhoeren").disabled, null, { timeout: 5000 }); };
  // im Rhythmus aufs Paddel tippen: Einsätze (in Schlägen) × eigenes Tempo, echte Maus-Klicks auf den Knopf
  const paddle = async (p, einsaetze, tempo = 450) => {
    const k = await p.locator("#paddel").boundingBox(), x = k.x + k.width / 2, y = k.y + k.height / 2, t0 = Date.now();
    for (const e of einsaetze) { const warte = t0 + e * tempo - Date.now(); if (warte > 0) await p.waitForTimeout(warte); await p.mouse.click(x, y); }
  };
  const naechster = (p, pos) => p.waitForFunction((pos) => __rhythmus.lauf.pos > pos || !document.getElementById("ende").hidden, pos, { timeout: 8000 });
  const hinweis = (p) => p.evaluate(() => ({ k: document.getElementById("hinweis").className, t: document.getElementById("hinweis").textContent }));

  // ---------- Klasse 2 (Stufe b) ----------
  { const { ctx, p } = await kind("2");
    await boot(p);
    erwarte(await p.isVisible("#zu") && !(await p.isVisible("#paddel")), "vor Kapitel 4 ist das Boot zu");
    await p.evaluate(() => Story.setzeKapitel(4)); await boot(p);
    const st = await p.evaluate(() => ({ stufe: __rhythmus.stufe(), liste: __rhythmus.lauf.liste.slice(), n: __rhythmus.RUNDE }));
    erwarte(st.stufe === "b" && st.liste.length === 6, `Kl. 2: Stufe b, eine Fahrt mit 6 Rhythmen (${st.liste.join(" | ")})`);
    erwarte(st.liste.some(r => r.includes("sch")) && !st.liste.some(r => r.includes("taa")), "Stufe b übt Pausen (sch), aber noch kein Ta-a");
    const sterne0 = await p.evaluate(() => Spielwelt.sterne());
    await bild(p, "rhythmus-start");
    // 1) Echo, gleich richtig (Kind paddelt langsamer als Paula – das Tempo ist egal)
    erwarte(await p.isDisabled("#paddel"), "Paddel ist zu, bis Paula vorgespielt hat");
    await anhoeren(p);
    erwarte(!(await p.isDisabled("#paddel")), "nach „Anhören“: Paddel bereit");
    await paddle(p, await p.evaluate(() => __rhythmus.einsaetze(__rhythmus.lauf.liste[0])), 520);
    await naechster(p, 0);
    erwarte((await p.evaluate(() => Spielwelt.sterne())) === sterne0 + 1, "Echo 1 im eigenen Tempo richtig gepaddelt: +1 ⭐ (neuer Rhythmus)");
    // 2) Finden: erst falsche Karte, dann richtige
    await p.waitForSelector("#wahl"); await bild(p, "rhythmus-finden");
    erwarte(await p.evaluate(() => [...document.querySelectorAll(".wahl-karte")].every(k => k.disabled)), "Finden: Karten erst nach dem Anhören wählbar");
    await anhoeren(p);
    const r2 = await p.evaluate(() => __rhythmus.lauf.liste[1]);
    await p.click(`.wahl-karte:not([data-r="${r2}"]) >> nth=0`); await p.waitForTimeout(150);
    erwarte((await hinweis(p)).k.includes("nein"), "falsche Karte: freundlicher Hinweis");
    await p.click(`.wahl-karte[data-r="${r2}"]`); await naechster(p, 1);
    erwarte((await p.evaluate(() => Spielwelt.sterne())) === sterne0 + 1, "richtige Karte im zweiten Versuch: kein Stern");
    // 3) Echo mit zu wenigen Schlägen, dann richtig
    await anhoeren(p);
    const e3 = await p.evaluate(() => __rhythmus.einsaetze(__rhythmus.lauf.liste[2]));
    await paddle(p, e3.slice(0, -1), 450);
    await p.waitForFunction(() => document.getElementById("hinweis").className.includes("nein"), null, { timeout: 5000 });
    erwarte(/fehlt noch ein Schlag/.test((await hinweis(p)).t), "zu wenige Schläge: „Da fehlt noch ein Schlag“");
    await bild(p, "rhythmus-fehler");
    await anhoeren(p); await paddle(p, e3, 400); await naechster(p, 2);
    // 4)–6) alles gleich richtig: Stern 2 und 3, dann ist für heute Schluss mit Sternen
    for (let i = 3; i < 6; i++) {
      await anhoeren(p);
      const r = await p.evaluate(() => __rhythmus.lauf.liste[__rhythmus.lauf.pos]);
      if (i % 2 === 0) await paddle(p, await p.evaluate((r) => __rhythmus.einsaetze(r), r), 380);
      else await p.click(`.wahl-karte[data-r="${r}"]`);
      await naechster(p, i);
    }
    await p.waitForSelector("#ende:not([hidden])");
    const ende = await p.evaluate(() => ({ t: document.getElementById("ende").textContent, d: Spielwelt.lade("rhythmus"), s: Spielwelt.sterne() }));
    erwarte(ende.s === sterne0 + 3 && Object.keys(ende.d.geschafft).length === 4 && ende.d.runden === 1, `Fahrt beendet: genau 3 ⭐ (höchstens 3 am Tag), 4 Rhythmen beim ersten Versuch geschafft, 1 Fahrt`);
    erwarte(/Angekommen/.test(ende.t) && /4 von 6/.test(ende.t), "Ende: „Angekommen!“, 4 von 6 gleich richtig");
    await bild(p, "rhythmus-ende");
    // Zweite Fahrt: neue Rhythmen zuerst, keine Sterne mehr heute
    await p.click("#nochmal"); await p.waitForTimeout(200);
    const zweite = await p.evaluate(() => __rhythmus.lauf.liste);
    erwarte(!ende.d.geschafft[zweite[0]] && zweite.slice(0, 2).join() === [st.liste[1], st.liste[2]].join(), "zweite Fahrt beginnt mit den Rhythmen, die beim ersten Mal noch nicht klappten");
    // Prüfung ohne Taktzwang (Einheiten-Test im Browser)
    const pr = await p.evaluate(() => [__rhythmus.pruefe("ta ti ti ta", [0, 800, 1200, 1600, 2000, 2400]).ok, __rhythmus.pruefe("ta ti ti ta", [0, 500, 1000, 1500, 2000, 2500]).ok,
      __rhythmus.pruefe("ta ta ta ta", [0, 100, 200, 300]).ok, __rhythmus.pruefe("ta sch ta ta", [0, 1000, 1500]).ok]);
    erwarte(pr.join() === "true,false,false,true", "Prüfung: Tempo egal, aber Ti-ti muss schneller sein; zu hektisch zählt nicht; Pause wird erkannt");
    await ctx.close(); }

  // ---------- Klasse 1 (Punkte) und Klasse 3 (Noten, Ta-a), Handy ----------
  for (const [stufe, breite, hoehe, art] of [["1", 1180, 820, "Kl. 1 quer"], ["3", 820, 1180, "Kl. 3 hoch"], ["3", 390, 760, "Kl. 3 Handy"]]) {
    const { ctx, p } = await kind(stufe, breite, hoehe);
    await p.evaluate(() => Story.setzeKapitel(4)); await boot(p);
    const s = await p.evaluate(() => ({ stufe: __rhythmus.stufe(), noten: document.querySelectorAll("#vorlage .note svg").length, punkte: document.querySelectorAll("#vorlage .punkte i").length,
      taa: __rhythmus.lauf.liste.some(r => r.includes("taa")), w: document.documentElement.scrollWidth, iw: innerWidth }));
    if (stufe === "1") erwarte(s.stufe === "a" && s.punkte > 0 && !s.noten && !s.taa, `${art}: Stufe a mit Punkten statt Noten, ohne Ta-a`);
    else erwarte(s.stufe === "c" && s.noten > 0 && s.taa, `${art}: Stufe c mit Notenzeichen und Ta-a`);
    erwarte(s.w <= s.iw + 1, `${art}: keine waagerechte Scrollleiste`);
    await anhoeren(p); await paddle(p, await p.evaluate(() => __rhythmus.einsaetze(__rhythmus.lauf.liste[0])), 450); await naechster(p, 0);
    erwarte(true, `${art}: erster Rhythmus echt gepaddelt`);
    await bild(p, `rhythmus-${art.replace(/[ .]/g, "-")}`);
    await ctx.close();
  }
  await browser.close();
  if (fehler.length) { console.log("❌ Fehler:\n" + fehler.map(f => "  - " + f).join("\n")); process.exit(1); }
  console.log("✅ Rhythmus-Boot-Test bestanden.");
})();
